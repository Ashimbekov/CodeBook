export default {
  id: 26,
  title: 'Тестирование в Kotlin',
  description: 'Юнит-тестирование с JUnit5 и kotlin.test, моки с Mockk, тестирование корутин с kotlinx-coroutines-test.',
  lessons: [
    {
      id: 1,
      title: 'Основы JUnit5 и kotlin.test',
      type: 'theory',
      content: [
        { type: 'text', value: 'Тестирование — обязательная часть профессиональной разработки. В Kotlin используются JUnit5 и обёртка kotlin.test, которая даёт удобные assert-функции.' },
        { type: 'code', language: 'kotlin', value: 'import kotlin.test.*\nimport org.junit.jupiter.api.Test\n\nclass CalculatorTest {\n    @Test\n    fun `сложение двух чисел`() {\n        val result = 2 + 3\n        assertEquals(5, result)\n    }\n\n    @Test\n    fun `деление на ноль бросает исключение`() {\n        assertFailsWith<ArithmeticException> {\n            val x = 1 / 0\n        }\n    }\n}' },
        { type: 'list', value: 'assertEquals(expected, actual) — проверяет равенство\nassertTrue/assertFalse — проверяет булево условие\nassertNull/assertNotNull — проверяет null\nassertFailsWith<T> — ожидает исключение типа T' },
        { type: 'tip', value: 'В Kotlin тестовые функции можно называть обратными кавычками: fun `проверка граничного значения`(). Это читается как документация!' }
      ]
    },
    {
      id: 2,
      title: 'Структура тестов: AAA',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Паттерн Arrange-Act-Assert' },
        { type: 'text', value: 'Каждый тест должен состоять из трёх частей: Arrange (подготовка), Act (действие), Assert (проверка). Это делает тесты читаемыми и понятными.' },
        { type: 'code', language: 'kotlin', value: 'class ShoppingCartTest {\n    @Test\n    fun `добавление товара увеличивает сумму`() {\n        // Arrange\n        val cart = ShoppingCart()\n        val item = Item("Книга", price = 500.0)\n\n        // Act\n        cart.addItem(item)\n\n        // Assert\n        assertEquals(500.0, cart.total)\n        assertEquals(1, cart.itemCount)\n    }\n}' },
        { type: 'note', value: '@BeforeEach выполняется перед каждым тестом, @AfterEach — после. Используйте их для создания и очистки тестовых данных.' }
      ]
    },
    {
      id: 3,
      title: 'Mockk: моки и стабы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Mockk — популярная библиотека для создания моков (mock) в Kotlin. Мок — это объект-заменитель, который имитирует реальную зависимость.' },
        { type: 'code', language: 'kotlin', value: 'import io.mockk.*\nimport org.junit.jupiter.api.Test\n\ninterface UserRepository {\n    fun findById(id: Int): User?\n    fun save(user: User)\n}\n\nclass UserServiceTest {\n    private val repository = mockk<UserRepository>()\n    private val service = UserService(repository)\n\n    @Test\n    fun `findUser возвращает пользователя по id`() {\n        val user = User(1, "Айгерим")\n        every { repository.findById(1) } returns user\n\n        val result = service.findUser(1)\n\n        assertEquals("Айгерим", result?.name)\n        verify { repository.findById(1) }\n    }\n}' },
        { type: 'tip', value: 'every { } настраивает поведение мока. verify { } проверяет, что метод был вызван. coEvery/coVerify — для suspend-функций.' }
      ]
    },
    {
      id: 4,
      title: 'Тестирование корутин',
      type: 'theory',
      content: [
        { type: 'text', value: 'Обычный runBlocking работает для тестирования корутин, но kotlinx-coroutines-test предоставляет runTest — более мощный инструмент с контролем времени.' },
        { type: 'code', language: 'kotlin', value: 'import kotlinx.coroutines.test.*\nimport kotlin.test.*\n\nclass AsyncServiceTest {\n    @Test\n    fun `fetchData возвращает данные`() = runTest {\n        val service = AsyncService()\n        val data = service.fetchData() // suspend-функция\n        assertEquals("expected", data)\n    }\n\n    @Test\n    fun `задержка пропускается в тесте`() = runTest {\n        val start = currentTime\n        delay(10_000) // не ждёт реально 10 секунд!\n        val elapsed = currentTime - start\n        assertEquals(10_000, elapsed)\n    }\n}' },
        { type: 'warning', value: 'runTest пропускает виртуальное время — delay(10_000) выполнится мгновенно. Это критично для быстрого тестирования асинхронного кода.' }
      ]
    },
    {
      id: 5,
      title: 'Параметризованные тесты',
      type: 'theory',
      content: [
        { type: 'text', value: 'Параметризованные тесты позволяют запустить один тест с разными входными данными. В JUnit5 это делается через @ParameterizedTest.' },
        { type: 'code', language: 'kotlin', value: 'import org.junit.jupiter.params.ParameterizedTest\nimport org.junit.jupiter.params.provider.CsvSource\n\nclass MathTest {\n    @ParameterizedTest\n    @CsvSource(\n        "2, 3, 5",\n        "0, 0, 0",\n        "-1, 1, 0",\n        "10, -5, 5"\n    )\n    fun `сложение чисел`(a: Int, b: Int, expected: Int) {\n        assertEquals(expected, a + b)\n    }\n}' },
        { type: 'tip', value: '@ValueSource, @MethodSource, @CsvSource — разные источники данных. @CsvSource наиболее удобен для пар входных/выходных значений.' }
      ]
    },
    {
      id: 6,
      title: 'Покрытие кода и TDD',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Test-Driven Development' },
        { type: 'text', value: 'TDD — методология, при которой тест пишется до реализации. Цикл: Red (тест не проходит) → Green (пишем минимум кода) → Refactor (улучшаем).' },
        { type: 'code', language: 'kotlin', value: '// Шаг 1: Пишем тест (RED)\nclass FizzBuzzTest {\n    @Test\n    fun `15 возвращает FizzBuzz`() {\n        assertEquals("FizzBuzz", fizzBuzz(15))\n    }\n}\n\n// Шаг 2: Пишем реализацию (GREEN)\nfun fizzBuzz(n: Int) = when {\n    n % 15 == 0 -> "FizzBuzz"\n    n % 3 == 0  -> "Fizz"\n    n % 5 == 0  -> "Buzz"\n    else        -> n.toString()\n}' },
        { type: 'note', value: 'Покрытие кода (code coverage) — процент строк/ветвей, проверенных тестами. Хорошей отметкой считается 70-80%, но важно качество тестов, а не число.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: написание тестов для стека',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напишите тесты для класса Stack<T> с операциями push, pop, peek и isEmpty.',
      requirements: [
        'Тест: push добавляет элемент, size увеличивается',
        'Тест: pop возвращает последний добавленный элемент',
        'Тест: pop из пустого стека бросает NoSuchElementException',
        'Тест: peek не удаляет элемент',
        'Тест: isEmpty возвращает true для нового стека'
      ],
      expectedOutput: 'Все 5 тестов проходят',
      hint: 'Используйте assertFailsWith<NoSuchElementException> для проверки исключений.',
      solution: 'class Stack<T> {\n    private val data = mutableListOf<T>()\n    fun push(item: T) { data.add(item) }\n    fun pop(): T = if (data.isEmpty()) throw NoSuchElementException() else data.removeLast()\n    fun peek(): T = if (data.isEmpty()) throw NoSuchElementException() else data.last()\n    val isEmpty get() = data.isEmpty()\n    val size get() = data.size\n}\n\nclass StackTest {\n    @Test fun `push увеличивает size`() { val s = Stack<Int>(); s.push(1); assertEquals(1, s.size) }\n    @Test fun `pop возвращает последний`() { val s = Stack<Int>(); s.push(1); s.push(2); assertEquals(2, s.pop()) }\n    @Test fun `pop из пустого бросает исключение`() { assertFailsWith<NoSuchElementException> { Stack<Int>().pop() } }\n    @Test fun `peek не удаляет`() { val s = Stack<Int>(); s.push(5); s.peek(); assertEquals(1, s.size) }\n    @Test fun `isEmpty для нового стека`() { assertTrue(Stack<Int>().isEmpty) }\n}',
      explanation: 'Каждый тест проверяет одно поведение. Это принцип "один тест — одно утверждение", который делает тесты понятными и лёгкими для поддержки.'
    }
  ]
}
