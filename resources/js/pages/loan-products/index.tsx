import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import Heading from '@/components/heading';
import { create, edit, index, show } from '@/routes/loan-products';
import type { LoanProduct } from '@/types';

type PageProps = {
    loanProducts: LoanProduct[];
};

export default function LoanProducts() {
    const { loanProducts } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Loan products" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <Heading
                            variant="small"
                            title="Loan products"
                            description="Manage the loan products available to your customers."
                        />
                    </div>

                    <Button asChild>
                        <Link href={create()}>Create loan product</Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Available products</CardTitle>
                        <CardDescription>
                            Add, edit, and view loan products for your business.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        {loanProducts.length === 0 ? (
                            <div className="rounded-xl border border-border bg-muted p-6 text-sm text-muted-foreground">
                                No loan products have been created yet.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loanProducts.map((loanProduct) => (
                                            <TableRow key={loanProduct.id}>
                                                <TableCell>{loanProduct.name}</TableCell>
                                                <TableCell>
                                                    {loanProduct.description ?? 'No description'}
                                                </TableCell>
                                                <TableCell className="flex flex-wrap justify-end gap-2">
                                                    <Link
                                                        href={show(loanProduct)}
                                                        className="text-sm font-medium text-primary hover:underline"
                                                    >
                                                        View
                                                    </Link>
                                                    <Link
                                                        href={edit(loanProduct)}
                                                        className="text-sm font-medium text-secondary hover:underline"
                                                    >
                                                        Edit
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

LoanProducts.layout = {
    breadcrumbs: [
        {
            title: 'Loan products',
            href: index(),
        },
    ],
};
