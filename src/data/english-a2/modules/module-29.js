export default {
  id: 29,
  title: 'Practice: Grammar A2',
  description: 'Практикум по грамматике A2: все времена, пассив, модальные глаголы, условные предложения.',
  lessons: [
    {
      id: 1,
      title: 'Present Simple vs Continuous — тест',
      type: 'practice',
            description: 'Выберите правильную форму глагола.',
      solution: 'Правильные ответы:\\n1. returns\\n2. am debugging\\n3. doesn\'t know\\n4. are deploying\\n5. is handling\\n6. writes\\n7. are currently migrating\\n8. doesn\'t return\\n9. runs\\n10. need',
content: [
        { type: 'text', value: 'Выберите правильную форму глагола.' },
        {
          type: 'exercise',
          subtype: 'fill_blank',
          items: [
            { id: 1, question: 'The API ___ (return/is returning) JSON by default.', answer: 'returns' },
            { id: 2, question: 'I ___ (debug/am debugging) a critical issue right now.', answer: 'am debugging' },
            { id: 3, question: 'She ___ (not know/is not knowing) how to use Kubernetes.', answer: 'doesn\'t know' },
            { id: 4, question: 'We ___ (deploy/are deploying) the new version this week.', answer: 'are deploying' },
            { id: 5, question: 'The server ___ (handle/is handling) 5000 RPS at the moment.', answer: 'is handling' },
            { id: 6, question: 'He always ___ (write/is writing) unit tests for his code.', answer: 'writes' },
            { id: 7, question: 'They ___ (currently migrate/are currently migrating) to AWS.', answer: 'are currently migrating' },
            { id: 8, question: 'This function ___ (not return/is not returning) the expected value.', answer: 'doesn\'t return' },
            { id: 9, question: 'The CI pipeline ___ (run/is running) tests on every push.', answer: 'runs' },
            { id: 10, question: 'I ___ (need/am needing) more time to finish this.', answer: 'need' }
          ]
        }
      ]
    },
    {
      id: 2,
      title: 'Past Simple vs Continuous — тест',
      type: 'practice',
            description: 'Вставьте глагол в правильной форме.',
      solution: 'Правильные ответы:\\n1. was fixing / found\\n2. was reviewing / failed\\n3. wrote\\n4. pushed / opened\\n5. were / working\\n6. succeeded\\n7. didn\'t know / happened\\n8. were deploying / was spiking\\n9. was building\\n10. ran / passed',
content: [
        { type: 'text', value: 'Вставьте глагол в правильной форме.' },
        {
          type: 'exercise',
          subtype: 'fill_blank',
          items: [
            { id: 1, question: 'While I ___ (fix) the bug, I ___ (find) another one.', answer: 'was fixing / found' },
            { id: 2, question: 'The team ___ (review) the PR when the CI ___ (fail).', answer: 'was reviewing / failed' },
            { id: 3, question: 'She ___ (write) the documentation last Monday.', answer: 'wrote' },
            { id: 4, question: 'I ___ (push) my changes and then ___ (open) a PR.', answer: 'pushed / opened' },
            { id: 5, question: 'What ___ you ___ (work) on when the server crashed?', answer: 'were / working' },
            { id: 6, question: 'The deployment ___ (succeed) — we celebrated!', answer: 'succeeded' },
            { id: 7, question: 'He ___ (not know) about the update when it ___ (happen).', answer: 'didn\'t know / happened' },
            { id: 8, question: 'We ___ (deploy) while the error rate ___ (spike).', answer: 'were deploying / was spiking' },
            { id: 9, question: 'She ___ (build) the Docker image all morning.', answer: 'was building' },
            { id: 10, question: 'I ___ (run) the tests, and they all ___ (pass).', answer: 'ran / passed' }
          ]
        }
      ]
    },
    {
      id: 3,
      title: 'Present Perfect — тест',
      type: 'practice',
            description: 'Вставьте глагол в Present Perfect.',
      solution: 'Правильные ответы:\\n1. have just deployed\\n2. has never used\\n3. Have / already reviewed\\n4. haven\'t released\\n5. has failed\\n6. has / worked\\n7. have worked\\n8. have just fixed\\n9. set up (Past Simple, конкретное время)\\n10. has completed',
content: [
        { type: 'text', value: 'Вставьте глагол в Present Perfect.' },
        {
          type: 'exercise',
          subtype: 'fill_blank',
          items: [
            { id: 1, question: 'I ___ (just / deploy) the app to production.', answer: 'have just deployed' },
            { id: 2, question: 'She ___ (never / use) Kubernetes before.', answer: 'has never used' },
            { id: 3, question: '___ you ___ (already / review) the PR?', answer: 'Have / already reviewed' },
            { id: 4, question: 'We ___ (not release) the new version yet.', answer: 'haven\'t released' },
            { id: 5, question: 'The build ___ (fail) three times today.', answer: 'has failed' },
            { id: 6, question: 'How long ___ she ___ (work) here?', answer: 'has / worked' },
            { id: 7, question: 'I ___ (work) at this company since 2020.', answer: 'have worked' },
            { id: 8, question: 'They ___ (just / fix) the critical security vulnerability.', answer: 'have just fixed' },
            { id: 9, question: 'We ___ (set up) the CI/CD pipeline last week.', answer: 'set up (Past Simple, конкретное время)' },
            { id: 10, question: 'The team ___ (complete) all sprint tasks!', answer: 'has completed' }
          ]
        }
      ]
    },
    {
      id: 4,
      title: 'Future: will vs going to — тест',
      type: 'practice',
            description: 'Вставьте правильную форму будущего времени.',
      solution: 'Правильные ответы:\\n1. \'ll fix (will fix)\\n2. are going to migrate\\n3. is going to go\\n4. will improve\\n5. ends / is going to end\\n6. \'ll ask\\n7. are going to release\\n8. will change\\n9. is going to present / is presenting\\n10. is going to crash',
content: [
        { type: 'text', value: 'Вставьте правильную форму будущего времени.' },
        {
          type: 'exercise',
          subtype: 'fill_blank',
          items: [
            { id: 1, question: 'A: The server is down! B: Don\'t worry, I ___ fix it! (спонтанное)', answer: '\'ll fix (will fix)' },
            { id: 2, question: 'We ___ migrate to microservices next quarter. (заранее спланировано)', answer: 'are going to migrate' },
            { id: 3, question: 'Look at the error rate — the service ___ go down! (видимый признак)', answer: 'is going to go' },
            { id: 4, question: 'I think this optimization ___ improve performance. (мнение)', answer: 'will improve' },
            { id: 5, question: 'The sprint ___ end on Friday. (расписание)', answer: 'ends / is going to end' },
            { id: 6, question: 'A: Need any help? B: Thanks, I ___ ask if I need it.', answer: '\'ll ask' },
            { id: 7, question: 'We ___ release version 3.0 in March. It\'s in the roadmap.', answer: 'are going to release' },
            { id: 8, question: 'In 5 years, AI ___ change software development completely. (предсказание)', answer: 'will change' },
            { id: 9, question: 'She ___ present the new architecture tomorrow. It\'s in the calendar.', answer: 'is going to present / is presenting' },
            { id: 10, question: 'The disk is 99% full — the server ___ crash!', answer: 'is going to crash' }
          ]
        }
      ]
    },
    {
      id: 5,
      title: 'Modal Verbs — тест',
      type: 'practice',
            description: 'Вставьте must, should, have to, don\\\'t have to, mustn\\\'t.',
      solution: 'Правильные ответы:\\n1. mustn\'t\\n2. should\\n3. must / have to\\n4. don\'t have to\\n5. has to / needs to\\n6. should\\n7. must (logical deduction)\\n8. don\'t have to\\n9. must\\n10. should',
content: [
        { type: 'text', value: 'Вставьте must, should, have to, don\'t have to, mustn\'t.' },
        {
          type: 'exercise',
          subtype: 'fill_blank',
          items: [
            { id: 1, question: 'You ___ push secrets to the repository. It\'s a security risk!', answer: 'mustn\'t' },
            { id: 2, question: 'You ___ write tests. It\'s optional but recommended.', answer: 'should' },
            { id: 3, question: 'All PRs ___ pass the CI checks before merging. (company rule)', answer: 'must / have to' },
            { id: 4, question: 'You ___ use this specific library — choose what works best.', answer: 'don\'t have to' },
            { id: 5, question: 'She ___ learn Go this month to work on the new service.', answer: 'has to / needs to' },
            { id: 6, question: 'The code ___ be well-documented. It\'s hard to maintain otherwise.', answer: 'should' },
            { id: 7, question: 'There ___ be a bug here — the tests are passing.', answer: 'must (logical deduction)' },
            { id: 8, question: 'You ___ attend the optional tech talk tomorrow.', answer: 'don\'t have to' },
            { id: 9, question: 'Data ___ be encrypted before storage. It\'s a legal requirement.', answer: 'must' },
            { id: 10, question: 'You ___ add more comments to make this code clearer.', answer: 'should' }
          ]
        }
      ]
    },
    {
      id: 6,
      title: 'Passive Voice — тест',
      type: 'practice',
            description: 'Преобразуйте в пассивный залог или вставьте правильную форму.',
      solution: 'Правильные ответы:\\n1. are run\\n2. was found\\n3. has already been approved\\n4. is encrypted\\n5. was cancelled\\n6. have been updated\\n7. was written\\n8. are stored\\n9. was completed\\n10. are being tested',
content: [
        { type: 'text', value: 'Преобразуйте в пассивный залог или вставьте правильную форму.' },
        {
          type: 'exercise',
          subtype: 'fill_blank',
          items: [
            { id: 1, question: 'Tests ___ (run) automatically on every commit. (Present Simple Passive)', answer: 'are run' },
            { id: 2, question: 'The bug ___ (find) by QA yesterday. (Past Simple Passive)', answer: 'was found' },
            { id: 3, question: 'The PR ___ (already approve). (Present Perfect Passive)', answer: 'has already been approved' },
            { id: 4, question: 'Data ___ (encrypt) using AES-256. (Present Simple Passive)', answer: 'is encrypted' },
            { id: 5, question: 'The deployment ___ (cancel) due to a critical bug. (Past Simple)', answer: 'was cancelled' },
            { id: 6, question: 'All services ___ (update) to the latest version. (Present Perfect)', answer: 'have been updated' },
            { id: 7, question: 'The documentation ___ (write) by the tech writer. (Past Simple)', answer: 'was written' },
            { id: 8, question: 'Logs ___ (store) for 90 days. (Present Simple)', answer: 'are stored' },
            { id: 9, question: 'The security audit ___ (complete) last week. (Past Simple)', answer: 'was completed' },
            { id: 10, question: 'The new API endpoints ___ (test) right now. (Present Continuous)', answer: 'are being tested' }
          ]
        }
      ]
    },
    {
      id: 7,
      title: 'First Conditional — тест',
      type: 'practice',
            description: 'Составьте условные предложения.',
      solution: 'Правильные ответы:\\n1. fail / won\'t deploy\\n2. will crash / don\'t restart\\n3. add / will appear\\n4. use / will be\\n5. finishes / will notify\\n6. will review / submit\\n7. runs / will stop\\n8. will succeed / fix\\n9. scale / won\'t handle\\n10. find / notify',
content: [
        { type: 'text', value: 'Составьте условные предложения.' },
        {
          type: 'exercise',
          subtype: 'fill_blank',
          items: [
            { id: 1, question: 'If the tests ___ (fail), we ___ (not deploy).', answer: 'fail / won\'t deploy' },
            { id: 2, question: 'The server ___ (crash) if you ___ (not restart) it.', answer: 'will crash / don\'t restart' },
            { id: 3, question: 'Unless you ___ (add) error handling, bugs ___ (appear).', answer: 'add / will appear' },
            { id: 4, question: 'If we ___ (use) caching, the app ___ (be) much faster.', answer: 'use / will be' },
            { id: 5, question: 'When the deployment ___ (finish), I ___ (notify) the team.', answer: 'finishes / will notify' },
            { id: 6, question: 'I ___ (review) your code if you ___ (submit) it by 5 PM.', answer: 'will review / submit' },
            { id: 7, question: 'If the database ___ (run) out of space, the app ___ (stop) working.', answer: 'runs / will stop' },
            { id: 8, question: 'The build ___ (succeed) if you ___ (fix) the syntax error.', answer: 'will succeed / fix' },
            { id: 9, question: 'Unless we ___ (scale) the service, we ___ (not handle) the load.', answer: 'scale / won\'t handle' },
            { id: 10, question: 'If you ___ (find) a critical bug, ___ (notify) the team immediately.', answer: 'find / notify' }
          ]
        }
      ]
    },
    {
      id: 8,
      title: 'Mixed Grammar — перевод',
      type: 'practice',
            description: 'Переведите предложения на английский язык.',
      solution: 'Правильные ответы:\\n1. While the team was having a meeting, the server crashed.\\n2. I have already deployed the app. You can check.\\n3. If the tests pass, we will deploy tonight.\\n4. The bug was found by the QA team last week.\\n5. You must write tests before opening a PR.\\n6. Go is faster than Python for network applications.\\n7. I enjoy solving complex technical problems.',
content: [
        { type: 'text', value: 'Переведите предложения на английский язык.' },
        {
          type: 'exercise',
          subtype: 'translation',
          items: [
            { id: 1, question: 'Пока команда проводила митинг, сервер упал.', answer: 'While the team was having a meeting, the server crashed.' },
            { id: 2, question: 'Я уже задеплоил приложение. Можешь проверить.', answer: 'I have already deployed the app. You can check.' },
            { id: 3, question: 'Если тесты пройдут, мы задеплоим сегодня вечером.', answer: 'If the tests pass, we will deploy tonight.' },
            { id: 4, question: 'Баг был найден QA командой на прошлой неделе.', answer: 'The bug was found by the QA team last week.' },
            { id: 5, question: 'Ты должен написать тесты перед открытием PR.', answer: 'You must write tests before opening a PR.' },
            { id: 6, question: 'Go быстрее Python для сетевых приложений.', answer: 'Go is faster than Python for network applications.' },
            { id: 7, question: 'Мне нравится решать сложные технические задачи.', answer: 'I enjoy solving complex technical problems.' }
          ]
        }
      ]
    },
    {
      id: 9,
      title: 'Исправление ошибок — всё',
      type: 'practice',
            description: 'Найдите и исправьте грамматические ошибки.',
      solution: 'Правильные ответы:\\n1. She knows the solution to this bug. (stative verb)\\n2. I fixed the bug yesterday. (конкретное время = Past Simple)\\n3. If the server crashes, we will roll back.\\n4. We need to avoid global variables.\\n5. The code was reviewed by the senior developer.\\n6. You don\'t have to write tests for this.\\n7. The build is faster than before.\\n8. We are deploying to production tomorrow.',
content: [
        { type: 'text', value: 'Найдите и исправьте грамматические ошибки.' },
        {
          type: 'exercise',
          subtype: 'error_correction',
          items: [
            { id: 1, question: 'She is knowing the solution to this bug.', answer: 'She knows the solution to this bug. (stative verb)' },
            { id: 2, question: 'I have fixed the bug yesterday.', answer: 'I fixed the bug yesterday. (конкретное время = Past Simple)' },
            { id: 3, question: 'If the server will crash, we will rollback.', answer: 'If the server crashes, we will roll back.' },
            { id: 4, question: 'We need to avoiding global variables.', answer: 'We need to avoid global variables.' },
            { id: 5, question: 'The code reviewed by the senior developer.', answer: 'The code was reviewed by the senior developer.' },
            { id: 6, question: 'You mustn\'t to write tests for this. (не обязательно)', answer: 'You don\'t have to write tests for this.' },
            { id: 7, question: 'The build is more fast than before.', answer: 'The build is faster than before.' },
            { id: 8, question: 'We are deploy to production tomorrow.', answer: 'We are deploying to production tomorrow.' }
          ]
        }
      ]
    },
    {
      id: 10,
      title: 'Написание текстов — всё',
      type: 'practice',
            description: 'Напишите тексты, используя грамматику A2.',
      solution: 'Примеры ответов:\\n1. Пример: I work as a backend developer. I usually write Python code and review pull requests. This week I am working on a new authentication feature. I am also learning Docker to improve our deployment...\\n2. Пример: Yesterday I fixed a critical bug in the payment service. Today I will write tests for the fix and open a PR. No blockers.\\n3. Пример: The server crashed at 2 AM. We were deploying an update when the database ran out of memory. The error was caused by a migration script. We rolled back to the previous version.',
content: [
        { type: 'text', value: 'Напишите тексты, используя грамматику A2.' },
        {
          type: 'exercise',
          subtype: 'writing',
          items: [
            { id: 1, question: 'Опишите свою работу: что вы делаете обычно (Present Simple) и что делаете прямо сейчас (Present Continuous). 4-5 предложений.', answer: 'Пример: I work as a backend developer. I usually write Python code and review pull requests. This week I am working on a new authentication feature. I am also learning Docker to improve our deployment process.' },
            { id: 2, question: 'Напишите стендап (вчера/сегодня/блокеры) на 3 предложения.', answer: 'Пример: Yesterday I fixed a critical bug in the payment service. Today I will write tests for the fix and open a PR. No blockers.' },
            { id: 3, question: 'Опишите инцидент: что произошло, когда и почему (Past Simple/Continuous). 3-4 предложения.', answer: 'Пример: The server crashed at 2 AM. We were deploying an update when the database ran out of memory. The error was caused by a migration script. We rolled back to the previous version.' }
          ]
        }
      ]
    }
  ]
}
