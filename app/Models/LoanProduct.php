<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoanProduct extends Model
{
    /** @use HasFactory<\Database\Factories\LoanProductFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
    ];
}
