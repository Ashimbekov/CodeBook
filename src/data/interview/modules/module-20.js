export default {
  id: 20,
  title: 'Coding: два указателя',
  description: 'Задачи на технику двух указателей: работа с отсортированными массивами, суммы и задачи на воду.',
  lessons: [
    {
      id: 1,
      title: 'Валидный палиндром',
      type: 'practice',
      difficulty: 'easy',
      description: 'Дана строка s. Определи, является ли она палиндромом, учитывая только буквенно-цифровые символы и игнорируя регистр. LeetCode #125.',
      requirements: [
        'Принимает строку',
        'Возвращает True если строка является палиндромом',
        'Игнорирует небуквенно-цифровые символы',
        'Не чувствителен к регистру'
      ],
      expectedOutput: 'Вход: "A man, a plan, a canal: Panama"\nВыход: True\nВход: "race a car"\nВыход: False',
      hint: 'Два указателя: left с начала, right с конца. Пропускай не-алфавитно-цифровые символы. Сравнивай символы в нижнем регистре.',
      solution: 'def isPalindrome(s):\n    left, right = 0, len(s) - 1\n    while left < right:\n        while left < right and not s[left].isalnum():\n            left += 1\n        while left < right and not s[right].isalnum():\n            right -= 1\n        if s[left].lower() != s[right].lower():\n            return False\n        left += 1\n        right -= 1\n    return True\n\n# Краткий вариант\ndef isPalindromeShort(s):\n    filtered = [c.lower() for c in s if c.isalnum()]\n    return filtered == filtered[::-1]',
      explanation: 'Подход: два указателя сходятся к центру, пропуская невалидные символы.\nСложность: O(n) по времени, O(1) по памяти для двух указателей.\nСовет для интервью: начни с простого решения через фильтрацию, затем оптимизируй до O(1) памяти.'
    },
    {
      id: 2,
      title: 'Two Sum II — отсортированный массив',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан ОТСОРТИРОВАННЫЙ массив numbers (1-indexed) и число target. Найди два числа, сумма которых равна target. Верни их индексы [i, j] (1-indexed). Нельзя использовать одно число дважды. LeetCode #167.',
      requirements: [
        'Массив отсортирован по возрастанию',
        'Гарантированно существует ровно одно решение',
        'Возвращает индексы 1-indexed',
        'O(1) дополнительной памяти'
      ],
      expectedOutput: 'Вход: numbers=[2,7,11,15], target=9\nВыход: [1,2]\nВход: numbers=[2,3,4], target=6\nВыход: [1,3]',
      hint: 'Два указателя: left=0, right=len-1. Если сумма < target — увеличивай left. Если > target — уменьшай right. Если == target — ответ найден.',
      solution: 'def twoSum(numbers, target):\n    left, right = 0, len(numbers) - 1\n    while left < right:\n        current_sum = numbers[left] + numbers[right]\n        if current_sum == target:\n            return [left + 1, right + 1]  # 1-indexed\n        elif current_sum < target:\n            left += 1\n        else:\n            right -= 1\n    return []',
      explanation: 'Подход: так как массив отсортирован, два указателя эффективно сужают поиск.\nСложность: O(n) по времени, O(1) по памяти — лучше чем хеш-таблица O(n) памяти.\nСовет для интервью: ключевое условие — массив ОТСОРТИРОВАН. Без этого нужна хеш-таблица. Два указателя работают именно из-за монотонности: увеличение left увеличивает сумму, уменьшение right уменьшает.'
    },
    {
      id: 3,
      title: '3Sum',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан массив nums. Найди все уникальные тройки [nums[i], nums[j], nums[k]] где i, j, k различны и сумма равна 0. LeetCode #15.',
      requirements: [
        'Принимает список целых чисел',
        'Возвращает список уникальных троек',
        'Нет дубликатов в результате',
        'Порядок элементов внутри тройки не важен'
      ],
      expectedOutput: 'Вход: nums=[-1,0,1,2,-1,-4]\nВыход: [[-1,-1,2],[-1,0,1]]',
      hint: 'Сортируй массив. Для каждого i запускай Two Sum с двумя указателями на оставшейся части. Пропускай дубликаты для i, left и right.',
      solution: 'def threeSum(nums):\n    nums.sort()\n    result = []\n    for i in range(len(nums) - 2):\n        # Пропускаем дубликаты для первого элемента\n        if i > 0 and nums[i] == nums[i-1]:\n            continue\n        if nums[i] > 0:\n            break  # все следующие тройки будут положительными\n        left, right = i + 1, len(nums) - 1\n        while left < right:\n            total = nums[i] + nums[left] + nums[right]\n            if total == 0:\n                result.append([nums[i], nums[left], nums[right]])\n                # Пропускаем дубликаты для left и right\n                while left < right and nums[left] == nums[left+1]:\n                    left += 1\n                while left < right and nums[right] == nums[right-1]:\n                    right -= 1\n                left += 1\n                right -= 1\n            elif total < 0:\n                left += 1\n            else:\n                right -= 1\n    return result',
      explanation: 'Подход: сортировка + фиксируем первый элемент, Two Sum для остальных двух.\nСложность: O(n^2) по времени (сортировка O(n log n) + два цикла). O(1) дополнительной памяти.\nСовет для интервью: упомяни оптимизацию — если nums[i] > 0, то сумма трёх неотрицательных не может быть 0. Обработка дубликатов — важная деталь которую легко пропустить.'
    },
    {
      id: 4,
      title: 'Контейнер с наибольшим количеством воды',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан массив высот. Найди два столбца, которые вместе с осью x образуют контейнер с максимальным объёмом воды. LeetCode #11.',
      requirements: [
        'Принимает список высот',
        'Возвращает максимальную площадь',
        'Нельзя наклонять контейнер',
        'O(n) решение через два указателя'
      ],
      expectedOutput: 'Вход: height=[1,8,6,2,5,4,8,3,7]\nВыход: 49',
      hint: 'Два указателя с концов. Объём = min(height[l], height[r]) * (r - l). Двигай указатель с МЕНЬШЕЙ высотой — только так можно улучшить результат.',
      solution: 'def maxArea(height):\n    left, right = 0, len(height) - 1\n    max_water = 0\n    while left < right:\n        h = min(height[left], height[right])\n        max_water = max(max_water, h * (right - left))\n        if height[left] < height[right]:\n            left += 1\n        else:\n            right -= 1\n    return max_water',
      explanation: 'Подход: двигаем указатель с меньшей высотой, так как ширина уменьшится в любом случае, а шанс увеличить объём есть только если высота вырастет.\nСложность: O(n) по времени, O(1) по памяти.\nСовет для интервью: докажи корректность: фиксируем меньший столбик (скажем левый). Если двигаем правый — текущий объём только уменьшится (высота ограничена левым, ширина уменьшилась). Значит оптимально двигать меньший.'
    },
    {
      id: 5,
      title: 'Ловля дождевой воды',
      type: 'practice',
      difficulty: 'hard',
      description: 'Дан массив высот столбиков. Найди сколько воды можно удержать после дождя. LeetCode #42.',
      requirements: [
        'Принимает список неотрицательных целых чисел',
        'Возвращает количество единиц воды',
        'Вода может быть удержана только между столбиками',
        'Оптимально: O(n) время и O(1) память'
      ],
      expectedOutput: 'Вход: height=[0,1,0,2,1,0,1,3,2,1,2,1]\nВыход: 6\nВход: height=[4,2,0,3,2,5]\nВыход: 9',
      hint: 'Два указателя. Вода в позиции i = min(max_left, max_right) - height[i]. Двигай указатель со стороны меньшего максимума: мы знаем точный объём воды для этой позиции.',
      solution: 'def trap(height):\n    left, right = 0, len(height) - 1\n    left_max = right_max = 0\n    water = 0\n\n    while left < right:\n        if height[left] < height[right]:\n            if height[left] >= left_max:\n                left_max = height[left]\n            else:\n                water += left_max - height[left]\n            left += 1\n        else:\n            if height[right] >= right_max:\n                right_max = height[right]\n            else:\n                water += right_max - height[right]\n            right -= 1\n\n    return water\n\n# Вариант через предвычисление (O(n) память)\ndef trapPrecompute(height):\n    n = len(height)\n    if not n:\n        return 0\n    left_max = [0] * n\n    right_max = [0] * n\n    left_max[0] = height[0]\n    for i in range(1, n):\n        left_max[i] = max(left_max[i-1], height[i])\n    right_max[n-1] = height[n-1]\n    for i in range(n-2, -1, -1):\n        right_max[i] = max(right_max[i+1], height[i])\n    return sum(min(left_max[i], right_max[i]) - height[i] for i in range(n))',
      explanation: 'Подход: для левого указателя, если height[left] меньше, мы знаем что max_right >= height[right] >= height[left], значит знаем точный уровень воды слева.\nСложность: O(n) по времени, O(1) памяти для двух указателей.\nСовет для интервью: сначала объясни O(n) памяти через предвычисление — это интуитивно понятно. Затем покажи оптимизацию до O(1). Это демонстрирует эволюцию решения.'
    },
    {
      id: 6,
      title: 'Удалить дубликаты из отсортированного массива',
      type: 'practice',
      difficulty: 'easy',
      description: 'Дан отсортированный массив nums. Удали дубликаты in-place. Верни k — количество уникальных элементов. Первые k элементов массива должны содержать уникальные значения. LeetCode #26.',
      requirements: [
        'Модифицирует массив in-place',
        'Возвращает k — количество уникальных элементов',
        'Первые k элементов должны быть уникальными в отсортированном порядке',
        'O(1) дополнительной памяти'
      ],
      expectedOutput: 'Вход: nums=[1,1,2]\nВыход: k=2, nums=[1,2,...]\nВход: nums=[0,0,1,1,1,2,2,3,3,4]\nВыход: k=5, nums=[0,1,2,3,4,...]',
      hint: 'Медленный указатель k отслеживает позицию для записи. Быстрый i перебирает массив. Если nums[i] != nums[k-1] — записываем на позицию k.',
      solution: 'def removeDuplicates(nums):\n    if not nums:\n        return 0\n    k = 1  # первый элемент всегда уникален\n    for i in range(1, len(nums)):\n        if nums[i] != nums[k - 1]:\n            nums[k] = nums[i]\n            k += 1\n    return k\n\n# Вариант с явными двумя указателями\ndef removeDuplicatesExplicit(nums):\n    slow = 0\n    for fast in range(len(nums)):\n        if fast == 0 or nums[fast] != nums[fast - 1]:\n            nums[slow] = nums[fast]\n            slow += 1\n    return slow',
      explanation: 'Подход: быстрый/медленный указатель. Медленный указывает на последнее уникальное значение.\nСложность: O(n) по времени, O(1) по памяти.\nСовет для интервью: паттерн "fast/slow pointers" применяется во многих задачах на месте (in-place): удаление элементов, перемещение нулей, и так далее.'
    },
    {
      id: 7,
      title: 'Переместить нули',
      type: 'practice',
      difficulty: 'easy',
      description: 'Дан массив nums. Переставь все нули в конец, сохранив относительный порядок ненулевых элементов. Выполни in-place без копирования массива. LeetCode #283.',
      requirements: [
        'Модифицирует массив in-place',
        'Нулевые элементы перемещаются в конец',
        'Относительный порядок ненулевых элементов сохраняется',
        'Минимизирует количество операций'
      ],
      expectedOutput: 'Вход: nums=[0,1,0,3,12]\nВыход: [1,3,12,0,0]\nВход: nums=[0]\nВыход: [0]',
      hint: 'Медленный указатель указывает на следующую позицию для ненулевого элемента. Когда находишь ненулевой — перемещай его в позицию slow, swap.',
      solution: 'def moveZeroes(nums):\n    slow = 0  # позиция для следующего ненулевого\n    for fast in range(len(nums)):\n        if nums[fast] != 0:\n            nums[slow], nums[fast] = nums[fast], nums[slow]\n            slow += 1\n\n# Вариант без swap (меньше записей)\ndef moveZeroesNoSwap(nums):\n    slow = 0\n    for fast in range(len(nums)):\n        if nums[fast] != 0:\n            nums[slow] = nums[fast]\n            slow += 1\n    # Заполняем остаток нулями\n    while slow < len(nums):\n        nums[slow] = 0\n        slow += 1',
      explanation: 'Подход: стандартный паттерн быстрый/медленный указатель. Swap минимизирует записи по сравнению с ручным заполнением нулями.\nСложность: O(n) по времени, O(1) по памяти.\nСовет для интервью: покажи оба варианта. Без swap делает меньше операций записи (важно для кеша). Swap проще объяснить.'
    },
    {
      id: 8,
      title: 'Сортировка цветов (Флаг Нидерландов)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан массив nums с элементами 0 (красный), 1 (белый), 2 (синий). Отсортируй его in-place так, чтобы одинаковые цвета стояли рядом, в порядке 0, 1, 2. Нельзя использовать sort(). LeetCode #75.',
      requirements: [
        'Единственный проход по массиву',
        'O(1) дополнительной памяти',
        'Не использует встроенную сортировку',
        'Три указателя: low, mid, high'
      ],
      expectedOutput: 'Вход: nums=[2,0,2,1,1,0]\nВыход: [0,0,1,1,2,2]\nВход: nums=[2,0,1]\nВыход: [0,1,2]',
      hint: 'Алгоритм Дейкстры (Dutch National Flag). Три указателя: low — граница 0s, mid — текущий, high — граница 2s. Если nums[mid]==0 — swap с low. Если nums[mid]==2 — swap с high. Если nums[mid]==1 — mid++.',
      solution: 'def sortColors(nums):\n    low = mid = 0\n    high = len(nums) - 1\n\n    while mid <= high:\n        if nums[mid] == 0:\n            nums[low], nums[mid] = nums[mid], nums[low]\n            low += 1\n            mid += 1\n        elif nums[mid] == 2:\n            nums[mid], nums[high] = nums[high], nums[mid]\n            high -= 1\n            # mid не увеличиваем: нужно проверить новый nums[mid]\n        else:  # nums[mid] == 1\n            mid += 1',
      explanation: 'Подход: алгоритм Дейкстры (Dutch National Flag). Инвариант: nums[0..low-1] = 0, nums[low..mid-1] = 1, nums[high+1..n-1] = 2.\nВажно: при swap с high не увеличиваем mid — мы не знаем что пришло с позиции high.\nСложность: O(n) по времени, O(1) по памяти, один проход.\nСовет для интервью: это алгоритм разбивки (partition) из QuickSort с тремя зонами вместо двух. Упомяни эту связь.'
    }
  ]
}
