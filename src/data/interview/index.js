export default {
  id: 'interview',
  title: 'Подготовка к собеседованиям',
  icon: '🎯',
  description: 'Полный курс подготовки к техническим собеседованиям: behavioral, coding, system design и реальные кейсы FAANG.',
  color: '#1565C0',
  modules: [
    // === ВВЕДЕНИЕ И ПРОЦЕСС (1-5) ===
    { id: 1, title: 'Как устроены собеседования', icon: '🏢', totalLessons: 7 },
    { id: 2, title: 'Резюме и портфолио', icon: '📄', totalLessons: 7 },
    { id: 3, title: 'Стратегия подготовки', icon: '📋', totalLessons: 6 },
    { id: 4, title: 'Площадки и ресурсы', icon: '🌐', totalLessons: 6 },
    { id: 5, title: 'Soft Skills и коммуникация', icon: '🗣️', totalLessons: 7 },

    // === BEHAVIORAL (6-12) ===
    { id: 6, title: 'Behavioral: метод STAR', icon: '⭐', totalLessons: 7 },
    { id: 7, title: 'Behavioral: расскажите о себе', icon: '👤', totalLessons: 6 },
    { id: 8, title: 'Behavioral: конфликты и ошибки', icon: '⚡', totalLessons: 7 },
    { id: 9, title: 'Behavioral: лидерство и инициатива', icon: '🚀', totalLessons: 7 },
    { id: 10, title: 'Behavioral: работа в команде', icon: '🤝', totalLessons: 7 },
    { id: 11, title: 'Behavioral: сложные вопросы', icon: '🧠', totalLessons: 6 },
    { id: 12, title: 'Behavioral: вопросы работодателю', icon: '❓', totalLessons: 6 },

    // === CODING: СТРУКТУРЫ ДАННЫХ (13-19) ===
    { id: 13, title: 'Coding: массивы и строки', icon: '📊', totalLessons: 10 },
    { id: 14, title: 'Coding: хеш-таблицы', icon: '#️⃣', totalLessons: 8 },
    { id: 15, title: 'Coding: связные списки', icon: '🔗', totalLessons: 8 },
    { id: 16, title: 'Coding: стеки и очереди', icon: '📚', totalLessons: 8 },
    { id: 17, title: 'Coding: деревья и BST', icon: '🌳', totalLessons: 10 },
    { id: 18, title: 'Coding: графы', icon: '🕸️', totalLessons: 8 },
    { id: 19, title: 'Coding: кучи (heaps)', icon: '⛰️', totalLessons: 8 },

    // === CODING: АЛГОРИТМЫ (20-27) ===
    { id: 20, title: 'Coding: два указателя', icon: '👆', totalLessons: 8 },
    { id: 21, title: 'Coding: скользящее окно', icon: '🪟', totalLessons: 8 },
    { id: 22, title: 'Coding: бинарный поиск', icon: '🔍', totalLessons: 8 },
    { id: 23, title: 'Coding: сортировка', icon: '📈', totalLessons: 8 },
    { id: 24, title: 'Coding: рекурсия и backtracking', icon: '🔄', totalLessons: 10 },
    { id: 25, title: 'Coding: динамическое программирование', icon: '🧩', totalLessons: 10 },
    { id: 26, title: 'Coding: жадные алгоритмы', icon: '🤑', totalLessons: 8 },
    { id: 27, title: 'Coding: битовые операции', icon: '💾', totalLessons: 6 },

    // === SYSTEM DESIGN INTERVIEW (28-34) ===
    { id: 28, title: 'SD Interview: фреймворк ответа', icon: '🏛️', totalLessons: 7 },
    { id: 29, title: 'SD Interview: оценка нагрузки', icon: '📐', totalLessons: 7 },
    { id: 30, title: 'SD Interview: выбор БД и хранилище', icon: '🗄️', totalLessons: 7 },
    { id: 31, title: 'SD Interview: масштабирование', icon: '📈', totalLessons: 7 },
    { id: 32, title: 'SD Mock: URL Shortener + Pastebin', icon: '🔗', totalLessons: 8 },
    { id: 33, title: 'SD Mock: Messenger + Notification', icon: '💬', totalLessons: 8 },
    { id: 34, title: 'SD Mock: Twitter + Instagram + YouTube', icon: '📱', totalLessons: 8 },

    // === ПРАКТИКА И МОККИ (35-40) ===
    { id: 35, title: 'Практикум: Easy задачи (топ-20)', icon: '🟢', totalLessons: 10 },
    { id: 36, title: 'Практикум: Medium задачи (топ-20)', icon: '🟡', totalLessons: 10 },
    { id: 37, title: 'Практикум: Hard задачи (топ-15)', icon: '🔴', totalLessons: 10 },
    { id: 38, title: 'Практикум: FAANG паттерны', icon: '🏆', totalLessons: 10 },
    { id: 39, title: 'Mock Interview: полная симуляция', icon: '🎭', totalLessons: 8 },
    { id: 40, title: 'После оффера: переговоры и онбординг', icon: '🎉', totalLessons: 7 }
  ]
}
