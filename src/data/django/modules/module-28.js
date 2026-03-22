export default {
  id: 28,
  title: 'Практикум: Полное приложение',
  description: 'Практикум по созданию полноценного E-commerce приложения с нуля: от моделей до деплоя.',
  lessons: [
    {
      id: 1,
      title: 'Задача: E-commerce модели',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спроектируй и создай все модели для интернет-магазина.',
      requirements: [
        'Product: name, slug, description, price (DecimalField), stock (PositiveIntegerField), category (FK), images (related), is_active',
        'Category: name, slug, parent (FK self, null=True) — дерево категорий',
        'Order: user, status (pending/paid/shipped/delivered/cancelled), total, created_at, shipping_address',
        'OrderItem: order (FK), product (FK), quantity, price (снапшот цены на момент заказа)',
        'Cart и CartItem: для корзины покупок'
      ],
      expectedOutput: 'Category.objects.filter(parent=None)  # корневые категории\nOrder.objects.filter(user=user, status="pending").annotate(items_count=Count("items"))',
      hint: 'Price в OrderItem — снапшот: цена может измениться, но в заказе должна оставаться той что была. parent=models.ForeignKey("self", null=True, blank=True) для дерева.',
      solution: 'from django.db import models\nfrom django.contrib.auth.models import User\n\nclass Category(models.Model):\n    name = models.CharField(max_length=100)\n    slug = models.SlugField(unique=True)\n    parent = models.ForeignKey("self", null=True, blank=True, on_delete=models.SET_NULL, related_name="children")\n    def __str__(self): return self.name\n\nclass Product(models.Model):\n    name = models.CharField(max_length=200)\n    slug = models.SlugField(unique=True)\n    description = models.TextField()\n    price = models.DecimalField(max_digits=10, decimal_places=2)\n    stock = models.PositiveIntegerField(default=0)\n    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name="products")\n    is_active = models.BooleanField(default=True)\n    def __str__(self): return self.name\n    @property\n    def in_stock(self): return self.stock > 0\n\nclass Order(models.Model):\n    STATUS = [("pending","Ожидает оплаты"),("paid","Оплачен"),("shipped","Отправлен"),("delivered","Доставлен"),("cancelled","Отменён")]\n    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="orders")\n    status = models.CharField(max_length=20, choices=STATUS, default="pending")\n    total = models.DecimalField(max_digits=12, decimal_places=2, default=0)\n    created_at = models.DateTimeField(auto_now_add=True)\n    shipping_address = models.TextField()\n\nclass OrderItem(models.Model):\n    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")\n    product = models.ForeignKey(Product, on_delete=models.PROTECT)\n    quantity = models.PositiveIntegerField()\n    price = models.DecimalField(max_digits=10, decimal_places=2)  # снапшот',
      explanation: 'PROTECT на product в OrderItem — нельзя удалить товар если он есть в заказе. Это защищает историю заказов. price — снапшот: копируется из product.price при создании заказа.'
    },
    {
      id: 2,
      title: 'Задача: API корзины покупок',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй полный API для управления корзиной покупок.',
      requirements: [
        'GET /api/cart/ возвращает корзину текущего пользователя с товарами и итогом',
        'POST /api/cart/add/ принимает product_id и quantity, добавляет/увеличивает',
        'DELETE /api/cart/remove/{item_id}/ удаляет позицию',
        'POST /api/cart/clear/ очищает корзину',
        'Cart создаётся автоматически для пользователя при первом обращении',
        'CartSerializer возвращает items, total_price, items_count'
      ],
      expectedOutput: 'GET /api/cart/ -> {"items": [...], "total_price": "15999.00", "items_count": 3}\nPOST /api/cart/add/ {"product_id": 1, "quantity": 2} -> обновлённая корзина',
      hint: 'Cart.objects.get_or_create(user=request.user). CartItem.objects.get_or_create(cart=cart, product=product) затем item.quantity += quantity.',
      solution: 'from rest_framework.views import APIView\nfrom rest_framework.permissions import IsAuthenticated\nfrom rest_framework.response import Response\nfrom rest_framework import status\nfrom .models import Cart, CartItem, Product\nfrom .serializers import CartSerializer\n\nclass CartView(APIView):\n    permission_classes = [IsAuthenticated]\n\n    def get_cart(self):\n        cart, _ = Cart.objects.get_or_create(user=self.request.user)\n        return cart\n\n    def get(self, request):\n        cart = self.get_cart()\n        return Response(CartSerializer(cart).data)\n\nclass CartAddView(APIView):\n    permission_classes = [IsAuthenticated]\n\n    def post(self, request):\n        product = Product.objects.get(id=request.data["product_id"])\n        quantity = int(request.data.get("quantity", 1))\n        cart, _ = Cart.objects.get_or_create(user=request.user)\n        item, created = CartItem.objects.get_or_create(cart=cart, product=product)\n        if not created:\n            item.quantity += quantity\n        else:\n            item.quantity = quantity\n        item.save()\n        return Response(CartSerializer(cart).data)\n\nclass CartClearView(APIView):\n    permission_classes = [IsAuthenticated]\n    def post(self, request):\n        cart, _ = Cart.objects.get_or_create(user=request.user)\n        cart.items.all().delete()\n        return Response({"status": "корзина очищена"})',
      explanation: 'get_or_create для Cart гарантирует один экземпляр на пользователя. При добавлении товара: если уже есть — увеличиваем quantity, иначе создаём новый CartItem с указанным количеством.'
    },
    {
      id: 3,
      title: 'Задача: Создание заказа и оплата',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй процесс оформления заказа из корзины с проверкой наличия товаров.',
      requirements: [
        'POST /api/orders/checkout/ создаёт Order из Cart',
        'Проверяет наличие каждого товара (stock >= quantity)',
        'Создаёт OrderItem для каждого CartItem с price=product.price (снапшот)',
        'Уменьшает stock каждого товара',
        'Очищает корзину после создания заказа',
        'Всё в одной транзакции (atomic)'
      ],
      expectedOutput: 'POST /api/orders/checkout/ {"shipping_address": "Алматы, ул. Ленина 1"} -> {"order_id": 123, "total": "45999.00", "status": "pending"}\nПри недостаточном количестве -> 400 "Товар iPhone недоступен в количестве 5"',
      hint: 'Используй transaction.atomic(). Перед созданием OrderItem проверяй product.stock >= item.quantity.',
      solution: 'from django.db import transaction\nfrom rest_framework.views import APIView\nfrom rest_framework.permissions import IsAuthenticated\nfrom rest_framework.response import Response\nfrom rest_framework import status\nfrom .models import Cart, Order, OrderItem\n\nclass CheckoutView(APIView):\n    permission_classes = [IsAuthenticated]\n\n    def post(self, request):\n        cart, _ = Cart.objects.get_or_create(user=request.user)\n        if not cart.items.exists():\n            return Response({"error": "Корзина пуста"}, status=400)\n\n        shipping_address = request.data.get("shipping_address")\n        if not shipping_address:\n            return Response({"error": "Укажите адрес доставки"}, status=400)\n\n        try:\n            with transaction.atomic():\n                order = Order.objects.create(\n                    user=request.user,\n                    shipping_address=shipping_address\n                )\n                total = 0\n                for item in cart.items.select_related("product"):\n                    if item.product.stock < item.quantity:\n                        raise ValueError(f"Товар {item.product.name} недоступен в количестве {item.quantity}")\n                    OrderItem.objects.create(\n                        order=order, product=item.product,\n                        quantity=item.quantity, price=item.product.price\n                    )\n                    item.product.stock -= item.quantity\n                    item.product.save()\n                    total += item.product.price * item.quantity\n                order.total = total\n                order.save()\n                cart.items.all().delete()\n                return Response({"order_id": order.id, "total": str(total)}, status=201)\n        except ValueError as e:\n            return Response({"error": str(e)}, status=400)',
      explanation: 'transaction.atomic() гарантирует: если что-то пошло не так (нет товара), все изменения откатятся. ValueError внутри atomic() вызывает rollback. select_related("product") — без него N+1 запросов.'
    },
    {
      id: 4,
      title: 'Задача: Celery для обработки платежей',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй асинхронную обработку платежа через Celery с уведомлением пользователя.',
      requirements: [
        'Задача process_payment(order_id, payment_data) имитирует внешний платёжный API',
        'При успехе: обновляет Order.status="paid", отправляет email',
        'При ошибке: retry 3 раза с задержкой 60 сек, затем status="payment_failed"',
        'POST /api/orders/{id}/pay/ принимает данные карты и ставит задачу в очередь',
        'Немедленно возвращает {"status": "processing", "order_id": id}'
      ],
      expectedOutput: 'POST /api/orders/1/pay/ {"card": "4242..."} -> {"status": "processing"}\n[через 2 сек] Order.status = "paid", email отправлен',
      hint: 'Имитация платежа: import random; success = random.random() > 0.1 (90% успех). При ошибке raise self.retry().',
      solution: '# tasks.py\nimport random\nimport logging\nfrom celery import shared_task\nfrom django.core.mail import send_mail\nfrom .models import Order\n\nlogger = logging.getLogger(__name__)\n\n@shared_task(bind=True, max_retries=3, default_retry_delay=60)\ndef process_payment(self, order_id, payment_data):\n    try:\n        order = Order.objects.get(id=order_id)\n        # Имитация внешнего платёжного API\n        success = random.random() > 0.1\n        if not success:\n            raise Exception("Отказ платёжной системы")\n        order.status = "paid"\n        order.save()\n        send_mail("Заказ оплачен", f"Заказ #{order.id} успешно оплачен", "shop@example.com", [order.user.email])\n        logger.info(f"Платёж для заказа {order_id} успешен")\n        return {"status": "paid"}\n    except Exception as exc:\n        if self.request.retries >= self.max_retries:\n            Order.objects.filter(id=order_id).update(status="payment_failed")\n            logger.error(f"Платёж для заказа {order_id} не прошёл")\n            return\n        raise self.retry(exc=exc)\n\n# views.py\nfrom .tasks import process_payment\nfrom rest_framework.decorators import action\n\n@action(detail=True, methods=["post"])\ndef pay(self, request, pk=None):\n    order = self.get_object()\n    process_payment.delay(order.id, request.data)\n    return Response({"status": "processing", "order_id": order.id})',
      explanation: 'request.retries >= max_retries проверяет исчерпание попыток перед retry. update() вместо save() — атомарное обновление статуса без загрузки объекта. Немедленный ответ "processing" — UX паттерн: пользователь не ждёт ответа платёжной системы.'
    },
    {
      id: 5,
      title: 'Задача: Поиск и фильтрация товаров',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай мощный API поиска товаров с фильтрацией по цене, категории, наличию.',
      requirements: [
        'ProductViewSet с FilterSet: min_price, max_price, category (slug), in_stock (Boolean)',
        'SearchFilter по name и description',
        'OrderingFilter по price, name, created_at',
        'Аннотация: avg_rating через related Review модель',
        'Пагинация 24 товара на страницу (типично для каталога)'
      ],
      expectedOutput: 'GET /api/products/?min_price=1000&max_price=50000&category=electronics&in_stock=true&ordering=price -> отфильтрованный каталог',
      hint: 'category фильтр: field_name="category__slug". in_stock: method="filter_in_stock" который делает filter(stock__gt=0).',
      solution: 'import django_filters\nfrom rest_framework import viewsets, filters\nfrom rest_framework.pagination import PageNumberPagination\nfrom django_filters.rest_framework import DjangoFilterBackend\nfrom django.db.models import Avg\nfrom .models import Product\nfrom .serializers import ProductSerializer\n\nclass ProductFilter(django_filters.FilterSet):\n    min_price = django_filters.NumberFilter(field_name="price", lookup_expr="gte")\n    max_price = django_filters.NumberFilter(field_name="price", lookup_expr="lte")\n    category = django_filters.CharFilter(field_name="category__slug")\n    in_stock = django_filters.BooleanFilter(method="filter_in_stock")\n    def filter_in_stock(self, qs, name, value):\n        return qs.filter(stock__gt=0) if value else qs\n    class Meta:\n        model = Product\n        fields = []\n\nclass CatalogPagination(PageNumberPagination):\n    page_size = 24\n\nclass ProductViewSet(viewsets.ReadOnlyModelViewSet):\n    serializer_class = ProductSerializer\n    pagination_class = CatalogPagination\n    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]\n    filterset_class = ProductFilter\n    search_fields = ["name", "description"]\n    ordering_fields = ["price", "name"]\n\n    def get_queryset(self):\n        return Product.objects.filter(is_active=True).select_related("category").annotate(avg_rating=Avg("reviews__rating"))',
      explanation: 'ReadOnlyModelViewSet — каталог только для чтения, нельзя создать/изменить товар через публичный API. filter(stock__gt=0) — gt значит greater than (больше нуля). Аннотация avg_rating в get_queryset — один SQL запрос для всех товаров.'
    },
    {
      id: 6,
      title: 'Задача: Система отзывов с рейтингом',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй систему отзывов для товаров: один отзыв на пользователя на товар.',
      requirements: [
        'Review модель: product (FK), user (FK), rating (1-5, IntegerField validators), text, created_at',
        'Meta unique_together = [product, user] — один отзыв на пользователя',
        'ReviewSerializer с валидацией: нельзя оставить отзыв если не покупал товар',
        'ReviewViewSet: create проверяет уникальность, list показывает все',
        'При создании отзыва инвалидировать кеш продукта'
      ],
      expectedOutput: 'POST /api/products/1/reviews/ {"rating": 5, "text": "Отлично!"} -> 201\nПовторный POST -> 400 "Вы уже оставили отзыв на этот товар"\nPOST без покупки -> 403 "Сначала купите товар"',
      hint: 'Валидация покупки: OrderItem.objects.filter(order__user=request.user, product=product, order__status="delivered").exists()',
      solution: 'from django.core.validators import MinValueValidator, MaxValueValidator\nfrom rest_framework import serializers, viewsets\nfrom rest_framework.permissions import IsAuthenticated\nfrom .models import Review, Product, OrderItem\n\nclass ReviewSerializer(serializers.ModelSerializer):\n    class Meta:\n        model = Review\n        fields = ["id","rating","text","created_at"]\n\n    def validate(self, data):\n        request = self.context["request"]\n        product = self.context["product"]\n        if Review.objects.filter(product=product, user=request.user).exists():\n            raise serializers.ValidationError("Вы уже оставили отзыв на этот товар")\n        has_bought = OrderItem.objects.filter(\n            order__user=request.user, product=product, order__status="delivered"\n        ).exists()\n        if not has_bought:\n            raise serializers.ValidationError("Сначала купите товар")\n        return data\n\n    def create(self, validated_data):\n        product = self.context["product"]\n        return Review.objects.create(\n            product=product, user=self.context["request"].user, **validated_data\n        )',
      explanation: 'Валидация "только для покупателей" — бизнес-правило в сериализаторе. context передаётся из ViewSet через get_serializer_context(). unique_together на уровне БД — финальная защита от дублей.'
    },
    {
      id: 7,
      title: 'Задача: Полный CI/CD для E-commerce',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай GitHub Actions пайплайн для автоматического тестирования и деплоя E-commerce приложения.',
      requirements: [
        'Workflow: on push to main/develop',
        'Job test: Python 3.12, PostgreSQL service, запуск pytest с coverage',
        'Job lint: flake8 и black --check',
        'Job deploy: только на main, SSH деплой на сервер или docker push',
        'Все секреты через GitHub Secrets',
        'Уведомление в Telegram при успешном деплое'
      ],
      expectedOutput: 'git push origin main\n-> Tests (pass) -> Lint (pass) -> Deploy -> Telegram "Деплой успешен!"',
      hint: 'PostgreSQL service в GitHub Actions: services: postgres: image: postgres:15, env: POSTGRES_PASSWORD, POSTGRES_DB.',
      solution: '# .github/workflows/main.yml\nname: CI/CD\non:\n  push:\n    branches: [main, develop]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    services:\n      postgres:\n        image: postgres:15\n        env:\n          POSTGRES_PASSWORD: testpass\n          POSTGRES_DB: testdb\n        options: --health-cmd pg_isready\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v5\n        with: {python-version: "3.12"}\n      - run: pip install -r requirements/development.txt\n      - run: python manage.py test --verbosity=2\n        env:\n          DATABASE_URL: postgresql://postgres:testpass@localhost/testdb\n          DJANGO_SETTINGS_MODULE: config.settings.testing\n  deploy:\n    needs: test\n    if: github.ref == "refs/heads/main"\n    runs-on: ubuntu-latest\n    steps:\n      - uses: appleboy/ssh-action@v1\n        with:\n          host: ${{ secrets.SERVER_HOST }}\n          username: ${{ secrets.SERVER_USER }}\n          key: ${{ secrets.SSH_PRIVATE_KEY }}\n          script: cd /app && bash deploy.sh\n      - name: Telegram\n        run: |\n          curl -s -X POST https://api.telegram.org/bot${{ secrets.TG_TOKEN }}/sendMessage \\\n          -d chat_id=${{ secrets.TG_CHAT_ID }} -d text="Деплой успешен!"',
      explanation: 'needs: test гарантирует: deploy запускается только после успешных тестов. if: github.ref — deploy только с main ветки. appleboy/ssh-action — популярное действие для SSH деплоя. options: --health-cmd ждёт готовности PostgreSQL.'
    },
    {
      id: 8,
      title: 'Задача: Мониторинг и логирование',
      type: 'practice',
      difficulty: 'medium',
      description: 'Настрой профессиональное логирование и мониторинг для Django E-commerce приложения.',
      requirements: [
        'Настройка LOGGING в settings: INFO в консоль, ERROR в файл, WARNING в Sentry',
        'Middleware для логирования времени выполнения медленных запросов (>500ms)',
        'Celery задача для отправки daily health check метрик',
        'Custom management command check_low_stock — находит товары с stock < 5',
        'Prometheus метрики через django-prometheus (опционально)'
      ],
      expectedOutput: '[2024-01-15 10:00:01] WARNING: Медленный запрос GET /api/products/ — 750ms\n[2024-01-15 10:00:02] INFO: Запрос обработан за 45ms\npython manage.py check_low_stock -> "5 товаров с низким остатком: iPhone, Samsung..."',
      hint: 'Middleware: import time; start = time.time(); response = self.get_response(request); duration = (time.time() - start) * 1000.',
      solution: '# settings.py\nLOGGING = {\n    "version": 1,\n    "handlers": {\n        "console": {"class": "logging.StreamHandler", "level": "INFO"},\n        "file": {"class": "logging.FileHandler", "filename": "errors.log", "level": "ERROR"},\n    },\n    "root": {"handlers": ["console", "file"], "level": "INFO"},\n}\n\n# middleware.py\nimport time, logging\nlogger = logging.getLogger(__name__)\nclass SlowRequestMiddleware:\n    def __init__(self, get_response):\n        self.get_response = get_response\n    def __call__(self, request):\n        start = time.time()\n        response = self.get_response(request)\n        duration = (time.time() - start) * 1000\n        if duration > 500:\n            logger.warning(f"Медленный запрос {request.method} {request.path} — {duration:.0f}ms")\n        return response\n\n# management/commands/check_low_stock.py\nfrom django.core.management.base import BaseCommand\nfrom shop.models import Product\nclass Command(BaseCommand):\n    help = "Проверить товары с низким остатком"\n    def handle(self, *args, **options):\n        low_stock = Product.objects.filter(stock__lt=5, is_active=True)\n        if low_stock.exists():\n            names = ", ".join(p.name for p in low_stock)\n            self.stdout.write(self.style.WARNING(f"{low_stock.count()} товаров с низким остатком: {names}"))',
      explanation: 'Custom management command — стандартный способ создать CLI инструмент для Django. Используется в cron задачах и CI/CD. Middleware для медленных запросов помогает найти узкие места без подключения APM инструментов.'
    }
  ]
}
