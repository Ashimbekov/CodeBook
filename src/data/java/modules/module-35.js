export default {
  id: 35,
  title: 'Optional',
  description: 'Решаем проблему null с помощью Optional — специального контейнера для значений, которые могут отсутствовать',
  lessons: [
    {
      id: 1,
      title: 'Проблема null',
      type: 'theory',
      content: [
        { type: 'text', value: 'null — это специальное значение, означающее "ничего нет". Оно придумано, чтобы показать отсутствие объекта. Но использование null приводит к самой частой ошибке в Java — NullPointerException.' },
        { type: 'tip', value: 'Представь: тебе дали пустой стакан и попросили выпить из него. Ты тянешься — а там ничего нет! В программировании это NullPointerException — попытка использовать переменную, которая указывает в "никуда".' },
        { type: 'code', language: 'java', value: '// Классическая проблема с null\nString name = null;\nSystem.out.println(name.length()); // NullPointerException!\n\n// Нужно постоянно проверять\nif (name != null) {\n    System.out.println(name.length());\n}\n\n// Ещё хуже - цепочки\nString city = user.getAddress().getCity().toUpperCase();\n// Если любой метод вернёт null - NullPointerException!' },
        { type: 'heading', value: 'Почему null называют "ошибкой на миллиард"?' },
        { type: 'text', value: 'Тони Хоар, создатель null, назвал его своей "ошибкой на миллиард долларов" — столько денег потрачено на поиск и исправление ошибок, связанных с null за все годы существования программирования.' },
        { type: 'code', language: 'java', value: '// Реальная боль: методы могут вернуть null\npublic String findUser(int id) {\n    if (id == 1) return "Алина";\n    return null; // пользователь не найден\n}\n\n// Вызывающий код должен помнить о проверке\nString user = findUser(5);\nSystem.out.println(user.toUpperCase()); // BOOM! NullPointerException' },
        { type: 'note', value: 'Optional — это решение этой проблемы, появившееся в Java 8. Это "обёртка" вокруг значения, которая явно говорит: "это значение может отсутствовать". Метод, возвращающий Optional, честно предупреждает о возможном отсутствии результата.' }
      ]
    },
    {
      id: 2,
      title: 'Optional.of, ofNullable, empty — создание',
      type: 'theory',
      content: [
        { type: 'text', value: 'Optional создаётся тремя способами: Optional.of() — когда значение точно есть, Optional.ofNullable() — когда значение может быть null, Optional.empty() — когда значения точно нет.' },
        { type: 'tip', value: 'Думай об Optional как о подарочной коробке. Optional.of() — коробка с подарком (точно что-то есть). Optional.empty() — пустая коробка. Optional.ofNullable() — коробка, которая может быть и с подарком, и пустой.' },
        { type: 'code', language: 'java', value: 'import java.util.Optional;\n\n// Optional.of() — значение точно есть (null вызовет исключение!)\nOptional<String> name = Optional.of("Алина");\nSystem.out.println(name); // Optional[Алина]\n\n// Optional.empty() — значения нет\nOptional<String> empty = Optional.empty();\nSystem.out.println(empty); // Optional.empty\n\n// Optional.ofNullable() — может быть null\nString maybeNull = null;\nOptional<String> optional = Optional.ofNullable(maybeNull);\nSystem.out.println(optional); // Optional.empty' },
        { type: 'heading', value: 'Как правильно использовать в методах' },
        { type: 'code', language: 'java', value: '// ПЛОХО: возвращать null\npublic String findUserById(int id) {\n    if (id == 1) return "Алина";\n    return null;\n}\n\n// ХОРОШО: возвращать Optional\npublic Optional<String> findUserById(int id) {\n    if (id == 1) return Optional.of("Алина");\n    return Optional.empty();\n}\n\n// Вызов становится безопасным:\nOptional<String> user = findUserById(5);\n// Компилятор "заставляет" нас обработать случай отсутствия!' },
        { type: 'warning', value: 'Никогда не делай Optional.of(null) — это вызовет NullPointerException. Если значение может быть null — используй Optional.ofNullable().' }
      ]
    },
    {
      id: 3,
      title: 'isPresent, ifPresent — проверка наличия',
      type: 'theory',
      content: [
        { type: 'text', value: 'После создания Optional нужно уметь проверять, есть ли в нём значение, и работать с ним.' },
        { type: 'heading', value: 'isPresent() — проверить наличие' },
        { type: 'code', language: 'java', value: 'Optional<String> name = Optional.of("Борис");\nOptional<String> empty = Optional.empty();\n\nSystem.out.println(name.isPresent());  // true\nSystem.out.println(empty.isPresent()); // false\n\n// isEmpty() — противоположность isPresent() (Java 11+)\nSystem.out.println(name.isEmpty());  // false\nSystem.out.println(empty.isEmpty()); // true' },
        { type: 'heading', value: 'get() — получить значение' },
        { type: 'code', language: 'java', value: 'Optional<String> name = Optional.of("Виктор");\n\n// get() работает только если значение есть\nif (name.isPresent()) {\n    System.out.println(name.get()); // Виктор\n}\n\n// Без проверки — NoSuchElementException\nOptional<String> empty = Optional.empty();\n// empty.get(); // NoSuchElementException!' },
        { type: 'heading', value: 'ifPresent() — выполнить действие если есть' },
        { type: 'code', language: 'java', value: 'Optional<String> email = Optional.of("user@example.com");\n\n// Действие выполняется только если значение есть\nemail.ifPresent(e -> System.out.println("Письмо отправлено на: " + e));\n// Письмо отправлено на: user@example.com\n\nOptional<String> noEmail = Optional.empty();\nnoEmail.ifPresent(e -> System.out.println("Это не выведется"));\n// Ничего не происходит — безопасно!' },
        { type: 'heading', value: 'ifPresentOrElse() — Java 9+' },
        { type: 'code', language: 'java', value: 'Optional<String> userName = Optional.ofNullable(null);\n\nuserName.ifPresentOrElse(\n    name -> System.out.println("Привет, " + name + "!"),\n    () -> System.out.println("Пользователь не найден")\n);\n// Пользователь не найден' },
        { type: 'tip', value: 'ifPresent() намного элегантнее чем if (optional.isPresent()) { ... }. Используй ifPresent(), когда нужно просто сделать что-то с значением без возврата результата.' }
      ]
    },
    {
      id: 4,
      title: 'orElse, orElseGet, orElseThrow — значения по умолчанию',
      type: 'theory',
      content: [
        { type: 'text', value: 'Эти три метода позволяют указать, что делать если Optional пустой: вернуть значение по умолчанию, вычислить его, или бросить исключение.' },
        { type: 'heading', value: 'orElse() — значение по умолчанию' },
        { type: 'code', language: 'java', value: 'Optional<String> name = Optional.empty();\n\n// Если пусто — вернуть "Гость"\nString result = name.orElse("Гость");\nSystem.out.println(result); // Гость\n\nOptional<String> realName = Optional.of("Алина");\nSystem.out.println(realName.orElse("Гость")); // Алина (есть значение)' },
        { type: 'heading', value: 'orElseGet() — вычислить по умолчанию' },
        { type: 'code', language: 'java', value: '// orElseGet принимает Supplier — функцию без аргументов\nOptional<String> config = Optional.empty();\n\n// Значение по умолчанию вычисляется только если Optional пустой\nString setting = config.orElseGet(() -> {\n    System.out.println("Загружаем настройки из файла...");\n    return "default_value";\n});\nSystem.out.println(setting);\n// Загружаем настройки из файла...\n// default_value' },
        { type: 'heading', value: 'orElse vs orElseGet: важное отличие' },
        { type: 'code', language: 'java', value: '// orElse() ВСЕГДА вычисляет значение по умолчанию\nOptional<String> present = Optional.of("Значение есть");\n\n// Эта строка будет напечатана даже если Optional не пустой!\nString r1 = present.orElse(expensiveOperation());\n\n// orElseGet() вычисляет ТОЛЬКО если Optional пустой — эффективнее!\nString r2 = present.orElseGet(() -> expensiveOperation());\n\n// Используй orElseGet для дорогих операций!' },
        { type: 'heading', value: 'orElseThrow() — исключение если нет значения' },
        { type: 'code', language: 'java', value: 'Optional<String> userId = Optional.empty();\n\n// Простая версия — бросает NoSuchElementException\nString id = Optional.of("123").orElseThrow();\n\n// С кастомным исключением\ntry {\n    String value = userId.orElseThrow(\n        () -> new IllegalArgumentException("ID пользователя обязателен!")\n    );\n} catch (IllegalArgumentException e) {\n    System.out.println("Ошибка: " + e.getMessage());\n    // Ошибка: ID пользователя обязателен!\n}' },
        { type: 'tip', value: 'Правило выбора: orElse — для простых литералов, orElseGet — для вычислений или создания объектов, orElseThrow — когда отсутствие значения — это ошибка.' }
      ]
    },
    {
      id: 5,
      title: 'map и flatMap на Optional',
      type: 'theory',
      content: [
        { type: 'text', value: 'Optional поддерживает map() и flatMap() — так же как Stream, можно трансформировать значение внутри Optional не вынимая его.' },
        { type: 'heading', value: 'map() на Optional' },
        { type: 'code', language: 'java', value: 'Optional<String> name = Optional.of("алина");\n\n// Преобразуем значение если оно есть\nOptional<String> upperName = name.map(String::toUpperCase);\nSystem.out.println(upperName.orElse("нет имени")); // АЛИНА\n\n// Если Optional пустой — map возвращает пустой Optional\nOptional<String> empty = Optional.empty();\nOptional<Integer> len = empty.map(String::length);\nSystem.out.println(len.isPresent()); // false — ничего не упало!' },
        { type: 'heading', value: 'Цепочка map' },
        { type: 'code', language: 'java', value: 'class User {\n    String name;\n    String email;\n    User(String name, String email) { this.name = name; this.email = email; }\n    String getName() { return name; }\n    String getEmail() { return email; }\n}\n\nOptional<User> user = Optional.of(new User("Борис", "boris@mail.ru"));\n\n// Безопасная цепочка\nString domain = user\n    .map(User::getEmail)          // Optional<String> "boris@mail.ru"\n    .map(email -> email.split("@")[1])  // Optional<String> "mail.ru"\n    .orElse("домен не найден");\nSystem.out.println(domain); // mail.ru' },
        { type: 'heading', value: 'flatMap() — когда функция возвращает Optional' },
        { type: 'code', language: 'java', value: 'class Address {\n    Optional<String> city;\n    Address(String city) { this.city = Optional.ofNullable(city); }\n    Optional<String> getCity() { return city; }\n}\n\nclass Person {\n    Optional<Address> address;\n    Person(Address address) { this.address = Optional.ofNullable(address); }\n    Optional<Address> getAddress() { return address; }\n}\n\nPerson person = new Person(new Address("Алматы"));\n\n// map дал бы Optional<Optional<String>> — это плохо\n// flatMap "разворачивает" вложенный Optional\nString city = person.getAddress()\n    .flatMap(Address::getCity)  // не Optional<Optional<String>>, а Optional<String>\n    .orElse("Город неизвестен");\nSystem.out.println(city); // Алматы' },
        { type: 'tip', value: 'Используй flatMap когда функция трансформации сама возвращает Optional. Иначе получишь Optional<Optional<T>>, что очень неудобно.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Optional',
      type: 'practice',
      difficulty: 'medium',
      description: 'Перепиши код с null-проверками, используя Optional, и реши практические задачи.',
      requirements: [
        'Создай метод findCityByUser(String userName), который для "Алина" возвращает Optional.of("Алматы"), для "Борис" — Optional.of("Астана"), для остальных — Optional.empty()',
        'Для "Алина" выведи "Город пользователя: Алматы" через ifPresent',
        'Для "Гость" выведи "Город: Неизвестен" через orElse',
        'Для "Борис" выведи город в верхнем регистре через map + orElse',
        'Для "Виктор" брось IllegalStateException("Пользователь не найден") через orElseThrow'
      ],
      expectedOutput: 'Город пользователя: Алматы\nГород: Неизвестен\nГород Бориса: АСТАНА\nОшибка: Пользователь не найден',
      hint: 'Метод: public static Optional<String> findCityByUser(String name) { ... }. Для карты используй if/else if внутри метода. Для Бориса: findCityByUser("Борис").map(String::toUpperCase).orElse("нет").',
      solution: 'import java.util.Optional;\n\npublic class Main {\n    public static Optional<String> findCityByUser(String name) {\n        if ("Алина".equals(name)) return Optional.of("Алматы");\n        if ("Борис".equals(name)) return Optional.of("Астана");\n        return Optional.empty();\n    }\n\n    public static void main(String[] args) {\n        findCityByUser("Алина")\n            .ifPresent(city -> System.out.println("Город пользователя: " + city));\n\n        String guestCity = findCityByUser("Гость").orElse("Неизвестен");\n        System.out.println("Город: " + guestCity);\n\n        String borisCity = findCityByUser("Борис")\n            .map(String::toUpperCase)\n            .orElse("нет");\n        System.out.println("Город Бориса: " + borisCity);\n\n        try {\n            findCityByUser("Виктор")\n                .orElseThrow(() -> new IllegalStateException("Пользователь не найден"));\n        } catch (IllegalStateException e) {\n            System.out.println("Ошибка: " + e.getMessage());\n        }\n    }\n}',
      explanation: 'Ключевой принцип: Optional заставляет нас явно думать об отсутствии значения. Вместо if (x != null) мы используем цепочки map/flatMap/orElse, что делает код более читаемым и безопасным. Обрати внимание: "Алина".equals(name) безопаснее чем name.equals("Алина") — защищает от NullPointerException если name == null.'
    }
  ]
}
