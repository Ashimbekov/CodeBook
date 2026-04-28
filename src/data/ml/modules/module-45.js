export default {
  id: 45,
  title: 'Практикум: Kaggle-задачи',
  description: 'Практические задачи в стиле Kaggle: Titanic, House Prices, NLP, Image classification, Time series, Feature engineering.',
  lessons: [
    {
      id: 1,
      title: 'Kaggle: Titanic Survival',
      type: 'practice',
      difficulty: 'easy',
      description: 'Классическая задача: предсказать выживание пассажиров Титаника.',
      requirements: [
        'Создайте синтетический Titanic-like датасет (800 пассажиров): Pclass, Sex, Age, SibSp, Parch, Fare, Embarked, Survived',
        'Выполните EDA: распределение survived, survival rate по классам и полу',
        'Обработайте данные: заполните пропуски, закодируйте категории',
        'Обучите 3 модели (LogReg, RF, GBT) и сравните с cross-validation',
        'Выведите лучшую модель и её accuracy'
      ],
      hint: 'Пол (Sex) — самый важный признак. Создайте признаки: FamilySize = SibSp + Parch + 1, IsAlone = FamilySize == 1. Заполняйте Age медианой по Pclass.',
      expectedOutput: 'Titanic Survival Prediction:\nEDA:\n  Survival rate: XX%\n  Female survival: XX%\n  Male survival: XX%\n\nМодели (5-fold CV):\n  LogReg: accuracy=0.XX\n  RF: accuracy=0.XX\n  GBT: accuracy=0.XX\nЛучшая: ...',
      solution: 'import numpy as np\nimport pandas as pd\nfrom sklearn.model_selection import cross_val_score\nfrom sklearn.preprocessing import LabelEncoder\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier\nfrom sklearn.pipeline import Pipeline\nfrom sklearn.preprocessing import StandardScaler\n\nnp.random.seed(42)\nn = 800\ndf = pd.DataFrame({\n    "Pclass": np.random.choice([1,2,3], n, p=[0.25, 0.25, 0.5]),\n    "Sex": np.random.choice(["male","female"], n, p=[0.6, 0.4]),\n    "Age": np.where(np.random.random(n) < 0.2, np.nan, np.random.uniform(1, 80, n)),\n    "SibSp": np.random.choice([0,1,2,3], n, p=[0.5, 0.3, 0.15, 0.05]),\n    "Parch": np.random.choice([0,1,2,3], n, p=[0.6, 0.25, 0.1, 0.05]),\n    "Fare": np.random.uniform(5, 500, n),\n    "Embarked": np.random.choice(["S","C","Q"], n, p=[0.7, 0.2, 0.1]),\n})\nsurvival_prob = 0.3 + 0.3*(df["Sex"]=="female").astype(float) - 0.1*(df["Pclass"]-1) + 0.001*df["Fare"]\ndf["Survived"] = (np.random.random(n) < survival_prob.clip(0.05, 0.95)).astype(int)\n\nprint("Titanic Survival Prediction:")\nprint("EDA:")\nprint(f"  Survival rate: {df[\'Survived\'].mean()*100:.1f}%")\nprint(f"  Female survival: {df[df[\'Sex\']==\'female\'][\'Survived\'].mean()*100:.1f}%")\nprint(f"  Male survival: {df[df[\'Sex\']==\'male\'][\'Survived\'].mean()*100:.1f}%")\n\ndf["Age"].fillna(df.groupby("Pclass")["Age"].transform("median"), inplace=True)\ndf["FamilySize"] = df["SibSp"] + df["Parch"] + 1\ndf["IsAlone"] = (df["FamilySize"] == 1).astype(int)\ndf["Sex"] = LabelEncoder().fit_transform(df["Sex"])\ndf["Embarked"] = LabelEncoder().fit_transform(df["Embarked"])\n\nfeatures = ["Pclass","Sex","Age","SibSp","Parch","Fare","Embarked","FamilySize","IsAlone"]\nX = df[features]\ny = df["Survived"]\n\nmodels = {\n    "LogReg": Pipeline([("s", StandardScaler()), ("m", LogisticRegression(max_iter=1000))]),\n    "RF": RandomForestClassifier(n_estimators=100, random_state=42),\n    "GBT": GradientBoostingClassifier(n_estimators=100, random_state=42)\n}\n\nprint("\\nМодели (5-fold CV):")\nbest_name, best_score = "", 0\nfor name, model in models.items():\n    score = cross_val_score(model, X, y, cv=5, scoring="accuracy").mean()\n    print(f"  {name}: accuracy={score:.4f}")\n    if score > best_score:\n        best_score = score\n        best_name = name\nprint(f"Лучшая: {best_name} ({best_score:.4f})")',
      explanation: 'Titanic — классическая задача бинарной классификации. Ключевые инсайты: пол — главный фактор выживания ("women and children first"), класс каюты и стоимость билета также важны. Feature engineering (FamilySize, IsAlone) добавляет полезную информацию.'
    },
    {
      id: 2,
      title: 'Kaggle: House Prices',
      type: 'practice',
      difficulty: 'medium',
      description: 'Предсказание цены дома по его характеристикам (регрессия).',
      requirements: [
        'Создайте датасет из 1000 домов: area, bedrooms, bathrooms, year_built, garage, neighborhood, condition, price',
        'Обработайте данные: log-transform цены, encode категории',
        'Создайте 3+ новых признака (age, total_rooms, area_per_room)',
        'Обучите и сравните Ridge, RandomForestRegressor, GradientBoostingRegressor',
        'Выведите RMSE и R2 для каждой модели'
      ],
      hint: 'Log-transform цены делает распределение нормальным, что улучшает регрессию. Не забудьте exp() при обратном преобразовании. RMSE считайте на оригинальных (не log) ценах.',
      expectedOutput: 'House Prices Prediction:\nПризнаков создано: X\n\nМодели (RMSE / R2):\n  Ridge: RMSE=XXXXX, R2=0.XX\n  RF: RMSE=XXXXX, R2=0.XX\n  GBT: RMSE=XXXXX, R2=0.XX\nЛучшая: ...',
      solution: 'import numpy as np\nimport pandas as pd\nfrom sklearn.model_selection import cross_val_score\nfrom sklearn.preprocessing import LabelEncoder, StandardScaler\nfrom sklearn.linear_model import Ridge\nfrom sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor\nfrom sklearn.pipeline import Pipeline\nfrom sklearn.metrics import mean_squared_error, r2_score\n\nnp.random.seed(42)\nn = 1000\ndf = pd.DataFrame({\n    "area": np.random.uniform(50, 300, n),\n    "bedrooms": np.random.choice([1,2,3,4,5], n, p=[0.1,0.2,0.35,0.25,0.1]),\n    "bathrooms": np.random.choice([1,2,3], n, p=[0.3,0.5,0.2]),\n    "year_built": np.random.randint(1950, 2024, n),\n    "garage": np.random.choice([0,1,2], n, p=[0.3,0.5,0.2]),\n    "neighborhood": np.random.choice(["A","B","C","D"], n),\n    "condition": np.random.choice(["poor","fair","good","excellent"], n, p=[0.1,0.3,0.4,0.2]),\n})\nneighborhood_mult = {"A": 1.3, "B": 1.0, "C": 0.8, "D": 1.1}\ncondition_mult = {"poor": 0.7, "fair": 0.9, "good": 1.0, "excellent": 1.2}\ndf["price"] = (df["area"] * 1000 + df["bedrooms"] * 15000 + df["bathrooms"] * 10000 +\n               (2024 - df["year_built"]) * (-500) + df["garage"] * 20000 +\n               df["neighborhood"].map(neighborhood_mult) * 50000 +\n               df["condition"].map(condition_mult) * 30000 +\n               np.random.normal(0, 15000, n)).clip(30000)\n\ndf["age"] = 2024 - df["year_built"]\ndf["total_rooms"] = df["bedrooms"] + df["bathrooms"]\ndf["area_per_room"] = df["area"] / df["total_rooms"]\ndf["log_price"] = np.log1p(df["price"])\n\nfor col in ["neighborhood", "condition"]:\n    df[col] = LabelEncoder().fit_transform(df[col])\n\nfeatures = ["area","bedrooms","bathrooms","year_built","garage","neighborhood","condition","age","total_rooms","area_per_room"]\nX = df[features]\ny = df["log_price"]\n\nmodels = {\n    "Ridge": Pipeline([("s", StandardScaler()), ("m", Ridge())]),\n    "RF": RandomForestRegressor(n_estimators=100, random_state=42),\n    "GBT": GradientBoostingRegressor(n_estimators=100, random_state=42)\n}\n\nprint("House Prices Prediction:")\nprint(f"Признаков создано: {len(features)}")\nprint("\\nМодели (RMSE / R2):")\nbest_name, best_rmse = "", float("inf")\nfor name, model in models.items():\n    neg_mse = cross_val_score(model, X, y, cv=5, scoring="neg_mean_squared_error").mean()\n    r2 = cross_val_score(model, X, y, cv=5, scoring="r2").mean()\n    rmse_log = np.sqrt(-neg_mse)\n    rmse_orig = rmse_log * df["price"].mean()\n    print(f"  {name}: RMSE={rmse_orig:.0f}, R2={r2:.4f}")\n    if rmse_orig < best_rmse:\n        best_rmse = rmse_orig\n        best_name = name\nprint(f"Лучшая: {best_name}")',
      explanation: 'House Prices — классическая задача регрессии. Log-transform цены помогает, так как распределение цен скошено вправо. Feature engineering (age, total_rooms, area_per_room) даёт дополнительную информацию. GradientBoosting обычно побеждает на табличных данных.'
    },
    {
      id: 3,
      title: 'Kaggle: NLP Classification',
      type: 'practice',
      difficulty: 'medium',
      description: 'Классификация текстов по тематике с помощью TF-IDF и ML.',
      requirements: [
        'Создайте датасет из 200+ текстов по 4 категориям (tech, sport, science, politics)',
        'Примените TfidfVectorizer для преобразования',
        'Обучите и сравните Naive Bayes, LogReg и LinearSVC',
        'Выведите accuracy и classification report для лучшей модели',
        'Покажите confusion matrix'
      ],
      hint: 'TfidfVectorizer(max_features=5000, ngram_range=(1,2)) — хороший baseline. LinearSVC часто лучше для текстов, чем kernel SVM.',
      expectedOutput: 'NLP Classification:\nТекстов: 200+, Категорий: 4\n\nМодели:\n  NaiveBayes: accuracy=0.XX\n  LogReg: accuracy=0.XX\n  LinearSVC: accuracy=0.XX\nЛучшая: ...',
      solution: 'import numpy as np\nfrom sklearn.feature_extraction.text import TfidfVectorizer\nfrom sklearn.model_selection import cross_val_score, train_test_split\nfrom sklearn.naive_bayes import MultinomialNB\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.svm import LinearSVC\nfrom sklearn.metrics import classification_report, confusion_matrix\n\nnp.random.seed(42)\ntexts, labels = [], []\ntech_words = ["python programming code algorithm software developer api framework database cloud server machine learning AI neural network deep learning tensorflow pytorch model training deployment docker kubernetes microservice"]\nsport_words = ["football match team goal stadium player championship tournament basketball tennis swimming running marathon score victory defeat coach training race athlete"]\nscience_words = ["research experiment hypothesis theory physics chemistry biology quantum molecular genetics DNA evolution climate experiment laboratory discovery formula equation particle"]\npolitics_words = ["government election president congress law policy reform debate campaign vote democracy parliament minister legislation regulation budget economy trade diplomacy"]\n\nfor _ in range(60):\n    for words, label in [(tech_words[0], 0), (sport_words[0], 1), (science_words[0], 2), (politics_words[0], 3)]:\n        w = words.split()\n        n_words = np.random.randint(5, 12)\n        text = " ".join(np.random.choice(w, n_words))\n        texts.append(text)\n        labels.append(label)\n\nlabels = np.array(labels)\ncategory_names = ["tech", "sport", "science", "politics"]\n\nvectorizer = TfidfVectorizer(max_features=5000, ngram_range=(1, 2))\nX = vectorizer.fit_transform(texts)\nX_train, X_test, y_train, y_test = train_test_split(X, labels, test_size=0.2, random_state=42, stratify=labels)\n\nprint("NLP Classification:")\nprint(f"Текстов: {len(texts)}, Категорий: {len(category_names)}")\n\nmodels = {\n    "NaiveBayes": MultinomialNB(),\n    "LogReg": LogisticRegression(max_iter=1000),\n    "LinearSVC": LinearSVC(max_iter=2000)\n}\n\nprint("\\nМодели:")\nbest_name, best_score = "", 0\nfor name, model in models.items():\n    score = cross_val_score(model, X, labels, cv=5, scoring="accuracy").mean()\n    print(f"  {name}: accuracy={score:.4f}")\n    if score > best_score:\n        best_score = score\n        best_name = name\n\nprint(f"Лучшая: {best_name}")\n\nbest_model = models[best_name]\nbest_model.fit(X_train, y_train)\ny_pred = best_model.predict(X_test)\nprint(f"\\n{classification_report(y_test, y_pred, target_names=category_names)}")\nprint(f"Confusion Matrix:\\n{confusion_matrix(y_test, y_pred)}")',
      explanation: 'Text classification с TF-IDF — мощный baseline для NLP задач. Bigrams (ngram_range=(1,2)) улавливают словосочетания. LinearSVC часто лучше для текстов, так как данные высокоразмерные и линейно разделимые. Для лучших результатов используйте BERT fine-tuning.'
    },
    {
      id: 4,
      title: 'Kaggle: Image Classification',
      type: 'practice',
      difficulty: 'medium',
      description: 'Классификация изображений MNIST с помощью CNN.',
      requirements: [
        'Загрузите MNIST и нормализуйте',
        'Создайте CNN: Conv2D -> MaxPool -> Conv2D -> MaxPool -> Dense -> Output',
        'Обучите на 5 эпох с batch_size=128',
        'Выведите accuracy на train и test',
        'Покажите количество параметров модели'
      ],
      hint: 'Conv2D(32, (3,3), activation="relu") для первого слоя. Не забудьте Flatten() между Conv и Dense слоями. Dropout(0.5) перед последним Dense для регуляризации.',
      expectedOutput: 'MNIST CNN Classification:\nModel parameters: XX,XXX\nEpoch 5:\n  Train accuracy: 0.XX\n  Test accuracy: 0.XX',
      solution: 'import tensorflow as tf\nfrom tensorflow.keras import layers\nimport numpy as np\n\n(x_train, y_train), (x_test, y_test) = tf.keras.datasets.mnist.load_data()\nx_train = x_train.reshape(-1, 28, 28, 1).astype("float32") / 255.0\nx_test = x_test.reshape(-1, 28, 28, 1).astype("float32") / 255.0\n\nmodel = tf.keras.Sequential([\n    layers.Conv2D(32, (3, 3), activation="relu", input_shape=(28, 28, 1)),\n    layers.MaxPooling2D((2, 2)),\n    layers.Conv2D(64, (3, 3), activation="relu"),\n    layers.MaxPooling2D((2, 2)),\n    layers.Flatten(),\n    layers.Dropout(0.5),\n    layers.Dense(128, activation="relu"),\n    layers.Dense(10, activation="softmax")\n])\n\nmodel.compile(optimizer="adam", loss="sparse_categorical_crossentropy", metrics=["accuracy"])\n\nprint("MNIST CNN Classification:")\nprint(f"Model parameters: {model.count_params():,}")\n\nhistory = model.fit(x_train, y_train, epochs=5, batch_size=128,\n                    validation_data=(x_test, y_test), verbose=1)\n\ntrain_acc = history.history["accuracy"][-1]\ntest_acc = history.history["val_accuracy"][-1]\nprint(f"\\nEpoch 5:")\nprint(f"  Train accuracy: {train_acc:.4f}")\nprint(f"  Test accuracy: {test_acc:.4f}")',
      explanation: 'CNN автоматически извлекает пространственные признаки из изображений. Первые слои обнаруживают грани и текстуры, глубокие — сложные паттерны. MaxPooling уменьшает размерность, Dropout борется с переобучением. На MNIST CNN достигает >99% accuracy.'
    },
    {
      id: 5,
      title: 'Kaggle: Time Series Forecast',
      type: 'practice',
      difficulty: 'hard',
      description: 'Прогнозирование продаж магазина на основе временного ряда.',
      requirements: [
        'Создайте временной ряд продаж за 2 года (730 дней) с трендом, недельной и годовой сезонностью',
        'Разделите: train=первые 660 дней, test=последние 70 дней',
        'Создайте признаки: day_of_week, month, lag_7, rolling_mean_7, rolling_std_7',
        'Обучите GradientBoosting на признаках и предскажите test',
        'Выведите MAE, RMSE и MAPE'
      ],
      hint: 'Lag features: sales 7 дней назад. Rolling features: скользящее среднее за 7 дней. Эти признаки превращают time series в табличную задачу для ML.',
      expectedOutput: 'Time Series Forecast:\nТренировка: 660 дней\nТест: 70 дней\n\nGradientBoosting:\n  MAE: XX.XX\n  RMSE: XX.XX\n  MAPE: XX.XX%',
      solution: 'import numpy as np\nimport pandas as pd\nfrom sklearn.ensemble import GradientBoostingRegressor\n\nnp.random.seed(42)\nn = 730\ndates = pd.date_range("2022-01-01", periods=n, freq="D")\ntrend = np.linspace(100, 150, n)\nyearly = 20 * np.sin(2 * np.pi * np.arange(n) / 365)\nweekly = 10 * np.sin(2 * np.pi * np.arange(n) / 7)\nnoise = np.random.normal(0, 5, n)\ndf = pd.DataFrame({"date": dates, "sales": trend + yearly + weekly + noise})\n\ndf["day_of_week"] = df["date"].dt.dayofweek\ndf["month"] = df["date"].dt.month\ndf["day_of_year"] = df["date"].dt.dayofyear\ndf["lag_7"] = df["sales"].shift(7)\ndf["lag_14"] = df["sales"].shift(14)\ndf["rolling_mean_7"] = df["sales"].shift(1).rolling(7).mean()\ndf["rolling_std_7"] = df["sales"].shift(1).rolling(7).std()\ndf = df.dropna()\n\nfeatures = ["day_of_week", "month", "day_of_year", "lag_7", "lag_14", "rolling_mean_7", "rolling_std_7"]\ntrain = df.iloc[:646]\ntest = df.iloc[646:]\n\nmodel = GradientBoostingRegressor(n_estimators=200, max_depth=5, learning_rate=0.1, random_state=42)\nmodel.fit(train[features], train["sales"])\npred = model.predict(test[features])\n\ny_true = test["sales"].values\nmae = np.mean(np.abs(y_true - pred))\nrmse = np.sqrt(np.mean((y_true - pred) ** 2))\nmape = np.mean(np.abs((y_true - pred) / y_true)) * 100\n\nprint("Time Series Forecast:")\nprint(f"Тренировка: {len(train)} дней")\nprint(f"Тест: {len(test)} дней")\nprint(f"\\nGradientBoosting:")\nprint(f"  MAE: {mae:.2f}")\nprint(f"  RMSE: {rmse:.2f}")\nprint(f"  MAPE: {mape:.2f}%")',
      explanation: 'ML-подход к time series: создаём табличные признаки (lags, rolling stats, календарные) и используем GradientBoosting. Lag features дают модели информацию о прошлых значениях. Rolling statistics описывают локальный тренд. Этот подход часто побеждает ARIMA на Kaggle.'
    },
    {
      id: 6,
      title: 'Kaggle: Feature Engineering Challenge',
      type: 'practice',
      difficulty: 'hard',
      description: 'Улучшите baseline модель с помощью feature engineering.',
      requirements: [
        'Создайте датасет (1000 записей): 5 числовых + 2 категориальных признака, бинарный таргет',
        'Обучите baseline GradientBoosting и запомните AUC',
        'Создайте 15+ новых признаков: log, interactions, aggregations, target encoding (K-Fold)',
        'Отберите лучшие признаки через mutual_info_classif',
        'Покажите улучшение AUC после feature engineering'
      ],
      hint: 'Target encoding с K-Fold: для каждого fold кодируйте категории по среднему target в train fold. Interactions: feature1 * feature2. Aggregations: среднее feature по категории.',
      expectedOutput: 'Feature Engineering Challenge:\nBaseline (5 признаков): AUC=0.XX\nСоздано: XX новых признаков\nОтобрано: XX лучших\nС FE (XX признаков): AUC=0.XX\nУлучшение: +X.XX%',
      solution: 'import numpy as np\nimport pandas as pd\nfrom sklearn.ensemble import GradientBoostingClassifier\nfrom sklearn.model_selection import cross_val_score, KFold\nfrom sklearn.feature_selection import mutual_info_classif\nfrom itertools import combinations\n\nnp.random.seed(42)\nn = 1000\ndf = pd.DataFrame({\n    "f1": np.random.randn(n),\n    "f2": np.random.uniform(0, 100, n),\n    "f3": np.random.exponential(2, n),\n    "f4": np.random.randint(0, 50, n),\n    "f5": np.random.randn(n),\n    "cat1": np.random.choice(["A","B","C","D"], n),\n    "cat2": np.random.choice(["X","Y","Z"], n),\n})\ndf["target"] = ((df["f1"] * df["f2"] > 20) | (df["f3"] > 3)).astype(int)\n\nbase_features = ["f1", "f2", "f3", "f4", "f5"]\nmodel = GradientBoostingClassifier(n_estimators=100, random_state=42)\n\nfrom sklearn.preprocessing import LabelEncoder\ndf_base = df[base_features].copy()\nbaseline_auc = cross_val_score(model, df_base, df["target"], cv=5, scoring="roc_auc").mean()\n\n# Feature Engineering\nnew = {}\nfor f in ["f1","f2","f3","f4","f5"]:\n    new[f"{f}_log"] = np.log1p(np.abs(df[f]))\n    new[f"{f}_sq"] = df[f] ** 2\nfor f1, f2 in combinations(["f1","f2","f3","f4","f5"], 2):\n    new[f"{f1}_x_{f2}"] = df[f1] * df[f2]\n\nfor cat in ["cat1", "cat2"]:\n    kf = KFold(n_splits=5, shuffle=True, random_state=42)\n    te = np.zeros(n)\n    for tr_idx, val_idx in kf.split(df):\n        means = df.iloc[tr_idx].groupby(cat)["target"].mean()\n        te[val_idx] = df.iloc[val_idx][cat].map(means).fillna(df["target"].mean())\n    new[f"{cat}_te"] = te\n\nfor cat in ["cat1", "cat2"]:\n    for f in ["f1", "f2", "f3"]:\n        agg = df.groupby(cat)[f].transform("mean")\n        new[f"{f}_mean_by_{cat}"] = agg\n\nnew_df = pd.DataFrame(new)\nall_df = pd.concat([df_base, new_df], axis=1)\n\nmi = mutual_info_classif(all_df, df["target"], random_state=42)\nranking = sorted(zip(all_df.columns, mi), key=lambda x: -x[1])\ntop_names = [n for n, _ in ranking[:15]]\n\nfe_auc = cross_val_score(model, all_df[top_names], df["target"], cv=5, scoring="roc_auc").mean()\n\nprint("Feature Engineering Challenge:")\nprint(f"Baseline ({len(base_features)} признаков): AUC={baseline_auc:.4f}")\nprint(f"Создано: {new_df.shape[1]} новых признаков")\nprint(f"Отобрано: {len(top_names)} лучших")\nprint(f"С FE ({len(top_names)} признаков): AUC={fe_auc:.4f}")\nprint(f"Улучшение: +{(fe_auc - baseline_auc)*100:.2f}%")',
      explanation: 'Feature engineering — главный способ улучшить модель на Kaggle. Ключевые техники: (1) математические трансформации (log, square), (2) interactions между парами признаков, (3) target encoding категорий с K-Fold, (4) агрегации по группам, (5) отбор лучших через Mutual Information. Комбинация этих техник может дать +5-15% к AUC.'
    }
  ]
}
