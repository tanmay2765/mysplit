import { r as __toESM } from "../_runtime.mjs";
import { s as uploadCSV } from "./api-T7pjkkru.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { S as CloudUpload, T as Check, a as TriangleAlert, m as LoaderCircle, w as CircleCheck, x as Download, y as FileSearch } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-BpE9Czok.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/import-csv-Bdqmi4ko.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var steps = [
	{
		label: "Upload",
		icon: CloudUpload
	},
	{
		label: "Analyze",
		icon: FileSearch
	},
	{
		label: "Detect Anomalies",
		icon: TriangleAlert
	},
	{
		label: "Review",
		icon: CircleCheck
	},
	{
		label: "Import",
		icon: Download
	}
];
function ImportCsvPage() {
	const [uploaded, setUploaded] = (0, import_react.useState)(false);
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const [fileName, setFileName] = (0, import_react.useState)("");
	const [report, setReport] = (0, import_react.useState)(null);
	const fileInputRef = (0, import_react.useRef)(null);
	const current = uploading ? 1 : uploaded ? 3 : 0;
	const handleFileChange = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setFileName(file.name);
		setUploading(true);
		setUploaded(false);
		setReport(null);
		try {
			setReport(await uploadCSV(file));
			setUploaded(true);
		} catch (err) {
			console.error(err);
			alert("Failed to upload and validate CSV file.");
		} finally {
			setUploading(false);
		}
	};
	const handleBoxClick = () => {
		if (!uploading) fileInputRef.current?.click();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6 py-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-extrabold",
				children: "Import CSV"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Upload your expenses CSV file to run anomaly detection."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "file",
				ref: fileInputRef,
				onChange: handleFileChange,
				accept: ".csv",
				className: "hidden"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				onClick: handleBoxClick,
				className: `card-soft card-soft-hover flex flex-col items-center gap-4 border-2 border-dashed border-primary/30 bg-primary/5 p-10 text-center md:p-16 cursor-pointer ${uploading ? "opacity-60 cursor-not-allowed" : ""}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-16 w-16 place-items-center rounded-3xl bg-primary text-primary-foreground",
						children: uploading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-7 w-7 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudUpload, { className: "h-7 w-7" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-lg font-bold",
						children: uploading ? "Processing..." : uploaded ? `${fileName} uploaded` : "Choose or drag a CSV file here"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm text-muted-foreground",
						children: uploading ? "Running server-side validations and anomaly checks..." : uploaded && report ? `Validation complete · ${report.rows} rows · ${report.anomaly_count} anomalies found` : "Click to browse files (CSV format expected)"
					})] }),
					!uploaded && !uploading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "rounded-2xl",
						children: "Choose File"
					}),
					uploaded && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1.5 text-sm font-semibold text-success",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }), " Validation Passed"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "card-soft p-6 md:p-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-5 text-lg font-bold",
					children: "Workflow"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap items-center gap-2 md:gap-0",
					children: steps.map((s, i) => {
						const Icon = s.icon;
						const done = i < current;
						const active = i === current;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `grid h-12 w-12 place-items-center rounded-2xl transition ${done ? "bg-success text-success-foreground" : active ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `text-xs font-semibold ${active ? "text-foreground" : "text-muted-foreground"}`,
									children: s.label
								})]
							}), i < steps.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `mx-2 hidden h-0.5 w-12 md:block ${done ? "bg-success" : "bg-border"}` })]
						}, s.label);
					})
				})]
			}),
			uploaded && report && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "card-soft p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-5 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "text-lg font-bold",
						children: [
							"Detected Anomalies (",
							report.anomaly_count,
							")"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "rounded-2xl",
						onClick: () => alert("Report review and import complete!"),
						children: "Approve & Import"
					})]
				}), report.anomaly_count > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-secondary/50",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "text-left text-xs uppercase tracking-wider text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3 font-medium",
										children: "Anomaly Type"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3 font-medium",
										children: "Count"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3 font-medium",
										children: "Suggested Action"
									})
								]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: report.anomalies.map((a, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 font-semibold capitalize",
									children: a.type.replace(/_/g, " ")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: a.count || 1
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full bg-warning/15 px-3 py-1 text-xs font-semibold text-warning",
										children: a.action || "Flagged for review"
									})
								})
							]
						}, idx)) })]
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-center py-6 text-sm text-muted-foreground",
					children: "No anomalies detected. Everything looks perfect!"
				})]
			})
		]
	});
}
//#endregion
export { ImportCsvPage as component };
