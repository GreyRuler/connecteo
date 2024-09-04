<script setup>

import config from '../../config/Index'
import { useMainStore } from '../../store/mainStore.js'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import Logo from '../../components/Logo.vue'
import Loader from '../../components/Loader.vue'
import Menu from '../../components/Menu.vue'

const load = ref(true)
const mainStore = useMainStore()

const html = ref('')

const chatId = window.Telegram.WebApp.initDataUnsafe.user?.id || config.BOT.TEST_USER
const userData = ref(null)
const pageInfo = ref(null)

const router = useRouter()

onMounted(async () => {

    const getData = async () => {
        pageInfo.value = await mainStore.getMainPage()
        userData.value = await mainStore.getUserData(chatId)

        load.value = false
    }

    await getData()

    const button_get_sticker = document.getElementById('get_sticker');
    if (button_get_sticker) {
        button_get_sticker.addEventListener('click', sendSticker);
    }


    const button_strategic_sessions = document.getElementById('strategic_sessions')
    if (button_strategic_sessions) {
        button_strategic_sessions.addEventListener('click', strategic)
    }

    const button_expert_room = document.getElementById('expert_room')
    if (button_expert_room) {
        button_expert_room.addEventListener('click', expert)
    }
})

const strategic = () => {
    if (userData.value.attributes.confirmed) {
        router.push({ name: 'STRATEGIC_SESSION' })
    } else {
        window.Telegram.WebApp.showAlert('Пожалуйста, сперва пройдите регистрацию')
    }
}

const expert = () => {
    if (userData.value.attributes.confirmed) {
        router.push({ name: 'EXPERT_ROOM' })
    } else {
        window.Telegram.WebApp.showAlert('Пожалуйста, сперва пройдите регистрацию')
    }
}

const sendSticker = async () => {
    const sended = await mainStore.sendSticker(pageInfo.value.data.attributes?.stickerId, userData.value.attributes.chatId)
    if (sended) {
        await mainStore.setUserData(userData.value.id, {
            gotSticker: true
        })

        window.Telegram.WebApp.close()
    } else {
        window.Telegram.WebApp.showAlert('Произошла ошибка. Пожалуйста, попробуйте снова')
    }
}

</script>

<template>

    <div v-if="!load && userData" :class="['flex flex-col p-4 gap-y-4', userData.attributes?.confirmed && userData.attributes?.active ? 'pb-32' : 'pb-44']">
        <Logo />

        <div v-if="pageInfo && pageInfo.data.attributes?.markup" class="markup_wrapper" v-html="pageInfo.data.attributes.markup"></div>

        <Menu :confirmed="userData.attributes?.confirmed" :active="userData.attributes?.active" :status="userData.attributes?.status" />
    </div>

    <Loader v-else />

</template>