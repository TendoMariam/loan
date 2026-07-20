import { Form, Head, router, usePage } from '@inertiajs/react';
import { Plus, SquarePen, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import CustomerController from '@/actions/App/Http/Controllers/CustomerController';
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
import { index } from '@/routes/customers';
import type { Branch, Customer } from '@/types';

type CustomerFilters = {
    search: string;
    branch_id: string;
    sort: 'name_asc' | 'name_desc' | 'newest' | 'oldest';
};

type PageProps = {
    customers: Customer[];
    branches: Pick<Branch, 'id' | 'name'>[];
    filters: CustomerFilters;
};

const FILTER_DEFAULTS: CustomerFilters = {
    search: '',
    branch_id: 'all',
    sort: 'name_asc',
};

function CustomerFormFields({
    customer,
    branches,
    errors,
}: {
    customer?: Customer;
    branches: Pick<Branch, 'id' | 'name'>[];
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
                    defaultValue={customer?.name ?? ''}
                    placeholder="Customer name"
                />
                <InputError message={errors.name} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    defaultValue={customer?.email ?? ''}
                    placeholder="customer@example.com"
                />
                <InputError message={errors.email} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                    id="phone"
                    name="phone"
                    required
                    defaultValue={customer?.phone ?? ''}
                    placeholder="Phone number"
                />
                <InputError message={errors.phone} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                    id="address"
                    name="address"
                    required
                    defaultValue={customer?.address ?? ''}
                    placeholder="Address"
                />
                <InputError message={errors.address} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="nin">NIN</Label>
                <Input
                    id="nin"
                    name="nin"
                    required
                    defaultValue={customer?.nin ?? ''}
                    placeholder="National identification number"
                />
                <InputError message={errors.nin} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="branch_id">Branch</Label>
                <select
                    id="branch_id"
                    name="branch_id"
                    defaultValue={customer?.branch_id ?? ''}
                    className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                    required
                >
                    <option value="" disabled>
                        Select a branch
                    </option>
                    {branches.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                            {branch.name}
                        </option>
                    ))}
                </select>
                <InputError message={errors.branch_id} />
            </div>
        </>
    );
}

export default function CustomersPage() {
    const { customers, branches, filters } = usePage<PageProps>().props;
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(
        null,
    );
    const [customerToDelete, setCustomerToDelete] =
        useState<Customer | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const activeFilters = useMemo(
        () => ({ ...FILTER_DEFAULTS, ...filters }),
        [filters],
    );
    const [filterForm, setFilterForm] =
        useState<CustomerFilters>(activeFilters);

    useEffect(() => {
        setFilterForm(activeFilters);
    }, [activeFilters]);

    const applyFilters = (nextFilters: CustomerFilters) => {
        router.get(
            index.url({
                query: {
                    ...nextFilters,
                    search: nextFilters.search.trim(),
                    branch_id:
                        nextFilters.branch_id === 'all'
                            ? undefined
                            : nextFilters.branch_id,
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
        if (!customerToDelete) {
            return;
        }

        setDeletingId(customerToDelete.id);

        router.delete(CustomerController.destroy.url(customerToDelete.id), {
            preserveScroll: true,
            onFinish: () => {
                setDeletingId(null);
            },
            onSuccess: () => {
                setCustomerToDelete(null);
            },
        });
    };

    return (
        <>
            <Head title="Customers" />

            <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <Heading
                        variant="small"
                        title="Customers"
                        description="Manage customer records with filters and quick actions."
                    />

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus />
                                Add customer
                            </Button>
                        </DialogTrigger>

                        <DialogContent>
                            <DialogTitle>Add customer</DialogTitle>
                            <DialogDescription>
                                Create a new customer profile.
                            </DialogDescription>

                            <Form
                                {...CustomerController.store.form()}
                                options={{ preserveScroll: true }}
                                resetOnSuccess
                                className="space-y-6"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <CustomerFormFields
                                            branches={branches}
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
                                placeholder="Search by name, email, phone or NIN"
                            />
                        </div>

                        <div>
                            <Label htmlFor="branch_filter">Branch</Label>
                            <Select
                                value={filterForm.branch_id}
                                onValueChange={(value) =>
                                    setFilterForm((previous) => ({
                                        ...previous,
                                        branch_id: value,
                                    }))
                                }
                            >
                                <SelectTrigger
                                    id="branch_filter"
                                    className="w-full"
                                >
                                    <SelectValue placeholder="All branches" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All branches
                                    </SelectItem>
                                    {branches.map((branch) => (
                                        <SelectItem
                                            key={branch.id}
                                            value={String(branch.id)}
                                        >
                                            {branch.name}
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

                {customers.length === 0 ? (
                    <Alert>
                        <AlertTitle>No customers found</AlertTitle>
                        <AlertDescription>
                            Add your first customer or adjust your filters.
                        </AlertDescription>
                    </Alert>
                ) : (
                    <div className="rounded-lg border border-border bg-card">
                        <div className="w-full overflow-x-auto">
                            <Table className="w-full">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Phone</TableHead>
                                        <TableHead>NIN</TableHead>
                                        <TableHead>Branch</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {customers.map((customer) => (
                                        <TableRow key={customer.id}>
                                            <TableCell className="font-medium">
                                                {customer.name}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {customer.email}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {customer.phone}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {customer.nin}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {customer.branch?.name}
                                            </TableCell>
                                            <TableCell className="text-right whitespace-nowrap">
                                                <div className="inline-flex flex-wrap justify-end gap-2">
                                                    <Dialog
                                                        open={
                                                            editingCustomer?.id ===
                                                            customer.id
                                                        }
                                                        onOpenChange={(open) => {
                                                            setEditingCustomer(
                                                                open
                                                                    ? customer
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
                                                                Edit customer
                                                            </DialogTitle>
                                                            <DialogDescription>
                                                                Update this
                                                                customer details.
                                                            </DialogDescription>

                                                            <Form
                                                                key={
                                                                    editingCustomer?.id
                                                                }
                                                                {...CustomerController.update.form(
                                                                    customer.id,
                                                                )}
                                                                options={{
                                                                    preserveScroll:
                                                                        true,
                                                                }}
                                                                className="space-y-6"
                                                                onSuccess={() =>
                                                                    setEditingCustomer(
                                                                        null,
                                                                    )
                                                                }
                                                            >
                                                                {({
                                                                    processing,
                                                                    errors,
                                                                }) => (
                                                                    <>
                                                                        <CustomerFormFields
                                                                            customer={
                                                                                customer
                                                                            }
                                                                            branches={
                                                                                branches
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
                                                            customerToDelete?.id ===
                                                            customer.id
                                                        }
                                                        onOpenChange={(open) => {
                                                            setCustomerToDelete(
                                                                open
                                                                    ? customer
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
                                                                Delete customer
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
                                                                    {
                                                                        customer.name
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
                                                                        customer.id
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

CustomersPage.layout = {
    breadcrumbs: [
        {
            title: 'Customers',
            href: index(),
        },
    ],
};
