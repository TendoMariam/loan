import { Link, usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import ShowcasePanel from '@/components/auth/showcase-panel';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage().props;

    return (
        <div className="grid min-h-svh grid-cols-1 bg-background lg:grid-cols-[42%_58%]">
            <div className="flex min-h-svh items-center justify-center px-6 py-10 md:px-10 lg:px-14 xl:px-16">
                <div className="w-full max-w-sm space-y-8">
                    <Link
                        href={home()}
                        className="relative z-20 flex items-center justify-start gap-2 font-medium"
                    >
                        <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border/80 bg-card">
                            <AppLogoIcon className="size-8 fill-current text-foreground" />
                        </div>
                        <span className="text-sm">{name}</span>
                    </Link>

                    <div className="space-y-2">
                        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                            {title}
                        </h1>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                            {description}
                        </p>
                    </div>

                    {children}
                </div>
            </div>

            <div
                aria-hidden="true"
                className="relative hidden overflow-hidden border-l border-border/70 bg-muted/40 p-10 lg:flex lg:flex-col xl:p-14"
            >
                <div className="pointer-events-none absolute -top-28 right-[-8%] h-80 w-80 rounded-full bg-gradient-to-br from-emerald-200/35 to-sky-200/20 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-20 left-[-5%] h-72 w-72 rounded-full bg-gradient-to-tr from-cyan-200/30 to-amber-100/25 blur-3xl" />
                <Link
                    href={home()}
                    className="relative z-20 flex items-center gap-2 text-sm font-medium text-muted-foreground"
                >
                    <AppLogoIcon className="size-7 fill-current text-foreground" />
                    <span>{name}</span>
                </Link>
                <div className="relative z-10 mt-8 flex-1">
                    <ShowcasePanel />
                </div>
            </div>
        </div>
    );
}
