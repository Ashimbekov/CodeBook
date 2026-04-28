export default {
  id: 29,
  title: 'Обнаружение аномалий',
  description: 'Методы обнаружения аномалий: Isolation Forest, One-Class SVM, автоэнкодеры и метрики оценки.',
  lessons: [
    {
      id: 1,
      title: 'Типы аномалий и подходы',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Что такое аномалии и зачем их искать' },
        { type: 'text', value: 'Аномалия (outlier) — наблюдение, значительно отклоняющееся от нормального поведения данных. Обнаружение аномалий применяется для: выявления мошенничества, диагностики оборудования, кибербезопасности, контроля качества. Существуют точечные, контекстуальные и коллективные аномалии.' },
        { type: 'code', language: 'python', value: 'import numpy as np\nfrom sklearn.preprocessing import StandardScaler\n\n# Генерация данных с аномалиями\nnp.random.seed(42)\nn_normal = 950\nn_anomaly = 50\n\n# Нормальные данные (2 кластера)\nnormal_1 = np.random.multivariate_normal([2, 2], [[0.5, 0.2], [0.2, 0.5]], n_normal // 2)\nnormal_2 = np.random.multivariate_normal([6, 6], [[0.5, -0.1], [-0.1, 0.5]], n_normal // 2)\nnormal = np.vstack([normal_1, normal_2])\n\n# Аномалии — случайные точки далеко от кластеров\nanomalies = np.random.uniform(-3, 11, (n_anomaly, 2))\n\nX = np.vstack([normal, anomalies])\ny_true = np.array([0] * n_normal + [1] * n_anomaly)  # 0=нормальный, 1=аномалия\n\nprint("Датасет для обнаружения аномалий:")\nprint(f"  Нормальных: {n_normal}")\nprint(f"  Аномалий: {n_anomaly} ({n_anomaly/(n_normal+n_anomaly)*100:.1f}%)")\nprint(f"  Признаков: {X.shape[1]}")\n\n# Статистические методы\nscaler = StandardScaler()\nX_scaled = scaler.fit_transform(X)\n\n# Z-score метод\nz_scores = np.abs(X_scaled)\nz_anomalies = (z_scores > 3).any(axis=1)\nprint(f"\\nZ-score (>3): найдено {z_anomalies.sum()} аномалий")\n\n# IQR метод\nfor col in range(X.shape[1]):\n    Q1 = np.percentile(X[:, col], 25)\n    Q3 = np.percentile(X[:, col], 75)\n    IQR = Q3 - Q1\n    lower = Q1 - 1.5 * IQR\n    upper = Q3 + 1.5 * IQR\n    iqr_anomalies = (X[:, col] < lower) | (X[:, col] > upper)\n    print(f"IQR (feature {col}): {iqr_anomalies.sum()} выбросов")\n\nprint("\\n--- Подходы к обнаружению аномалий ---")\nprint("1. Статистические: Z-score, IQR, Grubbs test")\nprint("2. Proximity-based: KNN, LOF")\nprint("3. Isolation-based: Isolation Forest")\nprint("4. Model-based: One-Class SVM, Autoencoders")' },
        { type: 'list', items: [
          'Точечные аномалии — одиночные выбросы в данных',
          'Контекстуальные — нормальные в одном контексте, аномальные в другом',
          'Коллективные — группа точек, вместе образующих аномалию',
          'Supervised — есть метки аномалий (редко)',
          'Unsupervised — нет меток, ищем отклонения (часто)'
        ] }
      ]
    },
    {
      id: 2,
      title: 'Isolation Forest',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Isolation Forest — изоляция аномалий' },
        { type: 'text', value: 'Isolation Forest основан на идее: аномалии легче изолировать, чем нормальные точки. Алгоритм строит случайные деревья, разделяя данные случайными сплитами. Аномалии оказываются в изолированных листьях быстрее (за меньшее число разбиений), поэтому имеют короткий путь в дереве.' },
        { type: 'code', language: 'python', value: 'from sklearn.ensemble import IsolationForest\nimport numpy as np\nfrom sklearn.metrics import classification_report\n\n# Данные\nnp.random.seed(42)\nnormal = np.random.multivariate_normal([0, 0], [[1, 0.5], [0.5, 1]], 950)\nanomalies = np.random.uniform(-6, 6, (50, 2))\nX = np.vstack([normal, anomalies])\ny_true = np.array([1] * 950 + [-1] * 50)  # 1=нормальный, -1=аномалия\n\n# Isolation Forest\niso_forest = IsolationForest(\n    n_estimators=200,          # количество деревьев\n    max_samples="auto",        # подвыборка для каждого дерева\n    contamination=0.05,        # ожидаемая доля аномалий\n    random_state=42\n)\n\niso_forest.fit(X)\ny_pred = iso_forest.predict(X)        # 1=нормальный, -1=аномалия\nscores = iso_forest.score_samples(X)  # anomaly score (чем ниже, тем аномальнее)\n\nprint("Isolation Forest:")\nprint(f"  Найдено аномалий: {(y_pred == -1).sum()}")\nprint(f"  Истинных аномалий: {(y_true == -1).sum()}")\n\n# Классификация\nprint(f"\\n{classification_report(y_true, y_pred, target_names=[\'Аномалия\', \'Нормальный\'])}")\n\n# Анализ scores\nprint(f"Anomaly scores:")\nprint(f"  Нормальные — среднее: {scores[y_true == 1].mean():.4f}")\nprint(f"  Аномалии — среднее: {scores[y_true == -1].mean():.4f}")\n\n# Подбор contamination\nfor cont in [0.01, 0.03, 0.05, 0.1]:\n    iso = IsolationForest(contamination=cont, random_state=42)\n    iso.fit(X)\n    pred = iso.predict(X)\n    n_detected = (pred == -1).sum()\n    true_pos = ((pred == -1) & (y_true == -1)).sum()\n    print(f"  contamination={cont}: найдено={n_detected}, true positives={true_pos}")' },
        { type: 'tip', value: 'Параметр contamination — это ожидаемая доля аномалий в данных. Если не знаете, начните с 0.05 (5%). Score_samples() даёт непрерывную оценку аномальности, что полезнее бинарных меток.' }
      ]
    },
    {
      id: 3,
      title: 'One-Class SVM',
      type: 'theory',
      content: [
        { type: 'heading', value: 'One-Class SVM для обнаружения аномалий' },
        { type: 'text', value: 'One-Class SVM обучается только на нормальных данных и создаёт границу (гиперсферу) вокруг них. Точки за границей считаются аномалиями. Это подход "novelty detection" — модель знает, что такое "нормально", и отмечает всё отличающееся.' },
        { type: 'code', language: 'python', value: 'from sklearn.svm import OneClassSVM\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.neighbors import LocalOutlierFactor\nimport numpy as np\n\nnp.random.seed(42)\n\n# Только нормальные данные для обучения (novelty detection)\nX_train_normal = np.random.multivariate_normal([0, 0], [[1, 0.3], [0.3, 1]], 500)\n\n# Тест: нормальные + аномалии\nX_test_normal = np.random.multivariate_normal([0, 0], [[1, 0.3], [0.3, 1]], 200)\nX_test_anomaly = np.random.uniform(-5, 5, (30, 2))\nX_test = np.vstack([X_test_normal, X_test_anomaly])\ny_test = np.array([1] * 200 + [-1] * 30)\n\n# Нормализация\nscaler = StandardScaler()\nX_train_scaled = scaler.fit_transform(X_train_normal)\nX_test_scaled = scaler.transform(X_test)\n\n# One-Class SVM\nocsvm = OneClassSVM(\n    kernel="rbf",\n    gamma="scale",\n    nu=0.05            # верхняя граница доли аномалий\n)\nocsvm.fit(X_train_scaled)\ny_pred_svm = ocsvm.predict(X_test_scaled)\n\nprint("One-Class SVM:")\nprint(f"  Найдено аномалий: {(y_pred_svm == -1).sum()}")\ntp = ((y_pred_svm == -1) & (y_test == -1)).sum()\nfp = ((y_pred_svm == -1) & (y_test == 1)).sum()\nprint(f"  True Positives: {tp}/{(y_test == -1).sum()}")\nprint(f"  False Positives: {fp}")\n\n# Local Outlier Factor (LOF)\nlof = LocalOutlierFactor(\n    n_neighbors=20,\n    contamination=0.05,\n    novelty=True         # novelty=True для predict на новых данных\n)\nlof.fit(X_train_scaled)\ny_pred_lof = lof.predict(X_test_scaled)\n\nprint(f"\\nLocal Outlier Factor:")\nprint(f"  Найдено аномалий: {(y_pred_lof == -1).sum()}")\ntp_lof = ((y_pred_lof == -1) & (y_test == -1)).sum()\nfp_lof = ((y_pred_lof == -1) & (y_test == 1)).sum()\nprint(f"  True Positives: {tp_lof}/{(y_test == -1).sum()}")\nprint(f"  False Positives: {fp_lof}")\n\nprint("\\n--- Сравнение ---")\nprint("One-Class SVM: хорош для чётких границ, RBF ядро")\nprint("LOF: основан на локальной плотности, хорош для кластеров")' },
        { type: 'note', value: 'Novelty detection (обучение только на нормальных данных) отличается от outlier detection (аномалии могут быть в обучающих данных). One-Class SVM с novelty=True подходит для первого случая.' }
      ]
    },
    {
      id: 4,
      title: 'Автоэнкодеры для аномалий',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Обнаружение аномалий с помощью автоэнкодеров' },
        { type: 'text', value: 'Автоэнкодер обучается восстанавливать нормальные данные. Для аномалий ошибка восстановления (reconstruction error) будет высокой, так как модель не видела подобных паттернов при обучении. Это мощный подход для высокоразмерных данных.' },
        { type: 'code', language: 'python', value: 'import numpy as np\nfrom tensorflow.keras.models import Model\nfrom tensorflow.keras.layers import Input, Dense\nfrom sklearn.preprocessing import StandardScaler\n\nnp.random.seed(42)\n\n# Нормальные данные (10 признаков)\nn_features = 10\nX_normal = np.random.multivariate_normal(\n    np.zeros(n_features),\n    np.eye(n_features) * 0.5,\n    size=1000\n)\n\n# Аномалии (другое распределение)\nX_anomaly = np.random.uniform(-5, 5, (50, n_features))\n\nscaler = StandardScaler()\nX_train = scaler.fit_transform(X_normal[:800])\nX_val = scaler.transform(X_normal[800:])\nX_test_anomaly = scaler.transform(X_anomaly)\n\n# Автоэнкодер\nencoding_dim = 4  # bottleneck\n\ninputs = Input(shape=(n_features,))\nencoded = Dense(8, activation="relu")(inputs)\nencoded = Dense(encoding_dim, activation="relu")(encoded)\ndecoded = Dense(8, activation="relu")(encoded)\ndecoded = Dense(n_features, activation="linear")(decoded)\n\nautoencoder = Model(inputs, decoded)\nautoencoder.compile(optimizer="adam", loss="mse")\n\nhistory = autoencoder.fit(\n    X_train, X_train,\n    epochs=50,\n    batch_size=32,\n    validation_data=(X_val, X_val),\n    verbose=0\n)\n\n# Вычисление reconstruction error\ndef get_reconstruction_error(model, X):\n    X_pred = model.predict(X, verbose=0)\n    return np.mean((X - X_pred) ** 2, axis=1)\n\nerror_normal = get_reconstruction_error(autoencoder, X_val)\nerror_anomaly = get_reconstruction_error(autoencoder, X_test_anomaly)\n\nprint("Autoencoder Anomaly Detection:")\nprint(f"  Нормальные — средняя ошибка: {error_normal.mean():.4f} (+/- {error_normal.std():.4f})")\nprint(f"  Аномалии — средняя ошибка: {error_anomaly.mean():.4f} (+/- {error_anomaly.std():.4f})")\n\n# Порог: mean + 2*std нормальных ошибок\nthreshold = error_normal.mean() + 2 * error_normal.std()\nprint(f"\\nПорог: {threshold:.4f}")\n\ndetected_normal = (error_normal > threshold).sum()\ndetected_anomaly = (error_anomaly > threshold).sum()\n\nprint(f"  Ложные срабатывания (нормальные): {detected_normal}/{len(error_normal)}")\nprint(f"  Обнаружено аномалий: {detected_anomaly}/{len(error_anomaly)}")\nprint(f"  Precision: {detected_anomaly/(detected_anomaly+detected_normal):.4f}")\nprint(f"  Recall: {detected_anomaly/len(error_anomaly):.4f}")' },
        { type: 'tip', value: 'Выбор порога reconstruction error — ключевой момент. Используйте валидационный набор из нормальных данных: порог = mean + k*std (k=2 или 3). Также можно использовать percentile (например, 95-й).' }
      ]
    },
    {
      id: 5,
      title: 'Оценка моделей обнаружения аномалий',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Метрики и подходы к оценке' },
        { type: 'text', value: 'Оценка моделей обнаружения аномалий сложна из-за сильного дисбаланса классов: аномалий обычно менее 1-5%. Accuracy бесполезна — модель, предсказывающая "всё нормально", даст accuracy > 95%. Нужны специальные метрики: Precision, Recall, F1, PR-AUC.' },
        { type: 'code', language: 'python', value: 'import numpy as np\nfrom sklearn.metrics import (\n    precision_score, recall_score, f1_score,\n    precision_recall_curve, average_precision_score,\n    roc_auc_score, confusion_matrix\n)\n\n# Симуляция результатов\nnp.random.seed(42)\nn_normal, n_anomaly = 1000, 50\n\n# True labels: 1=аномалия, 0=нормальный\ny_true = np.array([0] * n_normal + [1] * n_anomaly)\n\n# Anomaly scores (выше = более аномально)\nscores_normal = np.random.normal(0.3, 0.15, n_normal)\nscores_anomaly = np.random.normal(0.7, 0.2, n_anomaly)\nscores = np.concatenate([scores_normal, scores_anomaly])\n\n# Разные пороги\nprint("Влияние порога на метрики:")\nprint(f"{\'Порог\':<10} {\'Precision\':<12} {\'Recall\':<10} {\'F1\':<10} {\'FP\':<8} {\'FN\':<8}\")\nprint(\"-\" * 58)\n\nfor threshold in [0.3, 0.4, 0.5, 0.6, 0.7, 0.8]:\n    y_pred = (scores > threshold).astype(int)\n    prec = precision_score(y_true, y_pred, zero_division=0)\n    rec = recall_score(y_true, y_pred, zero_division=0)\n    f1 = f1_score(y_true, y_pred, zero_division=0)\n    tn, fp, fn, tp = confusion_matrix(y_true, y_pred).ravel()\n    print(f"{threshold:<10.1f} {prec:<12.4f} {rec:<10.4f} {f1:<10.4f} {fp:<8} {fn:<8}\")\n\n# PR-AUC — лучшая метрика для anomaly detection\npr_auc = average_precision_score(y_true, scores)\nroc_auc = roc_auc_score(y_true, scores)\n\nprint(f"\\nОбщие метрики:")\nprint(f"  PR-AUC (Average Precision): {pr_auc:.4f}")\nprint(f"  ROC-AUC: {roc_auc:.4f}")\n\nprint("\\n--- Рекомендации ---")\nprint("Precision важна: когда False Positive дорого (блокировка транзакций)")\nprint("Recall важна: когда False Negative опасно (пропуск взлома)")\nprint("PR-AUC: лучше ROC-AUC при сильном дисбалансе")\nprint("F1-score: баланс между Precision и Recall")' },
        { type: 'warning', value: 'Никогда не используйте accuracy для оценки anomaly detection! При 1% аномалий модель "всё нормально" даёт accuracy 99%. Используйте PR-AUC, F1 или бизнес-метрики (стоимость пропуска аномалии vs ложного срабатывания).' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Обнаружение аномалий',
      type: 'practice',
      difficulty: 'medium',
      description: 'Примените Isolation Forest для обнаружения аномалий в синтетическом датасете и оцените результаты.',
      requirements: [
        'Создайте датасет: 900 нормальных точек (2D, нормальное распределение) и 100 аномалий (uniform)',
        'Обучите Isolation Forest с contamination=0.1',
        'Получите предсказания и anomaly scores',
        'Вычислите Precision, Recall и F1 для обнаружения аномалий',
        'Выведите confusion matrix'
      ],
      hint: 'В Isolation Forest y_pred=1 означает нормальный, y_pred=-1 означает аномалию. Для sklearn metrics переведите в 0/1 формат: (y_pred == -1).astype(int).',
      expectedOutput: 'Isolation Forest Anomaly Detection:\n  Найдено аномалий: XX\n  Precision: X.XX\n  Recall: X.XX\n  F1: X.XX\n  Confusion Matrix:\n  [[TN FP]\n   [FN TP]]',
      solution: 'import numpy as np\nfrom sklearn.ensemble import IsolationForest\nfrom sklearn.metrics import precision_score, recall_score, f1_score, confusion_matrix\n\nnp.random.seed(42)\n\nnormal = np.random.multivariate_normal([0, 0], [[1, 0.3], [0.3, 1]], 900)\nanomalies = np.random.uniform(-6, 6, (100, 2))\n\nX = np.vstack([normal, anomalies])\ny_true = np.array([0] * 900 + [1] * 100)  # 1=аномалия\n\niso = IsolationForest(n_estimators=200, contamination=0.1, random_state=42)\niso.fit(X)\n\ny_pred_iso = iso.predict(X)\ny_pred = (y_pred_iso == -1).astype(int)  # -1 -> 1 (аномалия)\n\nprec = precision_score(y_true, y_pred)\nrec = recall_score(y_true, y_pred)\nf1 = f1_score(y_true, y_pred)\ncm = confusion_matrix(y_true, y_pred)\n\nprint("Isolation Forest Anomaly Detection:")\nprint(f"  Найдено аномалий: {y_pred.sum()}")\nprint(f"  Precision: {prec:.4f}")\nprint(f"  Recall: {rec:.4f}")\nprint(f"  F1: {f1:.4f}")\nprint(f"  Confusion Matrix:")\nprint(f"  {cm}")',
      explanation: 'Isolation Forest работает без меток — это unsupervised метод. Он эффективен для обнаружения глобальных аномалий. Contamination параметр задаёт ожидаемую долю аномалий. Precision показывает, сколько найденных аномалий настоящие, Recall — сколько настоящих аномалий найдено.'
    }
  ]
}
