export default {
  id: 9,
  title: 'Passive Voice (Basic)',
  description: 'Пассивный залог: когда и как использовать, IT-примеры с баг-репортами и документацией.',
  lessons: [
    {
      id: 1,
      title: 'Что такое пассивный залог',
      type: 'theory',
      content: [
        { type: 'text', value: 'В активном залоге субъект выполняет действие:\nThe developer fixed the bug. (Разработчик исправил баг.)\n\nВ пассивном залоге субъект получает действие, действующее лицо менее важно или неизвестно:\nThe bug was fixed. (Баг был исправлен.)\n\nПассивный залог используется когда:\n1. Действующее лицо неизвестно\n2. Действующее лицо неважно\n3. Хотим подчеркнуть объект, а не субъект (часто в технической документации)\n4. Официальный/технический стиль\n\nФорма: am/is/are/was/were + V3 (причастие прошедшего времени)' },
        { type: 'heading', value: 'Временные формы пассивного залога' },
        { type: 'text', value: 'Present Simple Passive: am/is/are + V3\nThe bug is reported by the user. (Баг сообщается пользователем.)\nTests are run automatically. (Тесты запускаются автоматически.)\n\nPast Simple Passive: was/were + V3\nThe bug was found by QA. (Баг был найден QA.)\nThe server was restarted. (Сервер был перезапущен.)\n\nPresent Perfect Passive: has/have been + V3\nThe feature has been implemented. (Функция была реализована.)\nThe tests have been updated. (Тесты были обновлены.)' }
      ]
    },
    {
      id: 2,
      title: 'Present Simple Passive',
      type: 'theory',
      content: [
        { type: 'text', value: 'Present Simple Passive: am/is/are + V3\n\nИспользуется для постоянных процессов, правил, описания систем.\n\nПримеры:\nData is stored in the database. (Данные хранятся в базе данных.)\nUsers are authenticated via OAuth. (Пользователи аутентифицируются через OAuth.)\nRequests are handled by the load balancer. (Запросы обрабатываются балансировщиком нагрузки.)\nCode is reviewed before merging. (Код проверяется перед слиянием.)\nLogs are stored for 30 days. (Логи хранятся 30 дней.)\nPasswords are encrypted using bcrypt. (Пароли шифруются с использованием bcrypt.)\nThe application is deployed on AWS. (Приложение развёрнуто на AWS.)\nAPI responses are cached for 5 minutes. (Ответы API кэшируются на 5 минут.)' },
        { type: 'heading', value: 'Отрицание и вопросы' },
        { type: 'text', value: 'Отрицание: am/is/are not + V3\nSensitive data is not stored in plain text. (Конфиденциальные данные не хранятся в открытом виде.)\nDebug logs are not shown in production. (Логи отладки не показываются в продакшне.)\n\nВопросы: Is/Are + подлежащее + V3?\nIs the database backed up daily? (База данных резервируется ежедневно?)\nAre all endpoints tested? (Все эндпоинты протестированы?)' }
      ]
    },
    {
      id: 3,
      title: 'Past Simple Passive',
      type: 'theory',
      content: [
        { type: 'text', value: 'Past Simple Passive: was/were + V3\n\nИспользуется в отчётах об инцидентах, баг-репортах, описании выполненных задач.\n\nПримеры:\nThe bug was found by QA. (Баг был найден QA.)\nThe server was restarted at 3 AM. (Сервер был перезапущен в 3 утра.)\nThe pull request was reviewed by the senior developer. (Pull request был проверен старшим разработчиком.)\nThe deployment was cancelled due to a failed test. (Деплой был отменён из-за упавшего теста.)\nThe new feature was implemented in 3 days. (Новая функция была реализована за 3 дня.)\nThe database was migrated successfully. (База данных была успешно перемещена.)\nAll services were updated to the latest version. (Все сервисы были обновлены до последней версии.)' },
        { type: 'heading', value: 'By: кем было выполнено' },
        { type: 'text', value: 'Если важно указать исполнителя, используем by:\nThe security vulnerability was discovered by an external auditor. (Уязвимость безопасности была обнаружена внешним аудитором.)\nThe PR was rejected by the tech lead. (PR был отклонён техническим руководителем.)\nThe system was designed by the architecture team. (Система была спроектирована командой архитекторов.)\n\nЕсли исполнитель неизвестен или неважен — by не нужен:\nThe bug was fixed. (Баг был исправлен.)\nThe data was deleted. (Данные были удалены.)' }
      ]
    },
    {
      id: 4,
      title: 'Present Perfect Passive',
      type: 'theory',
      content: [
        { type: 'text', value: 'Present Perfect Passive: has/have been + V3\n\nИспользуется когда действие завершено и его результат важен сейчас.\n\nПримеры:\nThe feature has been implemented. (Функция была реализована — готова к использованию.)\nAll bugs have been fixed. (Все баги исправлены.)\nThe documentation has been updated. (Документация обновлена.)\nThe PR has been approved. (PR одобрен.)\nThe server has been upgraded to the latest version. (Сервер был обновлён до последней версии.)\nThe code has been reviewed. (Код проверен.)\nAll tests have been written and passed. (Все тесты написаны и прошли.)\nThe database schema has been changed. (Схема базы данных была изменена.)' }
      ]
    },
    {
      id: 5,
      title: 'Пассив в IT-документации и баг-репортах',
      type: 'theory',
      content: [
        { type: 'text', value: 'Пассивный залог очень распространён в технической документации.\n\nВ README:\nThe library is installed via npm. (Библиотека устанавливается через npm.)\nThe app is configured using environment variables. (Приложение настраивается с помощью переменных среды.)\nThe API is documented using Swagger. (API задокументировано с использованием Swagger.)\n\nВ баг-репортах:\nBug: Users are not redirected after login.\nExpected: Users should be redirected to the dashboard.\nActual: Users are shown a blank page.\n\nОшибка: Пользователи не перенаправляются после входа.\nОжидаемое поведение: Пользователи должны быть перенаправлены на дашборд.\nФактическое поведение: Пользователям показывается пустая страница.' },
        { type: 'heading', value: 'В commit messages и PR descriptions' },
        { type: 'text', value: 'Add: A new endpoint was added for user preferences.\nFix: The null pointer exception was resolved.\nUpdate: The dependencies were updated to the latest versions.\nRemove: Deprecated code was removed.\nRefactor: The authentication module was refactored.\n\nДобавлено: Новый эндпоинт для пользовательских настроек.\nИсправлено: Исключение null pointer было устранено.\nОбновлено: Зависимости обновлены до последних версий.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Активный в пассивный',
      type: 'practice',
            description: 'Преобразуйте предложения из активного залога в пассивный.',
      solution: 'Правильные ответы:\\n1. Updates are deployed every week.\\n2. The bug was found by QA.\\n3. All the errors have been fixed.\\n4. User data is stored in the database.\\n5. The pull request was rejected by the tech lead.\\n6. The important files were deleted.',
content: [
        { type: 'text', value: 'Преобразуйте предложения из активного залога в пассивный.' },
        {
          type: 'exercise',
          subtype: 'translation',
          items: [
            { id: 1, question: 'The team deploys updates every week. (Команда деплоит обновления каждую неделю.)', answer: 'Updates are deployed every week.' },
            { id: 2, question: 'QA found the bug. (QA нашёл баг.)', answer: 'The bug was found by QA.' },
            { id: 3, question: 'The developer has fixed all the errors. (Разработчик исправил все ошибки.)', answer: 'All the errors have been fixed.' },
            { id: 4, question: 'The system stores user data in the database. (Система хранит данные пользователей в базе данных.)', answer: 'User data is stored in the database.' },
            { id: 5, question: 'The tech lead rejected the pull request. (Техлид отклонил pull request.)', answer: 'The pull request was rejected by the tech lead.' },
            { id: 6, question: 'Someone deleted the important files. (Кто-то удалил важные файлы.)', answer: 'The important files were deleted.' }
          ]
        }
      ]
    },
    {
      id: 7,
      title: 'Практика: Заполнить пропуски',
      type: 'practice',
            description: 'Вставьте правильную форму пассивного залога.',
      solution: 'Правильные ответы:\\n1. are processed\\n2. was cancelled\\n3. has already been updated\\n4. is encrypted / being stored\\n5. are being tested\\n6. are hashed\\n7. has been reported',
content: [
        { type: 'text', value: 'Вставьте правильную форму пассивного залога.' },
        {
          type: 'exercise',
          subtype: 'fill_blank',
          items: [
            { id: 1, question: 'All requests ___ (process) by the API gateway.', answer: 'are processed' },
            { id: 2, question: 'The deployment ___ (cancel) due to a critical error yesterday.', answer: 'was cancelled' },
            { id: 3, question: 'The documentation ___ (already / update). Check the wiki.', answer: 'has already been updated' },
            { id: 4, question: 'Data ___ (encrypt) before ___ (store) in the database.', answer: 'is encrypted / being stored' },
            { id: 5, question: 'The new API endpoints ___ (test) by the QA team right now.', answer: 'are being tested' },
            { id: 6, question: 'All passwords ___ (hash) using SHA-256.', answer: 'are hashed' },
            { id: 7, question: 'The bug ___ (report) three times this month.', answer: 'has been reported' }
          ]
        }
      ]
    }
  ]
}
