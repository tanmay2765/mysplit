import { r as __toESM } from "../_runtime.mjs";
import { a as groups, o as importReports, s as members, u as summary } from "./mock-data-DnTK_NLz.mjs";
import { a as fetchGroups, i as fetchExpenses } from "./api-T7pjkkru.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { C as Clock, D as ArrowUpRight, a as TriangleAlert, d as Plus, i as Upload, m as LoaderCircle, n as Users, r as UserPlus, u as Receipt, w as CircleCheck } from "../_libs/lucide-react.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DLBFcoss.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Dashboard() {
	const [groupsList, setGroupsList] = (0, import_react.useState)(groups);
	const [expensesCount, setExpensesCount] = (0, import_react.useState)(summary.totalExpenses);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
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
			icon: TriangleAlert,
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-8 py-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "hero-gradient relative overflow-hidden rounded-[32px] p-8 md:p-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/30 blur-3xl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute bottom-0 right-10 h-48 w-48 rounded-full bg-accent/30 blur-3xl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold uppercase tracking-wider text-foreground/70",
								children: "Welcome back"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "mt-2 text-3xl font-extrabold leading-tight text-foreground md:text-5xl",
								children: [
									"Hi Tanmay,",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									"here's your money overview."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 flex flex-wrap gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/expenses",
									className: "inline-flex items-center gap-2 rounded-2xl bg-foreground px-5 py-3 text-sm font-semibold text-background transition hover:opacity-90",
									children: ["Add Expense ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-4 w-4" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/import-csv",
									className: "inline-flex items-center gap-2 rounded-2xl border border-foreground/20 bg-white/60 px-5 py-3 text-sm font-semibold text-foreground backdrop-blur transition hover:bg-white/80",
									children: "Import CSV"
								})]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 gap-3",
							children: metrics.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl bg-white/70 p-4 backdrop-blur",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs font-medium text-foreground/60",
									children: m.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 text-3xl font-extrabold text-foreground",
									children: m.value
								})]
							}, m.label))
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "card-soft grid grid-cols-1 gap-2 p-3 sm:grid-cols-3",
				children: quickActions.map((a) => {
					const Icon = a.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: a.to,
						className: "card-soft-hover flex items-center gap-4 rounded-2xl bg-secondary/60 px-5 py-4 transition hover:bg-secondary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-semibold text-foreground",
								children: a.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: "One tap to get going"
							})]
						})]
					}, a.label);
				})
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-center py-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" })
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: metrics.map((m) => {
					const Icon = m.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "card-soft card-soft-hover p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `mb-4 grid h-12 w-12 place-items-center rounded-2xl ${m.tint}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-medium text-muted-foreground",
								children: m.label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-3xl font-extrabold text-foreground",
								children: m.value
							})
						]
					}, m.label);
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-6 lg:grid-cols-[1.5fr_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-soft p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-5 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-bold",
							children: "Recent Imports"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/import-reports",
							className: "text-sm font-semibold text-primary hover:underline",
							children: "View all"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
										children: "Rows"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-3 font-medium",
										children: "Anomalies"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-3 font-medium",
										children: "Status"
									})
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: importReports.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3.5 font-medium",
										children: r.date
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3.5",
										children: r.rowsProcessed
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3.5",
										children: r.anomalies
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: r.status })
									})
								]
							}, r.id)) })]
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-soft p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-5 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-bold",
							children: "Active Groups"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/groups",
							className: "text-sm font-semibold text-primary hover:underline",
							children: "All groups"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-col gap-3",
						children: groupsList.slice(0, 4).map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 rounded-2xl bg-secondary/50 p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex -space-x-2",
									children: g.members.slice(0, 3).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: m.avatar,
										alt: m.name,
										className: "h-9 w-9 rounded-full border-2 border-card object-cover"
									}, m.id))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "truncate text-sm font-semibold",
										children: g.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-muted-foreground",
										children: [
											g.members.length,
											" members · ",
											g.expenseCount,
											" expenses"
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
			Icon: CircleCheck
		},
		"Pending Review": {
			cls: "bg-warning/15 text-warning",
			Icon: Clock
		},
		Failed: {
			cls: "bg-destructive/10 text-destructive",
			Icon: TriangleAlert
		}
	};
	const { cls, Icon } = map[status] ?? map.Completed;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: `inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${cls}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5" }), status]
	});
}
//#endregion
export { Dashboard as component };
