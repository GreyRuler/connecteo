const config = require('./config/index.json')
const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const image_size = require('image-size')

const host = `https://${config.API.HOST}.${config.DOMAIN}`

const sendSms = async (phone, text) => {
    const login = config.SMS.LOGIN
    const password = config.SMS.PASSWORD

    const url = `https://api.iqsms.ru/messages/v2/send/?login=${login}&password=${password}&phone=${phone}&text=${encodeURIComponent(text)}`

    try {
        const response = await axios.get(url)
        return response.data
    } catch (error) {
        console.error(error)
    }
}

const downloadFileAndAddToFormData = async (url, formData, fileName) => {
    const response = await axios({
        method: 'GET',
        url: url,
        responseType: 'stream'
    })

    const filePath = path.resolve(__dirname, fileName)
    const writer = fs.createWriteStream(filePath)

    response.data.pipe(writer)

    return new Promise((resolve, reject) => {
        writer.on('finish', () => {
            formData.append('file', fs.createReadStream(filePath))
            resolve()
        })
        writer.on('error', reject)
    })
}

const getUserPhoto = async (ctx) => {
    try {
        const userProfilePhotos = await ctx.telegram.getUserProfilePhotos(ctx.message.from.id, 0, 1)
        if (userProfilePhotos.total_count > 0) {
            const photoId = userProfilePhotos.photos[0][2].file_id
            const link = await ctx.telegram.getFileLink(photoId)
            const formData = new FormData()
            const fileUrl = link

            const response = await axios.get(fileUrl, { responseType: 'arraybuffer' })
            const buffer = Buffer.from(response.data, 'binary')
            const type = image_size(buffer)

            const fileName = crypto.randomBytes(15).toString('hex') + '.' + type.type
            const filePath = path.resolve(__dirname, fileName)

            await downloadFileAndAddToFormData(fileUrl, formData, fileName)
            const uploadedPhoto = await uploadFile(fs.createReadStream(path.resolve(filePath)))
            console.log('Фотография профиля успешно загружена на сервер')
            fs.unlinkSync(filePath)
            return uploadedPhoto
        } else {
            console.log('У пользователя нет аватара.')
            return null
        }
    } catch (err) {
        console.error(err)
        return null
    }
}

const userExists = async (ctx) => {
    try {
        let res = await axios.get(`${host}/api/subscribers`
            + `?filters[chatId][$eq]=${ctx.from.id}`
            + `&pagination[page]=1`
            + `&pagination[pageSize]=1`
            + `&publicationState=preview`)

        let user = res.data.data

        if (!user || user.length === 0) {

            const photo = await getUserPhoto(ctx)

            user = await axios.post(`${host}/api/subscribers`, {
                data: {
                    firstName: ctx.from?.first_name,
                    chatId: ctx.from.id,
                    lastName: ctx.from?.last_name,
                    username: ctx.from?.username,
                    locale: ctx.from.language_code,
                    photo: photo || null
                }
            })
            return user.data.data
        }

        if (user[0].attributes.blocked) {
            let settedUser = await axios.put(`${host}/api/subscribers/${user[0].id}`, {
                data: {
                    blocked: false
                }
            })
            return settedUser.data.data
        }

        return user[0]
    } catch (ex) {
        console.error('userExists')
        return undefined
    }
}

const getSubscribers = async (page, pageSize) => {
    try {
        const response = await axios.get(`${host}/api/subscribers`
            + `?pagination[page]=${page}`
            + `&pagination[pageSize]=${pageSize}`
            + `&fields=chatId`
            + `&filters[blocked][$eq]=false`
            + `&publicationState=preview`)
        return response.data
    } catch (error) {
        console.error("getSubscribers")
        return undefined
    }
}

const setUser = async (id, data) => {
    try {
        const response = await axios.put(`${host}/api/subscribers/${id}`, {
            data: data
        })

        return response.data
    } catch (error) {
        console.error("setUser")
        return undefined
    }
}

const getStartParams = async () => {
    try {
        const response = await axios.get(`${host}/api/setting`
            + `?populate[startMessage][populate][0]=photo`
            + `&populate[startMessage][populate][1]=buttons`)
        return response.data
    } catch (error) {
        console.error("getStartParams")
        return null
    }
}

const getKonkurses = async () => {
    try {
        const response = await axios.get(`${host}/api/konkurses`
            + `?populate[conditions][populate][0]=photo`
            + `&populate[conditions][populate][1]=buttons`
            + `&filters[ended][$eq]=false`)
        return response.data
    } catch (error) {
        console.error("getKonkurses")
        return null
    }
}

const checkParticipation = async (konkurs_id, user_id) => {
    try {
        const response = await axios.get(`${host}/api/konkurses`
            + `?filters[users][$in]=${user_id}`
            + `&filters[id]=${konkurs_id}`
        )

        return response.data
    } catch (error) {
        console.error("checkParticipation")
        return undefined
    }
}

const setKonkurs = async (id, data) => {
    try {
        const response = await axios.put(`${host}/api/konkurses/${id}`, {
            data: data
        })

        return response.data
    } catch (error) {
        console.error("setKonkurs")
        return undefined
    }
}

const uploadFile = async (file) => {
    let data = new FormData()
    data.append('files', file)

    try {
        const response = await axios.post(host + `/api/upload`, data, { headers: { 'Content-Type': 'multipart/form-data' } })
        return response.data
    } catch (error) {
        console.log(error)
        return null
    }
}

const addFedback = async (review, userId) => {
    try {
        const result = await axios.post(host + `/api/feedbacks`, {
            data: {
                subscriber: userId,
                review: review
            }
        })

        return result.data
    } catch (ex) {
        console.log('addFedback')
        return undefined
    }
}

const sendDataToMainServer = async (data) => {
    let apiKey = config.MAIN_SERVER_API_KEY
    let conf = {
        method: 'PUT',
        url: 'https://mainserver.accreditation.ru/api/app/formdata/import/1265',
        headers: {
            'x-api-key': apiKey
        },
        data: data
    }

    try {
        const result = await axios(conf)
        return result.data
    } catch (ex) {
        console.error(ex)
        return undefined
    }
}

module.exports = {
    userExists,
    getSubscribers,
    setUser,
    getStartParams,
    addFedback,
    sendSms,
    sendDataToMainServer,
    getKonkurses,
    setKonkurs,
    checkParticipation
}