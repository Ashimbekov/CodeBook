export default {
  id: 8,
  title: 'Reported Speech',
  description: 'Косвенная речь: как пересказывать слова других людей. Сдвиг времён, изменение местоимений, вопросы и просьбы в косвенной речи.',
  lessons: [
    {
      id: 1,
      title: 'Прямая речь vs Косвенная речь',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Прямая речь (Direct Speech) — точные слова человека в кавычках.\nКосвенная речь (Reported/Indirect Speech) — пересказ чужих слов без кавычек.\n\nПрямая речь: He said, "I will fix the bug tomorrow."\nКосвенная речь: He said (that) he would fix the bug the next day.\n\nВажные изменения при переходе в косвенную речь:\n1. Глагол речи: say → said, tell → told\n2. Сдвиг времён (backshift)\n3. Изменение местоимений (I → he/she, we → they)\n4. Изменение указательных слов (this → that, here → there, now → then)\n5. Изменение временных наречий (tomorrow → the next day, yesterday → the day before)'
        },
        {
          type: 'text',
          value: 'Разница между say и tell:\n- say: просто говорить (say something) / say to someone\n  He said (that) the server was down.\n  He said to me (that) the server was down.\n- tell: говорить кому-то (всегда с дополнением!)\n  He told me (that) the server was down.\n  She told the team (that) the sprint was delayed.\n\nНЕВЕРНО: He told that the server was down. (нет дополнения)\nВЕРНО: He told me / He said'
        }
      ]
    },
    {
      id: 2,
      title: 'Сдвиг времён (Backshift)',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'При переходе из прямой речи в косвенную времена сдвигаются "назад" в прошлое:\n\nPresent Simple → Past Simple\n"I work on the backend." → He said he worked on the backend.\n\nPresent Continuous → Past Continuous\n"We are deploying the update." → She said they were deploying the update.\n\nPast Simple → Past Perfect\n"We fixed the bug." → He told me they had fixed the bug.\n\nPresent Perfect → Past Perfect\n"I have never used Kubernetes." → She said she had never used Kubernetes.\n\nFuture (will) → would\n"We will release it next week." → He said they would release it the following week.\n\nFuture (going to) → was/were going to\n"We are going to refactor this." → She said they were going to refactor it.\n\nCan → could\n"I can help with the architecture." → He said he could help with the architecture.\n\nMay → might\n"It may cause issues." → She said it might cause issues.\n\nMust → had to\n"We must test this." → He said they had to test it.'
        },
        {
          type: 'text',
          value: 'Примеры IT-диалогов в косвенной речи:\n\nПрямая речь → Косвенная речь:\n\n1. "The API is down." → She reported that the API was down.\n2. "We have deployed the hotfix." → He said they had deployed the hotfix.\n3. "I will review your PR tomorrow." → She told me she would review my PR the next day.\n4. "We can\'t meet the deadline." → He admitted they couldn\'t meet the deadline.\n5. "The tests are failing." → She mentioned that the tests were failing.\n6. "I have been working on this for a week." → He said he had been working on it for a week.\n7. "We will need more time." → The team said they would need more time.\n8. "This approach may cause performance issues." → She warned that approach might cause performance issues.'
        },
        {
          type: 'note',
          value: 'Сдвиг времён не обязателен, если: (1) информация всё ещё актуальна и точна; (2) говорящий уверен в истинности высказывания. "She said the earth is round." (всегда истина — нет сдвига)'
        }
      ]
    },
    {
      id: 3,
      title: 'Изменение местоимений и наречий',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Местоимения изменяются в зависимости от контекста:\n\nI → he/she (зависит от пола)\nwe → they\nmy → his/her\nour → their\nyou → I / he/she (зависит от контекста)\nyour → my / his/her\n\nПримеры:\n"I will review your pull request," the tech lead said.\n→ The tech lead said he/she would review my pull request.\n\n"We have completed our part of the project," the team said.\n→ The team said they had completed their part of the project.\n\n"Can you fix this before the sprint ends?" she asked.\n→ She asked me if I could fix it before the sprint ended.'
        },
        {
          type: 'text',
          value: 'Изменение временных и указательных слов:\n\nПрямая речь → Косвенная речь:\nnow → then / at that moment\ntoday → that day\nyesterday → the day before / the previous day\ntomorrow → the next day / the following day\nthis week → that week\nnext week → the following week / the next week\nlast week → the previous week / the week before\nhere → there\nthis → that\nthese → those\n\nПримеры IT-ситуаций:\n"We will deploy this tomorrow."\n→ She said they would deploy that the following day.\n\n"I fixed the bug yesterday."\n→ He told me he had fixed the bug the day before.\n\n"The server is here in this data center."\n→ He explained that the server was there in that data center.'
        }
      ]
    },
    {
      id: 4,
      title: 'Косвенные вопросы',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Косвенные вопросы (Reported Questions) особенные: нет вспомогательного глагола в вопросительном порядке, порядок слов как в обычном предложении.\n\nОбщий вопрос (Yes/No) → if / whether:\nПрямая: "Have you tested this?"\nКосвенная: She asked if I had tested it.\nКосвенная: She asked whether I had tested it.\n\nСпециальный вопрос (Wh-) → сохраняем вопросительное слово:\nПрямая: "What caused the bug?"\nКосвенная: He asked what had caused the bug.\n\nПрямая: "When will the feature be ready?"\nКосвенная: She asked when the feature would be ready.\n\nПрямая: "How long have you been working on this?"\nКосвенная: He asked how long I had been working on that.'
        },
        {
          type: 'text',
          value: 'Важно: в косвенном вопросе НЕЛЬЗЯ использовать вопросительный порядок слов!\n\nНЕВЕРНО: She asked what was the error message.\nВЕРНО: She asked what the error message was.\n\nНЕВЕРНО: He wanted to know when would the deployment happen.\nВЕРНО: He wanted to know when the deployment would happen.\n\nНЕВЕРНО: She asked did I understand the requirements.\nВЕРНО: She asked if I understood the requirements.\n\nIT-примеры косвенных вопросов:\n1. The client asked whether the API was RESTful.\n2. The manager asked how many bugs we had fixed that sprint.\n3. She asked why the tests were failing.\n4. He wanted to know if the service could handle high traffic.\n5. The interviewer asked what technologies I had used in my previous job.\n6. She asked how long it would take to implement the feature.\n7. He asked whether I had experience with cloud providers.'
        }
      ]
    },
    {
      id: 5,
      title: 'Косвенные просьбы и приказы',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Просьбы и приказы в косвенной речи используют: ask/tell/order/request + to + V1\n\nПрямая речь (просьба): "Can you review my code?" / "Please review my code."\nКосвенная: She asked me to review her code.\n\nПрямая речь (приказ): "Fix this bug immediately!"\nКосвенная: He told me to fix the bug immediately.\n\nОтрицательная форма: asked/told + NOT to + V1\nПрямая: "Don\'t push to main directly."\nКосвенная: She told him not to push to main directly.\n\nПрямая: "Please don\'t close the ticket yet."\nКосвенная: He asked me not to close the ticket yet.'
        },
        {
          type: 'text',
          value: 'Глаголы для пересказа разных типов высказываний:\n\nДля утверждений: said, told, mentioned, explained, stated, reported, admitted, claimed, added, replied, announced\n\nДля просьб: asked, requested, begged, urged\n\nДля приказов/советов: told, ordered, instructed, advised, warned, reminded\n\nДля предложений: suggested, recommended, proposed\n\nДля вопросов: asked, wondered, wanted to know, inquired\n\nПримеры:\n1. The PM reminded the team to update the tickets in Jira.\n2. The architect advised us not to use a monolithic database.\n3. The client requested us to add an export feature.\n4. The tech lead warned the junior not to commit secrets to the repository.\n5. She suggested using a message queue to decouple the services.\n6. He urged the team to write documentation before the end of the sprint.'
        }
      ]
    },
    {
      id: 6,
      title: 'IT-ситуации: стендапы и митинги',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Пересказ стендапа:\n\nЧто было сказано (прямая речь):\nJohn: "I\'m working on the payment module. I will finish it by tomorrow. I need access to the staging environment."\nSarah: "I reviewed three pull requests yesterday. I\'m going to start on the search feature today."\nMike: "I found a critical bug in the authentication flow. I\'ll need help from the backend team."\n\nПересказ (косвенная речь):\nJohn said he was working on the payment module and would finish it the next day. He mentioned that he needed access to the staging environment.\nSarah said she had reviewed three pull requests the day before and was going to start on the search feature that day.\nMike said he had found a critical bug in the authentication flow and would need help from the backend team.'
        },
        {
          type: 'text',
          value: 'Пересказ встречи с клиентом:\n\nКлиент сказал (прямая речь):\n"We need the feature by next Friday. Can you guarantee this deadline? We are not happy with the current performance. Will you fix it in the next release?"\n\nПересказ (в отчёте/письме):\nThe client said they needed the feature by the following Friday. They asked whether we could guarantee that deadline. They mentioned they were not happy with the current performance and asked if we would fix it in the next release.\n\nОтвет команды:\nThe team leader told the client that we would do our best to meet the deadline. She explained that we had been working on performance improvements and would include them in the next release. She warned that some features might be delayed if performance fixes were prioritised.'
        }
      ]
    },
    {
      id: 7,
      title: 'Практика: пересказ IT-коммуникаций',
      type: 'practice',
      content: [
        {
          type: 'text',
          value: 'Переведите в косвенную речь:\n\n1. "The deployment failed at midnight," the engineer said.\n→ The engineer said the deployment had failed at midnight.\n\n2. "Can you write unit tests for this module?" the tech lead asked.\n→ The tech lead asked me to write unit tests for the module.\n\n3. "We will release the new API version next month," the PM announced.\n→ The PM announced that they would release the new API version the following month.\n\n4. "Don\'t commit to the main branch during the freeze," she told us.\n→ She told us not to commit to the main branch during the freeze.\n\n5. "How many story points have we completed this sprint?" the Scrum Master asked.\n→ The Scrum Master asked how many story points we had completed that sprint.\n\n6. "The bug may have been caused by a race condition," he suggested.\n→ He suggested that the bug might have been caused by a race condition.'
        },
        {
          type: 'text',
          value: 'Напишите письмо, пересказывающее встречу команды:\n\nСоставьте email вашему менеджеру о встрече:\n"Hi [Manager],\n\nI wanted to summarise the team meeting from this morning.\n\nThe lead developer mentioned that the authentication module was 80% complete. He said it would be ready for testing by Thursday. The QA engineer explained that she had already prepared the test cases and asked if she could access the staging environment.\n\nThe DevOps engineer warned that the current infrastructure might not handle the expected load during the launch. He suggested that we should run load tests before going live. He also reminded us not to deploy on Friday due to the holiday weekend.\n\nThe PM told us that the client had approved the new design mockups and wanted the prototype to be ready within two weeks.\n\nPlease let me know if you need any additional information.\n\nBest regards"'
        }
      ]
    }
  ]
}
