export default {
  id: 34,
  title: 'Practice: Interview in English',
  description: 'Практика ответов на поведенческие и технические вопросы интервью на английском. STAR-метод, реальные вопросы и образцы ответов.',
  lessons: [
    {
      id: 1,
      title: '"Tell me about yourself" — perfect answer',
      type: 'practice',
      description: 'Подготовь свой ответ на вопрос "Tell me about yourself" (60-90 секунд).',
      solution: 'Структура ответа Past-Present-Future:\nPast: "I started my career as... / I have X years of experience in..."\nPresent: "Currently I work on... / My main skills are..."\nFuture: "I\'m excited about this role because..."\n\nКлюч: конкретные технологии, проекты, цифры. Заканчивай связью с вакансией.',
      content: [
        { type: 'text', value: '"Tell me about yourself" — первый вопрос почти любого интервью. Это твой "elevator pitch" — 60-90 секунд.' },
        { type: 'list', items: [
          'Past: кто ты, откуда пришёл профессионально',
          'Present: что делаешь сейчас, что умеешь',
          'Future: почему эта роль и компания'
        ]}
      ],
      examples: [
        {
          level: 'Junior (1-2 года опыта)',
          answer: 'I\'m a backend developer with about 2 years of professional experience. I started my career at a fintech startup, where I built REST APIs with Node.js and worked on database optimization. More recently, I\'ve been working with microservices and learning Kubernetes. I\'m excited about this role because I want to work on systems at scale, and from what I\'ve read about your infrastructure, this would be a great opportunity to grow.'
        },
        {
          level: 'Mid-level (3-5 лет опыта)',
          answer: 'I\'m a full-stack developer with 4 years of experience, primarily in React and Node.js. I\'ve spent the last 2 years at a SaaS company where I led the migration from a monolith to microservices — that involved designing the service boundaries, setting up the CI/CD pipeline, and mentoring two junior developers through the process. I\'m looking to join a company where I can take on more ownership and work on technically interesting problems. Your product caught my attention because...'
        }
      ]
    },
    {
      id: 2,
      title: 'Behavioral: Challenge and growth',
      type: 'practice',
      description: 'Подготовь STAR-ответ на вопрос о сложном техническом вызове.',
      solution: 'STAR-структура:\nS (Situation) — контекст: компания, проект, масштаб\nT (Task) — твоя конкретная задача\nA (Action) — 3-4 конкретных шага, которые ты предпринял\nR (Result) — измеримый результат\n\nПример: "I was working at X (S). My task was to reduce API latency (T). I profiled the code, added Redis caching, optimized queries (A). P99 latency dropped from 800ms to 120ms (R)."',
      questions: [
        {
          question: '"Tell me about the most challenging technical problem you\'ve faced."',
          star: {
            S: 'Опиши контекст: что за проект, какой масштаб',
            T: 'Твоя задача: что нужно было сделать',
            A: 'Действия: конкретные шаги, которые ты предпринял',
            R: 'Результат: что получилось, чему научился'
          },
          sampleAnswer: 'In my previous role, we had a performance issue where our search API was timing out under high load — this was affecting 20% of users during peak hours.\n\nI was responsible for investigating and fixing the root cause. My first step was profiling the database queries — I found that three queries were doing full table scans, each taking 8-10 seconds. I added composite indexes and rewrote one query using a subquery instead of a JOIN. I also introduced Redis caching for the most common search patterns.\n\nAs a result, search response time dropped from 8 seconds to under 200ms at peak load. The fix eliminated all timeouts. This taught me the importance of measuring before optimizing — my initial guess about the cause was wrong.'
        },
        {
          question: '"Describe a time when you had to learn a new technology quickly."',
          sampleAnswer: 'In my last sprint, we decided to migrate from REST to GraphQL for the client app. I had zero GraphQL experience. I had one week to get productive.\n\nI took the approach of learning by doing: I set up a simple GraphQL server with Apollo on day one, then used that foundation to build the actual features. I also scheduled two pair programming sessions with a colleague who had GraphQL experience.\n\nBy the end of the sprint, I had built three fully functional GraphQL resolvers and written the documentation. The app performance improved because the client could request only the fields it needed. I\'d say the key was not trying to learn everything upfront — just enough to start building.'
        }
      ]
    },
    {
      id: 3,
      title: 'Behavioral: Teamwork and conflict',
      type: 'practice',
      description: 'Подготовь STAR-ответ на вопрос о конфликте в команде.',
      solution: 'STAR-структура для конфликта:\nS — ситуация и разногласие (нейтрально)\nT — что было поставлено на кону\nA — как ты подошёл к разрешению (конкретные шаги)\nR — чем закончилось, что ты вынес\n\nВажно: фокусируйся на решении, не на обвинениях. Покажи уважение к точке зрения другого.',
      questions: [
        {
          question: '"Tell me about a time you disagreed with a technical decision."',
          sampleAnswer: 'During the architecture planning for a new service, I disagreed with the decision to use MongoDB when I believed PostgreSQL was a better fit. The data was clearly relational and we needed ACID transactions.\n\nI prepared a brief comparison document showing the trade-offs and presented it to the team. I explained my concern specifically: our data model had clear foreign key relationships and we needed transactional guarantees for the payment flow.\n\nThe team appreciated the data-backed argument. After discussion, we decided to use PostgreSQL for the payment service and MongoDB for the product catalog where flexibility mattered more. I think the key was coming with data, not just an opinion, and being open to a hybrid solution.'
        },
        {
          question: '"Describe a time you helped a struggling teammate."',
          sampleAnswer: 'A junior developer on my team was struggling with an async/await bug that was causing intermittent data corruption. He had been stuck for two days and was getting frustrated.\n\nI sat down with him and instead of solving it for him, I walked through the code together asking questions: "What do you expect this to do? What does it actually do?" This helped him see the race condition himself.\n\nHe fixed the bug and more importantly he now has a mental model for diagnosing async issues. He later told me that session was more helpful than any tutorial he\'d watched. That reinforced my belief that mentoring through questions is more effective than giving answers.'
        }
      ]
    },
    {
      id: 4,
      title: 'Behavioral: Leadership and initiative',
      type: 'practice',
      description: 'Подготовь STAR-ответ на вопрос о лидерстве и инициативе.',
      solution: 'STAR-структура для leadership:\nS — ситуация, где требовалась инициатива\nT — твоя роль (даже без формального статуса лидера)\nA — что ты инициировал, как убедил команду, конкретные действия\nR — измеримый результат, влияние на команду/продукт',
      questions: [
        {
          question: '"Tell me about a time you took initiative beyond your job description."',
          sampleAnswer: 'I noticed that our deployment process was entirely manual and took 45 minutes every Friday. Developers were doing it by hand, following a checklist. It was error-prone — we had two incidents caused by missed steps.\n\nEven though DevOps automation wasn\'t in my role, I proposed automating it. I got approval to spend two weeks on it. I built a GitHub Actions pipeline that ran tests, created a Docker image, and deployed to AWS with a blue-green strategy.\n\nDeployment time dropped from 45 minutes to 8 minutes. We had zero deployment-related incidents in the following quarter. The DevOps team later extended the pipeline to all our services. It taught me to look beyond my immediate tasks for high-impact improvements.'
        },
        {
          question: '"Describe a situation where you influenced a team without authority."',
          sampleAnswer: 'I wanted to introduce code review standards in our team because PR quality was inconsistent. I had no authority to mandate it.\n\nI started by proposing a minimal checklist — just 5 points — and asking if we could try it for one sprint. I framed it as an experiment. I also volunteered to review PRs first to demonstrate the value.\n\nAfter one sprint, the team saw that PRs were getting merged faster and with fewer bugs reaching production. They agreed to make the checklist permanent. The key was starting small, showing results, and letting the team decide to adopt it rather than imposing it.'
        }
      ]
    },
    {
      id: 5,
      title: 'Technical interview: system design',
      type: 'practice',
      description: 'Ответь на вопросы о system design, используя структурированный подход.',
      solution: 'Структура system design ответа:\n1. Уточни требования (functional + non-functional)\n2. Оцени масштаб (DAU, RPS, storage)\n3. Высокоуровневый дизайн (diagram)\n4. Deep dive в ключевые компоненты\n5. Обсуди trade-offs\n6. Bottlenecks и масштабирование\n\nКлючевые фразы: "Let me clarify...", "The trade-off here is...", "We could scale this by..."',
      content: [
        { type: 'text', value: 'System design вопросы: как подойти к вопросу "Design a URL shortener" или "Design Twitter".' }
      ],
      framework: [
        '1. Clarify requirements — уточни требования ("How many users? Read-heavy or write-heavy?")',
        '2. Estimate scale — прикинь масштаб ("10M URLs, 100M reads/day")',
        '3. Define API — опиши API ("POST /shorten, GET /:code")',
        '4. Draw high-level design — нарисуй высокоуровневую схему',
        '5. Deep dive — углубись в критические компоненты',
        '6. Identify bottlenecks — найди узкие места',
        '7. Discuss trade-offs — обсуди компромиссы'
      ],
      sampleQuestion: '"Design a URL shortener like bit.ly"',
      sampleAnswer: 'Let me start by clarifying requirements. Are we optimizing for read or write speed? I\'ll assume reads are much more frequent — 100 reads per write.\n\nFor scale: 1M new URLs per day, 100M redirects per day.\n\nThe core API:\n- POST /api/shorten — takes long URL, returns short code\n- GET /:code — redirects to original URL\n\nHigh-level design: Client → Load Balancer → App servers → URL Database (PostgreSQL) + Cache (Redis)\n\nFor the short code: I\'d use a base62 encoding of a sequential ID, giving 6 characters for 62^6 = 56 billion unique URLs.\n\nKey trade-off: storing the mapping. SQL is simpler but NoSQL (Cassandra) scales better for write-heavy workloads. For 1M writes/day, PostgreSQL is sufficient.\n\nFor the redirect service, I\'d cache hot URLs in Redis with a 1-hour TTL. 80% of traffic probably hits 20% of URLs, so caching gives huge benefit.\n\nThe main bottleneck I see is the redirect service — we need it to be very fast. I\'d put Redis in front and use HTTP 301 (permanent redirect) for caching at the browser level.'
    },
    {
      id: 6,
      title: 'Technical interview: algorithms',
      type: 'practice',
      description: 'Реши алгоритмическую задачу вслух, объясняя свои рассуждения.',
      solution: 'Алгоритм решения задачи:\n1. Прочитай и уточни условие\n2. Приведи примеры (edge cases)\n3. Brute force решение\n4. Оптимизация (объясни почему)\n5. Код (говори вслух)\n6. Тестирование\n\nКлючевые фразы: "My approach is...", "The time complexity is O(n)...", "Let me trace through an example..."',
      content: [
        { type: 'text', value: 'На coding interviews важно думать вслух. Покажем правильный процесс на примере задачи.' }
      ],
      problem: 'Given an array of integers and a target sum, find two numbers that add up to the target. Return their indices.',
      thinking: [
        '"Let me make sure I understand: I need to find two numbers in the array that sum to target, and return their indices."',
        '"Can there be duplicates? Can the same element be used twice? I\'ll assume no."',
        '"My first thought is a brute force approach: O(n²) — check every pair."',
        '"But we can do better. I\'ll use a HashMap to store numbers we\'ve seen."',
        '"For each number, I check if (target - number) is already in the map."',
        '"This gives us O(n) time and O(n) space."',
        '"Let me trace through an example to verify: [2,7,11,15], target=9..."'
      ],
      sampleCode: 'function twoSum(nums, target) {\n  // HashMap: value -> index\n  const seen = new Map();\n  \n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    \n    if (seen.has(complement)) {\n      return [seen.get(complement), i];\n    }\n    \n    seen.set(nums[i], i);\n  }\n  \n  return []; // No solution found\n}'
    },
    {
      id: 7,
      title: 'Questions to ask the interviewer',
      type: 'practice',
      description: 'Подготовь вопросы для интервьюера.',
      solution: 'Хорошие вопросы интервьюеру:\n- "What does a typical day look like for this role?"\n- "What are the biggest technical challenges the team faces?"\n- "How do you handle technical debt?"\n- "What does the onboarding process look like?"\n- "What does success look like in the first 90 days?"\n\nИзбегай: зарплату и отпуск на первом интервью.',
      content: [
        { type: 'text', value: 'Подготовь вопросы для интервьюера — это обязательно. Вот примеры хороших вопросов и почему они хорошие.' }
      ],
      questions: [
        {
          question: '"What does a typical on-call rotation look like? How often do engineers get paged?"',
          why: 'Показывает заботу о work-life balance и зрелость. Важная информация о культуре компании.'
        },
        {
          question: '"What\'s the biggest technical challenge the team is currently facing?"',
          why: 'Показывает технический интерес. Даёт понять, насколько тебя интересуют реальные проблемы, а не только оффер.'
        },
        {
          question: '"How does the team handle technical debt? Is there dedicated time for it?"',
          why: 'Показывает зрелое понимание разработки. Помогает понять культуру качества кода в компании.'
        },
        {
          question: '"What would success look like for someone in this role in the first 6 months?"',
          why: 'Показывает ориентацию на результат. Помогает тебе понять ожидания заранее.'
        },
        {
          question: '"What do you personally enjoy most about working here?"',
          why: 'Личный вопрос, устанавливает контакт. Получаешь честный ответ от человека, а не от HR-брошюры.'
        }
      ]
    },
    {
      id: 8,
      title: 'Common interview phrases reference',
      type: 'practice',
      description: 'Изучи и запомни ключевые фразы для интервью.',
      solution: 'Ключевые фразы:\nНачало ответа: "That\'s a great question...", "Let me think about this for a moment..."\nВремя подумать: "Could you clarify what you mean by...?"\nОтвет по STAR: "In my previous role...", "The challenge was...", "What I did was...", "As a result..."\nТехнический ответ: "The trade-off here is...", "It depends on the requirements..."',
      content: [
        { type: 'text', value: 'Справочник фраз для разных ситуаций на интервью.' }
      ],
      sections: [
        {
          title: 'Buying time and thinking',
          phrases: [
            '"Let me think about this for a moment."',
            '"That\'s an interesting question. My initial thought is..."',
            '"I haven\'t faced this exact situation, but I would approach it by..."',
            '"Let me break this down into parts."'
          ]
        },
        {
          title: 'Clarifying questions',
          phrases: [
            '"Just to make sure I understand — are you asking about...?"',
            '"Could you tell me more about the scale we\'re dealing with?"',
            '"Is this more about [X] or [Y]?"',
            '"Before I answer, can I ask...?"'
          ]
        },
        {
          title: 'Showing trade-offs',
          phrases: [
            '"There\'s a trade-off here between performance and simplicity."',
            '"This depends on the use case — for high write volume, I\'d choose X..."',
            '"The advantage of this approach is... The downside is..."',
            '"In the short term this is simpler, but long-term it might cause..."'
          ]
        },
        {
          title: 'When you don\'t know',
          phrases: [
            '"I\'m not sure of the exact answer, but my intuition says..."',
            '"I haven\'t used this specific technology, but based on my experience with similar tools..."',
            '"I\'d need to look that up to give you a precise answer, but conceptually..."',
            '"That\'s something I haven\'t encountered yet — I\'d tackle it by..."'
          ]
        }
      ]
    },
    {
      id: 9,
      title: 'Practice: STAR answers writing',
      type: 'practice',
      description: 'Напиши полный STAR-ответ на поведенческие вопросы.',
      solution: 'Критерии хорошего STAR-ответа:\n✓ Конкретная ситуация (не абстрактная)\n✓ Твоя личная роль (не "мы сделали")\n✓ 3-5 конкретных действий\n✓ Измеримый результат\n✓ Вывод/урок\n\nДлина: 1.5-2 минуты устно, 200-300 слов письменно.',
      content: [
        { type: 'text', value: 'Напиши STAR-ответы для следующих вопросов из своего реального опыта. Используй структуру и фразы из модуля.' }
      ],
      prompts: [
        '"Tell me about a time you improved a process in your team."',
        '"Describe a situation where you had to make a decision with incomplete information."',
        '"Tell me about a time you failed at something and what you learned."',
        '"Describe a complex feature you built from scratch."',
        '"Tell me about a time you received critical feedback."'
      ],
      checklist: [
        'S: Есть ли конкретный контекст?',
        'T: Понятна ли твоя конкретная роль?',
        'A: Описаны ли конкретные шаги?',
        'R: Есть ли измеримый результат?',
        'Время ответа: 1.5-2 минуты',
        'Используются ли фразы из модуля?'
      ]
    },
    {
      id: 10,
      title: 'Mock interview simulation',
      type: 'practice',
      description: 'Проведи mock interview: ответь на вопросы интервьюера.',
      solution: 'Оценочные критерии mock interview:\n✓ Структурированность ответов\n✓ Конкретность (цифры, технологии)\n✓ Правильное использование времён\n✓ Профессиональная лексика\n✓ Уверенная подача\n✓ Вопросы интервьюеру в конце',
      content: [
        { type: 'text', value: 'Полная симуляция интервью. Ответь на все вопросы письменно или запиши себя на видео.' }
      ],
      interview: [
        { question: '"Tell me about yourself."', timeLimit: '90 seconds', type: 'intro' },
        { question: '"Why are you interested in this role?"', timeLimit: '60 seconds', type: 'motivation' },
        { question: '"Tell me about the most complex system you\'ve worked on."', timeLimit: '2 minutes', type: 'behavioral' },
        { question: '"How do you handle disagreements with your manager about technical decisions?"', timeLimit: '2 minutes', type: 'behavioral' },
        { question: '"What\'s the difference between process and thread?"', timeLimit: '90 seconds', type: 'technical' },
        { question: '"Design a simple notification system. Users should receive email and push notifications."', timeLimit: '5 minutes', type: 'system_design' },
        { question: '"Do you have any questions for us?"', timeLimit: '2-3 questions', type: 'questions' }
      ],
      selfReview: [
        'Был ли ответ структурированным?',
        'Использовал ли конкретные примеры и цифры?',
        'Говорил ли на хорошем темпе (не слишком быстро/медленно)?',
        'Были ли паузы там, где нужно было подумать?',
        'Задал ли хорошие вопросы в конце?'
      ]
    }
  ]
}
