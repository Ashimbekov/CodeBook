export default {
  id: 11,
  title: 'Wish / If only',
  description: 'Конструкции Wish и If only: сожаление о настоящем, прошлом и желания изменить ситуацию. Особенности употребления в IT-контексте.',
  lessons: [
    {
      id: 1,
      title: 'Wish + Past Simple: желания о настоящем',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'WISH + Past Simple (или Past Continuous) выражает желание изменить ТЕКУЩУЮ ситуацию. Это нереальное желание — ситуация противоположна тому, что есть на самом деле.\n\nФормула: wish + подлежащее + V2 (Past Simple)\n\nОбратите внимание: используется Past Simple, хотя говорим о настоящем!\nА для глагола "to be" используем "were" для всех лиц (формально):\nI wish I were / he were / she were (формально)\nI wish I was / he was / she was (разговорно — тоже допустимо)'
        },
        {
          type: 'text',
          value: 'Примеры Wish + Past Simple (желания о настоящем):\n\nПрофессиональные:\n1. I wish I knew more about machine learning. (но не знаю)\n2. I wish we had better test coverage. (но покрытие плохое)\n3. I wish the codebase were cleaner. (но грязный)\n4. I wish we didn\'t have so much technical debt. (но есть)\n5. I wish I worked at a company that valued engineering culture. (но не ценит)\n6. I wish our deployment process were more automated. (но не автоматизировано)\n7. I wish I could understand this legacy code. (но не могу)\n\nЛичные:\n8. I wish I had more time to work on side projects.\n9. I wish remote work were more common at this company.\n10. I wish our meetings were shorter — most could be emails.\n11. I wish the documentation were up to date.'
        },
        {
          type: 'text',
          value: 'IF ONLY + Past Simple — то же значение, но более эмоционально:\n"If only we had more developers!" (Если бы только у нас было больше разработчиков!)\n"If only the CI pipeline were faster!" (Если бы только пайплайн был быстрее!)\n"If only I understood this architecture!" (Если бы только я понимал эту архитектуру!)\n\nWish + Past Continuous (желание изменить происходящее сейчас):\n"I wish you weren\'t working on such a tight deadline."\n"I wish the tests weren\'t taking so long to run."\n"I wish we were making more progress on this sprint."'
        }
      ]
    },
    {
      id: 2,
      title: 'Wish + Past Perfect: сожаление о прошлом',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'WISH + Past Perfect (had + V3) выражает СОЖАЛЕНИЕ о прошлом — что-то не произошло или произошло не так, как хотелось.\n\nФормула: wish + подлежащее + had + V3\n\nЗначение: "Жаль, что в прошлом..." / "Хотел бы, чтобы тогда..."\n\nПрошлое уже изменить нельзя — это сожаление, а не просьба.'
        },
        {
          type: 'text',
          value: 'Примеры Wish + Past Perfect (сожаление о прошлом):\n\n1. I wish we had written more tests before the refactoring.\n   (жаль, что не писали тесты — теперь всё сломалось)\n\n2. I wish we had documented the legacy API when we built it.\n   (жаль, что не документировали — теперь никто не понимает)\n\n3. I wish I had chosen a different tech stack.\n   (жаль, что выбрал именно это — теперь проблемы)\n\n4. The team wishes they had started the migration earlier.\n   (жаль, что тянули — теперь deadline горит)\n\n5. I wish someone had warned me about the breaking changes in this library.\n   (жаль, что никто не предупредил)\n\n6. I wish we hadn\'t rushed the development — now we have too many bugs.\n   (жаль, что торопились)\n\n7. If only we had backed up the database before running the migration!\n   (если бы только сделали бэкап!)\n\n8. If only we had used a more scalable architecture from the beginning.\n   (если бы только выбрали масштабируемую архитектуру)'
        },
        {
          type: 'tip',
          value: 'Wish + Past Simple = сожаление о НАСТОЯЩЕМ (можно изменить, но не меняется). Wish + Past Perfect = сожаление о ПРОШЛОМ (изменить уже нельзя). Как Third Conditional, но без "if" в начале.'
        }
      ]
    },
    {
      id: 3,
      title: 'Wish + would: желание изменить чужое поведение',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'WISH + would + V1 — особая конструкция для выражения:\n1. Раздражения по поводу чужих действий (или бездействия)\n2. Желания изменить поведение другого человека или вещи\n3. Просьбы изменить поведение (вежливо)\n\nВажно: НЕЛЬЗЯ использовать "I wish I would..." (не о себе!).\nИспользуем для ДРУГИХ людей или для вещей (it).\n\nФормула: wish + другое подлежащее + would + V1'
        },
        {
          type: 'text',
          value: 'Примеры Wish + Would (раздражение по поводу поведения):\n\n1. I wish my colleagues would write clearer commit messages.\n   (но они пишут что попало)\n\n2. I wish the PM would stop adding tickets mid-sprint.\n   (но продолжает добавлять)\n\n3. I wish someone would fix the flaky tests.\n   (но никто не берётся)\n\n4. I wish our clients would give us clear requirements from the start.\n   (но они постоянно меняют)\n\n5. I wish the CI pipeline would run faster.\n   (но медленно работает)\n\n6. I wish the team would follow the coding standards.\n   (но не следуют)\n\n7. I wish management would invest in technical debt reduction.\n   (но не вкладывают)\n\n8. I wish our users would read the documentation before reporting bugs.\n   (но пишут сразу в поддержку)'
        },
        {
          type: 'text',
          value: 'If only + would — то же, но более эмоционально:\n"If only management would listen to the engineers!"\n"If only the QA team would test edge cases more thoroughly!"\n"If only our third-party provider would improve their API documentation!"\n\nWish с it (о вещах/ситуациях):\n"I wish it would stop raining." (о погоде)\n"I wish this legacy code would refactor itself!" (юмор — о коде)\n\nСравнение трёх форм wish:\n"I wish I knew Rust." (Past Simple — не умею сейчас)\n"I wish I had learned Rust earlier." (Past Perfect — жаль, что не учил)\n"I wish they would write better docs." (Would — хочу, чтобы другие изменили поведение)'
        }
      ]
    },
    {
      id: 4,
      title: 'If only: усиленная эмоция',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'IF ONLY — то же самое, что WISH, но выражает более сильную, эмоциональную реакцию (отчаяние, сильное сожаление, страстное желание).\n\nГрамматические правила те же:\n- If only + Past Simple = желание о настоящем (нереальное)\n- If only + Past Perfect = сожаление о прошлом\n- If only + would = желание изменить поведение другого\n\nIf only обычно стоит в восклицательных предложениях или используется для выражения frustration.'
        },
        {
          type: 'text',
          value: 'Примеры If only в IT-контексте:\n\nIf only + Past Simple (о настоящем):\n1. "If only we had a dedicated DevOps team!"\n2. "If only this codebase were better documented!"\n3. "If only I had more time to learn new technologies!"\n4. "If only the budget allowed for proper infrastructure!"\n\nIf only + Past Perfect (сожаление о прошлом):\n1. "If only we had started the refactoring six months ago!"\n2. "If only someone had caught this bug before the release!"\n3. "If only we had designed the database schema more carefully!"\n4. "If only the team had communicated better — the project wouldn\'t have failed!"\n\nIf only + Would (желание изменить чужое поведение):\n1. "If only management would understand the importance of code quality!"\n2. "If only clients would stop changing requirements after development starts!"\n3. "If only the CI would run in under 10 minutes!"'
        },
        {
          type: 'text',
          value: 'Ретроспектива (Sprint Retrospective) — практический контекст:\n\nWHAT WENT WELL:\n"I\'m glad we had code review for every PR."\n"I\'m happy the new monitoring caught the issue early."\n\nWHAT COULD BE IMPROVED (используем Wish / If only):\n"I wish we had clearer acceptance criteria at the start of the sprint."\n"If only we had communicated the blockers earlier, we could have resolved them sooner."\n"I wish the automated tests covered more edge cases."\n"I wish we hadn\'t taken on too many story points."\n"If only we had spent more time on technical design before coding."'
        }
      ]
    },
    {
      id: 5,
      title: 'Связанные конструкции: I\'d rather, It\'s time',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Похожие конструкции, которые тоже используют Past Simple для нереального:\n\nI\'D RATHER + Past Simple (о другом человеке) — я бы предпочёл, чтобы ты...\n"I\'d rather you didn\'t push directly to main."\n"I\'d rather you discussed the design with the team first."\n"I\'d rather we waited for QA approval before deploying."\n\nI\'D RATHER + V1 (о себе) — я бы предпочёл...\n"I\'d rather work on the backend than the frontend."\n"I\'d rather use TypeScript than plain JavaScript."\n"I\'d rather fix this technical debt now than deal with it later."\n\nIT\'S TIME + Past Simple (или to + V1) — пора бы уже...\nWith Past Simple (= пора бы кому-то сделать):\n"It\'s time we refactored this module."\n"It\'s high time the team adopted proper testing practices."\n"It\'s about time someone fixed this critical bug."\n\nWith to + V1:\n"It\'s time to migrate to the new API version."\n"It\'s time to have a serious conversation about technical debt."'
        },
        {
          type: 'text',
          value: 'Примеры в профессиональном общении:\n\n1. "I\'d rather we didn\'t deploy on Fridays — it always causes issues on weekends."\n2. "It\'s high time we automated the testing process — manual testing is a bottleneck."\n3. "I\'d rather you raised this concern during planning, not mid-sprint."\n4. "It\'s time we invested in proper monitoring infrastructure."\n5. "I\'d rather the team understood the business requirements before writing code."\n6. "It\'s about time someone wrote documentation for this legacy service."\n7. "I\'d rather work in a smaller team with better processes than a large team with chaos."'
        },
        {
          type: 'note',
          value: '"It\'s high time" и "It\'s about time" — усиленные варианты "It\'s time", выражающие нетерпение или лёгкое раздражение: "Это давно пора было сделать!"'
        }
      ]
    },
    {
      id: 6,
      title: 'Практика: выражение сожалений и желаний',
      type: 'practice',
      content: [
        {
          type: 'text',
          value: 'Преобразуйте утверждения в предложения с Wish или If only:\n\n1. We don\'t have automated tests. (желание о настоящем)\n→ I wish we had automated tests.\n→ If only we had automated tests!\n\n2. We didn\'t document the API when we built it. (сожаление о прошлом)\n→ I wish we had documented the API when we built it.\n→ If only we had documented the API!\n\n3. My team doesn\'t follow code review standards. (раздражение)\n→ I wish my team would follow code review standards.\n\n4. The legacy code is very difficult to understand. (желание о настоящем)\n→ I wish the legacy code were easier to understand.\n\n5. We chose a monolithic architecture and now scaling is hard. (сожаление о прошлом)\n→ I wish we had chosen a more scalable architecture.\n→ If only we hadn\'t gone with the monolith!'
        },
        {
          type: 'text',
          value: 'Напишите 5 предложений о своей работе / учёбе, используя Wish, If only, I\'d rather и It\'s time:\n\nПример (IT-разработчик):\n1. "I wish our code review process were more efficient."\n2. "If only we had adopted TypeScript from the beginning — we have so many type errors now."\n3. "I wish management would prioritize technical debt reduction."\n4. "I\'d rather we used a microservices architecture for this project."\n5. "It\'s high time we implemented a proper monitoring solution."\n\nПодсказки для своих предложений:\n- Думайте о своём рабочем процессе, инструментах, коллегах\n- Что вы хотели бы изменить прямо сейчас?\n- О чём сожалеете из прошлого?\n- Что вас раздражает в поведении других?\n- Что давно пора сделать?'
        }
      ]
    }
  ]
}
