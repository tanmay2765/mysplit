import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Plus, Search, Filter, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { expenses as mockExpenses, type Expense, groups as mockGroups } from "@/lib/mock-data";
import { fetchExpenses, createExpense, fetchGroups } from "@/lib/api";

export const Route = createFileRoute("/expenses")({
  head: () => ({ meta: [{ title: "Expenses — SplitWell" }, { name: "description", content: "Add and track shared expenses across your groups." }] }),
  component: ExpensesPage,
});

const currencySymbol: Record<string, string> = { INR: "₹", USD: "$", EUR: "€" };

function ExpensesPage() {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Expense | null>(null);
  const [expensesList, setExpensesList] = useState<Expense[]>(mockExpenses);
  const [groupsList, setGroupsList] = useState<any[]>(mockGroups);
  const [loading, setLoading] = useState(true);

  // Form states
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [splitType, setSplitType] = useState("equal");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [paidBy, setPaidBy] = useState("1");
  const [groupId, setGroupId] = useState("1");

  const loadData = async () => {
    setLoading(true);
    try {
      const expData = await fetchExpenses();
      if (expData) setExpensesList(expData);
      
      const grpData = await fetchGroups();
      if (grpData) setGroupsList(grpData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount) return;

    try {
      await createExpense({
        title,
        amount: parseFloat(amount),
        currency,
        split_type: splitType,
        expense_date: date,
        paid_by: parseInt(paidBy),
        group_id: parseInt(groupId),
      });

      // Reset
      setTitle("");
      setAmount("");
      setIsAdding(false);
      loadData();
    } catch (err) {
      console.error(err);
      alert("Failed to add expense");
    }
  };

  const filtered = expensesList.filter((e) => 
    e.description.toLowerCase().includes(q.toLowerCase()) || 
    e.paidBy.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 py-2">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold">Expenses</h1>
          <p className="text-sm text-muted-foreground">Everyone's spending, in one clean ledger.</p>
        </div>
        <Button onClick={() => setIsAdding(true)} className="rounded-2xl"><Plus className="mr-1 h-4 w-4" /> Add Expense</Button>
      </header>

      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setIsAdding(false)}>
          <div className="card-soft w-full max-w-md bg-background p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-extrabold">Add New Expense</h2>
              <button onClick={() => setIsAdding(false)} className="grid h-9 w-9 place-items-center rounded-xl bg-secondary"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={handleAddExpense} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase">Description</label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Dinner, Taxi, Groceries..." className="mt-1 h-11 rounded-xl" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase">Amount</label>
                  <Input type="number" step="any" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="mt-1 h-11 rounded-xl" required />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase">Currency</label>
                  <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="mt-1 flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase">Group</label>
                  <select value={groupId} onChange={(e) => setGroupId(e.target.value)} className="mt-1 flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none">
                    {groupsList.map((g) => (
                      <option key={g.id} value={g.id.replace(/[^\d]/g, "") || "1"}>{g.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase">Payer</label>
                  <select value={paidBy} onChange={(e) => setPaidBy(e.target.value)} className="mt-1 flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none">
                    <option value="1">Aisha</option>
                    <option value="2">Rohan</option>
                    <option value="3">Priya</option>
                    <option value="4">Sam</option>
                    <option value="5">Meera</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase">Split Type</label>
                  <select value={splitType} onChange={(e) => setSplitType(e.target.value)} className="mt-1 flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none">
                    <option value="equal">Equal</option>
                    <option value="exact">Exact</option>
                    <option value="percentage">Percentage</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase">Date</label>
                  <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 h-11 rounded-xl" required />
                </div>
              </div>
              <Button type="submit" className="mt-2 h-11 rounded-xl font-bold">Add Expense</Button>
            </form>
          </div>
        </div>
      )}

      <div className="card-soft flex flex-wrap items-center gap-3 p-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by description or member..." className="h-11 rounded-xl pl-10" />
        </div>
        <Button variant="outline" className="h-11 rounded-xl"><Filter className="mr-1 h-4 w-4" /> Filters</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="card-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50">
                <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Description</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Paid By</th>
                  <th className="px-6 py-4 font-medium">Split</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((e) => (
                  <tr key={e.id} onClick={() => setSelected(e)} className="cursor-pointer border-t border-border transition hover:bg-secondary/40">
                    <td className="px-6 py-4 font-medium text-muted-foreground">{e.date}</td>
                    <td className="px-6 py-4 font-semibold">{e.description}</td>
                    <td className="px-6 py-4 font-bold">{currencySymbol[e.currency] ?? ""}{e.amount.toLocaleString()}</td>
                    <td className="px-6 py-4">{e.paidBy}</td>
                    <td className="px-6 py-4"><span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{e.splitType}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={() => setSelected(null)}>
          <div className="h-full w-full max-w-md overflow-y-auto bg-background p-6 shadow-2xl md:p-8" onClick={(e) => e.stopPropagation()}>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-extrabold">Expense Details</h2>
              <button onClick={() => setSelected(null)} className="grid h-9 w-9 place-items-center rounded-xl bg-secondary"><X className="h-4 w-4" /></button>
            </div>
            <div className="card-soft mb-4 p-6">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Amount</div>
              <div className="mt-1 text-4xl font-extrabold">{currencySymbol[selected.currency] ?? ""}{selected.amount.toLocaleString()}</div>
              <div className="mt-1 text-sm text-muted-foreground">{selected.currency}</div>
            </div>
            <dl className="card-soft divide-y divide-border p-2">
              {[
                ["Description", selected.description],
                ["Date", selected.date],
                ["Paid By", selected.paidBy],
                ["Split Type", selected.splitType],
                ["Group", groupsList.find((g) => g.id === selected.groupId)?.name ?? "—"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between px-4 py-3">
                  <dt className="text-sm text-muted-foreground">{k}</dt>
                  <dd className="text-sm font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}
    </div>
  );
}