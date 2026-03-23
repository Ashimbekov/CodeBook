export default {
  id: 12,
  title: 'Связующие: however, although, despite, whereas',
  description: 'Discourse markers (связующие слова): как выражать контраст, уступку, причинность и добавление. Ключевые слова для B1-B2 writing и speaking.',
  lessons: [
    {
      id: 1,
      title: 'Что такое Discourse Markers и зачем они нужны',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Discourse markers (маркеры дискурса / связующие слова) — это слова и выражения, которые связывают идеи в тексте и речи, показывая логические отношения между ними.\n\nБез связующих слов:\n"Python is easy to learn. It is slow for computation-heavy tasks. It is popular in data science."\n\nСо связующими словами:\n"Python is easy to learn. However, it is slow for computation-heavy tasks. Despite this, it remains extremely popular in data science."\n\nОсновные группы дискурсных маркеров:\n1. Контраст/Уступка: however, although, though, even though, despite, in spite of, whereas, while, yet, nevertheless\n2. Добавление: moreover, furthermore, in addition, besides, also, what is more\n3. Причина/Следствие: therefore, thus, hence, as a result, consequently, because of this\n4. Порядок/Последовательность: firstly, secondly, finally, subsequently, then, after that\n5. Пример: for example, for instance, such as, namely, in particular\n6. Обобщение: in conclusion, overall, to sum up, in summary, on the whole'
        },
        {
          type: 'text',
          value: 'Почему это важно для IT-специалиста:\n- Написание технической документации\n- Email-переписка с клиентами и коллегами\n- Написание postmortem-отчётов\n- Технические презентации и объяснения\n- Выступления на конференциях\n- Собеседования на английском\n\nПример без маркеров vs с маркерами:\nБЕЗ: "Microservices improve scalability. They are complex. Teams need DevOps expertise. They increase operational overhead."\n\nС МАРКЕРАМИ: "Microservices significantly improve scalability. However, they introduce architectural complexity. Furthermore, teams need strong DevOps expertise. Consequently, the operational overhead increases considerably."'
        }
      ]
    },
    {
      id: 2,
      title: 'However, Nevertheless, Yet: контраст',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'HOWEVER (однако, тем не менее) — самый частый маркер контраста.\nПозиция: обычно в начале предложения после точки с запятой или после точки. Может стоять в середине предложения (тогда выделяется запятыми).\n\nMicroservices offer great flexibility. However, they require significant infrastructure investment.\nThe test failed. However, the error message helped us identify the issue quickly.\nThis approach is fast. However, it does not scale well beyond 10,000 users.\nThe library is powerful. However, it has a steep learning curve.\nWe missed the deadline. However, the delivered product exceeded the client\'s expectations.\n\nNEVERTHELESS (тем не менее — несмотря на ранее сказанное):\nThe system was under heavy load. Nevertheless, all requests were processed successfully.\nThe team had limited experience with Kubernetes. Nevertheless, they completed the migration on time.\n\nYET (однако, тем не менее — formal/literary):\nThe code is complex, yet it is well-documented.\nThe deadline was tight, yet the team delivered a quality product.'
        },
        {
          type: 'text',
          value: 'Позиции However в предложении:\n\n1. В начале (самое частое):\n"The bug was minor. However, it affected 20% of users."\n\n2. В середине (выделяется запятыми):\n"The bug was minor. It did, however, affect 20% of users."\n\n3. После точки с запятой:\n"The bug was minor; however, it affected 20% of users."\n\nВажно: However — наречие, не союз. Нельзя соединять им два предложения без знаков препинания:\nНЕВЕРНО: "The service is fast however it consumes a lot of memory."\nВЕРНО: "The service is fast. However, it consumes a lot of memory."\nВЕРНО: "The service is fast; however, it consumes a lot of memory."'
        }
      ]
    },
    {
      id: 3,
      title: 'Although, Though, Even though: уступительные союзы',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'ALTHOUGH / THOUGH / EVEN THOUGH — союзы (conjunctions), соединяют два предложения в одно. Выражают уступку: "несмотря на то, что..."\n\nAlthough = Though (взаимозаменяемы, although формальнее)\nEven though = более сильный контраст ("даже несмотря на то, что")\n\nПозиция: в начале предложения или в середине (переставляются):\n"Although Python is slow, it is popular in data science."\n= "Python is popular in data science, although it is slow."\n\nОтличие от However:\nHowever — соединяет ДВА отдельных предложения\nAlthough — соединяет части ОДНОГО предложения'
        },
        {
          type: 'text',
          value: 'Although / Though / Even though в IT:\n\n1. Although React has a steep learning curve, it is the most popular frontend framework.\n2. The deployment failed, although we had tested it in staging.\n3. Even though the code review took two days, it caught three critical bugs.\n4. We continued development, though the requirements kept changing.\n5. Though the database was under heavy load, all queries completed within SLA.\n6. Even though we had limited resources, we managed to deliver on time.\n7. Although the legacy codebase is messy, it serves millions of users reliably.\n8. The performance improved significantly, even though we only made minor changes.\n\nThough в конце предложения (разговорное — "правда, впрочем"):\n"The code review was thorough. It took three days, though."\n"The solution works. It\'s not elegant, though."\n"Kubernetes is powerful. It\'s complex to set up, though."'
        }
      ]
    },
    {
      id: 4,
      title: 'Despite, In spite of: предлоги уступки',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'DESPITE и IN SPITE OF — предлоги (prepositions), не союзы! После них идёт СУЩЕСТВИТЕЛЬНОЕ или -ING форма, не полное предложение.\n\nDespite = In spite of (взаимозаменяемы)\n\nФормулы:\nDespite + существительное: "Despite the challenges, we delivered on time."\nDespite + the fact that + предложение: "Despite the fact that we were understaffed, we delivered."\nDespite + -ing: "Despite having limited resources, we succeeded."\n\nОтличие от Although:\nAlthough + полное предложение\nDespite + существительное / -ing'
        },
        {
          type: 'text',
          value: 'IT-примеры с Despite / In spite of:\n\n1. Despite the complexity, the team completed the migration in two weeks.\n2. In spite of the tight deadline, the product quality was excellent.\n3. Despite having limited experience, she solved the performance issue efficiently.\n4. The system remained stable despite the unexpected traffic spike.\n5. In spite of several failed deployments, the team remained motivated.\n6. Despite the fact that the tests were failing, the product manager pushed for release.\n7. The legacy code worked surprisingly well, despite being written 10 years ago.\n8. In spite of the code freeze, an emergency hotfix was deployed.\n9. Despite heavy competition, our product gained significant market share.\n10. The microservices architecture performed well, despite the network latency.\n\nЧастая ошибка:\nНЕВЕРНО: "Despite we worked hard, we missed the deadline."\nВЕРНО: "Despite working hard, we missed the deadline."\nВЕРНО: "Despite our hard work, we missed the deadline."\nВЕРНО: "Although we worked hard, we missed the deadline."'
        }
      ]
    },
    {
      id: 5,
      title: 'Moreover, Furthermore, In addition: добавление',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Маркеры добавления усиливают или расширяют предыдущую мысль.\n\nMOREOVER (более того, к тому же) — добавляет более важный или удивительный аргумент:\n"The service is fast. Moreover, it uses 50% less memory than the previous version."\n\nFURTHERMORE (кроме того, помимо этого) — добавляет дополнительный аргумент того же уровня:\n"The code is well-tested. Furthermore, it is thoroughly documented."\n\nIN ADDITION (кроме того, вдобавок) — нейтральное добавление:\n"The new API is more efficient. In addition, it supports multiple authentication methods."\n\nADDITIONALLY (дополнительно) — схоже с in addition:\n"The performance improved. Additionally, memory consumption was reduced by 30%."\n\nWHAT IS MORE (более того) — разговорное усиление:\n"The solution worked. What is more, it was simpler than expected."'
        },
        {
          type: 'text',
          value: 'Разница в силе утверждения:\n\nIn addition = просто добавляем факт\nFurthermore = немного усиливаем\nMoreover = значительно усиливаем, удивительное дополнение\n\nПример с нарастанием:\n"TypeScript improves code quality. In addition, it provides better IDE support. Furthermore, it helps with refactoring in large codebases. Moreover, research shows that TypeScript projects have significantly fewer production bugs."\n\nIT-контекст:\n1. "The new database handles writes faster. Moreover, it has built-in sharding support."\n2. "Containerization improves portability. Furthermore, it simplifies the deployment process."\n3. "Code reviews catch bugs. In addition, they spread knowledge across the team."\n4. "The new framework is more performant. Additionally, it has a much larger community."\n5. "CI/CD reduces deployment risk. What is more, it speeds up the development cycle significantly."'
        }
      ]
    },
    {
      id: 6,
      title: 'Whereas, While: параллельный контраст',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'WHEREAS и WHILE (в значении "тогда как") используются для прямого сравнения двух противоположных вещей.\n\nОба — союзы (conjunctions), соединяют две части предложения.\n\nWHEREAS (тогда как, в то время как) — более формальный, чёткий контраст:\n"Python is easy to learn, whereas C++ requires significant expertise."\n"Microservices are independently deployable, whereas monoliths require full deployment."\n\nWHILE (тогда как — также значит "пока") — более гибкий, может иметь временное значение:\n"While the frontend team worked on the UI, the backend team built the API." (пока)\n"While React focuses on UI components, Angular is a full framework." (тогда как)'
        },
        {
          type: 'text',
          value: 'IT-примеры с Whereas и While:\n\n1. "SQL databases provide ACID compliance, whereas NoSQL databases prioritize scalability."\n2. "The old architecture was monolithic, whereas the new design uses microservices."\n3. "Junior developers focus on writing code, whereas senior developers spend more time on design and mentoring."\n4. "REST APIs use HTTP verbs, whereas GraphQL uses a single endpoint with query language."\n5. "Agile teams work in sprints, whereas waterfall teams follow a linear process."\n6. "Frontend code runs in the browser, while backend code runs on the server."\n7. "Interpreted languages like Python are easier to debug, while compiled languages like C++ are faster."\n8. "The legacy system could handle 100 requests per second, whereas the new architecture handles 10,000."\n\nWhile в начале (временное значение — контекст важен):\n"While the migration was running, the team monitored the logs." (пока — временное)\n"While the old API was simple, the new one is much more flexible." (тогда как — контраст)'
        }
      ]
    },
    {
      id: 7,
      title: 'Практика: технические тексты со связующими словами',
      type: 'practice',
      content: [
        {
          type: 'text',
          value: 'Добавьте подходящий связующий маркер:\n\n1. The new version is more efficient. _____, it is harder to configure.\n→ However\n\n2. _____ Python is slow, it is widely used in machine learning.\n→ Although / Even though\n\n3. The service uses fewer resources. _____, response times have improved.\n→ Moreover / Furthermore / In addition\n\n4. _____ the system failures, the team maintained a positive attitude.\n→ Despite / In spite of\n\n5. React focuses on the view layer, _____ Angular provides a complete MVC framework.\n→ whereas / while\n\n6. _____ working overtime, the team missed the deadline.\n→ Despite'
        },
        {
          type: 'text',
          value: 'Напишите технический параграф о выборе технологии, используя минимум 5 связующих слов:\n\nПример:\n"Choosing the Right Database for a High-Load System\n\nRelational databases like PostgreSQL provide strong consistency and complex querying capabilities. However, they can become a bottleneck under extreme write loads. NoSQL databases, whereas they sacrifice some consistency, can handle massive amounts of concurrent writes with ease. Despite their limitations, both types have valid use cases.\n\nIn addition to performance considerations, operational complexity matters. SQL databases have been around for decades; furthermore, the team\'s expertise with SQL is already strong. Although NoSQL databases are theoretically faster at scale, setting them up and maintaining them requires significant DevOps expertise. Despite this overhead, many high-traffic applications choose NoSQL for their core data storage.\n\nIn conclusion, the best approach is often to use both: SQL for transactional data where consistency is critical, and NoSQL for high-volume, low-latency data such as user sessions or event logs."'
        }
      ]
    }
  ]
}
