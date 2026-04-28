export default {
  id: 18,
  title: 'Deep Learning: Keras и TensorFlow',
  description: 'Создание нейросетей в Keras/TensorFlow: Sequential API, компиляция, обучение, callbacks, сохранение моделей.',
  lessons: [
    {
      id: 1,
      title: 'Введение в Keras и TensorFlow',
      type: 'theory',
      content: [
        { type: 'heading', value: 'TensorFlow и Keras — фреймворк для Deep Learning' },
        { type: 'text', value: 'TensorFlow — open-source фреймворк от Google для машинного обучения. Keras — высокоуровневый API для TensorFlow, позволяющий создавать нейросети буквально в несколько строк. Keras стал стандартом благодаря простоте и гибкости.' },
        { type: 'code', language: 'python', value: 'import tensorflow as tf\nfrom tensorflow import keras\nfrom tensorflow.keras import layers\n\nprint(f"TensorFlow версия: {tf.__version__}")\n\n# Простая нейросеть в Keras (Sequential API)\nmodel = keras.Sequential([\n    layers.Dense(64, activation="relu", input_shape=(10,)),  # вход: 10 признаков\n    layers.Dense(32, activation="relu"),                      # скрытый слой\n    layers.Dense(1, activation="sigmoid")                     # выход: бинарная классиф.\n])\n\n# Компиляция: выбор оптимизатора, функции потерь, метрик\nmodel.compile(\n    optimizer="adam",\n    loss="binary_crossentropy",\n    metrics=["accuracy"]\n)\n\nmodel.summary()  # архитектура сети\n\n# Подсчёт параметров\ntotal_params = model.count_params()\nprint(f"\\nВсего параметров: {total_params}")\nprint("Dense(64): 10*64 + 64 = 704")\nprint("Dense(32): 64*32 + 32 = 2080")\nprint("Dense(1):  32*1 + 1 = 33")' },
        { type: 'tip', value: 'adam — самый популярный оптимизатор. binary_crossentropy — для бинарной классификации, categorical_crossentropy — для многоклассовой, mse — для регрессии.' }
      ]
    },
    {
      id: 2,
      title: 'Обучение модели',
      type: 'theory',
      content: [
        { type: 'heading', value: 'fit(), evaluate(), predict()' },
        { type: 'code', language: 'python', value: 'import numpy as np\nimport tensorflow as tf\nfrom tensorflow.keras import layers, Sequential\nfrom sklearn.datasets import load_breast_cancer\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.preprocessing import StandardScaler\n\n# Данные\ndata = load_breast_cancer()\nX_train, X_test, y_train, y_test = train_test_split(\n    data.data, data.target, test_size=0.2, random_state=42\n)\nscaler = StandardScaler()\nX_train = scaler.fit_transform(X_train).astype("float32")\nX_test = scaler.transform(X_test).astype("float32")\n\n# Модель\nmodel = Sequential([\n    layers.Dense(64, activation="relu", input_shape=(30,)),\n    layers.Dropout(0.3),  # Регуляризация: случайное отключение 30% нейронов\n    layers.Dense(32, activation="relu"),\n    layers.Dropout(0.2),\n    layers.Dense(1, activation="sigmoid")\n])\n\nmodel.compile(optimizer="adam", loss="binary_crossentropy", metrics=["accuracy"])\n\n# Обучение\nhistory = model.fit(\n    X_train, y_train,\n    epochs=50,\n    batch_size=32,\n    validation_split=0.2,  # 20% train для валидации\n    verbose=0  # без вывода\n)\n\n# Оценка\nloss, accuracy = model.evaluate(X_test, y_test, verbose=0)\nprint(f"Test loss: {loss:.4f}")\nprint(f"Test accuracy: {accuracy:.4f}")\n\n# Предсказания\ny_pred_prob = model.predict(X_test[:5], verbose=0)\ny_pred = (y_pred_prob > 0.5).astype(int)\nfor i in range(5):\n    print(f"Проб: {y_pred_prob[i][0]:.4f}, Пред: {y_pred[i][0]}, Факт: {y_test[i]}")' },
        { type: 'warning', value: 'Dropout ОТКЛЮЧАЕТСЯ при predict() и evaluate() автоматически. Не нужно переключать режимы вручную, как в PyTorch.' }
      ]
    },
    {
      id: 3,
      title: 'Визуализация обучения и Callbacks',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Мониторинг и управление обучением' },
        { type: 'code', language: 'python', value: 'import matplotlib.pyplot as plt\nimport tensorflow as tf\nfrom tensorflow.keras import layers, Sequential\nfrom tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau, ModelCheckpoint\nimport numpy as np\nfrom sklearn.datasets import load_breast_cancer\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.preprocessing import StandardScaler\n\ndata = load_breast_cancer()\nX_train, X_test, y_train, y_test = train_test_split(\n    data.data, data.target, test_size=0.2, random_state=42\n)\nscaler = StandardScaler()\nX_train = scaler.fit_transform(X_train).astype("float32")\nX_test = scaler.transform(X_test).astype("float32")\n\nmodel = Sequential([\n    layers.Dense(64, activation="relu", input_shape=(30,)),\n    layers.Dense(32, activation="relu"),\n    layers.Dense(1, activation="sigmoid")\n])\nmodel.compile(optimizer="adam", loss="binary_crossentropy", metrics=["accuracy"])\n\n# Callbacks\ncallbacks = [\n    EarlyStopping(monitor="val_loss", patience=10, restore_best_weights=True),\n    ReduceLROnPlateau(monitor="val_loss", factor=0.5, patience=5),\n]\n\nhistory = model.fit(X_train, y_train, epochs=200, batch_size=32,\n                    validation_split=0.2, callbacks=callbacks, verbose=0)\n\n# Визуализация обучения\nfig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))\n\nax1.plot(history.history["loss"], label="Train")\nax1.plot(history.history["val_loss"], label="Validation")\nax1.set_xlabel("Epoch")\nax1.set_ylabel("Loss")\nax1.set_title("Loss")\nax1.legend()\n\nax2.plot(history.history["accuracy"], label="Train")\nax2.plot(history.history["val_accuracy"], label="Validation")\nax2.set_xlabel("Epoch")\nax2.set_ylabel("Accuracy")\nax2.set_title("Accuracy")\nax2.legend()\n\nplt.tight_layout()\nplt.show()\n\nprint(f"Обучение остановлено на эпохе {len(history.history[\'loss\'])}")' },
        { type: 'note', value: 'EarlyStopping останавливает обучение, когда val_loss перестаёт улучшаться. patience=10 означает "подождать 10 эпох без улучшения". restore_best_weights возвращает веса лучшей эпохи.' }
      ]
    },
    {
      id: 4,
      title: 'Многоклассовая классификация в Keras',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Softmax и Categorical Crossentropy' },
        { type: 'code', language: 'python', value: 'import tensorflow as tf\nfrom tensorflow.keras import layers, Sequential\nfrom sklearn.datasets import load_digits\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.preprocessing import StandardScaler\nimport numpy as np\n\ndigits = load_digits()\nX_train, X_test, y_train, y_test = train_test_split(\n    digits.data, digits.target, test_size=0.2, random_state=42\n)\nscaler = StandardScaler()\nX_train = scaler.fit_transform(X_train).astype("float32")\nX_test = scaler.transform(X_test).astype("float32")\n\n# Многоклассовая модель (10 цифр)\nmodel = Sequential([\n    layers.Dense(128, activation="relu", input_shape=(64,)),\n    layers.Dropout(0.3),\n    layers.Dense(64, activation="relu"),\n    layers.Dropout(0.2),\n    layers.Dense(10, activation="softmax")  # 10 классов → softmax\n])\n\n# sparse_categorical_crossentropy: метки как числа (0-9)\nmodel.compile(\n    optimizer="adam",\n    loss="sparse_categorical_crossentropy",  # метки без one-hot\n    metrics=["accuracy"]\n)\n\nhistory = model.fit(X_train, y_train, epochs=50, batch_size=32,\n                    validation_split=0.2, verbose=0)\n\nloss, acc = model.evaluate(X_test, y_test, verbose=0)\nprint(f"Test accuracy: {acc:.4f}")\n\n# Предсказания с вероятностями\nprobs = model.predict(X_test[:3], verbose=0)\nfor i in range(3):\n    pred_class = np.argmax(probs[i])\n    confidence = probs[i][pred_class]\n    print(f"Факт: {y_test[i]}, Предсказание: {pred_class}, Уверенность: {confidence:.4f}")' },
        { type: 'tip', value: 'sparse_categorical_crossentropy — метки как числа (0, 1, 2...). categorical_crossentropy — метки как one-hot вектора ([1,0,0], [0,1,0]...). Первый вариант удобнее.' }
      ]
    },
    {
      id: 5,
      title: 'Сохранение и загрузка моделей',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Persistence моделей Keras' },
        { type: 'code', language: 'python', value: '# Сохранение и загрузка модели Keras\nimport tensorflow as tf\nfrom tensorflow.keras import layers, Sequential\nimport numpy as np\n\n# Создание и обучение модели\nmodel = Sequential([\n    layers.Dense(32, activation="relu", input_shape=(10,)),\n    layers.Dense(1, activation="sigmoid")\n])\nmodel.compile(optimizer="adam", loss="binary_crossentropy")\n\nX_dummy = np.random.randn(100, 10).astype("float32")\ny_dummy = np.random.randint(0, 2, 100)\nmodel.fit(X_dummy, y_dummy, epochs=5, verbose=0)\n\n# Способ 1: Сохранить всю модель (рекомендуется)\nmodel.save("my_model.keras")\nloaded_model = tf.keras.models.load_model("my_model.keras")\nprint("Модель загружена!")\nprint(f"Предсказания совпадают: {np.allclose(model.predict(X_dummy[:5], verbose=0), loaded_model.predict(X_dummy[:5], verbose=0))}")\n\n# Способ 2: Только веса\nmodel.save_weights("my_weights.weights.h5")\nnew_model = Sequential([\n    layers.Dense(32, activation="relu", input_shape=(10,)),\n    layers.Dense(1, activation="sigmoid")\n])\nnew_model.compile(optimizer="adam", loss="binary_crossentropy")\nnew_model.load_weights("my_weights.weights.h5")\nprint("Веса загружены!")\n\n# Способ 3: SavedModel (для деплоя)\nmodel.export("saved_model_dir")\nprint("\\nФорматы сохранения:")\nprint("  .keras — полная модель (архитектура + веса + оптимизатор)")\nprint("  .weights.h5 — только веса")\nprint("  SavedModel — для TensorFlow Serving / деплоя")' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Нейросеть на Keras',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте нейросеть в Keras для классификации цифр с Dropout, EarlyStopping и визуализацией обучения.',
      requirements: [
        'Загрузите digits dataset, стандартизируйте, разделите 80/20',
        'Создайте Sequential модель: Dense(128,relu) -> Dropout(0.3) -> Dense(64,relu) -> Dense(10,softmax)',
        'Используйте EarlyStopping(patience=10) и обучите на 100 эпох',
        'Постройте графики loss и accuracy (train и validation)',
        'Выведите финальную accuracy на тесте'
      ],
      hint: 'Компилируйте с optimizer="adam", loss="sparse_categorical_crossentropy". Используйте validation_split=0.2 в fit(). history.history содержит метрики.',
      expectedOutput: 'Эпох до остановки: ~30-50\nTest accuracy: 0.97XX\nГрафики loss и accuracy сохранены',
      solution: 'import numpy as np\nimport matplotlib.pyplot as plt\nimport tensorflow as tf\nfrom tensorflow.keras import layers, Sequential\nfrom tensorflow.keras.callbacks import EarlyStopping\nfrom sklearn.datasets import load_digits\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.preprocessing import StandardScaler\n\ndigits = load_digits()\nX_train, X_test, y_train, y_test = train_test_split(\n    digits.data, digits.target, test_size=0.2, random_state=42\n)\nscaler = StandardScaler()\nX_train = scaler.fit_transform(X_train).astype("float32")\nX_test = scaler.transform(X_test).astype("float32")\n\nmodel = Sequential([\n    layers.Dense(128, activation="relu", input_shape=(64,)),\n    layers.Dropout(0.3),\n    layers.Dense(64, activation="relu"),\n    layers.Dense(10, activation="softmax")\n])\n\nmodel.compile(optimizer="adam", loss="sparse_categorical_crossentropy", metrics=["accuracy"])\n\nearly_stop = EarlyStopping(monitor="val_loss", patience=10, restore_best_weights=True)\nhistory = model.fit(X_train, y_train, epochs=100, batch_size=32,\n                    validation_split=0.2, callbacks=[early_stop], verbose=0)\n\nprint(f"Эпох до остановки: {len(history.history[\'loss\'])}")\nloss, acc = model.evaluate(X_test, y_test, verbose=0)\nprint(f"Test accuracy: {acc:.4f}")\n\nfig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))\nax1.plot(history.history["loss"], label="Train")\nax1.plot(history.history["val_loss"], label="Val")\nax1.set_title("Loss")\nax1.legend()\nax2.plot(history.history["accuracy"], label="Train")\nax2.plot(history.history["val_accuracy"], label="Val")\nax2.set_title("Accuracy")\nax2.legend()\nplt.tight_layout()\nplt.savefig("keras_training.png")\nplt.show()\nprint("Графики loss и accuracy сохранены")',
      explanation: 'Keras Sequential API позволяет быстро создавать нейросети. Dropout регуляризирует модель, случайно отключая нейроны при обучении. EarlyStopping предотвращает переобучение, останавливая обучение когда val_loss перестаёт улучшаться. Визуализация loss/accuracy помогает диагностировать underfitting и overfitting.'
    }
  ]
}
