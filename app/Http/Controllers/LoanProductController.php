<?php

namespace App\Http\Controllers;

use App\Models\LoanProduct;
use App\Http\Requests\StoreLoanProductRequest;
use App\Http\Requests\UpdateLoanProductRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class LoanProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('loan-products/index', [
            'loanProducts' => LoanProduct::orderBy('name')->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('loan-products/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLoanProductRequest $request): RedirectResponse
    {
        LoanProduct::create($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Loan product created.'),
        ]);

        return to_route('loan-products.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(LoanProduct $loanProduct): Response
    {
        return Inertia::render('loan-products/show', [
            'loanProduct' => $loanProduct,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(LoanProduct $loanProduct): Response
    {
        return Inertia::render('loan-products/edit', [
            'loanProduct' => $loanProduct,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLoanProductRequest $request, LoanProduct $loanProduct): RedirectResponse
    {
        $loanProduct->update($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Loan product updated.'),
        ]);

        return to_route('loan-products.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(LoanProduct $loanProduct): RedirectResponse
    {
        $loanProduct->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Loan product deleted.'),
        ]);

        return to_route('loan-products.index');
    }
}
