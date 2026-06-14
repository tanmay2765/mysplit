import { members as mockMembers } from "./mock-data";

const API_BASE_URL = "https://shared-expense-api.onrender.com";

const membersMap: Record<string, { name: string; avatar: string }> = {
  "1": { name: "Aisha", avatar: mockMembers[0].avatar },
  "2": { name: "Rohan", avatar: mockMembers[1].avatar },
  "3": { name: "Priya", avatar: mockMembers[2].avatar },
  "4": { name: "Sam", avatar: mockMembers[3].avatar },
  "5": { name: "Meera", avatar: mockMembers[4].avatar },
};

let dynamicMembersMap: Record<string, { name: string; avatar: string }> = {};

export function updateMembersCache(users: any[]) {
  users.forEach((u) => {
    const cleanId = String(u.id);
    if (!dynamicMembersMap[cleanId]) {
      // Pick a deterministic avatar based on ID
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
        avatar: `https://images.unsplash.com/photo-${avatarIds[avatarIndex]}?w=128&h=128&fit=crop&crop=faces`,
      };
    }
  });
}

function resolveMember(id: number | string) {
  const cleanId = String(id).replace(/[^\d]/g, "");
  return dynamicMembersMap[cleanId] || membersMap[cleanId] || { name: `Member ${id}`, avatar: mockMembers[0].avatar };
}

export async function fetchUsers() {
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

export async function registerUser(user: { name: string; email: string; password: string }) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.detail || "Failed to register user");
  }
  const data = await res.json(); // returns { message, id }
  // Update cache
  updateMembersCache([{ id: data.id, name: user.name, email: user.email }]);
  return data;
}

export async function fetchGroups() {
  try {
    const res = await fetch(`${API_BASE_URL}/groups/`);
    if (!res.ok) throw new Error("Failed to fetch groups");
    const data = await res.json();
    
    // Pre-fetch users to fill the resolve cache
    const users = await fetchUsers();
    
    if (data && data.length > 0) {
      // Map members dynamically for each group based on memberships or assign a sensible subset
      return Promise.all(data.map(async (g: any) => {
        const memberships = await fetchGroupMemberships(g.id);
        let groupMembers: any[] = [];
        if (memberships && memberships.length > 0) {
          groupMembers = memberships.map((m: any) => {
            const memberInfo = resolveMember(m.user_id);
            return {
              id: `m${m.user_id}`,
              name: memberInfo.name,
              avatar: memberInfo.avatar,
              joinDate: m.joined_at,
            };
          });
        } else if (g.id <= 2) {
          groupMembers = mockMembers.slice(0, 4);
        }
        return {
          id: `g${g.id}`,
          name: g.name,
          members: groupMembers,
          expenseCount: 3,
          lastActivity: "Active",
        };
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

export async function createMembership(userId: number, groupId: number) {
  const res = await fetch(`${API_BASE_URL}/memberships/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, group_id: groupId }),
  });
  if (!res.ok) throw new Error("Failed to create membership");
  return res.json();
}

export async function fetchGroupMemberships(groupId: number) {
  try {
    const res = await fetch(`${API_BASE_URL}/memberships/group/${groupId}`);
    if (!res.ok) throw new Error("Failed to fetch group memberships");
    return await res.json();
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function fetchExpenses() {
  try {
    await fetchUsers(); // Ensure users cache is populated
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

export async function deleteExpense(expenseId: number) {
  const res = await fetch(`${API_BASE_URL}/expenses/${expenseId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete expense");
  return res.json();
}

export async function fetchBalances() {
  try {
    await fetchUsers(); // Ensure users cache is populated
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
    await fetchUsers(); // Ensure users cache is populated
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

export async function deleteMembership(userId: number, groupId: number) {
  const res = await fetch(`${API_BASE_URL}/memberships/group/${groupId}/user/${userId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete membership");
  return res.json();
}


