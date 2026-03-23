export default {
  id: 14,
  title: 'Used to + Would',
  description: 'Выражение прошлых привычек и состояний: used to, would, be/get used to.',
  lessons: [
    {
      id: 1,
      title: 'Used to: прошлые привычки и состояния',
      type: 'theory',
      content: [
        { type: 'text', value: 'USED TO + инфинитив — для действий или состояний, которые были регулярными в прошлом, но больше не происходят.\n\nФорма:\nУтвердительные: used to + инфинитив\nОтрицательные: didn\'t use to + инфинитив\nВопросительные: Did + подлежащее + use to + инфинитив?\n\nПривычки (которых больше нет):\nWe used to deploy manually — now we have CI/CD. (Раньше мы деплоили вручную — сейчас у нас CI/CD.)\nShe used to write code in Notepad. Now she uses VS Code. (Раньше она писала код в Блокноте. Сейчас она использует VS Code.)\nI used to use FTP to upload files. (Раньше я использовал FTP для загрузки файлов.)\n\nСостояния (которых больше нет):\nThere used to be no version control in this team. (Раньше в этой команде не было контроля версий.)\nThe codebase used to be a monolith. (Кодовая база раньше была монолитом.)' },
        { type: 'heading', value: 'Отрицание и вопросы' },
        { type: 'text', value: 'They didn\'t use to have code reviews. (Раньше у них не было код-ревью.)\nShe didn\'t use to know Python. (Раньше она не знала Python.)\n\nDid you use to write unit tests? (Раньше ты писал юнит-тесты?)\nDid the team use to work remotely? (Раньше команда работала удалённо?)' }
      ]
    },
    {
      id: 2,
      title: 'Would: повторяющиеся действия в прошлом',
      type: 'theory',
      content: [
        { type: 'text', value: 'WOULD + инфинитив — для действий (не состояний!), которые регулярно происходили в прошлом.\n\nВажно: would НЕ используется для состояний (know, believe, be, have и т.д.) — только для действий!\n\nПримеры:\nEvery morning, we would have a standup. (Каждое утро мы проводили стендап.)\nWhenever there was a bug, he would stay late to fix it. (Всякий раз когда был баг, он задерживался допоздна, чтобы исправить его.)\nThe team would deploy every Friday. (Команда деплоила каждую пятницу.)\nShe would manually test every feature before release. (Она вручную тестировала каждую функцию перед релизом.)' },
        { type: 'heading', value: 'Used to vs Would' },
        { type: 'text', value: 'Used to — для состояний И действий:\nI used to be a junior developer. (состояние — was, нельзя would)\nI used to write a lot of Java code. (действие)\n\nWould — только для действий:\nI would write a lot of Java code. (действие, но не состояние)\nHe would review every PR personally. (действие)\n\nНЕ правильно:\nI would be a junior developer. (состояние — только used to!)\nThere would be a monolith. (состояние — только used to!)' }
      ]
    },
    {
      id: 3,
      title: 'Be/Get Used to: привыкать',
      type: 'theory',
      content: [
        { type: 'text', value: 'BE USED TO + герундий/-ing — быть привычным к чему-то (уже привык)\nGET USED TO + герундий/-ing — привыкать к чему-то (процесс привыкания)\n\nВажно: после be/get used to всегда ГЕРУНДИЙ (-ing), а НЕ инфинитив!\n\nBE USED TO (уже привык):\nI\'m used to working with tight deadlines. (Я привык работать с жёсткими дедлайнами.)\nShe\'s used to getting code review feedback. (Она привыкла получать фидбек по код-ревью.)\nWe\'re used to daily standups. (Мы привыкли к ежедневным стендапам.)\n\nGET USED TO (привыкать):\nI\'m getting used to remote work. (Я привыкаю к удалённой работе.)\nHe got used to TypeScript after a month. (Он привык к TypeScript через месяц.)\nIt took time to get used to the new deployment process. (Потребовалось время, чтобы привыкнуть к новому процессу деплоя.)' }
      ]
    },
    {
      id: 4,
      title: 'IT-контекст: изменения в технологиях',
      type: 'theory',
      content: [
        { type: 'text', value: 'Описание эволюции в IT — отличная область для used to:\n\nWe used to store everything in SQL databases. Now we use both SQL and NoSQL. (Раньше мы хранили всё в SQL базах данных. Сейчас мы используем и SQL, и NoSQL.)\nDevelopers used to deploy manually via FTP. Now everything is automated. (Раньше разработчики деплоили вручную через FTP. Сейчас всё автоматизировано.)\nThere used to be no Docker — we configured servers manually. (Раньше не было Docker — мы настраивали серверы вручную.)\nTeams didn\'t use to do code reviews in many companies. (Раньше во многих компаниях не проводили код-ревью.)\nWe used to use SVN before switching to Git. (Мы использовали SVN до перехода на Git.)' },
        { type: 'heading', value: 'Диалог: ретроспектива' },
        { type: 'text', value: 'Junior: How did the team work before Agile?\nSenior: We used to follow the Waterfall model. We would plan everything in advance and then build for months.\nJunior: Sounds difficult. Were there code reviews?\nSenior: No, we didn\'t use to have proper code reviews. Developers would just push directly to the main branch.\nJunior: That must have caused a lot of bugs!\nSenior: It did. But over time, we got used to the new practices. Now I\'m used to doing daily standups and code reviews. I wouldn\'t go back.' }
      ]
    },
    {
      id: 5,
      title: 'Словарный запас: прошлые технологии и методы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Слова для описания технологической эволюции:\n\nlegacy (устаревший): legacy code, legacy system\nold-fashioned (старомодный): old-fashioned approach\ndeprecated (устаревший/нерекомендуемый): deprecated API\nobsolete (устаревший, вышедший из употребления): obsolete technology\nmodern (современный): modern frameworks\ncurrent (текущий): current best practices\ntraditional (традиционный): traditional deployment\nautomated (автоматизированный): automated testing\nmanual (ручной): manual testing\noutdated (устаревший): outdated dependencies\n\nФразы:\nIn the old days... (В прежние времена...)\nBack then... (Тогда...)\nIn the past... (В прошлом...)\nThings have changed a lot. (Многое изменилось.)\nWe\'ve come a long way. (Мы прошли долгий путь.)' }
      ]
    },
    {
      id: 6,
      title: 'Практика: used to или would?',
      type: 'practice',
      content: [
        { type: 'text', value: 'Вставьте used to или would (иногда оба варианты возможны — укажите оба).' },
        {
          type: 'exercise',
          subtype: 'fill_blank',
          items: [
            { id: 1, question: 'We ___ deploy code manually every time.', answer: 'used to / would' },
            { id: 2, question: 'The codebase ___ be a single monolith.', answer: 'used to (состояние, would нельзя)' },
            { id: 3, question: 'She ___ review every PR personally.', answer: 'used to / would' },
            { id: 4, question: 'There ___ not be any automated tests in this project.', answer: 'used to (не было = состояние)' },
            { id: 5, question: 'Whenever we had a bug, he ___ stay up all night to fix it.', answer: 'would / used to' },
            { id: 6, question: 'We ___ not have daily standups before Agile.', answer: 'didn\'t use to' },
            { id: 7, question: 'I ___ write all my code in plain text editors.', answer: 'used to / would' }
          ]
        }
      ]
    },
    {
      id: 7,
      title: 'Практика: Перевод',
      type: 'practice',
      content: [
        { type: 'text', value: 'Переведите на английский язык.' },
        {
          type: 'exercise',
          subtype: 'translation',
          items: [
            { id: 1, question: 'Раньше мы деплоили вручную каждую неделю.', answer: 'We used to deploy manually every week.' },
            { id: 2, question: 'В прошлом у нас не было CI/CD.', answer: 'We didn\'t use to have CI/CD. / There used to be no CI/CD.' },
            { id: 3, question: 'Я привык работать из дома.', answer: 'I\'m used to working from home.' },
            { id: 4, question: 'Ей потребовался месяц, чтобы привыкнуть к новому процессу.', answer: 'It took her a month to get used to the new process.' },
            { id: 5, question: 'Раньше вся команда использовала SVN, но потом перешла на Git.', answer: 'The whole team used to use SVN, but then switched to Git.' },
            { id: 6, question: 'Всякий раз, когда был баг, они бы немедленно его исправляли.', answer: 'Whenever there was a bug, they would fix it immediately.' }
          ]
        }
      ]
    }
  ]
}
