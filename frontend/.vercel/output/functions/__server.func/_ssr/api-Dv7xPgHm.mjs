import { a as members } from "./mock-data-C4Y8N_Dm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-Dv7xPgHm.js
var API_BASE_URL = "https://shared-expense-api.onrender.com";
var membersMap = {
	"1": {
		name: "Aisha",
		avatar: members[0].avatar
	},
	"2": {
		name: "Rohan",
		avatar: members[1].avatar
	},
	"3": {
		name: "Priya",
		avatar: members[2].avatar
	},
	"4": {
		name: "Sam",
		avatar: members[3].avatar
	},
	"5": {
		name: "Meera",
		avatar: members[4].avatar
	}
};
var dynamicMembersMap = {};
function updateMembersCache(users) {
	users.forEach((u) => {
		const cleanId = String(u.id);
		if (!dynamicMembersMap[cleanId]) {
			const avatarIds = [
				"1534528741775-53994a69daeb",
				"1544005313-94ddf0286df2",
				"1506794778202-cad84cf45f1d",
				"1517841905240-472988babdf9",
				"1539571696357-5a69c17a67c6"
			];
			const avatarIndex = u.id % avatarIds.length;
			dynamicMembersMap[cleanId] = {
				name: u.name,
				avatar: `https://images.unsplash.com/photo-${avatarIds[avatarIndex]}?w=128&h=128&fit=crop&crop=faces`
			};
		}
	});
}
function resolveMember(id) {
	const cleanId = String(id).replace(/[^\d]/g, "");
	return dynamicMembersMap[cleanId] || membersMap[cleanId] || {
		name: `Member ${id}`,
		avatar: members[0].avatar
	};
}
async function fetchUsers() {
	try {
		const res = await fetch(`${API_BASE_URL}/auth/users`);
		if (!res.ok) throw new Error("Failed to fetch users");
		const data = await res.json();
		updateMembersCache(data);
		return data;
	} catch (e) {
		console.error("API Error, using fallback users:", e);
		return null;
	}
}
async function registerUser(user) {
	const res = await fetch(`${API_BASE_URL}/auth/register`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(user)
	});
	if (!res.ok) {
		const errData = await res.json();
		throw new Error(errData.detail || "Failed to register user");
	}
	const data = await res.json();
	updateMembersCache([{
		id: data.id,
		name: user.name,
		email: user.email
	}]);
	return data;
}
async function fetchGroups() {
	try {
		const res = await fetch(`${API_BASE_URL}/groups/`);
		if (!res.ok) throw new Error("Failed to fetch groups");
		const data = await res.json();
		await fetchUsers();
		if (data && data.length > 0) return Promise.all(data.map(async (g) => {
			const memberships = await fetchGroupMemberships(g.id);
			let groupMembers = [];
			if (memberships && memberships.length > 0) groupMembers = memberships.map((m) => {
				const memberInfo = resolveMember(m.user_id);
				return {
					id: `m${m.user_id}`,
					name: memberInfo.name,
					avatar: memberInfo.avatar,
					joinDate: m.joined_at
				};
			});
			else if (g.id <= 2) groupMembers = members.slice(0, 4);
			return {
				id: `g${g.id}`,
				name: g.name,
				members: groupMembers,
				expenseCount: 3,
				lastActivity: "Active"
			};
		}));
	} catch (e) {
		console.error("API Error, using fallback:", e);
	}
	return null;
}
async function createGroup(name) {
	const res = await fetch(`${API_BASE_URL}/groups/`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ name })
	});
	if (!res.ok) throw new Error("Failed to create group");
	return res.json();
}
async function createMembership(userId, groupId) {
	const res = await fetch(`${API_BASE_URL}/memberships/`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			user_id: userId,
			group_id: groupId
		})
	});
	if (!res.ok) throw new Error("Failed to create membership");
	return res.json();
}
async function fetchGroupMemberships(groupId) {
	try {
		const res = await fetch(`${API_BASE_URL}/memberships/group/${groupId}`);
		if (!res.ok) throw new Error("Failed to fetch group memberships");
		return await res.json();
	} catch (e) {
		console.error(e);
		return null;
	}
}
async function fetchExpenses() {
	try {
		await fetchUsers();
		const res = await fetch(`${API_BASE_URL}/expenses/`);
		if (!res.ok) throw new Error("Failed to fetch expenses");
		const data = await res.json();
		if (data && data.length > 0) return data.map((e) => ({
			id: `e${e.id}`,
			date: e.expense_date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
			description: e.title,
			amount: e.amount,
			currency: e.currency || "INR",
			paidBy: resolveMember(e.paid_by).name,
			paidById: e.paid_by,
			splitType: e.split_type ? e.split_type.charAt(0).toUpperCase() + e.split_type.slice(1) : "Equal",
			groupId: `g${e.group_id}`,
			groupIdRaw: e.group_id
		}));
	} catch (e) {
		console.error("API Error, using fallback:", e);
	}
	return null;
}
async function createExpense(expense) {
	const res = await fetch(`${API_BASE_URL}/expenses/`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(expense)
	});
	if (!res.ok) throw new Error("Failed to create expense");
	return res.json();
}
async function deleteExpense(expenseId) {
	const res = await fetch(`${API_BASE_URL}/expenses/${expenseId}`, { method: "DELETE" });
	if (!res.ok) throw new Error("Failed to delete expense");
	return res.json();
}
async function fetchSettlements() {
	try {
		await fetchUsers();
		const res = await fetch(`${API_BASE_URL}/settlements/`);
		if (!res.ok) throw new Error("Failed to fetch settlements");
		const data = await res.json();
		if (data && data.length > 0) return data.map((s) => ({
			id: `s${s.id}`,
			date: s.settlement_date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
			payer: resolveMember(s.payer_id).name,
			payerId: s.payer_id,
			receiver: resolveMember(s.receiver_id).name,
			receiverId: s.receiver_id,
			amount: s.amount,
			groupId: `g${s.group_id}`,
			groupIdRaw: s.group_id
		}));
	} catch (e) {
		console.error("API Error, using fallback:", e);
	}
	return null;
}
async function uploadCSV(file) {
	const formData = new FormData();
	formData.append("file", file);
	const res = await fetch(`${API_BASE_URL}/import/`, {
		method: "POST",
		body: formData
	});
	if (!res.ok) throw new Error("Failed to upload CSV");
	return res.json();
}
async function deleteMembership(userId, groupId) {
	const res = await fetch(`${API_BASE_URL}/memberships/group/${groupId}/user/${userId}`, { method: "DELETE" });
	if (!res.ok) throw new Error("Failed to delete membership");
	return res.json();
}
async function deleteGroup(groupId) {
	const res = await fetch(`${API_BASE_URL}/groups/${groupId}`, { method: "DELETE" });
	if (!res.ok) throw new Error("Failed to delete group");
	return res.json();
}
async function deleteUser(userId) {
	const res = await fetch(`${API_BASE_URL}/auth/users/${userId}`, { method: "DELETE" });
	if (!res.ok) throw new Error("Failed to delete user");
	return res.json();
}
async function createSettlement(settlement) {
	const res = await fetch(`${API_BASE_URL}/settlements/`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(settlement)
	});
	if (!res.ok) throw new Error("Failed to record settlement");
	return res.json();
}
//#endregion
export { deleteExpense as a, deleteUser as c, fetchSettlements as d, fetchUsers as f, createSettlement as i, fetchExpenses as l, uploadCSV as m, createGroup as n, deleteGroup as o, registerUser as p, createMembership as r, deleteMembership as s, createExpense as t, fetchGroups as u };
