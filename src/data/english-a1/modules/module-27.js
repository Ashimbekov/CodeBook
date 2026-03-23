export default {
  id: 27,
  title: 'Практикум: Грамматика',
  description: 'Тренировка всех грамматических тем: to be, Present Simple, артикли, местоимения, времена',
  lessons: [
    {
      id: 1,
      title: 'Практика: Глагол to be',
      type: 'practice',
      content: [
        { type: 'task', taskType: 'fill_blank', question: 'I ___ a backend developer.', solution: 'am', explanation: 'I → am. "I am a backend developer."' },
        { type: 'task', taskType: 'fill_blank', question: 'The server ___ down right now.', solution: 'is', explanation: 'The server = it → is. "The server is down right now."' },
        { type: 'task', taskType: 'fill_blank', question: 'We ___ a cross-functional team.', solution: 'are', explanation: 'We → are. "We are a cross-functional team."' },
        { type: 'task', taskType: 'fill_blank', question: '___ the tests passing?', solution: 'Are', explanation: 'the tests = they → Are. "Are the tests passing?" — вопрос.' },
        { type: 'task', taskType: 'fill_blank', question: 'The API ___ not ready yet.', solution: 'is', explanation: 'The API = it → is. "The API is not ready yet."' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Они не в офисе."', solution: 'They are not in the office. / They aren\'t in the office.', explanation: 'They → are. Отрицание: are not / aren\'t.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Ты тимлид?"', solution: 'Are you the team lead?', explanation: 'Вопрос с to be: Are + you + subject?' },
        { type: 'task', taskType: 'multiple_choice', question: 'Выберите: "She ___ a senior developer."', options: ['is', 'am', 'are', 'be'], correct: 0, explanation: 'She → is. "She is a senior developer."' }
      ]
    },
    {
      id: 2,
      title: 'Практика: Артикли',
      type: 'practice',
      content: [
        { type: 'task', taskType: 'fill_blank', question: 'I found ___ bug in the code.', solution: 'a', explanation: '"a bug" — первое упоминание, начинается с согласного звука [b].' },
        { type: 'task', taskType: 'fill_blank', question: '___ bug is critical.', solution: 'The', explanation: '"The bug" — уже знаем о каком баге (повторное упоминание).' },
        { type: 'task', taskType: 'fill_blank', question: 'She is ___ UX designer.', solution: 'a', explanation: '"a UX designer" — UX произносится [ˈjuːeks], начинается с согласного звука [j].' },
        { type: 'task', taskType: 'fill_blank', question: 'Open ___ terminal and run the command.', solution: 'the', explanation: '"the terminal" — понятно из контекста, какой терминал имеется в виду.' },
        { type: 'task', taskType: 'fill_blank', question: 'I write ___ Python.', solution: '(no article)', explanation: 'Перед названиями языков программирования артикль не нужен.' },
        { type: 'task', taskType: 'fill_blank', question: 'There is ___ error on line 42.', solution: 'an', explanation: '"an error" — error начинается с гласного звука [e].' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Это открытый проект с открытым исходным кодом."', solution: 'This is an open-source project.', explanation: '"an open-source project" — open начинается на гласный [o].' },
        { type: 'task', taskType: 'multiple_choice', question: '"___ data is important." — какой артикль?', options: ['(no article)', 'A', 'An', 'The'], correct: 0, explanation: 'Data — неисчисляемое существительное в общем смысле — артикль не нужен.' }
      ]
    },
    {
      id: 3,
      title: 'Практика: Present Simple',
      type: 'practice',
      content: [
        { type: 'task', taskType: 'fill_blank', question: 'This function ___ (return) a string.', solution: 'returns', explanation: 'This function = it → returns (с -s).' },
        { type: 'task', taskType: 'fill_blank', question: 'She ___ (not use) Java.', solution: 'doesn\'t use', explanation: 'She → doesn\'t use. После doesn\'t — базовая форма.' },
        { type: 'task', taskType: 'fill_blank', question: '___ the server ___ (run) on port 8080?', solution: 'Does, run', explanation: '"Does the server run on port 8080?" — Does для it + базовая форма.' },
        { type: 'task', taskType: 'fill_blank', question: 'We ___ (deploy) every Friday.', solution: 'deploy', explanation: 'We → базовая форма. "We deploy every Friday."' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Python использует отступы для блоков кода."', solution: 'Python uses indentation for code blocks.', explanation: 'Python = it → uses. indentation = отступы, code blocks = блоки кода.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Как часто вы деплоите?"', solution: 'How often do you deploy?', explanation: 'How often + do + you + базовая форма.' },
        { type: 'task', taskType: 'multiple_choice', question: 'Выберите: "Git ___ all file changes."', options: ['tracks', 'track', 'is tracking', 'tracked'], correct: 0, explanation: 'Git = it → tracks (Present Simple, факт). "Git tracks all file changes."' },
        { type: 'task', taskType: 'fill_blank', question: 'I ___ (always/write) unit tests.', solution: 'always write', explanation: '"I always write unit tests." always стоит перед основным глаголом.' }
      ]
    },
    {
      id: 4,
      title: 'Практика: Present Continuous',
      type: 'practice',
      content: [
        { type: 'task', taskType: 'fill_blank', question: 'The server ___ (run) right now.', solution: 'is running', explanation: '"The server is running right now." is + run → running.' },
        { type: 'task', taskType: 'fill_blank', question: 'I ___ (debug) the API at the moment.', solution: 'am debugging', explanation: '"I am debugging the API." debug → debugging (двойная g).' },
        { type: 'task', taskType: 'fill_blank', question: '___ she ___ (review) my PR?', solution: 'Is, reviewing', explanation: '"Is she reviewing my PR?" is + review → reviewing.' },
        { type: 'task', taskType: 'fill_blank', question: 'They ___ (not deploy) today.', solution: 'aren\'t deploying', explanation: '"They aren\'t deploying today." aren\'t + deploy → deploying.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Что ты сейчас делаешь?"', solution: 'What are you doing now?', explanation: 'What + are + you + doing? — Present Continuous вопрос.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Мы сейчас рефакторим модуль авторизации."', solution: 'We are refactoring the authentication module now.', explanation: 'We are + refactor → refactoring. the authentication module — конкретный модуль.' },
        { type: 'task', taskType: 'multiple_choice', question: '"The build ___ right now."', options: ['is running', 'runs', 'run', 'ran'], correct: 0, explanation: '"right now" — маркер Present Continuous. "The build is running right now."' },
        { type: 'task', taskType: 'fill_blank', question: 'She ___ (write) the documentation this week.', solution: 'is writing', explanation: '"She is writing the documentation this week." — this week указывает на текущий период (Continuous).' }
      ]
    },
    {
      id: 5,
      title: 'Практика: Past Simple',
      type: 'practice',
      content: [
        { type: 'task', taskType: 'fill_blank', question: 'She ___ (fix) the bug yesterday.', solution: 'fixed', explanation: '"She fixed the bug yesterday." fix → fixed (правильный).' },
        { type: 'task', taskType: 'fill_blank', question: 'We ___ (not deploy) last Friday.', solution: 'didn\'t deploy', explanation: '"We didn\'t deploy last Friday." didn\'t + базовая форма.' },
        { type: 'task', taskType: 'fill_blank', question: '___ the server ___ (crash) last night?', solution: 'Did, crash', explanation: '"Did the server crash last night?" Did + базовая форма.' },
        { type: 'task', taskType: 'fill_blank', question: 'I ___ (write) the documentation two days ago.', solution: 'wrote', explanation: '"I wrote the documentation two days ago." write → wrote (неправильный).' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Они нашли критический баг в продакшене."', solution: 'They found a critical bug in production.', explanation: 'found = прошедшее от find. a critical bug — неопределённый артикль (впервые).' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Когда вы выпустили первую версию?"', solution: 'When did you release the first version?', explanation: 'When + did + you + базовая форма. the first version — конкретная версия.' },
        { type: 'task', taskType: 'fill_blank', question: 'The build ___ (break) after the merge.', solution: 'broke', explanation: '"The build broke after the merge." break → broke (неправильный).' },
        { type: 'task', taskType: 'multiple_choice', question: '"She ___ the problem quickly."', options: ['understood', 'understanded', 'was understand', 'understanding'], correct: 0, explanation: 'understand → understood (неправильный). Past Simple для завершённого действия.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Can и модальные глаголы',
      type: 'practice',
      content: [
        { type: 'task', taskType: 'fill_blank', question: 'She ___ speak three languages.', solution: 'can', explanation: '"She can speak three languages." can = умеет. Не изменяется по лицам.' },
        { type: 'task', taskType: 'fill_blank', question: 'The app ___ run offline.', solution: 'can', explanation: '"The app can run offline." — Приложение может работать оффлайн.' },
        { type: 'task', taskType: 'fill_blank', question: 'I ___ connect to the VPN right now.', solution: 'can\'t', explanation: '"I can\'t connect to the VPN right now." — Я не могу подключиться к VPN прямо сейчас.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Ты можешь проверить мой PR?"', solution: 'Can you review my PR?', explanation: 'Can + you + verb. Простая форма запроса.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Где я могу найти документацию?"', solution: 'Where can I find the documentation?', explanation: 'Where + can + I + find.' },
        { type: 'task', taskType: 'multiple_choice', question: '"___ this library parse JSON?"', options: ['Can', 'Does can', 'Is can', 'Did can'], correct: 0, explanation: '"Can this library parse JSON?" — модальный глагол can выносится на первое место.' },
        { type: 'task', taskType: 'fill_blank', question: 'Free users ___ access premium features.', solution: 'can\'t', explanation: '"Free users can\'t access premium features." — ограничение.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Я не могу воспроизвести этот баг."', solution: 'I can\'t reproduce this bug.', explanation: 'can\'t + reproduce (базовая форма). this bug — конкретный баг.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: There is / There are',
      type: 'practice',
      content: [
        { type: 'task', taskType: 'fill_blank', question: 'There ___ a bug in this function.', solution: 'is', explanation: '"a bug" — единственное число → is. "There is a bug in this function."' },
        { type: 'task', taskType: 'fill_blank', question: 'There ___ three failing tests.', solution: 'are', explanation: '"three tests" — множественное число → are.' },
        { type: 'task', taskType: 'fill_blank', question: 'There ___ any documentation.', solution: 'isn\'t', explanation: '"There isn\'t any documentation." — единственное число, отрицание.' },
        { type: 'task', taskType: 'fill_blank', question: '___ ___ any open pull requests?', solution: 'Are there', explanation: '"Are there any open pull requests?" — вопрос во множественном числе.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Есть несколько ошибок в логах."', solution: 'There are some errors in the logs.', explanation: 'There are + some (несколько) + множественное число.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Не было бэкапа до миграции."', solution: 'There was no backup before the migration. / There wasn\'t a backup before the migration.', explanation: 'Прошедшее время единственного числа → was. no backup / wasn\'t a backup — оба варианта.' },
        { type: 'task', taskType: 'fill_blank', question: '___ was a server outage last night.', solution: 'There', explanation: '"There was a server outage last night." — прошедшее время, единственное число.' },
        { type: 'task', taskType: 'multiple_choice', question: '"___ any tests for this feature?"', options: ['Are there', 'Is there', 'There is', 'There are'], correct: 0, explanation: '"Are there any tests?" — tests = множественное число → Are there.' }
      ]
    },
    {
      id: 8,
      title: 'Практика: Предлоги',
      type: 'practice',
      content: [
        { type: 'task', taskType: 'fill_blank', question: 'The bug is ___ line 42.', solution: 'in / on', explanation: '"in line 42" или "on line 42" — оба правильны.' },
        { type: 'task', taskType: 'fill_blank', question: 'The meeting is ___ 3 PM.', solution: 'at', explanation: 'Точное время → at. "The meeting is at 3 PM."' },
        { type: 'task', taskType: 'fill_blank', question: 'Deploy the app ___ production.', solution: 'to', explanation: 'Направление движения → to. "Deploy the app to production."' },
        { type: 'task', taskType: 'fill_blank', question: 'I work ___ a startup.', solution: 'in', explanation: 'Работать в организации → in. "I work in a startup."' },
        { type: 'task', taskType: 'fill_blank', question: 'Fix the bug ___ Friday.', solution: 'by', explanation: 'Дедлайн → by. "Fix the bug by Friday."' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Приложение работает на порту 8080."', solution: 'The app runs on port 8080.', explanation: '"on port 8080" — платформа/поверхность → on.' },
        { type: 'task', taskType: 'fill_blank', question: 'Sign ___ to your GitHub account.', solution: 'in', explanation: '"Sign in to your GitHub account." — войти в аккаунт → sign in to.' },
        { type: 'task', taskType: 'multiple_choice', question: '"I\'m responsible ___ the database."', options: ['for', 'to', 'of', 'at'], correct: 0, explanation: '"responsible for" — устойчивое выражение. "I\'m responsible for the database."' }
      ]
    },
    {
      id: 9,
      title: 'Практика: Местоимения',
      type: 'practice',
      content: [
        { type: 'task', taskType: 'fill_blank', question: '___ am a developer. (я)', solution: 'I', explanation: 'I — личное местоимение 1-го лица единственного числа. Всегда с большой буквы.' },
        { type: 'task', taskType: 'fill_blank', question: 'The function — what does ___ return?', solution: 'it', explanation: 'the function = оно → it. "What does it return?"' },
        { type: 'task', taskType: 'fill_blank', question: 'The tests are failing. ___ need to be fixed.', solution: 'They', explanation: 'the tests = они → They. "They need to be fixed."' },
        { type: 'task', taskType: 'fill_blank', question: 'Can you send ___ the link? (мне)', solution: 'me', explanation: 'Объектное местоимение от I → me. "Can you send me the link?"' },
        { type: 'task', taskType: 'fill_blank', question: 'This is ___ repository. (мой)', solution: 'my', explanation: '"my repository" — притяжательное прилагательное. "This is my repository."' },
        { type: 'task', taskType: 'fill_blank', question: 'The app updates ___ automatically. (само)', solution: 'itself', explanation: '"The app updates itself automatically." — возвратное местоимение.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Это не моя ошибка, это их баг."', solution: 'It\'s not my fault, it\'s their bug.', explanation: 'my = мой (притяжательное), their = их (притяжательное).' },
        { type: 'task', taskType: 'fill_blank', question: '___ code is clean but ___ has bugs. (его, её)', solution: 'His, hers / Her, his', explanation: 'his = его (притяжательное), her/hers = её. "His code is clean but hers has bugs."' }
      ]
    },
    {
      id: 10,
      title: 'Практика: Смешанная грамматика',
      type: 'practice',
      content: [
        { type: 'task', taskType: 'translate', question: 'Переведите: "Я разработчик и работаю удалённо."', solution: 'I am a developer and I work remotely.', explanation: 'am (to be) + a developer. work remotely (Present Simple для постоянного факта).' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Сейчас она проверяет мой код."', solution: 'She is reviewing my code now.', explanation: 'Present Continuous (is reviewing) — действие прямо сейчас. my code — притяжательное.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Было три бага в этом модуле."', solution: 'There were three bugs in this module.', explanation: 'Прошедшее время множественного числа → were. in this module — предлог in.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Этот API не может работать без токена."', solution: 'This API can\'t work without a token.', explanation: 'can\'t + work (базовая форма). without a token = без токена.' },
        { type: 'task', taskType: 'fill_blank', question: '___ there ___ any documentation for this library?', solution: 'Is, any', explanation: '"Is there any documentation?" — единственное число, вопрос.' },
        { type: 'task', taskType: 'multiple_choice', question: '"Yesterday she ___ the bug."', options: ['fixed', 'fixes', 'is fixing', 'fix'], correct: 0, explanation: 'Yesterday → прошедшее время. fix → fixed (правильный глагол). "Yesterday she fixed the bug."' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Я не писал тесты, потому что не было времени."', solution: 'I didn\'t write tests because there was no time.', explanation: 'didn\'t write (Past Simple), there was no time (прошедшее, нулевое количество).' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Можешь помочь мне с этой задачей?"', solution: 'Can you help me with this task?', explanation: 'Can + you + help + me. with this task = с этой задачей (предлог with).' }
      ]
    }
  ]
}
