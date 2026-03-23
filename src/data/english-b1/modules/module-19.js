export default {
  id: 19,
  title: 'Idioms in IT: "hit the ground running"',
  description: 'Идиомы, часто используемые в IT-среде. Как понимать и использовать образные выражения в технических разговорах и переписке.',
  lessons: [
    {
      id: 1,
      title: 'What are idioms?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Идиома — это выражение, смысл которого нельзя понять, переведя каждое слово по отдельности. Например, "hit the ground running" дословно означает "ударить землю бегом", но на самом деле значит "сразу активно приступить к работе".' },
        { type: 'heading', value: 'Why do IT people use idioms?' },
        { type: 'text', value: 'В IT-командах, особенно международных, идиомы используются постоянно — в Slack, на митингах, в email-переписке. Понимание идиом делает общение более естественным и профессиональным.' },
        { type: 'heading', value: 'Key idioms: starting and working' },
        { type: 'list', items: [
          'hit the ground running — сразу начать работу с полной отдачей ("She hit the ground running on day one")',
          'get the ball rolling — начать процесс, дать старт ("Let\'s get the ball rolling on the new feature")',
          'up and running — работает, запущено ("The server is finally up and running")',
          'from scratch — с нуля ("We rewrote the module from scratch")'
        ]},
        { type: 'tip', value: 'Запоминай идиомы через контекст, а не изолированно. Встретив новую идиому, сразу составь пример предложения из своей области.' }
      ]
    },
    {
      id: 2,
      title: 'Idioms about problems and solutions',
      type: 'theory',
      content: [
        { type: 'text', value: 'Когда что-то идёт не так в проекте, разработчики часто используют образные выражения для описания проблем.' },
        { type: 'heading', value: 'Problem idioms' },
        { type: 'list', items: [
          'a can of worms — ящик Пандоры, сложная проблема ("Refactoring that module opened a can of worms")',
          'back to square one — вернуться к началу, начать заново ("The tests failed, so we\'re back to square one")',
          'on the same page — иметь одинаковое понимание ("Are we all on the same page about the requirements?")',
          'a moving target — постоянно меняющиеся требования ("The deadline is a moving target")'
        ]},
        { type: 'heading', value: 'Solution idioms' },
        { type: 'list', items: [
          'think outside the box — мыслить нестандартно ("We need to think outside the box to solve this bug")',
          'reinvent the wheel — изобретать велосипед ("Don\'t reinvent the wheel, use an existing library")',
          'the bottom line — итог, суть ("The bottom line is: performance is poor")',
          'cut corners — срезать углы, делать наспех ("We can\'t cut corners on security")'
        ]},
        { type: 'note', value: '"Reinvent the wheel" — пожалуй, самая популярная идиома в программировании. Используй её, когда хочешь сказать, что не стоит создавать то, что уже существует.' }
      ]
    },
    {
      id: 3,
      title: 'Idioms about time and deadlines',
      type: 'theory',
      content: [
        { type: 'text', value: 'Сроки и управление временем — горячая тема в IT. Вот идиомы, которые ты будешь слышать каждый день.' },
        { type: 'heading', value: 'Time pressure idioms' },
        { type: 'list', items: [
          'under the gun — под давлением срока ("We\'re under the gun to deliver by Friday")',
          'crunch time — горячая пора, аврал ("It\'s crunch time before the release")',
          'on the back burner — отложено, не в приоритете ("That feature is on the back burner")',
          'ahead of schedule — раньше срока ("We finished the sprint ahead of schedule")',
          'behind schedule — позади графика ("The deployment is behind schedule")'
        ]},
        { type: 'heading', value: 'Priority idioms' },
        { type: 'list', items: [
          'front and center — на первом плане, главный приоритет ("Security should be front and center")',
          'bite off more than you can chew — взять на себя больше, чем можешь сделать ("Don\'t bite off more than you can chew this sprint")',
          'in the pipeline — в работе, запланировано ("We have new features in the pipeline")'
        ]},
        { type: 'tip', value: '"Crunch time" хорошо известен всем разработчикам — это период интенсивной работы перед важным релизом. Используй эту идиому в стендапах и митингах.' }
      ]
    },
    {
      id: 4,
      title: 'Idioms about communication and teamwork',
      type: 'theory',
      content: [
        { type: 'text', value: 'В командной разработке важно хорошо общаться. Эти идиомы помогут тебе в ежедневных взаимодействиях с коллегами.' },
        { type: 'list', items: [
          'touch base — связаться, обсудить кратко ("Let\'s touch base after the standup")',
          'loop someone in — включить кого-то в переписку/обсуждение ("Loop in the QA team on this bug")',
          'keep someone in the loop — держать в курсе ("Keep me in the loop on the deployment")',
          'take it offline — обсудить отдельно, не на общем митинге ("Let\'s take this discussion offline")',
          'circle back — вернуться к теме позже ("Let\'s circle back on this after the release")',
          'bandwidth — свободное время, ресурсы ("I don\'t have bandwidth for a new task right now")',
          'low-hanging fruit — простые задачи, быстрые победы ("Fix the low-hanging fruit bugs first")',
          'on my radar — в поле внимания ("That issue is on my radar")'
        ]},
        { type: 'warning', value: '"Bandwidth" в переносном смысле (время/возможности) очень часто используется в IT. Не путай с техническим значением (пропускная способность сети).' }
      ]
    },
    {
      id: 5,
      title: 'Idioms about quality and performance',
      type: 'theory',
      content: [
        { type: 'text', value: 'Качество кода и производительность — ключевые темы для разработчиков. Вот образные выражения из этой области.' },
        { type: 'list', items: [
          'under the hood — внутри, под капотом ("Let\'s look at what\'s happening under the hood")',
          'a quick win — быстрая победа, лёгкий результат ("Caching is a quick win for performance")',
          'bulletproof — пуленепробиваемый, надёжный ("We need bulletproof error handling")',
          'rubber stamp — одобрить без проверки ("Don\'t just rubber stamp the code review")',
          'polish something — довести до блеска, улучшить детали ("We need to polish the UI before launch")',
          'tech debt — технический долг ("We\'re paying off tech debt this sprint")',
          'go live — запустить в продакшн ("The new API goes live tomorrow")',
          'dogfooding — использовать собственный продукт ("We\'re dogfooding the new feature internally")'
        ]},
        { type: 'note', value: '"Dogfooding" происходит от фразы "eating your own dog food" — использовать свой собственный продукт. Это показывает доверие к тому, что ты создаёшь.' }
      ]
    },
    {
      id: 6,
      title: 'Practice: Idioms in context',
      type: 'practice',
      difficulty: 'medium',
      description: 'Заполни пропуски правильной идиомой из списка.',
      solution: 'Правильные ответы:\n1. get the ball rolling (начать процесс планирования)\n2. back to square one (вернуться к началу — баг не исправлен)\n3. reinvent the wheel (не изобретай велосипед — используй существующую библиотеку)\n4. loop in (включить команду DevOps в обсуждение)',
      tasks: [
        {
          question: 'We need to _____ on the new sprint planning. Who wants to start?',
          options: ['get the ball rolling', 'cut corners', 'touch base', 'go live'],
          correct: 0,
          explanation: '"Get the ball rolling" означает начать процесс. Здесь: начать планирование спринта.'
        },
        {
          question: 'The server crashed again. We\'re _____ with the bug fix.',
          options: ['ahead of schedule', 'back to square one', 'on the same page', 'up and running'],
          correct: 1,
          explanation: '"Back to square one" означает вернуться к началу, начать заново — когда исправление бага снова провалилось.'
        },
        {
          question: 'Don\'t _____ — use the existing authentication library.',
          options: ['hit the ground running', 'reinvent the wheel', 'think outside the box', 'go live'],
          correct: 1,
          explanation: '"Reinvent the wheel" — изобретать велосипед. Не нужно создавать то, что уже существует.'
        },
        {
          question: 'Please _____ the DevOps team on this deployment issue.',
          options: ['loop in', 'back burner', 'crunch', 'rubber stamp'],
          correct: 0,
          explanation: '"Loop in" — включить кого-то в обсуждение или переписку.'
        }
      ]
    },
    {
      id: 7,
      title: 'Practice: Translate idioms',
      type: 'practice',
      difficulty: 'medium',
      description: 'Объясни значение идиомы своими словами на русском и составь пример в IT-контексте.',
      solution: 'Примеры правильных ответов:\n1. hit the ground running: "I hit the ground running on the new project and completed the setup on day one."\n2. a can of worms: "Refactoring that legacy module opened a real can of worms — we found dozens of hidden bugs."\n3. on the back burner: "The mobile app feature is on the back burner until we finish the core API rewrite."',
      tasks: [
        {
          idiom: 'hit the ground running',
          context: '"The new developer hit the ground running and pushed code on day one."',
          translation: 'Сразу начать работу с полной отдачей, без раскачки',
          yourTurn: 'Составь предложение: ты начинаешь новый проект, используй эту идиому.'
        },
        {
          idiom: 'a can of worms',
          context: '"Changing the database schema opened a real can of worms."',
          translation: 'Ящик Пандоры — проблема, порождающая множество других проблем',
          yourTurn: 'Составь предложение про рефакторинг легаси-кода.'
        },
        {
          idiom: 'on the back burner',
          context: '"The mobile app is on the back burner until we fix the core API."',
          translation: 'Отложено на потом, не в приоритете',
          yourTurn: 'Составь предложение про фичу, которую отложили до следующего квартала.'
        }
      ]
    }
  ]
}
