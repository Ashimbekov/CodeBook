export default {
  id: 22,
  title: 'Письмо: Technical Blog Posts',
  description: 'Как писать технические статьи и посты в блог на профессиональном английском',
  lessons: [
    {
      id: 1,
      title: 'Зачем писать технические статьи',
      type: 'theory',
      content: [
        { type: 'text', value: 'Технические блоги — мощный инструмент для карьерного роста, обмена знаниями и вклада в сообщество. Умение писать по-английски многократно расширяет аудиторию.' },
        { type: 'heading', value: 'Типы технических статей' },
        { type: 'list', items: [
          'Tutorial: пошаговое руководство по конкретной задаче',
          'Explainer: объяснение концепции или технологии',
          'Case study: история реального проекта или проблемы',
          'Opinion/Editorial: аргументированная точка зрения',
          'Announcement: релиз проекта или функции',
          'Postmortem: разбор инцидента с уроками'
        ]},
        { type: 'heading', value: 'Структура успешного tech post' },
        { type: 'text', value: '"Hook: первые 2-3 предложения должны захватить внимание."\n"Problem: чётко определите проблему, которую решаете."\n"Solution: ваш подход и почему именно он."\n"Implementation: технические детали с примерами."\n"Results: что получилось, с измеримыми результатами если возможно."\n"Takeaways: ключевые выводы для читателя."' },
        { type: 'tip', value: 'Лучший tech blog post отвечает на вопрос, который сам автор когда-то не мог найти ответ. "Write the blog post you wish had existed when you were solving this problem."' }
      ]
    },
    {
      id: 2,
      title: 'Заголовки и введение: hook и promise',
      type: 'theory',
      content: [
        { type: 'text', value: 'Большинство читателей решают, читать ли статью, за первые 10 секунд — по заголовку и первому абзацу.' },
        { type: 'heading', value: 'Эффективные заголовки' },
        { type: 'text', value: '"How we reduced API latency by 300% using connection pooling" (результат + метод)\n"Why we migrated from MongoDB to PostgreSQL" (интрига + процесс)\n"The hidden cost of N+1 queries: a production postmortem" (боль + реальный случай)\n"Everything you need to know about JWT in 10 minutes" (обещание + временной масштаб)' },
        { type: 'heading', value: 'Типы hooks для введения' },
        { type: 'text', value: '"Problem hook: \'Every week, our engineering team spent hours debugging the same class of issue...\'" \n"Statistic hook: \'A 100ms delay in load time can decrease conversion by 7% (Amazon).\'" \n"Story hook: \'It was 2 AM when the pager went off. The payment service was down.\'"\n"Question hook: \'Have you ever wondered why your database queries are slow despite having proper indexes?\'"' },
        { type: 'heading', value: 'Promise — что обещает статья' },
        { type: 'text', value: '"In this post, I will walk you through..."\n"By the end of this article, you will understand..."\n"This post covers X, Y, and Z — practical techniques you can apply today."\n"We will explore the trade-offs between... and help you decide which is right for your use case."' }
      ]
    },
    {
      id: 3,
      title: 'Технические объяснения: ясность и примеры',
      type: 'theory',
      content: [
        { type: 'text', value: 'Хорошая техническая статья объясняет сложное просто, не упрощая суть.' },
        { type: 'heading', value: 'Уровни объяснения' },
        { type: 'text', value: '"Start with the intuition before the implementation."\n"Use analogies to introduce unfamiliar concepts."\n"Build complexity gradually — don\'t assume prior knowledge unless stated."\n"Include code examples that are minimal but complete enough to run."' },
        { type: 'heading', value: 'Переходы между разделами' },
        { type: 'text', value: '"Now that we understand X, let\'s look at how to implement it."\n"This raises an important question: what happens when Y?"\n"Before we dive into the implementation, let\'s consider the alternatives."\n"With this foundation, we can now tackle the more complex problem of..."' },
        { type: 'heading', value: 'Code examples best practices' },
        { type: 'text', value: '"Keep code examples focused — remove everything not relevant to the point."\n"Add comments in code only for non-obvious parts."\n"Show both the wrong approach and the correct one."\n"Include expected output where helpful: \'Running this code will output...\'"\n"Use realistic variable names, not foo/bar."' }
      ]
    },
    {
      id: 4,
      title: 'Tone и voice для tech content',
      type: 'theory',
      content: [
        { type: 'text', value: 'Tone в технических статьях определяет, насколько читатель вам доверяет и хочет читать дальше.' },
        { type: 'heading', value: 'Appropriate tone' },
        { type: 'text', value: '"Authoritative but approachable: you know your topic but don\'t condescend."\n"Honest about uncertainty: \'I\'m not certain why this happens, but my hypothesis is...\'" \n"Engaging: use \'we\' to include the reader: \'Let\'s explore this problem together.\'"\n"Precise but not pedantic: avoid unnecessary jargon."' },
        { type: 'heading', value: 'Избегайте' },
        { type: 'list', items: [
          'Passive voice overuse: prefer "I found X" over "X was found to be"',
          'Hedging every statement: don\'t be so cautious you say nothing',
          'Jargon without explanation: define terms the first time you use them',
          '"Obviously" and "simply": what\'s obvious to you may not be to the reader',
          'Overly long sentences: break complex ideas into smaller steps'
        ]},
        { type: 'tip', value: 'Voice test: read your article aloud. If it sounds unnatural, it probably reads that way too. Technical writing should be clear, not formal for its own sake.' }
      ]
    },
    {
      id: 5,
      title: 'SEO и discoverability для tech content',
      type: 'theory',
      content: [
        { type: 'text', value: 'Даже отличная статья не принесёт пользы, если её никто не найдёт.' },
        { type: 'heading', value: 'SEO basics for tech writers' },
        { type: 'text', value: '"Use descriptive titles that include the key technology or problem."\n"Include the main keyword naturally in the first paragraph."\n"Use subheadings (H2, H3) to structure content — they improve both SEO and readability."\n"Alt text for images: describe what the diagram shows."' },
        { type: 'heading', value: 'Distribution' },
        { type: 'text', value: '"Post on dev.to, Medium, or your company blog — all three for maximum reach."\n"Share on Hacker News, Reddit (r/programming), and relevant Slack communities."\n"Cross-posting: it\'s fine to post the same article on multiple platforms."\n"Add a canonical URL if cross-posting to avoid duplicate content issues."' },
        { type: 'heading', value: 'Calls to action' },
        { type: 'text', value: '"End with: \'What do you think? Leave a comment below.\'" \n"\'If this helped you, consider sharing it with your team.\'" \n"\'Found a mistake? Open an issue at [GitHub link].\'" \n"\'Want to discuss this further? Find me on Twitter at @handle.\'"' }
      ]
    },
    {
      id: 6,
      title: 'Практика: написание tech blog post',
      type: 'practice',
      difficulty: 'hard',
      description: 'Напишите полноценную техническую статью на заданную тему.',
      requirements: [
        'Hook в первом абзаце',
        'Чёткая структура с подзаголовками',
        'Минимум один code snippet или пример',
        'Takeaways в конце',
        'Длина: 300-400 слов',
        'Тема: "How to prevent N+1 queries in your ORM"'
      ],
      hint: 'Начните с проблемы (что такое N+1 и почему это плохо), потом решение (eager loading), code before/after, заключение.',
      solution: '# The Silent Performance Killer: How to Prevent N+1 Queries in Your ORM\n\nYou\'ve just deployed your application, and everything looks perfect in testing. Then production traffic hits, and suddenly your database server is struggling. The culprit? The insidious N+1 query problem.\n\n## What is the N+1 Problem?\n\nThe N+1 problem occurs when your application makes one database query to fetch a list of items, then makes N additional queries — one per item — to fetch related data. For example, fetching 100 blog posts and then making 100 separate queries to get the author of each post: that\'s 101 queries instead of 2.\n\n## The Problem in Practice\n\nConsider this Django code:\n\nposts = Post.objects.all()\nfor post in posts:\n    print(post.author.name)  # N separate queries here!\n\nThe ORM lazily loads the author relationship — triggering a separate SQL query for each post. With 1,000 posts, that\'s 1,001 database round trips.\n\n## The Solution: Eager Loading\n\nAlways prefetch related data when you know you\'ll need it:\n\nposts = Post.objects.select_related("author").all()\nfor post in posts:\n    print(post.author.name)  # No additional queries!\n\nselect_related generates a single JOIN query, fetching all data in one round trip.\n\n## Detecting N+1 in Your Codebase\n\n- Enable SQL query logging in development\n- Use Django Debug Toolbar or Bullet Gem (Rails) to visualise queries\n- Set a query count threshold in tests: if a request generates more than 10 queries, fail the test\n\n## Key Takeaways\n\n1. N+1 queries are invisible in development but devastating in production\n2. Always use eager loading (select_related, includes, joinedload) when accessing relationships in loops\n3. Make query detection part of your development workflow, not an afterthought\n\nHave you encountered N+1 problems in production? Share your war stories in the comments.',
      explanation: 'Техническая статья с хорошей структурой, конкретными примерами и чёткими takeaways — это вклад в сообщество, который строит репутацию и помогает другим. Начните писать — первая статья всегда самая сложная.'
    },
    {
      id: 7,
      title: 'Практика: редактирование и улучшение',
      type: 'practice',
      difficulty: 'medium',
      description: 'Улучшите предложенный черновик технической статьи.',
      requirements: [
        'Сделайте введение более захватывающим',
        'Упростите сложные предложения',
        'Добавьте конкретики (числа, примеры)',
        'Улучшите структуру'
      ],
      questions: [
        { text: 'DRAFT to improve:\n"Microservices are good. They have benefits. You can scale them. The architecture is modular. Different teams can work on different services. However, they also have some disadvantages like complexity and the need for more infrastructure. In conclusion, you should think carefully before choosing microservices."\n\nRewrite this as a proper opening paragraph for a tech blog post:', answer: 'When Netflix migrated from a monolith to microservices, they reduced deployment time from hours to minutes and achieved the ability to deploy hundreds of times per day. But microservices are not a silver bullet — for a team of five engineers, they might be the worst architectural decision you could make.\n\nIn this post, we\'ll explore when microservices genuinely solve problems and when they create more than they solve. By the end, you\'ll have a clear framework for evaluating whether microservices are right for your specific situation.', explanation: 'Исходный черновик слабый: общие утверждения без конкретики, короткие бессвязные предложения, нет hook. Улучшенная версия: конкретный пример (Netflix), создаёт напряжение (но не всем подходит), обещает ценность (framework для принятия решения).' }
      ],
      solution: 'Правильные ответы:\n1. When Netflix migrated from a monolith to microservices, they reduced deployment time from hours to minutes and achieved the ability to deploy hundreds of times per day. But microservices are not a silver bullet — for a team of five engineers, they might be the worst architectural decision you could ',
      hint: 'Используйте конкретные числа и примеры из реальных кейсов. Создайте tension в введении — проблема vs решение. Пообещайте читателю конкретную ценность.',
      explanation: 'Редактирование — половина работы при написании. Хорошая статья = хороший черновик + жёсткое редактирование. Убирайте всё лишнее, добавляйте конкретику.'
    }
  ]
}
