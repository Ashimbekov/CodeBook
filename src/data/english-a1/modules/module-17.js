export default {
  id: 17,
  title: 'IT-лексика: программирование (базовое)',
  description: 'Variable, function, loop, array, bug, deploy — основные термины программирования',
  lessons: [
    {
      id: 1,
      title: 'Основные концепции программирования',
      type: 'theory',
      content: [
        { type: 'text', value: 'Основные термины программирования — слова, которые вы используете каждый день. Нужно знать их по-английски для чтения документации и общения с коллегами.' },
        { type: 'code', language: 'text', value: 'Базовые термины:\nvariable    [вэриэбл]   - переменная\nconstant    [констэнт]  - константа\nfunction    [фанкшн]    - функция\nmethod      [мэтэд]     - метод\nclass       [клас]      - класс\nobject      [обджект]   - объект\narray       [эрэй]      - массив\nstring      [стринг]    - строка (тип данных)\ninteger/int [интиджер]  - целое число\nboolean     [булиэн]    - логический тип\nnull        [нал]       - нулевое значение\nundefined   [андэфайнд] - неопределённое значение' },
        { type: 'code', language: 'text', value: 'В контексте:\nDeclare a variable.          - Объявить переменную.\nCall a function.             - Вызвать функцию.\nCreate a class.              - Создать класс.\nInstantiate an object.       - Создать экземпляр объекта.\nIterate over an array.       - Перебирать элементы массива.\nReturn a value.              - Вернуть значение.\nPass a parameter.            - Передать параметр.\nAssign a value.              - Присвоить значение.' }
      ]
    },
    {
      id: 2,
      title: 'Управление потоком (Control Flow)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Термины управления потоком выполнения программы — условия, циклы, исключения.' },
        { type: 'code', language: 'text', value: 'Условия:\nif statement    - условный оператор if\nelse clause     - ветка else\ncondition       - условие\ncomparison      - сравнение\ntrue / false    - истина / ложь\nequal           - равно\ngreater than    - больше чем\nless than       - меньше чем\n\nЦиклы:\nloop            - цикл\nfor loop        - цикл for\nwhile loop      - цикл while\niteration       - итерация\niterator        - итератор\nincrement       - увеличивать (++)\ndecrement       - уменьшать (--)\nbreak           - прервать\ncontinue        - продолжить\nreturn          - вернуть' },
        { type: 'code', language: 'text', value: 'Обработка ошибок:\nexception       - исключение\nerror           - ошибка\ntry/catch       - попробовать/поймать\nthrow           - выбросить (исключение)\nhandle          - обработать\nfinally         - в конце концов\nstack trace     - стек вызовов\nruntime error   - ошибка во время выполнения\nsyntax error    - синтаксическая ошибка\nlogic error     - логическая ошибка' }
      ]
    },
    {
      id: 3,
      title: 'Баги и отладка (Bugs and Debugging)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Нахождение и исправление ошибок — большая часть работы программиста. Словарь по отладке обязателен.' },
        { type: 'code', language: 'text', value: 'Ошибки:\nbug             - баг, ошибка\nerror           - ошибка\nwarning         - предупреждение\ncrash           - аварийное завершение\nfailure         - сбой\ndefect          - дефект\nregression      - регрессия (новая ошибка от старого кода)\n\nОтладка:\ndebug           - отлаживать\ndebugging       - отладка\nset a breakpoint- установить точку останова\nstep through    - пошагово выполнять\nlog / print     - логировать / выводить\ntest            - тестировать\nreproducible    - воспроизводимый (баг)\nroot cause      - первопричина\nfix / patch     - исправить / патч\nhotfix          - срочное исправление' },
        { type: 'code', language: 'text', value: 'Фразы программиста:\nI found a bug.               - Я нашёл баг.\nI\'m debugging.               - Я отлаживаю.\nI can\'t reproduce the bug.   - Я не могу воспроизвести баг.\nThe bug is fixed.            - Баг исправлен.\nI\'ll open a ticket.          - Я открою тикет.\nWhat is the root cause?      - Что является первопричиной?' }
      ]
    },
    {
      id: 4,
      title: 'Версионирование и git',
      type: 'theory',
      content: [
        { type: 'text', value: 'Git-терминология — обязательный словарь для любого разработчика.' },
        { type: 'code', language: 'text', value: 'Git-команды как слова:\nrepository (repo) - репозиторий\nbranch         - ветка\ncommit         - коммит\nmerge          - мёрджить (объединять)\nrebase         - ребейзить\npull           - забирать изменения\npush           - отправлять изменения\nclone          - клонировать\nfork           - форкнуть\npull request (PR) - пул-реквест\ncode review    - проверка кода\nconflict       - конфликт\nstash          - припрятать изменения' },
        { type: 'code', language: 'text', value: 'Ветки:\nmain / master  - основная ветка\ndevelop        - ветка разработки\nfeature branch - ветка для фичи\nbugfix branch  - ветка для исправления\nrelease branch - ветка для релиза\n\nPR фразы:\nOpen a pull request.     - Открыть пул-реквест.\nRequest a review.        - Попросить проверку.\nApprove the PR.          - Одобрить PR.\nMerge the PR.            - Смёрджить PR.\nClose the PR.            - Закрыть PR.\nLeave a comment.         - Оставить комментарий.' }
      ]
    },
    {
      id: 5,
      title: 'Деплой и инфраструктура',
      type: 'theory',
      content: [
        { type: 'text', value: 'Словарь деплоя и инфраструктуры — важен для понимания работы DevOps и серверных процессов.' },
        { type: 'code', language: 'text', value: 'Окружения (Environments):\ndevelopment (dev) - среда разработки\nstaging (stage)   - тестовое окружение\nproduction (prod) - продакшен\nlocal             - локальная среда\n\nПроцессы:\ndeploy            - задеплоить\nbuild             - собрать\ncompile           - скомпилировать\nrun               - запустить\nstart             - запустить\nstop              - остановить\nrestart           - перезапустить\nscale             - масштабировать\nmonitor           - мониторить\nlog               - логировать' },
        { type: 'code', language: 'text', value: 'Контейнеры и CI/CD:\ncontainer         - контейнер\nimage             - образ\nDockerfile        - файл Docker-конфигурации\nCI/CD pipeline    - конвейер CI/CD\nbuild pipeline    - сборочный конвейер\nautomated tests   - автоматизированные тесты\nartifact          - артефакт сборки\nrollback          - откат\nblue-green deploy - сине-зелёный деплой' }
      ]
    },
    {
      id: 6,
      title: 'API и базы данных',
      type: 'theory',
      content: [
        { type: 'text', value: 'Терминология API и баз данных — основа для бэкенд-разработчиков и фулстек-специалистов.' },
        { type: 'code', language: 'text', value: 'API:\nAPI (Application Programming Interface)\nendpoint       - эндпоинт\nrequest        - запрос\nresponse       - ответ\nHTTP method    - HTTP-метод\nGET            - получить данные\nPOST           - создать/отправить данные\nPUT / PATCH    - обновить данные\nDELETE         - удалить данные\njson           - формат данных JSON\nheader         - заголовок\nparameter      - параметр\nauthentication - аутентификация\nstatus code    - код статуса' },
        { type: 'code', language: 'text', value: 'Базы данных:\ndatabase       - база данных\ntable          - таблица\nrecord / row   - запись / строка\nfield / column - поле / колонка\nquery          - запрос\nindex          - индекс\nprimary key    - первичный ключ\nforeign key    - внешний ключ\nmigration      - миграция\ntransaction    - транзакция\nSQL            - язык запросов\nORM            - ORM (объектно-реляционное отображение)' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Термины программирования',
      type: 'practice',
      content: [
        {
          type: 'task',
          taskType: 'match',
          question: 'Соедините термины с переводами:',
          pairs: [
            { left: 'variable', right: 'переменная' },
            { left: 'function', right: 'функция' },
            { left: 'loop', right: 'цикл' },
            { left: 'bug', right: 'ошибка' }
          ],
          explanation: 'Четыре самых важных термина программирования. Знайте их наизусть!'
        },
        {
          type: 'task',
          taskType: 'translate',
          question: 'Переведите: "Я нашёл баг и открыл тикет."',
          solution: 'I found a bug and opened a ticket.',
          explanation: 'found = прошедшее от find, opened = прошедшее от open (правильный глагол). a bug, a ticket — с неопределённым артиклем (впервые упоминается).'
        },
        {
          type: 'task',
          taskType: 'translate',
          question: 'Переведите: "Функция возвращает строку."',
          solution: 'The function returns a string.',
          explanation: 'function = it → returns (с -s). "a string" — тип данных, используем "a".'
        },
        {
          type: 'task',
          taskType: 'multiple_choice',
          question: 'Что такое "deploy"?',
          options: ['развернуть/выпустить приложение', 'написать код', 'найти ошибку', 'создать переменную'],
          correct: 0,
          explanation: 'Deploy [дипло:й] — развернуть, выпустить приложение на сервер. "We deploy to production every Friday."'
        }
      ]
    },
    {
      id: 8,
      title: 'Практика: Git и деплой',
      type: 'practice',
      content: [
        {
          type: 'task',
          taskType: 'translate',
          question: 'Переведите: "Создайте ветку и откройте пул-реквест."',
          solution: 'Create a branch and open a pull request.',
          explanation: 'Повелительное наклонение. a branch, a pull request — неопределённый артикль (новые объекты).'
        },
        {
          type: 'task',
          taskType: 'fill_blank',
          question: 'Вставьте правильное слово: "The app is running in ___." (продакшен)',
          solution: 'production',
          explanation: '"The app is running in production." — Приложение работает в продакшене. production — без артикля, как название окружения.'
        },
        {
          type: 'task',
          taskType: 'translate',
          question: 'Переведите: "Смёрджите ветку в main."',
          solution: 'Merge the branch into main.',
          explanation: 'merge into = мёрджить в. the branch = конкретная ветка. main = название ветки, без артикля.'
        }
      ]
    }
  ]
}
