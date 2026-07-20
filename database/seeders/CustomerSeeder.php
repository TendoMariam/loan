<?php

namespace Database\Seeders;

use App\Models\Customer;
use Faker\Factory as Faker;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();

        $branches = DB::table('branches')->get();

        for ($i = 0; $i < 5; $i++) {
            Customer::create([
                'name' => $faker->name,
                'email' => $faker->unique()->safeEmail,
                'phone' => $faker->numerify('07########'),
                'address' => $faker->address,
                'nin' => 'CM'.$faker->numerify('##############').strtoupper($faker->randomLetter()),
                'created_by' => 1, // Assuming the user with ID 1 exists
                'branch_id' => $branches->random()->id,
            ]);
        }
    }
}
