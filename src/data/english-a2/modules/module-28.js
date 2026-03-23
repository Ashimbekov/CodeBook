export default {
  id: 28,
  title: 'Listening: Simple Tech Talks',
  description: 'Понимание простых технических выступлений: структура, ключевые фразы, стратегии слушания.',
  lessons: [
    {
      id: 1,
      title: 'Стратегии понимания на слух',
      type: 'theory',
      content: [
        { type: 'text', value: 'Стратегии для понимания английской речи:\n\n1. Focus on keywords (сосредоточься на ключевых словах)\nНе нужно понимать каждое слово. Слушай ключевые существительные и глаголы.\n\n2. Use context (используй контекст)\nЕсли не понял слово, используй контекст предложения.\n\n3. Listen for transition words (слушай связующие слова)\nfirst, then, finally, however, because, so, but\n\n4. Notice intonation (обращай внимание на интонацию)\nГоворящий выделяет голосом важные слова.\n\n5. Don\'t stop at unknown words (не останавливайся на незнакомых словах)\nПродолжай слушать, слово может стать понятнее из контекста.\n\n6. Use repetition (используй повторы)\nПоставь на паузу и переслушай сложные части.' }
      ]
    },
    {
      id: 2,
      title: 'Структура технических выступлений',
      type: 'theory',
      content: [
        { type: 'text', value: 'Типичная структура tech talk:\n\nIntroduction (вступление):\n"Today I\'m going to talk about..."\n"In this talk, I will cover..."\n"My topic today is..."\n"By the end of this talk, you will understand..."\n\nBackground/Problem (контекст/проблема):\n"The problem we had was..."\n"Traditionally, teams would..."\n"The challenge with the old approach was..."\n\nSolution/Main content (решение):\n"We decided to..."\n"Our approach was to..."\n"The key idea is..."\n"Let me show you how..."\n\nResults/Benefits (результаты):\n"As a result..."\n"This allowed us to..."\n"We saw a [X]% improvement in..."\n"The benefits include..."\n\nConclusion:\n"To summarize..."\n"In conclusion..."\n"The main takeaway is..."\n"Any questions?"' }
      ]
    },
    {
      id: 3,
      title: 'Типичные фразы в tech talks',
      type: 'theory',
      content: [
        { type: 'text', value: 'Вводные фразы:\nLet me start with... (Позвольте начать с...)\nAs you can see... (Как вы можете видеть...)\nThis is important because... (Это важно потому что...)\nLet me give you an example. (Позвольте привести пример.)\nFor instance... (Например...)\n\nПереход к следующей теме:\nMoving on to... (Переходя к...)\nLet\'s now look at... (Теперь давайте рассмотрим...)\nAnother important aspect is... (Ещё один важный аспект...)\nNow let\'s talk about... (Теперь давайте поговорим о...)\n\nОбъяснение:\nWhat this means is... (Это означает...)\nIn other words... (Другими словами...)\nEssentially... (По сути...)\nBasically... (В основном...)\nTo put it simply... (Проще говоря...)' }
      ]
    },
    {
      id: 4,
      title: 'Прослушивание: стандарты и метрики',
      type: 'theory',
      content: [
        { type: 'text', value: 'Пример текста технического выступления:\n\n"Today I want to talk about how we improved our API performance by 300%.\n\nLet me start with the problem. Our API was very slow — average response time was 800 milliseconds. Users were complaining, and we were losing customers.\n\nSo what did we do? First, we profiled the application to find the bottlenecks. We found that 80% of the time was spent on database queries. Most queries were not optimized, and there was no caching.\n\nOur solution had three parts. First, we added indexes to the most common queries. Second, we implemented Redis caching for frequently accessed data. Third, we optimized the most expensive queries by rewriting them.\n\nThe results were impressive. Response time dropped from 800ms to 250ms — a 68% improvement. CPU usage decreased by 40%. And customer satisfaction increased significantly.\n\nThe main takeaway is: always measure first, then optimize. Don\'t guess where the bottleneck is — profile your code."\n\nКлючевые слова в тексте:\nbottleneck (узкое место), caching (кэширование), profiling (профилирование), indexes (индексы), response time (время ответа)' }
      ]
    },
    {
      id: 5,
      title: 'Понимание технических терминов на слух',
      type: 'theory',
      content: [
        { type: 'text', value: 'Часто встречающиеся в tech talks термины:\n\nАрхитектура:\nmicroservices (микросервисы), monolith (монолит), serverless (бессерверная архитектура), container (контейнер)\n\nПроизводительность:\nscale (масштабировать), optimize (оптимизировать), cache (кэш), latency (задержка)\n\nDevOps:\nCI/CD (непрерывная интеграция/доставка), deployment (деплой), pipeline (пайплайн), automation (автоматизация)\n\nДанные:\ndatabase (база данных), query (запрос), index (индекс), migration (миграция)\n\nКак догадаться о значении слова:\n1. Слушай соседние слова\n2. Обрати внимание на примеры, которые приводит спикер\n3. Технические слова часто похожи на русские (одного корня)\nconfiguration = конфигурация\noptimization = оптимизация\nautomation = автоматизация' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Текст для чтения и понимания',
      type: 'practice',
      content: [
        { type: 'text', value: 'Прочитайте текст технического выступления и ответьте на вопросы.\n\n"Good morning, everyone. Today I will talk about how we migrated from a monolithic architecture to microservices.\n\nWe started with a large monolith — a single application with over 500,000 lines of code. The problem was that deployments took 2 hours and affected the entire system. If one part failed, everything went down.\n\nWe decided to migrate to microservices. The process took 18 months. First, we identified the main domains: users, payments, notifications, and products. Then, we extracted each domain into a separate service with its own database.\n\nThe benefits were significant. Deployment time dropped from 2 hours to 10 minutes per service. Teams can now work independently. And failures are isolated — if the notifications service goes down, payments still work.\n\nHowever, microservices also brought new challenges: service discovery, distributed tracing, and managing multiple databases."' },
        {
          type: 'exercise',
          subtype: 'fill_blank',
          items: [
            { id: 1, question: 'What was the main problem with the monolith?', answer: 'Deployments took 2 hours and affected the entire system. If one part failed, everything went down.' },
            { id: 2, question: 'How long did the migration take?', answer: '18 months.' },
            { id: 3, question: 'How much did deployment time improve?', answer: 'From 2 hours to 10 minutes per service.' },
            { id: 4, question: 'What new challenges did microservices bring?', answer: 'Service discovery, distributed tracing, and managing multiple databases.' },
            { id: 5, question: 'Переведи: "Failures are isolated — if the notifications service goes down, payments still work."', answer: 'Сбои изолированы — если сервис уведомлений падает, платежи всё равно работают.' }
          ]
        }
      ]
    }
  ]
}
