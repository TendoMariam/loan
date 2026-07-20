import { Link } from '@inertiajs/react';
import { BookOpen, FolderGit2, LayoutGrid, Split, Currency, Map, FileUser, Bitcoin  } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { index as loanProductIndex } from '@/routes/loan-products';
import { index as regionIndex } from '@/routes/regions';
import { index as branchIndex } from '@/routes/branch';
import { index as customerIndex} from '@/routes/customers';
import { index as loanIndex} from '@/routes/loans';

import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Loan Products',
        href: loanProductIndex(),
        icon: Currency,
    },
    {
        title: 'Regions',
        href: regionIndex(),
        icon: Split,
    },
    {
        title: 'Branches',
        href: branchIndex(),
        icon: Map,
    },
    {
        title: 'Customers',
        href: customerIndex(),
        icon: FileUser,
    },
    {
        title: 'Loans',
        href: loanIndex(),
        icon: Bitcoin,
    },
];

// const footerNavItems: NavItem[] = [
//     {
//         title: 'Repository',
//         href: 'https://github.com/laravel/react-starter-kit',
//         icon: FolderGit2,
//     },
//     {
//         title: 'Documentation',
//         href: 'https://laravel.com/docs/starter-kits#react',
//         icon: BookOpen,
//     },
// ];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
