<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Project>
 */
class ProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Generate a finance payment date
        $financesPaymentDate = $this->faker->date();

        // Generate the initial technical review date
        $initialTechnicalReviewDate = $this->faker->dateTimeBetween($financesPaymentDate, '+2 months')->format('Y-m-d');

        // Randomly decide if it should be less than 15 days after finances payment date
        if ($this->faker->boolean(50)) {
            // Ensure this date is less than 15 days after the finances payment date
            $initialTechnicalReviewDate = date('Y-m-d', strtotime($financesPaymentDate . ' + ' . rand(1, 14) . ' days'));
        }

        return [
            'name' => $this->faker->company(),
            'location' => $this->faker->city('ar_SA'),
            'code' => $this->faker->unique()->numerify('###-####'),
            'consultant_name' => $this->faker->name('ar_SA'),
            'documents_delivery_fulfillment_date' => $this->faker->date(),
            'financial_status' => $this->faker->boolean,
            'finances_payment_date' => $financesPaymentDate,
            'initial_review_notes_delivery_to_coord_unit_date' => $initialTechnicalReviewDate,
            'owner_notes_delivery_after_fulfillment_date' => $this->faker->date(),
            'coord_unit_review_date' => $this->faker->date(),
            'unit_project_approval_date' => $this->faker->date(),
            'project_material_links' => $this->faker->url(),
        ];
    }
}
