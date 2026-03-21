export default {
  id: 40,
  title: 'Регулярные выражения',
  description: 'Паттерны для поиска и обработки текста: Pattern, Matcher, классы символов, квантификаторы, группы и методы String',
  lessons: [
    {
      id: 1,
      title: 'Что такое регулярные выражения?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Регулярные выражения (regex) — это шаблоны для поиска текста. Они позволяют искать, проверять и заменять текст по сложным правилам.' },
        { type: 'tip', value: 'Представь что ты ищешь номера телефонов в большом тексте. Вручную это займёт часы. Регулярное выражение "\\d{3}-\\d{2}-\\d{2}" найдёт все телефоны в одну секунду — это шаблон: "три цифры, дефис, две цифры, дефис, две цифры".' },
        { type: 'heading', value: 'Pattern и Matcher' },
        { type: 'code', language: 'java', value: 'import java.util.regex.*;\n\n// Шаг 1: Скомпилировать паттерн\nPattern pattern = Pattern.compile("hello");\n\n// Шаг 2: Создать Matcher для текста\nMatcher matcher = pattern.matcher("Say hello to the world!");\n\n// Шаг 3: Использовать\nif (matcher.find()) {\n    System.out.println("Найдено!");\n    System.out.println("Позиция: " + matcher.start()); // 4\n    System.out.println("Текст: " + matcher.group());   // hello\n}' },
        { type: 'heading', value: 'Найти все вхождения' },
        { type: 'code', language: 'java', value: 'Pattern p = Pattern.compile("\\\\d+"); // одна или более цифр\nMatcher m = p.matcher("Мне 25 лет, живу в доме 42 на улице 7");\n\n// find() ищет следующее совпадение\nwhile (m.find()) {\n    System.out.println("Число: " + m.group() + " (позиция " + m.start() + ")");\n}\n// Число: 25 (позиция 3)\n// Число: 42 (позиция 22)\n// Число: 7 (позиция 35)' },
        { type: 'heading', value: 'matches() vs find()' },
        { type: 'code', language: 'java', value: 'Pattern p = Pattern.compile("\\\\d+");\n\n// matches() — весь текст должен соответствовать паттерну\nSystem.out.println(p.matcher("12345").matches()); // true\nSystem.out.println(p.matcher("123abc").matches()); // false\n\n// find() — найти где-нибудь внутри текста\nSystem.out.println(p.matcher("abc123def").find()); // true' },
        { type: 'note', value: 'В Java строках обратный слеш нужно удваивать: \\\\d означает регулярное выражение \\d. Это потому что \\ — специальный символ в Java строках.' }
      ]
    },
    {
      id: 2,
      title: 'Классы символов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Классы символов — специальные обозначения групп символов. Вместо "a или b или c или..." пишем класс.' },
        { type: 'heading', value: 'Встроенные классы символов' },
        { type: 'list', items: [
          '\\d — цифра (0-9), \\D — не цифра',
          '\\w — буква, цифра или _ (word char), \\W — не word char',
          '\\s — пробел, табуляция, перенос строки, \\S — не пробел',
          '. — любой символ кроме новой строки',
          '\\b — граница слова, \\B — не граница'
        ]},
        { type: 'code', language: 'java', value: 'String text = "Телефон: +7(777)123-45-67";\n\n// Найти все цифры\nPattern digits = Pattern.compile("\\\\d");\nMatcher m = digits.matcher(text);\nint count = 0;\nwhile (m.find()) count++;\nSystem.out.println("Цифр: " + count); // 11\n\n// Найти первое слово\nPattern word = Pattern.compile("\\\\w+");\nMatcher mw = word.matcher("Hello World!");\nif (mw.find()) System.out.println(mw.group()); // Hello' },
        { type: 'heading', value: 'Квадратные скобки — свой класс' },
        { type: 'code', language: 'java', value: '// [abc] — один из символов a, b или c\nPattern vowels = Pattern.compile("[аеёиоуыьъэюя]");\nMatcher mv = vowels.matcher("привет");\nint vowelCount = 0;\nwhile (mv.find()) vowelCount++;\nSystem.out.println("Гласных: " + vowelCount); // 2 (и, е)\n\n// [a-z] — диапазон от a до z\nPattern lower = Pattern.compile("[a-z]+");\n\n// [^abc] — НЕ один из этих символов\nPattern notDigit = Pattern.compile("[^\\\\d]+");\n\n// [a-zA-Z] — все буквы (латинские)\nPattern letter = Pattern.compile("[a-zA-Z]+");' },
        { type: 'heading', value: 'Точка и экранирование' },
        { type: 'code', language: 'java', value: '// . означает ЛЮБОЙ символ\nPattern anyChar = Pattern.compile("a.c");\nSystem.out.println(anyChar.matcher("abc").matches()); // true\nSystem.out.println(anyChar.matcher("a1c").matches()); // true\nSystem.out.println(anyChar.matcher("ac").matches());  // false (нет среднего)\n\n// \\. означает буквальную точку\nPattern domain = Pattern.compile("\\\\w+\\\\.ru");\nSystem.out.println(domain.matcher("site.ru").matches()); // true\nSystem.out.println(domain.matcher("siteru").matches());  // false' }
      ]
    },
    {
      id: 3,
      title: 'Квантификаторы — количество повторений',
      type: 'theory',
      content: [
        { type: 'text', value: 'Квантификаторы указывают сколько раз может повторяться предыдущий символ или группа.' },
        { type: 'list', items: [
          '* — ноль или более раз',
          '+ — один или более раз',
          '? — ноль или один раз (необязательный)',
          '{n} — ровно n раз',
          '{n,} — n или более раз',
          '{n,m} — от n до m раз'
        ]},
        { type: 'code', language: 'java', value: '// + один или более\nPattern oneOrMore = Pattern.compile("\\\\d+");\nSystem.out.println(oneOrMore.matcher("123").matches());  // true\nSystem.out.println(oneOrMore.matcher("").matches());     // false\n\n// * ноль или более\nPattern zeroOrMore = Pattern.compile("\\\\d*");\nSystem.out.println(zeroOrMore.matcher("").matches());    // true\nSystem.out.println(zeroOrMore.matcher("999").matches()); // true\n\n// ? необязательный (0 или 1)\nPattern optional = Pattern.compile("colou?r"); // u — необязательная\nSystem.out.println(optional.matcher("color").matches());  // true (american)\nSystem.out.println(optional.matcher("colour").matches()); // true (british)' },
        { type: 'heading', value: 'Точное количество' },
        { type: 'code', language: 'java', value: '// Телефонный номер формата XXX-XX-XX\nPattern phone = Pattern.compile("\\\\d{3}-\\\\d{2}-\\\\d{2}");\nSystem.out.println(phone.matcher("123-45-67").matches()); // true\nSystem.out.println(phone.matcher("12-45-67").matches());  // false\n\n// Пароль: минимум 8, максимум 20 символов\nPattern password = Pattern.compile("\\\\w{8,20}");\nSystem.out.println(password.matcher("mypass123").matches());  // true\nSystem.out.println(password.matcher("weak").matches());       // false' },
        { type: 'heading', value: 'Жадные и ленивые квантификаторы' },
        { type: 'code', language: 'java', value: 'String html = "<b>жирный</b> и <i>курсив</i>";\n\n// Жадный (greedy) — захватывает как можно больше\nPattern greedy = Pattern.compile("<.*>");\nMatcher mg = greedy.matcher(html);\nif (mg.find()) System.out.println(mg.group());\n// <b>жирный</b> и <i>курсив</i> — захватил всё!\n\n// Ленивый (lazy) — захватывает как можно меньше\nPattern lazy = Pattern.compile("<.*?>");\nMatcher ml = lazy.matcher(html);\nwhile (ml.find()) System.out.println(ml.group());\n// <b>\n// </b>\n// <i>\n// </i>' }
      ]
    },
    {
      id: 4,
      title: 'Группы — захват части текста',
      type: 'theory',
      content: [
        { type: 'text', value: 'Группы () позволяют выделить части совпадения. После match можно получить каждую группу отдельно.' },
        { type: 'code', language: 'java', value: '// Парсим дату формата DD.MM.YYYY\nPattern datePattern = Pattern.compile("(\\\\d{2})\\\\.(\\\\d{2})\\\\.(\\\\d{4})");\nMatcher m = datePattern.matcher("Дата рождения: 15.06.2000");\n\nif (m.find()) {\n    System.out.println("Вся дата: " + m.group(0));  // 15.06.2000\n    System.out.println("День: " + m.group(1));       // 15\n    System.out.println("Месяц: " + m.group(2));      // 06\n    System.out.println("Год: " + m.group(3));        // 2000\n}' },
        { type: 'heading', value: 'Именованные группы' },
        { type: 'code', language: 'java', value: '// (?<name>...) — именованная группа\nPattern emailPattern = Pattern.compile(\n    "(?<user>[\\\\w.+-]+)@(?<domain>[\\\\w-]+)\\\\.(?<tld>[a-z]{2,})");\nMatcher em = emailPattern.matcher("user@example.com");\n\nif (em.matches()) {\n    System.out.println("Пользователь: " + em.group("user"));   // user\n    System.out.println("Домен: " + em.group("domain"));        // example\n    System.out.println("Зона: " + em.group("tld"));            // com\n}' },
        { type: 'heading', value: 'Группы без захвата' },
        { type: 'code', language: 'java', value: '// (?:...) — группа для группировки, без сохранения результата\nPattern p = Pattern.compile("(?:https?|ftp)://([\\\\w./-]+)");\nMatcher m2 = p.matcher("Visit https://example.com/page");\nif (m2.find()) {\n    System.out.println(m2.group(1)); // example.com/page\n    // group(0) = https://example.com/page\n    // group(1) = example.com/page (только второй скобки)\n}' },
        { type: 'tip', value: 'group(0) или group() — всё совпадение целиком. group(1), group(2)... — содержимое каждой пары скобок, слева направо.' }
      ]
    },
    {
      id: 5,
      title: 'Методы String с regex',
      type: 'theory',
      content: [
        { type: 'text', value: 'Класс String имеет несколько методов, которые принимают регулярные выражения. Это удобнее чем каждый раз создавать Pattern и Matcher.' },
        { type: 'heading', value: 'matches() — проверить весь текст' },
        { type: 'code', language: 'java', value: '// String.matches() — весь текст должен соответствовать regex\nString email = "user@example.com";\nboolean valid = email.matches("[\\\\w.+-]+@[\\\\w-]+\\\\.[a-z]{2,}");\nSystem.out.println("Email корректен: " + valid); // true\n\n// Проверка на число\nSystem.out.println("123".matches("\\\\d+"));    // true\nSystem.out.println("12.3".matches("\\\\d+"));   // false\nSystem.out.println("12.3".matches("\\\\d+\\\\.\\\\d+")); // true' },
        { type: 'heading', value: 'split() — разбить строку' },
        { type: 'code', language: 'java', value: '// Разбить по любому пробелу (включая несколько подряд)\nString text = "Слово1   Слово2  Слово3";\nString[] words = text.split("\\\\s+");\nfor (String w : words) System.out.println(w);\n// Слово1\n// Слово2\n// Слово3\n\n// Разбить по нескольким разделителям\nString csv = "один,два;три|четыре";\nString[] parts = csv.split("[,;|]");\nSystem.out.println(Arrays.toString(parts));\n// [один, два, три, четыре]' },
        { type: 'heading', value: 'replaceAll() и replaceFirst()' },
        { type: 'code', language: 'java', value: 'String text2 = "Цена: 100 рублей, скидка: 20 рублей";\n\n// Заменить все числа на #\nString hidden = text2.replaceAll("\\\\d+", "#");\nSystem.out.println(hidden); // Цена: # рублей, скидка: # рублей\n\n// Заменить первое число\nString first = text2.replaceFirst("\\\\d+", "???");\nSystem.out.println(first); // Цена: ??? рублей, скидка: 20 рублей\n\n// Убрать лишние пробелы\nString messy = "  много    пробелов   ";\nString clean = messy.trim().replaceAll("\\\\s+", " ");\nSystem.out.println(clean); // много пробелов' },
        { type: 'heading', value: 'Замена с группами' },
        { type: 'code', language: 'java', value: '// Переставить дату из DD.MM.YYYY в YYYY-MM-DD\nString date = "15.06.2000";\nString isoDate = date.replaceAll("(\\\\d{2})\\\\.(\\\\d{2})\\\\.(\\\\d{4})", "$3-$2-$1");\nSystem.out.println(isoDate); // 2000-06-15\n// $1=15, $2=06, $3=2000 — ссылки на группы' }
      ]
    },
    {
      id: 6,
      title: 'Флаги и специальные паттерны',
      type: 'theory',
      content: [
        { type: 'text', value: 'Флаги Pattern изменяют поведение сопоставления: регистр, многострочный режим и другие.' },
        { type: 'heading', value: 'CASE_INSENSITIVE — без учёта регистра' },
        { type: 'code', language: 'java', value: '// Без флага — регистр важен\nPattern p1 = Pattern.compile("hello");\nSystem.out.println(p1.matcher("Hello World").find()); // false\n\n// С флагом CASE_INSENSITIVE\nPattern p2 = Pattern.compile("hello", Pattern.CASE_INSENSITIVE);\nSystem.out.println(p2.matcher("Hello World").find()); // true\nSystem.out.println(p2.matcher("HELLO WORLD").find()); // true\n\n// Через встроенный флаг в паттерн\nPattern p3 = Pattern.compile("(?i)hello");\nSystem.out.println(p3.matcher("HELLO").find()); // true' },
        { type: 'heading', value: 'MULTILINE — многострочный режим' },
        { type: 'code', language: 'java', value: 'String multiline = "Строка первая\\nСтрока вторая\\nСтрока третья";\n\n// ^ без флага — только начало всего текста\n// ^ с MULTILINE — начало каждой строки\nPattern p = Pattern.compile("^Строка", Pattern.MULTILINE);\nMatcher m = p.matcher(multiline);\nint count = 0;\nwhile (m.find()) count++;\nSystem.out.println("Строк начинается с Строка: " + count); // 3' },
        { type: 'heading', value: 'Популярные готовые паттерны' },
        { type: 'code', language: 'java', value: '// Email (упрощённый)\nString emailRegex = "[\\\\w.+-]+@[\\\\w-]+\\\\.[a-z]{2,}";\n\n// Только цифры\nString digitsOnly = "\\\\d+";\n\n// Целое число (с возможным знаком)\nString integer = "-?\\\\d+";\n\n// Дробное число\nString decimal = "-?\\\\d+(\\\\.\\\\d+)?";\n\n// Телефон +7(777)123-45-67\nString phone = "\\\\+?[78][\\\\s\\\\-]?\\\\(?\\\\d{3}\\\\)?[\\\\s\\\\-]?\\\\d{3}[\\\\s\\\\-]?\\\\d{2}[\\\\s\\\\-]?\\\\d{2}";\n\n// Проверка пароля: минимум 8 символов, буква, цифра\nString strongPass = "^(?=.*[a-zA-Z])(?=.*\\\\d).{8,}$";\n\nSystem.out.println("test@mail.ru".matches(emailRegex)); // true\nSystem.out.println("P@ssw0rd".matches(strongPass));     // true' }
      ]
    },
    {
      id: 7,
      title: 'Практика: валидация и обработка текста',
      type: 'practice',
      difficulty: 'medium',
      description: 'Используй регулярные выражения для валидации данных и извлечения информации из текста.',
      requirements: [
        'Напиши метод boolean isValidEmail(String email), используя regex для проверки формата email',
        'Напиши метод String extractNumbers(String text) — возвращает все числа через запятую',
        'Напиши метод String formatPhone(String phone) — приводит "89012345678" к "+7 (901) 234-56-78"',
        'Протестируй: email "user@test.com" (true), "notanemail" (false), извлеки числа из "Купил 3 кг яблок за 250 тенге", форматируй "89012345678"'
      ],
      expectedOutput: 'Email user@test.com: true\nEmail notanemail: false\nЧисла: 3, 250\nТелефон: +7 (901) 234-56-78',
      hint: 'Для email: "[\\\\w.+-]+@[\\\\w-]+\\\\.[a-z]{2,}". Для чисел: Pattern.compile("\\\\d+") + while(m.find()) + joining. Для телефона: если начинается с 8 или 7 из 11 цифр: replaceAll("^[78](\\\\d{3})(\\\\d{3})(\\\\d{2})(\\\\d{2})$", "+7 ($1) $2-$3-$4") после убирания нецифр.',
      solution: 'import java.util.regex.*;\nimport java.util.*;\nimport java.util.stream.*;\n\npublic class Main {\n    static boolean isValidEmail(String email) {\n        return email.matches("[\\\\w.+-]+@[\\\\w-]+\\\\.[a-z]{2,}");\n    }\n\n    static String extractNumbers(String text) {\n        Pattern p = Pattern.compile("\\\\d+");\n        Matcher m = p.matcher(text);\n        List<String> nums = new ArrayList<>();\n        while (m.find()) nums.add(m.group());\n        return String.join(", ", nums);\n    }\n\n    static String formatPhone(String phone) {\n        String digits = phone.replaceAll("[^\\\\d]", "");\n        return digits.replaceAll("^[78](\\\\d{3})(\\\\d{3})(\\\\d{2})(\\\\d{2})$",\n            "+7 ($1) $2-$3-$4");\n    }\n\n    public static void main(String[] args) {\n        System.out.println("Email user@test.com: " + isValidEmail("user@test.com"));\n        System.out.println("Email notanemail: " + isValidEmail("notanemail"));\n        System.out.println("Числа: " + extractNumbers("Купил 3 кг яблок за 250 тенге"));\n        System.out.println("Телефон: " + formatPhone("89012345678"));\n    }\n}',
      explanation: 'replaceAll("[^\\\\d]", "") убирает все нецифровые символы из телефона. Потом regex с группами переставляет цифры в нужный формат. В замене $1, $2, $3, $4 — ссылки на первую, вторую, третью и четвёртую группы в скобках. Обрати внимание на двойные слеши в Java строках.'
    }
  ]
}
