export default {
  id: 6,
  title: 'Множественное число',
  description: 'Образование множественного числа существительных',
  lessons: [
    {
      id: 1,
      title: 'Правильное множественное число',
      type: 'theory',
      content: [
        { type: 'text', value: 'В английском языке множественное число большинства существительных образуется добавлением -s или -es. Рассмотрим основные правила.' },
        { type: 'code', language: 'text', value: 'Основные правила:\n1. Большинство слов → + s:\n   bug → bugs         - баг → баги\n   file → files       - файл → файлы\n   server → servers   - сервер → серверы\n   error → errors     - ошибка → ошибки\n   test → tests       - тест → тесты\n   user → users       - пользователь → пользователи\n\n2. Слова на -s, -sh, -ch, -x, -z → + es:\n   branch → branches  - ветка → ветки\n   process → processes- процесс → процессы\n   class → classes    - класс → классы\n   patch → patches    - патч → патчи' },
        { type: 'code', language: 'text', value: '3. Слова на согласный + y → y меняется на ies:\n   library → libraries  - библиотека → библиотеки\n   query → queries      - запрос → запросы\n   repository → repositories - репозиторий\n   directory → directories   - директория\n\n4. Слова на -f/-fe → f меняется на ves:\n   knife → knives\n   half → halves\n   (но: roof → roofs, belief → beliefs)' },
        { type: 'tip', value: 'В IT очень часто используется множественное число: "bugs", "tests", "files", "commits", "branches", "modules". Запомните их написание.' }
      ]
    },
    {
      id: 2,
      title: 'Неправильное множественное число',
      type: 'theory',
      content: [
        { type: 'text', value: 'Некоторые слова образуют множественное число неправильно — не по правилам. Их нужно просто запомнить.' },
        { type: 'code', language: 'text', value: 'Неправильное множественное:\nman → men         - мужчина → мужчины\nwoman → women     - женщина → женщины\nchild → children  - ребёнок → дети\nperson → people   - человек → люди\nfoot → feet       - нога → ноги\ntooth → teeth     - зуб → зубы\nmouse → mice      - мышь → мыши\nanalysis → analyses - анализ → анализы\ncriterion → criteria - критерий → критерии\nmedium → media    - среда → медиа' },
        { type: 'note', value: 'Интересно! В IT "mouse" (компьютерная мышь) обычно используется в единственном числе. Множественное "mice" или "mouses" — оба варианта встречаются для компьютерных мышей.' }
      ]
    },
    {
      id: 3,
      title: 'Неисчисляемые существительные',
      type: 'theory',
      content: [
        { type: 'text', value: 'Неисчисляемые существительные (uncountable nouns) не имеют множественного числа и не используются с артиклем a/an. В IT их очень много.' },
        { type: 'code', language: 'text', value: 'Неисчисляемые в IT:\ncode      - код (не "codes" в общем смысле)\ndata      - данные (не "a data")\nfeedback  - обратная связь\ninformation - информация\nknowledge - знания\nsoftware  - программное обеспечение\nhardware  - аппаратное обеспечение\ntraffic   - трафик\naccess    - доступ\nprogress  - прогресс' },
        { type: 'code', language: 'text', value: 'Как говорить о количестве:\nНельзя: "Give me an information" — ОШИБКА\nМожно: "Give me some information" (немного)\n       "Give me a piece of information" (кусок)\n\nНельзя: "Write a good code" — ОШИБКА\nМожно: "Write good code" (без артикля)\n       "Write a piece of code" (кусок кода)\n\nНельзя: "The softwares are..." — ОШИБКА\nМожно: "The software is..." (единственное число!)' },
        { type: 'warning', value: '"Data" технически является множественным числом слова "datum", но в современном IT-английском используется как неисчисляемое: "The data is ready" (не "are"). Хотя в научном языке "data are" — ещё встречается.' }
      ]
    },
    {
      id: 4,
      title: 'Существительные только во множественном числе',
      type: 'theory',
      content: [
        { type: 'text', value: 'Некоторые слова используются только во множественном числе. С ними глагол всегда стоит во множественном числе.' },
        { type: 'code', language: 'text', value: 'Только во множественном числе:\nscissors    - ножницы\nglasses     - очки\npants/jeans - брюки/джинсы\nheadphones  - наушники\ncredentials - учётные данные\nstats       - статистика\nanalytics   - аналитика\nsettings    - настройки\nresults     - результаты (контекстно)\n\nПримеры:\nMy headphones are broken.      - Мои наушники сломаны.\nThe credentials are wrong.     - Учётные данные неправильные.\nThe settings are saved.        - Настройки сохранены.' }
      ]
    },
    {
      id: 5,
      title: 'Множественное число IT-терминов',
      type: 'theory',
      content: [
        { type: 'text', value: 'В IT много слов с нестандартным множественным числом или заимствованных из латыни/греческого. Знание правил поможет читать документацию.' },
        { type: 'code', language: 'text', value: 'Стандартные IT-слова:\nbug → bugs               array → arrays\ntest → tests             module → modules\ncommit → commits         function → functions\nbranch → branches        class → classes\nfeature → features       variable → variables\npackage → packages       interface → interfaces\nendpoint → endpoints     parameter → parameters\ndependency → dependencies library → libraries' },
        { type: 'code', language: 'text', value: 'Латинские/греческие формы:\nindex → indices (или indexes)\nappendix → appendices\nvertex → vertices\nmatrix → matrices\naxis → axes\nformula → formulae (или formulas)\n\nОба варианта (старый и новый) часто приемлемы:\ndatum → data (но "data" используется как неисчисляемое)\nmedium → media' },
        { type: 'tip', value: 'В программировании "indexes" и "indices" — оба правильны. В математике чаще "indices". В базах данных — "indexes". В Python/JavaScript документации — обычно "indexes".' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Множественное число',
      type: 'practice',
      content: [
        {
          type: 'task',
          taskType: 'fill_blank',
          question: 'Напишите множественное число: "library → ___"',
          solution: 'libraries',
          explanation: 'library — согласный (r) + y → -ies. "libraries" — библиотеки. "We use many libraries" — Мы используем много библиотек.'
        },
        {
          type: 'task',
          taskType: 'fill_blank',
          question: 'Напишите множественное число: "branch → ___"',
          solution: 'branches',
          explanation: 'branch оканчивается на -ch → добавляем -es. "branches" — ветки. "We have many branches" — У нас много веток.'
        },
        {
          type: 'task',
          taskType: 'multiple_choice',
          question: 'Выберите правильный вариант: "The ___ are saved to the database."',
          options: ['data', 'datas', 'datum', 'an data'],
          correct: 0,
          explanation: '"data" — неисчисляемое существительное. "The data are/is saved." — обоим приемлемы, но "data is" чаще в IT.'
        },
        {
          type: 'task',
          taskType: 'translate',
          question: 'Переведите: "У нас три репозитория и два сервера."',
          solution: 'We have three repositories and two servers.',
          explanation: 'repository → repositories (согласный + y → ies). server → servers (просто +s).'
        }
      ]
    }
  ]
}
