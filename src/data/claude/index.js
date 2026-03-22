export default {
  id: 'claude',
  title: 'Claude & Claude Code',
  icon: '🤖',
  description: 'Полный курс по Claude AI, Claude Code CLI, Anthropic API, промпт-инженерии и созданию AI-приложений.',
  color: '#D97706',
  modules: [
    // === ВВЕДЕНИЕ В CLAUDE (1-8) ===
    { id: 1, title: 'Что такое Claude', icon: '🤖', totalLessons: 7 },
    { id: 2, title: 'Модели Claude: Haiku, Sonnet, Opus', icon: '🧠', totalLessons: 7 },
    { id: 3, title: 'Claude vs другие AI (GPT, Gemini)', icon: '⚖️', totalLessons: 6 },
    { id: 4, title: 'Возможности Claude', icon: '💡', totalLessons: 7 },
    { id: 5, title: 'Ограничения и безопасность', icon: '🛡️', totalLessons: 6 },
    { id: 6, title: 'Контекстное окно и токены', icon: '📏', totalLessons: 7 },
    { id: 7, title: 'Мультимодальность: изображения и PDF', icon: '🖼️', totalLessons: 6 },
    { id: 8, title: 'Веб-интерфейс claude.ai', icon: '🌐', totalLessons: 6 },

    // === ПРОМПТ-ИНЖЕНЕРИЯ (9-18) ===
    { id: 9, title: 'Основы промпт-инженерии', icon: '✍️', totalLessons: 8 },
    { id: 10, title: 'Роли и системные промпты', icon: '🎭', totalLessons: 7 },
    { id: 11, title: 'Техника Chain of Thought', icon: '🔗', totalLessons: 7 },
    { id: 12, title: 'Few-shot примеры', icon: '📝', totalLessons: 6 },
    { id: 13, title: 'Структурированный вывод (JSON, XML)', icon: '📋', totalLessons: 7 },
    { id: 14, title: 'Промпты для кода', icon: '💻', totalLessons: 8 },
    { id: 15, title: 'Промпты для анализа данных', icon: '📊', totalLessons: 6 },
    { id: 16, title: 'Промпты для текстов и контента', icon: '📄', totalLessons: 7 },
    { id: 17, title: 'Антипаттерны промптов', icon: '⚠️', totalLessons: 6 },
    { id: 18, title: 'Продвинутые техники промптинга', icon: '🚀', totalLessons: 7 },

    // === CLAUDE CODE CLI (19-30) ===
    { id: 19, title: 'Введение в Claude Code', icon: '💻', totalLessons: 7 },
    { id: 20, title: 'Установка и настройка', icon: '⚙️', totalLessons: 6 },
    { id: 21, title: 'Основные команды', icon: '⌨️', totalLessons: 8 },
    { id: 22, title: 'Работа с файлами и кодом', icon: '📁', totalLessons: 7 },
    { id: 23, title: 'CLAUDE.md и конфигурация проекта', icon: '📝', totalLessons: 7 },
    { id: 24, title: 'Слеш-команды и навыки', icon: '⚡', totalLessons: 6 },
    { id: 25, title: 'Git-интеграция', icon: '🔀', totalLessons: 7 },
    { id: 26, title: 'MCP серверы', icon: '🔌', totalLessons: 7 },
    { id: 27, title: 'Хуки (Hooks)', icon: '🪝', totalLessons: 6 },
    { id: 28, title: 'Мультиагентность и worktrees', icon: '🌳', totalLessons: 7 },
    { id: 29, title: 'Claude Code в IDE (VS Code, JetBrains)', icon: '🖥️', totalLessons: 6 },
    { id: 30, title: 'Продвинутые сценарии Claude Code', icon: '🎯', totalLessons: 7 },

    // === ANTHROPIC API (31-40) ===
    { id: 31, title: 'Anthropic API: начало работы', icon: '🔑', totalLessons: 7 },
    { id: 32, title: 'Messages API', icon: '💬', totalLessons: 8 },
    { id: 33, title: 'Streaming ответов', icon: '🌊', totalLessons: 6 },
    { id: 34, title: 'Tool Use (Function Calling)', icon: '🔧', totalLessons: 8 },
    { id: 35, title: 'Vision API (работа с изображениями)', icon: '👁️', totalLessons: 6 },
    { id: 36, title: 'Extended Thinking', icon: '🤔', totalLessons: 6 },
    { id: 37, title: 'Кеширование промптов', icon: '💾', totalLessons: 6 },
    { id: 38, title: 'Batches API', icon: '📦', totalLessons: 6 },
    { id: 39, title: 'Обработка ошибок и rate limits', icon: '⚠️', totalLessons: 7 },
    { id: 40, title: 'Стоимость и оптимизация затрат', icon: '💰', totalLessons: 6 },

    // === СОЗДАНИЕ AI-ПРИЛОЖЕНИЙ (41-50) ===
    { id: 41, title: 'Архитектура AI-приложений', icon: '🏛️', totalLessons: 7 },
    { id: 42, title: 'RAG: Retrieval Augmented Generation', icon: '🔍', totalLessons: 8 },
    { id: 43, title: 'AI-агенты: основы', icon: '🤖', totalLessons: 8 },
    { id: 44, title: 'Claude Agent SDK', icon: '🧰', totalLessons: 8 },
    { id: 45, title: 'Чат-бот с памятью', icon: '💬', totalLessons: 7 },
    { id: 46, title: 'AI-ассистент для кода', icon: '👨‍💻', totalLessons: 7 },
    { id: 47, title: 'Мультиагентные системы', icon: '🤝', totalLessons: 7 },
    { id: 48, title: 'Тестирование AI-приложений', icon: '🧪', totalLessons: 6 },
    { id: 49, title: 'Деплой AI-приложений', icon: '🚀', totalLessons: 6 },
    { id: 50, title: 'Best Practices и реальные кейсы', icon: '🏆', totalLessons: 8 }
  ]
}
