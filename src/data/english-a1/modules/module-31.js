export default {
  id: 31,
  title: 'Практикум: Перевод',
  description: 'Перевод с русского на английский и обратно — IT-тексты и обычное общение',
  lessons: [
    {
      id: 1,
      title: 'Перевод: Представление себя',
      type: 'practice',
      content: [
        { type: 'task', taskType: 'translate', question: 'Переведите на английский: "Привет! Меня зовут Алекс. Я бэкенд-разработчик."', solution: 'Hi! My name is Alex. I\'m a backend developer.', explanation: 'My name is = меня зовут (буквально "моё имя"). I\'m a = я являюсь.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Я работаю в IT-компании уже 3 года."', solution: 'I have been working in an IT company for 3 years. / I work in an IT company. I\'ve been here for 3 years.', explanation: 'Строго для "уже 3 года" нужен Present Perfect Continuous (A2+). Простой вариант: "I work in IT" + separately mention years.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Я специализируюсь на Python и машинном обучении."', solution: 'I specialize in Python and machine learning.', explanation: 'specialize in = специализироваться на. Python and machine learning = Python и машинное обучение.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Приятно познакомиться! Какой у вас стек?"', solution: 'Nice to meet you! What is your tech stack?', explanation: 'Nice to meet you = приятно познакомиться. tech stack = технологический стек.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Я ищу работу фулстек-разработчиком в удалённой компании."', solution: 'I\'m looking for a job as a full-stack developer in a remote company.', explanation: 'looking for = ищу, as a = в качестве, remote company = удалённая компания.' },
        { type: 'task', taskType: 'translate', question: 'Переведите на русский: "I have 5 years of experience in web development."', solution: 'У меня 5 лет опыта в веб-разработке.', explanation: 'I have = у меня есть, years of experience = лет опыта, in web development = в веб-разработке.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "My strongest skills are React and TypeScript."', solution: 'Мои сильнейшие навыки — React и TypeScript.', explanation: 'My strongest skills = мои сильнейшие навыки, are = являются.' },
        { type: 'task', taskType: 'translate', question: 'Переведите на английский: "Я открыт для новых возможностей."', solution: 'I am open to new opportunities.', explanation: 'open to = открыт для, new opportunities = новые возможности.' }
      ]
    },
    {
      id: 2,
      title: 'Перевод: На стендапе',
      type: 'practice',
      content: [
        { type: 'task', taskType: 'translate', question: 'Переведите: "Вчера я исправил три бага и написал тесты."', solution: 'Yesterday I fixed three bugs and wrote tests.', explanation: 'fixed = прошедшее от fix, wrote = прошедшее от write (неправильный).' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Сегодня я работаю над модулем оплаты."', solution: 'Today I\'m working on the payment module.', explanation: 'Present Continuous для текущего действия. working on = работаю над.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "У меня нет блокеров."', solution: 'I don\'t have any blockers. / No blockers.', explanation: 'Оба варианта правильны. На стендапе обычно говорят кратко: "No blockers."' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Мне нужна помощь с интеграцией платёжной системы."', solution: 'I need help with the payment system integration.', explanation: 'I need help with = мне нужна помощь с. payment system integration = интеграция платёжной системы.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Задача будет готова к пятнице."', solution: 'The task will be ready by Friday.', explanation: 'will be ready = будет готова (Future Simple). by Friday = к пятнице (дедлайн).' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Ожидаю ответа от дизайнера."', solution: 'I\'m waiting for a response from the designer.', explanation: 'waiting for = жду, response = ответ, from the designer = от дизайнера.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Начал работу над следующим тикетом."', solution: 'I started working on the next ticket.', explanation: 'started working on = начал работу над. the next ticket = следующий тикет.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Вчера мы провели ретроспективу спринта."', solution: 'Yesterday we held a sprint retrospective.', explanation: 'held = прошедшее от hold (проводить). sprint retrospective = ретроспектива спринта.' }
      ]
    },
    {
      id: 3,
      title: 'Перевод: Про баги',
      type: 'practice',
      content: [
        { type: 'task', taskType: 'translate', question: 'Переведите: "Я нашёл баг в модуле авторизации."', solution: 'I found a bug in the authentication module.', explanation: 'found = прошедшее от find. a bug (впервые) → in the authentication module.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Баг воспроизводится только на мобильных устройствах."', solution: 'The bug reproduces only on mobile devices. / The bug only occurs on mobile devices.', explanation: 'reproduces/occurs = воспроизводится/происходит. only on mobile devices = только на мобильных.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Я исправлю этот баг к концу дня."', solution: 'I\'ll fix this bug by end of day. / I\'ll fix this bug by EOD.', explanation: 'I\'ll fix = исправлю (Future Simple). by end of day = к концу дня = by EOD.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Баг был вызван гонкой состояний."', solution: 'The bug was caused by a race condition.', explanation: 'was caused by = был вызван (пассивный залог прошедшего). race condition = гонка состояний.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Пожалуйста, прикрепите скриншот ошибки."', solution: 'Please attach a screenshot of the error.', explanation: 'Please attach = пожалуйста, прикрепите. a screenshot of the error = скриншот ошибки.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Эта ошибка возникает при нулевом вводе."', solution: 'This error occurs with null input.', explanation: 'occurs = возникает, with null input = при нулевом вводе.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Мы откатили деплой из-за критического бага."', solution: 'We rolled back the deployment due to a critical bug.', explanation: 'rolled back = откатили (roll back → rolled back). due to = из-за. a critical bug = критический баг.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Баг исправлен и тесты проходят."', solution: 'The bug is fixed and the tests are passing.', explanation: 'is fixed = исправлен (пассивный). are passing = проходят (Present Continuous для текущего состояния).' }
      ]
    },
    {
      id: 4,
      title: 'Перевод: Email переписка',
      type: 'practice',
      content: [
        { type: 'task', taskType: 'translate', question: 'Переведите: "Привет, Джон! Надеюсь, у тебя всё хорошо."', solution: 'Hi John! I hope you are doing well.', explanation: '"I hope you are doing well" — вежливое начало письма. Альтернативы: "Hope you\'re well" или "I hope this email finds you well".' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Пишу по поводу вашего запроса на функцию."', solution: 'I am writing regarding your feature request.', explanation: 'regarding = по поводу / касательно. feature request = запрос на функцию.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Пожалуйста, проверьте прикреплённые файлы."', solution: 'Please find the attached files. / Please check the attached files.', explanation: '"Please find the attached files" — стандартная фраза email. attached = прикреплённые.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Буду рад ответить на ваши вопросы."', solution: 'I\'d be happy to answer your questions. / Feel free to ask questions.', explanation: '"I\'d be happy to" = Я был бы рад. Вежливая формула готовности помочь.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Спасибо за быстрый ответ."', solution: 'Thank you for your quick response. / Thanks for the quick reply.',explanation: 'for your quick response = за ваш быстрый ответ. quick reply = быстрый ответ.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "С уважением, Алексей."', solution: 'Best regards, Alexey. / Kind regards, Alexey.', explanation: 'Best regards / Kind regards = с уважением (формальное завершение письма).' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Жду вашего ответа."', solution: 'I look forward to your response. / Looking forward to hearing from you.', explanation: '"look forward to" = ждать с нетерпением. Стандартное завершение делового письма.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Хотел уточнить статус задачи #123."', solution: 'I wanted to follow up on ticket #123. / I wanted to check the status of ticket #123.', explanation: 'follow up = уточнить статус. check the status = проверить статус.' }
      ]
    },
    {
      id: 5,
      title: 'Перевод: Документация',
      type: 'practice',
      content: [
        { type: 'task', taskType: 'translate', question: 'Переведите: "Установите зависимости командой npm install."', solution: 'Install dependencies with npm install. / Run npm install to install dependencies.', explanation: 'Install dependencies = установите зависимости. with = с помощью.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Эта библиотека предоставляет простой API для работы с датами."', solution: 'This library provides a simple API for working with dates.', explanation: 'provides = предоставляет, a simple API = простой API, for working with = для работы с.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "По умолчанию сервер слушает порт 3000."', solution: 'By default, the server listens on port 3000.', explanation: 'By default = по умолчанию, listens on = слушает (on с портами).' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Смотри примеры в папке /examples."', solution: 'See the examples in the /examples folder.', explanation: 'See = смотри, the examples = примеры, in the /examples folder = в папке /examples.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Функция принимает два параметра: строку и число."', solution: 'The function takes two parameters: a string and a number.', explanation: 'takes two parameters = принимает два параметра. a string and a number = строку и число (с артиклями).' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Эта функция устарела. Используйте вместо неё getUser()."', solution: 'This function is deprecated. Use getUser() instead.', explanation: 'is deprecated = устарела. instead = вместо (этого).' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Требуется Node.js версии 18 или выше."', solution: 'Node.js version 18 or higher is required. / Requires Node.js 18 or higher.', explanation: 'or higher = или выше (версия). is required = требуется (пассивный залог).' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Для получения дополнительной информации смотрите документацию."', solution: 'For more information, see the documentation.', explanation: 'For more information = для получения дополнительной информации, see = смотрите.' }
      ]
    },
    {
      id: 6,
      title: 'Перевод: Технические обсуждения',
      type: 'practice',
      content: [
        { type: 'task', taskType: 'translate', question: 'Переведите: "Какой подход лучше — монолит или микросервисы?"', solution: 'Which approach is better — monolith or microservices?', explanation: 'Which = какой (выбор). approach = подход. is better = лучше. monolith = монолит.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Это зависит от размера команды и требований проекта."', solution: 'It depends on the team size and project requirements.', explanation: 'It depends on = это зависит от. team size = размер команды. requirements = требования.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Я предлагаю использовать кэш для уменьшения нагрузки на базу данных."', solution: 'I suggest using a cache to reduce the database load.', explanation: 'I suggest = я предлагаю. using a cache = использование кэша. to reduce = чтобы уменьшить. database load = нагрузка на БД.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Этот подход более масштабируемый, чем текущее решение."', solution: 'This approach is more scalable than the current solution.', explanation: 'more scalable = более масштабируемый (сравнительная степень). than = чем. current solution = текущее решение.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Нам нужно провести рефакторинг этого модуля."', solution: 'We need to refactor this module.', explanation: 'need to = нужно. refactor = провести рефакторинг.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Производительность упала после последнего деплоя."', solution: 'Performance dropped after the last deployment.', explanation: 'Performance = производительность. dropped = упала (drop → dropped). after the last deployment = после последнего деплоя.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Хорошее замечание — я об этом не подумал."', solution: 'Good point — I didn\'t think of that.', explanation: 'Good point = хорошее замечание. I didn\'t think of that = я не подумал об этом.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Это лучшая практика в индустрии."', solution: 'This is a best practice in the industry.', explanation: 'best practice = лучшая практика. in the industry = в индустрии.' }
      ]
    },
    {
      id: 7,
      title: 'Перевод: Из кода и комментариев',
      type: 'practice',
      content: [
        { type: 'task', taskType: 'translate', question: 'Переведите комментарий: "// TODO: add error handling for null input"', solution: 'TODO: добавить обработку ошибок для нулевого ввода', explanation: 'error handling = обработка ошибок. for null input = для нулевого ввода.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "// FIXME: this function breaks with empty array"', solution: 'FIXME: эта функция ломается с пустым массивом', explanation: 'breaks with = ломается с/при. empty array = пустой массив.' },
        { type: 'task', taskType: 'translate', question: 'Переведите commit message: "fix: resolve authentication token expiry issue"', solution: 'исправление: решить проблему истечения срока действия токена аутентификации', explanation: 'fix = исправление. resolve = решить. token expiry issue = проблема с истечением токена.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "feat: add dark mode support"', solution: 'новая функция: добавить поддержку тёмного режима', explanation: 'feat = feature = новая функция. add = добавить. dark mode support = поддержка тёмного режима.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "// This is a temporary workaround, remove in v2"', solution: '// Это временное решение, удалить в v2', explanation: 'temporary workaround = временное обходное решение. remove in v2 = удалить в версии 2.' },
        { type: 'task', taskType: 'translate', question: 'Напишите комментарий по-английски: "// Проверяем, является ли пользователь администратором"', solution: '// Check if the user is an administrator / // Check if user is admin', explanation: 'check if = проверяем, является ли. is an administrator = является администратором.' },
        { type: 'task', taskType: 'translate', question: 'Переведите название функции на русский: "validateEmailFormat"', solution: 'проверить/валидировать формат email', explanation: 'validate = проверять/валидировать. Email = email. Format = формат. camelCase читается как три слова.' },
        { type: 'task', taskType: 'translate', question: 'Напишите название функции по-английски: "получить пользователя по ID"', solution: 'getUserById', explanation: 'get = получить, User = пользователя, By = по, Id = ID. Все слова в camelCase без пробелов.' }
      ]
    },
    {
      id: 8,
      title: 'Перевод: Собеседование',
      type: 'practice',
      content: [
        { type: 'task', taskType: 'translate', question: 'Переведите вопрос интервью: "Tell me about yourself."', solution: 'Расскажите о себе.', explanation: 'Tell me about yourself — классический первый вопрос на собеседовании.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "What are your strengths?"', solution: 'Каковы ваши сильные стороны?', explanation: 'strengths = сильные стороны. What are = каковы.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Describe a challenging project you worked on."', solution: 'Опишите сложный проект, над которым вы работали.', explanation: 'Describe = опишите. challenging = сложный/требующий усилий. you worked on = над которым работали.' },
        { type: 'task', taskType: 'translate', question: 'Переведите ответ: "Я работал над сервисом уведомлений для мобильного приложения."', solution: 'I worked on a notification service for a mobile application.', explanation: 'worked on = работал над. a notification service = сервис уведомлений. for a mobile application = для мобильного приложения.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Есть ли у вас вопросы к нам?"', solution: 'Do you have any questions for us?', explanation: 'Do you have any = есть ли у вас. for us = к нам.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Каков ваш опыт работы с микросервисами?"', solution: 'What is your experience with microservices?', explanation: 'What is your experience with = каков ваш опыт работы с.' },
        { type: 'task', taskType: 'translate', question: 'Переведите ответ: "Я использовал Docker и Kubernetes для оркестрации контейнеров."', solution: 'I used Docker and Kubernetes for container orchestration.', explanation: 'used = использовал (Past Simple). for container orchestration = для оркестрации контейнеров.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Почему вы хотите работать в нашей компании?"', solution: 'Why do you want to work for our company?', explanation: 'Why do you want = почему вы хотите. to work for = работать в/на.' }
      ]
    },
    {
      id: 9,
      title: 'Перевод: Смешанный уровень',
      type: 'practice',
      content: [
        { type: 'task', taskType: 'translate', question: 'Переведите: "I\'m currently working on a REST API using FastAPI and PostgreSQL."', solution: 'Я сейчас работаю над REST API с использованием FastAPI и PostgreSQL.', explanation: 'currently working on = сейчас работаю над. using = с использованием.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "The code review process helps maintain code quality."', solution: 'Процесс code review помогает поддерживать качество кода.', explanation: 'helps maintain = помогает поддерживать. code quality = качество кода.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Нам нужно автоматизировать деплой с помощью GitHub Actions."', solution: 'We need to automate the deployment using GitHub Actions.', explanation: 'automate = автоматизировать. deployment = деплой/развёртывание. using = с помощью.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "This is a breaking change — update your client code."', solution: 'Это ломающее изменение — обновите ваш клиентский код.', explanation: 'breaking change = ломающее изменение. update your client code = обновите ваш клиентский код.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Запустите тесты перед деплоем в продакшен."', solution: 'Run the tests before deploying to production.', explanation: 'Run the tests = запустите тесты. before deploying = перед деплоем. to production = в продакшен.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "The feature will be available in the next release."', solution: 'Функция будет доступна в следующем релизе.', explanation: 'will be available = будет доступна (Future Simple). in the next release = в следующем релизе.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Я работаю над этим тикетом уже два дня."', solution: 'I\'ve been working on this ticket for two days. / I\'m working on this ticket. It\'s been two days.', explanation: 'Точный перевод требует Present Perfect Continuous (A2+). Упрощённо: "I\'m working on this ticket" (работаю сейчас).' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Open source contributions are valuable for your portfolio."', solution: 'Вклад в open source ценен для вашего портфолио.', explanation: 'Open source contributions = вклад в open source. are valuable = ценны. for your portfolio = для вашего портфолио.' }
      ]
    },
    {
      id: 10,
      title: 'Перевод: Финальный тест',
      type: 'practice',
      content: [
        { type: 'task', taskType: 'translate', question: 'Переведите полное сообщение о баге: "Критический баг: пользователи не могут войти в систему после обновления. Проблема воспроизводится на мобильных устройствах."', solution: 'Critical bug: users cannot log in after the update. The issue reproduces on mobile devices.', explanation: 'Critical bug = критический баг. cannot = не могут. log in = войти. after the update = после обновления. reproduces on mobile devices = воспроизводится на мобильных устройствах.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Я предлагаю провести рефакторинг этого модуля — он слишком сложный и трудно поддерживаемый."', solution: 'I suggest refactoring this module — it\'s too complex and hard to maintain.', explanation: 'I suggest refactoring = предлагаю рефакторинг. too complex = слишком сложный. hard to maintain = трудно поддерживать.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "The deployment was successful. All services are running and the tests are green."', solution: 'Деплой прошёл успешно. Все сервисы работают и тесты зелёные.', explanation: 'was successful = прошёл успешно. are running = работают. tests are green = тесты зелёные (все проходят).' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Добавьте обработку ошибок для случаев, когда API недоступен."', solution: 'Add error handling for cases when the API is unavailable.', explanation: 'Add error handling = добавьте обработку ошибок. for cases when = для случаев, когда. is unavailable = недоступен.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Could you review my PR? I made some changes based on your comments."', solution: 'Не мог бы ты проверить мой PR? Я внёс некоторые изменения на основе твоих комментариев.', explanation: 'Could you review = не мог бы проверить. based on your comments = на основе твоих комментариев.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Обновите зависимости и запустите тесты перед отправкой PR."', solution: 'Update the dependencies and run the tests before submitting the PR.', explanation: 'Update the dependencies = обновите зависимости. before submitting = перед отправкой. submitting/opening a PR = отправка/открытие PR.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "I\'m responsible for the backend services and database architecture."', solution: 'Я отвечаю за бэкенд-сервисы и архитектуру базы данных.', explanation: 'I\'m responsible for = я отвечаю за / я ответственен за.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Этот PR решает проблему #456 и добавляет юнит-тесты."', solution: 'This PR resolves issue #456 and adds unit tests.', explanation: 'resolves issue = решает задачу/проблему. and adds = и добавляет. unit tests = юнит-тесты.' }
      ]
    }
  ]
}
