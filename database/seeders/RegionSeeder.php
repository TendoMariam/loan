<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RegionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $regions = [
            ['name' => 'Central', 'code' => 'CA'],
            ['name' => 'Western', 'code' => 'WI'],
            ['name' => 'Northern', 'code' => 'NO'],
            ['name' => 'Eastern', 'code' => 'EA'],
        ];

        foreach ($regions as $region) {
            $exists = DB::table('regions')->where('name', $region['name'])->exists();

            if ($exists) {
                continue;
            }

            DB::table('regions')->insert([
                'name' => $region['name'],
                'code' => $region['code'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
