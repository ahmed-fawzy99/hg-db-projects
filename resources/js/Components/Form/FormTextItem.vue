<script setup lang="ts">
defineProps<{
    id: string;
    title: string;
    fullWidth?: boolean;
    lightLabel?: boolean;
    error?: boolean;
    required?: boolean;
    autocomplete?: string;
}>();

const field = defineModel('field');
</script>

<template>
    <div class="flex flex-col w-full col-span-2 sm:col-span-1" >
        <label :for="id" :class="{'font-light text-md text-zinc-500': lightLabel}">{{ title }}<sup v-if="required" class="text-red-500">*</sup></label>
        <InputText  :id="id" v-model="field" :invalid="error"
                   :required="required" :autocomplete="autocomplete"/>
        <small v-show="error" class="text-red-500">{{ error }}</small>
    </div>
</template>

<style scoped>

</style>
