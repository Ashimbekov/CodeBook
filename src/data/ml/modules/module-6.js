export default {
  id: 6,
  title: 'Визуализация данных: Matplotlib и Seaborn',
  description: 'Визуализация данных для EDA и презентации результатов ML: графики, распределения, корреляции, визуализация моделей.',
  lessons: [
    {
      id: 1,
      title: 'Основы Matplotlib',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Matplotlib — базовая визуализация'
        },
        {
          type: 'text',
          value: 'Matplotlib — основная библиотека визуализации в Python. Понимание визуализации критически важно для EDA, анализа результатов моделей и презентации выводов. В ML мы визуализируем данные, обучение модели, метрики и предсказания.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import matplotlib.pyplot as plt\nimport numpy as np\n\n# Линейный график\nx = np.linspace(0, 10, 100)\ny1 = np.sin(x)\ny2 = np.cos(x)\n\nplt.figure(figsize=(10, 5))\nplt.plot(x, y1, label="sin(x)", color="blue", linewidth=2)\nplt.plot(x, y2, label="cos(x)", color="red", linestyle="--")\nplt.xlabel("x")\nplt.ylabel("y")\nplt.title("Тригонометрические функции")\nplt.legend()\nplt.grid(True, alpha=0.3)\nplt.savefig("plot.png", dpi=150, bbox_inches="tight")\nplt.show()\n\n# Scatter plot — для визуализации данных ML\nnp.random.seed(42)\nX = np.random.randn(100, 2)\ny = (X[:, 0] + X[:, 1] > 0).astype(int)\n\nplt.figure(figsize=(8, 6))\nplt.scatter(X[y==0, 0], X[y==0, 1], c="blue", label="Класс 0", alpha=0.6)\nplt.scatter(X[y==1, 0], X[y==1, 1], c="red", label="Класс 1", alpha=0.6)\nplt.xlabel("Признак 1")\nplt.ylabel("Признак 2")\nplt.title("Scatter plot: два класса")\nplt.legend()\nplt.show()'
        },
        {
          type: 'tip',
          value: 'figsize=(ширина, высота) в дюймах. Стандартные размеры: (10,6) для обычных графиков, (8,8) для scatter, (12,4) для временных рядов.'
        }
      ]
    },
    {
      id: 2,
      title: 'Гистограммы и распределения',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Визуализация распределений данных'
        },
        {
          type: 'text',
          value: 'В ML критически важно понимать распределение каждого признака: нормальное ли оно, есть ли выбросы, какой диапазон значений. Гистограммы и box-plot — основные инструменты.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import matplotlib.pyplot as plt\nimport numpy as np\n\nnp.random.seed(42)\n\n# Гистограмма\ndata = np.random.normal(loc=100, scale=15, size=1000)\n\nplt.figure(figsize=(12, 4))\n\nplt.subplot(1, 3, 1)\nplt.hist(data, bins=30, color="steelblue", edgecolor="white", alpha=0.7)\nplt.xlabel("Значение")\nplt.ylabel("Частота")\nplt.title("Гистограмма")\n\n# Box plot — показывает медиану, квартили, выбросы\nplt.subplot(1, 3, 2)\ndata_with_outliers = np.concatenate([data, [180, 190, 20, 10]])\nplt.boxplot(data_with_outliers, vert=True)\nplt.title("Box Plot")\nplt.ylabel("Значение")\n\n# Несколько box plots\nplt.subplot(1, 3, 3)\ngroup1 = np.random.normal(50, 10, 100)\ngroup2 = np.random.normal(70, 15, 100)\ngroup3 = np.random.normal(60, 8, 100)\nplt.boxplot([group1, group2, group3], labels=["A", "B", "C"])\nplt.title("Сравнение групп")\n\nplt.tight_layout()\nplt.show()\n\n# Subplots: гистограммы всех признаков\nfrom sklearn.datasets import load_iris\nimport pandas as pd\n\niris = load_iris()\ndf = pd.DataFrame(iris.data, columns=iris.feature_names)\n\nfig, axes = plt.subplots(2, 2, figsize=(10, 8))\nfor i, col in enumerate(df.columns):\n    ax = axes[i // 2, i % 2]\n    ax.hist(df[col], bins=20, edgecolor="white")\n    ax.set_title(col)\n    ax.set_xlabel("Значение")\nplt.tight_layout()\nplt.show()'
        }
      ]
    },
    {
      id: 3,
      title: 'Seaborn для ML',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Красивые графики с Seaborn'
        },
        {
          type: 'text',
          value: 'Seaborn — надстройка над Matplotlib с красивыми стилями и специализированными графиками для статистической визуализации. Особенно полезен для EDA в ML: тепловая карта корреляций, pairplot, violin plot.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import seaborn as sns\nimport matplotlib.pyplot as plt\nimport pandas as pd\nfrom sklearn.datasets import load_iris\n\niris = load_iris()\ndf = pd.DataFrame(iris.data, columns=iris.feature_names)\ndf["species"] = [iris.target_names[t] for t in iris.target]\n\n# 1. Тепловая карта корреляций — MUST HAVE в EDA!\nplt.figure(figsize=(8, 6))\nsns.heatmap(df.iloc[:, :4].corr(), annot=True, cmap="coolwarm", \n            center=0, fmt=".2f")\nplt.title("Матрица корреляций")\nplt.show()\n\n# 2. Pairplot — все пары признаков\nsns.pairplot(df, hue="species", diag_kind="hist")\nplt.suptitle("Pairplot Iris Dataset", y=1.02)\nplt.show()\n\n# 3. Violin plot — распределение по группам\nplt.figure(figsize=(10, 5))\nsns.violinplot(data=df, x="species", y="petal length (cm)")\nplt.title("Распределение длины лепестка по видам")\nplt.show()\n\n# 4. Scatter с регрессионной линией\nplt.figure(figsize=(8, 5))\nsns.regplot(data=df, x="petal length (cm)", y="petal width (cm)")\nplt.title("Регрессия: длина vs ширина лепестка")\nplt.show()'
        },
        {
          type: 'note',
          value: 'Тепловая карта корреляций — первое, что строят при EDA. Она моментально показывает, какие признаки связаны друг с другом и с целевой переменной.'
        }
      ]
    },
    {
      id: 4,
      title: 'Визуализация результатов ML',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Графики для анализа моделей'
        },
        {
          type: 'text',
          value: 'После обучения модели важно визуально оценить её качество: confusion matrix, ROC-кривая, learning curves, feature importance. Эти графики помогают понять сильные и слабые стороны модели.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import matplotlib.pyplot as plt\nimport numpy as np\nfrom sklearn.datasets import load_iris\nfrom sklearn.model_selection import train_test_split, learning_curve\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.metrics import confusion_matrix, ConfusionMatrixDisplay\n\n# Обучение модели\niris = load_iris()\nX_train, X_test, y_train, y_test = train_test_split(\n    iris.data, iris.target, test_size=0.3, random_state=42\n)\nmodel = RandomForestClassifier(n_estimators=100, random_state=42)\nmodel.fit(X_train, y_train)\n\n# 1. Confusion Matrix\ny_pred = model.predict(X_test)\ncm = confusion_matrix(y_test, y_pred)\ndisp = ConfusionMatrixDisplay(cm, display_labels=iris.target_names)\ndisp.plot(cmap="Blues")\nplt.title("Confusion Matrix")\nplt.show()\n\n# 2. Feature Importance\nimportances = model.feature_importances_\nindices = np.argsort(importances)[::-1]\n\nplt.figure(figsize=(8, 5))\nplt.bar(range(len(importances)), importances[indices])\nplt.xticks(range(len(importances)), \n           [iris.feature_names[i] for i in indices], rotation=45)\nplt.title("Важность признаков")\nplt.ylabel("Importance")\nplt.tight_layout()\nplt.show()\n\n# 3. Learning Curve\ntrain_sizes, train_scores, val_scores = learning_curve(\n    model, iris.data, iris.target, cv=5, \n    train_sizes=np.linspace(0.1, 1.0, 10)\n)\n\nplt.figure(figsize=(8, 5))\nplt.plot(train_sizes, train_scores.mean(axis=1), label="Train")\nplt.plot(train_sizes, val_scores.mean(axis=1), label="Validation")\nplt.xlabel("Размер обучающей выборки")\nplt.ylabel("Accuracy")\nplt.title("Learning Curve")\nplt.legend()\nplt.grid(True)\nplt.show()'
        },
        {
          type: 'tip',
          value: 'Если learning curve показывает большой разрыв между train и validation — модель переобучена. Если обе кривые низко — модель недообучена.'
        }
      ]
    },
    {
      id: 5,
      title: 'Decision boundary и 3D визуализация',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Продвинутая визуализация моделей'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import matplotlib.pyplot as plt\nimport numpy as np\nfrom sklearn.datasets import make_classification, make_blobs\nfrom sklearn.svm import SVC\nfrom sklearn.decomposition import PCA\n\n# Decision Boundary — граница решений классификатора\nX, y = make_classification(n_samples=200, n_features=2, \n                           n_redundant=0, random_state=42)\n\nmodel = SVC(kernel="rbf", C=1.0)\nmodel.fit(X, y)\n\n# Создаём сетку для визуализации\nx_min, x_max = X[:, 0].min() - 1, X[:, 0].max() + 1\ny_min, y_max = X[:, 1].min() - 1, X[:, 1].max() + 1\nxx, yy = np.meshgrid(np.arange(x_min, x_max, 0.02),\n                     np.arange(y_min, y_max, 0.02))\n\nZ = model.predict(np.c_[xx.ravel(), yy.ravel()])\nZ = Z.reshape(xx.shape)\n\nplt.figure(figsize=(10, 6))\nplt.contourf(xx, yy, Z, alpha=0.3, cmap="RdYlBu")\nplt.scatter(X[y==0, 0], X[y==0, 1], c="blue", label="Класс 0", alpha=0.6)\nplt.scatter(X[y==1, 0], X[y==1, 1], c="red", label="Класс 1", alpha=0.6)\nplt.xlabel("Признак 1")\nplt.ylabel("Признак 2")\nplt.title("Decision Boundary (SVM, RBF kernel)")\nplt.legend()\nplt.show()\n\n# 3D Scatter plot (PCA визуализация)\nfrom sklearn.datasets import load_iris\n\niris = load_iris()\npca = PCA(n_components=3)\nX_3d = pca.fit_transform(iris.data)\n\nfig = plt.figure(figsize=(10, 8))\nax = fig.add_subplot(111, projection="3d")\n\nfor i, name in enumerate(iris.target_names):\n    mask = iris.target == i\n    ax.scatter(X_3d[mask, 0], X_3d[mask, 1], X_3d[mask, 2], label=name)\n\nax.set_xlabel("PC1")\nax.set_ylabel("PC2")\nax.set_zlabel("PC3")\nax.set_title("PCA 3D визуализация Iris")\nax.legend()\nplt.show()'
        },
        {
          type: 'note',
          value: 'Decision boundary — отличный инструмент для понимания работы классификатора. Разные модели (SVM, Random Forest, KNN) создают совершенно разные формы границ.'
        }
      ]
    },
    {
      id: 6,
      title: 'Практика: EDA визуализация',
      type: 'practice',
      difficulty: 'easy',
      description: 'Проведите визуальный EDA для датасета: постройте гистограммы, scatter plot, тепловую карту корреляций и box plot.',
      requirements: [
        'Загрузите Iris dataset и создайте DataFrame',
        'Постройте гистограммы всех 4 признаков (2x2 subplots)',
        'Постройте scatter plot двух наиболее коррелированных признаков с раскраской по классам',
        'Постройте тепловую карту корреляций с аннотациями',
        'Постройте box plot для каждого признака по видам ирисов'
      ],
      hint: 'Для нахождения наиболее коррелированных признаков используйте df.corr() и найдите максимальное значение вне диагонали. Для box plot используйте seaborn.boxplot с параметром hue.',
      expectedOutput: 'Матрица корреляций построена\nНаиболее коррелированные: petal length (cm) и petal width (cm), r=0.96\n4 графика сохранены',
      solution: 'import matplotlib.pyplot as plt\nimport seaborn as sns\nimport pandas as pd\nimport numpy as np\nfrom sklearn.datasets import load_iris\n\niris = load_iris()\ndf = pd.DataFrame(iris.data, columns=iris.feature_names)\ndf["species"] = [iris.target_names[t] for t in iris.target]\n\n# 1. Гистограммы\nfig, axes = plt.subplots(2, 2, figsize=(10, 8))\nfor i, col in enumerate(iris.feature_names):\n    ax = axes[i // 2, i % 2]\n    for species in iris.target_names:\n        ax.hist(df[df["species"] == species][col], bins=15, alpha=0.5, label=species)\n    ax.set_title(col)\n    ax.legend()\nplt.tight_layout()\nplt.savefig("histograms.png")\nplt.show()\n\n# 2. Наиболее коррелированные признаки\ncorr = df.iloc[:, :4].corr()\nnp.fill_diagonal(corr.values, 0)\nmax_corr = corr.abs().max().max()\nidx = np.unravel_index(corr.abs().values.argmax(), corr.shape)\nfeat1, feat2 = corr.columns[idx[0]], corr.columns[idx[1]]\nprint(f"Наиболее коррелированные: {feat1} и {feat2}, r={corr.iloc[idx[0], idx[1]]:.2f}")\n\nplt.figure(figsize=(8, 6))\nfor species in iris.target_names:\n    mask = df["species"] == species\n    plt.scatter(df[mask][feat1], df[mask][feat2], label=species, alpha=0.6)\nplt.xlabel(feat1)\nplt.ylabel(feat2)\nplt.legend()\nplt.title("Scatter: наиболее коррелированные признаки")\nplt.savefig("scatter.png")\nplt.show()\n\n# 3. Тепловая карта\nplt.figure(figsize=(8, 6))\nsns.heatmap(df.iloc[:, :4].corr(), annot=True, cmap="coolwarm", fmt=".2f")\nplt.title("Матрица корреляций")\nplt.savefig("heatmap.png")\nplt.show()\nprint("Матрица корреляций построена")\n\n# 4. Box plot\nfig, axes = plt.subplots(1, 4, figsize=(16, 4))\nfor i, col in enumerate(iris.feature_names):\n    sns.boxplot(data=df, x="species", y=col, ax=axes[i])\n    axes[i].set_title(col)\nplt.tight_layout()\nplt.savefig("boxplots.png")\nplt.show()\nprint("4 графика сохранены")',
      explanation: 'EDA визуализация помогает быстро понять данные: гистограммы показывают распределения и разделимость классов, scatter plot — связь между признаками, тепловая карта — корреляции, box plot — разброс и выбросы по группам. Petal length и petal width наиболее коррелированы (r=0.96) и лучше всего разделяют виды ирисов.'
    }
  ]
}
