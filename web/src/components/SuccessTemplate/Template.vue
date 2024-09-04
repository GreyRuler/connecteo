<script setup>

import copyToClipboardiOS from '../../utils/copyToClipboardiOS'

const props = defineProps({
    title: String,
    subTitle: String,
    answer: String,
    buttonText: String,
    to: String,
    promocode: String
})

const copy = () => {
    copyToClipboardiOS(props.promocode)
    window.Telegram.WebApp.showAlert('Промокод скопирован!')
}

</script>

<template>
     <div class="flex flex-col justify-center items-center gap-y-4 text-center mt-12">
            <h1 v-if="title" class="font-druk text-xl">{{ title }}</h1>

            <span v-if="subTitle" class="text-lg font-sera_bold">{{ subTitle }}</span>

            <div class="w-24 h-24">
                <img src="../../assets/check.svg" alt="check" class="w-full h-full object-contain" />
            </div>

            <div v-if="promocode" @click="copy">
                <p>Мы также подготовили для вас промокод <span class="font-sera_bold underline">{{ promocode }}</span> от нашего партнера Мегамаркета - скидка 2000 руб. на первый заказ от 4000 руб.<br /><br />Срок действия промокодов: 10.05.24 – 31.05.2024.
                <a href="https://megamarket.ru/promo/pravila-akczii-promokody-na-pervyj-zakazmy/?utm_source=sber&utm_medium=partners&utm_campaign=trade_may_msk" target="_blank" class="text-button_color underline">Правила акции</a>.
                Использовать его можно <a href="https://megamarket.ru/?utm_source=sber&utm_medium=partners&utm_campaign=trade_may_msk" target="_blank" class="text-button_color underline">на сайте</a>.<br /> <br />Увидимся на Московском предпринимательском форуме!</p>
            </div>

            <span />
            <span />

            <span v-if="answer" class="text-lg font-sera_bold">{{ answer }}</span>

            <div class="flex flex-col items-center justify-center gap-y-0.5">
                <span class="bg-text_color w-0.5 h-20" />
                <span v-for="el, index in 3" :key="index" class="bg-text_color w-0.5 h-0.5" />
            </div>

            <router-link v-if="buttonText && to" :to="to" class='transition-all p-3 rounded-full uppercase text-lg bg-button_color text-button_text_color w-full'>{{ buttonText }}</router-link>
        </div>
</template>