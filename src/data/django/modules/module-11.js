export default {
  id: 11,
  title: 'Class-Based Views',
  description: 'Generic CBV в Django: ListView, DetailView, CreateView, UpdateView, DeleteView — уменьшение повторяющегося кода через наследование',
  lessons: [
    {
      id: 1,
      title: 'Зачем нужны CBV и как они работают',
      type: 'theory',
      content: [
        { type: 'text', value: 'Class-Based Views (CBV) решают проблему дублирования кода. Типичные операции CRUD одинаковы для всех моделей. CBV реализуют эту логику один раз через наследование.' },
        { type: 'code', language: 'python', value: '# Function-Based View (много повторений):\ndef article_list(request):\n    articles = Article.objects.filter(is_published=True)\n    return render(request, "blog/list.html", {"articles": articles})\n\n# То же самое — Class-Based View (3 строки):\nfrom django.views.generic import ListView\n\nclass ArticleListView(ListView):\n    model = Article\n    template_name = "blog/article_list.html"\n    context_object_name = "articles"\n\n# URLs для CBV — через as_view():\n# path("articles/", views.ArticleListView.as_view(), name="article-list")\n\n# CBV автоматически:\n# - Получает queryset из модели (Article.objects.all())\n# - Рендерит template_name\n# - Передаёт объекты как context_object_name в контекст\n# - Обрабатывает GET запросы' }
      ]
    },
    {
      id: 2,
      title: 'ListView: список объектов',
      type: 'theory',
      content: [
        { type: 'text', value: 'ListView отображает список объектов модели. Поддерживает пагинацию, фильтрацию и сортировку через переопределение методов.' },
        { type: 'code', language: 'python', value: 'from django.views.generic import ListView\nfrom .models import Article\n\nclass ArticleListView(ListView):\n    model = Article\n    template_name = "blog/article_list.html"\n    context_object_name = "articles"\n    paginate_by = 10  # пагинация: 10 объектов на странице\n    ordering = ["-created_at"]  # сортировка\n\n    def get_queryset(self):\n        """Переопределяем queryset — только опубликованные"""\n        qs = super().get_queryset()\n        return qs.filter(is_published=True).select_related("author", "category")\n\n    def get_context_data(self, **kwargs):\n        """Добавляем доп. данные в контекст"""\n        context = super().get_context_data(**kwargs)\n        context["title"] = "Все статьи"\n        context["categories"] = Category.objects.all()\n        return context\n\n# Шаблон с пагинацией:\n# {% for article in articles %}...{% endfor %}\n# {% if is_paginated %}\n#   {% if page_obj.has_previous %}\n#     <a href="?page={{ page_obj.previous_page_number }}">Назад</a>\n#   {% endif %}\n#   Страница {{ page_obj.number }} из {{ paginator.num_pages }}\n#   {% if page_obj.has_next %}\n#     <a href="?page={{ page_obj.next_page_number }}">Вперёд</a>\n#   {% endif %}\n# {% endif %}' },
        { type: 'tip', value: 'paginate_by автоматически добавляет в контекст: page_obj, paginator, is_paginated. URL пагинации: /articles/?page=2. Не нужно ничего делать вручную!' }
      ]
    },
    {
      id: 3,
      title: 'DetailView и CreateView',
      type: 'theory',
      content: [
        { type: 'text', value: 'DetailView отображает один объект по pk или slug. CreateView показывает форму и создаёт объект при POST.' },
        { type: 'code', language: 'python', value: 'from django.views.generic import DetailView, CreateView\nfrom django.contrib.auth.mixins import LoginRequiredMixin\nfrom django.urls import reverse_lazy\nfrom .models import Article\nfrom .forms import ArticleForm\n\nclass ArticleDetailView(DetailView):\n    model = Article\n    template_name = "blog/article_detail.html"\n    context_object_name = "article"\n    # Django ищет объект по pk (из URL <int:pk>)\n    # Или по slug: slug_field = "slug", slug_url_kwarg = "slug"\n\n    def get_queryset(self):\n        return super().get_queryset().select_related("author").prefetch_related("tags")\n\n    def get_object(self):\n        """Увеличиваем счётчик просмотров"""\n        obj = super().get_object()\n        obj.increment_views()  # наш метод\n        return obj\n\nclass ArticleCreateView(LoginRequiredMixin, CreateView):\n    model = Article\n    form_class = ArticleForm\n    template_name = "blog/article_form.html"\n    success_url = reverse_lazy("blog:list")\n\n    def form_valid(self, form):\n        """Добавляем автора перед сохранением"""\n        form.instance.author = self.request.user\n        return super().form_valid(form)\n    # super().form_valid(form) сохраняет форму и редиректит на success_url' }
      ]
    },
    {
      id: 4,
      title: 'UpdateView и DeleteView',
      type: 'theory',
      content: [
        { type: 'text', value: 'UpdateView заполняет форму данными существующего объекта. DeleteView показывает страницу подтверждения и удаляет объект.' },
        { type: 'code', language: 'python', value: 'from django.views.generic import UpdateView, DeleteView\nfrom django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin\nfrom django.urls import reverse_lazy\nfrom .models import Article\nfrom .forms import ArticleForm\n\nclass ArticleUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):\n    model = Article\n    form_class = ArticleForm\n    template_name = "blog/article_form.html"\n\n    def test_func(self):\n        """UserPassesTestMixin: проверка прав"""\n        article = self.get_object()\n        return self.request.user == article.author  # только автор может редактировать\n\n    def get_success_url(self):\n        return reverse_lazy("blog:detail", kwargs={"pk": self.object.pk})\n\nclass ArticleDeleteView(LoginRequiredMixin, UserPassesTestMixin, DeleteView):\n    model = Article\n    template_name = "blog/article_confirm_delete.html"\n    success_url = reverse_lazy("blog:list")\n\n    def test_func(self):\n        return self.request.user == self.get_object().author\n\n# Templates:\n# article_form.html — используется и для Create и для Update!\n# article_confirm_delete.html — страница подтверждения\n# <form method="post">{% csrf_token %}<button>Удалить</button></form>' }
      ]
    },
    {
      id: 5,
      title: 'Mixins: расширение CBV',
      type: 'theory',
      content: [
        { type: 'text', value: 'Mixins добавляют функциональность к CBV через множественное наследование. LoginRequiredMixin, PermissionRequiredMixin, UserPassesTestMixin — стандартные миксины Django.' },
        { type: 'code', language: 'python', value: 'from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin\nfrom django.views.generic import ListView, CreateView\n\n# LoginRequiredMixin — только для авторизованных\nclass MyView(LoginRequiredMixin, ListView):\n    model = Article\n    login_url = "/login/"  # куда редиректить (по умолчанию settings.LOGIN_URL)\n    redirect_field_name = "next"\n\n# PermissionRequiredMixin — нужно разрешение\nclass AdminOnlyView(PermissionRequiredMixin, ListView):\n    model = Article\n    permission_required = "blog.view_article"  # app.action_model\n\n# Кастомный Mixin\nclass AuthorRequiredMixin:\n    def get_object(self, queryset=None):\n        obj = super().get_object(queryset)\n        if obj.author != self.request.user:\n            from django.core.exceptions import PermissionDenied\n            raise PermissionDenied\n        return obj\n\n# Использование:\nclass ArticleEditView(LoginRequiredMixin, AuthorRequiredMixin, UpdateView):\n    model = Article\n    fields = ["title", "content"]' },
        { type: 'tip', value: 'Порядок Mixins важен! LoginRequiredMixin должен стоять первым (слева от View). Python использует MRO (Method Resolution Order) для поиска метода — он идёт слева направо.' }
      ]
    },
    {
      id: 6,
      title: 'FormView и RedirectView',
      type: 'theory',
      content: [
        { type: 'text', value: 'FormView обрабатывает форму которая не привязана к модели. RedirectView делает редирект на другой URL.' },
        { type: 'code', language: 'python', value: 'from django.views.generic import FormView, RedirectView\nfrom django.contrib import messages\nfrom .forms import ContactForm\n\nclass ContactView(FormView):\n    template_name = "contact.html"\n    form_class = ContactForm\n    success_url = "/contact/thanks/"\n\n    def form_valid(self, form):\n        """Вызывается при успешной валидации"""\n        # Обработка формы\n        name = form.cleaned_data["name"]\n        email = form.cleaned_data["email"]\n        message = form.cleaned_data["message"]\n\n        # Отправка email...\n        send_contact_email(name, email, message)\n\n        messages.success(self.request, "Сообщение отправлено!")\n        return super().form_valid(form)\n\n    def form_invalid(self, form):\n        """Вызывается при ошибках валидации"""\n        messages.error(self.request, "Исправьте ошибки в форме")\n        return super().form_invalid(form)\n\n# RedirectView — простой редирект\nclass OldUrlRedirectView(RedirectView):\n    url = "/new-url/"\n    permanent = True  # 301 (True) или 302 (False)\n\n# В urls.py:\n# path("old-path/", RedirectView.as_view(url="/new/", permanent=True))' }
      ]
    },
    {
      id: 7,
      title: 'Практика: CRUD с CBV',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй полный CRUD для блога используя только Class-Based Views.',
      requirements: [
        'PostListView (ListView): список постов, paginate_by=5, только is_published=True',
        'PostDetailView (DetailView): детали поста',
        'PostCreateView (LoginRequiredMixin + CreateView): форма создания',
        'PostUpdateView (LoginRequiredMixin + UserPassesTestMixin + UpdateView): только автор',
        'PostDeleteView (LoginRequiredMixin + UserPassesTestMixin + DeleteView): только автор',
        'URL для каждого view с правильными именами'
      ],
      expectedOutput: 'GET /posts/ -> список с пагинацией\nGET /posts/1/ -> детали\nGET /posts/new/ -> форма (только авторизованным)\nGET /posts/1/edit/ -> форма редактирования (только автору)\nGET /posts/1/delete/ -> страница подтверждения',
      hint: 'test_func в UserPassesTestMixin: return self.request.user == self.get_object().author. В PostCreateView form_valid добавляет request.user как автора. reverse_lazy нужен вместо reverse в атрибутах класса.',
      solution: '# blog/views.py\nfrom django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView\nfrom django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin\nfrom django.urls import reverse_lazy\nfrom .models import Post\nfrom .forms import PostForm\n\nclass PostListView(ListView):\n    model = Post\n    template_name = "blog/post_list.html"\n    context_object_name = "posts"\n    paginate_by = 5\n    ordering = ["-created_at"]\n\n    def get_queryset(self):\n        return super().get_queryset().filter(is_published=True).select_related("author")\n\nclass PostDetailView(DetailView):\n    model = Post\n    template_name = "blog/post_detail.html"\n    context_object_name = "post"\n\nclass PostCreateView(LoginRequiredMixin, CreateView):\n    model = Post\n    form_class = PostForm\n    template_name = "blog/post_form.html"\n    success_url = reverse_lazy("blog:list")\n\n    def form_valid(self, form):\n        form.instance.author = self.request.user\n        return super().form_valid(form)\n\nclass PostUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):\n    model = Post\n    form_class = PostForm\n    template_name = "blog/post_form.html"\n\n    def test_func(self):\n        return self.request.user == self.get_object().author\n\n    def get_success_url(self):\n        return reverse_lazy("blog:detail", kwargs={"pk": self.object.pk})\n\nclass PostDeleteView(LoginRequiredMixin, UserPassesTestMixin, DeleteView):\n    model = Post\n    template_name = "blog/post_confirm_delete.html"\n    success_url = reverse_lazy("blog:list")\n\n    def test_func(self):\n        return self.request.user == self.get_object().author\n\n# blog/urls.py\nfrom django.urls import path\nfrom . import views\n\napp_name = "blog"\nurlpatterns = [\n    path("", views.PostListView.as_view(), name="list"),\n    path("<int:pk>/", views.PostDetailView.as_view(), name="detail"),\n    path("new/", views.PostCreateView.as_view(), name="create"),\n    path("<int:pk>/edit/", views.PostUpdateView.as_view(), name="update"),\n    path("<int:pk>/delete/", views.PostDeleteView.as_view(), name="delete"),\n]',
      explanation: 'CBV используют as_view() в urls.py. LoginRequiredMixin перенаправляет неавторизованных на страницу входа. UserPassesTestMixin проверяет test_func() — при False возвращает 403. form_valid() вызывается после успешной валидации — здесь добавляем author перед сохранением. reverse_lazy нужен в атрибутах класса (не внутри метода) — обычный reverse не работает до инициализации URL.'
    },
    {
      id: 8,
      title: 'Практика: ListView с поиском и фильтрацией',
      type: 'practice',
      difficulty: 'hard',
      description: 'Расширь ListView фильтрацией по GET-параметрам и сортировкой.',
      requirements: [
        'ProductListView с параметрами: q (поиск), category (фильтр), sort (сортировка)',
        'get_queryset() применяет фильтры из request.GET',
        'get_context_data() передаёт текущие фильтры обратно в шаблон',
        'paginate_by=12, пагинация сохраняет GET параметры (?q=test&page=2)',
        'Поиск по name и description (icontains)',
        'Сортировка: price_asc, price_desc, name, newest'
      ],
      expectedOutput: 'GET /products/?q=ноутбук&category=1&sort=price_asc -> отфильтрованный и отсортированный список\nПагинация: /products/?q=ноутбук&page=2',
      hint: 'В get_queryset: self.request.GET.get("q", ""). В get_context_data добавь current_filters = self.request.GET. В шаблоне пагинации: ?{{ request.GET.urlencode }}&page={{ page }}.',
      solution: 'from django.views.generic import ListView\nfrom .models import Product, Category\n\nclass ProductListView(ListView):\n    model = Product\n    template_name = "shop/product_list.html"\n    context_object_name = "products"\n    paginate_by = 12\n\n    def get_queryset(self):\n        qs = Product.objects.filter(is_active=True).select_related("category")\n        q = self.request.GET.get("q", "").strip()\n        if q:\n            from django.db.models import Q\n            qs = qs.filter(Q(name__icontains=q) | Q(description__icontains=q))\n        category_id = self.request.GET.get("category")\n        if category_id:\n            qs = qs.filter(category_id=category_id)\n        sort = self.request.GET.get("sort", "")\n        sort_map = {\n            "price_asc": "price",\n            "price_desc": "-price",\n            "name": "name",\n            "newest": "-created_at"\n        }\n        qs = qs.order_by(sort_map.get(sort, "-created_at"))\n        return qs\n\n    def get_context_data(self, **kwargs):\n        context = super().get_context_data(**kwargs)\n        context["categories"] = Category.objects.all()\n        context["current_q"] = self.request.GET.get("q", "")\n        context["current_category"] = self.request.GET.get("category", "")\n        context["current_sort"] = self.request.GET.get("sort", "")\n        return context',
      explanation: 'self.request доступен в CBV через атрибут. get_queryset() вызывается Django для получения объектов. Цепочка фильтров строит сложный queryset. sort_map переводит строку из GET в поле для order_by(). get_context_data() добавляет текущие фильтры в контекст — шаблон может использовать их для pre-fill фильтр-формы.'
    }
  ]
}
