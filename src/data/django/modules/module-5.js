export default {
  id: 5,
  title: 'Модели и ORM',
  description: 'Django ORM: типы полей CharField/IntegerField/DateTimeField, мета-опции, методы моделей, create/save/delete и основные операции с данными',
  lessons: [
    {
      id: 1,
      title: 'CharField и текстовые поля',
      type: 'theory',
      content: [
        { type: 'text', value: 'CharField — строковое поле с ограниченной длиной (обязателен max_length). TextField — для длинного текста без ограничения. EmailField, URLField, SlugField — специализированные строковые поля.' },
        { type: 'code', language: 'python', value: 'from django.db import models\n\nclass Product(models.Model):\n    # CharField требует max_length\n    name = models.CharField(max_length=200, verbose_name="Название")\n    slug = models.SlugField(max_length=200, unique=True)  # URL-friendly\n    sku = models.CharField(max_length=50, unique=True)  # артикул\n\n    # Для длинного текста — TextField\n    description = models.TextField(blank=True)  # необязательное\n    short_desc = models.CharField(max_length=500, blank=True)\n\n    # Специализированные\n    email = models.EmailField()  # валидация email\n    website = models.URLField(blank=True)  # валидация URL\n\n    # Варианты выбора\n    STATUS_CHOICES = [\n        ("draft", "Черновик"),\n        ("active", "Активный"),\n        ("archived", "Архив"),\n    ]\n    status = models.CharField(\n        max_length=20,\n        choices=STATUS_CHOICES,\n        default="draft"\n    )\n\n    def __str__(self):\n        return self.name' },
        { type: 'tip', value: 'blank=True позволяет полю быть пустым в форме (валидация). null=True позволяет NULL в базе данных. Для строковых полей обычно используй только blank=True — пустая строка лучше NULL в тексте.' }
      ]
    },
    {
      id: 2,
      title: 'Числовые поля: IntegerField, DecimalField, FloatField',
      type: 'theory',
      content: [
        { type: 'text', value: 'Django предоставляет несколько числовых типов. IntegerField — целые числа. DecimalField — точные дробные числа (деньги). FloatField — числа с плавающей запятой.' },
        { type: 'code', language: 'python', value: 'from django.db import models\nfrom django.core.validators import MinValueValidator, MaxValueValidator\n\nclass Product(models.Model):\n    # Целые числа\n    stock = models.IntegerField(default=0)          # -2^31 до 2^31\n    views_count = models.PositiveIntegerField(default=0)  # только >= 0\n    order_count = models.PositiveBigIntegerField(default=0)\n    sort_order = models.SmallIntegerField(default=0)  # -32768 до 32767\n\n    # Дробные числа — ТОЧНЫЕ (для денег всегда DecimalField!)\n    price = models.DecimalField(\n        max_digits=10,     # всего цифр\n        decimal_places=2,  # знаков после запятой\n        validators=[MinValueValidator(0)]\n    )\n    discount_percent = models.DecimalField(\n        max_digits=5,\n        decimal_places=2,\n        default=0,\n        validators=[MinValueValidator(0), MaxValueValidator(100)]\n    )\n\n    # FloatField — для оценок, рейтингов (неточный)\n    rating = models.FloatField(\n        default=0.0,\n        validators=[MinValueValidator(0), MaxValueValidator(5)]\n    )\n\n    # BooleanField\n    is_active = models.BooleanField(default=True)\n    is_featured = models.BooleanField(default=False)' },
        { type: 'warning', value: 'Для денег ВСЕГДА используй DecimalField, никогда FloatField! FloatField хранит приблизительные значения из-за IEEE 754. 0.1 + 0.2 в FloatField может дать 0.30000000000000004.' }
      ]
    },
    {
      id: 3,
      title: 'DateTimeField и временные поля',
      type: 'theory',
      content: [
        { type: 'text', value: 'DateTimeField хранит дату и время. auto_now_add автоматически ставит дату создания, auto_now — дату последнего изменения.' },
        { type: 'code', language: 'python', value: 'from django.db import models\nfrom django.utils import timezone\n\nclass Article(models.Model):\n    title = models.CharField(max_length=200)\n\n    # auto_now_add: устанавливается ОДИН РАЗ при создании\n    created_at = models.DateTimeField(auto_now_add=True)\n\n    # auto_now: обновляется при каждом save()\n    updated_at = models.DateTimeField(auto_now=True)\n\n    # Только дата (без времени)\n    publish_date = models.DateField(null=True, blank=True)\n\n    # Только время\n    publish_time = models.TimeField(null=True, blank=True)\n\n    # Произвольное время (можно редактировать)\n    scheduled_at = models.DateTimeField(null=True, blank=True)\n\n    # Проверка что публикация в будущем\n    def is_scheduled(self):\n        if self.scheduled_at:\n            return self.scheduled_at > timezone.now()\n        return False\n\n    # Форматирование даты\n    def get_date_display(self):\n        return self.created_at.strftime("%d.%m.%Y %H:%M")' },
        { type: 'tip', value: 'Используй timezone.now() вместо datetime.now() — первый учитывает часовой пояс Django (USE_TZ=True). При USE_TZ=True все времена хранятся в UTC в базе данных.' }
      ]
    },
    {
      id: 4,
      title: 'FileField и ImageField',
      type: 'theory',
      content: [
        { type: 'text', value: 'FileField и ImageField хранят загружаемые файлы. Путь к файлу хранится в БД, сам файл — на диске (или в облаке). ImageField требует Pillow.' },
        { type: 'code', language: 'python', value: '# pip install Pillow (для ImageField)\nfrom django.db import models\n\nclass Product(models.Model):\n    name = models.CharField(max_length=200)\n\n    # ImageField — только изображения (Pillow проверяет)\n    image = models.ImageField(\n        upload_to="products/images/",  # папка внутри MEDIA_ROOT\n        null=True,\n        blank=True\n    )\n\n    # FileField — любые файлы\n    manual = models.FileField(\n        upload_to="products/manuals/",\n        null=True,\n        blank=True\n    )\n\n    # upload_to может быть функцией:\n    def product_image_path(instance, filename):\n        return f"products/{instance.id}/{filename}"\n\n    image_custom = models.ImageField(upload_to=product_image_path)\n\n# settings.py:\n# MEDIA_URL = "/media/"\n# MEDIA_ROOT = BASE_DIR / "media"\n\n# В шаблоне:\n# <img src="{{ product.image.url }}"> <-- полный URL\n# {{ product.image.name }}           <-- путь к файлу\n# {{ product.image.size }}           <-- размер в байтах' }
      ]
    },
    {
      id: 5,
      title: 'Meta класс и методы модели',
      type: 'theory',
      content: [
        { type: 'text', value: 'Внутренний класс Meta задаёт метаданные модели: сортировку, имена в admin, индексы. Методы модели добавляют поведение к данным.' },
        { type: 'code', language: 'python', value: 'from django.db import models\nfrom django.urls import reverse\n\nclass Article(models.Model):\n    title = models.CharField(max_length=200)\n    slug = models.SlugField(unique=True)\n    content = models.TextField()\n    views = models.PositiveIntegerField(default=0)\n    is_published = models.BooleanField(default=False)\n    created_at = models.DateTimeField(auto_now_add=True)\n\n    class Meta:\n        ordering = ["-created_at"]  # новые сначала\n        verbose_name = "Статья"\n        verbose_name_plural = "Статьи"\n        db_table = "blog_articles"  # имя таблицы в БД\n        indexes = [\n            models.Index(fields=["slug"]),\n            models.Index(fields=["is_published", "-created_at"])\n        ]\n\n    def __str__(self):\n        return self.title\n\n    def get_absolute_url(self):\n        return reverse("blog:detail", kwargs={"slug": self.slug})\n\n    def increment_views(self):\n        self.views += 1\n        self.save(update_fields=["views"])  # обновляем только это поле\n\n    @property\n    def short_content(self):\n        return self.content[:200] + "..." if len(self.content) > 200 else self.content' },
        { type: 'tip', value: 'save(update_fields=["views"]) обновляет только указанные поля — намного эффективнее чем save() который обновляет всю запись. Используй для счётчиков и частых обновлений.' }
      ]
    },
    {
      id: 6,
      title: 'Создание, обновление и удаление объектов',
      type: 'theory',
      content: [
        { type: 'text', value: 'ORM предоставляет несколько способов создавать и изменять данные. create() создаёт и сохраняет за один вызов. bulk_create() эффективен для массовых вставок.' },
        { type: 'code', language: 'python', value: 'from .models import Product\n\n# Создание\nproduct = Product(name="Ноутбук", price=50000)\nproduct.save()  # INSERT\n\n# Создание за один шаг\nproduct = Product.objects.create(name="Мышь", price=1500)\n\n# Получить или создать (get_or_create)\nproduct, created = Product.objects.get_or_create(\n    sku="LAPTOP-001",\n    defaults={"name": "Ноутбук", "price": 50000}\n)\nprint(f"Создан: {created}")  # True если новый\n\n# Обновление\nproduct.price = 45000\nproduct.save()  # UPDATE все поля\nproduct.save(update_fields=["price"])  # UPDATE только price\n\n# Массовое обновление (один SQL)\nProduct.objects.filter(price__gt=100000).update(is_featured=True)\n\n# Удаление\nproduct.delete()  # DELETE одного объекта\nProduct.objects.filter(is_active=False).delete()  # DELETE нескольких\n\n# Массовое создание\nproducts = [Product(name=f"Товар {i}", price=i*100) for i in range(10)]\nProduct.objects.bulk_create(products)  # один INSERT' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Модель товара',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай полноценную модель Product для интернет-магазина со всеми необходимыми полями и методами.',
      requirements: [
        'CharField: name (200), slug (unique), sku (unique)',
        'TextField: description (blank=True)',
        'DecimalField: price (max_digits=10, decimal_places=2), cost_price (себестоимость)',
        'IntegerField: stock (>=0), min_stock (уровень для заказа)',
        'BooleanField: is_active, is_featured',
        'Метод get_profit() возвращает разницу price - cost_price',
        'Метод is_low_stock() возвращает True если stock <= min_stock',
        'Свойство discount_price возвращает price * 0.9 (10% скидка)'
      ],
      expectedOutput: 'product = Product(name="Ноутбук", price=50000, cost_price=35000, stock=5, min_stock=3)\nproduct.get_profit() == 15000\nproduct.is_low_stock() == True  # 5 <= 3... нет, 5 > 3, False\nproduct.discount_price == 45000.0',
      hint: 'decimal_places=2 для цен. MinValueValidator(0) для stock. @property для discount_price. В is_low_stock сравнивай self.stock <= self.min_stock.',
      solution: 'from django.db import models\nfrom django.core.validators import MinValueValidator\nfrom django.urls import reverse\n\nclass Product(models.Model):\n    name = models.CharField(max_length=200, verbose_name="Название")\n    slug = models.SlugField(max_length=200, unique=True)\n    sku = models.CharField(max_length=50, unique=True, verbose_name="Артикул")\n    description = models.TextField(blank=True, verbose_name="Описание")\n    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Цена")\n    cost_price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Себестоимость")\n    stock = models.IntegerField(default=0, validators=[MinValueValidator(0)])\n    min_stock = models.IntegerField(default=5, verbose_name="Минимальный остаток")\n    is_active = models.BooleanField(default=True)\n    is_featured = models.BooleanField(default=False)\n    created_at = models.DateTimeField(auto_now_add=True)\n\n    class Meta:\n        ordering = ["name"]\n        verbose_name = "Товар"\n        verbose_name_plural = "Товары"\n\n    def __str__(self):\n        return f"{self.name} ({self.sku})"\n\n    def get_profit(self):\n        return self.price - self.cost_price\n\n    def is_low_stock(self):\n        return self.stock <= self.min_stock\n\n    @property\n    def discount_price(self):\n        return float(self.price) * 0.9\n\n    def get_absolute_url(self):\n        return reverse("shop:product-detail", kwargs={"slug": self.slug})',
      explanation: 'MinValueValidator(0) добавляет валидацию на уровне формы и модели. auto_now_add=True для created_at устанавливается один раз при создании. get_profit() и is_low_stock() — бизнес-методы прямо в модели. @property discount_price доступен как атрибут (product.discount_price), а не метод. float() нужен чтобы умножить Decimal на float 0.9.'
    },
    {
      id: 8,
      title: 'Практика: Работа с объектами в Shell',
      type: 'practice',
      difficulty: 'easy',
      description: 'Отработай создание, обновление и удаление объектов через Django ORM.',
      requirements: [
        'Создай 5 продуктов через bulk_create()',
        'Обнови цену одного продукта через save(update_fields=["price"])',
        'Найди продукт через get_or_create() — создай новый если нет',
        'Подними цену всех продуктов дороже 10000 на 10% через update() с F()',
        'Удали все продукты с is_active=False',
        'Выведи итоговый список продуктов'
      ],
      expectedOutput: 'Created: 5 products\nUpdated laptop price: 45000 -> 49500\nget_or_create: created=True (новый продукт)\nBulk price increase: 3 products updated\nDeleted inactive: 2 products',
      hint: 'from django.db.models import F для F() выражений. Product.objects.filter(price__gt=10000).update(price=F("price") * 1.1). bulk_create принимает список объектов.',
      solution: 'from django.db.models import F\nfrom myapp.models import Product\n\n# 1. Массовое создание\nproducts_data = [\n    Product(name="Ноутбук", sku="LT001", price=45000, cost_price=30000, stock=10),\n    Product(name="Мышь", sku="MS001", price=1500, cost_price=800, stock=50),\n    Product(name="Клавиатура", sku="KB001", price=3500, cost_price=1500, stock=30),\n    Product(name="Монитор", sku="MN001", price=25000, cost_price=15000, stock=8),\n    Product(name="Наушники", sku="HP001", price=8000, cost_price=4000, stock=20, is_active=False),\n]\nProduct.objects.bulk_create(products_data)\nprint(f"Created: {len(products_data)} products")\n\n# 2. Обновление одного поля\nlaptop = Product.objects.get(sku="LT001")\nold_price = laptop.price\nlaptop.price = 49500\nlaptop.save(update_fields=["price"])\nprint(f"Updated laptop price: {old_price} -> {laptop.price}")\n\n# 3. get_or_create\ntablet, created = Product.objects.get_or_create(\n    sku="TB001",\n    defaults={"name": "Планшет", "price": 20000, "cost_price": 12000, "stock": 5}\n)\nprint(f"get_or_create: created={created}")\n\n# 4. F() выражение — массовое обновление\nupdated = Product.objects.filter(price__gt=10000).update(price=F("price") * 1.1)\nprint(f"Bulk price increase: {updated} products updated")\n\n# 5. Удаление неактивных\ndeleted, _ = Product.objects.filter(is_active=False).delete()\nprint(f"Deleted inactive: {deleted} products")',
      explanation: 'bulk_create() один SQL INSERT вместо N отдельных запросов. save(update_fields) обновляет только указанные поля — эффективнее. get_or_create() атомарная операция: ищет по sku, создаёт с defaults если нет. F() позволяет обновлять значение относительно текущего без загрузки в Python. filter().delete() возвращает (количество, словарь_по_типам).'
    }
  ]
}
