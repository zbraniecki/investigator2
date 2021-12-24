import math


def find_closest(alist, target):
    alist = [i for i in alist if i is not None and i[1] is not None]
    return min(alist, key=lambda e: abs(e[1] - target))


def has_items(l):
    return any([i[1] is not None for i in l])


def find_matches(list1, list2):
    list1 = [[idx, elem] for idx, elem in enumerate(list1)]
    list2 = [[idx, elem] for idx, elem in enumerate(list2)]

    result = [None] * len(list1)
    i = 0

    while has_items(list2) and has_items(list1):
        distances = []
        for (idx, elem) in list1:
            if elem is None:
                distances.append([idx, None])
            else:
                closest = find_closest(list2, elem)
                distances.append([closest[0], abs(closest[1] - elem)])

        smallest_distance = min(
            enumerate(distances),
            key=lambda d: d[1][1] if d[1][1] is not None else float("inf"),
        )
        idx1 = smallest_distance[0]
        idx2 = smallest_distance[1][0]
        list1[idx1][1] = None
        list2[idx2][1] = None
        result[idx1] = [idx1, idx2]

    for elem in list1:
        if elem[1] is not None:
            result[elem[0]] = [elem[0], None]

    for elem in list2:
        if elem[1] is not None:
            result.append([None, elem[0]])

    return result
