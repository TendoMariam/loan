<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRegionRequest;
use App\Http\Requests\UpdateRegionRequest;
use App\Models\Region;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RegionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'sort' => ['nullable', 'in:name_asc,name_desc,code_asc,code_desc,newest,oldest'],
        ]);

        $search = $validated['search'] ?? null;
        $sort = $validated['sort'] ?? 'name_asc';

        $query = Region::query()
            ->select(['id', 'name', 'code', 'created_at', 'updated_at'])
            ->when($search, function ($builder, string $term) {
                $builder->where(function ($subQuery) use ($term) {
                    $subQuery
                        ->where('name', 'like', "%{$term}%")
                        ->orWhere('code', 'like', "%{$term}%");
                });
            });

        match ($sort) {
            'name_desc' => $query->orderByDesc('name'),
            'code_asc' => $query->orderBy('code'),
            'code_desc' => $query->orderByDesc('code'),
            'newest' => $query->latest(),
            'oldest' => $query->oldest(),
            default => $query->orderBy('name'),
        };

        $component = 'region';

        return Inertia::render($component, [
            'regions' => $query->get(),
            'filters' => [
                'search' => $search ?? '',
                'sort' => $sort,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): RedirectResponse
    {
        return to_route('regions.index');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRegionRequest $request): RedirectResponse
    {
        Region::create($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Region created.',
        ]);

        return to_route('regions.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Region $region): RedirectResponse
    {
        return to_route('regions.index');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Region $region): RedirectResponse
    {
        return to_route('regions.index');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRegionRequest $request, Region $region): RedirectResponse
    {
        $region->update($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Region updated.',
        ]);

        return to_route('regions.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Region $region): RedirectResponse
    {
        $region->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Region deleted.',
        ]);

        return to_route('regions.index');
    }
}
