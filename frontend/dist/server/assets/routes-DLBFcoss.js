import { a as groups, o as importReports, s as members, u as summary } from "./mock-data-DnTK_NLz.js";
import { a as fetchGroups, i as fetchExpenses } from "./api-T7pjkkru.js";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { AlertTriangle, ArrowUpRight, CheckCircle2, Clock, Loader2, Plus, Receipt, Upload, UserPlus, Users } from "lucide-react";
//#region src/routes/index.tsx?tsr-split=component
function Dashboard() {
	const [groupsList, setGroupsList] = useState(groups);
	const [expensesCount, setExpensesCount] = useState(summary.totalExpenses);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		Promise.all([fetchGroups(), fetchExpenses()]).then(([grps, exps]) => {
			if (grps) setGroupsList(grps);
			if (exps) setExpensesCount(exps.length);
			setLoading(false);
		});
	}, []);
	const totalGroups = groupsList.length;
	const totalExpenses = expensesCount;
	const totalMembers = members.length;
	const pendingReviews = summary.pendingReviews;
	const metrics = [
		{
			label: "Total Groups",
			value: totalGroups,
			icon: Users,
			tint: "bg-primary/10 text-primary"
		},
		{
			label: "Total Expenses",
			value: totalExpenses,
			icon: Receipt,
			tint: "bg-accent/10 text-accent"
		},
		{
			label: "Total Members",
			value: totalMembers,
			icon: UserPlus,
			tint: "bg-success/10 text-success"
		},
		{
			label: "Pending Reviews",
			value: pendingReviews,
			icon: AlertTriangle,
			tint: "bg-warning/15 text-warning"
		}
	];
	const quickActions = [
		{
			label: "Create Group",
			icon: Users,
			to: "/groups"
		},
		{
			label: "Add Expense",
			icon: Plus,
			to: "/expenses"
		},
		{
			label: "Import CSV",
			icon: Upload,
			to: "/import-csv"
		}
	];
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col gap-8 py-2",
		children: [
			/* @__PURE__ */ jsxs("section", {
				className: "hero-gradient relative overflow-hidden rounded-[32px] p-8 md:p-10",
				children: [
					/* @__PURE__ */ jsx("div", { className: "absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/30 blur-3xl" }),
					/* @__PURE__ */ jsx("div", { className: "absolute bottom-0 right-10 h-48 w-48 rounded-full bg-accent/30 blur-3xl" }),
					/* @__PURE__ */ jsxs("div", {
						className: "relative grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-center",
						children: [/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("p", {
								className: "text-sm font-semibold uppercase tracking-wider text-foreground/70",
								children: "Welcome back"
							}),
							/* @__PURE__ */ jsxs("h1", {
								className: "mt-2 text-3xl font-extrabold leading-tight text-foreground md:text-5xl",
								children: [
									"Hi Tanmay,",
									/* @__PURE__ */ jsx("br", {}),
									"here's your money overview."
								]
							}),
							/* @__PURE__ */ jsxs("p", {
								className: "mt-4 max-w-md text-sm text-foreground/80 md:text-base",
								children: [
									"You're managing ",
									totalGroups,
									" groups with ",
									totalExpenses,
									" expenses.",
									" ",
									pendingReviews,
									" anomalies need review."
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-6 flex flex-wrap gap-3",
								children: [/* @__PURE__ */ jsxs(Link, {
									to: "/expenses",
									className: "inline-flex items-center gap-2 rounded-2xl bg-foreground px-5 py-3 text-sm font-semibold text-background transition hover:opacity-90",
									children: ["Add Expense ", /* @__PURE__ */ jsx(ArrowUpRight, { className: "h-4 w-4" })]
								}), /* @__PURE__ */ jsx(Link, {
									to: "/import-csv",
									className: "inline-flex items-center gap-2 rounded-2xl border border-foreground/20 bg-white/60 px-5 py-3 text-sm font-semibold text-foreground backdrop-blur transition hover:bg-white/80",
									children: "Import CSV"
								})]
							})
						] }), /* @__PURE__ */ jsx("div", {
							className: "grid grid-cols-2 gap-3",
							children: metrics.map((m) => /* @__PURE__ */ jsxs("div", {
								className: "rounded-2xl bg-white/70 p-4 backdrop-blur",
								children: [/* @__PURE__ */ jsx("div", {
									className: "text-xs font-medium text-foreground/60",
									children: m.label
								}), /* @__PURE__ */ jsx("div", {
									className: "mt-1 text-3xl font-extrabold text-foreground",
									children: m.value
								})]
							}, m.label))
						})]
					})
				]
			}),
			/* @__PURE__ */ jsx("section", {
				className: "card-soft grid grid-cols-1 gap-2 p-3 sm:grid-cols-3",
				children: quickActions.map((a) => {
					const Icon = a.icon;
					return /* @__PURE__ */ jsxs(Link, {
						to: a.to,
						className: "card-soft-hover flex items-center gap-4 rounded-2xl bg-secondary/60 px-5 py-4 transition hover:bg-secondary",
						children: [/* @__PURE__ */ jsx("div", {
							className: "grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground",
							children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5" })
						}), /* @__PURE__ */ jsxs("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ jsx("div", {
								className: "text-sm font-semibold text-foreground",
								children: a.label
							}), /* @__PURE__ */ jsx("div", {
								className: "text-xs text-muted-foreground",
								children: "One tap to get going"
							})]
						})]
					}, a.label);
				})
			}),
			loading ? /* @__PURE__ */ jsx("div", {
				className: "flex justify-center py-12",
				children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-primary" })
			}) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("section", {
				className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: metrics.map((m) => {
					const Icon = m.icon;
					return /* @__PURE__ */ jsxs("div", {
						className: "card-soft card-soft-hover p-6",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: `mb-4 grid h-12 w-12 place-items-center rounded-2xl ${m.tint}`,
								children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5" })
							}),
							/* @__PURE__ */ jsx("div", {
								className: "text-sm font-medium text-muted-foreground",
								children: m.label
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-1 text-3xl font-extrabold text-foreground",
								children: m.value
							})
						]
					}, m.label);
				})
			}), /* @__PURE__ */ jsxs("section", {
				className: "grid gap-6 lg:grid-cols-[1.5fr_1fr]",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "card-soft p-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "mb-5 flex items-center justify-between",
						children: [/* @__PURE__ */ jsx("h2", {
							className: "text-lg font-bold",
							children: "Recent Imports"
						}), /* @__PURE__ */ jsx(Link, {
							to: "/import-reports",
							className: "text-sm font-semibold text-primary hover:underline",
							children: "View all"
						})]
					}), /* @__PURE__ */ jsx("div", {
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
										children: "Rows"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "pb-3 font-medium",
										children: "Anomalies"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "pb-3 font-medium",
										children: "Status"
									})
								]
							}) }), /* @__PURE__ */ jsx("tbody", { children: importReports.map((r) => /* @__PURE__ */ jsxs("tr", {
								className: "border-t border-border",
								children: [
									/* @__PURE__ */ jsx("td", {
										className: "py-3.5 font-medium",
										children: r.date
									}),
									/* @__PURE__ */ jsx("td", {
										className: "py-3.5",
										children: r.rowsProcessed
									}),
									/* @__PURE__ */ jsx("td", {
										className: "py-3.5",
										children: r.anomalies
									}),
									/* @__PURE__ */ jsx("td", {
										className: "py-3.5",
										children: /* @__PURE__ */ jsx(StatusPill, { status: r.status })
									})
								]
							}, r.id)) })]
						})
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "card-soft p-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "mb-5 flex items-center justify-between",
						children: [/* @__PURE__ */ jsx("h2", {
							className: "text-lg font-bold",
							children: "Active Groups"
						}), /* @__PURE__ */ jsx(Link, {
							to: "/groups",
							className: "text-sm font-semibold text-primary hover:underline",
							children: "All groups"
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "flex flex-col gap-3",
						children: groupsList.slice(0, 4).map((g) => /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3 rounded-2xl bg-secondary/50 p-3",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "flex -space-x-2",
									children: g.members.slice(0, 3).map((m) => /* @__PURE__ */ jsx("img", {
										src: m.avatar,
										alt: m.name,
										className: "h-9 w-9 rounded-full border-2 border-card object-cover"
									}, m.id))
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ jsx("div", {
										className: "truncate text-sm font-semibold",
										children: g.name
									}), /* @__PURE__ */ jsxs("div", {
										className: "text-xs text-muted-foreground",
										children: [
											g.members.length,
											" members · ",
											g.expenseCount,
											" expenses"
										]
									})]
								}),
								/* @__PURE__ */ jsx("div", {
									className: "shrink-0 text-xs text-muted-foreground",
									children: g.lastActivity
								})
							]
						}, g.id))
					})]
				})]
			})] })
		]
	});
}
function StatusPill({ status }) {
	const map = {
		Completed: {
			cls: "bg-success/10 text-success",
			Icon: CheckCircle2
		},
		"Pending Review": {
			cls: "bg-warning/15 text-warning",
			Icon: Clock
		},
		Failed: {
			cls: "bg-destructive/10 text-destructive",
			Icon: AlertTriangle
		}
	};
	const { cls, Icon } = map[status] ?? map.Completed;
	return /* @__PURE__ */ jsxs("span", {
		className: `inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${cls}`,
		children: [/* @__PURE__ */ jsx(Icon, { className: "h-3.5 w-3.5" }), status]
	});
}
//#endregion
export { Dashboard as component };
