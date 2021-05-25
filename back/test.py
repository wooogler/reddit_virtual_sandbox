from itertools import groupby, accumulate, product

array = [1, 2, 3, 4, 5]
labels = ['a', 'a', 'b', 'b', 'c']

lengths = [len(list(grp)) for k, grp in groupby(labels)]

new_array = [array[end - length:end] for length, end in zip(lengths, accumulate(lengths))]

combination = list(product(*new_array))

print(combination)
