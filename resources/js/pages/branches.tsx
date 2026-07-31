import { Form, Head, router, usePage } from '@inertiajs/react';
import { Plus, SquarePen, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import BrancheController from '@/actions/App/Http/Controllers/BrancheController';
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
import { index } from '@/routes/branch';
import type { Branch, Region } from '@/types';

type BranchFilters = {
    search: string;
    region_id: string;
    sort:
        | 'name_asc'
        | 'name_desc'
        | 'code_asc'
        | 'code_desc'
        | 'newest'
        | 'oldest';
};

type PageProps = {
    branches: Branch[];
    regions: Pick<Region, 'id' | 'name'>[];
    filters: BranchFilters;
};

const FILTER_DEFAULTS: BranchFilters = {
    search: '',
    region_id: 'all',
    sort: 'name_asc',
};

function BranchFormFields({
    branch,
    regions,
    errors,
}: {
    branch?: Branch;
    regions: Pick<Region, 'id' | 'name'>[];
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
                    defaultValue={branch?.name ?? ''}
                    placeholder="Branch name"
                />
                <InputError message={errors.name} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="code">Code</Label>
                <Input
                    id="code"
                    name="code"
                    required
                    defaultValue={branch?.code ?? ''}
                    placeholder="Branch code"
                />
                <InputError message={errors.code} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="region_id">Region</Label>
                <select
                    id="region_id"
                    name="region_id"
                    defaultValue={branch?.region_id ?? ''}
                    className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                    required
                >
                    <option value="" disabled>
                        Select a region
                    </option>
                    {regions.map((region) => (
                        <option key={region.id} value={region.id}>
                            {region.name}
                        </option>
                    ))}
                </select>
                <InputError message={errors.region_id} />
            </div>
        </>
    );
}

export default function BranchesPage() {
    const { branches, regions, filters } = usePage<PageProps>().props;
    const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
    const [branchToDelete, setBranchToDelete] = useState<Branch | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const activeFilters = useMemo(
        () => ({ ...FILTER_DEFAULTS, ...filters }),
        [filters],
    );
    const [filterForm, setFilterForm] = useState<BranchFilters>(activeFilters);

    useEffect(() => {
        setFilterForm(activeFilters);
    }, [activeFilters]);

    const applyFilters = (nextFilters: BranchFilters) => {
        router.get(
            index.url({
                query: {
                    ...nextFilters,
                    search: nextFilters.search.trim(),
                    region_id:
                        nextFilters.region_id === 'all'
                            ? undefined
                            : nextFilters.region_id,
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
        if (!branchToDelete) {
            return;
        }

        setDeletingId(branchToDelete.id);

        router.delete(BrancheController.destroy.url(branchToDelete.id), {
            preserveScroll: true,
            onFinish: () => {
                setDeletingId(null);
            },
            onSuccess: () => {
                setBranchToDelete(null);
            },
        });
    };

    return (
        <>
            <Head title="Branches" />

            <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <Heading
                        variant="small"
                        title="Branches"
                        description="Manage available branches with filters and quick actions."
                    />

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus />
                                Add branch
                            </Button>
                        </DialogTrigger>

                        <DialogContent>
                            <DialogTitle>Add branch</DialogTitle>
                            <DialogDescription>
                                Create a new branch available to your users.
                            </DialogDescription>

                            <Form
                                {...BrancheController.store.form()}
                                options={{ preserveScroll: true }}
                                resetOnSuccess
                                className="space-y-6"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <BranchFormFields
                                            regions={regions}
                                            errors={errors}
                                        />

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
                                placeholder="Search by name, code or region"
                            />
                        </div>

                        <div>
                            <Label htmlFor="region_filter">Region</Label>
                            <Select
                                value={filterForm.region_id}
                                onValueChange={(value) =>
                                    setFilterForm((previous) => ({
                                        ...previous,
                                        region_id: value,
                                    }))
                                }
                            >
                                <SelectTrigger
                                    id="region_filter"
                                    className="w-full"
                                >
                                    <SelectValue placeholder="All regions" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All regions
                                    </SelectItem>
                                    {regions.map((region) => (
                                        <SelectItem
                                            key={region.id}
                                            value={String(region.id)}
                                        >
                                            {region.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
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

                {branches.length === 0 ? (
                    <Alert>
                        <AlertTitle>No branches found</AlertTitle>
                        <AlertDescription>
                            Add your first branch or adjust your filters.
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
                                        <TableHead>Region</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {branches.map((branch) => (
                                        <TableRow key={branch.id}>
                                            <TableCell className="font-medium">
                                                {branch.name}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {branch.code}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {branch.region?.name}
                                            </TableCell>
                                            <TableCell className="text-right whitespace-nowrap">
                                                <div className="inline-flex flex-wrap justify-end gap-2">
                                                    <Dialog
                                                        open={
                                                            editingBranch?.id ===
                                                            branch.id
                                                        }
                                                        onOpenChange={(open) => {
                                                            setEditingBranch(
                                                                open
                                                                    ? branch
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
                                                                Edit branch
                                                            </DialogTitle>
                                                            <DialogDescription>
                                                                Update this
                                                                branch details.
                                                            </DialogDescription>

                                                            <Form
                                                                key={
                                                                    editingBranch?.id
                                                                }
                                                                {...BrancheController.update.form(
                                                                    branch.id,
                                                                )}
                                                                options={{
                                                                    preserveScroll:
                                                                        true,
                                                                }}
                                                                className="space-y-6"
                                                                onSuccess={() =>
                                                                    setEditingBranch(
                                                                        null,
                                                                    )
                                                                }
                                                            >
                                                                {({
                                                                    processing,
                                                                    errors,
                                                                }) => (
                                                                    <>
                                                                        <BranchFormFields
                                                                            branch={
                                                                                branch
                                                                            }
                                                                            regions={
                                                                                regions
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
                                                            branchToDelete?.id ===
                                                            branch.id
                                                        }
                                                        onOpenChange={(open) => {
                                                            setBranchToDelete(
                                                                open
                                                                    ? branch
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
                                                                Delete branch
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
                                                                    {branch.name}
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
                                                                        branch.id
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

BranchesPage.layout = {
    breadcrumbs: [
        {
            title: 'Branches',
            href: index(),
        },
    ],
};
