export default {
  id: 4,
  title: 'Местоимения (I, you, he, she, it, we, they)',
  description: 'Личные, притяжательные и объектные местоимения',
  lessons: [
    {
      id: 1,
      title: 'Личные местоимения (Subject Pronouns)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Личные местоимения заменяют имена существительных. Они стоят перед глаголом и являются подлежащим предложения.' },
        { type: 'code', language: 'text', value: 'Личные местоимения:\nI        - я\nYou      - ты / вы\nHe       - он\nShe      - она\nIt       - оно (предмет, животное, явление)\nWe       - мы\nThey     - они' },
        { type: 'code', language: 'text', value: 'Примеры:\nI write code.              - Я пишу код.\nYou are a good developer.  - Ты хороший разработчик.\nHe fixes bugs.             - Он исправляет баги.\nShe reviews pull requests. - Она проверяет пул-реквесты.\nIt is a new feature.       - Это новая фича.\nWe deploy on Fridays.      - Мы деплоим по пятницам.\nThey use microservices.    - Они используют микросервисы.' },
        { type: 'note', value: 'В IT "it" часто относится к программе, серверу, функции, переменной: "It returns null", "It takes two arguments", "It is running on port 3000".' }
      ]
    },
    {
      id: 2,
      title: 'Объектные местоимения (Object Pronouns)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Объектные местоимения стоят после глагола или предлога. Они отвечают на вопрос "кого? кому? с кем?"' },
        { type: 'code', language: 'text', value: 'Подлежащее → Дополнение:\nI   → me     (мне/меня)\nYou → you    (тебе/тебя)\nHe  → him    (ему/его)\nShe → her    (ей/её)\nIt  → it     (ему/его/ей)\nWe  → us     (нам/нас)\nThey→ them   (им/их)' },
        { type: 'code', language: 'text', value: 'Примеры:\nSend me the link.          - Пришли мне ссылку.\nCan you help me?           - Можешь помочь мне?\nTell him about the bug.    - Скажи ему о баге.\nI\'ll ask her.              - Я спрошу её.\nTest it first.             - Сначала протестируй это.\nWe need them to fix it.    - Нам нужно, чтобы они это исправили.\nContact us on Slack.       - Свяжитесь с нами в Slack.' }
      ]
    },
    {
      id: 3,
      title: 'Притяжательные местоимения (Possessive)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Притяжательные местоимения показывают принадлежность. Есть два вида: прилагательные (my, your...) и самостоятельные (mine, yours...).' },
        { type: 'code', language: 'text', value: 'Притяжательные прилагательные (перед существительным):\nmy      - мой/моя/моё\nyour    - твой/ваш\nhis     - его\nher     - её\nits     - его/её (предмета)\nour     - наш\ntheir   - их' },
        { type: 'code', language: 'text', value: 'Примеры в IT:\nmy code       - мой код\nyour branch   - твоя ветка\nhis commit    - его коммит\nher function  - её функция\nits value     - его значение (переменной)\nour project   - наш проект\ntheir API     - их API\n\nПредложения:\nThis is my repository.     - Это мой репозиторий.\nWhat is your GitHub name?  - Что твой GitHub-ник?\nCheck its documentation.   - Проверь его документацию.' },
        { type: 'warning', value: 'Не путайте "its" (притяжательное) и "it\'s" (it is)!\n"its value" = значение чего-то (без апострофа)\n"it\'s a bug" = это баг (с апострофом, сокращение it is)' }
      ]
    },
    {
      id: 4,
      title: 'Возвратные местоимения (Reflexive Pronouns)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Возвратные местоимения оканчиваются на -self (единственное число) или -selves (множественное). Они означают "сам/сама/само".' },
        { type: 'code', language: 'text', value: 'Возвратные местоимения:\nmyself      - я сам\nyourself    - ты сам\nhimself     - он сам\nherself     - она сама\nitself      - само\nourselves   - мы сами\nyourselves  - вы сами\nthemselves  - они сами' },
        { type: 'code', language: 'text', value: 'Примеры:\nI did it myself.            - Я сделал это сам.\nThe program runs itself.    - Программа запускается сама.\nFix it yourself.            - Исправь это сам.\nThe system updates itself.  - Система обновляется сама.\nWe built it ourselves.      - Мы создали это сами.' },
        { type: 'tip', value: 'В документации часто: "The application automatically restarts itself" (Приложение автоматически перезапускается), "Configure it yourself" (Настройте сами).' }
      ]
    },
    {
      id: 5,
      title: 'Местоимение "it" в особых случаях',
      type: 'theory',
      content: [
        { type: 'text', value: 'Местоимение "it" в английском используется намного чаще, чем в русском. Оно нужно в безличных предложениях, где в русском подлежащего нет.' },
        { type: 'code', language: 'text', value: 'Безличное "it" (не переводится):\nIt is important to test.     - Важно тестировать.\nIt is easy to use.           - Легко использовать.\nIt takes time.               - Это занимает время.\nIt works!                    - Работает!\nIt depends.                  - Зависит (от ситуации).\nIt is possible.              - Это возможно.' },
        { type: 'code', language: 'text', value: 'IT-примеры:\nIt is a best practice.       - Это лучшая практика.\nIt takes 5 minutes to build. - Сборка занимает 5 минут.\nIt is faster than v1.        - Это быстрее, чем v1.\nIt runs on Node.js.          - Работает на Node.js.\nIt supports TypeScript.      - Поддерживает TypeScript.' },
        { type: 'note', value: '"It" также используется для обозначения времени, погоды и расстояний: "It is Monday", "It is cold today". В IT это редко, но важно знать.' }
      ]
    },
    {
      id: 6,
      title: 'This, that, these, those — указательные местоимения',
      type: 'theory',
      content: [
        { type: 'text', value: 'Указательные местоимения используются для указания на предметы. This/these — для близких, that/those — для далёких или уже упомянутых.' },
        { type: 'code', language: 'text', value: 'Единственное число:\nThis - этот/эта/это (близко)\nThat - тот/та/то (далеко или уже известно)\n\nМножественное число:\nThese - эти (близко)\nThose - те (далеко или уже известно)' },
        { type: 'code', language: 'text', value: 'Примеры в IT:\nThis code is clean.         - Этот код чистый.\nThat bug is fixed.          - Тот баг исправлен.\nThese tests are failing.    - Эти тесты падают.\nThose requirements changed. - Те требования изменились.\n\nThis is a good approach.    - Это хороший подход.\nThat is not a good idea.    - Это не хорошая идея.\nThis is my branch.          - Это моя ветка.\nThat was a hard bug to fix. - Тот баг было сложно исправить.' },
        { type: 'tip', value: '"That\'s a good point" (Хорошее замечание), "This is taking too long" (Это занимает слишком много времени), "Those are the requirements" (Это требования) — часто используемые фразы в работе.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Местоимения',
      type: 'practice',
      content: [
        {
          type: 'task',
          taskType: 'fill_blank',
          question: 'Замените существительное местоимением: "The server is down. ___ needs a restart."',
          solution: 'It',
          explanation: '"The server" — неодушевлённый предмет, заменяем на "it". "It needs a restart." — Оно нуждается в перезапуске.'
        },
        {
          type: 'task',
          taskType: 'fill_blank',
          question: 'Вставьте притяжательное местоимение: "Can I see ___ code?" (обращение к одному коллеге)',
          solution: 'your',
          explanation: '"Can I see your code?" — Могу я посмотреть твой код? Your — притяжательное местоимение для "you".'
        },
        {
          type: 'task',
          taskType: 'translate',
          question: 'Переведите: "Это не моя ошибка, это его баг."',
          solution: 'It\'s not my fault, it\'s his bug.',
          explanation: 'my = мой, his = его. "fault" = вина/ошибка, "bug" = баг. Используем "it\'s" = it is.'
        },
        {
          type: 'task',
          taskType: 'multiple_choice',
          question: 'Выберите правильный вариант: "The app updates ___."',
          options: ['itself', 'itself\'s', 'it', 'its'],
          correct: 0,
          explanation: '"The app updates itself." — Приложение обновляется само. Возвратное местоимение "itself" для неодушевлённого предмета.'
        }
      ]
    }
  ]
}
