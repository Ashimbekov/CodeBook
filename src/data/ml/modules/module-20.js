export default {
  id: 20,
  title: 'Рекуррентные нейронные сети (RNN, LSTM)',
  description: 'RNN и LSTM для последовательных данных: временные ряды, текст, прогнозирование, генерация текста.',
  lessons: [
    {
      id: 1,
      title: 'Принцип работы RNN',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Рекуррентные нейросети для последовательностей' },
        { type: 'text', value: 'RNN (Recurrent Neural Network) обрабатывает последовательные данные, сохраняя "память" о предыдущих элементах. На каждом шаге RNN принимает текущий вход и скрытое состояние из предыдущего шага. Применения: обработка текста, временные ряды, аудио, видео.' },
        { type: 'code', language: 'python', value: 'import tensorflow as tf\nfrom tensorflow.keras import layers, Sequential\nimport numpy as np\n\n# Простая RNN\nmodel = Sequential([\n    layers.SimpleRNN(64, input_shape=(10, 1), return_sequences=False),\n    layers.Dense(1)\n])\nmodel.summary()\n\nprint("\\nRNN принимает: (batch_size, timesteps, features)")\nprint("input_shape=(10, 1): 10 временных шагов, 1 признак")\nprint("return_sequences=True: выход на каждом шаге")\nprint("return_sequences=False: выход только на последнем шаге")\n\n# Пример: прогноз временного ряда\nnp.random.seed(42)\nt = np.linspace(0, 20 * np.pi, 1000)\ndata = np.sin(t) + np.random.randn(1000) * 0.1\n\n# Подготовка данных: окно из 50 точек -> предсказание следующей\nwindow_size = 50\nX, y = [], []\nfor i in range(len(data) - window_size):\n    X.append(data[i:i+window_size])\n    y.append(data[i+window_size])\n\nX = np.array(X).reshape(-1, window_size, 1).astype("float32")\ny = np.array(y).astype("float32")\n\nprint(f"\\nX shape: {X.shape}")  # (950, 50, 1)\nprint(f"y shape: {y.shape}")    # (950,)' },
        { type: 'note', value: 'SimpleRNN страдает от проблемы "исчезающего градиента" — не может запоминать долгосрочные зависимости. Для этого используют LSTM и GRU.' }
      ]
    },
    {
      id: 2,
      title: 'LSTM — Long Short-Term Memory',
      type: 'theory',
      content: [
        { type: 'heading', value: 'LSTM решает проблему долгосрочной памяти' },
        { type: 'text', value: 'LSTM имеет механизмы "ворот" (gates): forget gate (что забыть), input gate (что запомнить), output gate (что вывести). Это позволяет сохранять информацию на длинных последовательностях — критически важно для NLP и временных рядов.' },
        { type: 'code', language: 'python', value: 'import tensorflow as tf\nfrom tensorflow.keras import layers, Sequential\nimport numpy as np\nimport matplotlib.pyplot as plt\n\n# Генерация синусоиды\nnp.random.seed(42)\nt = np.linspace(0, 20 * np.pi, 1000)\ndata = np.sin(t) + 0.3 * np.sin(3 * t) + np.random.randn(1000) * 0.1\n\nwindow = 50\nX, y = [], []\nfor i in range(len(data) - window):\n    X.append(data[i:i+window])\n    y.append(data[i+window])\nX = np.array(X).reshape(-1, window, 1).astype("float32")\ny = np.array(y).astype("float32")\n\n# Разделение\nsplit = int(len(X) * 0.8)\nX_train, X_test = X[:split], X[split:]\ny_train, y_test = y[:split], y[split:]\n\n# LSTM модель\nmodel = Sequential([\n    layers.LSTM(64, input_shape=(window, 1), return_sequences=True),\n    layers.LSTM(32),\n    layers.Dense(16, activation="relu"),\n    layers.Dense(1)\n])\n\nmodel.compile(optimizer="adam", loss="mse")\nhistory = model.fit(X_train, y_train, epochs=20, batch_size=32,\n                    validation_split=0.1, verbose=0)\n\n# Предсказания\ny_pred = model.predict(X_test, verbose=0).flatten()\n\nmse = np.mean((y_test - y_pred) ** 2)\nprint(f"Test MSE: {mse:.6f}")\n\nplt.figure(figsize=(12, 4))\nplt.plot(y_test[:200], label="Факт", alpha=0.7)\nplt.plot(y_pred[:200], label="Предсказание", alpha=0.7)\nplt.legend()\nplt.title("LSTM: прогноз временного ряда")\nplt.show()' }
      ]
    },
    {
      id: 3,
      title: 'GRU и Bidirectional',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Варианты рекуррентных слоёв' },
        { type: 'code', language: 'python', value: 'import tensorflow as tf\nfrom tensorflow.keras import layers, Sequential\nimport numpy as np\n\n# GRU — упрощённый LSTM (2 ворот вместо 3, быстрее)\nmodel_gru = Sequential([\n    layers.GRU(64, input_shape=(50, 1)),\n    layers.Dense(1)\n])\n\n# Bidirectional LSTM — читает последовательность в обоих направлениях\nmodel_bidir = Sequential([\n    layers.Bidirectional(layers.LSTM(32), input_shape=(50, 1)),\n    layers.Dense(1)\n])\n\nprint("GRU:")\nmodel_gru.summary()\nprint("Bidirectional LSTM:")\nmodel_bidir.summary()\n\nprint("Сравнение:")\nprint("SimpleRNN: быстрый, но не запоминает далёкий контекст")\nprint("LSTM: хорошая долгосрочная память, но медленный")\nprint("GRU: компромисс между скоростью и памятью")\nprint("Bidirectional: для задач, где важен контекст слева И справа (NLP)")\n\n# Пример: стекированные LSTM\nmodel_stacked = Sequential([\n    layers.LSTM(64, return_sequences=True, input_shape=(50, 1)),\n    layers.LSTM(32, return_sequences=True),\n    layers.LSTM(16),\n    layers.Dense(1)\n])\nprint(f"Stacked LSTM: {model_stacked.count_params():,} параметров")' },
        { type: 'tip', value: 'return_sequences=True нужен для всех промежуточных LSTM слоёв при стекировании. Последний LSTM обычно с return_sequences=False.' }
      ]
    },
    {
      id: 4,
      title: 'RNN для классификации текста',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Анализ тональности с LSTM' },
        { type: 'code', language: 'python', value: 'import tensorflow as tf\nfrom tensorflow.keras import layers, Sequential\nimport numpy as np\n\n# IMDB — отзывы к фильмам (положительные/отрицательные)\nvocab_size = 10000\nmax_len = 200\n\n(X_train, y_train), (X_test, y_test) = tf.keras.datasets.imdb.load_data(\n    num_words=vocab_size\n)\n\n# Padding — выравнивание последовательностей до одной длины\nX_train = tf.keras.preprocessing.sequence.pad_sequences(X_train, maxlen=max_len)\nX_test = tf.keras.preprocessing.sequence.pad_sequences(X_test, maxlen=max_len)\n\nprint(f"Train: {X_train.shape}, Test: {X_test.shape}")\n\n# Модель: Embedding + LSTM\nmodel = Sequential([\n    layers.Embedding(vocab_size, 32, input_length=max_len),  # слова -> векторы\n    layers.LSTM(64, dropout=0.2),\n    layers.Dense(1, activation="sigmoid")\n])\n\nmodel.compile(optimizer="adam", loss="binary_crossentropy", metrics=["accuracy"])\n\nhistory = model.fit(X_train, y_train, epochs=5, batch_size=64,\n                    validation_split=0.2, verbose=1)\n\ntest_loss, test_acc = model.evaluate(X_test, y_test, verbose=0)\nprint(f"\\nTest accuracy: {test_acc:.4f}")\n\n# Предсказание\nsamples = model.predict(X_test[:5], verbose=0)\nfor i in range(5):\n    sentiment = "Положительный" if samples[i][0] > 0.5 else "Отрицательный"\n    print(f"  Отзыв {i}: {sentiment} ({samples[i][0]:.4f})")' },
        { type: 'note', value: 'Embedding слой преобразует целочисленные индексы слов в плотные векторы. Это первый слой для любой NLP задачи с нейросетями.' }
      ]
    },
    {
      id: 5,
      title: 'Прогнозирование временных рядов',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Многошаговое прогнозирование' },
        { type: 'code', language: 'python', value: 'import numpy as np\nimport tensorflow as tf\nfrom tensorflow.keras import layers, Sequential\nimport matplotlib.pyplot as plt\n\n# Генерация данных: тренд + сезонность + шум\nnp.random.seed(42)\nn = 500\nt = np.arange(n)\ndata = 0.02 * t + 5 * np.sin(2 * np.pi * t / 50) + np.random.randn(n) * 0.5\n\n# Нормализация\nmean, std = data.mean(), data.std()\ndata_norm = (data - mean) / std\n\n# Подготовка данных\nwindow = 30\nX, y = [], []\nfor i in range(len(data_norm) - window):\n    X.append(data_norm[i:i+window])\n    y.append(data_norm[i+window])\n\nX = np.array(X).reshape(-1, window, 1).astype("float32")\ny = np.array(y).astype("float32")\n\nsplit = int(len(X) * 0.8)\nX_train, X_test = X[:split], X[split:]\ny_train, y_test = y[:split], y[split:]\n\n# Модель\nmodel = Sequential([\n    layers.LSTM(32, input_shape=(window, 1)),\n    layers.Dense(16, activation="relu"),\n    layers.Dense(1)\n])\nmodel.compile(optimizer="adam", loss="mse")\nmodel.fit(X_train, y_train, epochs=30, batch_size=32, validation_split=0.1, verbose=0)\n\n# Многошаговое предсказание (рекурсивное)\ndef predict_future(model, last_window, steps):\n    predictions = []\n    current = last_window.copy()\n    for _ in range(steps):\n        pred = model.predict(current.reshape(1, window, 1), verbose=0)[0, 0]\n        predictions.append(pred)\n        current = np.append(current[1:], pred)\n    return np.array(predictions)\n\nfuture = predict_future(model, data_norm[-window:], 50)\nfuture_denorm = future * std + mean\n\nplt.figure(figsize=(12, 4))\nplt.plot(range(len(data)), data, label="Данные")\nplt.plot(range(len(data), len(data) + 50), future_denorm, "r--", label="Прогноз")\nplt.legend()\nplt.title("LSTM: многошаговый прогноз")\nplt.show()' }
      ]
    },
    {
      id: 6,
      title: 'Практика: LSTM для прогнозирования',
      type: 'practice',
      difficulty: 'hard',
      description: 'Постройте LSTM модель для прогнозирования синусоидального временного ряда.',
      requirements: [
        'Создайте временной ряд: sin(t) + 0.5*sin(3t) + шум, 1000 точек',
        'Подготовьте данные с окном 30 шагов',
        'Обучите LSTM(64) + Dense(32) + Dense(1) на 20 эпохах',
        'Визуализируйте предсказания vs факт на тестовой выборке',
        'Вычислите MSE на тесте'
      ],
      hint: 'Нормализуйте данные перед обучением. reshape(-1, window, 1) для формата (samples, timesteps, features). model.predict() для предсказаний.',
      expectedOutput: 'X_train: (XXX, 30, 1), X_test: (XXX, 30, 1)\nTest MSE: 0.00XX\nГрафик предсказаний сохранён',
      solution: 'import numpy as np\nimport matplotlib.pyplot as plt\nimport tensorflow as tf\nfrom tensorflow.keras import layers, Sequential\n\nnp.random.seed(42)\nt = np.linspace(0, 20 * np.pi, 1000)\ndata = np.sin(t) + 0.5 * np.sin(3 * t) + np.random.randn(1000) * 0.1\n\nmean, std = data.mean(), data.std()\ndata_norm = (data - mean) / std\n\nwindow = 30\nX, y = [], []\nfor i in range(len(data_norm) - window):\n    X.append(data_norm[i:i+window])\n    y.append(data_norm[i+window])\n\nX = np.array(X).reshape(-1, window, 1).astype("float32")\ny = np.array(y).astype("float32")\n\nsplit = int(len(X) * 0.8)\nX_train, X_test = X[:split], X[split:]\ny_train, y_test = y[:split], y[split:]\nprint(f"X_train: {X_train.shape}, X_test: {X_test.shape}")\n\nmodel = Sequential([\n    layers.LSTM(64, input_shape=(window, 1)),\n    layers.Dense(32, activation="relu"),\n    layers.Dense(1)\n])\nmodel.compile(optimizer="adam", loss="mse")\nmodel.fit(X_train, y_train, epochs=20, batch_size=32, validation_split=0.1, verbose=0)\n\ny_pred = model.predict(X_test, verbose=0).flatten()\nmse = np.mean((y_test - y_pred) ** 2)\nprint(f"Test MSE: {mse:.4f}")\n\nplt.figure(figsize=(12, 4))\nplt.plot(y_test[:200], label="Факт")\nplt.plot(y_pred[:200], label="Предсказание")\nplt.legend()\nplt.title(f"LSTM прогноз (MSE={mse:.4f})")\nplt.savefig("lstm_forecast.png")\nplt.show()\nprint("График предсказаний сохранён")',
      explanation: 'LSTM обучается на окнах фиксированной длины для предсказания следующего значения. Нормализация данных важна для стабильности обучения. Качественный LSTM достигает низкого MSE на регулярных временных рядах. Для более сложных рядов (финансовые данные) нужны дополнительные признаки и более глубокие архитектуры.'
    }
  ]
}
