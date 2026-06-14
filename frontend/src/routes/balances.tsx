import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowRight, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { balances as mockBalances, simplifiedSettlements, balanceExplanation } from "@/lib/mock-data";
import { fetchBalances } from "@/lib/api";

export const Route = createFileRoute("/balances")({
  head: () => ({ meta: [{ title: "Balances — SplitWell" }, { name: "description", content: "See who owes who and why." }] }),
  component: BalancesPage,
});

function BalancesPage() {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [balancesList, setBalancesList] = useState<any[]>(mockBalances);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBalances().then((data) => {
      if (data) {
        setBalancesList(data);
        if (data.length > 0) {
          setSelectedUser(data[0].name);
        }
      } else {
        if (mockBalances.length > 0) {
          setSelectedUser(mockBalances[0].name);
        }
      }
      setLoading(false);
    });
  }, []);

  return (
    <div className="flex flex-col gap-8 py-2">
      <header>
        <h1 className="text-3xl font-extrabold">Balances</h1>
        <p className="text-sm text-muted-foreground">Transparent debts and credits across all members.</p>
      </header>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <section>
            <h2 className="mb-4 text-lg font-bold">Net Balances</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {balancesList.map((b) => {
                const positive = b.amount >= 0;
                return (
                  <button
                    key={b.memberId}
                    onClick={() => setSelectedUser(b.name)}
                    className={`card-soft card-soft-hover p-6 text-left ${selectedUser === b.name ? "ring-2 ring-primary" : ""}`}
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
              <p className="mb-5 text-sm text-muted-foreground">Fewest transactions to settle everyone up.</p>
              <div className="flex flex-col gap-3">
                {simplifiedSettlements.map((s, i) => (
                  <div key={i} className="flex items-center gap-4 rounded-2xl bg-secondary/50 p-4">
                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-destructive/10 text-destructive font-bold">{s.from[0]}</div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold">{s.from} <span className="text-muted-foreground">pays</span> {s.to}</div>
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{s.from}</span><ArrowRight className="h-3 w-3" /><span>{s.to}</span>
                      </div>
                    </div>
                    <div className="text-xl font-extrabold text-primary">₹{s.amount.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-soft p-6">
              <h2 className="mb-1 text-lg font-bold">Why {selectedUser} owes this</h2>
              <p className="mb-5 text-sm text-muted-foreground">Every contributing expense, explained.</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                      <th className="pb-3 font-medium">Expense</th>
                      <th className="pb-3 font-medium">Amount</th>
                      <th className="pb-3 font-medium">Share</th>
                      <th className="pb-3 font-medium">Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {balanceExplanation.map((b) => (
                      <tr key={b.expense} className="border-t border-border">
                        <td className="py-3 font-semibold">{b.expense}</td>
                        <td className="py-3">₹{b.amount.toLocaleString()}</td>
                        <td className="py-3 font-bold text-primary">₹{b.share.toLocaleString()}</td>
                        <td className="py-3 text-xs text-muted-foreground">{b.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}