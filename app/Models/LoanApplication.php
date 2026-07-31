<?php

namespace App\Models;

use Database\Factories\LoanApplicationFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class LoanApplication extends Model
{
    /** @use HasFactory<LoanApplicationFactory> */
    use HasFactory;

    protected $fillable = [
        'number',
        'amount',
        'application_date',
        'purpose',
        'interest_rate',
        'net_amount',
        'loan_type',
        'status',
        'created_by',
        'customer_id',
        'loan_product_id',
    ];

    protected static function booted(): void
    {
        static::creating(function (LoanApplication $loanApplication): void {
            if (blank($loanApplication->number)) {
                $loanApplication->number = self::generateUniqueApplicationNumber();
            }

            $loanApplication->net_amount = self::calculateNetAmount(
                $loanApplication->amount,
                $loanApplication->interest_rate,
            );
        });

        static::updating(function (LoanApplication $loanApplication): void {
            $loanApplication->net_amount = self::calculateNetAmount(
                $loanApplication->amount,
                $loanApplication->interest_rate,
            );
        });
    }

    public static function generateUniqueApplicationNumber(): string
    {
        do {
            $number = 'LN-'.now()->format('Ymd').'-'.Str::upper(Str::random(3));
        } while (self::query()->where('number', $number)->exists());

        return $number;
    }

    public static function calculateNetAmount(float|int|string $amount, float|int|string $interestRate): float
    {
        $amountValue = (float) $amount;
        $interestRateValue = (float) $interestRate;

        return round($amountValue + (($amountValue * $interestRateValue) / 100), 2);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function loanProduct(): BelongsTo
    {
        return $this->belongsTo(LoanProduct::class);
    }
}
