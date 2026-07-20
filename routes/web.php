<?php

use App\Http\Controllers\BrancheController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\LoanApplicationController;
use App\Http\Controllers\LoanProductController;
use App\Http\Controllers\RegionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route::inertia('/', 'welcome')->name('home');
Route::redirect('/', '/login')->name('home');
Route::redirect('/register', '/login');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::resource('loan-products', LoanProductController::class);
    Route::resource('regions', RegionController::class);
    Route::resource('branch', BrancheController::class);
    Route::resource('customers', CustomerController::class);
    Route::resource('loans', LoanApplicationController::class);
});

require __DIR__.'/settings.php';
