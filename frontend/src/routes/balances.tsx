import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowRight, TrendingUp, TrendingDown, Loader2, Scale } from "lucide-react";
import { fetchGroups, fetchExpenses, fetchSettlements } from "@/lib/api";

export const Route = createFileRoute("/balances")({
  head: () => ({
    meta: [
      { title: "Balances — SplitWell" },
      { name: "description", content: "See who owes whom and why, categorized by group." },
    ],
  }),
  component: BalancesPage,
});

function BalancesPage() {
  const [groupsList, setGroupsList] = useState<any[]>([]);
  const [expensesList, setExpensesList] = useState<any[]>([]);
  const [settlementsList, setSettlementsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [selectedUserName, setSelectedUserName] = useState<string>("");

  useEffect(() => {
    Promise.all([fetchGroups(), fetchExpenses(), fetchSettlements()]).then(([grps, exps, setls]) => {
      if (grps) {
        setGroupsList(grps);
        if (grps.length > 0) {
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
  }, []);

  // Find the selected group
  const activeGroup = groupsList.find((g) => g.id === selectedGroupId);

  // Group-specific calculations
  let groupMembersBalances: any[] = [];
  let simplifiedSettlements: any[] = [];
  let explanationsList: any[] = [];

  if (activeGroup) {
    const rawGroupId = parseInt(activeGroup.id.replace(/[^\d]/g, ""));
    // Filter expenses that belong to this group
    const groupExpenses = expensesList.filter(
      (e) => e.groupId === activeGroup.id || e.groupIdRaw === rawGroupId
    );

    // Filter settlements that belong to this group
    const groupSettlements = settlementsList.filter(
      (s) => s.groupId === activeGroup.id || s.groupIdRaw === rawGroupId
    );

    const memberIds = activeGroup.members.map((m: any) => m.id);
    const N = activeGroup.members.length;

    const paidAmounts: Record<string, number> = {};
    const owedAmounts: Record<string, number> = {};

    activeGroup.members.forEach((m: any) => {
      paidAmounts[m.id] = 0;
      owedAmounts[m.id] = 0;
    });

    // Calculate paid and owed amounts
    groupExpenses.forEach((exp) => {
      const payerId = `m${exp.paidById}`;
      const payer = activeGroup.members.find(
        (m: any) => m.id === payerId || m.name === exp.paidBy
      );

      if (payer) {
        paidAmounts[payer.id] += exp.amount;
      }

      if (N > 0) {
        activeGroup.members.forEach((m: any) => {
          owedAmounts[m.id] += exp.amount / N;
        });
      }
    });

    // Net balances for the group members
    groupMembersBalances = activeGroup.members.map((m: any) => {
      let net = paidAmounts[m.id] - owedAmounts[m.id];

      // Factor in settlements
      groupSettlements.forEach((s) => {
        const payerMemberId = `m${s.payerId}`;
        const receiverMemberId = `m${s.receiverId}`;
        if (m.id === payerMemberId || m.name === s.payer) {
          net += s.amount;
        }
        if (m.id === receiverMemberId || m.name === s.receiver) {
          net -= s.amount;
        }
      });

      return {
        id: m.id,
        name: m.name,
        avatar: m.avatar,
        amount: Math.round(net * 100) / 100,
        paid: Math.round(paidAmounts[m.id] * 100) / 100,
        owed: Math.round(owedAmounts[m.id] * 100) / 100,
      };
    });

    // Automatically select the first user if none is selected
    if (groupMembersBalances.length > 0 && (!selectedUserName || !groupMembersBalances.find(u => u.name === selectedUserName))) {
      setSelectedUserName(groupMembersBalances[0].name);
    }

    // Simplified settlements (Greedy Debt Simplification)
    const debtors = groupMembersBalances
      .filter((m) => m.amount < -0.01)
      .map((m) => ({ ...m }))
      .sort((a, b) => a.amount - b.amount); // most negative first

    const creditors = groupMembersBalances
      .filter((m) => m.amount > 0.01)
      .map((m) => ({ ...m }))
      .sort((a, b) => b.amount - a.amount); // most positive first

    let dIdx = 0;
    let cIdx = 0;

    while (dIdx < debtors.length && cIdx < creditors.length) {
      const debtor = debtors[dIdx];
      const creditor = creditors[cIdx];
      const debtVal = Math.abs(debtor.amount);
      const creditVal = creditor.amount;
      const settleAmt = Math.min(debtVal, creditVal);

      simplifiedSettlements.push({
        from: debtor.name,
        to: creditor.name,
        amount: Math.round(settleAmt * 100) / 100,
      });

      debtor.amount += settleAmt;
      creditor.amount -= settleAmt;

      if (Math.abs(debtor.amount) < 0.01) dIdx++;
      if (Math.abs(creditor.amount) < 0.01) cIdx++;
    }

    // Explanations for the selected user
    const selectedUserObj = groupMembersBalances.find((u) => u.name === selectedUserName);
    if (selectedUserObj) {
      groupExpenses.forEach((exp) => {
        const isPayer = exp.paidBy === selectedUserName;
        const share = exp.amount / N;
        explanationsList.push({
          expense: exp.description,
          amount: exp.amount,
          share: isPayer ? Math.round((exp.amount - share) * 100) / 100 : Math.round(share * 100) / 100,
          reason: isPayer
            ? `Paid ₹${exp.amount}, gets back others' shares`
            : `Owes ₹${Math.round(share * 100) / 100} to ${exp.paidBy}`,
          isPositive: isPayer,
        });
      });
    }
  }

  return (
    <div className="flex flex-col gap-8 py-2">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">Balances</h1>
          <p className="text-sm text-muted-foreground">Transparent debts and credits across group circles.</p>
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
          <p className="mt-1 text-sm text-muted-foreground">Create an expense group to start tracking balances.</p>
        </div>
      ) : (
        <>
          <section>
            <h2 className="mb-4 text-lg font-bold">Net Balances ({activeGroup?.name})</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {groupMembersBalances.map((b) => {
                const positive = b.amount >= 0;
                return (
                  <button
                    key={b.id}
                    onClick={() => setSelectedUserName(b.name)}
                    className={`card-soft card-soft-hover p-6 text-left ${selectedUserName === b.name ? "ring-2 ring-primary" : ""}`}
                  >
                    <div className="mb-4 flex items-center gap-3">
                      <img src={b.avatar} alt={b.name} className="h-12 w-12 rounded-2xl object-cover" />
                      <div className="min-w-0">
                        <div className="truncate font-bold">{b.name}</div>
                        <div className="text-xs text-muted-foreground">{positive ? "Gets back" : "Owes"}</div>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1 text-2xl font-extrabold ${positive ? "text-success" : "text-destructive"}`}>
                      {positive ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                      {positive ? "+" : "-"}₹{Math.abs(b.amount).toLocaleString()}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
            <div className="card-soft p-6">
              <h2 className="mb-1 text-lg font-bold">Simplified Settlements</h2>
              <p className="mb-5 text-sm text-muted-foreground">Transactions required to settle this group's balances.</p>
              {simplifiedSettlements.length === 0 ? (
                <div className="text-sm font-semibold text-muted-foreground py-6 text-center">
                  Everyone is completely settled up!
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {simplifiedSettlements.map((s, i) => (
                    <div key={i} className="flex items-center gap-4 rounded-2xl bg-secondary/50 p-4">
                      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary font-bold shrink-0">
                        {s.from[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold truncate">
                          {s.from} <span className="text-muted-foreground">pays</span> {s.to}
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="truncate">{s.from}</span>
                          <ArrowRight className="h-3 w-3 shrink-0" />
                          <span className="truncate">{s.to}</span>
                        </div>
                      </div>
                      <div className="text-xl font-extrabold text-primary shrink-0">
                        ₹{s.amount.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="card-soft p-6">
              <h2 className="mb-1 text-lg font-bold">Why {selectedUserName} owes this</h2>
              <p className="mb-5 text-sm text-muted-foreground">Expenses detail contributing to this balance.</p>
              {explanationsList.length === 0 ? (
                <div className="text-sm font-semibold text-muted-foreground py-6 text-center">
                  No group expenses recorded yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                        <th className="pb-3 font-medium">Expense</th>
                        <th className="pb-3 font-medium">Total</th>
                        <th className="pb-3 font-medium">Share</th>
                        <th className="pb-3 font-medium">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {explanationsList.map((b, i) => (
                        <tr key={i} className="border-t border-border">
                          <td className="py-3 font-semibold truncate max-w-[120px]">{b.expense}</td>
                          <td className="py-3">₹{b.amount.toLocaleString()}</td>
                          <td className={`py-3 font-bold ${b.isPositive ? "text-success" : "text-destructive"}`}>
                            {b.isPositive ? "+" : "-"}₹{Math.abs(b.share).toLocaleString()}
                          </td>
                          <td className="py-3 text-xs text-muted-foreground">{b.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}