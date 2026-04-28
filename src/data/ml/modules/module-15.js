export default {
  id: 15,
  title: 'Оценка моделей',
  description: 'Метрики оценки, кросс-валидация, bias-variance tradeoff, переобучение и недообучение, подбор гиперпараметров.',
  lessons: [
    {
      id: 1,
      title: 'Метрики классификации',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Accuracy, Precision, Recall, F1-score'
        },
        {
          type: 'text',
          value: 'Accuracy — доля правильных предсказаний. Но при несбалансированных классах (99% — здоровые, 1% — больные) accuracy бесполезна: модель "все здоровы" даст 99%. Нужны метрики для каждого класса: precision, recall, F1-score.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import numpy as np\nfrom sklearn.metrics import (\n    accuracy_score, precision_score, recall_score, f1_score,\n    classification_report, confusion_matrix, roc_auc_score,\n    roc_curve, ConfusionMatrixDisplay\n)\nimport matplotlib.pyplot as plt\n\n# Симуляция предсказаний\ny_true = np.array([1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1])\ny_pred = np.array([1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1])\ny_prob = np.array([0.9, 0.8, 0.4, 0.7, 0.1, 0.6, 0.2, 0.1, 0.3, 0.05, 0.85, 0.15, 0.35, 0.1, 0.75])\n\nprint(f"Accuracy:  {accuracy_score(y_true, y_pred):.4f}")\nprint(f"Precision: {precision_score(y_true, y_pred):.4f}")  # TP / (TP + FP)\nprint(f"Recall:    {recall_score(y_true, y_pred):.4f}")     # TP / (TP + FN)\nprint(f"F1-score:  {f1_score(y_true, y_pred):.4f}")         # 2*P*R / (P+R)\nprint(f"ROC-AUC:   {roc_auc_score(y_true, y_prob):.4f}")\n\n# Confusion Matrix\nprint(f"\\nConfusion Matrix:\\n{confusion_matrix(y_true, y_pred)}")\nprint("  [[TN, FP],\\n   [FN, TP]]")\n\n# Classification Report\nprint(f"\\n{classification_report(y_true, y_pred, target_names=[\'Здоров\', \'Болен\'])}")\n\n# ROC Curve\nfpr, tpr, thresholds = roc_curve(y_true, y_prob)\nplt.figure(figsize=(6, 6))\nplt.plot(fpr, tpr, "b-", linewidth=2, label=f"AUC = {roc_auc_score(y_true, y_prob):.4f}")\nplt.plot([0, 1], [0, 1], "r--")\nplt.xlabel("False Positive Rate")\nplt.ylabel("True Positive Rate")\nplt.title("ROC Curve")\nplt.legend()\nplt.grid(True, alpha=0.3)\nplt.show()'
        },
        {
          type: 'list',
          value: [
            'Precision: "из всех, кого назвали больными, сколько реально больны?" — важна при дорогих FP',
            'Recall: "из всех реально больных, скольких нашли?" — важна при дорогих FN (пропуск болезни)',
            'F1-score: баланс precision и recall — среднее гармоническое',
            'ROC-AUC: качество ранжирования, не зависит от порога. 0.5 = случайный, 1.0 = идеальный'
          ]
        }
      ]
    },
    {
      id: 2,
      title: 'Метрики регрессии',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'MSE, RMSE, MAE, R-squared'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import numpy as np\nfrom sklearn.metrics import (\n    mean_squared_error, mean_absolute_error, \n    r2_score, mean_absolute_percentage_error\n)\n\ny_true = np.array([100, 150, 200, 250, 300])\ny_pred = np.array([110, 140, 210, 230, 310])\n\n# MSE — средняя квадратичная ошибка\nmse = mean_squared_error(y_true, y_pred)\nprint(f"MSE:  {mse:.2f}")\n\n# RMSE — корень из MSE (в тех же единицах, что y)\nrmse = np.sqrt(mse)\nprint(f"RMSE: {rmse:.2f}")\n\n# MAE — средняя абсолютная ошибка (устойчива к выбросам)\nmae = mean_absolute_error(y_true, y_pred)\nprint(f"MAE:  {mae:.2f}")\n\n# MAPE — средняя абсолютная процентная ошибка\nmape = mean_absolute_percentage_error(y_true, y_pred)\nprint(f"MAPE: {mape*100:.2f}%")\n\n# R² — коэффициент детерминации\nr2 = r2_score(y_true, y_pred)\nprint(f"R²:   {r2:.4f}")\n\n# Интерпретация R²\nprint(f"\\nR²=1.0: идеальная модель")\nprint(f"R²=0.0: модель = среднее значение")\nprint(f"R²<0.0: модель хуже среднего")\n\n# Пример: сравнение моделей\nnp.random.seed(42)\ny_real = np.random.rand(100) * 100\ny_good = y_real + np.random.randn(100) * 5\ny_bad = y_real + np.random.randn(100) * 30\ny_mean = np.full(100, y_real.mean())\n\nprint(f"\\nХорошая модель: R²={r2_score(y_real, y_good):.4f}, RMSE={np.sqrt(mean_squared_error(y_real, y_good)):.2f}")\nprint(f"Плохая модель:  R²={r2_score(y_real, y_bad):.4f}, RMSE={np.sqrt(mean_squared_error(y_real, y_bad)):.2f}")\nprint(f"Просто среднее:  R²={r2_score(y_real, y_mean):.4f}, RMSE={np.sqrt(mean_squared_error(y_real, y_mean)):.2f}")'
        },
        {
          type: 'tip',
          value: 'RMSE штрафует большие ошибки сильнее MAE. Если одна ошибка в 100 хуже, чем 10 ошибок по 10 — используйте RMSE. Если все ошибки равноценны — MAE.'
        }
      ]
    },
    {
      id: 3,
      title: 'Кросс-валидация',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'K-Fold Cross-Validation'
        },
        {
          type: 'text',
          value: 'Одно разбиение train/test ненадёжно — результат зависит от случайного разделения. Кросс-валидация делит данные на K частей, K раз обучает модель на K-1 частях и оценивает на оставшейся. Итог — среднее и стандартное отклонение по K экспериментам.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'from sklearn.model_selection import (\n    cross_val_score, KFold, StratifiedKFold, \n    LeaveOneOut, cross_validate\n)\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.datasets import load_iris\n\niris = load_iris()\nX, y = iris.data, iris.target\nmodel = RandomForestClassifier(n_estimators=100, random_state=42)\n\n# Простая кросс-валидация (5-fold)\nscores = cross_val_score(model, X, y, cv=5, scoring="accuracy")\nprint(f"5-Fold CV: {scores}")\nprint(f"Среднее: {scores.mean():.4f} (+/- {scores.std():.4f})")\n\n# Stratified K-Fold (сохраняет пропорции классов)\nskf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)\nscores_strat = cross_val_score(model, X, y, cv=skf)\nprint(f"\\nStratified 5-Fold: {scores_strat.mean():.4f} (+/- {scores_strat.std():.4f})")\n\n# Несколько метрик одновременно\nresults = cross_validate(\n    model, X, y, cv=5,\n    scoring=["accuracy", "f1_macro", "precision_macro"],\n    return_train_score=True\n)\n\nprint(f"\\nТест accuracy: {results[\'test_accuracy\'].mean():.4f}")\nprint(f"Тест F1 macro: {results[\'test_f1_macro\'].mean():.4f}")\nprint(f"Train accuracy: {results[\'train_accuracy\'].mean():.4f}")\nprint(f"\\nПереобучение: {results[\'train_accuracy\'].mean() - results[\'test_accuracy\'].mean():.4f}")'
        },
        {
          type: 'warning',
          value: 'Всегда используйте StratifiedKFold для классификации! Обычный KFold может создать fold без некоторых классов, что даст нерепрезентативную оценку.'
        }
      ]
    },
    {
      id: 4,
      title: 'Bias-Variance Tradeoff',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Компромисс смещения и дисперсии'
        },
        {
          type: 'text',
          value: 'Ошибка модели = Bias² + Variance + Irreducible Noise. Bias (смещение) — ошибка из-за упрощённых допущений (underfitting). Variance (дисперсия) — чувствительность к конкретным данным (overfitting). Задача — найти баланс.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import numpy as np\nimport matplotlib.pyplot as plt\nfrom sklearn.tree import DecisionTreeRegressor\nfrom sklearn.model_selection import learning_curve\nfrom sklearn.datasets import make_regression\n\nX, y = make_regression(n_samples=200, n_features=1, noise=20, random_state=42)\n\n# Learning Curves для разных сложностей\nfig, axes = plt.subplots(1, 3, figsize=(15, 4))\nconfigs = [\n    ("Underfitting (depth=1)", DecisionTreeRegressor(max_depth=1)),\n    ("Оптимальная (depth=5)", DecisionTreeRegressor(max_depth=5)),\n    ("Overfitting (depth=None)", DecisionTreeRegressor(max_depth=None)),\n]\n\nfor ax, (title, model) in zip(axes, configs):\n    train_sizes, train_scores, val_scores = learning_curve(\n        model, X, y, cv=5, train_sizes=np.linspace(0.1, 1.0, 10),\n        scoring="neg_mean_squared_error\"\n    )\n    \n    train_mean = -train_scores.mean(axis=1)\n    val_mean = -val_scores.mean(axis=1)\n    \n    ax.plot(train_sizes, train_mean, label=\"Train MSE\")\n    ax.plot(train_sizes, val_mean, label=\"Validation MSE\")\n    ax.set_xlabel(\"Размер выборки\")\n    ax.set_ylabel(\"MSE\")\n    ax.set_title(title)\n    ax.legend()\n    ax.grid(True, alpha=0.3)\n\nplt.tight_layout()\nplt.show()\n\nprint(\"Underfitting: high bias, low variance (train ≈ val, оба высокие)\")\nprint(\"Overfitting: low bias, high variance (train << val, большой разрыв)\")\nprint(\"Оптимум: баланс между bias и variance\")"'
        },
        {
          type: 'list',
          value: [
            'Underfitting: увеличьте сложность модели, добавьте признаки, уменьшите регуляризацию',
            'Overfitting: добавьте данных, регуляризация, уменьшите сложность, dropout, feature selection',
            'Learning curve: если train error высок — underfitting, если gap большой — overfitting'
          ]
        }
      ]
    },
    {
      id: 5,
      title: 'GridSearch и RandomizedSearch',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Подбор гиперпараметров'
        },
        {
          type: 'code',
          language: 'python',
          value: 'from sklearn.model_selection import GridSearchCV, RandomizedSearchCV\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.datasets import load_breast_cancer\nfrom sklearn.model_selection import train_test_split\nfrom scipy.stats import randint, uniform\nimport time\n\ndata = load_breast_cancer()\nX_train, X_test, y_train, y_test = train_test_split(\n    data.data, data.target, test_size=0.2, random_state=42\n)\n\n# GridSearchCV — полный перебор\nparam_grid = {\n    "n_estimators": [50, 100, 200],\n    "max_depth": [5, 10, None],\n    "min_samples_split": [2, 5]\n}\n\nstart = time.time()\ngrid = GridSearchCV(RandomForestClassifier(random_state=42), \n                    param_grid, cv=5, n_jobs=-1)\ngrid.fit(X_train, y_train)\nprint(f"GridSearch: {time.time()-start:.1f}s")\nprint(f"  Комбинаций: {len(grid.cv_results_[\'params\'])}")\nprint(f"  Лучшие: {grid.best_params_}")\nprint(f"  CV: {grid.best_score_:.4f}, Test: {grid.score(X_test, y_test):.4f}")\n\n# RandomizedSearchCV — случайная выборка из распределений\nparam_dist = {\n    "n_estimators": randint(50, 300),\n    "max_depth": [3, 5, 10, 15, None],\n    "min_samples_split": randint(2, 20),\n    "max_features": uniform(0.1, 0.9),\n}\n\nstart = time.time()\nrandom = RandomizedSearchCV(RandomForestClassifier(random_state=42),\n                            param_dist, n_iter=20, cv=5, \n                            n_jobs=-1, random_state=42)\nrandom.fit(X_train, y_train)\nprint(f"\\nRandomSearch: {time.time()-start:.1f}s")\nprint(f"  Итераций: 20")\nprint(f"  Лучшие: {random.best_params_}")\nprint(f"  CV: {random.best_score_:.4f}, Test: {random.score(X_test, y_test):.4f}")'
        },
        {
          type: 'note',
          value: 'GridSearch перебирает ВСЕ комбинации (3x3x2=18). RandomizedSearch случайно выбирает N комбинаций. При большом пространстве параметров RandomizedSearch эффективнее.'
        }
      ]
    },
    {
      id: 6,
      title: 'Валидационная стратегия',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Train / Validation / Test'
        },
        {
          type: 'text',
          value: 'Правильная стратегия валидации: Train (60-70%) — обучение модели, Validation (15-20%) — подбор гиперпараметров, Test (15-20%) — финальная оценка. Кросс-валидация заменяет отдельный validation set.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'from sklearn.model_selection import train_test_split, cross_val_score\nfrom sklearn.ensemble import GradientBoostingClassifier\nfrom sklearn.datasets import load_breast_cancer\nimport numpy as np\n\ndata = load_breast_cancer()\nX, y = data.data, data.target\n\n# Стратегия 1: Train / Test + CV для параметров\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\n\n# Подбор параметров через CV на train\nbest_score = 0\nbest_params = {}\nfor lr in [0.01, 0.1, 0.5]:\n    for n_est in [50, 100, 200]:\n        model = GradientBoostingClassifier(learning_rate=lr, n_estimators=n_est, random_state=42)\n        cv_score = cross_val_score(model, X_train, y_train, cv=5).mean()\n        if cv_score > best_score:\n            best_score = cv_score\n            best_params = {"lr": lr, "n_est": n_est}\n\nprint(f"Лучшие параметры: {best_params}, CV score: {best_score:.4f}")\n\n# Финальная оценка на test\nfinal_model = GradientBoostingClassifier(\n    learning_rate=best_params["lr"], \n    n_estimators=best_params["n_est"], \n    random_state=42\n)\nfinal_model.fit(X_train, y_train)\ntest_score = final_model.score(X_test, y_test)\nprint(f"Финальная оценка на test: {test_score:.4f}")\n\nprint("\\nКлючевые правила:")\nprint("1. НИКОГДА не смотрите на test при подборе параметров")\nprint("2. Test используется ОДИН раз — для финальной оценки")\nprint("3. CV заменяет validation set и даёт более надёжную оценку")'
        },
        {
          type: 'warning',
          value: 'Data Leakage — главный враг! Если тестовые данные "просочились" в обучение (через масштабирование, подбор параметров), оценка будет завышена. Всегда используйте Pipeline.'
        }
      ]
    },
    {
      id: 7,
      title: 'Практика: Полная оценка модели',
      type: 'practice',
      difficulty: 'hard',
      description: 'Проведите полный цикл оценки модели: кросс-валидация, learning curves, подбор гиперпараметров, финальная оценка.',
      requirements: [
        'Загрузите Breast Cancer dataset, разделите 80/20',
        'Обучите GradientBoostingClassifier и выведите classification_report',
        'Постройте ROC-кривую и вычислите AUC',
        'Проведите GridSearchCV по learning_rate=[0.01,0.1] и n_estimators=[50,100,200]',
        'Выведите финальную accuracy лучшей модели на тестовой выборке'
      ],
      hint: 'Используйте predict_proba для ROC-кривой. GridSearchCV автоматически выбирает лучшие параметры. best_estimator_ содержит обученную модель.',
      expectedOutput: 'Classification Report:\n...\nROC-AUC: 0.99XX\nЛучшие параметры: {...}\nФинальная accuracy: 0.97XX',
      solution: 'from sklearn.datasets import load_breast_cancer\nfrom sklearn.ensemble import GradientBoostingClassifier\nfrom sklearn.model_selection import train_test_split, GridSearchCV\nfrom sklearn.metrics import classification_report, roc_auc_score, roc_curve\nimport matplotlib.pyplot as plt\n\ndata = load_breast_cancer()\nX_train, X_test, y_train, y_test = train_test_split(\n    data.data, data.target, test_size=0.2, random_state=42\n)\n\n# Baseline модель\ngb = GradientBoostingClassifier(random_state=42)\ngb.fit(X_train, y_train)\ny_pred = gb.predict(X_test)\ny_prob = gb.predict_proba(X_test)[:, 1]\n\nprint("Classification Report:")\nprint(classification_report(y_test, y_pred, target_names=data.target_names))\n\nauc = roc_auc_score(y_test, y_prob)\nprint(f"ROC-AUC: {auc:.4f}")\n\nfpr, tpr, _ = roc_curve(y_test, y_prob)\nplt.figure(figsize=(6, 6))\nplt.plot(fpr, tpr, label=f"AUC={auc:.4f}")\nplt.plot([0, 1], [0, 1], "r--")\nplt.xlabel("FPR")\nplt.ylabel("TPR")\nplt.title("ROC Curve")\nplt.legend()\nplt.savefig("roc_curve.png")\nplt.show()\n\n# GridSearch\nparam_grid = {"learning_rate": [0.01, 0.1], "n_estimators": [50, 100, 200]}\ngrid = GridSearchCV(GradientBoostingClassifier(random_state=42), param_grid, cv=5, n_jobs=-1)\ngrid.fit(X_train, y_train)\n\nprint(f"\\nЛучшие параметры: {grid.best_params_}")\nprint(f"Финальная accuracy: {grid.score(X_test, y_test):.4f}")',
      explanation: 'GradientBoosting — мощный ансамблевый метод. Classification report показывает precision/recall для каждого класса. ROC-AUC не зависит от порога и хорошо оценивает качество ранжирования. GridSearchCV с CV=5 подбирает лучшую комбинацию learning_rate и n_estimators. Финальная оценка делается один раз на отложенном тесте.'
    }
  ]
}
