//#region src/lib/mock-data.ts
var av = (seed) => `https://images.unsplash.com/photo-${seed}?w=128&h=128&fit=crop&crop=faces`;
var members = [
	{
		id: "m1",
		name: "Aisha",
		avatar: av("1494790108377-be9c29b29330"),
		joinDate: "2024-01-10"
	},
	{
		id: "m2",
		name: "Rohan",
		avatar: av("1500648767791-00dcc994a43e"),
		joinDate: "2024-01-10"
	},
	{
		id: "m3",
		name: "Priya",
		avatar: av("1438761681033-6461ffad8d80"),
		joinDate: "2024-02-15"
	},
	{
		id: "m4",
		name: "Sam",
		avatar: av("1633332755192-727a05c4013d"),
		joinDate: "2024-03-05"
	},
	{
		id: "m5",
		name: "Meera",
		avatar: av("1487412720507-e7ab37603c6f"),
		joinDate: "2024-04-12"
	}
];
var groups = [
	{
		id: "g1",
		name: "Goa Trip 2024",
		members: members.slice(0, 4),
		expenseCount: 24,
		lastActivity: "2 hours ago"
	},
	{
		id: "g2",
		name: "Apartment 4B",
		members,
		expenseCount: 58,
		lastActivity: "Yesterday"
	},
	{
		id: "g3",
		name: "Office Lunch Club",
		members: members.slice(1, 5),
		expenseCount: 12,
		lastActivity: "3 days ago"
	},
	{
		id: "g4",
		name: "Weekend Getaway",
		members: members.slice(0, 3),
		expenseCount: 9,
		lastActivity: "1 week ago"
	}
];
var expenses = [
	{
		id: "e1",
		date: "2024-06-10",
		description: "Beach Resort Stay",
		amount: 18e3,
		currency: "INR",
		paidBy: "Aisha",
		splitType: "Equal",
		groupId: "g1"
	},
	{
		id: "e2",
		date: "2024-06-11",
		description: "Scuba Diving",
		amount: 9600,
		currency: "INR",
		paidBy: "Rohan",
		splitType: "Equal",
		groupId: "g1"
	},
	{
		id: "e3",
		date: "2024-06-12",
		description: "Dinner at Thalassa",
		amount: 4800,
		currency: "INR",
		paidBy: "Priya",
		splitType: "Equal",
		groupId: "g1"
	},
	{
		id: "e4",
		date: "2024-06-08",
		description: "Internet Bill",
		amount: 1499,
		currency: "INR",
		paidBy: "Sam",
		splitType: "Equal",
		groupId: "g2"
	},
	{
		id: "e5",
		date: "2024-06-07",
		description: "Groceries",
		amount: 3240,
		currency: "INR",
		paidBy: "Meera",
		splitType: "Exact",
		groupId: "g2"
	},
	{
		id: "e6",
		date: "2024-06-05",
		description: "Conference Booking",
		amount: 450,
		currency: "USD",
		paidBy: "Aisha",
		splitType: "Percentage",
		groupId: "g3"
	},
	{
		id: "e7",
		date: "2024-06-03",
		description: "Team Lunch",
		amount: 2800,
		currency: "INR",
		paidBy: "Rohan",
		splitType: "Equal",
		groupId: "g3"
	},
	{
		id: "e8",
		date: "2024-06-01",
		description: "Cab to Airport",
		amount: 1200,
		currency: "INR",
		paidBy: "Priya",
		splitType: "Equal",
		groupId: "g4"
	}
];
var balances = [
	{
		memberId: "m1",
		name: "Aisha",
		avatar: members[0].avatar,
		amount: 2400
	},
	{
		memberId: "m2",
		name: "Rohan",
		avatar: members[1].avatar,
		amount: -1200
	},
	{
		memberId: "m3",
		name: "Priya",
		avatar: members[2].avatar,
		amount: -800
	},
	{
		memberId: "m5",
		name: "Meera",
		avatar: members[4].avatar,
		amount: -400
	}
];
var simplifiedSettlements = [
	{
		from: "Rohan",
		to: "Aisha",
		amount: 1200
	},
	{
		from: "Priya",
		to: "Aisha",
		amount: 800
	},
	{
		from: "Meera",
		to: "Aisha",
		amount: 400
	}
];
var settlementHistory = [
	{
		id: "s1",
		date: "2024-06-09",
		payer: "Rohan",
		receiver: "Aisha",
		amount: 800
	},
	{
		id: "s2",
		date: "2024-06-04",
		payer: "Sam",
		receiver: "Meera",
		amount: 350
	},
	{
		id: "s3",
		date: "2024-05-28",
		payer: "Priya",
		receiver: "Aisha",
		amount: 1500
	}
];
var anomalies = [
	{
		id: "a1",
		type: "Name Variation",
		description: "'Priya S' may be the same as 'Priya'",
		severity: "Low",
		action: "Normalize name",
		status: "Pending",
		originalName: "Priya S",
		suggestedName: "Priya"
	},
	{
		id: "a2",
		type: "Missing Currency",
		description: "Row 14 has no currency specified",
		severity: "Medium",
		action: "Default to INR",
		status: "Pending"
	},
	{
		id: "a3",
		type: "Duplicate Expense",
		description: "Two entries for 'Dinner at Thalassa' on same day",
		severity: "High",
		action: "Flag for review",
		status: "Pending"
	},
	{
		id: "a4",
		type: "USD Transaction",
		description: "Conference Booking in USD detected",
		severity: "Medium",
		action: "Convert to INR",
		status: "Approved"
	},
	{
		id: "a5",
		type: "Negative Amount",
		description: "Row 22 amount is -450",
		severity: "High",
		action: "Mark as refund",
		status: "Pending"
	},
	{
		id: "a6",
		type: "Settlement Logged",
		description: "Settlement entry found as expense",
		severity: "Medium",
		action: "Move to settlements",
		status: "Approved"
	},
	{
		id: "a7",
		type: "Membership Conflict",
		description: "Sam charged before join date",
		severity: "High",
		action: "Exclude from split",
		status: "Pending"
	}
];
var importReports = [
	{
		id: "r1",
		date: "2024-06-10",
		rowsProcessed: 142,
		anomalies: 7,
		status: "Pending Review"
	},
	{
		id: "r2",
		date: "2024-06-03",
		rowsProcessed: 89,
		anomalies: 3,
		status: "Completed"
	},
	{
		id: "r3",
		date: "2024-05-22",
		rowsProcessed: 56,
		anomalies: 0,
		status: "Completed"
	},
	{
		id: "r4",
		date: "2024-05-15",
		rowsProcessed: 210,
		anomalies: 12,
		status: "Completed"
	}
];
var balanceExplanation = [
	{
		expense: "Beach Resort Stay",
		amount: 18e3,
		share: 4500,
		reason: "Equal split among 4 members"
	},
	{
		expense: "Scuba Diving",
		amount: 9600,
		share: 2400,
		reason: "Equal split among 4 members"
	},
	{
		expense: "Dinner at Thalassa",
		amount: 4800,
		share: 1200,
		reason: "Equal split among 4 members"
	}
];
var summary = {
	totalGroups: groups.length,
	totalExpenses: expenses.length,
	totalMembers: members.length,
	pendingReviews: anomalies.filter((a) => a.status === "Pending").length
};
//#endregion
export { groups as a, settlementHistory as c, expenses as i, simplifiedSettlements as l, balanceExplanation as n, importReports as o, balances as r, members as s, anomalies as t, summary as u };
