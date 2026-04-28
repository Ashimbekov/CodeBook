export default {
  id: 60,
  title: 'Kaggle: Табличные данные (TPS)',
  description: 'Пошаговое прохождение табличных конкурсов Kaggle: автоматизированный EDA, мастер-класс по gradient boosting, Optuna тюнинг, pseudo labeling и stacking.',
  lessons: [
    {
      id: 1,
      title: 'Табличные конкурсы на Kaggle',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Tabular Playground Series (TPS)'
        },
        {
          type: 'text',
          value: 'Tabular Playground Series — ежемесячные конкурсы Kaggle на табличных данных. Они проще соревнований с призами, но отлично подходят для отработки навыков. Табличные данные — самый частый тип данных в реальной работе Data Scientist.'
        },
        {
          type: 'heading',
          value: 'Особенности табличных конкурсов'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Табличные данные vs другие типы\nprint("""\n=== Табличные данные: особенности ===\n\n1. Структура: строки = примеры, столбцы = признаки\n   - Числовые: age, salary, temperature\n   - Категориальные: city, color, product_type\n   - Бинарные: is_active, has_insurance\n\n2. Что работает лучше всего:\n   - Gradient Boosting (XGBoost, LightGBM, CatBoost) — KING!\n   - Feature Engineering — ключ к победе\n   - Stacking ensembles\n   - НЕ нейронные сети (деревья лучше на табличных данных)\n\n3. Типичный workflow:\n   - EDA + понимание данных\n   - Feature Engineering\n   - Baseline с LightGBM\n   - Hyperparameter tuning (Optuna)\n   - Ensemble / Stacking\n   - Pseudo labeling (если разрешено)\n\n4. Метрики:\n   - Классификация: AUC-ROC, F1, Log Loss\n   - Регрессия: RMSE, MAE, RMSLE\n\"\"\")\n\nimport numpy as np\nimport pandas as pd\n\n# Пример табличного датасета\nnp.random.seed(42)\nn = 1000\ndf = pd.DataFrame({\n    "id": range(n),\n    "num_feat_1": np.random.normal(0, 1, n),\n    "num_feat_2": np.random.exponential(2, n),\n    "num_feat_3": np.random.uniform(-5, 5, n),\n    "cat_feat_1": np.random.choice(["A", "B", "C", "D"], n),\n    "cat_feat_2": np.random.choice(["X", "Y", "Z"], n, p=[0.5, 0.3, 0.2]),\n    "bin_feat": np.random.choice([0, 1], n, p=[0.7, 0.3]),\n})\n\ntarget_prob = (0.3 + 0.2 * df["num_feat_1"] - 0.1 * df["num_feat_2"] +\n               0.15 * (df["cat_feat_1"] == "A") + 0.1 * df["bin_feat"]).clip(0.01, 0.99)\ndf["target"] = (np.random.random(n) < target_prob).astype(int)\n\nprint(f"Датасет: {df.shape}")\nprint(f"Числовые: {df.select_dtypes(include=[np.number]).shape[1] - 2}\")\nprint(f\"Категориальные: {df.select_dtypes(include=[object]).shape[1]}\")\nprint(f\"Target balance: {df[\'target\'].mean():.1%} positive\")\nprint(f\"\\n{df.head()}'
        },
        {
          type: 'list',
          value: [
            'TPS запускаются каждый месяц с новой задачей',
            'Размер данных: 100K — 1M строк, 10-100 признаков',
            'Gradient Boosting побеждает в 90%+ табличных конкурсов',
            'Neural Networks проигрывают деревьям на табличных данных',
            'Feature Engineering даёт больший эффект, чем выбор модели',
            'Kaggle Grandmasters предпочитают LightGBM и CatBoost'
          ]
        },
        {
          type: 'tip',
          value: 'Золотое правило табличных конкурсов: LightGBM baseline -> Feature Engineering -> Optuna tuning -> Stacking. Этот подход входит в топ-10% на большинстве TPS конкурсов.'
        }
      ]
    },
    {
      id: 2,
      title: 'EDA стратегия для табличных данных',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Автоматизированный EDA'
        },
        {
          type: 'text',
          value: 'Для быстрого EDA на табличных данных используются специальные библиотеки: pandas-profiling (ydata-profiling), sweetviz, dtale. Они генерируют полный отчёт в одну строку кода. Но ручной EDA тоже необходим для глубокого понимания.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import numpy as np\nimport pandas as pd\n\n# Автоматизированный EDA\nprint("""\n=== Инструменты автоматического EDA ===\n\n# pandas-profiling (ydata-profiling)\nfrom ydata_profiling import ProfileReport\nreport = ProfileReport(df, title="EDA Report")\nreport.to_file("eda_report.html")\n\n# sweetviz\nimport sweetviz as sv\nreport = sv.analyze(df, target_feat="target")\nreport.show_html("sweetviz_report.html")\n\n# dtale — интерактивный EDA\nimport dtale\nd = dtale.show(df)\n\"\"\")\n\n# Реализуем свой мини EDA-профайлер\nnp.random.seed(42)\nn = 2000\ndf = pd.DataFrame({\n    \"f1\": np.random.normal(0, 1, n),\n    \"f2\": np.random.exponential(2, n),\n    \"f3\": np.random.uniform(-5, 5, n),\n    \"f4\": np.where(np.random.random(n) < 0.05, np.nan, np.random.normal(5, 2, n)),\n    \"f5\": np.random.choice([\"A\",\"B\",\"C\",\"D\"], n, p=[0.4,0.3,0.2,0.1]),\n    \"f6\": np.random.choice([\"X\",\"Y\"], n),\n    \"f7\": np.where(np.random.random(n) < 0.1, np.nan, np.random.lognormal(0, 1, n)),\n})\ntarget_p = (0.3 + 0.15*df[\"f1\"] - 0.05*df[\"f2\"] + 0.1*(df[\"f5\"]==\"A\")).clip(0.05, 0.95)\ndf[\"target\"] = (np.random.random(n) < target_p).astype(int)\n\ndef auto_eda(df, target_col):\n    print(f\"=== AUTO EDA ===\")\n    print(f\"Shape: {df.shape}\")\n    print(f\"Target: {target_col} (balance: {df[target_col].mean():.1%} positive)\")\n    \n    # Типы данных\n    num_cols = df.select_dtypes(include=[np.number]).columns.drop(target_col, errors=\"ignore\")\n    cat_cols = df.select_dtypes(include=[\"object\"]).columns\n    print(f\"\\nЧисловые: {len(num_cols)}, Категориальные: {len(cat_cols)}\")\n    \n    # Пропуски\n    print(\"\\nПропуски:\")\n    for col in df.columns:\n        miss = df[col].isnull().sum()\n        if miss > 0:\n            print(f\"  {col:10s}: {miss:5d} ({miss/len(df):.1%})\")\n    \n    # Числовые статистики\n    print(\"\\nЧисловые признаки:\")\n    for col in num_cols:\n        skew = df[col].skew()\n        print(f\"  {col:10s}: mean={df[col].mean():8.2f}, std={df[col].std():7.2f}, \"\n              f\"skew={skew:6.2f}, nulls={df[col].isnull().sum()}\")\n    \n    # Категориальные\n    print(\"\\nКатегориальные:\")\n    for col in cat_cols:\n        nunique = df[col].nunique()\n        top = df[col].value_counts().index[0]\n        print(f\"  {col:10s}: {nunique} уникальных, топ=\'{top}\'\")\n    \n    # Корреляции с target\n    print(f\"\\nКорреляции с {target_col}:\")\n    corrs = df[num_cols].corrwith(df[target_col]).abs().sort_values(ascending=False)\n    for feat, c in corrs.items():\n        print(f\"  {feat:10s}: {c:.3f}\")\n\nauto_eda(df, \"target\")'
        },
        {
          type: 'heading',
          value: 'Визуальный EDA: ключевые графики'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Ключевые проверки при EDA табличных данных\n\nprint(\"=== Чеклист EDA для табличных данных ===\")\nchecklist = [\n    (\"1. Баланс классов\", \"Сбалансирован ли target? Нужна ли стратификация?\"),\n    (\"2. Пропуски\",       \"Сколько, в каких столбцах, случайные или информативные?\"),\n    (\"3. Типы данных\",    \"Числовые, категориальные, дата, текст?\"),\n    (\"4. Распределения\",  \"Нормальные? Скошенные? Нужен ли log-transform?\"),\n    (\"5. Выбросы\",        \"Есть ли экстремальные значения? Удалять или клиппировать?\"),\n    (\"6. Корреляции\",     \"Какие фичи связаны с target? Мультиколлинеарность?\"),\n    (\"7. Кардинальность\", \"Сколько уникальных значений в категориях?\"),\n    (\"8. Дубликаты\",      \"Есть ли дублирующиеся строки?\"),\n    (\"9. Train vs Test\",  \"Одинаковы ли распределения признаков?\"),\n    (\"10. Data leakage\",  \"Нет ли информации из будущего?\"),\n]\n\nfor name, desc in checklist:\n    print(f\"\\n  {name}\")\n    print(f\"    -> {desc}\")\n\n# Проверка train vs test distribution\nprint(\"\\n=== Train vs Test drift ===\")\ntrain_stats = df[[\"f1\",\"f2\",\"f3\"]].describe().loc[[\"mean\",\"std\"]]\nprint(\"Если статистики train и test сильно отличаются — adversarial validation!\")\nprint(train_stats)'
        },
        {
          type: 'note',
          value: 'Главные инсайты из EDA: (1) пропуски могут быть информативными — создайте бинарный признак is_missing, (2) скошенные распределения — примените log1p, (3) высокая кардинальность категорий — используйте target encoding, (4) train/test drift — adversarial validation.'
        }
      ]
    },
    {
      id: 3,
      title: 'Практика: Автоматический EDA',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реализуйте автоматический EDA-профайлер для табличных данных и примените его к TPS-like датасету.',
      requirements: [
        'Создайте TPS-like датасет (5000 строк, 10 числовых + 5 категориальных признаков с пропусками)',
        'Реализуйте функцию auto_eda(): типы, пропуски, статистики, корреляции, баланс',
        'Проверьте скошенность числовых признаков и определите кандидатов для log-transform',
        'Выведите уникальные значения и top-N категорий для каждого категориального признака',
        'Рассчитайте процент дубликатов и train/test drift (разделив данные пополам)'
      ],
      hint: 'Для определения кандидатов на log-transform: df[col].skew() > 1.0. Для drift: сравните mean и std одних признаков на двух половинах данных.',
      expectedOutput: 'Auto EDA Report:\nShape: (5000, 16)\nTarget balance: XX.X%\n\nЧисловые: 10 (skewed: X)\nКатегориальные: 5\nПропуски: X столбцов\n\nТоп корреляции: ...\nDrift: minimal',
      solution: 'import numpy as np\nimport pandas as pd\n\nnp.random.seed(42)\nn = 5000\n\ndf = pd.DataFrame({\n    "n1": np.random.normal(0, 1, n),\n    "n2": np.random.exponential(2, n),\n    "n3": np.random.uniform(-5, 5, n),\n    "n4": np.where(np.random.random(n)<0.08, np.nan, np.random.normal(10, 3, n)),\n    "n5": np.random.lognormal(0, 1, n),\n    "n6": np.where(np.random.random(n)<0.12, np.nan, np.random.normal(-2, 1, n)),\n    "n7": np.random.beta(2, 5, n),\n    "n8": np.random.poisson(5, n).astype(float),\n    "n9": np.random.gamma(2, 2, n),\n    "n10": np.where(np.random.random(n)<0.05, np.nan, np.random.normal(0, 0.5, n)),\n    "c1": np.random.choice(["A","B","C","D","E"], n, p=[0.3,0.25,0.2,0.15,0.1]),\n    "c2": np.random.choice(["X","Y","Z"], n),\n    "c3": np.where(np.random.random(n)<0.03, np.nan,\n                   np.random.choice(["low","mid","high"], n, p=[0.3,0.5,0.2])),\n    "c4": np.random.choice([f"cat_{i}" for i in range(20)], n),\n    "c5": np.random.choice(["yes","no"], n, p=[0.4,0.6]),\n})\n\ntarget_p = (0.35 + 0.1*df["n1"] - 0.03*df["n2"] + 0.05*df["n7"] +\n            0.1*(df["c1"]=="A") + 0.08*(df["c5"]=="yes")).clip(0.05, 0.95)\ndf["target"] = (np.random.random(n) < target_p).astype(int)\n\ndef auto_eda(df, target_col="target"):\n    print("Auto EDA Report:")\n    print(f"Shape: {df.shape}")\n    print(f"Target balance: {df[target_col].mean():.1%} positive")\n    print(f"Дубликатов: {df.duplicated().sum()} ({df.duplicated().mean():.1%})")\n\n    num_cols = df.select_dtypes(include=[np.number]).columns.drop(target_col, errors="ignore")\n    cat_cols = df.select_dtypes(include=["object"]).columns\n\n    # Skewed features\n    skewed = []\n    for col in num_cols:\n        s = df[col].skew()\n        if abs(s) > 1.0:\n            skewed.append((col, s))\n    print(f"\\nЧисловые: {len(num_cols)} (skewed: {len(skewed)})")\n    print(f"Категориальные: {len(cat_cols)}")\n\n    # Пропуски\n    miss_cols = 0\n    print("\\nПропуски:")\n    for col in df.columns:\n        miss = df[col].isnull().sum()\n        if miss > 0:\n            miss_cols += 1\n            print(f"  {col:8s}: {miss:5d} ({miss/len(df):.1%})")\n    print(f"Столбцов с пропусками: {miss_cols}")\n\n    # Числовые статистики\n    print("\\nЧисловые признаки:")\n    for col in num_cols:\n        print(f"  {col:6s}: mean={df[col].mean():8.2f}, std={df[col].std():7.2f}, "\n              f"skew={df[col].skew():6.2f}")\n\n    # Кандидаты на log-transform\n    if skewed:\n        print("\\nКандидаты на log-transform (|skew| > 1.0):")\n        for col, s in skewed:\n            print(f"  {col}: skew={s:.2f}")\n\n    # Категориальные\n    print("\\nКатегориальные признаки:")\n    for col in cat_cols:\n        nunique = df[col].nunique()\n        top3 = df[col].value_counts().head(3)\n        top_str = ", ".join([f"{v}={c}" for v, c in top3.items()])\n        print(f"  {col:6s}: {nunique} уникальных | {top_str}")\n\n    # Корреляции\n    corrs = df[num_cols].corrwith(df[target_col]).abs().sort_values(ascending=False)\n    print(f"\\nТоп корреляции с {target_col}:")\n    for feat, c in corrs.head(5).items():\n        print(f"  {feat:8s}: {c:.3f}")\n\n    # Train/test drift\n    print("\\nDrift check (first half vs second half):")\n    half = len(df) // 2\n    max_drift = 0\n    for col in num_cols[:5]:\n        m1 = df[col].iloc[:half].mean()\n        m2 = df[col].iloc[half:].mean()\n        s1 = df[col].iloc[:half].std()\n        drift = abs(m1 - m2) / max(s1, 0.001)\n        max_drift = max(max_drift, drift)\n        if drift > 0.1:\n            print(f"  {col}: drift={drift:.3f}")\n    if max_drift < 0.1:\n        print("  Drift: minimal (все < 0.1 std)")\n\nauto_eda(df)',
      explanation: 'Автоматический EDA-профайлер экономит время на рутинных проверках. Ключевые моменты: скошенные распределения (log-transform), пропуски (могут быть информативными), высокая кардинальность (нужен target encoding), drift между train и test (adversarial validation). Этот отчёт — отправная точка для feature engineering.'
    },
    {
      id: 4,
      title: 'Gradient Boosting мастер-класс',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'XGBoost vs LightGBM vs CatBoost'
        },
        {
          type: 'text',
          value: 'Три главных библиотеки gradient boosting для табличных данных. Все строят ансамбль деревьев решений, где каждое следующее дерево исправляет ошибки предыдущих. Различия — в скорости, работе с категориями и настройке.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import numpy as np\nimport pandas as pd\nfrom sklearn.model_selection import cross_val_score\nfrom sklearn.preprocessing import LabelEncoder\nfrom sklearn.ensemble import GradientBoostingClassifier\n\nnp.random.seed(42)\nn = 3000\n\ndf = pd.DataFrame({\n    "f1": np.random.normal(0, 1, n),\n    "f2": np.random.exponential(2, n),\n    "f3": np.random.uniform(-3, 3, n),\n    "f4": np.random.normal(5, 2, n),\n    "f5": np.random.lognormal(0, 0.5, n),\n    "cat1": np.random.choice(["A","B","C","D"], n),\n    "cat2": np.random.choice(["X","Y","Z"], n, p=[0.5,0.3,0.2]),\n})\n\nfor col in ["cat1", "cat2"]:\n    df[col] = LabelEncoder().fit_transform(df[col])\n\ntarget_p = (0.3 + 0.15*df["f1"] - 0.05*df["f2"] + 0.08*df["cat1"]/3).clip(0.05, 0.95)\ndf["target"] = (np.random.random(n) < target_p).astype(int)\n\nX = df.drop("target", axis=1).values\ny = df["target"].values\n\nprint("""\n=== XGBoost vs LightGBM vs CatBoost ===\n\n                XGBoost         LightGBM        CatBoost\nСкорость:       Средняя         Быстрый (x5)    Средняя\nКатегории:      LabelEncode     Встроенная      Лучшая!\nПамять:         Средняя         Меньше          Средняя\nТочность:       Высокая         Высокая         Высокая\nОвerfitting:    Умеренный       Чуть больше     Меньше\nGPU:            Да              Да              Да\nПопулярность:   #1 на Kaggle    #2 (растёт)     #3\n\"\"\")\n\n# sklearn GradientBoosting как baseline\ngbt = GradientBoostingClassifier(\n    n_estimators=200, max_depth=5, learning_rate=0.1, random_state=42\n)\nauc = cross_val_score(gbt, X, y, cv=5, scoring="roc_auc")\nprint(f\"sklearn GBT: AUC = {auc.mean():.4f} (+/- {auc.std():.4f})\")\n\nprint(\"\\n# XGBoost\")\nprint(\"\"\"import xgboost as xgb\nmodel = xgb.XGBClassifier(\n    n_estimators=500, max_depth=6, learning_rate=0.05,\n    subsample=0.8, colsample_bytree=0.8,\n    min_child_weight=3, reg_alpha=0.1, reg_lambda=1.0,\n    use_label_encoder=False, eval_metric=\"auc\"\n)\"\"\")\n\nprint(\"\\n# LightGBM\")\nprint(\"\"\"import lightgbm as lgb\nmodel = lgb.LGBMClassifier(\n    n_estimators=500, max_depth=6, learning_rate=0.05,\n    subsample=0.8, colsample_bytree=0.8,\n    min_child_samples=20, reg_alpha=0.1, reg_lambda=1.0,\n    num_leaves=31\n)\"\"\")\n\nprint(\"\\n# CatBoost\")\nprint(\"\"\"from catboost import CatBoostClassifier\nmodel = CatBoostClassifier(\n    iterations=500, depth=6, learning_rate=0.05,\n    cat_features=[\"cat1\", \"cat2\"],  # автоматическая обработка!\n    verbose=0\n)\"\"\")'
        },
        {
          type: 'heading',
          value: 'Ключевые гиперпараметры'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Гиперпараметры Gradient Boosting — что за что отвечает\n\nparams_guide = {\n    \"n_estimators / iterations\": {\n        \"описание\": \"Количество деревьев\",\n        \"диапазон\": \"100 — 5000\",\n        \"совет\": \"Больше = лучше, но медленнее. Используйте early stopping!\"\n    },\n    \"learning_rate / eta\": {\n        \"описание\": \"Скорость обучения (вклад каждого дерева)\",\n        \"диапазон\": \"0.01 — 0.3\",\n        \"совет\": \"Меньше = стабильнее, но нужно больше деревьев\"\n    },\n    \"max_depth / depth\": {\n        \"описание\": \"Максимальная глубина дерева\",\n        \"диапазон\": \"3 — 10\",\n        \"совет\": \"Глубже = сложнее модель, больше risk overfitting\"\n    },\n    \"num_leaves (LightGBM)\": {\n        \"описание\": \"Количество листьев в дереве\",\n        \"диапазон\": \"20 — 150\",\n        \"совет\": \"~2^max_depth, но можно больше для leaf-wise growth\"\n    },\n    \"subsample / bagging_fraction\": {\n        \"описание\": \"Доля строк для каждого дерева\",\n        \"диапазон\": \"0.5 — 1.0\",\n        \"совет\": \"0.7-0.8 уменьшает overfitting\"\n    },\n    \"colsample_bytree / feature_fraction\": {\n        \"описание\": \"Доля признаков для каждого дерева\",\n        \"диапазон\": \"0.5 — 1.0\",\n        \"совет\": \"0.7-0.8 добавляет разнообразие\"\n    },\n    \"min_child_weight / min_child_samples\": {\n        \"описание\": \"Минимальный размер листа\",\n        \"диапазон\": \"1 — 100\",\n        \"совет\": \"Больше = более консервативно\"\n    },\n    \"reg_alpha / reg_lambda\": {\n        \"описание\": \"L1 и L2 регуляризация\",\n        \"диапазон\": \"0 — 10\",\n        \"совет\": \"Помогает при overfitting\"\n    },\n}\n\nprint(\"=== Гиперпараметры Gradient Boosting ===\")\nfor param, info in params_guide.items():\n    print(f\"\\n  {param}\")\n    for k, v in info.items():\n        print(f\"    {k}: {v}\")'
        },
        {
          type: 'warning',
          value: 'Всегда используйте early stopping! Установите n_estimators=5000 и early_stopping_rounds=50-100. Модель сама остановится, когда validation score перестанет улучшаться. Это предотвращает переобучение и экономит время.'
        }
      ]
    },
    {
      id: 5,
      title: 'Практика: Тюнинг XGBoost и LightGBM',
      type: 'practice',
      difficulty: 'medium',
      description: 'Подберите оптимальные гиперпараметры gradient boosting с помощью Optuna.',
      requirements: [
        'Создайте табличный датасет (5000 строк, 12 признаков) с бинарной целевой',
        'Реализуйте ручной grid search по 3 ключевым параметрам (max_depth, learning_rate, n_estimators)',
        'Реализуйте Optuna-подобный поиск (random search с оценкой по CV AUC)',
        'Выведите лучшие параметры и их AUC',
        'Сравните default параметры vs tuned'
      ],
      hint: 'Для Optuna-подобного поиска: в цикле генерируйте случайные комбинации параметров, оценивайте каждую через cross_val_score и запоминайте лучшую.',
      expectedOutput: 'Hyperparameter Tuning:\nDefault GBT: AUC=0.XXXX\n\nGrid Search (XX trials):\n  Best: max_depth=X, lr=X.XX, n_est=XXX -> AUC=0.XXXX\n\nRandom Search (XX trials):\n  Best: {...} -> AUC=0.XXXX\n\nУлучшение: +X.XXXX',
      solution: 'import numpy as np\nimport pandas as pd\nfrom sklearn.model_selection import cross_val_score, StratifiedKFold\nfrom sklearn.preprocessing import LabelEncoder\nfrom sklearn.ensemble import GradientBoostingClassifier\n\nnp.random.seed(42)\nn = 5000\n\ndf = pd.DataFrame({\n    "f1": np.random.normal(0, 1, n),\n    "f2": np.random.exponential(2, n),\n    "f3": np.random.uniform(-5, 5, n),\n    "f4": np.random.normal(5, 2, n),\n    "f5": np.random.lognormal(0, 0.5, n),\n    "f6": np.random.beta(2, 5, n),\n    "f7": np.random.poisson(3, n).astype(float),\n    "f8": np.random.gamma(2, 1, n),\n    "cat1": np.random.choice(["A","B","C","D"], n),\n    "cat2": np.random.choice(["X","Y","Z"], n),\n    "cat3": np.random.choice(["low","mid","high"], n),\n    "bin1": np.random.choice([0, 1], n, p=[0.6, 0.4]),\n})\n\nfor col in ["cat1","cat2","cat3"]:\n    df[col] = LabelEncoder().fit_transform(df[col])\n\ntarget_p = (0.3 + 0.12*df["f1"] - 0.04*df["f2"] + 0.06*df["f5"]\n            + 0.05*df["cat1"]/3 + 0.05*df["bin1"]).clip(0.05, 0.95)\ndf["target"] = (np.random.random(n) < target_p).astype(int)\n\nX = df.drop("target", axis=1).values\ny = df["target"].values\nkfold = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)\n\n# Default\ndefault_gbt = GradientBoostingClassifier(random_state=42)\ndefault_auc = cross_val_score(default_gbt, X, y, cv=kfold, scoring="roc_auc").mean()\nprint("Hyperparameter Tuning:")\nprint(f"Default GBT: AUC={default_auc:.4f}")\n\n# Grid Search\nprint("\\nGrid Search:")\nbest_grid = {"auc": 0, "params": {}}\ntrial_count = 0\nfor md in [3, 5, 7]:\n    for lr in [0.01, 0.05, 0.1]:\n        for n_est in [100, 200, 300]:\n            trial_count += 1\n            gbt = GradientBoostingClassifier(\n                max_depth=md, learning_rate=lr, n_estimators=n_est, random_state=42\n            )\n            auc = cross_val_score(gbt, X, y, cv=kfold, scoring="roc_auc").mean()\n            if auc > best_grid["auc"]:\n                best_grid["auc"] = auc\n                best_grid["params"] = {"max_depth": md, "lr": lr, "n_est": n_est}\n\nprint(f"  Trials: {trial_count}")\nprint(f"  Best: {best_grid[\'params\']} -> AUC={best_grid[\'auc\']:.4f}")\n\n# Random Search (Optuna-like)\nprint("\\nRandom Search (50 trials):")\nbest_random = {"auc": 0, "params": {}}\n\nfor trial in range(50):\n    params = {\n        "max_depth": np.random.randint(3, 10),\n        "learning_rate": np.random.choice([0.01, 0.02, 0.05, 0.08, 0.1, 0.15]),\n        "n_estimators": np.random.choice([100, 200, 300, 400, 500]),\n        "subsample": np.random.choice([0.7, 0.8, 0.9, 1.0]),\n        "min_samples_leaf": np.random.choice([5, 10, 20, 50]),\n    }\n    gbt = GradientBoostingClassifier(\n        max_depth=params["max_depth"],\n        learning_rate=params["learning_rate"],\n        n_estimators=params["n_estimators"],\n        subsample=params["subsample"],\n        min_samples_leaf=params["min_samples_leaf"],\n        random_state=42\n    )\n    auc = cross_val_score(gbt, X, y, cv=kfold, scoring="roc_auc").mean()\n    if auc > best_random["auc"]:\n        best_random["auc"] = auc\n        best_random["params"] = params\n\nprint(f"  Best params: {best_random[\'params\']}")\nprint(f"  Best AUC: {best_random[\'auc\']:.4f}")\n\nbest_overall = max(best_grid["auc"], best_random["auc"])\nprint(f"\\nУлучшение vs default: +{best_overall - default_auc:.4f}")\n\nprint("\\n# === Optuna код (для реального использования) ===")\nprint(\"\"\"import optuna\n\ndef objective(trial):\n    params = {\n        \"max_depth\": trial.suggest_int(\"max_depth\", 3, 10),\n        \"learning_rate\": trial.suggest_float(\"learning_rate\", 0.01, 0.3, log=True),\n        \"n_estimators\": trial.suggest_int(\"n_estimators\", 100, 1000),\n        \"subsample\": trial.suggest_float(\"subsample\", 0.5, 1.0),\n        \"colsample_bytree\": trial.suggest_float(\"colsample_bytree\", 0.5, 1.0),\n        \"min_child_weight\": trial.suggest_int(\"min_child_weight\", 1, 100),\n        \"reg_alpha\": trial.suggest_float(\"reg_alpha\", 1e-8, 10.0, log=True),\n        \"reg_lambda\": trial.suggest_float(\"reg_lambda\", 1e-8, 10.0, log=True),\n    }\n    model = xgb.XGBClassifier(**params, use_label_encoder=False, eval_metric=\"auc\")\n    auc = cross_val_score(model, X, y, cv=5, scoring=\"roc_auc\").mean()\n    return auc\n\nstudy = optuna.create_study(direction=\"maximize\")\nstudy.optimize(objective, n_trials=100)\nprint(study.best_params)\n\"\"\")',
      explanation: 'Hyperparameter tuning может дать +1-3% к score. Grid search прост, но неэффективен при многих параметрах. Random search покрывает больше пространства. Optuna (Bayesian optimization) — лучший вариант: он учится на предыдущих trials и находит оптимум быстрее. На Kaggle 100-200 trials Optuna — стандартная практика.'
    },
    {
      id: 6,
      title: 'Feature Engineering для табличных данных',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Продвинутые техники FE'
        },
        {
          type: 'text',
          value: 'Feature Engineering для табличных данных: target encoding, frequency encoding, агрегации по группам, взаимодействия, кластеризация как признак, PCA компоненты. Каждая техника может дать +0.5-2% к score.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import numpy as np\nimport pandas as pd\nfrom sklearn.model_selection import KFold\n\nnp.random.seed(42)\nn = 2000\ndf = pd.DataFrame({\n    "cat_city": np.random.choice(["Moscow","SPb","Novosibirsk","Kazan","Sochi"], n, p=[0.3,0.25,0.2,0.15,0.1]),\n    "cat_type": np.random.choice(["A","B","C"], n),\n    "num_value": np.random.normal(100, 30, n),\n    "num_count": np.random.poisson(5, n).astype(float),\n})\ntarget_p = (0.3 + 0.05*(df["cat_city"]=="Moscow") + 0.1*(df["cat_type"]=="A")\n            + 0.002*df["num_value"]).clip(0.05, 0.95)\ndf["target"] = (np.random.random(n) < target_p).astype(int)\n\n# 1. Target Encoding (с кросс-валидацией для избежания leakage)\nprint("=== 1. Target Encoding (OOF) ===")\n\ndef target_encode_oof(df, col, target, n_splits=5, alpha=5):\n    \"\"\"Target encoding с out-of-fold для предотвращения leakage\"\"\"\n    global_mean = df[target].mean()\n    result = pd.Series(index=df.index, dtype=float)\n    kf = KFold(n_splits=n_splits, shuffle=True, random_state=42)\n    \n    for train_idx, val_idx in kf.split(df):\n        stats = df.iloc[train_idx].groupby(col)[target].agg(["mean", "count"])\n        smoothed = (stats["count"] * stats["mean"] + alpha * global_mean) / (stats["count"] + alpha)\n        result.iloc[val_idx] = df.iloc[val_idx][col].map(smoothed)\n    \n    result.fillna(global_mean, inplace=True)\n    return result\n\ndf["city_target_enc"] = target_encode_oof(df, "cat_city", "target")\nprint("Target encoding по городам:")\nfor city in df["cat_city"].unique():\n    val = df[df["cat_city"]==city]["city_target_enc"].mean()\n    print(f"  {city:15s}: {val:.3f}")\n\n# 2. Frequency Encoding\nprint("\\n=== 2. Frequency Encoding ===")\nfreq = df["cat_city"].value_counts(normalize=True)\ndf["city_freq"] = df["cat_city"].map(freq)\nprint(df[["cat_city", "city_freq"]].drop_duplicates().sort_values("city_freq", ascending=False))'
        },
        {
          type: 'heading',
          value: 'Агрегации и взаимодействия'
        },
        {
          type: 'code',
          language: 'python',
          value: '# 3. Агрегации по группам\nprint("\\n=== 3. Агрегации по группам ===")\nfor agg in ["mean", "std", "min", "max"]:\n    col_name = f"value_{agg}_by_city"\n    df[col_name] = df.groupby("cat_city")["num_value"].transform(agg)\n\n# Разница от среднего по группе\ndf["value_diff_from_city_mean"] = df["num_value"] - df["value_mean_by_city"]\n\nprint("Агрегации num_value по городам:")\nfor city in ["Moscow", "SPb"]:\n    m = df[df["cat_city"]==city]["value_mean_by_city"].iloc[0]\n    s = df[df["cat_city"]==city]["value_std_by_city"].iloc[0]\n    print(f"  {city}: mean={m:.1f}, std={s:.1f}")\n\n# 4. Interactions (комбинации признаков)\nprint("\\n=== 4. Interactions ===")\ndf["value_x_count"] = df["num_value"] * df["num_count"]\ndf["value_per_count"] = df["num_value"] / (df["num_count"] + 1)\ndf["city_type"] = df["cat_city"] + "_" + df["cat_type\"]\n\nprint(f\"Новые взаимодействия: value_x_count, value_per_count, city_type\")\nprint(f\"city_type уникальных: {df[\'city_type\'].nunique()}\")\n\n# 5. Кластеры как признаки\nprint(\"\\n=== 5. KMeans кластеры ===\")\nfrom sklearn.cluster import KMeans\nfrom sklearn.preprocessing import StandardScaler\n\nnum_feats = df[[\"num_value\", \"num_count\"]].values\nscaled = StandardScaler().fit_transform(num_feats)\nkm = KMeans(n_clusters=5, random_state=42, n_init=10)\ndf[\"cluster\"] = km.fit_predict(scaled)\n\nprint(\"Survival rate по кластерам:\")\nfor c in range(5):\n    rate = df[df[\"cluster\"]==c][\"target\"].mean()\n    cnt = (df[\"cluster\"]==c).sum()\n    print(f\"  Cluster {c}: {rate:.1%} (n={cnt})\")\n\nprint(f\"\\nИтого новых признаков: {len(df.columns) - 5}\")'
        },
        {
          type: 'tip',
          value: 'Топ FE техники для табличных конкурсов: (1) Target encoding с OOF, (2) Агрегации по категориальным группам, (3) Difference from group mean, (4) Interaction features, (5) KMeans clusters. Каждая может дать +0.5-1% к score.'
        }
      ]
    },
    {
      id: 7,
      title: 'Практика: Продвинутый FE',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте полный набор продвинутых feature engineering техник для табличного датасета.',
      requirements: [
        'Создайте TPS-like датасет (5000 строк, 8 числовых + 4 категориальных признака)',
        'Реализуйте OOF target encoding для 2+ категориальных признаков',
        'Создайте агрегационные признаки: mean, std, min, max по группам',
        'Добавьте взаимодействия (произведения, отношения) для топ числовых фичей',
        'Сравните AUC: до FE vs после FE (baseline GBT)'
      ],
      hint: 'Для OOF target encoding используйте KFold: на каждом фолде кодируйте только по train части. Агрегации: df.groupby(cat_col)[num_col].transform("mean").',
      expectedOutput: 'Feature Engineering Pipeline:\nДо FE: X признаков, AUC=0.XXXX\nПосле FE: XX признаков\n\nНовые признаки:\n  Target encodings: X\n  Агрегации: X\n  Взаимодействия: X\n\nПосле FE: AUC=0.XXXX\nУлучшение: +X.XXXX',
      solution: 'import numpy as np\nimport pandas as pd\nfrom sklearn.model_selection import cross_val_score, StratifiedKFold, KFold\nfrom sklearn.preprocessing import LabelEncoder, StandardScaler\nfrom sklearn.ensemble import GradientBoostingClassifier\nfrom sklearn.cluster import KMeans\n\nnp.random.seed(42)\nn = 5000\n\ndf = pd.DataFrame({\n    "n1": np.random.normal(0, 1, n),\n    "n2": np.random.exponential(2, n),\n    "n3": np.random.uniform(-5, 5, n),\n    "n4": np.random.normal(10, 3, n),\n    "n5": np.random.lognormal(0, 0.5, n),\n    "n6": np.random.beta(2, 5, n),\n    "n7": np.random.poisson(5, n).astype(float),\n    "n8": np.random.gamma(2, 2, n),\n    "c1": np.random.choice(["A","B","C","D","E"], n, p=[0.3,0.25,0.2,0.15,0.1]),\n    "c2": np.random.choice(["X","Y","Z"], n),\n    "c3": np.random.choice(["low","mid","high"], n, p=[0.3,0.5,0.2]),\n    "c4": np.random.choice([f"v{i}" for i in range(10)], n),\n})\n\ntarget_p = (0.3 + 0.12*df["n1"] - 0.04*df["n2"] + 0.06*df["n5"]\n            + 0.08*(df["c1"]=="A") + 0.05*(df["c3"]=="high")).clip(0.05, 0.95)\ndf["target"] = (np.random.random(n) < target_p).astype(int)\n\n# Baseline (до FE)\ndf_base = df.copy()\nfor col in ["c1","c2","c3","c4"]:\n    df_base[col] = LabelEncoder().fit_transform(df_base[col])\n\nX_base = df_base.drop("target", axis=1).values\ny = df_base["target"].values\nkfold = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)\n\ngbt = GradientBoostingClassifier(n_estimators=200, max_depth=5, learning_rate=0.1, random_state=42)\nauc_before = cross_val_score(gbt, X_base, y, cv=kfold, scoring="roc_auc").mean()\n\norig_features = len(df.columns) - 1\nprint("Feature Engineering Pipeline:")\nprint(f"До FE: {orig_features} признаков, AUC={auc_before:.4f}")\n\n# === Feature Engineering ===\ndf_fe = df.copy()\n\n# 1. OOF Target Encoding\ndef oof_target_encode(df, col, target, n_splits=5, alpha=5):\n    global_mean = df[target].mean()\n    result = pd.Series(index=df.index, dtype=float)\n    kf = KFold(n_splits=n_splits, shuffle=True, random_state=42)\n    for tr_idx, val_idx in kf.split(df):\n        stats = df.iloc[tr_idx].groupby(col)[target].agg(["mean","count"])\n        smoothed = (stats["count"]*stats["mean"] + alpha*global_mean) / (stats["count"] + alpha)\n        result.iloc[val_idx] = df.iloc[val_idx][col].map(smoothed)\n    result.fillna(global_mean, inplace=True)\n    return result\n\nte_count = 0\nfor col in ["c1","c2","c3","c4"]:\n    df_fe[f"{col}_te"] = oof_target_encode(df_fe, col, "target")\n    te_count += 1\n\n# 2. Frequency Encoding\nfor col in ["c1","c4"]:\n    freq = df_fe[col].value_counts(normalize=True)\n    df_fe[f"{col}_freq"] = df_fe[col].map(freq)\n\n# 3. Агрегации по группам\nagg_count = 0\nfor cat_col in ["c1","c3"]:\n    for num_col in ["n1","n2","n5"]:\n        for agg in ["mean","std"]:\n            col_name = f"{num_col}_{agg}_by_{cat_col}"\n            df_fe[col_name] = df_fe.groupby(cat_col)[num_col].transform(agg)\n            agg_count += 1\n    # Разница от среднего\n    df_fe[f"n1_diff_{cat_col}"] = df_fe["n1"] - df_fe.groupby(cat_col)["n1"].transform("mean")\n    agg_count += 1\n\n# 4. Взаимодействия\ninteraction_count = 0\ndf_fe["n1_x_n2"] = df_fe["n1"] * df_fe["n2"]\ndf_fe["n1_x_n5"] = df_fe["n1"] * df_fe["n5"]\ndf_fe["n4_div_n2"] = df_fe["n4"] / (df_fe["n2"] + 0.01)\ndf_fe["n5_plus_n8"] = df_fe["n5"] + df_fe["n8"]\ninteraction_count = 4\n\n# 5. KMeans clusters\nnum_feats = df_fe[["n1","n2","n4","n5"]].values\nscaled = StandardScaler().fit_transform(num_feats)\ndf_fe["cluster"] = KMeans(n_clusters=5, random_state=42, n_init=10).fit_predict(scaled)\n\n# Label encode categories\nfor col in ["c1","c2","c3","c4"]:\n    df_fe[col] = LabelEncoder().fit_transform(df_fe[col])\n\nnew_features = len(df_fe.columns) - 1 - orig_features\nprint(f"После FE: {len(df_fe.columns) - 1} признаков")\nprint(f"\\nНовые признаки:")\nprint(f"  Target encodings: {te_count}")\nprint(f"  Frequency encodings: 2")\nprint(f"  Агрегации: {agg_count}")\nprint(f"  Взаимодействия: {interaction_count}")\nprint(f"  Кластеры: 1")\n\n# AUC после FE\nX_fe = df_fe.drop("target", axis=1).values\nauc_after = cross_val_score(gbt, X_fe, y, cv=kfold, scoring="roc_auc").mean()\nprint(f"\\nПосле FE: AUC={auc_after:.4f}")\nprint(f"Улучшение: +{auc_after - auc_before:.4f}")',
      explanation: 'Продвинутый FE для табличных данных: OOF target encoding безопасно кодирует категории без leakage, агрегации по группам дают контекст (как значение соотносится со средним в группе), взаимодействия ловят нелинейные зависимости, кластеры группируют похожие примеры. Вместе эти техники дают +1-3% к AUC.'
    },
    {
      id: 8,
      title: 'Практика: Pseudo labeling + Stacking',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте финальное решение для табличного конкурса: pseudo labeling и stacking ensemble.',
      requirements: [
        'Создайте train (5000) и test (2000) датасеты с FE',
        'Обучите 3 модели (GBT, RF, LogReg) и создайте stacking ensemble',
        'Реализуйте pseudo labeling: предскажите на test, добавьте уверенные предсказания к train',
        'Переобучите stacking с pseudo labels и сравните AUC',
        'Выведите финальный submission с распределением предсказаний'
      ],
      hint: 'Pseudo labeling: используйте только примеры с уверенностью > 0.95 или < 0.05. Это даёт дополнительные обучающие данные. Стекинг: OOF предсказания базовых моделей -> мета-модель.',
      expectedOutput: 'Final Solution:\nTrain: 5000, Test: 2000\n\nBase models (CV AUC):\n  GBT: 0.XXXX\n  RF: 0.XXXX\n  LogReg: 0.XXXX\n\nStacking AUC: 0.XXXX\nPseudo labeled: +XXX примеров\nStacking + PL AUC: 0.XXXX\n\nSubmission: mean=X.XX, positive=XX.X%',
      solution: 'import numpy as np\nimport pandas as pd\nfrom sklearn.model_selection import cross_val_score, cross_val_predict, StratifiedKFold, KFold\nfrom sklearn.preprocessing import LabelEncoder, StandardScaler\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier\nfrom sklearn.pipeline import Pipeline\nfrom sklearn.metrics import roc_auc_score\n\nnp.random.seed(42)\n\ndef create_data(n, seed):\n    np.random.seed(seed)\n    df = pd.DataFrame({\n        "n1": np.random.normal(0, 1, n),\n        "n2": np.random.exponential(2, n),\n        "n3": np.random.uniform(-5, 5, n),\n        "n4": np.random.normal(10, 3, n),\n        "n5": np.random.lognormal(0, 0.5, n),\n        "n6": np.random.beta(2, 5, n),\n        "c1": np.random.choice(["A","B","C","D"], n),\n        "c2": np.random.choice(["X","Y","Z"], n),\n    })\n    return df\n\ndef apply_fe(df):\n    df = df.copy()\n    df["n1_x_n2"] = df["n1"] * df["n2"]\n    df["n4_div_n2"] = df["n4"] / (df["n2"] + 0.01)\n    df["n5_plus_n6"] = df["n5"] + df["n6"]\n    for col in ["c1","c2"]:\n        freq = df[col].value_counts(normalize=True)\n        df[f"{col}_freq"] = df[col].map(freq)\n        df[col] = LabelEncoder().fit_transform(df[col])\n    return df\n\n# Создание данных\ntrain_raw = create_data(5000, 42)\ntarget_p = (0.3 + 0.12*train_raw["n1"] - 0.04*train_raw["n2"]\n            + 0.06*train_raw["n5"] + 0.08*(train_raw["c1"]=="A")).clip(0.05, 0.95)\ntrain_raw["target"] = (np.random.random(5000) < target_p).astype(int)\n\ntest_raw = create_data(2000, 99)\ntest_target_p = (0.3 + 0.12*test_raw["n1"] - 0.04*test_raw["n2"]\n                 + 0.06*test_raw["n5"] + 0.08*(test_raw["c1"]=="A")).clip(0.05, 0.95)\ntest_true = (np.random.RandomState(99).random(2000) < test_target_p).astype(int)\n\ntrain_fe = apply_fe(train_raw.drop("target", axis=1))\ntest_fe = apply_fe(test_raw)\n\nX_train = train_fe.values\ny_train = train_raw["target"].values\nX_test = test_fe.values\n\nkfold = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)\n\nprint("Final Solution:")\nprint(f"Train: {len(X_train)}, Test: {len(X_test)}")\n\n# Базовые модели\nbase_models = {\n    "GBT": GradientBoostingClassifier(n_estimators=300, max_depth=5, learning_rate=0.08, random_state=42),\n    "RF": RandomForestClassifier(n_estimators=300, max_depth=12, random_state=42),\n    "LogReg": Pipeline([("s", StandardScaler()), ("m", LogisticRegression(C=1.0, max_iter=1000))]),\n}\n\nprint("\\nBase models (CV AUC):")\noof_preds = {}\ntest_preds = {}\n\nfor name, model in base_models.items():\n    oof = cross_val_predict(model, X_train, y_train, cv=kfold, method="predict_proba\")[:, 1]\n    oof_preds[name] = oof\n    auc = roc_auc_score(y_train, oof)\n    print(f\"  {name}: {auc:.4f}\")\n    model.fit(X_train, y_train)\n    test_preds[name] = model.predict_proba(X_test)[:, 1]\n\n# Stacking\nmeta_X_train = np.column_stack(list(oof_preds.values()))\nmeta_X_test = np.column_stack(list(test_preds.values()))\n\nmeta_model = LogisticRegression(C=1.0, max_iter=1000)\nmeta_oof = cross_val_predict(meta_model, meta_X_train, y_train, cv=kfold, method=\"predict_proba\")[:, 1]\nstack_auc = roc_auc_score(y_train, meta_oof)\nprint(f\"\\nStacking AUC: {stack_auc:.4f}\")\n\n# Pseudo Labeling\nmeta_model.fit(meta_X_train, y_train)\ntest_probs = meta_model.predict_proba(meta_X_test)[:, 1]\n\n# Берём только уверенные предсказания\nhigh_conf_mask = (test_probs > 0.9) | (test_probs < 0.1)\npseudo_X = X_test[high_conf_mask]\npseudo_y = (test_probs[high_conf_mask] > 0.5).astype(int)\n\nprint(f\"Pseudo labeled: +{len(pseudo_y)} примеров (из {len(X_test)})\")\nprint(f\"  Positive: {pseudo_y.mean():.1%}\")\n\n# Переобучение с pseudo labels\nX_train_pl = np.vstack([X_train, pseudo_X])\ny_train_pl = np.concatenate([y_train, pseudo_y])\n\noof_preds_pl = {}\nfor name, model_cls in [(\"GBT\", GradientBoostingClassifier(n_estimators=300, max_depth=5, learning_rate=0.08, random_state=42)),\n                         (\"RF\", RandomForestClassifier(n_estimators=300, max_depth=12, random_state=42)),\n                         (\"LogReg\", Pipeline([(\"s\", StandardScaler()), (\"m\", LogisticRegression(C=1.0, max_iter=1000))]))]:\n    # CV на оригинальном train\n    model_cls.fit(X_train_pl, y_train_pl)\n    oof_pl = model_cls.predict_proba(X_train)[:, 1]\n    oof_preds_pl[name] = oof_pl\n\nmeta_X_pl = np.column_stack(list(oof_preds_pl.values()))\nmeta_model_pl = LogisticRegression(C=1.0, max_iter=1000)\nmeta_model_pl.fit(meta_X_pl, y_train)\n\n# Финальные предсказания на test\ntest_preds_pl = {}\nfor name, model_cls in [(\"GBT\", GradientBoostingClassifier(n_estimators=300, max_depth=5, learning_rate=0.08, random_state=42)),\n                         (\"RF\", RandomForestClassifier(n_estimators=300, max_depth=12, random_state=42)),\n                         (\"LogReg\", Pipeline([(\"s\", StandardScaler()), (\"m\", LogisticRegression(C=1.0, max_iter=1000))]))]:\n    model_cls.fit(X_train_pl, y_train_pl)\n    test_preds_pl[name] = model_cls.predict_proba(X_test)[:, 1]\n\nmeta_X_test_pl = np.column_stack(list(test_preds_pl.values()))\nfinal_probs = meta_model_pl.predict_proba(meta_X_test_pl)[:, 1]\nfinal_auc = roc_auc_score(test_true, final_probs)\n\nprint(f\"Stacking + PL AUC: {final_auc:.4f}\")\n\n# Submission\nsubmission = pd.DataFrame({\"id\": range(len(final_probs)), \"target\": (final_probs > 0.5).astype(int)})\nprint(f\"\\nSubmission: mean={final_probs.mean():.3f}, positive={submission[\'target\'].mean():.1%}\")\nprint(f\"\\nПримеры предсказаний:\")\nfor i in range(5):\n    print(f\"  id={i}: prob={final_probs[i]:.3f}, pred={submission.iloc[i][\'target\']}, true={test_true[i]}\")',
      explanation: 'Финальное решение для табличного конкурса: (1) Feature Engineering, (2) Stacking из разных моделей, (3) Pseudo labeling — добавление уверенных предсказаний теста в train. Pseudo labeling работает как semi-supervised learning и даёт +0.5-1% на больших тестовых данных. Важно: используйте только примеры с высокой уверенностью (>0.9 или <0.1).'
    }
  ]
}
