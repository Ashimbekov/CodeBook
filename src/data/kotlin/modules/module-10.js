export default {
  id: 10,
  title: 'Коллекции: Map',
  description: 'mapOf, mutableMapOf, работа с парами ключ-значение, итерация и трансформация Map',
  lessons: [
    {
      id: 1,
      title: 'Map — словарь ключ-значение',
      type: 'theory',
      content: [
        { type: 'text', value: 'Map — коллекция пар ключ-значение. Каждый ключ уникален и связан ровно с одним значением. Очень удобен для хранения данных с быстрым доступом по ключу.' },
        { type: 'tip', value: 'Map как настоящий словарь: слово (ключ) — перевод (значение). Ищешь слово "apple" — получаешь "яблоко". Каждое слово встречается один раз, у каждого своё значение.' },
        { type: 'code', language: 'kotlin', value: '// Неизменяемый Map\nval capitals = mapOf(\n    "Казахстан" to "Астана",\n    "Россия" to "Москва",\n    "Германия" to "Берлин"\n)\n\nprintln(capitals)                // {Казахстан=Астана, Россия=Москва, ...}\nprintln(capitals.size)           // 3\nprintln(capitals["Казахстан"])   // Астана\nprintln(capitals["Франция"])     // null — ключа нет' },
        { type: 'heading', value: 'Методы доступа' },
        { type: 'code', language: 'kotlin', value: 'val scores = mapOf("Алибек" to 95, "Нурдаулет" to 88, "Айгерим" to 92)\n\n// Получить значение (или null)\nprintln(scores["Нурдаулет"])           // 88\n\n// Получить с дефолтом\nprintln(scores.getOrDefault("Санжар", 0))  // 0\n\n// Проверки\nprintln(scores.containsKey("Алибек"))   // true\nprintln(scores.containsValue(88))       // true\nprintln("Нурдаулет" in scores)          // true' },
        { type: 'note', value: 'to — это инфиксная функция для создания Pair. "Казахстан" to "Астана" создаёт пару (Pair("Казахстан", "Астана")). Именно так передаются пары в mapOf.' }
      ]
    },
    {
      id: 2,
      title: 'MutableMap — изменяемый словарь',
      type: 'theory',
      content: [
        { type: 'text', value: 'MutableMap позволяет добавлять, изменять и удалять пары ключ-значение после создания.' },
        { type: 'code', language: 'kotlin', value: 'val phonebook = mutableMapOf(\n    "Мама" to "+7 777 111 22 33",\n    "Папа" to "+7 777 444 55 66"\n)\n\n// Добавление\nphonebook["Друг"] = "+7 701 999 88 77"\nphonebook.put("Коллега", "+7 705 123 45 67")\n\n// Изменение (тот же синтаксис)\nphonebook["Мама"] = "+7 777 111 22 99"\n\n// Удаление\nphonebook.remove("Коллега")\n\nprintln(phonebook)' },
        { type: 'heading', value: 'getOrPut — получи или создай' },
        { type: 'code', language: 'kotlin', value: 'val wordCount = mutableMapOf<String, Int>()\nval words = listOf("kotlin", "java", "kotlin", "python", "kotlin")\n\nfor (word in words) {\n    wordCount[word] = (wordCount[word] ?: 0) + 1\n    // или короче:\n    // wordCount.merge(word, 1, Int::plus)\n}\n\nprintln(wordCount)  // {kotlin=3, java=1, python=1}' },
        { type: 'tip', value: 'wordCount[word] ?: 0 — берём текущее значение или 0 если ключа ещё нет, затем +1. Очень частый паттерн для подсчёта частот.' }
      ]
    },
    {
      id: 3,
      title: 'Итерация по Map',
      type: 'theory',
      content: [
        { type: 'text', value: 'По Map можно итерировать: перебирать все пары, только ключи или только значения.' },
        { type: 'code', language: 'kotlin', value: 'val grades = mapOf("Математика" to 5, "Физика" to 4, "История" to 3)\n\n// Перебор пар ключ-значение\nfor ((subject, grade) in grades) {\n    println("$subject: $grade")\n}\n\n// Только ключи\nfor (subject in grades.keys) {\n    println(subject)\n}\n\n// Только значения\nprintln(grades.values)     // [5, 4, 3]\nprintln(grades.values.average())  // 4.0' },
        { type: 'heading', value: 'forEach' },
        { type: 'code', language: 'kotlin', value: 'val prices = mapOf("Яблоко" to 150, "Банан" to 100, "Вишня" to 300)\n\nprices.forEach { (item, price) ->\n    println("$item стоит $price тенге")\n}\n\n// Или через it.key / it.value:\nprices.forEach {\n    println("${it.key}: ${it.value}")\n}' },
        { type: 'note', value: 'grades.entries возвращает Set<Map.Entry<K, V>> — все пары. grades.keys — Set ключей. grades.values — Collection значений. Деструктуризация (subject, grade) красиво разбирает пару.' }
      ]
    },
    {
      id: 4,
      title: 'Трансформация и фильтрация Map',
      type: 'theory',
      content: [
        { type: 'text', value: 'Kotlin предоставляет функциональные операции для трансформации Map: filter, map, mapValues, mapKeys.' },
        { type: 'code', language: 'kotlin', value: 'val scores = mapOf("Алибек" to 95, "Нурдаулет" to 62, "Айгерим" to 78, "Санжар" to 45)\n\n// Фильтрация по значению\nval passed = scores.filter { (_, score) -> score >= 70 }\nprintln(passed)  // {Алибек=95, Айгерим=78}\n\n// Трансформация значений\nval grades = scores.mapValues { (_, score) ->\n    when {\n        score >= 90 -> "A"\n        score >= 70 -> "B"\n        score >= 50 -> "C"\n        else -> "F"\n    }\n}\nprintln(grades)  // {Алибек=A, Нурдаулет=C, Айгерим=B, Санжар=F}' },
        { type: 'heading', value: 'groupBy — группировка списка в Map' },
        { type: 'code', language: 'kotlin', value: 'val words = listOf("apple", "ant", "ball", "bear", "cat")\n\n// Группируем по первой букве\nval grouped = words.groupBy { it.first() }\nprintln(grouped)\n// {a=[apple, ant], b=[ball, bear], c=[cat]}' },
        { type: 'tip', value: 'groupBy — мощная функция. Принимает список и возвращает Map, где ключи — результат функции-группировщика. Позволяет моментально классифицировать любой список.' }
      ]
    },
    {
      id: 5,
      title: 'Практика: Телефонная книга',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай простую телефонную книгу с операциями добавления, поиска и вывода.',
      requirements: [
        'Создай mutableMapOf с 3 контактами',
        'Добавь 2 новых контакта',
        'Обнови номер одного существующего контакта',
        'Выведи все контакты в формате "Имя — Номер"',
        'Выведи контакты у которых номер начинается с "+7 701"'
      ],
      expectedOutput: '=== Телефонная книга ===\nМама — +7 777 111 22 33\nПапа — +7 777 444 55 66\nДруг — +7 701 999 88 77\nРабота — +7 701 200 30 40\nКоллега — +7 702 500 60 70\n=== Номера +7 701 ===\nДруг — +7 701 999 88 77\nРабота — +7 701 200 30 40',
      hint: 'Итерация: for ((name, phone) in phonebook). Фильтр: filter { (_, phone) -> phone.startsWith("+7 701") }.',
      solution: 'fun main() {\n    val phonebook = mutableMapOf(\n        "Мама" to "+7 777 111 22 33",\n        "Папа" to "+7 777 444 55 66",\n        "Друг" to "+7 701 999 88 77"\n    )\n    phonebook["Работа"] = "+7 701 200 30 40"\n    phonebook["Коллега"] = "+7 702 500 60 70"\n    phonebook["Мама"] = "+7 777 111 22 33"\n    println("=== Телефонная книга ===")\n    for ((name, phone) in phonebook) {\n        println("$name — $phone")\n    }\n    println("=== Номера +7 701 ===")\n    val filtered = phonebook.filter { (_, phone) -> phone.startsWith("+7 701") }\n    for ((name, phone) in filtered) {\n        println("$name — $phone")\n    }\n}',
      explanation: 'mutableMapOf создаёт изменяемый словарь. phonebook["key"] = "value" добавляет или обновляет. Деструктуризация (name, phone) удобно разбирает пары. filter с _ для неиспользуемого ключа — идиоматичный Kotlin.'
    },
    {
      id: 6,
      title: 'Практика: Подсчёт слов',
      type: 'practice',
      difficulty: 'hard',
      description: 'Подсчитай частоту слов в тексте и выведи топ-3 самых частых.',
      requirements: [
        'Возьми текст: "kotlin это круто kotlin лучший kotlin для android и kotlin мультиплатформа"',
        'Разбей на слова через split',
        'Посчитай частоту каждого слова через Map',
        'Выведи все слова с частотой',
        'Выведи топ-3 самых частых слова'
      ],
      expectedOutput: 'Частота слов:\nkotlin: 4\nэто: 1\nкруто: 1\nлучший: 1\nдля: 1\nandroid: 1\nи: 1\nмультиплатформа: 1\nТоп-3: kotlin=4, это=1, круто=1',
      hint: 'wordCount[word] = (wordCount[word] ?: 0) + 1. Для топ-3: entries.sortedByDescending { it.value }.take(3).',
      solution: 'fun main() {\n    val text = "kotlin это круто kotlin лучший kotlin для android и kotlin мультиплатформа"\n    val words = text.split(" ")\n    val wordCount = mutableMapOf<String, Int>()\n    for (word in words) {\n        wordCount[word] = (wordCount[word] ?: 0) + 1\n    }\n    println("Частота слов:")\n    for ((word, count) in wordCount) {\n        println("$word: $count")\n    }\n    val top3 = wordCount.entries.sortedByDescending { it.value }.take(3)\n    val top3str = top3.joinToString(", ") { "${it.key}=${it.value}" }\n    println("Топ-3: $top3str")\n}',
      explanation: 'split(" ") разбивает строку по пробелу. (wordCount[word] ?: 0) + 1 — берём текущий счётчик или 0, прибавляем 1. entries возвращает Set<Entry>. sortedByDescending + take(3) — топ-3 по убыванию.'
    }
  ]
}
