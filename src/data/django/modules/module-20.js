export default {
  id: 20,
  title: 'Сигналы',
  description: 'pre_save, post_save, post_delete и кастомные сигналы — реагируем на события в Django приложении.',
  lessons: [
    {
      id: 1,
      title: 'Что такое сигналы Django',
      type: 'theory',
      content: [
        { type: 'text', value: 'Сигналы Django — это механизм публикации/подписки (pub/sub). Когда происходит определённое событие (сохранение модели, вход пользователя), Django отправляет сигнал, и все подписчики получают уведомление.' },
        { type: 'tip', value: 'Сигналы как система оповещений: когда пользователь регистрируется (событие), автоматически создаётся профиль (обработчик). Не нужно вручную вызывать создание профиля — сигнал сделает это сам.' },
        { type: 'heading', value: 'Основные встроенные сигналы' },
        { type: 'list', items: [
          'pre_save — до сохранения объекта в БД',
          'post_save — после сохранения объекта в БД',
          'pre_delete — до удаления объекта',
          'post_delete — после удаления объекта',
          'pre_migrate / post_migrate — до/после применения миграций',
          'request_started / request_finished — начало/конец HTTP запроса'
        ]},
        { type: 'note', value: 'Сигналы выполняются синхронно в том же потоке. Для тяжёлых операций (отправка email, API запросы) используй Celery задачи внутри обработчика сигнала.' }
      ]
    },
    {
      id: 2,
      title: 'post_save: создание профиля пользователя',
      type: 'theory',
      content: [
        { type: 'text', value: 'Классический пример сигнала — автоматическое создание профиля при регистрации пользователя.' },
        { type: 'code', language: 'python', value: 'from django.db.models.signals import post_save\nfrom django.dispatch import receiver\nfrom django.contrib.auth.models import User\nfrom .models import UserProfile\n\n@receiver(post_save, sender=User)\ndef create_user_profile(sender, instance, created, **kwargs):\n    """Создаёт профиль при создании нового пользователя"""\n    if created:  # True только при создании, не при обновлении\n        UserProfile.objects.create(user=instance)\n\n@receiver(post_save, sender=User)\ndef save_user_profile(sender, instance, **kwargs):\n    """Сохраняет профиль при обновлении пользователя"""\n    instance.profile.save()' },
        { type: 'warning', value: 'Обработчик сигнала должен быть зарегистрирован при запуске приложения. Лучшее место — метод ready() в AppConfig или файл signals.py, импортированный в apps.py.' }
      ]
    },
    {
      id: 3,
      title: 'Регистрация сигналов через AppConfig',
      type: 'theory',
      content: [
        { type: 'text', value: 'Правильный способ регистрировать сигналы — через метод ready() в классе AppConfig приложения.' },
        { type: 'code', language: 'python', value: '# myapp/apps.py\nfrom django.apps import AppConfig\n\nclass MyappConfig(AppConfig):\n    name = "myapp"\n    default_auto_field = "django.db.models.BigAutoField"\n\n    def ready(self):\n        import myapp.signals  # импортируем файл с сигналами\n\n# myapp/signals.py\nfrom django.db.models.signals import post_save, post_delete\nfrom django.dispatch import receiver\nfrom .models import Article\n\n@receiver(post_save, sender=Article)\ndef article_saved(sender, instance, created, **kwargs):\n    action = "создана" if created else "обновлена"\n    print(f"Статья {instance.title} {action}")\n\n# myapp/__init__.py\ndefault_app_config = "myapp.apps.MyappConfig"' },
        { type: 'heading', value: 'Отключение и отладка сигналов' },
        { type: 'code', language: 'python', value: '# Временное отключение сигнала (для тестов или batch-обработки):\nfrom django.db.models.signals import post_save\nfrom django.contrib.auth.models import User\n\n# Отключить:\npost_save.disconnect(create_user_profile, sender=User)\n\n# ... делаем batch операции без триггера сигнала ...\nUser.objects.bulk_create([User(username=f"user{i}") for i in range(1000)])\n\n# Снова подключить:\npost_save.connect(create_user_profile, sender=User)\n\n# Контекстный менеджер для безопасного отключения:\nfrom contextlib import contextmanager\n\n@contextmanager\ndef mute_signals(*signals_to_mute):\n    """Временно отключает сигналы"""\n    muted = []\n    for signal, sender, receiver_func in signals_to_mute:\n        signal.disconnect(receiver_func, sender=sender)\n        muted.append((signal, sender, receiver_func))\n    try:\n        yield\n    finally:\n        for signal, sender, receiver_func in muted:\n            signal.connect(receiver_func, sender=sender)\n\n# Использование:\nwith mute_signals((post_save, User, create_user_profile)):\n    user = User.objects.create(username="testuser")' },
        { type: 'note', value: 'Если сигнал не регистрируется — проверь что файл signals.py импортируется в AppConfig.ready(). Частая ошибка: сигнал подключён, но ready() не вызывает import. Добавь print() в обработчик для быстрой отладки.' }
      ]
    },
    {
      id: 4,
      title: 'pre_save: модификация перед сохранением',
      type: 'theory',
      content: [
        { type: 'text', value: 'pre_save вызывается до сохранения. Полезен для автоматической генерации slug, форматирования данных, валидации.' },
        { type: 'code', language: 'python', value: 'from django.db.models.signals import pre_save\nfrom django.dispatch import receiver\nfrom django.utils.text import slugify\nfrom .models import Article\n\n@receiver(pre_save, sender=Article)\ndef auto_generate_slug(sender, instance, **kwargs):\n    """Автоматически генерирует slug из заголовка"""\n    if not instance.slug:\n        base_slug = slugify(instance.title)\n        slug = base_slug\n        counter = 1\n        # Проверяем уникальность\n        while Article.objects.filter(slug=slug).exclude(pk=instance.pk).exists():\n            slug = f"{base_slug}-{counter}"\n            counter += 1\n        instance.slug = slug' },
        { type: 'tip', value: 'В pre_save нельзя вызывать instance.save() — это создаст бесконечную рекурсию. Просто изменяй атрибуты instance, Django сам сохранит их.' }
      ]
    },
    {
      id: 5,
      title: 'Кастомные сигналы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Можно создавать собственные сигналы для кастомных событий в приложении.' },
        { type: 'code', language: 'python', value: '# signals.py\nfrom django.dispatch import Signal\n\n# Создаём кастомный сигнал\norder_completed = Signal()\nuser_level_up = Signal()\n\n# Отправка сигнала\nfrom .signals import order_completed\n\nclass OrderViewSet(viewsets.ModelViewSet):\n    def complete_order(self, request, pk=None):\n        order = self.get_object()\n        order.status = "completed"\n        order.save()\n        # Отправляем сигнал с дополнительными данными\n        order_completed.send(\n            sender=self.__class__,\n            order=order,\n            user=request.user\n        )\n        return Response({"status": "заказ выполнен"})\n\n# Подписка на кастомный сигнал\n@receiver(order_completed)\ndef on_order_completed(sender, order, user, **kwargs):\n    # Начисляем бонусные баллы\n    user.profile.bonus_points += order.total_price // 100\n    user.profile.save()' },
        { type: 'heading', value: 'Несколько обработчиков одного сигнала и send_robust' },
        { type: 'code', language: 'python', value: '# Несколько независимых обработчиков для одного события:\nfrom django.dispatch import Signal, receiver\n\norder_completed = Signal()\n\n@receiver(order_completed)\ndef send_confirmation_email(sender, order, **kwargs):\n    """Отправляем подтверждение на email"""\n    send_email(\n        to=order.user.email,\n        subject="Заказ подтверждён",\n        body=f"Заказ #{order.id} на {order.total_price} руб. оформлен"\n    )\n\n@receiver(order_completed)\ndef update_inventory(sender, order, **kwargs):\n    """Уменьшаем остатки на складе"""\n    for item in order.items.all():\n        item.product.stock -= item.quantity\n        item.product.save(update_fields=["stock"])\n\n@receiver(order_completed)\ndef create_invoice(sender, order, **kwargs):\n    """Создаём счёт-фактуру"""\n    Invoice.objects.create(order=order)\n\n# send_robust не прерывается при ошибке в обработчике:\nresponses = order_completed.send_robust(\n    sender=OrderService,\n    order=order,\n    user=user\n)\n# responses = [(handler1_func, result_or_exception), ...]\nfor handler, result in responses:\n    if isinstance(result, Exception):\n        logger.error(f"Ошибка в {handler.__name__}: {result}")' },
        { type: 'tip', value: 'Используй send_robust() вместо send() когда один обработчик не должен прерывать выполнение остальных. Например при отправке уведомлений: ошибка email не должна отменять обновление склада.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Сигналы для системы уведомлений',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй систему уведомлений через сигналы: создание профиля, уведомление о новом комментарии.',
      requirements: [
        'post_save на User создаёт UserProfile с полем bio (TextField) и avatar (ImageField)',
        'post_save на Comment уведомляет автора статьи (создаёт Notification объект)',
        'Notification модель: recipient (FK User), message (TextField), is_read (BooleanField)',
        'Не создавать уведомление, если автор комментария == автор статьи',
        'Зарегистрировать сигналы через AppConfig.ready()'
      ],
      expectedOutput: 'Создание User -> автоматически создаётся UserProfile\nСоздание Comment -> Notification для автора статьи\nАвтор комментирует свою статью -> Notification не создаётся',
      hint: 'В обработчике comment post_save проверяй created=True. Сравни comment.author с comment.post.author.',
      solution: '# models.py\nclass UserProfile(models.Model):\n    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")\n    bio = models.TextField(blank=True)\n\nclass Notification(models.Model):\n    recipient = models.ForeignKey(User, on_delete=models.CASCADE)\n    message = models.TextField()\n    is_read = models.BooleanField(default=False)\n\n# signals.py\nfrom django.db.models.signals import post_save\nfrom django.dispatch import receiver\nfrom django.contrib.auth.models import User\nfrom .models import UserProfile, Comment, Notification\n\n@receiver(post_save, sender=User)\ndef create_profile(sender, instance, created, **kwargs):\n    if created:\n        UserProfile.objects.create(user=instance)\n\n@receiver(post_save, sender=Comment)\ndef notify_on_comment(sender, instance, created, **kwargs):\n    if created and instance.author != instance.post.author:\n        Notification.objects.create(\n            recipient=instance.post.author,\n            message=f"{instance.author.username} прокомментировал вашу статью"\n        )',
      explanation: 'Проверка created=True защищает от повторного создания уведомлений при обновлении комментария. Сравнение авторов предотвращает самоуведомления. AppConfig.ready() гарантирует регистрацию сигналов при старте Django.'
    }
  ]
}
