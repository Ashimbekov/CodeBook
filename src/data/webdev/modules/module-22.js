export default {
  id: 22,
  title: 'LocalStorage и SessionStorage',
  description: 'Хранение данных в браузере — getItem, setItem, JSON-сериализация и практические применения',
  lessons: [
    {
      id: 1,
      title: 'Web Storage API: LocalStorage vs SessionStorage',
      type: 'theory',
      content: [
        { type: 'text', value: 'Web Storage API предоставляет два механизма хранения данных в браузере на стороне клиента, без отправки на сервер.' },
        { type: 'heading', value: 'Отличия LocalStorage и SessionStorage' },
        { type: 'list', items: [
          'LocalStorage — хранит данные бессрочно (до явного удаления)',
          'SessionStorage — хранит только до закрытия вкладки',
          'Оба: до 5-10 МБ, синхронные операции, только строки',
          'Оба: привязаны к origin (домен + порт + протокол)'
        ]},
        { type: 'code', language: 'javascript', value: '// localStorage — постоянное хранилище\nlocalStorage.setItem("username", "Алина");\nconst name = localStorage.getItem("username"); // "Алина"\n\n// sessionStorage — только для текущей вкладки\nsessionStorage.setItem("cartTotal", "3500");\nconst total = sessionStorage.getItem("cartTotal");\n\n// Удаление\nlocalStorage.removeItem("username");\nsessionStorage.removeItem("cartTotal");\n\n// Очистка всего\nlocalStorage.clear();\nsessionStorage.clear();' }
      ]
    },
    {
      id: 2,
      title: 'Хранение объектов через JSON',
      type: 'theory',
      content: [
        { type: 'text', value: 'Web Storage хранит только строки. Для объектов используем JSON.stringify() при записи и JSON.parse() при чтении.' },
        { type: 'code', language: 'javascript', value: '// Сохранение объекта\nconst user = {\n  id: 1,\n  name: "Берик",\n  email: "berik@example.com",\n  preferences: { theme: "dark", lang: "ru" }\n};\n\nlocalStorage.setItem("user", JSON.stringify(user));\n\n// Чтение объекта\nconst savedUser = JSON.parse(localStorage.getItem("user"));\nconsole.log(savedUser.name); // "Берик"\n\n// Безопасное чтение с проверкой\nfunction getItem(key, defaultValue = null) {\n  try {\n    const item = localStorage.getItem(key);\n    return item ? JSON.parse(item) : defaultValue;\n  } catch (e) {\n    console.warn("Ошибка чтения из localStorage:", e);\n    return defaultValue;\n  }\n}\n\n// Безопасная запись\nfunction setItem(key, value) {\n  try {\n    localStorage.setItem(key, JSON.stringify(value));\n  } catch (e) {\n    if (e.name === "QuotaExceededError") {\n      console.warn("localStorage переполнен!");\n    }\n  }\n}' },
        { type: 'warning', value: 'Дата объекта не переживёт JSON-сериализацию корректно: new Date() станет строкой. Если хранишь даты, сохраняй как timestamp (числа) или строки ISO.' }
      ]
    },
    {
      id: 3,
      title: 'Итерация по хранилищу',
      type: 'theory',
      content: [
        { type: 'text', value: 'LocalStorage поддерживает итерацию через ключи.' },
        { type: 'code', language: 'javascript', value: '// Количество элементов\nconsole.log(localStorage.length);\n\n// Получить ключ по индексу\nconst key = localStorage.key(0);\n\n// Перебрать все ключи\nfor (let i = 0; i < localStorage.length; i++) {\n  const key = localStorage.key(i);\n  const value = localStorage.getItem(key);\n  console.log(`${key}: ${value}`);\n}\n\n// Конвертировать в объект\nfunction storageToObject() {\n  const result = {};\n  for (let i = 0; i < localStorage.length; i++) {\n    const key = localStorage.key(i);\n    try {\n      result[key] = JSON.parse(localStorage.getItem(key));\n    } catch {\n      result[key] = localStorage.getItem(key);\n    }\n  }\n  return result;\n}\n\n// StorageEvent — изменения в другой вкладке\nwindow.addEventListener("storage", (event) => {\n  console.log(event.key);      // изменённый ключ\n  console.log(event.oldValue); // старое значение\n  console.log(event.newValue); // новое значение\n});' }
      ]
    },
    {
      id: 4,
      title: 'Практические применения',
      type: 'theory',
      content: [
        { type: 'text', value: 'LocalStorage незаменим для хранения пользовательских настроек, кэширования и офлайн-функциональности.' },
        { type: 'code', language: 'javascript', value: '// 1. Тема оформления\nfunction getTheme() {\n  return localStorage.getItem("theme") || "light";\n}\n\nfunction setTheme(theme) {\n  localStorage.setItem("theme", theme);\n  document.documentElement.setAttribute("data-theme", theme);\n}\n\n// При загрузке страницы\nsetTheme(getTheme());\n\n// 2. Корзина покупок\nfunction getCart() {\n  return JSON.parse(localStorage.getItem("cart")) || [];\n}\n\nfunction addToCart(product) {\n  const cart = getCart();\n  const existing = cart.find(item => item.id === product.id);\n  if (existing) {\n    existing.qty++;\n  } else {\n    cart.push({ ...product, qty: 1 });\n  }\n  localStorage.setItem("cart", JSON.stringify(cart));\n}\n\nfunction removeFromCart(productId) {\n  const cart = getCart().filter(item => item.id !== productId);\n  localStorage.setItem("cart", JSON.stringify(cart));\n}\n\n// 3. Недавние поиски\nfunction addRecentSearch(query) {\n  const searches = JSON.parse(localStorage.getItem("searches")) || [];\n  const updated = [query, ...searches.filter(s => s !== query)].slice(0, 5);\n  localStorage.setItem("searches", JSON.stringify(updated));\n}' }
      ]
    },
    {
      id: 5,
      title: 'Ограничения и альтернативы',
      type: 'theory',
      content: [
        { type: 'text', value: 'LocalStorage имеет ограничения. Для сложных случаев есть альтернативы.' },
        { type: 'list', items: [
          'Только строки — нужна JSON-сериализация',
          'Синхронные операции — может блокировать UI',
          'Только 5-10 МБ — не для больших данных',
          'Нет шифрования — не хранить пароли/токены (только httpOnly cookies!)',
          'Нет доступа из Web Workers'
        ]},
        { type: 'heading', value: 'Альтернативы' },
        { type: 'list', items: [
          'IndexedDB — асинхронная, можно хранить объекты и бинарные данные, сотни МБ',
          'Cache API — для кэширования сетевых запросов (Service Worker)',
          'cookies — доступны серверу, httpOnly защищает от XSS'
        ]},
        { type: 'warning', value: 'Никогда не храни JWT-токены в localStorage! Они уязвимы к XSS-атакам. Используй httpOnly cookies для аутентификационных токенов.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Сохранение настроек',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создай страницу с настройками (тема, язык, имя), которые сохраняются в localStorage.',
      requirements: [
        'Форма с: имя пользователя (text), тема (radio: light/dark), язык (select)',
        'При загрузке страницы — восстанавливать настройки из localStorage',
        'При изменении поля — сохранять в localStorage немедленно',
        'Применять тему к странице (data-theme атрибут или класс)',
        'Кнопка "Сбросить настройки" — очистить localStorage и перезагрузить'
      ],
      expectedOutput: 'Страница с настройками, которые сохраняются между перезагрузками',
      hint: 'При изменении (event "input" или "change") сохраняй всю форму как объект. При загрузке — восстанавливай поля из сохранённого объекта.',
      solution: 'const SETTINGS_KEY = "userSettings";\n\nconst defaults = {\n  name: "",\n  theme: "light",\n  lang: "ru"\n};\n\nfunction getSettings() {\n  try {\n    return { ...defaults, ...JSON.parse(localStorage.getItem(SETTINGS_KEY)) };\n  } catch {\n    return defaults;\n  }\n}\n\nfunction saveSettings(settings) {\n  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));\n}\n\nfunction applySettings(settings) {\n  document.documentElement.setAttribute("data-theme", settings.theme);\n  document.documentElement.setAttribute("lang", settings.lang);\n  \n  const nameInput = document.getElementById("name");\n  if (nameInput) nameInput.value = settings.name;\n  \n  const themeInput = document.querySelector(`input[name="theme"][value="${settings.theme}"]`);\n  if (themeInput) themeInput.checked = true;\n  \n  const langSelect = document.getElementById("lang");\n  if (langSelect) langSelect.value = settings.lang;\n}\n\n// Загрузить настройки при старте\nconst settings = getSettings();\napplySettings(settings);\n\n// Сохранять при изменении\ndocument.getElementById("settingsForm").addEventListener("change", (e) => {\n  const currentSettings = getSettings();\n  if (e.target.name === "theme") currentSettings.theme = e.target.value;\n  if (e.target.name === "lang") currentSettings.lang = e.target.value;\n  if (e.target.name === "name") currentSettings.name = e.target.value;\n  saveSettings(currentSettings);\n  applySettings(currentSettings);\n});\n\ndocument.getElementById("resetBtn").addEventListener("click", () => {\n  localStorage.removeItem(SETTINGS_KEY);\n  location.reload();\n});',
      explanation: 'Паттерн "загрузить при старте, сохранять при изменении" — стандарт для настроек. Слияние с defaults { ...defaults, ...saved } защищает от частично устаревших данных (например, добавили новый ключ после сохранения).'
    }
  ]
}
