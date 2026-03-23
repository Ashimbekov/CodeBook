export default {
  id: 30,
  title: 'Практикум: IT-жаргон и сленг',
  description: 'Практика IT-аббревиатур, сленга, идиом и неформальной IT-лексики',
  lessons: [
    {
      id: 1,
      title: 'Практика: Code Review аббревиатуры',
      type: 'practice',
      difficulty: 'easy',
      description: 'Расшифруйте аббревиатуры и используйте их в контексте.',
      requirements: ['Расшифруйте все аббревиатуры', 'Напишите пример использования каждой'],
      questions: [
        { text: 'Match the abbreviation to its meaning and write an example:\nLGTM, PTAL, WIP, RFC, LGTM pending, nit, AFAICT, TIL', answer: 'LGTM = Looks Good To Me: "LGTM! Nice clean implementation."\nPTAL = Please Take A Look: "@senior, PTAL at my PR — there\'s a tricky edge case I\'d like a second opinion on."\nWIP = Work In Progress: "This is WIP — not ready for merge yet, just sharing for early feedback."\nRFC = Request for Comments: "Created an RFC for the new caching strategy — all feedback welcome."\nLGTM pending = Approves with condition: "LGTM pending the test coverage question."\nnit = Nitpick (minor, non-blocking comment): "nit: could rename this variable for clarity, but not blocking."\nAFAICT = As Far As I Can Tell: "AFAICT the issue is in the connection pool configuration."\nTIL = Today I Learned: "TIL that PostgreSQL\'s JSONB is indexed differently than JSON."', explanation: 'Code review abbreviations are used daily in international teams. Knowing them allows faster, more natural participation in PR discussions.' }
      ],
      solution: 'Правильные ответы:\n1. LGTM = Looks Good To Me: "LGTM! Nice clean implementation."',
      hint: 'Эти аббревиатуры используются в GitHub, GitLab, Gerrit. Понимание их ускоряет участие в code review.',
      explanation: 'Knowing code review slang is essential for contributing naturally to international open source projects and remote teams.'
    },
    {
      id: 2,
      title: 'Практика: Engineering Principles сленг',
      type: 'practice',
      difficulty: 'medium',
      description: 'Используйте принципы YAGNI, DRY, KISS, SOLID в контексте.',
      requirements: ['Определите нарушение принципа', 'Объясните используя правильный термин'],
      questions: [
        { text: 'Identify the violated principle and explain:\n\n1. A developer writes a generic plugin system for a feature that is only needed once.\n2. The same validation logic appears in 4 different files.\n3. A 300-line function that handles input parsing, business logic, database access, and email sending.\n4. A developer spends a day optimising a function that runs once per day for 10ms.', answer: '1. Violates YAGNI: "This is a YAGNI violation — we\'re building a generic plugin system for a feature with a single use case. Until there\'s a second case, we should keep it simple."\n2. Violates DRY: "This is a DRY violation — the same validation logic in four places. One change needs to be made four times, which is a maintenance nightmare."\n3. Violates SRP (Single Responsibility Principle, part of SOLID): "This function violates SRP — it does too many things. Each responsibility should be in its own function or class."\n4. Violates YAGNI / premature optimisation: "Classic premature optimisation. Per Knuth, this is the root of all evil. 10ms once per day is negligible."', explanation: 'Knowing which principle is being violated — and naming it precisely — is a sign of engineering maturity.' }
      ],
      solution: 'Правильные ответы:\n1. 1. Violates YAGNI: "This is a YAGNI violation — we\\\'re building a generic plugin system for a feature with a single use case. Until there\\\'s a second case, we should keep it simple."',
      hint: 'DRY = duplication; YAGNI = building what isn\'t needed yet; SOLID = multiple principles including SRP, OCP, LSP, ISP, DIP; KISS = unnecessary complexity.',
      explanation: 'These principles form the vocabulary of code quality discussions. Using them precisely in code review comments makes you a more effective reviewer.'
    },
    {
      id: 3,
      title: 'Практика: IT-идиомы и метафоры',
      type: 'practice',
      difficulty: 'medium',
      description: 'Используйте IT-идиомы в правильном контексте.',
      requirements: ['Объясните идиому', 'Используйте её в предложении', 'Определите, когда она уместна'],
      questions: [
        { text: 'Use the following idioms in appropriate IT contexts:\n1. Bikeshedding\n2. Yak shaving\n3. Rubber duck debugging\n4. Eating your own dog food\n5. Boiling the ocean', answer: '1. Bikeshedding: "We\'ve been bikeshedding for 30 minutes about whether to use tabs or spaces. Let\'s just pick one and move on — it\'s not the important decision here."\n2. Yak shaving: "I started trying to add a test, but then I realised the test framework was outdated, so I tried to update it, but that required a Node upgrade... I spent 4 hours yak shaving and never wrote the test."\n3. Rubber duck debugging: "I spent an hour stuck on this bug, then explained it to a rubber duck and realised the issue immediately. Highly recommend rubber duck debugging."\n4. Dogfooding: "We\'re using our own API in our internal admin panel — dogfooding helps us find UX issues before customers do."\n5. Boiling the ocean: "We can\'t rewrite the entire codebase in one quarter — we\'re boiling the ocean. Let\'s pick the highest-impact area and start there."', explanation: 'These idioms communicate complex situations efficiently in one phrase.' }
      ],
      solution: 'Правильные ответы:\n1. 1. Bikeshedding: "We\\\'ve been bikeshedding for 30 minutes about whether to use tabs or spaces. Let\\\'s just pick one and move on — it\\\'s not the important decision here."',
      hint: 'Idioms work best when used sparingly and in the right context. Overuse sounds unnatural; correct use sounds fluent.',
      explanation: 'IT idioms are part of the cultural fabric of software engineering. They convey complex situations efficiently and signal cultural familiarity with the profession.'
    },
    {
      id: 4,
      title: 'Практика: Communication аббревиатуры',
      type: 'practice',
      difficulty: 'easy',
      description: 'Использование коммуникационных аббревиатур в правильном контексте.',
      requirements: ['Напишите Slack-сообщение с минимум 5 аббревиатурами', 'Переведите сообщение на "полный" английский'],
      questions: [
        { text: 'Translate this "formal" message into natural Slack with appropriate abbreviations:\n"I have reviewed the issue you reported. As far as I can tell, it appears to be related to the recent deployment. In my opinion, we should revert immediately. For what it is worth, I recall that we had a similar issue last quarter. Too long; did not read version: revert the deployment."', answer: 'Hey, looked into the issue you flagged. AFAICT it\'s related to yesterday\'s deploy. IMO we should roll it back ASAP. FWIW, IIRC we had something similar last quarter. TL;DR: revert.', explanation: 'The condensed version says the same thing in less than half the words. In Slack, brevity is valued.' }
      ],
      solution: 'Правильные ответы:\n1. Hey, looked into the issue you flagged. AFAICT it\\\'s related to yesterday\\\'s deploy. IMO we should roll it back ASAP. FWIW, IIRC we had something similar last quarter. TL;DR: revert.',
      hint: 'TL;DR должен быть в начале или в конце. AFAICT и IIRC смягчают уверенность. IMO выражает личное мнение.',
      explanation: 'Natural use of communication abbreviations is a sign of fluency in the culture of modern software teams. They save time and signal familiarity with team communication norms.'
    },
    {
      id: 5,
      title: 'Практика: сленг в диалоге',
      type: 'practice',
      difficulty: 'medium',
      description: 'Понимание насыщенного сленгом IT-диалога.',
      requirements: ['Переведите диалог на стандартный английский', 'Определите все сленговые выражения'],
      questions: [
        { text: 'Decode this Slack conversation:\n\nDev A: "yo, greenfield or we brownfielding this?"\nDev B: "brownfield for sure, legacy codebase, total spaghetti."\nDev A: "ugh, gonna be yak shaving all week then"\nDev B: "yeah. LGTM on just slapping a band-aid on it for now tbh"\nDev A: "imo that\'s bikeshedding tho. the real issue is the god class"\nDev B: "fr. ok let\'s just ship it, we can refactor in Q3 YAGNI style"', answer: 'Dev A: "Hey, are we starting from scratch (new project) or are we working on an existing system?"\nDev B: "Definitely existing — it\'s a legacy codebase with no clear structure (messy code with tangled dependencies)."\nDev A: "Ugh, I\'ll be dealing with endless preparatory tasks all week then."\nDev B: "Yeah. I think it\'s fine to just apply a temporary quick fix for now, to be honest."\nDev A: "In my opinion, that\'s focusing on the wrong thing. The real problem is the massively overloaded class with too many responsibilities."\nDev B: "For real (I agree). OK, let\'s just release it, we can refactor in Q3 — we don\'t need it to be perfect now."', explanation: 'This conversation contains: greenfield/brownfield (project type), spaghetti (messy code), yak shaving (endless prep), band-aid (quick fix), tbh (to be honest), bikeshedding (wrong focus), god class (anti-pattern), fr (for real), YAGNI (don\'t over-engineer).' }
      ],
      solution: 'Правильные ответы:\n1. Dev A: "Hey, are we starting from scratch (new project) or are we working on an existing system?"',
      hint: 'Расшифруйте слой за слоем: сначала аббревиатуры (LGTM, IMO, tbh, fr, YAGNI), затем идиомы (yak shaving, band-aid, spaghetti), затем IT-термины (greenfield, brownfield, god class).',
      explanation: 'Understanding dense IT slang is a test of cultural and linguistic fluency. This level of informal communication is common in tech startup environments.'
    },
    {
      id: 6,
      title: 'Практика: написание Slack-сообщений',
      type: 'practice',
      difficulty: 'easy',
      description: 'Напишите Slack-сообщения, используя уместный IT-сленг.',
      requirements: ['3 разных сообщения', 'Каждое с минимум 3 слэнговыми выражениями', 'Уместно для рабочего контекста'],
      questions: [
        { text: 'Write appropriate Slack messages for:\n1. Asking for urgent PR review\n2. Reporting a production issue to the team\n3. Sharing something interesting you learned', answer: '1. "@team PTAL at PR #847 when you have a sec — it\'s blocking the release. WIP on the docs but the code is good to go. TL;DR: fixes the race condition from the postmortem. LGTM from my side obv 😅"\n\n2. "@oncall heads up: prod is throwing 500s on the checkout endpoint. AFAICT it\'s related to the DB connection pool — looks like the same issue as last month. Digging into it now. ETA on fix: 30 min. FWIW, this is only affecting ~5% of users."\n\n3. "TIL that PostgreSQL\'s EXPLAIN ANALYZE shows the actual vs estimated row counts — super useful for catching bad query plans. Would highly recommend adding this to your debugging toolkit. AFAIK most people just look at the query text. Here\'s what it looks like: [screenshot]"', explanation: 'Notice how each message is direct, uses appropriate abbreviations, and is appropriately informal while remaining professional.' }
      ],
      solution: 'Правильные ответы:\n1. 1. "@team PTAL at PR #847 when you have a sec — it\\\'s blocking the release. WIP on the docs but the code is good to go. TL;DR: fixes the race condition from the postmortem. LGTM from my side obv 😅"',
      hint: 'Рабочий Slack-сленг: TL;DR для summary, LGTM для одобрения, PTAL для запроса ревью, AFAICT/FWIW для мягких утверждений, TIL для интересных находок.',
      explanation: 'Writing natural, appropriately informal Slack messages is a daily skill in international tech teams.'
    },
    {
      id: 7,
      title: 'Практика: технический жаргон в context',
      type: 'practice',
      difficulty: 'medium',
      description: 'Используйте технический жаргон точно в нужном контексте.',
      requirements: ['Заполните пропуски подходящим жаргонным словом', 'Словарь: duct tape, snowflake, dogfooding, thundering herd, rubber duck, silver bullet'],
      questions: [
        { text: 'Fill in the blanks:\n1. "Our server configuration is so unique and manually configured that no one dares touch it — it\'s a ___ server."\n2. "We added a cache invalidation layer on top of a workaround on top of a patch — it\'s total ___ engineering."\n3. "After the cache warmed up, all 10,000 clients requested the same data simultaneously — classic ___ problem."\n4. "Microservices are not a ___ for all your engineering problems."', answer: '1. snowflake (unique, unreproducible server)\n2. duct tape (temporary patches upon patches)\n3. thundering herd (many clients simultaneously hitting the same resource)\n4. silver bullet (mythical solution to all problems)', explanation: 'Snowflake server: manually configured, irreplaceable. Duct tape engineering: temporary fixes piled on. Thundering herd: many clients simultaneously hitting an uncached resource. Silver bullet: non-existent perfect solution.' }
      ],
      solution: 'Правильные ответы:\n1. 1. snowflake (unique, unreproducible server)',
      hint: 'Snowflake = уникальный/хрупкий сервер; duct tape = временное решение; thundering herd = толпа клиентов одновременно; silver bullet = несуществующее идеальное решение.',
      explanation: 'Precise jargon use communicates complex system behaviours efficiently and is a hallmark of experienced engineers.'
    },
    {
      id: 8,
      title: 'Практика: IT-идиомы в tech talk',
      type: 'practice',
      difficulty: 'medium',
      description: 'Включите IT-идиомы в фрагменты технической презентации.',
      requirements: ['Естественно включите минимум 5 идиом в текст презентации', 'Идиомы должны помогать, а не засорять текст'],
      questions: [
        { text: 'Rewrite this bland presentation paragraph to include appropriate IT idioms:\n"The codebase has problems. It was built quickly without good practices. Over time it became harder to maintain. Small changes cause unexpected problems. We need to fix it."', answer: '"The codebase has accumulated significant technical debt. To be blunt: it started as a quick duct tape solution that shipped fast, but over time it evolved into a Big Ball of Mud — no clear architecture, no tests, and changes in one area cause cascade failures elsewhere. We\'re constantly yak shaving — spending more time working around the codebase than delivering value. What we need isn\'t a silver bullet. There is no magic framework that will fix this. What we need is a disciplined, incremental approach to eating this elephant one bite at a time."', explanation: '"Duct tape solution" (quick fix), "Big Ball of Mud" (architectural anti-pattern), "yak shaving" (endless prep work), "silver bullet" (non-existent magic solution), "eating the elephant one bite at a time" (tackling large problems incrementally)' }
      ],
      solution: 'Правильные ответы:\n1. "The codebase has accumulated significant technical debt. To be blunt: it started as a quick duct tape solution that shipped fast, but over time it evolved into a Big Ball of Mud — no clear architecture, no tests, and changes in one area cause cascade failures elsewhere. We\'re constantly yak shaving',
      hint: 'IT-идиомы делают презентацию более живой и запоминающейся. Но каждая идиома должна нести смысл, а не просто звучать cool.',
      explanation: 'Idioms in presentations make complex ideas memorable and show cultural fluency. Use them purposefully, not decoratively.'
    },
    {
      id: 9,
      title: 'Практика: написание постмортема со сленгом',
      type: 'practice',
      difficulty: 'hard',
      description: 'Напишите ВНУТРЕННИЙ постмортем (для команды) и ВНЕШНИЙ (для клиентов), используя подходящий регистр.',
      requirements: ['Внутренний: с IT-сленгом и аббревиатурами', 'Внешний: формальный, без жаргона', 'Один и тот же инцидент'],
      hint: 'Инцидент: Redis went OOM (Out of Memory) after a new deploy. Caused 2 hours of elevated error rates. Root cause: memory limit not set on the new service.',
      solution: 'INTERNAL (Team Slack/Confluence):\n## Incident Postmortem — Redis OOM 15 March\n\nTL;DR: Redis went OOM after last Tuesday\'s deploy. New `recommendations-service` was deployed without a memory limit — classic YAGNI-gone-wrong. Service was hammered for 2h before we caught it. AFAIKT, no data loss — Redis uses LRU eviction by default.\n\nRoot cause: Config as code PR for the new service didn\'t include `maxmemory` setting. LGTM\'d without catching it — my bad.\n\nLessons:\n- Bake memory limits into the PR template (nit from the last retro that we kept bikeshedding on — time to actually do it)\n- Add OOM alerts — should have fired way earlier\n\n---\n\nEXTERNAL (Client email):\n## Service Incident Report — 15 March 2025\n\nDear Customer,\n\nOn 15 March 2025 between 14:00 and 16:10 UTC, some API requests returned elevated error rates. The root cause was a memory configuration issue in our caching infrastructure, introduced during a routine deployment.\n\nImpact was limited to increased error rates; no data was lost or corrupted. Service was fully restored at 16:10 UTC.\n\nWe have implemented the following measures to prevent recurrence: automated validation of memory configuration in our deployment pipeline, and additional monitoring alerts for early detection.',
      explanation: 'The contrast between internal and external communication demonstrates register mastery. Internal uses slengs and abbreviations for speed; external uses formal language for professionalism.'
    },
    {
      id: 10,
      title: 'Практика: финальный тест — полный словарь',
      type: 'practice',
      difficulty: 'hard',
      description: 'Комплексный тест на весь IT-жаргон и сленг из курса.',
      requirements: ['Ответьте на все вопросы', 'Используйте правильный регистр в каждом контексте'],
      questions: [
        { text: 'In ONE paragraph, write a standup update using as many of the following as naturally fit: PTAL, WIP, TL;DR, LGTM, circle back, drill down, ramp up, phase out, spin up, iron out, FWIW, IMO, yak shaving, nit.', answer: 'TL;DR: on track, one blocker.\n\nYesterday I was mostly dealing with some yak shaving — had to spin up a fresh dev environment before I could actually work on the main task. IMO that setup process needs to be automated — I\'ll circle back to that in the retro. I\'ve got a WIP PR open (#901) — PTAL when you have a moment, it\'s about 80% there. I still need to iron out the edge case handling. FWIW, the approach I\'m taking is basically the same as what Alex did last sprint, LGTM from his side already. Today: drilling down into the performance issue on the search endpoint, then I\'ll ramp up on the new infra work. We\'re starting to phase out the old search engine this week — there\'s a nit in the migration script I need to address first.', explanation: 'Natural integration of multiple terms demonstrates fluency. The key is that each term serves a communicative purpose rather than being forced.' }
      ],
      solution: 'Правильные ответы:\n1. TL;DR: on track, one blocker.',
      hint: 'Don\'t force every term into one sentence — let them appear naturally across the update. TL;DR as opener, WIP/PTAL for PR mentions, idioms for narrative.',
      explanation: 'This exercise tests holistic integration of IT communication vocabulary. Fluency means the terms appear naturally, not as a forced checklist.'
    }
  ]
}
