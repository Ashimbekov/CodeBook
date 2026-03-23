export default {
  id: 26,
  title: 'Writing: Commit Messages and PR Descriptions',
  description: 'Написание commit messages и PR descriptions: conventional commits, структура, примеры.',
  lessons: [
    {
      id: 1,
      title: 'Принципы хороших commit messages',
      type: 'theory',
      content: [
        { type: 'text', value: 'Правила написания хороших commit messages:\n\n1. Use the imperative mood (используй повелительное наклонение)\nПравильно: "Fix login bug" (Исправь баг входа)\nНеправильно: "Fixed login bug" / "Fixes login bug"\n\n2. First line: max 50 characters (первая строка: макс. 50 символов)\n3. Explain what AND why, not how (объясни что И почему, не как)\n4. Be specific (будь конкретным)\n5. Reference issues when relevant (ссылайся на задачи)\n\nПлохие примеры:\nfixed stuff (что именно?)\nwip (work in progress — нет информации)\nchanges (слишком общо)\nupdate (без деталей)\n\nХорошие примеры:\nFix null pointer exception in UserService.getUser()\nAdd rate limiting to prevent API abuse\nUpdate dependencies to address security vulnerabilities\nRefactor database connection pool for better performance' }
      ]
    },
    {
      id: 2,
      title: 'Conventional Commits формат',
      type: 'theory',
      content: [
        { type: 'text', value: 'Conventional Commits — стандарт для коммит-сообщений:\n\nФормат: <type>(<scope>): <description>\n\nТипы (type):\nfeat — новая функция\nfix — исправление бага\nrefactor — рефакторинг (не баг, не функция)\ndocs — изменение документации\ntest — добавление/изменение тестов\nchore — технические задачи (обновление зависимостей и т.д.)\nperf — улучшение производительности\nstyle — форматирование кода (без изменения логики)\nci — изменения CI/CD\nrevert — откат изменений\n\nScope (область) — опционально:\nfeat(auth): add OAuth2 login\nfix(api): handle empty response body\ndocs(readme): add installation instructions\n\nПримеры:\nfeat(auth): implement JWT token refresh\nfix(payments): resolve race condition in checkout\nrefactor(database): extract connection pool to separate module\ntest(users): add integration tests for user registration\nchore(deps): update axios from 0.21.1 to 1.6.0\nperf(search): optimize Elasticsearch query for better response time' }
      ]
    },
    {
      id: 3,
      title: 'Multi-line commit messages',
      type: 'theory',
      content: [
        { type: 'text', value: 'Когда нужно больше деталей, используй многострочное сообщение:\n\nСтруктура:\nLine 1: summary (50 chars max)\nLine 2: blank line\nLines 3+: detailed explanation\n\nПример:\nfix: prevent login loop on session expiry\n\nWhen the session expires, the app was redirecting to login\nand then immediately redirecting back, causing an infinite\nloop. The fix adds a check for the current route before\nredirecting.\n\nThe issue was caused by the auth middleware not properly\nhandling the case where the user is already on the login page.\n\nFixes #234' },
        { type: 'heading', value: 'Полезные глаголы для commit messages' },
        { type: 'text', value: 'Add (добавить): Add user profile picture upload\nFix (исправить): Fix null pointer in getUserById\nUpdate (обновить): Update README with Docker instructions\nRemove/Delete (удалить): Remove deprecated API endpoints\nRefactor (рефакторить): Refactor authentication middleware\nOptimize (оптимизировать): Optimize database queries\nImplement (реализовать): Implement two-factor authentication\nRevert (откатить): Revert "add feature X" - causes production issues\nMerge (смержить): Merge branch \'feature/login\' into develop\nExtract (вынести): Extract validation logic into separate function\nRename (переименовать): Rename UserController to AccountController' }
      ]
    },
    {
      id: 4,
      title: 'Написание PR Description',
      type: 'theory',
      content: [
        { type: 'text', value: 'Хорошее описание PR помогает рецензентам понять изменения.\n\nСтруктура PR Description:\n## Summary\nBrief description of what this PR does.\n\n## Changes\n- List of key changes\n- Another change\n\n## Why\nExplanation of why these changes are needed.\n\n## Testing\n- How was this tested?\n- Test results\n\n## Screenshots (if applicable)\n\n## Related Issues\nCloses #123\n\nПример:\n## Summary\nThis PR adds user avatar upload functionality.\n\n## Changes\n- Added POST /users/{id}/avatar endpoint\n- Added image compression using sharp library\n- Updated user profile UI to show avatar\n- Added tests for avatar upload\n\n## Why\nUsers have been requesting profile pictures since launch.\nThis is part of the Q1 roadmap for user experience improvements.\n\n## Testing\n- Unit tests: all passing\n- Manual testing: tested with JPG, PNG, WebP formats\n- Tested with files up to 10MB\n\nCloses #45' }
      ]
    },
    {
      id: 5,
      title: 'Ответы на комментарии к PR',
      type: 'theory',
      content: [
        { type: 'text', value: 'Как отвечать на комментарии к PR:\n\nПринятие критики:\nGood point! I\'ll update this. (Хорошее замечание! Я это обновлю.)\nThanks for catching that. Fixed! (Спасибо, что заметил. Исправлено!)\nYou\'re right. I\'ve updated the code. (Ты прав. Я обновил код.)\n\nОбъяснение своей позиции:\nI chose this approach because... (Я выбрал этот подход потому что...)\nThe reason I did it this way is... (Причина, по которой я сделал это так, в том что...)\nThis is intentional because... (Это намеренно, потому что...)\n\nВопросы:\nCould you clarify what you mean? (Не могли бы вы уточнить, что вы имеете в виду?)\nAre you suggesting I should...? (Вы предлагаете мне...?)\n\nОтметка разрешённых комментариев:\nDone! (Готово!)\nFixed in the latest commit. (Исправлено в последнем коммите.)\nResolved. (Разрешено.)' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Написание commit messages',
      type: 'practice',
      content: [
        { type: 'text', value: 'Напишите правильные commit messages в формате Conventional Commits.' },
        {
          type: 'exercise',
          subtype: 'translation',
          items: [
            { id: 1, question: 'Ты добавил функцию смены пароля (модуль auth).', answer: 'feat(auth): add password change functionality' },
            { id: 2, question: 'Ты исправил баг с null pointer в функции getUserById.', answer: 'fix(users): resolve null pointer in getUserById function' },
            { id: 3, question: 'Ты обновил README с инструкциями по Docker.', answer: 'docs(readme): add Docker setup instructions' },
            { id: 4, question: 'Ты добавил тесты для модуля платежей.', answer: 'test(payments): add unit tests for payment processing' },
            { id: 5, question: 'Ты оптимизировал запросы к базе данных для улучшения производительности.', answer: 'perf(database): optimize queries for better performance' },
            { id: 6, question: 'Ты удалил устаревший API-эндпоинт /api/v1/users/old.', answer: 'chore(api): remove deprecated /api/v1/users/old endpoint' }
          ]
        }
      ]
    },
    {
      id: 7,
      title: 'Практика: Написание PR Description',
      type: 'practice',
      content: [
        { type: 'text', value: 'Напишите краткое описание PR по данной информации:\n\nЧто: Добавлена двухфакторная аутентификация (2FA) с TOTP.\nПочему: Улучшение безопасности аккаунтов пользователей.\nЧто изменилось: Новый endpoint /auth/2fa/enable, обновлён UserService, добавлено 20 тестов.\nЗакрывает задачу #87.' },
        {
          type: 'exercise',
          subtype: 'writing',
          items: [
            {
              id: 1,
              question: 'Напишите PR description на английском (Summary, Changes, Why, Closes)',
              answer: '## Summary\nThis PR adds two-factor authentication (2FA) using TOTP.\n\n## Changes\n- Added POST /auth/2fa/enable endpoint\n- Updated UserService with 2FA support\n- Added 20 new unit and integration tests\n\n## Why\nThis improves account security for users. It is part of our security roadmap.\n\nCloses #87'
            }
          ]
        }
      ]
    }
  ]
}
