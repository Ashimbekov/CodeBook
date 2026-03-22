export default {
  id: 9,
  title: 'Шаблоны Django',
  description: 'Django Template Language: extends, block, include, теги for/if, фильтры, контекстные процессоры и организация шаблонов',
  lessons: [
    {
      id: 1,
      title: 'Базовый шаблон и наследование: extends/block',
      type: 'theory',
      content: [
        { type: 'text', value: 'extends и block — основа организации шаблонов. Базовый шаблон (base.html) содержит общую структуру страницы. Дочерние шаблоны переопределяют блоки.' },
        { type: 'code', language: 'python', value: '# templates/base.html\nbase_template = """\n<!DOCTYPE html>\n<html lang="ru">\n<head>\n    <meta charset="UTF-8">\n    <title>{% block title %}Мой сайт{% endblock %}</title>\n    {% block extra_css %}{% endblock %}\n</head>\n<body>\n    <nav>\n        <a href="{% url \'home\' %}">Главная</a>\n        <a href="{% url \'blog:list\' %}">Блог</a>\n        {% if user.is_authenticated %}\n            <a href="{% url \'profile\' %}">{{ user.username }}</a>\n        {% else %}\n            <a href="{% url \'login\' %}">Войти</a>\n        {% endif %}\n    </nav>\n\n    <main>\n        {% block content %}{% endblock %}\n    </main>\n\n    <footer>© 2024 Мой сайт</footer>\n    {% block extra_js %}{% endblock %}\n</body>\n</html>\n"""\n\n# templates/blog/list.html\nchild_template = """\n{% extends "base.html" %}\n\n{% block title %}Все статьи{% endblock %}\n\n{% block content %}\n<h1>Статьи</h1>\n{% for article in articles %}\n    <article>{{ article.title }}</article>\n{% endfor %}\n{% endblock %}\n"""' },
        { type: 'tip', value: 'Всегда создавай базовый шаблон base.html или layout.html. Все страницы наследуют его. Это гарантирует единый дизайн и избегает дублирования HTML.' }
      ]
    },
    {
      id: 2,
      title: 'include: подключение частичных шаблонов',
      type: 'theory',
      content: [
        { type: 'text', value: 'include подключает другой шаблон в текущий. Используется для повторяющихся компонентов: карточка товара, форма комментария, пагинация.' },
        { type: 'code', language: 'python', value: '# templates/blog/list.html\nlist_template = """\n{% extends "base.html" %}\n\n{% block content %}\n{% for article in articles %}\n    {% include "blog/_article_card.html" with article=article %}\n{% endfor %}\n\n{% include "pagination.html" with page=page_obj %}\n{% endblock %}\n"""\n\n# templates/blog/_article_card.html\ncard_template = """\n<article class="card">\n    <h2><a href="{{ article.get_absolute_url }}">{{ article.title }}</a></h2>\n    <p class="meta">{{ article.author.username }} | {{ article.created_at|date:"d.m.Y" }}</p>\n    <p>{{ article.content|truncatewords:30 }}</p>\n    <a href="{{ article.get_absolute_url }}">Читать далее</a>\n</article>\n"""\n\n# with передаёт переменные в подключаемый шаблон\n# without передаёт ВСЕ переменные контекста в include\n# {% include "template.html" with only %} -- только явно переданные переменные\nprint("Подчёркивание (_) в начале — соглашение для частичных шаблонов")' }
      ]
    },
    {
      id: 3,
      title: 'Теги: for, if, with, url, static',
      type: 'theory',
      content: [
        { type: 'text', value: 'Django Template Language содержит набор встроенных тегов для управления логикой шаблона.' },
        { type: 'code', language: 'python', value: '# Теги шаблонов в Django:\n\n# {% for %}\nfor_example = """\n{% for item in items %}\n    <li>{{ forloop.counter }}. {{ item.name }}</li>\n{% empty %}\n    <li>Список пуст</li>\n{% endfor %}\n\n{% comment %}\nПеременные forloop:\n- forloop.counter (1, 2, 3...)\n- forloop.counter0 (0, 1, 2...)\n- forloop.first (True для первого)\n- forloop.last (True для последнего)\n- forloop.revcounter (обратный счётчик)\n{% endcomment %}\n"""\n\n# {% if %}\nif_example = """\n{% if user.is_authenticated %}\n    Привет, {{ user.username }}!\n{% elif user.is_anonymous %}\n    Войдите в систему\n{% else %}\n    Неизвестный статус\n{% endif %}\n\n{% if items|length > 5 %}\n    Много товаров!\n{% endif %}\n\n{% if not articles %}\n    Статей нет\n{% endif %}\n"""\n\n# {% with %} — сокращение длинных выражений\nwith_example = """\n{% with total=cart.items.count discount=user.profile.discount_percent %}\n    В корзине {{ total }} товаров. Скидка: {{ discount }}%\n{% endwith %}\n"""' }
      ]
    },
    {
      id: 4,
      title: 'Фильтры шаблонов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Фильтры преобразуют значения переменных. Синтаксис: {{ value|filter }} или {{ value|filter:argument }}. Можно цеплять: {{ value|filter1|filter2 }}.' },
        { type: 'code', language: 'python', value: '# Часто используемые фильтры:\nfilters_example = """\n{# Строки #}\n{{ text|upper }}             {# ПРОПИСНЫЕ #}\n{{ text|lower }}             {# строчные #}\n{{ text|title }}             {# Каждое Слово С Большой #}\n{{ text|truncatechars:50 }}  {# Обрезать до 50 символов... #}\n{{ text|truncatewords:10 }}  {# Обрезать до 10 слов... #}\n{{ text|length }}            {# Длина строки #}\n{{ html|striptags }}         {# Убрать HTML теги #}\n{{ text|linebreaksbr }}      {# Переносы строк -> <br> #}\n\n{# Числа #}\n{{ price|floatformat:2 }}    {# 50000.00 #}\n{{ count|pluralize:"товар,товара,товаров" }}\n\n{# Дата #}\n{{ date|date:"d.m.Y" }}      {# 15.01.2024 #}\n{{ date|date:"D, d N Y" }}   {# Пн, 15 Января 2024 #}\n{{ date|timesince }}         {# 3 дня назад #}\n{{ date|timeuntil }}         {# через 5 часов #}\n\n{# Списки #}\n{{ list|join:", " }}         {# Раздели через запятую #}\n{{ list|first }}             {# Первый элемент #}\n{{ list|last }}              {# Последний элемент #}\n{{ list|length }}            {# Длина списка #}\n{{ list|slice:":3" }}        {# Первые 3 элемента #}\n\n{# Безопасный HTML (если доверяем контенту) #}\n{{ html_content|safe }}      {# Не экранировать HTML #}\n"""' }
      ]
    },
    {
      id: 5,
      title: 'Статические файлы в шаблонах',
      type: 'theory',
      content: [
        { type: 'text', value: 'Тег {% static %} генерирует URL до статических файлов (CSS, JS, изображения). Требует {% load static %} в начале шаблона.' },
        { type: 'code', language: 'python', value: '# settings.py:\n# STATIC_URL = "/static/"\n# STATICFILES_DIRS = [BASE_DIR / "static"]\n\n# Структура файлов:\n# static/\n# |-- css/\n# |   |-- style.css\n# |-- js/\n# |   |-- main.js\n# |-- images/\n#     |-- logo.png\n\nstatic_template = """\n{% load static %}\n\n<!DOCTYPE html>\n<html>\n<head>\n    <link rel="stylesheet" href="{% static \'css/style.css\' %}">\n    <link rel="icon" href="{% static \'images/favicon.ico\' %}">\n</head>\n<body>\n    <img src="{% static \'images/logo.png\' %}" alt="Логотип">\n\n    {% if product.image %}\n        <img src="{{ product.image.url }}" alt="{{ product.name }}">\n    {% else %}\n        <img src="{% static \'images/no-image.png\' %}" alt="Нет изображения">\n    {% endif %}\n\n    <script src="{% static \'js/main.js\' %}"></script>\n</body>\n</html>\n"""' }
      ]
    },
    {
      id: 6,
      title: 'Кастомные теги и фильтры',
      type: 'theory',
      content: [
        { type: 'text', value: 'Можно создавать собственные теги и фильтры для шаблонов. Они регистрируются в templatetags и загружаются через {% load %}.' },
        { type: 'code', language: 'python', value: '# myapp/templatetags/myapp_tags.py\nfrom django import template\nfrom django.utils.html import format_html\nfrom .models import Category\n\nregister = template.Library()\n\n# Простой фильтр\n@register.filter(name="rubles")\ndef format_rubles(value):\n    """{{ product.price|rubles }} -> 50 000 руб."""\n    try:\n        return f"{int(value):,} руб.".replace(",", " ")\n    except (TypeError, ValueError):\n        return value\n\n# Фильтр с аргументом\n@register.filter\ndef multiply(value, arg):\n    """{{ price|multiply:quantity }}"""\n    return value * arg\n\n# Inclusion tag — рендерит шаблон\n@register.inclusion_tag("includes/categories_menu.html")\ndef categories_menu():\n    categories = Category.objects.filter(is_active=True)\n    return {"categories": categories}\n\n# Использование в шаблоне:\n# {% load myapp_tags %}\n# {{ product.price|rubles }}\n# {% categories_menu %}' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Шаблонная система',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай полноценную шаблонную систему для блога с наследованием и компонентами.',
      requirements: [
        'base.html с блоками: title, extra_css, content, extra_js',
        'Навигация в base.html использует {% url %} и показывает имя пользователя если авторизован',
        'blog/list.html наследует base.html, цикл по статьям через {% include %} с карточкой',
        'blog/_article_card.html — частичный шаблон карточки с тегами фильтрами (date, truncatewords)',
        'blog/detail.html показывает полную статью с комментариями',
        'Кастомный фильтр reading_time вычисляет время чтения (слова / 200)'
      ],
      expectedOutput: '{% load blog_tags %}\n{{ article.content|reading_time }} мин чтения\nШаблоны корректно наследуют base.html',
      hint: 'reading_time: считай len(content.split()) / 200, округляй через max(1, round()). Файл тегов: blog/templatetags/blog_tags.py. Не забудь пустой __init__.py в templatetags/.',
      solution: '# blog/templatetags/__init__.py (пустой)\n# blog/templatetags/blog_tags.py\nfrom django import template\n\nregister = template.Library()\n\n@register.filter\ndef reading_time(content):\n    """Время чтения в минутах (200 слов/мин)"""\n    word_count = len(content.split())\n    minutes = max(1, round(word_count / 200))\n    return minutes\n\n# templates/base.html\nbase_html = """\n<!DOCTYPE html>\n<html lang="ru">\n<head>\n    {% load static %}\n    <title>{% block title %}Блог{% endblock %}</title>\n    {% block extra_css %}{% endblock %}\n</head>\n<body>\n    <nav>\n        <a href="{% url \'home\' %}">Главная</a>\n        <a href="{% url \'blog:list\' %}">Блог</a>\n        {% if user.is_authenticated %}\n            <span>{{ user.username }}</span>\n        {% else %}\n            <a href="{% url \'login\' %}">Войти</a>\n        {% endif %}\n    </nav>\n    <main>{% block content %}{% endblock %}</main>\n    {% block extra_js %}{% endblock %}\n</body>\n</html>\n"""\n\n# templates/blog/list.html\nlist_html = """\n{% extends "base.html" %}\n{% block title %}Статьи{% endblock %}\n{% block content %}\n<h1>Статьи</h1>\n{% for article in articles %}\n    {% include "blog/_article_card.html" with article=article %}\n{% empty %}\n    <p>Статей пока нет.</p>\n{% endfor %}\n{% endblock %}\n"""\n\n# templates/blog/_article_card.html\ncard_html = """\n{% load blog_tags %}\n<article>\n    <h2><a href="{{ article.get_absolute_url }}">{{ article.title }}</a></h2>\n    <p>{{ article.author.username }} | {{ article.created_at|date:"d.m.Y" }}</p>\n    <p>Чтение: {{ article.content|reading_time }} мин</p>\n    <p>{{ article.content|truncatewords:20 }}</p>\n    {% for tag in article.tags.all %}\n        <span>#{{ tag.name }}</span>\n    {% endfor %}\n</article>\n"""',
      explanation: 'templatetags директория с __init__.py необходима для регистрации тегов. @register.filter декорирует функцию-фильтр. extends + block обеспечивают наследование. include with article=article передаёт переменную в частичный шаблон. Фильтры можно цеплять: {{ content|reading_time }} где reading_time получает content как строку.'
    }
  ]
}
