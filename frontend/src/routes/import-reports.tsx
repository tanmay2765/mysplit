import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, AlertTriangle, FileText, X, Check, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { anomalies, type Anomaly } from "@/lib/mock-data";

export const Route = createFileRoute("/import-reports")({
  head: () => ({ meta: [{ title: "Import Reports — SplitWell" }, { name: "description", content: "Review anomalies surfaced during CSV imports." }] }),
  component: ImportReportsPage,
});

const sevClass: Record<Anomaly["severity"], string> = {
  High: "bg-destructive/10 text-destructive",
  Medium: "bg-warning/15 text-warning",
  Low: "bg-primary/10 text-primary",
};

const summary = [
  { label: "Rows Processed", value: 142, icon: FileText, tint: "bg-primary/10 text-primary" },
  { label: "Anomalies Found", value: anomalies.length, icon: AlertTriangle, tint: "bg-warning/15 text-warning" },
  { label: "Import Status", value: "In Review", icon: CheckCircle2, tint: "bg-success/10 text-success" },
];

function ImportReportsPage() {
  const [selected, setSelected] = useState<Anomaly | null>(null);

  return (
    <div className="flex flex-col gap-6 py-2">
      <header>
        <h1 className="text-3xl font-extrabold">Import Reports</h1>
        <p className="text-sm text-muted-foreground">Approve, edit, or reject each anomaly before it lands.</p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {summary.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card-soft p-6">
              <div className={`mb-4 grid h-12 w-12 place-items-center rounded-2xl ${s.tint}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="text-sm font-medium text-muted-foreground">{s.label}</div>
              <div className="mt-1 text-3xl font-extrabold">{s.value}</div>
            </div>
          );
        })}
      </section>

      <section className="card-soft p-6">
        <h2 className="mb-5 text-lg font-bold">Anomalies</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50">
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Description</th>
                <th className="px-4 py-3 font-medium">Severity</th>
                <th className="px-4 py-3 font-medium">Action</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {anomalies.map((a) => (
                <tr key={a.id} onClick={() => setSelected(a)} className="cursor-pointer border-t border-border transition hover:bg-secondary/40">
                  <td className="px-4 py-4 font-semibold">{a.type}</td>
                  <td className="px-4 py-4 text-muted-foreground">{a.description}</td>
                  <td className="px-4 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${sevClass[a.severity]}`}>{a.severity}</span>
                  </td>
                  <td className="px-4 py-4 text-xs text-muted-foreground">{a.action}</td>
                  <td className="px-4 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      a.status === "Approved" ? "bg-success/10 text-success" :
                      a.status === "Rejected" ? "bg-destructive/10 text-destructive" :
                      "bg-warning/15 text-warning"
                    }`}>{a.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={() => setSelected(null)}>
          <div className="h-full w-full max-w-md overflow-y-auto bg-background p-6 shadow-2xl md:p-8" onClick={(e) => e.stopPropagation()}>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-extrabold">Review Anomaly</h2>
              <button onClick={() => setSelected(null)} className="grid h-9 w-9 place-items-center rounded-xl bg-secondary"><X className="h-4 w-4" /></button>
            </div>

            <div className="card-soft mb-4 p-5">
              <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${sevClass[selected.severity]}`}>{selected.severity} severity</span>
              <div className="mt-3 text-lg font-bold">{selected.type}</div>
              <p className="mt-1 text-sm text-muted-foreground">{selected.description}</p>
            </div>

            {selected.originalName && selected.suggestedName && (
              <div className="card-soft mb-4 p-5">
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Suggested change</h3>
                <div className="flex items-center gap-3">
                  <div className="flex-1 rounded-2xl bg-destructive/5 p-3 text-center">
                    <div className="text-xs text-muted-foreground">Original</div>
                    <div className="font-bold">{selected.originalName}</div>
                  </div>
                  <span>→</span>
                  <div className="flex-1 rounded-2xl bg-success/10 p-3 text-center">
                    <div className="text-xs text-muted-foreground">Suggested</div>
                    <div className="font-bold">{selected.suggestedName}</div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button className="flex-1 rounded-2xl bg-success text-success-foreground hover:bg-success/90"><Check className="mr-1 h-4 w-4" /> Approve</Button>
              <Button variant="outline" className="flex-1 rounded-2xl"><Pencil className="mr-1 h-4 w-4" /> Edit</Button>
              <Button variant="destructive" className="flex-1 rounded-2xl"><X className="mr-1 h-4 w-4" /> Reject</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}