export default {
  id: 30,
  title: 'Практикум: Чтение',
  description: 'Практика чтения IT-текстов: README, документация, сообщения об ошибках, статьи',
  lessons: [
    {
      id: 1,
      title: 'Чтение: Описание проекта',
      type: 'practice',
      content: [
        {
          type: 'task',
          taskType: 'read_and_answer',
          text: 'FastNote is a lightweight note-taking app for developers. It supports Markdown formatting and code syntax highlighting. You can organize notes in folders and add tags. The app syncs across devices using cloud storage. It is available on Windows, macOS, and Linux.',
          question: 'На каких операционных системах работает FastNote?',
          solution: 'На Windows, macOS и Linux.',
          explanation: '"It is available on Windows, macOS, and Linux." — доступно на трёх ОС.'
        },
        {
          type: 'task',
          taskType: 'read_and_answer',
          text: 'FastNote is a lightweight note-taking app for developers. It supports Markdown formatting and code syntax highlighting. You can organize notes in folders and add tags. The app syncs across devices using cloud storage. It is available on Windows, macOS, and Linux.',
          question: 'Как синхронизируются заметки?',
          solution: 'Через облачное хранилище (cloud storage)',
          explanation: '"The app syncs across devices using cloud storage." — синхронизируется через облако.'
        },
        {
          type: 'task',
          taskType: 'translate',
          question: 'Переведите: "It supports Markdown formatting and code syntax highlighting."',
          solution: 'Поддерживает форматирование Markdown и подсветку синтаксиса кода.',
          explanation: 'supports = поддерживает, Markdown formatting = форматирование Markdown, code syntax highlighting = подсветка синтаксиса кода.'
        }
      ]
    },
    {
      id: 2,
      title: 'Чтение: Инструкции по установке',
      type: 'practice',
      content: [
        {
          type: 'task',
          taskType: 'read_and_answer',
          text: 'Requirements:\n- Node.js 18 or higher\n- PostgreSQL 14+\n- At least 2 GB RAM\n\nInstallation:\n1. Clone the repository: git clone ...\n2. Install dependencies: npm install\n3. Create .env file from .env.example\n4. Run migrations: npm run migrate\n5. Start the app: npm start\n\nThe app will be available at http://localhost:3000',
          question: 'По какому адресу будет доступно приложение?',
          solution: 'http://localhost:3000',
          explanation: '"The app will be available at http://localhost:3000"'
        },
        {
          type: 'task',
          taskType: 'read_and_answer',
          text: 'Requirements:\n- Node.js 18 or higher\n- PostgreSQL 14+\n- At least 2 GB RAM\n\nInstallation steps...',
          question: 'Сколько оперативной памяти минимально необходимо?',
          solution: '2 ГБ (at least 2 GB RAM)',
          explanation: '"At least 2 GB RAM" — минимум 2 ГБ оперативной памяти.'
        },
        {
          type: 'task',
          taskType: 'translate',
          question: 'Переведите шаг установки: "Create .env file from .env.example"',
          solution: 'Создайте файл .env из .env.example',
          explanation: 'Create = создайте, from = из. .env.example — шаблон с примером настроек.'
        }
      ]
    },
    {
      id: 3,
      title: 'Чтение: Сообщения об ошибках',
      type: 'practice',
      content: [
        {
          type: 'task',
          taskType: 'translate',
          question: 'Переведите: "Error: Cannot connect to database. Connection refused at port 5432."',
          solution: 'Ошибка: Не удаётся подключиться к базе данных. Соединение отклонено на порту 5432.',
          explanation: 'Cannot connect = не удаётся подключиться, Connection refused = соединение отклонено, at port 5432 = на порту 5432.'
        },
        {
          type: 'task',
          taskType: 'multiple_choice',
          question: 'Что означает: "ReferenceError: x is not defined"?',
          options: ['Переменная x не объявлена', 'x равно null', 'x имеет неправильный тип', 'Ошибка синтаксиса рядом с x'],
          correct: 0,
          explanation: 'ReferenceError: x is not defined — переменная x используется, но не была объявлена.'
        },
        {
          type: 'task',
          taskType: 'translate',
          question: 'Переведите: "Warning: Deprecated API. Use /api/v2 instead."',
          solution: 'Предупреждение: Устаревший API. Используйте /api/v2 вместо этого.',
          explanation: 'Warning = предупреждение, Deprecated = устаревший, instead = вместо этого.'
        }
      ]
    },
    {
      id: 4,
      title: 'Чтение: API документация',
      type: 'practice',
      content: [
        {
          type: 'task',
          taskType: 'read_and_answer',
          text: 'POST /api/users\n\nCreate a new user.\n\nRequest body:\n{\n  "email": "user@example.com",\n  "password": "secret",\n  "name": "John Doe"\n}\n\nRequired fields: email, password\nOptional fields: name, avatar\n\nResponse 201 (Created):\n{ "id": 1, "email": "user@example.com" }\n\nResponse 400 (Bad Request):\n{ "error": "Email already exists" }',
          question: 'Какие поля обязательны для создания пользователя?',
          solution: 'email и password (Required fields: email, password)',
          explanation: '"Required fields: email, password" — обязательные поля для создания пользователя.'
        },
        {
          type: 'task',
          taskType: 'read_and_answer',
          text: 'POST /api/users...\nResponse 400: { "error": "Email already exists" }',
          question: 'Какой код ответа возвращается при ошибке "Email already exists"?',
          solution: '400 (Bad Request)',
          explanation: '"Response 400 (Bad Request)" — ошибка клиента. Неверный запрос (например, email уже существует).'
        },
        {
          type: 'task',
          taskType: 'translate',
          question: 'Переведите: "Optional fields: name, avatar"',
          solution: 'Необязательные поля: имя, аватар',
          explanation: 'Optional = необязательный/опциональный, fields = поля.'
        }
      ]
    },
    {
      id: 5,
      title: 'Чтение: Changelog',
      type: 'practice',
      content: [
        {
          type: 'task',
          taskType: 'read_and_answer',
          text: '## [3.0.0] - 2024-06-01\n### Breaking Changes\n- Removed support for Node.js 14\n- Changed authentication from cookies to JWT\n\n### Added\n- New dashboard with real-time stats\n- Dark mode\n- Export to PDF feature\n\n### Fixed\n- Fixed memory leak in background jobs\n- Fixed date formatting in French locale',
          question: 'Что было добавлено в версии 3.0.0?',
          solution: 'Новый дашборд с статистикой в реальном времени, тёмный режим, экспорт в PDF.',
          explanation: 'Added section: New dashboard with real-time stats, Dark mode, Export to PDF feature.'
        },
        {
          type: 'task',
          taskType: 'read_and_answer',
          text: '## [3.0.0]...\n### Breaking Changes\n- Removed support for Node.js 14\n- Changed authentication from cookies to JWT',
          question: 'Какое Breaking Change связано с аутентификацией?',
          solution: 'Изменена аутентификация с cookies на JWT.',
          explanation: '"Changed authentication from cookies to JWT" — смена метода аутентификации.'
        },
        {
          type: 'task',
          taskType: 'translate',
          question: 'Переведите: "Removed support for Node.js 14"',
          solution: 'Удалена поддержка Node.js 14',
          explanation: 'Removed = удалена, support = поддержка, for = для (чего).'
        }
      ]
    },
    {
      id: 6,
      title: 'Чтение: Технические требования',
      type: 'practice',
      content: [
        {
          type: 'task',
          taskType: 'read_and_answer',
          text: 'User Story: As a developer, I want to receive email notifications when a build fails, so that I can fix the problem quickly.\n\nAcceptance Criteria:\n- Email is sent within 1 minute of build failure\n- Email includes: build name, error message, and link to logs\n- Email is sent only to the developer who triggered the build\n- Users can disable notifications in settings',
          question: 'Кому отправляется email о падении сборки?',
          solution: 'Только разработчику, который запустил сборку.',
          explanation: '"Email is sent only to the developer who triggered the build." — только тому, кто запустил сборку.'
        },
        {
          type: 'task',
          taskType: 'translate',
          question: 'Переведите: "As a developer, I want to receive email notifications when a build fails."',
          solution: 'Как разработчик, я хочу получать email-уведомления, когда сборка падает.',
          explanation: 'As a developer = как разработчик, I want to receive = я хочу получать, when a build fails = когда сборка падает.'
        },
        {
          type: 'task',
          taskType: 'multiple_choice',
          question: 'Через сколько времени должен прийти email после падения сборки?',
          options: ['В течение 1 минуты', 'В течение 5 минут', 'Сразу', 'В течение часа'],
          correct: 0,
          explanation: '"Email is sent within 1 minute of build failure" — в течение 1 минуты после падения.'
        }
      ]
    },
    {
      id: 7,
      title: 'Чтение: Pull Request описание',
      type: 'practice',
      content: [
        {
          type: 'task',
          taskType: 'read_and_answer',
          text: '## Summary\nThis PR implements user profile editing functionality.\nUsers can now update their name, email, and profile picture.\n\n## Changes\n- Added PUT /api/users/:id endpoint\n- Added profile picture upload with image compression\n- Updated user model to include avatarUrl field\n- Added validation for email format\n\n## Testing\n- [ ] Unit tests added\n- [x] Integration tests pass\n- [x] Manual testing done on staging\n\n## Notes\nThe image upload limit is 5 MB.',
          question: 'Какой лимит для загрузки изображений?',
          solution: '5 МБ (5 MB)',
          explanation: '"The image upload limit is 5 MB." — лимит загрузки изображений 5 МБ.'
        },
        {
          type: 'task',
          taskType: 'read_and_answer',
          text: '## Testing\n- [ ] Unit tests added\n- [x] Integration tests pass\n- [x] Manual testing done on staging',
          question: 'Что ещё не сделано из тестирования?',
          solution: 'Юнит-тесты не добавлены (unit tests not added — чекбокс не отмечен)',
          explanation: '"[ ] Unit tests added" — незакрытый чекбокс означает, что задача не выполнена.'
        },
        {
          type: 'task',
          taskType: 'translate',
          question: 'Переведите: "Added validation for email format"',
          solution: 'Добавлена валидация формата email',
          explanation: 'Added = добавлена, validation = валидация, for email format = для формата email.'
        }
      ]
    },
    {
      id: 8,
      title: 'Чтение: Техническая статья',
      type: 'practice',
      content: [
        {
          type: 'task',
          taskType: 'read_and_answer',
          text: 'Why You Should Use TypeScript\n\nTypeScript is a superset of JavaScript that adds static typing. It helps developers catch errors at compile time rather than runtime. This reduces bugs in production.\n\nKey benefits:\n1. Early error detection\n2. Better code documentation\n3. Improved IDE support with autocomplete\n4. Easier refactoring\n\nTypeScript is especially useful for large codebases and teams.',
          question: 'Когда TypeScript помогает находить ошибки?',
          solution: 'При компиляции, а не во время выполнения (at compile time, not runtime)',
          explanation: '"It helps developers catch errors at compile time rather than runtime." — на этапе компиляции.'
        },
        {
          type: 'task',
          taskType: 'translate',
          question: 'Переведите: "TypeScript is especially useful for large codebases and teams."',
          solution: 'TypeScript особенно полезен для больших кодовых баз и команд.',
          explanation: 'especially useful = особенно полезен, large codebases = большие кодовые базы, teams = команды.'
        },
        {
          type: 'task',
          taskType: 'multiple_choice',
          question: 'Что такое TypeScript по отношению к JavaScript?',
          options: ['надмножество (superset)', 'подмножество', 'замена', 'то же самое'],
          correct: 0,
          explanation: '"TypeScript is a superset of JavaScript" — TypeScript включает весь JavaScript плюс дополнительные возможности.'
        }
      ]
    },
    {
      id: 9,
      title: 'Чтение: Постмортем инцидента',
      type: 'practice',
      content: [
        {
          type: 'task',
          taskType: 'read_and_answer',
          text: 'Incident Report: Database Outage\nDate: 2024-03-15\nDuration: 47 minutes\n\nSummary:\nThe production database became unavailable due to disk space exhaustion. This caused all API endpoints to return 500 errors.\n\nRoot Cause:\nAutomated log rotation was disabled accidentally during the last deployment. Logs accumulated and filled the disk.\n\nActions Taken:\n- Freed disk space by removing old logs\n- Re-enabled log rotation\n- Increased disk monitoring alerts\n\nPrevention:\nImplement disk space alerts at 80% threshold.',
          question: 'Какова первопричина инцидента?',
          solution: 'Автоматическая ротация логов была случайно отключена при последнем деплое, логи заполнили диск.',
          explanation: '"Automated log rotation was disabled accidentally during the last deployment."'
        },
        {
          type: 'task',
          taskType: 'translate',
          question: 'Переведите: "The production database became unavailable due to disk space exhaustion."',
          solution: 'Продакшн-база данных стала недоступна из-за исчерпания дискового пространства.',
          explanation: 'became unavailable = стала недоступна, due to = из-за, disk space exhaustion = исчерпание дискового пространства.'
        },
        {
          type: 'task', taskType: 'read_and_answer',
          text: 'Duration: 47 minutes. Prevention: Implement disk space alerts at 80% threshold.',
          question: 'Сколько длился инцидент?',
          solution: '47 минут',
          explanation: '"Duration: 47 minutes" — продолжительность 47 минут.'
        }
      ]
    },
    {
      id: 10,
      title: 'Чтение: Финальный тест',
      type: 'practice',
      content: [
        {
          type: 'task',
          taskType: 'read_and_answer',
          text: 'DataSync API v2.0\n\nOverview:\nDataSync is a real-time data synchronization service. It supports bidirectional sync between your app and the cloud.\n\nRate Limits:\n- Free plan: 1,000 requests per day\n- Pro plan: 100,000 requests per day\n- Enterprise: unlimited\n\nAuthentication:\nAll requests require an API key in the Authorization header.\n\nExample: Authorization: Bearer YOUR_API_KEY',
          question: 'Сколько запросов в день разрешено на бесплатном плане?',
          solution: '1,000 запросов в день',
          explanation: '"Free plan: 1,000 requests per day"'
        },
        {
          type: 'task',
          taskType: 'translate',
          question: 'Переведите: "All requests require an API key in the Authorization header."',
          solution: 'Все запросы требуют API ключ в заголовке Authorization.',
          explanation: 'All requests require = все запросы требуют, in the Authorization header = в заголовке Authorization.'
        },
        {
          type: 'task',
          taskType: 'read_and_answer',
          text: 'DataSync supports bidirectional sync...',
          question: 'Что означает "bidirectional sync"?',
          solution: 'Двунаправленная синхронизация (данные синхронизируются в обе стороны)',
          explanation: 'bidirectional = двунаправленный (bi = два, directional = направленный). Sync в обе стороны.'
        }
      ]
    }
  ]
}
