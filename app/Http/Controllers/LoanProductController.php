<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLoanProductRequest;
use App\Http\Requests\UpdateLoanProductRequest;
use App\Models\LoanProduct;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LoanProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'has_description' => ['nullable', 'in:all,with,without'],
            'sort' => ['nullable', 'in:name_asc,name_desc,newest,oldest'],
        ]);

        $search = $validated['search'] ?? null;
        $hasDescription = $validated['has_description'] ?? 'all';
        $sort = $validated['sort'] ?? 'name_asc';

        $query = LoanProduct::query()
            ->select(['id', 'name', 'description', 'created_at', 'updated_at'])
            ->when($search, function ($builder, string $term) {
                $builder->where(function ($subQuery) use ($term) {
                    $subQuery
                        ->where('name', 'like', "%{$term}%")
                        ->orWhere('description', 'like', "%{$term}%");
                });
            })
            ->when($hasDescription === 'with', function ($builder) {
                $builder->whereNotNull('description')->where('description', '!=', '');
            })
            ->when($hasDescription === 'without', function ($builder) {
                $builder->where(function ($subQuery) {
                    $subQuery->whereNull('description')->orWhere('description', '');
                });
            });

        match ($sort) {
            'name_desc' => $query->orderByDesc('name'),
            'newest' => $query->latest(),
            'oldest' => $query->oldest(),
            default => $query->orderBy('name'),
        };

        return Inertia::render('loanproduct', [
            'loanProducts' => $query->get(),
            'filters' => [
                'search' => $search ?? '',
                'has_description' => $hasDescription,
                'sort' => $sort,
            ],
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
