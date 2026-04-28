export default {
  id: 16,
  title: 'Ансамблевые методы',
  description: 'Bagging, Boosting, Stacking: Random Forest, AdaBoost, Gradient Boosting, XGBoost, LightGBM, CatBoost.',
  lessons: [
    {
      id: 1,
      title: 'Bagging и Random Forest',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Bootstrap Aggregating'
        },
        {
          type: 'text',
          value: 'Ансамблевые методы объединяют несколько моделей для получения лучшего результата. Bagging (Bootstrap Aggregating) обучает N моделей на случайных подвыборках данных (с возвратом) и усредняет их предсказания. Это уменьшает дисперсию (variance) и борется с переобучением.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'from sklearn.ensemble import BaggingClassifier, RandomForestClassifier\nfrom sklearn.tree import DecisionTreeClassifier\nfrom sklearn.datasets import load_breast_cancer\nfrom sklearn.model_selection import train_test_split, cross_val_score\n\ndata = load_breast_cancer()\nX_train, X_test, y_train, y_test = train_test_split(\n    data.data, data.target, test_size=0.2, random_state=42\n)\n\n# Одно дерево\ntree = DecisionTreeClassifier(random_state=42)\ntree_score = cross_val_score(tree, X_train, y_train, cv=5).mean()\n\n# Bagging из деревьев\nbagging = BaggingClassifier(\n    estimator=DecisionTreeClassifier(),\n    n_estimators=100,\n    max_samples=0.8,     # 80% данных в каждом bootstrap\n    max_features=0.8,    # 80% признаков\n    random_state=42\n)\nbagging_score = cross_val_score(bagging, X_train, y_train, cv=5).mean()\n\n# Random Forest (оптимизированный bagging)\nrf = RandomForestClassifier(n_estimators=100, random_state=42)\nrf_score = cross_val_score(rf, X_train, y_train, cv=5).mean()\n\nprint(f"Одно дерево:    CV={tree_score:.4f}")\nprint(f"Bagging (100):  CV={bagging_score:.4f}")\nprint(f"Random Forest:  CV={rf_score:.4f}")\n\n# Все модели на тесте\nfor name, model in [("Tree", tree), ("Bagging", bagging), ("RF", rf)]:\n    model.fit(X_train, y_train)\n    print(f"\\n{name}: Test accuracy={model.score(X_test, y_test):.4f}")'
        },
        {
          type: 'note',
          value: 'Random Forest — это оптимизированный Bagging из деревьев решений с дополнительной рандомизацией по признакам в каждом узле.'
        }
      ]
    },
    {
      id: 2,
      title: 'Boosting: AdaBoost и Gradient Boosting',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Последовательное обучение'
        },
        {
          type: 'text',
          value: 'Boosting обучает модели последовательно: каждая следующая модель фокусируется на ошибках предыдущей. AdaBoost увеличивает веса неправильно классифицированных объектов. Gradient Boosting оптимизирует функцию потерь градиентным спуском.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'from sklearn.ensemble import (\n    AdaBoostClassifier, GradientBoostingClassifier, RandomForestClassifier\n)\nfrom sklearn.datasets import load_breast_cancer\nfrom sklearn.model_selection import train_test_split, cross_val_score\n\ndata = load_breast_cancer()\nX_train, X_test, y_train, y_test = train_test_split(\n    data.data, data.target, test_size=0.2, random_state=42\n)\n\n# AdaBoost\nada = AdaBoostClassifier(n_estimators=100, learning_rate=0.1, random_state=42)\n\n# Gradient Boosting\ngb = GradientBoostingClassifier(\n    n_estimators=100, learning_rate=0.1, max_depth=3, random_state=42\n)\n\n# Random Forest\nrf = RandomForestClassifier(n_estimators=100, random_state=42)\n\n# Сравнение\nfor name, model in [("AdaBoost", ada), ("GradBoost", gb), ("RandomForest", rf)]:\n    cv = cross_val_score(model, X_train, y_train, cv=5)\n    model.fit(X_train, y_train)\n    test_acc = model.score(X_test, y_test)\n    print(f"{name:13s}: CV={cv.mean():.4f} (+/-{cv.std():.4f}), Test={test_acc:.4f}")\n\n# Влияние learning_rate на Gradient Boosting\nprint("\\nВлияние learning_rate (GradBoost):")\nfor lr in [0.01, 0.05, 0.1, 0.5, 1.0]:\n    gb_lr = GradientBoostingClassifier(n_estimators=100, learning_rate=lr, random_state=42)\n    cv_lr = cross_val_score(gb_lr, X_train, y_train, cv=5).mean()\n    print(f"  lr={lr:.2f}: CV={cv_lr:.4f}")'
        },
        {
          type: 'list',
          value: [
            'Bagging (RF): параллельное обучение, уменьшает variance, устойчив к переобучению',
            'Boosting (GB): последовательное обучение, уменьшает bias, мощнее но сложнее настроить',
            'learning_rate: маленький = медленное обучение, нужно больше деревьев, но точнее',
            'Gradient Boosting обычно лучше RF, но дольше обучается'
          ]
        }
      ]
    },
    {
      id: 3,
      title: 'XGBoost, LightGBM, CatBoost',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Продвинутые библиотеки Gradient Boosting'
        },
        {
          type: 'text',
          value: 'XGBoost, LightGBM и CatBoost — оптимизированные реализации gradient boosting. Они значительно быстрее sklearn и побеждают в большинстве соревнований на Kaggle. Каждая имеет свои преимущества.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Установка: pip install xgboost lightgbm catboost\n\nfrom sklearn.datasets import load_breast_cancer\nfrom sklearn.model_selection import train_test_split, cross_val_score\nfrom sklearn.ensemble import GradientBoostingClassifier\nimport numpy as np\n\ndata = load_breast_cancer()\nX_train, X_test, y_train, y_test = train_test_split(\n    data.data, data.target, test_size=0.2, random_state=42\n)\n\n# XGBoost\ntry:\n    from xgboost import XGBClassifier\n    xgb = XGBClassifier(\n        n_estimators=100, learning_rate=0.1, max_depth=5,\n        use_label_encoder=False, eval_metric="logloss", random_state=42\n    )\n    cv_xgb = cross_val_score(xgb, X_train, y_train, cv=5).mean()\n    print(f"XGBoost:    CV={cv_xgb:.4f}")\nexcept ImportError:\n    print("XGBoost не установлен")\n\n# LightGBM\ntry:\n    from lightgbm import LGBMClassifier\n    lgbm = LGBMClassifier(\n        n_estimators=100, learning_rate=0.1, max_depth=5,\n        random_state=42, verbose=-1\n    )\n    cv_lgbm = cross_val_score(lgbm, X_train, y_train, cv=5).mean()\n    print(f"LightGBM:   CV={cv_lgbm:.4f}")\nexcept ImportError:\n    print("LightGBM не установлен")\n\n# CatBoost\ntry:\n    from catboost import CatBoostClassifier\n    cb = CatBoostClassifier(\n        n_estimators=100, learning_rate=0.1, depth=5,\n        random_state=42, verbose=0\n    )\n    cv_cb = cross_val_score(cb, X_train, y_train, cv=5).mean()\n    print(f"CatBoost:   CV={cv_cb:.4f}")\nexcept ImportError:\n    print("CatBoost не установлен")\n\n# Sklearn Gradient Boosting (для сравнения)\ngb = GradientBoostingClassifier(n_estimators=100, learning_rate=0.1, random_state=42)\ncv_gb = cross_val_score(gb, X_train, y_train, cv=5).mean()\nprint(f"sklearn GB: CV={cv_gb:.4f}")'
        },
        {
          type: 'list',
          value: [
            'XGBoost: быстрый, регуляризация, обработка пропусков, стандарт на Kaggle',
            'LightGBM: самый быстрый, leaf-wise рост дерева, хорош для больших данных',
            'CatBoost: лучшая работа с категориями, не нужен encoding, устойчив к переобучению',
            'На практике: LightGBM для скорости, CatBoost для категорий, XGBoost — универсальный'
          ]
        }
      ]
    },
    {
      id: 4,
      title: 'Stacking',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Stacking — комбинирование разных моделей'
        },
        {
          type: 'code',
          language: 'python',
          value: 'from sklearn.ensemble import (\n    StackingClassifier, RandomForestClassifier, \n    GradientBoostingClassifier\n)\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.svm import SVC\nfrom sklearn.neighbors import KNeighborsClassifier\nfrom sklearn.datasets import load_breast_cancer\nfrom sklearn.model_selection import train_test_split, cross_val_score\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.pipeline import Pipeline\n\ndata = load_breast_cancer()\nX_train, X_test, y_train, y_test = train_test_split(\n    data.data, data.target, test_size=0.2, random_state=42\n)\n\n# Базовые модели (уровень 1)\nestimators = [\n    ("rf", RandomForestClassifier(n_estimators=100, random_state=42)),\n    ("gb", GradientBoostingClassifier(n_estimators=100, random_state=42)),\n    ("knn", Pipeline([\n        ("scaler", StandardScaler()),\n        ("knn", KNeighborsClassifier(n_neighbors=5))\n    ])),\n]\n\n# Мета-модель (уровень 2) обучается на предсказаниях базовых\nstacking = StackingClassifier(\n    estimators=estimators,\n    final_estimator=LogisticRegression(),\n    cv=5\n)\n\n# Сравнение\nmodels = {\n    "RandomForest": RandomForestClassifier(n_estimators=100, random_state=42),\n    "GradBoost": GradientBoostingClassifier(n_estimators=100, random_state=42),\n    "Stacking": stacking\n}\n\nfor name, model in models.items():\n    cv = cross_val_score(model, X_train, y_train, cv=5)\n    model.fit(X_train, y_train)\n    test = model.score(X_test, y_test)\n    print(f"{name:13s}: CV={cv.mean():.4f}, Test={test:.4f}")'
        },
        {
          type: 'tip',
          value: 'Stacking даёт прирост, когда базовые модели РАЗНЫЕ (разные алгоритмы, разные гиперпараметры). Если все модели похожи, stacking не поможет.'
        }
      ]
    },
    {
      id: 5,
      title: 'Voting Classifier',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Голосование ансамбля'
        },
        {
          type: 'code',
          language: 'python',
          value: 'from sklearn.ensemble import VotingClassifier, RandomForestClassifier, GradientBoostingClassifier\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.datasets import load_breast_cancer\nfrom sklearn.model_selection import train_test_split, cross_val_score\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.pipeline import Pipeline\n\ndata = load_breast_cancer()\nX_train, X_test, y_train, y_test = train_test_split(\n    data.data, data.target, test_size=0.2, random_state=42\n)\n\n# Hard voting — каждая модель голосует за класс\nhard_voting = VotingClassifier(\n    estimators=[\n        ("rf", RandomForestClassifier(n_estimators=100, random_state=42)),\n        ("gb", GradientBoostingClassifier(n_estimators=100, random_state=42)),\n        ("lr", Pipeline([\n            ("scaler", StandardScaler()),\n            ("lr", LogisticRegression(max_iter=5000))\n        ]))\n    ],\n    voting="hard"\n)\n\n# Soft voting — усредняем вероятности (обычно лучше)\nsoft_voting = VotingClassifier(\n    estimators=[\n        ("rf", RandomForestClassifier(n_estimators=100, random_state=42)),\n        ("gb", GradientBoostingClassifier(n_estimators=100, random_state=42)),\n        ("lr", Pipeline([\n            ("scaler", StandardScaler()),\n            ("lr", LogisticRegression(max_iter=5000))\n        ]))\n    ],\n    voting="soft"\n)\n\nfor name, model in [("Hard Voting", hard_voting), ("Soft Voting", soft_voting)]:\n    cv = cross_val_score(model, X_train, y_train, cv=5)\n    model.fit(X_train, y_train)\n    print(f"{name}: CV={cv.mean():.4f}, Test={model.score(X_test, y_test):.4f}")'
        }
      ]
    },
    {
      id: 6,
      title: 'Практика: Ансамблевая модель',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте ансамблевую модель из нескольких алгоритмов и сравните её с отдельными моделями.',
      requirements: [
        'Загрузите Breast Cancer dataset, разделите 80/20',
        'Обучите отдельно: RandomForest, GradientBoosting, LogisticRegression (со scaler)',
        'Создайте VotingClassifier (soft voting) из этих трёх моделей',
        'Создайте StackingClassifier с LogisticRegression как мета-модель',
        'Сравните все 5 вариантов по CV accuracy и test accuracy'
      ],
      hint: 'Для LogisticRegression используйте Pipeline с StandardScaler. VotingClassifier с voting="soft" усредняет вероятности. Stacking использует CV предсказания базовых моделей.',
      expectedOutput: 'RandomForest:     CV=0.96XX, Test=0.97XX\nGradBoosting:     CV=0.96XX, Test=0.97XX\nLogRegression:    CV=0.97XX, Test=0.98XX\nSoft Voting:      CV=0.97XX, Test=0.98XX\nStacking:         CV=0.97XX, Test=0.98XX',
      solution: 'from sklearn.ensemble import (\n    RandomForestClassifier, GradientBoostingClassifier,\n    VotingClassifier, StackingClassifier\n)\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.pipeline import Pipeline\nfrom sklearn.datasets import load_breast_cancer\nfrom sklearn.model_selection import train_test_split, cross_val_score\n\ndata = load_breast_cancer()\nX_train, X_test, y_train, y_test = train_test_split(\n    data.data, data.target, test_size=0.2, random_state=42\n)\n\nrf = RandomForestClassifier(n_estimators=100, random_state=42)\ngb = GradientBoostingClassifier(n_estimators=100, random_state=42)\nlr = Pipeline([("scaler", StandardScaler()), ("lr", LogisticRegression(max_iter=5000))])\n\nestimators = [("rf", rf), ("gb", gb), ("lr", lr)]\nvoting = VotingClassifier(estimators=estimators, voting="soft")\nstacking = StackingClassifier(estimators=estimators, final_estimator=LogisticRegression(), cv=5)\n\nall_models = {\n    "RandomForest": RandomForestClassifier(n_estimators=100, random_state=42),\n    "GradBoosting": GradientBoostingClassifier(n_estimators=100, random_state=42),\n    "LogRegression": Pipeline([("scaler", StandardScaler()), ("lr", LogisticRegression(max_iter=5000))]),\n    "Soft Voting": voting,\n    "Stacking": stacking\n}\n\nfor name, model in all_models.items():\n    cv = cross_val_score(model, X_train, y_train, cv=5)\n    model.fit(X_train, y_train)\n    test = model.score(X_test, y_test)\n    print(f"{name:17s}: CV={cv.mean():.4f}, Test={test:.4f}")',
      explanation: 'Ансамблевые методы часто превосходят отдельные модели. Soft Voting усредняет вероятности — более гладкие предсказания. Stacking использует мета-модель для оптимального комбинирования. Разнообразие базовых моделей (RF + GB + LR) — ключ к успеху ансамбля, так как разные модели делают разные ошибки.'
    }
  ]
}
