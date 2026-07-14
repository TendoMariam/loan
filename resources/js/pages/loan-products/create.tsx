import { Form, Head, Link } from '@inertiajs/react';
import LoanProductController from '@/actions/App/Http/Controllers/LoanProductController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { create, index } from '@/routes/loan-products';

export default function CreateLoanProduct() {
    return (
        <>
            <Head title="Create loan product" />

            <h1 className="sr-only">Create loan product</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Create loan product"
                    description="Add a new product that users can apply for."
                />

                <Form
                    {...LoanProductController.store.form()}
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
                                    placeholder="A short description of this loan product"
                                />

                                <InputError message={errors.description} />
                            </div>

                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
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

CreateLoanProduct.layout = {
    breadcrumbs: [
        {
            title: 'Loan products',
            href: index(),
        },
        {
            title: 'Create',
            href: create(),
        },
    ],
};
