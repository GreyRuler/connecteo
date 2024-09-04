<script setup>

import config from '../../config/Index'
import { useMainStore } from '../../store/mainStore.js'
import { ref, onMounted, onUnmounted } from 'vue'

import Logo from '../../components/Logo.vue'
import Loader from '../../components/Loader.vue'

import declOfNum from '../../utils/declOfNum.js'

import UserCard from '../../components/UserCard.vue'

import { useRouter } from 'vue-router'

const load = ref(true)
const mainStore = useMainStore()

const chatId = window.Telegram.WebApp.initDataUnsafe.user?.id || config.BOT.TEST_USER
const userData = ref(null)

const webapp = window.Telegram.WebApp

const router = useRouter()

const back = () => {
    router.go(-1)
}

const contacts = ref(null)
const page = ref(1)
const pageSize = ref(10)

const useRequestPerDay = ref(null)

const requestsPerDay = 10

const lastSended = ref(null)

onMounted(() => {
    window.addEventListener('scroll', checkScroll)

    webapp.BackButton.show()
    webapp.onEvent('backButtonClicked', back)

    lastSended.value = JSON.parse(window.localStorage.getItem('requests')) || []

    const getData = async () => {
        userData.value = await mainStore.getUserData(chatId)
        if (userData.value.attributes.publishedAt) {
            let ids = userData.value.attributes.lookingFors.data.map(lookingFor => lookingFor.id)

            contacts.value = await mainStore.getContacts(
                userData.value.id,
                ids,
                page.value,
                pageSize.value
            )

            const { meta: { pagination: { total: requests }}} = await mainStore.getConnectsPerDayById(userData.value.id)
            useRequestPerDay.value = requests
        }

        load.value = false
    }

    getData()
})

onUnmounted(() => {
    window.removeEventListener('scroll', checkScroll)

    webapp.BackButton.hide()
    webapp.offEvent('backButtonClicked', back)
})

const usersLoader = ref(false)

const refreshHandler = async () => {
    if (contacts.value?.data && contacts.value.data.length < contacts.value.meta.pagination.total) {
        usersLoader.value = true
        page.value = page.value + 1

        let ids = userData.value.attributes.lookingFors.data.map(lookingFor => lookingFor.id)

        let items = await mainStore.getContacts(
            userData.value.id,
            ids,
            page.value,
            pageSize.value
        )

        if (!items) return
        contacts.value.data = [...contacts.value.data, ...items.data]
    }

    usersLoader.value = false
}

const checkScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        if (!usersLoader.value) {
            refreshHandler()
        }
    }
}

const requestsContact = async (e) => {
    const connect = await mainStore.addConnects(userData.value.id, e.id)

    if (connect) {
        useRequestPerDay.value = Number(useRequestPerDay.value) + 1
        let photo = null
        if (userData.value.attributes.photo?.data) {
            photo = `https://${config.API.HOST}.${config.DOMAIN}${userData.value.attributes.photo.data.attributes.url}`
        }

        const contact = `<b>С Вами хотят связаться!</b>

<b>Пользователь:</b> ${userData.value.attributes.firstName} ${userData.value.attributes.surname}

<b>Общая информация:</b>
${userData.value.attributes.about}

<b>Контакты:</b>
<b>Номер:</b> +${userData.value.attributes.phone}
<b>Email-адрес:</b> ${userData.value.attributes.email}
<b>TG:</b> <a href='tg://user?id=${userData.value.attributes.chatId}'>${userData.value.attributes.username || userData.value.attributes.firstName}</a>`

        await mainStore.sendMessage(contact, photo, e.attributes.chatId, [])
    }
}

</script>

<template>

    <div v-if="!load" class="flex flex-col p-4 pb-10 gap-y-4">
        <Logo />

        <div v-if="userData.attributes.publishedAt && (userData.attributes.status == 'adopted' || !userData.attributes.status)" class="flex flex-col gap-y-4">
            <div>
                <span>Сегодня у вас осталась возможность отправить <b class="font-sera_bold">{{ requestsPerDay - useRequestPerDay }}</b> {{ declOfNum(requestsPerDay - useRequestPerDay, ['запрос', 'запроса', 'запросов']) }}</span>
                <h1 class="text-lg font-sera_bold">Вам предлагают:</h1>
            </div>

            <div v-if="contacts.data && contacts.data.length > 0" class="flex flex-col gap-y-12">
                <UserCard v-for="user in contacts.data" :key="user.id" :user="user" :senderId="userData.id" @requestsContact="requestsContact" :useRequestPerDay="useRequestPerDay" :requestsPerDay="requestsPerDay" :sended="lastSended.includes(user.id)" />
            </div>

            <span v-else class="text-sm">
                К сожалению, контакты по Вашим критериям еще не добавлены. Попробуйте зайти позже.
            </span>

            <div v-if="usersLoader" class="flex justify-center pt-4">
                <span className="loading loading-spinner loading-lg text-button_color" />
            </div>
        </div>

        <div v-else>
            <span>Ваш профиль находится на модерации, пожалуйста, ожидайте. Скоро вам будет доступен полный функционал нетворкинга!</span>
        </div>
    </div>

    <Loader v-else />

</template>