export default {
  id: 8,
  title: 'Предлоги места и времени',
  description: 'Предлоги in, on, at, to, from, between для места и времени',
  lessons: [
    {
      id: 1,
      title: 'Предлоги места: in, on, at',
      type: 'theory',
      content: [
        { type: 'text', value: 'Предлоги места — одна из сложных тем для русскоязычных. В русском мы говорим "в" и "на", а в английском есть три основных предлога: in, on, at.' },
        { type: 'code', language: 'text', value: 'IN — внутри чего-то:\nin the office      - в офисе\nin the file        - в файле\nin the code        - в коде\nin the database    - в базе данных\nin the array       - в массиве\nin the loop        - в цикле\nin the folder      - в папке\n\nON — на поверхности / на платформе:\non the screen      - на экране\non GitHub          - на GitHub\non the server      - на сервере\non the website     - на сайте\non Slack           - в Slack\non the team        - в команде' },
        { type: 'code', language: 'text', value: 'AT — в точке / по адресу:\nat port 8080       - на порту 8080\nat line 42         - на строке 42\nat the meeting     - на встрече\nat Google          - в Google (компания)\nat the desk        - за столом\nat the command line- в командной строке\n\nВажные примеры:\nThe bug is in line 42.           - Баг на строке 42.\nThe app runs on port 3000.       - Приложение работает на порту 3000.\nI work at Google.                - Я работаю в Google.' },
        { type: 'tip', value: 'Запомните три ключевых правила: IN — внутри чего-то (in the code, in the file), ON — на платформе или поверхности (on GitHub, on the screen), AT — в конкретной точке (at port 8080, at line 42, at Google).' },
        { type: 'note', value: 'В IT часто путают on и in: "on the server" (на сервере, платформа) vs "in the database" (в базе данных, внутри). "On Slack" — потому что Slack это платформа. "In the code" — внутри кода.' }
      ]
    },
    {
      id: 2,
      title: 'Предлоги времени: in, on, at',
      type: 'theory',
      content: [
        { type: 'text', value: 'Те же предлоги in, on, at используются для времени, но по другим правилам. Это нужно выучить отдельно.' },
        { type: 'code', language: 'text', value: 'AT — точное время, праздники:\nat 9 AM            - в 9 утра\nat noon            - в полдень\nat midnight        - в полночь\nat 3 o\'clock       - в 3 часа\nat the weekend     - на выходных (BE)\n\nON — дни и даты:\non Monday          - в понедельник\non Friday          - в пятницу\non June 5          - 5 июня\non the weekend     - на выходных (AE)\non release day     - в день выпуска\n\nIN — периоды:\nin January         - в январе\nin 2024            - в 2024 году\nin the morning     - утром\nin the evening     - вечером\nin two weeks       - через две недели' },
        { type: 'note', value: 'Правило "большой кусок → маленький кусок": in (большой период) → on (день/дата) → at (точное время). "In January, on Monday, at 9 AM."' },
        { type: 'tip', value: 'В IT-переписке предлоги времени критически важны: "The release is on Friday." (Релиз в пятницу.) "The standup is at 10 AM." (Стендап в 10 утра.) "We deployed in the morning." (Задеплоили утром.) "The deadline is in two weeks." (Дедлайн через две недели.)' },
      ]
    },
    {
      id: 3,
      title: 'Другие предлоги места',
      type: 'theory',
      content: [
        { type: 'text', value: 'Помимо in, on, at существуют другие важные предлоги места, которые часто встречаются в IT-контексте.' },
        { type: 'code', language: 'text', value: 'Предлоги места:\nnext to / beside  - рядом с\nbetween           - между\nabove / over      - выше / над\nbelow / under     - ниже / под\nin front of       - перед\nbehind            - за (сзади)\nnear              - около\noutside           - снаружи\ninside            - внутри' },
        { type: 'code', language: 'text', value: 'Примеры в IT:\nThe button is below the form.   - Кнопка ниже формы.\nThe logo is above the menu.     - Лого выше меню.\nThe data is between these dates.- Данные между этими датами.\nThe function is inside the class.- Функция внутри класса.\nThe comment is above the code.  - Комментарий над кодом.\nThe footer is below the content.- Подвал ниже контента.' },
        { type: 'tip', value: 'В CSS часто используются те же предлоги: "above the fold" (выше сгиба), "below the navigation" (ниже навигации), "next to the sidebar" (рядом с боковой панелью).' }
      ]
    },
    {
      id: 4,
      title: 'Предлоги движения: to, from, into, out of',
      type: 'theory',
      content: [
        { type: 'text', value: 'Предлоги движения используются с глаголами действия — перемещения, передачи данных, запуска процессов.' },
        { type: 'code', language: 'text', value: 'Предлоги движения:\nto           - к, в (направление)\nfrom         - из, от\ninto         - внутрь\nout of       - из, вовне\nthrough      - через\nto/into      - куда-то (с глаголами движения)' },
        { type: 'code', language: 'text', value: 'Примеры в IT:\nDeploy to production.            - Задеплоить в продакшен.\nMove to the next sprint.         - Перейти к следующему спринту.\nMerge into main.                 - Смёрджить в main.\nUpload to the cloud.             - Загрузить в облако.\nDownload from the server.        - Скачать с сервера.\nImport from a module.            - Импортировать из модуля.\nExport to CSV.                   - Экспортировать в CSV.\nLog out of the system.           - Выйти из системы.\nSign in to GitHub.               - Войти в GitHub.' },
        { type: 'note', value: 'В командах git всегда предлог "into": merge feature into main (смёрджить feature в main). В деплое: push to production. В коде: import from module. Эти предлоги фиксированы — запомните их вместе с глаголами.' },
      ]
    },
    {
      id: 5,
      title: 'Предлоги с абстрактными понятиями',
      type: 'theory',
      content: [
        { type: 'text', value: 'В IT много устойчивых выражений с предлогами, которые нужно просто запомнить, потому что логика предлога не очевидна.' },
        { type: 'code', language: 'text', value: 'Устойчивые IT-выражения с предлогами:\nwork on      - работать над (чем-то)\nwork for     - работать в (компании)\ndepend on    - зависеть от\nconnect to   - подключиться к\nlog in to    - войти в\nlog out of   - выйти из\nresponsible for - ответственный за\nsearch for   - искать\nlook at      - посмотреть на\nbased on     - основанный на' },
        { type: 'code', language: 'text', value: 'Примеры:\nI work on the backend team.       - Я работаю в бэкенд-команде.\nThis depends on the database.     - Это зависит от базы данных.\nConnect to the VPN.               - Подключитесь к VPN.\nI\'m responsible for the API.      - Я отвечаю за API.\nThe app is based on React.        - Приложение основано на React.\nSearch for the error in the logs. - Ищите ошибку в логах.' },
        { type: 'warning', value: '"Work in a company" — работать в компании (I work in a startup). "Work on a project" — работать над проектом (I work on the mobile app). Не путайте "in" и "on".' }
      ]
    },
    {
      id: 6,
      title: 'By, with, for, about',
      type: 'theory',
      content: [
        { type: 'text', value: 'Ещё несколько важных предлогов, которые часто встречаются в технической документации и переписке.' },
        { type: 'code', language: 'text', value: 'by    - к (дедлайн), кем сделано:\n  Fix it by Friday.          - Исправьте к пятнице.\n  Written by the team.       - Написано командой.\n  Sort by date.              - Сортировать по дате.\n\nwith  - с, с помощью:\n  Connect with SSH.          - Подключиться по SSH.\n  Test with Postman.         - Тестировать с Postman.\n  Build with Docker.         - Собрать с помощью Docker.\n\nfor   - для, из-за:\n  This is for testing.       - Это для тестирования.\n  Thanks for the review.     - Спасибо за проверку.\n\nabout - о:\n  Tell me about the bug.     - Расскажи о баге.\n  A question about the API.  - Вопрос об API.' },
        { type: 'tip', value: 'Полезные комбинации: "by [дедлайн]" — к дедлайну: "by Friday" (к пятнице). "built with [технология]" — создан на React. "for [цель]" — for backend developers. "talk about [тема]" — about the architecture.' },
      ]
    },
    {
      id: 7,
      title: 'Практика: Предлоги',
      type: 'practice',
      content: [
        {
          type: 'task',
          taskType: 'fill_blank',
          question: 'Выберите предлог: "The meeting is ___ 3 PM."',
          solution: 'at',
          explanation: 'Точное время → at. "The meeting is at 3 PM." — Встреча в 15:00.'
        },
        {
          type: 'task',
          taskType: 'fill_blank',
          question: 'Выберите предлог: "There is a bug ___ line 42."',
          solution: 'in / on',
          explanation: '"in line 42" или "on line 42" — оба варианта правильны. "on line 42" чаще в разговорной речи.'
        },
        {
          type: 'task',
          taskType: 'translate',
          question: 'Переведите: "Задеплойте изменения в продакшен к пятнице."',
          solution: 'Deploy the changes to production by Friday.',
          explanation: 'to production = в продакшен (движение/направление). by Friday = к пятнице (дедлайн).'
        },
        {
          type: 'task',
          taskType: 'multiple_choice',
          question: 'Выберите правильный предлог: "I work ___ a startup."',
          options: ['in', 'on', 'at', 'to'],
          correct: 0,
          explanation: '"Work in a company/organization" — работать в компании. "I work in a startup." — Я работаю в стартапе.'
        }
      ]
    }
  ]
}
