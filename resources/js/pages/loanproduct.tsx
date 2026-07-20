import { Form, Head, router, usePage } from '@inertiajs/react';
import { Plus, SquarePen, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import LoanProductController from '@/actions/App/Http/Controllers/LoanProductController';
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
import { Textarea } from '@/components/ui/textarea';
import { index } from '@/routes/loan-products';
import type { LoanProduct } from '@/types';

type LoanProductFilters = {
    search: string;
    has_description: 'all' | 'with' | 'without';
    sort: 'name_asc' | 'name_desc' | 'newest' | 'oldest';
};

type PageProps = {
    loanProducts: LoanProduct[];
    filters: LoanProductFilters;
};

const FILTER_DEFAULTS: LoanProductFilters = {
    search: '',
    has_description: 'all',
    sort: 'name_asc',
};

function LoanProductFormFields({
    loanProduct,
    errors,
}: {
    loanProduct?: LoanProduct;
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
                    defaultValue={loanProduct?.name ?? ''}
                    placeholder="Product name"
                />
                <InputError message={errors.name} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    name="description"
                    defaultValue={loanProduct?.description ?? ''}
                    placeholder="A short description of this loan product"
                />
                <InputError message={errors.description} />
            </div>
        </>
    );
}

export default function LoanProductsPage() {
    const { loanProducts, filters } = usePage<PageProps>().props;
    const [editingProduct, setEditingProduct] = useState<LoanProduct | null>(
        null,
    );
    const [productToDelete, setProductToDelete] = useState<LoanProduct | null>(
        null,
    );
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const activeFilters = useMemo(
        () => ({ ...FILTER_DEFAULTS, ...filters }),
        [filters],
    );
    const [filterForm, setFilterForm] = useState<LoanProductFilters>(
        activeFilters,
    );

    useEffect(() => {
        setFilterForm(activeFilters);
    }, [activeFilters]);

    const applyFilters = (nextFilters: LoanProductFilters) => {
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
        if (!productToDelete) {
            return;
        }

        setDeletingId(productToDelete.id);

        router.delete(LoanProductController.destroy.url(productToDelete), {
            preserveScroll: true,
            onFinish: () => {
                setDeletingId(null);
            },
            onSuccess: () => {
                setProductToDelete(null);
            },
        });
    };

    return (
        <>
            <Head title="Loan products" />

            <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <Heading
                        variant="small"
                        title="Loan products"
                        description="Manage available loan products with filters and quick actions."
                    />

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus />
                                Add loan product
                            </Button>
                        </DialogTrigger>

                        <DialogContent>
                            <DialogTitle>Add loan product</DialogTitle>
                            <DialogDescription>
                                Create a new loan product visible to users.
                            </DialogDescription>

                            <Form
                                {...LoanProductController.store.form()}
                                options={{ preserveScroll: true }}
                                resetOnSuccess
                                className="space-y-6"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <LoanProductFormFields errors={errors} />

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
                                placeholder="Search by name or description"
                            />
                        </div>

                        <div>
                            <Label htmlFor="has_description">Description</Label>
                            <Select
                                value={filterForm.has_description}
                                onValueChange={(
                                    value: 'all' | 'with' | 'without',
                                ) =>
                                    setFilterForm((previous) => ({
                                        ...previous,
                                        has_description: value,
                                    }))
                                }
                            >
                                <SelectTrigger id="has_description" className="w-full">
                                    <SelectValue placeholder="Filter" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="with">
                                        With description
                                    </SelectItem>
                                    <SelectItem value="without">
                                        Without description
                                    </SelectItem>
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

                {loanProducts.length === 0 ? (
                    <Alert>
                        <AlertTitle>No loan products found</AlertTitle>
                        <AlertDescription>
                            Add your first loan product or adjust your filters.
                        </AlertDescription>
                    </Alert>
                ) : (
                    <div className="rounded-lg border border-border bg-card">
                        <div className="w-full overflow-x-auto">
                            <Table className="w-full">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loanProducts.map((loanProduct) => (
                                    <TableRow key={loanProduct.id}>
                                        <TableCell className="font-medium">
                                            {loanProduct.name}
                                        </TableCell>
                                        <TableCell className="max-w-[24rem] text-muted-foreground whitespace-normal break-words">
                                            {loanProduct.description ||
                                                'No description'}
                                        </TableCell>
                                        <TableCell className="text-right whitespace-nowrap">
                                            <div className="inline-flex flex-wrap justify-end gap-2">
                                                <Dialog
                                                    open={
                                                        editingProduct?.id ===
                                                        loanProduct.id
                                                    }
                                                    onOpenChange={(open) => {
                                                        setEditingProduct(
                                                            open
                                                                ? loanProduct
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
                                                            Edit loan product
                                                        </DialogTitle>
                                                        <DialogDescription>
                                                            Update this loan
                                                            product details.
                                                        </DialogDescription>

                                                        <Form
                                                            key={
                                                                editingProduct?.id
                                                            }
                                                            {...LoanProductController.update.form(
                                                                loanProduct,
                                                            )}
                                                            options={{
                                                                preserveScroll:
                                                                    true,
                                                            }}
                                                            className="space-y-6"
                                                            onSuccess={() =>
                                                                setEditingProduct(
                                                                    null,
                                                                )
                                                            }
                                                        >
                                                            {({
                                                                processing,
                                                                errors,
                                                            }) => (
                                                                <>
                                                                    <LoanProductFormFields
                                                                        loanProduct={
                                                                            loanProduct
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
                                                        productToDelete?.id ===
                                                        loanProduct.id
                                                    }
                                                    onOpenChange={(open) => {
                                                        setProductToDelete(
                                                            open
                                                                ? loanProduct
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
                                                            Delete loan product
                                                        </DialogTitle>
                                                        <DialogDescription>
                                                            This action cannot
                                                            be undone.
                                                        </DialogDescription>

                                                        <Alert variant="destructive">
                                                            <AlertTitle>
                                                                Please confirm
                                                            </AlertTitle>
                                                            <AlertDescription>
                                                                You are about to
                                                                delete{' '}
                                                                {
                                                                    loanProduct.name
                                                                }
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
                                                                    loanProduct.id
                                                                }
                                                                onClick={
                                                                    handleDelete
                                                                }
                                                            >
                                                                Confirm delete
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

LoanProductsPage.layout = {
    breadcrumbs: [
        {
            title: 'Loan products',
            href: index(),
        },
    ],
};