export default {
  id: 33,
  title: 'Practice: Writing Emails and Tickets',
  description: 'Практикум по написанию деловых email и тикетов: структура, фразы, полные примеры.',
  lessons: [
    {
      id: 1,
      title: 'Деловой email: структура',
      type: 'practice',
      content: [
        { type: 'text', value: 'Структура делового email:\n\n1. Subject (тема): краткое и информативное\n2. Greeting (приветствие): Hi/Hello + имя\n3. Opening (вступление): цель письма\n4. Body (основная часть): детали\n5. Call to action (действие): что нужно сделать\n6. Closing (завершение): Best regards / Thanks\n7. Signature (подпись): имя и должность\n\nПримеры приветствий:\nHi [Name], (неформальное)\nHello [Name], (нейтральное)\nDear [Name], (формальное)\n\nПримеры завершений:\nBest regards, / Kind regards, (формальное)\nThanks, / Best, (неформальное)\nLooking forward to your reply. (Жду вашего ответа.)' },
        {
          type: 'exercise',
          subtype: 'writing',
          items: [
            { id: 1, question: 'Напишите email коллеге с просьбой проверить ваш PR. Subject, Greeting, 3-4 предложения основной части, Closing.', answer: 'Subject: Code review request - PR #234\n\nHi Alex,\n\nI hope you\'re doing well. I\'ve just submitted a pull request (#234) that implements the user authentication feature. Could you please review it when you have time?\n\nThe PR adds JWT authentication and includes 25 unit tests. I\'ve also updated the API documentation.\n\nPlease let me know if you have any questions.\n\nThanks,\nMaria' }
          ]
        }
      ]
    },
    {
      id: 2,
      title: 'Email об инциденте — тест',
      type: 'practice',
      content: [
        { type: 'text', value: 'Прочитайте email об инциденте и ответьте на вопросы.\n\n---\nSubject: [INCIDENT] Production outage - 2024-01-15 02:30-03:15 UTC\n\nHi team,\n\nI\'m writing to inform you about a production outage that occurred last night.\n\nIncident Summary:\n- Duration: 45 minutes (02:30 - 03:15 UTC)\n- Impact: All users were unable to access the application\n- Root cause: Database disk space ran out due to uncontrolled log growth\n\nWhat happened:\nAt 02:30 UTC, monitoring alerts fired for high disk usage. By 02:35, disk was at 100% and the database stopped accepting writes. The application became unavailable.\n\nResolution:\nWe identified the issue and cleared old log files. By 03:15 UTC, the service was fully restored.\n\nPrevention:\n- We have set up automated log rotation\n- Disk usage alerts have been lowered to 80%\n\nWe apologize for the inconvenience.\n\nBest regards,\nDev Team\n---' },
        {
          type: 'exercise',
          subtype: 'fill_blank',
          items: [
            { id: 1, question: 'How long did the outage last?', answer: '45 minutes.' },
            { id: 2, question: 'What was the root cause?', answer: 'Database disk space ran out due to uncontrolled log growth.' },
            { id: 3, question: 'What was the impact?', answer: 'All users were unable to access the application.' },
            { id: 4, question: 'How was the issue resolved?', answer: 'They cleared old log files.' },
            { id: 5, question: 'What prevention measures were taken?', answer: 'Automated log rotation was set up, and disk usage alerts were lowered to 80%.' }
          ]
        }
      ]
    },
    {
      id: 3,
      title: 'Email с просьбой о помощи — написание',
      type: 'practice',
      content: [
        { type: 'text', value: 'Напишите email по данным ситуациям.' },
        {
          type: 'exercise',
          subtype: 'writing',
          items: [
            { id: 1, question: 'Напишите email DevOps-команде с просьбой дать доступ к staging-серверу. Объясните зачем (тестирование новой функции). 4-5 предложений.', answer: 'Subject: Request for staging server access\n\nHi DevOps team,\n\nI\'m working on the new user profile feature (ticket #89) and need access to the staging server to test it.\n\nCould you please grant me SSH access? I need to deploy and test the feature before the PR review.\n\nThe access is needed from January 15 to January 20.\n\nThank you,\nJohn' },
            { id: 2, question: 'Напишите email менеджеру с объяснением задержки задачи. Причина: нашли неожиданно сложный баг. Новая оценка: +2 дня.', answer: 'Subject: Delay in task #123 - updated estimate\n\nHi Sarah,\n\nI\'m writing to let you know that task #123 will take longer than originally estimated.\n\nWhile working on the feature, I discovered a complex bug in the authentication module. This requires additional investigation and testing.\n\nMy new estimate is 2 additional days. The task will be ready by Friday, January 19.\n\nApologies for the delay. I will keep you updated.\n\nBest regards,\nAlex' }
          ]
        }
      ]
    },
    {
      id: 4,
      title: 'Написание тикетов в Jira — тест',
      type: 'practice',
      content: [
        { type: 'text', value: 'Напишите полные тикеты по описаниям ситуаций.' },
        {
          type: 'exercise',
          subtype: 'writing',
          items: [
            { id: 1, question: 'Баг: При нажатии кнопки "Удалить аккаунт" страница зависает. Это происходит в Chrome и Firefox. Инцидент критический.', answer: 'Title: [Bug] Page freezes when clicking "Delete Account" button\n\nSeverity: Critical\n\nSteps to Reproduce:\n1. Log in to the application.\n2. Navigate to Account Settings.\n3. Click "Delete Account".\n\nExpected: Confirmation dialog appears.\nActual: Page freezes and becomes unresponsive.\n\nEnvironment: Chrome 120, Firefox 121\n\nAdditional Notes: Reproduced on every attempt. Users cannot close the page without force-reloading.' },
            { id: 2, question: 'User Story: Как пользователь, я хочу экспортировать свои данные в CSV, чтобы анализировать их в Excel.', answer: 'Title: [Feature] Add CSV export for user data\n\nAs a user, I want to export my data to CSV so that I can analyze it in Excel.\n\nAcceptance Criteria:\n- User can click "Export to CSV" button in the dashboard\n- CSV file contains all user data (transactions, profile info)\n- File downloads automatically\n- Export works for data ranges (last week, month, year)\n\nEstimate: 3 story points' }
          ]
        }
      ]
    },
    {
      id: 5,
      title: 'Написание ответов на технические вопросы',
      type: 'practice',
      content: [
        { type: 'text', value: 'Напишите короткие ответы на технические вопросы клиента.' },
        {
          type: 'exercise',
          subtype: 'writing',
          items: [
            { id: 1, question: 'Клиент спрашивает: "Why is the app so slow? It takes 5 seconds to load." Напишите ответ (3-4 предложения).', answer: 'Hi,\n\nThank you for reporting this issue. We are aware of the slow load times and are investigating.\n\nThe issue is caused by unoptimized database queries. We have a fix ready and will deploy it tomorrow.\n\nWe apologize for the inconvenience and will update you once the fix is live.\n\nBest regards,\nSupport Team' },
            { id: 2, question: 'Клиент спрашивает: "When will the new feature X be available?" Напишите ответ с информацией: запланировано на Q2, точная дата будет объявлена позже.', answer: 'Hi,\n\nThank you for your interest in feature X. We are happy to let you know that it is planned for Q2 2024.\n\nWe don\'t have an exact release date yet, but we will announce it on our blog and via email when it is ready.\n\nIs there anything else I can help you with?\n\nBest regards,\nProduct Team' }
          ]
        }
      ]
    },
    {
      id: 6,
      title: 'Email фразы — тест',
      type: 'practice',
      content: [
        { type: 'text', value: 'Переведите email-фразы на английский язык.' },
        {
          type: 'exercise',
          subtype: 'translation',
          items: [
            { id: 1, question: 'Надеюсь, у тебя всё хорошо.', answer: 'I hope you\'re doing well.' },
            { id: 2, question: 'Пишу, чтобы сообщить вам о...', answer: 'I\'m writing to inform you about...' },
            { id: 3, question: 'Не могли бы вы проверить это?', answer: 'Could you please review this?' },
            { id: 4, question: 'Жду вашего ответа.', answer: 'Looking forward to your reply.' },
            { id: 5, question: 'Приношу извинения за неудобства.', answer: 'I apologize for the inconvenience.' },
            { id: 6, question: 'Пожалуйста, дайте мне знать, если у вас есть вопросы.', answer: 'Please let me know if you have any questions.' },
            { id: 7, question: 'Спасибо за ваше время.', answer: 'Thank you for your time.' },
            { id: 8, question: 'Прикрепляю файл для ознакомления.', answer: 'I\'m attaching the file for your reference.' }
          ]
        }
      ]
    },
    {
      id: 7,
      title: 'Формальный vs неформальный email',
      type: 'practice',
      content: [
        { type: 'text', value: 'Определите: формальный или неформальный? Или перепишите в другом стиле.' },
        {
          type: 'exercise',
          subtype: 'translation',
          items: [
            { id: 1, question: 'Перепиши формально: "Hey, can u look at my PR? Thx"', answer: 'Hi [Name], could you please review my pull request when you have time? Thank you.' },
            { id: 2, question: 'Перепиши неформально: "I would like to respectfully request your assistance with the aforementioned technical issue."', answer: 'Hey, could you help me with this issue?' },
            { id: 3, question: 'Формальное или неформальное: "Best regards, John Smith, Senior Developer"', answer: 'Формальное.' },
            { id: 4, question: 'Формальное или неформальное: "Cheers, John"', answer: 'Неформальное (British English).' }
          ]
        }
      ]
    },
    {
      id: 8,
      title: 'Написание постмортема — практика',
      type: 'practice',
      content: [
        { type: 'text', value: 'Постмортем — анализ инцидента после его разрешения.\n\nСтруктура постмортема:\n1. Incident summary (краткое описание)\n2. Timeline (хронология)\n3. Root cause (первопричина)\n4. Impact (влияние)\n5. Resolution (решение)\n6. Prevention (профилактика)\n\nНапишите мини-постмортем по следующему инциденту: сервер упал в 3 ночи из-за DDoS-атаки, восстановление заняло 2 часа, потеряли 0.5% пользователей.' },
        {
          type: 'exercise',
          subtype: 'writing',
          items: [
            { id: 1, question: 'Напишите постмортем (5-7 предложений), используя структуру выше.', answer: 'Incident Summary: Production server outage due to DDoS attack.\n\nTimeline: Attack started at 03:00 UTC. Server became unavailable at 03:05. Issue was resolved at 05:00 UTC.\n\nRoot Cause: A DDoS attack overwhelmed our servers. We did not have rate limiting configured.\n\nImpact: 2 hours of downtime. 0.5% of users were affected.\n\nResolution: We blocked the attacking IPs and enabled Cloudflare DDoS protection.\n\nPrevention: We will implement rate limiting and improve our DDoS protection going forward.' }
          ]
        }
      ]
    },
    {
      id: 9,
      title: 'Написание Slack/Teams сообщений',
      type: 'practice',
      content: [
        { type: 'text', value: 'Напишите короткие сообщения для корпоративного мессенджера.' },
        {
          type: 'exercise',
          subtype: 'writing',
          items: [
            { id: 1, question: 'Сообщите команде, что деплой прошёл успешно. (1-2 предложения)', answer: 'Deployment to production was successful! Version 2.5 is now live. No issues detected.' },
            { id: 2, question: 'Попросите помощи — застряли на баге с JWT. (2-3 предложения)', answer: 'Hey team, I\'m stuck on a JWT authentication issue. The token validation fails for some users but not others. Could anyone help me debug this?' },
            { id: 3, question: 'Предупредите команду о плановом обслуживании сервера в субботу. (2-3 предложения)', answer: 'Heads up everyone! We have scheduled server maintenance on Saturday, January 20, from 02:00 to 04:00 UTC. The app will be unavailable during this time. Please plan accordingly.' }
          ]
        }
      ]
    },
    {
      id: 10,
      title: 'Итоговый тест по написанию',
      type: 'practice',
      content: [
        { type: 'text', value: 'Напишите полный email по ситуации:\n\nВы разработчик. Клиент сообщил вам баг: при входе в систему через мобильное приложение получает ошибку 401. Вы уже нашли причину (неверный алгоритм JWT токена для мобильных клиентов) и исправите это завтра.' },
        {
          type: 'exercise',
          subtype: 'writing',
          items: [
            { id: 1, question: 'Напишите email клиенту: благодарность за репорт, объяснение проблемы, когда будет исправлено.', answer: 'Subject: Update on login issue - JWT token fix\n\nHi,\n\nThank you for reporting the login issue. We apologize for the inconvenience.\n\nWe have investigated the problem and found the root cause. The mobile app was using an incorrect JWT token algorithm that our server was rejecting. This caused the 401 Unauthorized error.\n\nThe fix is ready and will be deployed tomorrow, January 16. After the update, you should be able to log in without any issues.\n\nIf the problem persists after tomorrow, please don\'t hesitate to contact us.\n\nBest regards,\nSupport Team' }
          ]
        }
      ]
    }
  ]
}
