from django.contrib.auth.models import User
from investigator.strategy.models import Portfolio
from investigator.user.models import (
    User,
    Holding,
    Transaction,
    Account,
)
from django.db.models import Subquery
from investigator.oracle.models import Category, Tag
from django.core.management.base import BaseCommand
from decimal import *
from django.utils import timezone
import datetime
import json
import toml

def nested_size(input):
    return sum(len(value) for value in input)

def list_from_a_dict(input):
    result = []
    for [key, val] in input.items():
        value = list_from_a_dict(val) if isinstance(val, dict) else val
        result.append({
            "key": key,
            "value": value,
        })
    return result


def sort_nested_list(input):
    if not isinstance(input[0], dict):
        return input
    lengths = []
    for i in input:
        length = compute_list_length(i["value"]) if isinstance(i, dict) else 1
        lengths.append(length)

    interm = list(zip(lengths, input))
    interm2 = sorted(interm, key=lambda item: item[0], reverse=True)
    result = [x[1] for x in interm2]
    for elem in result:
       new_value = sort_nested_list(elem["value"])
       elem["value"] = new_value
    return result

def compute_list_length(input):
    result = 0
    for i in input:
        if isinstance(i, dict):
            result += compute_list_length(i["value"])
        else:
            result += 1
    return result

class Command(BaseCommand):
    help = "Dump activity for taxes"

    def add_arguments(self, parser):
        # parser.add_argument("path", type=str, help="Path to dump portfolio to file")
        pass

    def handle(self, *args, **kwargs):
        user = User.objects.get(username="zbraniecki")
        tz = timezone.get_current_timezone()
        # path = kwargs["path"]
        year = 2023
        date_start = datetime.datetime(year, 1, 1).replace(tzinfo=tz)
        date_end = datetime.datetime(year, 12, 31).replace(tzinfo=tz)

        transactions = Transaction.objects.filter(
            timestamp__range=(date_start, date_end),
            account__owner=user,
        ).order_by("timestamp")

        # account_ids = transactions.values_list('account_id', flat=True).distinct()
        # accounts = Account.objects.filter(
        #     id__in=Subquery(account_ids)
        # ).distinct()

        account_transactions = {}

        # for a in accounts:
        #     account_transactions[a] = {}

        for t in transactions:
            account = t.account
            asset = t.asset
            if account not in account_transactions:
                account_transactions[account] = {}
            if asset not in account_transactions[account]:
                account_transactions[account][asset] = []
            account_transactions[account][asset].append(t)


        sorted_account_transactions = list_from_a_dict(account_transactions)
        sorted_account_transactions = sort_nested_list(sorted_account_transactions)
        for wi, a in enumerate(sorted_account_transactions, start = 1):
            print(f"{wi}) {a['key']} ({nested_size(a['value'])})")
            for ai, value in enumerate(a['value'], start = 1):
                asset = value["key"]
                transactions = value["value"]
                print(f"  {wi}.{ai}) {asset} ({len(transactions)})")
                for ti, t in enumerate(transactions, start = 1):
                    print(f"      {wi}.{ai}.{ti}) {t}")
