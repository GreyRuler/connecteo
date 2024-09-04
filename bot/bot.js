const config = require('./config/index.json')

const {
    Telegraf, Markup, Scenes
} = require('telegraf')

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { fork } = require('child_process')
const { promisify } = require('util')
const LocalSession = require('telegraf-session-local')
const feedbackScene = require('./scenes/feedbackScene')
const uploadScene = require('./scenes/uploadScene')

const {
    userExists,
    setUser,
    getSubscribers,
    getStartParams,
    sendSms,
    sendDataToMainServer,
    getKonkurses,
    setKonkurs,
    checkParticipation
} = require('./requests')

const { Stage } = Scenes
const stage = new Stage([
    feedbackScene, uploadScene
])

const localSession = new LocalSession({ database: 'sessions.json' })

const port = config.BOT.PORT
const sleep = promisify(setTimeout)
const app = express()

app.use(cors())
app.use(bodyParser.json())

const bot = new Telegraf(config.BOT.TOKEN)

bot.use(localSession.middleware())
bot.use(stage.middleware())

app.post('/api/send-message', async (req, res) => {
    const { message, imageLink, chatIds, buttons } = req.body

    if ((!message) || (!chatIds)) {
        return res.status(400).json({ success: false, message: 'Invalid input. Either message and chatIds array are required.' })
    }

    try {
        let successCount = 0
        let errorCount = 0

        for (const chatId of chatIds) {
            try {
                if (imageLink) {
                    await bot.telegram.sendPhoto(chatId, imageLink, {
                        caption: message,
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [buttons],
                        },
                    })
                } else {
                    await bot.telegram.sendMessage(chatId, message, {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [buttons],
                        },
                    })
                }

                successCount++

            } catch (error) {
                console.error(`Error sending message to user ${username}:`, error)
                errorCount++
            }
        }

        res.status(200).json({ success: true, message: `Message sent successfully to ${successCount} users. ${errorCount} errors occurred.` })
    } catch (error) {
        console.error('Error sending message:', error)
        res.status(500).json({ success: false, message: 'Failed to send message' })
    }
})

app.post('/notify', async (req, res) => {
    const data = req.body
    if (data.event === 'entry.publish' && data.model === 'subscriber') {
        const chat_id = data.entry.chatId
        const status = data.entry.status

        let reply

        if (status === 'rejected') {
            reply = 'Описание вашей карточки для нетворкинга не подходит под рамки концепции представления себя  другим участникам нетворкинга. Просьба рассказать о вашем опыте и компании так, как это представлено в примере над формой заполнения страницы нетворкинга. Будем рады видеть вас участником нашего сообщества.'
        }

        if (status === 'adopted') {
            reply = 'Ваша анкета была успешно опубликована!'
        }

        try {
            await bot.telegram.sendMessage(chat_id, reply)
        } catch (ex) {
            console.log('notify error')
        }
    }

    res.status(200)
})

app.post('/api/send-sticker', async (req, res) => {
    const { stickerId, chatId } = req.body

    if ((!stickerId) || (!chatId)) {
        return res.status(400).json({ success: false, message: 'Invalid input. Either stickerId and chatId array are required.' })
    }

    try {
        await bot.telegram.sendSticker(chatId, stickerId)
        res.status(200).json({ success: true, message: `Sticker sent successfully to ${chatId} user.` })
    } catch (ex) {
        res.status(500).json({ success: false, message: 'Failed to send sticker' })
    }
})

app.post('/api/registration', async (req, res) => {
    const { data } = req.body

    if ((!data)) {
        return res.status(400).json({ success: false, message: 'Invalid input. Either data are required.' })
    }

    try {
        const sended = await sendDataToMainServer(data)
        console.log(sended)
        res.status(200).json({ success: true, message: `Success!` })
    } catch (ex) {
        console.log(ex)
        res.status(500).json({ success: false, message: 'Failed to registration!' })
    }
})

app.post('/api/send-sms', async (req, res) => {
    const { phone, message } = req.body

    if ((!phone) || (!message)) {
        return res.status(400).json({ success: false, message: 'Invalid input. Either phone and message are required.' })
    }

    try {
        const sms = await sendSms(phone, message)
        console.log(sms)

        res.status(200).json({ success: true, message: `Sms sended to ${phone}.` })
    } catch (ex) {
        res.status(500).json({ success: false, message: 'Failed to send sticker' })
    }
})

async function sendMessages(message, users) {
    let sendStatus = 0
    let successSendCount = 0

    await Promise.all(users.map(async (user) => {
        try {
            await bot.telegram.copyMessage(user.attributes.chatId, message.chat.id, message.message_id)
            successSendCount++
        } catch (error) {
            console.error('Failed to send message to user:', user.attributes.chatId, error.message)
            setUser(user.id, { blocked: true })
        }

        sendStatus++

        if (sendStatus % 5 === 0) {
            console.log(`Sent ${sendStatus} messages`)
        }
    }))

    return { sendStatus, successSendCount }
}

bot.use(async (ctx, next) => {
    const initData = await userExists(ctx)
    ctx.userData = initData
    next()
})

bot.on('callback_query', async (ctx) => {
    if (ctx.callbackQuery.data === 'uploadPhoto') {
        ctx.scene.enter('UPLOAD_SCENE')
    }

    if (/^takeKonkurs-\d+$/.test(ctx.callbackQuery.data)) {
        const [konkurs, number] = ctx.callbackQuery.data.split('-')

        const part = await checkParticipation(number, ctx.userData.id)
        if (part.meta.pagination.total > 0) {
            await ctx.answerCbQuery('Вы уже зарегистрированы!')
        } else {
            setKonkurs(number, {
                users: {
                    connect: [
                        { id: ctx.userData.id, position: { end: true } },
                    ]
                }
            })

            await ctx.reply('Поздравляем, вы зарегистрированы в розыгрыше. Не забудьте выполнить все условия конкурса!')
            await ctx.answerCbQuery()
        }
    }
})

bot.start(async (ctx) => {
    try {
        const { data: { attributes: { startMessage: { data: { attributes: reply } } } } } = await getStartParams()

        const buttons = reply.buttons?.data
        const photo = reply.photo.data?.attributes?.url

        let extra = {
            parse_mode: 'HTML',
            disable_web_page_preview: true,
            reply_markup: {}
        }

        if (buttons && buttons.length > 0) {
            const inlineKeyboard = []

            buttons.forEach(button => {
                if (button.attributes.type === 'url') {
                    inlineKeyboard.push([Markup.button.url(button.attributes.title, button.attributes.data)])
                } else if (button.attributes.type === 'webApp') {
                    inlineKeyboard.push([Markup.button.webApp(button.attributes.title, button.attributes.data)])
                }
            })

            extra.reply_markup.inline_keyboard = inlineKeyboard
        }

        if (photo) {
            await ctx.replyWithPhoto({ url: 'https://' + config.API.HOST + '.' + config.DOMAIN + photo }, { caption: reply.text, ...extra })
        } else {
            await ctx.reply(reply.text, extra)
        }
    } catch (error) {
        console.error(error)
    }
})

bot.command('konkurs', async (ctx) => {
    try {
        const { data: konkurses } = await getKonkurses()

        if (konkurses && konkurses.length > 0) {
            konkurses.forEach(konkurs => {
                let reply = konkurs.attributes.conditions.data.attributes?.text
                let photo = konkurs.attributes.conditions.data.attributes?.photo.data?.attributes?.url
                let buttons = konkurs.attributes.conditions.data.attributes?.buttons.data

                let extra = {
                    parse_mode: 'HTML',
                    disable_web_page_preview: true,
                    reply_markup: {}
                }

                const inlineKeyboard = []

                if (buttons && buttons.length > 0) {
                    buttons.forEach(button => {
                        if (button.attributes.type === 'url') {
                            inlineKeyboard.push([Markup.button.url(button.attributes.title, button.attributes.data)])
                        } else if (button.attributes.type === 'webApp') {
                            inlineKeyboard.push([Markup.button.webApp(button.attributes.title, button.attributes.data)])
                        }
                    })
                }

                inlineKeyboard.push([Markup.button.callback('Принять участие', `takeKonkurs-${konkurs.id}`)])

                extra.reply_markup.inline_keyboard = inlineKeyboard


                if (photo) {
                    ctx.replyWithPhoto({ url: 'https://' + config.API.HOST + '.' + config.DOMAIN + photo }, { caption: reply, ...extra })
                } else {
                    ctx.reply(reply, extra)
                }
            })
        }
    } catch (error) {
        console.error(error)
    }
})

bot.command('feedback', async (ctx) => {
    ctx.scene.enter('FEEDBACK_SCENE', { initData: ctx.userData })
})

bot.command('privacy', async (ctx) => {
    try {
        const settings = await getStartParams()
        if (settings && settings.data.attributes?.policyLink) {
            let privacyLink = settings.data.attributes?.policyLink
            ctx.reply('<b>Политика обработки персональных данных</b>', {
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard([
                    Markup.button.url('Открыть', privacyLink)
                ])
            })
        }
    } catch (ex) {
        console.log(ex)
    }
})

bot.command('avatar', async (ctx) => {
    try {
        let reply = "<b>Загрузи свою фотографию и на ней отобразится брендинг МНП. Стань частью нашего сообщества</b>"
        ctx.reply(reply, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard([
                Markup.button.callback('Загрузить', 'uploadPhoto')
            ])
        })
    } catch (ex) {
        console.log(ex)
    }
})

bot.on('message', async (ctx, next) => {

    if (ctx.userData.attributes.role !== 'admin') return next()

    if (ctx.message) {

        const pageSize = 25
        let successSendCountTotal = 0
        let total = 0

        const childProcess = fork('./broadcast.js')

        for (let page = 1; ; page++) {
            const users = await getSubscribers(page, pageSize)

            if (users.data.length === 0) {
                break
            }

            const { sendStatus, successSendCount } = await sendMessages(ctx.message, users.data)

            successSendCountTotal += successSendCount
            total += sendStatus

            childProcess.send(sendStatus)

            await sleep(300)
        }

        const resultMessage = `<b>Сообщение было отправлено всем пользователям!</b>\n\n👍 Успешно: ${successSendCountTotal}\n👎 Заблокировали бот: ${total - successSendCountTotal}`
        ctx.reply(resultMessage, { parse_mode: 'HTML' })

        childProcess.kill()

    } else {
        next()
    }

})

app.post('/webhook', (req, res) => {
    bot.handleUpdate(req.body, res)
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
    bot.telegram.setWebhook(`https://bot.${config.DOMAIN}/webhook`)
})
