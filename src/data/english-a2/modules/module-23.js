export default {
  id: 23,
  title: 'Reading: Stack Overflow Answers',
  description: 'Чтение и понимание ответов на Stack Overflow: структура, ключевые фразы, как находить решения.',
  lessons: [
    {
      id: 1,
      title: 'Структура Stack Overflow',
      type: 'theory',
      content: [
        { type: 'text', value: 'Stack Overflow — крупнейший сайт вопросов и ответов для программистов.\n\nСтруктура страницы:\nQuestion (вопрос) — описание проблемы пользователя\nTags (теги) — метки с технологиями\nAccepted answer — принятый ответ (отмечен галочкой)\nUpvotes/downvotes — рейтинг ответов\nComments — комментарии\nCode snippet — фрагмент кода\n\nКлючевые слова в вопросах:\nHow do I [action]? (Как мне [действие]?)\nWhy is [thing] not working? (Почему [вещь] не работает?)\nWhat is the difference between [A] and [B]? (В чём разница между [A] и [B]?)\nIs there a way to [action]? (Есть ли способ [действие]?)\nCan I [action] without [thing]? (Могу ли я [действие] без [вещи]?)' }
      ]
    },
    {
      id: 2,
      title: 'Ключевые фразы в ответах',
      type: 'theory',
      content: [
        { type: 'text', value: 'Типичные фразы в ответах Stack Overflow:\n\nОбъяснение причины:\nThe reason this happens is... (Причина этого в том, что...)\nThis is because... (Это потому что...)\nThe issue is caused by... (Проблема вызвана...)\nThe problem is that... (Проблема в том, что...)\n\nПредложение решения:\nYou should use... (Тебе следует использовать...)\nTry using... (Попробуй использовать...)\nThe easiest way to do this is... (Самый простой способ сделать это...)\nA better approach would be... (Лучший подход был бы...)\nInstead of [X], use [Y]. (Вместо [X] используй [Y].)\nYou can also use... (Ты также можешь использовать...)\n\nОбъяснение кода:\nIn the code above... (В коде выше...)\nNote that... (Обрати внимание, что...)\nMake sure that... (Убедись, что...)\nDon\'t forget to... (Не забудь...)\nKeep in mind that... (Имей в виду, что...)' }
      ]
    },
    {
      id: 3,
      title: 'Чтение кода в ответах',
      type: 'theory',
      content: [
        { type: 'text', value: 'Текст Stack Overflow ответа для чтения:\n\nQuestion: How do I read a JSON file in Python?\n\nAnswer (accepted, 1247 upvotes):\nThe simplest way to read a JSON file in Python is to use the built-in json module.\n\n[code: import json]\n[code: with open(\'file.json\', \'r\') as f:]\n[code:     data = json.load(f)]\n\nNote that json.load() reads from a file object, while json.loads() reads from a string.\n\nIf you need to handle encoding issues, specify the encoding:\n[code: with open(\'file.json\', \'r\', encoding=\'utf-8\') as f:]\n\nFor writing, use json.dump() (to file) or json.dumps() (to string).\n\nPosle chteniya:\nWhat does json.load() do? — It reads JSON from a file object.\nWhat is the difference between json.load() and json.loads()? — load() reads from a file, loads() reads from a string.\nWhat should you do if you have encoding issues? — Specify the encoding parameter.' }
      ]
    },
    {
      id: 4,
      title: 'Понимание сложных ответов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Стратегии чтения Stack Overflow:\n\n1. Read the question title first (Сначала прочитай заголовок вопроса)\n2. Check the accepted answer (Проверь принятый ответ)\n3. Look at the code examples (Посмотри на примеры кода)\n4. Read the explanation around the code (Прочитай объяснение вокруг кода)\n5. Check the comments for updates (Проверь комментарии на обновления)\n6. Look at alternative answers (Посмотри на альтернативные ответы)\n\nПолезные слова в ответах:\nedited (отредактировано) — ответ был обновлён\nduplicate (дубликат) — такой вопрос уже был\ndeprecated (устарело) — старый способ, не рекомендуется\nWorking as of [version/date] — работает с версии/даты\nUPDATE: — обновление ответа\nSEE ALSO: — смотрите также' }
      ]
    },
    {
      id: 5,
      title: 'Практический текст: чтение ответа',
      type: 'theory',
      content: [
        { type: 'text', value: 'Stack Overflow Answer:\n\nQuestion: What is the difference between == and === in JavaScript?\n\nBest Answer (3589 upvotes):\n\n== is the abstract equality operator (нестрогое равенство). It performs type conversion before comparing. This means that if you compare values of different types, JavaScript will try to convert them.\n\nExamples:\n0 == false  // true (0 converts to false)\n"1" == 1    // true (string converts to number)\nnull == undefined  // true\n\n=== is the strict equality operator (строгое равенство). It does NOT perform type conversion. Both the value AND the type must be the same.\n\nExamples:\n0 === false  // false (different types)\n"1" === 1   // false (different types)\n1 === 1     // true\n\nBest practice: Always use === unless you specifically need type coercion. Using == can lead to subtle bugs.\n\nПонимание:\n- abstract equality = нестрогое равенство\n- strict equality = строгое равенство\n- type conversion / type coercion = приведение типов\n- subtle bugs = трудноуловимые баги' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Чтение и понимание',
      type: 'practice',
            description: 'Прочитайте фрагмент ответа с Stack Overflow и ответьте на вопросы.',
      solution: 'Правильные ответы:\\n1. Because the server doesn\'t include the proper CORS headers.\\n2. Access-Control-Allow-Origin\\n3. Use the cors middleware package.\\n4. Restrict origins to only trusted domains.\\n5. Самое простое решение — использовать middleware-пакет cors.',
content: [
        { type: 'text', value: 'Прочитайте фрагмент ответа с Stack Overflow и ответьте на вопросы.\n\nAnswer text:\n"The reason you\'re getting a CORS error is that your browser is blocking the request because the server doesn\'t include the proper CORS headers. To fix this, you need to add the Access-Control-Allow-Origin header to your server response. If you\'re using Express.js, the simplest solution is to use the cors middleware package. Install it with npm install cors, then add it to your app: app.use(cors()). This will allow requests from all origins. For production, make sure to restrict origins to only your trusted domains."' },
        {
          type: 'exercise',
          subtype: 'fill_blank',
          items: [
            { id: 1, question: 'Why is the browser blocking the request?', answer: 'Because the server doesn\'t include the proper CORS headers.' },
            { id: 2, question: 'What header needs to be added?', answer: 'Access-Control-Allow-Origin' },
            { id: 3, question: 'What is the simplest solution for Express.js?', answer: 'Use the cors middleware package.' },
            { id: 4, question: 'What should you do in production?', answer: 'Restrict origins to only trusted domains.' },
            { id: 5, question: 'Переведи: "The simplest solution is to use the cors middleware package."', answer: 'Самое простое решение — использовать middleware-пакет cors.' }
          ]
        }
      ]
    },
    {
      id: 7,
      title: 'Практика: Поиск информации',
      type: 'practice',
            description: 'Сформулируйте вопрос для Stack Overflow на английском языке.',
      solution: 'Правильные ответы:\\n1. How do I convert a string to a number in JavaScript?\\n2. Why is my database query running slowly?\\n3. What is the difference between GET and POST requests?\\n4. How do I connect to PostgreSQL from Python?\\n5. Is there a way to run multiple Docker containers at the same time?',
content: [
        { type: 'text', value: 'Сформулируйте вопрос для Stack Overflow на английском языке.' },
        {
          type: 'exercise',
          subtype: 'translation',
          items: [
            { id: 1, question: 'Как мне преобразовать строку в число в JavaScript?', answer: 'How do I convert a string to a number in JavaScript?' },
            { id: 2, question: 'Почему мой запрос к базе данных работает медленно?', answer: 'Why is my database query running slowly?' },
            { id: 3, question: 'В чём разница между GET и POST запросами?', answer: 'What is the difference between GET and POST requests?' },
            { id: 4, question: 'Как подключиться к PostgreSQL из Python?', answer: 'How do I connect to PostgreSQL from Python?' },
            { id: 5, question: 'Есть ли способ запустить несколько Docker контейнеров одновременно?', answer: 'Is there a way to run multiple Docker containers at the same time?' }
          ]
        }
      ]
    },
    {
      id: 8,
      title: 'Практика: Перевод типичных фраз',
      type: 'practice',
            description: 'Переведите фразы с английского на русский.',
      solution: 'Правильные ответы:\\n1. Лучший подход — использовать async/await.\\n2. Убедись, что ты обрабатываешь случай с null.\\n3. Обрати внимание, что этот метод устарел в версии 3.0.\\n4. Имей в виду, что это работает только в Node.js 18+.\\n5. Вместо for...in, используй for...of для массивов.',
content: [
        { type: 'text', value: 'Переведите фразы с английского на русский.' },
        {
          type: 'exercise',
          subtype: 'translation',
          items: [
            { id: 1, question: 'A better approach would be to use async/await.', answer: 'Лучший подход — использовать async/await.' },
            { id: 2, question: 'Make sure you handle the null case.', answer: 'Убедись, что ты обрабатываешь случай с null.' },
            { id: 3, question: 'Note that this method is deprecated in version 3.0.', answer: 'Обрати внимание, что этот метод устарел в версии 3.0.' },
            { id: 4, question: 'Keep in mind that this will only work in Node.js 18+.', answer: 'Имей в виду, что это работает только в Node.js 18+.' },
            { id: 5, question: 'Instead of for...in, use for...of for arrays.', answer: 'Вместо for...in, используй for...of для массивов.' }
          ]
        }
      ]
    }
  ]
}
