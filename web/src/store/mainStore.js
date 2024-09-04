import config from '../config/Index.json'
import { defineStore } from "pinia"
import axios from "axios"
import qs from 'qs'

const api_host = `https://${config.API.HOST}.${config.DOMAIN}`
const bot_host = `https://${config.BOT.HOST}.${config.DOMAIN}`

export const useMainStore = defineStore('mainStore', () => {

    const sendSmsCode = async (phone, code) => {
        try {
            const result = await axios.post(bot_host + `/api/send-sms`, {
                phone: phone,
                message: code
            })

            return result.data
        } catch (ex) {
            console.error('sendSmsCode')
            return null
        }
    }

    const getUserData = async (chatId) => {
        try {
            const result = await axios.get(api_host + `/api/subscribers`
                + `?populate=*`
                + `&filters[chatId][$eq]=${chatId}`
                + `&pagination[page]=1`
                + `&pagination[pageSize]=1`
                + `&publicationState=preview`
            ).then((res) => {
                if (res.data.data.length > 0) { return res.data.data[0] }
                else {
                    return null
                }
            })

            return result
        } catch (ex) {
            console.log(ex.response.data)
            return null
        }

    }

    const setUserData = async (userId, data) => {
        try {
            const result = await axios.put(api_host + `/api/subscribers/${userId}`, {
                data: data
            })

            return result.data
        } catch (ex) {
            console.error("setUserData")
            return undefined
        }
    }

    const addStrategic = async (data) => {
        try {
            const result = await axios.post(api_host + `/api/strategic-sessions`, {
                data: data
            })

            return result.data
        } catch (ex) {
            console.error("addStrategic")
            return undefined
        }
    }

    const addExpert = async (data) => {
        try {
            const result = await axios.post(api_host + `/api/expert-rooms`, {
                data: data
            })

            return result.data
        } catch (ex) {
            console.error("addExpert")
            return undefined
        }
    }

    const sendMessage = async (text, imageLink, chatIds, buttons) => {
        try {
            const result = await axios.post(bot_host + `/api/send-message`, {
                message: text || null,
                imageLink: imageLink || null,
                chatIds: [chatIds],
                buttons: buttons || []
            })
                .then((res) => res.data); return result
        } catch (ex) { return null }
    }

    const sendSticker = async (stickerId, chatId) => {
        try {
            const result = await axios.post(bot_host + `/api/send-sticker`, {
                stickerId: stickerId,
                chatId: chatId
            })
                .then((res) => res.data); return result
        } catch (ex) { return null }
    }

    const getMainPage = async () => {
        try {
            const result = await axios.get(api_host + `/api/main-page`)
            return result.data
        } catch (ex) {
            console.error("getMainPage")
            return undefined
        }
    }

    const getBranches = async () => {
        try {
            const result = await axios.get(api_host + `/api/branches`)
            return result.data
        } catch (ex) {
            console.error("getBranches")
            return undefined
        }
    }

    const getPromo = async () => {
        try {
            const result = await axios.get(api_host + `/api/promos`
                + `?fields=promocode`
                + `&filters[used][$eq]=false`
                + `&pagination[page]=1`
                + `&pagination[pageSize]=1`
            )
            return result.data
        } catch (ex) {
            console.error("getPromo")
            return undefined
        }
    }

    const setPromo = async (promo_id, data) => {
        try {
            const result = await axios.put(api_host + `/api/promos/` + promo_id, {
                data: data
            })
            return result.data
        } catch (ex) {
            console.error("setPromo")
            return undefined
        }
    }

    const getEvents = async () => {
        try {
            const result = await axios.get(api_host + `/api/events?sort=startDate:asc`)
            return result.data
        } catch (ex) {
            console.error("getEvents")
            return undefined
        }
    }

    const getContacts = async (userId, lookingForsIds, page, pageSize) => {
        try {
            let ids = lookingForsIds.map((id, index) => `&filters[$or][${index}][suggests][$in]=${id}`).join('')

            const result = await axios.get(api_host + `/api/subscribers`
                + `?populate[0]=photo`
                + `&populate[1]=suggests`
                + `&fields[0]=firstName`
                + `&fields[1]=surname`
                + `&fields[2]=about`
                + `&fields[3]=chatId`
                + ids

                + `&filters[$and][0][$or][0][status][$eq]=adopted`
                + `&filters[$and][0][$or][1][status][$null]=true`

                + `&filters[$and][1][blocked][$eq]=false`
                + `&filters[$and][1][confirmed][$eq]=true`
                + `&filters[$and][1][active][$eq]=true`
                + `&filters[$and][1][id][$ne]=${userId}`
                + `&pagination[page]=${page}`
                + `&pagination[pageSize]=${pageSize}`
                + `&sort=rank:asc`)

            return result.data
        } catch (ex) {
            console.error(ex)
            return undefined
        }
    }

    const addConnects = async (senderId, recipientId) => {
        try {
            const result = await axios.post(api_host + `/api/connects`, {
                data: {
                    sender: senderId,
                    recipient: recipientId,
                    status: 'sent'
                }
            })

            return result.data
        } catch (ex) {
            return undefined
            console.error('addConnects')
        }
    }

    const setConnects = async (connectId, data) => {
        try {
            const result = await axios.put(api_host + `/api/connects/${connectId}`, {
                data: data
            })

            return result.data
        } catch (ex) {
            console.error("setConnects")
            return undefined
        }
    }

    const getConnectsPerDayById = async (senderId) => {
        try {
            let date = new Date()
            date.setHours(0, 0, 0, 0)

            const result = await axios.get(api_host + `/api/connects`
                + `?fields=id`
                + `&pagination[page]=1`
                + `&pagination[pageSize]=1`
                + `&filters[sender][$eq]=${senderId}`
                + `&filters[createdAt][$gte]=${date.toISOString()}`
            )
            return result.data
        } catch (ex) {
            console.error("getConnectsPerDayById")
            return undefined
        }
    }

    const getSettings = async () => {
        try {
            const result = await axios.get(api_host + `/api/setting`)
            return result.data
        } catch (ex) {
            console.error('getSettings')
            return undefined
        }
    }

    const sendDataToMainServer = async (data) => {
        try {
            const result = await axios.post(bot_host + '/api/registration', {
                data: data
            })
            return result.data
        } catch (ex) {
            console.error(ex)
            return undefined
        }
    }


    return {
        getUserData, sendMessage,
        getMainPage,
        setUserData,
        getBranches,
        getContacts,
        addConnects,
        setConnects,
        getConnectsPerDayById,
        sendSticker,
        sendSmsCode,
        getEvents,
        getSettings,
        sendDataToMainServer,
        addStrategic,
        addExpert,
        getPromo,
        setPromo
    }
})