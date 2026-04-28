export default {
  id: 21,
  title: 'Обработка естественного языка (NLP)',
  description: 'Основы NLP: токенизация, стемминг, лемматизация, Bag of Words, TF-IDF, Word Embeddings.',
  lessons: [
    {
      id: 1,
      title: 'Основы NLP и токенизация',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Обработка текста для ML' },
        { type: 'text', value: 'NLP (Natural Language Processing) — область ML для работы с текстом. Основные задачи: классификация текста (спам, тональность), машинный перевод, чат-боты, генерация текста. Первый шаг — преобразование текста в числа, понятные модели.' },
        { type: 'code', language: 'python', value: 'import re\nfrom collections import Counter\n\n# Токенизация — разбиение текста на слова/токены\ntext = "Machine Learning — это область ИИ. ML позволяет компьютерам учиться!"\n\n# Простая токенизация\ntokens_simple = text.split()\nprint(f"Простая: {tokens_simple}")\n\n# Токенизация с очисткой\ndef tokenize(text):\n    text = text.lower()\n    text = re.sub(r"[^a-zа-яё0-9\\s]", "", text)  # убираем знаки\n    tokens = text.split()\n    return tokens\n\ntokens = tokenize(text)\nprint(f"Очищенная: {tokens}")\n\n# Стоп-слова\nstop_words = {"это", "и", "в", "на", "с", "по", "не", "для", "как", "что", "но"}\nfiltered = [t for t in tokens if t not in stop_words]\nprint(f"Без стоп-слов: {filtered}")\n\n# N-граммы\ndef ngrams(tokens, n):\n    return [tuple(tokens[i:i+n]) for i in range(len(tokens)-n+1)]\n\nprint(f"Биграммы: {ngrams(tokens, 2)}")\n\n# Частотный анализ\ncorpus = [\n    "я люблю машинное обучение",\n    "машинное обучение это интересно",\n    "глубокое обучение часть машинного обучения"\n]\n\nall_tokens = []\nfor doc in corpus:\n    all_tokens.extend(tokenize(doc))\n\nfreq = Counter(all_tokens)\nprint(f"\\nЧастоты: {freq.most_common(5)}")' },
        { type: 'tip', value: 'Для русского языка используйте библиотеку nltk или pymorphy2 для лемматизации (приведения слов к начальной форме).' }
      ]
    },
    {
      id: 2,
      title: 'Bag of Words и TF-IDF',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Векторизация текста' },
        { type: 'code', language: 'python', value: 'from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer\n\ncorpus = [\n    "Кот сидит на коврике",\n    "Собака лежит на диване",\n    "Кот и собака играют",\n    "На коврике лежит кот"\n]\n\n# 1. Bag of Words (CountVectorizer)\ncv = CountVectorizer()\nX_bow = cv.fit_transform(corpus)\n\nprint("Bag of Words:")\nprint(f"Словарь: {cv.get_feature_names_out()}")\nprint(f"Матрица:\\n{X_bow.toarray()}")\n\n# 2. TF-IDF (Term Frequency - Inverse Document Frequency)\n# TF: как часто слово встречается в документе\n# IDF: насколько слово уникально для корпуса\ntfidf = TfidfVectorizer()\nX_tfidf = tfidf.fit_transform(corpus)\n\nprint(f"\\nTF-IDF:")\nprint(f"Словарь: {tfidf.get_feature_names_out()}")\nprint(f"Матрица:\\n{X_tfidf.toarray().round(3)}")\n\n# TF-IDF для классификации\nfrom sklearn.naive_bayes import MultinomialNB\nfrom sklearn.pipeline import Pipeline\n\nreviews = ["Отличный фильм, рекомендую!", "Ужасный фильм, потерял время",\n           "Прекрасная игра актёров", "Скучный и неинтересный сюжет",\n           "Лучший фильм года!", "Полный провал, не смотрите"]\nlabels = [1, 0, 1, 0, 1, 0]  # 1=позитивный, 0=негативный\n\npipe = Pipeline([\n    ("tfidf", TfidfVectorizer()),\n    ("clf", MultinomialNB())\n])\npipe.fit(reviews, labels)\n\nnew_reviews = ["Замечательный фильм!", "Скучно и неинтересно"]\npredictions = pipe.predict(new_reviews)\nfor rev, pred in zip(new_reviews, predictions):\n    print(f"\\n\\"{rev}\\\" -> {\\"Положительный\\" if pred == 1 else \\"Отрицательный\\"}")' },
        { type: 'note', value: 'TF-IDF лучше BoW, так как понижает вес частых неинформативных слов (предлоги, союзы) и повышает вес уникальных значимых слов.' }
      ]
    },
    {
      id: 3,
      title: 'Word Embeddings',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Плотные векторные представления слов' },
        { type: 'text', value: 'Word Embeddings (Word2Vec, GloVe, FastText) представляют слова как плотные векторы фиксированной размерности. Похожие по смыслу слова имеют близкие векторы: "король" - "мужчина" + "женщина" ≈ "королева". В Keras используется слой Embedding.' },
        { type: 'code', language: 'python', value: 'import numpy as np\nimport tensorflow as tf\nfrom tensorflow.keras import layers\n\n# Embedding слой в Keras\n# Преобразует целочисленные индексы слов в плотные векторы\nvocab_size = 1000  # размер словаря\nembedding_dim = 32  # размерность вектора\nmax_length = 20     # максимальная длина текста\n\nembedding_layer = layers.Embedding(vocab_size, embedding_dim, input_length=max_length)\n\n# Пример: последовательность индексов слов\ninput_seq = np.array([[1, 2, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]])\noutput = embedding_layer(input_seq)\nprint(f"Вход: {input_seq.shape}")     # (1, 20)\nprint(f"Выход: {output.shape}")       # (1, 20, 32)\nprint(f"Вектор слова 1: {output[0, 0, :5].numpy().round(4)}...")  # 32-мерный вектор\n\n# Косинусное сходство между словами\ndef cosine_sim(a, b):\n    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))\n\n# Симуляция: предобученные embeddings\nnp.random.seed(42)\nword_vectors = {\n    "кот": np.array([0.8, 0.3, -0.1, 0.5]),\n    "собака": np.array([0.7, 0.4, -0.2, 0.4]),\n    "машина": np.array([-0.3, 0.1, 0.9, -0.5]),\n    "компьютер": np.array([-0.2, 0.2, 0.8, -0.4]),\n}\n\nprint("\\nКосинусное сходство:")\nfor w1, w2 in [("кот", "собака"), ("кот", "машина"), ("машина", "компьютер")]:\n    sim = cosine_sim(word_vectors[w1], word_vectors[w2])\n    print(f"  {w1} — {w2}: {sim:.4f}")' },
        { type: 'list', value: [
          'Word2Vec: учится предсказывать слово по контексту (CBOW) или контекст по слову (Skip-gram)',
          'GloVe: матрица со-встречаемости слов → факторизация',
          'FastText: работает на уровне символьных n-грамм, обрабатывает незнакомые слова',
          'Keras Embedding: обучается вместе с моделью, не требует предобученных векторов'
        ] }
      ]
    },
    {
      id: 4,
      title: 'Классификация текста с нейросетью',
      type: 'theory',
      content: [
        { type: 'heading', value: 'IMDB Sentiment Analysis' },
        { type: 'code', language: 'python', value: 'import tensorflow as tf\nfrom tensorflow.keras import layers, Sequential\nimport numpy as np\n\n# IMDB dataset\nvocab_size = 10000\nmax_len = 200\n\n(X_train, y_train), (X_test, y_test) = tf.keras.datasets.imdb.load_data(num_words=vocab_size)\nX_train = tf.keras.preprocessing.sequence.pad_sequences(X_train, maxlen=max_len)\nX_test = tf.keras.preprocessing.sequence.pad_sequences(X_test, maxlen=max_len)\n\n# Сравнение архитектур\nmodels = {\n    "Embedding + Dense": Sequential([\n        layers.Embedding(vocab_size, 32, input_length=max_len),\n        layers.GlobalAveragePooling1D(),  # среднее по последовательности\n        layers.Dense(64, activation="relu"),\n        layers.Dropout(0.5),\n        layers.Dense(1, activation="sigmoid")\n    ]),\n    "Embedding + LSTM": Sequential([\n        layers.Embedding(vocab_size, 32, input_length=max_len),\n        layers.LSTM(64, dropout=0.2),\n        layers.Dense(1, activation="sigmoid")\n    ]),\n    "Embedding + Conv1D": Sequential([\n        layers.Embedding(vocab_size, 32, input_length=max_len),\n        layers.Conv1D(64, 5, activation="relu"),\n        layers.GlobalMaxPooling1D(),\n        layers.Dense(64, activation="relu"),\n        layers.Dense(1, activation="sigmoid")\n    ])\n}\n\nfor name, model in models.items():\n    model.compile(optimizer="adam", loss="binary_crossentropy", metrics=["accuracy"])\n    model.fit(X_train, y_train, epochs=3, batch_size=128, \n              validation_split=0.2, verbose=0)\n    _, acc = model.evaluate(X_test, y_test, verbose=0)\n    print(f"{name:25s}: Test accuracy={acc:.4f}")' },
        { type: 'tip', value: 'Conv1D для текста часто работает не хуже LSTM, но обучается значительно быстрее. GlobalMaxPooling1D выбирает самые важные признаки из последовательности.' }
      ]
    },
    {
      id: 5,
      title: 'Предобработка текста для ML',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Полный NLP pipeline' },
        { type: 'code', language: 'python', value: 'from sklearn.feature_extraction.text import TfidfVectorizer\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.naive_bayes import MultinomialNB\nfrom sklearn.pipeline import Pipeline\nfrom sklearn.model_selection import cross_val_score\nimport re\n\n# Корпус отзывов\nreviews = [\n    "Отличный продукт, очень доволен покупкой!",\n    "Ужасное качество, товар сломался через день",\n    "Рекомендую! Лучшее соотношение цена-качество",\n    "Не покупайте это, полная ерунда",\n    "Хороший товар, быстрая доставка, спасибо",\n    "Разочарован, не соответствует описанию",\n    "Великолепно! Пользуюсь каждый день",\n    "Деньги на ветер, плохой товар",\n    "Супер! Все работает отлично",\n    "Ужас, верну обратно"\n]\nlabels = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0]\n\ndef preprocess(text):\n    text = text.lower()\n    text = re.sub(r"[^а-яё\\s]", "", text)\n    return text\n\nreviews_clean = [preprocess(r) for r in reviews]\n\npipe = Pipeline([\n    ("tfidf", TfidfVectorizer(max_features=5000, ngram_range=(1,2))),\n    ("clf", LogisticRegression(max_iter=1000))\n])\n\ncv = cross_val_score(pipe, reviews_clean, labels, cv=3)\nprint(f"TF-IDF + LogReg: CV={cv.mean():.4f}")\n\npipe.fit(reviews_clean, labels)\n\nnew = ["отличный товар рекомендую", "плохое качество не берите"]\nfor text in new:\n    pred = pipe.predict([preprocess(text)])[0]\n    label = "Положительный" if pred == 1 else "Отрицательный"\n    print(f"  {text} -> {label}")' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Классификация отзывов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Постройте систему классификации отзывов (positive/negative) с TF-IDF и сравните Naive Bayes, Logistic Regression и SVM.',
      requirements: [
        'Загрузите IMDB dataset из Keras (num_words=5000)',
        'Преобразуйте индексы обратно в текст (для понимания данных)',
        'Создайте TF-IDF представления текстов',
        'Обучите и сравните MultinomialNB, LogisticRegression, LinearSVC',
        'Выведите accuracy каждой модели на тесте'
      ],
      hint: 'imdb.get_word_index() даёт словарь слово->индекс. Для TF-IDF преобразуйте последовательности индексов обратно в строки. Или используйте CountVectorizer напрямую с текстом.',
      expectedOutput: 'Naive Bayes: 0.83XX\nLogistic Regression: 0.86XX\nLinearSVC: 0.86XX',
      solution: 'import numpy as np\nimport tensorflow as tf\nfrom sklearn.feature_extraction.text import TfidfVectorizer\nfrom sklearn.naive_bayes import MultinomialNB\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.svm import LinearSVC\nfrom sklearn.metrics import accuracy_score\n\n# Загрузка IMDB\nvocab_size = 5000\n(X_train_seq, y_train), (X_test_seq, y_test) = tf.keras.datasets.imdb.load_data(num_words=vocab_size)\n\n# Словарь индекс -> слово\nword_index = tf.keras.datasets.imdb.get_word_index()\nindex_word = {v+3: k for k, v in word_index.items()}\nindex_word[0] = "<pad>"\nindex_word[1] = "<start>"\nindex_word[2] = "<unk>"\n\ndef seq_to_text(seq):\n    return " ".join(index_word.get(i, "?") for i in seq)\n\nX_train_text = [seq_to_text(s) for s in X_train_seq]\nX_test_text = [seq_to_text(s) for s in X_test_seq]\n\nprint(f"Пример отзыва: {X_train_text[0][:100]}...")\n\n# TF-IDF\ntfidf = TfidfVectorizer(max_features=5000)\nX_train_tfidf = tfidf.fit_transform(X_train_text)\nX_test_tfidf = tfidf.transform(X_test_text)\n\n# Сравнение моделей\nmodels = {\n    "Naive Bayes": MultinomialNB(),\n    "Logistic Regression": LogisticRegression(max_iter=1000),\n    "LinearSVC": LinearSVC(max_iter=2000)\n}\n\nfor name, model in models.items():\n    model.fit(X_train_tfidf, y_train)\n    y_pred = model.predict(X_test_tfidf)\n    acc = accuracy_score(y_test, y_pred)\n    print(f"{name}: {acc:.4f}")',
      explanation: 'TF-IDF преобразует тексты в числовые векторы, где вес слова зависит от его частоты в документе и редкости в корпусе. Logistic Regression и LinearSVC обычно превосходят Naive Bayes на этой задаче благодаря более мощным границам решений. Для ещё лучших результатов нужны предобученные embeddings или трансформеры (BERT).'
    }
  ]
}
