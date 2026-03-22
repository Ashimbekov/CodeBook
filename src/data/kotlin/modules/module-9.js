export default {
  id: 9,
  title: 'Коллекции: List и Set',
  description: 'listOf, mutableListOf, setOf, основные операции с коллекциями List и Set',
  lessons: [
    {
      id: 1,
      title: 'List — упорядоченный список',
      type: 'theory',
      content: [
        { type: 'text', value: 'List — это упорядоченная коллекция элементов. Элементы хранятся в определённом порядке, к ним можно обращаться по индексу. В Kotlin Lists бывают неизменяемыми (listOf) и изменяемыми (mutableListOf).' },
        { type: 'tip', value: 'List — как пронумерованный список покупок: первый элемент, второй, третий... Порядок важен. Можно добавить одно и то же дважды (яблоко, яблоко — это два элемента).' },
        { type: 'code', language: 'kotlin', value: '// Неизменяемый список\nval fruits = listOf("яблоко", "банан", "вишня")\n\nprintln(fruits)           // [яблоко, банан, вишня]\nprintln(fruits.size)      // 3\nprintln(fruits[0])        // яблоко\nprintln(fruits[2])        // вишня\nprintln(fruits.first())   // яблоко\nprintln(fruits.last())    // вишня\n\n// fruits.add("дыня")  // ОШИБКА! listOf неизменяем' },
        { type: 'note', value: 'listOf создаёт неизменяемый список (read-only). Это не значит что он в памяти константа, но через него нельзя добавить/удалить элементы. Для изменения нужен mutableListOf.' }
      ]
    },
    {
      id: 2,
      title: 'MutableList — изменяемый список',
      type: 'theory',
      content: [
        { type: 'text', value: 'MutableList позволяет добавлять, удалять и изменять элементы. Создаётся через mutableListOf или ArrayList.' },
        { type: 'code', language: 'kotlin', value: 'val tasks = mutableListOf("Купить продукты", "Позвонить маме")\n\n// Добавление\ntasks.add("Сделать зарядку")          // в конец\ntasks.add(0, "Проснуться")            // по индексу\ntasks.addAll(listOf("Читать", "Спать")) // несколько\n\nprintln(tasks)\n// [Проснуться, Купить продукты, Позвонить маме, Сделать зарядку, Читать, Спать]' },
        { type: 'code', language: 'kotlin', value: '// Удаление\ntasks.remove("Читать")       // по значению\ntasks.removeAt(0)            // по индексу\ntasks.removeIf { it.length < 10 }  // по условию\n\n// Изменение\ntasks[0] = "Позавтракать"    // по индексу\n\n// Очистка\n// tasks.clear()              // удалить всё' },
        { type: 'heading', value: 'Преобразование между типами' },
        { type: 'code', language: 'kotlin', value: 'val readOnly = listOf(1, 2, 3)\nval mutable = readOnly.toMutableList()  // копия изменяемая\nmutable.add(4)\n\nval backToReadOnly = mutable.toList()   // снова неизменяемый' }
      ]
    },
    {
      id: 3,
      title: 'Операции с List: перебор и поиск',
      type: 'theory',
      content: [
        { type: 'text', value: 'Kotlin предоставляет богатый набор функций для работы со списками: фильтрация, поиск, сортировка, трансформация.' },
        { type: 'code', language: 'kotlin', value: 'val numbers = listOf(3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5)\n\n// Поиск\nprintln(numbers.contains(5))   // true\nprintln(5 in numbers)          // true — тот же contains\nprintln(numbers.indexOf(5))    // 4 — первое вхождение\nprintln(numbers.count { it > 4 }) // 4 — количество по условию\n\n// Минимум, максимум, сумма\nprintln(numbers.min())   // 1\nprintln(numbers.max())   // 9\nprintln(numbers.sum())   // 44\nprintln(numbers.average()) // 4.0' },
        { type: 'heading', value: 'Фильтрация' },
        { type: 'code', language: 'kotlin', value: 'val numbers = listOf(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)\n\nval evens = numbers.filter { it % 2 == 0 }\nprintln(evens)  // [2, 4, 6, 8, 10]\n\nval bigNums = numbers.filter { it > 5 }\nprintln(bigNums)  // [6, 7, 8, 9, 10]\n\n// find — первый подходящий или null\nval firstEven = numbers.find { it % 2 == 0 }\nprintln(firstEven)  // 2' },
        { type: 'tip', value: 'filter { условие } — как сито. Элементы, которые "проходят" через условие, остаются. it — это текущий элемент. Результат — новый список подходящих элементов.' }
      ]
    },
    {
      id: 4,
      title: 'Операции с List: трансформация',
      type: 'theory',
      content: [
        { type: 'text', value: 'map трансформирует каждый элемент списка по заданной функции. Возвращает новый список с преобразованными элементами.' },
        { type: 'code', language: 'kotlin', value: 'val numbers = listOf(1, 2, 3, 4, 5)\n\n// map — трансформирует каждый элемент\nval squares = numbers.map { it * it }\nprintln(squares)  // [1, 4, 9, 16, 25]\n\nval strings = numbers.map { "Число $it" }\nprintln(strings)  // [Число 1, Число 2, ...]\n\nval names = listOf("kotlin", "java", "python")\nval upper = names.map { it.uppercase() }\nprintln(upper)  // [KOTLIN, JAVA, PYTHON]' },
        { type: 'heading', value: 'sorted и sorted by' },
        { type: 'code', language: 'kotlin', value: 'val nums = listOf(5, 2, 8, 1, 9, 3)\n\nprintln(nums.sorted())          // [1, 2, 3, 5, 8, 9]\nprintln(nums.sortedDescending()) // [9, 8, 5, 3, 2, 1]\n\nval words = listOf("банан", "яблоко", "вишня", "апельсин")\nprintln(words.sortedBy { it.length })  // сортировка по длине\n// [банан, вишня, яблоко, апельсин]' },
        { type: 'note', value: 'map, filter, sorted — функциональные операции. Они не изменяют исходный список, а возвращают новый. Можно создавать цепочки: numbers.filter { it > 2 }.map { it * 2 }.sorted()' }
      ]
    },
    {
      id: 5,
      title: 'Set — уникальные элементы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Set — коллекция, в которой каждый элемент уникален. Если попытаться добавить дубликат — он просто проигнорируется. Порядок элементов не гарантирован.' },
        { type: 'tip', value: 'Set — как корзина с уникальными наклейками. Если у тебя уже есть наклейка "яблоко", новую такую же не положишь — автоматически игнорируется.' },
        { type: 'code', language: 'kotlin', value: '// Неизменяемый Set\nval colors = setOf("красный", "синий", "зелёный", "красный")\nprintln(colors)  // [красный, синий, зелёный] — дубликат удалён!\nprintln(colors.size)  // 3\n\n// Изменяемый Set\nval tags = mutableSetOf("kotlin", "android")\ntags.add("mobile")\ntags.add("kotlin")  // дубликат — игнорируется\nprintln(tags)  // [kotlin, android, mobile]\nprintln(tags.size)  // 3' },
        { type: 'heading', value: 'Операции над множествами' },
        { type: 'code', language: 'kotlin', value: 'val set1 = setOf(1, 2, 3, 4, 5)\nval set2 = setOf(3, 4, 5, 6, 7)\n\n// Объединение\nprintln(set1 union set2)        // [1, 2, 3, 4, 5, 6, 7]\n\n// Пересечение (общие элементы)\nprintln(set1 intersect set2)    // [3, 4, 5]\n\n// Разность (в set1, но не в set2)\nprintln(set1 subtract set2)     // [1, 2]' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Работа со списком задач',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай систему управления списком задач с фильтрацией и сортировкой.',
      requirements: [
        'Создай mutableListOf с 5 задачами разной длины',
        'Добавь ещё 2 задачи через add',
        'Удали первую задачу через removeAt',
        'Отфильтруй задачи длиннее 10 символов',
        'Выведи задачи отсортированные по длине'
      ],
      expectedOutput: 'Все задачи: [Купить хлеб, Позвонить другу, Сделать зарядку, Написать код, Прочитать книгу, Сходить в магазин, Выучить Kotlin]\nПосле удаления: [Позвонить другу, Сделать зарядку, Написать код, Прочитать книгу, Сходить в магазин, Выучить Kotlin]\nДлинные задачи: [Позвонить другу, Сделать зарядку, Прочитать книгу, Сходить в магазин, Выучить Kotlin]\nПо длине: [Выучить Kotlin, Позвонить другу, Сделать зарядку, Прочитать книгу, Сходить в магазин]',
      hint: 'filter { it.length > 10 } — фильтр. sortedBy { it.length } — сортировка по длине строки.',
      solution: 'fun main() {\n    val tasks = mutableListOf("Купить хлеб", "Позвонить другу", "Сделать зарядку", "Написать код", "Прочитать книгу")\n    tasks.add("Сходить в магазин")\n    tasks.add("Выучить Kotlin")\n    println("Все задачи: $tasks")\n    tasks.removeAt(0)\n    println("После удаления: $tasks")\n    val longTasks = tasks.filter { it.length > 10 }\n    println("Длинные задачи: $longTasks")\n    val sorted = longTasks.sortedBy { it.length }\n    println("По длине: $sorted")\n}',
      explanation: 'mutableListOf позволяет добавлять/удалять. removeAt(0) удаляет по индексу. filter { it.length > 10 } оставляет только длинные строки. sortedBy { it.length } сортирует по длине — короткие первыми.'
    },
    {
      id: 7,
      title: 'Практика: Уникальные элементы с Set',
      type: 'practice',
      difficulty: 'medium',
      description: 'Найди уникальные и повторяющиеся элементы в двух списках с помощью Set.',
      requirements: [
        'Создай два списка: список1 = [1, 2, 3, 4, 5, 3, 2] и список2 = [3, 4, 5, 6, 7, 5, 4]',
        'Преобразуй оба в Set для получения уникальных элементов',
        'Найди общие элементы (intersect)',
        'Найди элементы только в первом (subtract)',
        'Выведи количество уникальных элементов в каждом'
      ],
      expectedOutput: 'Уникальные в списке 1: [1, 2, 3, 4, 5]\nУникальные в списке 2: [3, 4, 5, 6, 7]\nОбщие: [3, 4, 5]\nТолько в первом: [1, 2]\nВсего уникальных: 7',
      hint: 'list.toSet() конвертирует в Set — дубли пропадают. set1 intersect set2 — общие. set1 subtract set2 — только в set1. (set1 union set2).size — всего уникальных.',
      solution: 'fun main() {\n    val list1 = listOf(1, 2, 3, 4, 5, 3, 2)\n    val list2 = listOf(3, 4, 5, 6, 7, 5, 4)\n    val set1 = list1.toSet()\n    val set2 = list2.toSet()\n    println("Уникальные в списке 1: $set1")\n    println("Уникальные в списке 2: $set2")\n    println("Общие: ${set1 intersect set2}")\n    println("Только в первом: ${set1 subtract set2}")\n    println("Всего уникальных: ${(set1 union set2).size}")\n}',
      explanation: 'toSet() автоматически убирает дубликаты. intersect находит элементы присутствующие в обоих множествах. subtract — элементы первого, которых нет во втором. union объединяет без дублей.'
    }
  ]
}
