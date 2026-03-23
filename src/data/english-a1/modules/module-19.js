export default {
  id: 19,
  title: 'Прилагательные и наречия',
  description: 'Описательные слова для кода, людей и ситуаций',
  lessons: [
    {
      id: 1,
      title: 'Прилагательные для IT',
      type: 'theory',
      content: [
        { type: 'text', value: 'Прилагательные описывают существительные. В IT они нужны для описания кода, производительности, систем и задач.' },
        { type: 'code', language: 'text', value: 'Качество кода:\nclean           - чистый (clean code)\nmessy / dirty   - грязный (messy code)\nreadable        - читаемый\nmaintainable    - поддерживаемый\nefficient       - эффективный\ninefficient     - неэффективный\ncorrect         - правильный\nincorrect       - неправильный\nsecure          - безопасный\nvulnerable      - уязвимый\ndeprecated      - устаревший\nlegacy          - легаси (старый)' },
        { type: 'code', language: 'text', value: 'Производительность:\nfast / slow     - быстрый / медленный\nscalable        - масштабируемый\noptimized       - оптимизированный\nperformant      - производительный\nresponsive      - отзывчивый\nstable          - стабильный\nreliable        - надёжный\nrobust          - крепкий / надёжный\n\nСтатус:\navailable       - доступный\nunavailable     - недоступный\nrunning         - работающий\nfailing         - падающий\npending         - ожидающий\ncompleted       - завершённый\nbroken          - сломанный\ncritical        - критический' },
        { type: 'tip', value: 'В code review прилагательные используются постоянно: "The code is clean but not efficient." (Код чистый, но неэффективный.) "This is a critical bug." (Это критический баг.) "The function is readable and maintainable." (Функция читаема и поддерживаема.)' }
      ]
    },
    {
      id: 2,
      title: 'Противоположные прилагательные',
      type: 'theory',
      content: [
        { type: 'text', value: 'Английские прилагательные часто образуют противоположности с помощью префиксов: un-, in-, im-, dis-.' },
        { type: 'code', language: 'text', value: 'Противоположности с un-:\navailable  → unavailable   - недоступный\nstable     → unstable      - нестабильный\nexpected   → unexpected    - неожиданный\nresolved   → unresolved    - неразрешённый\ntested     → untested      - непротестированный\nknown      → unknown       - неизвестный\ndefined    → undefined     - неопределённый\n\nПротивоположности с in-:\ncorrect    → incorrect     - неправильный\nvalid      → invalid       - невалидный\ncomplete   → incomplete    - неполный\nefficient  → inefficient   - неэффективный\ndependent  → independent   - независимый\n\nПротивоположности с im-:\npossible   → impossible    - невозможный' },
        { type: 'tip', value: 'В сообщениях об ошибках часто встречается "undefined" (неопределённый), "invalid" (невалидный), "unexpected" (неожиданный). Знание этих слов помогает понимать error messages.' },
        { type: 'tip', value: 'При code review: "This is correct, not incorrect." "The solution is efficient." "The API is available." Знание противоположностей помогает давать точную обратную связь и понимать комментарии в PR.' },
      ]
    },
    {
      id: 3,
      title: 'Степени сравнения прилагательных',
      type: 'theory',
      content: [
        { type: 'text', value: 'Степени сравнения — для сравнения вещей и людей. Важны для обсуждения подходов, инструментов и производительности.' },
        { type: 'code', language: 'text', value: 'Краткие прилагательные (1-2 слога):\nПоложительная → Сравнительная (+er) → Превосходная (+est)\nfast → faster → fastest\nslow → slower → slowest\nbig  → bigger → biggest\nold  → older  → oldest\n\nДлинные прилагательные (3+ слога):\nmore/most + прилагательное\nefficient → more efficient → most efficient\nreadable  → more readable → most readable\ncomplex   → more complex  → most complex' },
        { type: 'code', language: 'text', value: 'IT-примеры сравнения:\nThis approach is faster.      - Этот подход быстрее.\nPython is simpler than C.     - Python проще, чем C.\nThis is the most efficient solution. - Это самое эффективное решение.\nTypeScript is more readable than plain JS. - TypeScript читабельнее.\nIs this method better or worse? - Этот метод лучше или хуже?\nThe new version is more stable. - Новая версия более стабильна.' },
        { type: 'tip', value: 'При обсуждении решений: "Which approach is faster?" "Is this library more efficient?" "This is the most scalable option." "The old solution was simpler." Степени сравнения нужны для технических дискуссий.' },
      ]
    },
    {
      id: 4,
      title: 'Наречия — как, когда, где',
      type: 'theory',
      content: [
        { type: 'text', value: 'Наречия описывают глаголы, прилагательные и другие наречия. Многие наречия образуются от прилагательных добавлением -ly.' },
        { type: 'code', language: 'text', value: 'Наречия образа действия (как?):\ncorrect  → correctly   - правильно\nquick    → quickly     - быстро\nslow     → slowly      - медленно\nefficient→ efficiently - эффективно\nclear    → clearly     - ясно\ncareful  → carefully   - осторожно\nautomatic→ automatically - автоматически\nmanual   → manually    - вручную\nfrequent → frequently  - часто\ngeneral  → generally   - в целом' },
        { type: 'code', language: 'text', value: 'IT-примеры с наречиями:\nThe app updates automatically.  - Приложение обновляется автоматически.\nPlease explain clearly.        - Пожалуйста, объясните ясно.\nThe server responds quickly.   - Сервер отвечает быстро.\nDeploy carefully.              - Деплойте осторожно.\nThe task was correctly done.   - Задача была выполнена правильно.\nI manually configured it.      - Я настроил это вручную.' },
        { type: 'warning', value: 'Прилагательное "fast" → наречие "fast" (НЕ "fastly")! "The code runs fast." Также: hard → hard (не "hardly" — это другое слово, означает "едва").' }
      ]
    },
    {
      id: 5,
      title: 'Наречия степени',
      type: 'theory',
      content: [
        { type: 'text', value: 'Наречия степени усиливают или ослабляют значение прилагательных и других наречий.' },
        { type: 'code', language: 'text', value: 'Наречия степени:\nvery          - очень\nextremely     - чрезвычайно\nquite         - довольно\nrather        - довольно / скорее\npretty        - довольно (разг.)\nreally        - действительно\ntoo           - слишком\nenough        - достаточно\nnot enough    - недостаточно\njust          - просто / именно\nonly          - только\nalmost        - почти\ncompletely    - полностью\nabsolutely    - абсолютно' },
        { type: 'code', language: 'text', value: 'IT-примеры:\nThis is very important.        - Это очень важно.\nThe bug is extremely critical. - Баг чрезвычайно критический.\nIt\'s quite fast.               - Это довольно быстро.\nThe code is too complex.       - Код слишком сложный.\nIt\'s not efficient enough.     - Это недостаточно эффективно.\nThe API is almost ready.       - API почти готово.\nIt\'s completely broken.        - Это полностью сломано.\nI just pushed the fix.         - Я только что запушил исправление.' },
        { type: 'note', value: 'В IT-переписке наречия помогают точно описать проблемы: "extremely critical" (крайне критично), "highly recommended" (настоятельно рекомендуется), "slightly slower" (немного медленнее), "significantly improved" (значительно улучшено).' },
      ]
    },
    {
      id: 6,
      title: 'Прилагательные для людей и команды',
      type: 'theory',
      content: [
        { type: 'text', value: 'Прилагательные для описания людей, команд и отношений в коллективе.' },
        { type: 'code', language: 'text', value: 'Профессиональные качества:\ntalented       - талантливый\nskilled        - опытный / умелый\nexperienced    - опытный\nproductive     - продуктивный\nresponsible    - ответственный\nreliable       - надёжный\ncreative       - творческий\nanalytical     - аналитический\ncollaborative  - склонный к сотрудничеству\nproactive      - проактивный\ndedicated      - преданный делу\nmotivated      - мотивированный' },
        { type: 'code', language: 'text', value: 'Качества команды:\nagile          - гибкий\ncross-functional - кросс-функциональный\nremote         - удалённый\ndistributed    - распределённый\ndiverse        - разнообразный\nself-organized - самоорганизованный\n\nКачества задачи:\nurgent         - срочный\nhigh-priority  - высокоприоритетный\nblocker        - блокер\nnice-to-have   - желательный, но необязательный\ncritical       - критический\nin progress    - в процессе' },
        { type: 'tip', value: 'Описывая коллег и командную работу: "He is a reliable teammate." "She is very experienced." "The team is collaborative." "Our manager is supportive." Эти прилагательные нужны на собеседованиях и в performance review.' },
      ]
    },
    {
      id: 7,
      title: 'Практика: Прилагательные и наречия',
      type: 'practice',
      content: [
        {
          type: 'task',
          taskType: 'translate',
          question: 'Переведите: "Этот код слишком сложный и недостаточно читаемый."',
          solution: 'This code is too complex and not readable enough.',
          explanation: 'too = слишком (перед прилагательным), not...enough = недостаточно. "This code is too complex and not readable enough."'
        },
        {
          type: 'task',
          taskType: 'fill_blank',
          question: 'Образуйте наречие: "The server responds ___ (quick)."',
          solution: 'quickly',
          explanation: 'quick → quickly (+ly). "The server responds quickly." — Сервер отвечает быстро.'
        },
        {
          type: 'task',
          taskType: 'translate',
          question: 'Переведите: "Python проще, чем C++."',
          solution: 'Python is simpler than C++.',
          explanation: 'simpler — сравнительная степень от "simple". "than" = чем (союз при сравнении).'
        },
        {
          type: 'task',
          taskType: 'multiple_choice',
          question: 'Выберите правильный вариант: "The API is ___ ready."',
          options: ['almost', 'mostly', 'fastly', 'very almost'],
          correct: 0,
          explanation: '"almost" = почти. "The API is almost ready." — API почти готово. "mostlу" = в основном. "fastly" не существует.'
        }
      ]
    }
  ]
}
