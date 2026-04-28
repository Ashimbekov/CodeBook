export default {
  id: 5,
  title: 'Stash',
  description: 'Git stash: временное сохранение изменений, управление стешами, создание веток из стеша и продвинутые сценарии.',
  lessons: [
    {
      id: 1,
      title: 'Stash: основы',
      type: 'theory',
      content: [
        { type: 'text', value: 'git stash временно сохраняет незакоммиченные изменения в специальное хранилище. Это как "отложить работу на полку" — рабочая директория становится чистой, и можно переключиться на другую задачу. Потом изменения можно вернуть.' },
        { type: 'heading', value: 'Базовые команды stash' },
        { type: 'code', language: 'bash', value: '# Типичный сценарий:\n# Работаете над фичей → срочный баг в production\n\n# 1. Сохранить текущие изменения\ngit stash\n# Saved working directory and index state WIP on feature/auth: abc1234 feat: авторизация\n\n# Рабочая директория теперь ЧИСТАЯ\ngit status\n# On branch feature/auth\n# nothing to commit, working tree clean\n\n# 2. Переключаемся, фиксим баг\ngit switch main\ngit switch -c hotfix/urgent-bug\n# ...исправляем баг...\ngit commit -m "fix: критический баг"\ngit switch main\ngit merge hotfix/urgent-bug\ngit push\n\n# 3. Возвращаемся к работе\ngit switch feature/auth\ngit stash pop\n# Изменения восстановлены!\n\n# Stash с описанием (рекомендуется!):\ngit stash push -m "WIP: форма авторизации, осталось добавить валидацию"\n# или короче:\ngit stash -m "WIP: форма авторизации"\n\n# Список стешей:\ngit stash list\n# stash@{0}: On feature/auth: WIP: форма авторизации\n# stash@{1}: WIP on main: abc1234 feat: начальный коммит' },
        { type: 'heading', value: 'pop vs apply' },
        { type: 'code', language: 'bash', value: '# pop = достать + удалить из стеша\ngit stash pop\n# Восстанавливает изменения и УДАЛЯЕТ стеш\n\n# apply = достать + оставить в стеше\ngit stash apply\n# Восстанавливает изменения, но стеш ОСТАЁТСЯ\n# Полезно для применения одних изменений в нескольких ветках\n\n# Достать конкретный стеш:\ngit stash apply stash@{2}\n\n# Удалить стеш:\ngit stash drop stash@{0}      # удалить конкретный\ngit stash clear                # удалить ВСЕ стеши\n\n# Посмотреть содержимое стеша:\ngit stash show                 # краткий diff\ngit stash show -p               # полный diff\ngit stash show stash@{1} -p     # конкретный стеш\n\n# Совет: всегда используй описание\n# Без: stash@{3}: WIP on feature: abc1234 что-то непонятное\n# С:   stash@{3}: On feature: WIP: OAuth2 интеграция с Google' },
        { type: 'tip', value: 'Используй stash -m "описание" ВСЕГДА. Через неделю вы не вспомните, что в stash@{5}. Описание спасёт время.' }
      ]
    },
    {
      id: 2,
      title: 'Stash: продвинутые возможности',
      type: 'theory',
      content: [
        { type: 'text', value: 'Stash может сохранять untracked файлы, отдельные файлы, создавать ветки из стеша и даже интерактивно выбирать что сохранять.' },
        { type: 'heading', value: 'Stash с untracked и ignored файлами' },
        { type: 'code', language: 'bash', value: '# По умолчанию stash НЕ сохраняет:\n# - Untracked файлы (новые, не добавленные через git add)\n# - Ignored файлы (.gitignore)\n\n# Включить untracked файлы:\ngit stash -u\n# или:\ngit stash --include-untracked\n\n# Включить ВСЁ (даже ignored):\ngit stash -a\n# или:\ngit stash --all\n# ОСТОРОЖНО: сохранит target/, node_modules/, .class файлы!\n\n# Стеш конкретных файлов:\ngit stash push -m "WIP: UserService" src/UserService.java src/UserServiceTest.java\n# Только эти файлы попадут в стеш, остальные останутся\n\n# Интерактивный stash (выбрать файлы):\ngit stash push -p\n# или:\ngit stash --patch\n# Git спросит для каждого изменения: Stash this hunk? [y,n,q,a,d]\n# y = да, n = нет, q = выйти, a = всё оставшееся, d = пропустить файл\n\n# Пример: у вас изменения в 3 файлах, но стешить нужно только 1\ngit stash push -p\n# Для UserService.java: y\n# Для OrderService.java: n\n# Для config.yaml: n' },
        { type: 'heading', value: 'Ветка из стеша' },
        { type: 'code', language: 'bash', value: '# Создать ветку из стеша — когда стеш конфликтует с текущей веткой\n# или когда решили что стеш — это целая фича\n\ngit stash branch feature/from-stash\n# 1. Создаёт ветку от коммита, где был создан стеш\n# 2. Применяет стеш\n# 3. Удаляет стеш (если применение успешно)\n\ngit stash branch feature/from-stash stash@{2}\n# Создать из конкретного стеша\n\n# Сценарий:\n# 1. Работал над фичей в main (забыл создать ветку)\n# 2. Сделал много изменений\n# 3. Осознал: нужна отдельная ветка\ngit stash -m "WIP: вся работа над фичей"\ngit stash branch feature/my-work\n# Готово! Все изменения в новой ветке\n\n# Альтернатива (без stash):\ngit switch -c feature/my-work\n# Создаёт ветку и переносит все незакоммиченные изменения\n# Но это работает только если нет конфликтов' },
        { type: 'note', value: 'Стеш — это на самом деле специальные коммиты, хранящиеся в refs/stash. Поэтому их можно восстановить через reflog даже после stash drop. Но лучше не полагаться на это.' }
      ]
    },
    {
      id: 3,
      title: 'Stash в рабочих процессах',
      type: 'theory',
      content: [
        { type: 'text', value: 'Stash критически важен в повседневной работе Java-разработчика. Переключение между задачами, code review, экстренные фиксы — без stash пришлось бы коммитить незавершённый код или терять изменения.' },
        { type: 'heading', value: 'Рабочие сценарии' },
        { type: 'code', language: 'bash', value: '# === Сценарий 1: Code Review ===\n# Работаешь над задачей, попросили ревьюить PR\ngit stash -m "WIP: JIRA-123 OrderService рефакторинг"\ngit switch feature/payment-api\n# ...делаем ревью, тестируем...\ngit switch feature/order-refactor\ngit stash pop\n\n# === Сценарий 2: Быстрый эксперимент ===\n# Хочешь проверить идею, не теряя текущую работу\ngit stash -m "WIP: текущая работа"\n# ...экспериментируешь...\n# Не понравилось:\ngit checkout .                  # отменить эксперимент\ngit stash pop                   # вернуть работу\n\n# === Сценарий 3: Pull с конфликтами ===\ngit pull origin main\n# error: Your local changes would be overwritten\n# Решение:\ngit stash\ngit pull origin main\ngit stash pop\n# Если конфликт при pop — разрешаем как обычно\n\n# === Сценарий 4: Перенос изменений между ветками ===\n# Начал работу в wrong ветке\ngit stash\ngit switch correct-branch\ngit stash pop\n\n# === Сценарий 5: Чистый mvn test ===\n# Хочешь запустить тесты без своих изменений\ngit stash -u\nmvn test\ngit stash pop' },
        { type: 'heading', value: 'Stash и IntelliJ IDEA' },
        { type: 'code', language: 'bash', value: '# IntelliJ IDEA поддерживает stash:\n# Git → Stash Changes... (Ctrl+Shift+S на некоторых раскладках)\n# Git → Unstash Changes...\n\n# Но IntelliJ также имеет Shelve — свой аналог stash:\n# Git → Shelve Changes...\n\n# Shelve vs Stash:\n# Stash — встроен в Git, работает в терминале и любых IDE\n# Shelve — только IntelliJ, хранит в .idea/shelf/\n\n# Рекомендация: используй stash\n# 1. Работает везде (терминал, CI, другие IDE)\n# 2. Не добавляет файлы в .idea/\n# 3. Стандартный Git workflow\n\n# Git алиасы для stash:\ngit config --global alias.save "stash push -m"\ngit config --global alias.load "stash pop"\ngit config --global alias.stashes "stash list"\n\n# Использование:\ngit save "WIP: OrderService"\ngit load\ngit stashes' },
        { type: 'tip', value: 'Правило: если уходишь от компьютера больше чем на 30 минут — закоммить (даже WIP). Stash хорош для коротких переключений (минуты-часы), но не для хранения на дни. Коммит надёжнее.' }
      ]
    },
    {
      id: 4,
      title: 'Stash: внутреннее устройство',
      type: 'theory',
      content: [
        { type: 'text', value: 'Stash внутри — это специальные коммиты. Понимание устройства помогает восстанавливать потерянные стеши, и даёт более глубокое понимание Git.' },
        { type: 'heading', value: 'Как stash хранится внутри Git' },
        { type: 'code', language: 'bash', value: '# Stash — это 2-3 коммита:\n# 1. Commit для index (staged изменения)\n# 2. Commit для working directory (unstaged изменения)\n# 3. (опционально) Commit для untracked файлов\n\n# Посмотреть структуру:\ngit log --oneline --graph stash@{0}\n#   *-.   abc1234 WIP on feature: def5678 feat: работа\n#   |\\ \\\n#   | | * ghi9012 untracked files on feature: def5678\n#   | * jkl3456 index on feature: def5678 feat: работа\n#   |/\n#   * def5678 feat: работа\n\n# Stash хранится в:\ncat .git/refs/stash\n# abc1234... (хеш последнего стеша)\n\n# Предыдущие стеши — в reflog:\ngit reflog show stash\n# abc1234 stash@{0}: WIP on feature: работа\n# xyz7890 stash@{1}: On main: эксперимент\n\n# Именно поэтому можно восстановить после stash drop:\ngit stash drop stash@{0}\n# Стеш "удалён", но коммит ещё существует!\ngit fsck --unreachable | grep commit\n# unreachable commit abc1234...\ngit stash apply abc1234\n# Восстановлено!' },
        { type: 'heading', value: 'Stash в скриптах и CI' },
        { type: 'code', language: 'bash', value: '# Stash можно использовать в скриптах и CI:\n\n# Безопасный stash (только если есть изменения):\nif ! git diff --quiet || ! git diff --cached --quiet; then\n    git stash push -m "auto-stash before deploy"\n    STASHED=true\nfi\n\n# ... какие-то операции ...\n\nif [ "$STASHED" = true ]; then\n    git stash pop\nfi\n\n# Проверить есть ли стеши:\ngit stash list | wc -l\n\n# Проверить есть ли незакоммиченные изменения:\ngit diff --quiet && git diff --cached --quiet\n# exit code 0 = чисто, 1 = есть изменения\n\n# Pre-commit hook с stash (сохранить unstaged изменения):\n#!/bin/bash\n# Сохраняем unstaged изменения\ngit stash push --keep-index -m "pre-commit stash"\n# Запускаем проверки только на staged изменениях\nmvn checkstyle:check\nRESULT=$?\n# Восстанавливаем\ngit stash pop\nexit $RESULT' },
        { type: 'warning', value: 'Не используй stash как долгосрочное хранилище. Стеш может потеряться при git gc, случайном stash clear или если забудешь о нём. Для долгосрочного хранения — создай WIP коммит или ветку.' }
      ]
    },
    {
      id: 5,
      title: 'Практика: Менеджер Stash',
      type: 'practice',
      difficulty: 'easy',
      description: 'Напишите Java-программу, симулирующую git stash: сохранение, восстановление, просмотр и удаление стешей в стек-структуре.',
      requirements: [
        'Класс StashEntry с полями: index, branchName, message, files (Map<String, String>)',
        'Класс StashManager с Stack<StashEntry> для хранения стешей',
        'Метод push(message, files) — сохранить стеш',
        'Метод pop() — достать и удалить последний стеш',
        'Метод apply(index) — достать без удаления',
        'Метод list() — вывести все стеши',
        'Метод drop(index) — удалить конкретный стеш'
      ],
      expectedOutput: 'Stash push: "WIP: UserService"\nStash push: "WIP: OrderService"\nStash push: "WIP: PaymentService"\n\nStash list:\n  stash@{0}: On feature/payment: WIP: PaymentService (2 files)\n  stash@{1}: On feature/order: WIP: OrderService (1 files)\n  stash@{2}: On feature/user: WIP: UserService (3 files)\n\nStash pop:\n  Restored: WIP: PaymentService\n  Files: [Payment.java, PaymentTest.java]\n\nStash apply stash@{1}:\n  Applied: WIP: UserService\n  Files: [User.java, UserRepo.java, UserTest.java]\n\nStash drop stash@{0}:\n  Dropped: WIP: OrderService\n\nStash list:\n  stash@{0}: On feature/user: WIP: UserService (3 files)',
      hint: 'Используйте Stack (Deque) для LIFO-поведения. При drop нужно пересчитать индексы. Stash хранит "снимок" файлов — используйте Map<String, String> для имён файлов и их содержимого.',
      solution: 'import java.util.*;\n\npublic class Main {\n\n    static class StashEntry {\n        String branchName;\n        String message;\n        Map<String, String> files; // filename -> content\n\n        StashEntry(String branch, String message, Map<String, String> files) {\n            this.branchName = branch;\n            this.message = message;\n            this.files = new LinkedHashMap<>(files);\n        }\n    }\n\n    static class StashManager {\n        private final List<StashEntry> stashes = new ArrayList<>();\n\n        void push(String branch, String message, Map<String, String> files) {\n            stashes.add(0, new StashEntry(branch, message, files));\n            System.out.println("Stash push: \\"" + message + "\\"");\n        }\n\n        StashEntry pop() {\n            if (stashes.isEmpty()) {\n                System.out.println("No stash entries");\n                return null;\n            }\n            StashEntry entry = stashes.remove(0);\n            System.out.println("Stash pop:");\n            System.out.println("  Restored: " + entry.message);\n            System.out.println("  Files: " + new ArrayList<>(entry.files.keySet()));\n            return entry;\n        }\n\n        StashEntry apply(int index) {\n            if (index < 0 || index >= stashes.size()) {\n                System.out.println("stash@{" + index + "}: not found");\n                return null;\n            }\n            StashEntry entry = stashes.get(index);\n            System.out.println("Stash apply stash@{" + index + "}:");\n            System.out.println("  Applied: " + entry.message);\n            System.out.println("  Files: " + new ArrayList<>(entry.files.keySet()));\n            return entry;\n        }\n\n        void drop(int index) {\n            if (index < 0 || index >= stashes.size()) {\n                System.out.println("stash@{" + index + "}: not found");\n                return;\n            }\n            StashEntry entry = stashes.remove(index);\n            System.out.println("Stash drop stash@{" + index + "}:");\n            System.out.println("  Dropped: " + entry.message);\n        }\n\n        void list() {\n            System.out.println("Stash list:");\n            if (stashes.isEmpty()) {\n                System.out.println("  (empty)");\n                return;\n            }\n            for (int i = 0; i < stashes.size(); i++) {\n                StashEntry e = stashes.get(i);\n                System.out.printf("  stash@{%d}: On %s: %s (%d files)%n",\n                    i, e.branchName, e.message, e.files.size());\n            }\n        }\n\n        void clear() {\n            stashes.clear();\n            System.out.println("Cleared all stash entries");\n        }\n    }\n\n    public static void main(String[] args) {\n        StashManager sm = new StashManager();\n\n        // Push 3 стеша\n        sm.push("feature/user", "WIP: UserService",\n            Map.of("User.java", "class User {}", "UserRepo.java", "interface UserRepo {}",\n                   "UserTest.java", "class UserTest {}"));\n\n        sm.push("feature/order", "WIP: OrderService",\n            Map.of("Order.java", "class Order {}"));\n\n        sm.push("feature/payment", "WIP: PaymentService",\n            Map.of("Payment.java", "class Payment {}", "PaymentTest.java", "class PaymentTest {}"));\n\n        System.out.println();\n        sm.list();\n\n        System.out.println();\n        sm.pop();\n\n        System.out.println();\n        sm.apply(1);\n\n        System.out.println();\n        sm.drop(0);\n\n        System.out.println();\n        sm.list();\n    }\n}',
      explanation: 'Git stash работает как стек (LIFO): последний сохранённый стеш имеет индекс 0. Pop извлекает и удаляет верхний элемент. Apply копирует содержимое без удаления. При drop индексы пересчитываются. Внутри Git stash — это набор специальных коммитов, хранящих staged, unstaged и untracked изменения.'
    }
  ]
}
