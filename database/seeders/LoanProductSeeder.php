<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LoanProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $loanProducts = [
            [
                'name' => 'Agricultural Loans',
                'description' => 'Access finance for agricultural activities. This loan targets individual clients in rural or peri-urban areas engaged in agribusiness activities along the agricultural value chain.',
            ],
            [
                'name' => 'School Fees Loan',
                'description' => 'Build a career with Pride. This loan enables parents, guardians, or students to access funds for school fees upfront, with the flexibility to repay in manageable installments.',
            ],
            [
                'name' => 'Salary Loan',
                'description' => 'Quick support when you need it most. This loan product is designed for civil servants and salaried employees in the private sector who have immediate financial needs or emergencies.',
            ],
            [
                'name' => 'Business Loan (PBL)',
                'description' => 'Give your business a push. This loan product offers a fast and secure way to boost your income and capital. It is ideal for entrepreneurs engaged in income-generating activities who want to grow their business or finance other business needs.',
            ],
            [
                'name' => 'Mortgage Loan',
                'description' => 'A flexible and affordable financing solution for property development, purchase, or equity release-tailored for individuals and businesses investing in real estate.',
            ],
            [
                'name' => 'Contingency Loans',
                'description' => 'A quick financing solution for existing clients facing unexpected expenses in their businesses or personal lives, such as tax obligations, tyre replacements, mechanical repairs, road licenses, stock replenishment, funeral expenses, payment for damages, and more.',
            ],
            [
                'name' => 'Clean Energy Loan',
                'description' => 'Improve your life with affordable energy. The Clean Energy Loan enables you to improve your quality of life by giving you access to affordable, cost-saving, and environmentally friendly solutions such as solar systems, briquette stoves, water purifiers, and biogas plants.',
            ],
            [
                'name' => 'Youth Inclusion Program Loan',
                'description' => 'A specialized loan targeting youth (aged 18 to 30) to help them access loans ranging from UGX 300,000 to UGX 500,000 alongside savings products, self-paced online training, and competitive interest rates with no security required.',
            ],
            [
                'name' => 'Tondeka Facility',
                'description' => 'A facility specifically designed to support MSMEs led by women, youth, and Forcibly Displaced Persons (FDPs) who have been in business for at least 6 months.',
            ],
        ];

        foreach ($loanProducts as $loanProduct) {
            $exists = DB::table('loan_products')->where('name', $loanProduct['name'])->exists();

            if ($exists) {
                continue;
            }

            DB::table('loan_products')->insert([
                'name' => $loanProduct['name'],
                'description' => $loanProduct['description'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
