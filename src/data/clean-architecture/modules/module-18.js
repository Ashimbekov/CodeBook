export default {
  id: 18,
  title: 'Модульный монолит',
  description: 'Модульный монолит как альтернатива микросервисам: модули, границы, внутренние API, независимое развитие и миграция.',
  lessons: [
    {
      id: 1,
      title: 'Что такое модульный монолит',
      type: 'theory',
      content: [
        { type: 'text', value: 'Модульный монолит — архитектурный стиль, где приложение деплоится как один артефакт, но внутри разделено на хорошо изолированные модули с чёткими границами. Это "золотая середина" между монолитом и микросервисами.' },
        { type: 'heading', value: 'Монолит vs Модульный монолит vs Микросервисы' },
        { type: 'list', value: [
          'Монолит: один деплой, нет границ между модулями, всё связано',
          'Модульный монолит: один деплой, чёткие границы, модули общаются через API',
          'Микросервисы: отдельный деплой для каждого сервиса, сетевое взаимодействие'
        ]},
        { type: 'heading', value: 'Преимущества модульного монолита' },
        { type: 'list', value: [
          'Простой деплой — один артефакт, одна БД',
          'Нет сетевых проблем — вызовы между модулями через память',
          'Простая транзакционность — одна БД, одна транзакция',
          'Чёткие границы — модули изолированы, как микросервисы',
          'Легко извлечь в микросервис позже'
        ]},
        { type: 'tip', value: 'Шопифай (Shopify) построен как модульный монолит на Ruby on Rails. Их подход: "начни с модульного монолита, извлекай микросервисы только когда нужно". Это прагматичнее, чем стартовать с микросервисов.' }
      ]
    },
    {
      id: 2,
      title: 'Структура модулей',
      type: 'theory',
      content: [
        { type: 'text', value: 'Каждый модуль — мини-приложение внутри монолита. У каждого модуля свой Domain, Application, Infrastructure. Модули общаются только через публичный API (интерфейсы).' },
        { type: 'code', language: 'java', value: 'src/\n├── modules/\n│   ├── ordering/                    # Модуль заказов\n│   │   ├── api/                     # Публичный API модуля\n│   │   │   ├── OrderingApi.java      # Интерфейс для других модулей\n│   │   │   └── OrderDto.java         # DTO для межмодульного общения\n│   │   ├── domain/\n│   │   │   ├── Order.java\n│   │   │   └── OrderRepository.java\n│   │   ├── application/\n│   │   │   └── PlaceOrderUseCase.java\n│   │   └── infrastructure/\n│   │       └── JpaOrderRepository.java\n│   │\n│   ├── catalog/                     # Модуль каталога\n│   │   ├── api/\n│   │   │   ├── CatalogApi.java\n│   │   │   └── ProductDto.java\n│   │   ├── domain/\n│   │   ├── application/\n│   │   └── infrastructure/\n│   │\n│   └── payment/                     # Модуль платежей\n│       ├── api/\n│       ├── domain/\n│       ├── application/\n│       └── infrastructure/\n│\n├── shared/                          # Общие компоненты\n│   ├── DomainEvent.java\n│   └── Money.java\n│\n└── config/                          # Composition Root\n    └── ModuleConfig.java' },
        { type: 'heading', value: 'Правила модулей' },
        { type: 'list', value: [
          'Модуль может обращаться к другому модулю ТОЛЬКО через его публичный API',
          'Модуль НЕ может напрямую читать таблицы другого модуля',
          'Модуль НЕ может импортировать внутренние классы другого модуля',
          'Общение между модулями через вызовы API или события',
          'Каждый модуль может иметь свою схему БД (разные schema в PostgreSQL)'
        ]},
        { type: 'warning', value: 'Главное правило: модули не лезут во внутренности друг друга. Если модуль A хочет данные модуля B — он вызывает B.api(), а не делает JOIN к таблицам B.' }
      ]
    },
    {
      id: 3,
      title: 'Коммуникация между модулями',
      type: 'theory',
      content: [
        { type: 'text', value: 'Модули общаются двумя способами: синхронно (через API-интерфейсы) и асинхронно (через события). Выбор зависит от характера взаимодействия.' },
        { type: 'heading', value: 'Синхронная коммуникация' },
        { type: 'code', language: 'java', value: '// Публичный API модуля Catalog\npublic interface CatalogApi {\n    ProductDto getProduct(String productId);\n    boolean isProductAvailable(String productId, int quantity);\n}\n\n// Реализация API\npublic class CatalogApiImpl implements CatalogApi {\n    private final ProductRepository productRepo;\n    \n    @Override\n    public ProductDto getProduct(String productId) {\n        Product product = productRepo.findById(new ProductId(productId)).orElseThrow();\n        return ProductDto.from(product);\n    }\n}\n\n// Ordering модуль вызывает Catalog API\npublic class PlaceOrderUseCase {\n    private final CatalogApi catalogApi; // зависимость от API, не от внутренних классов!\n    \n    public void execute(PlaceOrderCommand cmd) {\n        for (var item : cmd.items()) {\n            ProductDto product = catalogApi.getProduct(item.productId());\n            if (!catalogApi.isProductAvailable(item.productId(), item.quantity())) {\n                throw new ProductNotAvailableException(item.productId());\n            }\n        }\n        // ...\n    }\n}' },
        { type: 'heading', value: 'Асинхронная коммуникация через события' },
        { type: 'code', language: 'java', value: '// Ordering модуль публикует событие\npublic class PlaceOrderUseCase {\n    private final EventBus eventBus;\n    \n    public void execute(PlaceOrderCommand cmd) {\n        Order order = Order.create(cmd);\n        orderRepo.save(order);\n        eventBus.publish(new OrderPlacedEvent(order.id(), order.items()));\n    }\n}\n\n// Payment модуль подписан на событие\npublic class OrderPlacedEventHandler {\n    private final PaymentService paymentService;\n    \n    @EventListener\n    public void handle(OrderPlacedEvent event) {\n        paymentService.initiatePayment(event.orderId(), event.totalAmount());\n    }\n}\n\n// Inventory модуль тоже подписан\npublic class ReserveInventoryOnOrderPlaced {\n    @EventListener\n    public void handle(OrderPlacedEvent event) {\n        event.items().forEach(item ->\n            inventoryService.reserve(item.productId(), item.quantity())\n        );\n    }\n}' },
        { type: 'tip', value: 'Синхронные вызовы — для запросов данных (getProduct). Асинхронные события — для реакций на изменения (OrderPlaced → резерв склада, инициация оплаты). Это снижает coupling между модулями.' }
      ]
    },
    {
      id: 4,
      title: 'Изоляция данных между модулями',
      type: 'theory',
      content: [
        { type: 'text', value: 'Каждый модуль владеет своими данными. Другие модули не могут читать или писать в чужие таблицы напрямую. Это можно обеспечить через разные DB-схемы.' },
        { type: 'code', language: 'java', value: '// Каждый модуль — своя схема в PostgreSQL\n\n-- Модуль Ordering\nCREATE SCHEMA ordering;\nCREATE TABLE ordering.orders (id UUID PRIMARY KEY, ...);\nCREATE TABLE ordering.order_lines (...);\n\n-- Модуль Catalog\nCREATE SCHEMA catalog;\nCREATE TABLE catalog.products (id UUID PRIMARY KEY, ...);\nCREATE TABLE catalog.categories (...);\n\n-- Модуль Payment\nCREATE SCHEMA payment;\nCREATE TABLE payment.transactions (...);\n\n-- Нельзя: SELECT * FROM ordering.orders JOIN catalog.products\n-- Можно: ordering вызывает catalogApi.getProduct()' },
        { type: 'heading', value: 'Дублирование данных' },
        { type: 'text', value: 'Иногда модулю нужны данные из другого модуля для производительности (не хочется делать синхронный вызов). Решение — хранить копию нужных данных и синхронизировать через события.' },
        { type: 'code', language: 'java', value: '// Ordering модуль хранит копию информации о продуктах\n// Синхронизируется через события от Catalog\n\n// Catalog публикует событие при изменении цены\npublic class ProductPriceChangedEvent {\n    String productId;\n    BigDecimal newPrice;\n}\n\n// Ordering подписывается и обновляет свою копию\npublic class SyncProductPriceHandler {\n    private final OrderingProductCache productCache;\n    \n    @EventListener\n    public void handle(ProductPriceChangedEvent event) {\n        productCache.updatePrice(event.productId, event.newPrice);\n    }\n}' },
        { type: 'note', value: 'Дублирование данных — осознанный trade-off: мы жертвуем хранилищем ради производительности и автономии модулей. Это eventual consistency внутри монолита.' }
      ]
    },
    {
      id: 5,
      title: 'Миграция в микросервисы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Модульный монолит — идеальная отправная точка для микросервисов. Когда модуль нужно масштабировать независимо, его можно извлечь в отдельный сервис.' },
        { type: 'heading', value: 'Шаги миграции модуля в микросервис' },
        { type: 'list', value: [
          '1. Убедиться, что модуль общается с другими только через API и события',
          '2. Выделить БД модуля в отдельную базу данных',
          '3. Заменить in-process вызовы API на HTTP/gRPC-вызовы',
          '4. Заменить in-process события на message broker (Kafka/RabbitMQ)',
          '5. Деплоить модуль как отдельный сервис'
        ]},
        { type: 'code', language: 'java', value: '// До: синхронный вызов API через интерфейс (in-process)\npublic class CatalogApiImpl implements CatalogApi {\n    private final ProductRepository productRepo;\n    \n    @Override\n    public ProductDto getProduct(String productId) {\n        return ProductDto.from(productRepo.findById(productId));\n    }\n}\n\n// После: HTTP-вызов к микросервису (тот же интерфейс!)\npublic class CatalogApiHttpAdapter implements CatalogApi {\n    private final HttpClient httpClient;\n    private final String catalogServiceUrl;\n    \n    @Override\n    public ProductDto getProduct(String productId) {\n        HttpResponse response = httpClient.get(\n            catalogServiceUrl + "/api/products/" + productId\n        );\n        return deserialize(response.body(), ProductDto.class);\n    }\n}\n\n// Ordering модуль НЕ МЕНЯЛСЯ — он работает с интерфейсом CatalogApi!\n// Поменялась только реализация в Composition Root' },
        { type: 'tip', value: 'Ключевое преимущество: если границы модулей правильные, миграция в микросервисы — это замена реализации адаптера. Бизнес-логика не меняется.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: модульный монолит',
      type: 'practice',
      difficulty: 'hard',
      description: 'Спроектируйте модульный монолит для интернет-магазина с модулями Catalog, Ordering, Payment.',
      requirements: [
        'Определить публичные API для каждого модуля',
        'Реализовать синхронное взаимодействие: Ordering → Catalog API',
        'Реализовать асинхронное взаимодействие: Ordering → Payment через событие',
        'Обеспечить изоляцию данных (разные схемы)',
        'Показать, как извлечь Catalog в микросервис'
      ],
      hint: 'Каждый модуль имеет api/ (публичный), domain/, application/, infrastructure/. Ordering вызывает CatalogApi для получения продуктов, публикует OrderPlacedEvent для Payment.',
      expectedOutput: 'Три изолированных модуля с чёткими API. Ordering использует CatalogApi (синхронно) и публикует OrderPlacedEvent (асинхронно). Данные изолированы. Catalog готов к извлечению в микросервис.',
      solution: '// === CATALOG MODULE ===\n// api/CatalogApi.java\npublic interface CatalogApi {\n    ProductDto getProduct(String id);\n    List<ProductDto> searchProducts(String query);\n    boolean checkAvailability(String productId, int qty);\n}\n\n// api/ProductDto.java\npublic record ProductDto(String id, String name, BigDecimal price, int stock) {}\n\n// Реализация (internal)\nclass CatalogApiImpl implements CatalogApi {\n    private final ProductRepository repo;\n    public ProductDto getProduct(String id) {\n        return ProductDto.from(repo.findById(new ProductId(id)).orElseThrow());\n    }\n    public boolean checkAvailability(String productId, int qty) {\n        Product p = repo.findById(new ProductId(productId)).orElseThrow();\n        return p.stock() >= qty;\n    }\n}\n\n// === ORDERING MODULE ===\n// Uses CatalogApi (синхронно)\npublic class PlaceOrderUseCase {\n    private final CatalogApi catalogApi;\n    private final OrderRepository orderRepo;\n    private final EventBus eventBus;\n    \n    public OrderDto execute(PlaceOrderCommand cmd) {\n        List<OrderLine> lines = new ArrayList<>();\n        for (var item : cmd.items()) {\n            ProductDto product = catalogApi.getProduct(item.productId());\n            if (!catalogApi.checkAvailability(item.productId(), item.quantity())) {\n                throw new ProductNotAvailableException(item.productId());\n            }\n            lines.add(new OrderLine(item.productId(), product.name(), item.quantity(), product.price()));\n        }\n        Order order = Order.create(cmd.customerId(), lines);\n        orderRepo.save(order);\n        eventBus.publish(new OrderPlacedEvent(order.id(), order.total()));\n        return OrderDto.from(order);\n    }\n}\n\n// === PAYMENT MODULE ===\n// Listens to OrderPlacedEvent (асинхронно)\npublic class ProcessPaymentOnOrderPlaced {\n    private final PaymentService paymentService;\n    \n    @EventListener\n    public void handle(OrderPlacedEvent event) {\n        paymentService.initiatePayment(event.orderId(), event.totalAmount());\n    }\n}\n\n// === MIGRATION TO MICROSERVICE ===\n// Заменяем CatalogApiImpl на HTTP-адаптер\npublic class CatalogApiHttpClient implements CatalogApi {\n    private final HttpClient http;\n    public ProductDto getProduct(String id) {\n        return http.get("http://catalog-service/api/products/" + id, ProductDto.class);\n    }\n}\n// Ordering модуль НЕ ИЗМЕНИЛСЯ — только Composition Root',
      explanation: 'Catalog предоставляет CatalogApi (интерфейс) и ProductDto. Ordering вызывает CatalogApi синхронно и публикует OrderPlacedEvent. Payment подписан на событие. Для миграции в микросервисы достаточно заменить CatalogApiImpl на CatalogApiHttpClient в Composition Root — бизнес-логика Ordering не меняется.'
    }
  ]
}
