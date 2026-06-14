import { l as simplifiedSettlements, n as balanceExplanation, r as balances } from "./mock-data-DnTK_NLz.js";
import { r as fetchBalances } from "./api-T7pjkkru.js";
import { useEffect, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { ArrowRight, Loader2, TrendingDown, TrendingUp } from "lucide-react";
//#region src/routes/balances.tsx?tsr-split=component
function BalancesPage() {
	const [selectedUser, setSelectedUser] = useState(null);
	const [balancesList, setBalancesList] = useState(balances);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		fetchBalances().then((data) => {
			if (data) {
				setBalancesList(data);
				if (data.length > 0) setSelectedUser(data[0].name);
			} else if (balances.length > 0) setSelectedUser(balances[0].name);
			setLoading(false);
		});
	}, []);
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col gap-8 py-2",
		children: [/* @__PURE__ */ jsxs("header", { children: [/* @__PURE__ */ jsx("h1", {
			className: "text-3xl font-extrabold",
			children: "Balances"
		}), /* @__PURE__ */ jsx("p", {
			className: "text-sm text-muted-foreground",
			children: "Transparent debts and credits across all members."
		})] }), loading ? /* @__PURE__ */ jsx("div", {
			className: "flex justify-center py-12",
			children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-primary" })
		}) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsx("h2", {
			className: "mb-4 text-lg font-bold",
			children: "Net Balances"
		}), /* @__PURE__ */ jsx("div", {
			className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
			children: balancesList.map((b) => {
				const positive = b.amount >= 0;
				return /* @__PURE__ */ jsxs("button", {
					onClick: () => setSelectedUser(b.name),
					className: `card-soft card-soft-hover p-6 text-left ${selectedUser === b.name ? "ring-2 ring-primary" : ""}`,
					children: [/* @__PURE__ */ jsxs("div", {
						className: "mb-4 flex items-center gap-3",
						children: [/* @__PURE__ */ jsx("img", {
							src: b.avatar,
							alt: b.name,
							className: "h-12 w-12 rounded-2xl object-cover"
						}), /* @__PURE__ */ jsxs("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ jsx("div", {
								className: "truncate font-bold",
								children: b.name
							}), /* @__PURE__ */ jsx("div", {
								className: "text-xs text-muted-foreground",
								children: positive ? "Gets back" : "Owes"
							})]
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: `flex items-center gap-1 text-2xl font-extrabold ${positive ? "text-success" : "text-destructive"}`,
						children: [
							positive ? /* @__PURE__ */ jsx(TrendingUp, { className: "h-5 w-5" }) : /* @__PURE__ */ jsx(TrendingDown, { className: "h-5 w-5" }),
							positive ? "+" : "-",
							"₹",
							Math.abs(b.amount).toLocaleString()
						]
					})]
				}, b.memberId);
			})
		})] }), /* @__PURE__ */ jsxs("section", {
			className: "grid gap-6 lg:grid-cols-[1.1fr_1fr]",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "card-soft p-6",
				children: [
					/* @__PURE__ */ jsx("h2", {
						className: "mb-1 text-lg font-bold",
						children: "Simplified Settlements"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mb-5 text-sm text-muted-foreground",
						children: "Fewest transactions to settle everyone up."
					}),
					/* @__PURE__ */ jsx("div", {
						className: "flex flex-col gap-3",
						children: simplifiedSettlements.map((s, i) => /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-4 rounded-2xl bg-secondary/50 p-4",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "grid h-11 w-11 place-items-center rounded-2xl bg-destructive/10 text-destructive font-bold",
									children: s.from[0]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex-1",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "text-sm font-semibold",
										children: [
											s.from,
											" ",
											/* @__PURE__ */ jsx("span", {
												className: "text-muted-foreground",
												children: "pays"
											}),
											" ",
											s.to
										]
									}), /* @__PURE__ */ jsxs("div", {
										className: "mt-1 flex items-center gap-2 text-xs text-muted-foreground",
										children: [
											/* @__PURE__ */ jsx("span", { children: s.from }),
											/* @__PURE__ */ jsx(ArrowRight, { className: "h-3 w-3" }),
											/* @__PURE__ */ jsx("span", { children: s.to })
										]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "text-xl font-extrabold text-primary",
									children: ["₹", s.amount.toLocaleString()]
								})
							]
						}, i))
					})
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "card-soft p-6",
				children: [
					/* @__PURE__ */ jsxs("h2", {
						className: "mb-1 text-lg font-bold",
						children: [
							"Why ",
							selectedUser,
							" owes this"
						]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mb-5 text-sm text-muted-foreground",
						children: "Every contributing expense, explained."
					}),
					/* @__PURE__ */ jsx("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ jsxs("table", {
							className: "w-full text-sm",
							children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
								className: "text-left text-xs uppercase tracking-wider text-muted-foreground",
								children: [
									/* @__PURE__ */ jsx("th", {
										className: "pb-3 font-medium",
										children: "Expense"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "pb-3 font-medium",
										children: "Amount"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "pb-3 font-medium",
										children: "Share"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "pb-3 font-medium",
										children: "Reason"
									})
								]
							}) }), /* @__PURE__ */ jsx("tbody", { children: balanceExplanation.map((b) => /* @__PURE__ */ jsxs("tr", {
								className: "border-t border-border",
								children: [
									/* @__PURE__ */ jsx("td", {
										className: "py-3 font-semibold",
										children: b.expense
									}),
									/* @__PURE__ */ jsxs("td", {
										className: "py-3",
										children: ["₹", b.amount.toLocaleString()]
									}),
									/* @__PURE__ */ jsxs("td", {
										className: "py-3 font-bold text-primary",
										children: ["₹", b.share.toLocaleString()]
									}),
									/* @__PURE__ */ jsx("td", {
										className: "py-3 text-xs text-muted-foreground",
										children: b.reason
									})
								]
							}, b.expense)) })]
						})
					})
				]
			})]
		})] })]
	});
}
//#endregion
export { BalancesPage as component };
