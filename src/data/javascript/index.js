export default {
  id: 'javascript',
  title: 'JavaScript',
  icon: '🟨',
  description: 'Полный курс JavaScript: от основ до Node.js, async, прототипов, паттернов и тестирования.',
  color: '#F7DF1E',
  modules: [
    // === CORE JS (1-18) ===
    { id: 1, title: 'Введение в JavaScript', icon: '🟨', totalLessons: 7 },
    { id: 2, title: 'Переменные (let, const, var)', icon: '📦', totalLessons: 7 },
    { id: 3, title: 'Типы данных', icon: '🏷️', totalLessons: 8 },
    { id: 4, title: 'Операторы', icon: '➕', totalLessons: 6 },
    { id: 5, title: 'Условные конструкции', icon: '🔀', totalLessons: 7 },
    { id: 6, title: 'Циклы', icon: '🔁', totalLessons: 7 },
    { id: 7, title: 'Функции', icon: '⚡', totalLessons: 8 },
    { id: 8, title: 'Arrow Functions', icon: '➡️', totalLessons: 6 },
    { id: 9, title: 'Массивы', icon: '📋', totalLessons: 8 },
    { id: 10, title: 'Объекты', icon: '🏗️', totalLessons: 8 },
    { id: 11, title: 'Строки', icon: '🔤', totalLessons: 7 },
    { id: 12, title: 'Деструктуризация', icon: '📤', totalLessons: 7 },
    { id: 13, title: 'Spread и Rest', icon: '🔄', totalLessons: 6 },
    { id: 14, title: 'Map и Set', icon: '🗺️', totalLessons: 7 },
    { id: 15, title: 'Обработка ошибок', icon: '⚠️', totalLessons: 6 },
    { id: 16, title: 'JSON', icon: '📄', totalLessons: 6 },
    { id: 17, title: 'Модули (import/export)', icon: '📦', totalLessons: 6 },
    { id: 18, title: 'Регулярные выражения', icon: '🔍', totalLessons: 7 },

    // === ПРОДВИНУТЫЙ JS (19-30) ===
    { id: 19, title: 'Замыкания (Closures)', icon: '🔒', totalLessons: 7 },
    { id: 20, title: 'this и контекст', icon: '👆', totalLessons: 8 },
    { id: 21, title: 'Прототипы', icon: '🧬', totalLessons: 7 },
    { id: 22, title: 'Классы (ES6+)', icon: '🏗️', totalLessons: 8 },
    { id: 23, title: 'Symbol и итераторы', icon: '🔑', totalLessons: 6 },
    { id: 24, title: 'Генераторы', icon: '🔄', totalLessons: 6 },
    { id: 25, title: 'Promise', icon: '🤝', totalLessons: 8 },
    { id: 26, title: 'Async/Await', icon: '⏳', totalLessons: 7 },
    { id: 27, title: 'Event Loop', icon: '🔁', totalLessons: 7 },
    { id: 28, title: 'Proxy и Reflect', icon: '🪞', totalLessons: 6 },
    { id: 29, title: 'WeakMap, WeakSet, WeakRef', icon: '💨', totalLessons: 6 },
    { id: 30, title: 'Optional Chaining и Nullish Coalescing', icon: '❓', totalLessons: 6 },

    // === NODE.JS (31-42) ===
    { id: 31, title: 'Введение в Node.js', icon: '🟢', totalLessons: 7 },
    { id: 32, title: 'Модули Node.js (CommonJS/ESM)', icon: '📦', totalLessons: 6 },
    { id: 33, title: 'File System (fs)', icon: '📁', totalLessons: 7 },
    { id: 34, title: 'Path и OS', icon: '💻', totalLessons: 6 },
    { id: 35, title: 'HTTP сервер', icon: '🌐', totalLessons: 7 },
    { id: 36, title: 'Express.js: основы', icon: '🚂', totalLessons: 8 },
    { id: 37, title: 'Express: Middleware', icon: '🔗', totalLessons: 7 },
    { id: 38, title: 'Express: REST API', icon: '🔗', totalLessons: 8 },
    { id: 39, title: 'Аутентификация (JWT)', icon: '🔐', totalLessons: 7 },
    { id: 40, title: 'MongoDB и Mongoose', icon: '🍃', totalLessons: 8 },
    { id: 41, title: 'Streams и Events', icon: '🌊', totalLessons: 6 },
    { id: 42, title: 'WebSocket (Socket.io)', icon: '🔌', totalLessons: 6 },

    // === ИНСТРУМЕНТЫ (43-48) ===
    { id: 43, title: 'npm и yarn', icon: '📦', totalLessons: 6 },
    { id: 44, title: 'Webpack и Vite', icon: '⚡', totalLessons: 7 },
    { id: 45, title: 'ESLint и Prettier', icon: '✨', totalLessons: 6 },
    { id: 46, title: 'Тестирование (Jest)', icon: '🧪', totalLessons: 8 },
    { id: 47, title: 'Debugging', icon: '🐛', totalLessons: 6 },
    { id: 48, title: 'Производительность', icon: '⚡', totalLessons: 6 },

    // === ПАТТЕРНЫ И BP (49-52) ===
    { id: 49, title: 'Паттерны проектирования', icon: '🏭', totalLessons: 7 },
    { id: 50, title: 'Функциональное программирование', icon: '🎯', totalLessons: 7 },
    { id: 51, title: 'Clean Code в JS', icon: '🧹', totalLessons: 7 },
    { id: 52, title: 'Best Practices', icon: '✨', totalLessons: 7 },

    // === ПРАКТИКУМЫ (53-60) ===
    { id: 53, title: 'Практикум: Основы', icon: '💪', totalLessons: 10 },
    { id: 54, title: 'Практикум: Массивы и объекты', icon: '🏋️', totalLessons: 10 },
    { id: 55, title: 'Практикум: Async', icon: '⏳', totalLessons: 10 },
    { id: 56, title: 'Практикум: Node.js', icon: '🟢', totalLessons: 10 },
    { id: 57, title: 'Практикум: Задачи Easy', icon: '🟢', totalLessons: 10 },
    { id: 58, title: 'Практикум: Задачи Medium', icon: '🟡', totalLessons: 10 },
    { id: 59, title: 'Практикум: Задачи Hard', icon: '🔴', totalLessons: 10 },
    { id: 60, title: 'Практикум: Мини-проекты', icon: '🚀', totalLessons: 8 }
  ]
}
