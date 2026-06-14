import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { HandCoins, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { settlementHistory as mockSettlementHistory, members } from "@/lib/mock-data";
import { fetchSettlements } from "@/lib/api";

export const Route = createFileRoute("/settlements")({
  head: () => ({ meta: [{ title: "Settlements — SplitWell" }, { name: "description", content: "Record and review settled debts." }] }),
  component: SettlementsPage,
});

function SettlementsPage() {
  const [history, setHistory] = useState<any[]>(mockSettlementHistory);
  const [loading, setLoading] = useState(true);
  const [payer, setPayer] = useState(members[0]?.name || "");
  const [receiver, setReceiver] = useState(members[1]?.name || "");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const loadSettlements = () => {
    setLoading(true);
    fetchSettlements().then((data) => {
      if (data) {
        setHistory(data);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    loadSettlements();
  }, []);

  const handleRecordSettlement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    
    // Since there's no backend POST /settlements/ endpoint in the OpenAPI schema, 
    // we simulate adding it locally.
    const newSettlement = {
      id: `s-local-${Date.now()}`,
      date,
      payer,
      receiver,
      amount: parseFloat(amount),
    };
    
    setHistory((prev) => [newSettlement, ...prev]);
    setAmount("");
    alert("Settlement recorded locally! (POST /settlements not implemented in current API version)");
  };

  return (
    <div className="flex flex-col gap-6 py-2">
      <header>
        <h1 className="text-3xl font-extrabold">Settlements</h1>
        <p className="text-sm text-muted-foreground">Log payments and keep your group square.</p>
      </header>

      <section className="card-soft p-6 md:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <HandCoins className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Record a Settlement</h2>
            <p className="text-xs text-muted-foreground">Mark a debt as paid between two members.</p>
          </div>
        </div>
        <form onSubmit={handleRecordSettlement} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Payer">
            <select value={payer} onChange={(e) => setPayer(e.target.value)} className="h-11 w-full rounded-xl border border-border bg-card px-3 text-sm">
              {members.map((m) => <option key={m.id} value={m.name}>{m.name}</option>)}
            </select>
          </Field>
          <Field label="Receiver">
            <select value={receiver} onChange={(e) => setReceiver(e.target.value)} className="h-11 w-full rounded-xl border border-border bg-card px-3 text-sm">
              {members.map((m) => <option key={m.id} value={m.name}>{m.name}</option>)}
            </select>
          </Field>
          <Field label="Amount">
            <Input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} className="h-11 rounded-xl" required />
          </Field>
          <Field label="Date">
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-11 rounded-xl" required />
          </Field>
          <div className="sm:col-span-2 lg:col-span-4">
            <Button type="submit" className="rounded-2xl">Record Settlement</Button>
          </div>
        </form>
      </section>

      <section className="card-soft p-6">
        <h2 className="mb-5 text-lg font-bold">Settlement History</h2>
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Payer</th>
                  <th className="pb-3 font-medium">Receiver</th>
                  <th className="pb-3 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {history.map((s) => (
                  <tr key={s.id} className="border-t border-border">
                    <td className="py-4 font-medium text-muted-foreground">{s.date}</td>
                    <td className="py-4 font-semibold">{s.payer}</td>
                    <td className="py-4 font-semibold">{s.receiver}</td>
                    <td className="py-4 text-right font-bold text-primary">₹{s.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}