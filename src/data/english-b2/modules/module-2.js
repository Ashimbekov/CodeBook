export default {
  id: 2,
  title: 'Mixed Conditionals',
  description: 'Смешанные условные предложения для выражения сложных гипотетических ситуаций',
  lessons: [
    {
      id: 1,
      title: 'Обзор всех типов условных предложений',
      type: 'theory',
      content: [
        { type: 'text', value: 'Прежде чем изучать смешанные условные, убедимся, что основа прочная. В английском есть 4 основных типа условных предложений.' },
        { type: 'heading', value: 'Zero Conditional — всегда истинные факты' },
        { type: 'text', value: 'If + Present Simple, Present Simple\n"If the server receives no heartbeat, it marks the node as dead."\n"If memory usage exceeds 90%, the OOM killer terminates processes."' },
        { type: 'heading', value: 'First Conditional — реальное будущее' },
        { type: 'text', value: 'If + Present Simple, will + infinitive\n"If we merge this PR today, we will be able to deploy tonight."\n"If the tests fail, the pipeline will block the deployment."' },
        { type: 'heading', value: 'Second Conditional — нереальное настоящее/будущее' },
        { type: 'text', value: 'If + Past Simple, would + infinitive\n"If we had more engineers, we would ship features faster."\n"If I were the tech lead, I would refactor this entire module."' },
        { type: 'heading', value: 'Third Conditional — нереальное прошлое' },
        { type: 'text', value: 'If + Past Perfect, would have + Past Participle\n"If we had written proper tests, we would not have introduced this bug."\n"If the team had reviewed the PR carefully, they would have caught the security flaw."' },
        { type: 'tip', value: 'В IT-общении условные предложения встречаются постоянно: в code reviews ("If you extract this method..."), в planning ("If we adopt microservices..."), в incident analysis ("If we had had monitoring...").' }
      ]
    },
    {
      id: 2,
      title: 'Mixed Conditional: прошлое условие — настоящее следствие',
      type: 'theory',
      content: [
        { type: 'text', value: 'Первый тип смешанного условного — когда условие находится в прошлом, а следствие относится к настоящему. Это самый распространённый тип.' },
        { type: 'heading', value: 'Структура' },
        { type: 'text', value: 'If + Past Perfect (условие в прошлом), would + infinitive (следствие в настоящем)' },
        { type: 'heading', value: 'Примеры из IT' },
        { type: 'text', value: '"If we had chosen a monolithic architecture, we would be struggling with scaling now."\n(Если бы мы выбрали монолит в прошлом, сейчас мы бы страдали с масштабированием.)\n\n"If she had completed the DevOps course, she would be handling deployments independently now."\n(Если бы она прошла курс DevOps, она бы сейчас самостоятельно деплоила.)' },
        { type: 'tip', value: 'Ключевой признак этого типа: в прошлом что-то не случилось (или случилось) — и это влияет на текущую ситуацию. Часто в предложении есть "now", "today", "at the moment".' },
        { type: 'note', value: 'Реальный сценарий: "If we had invested in proper infrastructure earlier, we would not be dealing with these outages now." (Если бы мы раньше инвестировали в инфраструктуру, сейчас бы не было этих аварий.)' }
      ]
    },
    {
      id: 3,
      title: 'Mixed Conditional: настоящее условие — прошлое следствие',
      type: 'theory',
      content: [
        { type: 'text', value: 'Второй тип смешанного условного — когда условие находится в настоящем (воображаемое состояние), а следствие относится к прошлому.' },
        { type: 'heading', value: 'Структура' },
        { type: 'text', value: 'If + Past Simple (нереальное настоящее условие), would have + Past Participle (следствие в прошлом)' },
        { type: 'heading', value: 'Примеры из IT' },
        { type: 'text', value: '"If I were a better architect, I would have designed the system differently from the start."\n(Если бы я был лучшим архитектором — что не так — я бы спроектировал систему иначе изначально.)\n\n"If our team were more experienced, we would have avoided these rookie mistakes."\n(Если бы наша команда была опытнее — что не так — мы бы избежали этих ошибок новичков.)' },
        { type: 'tip', value: 'Ключевой признак этого типа: описывается воображаемое качество или состояние человека/команды в настоящем, и рассматривается, как бы это повлияло на прошлые события.' },
        { type: 'warning', value: 'Не путайте:\n"If I were more careful NOW, I would CHECK code better." (Second Conditional — и условие, и следствие в настоящем)\n"If I were more careful (by nature), I would have CAUGHT the bug last week." (Mixed — настоящее качество, прошлое следствие)' }
      ]
    },
    {
      id: 4,
      title: 'Mixed Conditionals с модальными глаголами',
      type: 'theory',
      content: [
        { type: 'text', value: 'В реальном общении вместо would часто используются другие модальные глаголы, что делает смешанные условные более разнообразными.' },
        { type: 'heading', value: 'Could в следствии' },
        { type: 'text', value: '"If we had built proper abstractions, we could be shipping features twice as fast now."\n(возможность в настоящем)\n\n"If I had learned Go earlier, I could have contributed to this project last year."\n(возможность в прошлом)' },
        { type: 'heading', value: 'Might в следствии' },
        { type: 'text', value: '"If the team had adopted CI/CD earlier, we might be less stressed about deployments now."\n(меньше уверенности, чем с would)' },
        { type: 'heading', value: 'Should в следствии' },
        { type: 'text', value: '"If the code were well-documented, you should be able to understand this module easily." (ожидание)' },
        { type: 'tip', value: 'Выбор модального глагола влияет на степень уверенности:\nwould > could > might\n(уверенность убывает слева направо)' }
      ]
    },
    {
      id: 5,
      title: 'Unless, provided that, as long as — альтернативы if',
      type: 'theory',
      content: [
        { type: 'text', value: 'В формальном и техническом английском часто используются альтернативные союзы условия.' },
        { type: 'heading', value: 'Unless = if not' },
        { type: 'text', value: '"The deployment will fail unless all tests pass."\n"Unless the team agrees on the API contract, we cannot proceed."' },
        { type: 'heading', value: 'Provided that / Providing that — при условии что' },
        { type: 'text', value: '"The system will scale horizontally, provided that the stateless design is maintained."\n"We can grant access, providing that the security audit is completed."' },
        { type: 'heading', value: 'As long as — пока / до тех пор, пока' },
        { type: 'text', value: '"The service remains stable as long as the database connections do not exceed the limit."\n"As long as we follow the coding standards, code reviews should be quick."' },
        { type: 'heading', value: 'On condition that — при условии' },
        { type: 'text', value: '"We will extend the deadline on condition that the scope is reduced."' },
        { type: 'tip', value: 'В технической документации и договорах these alternatives are very common. "Provided that" звучит особенно формально и часто встречается в RFC и API-документации.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: смешанные условные в code review',
      type: 'practice',
      difficulty: 'medium',
      description: 'Перефразируйте предложения, используя смешанные условные конструкции.',
      requirements: [
        'Используйте правильный тип смешанного условного',
        'Сохраните исходный смысл',
        'Обратите внимание на временной план условия и следствия'
      ],
      questions: [
        { text: 'We did not add caching. Now the API is slow.\n→ If ___', answer: 'If we had added caching, the API would not be slow now.', explanation: 'Прошлое условие (не добавили кэш) — настоящее следствие (сейчас медленно). Mixed Type 1.' },
        { text: 'I am not a senior engineer. I did not catch the architectural flaw.\n→ If ___', answer: 'If I were a senior engineer, I would have caught the architectural flaw.', explanation: 'Настоящее условие (не старший инженер) — прошлое следствие (не заметил проблему). Mixed Type 2.' }
      ],
      solution: 'Правильные ответы:\n1. If we had added caching, the API would not be slow now.\n2. If I were a senior engineer, I would have caught the architectural flaw.',
      hint: 'Определите: условие в прошлом или настоящем? Следствие в прошлом или настоящем? Это определит тип смешанного условного.',
      explanation: 'Смешанные условные позволяют говорить о ситуациях, когда причина и следствие находятся в разных временных планах. Это особенно полезно в техническом анализе и постмортемах.'
    },
    {
      id: 7,
      title: 'Практика: написание технического анализа',
      type: 'practice',
      difficulty: 'hard',
      description: 'Напишите технический анализ с использованием всех типов условных предложений.',
      requirements: [
        'Используйте минимум 2 смешанных условных',
        'Используйте минимум 1 альтернативный союз (unless/provided that/as long as)',
        'Контекст: анализ технического долга или прошлого архитектурного решения'
      ],
      hint: 'Начните с: "Looking back at our architecture decisions...", затем используйте условные для анализа последствий.',
      solution: 'Looking back at our architecture decisions from two years ago, several things become clear. If we had separated the authentication service from the beginning, we would not be dealing with these security vulnerabilities now. Had we adopted event-driven architecture from the start, the system could scale horizontally today without major refactoring. Furthermore, if our team were more experienced in distributed systems, we would have recognized these patterns earlier. Going forward, as long as we document our architectural decisions properly, future teams will be able to understand our reasoning. The system will remain maintainable provided that we address the identified technical debt within the next two quarters.',
      explanation: 'Технический анализ — идеальное место для смешанных условных. Они позволяют рассуждать о прошлых решениях и их текущих последствиях, что критически важно для ретроспектив и ADR-документов.'
    }
  ]
}
