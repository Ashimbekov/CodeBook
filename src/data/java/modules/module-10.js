export default {
  id: 10,
  title: 'Строки (String)',
  description: 'Всё о строках в Java: методы String, сравнение строк, StringBuilder для изменения строк и форматирование',
  lessons: [
    {
      id: 1,
      title: 'Строки — основы',
      type: 'theory',
      content: [
        { type: 'text', value: 'String в Java — это не просто переменная, а объект. У неё есть методы (функции), которые позволяют работать с текстом: узнать длину, взять символ, найти подстроку и многое другое.' },
        { type: 'tip', value: 'Строка — как бусы: последовательность символов (бусинок). Каждая бусинка имеет номер (индекс). Ты можешь посчитать бусинки, взять любую по номеру, отрезать кусок и так далее.' },
        { type: 'heading', value: 'Создание строк' },
        { type: 'code', language: 'java', value: 'String s1 = "Привет, мир!";\nString s2 = new String("Привет");  // так тоже можно, но необычно\nString s3 = "";                    // пустая строка\n\n// Длина строки\nSystem.out.println(s1.length());  // 13\nSystem.out.println(s3.length());  // 0\n\n// Строка неизменяема (immutable)!\n// Каждый "изменяющий" метод возвращает НОВУЮ строку\nString original = "Привет";\nString upper = original.toUpperCase();\nSystem.out.println(original);  // Привет (не изменился!)\nSystem.out.println(upper);     // ПРИВЕТ (новая строка)' },
        { type: 'heading', value: 'Обращение к символам' },
        { type: 'code', language: 'java', value: 'String word = "Java";\n//               0123  <- индексы\n\nchar first = word.charAt(0);   // J — первый символ\nchar last = word.charAt(word.length() - 1);  // a — последний\n\nSystem.out.println("Первый символ: " + first);\nSystem.out.println("Последний символ: " + last);\n\n// Проход по символам\nfor (int i = 0; i < word.length(); i++) {\n    System.out.println(i + ": " + word.charAt(i));\n}' },
        { type: 'warning', value: 'String — объект, а не примитив. Это важно при сравнении! == сравнивает ссылки (адреса в памяти), а не содержимое. Для сравнения содержимого ВСЕГДА используй .equals().' }
      ]
    },
    {
      id: 2,
      title: 'Методы строк: поиск и извлечение',
      type: 'theory',
      content: [
        { type: 'text', value: 'У String огромное количество методов. Рассмотрим самые важные: поиск подстроки, извлечение части строки, проверки.' },
        { type: 'heading', value: 'indexOf — поиск подстроки' },
        { type: 'code', language: 'java', value: 'String sentence = "Java — отличный язык программирования";\n\nint index = sentence.indexOf("язык");  // первое вхождение\nSystem.out.println("Позиция слова: " + index);  // 17\n\n// Если не найдено — возвращает -1\nint notFound = sentence.indexOf("Python");\nSystem.out.println("Python найден: " + notFound);  // -1\n\n// Поиск с заданной позиции\nString s = "абвабваб";\nSystem.out.println(s.indexOf("аб"));     // 0 — первое вхождение\nSystem.out.println(s.indexOf("аб", 1));  // 3 — начиная с позиции 1' },
        { type: 'heading', value: 'substring — извлечение части' },
        { type: 'code', language: 'java', value: 'String text = "Программирование на Java";\n\n// substring(начало) — от позиции до конца\nString part1 = text.substring(19);   // "Java"\nSystem.out.println(part1);\n\n// substring(начало, конец) — от начала до конца (конец не включается)\nString part2 = text.substring(0, 14);  // "Программирование" ... нет, 14 символов\nSystem.out.println(text.substring(0, 14));\n\n// Пример: извлечение расширения файла\nString filename = "document.pdf";\nint dotIndex = filename.indexOf(".");\nString extension = filename.substring(dotIndex + 1);\nSystem.out.println("Расширение: " + extension);  // pdf' },
        { type: 'heading', value: 'contains, startsWith, endsWith' },
        { type: 'code', language: 'java', value: 'String email = "user@example.com";\n\nSystem.out.println(email.contains("@"));         // true\nSystem.out.println(email.startsWith("user"));    // true\nSystem.out.println(email.endsWith(".com"));      // true\nSystem.out.println(email.contains("gmail"));     // false\n\n// Практическое использование\nboolean isEmail = email.contains("@") && email.contains(".");\nSystem.out.println("Похоже на email: " + isEmail);  // true' }
      ]
    },
    {
      id: 3,
      title: 'Методы строк: преобразование',
      type: 'theory',
      content: [
        { type: 'text', value: 'Методы преобразования позволяют изменять регистр, удалять пробелы, заменять символы. Помни: String неизменяем — каждый метод возвращает новую строку!' },
        { type: 'heading', value: 'Регистр: toUpperCase и toLowerCase' },
        { type: 'code', language: 'java', value: 'String name = "аЛиБеК";\n\nString upper = name.toUpperCase();  // АЛИБЕК\nString lower = name.toLowerCase();  // алибек\n\nSystem.out.println(upper);\nSystem.out.println(lower);\n\n// Полезно для сравнения без учёта регистра\nString a = "JAVA";\nString b = "java";\nSystem.out.println(a.equals(b));                          // false\nSystem.out.println(a.equalsIgnoreCase(b));               // true\nSystem.out.println(a.toLowerCase().equals(b.toLowerCase())); // true' },
        { type: 'heading', value: 'trim и replace' },
        { type: 'code', language: 'java', value: '// trim() — убирает пробелы по краям\nString dirty = "   Привет, мир!   ";\nString clean = dirty.trim();\nSystem.out.println("|" + dirty + "|");  // |   Привет, мир!   |\nSystem.out.println("|" + clean + "|");  // |Привет, мир!|\n\n// replace() — заменяет символы или подстроки\nString s = "Hello World";\nString replaced = s.replace("World", "Java");\nSystem.out.println(replaced);  // Hello Java\n\nString withSpaces = "a b c d";\nString noSpaces = withSpaces.replace(" ", "");\nSystem.out.println(noSpaces);  // abcd' },
        { type: 'heading', value: 'split — разбивка на части' },
        { type: 'code', language: 'java', value: '// split(разделитель) — возвращает массив строк\nString csv = "Алибек,Нурлан,Дана,Айгерим";\nString[] names = csv.split(",");\n\nfor (String n : names) {\n    System.out.println("Имя: " + n);\n}\n// Имя: Алибек\n// Имя: Нурлан\n// ...\n\nSystem.out.println("Всего имён: " + names.length);  // 4\n\n// Разбивка предложения по словам\nString sentence = "Java это здорово";\nString[] words = sentence.split(" ");\nSystem.out.println("Слов: " + words.length);  // 3' }
      ]
    },
    {
      id: 4,
      title: 'Сравнение строк: equals vs ==',
      type: 'theory',
      content: [
        { type: 'text', value: 'Одна из самых частых ошибок в Java — сравнение строк через ==. Это работает "иногда" и создаёт непредсказуемые баги. Всегда используй .equals() для сравнения строк!' },
        { type: 'heading', value: 'Почему == не работает для строк?' },
        { type: 'code', language: 'java', value: 'String a = new String("Java");\nString b = new String("Java");\n\n// Это РАЗНЫЕ объекты в памяти, но с одинаковым содержимым\nSystem.out.println(a == b);       // false! (разные объекты)\nSystem.out.println(a.equals(b)); // true  (одинаковое содержимое)' },
        { type: 'tip', value: 'Думай о строках как о домах. Два дома могут выглядеть одинаково, но это всё равно два разных дома. == проверяет "это один и тот же дом?". equals() проверяет "дома выглядят одинаково?".' },
        { type: 'heading', value: 'String Pool — почему == иногда работает' },
        { type: 'code', language: 'java', value: '// Строковые литералы хранятся в "пуле"\nString s1 = "Java";  // берётся из пула\nString s2 = "Java";  // тот же объект из пула!\n\nSystem.out.println(s1 == s2);       // true (случайно!)\nSystem.out.println(s1.equals(s2)); // true\n\n// Но с new — всегда новый объект!\nString s3 = new String("Java");\nSystem.out.println(s1 == s3);       // false\nSystem.out.println(s1.equals(s3)); // true' },
        { type: 'warning', value: 'НЕ полагайся на то, что == иногда работает! Всегда используй .equals() для строк. Иначе ты будешь писать код, который работает случайно.' },
        { type: 'heading', value: 'Семейство методов сравнения' },
        { type: 'code', language: 'java', value: 'String s = "Hello";\n\nSystem.out.println(s.equals("Hello"));          // true\nSystem.out.println(s.equalsIgnoreCase("hello")); // true (без учёта регистра)\nSystem.out.println(s.compareTo("Hello"));       // 0 (равны)\nSystem.out.println(s.compareTo("World"));       // отрицательное (H < W)\n\n// Проверка на null (не забывай!)\nString maybeNull = null;\n// maybeNull.equals("test")  — ОШИБКА! NullPointerException\n// Правильно:\nSystem.out.println("test".equals(maybeNull));  // false (безопасно)' }
      ]
    },
    {
      id: 5,
      title: 'StringBuilder',
      type: 'theory',
      content: [
        { type: 'text', value: 'String неизменяем: каждая конкатенация создаёт новую строку. Если склеивать строки в цикле — программа работает медленно. StringBuilder — изменяемая строка, специально для этого.' },
        { type: 'tip', value: 'String — это табличка. Каждое изменение — выбрасываешь старую и печатаешь новую. StringBuilder — блокнот, куда можно дописывать и стирать. Если изменений много — блокнот намного удобнее!' },
        { type: 'heading', value: 'Создание и основные методы' },
        { type: 'code', language: 'java', value: 'StringBuilder sb = new StringBuilder();\n\n// append() — добавить в конец\nsb.append("Привет");\nsb.append(", ");\nsb.append("мир");\nsb.append("!");\n\nSystem.out.println(sb.toString());  // Привет, мир!\nSystem.out.println(sb.length());    // 12\n\n// Можно цепочкой!\nStringBuilder sb2 = new StringBuilder()\n    .append("Java")\n    .append(" — ")\n    .append("отличный язык!");\nSystem.out.println(sb2.toString());' },
        { type: 'heading', value: 'Другие методы StringBuilder' },
        { type: 'code', language: 'java', value: 'StringBuilder sb = new StringBuilder("Hello World");\n\n// insert() — вставка\nsb.insert(5, ",");\nSystem.out.println(sb);  // Hello, World\n\n// delete() — удаление\nsb.delete(5, 7);  // удаляем ", " (от 5 до 7, не включая 7)\nSystem.out.println(sb);  // HelloWorld\n\n// reverse() — переворот\nsb.reverse();\nSystem.out.println(sb);  // dlroWolleH\n\n// replace() — замена\nStringBuilder sb2 = new StringBuilder("Привет мир");\nsb2.replace(7, 10, "Java");\nSystem.out.println(sb2);  // Привет Java' },
        { type: 'heading', value: 'String vs StringBuilder — скорость' },
        { type: 'code', language: 'java', value: '// МЕДЛЕННО: создаёт 1000 новых строк!\nString slow = "";\nfor (int i = 0; i < 1000; i++) {\n    slow += i;  // каждый += создаёт новую строку\n}\n\n// БЫСТРО: StringBuilder изменяется на месте\nStringBuilder fast = new StringBuilder();\nfor (int i = 0; i < 1000; i++) {\n    fast.append(i);\n}\nString result = fast.toString();' },
        { type: 'note', value: 'Правило: если склеиваешь строки в цикле — всегда используй StringBuilder. Если склейка простая (2-3 строки вне цикла) — обычный + тоже хорошо.' }
      ]
    },
    {
      id: 6,
      title: 'Форматирование строк',
      type: 'theory',
      content: [
        { type: 'text', value: 'String.format() и System.out.printf() позволяют создавать красиво отформатированные строки с подстановкой переменных. Это мощнее, чем склейка через +.' },
        { type: 'heading', value: 'String.format()' },
        { type: 'code', language: 'java', value: '// %s — строка, %d — целое число, %f — дробное число\nString name = "Нурдаулет";\nint age = 25;\ndouble gpa = 3.85;\n\nString info = String.format("Имя: %s, возраст: %d, ГПА: %.2f", name, age, gpa);\nSystem.out.println(info);\n// Имя: Нурдаулет, возраст: 25, ГПА: 3.85\n\n// %.2f — число с 2 знаками после запятой\ndouble price = 1234.5678;\nSystem.out.println(String.format("Цена: %.2f тг", price));\n// Цена: 1234.57 тг' },
        { type: 'heading', value: 'Выравнивание и ширина' },
        { type: 'code', language: 'java', value: '// %10s — строка в поле шириной 10 (выравнивание вправо)\n// %-10s — строка в поле шириной 10 (выравнивание влево)\n// %05d — число с ведущими нулями, 5 знаков\n\nSystem.out.printf("%-15s %5s %8s%n", "Товар", "Кол.", "Цена");\nSystem.out.printf("%-15s %5d %8.2f%n", "Яблоки", 3, 450.0);\nSystem.out.printf("%-15s %5d %8.2f%n", "Апельсины", 2, 380.5);\nSystem.out.printf("%-15s %5d %8.2f%n", "Бананы", 5, 290.0);\n// Товар           Кол.     Цена\n// Яблоки             3   450.00\n// Апельсины          2   380.50\n// Бананы             5   290.00' },
        { type: 'heading', value: 'Спецификаторы форматирования' },
        { type: 'list', items: [
          '%s — строка (String)',
          '%d — целое число (int, long)',
          '%f — дробное число (double) — по умолчанию 6 знаков',
          '%.2f — дробное с 2 знаками после запятой',
          '%10d — целое в поле из 10 символов',
          '%-10s — строка выровнена влево в поле из 10',
          '%05d — целое с ведущими нулями, 5 символов',
          '%n или \\n — перенос строки'
        ]}
      ]
    },
    {
      id: 7,
      title: 'Практика: Анализ строки',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напиши программу, которая анализирует введённое слово и выводит статистику: длину, первый и последний символ, строку в верхнем регистре, развёрнутую строку (символы в обратном порядке).',
      requirements: [
        'Строка для анализа: String word = "программирование"',
        'Выведи длину слова',
        'Выведи первый и последний символ',
        'Выведи слово в верхнем регистре',
        'Разверни строку с помощью StringBuilder.reverse()'
      ],
      expectedOutput: 'Слово: программирование\nДлина: 16\nПервый символ: п\nПоследний символ: е\nВерхний регистр: ПРОГРАММИРОВАНИЕ\nОбратный порядок: еинавориммаргорп',
      hint: 'Для разворота используй new StringBuilder(word).reverse().toString(). charAt(word.length()-1) даёт последний символ.',
      solution: 'public class Main {\n    public static void main(String[] args) {\n        String word = "программирование";\n\n        System.out.println("Слово: " + word);\n        System.out.println("Длина: " + word.length());\n        System.out.println("Первый символ: " + word.charAt(0));\n        System.out.println("Последний символ: " + word.charAt(word.length() - 1));\n        System.out.println("Верхний регистр: " + word.toUpperCase());\n\n        String reversed = new StringBuilder(word).reverse().toString();\n        System.out.println("Обратный порядок: " + reversed);\n    }\n}',
      explanation: 'Большинство задач решается методами String. Для разворота строки используем StringBuilder — создаём его из строки, вызываем reverse(), потом toString() для получения String. Это самый удобный способ перевернуть строку в Java.'
    },
    {
      id: 8,
      title: 'Практика: Подсчёт слов',
      type: 'practice',
      difficulty: 'hard',
      description: 'Напиши программу, которая принимает предложение, разбивает его на слова и выводит: количество слов, самое длинное слово, количество слов начинающихся на заданную букву.',
      requirements: [
        'Предложение: String sentence = "Java является мощным и популярным языком программирования"',
        'Буква для поиска: char letter = \'м\'',
        'Разбей на слова через split(" ")',
        'Найди количество слов, самое длинное слово, количество слов на букву м'
      ],
      expectedOutput: 'Предложение: Java является мощным и популярным языком программирования\nКоличество слов: 7\nСамое длинное: программирования (15 букв)\nНа букву "м": 3 слова (мощным, популярным, языком... нет — программирования нет)',
      hint: 'После split() перебери массив words в цикле. Для длинного слова храни String longest = "". Для подсчёта букв используй word.charAt(0) == letter (toLowerCase для надёжности).',
      solution: 'public class Main {\n    public static void main(String[] args) {\n        String sentence = "Java является мощным и популярным языком программирования";\n        char letter = \'м\';\n\n        String[] words = sentence.split(" ");\n\n        String longest = "";\n        int letterCount = 0;\n\n        for (String word : words) {\n            if (word.length() > longest.length()) {\n                longest = word;\n            }\n            if (word.toLowerCase().charAt(0) == letter) {\n                letterCount++;\n            }\n        }\n\n        System.out.println("Предложение: " + sentence);\n        System.out.println("Количество слов: " + words.length);\n        System.out.println("Самое длинное: " + longest + " (" + longest.length() + " букв)");\n        System.out.println("На букву \\"" + letter + "\\": " + letterCount + " слова");\n    }\n}',
      explanation: 'split(" ") разбивает строку по пробелам и возвращает массив слов. Затем перебираем все слова: обновляем longest если текущее слово длиннее. toLowerCase().charAt(0) == letter — проверяем первую букву без учёта регистра. Всё делается за один проход по массиву слов.'
    }
  ]
}
