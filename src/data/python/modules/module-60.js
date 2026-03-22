export default {
  id: 60,
  title: 'Практикум: Задачи Easy',
  description: 'Лёгкие алгоритмические задачи в стиле LeetCode/Codewars для отработки базовых навыков',
  lessons: [
    {
      id: 1,
      title: 'FizzBuzz и числовые задачи',
      type: 'practice',
      difficulty: 'easy',
      description: 'Классические числовые задачи на условия и циклы.',
      requirements: [
        'fizzbuzz(n) — FizzBuzz от 1 до n',
        'sum_digits(n) — сумма цифр числа',
        'reverse_number(n) — перевернуть число (123 -> 321)',
        'is_perfect(n) — число равно сумме своих делителей',
        'count_primes(n) — количество простых чисел до n включительно'
      ],
      expectedOutput: 'fizzbuzz(15) -> ["1","2","Fizz","4","Buzz",...,"FizzBuzz"]\nsum_digits(12345) -> 15\nreverse_number(12300) -> 321\nis_perfect(28) -> True (1+2+4+7+14=28)\ncount_primes(30) -> 10',
      hint: 'sum_digits: str(abs(n)), сложи цифры. reverse_number: int(str(abs(n))[::-1]). is_perfect: сумма [i for i in range(1,n) if n%i==0].',
      solution: 'def fizzbuzz(n):\n    result = []\n    for i in range(1, n + 1):\n        if i % 15 == 0: result.append("FizzBuzz")\n        elif i % 3 == 0: result.append("Fizz")\n        elif i % 5 == 0: result.append("Buzz")\n        else: result.append(str(i))\n    return result\n\ndef sum_digits(n):\n    return sum(int(d) for d in str(abs(n)))\n\ndef reverse_number(n):\n    sign = -1 if n < 0 else 1\n    return sign * int(str(abs(n))[::-1])\n\ndef is_perfect(n):\n    if n < 2: return False\n    return sum(i for i in range(1, n) if n % i == 0) == n\n\ndef count_primes(n):\n    if n < 2: return 0\n    sieve = [True] * (n + 1)\n    sieve[0] = sieve[1] = False\n    for i in range(2, int(n**0.5) + 1):\n        if sieve[i]:\n            for j in range(i*i, n + 1, i):\n                sieve[j] = False\n    return sum(sieve)\n\nprint(fizzbuzz(15))\nprint(sum_digits(12345))\nprint(reverse_number(12300))\nprint(is_perfect(28), is_perfect(6), is_perfect(7))\nprint(count_primes(30))',
      explanation: 'Решето Эратосфена O(n log log n) — эффективнее наивного O(n sqrt(n)). FizzBuzz: проверяй 15 первым (иначе делимые на 15 попадут в Fizz или Buzz). sum_digits через строку проще чем через %10.'
    },
    {
      id: 2,
      title: 'Строки: разворот и манипуляции',
      type: 'practice',
      difficulty: 'easy',
      description: 'Классические задачи на строки.',
      requirements: [
        'reverse_words("hello world") -> "world hello"',
        'is_pangram(s) — содержит ли все буквы алфавита (русского или английского)',
        'count_vowels(s) — подсчёт гласных',
        'title_case(s) — каждое слово с заглавной, кроме предлогов',
        'longest_word(s) — самое длинное слово в строке'
      ],
      expectedOutput: 'reverse_words("I love Python") -> "Python love I"\nis_pangram("The quick brown fox...") -> True\ncount_vowels("Hello World") -> 3\nlongest_word("Python is great") -> "Python"',
      hint: 's.split()[::-1] для reverse_words. set(s.lower()) >= set(alphabet) для pangram. max(words, key=len) для longest.',
      solution: 'import string\n\ndef reverse_words(s):\n    return " ".join(s.split()[::-1])\n\ndef is_pangram(s, lang="en"):\n    if lang == "en":\n        alphabet = set(string.ascii_lowercase)\n    else:\n        alphabet = set("абвгдеёжзийклмнопрстуфхцчшщъыьэюя")\n    return alphabet <= set(s.lower())\n\ndef count_vowels(s):\n    vowels = set("aeiouаеёиоуыэюя")\n    return sum(1 for c in s.lower() if c in vowels)\n\ndef title_case(s):\n    prepositions = {"a", "an", "the", "of", "in", "on", "at",\n                    "и", "в", "на", "с", "по", "для"}\n    words = s.split()\n    result = [words[0].capitalize()] + [\n        w if w.lower() in prepositions else w.capitalize()\n        for w in words[1:]\n    ]\n    return " ".join(result)\n\ndef longest_word(s):\n    words = s.split()\n    return max(words, key=len) if words else ""\n\nprint(reverse_words("I love Python"))\nprint(is_pangram("The quick brown fox jumps over the lazy dog"))\nprint(count_vowels("Hello World"))\nprint(title_case("the lord of the rings"))\nprint(longest_word("Python is a great programming language"))',
      explanation: 'set(alphabet) <= set(s.lower()) — проверка подмножества: все буквы алфавита есть в строке. max с key=len — O(n), лучше чем сортировка O(n log n). Первое слово всегда с заглавной независимо от предлогов.'
    },
    {
      id: 3,
      title: 'Списки: поиск и манипуляции',
      type: 'practice',
      difficulty: 'easy',
      description: 'Задачи на поиск и обработку элементов списков.',
      requirements: [
        'find_duplicates(lst) — список дублирующихся элементов',
        'rotate(lst, k) — сдвиг списка на k позиций',
        'flatten(nested) — рекурсивно развернуть вложенный список',
        'running_sum(lst) — накопительная сумма',
        'intersection(lst1, lst2) — пересечение без повторов'
      ],
      expectedOutput: 'find_duplicates([1,2,3,2,4,3,5]) -> [2, 3]\nrotate([1,2,3,4,5], 2) -> [4,5,1,2,3]\nflatten([1,[2,[3]],4]) -> [1,2,3,4]\nrunning_sum([1,2,3,4]) -> [1,3,6,10]\nintersection([1,2,3],[2,3,4]) -> [2,3]',
      hint: 'find_duplicates: Counter + фильтрация. rotate: lst[-k:] + lst[:-k]. running_sum: itertools.accumulate или ручной цикл.',
      solution: 'from collections import Counter\nfrom itertools import accumulate\n\ndef find_duplicates(lst):\n    counts = Counter(lst)\n    return [item for item, cnt in counts.items() if cnt > 1]\n\ndef rotate(lst, k):\n    if not lst: return []\n    k = k % len(lst)\n    return lst[-k:] + lst[:-k]\n\ndef flatten(nested):\n    result = []\n    for item in nested:\n        if isinstance(item, (list, tuple)):\n            result.extend(flatten(item))\n        else:\n            result.append(item)\n    return result\n\ndef running_sum(lst):\n    return list(accumulate(lst))\n\ndef intersection(lst1, lst2):\n    return list(set(lst1) & set(lst2))\n\nprint(find_duplicates([1, 2, 3, 2, 4, 3, 5]))\nprint(rotate([1, 2, 3, 4, 5], 2))\nprint(flatten([1, [2, [3, [4]]], 5]))\nprint(running_sum([1, 2, 3, 4, 5]))\nprint(intersection([1, 2, 3, 4], [2, 4, 6]))',
      explanation: 'Counter для подсчёта дублей — O(n). rotate с k % len защищает от выхода за границы. accumulate из itertools — встроенная накопительная сумма. set & set — пересечение множеств O(min(n,m)).'
    },
    {
      id: 4,
      title: 'Словари: частоты и группировка',
      type: 'practice',
      difficulty: 'easy',
      description: 'Задачи на работу со словарями и подсчёт частот.',
      requirements: [
        'char_count(s) — словарь {символ: количество}',
        'most_frequent(lst) — самый частый элемент',
        'group_by_length(words) — {длина: [слова]}',
        'word_frequency(text) — частота слов (регистронезависимо)',
        'top_n(d, n) — топ-N элементов по значению'
      ],
      expectedOutput: 'char_count("hello") -> {"h":1,"e":1,"l":2,"o":1}\nmost_frequent([1,2,2,3,3,3]) -> 3\ngroup_by_length(["a","bb","cc","ddd"]) -> {1:["a"],2:["bb","cc"],3:["ddd"]}\ntop_n({"a":5,"b":1,"c":3}, 2) -> [("a",5),("c",3)]',
      hint: 'from collections import Counter, defaultdict. Counter(lst).most_common(1)[0][0] для most_frequent. sorted(d.items(), key=lambda x: -x[1])[:n] для top_n.',
      solution: 'from collections import Counter, defaultdict\n\ndef char_count(s):\n    return dict(Counter(s))\n\ndef most_frequent(lst):\n    if not lst: return None\n    return Counter(lst).most_common(1)[0][0]\n\ndef group_by_length(words):\n    result = defaultdict(list)\n    for w in words:\n        result[len(w)].append(w)\n    return dict(result)\n\ndef word_frequency(text):\n    import re\n    words = re.findall(r"\\b[a-zA-Zа-яёА-ЯЁ]+\\b", text.lower())\n    return dict(Counter(words))\n\ndef top_n(d, n):\n    return sorted(d.items(), key=lambda x: x[1], reverse=True)[:n]\n\nprint(char_count("hello"))\nprint(most_frequent([1, 2, 2, 3, 3, 3, 2]))\nprint(group_by_length(["a", "bb", "cc", "ddd", "e", "ff"]))\ntext = "питон питон java питон java c++"\nprint(word_frequency(text))\nprint(top_n({"питон": 3, "java": 2, "c++": 1}, 2))',
      explanation: 'Counter — специализированный dict для подсчёта. most_common(1) возвращает список из одного (element, count) — берём [0][0]. defaultdict(list) избавляет от проверки "если ключа нет — создать".'
    },
    {
      id: 5,
      title: 'Числа: математические задачи',
      type: 'practice',
      difficulty: 'easy',
      description: 'Математические задачи на числа и последовательности.',
      requirements: [
        'gcd(a, b) — НОД через алгоритм Евклида',
        'lcm(a, b) — НОК через НОД',
        'is_power_of_two(n) — степень ли двойки',
        'roman_to_int("XIV") -> 14',
        'int_to_roman(14) -> "XIV"'
      ],
      expectedOutput: 'gcd(48, 18) -> 6\nlcm(4, 6) -> 12\nis_power_of_two(16) -> True, is_power_of_two(7) -> False\nroman_to_int("XIV") -> 14\nint_to_roman(14) -> "XIV"\nroman_to_int("MCMXCIX") -> 1999',
      hint: 'gcd рекурсивно: gcd(a,b) = gcd(b, a%b). lcm = a*b//gcd(a,b). is_power_of_two: n>0 and (n & (n-1)) == 0. Roman: таблица значений, subtract если меньшее перед большим.',
      solution: 'def gcd(a, b):\n    while b:\n        a, b = b, a % b\n    return abs(a)\n\ndef lcm(a, b):\n    return abs(a * b) // gcd(a, b)\n\ndef is_power_of_two(n):\n    return n > 0 and (n & (n - 1)) == 0\n\nROMANS = [\n    (1000,"M"),(900,"CM"),(500,"D"),(400,"CD"),\n    (100,"C"),(90,"XC"),(50,"L"),(40,"XL"),\n    (10,"X"),(9,"IX"),(5,"V"),(4,"IV"),(1,"I")\n]\n\ndef int_to_roman(num):\n    result = []\n    for value, symbol in ROMANS:\n        while num >= value:\n            result.append(symbol)\n            num -= value\n    return "".join(result)\n\ndef roman_to_int(s):\n    values = {"I":1,"V":5,"X":10,"L":50,"C":100,"D":500,"M":1000}\n    total = 0\n    for i, char in enumerate(s):\n        val = values[char]\n        if i + 1 < len(s) and val < values[s[i+1]]:\n            total -= val\n        else:\n            total += val\n    return total\n\nprint(gcd(48, 18), lcm(4, 6))\nprint(is_power_of_two(16), is_power_of_two(7))\nfor n in [14, 42, 1999, 2024]:\n    r = int_to_roman(n)\n    print(f"{n} -> {r} -> {roman_to_int(r)}")',
      explanation: 'Итеративный алгоритм Евклида быстрее рекурсивного (нет стека). Битовая операция n & (n-1) == 0 — элегантная проверка степени двойки. Roman: жадный алгоритм с таблицей пар значение/символ, включая субтрактивные (IX, IV).'
    },
    {
      id: 6,
      title: 'Поиск и сортировка',
      type: 'practice',
      difficulty: 'easy',
      description: 'Задачи на поиск элементов и сортировку.',
      requirements: [
        'find_missing(lst) — найти пропущенное число в [1..n]',
        'kth_largest(lst, k) — k-й наибольший элемент',
        'merge_sorted(lst1, lst2) — слияние двух отсортированных списков',
        'sort_by_frequency(lst) — сортировка по частоте (по убыванию)',
        'nearest_smaller(lst) — для каждого элемента найти ближайший меньший слева'
      ],
      expectedOutput: 'find_missing([1,2,4,5,6]) -> 3\nkth_largest([3,2,1,5,6,4], 2) -> 5\nmerge_sorted([1,3,5],[2,4,6]) -> [1,2,3,4,5,6]\nsort_by_frequency([1,1,2,3,3,3]) -> [3,3,3,1,1,2]\nnearest_smaller([4,5,2,10,8]) -> [None,4,None,2,2]',
      hint: 'find_missing: n*(n+1)//2 - sum(lst). kth_largest: sorted(lst)[-k]. nearest_smaller: стек для хранения кандидатов.',
      solution: 'from collections import Counter\n\ndef find_missing(lst):\n    n = max(lst) if lst else 0\n    return n * (n + 1) // 2 - sum(lst)\n\ndef kth_largest(lst, k):\n    return sorted(lst)[-k]\n\ndef merge_sorted(lst1, lst2):\n    result = []\n    i = j = 0\n    while i < len(lst1) and j < len(lst2):\n        if lst1[i] <= lst2[j]:\n            result.append(lst1[i]); i += 1\n        else:\n            result.append(lst2[j]); j += 1\n    return result + lst1[i:] + lst2[j:]\n\ndef sort_by_frequency(lst):\n    counts = Counter(lst)\n    return sorted(lst, key=lambda x: (-counts[x], x))\n\ndef nearest_smaller(lst):\n    result = [None] * len(lst)\n    stack = []\n    for i, val in enumerate(lst):\n        while stack and stack[-1] >= val:\n            stack.pop()\n        result[i] = stack[-1] if stack else None\n        stack.append(val)\n    return result\n\nprint(find_missing([1, 2, 4, 5, 6]))\nprint(kth_largest([3, 2, 1, 5, 6, 4], 2))\nprint(merge_sorted([1, 3, 5], [2, 4, 6]))\nprint(sort_by_frequency([1, 1, 2, 3, 3, 3, 2]))\nprint(nearest_smaller([4, 5, 2, 10, 8]))',
      explanation: 'find_missing через формулу суммы арифметической прогрессии O(n) и O(1) памяти. nearest_smaller — монотонный стек: убираем большие элементы, верхушка — ближайший меньший. kth_largest через sorted — O(n log n), есть быстрее через heapq.nlargest.'
    },
    {
      id: 7,
      title: 'Рекурсивные задачи',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реши задачи рекурсивно, затем итеративно для сравнения.',
      requirements: [
        'power(base, exp) — возведение в степень рекурсивно',
        'sum_nested(lst) — сумма вложенного списка [1,[2,[3]],4]',
        'count_occurrences(lst, target) — подсчёт в вложенной структуре',
        'generate_subsets(lst) — все подмножества',
        'hanoi(n, source, target, aux) — Ханойские башни'
      ],
      expectedOutput: 'power(2, 10) -> 1024\nsum_nested([1,[2,[3,[4]]]]) -> 10\ncount_occurrences([1,[1,2,[1,3]]], 1) -> 3\ngenerate_subsets([1,2,3]) -> [[], [1], [2], [3], [1,2], [1,3], [2,3], [1,2,3]]\nhanoi(3, "A", "C", "B") -> список ходов',
      hint: 'power рекурсивно: power(b, e//2)**2 если e чётное (быстрое возведение). sum_nested: проверяй isinstance(item, list) для рекурсии. subsets: [] + add каждый элемент к каждому подмножеству.',
      solution: 'def power(base, exp):\n    if exp == 0: return 1\n    if exp == 1: return base\n    if exp % 2 == 0:\n        half = power(base, exp // 2)\n        return half * half\n    return base * power(base, exp - 1)\n\ndef sum_nested(lst):\n    total = 0\n    for item in lst:\n        if isinstance(item, (list, tuple)):\n            total += sum_nested(item)\n        else:\n            total += item\n    return total\n\ndef count_occurrences(lst, target):\n    count = 0\n    for item in lst:\n        if isinstance(item, list):\n            count += count_occurrences(item, target)\n        elif item == target:\n            count += 1\n    return count\n\ndef generate_subsets(lst):\n    if not lst:\n        return [[]]\n    first = lst[0]\n    rest = generate_subsets(lst[1:])\n    return rest + [[first] + sub for sub in rest]\n\ndef hanoi(n, source, target, auxiliary):\n    moves = []\n    def _hanoi(n, src, tgt, aux):\n        if n == 1:\n            moves.append(f"{src} -> {tgt}")\n            return\n        _hanoi(n-1, src, aux, tgt)\n        moves.append(f"{src} -> {tgt}")\n        _hanoi(n-1, aux, tgt, src)\n    _hanoi(n, source, target, auxiliary)\n    return moves\n\nprint(power(2, 10))\nprint(sum_nested([1, [2, [3, [4, [5]]]]]))\nprint(count_occurrences([1, [1, 2, [1, 3]]], 1))\nprint(generate_subsets([1, 2, 3]))\nfor move in hanoi(3, "A", "C", "B"):\n    print(" ", move)',
      explanation: 'Быстрое возведение в степень O(log n) через разбивку на половины. Ханойские башни: переложи n-1 на вспомогательный, перенеси n-й диск, переложи n-1 обратно. generate_subsets: каждый подмножество без первого элемента + то же с первым — O(2^n).'
    },
    {
      id: 8,
      title: 'Задачи с диапазонами',
      type: 'practice',
      difficulty: 'easy',
      description: 'Задачи на работу с числовыми диапазонами и интервалами.',
      requirements: [
        'merge_intervals([[1,3],[2,6],[8,10],[15,18]]) -> [[1,6],[8,10],[15,18]]',
        'count_in_range(lst, lo, hi) — количество элементов в диапазоне',
        'range_sum(n) — сумма от 1 до n без цикла',
        'even_odd_split(lst) -> (чётные, нечётные)',
        'clamp(value, min_val, max_val) — ограничить значение'
      ],
      expectedOutput: 'merge_intervals([[1,3],[2,6],[8,10]]) -> [[1,6],[8,10]]\ncount_in_range([1..10], 3, 7) -> 5\nrange_sum(100) -> 5050\neven_odd_split([1..10]) -> ([2,4,6,8,10],[1,3,5,7,9])',
      hint: 'merge_intervals: отсортируй по началу, сравни конец текущего с началом следующего. count_in_range: sum(1 for x in lst if lo <= x <= hi).',
      solution: 'def merge_intervals(intervals):\n    if not intervals: return []\n    sorted_intervals = sorted(intervals, key=lambda x: x[0])\n    result = [sorted_intervals[0][:]]\n    for start, end in sorted_intervals[1:]:\n        if start <= result[-1][1]:\n            result[-1][1] = max(result[-1][1], end)\n        else:\n            result.append([start, end])\n    return result\n\ndef count_in_range(lst, lo, hi):\n    return sum(1 for x in lst if lo <= x <= hi)\n\ndef range_sum(n):\n    return n * (n + 1) // 2\n\ndef even_odd_split(lst):\n    evens = [x for x in lst if x % 2 == 0]\n    odds = [x for x in lst if x % 2 != 0]\n    return evens, odds\n\ndef clamp(value, min_val, max_val):\n    return max(min_val, min(max_val, value))\n\nprint(merge_intervals([[1,3],[2,6],[8,10],[15,18]]))\nprint(count_in_range(list(range(1, 11)), 3, 7))\nprint(range_sum(100))\nevens, odds = even_odd_split(list(range(1, 11)))\nprint("Чётные:", evens)\nprint("Нечётные:", odds)\nfor v in [-5, 5, 15]:\n    print(f"clamp({v}, 0, 10) = {clamp(v, 0, 10)}")',
      explanation: 'merge_intervals: жадный алгоритм с сортировкой O(n log n). Слияние: если текущий интервал перекрывается с предыдущим (start <= prev_end), расширяем. clamp = max(min_val, min(max_val, value)) — одна строка без условий.'
    },
    {
      id: 9,
      title: 'Задачи на строки 2',
      type: 'practice',
      difficulty: 'easy',
      description: 'Ещё задачи на манипуляции со строками.',
      requirements: [
        'count_substrings(s, sub) — количество вхождений подстроки (с перекрытием)',
        'zigzag(s, rows) — зигзаг кодирование строки',
        'remove_consecutive_duplicates("aabbbcc") -> "abc"',
        'acronym(phrase) — аббревиатура: "Python Programming" -> "PP"',
        'balanced_parens(n) — все правильные скобочные последовательности длиной 2n'
      ],
      expectedOutput: 'count_substrings("aaa", "aa") -> 2 (с перекрытием)\nremove_consecutive_duplicates("aabbbcccd") -> "abcd"\nacronym("Artificial Intelligence") -> "AI"\nbalanced_parens(2) -> ["(())", "()()"]',
      hint: 'count_substrings с перекрытием: for i in range(len(s)): if s[i:].startswith(sub). remove_consecutive: itertools.groupby или zip(s, s[1:]).',
      solution: 'from itertools import groupby\n\ndef count_substrings(s, sub):\n    return sum(1 for i in range(len(s)) if s[i:i+len(sub)] == sub)\n\ndef remove_consecutive_duplicates(s):\n    return "".join(k for k, _ in groupby(s))\n\ndef acronym(phrase):\n    return "".join(word[0].upper() for word in phrase.split() if word)\n\ndef balanced_parens(n):\n    result = []\n    def backtrack(s, open_count, close_count):\n        if len(s) == 2 * n:\n            result.append(s)\n            return\n        if open_count < n:\n            backtrack(s + "(", open_count + 1, close_count)\n        if close_count < open_count:\n            backtrack(s + ")", open_count, close_count + 1)\n    backtrack("", 0, 0)\n    return result\n\ndef zigzag(s, rows):\n    if rows == 1 or rows >= len(s):\n        return s\n    rail = [""] * rows\n    row, direction = 0, 1\n    for char in s:\n        rail[row] += char\n        if row == 0: direction = 1\n        if row == rows - 1: direction = -1\n        row += direction\n    return "".join(rail)\n\nprint(count_substrings("aaa", "aa"))\nprint(remove_consecutive_duplicates("aabbbcccd"))\nprint(acronym("Artificial Intelligence"))\nprint(balanced_parens(3))\nprint(zigzag("PAYPALISHIRING", 3))',
      explanation: 'groupby из itertools группирует подряд идущие одинаковые символы — k для ключа (символ). balanced_parens — бэктрекинг: добавляем ( если не исчерпали лимит, ) если закрывающих меньше чем открывающих. Zigzag: симулируем движение по рядам.'
    },
    {
      id: 10,
      title: 'Задачи на хеш-таблицы',
      type: 'practice',
      difficulty: 'easy',
      description: 'Задачи эффективно решаемые через словари (хеш-таблицы).',
      requirements: [
        'contains_duplicate(lst) — есть ли дубликаты',
        'isomorphic(s, t) — изоморфны ли строки ("egg","add" -> True)',
        'group_anagrams(words) — сгруппировать анаграммы',
        'subarray_sum(lst, target) — найти подмассив с заданной суммой',
        'longest_unique_substring(s) — длина наибольшей подстроки без повторов'
      ],
      expectedOutput: 'contains_duplicate([1,2,3,1]) -> True\nisomorphic("egg","add") -> True, ("foo","bar") -> False\nsubarray_sum([1,4,2,2,3], 7) -> [4,2,2] (с индекса 1)\nlongest_unique_substring("abcabcbb") -> 3',
      hint: 'isomorphic: два словаря s->t и t->s, проверяй двустороннее соответствие. subarray_sum: префиксные суммы + словарь {sum: index}. longest_unique: sliding window.',
      solution: 'from collections import defaultdict\n\ndef contains_duplicate(lst):\n    return len(lst) != len(set(lst))\n\ndef isomorphic(s, t):\n    if len(s) != len(t): return False\n    s_to_t = {}\n    t_to_s = {}\n    for cs, ct in zip(s, t):\n        if cs in s_to_t and s_to_t[cs] != ct: return False\n        if ct in t_to_s and t_to_s[ct] != cs: return False\n        s_to_t[cs] = ct\n        t_to_s[ct] = cs\n    return True\n\ndef group_anagrams(words):\n    groups = defaultdict(list)\n    for w in words:\n        groups[tuple(sorted(w))].append(w)\n    return list(groups.values())\n\ndef subarray_sum(lst, target):\n    prefix_sums = {0: -1}\n    current_sum = 0\n    for i, num in enumerate(lst):\n        current_sum += num\n        if current_sum - target in prefix_sums:\n            start = prefix_sums[current_sum - target] + 1\n            return lst[start:i+1]\n        prefix_sums[current_sum] = i\n    return []\n\ndef longest_unique_substring(s):\n    char_index = {}\n    max_len = start = 0\n    for i, char in enumerate(s):\n        if char in char_index and char_index[char] >= start:\n            start = char_index[char] + 1\n        char_index[char] = i\n        max_len = max(max_len, i - start + 1)\n    return max_len\n\nprint(contains_duplicate([1, 2, 3, 1]))\nprint(isomorphic("egg", "add"), isomorphic("foo", "bar"))\nprint(group_anagrams(["eat","tea","tan","ate","nat","bat"]))\nprint(subarray_sum([1, 4, 2, 2, 3], 7))\nprint(longest_unique_substring("abcabcbb"))',
      explanation: 'subarray_sum через префиксные суммы O(n): если prefix[i] - prefix[j] == target, то подмассив [j+1..i] — решение. longest_unique через sliding window O(n): двигаем левую границу start при нахождении дубликата. isomorphic: биективное отображение.'
    }
  ]
}
