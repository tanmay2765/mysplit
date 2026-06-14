import { t as Button } from "./button-BpE9Czok.js";
import { t as Input } from "./input-NvmijQlt.js";
import { a as groups } from "./mock-data-DnTK_NLz.js";
import { a as fetchGroups, n as createGroup } from "./api-T7pjkkru.js";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Clock, Loader2, Plus, Receipt, UserPlus, Users, X } from "lucide-react";
//#region src/routes/groups.tsx?tsr-split=component
function GroupsPage() {
	const [selected, setSelected] = useState(null);
	const [groupsList, setGroupsList] = useState(groups);
	const [loading, setLoading] = useState(true);
	const [isCreating, setIsCreating] = useState(false);
	const [newGroupName, setNewGroupName] = useState("");
	const loadGroups = () => {
		setLoading(true);
		fetchGroups().then((data) => {
			if (data) setGroupsList(data);
			setLoading(false);
		});
	};
	useEffect(() => {
		loadGroups();
	}, []);
	const handleCreateGroup = async (e) => {
		e.preventDefault();
		if (!newGroupName.trim()) return;
		try {
			await createGroup(newGroupName);
			setNewGroupName("");
			setIsCreating(false);
			loadGroups();
		} catch (err) {
			console.error(err);
			alert("Failed to create group");
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col gap-6 py-2",
		children: [
			/* @__PURE__ */ jsxs("header", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
					className: "text-3xl font-extrabold",
					children: "Groups"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-sm text-muted-foreground",
					children: "Track who's sharing what across your circles."
				})] }), /* @__PURE__ */ jsxs(Button, {
					onClick: () => setIsCreating(true),
					className: "rounded-2xl",
					children: [/* @__PURE__ */ jsx(Plus, { className: "mr-1 h-4 w-4" }), " Create Group"]
				})]
			}),
			isCreating && /* @__PURE__ */ jsxs("form", {
				onSubmit: handleCreateGroup,
				className: "card-soft flex flex-wrap items-center gap-3 p-4",
				children: [/* @__PURE__ */ jsx(Input, {
					value: newGroupName,
					onChange: (e) => setNewGroupName(e.target.value),
					placeholder: "Enter group name...",
					className: "flex-1 min-w-[200px] h-11 rounded-xl",
					autoFocus: true
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ jsx(Button, {
						type: "submit",
						className: "h-11 rounded-xl",
						children: "Create"
					}), /* @__PURE__ */ jsx(Button, {
						type: "button",
						variant: "outline",
						onClick: () => setIsCreating(false),
						className: "h-11 rounded-xl",
						children: "Cancel"
					})]
				})]
			}),
			loading ? /* @__PURE__ */ jsx("div", {
				className: "flex justify-center py-12",
				children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-primary" })
			}) : /* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3",
				children: groupsList.map((g) => /* @__PURE__ */ jsxs("button", {
					onClick: () => setSelected(g),
					className: "card-soft card-soft-hover group p-6 text-left",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "mb-4 flex items-center justify-between",
							children: [/* @__PURE__ */ jsx("div", {
								className: "grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary",
								children: /* @__PURE__ */ jsx(Users, { className: "h-5 w-5" })
							}), /* @__PURE__ */ jsxs("span", {
								className: "inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-muted-foreground",
								children: [
									/* @__PURE__ */ jsx(Clock, { className: "h-3 w-3" }),
									" ",
									g.lastActivity
								]
							})]
						}),
						/* @__PURE__ */ jsx("h3", {
							className: "text-lg font-bold",
							children: g.name
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-1 text-xs text-muted-foreground",
							children: [g.members.length, " members"]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-5 flex items-center justify-between",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex -space-x-2",
								children: [g.members.slice(0, 4).map((m) => /* @__PURE__ */ jsx("img", {
									src: m.avatar,
									alt: m.name,
									className: "h-8 w-8 rounded-full border-2 border-card object-cover"
								}, m.id)), g.members.length > 4 && /* @__PURE__ */ jsxs("div", {
									className: "grid h-8 w-8 place-items-center rounded-full border-2 border-card bg-secondary text-xs font-semibold",
									children: ["+", g.members.length - 4]
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-1 text-sm font-semibold text-muted-foreground",
								children: [
									/* @__PURE__ */ jsx(Receipt, { className: "h-4 w-4" }),
									" ",
									g.expenseCount
								]
							})]
						})
					]
				}, g.id))
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
								children: selected.name
							}), /* @__PURE__ */ jsx("button", {
								onClick: () => setSelected(null),
								className: "grid h-9 w-9 place-items-center rounded-xl bg-secondary",
								children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
							})]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "card-soft mb-4 p-4",
							children: /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ jsx(Input, {
									placeholder: "Add member by email",
									className: "rounded-xl"
								}), /* @__PURE__ */ jsx(Button, {
									size: "icon",
									className: "rounded-xl",
									children: /* @__PURE__ */ jsx(UserPlus, { className: "h-4 w-4" })
								})]
							})
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "card-soft p-4",
							children: [/* @__PURE__ */ jsx("h3", {
								className: "mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground",
								children: "Members"
							}), /* @__PURE__ */ jsx("div", {
								className: "flex flex-col gap-3",
								children: selected.members.map((m) => /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-3 rounded-2xl p-2 hover:bg-secondary/50",
									children: [
										/* @__PURE__ */ jsx("img", {
											src: m.avatar,
											alt: m.name,
											className: "h-10 w-10 rounded-full object-cover"
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "min-w-0 flex-1",
											children: [/* @__PURE__ */ jsx("div", {
												className: "text-sm font-semibold",
												children: m.name
											}), /* @__PURE__ */ jsxs("div", {
												className: "text-xs text-muted-foreground",
												children: [
													"Joined ",
													m.joinDate,
													m.leaveDate ? ` · Left ${m.leaveDate}` : ""
												]
											})]
										}),
										/* @__PURE__ */ jsx("button", {
											className: "text-xs font-semibold text-destructive hover:underline",
											children: "Remove"
										})
									]
								}, m.id))
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { GroupsPage as component };
