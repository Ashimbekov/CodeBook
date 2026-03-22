export default {
  id: 14,
  title: 'Статика и медиа',
  description: 'STATIC_URL и MEDIA_URL в Django: обслуживание статических файлов, загрузка медиа, настройка для продакшна с WhiteNoise и облачным хранилищем',
  lessons: [
    {
      id: 1,
      title: 'Статические файлы: настройка',
      type: 'theory',
      content: [
        { type: 'text', value: 'Статические файлы — CSS, JavaScript, изображения сайта. Django обслуживает их в режиме разработки. В продакшне нужен отдельный веб-сервер или CDN.' },
        { type: 'code', language: 'python', value: '# settings.py\n\n# URL для статических файлов (в браузере)\nSTATIC_URL = "/static/"\n\n# Папки где Django ищет статику во время разработки\nSTATICFILES_DIRS = [\n    BASE_DIR / "static",  # глобальная static/ папка проекта\n]\n\n# Папка куда collectstatic собирает все файлы (для продакшна)\nSTATIC_ROOT = BASE_DIR / "staticfiles"\n\n# Структура файлов:\n# myproject/\n# |-- static/           <-- глобальные файлы (STATICFILES_DIRS)\n# |   |-- css/\n# |   |   |-- style.css\n# |   |-- js/\n# |       |-- main.js\n# |-- blog/\n#     |-- static/       <-- APP_DIRS статика приложения\n#         |-- blog/     <-- пространство имён\n#             |-- blog.css\n\n# В шаблоне:\n# {% load static %}\n# <link href="{% static \'css/style.css\' %}">' }
      ]
    },
    {
      id: 2,
      title: 'collectstatic: сборка для продакшна',
      type: 'theory',
      content: [
        { type: 'text', value: 'collectstatic собирает все статические файлы из всех приложений в одну директорию STATIC_ROOT. Эту директорию обслуживает веб-сервер (Nginx, Apache).' },
        { type: 'code', language: 'python', value: '# Сборка статики для продакшна:\n# python manage.py collectstatic\n#\n# Копирует все файлы в STATIC_ROOT:\n# 178 static files copied to \'/app/staticfiles\'.\n\n# settings.py для продакшна:\nDEBUG = False\nSTATIC_URL = "/static/"\nSTATIC_ROOT = BASE_DIR / "staticfiles"\n\n# Django НЕ обслуживает статику при DEBUG=False!\n# Нужен Nginx или WhiteNoise\n\n# Вариант 1: WhiteNoise (проще, встроен в Python)\n# pip install whitenoise\n\nMIDDLEWARE = [\n    "django.middleware.security.SecurityMiddleware",\n    "whitenoise.middleware.WhiteNoiseMiddleware",  # СРАЗУ после Security\n    # ... остальные middleware\n]\n\n# settings.py для WhiteNoise:\nSTATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"\n# Сжимает и добавляет хэши к именам файлов для кэширования\n\n# Вариант 2: Nginx\n# location /static/ {\n#     alias /app/staticfiles/;\n# }' },
        { type: 'tip', value: 'WhiteNoise — отличный вариант для большинства проектов. Он сжимает файлы, добавляет правильные заголовки кэширования и не требует настройки Nginx только для статики.' }
      ]
    },
    {
      id: 3,
      title: 'Медиа файлы: загрузка пользователями',
      type: 'theory',
      content: [
        { type: 'text', value: 'Медиа файлы — файлы загружаемые пользователями: аватары, фото товаров, документы. Хранятся в MEDIA_ROOT, доступны по MEDIA_URL.' },
        { type: 'code', language: 'python', value: '# settings.py\nMEDIA_URL = "/media/"\nMEDIA_ROOT = BASE_DIR / "media"\n\n# urls.py — обслуживание медиа В РЕЖИМЕ РАЗРАБОТКИ\nfrom django.conf import settings\nfrom django.conf.urls.static import static\nfrom django.contrib import admin\nfrom django.urls import path, include\n\nurlpatterns = [\n    path("admin/", admin.site.urls),\n    path("", include("myapp.urls")),\n]\n\n# Добавляем только в режиме разработки\nif settings.DEBUG:\n    urlpatterns += static(\n        settings.MEDIA_URL,\n        document_root=settings.MEDIA_ROOT\n    )\n\n# В модели:\nclass Product(models.Model):\n    image = models.ImageField(\n        upload_to="products/%Y/%m/",  # products/2024/01/\n        null=True,\n        blank=True\n    )\n\n# В шаблоне:\n# {% if product.image %}\n#     <img src="{{ product.image.url }}" alt="{{ product.name }}">\n# {% endif %}' },
        { type: 'warning', value: 'В продакшне НИКОГДА не обслуживай медиа через Django — это медленно и небезопасно. Используй Nginx для раздачи медиа файлов или облачное хранилище (S3, Google Cloud Storage).' }
      ]
    },
    {
      id: 4,
      title: 'Хранение медиа в облаке (S3)',
      type: 'theory',
      content: [
        { type: 'text', value: 'В продакшне медиа файлы лучше хранить в облаке (Amazon S3, Google Cloud Storage). Библиотека django-storages обеспечивает прозрачную интеграцию.' },
        { type: 'code', language: 'python', value: '# pip install django-storages boto3\n\n# settings.py для Amazon S3:\nINSTALLED_APPS = [\n    # ...\n    "storages",\n]\n\n# Настройки S3\nAWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID")\nAWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY")\nAWS_STORAGE_BUCKET_NAME = "my-bucket-name"\nAWS_S3_REGION_NAME = "eu-central-1"\nAWS_S3_FILE_OVERWRITE = False\nAWS_DEFAULT_ACL = "public-read"\nAWS_S3_CUSTOM_DOMAIN = f"{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com"\n\n# Медиа в S3, статика локально\nDEFAULT_FILE_STORAGE = "storages.backends.s3boto3.S3Boto3Storage"\nMEDIA_URL = f"https://{AWS_S3_CUSTOM_DOMAIN}/"\n\n# Или разные настройки для статики и медиа:\n# STORAGES = {\n#     "default": {"BACKEND": "storages.backends.s3boto3.S3Boto3Storage"},\n#     "staticfiles": {"BACKEND": "whitenoise.storage.CompressedStaticFilesStorage"}\n# }\n\n# Теперь model.image.url автоматически возвращает URL на S3\n# Загрузка файлов автоматически идёт в S3' },
        { type: 'note', value: 'Никогда не храни AWS_SECRET_ACCESS_KEY в коде или настройках! Используй переменные окружения (.env файл) или IAM роли если деплоишь на AWS EC2/ECS.' }
      ]
    },
    {
      id: 5,
      title: 'Оптимизация изображений',
      type: 'theory',
      content: [
        { type: 'text', value: 'Загружаемые пользователями изображения нужно оптимизировать: сжимать, изменять размер, создавать превью. Pillow + django-imagekit обеспечивают это.' },
        { type: 'code', language: 'python', value: '# pip install Pillow django-imagekit\n\nfrom django.db import models\nfrom imagekit.models import ImageSpecField\nfrom imagekit.processors import ResizeToFill, ResizeToFit\nfrom PIL import Image\nfrom io import BytesIO\nfrom django.core.files import File\n\nclass Product(models.Model):\n    name = models.CharField(max_length=200)\n    image = models.ImageField(upload_to="products/")\n\n    # Автоматические превью через imagekit\n    thumbnail = ImageSpecField(\n        source="image",\n        processors=[ResizeToFill(200, 200)],  # 200x200 кроп\n        format="JPEG",\n        options={"quality": 85}\n    )\n    medium_image = ImageSpecField(\n        source="image",\n        processors=[ResizeToFit(800, 600)],   # вписать в 800x600\n        format="JPEG",\n        options={"quality": 90}\n    )\n\n# В шаблоне:\n# <img src="{{ product.thumbnail.url }}" width="200">\n# <img src="{{ product.medium_image.url }}">\n\n# Ручная обработка через Pillow:\ndef save(self, *args, **kwargs):\n    if self.image:\n        img = Image.open(self.image)\n        if img.width > 1200 or img.height > 1200:\n            img.thumbnail((1200, 1200))\n            buffer = BytesIO()\n            img.save(buffer, format="JPEG", quality=85)\n            self.image.save(self.image.name, File(buffer), save=False)\n    super().save(*args, **kwargs)' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Медиа в магазине',
      type: 'practice',
      difficulty: 'medium',
      description: 'Настрой загрузку и отображение изображений товаров в интернет-магазине.',
      requirements: [
        'Настройки MEDIA_URL и MEDIA_ROOT в settings.py',
        'Подключение static() к urlpatterns при DEBUG=True',
        'Модель Product с ImageField upload_to с функцией (год/месяц/id)',
        'View для загрузки изображения: принимает файл, проверяет тип и размер',
        'Шаблон показывает изображение или placeholder если нет',
        'Admin с image_preview в list_display (миниатюра 60px)'
      ],
      expectedOutput: 'MEDIA_ROOT/products/2024/01/42/photo.jpg\nproduct.image.url -> "/media/products/2024/01/42/photo.jpg"\nAdmin показывает миниатюры изображений в списке',
      hint: 'upload_to может быть функцией: def product_image_path(instance, filename). В urls.py добавь static() только при if settings.DEBUG. В admin: format_html("<img src=\\"{}\\" height=\\"60\\">", obj.image.url).',
      solution: '# settings.py\nMEDIA_URL = "/media/"\nMEDIA_ROOT = BASE_DIR / "media"\n\n# urls.py\nfrom django.conf import settings\nfrom django.conf.urls.static import static\nfrom django.contrib import admin\nfrom django.urls import path, include\n\nurlpatterns = [\n    path("admin/", admin.site.urls),\n    path("shop/", include("shop.urls")),\n]\n\nif settings.DEBUG:\n    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)\n\n# shop/models.py\nfrom django.db import models\nfrom pathlib import Path\n\ndef product_image_path(instance, filename):\n    from datetime import datetime\n    now = datetime.now()\n    ext = Path(filename).suffix\n    return f"products/{now.year}/{now.month:02d}/{instance.pk or \'new\'}/{filename}"\n\nclass Product(models.Model):\n    name = models.CharField(max_length=200)\n    price = models.DecimalField(max_digits=10, decimal_places=2)\n    image = models.ImageField(\n        upload_to=product_image_path,\n        null=True,\n        blank=True\n    )\n\n# shop/admin.py\nfrom django.contrib import admin\nfrom django.utils.html import format_html\nfrom .models import Product\n\n@admin.register(Product)\nclass ProductAdmin(admin.ModelAdmin):\n    list_display = ["name", "price", "image_preview"]\n\n    def image_preview(self, obj):\n        if obj.image:\n            return format_html(\'<img src="{}" height="60" style="border-radius:4px">\', obj.image.url)\n        return format_html(\'<span style="color:gray">Нет фото</span>\')\n    image_preview.short_description = "Фото"\n\n# shop/views.py\nfrom django.shortcuts import render, redirect, get_object_or_404\nfrom django.contrib import messages\nfrom django.contrib.auth.decorators import login_required\nfrom .models import Product\nfrom django import forms\n\nclass ProductImageForm(forms.ModelForm):\n    class Meta:\n        model = Product\n        fields = ["image"]\n\n    def clean_image(self):\n        image = self.cleaned_data.get("image")\n        if image:\n            if image.size > 5 * 1024 * 1024:\n                raise forms.ValidationError("Не более 5MB")\n            if not image.content_type.startswith("image/"):\n                raise forms.ValidationError("Только изображения")\n        return image\n\n@login_required\ndef upload_image(request, pk):\n    product = get_object_or_404(Product, pk=pk)\n    if request.method == "POST":\n        form = ProductImageForm(request.POST, request.FILES, instance=product)\n        if form.is_valid():\n            form.save()\n            messages.success(request, "Изображение загружено")\n            return redirect("shop:product-detail", pk=pk)\n    else:\n        form = ProductImageForm(instance=product)\n    return render(request, "shop/upload_image.html", {"form": form, "product": product})',
      explanation: 'upload_to как функция получает instance (объект модели) и filename. При instance.pk = None (новый объект) используем "new". if settings.DEBUG для static() — в продакшне Nginx раздаёт медиа. format_html экранирует URL в admin preview. clean_image() проверяет размер через image.size (байты) и тип через content_type.'
    }
  ]
}
