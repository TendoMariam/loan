<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BrancheSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $brnaches = [
            'Western' => [
                ['code' => 'MBR', 'name' => 'Mbarara'],
                ['code' => 'KAB', 'name' => 'Kabale'],
                ['code' => 'FOP', 'name' => 'Fort Portal'],
                ['code' => 'BUS', 'name' => 'Bushenyi'],
                ['code' => 'KABW', 'name' => 'Kabwohe'],
            ],
            'Eastern' => [
                ['code' => 'JIJ', 'name' => 'Jinja'],
                ['code' => 'MBA', 'name' => 'Mbale'],
                ['code' => 'IGG', 'name' => 'Iganga'],
                ['code' => 'BUG', 'name' => 'Bugiri'],
                ['code' => 'KAM', 'name' => 'Kamuli'],
            ],
            'Northern' => [
                ['code' => 'LIR', 'name' => 'Lira'],
                ['code' => 'ARU', 'name' => 'Arua'],
                ['code' => 'GUL', 'name' => 'Gulu Branch'],
                ['code' => 'PAD', 'name' => 'Pader'],
                ['code' => 'BWE', 'name' => 'Bweyale'],
            ],
            'Central' => [
                ['code' => 'CIT', 'name' => 'City Centre'],
                ['code' => 'MAS', 'name' => 'Masaka'],
                ['code' => 'KAW', 'name' => 'Kawempe'],
                ['code' => 'NAK', 'name' => 'Nakulabye'],
                ['code' => 'GAY', 'name' => 'Gayaza'],
            ],
        ];

        $regions = DB::table('regions')->get();
        $regionMap = [];
        foreach ($regions as $region) {
            $regionMap[$region->name] = $region->id;
        }

        foreach ($brnaches as $regionName => $branches) {
            $regionId = $regionMap[$regionName] ?? null;
            if ($regionId) {
                foreach ($branches as $branch) {
                    DB::table('branches')->insert([
                        'code' => $branch['code'],
                        'name' => $branch['name'],
                        'region_id' => $regionId,
                    ]);
                }
            }
        }
    }
}
