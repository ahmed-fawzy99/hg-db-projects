<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('location');
            $table->string('code');
            $table->string('consultant_name')->nullable();
            $table->date('documents_delivery_fulfillment_date')->nullable();
            $table->boolean('financial_status')->default(false)->nullable();
            $table->date('finances_payment_date')->nullable();
            $table->date('initial_review_notes_delivery_to_coord_unit_date')->nullable();
            $table->date('owner_notes_delivery_after_fulfillment_date')->nullable();
            $table->date('coord_unit_review_date')->nullable();
            $table->date('unit_project_approval_date')->nullable();
            $table->string('project_material_links')->nullable();
            $table->text('civil_defense_notes')->nullable();
            $table->text('architectural_notes')->nullable();
            $table->text('electromechanical_notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
