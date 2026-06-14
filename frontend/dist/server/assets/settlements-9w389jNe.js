import { t as Button } from "./button-BpE9Czok.js";
import { t as Input } from "./input-NvmijQlt.js";
import { c as settlementHistory, s as members } from "./mock-data-DnTK_NLz.js";
import { o as fetchSettlements } from "./api-T7pjkkru.js";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { HandCoins, Loader2 } from "lucide-react";
//#region src/routes/settlements.tsx?tsr-split=component
function SettlementsPage() {
	const [history, setHistory] = useState(settlementHistory);
	const [loading, setLoading] = useState(true);
	const [payer, setPayer] = useState(members[0]?.name || "");
	const [receiver, setReceiver] = useState(members[1]?.name || "");
	const [amount, setAmount] = useState("");
	const [date, setDate] = useState((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
	const loadSettlements = () => {
		setLoading(true);
		fetchSettlements().then((data) => {
			if (data) setHistory(data);
			setLoading(false);
		});
	};
	useEffect(() => {
		loadSettlements();
	}, []);
	const handleRecordSettlement = (e) => {
		e.preventDefault();
		if (!amount) return;
		const newSettlement = {
			id: `s-local-${Date.now()}`,
			date,
			payer,
			receiver,
			amount: parseFloat(amount)
		};
		setHistory((prev) => [newSettlement, ...prev]);
		setAmount("");
		alert("Settlement recorded locally! (POST /settlements not implemented in current API version)");
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col gap-6 py-2",
		children: [
			/* @__PURE__ */ jsxs("header", { children: [/* @__PURE__ */ jsx("h1", {
				className: "text-3xl font-extrabold",
				children: "Settlements"
			}), /* @__PURE__ */ jsx("p", {
				className: "text-sm text-muted-foreground",
				children: "Log payments and keep your group square."
			})] }),
			/* @__PURE__ */ jsxs("section", {
				className: "card-soft p-6 md:p-8",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "mb-6 flex items-center gap-3",
					children: [/* @__PURE__ */ jsx("div", {
						className: "grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground",
						children: /* @__PURE__ */ jsx(HandCoins, { className: "h-5 w-5" })
					}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
						className: "text-lg font-bold",
						children: "Record a Settlement"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-xs text-muted-foreground",
						children: "Mark a debt as paid between two members."
					})] })]
				}), /* @__PURE__ */ jsxs("form", {
					onSubmit: handleRecordSettlement,
					className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
					children: [
						/* @__PURE__ */ jsx(Field, {
							label: "Payer",
							children: /* @__PURE__ */ jsx("select", {
								value: payer,
								onChange: (e) => setPayer(e.target.value),
								className: "h-11 w-full rounded-xl border border-border bg-card px-3 text-sm",
								children: members.map((m) => /* @__PURE__ */ jsx("option", {
									value: m.name,
									children: m.name
								}, m.id))
							})
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "Receiver",
							children: /* @__PURE__ */ jsx("select", {
								value: receiver,
								onChange: (e) => setReceiver(e.target.value),
								className: "h-11 w-full rounded-xl border border-border bg-card px-3 text-sm",
								children: members.map((m) => /* @__PURE__ */ jsx("option", {
									value: m.name,
									children: m.name
								}, m.id))
							})
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "Amount",
							children: /* @__PURE__ */ jsx(Input, {
								type: "number",
								placeholder: "0.00",
								value: amount,
								onChange: (e) => setAmount(e.target.value),
								className: "h-11 rounded-xl",
								required: true
							})
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "Date",
							children: /* @__PURE__ */ jsx(Input, {
								type: "date",
								value: date,
								onChange: (e) => setDate(e.target.value),
								className: "h-11 rounded-xl",
								required: true
							})
						}),
						/* @__PURE__ */ jsx("div", {
							className: "sm:col-span-2 lg:col-span-4",
							children: /* @__PURE__ */ jsx(Button, {
								type: "submit",
								className: "rounded-2xl",
								children: "Record Settlement"
							})
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "card-soft p-6",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "mb-5 text-lg font-bold",
					children: "Settlement History"
				}), loading ? /* @__PURE__ */ jsx("div", {
					className: "flex justify-center py-12",
					children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-primary" })
				}) : /* @__PURE__ */ jsx("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ jsxs("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
							className: "text-left text-xs uppercase tracking-wider text-muted-foreground",
							children: [
								/* @__PURE__ */ jsx("th", {
									className: "pb-3 font-medium",
									children: "Date"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "pb-3 font-medium",
									children: "Payer"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "pb-3 font-medium",
									children: "Receiver"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "pb-3 font-medium text-right",
									children: "Amount"
								})
							]
						}) }), /* @__PURE__ */ jsx("tbody", { children: history.map((s) => /* @__PURE__ */ jsxs("tr", {
							className: "border-t border-border",
							children: [
								/* @__PURE__ */ jsx("td", {
									className: "py-4 font-medium text-muted-foreground",
									children: s.date
								}),
								/* @__PURE__ */ jsx("td", {
									className: "py-4 font-semibold",
									children: s.payer
								}),
								/* @__PURE__ */ jsx("td", {
									className: "py-4 font-semibold",
									children: s.receiver
								}),
								/* @__PURE__ */ jsxs("td", {
									className: "py-4 text-right font-bold text-primary",
									children: ["₹", s.amount.toLocaleString()]
								})
							]
						}, s.id)) })]
					})
				})]
			})
		]
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ jsxs("label", {
		className: "flex flex-col gap-1.5",
		children: [/* @__PURE__ */ jsx("span", {
			className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
			children: label
		}), children]
	});
}
//#endregion
export { SettlementsPage as component };
