export default {
  id: 16,
  title: 'DRF: Serializers',
  description: 'Serializer, ModelSerializer, вложенные сериализаторы — правильно конвертируем данные между Python и JSON.',
  lessons: [
    {
      id: 1,
      title: 'Что такое Serializer',
      type: 'theory',
      content: [
        { type: 'text', value: 'Сериализатор в DRF выполняет две задачи: сериализацию (Python объект -> JSON) и десериализацию (JSON -> Python объект с валидацией). Это центральный компонент DRF.' },
        { type: 'tip', value: 'Сериализатор — как переводчик: принимает объект Django модели и "переводит" его в словарь Python, который потом превращается в JSON. И наоборот — принимает JSON и проверяет, что данные правильные.' },
        { type: 'code', language: 'python', value: 'from rest_framework import serializers\n\nclass ArticleSerializer(serializers.Serializer):\n    id = serializers.IntegerField(read_only=True)\n    title = serializers.CharField(max_length=200)\n    content = serializers.CharField()\n    created_at = serializers.DateTimeField(read_only=True)\n\n    def create(self, validated_data):\n        return Article.objects.create(**validated_data)\n\n    def update(self, instance, validated_data):\n        instance.title = validated_data.get("title", instance.title)\n        instance.content = validated_data.get("content", instance.content)\n        instance.save()\n        return instance' },
        { type: 'note', value: 'Базовый Serializer требует вручную определить create() и update(). ModelSerializer автоматизирует это на основе модели.' }
      ]
    },
    {
      id: 2,
      title: 'ModelSerializer — автоматизация',
      type: 'theory',
      content: [
        { type: 'text', value: 'ModelSerializer автоматически генерирует поля на основе Django модели. Не нужно вручную перечислять каждое поле — достаточно указать модель и список полей.' },
        { type: 'code', language: 'python', value: 'from rest_framework import serializers\nfrom .models import Article\n\nclass ArticleSerializer(serializers.ModelSerializer):\n    class Meta:\n        model = Article\n        fields = ["id", "title", "content", "author", "created_at"]\n        read_only_fields = ["id", "created_at"]\n\n# Использование в view:\nserializer = ArticleSerializer(article)           # объект -> JSON\nserializer = ArticleSerializer(queryset, many=True)  # список -> JSON\nserializer = ArticleSerializer(data=request.data) # JSON -> объект (валидация)' },
        { type: 'heading', value: 'fields = "__all__"' },
        { type: 'code', language: 'python', value: 'class ArticleSerializer(serializers.ModelSerializer):\n    class Meta:\n        model = Article\n        fields = "__all__"  # все поля модели\n        # или exclude = ["internal_field"]  # все кроме указанных' },
        { type: 'warning', value: 'Избегай fields = "__all__" в продакшене — это может случайно раскрыть чувствительные данные (пароли, токены). Всегда явно указывай список полей.' }
      ]
    },
    {
      id: 3,
      title: 'Валидация данных',
      type: 'theory',
      content: [
        { type: 'text', value: 'Сериализаторы автоматически валидируют данные. Можно добавить кастомную валидацию на уровне поля или всего объекта.' },
        { type: 'code', language: 'python', value: 'class ArticleSerializer(serializers.ModelSerializer):\n    class Meta:\n        model = Article\n        fields = ["title", "content"]\n\n    # Валидация отдельного поля: validate_<fieldname>\n    def validate_title(self, value):\n        if len(value) < 5:\n            raise serializers.ValidationError("Заголовок слишком короткий")\n        return value\n\n    # Валидация всего объекта\n    def validate(self, data):\n        if data["title"] == data["content"]:\n            raise serializers.ValidationError("Заголовок и контент не могут совпадать")\n        return data' },
        { type: 'code', language: 'python', value: '# Использование валидации в view\ndef post(self, request):\n    serializer = ArticleSerializer(data=request.data)\n    if serializer.is_valid():\n        serializer.save()  # вызывает create() или update()\n        return Response(serializer.data, status=status.HTTP_201_CREATED)\n    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)' },
        { type: 'tip', value: 'serializer.is_valid(raise_exception=True) автоматически вернёт 400 с ошибками без проверки if. Удобно для краткости кода в views.' }
      ]
    },
    {
      id: 4,
      title: 'Вложенные сериализаторы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Вложенные сериализаторы позволяют представить связанные объекты полностью, а не только их ID.' },
        { type: 'code', language: 'python', value: 'class AuthorSerializer(serializers.ModelSerializer):\n    class Meta:\n        model = User\n        fields = ["id", "username", "email"]\n\nclass ArticleSerializer(serializers.ModelSerializer):\n    # Вложенный сериализатор для ForeignKey\n    author = AuthorSerializer(read_only=True)\n    # Для записи используем отдельное поле\n    author_id = serializers.PrimaryKeyRelatedField(\n        queryset=User.objects.all(), source="author", write_only=True\n    )\n\n    class Meta:\n        model = Article\n        fields = ["id", "title", "author", "author_id"]' },
        { type: 'note', value: 'read_only=True на вложенном сериализаторе означает: при чтении показываем полный объект автора, а при записи принимаем только ID через author_id.' }
      ]
    },
    {
      id: 5,
      title: 'SerializerMethodField и дополнительные поля',
      type: 'theory',
      content: [
        { type: 'text', value: 'SerializerMethodField позволяет добавить вычисляемые поля, которых нет в модели напрямую.' },
        { type: 'code', language: 'python', value: 'class ArticleSerializer(serializers.ModelSerializer):\n    # Вычисляемое поле\n    word_count = serializers.SerializerMethodField()\n    # Поле только для чтения с другим именем\n    author_name = serializers.CharField(source="author.username", read_only=True)\n\n    class Meta:\n        model = Article\n        fields = ["id", "title", "word_count", "author_name"]\n\n    def get_word_count(self, obj):\n        """Метод должен называться get_<field_name>"""\n        return len(obj.content.split()) if obj.content else 0' },
        { type: 'tip', value: 'source="author.username" — мощный инструмент для обращения к полям связанных объектов без вложенного сериализатора. Работает с любой глубиной: source="author.profile.avatar".' }
      ]
    },
    {
      id: 6,
      title: 'Практика: ModelSerializer для Blog',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай ModelSerializer для модели Post (пост блога) с валидацией и вычисляемым полем.',
      requirements: [
        'Модель Post: title, body, author (FK User), created_at, is_published',
        'PostSerializer с полями: id, title, body, author_name (из user.username), created_at, is_published, preview',
        'preview — первые 100 символов body через SerializerMethodField',
        'Валидация: title минимум 10 символов',
        'author_name через source="author.username", read_only=True'
      ],
      expectedOutput: '{"id": 1, "title": "Мой первый пост", "author_name": "admin", "preview": "Это начало поста...", "is_published": true}',
      hint: 'Используй SerializerMethodField для preview с методом get_preview. Для author_name используй source.',
      solution: 'from rest_framework import serializers\nfrom .models import Post\n\nclass PostSerializer(serializers.ModelSerializer):\n    author_name = serializers.CharField(source="author.username", read_only=True)\n    preview = serializers.SerializerMethodField()\n\n    class Meta:\n        model = Post\n        fields = ["id", "title", "body", "author_name", "created_at", "is_published", "preview"]\n        read_only_fields = ["id", "created_at"]\n\n    def validate_title(self, value):\n        if len(value) < 10:\n            raise serializers.ValidationError("Заголовок должен быть не менее 10 символов")\n        return value\n\n    def get_preview(self, obj):\n        return obj.body[:100] if obj.body else ""',
      explanation: 'source="author.username" позволяет напрямую обратиться к полю связанной модели. SerializerMethodField вычисляется динамически при каждом запросе — идеально для производных данных.'
    },
    {
      id: 7,
      title: 'Практика: Вложенный сериализатор Comment',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай PostDetailSerializer с вложенным списком комментариев и количеством лайков.',
      requirements: [
        'Модель Comment: post (FK Post), author (FK User), text, created_at',
        'CommentSerializer с полями: id, author_name, text, created_at',
        'PostDetailSerializer включает поле comments = CommentSerializer(many=True, read_only=True)',
        'Добавь поле comments_count через SerializerMethodField',
        'Маршрут GET /posts/<id>/ использует PostDetailSerializer'
      ],
      expectedOutput: '{"id": 1, "title": "Пост", "comments_count": 2, "comments": [{"id": 1, "author_name": "user1", "text": "Отлично!"}]}',
      hint: 'related_name="comments" на ForeignKey в модели Comment позволяет обратиться через obj.comments.all().',
      solution: 'from rest_framework import serializers\nfrom .models import Post, Comment\n\nclass CommentSerializer(serializers.ModelSerializer):\n    author_name = serializers.CharField(source="author.username", read_only=True)\n\n    class Meta:\n        model = Comment\n        fields = ["id", "author_name", "text", "created_at"]\n\nclass PostDetailSerializer(serializers.ModelSerializer):\n    comments = CommentSerializer(many=True, read_only=True)\n    comments_count = serializers.SerializerMethodField()\n\n    class Meta:\n        model = Post\n        fields = ["id", "title", "body", "comments_count", "comments"]\n\n    def get_comments_count(self, obj):\n        return obj.comments.count()',
      explanation: 'many=True в CommentSerializer говорит: это список объектов. read_only=True означает, что комментарии нельзя создать через этот сериализатор — только читать. related_name на модели должен быть "comments".'
    }
  ]
}
