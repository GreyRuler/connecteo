<script setup>

import config from './config/Index.json'
import { onMounted } from "vue"

const init = Object.entries(window.Telegram.WebApp.initDataUnsafe).length > 0

onMounted(() => {
    if (!init && !config.BOT.TEST_USER) return window.location.replace(`https://t.me/${config.BOT.USERNAME}`)
    window.Telegram.WebApp.expand()
    window.Telegram.WebApp.enableClosingConfirmation()
})

</script>

<template>

    <div class="flex justify-center">
        <main class="max-w-[440px]">
            <router-view></router-view>
        </main>
    </div>

</template>