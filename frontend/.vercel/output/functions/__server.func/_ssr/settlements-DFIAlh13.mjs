import { r as __toESM } from "../_runtime.mjs";
import { c as settlementHistory, s as members } from "./mock-data-DnTK_NLz.mjs";
import { l as fetchSettlements } from "./api-CFou-uru.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as HandCoins, h as LoaderCircle } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-BpE9Czok.mjs";
import { t as Input } from "./input-NvmijQlt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settlements-DFIAlh13.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SettlementsPage() {
	const [history, setHistory] = (0, import_react.useState)(settlementHistory);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [payer, setPayer] = (0, import_react.useState)(members[0]?.name || "");
	const [receiver, setReceiver] = (0, import_react.useState)(members[1]?.name || "");
	const [amount, setAmount] = (0, import_react.useState)("");
	const [date, setDate] = (0, import_react.useState)((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
	const loadSettlements = () => {
		setLoading(true);
		fetchSettlements().then((data) => {
			if (data) setHistory(data);
			setLoading(false);
		});
	};
	(0, import_react.useEffect)(() => {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6 py-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-extrabold",
				children: "Settlements"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Log payments and keep your group square."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "card-soft p-6 md:p-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-6 flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HandCoins, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-bold",
						children: "Record a Settlement"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Mark a debt as paid between two members."
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleRecordSettlement,
					className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Payer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: payer,
								onChange: (e) => setPayer(e.target.value),
								className: "h-11 w-full rounded-xl border border-border bg-card px-3 text-sm",
								children: members.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: m.name,
									children: m.name
								}, m.id))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Receiver",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: receiver,
								onChange: (e) => setReceiver(e.target.value),
								className: "h-11 w-full rounded-xl border border-border bg-card px-3 text-sm",
								children: members.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: m.name,
									children: m.name
								}, m.id))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Amount",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								placeholder: "0.00",
								value: amount,
								onChange: (e) => setAmount(e.target.value),
								className: "h-11 rounded-xl",
								required: true
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Date",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								value: date,
								onChange: (e) => setDate(e.target.value),
								className: "h-11 rounded-xl",
								required: true
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "sm:col-span-2 lg:col-span-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "rounded-2xl",
								children: "Record Settlement"
							})
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "card-soft p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-5 text-lg font-bold",
					children: "Settlement History"
				}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-center py-12",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" })
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "text-left text-xs uppercase tracking-wider text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pb-3 font-medium",
									children: "Date"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pb-3 font-medium",
									children: "Payer"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pb-3 font-medium",
									children: "Receiver"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pb-3 font-medium text-right",
									children: "Amount"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: history.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-4 font-medium text-muted-foreground",
									children: s.date
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-4 font-semibold",
									children: s.payer
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-4 font-semibold",
									children: s.receiver
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex flex-col gap-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
			children: label
		}), children]
	});
}
//#endregion
export { SettlementsPage as component };
