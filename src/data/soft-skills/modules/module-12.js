export default {
  id: 12,
  title: 'Рефакторинг: когда и как',
  description: 'Убеждение менеджмента в необходимости рефакторинга, метрики качества кода, безопасные стратегии.',
  lessons: [
    {
      id: 1,
      title: 'Когда рефакторинг оправдан',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Сигналы, что пора рефакторить' },
        { type: 'text', value: 'Рефакторинг — это изменение внутренней структуры кода без изменения внешнего поведения. Не каждый «некрасивый» код нужно рефакторить. Рефакторинг оправдан, когда текущее состояние кода АКТИВНО мешает работе.' },
        { type: 'heading', value: 'Красные флаги (время рефакторить!)' },
        { type: 'list', value: [
          'Страх изменений: «Не трогай этот модуль, он непредсказуемый»',
          'Каскадные баги: исправили одно — сломалось другое',
          'Растущее время на фичи: раньше 3 дня, теперь 2 недели',
          'Дублирование: одна и та же логика в 5 местах',
          'Невозможность тестирования: функция на 500 строк с 20 зависимостями',
          'Onboarding: новичок не может разобраться неделю'
        ]},
        { type: 'heading', value: 'Когда НЕ рефакторить' },
        { type: 'list', value: [
          'Код работает, не меняется и не мешает — оставьте в покое',
          'Дедлайн через неделю — рефакторинг подождёт',
          'Нет тестов — сначала тесты, потом рефакторинг',
          '«Мне просто не нравится стиль» — это не причина для рефакторинга'
        ]},
        { type: 'tip', value: 'Правило Мартина Фаулера: «Рефакторите, когда вам нужно добавить новую функциональность, и текущая структура мешает это сделать». Рефакторинг ради рефакторинга — антипаттерн.' }
      ]
    },
    {
      id: 2,
      title: 'Метрики качества кода',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Объективные показатели для аргументации' },
        { type: 'text', value: '«Код плохой» — субъективно. «Cyclomatic complexity = 47, coverage = 12%, 15 дубликатов» — объективно. Метрики помогают аргументировать необходимость рефакторинга данными, а не мнениями.' },
        { type: 'heading', value: 'Ключевые метрики' },
        { type: 'list', value: [
          'Cyclomatic Complexity — количество путей в функции. > 10 = сложно тестировать. > 20 = нужен рефакторинг.',
          'Code Coverage — покрытие тестами. < 60% для критических модулей = высокий риск.',
          'Code Duplication — процент дублированного кода. > 5% = нужна DRY-оптимизация.',
          'Function Length — строки в функции. > 50 строк = кандидат на разбиение.',
          'Coupling — зависимости между модулями. Высокая связность = хрупкая архитектура.',
          'Churn Rate — как часто меняется файл. Частые изменения + высокая сложность = горячая точка.'
        ]},
        { type: 'heading', value: 'Инструменты для измерения' },
        { type: 'code', language: 'bash', value: '# JavaScript/TypeScript\nnpx eslint --ext .js,.ts src/ --format json  # Сложность\nnpx jest --coverage                          # Покрытие\nnpx jscpd src/                               # Дупликация\n\n# Python\npython -m radon cc src/ -s -a                # Cyclomatic Complexity\npython -m pytest --cov=src                    # Покрытие\npylint src/                                   # Общее качество\n\n# Универсальные\nsonarqube                                     # Комплексный анализ\ncodeclimate                                   # SaaS-анализ' },
        { type: 'note', value: 'Метрики — это индикаторы, не цели. Не гонитесь за 100% coverage ради цифры. Фокусируйтесь на покрытии критических путей.' }
      ]
    },
    {
      id: 3,
      title: 'Безопасные стратегии рефакторинга',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Рефакторинг без страха' },
        { type: 'text', value: 'Главный страх при рефакторинге — «а вдруг сломаю?». Этот страх оправдан, если нет тестов. Безопасный рефакторинг начинается с создания «страховочной сетки» из тестов.' },
        { type: 'heading', value: 'Шаги безопасного рефакторинга' },
        { type: 'list', value: [
          '1. Напишите тесты для текущего поведения (characterization tests)',
          '2. Убедитесь что все тесты проходят (зелёные)',
          '3. Сделайте маленькое изменение',
          '4. Запустите тесты — если зелёные, продолжайте',
          '5. Если красные — откатите и разберитесь',
          '6. Коммитьте после каждого успешного шага'
        ]},
        { type: 'heading', value: 'Strangler Fig Pattern' },
        { type: 'code', language: 'javascript', value: '// Было: монолитная функция calculatePrice\nfunction calculatePrice(order) {\n  // 200 строк логики: скидки, налоги, доставка, промокоды...\n}\n\n// Шаг 1: Создаём новую функцию рядом со старой\nfunction calculatePriceV2(order) {\n  const subtotal = calculateSubtotal(order.items);\n  const discount = applyDiscounts(subtotal, order.promoCode);\n  const tax = calculateTax(discount, order.region);\n  const shipping = calculateShipping(order.items, order.address);\n  return { subtotal, discount, tax, shipping, total: discount + tax + shipping };\n}\n\n// Шаг 2: Переключаем трафик через feature flag\nfunction calculatePrice(order) {\n  if (featureFlags.isEnabled(\'new-pricing\')) {\n    return calculatePriceV2(order); // новая версия\n  }\n  // ... старый код (200 строк)\n}\n\n// Шаг 3: Когда убедились, что V2 работает — удаляем старый код' },
        { type: 'tip', value: 'Каждый коммит при рефакторинге должен оставлять код в рабочем состоянии. Если вы не можете сделать коммит — шаг слишком большой. Разбейте на два.' }
      ]
    },
    {
      id: 4,
      title: 'Убеждение менеджмента',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Как «продать» рефакторинг' },
        { type: 'text', value: 'Менеджер не станет выделять 2 недели на «переписывание кода, который и так работает». Ваша задача — показать, что рефакторинг — это инвестиция с измеримым возвратом, а не прихоть разработчика.' },
        { type: 'heading', value: 'Стратегии убеждения' },
        { type: 'list', value: [
          'Данные: «Вот график — время на фичу растёт из спринта в спринт»',
          'ROI: «Инвестируем 5 дней сейчас, экономим 3 дня на каждой следующей фиче»',
          'Риски: «Без рефакторинга следующий релиз будет на 2 недели позже»',
          'Совмещение: «Я рефакторю попутно с новой фичей, дополнительного времени нужно всего 20%»',
          'Прецедент: «В прошлый раз рефакторинг модуля X ускорил разработку на 40%»'
        ]},
        { type: 'heading', value: 'Формат предложения для менеджера' },
        { type: 'code', language: 'text', value: 'ПРЕДЛОЖЕНИЕ: Рефакторинг модуля оплаты\n\nПроблема:\n- Время добавления нового способа оплаты: 2 недели\n- Баги в оплате за последний квартал: 7 (среднее время исправления: 6 ч)\n- Покрытие тестами: 15%\n\nПредложение:\n- Разбить монолитный PaymentService на стратегии (Strategy Pattern)\n- Добавить тесты для основных сценариев (coverage → 80%)\n\nСтоимость: 8 дней (1 разработчик)\n\nОжидаемый результат:\n- Новый способ оплаты: 3 дня вместо 2 недель\n- Баги: снижение на 60% благодаря тестам\n- ROI: окупится после 2 новых способов оплаты (Q3 план: 3 способа)' },
        { type: 'note', value: 'Не называйте это «рефакторинг». Называйте «улучшение скорости разработки» или «снижение технических рисков». Бизнес-терминология работает лучше.' }
      ]
    },
    {
      id: 5,
      title: 'Рефакторинг в процессе работы',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Boy Scout Rule на практике' },
        { type: 'text', value: '«Оставь код чище, чем нашёл» — принцип бойскаутов. Это самый эффективный и наименее рискованный подход к рефакторингу. Вы не просите отдельное время — вы улучшаете код попутно с основной задачей.' },
        { type: 'heading', value: 'Что можно улучшить «попутно»' },
        { type: 'list', value: [
          'Переименовать непонятную переменную',
          'Извлечь повторяющийся код в функцию',
          'Добавить недостающую обработку ошибок',
          'Удалить закомментированный код',
          'Добавить типы (JSDoc → TypeScript)',
          'Упростить сложное условие'
        ]},
        { type: 'heading', value: 'Как оформить в PR' },
        { type: 'code', language: 'text', value: 'PR: feat(cart): add quantity validation\n\nЧто сделано:\n1. Добавлена валидация количества (основная задача)\n2. [Boy Scout] Переименовал calc() → calculateSubtotal()\n3. [Boy Scout] Извлёк validateCartItem() из 20-строчного if\n\nНебольшие улучшения помечены [Boy Scout] для удобства ревью.\nОни не меняют поведение — только улучшают читаемость.' },
        { type: 'tip', value: 'Держите Boy Scout изменения в отдельных коммитах от основной задачи. Это упрощает ревью и позволяет откатить отдельно, если нужно.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: спланируйте рефакторинг',
      type: 'practice',
      difficulty: 'hard',
      description: 'Вам дан проблемный код. Определите проблемы, спланируйте рефакторинг по шагам и подготовьте обоснование.',
      requirements: [
        'Проанализируйте код и найдите минимум 5 проблем',
        'Для каждой проблемы предложите конкретное решение',
        'Составьте план рефакторинга с порядком шагов',
        'Напишите бизнес-обоснование для менеджера',
        'Определите метрики до и после рефакторинга'
      ],
      hint: 'Ищите: God Object, длинные функции, дублирование, жёсткую связность, отсутствие тестов, магические числа.',
      expectedOutput: 'Проблемы: 6 найденных проблем\nПлан: 5 шагов рефакторинга\nМетрики: до и после\nОбоснование: ROI и сроки',
      solution: `// Проблемный код для анализа:
const problematicCode = \`
class OrderManager {
  processOrder(data) {
    // 1. Validate
    if (!data.email || !data.email.includes('@')) return { error: 'bad email' };
    if (!data.items || data.items.length === 0) return { error: 'no items' };
    if (data.items.some(i => i.qty < 1 || i.qty > 99)) return { error: 'bad qty' };

    // 2. Calculate price
    let total = 0;
    for (let i = 0; i < data.items.length; i++) {
      let price = data.items[i].price * data.items[i].qty;
      if (data.items[i].qty > 10) price *= 0.9;  // bulk discount
      if (data.promoCode === 'SAVE20') price *= 0.8;
      total += price;
    }
    if (total > 100) total -= 10;  // order discount
    total *= 1.12;  // tax

    // 3. Save to DB
    db.query('INSERT INTO orders VALUES (' + data.email + ', ' + total + ')');

    // 4. Send email
    smtp.send(data.email, 'Order confirmed', 'Total: ' + total);

    // 5. Update inventory
    for (let i = 0; i < data.items.length; i++) {
      db.query('UPDATE inventory SET qty = qty - ' + data.items[i].qty
        + ' WHERE id = ' + data.items[i].id);
    }

    return { success: true, total: total };
  }
}
\`;

const problems = [
  { id: 1, problem: 'God Method: processOrder делает 5 разных вещей (валидация, расчёт, БД, email, инвентарь)', severity: 'high' },
  { id: 2, problem: 'SQL Injection: конкатенация строк в SQL-запросах', severity: 'critical' },
  { id: 3, problem: 'Магические числа: 0.9, 0.8, 100, 10, 1.12, 99 — без пояснений', severity: 'medium' },
  { id: 4, problem: 'Нет обработки ошибок: что если db.query или smtp.send упадёт?', severity: 'high' },
  { id: 5, problem: 'Жёсткая связность: бизнес-логика, БД и email в одном методе', severity: 'high' },
  { id: 6, problem: 'Нет тестов: невозможно тестировать расчёт цены отдельно от БД', severity: 'high' }
];

const refactoringPlan = [
  { step: 1, action: 'Написать characterization tests для текущего поведения', time: '1 день' },
  { step: 2, action: 'Исправить SQL injection (параметризованные запросы)', time: '2 часа' },
  { step: 3, action: 'Извлечь константы вместо магических чисел', time: '1 час' },
  { step: 4, action: 'Разбить processOrder на: validate(), calculateTotal(), saveOrder(), sendConfirmation(), updateInventory()', time: '1 день' },
  { step: 5, action: 'Добавить обработку ошибок (try/catch, транзакции БД)', time: '0.5 дня' }
];

const metrics = {
  before: { complexity: 25, coverage: '0%', functions: 1, linesPerFunction: 35, sqlInjections: 2 },
  after: { complexity: 5, coverage: '85%', functions: 6, linesPerFunction: 10, sqlInjections: 0 }
};

const businessCase = 'Инвестиция: 3 дня. Устраняем security-уязвимость (SQL injection) ' +
  'и снижаем время на новые фичи в модуле заказов с 5 дней до 2 дней. ' +
  'ROI: окупится после первой задачи в модуле заказов.';

console.log('=== Проблемы ===');
problems.forEach(p => console.log(\`[\${p.severity}] \${p.id}. \${p.problem}\`));

console.log('\\n=== План рефакторинга ===');
refactoringPlan.forEach(s => console.log(\`Шаг \${s.step} (\${s.time}): \${s.action}\`));

console.log('\\n=== Метрики ===');
console.log('До:', JSON.stringify(metrics.before));
console.log('После:', JSON.stringify(metrics.after));

console.log('\\n=== Бизнес-обоснование ===');
console.log(businessCase);`,
      explanation: 'Рефакторинг — это не «сделать красиво». Это инвестиция в скорость и безопасность. Ключевые принципы: 1) Сначала тесты, потом рефакторинг. 2) Маленькие шаги с проверкой после каждого. 3) Бизнес-обоснование на языке денег и сроков. 4) Security-проблемы (SQL injection) — всегда приоритет номер один.'
    }
  ]
}
