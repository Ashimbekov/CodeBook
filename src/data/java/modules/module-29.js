export default {
  id: 29,
  title: 'Итераторы и for-each',
  description: 'Изучаем итераторы — универсальный способ обходить любые коллекции, и расширенный цикл for-each',
  lessons: [
    {
      id: 1, title: 'Что такое итератор?', type: 'theory',
      content: [
        { type: 'text', value: 'Итератор — это объект, который умеет обходить коллекцию элемент за элементом. Как курсор на экране: он знает, где ты находишься, и может переместиться к следующему элементу.' },
        { type: 'tip', value: 'Представь, что ты перелистываешь книгу. Ты всегда знаешь: есть ли ещё страницы (hasNext), можешь перейти на следующую (next), и можешь вырвать текущую страницу (remove). Итератор — это твой "палец в книге".' },
        { type: 'heading', value: 'Интерфейс Iterator' },
        { type: 'code', language: 'java', value: '// Интерфейс Iterator имеет три метода:\n// boolean hasNext() — есть ли следующий элемент?\n// E next()         — вернуть следующий элемент\n// void remove()    — удалить текущий элемент\n\nimport java.util.ArrayList;\nimport java.util.Iterator;\n\npublic class Main {\n    public static void main(String[] args) {\n        ArrayList<String> list = new ArrayList<>();\n        list.add("Яблоко");\n        list.add("Банан");\n        list.add("Манго");\n\n        // Получаем итератор\n        Iterator<String> it = list.iterator();\n\n        // Обходим коллекцию\n        while (it.hasNext()) {\n            String item = it.next();\n            System.out.println("Элемент: " + item);\n        }\n    }\n}' },
        { type: 'heading', value: 'Зачем нужен итератор, если есть for-each?' },
        { type: 'text', value: 'For-each — это удобная запись итератора. Но явный итератор нужен когда нужно удалять элементы в процессе обхода. For-each этого не позволяет.' },
        { type: 'code', language: 'java', value: '// ОШИБКА: нельзя удалять из коллекции во время for-each\nArrayList<Integer> numbers = new ArrayList<>();\nnumbers.add(1); numbers.add(2); numbers.add(3); numbers.add(4);\n\n// Этот код бросит ConcurrentModificationException!\n// for (Integer n : numbers) {\n//     if (n % 2 == 0) numbers.remove(n);\n// }\n\n// ПРАВИЛЬНО: использовать итератор\nIterator<Integer> it = numbers.iterator();\nwhile (it.hasNext()) {\n    Integer n = it.next();\n    if (n % 2 == 0) {\n        it.remove(); // безопасное удаление!\n    }\n}\nSystem.out.println(numbers); // [1, 3]' }
      ]
    },
    {
      id: 2, title: 'hasNext(), next(), remove()', type: 'theory',
      content: [
        { type: 'text', value: 'Рассмотрим три метода Iterator подробнее с примерами.' },
        { type: 'heading', value: 'hasNext() — проверить наличие следующего' },
        { type: 'code', language: 'java', value: 'import java.util.ArrayList;\nimport java.util.Iterator;\n\npublic class Main {\n    public static void main(String[] args) {\n        ArrayList<String> list = new ArrayList<>();\n        list.add("A");\n        list.add("B");\n        list.add("C");\n\n        Iterator<String> it = list.iterator();\n\n        System.out.println("Есть следующий: " + it.hasNext()); // true\n        System.out.println("Следующий: " + it.next()); // A\n\n        System.out.println("Есть следующий: " + it.hasNext()); // true\n        System.out.println("Следующий: " + it.next()); // B\n\n        System.out.println("Есть следующий: " + it.hasNext()); // true\n        System.out.println("Следующий: " + it.next()); // C\n\n        System.out.println("Есть следующий: " + it.hasNext()); // false\n        // it.next() сейчас бросит NoSuchElementException!\n    }\n}' },
        { type: 'heading', value: 'remove() — безопасное удаление' },
        { type: 'code', language: 'java', value: 'ArrayList<String> fruits = new ArrayList<>();\nfruits.add("Яблоко");\nfruits.add("Гнилой банан");\nfruits.add("Манго");\nfruits.add("Плохой апельсин");\nfruits.add("Киви");\n\nIterator<String> it = fruits.iterator();\nwhile (it.hasNext()) {\n    String fruit = it.next();\n    if (fruit.startsWith("Гнилой") || fruit.startsWith("Плохой")) {\n        it.remove(); // удаляем испорченные фрукты\n        System.out.println("Удалён: " + fruit);\n    }\n}\n\nSystem.out.println("Осталось: " + fruits);\n// [Яблоко, Манго, Киви]' },
        { type: 'warning', value: 'Нельзя вызвать it.remove() перед it.next() — это вызовет IllegalStateException. Сначала next(), потом remove()!' }
      ]
    },
    {
      id: 3, title: 'ListIterator', type: 'theory',
      content: [
        { type: 'text', value: 'ListIterator — расширенная версия Iterator, которая может двигаться в обе стороны и изменять элементы. Работает только со списками (List).' },
        { type: 'heading', value: 'Дополнительные методы ListIterator' },
        { type: 'list', items: [
          'hasPrevious() — есть ли предыдущий элемент',
          'previous() — вернуть предыдущий элемент',
          'nextIndex() — индекс следующего элемента',
          'previousIndex() — индекс предыдущего элемента',
          'set(e) — заменить текущий элемент',
          'add(e) — добавить элемент перед следующим'
        ]},
        { type: 'code', language: 'java', value: 'import java.util.ArrayList;\nimport java.util.ListIterator;\n\npublic class Main {\n    public static void main(String[] args) {\n        ArrayList<String> list = new ArrayList<>();\n        list.add("Кот");\n        list.add("Собака");\n        list.add("Птица");\n\n        ListIterator<String> lit = list.listIterator();\n\n        // Идём вперёд\n        System.out.println("Вперёд:");\n        while (lit.hasNext()) {\n            System.out.println(lit.nextIndex() + ": " + lit.next());\n        }\n\n        // Идём назад!\n        System.out.println("Назад:");\n        while (lit.hasPrevious()) {\n            System.out.println(lit.previousIndex() + ": " + lit.previous());\n        }\n    }\n}' },
        { type: 'heading', value: 'Изменение элементов через ListIterator' },
        { type: 'code', language: 'java', value: 'ArrayList<String> names = new ArrayList<>();\nnames.add("иван");\nnames.add("мария");\nnames.add("пётр");\n\nListIterator<String> lit = names.listIterator();\nwhile (lit.hasNext()) {\n    String name = lit.next();\n    // Заменяем каждое имя на версию с заглавной буквы\n    String capitalized = name.substring(0, 1).toUpperCase() + name.substring(1);\n    lit.set(capitalized);\n}\n\nSystem.out.println(names); // [Иван, Мария, Пётр]' }
      ]
    },
    {
      id: 4, title: 'Расширенный for-each', type: 'theory',
      content: [
        { type: 'text', value: 'For-each (расширенный цикл for) — это синтаксический сахар поверх итератора. Он делает код короче и читабельнее.' },
        { type: 'tip', value: 'For-each читается как "для каждого": "для каждого элемента в коллекции — выполни действие". Это более человечный способ написать то, что итератор делает внутри.' },
        { type: 'heading', value: 'Синтаксис for-each' },
        { type: 'code', language: 'java', value: 'import java.util.ArrayList;\nimport java.util.HashSet;\nimport java.util.HashMap;\nimport java.util.Map;\n\npublic class Main {\n    public static void main(String[] args) {\n        // For-each по ArrayList\n        ArrayList<String> list = new ArrayList<>();\n        list.add("Java"); list.add("Python"); list.add("Go");\n\n        for (String lang : list) {\n            System.out.println("Язык: " + lang);\n        }\n\n        // For-each по массиву\n        int[] nums = {1, 2, 3, 4, 5};\n        for (int n : nums) {\n            System.out.println("Число: " + n);\n        }\n\n        // For-each по HashSet\n        HashSet<Integer> set = new HashSet<>();\n        set.add(10); set.add(20); set.add(30);\n        for (int n : set) {\n            System.out.println("Элемент set: " + n);\n        }\n\n        // For-each по entrySet HashMap\n        HashMap<String, Integer> map = new HashMap<>();\n        map.put("A", 1); map.put("B", 2);\n        for (Map.Entry<String, Integer> entry : map.entrySet()) {\n            System.out.println(entry.getKey() + " = " + entry.getValue());\n        }\n    }\n}' },
        { type: 'heading', value: 'Что компилятор делает с for-each' },
        { type: 'code', language: 'java', value: '// Что ты пишешь:\nfor (String s : list) {\n    System.out.println(s);\n}\n\n// Что компилятор превращает это в:\nIterator<String> it = list.iterator();\nwhile (it.hasNext()) {\n    String s = it.next();\n    System.out.println(s);\n}' },
        { type: 'warning', value: 'Ограничения for-each: нельзя удалять элементы, нельзя менять элементы по индексу, нельзя идти в обратном направлении. Если нужно что-то из этого — используй явный итератор или обычный for.' }
      ]
    },
    {
      id: 5, title: 'Интерфейс Iterable', type: 'theory',
      content: [
        { type: 'text', value: 'Для того чтобы по объекту можно было итерироваться через for-each, класс должен реализовать интерфейс Iterable<T>. У него один метод — iterator().' },
        { type: 'heading', value: 'Создание своей итерируемой коллекции' },
        { type: 'code', language: 'java', value: 'import java.util.Iterator;\n\n// Наш собственный класс-диапазон чисел\npublic class Range implements Iterable<Integer> {\n    private final int start;\n    private final int end;\n\n    public Range(int start, int end) {\n        this.start = start;\n        this.end = end;\n    }\n\n    @Override\n    public Iterator<Integer> iterator() {\n        return new Iterator<Integer>() {\n            int current = start;\n\n            @Override\n            public boolean hasNext() {\n                return current <= end;\n            }\n\n            @Override\n            public Integer next() {\n                return current++;\n            }\n        };\n    }\n}' },
        { type: 'code', language: 'java', value: 'public class Main {\n    public static void main(String[] args) {\n        Range range = new Range(1, 5);\n\n        // Теперь можно использовать for-each!\n        for (int n : range) {\n            System.out.print(n + " "); // 1 2 3 4 5\n        }\n        System.out.println();\n\n        // И снова!\n        for (int n : range) {\n            System.out.print(n * n + " "); // 1 4 9 16 25\n        }\n    }\n}' },
        { type: 'note', value: 'Все стандартные коллекции Java (ArrayList, HashSet, HashMap и т.д.) реализуют Iterable, поэтому по ним можно итерироваться через for-each.' }
      ]
    },
    {
      id: 6, title: 'Практика: Фильтрация списка', type: 'practice', difficulty: 'medium',
      description: 'Используй Iterator для фильтрации списка студентов — удали всех с оценкой ниже 60 и замени оценки выше 100 на 100.',
      requirements: [
        'Создай ArrayList с оценками: 45, 78, 90, 55, 100, 110, 63, 40, 88, 120',
        'Выведи исходный список',
        'Используй Iterator для удаления оценок ниже 60',
        'Используй ListIterator для замены оценок выше 100 на 100',
        'Выведи итоговый список'
      ],
      expectedOutput: 'Исходный список: [45, 78, 90, 55, 100, 110, 63, 40, 88, 120]\nУдаляем оценки ниже 60...\nУдалена: 45\nУдалена: 55\nУдалена: 40\nПосле удаления: [78, 90, 100, 110, 63, 88, 120]\nИсправляем оценки выше 100...\nИсправлена: 110 -> 100\nИсправлена: 120 -> 100\nИтоговый список: [78, 90, 100, 100, 63, 88, 100]',
      hint: 'Для удаления используй Iterator и it.remove(). Для замены используй ListIterator и lit.set(100).',
      solution: 'import java.util.ArrayList;\nimport java.util.Iterator;\nimport java.util.ListIterator;\n\npublic class Main {\n    public static void main(String[] args) {\n        ArrayList<Integer> grades = new ArrayList<>();\n        grades.add(45); grades.add(78); grades.add(90); grades.add(55);\n        grades.add(100); grades.add(110); grades.add(63); grades.add(40);\n        grades.add(88); grades.add(120);\n\n        System.out.println("Исходный список: " + grades);\n\n        // Удаляем оценки ниже 60\n        System.out.println("Удаляем оценки ниже 60...");\n        Iterator<Integer> it = grades.iterator();\n        while (it.hasNext()) {\n            int grade = it.next();\n            if (grade < 60) {\n                System.out.println("Удалена: " + grade);\n                it.remove();\n            }\n        }\n        System.out.println("После удаления: " + grades);\n\n        // Исправляем оценки выше 100\n        System.out.println("Исправляем оценки выше 100...");\n        ListIterator<Integer> lit = grades.listIterator();\n        while (lit.hasNext()) {\n            int grade = lit.next();\n            if (grade > 100) {\n                System.out.println("Исправлена: " + grade + " -> 100");\n                lit.set(100);\n            }\n        }\n\n        System.out.println("Итоговый список: " + grades);\n    }\n}',
      explanation: 'Iterator.remove() — единственный безопасный способ удалять элементы во время обхода. ListIterator.set() позволяет заменять текущий элемент. Если бы мы пытались удалять через list.remove() внутри обычного for-each, получили бы ConcurrentModificationException.'
    }
  ]
}
