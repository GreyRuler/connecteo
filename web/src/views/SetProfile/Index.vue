<script setup>

import config from '../../config/Index'
import { useMainStore } from '../../store/mainStore.js'
import { ref, onMounted, onUnmounted } from 'vue'

import Logo from '../../components/Logo.vue'
import Loader from '../../components/Loader.vue'
import About from '../../components/Form/About.vue'
import Template from '../../components/SuccessTemplate/Template.vue'

import { useRouter } from 'vue-router'

const load = ref(true)
const mainStore = useMainStore()

const chatId = window.Telegram.WebApp.initDataUnsafe.user?.id || config.BOT.TEST_USER
const userData = ref(null)

const webapp = window.Telegram.WebApp

const router = useRouter()

const back = () => {
    router.push({ name: 'INDEX' })
}

onMounted(() => {

    webapp.BackButton.show()
    webapp.onEvent('backButtonClicked', back)

    const getData = async () => {
        userData.value = await mainStore.getUserData(chatId)

        load.value = false
    }

    getData()
})

onUnmounted(() => {
    webapp.BackButton.hide()
    webapp.offEvent('backButtonClicked', back)
})

const submit = async (e) => {
    
    const setted = await mainStore.setUserData(userData.value.id, {
        about: e.about,
        lookingFors: e.lookingFors,
        suggests: e.suggests,
        active: true,
        publishedAt: null,
        status: 'wait'
    })

    if (setted) {
        userData.value = setted.data
    }

}

</script>

<template>

    <div v-if="!load" class="flex flex-col p-4 gap-y-4">

        <Logo />

        <div v-if="!userData.attributes?.active || userData.attributes.status === 'rejected'" class="flex flex-col gap-y-4">
            <h1 class="font-sera_bold text-xl">Заполните информацию о себе</h1>

            <About @submit="submit" />
        </div>

       <Template v-else
            title="Поздравляем, вы зарегистрированы!"
            subTitle="Теперь с вами могут связаться заинтересованные люди"
            answer="Хотите посмотреть контакты из вашей отрасли?"
            buttonText="Посмотреть контакты"
            to="/networking"
       />
    </div>

    <Loader v-else />

</template>