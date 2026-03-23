export default {
  id: 31,
  title: 'Практикум: Фразовые глаголы B2',
  description: 'Интенсивная практика фразовых глаголов в IT и бизнес-контексте',
  lessons: [
    {
      id: 1,
      title: 'Практика: phase in/out, ramp up/down',
      type: 'practice',
      difficulty: 'medium',
      description: 'Фразовые глаголы для управления изменениями.',
      requirements: ['Заполните пропуски', 'Напишите примеры из своей работы'],
      questions: [
        { text: 'Fill in the blanks with: phase out, phase in, ramp up, ramp down:\n1. We are ___ the legacy REST API over the next two quarters.\n2. As the new system proves stable, we will gradually ___ the new GraphQL endpoint.\n3. Traffic is ___ ahead of the product launch — we need to scale now.\n4. After the sale event ends, we can ___ the additional servers to reduce costs.', answer: '1. phasing out (gradually removing)\n2. phase in (gradually introducing)\n3. ramping up (increasing fast)\n4. ramp down (reduce after peak)', explanation: 'Phase out = gradually remove; phase in = gradually introduce; ramp up = increase speed/capacity; ramp down = reduce after peak.' }
      ],
      solution: 'Правильные ответы:\n1. 1. phasing out (gradually removing)',
      hint: 'Phase = постепенность внедрения/выведения; ramp = нарастание/убывание интенсивности.',
      explanation: 'These verbs describe gradual transitions, essential vocabulary for managing technology migrations and scaling events.'
    },
    {
      id: 2,
      title: 'Практика: spin up/off, break down/up',
      type: 'practice',
      difficulty: 'medium',
      description: 'Фразовые глаголы для создания и декомпозиции.',
      requirements: ['Используйте фразовые глаголы в предложениях', 'Объясните нюансы каждого'],
      questions: [
        { text: 'Use these phrasal verbs correctly:\n1. "Start a new EC2 instance" → spin ___\n2. "Create a separate company from a division" → spin ___\n3. "Divide the large Epic into smaller tickets" → break ___\n4. "Separate the monolith into microservices" → break ___', answer: '1. spin up: "Let me spin up a new EC2 instance to handle the extra load."\n2. spin off: "The internal tools team was spun off into a separate company last year."\n3. break down: "Let\'s break down this Epic into smaller, more manageable tickets."\n4. break up: "We\'re planning to break up the monolith into five microservices over the next year."', explanation: 'Spin up = launch/start (technical); spin off = create a separate entity; break down = decompose into parts; break up = divide into separate units.' }
      ],
      solution: 'Правильные ответы:\n1. 1. spin up: "Let me spin up a new EC2 instance to handle the extra load."',
      hint: 'Spin up/down = запуск/остановка ресурсов; spin off = отделение в отдельную единицу; break down = анализировать/декомпозировать; break up = разделять на части.',
      explanation: 'These phrasal verbs are used daily in technical planning discussions and infrastructure management.'
    },
    {
      id: 3,
      title: 'Практика: drill down, circle back, touch base',
      type: 'practice',
      difficulty: 'medium',
      description: 'Фразовые глаголы для общения и работы с информацией.',
      requirements: ['Напишите диалог стендапа', 'Используйте все три глагола'],
      questions: [
        { text: 'Write a natural standup exchange that includes: drill down, circle back, touch base (at least once each):', answer: 'Dev A: "I spent yesterday drilling down into the performance metrics for the search API — found a pretty interesting pattern in the P99 latency.\nDev B: "Nice. What did you find?"\nDev A: "Looks like it spikes every time the cache is cold. I\'ll circle back to this after the team meeting — I want to gather a bit more data first.\nDev B: "Makes sense. Want to touch base at 3 PM? I might have some relevant context from the infrastructure side.\nDev A: "Perfect, let\'s do that."', explanation: 'Drill down = dive deep into details; circle back = return to later; touch base = briefly reconnect to share information.' }
      ],
      solution: 'Правильные ответы:\n1. Dev A: "I spent yesterday drilling down into the performance metrics for the search API — found a pretty interesting pattern in the P99 latency.',
      hint: 'Drill down into = углубляться в детали; circle back to = вернуться к теме; touch base with = быстро пообщаться.',
      explanation: 'These three phrasal verbs are among the most common in team meetings and standup calls. Using them naturally signals fluency in business English.'
    },
    {
      id: 4,
      title: 'Практика: roll out, roll back, cut',
      type: 'practice',
      difficulty: 'medium',
      description: 'Фразовые глаголы для управления деплоями.',
      requirements: ['Расположите в правильном порядке события деплоя'],
      questions: [
        { text: 'Arrange these events in the correct order and complete the deployment story using phrasal verbs (roll out, roll back, cut, push out):\n\nEvents (in order):\na) Deploy to 5% of users\nb) Error rate spikes — undo deployment\nc) Create the release version\nd) Extend to 100% of users\ne) Delay the release due to last-minute bug', answer: 'c) "We cut the release candidate from the main branch after all tests passed."\ne) "However, the QA team found a critical bug, so the release was pushed out by 24 hours."\na) "Once the fix was in, we rolled out to 5% of users as a canary deployment."\nd) "Metrics looked good, so we rolled out to 100%."\nb) [Alternative ending] "Unfortunately, error rates spiked — we immediately rolled back to the previous version."', explanation: 'Cut a release = создать версию для выпуска; push out = отложить; roll out = внедрять постепенно; roll back = откатить.' }
      ],
      solution: 'Правильные ответы:\n1. c) "We cut the release candidate from the main branch after all tests passed."',
      hint: 'Cut = создавать release; push out = отложить; roll out = внедрять; roll back = откатить при проблемах.',
      explanation: 'Deployment vocabulary with phrasal verbs is essential for participating in release planning and incident response discussions.'
    },
    {
      id: 5,
      title: 'Практика: step up, level up, burn out',
      type: 'practice',
      difficulty: 'easy',
      description: 'Фразовые глаголы о карьере и профессиональном развитии.',
      requirements: ['Используйте в предложениях о карьерном росте', 'Различайте позитивные и негативные коннотации'],
      questions: [
        { text: 'Write sentences using these phrasal verbs in a career context:\nstep up, level up, burn out, onboard, step back, take on', answer: '"She stepped up to lead the team while the manager was on parental leave — and she\'s been crushing it."\n"I\'ve been focusing on levelling up my Kubernetes skills this quarter."\n"The team is starting to burn out from the constant overtime — we need to address workload sustainability."\n"Onboarding the new hire took about two weeks, but now she\'s contributing independently."\n"Sometimes you need to step back from the day-to-day implementation and think about the big picture."\n"He took on the responsibility for the incident response process and completely transformed it."', explanation: 'Career phrasal verbs: step up (take on more responsibility), level up (improve skills), burn out (exhaust from overwork), onboard (integrate new member), step back (take distance), take on (accept new responsibility).' }
      ],
      solution: 'Правильные ответы:\n1. "She stepped up to lead the team while the manager was on parental leave — and she\\\'s been crushing it."',
      hint: 'Step up = брать больше ответственности; level up = повышать навыки; burn out = выгорать; onboard = вводить в работу.',
      explanation: 'Career-related phrasal verbs are essential for 1:1 meetings, performance reviews, and career conversations with your manager.'
    },
    {
      id: 6,
      title: 'Практика: iron out, sort out, figure out',
      type: 'practice',
      difficulty: 'medium',
      description: 'Фразовые глаголы для решения проблем.',
      requirements: ['Определите правильный глагол для каждого контекста', 'Различайте нюансы'],
      questions: [
        { text: 'Choose the most appropriate phrasal verb (iron out, sort out, figure out, work out, dig into):\n1. "We need to ___ the exact root cause of the memory leak."\n2. "The deployment is failing — I\'m going to ___ the logs to understand why."\n3. "There are a few minor details in the API contract that we need to ___."\n4. "The configuration is broken — can someone ___ it before the demo?"\n5. "We need to ___ whether this approach will scale to 10x the current load."', answer: '1. figure out (understand/discover)\n2. dig into (investigate in detail)\n3. iron out (resolve minor details)\n4. sort out (fix/resolve a problem)\n5. work out (determine/calculate)', explanation: 'Figure out = understand/discover through analysis; dig into = investigate deeply; iron out = resolve minor issues; sort out = fix a problem; work out = determine/calculate.' }
      ],
      solution: 'Правильные ответы:\n1. 1. figure out (understand/discover)',
      hint: 'Figure out = понять через анализ; dig into = расследовать глубоко; iron out = сгладить мелкие детали; sort out = устранить проблему; work out = определить/вычислить.',
      explanation: 'These near-synonyms each have specific usage contexts. Using them precisely shows vocabulary depth and language fluency.'
    },
    {
      id: 7,
      title: 'Практика: pull in, push out, hold off',
      type: 'practice',
      difficulty: 'medium',
      description: 'Фразовые глаголы для управления приоритетами.',
      requirements: ['Используйте в контексте sprint planning', 'Напишите мини-диалог'],
      questions: [
        { text: 'Write a sprint planning discussion using: pull in, push out, hold off, take on, cut scope:', answer: 'PM: "Given what we know, I\'d like to pull in the authentication redesign from next sprint — the security team flagged it as high priority."\nDev Lead: "If we pull that in, we\'ll need to push out the analytics dashboard — we don\'t have the capacity for both."\nPM: "Can we cut scope on the dashboard? Maybe just the summary view for now?"\nDev Lead: "That\'s workable. Also, I\'d hold off on the third-party integration for now — the API docs aren\'t stable yet and we\'d be wasting effort."\nPM: "Agreed. Let\'s hold off on that until Q3. So this sprint: authentication redesign, dashboard MVP, and we take on the performance optimisation tickets?"', explanation: 'Pull in = добавить в спринт; push out = перенести на потом; hold off = отложить; cut scope = урезать объём; take on = взять задачи.' }
      ],
      solution: 'Правильные ответы:\n1. PM: "Given what we know, I\\\'d like to pull in the authentication redesign from next sprint — the security team flagged it as high priority."',
      hint: 'Sprint planning phrasal verbs: pull in (add to scope), push out (delay), hold off (postpone deliberately), cut scope (reduce features), take on (commit to tasks).',
      explanation: 'Sprint planning language with phrasal verbs is essential for Scrum and agile ceremonies in English-speaking environments.'
    },
    {
      id: 8,
      title: 'Практика: phrasal verbs в email',
      type: 'practice',
      difficulty: 'medium',
      description: 'Фразовые глаголы в деловой переписке.',
      requirements: ['Напишите email с минимум 6 фразовыми глаголами', 'Полуформальный тон (коллеги)'],
      questions: [
        { text: 'Write a project update email to a colleague using at least 6 phrasal verbs: circle back, follow up, set up, look into, sort out, roll out, iron out, hold off, check in', answer: 'Subject: Update on API Gateway Migration\n\nHi Sarah,\n\nJust wanted to check in on the API gateway migration progress.\n\nWe\'ve sorted out most of the authentication issues from last week — the root cause was a misconfigured timeout. I\'ve set up a monitoring dashboard so we\'ll catch similar issues earlier next time.\n\nWe\'re rolling out the new gateway to 20% of traffic starting Monday. I\'ll look into the latency metrics during the first 24 hours and follow up with you by Tuesday.\n\nRegarding the rate limiting feature — I\'d suggest we hold off on that until the core migration is stable. There are a few edge cases to iron out first.\n\nCan we circle back on the client impact analysis? I want to make sure we\'re aligned before the full rollout.\n\nThanks,\nNurdaulet', explanation: 'Phrasal verbs make professional emails sound natural rather than translated. Notice how each one serves a specific communicative purpose.' }
      ],
      solution: 'Правильные ответы:\n1. Subject: Update on API Gateway Migration',
      hint: 'Email context для фразовых глаголов: check in (статус обновление), sort out (решить проблему), set up (настроить), roll out (внедрить), look into (проверить), follow up (написать повторно), hold off (отложить), iron out (решить детали), circle back (вернуться к теме).',
      explanation: 'Natural use of phrasal verbs in email is one of the clearest signs that English communication is fluent rather than translated.'
    },
    {
      id: 9,
      title: 'Практика: фразовые глаголы в код-ревью',
      type: 'practice',
      difficulty: 'medium',
      description: 'Используйте фразовые глаголы в комментариях к коду.',
      requirements: ['Напишите 5 код-ревью комментариев', 'Каждый с фразовым глаголом', 'Разные уровни критики'],
      questions: [
        { text: 'Write code review comments using phrasal verbs: extract out, pull out, clean up, flesh out, pass in, factor out, refactor into, wrap up:', answer: 'BLOCKING:\n"Could we pull out this authentication logic into a separate middleware function? It\'s being duplicated in three places."\n\nRECOMMENDATION:\n"It would be worth factoring out this validation logic — it\'s appearing in both the create and update handlers."\n\nSUGGESTION:\n"This function is getting complex — could we extract out the date formatting into a helper? It would make the main flow cleaner."\n\nMINOR:\n"nit: could we clean up the unused imports before merging?"\n\nCURIOSITY:\n"Interesting approach — could you flesh out the error handling a bit? What happens if the external API returns a 503?"', explanation: 'Extract out/factor out = refactor to a separate function; pull out = remove and isolate; clean up = remove unused/messy code; flesh out = add more detail; pass in = inject as parameter.' }
      ],
      solution: 'Правильные ответы:\n1. BLOCKING:',
      hint: 'Код-ревью с фразовыми глаголами звучит естественно и профессионально. Extract out, pull out, factor out — synomymы для рефакторинга в отдельную функцию.',
      explanation: 'Phrasal verbs in code review comments are more natural and collegial than formal vocabulary. They make reviews feel collaborative rather than critical.'
    },
    {
      id: 10,
      title: 'Финальная практика: phrasal verb storytelling',
      type: 'practice',
      difficulty: 'hard',
      description: 'Расскажите историю проекта, используя максимальное количество фразовых глаголов.',
      requirements: [
        'Минимум 15 разных фразовых глаголов',
        'Связный нарратив (не список)',
        'IT-контекст',
        'Длина: 200-250 слов'
      ],
      hint: 'Расскажите о проекте от начала (планирование) до конца (деплой). Включите проблемы и их решение.',
      solution: 'Last year, we set up a brand new service from scratch — a real greenfield project. We kicked off by breaking down the requirements into three phases and spinning up a prototype to prove the concept.\n\nThings were ramping up nicely until we hit a major blocker: the legacy API we depended on kept timing out. We spent two weeks digging into the issue before we figured out it was a rate limiting problem on their end. We sorted it out by implementing exponential backoff and followed up with their team to get our rate limits increased.\n\nHalfway through, the product team tried to pull in three additional features that were way out of scope. We pushed back and managed to hold off on those until Q4. Instead, we focused on ironing out the core functionality.\n\nAs we were wrapping up the implementation, we brought in two new engineers to help ramp up the testing effort. We rolled out to staging first and caught a nasty race condition that we\'d have missed otherwise. After we sorted it out, we rolled out to 10% of production users and kept a close eye on the metrics.\n\nThe day of the full rollout, something unexpected fired off — a mis-configured alert was spamming the on-call engineer. We quickly tracked it down and turned it off without rolling back the deployment. We\'ve been following up with a proper monitoring cleanup ever since.',
      explanation: 'Natural storytelling with phrasal verbs demonstrates true fluency. Count the phrasal verbs: set up, kicked off, breaking down, spinning up, ramping up, digging into, figured out, sorted out, followed up, pull in, pushed back, hold off, ironing out, wrapping up, brought in, ramp up, rolled out, sorted it out, rolled out, fired off, tracked down, turned off, rolling back, following up.'
    }
  ]
}
