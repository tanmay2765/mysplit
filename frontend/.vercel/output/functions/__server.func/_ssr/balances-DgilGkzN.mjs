import { r as __toESM } from "../_runtime.mjs";
import { d as fetchSettlements, l as fetchExpenses, u as fetchGroups } from "./api-Dv7xPgHm.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as LoaderCircle, j as ArrowRight, o as TrendingUp, s as TrendingDown, u as Scale } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/balances-DgilGkzN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function BalancesPage() {
	const [groupsList, setGroupsList] = (0, import_react.useState)([]);
	const [expensesList, setExpensesList] = (0, import_react.useState)([]);
	const [settlementsList, setSettlementsList] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [selectedGroupId, setSelectedGroupId] = (0, import_react.useState)("");
	const [selectedUserName, setSelectedUserName] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		Promise.all([
			fetchGroups(),
			fetchExpenses(),
			fetchSettlements()
		]).then(([grps, exps, setls]) => {
			if (grps) {
				setGroupsList(grps);
				if (grps.length > 0) setSelectedGroupId(grps[0].id);
			}
			if (exps) setExpensesList(exps);
			if (setls) setSettlementsList(setls);
			setLoading(false);
		});
	}, []);
	const activeGroup = groupsList.find((g) => g.id === selectedGroupId);
	let groupMembersBalances = [];
	let simplifiedSettlements = [];
	let explanationsList = [];
	if (activeGroup) {
		const rawGroupId = parseInt(activeGroup.id.replace(/[^\d]/g, ""));
		const groupExpenses = expensesList.filter((e) => e.groupId === activeGroup.id || e.groupIdRaw === rawGroupId);
		const groupSettlements = settlementsList.filter((s) => s.groupId === activeGroup.id || s.groupIdRaw === rawGroupId);
		activeGroup.members.map((m) => m.id);
		const N = activeGroup.members.length;
		const paidAmounts = {};
		const owedAmounts = {};
		activeGroup.members.forEach((m) => {
			paidAmounts[m.id] = 0;
			owedAmounts[m.id] = 0;
		});
		groupExpenses.forEach((exp) => {
			const payerId = `m${exp.paidById}`;
			const payer = activeGroup.members.find((m) => m.id === payerId || m.name === exp.paidBy);
			if (payer) paidAmounts[payer.id] += exp.amount;
			if (N > 0) activeGroup.members.forEach((m) => {
				owedAmounts[m.id] += exp.amount / N;
			});
		});
		groupMembersBalances = activeGroup.members.map((m) => {
			let net = paidAmounts[m.id] - owedAmounts[m.id];
			groupSettlements.forEach((s) => {
				const payerMemberId = `m${s.payerId}`;
				const receiverMemberId = `m${s.receiverId}`;
				if (m.id === payerMemberId || m.name === s.payer) net += s.amount;
				if (m.id === receiverMemberId || m.name === s.receiver) net -= s.amount;
			});
			return {
				id: m.id,
				name: m.name,
				avatar: m.avatar,
				amount: Math.round(net * 100) / 100,
				paid: Math.round(paidAmounts[m.id] * 100) / 100,
				owed: Math.round(owedAmounts[m.id] * 100) / 100
			};
		});
		if (groupMembersBalances.length > 0 && (!selectedUserName || !groupMembersBalances.find((u) => u.name === selectedUserName))) setSelectedUserName(groupMembersBalances[0].name);
		const debtors = groupMembersBalances.filter((m) => m.amount < -.01).map((m) => ({ ...m })).sort((a, b) => a.amount - b.amount);
		const creditors = groupMembersBalances.filter((m) => m.amount > .01).map((m) => ({ ...m })).sort((a, b) => b.amount - a.amount);
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
				amount: Math.round(settleAmt * 100) / 100
			});
			debtor.amount += settleAmt;
			creditor.amount -= settleAmt;
			if (Math.abs(debtor.amount) < .01) dIdx++;
			if (Math.abs(creditor.amount) < .01) cIdx++;
		}
		if (groupMembersBalances.find((u) => u.name === selectedUserName)) groupExpenses.forEach((exp) => {
			const isPayer = exp.paidBy === selectedUserName;
			const share = exp.amount / N;
			explanationsList.push({
				expense: exp.description,
				amount: exp.amount,
				share: isPayer ? Math.round((exp.amount - share) * 100) / 100 : Math.round(share * 100) / 100,
				reason: isPayer ? `Paid ₹${exp.amount}, gets back others' shares` : `Owes ₹${Math.round(share * 100) / 100} to ${exp.paidBy}`,
				isPositive: isPayer
			});
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-8 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex flex-wrap items-center justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-extrabold",
				children: "Balances"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Transparent debts and credits across group circles."
			})] }), groupsList.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm font-semibold text-muted-foreground",
					children: "Active Group:"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					value: selectedGroupId,
					onChange: (e) => setSelectedGroupId(e.target.value),
					className: "h-11 rounded-xl border border-border bg-card px-4 text-sm font-bold shadow-sm focus:outline-none",
					children: groupsList.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: g.id,
						children: g.name
					}, g.id))
				})]
			})]
		}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex justify-center py-12",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" })
		}) : groupsList.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "card-soft flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-primary/20 bg-primary/5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-16 w-16 place-items-center rounded-3xl bg-primary/10 text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, { className: "h-7 w-7" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mt-4 text-lg font-bold",
					children: "No groups found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Create an expense group to start tracking balances."
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
			className: "mb-4 text-lg font-bold",
			children: [
				"Net Balances (",
				activeGroup?.name,
				")"
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
			children: groupMembersBalances.map((b) => {
				const positive = b.amount >= 0;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setSelectedUserName(b.name),
					className: `card-soft card-soft-hover p-6 text-left ${selectedUserName === b.name ? "ring-2 ring-primary" : ""}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: b.avatar,
							alt: b.name,
							className: "h-12 w-12 rounded-2xl object-cover"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate font-bold",
								children: b.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: positive ? "Gets back" : "Owes"
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `flex items-center gap-1 text-2xl font-extrabold ${positive ? "text-success" : "text-destructive"}`,
						children: [
							positive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-5 w-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-5 w-5" }),
							positive ? "+" : "-",
							"₹",
							Math.abs(b.amount).toLocaleString()
						]
					})]
				}, b.id);
			})
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "grid gap-6 lg:grid-cols-[1.1fr_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "card-soft p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-1 text-lg font-bold",
						children: "Simplified Settlements"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-5 text-sm text-muted-foreground",
						children: "Transactions required to settle this group's balances."
					}),
					simplifiedSettlements.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-semibold text-muted-foreground py-6 text-center",
						children: "Everyone is completely settled up!"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-col gap-3",
						children: simplifiedSettlements.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-4 rounded-2xl bg-secondary/50 p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary font-bold shrink-0",
									children: s.from[0]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-sm font-semibold truncate",
										children: [
											s.from,
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "pays"
											}),
											" ",
											s.to
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1 flex items-center gap-2 text-xs text-muted-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "truncate",
												children: s.from
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3 w-3 shrink-0" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "truncate",
												children: s.to
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xl font-extrabold text-primary shrink-0",
									children: ["₹", s.amount.toLocaleString()]
								})
							]
						}, i))
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "card-soft p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "mb-1 text-lg font-bold",
						children: [
							"Why ",
							selectedUserName,
							" owes this"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-5 text-sm text-muted-foreground",
						children: "Expenses detail contributing to this balance."
					}),
					explanationsList.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-semibold text-muted-foreground py-6 text-center",
						children: "No group expenses recorded yet."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "text-left text-xs uppercase tracking-wider text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-3 font-medium",
										children: "Expense"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-3 font-medium",
										children: "Total"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-3 font-medium",
										children: "Share"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-3 font-medium",
										children: "Details"
									})
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: explanationsList.map((b, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 font-semibold truncate max-w-[120px]",
										children: b.expense
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "py-3",
										children: ["₹", b.amount.toLocaleString()]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: `py-3 font-bold ${b.isPositive ? "text-success" : "text-destructive"}`,
										children: [
											b.isPositive ? "+" : "-",
											"₹",
											Math.abs(b.share).toLocaleString()
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 text-xs text-muted-foreground",
										children: b.reason
									})
								]
							}, i)) })]
						})
					})
				]
			})]
		})] })]
	});
}
//#endregion
export { BalancesPage as component };
