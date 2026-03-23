export default {
  id: 32,
  title: 'Practice: Reading Documentation',
  description: 'Практикум по чтению документации: README, API docs, Stack Overflow, GitHub.',
  lessons: [
    {
      id: 1,
      title: 'Чтение README — тест',
      type: 'practice',
            description: 'Прочитайте фрагмент README и ответьте на вопросы.',
      solution: 'Правильные ответы:\\n1. A lightweight, thread-safe caching library for Node.js.\\n2. Time To Live.\\n3. Redis and Memcached.\\n4. npm install fastcache\\n5. The library does not require any other packages to work.\\n6. Потокобезопасная библиотека кэширования с настраиваемым TTL.',
content: [
        { type: 'text', value: 'Прочитайте фрагмент README и ответьте на вопросы.\n\n---\n# FastCache - High-Performance Caching Library\n\nFastCache is a lightweight, thread-safe caching library for Node.js. It supports TTL (Time To Live), LRU eviction, and multiple storage backends.\n\n## Features\n- In-memory caching with configurable TTL\n- LRU (Least Recently Used) eviction policy\n- Support for Redis and Memcached backends\n- TypeScript support\n- Zero dependencies\n\n## Installation\nnpm install fastcache\n\n## Quick Start\nconst cache = new FastCache({ ttl: 60 }); // TTL in seconds\ncache.set("key", "value");\nconst value = cache.get("key");\n---' },
        {
          type: 'exercise',
          subtype: 'fill_blank',
          items: [
            { id: 1, question: 'What is FastCache?', answer: 'A lightweight, thread-safe caching library for Node.js.' },
            { id: 2, question: 'What does TTL stand for?', answer: 'Time To Live.' },
            { id: 3, question: 'What external storage backends does it support?', answer: 'Redis and Memcached.' },
            { id: 4, question: 'How do you install the library?', answer: 'npm install fastcache' },
            { id: 5, question: 'What does "Zero dependencies" mean?', answer: 'The library does not require any other packages to work.' },
            { id: 6, question: 'Переведи: "Thread-safe caching library with configurable TTL"', answer: 'Потокобезопасная библиотека кэширования с настраиваемым TTL.' }
          ]
        }
      ]
    },
    {
      id: 2,
      title: 'Чтение API документации — тест',
      type: 'practice',
            description: 'Прочитайте описание API endpoint.',
      solution: 'Правильные ответы:\\n1. POST\\n2. email and password\\n3. 409 Conflict\\n4. 8 characters\\n5. 400 Неверный запрос — Неверные входные данные.\\n6. It is not required — you can send the request without it.',
content: [
        { type: 'text', value: 'Прочитайте описание API endpoint.\n\n---\nPOST /api/v1/users/register\n\nRegisters a new user account.\n\nRequest Body (application/json):\n{\n  "email": string (required),\n  "password": string (required, min 8 chars),\n  "name": string (optional)\n}\n\nResponse:\n201 Created - User created successfully\n400 Bad Request - Invalid input data\n409 Conflict - Email already exists\n\nExample Response (201):\n{\n  "id": "uuid",\n  "email": "user@example.com",\n  "name": "John Doe",\n  "createdAt": "2024-01-15T10:30:00Z"\n}\n---' },
        {
          type: 'exercise',
          subtype: 'fill_blank',
          items: [
            { id: 1, question: 'What HTTP method is used?', answer: 'POST' },
            { id: 2, question: 'Which fields are required?', answer: 'email and password' },
            { id: 3, question: 'What response code means "email already exists"?', answer: '409 Conflict' },
            { id: 4, question: 'What is the minimum length for the password?', answer: '8 characters' },
            { id: 5, question: 'Переведи: "400 Bad Request - Invalid input data"', answer: '400 Неверный запрос — Неверные входные данные.' },
            { id: 6, question: 'What does "optional" mean for the "name" field?', answer: 'It is not required — you can send the request without it.' }
          ]
        }
      ]
    },
    {
      id: 3,
      title: 'Чтение Stack Overflow — тест',
      type: 'practice',
            description: 'Прочитайте ответ и ответьте на вопросы.',
      solution: 'Правильные ответы:\\n1. 1. try/catch block. 2. .catch() chained to the promise.\\n2. try/catch\\n3. Unhandled promise rejections can crash Node.js.\\n4. Необработанные отказы промисов могут крашнуть Node.js.\\n5. null',
content: [
        { type: 'text', value: 'Прочитайте ответ и ответьте на вопросы.\n\n---\nQuestion: How do I handle async/await errors in JavaScript?\n\nAnswer (2.1k upvotes):\nThere are two main ways to handle errors with async/await:\n\n1. Using try/catch (recommended):\nasync function fetchUser(id) {\n  try {\n    const response = await fetch("/api/users/" + id);\n    const data = await response.json();\n    return data;\n  } catch (error) {\n    console.error("Failed to fetch user:", error);\n    return null;\n  }\n}\n\n2. Using .catch() chained to the promise:\nconst user = await fetchUser(id).catch(err => {\n  console.error(err);\n  return null;\n});\n\nNote: Always handle errors in async functions! Unhandled promise rejections can crash Node.js.\n---' },
        {
          type: 'exercise',
          subtype: 'fill_blank',
          items: [
            { id: 1, question: 'What are the two ways to handle async/await errors?', answer: '1. try/catch block. 2. .catch() chained to the promise.' },
            { id: 2, question: 'Which method is recommended?', answer: 'try/catch' },
            { id: 3, question: 'What happens if you don\'t handle errors in async functions?', answer: 'Unhandled promise rejections can crash Node.js.' },
            { id: 4, question: 'Переведи: "Unhandled promise rejections can crash Node.js"', answer: 'Необработанные отказы промисов могут крашнуть Node.js.' },
            { id: 5, question: 'What does the function return if an error occurs?', answer: 'null' }
          ]
        }
      ]
    },
    {
      id: 4,
      title: 'Чтение GitHub Issue — тест',
      type: 'practice',
            description: 'Прочитайте GitHub Issue.',
      solution: 'Правильные ответы:\\n1. A memory leak in the WebSocket connection handler.\\n2. Memory usage stays stable.\\n3. Memory grows continuously until OOM error.\\n4. Event listeners are not being cleaned up when clients disconnect.\\n5. In PR #456.\\n6. Ошибка нехватки памяти.',
content: [
        { type: 'text', value: 'Прочитайте GitHub Issue.\n\n---\nTitle: [Bug] Memory leak in WebSocket connection handler\nLabels: bug, high-priority\nAssigned to: @backend-team\n\nDescription:\nWe\'re experiencing a significant memory leak in production. The server\'s memory usage grows from 200MB to 2GB over 24 hours, then the service crashes.\n\nSteps to Reproduce:\n1. Start the WebSocket server\n2. Connect 100+ WebSocket clients\n3. Wait 2+ hours\n\nExpected: Memory usage stays stable\nActual: Memory grows continuously until OOM (Out of Memory) error\n\nEnvironment: Node.js 18, Ubuntu 22.04\n\nComment from @alice-dev: I found the issue — event listeners are not being cleaned up when clients disconnect. PR #456 fixes this.\n---' },
        {
          type: 'exercise',
          subtype: 'fill_blank',
          items: [
            { id: 1, question: 'What is the bug?', answer: 'A memory leak in the WebSocket connection handler.' },
            { id: 2, question: 'What is the expected behaviour?', answer: 'Memory usage stays stable.' },
            { id: 3, question: 'What is the actual behaviour?', answer: 'Memory grows continuously until OOM error.' },
            { id: 4, question: 'What caused the bug?', answer: 'Event listeners are not being cleaned up when clients disconnect.' },
            { id: 5, question: 'Where is the fix?', answer: 'In PR #456.' },
            { id: 6, question: 'Переведи: "OOM (Out of Memory) error"', answer: 'Ошибка нехватки памяти.' }
          ]
        }
      ]
    },
    {
      id: 5,
      title: 'Чтение PR Description — тест',
      type: 'practice',
            description: 'Прочитайте описание Pull Request.',
      solution: 'Правильные ответы:\\n1. Removes jQuery and rewrites the code using vanilla JavaScript.\\n2. By 87KB (from 124KB to 37KB).\\n3. 23 files.\\n4. No, there are no breaking changes.\\n5. Меньше зависимостей = меньше рисков безопасности.',
content: [
        { type: 'text', value: 'Прочитайте описание Pull Request.\n\n---\nTitle: refactor: replace jQuery with vanilla JS\nAuthor: @tom-dev\nBase branch: develop\n\n## Summary\nThis PR removes the jQuery dependency and rewrites the affected code using vanilla JavaScript (ES6+). The bundle size is reduced by 87KB (from 124KB to 37KB).\n\n## Why\n- jQuery is not needed for modern browsers\n- Reducing bundle size improves page load time\n- Fewer dependencies = less security risk\n\n## Changes\n- Removed jQuery from package.json\n- Rewrote DOM manipulation using querySelector/addEventListener\n- Updated 23 files\n\n## Testing\n- All 156 existing tests pass\n- Tested in Chrome 120, Firefox 121, Safari 17\n\nBreaking change: None\nCloses #89, #134\n---' },
        {
          type: 'exercise',
          subtype: 'fill_blank',
          items: [
            { id: 1, question: 'What does this PR do?', answer: 'Removes jQuery and rewrites the code using vanilla JavaScript.' },
            { id: 2, question: 'By how much was the bundle size reduced?', answer: 'By 87KB (from 124KB to 37KB).' },
            { id: 3, question: 'How many files were updated?', answer: '23 files.' },
            { id: 4, question: 'Are there any breaking changes?', answer: 'No, there are no breaking changes.' },
            { id: 5, question: 'Переведи: "Fewer dependencies = less security risk"', answer: 'Меньше зависимостей = меньше рисков безопасности.' }
          ]
        }
      ]
    },
    {
      id: 6,
      title: 'Чтение технической статьи — тест',
      type: 'practice',
            description: 'Прочитайте фрагмент технической статьи.',
      solution: 'Правильные ответы:\\n1. It automates deployment, scaling, and management of containerized applications.\\n2. It automatically replaces failed containers.\\n3. Deploying new versions without downtime.\\n4. It has a steep learning curve.\\n5. K8s имеет крутую кривую обучения (сложно изучить).',
content: [
        { type: 'text', value: 'Прочитайте фрагмент технической статьи.\n\n---\n"Container orchestration has become essential for modern cloud applications. Docker provides the container runtime, but managing hundreds of containers manually is not practical. This is where Kubernetes comes in.\n\nKubernetes, often abbreviated as K8s, automates deployment, scaling, and management of containerized applications. It groups containers into pods and manages them across multiple nodes (servers).\n\nThe main benefits are: automatic scaling based on load, self-healing (automatically replacing failed containers), and rolling updates (deploying new versions without downtime).\n\nHowever, Kubernetes has a steep learning curve. Setting it up correctly requires deep knowledge of networking, storage, and security."\n---' },
        {
          type: 'exercise',
          subtype: 'fill_blank',
          items: [
            { id: 1, question: 'What does Kubernetes do?', answer: 'It automates deployment, scaling, and management of containerized applications.' },
            { id: 2, question: 'What does "self-healing" mean?', answer: 'It automatically replaces failed containers.' },
            { id: 3, question: 'What is "rolling update"?', answer: 'Deploying new versions without downtime.' },
            { id: 4, question: 'What is the main disadvantage of Kubernetes?', answer: 'It has a steep learning curve.' },
            { id: 5, question: 'Переведи: "K8s has a steep learning curve"', answer: 'K8s имеет крутую кривую обучения (сложно изучить).' }
          ]
        }
      ]
    },
    {
      id: 7,
      title: 'Понимание commit messages — тест',
      type: 'practice',
            description: 'Определите тип и смысл каждого commit message.',
      solution: 'Правильные ответы:\\n1. Добавляет вход через Google OAuth в модуль аутентификации. Тип: feature (новая функция).\\n2. Исправляет обработку null-ответа от сервиса пользователей. Тип: bugfix.\\n3. Обновляет React с версии 17 до 18. Тип: chore (техническая задача).\\n4. Добавляет индекс к колонке users.email для улучшения производительности. Тип: performance.\\n5. Откатывает коммит abc123, который сломал продакшн. Тип: revert.',
content: [
        { type: 'text', value: 'Определите тип и смысл каждого commit message.' },
        {
          type: 'exercise',
          subtype: 'translation',
          items: [
            { id: 1, question: 'Что делает этот коммит: "feat(auth): add Google OAuth login"?', answer: 'Добавляет вход через Google OAuth в модуль аутентификации. Тип: feature (новая функция).' },
            { id: 2, question: 'Что делает: "fix(api): handle null response from user service"?', answer: 'Исправляет обработку null-ответа от сервиса пользователей. Тип: bugfix.' },
            { id: 3, question: 'Что делает: "chore(deps): update React from 17 to 18"?', answer: 'Обновляет React с версии 17 до 18. Тип: chore (техническая задача).' },
            { id: 4, question: 'Что делает: "perf(db): add index to users.email column"?', answer: 'Добавляет индекс к колонке users.email для улучшения производительности. Тип: performance.' },
            { id: 5, question: 'Что делает: "revert: revert commit abc123 (breaks production)"?', answer: 'Откатывает коммит abc123, который сломал продакшн. Тип: revert.' }
          ]
        }
      ]
    },
    {
      id: 8,
      title: 'Поиск ошибок в документации — тест',
      type: 'practice',
            description: 'Найдите ключевую информацию в тексте.',
      solution: 'Правильные ответы:\\n1. The /api/v1/users endpoint.\\n2. /api/v2/users\\n3. December 31, 2024.\\n4. 410 Gone\\n5. Pagination and filtering.\\n6. Этот эндпоинт устарел и будет удалён.',
content: [
        { type: 'text', value: 'Найдите ключевую информацию в тексте.\n\n---\nCaution: This API endpoint is deprecated and will be removed in version 4.0. Please migrate to /api/v2/users instead. The v2 endpoint provides the same functionality with additional features including pagination and filtering.\n\nThe old endpoint /api/v1/users will continue to work until December 31, 2024. After that date, all requests will return a 410 Gone response.\n---' },
        {
          type: 'exercise',
          subtype: 'fill_blank',
          items: [
            { id: 1, question: 'What is deprecated?', answer: 'The /api/v1/users endpoint.' },
            { id: 2, question: 'What should developers use instead?', answer: '/api/v2/users' },
            { id: 3, question: 'When will the old endpoint stop working?', answer: 'December 31, 2024.' },
            { id: 4, question: 'What HTTP status will old requests return after that date?', answer: '410 Gone' },
            { id: 5, question: 'What new features does v2 have?', answer: 'Pagination and filtering.' },
            { id: 6, question: 'Переведи: "This endpoint is deprecated and will be removed"', answer: 'Этот эндпоинт устарел и будет удалён.' }
          ]
        }
      ]
    },
    {
      id: 9,
      title: 'Чтение error messages — тест',
      type: 'practice',
            description: 'Прочитайте сообщения об ошибках и объясните их значение на русском.',
      solution: 'Правильные ответы:\\n1. Ошибка: Нельзя читать свойство \'name\' у undefined. Значит переменная не инициализирована или равна undefined.\\n2. Соединение отклонено на localhost:5432. PostgreSQL, скорее всего, не запущен.\\n3. Синтаксическая ошибка: Неожиданный символ \'}\' в строке 47. Лишняя или пропущенная скобка.\\n4. 403 Запрещено: У тебя нет прав для доступа к этому ресурсу.\\n5. Ошибка таймаута: Запрос превысил время ожидания (30 секунд).',
content: [
        { type: 'text', value: 'Прочитайте сообщения об ошибках и объясните их значение на русском.' },
        {
          type: 'exercise',
          subtype: 'translation',
          items: [
            { id: 1, question: '"Error: Cannot read property \'name\' of undefined"', answer: 'Ошибка: Нельзя читать свойство \'name\' у undefined. Значит переменная не инициализирована или равна undefined.' },
            { id: 2, question: '"ECONNREFUSED: Connection refused at 127.0.0.1:5432"', answer: 'Соединение отклонено на localhost:5432. PostgreSQL, скорее всего, не запущен.' },
            { id: 3, question: '"SyntaxError: Unexpected token \'}\' at line 47"', answer: 'Синтаксическая ошибка: Неожиданный символ \'}\' в строке 47. Лишняя или пропущенная скобка.' },
            { id: 4, question: '"403 Forbidden: You don\'t have permission to access this resource"', answer: '403 Запрещено: У тебя нет прав для доступа к этому ресурсу.' },
            { id: 5, question: '"TimeoutError: Request timed out after 30000ms"', answer: 'Ошибка таймаута: Запрос превысил время ожидания (30 секунд).' }
          ]
        }
      ]
    },
    {
      id: 10,
      title: 'Составление документации — написание',
      type: 'practice',
            description: 'Напишите краткую документацию для API endpoint.',
      solution: 'Примеры ответов:\\n1. GET /api/v1/products\\n\\nReturns a list of products.\\n\\nQuery Parameters:\\n- page: integer (optional) - page number for pagination\\n- limit: integer (optional, max 100) - number of items per page\\n\\nRe...',
content: [
        { type: 'text', value: 'Напишите краткую документацию для API endpoint.' },
        {
          type: 'exercise',
          subtype: 'writing',
          items: [
            { id: 1, question: 'Напишите документацию для: GET /api/v1/products — возвращает список продуктов. Параметры: page (int, опционально), limit (int, опционально, макс 100). Ответ: 200 с массивом продуктов.', answer: 'GET /api/v1/products\n\nReturns a list of products.\n\nQuery Parameters:\n- page: integer (optional) - page number for pagination\n- limit: integer (optional, max 100) - number of items per page\n\nResponse:\n200 OK - Returns an array of product objects\n\nExample: GET /api/v1/products?page=2&limit=20' }
          ]
        }
      ]
    }
  ]
}
