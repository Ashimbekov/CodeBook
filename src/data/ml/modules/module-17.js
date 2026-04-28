export default {
  id: 17,
  title: 'Нейронные сети: основы',
  description: 'Основы нейронных сетей: перцептрон, функции активации, прямое распространение, обратное распространение ошибки.',
  lessons: [
    {
      id: 1,
      title: 'Перцептрон и нейрон',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Искусственный нейрон'
        },
        {
          type: 'text',
          value: 'Нейрон — базовый элемент нейросети. Он принимает входные данные x, умножает на веса w, прибавляет смещение b, пропускает через функцию активации и выдаёт результат: output = activation(w*x + b). Перцептрон — простейшая нейросеть из одного нейрона.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import numpy as np\n\n# Простой перцептрон\nclass Perceptron:\n    def __init__(self, n_features, lr=0.01):\n        self.weights = np.random.randn(n_features) * 0.01\n        self.bias = 0.0\n        self.lr = lr\n    \n    def sigmoid(self, z):\n        return 1 / (1 + np.exp(-np.clip(z, -500, 500)))\n    \n    def predict(self, X):\n        z = X @ self.weights + self.bias\n        return self.sigmoid(z)\n    \n    def fit(self, X, y, epochs=100):\n        for epoch in range(epochs):\n            # Прямое распространение\n            y_pred = self.predict(X)\n            \n            # Ошибка\n            error = y_pred - y\n            \n            # Обратное распространение (обновление весов)\n            self.weights -= self.lr * (X.T @ error) / len(y)\n            self.bias -= self.lr * np.mean(error)\n            \n            if epoch % 20 == 0:\n                loss = -np.mean(y * np.log(y_pred + 1e-10) + (1-y) * np.log(1-y_pred + 1e-10))\n                acc = np.mean((y_pred >= 0.5).astype(int) == y)\n                print(f"Epoch {epoch}: loss={loss:.4f}, accuracy={acc:.4f}")\n\n# Тест: логическая операция OR\nX = np.array([[0,0], [0,1], [1,0], [1,1]])\ny = np.array([0, 1, 1, 1])  # OR\n\np = Perceptron(n_features=2, lr=1.0)\np.fit(X, y, epochs=100)\n\nprint("\\nПредсказания (OR):")\nfor xi, yi in zip(X, y):\n    pred = p.predict(xi.reshape(1, -1))[0]\n    print(f"  {xi} -> {pred:.4f} (ожидание: {yi})")'
        },
        {
          type: 'note',
          value: 'Один перцептрон может решить только линейно разделимые задачи (AND, OR), но не XOR. Для XOR нужна многослойная сеть.'
        }
      ]
    },
    {
      id: 2,
      title: 'Функции активации',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Нелинейность нейросетей'
        },
        {
          type: 'text',
          value: 'Функция активации добавляет нелинейность. Без неё нейросеть из нескольких слоёв эквивалентна одному линейному преобразованию. Основные активации: Sigmoid, Tanh, ReLU, Leaky ReLU, Softmax.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import numpy as np\nimport matplotlib.pyplot as plt\n\n# Функции активации\ndef sigmoid(x):\n    return 1 / (1 + np.exp(-x))\n\ndef tanh(x):\n    return np.tanh(x)\n\ndef relu(x):\n    return np.maximum(0, x)\n\ndef leaky_relu(x, alpha=0.01):\n    return np.where(x > 0, x, alpha * x)\n\ndef softmax(x):\n    exp_x = np.exp(x - np.max(x))\n    return exp_x / exp_x.sum()\n\n# Визуализация\nx = np.linspace(-5, 5, 100)\nfig, axes = plt.subplots(2, 2, figsize=(10, 8))\n\nfor ax, (name, func) in zip(axes.flatten(), \n    [("Sigmoid", sigmoid), ("Tanh", tanh), ("ReLU", relu), ("Leaky ReLU", leaky_relu)]):\n    ax.plot(x, func(x), linewidth=2)\n    ax.set_title(name)\n    ax.grid(True, alpha=0.3)\n    ax.axhline(y=0, color="k", linewidth=0.5)\n    ax.axvline(x=0, color="k", linewidth=0.5)\n\nplt.tight_layout()\nplt.show()\n\n# Softmax для многоклассовой классификации\nlogits = np.array([2.0, 1.0, 0.1])\nprobs = softmax(logits)\nprint(f"Logits: {logits}")\nprint(f"Softmax: {probs.round(4)}")\nprint(f"Сумма: {probs.sum():.4f}")\n\nprint("\\nКогда что использовать:")\nprint("Sigmoid: выходной слой бинарной классификации")\nprint("Tanh: скрытые слои (реже)")\nprint("ReLU: скрытые слои (стандарт для большинства задач)")\nprint("Softmax: выходной слой многоклассовой классификации")'
        },
        {
          type: 'tip',
          value: 'ReLU — стандарт для скрытых слоёв: простая, быстрая, не страдает от vanishing gradient. Используйте ReLU по умолчанию.'
        }
      ]
    },
    {
      id: 3,
      title: 'Многослойная нейросеть',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Forward propagation'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import numpy as np\n\nclass NeuralNetwork:\n    def __init__(self, layers):\n        """layers: список размеров слоёв, например [2, 4, 1]"""\n        self.weights = []\n        self.biases = []\n        for i in range(len(layers) - 1):\n            w = np.random.randn(layers[i], layers[i+1]) * np.sqrt(2.0 / layers[i])\n            b = np.zeros((1, layers[i+1]))\n            self.weights.append(w)\n            self.biases.append(b)\n    \n    def relu(self, z):\n        return np.maximum(0, z)\n    \n    def sigmoid(self, z):\n        return 1 / (1 + np.exp(-np.clip(z, -500, 500)))\n    \n    def forward(self, X):\n        """Прямое распространение"""\n        self.activations = [X]\n        a = X\n        for i in range(len(self.weights) - 1):\n            z = a @ self.weights[i] + self.biases[i]\n            a = self.relu(z)  # ReLU для скрытых слоёв\n            self.activations.append(a)\n        # Последний слой — sigmoid\n        z = a @ self.weights[-1] + self.biases[-1]\n        a = self.sigmoid(z)\n        self.activations.append(a)\n        return a\n\n# Пример: сеть для XOR\nnn = NeuralNetwork([2, 4, 1])  # 2 входа, 4 скрытых, 1 выход\n\nX = np.array([[0,0], [0,1], [1,0], [1,1]])\ny = np.array([[0], [1], [1], [0]])  # XOR\n\noutput = nn.forward(X)\nprint(f"Архитектура: 2 -> 4 -> 1")\nprint(f"Размеры весов: {[w.shape for w in nn.weights]}")\nprint(f"Выход (до обучения):\\n{output.round(4)}")\nprint(f"Ожидание: {y.flatten()}")'
        }
      ]
    },
    {
      id: 4,
      title: 'Backpropagation',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Обратное распространение ошибки'
        },
        {
          type: 'text',
          value: 'Backpropagation вычисляет градиенты функции потерь по всем весам сети, используя цепное правило (chain rule). Градиенты распространяются от выхода к входу: ошибка выхода -> градиенты последнего слоя -> ... -> градиенты первого слоя.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import numpy as np\n\nclass SimpleNN:\n    def __init__(self, input_size, hidden_size, output_size, lr=0.1):\n        self.W1 = np.random.randn(input_size, hidden_size) * 0.5\n        self.b1 = np.zeros((1, hidden_size))\n        self.W2 = np.random.randn(hidden_size, output_size) * 0.5\n        self.b2 = np.zeros((1, output_size))\n        self.lr = lr\n    \n    def sigmoid(self, z):\n        return 1 / (1 + np.exp(-np.clip(z, -500, 500)))\n    \n    def sigmoid_deriv(self, a):\n        return a * (1 - a)\n    \n    def forward(self, X):\n        self.z1 = X @ self.W1 + self.b1\n        self.a1 = self.sigmoid(self.z1)  # скрытый слой\n        self.z2 = self.a1 @ self.W2 + self.b2\n        self.a2 = self.sigmoid(self.z2)  # выход\n        return self.a2\n    \n    def backward(self, X, y):\n        m = len(y)\n        \n        # Градиент выходного слоя\n        dz2 = self.a2 - y  # (m, output)\n        dW2 = (self.a1.T @ dz2) / m\n        db2 = np.mean(dz2, axis=0, keepdims=True)\n        \n        # Градиент скрытого слоя (chain rule!)\n        dz1 = (dz2 @ self.W2.T) * self.sigmoid_deriv(self.a1)\n        dW1 = (X.T @ dz1) / m\n        db1 = np.mean(dz1, axis=0, keepdims=True)\n        \n        # Обновление весов\n        self.W2 -= self.lr * dW2\n        self.b2 -= self.lr * db2\n        self.W1 -= self.lr * dW1\n        self.b1 -= self.lr * db1\n    \n    def train(self, X, y, epochs=5000):\n        for epoch in range(epochs):\n            output = self.forward(X)\n            self.backward(X, y)\n            if epoch % 1000 == 0:\n                loss = -np.mean(y*np.log(output+1e-10) + (1-y)*np.log(1-output+1e-10))\n                print(f"Epoch {epoch}: loss={loss:.4f}")\n\n# XOR — задача, которую один перцептрон не решит!\nX = np.array([[0,0], [0,1], [1,0], [1,1]])\ny = np.array([[0], [1], [1], [0]])\n\nnn = SimpleNN(2, 8, 1, lr=2.0)\nnn.train(X, y, epochs=5000)\n\nprint("\\nPredictions (XOR):")\nfor xi, yi in zip(X, y):\n    pred = nn.forward(xi.reshape(1, -1))[0, 0]\n    print(f"  {xi} -> {pred:.4f} (expected: {yi[0]})")'
        },
        {
          type: 'warning',
          value: 'Vanishing gradient — проблема, когда градиенты уменьшаются до нуля в глубоких сетях с sigmoid/tanh. ReLU решает эту проблему для скрытых слоёв.'
        }
      ]
    },
    {
      id: 5,
      title: 'Нейросеть в sklearn',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'MLPClassifier и MLPRegressor'
        },
        {
          type: 'code',
          language: 'python',
          value: 'from sklearn.neural_network import MLPClassifier, MLPRegressor\nfrom sklearn.datasets import load_breast_cancer, load_digits\nfrom sklearn.model_selection import train_test_split, cross_val_score\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.pipeline import Pipeline\n\n# Классификация\ndata = load_breast_cancer()\nX_train, X_test, y_train, y_test = train_test_split(\n    data.data, data.target, test_size=0.2, random_state=42\n)\n\n# Pipeline: масштабирование + нейросеть\nmlp_pipe = Pipeline([\n    ("scaler", StandardScaler()),\n    ("mlp", MLPClassifier(\n        hidden_layer_sizes=(64, 32),  # 2 скрытых слоя: 64 и 32 нейрона\n        activation="relu",\n        solver="adam",\n        max_iter=500,\n        random_state=42\n    ))\n])\n\nmlp_pipe.fit(X_train, y_train)\nprint(f"MLP Accuracy: {mlp_pipe.score(X_test, y_test):.4f}")\n\n# Разные архитектуры\narchitectures = [\n    (32,),         # 1 слой, 32 нейрона\n    (64, 32),      # 2 слоя\n    (128, 64, 32), # 3 слоя\n]\n\nprint("\\nСравнение архитектур:")\nfor arch in architectures:\n    pipe = Pipeline([\n        ("scaler", StandardScaler()),\n        ("mlp", MLPClassifier(hidden_layer_sizes=arch, max_iter=500, random_state=42))\n    ])\n    cv = cross_val_score(pipe, X_train, y_train, cv=5).mean()\n    print(f"  {str(arch):20s}: CV={cv:.4f}")\n\n# Digits (более сложная задача)\ndigits = load_digits()\nX_d, y_d = digits.data, digits.target\n\nmlp_digits = Pipeline([\n    ("scaler", StandardScaler()),\n    ("mlp", MLPClassifier(hidden_layer_sizes=(128, 64), max_iter=500, random_state=42))\n])\ncv_digits = cross_val_score(mlp_digits, X_d, y_d, cv=5).mean()\nprint(f"\\nDigits (128, 64): CV={cv_digits:.4f}")'
        },
        {
          type: 'note',
          value: 'MLPClassifier в sklearn подходит для обучения. Для серьёзных задач (изображения, текст, большие данные) используйте TensorFlow/Keras или PyTorch.'
        }
      ]
    },
    {
      id: 6,
      title: 'Практика: Нейросеть для классификации',
      type: 'practice',
      difficulty: 'medium',
      description: 'Обучите нейросеть для распознавания рукописных цифр и подберите оптимальную архитектуру.',
      requirements: [
        'Загрузите digits dataset, стандартизируйте, разделите 80/20',
        'Обучите MLPClassifier с тремя архитектурами: (64,), (128,64), (256,128,64)',
        'Сравните accuracy и время обучения',
        'Для лучшей архитектуры выведите classification_report',
        'Визуализируйте несколько ошибок модели'
      ],
      hint: 'Используйте Pipeline с StandardScaler. time.time() для замера времени. Для ошибок: найдите индексы где y_pred != y_test.',
      expectedOutput: '(64,):         accuracy=0.97XX, время=X.Xs\n(128, 64):     accuracy=0.98XX, время=X.Xs\n(256, 128, 64): accuracy=0.98XX, время=X.Xs',
      solution: 'import numpy as np\nimport time\nfrom sklearn.datasets import load_digits\nfrom sklearn.neural_network import MLPClassifier\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.pipeline import Pipeline\nfrom sklearn.metrics import classification_report\n\ndigits = load_digits()\nX_train, X_test, y_train, y_test = train_test_split(\n    digits.data, digits.target, test_size=0.2, random_state=42\n)\n\narchitectures = [(64,), (128, 64), (256, 128, 64)]\nbest_acc = 0\nbest_arch = None\nbest_pipe = None\n\nfor arch in architectures:\n    pipe = Pipeline([\n        ("scaler", StandardScaler()),\n        ("mlp", MLPClassifier(hidden_layer_sizes=arch, max_iter=500, random_state=42))\n    ])\n    start = time.time()\n    pipe.fit(X_train, y_train)\n    elapsed = time.time() - start\n    acc = pipe.score(X_test, y_test)\n    print(f"{str(arch):20s}: accuracy={acc:.4f}, время={elapsed:.1f}s")\n    if acc > best_acc:\n        best_acc = acc\n        best_arch = arch\n        best_pipe = pipe\n\nprint(f"\\nЛучшая архитектура: {best_arch}")\ny_pred = best_pipe.predict(X_test)\nprint(classification_report(y_test, y_pred))\n\n# Ошибки\nerrors = np.where(y_pred != y_test)[0]\nprint(f"\\nОшибок: {len(errors)} из {len(y_test)}")\nfor idx in errors[:5]:\n    print(f"  Истинная: {y_test[idx]}, Предсказание: {y_pred[idx]}")',
      explanation: 'Более глубокие сети (больше слоёв и нейронов) обычно дают лучшую accuracy, но дольше обучаются и склонны к переобучению. Для digits dataset двухслойная сеть (128, 64) — хороший баланс. Ошибки модели часто возникают на "похожих" цифрах: 3 и 8, 4 и 9, что логично — они визуально схожи.'
    }
  ]
}
