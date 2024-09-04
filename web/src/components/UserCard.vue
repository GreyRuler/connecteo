<script setup>

import { ref, onMounted } from 'vue'
import RequestButton from './RequestButton.vue'
import config from '../config/Index.json'

const props = defineProps({
    user: Object,
    senderId: Number,
    useRequestPerDay: Number,
    requestsPerDay: Number,
    sended: Boolean
})

const emit = defineEmits(['requestsContact'])

const unwrap = ref(false)

const webapp = window.Telegram.WebApp

const sended = ref(null)

onMounted(() => {
    sended.value = props.sended
})

function addIdToLocalStorage(newId) {
  let data = JSON.parse(window.localStorage.getItem('requests')) || []
  
  data.push(newId)
  
  window.localStorage.setItem('requests', JSON.stringify(data))
}

const requestsContact = () => {
    if (props.useRequestPerDay >= props.requestsPerDay) {
        return webapp.showAlert(`Ежедневно можно отправить не более ${props.requestsPerDay} запросов`)
    }

    webapp.showConfirm('Вы готовы поделиться своим контактом?', (e) => {
        if (e) {
            sended.value = true
            addIdToLocalStorage(props.user.id)
            emit('requestsContact', props.user)
        }
    })
}

</script>

<template>
    <div class="rounded-xl relative bg-secondary_bg_color flex flex-col px-4 pb-10 pt-16 gap-y-4 mt-10">

        <div class="flex justify-center absolute w-full left-0 right-0 -top-12">
            <div class="w-24 h-24 rounded-full bg-bg_color border-2 border-secondary_bg_color flex justify-center items-center overflow-hidden">
                <img v-if="!user.attributes.photo?.data" src="../assets/user.svg" class="w-12 object-contain" />
                <img v-else :src="`https://${config.API.HOST}.${config.DOMAIN}${user.attributes.photo?.data?.attributes?.url}`" class="object-contain" />
            </div>
        </div>

        <div class="flex flex-col justify-center gap-y-4">
            <h3 class="text-center font-sera_bold text-lg">{{ user.attributes?.firstName }} {{ user.attributes?.surname }}</h3>

            <div class="flex gap-2 flex-wrap">
                <span class="text-sm px-2.5 py-1 rounded-full border-2 border-text_color opacity-50" v-for="suggest in user.attributes.suggests.data" :key="suggest.id">{{ suggest.attributes.title }}</span>
            </div>

            <p v-if="unwrap" class="text-sm whitespace-pre-wrap">{{ user.attributes?.about }}</p>
            <p v-else class="text-sm whitespace-pre-wrap">{{ user.attributes?.about.length > 120 ? user.attributes?.about.slice(0, 120) + '...' : user.attributes?.about }} <span v-if="user.attributes?.about.length > 120" @click="unwrap = !unwrap" class="font-sera_bold cursor-pointer text-button_color underline">Развернуть</span></p>
        </div>

        <div class="flex justify-center absolute w-full left-0 right-0 -bottom-5">

            <RequestButton
                :sended="sended"
                @submit="requestsContact"
            />

        </div>
    </div>
</template>