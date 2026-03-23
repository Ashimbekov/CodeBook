export default {
  id: 24,
  title: 'Writing: Code Review Comments',
  description: 'Как писать профессиональные и конструктивные комментарии к код-ревью на английском. Фразы, тон и примеры.',
  lessons: [
    {
      id: 1,
      title: 'Principles of good code review comments',
      type: 'theory',
      content: [
        { type: 'text', value: 'Код-ревью — это не критика человека, а обсуждение кода. Хороший ревьюер помогает автору улучшить код, объясняя причины и предлагая альтернативы.' },
        { type: 'heading', value: 'The 4 principles' },
        { type: 'list', items: [
          'Be specific — конкретно указывай что именно и почему',
          'Be constructive — предлагай решение, не просто указывай проблему',
          'Be respectful — критикуй код, не человека',
          'Explain the "why" — объясняй причину замечания'
        ]},
        { type: 'heading', value: 'Comment severity levels' },
        { type: 'list', items: [
          'Blocker / Must fix — блокирующее замечание, нужно исправить до мержа ("This will cause a memory leak in production")',
          'Should fix — важное замечание, но не критическое ("I suggest extracting this into a separate method")',
          'Nit (nitpick) — мелочь, косметика ("Nit: variable name could be more descriptive")',
          'Question — вопрос, не замечание ("What happens when the list is empty?")',
          'Praise — похвала ("Nice use of the builder pattern here!")'
        ]},
        { type: 'tip', value: 'Используй "Nit:" в начале комментария для незначительных замечаний. Это сигнализирует автору, что он может проигнорировать их, если не согласен.' }
      ]
    },
    {
      id: 2,
      title: 'Suggestion phrases: "I suggest..."',
      type: 'theory',
      content: [
        { type: 'text', value: 'Предложение улучшений — самый частый тип комментария. Важно формулировать их как предложения, а не приказы.' },
        { type: 'heading', value: 'Suggestion phrases' },
        { type: 'list', items: [
          '"I suggest using X instead of Y because..." — я предлагаю использовать X вместо Y, потому что...',
          '"Consider using a Map here for O(1) lookups." — рассмотри использование Map для поиска за O(1)',
          '"You might want to extract this logic into a helper function." — возможно, стоит вынести эту логику в вспомогательную функцию',
          '"It would be cleaner to..." — было бы чище, если...',
          '"Have you considered using...?" — ты рассматривал использование...?',
          '"What if we used X instead? It would allow us to..." — что если использовать X? Это позволило бы нам...',
          '"I\'d recommend adding error handling here." — я бы рекомендовал добавить обработку ошибок здесь'
        ]},
        { type: 'code', language: 'text', value: 'Example review comment:\n\nI suggest using a Map instead of an array for the userCache.\nCurrently, lookups are O(n), which could be slow with large datasets.\nA Map would give us O(1) lookup time:\n\nconst userCache = new Map(); // instead of []\nconst user = userCache.get(userId); // instead of .find()' },
        { type: 'note', value: '"Consider..." — самое мягкое предложение. "I suggest..." — немного сильнее. "You should..." — уже директивно. Выбирай тон в зависимости от важности замечания.' }
      ]
    },
    {
      id: 3,
      title: 'Warning phrases: "This could cause..."',
      type: 'theory',
      content: [
        { type: 'text', value: 'Предупреждения о потенциальных проблемах — критически важный тип комментариев. Используй ясные, но не алармистские формулировки.' },
        { type: 'heading', value: 'Warning phrases' },
        { type: 'list', items: [
          '"This could cause a race condition if..." — это может вызвать состояние гонки если...',
          '"This will break if the list is empty." — это сломается, если список пустой',
          '"This could lead to memory leaks because..." — это может привести к утечкам памяти, потому что...',
          '"This is not thread-safe." — это не потокобезопасно',
          '"This will fail in production because..." — это упадёт в продакшне, потому что...',
          '"There\'s a potential SQL injection vulnerability here." — здесь потенциальная уязвимость SQL-инъекции',
          '"This could cause performance issues at scale." — это может вызвать проблемы с производительностью при масштабировании'
        ]},
        { type: 'code', language: 'text', value: 'Example warning comment:\n\nThis could cause a NullPointerException if getUser() returns null.\nI\'d suggest adding a null check:\n\nif (user != null) {\n  user.sendEmail();\n} else {\n  log.warn("User not found, skipping email for id: {}", userId);\n}' },
        { type: 'warning', value: 'Когда пишешь предупреждение, всегда объясняй ПОЧЕМУ это проблема. "This could cause X" без объяснения менее убедительно, чем "This could cause X because Y".' }
      ]
    },
    {
      id: 4,
      title: 'Refactoring phrases: "Consider refactoring..."',
      type: 'theory',
      content: [
        { type: 'text', value: 'Когда код работает, но написан неоптимально, используй предложения о рефакторинге. Они должны объяснять, что выиграет команда от изменений.' },
        { type: 'heading', value: 'Refactoring suggestion phrases' },
        { type: 'list', items: [
          '"Consider refactoring this into a separate class." — рассмотри вынесение этого в отдельный класс',
          '"This method is doing too much — it could be split into X and Y." — этот метод делает слишком много',
          '"The logic here could be simplified using..." — логику здесь можно упростить используя...',
          '"This duplicates the code in X. Consider extracting a shared utility." — это дублирует код в X',
          '"This class is violating the Single Responsibility Principle." — этот класс нарушает принцип единственной ответственности',
          '"The magic number 86400 should be a named constant." — магическое число 86400 должно быть именованной константой',
          '"This could be simplified to a one-liner using..." — это можно упростить до одной строки используя...'
        ]},
        { type: 'code', language: 'text', value: 'Example refactoring comment:\n\nThis method is doing too much — it\'s fetching data, transforming\nit, and saving to the database all in one place.\nConsider splitting it into:\n- fetchUserData(userId)\n- transformUserData(rawData)\n- saveUserData(user)\n\nThis would make it easier to test each step independently\nand follow the Single Responsibility Principle.' },
        { type: 'tip', value: '"Magic numbers" — числа в коде без объяснения (86400, 3600, 1024). В ревью всегда указывай на них: "What does 86400 represent? Consider using SECONDS_PER_DAY = 86400."' }
      ]
    },
    {
      id: 5,
      title: 'Questions and praise in reviews',
      type: 'theory',
      content: [
        { type: 'text', value: 'Вопросы и похвала — важные инструменты ревьюера. Вопросы выясняют намерение автора, похвала поощряет хорошие практики.' },
        { type: 'heading', value: 'Asking questions' },
        { type: 'list', items: [
          '"What is the expected behavior when...?" — каково ожидаемое поведение когда...?',
          '"Is this intentional?" — это намеренно?',
          '"Could you explain why you chose X over Y?" — можешь объяснить почему X, а не Y?',
          '"How does this handle the case where...?" — как это обрабатывает случай когда...?',
          '"Have you tested this with...?" — ты тестировал это с...?'
        ]},
        { type: 'heading', value: 'Giving praise' },
        { type: 'list', items: [
          '"Nice solution! I hadn\'t thought of this approach." — отличное решение!',
          '"Great use of the strategy pattern here." — отличное использование паттерна стратегия',
          '"This is much cleaner than the previous implementation." — намного чище, чем предыдущая реализация',
          '"Good catch on the edge case!" — хорошо поймал крайний случай!',
          '"Love the comprehensive test coverage." — отличное покрытие тестами'
        ]},
        { type: 'note', value: 'Начинай ревью с похвалы если можно — это создаёт позитивную атмосферу. Соотношение похвала/замечания примерно 1:3 считается здоровым.' }
      ]
    },
    {
      id: 6,
      title: 'Practice: Write review comments',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напиши профессиональные комментарии к следующим фрагментам кода.',
      solution: 'Правильные ответы:\n1. SQL injection: "This has a critical SQL injection vulnerability. Please use parameterized queries: db.query(\'SELECT * FROM users WHERE id = ?\', [id]). Also add error handling with try/catch."\n2. Redundant comparison: "Nit: The comparison to `true` is redundant. Simplify to: if (x) {...}. Also consider using ===."\n3. Long function: "This function is doing too much at 200 lines. Consider breaking it into: validateInput(), fetchData(), transformData(), saveResults()."',
      tasks: [
        {
          code: 'function getData(id) {\n  const result = db.query("SELECT * FROM users WHERE id = " + id);\n  return result;\n}',
          issues: ['SQL injection уязвимость', 'нет обработки ошибок', 'нет типизации'],
          sampleComment: 'This has a critical SQL injection vulnerability. User input is directly concatenated into the query string. Please use parameterized queries:\n\nconst result = db.query("SELECT * FROM users WHERE id = ?", [id]);\n\nAlso, this could throw if the database connection fails. Consider adding error handling:\n\ntry {\n  const result = db.query(...);\n  return result;\n} catch (error) {\n  log.error("Failed to fetch user:", error);\n  throw new DatabaseError("User fetch failed");\n}'
        },
        {
          code: 'if (x == true) {\n  doSomething();\n}',
          issues: ['Redundant comparison', 'should use === in JavaScript'],
          sampleComment: 'Nit: The comparison to `true` is redundant. You can simplify this to:\n\nif (x) {\n  doSomething();\n}\n\nAlso, consider using `===` instead of `==` for strict equality checks in JavaScript.'
        },
        {
          code: 'function process() {\n  // 200 lines of code doing many things\n}',
          issues: ['Метод слишком длинный', 'нарушает SRP'],
          sampleComment: 'This function is doing too much at 200 lines. Consider breaking it down into smaller, focused functions. This would improve readability and testability. For example:\n\n- validateInput()\n- fetchData()\n- transformData()\n- saveResults()\n\nEach function would do one thing and could be tested independently.'
        }
      ]
    },
    {
      id: 7,
      title: 'Practice: Rewrite harsh comments',
      type: 'practice',
      difficulty: 'easy',
      description: 'Перепиши жёсткие/непрофессиональные комментарии в конструктивные.',
      solution: 'Правильные конструктивные варианты:\n1. "This implementation has some issues that could cause problems in production. Specifically: [list issues]. Here\'s how I\'d suggest improving it: [suggestions]."\n2. "I suggest using a HashMap here instead of a linear search. This would improve lookup time from O(n) to O(1), which matters at scale."\n3. "This could cause issues when X happens. Specifically, [explain scenario]. To handle this case, consider [suggested fix]."\n4. "Have you considered using async/await here instead of callback chains? It would make the code easier to read and handle errors more cleanly."',
      tasks: [
        {
          harsh: 'This code is terrible. Who wrote this?',
          constructive: 'This implementation has some issues that could cause problems in production. Specifically: [list the issues]. Here\'s how I\'d suggest improving it: [suggestions].'
        },
        {
          harsh: 'Wrong. Use a hashmap.',
          constructive: 'I suggest using a HashMap here instead of a linear search. This would improve lookup time from O(n) to O(1), which matters at scale when we have thousands of users in the collection.'
        },
        {
          harsh: 'This will never work.',
          constructive: 'This could cause issues when X happens. Specifically, [explain scenario]. To handle this case, consider [suggested fix].'
        },
        {
          harsh: 'Why are you not using async/await?',
          constructive: 'Have you considered using async/await here instead of callback chains? It would make the code easier to read and handle errors more cleanly. For example: [code example].'
        }
      ]
    }
  ]
}
