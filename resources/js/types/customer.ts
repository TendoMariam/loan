import type { Branch } from './branch';

export type Customer = {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    nin: string;
    created_by: number;
    branch_id: number;
    branch?: Pick<Branch, 'id' | 'name'>;
    created_at: string;
    updated_at: string;
};
