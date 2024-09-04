<script setup>

import { reactive, ref, onMounted, onUnmounted } from 'vue'
import { useMainStore } from '../../store/mainStore.js'
import isiOS from '../../utils/isiOS.js'
import isValidPhoneNumber from '../../utils/isValidPhoneNumber.js'

const eventHandler = (e) => {
    if (e.status === 'cancelled') return
    formData.phone = e.responseUnsafe.contact.phone_number
}

onMounted(() => {

    window.Telegram.WebApp.onEvent('contactRequested', eventHandler)

    const inputFields = document.querySelectorAll('input')
    const textareaFields = document.querySelectorAll('textarea')

    if (inputFields) {
        inputFields.forEach(input => {
            input.addEventListener('focus', handleFocus)
            input.addEventListener('blur', handleBlur)
        })
    }

    if (textareaFields) {
        textareaFields.forEach(textarea => {
            textarea.addEventListener('focus', handleFocus)
            textarea.addEventListener('blur', handleBlur)
        })
    }
})

onUnmounted(() => {

    window.Telegram.WebApp.offEvent('contactRequested', eventHandler)

    handleBlur()
    const inputFields = document.querySelectorAll('input')
    const textareaFields = document.querySelectorAll('textarea')

    if (inputFields) {
        inputFields.forEach(input => {
            input.removeEventListener('focus', handleFocus)
            input.removeEventListener('blur', handleBlur)
        })
    }

    if (textareaFields) {
        textareaFields.forEach(textarea => {
            textarea.removeEventListener('focus', handleFocus)
            textarea.removeEventListener('blur', handleBlur)
        })
    }
})

const handleFocus = () => {
    if (isiOS()) {
        const mainElement = document.querySelector('body')
        if (mainElement) {
            mainElement.classList.add('pb-80')
        }
    }
}

const handleBlur = () => {
    const mainElement = document.querySelector('body')
    if (mainElement) {
        mainElement.classList.remove('pb-80')
    }
}

const mainStore = useMainStore()

const emit = defineEmits(['submit'])

const turnoverVariable = [
    { id: 0, title: 'До 20 млн руб' },
    { id: 1, title: 'До 50' },
    { id: 2, title: '50 - 250' },
    { id: 3, title: '250+' }
]

const formData = reactive({
    surname: '',
    name: '',
    secondName: '',
    company: '',
    activity: '',
    turnover: null,
    employees: '',
    problems: '',
    request: '',
    phone: ''
})

const webapp = window.Telegram.WebApp

function extractDigits(inputString) {
    // Используем регулярное выражение для нахождения всех цифр в строке
    var digits = inputString.replace(/\D/g, '');
    // Возвращаем строку, содержащую только цифры
    return digits;
}

const submit = () => {
    if (!formData.surname) return webapp.showAlert('Фамилия не указана')
    if (!formData.name) return webapp.showAlert('Имя не указано')
    if (!formData.secondName) return webapp.showAlert('Отчество не указано')
    if (!isValidPhoneNumber(formData.phone)) return webapp.showAlert('Номер телефона указан неверно')
    if (!formData.company) return webapp.showAlert('Название компании не указано')
    if (!formData.activity) return webapp.showAlert('Сфера деятельности не указана')
    if (!formData.turnover) return webapp.showAlert('Среднегодовой оборот не указан')
    if (!formData.employees) return webapp.showAlert('Количество сотрудников не указано')
    if (!formData.problems) return webapp.showAlert('Ключевые проблемы не указаны')
    if (!formData.request) return webapp.showAlert('Запрос на стратсессию не указан')

    let formattedPhone = extractDigits(formData.phone)
    formData.phone = formattedPhone

    emit('submit', formData)
}

const requestContact = () => {
    window.Telegram.WebApp.requestContact()
}

</script>

<template>
    <div class="flex flex-col gap-y-2">
        <h4 class="font-sera_bold text-lg">Стратегические сессии</h4>
        <span>Подайте заявку и получите возможность разбора вашего бизнеса в формате стратегической сессии на площадке форума 23 мая. Топ-менеджеры и основатели бизнеса помогут за 1.5 часа разработать стратегию для вашего бизнеса и найти точки роста. Количество мест ограничено. Необходимо заполнить анкету и в случае отбора вашего проекта, менеджер свяжется для подготовки вашего участия.</span>
        <span class="pb-2">Дата посещения 23 мая</span>

        <input @keyup.enter="(e) => e.target.blur()" v-model="formData.surname" type="text" placeholder="Фамилия" class="outline-none bg-secondary_bg_color p-4 rounded-xl placeholder:text-text_color w-full" />
        <input @keyup.enter="(e) => e.target.blur()" v-model="formData.name" type="text" placeholder="Имя" class="outline-none bg-secondary_bg_color p-4 rounded-xl placeholder:text-text_color w-full" />
        <input @keyup.enter="(e) => e.target.blur()" v-model="formData.secondName" type="text" placeholder="Отчество" class="outline-none bg-secondary_bg_color p-4 rounded-xl placeholder:text-text_color w-full" />

        <div class="flex gap-x-2">
            <input @keyup.enter="(e) => e.target.blur()" v-model="formData.phone" type="text" placeholder="Телефон" class="outline-none bg-secondary_bg_color p-4 rounded-xl placeholder:text-text_color w-full" />
            <button @click="requestContact" class="rounded-xl px-2 text-sm">Поделиться</button>
        </div>

        <input @keyup.enter="(e) => e.target.blur()" v-model="formData.company" type="text" placeholder="Название компании" class="outline-none bg-secondary_bg_color p-4 rounded-xl placeholder:text-text_color w-full" />
        <input @keyup.enter="(e) => e.target.blur()" v-model="formData.activity" type="text" placeholder="Сфера деятельности" class="outline-none bg-secondary_bg_color p-4 rounded-xl placeholder:text-text_color w-full" />

        <div class="flex flex-col py-2 gap-y-2">
            <span>Размер бизнеса<br />(среднегодовой оборот, млн руб)</span>
            
            <div class="flex gap-2 flex-wrap">
                <button @click="() => formData.turnover = turn" :class="['px-4 py-1.5 rounded-full', formData?.turnover?.id === turn.id ? 'bg-text_color' : 'bg-hint_color']" v-for="turn, index in turnoverVariable" :key="index">
                    {{ turn.title }}
                </button>
            </div>
        </div>

        <input @keyup.enter="(e) => e.target.blur()" v-model="formData.employees" type="text" placeholder="Количество сотрудников" class="outline-none bg-secondary_bg_color p-4 rounded-xl placeholder:text-text_color w-full" />

        <div class="flex relative">
            <resize-textarea
                class="outline-none bg-secondary_bg_color !p-4 rounded-xl placeholder:text-text_color w-full"
                placeholder='Опишите ключевые проблемы' :minHeight=140 maxLength="200" minLength="16"
                v-model="formData.problems">
            </resize-textarea>

            <span class="absolute text-sm text-text_color right-4 bottom-3">{{ 200 -
                formData.problems.length }}</span>
        </div>

        <div class="flex relative">
            <resize-textarea
                class="outline-none bg-secondary_bg_color !p-4 rounded-xl placeholder:text-text_color w-full"
                placeholder='Опишите ваш запрос на стратсессию' :minHeight=140 maxLength="200" minLength="16"
                v-model="formData.request">
            </resize-textarea>

            <span class="absolute text-sm text-text_color right-4 bottom-3">{{ 200 -
                formData.request.length }}</span>
        </div>

        <button @click="submit" :class="['transition-all p-3 rounded-full uppercase text-lg']">Отправить</button>
    </div>
</template>