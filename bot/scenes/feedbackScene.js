const { Scenes, Markup } = require('telegraf')
const { BaseScene } = Scenes

const { addFedback } = require('../requests')

const feedbackScene = new BaseScene('FEEDBACK_SCENE')

feedbackScene.enter(async (ctx) => {
    await ctx.reply('Помоги нам стать лучше и полезнее, мы будем рады твоему отзыву', Markup.keyboard([
        ['Отменить']
    ]).resize())
})

feedbackScene.hears(['/start', '/feedback', '/avatar', '/privacy'], (ctx) => {
    ctx.reply('Вы отменили отправку отзыва.', Markup.removeKeyboard())
    ctx.scene.leave()
})

feedbackScene.hears('Отменить', (ctx) => {
    ctx.reply('Вы отменили отправку отзыва.', Markup.removeKeyboard())
    ctx.scene.leave()
})

feedbackScene.on('message', async (ctx) => {
    const review = addFedback(ctx.message.text, ctx.scene.state.initData.id)
    ctx.reply('Спасибо за ваш отзыв! Ждем вас на Московском предпринимательском форуме!', Markup.removeKeyboard())
    ctx.scene.leave()
})

module.exports = feedbackScene