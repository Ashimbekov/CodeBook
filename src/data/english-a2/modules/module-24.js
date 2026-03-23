export default {
  id: 24,
  title: 'Reading: GitHub Issues and PRs',
  description: 'Чтение GitHub Issues и Pull Requests: понимание технических обсуждений, описаний и комментариев.',
  lessons: [
    {
      id: 1,
      title: 'Структура GitHub Issue',
      type: 'theory',
      content: [
        { type: 'text', value: 'GitHub Issue — это способ отслеживать задачи, баги и запросы функций.\n\nСтруктура Issue:\nTitle (заголовок) — краткое описание проблемы\nLabels (метки) — bug, feature, enhancement, question, documentation\nAssignee (исполнитель) — кто работает над задачей\nMilestone (веха) — к какому релизу относится\nDescription (описание) — подробности проблемы\nComments (комментарии) — обсуждение\n\nТипичные заголовки Issue:\n[Bug] Login fails when email contains special characters\n[Feature] Add dark mode support\n[Enhancement] Improve search performance\nNullPointerException in UserService.getUser()\nDocument the authentication API endpoints' }
      ]
    },
    {
      id: 2,
      title: 'Чтение Bug Report Issues',
      type: 'theory',
      content: [
        { type: 'text', value: 'Пример Bug Report Issue:\n\nTitle: [Bug] App crashes on iOS 17 when camera is accessed\nLabels: bug, critical, iOS\nAssigned to: @john-developer\n\nDescription:\nEnvironment:\n- App version: 2.3.1\n- iOS version: 17.0\n- Device: iPhone 14 Pro\n\nSteps to Reproduce:\n1. Open the app\n2. Navigate to Profile settings\n3. Tap "Change Profile Photo"\n4. Select "Take Photo"\n\nExpected Behaviour:\nCamera opens and allows taking a photo.\n\nActual Behaviour:\nApp crashes immediately when camera is accessed.\n\nError Log:\nFatal error: Nil found unexpectedly at line 42\n\nAdditional Context:\nThis issue was introduced in version 2.3.0. It worked correctly in version 2.2.x.\n\nКлючевые фразы:\nThis issue was introduced in... (Эта проблема была введена в...)\nIt worked correctly in... (Это работало правильно в...)\nThe app crashes immediately when... (Приложение немедленно падает когда...)' }
      ]
    },
    {
      id: 3,
      title: 'Чтение Feature Request Issues',
      type: 'theory',
      content: [
        { type: 'text', value: 'Пример Feature Request:\n\nTitle: [Feature] Add support for 2FA (Two-Factor Authentication)\nLabels: feature, security, enhancement\n\nDescription:\nIs your feature request related to a problem? Please describe.\nUsers have no way to add extra security to their accounts.\n\nDescribe the solution you\'d like:\nAdd support for TOTP-based two-factor authentication (like Google Authenticator). Users should be able to enable/disable 2FA in their account settings.\n\nDescribe alternatives you\'ve considered:\nSMS-based 2FA was considered but TOTP is more secure and doesn\'t require a phone number.\n\nAdditional context:\nThis would align with our security roadmap for Q2 2024.\n\nКлючевые фразы для Feature Request:\nIs your feature request related to...? (Связан ли ваш запрос с...?)\nDescribe the solution you\'d like. (Опишите желаемое решение.)\nDescribe alternatives you\'ve considered. (Опишите рассмотренные альтернативы.)\nThis would align with... (Это соответствует...)' }
      ]
    },
    {
      id: 4,
      title: 'Структура Pull Request',
      type: 'theory',
      content: [
        { type: 'text', value: 'Pull Request (PR) — запрос на добавление изменений в основную ветку.\n\nСтруктура PR:\nTitle (заголовок) — feat: add user authentication\nDescription (описание) — что изменилось и почему\nChanges (изменения) — список изменённых файлов\nReviewers (рецензенты) — кто проверяет\nLinked Issues (связанные задачи) — Closes #123\nStatus checks (статусы) — CI/CD, tests\n\nОбщая структура описания PR:\nWhat does this PR do? (Что делает этот PR?)\nWhy are these changes needed? (Почему нужны эти изменения?)\nHow was it tested? (Как это тестировалось?)\nScreenshots (if applicable) (Скриншоты — если применимо)\nRelated issues (связанные задачи)\n\nПолезные ключевые слова:\nCloses #123 — закрывает задачу 123\nFixes #456 — исправляет задачу 456\nRelated to #789 — связано с задачей 789\nReviewed-by: @username — проверено пользователем' }
      ]
    },
    {
      id: 5,
      title: 'Комментарии в Code Review',
      type: 'theory',
      content: [
        { type: 'text', value: 'Типичные комментарии в Code Review:\n\nВопросы:\nCould you explain why you chose this approach? (Не могли бы вы объяснить, почему вы выбрали этот подход?)\nWhat happens if this returns null? (Что произойдёт, если это вернёт null?)\nIs this function tested? (Эта функция протестирована?)\n\nПредложения:\nConsider using [alternative] instead. (Рассмотрите использование [альтернативы] вместо этого.)\nThis could be simplified to... (Это можно упростить до...)\nYou could also use a Map here for better performance. (Здесь также можно использовать Map для лучшей производительности.)\n\nПроблемы:\nThis will cause a bug if the array is empty. (Это вызовет баг, если массив пустой.)\nThis function is too long. Consider splitting it. (Эта функция слишком длинная. Рассмотрите разбивку.)\nMissing error handling. (Отсутствует обработка ошибок.)\n\nОдобрение:\nLGTM (Looks Good To Me) — выглядит хорошо\nNit: — несущественный комментарий (nitpick)\n:+1: или Approved — одобрено\nShip it! — деплоить!>' }
      ]
    },
    {
      id: 6,
      title: 'Практический текст: чтение PR',
      type: 'theory',
      content: [
        { type: 'text', value: 'Пример PR для чтения:\n\nTitle: feat: implement JWT authentication\nAuthor: @alice-dev\nReviewers: @bob-senior, @charlie-lead\n\nDescription:\nThis PR implements JWT (JSON Web Token) authentication for our REST API.\n\nChanges:\n- Added JwtService class for token generation and validation\n- Added AuthMiddleware to protect routes\n- Updated UserController with login/logout endpoints\n- Added unit tests for JwtService (95% coverage)\n- Updated API documentation\n\nTesting:\n- All existing tests pass\n- Added 24 new unit tests\n- Manually tested with Postman\n\nCloses #45, #67\n\nReview Comment from @bob-senior:\nThe token expiration time is hardcoded to 24 hours. Consider making it configurable via environment variables.\n\nResponse from @alice-dev:\nGood point! I\'ll update this in the next commit.\n\n@charlie-lead: LGTM! Just one nit — the error messages could be more descriptive. But this is minor. Approved.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Понимание GitHub текстов',
      type: 'practice',
            description: 'Прочитайте PR описание и ответьте на вопросы.',
      solution: 'Правильные ответы:\\n1. It refactors the payment processing module to use the new Stripe API v3.\\n2. Because the old API will be deprecated on March 1st, 2024.\\n3. It means this PR closes/resolves issue number 234.\\n4. 12 new tests.\\n5. Старый API будет признан устаревшим с 1 марта.',
content: [
        { type: 'text', value: 'Прочитайте PR описание и ответьте на вопросы.\n\n"This PR refactors the payment processing module to use the new Stripe API v3. The old API will be deprecated on March 1st, 2024. Changes include updating the payment service, adding webhook support, and improving error handling. All 47 existing tests pass and I\'ve added 12 new tests for the webhook functionality. Closes #234."' },
        {
          type: 'exercise',
          subtype: 'fill_blank',
          items: [
            { id: 1, question: 'What does this PR do?', answer: 'It refactors the payment processing module to use the new Stripe API v3.' },
            { id: 2, question: 'Why are the changes needed?', answer: 'Because the old API will be deprecated on March 1st, 2024.' },
            { id: 3, question: 'What is "Closes #234"?', answer: 'It means this PR closes/resolves issue number 234.' },
            { id: 4, question: 'How many new tests were added?', answer: '12 new tests.' },
            { id: 5, question: 'Переведи: "The old API will be deprecated on March 1st."', answer: 'Старый API будет признан устаревшим с 1 марта.' }
          ]
        }
      ]
    }
  ]
}
