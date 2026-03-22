export default {
  id: 27,
  title: 'Kotlin Multiplatform',
  description: 'Kotlin Multiplatform (KMP) позволяет разделять бизнес-логику между Android, iOS, Web и Desktop. Изучаем структуру проекта, expect/actual и практику.',
  lessons: [
    {
      id: 1,
      title: 'Что такое Kotlin Multiplatform?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Kotlin Multiplatform (KMP) — технология, позволяющая писать общий (shared) код один раз и использовать его на разных платформах: Android, iOS, Web, Desktop, Server.' },
        { type: 'heading', value: 'Что выносят в общий код?' },
        { type: 'list', value: 'Бизнес-логика (расчёты, правила)\nСетевые запросы (Ktor client)\nРабота с базой данных (SQLDelight)\nМодели данных\nПрезентационная логика (ViewModel)' },
        { type: 'note', value: 'KMP не заменяет нативный UI! Android использует Compose, iOS — SwiftUI. Общий код — только логика, не интерфейс (хотя Compose Multiplatform движется в эту сторону).' }
      ]
    },
    {
      id: 2,
      title: 'Структура KMP-проекта',
      type: 'theory',
      content: [
        { type: 'text', value: 'KMP-проект имеет иерархию source sets (наборов источников), где commonMain содержит общий код, а платформенные source sets — специфичный.' },
        { type: 'list', value: 'commonMain — код для всех платформ\nandroidMain — код только для Android\niosMain — код только для iOS\ncommonTest — общие тесты\nandroidTest / iosTest — платформенные тесты' },
        { type: 'code', language: 'kotlin', value: '// build.gradle.kts\nkotlin {\n    androidTarget()\n    iosX64()\n    iosArm64()\n    iosSimulatorArm64()\n\n    sourceSets {\n        val commonMain by getting {\n            dependencies {\n                implementation("io.ktor:ktor-client-core:2.3.4")\n            }\n        }\n        val androidMain by getting {\n            dependencies {\n                implementation("io.ktor:ktor-client-android:2.3.4")\n            }\n        }\n    }\n}' },
        { type: 'tip', value: 'Каждый движок Ktor специфичен для платформы, но API клиента — общий. Это суть KMP: общий интерфейс, разные реализации.' }
      ]
    },
    {
      id: 3,
      title: 'expect / actual механизм',
      type: 'theory',
      content: [
        { type: 'text', value: 'expect/actual — ключевой механизм KMP. В commonMain объявляем expect (ожидаем реализацию), в платформенных source sets пишем actual (реальная реализация).' },
        { type: 'code', language: 'kotlin', value: '// commonMain/Platform.kt\nexpect fun getCurrentPlatformName(): String\n\nexpect class DatabaseDriver {\n    fun connect(dbName: String)\n}' },
        { type: 'code', language: 'kotlin', value: '// androidMain/Platform.kt\nactual fun getCurrentPlatformName() = "Android"\n\nactual class DatabaseDriver {\n    actual fun connect(dbName: String) {\n        // Android-специфичная реализация SQLite\n    }\n}' },
        { type: 'code', language: 'kotlin', value: '// iosMain/Platform.kt\nactual fun getCurrentPlatformName() = "iOS"\n\nactual class DatabaseDriver {\n    actual fun connect(dbName: String) {\n        // iOS-специфичная реализация Core Data\n    }\n}' },
        { type: 'warning', value: 'Каждая платформа ОБЯЗАНА предоставить actual для каждого expect. Если хотя бы одна платформа не реализовала — ошибка компиляции.' }
      ]
    },
    {
      id: 4,
      title: 'Ktor Client в KMP',
      type: 'theory',
      content: [
        { type: 'text', value: 'Ktor Client — мультиплатформенный HTTP-клиент. Код запросов пишется один раз в commonMain и работает на всех платформах.' },
        { type: 'code', language: 'kotlin', value: '// commonMain\nimport io.ktor.client.*\nimport io.ktor.client.call.*\nimport io.ktor.client.plugins.contentnegotiation.*\nimport io.ktor.client.request.*\nimport io.ktor.serialization.kotlinx.json.*\n\nclass ApiClient {\n    private val client = HttpClient {\n        install(ContentNegotiation) { json() }\n    }\n\n    suspend fun fetchUser(id: Int): User {\n        return client.get("https://api.example.com/users/$id").body()\n    }\n}' },
        { type: 'note', value: 'HttpClient() без аргументов автоматически выбирает движок для текущей платформы благодаря expect/actual.' }
      ]
    },
    {
      id: 5,
      title: 'SQLDelight: общая база данных',
      type: 'theory',
      content: [
        { type: 'text', value: 'SQLDelight генерирует типобезопасный Kotlin API из SQL-запросов. Он мультиплатформенный и работает на Android (SQLite) и iOS (SQLite через actual).' },
        { type: 'code', language: 'kotlin', value: '-- src/commonMain/sqldelight/User.sq\nCREATE TABLE User (\n    id   INTEGER PRIMARY KEY,\n    name TEXT NOT NULL,\n    age  INTEGER NOT NULL\n);\n\nselectAll:\nSELECT * FROM User;\n\ninsertUser:\nINSERT INTO User (name, age) VALUES (?, ?);' },
        { type: 'code', language: 'kotlin', value: '// Использование сгенерированного API в commonMain\nclass UserDao(driver: SqlDriver) {\n    private val db = AppDatabase(driver)\n    \n    fun getAllUsers() = db.userQueries.selectAll().executeAsList()\n    \n    fun addUser(name: String, age: Long) {\n        db.userQueries.insertUser(name, age)\n    }\n}' },
        { type: 'tip', value: 'SQLDelight проверяет SQL-запросы во время компиляции. Ошибка в SQL — ошибка компиляции, не runtime. Это устраняет целый класс ошибок.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: общая бизнес-логика',
      type: 'practice',
      difficulty: 'hard',
      description: 'Напишите общий класс CurrencyConverter в commonMain с expect-функцией getExchangeRate() и реализацией логики конвертации.',
      requirements: [
        'expect fun getExchangeRate(from: String, to: String): Double в commonMain',
        'Класс CurrencyConverter с методом convert(amount, from, to)',
        'actual реализация для "jvm" возвращает фиксированный курс 450.0 для USD/KZT',
        'Тест в commonTest проверяет конвертацию 100 USD = 45000 KZT'
      ],
      expectedOutput: '45000.0',
      hint: 'В тесте используйте runTest из kotlinx-coroutines-test если getExchangeRate suspend.',
      solution: '// commonMain\nexpect fun getExchangeRate(from: String, to: String): Double\n\nclass CurrencyConverter {\n    fun convert(amount: Double, from: String, to: String): Double {\n        val rate = getExchangeRate(from, to)\n        return amount * rate\n    }\n}\n\n// jvmMain\nactual fun getExchangeRate(from: String, to: String): Double {\n    return if (from == "USD" && to == "KZT") 450.0 else 1.0\n}\n\n// commonTest\nclass CurrencyConverterTest {\n    @Test\n    fun `100 USD равно 45000 KZT`() {\n        val converter = CurrencyConverter()\n        assertEquals(45000.0, converter.convert(100.0, "USD", "KZT"))\n    }\n}',
      explanation: 'expect без тела объявляет контракт. actual в jvmMain предоставляет реализацию. Тест в commonTest тестирует общую логику, которая работает на всех платформах.'
    }
  ]
}
