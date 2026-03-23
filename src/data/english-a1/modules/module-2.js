export default {
  id: 2,
  title: 'Глагол to be',
  description: 'Глагол to be (am/is/are) — утверждения, отрицания, вопросы',
  lessons: [
    {
      id: 1,
      title: 'Что такое глагол to be?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Глагол "to be" означает "быть/являться". Это самый важный глагол в английском языке. В Present Simple он имеет три формы: am, is, are.' },
        { type: 'code', language: 'text', value: 'Формы глагола to be:\nI am         - я есть/являюсь\nHe is        - он есть\nShe is       - она есть\nIt is        - оно есть\nWe are       - мы есть\nYou are      - вы/ты есть\nThey are     - они есть' },
        { type: 'code', language: 'text', value: 'Примеры:\nI am a developer.        - Я разработчик.\nHe is a programmer.      - Он программист.\nShe is a tester.         - Она тестировщик.\nIt is a bug.             - Это баг.\nWe are a team.           - Мы команда.\nYou are a user.          - Ты/вы пользователь.\nThey are developers.     - Они разработчики.' },
        { type: 'tip', value: 'Запомните правило: I → am, he/she/it → is, we/you/they → are. В IT: "The server IS running", "I AM a backend developer", "They ARE fixing the bug".' }
      ]
    },
    {
      id: 2,
      title: 'Сокращённые формы (contractions)',
      type: 'theory',
      content: [
        { type: 'text', value: 'В разговорной речи и неформальных текстах глагол to be часто сокращается. В коде, комментариях и чатах с коллегами вы увидите сокращения постоянно.' },
        { type: 'code', language: 'text', value: 'Полная форма → Сокращение:\nI am     → I\'m\nHe is    → He\'s\nShe is   → She\'s\nIt is    → It\'s\nWe are   → We\'re\nYou are  → You\'re\nThey are → They\'re' },
        { type: 'code', language: 'text', value: 'Примеры в IT-контексте:\nI\'m a full-stack developer.   - Я фулстек-разработчик.\nIt\'s a critical bug.          - Это критический баг.\nWe\'re on the same team.       - Мы в одной команде.\nThey\'re running the tests.    - Они запускают тесты.\nYou\'re the lead developer.    - Ты ведущий разработчик.' },
        { type: 'note', value: 'Апостроф (\') заменяет пропущенную букву или буквы. "I\'m" = "I am" (пропущена буква "a"). Важно не путать "it\'s" (it is) и "its" (притяжательное — его/её).' }
      ]
    },
    {
      id: 3,
      title: 'Отрицание с to be',
      type: 'theory',
      content: [
        { type: 'text', value: 'Для образования отрицания с глаголом to be добавляем "not" после глагола: am not, is not, are not. Есть и сокращённые формы.' },
        { type: 'code', language: 'text', value: 'Отрицание:\nI am not     → I\'m not\nHe is not    → He\'s not / He isn\'t\nShe is not   → She\'s not / She isn\'t\nIt is not    → It\'s not / It isn\'t\nWe are not   → We\'re not / We aren\'t\nYou are not  → You\'re not / You aren\'t\nThey are not → They\'re not / They aren\'t' },
        { type: 'code', language: 'text', value: 'Примеры:\nI\'m not a designer.           - Я не дизайнер.\nThis isn\'t a feature, it\'s a bug! - Это не фича, это баг!\nWe aren\'t ready for deploy.   - Мы не готовы к деплою.\nThe server isn\'t available.   - Сервер недоступен.\nThey aren\'t on the same page. - Они не понимают друг друга.' },
        { type: 'tip', value: 'Знаменитая фраза программистов: "It\'s not a bug, it\'s a feature!" — "Это не баг, это фича!" Здесь два раза используется "to be".' }
      ]
    },
    {
      id: 4,
      title: 'Вопросы с to be',
      type: 'theory',
      content: [
        { type: 'text', value: 'Для образования вопроса глагол to be выносится на первое место (инверсия): Am I...? Is he...? Are you...?' },
        { type: 'code', language: 'text', value: 'Общие вопросы (Yes/No questions):\nAm I correct?           - Я правильно понимаю?\nIs he a developer?      - Он разработчик?\nIs she available?       - Она доступна (свободна)?\nIs it a bug?            - Это баг?\nAre we on track?        - Мы идём по плану?\nAre you the team lead?  - Вы тимлид?\nAre they ready?         - Они готовы?' },
        { type: 'code', language: 'text', value: 'Ответы:\nYes, I am. / No, I\'m not.\nYes, he is. / No, he isn\'t.\nYes, it is. / No, it isn\'t.\nYes, we are. / No, we aren\'t.\nYes, they are. / No, they aren\'t.\n\nПример диалога:\n- Is the server down?     - Сервер упал?\n- Yes, it is.             - Да.\n- Are the tests failing?  - Тесты падают?\n- No, they aren\'t.        - Нет.' },
        { type: 'note', value: 'В кратких ответах нельзя использовать сокращение: "Yes, it\'s." — НЕПРАВИЛЬНО. "Yes, it is." — ПРАВИЛЬНО. Только в отрицательных можно: "No, it isn\'t."' }
      ]
    },
    {
      id: 5,
      title: 'Специальные вопросы с to be',
      type: 'theory',
      content: [
        { type: 'text', value: 'Специальные вопросы начинаются с вопросительного слова (What, Where, Who, How) и требуют развёрнутого ответа.' },
        { type: 'code', language: 'text', value: 'Структура: Question word + to be + subject?\nWhat is your name?      - Как тебя зовут?\nWhere are you from?     - Откуда ты?\nWho is the team lead?   - Кто тимлид?\nHow are you?            - Как дела?\nWhat is your role?      - Какова твоя роль?\nWhere is the bug?       - Где баг?\nWhat is the error?      - Какая ошибка?' },
        { type: 'code', language: 'text', value: 'IT-диалог:\n- What is your job title?    - Какая у тебя должность?\n- I\'m a backend developer.   - Я бэкенд-разработчик.\n- Where is the repository?   - Где репозиторий?\n- It\'s on GitHub.            - На GitHub.\n- Who is responsible?        - Кто ответственный?\n- I\'m the one.               - Я отвечаю.' },
        { type: 'tip', value: 'Часто используемые IT-фразы: "What is the status?" (Какой статус?), "Where is the documentation?" (Где документация?), "Who is on call?" (Кто дежурит?).' }
      ]
    },
    {
      id: 6,
      title: 'To be с профессиями и описаниями',
      type: 'theory',
      content: [
        { type: 'text', value: 'Глагол to be используется для описания профессий, качеств и состояний. Это самый частый способ представиться и описать кого-то.' },
        { type: 'code', language: 'text', value: 'Профессии в IT:\nI am a developer.          - Я разработчик.\nShe is a UX designer.      - Она UX-дизайнер.\nHe is a DevOps engineer.   - Он DevOps-инженер.\nWe are a startup.          - Мы стартап.\nThey are a remote team.    - Они удалённая команда.' },
        { type: 'code', language: 'text', value: 'Описания и состояния:\nThe code is clean.         - Код чистый.\nThe bug is critical.       - Баг критический.\nThe deadline is tomorrow.  - Дедлайн завтра.\nThe API is ready.          - API готово.\nThe tests are green.       - Тесты зелёные (проходят).\nThe server is down.        - Сервер упал.' },
        { type: 'warning', value: 'После "to be" артикль ставится перед профессией: "I am A developer" (не "I am developer"). Исключение — когда есть прилагательное: "I am A senior developer".' }
      ]
    },
    {
      id: 7,
      title: 'Практика: To be — утверждения',
      type: 'practice',
      content: [
        {
          type: 'task',
          taskType: 'fill_blank',
          question: 'Вставьте правильную форму: "She ___ a frontend developer."',
          solution: 'is',
          explanation: 'She → is. "She is a frontend developer." — Она фронтенд-разработчик.'
        },
        {
          type: 'task',
          taskType: 'fill_blank',
          question: 'Вставьте правильную форму: "We ___ ready to deploy."',
          solution: 'are',
          explanation: 'We → are. "We are ready to deploy." — Мы готовы к деплою.'
        },
        {
          type: 'task',
          taskType: 'translate',
          question: 'Переведите на английский: "Это критический баг."',
          solution: 'It is a critical bug. / It\'s a critical bug.',
          explanation: 'It → is. Слово "bug" требует артикль "a" перед собой, т.к. это исчисляемое существительное в единственном числе.'
        },
        {
          type: 'task',
          taskType: 'translate',
          question: 'Переведите на английский: "Они разработчики."',
          solution: 'They are developers.',
          explanation: 'They → are. "Developers" — множественное число, поэтому артикль не нужен.'
        }
      ]
    },
    {
      id: 8,
      title: 'Практика: To be — вопросы и отрицания',
      type: 'practice',
      content: [
        {
          type: 'task',
          taskType: 'fill_blank',
          question: 'Образуйте вопрос: "___ the server down?" (Сервер упал?)',
          solution: 'Is',
          explanation: '"Is the server down?" — вопрос с "it" (the server = оно), поэтому используем "Is".'
        },
        {
          type: 'task',
          taskType: 'translate',
          question: 'Переведите: "The tests aren\'t ready."',
          solution: 'Тесты не готовы.',
          explanation: 'aren\'t = are not. "The tests are not ready." — Тесты не готовы.'
        },
        {
          type: 'task',
          taskType: 'multiple_choice',
          question: 'Выберите правильный ответ на вопрос "Is she the team lead?"',
          options: ['Yes, she is.', 'Yes, she\'s.', 'Yes, is she.', 'Yes, she are.'],
          correct: 0,
          explanation: 'В кратком положительном ответе нельзя использовать сокращение. "Yes, she is." — правильно.'
        },
        {
          type: 'task',
          taskType: 'translate',
          question: 'Переведите: "Где документация?" (используйте where + is)',
          solution: 'Where is the documentation?',
          explanation: 'Where + is + the + noun. "Documentation" — существительное, поэтому нужен артикль "the".'
        }
      ]
    }
  ]
}
