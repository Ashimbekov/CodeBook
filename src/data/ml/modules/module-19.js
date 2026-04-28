export default {
  id: 19,
  title: 'Свёрточные нейронные сети (CNN)',
  description: 'CNN для Computer Vision: свёртка, пулинг, архитектуры, классификация изображений, data augmentation.',
  lessons: [
    {
      id: 1,
      title: 'Принцип работы CNN',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Свёрточные слои и пулинг' },
        { type: 'text', value: 'CNN (Convolutional Neural Network) — нейросеть, специализированная для работы с изображениями. Ключевые компоненты: свёрточный слой (Conv2D) — извлекает локальные признаки фильтрами, пулинг (MaxPooling) — уменьшает размер, сохраняя важную информацию, полносвязный слой (Dense) — классификация на основе извлечённых признаков.' },
        { type: 'code', language: 'python', value: 'import tensorflow as tf\nfrom tensorflow.keras import layers, Sequential\n\n# Базовая CNN архитектура для изображений 28x28\nmodel = Sequential([\n    # Свёрточный блок 1\n    layers.Conv2D(32, (3, 3), activation="relu", input_shape=(28, 28, 1)),\n    layers.MaxPooling2D((2, 2)),\n    \n    # Свёрточный блок 2\n    layers.Conv2D(64, (3, 3), activation="relu"),\n    layers.MaxPooling2D((2, 2)),\n    \n    # Свёрточный блок 3\n    layers.Conv2D(64, (3, 3), activation="relu"),\n    \n    # Классификатор\n    layers.Flatten(),          # 3D -> 1D\n    layers.Dense(64, activation="relu"),\n    layers.Dropout(0.5),\n    layers.Dense(10, activation="softmax")  # 10 классов\n])\n\nmodel.summary()\n\nprint("\\nКлючевые слои CNN:")\nprint("Conv2D(32, (3,3)): 32 фильтра размером 3x3")\nprint("MaxPooling2D(2,2): уменьшает размер в 2 раза")\nprint("Flatten: преобразует 2D карты признаков в 1D вектор")\nprint("Dense: полносвязный слой для классификации")' },
        { type: 'note', value: 'Conv2D извлекает локальные паттерны (грани, текстуры), MaxPooling уменьшает размер и делает модель инвариантной к небольшим сдвигам. Каждый следующий свёрточный слой захватывает более сложные паттерны.' }
      ]
    },
    {
      id: 2,
      title: 'MNIST: распознавание цифр',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Классификация рукописных цифр с CNN' },
        { type: 'code', language: 'python', value: 'import tensorflow as tf\nfrom tensorflow.keras import layers, Sequential\nimport numpy as np\n\n# Загрузка MNIST\n(X_train, y_train), (X_test, y_test) = tf.keras.datasets.mnist.load_data()\n\n# Предобработка\nX_train = X_train.reshape(-1, 28, 28, 1).astype("float32") / 255.0\nX_test = X_test.reshape(-1, 28, 28, 1).astype("float32") / 255.0\n\nprint(f"Train: {X_train.shape}, Test: {X_test.shape}")\n\n# CNN модель\nmodel = Sequential([\n    layers.Conv2D(32, (3, 3), activation="relu", input_shape=(28, 28, 1)),\n    layers.MaxPooling2D((2, 2)),\n    layers.Conv2D(64, (3, 3), activation="relu"),\n    layers.MaxPooling2D((2, 2)),\n    layers.Conv2D(64, (3, 3), activation="relu"),\n    layers.Flatten(),\n    layers.Dense(64, activation="relu"),\n    layers.Dropout(0.5),\n    layers.Dense(10, activation="softmax")\n])\n\nmodel.compile(optimizer="adam", loss="sparse_categorical_crossentropy", metrics=["accuracy"])\n\nhistory = model.fit(X_train, y_train, epochs=10, batch_size=64,\n                    validation_split=0.1, verbose=1)\n\ntest_loss, test_acc = model.evaluate(X_test, y_test, verbose=0)\nprint(f"\\nTest accuracy: {test_acc:.4f}")  # ~99.2%\n\n# Предсказания\ny_pred = model.predict(X_test[:5], verbose=0)\nfor i in range(5):\n    print(f"Факт: {y_test[i]}, Предсказание: {np.argmax(y_pred[i])}, Уверенность: {y_pred[i].max():.4f}")' },
        { type: 'tip', value: 'Нормализация пикселей /255.0 приводит значения к диапазону [0, 1]. Это ускоряет обучение и улучшает сходимость.' }
      ]
    },
    {
      id: 3,
      title: 'Data Augmentation',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Увеличение данных для предотвращения переобучения' },
        { type: 'text', value: 'Data Augmentation — создание новых обучающих примеров путём случайных трансформаций существующих изображений: повороты, сдвиги, отражения, изменение яркости. Это увеличивает эффективный размер датасета и борется с переобучением.' },
        { type: 'code', language: 'python', value: 'import tensorflow as tf\nfrom tensorflow.keras import layers, Sequential\n\n# Data Augmentation как часть модели\ndata_augmentation = Sequential([\n    layers.RandomFlip("horizontal"),\n    layers.RandomRotation(0.1),\n    layers.RandomZoom(0.1),\n    layers.RandomTranslation(0.1, 0.1),\n])\n\n# Модель с augmentation\nmodel = Sequential([\n    # Augmentation (применяется только при обучении)\n    data_augmentation,\n    \n    # CNN\n    layers.Conv2D(32, (3, 3), activation="relu", input_shape=(32, 32, 3)),\n    layers.MaxPooling2D((2, 2)),\n    layers.Conv2D(64, (3, 3), activation="relu"),\n    layers.MaxPooling2D((2, 2)),\n    layers.Conv2D(64, (3, 3), activation="relu"),\n    layers.Flatten(),\n    layers.Dense(64, activation="relu"),\n    layers.Dropout(0.5),\n    layers.Dense(10, activation="softmax")\n])\n\nmodel.compile(optimizer="adam", loss="sparse_categorical_crossentropy", metrics=["accuracy"])\n\n# CIFAR-10\n(X_train, y_train), (X_test, y_test) = tf.keras.datasets.cifar10.load_data()\nX_train = X_train.astype("float32") / 255.0\nX_test = X_test.astype("float32") / 255.0\n\nprint(f"CIFAR-10: {X_train.shape}")  # (50000, 32, 32, 3)\n\nhistory = model.fit(X_train, y_train, epochs=20, batch_size=64,\n                    validation_split=0.1, verbose=0)\n\nprint(f"Test accuracy: {model.evaluate(X_test, y_test, verbose=0)[1]:.4f}")' },
        { type: 'warning', value: 'Data Augmentation применяется ТОЛЬКО при обучении, не при предсказании. Keras слои RandomFlip и другие автоматически отключаются в predict/evaluate.' }
      ]
    },
    {
      id: 4,
      title: 'Известные архитектуры CNN',
      type: 'theory',
      content: [
        { type: 'heading', value: 'VGG, ResNet, Inception' },
        { type: 'text', value: 'Существуют проверенные архитектуры CNN, которые можно использовать как базу. VGG — простая стопка свёрток 3x3. ResNet — skip connections для обучения очень глубоких сетей. Inception — параллельные свёртки разного размера.' },
        { type: 'code', language: 'python', value: '# Использование предобученных моделей из Keras\nimport tensorflow as tf\nfrom tensorflow.keras.applications import (\n    VGG16, ResNet50, MobileNetV2, EfficientNetB0\n)\n\n# VGG16 — классическая архитектура\nvgg = VGG16(weights=None, include_top=False, input_shape=(224, 224, 3))\nprint(f"VGG16: {vgg.count_params():,} параметров")\n\n# ResNet50 — с skip connections\nresnet = ResNet50(weights=None, include_top=False, input_shape=(224, 224, 3))\nprint(f"ResNet50: {resnet.count_params():,} параметров")\n\n# MobileNetV2 — лёгкая (для мобильных устройств)\nmobilenet = MobileNetV2(weights=None, include_top=False, input_shape=(224, 224, 3))\nprint(f"MobileNetV2: {mobilenet.count_params():,} параметров")\n\nprint("\\nВыбор архитектуры:")\nprint("  VGG16 — простая, хороша для обучения")\nprint("  ResNet50 — глубокая, для сложных задач")\nprint("  MobileNetV2 — для мобильных/edge устройств")\nprint("  EfficientNet — лучший баланс точности и скорости")' },
        { type: 'list', value: [
          'VGG: простая архитектура, но много параметров (138M)',
          'ResNet: skip connections позволяют обучать сети в 100+ слоёв',
          'MobileNet: depthwise separable convolutions, в 10x меньше параметров',
          'EfficientNet: автоматический подбор ширины, глубины и разрешения'
        ] }
      ]
    },
    {
      id: 5,
      title: 'Визуализация фильтров CNN',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Что видит нейросеть?' },
        { type: 'code', language: 'python', value: 'import tensorflow as tf\nfrom tensorflow.keras import layers, Sequential, Model\nimport numpy as np\nimport matplotlib.pyplot as plt\n\n# Обучаем CNN на MNIST\n(X_train, y_train), (X_test, y_test) = tf.keras.datasets.mnist.load_data()\nX_train = X_train.reshape(-1, 28, 28, 1).astype("float32") / 255.0\nX_test = X_test.reshape(-1, 28, 28, 1).astype("float32") / 255.0\n\nmodel = Sequential([\n    layers.Conv2D(16, (3, 3), activation="relu", input_shape=(28, 28, 1), name="conv1"),\n    layers.MaxPooling2D((2, 2)),\n    layers.Conv2D(32, (3, 3), activation="relu", name="conv2"),\n    layers.Flatten(),\n    layers.Dense(64, activation="relu"),\n    layers.Dense(10, activation="softmax")\n])\nmodel.compile(optimizer="adam", loss="sparse_categorical_crossentropy", metrics=["accuracy"])\nmodel.fit(X_train, y_train, epochs=3, batch_size=64, verbose=0)\n\n# Извлечение промежуточных активаций\nlayer_outputs = [layer.output for layer in model.layers if "conv" in layer.name]\nactivation_model = Model(inputs=model.input, outputs=layer_outputs)\n\n# Активации для одного изображения\ntest_image = X_test[0:1]\nactivations = activation_model.predict(test_image, verbose=0)\n\n# Визуализация фильтров первого свёрточного слоя\nfig, axes = plt.subplots(2, 8, figsize=(16, 4))\nfor i in range(16):\n    ax = axes[i // 8, i % 8]\n    ax.imshow(activations[0][0, :, :, i], cmap="viridis")\n    ax.axis("off")\n    ax.set_title(f"F{i}")\nplt.suptitle("Активации первого свёрточного слоя")\nplt.show()\nprint(f"Число: {y_test[0]}")' }
      ]
    },
    {
      id: 6,
      title: 'Практика: CNN для CIFAR-10',
      type: 'practice',
      difficulty: 'hard',
      description: 'Постройте CNN для классификации изображений CIFAR-10 (10 классов: самолёты, автомобили, птицы и т.д.).',
      requirements: [
        'Загрузите CIFAR-10 из tf.keras.datasets',
        'Нормализуйте пиксели к [0, 1]',
        'Создайте CNN: 3 блока Conv2D+MaxPool, затем Dense(128)+Dropout(0.5)+Dense(10)',
        'Добавьте Data Augmentation (RandomFlip, RandomRotation)',
        'Обучите на 20 эпохах с EarlyStopping и выведите test accuracy'
      ],
      hint: 'CIFAR-10 изображения размером 32x32x3. Используйте Conv2D(32), Conv2D(64), Conv2D(128) с ядром (3,3). Не забудьте Flatten перед Dense.',
      expectedOutput: 'Train: (50000, 32, 32, 3)\nTest: (10000, 32, 32, 3)\nTest accuracy: ~0.70-0.75',
      solution: 'import tensorflow as tf\nfrom tensorflow.keras import layers, Sequential\nfrom tensorflow.keras.callbacks import EarlyStopping\n\n(X_train, y_train), (X_test, y_test) = tf.keras.datasets.cifar10.load_data()\nX_train = X_train.astype("float32") / 255.0\nX_test = X_test.astype("float32") / 255.0\nprint(f"Train: {X_train.shape}")\nprint(f"Test: {X_test.shape}")\n\nmodel = Sequential([\n    layers.RandomFlip("horizontal"),\n    layers.RandomRotation(0.1),\n    \n    layers.Conv2D(32, (3, 3), activation="relu", padding="same", input_shape=(32, 32, 3)),\n    layers.MaxPooling2D((2, 2)),\n    layers.Conv2D(64, (3, 3), activation="relu", padding="same"),\n    layers.MaxPooling2D((2, 2)),\n    layers.Conv2D(128, (3, 3), activation="relu", padding="same"),\n    layers.MaxPooling2D((2, 2)),\n    \n    layers.Flatten(),\n    layers.Dense(128, activation="relu"),\n    layers.Dropout(0.5),\n    layers.Dense(10, activation="softmax")\n])\n\nmodel.compile(optimizer="adam", loss="sparse_categorical_crossentropy", metrics=["accuracy"])\n\nearly_stop = EarlyStopping(monitor="val_loss", patience=5, restore_best_weights=True)\nhistory = model.fit(X_train, y_train, epochs=20, batch_size=64,\n                    validation_split=0.1, callbacks=[early_stop], verbose=1)\n\ntest_loss, test_acc = model.evaluate(X_test, y_test, verbose=0)\nprint(f"\\nTest accuracy: {test_acc:.4f}")',
      explanation: 'CIFAR-10 сложнее MNIST: цветные изображения 32x32 с 10 разными классами объектов. CNN с Data Augmentation достигает ~70-75% accuracy за 20 эпох. Для лучших результатов (90%+) нужны более глубокие архитектуры (ResNet) или Transfer Learning из предобученных моделей.'
    }
  ]
}
