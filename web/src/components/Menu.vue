<script setup>

defineProps({
    confirmed: Boolean,
    active: Boolean,
    status: Boolean
})

</script>

<template>
    <menu class="fixed bottom-0 left-0 right-0 z-10 p-4 flex flex-col gap-y-4 bg-secondary_bg_color">
        <router-link v-if="!confirmed"
            class="bg-button_color text-button_text_color text-lg rounded-full uppercase p-2.5 flex w-full justify-center"
            :to="{ name: 'REGISTRATION' }">Регистрация</router-link>

        <router-link v-if="(confirmed && !active) || (status == 'rejected')"
            class="bg-button_color text-button_text_color text-lg rounded-full uppercase p-2.5 flex w-full justify-center"
            :to="{ name: 'SET_PROFILE' }">Регистрация на нетворкинг</router-link>

        <div :class="['flex justify-around items-center text-sm max-[375px]:text-xs']">
            <a href="#1" v-smooth-scroll class="flex flex-col justify-center items-center gap-y-2 w-20">
                <img src="../assets/btn1.svg" alt="btn" class="w-8 h-8 max-[375px]:w-6 max-[375px]:h-6" />
                <span class="whitespace-nowrap">Программа</span>
            </a>

            <a href="#2" v-smooth-scroll class="flex flex-col justify-center items-center gap-y-2 w-20">
                <img src="../assets/btn2.svg" alt="btn" class="w-8 h-8 max-[375px]:w-6 max-[375px]:h-6" />
                <span class="whitespace-nowrap">Спикеры</span>
            </a>

            <a href="#3" v-smooth-scroll class="flex flex-col justify-center items-center gap-y-2 w-20">
                <img src="../assets/btn3.svg" alt="btn" class="w-8 h-8 max-[375px]:w-6 max-[375px]:h-6" />
                <span class="whitespace-nowrap">Локация</span>
            </a>

            <router-link :to="{ name: 'NETWORKING' }" v-if="active && (!status || status !== 'rejected')" class="flex flex-col justify-center items-center gap-y-2 w-20">
                <img src="../assets/btn4.svg" alt="btn" class="w-8 h-8 max-[375px]:w-6 max-[375px]:h-6" />
                <span class="whitespace-nowrap">Нетворкинг</span>
            </router-link>
        </div>
    </menu>
</template>