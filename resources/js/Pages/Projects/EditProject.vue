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

const props = defineProps({
    project: Object
});
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
            if (event.target.innerText === 'حذف المشروع') {
                deleteForm();
            } else {
                submitForm();
            }
        },
        reject: () => {
        }
    });
};
const form = useForm({
    name: ref(props.project.name ?? null),
    location: ref(props.project.location ?? null),
    code: ref(props.project.code ?? null),
    consultant_name: ref(props.project.consultant_name ?? null),
    documents_delivery_fulfillment_date: ref(props.project.documents_delivery_fulfillment_date ?? null),
    financial_status: ref(props.project.financial_status ?? null),
    finances_payment_date: ref(props.project.finances_payment_date ?? null),
    initial_review_notes_delivery_to_coord_unit_date: ref(props.project.initial_review_notes_delivery_to_coord_unit_date ?? null),
    owner_notes_delivery_after_fulfillment_date: ref(props.project.owner_notes_delivery_after_fulfillment_date ?? null),
    owner_notes_receipt_date: ref(props.project.owner_notes_receipt_date ?? null),
    coord_unit_review_date: ref(props.project.coord_unit_review_date ?? null),
    unit_project_approval_date: ref(props.project.unit_project_approval_date ?? null),
    project_material_links: ref(props.project.project_material_links),

    civil_defense_notes: ref(props.project.civil_defense_notes ?? null),
    civil_defense_actions: ref(props.project.civil_defense_actions ?? null),
    architectural_notes: ref(props.project.architectural_notes ?? null),
    architectural_actions: ref(props.project.architectural_actions ?? null),
    electromechanical_notes: ref(props.project.electromechanical_notes ?? null),
    electromechanical_actions: ref(props.project.electromechanical_actions ?? null),
    other_notes: ref(props.project.other_notes ?? null),
    other_actions: ref(props.project.other_actions ?? null),

    review_letter: ref(null),

});

const delForm = useForm({});
const filteredCountries = ref();


const file_upload_text = ref("رفع خطاب المراجعة (PDF, DOC, DOCX)");
const fileUploaded = ref(false);

const triggerFileUpload = () => {
    document.getElementById('file-upload').click();
}

const HandleFileUpload = (event) => {
    file_upload_text.value = event.target.files[0].name;
    fileUploaded.value = true;
    form.review_letter = document.getElementById('file-upload').files[0];
}

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
    form.post(route('update-project', {id: props.project.id}), {
        preserveScroll: true,
        _method: 'put', // to override the method spoofing
        onSuccess: () => {
            toast.add({severity: 'success', summary: 'تمت العملية بنجاح', detail: 'تم تعديل بيانات المشروع بنجاح', life: 4000});
        },
        onError: () => {
            toast.add({severity: 'error', summary: 'فشلت العملية', detail: 'حدث خطأ أثناء تعديل بيانات المشروع', life: 4000});
        }
    });
}
const deleteForm = () => {
    delForm.delete(route('delete-project', {id: props.project.id}), {
        preserveScroll: true,
        onSuccess: () => {
            toast.add({severity: 'success', summary: 'تمت العملية بنجاح', detail: 'تم حذف المشروع بنجاح', life: 4000});
        },
        onError: () => {
            toast.add({severity: 'error', summary: 'فشلت العملية', detail: 'حدث خطأ أثناء حذف المشروع', life: 4000});
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
                        <h1 class="text-3xl font-semibold pb-4">تعديل مشروع</h1>
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
                                <p class="cursor-default">تاريخ استلام المالك للملاحظات</p>
                                <DatePicker id="owner_notes_receipt_date" v-model="form.owner_notes_receipt_date" placeholder="اختر التاريخ..." dateFormat="yy-mm-dd" showIcon iconDisplay="input"
                                            class="!w-full" :manualInput="false" :invalid="form.errors.owner_notes_receipt_date"/>
                                <small v-show="form.errors.owner_notes_receipt_date" class="text-red-500">{{form.errors.owner_notes_receipt_date}}</small>
                            </div>
                            <div class="flex flex-col col-span-2 sm:col-span-1">
                                <p class="cursor-default">تاريخ تسليم المالك للملاحظات لوحدة التنسيق بعد استيفاؤها</p>
                                <DatePicker id="owner_notes_delivery_after_fulfillment_date" v-model="form.owner_notes_delivery_after_fulfillment_date" placeholder="اختر التاريخ..." dateFormat="yy-mm-dd" showIcon iconDisplay="input"
                                            class="!w-full" :manualInput="false" :invalid="form.errors.owner_notes_delivery_after_fulfillment_date"/>
                                <small v-show="form.errors.owner_notes_delivery_after_fulfillment_date" class="text-red-500">{{form.errors.owner_notes_delivery_after_fulfillment_date}}</small>
                            </div>
                        </FormContainer>
                        <FormContainer v-if="form.financial_status">
                            <div class="flex flex-col col-span-2 sm:col-span-1">
                                <p class="cursor-default">تاريخ مراجعة اللجنة الرئيسية للمشروع بعد استيفاء المالك للملاحظات ومراجعة اللجنة الفنية</p>
                                <DatePicker id="coord_unit_review_date" v-model="form.coord_unit_review_date" placeholder="اختر التاريخ..." dateFormat="yy-mm-dd" showIcon iconDisplay="input"
                                            class="!w-full" :manualInput="false" :invalid="form.errors.coord_unit_review_date"/>
                                <small v-show="form.errors.coord_unit_review_date" class="text-red-500">{{form.errors.coord_unit_review_date}}</small>
                            </div>
                            <div class="flex flex-col col-span-2 sm:col-span-1" v-if="form.financial_status">
                                <p class="cursor-default">تاريخ اعتماد اللجنة الرئيسية للمشروع بعد استيفاء جميع الملاحظات</p>
                                <DatePicker id="unit_project_approval_date" v-model="form.unit_project_approval_date" placeholder="اختر التاريخ..." dateFormat="yy-mm-dd" showIcon iconDisplay="input"
                                            class="!w-full" :manualInput="false" :invalid="form.errors.unit_project_approval_date"/>
                                <small v-show="form.errors.unit_project_approval_date" class="text-red-500">{{form.errors.unit_project_approval_date}}</small>
                            </div>
                        </FormContainer>
                        <FormContainer>
                            <FormTextItem id="project_material_links" title="رابط وثائق المشروع" v-model:field="form.project_material_links" :error="form.errors.project_material_links" />
                            <div class="flex flex-col col-span-2 sm:col-span-1">
                                <p class="cursor-default">خطاب المراجعة</p>
                                <input type="file" @change="HandleFileUpload($event)" class="hidden" id="file-upload" accept=".doc, .docx, .pdf"/>
                                <Button severity="secondary"  :label="file_upload_text" :icon="fileUploaded ? '' : 'pi pi-plus'" rounded @click="triggerFileUpload"/>
                                <small v-show="form.errors.review_letter" class="text-red-500">{{form.errors.review_letter}}</small>
                            </div>
                        </FormContainer>
                        <FormContainer>
                            <div class="flex flex-col col-span-2 sm:col-span-1">
                                <p class="cursor-default">ملاحظات الدفاع المدني</p>
                                <Textarea v-model="form.civil_defense_notes" rows="2" cols="30" />
                                <small v-show="form.errors.civil_defense_notes" class="text-red-500">{{form.errors.civil_defense_notes}}</small>
                            </div>
                            <div class="flex flex-col col-span-2 sm:col-span-1">
                                <p class="cursor-default">الإجراءات</p>
                                <Textarea v-model="form.civil_defense_actions" rows="2" cols="30" />
                                <small v-show="form.errors.civil_defense_actions" class="text-red-500">{{form.errors.civil_defense_actions}}</small>
                            </div>
                        </FormContainer>
                        <FormContainer>
                            <div class="flex flex-col col-span-2 sm:col-span-1">
                                <p class="cursor-default">ملاحظات المعماري</p>
                                <Textarea v-model="form.architectural_notes" rows="2" cols="30" />
                                <small v-show="form.errors.architectural_notes" class="text-red-500">{{form.errors.architectural_notes}}</small>
                            </div>
                            <div class="flex flex-col col-span-2 sm:col-span-1">
                                <p class="cursor-default">الإجراءات</p>
                                <Textarea v-model="form.architectural_actions" rows="2" cols="30" />
                                <small v-show="form.errors.architectural_actions" class="text-red-500">{{form.errors.architectural_actions}}</small>
                            </div>
                        </FormContainer>
                        <FormContainer>
                            <div class="flex flex-col col-span-2 sm:col-span-1">
                                <p class="cursor-default">ملاحظات الالكتروميكانيك</p>
                                <Textarea v-model="form.electromechanical_notes" rows="2" cols="30" />
                                <small v-show="form.errors.electromechanical_notes" class="text-red-500">{{form.errors.electromechanical_notes}}</small>
                            </div>
                            <div class="flex flex-col col-span-2 sm:col-span-1">
                                <p class="cursor-default">الإجراءات</p>
                                <Textarea v-model="form.electromechanical_actions" rows="2" cols="30" />
                                <small v-show="form.errors.electromechanical_actions" class="text-red-500">{{form.errors.electromechanical_actions}}</small>
                            </div>
                        </FormContainer>
                        <FormContainer>
                            <div class="flex flex-col col-span-2 sm:col-span-1">
                                <p class="cursor-default">ملاحظات أخرى</p>
                                <Textarea v-model="form.other_notes" rows="2" cols="30" />
                                <small v-show="form.errors.other_notes" class="text-red-500">{{form.errors.other_notes}}</small>
                            </div>
                            <div class="flex flex-col col-span-2 sm:col-span-1">
                                <p class="cursor-default">الإجراءات</p>
                                <Textarea v-model="form.other_actions" rows="2" cols="30" />
                                <small v-show="form.errors.other_actions" class="text-red-500">{{form.errors.other_actions}}</small>
                            </div>
                        </FormContainer>

                        <ConfirmPopup></ConfirmPopup>
                        <div class="flex gap-4">
                            <Button label="تعديل المشروع" id="submit-project-form" icon="pi pi-pencil" @click="confirmSubmission"
                                    :disabled="form.processing"/>
                            <Button label="حذف المشروع" id="delete-project-form" icon="pi pi-trash" @click="confirmSubmission" severity="danger"
                                    :disabled="deleteForm.processing"/>
                        </div>
                        <Message v-show="form.processing" severity="secondary" class="mt-6">جار معالجة الطلب...</Message>
                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
