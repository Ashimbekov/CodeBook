export default {
  id: 8,
  title: 'Очереди сообщений',
  description: 'Message Queues: Kafka, RabbitMQ, SQS. Паттерны pub/sub, point-to-point. Dead Letter Queue, гарантии доставки, consumer groups.',
  lessons: [
    {
      id: 1,
      title: 'Зачем нужны очереди сообщений',
      type: 'theory',
      content: [
        { type: 'text', value: 'Очередь сообщений (Message Queue) — промежуточный компонент, который позволяет сервисам общаться асинхронно. Producer отправляет сообщение, Consumer обрабатывает его независимо.' },
        { type: 'heading', value: 'Проблемы без очереди' },
        { type: 'text', value: 'Сценарий без очереди:\nПользователь регистрируется → синхронный вызов:\n  1. Сохранить в БД (100 мс)\n  2. Отправить email (300 мс — почтовый сервер медленный)\n  3. Отправить SMS (200 мс)\n  4. Обновить аналитику (150 мс)\n\nОбщее время: 750 мс. Если email-сервис упал → регистрация завалена!' },
        { type: 'heading', value: 'Решение с очередью' },
        { type: 'text', value: 'С очередью:\n  1. Сохранить в БД (100 мс)\n  2. Отправить событие "user_registered" в очередь (5 мс)\n  → Ответ пользователю: "Добро пожаловать!" (105 мс)\n\nВ фоне (асинхронно):\n  Email Worker: читает событие → отправляет email\n  SMS Worker: читает событие → отправляет SMS\n  Analytics Worker: читает событие → обновляет аналитику\n\nЕсли email-сервис упал → сообщение остаётся в очереди, будет обработано позже.' },
        { type: 'heading', value: 'Что даёт очередь' },
        { type: 'list', value: [
          'Decoupling (развязка): producer и consumer не знают друг о друге',
          'Асинхронная обработка: быстрый ответ клиенту, долгая работа в фоне',
          'Буферизация: принять нагрузку пика, обработать постепенно',
          'Надёжность: сообщение не потеряется при сбое consumer',
          'Масштабирование: добавить больше consumers при росте нагрузки'
        ]},
        { type: 'tip', value: 'Очередь — "подушка безопасности" между компонентами. Если один компонент замедлился — очередь буферизирует нагрузку. Producer продолжает работать, consumer догоняет в своём темпе.' }
      ]
    },
    {
      id: 2,
      title: 'RabbitMQ: традиционный брокер сообщений',
      type: 'theory',
      content: [
        { type: 'text', value: 'RabbitMQ — классический AMQP (Advanced Message Queuing Protocol) брокер. Реализует "умный" роутинг сообщений.' },
        { type: 'heading', value: 'Архитектура RabbitMQ' },
        { type: 'text', value: 'Компоненты:\n- Producer: отправляет сообщения в Exchange\n- Exchange: маршрутизирует сообщения в Queue(s) по правилам\n- Queue: хранит сообщения\n- Consumer: получает сообщения из Queue\n\nТипы Exchange:\n- Direct: роутинг по точному ключу (routing_key = "email" → email_queue)\n- Fanout: рассылка всем подключённым очередям (broadcast)\n- Topic: роутинг по паттерну ("user.*" → user_events_queue)\n- Headers: роутинг по заголовкам сообщения' },
        { type: 'heading', value: 'Гарантии доставки' },
        { type: 'text', value: 'At-most-once (не более одного раза):\n  Сообщение может быть потеряно, но не дублировано.\n\nAt-least-once (хотя бы один раз):\n  Сообщение доставлено минимум один раз, возможны дубликаты.\n  Consumer должен быть idempotent.\n\nExactly-once (ровно один раз):\n  Самое сложное, требует транзакций. RabbitMQ поддерживает с помощью подтверждений (acks).' },
        { type: 'note', value: 'RabbitMQ хорош для: task queues (обработка задач), work queues (распределение работы между воркерами), request-reply паттернов. Не идеален для высокого throughput и долгосрочного хранения (Kafka лучше).' }
      ]
    },
    {
      id: 3,
      title: 'Apache Kafka: распределённый лог событий',
      type: 'theory',
      content: [
        { type: 'text', value: 'Kafka — распределённый лог событий с очень высоким throughput. Изначально создан в LinkedIn для обработки миллиардов событий в день.' },
        { type: 'heading', value: 'Концепция: Distributed Log' },
        { type: 'text', value: 'Kafka хранит сообщения как упорядоченный, неизменяемый лог (append-only). Сообщения не удаляются при чтении — хранятся заданное время (по умолчанию 7 дней).\n\nАрхитектура:\n- Topic: именованный поток сообщений\n- Partition: топик разделён на партиции (параллельность)\n- Offset: позиция сообщения в партиции\n- Producer: пишет в топик\n- Consumer Group: группа consumers, совместно читающих топик' },
        { type: 'heading', value: 'Consumer Groups' },
        { type: 'text', value: 'Topic с 3 партициями, Consumer Group с 3 consumers:\nPartition 0 → Consumer 1\nPartition 1 → Consumer 2\nPartition 2 → Consumer 3\n\nКаждая партиция читается только одним consumer в группе.\nДобавить consumer в группу = параллельная обработка.\n\nРазные Consumer Groups читают топик независимо (каждая с разным offset).' },
        { type: 'heading', value: 'Kafka vs RabbitMQ: когда что' },
        { type: 'text', value: 'Kafka лучше когда:\n- Нужен очень высокий throughput (миллионы сообщений в секунду)\n- Нужно долгосрочное хранение событий\n- Несколько независимых потребителей читают один поток\n- Event sourcing / event streaming\n- Аналитика в реальном времени\n\nRabbitMQ лучше когда:\n- Сложный роутинг сообщений\n- Точное распределение задач между workers\n- Нужны приоритеты сообщений\n- Небольшой / средний объём сообщений' }
      ]
    },
    {
      id: 4,
      title: 'Pub/Sub паттерн',
      type: 'theory',
      content: [
        { type: 'text', value: 'Pub/Sub (Publish/Subscribe) — паттерн, где publishers отправляют сообщения в топик, а все subscribers получают копию.' },
        { type: 'heading', value: 'Отличие от Point-to-Point' },
        { type: 'text', value: 'Point-to-Point (очередь):\n  Sender → Queue → только ОДИН Receiver\n  Сообщение "потребляется" — исчезает после обработки\n  Пример: очередь задач, email отправка\n\nPub/Sub:\n  Publisher → Topic → ВСЕ Subscribers получают копию\n  Сообщение не "потребляется" — каждый subscriber читает независимо\n  Пример: событие "новый заказ" → и отдел доставки, и бухгалтерия, и аналитика' },
        { type: 'heading', value: 'Пример: event-driven архитектура с Pub/Sub' },
        { type: 'text', value: 'Событие: ORDER_PLACED → Topic "orders"\n\nSubscribers:\n  Inventory Service: уменьшить остаток товара\n  Payment Service: обработать платёж\n  Email Service: отправить подтверждение\n  Analytics Service: обновить статистику\n  Warehouse Service: создать задачу на отгрузку\n\nКаждый сервис подписывается и обрабатывает событие независимо. Если добавить новый сервис — он просто подписывается на существующий топик.' },
        { type: 'tip', value: 'Pub/Sub идеально для event-driven microservices. При добавлении нового сервиса не нужно менять publisher — просто добавить нового subscriber. Это Open/Closed Principle в архитектуре.' }
      ]
    },
    {
      id: 5,
      title: 'Dead Letter Queue (DLQ)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Что происходит, если consumer не может обработать сообщение? Ошибка? Некорректные данные? Dead Letter Queue решает эту проблему.' },
        { type: 'heading', value: 'Что такое DLQ' },
        { type: 'text', value: 'Dead Letter Queue — специальная очередь для сообщений, которые не удалось обработать.\n\nСообщение попадает в DLQ когда:\n1. Consumer отклонил сообщение (nack без requeue)\n2. Сообщение обработалось с ошибкой N раз (max retry exceeded)\n3. TTL сообщения истёк, никто не обработал\n4. Очередь переполнена' },
        { type: 'heading', value: 'Retry стратегия' },
        { type: 'text', value: 'Псевдокод обработки с retry:\n\nfunction processMessage(msg):\n  try:\n    doWork(msg)\n    ack(msg)  // Успех: подтвердить\n  except TransientError:  // Временная ошибка (сеть, БД недоступна)\n    if msg.retryCount < 3:\n      msg.retryCount++\n      requeue(msg, delay=2^retryCount * 1000ms)  // Exponential backoff\n    else:\n      sendToDLQ(msg)  // Исчерпаны попытки\n  except PermanentError:  // Постоянная ошибка (невалидные данные)\n    sendToDLQ(msg)  // Сразу в DLQ' },
        { type: 'heading', value: 'Работа с DLQ' },
        { type: 'list', value: [
          'Алерт при появлении сообщений в DLQ',
          'Анализ причин: баг в коде? Невалидные данные? Недоступный сервис?',
          'После исправления — replay сообщений из DLQ',
          'Метрики: DLQ size, DLQ growth rate'
        ]},
        { type: 'note', value: 'DLQ — обязательный элемент production-системы с очередями. Без него "проблемные" сообщения блокируют обработку или теряются. DLQ даёт второй шанс и visibility в проблемы.' }
      ]
    },
    {
      id: 6,
      title: 'Идемпотентность и гарантии доставки',
      type: 'theory',
      content: [
        { type: 'text', value: 'В распределённых системах сообщения могут быть доставлены дважды. Idempotency — защита от дублирования.' },
        { type: 'heading', value: 'Почему дубликаты неизбежны' },
        { type: 'text', value: 'Сценарий:\n1. Consumer получил сообщение и начал обработку\n2. Consumer обработал успешно, но упал до отправки ack\n3. Broker решил: ack не получен → сообщение не обработано\n4. Broker повторно отправляет сообщение\n5. Consumer обрабатывает снова\n\nПри гарантии at-least-once дубликаты неизбежны.' },
        { type: 'heading', value: 'Idempotency: как сделать обработку безопасной' },
        { type: 'text', value: 'Идемпотентная операция: выполнить N раз = выполнить 1 раз.\n\nПример 1: зачисление денег (НЕ идемпотентно)\n  credit(userId=1, amount=100)  → выполнить дважды = зачислить 200\n\nПример 2: зачисление денег с idempotency key (ИДЕМПОТЕНТНО)\n  credit(userId=1, amount=100, txId="abc123")\n  → При повторном вызове с тем же txId: проверить "уже обработан?" → пропустить\n\nРеализация:\n  1. Извлечь message_id (или custom idempotency_key) из сообщения\n  2. Проверить в Redis/БД: обрабатывалось ли уже?\n  3. Если да → пропустить (ack отправить)\n  4. Если нет → обработать → сохранить message_id как обработанное' },
        { type: 'tip', value: 'Правило: всегда проектируйте consumers как идемпотентные. Даже если вы используете exactly-once delivery, это надёжнее. Exactly-once — дорого и сложно, at-least-once + idempotency — прагматичный стандарт.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: проектируем систему обработки заказов',
      type: 'practice',
      content: [
        { type: 'text', value: 'Применим очереди для проектирования надёжной системы обработки заказов e-commerce.' },
        { type: 'heading', value: 'Задача' },
        { type: 'text', value: 'При создании заказа нужно:\n1. Сохранить заказ в БД\n2. Уменьшить остаток товара\n3. Обработать платёж\n4. Отправить email-подтверждение\n5. Уведомить склад\n6. Обновить аналитику\n\nТребования: надёжность, fast response для пользователя, независимые сбои компонентов.' },
        { type: 'heading', value: 'Архитектура с Kafka' },
        { type: 'text', value: 'Синхронный путь (критический):\n  POST /orders → [Order Service] → сохранить в БД → ответ "Заказ принят" (100 мс)\n\nАсинхронный путь (Kafka):\n  Order Service публикует: Topic "orders" → event {order_id, user_id, items, ...}\n\nSubscribers:\n  Inventory Consumer Group:\n    → уменьшить остатки в БД\n    → если товара нет → отправить "ORDER_FAILED" в топик\n\n  Payment Consumer Group:\n    → обработать платёж через payment gateway\n    → успех → event "PAYMENT_SUCCESS"\n    → неудача → event "PAYMENT_FAILED"\n\n  Email Consumer Group:\n    → при PAYMENT_SUCCESS → отправить email-подтверждение\n\n  Warehouse Consumer Group:\n    → при PAYMENT_SUCCESS → создать задание на сборку\n\n  Analytics Consumer Group:\n    → обновить статистику продаж в реальном времени' },
        { type: 'heading', value: 'Обработка ошибок' },
        { type: 'text', value: 'Каждый Consumer настроен:\n- Retry: 3 попытки с exponential backoff (1с, 2с, 4с)\n- DLQ: после 3 неудач → в dead_letter_queue топик\n- Алерт: при появлении сообщений в DLQ → PagerDuty\n\nInventory и Payment — idempotent:\n  Проверяем order_id в Redis перед обработкой — нет дублирования резервирования.' },
        { type: 'note', value: 'Такая архитектура используется в реальных e-commerce платформах (Amazon, Alibaba). Kafka даёт: высокий throughput, replay событий для debugging/replaying, audit log всех заказов.' }
      ]
    }
  ]
}
