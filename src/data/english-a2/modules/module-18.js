export default {
  id: 18,
  title: 'IT: Bugs, Errors, Debugging',
  description: 'Баги, ошибки и отладка на английском: error, exception, crash, stack trace, debugging.',
  lessons: [
    {
      id: 1,
      title: 'Типы ошибок',
      type: 'theory',
      content: [
        { type: 'text', value: 'Основные типы ошибок в IT:\n\nBUG — ошибка в коде, вызывающая неверное поведение\nA bug is a flaw in the code that causes unexpected behaviour. (Баг — это дефект в коде, вызывающий неожиданное поведение.)\n\nERROR — ошибка (общий термин)\nAn error occurs when something goes wrong. (Ошибка возникает, когда что-то идёт не так.)\n\nEXCEPTION — исключение (ошибка, которую можно поймать)\nAn exception is thrown when an unexpected situation occurs. (Исключение выбрасывается при возникновении непредвиденной ситуации.)\nCatch the exception and handle it gracefully. (Поймай исключение и обработай его корректно.)\n\nCRASH — сбой приложения\nThe app crashed due to a memory leak. (Приложение упало из-за утечки памяти.)\n\nISSUE — проблема (общий термин, используется в Jira/GitHub)\nCreate an issue for every bug. (Создавай задачу для каждого бага.)' }
      ]
    },
    {
      id: 2,
      title: 'Типы ошибок: синтаксис, логика, runtime',
      type: 'theory',
      content: [
        { type: 'text', value: 'SYNTAX ERROR — синтаксическая ошибка\nA syntax error occurs when the code doesn\'t follow the language rules. (Синтаксическая ошибка возникает, когда код не следует правилам языка.)\nThe compiler/interpreter cannot understand the code. (Компилятор/интерпретатор не может понять код.)\nExample: missing semicolon, unclosed bracket\n\nRUNTIME ERROR — ошибка времени выполнения\nA runtime error occurs while the program is running. (Ошибка времени выполнения возникает во время работы программы.)\nExample: division by zero, null pointer exception\n\nLOGIC ERROR — логическая ошибка\nA logic error produces incorrect results but doesn\'t crash the app. (Логическая ошибка даёт неверные результаты, но не ронит приложение.)\nLogic errors are the hardest to find. (Логические ошибки труднее всего найти.)\n\nCOMPILATION ERROR — ошибка компиляции\nThe code fails to compile. (Код не компилируется.)\nFix all compilation errors before running. (Исправь все ошибки компиляции перед запуском.)' }
      ]
    },
    {
      id: 3,
      title: 'Stack Trace: чтение трассировки стека',
      type: 'theory',
      content: [
        { type: 'text', value: 'STACK TRACE (трассировка стека) — запись вызовов функций при возникновении ошибки\n\nA stack trace shows the sequence of function calls that led to the error. (Трассировка стека показывает последовательность вызовов функций, приведших к ошибке.)\nRead the stack trace from top to bottom. (Читай трассировку стека сверху вниз.)\nThe first line shows the error type and message. (Первая строка показывает тип и сообщение ошибки.)\nThe stack trace tells you exactly where the error occurred. (Трассировка стека говорит тебе точно где возникла ошибка.)\n\nКак описывать stack trace:\nThe error occurred in the login() function. (Ошибка возникла в функции login().)\nThe stack trace shows a NullPointerException at line 42. (Трассировка стека показывает NullPointerException в строке 42.)\nThe error was thrown from the DatabaseService class. (Ошибка была выброшена из класса DatabaseService.)' },
        { type: 'heading', value: 'Типичные исключения' },
        { type: 'text', value: 'NullPointerException — доступ к null-объекту\nArrayIndexOutOfBoundsException — выход за пределы массива\nClassNotFoundException — класс не найден\nTimeoutException — превышение времени ожидания\nConnectionException — ошибка соединения\nAuthenticationException — ошибка аутентификации\nNotFoundException (404) — ресурс не найден\nPermissionDeniedException — доступ запрещён\nOutOfMemoryError — недостаточно памяти\nStackOverflowError — переполнение стека (обычно из-за рекурсии)' }
      ]
    },
    {
      id: 4,
      title: 'Debugging: процесс отладки',
      type: 'theory',
      content: [
        { type: 'text', value: 'DEBUG / DEBUGGING — отладка\nDebugging is the process of finding and fixing bugs. (Отладка — это процесс поиска и исправления багов.)\n\nТехники отладки:\nreproduce the bug — воспроизвести баг\nisolate the issue — изолировать проблему\nadd logging — добавить логирование\nset a breakpoint — установить точку останова\nstep through the code — выполнять код по шагам\ninspect variables — проверять переменные\ncheck the stack trace — проверить трассировку стека\nwrite a test case — написать тест\nroll back — откатиться к предыдущей версии\n\nОписание процесса отладки:\nFirst, reproduce the bug consistently. (Сначала воспроизведи баг стабильно.)\nThen, narrow down the cause. (Затем сузь круг причин.)\nAdd logging to track the execution flow. (Добавь логирование для отслеживания потока выполнения.)\nSet a breakpoint and inspect the variables. (Установи точку останова и проверь переменные.)\nFix the root cause, not just the symptom. (Исправь первопричину, а не только симптом.)' }
      ]
    },
    {
      id: 5,
      title: 'Описание багов: баг-репорт',
      type: 'theory',
      content: [
        { type: 'text', value: 'Структура баг-репорта:\n\nTitle: Brief description of the bug\nSteps to Reproduce: How to trigger the bug\nExpected Behaviour: What should happen\nActual Behaviour: What actually happens\nEnvironment: OS, browser, version\nSeverity/Priority: Critical, High, Medium, Low\nAttachments: screenshots, logs\n\nПолезные фразы:\nThe app crashes when... (Приложение падает когда...)\nWhen I click/submit/press... the app... (Когда я нажимаю/отправляю/жму... приложение...)\nThis happens every time / sometimes / rarely. (Это происходит каждый раз / иногда / редко.)\nThe expected behaviour is... (Ожидаемое поведение:...)\nThe actual behaviour is... (Фактическое поведение:...)\nI can reproduce it by... (Я могу воспроизвести это, сделав...)\nThe error message says: "..." (Сообщение об ошибке говорит: "...")' }
      ]
    },
    {
      id: 6,
      title: 'Словарный запас: типы проблем',
      type: 'theory',
      content: [
        { type: 'text', value: 'Описание проблем:\nThe app is down. (Приложение недоступно.)\nThe service is not responding. (Сервис не отвечает.)\nThe page is not loading. (Страница не загружается.)\nThe request is timing out. (Запрос завершается по таймауту.)\nThe data is corrupted. (Данные повреждены.)\nThere is a memory leak. (Есть утечка памяти.)\nThe performance has degraded. (Производительность ухудшилась.)\nThere are frequent crashes. (Происходят частые сбои.)\n\nОписание исправления:\nI found the root cause. (Я нашёл первопричину.)\nThe bug was caused by... (Баг был вызван...)\nI fixed the issue by... (Я исправил проблему путём...)\nThe fix has been deployed. (Исправление задеплоено.)\nThe issue is resolved. (Проблема решена.)\nPlease verify the fix. (Пожалуйста, проверь исправление.)' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Описание багов',
      type: 'practice',
            description: 'Переведите описания ошибок на английский язык.',
      solution: 'Правильные ответы:\\n1. The app crashes when logging in.\\n2. The stack trace shows a NullPointerException at line 56.\\n3. The bug was caused by a memory leak.\\n4. Add logging to track the execution flow.\\n5. I fixed the issue by restarting the service.\\n6. Reproduce the bug before fixing it.\\n7. Expected behaviour: the user is redirected to the dashboard.',
content: [
        { type: 'text', value: 'Переведите описания ошибок на английский язык.' },
        {
          type: 'exercise',
          subtype: 'translation',
          items: [
            { id: 1, question: 'Приложение падает при входе в систему.', answer: 'The app crashes when logging in.' },
            { id: 2, question: 'Трассировка стека показывает NullPointerException в строке 56.', answer: 'The stack trace shows a NullPointerException at line 56.' },
            { id: 3, question: 'Баг был вызван утечкой памяти.', answer: 'The bug was caused by a memory leak.' },
            { id: 4, question: 'Добавь логирование, чтобы отследить поток выполнения.', answer: 'Add logging to track the execution flow.' },
            { id: 5, question: 'Я исправил проблему путём перезапуска сервиса.', answer: 'I fixed the issue by restarting the service.' },
            { id: 6, question: 'Воспроизведи баг перед его исправлением.', answer: 'Reproduce the bug before fixing it.' },
            { id: 7, question: 'Ожидаемое поведение: пользователь перенаправляется на дашборд.', answer: 'Expected behaviour: the user is redirected to the dashboard.' }
          ]
        }
      ]
    }
  ]
}
