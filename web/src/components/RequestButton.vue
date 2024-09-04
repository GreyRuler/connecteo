<script setup>

defineProps({ 
    sended: Boolean
})

const emit = defineEmits(['submit'])

</script>

<template>
    <button @click="emit('submit')" :disabled="sended" :class="['transition-all rounded-full w-[200px] h-[44px] uppercase flex justify-center items-center', !sended ? 'bg-button_color text-white' : 'bg-[#F1F1F1] text-black']">
        <span v-if="sended">Запрос отправлен</span>
        <span v-else>Отправить запрос</span>
    </button>
</template>