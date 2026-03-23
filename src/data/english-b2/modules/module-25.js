export default {
  id: 25,
  title: 'Разговорные: менторинг и обучение',
  description: 'Как эффективно менторить и обучать коллег на английском языке',
  lessons: [
    {
      id: 1,
      title: 'Роль ментора: язык поддержки и направления',
      type: 'theory',
      content: [
        { type: 'text', value: 'Менторинг — ключевая часть роли senior-инженера. Умение объяснять, давать обратную связь и направлять — навык, который нужно развивать отдельно от технических знаний.' },
        { type: 'heading', value: 'Вводные фразы для сессий менторинга' },
        { type: 'text', value: '"What would you like to focus on today?"\n"How has the week been? Any blockers you\'d like to work through?"\n"Last time we discussed X — how has that been going?"\n"What\'s the thing you\'re most uncertain about right now?"' },
        { type: 'heading', value: 'Направляющие вопросы (Socratic method)' },
        { type: 'text', value: '"Instead of giving the answer, what do you think the first step should be?"\n"What have you already tried?"\n"What would happen if we approached it from a different angle?"\n"What information would you need to answer that question?"\n"How might you test that hypothesis?"' },
        { type: 'tip', value: 'Лучший ментор не даёт ответы — он задаёт правильные вопросы. Это метод Сократа: направлять к открытию, а не передавать знание. "Don\'t give them fish — teach them to fish."' }
      ]
    },
    {
      id: 2,
      title: 'Объяснение технических концепций',
      type: 'theory',
      content: [
        { type: 'text', value: 'Хорошее объяснение — это искусство: нужно учитывать уровень знаний слушателя и выбрать правильный способ объяснения.' },
        { type: 'heading', value: 'Проверка уровня понимания' },
        { type: 'text', value: '"How familiar are you with X? Have you worked with it before?"\n"What\'s your current understanding of how Y works?"\n"Stop me if this is too basic or if I\'m going too fast."' },
        { type: 'heading', value: 'Структура объяснения' },
        { type: 'text', value: '"Let me start with the big picture, then we\'ll zoom in."\n"The intuition behind this is..."\n"Think of it like [analogy]."\n"The key insight here is..."\n"This might seem counterintuitive, but..."' },
        { type: 'heading', value: 'Проверка понимания' },
        { type: 'text', value: '"Does that make sense so far?"\n"Could you explain it back to me in your own words?"\n"What questions do you have?"\n"How confident are you feeling about this on a scale of 1 to 5?"' },
        { type: 'tip', value: 'Аналогии — мощнейший инструмент объяснения. CAP theorem → выбор между надёжностью и скоростью службы доставки. Eventual consistency → социальные сети: не все видят пост одновременно. Найдите аналогии для своих любимых концепций.' }
      ]
    },
    {
      id: 3,
      title: 'Конструктивная обратная связь',
      type: 'theory',
      content: [
        { type: 'text', value: 'Обратная связь — самая деликатная часть менторинга. Плохо данная обратная связь демотивирует, хорошо данная — ускоряет рост.' },
        { type: 'heading', value: 'SBI модель обратной связи' },
        { type: 'text', value: '"SBI: Situation, Behaviour, Impact.\nSituation: \'In yesterday\'s code review...\'\nBehaviour: \'...you approved the PR without checking for SQL injection vulnerabilities...\'\nImpact: \'...which could have introduced a critical security flaw into production.\'"' },
        { type: 'heading', value: 'Позитивная обратная связь' },
        { type: 'text', value: '"I really appreciated the way you explained the race condition in today\'s PR review. That was very clear."\n"The refactoring you did on the authentication module was excellent — it\'s significantly more maintainable now."\n"I noticed you proactively reached out to the client team before starting — that\'s exactly the kind of initiative we need."' },
        { type: 'heading', value: 'Конструктивная критика' },
        { type: 'text', value: '"I\'d encourage you to add more unit tests before submitting a PR — it makes review faster and catches issues earlier."\n"One area to work on: when estimating tasks, consider edge cases. Last sprint, the authentication feature took twice as long as estimated because of unexpected complexity."\n"Something to think about: how would you approach this differently if you had to design it to scale to 10x the current load?"' }
      ]
    },
    {
      id: 4,
      title: 'Написание review и growth plans',
      type: 'theory',
      content: [
        { type: 'text', value: 'Документированные планы роста и performance reviews — часть формального менторинга.' },
        { type: 'heading', value: 'Структура performance review' },
        { type: 'text', value: '"Achievements this period: [list with specifics]\nAreas of strength: [2-3 strengths with examples]\nAreas for development: [2-3 areas with concrete suggestions]\nGoals for next period: [SMART goals]\nOverall assessment: meeting/exceeding/below expectations"' },
        { type: 'heading', value: 'SMART goals for engineers' },
        { type: 'text', value: '"Specific: \'Complete the Kubernetes certification by end of Q3\' not \'Learn more about containers\'"\n"Measurable: \'Reduce the average PR cycle time from 3 days to 1 day\'"\n"Achievable: realistic given current workload"\n"Relevant: aligned with team and company goals"\n"Time-bound: specific deadline"' },
        { type: 'tip', value: 'Лучший growth plan — написанный совместно с менти, а не для него. "What do YOU want to achieve in the next 6 months?" сильнее, чем "Here\'s what I think you should work on."' }
      ]
    },
    {
      id: 5,
      title: 'Групповое обучение: tech talks и workshops',
      type: 'theory',
      content: [
        { type: 'text', value: 'Обучение группы — масштабируемый способ передачи знаний в команде.' },
        { type: 'heading', value: 'Запуск внутренних Tech Talks' },
        { type: 'text', value: '"I\'d like to share what I learned at the conference — would it be useful to do a lunch-and-learn?"\n"I\'m proposing a weekly \'learning hour\' where engineers share recent learnings."\n"Who would be interested in a deep-dive session on distributed systems patterns?"' },
        { type: 'heading', value: 'Ведение workshop' },
        { type: 'text', value: '"Let\'s start with a brief overview, then move to hands-on exercises."\n"Pair up with the person next to you for this exercise."\n"I\'ll give you 10 minutes to work on this, then we\'ll discuss as a group."\n"What did you discover? Any surprises?"' },
        { type: 'heading', value: 'Создание психологически безопасной среды' },
        { type: 'text', value: '"There are no stupid questions in this session — everything is fair game."\n"This is a safe space to make mistakes — that\'s how we learn."\n"I want to hear everyone\'s perspective, not just the senior engineers."' }
      ]
    },
    {
      id: 6,
      title: 'Практика: менторинговая сессия',
      type: 'practice',
      difficulty: 'hard',
      description: 'Проведите mock менторинговую сессию с junior-разработчиком.',
      requirements: [
        'Используйте направляющие вопросы вместо прямых ответов',
        'Дайте конструктивную обратную связь по SBI модели',
        'Составьте один SMART-goal для менти'
      ],
      hint: 'Сценарий: Junior developer написал код без тестов. Он объясняет: "I didn\'t have time." Ваша задача — помочь ему понять важность тестов, не приказывая.',
      solution: 'MENTOR: "Thanks for walking me through your week. I noticed the PR you submitted didn\'t include unit tests. Can you tell me more about that decision?"\n\nJUNIOR: "I didn\'t have time — the deadline was tight."\n\nMENTOR: "I hear you on the time pressure. Let\'s think about this together. What do you think would happen if a bug were introduced in this module and it made it to production?"\n\nJUNIOR: "It would cause issues for users."\n\nMENTOR: "Right. And how long do you think it would take to find and fix it without tests to narrow down the cause?"\n\nJUNIOR: "Probably much longer than writing the tests would have taken..."\n\nMENTOR: "Exactly. I want to give you some feedback using a specific example. In Tuesday\'s PR — that\'s the situation — you merged code without test coverage — that\'s the behaviour — and it means the next developer to touch this code won\'t have a safety net, which increases the risk of regressions. Does that make sense?"\n\nJUNIOR: "Yes, I see it now."\n\nMENTOR: "Great. Here\'s a goal I\'d like us to agree on: by end of next sprint, you\'ll write at least one unit test and one integration test for every new feature you implement. We\'ll review them together in our next 1:1. Does that feel achievable?"',
      explanation: 'Эффективный ментор направляет, не указывает. Сократовские вопросы помогают менти прийти к выводу самостоятельно — это обучение значительно эффективнее, чем прямые инструкции.'
    },
    {
      id: 7,
      title: 'Практика: написание performance review',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напишите performance review для описанного инженера.',
      requirements: [
        'Структура: Achievements, Strengths, Areas for Development, Goals',
        'Минимум 2 конкретных примера с деталями',
        'Один SMART-goal для следующего периода',
        'Тон: поддерживающий и конструктивный'
      ],
      hint: 'Данные о сотруднике: 2 года в компании, Junior → Mid Engineer, умеет писать код, но плохо коммуницирует с non-technical stakeholders, иногда пропускает дедлайны без уведомления.',
      solution: 'PERFORMANCE REVIEW — Q2 2025\nEngineer: [Name] | Level: Mid Software Engineer\n\nACHIEVEMENTS\n- Successfully delivered the payment webhook integration ahead of schedule, enabling the new partnership launch\n- Mentored two junior engineers on the team\'s testing practices, resulting in improved test coverage from 45% to 72%\n- Resolved three critical production incidents independently, demonstrating strong debugging skills\n\nSTRENGTHS\n- Technical execution: Code quality and problem-solving skills are consistently strong. The refactoring of the order processing module was particularly well executed.\n- Initiative: Proactively identified and resolved a performance bottleneck that was not on the backlog, saving approximately 40 hours of engineering time.\n\nAREAS FOR DEVELOPMENT\n- Stakeholder communication: In Q2, two deliverables were delayed without proactive communication. It is important to raise blockers early — at least 48 hours before a deadline — so that stakeholders can adjust expectations and the team can help resolve blockers.\n- Estimation accuracy: Task estimates tend to underestimate by 30-50%. This is a common challenge, but building in buffer for edge cases and review cycles will improve reliability.\n\nGOAL FOR Q3\nBy end of Q3, provide a written status update (even just 2 sentences) in the team channel every Friday if any assigned tickets are at risk of missing their deadline. This will be reviewed in our weekly 1:1s.\n\nOVERALL: Meeting expectations with potential for promotion to Senior in Q4 pending improvement in communication and estimation.',
      explanation: 'Performance review — мощный инструмент карьерного развития при правильном использовании. Конкретные примеры, честная оценка сильных сторон и чёткие actionable goals делают его эффективным.'
    }
  ]
}
