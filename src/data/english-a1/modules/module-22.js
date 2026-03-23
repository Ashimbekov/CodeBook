export default {
  id: 22,
  title: 'Чтение: README и документация',
  description: 'Как читать README файлы, changelog и техническую документацию',
  lessons: [
    {
      id: 1,
      title: 'Структура README файла',
      type: 'theory',
      content: [
        { type: 'text', value: 'README — это первый файл, который читают при знакомстве с проектом. Знание стандартной структуры помогает быстро найти нужную информацию.' },
        { type: 'code', language: 'text', value: 'Стандартная структура README:\n# Project Name\nКраткое описание проекта\n\n## Features\nЧто умеет проект\n\n## Installation\nКак установить\n\n## Usage\nКак использовать\n\n## Configuration\nНастройка\n\n## API Reference\nСправочник API\n\n## Contributing\nКак вносить вклад\n\n## License\nЛицензия' },
        { type: 'code', language: 'text', value: 'Ключевые слова в README:\nrequirements  - требования\ndependencies  - зависимости\nprerequisites - предварительные условия\ninstallation  - установка\nconfiguration - конфигурация\nusage         - использование\nexample       - пример\nfeatures      - функции/возможности\nlicense       - лицензия\ncontribute    - вносить вклад\nopen an issue - открыть задачу\nfork          - форкнуть' }
      ]
    },
    {
      id: 2,
      title: 'Раздел Installation',
      type: 'theory',
      content: [
        { type: 'text', value: 'Раздел Installation содержит инструкции по установке. Здесь важно понимать каждый шаг.' },
        { type: 'code', language: 'text', value: 'Типичный раздел Installation:\n## Installation\n\nPrerequisites:\n- Node.js 18 or higher\n- npm or yarn\n- PostgreSQL 14+\n\nSteps:\n1. Clone the repository:\n   git clone https://github.com/user/project\n\n2. Install dependencies:\n   npm install\n\n3. Copy environment file:\n   cp .env.example .env\n\n4. Configure database in .env\n\n5. Run migrations:\n   npm run migrate\n\n6. Start the server:\n   npm start' },
        { type: 'code', language: 'text', value: 'Слова в инструкциях:\nclone      - клонировать\ninstall    - установить\ncopy       - скопировать\nconfigure  - настроить\nrun        - запустить\nstart      - запустить\nstep       - шаг\nor higher  - или выше (версия)\nor later   - или позже\nrequired   - обязательно\noptional   - опционально' }
      ]
    },
    {
      id: 3,
      title: 'Раздел Usage и примеры',
      type: 'theory',
      content: [
        { type: 'text', value: 'Раздел Usage показывает как использовать проект. Здесь обычно есть примеры кода с объяснениями.' },
        { type: 'code', language: 'text', value: 'Типичный раздел Usage:\n## Usage\n\nBasic example:\nconst client = new APIClient({\n  apiKey: \'your-api-key\',\n  timeout: 5000\n});\n\n// Get all users\nconst users = await client.getUsers();\n\n// Create a new user\nconst user = await client.createUser({\n  name: \'John Doe\',\n  email: \'john@example.com\'\n});\n\n// Update a user\nawait client.updateUser(user.id, { name: \'Jane Doe\' });' },
        { type: 'code', language: 'text', value: 'Пояснения к коду:\n// - это комментарий (не выполняется)\nawait - ожидать (асинхронная операция)\nnew - создать новый экземпляр\nconst - константа\nyour-api-key - замените на ваш API ключ\nexample.com - пример домена\n\nКлючевые слова:\nreturns       - возвращает\ntakes/accepts - принимает (параметры)\nthrows        - выбрасывает (ошибку)\ncalls         - вызывает\nexpects       - ожидает\nrequires      - требует' }
      ]
    },
    {
      id: 4,
      title: 'Чтение Changelog',
      type: 'theory',
      content: [
        { type: 'text', value: 'Changelog (история изменений) документирует все изменения в проекте. Умение читать changelog поможет понять что изменилось в новой версии.' },
        { type: 'code', language: 'text', value: 'Типичный Changelog:\n## [2.0.0] - 2024-01-15\n### Breaking Changes\n- Removed deprecated API endpoints\n- Changed database schema\n\n### Added\n- New authentication system\n- User roles and permissions\n- Real-time notifications\n\n### Changed\n- Improved performance of search\n- Updated dependencies\n\n### Fixed\n- Fixed memory leak in production\n- Fixed bug in date parsing\n\n### Deprecated\n- Old login API (use /api/v2/auth)' },
        { type: 'code', language: 'text', value: 'Слова в Changelog:\nadded         - добавлено\nchanged       - изменено\nfixed         - исправлено\nremoved       - удалено\ndeprecated    - устарело\nbreaking      - ломающее (изменение)\nimproved      - улучшено\nupdated       - обновлено\nmigrated      - мигрировано\nrefactored    - рефакторено' }
      ]
    },
    {
      id: 5,
      title: 'Чтение API документации',
      type: 'theory',
      content: [
        { type: 'text', value: 'API документация описывает эндпоинты, параметры и ответы. Это основной тип текста для бэкенд- и фронтенд-разработчиков.' },
        { type: 'code', language: 'text', value: 'Типичное описание API эндпоинта:\n## Get User\nGET /api/users/{id}\n\nReturns a user by ID.\n\nPath Parameters:\n- id (required, integer) - User ID\n\nQuery Parameters:\n- include (optional, string) - Related data to include\n  Example: include=posts,comments\n\nResponse 200 (success):\n{\n  "id": 1,\n  "name": "John Doe",\n  "email": "john@example.com",\n  "createdAt": "2024-01-01"\n}\n\nResponse 404 (not found):\n{\n  "error": "User not found"\n}' },
        { type: 'code', language: 'text', value: 'Слова в API документации:\npath parameter  - параметр пути\nquery parameter - параметр запроса\nrequest body    - тело запроса\nresponse        - ответ\nrequired        - обязательный\noptional        - необязательный\ndefault         - по умолчанию\nexample         - пример\ntype            - тип данных\ninteger/string  - целое число/строка' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Чтение README',
      type: 'practice',
      content: [
        {
          type: 'task',
          taskType: 'read_and_answer',
          text: '## Installation\nPrerequisites:\n- Python 3.10 or higher\n- pip\n\nInstall:\npip install mypackage\n\nFor development:\npip install mypackage[dev]\n\nNote: This package requires an API key. Set it as an environment variable: export API_KEY=your_key',
          question: 'Какая минимальная версия Python требуется?',
          solution: 'Python 3.10 или выше (Python 3.10 or higher)',
          explanation: '"Python 3.10 or higher" — Python 3.10 или выше.'
        },
        {
          type: 'task',
          taskType: 'translate',
          question: 'Переведите: "This package requires an API key."',
          solution: 'Этот пакет требует API ключ.',
          explanation: 'package = пакет, requires = требует, an API key = API ключ (с артиклем an, потому что произносится [эй-пи-ай], начинается с гласного звука).'
        }
      ]
    },
    {
      id: 7,
      title: 'Практика: Чтение Changelog',
      type: 'practice',
      content: [
        {
          type: 'task',
          taskType: 'read_and_answer',
          text: '## [1.5.0] - 2024-03-01\n### Added\n- Dark mode support\n- Export to CSV feature\n\n### Fixed\n- Fixed login timeout issue\n- Fixed memory leak\n\n### Changed\n- Improved API response time by 30%',
          question: 'Что было добавлено в версии 1.5.0?',
          solution: 'Поддержка тёмного режима и экспорт в CSV (Dark mode support, Export to CSV feature)',
          explanation: 'Added section: "Dark mode support" и "Export to CSV feature".'
        },
        {
          type: 'task',
          taskType: 'translate',
          question: 'Переведите из Changelog: "Improved API response time by 30%"',
          solution: 'Улучшено время ответа API на 30%',
          explanation: 'Improved = улучшено, response time = время ответа, by 30% = на 30%.'
        }
      ]
    }
  ]
}
