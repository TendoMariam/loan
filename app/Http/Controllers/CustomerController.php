<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;
use App\Models\Branche;
use App\Models\Customer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'branch_id' => ['nullable', 'integer', 'exists:branches,id'],
            'sort' => ['nullable', 'in:name_asc,name_desc,newest,oldest'],
        ]);

        $search = $validated['search'] ?? null;
        $branchId = $validated['branch_id'] ?? null;
        $sort = $validated['sort'] ?? 'name_asc';

        $query = Customer::query()
            ->with('branch:id,name')
            ->select([
                'id',
                'name',
                'email',
                'phone',
                'address',
                'nin',
                'created_by',
                'branch_id',
                'created_at',
                'updated_at',
            ])
            ->when($search, function ($builder, string $term) {
                $builder->where(function ($subQuery) use ($term) {
                    $subQuery
                        ->where('name', 'like', "%{$term}%")
                        ->orWhere('email', 'like', "%{$term}%")
                        ->orWhere('phone', 'like', "%{$term}%")
                        ->orWhere('nin', 'like', "%{$term}%")
                        ->orWhereHas('branch', function ($branchQuery) use ($term) {
                            $branchQuery->where('name', 'like', "%{$term}%");
                        });
                });
            })
            ->when($branchId, function ($builder, int $id) {
                $builder->where('branch_id', $id);
            });

        match ($sort) {
            'name_desc' => $query->orderByDesc('name'),
            'newest' => $query->latest(),
            'oldest' => $query->oldest(),
            default => $query->orderBy('name'),
        };

        return Inertia::render('customers', [
            'customers' => $query->get(),
            'branches' => Branche::query()->select(['id', 'name'])->orderBy('name')->get(),
            'filters' => [
                'search' => $search ?? '',
                'branch_id' => $branchId ? (string) $branchId : 'all',
                'sort' => $sort,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): RedirectResponse
    {
        return to_route('customers.index');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCustomerRequest $request): RedirectResponse
    {
        Customer::create([
            ...$request->validated(),
            'created_by' => $request->user()->id,
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Customer created.',
        ]);

        return to_route('customers.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Customer $customer): RedirectResponse
    {
        return to_route('customers.index');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Customer $customer): RedirectResponse
    {
        return to_route('customers.index');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCustomerRequest $request, Customer $customer): RedirectResponse
    {
        $customer->update($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Customer updated.',
        ]);

        return to_route('customers.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Customer $customer): RedirectResponse
    {
        $customer->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Customer deleted.',
        ]);

        return to_route('customers.index');
    }
}
