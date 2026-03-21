export default {
  id: 33,
  title: 'Stream API: основы',
  description: 'Узнаем что такое потоки данных в Java, как их создавать и использовать для фильтрации, преобразования и сбора результатов',
  lessons: [
    {
      id: 1,
      title: 'Что такое Stream API?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Stream API — это способ обрабатывать коллекции данных (списки, массивы) удобно и коротко. Появился в Java 8 и стал одним из самых используемых инструментов.' },
        { type: 'tip', value: 'Представь конвейер на заводе: яблоки едут по ленте, рабочий убирает гнилые, другой режет на дольки, третий упаковывает. Stream — такой же конвейер для данных. Ты описываешь что делать с каждым элементом, а Java выполняет всё по порядку.' },
        { type: 'heading', value: 'Зачем нужен Stream API?' },
        { type: 'text', value: 'Раньше, чтобы найти все числа больше 5 в списке и вывести их, нужно было писать цикл for. Теперь это можно сделать в одну строчку.' },
        { type: 'code', language: 'java', value: '// Старый способ (без Stream)\nList<Integer> numbers = Arrays.asList(1, 3, 7, 2, 9, 4, 6);\nList<Integer> result = new ArrayList<>();\nfor (int n : numbers) {\n    if (n > 5) {\n        result.add(n);\n    }\n}\nSystem.out.println(result); // [7, 9, 6]\n\n// Новый способ (с Stream)\nList<Integer> result2 = numbers.stream()\n    .filter(n -> n > 5)\n    .collect(Collectors.toList());\nSystem.out.println(result2); // [7, 9, 6]' },
        { type: 'heading', value: 'Три части любого стрима' },
        { type: 'list', items: [
          'Источник — откуда берутся данные (список, массив, и т.д.)',
          'Промежуточные операции — что делать с данными (filter, map и др.) — их может быть много',
          'Терминальная операция — собрать результат (collect, forEach, count и др.) — она одна и всегда в конце'
        ]},
        { type: 'code', language: 'java', value: 'numbers.stream()           // источник\n    .filter(n -> n > 5)    // промежуточная операция\n    .map(n -> n * 2)       // ещё одна промежуточная\n    .forEach(System.out::println); // терминальная операция' },
        { type: 'warning', value: 'Стрим нельзя использовать повторно! Как конвейер — после того как все яблоки прошли, он пустой. Если нужно снова обработать данные — вызови .stream() заново.' },
        { type: 'note', value: 'Промежуточные операции "ленивые" — они не выполняются до тех пор, пока не встретят терминальную операцию. Это экономит ресурсы.' }
      ]
    },
    {
      id: 2,
      title: 'Создание стримов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Стрим можно создать из разных источников: из коллекции, из массива, из значений напрямую, или из диапазона чисел.' },
        { type: 'heading', value: 'Из коллекции' },
        { type: 'code', language: 'java', value: 'import java.util.*;\nimport java.util.stream.*;\n\nList<String> names = Arrays.asList("Алина", "Борис", "Виктор");\nStream<String> stream = names.stream();\n\n// Для Set тоже работает\nSet<Integer> numbers = new HashSet<>(Arrays.asList(1, 2, 3, 4, 5));\nStream<Integer> numStream = numbers.stream();' },
        { type: 'heading', value: 'Из массива' },
        { type: 'code', language: 'java', value: 'int[] arr = {5, 10, 15, 20};\nIntStream intStream = Arrays.stream(arr);\n\nString[] words = {"яблоко", "банан", "груша"};\nStream<String> wordStream = Arrays.stream(words);' },
        { type: 'heading', value: 'Из значений напрямую: Stream.of()' },
        { type: 'code', language: 'java', value: 'Stream<String> cities = Stream.of("Алматы", "Астана", "Шымкент");\ncities.forEach(System.out::println);\n// Алматы\n// Астана\n// Шымкент' },
        { type: 'heading', value: 'Диапазон чисел: IntStream.range()' },
        { type: 'code', language: 'java', value: '// range(1, 6) — числа от 1 до 5 (не включая 6)\nIntStream.range(1, 6).forEach(System.out::println);\n// 1, 2, 3, 4, 5\n\n// rangeClosed(1, 5) — числа от 1 до 5 (включая 5)\nIntStream.rangeClosed(1, 5).forEach(System.out::println);\n// 1, 2, 3, 4, 5' },
        { type: 'heading', value: 'Пустой стрим' },
        { type: 'code', language: 'java', value: 'Stream<String> empty = Stream.empty();\nSystem.out.println(empty.count()); // 0' },
        { type: 'tip', value: 'Чаще всего ты будешь создавать стримы из List через .stream(). Остальные способы нужны в специфических случаях.' }
      ]
    },
    {
      id: 3,
      title: 'Операция filter — фильтрация',
      type: 'theory',
      content: [
        { type: 'text', value: 'filter() — это как сито: пропускает только те элементы, которые соответствуют условию. Принимает Predicate — функцию, которая для каждого элемента возвращает true или false.' },
        { type: 'tip', value: 'Представь что ты перебираешь письма на почте. filter() — это когда ты откладываешь только письма конкретному получателю, остальные пропускаешь.' },
        { type: 'code', language: 'java', value: 'List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);\n\n// Только чётные числа\nnumbers.stream()\n    .filter(n -> n % 2 == 0)\n    .forEach(System.out::println);\n// 2, 4, 6, 8, 10' },
        { type: 'heading', value: 'Фильтрация строк' },
        { type: 'code', language: 'java', value: 'List<String> names = Arrays.asList("Анна", "Борис", "Алина", "Виктор", "Аскар");\n\n// Имена, начинающиеся на "А"\nnames.stream()\n    .filter(name -> name.startsWith("А"))\n    .forEach(System.out::println);\n// Анна, Алина, Аскар' },
        { type: 'heading', value: 'Несколько filter подряд' },
        { type: 'code', language: 'java', value: 'List<Integer> nums = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20);\n\n// Чётные числа больше 5\nnums.stream()\n    .filter(n -> n % 2 == 0)  // сначала чётные: 2,4,6,8,10,12,20\n    .filter(n -> n > 5)        // потом больше 5: 6,8,10,12,20\n    .forEach(System.out::println);\n// 6, 8, 10, 12, 20' },
        { type: 'heading', value: 'Фильтрация объектов' },
        { type: 'code', language: 'java', value: 'class Student {\n    String name;\n    int grade;\n    Student(String name, int grade) {\n        this.name = name;\n        this.grade = grade;\n    }\n}\n\nList<Student> students = Arrays.asList(\n    new Student("Аида", 90),\n    new Student("Берик", 60),\n    new Student("Дана", 85),\n    new Student("Ерлан", 45)\n);\n\n// Студенты с оценкой выше 70\nstudents.stream()\n    .filter(s -> s.grade > 70)\n    .forEach(s -> System.out.println(s.name + ": " + s.grade));\n// Аида: 90\n// Дана: 85' },
        { type: 'note', value: 'filter() не изменяет исходную коллекцию — он создаёт новый стрим из подходящих элементов.' }
      ]
    },
    {
      id: 4,
      title: 'Операция map — преобразование',
      type: 'theory',
      content: [
        { type: 'text', value: 'map() преобразует каждый элемент стрима в другой элемент. Принимает Function — функцию, которая превращает одно значение в другое.' },
        { type: 'tip', value: 'Представь конвейер на заводе сока: яблоки входят, сок выходит. map() — это та часть, которая делает преобразование. Каждое яблоко превращается в стакан сока.' },
        { type: 'code', language: 'java', value: 'List<String> names = Arrays.asList("алина", "борис", "виктор");\n\n// Сделать все имена с большой буквы\nnames.stream()\n    .map(name -> name.toUpperCase())\n    .forEach(System.out::println);\n// АЛИНА, БОРИС, ВИКТОР' },
        { type: 'heading', value: 'Преобразование типов' },
        { type: 'code', language: 'java', value: 'List<String> numbers = Arrays.asList("1", "2", "3", "4", "5");\n\n// Строки в числа\nList<Integer> ints = numbers.stream()\n    .map(Integer::parseInt)  // "1" -> 1, "2" -> 2, ...\n    .collect(Collectors.toList());\nSystem.out.println(ints); // [1, 2, 3, 4, 5]' },
        { type: 'heading', value: 'map с объектами' },
        { type: 'code', language: 'java', value: 'List<String> words = Arrays.asList("Привет", "Мир", "Java");\n\n// Получить длину каждого слова\nwords.stream()\n    .map(word -> word.length())\n    .forEach(System.out::println);\n// 6, 3, 4' },
        { type: 'heading', value: 'Комбинируем filter и map' },
        { type: 'code', language: 'java', value: 'List<Integer> nums = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8);\n\n// Чётные числа, умноженные на 10\nList<Integer> result = nums.stream()\n    .filter(n -> n % 2 == 0)\n    .map(n -> n * 10)\n    .collect(Collectors.toList());\nSystem.out.println(result); // [20, 40, 60, 80]' },
        { type: 'heading', value: 'mapToInt, mapToDouble — специальные версии' },
        { type: 'code', language: 'java', value: 'List<String> words2 = Arrays.asList("Java", "Python", "C++");\n\n// mapToInt возвращает IntStream\nint totalChars = words2.stream()\n    .mapToInt(String::length)\n    .sum(); // 4 + 6 + 3 = 13\nSystem.out.println(totalChars); // 13' },
        { type: 'note', value: 'map() всегда создаёт новый стрим того же размера, только с преобразованными элементами. В отличие от filter(), количество элементов не меняется.' }
      ]
    },
    {
      id: 5,
      title: 'Операция forEach — действие над каждым',
      type: 'theory',
      content: [
        { type: 'text', value: 'forEach() — терминальная операция, которая выполняет какое-то действие над каждым элементом стрима. После forEach() стрим закрывается.' },
        { type: 'tip', value: 'forEach — как обход всех домов в деревне. Ты заходишь в каждый дом и делаешь что-то (например, раздаёшь газеты). После того как обошёл все дома — работа закончена.' },
        { type: 'code', language: 'java', value: 'List<String> fruits = Arrays.asList("яблоко", "банан", "апельсин");\n\n// Простой вывод\nfruits.stream().forEach(fruit -> System.out.println(fruit));\n// яблоко\n// банан\n// апельсин\n\n// Короче — метод-ссылка\nfruits.stream().forEach(System.out::println);\n// то же самое!' },
        { type: 'heading', value: 'forEach без стрима' },
        { type: 'code', language: 'java', value: '// forEach есть прямо у коллекций (без .stream())\nList<Integer> nums = Arrays.asList(1, 2, 3, 4, 5);\nnums.forEach(n -> System.out.print(n + " "));\n// 1 2 3 4 5' },
        { type: 'heading', value: 'forEach с несколькими операциями' },
        { type: 'code', language: 'java', value: 'List<String> names = Arrays.asList("Аида", "Берик", "Дана");\n\nnames.stream()\n    .filter(name -> name.length() > 4)\n    .forEach(name -> {\n        String upper = name.toUpperCase();\n        System.out.println("Длинное имя: " + upper);\n    });\n// Длинное имя: БЕРИК' },
        { type: 'heading', value: 'forEachOrdered — когда важен порядок' },
        { type: 'code', language: 'java', value: '// В параллельных стримах порядок может нарушиться\n// forEachOrdered гарантирует порядок даже в параллельном стриме\nList<Integer> numbers = Arrays.asList(5, 3, 1, 4, 2);\nnumbers.parallelStream()\n    .forEachOrdered(System.out::println);\n// 5, 3, 1, 4, 2 — порядок сохранён' },
        { type: 'warning', value: 'forEach() не возвращает ничего (void). Это конечная точка конвейера. Если тебе нужно получить результат — используй collect() вместо forEach().' }
      ]
    },
    {
      id: 6,
      title: 'Операция collect — сбор результатов',
      type: 'theory',
      content: [
        { type: 'text', value: 'collect() — терминальная операция, которая собирает элементы стрима в коллекцию или другой результат. Это один из самых важных методов.' },
        { type: 'tip', value: 'collect() — как корзина на конвейере. В конце ленты стоит корзина, и все прошедшие проверку фрукты падают в неё. Корзина — это и есть результат collect().' },
        { type: 'code', language: 'java', value: 'import java.util.stream.Collectors;\n\nList<Integer> nums = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);\n\n// Собрать в List\nList<Integer> evenList = nums.stream()\n    .filter(n -> n % 2 == 0)\n    .collect(Collectors.toList());\nSystem.out.println(evenList); // [2, 4, 6, 8, 10]' },
        { type: 'heading', value: 'Собрать в Set (без дубликатов)' },
        { type: 'code', language: 'java', value: 'List<String> withDupes = Arrays.asList("яблоко", "банан", "яблоко", "груша", "банан");\n\nSet<String> uniqueFruits = withDupes.stream()\n    .collect(Collectors.toSet());\nSystem.out.println(uniqueFruits); // [яблоко, банан, груша] — дубли убраны' },
        { type: 'heading', value: 'Собрать в строку: joining()' },
        { type: 'code', language: 'java', value: 'List<String> names = Arrays.asList("Алина", "Борис", "Виктор");\n\n// Просто склеить\nString joined = names.stream()\n    .collect(Collectors.joining());\nSystem.out.println(joined); // АлинаБорисВиктор\n\n// С разделителем\nString withComma = names.stream()\n    .collect(Collectors.joining(", "));\nSystem.out.println(withComma); // Алина, Борис, Виктор\n\n// С разделителем, началом и концом\nString formatted = names.stream()\n    .collect(Collectors.joining(", ", "[", "]"));\nSystem.out.println(formatted); // [Алина, Борис, Виктор]' },
        { type: 'heading', value: 'Собрать в Map: toMap()' },
        { type: 'code', language: 'java', value: 'List<String> words = Arrays.asList("Java", "Python", "Go");\n\n// Ключ — слово, значение — его длина\nMap<String, Integer> wordLength = words.stream()\n    .collect(Collectors.toMap(\n        word -> word,\n        word -> word.length()\n    ));\nSystem.out.println(wordLength); // {Java=4, Python=6, Go=2}' },
        { type: 'note', value: 'Collectors — это класс с готовыми "коллекторами". Самые популярные: toList(), toSet(), joining(), toMap(), groupingBy() (о нём в следующем модуле).' }
      ]
    },
    {
      id: 7,
      title: 'count, sum, average — статистика',
      type: 'theory',
      content: [
        { type: 'text', value: 'Stream API умеет считать статистику: количество элементов, сумму, минимум, максимум и среднее значение.' },
        { type: 'heading', value: 'count() — количество элементов' },
        { type: 'code', language: 'java', value: 'List<Integer> nums = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);\n\nlong count = nums.stream()\n    .filter(n -> n > 5)\n    .count();\nSystem.out.println(count); // 5 (числа 6,7,8,9,10)' },
        { type: 'heading', value: 'sum(), average() — для чисел (IntStream)' },
        { type: 'code', language: 'java', value: 'List<Integer> numbers = Arrays.asList(10, 20, 30, 40, 50);\n\n// Сумма\nint sum = numbers.stream()\n    .mapToInt(Integer::intValue)\n    .sum();\nSystem.out.println("Сумма: " + sum); // 150\n\n// Среднее значение\nOptionalDouble avg = numbers.stream()\n    .mapToInt(Integer::intValue)\n    .average();\nSystem.out.println("Среднее: " + avg.getAsDouble()); // 30.0' },
        { type: 'heading', value: 'min() и max() — минимум и максимум' },
        { type: 'code', language: 'java', value: 'List<Integer> nums2 = Arrays.asList(5, 3, 8, 1, 9, 2, 7);\n\n// Минимальное\nOptional<Integer> min = nums2.stream()\n    .min(Integer::compareTo);\nSystem.out.println("Минимум: " + min.get()); // 1\n\n// Максимальное\nOptional<Integer> max = nums2.stream()\n    .max(Integer::compareTo);\nSystem.out.println("Максимум: " + max.get()); // 9' },
        { type: 'heading', value: 'summingInt() в Collectors' },
        { type: 'code', language: 'java', value: 'List<String> words = Arrays.asList("Java", "Python", "C++", "Go");\n\n// Сумма длин всех слов\nint totalLength = words.stream()\n    .collect(Collectors.summingInt(String::length));\nSystem.out.println(totalLength); // 4+6+3+2 = 15' },
        { type: 'heading', value: 'IntSummaryStatistics — всё сразу' },
        { type: 'code', language: 'java', value: 'List<Integer> data = Arrays.asList(4, 8, 15, 16, 23, 42);\n\nIntSummaryStatistics stats = data.stream()\n    .mapToInt(Integer::intValue)\n    .summaryStatistics();\n\nSystem.out.println("Кол-во: " + stats.getCount());\nSystem.out.println("Сумма: " + stats.getSum());\nSystem.out.println("Мин: " + stats.getMin());\nSystem.out.println("Макс: " + stats.getMax());\nSystem.out.println("Среднее: " + stats.getAverage());' },
        { type: 'tip', value: 'average() возвращает OptionalDouble, а не просто double — потому что если стрим пустой, среднего нет. Optional — это специальная "обёртка" для значений, которые могут отсутствовать (подробнее в модуле 35).' }
      ]
    },
    {
      id: 8,
      title: 'Практика: Stream API основы',
      type: 'practice',
      difficulty: 'easy',
      description: 'Напиши программу, которая работает со списком имён студентов: фильтрует, преобразует и собирает результаты.',
      requirements: [
        'Создай список: Arrays.asList("Анна", "Борис", "Алексей", "Виктор", "Александра", "Дмитрий")',
        'Найди и выведи все имена длиннее 5 символов',
        'Выведи все имена в верхнем регистре',
        'Посчитай и выведи количество имён, начинающихся на "А"',
        'Собери имена длиннее 4 букв в новый список и выведи его'
      ],
      expectedOutput: 'Имена длиннее 5 символов: [Алексей, Виктор, Александра, Дмитрий]\nВсе имена в верхнем регистре: [АННА, БОРИС, АЛЕКСЕЙ, ВИКТОР, АЛЕКСАНДРА, ДМИТРИЙ]\nИмён на А: 3\nИмена длиннее 4 букв: [Борис, Алексей, Виктор, Александра, Дмитрий]',
      hint: 'Для каждого задания создай отдельный стрим из списка. Используй filter(), map(), count(), collect(Collectors.toList()).',
      solution: 'import java.util.*;\nimport java.util.stream.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<String> names = Arrays.asList("Анна", "Борис", "Алексей", "Виктор", "Александра", "Дмитрий");\n\n        List<String> longNames = names.stream()\n            .filter(n -> n.length() > 5)\n            .collect(Collectors.toList());\n        System.out.println("Имена длиннее 5 символов: " + longNames);\n\n        List<String> upper = names.stream()\n            .map(String::toUpperCase)\n            .collect(Collectors.toList());\n        System.out.println("Все имена в верхнем регистре: " + upper);\n\n        long countA = names.stream()\n            .filter(n -> n.startsWith("А"))\n            .count();\n        System.out.println("Имён на А: " + countA);\n\n        List<String> moreThan4 = names.stream()\n            .filter(n -> n.length() > 4)\n            .collect(Collectors.toList());\n        System.out.println("Имена длиннее 4 букв: " + moreThan4);\n    }\n}',
      explanation: 'Мы создавали новый стрим из одного и того же списка для каждой задачи. Это нормально — стрим из коллекции можно создавать сколько угодно раз. Обрати внимание: count() возвращает long, а не int.'
    },
    {
      id: 9,
      title: 'Практика: Статистика оценок',
      type: 'practice',
      difficulty: 'medium',
      description: 'Обработай список оценок студентов с помощью Stream API и выведи статистику.',
      requirements: [
        'Создай список оценок: Arrays.asList(85, 92, 78, 95, 60, 72, 88, 45, 99, 55)',
        'Выведи количество оценок выше 80',
        'Выведи среднюю оценку всех студентов (округли до 1 знака)',
        'Выведи максимальную и минимальную оценку',
        'Выведи список "отличников" (оценка >= 90) в виде строки через запятую'
      ],
      expectedOutput: 'Оценок выше 80: 4\nСредняя оценка: 76.9\nМаксимум: 99, Минимум: 45\nОтличники: 92, 95, 99',
      hint: 'Для среднего используй .mapToInt().average().getAsDouble(). Для строки из чисел: сначала .map(String::valueOf), потом .collect(Collectors.joining(", ")).',
      solution: 'import java.util.*;\nimport java.util.stream.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Integer> grades = Arrays.asList(85, 92, 78, 95, 60, 72, 88, 45, 99, 55);\n\n        long above80 = grades.stream()\n            .filter(g -> g > 80)\n            .count();\n        System.out.println("Оценок выше 80: " + above80);\n\n        double avg = grades.stream()\n            .mapToInt(Integer::intValue)\n            .average()\n            .getAsDouble();\n        System.out.printf("Средняя оценка: %.1f%n", avg);\n\n        int max = grades.stream().mapToInt(Integer::intValue).max().getAsInt();\n        int min = grades.stream().mapToInt(Integer::intValue).min().getAsInt();\n        System.out.println("Максимум: " + max + ", Минимум: " + min);\n\n        String top = grades.stream()\n            .filter(g -> g >= 90)\n            .map(String::valueOf)\n            .collect(Collectors.joining(", "));\n        System.out.println("Отличники: " + top);\n    }\n}',
      explanation: 'average() возвращает OptionalDouble — поэтому мы вызываем getAsDouble(). Для объединения чисел в строку сначала нужно превратить их в строки через .map(String::valueOf), а потом соединить через joining().'
    }
  ]
}
