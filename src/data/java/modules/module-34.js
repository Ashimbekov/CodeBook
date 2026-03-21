export default {
  id: 34,
  title: 'Stream API: продвинутый',
  description: 'Продвинутые возможности Stream API: flatMap, reduce, группировка, параллельные стримы и лучшие практики',
  lessons: [
    {
      id: 1,
      title: 'flatMap — разворачивание вложенных коллекций',
      type: 'theory',
      content: [
        { type: 'text', value: 'flatMap() — как map(), но умеет "разворачивать" вложенные коллекции. Если у тебя есть список списков, flatMap превратит его в один плоский список.' },
        { type: 'tip', value: 'Представь коробку, в которой лежат пакеты, а в каждом пакете — конфеты. map() вернёт стрим из пакетов, а flatMap() "откроет" все пакеты и вернёт стрим из самих конфет.' },
        { type: 'code', language: 'java', value: 'List<List<Integer>> matrix = Arrays.asList(\n    Arrays.asList(1, 2, 3),\n    Arrays.asList(4, 5, 6),\n    Arrays.asList(7, 8, 9)\n);\n\n// flatMap превращает список списков в один список\nList<Integer> flat = matrix.stream()\n    .flatMap(Collection::stream)\n    .collect(Collectors.toList());\nSystem.out.println(flat); // [1, 2, 3, 4, 5, 6, 7, 8, 9]' },
        { type: 'heading', value: 'Реальный пример: слова из предложений' },
        { type: 'code', language: 'java', value: 'List<String> sentences = Arrays.asList(\n    "Привет мир Java",\n    "Stream API это круто",\n    "Учимся программировать"\n);\n\n// Получить все отдельные слова\nList<String> words = sentences.stream()\n    .flatMap(sentence -> Arrays.stream(sentence.split(" ")))\n    .collect(Collectors.toList());\nSystem.out.println(words);\n// [Привет, мир, Java, Stream, API, это, круто, Учимся, программировать]' },
        { type: 'heading', value: 'flatMap vs map: разница' },
        { type: 'code', language: 'java', value: 'List<String> words2 = Arrays.asList("Hello", "World");\n\n// map — возвращает Stream<char[]> (поток массивов)\nStream<char[]> mapped = words2.stream()\n    .map(String::toCharArray);\n\n// flatMap — возвращает Stream<Character> (поток символов)\n// Нужна дополнительная обёртка:\nwords2.stream()\n    .flatMap(w -> w.chars().mapToObj(c -> (char) c))\n    .forEach(System.out::print);\n// HelloWorld' },
        { type: 'note', value: 'flatMap применяется когда твоя функция возвращает Stream, и ты хочешь объединить все эти стримы в один, а не получить Stream<Stream<T>>.' }
      ]
    },
    {
      id: 2,
      title: 'reduce — свёртка элементов',
      type: 'theory',
      content: [
        { type: 'text', value: 'reduce() — операция, которая "сворачивает" все элементы стрима в одно значение. Она берёт два элемента, делает из них один, потом берёт результат и следующий элемент, и так пока все не обработает.' },
        { type: 'tip', value: 'Представь как ты складываешь стопку блинов: берёшь первый и второй блин — получаешь "стопку из двух". Добавляешь третий — "стопка из трёх". И так, пока все блины не сложишь в одну стопку. reduce() делает то же самое с числами или данными.' },
        { type: 'code', language: 'java', value: 'List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);\n\n// Сумма: 1+2=3, 3+3=6, 6+4=10, 10+5=15\nOptional<Integer> sum = numbers.stream()\n    .reduce((a, b) -> a + b);\nSystem.out.println(sum.get()); // 15\n\n// С начальным значением (identity)\nint sumWithStart = numbers.stream()\n    .reduce(0, (a, b) -> a + b);\nSystem.out.println(sumWithStart); // 15' },
        { type: 'heading', value: 'Произведение и другие операции' },
        { type: 'code', language: 'java', value: '// Произведение всех чисел\nint product = numbers.stream()\n    .reduce(1, (a, b) -> a * b);\nSystem.out.println(product); // 120 (1*2*3*4*5)\n\n// Максимальное число\nOptional<Integer> max = numbers.stream()\n    .reduce((a, b) -> a > b ? a : b);\nSystem.out.println(max.get()); // 5\n\n// Конкатенация строк\nList<String> words = Arrays.asList("Я", "учу", "Java");\nString sentence = words.stream()\n    .reduce("", (a, b) -> a + " " + b).trim();\nSystem.out.println(sentence); // Я учу Java' },
        { type: 'heading', value: 'Когда использовать reduce vs sum' },
        { type: 'code', language: 'java', value: '// Для чисел лучше использовать готовые методы:\nnumbers.stream().mapToInt(Integer::intValue).sum();    // проще\nnumbers.stream().reduce(0, Integer::sum);              // тоже работает\n\n// reduce нужен для нестандартных операций' },
        { type: 'warning', value: 'reduce() без начального значения (identity) возвращает Optional, так как стрим может быть пустым. С начальным значением — возвращает само значение.' }
      ]
    },
    {
      id: 3,
      title: 'groupingBy — группировка элементов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Collectors.groupingBy() — один из самых мощных инструментов. Он группирует элементы по какому-то признаку и возвращает Map, где ключ — признак, а значение — список элементов.' },
        { type: 'tip', value: 'Представь список учеников. groupingBy() — это как разложить их по партам по классам: в один ящик — все из 9А, в другой — из 9Б. Ключ ящика — класс, содержимое — список учеников этого класса.' },
        { type: 'code', language: 'java', value: 'List<String> names = Arrays.asList(\n    "Анна", "Алексей", "Борис", "Виктор", "Артём", "Вика"\n);\n\n// Группируем по первой букве\nMap<Character, List<String>> byLetter = names.stream()\n    .collect(Collectors.groupingBy(name -> name.charAt(0)));\nSystem.out.println(byLetter);\n// {А=[Анна, Алексей, Артём], Б=[Борис], В=[Виктор, Вика]}' },
        { type: 'heading', value: 'Группировка объектов' },
        { type: 'code', language: 'java', value: 'class Product {\n    String name;\n    String category;\n    double price;\n    Product(String name, String category, double price) {\n        this.name = name; this.category = category; this.price = price;\n    }\n    public String toString() { return name + "(" + price + ")"; }\n}\n\nList<Product> products = Arrays.asList(\n    new Product("Молоко", "Молочные", 150.0),\n    new Product("Кефир", "Молочные", 120.0),\n    new Product("Хлеб", "Выпечка", 80.0),\n    new Product("Батон", "Выпечка", 90.0),\n    new Product("Сыр", "Молочные", 400.0)\n);\n\nMap<String, List<Product>> byCategory = products.stream()\n    .collect(Collectors.groupingBy(p -> p.category));\nbyCategory.forEach((cat, prods) ->\n    System.out.println(cat + ": " + prods));' },
        { type: 'heading', value: 'groupingBy + downstream collector' },
        { type: 'code', language: 'java', value: '// Посчитать количество в каждой группе\nMap<String, Long> countByCategory = products.stream()\n    .collect(Collectors.groupingBy(\n        p -> p.category,\n        Collectors.counting()\n    ));\nSystem.out.println(countByCategory); // {Молочные=3, Выпечка=2}\n\n// Средняя цена по категориям\nMap<String, Double> avgByCategory = products.stream()\n    .collect(Collectors.groupingBy(\n        p -> p.category,\n        Collectors.averagingDouble(p -> p.price)\n    ));\nSystem.out.println(avgByCategory); // {Молочные=223.33..., Выпечка=85.0}' },
        { type: 'note', value: 'groupingBy() всегда возвращает Map<K, List<V>> если не указать downstream collector. С downstream — можно получить Map<K, Long>, Map<K, Double> и т.д.' }
      ]
    },
    {
      id: 4,
      title: 'partitioningBy — деление на две группы',
      type: 'theory',
      content: [
        { type: 'text', value: 'partitioningBy() — частный случай groupingBy(), который делит элементы ровно на две группы: true и false. Удобен когда нужно разделить по условию.' },
        { type: 'tip', value: 'Как сортировщик яблок: "это яблоко спелое? Да — в одну корзину, нет — в другую". partitioningBy всегда даёт ровно два ведра: true и false.' },
        { type: 'code', language: 'java', value: 'List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);\n\n// Делим на чётные и нечётные\nMap<Boolean, List<Integer>> evenOdd = numbers.stream()\n    .collect(Collectors.partitioningBy(n -> n % 2 == 0));\n\nSystem.out.println("Чётные: " + evenOdd.get(true));\n// Чётные: [2, 4, 6, 8, 10]\nSystem.out.println("Нечётные: " + evenOdd.get(false));\n// Нечётные: [1, 3, 5, 7, 9]' },
        { type: 'heading', value: 'Партиция с downstream' },
        { type: 'code', language: 'java', value: 'List<String> names = Arrays.asList("Анна", "Борис", "Александра", "Вик", "Дмитрий");\n\n// Делим длинные и короткие имена, и подсчитываем\nMap<Boolean, Long> partition = names.stream()\n    .collect(Collectors.partitioningBy(\n        name -> name.length() > 4,\n        Collectors.counting()\n    ));\nSystem.out.println("Длинных: " + partition.get(true));   // 3\nSystem.out.println("Коротких: " + partition.get(false)); // 2' },
        { type: 'heading', value: 'partitioningBy vs groupingBy' },
        { type: 'code', language: 'java', value: '// groupingBy для нескольких категорий\nMap<String, List<String>> grouped = names.stream()\n    .collect(Collectors.groupingBy(name -> {\n        if (name.length() <= 3) return "короткое";\n        else if (name.length() <= 5) return "среднее";\n        else return "длинное";\n    }));\nSystem.out.println(grouped);' },
        { type: 'note', value: 'Используй partitioningBy когда результат — это чёткое "да/нет" (условие возвращает boolean). Для более сложной классификации — groupingBy.' }
      ]
    },
    {
      id: 5,
      title: 'Лучшие практики Stream pipeline',
      type: 'theory',
      content: [
        { type: 'text', value: 'Stream API очень мощный, но его легко использовать неправильно. Рассмотрим лучшие практики написания стрим-пайплайнов.' },
        { type: 'heading', value: '1. Порядок операций имеет значение' },
        { type: 'code', language: 'java', value: 'List<String> names = Arrays.asList("Александр", "Аня", "Борис", "Алексей", "Вик");\n\n// ПЛОХО: сначала map (преобразуем 5 элементов), потом filter\nnames.stream()\n    .map(String::toUpperCase)   // 5 операций\n    .filter(n -> n.length() > 5) // 5 проверок\n    .collect(Collectors.toList());\n\n// ХОРОШО: сначала filter (меньше элементов для map), потом map\nnames.stream()\n    .filter(n -> n.length() > 5) // 5 проверок\n    .map(String::toUpperCase)    // только 3 операции!\n    .collect(Collectors.toList());' },
        { type: 'heading', value: '2. Не злоупотребляй вложенными стримами' },
        { type: 'code', language: 'java', value: '// ПЛОХО — трудно читать\nList<String> result = list.stream()\n    .filter(s -> s.chars().anyMatch(Character::isDigit))\n    .map(s -> s.chars()\n        .filter(Character::isLetter)\n        .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)\n        .toString())\n    .collect(Collectors.toList());\n\n// ХОРОШО — выносим сложную логику в метод\nprivate static String removeDigits(String s) {\n    return s.replaceAll("\\\\d", "");\n}\n// ...\nList<String> result2 = list.stream()\n    .filter(s -> s.chars().anyMatch(Character::isDigit))\n    .map(Main::removeDigits)\n    .collect(Collectors.toList());' },
        { type: 'heading', value: '3. distinct, sorted, limit, skip' },
        { type: 'code', language: 'java', value: 'List<Integer> nums = Arrays.asList(5, 3, 1, 3, 5, 2, 4, 2);\n\n// distinct() убирает дубликаты\nnums.stream().distinct().forEach(n -> System.out.print(n + " "));\n// 5 3 1 2 4\n\n// sorted() сортирует\nnums.stream().sorted().forEach(n -> System.out.print(n + " "));\n// 1 2 2 3 3 4 5 5\n\n// limit(N) берёт первые N элементов\nnums.stream().sorted().limit(3).forEach(n -> System.out.print(n + " "));\n// 1 2 2\n\n// skip(N) пропускает первые N элементов\nnums.stream().sorted().skip(5).forEach(n -> System.out.print(n + " "));\n// 4 5 5' },
        { type: 'tip', value: 'Стрим читается как предложение: "Возьми список, отфильтруй такие, преобразуй вот так, возьми первые 5, собери в список". Пиши операции в том порядке, в котором думаешь о задаче.' }
      ]
    },
    {
      id: 6,
      title: 'Параллельные стримы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Параллельный стрим использует несколько процессорных ядер одновременно для ускорения обработки больших данных. Вместо .stream() используй .parallelStream().' },
        { type: 'tip', value: 'Обычный стрим — один рабочий на конвейере. Параллельный стрим — несколько рабочих делают одну и ту же работу, но каждый на своём участке ленты. В конце результаты объединяются.' },
        { type: 'code', language: 'java', value: 'List<Integer> bigList = new ArrayList<>();\nfor (int i = 0; i < 10_000_000; i++) bigList.add(i);\n\n// Обычный стрим\nlong start1 = System.currentTimeMillis();\nlong sum1 = bigList.stream()\n    .mapToLong(Integer::intValue)\n    .sum();\nlong time1 = System.currentTimeMillis() - start1;\n\n// Параллельный стрим\nlong start2 = System.currentTimeMillis();\nlong sum2 = bigList.parallelStream()\n    .mapToLong(Integer::intValue)\n    .sum();\nlong time2 = System.currentTimeMillis() - start2;\n\nSystem.out.println("Обычный: " + time1 + "мс, результат: " + sum1);\nSystem.out.println("Параллельный: " + time2 + "мс, результат: " + sum2);' },
        { type: 'heading', value: 'Когда использовать параллельные стримы' },
        { type: 'list', items: [
          'Большие данные (100 000+ элементов)',
          'Операции независимы друг от друга (нет общего состояния)',
          'Операции занимают заметное время (сложные вычисления)',
          'Порядок результата не важен'
        ]},
        { type: 'warning', value: 'Параллельные стримы НЕ всегда быстрее! Для маленьких списков накладные расходы на создание потоков перевешивают выигрыш. Также опасны операции с общим изменяемым состоянием.' },
        { type: 'code', language: 'java', value: '// ОПАСНО: race condition в параллельном стриме\nList<Integer> results = new ArrayList<>(); // не потокобезопасный!\nlist.parallelStream()\n    .filter(n -> n > 10)\n    .forEach(results::add); // ОШИБКА! несколько потоков меняют один список\n\n// ПРАВИЛЬНО: используй collect()\nList<Integer> results2 = list.parallelStream()\n    .filter(n -> n > 10)\n    .collect(Collectors.toList()); // потокобезопасно!' },
        { type: 'note', value: 'collect() безопасен в параллельном стриме, потому что использует специальный механизм слияния результатов.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: продвинутый Stream API',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реши комплексные задачи с использованием flatMap, reduce и groupingBy.',
      requirements: [
        'Создай список предложений: ["Hello World Java", "Stream API is great", "Java is awesome"]',
        'С помощью flatMap получи список всех слов (split по пробелу)',
        'Подсчитай общее количество символов во всех словах (через reduce)',
        'Сгруппируй слова по длине (Map<Integer, List<String>>)',
        'Выведи группу слов длиной 4 символа'
      ],
      expectedOutput: 'Все слова: [Hello, World, Java, Stream, API, is, great, Java, is, awesome]\nОбщее количество символов: 44\nСлова по длине:\n4 -> [Java, Java]\n5 -> [Hello, World, great]\n6 -> [Stream]\n7 -> [awesome]\n2 -> [is, is]\n3 -> [API]\nСлова длиной 4: [Java, Java]',
      hint: 'Для flatMap используй: .flatMap(s -> Arrays.stream(s.split(" "))). Для reduce: .mapToInt(String::length).sum() или .reduce(0, (acc, w) -> acc + w.length()). Для groupingBy: Collectors.groupingBy(String::length).',
      solution: 'import java.util.*;\nimport java.util.stream.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<String> sentences = Arrays.asList(\n            "Hello World Java",\n            "Stream API is great",\n            "Java is awesome"\n        );\n\n        List<String> words = sentences.stream()\n            .flatMap(s -> Arrays.stream(s.split(" ")))\n            .collect(Collectors.toList());\n        System.out.println("Все слова: " + words);\n\n        int totalChars = words.stream()\n            .reduce(0, (acc, w) -> acc + w.length(), Integer::sum);\n        System.out.println("Общее количество символов: " + totalChars);\n\n        Map<Integer, List<String>> byLength = words.stream()\n            .collect(Collectors.groupingBy(String::length));\n        System.out.println("Слова по длине:");\n        byLength.forEach((len, ws) -> System.out.println(len + " -> " + ws));\n\n        System.out.println("Слова длиной 4: " + byLength.get(4));\n    }\n}',
      explanation: 'flatMap превращает поток предложений в поток отдельных слов — это ключевой момент. reduce с тремя аргументами (identity, accumulator, combiner) нужен для правильной работы в параллельном режиме. groupingBy(String::length) — элегантный способ сгруппировать строки по длине.'
    }
  ]
}
