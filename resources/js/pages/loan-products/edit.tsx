import { Form, Head, Link, usePage } from '@inertiajs/react';
import LoanProductController from '@/actions/App/Http/Controllers/LoanProductController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { index } from '@/routes/loan-products';
import type { LoanProduct } from '@/types';

type PageProps = {
    loanProduct: LoanProduct;
};

export default function EditLoanProduct() {
    const { loanProduct } = usePage<PageProps>().props;

    return (
        <>
            <Head title={`Edit ${loanProduct.name}`} />

            <h1 className="sr-only">Edit loan product</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title={`Edit ${loanProduct.name}`}
                    description="Update the details for this product."
                />

                <Form
                    {...LoanProductController.update.form(loanProduct)}
                    options={{ preserveScroll: true }}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>

                                <Input
                                    id="name"
                                    name="name"
                                    className="mt-1 block w-full"
                                    defaultValue={loanProduct.name}
                                    required
                                    placeholder="Product name"
                                />

                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>

                                <Textarea
                                    id="description"
                                    name="description"
                                    className="mt-1 block w-full"
                                    defaultValue={loanProduct.description ?? ''}
                                    placeholder="A short description of this loan product"
                                />

                                <InputError message={errors.description} />
                            </div>

                            <div className="flex flex-wrap items-center gap-4">
                                <Button disabled={processing}>Save</Button>
                                <Link
                                    href={index()}
                                    className="text-sm text-muted-foreground underline-offset-4 hover:underline"
                                >
                                    Cancel
                                </Link>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

EditLoanProduct.layout = {
    breadcrumbs: [
        {
            title: 'Loan products',
            href: index(),
        },
        {
            title: 'Edit',
        },
    ],
};
