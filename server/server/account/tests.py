from django.test import TestCase
from server.account.management.commands.helpers import find_matches


class CommandHelpersTestCase(TestCase):
    def setUp(self):
        pass

    def test_find_matches(self):
        """Test finding matches"""
        samples = [
            {
                "input": [
                    [],
                    [],
                ],
                "output": [],
            },
            {
                "input": [
                    [1],
                    [1],
                ],
                "output": [[0, 0]],
            },
            {
                "input": [
                    [5, 10],
                    [6, 12],
                ],
                "output": [
                    [0, 0],
                    [1, 1],
                ],
            },
            {
                "input": [
                    [1, 2],
                    [2, 1],
                ],
                "output": [
                    [0, 1],
                    [1, 0],
                ],
            },
            {
                "input": [
                    [1, 2],
                    [2],
                ],
                "output": [
                    [0, None],
                    [1, 0],
                ],
            },
            {
                "input": [
                    [2],
                    [1, 2],
                ],
                "output": [
                    [0, 1],
                    [None, 0],
                ],
            },
            {
                "input": [
                    [4.1, 121, 0.2],
                    [0.1, 5.1],
                ],
                "output": [
                    [0, 1],
                    [1, None],
                    [2, 0],
                ],
            },
            {
                "input": [
                    [0.1, 5.1],
                    [4.1, 121, 0.2],
                ],
                "output": [
                    [0, 2],
                    [1, 0],
                    [None, 1],
                ],
            },
            {
                "input": [
                    [0.1, 5.1],
                    [],
                ],
                "output": [
                    [0, None],
                    [1, None],
                ],
            },
            {
                "input": [
                    [],
                    [0.1, 5.1],
                ],
                "output": [
                    [None, 0],
                    [None, 1],
                ],
            },
        ]
        for sample in samples:
            result = find_matches(sample["input"][0], sample["input"][1])
            self.assertEqual(result, sample["output"])
