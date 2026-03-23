export default {
  id: 25,
  title: 'Writing: Bug Reports and Tickets',
  description: 'Написание баг-репортов и тикетов на английском: структура, фразы, примеры.',
  lessons: [
    {
      id: 1,
      title: 'Структура хорошего баг-репорта',
      type: 'theory',
      content: [
        { type: 'text', value: 'Хороший баг-репорт должен быть:\n- Clear (понятным)\n- Concise (кратким)\n- Reproducible (воспроизводимым)\n- Complete (полным)\n\nОбязательные разделы:\n1. Title — краткое описание (1 строка)\n2. Description — подробности\n3. Steps to Reproduce — шаги для воспроизведения\n4. Expected Behaviour — ожидаемое поведение\n5. Actual Behaviour — фактическое поведение\n6. Environment — среда (OS, browser, version)\n7. Severity — критичность (Critical/High/Medium/Low)\n8. Attachments — скриншоты, логи' }
      ]
    },
    {
      id: 2,
      title: 'Написание заголовка баг-репорта',
      type: 'theory',
      content: [
        { type: 'text', value: 'Хороший заголовок баг-репорта: [Component] Action + Condition\n\nШаблоны заголовков:\n[Component] [action] fails when [condition]\n[Component] [action] returns incorrect [result]\n[Feature] not working on [environment]\nError: [error message] when [action]\n\nХорошие примеры:\nLogin fails when email contains uppercase letters\nCheckout page crashes when payment method is changed\nUser profile not loading on mobile devices\nAPI returns 500 error when request body is empty\nSearch results not updating after filter is applied\n\nПлохие примеры (слишком расплывчато):\nBug in login (слишком общо)\nSomething is broken (непонятно)\nHelp! (не информативно)\nNeed fix (нет деталей)' }
      ]
    },
    {
      id: 3,
      title: 'Описание шагов воспроизведения',
      type: 'theory',
      content: [
        { type: 'text', value: 'Steps to Reproduce должны быть пронумерованы и точными:\n\nХороший пример:\nSteps to Reproduce:\n1. Open the app and log in with a valid account.\n2. Navigate to Settings > Profile.\n3. Click "Change Password".\n4. Enter the current password correctly.\n5. Enter a new password with a special character (e.g. "P@ssword123").\n6. Click "Save Changes".\n\nExpected Behaviour:\nThe password is updated successfully, and a confirmation message appears.\n\nActual Behaviour:\nAn error message appears: "Invalid password format" even though the format meets the requirements.\n\nShortcut — если воспроизводится всегда/иногда:\nThis happens every time. (Это происходит каждый раз.)\nThis happens intermittently, about 30% of the time. (Это происходит периодически, примерно в 30% случаев.)\nI could only reproduce this once. (Мне удалось воспроизвести это только один раз.)' }
      ]
    },
    {
      id: 4,
      title: 'Описание окружения и важности',
      type: 'theory',
      content: [
        { type: 'text', value: 'Environment (окружение):\nOS: Windows 11 / macOS 14 / Ubuntu 22.04\nBrowser: Chrome 120 / Firefox 121\nApp version: 2.5.3\nAPI version: v2\nDatabase: PostgreSQL 15\n\nSeverity levels (уровни критичности):\nCritical — приложение полностью недоступно, потеря данных\nHigh — важная функция не работает\nMedium — функция работает с ошибками\nLow — незначительные проблемы, косметика\n\nPriority levels (приоритет):\nP1 — нужно исправить немедленно\nP2 — нужно исправить в текущем спринте\nP3 — исправить в следующем спринте\nP4 — когда будет время\n\nФразы для описания критичности:\nThis is a critical bug blocking all users. (Это критический баг, блокирующий всех пользователей.)\nThis affects approximately 20% of users. (Это затрагивает примерно 20% пользователей.)\nThis is a cosmetic issue with no functional impact. (Это косметическая проблема без функционального влияния.)' }
      ]
    },
    {
      id: 5,
      title: 'Написание тикетов и User Stories',
      type: 'theory',
      content: [
        { type: 'text', value: 'USER STORY — пользовательская история\nФормат: As a [role], I want to [action] so that [benefit].\n\nПримеры:\nAs a user, I want to be able to reset my password so that I can access my account if I forget it.\n(Как пользователь, я хочу иметь возможность сбросить пароль, чтобы я мог получить доступ к аккаунту, если забуду его.)\n\nAs a developer, I want to see detailed error logs so that I can debug issues faster.\n(Как разработчик, я хочу видеть подробные логи ошибок, чтобы я мог быстрее отлаживать проблемы.)\n\nACCEPTANCE CRITERIA (критерии приёмки):\nWhat conditions must be met for the story to be "done"?\n\nAcceptance Criteria:\n- User can request a password reset via email\n- Reset link expires after 24 hours\n- User receives confirmation email after successful reset\n- Old password no longer works after reset' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Написание заголовков тикетов',
      type: 'practice',
            description: 'Напишите заголовки баг-репортов на английском языке по описаниям.',
      solution: 'Правильные ответы:\\n1. File upload page freezes when uploading files larger than 10MB.\\n2. "Save" button not working in mobile Safari browser.\\n3. API returns 404 when username contains special characters.\\n4. Email notifications not sent after registration.\\n5. Search does not find results with Cyrillic characters.',
content: [
        { type: 'text', value: 'Напишите заголовки баг-репортов на английском языке по описаниям.' },
        {
          type: 'exercise',
          subtype: 'translation',
          items: [
            { id: 1, question: 'Страница загрузки файлов зависает при загрузке файлов больше 10 МБ.', answer: 'File upload page freezes when uploading files larger than 10MB.' },
            { id: 2, question: 'Кнопка "Сохранить" не работает в мобильном браузере Safari.', answer: '"Save" button not working in mobile Safari browser.' },
            { id: 3, question: 'API возвращает 404 когда username содержит специальные символы.', answer: 'API returns 404 when username contains special characters.' },
            { id: 4, question: 'Email уведомления не отправляются после регистрации.', answer: 'Email notifications not sent after registration.' },
            { id: 5, question: 'Поиск не находит результаты с кириллическими символами.', answer: 'Search does not find results with Cyrillic characters.' }
          ]
        }
      ]
    },
    {
      id: 7,
      title: 'Практика: Написание полного баг-репорта',
      type: 'practice',
            description: 'Напишите полный баг-репорт по следующей ситуации:',
      solution: 'Примеры ответов:\\n1. Title: Account email not updating when changed in Settings\\n\\nSteps to Reproduce:\\n1. Log in to the app.\\n2. Navigate to Account Settings.\\n3. Change the email address to a new valid email.\\n4. Click ...',
content: [
        { type: 'text', value: 'Напишите полный баг-репорт по следующей ситуации:\n\nСитуация: Вы заметили, что когда пользователь пытается изменить свой email в настройках аккаунта, страница перезагружается, но email не изменяется. Это происходит каждый раз.' },
        {
          type: 'exercise',
          subtype: 'writing',
          items: [
            {
              id: 1,
              question: 'Напишите баг-репорт: Title, Steps to Reproduce (3-4 шага), Expected Behaviour, Actual Behaviour',
              answer: 'Title: Account email not updating when changed in Settings\n\nSteps to Reproduce:\n1. Log in to the app.\n2. Navigate to Account Settings.\n3. Change the email address to a new valid email.\n4. Click "Save Changes".\n\nExpected Behaviour:\nThe email address is updated and a confirmation message appears.\n\nActual Behaviour:\nThe page reloads but the email address remains unchanged. No error message is shown.\n\nSeverity: High'
            }
          ]
        }
      ]
    }
  ]
}
