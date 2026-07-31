<?php

namespace App\Models;

use Database\Factories\LoanProductFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LoanProduct extends Model
{
    /** @use HasFactory<LoanProductFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
    ];

    public function loanApplications(): HasMany
    {
        return $this->hasMany(LoanApplication::class);
    }
}
