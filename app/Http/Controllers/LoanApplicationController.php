<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLoanApplicationRequest;
use App\Http\Requests\UpdateLoanApplicationRequest;
use App\Models\Customer;
use App\Models\LoanApplication;
use App\Models\LoanProduct;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LoanApplicationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', 'in:all,pending,approved,rejected'],
            'loan_type' => ['nullable', 'in:all,new,top-up'],
            'sort' => ['nullable', 'in:newest,oldest,amount_asc,amount_desc'],
        ]);

        $search = $validated['search'] ?? null;
        $status = $validated['status'] ?? 'all';
        $loanType = $validated['loan_type'] ?? 'all';
        $sort = $validated['sort'] ?? 'newest';

        $query = LoanApplication::query()
            ->with([
                'customer:id,name',
                'loanProduct:id,name',
            ])
            ->select([
                'id',
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
                'created_at',
                'updated_at',
            ])
            ->when($search, function ($builder, string $term) {
                $builder->where(function ($subQuery) use ($term) {
                    $subQuery
                        ->where('number', 'like', "%{$term}%")
                        ->orWhere('purpose', 'like', "%{$term}%")
                        ->orWhereHas('customer', function ($customerQuery) use ($term) {
                            $customerQuery->where('name', 'like', "%{$term}%");
                        })
                        ->orWhereHas('loanProduct', function ($productQuery) use ($term) {
                            $productQuery->where('name', 'like', "%{$term}%");
                        });
                });
            })
            ->when($status !== 'all', function ($builder) use ($status) {
                $builder->where('status', $status);
            })
            ->when($loanType !== 'all', function ($builder) use ($loanType) {
                $builder->where('loan_type', $loanType);
            });

        match ($sort) {
            'oldest' => $query->oldest(),
            'amount_asc' => $query->orderBy('amount'),
            'amount_desc' => $query->orderByDesc('amount'),
            default => $query->latest(),
        };

        return Inertia::render('loans', [
            'loanApplications' => $query->get(),
            'customers' => Customer::query()->select(['id', 'name'])->orderBy('name')->get(),
            'loanProducts' => LoanProduct::query()->select(['id', 'name'])->orderBy('name')->get(),
            'filters' => [
                'search' => $search ?? '',
                'status' => $status,
                'loan_type' => $loanType,
                'sort' => $sort,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): RedirectResponse
    {
        return to_route('loans.index');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLoanApplicationRequest $request): RedirectResponse
    {
        LoanApplication::create([
            ...$request->validated(),
            'created_by' => $request->user()->id,
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Loan application created.',
        ]);

        return to_route('loans.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(LoanApplication $loan): RedirectResponse
    {
        return to_route('loans.index');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(LoanApplication $loan): RedirectResponse
    {
        return to_route('loans.index');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLoanApplicationRequest $request, LoanApplication $loan): RedirectResponse
    {
        $loan->update($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Loan application updated.',
        ]);

        return to_route('loans.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(LoanApplication $loan): RedirectResponse
    {
        $loan->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Loan application deleted.',
        ]);

        return to_route('loans.index');
    }
}
