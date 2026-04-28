export default {
  id: 1,
  title: 'Подготовка к собеседованиям',
  description: 'Стратегия подготовки, нотация Big O, подходы к решению алгоритмических задач на собеседованиях.',
  lessons: [
    {
      id: 1,
      title: 'Как проходят алгоритмические собеседования',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Структура технического собеседования'
        },
        {
          type: 'text',
          value: 'Алгоритмическое собеседование в топовых IT-компаниях (FAANG, Яндекс, Тинькофф) обычно длится 45-60 минут. За это время вам нужно решить 1-2 задачи, объясняя свой ход мыслей вслух.'
        },
        {
          type: 'list',
          value: [
            'Первые 5 минут: знакомство, вопросы о вашем опыте',
            '5-10 минут: интервьюер описывает задачу, вы задаёте уточняющие вопросы',
            '20-30 минут: вы решаете задачу, пишете код',
            '5-10 минут: оптимизация решения, обсуждение edge cases',
            'Последние 5 минут: ваши вопросы интервьюеру'
          ]
        },
        {
          type: 'heading',
          value: 'Что оценивает интервьюер'
        },
        {
          type: 'list',
          value: [
            'Умение анализировать задачу и задавать правильные вопросы',
            'Знание алгоритмов и структур данных',
            'Качество кода: чистота, именование переменных, обработка edge cases',
            'Умение оценивать сложность (время и память)',
            'Коммуникация: объяснение хода мыслей вслух'
          ]
        },
        {
          type: 'tip',
          value: 'Всегда думайте вслух! Интервьюер хочет понять ваш процесс мышления. Молчание — худший враг на собеседовании.'
        }
      ]
    },
    {
      id: 2,
      title: 'Повторение Big O нотации',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Основные сложности'
        },
        {
          type: 'text',
          value: 'Big O описывает верхнюю границу роста времени/памяти алгоритма при увеличении входных данных. На собеседованиях вас почти всегда просят оценить сложность решения.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// O(1) — константная: доступ по индексу\nconst getFirst = (arr) => arr[0];\n\n// O(log n) — логарифмическая: бинарный поиск\nconst binarySearch = (arr, target) => {\n  let lo = 0, hi = arr.length - 1;\n  while (lo <= hi) {\n    const mid = (lo + hi) >> 1;\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) lo = mid + 1;\n    else hi = mid - 1;\n  }\n  return -1;\n};\n\n// O(n) — линейная: проход по массиву\nconst sum = (arr) => arr.reduce((a, b) => a + b, 0);\n\n// O(n log n) — сортировка\narr.sort((a, b) => a - b);\n\n// O(n^2) — вложенные циклы\nfor (let i = 0; i < n; i++)\n  for (let j = 0; j < n; j++) { /* ... */ }\n\n// O(2^n) — рекурсивный перебор подмножеств\n// O(n!) — перебор перестановок'
        },
        {
          type: 'heading',
          value: 'Сравнение для n = 1 000 000'
        },
        {
          type: 'list',
          value: [
            'O(1) — 1 операция',
            'O(log n) — ~20 операций',
            'O(n) — 1 000 000 операций',
            'O(n log n) — ~20 000 000 операций',
            'O(n^2) — 1 000 000 000 000 операций (слишком медленно!)',
            'O(2^n) — невозможно вычислить'
          ]
        },
        {
          type: 'note',
          value: 'Правило: если n до 10^4 — допустимо O(n^2). Если n до 10^5-10^6 — нужно O(n log n) или O(n). Если n до 10^9 — только O(log n) или O(1).'
        }
      ]
    },
    {
      id: 3,
      title: 'Фреймворк решения задач',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Пошаговый алгоритм решения любой задачи'
        },
        {
          type: 'text',
          value: 'Используйте этот фреймворк для каждой задачи на собеседовании. Он поможет структурировать мышление и не упустить важные детали.'
        },
        {
          type: 'list',
          value: [
            'Шаг 1: ПОНЯТЬ задачу — перескажите условие своими словами, задайте уточняющие вопросы',
            'Шаг 2: ПРИМЕРЫ — разберите 2-3 примера вручную, включая edge cases',
            'Шаг 3: BRUTE FORCE — опишите наивное решение, оцените его сложность',
            'Шаг 4: ОПТИМИЗАЦИЯ — подумайте, какой паттерн/структуру данных применить',
            'Шаг 5: КОД — напишите чистый код с понятными именами переменных',
            'Шаг 6: ТЕСТ — проверьте решение на примерах и edge cases'
          ]
        },
        {
          type: 'heading',
          value: 'Уточняющие вопросы (Шаг 1)'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Пример: "Найдите два числа в массиве, сумма которых равна target"\n// Уточняющие вопросы:\n// 1. Массив отсортирован? (если да — two pointers)\n// 2. Могут ли быть дубликаты? (влияет на подход)\n// 3. Всегда ли есть ответ? (нужна ли проверка)\n// 4. Что возвращать — индексы или значения?\n// 5. Могут ли быть отрицательные числа?\n// 6. Какой размер массива? (влияет на допустимую сложность)'
        },
        {
          type: 'heading',
          value: 'Паттерны для оптимизации (Шаг 4)'
        },
        {
          type: 'list',
          value: [
            'Нужно найти пару/тройку → Two Pointers или HashMap',
            'Подмассив/подстрока заданной длины → Sliding Window',
            'Отсортированные данные, поиск → Binary Search',
            'Перебор всех вариантов → Backtracking',
            'Перекрывающиеся подзадачи → Dynamic Programming',
            'Кратчайший путь, уровни → BFS',
            'Исследование всех путей → DFS',
            'Максимум/минимум с условием → Greedy'
          ]
        },
        {
          type: 'tip',
          value: 'Если вы застряли — озвучьте это: "Я вижу, что brute force будет O(n^2), давайте подумаю, как оптимизировать..." Интервьюер может дать подсказку.'
        }
      ]
    },
    {
      id: 4,
      title: 'Практика: оценка сложности',
      type: 'practice',
      difficulty: 'easy',
      description: 'Определите временную и пространственную сложность функций.',
      requirements: [
        'Определите Big O для каждой из приведённых функций',
        'Напишите функцию analyzeComplexity(n), которая демонстрирует разницу между O(n) и O(n^2)',
        'Функция должна возвращать объект { linear: count1, quadratic: count2 } с количеством операций'
      ],
      hint: 'Используйте счётчик операций внутри циклов. Для O(n) — один цикл, для O(n^2) — вложенный.',
      expectedOutput: 'analyzeComplexity(100) -> { linear: 100, quadratic: 10000 }\nanalyzeComplexity(1000) -> { linear: 1000, quadratic: 1000000 }',
      solution: 'function analyzeComplexity(n) {\n  let linearCount = 0;\n  let quadraticCount = 0;\n\n  // O(n) — линейный проход\n  for (let i = 0; i < n; i++) {\n    linearCount++;\n  }\n\n  // O(n^2) — вложенные циклы\n  for (let i = 0; i < n; i++) {\n    for (let j = 0; j < n; j++) {\n      quadraticCount++;\n    }\n  }\n\n  return { linear: linearCount, quadratic: quadraticCount };\n}\n\nconsole.log(analyzeComplexity(100));\n// { linear: 100, quadratic: 10000 }\n\nconsole.log(analyzeComplexity(1000));\n// { linear: 1000, quadratic: 1000000 }\n\n// Вывод: при n=1000 квадратичный алгоритм\n// делает в 1000 раз больше операций!',
      explanation: 'Линейный алгоритм O(n) делает n операций, квадратичный O(n^2) — n*n операций. При n=1000 разница в 1000 раз, при n=10^6 — в миллион раз. Поэтому на собеседованиях так важно оптимизировать решения.'
    },
    {
      id: 5,
      title: 'Практика: решение задачи по фреймворку',
      type: 'practice',
      difficulty: 'easy',
      description: 'Примените фреймворк решения задач к классической задаче: найти, содержит ли массив дубликаты.',
      requirements: [
        'Реализуйте функцию containsDuplicate(nums)',
        'Верните true, если в массиве есть хотя бы один повторяющийся элемент',
        'Верните false, если все элементы уникальны',
        'Реализуйте два варианта: brute force O(n^2) и оптимальный O(n) с Set'
      ],
      hint: 'Brute force: два вложенных цикла, сравнить каждую пару. Оптимально: добавлять в Set и проверять, не встречался ли элемент ранее.',
      expectedOutput: 'containsDuplicate([1,2,3,1]) -> true\ncontainsDuplicate([1,2,3,4]) -> false\ncontainsDuplicate([1,1,1,3,3,4,3,2,4,2]) -> true',
      solution: '// Brute Force — O(n^2) время, O(1) память\nfunction containsDuplicateBrute(nums) {\n  for (let i = 0; i < nums.length; i++) {\n    for (let j = i + 1; j < nums.length; j++) {\n      if (nums[i] === nums[j]) return true;\n    }\n  }\n  return false;\n}\n\n// Оптимальное решение — O(n) время, O(n) память\nfunction containsDuplicate(nums) {\n  const seen = new Set();\n  for (const num of nums) {\n    if (seen.has(num)) return true;\n    seen.add(num);\n  }\n  return false;\n}\n\n// Альтернатива: сравнить размер Set с длиной массива\nfunction containsDuplicateOneLiner(nums) {\n  return new Set(nums).size !== nums.length;\n}\n\nconsole.log(containsDuplicate([1,2,3,1])); // true\nconsole.log(containsDuplicate([1,2,3,4])); // false',
      explanation: 'Это классическая задача LeetCode #217. Brute force сравнивает каждую пару — O(n^2). Оптимальное решение использует Set для запоминания уже встреченных элементов — O(n) по времени и O(n) по памяти. На собеседовании покажите оба варианта и объясните trade-off между временем и памятью.'
    },
    {
      id: 6,
      title: 'Практика: стратегия решения с edge cases',
      type: 'practice',
      difficulty: 'medium',
      description: 'Решите задачу Valid Anagram (LeetCode #242): проверьте, является ли одна строка анаграммой другой.',
      requirements: [
        'Реализуйте функцию isAnagram(s, t)',
        'Верните true, если t является анаграммой s',
        'Анаграмма — это слово, составленное из тех же букв в другом порядке',
        'Учтите edge cases: пустые строки, разная длина, одинаковые строки',
        'Реализуйте решение за O(n) с HashMap'
      ],
      hint: 'Подсчитайте частоту каждой буквы в первой строке, затем вычтите частоту каждой буквы второй строки. Если все счётчики равны 0 — анаграмма.',
      expectedOutput: 'isAnagram("anagram", "nagaram") -> true\nisAnagram("rat", "car") -> false\nisAnagram("", "") -> true\nisAnagram("a", "ab") -> false',
      solution: '// Решение с HashMap — O(n) время, O(1) память (алфавит фиксирован)\nfunction isAnagram(s, t) {\n  if (s.length !== t.length) return false;\n\n  const count = {};\n\n  for (const ch of s) {\n    count[ch] = (count[ch] || 0) + 1;\n  }\n\n  for (const ch of t) {\n    if (!count[ch]) return false;\n    count[ch]--;\n  }\n\n  return true;\n}\n\n// Альтернатива: сортировка — O(n log n)\nfunction isAnagramSort(s, t) {\n  if (s.length !== t.length) return false;\n  return [...s].sort().join(\'\') === [...t].sort().join(\'\');\n}\n\n// Python-стиль с Counter (для собеседования на Python)\n// from collections import Counter\n// def isAnagram(s, t):\n//     return Counter(s) == Counter(t)\n\nconsole.log(isAnagram("anagram", "nagaram")); // true\nconsole.log(isAnagram("rat", "car")); // false\nconsole.log(isAnagram("", "")); // true',
      explanation: 'Ключевой инсайт: анаграммы содержат одинаковые буквы с одинаковой частотой. Самая частая ошибка — забыть проверку длины в начале. Решение через HashMap работает за O(n) с O(1) дополнительной памяти (так как алфавит ограничен 26 буквами). На собеседовании начните с проверки длины — это сразу покажет, что вы думаете о edge cases.'
    }
  ]
}
