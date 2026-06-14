import { t as Button } from "./button-BpE9Czok.js";
import { t as Input } from "./input-NvmijQlt.js";
import { a as groups, i as expenses } from "./mock-data-DnTK_NLz.js";
import { a as fetchGroups, i as fetchExpenses, t as createExpense } from "./api-T7pjkkru.js";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Filter, Loader2, Plus, Search, X } from "lucide-react";
//#region src/routes/expenses.tsx?tsr-split=component
var currencySymbol = {
	INR: "₹",
	USD: "$",
	EUR: "€"
};
function ExpensesPage() {
	const [q, setQ] = useState("");
	const [selected, setSelected] = useState(null);
	const [expensesList, setExpensesList] = useState(expenses);
	const [groupsList, setGroupsList] = useState(groups);
	const [loading, setLoading] = useState(true);
	const [isAdding, setIsAdding] = useState(false);
	const [title, setTitle] = useState("");
	const [amount, setAmount] = useState("");
	const [currency, setCurrency] = useState("INR");
	const [splitType, setSplitType] = useState("equal");
	const [date, setDate] = useState((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
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
	const handleAddExpense = async (e) => {
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
				group_id: parseInt(groupId)
			});
			setTitle("");
			setAmount("");
			setIsAdding(false);
			loadData();
		} catch (err) {
			console.error(err);
			alert("Failed to add expense");
		}
	};
	const filtered = expensesList.filter((e) => e.description.toLowerCase().includes(q.toLowerCase()) || e.paidBy.toLowerCase().includes(q.toLowerCase()));
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col gap-6 py-2",
		children: [
			/* @__PURE__ */ jsxs("header", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
					className: "text-3xl font-extrabold",
					children: "Expenses"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-sm text-muted-foreground",
					children: "Everyone's spending, in one clean ledger."
				})] }), /* @__PURE__ */ jsxs(Button, {
					onClick: () => setIsAdding(true),
					className: "rounded-2xl",
					children: [/* @__PURE__ */ jsx(Plus, { className: "mr-1 h-4 w-4" }), " Add Expense"]
				})]
			}),
			isAdding && /* @__PURE__ */ jsx("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4",
				onClick: () => setIsAdding(false),
				children: /* @__PURE__ */ jsxs("div", {
					className: "card-soft w-full max-w-md bg-background p-6 shadow-2xl",
					onClick: (e) => e.stopPropagation(),
					children: [/* @__PURE__ */ jsxs("div", {
						className: "mb-6 flex items-center justify-between",
						children: [/* @__PURE__ */ jsx("h2", {
							className: "text-xl font-extrabold",
							children: "Add New Expense"
						}), /* @__PURE__ */ jsx("button", {
							onClick: () => setIsAdding(false),
							className: "grid h-9 w-9 place-items-center rounded-xl bg-secondary",
							children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
						})]
					}), /* @__PURE__ */ jsxs("form", {
						onSubmit: handleAddExpense,
						className: "flex flex-col gap-4",
						children: [
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "text-xs font-bold text-muted-foreground uppercase",
								children: "Description"
							}), /* @__PURE__ */ jsx(Input, {
								value: title,
								onChange: (e) => setTitle(e.target.value),
								placeholder: "e.g. Dinner, Taxi, Groceries...",
								className: "mt-1 h-11 rounded-xl",
								required: true
							})] }),
							/* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-bold text-muted-foreground uppercase",
									children: "Amount"
								}), /* @__PURE__ */ jsx(Input, {
									type: "number",
									step: "any",
									value: amount,
									onChange: (e) => setAmount(e.target.value),
									placeholder: "0.00",
									className: "mt-1 h-11 rounded-xl",
									required: true
								})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-bold text-muted-foreground uppercase",
									children: "Currency"
								}), /* @__PURE__ */ jsxs("select", {
									value: currency,
									onChange: (e) => setCurrency(e.target.value),
									className: "mt-1 flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
									children: [
										/* @__PURE__ */ jsx("option", {
											value: "INR",
											children: "INR (₹)"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "USD",
											children: "USD ($)"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "EUR",
											children: "EUR (€)"
										})
									]
								})] })]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-bold text-muted-foreground uppercase",
									children: "Group"
								}), /* @__PURE__ */ jsx("select", {
									value: groupId,
									onChange: (e) => setGroupId(e.target.value),
									className: "mt-1 flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none",
									children: groupsList.map((g) => /* @__PURE__ */ jsx("option", {
										value: g.id.replace(/[^\d]/g, "") || "1",
										children: g.name
									}, g.id))
								})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-bold text-muted-foreground uppercase",
									children: "Payer"
								}), /* @__PURE__ */ jsxs("select", {
									value: paidBy,
									onChange: (e) => setPaidBy(e.target.value),
									className: "mt-1 flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none",
									children: [
										/* @__PURE__ */ jsx("option", {
											value: "1",
											children: "Aisha"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "2",
											children: "Rohan"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "3",
											children: "Priya"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "4",
											children: "Sam"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "5",
											children: "Meera"
										})
									]
								})] })]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-bold text-muted-foreground uppercase",
									children: "Split Type"
								}), /* @__PURE__ */ jsxs("select", {
									value: splitType,
									onChange: (e) => setSplitType(e.target.value),
									className: "mt-1 flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none",
									children: [
										/* @__PURE__ */ jsx("option", {
											value: "equal",
											children: "Equal"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "exact",
											children: "Exact"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "percentage",
											children: "Percentage"
										})
									]
								})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-bold text-muted-foreground uppercase",
									children: "Date"
								}), /* @__PURE__ */ jsx(Input, {
									type: "date",
									value: date,
									onChange: (e) => setDate(e.target.value),
									className: "mt-1 h-11 rounded-xl",
									required: true
								})] })]
							}),
							/* @__PURE__ */ jsx(Button, {
								type: "submit",
								className: "mt-2 h-11 rounded-xl font-bold",
								children: "Add Expense"
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "card-soft flex flex-wrap items-center gap-3 p-3",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "relative flex-1 min-w-[220px]",
					children: [/* @__PURE__ */ jsx(Search, { className: "absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ jsx(Input, {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Search by description or member...",
						className: "h-11 rounded-xl pl-10"
					})]
				}), /* @__PURE__ */ jsxs(Button, {
					variant: "outline",
					className: "h-11 rounded-xl",
					children: [/* @__PURE__ */ jsx(Filter, { className: "mr-1 h-4 w-4" }), " Filters"]
				})]
			}),
			loading ? /* @__PURE__ */ jsx("div", {
				className: "flex justify-center py-12",
				children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-primary" })
			}) : /* @__PURE__ */ jsx("div", {
				className: "card-soft overflow-hidden",
				children: /* @__PURE__ */ jsx("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ jsxs("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ jsx("thead", {
							className: "bg-secondary/50",
							children: /* @__PURE__ */ jsxs("tr", {
								className: "text-left text-xs uppercase tracking-wider text-muted-foreground",
								children: [
									/* @__PURE__ */ jsx("th", {
										className: "px-6 py-4 font-medium",
										children: "Date"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-6 py-4 font-medium",
										children: "Description"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-6 py-4 font-medium",
										children: "Amount"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-6 py-4 font-medium",
										children: "Paid By"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-6 py-4 font-medium",
										children: "Split"
									})
								]
							})
						}), /* @__PURE__ */ jsx("tbody", { children: filtered.map((e) => /* @__PURE__ */ jsxs("tr", {
							onClick: () => setSelected(e),
							className: "cursor-pointer border-t border-border transition hover:bg-secondary/40",
							children: [
								/* @__PURE__ */ jsx("td", {
									className: "px-6 py-4 font-medium text-muted-foreground",
									children: e.date
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-6 py-4 font-semibold",
									children: e.description
								}),
								/* @__PURE__ */ jsxs("td", {
									className: "px-6 py-4 font-bold",
									children: [currencySymbol[e.currency] ?? "", e.amount.toLocaleString()]
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-6 py-4",
									children: e.paidBy
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-6 py-4",
									children: /* @__PURE__ */ jsx("span", {
										className: "rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary",
										children: e.splitType
									})
								})
							]
						}, e.id)) })]
					})
				})
			}),
			selected && /* @__PURE__ */ jsx("div", {
				className: "fixed inset-0 z-50 flex justify-end bg-black/40",
				onClick: () => setSelected(null),
				children: /* @__PURE__ */ jsxs("div", {
					className: "h-full w-full max-w-md overflow-y-auto bg-background p-6 shadow-2xl md:p-8",
					onClick: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "mb-6 flex items-center justify-between",
							children: [/* @__PURE__ */ jsx("h2", {
								className: "text-2xl font-extrabold",
								children: "Expense Details"
							}), /* @__PURE__ */ jsx("button", {
								onClick: () => setSelected(null),
								className: "grid h-9 w-9 place-items-center rounded-xl bg-secondary",
								children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "card-soft mb-4 p-6",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "text-xs uppercase tracking-wider text-muted-foreground",
									children: "Amount"
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mt-1 text-4xl font-extrabold",
									children: [currencySymbol[selected.currency] ?? "", selected.amount.toLocaleString()]
								}),
								/* @__PURE__ */ jsx("div", {
									className: "mt-1 text-sm text-muted-foreground",
									children: selected.currency
								})
							]
						}),
						/* @__PURE__ */ jsx("dl", {
							className: "card-soft divide-y divide-border p-2",
							children: [
								["Description", selected.description],
								["Date", selected.date],
								["Paid By", selected.paidBy],
								["Split Type", selected.splitType],
								["Group", groupsList.find((g) => g.id === selected.groupId)?.name ?? "—"]
							].map(([k, v]) => /* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between px-4 py-3",
								children: [/* @__PURE__ */ jsx("dt", {
									className: "text-sm text-muted-foreground",
									children: k
								}), /* @__PURE__ */ jsx("dd", {
									className: "text-sm font-semibold",
									children: v
								})]
							}, k))
						})
					]
				})
			})
		]
	});
}
//#endregion
export { ExpensesPage as component };
