export default {
  id: 17,
  title: 'IT: Git and Version Control',
  description: 'Git и контроль версий на английском: commit, push, pull, merge, branch, conflict, rebase.',
  lessons: [
    {
      id: 1,
      title: 'Основные Git-команды',
      type: 'theory',
      content: [
        { type: 'text', value: 'Основной Git-словарь:\n\nrepository (repo) — репозиторий: хранилище кода\ncommit — коммит: сохранение изменений с сообщением\nbranch — ветка: независимая линия разработки\nmerge — слияние: объединение веток\npush — загрузить изменения на удалённый сервер\npull — скачать изменения с удалённого сервера\nclone — клонировать репозиторий\nfork — копия чужого репозитория\npull request (PR) — запрос на слияние\nstash — временное сохранение изменений' },
        { type: 'heading', value: 'Описание Git-действий' },
        { type: 'text', value: 'I committed my changes. (Я закоммитил изменения.)\nShe pushed the code to the remote. (Она запушила код на удалённый сервер.)\nWe pulled the latest changes. (Мы скачали последние изменения.)\nHe created a new branch. (Он создал новую ветку.)\nThe team merged the pull request. (Команда смержила pull request.)\nI cloned the repository. (Я клонировал репозиторий.)\nShe stashed her changes. (Она стэшнула изменения.)\nWe rebased the branch. (Мы перебазировали ветку.)' }
      ]
    },
    {
      id: 2,
      title: 'Branches: работа с ветками',
      type: 'theory',
      content: [
        { type: 'text', value: 'BRANCH (ветка) — изолированная линия разработки\n\nТипы веток:\nmain / master — основная ветка\ndevelop — ветка разработки\nfeature branch — ветка для новой функции (feature/login-page)\nbugfix branch — ветка для исправления бага (bugfix/null-pointer)\nhotfix branch — ветка для срочного исправления (hotfix/critical-auth-bug)\nrelease branch — ветка для релиза\n\nОписание работы с ветками:\nCreate a new branch for each feature. (Создавай новую ветку для каждой функции.)\nSwitch to the feature branch. (Переключись на ветку с функцией.)\nBranch off from develop. (Создай ветку от develop.)\nMerge the feature branch into develop. (Смержи ветку с функцией в develop.)\nDelete the branch after merging. (Удали ветку после слияния.)\nKeep the branch up to date with main. (Держи ветку актуальной с main.)' }
      ]
    },
    {
      id: 3,
      title: 'Commit Messages: написание коммит-сообщений',
      type: 'theory',
      content: [
        { type: 'text', value: 'Хорошие коммит-сообщения описывают ЧТО изменилось и ПОЧЕМУ.\n\nФорматы коммит-сообщений (Conventional Commits):\nfeat: add user authentication (новая функция)\nfix: resolve null pointer exception (исправление бага)\nrefactor: extract validation logic (рефакторинг)\ndocs: update API documentation (документация)\ntest: add unit tests for UserService (тесты)\nchore: update dependencies (технические задачи)\nperf: optimize database queries (производительность)\n\nПримеры хороших коммит-сообщений:\nfeat: implement JWT authentication for API endpoints\nfix: handle empty array in getUserList function\nrefactor: move payment logic to separate service\ntest: add integration tests for checkout flow\ndocs: add API usage examples to README' },
        { type: 'heading', value: 'Как говорить о коммитах' },
        { type: 'text', value: 'I made a commit with the message "fix: handle null values". (Я сделал коммит с сообщением "fix: handle null values".)\nShe wrote a descriptive commit message. (Она написала описательное сообщение коммита.)\nThe commit history shows all changes. (История коммитов показывает все изменения.)\nRevert the commit — it broke the build. (Откати коммит — он сломал билд.)\nAmend the last commit. (Изменить последний коммит.)\nThis commit introduced a regression. (Этот коммит вызвал регрессию.)' }
      ]
    },
    {
      id: 4,
      title: 'Pull Requests: обзор кода',
      type: 'theory',
      content: [
        { type: 'text', value: 'PULL REQUEST (PR) — запрос на слияние изменений\n\nЦикл работы с PR:\n1. Create a branch. (Создай ветку.)\n2. Make changes and commit. (Внеси изменения и закоммить.)\n3. Push the branch. (Запуши ветку.)\n4. Open a pull request. (Открой pull request.)\n5. Request a code review. (Попроси код-ревью.)\n6. Address review comments. (Учти комментарии к ревью.)\n7. Get approval. (Получи одобрение.)\n8. Merge the PR. (Смержи PR.)\n\nТерминология PR:\nopen a PR — открыть PR\nreview a PR — провести ревью PR\napprove a PR — одобрить PR\nrequest changes — запросить изменения\nmerge a PR — смержить PR\nclose/reject a PR — закрыть/отклонить PR\nresolve a comment — разрешить комментарий\ndraft PR — черновой PR' },
        { type: 'heading', value: 'Фразы для PR-описаний' },
        { type: 'text', value: 'This PR implements user authentication. (Этот PR реализует аутентификацию пользователей.)\nChanges include: (Изменения включают:)\nThis PR fixes the null pointer exception in getUserList. (Этот PR исправляет исключение null pointer в getUserList.)\nRelated to issue #123. (Связано с задачей #123.)\nTested on: Chrome, Firefox, Safari. (Протестировано на: Chrome, Firefox, Safari.)' }
      ]
    },
    {
      id: 5,
      title: 'Merge Conflicts: разрешение конфликтов',
      type: 'theory',
      content: [
        { type: 'text', value: 'MERGE CONFLICT — конфликт слияния (когда два человека изменили одно и то же место)\n\nТерминология:\nconflict — конфликт\nresolve a conflict — разрешить конфликт\ncurrent change — текущее изменение (ваша ветка)\nincoming change — входящее изменение (другая ветка)\naccept current — принять текущее\naccept incoming — принять входящее\naccept both — принять оба\n\nОписание процесса:\nThere is a merge conflict in this file. (В этом файле есть конфликт слияния.)\nResolve the conflict before merging. (Разреши конфликт перед слиянием.)\nThe conflict occurred because both branches modified the same line. (Конфликт возник, потому что обе ветки изменили одну строку.)\nI resolved the conflict by accepting the incoming change. (Я разрешил конфликт, приняв входящее изменение.)\nKeep both changes by merging them manually. (Сохрани оба изменения, объединив их вручную.)' }
      ]
    },
    {
      id: 6,
      title: 'Rebase и другие продвинутые команды',
      type: 'theory',
      content: [
        { type: 'text', value: 'REBASE — перебазирование (перемещение коммитов на другую базу)\nRebase your branch on top of main. (Перебазируй ветку поверх main.)\nRebase keeps the history clean and linear. (Rebase сохраняет историю чистой и линейной.)\nDon\'t rebase shared branches. (Не перебазируй общие ветки.)\n\nDIFF — разница между версиями\nView the diff before committing. (Посмотри diff перед коммитом.)\nThe diff shows what has changed. (Diff показывает, что изменилось.)\n\nGIT LOG — история коммитов\nCheck the commit log. (Проверь историю коммитов.)\nThe log shows who made each change and when. (Лог показывает кто внёс каждое изменение и когда.)\n\nGIT BLAME — кто написал эту строку\nUse git blame to find who changed this line. (Используй git blame, чтобы найти кто изменил эту строку.)' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Git-терминология',
      type: 'practice',
            description: 'Переведите фразы на английский язык.',
      solution: 'Правильные ответы:\\n1. I created a new branch for this feature.\\n2. Please open a pull request for review.\\n3. There is a merge conflict in this file.\\n4. I reverted the last commit because it broke the build.\\n5. Merge the branch after approval.\\n6. The commit history shows all changes.\\n7. Clone the repository and create a branch.',
content: [
        { type: 'text', value: 'Переведите фразы на английский язык.' },
        {
          type: 'exercise',
          subtype: 'translation',
          items: [
            { id: 1, question: 'Я создал новую ветку для этой функции.', answer: 'I created a new branch for this feature.' },
            { id: 2, question: 'Пожалуйста, открой pull request для ревью.', answer: 'Please open a pull request for review.' },
            { id: 3, question: 'В этом файле есть конфликт слияния.', answer: 'There is a merge conflict in this file.' },
            { id: 4, question: 'Я откатил последний коммит, потому что он сломал билд.', answer: 'I reverted the last commit because it broke the build.' },
            { id: 5, question: 'Смержи ветку после одобрения.', answer: 'Merge the branch after approval.' },
            { id: 6, question: 'История коммитов показывает все изменения.', answer: 'The commit history shows all changes.' },
            { id: 7, question: 'Клонируй репозиторий и создай ветку.', answer: 'Clone the repository and create a branch.' }
          ]
        }
      ]
    }
  ]
}
