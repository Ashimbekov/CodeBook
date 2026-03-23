export default {
  id: 17,
  title: 'IT: Agile, Scrum, Kanban',
  description: 'Словарь Agile методологий: sprint, backlog, standup, retrospective, user story, acceptance criteria, velocity и другие термины.',
  lessons: [
    {
      id: 1,
      title: 'Agile принципы и Manifesto',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'AGILE (гибкая методология) — подход к разработке ПО, основанный на итеративности, сотрудничестве и адаптивности.\n\nAgile Manifesto ценит:\n- Individuals and interactions over processes and tools\n- Working software over comprehensive documentation\n- Customer collaboration over contract negotiation\n- Responding to change over following a plan\n\nКлючевые принципы:\n- Iterative development (итеративная разработка)\n- Incremental delivery (постепенная доставка)\n- Self-organizing teams (самоорганизующиеся команды)\n- Continuous improvement (постоянное улучшение)\n- Customer feedback (обратная связь от клиента)\n\nКлючевые фразы:\n- "We follow an Agile approach."\n- "The team works in short iterations."\n- "We deliver working software every two weeks."\n- "We adapt our plan based on customer feedback."\n- "Agile allows us to respond to changing requirements."\n- "We prefer face-to-face communication over documentation."'
        },
        {
          type: 'text',
          value: 'Agile vs Waterfall (Водопад):\n\nWaterfall:\n"Waterfall follows a linear, sequential process: requirements → design → development → testing → deployment."\n"In waterfall, changes are expensive because they require revisiting earlier phases."\n"Waterfall works well for projects with fixed, well-understood requirements."\n\nAgile:\n"Agile works in short cycles called iterations or sprints."\n"Each sprint delivers a potentially shippable product increment."\n"Requirements can change between sprints — that\'s expected."\n"Agile works best when requirements evolve or the domain is complex."\n\nКомпромиссы:\n"Waterfall is predictable but inflexible, whereas Agile is flexible but harder to predict."\n"We switched from waterfall to Agile because requirements kept changing."\n"Agile requires disciplined teams and engaged stakeholders to work well."'
        }
      ]
    },
    {
      id: 2,
      title: 'Scrum: Sprint, Roles, Events',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'SCRUM — наиболее популярный Agile фреймворк.\n\nРоли в Scrum:\n- Product Owner (PO) — владелец продукта: приоритизирует backlog, представляет интересы бизнеса\n- Scrum Master (SM) — фасилитатор: помогает команде следовать Scrum, убирает препятствия\n- Development Team — кросс-функциональная команда 3-9 человек\n\nSPRINT (спринт) — итерация фиксированной длины, обычно 1-4 недели.\n\nКлючевые фразы о спринте:\n- sprint goal (цель спринта)\n- sprint duration / sprint length\n- current sprint / upcoming sprint\n- to complete a sprint\n- sprint velocity (скорость команды)\n- sprint capacity (пропускная способность)\n- to commit to a sprint\n- sprint increment (инкремент)\n\nExamples:\n1. "Our sprints are two weeks long."\n2. "The sprint goal is to deliver the user authentication feature."\n3. "We completed 34 story points in this sprint."\n4. "The team\'s average velocity is 30 story points per sprint."\n5. "We committed to 28 story points based on our capacity this sprint."\n6. "The sprint increment must be potentially shippable."'
        },
        {
          type: 'text',
          value: 'Scrum Events (церемонии):\n\n1. SPRINT PLANNING (планирование спринта):\n"The team selects items from the backlog and plans the sprint."\n"During planning, we estimate tasks using story points."\n"The sprint goal is defined during sprint planning."\n\n2. DAILY STANDUP (ежедневный стендап):\n"Each team member answers three questions: what did I do yesterday, what will I do today, do I have any blockers."\n"The standup should not exceed 15 minutes."\n"Blockers are identified in the standup but resolved outside of it."\n\n3. SPRINT REVIEW (обзор спринта):\n"The team demos completed work to stakeholders."\n"The sprint review collects feedback from stakeholders."\n"Unfinished stories are moved back to the backlog."\n\n4. RETROSPECTIVE (ретроспектива):\n"The team reflects on the process and identifies improvements."\n"What went well? What didn\'t go well? What can we improve?"\n"The retrospective is a safe space for honest feedback."'
        }
      ]
    },
    {
      id: 3,
      title: 'Backlog: Product и Sprint',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'BACKLOG (бэклог) — упорядоченный список всех предстоящих задач.\n\nPRODUCT BACKLOG — полный список всего, что нужно сделать для продукта.\nSPRINT BACKLOG — подмножество задач, выбранных для текущего спринта.\n\nКлючевые фразы:\n- to groom / refine the backlog\n- backlog item / backlog ticket\n- to prioritize the backlog\n- high/medium/low priority\n- to add to the backlog\n- to remove from the backlog\n- to move to the top of the backlog\n- backlog refinement session\n- product backlog items (PBIs)\n\nExamples:\n1. "The product owner prioritizes the backlog based on business value."\n2. "We hold weekly backlog refinement sessions to keep it up to date."\n3. "There are currently 150 items in the product backlog."\n4. "We moved the security fix to the top of the backlog."\n5. "The sprint backlog contains 12 user stories for this sprint."\n6. "Backlog grooming ensures stories are well-defined before sprint planning."'
        },
        {
          type: 'text',
          value: 'USER STORY (пользовательская история) — требование с точки зрения пользователя.\n\nФормат: "As a [role], I want to [action], so that [benefit]."\n\nExamples:\n1. "As a registered user, I want to reset my password, so that I can regain access to my account."\n2. "As an admin, I want to see all user activity, so that I can detect suspicious behaviour."\n3. "As a developer, I want an API endpoint for bulk operations, so that I can import data efficiently."\n\nACCEPTANCE CRITERIA (критерии приёмки) — условия, при которых история считается выполненной.\n\nФормат: "Given [context], when [action], then [expected result]."\n\nExamples:\n"Given a user is on the login page,\nWhen they submit valid credentials,\nThen they should be redirected to the dashboard and see a welcome message."\n\n"Given a user submits an invalid email,\nWhen the form is submitted,\nThen an error message should appear below the email field."'
        }
      ]
    },
    {
      id: 4,
      title: 'Estimation: Story Points, Velocity',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'STORY POINTS (очки истории) — относительная мера сложности/усилий задачи.\n\nВажно: story points — не часы работы, а относительная сложность.\n\nFibonacci sequence для оценки: 1, 2, 3, 5, 8, 13, 21, 40...\n\nКлючевые фразы:\n- to estimate in story points\n- to assign story points\n- to re-estimate\n- planning poker / scrum poker\n- story point consensus\n- estimation session\n\nExamples:\n1. "We estimate tasks using planning poker to get unbiased estimates."\n2. "This story is 8 points — it\'s complex and involves multiple systems."\n3. "We use the Fibonacci sequence to avoid false precision in estimates."\n4. "Everyone reveals their estimate simultaneously to prevent anchoring."\n5. "If estimates differ significantly, we discuss the discrepancy."\n\nVELOCITY (скорость) — количество story points, завершаемых за спринт.\n\nExamples:\n1. "Our team\'s velocity is 32 story points per sprint."\n2. "Velocity stabilizes after a few sprints as the team finds its rhythm."\n3. "We use velocity to forecast when the backlog will be completed."\n4. "A sudden drop in velocity indicates a problem — perhaps too many interruptions."'
        },
        {
          type: 'text',
          value: 'DEFINITION OF DONE (DoD) — когда задача считается завершённой.\n\nТипичный DoD:\n- Code written and reviewed\n- Unit and integration tests passing\n- Documentation updated\n- Deployed to staging and tested by QA\n- Acceptance criteria met\n- Product owner approved\n\nDEFINITION OF READY (DoR) — когда задача готова к работе.\n\nТипичный DoR:\n- User story is clearly written\n- Acceptance criteria are defined\n- Story is estimated\n- Dependencies are identified\n- Wireframes approved (if applicable)\n\nExamples:\n1. "A story is \'done\' only when it passes all acceptance criteria."\n2. "We won\'t start a story that doesn\'t meet the definition of ready."\n3. "The definition of done ensures consistent quality across all deliverables."\n4. "We updated our DoD to include security review after the recent vulnerability."'
        }
      ]
    },
    {
      id: 5,
      title: 'Kanban: доска и поток',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'KANBAN — визуальный метод управления работой с акцентом на потоке.\n\nОтличие от Scrum:\n"Kanban is continuous, whereas Scrum works in fixed sprints."\n"Kanban limits work in progress (WIP), Scrum limits by sprint capacity."\n"Kanban suits support and maintenance work; Scrum suits project-based work."\n\nKANBAN BOARD (Канбан доска):\nКолонки: To Do | In Progress | Review | Testing | Done\n\nWIP LIMIT (ограничение работы в процессе) — максимальное количество задач в колонке.\n\nКлючевые фразы:\n- to pull a ticket (взять задачу)\n- WIP limit\n- to block a ticket\n- lead time (время от начала до конца)\n- cycle time (время активной работы)\n- throughput (пропускная способность)\n- workflow (рабочий процесс)\n\nExamples:\n1. "We use Kanban for bug fixes and support tickets."\n2. "The WIP limit for \'In Progress\' is 3 per developer."\n3. "A ticket is blocked because we\'re waiting for a third-party API."\n4. "Our average cycle time is 2 days from start to deployment."\n5. "Kanban makes bottlenecks visible — the \'Review\' column is often overloaded."\n6. "We track throughput — how many tickets we complete per week."'
        },
        {
          type: 'text',
          value: 'SCRUM vs KANBAN — полное сравнение:\n\nSCRUM:\n- Fixed-length sprints (1-4 weeks)\n- Sprint commitments\n- Prescribed roles (PO, SM, Dev Team)\n- Sprint velocity\n- Works well for feature development\n\nKANBAN:\n- Continuous flow (нет спринтов)\n- No commitment to specific items\n- Flexible roles\n- Lead time and throughput metrics\n- Works well for support, maintenance\n\nSCRUMBAN — гибрид:\n"Some teams use Scrumban — Kanban board with regular sprint planning."\n\nФразы для выбора методологии:\n"We chose Scrum for the feature team and Kanban for the support team."\n"Scrum gives us predictability; Kanban gives us flexibility."\n"Despite using Scrum, we don\'t follow every ceremony strictly."\n"We adapted Agile practices to fit our team\'s needs."'
        }
      ]
    },
    {
      id: 6,
      title: 'Практика: Agile встречи и коммуникация',
      type: 'practice',
      content: [
        {
          type: 'text',
          value: 'Стандартные фразы для Agile встреч:\n\nDAILY STANDUP:\n"Yesterday I worked on the authentication module and merged two pull requests."\n"Today I\'m planning to finish the password reset feature and start on the email notifications."\n"I have a blocker — I\'m waiting for the API specification from the backend team."\n"No blockers, but I\'d like to pair with someone on the database design."\n\nSPRINT PLANNING:\n"I think this story is a 5 — it\'s straightforward but has a few edge cases."\n"I\'d say 8 points — we need to integrate with the payment provider, which is risky."\n"Can we break this story down? It feels too large for one sprint."\n"What are the acceptance criteria for this story?"\n"Are there any dependencies we should be aware of?"\n\nRETROSPECTIVE:\n"What went well: our code review process improved significantly this sprint."\n"What didn\'t go well: we had too many interruptions from support tickets."\n"Action item: let\'s create a support rotation so the whole team isn\'t interrupted."\n"I feel like our standups are too long — can we time-box them to 15 minutes?"'
        },
        {
          type: 'text',
          value: 'Напишите User Story с Acceptance Criteria:\n\nЗадание: Напишите User Story для функции "Поиск по продуктам".\n\nПример:\n"User Story:\nAs a logged-in customer, I want to search for products by name and category, so that I can quickly find what I\'m looking for without browsing through all products.\n\nAcceptance Criteria:\n1. Given a user is on the products page,\n   When they type in the search box,\n   Then results should update in real-time as they type.\n\n2. Given a user searches for a product,\n   When no results match,\n   Then the message \'No products found. Try a different search term.\' should appear.\n\n3. Given a user applies a category filter,\n   When combined with a search term,\n   Then only products matching both the search term and category should be shown.\n\nDefinition of Done:\n- Search functionality implemented and tested\n- Performance tested: results load within 200ms\n- Unit and integration tests written\n- QA approved in staging\n- Product owner signed off"'
        }
      ]
    },
    {
      id: 7,
      title: 'OKR, KPI, техническая документация',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'OKR (Objectives and Key Results) — система постановки целей:\n\nObjective (Цель) — вдохновляющая, качественная цель.\nKey Results (Ключевые результаты) — измеримые результаты, показывающие прогресс.\n\nПример технической OKR:\nObjective: "Improve the reliability of our payment service."\nKey Results:\n1. "Reduce payment failure rate from 2% to 0.5% by Q3."\n2. "Achieve 99.99% uptime for the payment service."\n3. "Reduce P95 latency from 500ms to 200ms."\n\nKPI (Key Performance Indicators) — ключевые показатели эффективности:\n"Our key KPIs are: monthly active users, response time, error rate, and conversion rate."\n\nTECHNICAL DOCUMENTATION терминология:\n- RFC (Request for Comments) — документ с предложением технического решения\n- ADR (Architecture Decision Record) — запись архитектурного решения\n- runbook — пошаговая инструкция для операционных задач\n- post-mortem — анализ инцидента после устранения\n- onboarding documentation — документация для новых сотрудников\n\nExamples:\n1. "Before implementing the new caching layer, we wrote an RFC to gather team feedback."\n2. "We document all significant architecture decisions as ADRs."\n3. "The runbook walks the on-call engineer through the recovery procedure step by step."\n4. "We wrote a comprehensive post-mortem after the database incident."'
        }
      ]
    }
  ]
}
