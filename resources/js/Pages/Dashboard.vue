<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head } from '@inertiajs/vue3';
import {onMounted, ref} from "vue";
import {ProductService} from "@/Service/ProductService.js";
onMounted(() => {
    ProductService.getProductsMini().then((data) => (products.value = data));
});
const products = ref();

</script>

<template>
    <Head title="Dashboard" />

    <AuthenticatedLayout>
        <template #header>
            <h2
                class="text-xl font-semibold leading-tight text-gray-800"
            >
                Dashboard
            </h2>
        </template>

        <div class="py-12">
            <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div
                    class="overflow-hidden bg-white shadow-sm sm:rounded-lg"
                >

                    <div class="p-6 text-gray-900">
                        <DataTable :value="products" tableStyle="min-width: 50rem; direction: rtl !important;">
                            <Column field="code" header="Code" style="direction: rtl !important;"></Column>
                            <Column field="name" header="Name"></Column>
                            <Column field="category" header="Category"></Column>
                            <Column field="quantity" header="Quantity"></Column>
                        </DataTable>

                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
