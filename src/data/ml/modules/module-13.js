export default {
  id: 13,
  title: 'Кластеризация: K-Means и DBSCAN',
  description: 'Алгоритмы кластеризации: K-Means, DBSCAN, оценка качества кластеризации, выбор числа кластеров.',
  lessons: [
    {
      id: 1,
      title: 'K-Means кластеризация',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'K-Means: группировка без учителя'
        },
        {
          type: 'text',
          value: 'K-Means — самый популярный алгоритм кластеризации. Он разбивает данные на K групп, минимизируя расстояние от точек до центроидов кластеров. Алгоритм: 1) Случайные центроиды. 2) Назначить каждую точку ближайшему центроиду. 3) Пересчитать центроиды как средние. 4) Повторять 2-3 до сходимости.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'from sklearn.cluster import KMeans\nfrom sklearn.datasets import make_blobs\nimport numpy as np\nimport matplotlib.pyplot as plt\n\n# Генерация данных с 3 кластерами\nX, y_true = make_blobs(n_samples=300, centers=3, cluster_std=1.0, random_state=42)\n\n# K-Means\nkmeans = KMeans(n_clusters=3, random_state=42, n_init=10)\nkmeans.fit(X)\n\nprint(f"Метки кластеров: {np.unique(kmeans.labels_)}")\nprint(f"Центроиды:\\n{kmeans.cluster_centers_}")\nprint(f"Inertia: {kmeans.inertia_:.2f}")  # сумма квадратов расстояний\n\n# Визуализация\nplt.figure(figsize=(12, 5))\n\nplt.subplot(1, 2, 1)\nplt.scatter(X[:, 0], X[:, 1], c=y_true, cmap="viridis\", s=20)\nplt.title(\"Истинные кластеры\")\n\nplt.subplot(1, 2, 2)\nplt.scatter(X[:, 0], X[:, 1], c=kmeans.labels_, cmap=\"viridis\", s=20)\nplt.scatter(kmeans.cluster_centers_[:, 0], kmeans.cluster_centers_[:, 1], \n            c=\"red\", marker=\"X\", s=200, edgecolors=\"k\", label=\"Центроиды\")\nplt.title(\"K-Means кластеры\")\nplt.legend()\n\nplt.tight_layout()\nplt.show()\n\n# Предсказание для новых точек\nnew_points = np.array([[0, 0], [5, 5], [-5, -5]])\nprint(f\"\\nКластеры новых точек: {kmeans.predict(new_points)}\")'
        },
        {
          type: 'tip',
          value: 'n_init=10 означает, что K-Means запустится 10 раз с разными начальными центроидами и выберет лучший результат. Это уменьшает зависимость от инициализации.'
        }
      ]
    },
    {
      id: 2,
      title: 'Метод локтя и Silhouette Score',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Как выбрать число кластеров K'
        },
        {
          type: 'code',
          language: 'python',
          value: 'from sklearn.cluster import KMeans\nfrom sklearn.metrics import silhouette_score\nfrom sklearn.datasets import make_blobs\nimport numpy as np\nimport matplotlib.pyplot as plt\n\nX, _ = make_blobs(n_samples=500, centers=4, cluster_std=1.0, random_state=42)\n\n# 1. Метод локтя (Elbow Method)\ninertias = []\nK_range = range(2, 11)\n\nfor k in K_range:\n    kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)\n    kmeans.fit(X)\n    inertias.append(kmeans.inertia_)\n\nplt.figure(figsize=(12, 4))\nplt.subplot(1, 2, 1)\nplt.plot(K_range, inertias, "b-o")\nplt.xlabel("K")\nplt.ylabel("Inertia")\nplt.title("Метод локтя (Elbow Method)")\nplt.grid(True, alpha=0.3)\n\n# 2. Silhouette Score\nsilhouettes = []\nfor k in K_range:\n    kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)\n    labels = kmeans.fit_predict(X)\n    sil = silhouette_score(X, labels)\n    silhouettes.append(sil)\n    print(f"K={k}: silhouette={sil:.4f}")\n\nplt.subplot(1, 2, 2)\nplt.plot(K_range, silhouettes, "r-o")\nplt.xlabel("K")\nplt.ylabel("Silhouette Score")\nplt.title("Silhouette Score")\nplt.grid(True, alpha=0.3)\n\nplt.tight_layout()\nplt.show()\n\nbest_k = K_range[np.argmax(silhouettes)]\nprint(f"\\nОптимальное K по Silhouette: {best_k}")'
        },
        {
          type: 'note',
          value: 'Silhouette Score от -1 до 1. Ближе к 1 — кластеры плотные и хорошо разделены. 0 — кластеры пересекаются. < 0 — точки в неправильных кластерах.'
        }
      ]
    },
    {
      id: 3,
      title: 'DBSCAN',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Density-Based Spatial Clustering'
        },
        {
          type: 'text',
          value: 'DBSCAN находит кластеры произвольной формы на основе плотности точек. Не требует задавать K заранее. Автоматически определяет число кластеров и выявляет выбросы (шум). Параметры: eps (радиус поиска), min_samples (минимум точек для core point).'
        },
        {
          type: 'code',
          language: 'python',
          value: 'from sklearn.cluster import DBSCAN, KMeans\nfrom sklearn.datasets import make_moons, make_blobs\nimport numpy as np\nimport matplotlib.pyplot as plt\n\n# Данные с нелинейной формой (полумесяцы)\nX_moons, _ = make_moons(n_samples=300, noise=0.1, random_state=42)\n\n# Сравнение K-Means и DBSCAN\nfig, axes = plt.subplots(1, 3, figsize=(15, 4))\n\n# Исходные данные\naxes[0].scatter(X_moons[:, 0], X_moons[:, 1], s=20)\naxes[0].set_title("Исходные данные")\n\n# K-Means (не справляется!)\nkmeans = KMeans(n_clusters=2, random_state=42, n_init=10)\naxes[1].scatter(X_moons[:, 0], X_moons[:, 1], c=kmeans.fit_predict(X_moons), cmap="viridis", s=20)\naxes[1].set_title("K-Means (некорректно)")\n\n# DBSCAN (отлично!)\ndbscan = DBSCAN(eps=0.2, min_samples=5)\nlabels = dbscan.fit_predict(X_moons)\naxes[2].scatter(X_moons[:, 0], X_moons[:, 1], c=labels, cmap="viridis", s=20)\naxes[2].set_title(f"DBSCAN (кластеров: {len(set(labels)) - (1 if -1 in labels else 0)})")\n\nplt.tight_layout()\nplt.show()\n\n# Шум и выбросы\nprint(f"Метки: {np.unique(labels)}")  # -1 = шум/выброс\nprint(f"Выбросов: {np.sum(labels == -1)}")\nprint(f"Кластеров: {len(set(labels)) - (1 if -1 in labels else 0)}")\n\n# Подбор eps\nfor eps in [0.1, 0.2, 0.3, 0.5]:\n    db = DBSCAN(eps=eps, min_samples=5)\n    lbl = db.fit_predict(X_moons)\n    n_clusters = len(set(lbl)) - (1 if -1 in lbl else 0)\n    n_noise = np.sum(lbl == -1)\n    print(f"eps={eps}: кластеров={n_clusters}, шум={n_noise}")'
        },
        {
          type: 'list',
          value: [
            'K-Means: сферические кластеры, нужно задать K, чувствителен к выбросам',
            'DBSCAN: произвольная форма, автоматическое K, выявляет выбросы',
            'eps мало: много мелких кластеров, много шума',
            'eps велико: всё в одном кластере',
            'min_samples: защита от шума, обычно 2*n_features'
          ]
        }
      ]
    },
    {
      id: 4,
      title: 'Другие алгоритмы кластеризации',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Hierarchical Clustering и сравнение методов'
        },
        {
          type: 'code',
          language: 'python',
          value: 'from sklearn.cluster import AgglomerativeClustering, KMeans, DBSCAN\nfrom sklearn.datasets import make_blobs, make_moons\nfrom sklearn.metrics import silhouette_score\nimport numpy as np\nimport matplotlib.pyplot as plt\n\n# Иерархическая кластеризация\nX, y = make_blobs(n_samples=200, centers=3, random_state=42)\n\nagg = AgglomerativeClustering(n_clusters=3, linkage="ward")\nlabels = agg.fit_predict(X)\n\nprint(f"Hierarchical: silhouette={silhouette_score(X, labels):.4f}")\n\n# Дендрограмма\nfrom scipy.cluster.hierarchy import dendrogram, linkage\n\nZ = linkage(X[:50], method="ward")  # для визуализации берём 50 точек\nplt.figure(figsize=(12, 4))\ndendrogram(Z, truncate_mode="lastp\", p=20)\nplt.title(\"Дендрограмма (Ward linkage)\")\nplt.xlabel(\"Кластер\")\nplt.ylabel(\"Расстояние\")\nplt.show()\n\n# Сравнение на разных формах данных\ndatasets = {\n    \"Blobs\": make_blobs(n_samples=300, centers=3, random_state=42),\n    \"Moons\": make_moons(n_samples=300, noise=0.1, random_state=42),\n}\n\nfor name, (X_data, _) in datasets.items():\n    print(f\"\\nДатасет: {name}\")\n    for algo_name, algo in [\n        (\"K-Means\", KMeans(n_clusters=2, random_state=42, n_init=10)),\n        (\"DBSCAN\", DBSCAN(eps=0.3, min_samples=5)),\n        (\"Hierarchical\", AgglomerativeClustering(n_clusters=2))\n    ]:\n        labels = algo.fit_predict(X_data)\n        n_clusters = len(set(labels)) - (1 if -1 in labels else 0)\n        if n_clusters > 1:\n            sil = silhouette_score(X_data, labels)\n            print(f\"  {algo_name:15s}: кластеров={n_clusters}, silhouette={sil:.4f}\")\n        else:\n            print(f\"  {algo_name:15s}: кластеров={n_clusters}\")"'
        }
      ]
    },
    {
      id: 5,
      title: 'Применение кластеризации в ML',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Практические задачи кластеризации'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import numpy as np\nfrom sklearn.cluster import KMeans\nfrom sklearn.preprocessing import StandardScaler\nimport pandas as pd\n\n# Сегментация клиентов (RFM-анализ)\nnp.random.seed(42)\nn = 500\n\ncustomers = pd.DataFrame({\n    "recency": np.random.exponential(30, n),      # дней с последней покупки\n    "frequency": np.random.poisson(5, n) + 1,      # частота покупок\n    "monetary": np.random.lognormal(7, 1, n),       # сумма покупок\n})\n\n# Масштабирование\nscaler = StandardScaler()\nX = scaler.fit_transform(customers)\n\n# Кластеризация\nkmeans = KMeans(n_clusters=4, random_state=42, n_init=10)\ncustomers["segment"] = kmeans.fit_predict(X)\n\n# Анализ сегментов\nprint("Средние значения по сегментам:")\nprint(customers.groupby("segment").mean().round(1))\nprint(f"\\nРазмер сегментов:\\n{customers[\'segment\'].value_counts().sort_index()}")\n\n# Именование сегментов\nsegment_stats = customers.groupby("segment").mean()\nfor seg in range(4):\n    r = segment_stats.loc[seg, "recency"]\n    f = segment_stats.loc[seg, "frequency"]\n    m = segment_stats.loc[seg, "monetary"]\n    \n    if f > 6 and m > 2000:\n        name = "VIP клиенты"\n    elif r < 20:\n        name = "Активные"\n    elif r > 40:\n        name = "Потерянные"\n    else:\n        name = "Обычные"\n    \n    print(f"Сегмент {seg}: {name} (R={r:.0f}, F={f:.0f}, M={m:.0f})")'
        },
        {
          type: 'tip',
          value: 'Кластеризация часто используется как этап предобработки: сегментация клиентов, обнаружение аномалий, сжатие изображений, создание новых признаков (кластерная принадлежность).'
        }
      ]
    },
    {
      id: 6,
      title: 'Практика: Сегментация данных',
      type: 'practice',
      difficulty: 'medium',
      description: 'Проведите кластерный анализ: найдите оптимальное K методом локтя и Silhouette, визуализируйте кластеры.',
      requirements: [
        'Сгенерируйте make_blobs с 500 точками, 4 центрами, 2 признаками',
        'Примените метод локтя для K от 2 до 10',
        'Вычислите Silhouette Score для каждого K',
        'Обучите K-Means с оптимальным K и визуализируйте кластеры',
        'Выведите размеры кластеров и координаты центроидов'
      ],
      hint: 'make_blobs(n_samples=500, centers=4, random_state=42). Оптимальное K — где Silhouette максимален или "локоть" на графике inertia.',
      expectedOutput: 'Оптимальное K: 4\nSilhouette Score: 0.XX\nРазмеры кластеров: [XXX, XXX, XXX, XXX]\nЦентроиды: ...',
      solution: 'import numpy as np\nimport matplotlib.pyplot as plt\nfrom sklearn.cluster import KMeans\nfrom sklearn.datasets import make_blobs\nfrom sklearn.metrics import silhouette_score\n\nX, y_true = make_blobs(n_samples=500, centers=4, random_state=42)\n\n# Метод локтя и Silhouette\nK_range = range(2, 11)\ninertias = []\nsilhouettes = []\n\nfor k in K_range:\n    km = KMeans(n_clusters=k, random_state=42, n_init=10)\n    labels = km.fit_predict(X)\n    inertias.append(km.inertia_)\n    silhouettes.append(silhouette_score(X, labels))\n\nfig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))\nax1.plot(K_range, inertias, "b-o")\nax1.set_xlabel("K")\nax1.set_ylabel("Inertia")\nax1.set_title("Метод локтя")\n\nax2.plot(K_range, silhouettes, "r-o")\nax2.set_xlabel("K")\nax2.set_ylabel("Silhouette")\nax2.set_title("Silhouette Score")\nplt.tight_layout()\nplt.savefig("clustering_metrics.png")\nplt.show()\n\nbest_k = K_range[np.argmax(silhouettes)]\nprint(f"Оптимальное K: {best_k}")\nprint(f"Silhouette Score: {max(silhouettes):.4f}")\n\nkmeans = KMeans(n_clusters=best_k, random_state=42, n_init=10)\nlabels = kmeans.fit_predict(X)\n\nprint(f"Размеры кластеров: {[np.sum(labels==i) for i in range(best_k)]}")\nprint(f"Центроиды:\\n{kmeans.cluster_centers_.round(2)}")\n\nplt.figure(figsize=(8, 6))\nplt.scatter(X[:, 0], X[:, 1], c=labels, cmap="viridis", s=20)\nplt.scatter(kmeans.cluster_centers_[:, 0], kmeans.cluster_centers_[:, 1],\n            c="red", marker="X", s=200, edgecolors="k")\nplt.title(f"K-Means (K={best_k})")\nplt.savefig("clusters.png")\nplt.show()',
      explanation: 'Метод локтя показывает, где inertia перестаёт значительно уменьшаться — это оптимальное K. Silhouette Score даёт числовую оценку качества кластеризации. Для make_blobs с 4 центрами оба метода указывают на K=4. Визуализация подтверждает правильность: кластеры компактны и хорошо разделены.'
    }
  ]
}
