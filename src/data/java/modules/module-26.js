export default {
  id: 26,
  title: 'HashMap',
  description: 'Изучаем HashMap — коллекцию для хранения пар ключ-значение, самую быстрый способ находить данные по ключу',
  lessons: [
    {
      id: 1, title: 'Концепция пар ключ-значение', type: 'theory',
      content: [
        { type: 'text', value: 'HashMap хранит данные в виде пар: ключ → значение. Как словарь: слово (ключ) — его перевод (значение). Или как телефонная книга: имя (ключ) — номер телефона (значение).' },
        { type: 'tip', value: 'Представь HashMap как шкафчики в школе. У каждого шкафчика есть номер (ключ) и содержимое (значение). Ты говоришь: "Дай мне шкафчик номер 42!" — и мгновенно получаешь, не перебирая все подряд.' },
        { type: 'heading', value: 'Создание HashMap' },
        { type: 'code', language: 'java', value: 'import java.util.HashMap;\n\npublic class Main {\n    public static void main(String[] args) {\n        // HashMap<ТипКлюча, ТипЗначения>\n        HashMap<String, String> phoneBook = new HashMap<>();\n\n        // Добавляем пары ключ-значение через put()\n        phoneBook.put("Иван", "+7-777-111-22-33");\n        phoneBook.put("Мария", "+7-777-444-55-66");\n        phoneBook.put("Пётр", "+7-777-777-88-99");\n\n        System.out.println(phoneBook);\n        // {Иван=+7-777-111-22-33, Мария=+7-777-444-55-66, Пётр=+7-777-777-88-99}\n    }\n}' },
        { type: 'heading', value: 'Разные типы ключей и значений' },
        { type: 'code', language: 'java', value: '// Ключ String, значение Integer\nHashMap<String, Integer> ages = new HashMap<>();\nages.put("Иван", 25);\nages.put("Мария", 30);\n\n// Ключ Integer, значение String\nHashMap<Integer, String> students = new HashMap<>();\nstudents.put(1, "Иванов Иван");\nstudents.put(2, "Петрова Мария");\n\n// Ключ String, значение Double\nHashMap<String, Double> prices = new HashMap<>();\nprices.put("Молоко", 350.0);\nprices.put("Хлеб", 180.0);' },
        { type: 'note', value: 'HashMap не гарантирует порядок элементов! Если тебе важен порядок — используй LinkedHashMap (сохраняет порядок добавления) или TreeMap (сортирует по ключам).' },
        { type: 'warning', value: 'Ключи в HashMap должны быть уникальными! Если добавить элемент с уже существующим ключом, старое значение перезапишется новым.' }
      ]
    },
    {
      id: 2, title: 'put(), get(), remove()', type: 'theory',
      content: [
        { type: 'text', value: 'Три основные операции с HashMap: put — добавить/обновить, get — получить, remove — удалить.' },
        { type: 'heading', value: 'put() — добавить или обновить' },
        { type: 'code', language: 'java', value: 'import java.util.HashMap;\n\npublic class Main {\n    public static void main(String[] args) {\n        HashMap<String, Integer> scores = new HashMap<>();\n\n        // Добавляем\n        scores.put("Алиса", 100);\n        scores.put("Боб", 85);\n        scores.put("Карл", 92);\n\n        System.out.println(scores); // {Алиса=100, Боб=85, Карл=92}\n\n        // Обновляем — put с существующим ключом перезапишет значение\n        scores.put("Боб", 95);\n        System.out.println(scores); // {Алиса=100, Боб=95, Карл=92}\n\n        System.out.println("Размер: " + scores.size()); // 3\n    }\n}' },
        { type: 'heading', value: 'get() — получить значение по ключу' },
        { type: 'code', language: 'java', value: 'HashMap<String, String> capitals = new HashMap<>();\ncapitals.put("Казахстан", "Астана");\ncapitals.put("Россия", "Москва");\ncapitals.put("Германия", "Берлин");\n\n// Получаем значение по ключу — мгновенно!\nSystem.out.println(capitals.get("Казахстан")); // Астана\nSystem.out.println(capitals.get("Россия"));    // Москва\n\n// Если ключ не найден — возвращает null\nSystem.out.println(capitals.get("Марс"));      // null\n\n// getOrDefault — вернуть значение по умолчанию если ключ не найден\nString capital = capitals.getOrDefault("Марс", "Неизвестно");\nSystem.out.println(capital); // Неизвестно' },
        { type: 'heading', value: 'remove() — удалить пару' },
        { type: 'code', language: 'java', value: 'HashMap<String, Integer> inventory = new HashMap<>();\ninventory.put("Яблоки", 50);\ninventory.put("Бананы", 30);\ninventory.put("Манго", 20);\n\nSystem.out.println("До: " + inventory);\n\n// Удалить по ключу\ninventory.remove("Манго");\nSystem.out.println("После: " + inventory);\n\n// Удалить только если значение совпадает (защита от случайного удаления)\ninventory.remove("Яблоки", 100); // НЕ удалит, значение 50, а не 100\nSystem.out.println("Яблоки: " + inventory.get("Яблоки")); // 50\n\ninventory.remove("Яблоки", 50); // Удалит, значение совпало\nSystem.out.println(inventory);' }
      ]
    },
    {
      id: 3, title: 'containsKey() и containsValue()', type: 'theory',
      content: [
        { type: 'text', value: 'Прежде чем получать или удалять элемент, часто нужно проверить — а есть ли он вообще? Для этого есть containsKey() и containsValue().' },
        { type: 'code', language: 'java', value: 'import java.util.HashMap;\n\npublic class Main {\n    public static void main(String[] args) {\n        HashMap<String, Integer> wordCount = new HashMap<>();\n        wordCount.put("привет", 5);\n        wordCount.put("мир", 3);\n        wordCount.put("java", 10);\n\n        // Проверить наличие КЛЮЧА\n        System.out.println(wordCount.containsKey("java"));  // true\n        System.out.println(wordCount.containsKey("python")); // false\n\n        // Проверить наличие ЗНАЧЕНИЯ\n        System.out.println(wordCount.containsValue(3));   // true\n        System.out.println(wordCount.containsValue(99));  // false\n    }\n}' },
        { type: 'heading', value: 'Паттерн: безопасное получение' },
        { type: 'code', language: 'java', value: 'HashMap<String, String> userEmails = new HashMap<>();\nuserEmails.put("ivan", "ivan@mail.ru");\nuserEmails.put("maria", "maria@gmail.com");\n\n// Безопасный способ 1: проверить перед get()\nString username = "anna";\nif (userEmails.containsKey(username)) {\n    System.out.println("Email: " + userEmails.get(username));\n} else {\n    System.out.println("Пользователь не найден");\n}\n\n// Безопасный способ 2: getOrDefault()\nString email = userEmails.getOrDefault(username, "нет email");\nSystem.out.println("Email: " + email);' },
        { type: 'heading', value: 'Паттерн: счётчик частоты' },
        { type: 'code', language: 'java', value: 'HashMap<String, Integer> frequency = new HashMap<>();\nString[] words = {"яблоко", "банан", "яблоко", "яблоко", "банан", "манго"};\n\nfor (String word : words) {\n    // Если слово уже есть — увеличить счётчик\n    // Если нет — начать с 1\n    frequency.put(word, frequency.getOrDefault(word, 0) + 1);\n}\n\nSystem.out.println(frequency);\n// {яблоко=3, банан=2, манго=1}' },
        { type: 'tip', value: 'Паттерн "счётчик частоты" с getOrDefault — один из самых полезных приёмов с HashMap. Запомни его!' }
      ]
    },
    {
      id: 4, title: 'Итерирование HashMap', type: 'theory',
      content: [
        { type: 'text', value: 'В HashMap нет индексов, поэтому нельзя написать get(0). Для перебора всех элементов используют keySet(), values() и entrySet().' },
        { type: 'heading', value: 'keySet() — перебор ключей' },
        { type: 'code', language: 'java', value: 'import java.util.HashMap;\n\npublic class Main {\n    public static void main(String[] args) {\n        HashMap<String, Integer> ages = new HashMap<>();\n        ages.put("Анна", 25);\n        ages.put("Борис", 30);\n        ages.put("Виктор", 28);\n\n        // Получаем набор всех ключей\n        for (String name : ages.keySet()) {\n            System.out.println(name + " -> " + ages.get(name));\n        }\n    }\n}' },
        { type: 'heading', value: 'values() — перебор значений' },
        { type: 'code', language: 'java', value: 'HashMap<String, Integer> scores = new HashMap<>();\nscores.put("Алиса", 90);\nscores.put("Боб", 85);\nscores.put("Карл", 95);\n\n// Только значения\nint total = 0;\nfor (int score : scores.values()) {\n    total += score;\n    System.out.println("Очки: " + score);\n}\nSystem.out.println("Итого: " + total);' },
        { type: 'heading', value: 'entrySet() — перебор пар ключ-значение (лучший способ)' },
        { type: 'code', language: 'java', value: 'import java.util.HashMap;\nimport java.util.Map;\n\npublic class Main {\n    public static void main(String[] args) {\n        HashMap<String, String> capitals = new HashMap<>();\n        capitals.put("Казахстан", "Астана");\n        capitals.put("Франция", "Париж");\n        capitals.put("Япония", "Токио");\n\n        // entrySet() возвращает набор пар Map.Entry\n        for (Map.Entry<String, String> entry : capitals.entrySet()) {\n            String country = entry.getKey();\n            String capital = entry.getValue();\n            System.out.println(country + " -> " + capital);\n        }\n    }\n}' },
        { type: 'tip', value: 'entrySet() — самый эффективный способ итерации, потому что тебе не нужно делать отдельный вызов get() для каждого ключа.' }
      ]
    },
    {
      id: 5, title: 'HashMap vs TreeMap', type: 'theory',
      content: [
        { type: 'text', value: 'HashMap и TreeMap оба хранят пары ключ-значение, но отличаются порядком хранения и скоростью операций.' },
        { type: 'heading', value: 'Сравнение HashMap и TreeMap' },
        { type: 'list', items: [
          'HashMap: быстрый (O(1)), порядок непредсказуем',
          'TreeMap: медленнее (O(log n)), элементы отсортированы по ключу',
          'HashMap: ключ может быть null (один раз)',
          'TreeMap: ключ НЕ может быть null',
          'HashMap: используй когда важна скорость',
          'TreeMap: используй когда нужен сортированный порядок'
        ]},
        { type: 'code', language: 'java', value: 'import java.util.HashMap;\nimport java.util.TreeMap;\n\npublic class Main {\n    public static void main(String[] args) {\n        HashMap<String, Integer> hashMap = new HashMap<>();\n        hashMap.put("Банан", 3);\n        hashMap.put("Яблоко", 1);\n        hashMap.put("Апельсин", 2);\n\n        System.out.println("HashMap: " + hashMap);\n        // Порядок непредсказуем!\n        // {Банан=3, Апельсин=2, Яблоко=1} (или другой)\n\n        TreeMap<String, Integer> treeMap = new TreeMap<>();\n        treeMap.put("Банан", 3);\n        treeMap.put("Яблоко", 1);\n        treeMap.put("Апельсин", 2);\n\n        System.out.println("TreeMap: " + treeMap);\n        // Всегда отсортирован по ключу!\n        // {Апельсин=2, Банан=3, Яблоко=1}\n    }\n}' },
        { type: 'heading', value: 'LinkedHashMap — сохраняет порядок добавления' },
        { type: 'code', language: 'java', value: 'import java.util.LinkedHashMap;\n\nLinkedHashMap<String, Integer> linkedMap = new LinkedHashMap<>();\nlinkedMap.put("Первый", 1);\nlinkedMap.put("Второй", 2);\nlinkedMap.put("Третий", 3);\n\nSystem.out.println(linkedMap);\n// {Первый=1, Второй=2, Третий=3}\n// Порядок добавления сохраняется!' }
      ]
    },
    {
      id: 6, title: 'Практика: Словарь', type: 'practice', difficulty: 'easy',
      description: 'Создай программу-словарь для перевода слов с русского на английский.',
      requirements: [
        'Создай HashMap<String, String> с минимум 5 парами слов',
        'Напиши метод для поиска перевода',
        'Если слово не найдено, вывести "Перевод не найден"',
        'Выведи весь словарь в формате "слово -> перевод"',
        'Добавь новое слово в словарь',
        'Удали одно слово'
      ],
      expectedOutput: '=== Словарь ===\nяблоко -> apple\nкнига -> book\nдом -> house\nсобака -> dog\nвода -> water\n\nПеревод "яблоко": apple\nПеревод "компьютер": Перевод не найден\n\nДобавлено: кот -> cat\nУдалено: вода\nСловарь теперь содержит 5 слов',
      hint: 'Используй entrySet() для вывода всего словаря, getOrDefault() для безопасного получения перевода.',
      solution: 'import java.util.HashMap;\nimport java.util.Map;\n\npublic class Main {\n    public static void main(String[] args) {\n        HashMap<String, String> dictionary = new HashMap<>();\n        dictionary.put("яблоко", "apple");\n        dictionary.put("книга", "book");\n        dictionary.put("дом", "house");\n        dictionary.put("собака", "dog");\n        dictionary.put("вода", "water");\n\n        System.out.println("=== Словарь ===");\n        for (Map.Entry<String, String> entry : dictionary.entrySet()) {\n            System.out.println(entry.getKey() + " -> " + entry.getValue());\n        }\n\n        System.out.println();\n        System.out.println("Перевод \\"яблоко\\": " + dictionary.getOrDefault("яблоко", "Перевод не найден"));\n        System.out.println("Перевод \\"компьютер\\": " + dictionary.getOrDefault("компьютер", "Перевод не найден"));\n\n        System.out.println();\n        dictionary.put("кот", "cat");\n        System.out.println("Добавлено: кот -> cat");\n\n        dictionary.remove("вода");\n        System.out.println("Удалено: вода");\n        System.out.println("Словарь теперь содержит " + dictionary.size() + " слов");\n    }\n}',
      explanation: 'HashMap — идеальная структура для словарей: поиск по ключу за O(1). getOrDefault() позволяет элегантно обработать случай отсутствия слова. entrySet() даёт доступ к обоим элементам пары сразу.'
    },
    {
      id: 7, title: 'Практика: Частота слов', type: 'practice', difficulty: 'medium',
      description: 'Напиши программу, которая считает сколько раз каждое слово встречается в тексте.',
      requirements: [
        'Дан текст: "кот сидел на коврике кот спал кот мяукал пёс лаял пёс бегал"',
        'Разбей текст на слова с помощью split(" ")',
        'Посчитай частоту каждого слова через HashMap',
        'Выведи каждое слово и его количество',
        'Найди самое частое слово'
      ],
      expectedOutput: 'кот -> 3\nсидел -> 1\nна -> 1\nковрике -> 1\nспал -> 1\nмяукал -> 1\nпёс -> 2\nлаял -> 1\nбегал -> 1\nСамое частое слово: кот (3 раза)',
      hint: 'Паттерн счётчика: map.put(word, map.getOrDefault(word, 0) + 1). Для поиска максимума перебери значения.',
      solution: 'import java.util.HashMap;\nimport java.util.Map;\n\npublic class Main {\n    public static void main(String[] args) {\n        String text = "кот сидел на коврике кот спал кот мяукал пёс лаял пёс бегал";\n        String[] words = text.split(" ");\n\n        HashMap<String, Integer> freq = new HashMap<>();\n        for (String word : words) {\n            freq.put(word, freq.getOrDefault(word, 0) + 1);\n        }\n\n        for (Map.Entry<String, Integer> entry : freq.entrySet()) {\n            System.out.println(entry.getKey() + " -> " + entry.getValue());\n        }\n\n        // Найти максимум\n        String mostFrequent = "";\n        int maxCount = 0;\n        for (Map.Entry<String, Integer> entry : freq.entrySet()) {\n            if (entry.getValue() > maxCount) {\n                maxCount = entry.getValue();\n                mostFrequent = entry.getKey();\n            }\n        }\n        System.out.println("Самое частое слово: " + mostFrequent + " (" + maxCount + " раза)");\n    }\n}',
      explanation: 'Счётчик частоты через HashMap — классический алгоритм. getOrDefault(word, 0) + 1 читается как "дай мне текущий счётчик (или 0), прибавь 1 и сохрани". Поиск максимума — обычный перебор с отслеживанием максимального значения.'
    },
    {
      id: 8, title: 'Практика: Телефонная книга', type: 'practice', difficulty: 'hard',
      description: 'Создай мини-приложение телефонная книга с операциями добавления, поиска, удаления и вывода контактов.',
      requirements: [
        'Создай HashMap<String, String> для хранения имя -> телефон',
        'Реализуй метод addContact(name, phone)',
        'Реализуй метод findContact(name) — вернуть телефон или сообщение об отсутствии',
        'Реализуй метод deleteContact(name)',
        'Реализуй метод printAllContacts() — вывести отсортированный список',
        'Продемонстрируй все операции'
      ],
      expectedOutput: 'Добавлен: Иван - +7-777-100-00-01\nДобавлен: Мария - +7-777-200-00-02\nДобавлен: Пётр - +7-777-300-00-03\n\nПоиск Мария: +7-777-200-00-02\nПоиск Алексей: Контакт не найден\n\nВсе контакты:\nИван: +7-777-100-00-01\nМария: +7-777-200-00-02\nПётр: +7-777-300-00-03\n\nУдалён: Мария\nВсе контакты:\nИван: +7-777-100-00-01\nПётр: +7-777-300-00-03',
      hint: 'Для отсортированного вывода используй TreeMap или отсортируй keySet() через Collections.sort().',
      solution: 'import java.util.ArrayList;\nimport java.util.Collections;\nimport java.util.HashMap;\n\npublic class Main {\n    static HashMap<String, String> phonebook = new HashMap<>();\n\n    static void addContact(String name, String phone) {\n        phonebook.put(name, phone);\n        System.out.println("Добавлен: " + name + " - " + phone);\n    }\n\n    static void findContact(String name) {\n        String phone = phonebook.getOrDefault(name, "Контакт не найден");\n        System.out.println("Поиск " + name + ": " + phone);\n    }\n\n    static void deleteContact(String name) {\n        if (phonebook.containsKey(name)) {\n            phonebook.remove(name);\n            System.out.println("Удалён: " + name);\n        } else {\n            System.out.println(name + " не найден");\n        }\n    }\n\n    static void printAllContacts() {\n        System.out.println("Все контакты:");\n        ArrayList<String> names = new ArrayList<>(phonebook.keySet());\n        Collections.sort(names);\n        for (String name : names) {\n            System.out.println(name + ": " + phonebook.get(name));\n        }\n    }\n\n    public static void main(String[] args) {\n        addContact("Иван", "+7-777-100-00-01");\n        addContact("Мария", "+7-777-200-00-02");\n        addContact("Пётр", "+7-777-300-00-03");\n        System.out.println();\n\n        findContact("Мария");\n        findContact("Алексей");\n        System.out.println();\n\n        printAllContacts();\n        System.out.println();\n\n        deleteContact("Мария");\n        printAllContacts();\n    }\n}',
      explanation: 'Мы разбили функциональность на методы — это хорошая практика. Для отсортированного вывода создали список из keySet() и отсортировали его. HashMap не гарантирует порядок, но мы можем отсортировать ключи вручную.'
    }
  ]
}
