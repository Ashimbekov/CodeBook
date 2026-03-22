export default {
  id: 30,
  title: 'Optional Chaining и Nullish Coalescing',
  description: 'Современные операторы ES2020+: ?. для безопасного доступа к свойствам, ?? для умолчаний, &&= ||= ??= логические операторы присваивания.',
  lessons: [
    {
      id: 1,
      title: 'Optional Chaining ?.',
      type: 'theory',
      content: [
        { type: 'text', value: 'Оператор ?. (optional chaining) позволяет безопасно обращаться к вложенным свойствам. Если значение null или undefined — возвращает undefined вместо ошибки TypeError.' },
        { type: 'code', language: 'javascript', value: 'const user = {\n  name: "Алия",\n  address: {\n    city: "Алматы",\n    zip: "050000"\n  },\n  getFullName() {\n    return this.name;\n  }\n};\n\n// Без ?. — нужны проверки\nconst city1 = user && user.address && user.address.city;\n\n// С ?. — элегантно!\nconst city2 = user?.address?.city;\nconsole.log(city2); // "Алматы"\n\n// Если что-то null/undefined — возвращает undefined\nconst userNull = null;\nconsole.log(userNull?.address?.city); // undefined (не TypeError!)\n\nconst noAddress = { name: "Берик" };\nconsole.log(noAddress?.address?.city); // undefined\n\n// ?. с методами\nconsole.log(user?.getFullName()); // "Алия"\nconsole.log(userNull?.getFullName()); // undefined (не вызвалось)\n\n// ?. с индексами массива\nconst arr = null;\nconsole.log(arr?.[0]); // undefined\nconsole.log([1, 2, 3]?.[1]); // 2' },
        { type: 'tip', value: '?. останавливает вычисление сразу при null/undefined. user?.address?.city?.toUpperCase() — если city undefined, toUpperCase() не вызовется. Это "короткое замыкание".' }
      ]
    },
    {
      id: 2,
      title: 'Optional Chaining с вызовами функций',
      type: 'theory',
      content: [
        { type: 'text', value: '?.() позволяет безопасно вызвать функцию — только если она существует. Удобно для опциональных callback-параметров.' },
        { type: 'code', language: 'javascript', value: '// ?.() — вызов если функция существует\nconst obj = {\n  greet() { return "Привет!"; }\n};\n\nconsole.log(obj.greet?.());    // "Привет!"\nconsole.log(obj.farewell?.()); // undefined (нет метода, не ошибка)\n\n// Практика: опциональные callbacks\nfunction processData(data, { onSuccess, onError } = {}) {\n  try {\n    const result = transform(data);\n    onSuccess?.(result);  // вызовем если передан\n  } catch (err) {\n    onError?.(err);  // вызовем если передан\n  }\n}\n\nprocessData(data); // без callback — не ошибка\nprocessData(data, {\n  onSuccess: (r) => console.log("Готово:", r),\n  onError:   (e) => console.error("Ошибка:", e)\n});\n\n// ?. с динамическими ключами\nconst key = "name";\nconst user = { name: "Алия" };\nconsole.log(user?.[key]); // "Алия"\n\nconst nullUser = null;\nconsole.log(nullUser?.[key]); // undefined' },
        { type: 'code', language: 'javascript', value: '// Частые паттерны с ?.\n\n// 1. Доступ к данным API\nasync function getUserCity(userId) {\n  const response = await fetch(`/api/users/${userId}`);\n  const data = await response.json();\n  return data?.user?.profile?.address?.city ?? "Неизвестно";\n}\n\n// 2. DOM операции\nconst btn = document.getElementById("submit");\nbtn?.addEventListener("click", handleSubmit);\nbtn?.classList.add("active");\n\n// 3. Конфигурация с умолчаниями\nfunction init(config) {\n  const timeout = config?.network?.timeout ?? 5000;\n  const retries = config?.network?.retries ?? 3;\n  const debug   = config?.debug ?? false;\n  return { timeout, retries, debug };\n}\n\nconsole.log(init(null));                           // умолчания\nconsole.log(init({ network: { timeout: 10000 } })); // timeout: 10000' },
        { type: 'note', value: 'Не злоупотребляй ?. везде. Если свойство ДОЛЖНО существовать (баг если нет) — лучше пусть будет TypeError. ?. используй только там, где отсутствие значения — нормальный сценарий.' }
      ]
    },
    {
      id: 3,
      title: 'Nullish Coalescing ?? и ||',
      type: 'theory',
      content: [
        { type: 'text', value: '?? (nullish coalescing) возвращает правый операнд если левый null или undefined. || возвращает правый если левый ЛЮБОЕ ложное значение (0, "", false, NaN). Разница важна!' },
        { type: 'code', language: 'javascript', value: '// || vs ?? — критическая разница!\n\n// || — ложные значения (falsy): 0, "", false, null, undefined, NaN\nconsole.log(0   || "умолчание");  // "умолчание" (0 falsy!)\nconsole.log(""  || "умолчание");  // "умолчание" ("" falsy!)\nconsole.log(false || "умолчание"); // "умолчание" (false falsy!)\n\n// ?? — только null/undefined\nconsole.log(0   ?? "умолчание");  // 0 (0 не null/undefined!)\nconsole.log(""  ?? "умолчание");  // "" ("" не null/undefined!)\nconsole.log(false ?? "умолчание"); // false\nconsole.log(null ?? "умолчание");  // "умолчание"\nconsole.log(undefined ?? "умолч"); // "умолчание"\n\n// Реальная проблема с ||:\nfunction setVolume(vol) {\n  const volume = vol || 50; // ОШИБКА! vol=0 даст 50\n  console.log(volume);\n}\nsetVolume(0);   // 50 (неправильно! 0 тоже валидное значение)\nsetVolume(100); // 100\n\n// Правильно с ??:\nfunction setVolumeFixed(vol) {\n  const volume = vol ?? 50; // Только если vol null/undefined\n  console.log(volume);\n}\nsetVolumeFixed(0);         // 0 (правильно!)\nsetVolumeFixed(null);      // 50 (умолчание)' },
        { type: 'tip', value: 'Правило: ?? для умолчаний когда 0, "", false — валидные значения. || для умолчаний когда все ложные значения одинаково плохи. В 90% случаев ?? правильнее для конфигов/параметров.' }
      ]
    },
    {
      id: 4,
      title: 'Логические операторы присваивания',
      type: 'theory',
      content: [
        { type: 'text', value: 'ES2021 добавил три оператора: &&= (присвоить если truthy), ||= (присвоить если falsy), ??= (присвоить если nullish). Компактная запись распространённых паттернов.' },
        { type: 'code', language: 'javascript', value: '// &&= — присвоить только если левое truthy\nlet user = { name: "Алия" };\nuser.name &&= user.name.toUpperCase();\nconsole.log(user.name); // "АЛИЯ"\n\nlet nullUser = null;\nnullUser &&= "Значение"; // null && ... = null (правое не вычисляется)\nconsole.log(nullUser); // null\n\n// ||= — присвоить только если левое falsy\nlet username = "";\nusername ||= "Аноним";\nconsole.log(username); // "Аноним" ("" falsy)\n\nlet name = "Берик";\nname ||= "Аноним";\nconsole.log(name); // "Берик" (не пустая строка)\n\n// ??= — присвоить только если левое null/undefined\nlet config = {};\nconfig.timeout   ??= 5000;\nconfig.retries   ??= 3;\nconfig.debug     ??= false;\nconfig.timeout   ??= 9999; // уже установлено — не изменится!\n\nconsole.log(config); // { timeout: 5000, retries: 3, debug: false }' },
        { type: 'code', language: 'javascript', value: '// Практические применения\n\n// 1. Ленивая инициализация\nconst cache = {};\nfunction getOrCreate(key) {\n  cache[key] ??= new Map(); // создать если не существует\n  return cache[key];\n}\n\n// 2. Обновление объекта с умолчаниями\nfunction applyDefaults(obj) {\n  obj.lang     ??= "ru";\n  obj.theme    ??= "light";\n  obj.fontSize ??= 14;\n  return obj;\n}\n\napplyDefaults({ lang: "en" });\n// { lang: "en", theme: "light", fontSize: 14 }\n\n// 3. Накопление в массив\nfunction addToGroup(groups, key, value) {\n  groups[key] ??= []; // создать массив если нет\n  groups[key].push(value);\n}\n\nconst g = {};\naddToGroup(g, "A", 1);\naddToGroup(g, "A", 2);\naddToGroup(g, "B", 3);\nconsole.log(g); // { A: [1, 2], B: [3] }' },
        { type: 'note', value: '&&=, ||=, ??= — "короткое замыкание": правая часть вычисляется только когда нужно. a &&= fn() — fn() вызовется только если a truthy. Это важно для побочных эффектов.' }
      ]
    },
    {
      id: 5,
      title: 'Комбинирование операторов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Мощь ?., ??, &&= и ??= раскрывается при их комбинировании. Рассмотрим практические паттерны.' },
        { type: 'code', language: 'javascript', value: '// Безопасное глубокое слияние с умолчаниями\nfunction mergeConfig(userConfig, defaults) {\n  return {\n    host:    userConfig?.host    ?? defaults.host,\n    port:    userConfig?.port    ?? defaults.port,\n    timeout: userConfig?.timeout ?? defaults.timeout,\n    retries: userConfig?.retries ?? defaults.retries,\n    tls: {\n      enabled: userConfig?.tls?.enabled ?? false,\n      cert:    userConfig?.tls?.cert    ?? null\n    }\n  };\n}\n\n// Безопасный доступ к глубоким данным\nconst apiData = {\n  users: [{\n    id: 1,\n    profile: { avatar: null, bio: "Разработчик" }\n  }]\n};\n\nconst firstUserBio = apiData?.users?.[0]?.profile?.bio ?? "Нет описания";\nconsole.log(firstUserBio); // "Разработчик"\n\nconst avatar = apiData?.users?.[0]?.profile?.avatar ?? "/default.jpg";\nconsole.log(avatar); // "/default.jpg" (null -> умолчание)' },
        { type: 'code', language: 'javascript', value: '// Паттерн: безопасный вызов обработчиков событий\nclass EventSystem {\n  #handlers = {};\n\n  on(event, fn) {\n    this.#handlers[event] ??= [];\n    this.#handlers[event].push(fn);\n    return this;\n  }\n\n  emit(event, data) {\n    this.#handlers[event]?.forEach(fn => fn?.(data));\n    return this;\n  }\n}\n\nconst events = new EventSystem();\nevents\n  .on("login", user => console.log("Вошёл:", user.name))\n  .on("logout", () => console.log("Вышел"));\n\nevents.emit("login", { name: "Алия" }); // "Вошёл: Алия"\nevents.emit("error", { code: 404 });    // ничего (нет обработчиков)' }
      ]
    },
    {
      id: 6,
      title: 'Практика: безопасная обработка данных',
      type: 'practice',
      difficulty: 'medium',
      description: 'Используй современные операторы для безопасной работы с данными.',
      requirements: [
        'safeGet(obj, path, fallback) — безопасно получить вложенное свойство по пути "a.b.c"',
        'normalizeUser(rawUser) — нормализовать "сырые" данные API с умолчаниями',
        'deepMerge(target, source) — глубокое слияние с ??= для умолчаний',
        'Напиши функцию formatProfile(user) использующую ?. и ?? для форматирования'
      ],
      hint: 'Для safeGet: разбить path.split("."), затем reduce с ?. через bracket notation. normalizeUser: использовать ?? для каждого поля.',
      expectedOutput: 'user?.address?.city -> "Алматы" или undefined (без ошибки)\nnull ?? "по умолчанию" -> "по умолчанию"\n0 ?? "по умолчанию" -> 0 (не null/undefined)\nuser?.getName?.() -> безопасный вызов метода',
      solution: 'function safeGet(obj, path, fallback = undefined) {\n  const value = path.split(".").reduce((current, key) => current?.[key], obj);\n  return value ?? fallback;\n}\n\nfunction normalizeUser(raw) {\n  return {\n    id:       raw?.id       ?? 0,\n    name:     raw?.name     ?? "Аноним",\n    email:    raw?.email    ?? "",\n    age:      raw?.age      ?? null,\n    active:   raw?.active   ?? true,\n    role:     raw?.role     ?? "user",\n    avatar:   raw?.avatar   ?? "/default-avatar.png",\n    address: {\n      city:    raw?.address?.city    ?? "Неизвестно",\n      country: raw?.address?.country ?? "KZ"\n    }\n  };\n}\n\nfunction deepMerge(target, source) {\n  for (const key of Object.keys(source)) {\n    if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {\n      target[key] ??= {};\n      deepMerge(target[key], source[key]);\n    } else {\n      target[key] ??= source[key];\n    }\n  }\n  return target;\n}\n\nfunction formatProfile(user) {\n  const name    = user?.name     ?? "Аноним";\n  const city    = user?.address?.city ?? "Город не указан";\n  const age     = user?.age != null ? `${user.age} лет` : "Возраст неизвестен";\n  const avatar  = user?.avatar   ?? "/default.jpg";\n  const bio     = user?.bio?.trim() || "Расскажите о себе...";\n  return `${name} | ${city} | ${age}\\nАватар: ${avatar}\\nОбо мне: ${bio}`;\n}\n\nconsole.log(safeGet({ a: { b: { c: 42 } } }, "a.b.c", 0)); // 42\nconsole.log(safeGet({}, "a.b.c", -1));                      // -1\nconsole.log(normalizeUser(null));\n// { id: 0, name: "Аноним", email: "", ... }',
      explanation: 'safeGet использует reduce с ?. — если на любом уровне undefined, дальнейший доступ возвращает undefined через ?.. normalizeUser использует ?? для каждого поля — только null/undefined заменяются умолчанием. deepMerge использует ??= для "заполнения пробелов" в target из source.'
    }
  ]
}
