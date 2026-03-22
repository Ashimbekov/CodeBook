export default {
  id: 76,
  title: 'Best Practices: Работа с Git',
  description: 'Лучшие практики работы с системой контроля версий Git: от базового рабочего процесса до стратегий ветвления, написания хороших коммитов и оформления pull request.',
  lessons: [
    {
      id: 1,
      title: 'Зачем нужен контроль версий',
      type: 'theory',
      content: [
        {
          type: 'text',
          text: 'Контроль версий — это система, которая записывает изменения файлов с течением времени. Git позволяет вернуться к любому предыдущему состоянию, сравнить изменения, найти кто и когда внёс правку, и работать параллельно в команде без конфликтов.'
        },
        {
          type: 'heading',
          text: 'Проблемы без Git'
        },
        {
          type: 'list',
          items: [
            'Папки вида "проект_финал", "проект_финал2", "проект_финал_ТОЧНО_ФИНАЛ" — хаос',
            'Невозможно понять, что изменилось между версиями',
            'Случайно удалил нужный код — не восстановить',
            'Двое правят один файл — чья версия верна?',
            'Нет истории: кто сломал этот код и когда?'
          ]
        },
        {
          type: 'heading',
          text: 'Что даёт Git'
        },
        {
          type: 'list',
          items: [
            'Полная история всех изменений с автором и датой',
            'Возможность откатиться к любому состоянию',
            'Параллельная работа через ветки (branches)',
            'Просмотр разницы (diff) между любыми версиями',
            'Надёжный бэкап на удалённом сервере (GitHub, GitLab)'
          ]
        },
        {
          type: 'tip',
          text: 'Используй Git с первого дня любого проекта, даже если работаешь один. Привычка делать коммиты спасёт тебя от потери кода не один раз.'
        }
      ]
    },
    {
      id: 2,
      title: 'Базовый рабочий процесс Git',
      type: 'theory',
      content: [
        {
          type: 'text',
          text: 'Ежедневная работа с Git строится вокруг четырёх команд: add, commit, push, pull. Важно понимать, что происходит на каждом шаге.'
        },
        {
          type: 'heading',
          text: 'Три области Git'
        },
        {
          type: 'list',
          items: [
            'Working Directory — файлы на диске, которые ты редактируешь',
            'Staging Area (Index) — файлы, подготовленные к коммиту (после git add)',
            'Repository — история коммитов (после git commit)'
          ]
        },
        {
          type: 'heading',
          text: 'Базовые команды'
        },
        {
          type: 'code',
          language: 'bash',
          label: 'Типичный рабочий цикл',
          code: '# Инициализация нового репозитория\ngit init\n\n# Клонирование существующего\ngit clone https://github.com/user/repo.git\n\n# Посмотреть состояние\ngit status\n\n# Добавить конкретный файл в staging\ngit add src/Main.java\n\n# Добавить все изменённые файлы (осторожно!)\ngit add .\n\n# Создать коммит\ngit commit -m "feat: add user authentication"\n\n# Отправить изменения на сервер\ngit push origin main\n\n# Получить изменения с сервера\ngit pull origin main\n\n# Посмотреть историю коммитов\ngit log --oneline'
        },
        {
          type: 'warning',
          text: 'Избегай git add . без предварительного git status. Ты можешь случайно закоммитить временные файлы, пароли или скомпилированные .class файлы. Всегда знай, что именно ты добавляешь.'
        },
        {
          type: 'tip',
          text: 'Делай небольшие атомарные коммиты: один коммит — одно логическое изменение. Легче просматривать историю, проще откатиться при необходимости.'
        }
      ]
    },
    {
      id: 3,
      title: 'Написание хороших сообщений коммитов',
      type: 'theory',
      content: [
        {
          type: 'text',
          text: 'Сообщение коммита — это документация твоей работы. Плохие сообщения делают историю бесполезной. Conventional Commits — стандарт, принятый в большинстве профессиональных команд.'
        },
        {
          type: 'heading',
          text: 'Плохие примеры'
        },
        {
          type: 'code',
          language: 'bash',
          label: 'ПЛОХО — бесполезные сообщения',
          code: 'git commit -m "fix"\ngit commit -m "changes"\ngit commit -m "asdfgh"\ngit commit -m "работает"\ngit commit -m "исправил баг"\ngit commit -m "обновил файлы"'
        },
        {
          type: 'heading',
          text: 'Формат Conventional Commits'
        },
        {
          type: 'code',
          language: 'bash',
          label: 'ХОРОШО — понятные сообщения',
          code: '# Формат: <тип>(<область>): <описание>\n\n# Новая функциональность\ngit commit -m "feat: add user login via email and password"\ngit commit -m "feat(auth): implement JWT token refresh"\n\n# Исправление бага\ngit commit -m "fix: prevent NPE when user profile is empty"\ngit commit -m "fix(cart): correct total price calculation with discounts"\n\n# Рефакторинг (без изменения поведения)\ngit commit -m "refactor: extract payment logic to PaymentService"\n\n# Тесты\ngit commit -m "test: add unit tests for UserValidator"\n\n# Документация\ngit commit -m "docs: update API authentication guide"\n\n# Технические задачи\ngit commit -m "chore: update Spring Boot to 3.2.0"'
        },
        {
          type: 'list',
          items: [
            'feat — новая функциональность',
            'fix — исправление ошибки',
            'refactor — рефакторинг кода без изменения поведения',
            'test — добавление или изменение тестов',
            'docs — изменения в документации',
            'chore — обновление зависимостей, конфигурации',
            'style — форматирование, пробелы (не влияет на логику)'
          ]
        },
        {
          type: 'tip',
          text: 'Правило: заголовок коммита должен отвечать на вопрос "Что делает этот коммит?". Пиши в повелительном наклонении: "add feature", "fix bug", а не "added feature", "fixed bug".'
        }
      ]
    },
    {
      id: 4,
      title: 'Стратегия ветвления: Feature Branches',
      type: 'theory',
      content: [
        {
          type: 'text',
          text: 'Ветки (branches) позволяют разрабатывать новые функции изолированно от основного кода. Самая распространённая стратегия — Feature Branch Workflow: для каждой задачи создаётся отдельная ветка.'
        },
        {
          type: 'heading',
          text: 'Плохой подход — все коммиты в main'
        },
        {
          type: 'code',
          language: 'bash',
          label: 'ПЛОХО — работа прямо в main',
          code: '# Все разработчики пушат прямо в main\ngit checkout main\ngit pull\n# ... редактируем код ...\ngit add .\ngit commit -m "добавил логин"\ngit push origin main\n# Результат: постоянные конфликты, сломанный main, хаос'
        },
        {
          type: 'heading',
          text: 'Правильный подход — Feature Branches'
        },
        {
          type: 'code',
          language: 'bash',
          label: 'ХОРОШО — работа через ветки',
          code: '# 1. Убедись, что main актуален\ngit checkout main\ngit pull origin main\n\n# 2. Создай ветку для задачи\ngit checkout -b feature/user-authentication\n# или: git switch -c feature/user-authentication\n\n# 3. Работай в своей ветке\ngit add src/auth/UserService.java\ngit commit -m "feat(auth): add password hashing with BCrypt"\ngit add src/auth/AuthController.java\ngit commit -m "feat(auth): add login and logout endpoints"\n\n# 4. Отправь ветку на сервер\ngit push origin feature/user-authentication\n\n# 5. Создай Pull Request (через GitHub/GitLab)\n# 6. После ревью и одобрения — merge в main\n\n# 7. Удали ветку после слияния\ngit branch -d feature/user-authentication\ngit push origin --delete feature/user-authentication'
        },
        {
          type: 'heading',
          text: 'Соглашение по именованию веток'
        },
        {
          type: 'list',
          items: [
            'feature/add-payment — новая функциональность',
            'fix/login-null-pointer — исправление бага',
            'refactor/extract-user-service — рефакторинг',
            'hotfix/critical-security-patch — срочное исправление в продакшне',
            'release/1.2.0 — подготовка релиза'
          ]
        }
      ]
    },
    {
      id: 5,
      title: 'Merge vs Rebase и .gitignore',
      type: 'theory',
      content: [
        {
          type: 'text',
          text: 'Merge и rebase — два способа интегрировать изменения из одной ветки в другую. У каждого свои преимущества. .gitignore защищает репозиторий от ненужных файлов.'
        },
        {
          type: 'heading',
          text: 'Merge vs Rebase'
        },
        {
          type: 'code',
          language: 'bash',
          label: 'Merge — сохраняет полную историю',
          code: '# Merge создаёт merge commit, история нелинейна\ngit checkout main\ngit merge feature/payment\n# История: main <- merge commit <- (feature коммиты + main коммиты)\n# Плюс: полная история, видно когда и что сливалось\n# Минус: история может быть запутанной при многих ветках'
        },
        {
          type: 'code',
          language: 'bash',
          label: 'Rebase — линейная история',
          code: '# Rebase "перекладывает" коммиты поверх основной ветки\ngit checkout feature/payment\ngit rebase main\n# История становится линейной\n# Плюс: чистая история, легко читать git log\n# Минус: нельзя rebase публичные ветки (меняет SHA коммитов)\n\n# Золотое правило: НИКОГДА не делай rebase веток,\n# которые уже запушены и которые используют другие разработчики'
        },
        {
          type: 'heading',
          text: '.gitignore для Java проекта'
        },
        {
          type: 'code',
          language: 'bash',
          label: 'ХОРОШО — правильный .gitignore',
          code: '# Скомпилированные файлы Java\n*.class\n*.jar\n*.war\n*.ear\ntarget/\nbuild/\nout/\n\n# IDE файлы (у каждого разработчика своя настройка)\n.idea/\n*.iml\n.eclipse/\n.settings/\n.classpath\n.project\n\n# Переменные окружения и секреты — НИКОГДА не коммитим!\n.env\n*.env.local\napplication-local.properties\nsecrets.properties\n\n# Логи\n*.log\nlogs/\n\n# Временные файлы OS\n.DS_Store\nThumbs.db\n\n# Maven/Gradle wrapper (обычно коммитят, но зависит от команды)\n# .mvn/\n# gradlew'
        },
        {
          type: 'warning',
          text: 'Если секретный файл (.env, пароли) уже попал в репозиторий — простое добавление в .gitignore не удалит его из истории. Нужно использовать git filter-branch или BFG Repo Cleaner, и обязательно сменить скомпрометированные пароли/ключи.'
        },
        {
          type: 'tip',
          text: 'Используй gitignore.io (сайт) или шаблоны GitHub для генерации .gitignore под свой стек технологий. Создавай .gitignore в самом начале проекта, до первого коммита.'
        }
      ]
    },
    {
      id: 6,
      title: 'Практика: Написание правильных сообщений коммитов',
      type: 'practice',
      difficulty: 'easy',
      description: 'Для каждого из 5 сценариев напиши правильное сообщение коммита в формате Conventional Commits. Затем создай метод formatCommitMessage, который принимает тип, область и описание и возвращает готовое сообщение коммита.',
      requirements: [
        'Метод formatCommitMessage(String type, String scope, String description) возвращает строку',
        'Если scope не пустой — формат: type(scope): description',
        'Если scope пустой или null — формат: type: description',
        'Метод validateCommitType(String type) возвращает true для допустимых типов: feat, fix, refactor, test, docs, chore, style',
        'Написать 5 правильных сообщений для конкретных сценариев в комментариях'
      ],
      expectedOutput: 'feat(auth): add Google OAuth2 login support\nfix(cart): prevent duplicate items when clicking add button rapidly\nrefactor: extract database connection logic to DatabaseManager\ntest(user): add unit tests for email validation\nchore: upgrade Jackson library from 2.14 to 2.15\nВалидный тип: true\nНевалидный тип: false\nБез scope: fix: correct null pointer in user profile loading',
      hint: 'Для formatCommitMessage используй тернарный оператор или if для проверки scope. Для validateCommitType создай массив допустимых типов и используй Arrays.asList().contains() или switch.',
      solution: 'import java.util.Arrays;\nimport java.util.List;\n\npublic class CommitMessageFormatter {\n\n    // Сценарии и правильные сообщения:\n    // 1. Добавлена авторизация через Google\n    //    feat(auth): add Google OAuth2 login support\n    //\n    // 2. Исправлен баг: при быстром двойном клике товар добавляется дважды\n    //    fix(cart): prevent duplicate items when clicking add button rapidly\n    //\n    // 3. Логика подключения к БД вынесена в отдельный класс (без изменения поведения)\n    //    refactor: extract database connection logic to DatabaseManager\n    //\n    // 4. Добавлены тесты для валидации email у пользователя\n    //    test(user): add unit tests for email validation\n    //\n    // 5. Обновлена библиотека Jackson с 2.14 до 2.15\n    //    chore: upgrade Jackson library from 2.14 to 2.15\n\n    private static final List<String> VALID_TYPES = Arrays.asList(\n        "feat", "fix", "refactor", "test", "docs", "chore", "style"\n    );\n\n    public static String formatCommitMessage(String type, String scope, String description) {\n        if (type == null || type.isEmpty()) {\n            throw new IllegalArgumentException("Тип коммита не может быть пустым");\n        }\n        if (description == null || description.isEmpty()) {\n            throw new IllegalArgumentException("Описание коммита не может быть пустым");\n        }\n\n        if (scope != null && !scope.isEmpty()) {\n            return type + "(" + scope + "): " + description;\n        } else {\n            return type + ": " + description;\n        }\n    }\n\n    public static boolean validateCommitType(String type) {\n        if (type == null) return false;\n        return VALID_TYPES.contains(type.toLowerCase());\n    }\n\n    public static void main(String[] args) {\n        // Примеры правильных сообщений\n        System.out.println(formatCommitMessage("feat", "auth", "add Google OAuth2 login support"));\n        System.out.println(formatCommitMessage("fix", "cart", "prevent duplicate items when clicking add button rapidly"));\n        System.out.println(formatCommitMessage("refactor", null, "extract database connection logic to DatabaseManager"));\n        System.out.println(formatCommitMessage("test", "user", "add unit tests for email validation"));\n        System.out.println(formatCommitMessage("chore", null, "upgrade Jackson library from 2.14 to 2.15"));\n\n        System.out.println("Валидный тип: " + validateCommitType("feat"));\n        System.out.println("Невалидный тип: " + validateCommitType("update"));\n        System.out.println("Без scope: " + formatCommitMessage("fix", "", "correct null pointer in user profile loading"));\n    }\n}',
      explanation: 'Метод formatCommitMessage показывает простую, но важную идею: соглашение о форматировании можно и нужно автоматизировать. Программа-помощник снижает человеческие ошибки. validateCommitType использует заранее заданный список допустимых значений — паттерн whitelist (белый список), который надёжнее, чем blacklist (чёрный список). Arrays.asList() создаёт список из массива, а contains() проверяет наличие элемента за O(n) — для небольших списков это допустимо. Для больших списков следует использовать HashSet с O(1).'
    },
    {
      id: 7,
      title: 'Практика: Создание .gitignore для Java проекта',
      type: 'practice',
      difficulty: 'easy',
      description: 'Напиши метод, который генерирует содержимое файла .gitignore для Java проекта. Метод принимает параметры: buildTool (maven/gradle), ide (intellij/eclipse/vscode) и includeDocker (boolean). Также напиши метод checkShouldIgnore, который по имени файла определяет, должен ли он быть проигнорирован.',
      requirements: [
        'Метод generateGitignore(String buildTool, String ide, boolean includeDocker) возвращает String с содержимым .gitignore',
        'Всегда включать: *.class, секреты (.env, secrets.properties), логи, OS файлы',
        'Maven: target/ директория',
        'Gradle: build/, .gradle/ директории',
        'IntelliJ IDEA: .idea/, *.iml',
        'Eclipse: .eclipse/, .settings/, .classpath, .project',
        'Метод checkShouldIgnore(String filename, String gitignoreContent) возвращает boolean'
      ],
      expectedOutput: '# Java\n*.class\n*.jar\n# ... содержимое .gitignore ...\nДолжен игнорироваться (.class): true\nДолжен игнорироваться (.env): true\nНе должен игнорироваться (.java): false\nНе должен игнорироваться (Main.java): false',
      hint: 'Собирай содержимое .gitignore через StringBuilder. Для checkShouldIgnore разбей содержимое .gitignore на строки через split("\\n"), отфильтруй комментарии (начинающиеся с #) и пустые строки. Для простого сопоставления шаблона типа "*.class" проверь, заканчивается ли имя файла на ".class".',
      solution: 'public class GitignoreGenerator {\n\n    public static String generateGitignore(String buildTool, String ide, boolean includeDocker) {\n        StringBuilder sb = new StringBuilder();\n\n        // Java скомпилированные файлы\n        sb.append("# Java скомпилированные файлы\\n");\n        sb.append("*.class\\n");\n        sb.append("*.jar\\n");\n        sb.append("*.war\\n");\n        sb.append("*.ear\\n");\n        sb.append("\\n");\n\n        // Инструмент сборки\n        if ("maven".equalsIgnoreCase(buildTool)) {\n            sb.append("# Maven\\n");\n            sb.append("target/\\n");\n            sb.append("pom.xml.tag\\n");\n            sb.append("pom.xml.releaseBackup\\n");\n        } else if ("gradle".equalsIgnoreCase(buildTool)) {\n            sb.append("# Gradle\\n");\n            sb.append("build/\\n");\n            sb.append(".gradle/\\n");\n            sb.append("gradle-app.setting\\n");\n        }\n        sb.append("\\n");\n\n        // IDE файлы\n        if ("intellij".equalsIgnoreCase(ide)) {\n            sb.append("# IntelliJ IDEA\\n");\n            sb.append(".idea/\\n");\n            sb.append("*.iml\\n");\n            sb.append("*.iws\\n");\n        } else if ("eclipse".equalsIgnoreCase(ide)) {\n            sb.append("# Eclipse\\n");\n            sb.append(".eclipse/\\n");\n            sb.append(".settings/\\n");\n            sb.append(".classpath\\n");\n            sb.append(".project\\n");\n        } else if ("vscode".equalsIgnoreCase(ide)) {\n            sb.append("# VS Code\\n");\n            sb.append(".vscode/\\n");\n        }\n        sb.append("\\n");\n\n        // Секреты — ОБЯЗАТЕЛЬНО игнорировать\n        sb.append("# Секреты и конфигурация окружения\\n");\n        sb.append(".env\\n");\n        sb.append("*.env.local\\n");\n        sb.append(".env.*\\n");\n        sb.append("secrets.properties\\n");\n        sb.append("application-local.properties\\n");\n        sb.append("\\n");\n\n        // Логи\n        sb.append("# Логи\\n");\n        sb.append("*.log\\n");\n        sb.append("logs/\\n");\n        sb.append("\\n");\n\n        // Docker\n        if (includeDocker) {\n            sb.append("# Docker\\n");\n            sb.append(".dockerignore\\n");\n            sb.append("docker-compose.override.yml\\n");\n            sb.append("\\n");\n        }\n\n        // OS файлы\n        sb.append("# Файлы операционной системы\\n");\n        sb.append(".DS_Store\\n");\n        sb.append("Thumbs.db\\n");\n        sb.append("Desktop.ini\\n");\n\n        return sb.toString();\n    }\n\n    public static boolean checkShouldIgnore(String filename, String gitignoreContent) {\n        if (filename == null || gitignoreContent == null) return false;\n\n        String[] lines = gitignoreContent.split("\\n");\n        for (String line : lines) {\n            line = line.trim();\n            // Пропускаем комментарии и пустые строки\n            if (line.isEmpty() || line.startsWith("#")) continue;\n\n            // Шаблон вида *.class — проверяем расширение\n            if (line.startsWith("*.")) {\n                String extension = line.substring(1); // ".class"\n                if (filename.endsWith(extension)) return true;\n            }\n            // Точное совпадение имени файла\n            else if (!line.endsWith("/") && filename.equals(line)) {\n                return true;\n            }\n            // Точное совпадение директории (filename содержит имя директории)\n            else if (line.endsWith("/") && filename.startsWith(line)) {\n                return true;\n            }\n        }\n        return false;\n    }\n\n    public static void main(String[] args) {\n        String gitignore = generateGitignore("maven", "intellij", false);\n        System.out.println(gitignore);\n\n        System.out.println("Должен игнорироваться (.class): " +\n            checkShouldIgnore("Main.class", gitignore));\n        System.out.println("Должен игнорироваться (.env): " +\n            checkShouldIgnore(".env", gitignore));\n        System.out.println("Не должен игнорироваться (.java): " +\n            checkShouldIgnore("Main.java", gitignore));\n        System.out.println("Не должен игнорироваться (Main.java): " +\n            checkShouldIgnore("Main.java", gitignore));\n    }\n}',
      explanation: 'generateGitignore демонстрирует паттерн Builder через StringBuilder — эффективная сборка строк по частям. Параметризованная генерация позволяет адаптировать результат под конкретный проект. Важный момент: секреты (.env, *.properties с паролями) игнорируются всегда независимо от параметров — это защита от случайного коммита чувствительных данных. checkShouldIgnore реализует упрощённую версию алгоритма сопоставления шаблонов .gitignore. Реальный Git поддерживает более сложные паттерны (!, **), но основная логика именно такая: пропустить комментарии, сопоставить шаблон с именем файла.'
    }
  ]
}
