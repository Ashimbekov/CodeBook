export default {
  id: 12,
  title: 'Linking Words',
  description: 'Связующие слова: and, but, because, so, however, although — для связного IT-текста.',
  lessons: [
    {
      id: 1,
      title: 'And, But, Or: базовые союзы',
      type: 'theory',
      content: [
        { type: 'text', value: 'AND (и) — добавляет информацию:\nThe app is fast and reliable. (Приложение быстрое и надёжное.)\nWe fixed the bug and updated the documentation. (Мы исправили баг и обновили документацию.)\nShe writes code and reviews PRs. (Она пишет код и проверяет PR.)\n\nBUT (но) — противопоставление:\nThe feature works, but it\'s slow. (Функция работает, но она медленная.)\nWe deployed the update, but the bug is still there. (Мы задеплоили обновление, но баг всё ещё есть.)\nThe code is clean, but it\'s not optimized. (Код чистый, но он не оптимизирован.)\n\nOR (или) — альтернатива:\nUse Python or JavaScript for this task. (Используй Python или JavaScript для этой задачи.)\nShould we fix the bug or rewrite the module? (Нам следует исправить баг или переписать модуль?)\nThe issue is in the frontend or the backend. (Проблема во frontend или в backend.)' }
      ]
    },
    {
      id: 2,
      title: 'Because, So, Therefore: причина и следствие',
      type: 'theory',
      content: [
        { type: 'text', value: 'BECAUSE (потому что) — причина:\nThe app crashed because of a memory leak. (Приложение упало из-за утечки памяти.)\nWe are refactoring because the code is unmaintainable. (Мы рефакторим, потому что код не поддерживается.)\nI can\'t reproduce the bug because I don\'t have the test data. (Я не могу воспроизвести баг, потому что у меня нет тестовых данных.)\n\nSO (поэтому, так что) — следствие:\nThe tests failed, so we cancelled the deployment. (Тесты упали, поэтому мы отменили деплой.)\nThe server was overloaded, so we scaled it up. (Сервер был перегружен, поэтому мы его масштабировали.)\nThere are no tests, so we can\'t refactor safely. (Нет тестов, поэтому мы не можем безопасно рефакторить.)\n\nTHEREFORE (следовательно) — более формальное "so":\nThe API is deprecated. Therefore, we should migrate. (API устарело. Следовательно, нам следует мигрировать.)\nThe tests passed. Therefore, the deployment can proceed. (Тесты прошли. Следовательно, деплой может продолжиться.)' }
      ]
    },
    {
      id: 3,
      title: 'However, Although, Even though: уступка',
      type: 'theory',
      content: [
        { type: 'text', value: 'HOWEVER (однако) — противопоставление (более формальное than "but")\nПозиция: в начале предложения или после точки с запятой\n\nThe feature is complete. However, it needs testing. (Функция готова. Однако, ей нужно тестирование.)\nThe code works. However, it could be more efficient. (Код работает. Однако, он мог бы быть эффективнее.)\n\nALTHOUGH / EVEN THOUGH (хотя, несмотря на то что) — уступка\nAlthough the tests pass, the feature feels buggy. (Хотя тесты проходят, функция кажется багованной.)\nWe deployed, even though there were some warnings. (Мы задеплоили, хотя были некоторые предупреждения.)\nAlthough we don\'t have much time, we should test this. (Хотя у нас мало времени, нам следует протестировать это.)' },
        { type: 'heading', value: 'While, Whereas: сравнение' },
        { type: 'text', value: 'WHILE / WHEREAS (тогда как, в то время как) — контраст\n\nPython is easy to read, while C++ is more powerful. (Python легко читается, тогда как C++ более мощный.)\nMicroservices are more scalable, whereas monoliths are simpler to deploy. (Микросервисы более масштабируемы, тогда как монолиты проще деплоить.)\nThe frontend team uses React, while the backend uses Python. (Frontend-команда использует React, а backend — Python.)' }
      ]
    },
    {
      id: 4,
      title: 'Also, In addition, Moreover: добавление информации',
      type: 'theory',
      content: [
        { type: 'text', value: 'ALSO (также, тоже) — добавление информации\nI fixed the bug. I also updated the documentation. (Я исправил баг. Я также обновил документацию.)\nThe app needs better error handling. It also needs better logging. (Приложению нужна лучшая обработка ошибок. Ему также нужно лучшее логирование.)\n\nIN ADDITION / ADDITIONALLY (кроме того) — более формально\nWe need to fix the performance issues. In addition, we should update the dependencies. (Нам нужно исправить проблемы производительности. Кроме того, нам следует обновить зависимости.)\n\nMOREOVER / FURTHERMORE (более того) — сильное добавление\nThe code has no tests. Moreover, the documentation is outdated. (Код не имеет тестов. Более того, документация устарела.)' },
        { type: 'heading', value: 'First, Then, Finally: последовательность' },
        { type: 'text', value: 'FIRST / FIRST OF ALL (сначала, прежде всего)\nFirst, clone the repository. (Сначала клонируй репозиторий.)\n\nTHEN / AFTER THAT (затем, после этого)\nThen, install the dependencies. (Затем установи зависимости.)\n\nFINALLY / LASTLY (наконец)\nFinally, run the tests. (Наконец, запусти тесты.)\n\nПолный пример:\nFirst, check out the feature branch. Then, make your changes. After that, run the tests. Finally, create a pull request.\n(Сначала переключись на ветку с фичей. Затем внеси изменения. После этого запусти тесты. Наконец, создай pull request.)' }
      ]
    },
    {
      id: 5,
      title: 'Словарный запас: связующие слова для IT-текстов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Добавление: and, also, in addition, moreover, furthermore, besides\nПротивопоставление: but, however, although, even though, whereas, while, on the other hand, despite\nПричина: because, since, as, due to\nСледствие: so, therefore, thus, as a result, consequently\nВремя/последовательность: first, then, after that, next, finally, before, after, when\nУсловие: if, unless, provided that, as long as\nЦель: to, in order to, so that\nПример: for example, for instance, such as\nВывод: in conclusion, to sum up, overall, in summary' },
        { type: 'heading', value: 'Диалог с связующими словами' },
        { type: 'text', value: 'Dev: The app is crashing because of a null pointer exception. Moreover, there are memory leaks.\nManager: So what are we going to do?\nDev: First, I\'ll fix the null pointer. Then, I\'ll investigate the memory leaks. Although it will take time, we should resolve both issues.\nManager: OK. However, we need to deploy by Friday. Can you prioritize?\nDev: I\'ll fix the critical bug first. In addition, I\'ll add some temporary logging to find the memory issue.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Вставьте связующее слово',
      type: 'practice',
            description: 'Вставьте подходящее связующее слово.',
      solution: 'Правильные ответы:\\n1. because\\n2. Moreover / In addition / Also\\n3. Although / Even though\\n4. First / Then\\n5. so\\n6. while / whereas\\n7. However',
content: [
        { type: 'text', value: 'Вставьте подходящее связующее слово.' },
        {
          type: 'exercise',
          subtype: 'fill_blank',
          items: [
            { id: 1, question: 'The build failed ___ there was a compile error.', answer: 'because' },
            { id: 2, question: 'We need to update the API. ___, the documentation is outdated.', answer: 'Moreover / In addition / Also' },
            { id: 3, question: '___ the tests pass, I\'m not confident about this code.', answer: 'Although / Even though' },
            { id: 4, question: '___, open the terminal. ___, navigate to the project folder.', answer: 'First / Then' },
            { id: 5, question: 'The deployment failed, ___ we rolled back to the previous version.', answer: 'so' },
            { id: 6, question: 'Python is easy to learn ___ JavaScript has a huge ecosystem.', answer: 'while / whereas' },
            { id: 7, question: 'The code works. ___, it could be much more efficient.', answer: 'However' }
          ]
        }
      ]
    }
  ]
}
