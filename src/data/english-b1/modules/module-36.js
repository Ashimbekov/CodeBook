export default {
  id: 36,
  title: 'Practice: Dialogues and Situations',
  description: 'Практика разговорных диалогов в IT-ситуациях: стендапы, код-ревью, митинги, переговоры о зарплате и онбординг.',
  lessons: [
    {
      id: 1,
      title: 'Daily standup dialogue',
      type: 'practice',
      description: 'Изучи диалог daily standup и напиши свой standup update.',
      solution: 'Структура standup:\n"Yesterday I [что сделал]..."\n"Today I\'m [что делаю]..."\n"[No blockers / I\'m blocked by...]..."\n\nПолезные фразы: "No blockers", "I\'m blocked by X", "EOD (End of Day)", "ping me", "pair on it".',
      content: [
        { type: 'text', value: 'Daily standup — самый частый тип коммуникации в команде. Три вопроса: что сделал, что делаю, есть ли блокеры.' }
      ],
      dialogue: {
        context: 'Утренний стендап команды из 4 человек.',
        script: [
          { speaker: 'Scrum Master', line: '"Good morning everyone. Let\'s do our standup. Who wants to go first?"' },
          { speaker: 'Alex', line: '"I\'ll go. Yesterday I finished the authentication middleware and merged PR #234. Today I\'m working on the password reset flow. No blockers."' },
          { speaker: 'Sarah', line: '"Yesterday I reviewed Alex\'s PR and worked on the user profile page. I\'m blocked actually — I need the design mockups for the settings page. Can someone follow up with the design team?"' },
          { speaker: 'Scrum Master', line: '"I\'ll reach out to them right after standup. Anyone else?"' },
          { speaker: 'Mike', line: '"Yesterday I spent most of my time debugging a memory leak in the payment service. Still investigating. Today I\'ll continue on that and try to get a fix by EOD. Might need help if I\'m still stuck by 2pm."' },
          { speaker: 'Scrum Master', line: '"Sounds good. Mike, ping me at 2pm and we\'ll pair on it if needed. Anything else? No? Great, have a good day everyone."' }
        ],
        phrases: ['"No blockers"', '"I\'m blocked"', '"follow up with"', '"EOD (End of Day)"', '"ping me"', '"pair on it"'],
        task: 'Напиши собственный standup update используя трёхчастную структуру и фразы из диалога.'
      }
    },
    {
      id: 2,
      title: 'Code review discussion',
      type: 'practice',
      description: 'Изучи диалог code review и разыграй аналогичный диалог.',
      solution: 'Ключевые фразы code review:\n"Go through [comments]" — обсудить замечания\n"The biggest thing is..." — главная проблема\n"You\'re right" — согласиться с замечанием\n"A bit generic" — слишком общее название\n"Once those are addressed" — после исправления\n"Happy to approve" — готов одобрить',
      dialogue: {
        context: 'Онлайн-встреча для обсуждения замечаний к PR.',
        script: [
          { speaker: 'Reviewer (Sam)', line: '"Hey, I left some comments on your PR. Do you have a few minutes to go through them?"' },
          { speaker: 'Author (Dana)', line: '"Sure, I saw them. Let me pull it up... okay, what\'s the main concern?"' },
          { speaker: 'Sam', line: '"The biggest thing is on line 47 — you\'re making a database call inside a loop. This could cause an N+1 problem if the list gets large."' },
          { speaker: 'Dana', line: '"Ah, you\'re right. I can fix that by fetching all the users in one query before the loop. Would a Map work for the lookup?"' },
          { speaker: 'Sam', line: '"Exactly, a Map would be perfect. And then there\'s a smaller thing — the function name getUserData is a bit generic. What do you think about fetchUserProfile?"' },
          { speaker: 'Dana', line: '"That\'s more descriptive, I agree. I\'ll update both. Thanks for the thorough review."' },
          { speaker: 'Sam', line: '"No problem. Once those are addressed, I\'m happy to approve."' }
        ],
        phrases: ['"go through them"', '"the biggest thing is"', '"you\'re right"', '"a bit generic"', '"once those are addressed"'],
        task: 'Разыграй аналогичный диалог: ревьюер находит проблему с безопасностью, автор предлагает решение.'
      }
    },
    {
      id: 3,
      title: 'Technical interview dialogue',
      type: 'practice',
      description: 'Изучи диалог технического интервью и отработай ответы.',
      solution: 'Ключевые фразы технического интервью:\n"Let me think about this..." — время подумать\n"My approach would be..." — описание подхода\n"The trade-off here is..." — компромиссы\n"Could you clarify...?" — уточнить вопрос\n"Let me walk you through..." — объяснить шаги',
      dialogue: {
        context: 'Техническое интервью по видеосвязи.',
        script: [
          { speaker: 'Interviewer', line: '"Let\'s start with a design question. How would you design a caching layer for a high-traffic read API?"' },
          { speaker: 'Candidate', line: '"Sure. Let me think about this for a moment. First, could you tell me more about the read patterns? Is it more random access or repetitive queries?"' },
          { speaker: 'Interviewer', line: '"Good question. Let\'s say 80% of reads hit the same 20% of data."' },
          { speaker: 'Candidate', line: '"That\'s a classic Pareto distribution — perfect for caching. My approach would be to add a Redis cache in front of the database. For the 80% repeated reads, we serve from cache. The trade-off is cache invalidation: when data changes, we need to decide between a write-through strategy or TTL-based expiration."' },
          { speaker: 'Interviewer', line: '"Interesting. What would you choose?"' },
          { speaker: 'Candidate', line: '"It depends on the consistency requirements. If we can tolerate slightly stale data, TTL is simpler. If consistency is critical, write-through is safer but adds latency on writes. Given this is a read API where freshness matters within a few seconds, I\'d go with a 30-second TTL and explicit invalidation on updates."' }
        ],
        phrases: ['"Let me think about this"', '"Good question"', '"My approach would be"', '"The trade-off is"', '"It depends on"'],
        task: 'Продолжи интервью: интервьюер спрашивает "What happens when the cache server fails?"'
      }
    },
    {
      id: 4,
      title: 'Explaining a bug to a non-technical person',
      type: 'practice',
      description: 'Изучи диалог объяснения бага нетехническому человеку.',
      solution: 'Правила объяснения технических проблем нетехнической аудитории:\n1. Используй аналогии из обычной жизни\n2. Избегай технического жаргона\n3. Объясни влияние на пользователя\n4. Назови примерные сроки решения\n5. Выражай уверенность, не панику',
      dialogue: {
        context: 'Разработчик объясняет баг продукт-менеджеру.',
        script: [
          { speaker: 'PM (Jordan)', line: '"The customer is reporting that their data disappeared after the update. What happened?"' },
          { speaker: 'Developer (Alex)', line: '"I found the issue. During the migration, there was a step that updated user IDs. Unfortunately, there was a bug in that step that caused some user records to become detached from their data."' },
          { speaker: 'Jordan', line: '"In plain English — what does that mean for the customer?"' },
          { speaker: 'Alex', line: '"Basically, think of it like a library catalog where someone changed the book numbers but forgot to update the index. The books are still there, but the catalog points to wrong places. The data isn\'t deleted, just temporarily inaccessible."' },
          { speaker: 'Jordan', line: '"Can it be recovered?"' },
          { speaker: 'Alex', line: '"Yes, we can fix it. I estimate 2-3 hours to write and test the recovery script. I\'d like to run it in staging first to make sure. Can we schedule a maintenance window tonight?"' },
          { speaker: 'Jordan', line: '"I\'ll let the customer know. How should I phrase it?"' },
          { speaker: 'Alex', line: '"Say that we identified the issue, the data is intact and not lost, and we\'re scheduled to restore access tonight. Avoid mentioning the technical details."' }
        ],
        task: 'Напиши похожий диалог: объясни нетехническому коллеге что такое "rate limiting" и почему пользователи видят ошибки.'
      }
    },
    {
      id: 5,
      title: 'Salary negotiation dialogue',
      type: 'practice',
      description: 'Изучи диалог переговоров о зарплате.',
      solution: 'Ключевые фразы salary negotiation:\n"Based on my research and experience..." — обоснование\n"I was hoping for something in the range of..." — называть диапазон\n"Is there flexibility in the offer?" — уточнить возможность\n"What\'s the total compensation package?" — полный пакет\n"I\'m excited about the role and believe I\'d bring significant value..." — позиция силы',
      dialogue: {
        context: 'Разговор с рекрутером об условиях работы.',
        script: [
          { speaker: 'Recruiter', line: '"We\'d like to make you an offer. The base salary we have in mind is $95,000."' },
          { speaker: 'Candidate', line: '"Thank you, I\'m excited about the opportunity. I was hoping for something closer to $105,000 based on my experience with distributed systems and the market data I\'ve seen for this role in this area."' },
          { speaker: 'Recruiter', line: '"I understand. I\'ll need to check if there\'s flexibility there. What\'s your current compensation, if you don\'t mind sharing?"' },
          { speaker: 'Candidate', line: '"I\'d rather focus on what\'s fair for this role. Based on my research, $105,000 is competitive for a senior engineer with this tech stack in this location."' },
          { speaker: 'Recruiter', line: '"Understood. We can go to $100,000. We also offer an equity package — 10,000 RSUs vesting over 4 years."' },
          { speaker: 'Candidate', line: '"That\'s a step in the right direction. I\'d also like to understand the review cycle — when would I be eligible for a raise?"' },
          { speaker: 'Recruiter', line: '"Annual reviews in December. Strong performers typically get 5-8% increases."' },
          { speaker: 'Candidate', line: '"That sounds reasonable. Can I have a day to review the full offer details and get back to you?"' }
        ],
        phrases: ['"I was hoping for"', '"based on my experience"', '"I\'d rather focus on"', '"a step in the right direction"', '"Can I have a day to..."'],
        task: 'Напиши диалог о переговорах по поводу удалённой работы (remote work policy).'
      }
    },
    {
      id: 6,
      title: 'Onboarding a new team member',
      type: 'practice',
      description: 'Изучи диалог онбординга нового члена команды.',
      solution: 'Ключевые фразы при онбординге:\n"Let me walk you through the codebase..."\n"Feel free to ask any questions..."\n"Our main tools are..."\n"The best way to get started is..."\n"Don\'t hesitate to reach out if you\'re stuck..."\n"We use X for [purpose]..."',
      dialogue: {
        context: 'Опытный разработчик помогает новичку в первый день.',
        script: [
          { speaker: 'New hire (Jordan)', line: '"I\'ve followed the onboarding doc, but I\'m stuck on the Docker setup. It\'s giving me a port conflict error."' },
          { speaker: 'Senior dev (Sam)', line: '"Welcome to week one! That\'s a classic. Can you share the error message?"' },
          { speaker: 'Jordan', line: '"It says: Error starting container: port 5432 is already in use."' },
          { speaker: 'Sam', line: '"Ah, you probably have PostgreSQL running locally. Run this to check: lsof -i :5432. You\'ll see what\'s using the port."' },
          { speaker: 'Jordan', line: '"Yes! It\'s a local postgres process. Should I stop it?"' },
          { speaker: 'Sam', line: '"Either stop the local one, or change the port in the docker-compose.yml. I\'d suggest changing the compose file — map it to 5433:5432. That way you can keep both running."' },
          { speaker: 'Jordan', line: '"That worked! Thanks. One more question — how does the team handle hotfixes to production?"' },
          { speaker: 'Sam', line: '"Good question. We have a hotfix process doc in Confluence — I\'ll send you the link. But the short version: create a branch from main, fix, PR with the \'hotfix\' label, get at least two approvals, then it goes through our fast-track CI pipeline."' }
        ],
        task: 'Разыграй диалог: новичок не понимает как работает CI/CD в компании, опытный коллега объясняет.'
      }
    },
    {
      id: 7,
      title: 'Production incident response dialogue',
      type: 'practice',
      description: 'Изучи диалог реагирования на production инцидент.',
      solution: 'Ключевые фразы incident response:\n"We have a P1 incident — [service] is down"\n"I\'m the incident commander for this"\n"Let\'s get on a call immediately"\n"What\'s the current status?"\n"ETA for resolution?"\n"I\'m rolling back the deployment"\n"Status update in 15 minutes"',
      dialogue: {
        context: 'Команда реагирует на критический инцидент в продакшне.',
        script: [
          { speaker: 'On-call engineer (Lee)', line: '"Attention team, we have a P1 incident. The payment service is returning 500 errors. Error rate is at 100% for the last 5 minutes."' },
          { speaker: 'Backend lead (Morgan)', line: '"On it. Let me pull up the logs. Lee, can you check if there were any deploys in the last hour?"' },
          { speaker: 'Lee', line: '"Yes, there was a deploy 12 minutes ago. Version 3.4.1."' },
          { speaker: 'Morgan', line: '"That\'s our culprit most likely. I\'m looking at the logs... found it. The new version has a null pointer exception when the billing address is missing."' },
          { speaker: 'Lee', line: '"Should we roll back?"' },
          { speaker: 'Morgan', line: '"Yes, let\'s roll back to 3.4.0 immediately. I\'ll also notify the customer support team to expect payment-related tickets. Lee, can you update the status page?"' },
          { speaker: 'Lee', line: '"On it. Status page updated: \'We are experiencing issues with payment processing. Our team is investigating.\'"' },
          { speaker: 'Morgan', line: '"Rollback complete. Monitoring... error rate dropping... back to 0. We\'re good. Thanks for the quick response everyone. I\'ll write up the post-mortem by tomorrow."' }
        ],
        phrases: ['"On it."', '"Let me pull up..."', '"That\'s our culprit"', '"Should we roll back?"', '"Rollback complete"'],
        task: 'Напиши похожий диалог для ситуации: сервис баз данных перестал отвечать в пятницу вечером.'
      }
    },
    {
      id: 8,
      title: 'Architecture discussion',
      type: 'practice',
      description: 'Изучи диалог архитектурного обсуждения.',
      solution: 'Ключевые фразы архитектурной дискуссии:\n"The trade-off here is..."\n"Have we considered...?"\n"What about scalability?"\n"The main concern I have is..."\n"This approach would work for... but not for..."\n"Let me draw this out..."',
      dialogue: {
        context: 'Команда обсуждает архитектурное решение.',
        script: [
          { speaker: 'Tech lead (Kim)', line: '"We need to decide on the approach for the real-time notifications. I see two options: WebSockets or Server-Sent Events."' },
          { speaker: 'Developer (Pat)', line: '"I\'d lean towards WebSockets since we might need bidirectional communication in the future."' },
          { speaker: 'Developer (Riley)', line: '"That\'s true, but for notifications specifically, we only need one direction — server to client. SSE is simpler and works better with HTTP/2."' },
          { speaker: 'Kim', line: '"Riley makes a good point. What about browser support?"' },
          { speaker: 'Riley', line: '"SSE has excellent browser support now — all modern browsers. IE11 is the only holdout, and we dropped support for it last year."' },
          { speaker: 'Pat', line: '"Fair enough. I was over-engineering it. SSE sounds like the right call for this use case."' },
          { speaker: 'Kim', line: '"Agreed. Let\'s go with SSE. Riley, can you write up a brief design doc? Just a page or two, covering the API contract and the reconnection strategy."' },
          { speaker: 'Riley', line: '"Sure, I\'ll have it ready by end of tomorrow."' }
        ],
        task: 'Разыграй диалог: команда выбирает между SQL и NoSQL базой данных для нового сервиса.'
      }
    },
    {
      id: 9,
      title: 'Remote team communication',
      type: 'practice',
      description: 'Изучи диалог коммуникации в распределённой команде.',
      solution: 'Ключевые фразы remote-коммуникации:\n"Just to confirm, we\'re aligned on..."\n"Can you share your screen?"\n"You\'re breaking up / I can\'t hear you"\n"Let\'s take this offline"\n"I\'ll follow up with notes after the call"\n"Async update in Slack/Confluence"',
      content: [
        { type: 'text', value: 'Особенности асинхронного общения в распределённых командах.' }
      ],
      scenarios: [
        {
          situation: 'Нужно передать контекст коллеге в другом часовом поясе.',
          badMessage: 'Can you check the bug?',
          goodMessage: 'Hey @Alex — when you get in, could you look at ticket BUG-342? The API returns a 500 when the postal code field is empty (even though it\'s marked optional). I\'ve added my investigation notes to the ticket. I think the issue is in the validation middleware (validate.js:156), but I want a second opinion. No rush — this isn\'t blocking anyone currently, but let\'s aim to fix it this week. Thanks!'
        },
        {
          situation: 'Ты хочешь перенести встречу.',
          badMessage: 'Can\'t make it to the meeting.',
          goodMessage: 'Hey team — I have a conflict and can\'t make our 3pm sync today. Could we move it to tomorrow 3pm, or Thursday 2pm? I\'ll update the calendar invite once we align on a time. If it\'s urgent, feel free to go ahead without me and share notes. Thanks for understanding!'
        }
      ]
    },
    {
      id: 10,
      title: 'Practice: Write your own dialogues',
      type: 'practice',
      description: 'Напиши собственные диалоги на основе изученных ситуаций.',
      solution: 'Критерии хорошего диалога:\n✓ Реалистичный IT-контекст\n✓ Профессиональная лексика\n✓ Фразы из урока\n✓ Логичная структура разговора\n✓ Решение проблемы или достижение цели\n\nПример тем: debug session, PR review, sprint planning, incident response.',
      content: [
        { type: 'text', value: 'Напиши диалог для следующих ситуаций (минимум 6 реплик каждый).' }
      ],
      tasks: [
        {
          scenario: 'Ты объясняешь джуниору разницу между синхронным и асинхронным кодом на JavaScript.',
          requirements: ['Используй аналогию для объяснения', 'Задай проверочный вопрос в конце', 'Покажи пример кода']
        },
        {
          scenario: 'Ты проводишь встречу с заказчиком, который хочет добавить новую фичу в конце спринта.',
          requirements: ['Вежливо отклони изменение скоупа', 'Объясни приоритизацию', 'Предложи альтернативный план']
        },
        {
          scenario: 'Ты обсуждаешь с рекрутером детали технической вакансии.',
          requirements: ['Уточни стек технологий', 'Спроси о размере команды', 'Узнай о процессе ревью кода']
        }
      ]
    }
  ]
}
