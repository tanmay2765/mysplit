import { s as members } from "./mock-data-DnTK_NLz.js";
//#region src/lib/api.ts
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
function resolveMember(id) {
	return membersMap[String(id).replace(/[^\d]/g, "")] || {
		name: `Member ${id}`,
		avatar: members[0].avatar
	};
}
async function fetchGroups() {
	try {
		const res = await fetch(`${API_BASE_URL}/groups/`);
		if (!res.ok) throw new Error("Failed to fetch groups");
		const data = await res.json();
		if (data && data.length > 0) return data.map((g) => ({
			id: `g${g.id}`,
			name: g.name,
			members: members.slice(0, 4),
			expenseCount: 3,
			lastActivity: "Just now"
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
async function fetchExpenses() {
	try {
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
			splitType: e.split_type ? e.split_type.charAt(0).toUpperCase() + e.split_type.slice(1) : "Equal",
			groupId: `g${e.group_id}`
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
async function fetchBalances() {
	try {
		const res = await fetch(`${API_BASE_URL}/balances/`);
		if (!res.ok) throw new Error("Failed to fetch balances");
		const data = await res.json();
		if (data && Object.keys(data).length > 0) return Object.entries(data).map(([userId, amount]) => {
			const member = resolveMember(userId);
			return {
				memberId: `m${userId}`,
				name: member.name,
				avatar: member.avatar,
				amount: parseFloat(amount)
			};
		});
	} catch (e) {
		console.error("API Error, using fallback:", e);
	}
	return null;
}
async function fetchSettlements() {
	try {
		const res = await fetch(`${API_BASE_URL}/settlements/`);
		if (!res.ok) throw new Error("Failed to fetch settlements");
		const data = await res.json();
		if (data && data.length > 0) return data.map((s) => ({
			id: `s${s.id}`,
			date: s.settlement_date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
			payer: resolveMember(s.payer_id).name,
			receiver: resolveMember(s.receiver_id).name,
			amount: s.amount
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
//#endregion
export { fetchGroups as a, fetchExpenses as i, createGroup as n, fetchSettlements as o, fetchBalances as r, uploadCSV as s, createExpense as t };
