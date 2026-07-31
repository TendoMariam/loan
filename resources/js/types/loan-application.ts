import type { Customer } from './customer';
import type { LoanProduct } from './loan-product';

export type LoanApplication = {
    id: number;
    number: string;
    amount: string | number;
    application_date: string;
    purpose: string | null;
    interest_rate: string | number;
    net_amount: string | number;
    loan_type: 'new' | 'top-up';
    status: 'pending' | 'approved' | 'rejected';
    created_by: number;
    customer_id: number;
    loan_product_id: number;
    customer?: Pick<Customer, 'id' | 'name'>;
    loan_product?: Pick<LoanProduct, 'id' | 'name'>;
    created_at: string;
    updated_at: string;
};
