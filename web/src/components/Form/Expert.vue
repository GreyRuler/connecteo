<script setup>

import { reactive, ref, onMounted, onUnmounted } from 'vue'
import { useMainStore } from '../../store/mainStore.js'
import { Icon } from '@iconify/vue'
import isValidPhoneNumber from '../../utils/isValidPhoneNumber.js'

import isiOS from '../../utils/isiOS.js'

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

const events = [
    '22 мая', '23 мая'
]

const topics = [
    'Маркетинг В2С',
    'Маркетинг В2В',
    'Автоматизация бизнеса',
    'Продажи',
    'Делегирование',
    'Инвестиции' ,
    'Продукт',
    'Стратегия',
    'Есом для новичков',
    'Финансы',
    'Маркетплейсы',
    'Инвестиции',
    'Масштабирование бизнеса',
    'PR и личный бренд', 
    'Команда', 
    'Франшиза',
    'Экспорт', 
    'Продвижение', 
    'Продукт', 
    'Навыки самопрезентации',
    'Юридические услуги',
    'Другое'
]

const formData = reactive({
    surname: '',
    name: '',
    secondName: '',
    region: '',
    visit_date: '',
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

    if (!formData.region) return webapp.showAlert('Область не указана')
    if (!formData.request) return webapp.showAlert('Запрос не указан')
    if (!formData.visit_date) return webapp.showAlert('Не выбран день для посещения')

    let formattedPhone = extractDigits(formData.phone)
    formData.phone = formattedPhone

    emit('submit', formData)
}

const changeEvents = (event) => {
    if (formData.visit_date === event) {
        formData.visit_date = ''
    } else {
        formData.visit_date = event
    }
}

const requestContact = () => {
    window.Telegram.WebApp.requestContact()
}

</script>

<template>
    <div class="flex flex-col gap-y-2">
        <h4 class="font-sera_bold text-lg">Менторская гостиная</h4>
        <span class="pb-2">Получите бесплатную консультацию у экспертов на площадке форума. Отправьте ваш запрос, мы подберем эксперта по вашей теме и назначим встречу в экспертной гостиной в дни форума. Количество мест ограничено. Пожалуйста, заполните заявку и наш менеджер свяжется с вами с подтверждением встречи с экспертом.</span>

        <input @keyup.enter="(e) => e.target.blur()" v-model="formData.surname" type="text" placeholder="Фамилия" class="outline-none bg-secondary_bg_color p-4 rounded-xl placeholder:text-text_color w-full" />
        <input @keyup.enter="(e) => e.target.blur()" v-model="formData.name" type="text" placeholder="Имя" class="outline-none bg-secondary_bg_color p-4 rounded-xl placeholder:text-text_color w-full" />
        <input @keyup.enter="(e) => e.target.blur()" v-model="formData.secondName" type="text" placeholder="Отчество" class="outline-none bg-secondary_bg_color p-4 rounded-xl placeholder:text-text_color w-full" />

        <div class="flex gap-x-2">
            <input @keyup.enter="(e) => e.target.blur()" v-model="formData.phone" type="text" placeholder="Телефон" class="outline-none bg-secondary_bg_color p-4 rounded-xl placeholder:text-text_color w-full" />
            <button @click="requestContact" class="rounded-xl px-2 text-sm">Поделиться</button>
        </div>
        
        <div class="outline-none relative bg-secondary_bg_color px-4 rounded-xl placeholder:text-text_color w-full">
            <select @change="(e) => formData.region = e.target.value" class="flex items-center w-full py-4 appearance-none bg-transparent border-none outline-none cursor-pointer">
                <option disabled selected>Выберите область</option>
                <option v-for="el, index in topics" :key="index">
                    {{el}}
                </option>
            </select>

            <div class="absolute right-4 top-0 bottom-0 flex justify-center items-center">
                <Icon icon="lucide:chevron-down" width='20px' />
            </div>
        </div>

        <div class="flex relative">
            <resize-textarea
                class="outline-none bg-secondary_bg_color !p-4 rounded-xl placeholder:text-text_color w-full"
                placeholder='Опишите ваш запрос' :minHeight=140 maxLength="200" minLength="16"
                v-model="formData.request">
            </resize-textarea>

            <span class="absolute text-sm text-text_color right-4 bottom-3">{{ 200 -
                formData.request.length }}</span>
        </div>

        <div v-if="events && events.length > 0" class="py-2">

            <h4 class="font-sera_bold text-lg">Выберите дату посещения:</h4>

            <div v-for="event in events" className="form-control">
                <label className="label cursor-pointer gap-x-4 justify-start">
                    <input @change="() => changeEvents(event)" type="checkbox" :checked="formData.visit_date === event" className="checkbox" />
                    <span className="text-sm">{{ event }}</span> 
                </label>
            </div>

        </div>

        <button @click="submit" :class="['transition-all p-3 rounded-full uppercase text-lg']">Отправить</button>
    </div>
</template>