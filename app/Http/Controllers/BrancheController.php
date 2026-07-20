<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBrancheRequest;
use App\Http\Requests\UpdateBrancheRequest;
use App\Models\Branche;
use App\Models\Region;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BrancheController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'region_id' => ['nullable', 'integer', 'exists:regions,id'],
            'sort' => ['nullable', 'in:name_asc,name_desc,code_asc,code_desc,newest,oldest'],
        ]);

        $search = $validated['search'] ?? null;
        $regionId = $validated['region_id'] ?? null;
        $sort = $validated['sort'] ?? 'name_asc';

        $query = Branche::query()
            ->with('region:id,name')
            ->select(['id', 'name', 'code', 'region_id', 'created_at', 'updated_at'])
            ->when($search, function ($builder, string $term) {
                $builder->where(function ($subQuery) use ($term) {
                    $subQuery
                        ->where('name', 'like', "%{$term}%")
                        ->orWhere('code', 'like', "%{$term}%")
                        ->orWhereHas('region', function ($regionQuery) use ($term) {
                            $regionQuery->where('name', 'like', "%{$term}%");
                        });
                });
            })
            ->when($regionId, function ($builder, int $id) {
                $builder->where('region_id', $id);
            });

        match ($sort) {
            'name_desc' => $query->orderByDesc('name'),
            'code_asc' => $query->orderBy('code'),
            'code_desc' => $query->orderByDesc('code'),
            'newest' => $query->latest(),
            'oldest' => $query->oldest(),
            default => $query->orderBy('name'),
        };

        $component = 'branches';

        return Inertia::render($component, [
            'branches' => $query->get(),
            'regions' => Region::query()->select(['id', 'name'])->orderBy('name')->get(),
            'filters' => [
                'search' => $search ?? '',
                'region_id' => $regionId ? (string) $regionId : 'all',
                'sort' => $sort,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): RedirectResponse
    {
        return to_route('branch.index');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBrancheRequest $request): RedirectResponse
    {
        Branche::create($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Branch created.',
        ]);

        return to_route('branch.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Branche $branch): RedirectResponse
    {
        return to_route('branch.index');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Branche $branch): RedirectResponse
    {
        return to_route('branch.index');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBrancheRequest $request, Branche $branch): RedirectResponse
    {
        $branch->update($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Branch updated.',
        ]);

        return to_route('branch.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Branche $branch): RedirectResponse
    {
        $branch->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Branch deleted.',
        ]);

        return to_route('branch.index');
    }
}
