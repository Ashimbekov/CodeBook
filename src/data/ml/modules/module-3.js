export default {
  id: 3,
  title: 'Математика для ML: Статистика и вероятность',
  description: 'Основы статистики и теории вероятностей для ML: распределения, описательная статистика, корреляция, теорема Байеса.',
  lessons: [
    {
      id: 1,
      title: 'Описательная статистика',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Меры центральной тенденции и разброса'
        },
        {
          type: 'text',
          value: 'Описательная статистика позволяет понять основные характеристики данных: центр распределения, разброс, форму. Это первый шаг в любом ML-проекте — EDA (Exploratory Data Analysis).'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import numpy as np\n\ndata = np.array([23, 25, 27, 28, 30, 30, 31, 33, 35, 45])\n\n# Меры центральной тенденции\nprint(f"Среднее (mean): {np.mean(data):.2f}")     # 30.70\nprint(f"Медиана (median): {np.median(data):.2f}") # 30.00\n\n# Мода — самое частое значение\nfrom scipy import stats\nmode_result = stats.mode(data, keepdims=True)\nprint(f"Мода: {mode_result.mode[0]}")  # 30\n\n# Меры разброса\nprint(f"Дисперсия (variance): {np.var(data):.2f}")      # популяционная\nprint(f"Дисперсия (выборочная): {np.var(data, ddof=1):.2f}")\nprint(f"Стд. отклонение (std): {np.std(data, ddof=1):.2f}")\nprint(f"Размах (range): {np.ptp(data)}")  # max - min = 22\n\n# Квартили и межквартильный размах (IQR)\nQ1 = np.percentile(data, 25)\nQ3 = np.percentile(data, 75)\nIQR = Q3 - Q1\nprint(f"Q1={Q1}, Q3={Q3}, IQR={IQR}")\n\n# Выбросы по правилу 1.5*IQR\nlower_bound = Q1 - 1.5 * IQR\nupper_bound = Q3 + 1.5 * IQR\noutliers = data[(data < lower_bound) | (data > upper_bound)]\nprint(f"Выбросы: {outliers}")  # [45]'
        },
        {
          type: 'tip',
          value: 'Медиана устойчива к выбросам, а среднее — нет. Если в данных есть выбросы (зарплаты, цены домов), медиана лучше описывает "типичное" значение.'
        }
      ]
    },
    {
      id: 2,
      title: 'Распределения вероятностей',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Основные распределения в ML'
        },
        {
          type: 'text',
          value: 'Распределение вероятностей описывает, как вероятность распределена между возможными значениями случайной величины. Знание распределений критически важно для выбора моделей и интерпретации результатов.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import numpy as np\nfrom scipy import stats\n\n# 1. Нормальное распределение (Гауссово)\n# Самое важное распределение в ML!\nnormal_data = np.random.normal(loc=0, scale=1, size=10000)\nprint(f"Нормальное: mean={np.mean(normal_data):.3f}, std={np.std(normal_data):.3f}")\n\n# Правило 68-95-99.7:\nwithin_1std = np.sum(np.abs(normal_data) < 1) / len(normal_data) * 100\nwithin_2std = np.sum(np.abs(normal_data) < 2) / len(normal_data) * 100\nprint(f"В пределах 1σ: {within_1std:.1f}%")  # ~68%\nprint(f"В пределах 2σ: {within_2std:.1f}%")  # ~95%\n\n# 2. Равномерное распределение\nuniform_data = np.random.uniform(low=0, high=10, size=10000)\nprint(f"\\nРавномерное: mean={np.mean(uniform_data):.3f}")\n\n# 3. Биномиальное распределение\n# Количество успехов в n независимых испытаниях\nbinom_data = np.random.binomial(n=10, p=0.3, size=10000)\nprint(f"\\nБиномиальное (n=10, p=0.3): mean={np.mean(binom_data):.3f}")\n\n# 4. Распределение Пуассона\n# Количество событий за фиксированный период\npoisson_data = np.random.poisson(lam=5, size=10000)\nprint(f"Пуассон (λ=5): mean={np.mean(poisson_data):.3f}")\n\n# Z-score: сколько стд. отклонений от среднего\nvalue = 75\nmean, std = 70, 5\nz_score = (value - mean) / std\nprint(f"\\nZ-score для {value} (μ={mean}, σ={std}): {z_score}")\nprint(f"P(X < {value}): {stats.norm.cdf(z_score):.4f}")'
        },
        {
          type: 'note',
          value: 'Центральная предельная теорема: среднее любой выборки стремится к нормальному распределению при увеличении размера выборки. Это объясняет, почему нормальное распределение так важно в ML.'
        }
      ]
    },
    {
      id: 3,
      title: 'Корреляция и ковариация',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Связь между переменными'
        },
        {
          type: 'text',
          value: 'Корреляция показывает силу и направление линейной связи между двумя переменными. Ковариация — ненормированная мера совместной изменчивости. Понимание корреляций критически важно для feature selection и построения моделей.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import numpy as np\n\nnp.random.seed(42)\n\n# Генерация коррелированных данных\nn = 100\nx = np.random.randn(n)\ny_positive = 2 * x + np.random.randn(n) * 0.5  # положительная корреляция\ny_negative = -1.5 * x + np.random.randn(n) * 0.5  # отрицательная\ny_none = np.random.randn(n)  # нет корреляции\n\n# Ковариация\nprint("Ковариационная матрица (x, y_pos):")\nprint(np.cov(x, y_positive))\n\n# Корреляция Пирсона (-1 до 1)\ncorr_pos = np.corrcoef(x, y_positive)[0, 1]\ncorr_neg = np.corrcoef(x, y_negative)[0, 1]\ncorr_none = np.corrcoef(x, y_none)[0, 1]\n\nprint(f"\\nКорреляция (положительная): {corr_pos:.4f}")  # ~0.97\nprint(f"Корреляция (отрицательная): {corr_neg:.4f}")    # ~-0.95\nprint(f"Корреляция (отсутствует): {corr_none:.4f}")     # ~0.0\n\n# Корреляционная матрица для нескольких признаков\nfeatures = np.column_stack([x, y_positive, y_negative, y_none])\ncorr_matrix = np.corrcoef(features, rowvar=False)\nprint(f"\\nКорреляционная матрица:\\n{np.round(corr_matrix, 2)}")\n\n# Ранговая корреляция Спирмена (для нелинейных связей)\nfrom scipy.stats import spearmanr\nrho, p_value = spearmanr(x, y_positive)\nprint(f"\\nСпирмен: rho={rho:.4f}, p-value={p_value:.6f}")'
        },
        {
          type: 'warning',
          value: 'Корреляция не означает причинно-следственную связь! Высокая корреляция между продажами мороженого и утоплениями не значит, что мороженое вызывает утопления — обе переменные зависят от жаркой погоды.'
        }
      ]
    },
    {
      id: 4,
      title: 'Теорема Байеса',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Байесовский подход в ML'
        },
        {
          type: 'text',
          value: 'Теорема Байеса позволяет обновлять вероятности гипотез при получении новых данных. Формула: P(A|B) = P(B|A) * P(A) / P(B). Это основа Naive Bayes классификатора и всего байесовского ML.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Теорема Байеса: P(A|B) = P(B|A) * P(A) / P(B)\n\n# Пример: Медицинский тест\n# P(болезнь) = 0.01 (1% населения болеют)\n# P(тест+|болезнь) = 0.99 (чувствительность)\n# P(тест+|здоров) = 0.05 (ложноположительный)\n\nP_disease = 0.01\nP_healthy = 1 - P_disease\nP_positive_given_disease = 0.99  # sensitivity\nP_positive_given_healthy = 0.05  # false positive rate\n\n# P(тест+) = P(тест+|болен)*P(болен) + P(тест+|здоров)*P(здоров)\nP_positive = (P_positive_given_disease * P_disease + \n              P_positive_given_healthy * P_healthy)\n\n# P(болен|тест+) — что нас интересует\nP_disease_given_positive = (P_positive_given_disease * P_disease) / P_positive\n\nprint(f"P(болен|тест+) = {P_disease_given_positive:.4f}")  # ~0.1667\nprint(f"Только {P_disease_given_positive*100:.1f}% с положительным тестом реально больны!")\n\n# Naive Bayes классификатор\nfrom sklearn.naive_bayes import GaussianNB\nfrom sklearn.datasets import load_iris\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.metrics import accuracy_score\n\niris = load_iris()\nX_train, X_test, y_train, y_test = train_test_split(\n    iris.data, iris.target, test_size=0.3, random_state=42\n)\n\nnb = GaussianNB()\nnb.fit(X_train, y_train)\ny_pred = nb.predict(X_test)\nprint(f"\\nNaive Bayes accuracy: {accuracy_score(y_test, y_pred):.4f}")'
        },
        {
          type: 'tip',
          value: 'Naive Bayes называется "наивным", потому что предполагает независимость признаков. Несмотря на это упрощение, он часто работает отлично, особенно для текстовой классификации (спам-фильтры).'
        }
      ]
    },
    {
      id: 5,
      title: 'Статистические тесты',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Проверка гипотез в ML'
        },
        {
          type: 'text',
          value: 'Статистические тесты помогают определить, являются ли различия между группами значимыми или случайными. В ML это важно для A/B тестирования, сравнения моделей и проверки качества признаков.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import numpy as np\nfrom scipy import stats\n\nnp.random.seed(42)\n\n# t-тест: сравнение двух групп\n# Группа A: CTR после старого дизайна\n# Группа B: CTR после нового дизайна\ngroup_a = np.random.normal(loc=2.5, scale=0.5, size=100)  # старый дизайн\ngroup_b = np.random.normal(loc=2.7, scale=0.5, size=100)  # новый дизайн\n\nt_stat, p_value = stats.ttest_ind(group_a, group_b)\nprint(f"t-статистика: {t_stat:.4f}")\nprint(f"p-value: {p_value:.4f}")\nprint(f"Различие значимо (α=0.05): {p_value < 0.05}")\n\n# Тест Шапиро-Уилка: проверка нормальности\nstat, p = stats.shapiro(group_a)\nprint(f"\\nТест нормальности (Шапиро): p={p:.4f}")\nprint(f"Нормальное распределение: {p > 0.05}")\n\n# Хи-квадрат тест: связь между категориальными переменными\n# Связана ли покупка с полом?\nobserved = np.array([[120, 80],   # мужчины: [купили, не купили]\n                     [150, 50]])  # женщины: [купили, не купили]\n\nchi2, p_value, dof, expected = stats.chi2_contingency(observed)\nprint(f"\\nХи-квадрат: {chi2:.4f}, p-value: {p_value:.4f}")\nprint(f"Связь значима: {p_value < 0.05}")\n\n# Корреляционный тест\nx = np.random.randn(50)\ny = 2 * x + np.random.randn(50)\nr, p = stats.pearsonr(x, y)\nprint(f"\\nКорреляция Пирсона: r={r:.4f}, p={p:.6f}")'
        },
        {
          type: 'warning',
          value: 'p-value < 0.05 не означает, что эффект большой! Это означает лишь, что результат статистически значим. Всегда смотрите на размер эффекта (effect size) вместе с p-value.'
        }
      ]
    },
    {
      id: 6,
      title: 'Практика: Статистический анализ данных',
      type: 'practice',
      difficulty: 'medium',
      description: 'Проведите полный статистический анализ набора данных: описательная статистика, проверка нормальности, обнаружение выбросов и тест на корреляцию.',
      requirements: [
        'Создайте массив данных: зарплаты = [45000, 50000, 55000, 52000, 48000, 60000, 150000, 47000, 53000, 49000]',
        'Вычислите среднее, медиану, стандартное отклонение',
        'Определите выбросы методом IQR',
        'Создайте массив experience = [2, 3, 5, 4, 3, 6, 20, 2, 4, 3] и вычислите корреляцию с зарплатой',
        'Выведите полный отчёт анализа'
      ],
      hint: 'Для IQR: Q1 = np.percentile(data, 25), Q3 = np.percentile(data, 75), IQR = Q3 - Q1. Выбросы: значения за пределами [Q1 - 1.5*IQR, Q3 + 1.5*IQR].',
      expectedOutput: 'Среднее: 60900.00\nМедиана: 51000.00\nСтд. отклонение: 30286.40\nВыбросы по IQR: [150000]\nКорреляция зарплата-опыт: 0.9985',
      solution: 'import numpy as np\n\nsalaries = np.array([45000, 50000, 55000, 52000, 48000, 60000, 150000, 47000, 53000, 49000])\nexperience = np.array([2, 3, 5, 4, 3, 6, 20, 2, 4, 3])\n\n# Описательная статистика\nmean_sal = np.mean(salaries)\nmedian_sal = np.median(salaries)\nstd_sal = np.std(salaries, ddof=1)\n\nprint(f"Среднее: {mean_sal:.2f}")\nprint(f"Медиана: {median_sal:.2f}")\nprint(f"Стд. отклонение: {std_sal:.2f}")\n\n# Обнаружение выбросов (IQR)\nQ1 = np.percentile(salaries, 25)\nQ3 = np.percentile(salaries, 75)\nIQR = Q3 - Q1\nlower = Q1 - 1.5 * IQR\nupper = Q3 + 1.5 * IQR\noutliers = salaries[(salaries < lower) | (salaries > upper)]\nprint(f"Выбросы по IQR: {outliers}")\n\n# Корреляция\ncorr = np.corrcoef(salaries, experience)[0, 1]\nprint(f"Корреляция зарплата-опыт: {corr:.4f}")',
      explanation: 'Среднее значительно выше медианы (60900 vs 51000), что указывает на правое скошенное распределение, вызванное выбросом 150000. Метод IQR успешно обнаружил это значение как выброс. Высокая корреляция (~0.99) между зарплатой и опытом логична — выбросы в обеих переменных (150000 и 20 лет) также коррелируют.'
    }
  ]
}
