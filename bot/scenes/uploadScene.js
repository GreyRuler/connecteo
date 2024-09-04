const config = require('../config/index.json')
const { Scenes, Markup } = require('telegraf')
const { BaseScene } = Scenes
const Jimp = require('jimp')

const uploadScene = new BaseScene('UPLOAD_SCENE')

uploadScene.enter(async (ctx) => {
    await ctx.reply('Отправьте ваше изображение:', Markup.keyboard([
        ['Отменить']
    ]).resize())
})

uploadScene.hears(['/start', '/feedback', '/avatar', '/privacy'], (ctx) => {
    ctx.reply('Вы отменили отправку изображения.', Markup.removeKeyboard())
    ctx.scene.leave()
})

uploadScene.hears('Отменить', (ctx) => {
    ctx.reply('Вы отменили отправку изображения.', Markup.removeKeyboard())
    ctx.scene.leave()
})

uploadScene.on('photo', async (ctx) => {
    const photoId = ctx.message.photo[ctx.message.photo.length - 1].file_id
    const photo = await ctx.telegram.getFile(photoId)
    const photoLink = `https://api.telegram.org/file/bot${config.BOT.TOKEN}/${photo.file_path}`

    Jimp.read(photoLink)
        .then(image => {
            const squareSize = Math.min(image.bitmap.width, image.bitmap.height)
            const xCenter = image.bitmap.width / 2
            const yCenter = image.bitmap.height / 2

            image.crop(xCenter - squareSize / 2, yCenter - squareSize / 2, squareSize, squareSize)

            return Jimp.read('./template.png')
                .then(watermark => {
                    watermark.resize(image.bitmap.width, Jimp.AUTO)
                    const x = 0
                    const y = image.bitmap.height - watermark.bitmap.height
                    image.composite(watermark, x, y, {
                        mode: Jimp.BLEND_SOURCE_OVER,
                        opacitySource: 1.0
                    })
                        .getBuffer(Jimp.MIME_JPEG, (err, buffer) => {
                            ctx.replyWithPhoto({ source: buffer }, Markup.removeKeyboard())
                            ctx.scene.leave()
                        })
                })
        })
        .catch(err => {
            console.error(err)
        })
})

module.exports = uploadScene