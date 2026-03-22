export default {
  id: 9,
  title: 'CDN и статика',
  description: 'Content Delivery Network: как работает, Pull vs Push CDN, кеширование статики, инвалидация, глобальная доставка контента.',
  lessons: [
    {
      id: 1,
      title: 'CDN: принципы работы и зачем нужен',
      type: 'theory',
      content: [
        { type: 'text', value: 'CDN (Content Delivery Network) — глобальная сеть серверов, хранящих кешированные копии контента рядом с пользователями. Цель: минимальная латентность, снижение нагрузки на origin.' },
        { type: 'heading', value: 'Проблема без CDN' },
        { type: 'text', value: 'Ситуация: ваш сервер в Нью-Йорке, пользователь в Токио.\nРасстояние: ~11,000 км\nЛатентность: ~150–200 мс только на "долет" пакета\n\nДля загрузки страницы с 20 ресурсами (JS, CSS, изображения):\n20 × 200 мс = 4 секунды только на сетевые задержки!\n\nЛюди закрывают сайт, если он грузится дольше 3 секунд.' },
        { type: 'heading', value: 'CDN: контент рядом с пользователем' },
        { type: 'text', value: 'CDN имеет сотни Point of Presence (POP) по всему миру.\n\nПользователь в Токио → CDN POP в Токио (~5 мс)\nПользователь в Лондоне → CDN POP в Лондоне (~5 мс)\nПользователь в Бразилии → CDN POP в Сан-Паулу (~5 мс)\n\nGeo DNS или Anycast автоматически направляет пользователя к ближайшему POP.' },
        { type: 'heading', value: 'Что CDN даёт помимо скорости' },
        { type: 'list', value: [
          'Защита от DDoS: CDN поглощает атаку (сотни Гбит/с мощности)',
          'Снижение нагрузки на origin: 80–95% запросов обслуживает CDN',
          'SSL терминация: CDN завершает TLS, к origin идёт обычный HTTP',
          'Сжатие: gzip/Brotli на CDN, а не на каждом сервере',
          'HTTP/2, HTTP/3: CDN поддерживает современные протоколы'
        ]},
        { type: 'note', value: 'Топ CDN провайдеры: Cloudflare (самый популярный), AWS CloudFront, Akamai (старейший, enterprise), Fastly (для разработчиков), Google Cloud CDN.' }
      ]
    },
    {
      id: 2,
      title: 'Pull CDN: лениво по требованию',
      type: 'theory',
      content: [
        { type: 'text', value: 'Pull CDN (наиболее распространённый тип): CDN загружает контент с origin только по первому запросу.' },
        { type: 'heading', value: 'Как работает Pull CDN' },
        { type: 'text', value: 'Первый запрос на CDN POP (cache miss):\n1. Пользователь в Токио: GET cdn.example.com/logo.png\n2. CDN POP Токио: нет в кеше\n3. CDN идёт к origin: GET origin.example.com/logo.png\n4. Получает файл, кеширует у себя\n5. Отдаёт пользователю\n\nВсе последующие запросы (cache hit):\n1. Пользователь в Токио: GET cdn.example.com/logo.png\n2. CDN POP Токио: есть в кеше!\n3. Отдаёт мгновенно (без обращения к origin)' },
        { type: 'heading', value: 'Cache-Control заголовки' },
        { type: 'text', value: 'Origin сервер указывает CDN, как долго хранить файл:\n\nCache-Control: public, max-age=31536000  → кешировать 1 год (JS/CSS с хешем в имени)\nCache-Control: public, max-age=3600      → кешировать 1 час (изображения)\nCache-Control: no-cache                  → всегда проверять актуальность у origin\nCache-Control: private                   → не кешировать на CDN (персональные данные)' },
        { type: 'heading', value: 'Преимущества и ограничения Pull CDN' },
        { type: 'text', value: 'Плюсы:\n- Не нужно вручную загружать файлы на CDN\n- CDN автоматически заполняется по мере запросов\n- Простая интеграция: сменить URL с origin на CDN\n\nМинусы:\n- Первый пользователь каждого региона получает медленный ответ (cache miss)\n- При инвалидации нужно либо ждать TTL, либо явно инвалидировать' },
        { type: 'tip', value: 'Для SPA (React, Vue): все bundle файлы имеют hash в имени (app.3d8f2a1.js). При деплое новый hash = новое имя файла = CDN автоматически загрузит новую версию. Старые файлы кешируются 1 год.' }
      ]
    },
    {
      id: 3,
      title: 'Push CDN: активная загрузка',
      type: 'theory',
      content: [
        { type: 'text', value: 'Push CDN: вы заранее загружаете контент на CDN серверы. CDN хранит всё, что вы загрузили, пока вы это не удалите.' },
        { type: 'heading', value: 'Как работает Push CDN' },
        { type: 'text', value: 'Workflow:\n1. Разработчик деплоит новую версию\n2. CI/CD автоматически загружает файлы через CDN API:\n   cdnClient.upload("/static/app-v2.js", fileContent)\n   cdnClient.upload("/static/styles-v2.css", fileContent)\n3. Файлы сразу доступны во всех POP мире\n4. Нет "холодного старта" — первый пользователь любого региона получает быстрый ответ' },
        { type: 'heading', value: 'Когда использовать Push CDN' },
        { type: 'list', value: [
          'Небольшое количество файлов, которые обязательно должны быть быстры с первого запроса',
          'Статичный сайт с редкими обновлениями',
          'Game assets: все игровые текстуры/звуки должны быть везде',
          'Критичный маркетинговый лендинг (запуск продукта)'
        ]},
        { type: 'heading', value: 'Pull vs Push: сравнение' },
        { type: 'text', value: 'Pull CDN:\n  Когда: большой сайт с тысячами файлов, неизвестно какие популярны\n  Плюс: автоматически, не нужно управлять\n  Минус: cold start для каждого нового региона\n\nPush CDN:\n  Когда: критичный контент, небольшой объём, нужна гарантированная скорость\n  Плюс: нет cold start, полный контроль\n  Минус: нужно управлять загрузкой, хранение всего во всех POP' }
      ]
    },
    {
      id: 4,
      title: 'Инвалидация CDN кеша',
      type: 'theory',
      content: [
        { type: 'text', value: 'Вы обновили файл на origin. Как убедиться, что CDN раздаёт новую версию?' },
        { type: 'heading', value: 'Стратегия 1: Версионирование в имени файла' },
        { type: 'text', value: 'Лучший подход: менять имя файла при каждом обновлении.\n\nСборщик (Webpack/Vite) генерирует:\n  app.abc123.js  → версия 1\n  app.def456.js  → версия 2 (новый хеш = новый файл)\n\nСтарый файл (app.abc123.js) остаётся в кеше — нормально, браузер уже не запросит его.\nНовый файл (app.def456.js) — первый запрос пройдёт через origin, закешируется.\n\nПреимущество: TTL может быть 1 год, инвалидация не нужна — имя файла само по себе является "версией".' },
        { type: 'heading', value: 'Стратегия 2: Cache-Control с коротким TTL' },
        { type: 'text', value: 'Для файлов, которые могут меняться (например, index.html):\n  Cache-Control: public, max-age=300  → устаревает через 5 минут\n\nПро: просто, не нужно ничего делать\nМинус: 5 минут пользователи видят старую версию' },
        { type: 'heading', value: 'Стратегия 3: Явная инвалидация через API' },
        { type: 'text', value: 'CDN API позволяет явно удалить кешированный файл:\n\nCDN API запрос:\n  POST /invalidate\n  { "paths": ["/index.html", "/api/config.json"] }\n\nCloudFront: aws cloudfront create-invalidation --paths "/index.html"\nCloudflare: API вызов на purge конкретных URL\n\nМинус: инвалидация распространяется по всем POP с задержкой (30 сек – 5 мин).' },
        { type: 'tip', value: 'Золотая стратегия: index.html без кеша (no-cache) + все остальные ресурсы с хешем в имени и TTL = 1 год. При деплое: обновляется index.html с новыми ссылками на бандлы, браузер подгружает новые версии.' }
      ]
    },
    {
      id: 5,
      title: 'CDN для динамического контента',
      type: 'theory',
      content: [
        { type: 'text', value: 'CDN — не только для статики. Современные CDN умеют кешировать и обрабатывать динамические запросы.' },
        { type: 'heading', value: 'Edge Computing: логика на CDN' },
        { type: 'text', value: 'CDN Edge Functions (Cloudflare Workers, Lambda@Edge):\n\nПример: A/B тестирование на CDN\n\nfunction handleRequest(request):\n  userId = getCookie(request, "user_id")\n  variant = hash(userId) % 2 == 0 ? "A" : "B"\n  return fetch(request.url + "?variant=" + variant)\n\nЭта логика выполняется на CDN сервере рядом с пользователем, без обращения к origin.' },
        { type: 'heading', value: 'CDN кеш для API ответов' },
        { type: 'text', value: 'Публичные, редко меняющиеся API ответы можно кешировать:\n\nGET /api/products?category=electronics\n  Cache-Control: public, s-maxage=300  → CDN кешируется на 5 минут\n\nРезультат: тысячи пользователей смотрят каталог → все отвечает CDN, origin получает 1 запрос в 5 минут!\n\nНО: персонализированные данные не кешировать!\n  GET /api/user/cart  — у каждого пользователя своя корзина\n  Cache-Control: private, no-store' },
        { type: 'note', value: 'Современный тренд: Jamstack (JavaScript, APIs, Markup) — весь сайт — статичные файлы на CDN, динамика через API. Быстро, дёшево, масштабируется. Netlify, Vercel, Cloudflare Pages строятся на этом принципе.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: CDN стратегия для крупного сайта',
      type: 'practice',
      solution: 'CDN стратегия для новостного сайта (50M пользователей/месяц, аудитория США/Европа/Азия):\n\nJS/CSS бандлы (app.{hash}.js):\n- Pull CDN (Cloudflare), Cache-Control: max-age=31536000 (1 год)\n- Инвалидация не нужна — хеш меняется при деплое\n\nindex.html:\n- Pull CDN, Cache-Control: s-maxage=60 (1 минута на CDN)\n- При деплое: инвалидировать через Cloudflare API\n\nИзображения к статьям:\n- Pull CDN + image optimization (авто-WebP, resize)\n- Cache-Control: max-age=604800 (7 дней)\n- Имена: /images/{article_id}/{image_hash}.jpg\n\nВидео:\n- AWS CloudFront + S3 origin, HLS сегменты\n- Cache-Control: max-age=86400 (1 день)\n\nAPI публичных статей:\n- Cache-Control: s-maxage=30 (30 сек на CDN)\n- При публикации: инвалидировать конкретный URL\n\nРезультат: cache hit rate ~92%, нагрузка на origin снижена в 12 раз.',
      explanation: 'Стратегия зависит от типа контента: неизменяемые файлы (с хешем в имени) кешируются на год; часто меняющийся HTML — короткий TTL; динамическое API — кеш только для публичных данных. Разделение на Pull/Push: Pull для большого количества файлов, Push для критичного небольшого контента. Измерение hit rate по типам — обязательно.',
      content: [
        { type: 'text', value: 'Разработаем CDN стратегию для новостного сайта с глобальной аудиторией.' },
        { type: 'heading', value: 'Характеристики системы' },
        { type: 'text', value: '- 50 млн уникальных пользователей в месяц\n- Аудитория: США 40%, Европа 35%, Азия 25%\n- Контент: статьи, изображения, видео\n- Статьи обновляются часто (Breaking News)\n- Frontend: React SPA' },
        { type: 'heading', value: 'Стратегия по типам контента' },
        { type: 'text', value: 'JavaScript/CSS бандлы (app.{hash}.js):\n  CDN: Cloudflare (Pull)\n  Cache-Control: public, max-age=31536000 (1 год)\n  Инвалидация: не нужна — хеш меняется при деплое\n\nindex.html:\n  CDN: Cloudflare (Pull)\n  Cache-Control: public, s-maxage=60 (1 минута на CDN)\n  Логика: при деплое — инвалидировать через API\n\nИзображения к статьям:\n  CDN: Cloudflare (Pull) + image optimization (авто-webp, авто-resize)\n  Cache-Control: public, max-age=604800 (7 дней)\n  Имена: /images/{article_id}/{image_hash}.jpg\n\nВидео:\n  CDN: AWS CloudFront (Pull) + S3 origin\n  Adaptive Bitrate Streaming (HLS)\n  Кешировать сегменты видео: max-age=86400 (1 день)\n\nAPI: GET /api/articles/{slug} (публичные статьи):\n  Cache-Control: public, s-maxage=30 (30 сек на CDN)\n  При публикации новой статьи — инвалидировать URL через Cloudflare API' },
        { type: 'heading', value: 'Результат' },
        { type: 'text', value: 'До CDN: origin получает все 50 млн запросов\nПосле CDN:\n  Cache hit rate: ~92%\n  Origin: ~4 млн запросов (в 12 раз меньше)\n  Средняя латентность для пользователей: 20 мс вместо 150+ мс\n  Защита от DDoS: CDN поглощает атаки автоматически' },
        { type: 'tip', value: 'Всегда измеряйте cache hit rate по типам контента. Если hit rate для изображений 95%, а для API 30% — нужно разобраться почему API кешируется плохо (может слишком короткий TTL или Vary заголовки мешают).' }
      ]
    }
  ]
}
