export default {
  id: 28,
  title: 'Прогнозирование временных рядов',
  description: 'Основы временных рядов, ARIMA/SARIMA, Prophet, LSTM для прогнозирования и метрики оценки.',
  lessons: [
    {
      id: 1,
      title: 'Основы временных рядов',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Что такое временной ряд' },
        { type: 'text', value: 'Временной ряд — это последовательность наблюдений, упорядоченных во времени. Прогнозирование временных рядов (time series forecasting) используется для предсказания будущих значений: продажи, температура, цены акций, трафик на сайте. Ключевые компоненты: тренд, сезонность, циклы и шум.' },
        { type: 'code', language: 'python', value: 'import numpy as np\nimport pandas as pd\n\n# Генерация временного ряда с компонентами\nnp.random.seed(42)\ndays = 365 * 2  # 2 года\ndates = pd.date_range("2022-01-01", periods=days, freq="D")\n\n# Компоненты\ntrend = np.linspace(100, 200, days)                          # линейный тренд\nseasonality = 30 * np.sin(2 * np.pi * np.arange(days) / 365) # годовая сезонность\nweekly = 10 * np.sin(2 * np.pi * np.arange(days) / 7)        # недельная сезонность\nnoise = np.random.normal(0, 5, days)                          # шум\n\nvalues = trend + seasonality + weekly + noise\nts = pd.Series(values, index=dates, name="sales")\n\nprint("Временной ряд продаж:")\nprint(f"  Период: {ts.index[0].date()} — {ts.index[-1].date()}")\nprint(f"  Среднее: {ts.mean():.1f}")\nprint(f"  Std: {ts.std():.1f}")\nprint(f"  Min: {ts.min():.1f}, Max: {ts.max():.1f}")\n\n# Декомпозиция\nfrom statsmodels.tsa.seasonal import seasonal_decompose\n\nresult = seasonal_decompose(ts, model="additive", period=365)\nprint(f"\\nДекомпозиция (additive):")\nprint(f"  Тренд: {result.trend.dropna().mean():.1f}")\nprint(f"  Сезонность (амплитуда): {result.seasonal.max():.1f}")\nprint(f"  Остаток (std): {result.resid.dropna().std():.1f}")\n\n# Стационарность — тест Дики-Фуллера\nfrom statsmodels.tsa.stattools import adfuller\n\nadf_result = adfuller(ts)\nprint(f"\\nТест Дики-Фуллера:")\nprint(f"  ADF Statistic: {adf_result[0]:.4f}")\nprint(f"  p-value: {adf_result[1]:.4f}")\nprint(f"  Стационарный: {\'Да\' if adf_result[1] < 0.05 else \'Нет\'}")\n\n# Дифференцирование для стационарности\nts_diff = ts.diff().dropna()\nadf_diff = adfuller(ts_diff)\nprint(f"\\nПосле дифференцирования:")\nprint(f"  p-value: {adf_diff[1]:.6f}")\nprint(f"  Стационарный: {\'Да\' if adf_diff[1] < 0.05 else \'Нет\'}")' },
        { type: 'note', value: 'Стационарность — ключевое требование для классических моделей (ARIMA). Ряд стационарен, если его статистические свойства (среднее, дисперсия) не меняются со временем. Тест Дики-Фуллера проверяет гипотезу о нестационарности.' }
      ]
    },
    {
      id: 2,
      title: 'ARIMA и SARIMA',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Классические модели временных рядов' },
        { type: 'text', value: 'ARIMA (AutoRegressive Integrated Moving Average) — золотой стандарт для прогнозирования временных рядов. Три параметра: p (авторегрессия), d (дифференцирование), q (скользящее среднее). SARIMA добавляет сезонные компоненты (P, D, Q, s).' },
        { type: 'code', language: 'python', value: 'import numpy as np\nimport pandas as pd\nfrom statsmodels.tsa.arima.model import ARIMA\nfrom statsmodels.tsa.statespace.sarimax import SARIMAX\nfrom sklearn.metrics import mean_absolute_error, mean_squared_error\n\n# Генерация данных с сезонностью\nnp.random.seed(42)\nn = 365\ndates = pd.date_range("2023-01-01", periods=n, freq="D")\ntrend = np.linspace(50, 80, n)\nseason = 15 * np.sin(2 * np.pi * np.arange(n) / 30)  # месячная сезонность\nnoise = np.random.normal(0, 3, n)\nts = pd.Series(trend + season + noise, index=dates)\n\ntrain = ts[:300]\ntest = ts[300:]\n\n# ARIMA (p=2, d=1, q=1)\narima = ARIMA(train, order=(2, 1, 1))\narima_fit = arima.fit()\n\narima_pred = arima_fit.forecast(steps=len(test))\narima_mae = mean_absolute_error(test, arima_pred)\nprint(f"ARIMA(2,1,1):")\nprint(f"  MAE: {arima_mae:.2f}")\nprint(f"  AIC: {arima_fit.aic:.2f}")\n\n# SARIMA с сезонной компонентой\nsarima = SARIMAX(train, order=(1, 1, 1), seasonal_order=(1, 1, 1, 30))\nsarima_fit = sarima.fit(disp=False)\n\nsarima_pred = sarima_fit.forecast(steps=len(test))\nsarima_mae = mean_absolute_error(test, sarima_pred)\nprint(f"\\nSARIMA(1,1,1)(1,1,1,30):")\nprint(f"  MAE: {sarima_mae:.2f}")\nprint(f"  AIC: {sarima_fit.aic:.2f}")\n\n# Auto ARIMA — автоматический подбор параметров\nfrom pmdarima import auto_arima\n\nauto_model = auto_arima(train, seasonal=True, m=30, stepwise=True,\n                        suppress_warnings=True)\nprint(f"\\nAuto ARIMA: {auto_model.order} x {auto_model.seasonal_order}")\nauto_pred = auto_model.predict(n_periods=len(test))\nauto_mae = mean_absolute_error(test, auto_pred)\nprint(f"  MAE: {auto_mae:.2f}")\nprint(f"  AIC: {auto_model.aic():.2f}")' },
        { type: 'tip', value: 'Используйте auto_arima из pmdarima для автоматического подбора оптимальных параметров p, d, q. Это значительно экономит время и часто даёт лучшие результаты, чем ручной подбор.' }
      ]
    },
    {
      id: 3,
      title: 'Prophet',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Facebook Prophet для прогнозирования' },
        { type: 'text', value: 'Prophet — библиотека от Meta (Facebook) для прогнозирования временных рядов. Она автоматически обнаруживает тренд, множественные сезонности, праздники и точки изменения (changepoints). Prophet прост в использовании и хорошо работает с бизнес-данными.' },
        { type: 'code', language: 'python', value: 'from prophet import Prophet\nimport pandas as pd\nimport numpy as np\n\n# Подготовка данных в формате Prophet (ds, y)\nnp.random.seed(42)\nn = 365 * 2\ndates = pd.date_range("2022-01-01", periods=n, freq="D")\n\ntrend = np.linspace(100, 180, n)\nyearly_season = 20 * np.sin(2 * np.pi * np.arange(n) / 365)\nweekly_season = 5 * np.sin(2 * np.pi * np.arange(n) / 7)\nnoise = np.random.normal(0, 3, n)\n\ndf = pd.DataFrame({\n    "ds": dates,\n    "y": trend + yearly_season + weekly_season + noise\n})\n\ntrain = df[:600]\ntest = df[600:]\n\n# Обучение Prophet\nmodel = Prophet(\n    yearly_seasonality=True,\n    weekly_seasonality=True,\n    daily_seasonality=False,\n    changepoint_prior_scale=0.05,  # гибкость тренда\n    seasonality_prior_scale=10     # гибкость сезонности\n)\nmodel.fit(train)\n\n# Прогноз\nfuture = model.make_future_dataframe(periods=len(test))\nforecast = model.predict(future)\n\n# Оценка\npredicted = forecast.tail(len(test))[["ds", "yhat", "yhat_lower", "yhat_upper"]]\nactual = test["y"].values\npred_values = predicted["yhat"].values\n\nmae = np.mean(np.abs(actual - pred_values))\nmape = np.mean(np.abs((actual - pred_values) / actual)) * 100\n\nprint("Prophet Forecast:")\nprint(f"  MAE: {mae:.2f}")\nprint(f"  MAPE: {mape:.2f}%")\nprint(f"\\nПоследние 5 предсказаний:")\nprint(predicted.tail().to_string(index=False))\n\n# Добавление праздников\nholidays = pd.DataFrame({\n    "holiday": "new_year",\n    "ds": pd.to_datetime(["2022-01-01", "2023-01-01", "2024-01-01"]),\n    "lower_window": -1,\n    "upper_window": 1\n})\n\nmodel_h = Prophet(holidays=holidays)\nmodel_h.fit(train)\nprint("\\nМодель с праздниками обучена!")' },
        { type: 'list', items: [
          'Prophet автоматически находит changepoints (точки изменения тренда)',
          'Поддерживает множественные сезонности (годовая, недельная, дневная)',
          'Легко добавить праздники и специальные события',
          'Работает с пропусками в данных и выбросами'
        ] }
      ]
    },
    {
      id: 4,
      title: 'LSTM для временных рядов',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Нейронные сети для прогнозирования' },
        { type: 'text', value: 'LSTM (Long Short-Term Memory) — тип рекуррентной нейронной сети, способный запоминать долгосрочные зависимости. Для временных рядов LSTM принимает последовательность предыдущих значений (window) и предсказывает следующее значение.' },
        { type: 'code', language: 'python', value: 'import numpy as np\nfrom tensorflow.keras.models import Sequential\nfrom tensorflow.keras.layers import LSTM, Dense, Dropout\nfrom sklearn.preprocessing import MinMaxScaler\n\n# Генерация временного ряда\nnp.random.seed(42)\nn = 500\ntrend = np.linspace(0, 5, n)\nseason = 2 * np.sin(2 * np.pi * np.arange(n) / 50)\nnoise = np.random.normal(0, 0.2, n)\ndata = trend + season + noise\n\n# Нормализация\nscaler = MinMaxScaler()\ndata_scaled = scaler.fit_transform(data.reshape(-1, 1))\n\n# Создание последовательностей (window)\ndef create_sequences(data, window_size=30):\n    X, y = [], []\n    for i in range(window_size, len(data)):\n        X.append(data[i-window_size:i, 0])\n        y.append(data[i, 0])\n    return np.array(X), np.array(y)\n\nwindow = 30\nX, y = create_sequences(data_scaled, window)\n\n# Reshape для LSTM: (samples, timesteps, features)\nX = X.reshape(X.shape[0], X.shape[1], 1)\n\n# Split\nsplit = int(len(X) * 0.8)\nX_train, X_test = X[:split], X[split:]\ny_train, y_test = y[:split], y[split:]\n\n# LSTM модель\nmodel = Sequential([\n    LSTM(64, return_sequences=True, input_shape=(window, 1)),\n    Dropout(0.2),\n    LSTM(32),\n    Dropout(0.2),\n    Dense(1)\n])\n\nmodel.compile(optimizer="adam", loss="mse")\nhistory = model.fit(X_train, y_train, epochs=50, batch_size=32,\n                    validation_split=0.1, verbose=0)\n\n# Оценка\ny_pred = model.predict(X_test, verbose=0)\ny_pred_inv = scaler.inverse_transform(y_pred)\ny_test_inv = scaler.inverse_transform(y_test.reshape(-1, 1))\n\nmae = np.mean(np.abs(y_test_inv - y_pred_inv))\nrmse = np.sqrt(np.mean((y_test_inv - y_pred_inv) ** 2))\n\nprint("LSTM Time Series Forecast:")\nprint(f"  MAE: {mae:.4f}")\nprint(f"  RMSE: {rmse:.4f}")\nprint(f"  Train loss: {history.history[\'loss\'][-1]:.6f}")\nprint(f"  Val loss: {history.history[\'val_loss\'][-1]:.6f}")' },
        { type: 'warning', value: 'Нормализуйте данные перед LSTM (MinMaxScaler). Без нормализации сеть будет обучаться медленно или вообще не сойдётся. Не забудьте обратное преобразование для интерпретации результатов.' }
      ]
    },
    {
      id: 5,
      title: 'Метрики оценки: MAPE, RMSE',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Оценка качества прогнозов' },
        { type: 'text', value: 'Выбор правильной метрики для временных рядов критически важен. Каждая метрика подчёркивает разные аспекты качества прогноза: MAE — средняя абсолютная ошибка, RMSE — штрафует большие ошибки, MAPE — относительная ошибка в процентах.' },
        { type: 'code', language: 'python', value: 'import numpy as np\n\n# Функции метрик\ndef mae(y_true, y_pred):\n    # Mean Absolute Error — средняя абсолютная ошибка\n    return np.mean(np.abs(y_true - y_pred))\n\ndef rmse(y_true, y_pred):\n    # Root Mean Squared Error — корень средне-квадратичной ошибки\n    return np.sqrt(np.mean((y_true - y_pred) ** 2))\n\ndef mape(y_true, y_pred):\n    # Mean Absolute Percentage Error — средняя абсолютная % ошибка\n    mask = y_true != 0  # избегаем деления на ноль\n    return np.mean(np.abs((y_true[mask] - y_pred[mask]) / y_true[mask])) * 100\n\ndef smape(y_true, y_pred):\n    # Symmetric MAPE — симметричная MAPE\n    numerator = np.abs(y_true - y_pred)\n    denominator = (np.abs(y_true) + np.abs(y_pred)) / 2\n    mask = denominator != 0\n    return np.mean(numerator[mask] / denominator[mask]) * 100\n\ndef mase(y_true, y_pred, y_train):\n    # Mean Absolute Scaled Error — масштабированная MAE\n    naive_mae = np.mean(np.abs(np.diff(y_train)))  # naive forecast\n    return mae(y_true, y_pred) / naive_mae\n\n# Пример: сравнение двух моделей\nnp.random.seed(42)\ny_true = np.array([100, 150, 200, 180, 220, 250, 300, 280, 350, 400])\ny_pred_A = y_true + np.random.normal(0, 15, len(y_true))  # Модель A\ny_pred_B = y_true + np.random.normal(5, 10, len(y_true))  # Модель B\ny_train = np.array([80, 90, 95, 100, 110, 120, 130, 140])\n\nprint("Сравнение моделей прогнозирования:")\nprint(f"{\'Метрика\':<10} {\'Модель A\':<12} {\'Модель B\':<12} {\'Лучше\':<10}\")\nprint(\"-\" * 44)\n\nmetrics = {\n    "MAE": (mae(y_true, y_pred_A), mae(y_true, y_pred_B)),\n    "RMSE": (rmse(y_true, y_pred_A), rmse(y_true, y_pred_B)),\n    "MAPE": (mape(y_true, y_pred_A), mape(y_true, y_pred_B)),\n    "sMAPE": (smape(y_true, y_pred_A), smape(y_true, y_pred_B)),\n    "MASE": (mase(y_true, y_pred_A, y_train), mase(y_true, y_pred_B, y_train))\n}\n\nfor name, (a, b) in metrics.items():\n    better = "A" if a < b else "B"\n    print(f"{name:<10} {a:<12.4f} {b:<12.4f} {better:<10}")\n\nprint("\\n--- Когда какую метрику использовать ---")\nprint("MAE:   интерпретируемая, в единицах ряда")\nprint("RMSE:  штрафует выбросы, чувствительна к большим ошибкам")\nprint("MAPE:  % ошибка, не работает при y=0")\nprint("sMAPE: симметричная, от 0% до 200%")\nprint("MASE:  сравнивает с naive forecast, scale-independent")' },
        { type: 'tip', value: 'MASE (Mean Absolute Scaled Error) — рекомендуемая метрика для сравнения моделей на разных временных рядах, так как она не зависит от масштаба данных. MASE < 1 означает, что модель лучше naive forecast.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Прогнозирование продаж',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте временной ряд продаж и сравните ARIMA и LSTM модели по метрикам MAE, RMSE, MAPE.',
      requirements: [
        'Сгенерируйте временной ряд (365 дней) с трендом, сезонностью и шумом',
        'Разделите на train (300 дней) и test (65 дней)',
        'Обучите модель ARIMA на train и сделайте прогноз на test',
        'Вычислите MAE, RMSE и MAPE для модели',
        'Выведите результаты сравнения и определите лучшую модель'
      ],
      hint: 'Используйте ARIMA из statsmodels. Для MAPE убедитесь, что нет нулевых значений в y_true. forecast() возвращает предсказания на заданное число шагов вперёд.',
      expectedOutput: 'Прогнозирование продаж:\nТренировка: 300 дней\nТест: 65 дней\n\nARIMA:\n  MAE: XX.XX\n  RMSE: XX.XX\n  MAPE: XX.XX%',
      solution: 'import numpy as np\nimport pandas as pd\nfrom statsmodels.tsa.arima.model import ARIMA\n\nnp.random.seed(42)\nn = 365\ndates = pd.date_range("2023-01-01", periods=n, freq="D")\n\ntrend = np.linspace(100, 150, n)\nseasonality = 20 * np.sin(2 * np.pi * np.arange(n) / 30)\nnoise = np.random.normal(0, 5, n)\nvalues = trend + seasonality + noise\n\nts = pd.Series(values, index=dates)\ntrain = ts[:300]\ntest = ts[300:]\n\nprint("Прогнозирование продаж:")\nprint(f"Тренировка: {len(train)} дней")\nprint(f"Тест: {len(test)} дней")\n\n# ARIMA\nmodel = ARIMA(train, order=(2, 1, 1))\nfit = model.fit()\npred = fit.forecast(steps=len(test))\n\ny_true = test.values\ny_pred = pred.values\n\nmae_val = np.mean(np.abs(y_true - y_pred))\nrmse_val = np.sqrt(np.mean((y_true - y_pred) ** 2))\nmape_val = np.mean(np.abs((y_true - y_pred) / y_true)) * 100\n\nprint(f"\\nARIMA(2,1,1):")\nprint(f"  MAE: {mae_val:.2f}")\nprint(f"  RMSE: {rmse_val:.2f}")\nprint(f"  MAPE: {mape_val:.2f}%")',
      explanation: 'ARIMA хорошо работает на данных с трендом и сезонностью. Параметр d=1 убирает тренд через дифференцирование. MAPE даёт процентную ошибку, что удобно для интерпретации. На реальных данных стоит использовать auto_arima для подбора оптимальных p, d, q.'
    }
  ]
}
