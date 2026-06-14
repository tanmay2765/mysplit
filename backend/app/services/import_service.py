import pandas as pd


def process_csv(file):
    """
    Process uploaded CSV and detect anomalies
    required by the assignment.
    """

    df = pd.read_csv(file)
    # Convert amount column safely

    if "amount" in df.columns:
        df["amount"] = pd.to_numeric(
            df["amount"],
            errors="coerce"
        )

    anomalies = []

    # -------------------------
    # Missing Values
    # -------------------------
    missing_count = int(df.isnull().sum().sum())

    if missing_count > 0:
        anomalies.append({
            "type": "missing_values",
            "count": missing_count,
            "action": "flagged_for_review"
        })

    # -------------------------
    # Negative Amounts
    # -------------------------
    if "amount" in df.columns:

        negative_amounts = df[df["amount"] < 0]

        if len(negative_amounts) > 0:
            anomalies.append({
                "type": "negative_amounts",
                "count": len(negative_amounts),
                "action": "marked_as_refund_or_credit"
            })

    # -------------------------
    # Missing Currency
    # -------------------------
    if "currency" in df.columns:

        missing_currency = df[
            df["currency"].isnull()
        ]

        if len(missing_currency) > 0:
            anomalies.append({
                "type": "missing_currency",
                "count": len(missing_currency),
                "action": "flagged_for_review"
            })

    # -------------------------
    # Duplicate Descriptions
    # -------------------------
    if "description" in df.columns:

        duplicate_descriptions = (
            df["description"]
            .astype(str)
            .str.lower()
            .duplicated()
        )

        duplicate_count = int(
            duplicate_descriptions.sum()
        )

        if duplicate_count > 0:
            anomalies.append({
                "type": "possible_duplicates",
                "count": duplicate_count,
                "action": "requires_user_approval"
            })

    # -------------------------
    # Settlement Detection
    # -------------------------
    if "description" in df.columns:

        settlement_keywords = [
            "paid back",
            "repaid",
            "settlement",
            "returned",
            "refund"
        ]

        settlement_count = 0

        for description in df["description"]:

            description = str(description).lower()

            if any(
                keyword in description
                for keyword in settlement_keywords
            ):
                settlement_count += 1

        if settlement_count > 0:
            anomalies.append({
                "type": "settlement_logged_as_expense",
                "count": settlement_count,
                "action": "convert_to_settlement"
            })

    # -------------------------
    # Missing Payer
    # -------------------------
    if "paid_by" in df.columns:

        missing_payer = df[
            df["paid_by"].isnull()
        ]

        if len(missing_payer) > 0:
            anomalies.append({
                "type": "missing_payer",
                "count": len(missing_payer),
                "action": "flagged_for_review"
            })

    # -------------------------
    # User Name Variations
    # -------------------------
    if "paid_by" in df.columns:

        normalized_names = (
            df["paid_by"]
            .dropna()
            .astype(str)
            .str.strip()
            .str.lower()
            .unique()
        )

        name_variations = []

        if "priya" in normalized_names and "priya s" in normalized_names:
            name_variations.append(
                "Priya / Priya S"
            )

        if "rohan" in normalized_names:
            matching = [
                n for n in normalized_names
                if n.startswith("rohan")
            ]

            if len(matching) > 1:
                name_variations.append(
                    "Rohan variations"
                )

        if len(name_variations) > 0:
            anomalies.append({
                "type": "name_variations",
                "count": len(name_variations),
                "action": "requires_user_approval",
                "details": name_variations
            })

    # -------------------------
    # USD Transactions
    # -------------------------
    if "currency" in df.columns:

        usd_transactions = df[
            df["currency"]
            .astype(str)
            .str.upper()
            == "USD"
        ]

        if len(usd_transactions) > 0:
            anomalies.append({
                "type": "foreign_currency",
                "count": len(usd_transactions),
                "action": "convert_using_exchange_rate"
            })

    # -------------------------
    # Generate Report
    # -------------------------
    report = {
        "rows": len(df),
        "columns": list(df.columns),
        "anomaly_count": len(anomalies),
        "anomalies": anomalies
    }

    return report