export default {
  id: 17,
  title: 'FAQ: Частые ошибки',
  description: 'Разбор 50+ частых ошибок с примерами плохого и правильного кода. Java, Python, JavaScript, SQL, Git, Docker, React и другие.',
  lessons: [
    {
      id: 1,
      type: 'theory',
      title: 'Java: Частые ошибки',
      content: [
        {
          type: 'heading',
          value: 'NullPointerException'
        },
        {
          type: 'code',
          language: 'java',
          value: '// Плохо:\nString name = null;\nSystem.out.println(name.length()); // NullPointerException!'
        },
        {
          type: 'warning',
          value: 'Обращение к методу или полю объекта, который равен null. Самое частое исключение в Java. Возникает, когда переменная не была инициализирована или метод вернул null.'
        },
        {
          type: 'code',
          language: 'java',
          value: '// Хорошо — проверка на null:\nif (name != null) {\n  System.out.println(name.length());\n}\n// Или Java 8+ Optional:\nOptional.ofNullable(name).ifPresent(n -> System.out.println(n.length()));\n// Или Objects.requireNonNullElse:\nString safe = Objects.requireNonNullElse(name, "default");'
        },
        {
          type: 'tip',
          value: 'Используй Optional<T> для возвращаемых значений, которые могут отсутствовать. Аннотации @NotNull и @Nullable помогают IDE предупреждать о потенциальных NPE до запуска кода.'
        },
        {
          type: 'heading',
          value: 'ConcurrentModificationException'
        },
        {
          type: 'code',
          language: 'java',
          value: '// Плохо:\nList<String> list = new ArrayList<>(Arrays.asList("a", "b", "c"));\nfor (String item : list) {\n  if (item.equals("b")) {\n    list.remove(item); // ConcurrentModificationException!\n  }\n}'
        },
        {
          type: 'warning',
          value: 'Попытка изменить коллекцию во время итерации по ней. Java коллекции отслеживают количество изменений (modCount) и бросают исключение при несовпадении.'
        },
        {
          type: 'code',
          language: 'java',
          value: '// Хорошо — использовать Iterator:\nIterator<String> it = list.iterator();\nwhile (it.hasNext()) {\n  if (it.next().equals("b")) it.remove(); // OK!\n}\n// Или removeIf (Java 8+):\nlist.removeIf(item -> item.equals("b"));\n// Или Stream filter:\nList<String> result = list.stream().filter(s -> !s.equals("b")).collect(toList());'
        },
        {
          type: 'tip',
          value: 'Для многопоточного кода используй CopyOnWriteArrayList или ConcurrentHashMap — они не бросают ConcurrentModificationException при параллельном изменении.'
        },
        {
          type: 'heading',
          value: 'ClassCastException'
        },
        {
          type: 'code',
          language: 'java',
          value: '// Плохо:\nObject obj = "Привет";\nInteger num = (Integer) obj; // ClassCastException!\n// Также частая проблема с generics до Java 5:'
        },
        {
          type: 'warning',
          value: 'Попытка привести объект к несовместимому типу. Возникает при неправильном downcasting — приведении от суперкласса к подклассу, когда реальный тип объекта другой.'
        },
        {
          type: 'code',
          language: 'java',
          value: '// Хорошо — проверять перед приведением:\nif (obj instanceof String str) { // Java 16+ pattern matching\n  System.out.println(str.length());\n}\n// Или старый способ:\nif (obj instanceof String) {\n  String str = (String) obj;\n  System.out.println(str.length());\n}'
        },
        {
          type: 'tip',
          value: 'Используй generics везде, где возможно: List<String> вместо List. Это переносит ошибки типов с времени выполнения на время компиляции, что намного лучше.'
        },
        {
          type: 'heading',
          value: 'StackOverflowError'
        },
        {
          type: 'code',
          language: 'java',
          value: '// Плохо — бесконечная рекурсия:\npublic int factorial(int n) {\n  return n * factorial(n - 1); // нет базового случая!\n  // Также: два метода, вызывающих друг друга без выхода\n}'
        },
        {
          type: 'warning',
          value: 'Стек вызовов переполнен из-за слишком глубокой рекурсии (обычно тысячи уровней). Каждый вызов метода занимает место в стеке JVM, при переполнении выбрасывается ошибка.'
        },
        {
          type: 'code',
          language: 'java',
          value: '// Хорошо — базовый случай обязателен:\npublic long factorial(int n) {\n  if (n <= 1) return 1; // базовый случай!\n  return n * factorial(n - 1);\n}\n// Или итеративный вариант (не тратит стек):\npublic long factorialIterative(int n) {\n  long result = 1;\n  for (int i = 2; i <= n; i++) result *= i;\n  return result;\n}'
        },
        {
          type: 'tip',
          value: 'Для глубокой рекурсии (n > 10000) предпочти итеративный подход или используй хвостовую рекурсию. Размер стека JVM можно увеличить через флаг -Xss, но это не решение проблемы.'
        },
        {
          type: 'heading',
          value: 'OutOfMemoryError'
        },
        {
          type: 'code',
          language: 'java',
          value: '// Плохо — утечка памяти:\nList<byte[]> leak = new ArrayList<>();\nwhile (true) {\n  leak.add(new byte[1024 * 1024]); // добавляем 1MB каждую итерацию\n  // OutOfMemoryError: Java heap space\n}'
        },
        {
          type: 'warning',
          value: 'JVM исчерпала доступную heap-память. Причины: утечки памяти (объекты не освобождаются сборщиком), обработка слишком больших объектов данных, неправильно настроенный heap.'
        },
        {
          type: 'code',
          language: 'java',
          value: '// Хорошо — освобождай ресурсы:\n// 1. Используй try-with-resources для AutoCloseable:\ntry (InputStream is = new FileInputStream("file.txt")) {\n  // ресурс закроется автоматически\n}\n// 2. Для больших данных — стриминг вместо загрузки в память:\nFiles.lines(Path.of("bigfile.txt")).forEach(System.out::println);\n// 3. Настройка heap: java -Xmx4g MyApp  (максимум 4GB)'
        },
        {
          type: 'tip',
          value: 'Для поиска утечек памяти используй профилировщики: VisualVM, JProfiler, YourKit. Анализируй heap dump командой jmap -dump:format=b,file=heap.hprof <pid>.'
        }
      ]
    },
    {
      id: 2,
      type: 'theory',
      title: 'Python: Частые ошибки',
      content: [
        {
          type: 'heading',
          value: 'IndentationError'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Плохо:\ndef greet(name):\nprint("Привет, " + name)  # IndentationError: нет отступа!\n\n# Или смешивание табов и пробелов:\ndef calc():\n\tx = 1    # таб\n        y = 2    # 8 пробелов (TabError)'
        },
        {
          type: 'warning',
          value: 'Python использует отступы для определения блоков кода (в отличие от фигурных скобок в Java/JS). Несогласованные отступы или смешивание табов с пробелами ломают программу.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Хорошо — 4 пробела, последовательно:\ndef greet(name):\n    print("Привет, " + name)  # 4 пробела\n    if name:\n        print("Имя задано")   # 8 пробелов (два уровня)\n# Настройка редактора: "конвертировать табы в пробелы"'
        },
        {
          type: 'tip',
          value: 'В редакторе включи отображение пробелов и настрой автозамену табов на 4 пробела. Используй flake8 или ruff для автоматической проверки стиля кода.'
        },
        {
          type: 'heading',
          value: 'TypeError'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Плохо:\nage = input("Введи возраст: ")  # input возвращает str!\nresult = age + 5                 # TypeError: can only concatenate str to str\n\n# Или:\ndef add(a, b):\n    return a + b\nadd(1, 2, 3)  # TypeError: add() takes 2 positional arguments but 3 were given'
        },
        {
          type: 'warning',
          value: 'Операция применяется к объекту неподходящего типа. Python динамически типизирован — ошибки типов проявляются только во время выполнения, не при компиляции.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Хорошо — явное приведение типов:\nage = int(input("Введи возраст: "))  # явно int\nresult = age + 5  # OK\n\n# Type hints помогают находить ошибки заранее:\ndef add(a: int, b: int) -> int:\n    return a + b\n# Запусти mypy для статической проверки типов'
        },
        {
          type: 'tip',
          value: 'Используй type hints (аннотации типов) и mypy для статической проверки. Это не обязательно, но значительно снижает количество TypeError в production.'
        },
        {
          type: 'heading',
          value: 'ImportError / ModuleNotFoundError'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Плохо:\nimport pandas  # ModuleNotFoundError: No module named "pandas"\n# Или:\nfrom mymodule import nonexistent_func  # ImportError: cannot import name'
        },
        {
          type: 'warning',
          value: 'Пакет не установлен в текущем виртуальном окружении, или неправильно указан путь/имя модуля. Частая причина: установка в глобальный Python, а не в venv.'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Хорошо — работать в виртуальном окружении:\npython -m venv venv\nsource venv/bin/activate  # Linux/Mac\nvenv\\Scripts\\activate     # Windows\npip install pandas\n\n# Сохранить зависимости:\npip freeze > requirements.txt\n\n# Установить зависимости:\npip install -r requirements.txt'
        },
        {
          type: 'tip',
          value: 'Всегда работай в виртуальном окружении (venv или conda). Используй pyproject.toml и Poetry для управления зависимостями в современных проектах.'
        },
        {
          type: 'heading',
          value: 'RecursionError'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Плохо:\ndef countdown(n):\n    print(n)\n    countdown(n - 1)  # нет базового случая -> RecursionError!\n\ncountdown(10)\n# RecursionError: maximum recursion depth exceeded'
        },
        {
          type: 'warning',
          value: 'Превышена максимальная глубина рекурсии Python (по умолчанию 1000 вызовов). Python не оптимизирует хвостовую рекурсию в отличие от некоторых других языков.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Хорошо — всегда добавляй базовый случай:\ndef countdown(n):\n    if n <= 0:  # базовый случай\n        return\n    print(n)\n    countdown(n - 1)\n\n# Или итеративно (не тратит стек):\ndef countdown_iter(n):\n    while n > 0:\n        print(n)\n        n -= 1\n\n# Если нужно больше рекурсии:\nimport sys\nsys.setrecursionlimit(5000)  # изменить лимит'
        },
        {
          type: 'tip',
          value: 'Python не оптимизирует хвостовую рекурсию — для глубоких рекурсий используй итеративный подход или явный стек (collections.deque). Мемоизация через @functools.lru_cache ускоряет рекурсивные вычисления.'
        },
        {
          type: 'heading',
          value: 'FileNotFoundError'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Плохо:\nwith open("data.csv") as f:  # FileNotFoundError, если файла нет!\n    content = f.read()\n\n# Или:\nwith open("C:\\\\Users\\\\file.txt") as f:  # Не работает на Linux/Mac!'
        },
        {
          type: 'warning',
          value: 'Файл не найден по указанному пути. Путь может быть относительным (зависит от рабочей директории при запуске скрипта) или содержать ошибки в написании.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'from pathlib import Path\nimport os\n\n# Хорошо — использовать pathlib для кроссплатформенности:\nbase = Path(__file__).parent  # директория скрипта\ndata_file = base / "data" / "file.csv"\n\n# Проверка существования:\nif data_file.exists():\n    content = data_file.read_text()\nelse:\n    print(f"Файл не найден: {data_file}")\n\n# Или try-except:\ntry:\n    content = data_file.read_text()\nexcept FileNotFoundError as e:\n    print(f"Ошибка: {e}")'
        },
        {
          type: 'tip',
          value: 'Используй pathlib.Path вместо строковых путей — он кроссплатформенный, читаемый и безопасный. Path(__file__).parent даёт директорию текущего скрипта, что решает большинство проблем с относительными путями.'
        }
      ]
    },
    {
      id: 3,
      type: 'theory',
      title: 'JavaScript: Частые ошибки',
      content: [
        {
          type: 'heading',
          value: 'undefined is not a function'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Плохо:\nconst obj = { name: "Alice" };\nobj.greet(); // TypeError: obj.greet is not a function\n\n// Или:\nconst arr = [1, 2, 3];\narr.find(x => x > 1).map(x => x * 2); // TypeError: find возвращает элемент, не массив!'
        },
        {
          type: 'warning',
          value: 'Попытка вызвать как функцию что-то, что функцией не является (undefined, null, число, строку). Часто возникает при опечатках в именах методов или неправильном понимании возвращаемого типа.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Хорошо — проверять тип перед вызовом:\nif (typeof obj.greet === "function") {\n  obj.greet();\n}\n// Опциональная цепочка (Optional chaining):\nobj.greet?.();  // не бросит ошибку, просто вернёт undefined\n\n// Правильное использование методов массива:\nconst found = arr.find(x => x > 1);    // один элемент или undefined\nconst filtered = arr.filter(x => x > 1); // массив'
        },
        {
          type: 'tip',
          value: 'Используй оператор ?. (optional chaining) — он безопасно обращается к вложенным свойствам: user?.address?.city. Изучи возвращаемые типы методов массива: find возвращает элемент, filter — массив.'
        },
        {
          type: 'heading',
          value: 'Cannot read property of null'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Плохо:\nconst user = null;\nconsole.log(user.name); // TypeError: Cannot read properties of null\n\n// Часто встречается с DOM:\nconst btn = document.getElementById("nonexistent");\nbtn.addEventListener("click", fn); // TypeError: btn is null!'
        },
        {
          type: 'warning',
          value: 'Обращение к свойству null или undefined. В JavaScript null и undefined — разные вещи, и оба вызывают эту ошибку при попытке обратиться к их свойствам.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Хорошо — проверка или optional chaining:\nconsole.log(user?.name); // undefined, не ошибка\nconsole.log(user?.name ?? "Гость"); // "Гость" по умолчанию\n\n// DOM: всегда проверяй что элемент существует:\nconst btn = document.getElementById("myBtn");\nbtn?.addEventListener("click", fn); // безопасно\n\n// Nullish coalescing:\nconst name = user?.name ?? "Аноним";'
        },
        {
          type: 'tip',
          value: 'Оператор ?. (optional chaining) и ?? (nullish coalescing) — лучшие друзья против этой ошибки. user?.address?.city ?? "Неизвестно" — безопасно читает вложенные свойства с запасным значением.'
        },
        {
          type: 'heading',
          value: 'CORS error'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Плохо (в браузере):\nfetch("http://api.otherdomain.com/data")\n  .then(r => r.json());\n// Ошибка в консоли:\n// Access to fetch from origin "http://localhost:3000" has been\n// blocked by CORS policy: No "Access-Control-Allow-Origin" header'
        },
        {
          type: 'warning',
          value: 'Браузер блокирует запрос к другому домену/порту/протоколу из соображений безопасности. CORS — это браузерная защита. На сервер запрос доходит — его блокирует браузер при чтении ответа.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Хорошо — добавить заголовки на сервере (Express):\nconst cors = require("cors");\napp.use(cors({\n  origin: "http://localhost:3000",\n  methods: ["GET", "POST", "PUT", "DELETE"]\n}));\n\n// Или в разработке — прокси в vite.config.js:\nexport default {\n  server: {\n    proxy: {\n      "/api": "http://localhost:8080"\n    }\n  }\n};'
        },
        {
          type: 'tip',
          value: 'CORS настраивается только на сервере — с клиента исправить невозможно. В разработке удобно использовать прокси через конфиг Vite/webpack. Никогда не ставь Access-Control-Allow-Origin: * на продакшн API с аутентификацией.'
        },
        {
          type: 'heading',
          value: 'Callback Hell'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Плохо — callback hell (пирамида смерти):\ngetUser(userId, function(user) {\n  getOrders(user.id, function(orders) {\n    getProducts(orders[0].id, function(product) {\n      updateCart(product, function(cart) {\n        console.log(cart); // глубина 4 уровня!\n      });\n    });\n  });\n});'
        },
        {
          type: 'warning',
          value: 'Вложенные колбэки делают код нечитаемым, трудно отлаживаемым и хрупким. Обработка ошибок превращается в кошмар. Это анти-паттерн, характерный для старого JS-кода.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Хорошо — async/await:\nasync function loadCart(userId) {\n  const user = await getUser(userId);\n  const orders = await getOrders(user.id);\n  const product = await getProducts(orders[0].id);\n  const cart = await updateCart(product);\n  console.log(cart);\n}\n\n// Обработка ошибок:\ntry {\n  await loadCart(userId);\n} catch (error) {\n  console.error("Ошибка:", error);\n}'
        },
        {
          type: 'tip',
          value: 'Используй async/await — это синтаксический сахар над Promises, делающий асинхронный код похожим на синхронный. Для параллельных запросов используй Promise.all([req1, req2]).'
        },
        {
          type: 'heading',
          value: 'this context lost (потеря контекста this)'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Плохо:\nclass Timer {\n  constructor() {\n    this.count = 0;\n  }\n  start() {\n    setInterval(function() {\n      this.count++; // this — это window/undefined, не Timer!\n      console.log(this.count); // NaN\n    }, 1000);\n  }\n}'
        },
        {
          type: 'warning',
          value: 'В обычных функциях this определяется контекстом вызова, а не объявления. В callback-функциях, обработчиках событий и setTimeout this "теряется" — становится window или undefined в strict mode.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Хорошо — стрелочная функция:\nclass Timer {\n  constructor() {\n    this.count = 0;\n  }\n  start() {\n    setInterval(() => {      // стрелочная функция наследует this\n      this.count++;           // this — это Timer!\n      console.log(this.count);\n    }, 1000);\n  }\n}\n// Или bind:\nsetInterval(this.tick.bind(this), 1000);'
        },
        {
          type: 'tip',
          value: 'Стрелочные функции () => {} не имеют собственного this — они берут this из окружающего контекста. Это делает их идеальными для колбэков внутри классов. В React используй стрелочные функции для обработчиков событий.'
        }
      ]
    },
    {
      id: 4,
      type: 'theory',
      title: 'SQL: Частые ошибки',
      content: [
        {
          type: 'heading',
          value: 'Синтаксическая ошибка (Syntax Error)'
        },
        {
          type: 'code',
          language: 'sql',
          value: '-- Плохо:\nSELECT name age FROM users;        -- пропущена запятая\nSELECT * FORM users;               -- опечатка: FORM вместо FROM\nWHERE id = 1 SELECT * FROM users;  -- неправильный порядок'
        },
        {
          type: 'warning',
          value: 'SQL требует строгого синтаксиса и правильного порядка ключевых слов: SELECT → FROM → JOIN → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT. Пропущенные запятые и опечатки — самые частые ошибки.'
        },
        {
          type: 'code',
          language: 'sql',
          value: '-- Хорошо — правильный порядок:\nSELECT\n  u.name,\n  u.email,\n  COUNT(o.id) AS order_count\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id\nWHERE u.active = true\nGROUP BY u.id, u.name, u.email\nHAVING COUNT(o.id) > 0\nORDER BY order_count DESC\nLIMIT 10;'
        },
        {
          type: 'tip',
          value: 'Используй IDE или pgAdmin с подсветкой синтаксиса. Форматируй SQL с переносами строк — это помогает видеть структуру. Выполняй сложные запросы по частям: сначала FROM + WHERE, потом добавляй JOIN и GROUP BY.'
        },
        {
          type: 'heading',
          value: 'Ambiguous column (Неоднозначный столбец)'
        },
        {
          type: 'code',
          language: 'sql',
          value: '-- Плохо:\nSELECT id, name, email\nFROM users\nJOIN orders ON users.id = orders.user_id;\n-- ERROR: column "id" is ambiguous\n-- (id есть и в users, и в orders)'
        },
        {
          type: 'warning',
          value: 'При JOIN нескольких таблиц одноимённые столбцы становятся неоднозначными. СУБД не знает, из какой таблицы брать столбец, и выдаёт ошибку.'
        },
        {
          type: 'code',
          language: 'sql',
          value: '-- Хорошо — явно указывать таблицу/псевдоним:\nSELECT\n  u.id AS user_id,\n  u.name,\n  u.email,\n  o.id AS order_id,\n  o.total\nFROM users u\nJOIN orders o ON u.id = o.user_id;'
        },
        {
          type: 'tip',
          value: 'Всегда используй алиасы таблиц (u, o, p) и явно указывай таблицу для каждого столбца в запросах с JOIN. Это не только устраняет ошибку, но и делает запрос понятнее.'
        },
        {
          type: 'heading',
          value: 'N+1 запрос (N+1 Query Problem)'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Плохо — N+1 запросов:\nconst users = await db.query("SELECT * FROM users");  // 1 запрос\nfor (const user of users) {\n  // Для каждого из 100 пользователей — отдельный запрос!\n  user.orders = await db.query("SELECT * FROM orders WHERE user_id = ?", [user.id]);\n  // Итого: 1 + 100 = 101 запрос к БД!\n}'
        },
        {
          type: 'warning',
          value: 'N+1 — классическая проблема производительности: один запрос для получения списка, потом N отдельных запросов для каждого элемента. При 1000 записях — 1001 запрос к БД!'
        },
        {
          type: 'code',
          language: 'sql',
          value: '-- Хорошо — один запрос с JOIN:\nSELECT u.id, u.name, o.id as order_id, o.total\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id;\n\n-- Или для ORM (Prisma/Hibernate) — eager loading:\n-- Prisma: include: { orders: true }\n-- Hibernate: @ManyToOne(fetch = FetchType.EAGER)'
        },
        {
          type: 'tip',
          value: 'Используй JOIN вместо вложенных запросов в цикле. В ORM всегда явно задавай загрузку связанных данных (eager loading). Инструменты вроде Django Debug Toolbar или Hibernate Statistics покажут количество запросов.'
        },
        {
          type: 'heading',
          value: 'Deadlock (Взаимная блокировка)'
        },
        {
          type: 'code',
          language: 'sql',
          value: '-- Плохо: транзакция 1 и транзакция 2 блокируют ресурсы в разном порядке:\n-- Транзакция 1:\nBEGIN;\nUPDATE accounts SET balance = balance - 100 WHERE id = 1; -- блокирует id=1\nUPDATE accounts SET balance = balance + 100 WHERE id = 2; -- ждёт id=2\n\n-- Транзакция 2 (одновременно):\nBEGIN;\nUPDATE accounts SET balance = balance - 50 WHERE id = 2;  -- блокирует id=2\nUPDATE accounts SET balance = balance + 50 WHERE id = 1;  -- ждёт id=1\n-- Оба ждут друг друга = DEADLOCK'
        },
        {
          type: 'warning',
          value: 'Взаимная блокировка: две транзакции удерживают ресурсы, которые нужны друг другу. СУБД обнаруживает deadlock и принудительно откатывает одну из транзакций.'
        },
        {
          type: 'code',
          language: 'sql',
          value: '-- Хорошо — захватывать блокировки в одном порядке:\n-- Всегда обновляй записи в порядке возрастания id:\nBEGIN;\nUPDATE accounts SET balance = balance - 100 WHERE id = 1; -- меньший id первым\nUPDATE accounts SET balance = balance + 100 WHERE id = 2; -- потом больший\nCOMMIT;\n-- Теперь обе транзакции будут ждать id=1 — deadlock невозможен'
        },
        {
          type: 'tip',
          value: 'Предотвращение: всегда блокируй ресурсы в одном порядке. Держи транзакции короткими. Используй SELECT FOR UPDATE для явной блокировки строк. Обрабатывай deadlock ошибки и повторяй транзакцию.'
        },
        {
          type: 'heading',
          value: 'Медленный запрос без индекса'
        },
        {
          type: 'code',
          language: 'sql',
          value: '-- Плохо — поиск по неиндексированной колонке:\nSELECT * FROM users WHERE email = "alice@example.com";\n-- При 10 миллионах записей — полный перебор таблицы!\n-- EXPLAIN покажет: Seq Scan (последовательное сканирование)'
        },
        {
          type: 'warning',
          value: 'Запрос без подходящего индекса выполняет Full Table Scan — перебирает все записи таблицы. При миллионах записей это может занимать секунды или минуты вместо миллисекунд.'
        },
        {
          type: 'code',
          language: 'sql',
          value: '-- Хорошо — создать индекс:\nCREATE INDEX idx_users_email ON users(email);\n-- Теперь запрос использует Index Scan — O(log n) вместо O(n)\n\n-- Анализ медленных запросов:\nEXPLAIN ANALYZE SELECT * FROM users WHERE email = "alice@example.com";\n-- Составной индекс для часто используемых комбинаций:\nCREATE INDEX idx_users_active_created ON users(active, created_at);'
        },
        {
          type: 'tip',
          value: 'Используй EXPLAIN ANALYZE для анализа плана выполнения запроса. Индексируй: колонки в WHERE, колонки в JOIN ON, колонки в ORDER BY на больших таблицах. Но не создавай индексы на каждую колонку — они замедляют INSERT/UPDATE.'
        }
      ]
    },
    {
      id: 5,
      type: 'theory',
      title: 'Git: Частые ошибки',
      content: [
        {
          type: 'heading',
          value: 'Merge Conflict (Конфликт слияния)'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Плохо — ситуация:\n# Ты изменил строку 10 в main.js\n# Коллега тоже изменил строку 10 в main.js\n# git merge -> CONFLICT (content): Merge conflict in main.js\n\n# В файле появляются маркеры:\n<<<<<<< HEAD\nconst name = "Alice";\n=======\nconst name = "Bob";\n>>>>>>> feature-branch'
        },
        {
          type: 'warning',
          value: 'Конфликт возникает, когда два человека изменили одно и то же место в файле. Git не может автоматически решить, чья версия правильная — это нужно сделать вручную.'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Хорошо — разрешить конфликт:\n# 1. Открой файл, найди маркеры <<<, ===, >>>\n# 2. Выбери правильную версию (или объедини обе)\n# 3. Удали все маркеры конфликта\nconst name = "Alice"; # оставляем нужную версию\n\n# 4. Добавь разрешённые файлы:\ngit add main.js\ngit commit -m "resolve merge conflict in main.js"\n\n# Профилактика: чаще делай pull, ветки держи короткими'
        },
        {
          type: 'tip',
          value: 'Регулярно делай git pull --rebase, чтобы держать ветку обновлённой. Используй IDE (VS Code, IntelliJ) для разрешения конфликтов — они показывают три версии (ваша, исходная, их) удобно.'
        },
        {
          type: 'heading',
          value: 'Detached HEAD'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Плохо — случайно переключился на коммит, а не ветку:\ngit checkout abc1234  # или git checkout v1.0.0 (тег)\n# Сообщение: "HEAD detached at abc1234"\n# Если сделать коммит здесь — он может потеряться!'
        },
        {
          type: 'warning',
          value: 'Detached HEAD означает, что HEAD указывает прямо на коммит, а не на ветку. Коммиты в этом состоянии не принадлежат ни одной ветке и могут быть удалены сборщиком мусора Git.'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Хорошо — создать ветку из текущей позиции:\ngit switch -c my-feature  # создать новую ветку здесь\n# Или вернуться на нужную ветку:\ngit switch main\n# Если уже сделал коммиты в detached HEAD — не паникуй:\ngit switch -c rescue-branch  # создай ветку, чтобы сохранить коммиты'
        },
        {
          type: 'tip',
          value: 'Используй git switch вместо git checkout для переключения веток — он явнее в своих намерениях. Для просмотра старого состояния без риска изменений используй git checkout <hash> -- только для чтения.'
        },
        {
          type: 'heading',
          value: 'Force Push to Main (Принудительный push в main)'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Плохо:\ngit push --force origin main  # ОПАСНО!\n# Перезаписывает историю на сервере\n# Все, кто уже сделали pull, получат конфликты\n# Коммиты коллег могут быть потеряны'
        },
        {
          type: 'warning',
          value: 'Force push перезаписывает историю на сервере. В ветке main это критично: можно уничтожить работу коллег. Большинство компаний защищают main/master от force push через настройки репозитория.'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Хорошо — никогда не делай force push в main!\n# Если нужно исправить последний коммит в feature ветке:\ngit commit --amend       # исправляем\ngit push --force-with-lease origin feature  # безопаснее --force\n# --force-with-lease проверяет, что никто не пушил после тебя\n\n# Для main используй revert:\ngit revert <bad-commit>  # создаёт новый "отменяющий" коммит'
        },
        {
          type: 'tip',
          value: 'Используй git push --force-with-lease вместо --force — он безопаснее. Для исправления ошибок в main всегда используй git revert, который создаёт новый коммит без переписывания истории.'
        },
        {
          type: 'heading',
          value: 'Lost Commits (Потерянные коммиты)'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Плохо — случайно удалил ветку или сделал reset:\ngit reset --hard HEAD~3   # удалили 3 коммита!\ngit branch -D feature     # удалили ветку с незамёрженными коммитами'
        },
        {
          type: 'warning',
          value: 'Команды с --hard и -D выглядят финальными, но Git хранит все коммиты в reflog ещё около 30 дней. "Потерянные" коммиты можно найти и восстановить.'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Хорошо — использовать reflog для восстановления:\ngit reflog  # история всех операций с HEAD\n# HEAD@{3}: commit: add important feature  <- нужный коммит!\n\n# Восстановить:\ngit checkout -b recovered HEAD@{3}  # создать ветку из старого состояния\n# Или:\ngit reset --hard HEAD@{3}  # вернуться к этому состоянию'
        },
        {
          type: 'tip',
          value: 'git reflog — твой спасательный круг в Git. Он хранит всю историю перемещений HEAD. Прежде чем делать опасные операции (reset --hard, merge, rebase), сохраняй хеш текущего коммита: git log --oneline -1.'
        },
        {
          type: 'heading',
          value: '.gitignore не работает'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Плохо — файл уже был добавлен в Git раньше:\n# .gitignore содержит "node_modules/"\n# Но node_modules уже был закоммичен ранее!\ngit status\n# Changes: modified: node_modules/lodash/...  <- игнор не работает!'
        },
        {
          type: 'warning',
          value: '.gitignore игнорирует только неотслеживаемые файлы. Если файл уже был добавлен в git (tracked), .gitignore его не скроет — нужно сначала убрать файл из индекса.'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Хорошо — убрать из индекса, не удаляя физически:\ngit rm -r --cached node_modules\ngit rm --cached .env\n# Теперь добавь в .gitignore:\necho "node_modules/" >> .gitignore\necho ".env" >> .gitignore\n# Закоммить:\ngit add .gitignore\ngit commit -m "fix: remove tracked files that should be ignored"'
        },
        {
          type: 'tip',
          value: 'Создавай .gitignore в самом начале проекта, до первого коммита. Используй gitignore.io для генерации правил под твой стек. Никогда не коммить .env файлы с секретами — даже если потом удалишь, они останутся в истории.'
        }
      ]
    },
    {
      id: 6,
      type: 'theory',
      title: 'Docker: Частые ошибки',
      content: [
        {
          type: 'heading',
          value: 'Port already in use (Порт уже занят)'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Плохо:\ndocker run -p 3000:3000 myapp\n# Error: Bind for 0.0.0.0:3000 failed: port is already allocated\n\n# Или после перезапуска машины порт занят старым контейнером'
        },
        {
          type: 'warning',
          value: 'Порт 3000 на хосте уже используется другим процессом или контейнером. Docker не может привязать два сервиса к одному порту хоста.'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Хорошо — найти и освободить порт:\nlsof -i :3000        # кто занимает порт?\nsudo kill -9 <PID>   # убить процесс\n\n# Или остановить контейнер:\ndocker ps            # найти контейнер\ndocker stop <id>     # остановить\n\n# Или запустить на другом порту:\ndocker run -p 3001:3000 myapp  # хост:3001 -> контейнер:3000'
        },
        {
          type: 'tip',
          value: 'Используй docker-compose down перед повторным запуском — это останавливает и удаляет все контейнеры проекта. Команда docker ps -a покажет все контейнеры включая остановленные.'
        },
        {
          type: 'heading',
          value: 'Permission Denied (Нет прав доступа)'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Плохо:\ndocker run -v /host/data:/app/data myapp\n# ERROR: Permission denied: /app/data/file.txt\n\n# Или:\ndocker ps\n# Got permission denied while trying to connect to the Docker daemon socket'
        },
        {
          type: 'warning',
          value: 'Два вида: 1) Нет прав на файлы при монтировании volume — процесс внутри контейнера работает от другого пользователя. 2) Нет прав на сокет Docker — пользователь не в группе docker.'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Хорошо — добавить пользователя в группу docker:\nsudo usermod -aG docker $USER\nnewgrp docker  # применить без перезапуска\n\n# Для проблем с volume — указать пользователя в Dockerfile:\nFROM node:18-alpine\nRUN addgroup -S app && adduser -S app -G app\nUSER app\n\n# Или передать UID при запуске:\ndocker run --user $(id -u):$(id -g) -v /host:/app myapp'
        },
        {
          type: 'tip',
          value: 'Никогда не запускай контейнеры от root без необходимости — это угроза безопасности. Создавай отдельного пользователя в Dockerfile инструкцией USER. Для dev-окружения флаг --user $(id -u):$(id -g) совмещает права хоста и контейнера.'
        },
        {
          type: 'heading',
          value: 'Image Too Large (Образ слишком большой)'
        },
        {
          type: 'code',
          language: 'dockerfile',
          value: '# Плохо:\nFROM node:18  # 1GB базовый образ!\nCOPY . .\nRUN npm install  # включая devDependencies\n# Итоговый размер: 1.5GB+'
        },
        {
          type: 'warning',
          value: 'Большие образы медленно загружаются и деплоятся, занимают место в registry, увеличивают attack surface. Частые причины: тяжёлый базовый образ, лишние файлы, devDependencies в production.'
        },
        {
          type: 'code',
          language: 'dockerfile',
          value: '# Хорошо — multi-stage build:\nFROM node:18-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\nFROM node:18-alpine AS production\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --only=production  # только prod зависимости\nCOPY --from=builder /app/dist ./dist  # только build артефакты\nCMD ["node", "dist/server.js"]\n# Итоговый размер: ~150MB вместо 1.5GB'
        },
        {
          type: 'tip',
          value: 'Используй Alpine-версии образов (node:18-alpine, python:3.11-slim). Multi-stage build — стандарт для production: собирай в большом образе, копируй только нужное в маленький. Добавь .dockerignore чтобы не копировать node_modules и .git.'
        },
        {
          type: 'heading',
          value: 'Container exits immediately (Контейнер сразу завершается)'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Плохо:\ndocker run myapp\ndocker ps  # контейнера нет в списке!\ndocker ps -a  # статус: Exited (1) 2 seconds ago'
        },
        {
          type: 'warning',
          value: 'Docker контейнер работает только пока выполняется основной процесс (CMD/ENTRYPOINT). Если он завершился или упал — контейнер останавливается. Нужно посмотреть логи для диагностики.'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Хорошо — смотреть логи:\ndocker logs <container-id>    # или имя контейнера\ndocker logs --follow myapp    # в реальном времени\n\n# Запустить интерактивно для отладки:\ndocker run -it myapp sh       # открыть shell внутри\ndocker run -it myapp bash\n\n# Проверить CMD в Dockerfile:\ndocker inspect myapp | grep -A5 "Cmd"\n# CMD должен запускать долгоживущий процесс, не скрипт'
        },
        {
          type: 'tip',
          value: 'Всегда используй docker logs для диагностики. Убедись, что CMD запускает долгоживущий foreground процесс, а не фоновый демон. Добавь --restart=unless-stopped для автоматического перезапуска в production.'
        },
        {
          type: 'heading',
          value: 'Can\'t connect to DB (Не могу подключиться к БД)'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Плохо — в docker-compose:\n// app пытается подключиться к localhost:5432\n// Но postgres запущен в ДРУГОМ контейнере!\nconst db = new Client({ host: "localhost", port: 5432 });\n// Error: connect ECONNREFUSED 127.0.0.1:5432'
        },
        {
          type: 'warning',
          value: 'Каждый контейнер имеет свой localhost. Для связи между контейнерами нужно использовать имя сервиса из docker-compose или имя контейнера, а не localhost.'
        },
        {
          type: 'code',
          language: 'yaml',
          value: '# Хорошо — docker-compose.yml:\nservices:\n  app:\n    build: .\n    environment:\n      - DB_HOST=postgres  # имя сервиса, не localhost!\n    depends_on:\n      postgres:\n        condition: service_healthy  # ждать пока БД готова\n  postgres:\n    image: postgres:15\n    environment:\n      - POSTGRES_PASSWORD=secret\n    healthcheck:\n      test: ["CMD-SHELL", "pg_isready"]\n      interval: 5s\n      retries: 5'
        },
        {
          type: 'tip',
          value: 'В docker-compose контейнеры общаются по имени сервиса. Используй depends_on с condition: service_healthy — это гарантирует, что БД готова к подключению прежде чем приложение стартует.'
        }
      ]
    },
    {
      id: 7,
      type: 'theory',
      title: 'React: Частые ошибки',
      content: [
        {
          type: 'heading',
          value: 'Too many re-renders (Слишком много перерисовок)'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Плохо:\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  setCount(count + 1); // вызывается при каждом рендере!\n  // Меняет стейт -> новый рендер -> снова setCount -> бесконечный цикл!\n  return <div>{count}</div>;\n}'
        },
        {
          type: 'warning',
          value: 'Изменение стейта во время рендера вызывает новый рендер, что снова меняет стейт — бесконечный цикл. React обнаруживает это и бросает ошибку "Too many re-renders".'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Хорошо — изменять стейт только в обработчиках или эффектах:\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  // Стейт меняется только по клику:\n  return (\n    <div>\n      <p>{count}</p>\n      <button onClick={() => setCount(c => c + 1)}>+</button>\n    </div>\n  );\n}'
        },
        {
          type: 'tip',
          value: 'Правило: никогда не вызывай setState напрямую в теле компонента (вне обработчиков и useEffect). Используй функциональную форму setState(prev => prev + 1) для обновлений на основе предыдущего значения — это безопаснее.'
        },
        {
          type: 'heading',
          value: 'Missing key prop (Отсутствует prop key)'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Плохо:\nconst items = ["Яблоко", "Банан", "Вишня"];\nreturn (\n  <ul>\n    {items.map(item => <li>{item}</li>)}\n  </ul>\n);\n// Warning: Each child in a list should have a unique "key" prop.'
        },
        {
          type: 'warning',
          value: 'React использует key для эффективного обновления списков — чтобы знать, какой элемент изменился, добавился или удалился. Без key React перерисовывает весь список, что медленно и может вызывать баги с состоянием.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Хорошо — уникальный стабильный key:\n{items.map(item => <li key={item.id}>{item.name}</li>)}\n\n// Если нет id — используй стабильный идентификатор:\n{items.map(item => <li key={item.slug}>{item.name}</li>)}\n\n// Плохо: key={index} — если порядок меняется, будут баги:\n{items.map((item, index) => <li key={index}>{item}</li>)} // избегай!'
        },
        {
          type: 'tip',
          value: 'Key должен быть: уникальным среди siblings, стабильным (не меняться между рендерами), предсказуемым. Индекс массива как key — только для статических неизменяемых списков без сортировки/фильтрации.'
        },
        {
          type: 'heading',
          value: 'Stale Closure (Устаревшее замыкание)'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Плохо:\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  useEffect(() => {\n    const id = setInterval(() => {\n      setCount(count + 1); // count всегда 0! Замкнулось на первом рендере.\n    }, 1000);\n    return () => clearInterval(id);\n  }, []); // пустой массив зависимостей -> эффект не обновляется\n}'
        },
        {
          type: 'warning',
          value: 'Замыкание в useEffect захватывает значения переменных на момент первого запуска. Если зависимости не указаны, значения "замораживаются" — колбэк всегда видит начальные значения стейта.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Хорошо — функциональное обновление стейта:\nuseEffect(() => {\n  const id = setInterval(() => {\n    setCount(prev => prev + 1); // prev всегда актуален!\n  }, 1000);\n  return () => clearInterval(id);\n}, []); // пустой массив OK, т.к. используем prev\n\n// Или добавить count в зависимости:\nuseEffect(() => {\n  const id = setInterval(() => setCount(count + 1), 1000);\n  return () => clearInterval(id);\n}, [count]); // обновляется при каждом изменении count'
        },
        {
          type: 'tip',
          value: 'Используй eslint-plugin-react-hooks — он предупреждает о неправильных зависимостях useEffect. Функциональное обновление setState(prev => ...) решает большинство проблем со stale closure без добавления зависимостей.'
        },
        {
          type: 'heading',
          value: 'useEffect Infinite Loop (Бесконечный цикл useEffect)'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Плохо:\nfunction UserProfile({ userId }) {\n  const [user, setUser] = useState(null);\n  useEffect(() => {\n    fetchUser(userId).then(data => setUser(data));\n  }); // нет массива зависимостей!\n  // Рендер -> useEffect -> setUser -> рендер -> useEffect -> ...'
        },
        {
          type: 'warning',
          value: 'useEffect без массива зависимостей запускается после каждого рендера. Если внутри обновляется стейт — это вызывает новый рендер, что запускает новый эффект — бесконечный цикл.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Хорошо — правильные зависимости:\nfunction UserProfile({ userId }) {\n  const [user, setUser] = useState(null);\n\n  useEffect(() => {\n    fetchUser(userId).then(data => setUser(data));\n  }, [userId]); // запускать только при изменении userId\n\n  // Для загрузки один раз при монтировании:\n  useEffect(() => {\n    fetchConfig().then(setConfig);\n  }, []); // пустой массив = один раз'
        },
        {
          type: 'tip',
          value: 'Правила useEffect: [] — один раз при монтировании; [dep1, dep2] — при изменении зависимостей; без аргумента — каждый рендер (редко нужно). Правило: все переменные из тела эффекта должны быть в массиве зависимостей.'
        },
        {
          type: 'heading',
          value: 'Prop Drilling (Пробрасывание пропсов)'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Плохо — пропс проходит через 4 уровня компонентов:\nfunction App() {\n  const [user, setUser] = useState(null);\n  return <Layout user={user} />;\n}\nfunction Layout({ user }) {\n  return <Header user={user} />;\n}\nfunction Header({ user }) {\n  return <UserMenu user={user} />; // только здесь user нужен!\n}'
        },
        {
          type: 'warning',
          value: 'Prop drilling — передача данных через промежуточные компоненты, которым они не нужны. Делает код хрупким: нужно обновлять сигнатуры всех промежуточных компонентов при изменении данных.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Хорошо — React Context:\nconst UserContext = createContext(null);\n\nfunction App() {\n  const [user, setUser] = useState(null);\n  return (\n    <UserContext.Provider value={user}>\n      <Layout /> {/* не передаём user через пропсы */}\n    </UserContext.Provider>\n  );\n}\n\nfunction UserMenu() {\n  const user = useContext(UserContext); // берём напрямую из контекста\n  return <div>{user?.name}</div>;\n}'
        },
        {
          type: 'tip',
          value: 'Context подходит для: темы, локализации, аутентифицированного пользователя, настроек. Для сложного глобального состояния используй Zustand или Redux Toolkit. Context + useReducer — хорошая альтернатива Redux для средних приложений.'
        }
      ]
    },
    {
      id: 8,
      type: 'theory',
      title: 'API: Частые ошибки',
      content: [
        {
          type: 'heading',
          value: '401 vs 403: Путаница статусов'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Плохо — неправильный статус:\napp.get("/admin", (req, res) => {\n  if (!req.user) {\n    return res.status(403).send("Нет доступа"); // неправильно!\n  }\n  if (req.user.role !== "admin") {\n    return res.status(401).send("Нет прав"); // тоже неправильно!\n  }\n});'
        },
        {
          type: 'warning',
          value: '401 Unauthorized — пользователь НЕ аутентифицирован (не вошёл в систему). 403 Forbidden — пользователь аутентифицирован, но НЕ имеет прав. Путаница мешает клиенту правильно обработать ответ.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Хорошо:\napp.get("/admin", (req, res) => {\n  if (!req.user) {\n    // Не аутентифицирован — 401\n    return res.status(401).json({ error: "Требуется авторизация" });\n  }\n  if (req.user.role !== "admin") {\n    // Аутентифицирован, но нет прав — 403\n    return res.status(403).json({ error: "Недостаточно прав" });\n  }\n  res.json({ adminData: "..." });\n});'
        },
        {
          type: 'tip',
          value: 'Запомни: 401 = "Войди, потом посмотрим". 403 = "Ты вошёл, но тебе нельзя". Клиент на 401 должен перенаправить на страницу входа; на 403 — показать сообщение об ошибке прав доступа.'
        },
        {
          type: 'heading',
          value: 'CORS Preflight (Предварительный запрос)'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Плохо — сервер не обрабатывает OPTIONS запрос:\napp.post("/api/data", (req, res) => res.json({ ok: true }));\n// Браузер сначала шлёт OPTIONS /api/data (preflight)\n// Сервер отвечает 404 -> CORS ошибка в браузере!'
        },
        {
          type: 'warning',
          value: 'Для "сложных" запросов (POST с JSON, заголовки Authorization) браузер сначала делает preflight OPTIONS запрос для проверки CORS политики. Если сервер не отвечает на OPTIONS — запрос блокируется.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Хорошо — обработать preflight:\napp.use(cors({\n  origin: ["https://myapp.com", "http://localhost:3000"],\n  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],\n  allowedHeaders: ["Content-Type", "Authorization"],\n  credentials: true  // если используются cookies\n}));\n// cors middleware автоматически отвечает на OPTIONS запросы\napp.options("*", cors()); // разрешить preflight для всех маршрутов'
        },
        {
          type: 'tip',
          value: 'Preflight срабатывает для: POST/PUT/DELETE с Content-Type: application/json, заголовки Authorization, любые кастомные заголовки. Убедись что cors middleware добавлен до маршрутов и обрабатывает OPTIONS.'
        },
        {
          type: 'heading',
          value: 'Rate Limiting (Ограничение частоты запросов)'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Плохо — API без rate limiting:\napp.post("/api/login", async (req, res) => {\n  const user = await authenticate(req.body);\n  res.json(user);\n  // Злоумышленник может отправить 10000 запросов в секунду (brute force!)\n})'
        },
        {
          type: 'warning',
          value: 'Без ограничения частоты запросов API уязвим к: brute-force атакам на пароли, DDoS-атакам, злоупотреблению ресурсами. Это также создаёт неравные условия для пользователей.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: 'const rateLimit = require("express-rate-limit");\n\n// Строгий лимит для чувствительных эндпоинтов:\nconst loginLimiter = rateLimit({\n  windowMs: 15 * 60 * 1000, // 15 минут\n  max: 10,                   // максимум 10 попыток\n  message: { error: "Слишком много попыток, подождите 15 минут" }\n});\napp.post("/api/login", loginLimiter, loginHandler);\n\n// Общий лимит для всего API:\napp.use(rateLimit({ windowMs: 60000, max: 100 }));'
        },
        {
          type: 'tip',
          value: 'Используй разные лимиты для разных эндпоинтов: /login — очень строгий (5-10 запросов/15 мин), поиск — умеренный (30/мин), чтение данных — мягкий (100/мин). В production используй Redis для хранения счётчиков между серверами.'
        },
        {
          type: 'heading',
          value: 'Timeout (Таймаут запроса)'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Плохо — нет таймаута:\nconst data = await fetch("https://slow-api.com/data");\n// Запрос висит вечно, блокирует другие операции!\n\n// Или сервер не отвечает клиенту вовремя:\napp.get("/heavy", async (req, res) => {\n  const result = await heavyComputation(); // висит 60 секунд...\n  res.json(result); // клиент уже закрыл соединение\n});'
        },
        {
          type: 'warning',
          value: 'Зависший запрос блокирует ресурсы (соединения, память). Клиент ждёт ответа бесконечно. На сервере — утечка соединений. Хорошая практика: всегда устанавливать таймаут.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Хорошо — AbortController для fetch:\nconst controller = new AbortController();\nconst timeout = setTimeout(() => controller.abort(), 5000); // 5 сек\ntry {\n  const response = await fetch(url, { signal: controller.signal });\n  const data = await response.json();\n} catch (e) {\n  if (e.name === "AbortError") console.log("Таймаут!");\n} finally {\n  clearTimeout(timeout);\n}\n\n// В Express — отвечай при таймауте:\nres.setTimeout(5000, () => res.status(503).json({ error: "Таймаут" }));'
        },
        {
          type: 'tip',
          value: 'Устанавливай таймауты на всех уровнях: HTTP клиент (fetch/axios), сервер, база данных. Для длинных операций используй фоновые задачи (очереди): запрос сразу возвращает taskId, результат получают позже через polling или webhook.'
        },
        {
          type: 'heading',
          value: 'Payload Too Large (Слишком большое тело запроса)'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Плохо:\n// Пользователь загружает файл 50MB через JSON:\n{\n  "file": "base64encodedstring...50MB..."\n}\n// Error: PayloadTooLargeError: request entity too large\n// Или сервер принимает любой размер -> уязвимость!'
        },
        {
          type: 'warning',
          value: 'По умолчанию Express ограничивает тело запроса до ~100KB. Передача больших файлов через JSON body неэффективна. Без лимита сервер уязвим к атакам через огромные запросы.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Хорошо — настроить лимиты и использовать multipart для файлов:\napp.use(express.json({ limit: "1mb" })); // лимит для JSON\napp.use(express.urlencoded({ limit: "1mb" }));\n\n// Для файлов — multipart/form-data через multer:\nconst multer = require("multer");\nconst upload = multer({\n  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB\n  dest: "/tmp/uploads"\n});\napp.post("/upload", upload.single("file"), (req, res) => {\n  res.json({ path: req.file.path });\n});'
        },
        {
          type: 'tip',
          value: 'Для загрузки файлов всегда используй multipart/form-data, а не Base64 в JSON — это в 1.3 раза меньше по размеру. Крупные файлы загружай напрямую в S3/GCS через presigned URL, минуя сервер приложения.'
        }
      ]
    },
    {
      id: 9,
      type: 'theory',
      title: 'Ошибки новичков',
      content: [
        {
          type: 'heading',
          value: 'Не читать сообщения об ошибках'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Типичная ситуация:\n# TypeError: Cannot read properties of undefined (reading "map")\n#   at App.js:15:23\n#   at processChild (react-dom.js:3991)\n# Новичок: "Всё сломалось! Непонятно что происходит..."'
        },
        {
          type: 'warning',
          value: 'Сообщение об ошибке содержит: тип ошибки, описание, файл и строку. Игнорирование ошибок — самая дорогостоящая привычка. Разработчики, умеющие читать ошибки, решают задачи в 5-10 раз быстрее.'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Хорошо — алгоритм чтения ошибки:\n# 1. Прочитай тип: TypeError\n# 2. Прочитай описание: "Cannot read properties of undefined"\n#    -> Что-то undefined, у него вызывают .map()\n# 3. Найди строку: App.js:15 -> смотришь строку 15\n# 4. Гуглишь точный текст ошибки если не ясно\n# 5. Исправляешь'
        },
        {
          type: 'tip',
          value: 'Читай ошибку сверху вниз: первая строка — суть проблемы, стектрейс — где произошло. В браузере кликай на ссылки в консоли — они ведут прямо на строку с ошибкой. Копируй точный текст ошибки в Google.'
        },
        {
          type: 'heading',
          value: 'Копировать код без понимания'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Типичная ситуация: скопировал с Stack Overflow\nasync function getData() {\n  const response = await fetch(url);\n  const data = await response.json();\n  return data;\n}\n// "Работает, но не понимаю почему! И что такое async/await?"\n// При малейшем изменении условий — не могу адаптировать'
        },
        {
          type: 'warning',
          value: 'Скопированный непонятый код работает случайно. При первом же изменении требований ты беспомощен. Это технический долг в твоей голове: долг знаний накапливается и тормозит развитие.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Хорошо — разобраться перед копированием:\n// 1. Что делает каждая строка?\nasync function getData() {\n  // async -> функция возвращает Promise\n  const response = await fetch(url);\n  // fetch -> HTTP запрос, await -> ждём ответа\n  const data = await response.json();\n  // .json() -> парсим тело ответа как JSON, тоже async!\n  return data;\n}\n// 2. Попробуй написать похожее сам\n// 3. Объясни коду другу (rubber duck debugging)'
        },
        {
          type: 'tip',
          value: 'Правило "объясни резиновой уточке": объясни код воображаемому слушателю. Если не можешь объяснить — не понял. ChatGPT и Copilot — инструменты, не замена пониманию. Разбирай каждую непонятную строку.'
        },
        {
          type: 'heading',
          value: 'Не использовать Git'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Типичная ситуация без Git:\n# project/\n#   main.py\n#   main_backup.py\n#   main_final.py\n#   main_final2.py\n#   main_WORKING.py\n#   main_v2.py  <- что же здесь рабочее?!'
        },
        {
          type: 'warning',
          value: 'Без Git: нет истории изменений, нет возможности откатиться, нет командной работы. "Ручной" контроль версий через копирование файлов — антипаттерн, который ломается при первой сложности.'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Хорошо — минимальный рабочий Git-воркфлоу:\ngit init\ngit add .\ngit commit -m "initial commit"\n\n# Для каждой новой фичи:\ngit checkout -b feature/login\n# ... работаешь ...\ngit add src/auth.js\ngit commit -m "feat: add JWT authentication"\ngit push origin feature/login\ngit checkout main\ngit merge feature/login'
        },
        {
          type: 'tip',
          value: 'Git нужен даже для одиночных проектов — это машина времени для кода. Делай маленькие частые коммиты с понятными сообщениями. Первое, что делаешь в новом проекте: git init.'
        },
        {
          type: 'heading',
          value: 'Не писать тесты'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Типичная ситуация:\nfunction calculateDiscount(price, discount) {\n  return price - (price * discount);\n}\n// "Выглядит правильно, запустил — работает. Зачем тесты?"\n// Через 3 месяца: исправил баг в другом месте\n// calculateDiscount(-100, 1.5) -> неожиданный результат\n// Никто не знает почему всё сломалось'
        },
        {
          type: 'warning',
          value: 'Без тестов: страшно рефакторить (вдруг сломаешь что-то), баги в edge cases обнаруживаются в production, нет уверенности что изменения ничего не сломали. Тесты — это документация поведения кода.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Хорошо — начни с простых unit тестов:\ndescribe("calculateDiscount", () => {\n  test("применяет скидку 20%", () => {\n    expect(calculateDiscount(100, 0.2)).toBe(80);\n  });\n  test("нулевая скидка возвращает полную цену", () => {\n    expect(calculateDiscount(100, 0)).toBe(100);\n  });\n  test("отрицательная цена — ошибка", () => {\n    expect(() => calculateDiscount(-100, 0.2)).toThrow();\n  });\n});'
        },
        {
          type: 'tip',
          value: 'Начни с тестирования бизнес-логики — функций без зависимостей. Правило: тест должен провалиться до написания кода, и пройти после (TDD). Даже 30% покрытие лучше, чем 0%. Инструменты: Jest (JS), pytest (Python), JUnit (Java).'
        },
        {
          type: 'heading',
          value: 'Не задавать вопросы'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Типичная ситуация:\n# Задача не понята, но новичок молчит\n# Тратит 8 часов на реализацию "не того"\n# На ревью: "Это не то что я просил"\n\n# Или: застрял на проблеме\n# Сидит 4 часа в гордом одиночестве\n# Не спрашивает коллег / ментора'
        },
        {
          type: 'warning',
          value: 'Страх "выглядеть глупым" стоит очень дорого: потраченные часы на неправильное решение, одинокие битвы с проблемами, медленный рост. Все senior-разработчики задают вопросы каждый день.'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Хорошо — алгоритм "умного" вопроса:\n# 1. Попробуй сам 30-60 минут\n# 2. Сформулируй: "Я пытаюсь сделать X. Ожидаю Y. Получаю Z."\n# 3. Покажи что уже пробовал\n# 4. Спроси конкретно: "Где я ошибаюсь?"\n\n# Шаблон вопроса в чат:\n# "Пытаюсь авторизовать пользователя через JWT.\n# Ожидаю: 200 OK с токеном.\n# Получаю: 401. Вот мой код: [код]\n# Уже пробовал: [что пробовал]. Где ошибка?"'
        },
        {
          type: 'tip',
          value: 'Правило 30 минут: если не решил за 30 минут — спроси. Хороший вопрос = описание проблемы + что ожидал + что получил + что уже пробовал. Задавать вопросы — признак профессионализма, не слабости.'
        }
      ]
    },
    {
      id: 10,
      type: 'theory',
      title: 'Ошибки на собеседованиях',
      content: [
        {
          type: 'heading',
          value: 'Не уточнять требования задачи'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Плохо:\n# Интервьюер: "Напиши функцию поиска элемента в массиве"\n# Кандидат: [сразу начинает писать линейный поиск]\n# Интервьюер: "А я имел в виду отсортированный массив..."\n# Потрачено 10 минут на неправильное решение'
        },
        {
          type: 'warning',
          value: 'Сразу писать код без уточнений — грубая ошибка. Задача может быть намеренно расплывчатой. Интервьюер оценивает умение задавать правильные вопросы так же, как умение кодить.'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Хорошо — сначала уточнить:\n# "Прежде чем начать, можно задам несколько вопросов?\n# 1. Массив отсортирован?\n# 2. Могут ли быть дубликаты? Возвращать первый или все?\n# 3. Что возвращать если элемент не найден? (-1 или null?)\n# 4. Какой ожидаемый размер массива?\n# 5. Нужна ли оптимизация по памяти или по скорости?"\n# После уточнений: "Тогда предлагаю бинарный поиск O(log n)..."'
        },
        {
          type: 'tip',
          value: 'Потрать 3-5 минут на уточнение требований — это экономит 20 минут на неправильном решении. Спроси про: входные ограничения, edge cases, ожидаемое поведение при ошибках, приоритеты (скорость vs память).'
        },
        {
          type: 'heading',
          value: 'Молчать при решении задачи'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Плохо:\n# Интервьюер дал задачу\n# Кандидат 15 минут молча смотрит в экран\n# Никто не знает о чём он думает\n# Если застрял — никто не может помочь'
        },
        {
          type: 'warning',
          value: 'На технических собеседованиях интервьюер оценивает ход мысли, а не только финальный результат. Молчание лишает его возможности оценить твоё мышление и подсказать если ты пошёл не туда.'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Хорошо — думай вслух:\n# "Окей, нам дан массив чисел. Мне нужно найти сумму.\n# Первая мысль — цикл for, O(n). Подойдёт?\n# Мне приходит в голову reduce — он делает то же самое.\n# Давай попробую reduce. Напишу так:\nconst sum = arr.reduce((acc, curr) => acc + curr, 0);\n# Начальное значение 0, потому что если массив пустой,\n# нам нужно вернуть 0, а не undefined.\n# Сложность: O(n) по времени, O(1) по памяти."\n# Интервьюер всё слышит -> может направить если что-то не так'
        },
        {
          type: 'tip',
          value: 'Техника "думай вслух": проговаривай каждый шаг, объясняй выбор структуры данных, называй сложность. Если застрял — скажи "я думаю" и продолжай рассуждать. Это лучше чем пауза.'
        },
        {
          type: 'heading',
          value: 'Не тестировать Edge Cases'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Плохо — написал решение и остановился:\nfunction divide(a, b) {\n  return a / b;\n}\n// Интервьюер: "А что если b = 0?"\n// Кандидат: "Ой..." -> Infinity в JS, или исключение в Java\n// Интервьюер: "А если a и b оба 0?"\n// Кандидат: "Ой ой..."'
        },
        {
          type: 'warning',
          value: 'Написать решение для "обычного" случая и не проверить граничные — значит сдать незаконченную работу. Интервьюеры специально ищут кандидатов, которые сами думают об edge cases.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Хорошо — тестировать edge cases самостоятельно:\nfunction divide(a, b) {\n  if (b === 0) throw new Error("Деление на ноль");\n  return a / b;\n}\n\n// Проговори вслух после написания:\n// "Давай проверю edge cases:\n// divide(10, 2) = 5 - OK\n// divide(0, 5) = 0 - OK\n// divide(5, 0) - должна быть ошибка - обработал\n// divide(-10, 2) = -5 - OK\n// divide(1.5, 0.5) = 3 - OK для чисел с плавающей точкой"'
        },
        {
          type: 'tip',
          value: 'После написания решения всегда проговаривай тест-кейсы: нормальный случай, пустой ввод (null, [], ""), граничные значения (0, -1, MAX_INT), дубликаты, один элемент. Это показывает зрелость инженерного мышления.'
        },
        {
          type: 'heading',
          value: 'Паниковать при незнании'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Плохо:\n# Интервьюер: "Объясни разницу между процессом и потоком"\n# Кандидат: "Я не знаю... наверное я не подхожу..."\n# [молчание]\n# [видимая паника]'
        },
        {
          type: 'warning',
          value: 'Признание незнания с паникой хуже самого незнания. Интервьюер видит, как ты ведёшь себя под давлением — ведь в работе тоже будут сложные задачи. Спокойствие и методичное рассуждение ценятся выше готового ответа.'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Хорошо — честность + рассуждение:\n# "Честно говоря, точное определение сейчас не помню.\n# Но по логике: оба это единицы выполнения кода.\n# Процесс — изолированная программа со своей памятью.\n# Поток — часть процесса, разделяет память с другими потоками.\n# Поэтому между потоками общение проще, но и синхронизация сложнее.\n# Это верно?"\n# Интервьюер видит: ты умеешь рассуждать, не паникуешь, честен.'
        },
        {
          type: 'tip',
          value: 'Формула: "Точного определения сейчас не помню, но могу рассуждать: [логика + что знаешь связанного]. Правильно ли я понимаю направление?" Это лучше молчания или выдуманного ответа.'
        },
        {
          type: 'heading',
          value: 'Не задавать вопросы интервьюеру'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Плохо:\n# В конце: "У вас есть вопросы к нам?"\n# Кандидат: "Нет, всё понятно"\n# или: "Когда я узнаю результат?"\n\n# Такой ответ говорит: кандидат не думает глубоко\n# о компании/команде/роли, или ему всё равно'
        },
        {
          type: 'warning',
          value: 'Отсутствие вопросов в конце — упущенная возможность. Во-первых, ты демонстрируешь интерес и вдумчивость. Во-вторых, ты сам выбираешь работу — собеседование взаимно.'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Хорошо — подготовить вопросы заранее:\n# Про команду:\n# "Как выглядит типичный sprint в вашей команде?"\n# "Как часто делаете code review?"\n\n# Про технологии:\n# "Какой стек вы используете и почему именно он?"\n# "Как организован процесс деплоя?"\n\n# Про рост:\n# "Как выглядит путь от junior к middle в вашей компании?"\n# "Есть ли время на обучение и personal development?"\n\n# Про продукт:\n# "Каков самый большой технический вызов сейчас?"'
        },
        {
          type: 'tip',
          value: 'Готовь 5-7 вопросов, часть из них задашь (часть отпадёт по ходу разговора). Вопросы должны показывать: ты думал о роли, тебе важна культура команды, ты намерен расти. Избегай вопросов о зарплате и отпуске на первом интервью.'
        }
      ]
    }
  ]
};
