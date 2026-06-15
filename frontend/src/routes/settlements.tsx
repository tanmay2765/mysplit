import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { HandCoins, Loader2, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchGroups, fetchExpenses, fetchSettlements, createSettlement } from "@/lib/api";

export const Route = createFileRoute("/settlements")({
  head: () => ({
    meta: [
      { title: "Settlements — SplitWell" },
      { name: "description", content: "Record and review settled debts per group." },
    ],
  }),
  component: SettlementsPage,
});

function SettlementsPage() {
  const [groupsList, setGroupsList] = useState<any[]>([]);
  const [expensesList, setExpensesList] = useState<any[]>([]);
  const [settlementsList, setSettlementsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [payerId, setPayerId] = useState<string>("");
  const [receiverId, setReceiverId] = useState<string>("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [recording, setRecording] = useState(false);

  const loadAllData = () => {
    setLoading(true);
    Promise.all([fetchGroups(), fetchExpenses(), fetchSettlements()]).then(([grps, exps, setls]) => {
      if (grps) {
        setGroupsList(grps);
        if (grps.length > 0 && !selectedGroupId) {
          setSelectedGroupId(grps[0].id);
        }
      }
      if (exps) {
        setExpensesList(exps);
      }
      if (setls) {
        setSettlementsList(setls);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Find the selected group
  const activeGroup = groupsList.find((g) => g.id === selectedGroupId);

  // Set default payer/receiver when active group changes
  useEffect(() => {
    if (activeGroup && activeGroup.members.length > 1) {
      setPayerId(activeGroup.members[0].id);
      setReceiverId(activeGroup.members[1].id);
    } else {
      setPayerId("");
      setReceiverId("");
    }
  }, [selectedGroupId, groupsList]);

  // Group-specific calculations (Net balances including settlements)
  let groupSettlementsHistory: any[] = [];

  if (activeGroup) {
    const rawGroupId = parseInt(activeGroup.id.replace(/[^\d]/g, ""));

    // Filter settlements that belong to this group
    groupSettlementsHistory = settlementsList.filter(
      (s) => s.groupId === activeGroup.id || s.groupIdRaw === rawGroupId
    );
  }

  const handleRecordSettlement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !activeGroup || !payerId || !receiverId) return;

    if (payerId === receiverId) {
      alert("Payer and Receiver cannot be the same person.");
      return;
    }

    const rawGroupId = parseInt(activeGroup.id.replace(/[^\d]/g, ""));
    const rawPayerId = parseInt(payerId.replace(/[^\d]/g, ""));
    const rawReceiverId = parseInt(receiverId.replace(/[^\d]/g, ""));

    if (isNaN(rawGroupId) || isNaN(rawPayerId) || isNaN(rawReceiverId)) {
      // Local mock settlement recording
      const newLocalSettlement = {
        id: `s-local-${Date.now()}`,
        date,
        payer: activeGroup.members.find((m: any) => m.id === payerId)?.name || "Payer",
        receiver: activeGroup.members.find((m: any) => m.id === receiverId)?.name || "Receiver",
        amount: parseFloat(amount),
        groupId: activeGroup.id,
      };
      setSettlementsList((prev) => [newLocalSettlement, ...prev]);
      setAmount("");
      alert("Recorded local settlement!");
      return;
    }

    setRecording(true);
    try {
      await createSettlement({
        payer_id: rawPayerId,
        receiver_id: rawReceiverId,
        group_id: rawGroupId,
        amount: parseFloat(amount),
        settlement_date: date,
      });

      setAmount("");
      alert("Settlement successfully recorded in database!");
      loadAllData();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to record settlement");
    } finally {
      setRecording(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 py-2">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">Settlements</h1>
          <p className="text-sm text-muted-foreground">Log payments and keep your group square.</p>
        </div>
        {groupsList.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-muted-foreground">Active Group:</span>
            <select
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(e.target.value)}
              className="h-11 rounded-xl border border-border bg-card px-4 text-sm font-bold shadow-sm focus:outline-none"
            >
              {groupsList.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </header>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : groupsList.length === 0 ? (
        <div className="card-soft flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-primary/20 bg-primary/5">
          <div className="grid h-16 w-16 place-items-center rounded-3xl bg-primary/10 text-primary">
            <Scale className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-lg font-bold">No groups found</h3>
          <p className="mt-1 text-sm text-muted-foreground">Create an expense group to start logging settlements.</p>
        </div>
      ) : (
        <>
          <section className="card-soft p-6 md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
                <HandCoins className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Record a Settlement ({activeGroup?.name})</h2>
                <p className="text-xs text-muted-foreground">Mark a debt as paid between two members of this group.</p>
              </div>
            </div>
            {activeGroup && activeGroup.members.length < 2 ? (
              <p className="text-sm font-semibold text-muted-foreground py-2">
                At least two members are required in this group to record settlements.
              </p>
            ) : (
              <form onSubmit={handleRecordSettlement} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Field label="Payer">
                  <select
                    value={payerId}
                    onChange={(e) => setPayerId(e.target.value)}
                    className="h-11 w-full rounded-xl border border-border bg-card px-3 text-sm focus:outline-none"
                  >
                    {activeGroup?.members.map((m: any) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Receiver">
                  <select
                    value={receiverId}
                    onChange={(e) => setReceiverId(e.target.value)}
                    className="h-11 w-full rounded-xl border border-border bg-card px-3 text-sm focus:outline-none"
                  >
                    {activeGroup?.members.map((m: any) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Amount">
                  <Input
                    type="number"
                    step="any"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="h-11 rounded-xl bg-card"
                    required
                  />
                </Field>
                <Field label="Date">
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="h-11 rounded-xl bg-card"
                    required
                  />
                </Field>
                <div className="sm:col-span-2 lg:col-span-4">
                  <Button type="submit" disabled={recording} className="rounded-2xl h-11 px-6">
                    {recording ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null} Record Settlement
                  </Button>
                </div>
              </form>
            )}
          </section>

          <section className="card-soft p-6">
            <h2 className="mb-5 text-lg font-bold">Settlement History ({activeGroup?.name})</h2>
            {groupSettlementsHistory.length === 0 ? (
              <div className="text-sm font-semibold text-muted-foreground py-6 text-center">
                No recorded settlements for this group yet.
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
                    {groupSettlementsHistory.map((s) => (
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
        </>
      )}
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