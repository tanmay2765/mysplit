import { t as Button } from "./button-BpE9Czok.js";
import { t as anomalies } from "./mock-data-DnTK_NLz.js";
import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { AlertTriangle, Check, CheckCircle2, FileText, Pencil, X } from "lucide-react";
//#region src/routes/import-reports.tsx?tsr-split=component
var sevClass = {
	High: "bg-destructive/10 text-destructive",
	Medium: "bg-warning/15 text-warning",
	Low: "bg-primary/10 text-primary"
};
var summary = [
	{
		label: "Rows Processed",
		value: 142,
		icon: FileText,
		tint: "bg-primary/10 text-primary"
	},
	{
		label: "Anomalies Found",
		value: anomalies.length,
		icon: AlertTriangle,
		tint: "bg-warning/15 text-warning"
	},
	{
		label: "Import Status",
		value: "In Review",
		icon: CheckCircle2,
		tint: "bg-success/10 text-success"
	}
];
function ImportReportsPage() {
	const [selected, setSelected] = useState(null);
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col gap-6 py-2",
		children: [
			/* @__PURE__ */ jsxs("header", { children: [/* @__PURE__ */ jsx("h1", {
				className: "text-3xl font-extrabold",
				children: "Import Reports"
			}), /* @__PURE__ */ jsx("p", {
				className: "text-sm text-muted-foreground",
				children: "Approve, edit, or reject each anomaly before it lands."
			})] }),
			/* @__PURE__ */ jsx("section", {
				className: "grid grid-cols-1 gap-4 sm:grid-cols-3",
				children: summary.map((s) => {
					const Icon = s.icon;
					return /* @__PURE__ */ jsxs("div", {
						className: "card-soft p-6",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: `mb-4 grid h-12 w-12 place-items-center rounded-2xl ${s.tint}`,
								children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5" })
							}),
							/* @__PURE__ */ jsx("div", {
								className: "text-sm font-medium text-muted-foreground",
								children: s.label
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-1 text-3xl font-extrabold",
								children: s.value
							})
						]
					}, s.label);
				})
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "card-soft p-6",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "mb-5 text-lg font-bold",
					children: "Anomalies"
				}), /* @__PURE__ */ jsx("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ jsxs("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ jsx("thead", {
							className: "bg-secondary/50",
							children: /* @__PURE__ */ jsxs("tr", {
								className: "text-left text-xs uppercase tracking-wider text-muted-foreground",
								children: [
									/* @__PURE__ */ jsx("th", {
										className: "px-4 py-3 font-medium",
										children: "Type"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-4 py-3 font-medium",
										children: "Description"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-4 py-3 font-medium",
										children: "Severity"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-4 py-3 font-medium",
										children: "Action"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-4 py-3 font-medium",
										children: "Status"
									})
								]
							})
						}), /* @__PURE__ */ jsx("tbody", { children: anomalies.map((a) => /* @__PURE__ */ jsxs("tr", {
							onClick: () => setSelected(a),
							className: "cursor-pointer border-t border-border transition hover:bg-secondary/40",
							children: [
								/* @__PURE__ */ jsx("td", {
									className: "px-4 py-4 font-semibold",
									children: a.type
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-4 py-4 text-muted-foreground",
									children: a.description
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-4 py-4",
									children: /* @__PURE__ */ jsx("span", {
										className: `rounded-full px-3 py-1 text-xs font-semibold ${sevClass[a.severity]}`,
										children: a.severity
									})
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-4 py-4 text-xs text-muted-foreground",
									children: a.action
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-4 py-4",
									children: /* @__PURE__ */ jsx("span", {
										className: `rounded-full px-3 py-1 text-xs font-semibold ${a.status === "Approved" ? "bg-success/10 text-success" : a.status === "Rejected" ? "bg-destructive/10 text-destructive" : "bg-warning/15 text-warning"}`,
										children: a.status
									})
								})
							]
						}, a.id)) })]
					})
				})]
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
								children: "Review Anomaly"
							}), /* @__PURE__ */ jsx("button", {
								onClick: () => setSelected(null),
								className: "grid h-9 w-9 place-items-center rounded-xl bg-secondary",
								children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "card-soft mb-4 p-5",
							children: [
								/* @__PURE__ */ jsxs("span", {
									className: `inline-block rounded-full px-3 py-1 text-xs font-semibold ${sevClass[selected.severity]}`,
									children: [selected.severity, " severity"]
								}),
								/* @__PURE__ */ jsx("div", {
									className: "mt-3 text-lg font-bold",
									children: selected.type
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: selected.description
								})
							]
						}),
						selected.originalName && selected.suggestedName && /* @__PURE__ */ jsxs("div", {
							className: "card-soft mb-4 p-5",
							children: [/* @__PURE__ */ jsx("h3", {
								className: "mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground",
								children: "Suggested change"
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-3",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex-1 rounded-2xl bg-destructive/5 p-3 text-center",
										children: [/* @__PURE__ */ jsx("div", {
											className: "text-xs text-muted-foreground",
											children: "Original"
										}), /* @__PURE__ */ jsx("div", {
											className: "font-bold",
											children: selected.originalName
										})]
									}),
									/* @__PURE__ */ jsx("span", { children: "→" }),
									/* @__PURE__ */ jsxs("div", {
										className: "flex-1 rounded-2xl bg-success/10 p-3 text-center",
										children: [/* @__PURE__ */ jsx("div", {
											className: "text-xs text-muted-foreground",
											children: "Suggested"
										}), /* @__PURE__ */ jsx("div", {
											className: "font-bold",
											children: selected.suggestedName
										})]
									})
								]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex gap-2",
							children: [
								/* @__PURE__ */ jsxs(Button, {
									className: "flex-1 rounded-2xl bg-success text-success-foreground hover:bg-success/90",
									children: [/* @__PURE__ */ jsx(Check, { className: "mr-1 h-4 w-4" }), " Approve"]
								}),
								/* @__PURE__ */ jsxs(Button, {
									variant: "outline",
									className: "flex-1 rounded-2xl",
									children: [/* @__PURE__ */ jsx(Pencil, { className: "mr-1 h-4 w-4" }), " Edit"]
								}),
								/* @__PURE__ */ jsxs(Button, {
									variant: "destructive",
									className: "flex-1 rounded-2xl",
									children: [/* @__PURE__ */ jsx(X, { className: "mr-1 h-4 w-4" }), " Reject"]
								})
							]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { ImportReportsPage as component };
