export default {
  id: 18,
  title: 'Регулярные выражения',
  description: 'RegExp в JavaScript: создание паттернов, флаги, методы test/match/exec/replace, именованные группы, lookahead/lookbehind.',
  lessons: [
    {
      id: 1,
      title: 'Создание регулярных выражений',
      type: 'theory',
      content: [
        { type: 'text', value: 'Регулярное выражение (regex) — паттерн для поиска и замены текста. В JS создаётся двумя способами: литерал /паттерн/флаги или конструктор new RegExp(паттерн, флаги).' },
        { type: 'code', language: 'javascript', value: '// Литерал — компилируется при загрузке кода\nconst re1 = /hello/;\nconst re2 = /hello/gi; // флаги: g=global, i=ignore case\n\n// Конструктор — компилируется в runtime (для динамических паттернов)\nconst re3 = new RegExp("hello");\nconst re4 = new RegExp("hello", "gi");\n\n// Динамический паттерн (нельзя с литералом!)\nfunction createSearchRegex(term) {\n  return new RegExp(term, "gi");\n}\nconst search = createSearchRegex("JavaScript");\n\n// Флаги:\n// g — global: найти ВСЕ вхождения (не только первое)\n// i — ignore case: регистронезависимый поиск\n// m — multiline: ^ и $ работают для каждой строки\n// s — dotAll: . совпадает с \\n\n// u — unicode: поддержка Unicode\n// y — sticky: поиск только с lastIndex' },
        { type: 'heading', value: 'Основные метасимволы' },
        { type: 'code', language: 'javascript', value: '// Классы символов\n/\\d/   // цифра (0-9)\n/\\D/   // не цифра\n/\\w/   // слово (буква, цифра, _)\n/\\W/   // не слово\n/\\s/   // пробел (пробел, таб, \\n)\n/\\S/   // не пробел\n/./    // любой символ кроме \\n\n\n// Кванторы\n/a*/   // a — 0 или более раз\n/a+/   // a — 1 или более раз\n/a?/   // a — 0 или 1 раз\n/a{3}/ // a — ровно 3 раза\n/a{2,4}/ // a — от 2 до 4 раз\n\n// Якоря\n/^start/ // начало строки\n/end$/   // конец строки\n/\\bword\\b/ // граница слова' },
        { type: 'tip', value: 'При использовании new RegExp(str) нужно удваивать обратные слеши, потому что строка сама их обрабатывает: new RegExp("\\\\d+") = /\\d+/. С литералом /\\d+/ слеши удваивать не нужно.' }
      ]
    },
    {
      id: 2,
      title: 'Методы test, match, matchAll',
      type: 'theory',
      content: [
        { type: 'text', value: 'test() проверяет совпадение (true/false), match() возвращает совпадения, matchAll() возвращает итератор всех совпадений с группами.' },
        { type: 'code', language: 'javascript', value: '// test(str) — проверка, возвращает boolean\nconst emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;\nconsole.log(emailRegex.test("user@example.com")); // true\nconsole.log(emailRegex.test("invalid-email"));    // false\n\nconst phoneRegex = /^\\+7\\d{10}$/;\nconsole.log(phoneRegex.test("+79001234567")); // true\nconsole.log(phoneRegex.test("89001234567")); // false\n\n// match(regex) — возвращает массив совпадений\nconst text = "Цена: 150 руб, скидка: 30 руб, итого: 120 руб";\n\n// Без флага g — первое совпадение + информация\nconst first = text.match(/\\d+/);\nconsole.log(first[0]);    // "150"\nconsole.log(first.index); // 7 (позиция)\n\n// С флагом g — все совпадения (без позиций)\nconst all = text.match(/\\d+/g);\nconsole.log(all); // ["150", "30", "120"]' },
        { type: 'code', language: 'javascript', value: '// matchAll — все совпадения с группами\nconst data = "Jan 15, Feb 20, Mar 25";\nconst dateRegex = /(\\w{3}) (\\d{1,2})/g;\n\nfor (const match of data.matchAll(dateRegex)) {\n  console.log(match[0]); // всё совпадение: "Jan 15"\n  console.log(match[1]); // группа 1: "Jan"\n  console.log(match[2]); // группа 2: "15"\n  console.log(match.index); // позиция\n}\n\n// Или собрать в массив:\nconst matches = [...data.matchAll(dateRegex)];\nconsole.log(matches.length); // 3\nconsole.log(matches[0][1]);  // "Jan"' },
        { type: 'note', value: 'matchAll требует флаг g, иначе TypeError. match() с флагом g удобен для простого сбора всех совпадений, matchAll() — когда нужны группы захвата для каждого совпадения.' }
      ]
    },
    {
      id: 3,
      title: 'Метод exec и состояние lastIndex',
      type: 'theory',
      content: [
        { type: 'text', value: 'exec() выполняет поиск и возвращает информацию о первом совпадении. С флагом g запоминает позицию через lastIndex и при повторных вызовах продолжает поиск.' },
        { type: 'code', language: 'javascript', value: 'const re = /\\d+/g;\nconst str = "abc 123 def 456 ghi 789";\n\n// Первый вызов\nlet match = re.exec(str);\nconsole.log(match[0]);    // "123"\nconsole.log(re.lastIndex); // 7 (следующий поиск с позиции 7)\n\n// Второй вызов — продолжает с lastIndex\nmatch = re.exec(str);\nconsole.log(match[0]);    // "456"\nconsole.log(re.lastIndex); // 15\n\n// Третий вызов\nmatch = re.exec(str);\nconsole.log(match[0]);    // "789"\n\n// Четвёртый — ничего нет\nmatch = re.exec(str);\nconsole.log(match);       // null\nconsole.log(re.lastIndex); // 0 (сброшен!)\n\n// Цикл с exec\nconst regex = /\\b\\w{4}\\b/g; // 4-буквенные слова\nconst text = "this word test find long";\nlet m;\nwhile ((m = regex.exec(text)) !== null) {\n  console.log(`Найдено "${m[0]}" на позиции ${m.index}`);\n}' },
        { type: 'tip', value: 'Не вызывай один объект RegExp с флагом g в нескольких местах — lastIndex может вызвать непредсказуемое поведение. Создавай новый регекс или сбрасывай lastIndex = 0 перед каждым поиском.' }
      ]
    },
    {
      id: 4,
      title: 'Группы захвата и именованные группы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Группы захвата () позволяют извлекать части совпадения. Именованные группы (?<name>) дают группам имена для удобного доступа через groups.' },
        { type: 'code', language: 'javascript', value: '// Группы захвата ()\nconst dateStr = "2024-01-15";\nconst dateRegex = /(\\d{4})-(\\d{2})-(\\d{2})/;\nconst m = dateStr.match(dateRegex);\n\nconsole.log(m[0]); // "2024-01-15" (всё совпадение)\nconsole.log(m[1]); // "2024" (группа 1)\nconsole.log(m[2]); // "01"   (группа 2)\nconsole.log(m[3]); // "15"   (группа 3)\n\n// Именованные группы (?<name>)\nconst namedRegex = /(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})/;\nconst nm = dateStr.match(namedRegex);\n\nconsole.log(nm.groups.year);  // "2024"\nconsole.log(nm.groups.month); // "01"\nconsole.log(nm.groups.day);   // "15"\n\n// Деструктуризация groups\nconst { groups: { year, month, day } } = namedRegex.exec(dateStr);\nconsole.log(year, month, day); // 2024 01 15' },
        { type: 'code', language: 'javascript', value: '// Использование групп в replace()\nconst date = "15/01/2024";\n\n// Порядковые группы в замене: $1, $2, $3\nconst iso = date.replace(/(\\d{2})\\/(\\d{2})\\/(\\d{4})/, "$3-$2-$1");\nconsole.log(iso); // "2024-01-15"\n\n// Именованные группы в replace: $<name>\nconst iso2 = date.replace(\n  /(?<d>\\d{2})\\/(?<m>\\d{2})\\/(?<y>\\d{4})/,\n  "$<y>-$<m>-$<d>"\n);\nconsole.log(iso2); // "2024-01-15"\n\n// Незахватывающие группы (?:) — группируют без захвата\nconst re = /(?:Mr|Ms|Dr)\\.\\s(\\w+)/;\nconst r = "Dr. Smith".match(re);\nconsole.log(r[1]); // "Smith" (только фамилия, не "Dr.")' },
        { type: 'note', value: 'Незахватывающие группы (?:...) — когда нужна группировка для квантора или чередования, но не нужно захватывать значение. Они не занимают нумерацию групп.' }
      ]
    },
    {
      id: 5,
      title: 'Lookahead, lookbehind и другие паттерны',
      type: 'theory',
      content: [
        { type: 'text', value: 'Lookahead (?=...) и lookbehind (?<=...) — "проверки" вперёд/назад без включения в совпадение. Мощный инструмент для сложных паттернов.' },
        { type: 'code', language: 'javascript', value: '// Положительный lookahead (?=...) — "за которым следует"\n// Найти числа ПЕРЕД "руб"\n"100 руб и 200 EUR".match(/\\d+(?= руб)/g);\n// ["100"]\n\n// Отрицательный lookahead (?!...) — "за которым НЕ следует"\n"100 руб и 200 EUR".match(/\\d+(?! руб)/g);\n// ["200"]\n\n// Положительный lookbehind (?<=...) — "перед которым стоит"\n// Найти числа ПОСЛЕ "$"\n"$100 and $200".match(/(?<=\\$)\\d+/g);\n// ["100", "200"]\n\n// Отрицательный lookbehind (?<!...)\n"$100 and 200".match(/(?<!\\$)\\d+/g);\n// ["200"]' },
        { type: 'code', language: 'javascript', value: '// Чередование (|)\n/cat|dog/.test("I have a cat"); // true\n/cat|dog/.test("I have a dog"); // true\n/^(cat|dog)$/.test("cat");     // true\n\n// Паттерны из реальной жизни:\n\n// Валидация пароля (мин. 8 символов, буква, цифра, спецсимвол)\nconst passwordRe = /^(?=.*[A-Za-z])(?=.*\\d)(?=.*[!@#$%]).{8,}$/;\n\n// URL\nconst urlRe = /^https?:\\/\\/[\\w.-]+(?:\\/[\\w./?=%&-]*)?$/;\n\n// Российский телефон\nconst phoneRe = /^(?:\\+7|8)[\\s-]?\\(?\\d{3}\\)?[\\s-]?\\d{3}[\\s-]?\\d{2}[\\s-]?\\d{2}$/;\n\n// IP адрес\nconst ipRe = /^(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$/;' },
        { type: 'tip', value: 'Не пиши сложные regex без тестирования! Используй онлайн-инструменты: regex101.com, regexr.com. Они объясняют каждую часть и показывают совпадения в реальном времени.' }
      ]
    },
    {
      id: 6,
      title: 'replace с функцией и флаг d',
      type: 'theory',
      content: [
        { type: 'text', value: 'replace() с функцией-заменителем — самый мощный вариант: функция получает всё совпадение, группы, позицию и строку, и возвращает строку-замену.' },
        { type: 'code', language: 'javascript', value: '// replace(regex, function(match, p1, p2, ..., offset, string))\nconst text = "Привет, мой email: user@test.com и backup@mail.ru";\n\n// Маскировка email адресов\nconst masked = text.replace(\n  /([\\w.]+)@([\\w.]+)/g,\n  (match, user, domain) => `${user[0]}***@${domain}`\n);\nconsole.log(masked);\n// "Привет, мой email: u***@test.com и b***@mail.ru"\n\n// Конвертация camelCase в kebab-case\nfunction camelToKebab(str) {\n  return str.replace(/([A-Z])/g, (match, letter) => `-${letter.toLowerCase()}`);\n}\nconsole.log(camelToKebab("myVariableName")); // "my-variable-name"\nconsole.log(camelToKebab("backgroundColor")); // "background-color"\n\n// Форматирование числа с разделителями\nfunction formatNumber(n) {\n  return n.toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g, ",");\n}\nconsole.log(formatNumber(1234567)); // "1,234,567"' },
        { type: 'note', value: 'Флаг d (indices, ES2022) добавляет свойство indices к результату match/exec — массив с позициями [start, end] для каждой группы. Полезно для подсветки синтаксиса и редакторов.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: парсинг и валидация',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реши практические задачи используя регулярные выражения.',
      requirements: [
        'parseDate(str) — парсить дату "15.01.2024" или "2024-01-15" и вернуть { day, month, year }',
        'highlightWords(text, words) — обернуть найденные слова в <mark>слово</mark>',
        'extractLinks(html) — извлечь все href из HTML тегов <a>',
        'validatePassword(pwd) — минимум 8 символов, хотя бы 1 цифра и 1 буква'
      ],
      hint: 'parseDate: используй именованные группы. highlightWords: new RegExp(words.join("|"), "gi"). extractLinks: /href="([^"]+)"/g с matchAll.',
      solution: 'function parseDate(str) {\n  const fmt1 = /^(?<day>\\d{2})\\.(?<month>\\d{2})\\.(?<year>\\d{4})$/;\n  const fmt2 = /^(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})$/;\n  const m = str.match(fmt1) || str.match(fmt2);\n  if (!m) return null;\n  const { day, month, year } = m.groups;\n  return { day: +day, month: +month, year: +year };\n}\n\nfunction highlightWords(text, words) {\n  if (!words.length) return text;\n  const pattern = words.map(w => w.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&")).join("|");\n  return text.replace(new RegExp(`(${pattern})`, "gi"), "<mark>$1</mark>");\n}\n\nfunction extractLinks(html) {\n  const links = [];\n  for (const m of html.matchAll(/href="([^"]+)"/g)) {\n    links.push(m[1]);\n  }\n  return links;\n}\n\nfunction validatePassword(pwd) {\n  return /^(?=.*[A-Za-zА-Яа-я])(?=.*\\d).{8,}$/.test(pwd);\n}\n\nconsole.log(parseDate("15.01.2024")); // { day: 15, month: 1, year: 2024 }\nconsole.log(parseDate("2024-01-15")); // { day: 15, month: 1, year: 2024 }\n\nconst html = \'<a href="/home">Home</a> <a href="https://site.kz">Site</a>\';\nconsole.log(extractLinks(html)); // ["/home", "https://site.kz"]\n\nconsole.log(validatePassword("abc123")); // false (короткий)\nconsole.log(validatePassword("password")); // false (нет цифры)\nconsole.log(validatePassword("pass123!")); // true',
      explanation: 'parseDate использует именованные группы и две версии паттерна. highlightWords экранирует спецсимволы в словах через replace — безопасно при динамическом создании regex. extractLinks использует matchAll для итерации по всем href атрибутам. Lookahead в validatePassword проверяет наличие буквы И цифры.'
    }
  ]
}
