import type { Region } from './region';

export type Branch = {
    id: number;
    name: string;
    code: string;
    region_id: number;
    region?: Pick<Region, 'id' | 'name'>;
    created_at: string;
    updated_at: string;
};
