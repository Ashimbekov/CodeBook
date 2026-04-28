export default {
  id: 27,
  title: 'Байесовские методы',
  description: 'Теорема Байеса, Naive Bayes, байесовская оптимизация, вероятностное программирование и гауссовские процессы.',
  lessons: [
    {
      id: 1,
      title: 'Теорема Байеса',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Основы байесовского подхода' },
        { type: 'text', value: 'Теорема Байеса — фундамент вероятностного мышления в ML. Она описывает, как обновлять наши убеждения (prior) при получении новых данных (likelihood), получая обновлённую вероятность (posterior): P(H|D) = P(D|H) * P(H) / P(D).' },
        { type: 'code', language: 'python', value: 'import numpy as np\n\n# Пример: медицинский тест\n# Болезнь встречается у 1% населения\n# Тест: чувствительность 95%, специфичность 90%\n\nprior_disease = 0.01          # P(болезнь)\nsensitivity = 0.95            # P(положительный тест | болезнь)\nspecificity = 0.90            # P(отрицательный тест | здоров)\n\n# P(положительный тест)\np_positive = sensitivity * prior_disease + (1 - specificity) * (1 - prior_disease)\n\n# P(болезнь | положительный тест) — теорема Байеса\nposterior = (sensitivity * prior_disease) / p_positive\n\nprint(f"P(болезнь) = {prior_disease:.2%}")\nprint(f"P(положительный тест) = {p_positive:.4f}")\nprint(f"P(болезнь | положительный тест) = {posterior:.2%}")\nprint(f"\\nДаже с хорошим тестом, вероятность болезни только {posterior:.1%}!")\n\n# Последовательное обновление Байеса\nprint("\\n--- Последовательное обновление ---")\nprior = 0.01\nfor i in range(3):\n    posterior = (sensitivity * prior) / (sensitivity * prior + (1-specificity)*(1-prior))\n    print(f"Тест {i+1}: prior={prior:.4f} -> posterior={posterior:.4f}")\n    prior = posterior\n\nprint(f"\\nПосле 3 положительных тестов: P(болезнь) = {posterior:.2%}")' },
        { type: 'note', value: 'Байесовский подход позволяет корректно обновлять вероятности при получении новых данных. Это основа для многих ML-алгоритмов: от Naive Bayes до байесовских нейронных сетей.' }
      ]
    },
    {
      id: 2,
      title: 'Naive Bayes классификатор',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Naive Bayes для классификации' },
        { type: 'text', value: 'Naive Bayes — простой, но эффективный классификатор, основанный на теореме Байеса с допущением о независимости признаков (naive assumption). Несмотря на это упрощение, он отлично работает для текстовой классификации, спам-фильтрации и других задач.' },
        { type: 'code', language: 'python', value: 'from sklearn.naive_bayes import GaussianNB, MultinomialNB, BernoulliNB\nfrom sklearn.datasets import make_classification, fetch_20newsgroups\nfrom sklearn.feature_extraction.text import TfidfVectorizer\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.metrics import accuracy_score, classification_report\nimport numpy as np\n\n# 1. GaussianNB — для числовых данных\nprint("=== GaussianNB ===\")\nX, y = make_classification(n_samples=1000, n_features=10, random_state=42)\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\n\ngnb = GaussianNB()\ngnb.fit(X_train, y_train)\nprint(f"Accuracy: {gnb.score(X_test, y_test):.4f}")\n\n# 2. MultinomialNB — для текстов (TF-IDF / Bag of Words)\nprint("\\n=== MultinomialNB для текстов ===\")\n\ntexts = [\n    "машинное обучение нейронные сети",\n    "deep learning tensorflow keras",\n    "футбол чемпионат мира гол",\n    "матч команда победа стадион",\n    "python обучение модель данные",\n    "баскетбол очки игрок корзина"\n]\nlabels = [0, 0, 1, 1, 0, 1]  # 0=ML, 1=Спорт\n\nvectorizer = TfidfVectorizer()\nX_text = vectorizer.fit_transform(texts)\n\nmnb = MultinomialNB(alpha=1.0)  # alpha — сглаживание Лапласа\nmnb.fit(X_text, labels)\n\nnew_texts = ["нейронные сети данные", "футбол матч гол"]\nX_new = vectorizer.transform(new_texts)\npredictions = mnb.predict(X_new)\nfor text, pred in zip(new_texts, predictions):\n    category = "ML" if pred == 0 else "Спорт"\n    print(f"  \"{text}\" -> {category}")\n\n# 3. BernoulliNB — для бинарных признаков\nprint("\\n=== BernoulliNB ===\")\nbnb = BernoulliNB()\nX_binary = (X > 0).astype(int)\nX_tr, X_te, y_tr, y_te = train_test_split(X_binary, y, test_size=0.2, random_state=42)\nbnb.fit(X_tr, y_tr)\nprint(f"Accuracy: {bnb.score(X_te, y_te):.4f}")' },
        { type: 'list', items: [
          'GaussianNB — признаки имеют нормальное распределение',
          'MultinomialNB — для счётчиков (TF-IDF, Bag of Words)',
          'BernoulliNB — для бинарных признаков (0/1)',
          'ComplementNB — улучшенный Multinomial для несбалансированных данных'
        ] }
      ]
    },
    {
      id: 3,
      title: 'Байесовская оптимизация',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Оптимизация гиперпараметров байесовским методом' },
        { type: 'text', value: 'Байесовская оптимизация — умный способ поиска гиперпараметров. Вместо перебора всех комбинаций (Grid Search) или случайного поиска (Random Search), она строит вероятностную модель (surrogate) целевой функции и выбирает следующую точку для проверки на основе acquisition function.' },
        { type: 'code', language: 'python', value: 'import optuna\nimport numpy as np\nfrom sklearn.datasets import make_classification\nfrom sklearn.model_selection import cross_val_score\nfrom sklearn.ensemble import RandomForestClassifier\n\nX, y = make_classification(n_samples=1000, n_features=20, random_state=42)\n\n# Optuna — популярная библиотека для байесовской оптимизации\ndef objective(trial):\n    # Определяем пространство гиперпараметров\n    n_estimators = trial.suggest_int("n_estimators", 50, 300)\n    max_depth = trial.suggest_int("max_depth", 3, 15)\n    min_samples_split = trial.suggest_int("min_samples_split", 2, 20)\n    min_samples_leaf = trial.suggest_int("min_samples_leaf", 1, 10)\n    max_features = trial.suggest_categorical("max_features", ["sqrt", "log2", None])\n    \n    model = RandomForestClassifier(\n        n_estimators=n_estimators,\n        max_depth=max_depth,\n        min_samples_split=min_samples_split,\n        min_samples_leaf=min_samples_leaf,\n        max_features=max_features,\n        random_state=42\n    )\n    \n    scores = cross_val_score(model, X, y, cv=5, scoring="roc_auc")\n    return scores.mean()\n\n# Запуск оптимизации\nstudy = optuna.create_study(direction="maximize")\nstudy.optimize(objective, n_trials=50, show_progress_bar=False)\n\nprint(f"Лучший ROC-AUC: {study.best_value:.4f}")\nprint(f"\\nЛучшие параметры:")\nfor key, value in study.best_params.items():\n    print(f"  {key}: {value}")\n\nprint(f"\\nВсего проведено {len(study.trials)} экспериментов")\nprint(f"Лучший trial: #{study.best_trial.number}")' },
        { type: 'tip', value: 'Optuna использует TPE (Tree-structured Parzen Estimator) по умолчанию — это эффективнее обычного Grid/Random Search в 2-10 раз по количеству необходимых экспериментов.' }
      ]
    },
    {
      id: 4,
      title: 'Вероятностное программирование (PyMC)',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Байесовские модели с PyMC' },
        { type: 'text', value: 'Вероятностное программирование позволяет задавать модели в виде вероятностных графов и выполнять байесовский вывод. PyMC — ведущая библиотека для этого в Python. Вы описываете prior-распределения параметров, likelihood данных, а PyMC автоматически вычисляет posterior.' },
        { type: 'code', language: 'python', value: 'import pymc as pm\nimport numpy as np\nimport arviz as az\n\n# Генерация данных: линейная зависимость с шумом\nnp.random.seed(42)\nn = 100\ntrue_slope = 2.5\ntrue_intercept = 1.0\ntrue_sigma = 0.5\n\nX = np.random.uniform(0, 5, n)\ny = true_intercept + true_slope * X + np.random.normal(0, true_sigma, n)\n\n# Байесовская линейная регрессия\nwith pm.Model() as linear_model:\n    # Prior-распределения параметров\n    intercept = pm.Normal("intercept", mu=0, sigma=10)\n    slope = pm.Normal("slope", mu=0, sigma=10)\n    sigma = pm.HalfNormal("sigma", sigma=5)\n    \n    # Линейная модель\n    mu = intercept + slope * X\n    \n    # Likelihood\n    likelihood = pm.Normal("y", mu=mu, sigma=sigma, observed=y)\n    \n    # MCMC sampling (Марковские цепи Монте-Карло)\n    trace = pm.sample(2000, tune=1000, cores=1, random_seed=42)\n\n# Анализ результатов\nsummary = az.summary(trace, var_names=["intercept", "slope", "sigma"])\nprint("Posterior summary:")\nprint(summary)\n\nprint(f"\\nИстинные значения: intercept={true_intercept}, slope={true_slope}, sigma={true_sigma}")\nprint(f"Bayesian оценки:  intercept={summary.loc[\'intercept\', \'mean\']:.3f}, "\n      f"slope={summary.loc[\'slope\', \'mean\']:.3f}, "\n      f"sigma={summary.loc[\'sigma\', \'mean\']:.3f}")' },
        { type: 'note', value: 'Байесовский подход даёт не точечные оценки, а полные распределения параметров. Это позволяет оценить неопределённость предсказаний — критично для медицины, финансов и других ответственных областей.' }
      ]
    },
    {
      id: 5,
      title: 'Гауссовские процессы',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Gaussian Processes для регрессии и классификации' },
        { type: 'text', value: 'Гауссовский процесс (GP) — непараметрическая байесовская модель, которая определяет распределение над функциями. Вместо фиксированного набора параметров, GP моделирует бесконечномерное гауссовское распределение, задаваемое функцией ядра (kernel). GP даёт не только предсказание, но и неопределённость этого предсказания.' },
        { type: 'code', language: 'python', value: 'from sklearn.gaussian_process import GaussianProcessRegressor, GaussianProcessClassifier\nfrom sklearn.gaussian_process.kernels import RBF, Matern, WhiteKernel, ConstantKernel\nimport numpy as np\n\n# 1. Gaussian Process Regression\nnp.random.seed(42)\nX_train = np.sort(np.random.uniform(0, 10, 20)).reshape(-1, 1)\ny_train = np.sin(X_train).ravel() + np.random.normal(0, 0.1, 20)\n\n# Определяем ядро\nkernel = ConstantKernel(1.0) * RBF(length_scale=1.0) + WhiteKernel(noise_level=0.1)\n\ngpr = GaussianProcessRegressor(kernel=kernel, n_restarts_optimizer=10, random_state=42)\ngpr.fit(X_train, y_train)\n\n# Предсказание с неопределённостью\nX_test = np.linspace(0, 10, 100).reshape(-1, 1)\ny_pred, y_std = gpr.predict(X_test, return_std=True)\n\nprint("Gaussian Process Regression:")\nprint(f"  Обученное ядро: {gpr.kernel_}")\nprint(f"  Log-marginal-likelihood: {gpr.log_marginal_likelihood_value_:.3f}")\nprint(f"  Средняя неопределённость: {y_std.mean():.4f}")\nprint(f"  Макс неопределённость: {y_std.max():.4f}")\n\n# 2. Разные ядра\nkernels = {\n    "RBF": RBF(length_scale=1.0),\n    "Matern(nu=1.5)": Matern(length_scale=1.0, nu=1.5),\n    "Matern(nu=2.5)": Matern(length_scale=1.0, nu=2.5)\n}\n\nprint("\\nСравнение ядер:")\nfor name, kernel in kernels.items():\n    gpr = GaussianProcessRegressor(kernel=kernel, random_state=42)\n    gpr.fit(X_train, y_train)\n    y_pred = gpr.predict(X_test)\n    mse = np.mean((np.sin(X_test).ravel() - y_pred) ** 2)\n    print(f"  {name}: MSE={mse:.6f}")\n\n# 3. GP Classification\nfrom sklearn.datasets import make_moons\nX_cls, y_cls = make_moons(n_samples=100, noise=0.3, random_state=42)\n\ngpc = GaussianProcessClassifier(kernel=RBF(1.0), random_state=42)\ngpc.fit(X_cls, y_cls)\n\nprint(f"\\nGP Classification Accuracy: {gpc.score(X_cls, y_cls):.4f}")\nprob = gpc.predict_proba(X_cls[:5])\nprint(f"Вероятности (первые 5): {prob[:, 1].round(3)}")' },
        { type: 'warning', value: 'GP имеет вычислительную сложность O(n^3) по памяти и времени, поэтому не подходит для больших датасетов (>10000 точек). Для больших данных используйте приближённые методы (Sparse GP) или индуцирующие точки.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Naive Bayes для текстов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте классификатор текстов на основе Naive Bayes с использованием TF-IDF.',
      requirements: [
        'Создайте датасет из 20+ текстов на 3 категории (технологии, спорт, наука)',
        'Примените TfidfVectorizer для преобразования текстов',
        'Обучите MultinomialNB классификатор',
        'Протестируйте на 3 новых текстах и выведите предсказания с вероятностями',
        'Выведите accuracy на обучающей выборке'
      ],
      hint: 'MultinomialNB работает с неотрицательными значениями (TF-IDF даёт неотрицательные). Используйте predict_proba для получения вероятностей классов.',
      expectedOutput: 'Naive Bayes Text Classifier\nAccuracy: X.XX\n\nПредсказания:\n"..." -> категория (prob: X.XX)\n"..." -> категория (prob: X.XX)\n"..." -> категория (prob: X.XX)',
      solution: 'from sklearn.naive_bayes import MultinomialNB\nfrom sklearn.feature_extraction.text import TfidfVectorizer\nimport numpy as np\n\n# Датасет: 3 категории\ntexts = [\n    "python программирование machine learning", "нейронные сети deep learning tensorflow",\n    "react javascript frontend разработка", "api backend сервер database",\n    "kubernetes docker контейнеры devops", "алгоритм данные обучение модель",\n    "облачные сервисы aws cloud", "футбол чемпионат гол стадион",\n    "баскетбол матч команда победа", "теннис турнир ракетка сет",\n    "олимпиада спортсмен медаль рекорд", "бег марафон тренировка финиш",\n    "хоккей шайба лёд вратарь", "плавание бассейн дорожка заплыв",\n    "физика квантовая механика частицы", "химия молекулы реакция элементы",\n    "биология клетка ДНК генетика", "астрономия звёзды планеты космос",\n    "математика теорема доказательство формула", "экология природа климат исследование",\n    "нейробиология мозг нейроны синапсы"\n]\nlabels = [0,0,0,0,0,0,0, 1,1,1,1,1,1,1, 2,2,2,2,2,2,2]\ncategory_names = ["Технологии", "Спорт", "Наука"]\n\nvectorizer = TfidfVectorizer()\nX = vectorizer.fit_transform(texts)\n\nmodel = MultinomialNB(alpha=1.0)\nmodel.fit(X, labels)\n\nprint("Naive Bayes Text Classifier")\nprint(f"Accuracy: {model.score(X, labels):.2f}")\n\nnew_texts = [\n    "python tensorflow модель обучение",\n    "футбол команда чемпион стадион",\n    "квантовая физика частицы эксперимент"\n]\nX_new = vectorizer.transform(new_texts)\npredictions = model.predict(X_new)\nprobabilities = model.predict_proba(X_new)\n\nprint("\\nПредсказания:")\nfor text, pred, prob in zip(new_texts, predictions, probabilities):\n    print(f"  \"{text}\" -> {category_names[pred]} (prob: {prob[pred]:.2f})")',
      explanation: 'MultinomialNB отлично работает для текстовой классификации благодаря модели Bag of Words. TF-IDF нормализует частоты слов, а сглаживание Лапласа (alpha=1.0) предотвращает нулевые вероятности для невиданных слов. Несмотря на предположение о независимости признаков, Naive Bayes часто конкурирует с более сложными моделями на текстовых данных.'
    }
  ]
}
