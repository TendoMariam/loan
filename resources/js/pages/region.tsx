import { Form, Head, router, usePage } from '@inertiajs/react';
import { Plus, SquarePen, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import RegionController from '@/actions/App/Http/Controllers/RegionController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { index } from '@/routes/regions';
import type { Region } from '@/types';

type RegionFilters = {
    search: string;
    sort:
        | 'name_asc'
        | 'name_desc'
        | 'code_asc'
        | 'code_desc'
        | 'newest'
        | 'oldest';
};

type PageProps = {
    regions: Region[];
    filters: RegionFilters;
};

const FILTER_DEFAULTS: RegionFilters = {
    search: '',
    sort: 'name_asc',
};

function RegionFormFields({
    region,
    errors,
}: {
    region?: Region;
    errors: Record<string, string>;
}) {
    return (
        <>
            <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    name="name"
                    required
                    autoFocus
                    defaultValue={region?.name ?? ''}
                    placeholder="Region name"
                />
                <InputError message={errors.name} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="code">Code</Label>
                <Input
                    id="code"
                    name="code"
                    required
                    defaultValue={region?.code ?? ''}
                    placeholder="Region code"
                />
                <InputError message={errors.code} />
            </div>
        </>
    );
}

export default function RegionPage() {
    const { regions, filters } = usePage<PageProps>().props;
    const [editingRegion, setEditingRegion] = useState<Region | null>(null);
    const [regionToDelete, setRegionToDelete] = useState<Region | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const activeFilters = useMemo(
        () => ({ ...FILTER_DEFAULTS, ...filters }),
        [filters],
    );
    const [filterForm, setFilterForm] = useState<RegionFilters>(activeFilters);

    useEffect(() => {
        setFilterForm(activeFilters);
    }, [activeFilters]);

    const applyFilters = (nextFilters: RegionFilters) => {
        router.get(
            index.url({
                query: {
                    ...nextFilters,
                    search: nextFilters.search.trim(),
                },
            }),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const resetFilters = () => {
        applyFilters(FILTER_DEFAULTS);
    };

    const handleDelete = () => {
        if (!regionToDelete) {
            return;
        }

        setDeletingId(regionToDelete.id);

        router.delete(RegionController.destroy.url(regionToDelete), {
            preserveScroll: true,
            onFinish: () => {
                setDeletingId(null);
            },
            onSuccess: () => {
                setRegionToDelete(null);
            },
        });
    };

    return (
        <>
            <Head title="Regions" />

            <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <Heading
                        variant="small"
                        title="Regions"
                        description="Manage available regions with filters and quick actions."
                    />

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus />
                                Add region
                            </Button>
                        </DialogTrigger>

                        <DialogContent>
                            <DialogTitle>Add region</DialogTitle>
                            <DialogDescription>
                                Create a new region available to your users.
                            </DialogDescription>

                            <Form
                                {...RegionController.store.form()}
                                options={{ preserveScroll: true }}
                                resetOnSuccess
                                className="space-y-6"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <RegionFormFields errors={errors} />

                                        <DialogFooter className="gap-2">
                                            <DialogClose asChild>
                                                <Button variant="secondary">
                                                    Cancel
                                                </Button>
                                            </DialogClose>
                                            <Button disabled={processing}>
                                                Save
                                            </Button>
                                        </DialogFooter>
                                    </>
                                )}
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="rounded-lg border border-border bg-card p-4 sm:p-5">
                    <div className="grid gap-4 md:grid-cols-4">
                        <div className="md:col-span-2">
                            <Label htmlFor="search">Search</Label>
                            <Input
                                id="search"
                                value={filterForm.search}
                                onChange={(event) =>
                                    setFilterForm((previous) => ({
                                        ...previous,
                                        search: event.target.value,
                                    }))
                                }
                                placeholder="Search by name or code"
                            />
                        </div>

                        <div className="md:col-start-4">
                            <Label htmlFor="sort">Sort by</Label>
                            <Select
                                value={filterForm.sort}
                                onValueChange={(
                                    value:
                                        | 'name_asc'
                                        | 'name_desc'
                                        | 'code_asc'
                                        | 'code_desc'
                                        | 'newest'
                                        | 'oldest',
                                ) =>
                                    setFilterForm((previous) => ({
                                        ...previous,
                                        sort: value,
                                    }))
                                }
                            >
                                <SelectTrigger id="sort" className="w-full">
                                    <SelectValue placeholder="Sort" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="name_asc">
                                        Name (A-Z)
                                    </SelectItem>
                                    <SelectItem value="name_desc">
                                        Name (Z-A)
                                    </SelectItem>
                                    <SelectItem value="code_asc">
                                        Code (A-Z)
                                    </SelectItem>
                                    <SelectItem value="code_desc">
                                        Code (Z-A)
                                    </SelectItem>
                                    <SelectItem value="newest">
                                        Newest first
                                    </SelectItem>
                                    <SelectItem value="oldest">
                                        Oldest first
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="md:col-span-4 flex flex-wrap gap-2">
                            <Button
                                type="button"
                                onClick={() => applyFilters(filterForm)}
                            >
                                Apply filters
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => {
                                    setFilterForm(FILTER_DEFAULTS);
                                    resetFilters();
                                }}
                            >
                                Reset
                            </Button>
                        </div>
                    </div>
                </div>

                {regions.length === 0 ? (
                    <Alert>
                        <AlertTitle>No regions found</AlertTitle>
                        <AlertDescription>
                            Add your first region or adjust your filters.
                        </AlertDescription>
                    </Alert>
                ) : (
                    <div className="rounded-lg border border-border bg-card">
                        <div className="w-full overflow-x-auto">
                            <Table className="w-full">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Code</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {regions.map((region) => (
                                        <TableRow key={region.id}>
                                            <TableCell className="font-medium">
                                                {region.name}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {region.code}
                                            </TableCell>
                                            <TableCell className="text-right whitespace-nowrap">
                                                <div className="inline-flex flex-wrap justify-end gap-2">
                                                    <Dialog
                                                        open={
                                                            editingRegion?.id ===
                                                            region.id
                                                        }
                                                        onOpenChange={(open) => {
                                                            setEditingRegion(
                                                                open
                                                                    ? region
                                                                    : null,
                                                            );
                                                        }}
                                                    >
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                size="sm"
                                                                variant="secondary"
                                                            >
                                                                <SquarePen />
                                                                Edit
                                                            </Button>
                                                        </DialogTrigger>

                                                        <DialogContent>
                                                            <DialogTitle>
                                                                Edit region
                                                            </DialogTitle>
                                                            <DialogDescription>
                                                                Update this
                                                                region details.
                                                            </DialogDescription>

                                                            <Form
                                                                key={
                                                                    editingRegion?.id
                                                                }
                                                                {...RegionController.update.form(
                                                                    region,
                                                                )}
                                                                options={{
                                                                    preserveScroll:
                                                                        true,
                                                                }}
                                                                className="space-y-6"
                                                                onSuccess={() =>
                                                                    setEditingRegion(
                                                                        null,
                                                                    )
                                                                }
                                                            >
                                                                {({
                                                                    processing,
                                                                    errors,
                                                                }) => (
                                                                    <>
                                                                        <RegionFormFields
                                                                            region={
                                                                                region
                                                                            }
                                                                            errors={
                                                                                errors
                                                                            }
                                                                        />

                                                                        <DialogFooter className="gap-2">
                                                                            <DialogClose asChild>
                                                                                <Button variant="secondary">
                                                                                    Cancel
                                                                                </Button>
                                                                            </DialogClose>
                                                                            <Button
                                                                                disabled={
                                                                                    processing
                                                                                }
                                                                            >
                                                                                Save
                                                                            </Button>
                                                                        </DialogFooter>
                                                                    </>
                                                                )}
                                                            </Form>
                                                        </DialogContent>
                                                    </Dialog>

                                                    <Dialog
                                                        open={
                                                            regionToDelete?.id ===
                                                            region.id
                                                        }
                                                        onOpenChange={(open) => {
                                                            setRegionToDelete(
                                                                open
                                                                    ? region
                                                                    : null,
                                                            );
                                                        }}
                                                    >
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                size="sm"
                                                                variant="destructive"
                                                            >
                                                                <Trash2 />
                                                                Delete
                                                            </Button>
                                                        </DialogTrigger>

                                                        <DialogContent>
                                                            <DialogTitle>
                                                                Delete region
                                                            </DialogTitle>
                                                            <DialogDescription>
                                                                This action
                                                                cannot be
                                                                undone.
                                                            </DialogDescription>

                                                            <Alert variant="destructive">
                                                                <AlertTitle>
                                                                    Please
                                                                    confirm
                                                                </AlertTitle>
                                                                <AlertDescription>
                                                                    You are
                                                                    about to
                                                                    delete{' '}
                                                                    {region.name}
                                                                    .
                                                                </AlertDescription>
                                                            </Alert>

                                                            <DialogFooter className="gap-2">
                                                                <DialogClose asChild>
                                                                    <Button variant="secondary">
                                                                        Cancel
                                                                    </Button>
                                                                </DialogClose>
                                                                <Button
                                                                    variant="destructive"
                                                                    disabled={
                                                                        deletingId ===
                                                                        region.id
                                                                    }
                                                                    onClick={
                                                                        handleDelete
                                                                    }
                                                                >
                                                                    Confirm
                                                                    delete
                                                                </Button>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

RegionPage.layout = {
    breadcrumbs: [
        {
            title: 'Regions',
            href: index(),
        },
    ],
};
