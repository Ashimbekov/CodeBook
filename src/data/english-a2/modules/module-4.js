export default {
  id: 4,
  title: 'Present Perfect',
  description: 'Настоящее совершённое время: связь прошлого с настоящим, IT-примеры, have/has + V3.',
  lessons: [
    {
      id: 1,
      title: 'Present Perfect: форма и значение',
      type: 'theory',
      content: [
        { type: 'text', value: 'Present Perfect (настоящее совершённое) используется для:\n1. Действий в прошлом, результат которых важен сейчас\n2. Недавних действий (just)\n3. Опыта (ever/never)\n4. Действий, начавшихся в прошлом и продолжающихся (for/since)\n\nФорма: have/has + V3 (причастие прошедшего времени)\nI/You/We/They have (\'ve) + V3\nHe/She/It has (\'s) + V3\nОтрицание: have not (haven\'t) / has not (hasn\'t) + V3' },
        { type: 'heading', value: 'Примеры' },
        { type: 'text', value: 'I have deployed the app. (Я задеплоил приложение. — результат важен сейчас)\nShe has fixed the bug. (Она исправила баг. — только что, результат виден)\nWe have released version 3.0. (Мы выпустили версию 3.0.)\nHe has never used Kubernetes. (Он никогда не использовал Kubernetes.)\nHave you ever worked with microservices? (Ты когда-нибудь работал с микросервисами?)\nI haven\'t finished the code review yet. (Я ещё не закончил код-ревью.)' },
        { type: 'heading', value: 'IT-примеры' },
        { type: 'text', value: 'The team has merged the pull request. (Команда смержила pull request.)\nI have updated all the dependencies. (Я обновил все зависимости.)\nShe has written 50 unit tests. (Она написала 50 юнит-тестов.)\nWe have set up the CI/CD pipeline. (Мы настроили CI/CD пайплайн.)\nThe bug has been in production for a week. (Баг находится в продакшне уже неделю.)\nHave you pushed your changes? (Ты запушил свои изменения?)' }
      ]
    },
    {
      id: 2,
      title: 'Just, Already, Yet: маркеры времени',
      type: 'theory',
      content: [
        { type: 'text', value: 'JUST (только что) — действие произошло очень недавно\nПозиция: между have/has и глаголом\n\nI have just committed the changes. (Я только что закоммитил изменения.)\nShe has just finished the code review. (Она только что закончила код-ревью.)\nWe have just released the hotfix. (Мы только что выпустили хотфикс.)\n\nALREADY (уже) — действие выполнено раньше, чем ожидалось\nПозиция: между have/has и глаголом, или в конце\n\nI\'ve already fixed that bug. (Я уже исправил этот баг.)\nHave you already reviewed the PR? (Ты уже проверил PR?)\nShe has deployed the app already. (Она уже задеплоила приложение.)\n\nYET (ещё/уже) — в вопросах и отрицаниях\nПозиция: в конце предложения\n\nHaven\'t you fixed this yet? (Ты ещё не исправил это?)\nI haven\'t pushed my code yet. (Я ещё не запушил код.)\nHas the build finished yet? (Билд уже закончился?)' }
      ]
    },
    {
      id: 3,
      title: 'Ever, Never, For, Since: опыт и длительность',
      type: 'theory',
      content: [
        { type: 'text', value: 'EVER (когда-нибудь) / NEVER (никогда) — для выражения опыта\nПозиция: между have/has и глаголом\n\nHave you ever worked with AWS? (Ты когда-нибудь работал с AWS?)\nI have never used Rust before. (Я никогда раньше не использовал Rust.)\nHave you ever deployed to Kubernetes? (Ты когда-нибудь деплоил в Kubernetes?)\nShe has never fixed such a complex bug. (Она никогда не исправляла такой сложный баг.)' },
        { type: 'heading', value: 'FOR и SINCE: длительность действия' },
        { type: 'text', value: 'FOR (в течение) + период времени\nSINCE (с) + точка времени\n\nI have worked here for 3 years. (Я работаю здесь 3 года.)\nShe has been a developer for 5 years. (Она разработчик уже 5 лет.)\nWe have used this framework for 2 months. (Мы используем этот фреймворк 2 месяца.)\n\nI have worked here since 2021. (Я работаю здесь с 2021 года.)\nShe has been using Python since university. (Она использует Python с университета.)\nThe server has been down since midnight. (Сервер не работает с полуночи.)\nWe have been waiting for this feature since last year. (Мы ждём эту функцию с прошлого года.)' }
      ]
    },
    {
      id: 4,
      title: 'Present Perfect vs Past Simple',
      type: 'theory',
      content: [
        { type: 'text', value: 'Главное различие:\n- Present Perfect — связь с настоящим, без конкретного времени\n- Past Simple — конкретное время в прошлом\n\nPresent Perfect:\nI have fixed the bug. (Я исправил баг. — результат виден сейчас)\nWe have released the app. (Мы выпустили приложение. — факт без указания времени)\n\nPast Simple:\nI fixed the bug yesterday. (Я исправил баг вчера. — конкретное время)\nWe released the app last Friday. (Мы выпустили приложение в прошлую пятницу.)' },
        { type: 'heading', value: 'Сигнальные слова' },
        { type: 'text', value: 'Present Perfect НЕ используется с: yesterday, last week, in 2020, ago, when\n\nПравильно:\nI fixed it yesterday. (Past Simple)\nI deployed the app last week. (Past Simple)\n\nPresent Perfect используется с: just, already, yet, ever, never, recently, lately, today, this week/month/year, for, since\n\nI\'ve just fixed it. (только что)\nHave you ever used Docker? (когда-нибудь)\nI haven\'t finished yet. (ещё)' },
        { type: 'heading', value: 'Диалог' },
        { type: 'text', value: 'QA: Have you fixed the login bug? (Ты исправил баг с логином?)\nDev: Yes, I\'ve just pushed the fix. (Да, я только что запушил исправление.)\nQA: When did you fix it? (Когда ты его исправил?)\nDev: I fixed it an hour ago. (Я исправил его час назад.)\nQA: Great! Have you tested it yet? (Отлично! Ты уже протестировал это?)\nDev: I\'ve already tested it locally. But I haven\'t deployed it yet. (Я уже протестировал локально. Но ещё не задеплоил.)' }
      ]
    },
    {
      id: 5,
      title: 'Третья форма глаголов (V3)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Правильные глаголы: V3 = глагол + -ed (то же, что Past Simple)\nfix — fixed — fixed\ndeploy — deployed — deployed\ntest — tested — tested\nupdate — updated — updated\ncommit — committed — committed\ncheck — checked — checked\n\nНеправильные глаголы V3 для IT:\nwrite — wrote — written (написать: I have written the docs.)\nbuild — built — built (собрать: We have built the image.)\nfind — found — found (найти: She has found a bug.)\nrun — ran — run (запустить: I have run the tests.)\nbreak — broke — broken (сломать: The update has broken the API.)\nbring — brought — brought (принести)\nbegin — began — begun (начать: We have begun migration.)\nchoose — chose — chosen (выбрать: We have chosen React.)\nknow — knew — known (знать: I have known about this issue.)\nsee — saw — seen (увидеть: I have seen this error before.)\ngive — gave — given (дать: He has given good feedback.)' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Перевод',
      type: 'practice',
      content: [
        { type: 'text', value: 'Переведите на английский язык, используя Present Perfect.' },
        {
          type: 'exercise',
          subtype: 'translation',
          items: [
            { id: 1, question: 'Я задеплоил приложение.', answer: 'I have deployed the app.' },
            { id: 2, question: 'Мы только что смержили pull request.', answer: 'We have just merged the pull request.' },
            { id: 3, question: 'Ты уже написал тесты?', answer: 'Have you written the tests yet?' },
            { id: 4, question: 'Я ещё не проверил логи.', answer: 'I haven\'t checked the logs yet.' },
            { id: 5, question: 'Она никогда не работала с Docker.', answer: 'She has never worked with Docker.' },
            { id: 6, question: 'Мы используем этот фреймворк с 2022 года.', answer: 'We have used this framework since 2022.' },
            { id: 7, question: 'Ты когда-нибудь видел такую ошибку?', answer: 'Have you ever seen such an error?' },
            { id: 8, question: 'Баг находится в продакшне уже три дня.', answer: 'The bug has been in production for three days.' }
          ]
        }
      ]
    },
    {
      id: 7,
      title: 'Практика: Заполнить пропуски',
      type: 'practice',
      content: [
        { type: 'text', value: 'Вставьте правильную форму глагола (Present Perfect или Past Simple).' },
        {
          type: 'exercise',
          subtype: 'fill_blank',
          items: [
            { id: 1, question: 'I ___ (just / fix) the bug you reported.', answer: 'have just fixed' },
            { id: 2, question: 'She ___ (deploy) the app last night at 2 AM.', answer: 'deployed' },
            { id: 3, question: '___ you ever ___ (work) with Kubernetes?', answer: 'Have / worked' },
            { id: 4, question: 'We ___ (not release) the new version yet.', answer: 'haven\'t released' },
            { id: 5, question: 'The team ___ (already / review) your PR.', answer: 'has already reviewed' },
            { id: 6, question: 'I ___ (write) my first Python script in 2018.', answer: 'wrote' },
            { id: 7, question: 'How long ___ you ___ (use) this framework?', answer: 'have / used' },
            { id: 8, question: 'The server ___ (crash) three times this week.', answer: 'has crashed' }
          ]
        }
      ]
    },
    {
      id: 8,
      title: 'Практика: Исправление ошибок и написание',
      type: 'practice',
      content: [
        { type: 'text', value: 'Часть 1: Исправьте ошибки.' },
        {
          type: 'exercise',
          subtype: 'error_correction',
          items: [
            { id: 1, question: 'I have fixed the bug yesterday.', answer: 'I fixed the bug yesterday. (с "yesterday" используется Past Simple)' },
            { id: 2, question: 'Have you worked with AWS last year?', answer: 'Did you work with AWS last year? (конкретное время = Past Simple)' },
            { id: 3, question: 'She has never deployed to production last month.', answer: 'She never deployed to production last month. (конкретное время = Past Simple)' },
            { id: 4, question: 'I didn\'t finish the task yet.', answer: 'I haven\'t finished the task yet. (yet = Present Perfect)' }
          ]
        },
        { type: 'text', value: 'Часть 2: Напишите 3 предложения о своём опыте в IT, используя Present Perfect с ever/never/for/since.' },
        {
          type: 'exercise',
          subtype: 'writing',
          items: [
            { id: 1, question: 'Напишите о своём IT-опыте с have/has + ever/never/for/since', answer: 'Пример: I have worked with Python for 3 years. I have never used Go. Have you ever deployed to AWS?' }
          ]
        }
      ]
    }
  ]
}
