export default {
  id: 9,
  title: 'Логистическая регрессия',
  description: 'Логистическая регрессия для задач классификации: сигмоида, функция потерь, граница решений, многоклассовая классификация.',
  lessons: [
    {
      id: 1,
      title: 'От регрессии к классификации',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Логистическая регрессия — классификатор'
        },
        {
          type: 'text',
          value: 'Несмотря на название "регрессия", логистическая регрессия — это алгоритм классификации. Она предсказывает вероятность принадлежности к классу. Идея: берём линейную комбинацию признаков (как в линейной регрессии) и пропускаем через сигмоидную функцию, которая сжимает результат в диапазон [0, 1].'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import numpy as np\nimport matplotlib.pyplot as plt\n\n# Сигмоидная функция: σ(z) = 1 / (1 + e^(-z))\ndef sigmoid(z):\n    return 1 / (1 + np.exp(-z))\n\n# Визуализация сигмоиды\nz = np.linspace(-10, 10, 100)\nplt.figure(figsize=(8, 4))\nplt.plot(z, sigmoid(z), linewidth=2)\nplt.axhline(y=0.5, color="r", linestyle="--", alpha=0.5)\nplt.axvline(x=0, color="gray", linestyle="--", alpha=0.5)\nplt.xlabel("z = w·x + b")\nplt.ylabel("σ(z) = P(y=1|x)")\nplt.title("Сигмоидная функция")\nplt.grid(True, alpha=0.3)\nplt.show()\n\n# Свойства сигмоиды:\nprint(f"σ(-∞) → 0")  # отрицательные → класс 0\nprint(f"σ(0) = {sigmoid(0)}")  # 0.5 — граница\nprint(f"σ(+∞) → 1")  # положительные → класс 1\n\n# Логистическая регрессия:\n# P(y=1|x) = σ(w·x + b)\n# Если P > 0.5 → класс 1, иначе → класс 0\n\n# Пример: вероятность поступления по баллу экзамена\nscores = np.array([30, 45, 55, 65, 70, 80, 90])\nw, b = 0.1, -6  # примерные веса\nprobs = sigmoid(w * scores + b)\n\nfor score, prob in zip(scores, probs):\n    pred = "ПРИНЯТ" if prob > 0.5 else "не принят"\n    print(f"Балл {score}: P(принят)={prob:.3f} → {pred}")'
        },
        {
          type: 'note',
          value: 'Сигмоида преобразует любое число в вероятность [0, 1]. Порог 0.5 — стандартный, но его можно изменить для балансировки precision/recall.'
        }
      ]
    },
    {
      id: 2,
      title: 'Функция потерь и обучение',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Binary Cross-Entropy Loss'
        },
        {
          type: 'text',
          value: 'Для логистической регрессии MSE не подходит (нет выпуклости). Используется Binary Cross-Entropy (Log Loss): L = -[y·log(p) + (1-y)·log(1-p)]. Эта функция сильно штрафует уверенные неправильные предсказания.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import numpy as np\n\ndef sigmoid(z):\n    return 1 / (1 + np.exp(-z))\n\ndef binary_cross_entropy(y_true, y_pred):\n    eps = 1e-15  # защита от log(0)\n    y_pred = np.clip(y_pred, eps, 1 - eps)\n    return -np.mean(y_true * np.log(y_pred) + (1 - y_true) * np.log(1 - y_pred))\n\n# Логистическая регрессия с нуля\ndef logistic_regression(X, y, lr=0.1, epochs=1000):\n    n_samples, n_features = X.shape\n    w = np.zeros(n_features)\n    b = 0.0\n    losses = []\n    \n    for epoch in range(epochs):\n        # Предсказание\n        z = X @ w + b\n        y_pred = sigmoid(z)\n        \n        # Loss\n        loss = binary_cross_entropy(y, y_pred)\n        losses.append(loss)\n        \n        # Градиенты\n        error = y_pred - y\n        dw = (1 / n_samples) * X.T @ error\n        db = (1 / n_samples) * np.sum(error)\n        \n        # Обновление\n        w -= lr * dw\n        b -= lr * db\n        \n        if epoch % 200 == 0:\n            acc = np.mean((y_pred >= 0.5).astype(int) == y)\n            print(f"Epoch {epoch}: loss={loss:.4f}, accuracy={acc:.4f}")\n    \n    return w, b, losses\n\n# Тест\nnp.random.seed(42)\nX = np.random.randn(200, 2)\ny = ((X[:, 0] + X[:, 1]) > 0).astype(int)\n\nw, b, losses = logistic_regression(X, y, lr=0.5, epochs=1000)\nprint(f"\\nВеса: {w.round(4)}, bias: {b:.4f}")\ny_pred = (sigmoid(X @ w + b) >= 0.5).astype(int)\nprint(f"Финальная accuracy: {np.mean(y_pred == y):.4f}")'
        }
      ]
    },
    {
      id: 3,
      title: 'Логистическая регрессия в sklearn',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Практическое использование'
        },
        {
          type: 'code',
          language: 'python',
          value: 'from sklearn.linear_model import LogisticRegression\nfrom sklearn.datasets import load_breast_cancer\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.metrics import (\n    accuracy_score, precision_score, recall_score, \n    f1_score, classification_report, confusion_matrix\n)\n\n# Загрузка данных (диагностика рака)\ndata = load_breast_cancer()\nX, y = data.data, data.target\n\n# Разделение и масштабирование\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\nscaler = StandardScaler()\nX_train = scaler.fit_transform(X_train)\nX_test = scaler.transform(X_test)\n\n# Обучение\nmodel = LogisticRegression(max_iter=10000, random_state=42)\nmodel.fit(X_train, y_train)\n\n# Предсказание\ny_pred = model.predict(X_test)\ny_prob = model.predict_proba(X_test)  # вероятности!\n\nprint(f"Accuracy:  {accuracy_score(y_test, y_pred):.4f}")\nprint(f"Precision: {precision_score(y_test, y_pred):.4f}")\nprint(f"Recall:    {recall_score(y_test, y_pred):.4f}")\nprint(f"F1-score:  {f1_score(y_test, y_pred):.4f}")\n\nprint(f"\\nClassification Report:")\nprint(classification_report(y_test, y_pred, target_names=data.target_names))\n\n# Вероятности предсказаний\nprint(f"\\nПримеры вероятностей:")\nfor i in range(5):\n    print(f"  P(malignant)={y_prob[i,0]:.4f}, P(benign)={y_prob[i,1]:.4f} → {data.target_names[y_pred[i]]}")'
        },
        {
          type: 'tip',
          value: 'predict_proba() возвращает вероятности для каждого класса. Это полезнее, чем predict() — можно менять порог и строить ROC-кривую.'
        }
      ]
    },
    {
      id: 4,
      title: 'Граница решений',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Decision Boundary'
        },
        {
          type: 'text',
          value: 'Граница решений — гиперплоскость, разделяющая классы. Для логистической регрессии это линия (в 2D) или плоскость (в 3D), где P(y=1) = 0.5, то есть w·x + b = 0.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import numpy as np\nimport matplotlib.pyplot as plt\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.datasets import make_classification\n\n# Генерация данных\nX, y = make_classification(n_samples=200, n_features=2, \n                           n_redundant=0, n_informative=2,\n                           random_state=42, n_clusters_per_class=1)\n\n# Обучение\nmodel = LogisticRegression()\nmodel.fit(X, y)\n\n# Визуализация границы решений\nplt.figure(figsize=(10, 6))\n\n# Сетка\nx_min, x_max = X[:, 0].min() - 1, X[:, 0].max() + 1\ny_min, y_max = X[:, 1].min() - 1, X[:, 1].max() + 1\nxx, yy = np.meshgrid(np.arange(x_min, x_max, 0.02),\n                     np.arange(y_min, y_max, 0.02))\n\n# Вероятности для сетки\nZ = model.predict_proba(np.c_[xx.ravel(), yy.ravel()])[:, 1]\nZ = Z.reshape(xx.shape)\n\n# Контурный график\nplt.contourf(xx, yy, Z, alpha=0.3, cmap="RdYlBu", levels=20)\nplt.colorbar(label="P(class=1)")\n\n# Точки данных\nplt.scatter(X[y==0, 0], X[y==0, 1], c="blue", label="Класс 0", edgecolors="k")\nplt.scatter(X[y==1, 0], X[y==1, 1], c="red", label="Класс 1", edgecolors="k")\n\n# Линия решения\nplt.contour(xx, yy, Z, levels=[0.5], colors="black\", linewidths=2)\n\nplt.xlabel("Признак 1")\nplt.ylabel("Признак 2")\nplt.title("Decision Boundary: Логистическая регрессия")\nplt.legend()\nplt.show()\n\nprint(f"Коэффициенты: {model.coef_[0].round(4)}")\nprint(f"Intercept: {model.intercept_[0]:.4f}")\nprint(f"Accuracy: {model.score(X, y):.4f}")'
        }
      ]
    },
    {
      id: 5,
      title: 'Многоклассовая классификация',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Multiclass Logistic Regression'
        },
        {
          type: 'text',
          value: 'Логистическая регрессия может работать с несколькими классами. Стратегии: One-vs-Rest (OvR) — обучаем K бинарных классификаторов, Softmax (multinomial) — обобщение сигмоиды на K классов.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'from sklearn.linear_model import LogisticRegression\nfrom sklearn.datasets import load_iris\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.metrics import classification_report\nimport numpy as np\n\n# Iris — 3 класса\niris = load_iris()\nX_train, X_test, y_train, y_test = train_test_split(\n    iris.data, iris.target, test_size=0.3, random_state=42\n)\n\n# OvR (One-vs-Rest)\nmodel_ovr = LogisticRegression(multi_class="ovr", max_iter=200)\nmodel_ovr.fit(X_train, y_train)\nprint("One-vs-Rest:")\nprint(f"Accuracy: {model_ovr.score(X_test, y_test):.4f}")\n\n# Multinomial (Softmax)\nmodel_softmax = LogisticRegression(multi_class="multinomial", max_iter=200)\nmodel_softmax.fit(X_train, y_train)\nprint(f"\\nMultinomial (Softmax):")\nprint(f"Accuracy: {model_softmax.score(X_test, y_test):.4f}")\n\n# Подробный отчёт\ny_pred = model_softmax.predict(X_test)\nprint(f"\\n{classification_report(y_test, y_pred, target_names=iris.target_names)}")\n\n# Вероятности по классам\nprobs = model_softmax.predict_proba(X_test[:3])\nfor i in range(3):\n    print(f"\\nОбъект {i}: {dict(zip(iris.target_names, probs[i].round(4)))}")\n    print(f"  Предсказание: {iris.target_names[y_pred[i]]}")\n\n# Регуляризация (C — обратная сила, 1/alpha)\nfor C in [0.01, 0.1, 1.0, 10.0]:\n    model = LogisticRegression(C=C, max_iter=200)\n    model.fit(X_train, y_train)\n    print(f"C={C:5.2f}: accuracy={model.score(X_test, y_test):.4f}")'
        },
        {
          type: 'note',
          value: 'В sklearn параметр C — обратная сила регуляризации (C = 1/alpha). Малое C = сильная регуляризация. Большое C = слабая регуляризация.'
        }
      ]
    },
    {
      id: 6,
      title: 'Практика: Классификация клиентов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Постройте модель логистической регрессии для предсказания оттока клиентов (churn). Оптимизируйте порог классификации.',
      requirements: [
        'Сгенерируйте данные: 500 клиентов с признаками: tenure (1-72 месяца), monthly_charges (20-100), total_charges',
        'Целевая: churn (1 если charges > 70 и tenure < 12, с шумом)',
        'Обучите LogisticRegression с StandardScaler',
        'Выведите classification_report',
        'Найдите оптимальный порог для максимизации F1-score (перебор от 0.1 до 0.9)'
      ],
      hint: 'total_charges = tenure * monthly_charges. Для оптимизации порога переберите значения и для каждого вычислите f1_score, используя predict_proba и сравнение с порогом.',
      expectedOutput: 'Classification Report:\n...\nОптимальный порог: 0.XX\nF1-score при порог=0.5: X.XX\nF1-score при оптимальном пороге: X.XX',
      solution: 'import numpy as np\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.metrics import classification_report, f1_score\n\nnp.random.seed(42)\nn = 500\n\ntenure = np.random.randint(1, 73, n)\nmonthly = np.random.uniform(20, 100, n)\ntotal = tenure * monthly\n\n# Churn: высокая оплата + низкий tenure\nchurn_prob = 1 / (1 + np.exp(-(monthly - 70) / 10 + (tenure - 12) / 6))\nchurn = (np.random.rand(n) < churn_prob).astype(int)\n\nX = np.column_stack([tenure, monthly, total])\ny = churn\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\n\nscaler = StandardScaler()\nX_train_sc = scaler.fit_transform(X_train)\nX_test_sc = scaler.transform(X_test)\n\nmodel = LogisticRegression(max_iter=1000, random_state=42)\nmodel.fit(X_train_sc, y_train)\n\ny_pred = model.predict(X_test_sc)\nprint("Classification Report:")\nprint(classification_report(y_test, y_pred))\n\n# Оптимизация порога\ny_prob = model.predict_proba(X_test_sc)[:, 1]\nbest_threshold = 0.5\nbest_f1 = 0\n\nfor threshold in np.arange(0.1, 0.9, 0.05):\n    y_t = (y_prob >= threshold).astype(int)\n    f1 = f1_score(y_test, y_t)\n    if f1 > best_f1:\n        best_f1 = f1\n        best_threshold = threshold\n\nf1_default = f1_score(y_test, y_pred)\nprint(f"\\nОптимальный порог: {best_threshold:.2f}")\nprint(f"F1-score при порог=0.5: {f1_default:.4f}")\nprint(f"F1-score при оптимальном пороге: {best_f1:.4f}")',
      explanation: 'Порог 0.5 не всегда оптимален, особенно при несбалансированных классах. Перебор порогов на основе predict_proba позволяет найти баланс между precision и recall, максимизируя F1-score. В бизнесе порог часто смещают: для медицинских диагнозов снижают (больше recall), для спам-фильтров повышают (больше precision).'
    }
  ]
}
