export default {
  id: 4,
  title: 'Операторы сравнения',
  description: 'Операторы == и ===, тернарный оператор, nullish coalescing и optional chaining',
  lessons: [
    {
      id: 1,
      title: 'Строгое и нестрогое равенство',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: '== (нестрогое) приводит типы перед сравнением. === (строгое) сравнивает значение И тип без приведения. Всегда используйте ===.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Нестрогое == (с coercion)\nconsole.log(1 == "1");         // true (строка -> число)\nconsole.log(0 == false);       // true (false -> 0)\nconsole.log("" == false);      // true (оба -> 0)\nconsole.log(null == undefined); // true (особый случай)\nconsole.log(null == 0);         // false\nconsole.log(null == "");        // false\nconsole.log([] == false);       // true ([] -> "" -> 0)\nconsole.log([] == ![]);         // true (оба -> 0)\n\n// Строгое === (без coercion)\nconsole.log(1 === "1");         // false\nconsole.log(0 === false);       // false\nconsole.log(null === undefined); // false\n\n// Для объектов оба оператора сравнивают ссылки\nconst a = {};\nconst b = {};\nconsole.log(a == b);  // false\nconsole.log(a === b); // false\nconsole.log(a === a); // true\n\n// NaN — единственное значение не равное самому себе\nconsole.log(NaN === NaN); // false!\nconsole.log(NaN == NaN);  // false!\nconsole.log(Number.isNaN(NaN)); // true — правильная проверка\nconsole.log(Object.is(NaN, NaN)); // true — полное равенство'
        },
        {
          type: 'heading',
          value: 'Операторы сравнения'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// > < >= <= — приводят строки к числам\nconsole.log("10" > 5);   // true (строка -> число)\nconsole.log("2" > "10"); // true! (строковое сравнение: "2" > "1")\nconsole.log(2 > "1");    // true (смешанное -> числа)\n\n// Object.is — полное равенство (отличается от === для NaN и -0)\nconsole.log(Object.is(NaN, NaN)); // true (=== даёт false)\nconsole.log(Object.is(0, -0));    // false (=== даёт true)\nconsole.log(Object.is(1, 1));     // true'
        },
        {
          type: 'warning',
          value: 'Сравнение строк лексикографическое: "2" > "10" это true! Всегда конвертируйте в числа при числовом сравнении: Number("2") > Number("10") = false.'
        }
      ]
    },
    {
      id: 2,
      title: 'Тернарный оператор',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Тернарный оператор condition ? valueIfTrue : valueIfFalse — краткая форма if/else для выражений.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Базовый синтаксис\nconst age = 20;\nconst status = age >= 18 ? "взрослый" : "ребёнок";\nconsole.log(status); // "взрослый"\n\n// Вместо if/else при присваивании\nconst score = 75;\nlet grade;\nif (score >= 90) grade = "A";\nelse if (score >= 80) grade = "B";\nelse if (score >= 70) grade = "C";\nelse grade = "F";\n\n// Вложенный тернарный (осторожно с читаемостью!)\nconst gradeT = score >= 90 ? "A"\n             : score >= 80 ? "B"\n             : score >= 70 ? "C"\n             : "F";\nconsole.log(grade, gradeT); // "C" "C"\n\n// В JSX и шаблонах\nconst isLoggedIn = true;\nconst greeting = `Добро пожаловать, ${isLoggedIn ? "пользователь" : "гость"}!`;\n\n// НЕ используйте для побочных эффектов\n// Плохо:\nisLoggedIn ? console.log("logged") : console.log("guest");\n// Хорошо:\nif (isLoggedIn) console.log("logged");\nelse console.log("guest");'
        },
        {
          type: 'tip',
          value: 'Тернарный оператор подходит для выбора значения. Для выполнения действий (side effects) используйте if/else — это читаемее.'
        }
      ]
    },
    {
      id: 3,
      title: 'Nullish Coalescing и Optional Chaining',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'ES2020 добавил два оператора: ?? (nullish coalescing) для значений по умолчанию и ?. (optional chaining) для безопасного доступа к свойствам.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// ?? — nullish coalescing\n// Возвращает правый операнд если левый null или undefined\nconsole.log(null ?? "default");      // "default"\nconsole.log(undefined ?? "default"); // "default"\nconsole.log(0 ?? "default");         // 0 (не null/undefined!)\nconsole.log("" ?? "default");        // "" (не null/undefined!)\nconsole.log(false ?? "default");     // false (не null/undefined!)\n\n// || возвращает правый при ЛЮБОМ ложном значении\nconsole.log(0 || "default");         // "default"\nconsole.log("" || "default");        // "default"\nconsole.log(false || "default");     // "default"\n\n// Когда использовать ?? vs ||\n// count может быть 0, это валидное значение:\nconst count = 0;\nconsole.log(count ?? 10); // 0 — правильно!\nconsole.log(count || 10); // 10 — неправильно для счётчика!\n\n// ??= — присваивание с nullish\nlet config = { port: null };\nconfig.port ??= 3000; // если null -> 3000\nconsole.log(config.port); // 3000\n\n// Optional chaining ?.\nconst user = { address: { city: "Moscow" } };\nconsole.log(user?.address?.city);  // "Moscow"\nconsole.log(user?.phone?.number);  // undefined (не ошибка!)\n\nconst users = null;\nconsole.log(users?.[0]?.name);     // undefined\n\n// ?. с методами\nconst str = null;\nconsole.log(str?.toUpperCase());   // undefined\n\nconst arr = null;\nconsole.log(arr?.map(x => x * 2)); // undefined'
        },
        {
          type: 'note',
          value: '?. и ?? решают разные задачи. ?. для безопасного доступа когда объект может не существовать. ?? для значений по умолчанию когда значение может быть null/undefined.'
        }
      ]
    },
    {
      id: 4,
      title: 'Логические операторы и их особенности',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: '&&, || возвращают не boolean, а одно из своих операндов. Это важное свойство используется для коротких записей условий.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// && возвращает первый ложный или последний значение\nconsole.log(1 && 2 && 3);   // 3 (все truthy -> последний)\nconsole.log(1 && 0 && 3);   // 0 (первый falsy)\nconsole.log(false && "hi"); // false\nconsole.log("" && "hi");    // ""\n\n// || возвращает первый истинный или последний\nconsole.log(0 || "" || 42); // 42 (первый truthy)\nconsole.log(0 || false);    // false (все falsy -> последний)\nconsole.log(1 || "hi");     // 1\n\n// Паттерны\nconst name = "" || "Гость"; // "Гость" (пустая строка ложная)\nconst port = process?.env?.PORT || 3000; // значение по умолчанию\n\n// && для условного выполнения\nconst isAdmin = true;\nisAdmin && console.log("Привет, admin!"); // выводит\n\n// В JSX:\n// {isLoggedIn && <Dashboard />} — рендер если true\n\n// Цепочки логических операторов\nfunction validateUser(user) {\n  return user\n    && user.name\n    && user.age >= 18\n    && user.email.includes("@");\n}\n\nconsole.log(validateUser({ name: "Alice", age: 20, email: "a@b.com" })); // true\nconsole.log(validateUser(null)); // null (falsy)'
        },
        {
          type: 'tip',
          value: '&& для "выполнить если условие истинно". || для "значение по умолчанию" (но помните про 0, "" которые тоже ложные). ?? для "значение по умолчанию только если null/undefined".'
        }
      ]
    },
    {
      id: 5,
      title: 'Операторы сравнения: практика',
      type: 'practice',
      difficulty: 'easy',
      description: 'Предскажите результаты и реализуйте утилиты для сравнения.',
      requirements: [
        'Реализуйте функцию isNullish(value) — возвращает true для null и undefined',
        'Реализуйте функцию getOrDefault(value, defaultValue) — возвращает defaultValue если value null/undefined',
        'Реализуйте функцию safeProp(obj, path, defaultValue) — безопасный доступ по пути "a.b.c"',
        'safeProp({a:{b:1}}, "a.b") -> 1\nsafeProp({a:{b:1}}, "a.c.d") -> defaultValue\nsafeProp(null, "a") -> defaultValue'
      ],
      expectedOutput: 'isNullish(null) -> true\nisNullish(0) -> false\ngetOrDefault(0, 10) -> 0\ngetOrDefault(null, 10) -> 10\nsafeProp({a:{b:1}}, "a.b") -> 1\nsafeProp({}, "a.b", "default") -> "default"',
      hint: 'isNullish: value === null || value === undefined\ngetOrDefault: использует ?? оператор\nsafeProp: path.split(".").reduce((acc, key) => acc?.[key], obj) ?? defaultValue',
      solution: 'function isNullish(value) {\n  return value === null || value === undefined;\n}\n\nfunction getOrDefault(value, defaultValue) {\n  return value ?? defaultValue;\n}\n\nfunction safeProp(obj, path, defaultValue = undefined) {\n  const result = path\n    .split(".")\n    .reduce((acc, key) => acc?.[key], obj);\n  return result ?? defaultValue;\n}\n\n// Тесты isNullish\nconsole.log(isNullish(null));      // true\nconsole.log(isNullish(undefined)); // true\nconsole.log(isNullish(0));         // false\nconsole.log(isNullish(""));        // false\nconsole.log(isNullish(false));     // false\n\n// Тесты getOrDefault\nconsole.log(getOrDefault(0, 10));        // 0\nconsole.log(getOrDefault("", "default")); // ""\nconsole.log(getOrDefault(null, 10));      // 10\nconsole.log(getOrDefault(undefined, 10)); // 10\n\n// Тесты safeProp\nconst config = { db: { host: "localhost", port: 5432 }, app: { name: "MyApp" } };\nconsole.log(safeProp(config, "db.host"));         // "localhost"\nconsole.log(safeProp(config, "db.port"));         // 5432\nconsole.log(safeProp(config, "db.password", "")); // ""\nconsole.log(safeProp(config, "cache.host", "localhost")); // "localhost"\nconsole.log(safeProp(null, "a.b", "default"));     // "default"',
      explanation: 'isNullish проверяет точно null || undefined, в отличие от !value. getOrDefault использует ?? — он вернёт 0, "", false (ложные но не nullish значения). safeProp через reduce с optional chaining — элегантная реализация "safe property access". Это аналог lodash _.get(). reduce идёт по частям пути, ?. возвращает undefined если текущее значение nullish, что безопасно обрабатывается следующей итерацией.'
    },
    {
      id: 6,
      title: 'Тернарный оператор: практика',
      type: 'practice',
      difficulty: 'medium',
      description: 'Применяйте тернарный оператор и логические операторы в реальных ситуациях.',
      requirements: [
        'Реализуйте функцию getDiscount(age, isMember) — скидка для пенсионеров (>= 65) 30%, для членов клуба 20%, для остальных 0%',
        'Реализуйте функцию formatUserName(user) — "Имя Фамилия" или "Аноним" если данных нет',
        'Реализуйте функцию getPageTitle(route) — возвращает заголовок страницы по маршруту',
        'getPageTitle("/") -> "Главная"\ngetPageTitle("/about") -> "О нас"\ngetPageTitle("/unknown") -> "404 — Страница не найдена"'
      ],
      expectedOutput: 'getDiscount(70, false) -> 30\ngetDiscount(30, true) -> 20\ngetDiscount(30, false) -> 0\nformatUserName({first:"Alice"}) -> "Alice"\nformatUserName({first:"Alice",last:"Smith"}) -> "Alice Smith"\nformatUserName(null) -> "Аноним"',
      hint: 'getDiscount: age >= 65 ? 30 : isMember ? 20 : 0\nformatUserName: !user ? "Аноним" : [user.first, user.last].filter(Boolean).join(" ") || "Аноним"\ngetPageTitle: switch или объект-маппинг',
      solution: 'function getDiscount(age, isMember) {\n  return age >= 65 ? 30 : isMember ? 20 : 0;\n}\n\nfunction formatUserName(user) {\n  if (!user) return "Аноним";\n  const parts = [user.first, user.last].filter(Boolean);\n  return parts.length > 0 ? parts.join(" ") : "Аноним";\n}\n\nconst ROUTES = {\n  "/": "Главная",\n  "/about": "О нас",\n  "/contact": "Контакты",\n  "/products": "Продукты",\n  "/cart": "Корзина"\n};\n\nfunction getPageTitle(route) {\n  return ROUTES[route] ?? "404 — Страница не найдена";\n}\n\n// Тесты getDiscount\nconsole.log(getDiscount(70, false)); // 30\nconsole.log(getDiscount(70, true));  // 30 (старший приоритет)\nconsole.log(getDiscount(30, true));  // 20\nconsole.log(getDiscount(30, false)); // 0\n\n// Тесты formatUserName\nconsole.log(formatUserName(null));                        // "Аноним"\nconsole.log(formatUserName({}));                          // "Аноним"\nconsole.log(formatUserName({ first: "Alice" }));          // "Alice"\nconsole.log(formatUserName({ first: "Alice", last: "Smith" })); // "Alice Smith"\nconsole.log(formatUserName({ last: "Johnson" }));         // "Johnson"\n\n// Тесты getPageTitle\nconsole.log(getPageTitle("/"));         // "Главная"\nconsole.log(getPageTitle("/about"));    // "О нас"\nconsole.log(getPageTitle("/unknown"));  // "404 — Страница не найдена"',
      explanation: 'getDiscount использует вложенный тернарный оператор — читаемо для простых условий. formatUserName использует filter(Boolean) для фильтрации undefined/null/пустых строк, затем join. Объект-маппинг (ROUTES) вместо switch — более декларативный подход. ?? вместо || для значения по умолчанию — корректно если маршрут существует, но значение пустая строка.'
    }
  ]
};
