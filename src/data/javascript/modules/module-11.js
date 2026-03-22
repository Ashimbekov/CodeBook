export default {
  id: 11,
  title: 'Строки',
  description: 'Template literals, методы строк, slice, padStart/padEnd — всё для работы с текстом в современном JavaScript.',
  lessons: [
    {
      id: 1,
      title: 'Template literals — шаблонные строки',
      type: 'theory',
      content: [
        { type: 'text', value: 'Template literals (шаблонные литералы) — это строки в обратных кавычках (`). Они позволяют вставлять переменные прямо внутрь строки через ${}, писать многострочный текст без \\n и вызывать выражения.' },
        { type: 'heading', value: 'Базовый синтаксис' },
        { type: 'code', language: 'javascript', value: 'const name = "Алия";\nconst age = 25;\n\n// Старый способ (конкатенация)\nconst old = "Привет, " + name + "! Тебе " + age + " лет.";\n\n// Template literal\nconst modern = `Привет, ${name}! Тебе ${age} лет.`;\n\nconsole.log(modern); // Привет, Алия! Тебе 25 лет.\n\n// Выражения внутри ${}\nconst a = 10, b = 5;\nconsole.log(`Сумма: ${a + b}`);       // Сумма: 15\nconsole.log(`Больший: ${a > b ? a : b}`); // Больший: 10\nconsole.log(`Квадрат: ${a ** 2}`);    // Квадрат: 100' },
        { type: 'heading', value: 'Многострочные строки' },
        { type: 'code', language: 'javascript', value: '// Многострочный текст БЕЗ \\n\nconst message = `Уважаемый пользователь,\n\nВаш заказ #12345 принят.\nОжидайте доставку в течение 3 дней.\n\nСпасибо!`;\n\nconsole.log(message);\n// Вывод сохраняет все переносы строк' },
        { type: 'tip', value: 'Внутри ${} можно вызывать функции, методы, писать любые выражения. Например: `${arr.join(", ")}`, `${obj.name.toUpperCase()}`, `${Math.random().toFixed(2)}`.' }
      ]
    },
    {
      id: 2,
      title: 'Tagged templates — теговые шаблоны',
      type: 'theory',
      content: [
        { type: 'text', value: 'Tagged templates — продвинутая возможность: перед шаблонной строкой ставится функция-тег. Она получает массив частей строки и отдельно все значения ${}, и может обрабатывать их по-своему.' },
        { type: 'code', language: 'javascript', value: '// Функция-тег получает: strings[] и ...values\nfunction highlight(strings, ...values) {\n  return strings.reduce((result, str, i) => {\n    const value = values[i] !== undefined\n      ? `[${values[i]}]`\n      : "";\n    return result + str + value;\n  }, "");\n}\n\nconst name = "Нурдаулет";\nconst score = 95;\n\nconst result = highlight`Студент ${name} набрал ${score} баллов!`;\nconsole.log(result);\n// Студент [Нурдаулет] набрал [95] баллов!' },
        { type: 'heading', value: 'String.raw — сырые строки' },
        { type: 'code', language: 'javascript', value: '// String.raw — встроенный тег, отключает escape-последовательности\nconst path = String.raw`C:\\Users\\Admin\\Documents`;\nconsole.log(path); // C:\\Users\\Admin\\Documents (слеши НЕ экранируются)\n\n// Обычная строка:\nconst normal = "C:\\\\Users\\\\Admin";\nconsole.log(normal); // C:\\Users\\Admin\n\n// Полезно для regex-паттернов и путей Windows' },
        { type: 'note', value: 'Tagged templates используются в популярных библиотеках: css-in-js (styled-components), GraphQL запросы (gql``), SQL (sql``), html-шаблоны. Это мощный механизм для DSL (Domain Specific Languages) внутри JS.' }
      ]
    },
    {
      id: 3,
      title: 'Методы поиска: includes, startsWith, endsWith, indexOf',
      type: 'theory',
      content: [
        { type: 'text', value: 'JavaScript предоставляет удобные методы для поиска подстрок. Они возвращают true/false (includes, startsWith, endsWith) или индекс (indexOf, lastIndexOf).' },
        { type: 'code', language: 'javascript', value: 'const text = "JavaScript — это круто!";\n\n// includes — есть ли подстрока?\nconsole.log(text.includes("круто"));     // true\nconsole.log(text.includes("Java", 2));   // false (поиск с позиции 2)\n\n// startsWith / endsWith\nconsole.log(text.startsWith("Java"));    // true\nconsole.log(text.startsWith("Script", 4)); // true (с позиции 4)\nconsole.log(text.endsWith("!"));         // true\nconsole.log(text.endsWith("круто", 22)); // true (в первых 22 символах)\n\n// indexOf / lastIndexOf\nconsole.log(text.indexOf("а"));          // 1\nconsole.log(text.lastIndexOf("а"));      // 19\nconsole.log(text.indexOf("нет"));        // -1 (не найдено)' },
        { type: 'heading', value: 'Практическое применение' },
        { type: 'code', language: 'javascript', value: 'const email = "user@example.com";\nconst url = "https://site.kz/page";\n\n// Проверка формата email\nif (email.includes("@") && email.includes(".")) {\n  console.log("Email корректен");\n}\n\n// Проверка протокола\nif (url.startsWith("https://")) {\n  console.log("Безопасное соединение");\n}\n\n// Проверка расширения файла\nfunction isImage(filename) {\n  return filename.endsWith(".jpg") ||\n         filename.endsWith(".png") ||\n         filename.endsWith(".webp");\n}\n\nconsole.log(isImage("photo.jpg"));  // true\nconsole.log(isImage("data.json")); // false' },
        { type: 'tip', value: 'includes() — читабельнее, чем indexOf() !== -1. Используй includes() для проверки существования, indexOf() — когда нужна позиция.' }
      ]
    },
    {
      id: 4,
      title: 'Обрезка и замена: slice, substring, replace, replaceAll',
      type: 'theory',
      content: [
        { type: 'text', value: 'slice() и substring() извлекают часть строки. replace() и replaceAll() заменяют подстроки. Эти методы не изменяют исходную строку — возвращают новую.' },
        { type: 'heading', value: 'slice vs substring' },
        { type: 'code', language: 'javascript', value: 'const str = "Hello, World!";\n//           0123456789...\n\n// slice(start, end) — поддерживает отрицательные индексы\nconsole.log(str.slice(0, 5));   // "Hello"\nconsole.log(str.slice(7));      // "World!" (до конца)\nconsole.log(str.slice(-6));     // "World!" (с конца)\nconsole.log(str.slice(-6, -1)); // "World"\nconsole.log(str.slice(5, 0));   // "" (если start > end — пустая)\n\n// substring(start, end) — отрицательные = 0, меняет местами если start > end\nconsole.log(str.substring(0, 5));  // "Hello"\nconsole.log(str.substring(5, 0));  // "Hello" (поменял местами!)\nconsole.log(str.substring(-3));    // "Hello, World!" (отрицательный = 0)' },
        { type: 'heading', value: 'replace и replaceAll' },
        { type: 'code', language: 'javascript', value: 'const text = "Мой кот ест рыбу. Кот доволен.";\n\n// replace — заменяет ПЕРВОЕ вхождение\nconsole.log(text.replace("Кот", "Пёс"));\n// "Мой кот ест рыбу. Пёс доволен." (только второе "Кот" с большой буквы)\n\n// replaceAll — заменяет ВСЕ вхождения\nconsole.log(text.replaceAll("кот", "пёс"));\n// "Мой пёс ест рыбу. Кот доволен." (только строчные)\n\n// С регулярным выражением (флаг g = global, i = ignore case)\nconsole.log(text.replace(/кот/gi, "пёс"));\n// "Мой пёс ест рыбу. пёс доволен." — ВСЕ вхождения без учёта регистра\n\n// replace с функцией — мощная замена\nconst result = "цена: 100 руб, скидка: 20 руб".replace(/\\d+/g, n => n * 2);\nconsole.log(result); // "цена: 200 руб, скидка: 40 руб"' },
        { type: 'tip', value: 'Предпочитай slice() вместо substring() — он предсказуемее и поддерживает отрицательные индексы. substring() меняет местами аргументы при start > end, что может запутать.' }
      ]
    },
    {
      id: 5,
      title: 'padStart, padEnd, repeat, trim',
      type: 'theory',
      content: [
        { type: 'text', value: 'padStart и padEnd дополняют строку до нужной длины, repeat повторяет строку, trim удаляет пробелы. Эти методы незаменимы для форматирования вывода.' },
        { type: 'code', language: 'javascript', value: '// padStart(targetLength, padString) — дополняет СЛЕВА\nconsole.log("5".padStart(3, "0"));        // "005"\nconsole.log("42".padStart(6, "0"));       // "000042"\nconsole.log("hi".padStart(10));           // "        hi" (пробелы)\nconsole.log("hi".padStart(10, "abc"));    // "abcabcabhi"\n\n// padEnd(targetLength, padString) — дополняет СПРАВА\nconsole.log("5".padEnd(3, "0"));          // "500"\nconsole.log("Error".padEnd(20, "."));     // "Error..............."\n\n// Форматирование таблицы\nconst items = [["Яблоко", "15"], ["Груша", "8"], ["Банан", "23"]];\nfor (const [name, qty] of items) {\n  console.log(`${name.padEnd(10)} ${qty.padStart(4)} шт.`);\n}\n// Яблоко        15 шт.\n// Груша          8 шт.\n// Банан         23 шт.' },
        { type: 'heading', value: 'repeat и trim' },
        { type: 'code', language: 'javascript', value: '// repeat(n) — повторяет строку n раз\nconsole.log("ha".repeat(3));    // "hahaha"\nconsole.log("-".repeat(20));    // "--------------------"\nconsole.log("ab".repeat(0));    // ""\n\n// trim / trimStart / trimEnd — убирает пробелы\nconst input = "  Привет, мир!  ";\nconsole.log(input.trim());       // "Привет, мир!"\nconsole.log(input.trimStart());  // "Привет, мир!  "\nconsole.log(input.trimEnd());    // "  Привет, мир!"\n\n// Практика: нормализация ввода пользователя\nfunction normalizeInput(str) {\n  return str.trim().toLowerCase().replace(/\\s+/g, " ");\n}\n\nconsole.log(normalizeInput("  Алия   Жакупова  "));\n// "алия жакупова"' },
        { type: 'note', value: 'padStart часто используют для форматирования чисел (ведущие нули в датах: "7".padStart(2,"0") = "07"), времени и красивого вывода в консоль.' }
      ]
    },
    {
      id: 6,
      title: 'split, join, at, charCodeAt',
      type: 'theory',
      content: [
        { type: 'text', value: 'split() разбивает строку в массив, join() собирает массив в строку. at() — современный аналог [], поддерживающий отрицательные индексы. charCodeAt() возвращает Unicode-код символа.' },
        { type: 'code', language: 'javascript', value: '// split(separator, limit) — строка -> массив\nconst csv = "Алматы,Астана,Шымкент";\nconsole.log(csv.split(","));\n// ["Алматы", "Астана", "Шымкент"]\n\nconst sentence = "Я люблю JavaScript";\nconsole.log(sentence.split(" "));\n// ["Я", "люблю", "JavaScript"]\n\nconsole.log("hello".split(""));  // ["h","e","l","l","o"]\nconsole.log("a,b,c".split(",", 2)); // ["a", "b"] (ограничение 2)\n\n// join(separator) — массив -> строка\nconst words = ["Hello", "World"];\nconsole.log(words.join(" "));  // "Hello World"\nconsole.log(words.join("-"));  // "Hello-World"\nconsole.log(words.join(""));   // "HelloWorld"\n\n// split + join = мощная замена\nconst result = "один два три".split(" ").join("-");\nconsole.log(result); // "один-два-три"' },
        { type: 'heading', value: 'at() и charCodeAt()' },
        { type: 'code', language: 'javascript', value: 'const str = "JavaScript";\n\n// at(index) — поддерживает отрицательные индексы\nconsole.log(str.at(0));   // "J"\nconsole.log(str.at(-1));  // "t" (последний символ)\nconsole.log(str.at(-2));  // "p" (предпоследний)\n\n// str[index] — НЕ поддерживает отрицательные:\nconsole.log(str[-1]);     // undefined (не работает!)\n\n// charCodeAt / fromCharCode\nconsole.log("A".charCodeAt(0));     // 65\nconsole.log("а".charCodeAt(0));     // 1072 (кириллица)\nconsole.log(String.fromCharCode(65)); // "A"\n\n// Практика: сдвиг шифра Цезаря\nfunction caesarChar(char, shift) {\n  const code = char.charCodeAt(0);\n  return String.fromCharCode(code + shift);\n}\nconsole.log(caesarChar("A", 3)); // "D"' },
        { type: 'tip', value: 'Метод at(-1) — элегантный способ получить последний символ. До ES2022 писали str[str.length - 1]. Теперь просто str.at(-1). Работает и для массивов!' }
      ]
    },
    {
      id: 7,
      title: 'Практика: форматирование и парсинг строк',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напиши функции для работы со строками: форматирование имени, парсинг CSV-строки и маскировка карты.',
      requirements: [
        'formatName(str) — принимает "иванов иван иванович", возвращает "Иванов И.И." (фамилия + инициалы)',
        'parseCSV(line) — принимает "Алма,25,Алматы", возвращает объект { name, age, city }',
        'maskCard(number) — принимает "4111111111111111", возвращает "**** **** **** 1111"',
        'truncate(str, maxLen) — обрезает строку до maxLen символов, добавляет "..." если обрезана'
      ],
      hint: 'Для formatName: split(" ") -> деструктуризация -> charAt(0).toUpperCase(). Для maskCard: slice(-4), padStart или replaceAll.',
      solution: 'function formatName(str) {\n  const parts = str.trim().toLowerCase().split(" ");\n  const [last, first, middle] = parts;\n  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);\n  const initials = `${first.charAt(0).toUpperCase()}.${middle ? middle.charAt(0).toUpperCase() + "." : ""}`;\n  return `${cap(last)} ${initials}`;\n}\n\nfunction parseCSV(line) {\n  const [name, age, city] = line.split(",");\n  return { name: name.trim(), age: Number(age.trim()), city: city.trim() };\n}\n\nfunction maskCard(number) {\n  const last4 = number.slice(-4);\n  return `**** **** **** ${last4}`;\n}\n\nfunction truncate(str, maxLen) {\n  if (str.length <= maxLen) return str;\n  return str.slice(0, maxLen - 3) + "...";\n}\n\nconsole.log(formatName("иванов иван иванович")); // "Иванов И.И."\nconsole.log(parseCSV("Алма,25,Алматы")); // { name: "Алма", age: 25, city: "Алматы" }\nconsole.log(maskCard("4111111111111111")); // "**** **** **** 1111"\nconsole.log(truncate("Длинный текст для обрезки", 15)); // "Длинный текст ..."',
      explanation: 'formatName использует split + деструктуризацию + charAt. parseCSV — split по запятой + Number(). maskCard — slice(-4) берёт последние 4 цифры. truncate проверяет длину перед обрезкой и добавляет "...".'
    }
  ]
}
