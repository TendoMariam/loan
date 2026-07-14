import { Head, Link, usePage } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { edit, index } from '@/routes/loan-products';
import type { LoanProduct } from '@/types';

type PageProps = {
    loanProduct: LoanProduct;
};

export default function ShowLoanProduct() {
    const { loanProduct } = usePage<PageProps>().props;

    return (
        <>
            <Head title={loanProduct.name} />

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title={loanProduct.name}
                    description="Review the details for this loan product."
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Product details</CardTitle>
                        <CardDescription>
                            Use this page to view the full product description and update it if needed.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div>
                                <p className="text-sm font-semibold text-foreground">Name</p>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    {loanProduct.name}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-foreground">Description</p>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    {loanProduct.description ?? 'No description provided.'}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex flex-wrap gap-4">
                    <Button asChild>
                        <Link href={edit(loanProduct)}>Edit</Link>
                    </Button>
                    <Link
                        href={index()}
                        className="text-sm text-muted-foreground underline-offset-4 hover:underline"
                    >
                        Back to products
                    </Link>
                </div>
            </div>
        </>
    );
}

ShowLoanProduct.layout = {
    breadcrumbs: [
        {
            title: 'Loan products',
            href: index(),
        },
        {
            title: 'Details',
        },
    ],
};
