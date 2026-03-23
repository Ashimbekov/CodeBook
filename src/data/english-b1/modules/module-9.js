export default {
  id: 9,
  title: 'Relative Clauses (who, which, that, where)',
  description: 'Придаточные определительные предложения: как описывать людей, предметы и места, используя who, which, that, where, whose.',
  lessons: [
    {
      id: 1,
      title: 'Что такое Relative Clauses и зачем они нужны',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Relative Clauses (придаточные определительные) — это части предложения, которые уточняют или описывают существительное. Они начинаются с относительных местоимений.\n\nБез Relative Clause (два отдельных предложения):\n"The developer is John. He fixed the critical bug."\n\nС Relative Clause:\n"The developer who fixed the critical bug is John."\n\nОтносительные местоимения:\n- who / that — для людей (кто/который)\n- which / that — для вещей, животных, понятий (который/которая)\n- whose — принадлежность (чей/чья)\n- where — место (где/в котором)\n- when — время (когда)\n- why — причина (почему)'
        },
        {
          type: 'text',
          value: 'Основные примеры:\n\n1. Who (люди):\n"The engineer who wrote this code left the company."\n"The developer who fixed the bug deserves recognition."\n\n2. Which (вещи):\n"The framework which we use is built on React."\n"The error message which appeared in the logs was misleading."\n\n3. That (люди или вещи — неформально):\n"The tool that we use for monitoring is Datadog."\n"The engineer that reviewed my code gave helpful feedback."\n\n4. Whose (принадлежность):\n"The developer whose code caused the outage apologised to the team."\n"The company whose API we integrate with updated their endpoints."\n\n5. Where (место):\n"The data center where our servers are hosted is in Ireland."\n"The repository where we store the code is on GitHub."'
        },
        {
          type: 'tip',
          value: 'That можно использовать вместо who/which в определительных (defining) придаточных. Но в неопределительных (non-defining, с запятыми) — только who/which, не that.'
        }
      ]
    },
    {
      id: 2,
      title: 'Defining vs Non-defining Relative Clauses',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Два типа придаточных определительных:\n\nDEFINING (ограничительные, без запятых):\n— Уточняет, КАКОЙ именно из множества\n— Информация необходима для понимания\n— Убрав — предложение теряет смысл или становится неточным\n— Используем: who / which / that / whose / where\n\nNON-DEFINING (неограничительные, с запятыми):\n— Добавляет ДОПОЛНИТЕЛЬНУЮ информацию\n— Информация не обязательна для смысла\n— Убрав — предложение остаётся понятным\n— Используем: who / which / whose / where (НЕ that!)'
        },
        {
          type: 'text',
          value: 'Сравнение пар:\n\nDefining:\n"The microservice that handles payments was redesigned."\n(уточняем: именно тот, который обрабатывает платежи)\n\nNon-defining:\n"The payment microservice, which we launched last year, was redesigned."\n(это уже понятно о каком сервисе речь, запятые добавляют доп. инфо)\n\nDefining:\n"Developers who write tests are more valued by the team."\n(говорим о конкретной группе разработчиков — тех, кто пишет тесты)\n\nNon-defining:\n"John, who writes excellent tests, was promoted to tech lead."\n(мы уже знаем John — добавляем дополнительный факт о нём)\n\nDefining:\n"The error that occurred yesterday was caused by a null pointer exception."\n\nNon-defining:\n"The production outage, which lasted 45 minutes, affected 10,000 users."'
        },
        {
          type: 'note',
          value: 'В Non-defining нельзя использовать "that"! Это распространённая ошибка.\nНЕВЕРНО: "Docker, that was created by Solomon Hykes, changed DevOps."\nВЕРНО: "Docker, which was created by Solomon Hykes, changed DevOps."'
        }
      ]
    },
    {
      id: 3,
      title: 'Who, Which, That: правила выбора',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'WHO:\n— Только для людей\n— Defining и non-defining\n\n"The engineer who designed this architecture has 15 years of experience."\n"The developers who work remotely use async communication tools."\n"Alice, who has been with the company for 5 years, was promoted."\n\nWHICH:\n— Для вещей, идей, явлений (не для людей)\n— Defining и non-defining\n— В non-defining: ТОЛЬКО which (не that)\n\n"The tool which we chose for monitoring is open-source."\n"Kubernetes, which is maintained by the CNCF, is widely used."\n"The approach which I suggested was approved by the architect."\n\nTHAT:\n— Для людей И вещей\n— ТОЛЬКО в defining (без запятых)\n— НЕЛЬЗЯ в non-defining\n\n"The framework that we use is maintained by Facebook."\n"The developer that wrote this is no longer with the company."\n"The message that appeared in the logs pointed to a memory issue."'
        },
        {
          type: 'text',
          value: 'Когда можно опустить относительное местоимение?\n\nМожно опустить, когда оно является ДОПОЛНЕНИЕМ (объектом) в придаточном:\n\n"The PR (that/which) I submitted yesterday was approved." (that/which — дополнение)\nМожно: "The PR I submitted yesterday was approved."\n\n"The developer (who/that) we hired last month is excellent." (who/that — дополнение)\nМожно: "The developer we hired last month is excellent."\n\nНЕЛЬЗЯ опустить, когда является ПОДЛЕЖАЩИМ:\n"The script that runs the tests is broken." (that — подлежащее, нельзя убрать)\n"The engineer who fixed the bug deserves thanks." (who — подлежащее)'
        }
      ]
    },
    {
      id: 4,
      title: 'Whose, Where, When',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'WHOSE (чей/чья — принадлежность):\n— Для людей, организаций, а иногда вещей\n— Заменяет притяжательное местоимение (his, her, its, their)\n\n"The team whose project was cancelled needs reassignment."\n"The company whose infrastructure we manage is growing rapidly."\n"The developer whose PR has been open for two weeks should follow up."\n"The service whose response time exceeded SLA was flagged."\n"That\'s the engineer whose code review I always value."\n\nWHERE (где — место):\n"The data center where our primary database is hosted is in Frankfurt."\n"The repository where all the code is stored uses GitFlow branching."\n"The environment where we run tests is called staging."\n"The meeting room where we hold retrospectives has a whiteboard."\n\nWHEN (когда — время):\n"2020 was the year when the company went fully remote."\n"The moment when the server crashed was captured in the logs."\n"There are periods when traffic spikes significantly, usually on Monday mornings."'
        },
        {
          type: 'text',
          value: 'Замена Where на In which / At which:\n\nWhere можно заменить на "in which" или "at which":\n"The environment where/in which we deploy the app is managed by Terraform."\n"The server where/on which the database runs needs more RAM."\n\nЭти конструкции формальнее и чаще встречаются в технической документации:\n"The module in which the error occurred was the authentication service."\n"The sprint at which we introduced CI/CD was a turning point for the team."'
        }
      ]
    },
    {
      id: 5,
      title: 'Relative Clauses в IT-документации',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Придаточные определительные — незаменимый инструмент для технических описаний.\n\nОписание архитектуры:\n1. "The API gateway, which acts as the entry point for all client requests, handles authentication and routing."\n2. "The cache layer that sits between the application and the database significantly reduces load."\n3. "The load balancer distributes traffic to servers that are healthy and available."\n4. "The database cluster, which consists of one primary and two replicas, ensures high availability."\n\nОписание процессов:\n1. "The CI pipeline, which runs on every pull request, includes unit tests and static analysis."\n2. "Developers who merge code to main trigger an automatic deployment to staging."\n3. "The feature flag system allows us to enable features only for users who are in the beta group."\n4. "The monitoring system alerts the on-call engineer whose responsibility is to respond within 15 minutes."'
        },
        {
          type: 'text',
          value: 'Документация и комментарии в коде:\n1. "This function, which is called on every request, validates the JWT token."\n2. "The configuration file where database credentials are stored must not be committed to the repository."\n3. "Any developer who finds a security vulnerability should report it immediately."\n4. "The class that implements this interface must override all abstract methods."\n5. "The migration script, which was written by the DBA team, handles all schema changes."\n\nJob описания и профессиональный контекст:\n1. "We are looking for a developer who has experience with distributed systems."\n2. "The ideal candidate is someone whose background includes both backend and DevOps."\n3. "We need an engineer who can design systems that scale to millions of users."\n4. "The company, which was founded in 2015, now has offices in 12 countries."'
        }
      ]
    },
    {
      id: 6,
      title: 'Типичные ошибки',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Ошибка 1: That в non-defining clause\nНЕВЕРНО: "Kubernetes, that is an orchestration tool, is widely adopted."\nВЕРНО: "Kubernetes, which is an orchestration tool, is widely adopted."\n\nОшибка 2: Двойное подлежащее\nНЕВЕРНО: "The developer who he fixed the bug got a promotion."\nВЕРНО: "The developer who fixed the bug got a promotion."\n\nОшибка 3: Пропуск запятых в non-defining\nНЕВЕРНО: "Our CTO who joined last year introduced the new tech strategy."\nВЕРНО: "Our CTO, who joined last year, introduced the new tech strategy."\n\nОшибка 4: Which/Who для неодушевлённых/одушевлённых\nНЕВЕРНО: "The algorithm which was created by the researcher is brilliant." (OK, but who can work for creator)\nНЕВЕРНО: "The researcher which created the algorithm published a paper."\nВЕРНО: "The researcher who created the algorithm published a paper."'
        },
        {
          type: 'text',
          value: 'Ошибка 5: Whose для вещей\nЭто спорный момент, but formally:\nFormal: "The company whose servers went down lost data."\nНо иногда for things: "The application whose performance is poor needs optimisation." (допустимо, хотя некоторые предпочитают "the application, the performance of which is poor...")\n\nОшибка 6: Лишнее местоимение после where\nНЕВЕРНО: "The server where it hosts the database is in Frankfurt."\nВЕРНО: "The server where the database is hosted is in Frankfurt."\n\nОшибка 7: Which вместо What\nNon-defining which относится к конкретному существительному.\n"She solved the bug, which impressed everyone." (which = the fact that she solved it)\n"She solved the bug. This impressed everyone." (более чёткий вариант)'
        }
      ]
    },
    {
      id: 7,
      title: 'Практика: объединение предложений',
      type: 'practice',
      content: [
        {
          type: 'text',
          value: 'Объедините пары предложений с помощью Relative Clauses:\n\n1. "The developer left the company. He wrote the authentication module."\n→ The developer who wrote the authentication module left the company.\n\n2. "The framework is easy to learn. We use it for the frontend."\n→ The framework that/which we use for the frontend is easy to learn.\n\n3. "John was promoted. His code quality is always excellent."\n→ John, whose code quality is always excellent, was promoted.\n\n4. "The staging environment is managed by Terraform. We test in it."\n→ The staging environment where we test is managed by Terraform.\n\n5. "Docker changed DevOps. It was created by Solomon Hykes."\n→ Docker, which was created by Solomon Hykes, changed DevOps.\n\n6. "The startup recently closed. Its product was a code review tool."\n→ The startup, whose product was a code review tool, recently closed.'
        },
        {
          type: 'text',
          value: 'Добавьте подходящее относительное местоимение:\n\n1. The engineer _____ designed the new architecture is presenting tomorrow.\n→ who\n\n2. The bug _____ caused the outage was in the payment module.\n→ that / which\n\n3. The team _____ project was cancelled received severance pay.\n→ whose\n\n4. The office _____ the company was founded is now a museum.\n→ where\n\n5. Python, _____ syntax is clean and readable, is popular among data scientists.\n→ whose\n\n6. The sprint _____ we delivered the most value was Sprint 12.\n→ when / in which'
        }
      ]
    }
  ]
}
