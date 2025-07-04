<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin_email = 'admin@quickform.com';

        // Check if admin user already exists
        $adminExists = User::where('email', $admin_email)->exists();

        if (!$adminExists) {
            User::create([
                'name' => 'Admin User',
                'email' => $admin_email,
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ]);

            $this->command->info('Admin user created successfully!');
            $this->command->info('Email: ' . $admin_email);
            $this->command->info('Password: password123');
        } else {
            $this->command->info('Admin user already exists.');
        }
    }
}
