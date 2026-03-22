export default {
  id: 10,
  title: 'Формы Django',
  description: 'Form и ModelForm: создание форм, валидация данных, обработка в view, отображение ошибок и работа с CSRF',
  lessons: [
    {
      id: 1,
      title: 'Django Forms: основы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Django forms обеспечивают: HTML-рендеринг формы, валидацию данных, конвертацию типов. Форма — это Python-класс с описанием полей.' },
        { type: 'code', language: 'python', value: 'from django import forms\n\nclass ContactForm(forms.Form):\n    name = forms.CharField(\n        max_length=100,\n        label="Ваше имя",\n        widget=forms.TextInput(attrs={"class": "form-control", "placeholder": "Имя"})\n    )\n    email = forms.EmailField(\n        label="Email",\n        widget=forms.EmailInput(attrs={"class": "form-control"})\n    )\n    subject = forms.CharField(max_length=200, label="Тема")\n    message = forms.CharField(\n        label="Сообщение",\n        widget=forms.Textarea(attrs={"rows": 5, "class": "form-control"})\n    )\n    # Необязательное поле\n    phone = forms.CharField(\n        max_length=20,\n        required=False,\n        label="Телефон (необязательно)"\n    )\n    # Выбор\n    PRIORITY_CHOICES = [("low", "Низкий"), ("medium", "Средний"), ("high", "Высокий")]\n    priority = forms.ChoiceField(choices=PRIORITY_CHOICES, label="Приоритет")\n\n    # Чекбокс\n    agree = forms.BooleanField(label="Согласен с условиями")' }
      ]
    },
    {
      id: 2,
      title: 'Обработка формы в View',
      type: 'theory',
      content: [
        { type: 'text', value: 'Стандартный паттерн обработки формы: GET показывает пустую форму, POST валидирует данные. При успехе — редирект, при ошибках — показываем форму с ошибками.' },
        { type: 'code', language: 'python', value: 'from django.shortcuts import render, redirect\nfrom django.contrib import messages\nfrom .forms import ContactForm\n\ndef contact_view(request):\n    if request.method == "POST":\n        form = ContactForm(request.POST)\n        if form.is_valid():\n            # form.cleaned_data содержит валидированные данные\n            name = form.cleaned_data["name"]\n            email = form.cleaned_data["email"]\n            message = form.cleaned_data["message"]\n\n            # Здесь обрабатываем форму: отправляем email, сохраняем в БД\n            send_contact_email(name, email, message)  # наша функция\n\n            messages.success(request, "Сообщение отправлено!")\n            return redirect("contact")  # PRG паттерн (Post-Redirect-Get)\n        # Если форма невалидна — она уже содержит ошибки\n    else:\n        form = ContactForm()  # GET: пустая форма\n\n    return render(request, "contact.html", {"form": form})\n\n# contact.html\ntemplate = """\n<form method="post">\n    {% csrf_token %}\n    {{ form.as_p }}\n    <button type="submit">Отправить</button>\n</form>\n"""' },
        { type: 'tip', value: 'PRG (Post-Redirect-Get) паттерн: после успешного POST — редирект на GET. Это предотвращает повторную отправку формы при обновлении страницы.' }
      ]
    },
    {
      id: 3,
      title: 'ModelForm: форма на основе модели',
      type: 'theory',
      content: [
        { type: 'text', value: 'ModelForm автоматически создаёт форму из модели Django. Не нужно дублировать поля — они берутся из модели. При сохранении автоматически создаёт/обновляет объект модели.' },
        { type: 'code', language: 'python', value: 'from django import forms\nfrom .models import Article\n\nclass ArticleForm(forms.ModelForm):\n    class Meta:\n        model = Article\n        fields = ["title", "content", "category", "tags", "is_published"]\n        # или: exclude = ["author", "created_at"]  # все кроме указанных\n        labels = {\n            "title": "Заголовок",\n            "content": "Текст",\n            "is_published": "Опубликовать"\n        }\n        widgets = {\n            "title": forms.TextInput(attrs={"class": "form-control"}),\n            "content": forms.Textarea(attrs={"rows": 10, "class": "form-control"}),\n        }\n\n# В View:\ndef create_article(request):\n    if request.method == "POST":\n        form = ArticleForm(request.POST)\n        if form.is_valid():\n            article = form.save(commit=False)  # не сохранять сразу\n            article.author = request.user      # добавить автора\n            article.save()                     # теперь сохранить\n            form.save_m2m()                    # сохранить M2M (tags)\n            return redirect("blog:detail", pk=article.pk)\n    else:\n        form = ArticleForm()\n    return render(request, "blog/create.html", {"form": form})\n\ndef edit_article(request, pk):\n    article = get_object_or_404(Article, pk=pk, author=request.user)\n    if request.method == "POST":\n        form = ArticleForm(request.POST, instance=article)  # передаём instance!\n        if form.is_valid():\n            form.save()\n            return redirect("blog:detail", pk=pk)\n    else:\n        form = ArticleForm(instance=article)  # форма заполнена данными\n    return render(request, "blog/edit.html", {"form": form})' },
        { type: 'note', value: 'commit=False создаёт объект в памяти без сохранения в БД. Это нужно когда надо добавить поля которых нет в форме (автор). После form.save_m2m() обязателен если commit=False и есть M2M поля.' }
      ]
    },
    {
      id: 4,
      title: 'Валидация: clean методы',
      type: 'theory',
      content: [
        { type: 'text', value: 'clean_<field>() валидирует конкретное поле. clean() валидирует всю форму (межпольная валидация). ValidationError добавляет сообщение об ошибке.' },
        { type: 'code', language: 'python', value: 'from django import forms\nfrom django.core.exceptions import ValidationError\nfrom .models import User\n\nclass RegistrationForm(forms.Form):\n    username = forms.CharField(max_length=50)\n    email = forms.EmailField()\n    password = forms.CharField(widget=forms.PasswordInput)\n    password_confirm = forms.CharField(\n        widget=forms.PasswordInput,\n        label="Подтвердите пароль"\n    )\n\n    def clean_username(self):\n        """Валидация конкретного поля"""\n        username = self.cleaned_data["username"]\n        if User.objects.filter(username=username).exists():\n            raise ValidationError("Это имя уже занято")\n        if len(username) < 3:\n            raise ValidationError("Имя должно быть длиннее 2 символов")\n        return username  # ОБЯЗАТЕЛЬНО вернуть значение!\n\n    def clean_email(self):\n        email = self.cleaned_data["email"]\n        if User.objects.filter(email=email).exists():\n            raise ValidationError("Этот email уже зарегистрирован")\n        return email\n\n    def clean(self):\n        """Межпольная валидация"""\n        cleaned_data = super().clean()\n        password = cleaned_data.get("password")\n        password_confirm = cleaned_data.get("password_confirm")\n\n        if password and password_confirm:\n            if password != password_confirm:\n                raise ValidationError("Пароли не совпадают")\n\n        return cleaned_data' }
      ]
    },
    {
      id: 5,
      title: 'Отображение ошибок в шаблоне',
      type: 'theory',
      content: [
        { type: 'text', value: 'Django автоматически передаёт ошибки через объект формы. В шаблоне можно вывести всю форму целиком или управлять каждым полем вручную.' },
        { type: 'code', language: 'python', value: '# Варианты вывода формы в шаблоне:\nform_templates = """\n{# 1. Автоматически (быстро, но некрасиво) #}\n{{ form.as_p }}      {# поля в <p> #}\n{{ form.as_ul }}     {# поля в <li> #}\n{{ form.as_table }}  {# поля в <tr> #}\n\n{# 2. Вручную (полный контроль над HTML) #}\n<form method="post" novalidate>\n    {% csrf_token %}\n\n    {# Ошибки всей формы (не привязанные к полям) #}\n    {% if form.non_field_errors %}\n        <div class="alert alert-danger">\n            {% for error in form.non_field_errors %}\n                <p>{{ error }}</p>\n            {% endfor %}\n        </div>\n    {% endif %}\n\n    {# Каждое поле вручную #}\n    <div class="mb-3 {% if form.username.errors %}has-error{% endif %}">\n        <label for="{{ form.username.id_for_label }}">\n            {{ form.username.label }}\n        </label>\n        {{ form.username }}\n        {% for error in form.username.errors %}\n            <p class="text-danger">{{ error }}</p>\n        {% endfor %}\n    </div>\n\n    <button type="submit">Отправить</button>\n</form>\n"""' }
      ]
    },
    {
      id: 6,
      title: 'Загрузка файлов через форму',
      type: 'theory',
      content: [
        { type: 'text', value: 'Для загрузки файлов форма должна иметь enctype="multipart/form-data", а View — передавать request.FILES в форму.' },
        { type: 'code', language: 'python', value: 'from django import forms\nfrom django.core.exceptions import ValidationError\nfrom .models import Product\n\nclass ProductForm(forms.ModelForm):\n    class Meta:\n        model = Product\n        fields = ["name", "price", "description", "image"]\n\n    def clean_image(self):\n        image = self.cleaned_data.get("image")\n        if image:\n            # Проверка размера файла\n            if image.size > 5 * 1024 * 1024:  # 5 MB\n                raise ValidationError("Изображение не должно превышать 5 MB")\n            # Проверка расширения\n            if not image.name.lower().endswith((".jpg", ".jpeg", ".png")):\n                raise ValidationError("Только JPG и PNG изображения")\n        return image\n\n# View:\ndef create_product(request):\n    if request.method == "POST":\n        form = ProductForm(request.POST, request.FILES)  # request.FILES!\n        if form.is_valid():\n            form.save()\n            return redirect("product-list")\n    else:\n        form = ProductForm()\n    return render(request, "create_product.html", {"form": form})\n\n# Шаблон:\n# <form method="post" enctype="multipart/form-data">  <!-- enctype! -->\n# {% csrf_token %}\n# {{ form.as_p }}\n# <button>Сохранить</button>\n# </form>' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Форма регистрации',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай форму регистрации пользователя с валидацией и обработкой в view.',
      requirements: [
        'RegisterForm с полями: username, email, password, password_confirm',
        'clean_username: проверка что username не занят, длина 3-30 символов',
        'clean_email: проверка что email не зарегистрирован',
        'clean(): пароли совпадают, длина пароля минимум 8 символов',
        'View register_view: GET — пустая форма, POST — создание пользователя и редирект',
        'Шаблон с отображением ошибок валидации для каждого поля'
      ],
      expectedOutput: 'POST /register/ с username="a" -> {"username": ["Имя должно быть длиннее 2 символов"]}\nPOST /register/ с разными паролями -> {"__all__": ["Пароли не совпадают"]}\nУспешная регистрация -> redirect("/")',
      hint: 'В clean_username используй self.cleaned_data["username"]. Всегда возвращай значение из clean_field()! В View: User.objects.create_user(username, email, password) для создания пользователя.',
      solution: '# forms.py\nfrom django import forms\nfrom django.contrib.auth.models import User\nfrom django.core.exceptions import ValidationError\n\nclass RegisterForm(forms.Form):\n    username = forms.CharField(max_length=30, label="Имя пользователя")\n    email = forms.EmailField(label="Email")\n    password = forms.CharField(widget=forms.PasswordInput, label="Пароль")\n    password_confirm = forms.CharField(widget=forms.PasswordInput, label="Повтор пароля")\n\n    def clean_username(self):\n        username = self.cleaned_data["username"]\n        if len(username) < 3:\n            raise ValidationError("Имя должно быть длиннее 2 символов")\n        if User.objects.filter(username=username).exists():\n            raise ValidationError("Это имя уже занято")\n        return username\n\n    def clean_email(self):\n        email = self.cleaned_data["email"]\n        if User.objects.filter(email=email).exists():\n            raise ValidationError("Этот email уже зарегистрирован")\n        return email\n\n    def clean(self):\n        cleaned = super().clean()\n        password = cleaned.get("password", "")\n        confirm = cleaned.get("password_confirm", "")\n        if len(password) < 8:\n            self.add_error("password", "Пароль должен быть не менее 8 символов")\n        if password and confirm and password != confirm:\n            raise ValidationError("Пароли не совпадают")\n        return cleaned\n\n# views.py\nfrom django.shortcuts import render, redirect\nfrom django.contrib.auth.models import User\nfrom django.contrib import messages\nfrom .forms import RegisterForm\n\ndef register_view(request):\n    if request.method == "POST":\n        form = RegisterForm(request.POST)\n        if form.is_valid():\n            User.objects.create_user(\n                username=form.cleaned_data["username"],\n                email=form.cleaned_data["email"],\n                password=form.cleaned_data["password"]\n            )\n            messages.success(request, "Аккаунт создан! Войдите в систему.")\n            return redirect("login")\n    else:\n        form = RegisterForm()\n    return render(request, "accounts/register.html", {"form": form})',
      explanation: 'clean_field() методы вызываются автоматически Django при form.is_valid(). Возврат значения обязателен — Django обновляет cleaned_data. self.add_error("field", "msg") добавляет ошибку к конкретному полю из метода clean(). create_user() хэширует пароль автоматически — никогда не сохраняй пароль напрямую! PRG паттерн: успешный POST -> redirect -> GET.'
    }
  ]
}
