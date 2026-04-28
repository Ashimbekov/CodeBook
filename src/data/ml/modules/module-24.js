export default {
  id: 24,
  title: 'MLOps: деплой и мониторинг моделей',
  description: 'MLOps: сериализация моделей, REST API, Docker, мониторинг, A/B тестирование, CI/CD для ML.',
  lessons: [
    {
      id: 1,
      title: 'Сериализация моделей',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Сохранение и загрузка моделей' },
        { type: 'text', value: 'После обучения модель нужно сохранить для использования в продакшене. Основные форматы: pickle/joblib для sklearn, SavedModel/ONNX для TensorFlow, TorchScript для PyTorch. Также сохраняйте скейлеры, энкодеры и весь pipeline.' },
        { type: 'code', language: 'python', value: 'import joblib\nimport pickle\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.pipeline import Pipeline\nfrom sklearn.datasets import load_iris\nfrom sklearn.model_selection import train_test_split\n\n# Обучение модели\niris = load_iris()\nX_train, X_test, y_train, y_test = train_test_split(\n    iris.data, iris.target, test_size=0.2, random_state=42\n)\n\npipeline = Pipeline([\n    ("scaler", StandardScaler()),\n    ("clf", RandomForestClassifier(n_estimators=100, random_state=42))\n])\npipeline.fit(X_train, y_train)\nprint(f"Accuracy: {pipeline.score(X_test, y_test):.4f}")\n\n# Способ 1: joblib (рекомендуется для sklearn)\njoblib.dump(pipeline, "model_pipeline.joblib")\nloaded_pipeline = joblib.load("model_pipeline.joblib")\nprint(f"Loaded accuracy: {loaded_pipeline.score(X_test, y_test):.4f}")\n\n# Способ 2: pickle\nwith open("model_pipeline.pkl", "wb") as f:\n    pickle.dump(pipeline, f)\n\nwith open("model_pipeline.pkl", "rb") as f:\n    loaded_pkl = pickle.load(f)\n\nprint(f"Pickle accuracy: {loaded_pkl.score(X_test, y_test):.4f}")\n\n# ВАЖНО: сохраняйте метаданные!\nimport json\nmetadata = {\n    "model_type": "RandomForestClassifier",\n    "features": list(iris.feature_names),\n    "classes": list(iris.target_names),\n    "accuracy": float(pipeline.score(X_test, y_test)),\n    "version": "1.0.0"\n}\nwith open("model_metadata.json", "w") as f:\n    json.dump(metadata, f, indent=2)\nprint(f"\\nМетаданные сохранены: {metadata}")' },
        { type: 'warning', value: 'Никогда не загружайте pickle файлы из ненадёжных источников! pickle может выполнять произвольный код при загрузке. Для безопасности используйте ONNX или SavedModel.' }
      ]
    },
    {
      id: 2,
      title: 'REST API с Flask/FastAPI',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Деплой модели как веб-сервис' },
        { type: 'code', language: 'python', value: '# FastAPI — современный фреймворк для ML API\n# pip install fastapi uvicorn\n\n# app.py\n"""\nfrom fastapi import FastAPI\nfrom pydantic import BaseModel\nimport joblib\nimport numpy as np\n\napp = FastAPI(title="ML Prediction API")\n\n# Загрузка модели при старте\nmodel = joblib.load("model_pipeline.joblib")\n\nclass PredictionRequest(BaseModel):\n    sepal_length: float\n    sepal_width: float\n    petal_length: float\n    petal_width: float\n\nclass PredictionResponse(BaseModel):\n    prediction: str\n    probability: float\n    class_probabilities: dict\n\n@app.post("/predict", response_model=PredictionResponse)\ndef predict(request: PredictionRequest):\n    features = np.array([[\n        request.sepal_length, request.sepal_width,\n        request.petal_length, request.petal_width\n    ]])\n    \n    prediction = model.predict(features)[0]\n    probabilities = model.predict_proba(features)[0]\n    \n    classes = ["setosa", "versicolor", "virginica"]\n    \n    return PredictionResponse(\n        prediction=classes[prediction],\n        probability=float(max(probabilities)),\n        class_probabilities=dict(zip(classes, probabilities.tolist()))\n    )\n\n@app.get("/health")\ndef health():\n    return {"status": "healthy", "model_version": "1.0.0"}\n"""\n\nprint("Запуск: uvicorn app:app --host 0.0.0.0 --port 8000")\nprint()\nprint("Эндпоинты:")\nprint("  POST /predict — предсказание")\nprint("  GET /health — проверка здоровья сервиса")\nprint("  GET /docs — Swagger документация (автоматически!)")\nprint()\nprint("Пример запроса:")\nprint(\'  curl -X POST http://localhost:8000/predict \\\\\')\nprint(\'    -H "Content-Type: application/json" \\\\\')\nprint(\'    -d \'{"sepal_length": 5.1, "sepal_width": 3.5, "petal_length": 1.4, "petal_width": 0.2}\\\'\')' },
        { type: 'tip', value: 'FastAPI автоматически генерирует Swagger UI (/docs) и валидирует входные данные через Pydantic. Это идеальный фреймворк для ML API.' }
      ]
    },
    {
      id: 3,
      title: 'Docker для ML',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Контейнеризация ML сервиса' },
        { type: 'code', language: 'python', value: '# Dockerfile для ML API\ndockerfile_content = """\n# Dockerfile\nFROM python:3.10-slim\n\nWORKDIR /app\n\n# Установка зависимостей\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\n\n# Копирование модели и кода\nCOPY model_pipeline.joblib .\nCOPY app.py .\n\n# Порт\nEXPOSE 8000\n\n# Запуск\nCMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]\n"""\n\nrequirements = """\nfastapi==0.104.1\nuvicorn==0.24.0\nscikit-learn==1.3.2\njoblib==1.3.2\nnumpy==1.26.2\n"""\n\nprint("Dockerfile:")\nprint(dockerfile_content)\n\nprint("requirements.txt:")\nprint(requirements)\n\nprint("Команды Docker:")\nprint("  docker build -t ml-api .")\nprint("  docker run -p 8000:8000 ml-api")\nprint("  docker push myregistry/ml-api:v1.0")\nprint()\nprint("Docker Compose для ML pipeline:")\nprint("  - API сервис (FastAPI + модель)")\nprint("  - Мониторинг (Prometheus + Grafana)")\nprint("  - Логирование (ELK Stack)")' },
        { type: 'note', value: 'Docker гарантирует, что модель работает одинаково в dev и prod среде. Фиксируйте версии библиотек в requirements.txt!' }
      ]
    },
    {
      id: 4,
      title: 'Мониторинг моделей в продакшене',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Model Monitoring и Data Drift' },
        { type: 'text', value: 'Модель в продакшене деградирует со временем: данные меняются (data drift), качество падает. Мониторинг помогает обнаружить проблемы до того, как они повлияют на бизнес.' },
        { type: 'code', language: 'python', value: 'import numpy as np\nfrom scipy import stats\n\n# Детектирование Data Drift\ndef detect_drift(reference_data, new_data, threshold=0.05):\n    """\n    Kolmogorov-Smirnov тест для обнаружения дрифта\n    """\n    results = {}\n    for feature_idx in range(reference_data.shape[1]):\n        stat, p_value = stats.ks_2samp(\n            reference_data[:, feature_idx],\n            new_data[:, feature_idx]\n        )\n        is_drift = p_value < threshold\n        results[f"feature_{feature_idx}"] = {\n            "statistic": stat,\n            "p_value": p_value,\n            "drift_detected": is_drift\n        }\n    return results\n\n# Симуляция\nnp.random.seed(42)\nreference = np.random.randn(1000, 4)  # обучающие данные\nnew_normal = np.random.randn(100, 4)   # новые данные (без дрифта)\nnew_drift = np.random.randn(100, 4) + [0, 0, 2, 0]  # с дрифтом в feature_2\n\nprint("Без дрифта:")\nfor feat, res in detect_drift(reference, new_normal).items():\n    print(f"  {feat}: drift={res[\'drift_detected\']}, p={res[\'p_value\']:.4f}")\n\nprint("\\nС дрифтом:")\nfor feat, res in detect_drift(reference, new_drift).items():\n    print(f"  {feat}: drift={res[\'drift_detected\']}, p={res[\'p_value\']:.4f}")\n\nprint("\\nЧто мониторить:")\nprint("  1. Предсказания: распределение, уверенность")\nprint("  2. Входные данные: data drift, schema validation")\nprint("  3. Метрики модели: accuracy, latency, throughput")\nprint("  4. Инфраструктура: CPU/GPU, память, ошибки")' },
        { type: 'list', value: [
          'Data Drift: распределение входных данных изменилось',
          'Concept Drift: связь между входами и выходами изменилась',
          'Model Decay: accuracy модели падает со временем',
          'Инструменты: Evidently AI, MLflow, Prometheus, Grafana, WhyLabs'
        ] }
      ]
    },
    {
      id: 5,
      title: 'MLflow для управления экспериментами',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Tracking экспериментов и версионирование' },
        { type: 'code', language: 'python', value: '# MLflow — платформа для управления ML lifecycle\n# pip install mlflow\n\n"""\nimport mlflow\nimport mlflow.sklearn\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.datasets import load_iris\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.metrics import accuracy_score, f1_score\n\niris = load_iris()\nX_train, X_test, y_train, y_test = train_test_split(\n    iris.data, iris.target, test_size=0.2, random_state=42\n)\n\n# MLflow tracking\nmlflow.set_experiment("iris-classification")\n\nfor n_estimators in [50, 100, 200]:\n    for max_depth in [3, 5, 10]:\n        with mlflow.start_run():\n            # Логирование параметров\n            mlflow.log_param("n_estimators", n_estimators)\n            mlflow.log_param("max_depth", max_depth)\n            \n            # Обучение\n            model = RandomForestClassifier(\n                n_estimators=n_estimators, max_depth=max_depth, random_state=42\n            )\n            model.fit(X_train, y_train)\n            y_pred = model.predict(X_test)\n            \n            # Логирование метрик\n            accuracy = accuracy_score(y_test, y_pred)\n            f1 = f1_score(y_test, y_pred, average="macro")\n            mlflow.log_metric("accuracy", accuracy)\n            mlflow.log_metric("f1_score", f1)\n            \n            # Сохранение модели\n            mlflow.sklearn.log_model(model, "model")\n            \n            print(f"n_est={n_estimators}, depth={max_depth}: acc={accuracy:.4f}")\n"""\n\nprint("MLflow возможности:")\nprint("  1. Tracking: логирование параметров, метрик, артефактов")\nprint("  2. Projects: воспроизводимость экспериментов")\nprint("  3. Models: регистрация и версионирование моделей")\nprint("  4. Model Registry: staging -> production pipeline")\nprint("  5. UI: визуализация и сравнение экспериментов")\nprint()\nprint("Запуск UI: mlflow ui --port 5000")' },
        { type: 'tip', value: 'MLflow — стандарт индустрии для tracking экспериментов. Каждый запуск сохраняет параметры, метрики, модель и артефакты. Можно сравнивать сотни экспериментов.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: ML API с FastAPI',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте полноценный ML API: обучите модель, сохраните, создайте API эндпоинт для предсказаний.',
      requirements: [
        'Обучите RandomForest Pipeline (scaler + model) на Iris dataset',
        'Сохраните pipeline через joblib вместе с метаданными',
        'Напишите код FastAPI с эндпоинтами /predict и /health',
        'Добавьте валидацию входных данных через Pydantic',
        'Выведите пример curl запроса для тестирования'
      ],
      hint: 'Pipeline объединяет scaler и модель. joblib.dump() для сохранения. FastAPI + Pydantic для валидации. Не забудьте metadata.json.',
      expectedOutput: 'Model accuracy: 0.97XX\nМодель сохранена: model_pipeline.joblib\nМетаданные: model_metadata.json\nAPI код: app.py\nЗапуск: uvicorn app:app --port 8000',
      solution: 'import joblib\nimport json\nimport numpy as np\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.pipeline import Pipeline\nfrom sklearn.datasets import load_iris\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.metrics import accuracy_score\n\n# Обучение\niris = load_iris()\nX_train, X_test, y_train, y_test = train_test_split(\n    iris.data, iris.target, test_size=0.2, random_state=42\n)\n\npipeline = Pipeline([\n    ("scaler", StandardScaler()),\n    ("clf", RandomForestClassifier(n_estimators=100, random_state=42))\n])\npipeline.fit(X_train, y_train)\nacc = accuracy_score(y_test, pipeline.predict(X_test))\nprint(f"Model accuracy: {acc:.4f}")\n\n# Сохранение\njoblib.dump(pipeline, "model_pipeline.joblib")\nprint("Модель сохранена: model_pipeline.joblib")\n\nmetadata = {\n    "model_type": "RandomForest",\n    "features": list(iris.feature_names),\n    "classes": list(iris.target_names),\n    "accuracy": float(acc),\n    "version": "1.0.0"\n}\nwith open("model_metadata.json", "w") as f:\n    json.dump(metadata, f, indent=2)\nprint("Метаданные: model_metadata.json")\n\n# API код\napi_code = \"\"\"\nfrom fastapi import FastAPI\nfrom pydantic import BaseModel\nimport joblib, numpy as np\n\napp = FastAPI(title="Iris Prediction API")\nmodel = joblib.load("model_pipeline.joblib")\n\nclass IrisInput(BaseModel):\n    sepal_length: float\n    sepal_width: float\n    petal_length: float\n    petal_width: float\n\n@app.post("/predict")\ndef predict(data: IrisInput):\n    features = np.array([[data.sepal_length, data.sepal_width, data.petal_length, data.petal_width]])\n    pred = model.predict(features)[0]\n    proba = model.predict_proba(features)[0]\n    classes = ["setosa", "versicolor", "virginica"]\n    return {"prediction": classes[pred], "confidence": float(max(proba))}\n\n@app.get("/health")\ndef health():\n    return {"status": "ok"}\n\"\"\"\nprint("API код: app.py")\nprint("Запуск: uvicorn app:app --port 8000")\nprint()\nprint("curl -X POST http://localhost:8000/predict \\\\\\\\")\nprint("  -H \'Content-Type: application/json\' \\\\\\\\")\nprint("  -d \'{\\\"sepal_length\\\": 5.1, \\\"sepal_width\\\": 3.5, \\\"petal_length\\\": 1.4, \\\"petal_width\\\": 0.2}\'")',
      explanation: 'ML API — стандартный способ использования моделей в продакшене. Pipeline объединяет предобработку и модель, гарантируя одинаковую обработку данных при обучении и inference. FastAPI обеспечивает автоматическую валидацию входных данных, документацию и высокую производительность. Метаданные помогают отслеживать версии и характеристики модели.'
    }
  ]
}
