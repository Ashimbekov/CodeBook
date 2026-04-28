export default {
  id: 8,
  title: 'Линейная регрессия',
  description: 'Линейная регрессия — фундаментальный алгоритм ML: теория, градиентный спуск, реализация с нуля и с sklearn.',
  lessons: [
    {
      id: 1,
      title: 'Теория линейной регрессии',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Модель линейной регрессии'
        },
        {
          type: 'text',
          value: 'Линейная регрессия — самый простой и фундаментальный алгоритм ML. Модель предполагает линейную зависимость между признаками X и целевой переменной y: y = w₁x₁ + w₂x₂ + ... + wₙxₙ + b, где w — веса (weights), b — смещение (bias). Цель — найти такие w и b, чтобы минимизировать ошибку предсказаний.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import numpy as np\nimport matplotlib.pyplot as plt\n\n# Простая линейная регрессия: y = wx + b\nnp.random.seed(42)\nX = np.random.rand(100) * 10  # площадь дома\ny = 3 * X + 7 + np.random.randn(100) * 2  # цена = 3*площадь + 7 + шум\n\n# Визуализация\nplt.scatter(X, y, alpha=0.6)\nplt.xlabel("Площадь")\nplt.ylabel("Цена")\nplt.title("Данные: площадь vs цена")\nplt.show()\n\n# Функция потерь: MSE (Mean Squared Error)\n# MSE = (1/n) * Σ(yᵢ - ŷᵢ)²\ndef mse(y_true, y_pred):\n    return np.mean((y_true - y_pred) ** 2)\n\n# Предсказание с произвольными весами\nw_guess, b_guess = 2.0, 5.0\ny_pred_guess = w_guess * X + b_guess\nprint(f"MSE (случайные веса): {mse(y, y_pred_guess):.4f}")\n\n# Аналитическое решение (метод наименьших квадратов)\n# w = Σ(xᵢ - x̄)(yᵢ - ȳ) / Σ(xᵢ - x̄)²\n# b = ȳ - w * x̄\nw_opt = np.sum((X - X.mean()) * (y - y.mean())) / np.sum((X - X.mean()) ** 2)\nb_opt = y.mean() - w_opt * X.mean()\ny_pred_opt = w_opt * X + b_opt\n\nprint(f"Оптимальные: w={w_opt:.4f}, b={b_opt:.4f}")\nprint(f"MSE (оптимальные): {mse(y, y_pred_opt):.4f}")'
        },
        {
          type: 'note',
          value: 'MSE (Mean Squared Error) — основная функция потерь для регрессии. Она штрафует большие ошибки сильнее, чем маленькие, благодаря квадрату. Альтернатива — MAE (Mean Absolute Error), более устойчивая к выбросам.'
        }
      ]
    },
    {
      id: 2,
      title: 'Градиентный спуск',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Gradient Descent — оптимизация весов'
        },
        {
          type: 'text',
          value: 'Градиентный спуск — итеративный метод оптимизации. Идея: двигаемся в направлении, противоположном градиенту функции потерь. Градиент показывает направление наибольшего роста, значит антиградиент — направление наибольшего убывания.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import numpy as np\n\nnp.random.seed(42)\nX = np.random.rand(100) * 10\ny = 3 * X + 7 + np.random.randn(100) * 2\n\n# Градиентный спуск с нуля\ndef gradient_descent(X, y, lr=0.01, epochs=1000):\n    w = 0.0  # начальный вес\n    b = 0.0  # начальное смещение\n    n = len(X)\n    history = []\n    \n    for epoch in range(epochs):\n        # Предсказание\n        y_pred = w * X + b\n        \n        # Ошибка (MSE)\n        loss = np.mean((y - y_pred) ** 2)\n        history.append(loss)\n        \n        # Градиенты\n        dw = (-2 / n) * np.sum(X * (y - y_pred))  # dMSE/dw\n        db = (-2 / n) * np.sum(y - y_pred)          # dMSE/db\n        \n        # Обновление весов\n        w -= lr * dw\n        b -= lr * db\n        \n        if epoch % 200 == 0:\n            print(f"Epoch {epoch}: loss={loss:.4f}, w={w:.4f}, b={b:.4f}")\n    \n    return w, b, history\n\nw, b, history = gradient_descent(X, y, lr=0.01, epochs=1000)\nprint(f"\\nИтог: w={w:.4f}, b={b:.4f}")\nprint(f"Ожидаемые: w~3.0, b~7.0")\n\n# Визуализация сходимости\nimport matplotlib.pyplot as plt\nplt.plot(history)\nplt.xlabel("Epoch")\nplt.ylabel("MSE Loss")\nplt.title("Сходимость градиентного спуска")\nplt.show()'
        },
        {
          type: 'list',
          value: [
            'Learning rate (lr) — скорость обучения: слишком большой — расходимость, слишком маленький — медленная сходимость',
            'Batch GD — все данные за раз (точно, но медленно)',
            'Stochastic GD (SGD) — одна точка за раз (шумно, но быстро)',
            'Mini-batch GD — батч из N точек (баланс скорости и стабильности)'
          ]
        }
      ]
    },
    {
      id: 3,
      title: 'Множественная линейная регрессия',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Несколько признаков'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import numpy as np\nfrom sklearn.linear_model import LinearRegression\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.metrics import mean_squared_error, r2_score\n\n# Генерация данных: цена дома зависит от площади, комнат, этажа\nnp.random.seed(42)\nn = 200\nploshchad = np.random.randint(30, 150, n)\nkomnaty = np.random.randint(1, 5, n)\netazh = np.random.randint(1, 20, n)\n\n# Реальная зависимость + шум\nprice = 50 * ploshchad + 200 * komnaty + 10 * etazh + 500 + np.random.randn(n) * 500\n\nX = np.column_stack([ploshchad, komnaty, etazh])\ny = price\n\n# Разделение данных\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\n\n# Обучение модели\nmodel = LinearRegression()\nmodel.fit(X_train, y_train)\n\nprint(f"Коэффициенты: {model.coef_.round(2)}")  # ~[50, 200, 10]\nprint(f"Свободный член: {model.intercept_:.2f}")  # ~500\n\n# Предсказание\ny_pred = model.predict(X_test)\n\n# Метрики\nmse = mean_squared_error(y_test, y_pred)\nrmse = np.sqrt(mse)\nr2 = r2_score(y_test, y_pred)\n\nprint(f"\\nMSE: {mse:.2f}")\nprint(f"RMSE: {rmse:.2f}")\nprint(f"R² score: {r2:.4f}")  # ~1.0 (отличная модель)\n\n# Предсказание для нового дома\nnew_house = np.array([[80, 3, 10]])  # 80м², 3 комнаты, 10 этаж\npredicted_price = model.predict(new_house)\nprint(f"\\nЦена дома (80м², 3 комн., 10 эт.): {predicted_price[0]:.0f}")'
        },
        {
          type: 'tip',
          value: 'R² (коэффициент детерминации) показывает, какую долю дисперсии y объясняет модель. R²=1 — идеально, R²=0 — модель не лучше простого среднего, R²<0 — модель хуже среднего.'
        }
      ]
    },
    {
      id: 4,
      title: 'Регуляризация: Ridge и Lasso',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Борьба с переобучением в регрессии'
        },
        {
          type: 'text',
          value: 'Регуляризация добавляет штраф за большие веса к функции потерь. Это предотвращает переобучение и делает модель устойчивее. Ridge (L2) — штраф за сумму квадратов весов. Lasso (L1) — штраф за сумму модулей весов (может обнулять веса → feature selection).'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import numpy as np\nfrom sklearn.linear_model import LinearRegression, Ridge, Lasso, ElasticNet\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.metrics import r2_score\nfrom sklearn.preprocessing import PolynomialFeatures\n\n# Данные с шумом\nnp.random.seed(42)\nX = np.random.rand(100, 1) * 10\ny = 3 * X.flatten() + np.random.randn(100) * 5\n\n# Добавляем полиномиальные признаки (создаём риск переобучения)\npoly = PolynomialFeatures(degree=15)\nX_poly = poly.fit_transform(X)\n\nX_train, X_test, y_train, y_test = train_test_split(X_poly, y, test_size=0.3, random_state=42)\n\n# Сравнение моделей\nmodels = {\n    "Linear": LinearRegression(),\n    "Ridge (L2)": Ridge(alpha=1.0),\n    "Lasso (L1)": Lasso(alpha=0.1),\n    "ElasticNet": ElasticNet(alpha=0.1, l1_ratio=0.5)\n}\n\nfor name, model in models.items():\n    model.fit(X_train, y_train)\n    train_r2 = r2_score(y_train, model.predict(X_train))\n    test_r2 = r2_score(y_test, model.predict(X_test))\n    n_nonzero = np.sum(np.abs(model.coef_) > 0.01)\n    print(f"{name:15s}: Train R²={train_r2:.4f}, Test R²={test_r2:.4f}, "\n          f"ненулевых весов: {n_nonzero}")\n\n# Alpha — сила регуляризации\nprint("\\nВлияние alpha на Ridge:")\nfor alpha in [0.01, 0.1, 1.0, 10.0, 100.0]:\n    ridge = Ridge(alpha=alpha)\n    ridge.fit(X_train, y_train)\n    test_r2 = r2_score(y_test, ridge.predict(X_test))\n    print(f"  alpha={alpha:6.2f}: Test R²={test_r2:.4f}, "\n          f"max|w|={np.max(np.abs(ridge.coef_)):.4f}")'
        },
        {
          type: 'list',
          value: [
            'Ridge (L2): уменьшает все веса, но не обнуляет. Хорош, когда все признаки важны',
            'Lasso (L1): может обнулять веса → автоматический feature selection. Хорош при многих нерелевантных признаках',
            'ElasticNet: комбинация L1 и L2. l1_ratio контролирует баланс',
            'alpha → 0: нет регуляризации (обычная регрессия). alpha → ∞: все веса → 0'
          ]
        }
      ]
    },
    {
      id: 5,
      title: 'Полиномиальная регрессия',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Нелинейные зависимости'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import numpy as np\nimport matplotlib.pyplot as plt\nfrom sklearn.linear_model import LinearRegression\nfrom sklearn.preprocessing import PolynomialFeatures\nfrom sklearn.pipeline import Pipeline\nfrom sklearn.metrics import mean_squared_error\n\n# Нелинейные данные: y = x² + шум\nnp.random.seed(42)\nX = np.sort(np.random.rand(80) * 10).reshape(-1, 1)\ny = 0.5 * X.flatten()**2 - 2 * X.flatten() + 3 + np.random.randn(80) * 3\n\n# Сравнение степеней полинома\nplt.figure(figsize=(15, 4))\nX_plot = np.linspace(0, 10, 100).reshape(-1, 1)\n\nfor i, degree in enumerate([1, 2, 10]):\n    plt.subplot(1, 3, i + 1)\n    \n    pipe = Pipeline([\n        ("poly", PolynomialFeatures(degree=degree)),\n        ("reg", LinearRegression())\n    ])\n    pipe.fit(X, y)\n    y_pred = pipe.predict(X_plot)\n    \n    mse_train = mean_squared_error(y, pipe.predict(X))\n    \n    plt.scatter(X, y, alpha=0.5, s=20)\n    plt.plot(X_plot, y_pred, "r-", linewidth=2)\n    plt.title(f"Степень {degree}\\nMSE={mse_train:.2f}")\n    plt.xlabel("X")\n    plt.ylabel("y")\n\nplt.tight_layout()\nplt.show()\n\n# Degree=1: underfitting (не улавливает кривизну)\n# Degree=2: правильная модель\n# Degree=10: overfitting (подстроилась под шум)\n\nprint("Степень 1: Underfitting — слишком простая модель")\nprint("Степень 2: Оптимальная модель")\nprint("Степень 10: Overfitting — слишком сложная модель")'
        },
        {
          type: 'warning',
          value: 'Увеличение степени полинома повышает риск переобучения! Всегда проверяйте модель на тестовых данных и используйте регуляризацию для высоких степеней.'
        }
      ]
    },
    {
      id: 6,
      title: 'Практика: Предсказание цен на жильё',
      type: 'practice',
      difficulty: 'medium',
      description: 'Постройте модель линейной регрессии для предсказания цен на жильё. Сравните обычную регрессию с Ridge и Lasso.',
      requirements: [
        'Сгенерируйте данные: 300 домов с признаками площадь (30-200), комнаты (1-5), расстояние_до_центра (1-30 км)',
        'Целевая переменная: цена = 50*площадь + 300*комнаты - 100*расстояние + 1000 + шум',
        'Разделите данные 80/20, обучите LinearRegression, Ridge(alpha=1), Lasso(alpha=1)',
        'Сравните R² и RMSE на тестовой выборке',
        'Выведите коэффициенты каждой модели'
      ],
      hint: 'Используйте StandardScaler перед регуляризованными моделями. R² ближе к 1 — лучше. Сравните, насколько коэффициенты моделей близки к истинным (50, 300, -100, 1000).',
      expectedOutput: 'Linear: R²=0.99, RMSE=~XX\nRidge:  R²=0.99, RMSE=~XX\nLasso:  R²=0.99, RMSE=~XX\nКоэффициенты близки к [50, 300, -100]',
      solution: 'import numpy as np\nfrom sklearn.linear_model import LinearRegression, Ridge, Lasso\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.metrics import r2_score, mean_squared_error\n\nnp.random.seed(42)\nn = 300\nploshchad = np.random.randint(30, 200, n)\nkomnaty = np.random.randint(1, 6, n)\nrasst = np.random.uniform(1, 30, n)\n\nprice = 50 * ploshchad + 300 * komnaty - 100 * rasst + 1000 + np.random.randn(n) * 500\n\nX = np.column_stack([ploshchad, komnaty, rasst])\ny = price\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\n\nscaler = StandardScaler()\nX_train_sc = scaler.fit_transform(X_train)\nX_test_sc = scaler.transform(X_test)\n\nmodels = {\n    "Linear": LinearRegression(),\n    "Ridge":  Ridge(alpha=1.0),\n    "Lasso":  Lasso(alpha=1.0)\n}\n\nfor name, model in models.items():\n    model.fit(X_train_sc, y_train)\n    y_pred = model.predict(X_test_sc)\n    r2 = r2_score(y_test, y_pred)\n    rmse = np.sqrt(mean_squared_error(y_test, y_pred))\n    print(f"{name:8s}: R²={r2:.4f}, RMSE={rmse:.2f}")\n    print(f"          Коэффициенты: {model.coef_.round(2)}, intercept={model.intercept_:.2f}")',
      explanation: 'На чистых линейных данных все три модели показывают схожие результаты, так как истинная зависимость линейна. Коэффициенты после StandardScaler показывают относительную важность признаков (не прямые значения 50, 300, -100, так как данные нормализованы). Ridge и Lasso полезнее при наличии мультиколлинеарности или лишних признаков.'
    }
  ]
}
