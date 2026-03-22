export default {
  id: 26,
  title: 'Coding: жадные алгоритмы',
  description: 'Жадные алгоритмы: принятие локально оптимальных решений на каждом шаге. Задачи на максимальный подмассив, прыжки, заправки, планировщик задач и другие классические задачи с собеседований.',
  lessons: [
    {
      id: 1,
      title: 'Maximum Subarray (алгоритм Кадане)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Найди контiguous подмассив с наибольшей суммой и верни эту сумму. Алгоритм Кадане — классический жадный подход.',
      requirements: [
        'Реализовать функцию max_subarray(nums: list) -> int',
        'Использовать алгоритм Кадане с трассировкой',
        'Вывести текущую и максимальную сумму на каждом шаге',
        'Тесты: [-2,1,-3,4,-1,2,1,-5,4] -> 6, [1] -> 1, [5,4,-1,7,8] -> 23'
      ],
      expectedOutput: '[-2,1,-3,4,-1,2,1,-5,4] -> 6\n[1] -> 1\n[5,4,-1,7,8] -> 23\nТрассировка [-2,1,-3,4,-1,2,1,-5,4]:\ni=0 num=-2: cur=-2, max=-2\ni=1 num=1: cur=1, max=1\ni=2 num=-3: cur=-2, max=1\ni=3 num=4: cur=4, max=4\ni=4 num=-1: cur=3, max=4\ni=5 num=2: cur=5, max=5\ni=6 num=1: cur=6, max=6\ni=7 num=-5: cur=1, max=6\ni=8 num=4: cur=5, max=6',
      hint: 'Кадане: cur_sum = max(num, cur_sum + num). Если добавление числа к текущей сумме даёт меньше, чем само число — начинаем новый подмассив с этого числа.',
      solution: 'def max_subarray(nums):\n    cur_sum = nums[0]\n    max_sum = nums[0]\n    for num in nums[1:]:\n        cur_sum = max(num, cur_sum + num)\n        max_sum = max(max_sum, cur_sum)\n    return max_sum\n\nprint("[-2,1,-3,4,-1,2,1,-5,4] ->", max_subarray([-2, 1, -3, 4, -1, 2, 1, -5, 4]))\nprint("[1] ->", max_subarray([1]))\nprint("[5,4,-1,7,8] ->", max_subarray([5, 4, -1, 7, 8]))\n\ndef max_subarray_verbose(nums):\n    cur_sum = nums[0]\n    max_sum = nums[0]\n    print("Трассировка", nums + [":"])\n    print("i=0 num=" + str(nums[0]) + ": cur=" + str(cur_sum) + ", max=" + str(max_sum))\n    for i, num in enumerate(nums[1:], 1):\n        cur_sum = max(num, cur_sum + num)\n        max_sum = max(max_sum, cur_sum)\n        print("i=" + str(i) + " num=" + str(num) + ": cur=" + str(cur_sum) + ", max=" + str(max_sum))\n    return max_sum\n\nmax_subarray_verbose([-2, 1, -3, 4, -1, 2, 1, -5, 4])',
      explanation: 'Подход (алгоритм Кадане): жадный выбор на каждом шаге — продолжить текущий подмассив или начать новый. Если cur_sum + num < num, текущий подмассив только ухудшает результат.\nСложность: O(n) время, O(1) память.\nНа интервью: это один из самых часто задаваемых вопросов. Объясни интуицию: "зачем тащить отрицательный хвост?" Упомяни ДП версию (dp[i] = max(nums[i], dp[i-1] + nums[i])) — жадное и ДП решения эквивалентны.'
    },
    {
      id: 2,
      title: 'Jump Game',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан массив nums. nums[i] — максимальная дальность прыжка из позиции i. Можно ли добраться до последнего индекса?',
      requirements: [
        'Реализовать функцию can_jump(nums: list) -> bool',
        'Использовать жадный подход: отслеживать максимальную достижимую позицию',
        'Вывести max_reach на каждом шаге',
        'Тесты: [2,3,1,1,4] -> True, [3,2,1,0,4] -> False'
      ],
      expectedOutput: '[2,3,1,1,4] -> True\n[3,2,1,0,4] -> False\nТрассировка [2,3,1,1,4]:\ni=0: num=2, max_reach=2\ni=1: num=3, max_reach=4\ni=2: num=1, max_reach=4\ni=3: num=1, max_reach=4\ni=4: num=4, max_reach=8 -> достигли конца!',
      hint: 'Поддерживай max_reach — максимальный индекс, которого можно достичь. На каждом шаге i: если i > max_reach — застряли. Иначе: max_reach = max(max_reach, i + nums[i]).',
      solution: 'def can_jump(nums):\n    max_reach = 0\n    for i, num in enumerate(nums):\n        if i > max_reach:\n            return False\n        max_reach = max(max_reach, i + num)\n    return True\n\nprint("[2,3,1,1,4] ->", can_jump([2, 3, 1, 1, 4]))\nprint("[3,2,1,0,4] ->", can_jump([3, 2, 1, 0, 4]))\n\ndef can_jump_verbose(nums):\n    max_reach = 0\n    n = len(nums)\n    print("Трассировка", str(nums) + ":")\n    for i, num in enumerate(nums):\n        if i > max_reach:\n            print("i=" + str(i) + ": застряли! max_reach=" + str(max_reach))\n            return False\n        max_reach = max(max_reach, i + num)\n        status = " -> достигли конца!" if max_reach >= n - 1 else ""\n        print("i=" + str(i) + ": num=" + str(num) + ", max_reach=" + str(max_reach) + status)\n    return True\n\ncan_jump_verbose([2, 3, 1, 1, 4])',
      explanation: 'Подход: жадно поддерживаем максимально достижимую позицию max_reach. Если на шаге i > max_reach — достичь конца невозможно.\nСложность: O(n) время, O(1) память.\nНа интервью: классический пример "жадного инварианта". Покажи, что нет смысла рассматривать позиции за max_reach — они недостижимы. Вариация — Jump Game II (минимальное число прыжков).'
    },
    {
      id: 3,
      title: 'Jump Game II',
      type: 'practice',
      difficulty: 'medium',
      description: 'Гарантировано, что можно добраться до конца. Найди минимальное количество прыжков для достижения последнего индекса.',
      requirements: [
        'Реализовать функцию jump(nums: list) -> int',
        'Жадный подход: отслеживать текущую и следующую границу прыжка',
        'Вывести количество прыжков и границы',
        'Тесты: [2,3,1,1,4] -> 2, [2,3,0,1,4] -> 2'
      ],
      expectedOutput: '[2,3,1,1,4] -> 2\n[2,3,0,1,4] -> 2\nТрассировка [2,3,1,1,4]:\nПрыжок 1: граница [0,2], farthest=4\nПрыжок 2: граница [3,4], достигли конца',
      hint: 'Поддерживай cur_end (конец текущего "уровня" прыжков) и farthest (самая далёкая точка). Когда i == cur_end, делаем прыжок: jumps++, cur_end = farthest.',
      solution: 'def jump(nums):\n    jumps = 0\n    cur_end = 0\n    farthest = 0\n    for i in range(len(nums) - 1):\n        farthest = max(farthest, i + nums[i])\n        if i == cur_end:\n            jumps += 1\n            cur_end = farthest\n    return jumps\n\nprint("[2,3,1,1,4] ->", jump([2, 3, 1, 1, 4]))\nprint("[2,3,0,1,4] ->", jump([2, 3, 0, 1, 4]))\n\ndef jump_verbose(nums):\n    jumps = 0\n    cur_end = 0\n    farthest = 0\n    n = len(nums)\n    print("Трассировка", str(nums) + ":")\n    for i in range(n - 1):\n        farthest = max(farthest, i + nums[i])\n        if i == cur_end:\n            jumps += 1\n            prev_end = cur_end\n            cur_end = farthest\n            end_str = " -> достигли конца" if cur_end >= n - 1 else ""\n            print("Прыжок " + str(jumps) + ": граница [" + str(prev_end) + "," + str(cur_end) + "], farthest=" + str(farthest) + end_str)\n    return jumps\n\njump_verbose([2, 3, 1, 1, 4])',
      explanation: 'Подход: BFS-стиль, "уровни" прыжков. На каждом уровне (промежутке [prev_end+1..cur_end]) находим максимально далёкую точку. Когда доходим до cur_end — делаем прыжок и переходим на следующий уровень.\nСложность: O(n) время, O(1) память.\nНа интервью: визуализируй как BFS по уровням. Каждый "уровень" — все позиции, достижимые за k прыжков. Это умный жадный алгоритм с инвариантом: на каждом шаге берём максимально далёкую позицию.'
    },
    {
      id: 4,
      title: 'Gas Station',
      type: 'practice',
      difficulty: 'medium',
      description: 'N заправок по кругу. gas[i] — топливо на заправке i, cost[i] — расход от i до i+1. Найди начальную станцию для полного объезда или -1.',
      requirements: [
        'Реализовать функцию can_complete_circuit(gas: list, cost: list) -> int',
        'O(n) жадный алгоритм (не O(n^2) перебор)',
        'Вывести diff и tank на каждом шаге',
        'Тесты: gas=[1,2,3,4,5],cost=[3,4,5,1,2] -> 3, gas=[2,3,4],cost=[3,4,3] -> -1'
      ],
      expectedOutput: 'gas=[1,2,3,4,5],cost=[3,4,5,1,2]: 3\ngas=[2,3,4],cost=[3,4,3]: -1\nТрассировка:\nstart=3, total_tank=2 >= 0 -> решение найдено',
      hint: 'Ключевой факт: если total(gas) >= total(cost) — решение существует и единственно. Жадный поиск: если tank < 0 в позиции i, начало не может быть в [start..i], сбрасываем start = i+1.',
      solution: 'def can_complete_circuit(gas, cost):\n    total_tank = 0\n    cur_tank = 0\n    start = 0\n    for i in range(len(gas)):\n        diff = gas[i] - cost[i]\n        total_tank += diff\n        cur_tank += diff\n        if cur_tank < 0:\n            start = i + 1\n            cur_tank = 0\n    return start if total_tank >= 0 else -1\n\nprint("gas=[1,2,3,4,5],cost=[3,4,5,1,2]:", can_complete_circuit([1,2,3,4,5], [3,4,5,1,2]))\nprint("gas=[2,3,4],cost=[3,4,3]:", can_complete_circuit([2,3,4], [3,4,3]))\n\ndef circuit_verbose(gas, cost):\n    total_tank = 0\n    cur_tank = 0\n    start = 0\n    for i in range(len(gas)):\n        diff = gas[i] - cost[i]\n        total_tank += diff\n        cur_tank += diff\n        if cur_tank < 0:\n            print("i=" + str(i) + ": cur_tank=" + str(cur_tank) + " < 0, сбрасываем start=" + str(i+1))\n            start = i + 1\n            cur_tank = 0\n    result = start if total_tank >= 0 else -1\n    status = str(total_tank) + " >= 0 -> решение найдено" if total_tank >= 0 else str(total_tank) + " < 0 -> нет решения"\n    print("start=" + str(start) + ", total_tank=" + status)\n    return result\n\ncircuit_verbose([1, 2, 3, 4, 5], [3, 4, 5, 1, 2])',
      explanation: 'Подход: два факта. 1) Если sum(gas) < sum(cost) — решения нет. 2) Жадно: если накопленный tank < 0 на позиции i, стартовая точка не может быть ни в одной позиции до i — сбрасываем на i+1.\nСложность: O(n) время, O(1) память.\nНа интервью: докажи корректность жадного выбора. Если от start до i накопленный баланс отрицательный, то ни одна промежуточная точка не может стать лучшим стартом.'
    },
    {
      id: 5,
      title: 'Hand of Straights',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан массив hand карт и число groupSize. Можно ли разделить все карты на группы по groupSize карт, где в каждой группе — последовательные значения?',
      requirements: [
        'Реализовать функцию is_n_straight_hand(hand: list, group_size: int) -> bool',
        'Использовать счётчик и обработку по минимальному значению',
        'Вывести шаги формирования групп',
        'Тесты: hand=[1,2,3,6,2,3,4,7,8],groupSize=3 -> True, hand=[1,2,3,4],groupSize=3 -> False'
      ],
      expectedOutput: 'hand=[1,2,3,6,2,3,4,7,8],groupSize=3: True\nhand=[1,2,3,4],groupSize=3: False\nГруппы: [1,2,3], [2,3,4], [6,7,8]',
      hint: 'Подсчитай частоты через Counter. Обрабатывай карты по наименьшему значению: для min_card формируй группу [min_card, min_card+1, ..., min_card+groupSize-1], уменьшая счётчики.',
      solution: 'from collections import Counter\n\ndef is_n_straight_hand(hand, group_size):\n    if len(hand) % group_size != 0:\n        return False\n    count = Counter(hand)\n    sorted_keys = sorted(count.keys())\n    for card in sorted_keys:\n        if count[card] > 0:\n            freq = count[card]\n            for i in range(group_size):\n                if count[card + i] < freq:\n                    return False\n                count[card + i] -= freq\n    return True\n\nprint("hand=[1,2,3,6,2,3,4,7,8],groupSize=3:", is_n_straight_hand([1,2,3,6,2,3,4,7,8], 3))\nprint("hand=[1,2,3,4],groupSize=3:", is_n_straight_hand([1,2,3,4], 3))\n\ndef hand_verbose(hand, group_size):\n    if len(hand) % group_size != 0:\n        print("Длина не кратна groupSize")\n        return False\n    count = Counter(hand)\n    sorted_keys = sorted(count.keys())\n    groups = []\n    for card in sorted_keys:\n        if count[card] > 0:\n            freq = count[card]\n            for _ in range(freq):\n                group = list(range(card, card + group_size))\n                groups.append(group)\n            for i in range(group_size):\n                if count[card + i] < freq:\n                    print("Не хватает карты " + str(card + i))\n                    return False\n                count[card + i] -= freq\n    print("Группы:", groups)\n    return True\n\nhand_verbose([1, 2, 3, 6, 2, 3, 4, 7, 8], 3)',
      explanation: 'Подход: жадно формируем группы начиная с наименьшей карты. Если самая маленькая карта не может начать группу — решения нет. Используем Counter для подсчёта и sorted для обработки в порядке возрастания.\nСложность: O(n log n) из-за сортировки, O(n) память.\nНа интервью: объясни жадный инвариант — наименьшая оставшаяся карта обязательно должна стать началом новой группы, потому что никакая другая группа её не "заберёт".'
    },
    {
      id: 6,
      title: 'Partition Labels',
      type: 'practice',
      difficulty: 'medium',
      description: 'Строка s. Разбей строку на максимальное количество частей так, чтобы каждая буква встречалась только в одной части. Вернуть список длин частей.',
      requirements: [
        'Реализовать функцию partition_labels(s: str) -> list',
        'Найти последнее вхождение каждой буквы',
        'Вывести границы каждой части',
        'Тесты: "ababcbacadefegdehijhklij" -> [9,7,8], "eccbbbbdec" -> [10]'
      ],
      expectedOutput: '"ababcbacadefegdehijhklij" -> [9, 7, 8]\n"eccbbbbdec" -> [10]\nЧасть 1: s[0:9]="ababcbaca", длина=9\nЧасть 2: s[9:16]="defegde", длина=7\nЧасть 3: s[16:24]="hijhklij", длина=8',
      hint: 'Сначала запомни последнее вхождение каждой буквы: last[c] = max index. Затем жадно: поддерживай end = max last вхождений в текущей части. Когда i == end — часть завершена.',
      solution: 'def partition_labels(s):\n    last = {c: i for i, c in enumerate(s)}\n    result = []\n    start = 0\n    end = 0\n    for i, c in enumerate(s):\n        end = max(end, last[c])\n        if i == end:\n            result.append(end - start + 1)\n            start = end + 1\n    return result\n\nprint(\'"\' + "ababcbacadefegdehijhklij" + \'"\' + " ->", partition_labels("ababcbacadefegdehijhklij"))\nprint(\'"\' + "eccbbbbdec" + \'"\' + " ->", partition_labels("eccbbbbdec"))\n\ndef partition_verbose(s):\n    last = {c: i for i, c in enumerate(s)}\n    result = []\n    start = 0\n    end = 0\n    for i, c in enumerate(s):\n        end = max(end, last[c])\n        if i == end:\n            length = end - start + 1\n            result.append(length)\n            print("Часть " + str(len(result)) + ": s[" + str(start) + ":" + str(end+1) + "]=" + \'"\'+ s[start:end+1] + \'"\' + ", длина=" + str(length))\n            start = end + 1\n    return result\n\npartition_verbose("ababcbacadefegdehijhklij")',
      explanation: 'Подход: двухпроходный жадный алгоритм. Первый проход: последнее вхождение каждого символа. Второй проход: расширяем границу текущей части до максимального last вхождения. Когда текущая позиция достигает границы — часть завершена.\nСложность: O(n) время, O(1) память (алфавит фиксирован).\nНа интервью: объясни интуицию — если буква "a" встречается в позиции 0 и 8, часть должна включать минимум s[0..8]. Аналогия с interval merging.'
    },
    {
      id: 7,
      title: 'Valid Parenthesis String',
      type: 'practice',
      difficulty: 'medium',
      description: 'Строка из "(", ")" и "*". Звёздочка может быть "(" или ")" или пустой строкой. Проверь, является ли строка валидной скобочной последовательностью.',
      requirements: [
        'Реализовать функцию check_valid_string(s: str) -> bool',
        'Использовать жадный подход с диапазоном [lo, hi] для открытых скобок',
        'Вывести lo и hi на каждом шаге',
        'Тесты: "()" -> True, "(*)" -> True, "(*))" -> True, "(((*" -> False'
      ],
      expectedOutput: '"()" -> True\n"(*)" -> True\n"(*))" -> True\n"(((*" -> False\nТрассировка "(*)":\nc=(: lo=1, hi=1\nc=*: lo=0, hi=2\nc=): lo=0, hi=1 -> True',
      hint: 'Поддерживай lo (минимум открытых) и hi (максимум открытых). "(": lo++, hi++. ")": lo--, hi--. "*": lo-- (как ")"), hi++ (как "("). Если hi < 0 — невалидно. В конце lo == 0.',
      solution: 'def check_valid_string(s):\n    lo = 0\n    hi = 0\n    for c in s:\n        if c == "(":\n            lo += 1\n            hi += 1\n        elif c == ")":\n            lo -= 1\n            hi -= 1\n        else:\n            lo -= 1\n            hi += 1\n        if hi < 0:\n            return False\n        lo = max(lo, 0)\n    return lo == 0\n\nprint(\'"\' + "()" + \'"\' + " ->", check_valid_string("()"))\nprint(\'"\' + "(*)" + \'"\' + " ->", check_valid_string("(*)"))\nprint(\'"\' + "(*))"+\'"\' + " ->", check_valid_string("(*))"))\nprint(\'"\' + "(((*"+ \'"\' + " ->", check_valid_string("(((*"))\n\ndef check_verbose(s):\n    lo = 0\n    hi = 0\n    print("Трассировка \\"" + s + "\\":")\n    for c in s:\n        if c == "(":\n            lo += 1; hi += 1\n        elif c == ")":\n            lo -= 1; hi -= 1\n        else:\n            lo -= 1; hi += 1\n        if hi < 0:\n            print("c=" + c + ": hi=" + str(hi) + " < 0 -> False")\n            return False\n        lo = max(lo, 0)\n        print("c=" + c + ": lo=" + str(lo) + ", hi=" + str(hi))\n    result = lo == 0\n    print("-> " + str(result))\n    return result\n\ncheck_verbose("(*)")',
      explanation: 'Подход: [lo, hi] — диапазон возможного количества незакрытых скобок. lo — минимум (звёздочки как ")"), hi — максимум (звёздочки как "("). Если hi < 0 — слишком много закрывающих. Если lo > 0 в конце — есть незакрытые.\nСложность: O(n) время, O(1) память.\nНа интервью: это умный жадный с диапазоном вместо однозначного счётчика. Альтернатива — ДП, но O(n^2). Жадный O(n) значительно лучше.'
    },
    {
      id: 8,
      title: 'Task Scheduler',
      type: 'practice',
      difficulty: 'medium',
      description: 'Список задач (символы) и кулдаун n: между одинаковыми задачами должно быть не менее n слотов. Найди минимальное время выполнения всех задач.',
      requirements: [
        'Реализовать функцию least_interval(tasks: list, n: int) -> int',
        'Использовать формулу через максимальную частоту',
        'Объяснить расчёт в выводе',
        'Тесты: tasks=["A","A","A","B","B","B"],n=2 -> 8, tasks=["A","A","A","B","B","B"],n=0 -> 6, tasks=["A","A","A","A","B","B","B"],n=2 -> 10'
      ],
      expectedOutput: 'tasks=AAABBB,n=2: 8\ntasks=AAABBB,n=0: 6\ntasks=AAAABBB,n=2: 10\nПояснение для AAABBB,n=2:\nmax_freq=3, count_max=2\nmin_time = max(8, 6) = 8\nПорядок: A B _ A B _ A B',
      hint: 'Формула: max_freq — наибольшая частота задачи. count_max — сколько задач с такой частотой. min_time = max((max_freq-1)*(n+1)+count_max, len(tasks)).',
      solution: 'from collections import Counter\n\ndef least_interval(tasks, n):\n    count = Counter(tasks)\n    max_freq = max(count.values())\n    count_max = sum(1 for v in count.values() if v == max_freq)\n    return max((max_freq - 1) * (n + 1) + count_max, len(tasks))\n\nprint("tasks=AAABBB,n=2:", least_interval(["A","A","A","B","B","B"], 2))\nprint("tasks=AAABBB,n=0:", least_interval(["A","A","A","B","B","B"], 0))\nprint("tasks=AAAABBB,n=2:", least_interval(["A","A","A","A","B","B","B"], 2))\n\ndef interval_verbose(tasks, n):\n    count = Counter(tasks)\n    max_freq = max(count.values())\n    count_max = sum(1 for v in count.values() if v == max_freq)\n    formula = (max_freq - 1) * (n + 1) + count_max\n    result = max(formula, len(tasks))\n    task_str = "".join(sorted(tasks))\n    print("Пояснение для " + task_str + ",n=" + str(n) + ":")\n    print("max_freq=" + str(max_freq) + ", count_max=" + str(count_max))\n    print("min_time = max(" + str(formula) + ", " + str(len(tasks)) + ") = " + str(result))\n    return result\n\ninterval_verbose(["A","A","A","B","B","B"], 2)',
      explanation: 'Подход: жадная формула. Самая частая задача создаёт "фреймы" размером (n+1). Фреймов (max_freq-1), последний фрейм неполный — count_max задач. Если задач достаточно много — все слоты заполнены и ответ просто len(tasks).\nСложность: O(n) время, O(1) память (26 букв алфавита).\nНа интервью: объясни визуально — нарисуй сетку (max_freq-1) строк по (n+1) столбцов. Заполни наиболее частыми задачами по столбцам. Либо ответ — число ячеек в сетке + хвост, либо просто len(tasks).'
    }
  ]
}
