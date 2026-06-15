import { r as __toESM } from "../_runtime.mjs";
import { d as fetchSettlements, i as createSettlement, l as fetchExpenses, u as fetchGroups } from "./api-Dv7xPgHm.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as LoaderCircle, u as Scale, y as HandCoins } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-BpE9Czok.mjs";
import { t as Input } from "./input-NvmijQlt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settlements-Bt-93Lsc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SettlementsPage() {
	const [groupsList, setGroupsList] = (0, import_react.useState)([]);
	const [expensesList, setExpensesList] = (0, import_react.useState)([]);
	const [settlementsList, setSettlementsList] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [selectedGroupId, setSelectedGroupId] = (0, import_react.useState)("");
	const [payerId, setPayerId] = (0, import_react.useState)("");
	const [receiverId, setReceiverId] = (0, import_react.useState)("");
	const [amount, setAmount] = (0, import_react.useState)("");
	const [date, setDate] = (0, import_react.useState)((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
	const [recording, setRecording] = (0, import_react.useState)(false);
	const loadAllData = () => {
		setLoading(true);
		Promise.all([
			fetchGroups(),
			fetchExpenses(),
			fetchSettlements()
		]).then(([grps, exps, setls]) => {
			if (grps) {
				setGroupsList(grps);
				if (grps.length > 0 && !selectedGroupId) setSelectedGroupId(grps[0].id);
			}
			if (exps) setExpensesList(exps);
			if (setls) setSettlementsList(setls);
			setLoading(false);
		});
	};
	(0, import_react.useEffect)(() => {
		loadAllData();
	}, []);
	const activeGroup = groupsList.find((g) => g.id === selectedGroupId);
	(0, import_react.useEffect)(() => {
		if (activeGroup && activeGroup.members.length > 1) {
			setPayerId(activeGroup.members[0].id);
			setReceiverId(activeGroup.members[1].id);
		} else {
			setPayerId("");
			setReceiverId("");
		}
	}, [selectedGroupId, groupsList]);
	let groupSettlementsHistory = [];
	if (activeGroup) {
		const rawGroupId = parseInt(activeGroup.id.replace(/[^\d]/g, ""));
		groupSettlementsHistory = settlementsList.filter((s) => s.groupId === activeGroup.id || s.groupIdRaw === rawGroupId);
	}
	const handleRecordSettlement = async (e) => {
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
			const newLocalSettlement = {
				id: `s-local-${Date.now()}`,
				date,
				payer: activeGroup.members.find((m) => m.id === payerId)?.name || "Payer",
				receiver: activeGroup.members.find((m) => m.id === receiverId)?.name || "Receiver",
				amount: parseFloat(amount),
				groupId: activeGroup.id
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
				settlement_date: date
			});
			setAmount("");
			alert("Settlement successfully recorded in database!");
			loadAllData();
		} catch (err) {
			console.error(err);
			alert(err.message || "Failed to record settlement");
		} finally {
			setRecording(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex flex-wrap items-center justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-extrabold",
				children: "Settlements"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Log payments and keep your group square."
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
					children: "Create an expense group to start logging settlements."
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "card-soft p-6 md:p-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HandCoins, { className: "h-5 w-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-lg font-bold",
					children: [
						"Record a Settlement (",
						activeGroup?.name,
						")"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Mark a debt as paid between two members of this group."
				})] })]
			}), activeGroup && activeGroup.members.length < 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-semibold text-muted-foreground py-2",
				children: "At least two members are required in this group to record settlements."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleRecordSettlement,
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Payer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: payerId,
							onChange: (e) => setPayerId(e.target.value),
							className: "h-11 w-full rounded-xl border border-border bg-card px-3 text-sm focus:outline-none",
							children: activeGroup?.members.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: m.id,
								children: m.name
							}, m.id))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Receiver",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: receiverId,
							onChange: (e) => setReceiverId(e.target.value),
							className: "h-11 w-full rounded-xl border border-border bg-card px-3 text-sm focus:outline-none",
							children: activeGroup?.members.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: m.id,
								children: m.name
							}, m.id))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Amount",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							step: "any",
							placeholder: "0.00",
							value: amount,
							onChange: (e) => setAmount(e.target.value),
							className: "h-11 rounded-xl bg-card",
							required: true
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Date",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: date,
							onChange: (e) => setDate(e.target.value),
							className: "h-11 rounded-xl bg-card",
							required: true
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "sm:col-span-2 lg:col-span-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "submit",
							disabled: recording,
							className: "rounded-2xl h-11 px-6",
							children: [recording ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin mr-1" }) : null, " Record Settlement"]
						})
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "card-soft p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "mb-5 text-lg font-bold",
				children: [
					"Settlement History (",
					activeGroup?.name,
					")"
				]
			}), groupSettlementsHistory.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm font-semibold text-muted-foreground py-6 text-center",
				children: "No recorded settlements for this group yet."
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
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: groupSettlementsHistory.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
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
		})] })]
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
