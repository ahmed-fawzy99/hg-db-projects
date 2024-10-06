<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, Link } from '@inertiajs/vue3';
import {formatTimestamp} from "../../Service/formatDate.js";


const props = defineProps({
    users: Array
});

</script>

<template>
    <Head title="All Projects" />
    <AuthenticatedLayout>
        <div class="py-6">
            <div class="mx-auto  sm:px-6 lg:px-8">
                <div class="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                    <div class="p-6 text-gray-900">
                        <h1 class="text-3xl font-semibold pb-4">جميع المستخدمين</h1>

                        <DataTable :value="users" removableSort stripedRows :row-hover="true"
                                   :paginator="users.length > 25" :rows="25" :rowsPerPageOptions="[5, 10, 20, 50]"
                                   class="text-sm" tableStyle="min-width: 50rem;">
                            <Column header="م" sortable >
                                <template #body="data">
                                    <span>{{data.index + 1}}</span>
                                </template>
                            </Column>
                            <Column field="name" header="الاسم" sortable />
                            <Column field="email" header="البريد الالكتروني" sortable />
                            <Column field="role" header="الصلاحية" sortable>
                                <template #body="data">
                                    {{ data.data.role === 'admin' ? 'أدمن' : 'مستخدم' }}
                                </template>
                            </Column>
                            <Column field="created_at" header="تاريخ الإنشاء" sortable>
                                <template #body="slotProps">
                                    {{ formatTimestamp(slotProps.data.created_at) }}
                                </template>
                            </Column>
                            <Column header="مهمات">
                                <template #body="{ data }">
                                    <Link :href="route('users.edit', {id: data.id})" class="ps-2  text-primary inline-flex"> <span class="pi pi-pencil text-primary pe-1 !text-sm" />تعديل</Link>
                                </template>
                            </Column>

                        </DataTable>
                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
