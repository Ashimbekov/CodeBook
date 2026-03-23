export default {
  id: 20,
  title: 'Вопросительные слова (What, Where, When, How)',
  description: 'Вопросительные слова и как задавать вопросы в IT-контексте',
  lessons: [
    {
      id: 1,
      title: 'What — что/какой',
      type: 'theory',
      content: [
        { type: 'text', value: 'What — самое используемое вопросительное слово. Спрашивает о вещах, событиях, информации.' },
        { type: 'code', language: 'text', value: 'What + to be:\nWhat is this?               - Что это?\nWhat is the error?          - Что за ошибка?\nWhat is the status?         - Какой статус?\nWhat is your job title?     - Какая ваша должность?\nWhat is the deadline?       - Какой дедлайн?\n\nWhat + do/does:\nWhat do you do?             - Чем вы занимаетесь?\nWhat does this function do? - Что делает эта функция?\nWhat does it return?        - Что она возвращает?\nWhat do you think?          - Что вы думаете?\n\nWhat + did:\nWhat did you fix?           - Что вы исправили?\nWhat happened?              - Что случилось?' },
        { type: 'tip', value: '"What" — любимое слово IT-документации: "What it does", "What you need", "What to do next". Читая docs, вы постоянно будете видеть заголовки с "what".' }
      ]
    },
    {
      id: 2,
      title: 'Where, When, Who — где, когда, кто',
      type: 'theory',
      content: [
        { type: 'text', value: 'Ещё три важных вопросительных слова для ежедневного IT-общения.' },
        { type: 'code', language: 'text', value: 'WHERE (где? куда?):\nWhere is the bug?           - Где баг?\nWhere is the documentation? - Где документация?\nWhere do you work?          - Где вы работаете?\nWhere can I find the logs?  - Где я могу найти логи?\nWhere should I deploy?      - Куда мне деплоить?\n\nWHEN (когда?):\nWhen is the deadline?       - Когда дедлайн?\nWhen did it break?          - Когда это сломалось?\nWhen can you deliver it?    - Когда вы можете сдать?\nWhen does the meeting start?- Когда начинается встреча?\n\nWHO (кто? кому?):\nWho is responsible?         - Кто ответственный?\nWho wrote this code?        - Кто написал этот код?\nWho can help me?            - Кто может мне помочь?\nWho is on call?             - Кто дежурит?' }
      ]
    },
    {
      id: 3,
      title: 'How — как/сколько',
      type: 'theory',
      content: [
        { type: 'text', value: 'How — спрашивает о способе, количестве, состоянии. С другими словами образует целую систему вопросов.' },
        { type: 'code', language: 'text', value: 'How одиночно:\nHow are you?               - Как дела?\nHow does it work?          - Как это работает?\nHow can I fix this?        - Как мне это исправить?\nHow do I install it?       - Как мне установить это?\n\nHow + прилагательное/наречие:\nHow many? - сколько (исчисляемые):\n  How many bugs are there?   - Сколько багов?\n  How many tests failed?     - Сколько тестов упало?\n\nHow much? - сколько (неисчисляемые):\n  How much time do we have?  - Сколько у нас времени?\n  How much does it cost?     - Сколько это стоит?\n\nHow long? - как долго:\n  How long does the build take? - Как долго длится сборка?\n  How long have you worked here? - Как долго вы тут работаете?' },
        { type: 'code', language: 'text', value: 'Ещё с How:\nHow often?  - Как часто?\n  How often do you deploy? - Как часто вы деплоите?\n\nHow soon?   - Как скоро?\n  How soon can you fix it? - Как скоро вы исправите?\n\nHow far?    - Как далеко?\n  How far are we from launch? - Как далеко мы от запуска?' }
      ]
    },
    {
      id: 4,
      title: 'Why и Which — почему и какой',
      type: 'theory',
      content: [
        { type: 'text', value: 'Why и Which — два важных вопросительных слова для выбора и объяснений.' },
        { type: 'code', language: 'text', value: 'WHY (почему?):\nWhy is it failing?          - Почему это падает?\nWhy did you choose React?   - Почему вы выбрали React?\nWhy is the server slow?     - Почему сервер медленный?\nWhy should we do this?      - Зачем нам это делать?\nWhy don\'t we use TypeScript? - Почему бы нам не использовать TypeScript?\n\nWHICH (который/какой из):\nWhich version do you use?   - Какую версию вы используете?\nWhich approach is better?   - Какой подход лучше?\nWhich branch should I work on? - На какой ветке мне работать?\nWhich database did you choose? - Какую базу данных вы выбрали?' },
        { type: 'note', value: '"Which" используется когда есть ограниченный выбор: "Which of these two options is better?" (Который из этих двух вариантов лучше?). "What" — когда выбор не ограничен: "What language do you prefer?" (Какой язык вы предпочитаете?).' }
      ]
    },
    {
      id: 5,
      title: 'Вопросительные теги (Tag questions)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Вопросительные теги (isn\'t it?, aren\'t you?) — маленькие вопросы в конце предложения, которые просят подтверждения. Часто используются в неформальном общении.' },
        { type: 'code', language: 'text', value: 'Принцип образования:\nУтверждение → отрицательный тег\nОтрицание → положительный тег\n\nThe server is running, isn\'t it? - Сервер работает, правда?\nYou are a developer, aren\'t you? - Ты разработчик, правда?\nShe fixed the bug, didn\'t she? - Она исправила баг, верно?\nThey don\'t deploy on Fridays, do they? - Они не деплоят по пятницам, верно?\nYou can help me, can\'t you? - Ты можешь мне помочь, правда?' },
        { type: 'tip', value: 'В IT-общении теги чаще заменяют на просто "right?": "The server is running, right?" (Сервер работает, верно?). Это проще запомнить.' }
      ]
    },
    {
      id: 6,
      title: 'Вопросы в IT-контексте',
      type: 'theory',
      content: [
        { type: 'text', value: 'Практическое применение вопросительных слов — реальные вопросы из IT-работы.' },
        { type: 'code', language: 'text', value: 'На стендапе:\nWhat did you do yesterday?         - Что вы делали вчера?\nWhat are you working on today?     - Над чем вы работаете сегодня?\nAre there any blockers?            - Есть блокеры?\nWhen will this be ready?           - Когда это будет готово?\n\nНа code review:\nWhat does this function do?        - Что делает эта функция?\nWhy did you choose this approach?  - Почему выбрали этот подход?\nWhere is this variable used?       - Где используется эта переменная?\nHow does this affect performance?  - Как это влияет на производительность?' },
        { type: 'code', language: 'text', value: 'Про инциденты (postmortem):\nWhat happened?                     - Что случилось?\nWhen did it start?                 - Когда это началось?\nWho was on call?                   - Кто дежурил?\nHow long did it last?              - Как долго это продолжалось?\nWhy did the server crash?          - Почему упал сервер?\nWhat is the root cause?            - Что является первопричиной?\nHow can we prevent it?             - Как мы можем предотвратить это?' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Вопросительные слова',
      type: 'practice',
      content: [
        {
          type: 'task',
          taskType: 'fill_blank',
          question: 'Заполните пропуск: "___ does this API return?" (Что возвращает этот API?)',
          solution: 'What',
          explanation: 'What = что. "What does this API return?" — Что возвращает этот API?'
        },
        {
          type: 'task',
          taskType: 'translate',
          question: 'Переведите: "Сколько тестов упало?"',
          solution: 'How many tests failed?',
          explanation: 'How many = сколько (для исчисляемых). tests = исчисляемое. failed = прошедшее от fail.'
        },
        {
          type: 'task',
          taskType: 'translate',
          question: 'Переведите: "Почему сервер медленный?"',
          solution: 'Why is the server slow?',
          explanation: 'Why + is (to be) + subject + adjective. slow — краткое прилагательное.'
        },
        {
          type: 'task',
          taskType: 'multiple_choice',
          question: 'Выберите правильный вопрос: "__ should I push my changes?" (Куда?)',
          options: ['Where', 'When', 'What', 'Who'],
          correct: 0,
          explanation: '"Where should I push my changes?" — Куда мне запушить изменения? Where = где/куда.'
        }
      ]
    }
  ]
}
