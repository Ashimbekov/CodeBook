export default {
  id: 10,
  title: 'Деревья решений и Random Forest',
  description: 'Деревья решений: принципы работы, критерии разбиения, переобучение. Random Forest как ансамбль деревьев.',
  lessons: [
    {
      id: 1,
      title: 'Принцип работы дерева решений',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Decision Tree — интуитивный алгоритм'
        },
        {
          type: 'text',
          value: 'Дерево решений разбивает данные последовательными вопросами: "признак X > порог?". Каждый узел — вопрос, ветви — ответы, листья — предсказания. Это один из немногих алгоритмов ML, который легко интерпретировать и объяснять бизнесу.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'from sklearn.tree import DecisionTreeClassifier, export_text\nfrom sklearn.datasets import load_iris\nfrom sklearn.model_selection import train_test_split\n\niris = load_iris()\nX_train, X_test, y_train, y_test = train_test_split(\n    iris.data, iris.target, test_size=0.3, random_state=42\n)\n\n# Обучение дерева\ntree = DecisionTreeClassifier(max_depth=3, random_state=42)\ntree.fit(X_train, y_train)\n\n# Текстовое представление дерева\nprint("Структура дерева:")\nprint(export_text(tree, feature_names=iris.feature_names))\n\n# Точность\nprint(f"\\nTrain accuracy: {tree.score(X_train, y_train):.4f}")\nprint(f"Test accuracy:  {tree.score(X_test, y_test):.4f}")\n\n# Важность признаков\nimport numpy as np\nfor name, imp in sorted(zip(iris.feature_names, tree.feature_importances_), \n                        key=lambda x: x[1], reverse=True):\n    print(f"  {name}: {imp:.4f}")\n\n# Предсказание\nsample = X_test[:1]\nprint(f"\\nПредсказание: {iris.target_names[tree.predict(sample)[0]]}")\nprint(f"Вероятности: {tree.predict_proba(sample)[0]}")'
        },
        {
          type: 'tip',
          value: 'Деревья решений не требуют масштабирования признаков и могут работать с категориальными данными. Они также выполняют автоматический feature selection.'
        }
      ]
    },
    {
      id: 2,
      title: 'Критерии разбиения и гиперпараметры',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Gini, Entropy и контроль сложности'
        },
        {
          type: 'text',
          value: 'Дерево выбирает признак и порог, которые лучше всего разделяют классы. Критерии: Gini Impurity (gini) — мера "нечистоты" узла, Entropy (information gain) — основан на теории информации. Оба стремятся к 0 (чистый узел) и максимальны при равномерном распределении.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import numpy as np\nfrom sklearn.tree import DecisionTreeClassifier\nfrom sklearn.datasets import load_iris\nfrom sklearn.model_selection import train_test_split, cross_val_score\n\n# Gini Impurity: 1 - Σ(pᵢ²)\ndef gini(labels):\n    classes, counts = np.unique(labels, return_counts=True)\n    probs = counts / len(labels)\n    return 1 - np.sum(probs ** 2)\n\n# Entropy: -Σ(pᵢ * log₂(pᵢ))\ndef entropy(labels):\n    classes, counts = np.unique(labels, return_counts=True)\n    probs = counts / len(labels)\n    return -np.sum(probs * np.log2(probs + 1e-10))\n\n# Примеры\nprint(f"Чистый узел [0,0,0]: gini={gini([0,0,0]):.4f}, entropy={entropy([0,0,0]):.4f}")\nprint(f"Равномерный [0,1]:   gini={gini([0,1]):.4f}, entropy={entropy([0,1]):.4f}")\nprint(f"Смешанный [0,0,1]:   gini={gini([0,0,1]):.4f}, entropy={entropy([0,0,1]):.4f}")\n\n# Влияние гиперпараметров\niris = load_iris()\nX, y = iris.data, iris.target\n\nparams = [\n    {"max_depth": None, "min_samples_leaf": 1},   # без ограничений\n    {"max_depth": 3, "min_samples_leaf": 1},       # ограничение глубины\n    {"max_depth": None, "min_samples_leaf": 10},   # мин. объектов в листе\n    {"max_depth": 5, "min_samples_leaf": 5},       # комбинация\n]\n\nprint("\\nВлияние гиперпараметров:")\nfor p in params:\n    tree = DecisionTreeClassifier(**p, random_state=42)\n    scores = cross_val_score(tree, X, y, cv=5)\n    tree.fit(X, y)\n    print(f"  depth={str(p[\'max_depth\']):5s}, min_leaf={p[\'min_samples_leaf\']}: "\n          f"CV={scores.mean():.4f}, листьев={tree.get_n_leaves()}")'
        },
        {
          type: 'warning',
          value: 'Дерево без ограничений (max_depth=None) переобучается! Оно запоминает каждый объект. Обязательно ограничивайте глубину или минимальное число объектов в листе.'
        }
      ]
    },
    {
      id: 3,
      title: 'Random Forest',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Случайный лес — ансамбль деревьев'
        },
        {
          type: 'text',
          value: 'Random Forest строит N независимых деревьев на случайных подвыборках данных (bagging) и случайных подмножествах признаков. Итоговое предсказание — голосование (классификация) или среднее (регрессия). Это уменьшает дисперсию и борется с переобучением.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'from sklearn.ensemble import RandomForestClassifier\nfrom sklearn.tree import DecisionTreeClassifier\nfrom sklearn.datasets import load_breast_cancer\nfrom sklearn.model_selection import train_test_split, cross_val_score\n\ndata = load_breast_cancer()\nX_train, X_test, y_train, y_test = train_test_split(\n    data.data, data.target, test_size=0.2, random_state=42\n)\n\n# Одно дерево vs Random Forest\ntree = DecisionTreeClassifier(random_state=42)\nforest = RandomForestClassifier(n_estimators=100, random_state=42)\n\ntree.fit(X_train, y_train)\nforest.fit(X_train, y_train)\n\nprint("Одно дерево:")\nprint(f"  Train: {tree.score(X_train, y_train):.4f}")\nprint(f"  Test:  {tree.score(X_test, y_test):.4f}")\n\nprint("\\nRandom Forest (100 деревьев):")\nprint(f"  Train: {forest.score(X_train, y_train):.4f}")\nprint(f"  Test:  {forest.score(X_test, y_test):.4f}")\n\n# Feature importance\nimport numpy as np\nimportances = forest.feature_importances_\ntop_10 = np.argsort(importances)[::-1][:10]\n\nprint("\\nТоп-10 важных признаков:")\nfor idx in top_10:\n    print(f"  {data.feature_names[idx]}: {importances[idx]:.4f}")\n\n# Кросс-валидация\nscores_tree = cross_val_score(tree, data.data, data.target, cv=5)\nscores_forest = cross_val_score(forest, data.data, data.target, cv=5)\n\nprint(f"\\nCV: Дерево = {scores_tree.mean():.4f} (+/- {scores_tree.std():.4f})")\nprint(f"CV: Forest = {scores_forest.mean():.4f} (+/- {scores_forest.std():.4f})")'
        },
        {
          type: 'note',
          value: 'Random Forest почти всегда лучше одного дерева. Он менее склонен к переобучению и даёт стабильные результаты. Это один из лучших "стартовых" алгоритмов для любой задачи.'
        }
      ]
    },
    {
      id: 4,
      title: 'Настройка гиперпараметров Random Forest',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Grid Search и важные параметры'
        },
        {
          type: 'code',
          language: 'python',
          value: 'from sklearn.ensemble import RandomForestClassifier\nfrom sklearn.datasets import load_breast_cancer\nfrom sklearn.model_selection import train_test_split, GridSearchCV\n\ndata = load_breast_cancer()\nX_train, X_test, y_train, y_test = train_test_split(\n    data.data, data.target, test_size=0.2, random_state=42\n)\n\n# Основные гиперпараметры Random Forest\nparam_grid = {\n    "n_estimators": [50, 100, 200],      # количество деревьев\n    "max_depth": [5, 10, None],           # максимальная глубина\n    "min_samples_split": [2, 5, 10],      # мин. объектов для разбиения\n    "max_features": ["sqrt", "log2"],     # число признаков в узле\n}\n\n# Grid Search с кросс-валидацией\ngrid_search = GridSearchCV(\n    RandomForestClassifier(random_state=42),\n    param_grid,\n    cv=5,\n    scoring="accuracy",\n    n_jobs=-1,    # параллельно\n    verbose=0\n)\n\ngrid_search.fit(X_train, y_train)\n\nprint(f"Лучшие параметры: {grid_search.best_params_}")\nprint(f"Лучший CV score: {grid_search.best_score_:.4f}")\nprint(f"Test score: {grid_search.score(X_test, y_test):.4f}")\n\n# Лучшая модель уже обучена\nbest_model = grid_search.best_estimator_\nprint(f"\\nДеревьев: {best_model.n_estimators}")\nprint(f"Глубина: {best_model.max_depth}")\n\n# OOB score (Out-of-Bag) — бесплатная оценка!\nrf_oob = RandomForestClassifier(\n    n_estimators=200, oob_score=True, random_state=42\n)\nrf_oob.fit(X_train, y_train)\nprint(f"\\nOOB score: {rf_oob.oob_score_:.4f}")\nprint(f"Test score: {rf_oob.score(X_test, y_test):.4f}")'
        },
        {
          type: 'tip',
          value: 'OOB (Out-of-Bag) score — уникальное преимущество Random Forest. Каждое дерево оценивается на данных, которые не попали в его bootstrap-выборку. Это как бесплатная кросс-валидация!'
        }
      ]
    },
    {
      id: 5,
      title: 'Деревья для регрессии',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Decision Tree Regressor и Random Forest Regressor'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import numpy as np\nfrom sklearn.tree import DecisionTreeRegressor\nfrom sklearn.ensemble import RandomForestRegressor\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.metrics import mean_squared_error, r2_score\nfrom sklearn.datasets import fetch_california_housing\n\n# Калифорнийские дома\nhousing = fetch_california_housing()\nX_train, X_test, y_train, y_test = train_test_split(\n    housing.data, housing.target, test_size=0.2, random_state=42\n)\n\n# Decision Tree Regressor\ntree_reg = DecisionTreeRegressor(max_depth=10, random_state=42)\ntree_reg.fit(X_train, y_train)\n\n# Random Forest Regressor\nforest_reg = RandomForestRegressor(n_estimators=100, max_depth=15, random_state=42)\nforest_reg.fit(X_train, y_train)\n\n# Сравнение\nfor name, model in [("Tree", tree_reg), ("Forest", forest_reg)]:\n    y_pred = model.predict(X_test)\n    rmse = np.sqrt(mean_squared_error(y_test, y_pred))\n    r2 = r2_score(y_test, y_pred)\n    print(f"{name:8s}: RMSE={rmse:.4f}, R²={r2:.4f}")\n\n# Feature importance\nprint("\\nВажность признаков (RF):")\nfor name, imp in sorted(zip(housing.feature_names, forest_reg.feature_importances_), \n                        key=lambda x: x[1], reverse=True):\n    print(f"  {name}: {imp:.4f}")'
        }
      ]
    },
    {
      id: 6,
      title: 'Практика: Классификация с Random Forest',
      type: 'practice',
      difficulty: 'medium',
      description: 'Обучите Random Forest на датасете Breast Cancer, найдите лучшие гиперпараметры и проанализируйте важность признаков.',
      requirements: [
        'Загрузите Breast Cancer dataset и разделите 80/20',
        'Обучите RandomForest с параметрами по умолчанию',
        'Проведите GridSearchCV по n_estimators=[50,100,200] и max_depth=[5,10,None]',
        'Выведите лучшие параметры и accuracy на тесте',
        'Выведите топ-5 самых важных признаков'
      ],
      hint: 'GridSearchCV автоматически подбирает лучшие параметры. best_estimator_ содержит лучшую модель. feature_importances_ — массив важности каждого признака.',
      expectedOutput: 'Baseline accuracy: ~0.96\nЛучшие параметры: {...}\nЛучший CV score: ~0.97\nTest accuracy: ~0.97\nТоп-5 признаков:\n  worst radius: 0.XX\n  ...',
      solution: 'from sklearn.datasets import load_breast_cancer\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.model_selection import train_test_split, GridSearchCV\nimport numpy as np\n\ndata = load_breast_cancer()\nX_train, X_test, y_train, y_test = train_test_split(\n    data.data, data.target, test_size=0.2, random_state=42\n)\n\n# Baseline\nrf_base = RandomForestClassifier(random_state=42)\nrf_base.fit(X_train, y_train)\nprint(f"Baseline accuracy: {rf_base.score(X_test, y_test):.4f}")\n\n# Grid Search\nparam_grid = {\n    "n_estimators": [50, 100, 200],\n    "max_depth": [5, 10, None]\n}\n\ngrid = GridSearchCV(RandomForestClassifier(random_state=42),\n                    param_grid, cv=5, scoring="accuracy", n_jobs=-1)\ngrid.fit(X_train, y_train)\n\nprint(f"\\nЛучшие параметры: {grid.best_params_}")\nprint(f"Лучший CV score: {grid.best_score_:.4f}")\nprint(f"Test accuracy: {grid.score(X_test, y_test):.4f}")\n\n# Топ-5 признаков\nbest_model = grid.best_estimator_\nimportances = best_model.feature_importances_\ntop_5 = np.argsort(importances)[::-1][:5]\n\nprint("\\nТоп-5 признаков:")\nfor idx in top_5:\n    print(f"  {data.feature_names[idx]}: {importances[idx]:.4f}")',
      explanation: 'Random Forest стабильно показывает высокое качество на Breast Cancer dataset. GridSearchCV перебирает все комбинации параметров с кросс-валидацией, выбирая лучшую. Feature importance показывает, какие признаки наиболее информативны для разделения классов — это полезно для интерпретации и feature selection.'
    }
  ]
}
