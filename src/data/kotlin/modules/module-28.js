export default {
  id: 28,
  title: 'Best Practices',
  description: 'Лучшие практики Kotlin: идиоматический код, принципы чистого кода, производительность, именование и распространённые антипаттерны.',
  lessons: [
    {
      id: 1,
      title: 'Идиоматический Kotlin',
      type: 'theory',
      content: [
        { type: 'text', value: 'Идиоматический Kotlin — код, написанный "по-котлиновски", с использованием возможностей языка. Он короче, безопаснее и выразительнее Java-кода, переведённого буквально.' },
        { type: 'heading', value: 'Неидиоматично vs идиоматично' },
        { type: 'code', language: 'kotlin', value: '// Плохо: стиль Java\nval list = ArrayList<String>()\nif (name != null) {\n    list.add(name.toUpperCase())\n}\nvar result: String? = null\nfor (item in list) {\n    if (item.startsWith("A")) {\n        result = item\n        break\n    }\n}' },
        { type: 'code', language: 'kotlin', value: '// Хорошо: идиоматический Kotlin\nval list = mutableListOf<String>()\nname?.let { list.add(it.uppercase()) }\nval result = list.firstOrNull { it.startsWith("A") }' },
        { type: 'tip', value: 'Идиоматический код не только короче — он явно выражает намерение. firstOrNull говорит: "ищем первый подходящий элемент или null".' }
      ]
    },
    {
      id: 2,
      title: 'Принцип единственной ответственности',
      type: 'theory',
      content: [
        { type: 'text', value: 'SOLID — набор принципов хорошего объектно-ориентированного дизайна. В Kotlin они реализуются с помощью возможностей языка.' },
        { type: 'heading', value: 'S — Single Responsibility Principle' },
        { type: 'code', language: 'kotlin', value: '// Плохо: класс делает слишком много\nclass UserManager {\n    fun createUser(name: String) { /* ... */ }\n    fun sendEmail(user: User) { /* ... */ }\n    fun saveToDatabase(user: User) { /* ... */ }\n    fun generateReport() { /* ... */ }\n}\n\n// Хорошо: каждый класс — одна ответственность\nclass UserService(private val repo: UserRepository) {\n    fun createUser(name: String): User = repo.save(User(name))\n}\nclass EmailService { fun sendWelcome(user: User) { /* ... */ } }\nclass ReportService { fun generate(): String { /* ... */ } }' },
        { type: 'note', value: 'Если класс сложно назвать одним словом — скорее всего, у него несколько ответственностей. Это сигнал к рефакторингу.' }
      ]
    },
    {
      id: 3,
      title: 'Функции расширения — за и против',
      type: 'theory',
      content: [
        { type: 'text', value: 'Функции расширения — мощный инструмент, но их надо использовать с умом. Они не должны нарушать инкапсуляцию или создавать "магию".' },
        { type: 'code', language: 'kotlin', value: '// Хорошо: логично расширяет String\nfun String.isValidEmail() = Regex("[a-zA-Z0-9.]+@[a-zA-Z0-9.]+").matches(this)\n\n// Хорошо: утилитная логика без засорения класса\nfun List<Int>.median(): Double {\n    val sorted = sorted()\n    return if (size % 2 == 0) (sorted[size/2-1] + sorted[size/2]) / 2.0\n    else sorted[size/2].toDouble()\n}' },
        { type: 'code', language: 'kotlin', value: '// Плохо: расширение скрывает важную бизнес-логику\nfun User.process() { /* сложная бизнес-логика */ }\n// Лучше: явный метод в сервисе\nclass UserService { fun processUser(user: User) { /* ... */ } }' },
        { type: 'warning', value: 'Не выносите бизнес-логику в расширения — они трудно находятся и нарушают принцип единственной ответственности.' }
      ]
    },
    {
      id: 4,
      title: 'Null Safety: правильное использование',
      type: 'theory',
      content: [
        { type: 'text', value: 'Null Safety Kotlin — один из главных плюсов языка. Но его можно "обойти" через !! и let-цепочки, превратив в проблему.' },
        { type: 'code', language: 'kotlin', value: '// Антипаттерн: !! убивает null safety\nval name = user!!.profile!!.displayName!! // NullPointerException ждёт\n\n// Лучше: явная обработка\nval name = user?.profile?.displayName ?: "Аноним"\n\n// Антипаттерн: nullable там, где не нужно\nfun findUser(id: Int): User? // если всегда есть юзер — не делайте nullable\n\n// Лучше: выбрасывать исключение если нет — явно\nfun findUserOrThrow(id: Int): User = repo.findById(id)\n    ?: throw UserNotFoundException(id)' },
        { type: 'tip', value: 'Правило: nullable только когда "нет значения" — это нормальный сценарий. Если это ошибка — бросайте исключение.' }
      ]
    },
    {
      id: 5,
      title: 'Соглашения об именовании',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Стандарты Kotlin Coding Conventions' },
        { type: 'list', value: 'Классы: UpperCamelCase (UserRepository, HttpClient)\nФункции и свойства: lowerCamelCase (getUserById, isActive)\nКонстанты: SCREAMING_SNAKE_CASE (MAX_RETRIES, API_KEY)\nПакеты: lowercase (com.example.data.repository)\nLambda параметры: it только если очевидно; иначе называйте явно\nБулевы: is/has/can/should (isValid, hasPermission, canEdit)' },
        { type: 'code', language: 'kotlin', value: '// Хорошо\nconst val MAX_RETRY_COUNT = 3\nclass UserProfileRepository\nfun isEmailValid(email: String): Boolean\nval users = listOf(1, 2, 3).map { userId -> loadUser(userId) }\n\n// Плохо\nconst val maxretrycount = 3\nclass userProfileRep\nfun emailValid(email: String): Boolean' },
        { type: 'note', value: 'Официальные соглашения: kotlinlang.org/docs/coding-conventions.html. IDEA/ktlint проверяет их автоматически.' }
      ]
    },
    {
      id: 6,
      title: 'Производительность: частые ошибки',
      type: 'theory',
      content: [
        { type: 'text', value: 'Kotlin удобен, но некоторые идиоматичные конструкции могут создавать скрытые аллокации памяти. Знайте, где быть осторожными.' },
        { type: 'code', language: 'kotlin', value: '// Лямбды создают объекты — осторожно в горячих путях\nlist.forEach { process(it) } // OK для большинства случаев\n\n// Inline-функции избегают аллокаций\ninline fun <T> List<T>.fastForEach(action: (T) -> Unit) {\n    for (item in this) action(item)\n}\n\n// buildList/buildMap — лучше чем mutableListOf + add\nval result = buildList {\n    add("первый")\n    addAll(otherList)\n    if (condition) add("последний")\n}' },
        { type: 'tip', value: 'Используйте inline для часто вызываемых функций высшего порядка. Это устраняет аллокацию лямбда-объекта.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: рефакторинг Java-стиля',
      type: 'practice',
      difficulty: 'medium',
      description: 'Отрефакторьте Java-стильный Kotlin-код в идиоматический.',
      requirements: [
        'Замените цикл for с condition на filter/map/firstOrNull',
        'Замените if (x != null) { x.method() } на x?.method()',
        'Замените строковую конкатенацию на строковые шаблоны',
        'Используйте data class вместо класса с геттерами вручную'
      ],
      expectedOutput: 'Код стал короче минимум в 2 раза без потери читаемости',
      hint: 'Пройдитесь по каждому пункту по очереди. filter вернёт список, firstOrNull — первый или null.',
      solution: '// До рефакторинга\nclass User { var name: String = ""; var age: Int = 0 }\nval users = ArrayList<User>()\nvar found: User? = null\nfor (u in users) { if (u.age > 18) { found = u; break } }\nval greeting: String\nif (found != null) { greeting = "Hello, " + found.name + "!" } else { greeting = "Hello, stranger!" }\n\n// После рефакторинга\ndata class User(val name: String, val age: Int)\nval users = listOf<User>()\nval found = users.firstOrNull { it.age > 18 }\nval greeting = found?.let { "Hello, ${it.name}!" } ?: "Hello, stranger!"',
      explanation: 'Идиоматический Kotlin использует функциональные операции вместо циклов, ?. вместо null-проверок, и шаблоны строк вместо конкатенации.'
    }
  ]
}
