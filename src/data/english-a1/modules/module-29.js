export default {
  id: 29,
  title: 'Практикум: IT-термины',
  description: 'Тест знания IT-терминологии: программирование, git, деплой, API, базы данных',
  lessons: [
    {
      id: 1,
      title: 'Практика: Базовые термины программирования',
      type: 'practice',
      content: [
        { type: 'task', taskType: 'match', question: 'Соедините термины с определениями:', pairs: [{ left: 'variable', right: 'именованное хранилище данных' }, { left: 'function', right: 'блок переиспользуемого кода' }, { left: 'class', right: 'шаблон для создания объектов' }, { left: 'loop', right: 'повторяющийся блок кода' }], explanation: 'Четыре фундаментальных концепции программирования.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Declare a variable and assign a value."', solution: 'Объявите переменную и присвойте значение.', explanation: 'Declare = объявить, assign a value = присвоить значение.' },
        { type: 'task', taskType: 'multiple_choice', question: 'Что такое "null"?', options: ['отсутствие значения', 'ноль', 'пустая строка', 'false'], correct: 0, explanation: 'null — специальное значение, означающее намеренное отсутствие какого-либо значения.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "The function returns a boolean value."', solution: 'Функция возвращает булевое значение.', explanation: 'returns = возвращает, boolean value = булевое значение (true/false).' },
        { type: 'task', taskType: 'fill_blank', question: 'A ___ (цикл) iterates over each element in the array.', solution: 'loop', explanation: '"A loop iterates over each element in the array." — Цикл перебирает каждый элемент массива.' },
        { type: 'task', taskType: 'match', question: 'Типы данных:', pairs: [{ left: 'string', right: 'текст' }, { left: 'integer', right: 'целое число' }, { left: 'boolean', right: 'истина/ложь' }, { left: 'array', right: 'упорядоченный список' }], explanation: 'Основные типы данных в программировании.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Pass the parameter to the function."', solution: 'Передайте параметр в функцию.', explanation: 'Pass = передать, parameter = параметр, to the function = в функцию.' },
        { type: 'task', taskType: 'multiple_choice', question: 'Что такое "refactoring"?', options: ['улучшение кода без изменения поведения', 'написание нового кода', 'исправление бага', 'тестирование'], correct: 0, explanation: 'Refactoring — процесс улучшения структуры кода без изменения его внешнего поведения.' }
      ]
    },
    {
      id: 2,
      title: 'Практика: Git и версионирование',
      type: 'practice',
      content: [
        { type: 'task', taskType: 'match', question: 'Git-команды:', pairs: [{ left: 'commit', right: 'сохранить изменения' }, { left: 'merge', right: 'объединить ветки' }, { left: 'clone', right: 'скопировать репозиторий' }, { left: 'push', right: 'отправить изменения' }], explanation: 'Основные Git-операции.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Create a feature branch and open a PR."', solution: 'Создайте ветку для фичи и откройте PR.', explanation: 'Create = создайте, feature branch = ветка для фичи, open a PR = открыть пул-реквест.' },
        { type: 'task', taskType: 'fill_blank', question: 'Merge the branch ___ (в) main.', solution: 'into', explanation: '"Merge the branch into main." — merge into = смёрджить в.' },
        { type: 'task', taskType: 'multiple_choice', question: 'Что такое "pull request"?', options: ['запрос на слияние кода', 'обновление репозитория', 'скачивание кода', 'удаление ветки'], correct: 0, explanation: 'Pull request (PR) — запрос на просмотр и слияние кода из одной ветки в другую.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "There is a merge conflict in this branch."', solution: 'В этой ветке есть конфликт при мёрдже.', explanation: 'merge conflict = конфликт при слиянии, in this branch = в этой ветке.' },
        { type: 'task', taskType: 'match', question: 'Типы веток:', pairs: [{ left: 'main/master', right: 'основная ветка' }, { left: 'feature branch', right: 'ветка для новой функции' }, { left: 'bugfix branch', right: 'ветка для исправления' }, { left: 'release branch', right: 'ветка для релиза' }], explanation: 'Стандартная Git-стратегия ветвления.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Approve and merge the pull request."', solution: 'Одобрите и смёрджите пул-реквест.', explanation: 'Approve = одобрить, merge = смёрджить.' },
        { type: 'task', taskType: 'fill_blank', question: 'I made a ___ (коммит) with the fix.', solution: 'commit', explanation: '"I made a commit with the fix." — commit = зафиксированное изменение в Git.' }
      ]
    },
    {
      id: 3,
      title: 'Практика: Баги и тестирование',
      type: 'practice',
      content: [
        { type: 'task', taskType: 'match', question: 'Типы ошибок:', pairs: [{ left: 'syntax error', right: 'ошибка синтаксиса' }, { left: 'runtime error', right: 'ошибка во время выполнения' }, { left: 'logic error', right: 'логическая ошибка' }, { left: 'type error', right: 'ошибка типа данных' }], explanation: 'Три основных вида ошибок в программировании.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "I found a reproducible bug in production."', solution: 'Я нашёл воспроизводимый баг в продакшене.', explanation: 'reproducible = воспроизводимый, in production = в продакшене.' },
        { type: 'task', taskType: 'fill_blank', question: 'We need to ___ (отладить) this function.', solution: 'debug', explanation: '"We need to debug this function." — debug = отлаживать.' },
        { type: 'task', taskType: 'multiple_choice', question: 'Что такое "unit test"?', options: ['тест отдельного компонента', 'тест всей системы', 'ручной тест', 'стресс-тест'], correct: 0, explanation: 'Unit test — тест отдельной единицы кода (функции, метода, класса).' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "All tests are green."', solution: 'Все тесты зелёные (проходят).', explanation: 'green tests = тесты проходят (зелёный = успех в большинстве CI систем).' },
        { type: 'task', taskType: 'match', question: 'Отладка:', pairs: [{ left: 'breakpoint', right: 'точка останова' }, { left: 'stack trace', right: 'стек вызовов' }, { left: 'root cause', right: 'первопричина' }, { left: 'hotfix', right: 'срочное исправление' }], explanation: 'Терминология отладки и исправления ошибок.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Steps to reproduce the bug."', solution: 'Шаги для воспроизведения бага.', explanation: 'Steps = шаги, to reproduce = для воспроизведения, the bug = баг.' },
        { type: 'task', taskType: 'fill_blank', question: 'The tests ___ (упали) after the latest commit.', solution: 'failed', explanation: '"The tests failed after the latest commit." — failed = прошедшее от fail.' }
      ]
    },
    {
      id: 4,
      title: 'Практика: Деплой и DevOps',
      type: 'practice',
      content: [
        { type: 'task', taskType: 'match', question: 'Окружения:', pairs: [{ left: 'development', right: 'среда разработки' }, { left: 'staging', right: 'тестовое окружение' }, { left: 'production', right: 'боевой сервер' }, { left: 'local', right: 'локальная машина' }], explanation: 'Стандартные окружения в разработке.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Deploy to staging first, then to production."', solution: 'Сначала задеплойте на стейджинг, потом в продакшен.', explanation: 'deploy to = деплоить в. first = сначала, then = потом.' },
        { type: 'task', taskType: 'fill_blank', question: 'We need to ___ (откатить) the deployment.', solution: 'roll back / revert', explanation: '"We need to roll back the deployment." — roll back = откатить, revert = вернуть назад.' },
        { type: 'task', taskType: 'multiple_choice', question: 'CI/CD означает:', options: ['Continuous Integration/Continuous Deployment', 'Code Integration/Code Deployment', 'Computer Interface/Computer Design', 'Client Interface/Client Design'], correct: 0, explanation: 'CI = Continuous Integration (непрерывная интеграция), CD = Continuous Delivery/Deployment (непрерывная доставка/деплой).' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "The build pipeline is failing."', solution: 'Конвейер сборки падает.', explanation: 'build pipeline = конвейер сборки, is failing = падает (Present Continuous).' },
        { type: 'task', taskType: 'match', question: 'Docker-термины:', pairs: [{ left: 'image', right: 'образ контейнера' }, { left: 'container', right: 'запущенный образ' }, { left: 'Dockerfile', right: 'файл конфигурации образа' }, { left: 'registry', right: 'хранилище образов' }], explanation: 'Основные концепции Docker.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Monitor the server logs after deployment."', solution: 'Мониторьте логи сервера после деплоя.', explanation: 'monitor = мониторить, server logs = логи сервера, after deployment = после деплоя.' },
        { type: 'task', taskType: 'fill_blank', question: 'The application ___ (масштабируется) automatically.', solution: 'scales', explanation: '"The application scales automatically." — scale = масштабироваться.' }
      ]
    },
    {
      id: 5,
      title: 'Практика: API и HTTP',
      type: 'practice',
      content: [
        { type: 'task', taskType: 'match', question: 'HTTP методы:', pairs: [{ left: 'GET', right: 'получить данные' }, { left: 'POST', right: 'создать данные' }, { left: 'PUT', right: 'обновить данные' }, { left: 'DELETE', right: 'удалить данные' }], explanation: 'Четыре основных HTTP-метода (CRUD).' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "The API returns a JSON response."', solution: 'API возвращает ответ в формате JSON.', explanation: 'returns = возвращает, a JSON response = ответ в формате JSON.' },
        { type: 'task', taskType: 'match', question: 'HTTP статус-коды:', pairs: [{ left: '200', right: 'успех' }, { left: '404', right: 'не найдено' }, { left: '500', right: 'ошибка сервера' }, { left: '401', right: 'не авторизован' }], explanation: 'Самые важные HTTP статус-коды.' },
        { type: 'task', taskType: 'fill_blank', question: 'Send the API key in the request ___ (заголовке).', solution: 'header', explanation: '"Send the API key in the request header." — header = заголовок запроса.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "The endpoint accepts a query parameter."', solution: 'Эндпоинт принимает параметр запроса.', explanation: 'endpoint = эндпоинт, accepts = принимает, query parameter = параметр запроса (в URL).' },
        { type: 'task', taskType: 'multiple_choice', question: 'REST API означает:', options: ['Representational State Transfer', 'Remote Server Technology', 'Real Simple Transfer', 'Regular Server Test'], correct: 0, explanation: 'REST = Representational State Transfer — архитектурный стиль для веб-сервисов.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Authenticate with a Bearer token."', solution: 'Аутентифицируйтесь с помощью Bearer-токена.', explanation: 'Authenticate = аутентифицируйтесь, with = с помощью, Bearer token = тип токена авторизации.' },
        { type: 'task', taskType: 'fill_blank', question: 'The request ___ (истекло по времени) after 30 seconds.', solution: 'timed out', explanation: '"The request timed out after 30 seconds." — time out = превысить время ожидания.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Базы данных',
      type: 'practice',
      content: [
        { type: 'task', taskType: 'match', question: 'Термины баз данных:', pairs: [{ left: 'table', right: 'таблица' }, { left: 'query', right: 'запрос' }, { left: 'index', right: 'индекс' }, { left: 'migration', right: 'миграция' }], explanation: 'Основные концепции реляционных баз данных.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Run the database migration."', solution: 'Запустите миграцию базы данных.', explanation: 'Run = запустите, the database migration = миграцию базы данных.' },
        { type: 'task', taskType: 'fill_blank', question: 'The query is ___ (медленный) — add an index.', solution: 'slow', explanation: '"The query is slow — add an index." — медленный запрос, нужен индекс.' },
        { type: 'task', taskType: 'multiple_choice', question: 'SQL означает:', options: ['Structured Query Language', 'Server Query Logic', 'Simple Question Language', 'Standard Query List'], correct: 0, explanation: 'SQL = Structured Query Language — язык структурированных запросов для работы с БД.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Back up the database before the migration."', solution: 'Сделайте резервную копию базы данных перед миграцией.', explanation: 'Back up = создать резервную копию, before = перед, the migration = миграцией.' },
        { type: 'task', taskType: 'match', question: 'Типы БД:', pairs: [{ left: 'relational (SQL)', right: 'PostgreSQL, MySQL' }, { left: 'document (NoSQL)', right: 'MongoDB' }, { left: 'key-value', right: 'Redis' }, { left: 'graph', right: 'Neo4j' }], explanation: 'Основные типы баз данных.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "The query returns all users from the database."', solution: 'Запрос возвращает всех пользователей из базы данных.', explanation: 'returns = возвращает, all users = всех пользователей, from the database = из базы данных.' },
        { type: 'task', taskType: 'fill_blank', question: 'Use a ___ (транзакцию) to ensure data integrity.', solution: 'transaction', explanation: '"Use a transaction to ensure data integrity." — транзакция = атомарная операция.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Безопасность',
      type: 'practice',
      content: [
        { type: 'task', taskType: 'match', question: 'Термины безопасности:', pairs: [{ left: 'authentication', right: 'подтверждение личности' }, { left: 'authorization', right: 'предоставление прав' }, { left: 'encryption', right: 'шифрование' }, { left: 'vulnerability', right: 'уязвимость' }], explanation: 'Основные концепции безопасности.' },
        { type: 'task', taskType: 'multiple_choice', question: 'Разница между authentication и authorization?', options: ['Auth = кто вы, Authz = что можете делать', 'Одно и то же', 'Auth = права, Authz = личность', 'Auth = пароль, Authz = токен'], correct: 0, explanation: 'Authentication (AuthN) = кто вы (логин/пароль). Authorization (AuthZ) = что вам можно делать (права доступа).' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Enable two-factor authentication."', solution: 'Включите двухфакторную аутентификацию.', explanation: 'Enable = включить, two-factor authentication = двухфакторная аутентификация (2FA).' },
        { type: 'task', taskType: 'fill_blank', question: 'Never store passwords in ___ (незашифрованном) text.', solution: 'plain', explanation: '"Never store passwords in plain text." — plain text = незашифрованный/открытый текст.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "The API key was compromised."', solution: 'API-ключ был скомпрометирован.', explanation: 'was compromised = был скомпрометирован (пассивный залог прошедшего времени).' },
        { type: 'task', taskType: 'multiple_choice', question: 'Что такое "SQL injection"?', options: ['атака через SQL-запрос', 'установка SQL', 'тип базы данных', 'SQL-функция'], correct: 0, explanation: 'SQL injection — атака, при которой злоумышленник вставляет SQL-код в запрос.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Use HTTPS to encrypt data in transit."', solution: 'Используйте HTTPS для шифрования данных при передаче.', explanation: 'Use = используйте, to encrypt = для шифрования, in transit = при передаче.' },
        { type: 'task', taskType: 'fill_blank', question: 'Generate a new ___ (токен) after the security breach.', solution: 'token', explanation: '"Generate a new token after the security breach." — после взлома нужен новый токен.' }
      ]
    },
    {
      id: 8,
      title: 'Практика: Облако и архитектура',
      type: 'practice',
      content: [
        { type: 'task', taskType: 'match', question: 'Облачные сервисы:', pairs: [{ left: 'AWS', right: 'Amazon Web Services' }, { left: 'GCP', right: 'Google Cloud Platform' }, { left: 'Azure', right: 'Microsoft Cloud' }, { left: 'SaaS', right: 'Software as a Service' }], explanation: 'Основные облачные провайдеры.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Deploy the app to the cloud."', solution: 'Задеплойте приложение в облако.', explanation: 'Deploy to the cloud = задеплоить в облако.' },
        { type: 'task', taskType: 'multiple_choice', question: 'Что такое "microservices"?', options: ['архитектура из маленьких независимых сервисов', 'маленькие программы', 'сервисы для мобильных', 'простые API'], correct: 0, explanation: 'Microservices — архитектурный подход, где приложение состоит из маленьких независимых сервисов.' },
        { type: 'task', taskType: 'fill_blank', question: 'The service is running in a Docker ___ (контейнере).', solution: 'container', explanation: '"The service is running in a Docker container."' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Scale up the service during peak traffic."', solution: 'Масштабируйте сервис в периоды пиковой нагрузки.', explanation: 'Scale up = масштабировать вверх, during peak traffic = в периоды пиковой нагрузки.' },
        { type: 'task', taskType: 'match', question: 'Паттерны архитектуры:', pairs: [{ left: 'monolith', right: 'единое приложение' }, { left: 'microservices', right: 'множество маленьких сервисов' }, { left: 'serverless', right: 'функции без сервера' }, { left: 'event-driven', right: 'архитектура на событиях' }], explanation: 'Основные архитектурные паттерны.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "The load balancer distributes traffic."', solution: 'Балансировщик нагрузки распределяет трафик.', explanation: 'load balancer = балансировщик нагрузки, distributes traffic = распределяет трафик.' },
        { type: 'task', taskType: 'fill_blank', question: 'Store the config in ___ (переменных окружения).', solution: 'environment variables', explanation: '"Store the config in environment variables." — env vars = переменные окружения.' }
      ]
    },
    {
      id: 9,
      title: 'Практика: Инструменты разработчика',
      type: 'practice',
      content: [
        { type: 'task', taskType: 'match', question: 'Инструменты:', pairs: [{ left: 'IDE', right: 'среда разработки' }, { left: 'linter', right: 'проверщик стиля кода' }, { left: 'formatter', right: 'форматировщик кода' }, { left: 'debugger', right: 'инструмент отладки' }], explanation: 'Основные инструменты разработчика.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Run the linter before committing."', solution: 'Запустите линтер перед коммитом.', explanation: 'Run = запустите, the linter = линтер, before committing = перед коммитом.' },
        { type: 'task', taskType: 'fill_blank', question: 'Install the ___ (зависимости) with npm install.', solution: 'dependencies', explanation: '"Install the dependencies with npm install." — dependencies = зависимости.' },
        { type: 'task', taskType: 'multiple_choice', question: 'Что такое "package manager"?', options: ['инструмент управления зависимостями', 'менеджер пакетов', 'оба варианта одинаковы', 'система контроля версий'], correct: 2, explanation: 'Package manager = менеджер пакетов = инструмент управления зависимостями (npm, pip, yarn).' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Configure the environment variables in .env file."', solution: 'Настройте переменные окружения в файле .env.', explanation: 'Configure = настройте, environment variables = переменные окружения, in .env file = в файле .env.' },
        { type: 'task', taskType: 'match', question: 'Типы тестов:', pairs: [{ left: 'unit tests', right: 'тесты отдельных компонентов' }, { left: 'integration tests', right: 'тесты взаимодействия компонентов' }, { left: 'e2e tests', right: 'тесты всего приложения' }, { left: 'smoke tests', right: 'базовая проверка работоспособности' }], explanation: 'Пирамида тестирования.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Write tests before writing the implementation."', solution: 'Пишите тесты перед написанием реализации.', explanation: 'Это принцип TDD (Test-Driven Development) — разработки через тестирование.' },
        { type: 'task', taskType: 'fill_blank', question: 'Code ___ (покрытие) should be at least 80%.', solution: 'coverage', explanation: '"Code coverage should be at least 80%." — code coverage = покрытие тестами.' }
      ]
    },
    {
      id: 10,
      title: 'Практика: IT-термины — финальный тест',
      type: 'practice',
      content: [
        { type: 'task', taskType: 'translate', question: 'Переведите: "The API is rate-limited to 100 requests per minute."', solution: 'API имеет ограничение скорости — 100 запросов в минуту.', explanation: 'rate-limited = ограниченный по частоте, requests per minute = запросов в минуту.' },
        { type: 'task', taskType: 'multiple_choice', question: 'Что означает "deprecated"?', options: ['устарело, не рекомендуется использовать', 'удалено', 'сломано', 'секретно'], correct: 0, explanation: 'Deprecated = устаревший API/функция, которую не рекомендуется использовать — скоро удалят.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Handle the edge cases in your implementation."', solution: 'Обработайте граничные случаи в вашей реализации.', explanation: 'Handle = обработать, edge cases = граничные случаи, implementation = реализация.' },
        { type: 'task', taskType: 'fill_blank', question: 'The server has 99.9% ___ (время работы без сбоев).', solution: 'uptime', explanation: '"The server has 99.9% uptime." — uptime = время непрерывной работы.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Optimize the database query for performance."', solution: 'Оптимизируйте запрос к базе данных для производительности.', explanation: 'Optimize = оптимизируйте, the database query = запрос к БД, for performance = для производительности.' },
        { type: 'task', taskType: 'match', question: 'Соедините концепции:', pairs: [{ left: 'DRY', right: 'Don\'t Repeat Yourself' }, { left: 'SOLID', right: 'принципы ООП-дизайна' }, { left: 'KISS', right: 'Keep It Simple, Stupid' }, { left: 'YAGNI', right: 'You Aren\'t Gonna Need It' }], explanation: 'Принципы хорошего программирования.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Document your code for future developers."', solution: 'Документируйте ваш код для будущих разработчиков.', explanation: 'Document = документируйте, for future developers = для будущих разработчиков.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "The tech debt is slowing us down."', solution: 'Технический долг тормозит нас.', explanation: 'tech debt = технический долг (накопленные проблемы в коде), is slowing us down = тормозит нас.' }
      ]
    }
  ]
}
