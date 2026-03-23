export default {
  id: 2,
  title: 'Past Simple vs Past Continuous',
  description: 'Прошедшее простое и прошедшее продолженное время: правила, неправильные глаголы, IT-контекст.',
  lessons: [
    {
      id: 1,
      title: 'Past Simple: завершённые действия',
      type: 'theory',
      content: [
        { type: 'text', value: 'Past Simple (прошедшее простое) используется для:\n- Завершённых действий в прошлом\n- Последовательных действий в прошлом\n- Привычек в прошлом\n\nФорма: глагол + -ed (правильные) или неправильная форма (неправильные глаголы)' },
        { type: 'heading', value: 'Структура' },
        { type: 'text', value: 'Утвердительные:\nI fixed the bug yesterday. (Я исправил баг вчера.)\nShe deployed the app last night. (Она задеплоила приложение прошлой ночью.)\nWe released version 2.0 last week. (Мы выпустили версию 2.0 на прошлой неделе.)\n\nОтрицательные: did not (didn\'t) + глагол (инфинитив)\nI didn\'t find the error. (Я не нашёл ошибку.)\nThe tests didn\'t pass. (Тесты не прошли.)\n\nВопросительные: Did + подлежащее + глагол?\nDid you commit your changes? (Ты закоммитил изменения?)\nDid the build succeed? (Билд прошёл успешно?)' },
        { type: 'heading', value: 'Важные неправильные глаголы для IT' },
        { type: 'text', value: 'write — wrote (написал): I wrote the documentation.\nbuild — built (собрал): She built the Docker image.\nfind — found (нашёл): He found a critical bug.\nrun — ran (запустил): We ran the tests.\ngive — gave (дал): She gave a code review.\nbreak — broke (сломал): The update broke the API.\nsend — sent (отправил): I sent the error logs.\nbring — brought (принёс): This change brought new issues.\nkeep — kept (сохранил): We kept the old version.\nmeet — met (встретился): We met the deadline.\ntake — took (занял/взял): The deployment took 2 hours.\nsee — saw (увидел): I saw the error in the logs.' }
      ]
    },
    {
      id: 2,
      title: 'Past Continuous: действия в процессе в прошлом',
      type: 'theory',
      content: [
        { type: 'text', value: 'Past Continuous (прошедшее продолженное) используется для:\n- Действий, которые происходили в конкретный момент в прошлом\n- Фонового действия (когда произошло другое действие)\n- Двух параллельных действий в прошлом\n\nФорма: was/were + глагол + -ing' },
        { type: 'heading', value: 'Структура' },
        { type: 'text', value: 'Утвердительные:\nI was debugging when the server crashed. (Я отлаживал, когда сервер упал.)\nShe was writing code at midnight. (Она писала код в полночь.)\nWe were reviewing the PR when the build failed. (Мы проверяли PR, когда билд упал.)\n\nОтрицательные: was not (wasn\'t) / were not (weren\'t) + -ing\nI wasn\'t paying attention to the logs. (Я не обращал внимания на логи.)\n\nВопросительные: Was/Were + подлежащее + -ing?\nWere you working from home yesterday? (Ты вчера работал из дома?)' },
        { type: 'heading', value: 'IT-примеры' },
        { type: 'text', value: 'The team was deploying the update when an error occurred. (Команда деплоила обновление, когда возникла ошибка.)\nI was testing the new feature all afternoon. (Я тестировал новую функцию весь день.)\nShe was fixing one bug while another appeared. (Она исправляла один баг, пока появился другой.)\nWe were migrating the database when the connection dropped. (Мы мигрировали базу данных, когда соединение прервалось.)' }
      ]
    },
    {
      id: 3,
      title: 'Simple vs Continuous: когда что использовать',
      type: 'theory',
      content: [
        { type: 'text', value: 'Классическая комбинация:\nПрошедшее продолженное (фон) + while/when + Past Simple (событие)\n\nWhile I was testing the app, I found a critical bug.\n(Пока я тестировал приложение, я нашёл критический баг.)\n\nThe server crashed while we were deploying the update.\n(Сервер упал, пока мы деплоили обновление.)\n\nShe called me when I was writing the unit tests.\n(Она позвонила мне, когда я писал юнит-тесты.)' },
        { type: 'heading', value: 'Последовательные действия — только Past Simple' },
        { type: 'text', value: 'Для последовательных действий используйте только Past Simple:\nI opened the terminal, ran the script, and checked the output.\n(Я открыл терминал, запустил скрипт и проверил вывод.)\n\nHe cloned the repository, created a branch, and made changes.\n(Он клонировал репозиторий, создал ветку и внёс изменения.)' },
        { type: 'heading', value: 'Сигнальные слова' },
        { type: 'text', value: 'Past Simple: yesterday, last night/week/month/year, ago (two days ago), in 2020, when (событие)\n\nPast Continuous: while, when (фон), at that moment, at 3 PM yesterday, all day/morning/evening' }
      ]
    },
    {
      id: 4,
      title: 'Диалоги: обсуждение прошлых событий',
      type: 'theory',
      content: [
        { type: 'text', value: 'Диалог 1: После инцидента на продакшне\n\nManager: What happened last night? (Что случилось вчера ночью?)\nDev: The server crashed at 2 AM. (Сервер упал в 2 ночи.)\nManager: What were you doing at that time? (Что ты делал в это время?)\nDev: I was monitoring the logs when I saw the error. (Я мониторил логи, когда увидел ошибку.)\nManager: How long did it take to fix? (Сколько времени ушло на исправление?)\nDev: It took about 30 minutes. I rolled back the deployment. (Около 30 минут. Я откатил деплой.)\n\nДиалог 2: Ретроспектива спринта\n\nAlice: Did you finish the authentication feature? (Ты закончил фичу аутентификации?)\nBob: Yes, I completed it on Wednesday. (Да, я завершил её в среду.)\nAlice: Were you working on it alone? (Ты работал над ней в одиночку?)\nBob: No, Sarah was helping me while I was writing tests. (Нет, Сара помогала мне, пока я писал тесты.)' }
      ]
    },
    {
      id: 5,
      title: 'Словарный запас: IT-действия в прошлом',
      type: 'theory',
      content: [
        { type: 'text', value: 'Полезные выражения в Past Simple:\n\nI pushed my changes. (Я запушил изменения.)\nWe merged the pull request. (Мы смержили pull request.)\nThe test suite failed. (Тесты не прошли.)\nI reverted the commit. (Я откатил коммит.)\nShe refactored the module. (Она отрефакторила модуль.)\nWe released a hotfix. (Мы выпустили хотфикс.)\nThe build succeeded. (Билд прошёл успешно.)\nI resolved the merge conflict. (Я разрешил конфликт слияния.)\nHe reviewed my code. (Он проверил мой код.)\nWe updated the dependencies. (Мы обновили зависимости.)' },
        { type: 'heading', value: 'Выражения для описания инцидентов' },
        { type: 'text', value: 'The system went down at... (Система упала в...)\nThe issue started when... (Проблема началась когда...)\nWe discovered the bug... (Мы обнаружили баг...)\nThe deployment failed because... (Деплой провалился потому что...)\nWe rolled back to the previous version. (Мы откатились к предыдущей версии.)\nThe incident was resolved at... (Инцидент был разрешён в...)' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Перевод',
      type: 'practice',
      content: [
        { type: 'text', value: 'Переведите предложения на английский язык.' },
        {
          type: 'exercise',
          subtype: 'translation',
          items: [
            { id: 1, question: 'Вчера я нашёл критический баг в продакшне.', answer: 'Yesterday I found a critical bug in production.' },
            { id: 2, question: 'Пока команда проводила митинг, сервер упал.', answer: 'While the team was having a meeting, the server crashed.' },
            { id: 3, question: 'Мы смержили pull request прошлым вечером.', answer: 'We merged the pull request last night.' },
            { id: 4, question: 'Что ты делал, когда появилась ошибка?', answer: 'What were you doing when the error appeared?' },
            { id: 5, question: 'Она писала тесты весь день вчера.', answer: 'She was writing tests all day yesterday.' },
            { id: 6, question: 'Деплой занял три часа.', answer: 'The deployment took three hours.' },
            { id: 7, question: 'Тесты не прошли, поэтому мы отменили релиз.', answer: 'The tests didn\'t pass, so we cancelled the release.' }
          ]
        }
      ]
    },
    {
      id: 7,
      title: 'Практика: Заполнить пропуски',
      type: 'practice',
      content: [
        { type: 'text', value: 'Вставьте глагол в правильной форме (Past Simple или Past Continuous).' },
        {
          type: 'exercise',
          subtype: 'fill_blank',
          items: [
            { id: 1, question: 'While I ___ (debug) the app, I ___ (find) an unexpected memory leak.', answer: 'was debugging / found' },
            { id: 2, question: 'The team ___ (review) the PR when the CI pipeline ___ (fail).', answer: 'was reviewing / failed' },
            { id: 3, question: 'She ___ (write) the documentation last Monday.', answer: 'wrote' },
            { id: 4, question: 'We ___ (deploy) to production when the database ___ (go) down.', answer: 'were deploying / went' },
            { id: 5, question: 'I ___ (not know) about the update when it ___ (happen).', answer: 'didn\'t know / happened' },
            { id: 6, question: '___ (you / test) the new feature yesterday?', answer: 'Did you test' },
            { id: 7, question: 'He ___ (push) the code and then ___ (open) a pull request.', answer: 'pushed / opened' }
          ]
        }
      ]
    }
  ]
}
