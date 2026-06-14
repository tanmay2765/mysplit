import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Users,
  Receipt,
  UserPlus,
  AlertTriangle,
  Plus,
  Upload,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Loader2,
} from "lucide-react";
import { summary as mockSummary, importReports, groups as mockGroups, members as mockMembers } from "@/lib/mock-data";
import { fetchGroups, fetchExpenses } from "@/lib/api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — SplitWell" },
      { name: "description", content: "Track shared expenses, balances, and settlements with clarity." },
      { property: "og:title", content: "Dashboard — SplitWell" },
      { property: "og:description", content: "Track shared expenses, balances, and settlements with clarity." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [groupsList, setGroupsList] = useState<any[]>(mockGroups);
  const [expensesCount, setExpensesCount] = useState(mockSummary.totalExpenses);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchGroups(), fetchExpenses()]).then(([grps, exps]) => {
      if (grps) {
        setGroupsList(grps);
      }
      if (exps) {
        setExpensesCount(exps.length);
      }
      setLoading(false);
    });
  }, []);

  const totalGroups = groupsList.length;
  const totalExpenses = expensesCount;
  const totalMembers = mockMembers.length;
  const pendingReviews = mockSummary.pendingReviews;

  const metrics = [
    { label: "Total Groups", value: totalGroups, icon: Users, tint: "bg-primary/10 text-primary" },
    { label: "Total Expenses", value: totalExpenses, icon: Receipt, tint: "bg-accent/10 text-accent" },
    { label: "Total Members", value: totalMembers, icon: UserPlus, tint: "bg-success/10 text-success" },
    { label: "Pending Reviews", value: pendingReviews, icon: AlertTriangle, tint: "bg-warning/15 text-warning" },
  ];

  const quickActions = [
    { label: "Create Group", icon: Users, to: "/groups" as const },
    { label: "Add Expense", icon: Plus, to: "/expenses" as const },
    { label: "Import CSV", icon: Upload, to: "/import-csv" as const },
  ];

  return (
    <div className="flex flex-col gap-8 py-2">
      <section className="hero-gradient relative overflow-hidden rounded-[32px] p-8 md:p-10">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/30 blur-3xl" />
        <div className="absolute bottom-0 right-10 h-48 w-48 rounded-full bg-accent/30 blur-3xl" />
        <div className="relative grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-foreground/70">Welcome back</p>
            <h1 className="mt-2 text-3xl font-extrabold leading-tight text-foreground md:text-5xl">
              Hi Tanmay,<br />here's your money overview.
            </h1>
            <p className="mt-4 max-w-md text-sm text-foreground/80 md:text-base">
              You're managing {totalGroups} groups with {totalExpenses} expenses.
              {" "}{pendingReviews} anomalies need review.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/expenses" className="inline-flex items-center gap-2 rounded-2xl bg-foreground px-5 py-3 text-sm font-semibold text-background transition hover:opacity-90">
                Add Expense <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link to="/import-csv" className="inline-flex items-center gap-2 rounded-2xl border border-foreground/20 bg-white/60 px-5 py-3 text-sm font-semibold text-foreground backdrop-blur transition hover:bg-white/80">
                Import CSV
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {metrics.map((m) => (
              <div key={m.label} className="rounded-2xl bg-white/70 p-4 backdrop-blur">
                <div className="text-xs font-medium text-foreground/60">{m.label}</div>
                <div className="mt-1 text-3xl font-extrabold text-foreground">{m.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="card-soft grid grid-cols-1 gap-2 p-3 sm:grid-cols-3">
        {quickActions.map((a) => {
          const Icon = a.icon;
          return (
            <Link key={a.label} to={a.to} className="card-soft-hover flex items-center gap-4 rounded-2xl bg-secondary/60 px-5 py-4 transition hover:bg-secondary">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-foreground">{a.label}</div>
                <div className="text-xs text-muted-foreground">One tap to get going</div>
              </div>
            </Link>
          );
        })}
      </section>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((m) => {
              const Icon = m.icon;
              return (
                <div key={m.label} className="card-soft card-soft-hover p-6">
                  <div className={`mb-4 grid h-12 w-12 place-items-center rounded-2xl ${m.tint}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">{m.label}</div>
                  <div className="mt-1 text-3xl font-extrabold text-foreground">{m.value}</div>
                </div>
              );
            })}
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <div className="card-soft p-6">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-bold">Recent Imports</h2>
                <Link to="/import-reports" className="text-sm font-semibold text-primary hover:underline">View all</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                      <th className="pb-3 font-medium">Date</th>
                      <th className="pb-3 font-medium">Rows</th>
                      <th className="pb-3 font-medium">Anomalies</th>
                      <th className="pb-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {importReports.map((r) => (
                      <tr key={r.id} className="border-t border-border">
                        <td className="py-3.5 font-medium">{r.date}</td>
                        <td className="py-3.5">{r.rowsProcessed}</td>
                        <td className="py-3.5">{r.anomalies}</td>
                        <td className="py-3.5"><StatusPill status={r.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card-soft p-6">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-bold">Active Groups</h2>
                <Link to="/groups" className="text-sm font-semibold text-primary hover:underline">All groups</Link>
              </div>
              <div className="flex flex-col gap-3">
                {groupsList.slice(0, 4).map((g) => (
                  <div key={g.id} className="flex items-center gap-3 rounded-2xl bg-secondary/50 p-3">
                    <div className="flex -space-x-2">
                      {g.members.slice(0, 3).map((m: any) => (
                        <img key={m.id} src={m.avatar} alt={m.name} className="h-9 w-9 rounded-full border-2 border-card object-cover" />
                      ))}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold">{g.name}</div>
                      <div className="text-xs text-muted-foreground">{g.members.length} members · {g.expenseCount} expenses</div>
                    </div>
                    <div className="shrink-0 text-xs text-muted-foreground">{g.lastActivity}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { cls: string; Icon: typeof CheckCircle2 }> = {
    Completed: { cls: "bg-success/10 text-success", Icon: CheckCircle2 },
    "Pending Review": { cls: "bg-warning/15 text-warning", Icon: Clock },
    Failed: { cls: "bg-destructive/10 text-destructive", Icon: AlertTriangle },
  };
  const { cls, Icon } = map[status] ?? map.Completed;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${cls}`}>
      <Icon className="h-3.5 w-3.5" />
      {status}
    </span>
  );
}