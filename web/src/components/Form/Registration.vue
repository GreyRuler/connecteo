<script setup>

import { reactive, ref, onMounted, onUnmounted } from 'vue'
import isValidPhoneNumber from '../../utils/isValidPhoneNumber.js'
import isValidEmail from '../../utils/isValidEmail.js'
import { useMainStore } from '../../store/mainStore.js'
import moment from 'moment'
import isiOS from '../../utils/isiOS.js'

onMounted(() => {
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

const props = defineProps({
    events: [Object, null],
    settings: [Object, null]
})

const mainStore = useMainStore()

const emit = defineEmits(['submit'])

const formData = reactive({
    surname: '',
    name: '',
    phone: '',
    email: '',
    checked: false,
    smsCode: '',
    events: []
})

const eventList = reactive({
    
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
    if (!isValidPhoneNumber(formData.phone)) return webapp.showAlert('Номер телефона указан неверно')

    formData.phone = extractDigits(formData.phone)
    
    if (!formData.smsCode || formData.smsCode != code.value) return webapp.showAlert('Неверный код подтверждения')
    if (!isValidEmail(formData.email)) return webapp.showAlert('Почта указана неверно')

    if (props.events && props.events.data.length > 0) {
        if (formData.events < 1) return webapp.showAlert('Выберите дни посещения')
    }

    emit('submit', { formData, eventList })
}

const code = ref(null)
const step = ref(1)
const sendCode = ref(true)
const second = ref(60)

const verification = async () => {
    if (!isValidPhoneNumber(formData.phone)) return webapp.showAlert('Номер телефона указан неверно')

    if (!sendCode.value) return
    code.value = Math.floor(1000 + Math.random() * 9000)
    
    const sended = await mainStore.sendSmsCode(formData.phone, `Ваш код подтверждения: ${code.value}`)
    if (!sended.success === true) return webapp.showAlert('Произошла ошибка, пожалуйста, попробуйте позже')

    step.value = 2
    sendCode.value = false

    let intervalId = setInterval(() => {
        if (second.value > 1) {
            second.value = second.value - 1
        } else {
            clearInterval(intervalId)
            second.value = 60
            sendCode.value = true
        }
    }, 1000)
}

function formatDate(date) {
    moment.locale('ru')
    return moment(date, 'YYYY-MM-DD').format('DD.MM')
}

function formatDateToRussian(dateString) {
  const months = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
  ]
  
  const [year, month, day] = dateString.split('-')
  const formattedDate = `${parseInt(day)} ${months[parseInt(month) - 1]}`
  
  return formattedDate
}

function formatDateNumber(date) {
    moment.locale('ru')
    return moment(date, 'YYYY-MM-DD').format('DD')
}

const changeEvents = (event) => {
    const index = formData.events.indexOf(event.id)
    if (index === -1) {
        formData.events.push(event.id)
        eventList[formatDateNumber(event.attributes.startDate)] = 'Да'
    } else {
        formData.events.splice(index, 1)
        delete eventList[formatDateNumber(event.attributes.startDate)]
    }
}

</script>

<template>
    <div class="flex flex-col gap-y-2">
        <h4 class="font-sera_bold text-lg">Регистрация</h4>

        <input @keyup.enter="(e) => e.target.blur()" v-model="formData.surname" type="text" placeholder="Фамилия" class="outline-none bg-secondary_bg_color p-4 rounded-xl placeholder:text-text_color w-full" />
        <input @keyup.enter="(e) => e.target.blur()" v-model="formData.name" type="text" placeholder="Имя" class="outline-none bg-secondary_bg_color p-4 rounded-xl placeholder:text-text_color w-full" />
        <input :disabled="step === 2" @keyup.enter="(e) => e.target.blur()" v-model="formData.phone" type="text" placeholder="Телефон" class="outline-none bg-secondary_bg_color p-4 rounded-xl placeholder:text-text_color w-full" />

        <div class="flex flex-col gap-y-2">
            <input v-show="step === 2" @keyup.enter="(e) => e.target.blur()" v-model="formData.smsCode" type="text" placeholder="Код подтверждения" class="outline-none bg-secondary_bg_color p-4 rounded-xl placeholder:text-text_color w-full" />
            <button @click="verification" :disabled="!sendCode" :class="['transition-all flex w-full justify-center items-center py-3 rounded-xl', !sendCode && 'opacity-60']">{{ sendCode ? 'Отправить код' : 'Повторить через ' + second + ' сек' }}</button>
        </div>

        <input @keyup.enter="(e) => e.target.blur()" v-model="formData.email" type="text" placeholder="Почта" class="outline-none bg-secondary_bg_color p-4 rounded-xl placeholder:text-text_color w-full" />

        <span />
        <span />

        <div v-if="events && events.data.length > 0" class="border-b-2 border-dotted pb-4">

            <h4 class="font-sera_bold text-lg">Выберите дни для посещения:</h4>

            <div v-for="event in events.data" className="form-control">
                <label className="label cursor-pointer gap-x-4 justify-start">
                    <input @change="() => changeEvents(event)" type="checkbox" className="checkbox" />
                    <span className="text-sm">{{ formatDateToRussian(event.attributes.startDate) }}</span> 
                </label>
            </div>

        </div>

        <div className="form-control">
            <label className="label cursor-pointer gap-x-4 justify-start">
                <input @change="formData.checked = !formData.checked" type="checkbox" :checked="formData.checked" className="checkbox" />
                <span className="text-sm">Даю согласие на обработку персональных данных и передачу логина телеграм третьим лицам и участникам чат-бота</span> 
            </label>
        </div>

        <button @click="submit" :disabled="!formData.checked" :class="['transition-all p-3 rounded-full uppercase text-lg', !formData.checked && 'bg-secondary_bg_color text-text-color']">Регистрация</button>
        <a v-if="settings" class="text-sm text-center pt-2 underline" :href="settings.data.attributes.policyLink" target="_blank">Политика обработки персональных данных</a>
    </div>
</template>