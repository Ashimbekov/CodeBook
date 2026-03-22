export default {
  id: 12,
  title: 'Аутентификация',
  description: 'Встроенная аутентификация Django: login, logout, регистрация, смена пароля, декораторы @login_required и кастомная модель пользователя',
  lessons: [
    {
      id: 1,
      title: 'Встроенные view аутентификации',
      type: 'theory',
      content: [
        { type: 'text', value: 'Django предоставляет готовые view для входа, выхода и смены пароля в модуле django.contrib.auth. Подключаются через include в urls.py.' },
        { type: 'code', language: 'python', value: '# urls.py\nfrom django.contrib import admin\nfrom django.urls import path, include\n\nurlpatterns = [\n    path("admin/", admin.site.urls),\n    # Встроенные view аутентификации:\n    path("accounts/", include("django.contrib.auth.urls")),\n    # Создают маршруты:\n    # accounts/login/           -- LoginView\n    # accounts/logout/          -- LogoutView\n    # accounts/password_change/ -- PasswordChangeView\n    # accounts/password_reset/  -- PasswordResetView\n    # и другие\n]\n\n# settings.py\nLOGIN_URL = "/accounts/login/"      # URL страницы входа\nLOGIN_REDIRECT_URL = "/"            # куда после входа\nLOGOUT_REDIRECT_URL = "/accounts/login/"  # куда после выхода\n\n# Шаблоны Django ищет в:\n# registration/login.html\n# registration/logout.html\n# registration/password_change_form.html\n# и т.д.' }
      ]
    },
    {
      id: 2,
      title: 'Login и Logout: ручная реализация',
      type: 'theory',
      content: [
        { type: 'text', value: 'Для кастомного поведения при входе и выходе используй функции authenticate() и login()/logout() напрямую.' },
        { type: 'code', language: 'python', value: 'from django.contrib.auth import authenticate, login, logout\nfrom django.contrib.auth.decorators import login_required\nfrom django.shortcuts import render, redirect\nfrom django.contrib import messages\nfrom .forms import LoginForm\n\ndef login_view(request):\n    if request.user.is_authenticated:\n        return redirect("home")  # уже вошёл\n\n    if request.method == "POST":\n        form = LoginForm(request.POST)\n        if form.is_valid():\n            username = form.cleaned_data["username"]\n            password = form.cleaned_data["password"]\n\n            user = authenticate(request, username=username, password=password)\n            if user:\n                login(request, user)  # создаёт сессию\n                messages.success(request, f"Добро пожаловать, {user.username}!")\n                # Редирект на ?next= или на главную\n                next_url = request.GET.get("next", "/")\n                return redirect(next_url)\n            else:\n                messages.error(request, "Неверное имя или пароль")\n    else:\n        form = LoginForm()\n    return render(request, "accounts/login.html", {"form": form})\n\n@login_required\ndef logout_view(request):\n    if request.method == "POST":  # только POST запрос\n        logout(request)\n        messages.info(request, "Вы вышли из системы")\n        return redirect("login")\n    return render(request, "accounts/logout_confirm.html")' }
      ]
    },
    {
      id: 3,
      title: 'Регистрация пользователей',
      type: 'theory',
      content: [
        { type: 'text', value: 'Django предоставляет UserCreationForm — стандартную форму регистрации. Можно расширить её или создать свою.' },
        { type: 'code', language: 'python', value: 'from django.contrib.auth.forms import UserCreationForm\nfrom django.contrib.auth.models import User\nfrom django import forms\n\n# Расширение стандартной формы\nclass CustomRegistrationForm(UserCreationForm):\n    email = forms.EmailField(required=True, label="Email")\n    first_name = forms.CharField(max_length=50, label="Имя")\n\n    class Meta:\n        model = User\n        fields = ["username", "first_name", "email", "password1", "password2"]\n\n    def save(self, commit=True):\n        user = super().save(commit=False)\n        user.email = self.cleaned_data["email"]\n        user.first_name = self.cleaned_data["first_name"]\n        if commit:\n            user.save()\n        return user\n\n# View:\ndef register(request):\n    if request.method == "POST":\n        form = CustomRegistrationForm(request.POST)\n        if form.is_valid():\n            user = form.save()\n            login(request, user)  # автоматический вход после регистрации\n            messages.success(request, "Добро пожаловать!")\n            return redirect("home")\n    else:\n        form = CustomRegistrationForm()\n    return render(request, "accounts/register.html", {"form": form})' }
      ]
    },
    {
      id: 4,
      title: '@login_required и проверка прав',
      type: 'theory',
      content: [
        { type: 'text', value: '@login_required защищает view от неавторизованных пользователей. @permission_required проверяет конкретное разрешение.' },
        { type: 'code', language: 'python', value: 'from django.contrib.auth.decorators import login_required, permission_required\nfrom django.contrib.auth.mixins import LoginRequiredMixin\nfrom django.core.exceptions import PermissionDenied\n\n# Декоратор для функции\n@login_required(login_url="/login/")\ndef my_profile(request):\n    return render(request, "profile.html", {"user": request.user})\n\n@login_required\n@permission_required("blog.add_article", raise_exception=True)\ndef create_article(request):\n    pass\n\n# Проверка прав вручную\n@login_required\ndef delete_article(request, pk):\n    article = get_object_or_404(Article, pk=pk)\n    if article.author != request.user and not request.user.is_staff:\n        raise PermissionDenied  # 403 Forbidden\n    article.delete()\n    return redirect("blog:list")\n\n# В шаблоне:\n# {% if user.is_authenticated %}\n# {% if user.is_staff %}\n# {% if user.has_perm("blog.add_article") %}\n\n# Создание разрешений в Meta:\n# class Meta:\n#     permissions = [\n#         ("can_publish", "Может публиковать статьи"),\n#         ("can_moderate", "Может модерировать комментарии"),\n#     ]' }
      ]
    },
    {
      id: 5,
      title: 'Кастомная модель пользователя',
      type: 'theory',
      content: [
        { type: 'text', value: 'В новых проектах рекомендуется создавать кастомную модель пользователя с самого начала. Это позволяет добавлять поля без сложных расширений.' },
        { type: 'code', language: 'python', value: '# accounts/models.py\nfrom django.contrib.auth.models import AbstractUser\nfrom django.db import models\n\nclass CustomUser(AbstractUser):\n    """Расширенная модель пользователя"""\n    email = models.EmailField(unique=True)  # email уникален\n    avatar = models.ImageField(upload_to="avatars/", null=True, blank=True)\n    bio = models.TextField(blank=True)\n    phone = models.CharField(max_length=20, blank=True)\n    birth_date = models.DateField(null=True, blank=True)\n\n    USERNAME_FIELD = "email"  # логин по email\n    REQUIRED_FIELDS = ["username"]  # обязательно при createsuperuser\n\n    def __str__(self):\n        return self.email\n\n# settings.py — ОБЯЗАТЕЛЬНО добавить ДО первой миграции!\n# AUTH_USER_MODEL = "accounts.CustomUser"\n\n# Если нужно использовать в других моделях:\n# from django.conf import settings\n# author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)\n# НЕ импортируй User напрямую — используй get_user_model()!\n\nfrom django.contrib.auth import get_user_model\nUser = get_user_model()' },
        { type: 'warning', value: 'AUTH_USER_MODEL НУЖНО задать ДО первой миграции! После применения 0001_initial изменить крайне сложно. В существующем проекте с данными это требует ручной миграции.' }
      ]
    },
    {
      id: 6,
      title: 'Сессии и сохранение данных',
      type: 'theory',
      content: [
        { type: 'text', value: 'Django сессии позволяют хранить данные пользователя между запросами. Используются для корзины, предпочтений, временных данных.' },
        { type: 'code', language: 'python', value: 'def add_to_cart(request, product_id):\n    """Корзина в сессии"""\n    cart = request.session.get("cart", {})\n\n    # Добавляем товар\n    product_key = str(product_id)\n    cart[product_key] = cart.get(product_key, 0) + 1\n\n    request.session["cart"] = cart  # сохраняем\n    request.session.modified = True  # помечаем как изменённую\n\n    return JsonResponse({"cart_count": sum(cart.values())})\n\ndef clear_cart(request):\n    request.session.pop("cart", None)  # удаляем ключ\n    return redirect("cart")\n\ndef get_cart_items(request):\n    cart = request.session.get("cart", {})\n    if not cart:\n        return []\n    products = Product.objects.filter(id__in=cart.keys())\n    return [\n        {"product": p, "quantity": cart[str(p.id)]}\n        for p in products\n    ]\n\n# Настройка сессий в settings.py:\n# SESSION_ENGINE = "django.contrib.sessions.backends.db"  # в БД (по умолчанию)\n# SESSION_COOKIE_AGE = 1209600  # 2 недели в секундах\n# SESSION_COOKIE_SECURE = True  # только HTTPS' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Система аутентификации',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай полную систему аутентификации: регистрация, вход, выход, профиль.',
      requirements: [
        'LoginForm с полями username и password',
        'View login_view: проверяет данные, создаёт сессию, редирект на ?next= или "/"',
        'View register_view: создаёт пользователя, автоматически входит, редирект',
        'View profile_view: @login_required, показывает данные текущего пользователя',
        'View logout_view: только POST метод, удаляет сессию',
        'Шаблон base.html: "Войти" или имя пользователя + "Выйти" в nav'
      ],
      expectedOutput: 'GET /login/ -> форма входа\nPOST /login/ с неверными данными -> форма с ошибкой\nPOST /login/ -> redirect("/")\nGET /profile/ без авторизации -> redirect("/login/?next=/profile/")',
      hint: 'authenticate() возвращает None если данные неверны. login() создаёт сессию. redirect(request.GET.get("next", "/")) перенаправляет на оригинальный URL.',
      solution: '# forms.py\nfrom django import forms\n\nclass LoginForm(forms.Form):\n    username = forms.CharField(label="Имя пользователя")\n    password = forms.CharField(widget=forms.PasswordInput, label="Пароль")\n\n# views.py\nfrom django.contrib.auth import authenticate, login, logout\nfrom django.contrib.auth.decorators import login_required\nfrom django.contrib.auth.forms import UserCreationForm\nfrom django.shortcuts import render, redirect\nfrom django.contrib import messages\nfrom django.views.decorators.http import require_POST\nfrom .forms import LoginForm\n\ndef login_view(request):\n    if request.user.is_authenticated:\n        return redirect("/")\n    if request.method == "POST":\n        form = LoginForm(request.POST)\n        if form.is_valid():\n            user = authenticate(\n                request,\n                username=form.cleaned_data["username"],\n                password=form.cleaned_data["password"]\n            )\n            if user:\n                login(request, user)\n                return redirect(request.GET.get("next", "/"))\n            messages.error(request, "Неверные данные")\n    else:\n        form = LoginForm()\n    return render(request, "accounts/login.html", {"form": form})\n\ndef register_view(request):\n    if request.method == "POST":\n        form = UserCreationForm(request.POST)\n        if form.is_valid():\n            user = form.save()\n            login(request, user)\n            messages.success(request, "Добро пожаловать!")\n            return redirect("/")\n    else:\n        form = UserCreationForm()\n    return render(request, "accounts/register.html", {"form": form})\n\n@login_required\ndef profile_view(request):\n    return render(request, "accounts/profile.html", {"user": request.user})\n\n@require_POST\ndef logout_view(request):\n    logout(request)\n    return redirect("/login/")',
      explanation: 'authenticate() проверяет данные — возвращает User или None. login() создаёт сессию — пользователь "запомнен". @login_required перенаправляет на LOGIN_URL с параметром ?next= текущего URL. @require_POST возвращает 405 Method Not Allowed для GET запросов — logout только через POST для защиты от CSRF. redirect(request.GET.get("next", "/")) возвращает пользователя на страницу с которой его перенаправили.'
    }
  ]
}
