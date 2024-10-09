<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProjectRequest extends FormRequest
{

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255|unique:projects,name,' . $this->id,
            'location' => 'required|string|max:255',
            'code' => 'required|string|max:255|unique:projects,code,' . $this->id,
            'consultant_name' => 'nullable|string|max:255',
            'documents_delivery_fulfillment_date' => 'nullable|date',
            'financial_status' => 'required|boolean',
            'finances_payment_date' => 'nullable|date',
            'initial_review_notes_delivery_to_coord_unit_date' => 'nullable|date',
            'owner_notes_receipt_date' => 'nullable|date',
            'owner_notes_delivery_after_fulfillment_date' => 'nullable|date',
            'coord_unit_review_date' => 'nullable|date',
            'unit_project_approval_date' => 'nullable|date',
            'project_material_links' => 'nullable|string|url:http,https',
            'civil_defense_notes' => 'nullable|string',
            'civil_defense_actions' => 'nullable|string',
            'architectural_notes' => 'nullable|string',
            'architectural_actions' => 'nullable|string',
            'electromechanical_notes' => 'nullable|string',
            'electromechanical_actions' => 'nullable|string',
            'other_notes' => 'nullable|string',
            'other_actions' => 'nullable|string',
            'review_letter' => 'nullable|file|mimes:pdf,doc,docx|max:40960',
        ];
    }
}
