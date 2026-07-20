import {
    BarChart3,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Landmark,
    MapPin,
    ShieldCheck,
    UserCircle2,
} from 'lucide-react';




const valueProps = [
    {
        title: 'Centralize customer records',
        description: "One profile per customer across every loan they've taken.",
    },
    {
        title: 'Track every application',
        description:
            'From submission to approval to disbursement, in one pipeline.',
    },
    {
        title: 'Role-based access',
        description: 'Officers see their book, managers see the branch, admins see all.',
    },
];

export default function ShowcasePanel() {
    return (
        <div className="flex h-full w-full flex-col gap-8 text-foreground">
            <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-border/70 bg-card/70 p-4">
                    <ShieldCheck className="size-4 text-foreground" />
                    <p className="mt-3 text-sm font-semibold">Bank-grade encryption</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        End-to-end encrypted
                    </p>
                </div>

                <div className="rounded-xl border border-border/70 bg-card/70 p-4">
                    <CheckCircle2 className="size-4 text-foreground" />
                    <p className="mt-3 text-sm font-semibold">Audit-trail on records</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Every action is traceable
                    </p>
                </div>

                <div className="rounded-xl border border-border/70 bg-card/70 p-4">
                    <BarChart3 className="size-4 text-foreground" />
                    <p className="mt-3 text-sm font-semibold">Portfolio reporting</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Real-time branch insights
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
                {valueProps.map((item) => (
                    <div key={item.title} className="rounded-xl border border-border bg-card p-4">
                        <p className="text-sm font-semibold">{item.title}</p>
                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                            {item.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}