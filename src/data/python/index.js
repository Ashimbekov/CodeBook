export default {
  id: 'python',
  title: 'Python',
  icon: '🐍',
  description: 'Полный курс Python: от основ до async, декораторов, тестирования и Data Science.',
  color: '#3776AB',
  modules: [
    // === ОСНОВЫ (1-15) ===
    { id: 1, title: 'Введение в Python', icon: '🐍', totalLessons: 7 },
    { id: 2, title: 'Переменные и типы данных', icon: '📦', totalLessons: 8 },
    { id: 3, title: 'Операторы', icon: '➕', totalLessons: 6 },
    { id: 4, title: 'Условные конструкции', icon: '🔀', totalLessons: 7 },
    { id: 5, title: 'Циклы (for, while)', icon: '🔁', totalLessons: 7 },
    { id: 6, title: 'Строки', icon: '🔤', totalLessons: 8 },
    { id: 7, title: 'Списки (list)', icon: '📋', totalLessons: 8 },
    { id: 8, title: 'Кортежи (tuple)', icon: '📌', totalLessons: 6 },
    { id: 9, title: 'Словари (dict)', icon: '🗺️', totalLessons: 8 },
    { id: 10, title: 'Множества (set)', icon: '🎯', totalLessons: 6 },
    { id: 11, title: 'Функции', icon: '⚡', totalLessons: 8 },
    { id: 12, title: 'Модули и пакеты', icon: '📦', totalLessons: 6 },
    { id: 13, title: 'Работа с файлами', icon: '📁', totalLessons: 7 },
    { id: 14, title: 'Обработка исключений', icon: '⚠️', totalLessons: 7 },
    { id: 15, title: 'Ввод/вывод и форматирование', icon: '🖨️', totalLessons: 6 },

    // === ООП (16-23) ===
    { id: 16, title: 'Классы и объекты', icon: '🏗️', totalLessons: 8 },
    { id: 17, title: 'Наследование', icon: '🌳', totalLessons: 7 },
    { id: 18, title: 'Полиморфизм и абстракция', icon: '🎭', totalLessons: 7 },
    { id: 19, title: 'Магические методы', icon: '✨', totalLessons: 7 },
    { id: 20, title: 'Свойства (property)', icon: '🔒', totalLessons: 6 },
    { id: 21, title: 'Декораторы', icon: '🎨', totalLessons: 8 },
    { id: 22, title: 'Генераторы и итераторы', icon: '🔄', totalLessons: 7 },
    { id: 23, title: 'Контекстные менеджеры (with)', icon: '🚪', totalLessons: 6 },

    // === ПРОДВИНУТЫЙ (24-35) ===
    { id: 24, title: 'Comprehensions', icon: '🧮', totalLessons: 7 },
    { id: 25, title: 'Lambda, map, filter, reduce', icon: '🎯', totalLessons: 7 },
    { id: 26, title: 'Замыкания и *args/**kwargs', icon: '📦', totalLessons: 6 },
    { id: 27, title: 'Type Hints', icon: '🏷️', totalLessons: 7 },
    { id: 28, title: 'Dataclasses', icon: '📊', totalLessons: 6 },
    { id: 29, title: 'Enum и ABC', icon: '📋', totalLessons: 6 },
    { id: 30, title: 'Async/Await (asyncio)', icon: '⚡', totalLessons: 8 },
    { id: 31, title: 'Потоки (threading)', icon: '🧵', totalLessons: 7 },
    { id: 32, title: 'Процессы (multiprocessing)', icon: '🏭', totalLessons: 6 },
    { id: 33, title: 'Регулярные выражения', icon: '🔍', totalLessons: 7 },
    { id: 34, title: 'Работа с JSON и CSV', icon: '📄', totalLessons: 6 },
    { id: 35, title: 'HTTP запросы (requests)', icon: '🌐', totalLessons: 7 },

    // === СТАНДАРТНАЯ БИБЛИОТЕКА (36-42) ===
    { id: 36, title: 'os, sys, pathlib', icon: '💻', totalLessons: 7 },
    { id: 37, title: 'collections', icon: '📚', totalLessons: 7 },
    { id: 38, title: 'itertools и functools', icon: '🔧', totalLessons: 7 },
    { id: 39, title: 'datetime', icon: '📅', totalLessons: 6 },
    { id: 40, title: 'logging', icon: '📝', totalLessons: 6 },
    { id: 41, title: 'unittest и pytest', icon: '🧪', totalLessons: 8 },
    { id: 42, title: 'Virtual environments и pip', icon: '📦', totalLessons: 6 },

    // === DATA SCIENCE INTRO (43-50) ===
    { id: 43, title: 'NumPy: основы', icon: '🔢', totalLessons: 8 },
    { id: 44, title: 'NumPy: продвинутый', icon: '📊', totalLessons: 6 },
    { id: 45, title: 'Pandas: основы', icon: '🐼', totalLessons: 8 },
    { id: 46, title: 'Pandas: продвинутый', icon: '📈', totalLessons: 7 },
    { id: 47, title: 'Matplotlib', icon: '📊', totalLessons: 7 },
    { id: 48, title: 'Анализ данных: практика', icon: '🔬', totalLessons: 7 },
    { id: 49, title: 'Web Scraping (BeautifulSoup)', icon: '🕷️', totalLessons: 7 },
    { id: 50, title: 'Работа с API', icon: '🔗', totalLessons: 6 },

    // === BEST PRACTICES (51-55) ===
    { id: 51, title: 'PEP 8 и стиль кода', icon: '✨', totalLessons: 7 },
    { id: 52, title: 'Clean Code в Python', icon: '🧹', totalLessons: 7 },
    { id: 53, title: 'Структура проекта', icon: '📁', totalLessons: 6 },
    { id: 54, title: 'Документация (docstrings, Sphinx)', icon: '📝', totalLessons: 6 },
    { id: 55, title: 'Безопасность', icon: '🔐', totalLessons: 6 },

    // === ПРАКТИКУМЫ (56-65) ===
    { id: 56, title: 'Практикум: Основы', icon: '💪', totalLessons: 10 },
    { id: 57, title: 'Практикум: Строки и списки', icon: '🏋️', totalLessons: 10 },
    { id: 58, title: 'Практикум: ООП', icon: '🧱', totalLessons: 10 },
    { id: 59, title: 'Практикум: Функциональное', icon: '🎯', totalLessons: 10 },
    { id: 60, title: 'Практикум: Задачи Easy', icon: '🟢', totalLessons: 10 },
    { id: 61, title: 'Практикум: Задачи Medium', icon: '🟡', totalLessons: 10 },
    { id: 62, title: 'Практикум: Задачи Hard', icon: '🔴', totalLessons: 10 },
    { id: 63, title: 'Практикум: Data Science', icon: '📊', totalLessons: 10 },
    { id: 64, title: 'Практикум: Автоматизация', icon: '🤖', totalLessons: 10 },
    { id: 65, title: 'Практикум: Мини-проекты', icon: '🚀', totalLessons: 8 }
  ]
}
