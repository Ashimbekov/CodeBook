export default {
  id: 24,
  title: 'Git для веб-разработки',
  description: 'Система контроля версий Git — init, add, commit, branch, merge для веб-проектов',
  lessons: [
    {
      id: 1,
      title: 'Git: основные концепции',
      type: 'theory',
      content: [
        { type: 'text', value: 'Git — система контроля версий. Она сохраняет историю изменений кода, позволяет работать в команде и откатываться к предыдущим версиям.' },
        { type: 'heading', value: 'Ключевые понятия' },
        { type: 'list', items: [
          'Repository (репо) — папка проекта с историей изменений (.git)',
          'Commit — "снимок" состояния файлов в момент времени',
          'Branch (ветка) — независимая линия разработки',
          'Merge — слияние двух веток',
          'Remote — удалённый сервер (GitHub, GitLab, Bitbucket)',
          'Clone — копирование репо с сервера'
        ]},
        { type: 'code', language: 'javascript', value: '// Git команды — выполняются в терминале\n// Настройка при первом использовании\n// git config --global user.name "Нурдаулет"\n// git config --global user.email "nur@example.com"' }
      ]
    },
    {
      id: 2,
      title: 'Первые шаги: init, add, commit',
      type: 'theory',
      content: [
        { type: 'text', value: 'Три основных команды для работы с локальным репозиторием.' },
        { type: 'code', language: 'javascript', value: '// Инициализация репозитория\n// git init\n// Создаёт папку .git в текущей директории\n\n// Статус изменений\n// git status\n// Показывает изменённые, новые, удалённые файлы\n\n// Добавить файлы в "зону подготовки" (staging)\n// git add index.html          — один файл\n// git add css/                 — целая папка\n// git add .                    — всё\n// git add *.js                 — по маске\n\n// Создать коммит\n// git commit -m "feat: add navigation menu"\n// Сохраняет снимок всех staged файлов\n\n// Просмотр истории\n// git log                      — подробно\n// git log --oneline            — коротко\n// git log --oneline --graph    — с графом веток' },
        { type: 'tip', value: 'Пиши осмысленные сообщения коммитов! "fix: исправить" — плохо. "fix: исправить ошибку валидации email в форме регистрации" — хорошо.' }
      ]
    },
    {
      id: 3,
      title: 'Ветки: branch и merge',
      type: 'theory',
      content: [
        { type: 'text', value: 'Ветки позволяют разрабатывать новые функции параллельно, не ломая основной код.' },
        { type: 'code', language: 'javascript', value: '// Посмотреть ветки\n// git branch                   — локальные ветки\n// git branch -a                — все, включая удалённые\n\n// Создать и переключиться\n// git checkout -b feature/login\n// или новый способ:\n// git switch -c feature/login\n\n// Переключиться на существующую\n// git checkout main\n// git switch main\n\n// Слить ветку в текущую\n// git checkout main\n// git merge feature/login\n\n// Удалить ветку\n// git branch -d feature/login  — после слияния\n// git branch -D feature/login  — принудительно\n\n// Типичный рабочий процесс:\n// 1. git checkout -b feature/new-button\n// 2. Делаешь изменения\n// 3. git add . && git commit -m "add new button"\n// 4. git checkout main\n// 5. git merge feature/new-button' }
      ]
    },
    {
      id: 4,
      title: 'GitHub: push, pull, clone',
      type: 'theory',
      content: [
        { type: 'text', value: 'GitHub — облачный хостинг для Git-репозиториев. Позволяет делиться кодом и работать в команде.' },
        { type: 'code', language: 'javascript', value: '// Клонировать репозиторий с GitHub\n// git clone https://github.com/user/repo.git\n// git clone git@github.com:user/repo.git  (SSH)\n\n// Добавить удалённый репозиторий\n// git remote add origin https://github.com/user/repo.git\n// git remote -v  — посмотреть\n\n// Отправить на GitHub\n// git push origin main         — отправить ветку main\n// git push -u origin main      — первый раз (установить tracking)\n// git push                     — если tracking настроен\n\n// Получить изменения\n// git pull                     — fetch + merge\n// git fetch                    — только загрузить\n\n// Типичный workflow:\n// git add .\n// git commit -m "message"\n// git push\n\n// Разрешение конфликтов:\n// Если git pull говорит о конфликте:\n// 1. Открой файл, найди <<< === >>>\n// 2. Выбери нужный вариант\n// 3. git add <файл>\n// 4. git commit' }
      ]
    },
    {
      id: 5,
      title: '.gitignore и best practices',
      type: 'theory',
      content: [
        { type: 'text', value: '.gitignore — файл со списком того, что Git должен игнорировать.' },
        { type: 'code', language: 'javascript', value: '// .gitignore для веб-проекта\n\n// node_modules/       — зависимости (устанавливаются через npm install)\n// .env               — переменные окружения (секреты!)\n// .env.local         — локальные настройки\n// dist/              — скомпилированный код\n// build/             — сборка\n// .DS_Store          — MacOS\n// Thumbs.db          — Windows\n// *.log              — лог-файлы\n// .idea/             — настройки IDE IntelliJ\n// .vscode/           — настройки VSCode (иногда нужны)\n\n// Конвенции именования веток:\n// main — основная ветка\n// develop — разработка\n// feature/login — новая функция\n// fix/navbar-bug — исправление\n// hotfix/payment — срочное исправление\n\n// Форматы сообщений коммитов (Conventional Commits):\n// feat: новая функция\n// fix: исправление ошибки\n// docs: документация\n// style: форматирование\n// refactor: рефакторинг\n// test: тесты\n// chore: рутинные задачи (обновление зависимостей)' },
        { type: 'tip', value: 'Никогда не коммить .env файлы с паролями и API-ключами! Если случайно закоммитил — ключи нужно сразу сменить, история git не "стирает" их.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Git workflow',
      type: 'practice',
      difficulty: 'easy',
      description: 'Инициализируй репозиторий, создай несколько коммитов, ветку и слей её с main.',
      requirements: [
        'git init в новой папке проекта',
        'Создай index.html, добавь и закоммить',
        'Создай ветку feature/add-styles',
        'Добавь style.css, закоммить в этой ветке',
        'Вернись в main и слей ветку',
        'Просмотри историю через git log --oneline'
      ],
      expectedOutput: 'Репозиторий с историей коммитов и слиянием веток',
      hint: 'Последовательность: git init → создать файлы → git add . → git commit -m "..." → git checkout -b feature/... → изменения → commit → git checkout main → git merge feature/...',
      solution: '// Последовательность команд:\n\n// 1. Инициализация\n// mkdir my-website && cd my-website\n// git init\n\n// 2. Первый коммит\n// echo "<!DOCTYPE html><html><body><h1>Hello</h1></body></html>" > index.html\n// git add index.html\n// git commit -m "feat: initial HTML structure"\n\n// 3. Ветка для стилей\n// git checkout -b feature/add-styles\n// echo "body { font-family: Arial; }" > style.css\n// git add style.css\n// git commit -m "feat: add base styles"\n\n// 4. Линковка CSS в HTML\n// Добавь <link rel="stylesheet" href="style.css"> в HTML\n// git add index.html\n// git commit -m "feat: link stylesheet to HTML"\n\n// 5. Слияние\n// git checkout main\n// git merge feature/add-styles\n\n// 6. История\n// git log --oneline --graph\n// * a1b2c3 feat: link stylesheet to HTML\n// * d4e5f6 feat: add base styles\n// * 7g8h9i feat: initial HTML structure',
      explanation: 'Git workflow: всегда работай в ветках. main/master — всегда рабочий код. Новая функция — новая ветка. После проверки — merge в main. Это защищает от случайных поломок основного кода.'
    }
  ]
}
