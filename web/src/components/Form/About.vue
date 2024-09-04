<script setup>

import { reactive, onMounted, ref, onUnmounted } from 'vue'
import { useMainStore } from '../../store/mainStore'
import BranchButton from './BranchButton.vue'
import isiOS from '../../utils/isiOS.js'

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

const mainStore = useMainStore()

const emit = defineEmits(['submit'])

const formData = reactive({
    about: '',
    lookingFors: [],
    suggests: []
})

const webapp = window.Telegram.WebApp

const submit = () => {
    if (!formData.about || formData.about.length < 16) return webapp.showAlert('Описание профиля не заполнено')
    if (!formData.lookingFors) return webapp.showAlert('Выберите как минимум один пункт из секции "Я ищу"')
    if (!formData.suggests) return webapp.showAlert('Выберите как минимум один пункт из секции "Я предлагаю"')

    emit('submit', formData)
}

const branches = ref(null)

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

    const getBranch = async () => {
        branches.value = await mainStore.getBranches()
    }

    getBranch()
})

const setSuggests = (branchId) => {
    const index = formData.suggests.indexOf(branchId)
    if (index === -1) {
        formData.suggests.push(branchId)
    } else {
        formData.suggests.splice(index, 1)
    }
}

const setLookingFors = (branchId) => {
    const index = formData.lookingFors.indexOf(branchId)
    if (index === -1) {
        formData.lookingFors.push(branchId)
    } else {
        formData.lookingFors.splice(index, 1)
    }
}

</script>

<template>
    <form @submit="(e) => {
            e.preventDefault()
        }" class="flex flex-col gap-y-2">

        <input type="checkbox" id="my_modal_7" className="modal-toggle" />
            <div className="modal" role="dialog">
                <div className="modal-box">
                    <h3 className="text-lg font-bold">Пример заполнения</h3>
                    <p className="pt-4">Директор мебельной фабрики «Ромашка». Мы производим качественную мебель для дома и офиса уже 20 лет. Наша компания — надёжный партнёр, который всегда соблюдает сроки и учитывает пожелания клиентов. Готов поделиться опытом</p>
                    <div className="modal-action">
                        <label htmlFor="my_modal_7" className="bg-hint_color px-4 py-2.5 rounded-xl cursor-pointer">Закрыть</label>
                    </div>
                </div>
            <label className="modal-backdrop" htmlFor="my_modal_7">Close</label>
        </div>

        <div class="flex justify-center mb-2">
            <label htmlFor="my_modal_7" class="flex gap-x-2 cursor-pointer items-center font-sera_bold p-2.5 rounded-full rounded-tr-none text-text_color bg-hint_color">
                <span class="flex w-5 h-5"><img src="../../assets/info.svg" alt="Info icon" class="w-full h-full object-contain" /></span>
                <span>Пример заполнения</span>
            </label>
        </div>

        <div class="flex relative">
            <resize-textarea
                class="outline-none bg-secondary_bg_color !p-4 rounded-xl placeholder:text-text_color w-full"
                placeholder='Краткое описание' :minHeight=140 maxLength="200" minLength="16"
                v-model="formData.about">
            </resize-textarea>

            <span class="absolute text-sm text-text_color right-4 bottom-3">{{ 200 -
                formData.about.length }}</span>
        </div>

        <div v-if="branches && branches.data.length > 0" className="form-control gap-y-2">
            <span class="font-sera_bold text-lg">Я предлагаю:</span>
            
            <div class="flex gap-2 flex-wrap">
                <BranchButton
                    v-for="branch in branches.data" 
                    :key="branch.id"
                    :active="formData.suggests.includes(branch.id)"
                    :branch="branch"
                    @change="setSuggests"
                />
            </div>
        </div>

        <div v-if="branches && branches.data.length > 0" className="form-control gap-y-2">
            <span class="font-sera_bold text-lg">Я ищу:</span>

            <div class="flex gap-2 flex-wrap">
                <BranchButton
                    v-for="branch in branches.data" 
                    :key="branch.id"
                    :active="formData.lookingFors.includes(branch.id)"
                    :branch="branch"
                    @change="setLookingFors"
                />
            </div>
        </div>

        <span />

        <button @click="submit" :disabled="formData.lookingFors.length < 1 || formData.suggests.length < 1" :class="['transition-all p-3 rounded-full uppercase text-lg', (formData.lookingFors.length < 1 || formData.suggests.length < 1) && 'bg-secondary_bg_color text-text-color']">Отправить</button>
        
        <p>После отправки вашей анкеты мы сможем подобрать для вас соискателей</p>

    </form>
</template>