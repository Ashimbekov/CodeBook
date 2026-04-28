export default {
  id: 22,
  title: 'Transfer Learning и Fine-tuning',
  description: 'Перенос обучения: использование предобученных моделей, fine-tuning, feature extraction, практические примеры.',
  lessons: [
    {
      id: 1,
      title: 'Что такое Transfer Learning',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Перенос знаний из предобученных моделей' },
        { type: 'text', value: 'Transfer Learning — использование модели, обученной на одной задаче, для решения другой. Вместо обучения с нуля берём модель, обученную на миллионах изображений (ImageNet) или текстов, и адаптируем под свою задачу. Это экономит время, данные и вычислительные ресурсы.' },
        { type: 'code', language: 'python', value: 'import tensorflow as tf\nfrom tensorflow.keras import layers, Sequential, Model\nfrom tensorflow.keras.applications import MobileNetV2\n\n# Загрузка предобученной MobileNetV2 (обучена на ImageNet — 1.4M изображений)\nbase_model = MobileNetV2(\n    weights="imagenet",       # предобученные веса\n    include_top=False,        # без последнего классификатора\n    input_shape=(224, 224, 3)\n)\n\nprint(f"Параметров в base_model: {base_model.count_params():,}")\n\n# Замораживаем веса базовой модели\nbase_model.trainable = False\n\n# Добавляем свой классификатор сверху\nmodel = Sequential([\n    base_model,\n    layers.GlobalAveragePooling2D(),\n    layers.Dense(128, activation="relu"),\n    layers.Dropout(0.5),\n    layers.Dense(5, activation="softmax")  # 5 наших классов\n])\n\nmodel.compile(optimizer="adam", loss="sparse_categorical_crossentropy", metrics=["accuracy"])\nmodel.summary()\n\nprint("\\nTransfer Learning стратегии:")\nprint("1. Feature Extraction: замороженная база + свой классификатор")\nprint("2. Fine-tuning: разморозить верхние слои базы + дообучить")\nprint("3. Full training: разморозить всю базу (нужно много данных)")' },
        { type: 'tip', value: 'Transfer Learning особенно полезен, когда у вас мало данных (100-1000 изображений). Предобученная модель уже "знает" как выглядят грани, текстуры, формы.' }
      ]
    },
    {
      id: 2,
      title: 'Feature Extraction',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Извлечение признаков предобученной моделью' },
        { type: 'code', language: 'python', value: 'import tensorflow as tf\nfrom tensorflow.keras import layers, Sequential\nfrom tensorflow.keras.applications import MobileNetV2\nfrom tensorflow.keras.applications.mobilenet_v2 import preprocess_input\nimport numpy as np\n\n# Генерируем синтетические данные (имитация)\nnp.random.seed(42)\nn_samples = 200\nX = np.random.rand(n_samples, 224, 224, 3).astype("float32") * 255\ny = np.random.randint(0, 3, n_samples)\n\n# Предобработка для MobileNet\nX_processed = preprocess_input(X.copy())\n\n# Feature Extraction: модель замороженная\nbase = MobileNetV2(weights="imagenet", include_top=False, input_shape=(224, 224, 3))\nbase.trainable = False  # замораживаем!\n\nmodel = Sequential([\n    base,\n    layers.GlobalAveragePooling2D(),\n    layers.Dense(64, activation="relu"),\n    layers.Dropout(0.3),\n    layers.Dense(3, activation="softmax")\n])\n\nmodel.compile(\n    optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),  # высокий lr OK (база заморожена)\n    loss="sparse_categorical_crossentropy",\n    metrics=["accuracy"]\n)\n\n# Обучаем только верхние слои (быстро!)\ntrainable = sum(1 for layer in model.layers if layer.trainable)\ntotal = len(model.layers)\nprint(f"Обучаемых слоёв: {trainable} из {total}")\nprint(f"Обучаемых параметров: {sum(p.numpy().size for p in model.trainable_weights):,}")\nprint(f"Замороженных параметров: {sum(p.numpy().size for p in model.non_trainable_weights):,}")\n\nhistory = model.fit(X_processed, y, epochs=5, batch_size=32, validation_split=0.2, verbose=1)' },
        { type: 'note', value: 'При Feature Extraction обучаются только новые верхние слои. Это быстро и требует мало данных. Хороший первый шаг.' }
      ]
    },
    {
      id: 3,
      title: 'Fine-tuning',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Дообучение верхних слоёв базовой модели' },
        { type: 'text', value: 'Fine-tuning — разморозка части (обычно верхних) слоёв базовой модели и их дообучение с очень маленьким learning rate. Это позволяет адаптировать высокоуровневые признаки под вашу задачу, сохраняя низкоуровневые (грани, текстуры).' },
        { type: 'code', language: 'python', value: 'import tensorflow as tf\nfrom tensorflow.keras import layers, Sequential\nfrom tensorflow.keras.applications import MobileNetV2\n\n# Шаг 1: Feature Extraction (как раньше)\nbase = MobileNetV2(weights="imagenet", include_top=False, input_shape=(224, 224, 3))\nbase.trainable = False\n\nmodel = Sequential([\n    base,\n    layers.GlobalAveragePooling2D(),\n    layers.Dense(64, activation="relu"),\n    layers.Dropout(0.3),\n    layers.Dense(3, activation="softmax")\n])\nmodel.compile(optimizer="adam", loss="sparse_categorical_crossentropy", metrics=["accuracy"])\n\n# ... обучение feature extraction ...\n\n# Шаг 2: Fine-tuning\nbase.trainable = True  # разморозить!\n\n# Замораживаем нижние слои, размораживаем верхние\nfine_tune_from = 100  # размораживаем слои после 100-го\nfor layer in base.layers[:fine_tune_from]:\n    layer.trainable = False\n\ntrainable_layers = sum(1 for l in base.layers if l.trainable)\nprint(f"Размороженных слоёв: {trainable_layers} из {len(base.layers)}")\n\n# ВАЖНО: маленький learning rate!\nmodel.compile(\n    optimizer=tf.keras.optimizers.Adam(learning_rate=1e-5),  # 0.00001\n    loss="sparse_categorical_crossentropy",\n    metrics=["accuracy"]\n)\n\nprint("\\nПравила Fine-tuning:")\nprint("1. Сначала обучите верхние слои (feature extraction)")\nprint("2. Потом разморозьте верхние слои базы")\nprint("3. Используйте ОЧЕНЬ маленький lr (1e-5)")\nprint("4. Обучайте немного эпох (5-10)")' },
        { type: 'warning', value: 'При fine-tuning используйте learning rate в 10-100 раз меньше, чем при обычном обучении (1e-5 вместо 1e-3). Иначе предобученные веса будут разрушены.' }
      ]
    },
    {
      id: 4,
      title: 'Transfer Learning для текста',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Предобученные модели для NLP' },
        { type: 'text', value: 'В NLP Transfer Learning стал революцией: BERT, GPT и другие трансформеры обучены на огромных текстовых корпусах. Их можно fine-tune для конкретных задач: классификация, NER, ответы на вопросы.' },
        { type: 'code', language: 'python', value: '# Пример использования Hugging Face Transformers\n# pip install transformers\n\n# Концептуальный пример (требует установки transformers)\n"""\nfrom transformers import pipeline\n\n# Sentiment Analysis (готовый pipeline)\nclassifier = pipeline("sentiment-analysis")\nresult = classifier("I love machine learning!")\nprint(result)  # [{\'label\': \'POSITIVE\', \'score\': 0.9998}]\n\n# Zero-shot Classification\nzero_shot = pipeline("zero-shot-classification")\nresult = zero_shot(\n    "Акции Apple выросли на 5% после презентации iPhone",\n    candidate_labels=["финансы", "технологии", "спорт"]\n)\nprint(result)\n"""\n\n# Transfer Learning для текста в Keras\nimport tensorflow as tf\nfrom tensorflow.keras import layers, Sequential\nimport numpy as np\n\n# Простой Transfer Learning: предобученные embeddings + своя модель\nvocab_size = 10000\nmax_len = 100\n\nmodel = Sequential([\n    layers.Embedding(vocab_size, 64, input_length=max_len),\n    layers.Bidirectional(layers.LSTM(32)),\n    layers.Dense(32, activation="relu"),\n    layers.Dropout(0.5),\n    layers.Dense(1, activation="sigmoid")\n])\n\nmodel.compile(optimizer="adam", loss="binary_crossentropy", metrics=["accuracy"])\nprint("NLP модель с Embedding + BiLSTM:")\nmodel.summary()\n\nprint("\\nПредобученные NLP модели:")\nprint("  BERT — бидирекциональный, для понимания текста")\nprint("  GPT — авторегрессионный, для генерации")\nprint("  RoBERTa — улучшенный BERT")\nprint("  DistilBERT — облегчённый BERT (40% быстрее)")' },
        { type: 'tip', value: 'Для большинства NLP задач fine-tuning BERT/RoBERTa через Hugging Face transformers даёт лучшие результаты. Это стандарт индустрии с 2019 года.' }
      ]
    },
    {
      id: 5,
      title: 'Практические советы по Transfer Learning',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Когда и как применять Transfer Learning' },
        { type: 'list', value: [
          'Мало данных (< 1000 примеров) — обязательно Transfer Learning, только feature extraction',
          'Средне данных (1000-10000) — feature extraction + fine-tuning верхних слоёв',
          'Много данных (> 100000) — можно обучать с нуля, но TL всё равно помогает быстрее сойтись',
          'Ваши данные похожи на данные базовой модели — fine-tune верхние слои',
          'Ваши данные сильно отличаются — fine-tune больше слоёв или обучайте с нуля'
        ] },
        { type: 'code', language: 'python', value: '# Выбор базовой модели\nimport tensorflow as tf\n\nprint("Популярные предобученные модели в Keras:")\nprint()\n\nmodels_info = [\n    ("MobileNetV2", "Лёгкая, для мобильных", "3.4M"),\n    ("EfficientNetB0", "Лучший баланс", "5.3M"),\n    ("ResNet50", "Классическая, надёжная", "25.6M"),\n    ("VGG16", "Простая, но тяжёлая", "138M"),\n    ("InceptionV3", "Для детализированных задач", "23.9M"),\n]\n\nfor name, desc, params in models_info:\n    print(f"  {name:18s} — {desc:30s} ({params} параметров)")\n\nprint("\\nПошаговый план Transfer Learning:")\nprint("1. Выберите предобученную модель (MobileNetV2 для начала)")\nprint("2. Заморозьте базу, добавьте свой классификатор")\nprint("3. Обучите классификатор (5-10 эпох)")\nprint("4. Разморозьте верхние слои базы")\nprint("5. Fine-tune с маленьким lr (5-10 эпох)")\nprint("6. Оцените на тестовой выборке")' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Transfer Learning для изображений',
      type: 'practice',
      difficulty: 'hard',
      description: 'Используйте предобученную MobileNetV2 для классификации изображений с помощью Transfer Learning.',
      requirements: [
        'Создайте синтетический датасет: 200 изображений 224x224x3, 3 класса',
        'Загрузите MobileNetV2 без верхнего слоя, заморозьте',
        'Добавьте GlobalAveragePooling2D + Dense(64) + Dropout + Dense(3, softmax)',
        'Обучите на 5 эпохах (feature extraction)',
        'Разморозьте последние 20 слоёв и fine-tune с lr=1e-5 на 3 эпохах'
      ],
      hint: 'base_model.trainable = False для заморозки. Для fine-tuning: base_model.trainable = True, затем заморозьте слои base_model.layers[:-20].',
      expectedOutput: 'Feature Extraction: обучаемых параметров = ~XXk\nFine-tuning: обучаемых параметров = ~XXXk\nОбучение завершено',
      solution: 'import numpy as np\nimport tensorflow as tf\nfrom tensorflow.keras import layers, Sequential\nfrom tensorflow.keras.applications import MobileNetV2\nfrom tensorflow.keras.applications.mobilenet_v2 import preprocess_input\n\nnp.random.seed(42)\nX = np.random.rand(200, 224, 224, 3).astype("float32") * 255\ny = np.random.randint(0, 3, 200)\nX = preprocess_input(X)\n\n# Feature Extraction\nbase = MobileNetV2(weights="imagenet", include_top=False, input_shape=(224, 224, 3))\nbase.trainable = False\n\nmodel = Sequential([\n    base,\n    layers.GlobalAveragePooling2D(),\n    layers.Dense(64, activation="relu"),\n    layers.Dropout(0.3),\n    layers.Dense(3, activation="softmax")\n])\nmodel.compile(optimizer="adam", loss="sparse_categorical_crossentropy", metrics=["accuracy"])\n\ntrainable_params = sum(p.numpy().size for p in model.trainable_weights)\nprint(f"Feature Extraction: обучаемых параметров = {trainable_params:,}")\n\nmodel.fit(X, y, epochs=5, batch_size=32, validation_split=0.2, verbose=0)\nprint("Feature extraction завершён")\n\n# Fine-tuning\nbase.trainable = True\nfor layer in base.layers[:-20]:\n    layer.trainable = False\n\nmodel.compile(\n    optimizer=tf.keras.optimizers.Adam(learning_rate=1e-5),\n    loss="sparse_categorical_crossentropy",\n    metrics=["accuracy"]\n)\n\ntrainable_params_ft = sum(p.numpy().size for p in model.trainable_weights)\nprint(f"Fine-tuning: обучаемых параметров = {trainable_params_ft:,}")\n\nmodel.fit(X, y, epochs=3, batch_size=32, validation_split=0.2, verbose=0)\nprint("Обучение завершено")',
      explanation: 'Transfer Learning значительно сокращает время обучения и количество необходимых данных. На этапе Feature Extraction обучаются только ~200k параметров (верхние слои), на этапе Fine-tuning — больше, но с маленьким lr для сохранения предобученных знаний. В реальных задачах с настоящими изображениями TL даёт accuracy на 10-30% выше, чем обучение с нуля.'
    }
  ]
}
