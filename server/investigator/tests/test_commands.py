from django.core.management import call_command
from unittest import TestCase
from investigator.user.management.commands.dump_activity_for_taxes import (
    list_from_a_dict,
    sort_nested_list,
    compute_list_length,
)

class MyCommandTest(TestCase):
    def test_list_from_a_dict(self):
        input = {
            "foo": {
                "bar": [1, 2, 3],
                "baz": [5, 6, 0],
            },
            "qux": {
                "zee": [0, 2, 3]
            }
        }

        output = [
            {
                "key": "foo",
                "value": [
                    {
                        "key": "bar",
                        "value": [1, 2, 3],
                    },
                    {
                        "key": "baz",
                        "value": [5, 6, 0],
                    }
                ]
            },
            {
                "key": "qux",
                "value": [
                    {
                        "key": "zee",
                        "value": [0, 2, 3],
                    },
                ]
            }
        ]

        result = list_from_a_dict(input)
        self.assertEqual(result, output, 'Correct list from dict')

    def test_compute_list_length(self):
        input = [
            {
                "key": "zee",
                "value": [0, 2, 3],
            },
        ]
        output = [
            3
        ]

        for [i, o] in zip(input, output):
            result = compute_list_length(i["value"])
            self.assertEqual(o, result)

        input = [
            {
                "key": "qux",
                "value": [
                    {
                        "key": "zee",
                        "value": [0, 2, 3],
                    },
                ]
            },
            {
                "key": "foo",
                "value": [
                    {
                        "key": "baz",
                        "value": [5, 6, 0],
                    },
                    {
                        "key": "bar",
                        "value": [1, 2, 3, 10],
                    },
                ]
            }
        ]

        output = [
            3,
            7
        ]

        for [i, o] in zip(input, output):
            result = compute_list_length(i["value"])
            self.assertEqual(o, result)

    def test_sort_nested_list(self):
        input = [
            {
                "key": "zee",
                "value": [0, 2, 3],
            },
        ]
        output = [
            {
                "key": "zee",
                "value": [0, 2, 3],
            },
        ]

        result = sort_nested_list(input)
        self.assertEqual(result, output, 'Correct sorting')

        input = [
            {
                "key": "qux",
                "value": [
                    {
                        "key": "zee",
                        "value": [0, 2, 3],
                    },
                ]
            },
            {
                "key": "foo",
                "value": [
                    {
                        "key": "baz",
                        "value": [5, 6, 0],
                    },
                    {
                        "key": "bar",
                        "value": [1, 2, 3, 10],
                    },
                ]
            }
        ]

        output = [
            {
                "key": "foo",
                "value": [
                    {
                        "key": "bar",
                        "value": [1, 2, 3, 10],
                    },
                    {
                        "key": "baz",
                        "value": [5, 6, 0],
                    }
                ]
            },
            {
                "key": "qux",
                "value": [
                    {
                        "key": "zee",
                        "value": [0, 2, 3],
                    },
                ]
            },
        ]

        result = sort_nested_list(input)
        self.assertEqual(result, output, 'Correct sorting')
