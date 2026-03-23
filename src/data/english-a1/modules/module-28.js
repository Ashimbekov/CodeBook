export default {
  id: 28,
  title: 'Практикум: Лексика',
  description: 'Тренировка словарного запаса: числа, профессии, дом, работа, глаголы',
  lessons: [
    {
      id: 1,
      title: 'Практика: Числа и время',
      type: 'practice',
      content: [
        { type: 'task', taskType: 'translate', question: 'Напишите словами: 404', solution: 'four hundred and four', explanation: '400 = four hundred, 4 = four. Соединяется через "and".' },
        { type: 'task', taskType: 'translate', question: 'Напишите словами: v2.5.1', solution: 'version two point five point one', explanation: 'v = version, точки = point.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Встреча в 14:30"', solution: 'The meeting is at 2:30 PM.', explanation: '14:30 = 2:30 PM. at для точного времени.' },
        { type: 'task', taskType: 'fill_blank', question: 'Дедлайн — пятница, ___ (15) марта.', solution: 'the fifteenth / 15th', explanation: 'Даты — порядковые числительные. 15th = fifteenth.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Мы выпускаем обновления каждые две недели."', solution: 'We release updates every two weeks.', explanation: 'every two weeks = каждые две недели. Present Simple для регулярных действий.' },
        { type: 'task', taskType: 'match', question: 'Соедините дни с сокращениями:', pairs: [{ left: 'Mon', right: 'Monday' }, { left: 'Wed', right: 'Wednesday' }, { left: 'Fri', right: 'Friday' }, { left: 'Thu', right: 'Thursday' }], explanation: 'Стандартные сокращения дней недели.' },
        { type: 'task', taskType: 'translate', question: 'Сколько: "How many bugs are there?"', solution: 'Сколько багов?', explanation: 'How many = сколько (для исчисляемых).' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Сборка занимает 5 минут."', solution: 'The build takes 5 minutes.', explanation: 'takes = занимает (глагол take для времени). 5 minutes — в отличие от числа нет "and".' }
      ]
    },
    {
      id: 2,
      title: 'Практика: Профессии и работа',
      type: 'practice',
      content: [
        { type: 'task', taskType: 'translate', question: 'Переведите: "фронтенд-разработчик"', solution: 'frontend developer', explanation: 'frontend developer — человек, работающий с пользовательским интерфейсом.' },
        { type: 'task', taskType: 'match', question: 'Соедините профессии с описаниями:', pairs: [{ left: 'DevOps engineer', right: 'автоматизирует деплой' }, { left: 'QA engineer', right: 'тестирует продукт' }, { left: 'product manager', right: 'управляет продуктом' }, { left: 'UX designer', right: 'проектирует интерфейс' }], explanation: 'Основные IT-роли и их обязанности.' },
        { type: 'task', taskType: 'translate', question: 'Как сказать: "Я ищу работу фулстек-разработчика"?', solution: 'I\'m looking for a job as a full-stack developer.', explanation: 'looking for = ищу, as a = в качестве, full-stack developer — с дефисом.' },
        { type: 'task', taskType: 'fill_blank', question: 'She works ___ (в) Google as a senior engineer.', solution: 'at / for', explanation: 'work at/for a company — работать в компании. Оба предлога правильны.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Я работаю удалённо уже 3 года."', solution: 'I have been working remotely for 3 years. / I work remotely. I\'ve done it for 3 years.', explanation: 'Простой вариант: "I work remotely" (факт). Упоминание 3 лет требует Present Perfect (A2+).' },
        { type: 'task', taskType: 'multiple_choice', question: 'Кто такой "scrum master"?', options: ['Фасилитатор Scrum-процесса', 'Лучший разработчик команды', 'Технический директор', 'Менеджер проекта'], correct: 0, explanation: 'Scrum master — фасилитатор, который помогает команде следовать Scrum-методологии.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Какова ваша должность?"', solution: 'What is your job title?', explanation: 'job title = должность, название позиции. What is = какова.' },
        { type: 'task', taskType: 'fill_blank', question: 'The sprint ___ on Friday. (заканчивается)', solution: 'ends', explanation: '"The sprint ends on Friday." ends (3-е лицо ед.ч.) на in →  on Friday (день).' }
      ]
    },
    {
      id: 3,
      title: 'Практика: Компьютер и интернет',
      type: 'practice',
      content: [
        { type: 'task', taskType: 'match', question: 'Соедините слова с переводами:', pairs: [{ left: 'browser', right: 'браузер' }, { left: 'folder', right: 'папка' }, { left: 'keyboard', right: 'клавиатура' }, { left: 'extension', right: 'расширение' }], explanation: 'Базовые компьютерные термины.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Скачайте и установите расширение для браузера."', solution: 'Download and install the browser extension.', explanation: 'download = скачать, install = установить, browser extension = расширение браузера.' },
        { type: 'task', taskType: 'fill_blank', question: '"___ the page to see the updates." (Обновите)', solution: 'Refresh / Reload', explanation: 'Refresh или reload = обновить страницу.' },
        { type: 'task', taskType: 'multiple_choice', question: 'Что такое "cache"?', options: ['временная память', 'история браузера', 'закладки', 'расширения'], correct: 0, explanation: 'Cache — временная память для быстрого доступа к данным.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Подключитесь к VPN перед работой."', solution: 'Connect to the VPN before work.', explanation: 'Connect to = подключиться к. before work = перед работой.' },
        { type: 'task', taskType: 'fill_blank', question: 'The app ___ (загружает) data from the cloud.', solution: 'downloads / fetches / loads', explanation: 'download = скачивать, fetch = получать данные, load = загружать.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Войдите в систему с вашим паролем."', solution: 'Log in to the system with your password.', explanation: 'Log in to = войти в, with your password = с вашим паролем.' },
        { type: 'task', taskType: 'match', question: 'download vs upload:', pairs: [{ left: 'download', right: 'скачать (к себе)' }, { left: 'upload', right: 'загрузить (на сервер)' }], explanation: 'download = к себе (down = вниз). upload = на сервер (up = вверх).' }
      ]
    },
    {
      id: 4,
      title: 'Практика: Глаголы действий',
      type: 'practice',
      content: [
        { type: 'task', taskType: 'fill_blank', question: '"___ sure the tests pass." (Убедитесь)', solution: 'Make', explanation: '"Make sure the tests pass." — make sure = убедиться.' },
        { type: 'task', taskType: 'fill_blank', question: '"She ___ (получила) a lot of feedback."', solution: 'got', explanation: 'get → got (неправильный). "She got a lot of feedback."' },
        { type: 'task', taskType: 'multiple_choice', question: '"This task ___ 2 hours."', options: ['takes', 'makes', 'does', 'gets'], correct: 0, explanation: '"takes time" — занимает время. "This task takes 2 hours."' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Я застрял на этой проблеме."', solution: 'I\'m stuck on this problem. / I got stuck on this problem.', explanation: 'get stuck = застрять. stuck = прилагательное (застрявший).' },
        { type: 'task', taskType: 'fill_blank', question: '"Let\'s ___ back to the main topic." (вернёмся)', solution: 'get', explanation: '"Let\'s get back to the main topic." — get back to = вернуться к.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Сделайте резервную копию перед обновлением."', solution: 'Back up the database before the update.', explanation: 'back up = создать резервную копию (фразовый глагол). before = перед.' },
        { type: 'task', taskType: 'fill_blank', question: '"I need to ___ out how to fix this." (разобраться)', solution: 'figure', explanation: '"I need to figure out how to fix this." — figure out = разобраться.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Это имеет смысл."', solution: 'That makes sense. / This makes sense.', explanation: '"make sense" — устойчивое выражение. makes sense = имеет смысл.' }
      ]
    },
    {
      id: 5,
      title: 'Практика: Прилагательные',
      type: 'practice',
      content: [
        { type: 'task', taskType: 'match', question: 'Соедините слова с антонимами:', pairs: [{ left: 'fast', right: 'slow' }, { left: 'stable', right: 'unstable' }, { left: 'correct', right: 'incorrect' }, { left: 'available', right: 'unavailable' }], explanation: 'Противоположные прилагательные в IT.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Код слишком сложный для новичков."', solution: 'The code is too complex for beginners.', explanation: 'too complex = слишком сложный, for beginners = для новичков.' },
        { type: 'task', taskType: 'fill_blank', question: 'Python is ___ (проще) than C++.', solution: 'simpler', explanation: 'simple → simpler (сравнительная степень). "Python is simpler than C++."' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Это наиболее эффективное решение."', solution: 'This is the most efficient solution.', explanation: 'the most efficient = наиболее эффективный (превосходная степень длинного прилагательного).' },
        { type: 'task', taskType: 'fill_blank', question: 'The app works ___ (автоматически).', solution: 'automatically', explanation: 'automatic → automatically (+ally). Наречие от прилагательного.' },
        { type: 'task', taskType: 'multiple_choice', question: '"The bug is ___ critical."', options: ['extremely', 'very much', 'fastly', 'too much'], correct: 0, explanation: 'extremely = чрезвычайно. "The bug is extremely critical." very much не с прилагательными.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Сервер почти готов."', solution: 'The server is almost ready.', explanation: 'almost = почти. "The server is almost ready."' },
        { type: 'task', taskType: 'fill_blank', question: 'The new version is ___ (более стабильная) than v1.', solution: 'more stable', explanation: '"more stable" — сравнительная степень длинного прилагательного (2 слога).' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Вопросительные слова',
      type: 'practice',
      content: [
        { type: 'task', taskType: 'fill_blank', question: '___ does this function do? (Что)', solution: 'What', explanation: '"What does this function do?" — что делает функция?' },
        { type: 'task', taskType: 'fill_blank', question: '___ can I find the logs? (Где)', solution: 'Where', explanation: '"Where can I find the logs?" — где найти логи?' },
        { type: 'task', taskType: 'fill_blank', question: '___ did the server crash? (Когда)', solution: 'When', explanation: '"When did the server crash?" — когда упал сервер?' },
        { type: 'task', taskType: 'fill_blank', question: '___ is responsible for the database? (Кто)', solution: 'Who', explanation: '"Who is responsible for the database?" — кто ответственный за БД?' },
        { type: 'task', taskType: 'fill_blank', question: '___ did you choose React? (Почему)', solution: 'Why', explanation: '"Why did you choose React?" — почему выбрали React?' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Сколько времени занимает сборка?"', solution: 'How long does the build take?', explanation: 'How long = как долго. does...take = занимает (3-е лицо, вопрос).' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Какой версией вы пользуетесь?"', solution: 'Which version do you use?', explanation: 'Which = какой (выбор из нескольких). do you use = Present Simple вопрос.' },
        { type: 'task', taskType: 'fill_blank', question: '___ many tests are failing? (Сколько)', solution: 'How', explanation: '"How many tests are failing?" — how many = сколько.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: IT-словарь смешанный',
      type: 'practice',
      content: [
        { type: 'task', taskType: 'match', question: 'Соедините термины:', pairs: [{ left: 'bug', right: 'ошибка в коде' }, { left: 'feature', right: 'новая функция' }, { left: 'deploy', right: 'выпустить на сервер' }, { left: 'sprint', right: 'итерация разработки' }], explanation: 'Основные IT-термины.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Мёрджите ветку в main после одобрения PR."', solution: 'Merge the branch into main after the PR is approved.', explanation: 'merge into = мёрджить в, after the PR is approved = после одобрения PR (пассивный залог).' },
        { type: 'task', taskType: 'fill_blank', question: 'We are ___ (деплоим) to production tonight.', solution: 'deploying', explanation: '"We are deploying to production tonight." — Present Continuous для запланированного.' },
        { type: 'task', taskType: 'multiple_choice', question: 'Что такое "hotfix"?', options: ['срочное исправление', 'горячее кофе', 'быстрый код', 'жаркий сервер'], correct: 0, explanation: 'hotfix = срочный патч, который исправляет критический баг в продакшене.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Откройте задачу в баг-трекере."', solution: 'Open a ticket in the bug tracker.', explanation: 'open a ticket = открыть задачу, bug tracker = система отслеживания ошибок.' },
        { type: 'task', taskType: 'fill_blank', question: 'The PR needs at least ___ (одно) approval.', solution: 'one', explanation: '"The PR needs at least one approval." — один отзыв (числительное).' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Рефакторинг улучшает читаемость кода."', solution: 'Refactoring improves code readability.', explanation: 'refactoring = рефакторинг, improves = улучшает (it), code readability = читаемость кода.' },
        { type: 'task', taskType: 'fill_blank', question: 'Write ___ (чистый) code and document it.', solution: 'clean', explanation: '"Write clean code and document it." — clean code = чистый код (термин).' }
      ]
    },
    {
      id: 8,
      title: 'Практика: Повседневная лексика',
      type: 'practice',
      content: [
        { type: 'task', taskType: 'translate', question: 'Переведите: "Я работаю из дома каждую пятницу."', solution: 'I work from home every Friday.', explanation: 'work from home = работать из дома. every Friday = каждую пятницу (Present Simple).' },
        { type: 'task', taskType: 'match', question: 'Соедините слова:', pairs: [{ left: 'colleague', right: 'коллега' }, { left: 'boss', right: 'начальник' }, { left: 'teammate', right: 'товарищ по команде' }, { left: 'client', right: 'клиент' }], explanation: 'Люди в рабочем контексте.' },
        { type: 'task', taskType: 'fill_blank', question: 'My home ___ (рабочее место) has two monitors.', solution: 'office / setup', explanation: '"home office" или "home setup" — домашнее рабочее место.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Добрый день! Как прошли выходные?"', solution: 'Good afternoon! How was your weekend?', explanation: 'Good afternoon = добрый день (с полудня до вечера). How was = как прошли (Past Simple).' },
        { type: 'task', taskType: 'multiple_choice', question: 'Как ответить на "How are you?"', options: ['Fine, thanks!', 'I am fine person.', 'Yes, fine.', 'Fine is me.'], correct: 0, explanation: '"Fine, thanks!" или "Fine, thank you!" — стандартный краткий ответ.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Хорошего дня! До завтра!"', solution: 'Have a great day! See you tomorrow!', explanation: 'Have a great day! = хорошего дня! See you tomorrow! = до завтра!' },
        { type: 'task', taskType: 'fill_blank', question: '"I ___ (еду) to the office by bus." (Present Simple)', solution: 'go / commute', explanation: '"I go to the office by bus." или "I commute by bus." commute = ездить на работу.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Мой коллега — опытный разработчик."', solution: 'My colleague is an experienced developer.', explanation: 'an experienced developer — experienced начинается с гласного [ɛ] → an.' }
      ]
    },
    {
      id: 9,
      title: 'Практика: Перевод IT-фраз',
      type: 'practice',
      content: [
        { type: 'task', taskType: 'translate', question: 'Переведите: "Пожалуйста, проверьте мой пул-реквест."', solution: 'Please review my pull request.', explanation: 'review = проверить (код). my pull request = мой PR.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Сервер недоступен с 3 утра."', solution: 'The server has been unavailable since 3 AM. / The server is unavailable since 3 AM.', explanation: 'unavailable = недоступный. since 3 AM = с 3 утра.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Я разобрался с проблемой."', solution: 'I figured it out. / I solved the problem.', explanation: 'figure out = разобраться. solve = решить.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Задача заблокирована — жду ответа от дизайнера."', solution: 'The task is blocked. I\'m waiting for a response from the designer.', explanation: 'is blocked = заблокирована (пассивный залог). waiting for = жду.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Вчера мы задеплоили новую версию API."', solution: 'Yesterday we deployed a new version of the API.', explanation: 'deployed = прошедшее от deploy. a new version of the API = новая версия API.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Это лучший подход для данной задачи."', solution: 'This is the best approach for this task.', explanation: 'the best = наилучший (превосходная степень). approach = подход. for this task = для данной задачи.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Я пишу тесты для каждой функции."', solution: 'I write tests for every function.', explanation: 'write tests = писать тесты. for every function = для каждой функции.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Эта библиотека поддерживает несколько языков."', solution: 'This library supports multiple languages.', explanation: 'supports = поддерживает (it). multiple languages = несколько языков.' }
      ]
    },
    {
      id: 10,
      title: 'Практика: Смешанный словарный запас',
      type: 'practice',
      content: [
        { type: 'task', taskType: 'match', question: 'Соедините IT-аббревиатуры:', pairs: [{ left: 'PR', right: 'Pull Request' }, { left: 'CI/CD', right: 'Continuous Integration/Deployment' }, { left: 'ORM', right: 'Object-Relational Mapping' }, { left: 'API', right: 'Application Programming Interface' }], explanation: 'Важные IT-аббревиатуры.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "LGTM" (аббревиатура из code review)', solution: 'Looks Good To Me — Выглядит хорошо для меня (одобрение)', explanation: 'LGTM = Looks Good To Me. Используется для одобрения кода в code review.' },
        { type: 'task', taskType: 'fill_blank', question: 'Set ___ (настройте) the local environment first.', solution: 'up', explanation: 'set up = настроить (фразовый глагол). "Set up the local environment first."' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Какие технологии вы используете?"', solution: 'What technologies do you use?', explanation: 'What + technologies + do you use? — Present Simple вопрос.' },
        { type: 'task', taskType: 'multiple_choice', question: '"We ___ on Fridays." — популярная IT-фраза', options: ['never deploy', 'always deploy', 'deployed', 'deploying'], correct: 0, explanation: '"We never deploy on Fridays." — шутка о пятничных деплоях. never + Present Simple.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Тесты прошли успешно."', solution: 'The tests passed successfully. / The tests are passing.', explanation: 'passed = прошли (Past Simple). successfully = успешно (наречие).' },
        { type: 'task', taskType: 'fill_blank', question: 'I ___ (не согласен с) this approach.', solution: 'disagree with / don\'t agree with', explanation: '"I disagree with this approach." или "I don\'t agree with this approach."' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Спасибо за код-ревью!"', solution: 'Thanks for the code review!', explanation: 'Thanks for = спасибо за (+ существительное или герундий).' }
      ]
    }
  ]
}
