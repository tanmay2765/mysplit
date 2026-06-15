import { r as __toESM } from "../_runtime.mjs";
import { c as deleteUser, f as fetchUsers, p as registerUser } from "./api-Dv7xPgHm.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as LoaderCircle, c as Trash2, g as Mail, p as Phone, r as UserPlus, t as X } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-BpE9Czok.mjs";
import { t as Input } from "./input-NvmijQlt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/friends-BwWmsAWr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function FriendsPage() {
	const [usersList, setUsersList] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [isAddingUser, setIsAddingUser] = (0, import_react.useState)(false);
	const [newUserName, setNewUserName] = (0, import_react.useState)("");
	const [newUserEmail, setNewUserEmail] = (0, import_react.useState)("");
	const [newUserPhone, setNewUserPhone] = (0, import_react.useState)("");
	const [isRegistering, setIsRegistering] = (0, import_react.useState)(false);
	const loadUsers = async () => {
		setLoading(true);
		try {
			const data = await fetchUsers();
			if (data) setUsersList(data);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		loadUsers();
	}, []);
	const handleAddFriend = async (e) => {
		e.preventDefault();
		if (!newUserName.trim() || !newUserEmail.trim()) return;
		setIsRegistering(true);
		try {
			await registerUser({
				name: newUserName,
				email: newUserEmail,
				phone: newUserPhone || void 0,
				password: "DefaultPassword123"
			});
			setNewUserName("");
			setNewUserEmail("");
			setNewUserPhone("");
			setIsAddingUser(false);
			alert(`Friend "${newUserName}" successfully added!`);
			loadUsers();
		} catch (err) {
			console.error(err);
			alert(err.message || "Failed to add user.");
		} finally {
			setIsRegistering(false);
		}
	};
	const handleRemoveFriend = async (userId, name) => {
		if (!confirm(`Are you sure you want to remove ${name} from your list? This will also remove them from all groups.`)) return;
		try {
			await deleteUser(userId);
			alert(`"${name}" removed successfully.`);
			loadUsers();
		} catch (err) {
			console.error(err);
			alert(err.message || "Failed to remove user.");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6 py-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-extrabold",
					children: "Friends"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Manage your list of friends and potential group members."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setIsAddingUser(true),
					className: "rounded-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "mr-1 h-4 w-4" }), " Add Friend"]
				})]
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-center py-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" })
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3",
				children: usersList.map((u) => {
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "card-soft card-soft-hover relative p-6 flex items-start gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary text-lg font-bold shrink-0",
								children: u.name ? u.name[0].toUpperCase() : "?"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1 pr-8",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-lg font-bold truncate",
										children: u.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 flex items-center gap-2 text-xs text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3.5 w-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate",
											children: u.email
										})]
									}),
									u.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1.5 flex items-center gap-2 text-xs text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-3.5 w-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate",
											children: u.phone
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => handleRemoveFriend(u.id, u.name),
								className: "absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition cursor-pointer",
								title: "Remove Friend",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
							})
						]
					}, u.id);
				})
			}),
			isAddingUser && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm transition-opacity duration-300",
				onClick: () => setIsAddingUser(false),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-md overflow-hidden rounded-[32px] bg-background border border-primary/10 p-6 shadow-2xl md:p-8 animate-in fade-in-50 zoom-in-95 duration-200",
					onClick: (e) => e.stopPropagation(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-6 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-2xl font-extrabold text-foreground",
							children: "Add New Friend"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setIsAddingUser(false),
							className: "grid h-9 w-9 place-items-center rounded-xl bg-secondary text-foreground hover:bg-secondary/80 transition cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleAddFriend,
						className: "flex flex-col gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-bold text-muted-foreground uppercase",
								children: "Full Name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: newUserName,
								onChange: (e) => setNewUserName(e.target.value),
								placeholder: "Enter full name",
								className: "mt-1 h-11 rounded-xl",
								required: true
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-bold text-muted-foreground uppercase",
								children: "Email Address"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "email",
								value: newUserEmail,
								onChange: (e) => setNewUserEmail(e.target.value),
								placeholder: "Enter email address",
								className: "mt-1 h-11 rounded-xl",
								required: true
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-bold text-muted-foreground uppercase",
								children: "Phone Number"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "text",
								value: newUserPhone,
								onChange: (e) => setNewUserPhone(e.target.value),
								placeholder: "Enter phone number (optional)",
								className: "mt-1 h-11 rounded-xl"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "submit",
									disabled: isRegistering,
									className: "h-11 flex-1 rounded-xl font-bold",
									children: [isRegistering ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin mr-1" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "h-4 w-4 mr-1" }), " Add Friend"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									onClick: () => setIsAddingUser(false),
									className: "h-11 rounded-xl px-5",
									children: "Cancel"
								})]
							})
						]
					})]
				})
			})
		]
	});
}
//#endregion
export { FriendsPage as component };
