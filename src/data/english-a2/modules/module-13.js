export default {
  id: 13,
  title: 'Question Types',
  description: 'Все типы вопросов в английском: Yes/No, Wh-, Tag, Indirect — для интервью и митингов.',
  lessons: [
    {
      id: 1,
      title: 'Yes/No вопросы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Yes/No вопросы — ответ "да" или "нет"\n\nДля Present Simple: Do/Does + подлежащее + глагол?\nDo you use Docker? (Ты используешь Docker?)\nDoes the app support iOS? (Приложение поддерживает iOS?)\nDoes she know TypeScript? (Она знает TypeScript?)\n\nДля Past Simple: Did + подлежащее + глагол?\nDid you fix the bug? (Ты исправил баг?)\nDid the deployment succeed? (Деплой прошёл успешно?)\n\nДля Present Perfect: Have/Has + подлежащее + V3?\nHave you deployed yet? (Ты уже задеплоил?)\nHas the build finished? (Билд завершился?)\n\nДля Future will: Will + подлежащее + глагол?\nWill this work in production? (Это будет работать в продакшне?)\n\nДля глагола to be: Am/Is/Are/Was/Were + подлежащее?\nIs the server down? (Сервер упал?)\nWas the deployment successful? (Деплой прошёл успешно?)' }
      ]
    },
    {
      id: 2,
      title: 'Wh- вопросы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Вопросительные слова:\nWhat (что, какой)\nWho (кто)\nWhere (где, куда)\nWhen (когда)\nWhy (почему)\nHow (как)\nWhich (который, какой из)\nHow many (сколько — исчисляемые)\nHow much (сколько — неисчисляемые)\nHow long (как долго)\nHow often (как часто)' },
        { type: 'heading', value: 'IT-примеры' },
        { type: 'text', value: 'What does this function do? (Что делает эта функция?)\nWhat caused the error? (Что вызвало ошибку?)\nWhat is the response time? (Каково время ответа?)\n\nWho wrote this code? (Кто написал этот код?)\nWho is responsible for deployment? (Кто отвечает за деплой?)\n\nWhere is the bug? (Где баг?)\nWhere do you store the logs? (Где вы храните логи?)\n\nWhen did the server crash? (Когда упал сервер?)\nWhen will the feature be ready? (Когда функция будет готова?)\n\nWhy is the build failing? (Почему билд падает?)\nWhy do we use this framework? (Почему мы используем этот фреймворк?)\n\nHow does this algorithm work? (Как работает этот алгоритм?)\nHow many requests per second can it handle? (Сколько запросов в секунду он может обрабатывать?)\nHow long does the deployment take? (Сколько времени занимает деплой?)' }
      ]
    },
    {
      id: 3,
      title: 'Tag Questions: разделительные вопросы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Tag Questions (разделительные вопросы) — добавляются в конце утвердительного предложения для подтверждения.\n\nПравило:\n- Утвердительное предложение + отрицательный тег\n- Отрицательное предложение + утвердительный тег\n\nСтруктура тега: вспомогательный глагол + местоимение\n\nПримеры:\nYou can fix this, can\'t you? (Ты можешь это исправить, не так ли?)\nThe tests passed, didn\'t they? (Тесты прошли, не так ли?)\nShe hasn\'t deployed yet, has she? (Она ещё не задеплоила, не так ли?)\nThe server is down, isn\'t it? (Сервер упал, не так ли?)\nYou haven\'t read the docs, have you? (Ты не читал документацию, не так ли?)\nThis API is deprecated, isn\'t it? (Этот API устарел, не так ли?)' }
      ]
    },
    {
      id: 4,
      title: 'Indirect Questions: вежливые вопросы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Indirect (косвенные) вопросы — более вежливые, формальные\n\nВведение:\nCould you tell me... (Не могли бы вы сказать мне...)\nDo you know... (Знаете ли вы...)\nI was wondering... (Мне интересно...)\nCan you explain... (Можете ли вы объяснить...)\nI\'d like to know... (Я хотел бы знать...)\n\nВажно: в косвенном вопросе ПРЯМОЙ порядок слов (не вопросительный!)' },
        { type: 'heading', value: 'Прямые vs косвенные вопросы' },
        { type: 'text', value: 'Прямой: What does this API endpoint do?\nКосвенный: Could you tell me what this API endpoint does?\n\nПрямой: Why did the build fail?\nКосвенный: Do you know why the build failed?\n\nПрямой: How long will the migration take?\nКосвенный: I was wondering how long the migration would take.\n\nПрямой: Where are the error logs?\nКосвенный: Can you tell me where the error logs are?\n\nПрямой: Is the server running?\nКосвенный: Do you know if the server is running?\n\nПрямой: Has the PR been reviewed?\nКосвенный: I\'d like to know whether the PR has been reviewed.' }
      ]
    },
    {
      id: 5,
      title: 'Вопросы на интервью и митингах',
      type: 'theory',
      content: [
        { type: 'text', value: 'Технические интервью:\nCan you explain how you would design this system? (Можете объяснить, как бы вы спроектировали эту систему?)\nWhat is the difference between SQL and NoSQL? (В чём разница между SQL и NoSQL?)\nHow does a REST API work? (Как работает REST API?)\nHave you ever worked with microservices? (Вы когда-нибудь работали с микросервисами?)\nWhat would you do if the production server went down? (Что бы вы сделали, если бы продакшн сервер упал?)\n\nНа митингах:\nWhat is the status of this task? (Каков статус этой задачи?)\nWhen do you think you\'ll finish? (Когда, как вы думаете, вы закончите?)\nAre there any blockers? (Есть ли какие-нибудь блокеры?)\nDo you need any help? (Вам нужна какая-нибудь помощь?)\nShould we schedule a separate meeting for this? (Нам следует запланировать отдельный митинг для этого?)' },
        { type: 'heading', value: 'Диалог: техническое интервью' },
        { type: 'text', value: 'Interviewer: Can you tell me about your experience with cloud services?\nCandidate: I\'ve worked with AWS for about 2 years. Mainly EC2 and S3.\nInterviewer: Have you ever deployed a containerized application?\nCandidate: Yes, I have. I use Docker and Kubernetes regularly.\nInterviewer: How do you handle database migrations in production?\nCandidate: I always take a backup first. Then I run migrations during low-traffic periods. If something goes wrong, I roll back immediately.\nInterviewer: What would you do if you found a critical bug in production?\nCandidate: First, I\'d assess the impact. Then I\'d either hotfix or rollback depending on severity.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Формирование вопросов',
      type: 'practice',
      content: [
        { type: 'text', value: 'Составьте вопрос по данному ответу.' },
        {
          type: 'exercise',
          subtype: 'translation',
          items: [
            { id: 1, question: 'Ответ: "The build failed because of a syntax error." — Задай вопрос Why.', answer: 'Why did the build fail?' },
            { id: 2, question: 'Ответ: "She deployed the app last Friday." — Задай вопрос When.', answer: 'When did she deploy the app?' },
            { id: 3, question: 'Ответ: "Yes, I have worked with Docker." — Задай Yes/No вопрос с ever.', answer: 'Have you ever worked with Docker?' },
            { id: 4, question: 'Ответ: "The deployment takes about 20 minutes." — Задай вопрос How long.', answer: 'How long does the deployment take?' },
            { id: 5, question: 'Ответ: "John wrote this module." — Задай вопрос Who.', answer: 'Who wrote this module?' },
            { id: 6, question: 'Сделай косвенный вопрос из: "Why is the server slow?"', answer: 'Could you tell me why the server is slow?' },
            { id: 7, question: 'Добавь разделительный тег: "You tested this feature, ___?"', answer: 'didn\'t you' }
          ]
        }
      ]
    },
    {
      id: 7,
      title: 'Практика: Исправление ошибок',
      type: 'practice',
      content: [
        { type: 'text', value: 'Найдите и исправьте ошибки в вопросах.' },
        {
          type: 'exercise',
          subtype: 'error_correction',
          items: [
            { id: 1, question: 'What means this error code?', answer: 'What does this error code mean?' },
            { id: 2, question: 'Do you know what does the error mean?', answer: 'Do you know what the error means? (косвенный вопрос = прямой порядок слов)' },
            { id: 3, question: 'The tests passed, did they?', answer: 'The tests passed, didn\'t they? (утвердительное предложение = отрицательный тег)' },
            { id: 4, question: 'How many time does the deployment take?', answer: 'How long does the deployment take? / How much time does it take?' },
            { id: 5, question: 'Why the build is failing?', answer: 'Why is the build failing?' }
          ]
        }
      ]
    }
  ]
}
