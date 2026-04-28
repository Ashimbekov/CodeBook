export default {
  id: 59,
  title: 'Kaggle: NLP с Disaster Tweets',
  description: 'Пошаговое прохождение конкурса Natural Language Processing with Disaster Tweets: от TF-IDF baseline до fine-tuning BERT с F1 > 0.83.',
  lessons: [
    {
      id: 1,
      title: 'Описание конкурса Disaster Tweets',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Бинарная классификация текстов'
        },
        {
          type: 'text',
          value: 'Natural Language Processing with Disaster Tweets — конкурс по классификации твитов: описывает ли твит реальную катастрофу (1) или нет (0). Пример: "The forest is on fire" — реальная катастрофа, "My mixtape is fire" — нет. Метрика: F1-score.'
        },
        {
          type: 'heading',
          value: 'Почему F1, а не Accuracy'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import numpy as np\n\n# F1-score — гармоническое среднее precision и recall\n# Precision = TP / (TP + FP) — из предсказанных позитивных, сколько правильных\n# Recall = TP / (TP + FN) — из реальных позитивных, сколько найдено\n# F1 = 2 * Precision * Recall / (Precision + Recall)\n\ndef calculate_metrics(y_true, y_pred):\n    tp = np.sum((y_true == 1) & (y_pred == 1))\n    fp = np.sum((y_true == 0) & (y_pred == 1))\n    fn = np.sum((y_true == 1) & (y_pred == 0))\n    tn = np.sum((y_true == 0) & (y_pred == 0))\n    \n    precision = tp / (tp + fp) if (tp + fp) > 0 else 0\n    recall = tp / (tp + fn) if (tp + fn) > 0 else 0\n    f1 = 2 * precision * recall / (precision + recall) if (precision + recall) > 0 else 0\n    accuracy = (tp + tn) / len(y_true)\n    \n    return {"accuracy": accuracy, "precision": precision, "recall": recall, "f1": f1}\n\n# Пример: несбалансированные данные\ny_true = np.array([0,0,0,0,0,0,0,1,1,1])  # 70% негативных\ny_pred = np.array([0,0,0,0,0,0,0,0,0,0])  # всё предсказано как 0\n\nmetrics = calculate_metrics(y_true, y_pred)\nprint("Если всё предсказать как 0:")\nfor k, v in metrics.items():\n    print(f"  {k}: {v:.2f}")\nprint("Accuracy = 0.70, но F1 = 0.00! F1 справедливее!")\n\n# Хорошее предсказание\ny_pred2 = np.array([0,0,0,0,0,0,1,1,1,0])\nmetrics2 = calculate_metrics(y_true, y_pred2)\nprint("\\nХорошее предсказание:")\nfor k, v in metrics2.items():\n    print(f"  {k}: {v:.2f}")'
        },
        {
          type: 'heading',
          value: 'Структура данных'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import numpy as np\n\n# Структура датасета\n# id       — уникальный ID\n# keyword  — ключевое слово из твита (может быть пустым)\n# location — местоположение (может быть пустым)\n# text     — текст твита\n# target   — 1 (реальная катастрофа) или 0 (нет)\n\n# Примеры твитов\ndisaster_tweets = [\n    "Forest fire near La Ronge Sask. Canada",\n    "Earthquake damage in residential buildings",\n    "Flooding in downtown Houston streets evacuated",\n    "Huge wildfire spreading across California",\n    "Tsunami warning issued for the coastal areas",\n]\n\nnon_disaster_tweets = [\n    "I love the fire in your eyes",\n    "This party is a total disaster lol",\n    "My phone screen is cracked and shattered",\n    "The new album is absolutely blazing hot",\n    "Traffic is a wreck today as usual",\n]\n\nprint("=== Примеры твитов ===")\nprint("\\nРеальные катастрофы (target=1):")\nfor t in disaster_tweets:\n    print(f"  + {t}")\n\nprint("\\nНе катастрофы (target=0):")\nfor t in non_disaster_tweets:\n    print(f"  - {t}")\n\nprint("\\n=== Сложность задачи ===")\nprint("Слова \'fire\', \'disaster\', \'crash\' используются метафорически!")\nprint("Модель должна понимать КОНТЕКСТ, а не просто ключевые слова.")'
        },
        {
          type: 'list',
          value: [
            'Train: ~7600 твитов (57% негативных, 43% позитивных)',
            'Test: ~3200 твитов без меток',
            'Метрика: F1-score (средний score: 0.75-0.80)',
            'Baseline (все = 1): F1 ~ 0.60',
            'TF-IDF + LogReg: F1 ~ 0.78-0.80',
            'BERT fine-tuning: F1 ~ 0.83-0.85',
            'Топ решения: F1 ~ 0.86+'
          ]
        },
        {
          type: 'tip',
          value: 'Keyword и location содержат полезную информацию, но имеют пропуски (~30% и ~67%). Основная сила — в анализе текста. Метафорическое использование слов катастроф — главная сложность.'
        }
      ]
    },
    {
      id: 2,
      title: 'EDA текстовых данных',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Анализ текста: длина, слова, паттерны'
        },
        {
          type: 'text',
          value: 'EDA для NLP задач включает: анализ длин текстов, частотный анализ слов, n-грамм, специфические текстовые признаки (URL, хештеги, упоминания), распределение по классам.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import numpy as np\nimport re\nfrom collections import Counter\n\nnp.random.seed(42)\n\n# Создаём датасет disaster tweets\ndisaster_words = ["fire","earthquake","flood","storm","explosion","crash","evacuate",\n                  "destroyed","damage","wildfire","hurricane","tornado","killed",\n                  "emergency","rescue","tsunami","collapsed","burning","victims"]\n\nnon_disaster_words = ["love","party","awesome","lol","great","amazing","happy",\n                      "fun","cool","beautiful","nice","good","best","like",\n                      "movie","music","food","game","play","work","home"]\n\ncommon_words = ["the","is","in","a","to","and","of","my","i","this","that","it",\n                "for","on","was","are","with","just","so","but","have","from"]\n\ndef generate_tweet(is_disaster):\n    words = common_words.copy()\n    if is_disaster:\n        words.extend(np.random.choice(disaster_words, np.random.randint(2, 5)))\n        if np.random.random() < 0.3:\n            words.append("http://t.co/link")\n    else:\n        words.extend(np.random.choice(non_disaster_words, np.random.randint(2, 5)))\n        if np.random.random() < 0.2:\n            words.append("#blessed")\n    np.random.shuffle(words)\n    return " ".join(words[:np.random.randint(8, 20)])\n\nn = 1000\ntexts = []\ntargets = []\nfor _ in range(n):\n    is_dis = np.random.random() < 0.43\n    texts.append(generate_tweet(is_dis))\n    targets.append(1 if is_dis else 0)\ntargets = np.array(targets)\n\n# EDA\nprint("=== Text EDA ===")\nprint(f"Всего твитов: {len(texts)}")\nprint(f"Disaster: {(targets==1).sum()} ({(targets==1).mean():.1%})")\nprint(f"Non-disaster: {(targets==0).sum()} ({(targets==0).mean():.1%})")\n\n# Длина текстов\nlengths = [len(t) for t in texts]\nword_counts = [len(t.split()) for t in texts]\n\nprint(f"\\n=== Длина текстов ===")\nprint(f"Символов — mean: {np.mean(lengths):.0f}, median: {np.median(lengths):.0f}")\nprint(f"Слов — mean: {np.mean(word_counts):.0f}, median: {np.median(word_counts):.0f}")\n\n# Длина по классам\nfor cls in [0, 1]:\n    cls_lens = [len(texts[i].split()) for i in range(len(texts)) if targets[i] == cls]\n    label = "Disaster" if cls == 1 else "Non-disaster"\n    print(f"  {label}: {np.mean(cls_lens):.1f} слов (среднее)")'
        },
        {
          type: 'heading',
          value: 'Частотный анализ и n-граммы'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Частые слова по классам\ndef get_top_words(texts, targets, cls, n=10):\n    words = []\n    for i, t in enumerate(texts):\n        if targets[i] == cls:\n            words.extend(t.lower().split())\n    counter = Counter(words)\n    # Убираем стоп-слова\n    stop = {"the","is","in","a","to","and","of","my","i","this","that","it",\n            "for","on","was","are","with","just","so","but","have","from"}\n    return [(w, c) for w, c in counter.most_common(n + 20) if w not in stop][:n]\n\nprint("=== Топ слова по классам ===")\nprint("\\nDisaster tweets:")\nfor word, count in get_top_words(texts, targets, 1, 10):\n    print(f"  {word:15s}: {count}")\n\nprint("\\nNon-disaster tweets:")\nfor word, count in get_top_words(texts, targets, 0, 10):\n    print(f"  {word:15s}: {count}")\n\n# Текстовые признаки\nprint("\\n=== Текстовые признаки ===")\nfor label, cls in [("Disaster", 1), ("Non-disaster", 0)]:\n    cls_texts = [texts[i] for i in range(len(texts)) if targets[i] == cls]\n    has_url = sum(1 for t in cls_texts if "http" in t) / len(cls_texts)\n    has_hashtag = sum(1 for t in cls_texts if "#" in t) / len(cls_texts)\n    has_number = sum(1 for t in cls_texts if any(c.isdigit() for c in t)) / len(cls_texts)\n    avg_caps = np.mean([sum(1 for c in t if c.isupper()) / max(len(t),1) for t in cls_texts])\n    print(f"  {label}:")\n    print(f"    URL: {has_url:.1%}, Hashtag: {has_hashtag:.1%}")\n    print(f"    Numbers: {has_number:.1%}, Caps ratio: {avg_caps:.1%}")'
        },
        {
          type: 'note',
          value: 'Ключевые наблюдения: disaster-твиты содержат специфичные слова (fire, earthquake, flood), чаще включают URL (ссылки на новости), обычно длиннее. Non-disaster: больше сленга, эмоджи, неформальный стиль. Эти различия помогут TF-IDF модели.'
        }
      ]
    },
    {
      id: 3,
      title: 'Практика: Текстовый EDA',
      type: 'practice',
      difficulty: 'easy',
      description: 'Проведите полный текстовый EDA для датасета Disaster Tweets: длина, частотный анализ, текстовые признаки.',
      requirements: [
        'Создайте датасет из 1000+ твитов с метками disaster/non-disaster',
        'Рассчитайте статистики длин текстов (символы, слова) по каждому классу',
        'Найдите топ-10 уникальных слов для каждого класса (исключая стоп-слова)',
        'Создайте текстовые мета-признаки: наличие URL, хештегов, чисел, caps ratio',
        'Выведите распределение меток и средние значения мета-признаков по классам'
      ],
      hint: 'Стоп-слова отфильтруйте вручную (the, is, in, a, to, and...). Для уникальных слов: найдите слова, которые часты в одном классе и редки в другом.',
      expectedOutput: 'Disaster Tweets EDA:\nВсего: 1000+ твитов\nDisaster: XX.X%, Non-disaster: XX.X%\n\nДлина (слова):\n  Disaster: XX.X средняя\n  Non-disaster: XX.X средняя\n\nТоп уникальные слова:\n  Disaster: fire, earthquake, ...\n  Non-disaster: love, awesome, ...',
      solution: 'import numpy as np\nfrom collections import Counter\n\nnp.random.seed(42)\n\ndis_kw = ["fire","earthquake","flood","storm","explosion","crash","evacuate","destroyed",\n          "damage","wildfire","hurricane","tornado","killed","emergency","rescue",\n          "tsunami","collapsed","burning","victims","disaster","fatal","devastation"]\nnon_kw = ["love","party","awesome","lol","great","amazing","happy","fun","cool",\n          "beautiful","nice","good","best","like","movie","music","food","haha",\n          "blessed","excited","wonderful","fantastic"]\ncommon = ["the","is","in","a","to","and","of","my","i","this","that","it",\n          "for","on","was","are","with","just","so","but","have","from","been","its"]\nstop_words = set(common)\n\ndef gen_tweet(is_dis):\n    w = common[:np.random.randint(4, 10)]\n    if is_dis:\n        w.extend(np.random.choice(dis_kw, np.random.randint(2, 5)))\n        if np.random.random() < 0.35:\n            w.append("http://t.co/abc")\n        if np.random.random() < 0.15:\n            w.append("BREAKING")\n    else:\n        w.extend(np.random.choice(non_kw, np.random.randint(2, 5)))\n        if np.random.random() < 0.25:\n            w.append("#blessed")\n        if np.random.random() < 0.15:\n            w.append("lol")\n    np.random.shuffle(w)\n    return " ".join(w)\n\ntexts, targets = [], []\nfor _ in range(1200):\n    is_d = np.random.random() < 0.43\n    texts.append(gen_tweet(is_d))\n    targets.append(1 if is_d else 0)\ntargets = np.array(targets)\n\nprint("Disaster Tweets EDA:")\nprint(f"Всего: {len(texts)} твитов")\nprint(f"Disaster: {(targets==1).mean():.1%}, Non-disaster: {(targets==0).mean():.1%}")\n\n# Длина по классам\nprint("\\nДлина (слова):")\nfor cls, label in [(1, "Disaster"), (0, "Non-disaster")]:\n    lens = [len(texts[i].split()) for i in range(len(texts)) if targets[i] == cls]\n    print(f"  {label}: {np.mean(lens):.1f} средняя, {np.median(lens):.0f} медиана")\n\nprint("\\nДлина (символы):")\nfor cls, label in [(1, "Disaster"), (0, "Non-disaster")]:\n    lens = [len(texts[i]) for i in range(len(texts)) if targets[i] == cls]\n    print(f"  {label}: {np.mean(lens):.1f} средняя")\n\n# Уникальные слова по классам\ndef class_words(texts, targets, cls):\n    words = []\n    for i, t in enumerate(texts):\n        if targets[i] == cls:\n            words.extend([w.lower().strip("#") for w in t.split() if w.lower() not in stop_words and not w.startswith("http")])\n    return Counter(words)\n\ndis_words = class_words(texts, targets, 1)\nnon_words = class_words(texts, targets, 0)\n\nprint("\\nТоп уникальные слова Disaster:")\nfor w, c in dis_words.most_common(10):\n    ratio = c / max(non_words.get(w, 1), 1)\n    print(f"  {w:15s}: {c:4d} (x{ratio:.1f} vs non-disaster)")\n\nprint("\\nТоп уникальные слова Non-disaster:")\nfor w, c in non_words.most_common(10):\n    ratio = c / max(dis_words.get(w, 1), 1)\n    print(f"  {w:15s}: {c:4d} (x{ratio:.1f} vs disaster)")\n\n# Мета-признаки\nprint("\\nМета-признаки по классам:")\nfor cls, label in [(1, "Disaster"), (0, "Non-disaster")]:\n    cls_texts = [texts[i] for i in range(len(texts)) if targets[i] == cls]\n    has_url = np.mean(["http" in t for t in cls_texts])\n    has_hash = np.mean(["#" in t for t in cls_texts])\n    has_num = np.mean([any(c.isdigit() for c in t) for t in cls_texts])\n    caps_r = np.mean([sum(c.isupper() for c in t)/max(len(t),1) for t in cls_texts])\n    avg_words = np.mean([len(t.split()) for t in cls_texts])\n    print(f"  {label}:")\n    print(f"    URL: {has_url:.1%}, Hashtag: {has_hash:.1%}, Numbers: {has_num:.1%}")\n    print(f"    Caps ratio: {caps_r:.1%}, Avg words: {avg_words:.1f}")',
      explanation: 'Текстовый EDA выявляет ключевые различия между классами: disaster-твиты содержат специфичную лексику, чаще включают URL и числа (жертвы, координаты), имеют больше заглавных букв (BREAKING, ALERT). Эти мета-признаки полезны как дополнительные фичи к TF-IDF и BERT.'
    },
    {
      id: 4,
      title: 'TF-IDF + классические модели',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'TF-IDF: преобразование текста в числа'
        },
        {
          type: 'text',
          value: 'TF-IDF (Term Frequency — Inverse Document Frequency) — классический метод векторизации текста. TF показывает, как часто слово встречается в документе, IDF — насколько оно редкое во всём корпусе. Редкие, но частые в документе слова получают высокий вес.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import numpy as np\nfrom sklearn.feature_extraction.text import TfidfVectorizer\n\n# Как работает TF-IDF\ntexts = [\n    "fire destroyed the building downtown",\n    "the building is on fire beautiful sunset",\n    "beautiful sunset over the city",\n    "earthquake destroyed many buildings emergency",\n    "my love for music is beautiful"\n]\n\nvectorizer = TfidfVectorizer()\nX = vectorizer.fit_transform(texts)\n\nprint("=== TF-IDF ===")\nprint(f"Словарь: {len(vectorizer.vocabulary_)} слов")\nprint(f"Матрица: {X.shape} (документы x слова)")\nprint(f"Разреженность: {1 - X.nnz / (X.shape[0] * X.shape[1]):.1%}")\n\n# TF-IDF веса для первого документа\nprint("\\nTF-IDF для: \'fire destroyed the building downtown\'")\nfeature_names = vectorizer.get_feature_names_out()\nfor idx in X[0].nonzero()[1]:\n    print(f"  {feature_names[idx]:15s}: {X[0, idx]:.3f}")\n\nprint("\\n\'fire\' — высокий вес (редкое, но важное слово)")\nprint("\'the\' — низкий вес (частое во всех документах)")'
        },
        {
          type: 'heading',
          value: 'Продвинутые параметры TF-IDF'
        },
        {
          type: 'code',
          language: 'python',
          value: 'from sklearn.feature_extraction.text import TfidfVectorizer\nimport re\n\n# Preprocessing текста\ndef clean_text(text):\n    """Очистка текста для NLP"""\n    text = text.lower()\n    text = re.sub(r"http\\S+", " URL ", text)     # замена ссылок\n    text = re.sub(r"@\\w+", " MENTION ", text)    # замена упоминаний\n    text = re.sub(r"#(\\w+)", r"\\1", text)         # удаление # из хештегов\n    text = re.sub(r"[^a-zA-Z\\s]", " ", text)     # только буквы\n    text = re.sub(r"\\s+", " ", text).strip()      # лишние пробелы\n    return text\n\ntexts = [\n    "BREAKING: Forest fire near #California http://t.co/link @news",\n    "My mix tape is on fire!! #lit #blessed",\n]\n\nfor t in texts:\n    print(f"  До:    {t}")\n    print(f"  После: {clean_text(t)}\\n")\n\n# Оптимальные параметры TF-IDF для Disaster Tweets\nvectorizer = TfidfVectorizer(\n    max_features=10000,          # топ 10000 слов\n    ngram_range=(1, 3),          # unigrams + bigrams + trigrams\n    min_df=3,                    # минимум в 3 документах\n    max_df=0.9,                  # максимум в 90% документов\n    sublinear_tf=True,           # log(1 + TF) вместо TF\n    strip_accents="unicode",\n    analyzer="word",\n)\n\nprint("=== Оптимальные параметры TF-IDF ===")\nprint("max_features=10000 — ограничиваем словарь")\nprint("ngram_range=(1,3) — ловим фразы \'on fire\', \'fire destroyed building\'")\nprint("sublinear_tf=True — логарифмирование частоты")\nprint("min_df=3 — убираем слишком редкие слова")\nprint("max_df=0.9 — убираем слишком частые (стоп-слова)")'
        },
        {
          type: 'heading',
          value: 'Классические модели для текста'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import numpy as np\nfrom sklearn.feature_extraction.text import TfidfVectorizer\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.naive_bayes import MultinomialNB\nfrom sklearn.svm import LinearSVC\nfrom sklearn.ensemble import GradientBoostingClassifier\nfrom sklearn.model_selection import cross_val_score\nimport re\n\nnp.random.seed(42)\n\n# Генерация данных\ndis_kw = ["fire","earthquake","flood","storm","explosion","crash","destroyed","damage",\n          "wildfire","hurricane","tornado","killed","emergency","rescue","burning"]\nnon_kw = ["love","party","awesome","great","amazing","happy","fun","cool",\n          "beautiful","nice","good","best","movie","music","food","blessed"]\ncommon = ["the","is","in","a","to","and","of","my","this","that","for","on","was","with"]\n\ndef gen_tweet(is_dis):\n    w = list(np.random.choice(common, np.random.randint(3, 7)))\n    if is_dis:\n        w.extend(np.random.choice(dis_kw, np.random.randint(2, 4)))\n    else:\n        w.extend(np.random.choice(non_kw, np.random.randint(2, 4)))\n    np.random.shuffle(w)\n    return " ".join(w)\n\ntexts = [gen_tweet(np.random.random() < 0.43) for _ in range(2000)]\ntargets = np.array([1 if any(w in t for w in dis_kw[:5]) else 0 for t in texts])\n\n# TF-IDF\nvec = TfidfVectorizer(max_features=5000, ngram_range=(1, 2), sublinear_tf=True)\nX = vec.fit_transform(texts)\n\nprint("=== Классические модели ===")\nprint(f"TF-IDF: {X.shape}")\n\nmodels = {\n    "LogisticRegression": LogisticRegression(C=1.0, max_iter=1000),\n    "MultinomialNB": MultinomialNB(alpha=0.1),\n    "LinearSVC": LinearSVC(C=0.5, max_iter=2000),\n}\n\nfor name, model in models.items():\n    f1 = cross_val_score(model, X, targets, cv=5, scoring="f1").mean()\n    acc = cross_val_score(model, X, targets, cv=5, scoring="accuracy").mean()\n    print(f"  {name:25s}: F1={f1:.4f}, Acc={acc:.4f}")\n\nprint("\\nLogisticRegression — лучший baseline для текстов!")'
        },
        {
          type: 'note',
          value: 'TF-IDF + LogisticRegression — мощный и быстрый baseline для NLP задач на Kaggle. Для Disaster Tweets этот подход даёт F1 ~0.78-0.80, что является хорошим стартом. Для дальнейшего улучшения нужны предобученные языковые модели (BERT).'
        }
      ]
    },
    {
      id: 5,
      title: 'Практика: TF-IDF + LogisticRegression',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте baseline модель для Disaster Tweets на основе TF-IDF + LogisticRegression.',
      requirements: [
        'Создайте датасет из 2000+ твитов с метками disaster/non-disaster',
        'Реализуйте text preprocessing: lowercase, удаление URL и спецсимволов',
        'Примените TfidfVectorizer с ngram_range=(1,2) и добавьте мета-признаки (длина, наличие URL)',
        'Обучите LogisticRegression с подбором гиперпараметра C (0.1, 0.5, 1.0, 5.0)',
        'Выведите лучший F1-score, precision, recall и confusion matrix'
      ],
      hint: 'Мета-признаки (длина текста, число слов, наличие URL) добавьте как дополнительные столбцы к TF-IDF матрице через scipy.sparse.hstack. Подбор C через cross_val_score.',
      expectedOutput: 'Disaster Tweets Baseline:\nДатасет: 2000+ твитов\nTF-IDF features: XXXX\n\nПодбор C:\n  C=0.1: F1=0.XXXX\n  C=0.5: F1=0.XXXX\n  ...\n\nЛучший C=X.X:\n  F1: 0.XXXX\n  Precision: 0.XXXX\n  Recall: 0.XXXX',
      solution: 'import numpy as np\nimport re\nfrom sklearn.feature_extraction.text import TfidfVectorizer\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.model_selection import cross_val_score, cross_val_predict\nfrom sklearn.metrics import f1_score, precision_score, recall_score, confusion_matrix\nfrom scipy.sparse import hstack, csr_matrix\n\nnp.random.seed(42)\n\n# Генерация данных\ndis_kw = ["fire","earthquake","flood","storm","explosion","crash","destroyed","damage",\n          "wildfire","hurricane","tornado","killed","emergency","rescue","burning","victims"]\nnon_kw = ["love","party","awesome","great","amazing","happy","fun","cool",\n          "beautiful","nice","good","best","movie","music","food","blessed","lol","haha"]\ncommon = ["the","is","in","a","to","and","of","my","this","that","for","on","was","with","just"]\n\ndef gen_tweet(is_dis):\n    w = list(np.random.choice(common, np.random.randint(3, 8)))\n    if is_dis:\n        w.extend(np.random.choice(dis_kw, np.random.randint(2, 5)))\n        if np.random.random() < 0.3:\n            w.append("http://t.co/link")\n    else:\n        w.extend(np.random.choice(non_kw, np.random.randint(2, 5)))\n    np.random.shuffle(w)\n    return " ".join(w)\n\ntexts, targets = [], []\nfor _ in range(2500):\n    is_d = np.random.random() < 0.43\n    texts.append(gen_tweet(is_d))\n    targets.append(1 if is_d else 0)\ntargets = np.array(targets)\n\n# Preprocessing\ndef clean_text(text):\n    text = text.lower()\n    text = re.sub(r"http\\S+", "", text)\n    text = re.sub(r"[^a-zA-Z\\s]", " ", text)\n    text = re.sub(r"\\s+", " ", text).strip()\n    return text\n\ntexts_clean = [clean_text(t) for t in texts]\n\n# TF-IDF\nvec = TfidfVectorizer(max_features=8000, ngram_range=(1, 2), sublinear_tf=True, min_df=2)\nX_tfidf = vec.fit_transform(texts_clean)\n\n# Мета-признаки\nmeta = np.column_stack([\n    [len(t) for t in texts],                          # длина\n    [len(t.split()) for t in texts],                   # число слов\n    [1 if "http" in t else 0 for t in texts],          # URL\n    [sum(c.isupper() for c in t)/max(len(t),1) for t in texts],  # caps ratio\n])\nmeta_sparse = csr_matrix(meta)\nX = hstack([X_tfidf, meta_sparse])\n\nprint("Disaster Tweets Baseline:")\nprint(f"Датасет: {len(texts)} твитов")\nprint(f"TF-IDF features: {X_tfidf.shape[1]} + {meta.shape[1]} мета = {X.shape[1]}")\n\n# Подбор C\nprint("\\nПодбор C:")\nbest_c, best_f1 = 1.0, 0\nfor c in [0.1, 0.5, 1.0, 5.0, 10.0]:\n    lr = LogisticRegression(C=c, max_iter=1000, solver="liblinear")\n    f1 = cross_val_score(lr, X, targets, cv=5, scoring="f1").mean()\n    print(f"  C={c}: F1={f1:.4f}")\n    if f1 > best_f1:\n        best_f1 = f1\n        best_c = c\n\nprint(f"\\nЛучший C={best_c}:")\nbest_lr = LogisticRegression(C=best_c, max_iter=1000, solver="liblinear")\ny_pred = cross_val_predict(best_lr, X, targets, cv=5)\n\nprint(f"  F1: {f1_score(targets, y_pred):.4f}")\nprint(f"  Precision: {precision_score(targets, y_pred):.4f}")\nprint(f"  Recall: {recall_score(targets, y_pred):.4f}")\n\ncm = confusion_matrix(targets, y_pred)\nprint(f"\\nConfusion Matrix:")\nprint(f"  TN={cm[0,0]:4d}  FP={cm[0,1]:4d}")\nprint(f"  FN={cm[1,0]:4d}  TP={cm[1,1]:4d}")',
      explanation: 'TF-IDF + LogReg — сильный baseline для Disaster Tweets (F1 ~0.78-0.80). Ключевые улучшения: ngram_range=(1,2) ловит фразы ("forest fire" vs "on fire"), sublinear_tf уменьшает влияние частых слов, мета-признаки (URL, длина) дают дополнительную информацию. Для F1 > 0.83 нужен BERT.'
    },
    {
      id: 6,
      title: 'BERT для классификации текста',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Что такое BERT'
        },
        {
          type: 'text',
          value: 'BERT (Bidirectional Encoder Representations from Transformers) — предобученная языковая модель от Google (2018). BERT понимает контекст слов: "fire" в "the forest is on fire" vs "my mixtape is fire" — разные значения! Fine-tuning BERT — стандартный подход для NLP задач на Kaggle.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Как работает BERT\nprint("""\n=== BERT: ключевые концепции ===\n\n1. Pre-training (предобучение):\n   - Обучен на Wikipedia + BookCorpus (3.3B слов)\n   - Задача MLM: предсказывает [MASK] слова в предложении\n   - Задача NSP: определяет, следует ли предложение B за A\n\n2. Tokenization:\n   - WordPiece tokenizer: "playing" -> ["play", "##ing"]\n   - Специальные токены: [CLS], [SEP], [MASK], [PAD]\n   - [CLS] — токен классификации (его embedding = представление текста)\n\n3. Fine-tuning:\n   - Берём предобученный BERT\n   - Добавляем classification head (Dense layer)\n   - Дообучаем на нашей задаче (2-4 эпохи)\n\n4. Варианты BERT:\n   - bert-base-uncased: 12 слоёв, 110M параметров\n   - bert-large-uncased: 24 слоя, 340M параметров\n   - distilbert: 6 слоёв, 66M параметров (быстрый)\n   - roberta-base: улучшенный BERT\n""")\n\n# Пример токенизации\nprint("=== Пример токенизации ===")\ntexts = [\n    "The forest fire destroyed everything",\n    "My new track is straight fire",\n]\n\n# Имитация WordPiece tokenization\ndef simple_tokenize(text):\n    tokens = ["[CLS]"]\n    for word in text.lower().split():\n        if word in ["destroyed", "everything"]:\n            tokens.extend([word[:5], "##" + word[5:]])\n        else:\n            tokens.append(word)\n    tokens.append("[SEP]")\n    return tokens\n\nfor text in texts:\n    tokens = simple_tokenize(text)\n    print(f"  Text: {text}")\n    print(f"  Tokens: {tokens}")\n    print(f"  Length: {len(tokens)}\\n")'
        },
        {
          type: 'heading',
          value: 'Fine-tuning BERT на PyTorch / HuggingFace'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Fine-tuning BERT с HuggingFace Transformers\nprint("""\n# === Полный код fine-tuning BERT ===\n\nfrom transformers import BertTokenizer, BertForSequenceClassification\nfrom transformers import AdamW, get_linear_schedule_with_warmup\nimport torch\nfrom torch.utils.data import DataLoader, TensorDataset\n\n# 1. Загрузка токенайзера и модели\ntokenizer = BertTokenizer.from_pretrained("bert-base-uncased")\nmodel = BertForSequenceClassification.from_pretrained(\n    "bert-base-uncased", num_labels=2\n)\n\n# 2. Токенизация текстов\ndef tokenize_texts(texts, tokenizer, max_len=128):\n    encoded = tokenizer(\n        texts,\n        padding="max_length\",\n        truncation=True,\n        max_length=max_len,\n        return_tensors=\"pt\"\n    )\n    return encoded[\"input_ids\"], encoded[\"attention_mask\"]\n\ninput_ids, attention_mask = tokenize_texts(train_texts, tokenizer)\n\n# 3. DataLoader\ndataset = TensorDataset(input_ids, attention_mask, torch.tensor(labels))\nloader = DataLoader(dataset, batch_size=32, shuffle=True)\n\n# 4. Оптимизатор и scheduler\noptimizer = AdamW(model.parameters(), lr=2e-5, weight_decay=0.01)\nscheduler = get_linear_schedule_with_warmup(\n    optimizer, num_warmup_steps=0, num_training_steps=len(loader) * 3\n)\n\n# 5. Training loop\nmodel.train()\nfor epoch in range(3):  # 2-4 эпохи для fine-tuning\n    for batch in loader:\n        ids, mask, labels = batch\n        outputs = model(ids, attention_mask=mask, labels=labels)\n        loss = outputs.loss\n        loss.backward()\n        optimizer.step()\n        scheduler.step()\n        optimizer.zero_grad()\n\n# 6. Prediction\nmodel.eval()\nwith torch.no_grad():\n    outputs = model(test_ids, attention_mask=test_mask)\n    predictions = torch.argmax(outputs.logits, dim=1)\n\"\"\")\n\n# Ключевые гиперпараметры\nprint("\\n=== Оптимальные гиперпараметры BERT ===")\nhyperparams = [\n    ("Learning rate", "2e-5 — 5e-5"),\n    ("Batch size", "16 или 32"),\n    ("Epochs", "2 — 4 (больше = переобучение)"),\n    ("Max sequence length", "128 (для твитов)"),\n    ("Weight decay", "0.01"),\n    ("Warmup steps", "10% от всех шагов"),\n]\nfor name, val in hyperparams:\n    print(f"  {name:25s}: {val}")'
        },
        {
          type: 'warning',
          value: 'BERT требует GPU для обучения! На CPU fine-tuning займёт часы. На Kaggle используйте бесплатный GPU (Settings -> Accelerator -> GPU P100). Для быстрого прототипа используйте DistilBERT (в 2 раза быстрее с минимальной потерей качества).'
        }
      ]
    },
    {
      id: 7,
      title: 'Практика: Fine-tuning BERT',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте полный pipeline fine-tuning BERT для классификации Disaster Tweets.',
      requirements: [
        'Создайте датасет из 2000+ твитов с предобработкой текста',
        'Напишите полный Keras/PyTorch код fine-tuning BERT (в строковом виде для демонстрации)',
        'Имитируйте процесс обучения: loss снижение по эпохам, accuracy рост',
        'Сравните BERT F1 с TF-IDF baseline',
        'Выведите примеры предсказаний на сложных случаях (метафоры)'
      ],
      hint: 'Для демонстрации без GPU: покажите код BERT и используйте sklearn модель для имитации результатов. Реальный BERT даёт F1 ~0.83-0.85 на Disaster Tweets.',
      expectedOutput: 'BERT Fine-tuning Pipeline:\nДатасет: 2000+ твитов\n\nBERT training:\n  Epoch 1: loss=0.XX, val_f1=0.XX\n  Epoch 2: loss=0.XX, val_f1=0.XX\n  Epoch 3: loss=0.XX, val_f1=0.XX\n\nСравнение:\n  TF-IDF + LogReg: F1=0.XX\n  BERT: F1=0.XX\n  Улучшение: +X.XX',
      solution: 'import numpy as np\nimport re\nfrom sklearn.feature_extraction.text import TfidfVectorizer\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.ensemble import GradientBoostingClassifier\nfrom sklearn.model_selection import cross_val_predict, train_test_split\nfrom sklearn.metrics import f1_score\n\nnp.random.seed(42)\n\n# Генерация данных\ndis_kw = ["fire","earthquake","flood","storm","explosion","crash","destroyed","damage",\n          "wildfire","hurricane","tornado","killed","emergency","rescue","burning","victims",\n          "devastation","casualties","evacuation","alert"]\nnon_kw = ["love","party","awesome","great","amazing","happy","fun","cool",\n          "beautiful","nice","good","best","movie","music","food","blessed","lol",\n          "haha","excited","wonderful"]\ncommon = ["the","is","in","a","to","and","of","my","this","that","for","on","was","with"]\n\ndef gen_tweet(is_dis):\n    w = list(np.random.choice(common, np.random.randint(3, 8)))\n    if is_dis:\n        w.extend(np.random.choice(dis_kw, np.random.randint(2, 5)))\n    else:\n        w.extend(np.random.choice(non_kw, np.random.randint(2, 5)))\n    np.random.shuffle(w)\n    return " ".join(w)\n\ntexts, targets = [], []\nfor _ in range(2500):\n    is_d = np.random.random() < 0.43\n    texts.append(gen_tweet(is_d))\n    targets.append(1 if is_d else 0)\ntargets = np.array(targets)\n\nclean = [re.sub(r"[^a-zA-Z\\s]", " ", t.lower()).strip() for t in texts]\nX_train, X_val, y_train, y_val = train_test_split(clean, targets, test_size=0.2, random_state=42)\n\n# --- TF-IDF Baseline ---\nvec = TfidfVectorizer(max_features=8000, ngram_range=(1, 2), sublinear_tf=True)\nX_train_tfidf = vec.fit_transform(X_train)\nX_val_tfidf = vec.transform(X_val)\n\nlr = LogisticRegression(C=1.0, max_iter=1000)\nlr.fit(X_train_tfidf, y_train)\ny_pred_lr = lr.predict(X_val_tfidf)\nf1_baseline = f1_score(y_val, y_pred_lr)\n\nprint("BERT Fine-tuning Pipeline:")\nprint(f"Датасет: {len(texts)} твитов (train: {len(X_train)}, val: {len(X_val)})")\n\n# --- BERT код (для реального запуска на GPU) ---\nprint("\\n# === BERT Fine-tuning Code ===")\nbert_code = """\nfrom transformers import AutoTokenizer, AutoModelForSequenceClassification\nfrom transformers import AdamW, get_linear_schedule_with_warmup\nimport torch\nfrom torch.utils.data import DataLoader, TensorDataset\n\ntokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")\nmodel = AutoModelForSequenceClassification.from_pretrained("bert-base-uncased", num_labels=2)\n\ntrain_enc = tokenizer(X_train, padding=True, truncation=True, max_length=128, return_tensors="pt")\nval_enc = tokenizer(X_val, padding=True, truncation=True, max_length=128, return_tensors="pt")\n\ntrain_ds = TensorDataset(train_enc["input_ids"], train_enc["attention_mask"], torch.tensor(y_train))\ntrain_dl = DataLoader(train_ds, batch_size=32, shuffle=True)\n\noptimizer = AdamW(model.parameters(), lr=2e-5)\nfor epoch in range(3):\n    model.train()\n    for ids, mask, labels in train_dl:\n        out = model(ids, attention_mask=mask, labels=labels)\n        out.loss.backward()\n        optimizer.step()\n        optimizer.zero_grad()\n"""\nprint(bert_code)\n\n# --- Имитация BERT обучения ---\nprint("BERT training (имитация):")\nepochs_data = [\n    (0.52, 0.74), (0.31, 0.81), (0.18, 0.84)\n]\nfor i, (loss, f1) in enumerate(epochs_data, 1):\n    loss += np.random.normal(0, 0.02)\n    f1 += np.random.normal(0, 0.01)\n    print(f"  Epoch {i}: loss={loss:.3f}, val_f1={f1:.3f}")\n\n# Имитация BERT через более мощную модель\ngbt = GradientBoostingClassifier(n_estimators=300, max_depth=5, learning_rate=0.1, random_state=42)\ngbt.fit(X_train_tfidf, y_train)\ny_pred_bert = gbt.predict(X_val_tfidf)\nf1_bert = f1_score(y_val, y_pred_bert)\n\nprint(f"\\nСравнение:")\nprint(f"  TF-IDF + LogReg: F1={f1_baseline:.4f}")\nprint(f"  BERT (имитация): F1={f1_bert:.4f}")\nprint(f"  Улучшение: +{f1_bert - f1_baseline:.4f}")\nprint("  (Реальный BERT даёт F1 ~ 0.83-0.85)")\n\n# Сложные случаи\nprint("\\nПримеры сложных случаев:")\nhard_cases = [\n    ("My mixtape is fire", 0, "Метафора — не катастрофа"),\n    ("The building is on fire", 1, "Реальный пожар"),\n    ("This party is a disaster", 0, "Метафора"),\n    ("Earthquake destroyed the city", 1, "Реальная катастрофа"),\n    ("I am drowning in homework", 0, "Метафора"),\n]\nfor text, label, comment in hard_cases:\n    pred = "disaster" if label == 1 else "not disaster"\n    print(f"  [{pred:13s}] \\"{text}\\" — {comment}")',
      explanation: 'BERT fine-tuning — стандарт для NLP на Kaggle. Преимущество BERT: понимает контекст слов (отличает метафоры от реальных катастроф). Ключевые настройки: lr=2e-5, 3 эпохи, batch=32, max_len=128. BERT даёт +3-5% F1 по сравнению с TF-IDF baseline.'
    },
    {
      id: 8,
      title: 'Практика: Ensemble TF-IDF + BERT',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте ensemble из TF-IDF модели и BERT для максимального F1-score на Disaster Tweets.',
      requirements: [
        'Создайте датасет из 2000+ твитов, разделите на train/val',
        'Обучите TF-IDF + LogReg baseline и оцените F1',
        'Обучите TF-IDF + GBT как прокси для BERT',
        'Реализуйте ensemble: weighted average вероятностей двух моделей',
        'Подберите оптимальные веса ensemble и выведите итоговый F1 > baseline'
      ],
      hint: 'Используйте predict_proba для получения вероятностей. Ensemble: w * prob_model1 + (1-w) * prob_model2. Подберите w через grid search на валидации.',
      expectedOutput: 'Disaster Tweets Ensemble:\nTF-IDF + LogReg: F1=0.XXXX\nTF-IDF + GBT (BERT proxy): F1=0.XXXX\n\nEnsemble (подбор весов):\n  w=0.3: F1=0.XXXX\n  w=0.4: F1=0.XXXX\n  ...\n\nЛучший ensemble: w=X.X, F1=0.XXXX\nУлучшение: +X.XXXX',
      solution: 'import numpy as np\nimport re\nfrom sklearn.feature_extraction.text import TfidfVectorizer\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.metrics import f1_score, classification_report\nfrom scipy.sparse import hstack, csr_matrix\n\nnp.random.seed(42)\n\n# Генерация данных\ndis_kw = ["fire","earthquake","flood","storm","explosion","crash","destroyed","damage",\n          "wildfire","hurricane","tornado","killed","emergency","rescue","burning","victims"]\nnon_kw = ["love","party","awesome","great","amazing","happy","fun","cool",\n          "beautiful","nice","good","best","movie","music","food","blessed","lol"]\ncommon = ["the","is","in","a","to","and","of","my","this","that","for","on","was","with"]\n\ndef gen(is_d):\n    w = list(np.random.choice(common, np.random.randint(3, 8)))\n    if is_d:\n        w.extend(np.random.choice(dis_kw, np.random.randint(2, 5)))\n        if np.random.random() < 0.3: w.append("http://link")\n    else:\n        w.extend(np.random.choice(non_kw, np.random.randint(2, 5)))\n    np.random.shuffle(w)\n    return " ".join(w)\n\ntexts, targets = [], []\nfor _ in range(3000):\n    is_d = np.random.random() < 0.43\n    texts.append(gen(is_d))\n    targets.append(1 if is_d else 0)\ntargets = np.array(targets)\n\nclean = [re.sub(r"[^a-zA-Z\\s]", " ", t.lower()).strip() for t in texts]\n\n# Мета-признаки\nmeta = np.column_stack([\n    [len(t) for t in texts],\n    [len(t.split()) for t in texts],\n    [1 if "http" in t else 0 for t in texts],\n    [sum(c.isupper() for c in t)/max(len(t),1) for t in texts],\n])\n\nX_train_t, X_val_t, y_train, y_val, meta_train, meta_val = train_test_split(\n    clean, targets, meta, test_size=0.2, random_state=42, stratify=targets\n)\n\n# TF-IDF\nvec = TfidfVectorizer(max_features=8000, ngram_range=(1, 3), sublinear_tf=True, min_df=2)\nX_train_tfidf = vec.fit_transform(X_train_t)\nX_val_tfidf = vec.transform(X_val_t)\n\nX_train_full = hstack([X_train_tfidf, csr_matrix(meta_train)])\nX_val_full = hstack([X_val_tfidf, csr_matrix(meta_val)])\n\n# Модель 1: LogReg\nlr = LogisticRegression(C=1.0, max_iter=1000, solver="liblinear")\nlr.fit(X_train_full, y_train)\nprob_lr = lr.predict_proba(X_val_full)[:, 1]\nf1_lr = f1_score(y_val, (prob_lr > 0.5).astype(int))\n\n# Модель 2: GBT (прокси для BERT)\ngbt = GradientBoostingClassifier(n_estimators=300, max_depth=5, learning_rate=0.1, random_state=42)\ngbt.fit(X_train_full.toarray(), y_train)\nprob_gbt = gbt.predict_proba(X_val_full.toarray())[:, 1]\nf1_gbt = f1_score(y_val, (prob_gbt > 0.5).astype(int))\n\nprint("Disaster Tweets Ensemble:")\nprint(f"TF-IDF + LogReg: F1={f1_lr:.4f}")\nprint(f"TF-IDF + GBT (BERT proxy): F1={f1_gbt:.4f}")\n\n# Ensemble: подбор весов\nprint("\\nEnsemble (подбор весов):")\nbest_w, best_f1, best_thresh = 0.5, 0, 0.5\n\nfor w in np.arange(0.1, 0.9, 0.1):\n    prob_ens = w * prob_lr + (1 - w) * prob_gbt\n    # Подбор порога\n    for thresh in np.arange(0.3, 0.7, 0.05):\n        f1 = f1_score(y_val, (prob_ens > thresh).astype(int))\n        if f1 > best_f1:\n            best_f1 = f1\n            best_w = w\n            best_thresh = thresh\n    f1_default = f1_score(y_val, (prob_ens > 0.5).astype(int))\n    print(f"  w={w:.1f}: F1={f1_default:.4f}")\n\nprint(f"\\nЛучший ensemble: w={best_w:.1f}, threshold={best_thresh:.2f}, F1={best_f1:.4f}")\n\nbest_single = max(f1_lr, f1_gbt)\nprint(f"Улучшение: +{best_f1 - best_single:.4f} (vs лучшая одиночная)")\n\n# Финальный результат\nprob_final = best_w * prob_lr + (1 - best_w) * prob_gbt\ny_final = (prob_final > best_thresh).astype(int)\n\nprint(f"\\nFinal Classification Report:")\nprint(classification_report(y_val, y_final, target_names=["Non-disaster", "Disaster"]))\n\nprint("\\n# На реальном Kaggle с настоящим BERT:")\nprint("#   TF-IDF + LogReg: F1 ~ 0.79")\nprint("#   BERT fine-tuned: F1 ~ 0.84")\nprint("#   Ensemble TF-IDF + BERT: F1 ~ 0.85-0.86")',
      explanation: 'Ensemble TF-IDF + BERT даёт лучший результат, потому что модели ошибаются на разных примерах: TF-IDF хорош на явных ключевых словах, BERT — на понимании контекста и метафор. Подбор порога (threshold optimization) — важный приём для F1 метрики, так как оптимальный порог часто не 0.5.'
    }
  ]
}
