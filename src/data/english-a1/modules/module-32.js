export default {
  id: 32,
  title: 'Практикум: Фразы и диалоги',
  description: 'Диалоги на работе, офисные фразы, чат-сообщения, собеседования',
  lessons: [
    {
      id: 1,
      title: 'Диалог: Первый день на работе',
      type: 'practice',
      content: [
        { type: 'task', taskType: 'fill_blank', question: 'Завершите фразу: "Hi! I\'m Alex, the new ___ developer." (бэкенд)', solution: 'backend', explanation: '"Hi! I\'m Alex, the new backend developer." — Привет! Я Алекс, новый бэкенд-разработчик.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Nice to meet you! Welcome to the team."', solution: 'Приятно познакомиться! Добро пожаловать в команду.', explanation: 'Nice to meet you! = приятно познакомиться. Welcome to the team = добро пожаловать в команду.' },
        { type: 'task', taskType: 'fill_blank', question: 'Вопрос новому коллеге: "What ___ do you use?" (технологии)', solution: 'technologies / tools', explanation: '"What technologies do you use?" — Какие технологии вы используете?' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Let me show you around the office."', solution: 'Позвольте показать вам офис.', explanation: 'Let me show you around = позвольте показать вам. around the office = по офису.' },
        { type: 'task', taskType: 'fill_blank', question: '"Feel ___ to ask if you have any questions." (свободно)', solution: 'free', explanation: '"Feel free to ask if you have any questions." — Не стесняйтесь спрашивать, если есть вопросы.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "I\'m happy to be part of the team."', solution: 'Я рад быть частью команды.', explanation: 'I\'m happy to be = я рад быть. part of the team = частью команды.' },
        { type: 'task', taskType: 'fill_blank', question: '"Can you add me to the ___ channels?" (Slack)', solution: 'Slack', explanation: '"Can you add me to the Slack channels?" — Можете добавить меня в Slack-каналы?' },
        { type: 'task', taskType: 'translate', question: 'Переведите ответ: "Of course! What\'s your Slack username?"', solution: 'Конечно! Какой у тебя никнейм в Slack?', explanation: 'Of course! = конечно! What\'s = what is = какой. Slack username = никнейм в Slack.' }
      ]
    },
    {
      id: 2,
      title: 'Диалог: Code Review',
      type: 'practice',
      content: [
        { type: 'task', taskType: 'translate', question: 'Переведите: "I left some comments on your PR."', solution: 'Я оставил несколько комментариев к твоему PR.', explanation: 'left = оставил (прошедшее от leave). some comments = несколько комментариев. your PR = твой PR.' },
        { type: 'task', taskType: 'fill_blank', question: '"___ you explain the logic here?" (Не мог бы)', solution: 'Could', explanation: '"Could you explain the logic here?" — Не мог бы ты объяснить логику здесь?' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "I see your point. I\'ll update the code."', solution: 'Понимаю твою точку зрения. Обновлю код.', explanation: 'I see your point = понимаю твою точку зрения. I\'ll update = обновлю (Future Simple).' },
        { type: 'task', taskType: 'fill_blank', question: '"Could you add ___ for this edge case?" (тест)', solution: 'a test', explanation: '"Could you add a test for this edge case?" — добавить тест для граничного случая.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "LGTM! Great work on this PR."', solution: 'Выглядит хорошо! Отличная работа над этим PR.', explanation: 'LGTM = Looks Good To Me. Great work = отличная работа.' },
        { type: 'task', taskType: 'fill_blank', question: '"The logic ___ correct, but the naming could be better." (is/are)', solution: 'is', explanation: '"The logic is correct, but the naming could be better." — is для "logic" (единственное число).' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Thanks for the feedback! I\'ll address all comments."', solution: 'Спасибо за обратную связь! Разберусь со всеми комментариями.', explanation: 'Thanks for the feedback = спасибо за обратную связь. I\'ll address = разберусь с / отвечу на.' },
        { type: 'task', taskType: 'fill_blank', question: '"Can you ___ this PR after my changes?" (проверить снова)', solution: 're-review', explanation: '"Can you re-review this PR after my changes?" — повторно проверить после изменений.' }
      ]
    },
    {
      id: 3,
      title: 'Диалог: Решение проблемы',
      type: 'practice',
      content: [
        { type: 'task', taskType: 'translate', question: 'Переведите: "Hey, do you have a minute? I\'m stuck on something."', solution: 'Привет, есть минутка? Я застрял на чём-то.', explanation: 'do you have a minute? = есть минутка? I\'m stuck on something = застрял на чём-то.' },
        { type: 'task', taskType: 'fill_blank', question: '"Sure! What\'s ___ problem?" (the/a)', solution: 'the', explanation: '"What\'s the problem?" — что за проблема? the problem = конкретная проблема, с которой пришли.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "The API keeps returning a 403 error."', solution: 'API постоянно возвращает ошибку 403.', explanation: 'keeps returning = постоянно возвращает (keep + gerund = постоянно делать). a 403 error = ошибка 403.' },
        { type: 'task', taskType: 'fill_blank', question: '"Did you ___ your authentication token?" (проверить)', solution: 'check', explanation: '"Did you check your authentication token?" — ты проверял токен аутентификации?' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Oh, you\'re right! The token was expired."', solution: 'О, ты прав! Токен истёк.', explanation: 'You\'re right = ты прав. The token was expired = токен истёк (was expired = пассивный залог).' },
        { type: 'task', taskType: 'fill_blank', question: '"That ___ the issue! Generate a new token." (is/was)', solution: 'was', explanation: '"That was the issue!" — вот в чём была проблема! Прошедшее время — проблема уже решена.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Thanks for your help. I would have been stuck all day."', solution: 'Спасибо за помощь. Я бы застрял на весь день.', explanation: 'Thanks for your help = спасибо за помощь. I would have been stuck = я бы застрял (сослагательное).' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "No problem! Let me know if you need anything else."', solution: 'Не проблема! Дай знать, если нужно что-то ещё.', explanation: 'No problem = не проблема. Let me know = дай знать. if you need anything else = если нужно что-то ещё.' }
      ]
    },
    {
      id: 4,
      title: 'Офисные фразы: Согласие и несогласие',
      type: 'practice',
      content: [
        { type: 'task', taskType: 'multiple_choice', question: 'Как вежливо не согласиться?', options: ['I see it differently.', 'You\'re wrong!', 'No way!', 'That\'s stupid.'], correct: 0, explanation: '"I see it differently" — я вижу это иначе. Вежливый способ выразить несогласие.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "That\'s a good point, but have you considered the scalability?"', solution: 'Хорошее замечание, но вы рассматривали вопрос масштабируемости?', explanation: 'That\'s a good point = хорошее замечание. have you considered = вы рассматривали. scalability = масштабируемость.' },
        { type: 'task', taskType: 'fill_blank', question: '"I ___ with your approach." (согласен)', solution: 'agree', explanation: '"I agree with your approach." — Я согласен с твоим подходом.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Absolutely! That makes perfect sense."', solution: 'Абсолютно! Это имеет полный смысл.', explanation: 'Absolutely = абсолютно (сильное согласие). makes perfect sense = имеет полный смысл.' },
        { type: 'task', taskType: 'fill_blank', question: '"I\'m not ___ about this approach." (уверен)', solution: 'sure', explanation: '"I\'m not sure about this approach." — Я не уверен в этом подходе (мягкое несогласие).' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Let\'s try both approaches and compare the results."', solution: 'Давайте попробуем оба подхода и сравним результаты.', explanation: 'Let\'s try = давайте попробуем. both approaches = оба подхода. compare the results = сравним результаты.' },
        { type: 'task', taskType: 'fill_blank', question: '"What do you ___?" (думаешь)', solution: 'think', explanation: '"What do you think?" — Что ты думаешь? Стандартный вопрос для получения мнения.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "I think we should discuss this with the whole team."', solution: 'Я думаю, нам нужно обсудить это со всей командой.', explanation: 'I think = я думаю. we should = нам следует. discuss = обсудить. with the whole team = со всей командой.' }
      ]
    },
    {
      id: 5,
      title: 'Чат-сообщения (Slack)',
      type: 'practice',
      content: [
        { type: 'task', taskType: 'translate', question: 'Переведите Slack-сообщение: "Hey @alex, can you review this PR? lmk if you have questions"', solution: 'Привет @alex, можешь проверить этот PR? Дай знать, если есть вопросы.', explanation: 'lmk = let me know = дай знать. Неформальный стиль чата.' },
        { type: 'task', taskType: 'fill_blank', question: '"The deploy is done. All good 👍" — что значит "all good"?', solution: 'всё хорошо / всё в порядке', explanation: '"All good" = всё хорошо, всё в порядке. Неформальное подтверждение.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "brb, grabbing coffee"', solution: 'скоро вернусь, иду за кофе', explanation: 'brb = be right back = скоро вернусь. grabbing coffee = иду взять кофе.' },
        { type: 'task', taskType: 'fill_blank', question: '"___! Servers are back up." (Отличные новости)', solution: 'Great news', explanation: '"Great news! Servers are back up." — Отличные новости! Серверы снова работают.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "on it! 🚀"', solution: 'работаю над этим! / занимаюсь!', explanation: '"on it" = занимаюсь этим прямо сейчас. Сокращение от "I\'m on it".' },
        { type: 'task', taskType: 'fill_blank', question: '"Thanks for the heads ___!" (предупреждение)', solution: 'up', explanation: '"Thanks for the heads up!" — спасибо за предупреждение! "heads up" = предупреждение заранее.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "EOD update: fixed 3 tickets, 1 still in progress"', solution: 'Обновление на конец дня: исправил 3 тикета, 1 ещё в процессе.', explanation: 'EOD = End of Day = конец рабочего дня. still in progress = ещё в процессе.' },
        { type: 'task', taskType: 'multiple_choice', question: 'Что означает "+1" в контексте обсуждения?', options: ['Согласен', 'Плюс один человек', 'Ошибка', 'Непонятно'], correct: 0, explanation: '"+1" в чате = согласен / поддерживаю это предложение. Из культуры open source.' }
      ]
    },
    {
      id: 6,
      title: 'Фразы для встреч (meetings)',
      type: 'practice',
      content: [
        { type: 'task', taskType: 'translate', question: 'Переведите: "Let\'s get the meeting started."', solution: 'Начнём встречу.', explanation: '"Let\'s get started" = начнём. "Let\'s get the meeting started" = начнём встречу.' },
        { type: 'task', taskType: 'fill_blank', question: '"Can everyone ___ me?" (слышит)', solution: 'hear', explanation: '"Can everyone hear me?" — Всем меня слышно? Стандартное начало онлайн-встречи.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Sorry to interrupt, but I have a question."', solution: 'Прошу прощения за прерывание, но у меня вопрос.', explanation: 'Sorry to interrupt = прошу прощения за прерывание. but I have a question = но у меня вопрос.' },
        { type: 'task', taskType: 'fill_blank', question: '"Could you ___ that again? I didn\'t catch it." (повторить)', solution: 'repeat', explanation: '"Could you repeat that again?" — Не могли бы вы повторить? I didn\'t catch it = я не расслышал.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Let\'s take a 5-minute break."', solution: 'Сделаем 5-минутный перерыв.', explanation: 'Let\'s take a break = сделаем перерыв. 5-minute break = 5-минутный перерыв.' },
        { type: 'task', taskType: 'fill_blank', question: '"Let\'s ___ up." (подведём итоги)', solution: 'wrap', explanation: '"Let\'s wrap up." — Подведём итоги / Заканчиваем встречу.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Action items: Alex will fix the bug, Maria will update the design."', solution: 'Задачи: Алекс исправит баг, Мария обновит дизайн.', explanation: 'Action items = задачи по итогам встречи. will fix = исправит (Future Simple). will update = обновит.' },
        { type: 'task', taskType: 'fill_blank', question: '"Any final ___ before we close?" (вопросы)', solution: 'questions', explanation: '"Any final questions before we close?" — Есть финальные вопросы перед закрытием встречи?' }
      ]
    },
    {
      id: 7,
      title: 'Фразы на стендапе',
      type: 'practice',
      content: [
        { type: 'task', taskType: 'translate', question: 'Переведите: "Yesterday I worked on the payment integration."', solution: 'Вчера я работал над интеграцией платёжной системы.', explanation: 'worked on = работал над. payment integration = интеграция платёжной системы.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Today I\'m continuing the same task."', solution: 'Сегодня я продолжаю ту же задачу.', explanation: 'I\'m continuing = продолжаю (Present Continuous). the same task = ту же задачу.' },
        { type: 'task', taskType: 'fill_blank', question: '"I have one ___: I\'m waiting for the design mockups." (блокер)', solution: 'blocker', explanation: '"I have one blocker: I\'m waiting for the design mockups." — один блокер: жду макеты.' },
        { type: 'task', taskType: 'translate', question: 'Переведите стендап-ответ: "Вчера: исправил баг с пагинацией. Сегодня: пишу тесты. Блокеров нет."', solution: 'Yesterday: fixed the pagination bug. Today: writing tests. No blockers.', explanation: 'Формат стендапа: Yesterday/Today/Blockers. Краткие предложения.' },
        { type: 'task', taskType: 'fill_blank', question: '"The task ___ be done by tomorrow." (будет)', solution: 'will', explanation: '"The task will be done by tomorrow." — задача будет выполнена к завтрашнему дню.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "I need to sync with the design team first."', solution: 'Мне нужно сначала синхронизироваться с дизайн-командой.', explanation: 'sync with = синхронизироваться с / переговорить с. the design team = дизайн-команда. first = сначала.' },
        { type: 'task', taskType: 'fill_blank', question: '"I\'m blocked on ___." (задача #42)', solution: 'ticket #42 / issue #42', explanation: '"I\'m blocked on ticket #42." — Я заблокирован задачей #42.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Can someone take this ticket? I\'m overloaded."', solution: 'Может кто-нибудь взять этот тикет? Я перегружен.', explanation: 'Can someone take this ticket? = может кто-нибудь взять? I\'m overloaded = я перегружен.' }
      ]
    },
    {
      id: 8,
      title: 'Собеседование: вопросы и ответы',
      type: 'practice',
      content: [
        { type: 'task', taskType: 'translate', question: 'Вопрос интервью: "Why do you want to leave your current job?"', solution: 'Почему вы хотите уйти с текущей работы?', explanation: 'Why do you want to leave = почему хотите уйти. current job = текущая работа.' },
        { type: 'task', taskType: 'translate', question: 'Ответ на интервью: "I\'m looking for new challenges and growth opportunities."', solution: 'Я ищу новые вызовы и возможности для роста.', explanation: 'looking for = ищу. new challenges = новые вызовы. growth opportunities = возможности для роста.' },
        { type: 'task', taskType: 'fill_blank', question: '"What is your ___ salary?" (желаемая)', solution: 'expected / desired', explanation: '"What is your expected salary?" — Какова ваша желаемая зарплата?' },
        { type: 'task', taskType: 'translate', question: 'Ответ на "Tell me about a challenge you faced."', solution: 'Расскажите о проблеме, с которой вы столкнулись.', explanation: 'Tell me about = расскажите о. a challenge = проблема/вызов. you faced = с которой столкнулись.' },
        { type: 'task', taskType: 'fill_blank', question: '"I\'m a ___ learner and adapt quickly." (быстрый)', solution: 'fast / quick', explanation: '"I\'m a fast learner and adapt quickly." — Я быстро учусь и адаптируюсь.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Do you have any questions for us?"', solution: 'Есть ли у вас вопросы к нам?', explanation: 'Do you have any questions = есть ли у вас вопросы. for us = к нам.' },
        { type: 'task', taskType: 'translate', question: 'Хороший вопрос на интервью: "What does a typical day look like for this role?"', solution: 'Как выглядит типичный день на этой позиции?', explanation: 'What does...look like = как выглядит. a typical day = типичный день. for this role = для этой роли.' },
        { type: 'task', taskType: 'fill_blank', question: '"When can you ___?" (начать работу)', solution: 'start', explanation: '"When can you start?" — Когда вы можете начать? Вопрос о дате выхода на работу.' }
      ]
    },
    {
      id: 9,
      title: 'Вежливые фразы и этикет',
      type: 'practice',
      content: [
        { type: 'task', taskType: 'multiple_choice', question: 'Самый вежливый способ попросить о помощи:', options: ['Would you mind helping me?', 'Help me!', 'Can you help?', 'I need help.'], correct: 0, explanation: '"Would you mind helping me?" — самая вежливая форма запроса. Буквально: "Вы не против помочь мне?"' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "I apologize for the delay in responding."', solution: 'Приношу извинения за задержку с ответом.', explanation: 'I apologize = приношу извинения. for the delay = за задержку. in responding = с ответом.' },
        { type: 'task', taskType: 'fill_blank', question: '"Thank you for your ___." (patience = терпение)', solution: 'patience', explanation: '"Thank you for your patience." — спасибо за ваше терпение. Фраза после решения проблемы.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "I\'ll get back to you as soon as possible."', solution: 'Свяжусь с вами как можно скорее.', explanation: '"get back to you" = связаться с вами. as soon as possible = как можно скорее (ASAP).' },
        { type: 'task', taskType: 'fill_blank', question: '"___ hesitate to reach out if you need anything." (не стесняйтесь)', solution: 'Don\'t', explanation: '"Don\'t hesitate to reach out if you need anything." — Не стесняйтесь обращаться, если нужно.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "That\'s a great suggestion!"', solution: 'Это отличное предложение!', explanation: 'That\'s = that is. a great suggestion = отличное предложение.' },
        { type: 'task', taskType: 'fill_blank', question: '"I\'ll keep you ___ of any updates." (в курсе)', solution: 'posted / informed', explanation: '"I\'ll keep you posted." — буду держать вас в курсе. Или "informed" = информированным.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Your help is greatly appreciated."', solution: 'Ваша помощь очень ценится.', explanation: 'is greatly appreciated = очень ценится (пассивный залог). Вежливое выражение благодарности.' }
      ]
    },
    {
      id: 10,
      title: 'Диалоги: Финальная практика',
      type: 'practice',
      content: [
        {
          type: 'task', taskType: 'complete_dialogue',
          dialogue: 'A: Good morning! How are you?\nB: ___\nA: Great! Are you ready for the sprint planning?\nB: ___\nA: Perfect. Let\'s start in 5 minutes.',
          question: 'Составьте ответы для B (два ответа)',
          solution: 'B1: Fine, thanks! And you? / Pretty good, thanks!\nB2: Yes, I am! / I\'m ready!',
          explanation: 'Стандартные ответы на small talk и вопрос о готовности.'
        },
        {
          type: 'task', taskType: 'complete_dialogue',
          dialogue: 'A: I found a bug in the login module.\nB: ___\nA: It crashes when the email is empty.\nB: ___',
          question: 'Составьте ответы для B',
          solution: 'B1: What\'s the issue? / Can you describe the bug?\nB2: I\'ll take a look. / I\'ll fix it today.',
          explanation: 'При сообщении о баге: уточняющий вопрос + обещание исправить.'
        },
        { type: 'task', taskType: 'translate', question: 'Переведите короткий диалог: "- Я заблокирован. - В чём проблема? - Жду ответа от API-команды."', solution: 'A: I\'m blocked. B: What\'s the problem? A: I\'m waiting for a response from the API team.', explanation: 'I\'m blocked = я заблокирован. What\'s the problem? = в чём проблема? I\'m waiting for = жду.' },
        { type: 'task', taskType: 'fill_blank', question: 'Завершите ответ на code review: "Good point! I\'ll ___ the variable name." (переименую)', solution: 'rename', explanation: '"Good point! I\'ll rename the variable name." — Хорошее замечание! Переименую переменную.' },
        { type: 'task', taskType: 'translate', question: 'Переведите: "Thanks for the meeting! See you at the next standup."', solution: 'Спасибо за встречу! До встречи на следующем стендапе.', explanation: 'Thanks for the meeting = спасибо за встречу. See you at = до встречи на.' },
        { type: 'task', taskType: 'fill_blank', question: '"I\'m available for a call ___ 2 PM." (после)', solution: 'after', explanation: '"I\'m available for a call after 2 PM." — Я доступен для звонка после 14:00.' },
        { type: 'task', taskType: 'translate', question: 'Как закончить рабочий день в Slack?', solution: 'Signing off for the day! Have a great evening. / EOD - logging off now. See you tomorrow!', explanation: 'Signing off = выхожу на связи. Have a great evening = хорошего вечера. EOD = конец рабочего дня.' },
        { type: 'task', taskType: 'translate', question: 'Переведите финальный диалог: "Задача выполнена. Тесты проходят. PR открыт. Можешь проверить?"', solution: 'Task is done. Tests are passing. PR is open. Can you review it?', explanation: 'is done = выполнена, are passing = проходят, is open = открыт, Can you review? = можешь проверить?' }
      ]
    }
  ]
}
