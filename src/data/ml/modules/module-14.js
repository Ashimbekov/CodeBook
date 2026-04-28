export default {
  id: 14,
  title: 'Снижение размерности: PCA',
  description: 'Principal Component Analysis: теория, визуализация, выбор числа компонент, применение для визуализации и ускорения ML.',
  lessons: [
    {
      id: 1,
      title: 'Что такое PCA',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Principal Component Analysis — снижение размерности'
        },
        {
          type: 'text',
          value: 'PCA находит новые оси (главные компоненты), вдоль которых данные имеют максимальную дисперсию. Это позволяет сжать данные из N признаков в K компонент (K < N), сохранив максимум информации. Применения: визуализация высокоразмерных данных, ускорение моделей, удаление шума.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'from sklearn.decomposition import PCA\nfrom sklearn.datasets import load_iris\nfrom sklearn.preprocessing import StandardScaler\nimport matplotlib.pyplot as plt\nimport numpy as np\n\n# Iris: 4 признака -> 2 компоненты для визуализации\niris = load_iris()\nX = StandardScaler().fit_transform(iris.data)\n\npca = PCA(n_components=2)\nX_pca = pca.fit_transform(X)\n\nprint(f"Исходная размерность: {X.shape}")    # (150, 4)\nprint(f"После PCA: {X_pca.shape}")            # (150, 2)\nprint(f"Объяснённая дисперсия: {pca.explained_variance_ratio_.round(4)}")\nprint(f"Суммарная: {pca.explained_variance_ratio_.sum():.4f}")  # ~95%\n\n# Визуализация\nplt.figure(figsize=(8, 6))\nfor i, name in enumerate(iris.target_names):\n    mask = iris.target == i\n    plt.scatter(X_pca[mask, 0], X_pca[mask, 1], label=name, alpha=0.7)\n\nplt.xlabel(f"PC1 ({pca.explained_variance_ratio_[0]*100:.1f}%)")\nplt.ylabel(f"PC2 ({pca.explained_variance_ratio_[1]*100:.1f}%)")\nplt.title("PCA визуализация Iris")\nplt.legend()\nplt.grid(True, alpha=0.3)\nplt.show()\n\n# Вклад исходных признаков\nprint("\\nВклад признаков в PC1:")\nfor name, loading in zip(iris.feature_names, pca.components_[0]):\n    print(f"  {name}: {loading:.4f}")'
        },
        {
          type: 'tip',
          value: 'PCA требует стандартизации данных (StandardScaler). Без неё признак с большим масштабом будет доминировать в первых компонентах.'
        }
      ]
    },
    {
      id: 2,
      title: 'Выбор числа компонент',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Сколько компонент оставить?'
        },
        {
          type: 'code',
          language: 'python',
          value: 'from sklearn.decomposition import PCA\nfrom sklearn.datasets import load_digits\nfrom sklearn.preprocessing import StandardScaler\nimport matplotlib.pyplot as plt\nimport numpy as np\n\n# Digits: 64 признака\ndigits = load_digits()\nX = StandardScaler().fit_transform(digits.data)\n\n# PCA со всеми компонентами\npca_full = PCA()\npca_full.fit(X)\n\n# График кумулятивной объяснённой дисперсии\ncumulative_var = np.cumsum(pca_full.explained_variance_ratio_)\n\nplt.figure(figsize=(10, 5))\nplt.plot(range(1, len(cumulative_var) + 1), cumulative_var, "b-o", markersize=3)\nplt.axhline(y=0.95, color="r", linestyle="--", label="95% дисперсии")\nplt.axhline(y=0.99, color="g", linestyle="--", label="99% дисперсии")\nplt.xlabel("Число компонент")\nplt.ylabel("Кумулятивная объяснённая дисперсия")\nplt.title("Выбор числа компонент PCA\")\nplt.legend()\nplt.grid(True, alpha=0.3)\nplt.show()\n\n# Найти число для 95% дисперсии\nn_95 = np.argmax(cumulative_var >= 0.95) + 1\nn_99 = np.argmax(cumulative_var >= 0.99) + 1\nprint(f\"95% дисперсии: {n_95} компонент (из 64)\")\nprint(f\"99% дисперсии: {n_99} компонент\")\n\n# Автоматический выбор\npca_auto = PCA(n_components=0.95)  # сохранить 95% дисперсии\nX_auto = pca_auto.fit_transform(X)\nprint(f\"\\nАвтоматический (95%): {X_auto.shape[1]} компонент\")\n\n# Визуализация первых компонент\npca_2d = PCA(n_components=2)\nX_2d = pca_2d.fit_transform(X)\n\nplt.figure(figsize=(8, 6))\nscatter = plt.scatter(X_2d[:, 0], X_2d[:, 1], c=digits.target, cmap=\"tab10\", s=10, alpha=0.7)\nplt.colorbar(scatter)\nplt.title(\"Digits: PCA 2D проекция\")\nplt.show()"'
        },
        {
          type: 'note',
          value: 'Правило: сохраняйте 95-99% объяснённой дисперсии. PCA(n_components=0.95) автоматически выберет нужное число компонент.'
        }
      ]
    },
    {
      id: 3,
      title: 'PCA для ускорения ML',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'PCA как предобработка для моделей'
        },
        {
          type: 'code',
          language: 'python',
          value: 'from sklearn.decomposition import PCA\nfrom sklearn.datasets import load_digits\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.model_selection import cross_val_score\nfrom sklearn.pipeline import Pipeline\nimport numpy as np\nimport time\n\ndigits = load_digits()\nX, y = digits.data, digits.target\n\n# Без PCA (64 признака)\npipe_full = Pipeline([\n    ("scaler", StandardScaler()),\n    ("clf", LogisticRegression(max_iter=5000))\n])\n\nstart = time.time()\nscore_full = cross_val_score(pipe_full, X, y, cv=5).mean()\ntime_full = time.time() - start\n\nprint(f"Без PCA (64 признака): accuracy={score_full:.4f}, время={time_full:.2f}s")\n\n# С PCA (разное число компонент)\nfor n_comp in [10, 20, 30, 40]:\n    pipe_pca = Pipeline([\n        ("scaler", StandardScaler()),\n        ("pca", PCA(n_components=n_comp)),\n        ("clf", LogisticRegression(max_iter=5000))\n    ])\n    \n    start = time.time()\n    score_pca = cross_val_score(pipe_pca, X, y, cv=5).mean()\n    time_pca = time.time() - start\n    \n    print(f"PCA ({n_comp:2d} компонент): accuracy={score_pca:.4f}, время={time_pca:.2f}s")\n\n# PCA с 95% дисперсии\npipe_auto = Pipeline([\n    ("scaler", StandardScaler()),\n    ("pca", PCA(n_components=0.95)),\n    ("clf", LogisticRegression(max_iter=5000))\n])\nscore_auto = cross_val_score(pipe_auto, X, y, cv=5).mean()\nprint(f"\\nPCA (95% var): accuracy={score_auto:.4f}")'
        },
        {
          type: 'warning',
          value: 'PCA не всегда улучшает модель! Деревья и Random Forest не нуждаются в PCA. PCA полезен для линейных моделей, KNN и SVM при большом числе признаков.'
        }
      ]
    },
    {
      id: 4,
      title: 't-SNE и UMAP для визуализации',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Нелинейное снижение размерности'
        },
        {
          type: 'text',
          value: 't-SNE и UMAP — нелинейные методы, лучше PCA для визуализации сложных данных. Они сохраняют локальную структуру (близкие точки остаются близкими). PCA сохраняет глобальную структуру (направления максимальной дисперсии).'
        },
        {
          type: 'code',
          language: 'python',
          value: 'from sklearn.manifold import TSNE\nfrom sklearn.decomposition import PCA\nfrom sklearn.datasets import load_digits\nfrom sklearn.preprocessing import StandardScaler\nimport matplotlib.pyplot as plt\n\ndigits = load_digits()\nX = StandardScaler().fit_transform(digits.data)\ny = digits.target\n\n# PCA vs t-SNE\nfig, axes = plt.subplots(1, 2, figsize=(14, 6))\n\n# PCA\npca = PCA(n_components=2)\nX_pca = pca.fit_transform(X)\naxes[0].scatter(X_pca[:, 0], X_pca[:, 1], c=y, cmap="tab10", s=5, alpha=0.7)\naxes[0].set_title("PCA")\naxes[0].colorbar = plt.colorbar(axes[0].collections[0], ax=axes[0])\n\n# t-SNE\ntsne = TSNE(n_components=2, random_state=42, perplexity=30)\nX_tsne = tsne.fit_transform(X)\naxes[1].scatter(X_tsne[:, 0], X_tsne[:, 1], c=y, cmap="tab10", s=5, alpha=0.7)\naxes[1].set_title("t-SNE\")\nplt.colorbar(axes[1].collections[0], ax=axes[1])\n\nplt.suptitle(\"Digits: PCA vs t-SNE\", fontsize=14)\nplt.tight_layout()\nplt.show()\n\n# Параметры t-SNE\nfor perp in [5, 30, 50, 100]:\n    tsne = TSNE(n_components=2, perplexity=perp, random_state=42)\n    X_t = tsne.fit_transform(X)\n    print(f\"perplexity={perp:3d}: KL divergence={tsne.kl_divergence_:.4f}\")"'
        },
        {
          type: 'list',
          value: [
            'PCA: линейный, быстрый, сохраняет глобальную структуру, можно обратить (inverse_transform)',
            't-SNE: нелинейный, медленный, лучше визуализация, нельзя применить к новым точкам',
            'UMAP: нелинейный, быстрее t-SNE, сохраняет и локальную, и глобальную структуру',
            't-SNE/UMAP только для визуализации, не для предобработки данных в ML!'
          ]
        }
      ]
    },
    {
      id: 5,
      title: 'PCA с нуля',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Реализация PCA через NumPy'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import numpy as np\nfrom sklearn.datasets import load_iris\nfrom sklearn.preprocessing import StandardScaler\n\niris = load_iris()\nX = StandardScaler().fit_transform(iris.data)\n\n# PCA с нуля\ndef pca_from_scratch(X, n_components):\n    # 1. Ковариационная матрица\n    cov_matrix = np.cov(X, rowvar=False)\n    print(f"Ковариационная матрица ({cov_matrix.shape}):")\n    print(cov_matrix.round(3))\n    \n    # 2. Собственные значения и векторы\n    eigenvalues, eigenvectors = np.linalg.eigh(cov_matrix)\n    \n    # 3. Сортировка по убыванию\n    sorted_idx = np.argsort(eigenvalues)[::-1]\n    eigenvalues = eigenvalues[sorted_idx]\n    eigenvectors = eigenvectors[:, sorted_idx]\n    \n    # Объяснённая дисперсия\n    total_var = np.sum(eigenvalues)\n    explained_var = eigenvalues / total_var\n    print(f"\\nОбъяснённая дисперсия: {explained_var.round(4)}")\n    print(f"Кумулятивная: {np.cumsum(explained_var).round(4)}")\n    \n    # 4. Выбор K компонент\n    components = eigenvectors[:, :n_components]\n    \n    # 5. Проекция\n    X_transformed = X @ components\n    \n    return X_transformed, explained_var[:n_components], components\n\nX_pca, var_ratio, components = pca_from_scratch(X, n_components=2)\nprint(f"\\nРезультат: {X_pca.shape}")\n\n# Проверка со sklearn\nfrom sklearn.decomposition import PCA\nsklearn_pca = PCA(n_components=2)\nX_sklearn = sklearn_pca.fit_transform(X)\n\nprint(f"\\nsklearn дисперсия: {sklearn_pca.explained_variance_ratio_.round(4)}")\nprint(f"Наша дисперсия:    {var_ratio.round(4)}")\nprint(f"Результаты совпадают: {np.allclose(np.abs(X_pca), np.abs(X_sklearn))}")'
        }
      ]
    },
    {
      id: 6,
      title: 'Практика: PCA для визуализации и ML',
      type: 'practice',
      difficulty: 'medium',
      description: 'Примените PCA к датасету Digits для визуализации и ускорения классификации.',
      requirements: [
        'Загрузите digits, стандартизируйте',
        'Визуализируйте 2D PCA проекцию с раскраской по цифрам',
        'Найдите число компонент для 95% и 99% объяснённой дисперсии',
        'Сравните accuracy LogisticRegression с PCA(95%) и без PCA',
        'Измерьте время обучения обоих вариантов'
      ],
      hint: 'Используйте Pipeline для объединения PCA и классификатора. time.time() для замера времени. PCA(n_components=0.95) автоматически выберет число компонент.',
      expectedOutput: '95% дисперсии: XX компонент\n99% дисперсии: XX компонент\nБез PCA: accuracy=X.XX, время=X.XXs\nС PCA(95%): accuracy=X.XX, время=X.XXs',
      solution: 'import numpy as np\nimport matplotlib.pyplot as plt\nimport time\nfrom sklearn.datasets import load_digits\nfrom sklearn.decomposition import PCA\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.model_selection import cross_val_score\nfrom sklearn.pipeline import Pipeline\n\ndigits = load_digits()\nX = StandardScaler().fit_transform(digits.data)\ny = digits.target\n\n# 2D визуализация\npca_2d = PCA(n_components=2)\nX_2d = pca_2d.fit_transform(X)\nplt.figure(figsize=(8, 6))\nscatter = plt.scatter(X_2d[:, 0], X_2d[:, 1], c=y, cmap="tab10", s=10, alpha=0.7)\nplt.colorbar(scatter)\nplt.title("Digits: PCA 2D")\nplt.savefig("pca_digits.png")\nplt.show()\n\n# Число компонент\npca_full = PCA()\npca_full.fit(X)\ncum_var = np.cumsum(pca_full.explained_variance_ratio_)\nn_95 = np.argmax(cum_var >= 0.95) + 1\nn_99 = np.argmax(cum_var >= 0.99) + 1\nprint(f"95% дисперсии: {n_95} компонент")\nprint(f"99% дисперсии: {n_99} компонент")\n\n# Без PCA\nstart = time.time()\nscore_full = cross_val_score(LogisticRegression(max_iter=5000), X, y, cv=5).mean()\ntime_full = time.time() - start\nprint(f"\\nБез PCA: accuracy={score_full:.4f}, время={time_full:.2f}s")\n\n# С PCA(95%)\npipe = Pipeline([("pca", PCA(n_components=0.95)), ("clf", LogisticRegression(max_iter=5000))])\nstart = time.time()\nscore_pca = cross_val_score(pipe, X, y, cv=5).mean()\ntime_pca = time.time() - start\nprint(f"С PCA(95%): accuracy={score_pca:.4f}, время={time_pca:.2f}s")',
      explanation: 'PCA сжимает 64 признака до ~25-30 (для 95% дисперсии) без значительной потери accuracy. Время обучения может уменьшиться, особенно для моделей, чувствительных к размерности. 2D визуализация показывает, что цифры образуют отдельные кластеры, но некоторые перекрываются (например, 4 и 9).'
    }
  ]
}
