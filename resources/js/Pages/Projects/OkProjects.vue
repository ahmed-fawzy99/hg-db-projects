<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, Link } from '@inertiajs/vue3';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { ref, onMounted } from 'vue';
import {downloadPDF} from "@/Service/downloadPDF.js";
import {formatDate} from "../../Service/formatDate.js";


const props = defineProps({
    projects: Array
});

const shallowProjects = [...props.projects].map(project => {
    project.documents_delivery_fulfillment_date = project.documents_delivery_fulfillment_date ? new Date(project.documents_delivery_fulfillment_date) : null;
    project.finances_payment_date = project.finances_payment_date ? new Date(project.finances_payment_date) : null;
    project.initial_review_notes_delivery_to_coord_unit_date = project.initial_review_notes_delivery_to_coord_unit_date ? new Date(project.initial_review_notes_delivery_to_coord_unit_date) : null;
    project.owner_notes_delivery_after_fulfillment_date = project.owner_notes_delivery_after_fulfillment_date ? new Date(project.owner_notes_delivery_after_fulfillment_date) : null;
    project.coord_unit_review_date = project.coord_unit_review_date ? new Date(project.coord_unit_review_date) : null;
    project.unit_project_approval_date = project.unit_project_approval_date ? new Date(project.unit_project_approval_date) : null;
    return project;
});

const filters = ref();

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        location: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        consultant_name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        code: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        documents_delivery_fulfillment_date:  { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        financial_status: { value: null, matchMode: FilterMatchMode.EQUALS },
        finances_payment_date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        initial_review_notes_delivery_to_coord_unit_date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        owner_notes_delivery_after_fulfillment_date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        coord_unit_review_date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        unit_project_approval_date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
    };
};

initFilters();

const clearFilter = () => {
    initFilters();
};
const filteredData = ref([]);
const onFilter = (event) => {
    filteredData.value = event.filteredValue;
};
</script>

<template>
    <Head title="All Projects" />
    <AuthenticatedLayout>
        <div class="py-6">
            <div class="mx-auto  sm:px-6 lg:px-8">
                <div class="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                    <div class="p-6 text-gray-900">
                        <h1 class="text-3xl font-semibold pb-4">مشروعات تامة</h1>

                        <DataTable :value="shallowProjects" removableSort stripedRows :row-hover="true"
                                   :paginator="shallowProjects.length > 25" :rows="25" :rowsPerPageOptions="[5, 10, 20, 50]"
                                   v-model:filters="filters" dataKey="id" filterDisplay="menu"
                                   v-on:filter="onFilter"
                                   :globalFilterFields="['name', 'location', 'representative.name', 'code', 'consultant_name', 'documents_delivery_fulfillment_date', 'financial_status', 'finances_payment_date', 'initial_review_notes_delivery_to_coord_unit_date', 'owner_notes_delivery_after_fulfillment_date', 'coord_unit_review_date', 'unit_project_approval_date', 'project_material_links']"
                                   class="text-sm" tableStyle="min-width: 50rem;">
                            <template #header>
                                <div class="flex max-md:flex-col justify-between gap-4">
                                    <div class="flex max-md:flex-col gap-4">
                                        <Button type="button" icon="pi pi-filter-slash" label="مسح التصفيات" outlined @click="clearFilter()" />
                                        <Button type="button" icon="pi pi-file-pdf" label="تحميل PDF" outlined @click="downloadPDF(filteredData)" />
                                    </div>                                    <IconField>
                                        <InputIcon>
                                            <i class="pi pi-search" />
                                        </InputIcon>
                                        <InputText v-model="filters['global'].value" placeholder="بحث عام..." />
                                    </IconField>
                                </div>
                            </template>
                          <Column header="م"  :showFilterOperator="false" :showAddButton="false">
                            <template #body="{ data, index }">
                              {{ index + 1 }}
                            </template>
                          </Column>
                            <Column field="name" header="اسم المشروع"  :showFilterOperator="false" :showAddButton="false"  sortable>
                                <template #filter="{ filterModel }">
                                    <InputText v-model="filterModel.value" type="text" placeholder="البحث بالإسم" />
                                </template>
                            </Column>
                            <Column field="location" header="الموقع"  :showFilterOperator="false" :showAddButton="false" sortable>
                                <template #filter="{ filterModel }">
                                    <InputText v-model="filterModel.value" type="text" placeholder="البحث بالموقع" />
                                </template>
                            </Column>
                            <Column field="code" header="كود المشروع"  :showFilterOperator="false" :showAddButton="false" sortable>
                                <template #filter="{ filterModel }">
                                    <InputText v-model="filterModel.value" type="text" placeholder="البحث بالكود" />
                                </template>
                            </Column>
                            <Column field="consultant_name" header="اسم الاستشاري"  :showFilterOperator="false" :showAddButton="false" sortable>
                                <template #body="{ data }">
                                    {{ data.consultant_name ?? 'لا يوجد'}}
                                </template>
                                <template #filter="{ filterModel }">
                                    <InputText v-model="filterModel.value" type="text" placeholder="البحث بإسم الاستشاري" />
                                </template>
                            </Column>
                            <Column field="documents_delivery_fulfillment_date" header="تاريخ استلام واستيفاء مستندات المشروع"  :showFilterOperator="false" :showAddButton="false"  filterField="documents_delivery_fulfillment_date" dataType="date" sortable>
                                <template #body="{ data }">
                                    <span v-if="data.documents_delivery_fulfillment_date">
                                        {{formatDate(data.documents_delivery_fulfillment_date)}}
                                    </span>
                                    <span v-else>لا يوجد</span>
                                </template>
                                <template #filter="{ filterModel }">
                                    <DatePicker v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" />
                                </template>
                            </Column>
                            <Column field="financial_status" header="تمام تسديد المطالبة المالية (نعم / لا)"  :showFilterOperator="false" :showAddButton="false" sortable>
                                <template #body="{ data }">
                                    {{ data.financial_status ? 'نعم' : 'لا' }}
                                </template>
                                <template #filter="{ filterModel }">
                                    <label for="verified-filter" class="font-bold"> Verified </label>
                                    <Checkbox v-model="filterModel.value" :indeterminate="filterModel.value === null" binary inputId="verified-filter" />
                                </template>
                            </Column>
                            <Column field="finances_payment_date" header="تاريخ تسديد المطالبة المالية"  :showFilterOperator="false" :showAddButton="false"  filterField="finances_payment_date" dataType="date" sortable>
                                <template #body="{ data }">
                                    <span v-if="data.finances_payment_date">
                                        {{formatDate(data.finances_payment_date)}}
                                    </span>
                                    <span v-else>لا يوجد</span>
                                </template>
                                <template #filter="{ filterModel }">
                                    <DatePicker v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" />
                                </template>
                            </Column>
                            <Column field="initial_review_notes_delivery_to_coord_unit_date" header="تاريخ انتهاء اللجنة الفنية من مراجعة المشروع وتسيلم الملاحظات الأولية لوحدة التنسيق الفني"  :showFilterOperator="false" :showAddButton="false"  filterField="initial_review_notes_delivery_to_coord_unit_date" dataType="date" sortable>
                                <template #body="{ data }">
                                    <span v-if="data.initial_review_notes_delivery_to_coord_unit_date" class="text-teal-600">
                                        {{formatDate(data.initial_review_notes_delivery_to_coord_unit_date)}}
                                    </span>
                                    <span v-else>لا يوجد</span>
                                </template>
                                <template #filter="{ filterModel }">
                                    <DatePicker v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" />
                                </template>
                            </Column>
                            <Column field="owner_notes_delivery_after_fulfillment_date" header="تاريخ تسليم المالك للملاحظات لوحدة التنسيق بعد استيفاؤها"  :showFilterOperator="false" :showAddButton="false"  filterField="owner_notes_delivery_after_fulfillment_date" dataType="date" sortable>
                                <template #body="{ data }">
                                    <span v-if="data.owner_notes_delivery_after_fulfillment_date">
                                        {{formatDate(data.owner_notes_delivery_after_fulfillment_date)}}
                                    </span>
                                    <span v-else>لا يوجد</span>
                                </template>
                                <template #filter="{ filterModel }">
                                    <DatePicker v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" />
                                </template>
                            </Column>
                            <Column field="coord_unit_review_date" header="تاريخ مراجعة اللجنة الرئيسية للمشروع بعد استيفاء المالك للملاحظات ومراجعة اللجنة الفنية"  :showFilterOperator="false" :showAddButton="false"  filterField="coord_unit_review_date" dataType="date" sortable>
                                <template #body="{ data }">
                                    <span v-if="data.coord_unit_review_date">
                                        {{formatDate(data.coord_unit_review_date)}}
                                    </span>
                                    <span v-else>لا يوجد</span>
                                </template>
                                <template #filter="{ filterModel }">
                                    <DatePicker v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" />
                                </template>
                            </Column>
                            <Column field="unit_project_approval_date" header="تاريخ اعتماد اللجنة الرئيسية للمشروع بعد استيفاء جميع الملاحظات"  :showFilterOperator="false" :showAddButton="false" filterField="unit_project_approval_date" dataType="date" sortable>
                                <template #body="{ data }">
                                    <span v-if="data.unit_project_approval_date">
                                        {{formatDate(data.unit_project_approval_date)}}
                                    </span>
                                    <span v-else>لا يوجد</span>
                                </template>
                                <template #filter="{ filterModel }">
                                    <DatePicker v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" />
                                </template>
                            </Column>
                            <Column field="project_material_links" header="رابط وثائق المشروع"  :showFilterOperator="false" :showAddButton="false">
                                <template #body="{ data }">
                                    <a v-if="data.project_material_links" class="underline text-primary" :href="data.project_material_links" target="_blank">الرابط</a>
                                    <span v-else>لا يوجد</span>
                                </template>
                            </Column>
                            <Column header="مهمات" v-if="$page.props.auth.user.role === 'admin'">
                                <template #body="{ data }">
                                    <Link :href="route('edit-project', {id: data.id})" class="ps-2  text-primary inline-flex"> <span class="pi pi-pencil text-primary pe-1 !text-sm" />تعديل</Link>
                                </template>
                            </Column>

                        </DataTable>

                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
