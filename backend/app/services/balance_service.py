from collections import defaultdict

from app.models.expense import Expense


def calculate_balances(expenses):

    balances = defaultdict(float)

    for expense in expenses:

        payer = expense.paid_by

        amount = expense.amount

        balances[payer] += amount

    return balances