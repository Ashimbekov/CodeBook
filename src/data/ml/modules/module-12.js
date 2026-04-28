export default {
  id: 12,
  title: 'K ближайших соседей (KNN)',
  description: 'KNN — алгоритм на основе расстояний: принцип работы, выбор K, метрики расстояний, взвешенный KNN.',
  lessons: [
    {
      id: 1,
      title: 'Принцип работы KNN',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'K-Nearest Neighbors — обучение без обучения'
        },
        {
          type: 'text',
          value: 'KNN — один из самых простых алгоритмов ML. Он не строит модель во время обучения (lazy learning). Для предсказания находит K ближайших соседей из обучающей выборки и определяет класс голосованием (классификация) или средним (регрессия).'
        },
        {
          type: 'code',
          language: 'python',
          value: 'from sklearn.neighbors import KNeighborsClassifier\nfrom sklearn.datasets import load_iris\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.preprocessing import StandardScaler\nimport numpy as np\n\niris = load_iris()\nX_train, X_test, y_train, y_test = train_test_split(\n    iris.data, iris.target, test_size=0.3, random_state=42\n)\n\n# Масштабирование (обязательно для KNN!)\nscaler = StandardScaler()\nX_train_sc = scaler.fit_transform(X_train)\nX_test_sc = scaler.transform(X_test)\n\n# KNN с K=5\nknn = KNeighborsClassifier(n_neighbors=5)\nknn.fit(X_train_sc, y_train)\n\nprint(f"Accuracy: {knn.score(X_test_sc, y_test):.4f}")\n\n# Предсказание с вероятностями\nsample = X_test_sc[:1]\nprint(f"\\nПредсказание: {iris.target_names[knn.predict(sample)[0]]}")\nprint(f"Вероятности: {knn.predict_proba(sample)[0].round(4)}")\n\n# Найти ближайших соседей\ndistances, indices = knn.kneighbors(sample)\nprint(f"\\n5 ближайших соседей:")\nfor d, idx in zip(distances[0], indices[0]):\n    print(f"  Индекс={idx}, расстояние={d:.4f}, класс={iris.target_names[y_train[idx]]}")'
        },
        {
          type: 'note',
          value: 'KNN хранит все обучающие данные и ищет соседей при каждом предсказании. Это делает его медленным на больших данных (O(n) на предсказание).'
        }
      ]
    },
    {
      id: 2,
      title: 'Выбор K и метрики расстояний',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Гиперпараметры KNN'
        },
        {
          type: 'code',
          language: 'python',
          value: 'from sklearn.neighbors import KNeighborsClassifier\nfrom sklearn.datasets import load_iris\nfrom sklearn.model_selection import train_test_split, cross_val_score\nfrom sklearn.preprocessing import StandardScaler\nimport numpy as np\nimport matplotlib.pyplot as plt\n\niris = load_iris()\nX = StandardScaler().fit_transform(iris.data)\ny = iris.target\n\n# Подбор K\nk_range = range(1, 31)\nscores = []\n\nfor k in k_range:\n    knn = KNeighborsClassifier(n_neighbors=k)\n    cv_scores = cross_val_score(knn, X, y, cv=10)\n    scores.append(cv_scores.mean())\n\nplt.figure(figsize=(10, 5))\nplt.plot(k_range, scores, "b-o\", markersize=4)\nplt.xlabel(\"K (число соседей)\")\nplt.ylabel(\"CV Accuracy\")\nplt.title(\"Выбор K для KNN\")\nplt.grid(True, alpha=0.3)\nplt.show()\n\nbest_k = k_range[np.argmax(scores)]\nprint(f\"Лучшее K: {best_k}, accuracy: {max(scores):.4f}\")\n\n# Метрики расстояний\nmetrics = [\"euclidean\", \"manhattan\", \"minkowski\", \"chebyshev\"]\nfor metric in metrics:\n    knn = KNeighborsClassifier(n_neighbors=best_k, metric=metric)\n    score = cross_val_score(knn, X, y, cv=5).mean()\n    print(f\"{metric:12s}: {score:.4f}\")\n\n# Взвешенный KNN (ближние соседи важнее)\nfor weights in [\"uniform\", \"distance\"]:\n    knn = KNeighborsClassifier(n_neighbors=10, weights=weights)\n    score = cross_val_score(knn, X, y, cv=5).mean()\n    print(f\"\\nweights={weights}: {score:.4f}\")"'
        },
        {
          type: 'list',
          value: [
            'K=1: запоминание данных (overfitting), шумные предсказания',
            'K большое: сглаживание (underfitting), медленнее',
            'Чётное K: возможна ничья при голосовании',
            'Euclidean: стандартное расстояние, чувствительно к масштабу',
            'Manhattan: сумма абсолютных разностей, устойчивее к выбросам',
            'weights="distance": ближние соседи голосуют с большим весом'
          ]
        }
      ]
    },
    {
      id: 3,
      title: 'KNN для регрессии',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'K-Nearest Neighbors Regressor'
        },
        {
          type: 'code',
          language: 'python',
          value: 'from sklearn.neighbors import KNeighborsRegressor\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.metrics import mean_squared_error, r2_score\nimport numpy as np\nimport matplotlib.pyplot as plt\n\n# Нелинейные данные\nnp.random.seed(42)\nX = np.sort(5 * np.random.rand(200, 1), axis=0)\ny = np.sin(X).ravel() + np.random.randn(200) * 0.1\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\n\n# Сравнение K\nplt.figure(figsize=(15, 4))\nfor i, k in enumerate([1, 5, 20]):\n    plt.subplot(1, 3, i+1)\n    knn = KNeighborsRegressor(n_neighbors=k)\n    knn.fit(X_train, y_train)\n    \n    X_plot = np.linspace(0, 5, 100).reshape(-1, 1)\n    y_plot = knn.predict(X_plot)\n    \n    rmse = np.sqrt(mean_squared_error(y_test, knn.predict(X_test)))\n    \n    plt.scatter(X_train, y_train, s=10, alpha=0.5)\n    plt.plot(X_plot, y_plot, "r-\", linewidth=2)\n    plt.title(f\"K={k}, RMSE={rmse:.3f}\")\n\nplt.tight_layout()\nplt.show()\n\n# K=1: overfitting (ступенчатая функция)\n# K=5: хорошая аппроксимация\n# K=20: слишком сглаженная (underfitting)"'
        }
      ]
    },
    {
      id: 4,
      title: 'KNN: преимущества и недостатки',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Когда использовать KNN'
        },
        {
          type: 'text',
          value: 'KNN — простой и интуитивный алгоритм, но с серьёзными ограничениями для реальных задач. Понимание его плюсов и минусов поможет выбрать правильный инструмент.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import numpy as np\nfrom sklearn.neighbors import KNeighborsClassifier\nfrom sklearn.datasets import make_classification\nfrom sklearn.preprocessing import StandardScaler\nimport time\n\n# Проблема масштабируемости\nfor n_samples in [1000, 10000, 50000]:\n    X, y = make_classification(n_samples=n_samples, n_features=20, random_state=42)\n    X = StandardScaler().fit_transform(X)\n    \n    knn = KNeighborsClassifier(n_neighbors=5)\n    \n    start = time.time()\n    knn.fit(X, y)\n    fit_time = time.time() - start\n    \n    start = time.time()\n    knn.predict(X[:100])\n    pred_time = time.time() - start\n    \n    print(f"n={n_samples:6d}: fit={fit_time:.3f}s, predict(100)={pred_time:.3f}s")\n\n# Проклятие размерности\nfrom sklearn.model_selection import cross_val_score\n\nprint("\\nВлияние числа признаков:")\nfor n_features in [2, 10, 50, 200]:\n    X, y = make_classification(n_samples=500, n_features=n_features, \n                               n_informative=5, random_state=42)\n    X = StandardScaler().fit_transform(X)\n    knn = KNeighborsClassifier(n_neighbors=5)\n    score = cross_val_score(knn, X, y, cv=5).mean()\n    print(f"  {n_features:3d} признаков: accuracy={score:.4f}")'
        },
        {
          type: 'list',
          value: [
            'Преимущества: простой, нет обучения, работает для нелинейных данных, интерпретируемый',
            'Недостатки: медленный на больших данных, чувствителен к масштабу и шуму',
            'Проклятие размерности: качество падает с ростом числа признаков',
            'Использовать когда: небольшие данные, мало признаков, нужна быстрая базовая модель',
            'Не использовать когда: большие данные, высокая размерность, нужна скорость предсказания'
          ]
        }
      ]
    },
    {
      id: 5,
      title: 'Реализация KNN с нуля',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'KNN from scratch'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import numpy as np\nfrom collections import Counter\n\nclass KNNClassifier:\n    def __init__(self, k=5):\n        self.k = k\n    \n    def fit(self, X, y):\n        self.X_train = np.array(X)\n        self.y_train = np.array(y)\n    \n    def predict(self, X):\n        X = np.array(X)\n        predictions = []\n        for x in X:\n            # Вычисляем расстояния до всех обучающих точек\n            distances = np.sqrt(np.sum((self.X_train - x) ** 2, axis=1))\n            \n            # Находим K ближайших\n            k_indices = np.argsort(distances)[:self.k]\n            k_labels = self.y_train[k_indices]\n            \n            # Голосование\n            most_common = Counter(k_labels).most_common(1)[0][0]\n            predictions.append(most_common)\n        \n        return np.array(predictions)\n\n# Тестирование\nfrom sklearn.datasets import load_iris\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.metrics import accuracy_score\n\niris = load_iris()\nX = StandardScaler().fit_transform(iris.data)\nX_train, X_test, y_train, y_test = train_test_split(X, iris.target, test_size=0.3, random_state=42)\n\nmy_knn = KNNClassifier(k=5)\nmy_knn.fit(X_train, y_train)\ny_pred = my_knn.predict(X_test)\n\nprint(f"Наш KNN accuracy: {accuracy_score(y_test, y_pred):.4f}")\n\n# Сравнение со sklearn\nfrom sklearn.neighbors import KNeighborsClassifier\nsklearn_knn = KNeighborsClassifier(n_neighbors=5)\nsklearn_knn.fit(X_train, y_train)\nprint(f"sklearn KNN accuracy: {sklearn_knn.score(X_test, y_test):.4f}")'
        }
      ]
    },
    {
      id: 6,
      title: 'Практика: KNN для классификации',
      type: 'practice',
      difficulty: 'easy',
      description: 'Подберите оптимальное K для KNN и сравните его с другими алгоритмами на датасете Iris.',
      requirements: [
        'Загрузите Iris, примените StandardScaler, разделите 70/30',
        'Переберите K от 1 до 20 и найдите оптимальное по кросс-валидации',
        'Постройте график зависимости accuracy от K',
        'Сравните лучший KNN с LogisticRegression и RandomForest',
        'Выведите таблицу сравнения алгоритмов'
      ],
      hint: 'Для каждого K вычислите cross_val_score и возьмите среднее. np.argmax() найдёт индекс максимума. Для сравнения обучите каждую модель и выведите accuracy.',
      expectedOutput: 'Лучшее K: XX\nCV accuracy при лучшем K: 0.97XX\n\nСравнение:\nKNN:        0.97XX\nLogReg:     0.97XX\nRandForest: 0.96XX',
      solution: 'import numpy as np\nimport matplotlib.pyplot as plt\nfrom sklearn.datasets import load_iris\nfrom sklearn.neighbors import KNeighborsClassifier\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.model_selection import train_test_split, cross_val_score\nfrom sklearn.preprocessing import StandardScaler\n\niris = load_iris()\nX = StandardScaler().fit_transform(iris.data)\nX_train, X_test, y_train, y_test = train_test_split(X, iris.target, test_size=0.3, random_state=42)\n\n# Подбор K\nk_range = range(1, 21)\nscores = []\nfor k in k_range:\n    knn = KNeighborsClassifier(n_neighbors=k)\n    cv = cross_val_score(knn, X_train, y_train, cv=5)\n    scores.append(cv.mean())\n\nbest_k = k_range[np.argmax(scores)]\nprint(f"Лучшее K: {best_k}")\nprint(f"CV accuracy при лучшем K: {max(scores):.4f}")\n\nplt.plot(k_range, scores, "b-o", markersize=4)\nplt.xlabel("K")\nplt.ylabel("CV Accuracy")\nplt.title("Выбор K для KNN")\nplt.grid(True)\nplt.savefig("knn_k_selection.png")\nplt.show()\n\n# Сравнение\nmodels = {\n    "KNN": KNeighborsClassifier(n_neighbors=best_k),\n    "LogReg": LogisticRegression(max_iter=200),\n    "RandForest": RandomForestClassifier(n_estimators=100, random_state=42)\n}\n\nprint("\\nСравнение:")\nfor name, model in models.items():\n    model.fit(X_train, y_train)\n    acc = model.score(X_test, y_test)\n    print(f"{name:12s}: {acc:.4f}")',
      explanation: 'Оптимальное K обычно в диапазоне 3-10 для Iris. Маленькое K (1-2) приводит к переобучению на шум, большое K — к недообучению. На простых датасетах вроде Iris все три алгоритма показывают схожие результаты. KNN проигрывает на больших данных из-за медленного предсказания.'
    }
  ]
}
