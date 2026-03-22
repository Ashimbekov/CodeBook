export default {
  id: 25,
  title: 'Kotlin DSL',
  description: 'Создание предметно-ориентированных языков (DSL) на Kotlin. Лямбды с получателем, apply/with, строители (builder) и Gradle Kotlin DSL.',
  lessons: [
    {
      id: 1,
      title: 'Что такое DSL и зачем он нужен?',
      type: 'theory',
      content: [
        { type: 'text', value: 'DSL (Domain-Specific Language) — язык, специализированный для конкретной предметной области. В Kotlin DSL строятся на лямбдах с получателем (lambda with receiver).' },
        { type: 'heading', value: 'Примеры DSL в экосистеме Kotlin' },
        { type: 'list', value: 'Gradle Kotlin DSL — сборка проектов\nKotlinx HTML — генерация HTML\nKtor routing — объявление маршрутов\nJetpack Compose — декларативный UI\nSQL DSL (Exposed) — запросы к базе данных' },
        { type: 'code', language: 'kotlin', value: '// Пример HTML DSL\nval html = html {\n    head { title { +"Моя страница" } }\n    body {\n        h1 { +"Заголовок" }\n        p { +"Параграф текста" }\n    }\n}' },
        { type: 'note', value: 'DSL делает код похожим на конфигурационный файл, но при этом это полноценный типобезопасный Kotlin.' }
      ]
    },
    {
      id: 2,
      title: 'Лямбда с получателем',
      type: 'theory',
      content: [
        { type: 'text', value: 'Лямбда с получателем (lambda with receiver) — это лямбда, внутри которой this ссылается на переданный объект. Это ключевой механизм для DSL.' },
        { type: 'code', language: 'kotlin', value: '// Обычная функция-строитель\nfun buildString(block: StringBuilder.() -> Unit): String {\n    val sb = StringBuilder()\n    sb.block() // this = sb внутри block\n    return sb.toString()\n}\n\nval result = buildString {\n    append("Привет, ")\n    append("Kotlin DSL!")\n    appendLine()\n    append("Строитель строк")\n}' },
        { type: 'text', value: 'StringBuilder.() -> Unit — тип "лямбда-расширение для StringBuilder". Внутри такой лямбды доступны все методы StringBuilder без явного this.' },
        { type: 'tip', value: 'Стандартные функции apply, with, run — это и есть лямбды с получателем под капотом!' }
      ]
    },
    {
      id: 3,
      title: 'Строитель (Builder) через DSL',
      type: 'theory',
      content: [
        { type: 'text', value: 'DSL-строители заменяют громоздкий паттерн Builder из Java более читаемым и типобезопасным кодом.' },
        { type: 'code', language: 'kotlin', value: 'data class Person(val name: String, val age: Int, val email: String)\n\nclass PersonBuilder {\n    var name: String = ""\n    var age: Int = 0\n    var email: String = ""\n    fun build() = Person(name, age, email)\n}\n\nfun person(block: PersonBuilder.() -> Unit): Person {\n    return PersonBuilder().apply(block).build()\n}\n\nval p = person {\n    name = "Алибек"\n    age = 25\n    email = "alibek@example.com"\n}' },
        { type: 'note', value: 'Такой DSL: (1) типобезопасен, (2) легко читается, (3) IDE даёт автодополнение, (4) компилятор проверяет ошибки.' }
      ]
    },
    {
      id: 4,
      title: 'Вложенные DSL и @DslMarker',
      type: 'theory',
      content: [
        { type: 'text', value: '@DslMarker — аннотация, которая предотвращает неявный доступ к внешним получателям во вложенных блоках DSL. Это делает DSL безопаснее.' },
        { type: 'code', language: 'kotlin', value: '@DslMarker\nannotation class HtmlDsl\n\n@HtmlDsl\nclass TagBuilder(val name: String) {\n    private val children = mutableListOf<TagBuilder>()\n    private var text = ""\n\n    fun tag(name: String, block: TagBuilder.() -> Unit) {\n        children.add(TagBuilder(name).apply(block))\n    }\n    operator fun String.unaryPlus() { text = this }\n    fun render(): String = "<$name>$text${children.joinToString("") { it.render() }}</$name>"\n}\n\nfun html(block: TagBuilder.() -> Unit) = TagBuilder("html").apply(block)\n\nval page = html {\n    tag("body") {\n        tag("h1") { +"Заголовок" }\n        tag("p")  { +"Текст" }\n    }\n}\nprintln(page.render())' },
        { type: 'warning', value: 'Без @DslMarker во вложенном блоке tag { } можно случайно вызвать методы внешнего TagBuilder, что приведёт к непредсказуемому поведению.' }
      ]
    },
    {
      id: 5,
      title: 'Gradle Kotlin DSL',
      type: 'theory',
      content: [
        { type: 'text', value: 'Gradle Kotlin DSL — реальный пример промышленного DSL. Файлы build.gradle.kts используют лямбды с получателем для описания сборки проекта.' },
        { type: 'code', language: 'kotlin', value: '// build.gradle.kts\nplugins {\n    kotlin("jvm") version "1.9.0"\n    application\n}\n\ndependencies {\n    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3")\n    testImplementation(kotlin("test"))\n}\n\napplication {\n    mainClass.set("com.example.MainKt")\n}' },
        { type: 'tip', value: 'Kotlin DSL для Gradle даёт полную поддержку IDE: автодополнение, рефакторинг, проверка типов. Это огромное преимущество перед Groovy DSL.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: DSL для конфигурации сервера',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте DSL для описания конфигурации HTTP-сервера: хост, порт, маршруты.',
      requirements: [
        'Класс ServerConfig с полями host, port и списком маршрутов',
        'Класс Route с полями path и handler (строка)',
        'DSL функция server { } принимает лямбду с получателем ServerConfig',
        'Внутри server { } должна быть функция route(path, handler)',
        'Вывести конфиг в println'
      ],
      expectedOutput: 'ServerConfig(host=localhost, port=8080, routes=[Route(/hello, handler1), Route(/bye, handler2)])',
      hint: 'Создайте методы в ServerConfig, которые принимают лямбды с получателем или просто параметры.',
      solution: 'data class Route(val path: String, val handler: String)\n\nclass ServerConfig {\n    var host = "localhost"\n    var port = 8080\n    val routes = mutableListOf<Route>()\n    fun route(path: String, handler: String) { routes.add(Route(path, handler)) }\n    override fun toString() = "ServerConfig(host=$host, port=$port, routes=$routes)"\n}\n\nfun server(block: ServerConfig.() -> Unit) = ServerConfig().apply(block)\n\nfun main() {\n    val config = server {\n        host = "localhost"\n        port = 8080\n        route("/hello", "handler1")\n        route("/bye", "handler2")\n    }\n    println(config)\n}',
      explanation: 'apply принимает лямбду с получателем ServerConfig, что позволяет писать host = "..." напрямую. Это классический паттерн DSL-строителя.'
    }
  ]
}
