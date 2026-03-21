export default {
  id: 24,
  title: 'ArrayList',
  description: 'Изучаем ArrayList — самую популярную коллекцию в Java для хранения списков объектов',
  lessons: [
    {
      id: 1, title: 'Что такое ArrayList?', type: 'theory',
      content: [
        { type: 'text', value: 'ArrayList — это список, который может расти и уменьшаться. В отличие от обычного массива, ему не нужно заранее говорить, сколько элементов он будет хранить.' },
        { type: 'tip', value: 'Представь обычный массив как коробку фиксированного размера — купил коробку на 10 яблок, больше не влезет. ArrayList — как резиновая сумка: кладёшь яблоки, и она сама растягивается. Не хватает места? Она станет больше сама!' },
        { type: 'heading', value: 'Создание ArrayList' },
        { type: 'code', language: 'java', value: 'import java.util.ArrayList;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Создаём список строк\n        ArrayList<String> names = new ArrayList<>();\n\n        // Создаём список чисел\n        ArrayList<Integer> numbers = new ArrayList<>();\n\n        // Создаём список с начальными данными\n        ArrayList<String> fruits = new ArrayList<>();\n        fruits.add("Яблоко");\n        fruits.add("Банан");\n        fruits.add("Апельсин");\n\n        System.out.println(fruits);\n        // [Яблоко, Банан, Апельсин]\n    }\n}' },
        { type: 'heading', value: 'ArrayList vs обычный массив' },
        { type: 'code', language: 'java', value: '// Обычный массив — фиксированный размер\nString[] arr = new String[3]; // ровно 3 элемента, всегда!\n\n// ArrayList — динамический размер\nArrayList<String> list = new ArrayList<>();\nlist.add("Один");   // 1 элемент\nlist.add("Два");    // 2 элемента\nlist.add("Три");    // 3 элемента\nlist.add("Четыре"); // 4 элемента — просто добавляем!' },
        { type: 'note', value: 'В угловых скобках <String>, <Integer> указывается тип элементов — это называется дженерики (generics). ArrayList<String> хранит только строки, ArrayList<Integer> только числа.' },
        { type: 'warning', value: 'ArrayList хранит только объекты, не примитивы. Вместо int используй Integer, вместо double — Double, вместо boolean — Boolean. Java сама автоматически переводит int в Integer (autoboxing).' }
      ]
    },
    {
      id: 2, title: 'Добавление и удаление элементов', type: 'theory',
      content: [
        { type: 'text', value: 'У ArrayList есть методы для добавления и удаления элементов. Это основные операции с любым списком.' },
        { type: 'heading', value: 'Метод add() — добавить элемент' },
        { type: 'code', language: 'java', value: 'import java.util.ArrayList;\n\npublic class Main {\n    public static void main(String[] args) {\n        ArrayList<String> list = new ArrayList<>();\n\n        // Добавить в конец\n        list.add("Первый");\n        list.add("Второй");\n        list.add("Третий");\n        System.out.println(list); // [Первый, Второй, Третий]\n\n        // Добавить на конкретную позицию (индекс)\n        list.add(1, "Вставленный");\n        System.out.println(list); // [Первый, Вставленный, Второй, Третий]\n        // Все элементы с индекса 1 сдвинулись вправо\n    }\n}' },
        { type: 'heading', value: 'Метод remove() — удалить элемент' },
        { type: 'code', language: 'java', value: 'import java.util.ArrayList;\n\npublic class Main {\n    public static void main(String[] args) {\n        ArrayList<String> list = new ArrayList<>();\n        list.add("Яблоко");\n        list.add("Банан");\n        list.add("Апельсин");\n        list.add("Манго");\n\n        // Удалить по индексу\n        list.remove(1); // удалить "Банан"\n        System.out.println(list); // [Яблоко, Апельсин, Манго]\n\n        // Удалить по значению\n        list.remove("Манго");\n        System.out.println(list); // [Яблоко, Апельсин]\n\n        // Удалить все элементы\n        list.clear();\n        System.out.println(list);       // []\n        System.out.println(list.isEmpty()); // true\n    }\n}' },
        { type: 'warning', value: 'Осторожно с remove() для чисел! list.remove(1) удаляет элемент с ИНДЕКСОМ 1. Если хочешь удалить число 1 как ЗНАЧЕНИЕ, нужно: list.remove(Integer.valueOf(1))' },
        { type: 'heading', value: 'Метод set() — заменить элемент' },
        { type: 'code', language: 'java', value: 'ArrayList<String> list = new ArrayList<>();\nlist.add("Кошка");\nlist.add("Собака");\nlist.add("Попугай");\n\n// Заменить элемент на индексе 1\nlist.set(1, "Хомяк");\nSystem.out.println(list); // [Кошка, Хомяк, Попугай]' }
      ]
    },
    {
      id: 3, title: 'Получение элементов: get() и size()', type: 'theory',
      content: [
        { type: 'text', value: 'Чтобы получить элемент из ArrayList, используй метод get(). Метод size() возвращает количество элементов.' },
        { type: 'heading', value: 'Метод get() — получить по индексу' },
        { type: 'code', language: 'java', value: 'import java.util.ArrayList;\n\npublic class Main {\n    public static void main(String[] args) {\n        ArrayList<String> colors = new ArrayList<>();\n        colors.add("Красный");   // индекс 0\n        colors.add("Зелёный");   // индекс 1\n        colors.add("Синий");     // индекс 2\n\n        System.out.println(colors.get(0)); // Красный\n        System.out.println(colors.get(1)); // Зелёный\n        System.out.println(colors.get(2)); // Синий\n\n        System.out.println("Размер: " + colors.size()); // 3\n\n        // Последний элемент\n        String last = colors.get(colors.size() - 1);\n        System.out.println("Последний: " + last); // Синий\n    }\n}' },
        { type: 'warning', value: 'Индексы в ArrayList начинаются с 0, как в массивах. Если размер списка 3, то индексы: 0, 1, 2. Обращение к индексу 3 вызовет IndexOutOfBoundsException!' },
        { type: 'heading', value: 'Проход по всему списку через индексы' },
        { type: 'code', language: 'java', value: 'ArrayList<Integer> nums = new ArrayList<>();\nnums.add(10);\nnums.add(20);\nnums.add(30);\nnums.add(40);\n\n// Цикл с индексом\nfor (int i = 0; i < nums.size(); i++) {\n    System.out.println("Индекс " + i + ": " + nums.get(i));\n}\n\n// Подсчёт суммы\nint sum = 0;\nfor (int i = 0; i < nums.size(); i++) {\n    sum += nums.get(i);\n}\nSystem.out.println("Сумма: " + sum); // 100' }
      ]
    },
    {
      id: 4, title: 'Итерирование ArrayList', type: 'theory',
      content: [
        { type: 'text', value: 'Итерирование — это проход по всем элементам списка. В Java есть несколько способов это сделать.' },
        { type: 'heading', value: 'For-each — самый удобный способ' },
        { type: 'code', language: 'java', value: 'import java.util.ArrayList;\n\npublic class Main {\n    public static void main(String[] args) {\n        ArrayList<String> cities = new ArrayList<>();\n        cities.add("Алматы");\n        cities.add("Астана");\n        cities.add("Шымкент");\n\n        // For-each: для каждого города в списке городов\n        for (String city : cities) {\n            System.out.println("Город: " + city);\n        }\n    }\n}' },
        { type: 'heading', value: 'Классический for с индексом' },
        { type: 'code', language: 'java', value: 'ArrayList<Integer> scores = new ArrayList<>();\nscores.add(85);\nscores.add(92);\nscores.add(78);\nscores.add(95);\n\n// Когда нужен индекс — используй обычный for\nfor (int i = 0; i < scores.size(); i++) {\n    System.out.println("Место " + (i + 1) + ": " + scores.get(i) + " очков");\n}' },
        { type: 'heading', value: 'forEach с лямбдой (современный стиль)' },
        { type: 'code', language: 'java', value: 'ArrayList<String> fruits = new ArrayList<>();\nfruits.add("Яблоко");\nfruits.add("Банан");\nfruits.add("Манго");\n\n// forEach принимает лямбда-выражение\nfruits.forEach(fruit -> System.out.println("Фрукт: " + fruit));\n\n// Или через ссылку на метод\nfruits.forEach(System.out::println);' },
        { type: 'tip', value: 'Если тебе не нужен индекс — используй for-each, он читается как обычное предложение: "для каждого элемента в списке, сделай что-то".' }
      ]
    },
    {
      id: 5, title: 'Полезные методы: contains, indexOf, size', type: 'theory',
      content: [
        { type: 'text', value: 'ArrayList имеет много полезных методов для поиска и проверки наличия элементов.' },
        { type: 'heading', value: 'contains() — проверка наличия' },
        { type: 'code', language: 'java', value: 'import java.util.ArrayList;\n\npublic class Main {\n    public static void main(String[] args) {\n        ArrayList<String> names = new ArrayList<>();\n        names.add("Иван");\n        names.add("Мария");\n        names.add("Пётр");\n\n        System.out.println(names.contains("Мария")); // true\n        System.out.println(names.contains("Анна"));  // false\n\n        // Использование в условии\n        String search = "Пётр";\n        if (names.contains(search)) {\n            System.out.println(search + " есть в списке");\n        }\n    }\n}' },
        { type: 'heading', value: 'indexOf() — найти индекс элемента' },
        { type: 'code', language: 'java', value: 'ArrayList<String> animals = new ArrayList<>();\nanimals.add("Кот");\nanimals.add("Собака");\nanimals.add("Кот");\nanimals.add("Птица");\n\n// Первое вхождение\nSystem.out.println(animals.indexOf("Кот"));     // 0\n// Последнее вхождение\nSystem.out.println(animals.lastIndexOf("Кот")); // 2\n// Не найдено — возвращает -1\nSystem.out.println(animals.indexOf("Рыба"));    // -1' },
        { type: 'heading', value: 'Другие полезные методы' },
        { type: 'code', language: 'java', value: 'ArrayList<Integer> nums = new ArrayList<>();\nnums.add(5);\nnums.add(2);\nnums.add(8);\nnums.add(1);\n\nSystem.out.println("Размер: " + nums.size());       // 4\nSystem.out.println("Пустой?: " + nums.isEmpty());   // false\n\n// Преобразовать в массив\nObject[] arr = nums.toArray();\n\n// Добавить все из другого списка\nArrayList<Integer> more = new ArrayList<>();\nmore.add(10);\nmore.add(20);\nnums.addAll(more);\nSystem.out.println(nums); // [5, 2, 8, 1, 10, 20]\n\n// Оставить только элементы из другого списка\n// nums.retainAll(more); // оставит только [10, 20]' },
        { type: 'note', value: 'indexOf() работает через метод equals(). Для строк это сравнение по содержимому, для объектов — нужно переопределить equals().' }
      ]
    },
    {
      id: 6, title: 'Сортировка ArrayList', type: 'theory',
      content: [
        { type: 'text', value: 'Сортировка — расстановка элементов в определённом порядке. ArrayList легко сортируется с помощью класса Collections.' },
        { type: 'heading', value: 'Collections.sort() — сортировка по умолчанию' },
        { type: 'code', language: 'java', value: 'import java.util.ArrayList;\nimport java.util.Collections;\n\npublic class Main {\n    public static void main(String[] args) {\n        ArrayList<Integer> numbers = new ArrayList<>();\n        numbers.add(5);\n        numbers.add(2);\n        numbers.add(8);\n        numbers.add(1);\n        numbers.add(9);\n\n        System.out.println("До: " + numbers);\n        Collections.sort(numbers);\n        System.out.println("После: " + numbers);\n        // [1, 2, 5, 8, 9]\n\n        // Сортировка строк\n        ArrayList<String> names = new ArrayList<>();\n        names.add("Пётр");\n        names.add("Анна");\n        names.add("Иван");\n        Collections.sort(names);\n        System.out.println(names); // [Анна, Иван, Пётр]\n    }\n}' },
        { type: 'heading', value: 'Обратная сортировка' },
        { type: 'code', language: 'java', value: 'ArrayList<Integer> nums = new ArrayList<>();\nnums.add(3);\nnums.add(1);\nnums.add(4);\nnums.add(1);\nnums.add(5);\n\n// Сортировка от большего к меньшему\nCollections.sort(nums, Collections.reverseOrder());\nSystem.out.println(nums); // [5, 4, 3, 1, 1]' },
        { type: 'heading', value: 'Min, Max и другие утилиты' },
        { type: 'code', language: 'java', value: 'ArrayList<Integer> scores = new ArrayList<>();\nscores.add(85);\nscores.add(92);\nscores.add(78);\nscores.add(99);\nscores.add(64);\n\nSystem.out.println("Макс: " + Collections.max(scores)); // 99\nSystem.out.println("Мин: " + Collections.min(scores));  // 64\n\n// Перетасовать случайно\nCollections.shuffle(scores);\nSystem.out.println("Перемешано: " + scores);\n\n// Повернуть список\nCollections.reverse(scores);\nSystem.out.println("Перевёрнуто: " + scores);' },
        { type: 'tip', value: 'Класс Collections (не путай с Collection!) — набор вспомогательных методов для работы с коллекциями. Очень удобен для сортировки, поиска и других операций.' }
      ]
    },
    {
      id: 7, title: 'Практика: Список покупок', type: 'practice', difficulty: 'easy',
      description: 'Создай программу "Список покупок" — добавляй товары, удаляй купленные, показывай что осталось.',
      requirements: [
        'Создай ArrayList для хранения товаров',
        'Добавь 5 товаров в список',
        'Выведи весь список',
        'Удали второй товар (индекс 1)',
        'Добавь новый товар в начало (индекс 0)',
        'Проверь содержит ли список "Хлеб"',
        'Выведи итоговый список и его размер'
      ],
      expectedOutput: 'Список покупок:\n[Молоко, Хлеб, Яйца, Масло, Сыр]\nУдаляем Хлеб...\nДобавляем Кефир в начало...\nЕсть ли Хлеб? false\nИтог (4 товара):\n[Кефир, Молоко, Яйца, Масло, Сыр]',
      hint: 'Для удаления по значению используй remove("Хлеб"), для добавления в начало — add(0, "Кефир").',
      solution: 'import java.util.ArrayList;\n\npublic class Main {\n    public static void main(String[] args) {\n        ArrayList<String> cart = new ArrayList<>();\n        cart.add("Молоко");\n        cart.add("Хлеб");\n        cart.add("Яйца");\n        cart.add("Масло");\n        cart.add("Сыр");\n\n        System.out.println("Список покупок:");\n        System.out.println(cart);\n\n        System.out.println("Удаляем Хлеб...");\n        cart.remove("Хлеб");\n\n        System.out.println("Добавляем Кефир в начало...");\n        cart.add(0, "Кефир");\n\n        System.out.println("Есть ли Хлеб? " + cart.contains("Хлеб"));\n\n        System.out.println("Итог (" + cart.size() + " товара):");\n        System.out.println(cart);\n    }\n}',
      explanation: 'Мы использовали add() для добавления, remove() для удаления по значению, add(index, value) для вставки в позицию, contains() для проверки. Все операции ArrayList очень просты и читабельны.'
    },
    {
      id: 8, title: 'Практика: Оценки студентов', type: 'practice', difficulty: 'medium',
      description: 'Создай программу, которая хранит оценки студента, вычисляет среднее, находит максимум и минимум, удаляет все двойки.',
      requirements: [
        'Создай ArrayList<Integer> с оценками: 4, 2, 5, 3, 2, 5, 4, 2, 3',
        'Выведи исходный список',
        'Найди и выведи максимальную и минимальную оценку',
        'Вычисли и выведи среднюю оценку (с точностью до 2 знаков)',
        'Удали все двойки из списка',
        'Отсортируй список',
        'Выведи итоговый список'
      ],
      expectedOutput: 'Оценки: [4, 2, 5, 3, 2, 5, 4, 2, 3]\nМаксимум: 5\nМинимум: 2\nСреднее: 3.33\nУдаляем двойки...\nОтсортировано: [3, 3, 4, 4, 5, 5]',
      hint: 'Для удаления всех двоек используй цикл while и removeAll(). Метод Collections.max() и min() найдут крайние значения.',
      solution: 'import java.util.ArrayList;\nimport java.util.Collections;\n\npublic class Main {\n    public static void main(String[] args) {\n        ArrayList<Integer> grades = new ArrayList<>();\n        grades.add(4);\n        grades.add(2);\n        grades.add(5);\n        grades.add(3);\n        grades.add(2);\n        grades.add(5);\n        grades.add(4);\n        grades.add(2);\n        grades.add(3);\n\n        System.out.println("Оценки: " + grades);\n        System.out.println("Максимум: " + Collections.max(grades));\n        System.out.println("Минимум: " + Collections.min(grades));\n\n        // Среднее\n        int sum = 0;\n        for (int g : grades) sum += g;\n        double avg = (double) sum / grades.size();\n        System.out.printf("Среднее: %.2f%n", avg);\n\n        // Удаляем все двойки\n        System.out.println("Удаляем двойки...");\n        while (grades.contains(2)) {\n            grades.remove(Integer.valueOf(2));\n        }\n\n        Collections.sort(grades);\n        System.out.println("Отсортировано: " + grades);\n    }\n}',
      explanation: 'Для удаления всех двоек мы использовали цикл while с contains() и remove(Integer.valueOf(2)). Важно: remove(Integer.valueOf(2)) удаляет по ЗНАЧЕНИЮ, а не по индексу. Для среднего — приведение к double чтобы получить дробный результат.'
    }
  ]
}
