export default {
  id: 30,
  title: 'Practice: IT Vocabulary',
  description: 'Практикум по IT-лексике: типы данных, ООП, Git, баги, метрики — полный тест.',
  lessons: [
    {
      id: 1,
      title: 'Типы данных — тест',
      type: 'practice',
            description: 'Вставьте правильный термин: integer, string, boolean, array, object, null, float.',
      solution: 'Правильные ответы:\\n1. boolean\\n2. string\\n3. integer\\n4. array\\n5. object\\n6. null\\n7. float\\n8. boolean\\n9. string / integer\\n10. length',
content: [
        { type: 'text', value: 'Вставьте правильный термин: integer, string, boolean, array, object, null, float.' },
        {
          type: 'exercise',
          subtype: 'fill_blank',
          items: [
            { id: 1, question: 'A variable that stores true or false is called a ___.', answer: 'boolean' },
            { id: 2, question: 'The user\'s name is stored as a ___.', answer: 'string' },
            { id: 3, question: 'The count of items in the cart is an ___.', answer: 'integer' },
            { id: 4, question: 'The API returns an ___ of product objects.', answer: 'array' },
            { id: 5, question: 'A ___ stores key-value pairs.', answer: 'object' },
            { id: 6, question: 'If the record is not found, return ___.', answer: 'null' },
            { id: 7, question: 'The price field uses a ___ for decimal values.', answer: 'float' },
            { id: 8, question: 'The is_active field is a ___ type.', answer: 'boolean' },
            { id: 9, question: 'Convert the ___ "42" to an ___ before calculating.', answer: 'string / integer' },
            { id: 10, question: 'The array ___ returns the number of elements.', answer: 'length' }
          ]
        }
      ]
    },
    {
      id: 2,
      title: 'ООП термины — тест',
      type: 'practice',
            description: 'Переведите на английский язык.',
      solution: 'Правильные ответы:\\n1. A class is a blueprint for creating objects.\\n2. This class inherits from the base class.\\n3. The constructor initializes the object\'s properties.\\n4. The class implements the Serializable interface.\\n5. This method overrides the parent class method.\\n6. Use getters and setters for private fields.\\n7. The object is an instance of the User class.',
content: [
        { type: 'text', value: 'Переведите на английский язык.' },
        {
          type: 'exercise',
          subtype: 'translation',
          items: [
            { id: 1, question: 'Класс — это шаблон для создания объектов.', answer: 'A class is a blueprint for creating objects.' },
            { id: 2, question: 'Этот класс наследует от базового класса.', answer: 'This class inherits from the base class.' },
            { id: 3, question: 'Конструктор инициализирует свойства объекта.', answer: 'The constructor initializes the object\'s properties.' },
            { id: 4, question: 'Класс реализует интерфейс Serializable.', answer: 'The class implements the Serializable interface.' },
            { id: 5, question: 'Этот метод переопределяет метод родительского класса.', answer: 'This method overrides the parent class method.' },
            { id: 6, question: 'Используй геттеры и сеттеры для приватных полей.', answer: 'Use getters and setters for private fields.' },
            { id: 7, question: 'Объект является экземпляром класса User.', answer: 'The object is an instance of the User class.' }
          ]
        }
      ]
    },
    {
      id: 3,
      title: 'Git терминология — тест',
      type: 'practice',
            description: 'Вставьте правильный Git-термин.',
      solution: 'Правильные ответы:\\n1. cloned\\n2. branch\\n3. committed\\n4. pushed\\n5. pull request (PR)\\n6. conflict\\n7. merged\\n8. commit\\n9. roll back / revert\\n10. blame',
content: [
        { type: 'text', value: 'Вставьте правильный Git-термин.' },
        {
          type: 'exercise',
          subtype: 'fill_blank',
          items: [
            { id: 1, question: 'I ___ the repository to my local machine.', answer: 'cloned' },
            { id: 2, question: 'Create a new ___ for each feature.', answer: 'branch' },
            { id: 3, question: 'I ___ my changes and wrote a descriptive message.', answer: 'committed' },
            { id: 4, question: 'After committing, I ___ the branch to GitHub.', answer: 'pushed' },
            { id: 5, question: 'I opened a ___ for the team to review.', answer: 'pull request (PR)' },
            { id: 6, question: 'There is a merge ___ — both branches modified the same line.', answer: 'conflict' },
            { id: 7, question: 'The PR was ___ after 2 approvals.', answer: 'merged' },
            { id: 8, question: 'The ___ history shows all changes and who made them.', answer: 'commit' },
            { id: 9, question: 'We need to ___ — the last deployment broke production.', answer: 'roll back / revert' },
            { id: 10, question: 'Use git ___ to find who changed a specific line.', answer: 'blame' }
          ]
        }
      ]
    },
    {
      id: 4,
      title: 'Баги и отладка — тест',
      type: 'practice',
            description: 'Переведите описания ошибок и решений.',
      solution: 'Правильные ответы:\\n1. The stack trace shows a NullPointerException at line 42.\\n2. The app crashes when the user uploads a file.\\n3. Reproduce the bug before fixing it.\\n4. Add a breakpoint and inspect the variables.\\n5. Fix the root cause, not just the symptom.\\n6. The bug was caused by a race condition.\\n7. Add logging to track the execution flow.',
content: [
        { type: 'text', value: 'Переведите описания ошибок и решений.' },
        {
          type: 'exercise',
          subtype: 'translation',
          items: [
            { id: 1, question: 'Трассировка стека показывает NullPointerException в строке 42.', answer: 'The stack trace shows a NullPointerException at line 42.' },
            { id: 2, question: 'Приложение падает когда пользователь загружает файл.', answer: 'The app crashes when the user uploads a file.' },
            { id: 3, question: 'Воспроизведи баг перед его исправлением.', answer: 'Reproduce the bug before fixing it.' },
            { id: 4, question: 'Добавь точку останова и проверь переменные.', answer: 'Add a breakpoint and inspect the variables.' },
            { id: 5, question: 'Исправь первопричину, а не только симптом.', answer: 'Fix the root cause, not just the symptom.' },
            { id: 6, question: 'Баг был вызван состоянием гонки.', answer: 'The bug was caused by a race condition.' },
            { id: 7, question: 'Добавь логирование чтобы отследить поток выполнения.', answer: 'Add logging to track the execution flow.' }
          ]
        }
      ]
    },
    {
      id: 5,
      title: 'Метрики — тест',
      type: 'practice',
            description: 'Переведите на английский язык или вставьте термин.',
      solution: 'Правильные ответы:\\n1. response\\n2. requests\\n3. latency\\n4. uptime\\n5. error\\n6. usage\\n7. alert\\n8. bottleneck',
content: [
        { type: 'text', value: 'Переведите на английский язык или вставьте термин.' },
        {
          type: 'exercise',
          subtype: 'fill_blank',
          items: [
            { id: 1, question: 'The average ___ time is 200 milliseconds.', answer: 'response' },
            { id: 2, question: 'The system handles 2000 ___ per second.', answer: 'requests' },
            { id: 3, question: 'We reduced ___ by 30%.', answer: 'latency' },
            { id: 4, question: 'Our SLA guarantees 99.9% ___.', answer: 'uptime' },
            { id: 5, question: 'The ___ rate is at 2% — we need to investigate.', answer: 'error' },
            { id: 6, question: 'High CPU ___ is causing slow responses.', answer: 'usage' },
            { id: 7, question: 'Set up an ___ for when error rate exceeds 1%.', answer: 'alert' },
            { id: 8, question: 'The ___ is the part of the system that limits performance.', answer: 'bottleneck' }
          ]
        }
      ]
    },
    {
      id: 6,
      title: 'Офисная лексика — тест',
      type: 'practice',
            description: 'Переведите на английский язык.',
      solution: 'Правильные ответы:\\n1. The deadline is next Friday.\\n2. I have a blocker — I\'m waiting for a review from the architect.\\n3. I estimate the task will take 3 days.\\n4. Add this task to the backlog.\\n5. The sprint starts on Monday.\\n6. Let\'s take this offline.\\n7. How many story points is this task?',
content: [
        { type: 'text', value: 'Переведите на английский язык.' },
        {
          type: 'exercise',
          subtype: 'translation',
          items: [
            { id: 1, question: 'Дедлайн — следующая пятница.', answer: 'The deadline is next Friday.' },
            { id: 2, question: 'У меня блокер — жду ревью от архитектора.', answer: 'I have a blocker — I\'m waiting for a review from the architect.' },
            { id: 3, question: 'Я оцениваю задачу в 3 дня.', answer: 'I estimate the task will take 3 days.' },
            { id: 4, question: 'Добавь эту задачу в бэклог.', answer: 'Add this task to the backlog.' },
            { id: 5, question: 'Спринт начинается в понедельник.', answer: 'The sprint starts on Monday.' },
            { id: 6, question: 'Давайте обсудим это отдельно.', answer: 'Let\'s take this offline.' },
            { id: 7, question: 'Сколько story points эта задача?', answer: 'How many story points is this task?' }
          ]
        }
      ]
    },
    {
      id: 7,
      title: 'Описание проблем — тест',
      type: 'practice',
            description: 'Составьте предложения, описывающие проблемы и решения.',
      solution: 'Правильные ответы:\\n1. The service is down due to database issues.\\n2. We can fix this by adding a caching layer.\\n3. The issue appeared after the last update.\\n4. We need to either fix the bug or roll back the deployment.\\n5. We have two options: restart the service or scale the server.',
content: [
        { type: 'text', value: 'Составьте предложения, описывающие проблемы и решения.' },
        {
          type: 'exercise',
          subtype: 'translation',
          items: [
            { id: 1, question: 'Сервис недоступен из-за проблем с базой данных.', answer: 'The service is down due to database issues.' },
            { id: 2, question: 'Мы можем исправить это путём добавления кэшированного слоя.', answer: 'We can fix this by adding a caching layer.' },
            { id: 3, question: 'Проблема появилась после последнего обновления.', answer: 'The issue appeared after the last update.' },
            { id: 4, question: 'Нам нужно либо исправить баг, либо откатить деплой.', answer: 'We need to either fix the bug or roll back the deployment.' },
            { id: 5, question: 'У нас есть два варианта: перезапустить сервис или масштабировать сервер.', answer: 'We have two options: restart the service or scale the server.' }
          ]
        }
      ]
    },
    {
      id: 8,
      title: 'Смешанный IT-словарь — тест',
      type: 'practice',
            description: 'Вставьте правильное слово.',
      solution: 'Правильные ответы:\\n1. primary key\\n2. compiler\\n3. exception / runtime error\\n4. merge\\n5. unit\\n6. Singleton\\n7. interface',
content: [
        { type: 'text', value: 'Вставьте правильное слово.' },
        {
          type: 'exercise',
          subtype: 'fill_blank',
          items: [
            { id: 1, question: 'A ___ is a unique identifier for each row in a database table.', answer: 'primary key' },
            { id: 2, question: 'The ___ converts high-level code to machine code.', answer: 'compiler' },
            { id: 3, question: 'An ___ is an error that occurs while the program is running.', answer: 'exception / runtime error' },
            { id: 4, question: 'The ___ is the process of combining multiple branches into one.', answer: 'merge' },
            { id: 5, question: 'A ___ test checks if individual units of code work correctly.', answer: 'unit' },
            { id: 6, question: 'The ___ pattern ensures a class has only one instance.', answer: 'Singleton' },
            { id: 7, question: 'An ___ defines a contract that classes must implement.', answer: 'interface' }
          ]
        }
      ]
    },
    {
      id: 9,
      title: 'IT-словарь в контексте — перевод',
      type: 'practice',
            description: 'Переведите IT-предложения с русского на английский.',
      solution: 'Правильные ответы:\\n1. Passwords must be hashed before storing.\\n2. The API accepts POST requests and returns JSON.\\n3. Microservices are more scalable than monolithic applications.\\n4. The team is migrating from SVN to Git.\\n5. I refactored the authentication module.',
content: [
        { type: 'text', value: 'Переведите IT-предложения с русского на английский.' },
        {
          type: 'exercise',
          subtype: 'translation',
          items: [
            { id: 1, question: 'Пароли должны быть захэшированы перед сохранением.', answer: 'Passwords must be hashed before storing.' },
            { id: 2, question: 'API принимает POST запросы и возвращает JSON.', answer: 'The API accepts POST requests and returns JSON.' },
            { id: 3, question: 'Микросервисы более масштабируемы, чем монолитные приложения.', answer: 'Microservices are more scalable than monolithic applications.' },
            { id: 4, question: 'Команда мигрирует с SVN на Git.', answer: 'The team is migrating from SVN to Git.' },
            { id: 5, question: 'Я зарефакторил модуль аутентификации.', answer: 'I refactored the authentication module.' }
          ]
        }
      ]
    },
    {
      id: 10,
      title: 'Написание технических описаний',
      type: 'practice',
            description: 'Напишите описания технических концепций на английском.',
      solution: 'Примеры ответов:\\n1. CI/CD stands for Continuous Integration and Continuous Deployment. CI automatically runs tests on every code commit. CD automatically deploys the code to production when all tests pass.\\n2. Merge combines two branches by creating a merge commit. Rebase moves commits to a new base, creating a linear history. Rebase is cleaner but rewrites history, while merge is safer for shared branches.\\n3. feat(auth): add Google OAuth authentication\\n\\nUsers can now log in using their Google account.\\nThis implements Google OAuth 2.0 flow in the auth module.',
content: [
        { type: 'text', value: 'Напишите описания технических концепций на английском.' },
        {
          type: 'exercise',
          subtype: 'writing',
          items: [
            { id: 1, question: 'Объясните, что такое CI/CD (2-3 предложения).', answer: 'CI/CD stands for Continuous Integration and Continuous Deployment. CI automatically runs tests on every code commit. CD automatically deploys the code to production when all tests pass.' },
            { id: 2, question: 'Опишите разницу между merge и rebase в Git (2-3 предложения).', answer: 'Merge combines two branches by creating a merge commit. Rebase moves commits to a new base, creating a linear history. Rebase is cleaner but rewrites history, while merge is safer for shared branches.' },
            { id: 3, question: 'Напишите commit message для: добавил аутентификацию через Google OAuth в модуле auth.', answer: 'feat(auth): add Google OAuth authentication\n\nUsers can now log in using their Google account.\nThis implements Google OAuth 2.0 flow in the auth module.' }
          ]
        }
      ]
    }
  ]
}
