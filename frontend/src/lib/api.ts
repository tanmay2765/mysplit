import { members as mockMembers } from "./mock-data";

const API_BASE_URL = "https://shared-expense-api.onrender.com";

const membersMap: Record<string, { name: string; avatar: string }> = {
  "1": { name: "Aisha", avatar: mockMembers[0].avatar },
  "2": { name: "Rohan", avatar: mockMembers[1].avatar },
  "3": { name: "Priya", avatar: mockMembers[2].avatar },
  "4": { name: "Sam", avatar: mockMembers[3].avatar },
  "5": { name: "Meera", avatar: mockMembers[4].avatar },
};

function resolveMember(id: number | string) {
  const cleanId = String(id).replace(/[^\d]/g, "");
  return membersMap[cleanId] || { name: `Member ${id}`, avatar: mockMembers[0].avatar };
}

export async function fetchGroups() {
  try {
    const res = await fetch(`${API_BASE_URL}/groups/`);
    if (!res.ok) throw new Error("Failed to fetch groups");
    const data = await res.json();
    if (data && data.length > 0) {
      return data.map((g: any) => ({
        id: `g${g.id}`,
        name: g.name,
        members: mockMembers.slice(0, 4), // Default members for demonstration
        expenseCount: 3,
        lastActivity: "Just now",
      }));
    }
  } catch (e) {
    console.error("API Error, using fallback:", e);
  }
  return null;
}

export async function createGroup(name: string) {
  const res = await fetch(`${API_BASE_URL}/groups/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error("Failed to create group");
  return res.json();
}

export async function fetchExpenses() {
  try {
    const res = await fetch(`${API_BASE_URL}/expenses/`);
    if (!res.ok) throw new Error("Failed to fetch expenses");
    const data = await res.json();
    if (data && data.length > 0) {
      return data.map((e: any) => ({
        id: `e${e.id}`,
        date: e.expense_date || new Date().toISOString().split("T")[0],
        description: e.title,
        amount: e.amount,
        currency: e.currency || "INR",
        paidBy: resolveMember(e.paid_by).name,
        splitType: e.split_type ? (e.split_type.charAt(0).toUpperCase() + e.split_type.slice(1)) : "Equal",
        groupId: `g${e.group_id}`,
      }));
    }
  } catch (e) {
    console.error("API Error, using fallback:", e);
  }
  return null;
}

export async function createExpense(expense: {
  title: string;
  amount: number;
  currency: string;
  split_type: string;
  expense_date: string;
  paid_by: number;
  group_id: number;
}) {
  const res = await fetch(`${API_BASE_URL}/expenses/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(expense),
  });
  if (!res.ok) throw new Error("Failed to create expense");
  return res.json();
}

export async function fetchBalances() {
  try {
    const res = await fetch(`${API_BASE_URL}/balances/`);
    if (!res.ok) throw new Error("Failed to fetch balances");
    const data = await res.json(); // returns e.g. {"1": 3200.0}
    if (data && Object.keys(data).length > 0) {
      const balancesList = Object.entries(data).map(([userId, amount]: [string, any]) => {
        const member = resolveMember(userId);
        return {
          memberId: `m${userId}`,
          name: member.name,
          avatar: member.avatar,
          amount: parseFloat(amount),
        };
      });
      return balancesList;
    }
  } catch (e) {
    console.error("API Error, using fallback:", e);
  }
  return null;
}

export async function fetchSettlements() {
  try {
    const res = await fetch(`${API_BASE_URL}/settlements/`);
    if (!res.ok) throw new Error("Failed to fetch settlements");
    const data = await res.json();
    if (data && data.length > 0) {
      return data.map((s: any) => ({
        id: `s${s.id}`,
        date: s.settlement_date || new Date().toISOString().split("T")[0],
        payer: resolveMember(s.payer_id).name,
        receiver: resolveMember(s.receiver_id).name,
        amount: s.amount,
      }));
    }
  } catch (e) {
    console.error("API Error, using fallback:", e);
  }
  return null;
}

export async function uploadCSV(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_BASE_URL}/import/`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to upload CSV");
  return res.json();
}
