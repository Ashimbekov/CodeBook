export default {
  id: 53,
  title: 'Практикум — Основы',
  description: 'Практические задачи по основам JavaScript: переменные, типы, операторы, условия, циклы и функции',
  lessons: [
    {
      id: 1,
      title: 'FizzBuzz',
      type: 'practice',
      difficulty: 'easy',
      description: 'Напишите функцию fizzBuzz(n): для чисел кратных 3 — "Fizz", кратных 5 — "Buzz", кратных и 3 и 5 — "FizzBuzz", иначе — само число. Верните массив от 1 до n.',
      requirements: [
        'fizzBuzz(15) -> ["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]',
        'fizzBuzz(1) -> ["1"]',
        'Используйте остаток от деления %'
      ],
      solution: {
        code: 'function fizzBuzz(n) {\n  const result = [];\n  for (let i = 1; i <= n; i++) {\n    if (i % 15 === 0) result.push("FizzBuzz");\n    else if (i % 3 === 0) result.push("Fizz");\n    else if (i % 5 === 0) result.push("Buzz");\n    else result.push(String(i));\n  }\n  return result;\n}\n\nconsole.log(fizzBuzz(15));',
        language: 'javascript'
      },
      explanation: 'Ключевой момент: проверять кратность 15 (и 3 и 5) нужно первой, иначе числа вроде 15 попадут в ветку Fizz или Buzz. Оператор % (остаток от деления) возвращает 0 когда число делится нацело. String(i) явно преобразует число в строку, что важно для единообразного типа элементов массива.'
    },
    {
      id: 2,
      title: 'Палиндром',
      type: 'practice',
      difficulty: 'easy',
      description: 'Напишите функцию isPalindrome(str): возвращает true если строка читается одинаково слева направо и справа налево. Игнорируйте регистр и пробелы.',
      requirements: [
        'isPalindrome("racecar") -> true',
        'isPalindrome("A man a plan a canal Panama") -> true (без пробелов)',
        'isPalindrome("hello") -> false',
        'Не используйте reverse() — реализуйте вручную'
      ],
      solution: {
        code: 'function isPalindrome(str) {\n  const cleaned = str.toLowerCase().replace(/\\s/g, "");\n  let left = 0;\n  let right = cleaned.length - 1;\n  while (left < right) {\n    if (cleaned[left] !== cleaned[right]) return false;\n    left++;\n    right--;\n  }\n  return true;\n}\n\nconsole.log(isPalindrome("racecar"));          // true\nconsole.log(isPalindrome("A man a plan a canal Panama")); // true\nconsole.log(isPalindrome("hello"));            // false',
        language: 'javascript'
      },
      explanation: 'Подход двух указателей: left движется слева направо, right — справа налево, сходясь к центру. Это O(n) по времени и O(1) по памяти. Нормализация через toLowerCase() и replace убирает пробелы и делает проверку нечувствительной к регистру. Если в любой момент символы не совпадают — строка не палиндром.'
    },
    {
      id: 3,
      title: 'Факториал',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реализуйте factorial(n) двумя способами: рекурсивно и итеративно. Обработайте граничные случаи: n=0, отрицательные числа.',
      requirements: [
        'factorial(0) -> 1',
        'factorial(5) -> 120',
        'factorial(-1) -> бросить Error("n должно быть >= 0")',
        'Реализуйте оба подхода: рекурсию и цикл'
      ],
      solution: {
        code: '// Рекурсивный\nfunction factorialRecursive(n) {\n  if (n < 0) throw new Error("n должно быть >= 0");\n  if (n === 0) return 1;\n  return n * factorialRecursive(n - 1);\n}\n\n// Итеративный\nfunction factorialIterative(n) {\n  if (n < 0) throw new Error("n должно быть >= 0");\n  let result = 1;\n  for (let i = 2; i <= n; i++) result *= i;\n  return result;\n}\n\nconsole.log(factorialRecursive(5)); // 120\nconsole.log(factorialIterative(5)); // 120\nconsole.log(factorialRecursive(0)); // 1',
        language: 'javascript'
      },
      explanation: 'Рекурсия — естественное описание факториала: n! = n * (n-1)!. Базовый случай — 0! = 1. Итеративная версия предпочтительнее в JavaScript из-за отсутствия оптимизации хвостовой рекурсии — при больших n рекурсия вызовет переполнение стека. Оба варианта начинают с проверки n < 0 чтобы выбросить ошибку для недопустимых входных данных.'
    },
    {
      id: 4,
      title: 'Анаграммы',
      type: 'practice',
      difficulty: 'easy',
      description: 'Функция isAnagram(str1, str2): определяет являются ли две строки анаграммами (составлены из одних и тех же букв в любом порядке).',
      requirements: [
        'isAnagram("listen", "silent") -> true',
        'isAnagram("hello", "world") -> false',
        'Нечувствительность к регистру: isAnagram("Listen", "Silent") -> true',
        'isAnagram("rat", "car") -> false'
      ],
      solution: {
        code: 'function isAnagram(str1, str2) {\n  const normalize = (s) => s.toLowerCase().split("").sort().join("");\n  return normalize(str1) === normalize(str2);\n}\n\n// Без sort — через Map\nfunction isAnagramMap(str1, str2) {\n  const s1 = str1.toLowerCase();\n  const s2 = str2.toLowerCase();\n  if (s1.length !== s2.length) return false;\n  const count = new Map();\n  for (const ch of s1) count.set(ch, (count.get(ch) || 0) + 1);\n  for (const ch of s2) {\n    if (!count.get(ch)) return false;\n    count.set(ch, count.get(ch) - 1);\n  }\n  return true;\n}\n\nconsole.log(isAnagram("listen", "silent")); // true\nconsole.log(isAnagram("hello", "world"));   // false',
        language: 'javascript'
      },
      explanation: 'Первый подход — сортировка букв: анаграммы дают одинаковую отсортированную строку. Это O(n log n). Второй подход через Map — O(n): подсчитываем частоту букв первой строки, затем уменьшаем счётчики по второй строке. Если хоть один счётчик станет нулём до конца или встретится незнакомая буква — строки не анаграммы. Проверка длин в начале ускоряет очевидные случаи.'
    },
    {
      id: 5,
      title: 'Числа Фибоначчи',
      type: 'practice',
      difficulty: 'easy',
      description: 'Напишите функцию fibonacci(n) возвращающую n-е число Фибоначчи. Реализуйте три версии: рекурсию, итерацию, мемоизацию.',
      requirements: [
        'fibonacci(0) -> 0, fibonacci(1) -> 1',
        'fibonacci(10) -> 55',
        'Рекурсия без мемо: O(2^n)',
        'Итеративная: O(n) время, O(1) память',
        'Мемоизированная: O(n) время и память'
      ],
      solution: {
        code: '// Итеративная (оптимальная)\nfunction fibonacci(n) {\n  if (n < 0) throw new Error("n >= 0");\n  if (n <= 1) return n;\n  let prev = 0, curr = 1;\n  for (let i = 2; i <= n; i++) {\n    [prev, curr] = [curr, prev + curr];\n  }\n  return curr;\n}\n\n// Мемоизированная\nconst fibMemo = (() => {\n  const cache = new Map([[0, 0], [1, 1]]);\n  return function fib(n) {\n    if (cache.has(n)) return cache.get(n);\n    const result = fib(n - 1) + fib(n - 2);\n    cache.set(n, result);\n    return result;\n  };\n})();\n\nconsole.log(fibonacci(10));  // 55\nconsole.log(fibMemo(50));    // 12586269025 (быстро)',
        language: 'javascript'
      },
      explanation: 'Наивная рекурсия fib(n) = fib(n-1) + fib(n-2) работает за O(2^n) — экспоненциально, так как повторно вычисляет одни и те же значения. Итеративный подход хранит только два последних числа (O(1) памяти) и работает за O(n). Мемоизация через Map кэширует уже вычисленные значения, превращая рекурсию в O(n) по времени. Деструктурирующее присваивание [prev, curr] = [curr, prev + curr] обновляет оба значения одновременно.'
    },
    {
      id: 6,
      title: 'Счётчик слов',
      type: 'practice',
      difficulty: 'easy',
      description: 'Функция wordCount(text): подсчитывает количество каждого слова в тексте. Возвращает объект { слово: количество }. Нечувствительно к регистру, игнорирует пунктуацию.',
      requirements: [
        'wordCount("hello world hello") -> { hello: 2, world: 1 }',
        'Нечувствительность к регистру: "Hello hello" -> { hello: 2 }',
        'Убрать пунктуацию: "hello, world!" -> { hello: 1, world: 1 }',
        'Вернуть отсортированный по количеству результат'
      ],
      solution: {
        code: 'function wordCount(text) {\n  const words = text.toLowerCase().replace(/[^a-zа-яё\\s]/gi, "").split(/\\s+/).filter(Boolean);\n  const count = words.reduce((acc, word) => {\n    acc[word] = (acc[word] || 0) + 1;\n    return acc;\n  }, {});\n  return count;\n}\n\nfunction wordCountSorted(text) {\n  const count = wordCount(text);\n  return Object.entries(count)\n    .sort((a, b) => b[1] - a[1])\n    .reduce((acc, [word, cnt]) => ({ ...acc, [word]: cnt }), {});\n}\n\nconst text = "hello world hello JavaScript world hello";\nconsole.log(wordCountSorted(text));\n// { hello: 3, world: 2, javascript: 1 }',
        language: 'javascript'
      },
      explanation: 'Регулярное выражение /[^a-zа-яё\\s]/gi удаляет всё кроме букв и пробелов — это покрывает латиницу и кириллицу. split(/\\s+/) разбивает по любым пробельным символам. filter(Boolean) убирает пустые строки от множественных пробелов. reduce строит объект-счётчик за один проход O(n). Для сортировки по частоте используем Object.entries + sort + Object.fromEntries — паттерн трансформации объектов.'
    },
    {
      id: 7,
      title: 'Валидатор данных',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте систему валидации объектов. validate(data, rules) проверяет объект по набору правил и возвращает массив ошибок.',
      requirements: [
        'rules: { field: [required, minLength(3), email] }',
        'Встроенные правила: required, email, minLength(n), maxLength(n), number, positive',
        'validate({name: "Al"}, {name: [required, minLength(3)]}) -> ["name: минимум 3 символа"]',
        'validate({email: "ok@ok.com"}, {email: [required, email]}) -> []',
        'Возвращать массив всех ошибок, не останавливаться на первой'
      ],
      solution: {
        code: 'const rules = {\n  required: (value) => (value !== undefined && value !== null && value !== "") || "поле обязательно",\n  email: (value) => !value || /\\S+@\\S+\\.\\S+/.test(value) || "некорректный email",\n  number: (value) => !value || !isNaN(Number(value)) || "должно быть числом",\n  positive: (value) => !value || Number(value) > 0 || "должно быть положительным",\n  minLength: (min) => (value) => !value || value.length >= min || `минимум ${min} символов`,\n  maxLength: (max) => (value) => !value || value.length <= max || `максимум ${max} символов`,\n};\n\nfunction validate(data, schema) {\n  const errors = [];\n  for (const [field, fieldRules] of Object.entries(schema)) {\n    for (const rule of fieldRules) {\n      const result = rule(data[field]);\n      if (result !== true) errors.push(`${field}: ${result}`);\n    }\n  }\n  return errors;\n}\n\nconst errors = validate(\n  { name: "Al", email: "not-email", age: -5 },\n  {\n    name: [rules.required, rules.minLength(3)],\n    email: [rules.required, rules.email],\n    age: [rules.number, rules.positive]\n  }\n);\nconsole.log(errors);\n// ["name: минимум 3 символа", "email: некорректный email", "age: должно быть положительным"]',
        language: 'javascript'
      },
      explanation: 'Каждое правило — функция: принимает значение, возвращает true или строку с ошибкой. minLength/maxLength — фабрики правил: возвращают функцию с замыканием над параметром. validate собирает все ошибки не останавливаясь на первой. Паттерн "правило возвращает true или сообщение об ошибке" позволяет добавлять новые правила без изменения логики валидации. Условие !value в большинстве правил означает "пропустить проверку для пустого поля" — это дополняет required.'
    },
    {
      id: 8,
      title: 'Числа в Roman',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напишите функцию toRoman(num): конвертирует целое число (1-3999) в римские цифры. И обратную: fromRoman(str).',
      requirements: [
        'toRoman(1) -> "I", toRoman(4) -> "IV", toRoman(9) -> "IX"',
        'toRoman(1994) -> "MCMXCIV"',
        'fromRoman("XIV") -> 14',
        'Обрабатывать числа 1-3999'
      ],
      solution: {
        code: 'function toRoman(num) {\n  const vals = [1000,900,500,400,100,90,50,40,10,9,5,4,1];\n  const syms = ["M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"];\n  let result = "";\n  for (let i = 0; i < vals.length; i++) {\n    while (num >= vals[i]) {\n      result += syms[i];\n      num -= vals[i];\n    }\n  }\n  return result;\n}\n\nfunction fromRoman(str) {\n  const map = { I:1, V:5, X:10, L:50, C:100, D:500, M:1000 };\n  return str.split("").reduce((acc, ch, i, arr) => {\n    const curr = map[ch];\n    const next = map[arr[i + 1]];\n    return acc + (next > curr ? -curr : curr);\n  }, 0);\n}\n\nconsole.log(toRoman(1994));   // "MCMXCIV"\nconsole.log(fromRoman("XIV")); // 14',
        language: 'javascript'
      },
      explanation: 'toRoman использует жадный алгоритм: берём наибольший символ который влезает в число и вычитаем его значение — повторяем до нуля. Важно включить субтрактивные пары (CM=900, CD=400, XC=90 и т.д.) в таблицу. fromRoman: правило вычитания — если следующий символ больше текущего, текущий вычитается, иначе прибавляется. Например IV: I(1) < V(5), поэтому -1 + 5 = 4.'
    },
    {
      id: 9,
      title: 'Генератор паролей',
      type: 'practice',
      difficulty: 'easy',
      description: 'Функция generatePassword(options): генерирует случайный пароль по заданным параметрам. Опции: length, uppercase, lowercase, numbers, symbols.',
      requirements: [
        'generatePassword({ length: 12, numbers: true, uppercase: true })',
        'generatePassword({ length: 8, symbols: true }) — включает !@#$%',
        'Гарантировать минимум по одному символу каждого типа если включён',
        'Перемешать символы случайно'
      ],
      solution: {
        code: 'function generatePassword({ length = 12, uppercase = true, lowercase = true, numbers = true, symbols = false } = {}) {\n  const sets = {\n    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",\n    lowercase: "abcdefghijklmnopqrstuvwxyz",\n    numbers: "0123456789",\n    symbols: "!@#$%^&*"\n  };\n\n  const enabled = Object.entries({ uppercase, lowercase, numbers, symbols })\n    .filter(([, v]) => v)\n    .map(([k]) => sets[k]);\n\n  if (!enabled.length) throw new Error("Хотя бы один тип символов должен быть включён");\n\n  const allChars = enabled.join("");\n  const required = enabled.map(set => set[Math.floor(Math.random() * set.length)]);\n  const remaining = Array.from({ length: length - required.length }, () =>\n    allChars[Math.floor(Math.random() * allChars.length)]\n  );\n\n  return [...required, ...remaining].sort(() => Math.random() - 0.5).join("");\n}\n\nconsole.log(generatePassword({ length: 16, symbols: true }));\nconsole.log(generatePassword({ length: 8, numbers: true, uppercase: false }));',
        language: 'javascript'
      },
      explanation: 'Деструктуризация параметров с дефолтными значениями — удобный способ принять опциональные настройки. Гарантия минимум одного символа каждого типа: сначала берём по одному символу из каждого включённого набора, затем дополняем до нужной длины. Финальное sort(() => Math.random() - 0.5) перемешивает символы случайно (алгоритм Фишера-Йейтса через sort — простой, но не криптографически стойкий вариант).'
    },
    {
      id: 10,
      title: 'Калькулятор',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте функциональный калькулятор с историей операций. Поддерживает: +, -, *, /, %, ** и историю последних 10 вычислений.',
      requirements: [
        'calc.evaluate("2 + 3 * 4") -> 14 (с приоритетом операторов)',
        'calc.history() -> массив последних 10 операций',
        'calc.clear() -> очистить историю',
        'Обработка деления на ноль',
        'Поддержка скобок — необязательно (бонус)'
      ],
      solution: {
        code: 'function createCalculator() {\n  const history = [];\n\n  const evaluate = (expression) => {\n    // Используем Function для парсинга выражения (только цифры и операторы)\n    const sanitized = expression.replace(/[^0-9+\\-*/.%()\\s]/g, "");\n    try {\n      // eslint-disable-next-line no-new-func\n      const result = new Function(`return (${sanitized})`)();\n      if (!isFinite(result)) throw new Error("Деление на ноль");\n      history.push({ expression, result, time: new Date().toISOString() });\n      if (history.length > 10) history.shift();\n      return result;\n    } catch (err) {\n      throw new Error(`Ошибка вычисления: ${err.message}`);\n    }\n  };\n\n  return {\n    evaluate,\n    history: () => [...history],\n    clear: () => { history.length = 0; }\n  };\n}\n\nconst calc = createCalculator();\nconsole.log(calc.evaluate("2 + 3 * 4")); // 14\nconsole.log(calc.evaluate("10 / 2"));    // 5\nconsole.log(calc.evaluate("2 ** 10"));   // 1024\nconsole.log(calc.history());',
        language: 'javascript'
      },
      explanation: 'Паттерн фабричной функции (closure): createCalculator возвращает объект с методами, которые имеют доступ к приватному массиву history через замыкание. Санитизация выражения через regex — мера безопасности перед передачей в new Function. history.length = 0 — стандартный способ очистить массив без создания нового. history: () => [...history] возвращает копию, предотвращая прямое изменение внутреннего состояния снаружи.'
    }
  ]
};
