import { Form, Head, router, usePage } from '@inertiajs/react';
import { Plus, SquarePen, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import LoanApplicationController from '@/actions/App/Http/Controllers/LoanApplicationController';
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
import { index } from '@/routes/loans';
import type { Customer, LoanApplication, LoanProduct } from '@/types';

type LoanFilters = {
    search: string;
    status: 'all' | 'pending' | 'approved' | 'rejected';
    loan_type: 'all' | 'new' | 'top-up';
    sort: 'newest' | 'oldest' | 'amount_asc' | 'amount_desc';
};

type PageProps = {
    loanApplications: LoanApplication[];
    customers: Pick<Customer, 'id' | 'name'>[];
    loanProducts: Pick<LoanProduct, 'id' | 'name'>[];
    filters: LoanFilters;
};

const FILTER_DEFAULTS: LoanFilters = {
    search: '',
    status: 'all',
    loan_type: 'all',
    sort: 'newest',
};

const ugxFormatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

const parseNumberInput = (value: string): number => {
    const parsedValue = Number(value);

    if (!Number.isFinite(parsedValue)) {
        return 0;
    }

    return parsedValue;
};

const formatUgx = (value: number): string => {
    return `UGX ${ugxFormatter.format(value)}`;
};

function LoanFormFields({
    loan,
    customers,
    loanProducts,
    errors,
}: {
    loan?: LoanApplication;
    customers: Pick<Customer, 'id' | 'name'>[];
    loanProducts: Pick<LoanProduct, 'id' | 'name'>[];
    errors: Record<string, string>;
}) {
    const [amountInput, setAmountInput] = useState(String(loan?.amount ?? ''));
    const [interestRateInput, setInterestRateInput] = useState(
        String(loan?.interest_rate ?? ''),
    );

    useEffect(() => {
        setAmountInput(String(loan?.amount ?? ''));
        setInterestRateInput(String(loan?.interest_rate ?? ''));
    }, [loan?.id, loan?.amount, loan?.interest_rate]);

    const amountValue = parseNumberInput(amountInput);
    const interestRateValue = parseNumberInput(interestRateInput);
    const netAmountPreview =
        amountValue + (amountValue * interestRateValue) / 100;

    return (
        <>
            <div className="grid gap-2">
                <Label>Application number</Label>
                <p className="text-sm text-muted-foreground">
                    Generated automatically when the application is created.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                        id="amount"
                        name="amount"
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        autoFocus
                        value={amountInput}
                        onChange={(event) => setAmountInput(event.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                        {formatUgx(amountValue)}
                    </p>
                    <InputError message={errors.amount} />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor="application_date">Application date</Label>
                    <Input
                        id="application_date"
                        name="application_date"
                        type="date"
                        required
                        defaultValue={loan?.application_date ?? ''}
                    />
                    <InputError message={errors.application_date} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="interest_rate">Interest rate</Label>
                    <Input
                        id="interest_rate"
                        name="interest_rate"
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        value={interestRateInput}
                        onChange={(event) =>
                            setInterestRateInput(event.target.value)
                        }
                    />
                    <InputError message={errors.interest_rate} />
                </div>
            </div>

            <div className="grid gap-2">
                <Label>Net amount</Label>
                <p className="text-sm font-medium text-foreground">
                    {formatUgx(netAmountPreview)}
                </p>
                <p className="text-sm text-muted-foreground">
                    Calculated in real time from amount and interest rate.
                </p>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="purpose">Purpose</Label>
                <Input
                    id="purpose"
                    name="purpose"
                    defaultValue={loan?.purpose ?? ''}
                    placeholder="Loan purpose"
                />
                <InputError message={errors.purpose} />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor="loan_type">Loan type</Label>
                    <select
                        id="loan_type"
                        name="loan_type"
                        defaultValue={loan?.loan_type ?? 'new'}
                        className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                        required
                    >
                        <option value="new">New</option>
                        <option value="top-up">Top-up</option>
                    </select>
                    <InputError message={errors.loan_type} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <select
                        id="status"
                        name="status"
                        defaultValue={loan?.status ?? 'pending'}
                        className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                        required
                    >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                    <InputError message={errors.status} />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor="customer_id">Customer</Label>
                    <select
                        id="customer_id"
                        name="customer_id"
                        defaultValue={loan?.customer_id ?? ''}
                        className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                        required
                    >
                        <option value="" disabled>
                            Select a customer
                        </option>
                        {customers.map((customer) => (
                            <option key={customer.id} value={customer.id}>
                                {customer.name}
                            </option>
                        ))}
                    </select>
                    <InputError message={errors.customer_id} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="loan_product_id">Loan product</Label>
                    <select
                        id="loan_product_id"
                        name="loan_product_id"
                        defaultValue={loan?.loan_product_id ?? ''}
                        className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                        required
                    >
                        <option value="" disabled>
                            Select a loan product
                        </option>
                        {loanProducts.map((product) => (
                            <option key={product.id} value={product.id}>
                                {product.name}
                            </option>
                        ))}
                    </select>
                    <InputError message={errors.loan_product_id} />
                </div>
            </div>
        </>
    );
}

export default function LoansPage() {
    const { loanApplications, customers, loanProducts, filters } =
        usePage<PageProps>().props;
    const [editingLoan, setEditingLoan] = useState<LoanApplication | null>(
        null,
    );
    const [loanToDelete, setLoanToDelete] =
        useState<LoanApplication | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const activeFilters = useMemo(
        () => ({ ...FILTER_DEFAULTS, ...filters }),
        [filters],
    );
    const [filterForm, setFilterForm] = useState<LoanFilters>(activeFilters);

    useEffect(() => {
        setFilterForm(activeFilters);
    }, [activeFilters]);

    const applyFilters = (nextFilters: LoanFilters) => {
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
        if (!loanToDelete) {
            return;
        }

        setDeletingId(loanToDelete.id);

        router.delete(LoanApplicationController.destroy.url(loanToDelete.id), {
            preserveScroll: true,
            onFinish: () => {
                setDeletingId(null);
            },
            onSuccess: () => {
                setLoanToDelete(null);
            },
        });
    };

    return (
        <>
            <Head title="Loans" />

            <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <Heading
                        variant="small"
                        title="Loans"
                        description="Manage loan applications with filters and quick actions."
                    />

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus />
                                Add loan
                            </Button>
                        </DialogTrigger>

                        <DialogContent>
                            <DialogTitle>Add loan application</DialogTitle>
                            <DialogDescription>
                                Create a new loan application.
                            </DialogDescription>

                            <Form
                                {...LoanApplicationController.store.form()}
                                options={{ preserveScroll: true }}
                                resetOnSuccess
                                className="space-y-6"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <LoanFormFields
                                            customers={customers}
                                            loanProducts={loanProducts}
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
                                placeholder="Search by number, purpose, customer or product"
                            />
                        </div>

                        <div>
                            <Label htmlFor="status_filter">Status</Label>
                            <Select
                                value={filterForm.status}
                                onValueChange={(
                                    value:
                                        | 'all'
                                        | 'pending'
                                        | 'approved'
                                        | 'rejected',
                                ) =>
                                    setFilterForm((previous) => ({
                                        ...previous,
                                        status: value,
                                    }))
                                }
                            >
                                <SelectTrigger
                                    id="status_filter"
                                    className="w-full"
                                >
                                    <SelectValue placeholder="All status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All status
                                    </SelectItem>
                                    <SelectItem value="pending">
                                        Pending
                                    </SelectItem>
                                    <SelectItem value="approved">
                                        Approved
                                    </SelectItem>
                                    <SelectItem value="rejected">
                                        Rejected
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="loan_type_filter">Loan type</Label>
                            <Select
                                value={filterForm.loan_type}
                                onValueChange={(
                                    value: 'all' | 'new' | 'top-up',
                                ) =>
                                    setFilterForm((previous) => ({
                                        ...previous,
                                        loan_type: value,
                                    }))
                                }
                            >
                                <SelectTrigger
                                    id="loan_type_filter"
                                    className="w-full"
                                >
                                    <SelectValue placeholder="All types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All types</SelectItem>
                                    <SelectItem value="new">New</SelectItem>
                                    <SelectItem value="top-up">Top-up</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="md:col-span-2">
                            <Label htmlFor="sort">Sort by</Label>
                            <Select
                                value={filterForm.sort}
                                onValueChange={(
                                    value:
                                        | 'newest'
                                        | 'oldest'
                                        | 'amount_asc'
                                        | 'amount_desc',
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
                                    <SelectItem value="newest">
                                        Newest first
                                    </SelectItem>
                                    <SelectItem value="oldest">
                                        Oldest first
                                    </SelectItem>
                                    <SelectItem value="amount_asc">
                                        Amount (Low-High)
                                    </SelectItem>
                                    <SelectItem value="amount_desc">
                                        Amount (High-Low)
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

                {loanApplications.length === 0 ? (
                    <Alert>
                        <AlertTitle>No loans found</AlertTitle>
                        <AlertDescription>
                            Add your first loan application or adjust your
                            filters.
                        </AlertDescription>
                    </Alert>
                ) : (
                    <div className="rounded-lg border border-border bg-card">
                        <div className="w-full overflow-x-auto">
                            <Table className="w-full">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Number</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Principal</TableHead>
                                        <TableHead>Interest</TableHead>
                                        <TableHead>Total Payment</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loanApplications.map((loan) => (
                                        <TableRow key={loan.id}>
                                            <TableCell className="font-medium">
                                                {loan.number}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {loan.customer?.name}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {loan.loan_product?.name}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {formatUgx(Number(loan.amount))}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {loan.interest_rate}%
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {formatUgx(Number(loan.net_amount))}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {loan.status}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {loan.loan_type}
                                            </TableCell>
                                            <TableCell className="text-right whitespace-nowrap">
                                                <div className="inline-flex flex-wrap justify-end gap-2">
                                                    <Dialog
                                                        open={
                                                            editingLoan?.id ===
                                                            loan.id
                                                        }
                                                        onOpenChange={(open) => {
                                                            setEditingLoan(
                                                                open
                                                                    ? loan
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
                                                                Edit loan
                                                                application
                                                            </DialogTitle>
                                                            <DialogDescription>
                                                                Update this loan
                                                                application
                                                                details.
                                                            </DialogDescription>

                                                            <Form
                                                                key={
                                                                    editingLoan?.id
                                                                }
                                                                {...LoanApplicationController.update.form(
                                                                    loan.id,
                                                                )}
                                                                options={{
                                                                    preserveScroll:
                                                                        true,
                                                                }}
                                                                className="space-y-6"
                                                                onSuccess={() =>
                                                                    setEditingLoan(
                                                                        null,
                                                                    )
                                                                }
                                                            >
                                                                {({
                                                                    processing,
                                                                    errors,
                                                                }) => (
                                                                    <>
                                                                        <LoanFormFields
                                                                            loan={
                                                                                loan
                                                                            }
                                                                            customers={
                                                                                customers
                                                                            }
                                                                            loanProducts={
                                                                                loanProducts
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
                                                            loanToDelete?.id ===
                                                            loan.id
                                                        }
                                                        onOpenChange={(open) => {
                                                            setLoanToDelete(
                                                                open
                                                                    ? loan
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
                                                                Delete loan
                                                                application
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
                                                                    delete loan{' '}
                                                                    {loan.number}
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
                                                                        loan.id
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

LoansPage.layout = {
    breadcrumbs: [
        {
            title: 'Loans',
            href: index(),
        },
    ],
};
