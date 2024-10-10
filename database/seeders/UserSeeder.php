<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $randomPassword = Str::random(12);
        User::create([
            'name' => 'د. طارق الشيخ',
            'email' => 'tarek@al-sheikh.org',
            'role' => 'admin',
            'password' => bcrypt($randomPassword),
        ]);
        echo "User created with email: tarek@al-sheikh.org and password: " . $randomPassword . "\n";

        $randomPassword = Str::random(12);
        User::create([
            'name' => 'ل. حسن جابر',
            'email' => 'hgaber@gmail.com',
            'role' => 'admin',
            'password' => bcrypt($randomPassword),
        ]);
        echo "User created with email: hgaber@gmail.com and password: " . $randomPassword . "\n";

        $randomPassword = Str::random(12);
        User::create([
            'name' => 'أحمد دغيدي',
            'email' => 'ahmaddeghady99@gmail.com',
            'role' => 'admin',
            'password' => bcrypt($randomPassword),
        ]);
        echo "User created with email: ahmaddeghady99@gmail.com and password: " . $randomPassword . "\n";
    }
}
