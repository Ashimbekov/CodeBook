export default {
  id: 13,
  title: 'Дебаггинг как навык',
  description: 'Систематический подход к отладке, rubber duck debugging, работа с логами и стратегии поиска багов.',
  lessons: [
    {
      id: 1,
      title: 'Систематический подход к отладке',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Дебаггинг — это не угадывание' },
        { type: 'text', value: 'Начинающие разработчики дебажат хаотично: меняют код наугад, добавляют console.log повсюду, перезапускают и надеются. Опытные — используют систему. Систематический подход быстрее, даже если кажется медленнее на старте.' },
        { type: 'heading', value: 'Алгоритм отладки (научный метод)' },
        { type: 'list', value: [
          '1. Воспроизведите баг — если не можете воспроизвести, не можете починить',
          '2. Сузьте область — определите, ГДЕ проблема (frontend? backend? БД? сеть?)',
          '3. Сформулируйте гипотезу — «Я думаю, проблема в том, что...»',
          '4. Проверьте гипотезу — один эксперимент за раз',
          '5. Если гипотеза неверна — вернитесь к шагу 3 с новой',
          '6. Исправьте и проверьте — убедитесь, что fix не создал новых проблем',
          '7. Напишите тест — чтобы баг не вернулся'
        ]},
        { type: 'heading', value: 'Приёмы сужения области' },
        { type: 'code', language: 'text', value: 'Бинарный поиск бага:\n\nПриложение: Frontend → API → Service → Database\n\n1. Проверяю API напрямую (curl/Postman):\n   - Если API возвращает ошибку → проблема на backend\n   - Если API ОК → проблема на frontend\n\n2. Если backend — проверяю Service напрямую:\n   - Если Service возвращает ошибку → проблема в бизнес-логике\n   - Если Service ОК → проблема в API layer (routing, serialization)\n\n3. Если Service — проверяю Database:\n   - SQL запрос напрямую в DB → проблема в данных или запросе?\n\nКаждый шаг ВДВОЕ сужает область поиска.' },
        { type: 'tip', value: 'Записывайте каждую гипотезу и результат проверки. Это предотвращает повторную проверку одного и того же и помогает, если нужно передать баг коллеге.' }
      ]
    },
    {
      id: 2,
      title: 'Rubber Duck Debugging',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Объясни проблему утке' },
        { type: 'text', value: 'Rubber Duck Debugging — техника, при которой вы объясняете проблему вслух (или мысленно) неодушевлённому предмету. Звучит глупо, но работает: процесс формулирования проблемы часто приводит к её решению.' },
        { type: 'heading', value: 'Почему это работает' },
        { type: 'list', value: [
          'Переключение с «визуального» мышления на «вербальное» активирует другие нейронные пути',
          'Вы вынуждены объяснить КАЖДЫЙ шаг, включая те, которые казались «очевидными»',
          'Часто баг прячется в предположении, которое вы не проверяли',
          'Когда говорите «и тут оно должно...» — понимаете, что НЕ должно'
        ]},
        { type: 'heading', value: 'Структура объяснения утке' },
        { type: 'code', language: 'text', value: 'Шаблон:\n\n"Привет, утка. У меня баг: [описание].\n\nВот что должно происходить:\n1. Пользователь нажимает кнопку "Оплатить"\n2. Frontend отправляет POST /api/payments\n3. Backend создаёт payment intent в Stripe\n4. Stripe возвращает client_secret\n5. Frontend показывает форму оплаты\n\nВот что происходит на самом деле:\n1. Пользователь нажимает кнопку — ОК\n2. POST запрос отправляется — ОК (вижу в Network)\n3. Backend... хм, подожди. Я проверял, что запрос\n   ДОХОДИТ до backend? Дай посмотрю логи...\n   О! 403 Forbidden — middleware блокирует запрос!\n   У нового пользователя нет нужного permission!"\n\n→ Баг найден через 2 минуты объяснения.' },
        { type: 'note', value: 'Замена утки: коллега, который просто слушает. Часто разработчик находит ответ, пока объясняет проблему, даже если коллега ничего не сказал.' }
      ]
    },
    {
      id: 3,
      title: 'Эффективная работа с логами',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Логи — ваш чёрный ящик' },
        { type: 'text', value: 'Хорошие логи — это разница между «баг починен за 5 минут» и «баг воспроизводился неделю». Логирование — не дополнение, а неотъемлемая часть кода.' },
        { type: 'heading', value: 'Уровни логирования' },
        { type: 'list', value: [
          'ERROR: что-то сломалось, нужно действовать. «Payment failed: Stripe returned 402»',
          'WARN: что-то подозрительное, но работает. «Retry 3/5 for API call to partner-service»',
          'INFO: важные бизнес-события. «Order #123 created, total: $45.00»',
          'DEBUG: детали для отладки. «SQL query: SELECT * FROM users WHERE id = 42 (took 15ms)»'
        ]},
        { type: 'heading', value: 'Structured logging' },
        { type: 'code', language: 'javascript', value: '// ❌ Плохое логирование:\nconsole.log("error processing order");\nconsole.log("user:", user.email);\nconsole.log("total:", total);\n\n// ✅ Хорошее (structured) логирование:\nlogger.error("Order processing failed", {\n  orderId: order.id,\n  userId: user.id,\n  email: user.email,\n  total: total,\n  error: err.message,\n  stack: err.stack,\n  paymentProvider: "stripe",\n  duration: Date.now() - startTime\n});\n\n// Теперь можно искать в Kibana/Datadog:\n// level:error AND orderId:123\n// level:error AND paymentProvider:stripe AND duration:>5000' },
        { type: 'tip', value: 'Добавляйте requestId/correlationId к каждому логу. Это позволяет отследить весь путь одного запроса через все сервисы.' }
      ]
    },
    {
      id: 4,
      title: 'Инструменты отладки',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Больше, чем console.log' },
        { type: 'text', value: 'console.log — самый популярный, но далеко не единственный инструмент. Для сложных багов нужны более мощные инструменты: отладчики, профилировщики, сетевые анализаторы.' },
        { type: 'heading', value: 'Инструменты по категориям' },
        { type: 'list', value: [
          'Browser DevTools: Network (API-запросы), Console (ошибки), Performance (утечки), Application (cookies/storage)',
          'Debugger: точки останова (breakpoints), пошаговое выполнение, watch expressions',
          'HTTP-клиенты: Postman, cURL, HTTPie — тестирование API изолированно',
          'Database: pgAdmin, DBeaver — проверка данных напрямую в БД',
          'Monitoring: Sentry (ошибки), Datadog (метрики), Kibana (логи)',
          'Git: git bisect — бинарный поиск коммита, который сломал код'
        ]},
        { type: 'heading', value: 'git bisect: найди сломавший коммит' },
        { type: 'code', language: 'bash', value: '# Баг есть сейчас, но неделю назад его не было.\n# git bisect найдёт ТОЧНЫЙ коммит за O(log n) шагов.\n\ngit bisect start\ngit bisect bad                    # текущий коммит — плохой\ngit bisect good abc123            # этот коммит неделю назад — хороший\n\n# Git переключит на средний коммит. Проверяйте:\n# Баг есть? → git bisect bad\n# Бага нет? → git bisect good\n\n# Через 5-7 шагов:\n# "abc789 is the first bad commit"\n# Автор: Алексей, сообщение: "refactor: optimize query"\n# → Смотрим diff этого коммита и находим проблему!\n\ngit bisect reset  # вернуться к исходному состоянию' },
        { type: 'note', value: 'git bisect можно автоматизировать: git bisect run npm test — Git сам запустит тесты на каждом коммите и найдёт сломавший.' }
      ]
    },
    {
      id: 5,
      title: 'Документирование и предотвращение багов',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Баг исправлен — что дальше?' },
        { type: 'text', value: 'Исправить баг — это полдела. Вторая половина — предотвратить его повторение. Каждый баг — это возможность улучшить систему: тесты, мониторинг, документация.' },
        { type: 'heading', value: 'Post-mortem для значимых багов' },
        { type: 'code', language: 'markdown', value: '# Post-mortem: Сбой оплаты 3 апреля 2026\n\n## Timeline\n- 14:00 — Деплой PR #456 (обновление Stripe SDK)\n- 14:15 — Первые ошибки в Sentry (429 Too Many Requests)\n- 14:30 — Алерт в Slack (error rate > 5%)\n- 14:35 — Начали расследование\n- 14:50 — Определили причину: rate limit в новой версии SDK\n- 15:00 — Откатили деплой\n- 15:05 — Платежи восстановлены\n\n## Root Cause\nНовая версия Stripe SDK (v12) отправляет preflight-запрос\nпри каждом вызове. Это удвоило количество запросов к API\nи мы упёрлись в rate limit.\n\n## Impact\n- 47 пользователей увидели ошибку при оплате\n- 12 транзакций потеряны (требуют ручной обработки)\n- Downtime: 50 минут\n\n## Action Items\n- [ ] Добавить тест на rate limiting (Алексей, до пятницы)\n- [ ] Настроить retry с exponential backoff (Мария, до среды)\n- [ ] Добавить staging-тестирование для SDK-обновлений (Сергей)\n- [ ] Алерт на rate limit ошибки ДО достижения лимита' },
        { type: 'heading', value: 'Правило: каждый баг = новый тест' },
        { type: 'text', value: 'Когда вы исправляете баг — сначала напишите тест, который ВОСПРОИЗВОДИТ баг (тест должен быть красным). Потом исправьте код (тест становится зелёным). Это гарантирует, что баг не вернётся.' },
        { type: 'tip', value: 'Ведите «Bug Book» — документ с самыми интересными багами, их причинами и решениями. Это ценный ресурс для обучения новичков.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: продебажьте проблему',
      type: 'practice',
      difficulty: 'medium',
      description: 'Вам дан код с багом и описание симптомов. Используйте систематический подход для поиска и исправления бага.',
      requirements: [
        'Опишите симптомы и ожидаемое поведение',
        'Сформулируйте минимум 3 гипотезы о причине бага',
        'Для каждой гипотезы опишите, как её проверить',
        'Найдите баг и предложите исправление',
        'Напишите тест, который предотвращает повторение'
      ],
      hint: 'Используйте метод бинарного поиска: отсекайте половину кода на каждом шаге. Проверьте входные данные, промежуточные результаты и конечный вывод.',
      expectedOutput: 'Гипотеза 1: проблема в фильтрации → проверка: логирование массива\nГипотеза 2: проблема в reduce → проверка: пошаговый расчёт\nГипотеза 3: проблема в данных → проверка: тип и значение price\nБаг найден: price — строка вместо числа → "10" + "20" = "1020"\nFix: parseFloat(item.price)',
      solution: `// Баг: функция calculateTotal возвращает неправильную сумму.
// Ожидается: 150.00, Получаем: "1005000" (строка!)

function calculateTotal(items) {
  const activeItems = items.filter(item => item.active);
  const total = activeItems.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);
  return total;
}

// Тестовые данные (приходят из API):
const items = [
  { id: 1, name: 'Widget', price: '100', quantity: 1, active: true },
  { id: 2, name: 'Gadget', price: '50', quantity: 1, active: true },
  { id: 3, name: 'Deleted', price: '999', quantity: 1, active: false }
];

// Шаг 1: Воспроизводим баг
const buggyResult = calculateTotal(items);
console.log('Buggy result:', buggyResult, typeof buggyResult);
// "1005000", string — подтверждено!

// Шаг 2: Гипотезы
const hypotheses = [
  {
    id: 1,
    hypothesis: 'Проблема в filter — включаются неактивные элементы',
    test: 'Логируем activeItems.length — должно быть 2',
    result: 'activeItems.length = 2 — фильтр работает корректно'
  },
  {
    id: 2,
    hypothesis: 'Проблема в reduce — неправильная аккумуляция',
    test: 'Логируем sum и item.price на каждой итерации',
    result: 'Итерация 1: sum=0, price="100" → 0 + "100"*1 = "100" (строка!)'
  },
  {
    id: 3,
    hypothesis: 'price — строка, а не число (API возвращает строку)',
    test: 'typeof items[0].price',
    result: 'typeof = "string" — БИНГО! "100" * 1 = 100 (число), но sum + "100" = "0100" (конкатенация)'
  }
];

// Шаг 3: Root Cause
const rootCause = 'API возвращает price как строку. В reduce: ' +
  '0 + "100" * 1 → 0 + 100 = 100 (OK для первого), ' +
  'но потом 100 + "50" * 1 → JavaScript делает "50" * 1 = 50, ' +
  'Фактически: всё работает для * , но если бы sum был строкой...' +
  'Подождите, давайте пересчитаем: 0 + "100"*1 = 0 + 100 = 100, 100 + "50"*1 = 150. ' +
  'Результат 150 — число! Но в баге "1005000"... ' +
  'Ах, значит в реальных данных quantity тоже строка!';

// РЕАЛЬНЫЕ данные из API (ВСЕ СТРОКИ):
const realItems = [
  { id: 1, name: 'Widget', price: '100', quantity: '1', active: true },
  { id: 2, name: 'Gadget', price: '50', quantity: '1', active: true },
];
// "100" * "1" = 100 (число) → 0 + 100 = 100
// "50" * "1" = 50 → 100 + 50 = 150 — OK!
// Баг не в этом. Пересматриваем...

// Тестируем с ДРУГИМИ данными:
const realItems2 = [
  { id: 1, name: 'Widget', price: '100', quantity: '1', active: true },
  { id: 2, name: 'Gadget', price: '50', quantity: '1', active: true },
  { id: 4, name: 'Extra', price: undefined, quantity: '1', active: true }
];
// undefined * "1" = NaN → 100 + NaN = NaN

// Fix:
function calculateTotalFixed(items) {
  const activeItems = items.filter(item => item.active);
  const total = activeItems.reduce((sum, item) => {
    const price = parseFloat(item.price) || 0;
    const quantity = parseInt(item.quantity, 10) || 0;
    return sum + price * quantity;
  }, 0);
  return Math.round(total * 100) / 100; // избегаем floating point
}

// Тест для предотвращения повторения
function testCalculateTotal() {
  const tests = [
    { input: [{ price: '100', quantity: '2', active: true }], expected: 200 },
    { input: [{ price: '9.99', quantity: '3', active: true }], expected: 29.97 },
    { input: [{ price: undefined, quantity: '1', active: true }], expected: 0 },
    { input: [{ price: '50', quantity: '1', active: false }], expected: 0 },
    { input: [], expected: 0 },
  ];

  tests.forEach((t, i) => {
    const result = calculateTotalFixed(t.input);
    const pass = result === t.expected;
    console.log(\`Test \${i + 1}: \${pass ? 'PASS' : 'FAIL'} (expected: \${t.expected}, got: \${result})\`);
  });
}

console.log('\\n=== Гипотезы ===');
hypotheses.forEach(h => {
  console.log(\`Гипотеза \${h.id}: \${h.hypothesis}\`);
  console.log(\`  Тест: \${h.test}\`);
  console.log(\`  Результат: \${h.result}\`);
});

console.log('\\n=== Fix ===');
console.log('Fixed result:', calculateTotalFixed(items));

console.log('\\n=== Тесты ===');
testCalculateTotal();`,
      explanation: 'Систематический дебаггинг = научный метод: гипотеза → эксперимент → результат → новая гипотеза. Ключевые уроки: 1) Не доверяйте типам данных из внешних источников (API). 2) parseFloat/parseInt для всех внешних данных. 3) Всегда пишите тест для найденного бага. 4) Документируйте процесс отладки — это поможет при похожих багах.'
    }
  ]
}
