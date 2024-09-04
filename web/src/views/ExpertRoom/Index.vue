<script setup>

import config from '../../config/Index'
import { useMainStore } from '../../store/mainStore.js'
import { ref, onMounted, onUnmounted } from 'vue'

import Logo from '../../components/Logo.vue'
import Loader from '../../components/Loader.vue'
import Expert from '../../components/Form/Expert.vue'
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

const settings = ref(null)

onMounted(() => {

    webapp.BackButton.show()
    webapp.onEvent('backButtonClicked', back)

    const getData = async () => {
        userData.value = await mainStore.getUserData(chatId)
        settings.value = await mainStore.getSettings()

        load.value = false
    }

    getData()
})

onUnmounted(() => {
    webapp.BackButton.hide()
    webapp.offEvent('backButtonClicked', back)
})

const submit = async (e) => {

    let chat_id = window.Telegram.WebApp.initDataUnsafe.user?.id || config.BOT.TEST_USER
    let name = window.Telegram.WebApp.initDataUnsafe.user?.first_name

    let data = {
        ...e,
        subscriber: userData.value.id
    }
    
    const added = await mainStore.addExpert(data)

    if (added) {
        userData.value.attributes.expert_room.data = { id: added.id }
        if (settings.value?.data?.attributes?.appChat) {
            const reply = `<b>Новая заявка в менторскую гостиную!</b>

<b>ФИО:</b> ${e.surname} ${e.name} ${e.secondName}
<b>Телефон:</b> ${e.phone}
<b>Область:</b> ${e.region}
<b>Дата посещения:</b> ${e.visit_date}
<b>TG:</b> <a href='tg://user?id=${chat_id}'>${name}</a>
<b>Запрос:</b>\n\n${e.request}`

            await mainStore.sendMessage(reply, null, settings.value?.data?.attributes?.appChat)
        }
    }

}

</script>

<template>

    <div v-if="!load" class="flex flex-col p-4 gap-y-4">
        <Logo />

        <div v-if="userData && !userData.attributes.expert_room?.data" class="flex flex-col gap-y-4">
            <Expert @submit="submit" />
        </div>

       <Template
            v-else
            title="Поздравляем, вы зарегистрированы!"
            subTitle="В ближайшее время с вами свяжется менеджер"
            buttonText="Вернуться на главную"
            to="/"
       />
    </div>

    <Loader v-else />

</template>