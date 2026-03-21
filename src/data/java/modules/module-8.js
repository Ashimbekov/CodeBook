export default {
  id: 8,
  title: 'Массивы',
  description: 'Хранение множества значений в одной переменной: создание массивов, обращение к элементам, перебор, сортировка и типичные алгоритмы',
  lessons: [
    {
      id: 1,
      title: 'Что такое массив?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Массив — это контейнер для хранения нескольких значений одного типа. Вместо того чтобы создавать 10 отдельных переменных, можно создать один массив из 10 элементов.' },
        { type: 'tip', value: 'Представь поезд: у каждого вагона есть номер (0, 1, 2...). Все вагоны одинаковые (один тип). Ты можешь добраться до любого вагона по его номеру. Массив — это такой поезд для данных!' },
        { type: 'heading', value: 'Создание массива' },
        { type: 'code', language: 'java', value: '// Способ 1: создаём пустой массив заданного размера\nint[] numbers = new int[5];  // массив из 5 нулей\n\n// Способ 2: создаём массив с начальными значениями\nint[] grades = {95, 87, 76, 91, 88};\n\n// Способ 3: сначала объявляем, потом создаём\nString[] names;\nnames = new String[3];\n\n// Размер массива\nSystem.out.println("Размер: " + grades.length);  // 5' },
        { type: 'heading', value: 'Индексы — нумерация с нуля' },
        { type: 'code', language: 'java', value: 'int[] arr = {10, 20, 30, 40, 50};\n//             0   1   2   3   4  <- индексы!\n\nSystem.out.println(arr[0]);  // 10 — первый элемент\nSystem.out.println(arr[2]);  // 30 — третий элемент\nSystem.out.println(arr[4]);  // 50 — последний элемент\n\n// Изменяем элемент\narr[1] = 99;\nSystem.out.println(arr[1]);  // 99' },
        { type: 'warning', value: 'Массивы в Java индексируются с НУЛЯ! Если массив размером 5, индексы 0, 1, 2, 3, 4. Попытка обратиться к arr[5] вызовет ArrayIndexOutOfBoundsException — ошибку за пределами массива.' }
      ]
    },
    {
      id: 2,
      title: 'Инициализация и элементы массива',
      type: 'theory',
      content: [
        { type: 'text', value: 'При создании массива через new все элементы автоматически получают значения по умолчанию. Числовые массивы заполняются нулями, boolean — false, String — null.' },
        { type: 'heading', value: 'Значения по умолчанию' },
        { type: 'code', language: 'java', value: 'int[] nums = new int[3];\nSystem.out.println(nums[0]);  // 0\nSystem.out.println(nums[1]);  // 0\nSystem.out.println(nums[2]);  // 0\n\nboolean[] flags = new boolean[2];\nSystem.out.println(flags[0]);  // false\n\nString[] words = new String[2];\nSystem.out.println(words[0]);  // null (пустая ссылка)' },
        { type: 'heading', value: 'Заполнение массива' },
        { type: 'code', language: 'java', value: 'int[] squares = new int[10];\n\nfor (int i = 0; i < squares.length; i++) {\n    squares[i] = (i + 1) * (i + 1);  // квадраты чисел 1-10\n}\n\n// squares = [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]' },
        { type: 'heading', value: 'Массивы разных типов' },
        { type: 'code', language: 'java', value: '// Массив строк\nString[] days = {"Понедельник", "Вторник", "Среда",\n                  "Четверг", "Пятница", "Суббота", "Воскресенье"};\n\nSystem.out.println("Первый день: " + days[0]);\nSystem.out.println("Выходной: " + days[5]);\n\n// Массив double\ndouble[] prices = {99.9, 149.5, 299.0, 49.99};\nSystem.out.println("Первая цена: " + prices[0]);\n\n// Последний элемент любого массива\nSystem.out.println("Последний: " + days[days.length - 1]);  // Воскресенье' },
        { type: 'note', value: 'days.length - 1 — это всегда индекс последнего элемента. Это важный паттерн, запомни его! Если длина 7, последний индекс 6 (7-1=6).' }
      ]
    },
    {
      id: 3,
      title: 'Перебор массива',
      type: 'theory',
      content: [
        { type: 'text', value: 'Перебор (итерация) — самая частая операция с массивом. Мы проходим по каждому элементу и что-то с ним делаем. Для этого используем цикл for.' },
        { type: 'heading', value: 'Классический for' },
        { type: 'code', language: 'java', value: 'int[] numbers = {5, 12, 3, 8, 17, 6, 9};\n\n// Выводим все элементы\nSystem.out.println("Все числа:");\nfor (int i = 0; i < numbers.length; i++) {\n    System.out.println("numbers[" + i + "] = " + numbers[i]);\n}' },
        { type: 'heading', value: 'Цикл for-each (расширенный for)' },
        { type: 'code', language: 'java', value: 'int[] numbers = {5, 12, 3, 8, 17, 6, 9};\n\n// for-each: короче, но нет доступа к индексу\nfor (int num : numbers) {\n    System.out.print(num + " ");\n}\nSystem.out.println();\n// Вывод: 5 12 3 8 17 6 9\n\n// for-each со строками\nString[] fruits = {"яблоко", "банан", "апельсин"};\nfor (String fruit : fruits) {\n    System.out.println("Фрукт: " + fruit);\n}' },
        { type: 'text', value: 'for-each читается как "для каждого элемента num в массиве numbers". Он короче и понятнее, но не показывает индекс.' },
        { type: 'heading', value: 'Когда что использовать' },
        { type: 'code', language: 'java', value: '// Классический for — когда нужен индекс\nint[] arr = {1, 2, 3, 4, 5};\nfor (int i = 0; i < arr.length; i++) {\n    arr[i] = arr[i] * 2;  // изменяем элемент — нужен индекс!\n}\n\n// for-each — когда только читаем\nfor (int x : arr) {\n    System.out.print(x + " ");  // 2 4 6 8 10\n}' },
        { type: 'tip', value: 'Правило: если только читаешь значения — используй for-each, красивее. Если меняешь значения или нужна позиция — используй классический for с индексом.' }
      ]
    },
    {
      id: 4,
      title: 'Методы Arrays',
      type: 'theory',
      content: [
        { type: 'text', value: 'Java предоставляет класс Arrays со множеством готовых методов для работы с массивами. Не нужно писать сортировку вручную — Arrays.sort() сделает это за тебя!' },
        { type: 'heading', value: 'Arrays.toString() — красивый вывод' },
        { type: 'code', language: 'java', value: 'import java.util.Arrays;\n\nint[] numbers = {5, 2, 8, 1, 9, 3};\n\n// Без Arrays.toString() — выводится адрес объекта\nSystem.out.println(numbers);           // [I@1b6d3586 (некрасиво)\n\n// С Arrays.toString() — выводятся значения\nSystem.out.println(Arrays.toString(numbers));  // [5, 2, 8, 1, 9, 3]' },
        { type: 'heading', value: 'Arrays.sort() — сортировка' },
        { type: 'code', language: 'java', value: 'import java.util.Arrays;\n\nint[] numbers = {5, 2, 8, 1, 9, 3};\nSystem.out.println("До: " + Arrays.toString(numbers));\n\nArrays.sort(numbers);  // сортировка по возрастанию\nSystem.out.println("После: " + Arrays.toString(numbers));\n// До: [5, 2, 8, 1, 9, 3]\n// После: [1, 2, 3, 5, 8, 9]\n\n// Сортировка строк (по алфавиту)\nString[] names = {"Зара", "Алия", "Камила", "Бота"};\nArrays.sort(names);\nSystem.out.println(Arrays.toString(names));\n// [Алия, Бота, Зара, Камила]' },
        { type: 'heading', value: 'Arrays.fill() — заполнение' },
        { type: 'code', language: 'java', value: 'import java.util.Arrays;\n\nint[] arr = new int[5];\nArrays.fill(arr, 7);  // заполнить все элементы числом 7\nSystem.out.println(Arrays.toString(arr));  // [7, 7, 7, 7, 7]' },
        { type: 'heading', value: 'Arrays.copyOf() — копирование' },
        { type: 'code', language: 'java', value: 'import java.util.Arrays;\n\nint[] original = {1, 2, 3, 4, 5};\nint[] copy = Arrays.copyOf(original, original.length);\nint[] extended = Arrays.copyOf(original, 8);  // с расширением\n\nSystem.out.println(Arrays.toString(copy));      // [1, 2, 3, 4, 5]\nSystem.out.println(Arrays.toString(extended));  // [1, 2, 3, 4, 5, 0, 0, 0]' },
        { type: 'note', value: 'Не забудь импорт: import java.util.Arrays; в начале файла (перед public class). Без него Arrays не будет работать.' }
      ]
    },
    {
      id: 5,
      title: 'Поиск минимума, максимума, суммы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Три самых частых задачи с массивами: найти минимум, максимум и сумму. Это базовые алгоритмы, которые нужно знать наизусть.' },
        { type: 'heading', value: 'Нахождение суммы' },
        { type: 'code', language: 'java', value: 'int[] scores = {85, 92, 78, 95, 88, 76, 90};\n\nint sum = 0;\nfor (int score : scores) {\n    sum += score;\n}\n\ndouble average = (double) sum / scores.length;\nSystem.out.println("Сумма: " + sum);          // 604\nSystem.out.println("Среднее: " + average);    // 86.28...' },
        { type: 'heading', value: 'Нахождение максимума' },
        { type: 'code', language: 'java', value: 'int[] temps = {22, 25, 18, 30, 27, 15, 28};\n\nint max = temps[0];  // начинаем с первого элемента!\nint maxIndex = 0;\n\nfor (int i = 1; i < temps.length; i++) {\n    if (temps[i] > max) {\n        max = temps[i];\n        maxIndex = i;\n    }\n}\n\nSystem.out.println("Макс. температура: " + max + " (день " + (maxIndex+1) + ")");\n// Макс. температура: 30 (день 4)' },
        { type: 'heading', value: 'Нахождение минимума' },
        { type: 'code', language: 'java', value: 'int[] prices = {150, 230, 89, 175, 320, 99};\n\nint min = prices[0];\nfor (int price : prices) {\n    if (price < min) {\n        min = price;\n    }\n}\n\nSystem.out.println("Минимальная цена: " + min);  // 89' },
        { type: 'heading', value: 'Всё вместе' },
        { type: 'code', language: 'java', value: 'int[] data = {14, 7, 23, 5, 18, 11, 29, 3};\n\nint sum = 0;\nint max = data[0];\nint min = data[0];\n\nfor (int x : data) {\n    sum += x;\n    if (x > max) max = x;\n    if (x < min) min = x;\n}\n\nSystem.out.println("Сумма: " + sum);\nSystem.out.println("Макс: " + max);\nSystem.out.println("Мин: " + min);\nSystem.out.println("Среднее: " + (double)sum / data.length);' },
        { type: 'tip', value: 'Всегда инициализируй max и min первым элементом массива (data[0]), а не нулём или Integer.MAX_VALUE. Это надёжнее и понятнее.' }
      ]
    },
    {
      id: 6,
      title: 'Линейный поиск',
      type: 'theory',
      content: [
        { type: 'text', value: 'Поиск в массиве — ещё одна базовая задача. Линейный поиск: перебираем все элементы по порядку, пока не найдём нужный.' },
        { type: 'heading', value: 'Поиск значения (есть ли в массиве)' },
        { type: 'code', language: 'java', value: 'int[] numbers = {5, 12, 3, 8, 17, 6};\nint target = 8;\nboolean found = false;\n\nfor (int num : numbers) {\n    if (num == target) {\n        found = true;\n        break;\n    }\n}\n\nSystem.out.println(target + " найдено: " + found);  // 8 найдено: true' },
        { type: 'heading', value: 'Поиск индекса элемента' },
        { type: 'code', language: 'java', value: 'String[] names = {"Алибек", "Нурлан", "Дана", "Айгерим"};\nString searchName = "Дана";\nint foundIndex = -1;  // -1 значит "не найдено"\n\nfor (int i = 0; i < names.length; i++) {\n    if (names[i].equals(searchName)) {  // для строк используем equals!\n        foundIndex = i;\n        break;\n    }\n}\n\nif (foundIndex != -1) {\n    System.out.println(searchName + " находится на позиции: " + foundIndex);\n} else {\n    System.out.println(searchName + " не найдена");\n}' },
        { type: 'heading', value: 'Подсчёт вхождений' },
        { type: 'code', language: 'java', value: 'int[] grades = {4, 5, 3, 5, 4, 5, 2, 4, 5, 3};\nint target = 5;\nint count = 0;\n\nfor (int grade : grades) {\n    if (grade == target) {\n        count++;\n    }\n}\n\nSystem.out.println("Оценок " + target + ": " + count + " штук");  // 4 штуки' },
        { type: 'warning', value: 'Для строк НИКОГДА не используй == для сравнения содержимого! Используй .equals(). name == "Дана" проверяет, один ли это объект в памяти, а не одинаковое ли содержимое.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Статистика оценок',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напиши программу, которая анализирует массив оценок студентов. Нужно найти: максимальную оценку, минимальную, среднюю, количество пятёрок и количество двоек.',
      requirements: [
        'Массив оценок: int[] grades = {5, 3, 4, 5, 2, 4, 5, 3, 5, 4}',
        'Найди максимальную и минимальную оценку',
        'Вычисли среднюю оценку (double)',
        'Посчитай количество оценок 5 и количество оценок 2',
        'Используй один проход по массиву (один цикл для всего)'
      ],
      expectedOutput: 'Оценки: [5, 3, 4, 5, 2, 4, 5, 3, 5, 4]\nМаксимум: 5\nМинимум: 2\nСреднее: 4.0\nПятёрок: 4\nДвоек: 1',
      hint: 'В одном цикле for-each можно одновременно: обновлять max, min, прибавлять к sum и проверять на 5 и 2. Среднее считаем после цикла.',
      solution: 'import java.util.Arrays;\n\npublic class Main {\n    public static void main(String[] args) {\n        int[] grades = {5, 3, 4, 5, 2, 4, 5, 3, 5, 4};\n\n        int max = grades[0];\n        int min = grades[0];\n        int sum = 0;\n        int fives = 0;\n        int twos = 0;\n\n        for (int grade : grades) {\n            if (grade > max) max = grade;\n            if (grade < min) min = grade;\n            sum += grade;\n            if (grade == 5) fives++;\n            if (grade == 2) twos++;\n        }\n\n        double average = (double) sum / grades.length;\n\n        System.out.println("Оценки: " + Arrays.toString(grades));\n        System.out.println("Максимум: " + max);\n        System.out.println("Минимум: " + min);\n        System.out.println("Среднее: " + average);\n        System.out.println("Пятёрок: " + fives);\n        System.out.println("Двоек: " + twos);\n    }\n}',
      explanation: 'Весь анализ делается за один проход (O(n)) — это эффективно. В каждой итерации мы проверяем сразу несколько условий. Приведение (double) перед делением важно — без него 40 / 10 = 4, а не 4.0. Arrays.toString() для красивого вывода массива.'
    },
    {
      id: 8,
      title: 'Практика: Сортировка пузырьком',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй сортировку пузырьком вручную. Алгоритм: проходим по массиву, сравниваем соседние элементы, если левый больше правого — меняем их местами. Повторяем пока массив не отсортирован.',
      requirements: [
        'Массив: int[] arr = {64, 34, 25, 12, 22, 11, 90}',
        'Реализуй сортировку двумя вложенными циклами for',
        'Выводи массив до сортировки',
        'После каждого прохода (внешнего цикла) выводи текущее состояние массива',
        'Выводи массив после сортировки'
      ],
      expectedOutput: 'До: [64, 34, 25, 12, 22, 11, 90]\nПроход 1: [34, 25, 12, 22, 11, 64, 90]\nПроход 2: [25, 12, 22, 11, 34, 64, 90]\n...\nПосле: [11, 12, 22, 25, 34, 64, 90]',
      hint: 'Внешний цикл — количество проходов (i от 0 до length-1). Внутренний цикл — сравниваем arr[j] и arr[j+1] (j от 0 до length-2-i). Для обмена используй временную переменную temp.',
      solution: 'import java.util.Arrays;\n\npublic class Main {\n    public static void main(String[] args) {\n        int[] arr = {64, 34, 25, 12, 22, 11, 90};\n\n        System.out.println("До: " + Arrays.toString(arr));\n\n        for (int i = 0; i < arr.length - 1; i++) {\n            for (int j = 0; j < arr.length - 1 - i; j++) {\n                if (arr[j] > arr[j + 1]) {\n                    // Обмен местами\n                    int temp = arr[j];\n                    arr[j] = arr[j + 1];\n                    arr[j + 1] = temp;\n                }\n            }\n            System.out.println("Проход " + (i+1) + ": " + Arrays.toString(arr));\n        }\n\n        System.out.println("После: " + Arrays.toString(arr));\n    }\n}',
      explanation: 'Сортировка пузырьком — классический учебный алгоритм. После каждого прохода самый большой "непоставленный" элемент всплывает на своё место. Поэтому внутренний цикл идёт до length-1-i: последние i элементов уже стоят правильно. Сложность O(n^2) — для больших данных медленно, но для обучения идеально.'
    }
  ]
}
