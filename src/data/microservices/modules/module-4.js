export default {
  id: 4,
  title: 'gRPC и Protocol Buffers',
  description: 'Высокопроизводительное межсервисное взаимодействие через gRPC: Protocol Buffers, unary и streaming вызовы, генерация кода, сравнение с REST.',
  lessons: [
    {
      id: 1,
      title: 'Что такое gRPC',
      type: 'theory',
      content: [
        { type: 'text', value: 'gRPC — высокопроизводительный RPC-фреймворк от Google. Использует HTTP/2 для транспорта и Protocol Buffers для сериализации. В микросервисах gRPC применяется для внутренней коммуникации между сервисами, где важна скорость.' },
        { type: 'heading', value: 'gRPC vs REST' },
        { type: 'list', value: [
          'gRPC: бинарный протокол (protobuf) — в 5-10 раз быстрее JSON',
          'gRPC: HTTP/2 — мультиплексирование, сжатие заголовков',
          'gRPC: строгая типизация — контракт в .proto файле',
          'gRPC: streaming — двунаправленный поток данных',
          'REST: текстовый (JSON) — проще отлаживать, читать',
          'REST: HTTP/1.1 — универсальная поддержка, браузеры',
          'REST: более зрелая экосистема — инструменты, документация'
        ] },
        { type: 'code', language: 'bash', value: '# Архитектура gRPC:\n# [Client Stub] --protobuf--> [HTTP/2] --protobuf--> [Server]\n#\n# Типы вызовов:\n# 1. Unary RPC:      Client -> Request -> Server -> Response -> Client\n# 2. Server Streaming: Client -> Request -> Server -> Stream of Responses\n# 3. Client Streaming: Client -> Stream of Requests -> Server -> Response\n# 4. Bidirectional:    Client <-> Stream <-> Server\n\n# Производительность (примерное сравнение):\n# REST + JSON:    ~1ms сериализация, ~500 bytes payload\n# gRPC + Protobuf: ~0.1ms сериализация, ~100 bytes payload\n# gRPC в 5-10 раз быстрее для inter-service communication' },
        { type: 'tip', value: 'Используйте gRPC для внутренней коммуникации между сервисами (server-to-server), а REST для внешнего API (клиентские приложения, мобильные). API Gateway транслирует REST -> gRPC.' }
      ]
    },
    {
      id: 2,
      title: 'Protocol Buffers',
      type: 'theory',
      content: [
        { type: 'text', value: 'Protocol Buffers (protobuf) — язык описания интерфейсов и формат сериализации от Google. Файл .proto определяет структуры данных и RPC-сервисы. Из .proto генерируется код на любом языке.' },
        { type: 'code', language: 'protobuf', value: '// order_service.proto\nsyntax = "proto3";\n\npackage shop.order;\n\noption java_multiple_files = true;\noption java_package = "com.shop.order.grpc";\n\nimport "google/protobuf/timestamp.proto";\n\n// Сервис — определяет RPC методы\nservice OrderService {\n  // Unary — один запрос, один ответ\n  rpc CreateOrder (CreateOrderRequest) returns (OrderResponse);\n  rpc GetOrder (GetOrderRequest) returns (OrderResponse);\n  \n  // Server streaming — один запрос, поток ответов\n  rpc GetOrderUpdates (GetOrderRequest) returns (stream OrderStatusUpdate);\n  \n  // Client streaming — поток запросов, один ответ\n  rpc BulkCreateOrders (stream CreateOrderRequest) returns (BulkOrderResponse);\n}\n\n// Сообщения — структуры данных\nmessage CreateOrderRequest {\n  string customer_id = 1;     // Номер поля (не значение!)\n  repeated OrderItem items = 2; // repeated = список\n}\n\nmessage OrderItem {\n  string product_id = 1;\n  int32 quantity = 2;\n  double price = 3;\n}\n\nmessage OrderResponse {\n  string id = 1;\n  string customer_id = 2;\n  OrderStatus status = 3;\n  double total_amount = 4;\n  repeated OrderItem items = 5;\n  google.protobuf.Timestamp created_at = 6;\n}\n\n// Enum\nenum OrderStatus {\n  ORDER_STATUS_UNSPECIFIED = 0; // Всегда 0 для unknown\n  ORDER_STATUS_CREATED = 1;\n  ORDER_STATUS_CONFIRMED = 2;\n  ORDER_STATUS_SHIPPED = 3;\n  ORDER_STATUS_DELIVERED = 4;\n  ORDER_STATUS_CANCELLED = 5;\n}\n\nmessage OrderStatusUpdate {\n  string order_id = 1;\n  OrderStatus old_status = 2;\n  OrderStatus new_status = 3;\n  google.protobuf.Timestamp updated_at = 4;\n}\n\nmessage GetOrderRequest {\n  string order_id = 1;\n}\n\nmessage BulkOrderResponse {\n  int32 created_count = 1;\n  int32 failed_count = 2;\n  repeated string created_ids = 3;\n}' },
        { type: 'warning', value: 'Номера полей в protobuf (= 1, = 2) никогда нельзя переиспользовать! При обновлении proto файла добавляйте новые поля с новыми номерами. Удалённые поля помечайте reserved.' }
      ]
    },
    {
      id: 3,
      title: 'gRPC-сервер на Java',
      type: 'theory',
      content: [
        { type: 'text', value: 'Spring Boot с grpc-spring-boot-starter позволяет легко создавать gRPC-серверы. Из .proto файла генерируются базовые классы, мы наследуемся от них и реализуем бизнес-логику.' },
        { type: 'code', language: 'java', value: '// build.gradle — зависимости\n// plugins {\n//     id "com.google.protobuf" version "0.9.4"\n// }\n// dependencies {\n//     implementation "net.devh:grpc-spring-boot-starter:3.0.0"\n//     implementation "io.grpc:grpc-protobuf"\n//     implementation "io.grpc:grpc-stub"\n// }\n\n// Реализация gRPC-сервера\n@GrpcService\npublic class OrderGrpcService extends OrderServiceGrpc.OrderServiceImplBase {\n\n    private final OrderService orderService;\n\n    // Unary RPC\n    @Override\n    public void createOrder(\n            CreateOrderRequest request,\n            StreamObserver<OrderResponse> responseObserver) {\n        try {\n            Order order = orderService.create(\n                UUID.fromString(request.getCustomerId()),\n                request.getItemsList().stream()\n                    .map(item -> new OrderItemDto(\n                        UUID.fromString(item.getProductId()),\n                        item.getQuantity(),\n                        BigDecimal.valueOf(item.getPrice())))\n                    .toList()\n            );\n\n            OrderResponse response = toProto(order);\n            responseObserver.onNext(response);    // Отправляем ответ\n            responseObserver.onCompleted();        // Завершаем\n        } catch (Exception e) {\n            responseObserver.onError(\n                Status.INTERNAL\n                    .withDescription(e.getMessage())\n                    .asRuntimeException()\n            );\n        }\n    }\n\n    // Server Streaming RPC\n    @Override\n    public void getOrderUpdates(\n            GetOrderRequest request,\n            StreamObserver<OrderStatusUpdate> responseObserver) {\n        String orderId = request.getOrderId();\n\n        // Подписка на обновления статуса\n        orderService.subscribeToUpdates(orderId, update -> {\n            responseObserver.onNext(OrderStatusUpdate.newBuilder()\n                .setOrderId(orderId)\n                .setOldStatus(mapStatus(update.oldStatus()))\n                .setNewStatus(mapStatus(update.newStatus()))\n                .build());\n        });\n    }\n\n    private OrderResponse toProto(Order order) {\n        return OrderResponse.newBuilder()\n            .setId(order.getId().toString())\n            .setCustomerId(order.getCustomerId().toString())\n            .setStatus(mapStatus(order.getStatus()))\n            .setTotalAmount(order.getTotalAmount().doubleValue())\n            .build();\n    }\n}' },
        { type: 'note', value: 'gRPC использует статус-коды вместо HTTP кодов: OK, NOT_FOUND, INVALID_ARGUMENT, INTERNAL, UNAVAILABLE, DEADLINE_EXCEEDED. Они маппятся на HTTP коды через grpc-gateway.' }
      ]
    },
    {
      id: 4,
      title: 'gRPC-клиент',
      type: 'theory',
      content: [
        { type: 'text', value: 'gRPC-клиент генерируется из того же .proto файла. Есть блокирующий (sync) и асинхронный (async) стабы. В Spring Boot можно инжектировать gRPC-стабы через аннотации.' },
        { type: 'code', language: 'java', value: '// gRPC клиент в Spring Boot\n@Service\npublic class OrderGrpcClient {\n\n    // Инжекция блокирующего стаба\n    @GrpcClient("order-service")\n    private OrderServiceGrpc.OrderServiceBlockingStub orderStub;\n\n    // Инжекция асинхронного стаба\n    @GrpcClient("order-service")\n    private OrderServiceGrpc.OrderServiceStub asyncOrderStub;\n\n    // Unary вызов (синхронный)\n    public OrderResponse createOrder(UUID customerId, List<OrderItemDto> items) {\n        CreateOrderRequest request = CreateOrderRequest.newBuilder()\n            .setCustomerId(customerId.toString())\n            .addAllItems(items.stream()\n                .map(i -> OrderItem.newBuilder()\n                    .setProductId(i.productId().toString())\n                    .setQuantity(i.quantity())\n                    .setPrice(i.price().doubleValue())\n                    .build())\n                .toList())\n            .build();\n\n        try {\n            return orderStub\n                .withDeadlineAfter(5, TimeUnit.SECONDS) // Таймаут\n                .createOrder(request);\n        } catch (StatusRuntimeException e) {\n            if (e.getStatus().getCode() == Status.Code.DEADLINE_EXCEEDED) {\n                throw new ServiceTimeoutException("order-service");\n            }\n            throw new GrpcCallException("order-service", e);\n        }\n    }\n\n    // Server Streaming (асинхронный)\n    public void subscribeToOrderUpdates(String orderId) {\n        GetOrderRequest request = GetOrderRequest.newBuilder()\n            .setOrderId(orderId)\n            .build();\n\n        asyncOrderStub.getOrderUpdates(request, new StreamObserver<>() {\n            @Override\n            public void onNext(OrderStatusUpdate update) {\n                log.info("Заказ {} изменил статус: {} -> {}",\n                    update.getOrderId(),\n                    update.getOldStatus(),\n                    update.getNewStatus());\n            }\n\n            @Override\n            public void onError(Throwable t) {\n                log.error("Ошибка streaming: {}", t.getMessage());\n            }\n\n            @Override\n            public void onCompleted() {\n                log.info("Streaming завершён");\n            }\n        });\n    }\n}' },
        { type: 'code', language: 'yaml', value: '# application.yml — конфигурация gRPC клиента\ngrpc:\n  client:\n    order-service:\n      address: dns:///order-service:9090\n      negotiation-type: plaintext  # TLS в production!\n      enable-keep-alive: true\n      keep-alive-time: 30s\n      keep-alive-timeout: 5s' },
        { type: 'tip', value: 'Всегда устанавливайте deadline (таймаут) для gRPC вызовов. Без deadline запрос может висеть бесконечно. Рекомендуемые значения: 1-5 секунд для unary, больше для streaming.' }
      ]
    },
    {
      id: 5,
      title: 'Streaming и двунаправленный обмен',
      type: 'theory',
      content: [
        { type: 'text', value: 'gRPC поддерживает 4 типа вызовов. Streaming особенно полезен для: real-time обновлений, загрузки больших данных частями, подписки на события.' },
        { type: 'code', language: 'protobuf', value: '// chat_service.proto — пример bidirectional streaming\nsyntax = "proto3";\n\nservice ChatService {\n  // Bidirectional streaming — чат между сервисами\n  rpc Chat (stream ChatMessage) returns (stream ChatMessage);\n  \n  // Client streaming — загрузка файла частями\n  rpc UploadFile (stream FileChunk) returns (UploadResponse);\n  \n  // Server streaming — подписка на уведомления\n  rpc Subscribe (SubscribeRequest) returns (stream Notification);\n}\n\nmessage ChatMessage {\n  string sender = 1;\n  string content = 2;\n  int64 timestamp = 3;\n}\n\nmessage FileChunk {\n  string filename = 1;\n  bytes content = 2;\n  int32 chunk_number = 3;\n  bool is_last = 4;\n}\n\nmessage UploadResponse {\n  string file_id = 1;\n  int64 total_size = 2;\n}' },
        { type: 'code', language: 'java', value: '// Bidirectional Streaming — реализация сервера\n@GrpcService\npublic class ChatGrpcService extends ChatServiceGrpc.ChatServiceImplBase {\n\n    @Override\n    public StreamObserver<ChatMessage> chat(\n            StreamObserver<ChatMessage> responseObserver) {\n\n        return new StreamObserver<>() {\n            @Override\n            public void onNext(ChatMessage message) {\n                // Получили сообщение от клиента\n                log.info("Получено от {}: {}", message.getSender(), message.getContent());\n\n                // Отправляем ответ обратно (echo + обработка)\n                ChatMessage response = ChatMessage.newBuilder()\n                    .setSender("server")\n                    .setContent("Обработано: " + message.getContent())\n                    .setTimestamp(System.currentTimeMillis())\n                    .build();\n                responseObserver.onNext(response);\n            }\n\n            @Override\n            public void onError(Throwable t) {\n                log.error("Ошибка в chat stream: {}", t.getMessage());\n            }\n\n            @Override\n            public void onCompleted() {\n                responseObserver.onCompleted();\n            }\n        };\n    }\n}' },
        { type: 'note', value: 'gRPC streaming работает поверх HTTP/2 streams. Одно TCP-соединение поддерживает множество параллельных streams — это эффективнее чем REST, где каждый запрос требует отдельного соединения (HTTP/1.1) или stream (HTTP/2).' }
      ]
    },
    {
      id: 6,
      title: 'Практика: gRPC-сервис заказов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте gRPC-сервис для управления заказами с поддержкой streaming обновлений.',
      requirements: [
        'Опишите .proto файл с сервисом OrderService (CRUD + streaming)',
        'Реализуйте gRPC-сервер с методами CreateOrder, GetOrder, GetOrderUpdates',
        'Реализуйте gRPC-клиент с таймаутами и обработкой ошибок',
        'Добавьте server streaming для отслеживания статуса заказа',
        'Настройте interceptor для логирования всех вызовов',
        'Напишите конфигурацию подключения в application.yml'
      ],
      hint: 'Используйте grpc-spring-boot-starter. Для interceptor создайте класс implements ServerInterceptor. Для streaming используйте StreamObserver.onNext() для отправки каждого обновления.',
      expectedOutput: 'gRPC сервер запущен на порту 9090.\nCreateOrder: отправлен CreateOrderRequest -> получен OrderResponse с id и статусом CREATED.\nGetOrder: отправлен GetOrderRequest -> получен OrderResponse.\nGetOrderUpdates: подписка -> получены 3 обновления статуса (CREATED->CONFIRMED->SHIPPED->DELIVERED).\nInterceptor логирует: метод, duration, статус для каждого вызова.',
      solution: '// order_service.proto\n// syntax = "proto3";\n// service OrderService {\n//   rpc CreateOrder (CreateOrderRequest) returns (OrderResponse);\n//   rpc GetOrder (GetOrderRequest) returns (OrderResponse);\n//   rpc GetOrderUpdates (GetOrderRequest) returns (stream OrderStatusUpdate);\n// }\n\n// Серверная реализация\n@GrpcService\npublic class OrderGrpcServiceImpl extends OrderServiceGrpc.OrderServiceImplBase {\n\n    private final OrderService orderService;\n\n    @Override\n    public void createOrder(CreateOrderRequest request,\n                           StreamObserver<OrderResponse> responseObserver) {\n        Order order = orderService.create(\n            UUID.fromString(request.getCustomerId()),\n            mapItems(request.getItemsList()));\n        responseObserver.onNext(toProto(order));\n        responseObserver.onCompleted();\n    }\n\n    @Override\n    public void getOrderUpdates(GetOrderRequest request,\n                               StreamObserver<OrderStatusUpdate> responseObserver) {\n        orderService.subscribeToUpdates(request.getOrderId(), update -> {\n            responseObserver.onNext(OrderStatusUpdate.newBuilder()\n                .setOrderId(request.getOrderId())\n                .setNewStatus(mapStatus(update.newStatus()))\n                .build());\n        });\n    }\n}\n\n// Interceptor для логирования\n@Component\npublic class LoggingInterceptor implements ServerInterceptor {\n    @Override\n    public <Q, R> ServerCall.Listener<Q> interceptCall(\n            ServerCall<Q, R> call, Metadata headers,\n            ServerCallHandler<Q, R> next) {\n        long start = System.currentTimeMillis();\n        String method = call.getMethodDescriptor().getFullMethodName();\n        log.info("gRPC call: {}", method);\n        return next.startCall(call, headers);\n    }\n}',
      explanation: 'gRPC обеспечивает строгую типизацию через .proto контракт, высокую производительность через protobuf и HTTP/2, streaming для real-time обновлений. Interceptors позволяют добавлять cross-cutting concerns: логирование, метрики, аутентификацию.'
    }
  ]
}
