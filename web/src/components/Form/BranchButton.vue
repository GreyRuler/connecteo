<script setup>

defineProps({
    branch: Object,
    active: Boolean
})

const emit = defineEmits(['change'])

</script>

<template>
    <span @click="() => emit('change', branch.id)" :class="['w-fit px-2.5 py-1 rounded-full text-white cursor-pointer', active ? 'bg-text_color' : 'bg-hint_color']">
        {{ branch.attributes.title }}
    </span>
</template>