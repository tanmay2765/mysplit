import { r as __toESM } from "../_runtime.mjs";
import { r as groups } from "./mock-data-C4Y8N_Dm.mjs";
import { f as fetchUsers, n as createGroup, o as deleteGroup, p as registerUser, r as createMembership, s as deleteMembership, u as fetchGroups } from "./api-Dv7xPgHm.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { E as Clock, O as Check, _ as LoaderCircle, c as Trash2, d as Receipt, f as Plus, n as Users, r as UserPlus, t as X } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-BpE9Czok.mjs";
import { t as Input } from "./input-NvmijQlt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/groups-Du3Bb6dl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function GroupsPage() {
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [groupsList, setGroupsList] = (0, import_react.useState)(groups);
	const [allUsers, setAllUsers] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [isCreating, setIsCreating] = (0, import_react.useState)(false);
	const [newGroupName, setNewGroupName] = (0, import_react.useState)("");
	const [selectedUserIds, setSelectedUserIds] = (0, import_react.useState)([]);
	const [newMemName, setNewMemName] = (0, import_react.useState)("");
	const [newMemEmail, setNewMemEmail] = (0, import_react.useState)("");
	const [newMemPhone, setNewMemPhone] = (0, import_react.useState)("");
	const [isRegisteringMem, setIsRegisteringMem] = (0, import_react.useState)(false);
	const [inviteEmail, setInviteEmail] = (0, import_react.useState)("");
	const loadGroupsAndUsers = async () => {
		setLoading(true);
		try {
			const grpData = await fetchGroups();
			if (grpData) setGroupsList(grpData);
			const userData = await fetchUsers();
			if (userData) setAllUsers(userData);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		loadGroupsAndUsers();
	}, []);
	const handleCreateGroup = async (e) => {
		e.preventDefault();
		if (!newGroupName.trim()) return;
		try {
			const groupId = (await createGroup(newGroupName)).id;
			for (const userId of selectedUserIds) await createMembership(userId, groupId);
			setNewGroupName("");
			setSelectedUserIds([]);
			setIsCreating(false);
			loadGroupsAndUsers();
		} catch (err) {
			console.error(err);
			alert("Failed to create group");
		}
	};
	const handleRegisterNewMember = async (e) => {
		e.preventDefault();
		if (!newMemName.trim() || !newMemEmail.trim()) return;
		setIsRegisteringMem(true);
		try {
			const newUserId = (await registerUser({
				name: newMemName,
				email: newMemEmail,
				phone: newMemPhone,
				password: "DefaultPassword123"
			})).id;
			const newUserObj = {
				id: newUserId,
				name: newMemName,
				email: newMemEmail,
				phone: newMemPhone
			};
			setAllUsers((prev) => [...prev, newUserObj]);
			setSelectedUserIds((prev) => [...prev, newUserId]);
			setNewMemName("");
			setNewMemEmail("");
			setNewMemPhone("");
			alert(`Member "${newMemName}" registered and added to selection!`);
		} catch (err) {
			console.error(err);
			alert(err.message || "Failed to register new member.");
		} finally {
			setIsRegisteringMem(false);
		}
	};
	const toggleUserSelection = (userId) => {
		setSelectedUserIds((prev) => prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]);
	};
	const handleInviteMember = async (e) => {
		e.preventDefault();
		if (!inviteEmail.trim() || !selected) return;
		const groupIdInt = parseInt(selected.id.replace(/[^\d]/g, ""));
		if (isNaN(groupIdInt)) {
			alert("Cannot add members to a mock group.");
			return;
		}
		try {
			const existingUser = allUsers.find((u) => u.email.toLowerCase() === inviteEmail.trim().toLowerCase());
			let userId;
			if (existingUser) userId = existingUser.id;
			else {
				const name = prompt(`User with email "${inviteEmail}" not found. Enter name to register & invite them:`);
				if (!name) return;
				const phone = prompt("Enter phone number (optional):") || "";
				userId = (await registerUser({
					name,
					email: inviteEmail.trim(),
					phone,
					password: "DefaultPassword123"
				})).id;
			}
			await createMembership(userId, groupIdInt);
			setInviteEmail("");
			const updatedGroups = await fetchGroups();
			if (updatedGroups) {
				setGroupsList(updatedGroups);
				const updatedSelected = updatedGroups.find((g) => g.id === selected.id);
				if (updatedSelected) setSelected(updatedSelected);
			}
			const userData = await fetchUsers();
			if (userData) setAllUsers(userData);
			alert("Member added successfully!");
		} catch (err) {
			console.error(err);
			alert("Failed to add member to group");
		}
	};
	const handleRemoveMember = async (userIdStr) => {
		if (!selected) return;
		const groupIdInt = parseInt(selected.id.replace(/[^\d]/g, ""));
		const userIdInt = parseInt(userIdStr.replace(/[^\d]/g, ""));
		if (isNaN(groupIdInt) || isNaN(userIdInt) || groupIdInt <= 2) {
			setSelected((prev) => {
				if (!prev) return null;
				return {
					...prev,
					members: prev.members.filter((mem) => mem.id !== userIdStr)
				};
			});
			alert("Member removed successfully!");
			return;
		}
		if (!confirm("Are you sure you want to remove this member from the group?")) return;
		try {
			await deleteMembership(userIdInt, groupIdInt);
			alert("Member removed successfully!");
		} catch (err) {
			console.error(err);
			alert(err.message || "Failed to remove member");
		}
		try {
			const updatedGroups = await fetchGroups();
			if (updatedGroups) {
				setGroupsList(updatedGroups);
				const updatedSelected = updatedGroups.find((g) => g.id === selected.id);
				if (updatedSelected) setSelected(updatedSelected);
				else setSelected(null);
			}
		} catch (e) {
			console.error("Failed to refresh groups", e);
		}
	};
	const handleDeleteGroup = async (groupIdStr) => {
		const groupIdInt = parseInt(groupIdStr.replace(/[^\d]/g, ""));
		if (isNaN(groupIdInt) || groupIdInt <= 2) {
			setGroupsList((prev) => prev.filter((g) => g.id !== groupIdStr));
			setSelected(null);
			alert("Mock group deleted successfully!");
			return;
		}
		if (!confirm("Are you sure you want to delete this group? All memberships and expenses inside this group will be permanently deleted.")) return;
		try {
			await deleteGroup(groupIdInt);
			alert("Group deleted successfully!");
			setSelected(null);
			loadGroupsAndUsers();
		} catch (err) {
			console.error(err);
			alert(err.message || "Failed to delete group");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6 py-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-extrabold",
					children: "Groups"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Track who's sharing what across your circles."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setIsCreating(true),
					className: "rounded-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1 h-4 w-4" }), " Create Group"]
				})]
			}),
			isCreating && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "card-soft p-6 flex flex-col gap-6 border border-primary/20 bg-primary/5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xl font-bold",
						children: "Create a New Group"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						variant: "ghost",
						onClick: () => setIsCreating(false),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleCreateGroup,
					className: "flex flex-col gap-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-bold text-muted-foreground uppercase",
							children: "Group Name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: newGroupName,
							onChange: (e) => setNewGroupName(e.target.value),
							placeholder: "e.g. Goa Trip, Flatmates, Shared Expenses...",
							className: "mt-1 h-11 rounded-xl bg-background",
							required: true
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-6 md:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "card-soft p-4 bg-background",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3",
									children: "Add Existing Members"
								}), allUsers.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "No registered members found."
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-col gap-2 max-h-[200px] overflow-y-auto pr-1",
									children: allUsers.map((u) => {
										const isChecked = selectedUserIds.includes(u.id);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => toggleUserSelection(u.id),
											className: `flex items-center justify-between p-2.5 rounded-xl text-left transition text-sm ${isChecked ? "bg-primary/10 text-primary border border-primary/20" : "bg-secondary/40 hover:bg-secondary/80 border border-transparent"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "grid h-8 w-8 place-items-center rounded-full bg-secondary text-xs font-bold",
													children: u.name[0].toUpperCase()
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-semibold",
													children: u.name
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-xs text-muted-foreground",
													children: u.email
												})] })]
											}), isChecked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 shrink-0" })]
										}, u.id);
									})
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "card-soft p-4 bg-background",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3",
									children: "Register & Add New Member"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											placeholder: "Full Name",
											value: newMemName,
											onChange: (e) => setNewMemName(e.target.value),
											className: "h-10 rounded-xl"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "email",
											placeholder: "Email Address",
											value: newMemEmail,
											onChange: (e) => setNewMemEmail(e.target.value),
											className: "h-10 rounded-xl"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											placeholder: "Phone Number (optional)",
											value: newMemPhone,
											onChange: (e) => setNewMemPhone(e.target.value),
											className: "h-10 rounded-xl"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											type: "button",
											onClick: handleRegisterNewMember,
											disabled: isRegisteringMem,
											variant: "outline",
											className: "h-10 rounded-xl text-xs font-bold",
											children: [isRegisteringMem ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3 w-3 animate-spin mr-1" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "h-3 w-3 mr-1" }), "Register & Add"]
										})
									]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2 p-3 bg-secondary/30 rounded-xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs font-semibold text-muted-foreground uppercase mr-2",
								children: [
									"Members Selected (",
									selectedUserIds.length,
									"):"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex -space-x-1.5 overflow-hidden",
								children: selectedUserIds.map((id) => {
									const user = allUsers.find((u) => u.id === id);
									return user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										title: user.name,
										className: "grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground text-xs font-extrabold border-2 border-background",
										children: user.name[0].toUpperCase()
									}, id) : null;
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "h-11 rounded-xl px-6",
								children: "Create Group"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								onClick: () => setIsCreating(false),
								className: "h-11 rounded-xl px-6",
								children: "Cancel"
							})]
						})
					]
				})]
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-center py-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" })
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3",
				children: groupsList.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setSelected(g),
					className: "card-soft card-soft-hover group p-6 text-left",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-5 w-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }),
									" ",
									g.lastActivity
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-lg font-bold",
							children: g.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 text-xs text-muted-foreground",
							children: [g.members.length, " members"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex -space-x-2",
								children: [g.members.slice(0, 4).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: m.avatar,
									alt: m.name,
									className: "h-8 w-8 rounded-full border-2 border-card object-cover"
								}, m.id)), g.members.length > 4 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid h-8 w-8 place-items-center rounded-full border-2 border-card bg-secondary text-xs font-semibold",
									children: ["+", g.members.length - 4]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1 text-sm font-semibold text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "h-4 w-4" }),
									" ",
									g.expenseCount
								]
							})]
						})
					]
				}, g.id))
			}),
			selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex justify-end bg-black/40",
				onClick: () => setSelected(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "h-full w-full max-w-md overflow-y-auto bg-background p-6 shadow-2xl md:p-8",
					onClick: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-6 flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-2xl font-extrabold truncate",
									children: selected.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => handleDeleteGroup(selected.id),
									className: "mt-1 flex items-center gap-1 text-xs font-semibold text-destructive hover:underline cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" }), " Delete Group"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setSelected(null),
								className: "grid h-9 w-9 place-items-center rounded-xl bg-secondary shrink-0 cursor-pointer",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "card-soft mb-4 p-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: handleInviteMember,
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "Add member by email",
									value: inviteEmail,
									onChange: (e) => setInviteEmail(e.target.value),
									className: "rounded-xl",
									required: true
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									size: "icon",
									className: "rounded-xl",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "h-4 w-4" })
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-soft p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground",
								children: "Members"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-col gap-3",
								children: selected.members.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 rounded-2xl p-2 hover:bg-secondary/50",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: m.avatar,
											alt: m.name,
											className: "h-10 w-10 rounded-full object-cover"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-sm font-semibold",
												children: m.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-xs text-muted-foreground",
												children: [
													"Joined ",
													m.joinDate,
													m.leaveDate ? ` · Left ${m.leaveDate}` : ""
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => handleRemoveMember(m.id),
											className: "text-xs font-semibold text-destructive hover:underline cursor-pointer",
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
