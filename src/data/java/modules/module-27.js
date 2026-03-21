export default {
  id: 27,
  title: 'HashSet',
  description: 'Изучаем HashSet — коллекцию без дубликатов, которая быстро проверяет наличие элементов',
  lessons: [
    {
      id: 1, title: 'Что такое Set?', type: 'theory',
      content: [
        { type: 'text', value: 'Set — это коллекция, которая не допускает дубликатов. Каждый элемент может встречаться только один раз. HashSet — самая быстрая реализация Set в Java.' },
        { type: 'tip', value: 'Представь классный журнал: каждый ученик записан только один раз. Нельзя добавить "Иван Иванов" дважды — имя уже есть в списке. Set работает точно так же.' },
        { type: 'heading', value: 'Создание HashSet' },
        { type: 'code', language: 'java', value: 'import java.util.HashSet;\n\npublic class Main {\n    public static void main(String[] args) {\n        HashSet<String> names = new HashSet<>();\n\n        names.add("Иван");\n        names.add("Мария");\n        names.add("Пётр");\n        names.add("Иван"); // дубликат — НЕ добавится!\n        names.add("Мария"); // дубликат — НЕ добавится!\n\n        System.out.println(names); // [Иван, Мария, Пётр]\n        System.out.println("Размер: " + names.size()); // 3, не 5!\n    }\n}' },
        { type: 'heading', value: 'add() возвращает boolean' },
        { type: 'code', language: 'java', value: 'HashSet<String> set = new HashSet<>();\n\nboolean added1 = set.add("Яблоко");\nSystem.out.println("Добавлено: " + added1); // true\n\nboolean added2 = set.add("Яблоко"); // дубликат\nSystem.out.println("Добавлено: " + added2); // false\n\nSystem.out.println(set); // [Яблоко]' },
        { type: 'warning', value: 'HashSet, как и HashMap, не гарантирует порядок элементов! Если нужен порядок добавления — используй LinkedHashSet. Если нужна сортировка — TreeSet.' }
      ]
    },
    {
      id: 2, title: 'add(), remove(), contains()', type: 'theory',
      content: [
        { type: 'text', value: 'Основные операции с HashSet: добавить, удалить, проверить наличие. Все они работают за O(1) — мгновенно!' },
        { type: 'heading', value: 'Основные методы' },
        { type: 'code', language: 'java', value: 'import java.util.HashSet;\n\npublic class Main {\n    public static void main(String[] args) {\n        HashSet<String> fruits = new HashSet<>();\n\n        // add() — добавить элемент\n        fruits.add("Яблоко");\n        fruits.add("Банан");\n        fruits.add("Манго");\n\n        // contains() — проверить наличие (очень быстро!)\n        System.out.println(fruits.contains("Банан"));  // true\n        System.out.println(fruits.contains("Груша")); // false\n\n        // remove() — удалить элемент\n        fruits.remove("Банан");\n        System.out.println(fruits.contains("Банан")); // false\n\n        // size() и isEmpty()\n        System.out.println("Размер: " + fruits.size()); // 2\n        System.out.println("Пустой?: " + fruits.isEmpty()); // false\n\n        // clear() — очистить\n        fruits.clear();\n        System.out.println("После clear: " + fruits.isEmpty()); // true\n    }\n}' },
        { type: 'heading', value: 'Практический пример: уникальные посетители' },
        { type: 'code', language: 'java', value: 'HashSet<String> visitors = new HashSet<>();\n\n// Регистрируем посещения (один человек может зайти несколько раз)\nString[] log = {"Иван", "Мария", "Иван", "Пётр", "Мария", "Анна", "Иван"};\n\nfor (String visitor : log) {\n    visitors.add(visitor); // дубликаты не добавятся\n}\n\nSystem.out.println("Всего посещений: " + log.length);   // 7\nSystem.out.println("Уникальных: " + visitors.size()); // 4\nSystem.out.println("Посетители: " + visitors);' },
        { type: 'tip', value: 'contains() в HashSet работает за O(1) — мгновенно, даже если в наборе миллион элементов! В ArrayList.contains() нужно перебирать все элементы — O(n). Это огромная разница на больших данных.' }
      ]
    },
    {
      id: 3, title: 'Нет дубликатов — как это работает?', type: 'theory',
      content: [
        { type: 'text', value: 'HashSet использует hashCode() и equals() чтобы определить, является ли новый элемент дубликатом. Каждый объект в Java имеет эти методы.' },
        { type: 'heading', value: 'hashCode и equals' },
        { type: 'code', language: 'java', value: '// Для строк это работает как ожидается:\nHashSet<String> set = new HashSet<>();\nset.add("hello");\nset.add("hello"); // дубликат — строки равны, одинаковый hashCode\n\nSystem.out.println(set.size()); // 1 — правильно!\n\n// Для Integer тоже работает:\nHashSet<Integer> nums = new HashSet<>();\nnums.add(42);\nnums.add(42); // дубликат\n\nSystem.out.println(nums.size()); // 1 — правильно!' },
        { type: 'code', language: 'java', value: '// Как работает "под капотом":\n// 1. Java вычисляет hashCode() нового элемента\n// 2. Смотрит в "корзину" с этим хэш-кодом\n// 3. Если корзина пуста — добавляет\n// 4. Если нет — сравнивает через equals()\n// 5. Если equals() = true — дубликат, не добавляет\n// 6. Если equals() = false — добавляет (разные объекты с одинаковым хэшем)\n\nString a = new String("hello");\nString b = new String("hello");\n\nSystem.out.println(a.hashCode() == b.hashCode()); // true\nSystem.out.println(a.equals(b)); // true\n// HashSet посчитает их одним элементом!' },
        { type: 'note', value: 'Для своих классов нужно переопределять hashCode() и equals() чтобы HashSet правильно определял дубликаты. Если этого не сделать — два объекта с одинаковыми данными будут считаться разными!' }
      ]
    },
    {
      id: 4, title: 'Итерирование HashSet', type: 'theory',
      content: [
        { type: 'text', value: 'HashSet не имеет индексов, нельзя сделать get(0). Для перебора используем for-each или Iterator.' },
        { type: 'heading', value: 'For-each по Set' },
        { type: 'code', language: 'java', value: 'import java.util.HashSet;\n\npublic class Main {\n    public static void main(String[] args) {\n        HashSet<String> colors = new HashSet<>();\n        colors.add("Красный");\n        colors.add("Зелёный");\n        colors.add("Синий");\n        colors.add("Жёлтый");\n\n        // For-each — самый простой способ\n        for (String color : colors) {\n            System.out.println("Цвет: " + color);\n            // Порядок может быть любым!\n        }\n    }\n}' },
        { type: 'heading', value: 'Преобразование Set в List' },
        { type: 'code', language: 'java', value: 'import java.util.ArrayList;\nimport java.util.Collections;\nimport java.util.HashSet;\nimport java.util.List;\n\nHashSet<String> set = new HashSet<>();\nset.add("Банан");\nset.add("Яблоко");\nset.add("Апельсин");\n\n// Преобразовать в список (если нужен порядок)\nList<String> list = new ArrayList<>(set);\nCollections.sort(list); // отсортировать\n\nfor (String item : list) {\n    System.out.println(item);\n}\n// Апельсин\n// Банан\n// Яблоко' },
        { type: 'heading', value: 'LinkedHashSet — порядок добавления' },
        { type: 'code', language: 'java', value: 'import java.util.LinkedHashSet;\n\nLinkedHashSet<String> linked = new LinkedHashSet<>();\nlinked.add("Третий");\nlinked.add("Первый");\nlinked.add("Второй");\nlinked.add("Первый"); // дубликат — не добавится\n\nSystem.out.println(linked);\n// [Третий, Первый, Второй] — порядок добавления сохранён!' }
      ]
    },
    {
      id: 5, title: 'Операции над множествами', type: 'theory',
      content: [
        { type: 'text', value: 'Set поддерживает математические операции над множествами: объединение, пересечение, разность. Это очень мощный инструмент.' },
        { type: 'tip', value: 'Вспомни математику: множество A = {1,2,3}, множество B = {2,3,4}. Объединение = {1,2,3,4}, Пересечение = {2,3}, Разность A-B = {1}.' },
        { type: 'heading', value: 'Объединение (union) — addAll()' },
        { type: 'code', language: 'java', value: 'import java.util.HashSet;\n\npublic class Main {\n    public static void main(String[] args) {\n        HashSet<String> setA = new HashSet<>();\n        setA.add("Кот");\n        setA.add("Собака");\n        setA.add("Рыба");\n\n        HashSet<String> setB = new HashSet<>();\n        setB.add("Собака");\n        setB.add("Птица");\n        setB.add("Хомяк");\n\n        // Объединение: все элементы из обоих\n        HashSet<String> union = new HashSet<>(setA);\n        union.addAll(setB);\n        System.out.println("Объединение: " + union);\n        // [Кот, Собака, Рыба, Птица, Хомяк]\n    }\n}' },
        { type: 'heading', value: 'Пересечение (intersection) — retainAll()' },
        { type: 'code', language: 'java', value: 'HashSet<String> setA = new HashSet<>();\nsetA.add("Кот"); setA.add("Собака"); setA.add("Рыба");\n\nHashSet<String> setB = new HashSet<>();\nsetB.add("Собака"); setB.add("Птица"); setB.add("Кот");\n\n// Пересечение: только общие элементы\nHashSet<String> intersection = new HashSet<>(setA);\nintersection.retainAll(setB);\nSystem.out.println("Пересечение: " + intersection);\n// [Кот, Собака]' },
        { type: 'heading', value: 'Разность (difference) — removeAll()' },
        { type: 'code', language: 'java', value: 'HashSet<String> setA = new HashSet<>();\nsetA.add("Кот"); setA.add("Собака"); setA.add("Рыба");\n\nHashSet<String> setB = new HashSet<>();\nsetB.add("Собака"); setB.add("Птица");\n\n// Разность A-B: элементы A, которых нет в B\nHashSet<String> difference = new HashSet<>(setA);\ndifference.removeAll(setB);\nSystem.out.println("Разность: " + difference);\n// [Кот, Рыба]' }
      ]
    },
    {
      id: 6, title: 'Практика: Уникальные элементы', type: 'practice', difficulty: 'easy',
      description: 'Напиши программу, которая находит уникальные элементы в массиве и выполняет операции над двумя множествами.',
      requirements: [
        'Дан массив: {1, 5, 3, 2, 5, 1, 4, 3, 2, 6}',
        'Найди и выведи все уникальные числа',
        'Создай два множества: чётные числа (2,4,6,8) и числа массива',
        'Найди числа из массива которые являются чётными (пересечение)',
        'Найди числа из массива которых нет в чётных числах (разность)'
      ],
      expectedOutput: 'Исходный массив: [1, 5, 3, 2, 5, 1, 4, 3, 2, 6]\nУникальные: [1, 2, 3, 4, 5, 6]\nКоличество уникальных: 6\n\nЧётные числа: [2, 4, 6, 8]\nЧисла массива: [1, 2, 3, 4, 5, 6]\nПересечение (чётные из массива): [2, 4, 6]\nРазность (нечётные из массива): [1, 3, 5]',
      hint: 'Для вывода отсортированно переведи HashSet в ArrayList и используй Collections.sort().',
      solution: 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        int[] arr = {1, 5, 3, 2, 5, 1, 4, 3, 2, 6};\n        System.out.print("Исходный массив: [");\n        for (int i = 0; i < arr.length; i++) {\n            System.out.print(arr[i] + (i < arr.length - 1 ? ", " : ""));\n        }\n        System.out.println("]");\n\n        HashSet<Integer> unique = new HashSet<>();\n        for (int n : arr) unique.add(n);\n\n        List<Integer> sortedUnique = new ArrayList<>(unique);\n        Collections.sort(sortedUnique);\n        System.out.println("Уникальные: " + sortedUnique);\n        System.out.println("Количество уникальных: " + sortedUnique.size());\n        System.out.println();\n\n        HashSet<Integer> evens = new HashSet<>(Arrays.asList(2, 4, 6, 8));\n        List<Integer> evensList = new ArrayList<>(evens);\n        Collections.sort(evensList);\n        System.out.println("Чётные числа: " + evensList);\n        System.out.println("Числа массива: " + sortedUnique);\n\n        // Пересечение\n        HashSet<Integer> intersection = new HashSet<>(unique);\n        intersection.retainAll(evens);\n        List<Integer> interList = new ArrayList<>(intersection);\n        Collections.sort(interList);\n        System.out.println("Пересечение (чётные из массива): " + interList);\n\n        // Разность\n        HashSet<Integer> difference = new HashSet<>(unique);\n        difference.removeAll(evens);\n        List<Integer> diffList = new ArrayList<>(difference);\n        Collections.sort(diffList);\n        System.out.println("Разность (нечётные из массива): " + diffList);\n    }\n}',
      explanation: 'HashSet автоматически убирает дубликаты при добавлении. Для получения отсортированного результата преобразуем в ArrayList и сортируем. retainAll() оставляет только общие элементы, removeAll() удаляет элементы, присутствующие в другом наборе.'
    }
  ]
}
