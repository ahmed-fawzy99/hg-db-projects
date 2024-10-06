<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            ProjectSeeder::class,
        ]);
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'روت',
            'email' => 'super@root.com',
            'role' => 'admin',
        ]);
        User::factory()->create([
            'name' => 'يوزر',
            'email' => 'normal@user.com',
        ]);
    }
}
