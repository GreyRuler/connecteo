<script setup>

import config from '../../config/Index'
import { useMainStore } from '../../store/mainStore.js'
import { ref, onMounted, onUnmounted } from 'vue'

import Logo from '../../components/Logo.vue'
import Loader from '../../components/Loader.vue'
import Strategic from '../../components/Form/Strategic.vue'
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

    data.turnover = e.turnover.title

    const added = await mainStore.addStrategic(data)

    if (added) {
        userData.value.attributes.strategic_session.data = { id: added.id }
        if (settings.value?.data?.attributes?.appChat) {
            const reply = `<b>Новая заявка на разбор бизнеса в формате стратегической сессии!</b>
            
<b>ФИО:</b> ${e.surname} ${e.name} ${e.secondName}
<b>Телефон:</b> ${e.phone}
<b>Название компании:</b> ${e.company}
<b>Деятельность:</b> ${e.activity}
<b>Среднегодовой оборот:</b> ${e.turnover.title} млн. рублей
<b>К-во сотрудников:</b> ${e.employees}
<b>TG:</b> <a href='tg://user?id=${chat_id}'>${name}</a>

<b>Ключевые проблемы:</b>\n\n${e.problems}

<b>Запрос:</b>\n\n${e.request}`

            await mainStore.sendMessage(reply, null, settings.value?.data?.attributes?.appChat)
        }
    }

}

</script>

<template>

    <div v-if="!load" class="flex flex-col p-4 gap-y-4">
        <Logo />

        <div v-if="userData && !userData.attributes.strategic_session?.data" class="flex flex-col gap-y-4">
            <Strategic @submit="submit" />
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