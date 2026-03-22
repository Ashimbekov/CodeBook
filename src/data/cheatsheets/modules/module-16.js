export default {
  id: 16,
  title: 'Глоссарий терминов',
  description: 'Подробный словарь терминов из всех областей разработки: от основ программирования до карьеры.',
  lessons: [
    {
      id: 1,
      type: 'theory',
      title: 'Основы программирования',
      content: [
        {
          type: 'heading',
          value: 'Переменная (Variable)'
        },
        {
          type: 'text',
          value: 'Именованная область памяти, которая хранит значение определённого типа. Значение может меняться в ходе выполнения программы.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: 'let age = 25;\nconst name = "Alice";\nvar score = 100;'
        },
        {
          type: 'heading',
          value: 'Функция (Function)'
        },
        {
          type: 'text',
          value: 'Именованный блок кода, выполняющий определённую задачу. Функцию можно вызывать многократно с разными аргументами.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: 'function greet(name) {\n  return "Привет, " + name;\n}\ngreet("Алиса"); // "Привет, Алиса"'
        },
        {
          type: 'heading',
          value: 'Класс (Class)'
        },
        {
          type: 'text',
          value: 'Шаблон (blueprint) для создания объектов. Описывает свойства (поля) и поведение (методы) будущих объектов.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: 'class Animal {\n  constructor(name) {\n    this.name = name;\n  }\n  speak() {\n    return this.name + " издаёт звук";\n  }\n}'
        },
        {
          type: 'heading',
          value: 'Объект (Object)'
        },
        {
          type: 'text',
          value: 'Экземпляр класса. Конкретная сущность с набором свойств и методов. Объект создаётся по шаблону класса.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: 'const cat = new Animal("Мурзик");\ncat.speak(); // "Мурзик издаёт звук"'
        },
        {
          type: 'heading',
          value: 'Массив (Array)'
        },
        {
          type: 'text',
          value: 'Упорядоченная коллекция элементов, доступных по индексу (начиная с 0). Элементы могут быть одного или разных типов.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: 'const nums = [1, 2, 3, 4, 5];\nnums[0]; // 1\nnums.length; // 5'
        },
        {
          type: 'heading',
          value: 'Цикл (Loop)'
        },
        {
          type: 'text',
          value: 'Конструкция, повторяющая блок кода до тех пор, пока выполняется условие. Виды: for, while, do-while, for-of, for-in.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: 'for (let i = 0; i < 5; i++) {\n  console.log(i);\n}\n// 0 1 2 3 4'
        },
        {
          type: 'heading',
          value: 'Условие (Condition / if-else)'
        },
        {
          type: 'text',
          value: 'Конструкция выбора: выполняет разный код в зависимости от того, истинно или ложно логическое выражение.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: 'if (age >= 18) {\n  console.log("Взрослый");\n} else {\n  console.log("Несовершеннолетний");\n}'
        },
        {
          type: 'heading',
          value: 'Рекурсия (Recursion)'
        },
        {
          type: 'text',
          value: 'Техника, при которой функция вызывает саму себя. Обязательно должно быть базовое условие выхода, иначе произойдёт переполнение стека.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: 'function factorial(n) {\n  if (n <= 1) return 1; // базовый случай\n  return n * factorial(n - 1);\n}\nfactorial(5); // 120'
        },
        {
          type: 'heading',
          value: 'Компилятор (Compiler)'
        },
        {
          type: 'text',
          value: 'Программа, переводящая исходный код целиком в машинный код (или байт-код) до запуска. Примеры: gcc (C), javac (Java).'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Компиляция Java\njavac Hello.java  # создаёт Hello.class\njava Hello        # запускает байт-код'
        },
        {
          type: 'heading',
          value: 'Интерпретатор (Interpreter)'
        },
        {
          type: 'text',
          value: 'Программа, которая читает и выполняет исходный код строка за строкой во время работы программы, без предварительной компиляции. Примеры: Python, Ruby, JavaScript (Node.js).'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Интерпретация Python\npython3 script.py  # читает и выполняет построчно'
        },
        {
          type: 'heading',
          value: 'Тип данных (Data Type)'
        },
        {
          type: 'text',
          value: 'Классификация значения, определяющая, что это такое и какие операции можно с ним выполнять. Примитивы: int, float, boolean, string. Составные: массив, объект.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: 'typeof 42;         // "number"\ntypeof "hello";    // "string"\ntypeof true;       // "boolean"\ntypeof {};         // "object"\ntypeof undefined;  // "undefined"'
        },
        {
          type: 'heading',
          value: 'Исключение (Exception)'
        },
        {
          type: 'text',
          value: 'Аномальное событие, нарушающее нормальный ход выполнения программы. Можно перехватывать и обрабатывать через try/catch.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: 'try {\n  JSON.parse("невалидный json");\n} catch (e) {\n  console.log("Ошибка:", e.message);\n}'
        },
        {
          type: 'heading',
          value: 'Область видимости (Scope)'
        },
        {
          type: 'text',
          value: 'Контекст, в котором переменная доступна. Глобальная область — доступна везде. Локальная — только внутри блока или функции.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: 'let global = "везде";\nfunction fn() {\n  let local = "только здесь";\n  console.log(global); // OK\n}\n// console.log(local); // ReferenceError!'
        },
        {
          type: 'heading',
          value: 'Итерация (Iteration)'
        },
        {
          type: 'text',
          value: 'Один проход (повторение) тела цикла. Также: процесс последовательного перебора элементов коллекции.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: 'const arr = ["a", "b", "c"];\nfor (const item of arr) {\n  console.log(item); // каждый вызов — одна итерация\n}'
        },
        {
          type: 'heading',
          value: 'Синтаксис (Syntax)'
        },
        {
          type: 'text',
          value: 'Набор правил, по которым должен быть написан код на языке программирования. Нарушение синтаксиса приводит к синтаксической ошибке.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Правильный синтаксис:\nconst x = 5;\n// Неправильный синтаксис:\n// const x = ; // SyntaxError'
        }
      ]
    },
    {
      id: 2,
      type: 'theory',
      title: 'ООП — Объектно-ориентированное программирование',
      content: [
        {
          type: 'heading',
          value: 'Инкапсуляция (Encapsulation)'
        },
        {
          type: 'text',
          value: 'Принцип ООП: скрытие внутренней реализации объекта. Данные и методы объединяются внутри класса, доступ к внутренним деталям ограничивается через модификаторы (private, protected).'
        },
        {
          type: 'code',
          language: 'java',
          value: 'class BankAccount {\n  private double balance; // скрыто от внешнего мира\n  public void deposit(double amount) {\n    if (amount > 0) balance += amount;\n  }\n  public double getBalance() { return balance; }\n}'
        },
        {
          type: 'heading',
          value: 'Наследование (Inheritance)'
        },
        {
          type: 'text',
          value: 'Механизм, позволяющий одному классу (дочернему) получать свойства и методы другого (родительского). Обеспечивает повторное использование кода.'
        },
        {
          type: 'code',
          language: 'java',
          value: 'class Animal {\n  void breathe() { System.out.println("Дышу"); }\n}\nclass Dog extends Animal {\n  void bark() { System.out.println("Гав!"); }\n}\n// Dog наследует breathe() от Animal'
        },
        {
          type: 'heading',
          value: 'Полиморфизм (Polymorphism)'
        },
        {
          type: 'text',
          value: 'Способность объектов разных классов реагировать на одни и те же вызовы по-разному. Один интерфейс — множество реализаций.'
        },
        {
          type: 'code',
          language: 'java',
          value: 'class Shape {\n  void draw() { System.out.println("Фигура"); }\n}\nclass Circle extends Shape {\n  void draw() { System.out.println("Круг"); }\n}\nShape s = new Circle();\ns.draw(); // "Круг" — полиморфизм!'
        },
        {
          type: 'heading',
          value: 'Абстракция (Abstraction)'
        },
        {
          type: 'text',
          value: 'Выделение существенных характеристик объекта и скрытие несущественных деталей. Работаете с сущностью через упрощённый интерфейс, не зная о внутренней реализации.'
        },
        {
          type: 'code',
          language: 'java',
          value: 'abstract class Vehicle {\n  abstract void move(); // что делает — понятно\n  // как именно — скрыто до конкретного класса\n}\nclass Car extends Vehicle {\n  void move() { System.out.println("Еду на колёсах"); }\n}'
        },
        {
          type: 'heading',
          value: 'Интерфейс (Interface)'
        },
        {
          type: 'text',
          value: 'Контракт (набор сигнатур методов), который класс обязуется реализовать. Определяет "что делать", но не "как делать". Позволяет достигать полиморфизма без наследования.'
        },
        {
          type: 'code',
          language: 'java',
          value: 'interface Drawable {\n  void draw(); // контракт\n}\nclass Triangle implements Drawable {\n  public void draw() { System.out.println("Треугольник"); }\n}'
        },
        {
          type: 'heading',
          value: 'Паттерн (Design Pattern)'
        },
        {
          type: 'text',
          value: 'Типовое, проверенное временем решение часто встречающейся задачи проектирования. Не готовый код, а описание подхода. Примеры: Singleton, Factory, Observer, Strategy.'
        },
        {
          type: 'code',
          language: 'java',
          value: '// Паттерн Singleton\nclass Config {\n  private static Config instance;\n  private Config() {}\n  public static Config getInstance() {\n    if (instance == null) instance = new Config();\n    return instance;\n  }\n}'
        },
        {
          type: 'heading',
          value: 'SOLID'
        },
        {
          type: 'text',
          value: 'Пять принципов проектирования ООП. S — Single Responsibility (одна ответственность). O — Open/Closed (открыт для расширения, закрыт для изменения). L — Liskov Substitution. I — Interface Segregation. D — Dependency Inversion.'
        },
        {
          type: 'code',
          language: 'java',
          value: '// S: каждый класс — одна задача\nclass EmailSender { void send(String msg) {} }\nclass ReportGenerator { String generate() { return ""; } }\n// Не смешиваем отправку email и генерацию отчётов!'
        },
        {
          type: 'heading',
          value: 'DRY (Don\'t Repeat Yourself)'
        },
        {
          type: 'text',
          value: 'Принцип: каждая часть знания должна иметь единственное представление в системе. Дублирование кода — источник ошибок: если изменить надо в одном месте, забываешь изменить в другом.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Плохо (дублирование):\nconst taxA = price * 0.2;\nconst taxB = price * 0.2;\n// Хорошо (DRY):\nconst TAX_RATE = 0.2;\nconst tax = price * TAX_RATE;'
        },
        {
          type: 'heading',
          value: 'KISS (Keep It Simple, Stupid)'
        },
        {
          type: 'text',
          value: 'Принцип: простота — главный критерий хорошего кода. Не усложняй без необходимости. Простой код легче читать, поддерживать и отлаживать.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Сложно (нарушение KISS):\nconst isAdult = (age) => !(age < 18);\n// Просто (KISS):\nconst isAdult = (age) => age >= 18;'
        },
        {
          type: 'heading',
          value: 'YAGNI (You Aren\'t Gonna Need It)'
        },
        {
          type: 'text',
          value: 'Принцип: не реализуй то, что не нужно прямо сейчас. Добавляй функциональность только тогда, когда она действительно требуется, а не "на всякий случай".'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Нарушение YAGNI: пишем поддержку тем, которую никто не просил\n// Правильно: реализуй только то, что требует текущая задача\n// "Простой код сейчас лучше, чем универсальный код никогда"'
        },
        {
          type: 'heading',
          value: 'Конструктор (Constructor)'
        },
        {
          type: 'text',
          value: 'Специальный метод класса, вызываемый при создании объекта. Инициализирует поля объекта начальными значениями.'
        },
        {
          type: 'code',
          language: 'java',
          value: 'class Person {\n  String name;\n  int age;\n  Person(String name, int age) { // конструктор\n    this.name = name;\n    this.age = age;\n  }\n}'
        },
        {
          type: 'heading',
          value: 'Перегрузка (Overloading)'
        },
        {
          type: 'text',
          value: 'Возможность иметь несколько методов с одинаковым именем, но разными параметрами. Компилятор выбирает нужный метод по сигнатуре.'
        },
        {
          type: 'code',
          language: 'java',
          value: 'class Calculator {\n  int add(int a, int b) { return a + b; }\n  double add(double a, double b) { return a + b; }\n  int add(int a, int b, int c) { return a + b + c; }\n}'
        }
      ]
    },
    {
      id: 3,
      type: 'theory',
      title: 'Веб-разработка',
      content: [
        {
          type: 'heading',
          value: 'HTTP (HyperText Transfer Protocol)'
        },
        {
          type: 'text',
          value: 'Протокол передачи данных в вебе. Клиент отправляет запрос (request), сервер возвращает ответ (response). Работает по схеме "запрос — ответ" без сохранения состояния (stateless).'
        },
        {
          type: 'code',
          language: 'bash',
          value: 'GET /api/users HTTP/1.1\nHost: example.com\n\nHTTP/1.1 200 OK\nContent-Type: application/json'
        },
        {
          type: 'heading',
          value: 'HTTPS (HTTP Secure)'
        },
        {
          type: 'text',
          value: 'HTTP с шифрованием через TLS/SSL. Защищает данные от перехвата. Обязателен для сайтов, работающих с персональными данными и платежами. Порт по умолчанию: 443.'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# HTTP — порт 80, данные открыты\n# HTTPS — порт 443, данные зашифрованы\ncurl https://api.example.com/data'
        },
        {
          type: 'heading',
          value: 'REST (Representational State Transfer)'
        },
        {
          type: 'text',
          value: 'Архитектурный стиль для API. Принципы: клиент-сервер, stateless (без состояния), единый интерфейс, ресурсы идентифицируются URL. Методы: GET, POST, PUT, PATCH, DELETE.'
        },
        {
          type: 'code',
          language: 'bash',
          value: 'GET    /users       # список пользователей\nGET    /users/42    # один пользователь\nPOST   /users       # создать\nPUT    /users/42    # обновить полностью\nDELETE /users/42    # удалить'
        },
        {
          type: 'heading',
          value: 'API (Application Programming Interface)'
        },
        {
          type: 'text',
          value: 'Интерфейс взаимодействия между программами. Web API — набор HTTP-эндпоинтов, через которые приложения общаются друг с другом.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: 'const response = await fetch("https://api.example.com/weather");\nconst data = await response.json();\nconsole.log(data.temperature); // 22'
        },
        {
          type: 'heading',
          value: 'JSON (JavaScript Object Notation)'
        },
        {
          type: 'text',
          value: 'Текстовый формат обмена данными. Легко читается человеком и обрабатывается машиной. Поддерживает: строки, числа, булевы значения, null, массивы, объекты.'
        },
        {
          type: 'code',
          language: 'json',
          value: '{\n  "name": "Алиса",\n  "age": 28,\n  "skills": ["JS", "Python"],\n  "active": true\n}'
        },
        {
          type: 'heading',
          value: 'XML (eXtensible Markup Language)'
        },
        {
          type: 'text',
          value: 'Язык разметки для хранения и передачи структурированных данных. Многословнее JSON, но широко применяется в корпоративных системах, конфигурациях и SOAP-сервисах.'
        },
        {
          type: 'code',
          language: 'xml',
          value: '<user>\n  <name>Алиса</name>\n  <age>28</age>\n  <skill>JS</skill>\n  <skill>Python</skill>\n</user>'
        },
        {
          type: 'heading',
          value: 'CORS (Cross-Origin Resource Sharing)'
        },
        {
          type: 'text',
          value: 'Механизм безопасности браузера, запрещающий запросы с одного домена к другому по умолчанию. Сервер разрешает доступ через заголовок Access-Control-Allow-Origin.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Сервер разрешает все домены:\nres.setHeader("Access-Control-Allow-Origin", "*");\n// Или конкретный домен:\nres.setHeader("Access-Control-Allow-Origin", "https://myapp.com");'
        },
        {
          type: 'heading',
          value: 'Cookie'
        },
        {
          type: 'text',
          value: 'Небольшие данные, которые сервер сохраняет в браузере клиента. Используются для сессий, аутентификации, аналитики. Отправляются с каждым запросом к домену автоматически.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Установка cookie на сервере (Express):\nres.cookie("token", "abc123", { httpOnly: true, maxAge: 86400000 });\n// Чтение cookie в браузере:\ndocument.cookie; // "token=abc123"'
        },
        {
          type: 'heading',
          value: 'Session (Сессия)'
        },
        {
          type: 'text',
          value: 'Механизм хранения состояния пользователя на сервере между запросами. Идентификатор сессии хранится в cookie. Сессия живёт определённое время, потом истекает.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Express + express-session:\nreq.session.userId = user.id;\n// При следующем запросе:\nconsole.log(req.session.userId); // тот же пользователь'
        },
        {
          type: 'heading',
          value: 'JWT (JSON Web Token)'
        },
        {
          type: 'text',
          value: 'Стандарт токенов для передачи данных между клиентом и сервером. Состоит из трёх частей: header.payload.signature. Сервер не хранит состояние — проверяет подпись.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Структура JWT:\n// eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjF9.SIGNATURE\n\nconst token = jwt.sign({ userId: 1 }, "secret", { expiresIn: "1d" });\nconst decoded = jwt.verify(token, "secret");\nconsole.log(decoded.userId); // 1'
        },
        {
          type: 'heading',
          value: 'WebSocket'
        },
        {
          type: 'text',
          value: 'Протокол для двустороннего постоянного соединения между клиентом и сервером. В отличие от HTTP, сервер может отправлять данные клиенту в любой момент. Используется в чатах, играх, live-дашбордах.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: 'const ws = new WebSocket("wss://chat.example.com");\nws.onmessage = (e) => console.log("Получено:", e.data);\nws.send("Привет, сервер!");'
        },
        {
          type: 'heading',
          value: 'SSR (Server-Side Rendering)'
        },
        {
          type: 'text',
          value: 'Рендеринг HTML на сервере перед отправкой клиенту. Страница готова сразу — хорошо для SEO и первого отображения. Примеры: Next.js (React), Nuxt.js (Vue).'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Next.js SSR:\nexport async function getServerSideProps() {\n  const data = await fetchData();\n  return { props: { data } }; // HTML генерируется на сервере\n}'
        },
        {
          type: 'heading',
          value: 'CSR (Client-Side Rendering)'
        },
        {
          type: 'text',
          value: 'Рендеринг интерфейса в браузере с помощью JavaScript. Сервер возвращает пустой HTML + JS-бандл, который строит интерфейс на стороне клиента. Применяется в SPA.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// В браузере приходит минимальный HTML:\n// <div id="root"></div>\n// React/Vue строит интерфейс сам:\nReactDOM.render(<App />, document.getElementById("root"));'
        },
        {
          type: 'heading',
          value: 'SPA (Single Page Application)'
        },
        {
          type: 'text',
          value: 'Веб-приложение, загружающееся один раз. Навигация происходит без перезагрузки страницы — JS динамически обновляет контент. Примеры: Gmail, Google Maps, приложения на React/Vue/Angular.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Роутинг в SPA (React Router):\n<Routes>\n  <Route path="/" element={<Home />} />\n  <Route path="/about" element={<About />} />\n</Routes>\n// Страница не перезагружается — только контент меняется'
        },
        {
          type: 'heading',
          value: 'CDN (Content Delivery Network)'
        },
        {
          type: 'text',
          value: 'Сеть серверов, распределённых географически, для быстрой доставки контента. Файл отдаётся с ближайшего к пользователю сервера, уменьшая задержку.'
        },
        {
          type: 'code',
          language: 'html',
          value: '<!-- Подключение React через CDN -->\n<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>\n<!-- Файл грузится с сервера рядом с пользователем -->'
        }
      ]
    },
    {
      id: 4,
      type: 'theory',
      title: 'Базы данных',
      content: [
        {
          type: 'heading',
          value: 'SQL (Structured Query Language)'
        },
        {
          type: 'text',
          value: 'Язык структурированных запросов для работы с реляционными базами данных. Позволяет создавать, читать, обновлять и удалять данные. Примеры СУБД: PostgreSQL, MySQL, SQLite.'
        },
        {
          type: 'code',
          language: 'sql',
          value: 'SELECT name, email\nFROM users\nWHERE age > 18\nORDER BY name ASC\nLIMIT 10;'
        },
        {
          type: 'heading',
          value: 'NoSQL'
        },
        {
          type: 'text',
          value: 'Базы данных без фиксированной схемы. Виды: документные (MongoDB), ключ-значение (Redis), колоночные (Cassandra), графовые (Neo4j). Хорошо масштабируются горизонтально.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// MongoDB: документ вместо строки\ndb.users.insertOne({\n  name: "Алиса",\n  tags: ["admin", "editor"],\n  address: { city: "Алматы" }\n});'
        },
        {
          type: 'heading',
          value: 'CRUD'
        },
        {
          type: 'text',
          value: 'Четыре базовые операции с данными: Create (создать), Read (прочитать), Update (обновить), Delete (удалить). Любой API или интерфейс работы с данными строится на этих операциях.'
        },
        {
          type: 'code',
          language: 'sql',
          value: 'INSERT INTO users (name) VALUES ("Боб");  -- Create\nSELECT * FROM users WHERE id = 1;          -- Read\nUPDATE users SET name = "Роберт" WHERE id = 1; -- Update\nDELETE FROM users WHERE id = 1;            -- Delete'
        },
        {
          type: 'heading',
          value: 'ORM (Object-Relational Mapping)'
        },
        {
          type: 'text',
          value: 'Технология, позволяющая работать с базой данных через объекты языка программирования. Скрывает SQL-запросы. Примеры: Hibernate (Java), SQLAlchemy (Python), Prisma (Node.js).'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Prisma ORM вместо сырого SQL:\nconst user = await prisma.user.findUnique({ where: { id: 1 } });\nconst users = await prisma.user.findMany({ where: { age: { gt: 18 } } });'
        },
        {
          type: 'heading',
          value: 'Миграция (Migration)'
        },
        {
          type: 'text',
          value: 'Скрипт, изменяющий структуру базы данных (добавление таблиц, колонок, индексов). Миграции применяются последовательно и версионируются вместе с кодом.'
        },
        {
          type: 'code',
          language: 'sql',
          value: '-- Миграция: добавляем колонку email\nALTER TABLE users ADD COLUMN email VARCHAR(255);\n-- Откат (rollback):\nALTER TABLE users DROP COLUMN email;'
        },
        {
          type: 'heading',
          value: 'Индекс (Index)'
        },
        {
          type: 'text',
          value: 'Структура данных, ускоряющая поиск в таблице. Работает как оглавление книги. Ускоряет SELECT, но замедляет INSERT/UPDATE/DELETE из-за обновления индекса.'
        },
        {
          type: 'code',
          language: 'sql',
          value: '-- Создать индекс по колонке email:\nCREATE INDEX idx_users_email ON users(email);\n-- Теперь поиск по email — быстро!\nSELECT * FROM users WHERE email = "alice@example.com";'
        },
        {
          type: 'heading',
          value: 'Транзакция (Transaction)'
        },
        {
          type: 'text',
          value: 'Группа операций, выполняемых как одно атомарное действие: либо все успешны (commit), либо все отменяются (rollback). Гарантирует целостность данных.'
        },
        {
          type: 'code',
          language: 'sql',
          value: 'BEGIN;\n  UPDATE accounts SET balance = balance - 100 WHERE id = 1;\n  UPDATE accounts SET balance = balance + 100 WHERE id = 2;\nCOMMIT; -- оба обновления или ни одного'
        },
        {
          type: 'heading',
          value: 'ACID'
        },
        {
          type: 'text',
          value: 'Четыре свойства транзакций. A — Atomicity (атомарность). C — Consistency (согласованность). I — Isolation (изолированность). D — Durability (долговечность). Гарантируют надёжность операций.'
        },
        {
          type: 'code',
          language: 'sql',
          value: '-- Atomicity: всё или ничего\n-- Consistency: данные остаются корректными\n-- Isolation: параллельные транзакции не мешают друг другу\n-- Durability: закомиченные данные сохраняются навсегда'
        },
        {
          type: 'heading',
          value: 'Нормализация (Normalization)'
        },
        {
          type: 'text',
          value: 'Процесс организации данных в базе для уменьшения избыточности и улучшения целостности. Формы нормализации: 1NF, 2NF, 3NF, BCNF. Принцип: данные не должны дублироваться.'
        },
        {
          type: 'code',
          language: 'sql',
          value: '-- Плохо (дублирование):\n-- orders: id, customer_name, customer_email, product\n-- Хорошо (нормализовано):\n-- customers: id, name, email\n-- orders: id, customer_id, product'
        },
        {
          type: 'heading',
          value: 'Шардирование (Sharding)'
        },
        {
          type: 'text',
          value: 'Горизонтальное разбиение большой базы данных на несколько меньших частей (шардов), расположенных на разных серверах. Позволяет масштабировать систему при огромных объёмах данных.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Логика шардирования по ID пользователя:\nconst shardId = userId % 4; // 4 шарда\nconst db = shards[shardId]; // выбираем нужный сервер\ndb.find({ userId });'
        },
        {
          type: 'heading',
          value: 'Репликация (Replication)'
        },
        {
          type: 'text',
          value: 'Копирование данных с одного сервера базы данных (master/primary) на один или несколько других (slave/replica). Обеспечивает отказоустойчивость и возможность балансировки нагрузки на чтение.'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Primary (master) — принимает запись\n# Replica (slave) — копирует данные, обслуживает чтение\n# Если primary упал — replica становится новым primary'
        }
      ]
    },
    {
      id: 5,
      type: 'theory',
      title: 'DevOps',
      content: [
        {
          type: 'heading',
          value: 'CI/CD (Continuous Integration / Continuous Delivery)'
        },
        {
          type: 'text',
          value: 'Практика автоматизации сборки, тестирования и доставки кода. CI — автоматически запускает тесты при каждом коммите. CD — автоматически деплоит на сервер при успешном прохождении тестов.'
        },
        {
          type: 'code',
          language: 'yaml',
          value: '# GitHub Actions CI/CD\non: [push]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - run: npm test\n  deploy:\n    needs: test\n    steps:\n      - run: npm run deploy'
        },
        {
          type: 'heading',
          value: 'Docker'
        },
        {
          type: 'text',
          value: 'Платформа для контейнеризации приложений. Упаковывает код со всеми зависимостями в контейнер, который работает одинаково на любой машине. "Работает у меня" → "Работает везде".'
        },
        {
          type: 'code',
          language: 'bash',
          value: 'docker build -t myapp .\ndocker run -p 3000:3000 myapp\ndocker ps  # список запущенных контейнеров'
        },
        {
          type: 'heading',
          value: 'Контейнер (Container)'
        },
        {
          type: 'text',
          value: 'Изолированная среда выполнения приложения. В отличие от виртуальной машины, контейнеры используют общее ядро ОС хоста, что делает их лёгкими и быстрыми.'
        },
        {
          type: 'code',
          language: 'bash',
          value: 'docker run -d --name web nginx   # запуск контейнера\ndocker exec -it web bash         # вход внутрь\ndocker stop web                  # остановка'
        },
        {
          type: 'heading',
          value: 'Образ (Image)'
        },
        {
          type: 'text',
          value: 'Неизменяемый снимок файловой системы и настроек приложения. Шаблон, из которого запускаются контейнеры. Хранится в реестрах (Docker Hub, GitHub Container Registry).'
        },
        {
          type: 'code',
          language: 'dockerfile',
          value: 'FROM node:18-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nCMD ["node", "server.js"]'
        },
        {
          type: 'heading',
          value: 'Kubernetes (K8s)'
        },
        {
          type: 'text',
          value: 'Платформа оркестрации контейнеров. Управляет развёртыванием, масштабированием и восстановлением контейнеров в кластере. Автоматически перезапускает упавшие контейнеры.'
        },
        {
          type: 'code',
          language: 'bash',
          value: 'kubectl get pods             # список подов\nkubectl apply -f deploy.yaml # применить конфигурацию\nkubectl scale deployment app --replicas=3'
        },
        {
          type: 'heading',
          value: 'Pod'
        },
        {
          type: 'text',
          value: 'Минимальная единица развёртывания в Kubernetes. Может содержать один или несколько контейнеров, которые разделяют сеть и хранилище.'
        },
        {
          type: 'code',
          language: 'yaml',
          value: 'apiVersion: v1\nkind: Pod\nmetadata:\n  name: my-app\nspec:\n  containers:\n  - name: app\n    image: myapp:latest\n    ports:\n    - containerPort: 3000'
        },
        {
          type: 'heading',
          value: 'Деплой (Deploy)'
        },
        {
          type: 'text',
          value: 'Процесс развёртывания приложения на сервере или в облаке. Деплой делает новую версию приложения доступной для пользователей. Стратегии: rolling update, blue-green, canary.'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Blue-green деплой:\n# Blue — текущая версия (работает)\n# Green — новая версия (деплоится)\n# После проверки: переключаем трафик с blue на green'
        },
        {
          type: 'heading',
          value: 'Пайплайн (Pipeline)'
        },
        {
          type: 'text',
          value: 'Последовательность автоматизированных шагов обработки кода: от коммита до деплоя. Включает: lint → тесты → сборку → публикацию образа → деплой.'
        },
        {
          type: 'code',
          language: 'yaml',
          value: '# Типичный CI/CD пайплайн:\n# 1. Lint (проверка стиля кода)\n# 2. Unit tests\n# 3. Build (сборка образа)\n# 4. Push (загрузка в registry)\n# 5. Deploy (деплой на сервер)'
        },
        {
          type: 'heading',
          value: 'Артефакт (Artifact)'
        },
        {
          type: 'text',
          value: 'Результат сборки: скомпилированный бинарник, JAR-файл, Docker-образ, npm-пакет. Артефакт хранится в хранилище и используется для деплоя.'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Артефакты сборки:\nmvn package      # создаёт app.jar\nnpm run build    # создаёт dist/\ndocker build .   # создаёт Docker image'
        },
        {
          type: 'heading',
          value: 'Registry (Реестр)'
        },
        {
          type: 'text',
          value: 'Хранилище Docker-образов или пакетов. Docker Hub — публичный реестр образов. GitHub Container Registry — корпоративный. npm Registry — для JavaScript-пакетов.'
        },
        {
          type: 'code',
          language: 'bash',
          value: 'docker push myname/myapp:latest  # загрузить образ\ndocker pull nginx:alpine          # скачать образ\nnpm publish                       # опубликовать пакет'
        },
        {
          type: 'heading',
          value: 'Мониторинг (Monitoring)'
        },
        {
          type: 'text',
          value: 'Наблюдение за состоянием приложения и инфраструктуры в реальном времени. Метрики: CPU, память, latency, error rate. Инструменты: Prometheus, Grafana, Datadog.'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Prometheus scrapes metrics:\n# GET /metrics\n# cpu_usage{app="web"} 0.42\n# request_count_total 15234\n# error_rate 0.002'
        }
      ]
    },
    {
      id: 6,
      type: 'theory',
      title: 'Алгоритмы и структуры данных',
      content: [
        {
          type: 'heading',
          value: 'Big O нотация'
        },
        {
          type: 'text',
          value: 'Математическая нотация для описания сложности алгоритма в худшем случае. Показывает, как время выполнения или потребление памяти растёт с увеличением входных данных n.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// O(1) — константа: доступ к элементу массива\narr[0]\n// O(n) — линейная: обход массива\nfor (const x of arr)\n// O(n²) — квадратичная: вложенный цикл\nfor (i) for (j)\n// O(log n) — логарифмическая: бинарный поиск'
        },
        {
          type: 'heading',
          value: 'Сложность алгоритма'
        },
        {
          type: 'text',
          value: 'Временная сложность — сколько операций выполняет алгоритм. Пространственная сложность — сколько памяти использует. Оба параметра выражаются через Big O.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Временная O(n), пространственная O(1):\nfunction sum(arr) {\n  let s = 0;\n  for (const x of arr) s += x;\n  return s;\n}'
        },
        {
          type: 'heading',
          value: 'Хеш-таблица (Hash Table)'
        },
        {
          type: 'text',
          value: 'Структура данных: хранит пары ключ-значение. Хеш-функция преобразует ключ в индекс массива. Операции get/set/delete — O(1) в среднем случае. В JS: Object, Map.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: 'const map = new Map();\nmap.set("alice", 25);    // O(1)\nmap.get("alice");        // 25, O(1)\nmap.has("alice");        // true, O(1)\nmap.delete("alice");     // O(1)'
        },
        {
          type: 'heading',
          value: 'Дерево (Tree)'
        },
        {
          type: 'text',
          value: 'Иерархическая структура данных: узлы (nodes) соединены рёбрами (edges). Есть корень (root), листья (leaves). Бинарное дерево — у каждого узла не более двух потомков.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: 'class TreeNode {\n  constructor(val) {\n    this.val = val;\n    this.left = null;\n    this.right = null;\n  }\n}\n// Дерево: 4 -> {2, 6} -> {1,3,5,7}'
        },
        {
          type: 'heading',
          value: 'Граф (Graph)'
        },
        {
          type: 'text',
          value: 'Структура данных: набор вершин (vertices) и рёбер (edges) между ними. Может быть направленным (directed) и ненаправленным. Применяется для моделирования сетей, карт, зависимостей.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Граф через список смежности:\nconst graph = {\n  A: ["B", "C"],\n  B: ["A", "D"],\n  C: ["A"],\n  D: ["B"]\n};'
        },
        {
          type: 'heading',
          value: 'BFS (Breadth-First Search)'
        },
        {
          type: 'text',
          value: 'Обход графа/дерева в ширину. Сначала посещает всех соседей текущего уровня, потом идёт глубже. Использует очередь (queue). Находит кратчайший путь в невзвешенном графе.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: 'function bfs(graph, start) {\n  const queue = [start], visited = new Set([start]);\n  while (queue.length) {\n    const node = queue.shift();\n    for (const n of graph[node]) {\n      if (!visited.has(n)) { visited.add(n); queue.push(n); }\n    }\n  }\n}'
        },
        {
          type: 'heading',
          value: 'DFS (Depth-First Search)'
        },
        {
          type: 'text',
          value: 'Обход графа/дерева в глубину. Идёт как можно глубже по одному пути, потом возвращается (backtrack). Использует стек или рекурсию. Применяется для поиска циклов, топологической сортировки.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: 'function dfs(graph, node, visited = new Set()) {\n  visited.add(node);\n  for (const n of graph[node]) {\n    if (!visited.has(n)) dfs(graph, n, visited);\n  }\n}'
        },
        {
          type: 'heading',
          value: 'DP (Dynamic Programming — Динамическое программирование)'
        },
        {
          type: 'text',
          value: 'Метод решения задач путём разбиения на подзадачи и сохранения их результатов (мемоизация). Избегает повторных вычислений. Применяется: Fibonacci, Knapsack, LCS.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: 'function fib(n, memo = {}) {\n  if (n <= 1) return n;\n  if (memo[n]) return memo[n];  // используем кеш\n  memo[n] = fib(n-1, memo) + fib(n-2, memo);\n  return memo[n];\n}'
        },
        {
          type: 'heading',
          value: 'Жадный алгоритм (Greedy Algorithm)'
        },
        {
          type: 'text',
          value: 'Стратегия: на каждом шаге выбирается локально оптимальное решение, без учёта будущих последствий. Работает для задач, где жадный выбор ведёт к глобальному оптимуму (алгоритм Дейкстры, задача о сдаче).'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Сдача монетами: жадный алгоритм\nfunction change(amount, coins) {\n  coins.sort((a, b) => b - a); // от большей к меньшей\n  const result = [];\n  for (const coin of coins) {\n    while (amount >= coin) { result.push(coin); amount -= coin; }\n  }\n  return result;\n}'
        },
        {
          type: 'heading',
          value: 'NP-полнота (NP-completeness)'
        },
        {
          type: 'text',
          value: 'Класс задач, для которых не известно полиномиального алгоритма решения. Проверить решение легко (P), но найти — трудно. Примеры: задача коммивояжёра, задача о рюкзаке (вариант), раскраска графа.'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# NP задачи решаются приближёнными алгоритмами\n# или эвристиками для практических случаев\n# Точное решение требует экспоненциального времени O(2^n)'
        }
      ]
    },
    {
      id: 7,
      type: 'theory',
      title: 'Фронтенд',
      content: [
        {
          type: 'heading',
          value: 'DOM (Document Object Model)'
        },
        {
          type: 'text',
          value: 'Программный интерфейс HTML-документа. Браузер строит дерево объектов из HTML, которым можно управлять через JavaScript: добавлять, удалять, изменять элементы.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: 'document.getElementById("btn").textContent = "Нажми";\ndocument.querySelector(".card").classList.add("active");\ndocument.createElement("div");'
        },
        {
          type: 'heading',
          value: 'Virtual DOM'
        },
        {
          type: 'text',
          value: 'Лёгкая копия реального DOM в памяти (используется React, Vue). При изменении состояния: строится новый Virtual DOM, сравнивается со старым (diffing), и в реальный DOM вносятся только изменения.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// React управляет Virtual DOM:\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(c => c+1)}>{count}</button>;\n  // React обновляет только текст кнопки, не весь DOM'
        },
        {
          type: 'heading',
          value: 'Компонент (Component)'
        },
        {
          type: 'text',
          value: 'Самостоятельная переиспользуемая часть интерфейса с собственной логикой и отображением. Основная строительная единица React, Vue, Angular.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: 'function Button({ label, onClick }) {\n  return (\n    <button className="btn" onClick={onClick}>\n      {label}\n    </button>\n  );\n}'
        },
        {
          type: 'heading',
          value: 'Пропсы (Props)'
        },
        {
          type: 'text',
          value: 'Параметры, передаваемые в компонент снаружи. Данные текут от родительского компонента к дочернему (однонаправленный поток). Props только для чтения — их не меняют внутри компонента.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Родитель передаёт props:\n<UserCard name="Алиса" age={28} isAdmin={true} />\n// Дочерний компонент получает:\nfunction UserCard({ name, age, isAdmin }) { ... }'
        },
        {
          type: 'heading',
          value: 'Стейт (State)'
        },
        {
          type: 'text',
          value: 'Внутреннее изменяемое состояние компонента. При изменении стейта компонент перерисовывается. В React — через useState, в Vue — через ref/reactive.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: 'function Toggle() {\n  const [isOn, setIsOn] = useState(false);\n  return (\n    <button onClick={() => setIsOn(!isOn)}>\n      {isOn ? "Вкл" : "Выкл"}\n    </button>\n  );\n}'
        },
        {
          type: 'heading',
          value: 'Хук (Hook)'
        },
        {
          type: 'text',
          value: 'Функция React, позволяющая использовать возможности React (состояние, эффекты, контекст) в функциональных компонентах. Основные: useState, useEffect, useContext, useRef, useMemo.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: 'function Timer() {\n  const [time, setTime] = useState(0);\n  useEffect(() => {\n    const id = setInterval(() => setTime(t => t+1), 1000);\n    return () => clearInterval(id); // cleanup\n  }, []); // один раз при монтировании\n}'
        },
        {
          type: 'heading',
          value: 'Роутинг (Routing)'
        },
        {
          type: 'text',
          value: 'Механизм отображения разных компонентов при разных URL без перезагрузки страницы. В React: React Router. Поддерживает: вложенные маршруты, параметры, защищённые роуты.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '<BrowserRouter>\n  <Routes>\n    <Route path="/" element={<Home />} />\n    <Route path="/user/:id" element={<UserPage />} />\n    <Route path="*" element={<NotFound />} />\n  </Routes>\n</BrowserRouter>'
        },
        {
          type: 'heading',
          value: 'SSR/SSG (Server-Side Rendering / Static Site Generation)'
        },
        {
          type: 'text',
          value: 'SSR — HTML генерируется на сервере при каждом запросе. SSG — HTML генерируется один раз при сборке. SSG быстрее SSR, но не подходит для динамического контента. Next.js поддерживает оба режима.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// SSG в Next.js:\nexport async function getStaticProps() {\n  const posts = await fetchPosts();\n  return { props: { posts }, revalidate: 60 }; // обновлять каждые 60 сек\n}'
        },
        {
          type: 'heading',
          value: 'Бандлер (Bundler)'
        },
        {
          type: 'text',
          value: 'Инструмент, объединяющий множество JS/CSS файлов в один или несколько бандлов для оптимальной загрузки браузером. Примеры: webpack, Vite, Parcel, Rollup.'
        },
        {
          type: 'code',
          language: 'bash',
          value: 'npm run build\n# Vite/webpack объединяет:\n# src/index.js + src/components/* + node_modules\n# -> dist/assets/index-Abc123.js (один файл)'
        },
        {
          type: 'heading',
          value: 'Транспилер (Transpiler)'
        },
        {
          type: 'text',
          value: 'Инструмент, преобразующий код из одного синтаксиса в другой. Babel переводит современный JS (ES2022) в совместимый со старыми браузерами. TypeScript компилирует TS → JS.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Входной код (TypeScript / современный JS):\nconst greet = (name: string): string => "Привет, " + name + "!";\n// Выходной код (ES5):\nvar greet = function(name) { return "Привет, " + name + "!"; };'
        }
      ]
    },
    {
      id: 8,
      type: 'theory',
      title: 'Бэкенд',
      content: [
        {
          type: 'heading',
          value: 'Сервер (Server)'
        },
        {
          type: 'text',
          value: 'Программа или компьютер, принимающая запросы от клиентов и возвращающая ответы. Веб-сервер обрабатывает HTTP-запросы. Примеры: Express (Node.js), Spring Boot (Java), FastAPI (Python).'
        },
        {
          type: 'code',
          language: 'javascript',
          value: 'const express = require("express");\nconst app = express();\napp.get("/", (req, res) => res.send("Привет!"));\napp.listen(3000, () => console.log("Сервер запущен"));'
        },
        {
          type: 'heading',
          value: 'Middleware'
        },
        {
          type: 'text',
          value: 'Функция, обрабатывающая запрос до того, как он достигнет обработчика маршрута. Используется для: логирования, аутентификации, разбора тела запроса, обработки ошибок.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Middleware аутентификации:\nfunction authMiddleware(req, res, next) {\n  if (!req.headers.authorization) {\n    return res.status(401).json({ error: "Не авторизован" });\n  }\n  next(); // передать управление следующему обработчику\n}'
        },
        {
          type: 'heading',
          value: 'Эндпоинт (Endpoint)'
        },
        {
          type: 'text',
          value: 'Конкретный URL в API, с которым взаимодействует клиент. Каждый эндпоинт обрабатывает определённый HTTP-метод и выполняет конкретное действие.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: 'app.get("/api/users", getUsers);         // список\napp.get("/api/users/:id", getUserById);   // один\napp.post("/api/users", createUser);       // создать\napp.delete("/api/users/:id", deleteUser); // удалить'
        },
        {
          type: 'heading',
          value: 'Контроллер (Controller)'
        },
        {
          type: 'text',
          value: 'Слой, принимающий HTTP-запрос, извлекающий параметры и вызывающий нужный сервис. Контроллер не содержит бизнес-логику — только координацию.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: 'class UserController {\n  async getUser(req, res) {\n    const { id } = req.params;\n    const user = await userService.findById(id); // делегирует сервису\n    res.json(user);\n  }\n}'
        },
        {
          type: 'heading',
          value: 'Сервис (Service)'
        },
        {
          type: 'text',
          value: 'Слой с бизнес-логикой приложения. Сервис знает, как обрабатывать данные, но не знает о HTTP или БД напрямую. Вызывается контроллером, работает через репозиторий.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: 'class UserService {\n  async register(data) {\n    // Бизнес-логика: хешировать пароль, проверить уникальность\n    const hashedPwd = await bcrypt.hash(data.password, 10);\n    return userRepository.create({ ...data, password: hashedPwd });\n  }\n}'
        },
        {
          type: 'heading',
          value: 'Репозиторий (Repository)'
        },
        {
          type: 'text',
          value: 'Слой абстракции над базой данных. Инкапсулирует все операции чтения/записи. Сервисы работают через репозиторий, не зная деталей реализации (SQL, MongoDB и т.д.).'
        },
        {
          type: 'code',
          language: 'javascript',
          value: 'class UserRepository {\n  findById(id) { return db.query("SELECT * FROM users WHERE id=?", [id]); }\n  create(data) { return db.query("INSERT INTO users SET ?", [data]); }\n  delete(id) { return db.query("DELETE FROM users WHERE id=?", [id]); }\n}'
        },
        {
          type: 'heading',
          value: 'DTO (Data Transfer Object)'
        },
        {
          type: 'text',
          value: 'Объект для передачи данных между слоями приложения или между клиентом и сервером. Содержит только нужные поля, без методов. Защищает внутренние структуры данных.'
        },
        {
          type: 'code',
          language: 'typescript',
          value: 'class CreateUserDto {\n  name: string;\n  email: string;\n  password: string;\n  // НЕТ полей: id, createdAt, role — клиент не должен их задавать\n}'
        },
        {
          type: 'heading',
          value: 'Сериализация (Serialization)'
        },
        {
          type: 'text',
          value: 'Преобразование объекта в формат для хранения или передачи (JSON, XML, байты). Десериализация — обратный процесс. Используется при работе с API и БД.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Сериализация: объект -> JSON строка\nconst str = JSON.stringify({ name: "Alice", age: 28 });\n// Десериализация: JSON строка -> объект\nconst obj = JSON.parse(str);\nconsole.log(obj.name); // "Alice"'
        },
        {
          type: 'heading',
          value: 'Аутентификация (Authentication)'
        },
        {
          type: 'text',
          value: 'Процесс проверки личности пользователя. "Ты кто?" — вводишь логин/пароль, и система проверяет, существует ли такой пользователь. Результат: токен или сессия.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Аутентификация: проверяем пользователя\nconst user = await User.findOne({ email });\nconst valid = await bcrypt.compare(password, user.passwordHash);\nif (!valid) throw new Error("Неверный пароль");\nconst token = jwt.sign({ userId: user.id }, SECRET);'
        },
        {
          type: 'heading',
          value: 'Авторизация (Authorization)'
        },
        {
          type: 'text',
          value: 'Проверка прав доступа аутентифицированного пользователя. "Что тебе разрешено?" — система проверяет, имеет ли пользователь право выполнить действие.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Авторизация: проверяем роль\nfunction requireAdmin(req, res, next) {\n  if (req.user.role !== "admin") {\n    return res.status(403).json({ error: "Доступ запрещён" });\n  }\n  next();\n}'
        }
      ]
    },
    {
      id: 9,
      type: 'theory',
      title: 'Сети и безопасность',
      content: [
        {
          type: 'heading',
          value: 'TCP/IP'
        },
        {
          type: 'text',
          value: 'Стек протоколов интернета. IP обеспечивает адресацию и маршрутизацию пакетов. TCP обеспечивает надёжную доставку: гарантирует порядок, повтор при потере. UDP — без гарантий, но быстрее.'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# TCP: трёхстороннее рукопожатие (handshake)\n# SYN -> SYN-ACK -> ACK\n# Потом передача данных с подтверждениями\n# IP адрес: 192.168.1.1, порт: 3000'
        },
        {
          type: 'heading',
          value: 'DNS (Domain Name System)'
        },
        {
          type: 'text',
          value: 'Система, переводящая доменные имена (google.com) в IP-адреса (142.250.185.46). Как телефонная книга интернета. Без DNS пришлось бы запоминать IP-адреса всех сайтов.'
        },
        {
          type: 'code',
          language: 'bash',
          value: 'nslookup google.com\n# Server: 8.8.8.8 (Google DNS)\n# Address: 142.250.185.46\n\ndig example.com A  # A-запись: IPv4 адрес'
        },
        {
          type: 'heading',
          value: 'SSL/TLS'
        },
        {
          type: 'text',
          value: 'Протоколы шифрования для защиты данных в сети. TLS — современная версия SSL. Обеспечивают: шифрование (данные нечитаемы для третьих лиц), аутентификацию сервера (сертификаты), целостность данных.'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# TLS рукопожатие:\n# 1. Клиент: "Поддерживаемые алгоритмы шифрования"\n# 2. Сервер: "Вот мой сертификат, выбранный алгоритм"\n# 3. Клиент: проверяет сертификат, обменивается ключами\n# 4. Дальнейшее общение зашифровано'
        },
        {
          type: 'heading',
          value: 'Firewall (Брандмауэр)'
        },
        {
          type: 'text',
          value: 'Система безопасности, фильтрующая сетевой трафик по правилам: разрешать или блокировать пакеты по IP, порту, протоколу. Защищает сервер от несанкционированного доступа.'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# UFW (Ubuntu Firewall):\nufw allow 80/tcp    # разрешить HTTP\nufw allow 443/tcp   # разрешить HTTPS\nufw deny 22/tcp     # закрыть SSH для всех\nufw enable          # включить'
        },
        {
          type: 'heading',
          value: 'Proxy (Прокси-сервер)'
        },
        {
          type: 'text',
          value: 'Промежуточный сервер между клиентом и целевым сервером. Forward proxy — скрывает клиента (VPN). Reverse proxy — скрывает сервер, балансирует нагрузку (Nginx, HAProxy).'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Nginx как reverse proxy:\n# Клиент -> Nginx (80) -> App сервер (3000)\nserver {\n  listen 80;\n  location / {\n    proxy_pass http://localhost:3000;\n  }\n}'
        },
        {
          type: 'heading',
          value: 'VPN (Virtual Private Network)'
        },
        {
          type: 'text',
          value: 'Технология, создающая зашифрованный "туннель" через публичную сеть. Используется для: удалённого доступа к корпоративной сети, анонимизации трафика, обхода географических ограничений.'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# OpenVPN: зашифрованный туннель\n# Реальный трафик -> зашифрован -> VPN сервер -> цель\n# Внешний наблюдатель видит только трафик к VPN серверу'
        },
        {
          type: 'heading',
          value: 'XSS (Cross-Site Scripting)'
        },
        {
          type: 'text',
          value: 'Уязвимость: злоумышленник внедряет вредоносный JS-код в страницу, который выполняется в браузере жертвы. Может красть cookies, перенаправлять пользователей. Защита: экранирование вывода.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Уязвимо:\ndiv.innerHTML = userInput; // XSS!\n// Безопасно:\ndiv.textContent = userInput; // экранирует HTML\n// Или используйте DOMPurify для очистки HTML'
        },
        {
          type: 'heading',
          value: 'CSRF (Cross-Site Request Forgery)'
        },
        {
          type: 'text',
          value: 'Атака: злоумышленник заставляет браузер жертвы отправить запрос на сайт, где жертва аутентифицирована. Защита: CSRF-токен (уникальный токен в каждой форме), SameSite cookies.'
        },
        {
          type: 'code',
          language: 'html',
          value: '<!-- CSRF-защита: токен в форме -->\n<form action="/transfer" method="POST">\n  <input type="hidden" name="_csrf" value="abc123uniqueToken" />\n  <input type="text" name="amount" />\n  <button type="submit">Перевести</button>\n</form>'
        },
        {
          type: 'heading',
          value: 'SQL-инъекция (SQL Injection)'
        },
        {
          type: 'text',
          value: 'Атака: злоумышленник вставляет SQL-код в пользовательский ввод, изменяя логику запроса. Защита: параметризованные запросы (prepared statements), никогда не подставлять ввод напрямую в SQL.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Уязвимо:\ndb.query("SELECT * FROM users WHERE name = " + input); // SQL инъекция!\n// Безопасно (prepared statement):\ndb.query("SELECT * FROM users WHERE name = ?", [input]);'
        },
        {
          type: 'heading',
          value: 'OWASP'
        },
        {
          type: 'text',
          value: 'Open Web Application Security Project — некоммерческая организация, публикующая стандарты и рекомендации по безопасности. OWASP Top 10 — список наиболее критичных уязвимостей веб-приложений.'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# OWASP Top 10 (актуальный список):\n# 1. Broken Access Control\n# 2. Cryptographic Failures\n# 3. Injection (SQL, XSS)\n# 4. Insecure Design\n# 5. Security Misconfiguration'
        },
        {
          type: 'heading',
          value: 'Хеширование (Hashing)'
        },
        {
          type: 'text',
          value: 'Одностороннее преобразование данных в строку фиксированной длины. Необратимо: из хеша нельзя получить исходные данные. Используется для хранения паролей (bcrypt, Argon2).'
        },
        {
          type: 'code',
          language: 'javascript',
          value: 'const hash = await bcrypt.hash("password123", 12); // хеширование\n// $2b$12$abc...xyz (необратимо)\nconst valid = await bcrypt.compare("password123", hash); // проверка\nconsole.log(valid); // true'
        },
        {
          type: 'heading',
          value: 'Шифрование (Encryption)'
        },
        {
          type: 'text',
          value: 'Двустороннее преобразование данных: зашифровать (encrypt) и расшифровать (decrypt) с помощью ключа. Симметричное: один ключ (AES). Асимметричное: открытый/закрытый ключ (RSA).'
        },
        {
          type: 'code',
          language: 'javascript',
          value: 'const crypto = require("crypto");\nconst iv = crypto.randomBytes(16);\nconst cipher = crypto.createCipheriv("aes-256-cbc", key, iv);\nconst encrypted = cipher.update(text, "utf8", "hex") + cipher.final("hex");'
        }
      ]
    },
    {
      id: 10,
      type: 'theory',
      title: 'Карьера разработчика',
      content: [
        {
          type: 'heading',
          value: 'Junior / Middle / Senior'
        },
        {
          type: 'text',
          value: 'Уровни квалификации разработчика. Junior — решает локальные задачи с помощью. Middle — самостоятелен в типичных задачах, понимает последствия решений. Senior — проектирует системы, менторит, видит большую картину.'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Junior: "Как написать цикл?"\n# Middle: "Какую структуру данных выбрать?"\n# Senior: "Как спроектировать систему с учётом масштабирования?"'
        },
        {
          type: 'heading',
          value: 'Code Review (Ревью кода)'
        },
        {
          type: 'text',
          value: 'Процесс проверки кода коллегами перед слиянием в основную ветку. Цель: найти баги, улучшить читаемость, поделиться знаниями, обеспечить согласованность стиля.'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Типичный процесс:\n# 1. Создать feature ветку\n# 2. Написать код\n# 3. Открыть Pull Request (PR)\n# 4. Коллеги оставляют комментарии\n# 5. Исправить замечания\n# 6. Одобрение (Approve) -> Merge'
        },
        {
          type: 'heading',
          value: 'Agile'
        },
        {
          type: 'text',
          value: 'Гибкая методология разработки. Принципы: итеративная разработка, постоянная обратная связь, адаптация к изменениям, сотрудничество с заказчиком. Манифест Agile: 4 ценности и 12 принципов.'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Agile ценности:\n# Люди > Процессы\n# Работающий продукт > Документация\n# Сотрудничество с клиентом > Переговоры о контракте\n# Реагирование на изменения > Следование плану'
        },
        {
          type: 'heading',
          value: 'Scrum'
        },
        {
          type: 'text',
          value: 'Фреймворк Agile. Работа ведётся итерациями (спринтами). Роли: Product Owner, Scrum Master, Dev Team. Артефакты: Product Backlog, Sprint Backlog, Increment.'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Scrum-цикл:\n# Sprint Planning -> Daily Standups -> Sprint Review -> Retrospective\n# Длина спринта: обычно 1-2 недели'
        },
        {
          type: 'heading',
          value: 'Спринт (Sprint)'
        },
        {
          type: 'text',
          value: 'Фиксированный временной отрезок (1-4 недели) в Scrum, за который команда выполняет запланированный объём работы. В конце спринта — рабочий инкремент продукта.'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Sprint 23 (2 недели):\n# Цель: реализовать авторизацию через Google\n# Задачи: 5 user stories, 13 story points\n# Результат: готовая и протестированная функция'
        },
        {
          type: 'heading',
          value: 'Standup (Daily Standup)'
        },
        {
          type: 'text',
          value: 'Ежедневная короткая встреча команды (15 минут стоя). Три вопроса: что сделал вчера? что планирую сегодня? есть ли препятствия? Цель: синхронизация команды, выявление блокеров.'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Пример ответа на standup:\n# Вчера: закончил endpoint авторизации\n# Сегодня: пишу тесты для UserService\n# Блокеры: нет'
        },
        {
          type: 'heading',
          value: 'Backlog'
        },
        {
          type: 'text',
          value: 'Приоритизированный список задач, функций и улучшений для продукта. Product Backlog — весь список. Sprint Backlog — задачи текущего спринта. Управляет Product Owner.'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Product Backlog (приоритет по убыванию):\n# 1. Авторизация через OAuth\n# 2. Поиск по сайту\n# 3. Email уведомления\n# 4. Тёмная тема\n# 5. Мобильное приложение'
        },
        {
          type: 'heading',
          value: 'Технический долг (Technical Debt)'
        },
        {
          type: 'text',
          value: 'Накопленные "срезанные углы" в коде: временные решения, отсутствие тестов, устаревшие зависимости, плохая архитектура. Со временем замедляет разработку, как реальный долг с процентами.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Технический долг:\n// TODO: убрать этот хардкод\nconst API_URL = "http://localhost:3000"; // уже давно в проде...\n// TODO: переписать этот метод, он делает 3 разные вещи\n// TODO: добавить тесты'
        },
        {
          type: 'heading',
          value: 'Рефакторинг (Refactoring)'
        },
        {
          type: 'text',
          value: 'Улучшение внутренней структуры кода без изменения его внешнего поведения. Цель: улучшить читаемость, уменьшить сложность, устранить дублирование. Тесты — страховка при рефакторинге.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// До рефакторинга:\nfunction p(u) { return u.n + " " + u.s; }\n// После рефакторинга:\nfunction getFullName(user) {\n  return user.firstName + " " + user.lastName;\n}'
        },
        {
          type: 'heading',
          value: 'Legacy code'
        },
        {
          type: 'text',
          value: 'Унаследованный код: старый, часто плохо документированный, без тестов, трудно изменяемый. Определение Майкла Фезерса: "Legacy code — это код без тестов". Работа с legacy — реальность большинства команд.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Признаки legacy кода:\n// var вместо const/let\n// callback-hell вместо async/await\n// Нет тестов\n// Нет документации\n// Комментарий: "// не трогай — сломается"'
        }
      ]
    }
  ]
};
