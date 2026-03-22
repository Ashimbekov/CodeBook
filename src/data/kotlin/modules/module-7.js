export default {
  id: 7,
  title: 'Null Safety',
  description: 'Защита от NullPointerException: nullable типы, безопасные вызовы, элвис-оператор, let',
  lessons: [
    {
      id: 1,
      title: 'Проблема null и как Kotlin её решает',
      type: 'theory',
      content: [
        { type: 'text', value: 'NullPointerException (NPE) — самая частая ошибка в программировании на Java. Её называют "ошибкой на миллиард долларов" — столько убытков она принесла за десятилетия. Kotlin решает эту проблему на уровне системы типов.' },
        { type: 'tip', value: 'Представь, что обычная переменная — это полка в шкафу. Там ВСЕГДА что-то лежит. Nullable переменная — это полка с надписью "может быть пустой". Прежде чем взять что-то с такой полки, нужно проверить — а есть ли там что-нибудь?' },
        { type: 'heading', value: 'Nullable и Non-nullable типы' },
        { type: 'code', language: 'kotlin', value: '// Non-nullable — не может быть null\nvar name: String = "Нурдаулет"\n// name = null  // ОШИБКА компиляции!\n\n// Nullable — может быть null (добавляем ?)\nvar nickname: String? = "Kotlin_Dev"\nnickname = null  // OK!\n\nprintln(name.length)  // 9 — безопасно\n// println(nickname.length)  // ОШИБКА компиляции! nickname может быть null' },
        { type: 'note', value: 'Знак ? после типа делает переменную nullable. String? — это "строка или null". Без ? — это просто "строка", null недопустим. Компилятор проверяет это на этапе компиляции.' }
      ]
    },
    {
      id: 2,
      title: 'Оператор безопасного вызова ?.',
      type: 'theory',
      content: [
        { type: 'text', value: 'Оператор ?. позволяет вызывать методы и обращаться к свойствам nullable переменной безопасно. Если переменная null — выражение возвращает null вместо NPE.' },
        { type: 'code', language: 'kotlin', value: 'var nickname: String? = "Kotlin_Dev"\n\n// Безопасный вызов — если null, вернёт null\nprintln(nickname?.length)   // 10\nprintln(nickname?.uppercase()) // KOTLIN_DEV\n\nnickname = null\nprintln(nickname?.length)   // null (не NPE!)\nprintln(nickname?.uppercase()) // null' },
        { type: 'tip', value: '?. как осторожный помощник: "Есть что-то в коробке? Тогда достань. Нет — скажи null". Без ?. помощник бы упал в обморок от пустой коробки.' },
        { type: 'heading', value: 'Цепочка безопасных вызовов' },
        { type: 'code', language: 'kotlin', value: 'data class Address(val city: String?)\ndata class User(val name: String, val address: Address?)\n\nval user: User? = User("Нурдаулет", Address("Астана"))\n\n// Цепочка — если хоть одно null, результат null\nval city = user?.address?.city\nprintln(city)  // Астана\n\nval user2: User? = null\nval city2 = user2?.address?.city\nprintln(city2)  // null — и никакого NPE!' },
        { type: 'note', value: 'Цепочка ?. прерывается на первом null. user?.address?.city — если user null, сразу null. Если address null — null. Иначе — значение city.' }
      ]
    },
    {
      id: 3,
      title: 'Элвис-оператор ?:',
      type: 'theory',
      content: [
        { type: 'text', value: 'Оператор ?: (элвис-оператор) позволяет задать значение по умолчанию если выражение равно null. Название "элвис" — потому что символ ?: напоминает причёску Элвиса Пресли.' },
        { type: 'code', language: 'kotlin', value: 'val nickname: String? = null\n\n// Если nickname null — используй "Аноним"\nval displayName = nickname ?: "Аноним"\nprintln(displayName)  // Аноним\n\nval realNickname: String? = "KotlinFan"\nval displayName2 = realNickname ?: "Аноним"\nprintln(displayName2)  // KotlinFan' },
        { type: 'heading', value: 'Сочетание с ?.' },
        { type: 'code', language: 'kotlin', value: 'val user: String? = null\n\n// Безопасный вызов + значение по умолчанию\nval length = user?.length ?: 0\nprintln(length)  // 0 (user == null, берём default)\n\nval name: String? = "Нурдаулет"\nval nameLength = name?.length ?: 0\nprintln(nameLength)  // 9' },
        { type: 'tip', value: 'val result = something?.method() ?: defaultValue — читай это как: "вызови method() если something не null, иначе верни defaultValue". Это очень частый паттерн в Kotlin.' },
        { type: 'code', language: 'kotlin', value: '// Элвис с return/throw\nfun getUser(id: Int): String {\n    val db: Map<Int, String> = mapOf(1 to "Нурдаулет")\n    return db[id] ?: throw IllegalArgumentException("Пользователь $id не найден")\n}' }
      ]
    },
    {
      id: 4,
      title: 'Оператор !! — осторожное использование',
      type: 'theory',
      content: [
        { type: 'text', value: 'Оператор !! ("двойной восклицательный" или "not-null assertion") говорит компилятору: "я уверен, что это не null, доверяй мне". Если всё же null — получишь NPE.' },
        { type: 'code', language: 'kotlin', value: 'val name: String? = "Нурдаулет"\n\n// Говорим Kotlin: я гарантирую, что name не null\nval length = name!!.length\nprintln(length)  // 9\n\nval nullName: String? = null\n// nullName!!.length  // KotlinNullPointerException!' },
        { type: 'warning', value: 'НЕ используй !! если можно обойтись ?. или ?:. Оператор !! — это как сказать системе безопасности "выключись, я сам знаю что делаю". Иногда нужно, но должно быть редкостью в коде.' },
        { type: 'tip', value: 'Если видишь много !! в коде — это "запах" проблемы. Скорее всего код написан без понимания null safety. Каждый !! — потенциальное место для NPE.' },
        { type: 'heading', value: 'Когда !! оправдан?' },
        { type: 'list', items: [
          'Когда ты точно знаешь что значение не null в данном контексте',
          'При работе с Java-кодом где типы не имеют null-аннотаций',
          'В тестах — когда важна ясность, а не безопасность',
          'В крайнем случае — всегда предпочитай let или ?: вместо !!'
        ]}
      ]
    },
    {
      id: 5,
      title: 'let — работа с nullable значениями',
      type: 'theory',
      content: [
        { type: 'text', value: 'let — это функция, которая выполняет блок кода только если значение не null. Внутри блока переменная it гарантированно не null.' },
        { type: 'code', language: 'kotlin', value: 'val email: String? = "user@example.com"\n\n// let выполняется только если email != null\nemail?.let {\n    println("Email длиной ${it.length}: $it")\n    println(it.uppercase())\n}\n// Вывод:\n// Email длиной 16: user@example.com\n// USER@EXAMPLE.COM\n\nval nullEmail: String? = null\nnullEmail?.let {\n    println("Это не выведется!")\n}' },
        { type: 'tip', value: 'email?.let { ... } — как охранник с пропуском: "Есть email? Пропускаю в блок, внутри работай спокойно — там уже проверено". Нет email — блок не выполняется.' },
        { type: 'heading', value: 'let с именованным параметром' },
        { type: 'code', language: 'kotlin', value: 'val name: String? = "Нурдаулет"\n\n// Вместо it можно дать своё имя\nname?.let { nonNullName ->\n    println("Привет, $nonNullName!")\n    println("Длина имени: ${nonNullName.length}")\n}' },
        { type: 'note', value: 'let возвращает результат последнего выражения блока. Это можно использовать: val upper = name?.let { it.uppercase() } ?: "АНОНИМ"' }
      ]
    },
    {
      id: 6,
      title: 'Проверка с if и smart cast',
      type: 'theory',
      content: [
        { type: 'text', value: 'Kotlin умеет делать "умное приведение типов" (smart cast): после проверки if (x != null) компилятор автоматически понимает, что x не null внутри блока.' },
        { type: 'code', language: 'kotlin', value: 'val name: String? = "Нурдаулет"\n\nif (name != null) {\n    // Здесь name автоматически типа String (не String?)\n    println(name.length)    // ОК! Smart cast!\n    println(name.uppercase())\n}\n\n// if-else\nif (name != null) {\n    println("Имя: ${name.uppercase()}")\n} else {\n    println("Имя не указано")\n}' },
        { type: 'heading', value: 'Безопасное приведение: as?' },
        { type: 'code', language: 'kotlin', value: 'val obj: Any = "Это строка"\n\n// Обычное приведение — бросает исключение если тип не тот\n// val str: String = obj as String  // OK если String\n\n// Безопасное приведение — null если тип не тот\nval str: String? = obj as? String\nval num: Int? = obj as? Int   // null, obj не Int\n\nprintln(str)  // Это строка\nprintln(num)  // null' },
        { type: 'tip', value: 'Smart cast — Kotlin как следователь: "проверил — не null, значит дальше можно работать без страха". Не нужны дополнительные преобразования.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Безопасная обработка данных',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напиши функцию безопасного парсинга и обработки пользовательских данных.',
      requirements: [
        'Функция parseAge(input: String?): Int — парсит возраст из строки, возвращает 0 если null или некорректно',
        'Функция getGreeting(name: String?): String — возвращает "Привет, {name}!" или "Привет, незнакомец!" если name null',
        'Вызови с разными значениями: null, пустой строкой, корректными данными',
        'Используй ?:, ?. и let'
      ],
      expectedOutput: 'Возраст из "25": 25\nВозраст из "abc": 0\nВозраст из null: 0\nПривет, Нурдаулет!\nПривет, незнакомец!',
      hint: 'parseAge: input?.toIntOrNull() ?: 0. getGreeting: используй let или elvis-оператор.',
      solution: 'fun parseAge(input: String?): Int = input?.toIntOrNull() ?: 0\n\nfun getGreeting(name: String?): String {\n    return name?.let { "Привет, $it!" } ?: "Привет, незнакомец!"\n}\n\nfun main() {\n    println("Возраст из \\"25\\": ${parseAge("25")}")\n    println("Возраст из \\"abc\\": ${parseAge("abc")}")\n    println("Возраст из null: ${parseAge(null)}")\n    println(getGreeting("Нурдаулет"))\n    println(getGreeting(null))\n}',
      explanation: 'parseAge использует цепочку: input?.toIntOrNull() — безопасный вызов + safe parse, ?: 0 — дефолт при null. getGreeting использует let: если name не null — выполняет блок, иначе ?: возвращает дефолт.'
    }
  ]
}
