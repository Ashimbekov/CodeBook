export default {
  id: 25,
  title: 'Speaking: Tech Interview (Behavioral)',
  description: 'Как отвечать на технические и поведенческие вопросы интервью на английском. STAR-метод, ключевые фразы и практика.',
  lessons: [
    {
      id: 1,
      title: 'Types of interview questions',
      type: 'theory',
      content: [
        { type: 'text', value: 'На технических интервью задают разные типы вопросов. Понимание типа вопроса помогает правильно структурировать ответ.' },
        { type: 'heading', value: 'Question types' },
        { type: 'list', items: [
          'Technical questions — вопросы о технических знаниях ("What is a REST API?")',
          'Behavioral questions — о прошлом опыте ("Tell me about a time when...")',
          'Situational questions — гипотетические ситуации ("What would you do if...")',
          'System design questions — проектирование систем ("Design a URL shortener")',
          'Coding questions — задачи на написание кода на доске или в IDE'
        ]},
        { type: 'heading', value: 'Opening phrases for any question' },
        { type: 'list', items: [
          '"Let me think about this for a moment." — дай мне подумать об этом секунду',
          '"That\'s a great question." — хороший вопрос (не злоупотребляй!)',
          '"Let me make sure I understand the question correctly..." — убедимся, что я правильно понял вопрос',
          '"Could you clarify what you mean by...?" — можете уточнить, что вы имеете в виду под...?',
          '"I\'ve encountered this before. Here\'s how I approach it..." — я сталкивался с этим. Вот мой подход...'
        ]},
        { type: 'tip', value: '"Let me think about this for a moment" — обязательная фраза. Никогда не отвечай сразу на сложный вопрос. Пауза показывает, что ты думаешь, а не паникуешь.' }
      ]
    },
    {
      id: 2,
      title: 'The STAR method for behavioral questions',
      type: 'theory',
      content: [
        { type: 'text', value: 'STAR — стандартный метод ответа на поведенческие вопросы ("Tell me about a time when..."). Структурированный ответ производит сильное впечатление.' },
        { type: 'heading', value: 'STAR structure' },
        { type: 'list', items: [
          'S — Situation (Ситуация): контекст, где и когда это произошло',
          'T — Task (Задача): что было твоей задачей/ответственностью',
          'A — Action (Действие): конкретные шаги, которые ты предпринял',
          'R — Result (Результат): измеримый итог'
        ]},
        { type: 'heading', value: 'STAR phrases' },
        { type: 'list', items: [
          'S: "In my previous role at [company], we were facing..." / "During the X project..."',
          'T: "My responsibility was to..." / "I was tasked with..."',
          'A: "I decided to..." / "My approach was to..." / "First, I... Then, I..."',
          'R: "As a result, we..." / "This led to..." / "The outcome was..."'
        ]},
        { type: 'code', language: 'text', value: 'Example STAR answer:\n\nQuestion: "Tell me about a time when you had to deal with a production incident."\n\nS: "In my previous role, our main API went down on a Friday evening\n   during peak traffic."\n\nT: "As the on-call engineer, I was responsible for diagnosing\n   and resolving the issue within our 1-hour SLA."\n\nA: "First, I checked the monitoring dashboards and identified\n   a memory spike. Then I rolled back the most recent deployment.\n   After that, I documented the incident for post-mortem."\n\nR: "The service was restored in 45 minutes, within our SLA.\n   The root cause was a memory leak in the new feature,\n   which we then fixed and re-deployed successfully."' },
        { type: 'note', value: 'Result должен быть измеримым: "45 minutes", "30% faster", "zero downtime". Конкретные числа делают ответ убедительным.' }
      ]
    },
    {
      id: 3,
      title: 'Thinking out loud: "My approach would be..."',
      type: 'theory',
      content: [
        { type: 'text', value: 'На техническом интервью важно думать вслух — интервьюер хочет понять твой мыслительный процесс, не только конечный ответ.' },
        { type: 'heading', value: 'Thinking phrases' },
        { type: 'list', items: [
          '"My approach would be to first understand the constraints..." — мой подход — сначала понять ограничения',
          '"Let me break this down into smaller parts." — давай разобью это на части',
          '"I would start by..." — я бы начал с...',
          '"One way to solve this is..." — один способ решить это...',
          '"The trade-off here is..." — компромисс здесь заключается в...',
          '"If I assume that..., then..." — если предположить, что..., то...',
          '"A brute force solution would be..., but we can optimize it by..." — простое решение было бы..., но можно оптимизировать через...'
        ]},
        { type: 'heading', value: 'Checking understanding' },
        { type: 'list', items: [
          '"Before I start, let me clarify: are we optimizing for time or space?" — уточню: мы оптимизируем по времени или по памяти?',
          '"Should I consider edge cases like empty input?" — стоит ли рассмотреть крайние случаи?',
          '"What\'s the expected scale? How many users?" — какой ожидаемый масштаб?',
          '"Is this a single-threaded or multi-threaded context?" — однопоточный или многопоточный контекст?'
        ]},
        { type: 'tip', value: 'Никогда не молчи во время обдумывания. Интервьюер хочет слышать твой мыслительный процесс. Говори что-то вроде "Hmm, I\'m thinking about whether to use recursion or iteration here..."' }
      ]
    },
    {
      id: 4,
      title: 'Common behavioral questions and answers',
      type: 'theory',
      content: [
        { type: 'text', value: 'Вот наиболее распространённые поведенческие вопросы на IT-интервью и стратегии ответа.' },
        { type: 'heading', value: '"Tell me about yourself"' },
        { type: 'text', value: 'Структура: краткая хронология карьеры + ключевые достижения + почему ты здесь.\n"I\'m a backend developer with 3 years of experience. I started at X, where I worked on payment systems. Then I moved to Y, where I led the migration to microservices. I\'m particularly interested in this role because..."' },
        { type: 'heading', value: '"Tell me about a challenge you overcame"' },
        { type: 'text', value: 'Используй STAR. Выбери реальный пример, где ты решил проблему проактивно.\nНачало: "One significant challenge I faced was..."' },
        { type: 'heading', value: '"Tell me about a time you disagreed with your team"' },
        { type: 'text', value: 'Покажи, что ты умеешь цивилизованно спорить и принимать решения команды.\n"I disagreed with the approach, so I presented my concerns with data. Ultimately, the team went with the original plan, and I supported the decision while noting my reservations in the docs."' },
        { type: 'heading', value: '"Where do you see yourself in 5 years?"' },
        { type: 'text', value: 'Покажи амбиции, которые соответствуют росту в этой компании.\n"I\'d like to grow into a senior/lead role where I can mentor junior developers and contribute to architectural decisions."' },
        { type: 'note', value: 'Подготовь 5-7 историй из опыта, которые можно адаптировать для разных вопросов. Хорошая история про сложный баг может работать для вопросов про challenge, problem-solving и teamwork.' }
      ]
    },
    {
      id: 5,
      title: 'Talking about trade-offs',
      type: 'theory',
      content: [
        { type: 'text', value: 'Умение обсуждать trade-offs (компромиссы) — признак опытного разработчика. Интервьюеры специально спрашивают об этом.' },
        { type: 'heading', value: 'Trade-off phrases' },
        { type: 'list', items: [
          '"The trade-off is between X and Y." — компромисс между X и Y',
          '"If we choose X, we gain... but lose..." — если выбрать X, мы выиграем... но потеряем...',
          '"It depends on the use case." — зависит от сценария использования',
          '"For this specific case, I would choose X because..." — для этого конкретного случая выбрал бы X, потому что...',
          '"The advantage of X is..., however the disadvantage is..." — преимущество X в том..., однако недостаток...',
          '"In the short term... but in the long term..." — в краткосрочной перспективе... но долгосрочно...'
        ]},
        { type: 'heading', value: 'Common IT trade-offs to discuss' },
        { type: 'list', items: [
          'Performance vs Readability — производительность vs читаемость',
          'Consistency vs Availability (CAP theorem) — согласованность vs доступность',
          'SQL vs NoSQL — реляционные vs нереляционные базы',
          'Microservices vs Monolith — микросервисы vs монолит',
          'Build vs Buy — разработать самим vs купить готовое'
        ]},
        { type: 'tip', value: 'На вопрос "Что лучше — X или Y?" всегда начинай с "It depends on...". Это показывает зрелость мышления. Затем объясняй когда X лучше, а когда Y.' }
      ]
    },
    {
      id: 6,
      title: 'Questions to ask the interviewer',
      type: 'theory',
      content: [
        { type: 'text', value: 'В конце интервью обычно спрашивают: "Do you have any questions for us?" Иметь хорошие вопросы обязательно — это показывает заинтересованность.' },
        { type: 'heading', value: 'Good questions to ask' },
        { type: 'list', items: [
          '"What does a typical day look like for a developer on this team?" — как выглядит типичный день для разработчика в этой команде?',
          '"What are the biggest technical challenges the team is currently facing?" — какие главные технические вызовы?',
          '"How is code quality maintained on the team?" — как поддерживается качество кода?',
          '"What does the onboarding process look like?" — как выглядит онбординг?',
          '"How does the team handle technical debt?" — как команда работает с техдолгом?',
          '"What tech stack does the team use and are there plans to change it?" — какой стек и планируется ли его менять?'
        ]},
        { type: 'warning', value: 'Не задавай вопросы о зарплате и отпуске в первом интервью — это воспринимается негативно. Спрашивай про техническую работу и команду.' }
      ]
    },
    {
      id: 7,
      title: 'Practice: Mock interview questions',
      type: 'practice',
      difficulty: 'hard',
      description: 'Ответь на следующие вопросы устно или письменно, используя STAR-метод и фразы из урока.',
      solution: 'Структура правильного STAR-ответа:\nS (Situation) — опиши контекст конкретно.\nT (Task) — твоя роль и задача.\nA (Action) — конкретные шаги, которые ты предпринял.\nR (Result) — измеримый результат.\n\nКлючевые фразы: "I was tasked with...", "My approach was to...", "As a result, we achieved...", "The key lesson I learned was...".\n\nОценочные критерии: конкретность, измеримые результаты, профессиональные IT-термины.',
      tasks: [
        {
          question: '"Tell me about a time when you had to learn a new technology quickly."',
          structure: 'S: Какой проект, какая технология\nT: Сколько времени было, почему было важно\nA: Как ты учился (документация, курсы, практика)\nR: Результат — что ты смог сделать',
          tips: 'Используй: "I was tasked with...", "My approach was to...", "As a result..."'
        },
        {
          question: '"Describe a situation where you had a conflict with a colleague."',
          structure: 'S: Ситуация и разногласие\nT: Что было поставлено на кону\nA: Как ты подошёл к разрешению\nR: Чем закончилось',
          tips: 'Избегай негатива о конкретных людях. Фокусируйся на решении.'
        },
        {
          question: '"Tell me about your most complex technical project."',
          structure: 'S: Проект и его масштаб\nT: Твоя роль и задача\nA: Технические решения, которые ты принял\nR: Результаты и выводы',
          tips: 'Используй конкретные технологии и цифры. "We handled 1M requests/day".'
        }
      ]
    },
    {
      id: 8,
      title: 'Practice: Fill in interview phrases',
      type: 'practice',
      difficulty: 'medium',
      description: 'Заполни пропуски подходящими фразами из урока.',
      solution: 'Правильные ответы:\n1. Пропуск 1: "Let me think about this"\n   Пропуск 2: "The trade-off is"\n   Пропуск 3: "It depends on whether you prioritize"\n\n2. Пропуск 1: "Let me clarify"\n   Пропуск 2: "My approach would be to start"\n   Пропуск 3: "Then we could"',
      tasks: [
        {
          context: 'Интервьюер спрашивает: "What is the difference between SQL and NoSQL databases?"',
          incomplete: '_____ for a moment. Both SQL and NoSQL have their use cases. _____ — SQL excels at structured data with complex relationships, while NoSQL is better for unstructured data and horizontal scaling. _____ performance and flexibility, or consistency and ACID compliance.',
          answers: ['Let me think about this', 'The trade-off is', 'It depends on whether you prioritize']
        },
        {
          context: 'Тебя просят решить задачу на алгоритм.',
          incomplete: '_____ the constraints first. Are there any memory limitations? _____ with a brute force solution — O(n²). _____ optimize it to O(n log n) using a sorted data structure.',
          answers: ['Let me clarify', 'My approach would be to start', 'Then we could']
        }
      ]
    }
  ]
}
