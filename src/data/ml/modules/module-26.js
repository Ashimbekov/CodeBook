export default {
  id: 26,
  title: 'Gradient Boosting: XGBoost, LightGBM, CatBoost',
  description: 'Теория gradient boosting и практика работы с тремя ведущими библиотеками: XGBoost, LightGBM и CatBoost.',
  lessons: [
    {
      id: 1,
      title: 'Теория Gradient Boosting',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Как работает Gradient Boosting' },
        { type: 'text', value: 'Gradient Boosting — это ансамблевый метод, который последовательно строит слабые модели (обычно деревья решений), каждая из которых исправляет ошибки предыдущих. В отличие от Random Forest (параллельное построение), boosting строит деревья одно за другим, минимизируя функцию потерь с помощью градиентного спуска.' },
        { type: 'code', language: 'python', value: 'import numpy as np\nfrom sklearn.tree import DecisionTreeRegressor\n\n# Простая реализация Gradient Boosting для регрессии\nclass SimpleGradientBoosting:\n    def __init__(self, n_estimators=100, learning_rate=0.1, max_depth=3):\n        self.n_estimators = n_estimators\n        self.lr = learning_rate\n        self.max_depth = max_depth\n        self.trees = []\n        self.initial_prediction = None\n    \n    def fit(self, X, y):\n        # Начальное предсказание — среднее значение\n        self.initial_prediction = np.mean(y)\n        current_pred = np.full(len(y), self.initial_prediction)\n        \n        for i in range(self.n_estimators):\n            # Вычисляем остатки (отрицательный градиент MSE)\n            residuals = y - current_pred\n            \n            # Обучаем дерево на остатках\n            tree = DecisionTreeRegressor(max_depth=self.max_depth)\n            tree.fit(X, residuals)\n            \n            # Обновляем предсказания\n            current_pred += self.lr * tree.predict(X)\n            self.trees.append(tree)\n    \n    def predict(self, X):\n        pred = np.full(X.shape[0], self.initial_prediction)\n        for tree in self.trees:\n            pred += self.lr * tree.predict(X)\n        return pred\n\n# Пример\nfrom sklearn.datasets import make_regression\nX, y = make_regression(n_samples=500, n_features=5, noise=10, random_state=42)\n\nmodel = SimpleGradientBoosting(n_estimators=100, learning_rate=0.1, max_depth=3)\nmodel.fit(X, y)\npredictions = model.predict(X)\n\nmse = np.mean((y - predictions) ** 2)\nprint(f"MSE: {mse:.2f}")\nprint(f"Количество деревьев: {len(model.trees)}")' },
        { type: 'text', value: 'Ключевые компоненты Gradient Boosting: 1) Функция потерь (loss function) — что минимизируем. 2) Слабый обучающийся (weak learner) — обычно дерево решений. 3) Аддитивная модель — предсказания суммируются. 4) Learning rate — контролирует вклад каждого дерева.' },
        { type: 'note', value: 'Gradient Boosting склонен к переобучению, если n_estimators слишком велико или learning_rate слишком высок. Баланс между ними — ключ к хорошей модели.' }
      ]
    },
    {
      id: 2,
      title: 'XGBoost',
      type: 'theory',
      content: [
        { type: 'heading', value: 'XGBoost — eXtreme Gradient Boosting' },
        { type: 'text', value: 'XGBoost — одна из самых популярных библиотек машинного обучения. Она добавляет к классическому gradient boosting регуляризацию (L1/L2), параллельную обработку, обработку пропусков и оптимизированный алгоритм построения деревьев.' },
        { type: 'code', language: 'python', value: 'import xgboost as xgb\nimport numpy as np\nfrom sklearn.datasets import make_classification\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.metrics import accuracy_score, classification_report\n\n# Создаём данные\nX, y = make_classification(n_samples=1000, n_features=20, n_informative=10,\n                           n_redundant=5, random_state=42)\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\n\n# XGBoost с основными параметрами\nmodel = xgb.XGBClassifier(\n    n_estimators=200,           # количество деревьев\n    max_depth=6,                # глубина дерева\n    learning_rate=0.1,          # скорость обучения\n    subsample=0.8,              # доля сэмплов для каждого дерева\n    colsample_bytree=0.8,       # доля признаков для каждого дерева\n    reg_alpha=0.1,              # L1 регуляризация\n    reg_lambda=1.0,             # L2 регуляризация\n    eval_metric="logloss",\n    random_state=42\n)\n\n# Обучение с early stopping\nmodel.fit(\n    X_train, y_train,\n    eval_set=[(X_test, y_test)],\n    verbose=False\n)\n\ny_pred = model.predict(X_test)\nprint(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")\nprint(f"\\nFeature importance (top-5):")\nimportances = model.feature_importances_\ntop_idx = np.argsort(importances)[::-1][:5]\nfor idx in top_idx:\n    print(f"  Feature {idx}: {importances[idx]:.4f}")\n\n# DMatrix — нативный формат XGBoost\ndtrain = xgb.DMatrix(X_train, label=y_train)\ndtest = xgb.DMatrix(X_test, label=y_test)\n\nparams = {\n    "max_depth": 6,\n    "eta": 0.1,\n    "objective": "binary:logistic",\n    "eval_metric": "auc"\n}\nresults = {}\nbooster = xgb.train(params, dtrain, num_boost_round=200,\n                    evals=[(dtest, "test")], evals_result=results,\n                    verbose_eval=False)\nprint(f"\\nBest AUC (native API): {max(results[\'test\'][\'auc\']):.4f}")' },
        { type: 'tip', value: 'XGBoost поддерживает GPU-ускорение: tree_method="gpu_hist". Это может ускорить обучение в 5-10 раз на больших датасетах.' }
      ]
    },
    {
      id: 3,
      title: 'LightGBM',
      type: 'theory',
      content: [
        { type: 'heading', value: 'LightGBM — быстрый и эффективный бустинг' },
        { type: 'text', value: 'LightGBM от Microsoft использует два ключевых алгоритма: Gradient-based One-Side Sampling (GOSS) и Exclusive Feature Bundling (EFB). Это делает его значительно быстрее XGBoost на больших данных при сопоставимом качестве. LightGBM строит деревья leaf-wise (а не level-wise), что может давать более глубокие и точные модели.' },
        { type: 'code', language: 'python', value: 'import lightgbm as lgb\nimport numpy as np\nfrom sklearn.datasets import make_classification\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.metrics import accuracy_score, roc_auc_score\n\nX, y = make_classification(n_samples=5000, n_features=30, n_informative=15,\n                           random_state=42)\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\n\n# LightGBM — sklearn API\nmodel = lgb.LGBMClassifier(\n    n_estimators=300,\n    max_depth=-1,               # без ограничения (leaf-wise)\n    num_leaves=31,              # главный параметр сложности\n    learning_rate=0.05,\n    subsample=0.8,\n    colsample_bytree=0.8,\n    min_child_samples=20,       # минимум сэмплов в листе\n    reg_alpha=0.1,\n    reg_lambda=0.1,\n    random_state=42,\n    verbose=-1\n)\n\nmodel.fit(\n    X_train, y_train,\n    eval_set=[(X_test, y_test)],\n    callbacks=[lgb.log_evaluation(0)]\n)\n\ny_pred = model.predict(X_test)\ny_prob = model.predict_proba(X_test)[:, 1]\n\nprint(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")\nprint(f"ROC-AUC: {roc_auc_score(y_test, y_prob):.4f}")\n\n# Нативный API для большего контроля\ntrain_data = lgb.Dataset(X_train, label=y_train)\ntest_data = lgb.Dataset(X_test, label=y_test, reference=train_data)\n\nparams = {\n    "objective": "binary",\n    "metric": "auc",\n    "num_leaves": 31,\n    "learning_rate": 0.05,\n    "verbose": -1\n}\n\ncallbacks = [lgb.early_stopping(50), lgb.log_evaluation(0)]\nbooster = lgb.train(params, train_data, num_boost_round=500,\n                    valid_sets=[test_data], callbacks=callbacks)\n\nprint(f"Best iteration: {booster.best_iteration}")\nprint(f"Best AUC: {booster.best_score[\'valid_0\'][\'auc\']:.4f}")' },
        { type: 'note', value: 'В LightGBM главный параметр сложности — num_leaves, а не max_depth. Рекомендуется num_leaves < 2^max_depth для предотвращения переобучения.' }
      ]
    },
    {
      id: 4,
      title: 'CatBoost',
      type: 'theory',
      content: [
        { type: 'heading', value: 'CatBoost — бустинг с поддержкой категориальных признаков' },
        { type: 'text', value: 'CatBoost от Yandex специализируется на работе с категориальными признаками без предварительного кодирования. Он использует ordered target encoding и oblivious (symmetric) деревья решений, что даёт стабильные результаты и уменьшает переобучение.' },
        { type: 'code', language: 'python', value: 'from catboost import CatBoostClassifier, Pool\nimport numpy as np\nimport pandas as pd\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.metrics import accuracy_score, roc_auc_score\n\n# Создаём данные с категориальными признаками\nnp.random.seed(42)\nn = 2000\ndf = pd.DataFrame({\n    "age": np.random.randint(18, 70, n),\n    "salary": np.random.uniform(30000, 150000, n),\n    "city": np.random.choice(["Москва", "Питер", "Новосибирск", "Казань", "Екатеринбург"], n),\n    "education": np.random.choice(["Среднее", "Бакалавр", "Магистр", "PhD"], n),\n    "experience": np.random.randint(0, 30, n),\n    "department": np.random.choice(["IT", "Маркетинг", "Продажи", "HR", "Финансы"], n)\n})\ndf["target"] = ((df["salary"] > 80000) & (df["experience"] > 5)).astype(int)\n\nX = df.drop("target", axis=1)\ny = df["target"]\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\n\n# Указываем категориальные признаки\ncat_features = ["city", "education", "department"]\n\nmodel = CatBoostClassifier(\n    iterations=300,\n    depth=6,\n    learning_rate=0.1,\n    cat_features=cat_features,     # автоматическая обработка!\n    l2_leaf_reg=3,                 # L2 регуляризация\n    random_strength=1,             # случайность при выборе сплитов\n    bagging_temperature=0.5,       # интенсивность bagging\n    verbose=0,\n    random_seed=42\n)\n\n# Pool — нативный формат CatBoost\ntrain_pool = Pool(X_train, y_train, cat_features=cat_features)\ntest_pool = Pool(X_test, y_test, cat_features=cat_features)\n\nmodel.fit(train_pool, eval_set=test_pool)\n\ny_pred = model.predict(X_test)\ny_prob = model.predict_proba(X_test)[:, 1]\n\nprint(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")\nprint(f"ROC-AUC: {roc_auc_score(y_test, y_prob):.4f}")\n\n# Feature importance\nimportance = model.get_feature_importance()\nfor name, imp in sorted(zip(X.columns, importance), key=lambda x: -x[1]):\n    print(f"  {name}: {imp:.2f}")' },
        { type: 'tip', value: 'CatBoost — лучший выбор, когда в данных много категориальных признаков. Он автоматически обрабатывает их без One-Hot Encoding или Label Encoding.' }
      ]
    },
    {
      id: 5,
      title: 'Сравнение и тюнинг моделей',
      type: 'theory',
      content: [
        { type: 'heading', value: 'XGBoost vs LightGBM vs CatBoost' },
        { type: 'text', value: 'Все три библиотеки дают отличные результаты, но каждая имеет свои сильные стороны. XGBoost — универсальный и хорошо документированный. LightGBM — самый быстрый на больших данных. CatBoost — лучший для категориальных признаков и не требует тонкой настройки.' },
        { type: 'code', language: 'python', value: 'import numpy as np\nfrom sklearn.datasets import make_classification\nfrom sklearn.model_selection import cross_val_score, train_test_split\nimport xgboost as xgb\nimport lightgbm as lgb\nfrom catboost import CatBoostClassifier\nimport time\n\nX, y = make_classification(n_samples=5000, n_features=20, n_informative=12,\n                           random_state=42)\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\n\nmodels = {\n    "XGBoost": xgb.XGBClassifier(\n        n_estimators=200, max_depth=6, learning_rate=0.1,\n        eval_metric="logloss", random_state=42\n    ),\n    "LightGBM": lgb.LGBMClassifier(\n        n_estimators=200, num_leaves=31, learning_rate=0.1,\n        verbose=-1, random_state=42\n    ),\n    "CatBoost": CatBoostClassifier(\n        iterations=200, depth=6, learning_rate=0.1,\n        verbose=0, random_seed=42\n    )\n}\n\nprint("Сравнение библиотек Gradient Boosting:")\nprint("=" * 55)\n\nfor name, model in models.items():\n    start = time.time()\n    cv_scores = cross_val_score(model, X_train, y_train, cv=5, scoring="roc_auc")\n    elapsed = time.time() - start\n    print(f"{name:12s}: AUC={cv_scores.mean():.4f} (+/-{cv_scores.std():.4f}) | {elapsed:.2f}s")\n\nprint("\\n--- Рекомендации ---")\nprint("XGBoost:  универсальный, хорошо для Kaggle")\nprint("LightGBM: большие данные (>100k строк), быстрый")\nprint("CatBoost: категориальные признаки, мало тюнинга")\n\nprint("\\n--- Ключевые параметры для тюнинга ---")\nprint("Все: learning_rate, n_estimators")\nprint("XGBoost: max_depth, subsample, colsample_bytree, reg_alpha/lambda")\nprint("LightGBM: num_leaves, min_child_samples, subsample, colsample_bytree")\nprint("CatBoost: depth, l2_leaf_reg, bagging_temperature")' },
        { type: 'list', items: [
          'XGBoost: лучшая документация и экосистема, level-wise деревья',
          'LightGBM: самый быстрый, leaf-wise деревья, GOSS + EFB',
          'CatBoost: лучший для категорий, oblivious деревья, ordered boosting',
          'Для табличных данных все три обычно превосходят нейронные сети'
        ] },
        { type: 'warning', value: 'Не забывайте про early stopping! Без него gradient boosting легко переобучается. Всегда используйте валидационный набор для определения оптимального количества деревьев.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Сравнение бустингов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Сравните XGBoost, LightGBM и CatBoost на задаче классификации, используя cross-validation и ROC-AUC.',
      requirements: [
        'Создайте датасет make_classification с 2000 сэмплов и 15 признаками',
        'Обучите XGBoost, LightGBM и CatBoost с одинаковыми гиперпараметрами (200 деревьев, lr=0.1)',
        'Сравните с помощью 5-fold cross-validation по метрике ROC-AUC',
        'Выведите результаты для каждой модели с mean и std',
        'Определите лучшую модель'
      ],
      hint: 'Используйте cross_val_score с scoring="roc_auc". Для CatBoost установите verbose=0, для LightGBM verbose=-1.',
      expectedOutput: 'Сравнение Gradient Boosting:\nXGBoost:  AUC=0.XX (+/-0.XX)\nLightGBM: AUC=0.XX (+/-0.XX)\nCatBoost: AUC=0.XX (+/-0.XX)\nЛучшая модель: ...',
      solution: 'import numpy as np\nfrom sklearn.datasets import make_classification\nfrom sklearn.model_selection import cross_val_score\nimport xgboost as xgb\nimport lightgbm as lgb\nfrom catboost import CatBoostClassifier\n\nX, y = make_classification(n_samples=2000, n_features=15, n_informative=10,\n                           random_state=42)\n\nmodels = {\n    "XGBoost": xgb.XGBClassifier(\n        n_estimators=200, max_depth=6, learning_rate=0.1,\n        eval_metric="logloss", random_state=42\n    ),\n    "LightGBM": lgb.LGBMClassifier(\n        n_estimators=200, num_leaves=31, learning_rate=0.1,\n        verbose=-1, random_state=42\n    ),\n    "CatBoost": CatBoostClassifier(\n        iterations=200, depth=6, learning_rate=0.1,\n        verbose=0, random_seed=42\n    )\n}\n\nprint("Сравнение Gradient Boosting:")\nbest_name = ""\nbest_auc = 0\n\nfor name, model in models.items():\n    cv_scores = cross_val_score(model, X, y, cv=5, scoring="roc_auc")\n    mean_auc = cv_scores.mean()\n    print(f"{name:12s}: AUC={mean_auc:.4f} (+/-{cv_scores.std():.4f})")\n    if mean_auc > best_auc:\n        best_auc = mean_auc\n        best_name = name\n\nprint(f"\\nЛучшая модель: {best_name}")',
      explanation: 'Все три библиотеки gradient boosting дают схожие результаты на чистых числовых данных. Разница проявляется на больших датасетах (LightGBM быстрее) и на данных с категориальными признаками (CatBoost лучше). Cross-validation позволяет надёжно сравнить модели.'
    }
  ]
}
