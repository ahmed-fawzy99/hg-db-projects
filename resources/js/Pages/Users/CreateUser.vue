<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import {Head, Link, useForm} from '@inertiajs/vue3';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { ref, onMounted } from 'vue';
import FormContainer from "@/Components/Form/FormContainer.vue";
import FormTextItem from "@/Components/Form/FormTextItem.vue";
import {useConfirm} from "primevue/useconfirm";
import {useToast} from "primevue/usetoast";
import {cities} from "@/Service/Egyptian_Cities.js";

const confirm = useConfirm();
const toast = useToast();

const confirmSubmission = (event) => {
    confirm.require({
        target: event.currentTarget,
        message: 'هل انت متأكد من حفظ التغييرات؟',
        icon: 'pi pi-exclamation-triangle',
        rejectProps: {
            label: 'العودة',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'تأكيد'
        },
        accept: () => {
            submitForm();
        },
        reject: () => {
        }
    });
};
const form = useForm({
    name: ref(null),
    email: ref(null),
    password: ref(null),
    role: ref({ name: 'مستخدم', code: 'user' }),
});

const roles = ref([
    { name: 'أدمن', code: 'admin' },
    { name: 'مستخدم', code: 'user' },
]);

const submitForm = () => {
    form.role = form.role.code;
    form.post(route('users.store'), {
        preserveScroll: true,
        onSuccess: () => {
            toast.add({severity: 'success', summary: 'تمت العملية بنجاح', detail: 'تم إضافة المستخدم بنجاح', life: 4000});
            form.reset();
        },
        onError: () => {
            toast.add({severity: 'error', summary: 'فشلت العملية', detail: 'حدث خطأ أثناء إضافة المستخدم', life: 4000});
        }
    });
}
</script>

<template>
    <Head title="Create User" />
    <AuthenticatedLayout>
        <div class="py-6">
            <div class="mx-auto sm:px-6 lg:px-8">
                <div class="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                    <div class="p-6 text-gray-900">
                        <h1 class="text-3xl font-semibold pb-4">إضافة مستخدم</h1>
                        <FormContainer>
                            <FormTextItem id="name" title="الاسم" v-model:field="form.name" :error="form.errors.name" required/>
                            <FormTextItem id="email" title="البريد الإلكتروني" v-model:field="form.email" :error="form.errors.email" required/>
                        </FormContainer>
                        <FormContainer>
                            <div class="flex flex-col w-full md:mb-6 col-span-2 md:col-span-1">
                                <label for="password">كلمة المرور<sup class="text-red-500">*</sup></label>
                                <Password inputId="password" :inputStyle="{ width: '100%' }" :style="'width: 100%'"  v-model="form.password" :feedback="false" :invalid="form.errors.password" required/>
                                <small v-show="form.errors.password" class="text-red-500">{{form.errors.password}}</small>
                            </div>
                            <div class="flex flex-col w-full md:mb-6 col-span-2 md:col-span-1">
                                <label for="password">الصلاحيات<sup class="text-red-500">*</sup></label>
                                <Select v-model="form.role" :options="roles" optionLabel="name" placeholder="اختر صلاحية" class="w-full" />
                                <small v-show="form.errors.password" class="text-red-500">{{form.errors.password}}</small>
                            </div>
                        </FormContainer>

                        <ConfirmPopup></ConfirmPopup>
                        <Button label="انشاء المستخدم" id="submit-account-form" icon="pi pi-check" @click="confirmSubmission"
                                :disabled="form.processing"/>
                        <Message v-show="form.processing" severity="secondary" class="mt-6">جار معالجة الطلب...</Message>
                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
