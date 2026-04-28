export default {
  id: 11,
  title: 'Метод опорных векторов (SVM)',
  description: 'Support Vector Machine: максимизация зазора, ядровые функции, SVM для классификации и регрессии.',
  lessons: [
    {
      id: 1,
      title: 'Принцип работы SVM',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Support Vector Machine — максимизация зазора'
        },
        {
          type: 'text',
          value: 'SVM ищет гиперплоскость, которая максимизирует зазор (margin) между классами. Опорные векторы (support vectors) — ближайшие к гиперплоскости точки каждого класса. Только они определяют положение границы. Большой зазор = лучшая обобщающая способность.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'from sklearn.svm import SVC\nfrom sklearn.datasets import make_classification\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.preprocessing import StandardScaler\nimport numpy as np\nimport matplotlib.pyplot as plt\n\n# Линейно разделимые данные\nX, y = make_classification(n_samples=100, n_features=2, n_redundant=0,\n                           n_informative=2, random_state=42, \n                           n_clusters_per_class=1)\n\n# SVM ТРЕБУЕТ масштабирования!\nscaler = StandardScaler()\nX_scaled = scaler.fit_transform(X)\n\n# Линейный SVM\nsvm = SVC(kernel="linear", C=1.0)\nsvm.fit(X_scaled, y)\n\nprint(f"Accuracy: {svm.score(X_scaled, y):.4f}")\nprint(f"Опорных векторов: {svm.n_support_}")  # число SV на класс\nprint(f"Коэффициенты: {svm.coef_}")\nprint(f"Intercept: {svm.intercept_}")\n\n# Визуализация\nplt.figure(figsize=(8, 6))\nplt.scatter(X_scaled[y==0, 0], X_scaled[y==0, 1], c="blue", label="Класс 0")\nplt.scatter(X_scaled[y==1, 0], X_scaled[y==1, 1], c="red", label="Класс 1")\n\n# Опорные векторы\nsv = svm.support_vectors_\nplt.scatter(sv[:, 0], sv[:, 1], s=200, facecolors="none", \n            edgecolors="k\", linewidths=2, label=\"Support Vectors\")\n\nplt.xlabel(\"Признак 1\")\nplt.ylabel(\"Признак 2\")\nplt.title(\"SVM: линейное ядро\")\nplt.legend()\nplt.show()'
        },
        {
          type: 'warning',
          value: 'SVM очень чувствителен к масштабу признаков! Всегда применяйте StandardScaler перед обучением SVM.'
        }
      ]
    },
    {
      id: 2,
      title: 'Параметр C и kernel trick',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Ядра: от линейного к нелинейному'
        },
        {
          type: 'text',
          value: 'Kernel trick позволяет SVM находить нелинейные границы решений без явного преобразования данных в высокоразмерное пространство. Основные ядра: linear (линейное), rbf (радиальная базисная функция), poly (полиномиальное).'
        },
        {
          type: 'code',
          language: 'python',
          value: 'from sklearn.svm import SVC\nfrom sklearn.datasets import make_moons, make_circles\nfrom sklearn.preprocessing import StandardScaler\nimport numpy as np\nimport matplotlib.pyplot as plt\n\n# Нелинейные данные\nX, y = make_moons(n_samples=200, noise=0.2, random_state=42)\nX = StandardScaler().fit_transform(X)\n\n# Сравнение ядер\nkernels = ["linear", "rbf", "poly"]\nfig, axes = plt.subplots(1, 3, figsize=(15, 4))\n\nfor ax, kernel in zip(axes, kernels):\n    svm = SVC(kernel=kernel, C=1.0, gamma="scale\")\n    svm.fit(X, y)\n    \n    # Decision boundary\n    xx, yy = np.meshgrid(np.arange(-3, 3, 0.02), np.arange(-3, 3, 0.02))\n    Z = svm.predict(np.c_[xx.ravel(), yy.ravel()]).reshape(xx.shape)\n    \n    ax.contourf(xx, yy, Z, alpha=0.3, cmap=\"RdYlBu\")\n    ax.scatter(X[y==0, 0], X[y==0, 1], c=\"blue\", s=20)\n    ax.scatter(X[y==1, 0], X[y==1, 1], c=\"red\", s=20)\n    ax.set_title(f\"{kernel} (acc={svm.score(X, y):.2f})\")\n\nplt.tight_layout()\nplt.show()\n\n# Влияние C (мягкость зазора)\nprint(\"Влияние C:\")\nfor C in [0.01, 0.1, 1, 10, 100]:\n    svm = SVC(kernel=\"rbf\", C=C)\n    svm.fit(X, y)\n    print(f\"  C={C:6.2f}: accuracy={svm.score(X, y):.4f}, SV={sum(svm.n_support_)}\")\n\n# Влияние gamma (для RBF)\nprint(\"\\nВлияние gamma (RBF):\")\nfor gamma in [0.01, 0.1, 1, 10]:\n    svm = SVC(kernel=\"rbf\", gamma=gamma)\n    svm.fit(X, y)\n    print(f\"  gamma={gamma:5.2f}: accuracy={svm.score(X, y):.4f}\")'
        },
        {
          type: 'list',
          value: [
            'C малое: большой зазор, допускаются ошибки (soft margin). Меньше переобучение',
            'C большое: узкий зазор, мало ошибок. Риск переобучения',
            'gamma малое (RBF): гладкая граница, простая модель',
            'gamma большое (RBF): сложная граница, подстройка под каждую точку'
          ]
        }
      ]
    },
    {
      id: 3,
      title: 'SVM для многоклассовой классификации',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Multiclass SVM и практическое применение'
        },
        {
          type: 'code',
          language: 'python',
          value: 'from sklearn.svm import SVC\nfrom sklearn.datasets import load_digits\nfrom sklearn.model_selection import train_test_split, cross_val_score\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.metrics import classification_report\nimport numpy as np\n\n# Распознавание рукописных цифр (0-9)\ndigits = load_digits()\nprint(f"Данные: {digits.data.shape}")  # (1797, 64)\nprint(f"Классы: {digits.target_names}")\n\nX_train, X_test, y_train, y_test = train_test_split(\n    digits.data, digits.target, test_size=0.2, random_state=42\n)\n\nscaler = StandardScaler()\nX_train_sc = scaler.fit_transform(X_train)\nX_test_sc = scaler.transform(X_test)\n\n# SVM с RBF ядром\nsvm = SVC(kernel="rbf", C=10, gamma="scale")\nsvm.fit(X_train_sc, y_train)\n\nprint(f"\\nAccuracy: {svm.score(X_test_sc, y_test):.4f}")\nprint(f"\\n{classification_report(y_test, svm.predict(X_test_sc))}")\n\n# SVM использует OvO (One-vs-One) для multiclass по умолчанию\n# Для 10 классов — 10*9/2 = 45 бинарных классификаторов\n\n# Вероятности (нужно probability=True)\nsvm_prob = SVC(kernel="rbf", C=10, probability=True)\nsvm_prob.fit(X_train_sc, y_train)\nprobs = svm_prob.predict_proba(X_test_sc[:3])\n\nfor i in range(3):\n    pred = svm_prob.predict(X_test_sc[i:i+1])[0]\n    confidence = probs[i].max()\n    print(f"Цифра: {y_test[i]}, предсказание: {pred}, уверенность: {confidence:.4f}")'
        },
        {
          type: 'note',
          value: 'SVM отлично работает для распознавания изображений с небольшим числом признаков. Для больших данных (>10000 объектов) SVM может быть медленным — используйте SGDClassifier.'
        }
      ]
    },
    {
      id: 4,
      title: 'SVM для регрессии (SVR)',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Support Vector Regression'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import numpy as np\nfrom sklearn.svm import SVR\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.metrics import mean_squared_error, r2_score\nimport matplotlib.pyplot as plt\n\n# Нелинейные данные\nnp.random.seed(42)\nX = np.sort(5 * np.random.rand(200, 1), axis=0)\ny = np.sin(X).ravel() + np.random.randn(200) * 0.2\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\n\nscaler = StandardScaler()\nX_train_sc = scaler.fit_transform(X_train)\nX_test_sc = scaler.transform(X_test)\n\n# Сравнение ядер SVR\nkernels = {"linear": SVR(kernel="linear", C=1.0),\n           "rbf": SVR(kernel="rbf", C=10.0, gamma="scale"),\n           "poly": SVR(kernel="poly", degree=3, C=1.0)}\n\nplt.figure(figsize=(12, 4))\nfor i, (name, model) in enumerate(kernels.items()):\n    plt.subplot(1, 3, i+1)\n    model.fit(X_train_sc, y_train)\n    \n    X_plot = np.linspace(-2, 2, 100).reshape(-1, 1)\n    y_plot = model.predict(X_plot)\n    \n    rmse = np.sqrt(mean_squared_error(y_test, model.predict(X_test_sc)))\n    r2 = r2_score(y_test, model.predict(X_test_sc))\n    \n    plt.scatter(X_train_sc, y_train, s=10, alpha=0.3)\n    plt.plot(X_plot, y_plot, "r-", linewidth=2)\n    plt.title(f"{name}\\nRMSE={rmse:.3f}, R²={r2:.3f}")\n\nplt.tight_layout()\nplt.show()'
        }
      ]
    },
    {
      id: 5,
      title: 'Оптимизация SVM',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Grid Search для SVM'
        },
        {
          type: 'code',
          language: 'python',
          value: 'from sklearn.svm import SVC\nfrom sklearn.datasets import load_breast_cancer\nfrom sklearn.model_selection import train_test_split, GridSearchCV\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.pipeline import Pipeline\n\ndata = load_breast_cancer()\nX_train, X_test, y_train, y_test = train_test_split(\n    data.data, data.target, test_size=0.2, random_state=42\n)\n\n# Pipeline: масштабирование + SVM\npipe = Pipeline([\n    ("scaler", StandardScaler()),\n    ("svm", SVC())\n])\n\n# Grid Search\nparam_grid = {\n    "svm__kernel": ["linear", "rbf"],\n    "svm__C": [0.1, 1, 10, 100],\n    "svm__gamma": ["scale", "auto", 0.01, 0.1],\n}\n\ngrid = GridSearchCV(pipe, param_grid, cv=5, scoring="accuracy", n_jobs=-1)\ngrid.fit(X_train, y_train)\n\nprint(f"Лучшие параметры: {grid.best_params_}")\nprint(f"Лучший CV score: {grid.best_score_:.4f}")\nprint(f"Test accuracy: {grid.score(X_test, y_test):.4f}")\n\n# Линейный SVM для больших данных (SGD)\nfrom sklearn.linear_model import SGDClassifier\n\nsgd = Pipeline([\n    ("scaler", StandardScaler()),\n    ("sgd", SGDClassifier(loss="hinge", max_iter=1000, random_state=42))  # hinge = SVM\n])\nsgd.fit(X_train, y_train)\nprint(f"\\nSGD (linear SVM): {sgd.score(X_test, y_test):.4f}")\nprint("SGD — быстрая альтернатива для больших данных!")'
        },
        {
          type: 'tip',
          value: 'Для больших данных (>50000 строк) используйте SGDClassifier с loss="hinge" вместо SVC. Он обучается значительно быстрее через стохастический градиентный спуск.'
        }
      ]
    },
    {
      id: 6,
      title: 'Практика: SVM для классификации',
      type: 'practice',
      difficulty: 'medium',
      description: 'Обучите SVM для классификации рукописных цифр. Сравните разные ядра и найдите оптимальные параметры.',
      requirements: [
        'Загрузите digits dataset, разделите 80/20',
        'Примените StandardScaler',
        'Обучите SVM с тремя ядрами: linear, rbf, poly',
        'Для лучшего ядра проведите GridSearchCV по C=[1,10,100] и gamma=[0.001,0.01,0.1]',
        'Выведите финальную accuracy и classification_report'
      ],
      hint: 'Для digits dataset RBF ядро обычно лучшее. Не забудьте масштабировать данные. Для GridSearchCV можно использовать Pipeline.',
      expectedOutput: 'linear: 0.97XX\nrbf: 0.98XX\npoly: 0.98XX\nЛучшее ядро: rbf\nПосле GridSearch: 0.99XX',
      solution: 'from sklearn.svm import SVC\nfrom sklearn.datasets import load_digits\nfrom sklearn.model_selection import train_test_split, GridSearchCV\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.metrics import classification_report\n\ndigits = load_digits()\nX_train, X_test, y_train, y_test = train_test_split(\n    digits.data, digits.target, test_size=0.2, random_state=42\n)\n\nscaler = StandardScaler()\nX_train_sc = scaler.fit_transform(X_train)\nX_test_sc = scaler.transform(X_test)\n\n# Сравнение ядер\nbest_kernel = ""\nbest_acc = 0\nfor kernel in ["linear", "rbf", "poly"]:\n    svm = SVC(kernel=kernel)\n    svm.fit(X_train_sc, y_train)\n    acc = svm.score(X_test_sc, y_test)\n    print(f"{kernel}: {acc:.4f}")\n    if acc > best_acc:\n        best_acc = acc\n        best_kernel = kernel\n\nprint(f"\\nЛучшее ядро: {best_kernel}")\n\n# GridSearch для лучшего ядра\nparam_grid = {"C": [1, 10, 100], "gamma": [0.001, 0.01, 0.1]}\ngrid = GridSearchCV(SVC(kernel=best_kernel), param_grid, cv=5, n_jobs=-1)\ngrid.fit(X_train_sc, y_train)\n\nprint(f"\\nЛучшие параметры: {grid.best_params_}")\nprint(f"После GridSearch: {grid.score(X_test_sc, y_test):.4f}")\nprint(f"\\n{classification_report(y_test, grid.predict(X_test_sc))}")',
      explanation: 'SVM с RBF ядром отлично подходит для распознавания цифр, так как данные нелинейно разделимы. Масштабирование критически важно для SVM. GridSearch находит оптимальное C (баланс ширины зазора) и gamma (размер области влияния каждого опорного вектора). SVM достигает ~99% точности на digits dataset.'
    }
  ]
}
