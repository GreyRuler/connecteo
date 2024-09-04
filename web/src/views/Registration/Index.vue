<script setup>

import config from '../../config/Index'
import { useMainStore } from '../../store/mainStore.js'
import { ref, onMounted, onUnmounted } from 'vue'

import Logo from '../../components/Logo.vue'
import Loader from '../../components/Loader.vue'
import Registration from '../../components/Form/Registration.vue'
import Template from '../../components/SuccessTemplate/Template.vue'

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

const events = ref(null)
const settings = ref(null)

onMounted(() => {

    webapp.BackButton.show()
    webapp.onEvent('backButtonClicked', back)

    const getData = async () => {
        userData.value = await mainStore.getUserData(chatId)
        events.value = await mainStore.getEvents()
        settings.value = await mainStore.getSettings()

        load.value = false

        if (userData.value.attributes.confirmed) {
            await getPromo()
        }
    }

    getData()
})

const promocode = ref(null)

const getPromo = async () => {
    if (!userData.value) return

    if (userData.value.attributes.promos.data.length < 1) {
        const { data: [givePromo] } = await mainStore.getPromo()
        promocode.value = givePromo.attributes.promocode

        await mainStore.setPromo(givePromo.id, {
            used: true,
            subscriber: userData.value.id
        })
    } else {
        promocode.value = userData.value.attributes.promos.data[0].attributes.promocode
    }
}

onUnmounted(() => {
    webapp.BackButton.hide()
    webapp.offEvent('backButtonClicked', back)
})

const submit = async (e) => {
    
    const setted = await mainStore.setUserData(userData.value.id, {
        firstName: e.formData.name,
        surname: e.formData.surname,
        phone: e.formData.phone,
        email: e.formData.email,
        confirmed: true,
        events: e.formData.events
    })

    let id = window.Telegram.WebApp.initDataUnsafe.user?.id || config.BOT.TEST_USER

    let data = {
        id: id.toString(),
        name: e.formData.name,
        lastname: e.formData.surname,
        email: e.formData.email,
        telegram: window.Telegram.WebApp.initDataUnsafe.user?.username || null,
        telegram_id: window.Telegram.WebApp.initDataUnsafe.user?.id || config.BOT.TEST_USER,
        phone: e.formData.phone,
        ...e.eventList
    }

    const mainData = mainStore.sendDataToMainServer(data)

    if (setted) {
        await getPromo()
        userData.value = setted.data
        // mainStore.sendMessage('Вы успешно были зарегистрированы!', null, chatId)
    }

}

</script>

<template>

    <div v-if="!load" class="flex flex-col p-4 gap-y-4">
        <Logo />
        <div v-if="!userData.attributes?.confirmed" class="flex flex-col gap-y-4">
            <div class="flex flex-col gap-y-1">
                <h1 class="font-druk text-xl">Добро пожаловать!</h1>
                <span>Присоединяйтесь и станьте тем, кто создает будущее успешного и процветающего бизнеса в столице!</span>
            </div>

            <Registration @submit="submit" :events="events" :settings="settings" />
        </div>

       <Template v-else
            title="Поздравляем, вы зарегистрированы!"
            subTitle="Билет с QR-кодом для входа отправлен на ваш e-mail"
            answer="Хотите найти коллег и партнеров по бизнесу?"
            buttonText="Регистрация на нетворкинг"
            to="/setProfile"
            :promocode="promocode"
       />
    </div>

    <Loader v-else />

</template>