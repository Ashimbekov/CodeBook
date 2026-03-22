export default {
  id: 53,
  title: 'Практикум: Строки и методы',
  description: 'Практические задачи на работу со строками и написание методов в Java: анализ текста, шифрование, проверка свойств строк, трансформации и форматирование',
  lessons: [
    {
      id: 1,
      title: 'Задача: Подсчёт гласных и согласных',
      type: 'practice',
      difficulty: 'easy',
      description: 'Напиши программу, которая подсчитывает количество гласных и согласных букв в строке, игнорируя пробелы, цифры и знаки препинания.',
      requirements: [
        'Строка: String text = "Hello World Java Programming"',
        'Гласные (английские): a, e, i, o, u (и заглавные)',
        'Согласные: все остальные буквы',
        'Игнорируй пробелы и не-буквы',
        'Выведи количество гласных, согласных и общее число букв'
      ],
      expectedOutput: 'Текст: Hello World Java Programming\nГласных: 8\nСогласных: 17\nВсего букв: 25',
      hint: 'Используй text.toLowerCase().charAt(i) для каждого символа. Проверяй является ли символ буквой через Character.isLetter(c). Строка гласных: String vowels = "aeiou"; vowels.indexOf(c) != -1 означает, что c — гласная.',
      solution: 'public class Main {\n    public static void main(String[] args) {\n        String text = "Hello World Java Programming";\n\n        int vowels = 0;\n        int consonants = 0;\n        String vowelSet = "aeiou";\n\n        for (int i = 0; i < text.length(); i++) {\n            char c = Character.toLowerCase(text.charAt(i));\n\n            if (Character.isLetter(c)) {\n                if (vowelSet.indexOf(c) != -1) {\n                    vowels++;\n                } else {\n                    consonants++;\n                }\n            }\n        }\n\n        System.out.println("Текст: " + text);\n        System.out.println("Гласных: " + vowels);\n        System.out.println("Согласных: " + consonants);\n        System.out.println("Всего букв: " + (vowels + consonants));\n    }\n}',
      explanation: 'Алгоритм перебирает каждый символ строки. Character.isLetter(c) — стандартный метод Java, который возвращает true если символ является буквой (работает и для кириллицы). Character.toLowerCase(c) приводит к нижнему регистру для единообразной проверки. Метод indexOf() применяется к строке гласных: если символ найден (результат != -1), он гласный, иначе — согласный. Этот паттерн "проверка через indexOf на строке-множестве" — удобная альтернатива длинной цепочке || для гласных.'
    },
    {
      id: 2,
      title: 'Задача: Переворот слов в предложении',
      type: 'practice',
      difficulty: 'easy',
      description: 'Напиши программу, которая переворачивает порядок слов в предложении. Слова разделены пробелами.',
      requirements: [
        'Строка: String sentence = "Java это мощный язык программирования"',
        'Результат: "программирования язык мощный это Java"',
        'Используй split() для разбивки и StringBuilder для сборки',
        'Обработай лишние пробелы в начале и конце через trim()',
        'Не меняй порядок букв внутри каждого слова'
      ],
      expectedOutput: 'Исходное: Java это мощный язык программирования\nПеревёрнутое: программирования язык мощный это Java',
      hint: 'После split(" ") получишь массив слов. Пройди по нему в обратном порядке (от words.length-1 до 0) и собери результат через StringBuilder.',
      solution: 'public class Main {\n    public static void main(String[] args) {\n        String sentence = "Java это мощный язык программирования";\n\n        System.out.println("Исходное: " + sentence);\n\n        String[] words = sentence.trim().split("\\\\s+");\n        StringBuilder reversed = new StringBuilder();\n\n        for (int i = words.length - 1; i >= 0; i--) {\n            reversed.append(words[i]);\n            if (i > 0) reversed.append(" ");\n        }\n\n        System.out.println("Перевёрнутое: " + reversed.toString());\n    }\n}',
      explanation: 'Ключевой приём — обход массива в обратном порядке: начинаем с индекса words.length - 1 и идём до 0 включительно. Разделитель "\\\\s+" в split() (двойной слеш для экранирования в Java-строке) означает "один или более пробельных символов" — это надёжнее чем " " (один пробел), т.к. обрабатывает двойные пробелы. trim() убирает пробелы по краям строки перед разбивкой. Пробел между словами добавляем только если i > 0 (не после последнего слова).'
    },
    {
      id: 3,
      title: 'Задача: Проверка анаграммы',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напиши программу, которая проверяет, являются ли два слова анаграммами друг друга. Анаграммы — это слова, состоящие из одинаковых букв в разном порядке.',
      requirements: [
        'Проверь пары: ("listen", "silent"), ("hello", "world"), ("triangle", "integral")',
        'Сравнение без учёта регистра',
        'Используй массив частот символов (не сортировку)',
        'Выведи каждую пару и результат проверки'
      ],
      expectedOutput: '"listen" и "silent": анаграммы\n"hello" и "world": не анаграммы\n"triangle" и "integral": анаграммы',
      hint: 'Создай массив int[] count = new int[26]. Для первого слова: count[c - \'a\']++. Для второго слова: count[c - \'a\']--. Если все элементы count равны 0 — анаграммы. Предварительно проверь, что длины слов совпадают.',
      solution: 'public class Main {\n    public static void main(String[] args) {\n        checkAnagram("listen", "silent");\n        checkAnagram("hello", "world");\n        checkAnagram("triangle", "integral");\n    }\n\n    static void checkAnagram(String word1, String word2) {\n        String result = isAnagram(word1, word2) ? "анаграммы" : "не анаграммы";\n        System.out.println("\\"" + word1 + "\\" и \\"" + word2 + "\\": " + result);\n    }\n\n    static boolean isAnagram(String word1, String word2) {\n        String w1 = word1.toLowerCase();\n        String w2 = word2.toLowerCase();\n\n        if (w1.length() != w2.length()) return false;\n\n        int[] count = new int[26];\n\n        for (int i = 0; i < w1.length(); i++) {\n            count[w1.charAt(i) - \'a\']++;\n            count[w2.charAt(i) - \'a\']--;\n        }\n\n        for (int c : count) {\n            if (c != 0) return false;\n        }\n\n        return true;\n    }\n}',
      explanation: 'Эффективный алгоритм проверки анаграмм через массив частот. Индекс массива соответствует букве: \'a\' = 0, \'b\' = 1, ..., \'z\' = 25. Выражение c - \'a\' даёт числовой индекс символа: \'e\' - \'a\' = 4. Для первого слова увеличиваем счётчики, для второго — уменьшаем. Если слова анаграммы, каждая буква встречается одинаково часто, и все счётчики вернутся к 0. Изящество: оба слова обходятся в одном цикле, т.к. их длины совпадают. Сложность O(n) — значительно быстрее сортировки O(n log n).'
    },
    {
      id: 4,
      title: 'Задача: Удаление дубликатов из строки',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напиши программу, которая удаляет повторяющиеся символы из строки, сохраняя первое вхождение каждого символа и исходный порядок.',
      requirements: [
        'Строка: String str = "programming"',
        'Результат: "progamin" (убраны повторные r, g, m)',
        'Также проверь: "aabbccdd" → "abcd"',
        'Сохраняй порядок первого появления символов',
        'Используй boolean[] seen для отслеживания встреченных символов'
      ],
      expectedOutput: 'Исходная: programming\nБез дубликатов: progamin\n---\nИсходная: aabbccdd\nБез дубликатов: abcd',
      hint: 'Создай boolean[] seen = new boolean[256] (для всех ASCII символов). Для каждого символа c: если seen[c] == false, добавляй в результат и ставь seen[c] = true. Если seen[c] == true, пропускай.',
      solution: 'public class Main {\n    public static void main(String[] args) {\n        removeDuplicates("programming");\n        System.out.println("---");\n        removeDuplicates("aabbccdd");\n    }\n\n    static void removeDuplicates(String str) {\n        System.out.println("Исходная: " + str);\n\n        boolean[] seen = new boolean[256];\n        StringBuilder result = new StringBuilder();\n\n        for (int i = 0; i < str.length(); i++) {\n            char c = str.charAt(i);\n\n            if (!seen[c]) {\n                result.append(c);\n                seen[c] = true;\n            }\n        }\n\n        System.out.println("Без дубликатов: " + result.toString());\n    }\n}',
      explanation: 'Алгоритм использует массив seen размером 256 — по одному элементу для каждого ASCII-символа. Индекс символа c в массиве — это его ASCII-код (char автоматически преобразуется в int при индексировании). Изначально все элементы false. При первом встречном символе: seen[c] = false, добавляем символ в результат и помечаем seen[c] = true. При повторном встречном символе: seen[c] = true, пропускаем. Один проход O(n) + O(1) памяти для массива seen. Порядок символов сохраняется, так как мы обходим строку слева направо.'
    },
    {
      id: 5,
      title: 'Задача: Самый частый символ',
      type: 'practice',
      difficulty: 'medium',
      description: 'Найди символ, который встречается чаще всего в строке. При одинаковой частоте вернуть символ, встречающийся первым.',
      requirements: [
        'Строка: String str = "abracadabra"',
        'Используй массив для подсчёта частот символов',
        'Найди максимальную частоту и соответствующий символ',
        'При одинаковой частоте предпочти символ, встречающийся первым в строке',
        'Выведи символ и его количество'
      ],
      expectedOutput: 'Строка: abracadabra\nСамый частый символ: \'a\' (встречается 5 раз)',
      hint: 'Сначала заполни массив frequency[c]++. Затем пройди по исходной строке ещё раз и найди символ с наибольшей частотой (при равных частотах второй проход гарантирует выбор первого встречного).',
      solution: 'public class Main {\n    public static void main(String[] args) {\n        String str = "abracadabra";\n\n        System.out.println("Строка: " + str);\n\n        // Подсчёт частот\n        int[] frequency = new int[256];\n        for (int i = 0; i < str.length(); i++) {\n            frequency[str.charAt(i)]++;\n        }\n\n        // Поиск максимума — проходим по исходной строке\n        // для гарантии выбора первого встречного при равных частотах\n        char maxChar = str.charAt(0);\n        int maxFreq = frequency[str.charAt(0)];\n\n        for (int i = 1; i < str.length(); i++) {\n            char c = str.charAt(i);\n            if (frequency[c] > maxFreq) {\n                maxFreq = frequency[c];\n                maxChar = c;\n            }\n        }\n\n        System.out.println("Самый частый символ: \'" + maxChar + "\' (встречается " + maxFreq + " раз)");\n    }\n}',
      explanation: 'Задача решается за два прохода. Первый проход: подсчёт частоты каждого символа в массиве frequency. Второй проход: ищем максимум, проходя по исходной строке (а не по массиву frequency). Это ключевой момент: если идти по массиву frequency, при равных частотах мы получим символ с меньшим ASCII-кодом. Проход по строке гарантирует, что при равных частотах мы выберем символ, встреченный первым — что и требует условие задачи. Инициализация maxChar = str.charAt(0) и maxFreq = frequency[str.charAt(0)] — хорошая практика: начинаем с реального значения, а не с 0.'
    },
    {
      id: 6,
      title: 'Задача: Капитализация слов',
      type: 'practice',
      difficulty: 'easy',
      description: 'Напиши программу, которая делает первую букву каждого слова заглавной, а остальные — строчными. Реализуй это без использования сторонних библиотек.',
      requirements: [
        'Строка: String text = "привет МИР java ПРОГРАММИРОВАНИЕ"',
        'Результат: "Привет Мир Java Программирование"',
        'Каждое слово: первая буква заглавная, остальные строчные',
        'Слова разделены пробелами',
        'Напиши отдельный метод capitalizeWord(String word)'
      ],
      expectedOutput: 'Исходная: привет МИР java ПРОГРАММИРОВАНИЕ\nКапитализированная: Привет Мир Java Программирование',
      hint: 'Разбей строку на слова через split(). Для каждого слова: первая буква через Character.toUpperCase(word.charAt(0)), остаток через word.substring(1).toLowerCase(). Собери обратно через StringBuilder.',
      solution: 'public class Main {\n    public static void main(String[] args) {\n        String text = "привет МИР java ПРОГРАММИРОВАНИЕ";\n\n        System.out.println("Исходная: " + text);\n\n        String[] words = text.split(" ");\n        StringBuilder result = new StringBuilder();\n\n        for (int i = 0; i < words.length; i++) {\n            result.append(capitalizeWord(words[i]));\n            if (i < words.length - 1) result.append(" ");\n        }\n\n        System.out.println("Капитализированная: " + result.toString());\n    }\n\n    static String capitalizeWord(String word) {\n        if (word == null || word.isEmpty()) return word;\n\n        return Character.toUpperCase(word.charAt(0)) + word.substring(1).toLowerCase();\n    }\n}',
      explanation: 'Метод capitalizeWord делает ровно то, что нужно: берёт первый символ через charAt(0), делает его заглавным через Character.toUpperCase(), берёт остаток строки через substring(1) и делает всё строчным через toLowerCase(). Конкатенация char + String работает корректно: Java автоматически конвертирует char в String. Проверка isEmpty() защищает от пустых строк (если в тексте несколько пробелов подряд, split(" ") создаст пустые строки). Вынесение логики в отдельный метод capitalizeWord — пример принципа единственной ответственности.'
    },
    {
      id: 7,
      title: 'Задача: Сжатие строки',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй простое сжатие строки методом Run-Length Encoding: заменяй последовательности одинаковых символов на символ + количество. Если сжатая строка длиннее — верни исходную.',
      requirements: [
        'Строки для проверки: "aabbbcccc", "abcd", "aaabbbccc"',
        '"aabbbcccc" → "a2b3c4"',
        '"abcd" → "abcd" (сжатая версия "a1b1c1d1" длиннее — возвращаем исходную)',
        '"aaabbbccc" → "a3b3c3"',
        'Выведи исходную строку, сжатую и выбранный результат'
      ],
      expectedOutput: 'Исходная: aabbbcccc → Сжатая: a2b3c4 → Результат: a2b3c4\nИсходная: abcd → Сжатая: a1b1c1d1 → Результат: abcd\nИсходная: aaabbbccc → Сжатая: a3b3c3 → Результат: a3b3c3',
      hint: 'Один проход по строке: храни currentChar = str.charAt(0) и count = 1. Для каждого следующего символа: если он равен currentChar, count++, иначе запиши currentChar + count в result, обнови currentChar и сбрось count = 1. Не забудь записать последнюю группу после цикла.',
      solution: 'public class Main {\n    public static void main(String[] args) {\n        compressAndPrint("aabbbcccc");\n        compressAndPrint("abcd");\n        compressAndPrint("aaabbbccc");\n    }\n\n    static void compressAndPrint(String str) {\n        String compressed = compress(str);\n        String result = (compressed.length() < str.length()) ? compressed : str;\n        System.out.println("Исходная: " + str + " → Сжатая: " + compressed + " → Результат: " + result);\n    }\n\n    static String compress(String str) {\n        if (str == null || str.isEmpty()) return str;\n\n        StringBuilder sb = new StringBuilder();\n        char currentChar = str.charAt(0);\n        int count = 1;\n\n        for (int i = 1; i < str.length(); i++) {\n            if (str.charAt(i) == currentChar) {\n                count++;\n            } else {\n                sb.append(currentChar);\n                sb.append(count);\n                currentChar = str.charAt(i);\n                count = 1;\n            }\n        }\n\n        // Записываем последнюю группу\n        sb.append(currentChar);\n        sb.append(count);\n\n        return sb.toString();\n    }\n}',
      explanation: 'Run-Length Encoding — классический алгоритм сжатия данных. Принцип: считаем подряд идущие одинаковые символы. Алгоритм: инициализируем currentChar первым символом, count = 1. Цикл начинается со второго символа: если текущий символ совпадает с currentChar — увеличиваем count. Если отличается — записываем в результат currentChar и count, обновляем currentChar, сбрасываем count. После цикла обязательно записываем последнюю группу — это распространённая ошибка при реализации. Проверка длины в конце решает задачу "если сжатое длиннее — вернуть исходное".'
    },
    {
      id: 8,
      title: 'Задача: Простая валидация email',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напиши простой валидатор email-адреса. Проверь основные правила: наличие @, наличие точки в домене, отсутствие пробелов, непустые части.',
      requirements: [
        'Адрес должен содержать ровно один символ @',
        'Часть до @ не пустая и не содержит пробелов',
        'Часть после @ содержит точку',
        'Часть после последней точки — от 2 до 6 символов (зона: ru, com, org...)',
        'Проверь: "user@mail.ru", "invalid.email", "@mail.ru", "user@", "user @mail.ru", "user@mail.c"'
      ],
      expectedOutput: '"user@mail.ru": валидный email\n"invalid.email": невалидный email (нет символа @)\n"@mail.ru": невалидный email (пустая часть до @)\n"user@": невалидный email (нет домена)\n"user @mail.ru": невалидный email (есть пробел)\n"user@mail.c": невалидный email (слишком короткая доменная зона)',
      hint: 'Проверяй последовательно: indexOf("@") == lastIndexOf("@") (один @), затем разбивай по @ и проверяй каждую часть. int atIndex = email.indexOf("@"); String local = email.substring(0, atIndex); String domain = email.substring(atIndex + 1);',
      solution: 'public class Main {\n    public static void main(String[] args) {\n        String[] emails = {\n            "user@mail.ru",\n            "invalid.email",\n            "@mail.ru",\n            "user@",\n            "user @mail.ru",\n            "user@mail.c"\n        };\n\n        for (String email : emails) {\n            String result = validateEmail(email);\n            System.out.println("\\"" + email + "\\": " + result);\n        }\n    }\n\n    static String validateEmail(String email) {\n        if (email == null || email.isEmpty()) {\n            return "невалидный email (пустая строка)";\n        }\n\n        // Проверка пробелов\n        if (email.contains(" ")) {\n            return "невалидный email (есть пробел)";\n        }\n\n        // Ровно один символ @\n        int atIndex = email.indexOf("@");\n        if (atIndex == -1) {\n            return "невалидный email (нет символа @)";\n        }\n        if (atIndex != email.lastIndexOf("@")) {\n            return "невалидный email (несколько символов @)";\n        }\n\n        String local = email.substring(0, atIndex);\n        String domain = email.substring(atIndex + 1);\n\n        // Проверка локальной части\n        if (local.isEmpty()) {\n            return "невалидный email (пустая часть до @)";\n        }\n\n        // Проверка домена\n        if (domain.isEmpty()) {\n            return "невалидный email (нет домена)";\n        }\n\n        int dotIndex = domain.lastIndexOf(".");\n        if (dotIndex == -1) {\n            return "невалидный email (нет точки в домене)";\n        }\n\n        String tld = domain.substring(dotIndex + 1);\n        if (tld.length() < 2 || tld.length() > 6) {\n            return "невалидный email (слишком короткая доменная зона)";\n        }\n\n        return "валидный email";\n    }\n}',
      explanation: 'Валидация email строится на последовательных проверках. Порядок важен: сначала пробелы (простая проверка), потом наличие @, потом анализ частей. indexOf("@") возвращает -1 если символ не найден. Сравнение atIndex == lastIndexOf("@") гарантирует ровно один @: если @ одна — оба метода вернут один и тот же индекс. substring(0, atIndex) — часть до @, substring(atIndex + 1) — часть после @. lastIndexOf(".") в домене находит последнюю точку, а substring(dotIndex + 1) — доменную зону (TLD). Реальная валидация email намного сложнее и обычно делается через регулярные выражения или специальные библиотеки.'
    },
    {
      id: 9,
      title: 'Задача: Шифр Цезаря для строки',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй шифр Цезаря для полной строки: зашифруй и расшифруй сообщение, сохраняя регистр букв и не трогая небуквенные символы.',
      requirements: [
        'Строка: String message = "Hello, World! Java 2024."',
        'Сдвиг: int shift = 13 (ROT13)',
        'Заглавные буквы остаются заглавными, строчные — строчными',
        'Пробелы, цифры, знаки препинания не шифруются',
        'Расшифровка — это шифрование с отрицательным сдвигом (или сдвигом 26 - shift)',
        'Выведи исходную, зашифрованную и расшифрованную строки'
      ],
      expectedOutput: 'Исходная:     Hello, World! Java 2024.\nЗашифрованная: Uryyb, Jbeyq! Wnin 2024.\nРасшифрованная: Hello, World! Java 2024.',
      hint: 'Для каждого символа: если заглавная — base = \'A\', если строчная — base = \'a\'. Зашифрованный символ: (char)(base + (c - base + shift) % 26). Небуквы добавляй без изменений.',
      solution: 'public class Main {\n    public static void main(String[] args) {\n        String message = "Hello, World! Java 2024.";\n        int shift = 13;\n\n        String encrypted = caesarCipher(message, shift);\n        String decrypted = caesarCipher(encrypted, 26 - shift);\n\n        System.out.println("Исходная:     " + message);\n        System.out.println("Зашифрованная: " + encrypted);\n        System.out.println("Расшифрованная: " + decrypted);\n    }\n\n    static String caesarCipher(String text, int shift) {\n        shift = ((shift % 26) + 26) % 26;  // нормализуем сдвиг\n        StringBuilder result = new StringBuilder();\n\n        for (int i = 0; i < text.length(); i++) {\n            char c = text.charAt(i);\n\n            if (Character.isUpperCase(c)) {\n                result.append((char)(\'A\' + (c - \'A\' + shift) % 26));\n            } else if (Character.isLowerCase(c)) {\n                result.append((char)(\'a\' + (c - \'a\' + shift) % 26));\n            } else {\n                result.append(c);  // не буква — без изменений\n            }\n        }\n\n        return result.toString();\n    }\n}',
      explanation: 'Шифр Цезаря для строки расширяет логику шифрования одного символа на весь текст. Для каждого символа определяем его базу: \'A\' для заглавных, \'a\' для строчных. Формула (c - base + shift) % 26 вычисляет позицию в алфавите со сдвигом. Добавление base обратно даёт нужный ASCII-код. Небуквы (пробелы, цифры, знаки) добавляем без изменений — это принципиально для читаемости зашифрованного текста. ROT13 — особый случай шифра Цезаря со сдвигом 13: зашифровывание и расшифровывание выполняется одной функцией, т.к. 13 + 13 = 26. Нормализация shift = ((shift % 26) + 26) % 26 корректно обрабатывает отрицательные сдвиги.'
    },
    {
      id: 10,
      title: 'Задача: Самое длинное слово в предложении',
      type: 'practice',
      difficulty: 'hard',
      description: 'Найди самое длинное слово в предложении. При нескольких словах одинаковой максимальной длины выведи все. Очищай слова от знаков препинания.',
      requirements: [
        'Предложение: String sentence = "Программирование на Java — это интересно и увлекательно!"',
        'Убирай знаки препинания (.,:;!?-—) из начала и конца каждого слова',
        'Найди максимальную длину слова',
        'Выведи все слова с максимальной длиной',
        'Выведи количество букв в самом длинном слове'
      ],
      expectedOutput: 'Предложение: Программирование на Java — это интересно и увлекательно!\nСамое длинное слово: программирование (16 букв)\nТакже 16 букв: увлекательно',
      hint: 'Разбей по пробелам, очисти каждое слово от знаков препинания через replaceAll("[^а-яёА-ЯЁa-zA-Z]", ""). Найди maxLen, затем во втором проходе собери все слова с длиной == maxLen.',
      solution: 'public class Main {\n    public static void main(String[] args) {\n        String sentence = "Программирование на Java — это интересно и увлекательно!";\n\n        System.out.println("Предложение: " + sentence);\n\n        String[] rawWords = sentence.split("\\\\s+");\n\n        // Очистка слов от знаков препинания\n        String[] words = new String[rawWords.length];\n        for (int i = 0; i < rawWords.length; i++) {\n            // Убираем всё кроме букв\n            words[i] = rawWords[i].replaceAll("[^а-яёА-ЯЁa-zA-Z]", "");\n        }\n\n        // Поиск максимальной длины\n        int maxLen = 0;\n        for (String word : words) {\n            if (word.length() > maxLen) {\n                maxLen = word.length();\n            }\n        }\n\n        // Сбор слов с максимальной длиной\n        boolean firstFound = false;\n        String firstWord = "";\n\n        for (String word : words) {\n            if (word.length() == maxLen && !word.isEmpty()) {\n                if (!firstFound) {\n                    firstWord = word.toLowerCase();\n                    firstFound = true;\n                } else {\n                    if (firstFound && firstWord.equals(word.toLowerCase())) continue;\n                    System.out.println("Самое длинное слово: " + firstWord + " (" + maxLen + " букв)");\n                    System.out.println("Также " + maxLen + " букв: " + word.toLowerCase());\n                    firstFound = false;\n                    return;\n                }\n            }\n        }\n\n        if (firstFound) {\n            System.out.println("Самое длинное слово: " + firstWord + " (" + maxLen + " букв)");\n        }\n    }\n}',
      explanation: 'Задача сложнее из-за необходимости очистки знаков препинания. replaceAll("[^а-яёА-ЯЁa-zA-Z]", "") использует регулярное выражение: [^...] означает "любой символ кроме перечисленных". Мы оставляем только кириллицу, ё и латинские буквы, всё остальное заменяем на пустую строку. Алгоритм двухпроходный: первый проход находит maxLen, второй — собирает все слова такой длины. Тире (—) между словами отсутствует в наборе букв и удаляется из слов при очистке. Слово toLowerCase() применяется для единообразного вывода.'
    }
  ]
}
