export default {
  id: 6,
  title: 'Git: продвинутый уровень',
  description: 'Продвинутые возможности Git: rebase, cherry-pick, hooks, стратегии ветвления, разрешение конфликтов и работа в команде.',
  lessons: [
    {
      id: 1,
      title: 'Rebase и история коммитов',
      type: 'theory',
      content: [
        { type: 'text', value: 'git rebase — перемещает коммиты ветки на вершину другой ветки. В отличие от merge, rebase создаёт линейную историю без merge-коммитов. Это важный инструмент для чистой истории.' },
        { type: 'heading', value: 'Merge vs Rebase' },
        { type: 'code', language: 'bash', value: '# Ситуация: feature ветка отстала от main\n# main:    A---B---C---D\n#               \\\n# feature:       E---F\n\n# git merge main (из feature):\n# main:    A---B---C---D\n#               \\       \\\n# feature:       E---F---M (merge commit)\n\n# git rebase main (из feature):\n# main:    A---B---C---D\n#                       \\\n# feature:               E\'---F\' (коммиты пересозданы)\n\n# Практика:\ngit checkout feature\ngit rebase main\n# Если конфликт:\n# Исправить файлы\ngit add .\ngit rebase --continue\n# Или отменить:\ngit rebase --abort' },
        { type: 'heading', value: 'Interactive Rebase' },
        { type: 'code', language: 'bash', value: '# Интерактивный rebase — редактирование последних N коммитов\ngit rebase -i HEAD~3\n\n# Откроется редактор:\n# pick abc1234 Добавил авторизацию\n# pick def5678 Исправил опечатку\n# pick ghi9012 Обновил тесты\n\n# Команды:\n# pick   — оставить коммит как есть\n# reword — изменить сообщение коммита\n# squash — объединить с предыдущим (сохранить сообщение)\n# fixup  — объединить с предыдущим (удалить сообщение)\n# drop   — удалить коммит\n# edit   — остановиться для редактирования\n\n# Пример: объединить 3 коммита в один\n# pick abc1234 Добавил авторизацию\n# squash def5678 Исправил опечатку\n# squash ghi9012 Обновил тесты' },
        { type: 'warning', value: 'НИКОГДА не делай rebase публичных веток (main, develop). Rebase переписывает историю — это сломает работу всех кто работал с этой веткой. Rebase только свои локальные feature-ветки.' }
      ]
    },
    {
      id: 2,
      title: 'Cherry-pick, stash и другие команды',
      type: 'theory',
      content: [
        { type: 'text', value: 'Git предоставляет мощные команды для точечных операций: cherry-pick для переноса отдельных коммитов, stash для временного сохранения изменений, bisect для поиска бага.' },
        { type: 'heading', value: 'Cherry-pick' },
        { type: 'code', language: 'bash', value: '# cherry-pick — перенести конкретный коммит в текущую ветку\ngit cherry-pick abc1234\n\n# Пример: hotfix из feature в main\ngit checkout main\ngit cherry-pick def5678          # Перенести один коммит\ngit cherry-pick abc..def         # Диапазон коммитов\ngit cherry-pick --no-commit abc  # Без автокоммита (для редактирования)\n\n# Если конфликт:\ngit cherry-pick --continue       # После разрешения\ngit cherry-pick --abort           # Отменить' },
        { type: 'heading', value: 'Stash — временное сохранение' },
        { type: 'code', language: 'bash', value: '# stash — спрятать незакоммиченные изменения\ngit stash                        # Спрятать все изменения\ngit stash save "WIP: авторизация" # С описанием\ngit stash list                   # Список стешей\ngit stash pop                    # Достать последний и удалить\ngit stash apply stash@{0}        # Достать конкретный (без удаления)\ngit stash drop stash@{0}         # Удалить стеш\ngit stash clear                  # Удалить все\n\n# Пример: срочный hotfix во время работы\n# Работаешь над фичей -> пришёл баг-репорт\ngit stash save "WIP: новая фича"\ngit checkout main\ngit checkout -b hotfix/urgent-bug\n# ...исправил баг, закоммитил, смержил...\ngit checkout feature\ngit stash pop                    # Вернулся к работе' },
        { type: 'heading', value: 'Bisect — поиск бага' },
        { type: 'code', language: 'bash', value: '# bisect — бинарный поиск коммита, сломавшего код\ngit bisect start\ngit bisect bad                   # Текущий коммит — плохой\ngit bisect good v1.0             # Этот коммит — рабочий\n# Git будет переключать коммиты, вы тестируете:\ngit bisect good                  # Этот работает\ngit bisect bad                   # Этот сломан\n# ... пока не найдёт точный коммит\ngit bisect reset                 # Вернуться обратно\n\n# Автоматический bisect\ngit bisect start HEAD v1.0\ngit bisect run npm test          # Автоматически тестирует каждый коммит' },
        { type: 'tip', value: 'git bisect экономит часы отладки. Вместо ручного просмотра сотен коммитов, bisect найдёт проблемный за log2(N) шагов. 1000 коммитов = ~10 шагов.' }
      ]
    },
    {
      id: 3,
      title: 'Git Hooks',
      type: 'theory',
      content: [
        { type: 'text', value: 'Git hooks — скрипты, автоматически запускающиеся при определённых событиях Git (коммит, пуш, мерж). Используются для проверки качества кода, запуска линтеров, форматирования, защиты от случайных ошибок.' },
        { type: 'heading', value: 'Типы хуков' },
        { type: 'code', language: 'bash', value: '# Хуки хранятся в .git/hooks/\nls .git/hooks/\n# pre-commit.sample\n# pre-push.sample\n# commit-msg.sample\n\n# Клиентские хуки (на машине разработчика):\n# pre-commit     — перед коммитом (линтеры, тесты)\n# commit-msg     — проверка сообщения коммита\n# pre-push       — перед пушем (тесты)\n# prepare-commit-msg — шаблон сообщения\n\n# Серверные хуки (на сервере Git):\n# pre-receive    — перед принятием пуша\n# post-receive   — после принятия (деплой, нотификации)\n# update         — обновление ссылки' },
        { type: 'heading', value: 'Примеры хуков' },
        { type: 'code', language: 'bash', value: '# .git/hooks/pre-commit (сделать исполняемым: chmod +x)\n#!/bin/bash\nset -e\n\necho "Запуск pre-commit проверок..."\n\n# Линтер\nif command -v eslint &> /dev/null; then\n    eslint --fix .\n    git add -A\nfi\n\n# Проверка на секреты\nif grep -rn "password\\|secret\\|api_key" --include="*.py" --include="*.js" .; then\n    echo "ОШИБКА: найдены потенциальные секреты в коде!"\n    exit 1\nfi\n\n# Проверка размера файлов\nMAX_SIZE=5242880  # 5MB\nfor file in $(git diff --cached --name-only); do\n    if [[ -f "$file" ]]; then\n        size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)\n        if [[ $size -gt $MAX_SIZE ]]; then\n            echo "ОШИБКА: $file слишком большой ($size байт)"\n            exit 1\n        fi\n    fi\ndone\n\necho "Все проверки пройдены!"' },
        { type: 'code', language: 'bash', value: '# .git/hooks/commit-msg — проверка формата сообщения\n#!/bin/bash\nCOMMIT_MSG_FILE=$1\nCOMMIT_MSG=$(cat "$COMMIT_MSG_FILE")\n\n# Формат: type(scope): description\n# feat(auth): добавил JWT авторизацию\nPATTERN="^(feat|fix|docs|style|refactor|test|chore)(\\(.+\\))?: .{1,72}$"\n\nif ! echo "$COMMIT_MSG" | head -1 | grep -qE "$PATTERN"; then\n    echo "ОШИБКА: неверный формат коммита"\n    echo "Формат: type(scope): описание"\n    echo "Типы: feat, fix, docs, style, refactor, test, chore"\n    echo "Пример: feat(auth): добавил JWT авторизацию"\n    exit 1\nfi' },
        { type: 'tip', value: 'Используй Husky (Node.js) или pre-commit (Python) для управления хуками — они хранят хуки в репозитории и автоматически устанавливают их при npm install / pip install.' }
      ]
    },
    {
      id: 4,
      title: 'Стратегии ветвления',
      type: 'theory',
      content: [
        { type: 'text', value: 'Стратегия ветвления определяет как команда организует работу с ветками. Правильная стратегия упрощает CI/CD, ревью кода и релизы.' },
        { type: 'heading', value: 'Git Flow' },
        { type: 'code', language: 'bash', value: '# Git Flow — классическая стратегия для релизных циклов\n#\n# main      — стабильный код, каждый коммит = релиз\n# develop   — интеграционная ветка\n# feature/* — новые фичи (от develop)\n# release/* — подготовка релиза (от develop)\n# hotfix/*  — срочные исправления (от main)\n\n# Создание фичи\ngit checkout develop\ngit checkout -b feature/user-auth\n# ... работа ...\ngit checkout develop\ngit merge --no-ff feature/user-auth\ngit branch -d feature/user-auth\n\n# Релиз\ngit checkout develop\ngit checkout -b release/1.2.0\n# ... тестирование, исправления ...\ngit checkout main\ngit merge --no-ff release/1.2.0\ngit tag -a v1.2.0 -m "Release 1.2.0"\ngit checkout develop\ngit merge release/1.2.0\ngit branch -d release/1.2.0' },
        { type: 'heading', value: 'GitHub Flow и Trunk-Based' },
        { type: 'code', language: 'bash', value: '# GitHub Flow — простой, для CI/CD\n# main — единственная долгоживущая ветка\n# feature/* — короткоживущие ветки (1-2 дня)\n#\n# 1. Создай ветку от main\ngit checkout -b feature/login\n# 2. Работай, коммить\ngit commit -m "feat: добавил форму логина"\n# 3. Открой Pull Request\ngh pr create --title "feat: форма логина"\n# 4. Code review + CI проверки\n# 5. Merge в main\n# 6. Автодеплой\n\n# Trunk-Based Development — для зрелых команд\n# main — все коммитят напрямую или через очень короткие ветки\n# Feature flags скрывают незавершённую функциональность\n# Требует: хорошие тесты, CI/CD, feature flags\n\n# Сравнение:\n# Git Flow    — сложный, для больших команд с редкими релизами\n# GitHub Flow — простой, для CI/CD и частых деплоев\n# Trunk-Based — продвинутый, для continuous deployment' },
        { type: 'note', value: 'Для большинства проектов GitHub Flow — оптимальный выбор. Он прост, хорошо интегрируется с CI/CD, и Pull Requests обеспечивают code review. Git Flow избыточен для команд с continuous deployment.' }
      ]
    },
    {
      id: 5,
      title: 'Разрешение конфликтов и работа в команде',
      type: 'theory',
      content: [
        { type: 'text', value: 'Конфликты возникают когда два разработчика изменили один и тот же участок кода. Умение быстро и правильно разрешать конфликты — важный навык для командной работы.' },
        { type: 'heading', value: 'Разрешение конфликтов' },
        { type: 'code', language: 'bash', value: '# Конфликт при merge/rebase:\n# <<<<<<< HEAD\n# const port = 3000;\n# =======\n# const port = 8080;\n# >>>>>>> feature/new-port\n\n# Вручную выбери нужную версию и удали маркеры:\n# const port = process.env.PORT || 8080;\n\ngit add .\ngit merge --continue   # или git rebase --continue\n\n# Инструменты для разрешения конфликтов\ngit mergetool          # Визуальный инструмент\n\n# Стратегии при merge\ngit merge -X ours feature     # При конфликте — наша версия\ngit merge -X theirs feature   # При конфликте — их версия\n\n# Отменить merge\ngit merge --abort' },
        { type: 'heading', value: 'Лучшие практики командной работы' },
        { type: 'code', language: 'bash', value: '# 1. Часто синхронизируйся с main\ngit fetch origin\ngit rebase origin/main\n\n# 2. Маленькие PR (< 400 строк)\n# Большие PR = сложный ревью = баги\n\n# 3. Осмысленные коммиты\ngit commit -m "feat(auth): добавил JWT refresh token"\n# НЕ: git commit -m "fix" или "update"\n\n# 4. Защита веток\n# GitHub: Settings -> Branches -> Branch protection rules\n# - Require PR before merging\n# - Require status checks (CI)\n# - Require review (1-2 approvals)\n# - No force push\n\n# 5. Полезные алиасы\ngit config --global alias.co checkout\ngit config --global alias.br branch\ngit config --global alias.st status\ngit config --global alias.lg "log --oneline --graph --all"\ngit config --global alias.last "log -1 HEAD --stat"' },
        { type: 'tip', value: 'Правило: пулишь (pull) каждое утро, пушишь каждый вечер. Мелкие частые коммиты лучше больших редких. PR не должен висеть больше 1-2 дней — это блокирует команду.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Git Workflow',
      type: 'practice',
      difficulty: 'medium',
      description: 'Отработайте продвинутые операции Git: rebase, cherry-pick, разрешение конфликтов, создание хуков.',
      requirements: [
        'Создайте репозиторий с веткой main и несколькими коммитами',
        'Создайте feature-ветку, добавьте коммиты, выполните rebase на main',
        'Создайте конфликт и разрешите его',
        'Выполните cherry-pick одного коммита из feature в main',
        'Создайте pre-commit hook, проверяющий наличие TODO в коде',
        'Объедините 3 коммита в один через interactive rebase (squash)'
      ],
      hint: 'Для создания конфликта: измените одну и ту же строку в main и feature. Для pre-commit: проверьте git diff --cached на наличие TODO.',
      expectedOutput: 'Репозиторий создан с историей коммитов\nFeature-ветка rebase на main: линейная история\nКонфликт разрешён успешно\nCherry-pick: коммит перенесён в main\nPre-commit hook: блокирует коммит с TODO\nSquash: 3 коммита объединены в 1',
      solution: '#!/bin/bash\n# 1. Создание репозитория\nmkdir git-lab && cd git-lab && git init\necho "# Project" > README.md && git add . && git commit -m "init: начальный коммит"\necho "v1" > app.js && git add . && git commit -m "feat: добавил app.js"\necho "v2" >> app.js && git add . && git commit -m "feat: обновил app.js"\n\n# 2. Feature-ветка и rebase\ngit checkout -b feature/auth\necho "auth code" > auth.js && git add . && git commit -m "feat(auth): модуль авторизации"\necho "login" >> auth.js && git add . && git commit -m "feat(auth): добавил логин"\ngit checkout main\necho "v3" >> app.js && git add . && git commit -m "feat: новая функция в main"\ngit checkout feature/auth\ngit rebase main\n\n# 3. Конфликт\ngit checkout main\necho "port=3000" > config.txt && git add . && git commit -m "config: порт 3000"\ngit checkout feature/auth\necho "port=8080" > config.txt && git add . && git commit -m "config: порт 8080"\ngit rebase main\n# Разрешить конфликт в config.txt, затем:\n# git add config.txt && git rebase --continue\n\n# 4. Cherry-pick\ngit checkout main\ngit log --oneline feature/auth\ngit cherry-pick <commit-hash>\n\n# 5. Pre-commit hook\ncat > .git/hooks/pre-commit << \'HOOK\'\n#!/bin/bash\nif git diff --cached | grep -i "TODO"; then\n    echo "ОШИБКА: найдены TODO в коде"\n    exit 1\nfi\nHOOK\nchmod +x .git/hooks/pre-commit\n\n# 6. Squash (объединение коммитов)\ngit checkout feature/auth\ngit rebase -i HEAD~3\n# Заменить pick на squash для 2-го и 3-го коммитов',
      explanation: 'Rebase создаёт чистую линейную историю. Cherry-pick копирует конкретный коммит. Pre-commit hook запускается перед каждым коммитом и может его отменить (exit 1). Interactive rebase с squash объединяет несколько коммитов в один — полезно перед merge в main.'
    }
  ]
}
