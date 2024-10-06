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
    location: ref(null),
    code: ref(null),
    consultant_name: ref(null),
    documents_delivery_fulfillment_date: ref(null),
    financial_status: ref(false),  // Default is false
    finances_payment_date: ref(null),
    initial_review_notes_delivery_to_coord_unit_date: ref(null),
    owner_notes_delivery_after_fulfillment_date: ref(null),
    coord_unit_review_date: ref(null),
    unit_project_approval_date: ref(null),
    project_material_links: ref(null)
});

const filteredCountries = ref();

const search = (event) => {
    setTimeout(() => {
        if (!event.query.trim().length) {
            filteredCountries.value = [...cities.city_name_ar];
        } else {
            filteredCountries.value = cities.filter((country) => {
                return country.city_name_ar.replace('أ', 'ا').replace('ة', 'ه').replace('ي', 'ى')
                    .startsWith(event.query.replace('أ', 'ا').replace('ة', 'ه').replace('ي', 'ى'));
            });
        }
    }, 250);
}

const submitForm = () => {
    form.location = form.location?.city_name_ar ?? form.location;
    form.post(route('store-project'), {
        preserveScroll: true,
        onSuccess: () => {
            toast.add({severity: 'success', summary: 'تمت العملية بنجاح', detail: 'تم إضافة المشروع بنجاح', life: 4000});
            form.reset();
        },
        onError: () => {
            toast.add({severity: 'error', summary: 'فشلت العملية', detail: 'حدث خطأ أثناء إضافة المشروع', life: 4000});
        }
    });
}
</script>

<template>
    <Head title="All Projects" />
    <AuthenticatedLayout>
        <div class="py-6">
            <div class="mx-auto sm:px-6 lg:px-8">
                <div class="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                    <div class="p-6 text-gray-900">
                        <h1 class="text-3xl font-semibold pb-4">إضافة مشروع</h1>
                        <FormContainer>
                            <FormTextItem id="name" title="إسم المشروع" v-model:field="form.name" :error="form.errors.name" required/>
                            <div class="flex flex-col col-span-2 sm:col-span-1">
                                <p class="cursor-default">موقع المشروع<sup class="text-red-500">*</sup></p>
                                <AutoComplete v-model="form.location" optionLabel="city_name_ar" :suggestions="filteredCountries" @complete="search">
                                    <template #option="slotProps">
                                        <div class="flex items-center">
                                            <div>{{ slotProps.option.city_name_ar }}</div>
                                        </div>
                                    </template>
                                </AutoComplete>
                                <small v-show="form.errors.location" class="text-red-500">{{form.errors.location}}</small>
                            </div>

                        </FormContainer>
                        <FormContainer>
                            <FormTextItem id="code" title="كود المشروع" v-model:field="form.code" :error="form.errors.code" required/>
                            <FormTextItem id="consultant_name" title="اسم الاستشاري" v-model:field="form.consultant_name" :error="form.errors.consultant_name"/>
                        </FormContainer>
                        <FormContainer>
                            <div class="flex flex-col col-span-2 sm:col-span-1">
                                <p class="cursor-default">تاريخ تمام استلام واستيفاء مستندات المشروع</p>
                                <DatePicker id="documents_delivery_fulfillment_date" v-model="form.documents_delivery_fulfillment_date" placeholder="اختر التاريخ..." dateFormat="yy-mm-dd" showIcon iconDisplay="input"
                                            class="!w-full" :manualInput="false" :invalid="form.errors.documents_delivery_fulfillment_date"/>
                                <small v-show="form.errors.documents_delivery_fulfillment_date" class="text-red-500">{{form.errors.documents_delivery_fulfillment_date}}</small>
                            </div>
                            <div class="flex flex-col col-span-2 sm:col-span-1">
                                <p class="cursor-default">تمام تسديد المطالبة المالية (نعم / لا)</p>
                                <div class="flex flex-wrap gap-4 h-full">
                                    <div class="flex items-center">
                                        <RadioButton v-model="form.financial_status" inputId="financialStatusYes" name="financial_status" :value="true" />
                                        <label for="financialStatusYes" class="ms-2">نعم</label>
                                    </div>
                                    <div class="flex items-center">
                                        <RadioButton v-model="form.financial_status" inputId="financialStatusNo" name="financial_status" :value="false" />
                                        <label for="financialStatusNo" class="ms-2">لا</label>
                                    </div>
                                </div>
                                <small v-show="form.errors.documents_delivery_fulfillment_date" class="text-red-500">{{form.errors.documents_delivery_fulfillment_date}}</small>
                            </div>

                        </FormContainer>
                        <FormContainer v-if="form.financial_status">
                            <div class="flex flex-col col-span-2 sm:col-span-1">
                                <p class="cursor-default">تاريخ تسديد المطالبة المالية</p>
                                <DatePicker id="finances_payment_date" v-model="form.finances_payment_date" placeholder="اختر التاريخ..." dateFormat="yy-mm-dd" showIcon iconDisplay="input"
                                            class="!w-full" :manualInput="false" :invalid="form.errors.finances_payment_date"/>
                                <small v-show="form.errors.finances_payment_date" class="text-red-500">{{form.errors.finances_payment_date}}</small>
                            </div>
                            <div class="flex flex-col col-span-2 sm:col-span-1" >
                                <p class="cursor-default">تاريخ انتهاء اللجنة الفنية من مراجعة المشروع وتسيلم الملاحظات الأولية لوحدة التنسيق الفني</p>
                                <DatePicker id="initial_review_notes_delivery_to_coord_unit_date" v-model="form.initial_review_notes_delivery_to_coord_unit_date" placeholder="اختر التاريخ..." dateFormat="yy-mm-dd" showIcon iconDisplay="input"
                                            class="!w-full" :manualInput="false" :invalid="form.errors.initial_review_notes_delivery_to_coord_unit_date"/>
                                <small v-show="form.errors.initial_review_notes_delivery_to_coord_unit_date" class="text-red-500">{{form.errors.initial_review_notes_delivery_to_coord_unit_date}}</small>
                            </div>
                        </FormContainer>
                        <FormContainer v-if="form.financial_status">
                            <div class="flex flex-col col-span-2 sm:col-span-1">
                                <p class="cursor-default">تاريخ تسليم المالك للملاحظات لوحدة التنسيق بعد استيفاؤها</p>
                                <DatePicker id="owner_notes_delivery_after_fulfillment_date" v-model="form.owner_notes_delivery_after_fulfillment_date" placeholder="اختر التاريخ..." dateFormat="yy-mm-dd" showIcon iconDisplay="input"
                                            class="!w-full" :manualInput="false" :invalid="form.errors.owner_notes_delivery_after_fulfillment_date"/>
                                <small v-show="form.errors.owner_notes_delivery_after_fulfillment_date" class="text-red-500">{{form.errors.owner_notes_delivery_after_fulfillment_date}}</small>
                            </div>
                            <div class="flex flex-col col-span-2 sm:col-span-1">
                                <p class="cursor-default">تاريخ مراجعة اللجنة الرئيسية للمشروع بعد استيفاء المالك للملاحظات ومراجعة اللجنة الفنية</p>
                                <DatePicker id="coord_unit_review_date" v-model="form.coord_unit_review_date" placeholder="اختر التاريخ..." dateFormat="yy-mm-dd" showIcon iconDisplay="input"
                                            class="!w-full" :manualInput="false" :invalid="form.errors.coord_unit_review_date"/>
                                <small v-show="form.errors.coord_unit_review_date" class="text-red-500">{{form.errors.coord_unit_review_date}}</small>
                            </div>
                        </FormContainer>
                        <FormContainer v-if="form.financial_status">
                            <div class="flex flex-col col-span-2 sm:col-span-1">
                                <p class="cursor-default">تاريخ تسليم المالك للملاحظات لوحدة التنسيق بعد استيفاؤها</p>
                                <DatePicker id="owner_notes_delivery_after_fulfillment_date" v-model="form.owner_notes_delivery_after_fulfillment_date" placeholder="اختر التاريخ..." dateFormat="yy-mm-dd" showIcon iconDisplay="input"
                                            class="!w-full" :manualInput="false" :invalid="form.errors.owner_notes_delivery_after_fulfillment_date"/>
                                <small v-show="form.errors.owner_notes_delivery_after_fulfillment_date" class="text-red-500">{{form.errors.owner_notes_delivery_after_fulfillment_date}}</small>
                            </div>
                            <div class="flex flex-col col-span-2 sm:col-span-1">
                                <p class="cursor-default">تاريخ مراجعة اللجنة الرئيسية للمشروع بعد استيفاء المالك للملاحظات ومراجعة اللجنة الفنية</p>
                                <DatePicker id="coord_unit_review_date" v-model="form.coord_unit_review_date" placeholder="اختر التاريخ..." dateFormat="yy-mm-dd" showIcon iconDisplay="input"
                                            class="!w-full" :manualInput="false" :invalid="form.errors.coord_unit_review_date"/>
                                <small v-show="form.errors.coord_unit_review_date" class="text-red-500">{{form.errors.coord_unit_review_date}}</small>
                            </div>
                        </FormContainer>
                        <FormContainer>
                            <div class="flex flex-col col-span-2 sm:col-span-1" v-if="form.financial_status">
                                <p class="cursor-default">تاريخ اعتماد اللجنة الرئيسية للمشروع بعد استيفاء جميع الملاحظات</p>
                                <DatePicker id="unit_project_approval_date" v-model="form.unit_project_approval_date" placeholder="اختر التاريخ..." dateFormat="yy-mm-dd" showIcon iconDisplay="input"
                                            class="!w-full" :manualInput="false" :invalid="form.errors.unit_project_approval_date"/>
                                <small v-show="form.errors.unit_project_approval_date" class="text-red-500">{{form.errors.unit_project_approval_date}}</small>
                            </div>
                            <FormTextItem id="project_material_links" title="رابط وثائق المشروع" v-model:field="form.project_material_links" :error="form.errors.project_material_links" />
                        </FormContainer>

                        <ConfirmPopup></ConfirmPopup>
                        <Button label="انشاء المشروع" id="submit-account-form" icon="pi pi-check" @click="confirmSubmission"
                                :disabled="form.processing"/>
                        <Message v-show="form.processing" severity="secondary" class="mt-6">جار معالجة الطلب...</Message>
                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
