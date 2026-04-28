export default {
  id: 'ml',
  title: 'Machine Learning',
  icon: '🤖',
  description: 'Полный курс Machine Learning: от математических основ до нейронных сетей и деплоя моделей.',
  color: '#FF6F00',
  modules: [
    // === ОСНОВЫ И МАТЕМАТИКА (1-3) ===
    { id: 1, title: 'Введение в Machine Learning', icon: '🚀', totalLessons: 6 },
    { id: 2, title: 'Математика для ML: Линейная алгебра', icon: '📐', totalLessons: 6 },
    { id: 3, title: 'Математика для ML: Статистика и вероятность', icon: '📊', totalLessons: 6 },

    // === PYTHON ИНСТРУМЕНТЫ (4-6) ===
    { id: 4, title: 'Python для ML: NumPy', icon: '🔢', totalLessons: 6 },
    { id: 5, title: 'Python для ML: Pandas', icon: '🐼', totalLessons: 6 },
    { id: 6, title: 'Визуализация данных: Matplotlib и Seaborn', icon: '📈', totalLessons: 6 },

    // === ПРЕДОБРАБОТКА ДАННЫХ (7) ===
    { id: 7, title: 'Предобработка данных', icon: '🧹', totalLessons: 7 },

    // === КЛАССИЧЕСКИЕ АЛГОРИТМЫ (8-14) ===
    { id: 8, title: 'Линейная регрессия', icon: '📉', totalLessons: 6 },
    { id: 9, title: 'Логистическая регрессия', icon: '🔀', totalLessons: 6 },
    { id: 10, title: 'Деревья решений и Random Forest', icon: '🌳', totalLessons: 6 },
    { id: 11, title: 'Метод опорных векторов (SVM)', icon: '📏', totalLessons: 6 },
    { id: 12, title: 'K ближайших соседей (KNN)', icon: '👥', totalLessons: 6 },
    { id: 13, title: 'Кластеризация: K-Means и DBSCAN', icon: '🎯', totalLessons: 6 },
    { id: 14, title: 'Снижение размерности: PCA', icon: '🔬', totalLessons: 6 },

    // === ОЦЕНКА И АНСАМБЛИ (15-16) ===
    { id: 15, title: 'Оценка моделей', icon: '✅', totalLessons: 7 },
    { id: 16, title: 'Ансамблевые методы', icon: '🏗️', totalLessons: 6 },

    // === НЕЙРОННЫЕ СЕТИ (17-20) ===
    { id: 17, title: 'Нейронные сети: основы', icon: '🧠', totalLessons: 6 },
    { id: 18, title: 'Deep Learning: Keras и TensorFlow', icon: '⚡', totalLessons: 6 },
    { id: 19, title: 'Свёрточные нейронные сети (CNN)', icon: '🖼️', totalLessons: 6 },
    { id: 20, title: 'Рекуррентные нейронные сети (RNN, LSTM)', icon: '🔄', totalLessons: 6 },

    // === NLP И ТРАНСФОРМЕРЫ (21-23) ===
    { id: 21, title: 'Обработка естественного языка (NLP)', icon: '💬', totalLessons: 6 },
    { id: 22, title: 'Transfer Learning и Fine-tuning', icon: '🔧', totalLessons: 6 },
    { id: 23, title: 'Трансформеры и Attention', icon: '🤖', totalLessons: 6 },

    // === ДЕПЛОЙ И ПРОЕКТ (24-25) ===
    { id: 24, title: 'MLOps: деплой и мониторинг моделей', icon: '🚢', totalLessons: 6 },
    { id: 25, title: 'Практический проект: End-to-End ML Pipeline', icon: '🏆', totalLessons: 6 },

    // === ПРОДВИНУТЫЕ АЛГОРИТМЫ (26-30) ===
    { id: 26, title: 'Gradient Boosting: XGBoost, LightGBM, CatBoost', icon: '🚀', totalLessons: 6 },
    { id: 27, title: 'Байесовские методы', icon: '🎲', totalLessons: 6 },
    { id: 28, title: 'Прогнозирование временных рядов', icon: '📈', totalLessons: 6 },
    { id: 29, title: 'Обнаружение аномалий', icon: '🔍', totalLessons: 6 },
    { id: 30, title: 'Рекомендательные системы', icon: '⭐', totalLessons: 6 },

    // === ГЕНЕРАТИВНЫЕ МОДЕЛИ И RL (31-33) ===
    { id: 31, title: 'Генеративные модели (GANs)', icon: '🎨', totalLessons: 6 },
    { id: 32, title: 'Автоэнкодеры', icon: '🔄', totalLessons: 6 },
    { id: 33, title: 'Обучение с подкреплением (RL)', icon: '🎮', totalLessons: 6 },

    // === ИНЖЕНЕРИЯ И ОПТИМИЗАЦИЯ (34-36) ===
    { id: 34, title: 'Feature Engineering продвинутый', icon: '🛠️', totalLessons: 6 },
    { id: 35, title: 'Оптимизация гиперпараметров', icon: '⚙️', totalLessons: 6 },
    { id: 36, title: 'Интерпретируемость моделей (SHAP, LIME)', icon: '🔮', totalLessons: 6 },

    // === ПРИКЛАДНЫЕ ОБЛАСТИ (37-39) ===
    { id: 37, title: 'Компьютерное зрение: практика', icon: '👁️', totalLessons: 6 },
    { id: 38, title: 'NLP: BERT и GPT', icon: '📝', totalLessons: 6 },
    { id: 39, title: 'Аугментация данных', icon: '🔁', totalLessons: 6 },

    // === МАСШТАБИРОВАНИЕ И АВТОМАТИЗАЦИЯ (40-43) ===
    { id: 40, title: 'AutoML', icon: '🤖', totalLessons: 6 },
    { id: 41, title: 'Графовые нейронные сети (GNN)', icon: '🕸️', totalLessons: 6 },
    { id: 42, title: 'Федеративное обучение', icon: '🔐', totalLessons: 6 },
    { id: 43, title: 'Работа с большими данными (PySpark ML)', icon: '💾', totalLessons: 6 },

    // === LLM И ПРАКТИКУМ (44-45) ===
    { id: 44, title: 'LLM: Fine-tuning и RAG', icon: '🧠', totalLessons: 6 },
    { id: 45, title: 'Практикум: Kaggle-задачи', icon: '🏆', totalLessons: 6 },

    // === РЕАЛЬНЫЕ ПРОЕКТЫ (46-55) ===
    { id: 46, title: 'Проект: Предсказание цен на жильё', icon: '🏠', totalLessons: 10 },
    { id: 47, title: 'Проект: Классификация отзывов (NLP)', icon: '💬', totalLessons: 10 },
    { id: 48, title: 'Проект: Распознавание изображений (CV)', icon: '📸', totalLessons: 10 },
    { id: 49, title: 'Проект: Рекомендательная система фильмов', icon: '🎬', totalLessons: 10 },
    { id: 50, title: 'Проект: Прогноз оттока клиентов (Churn)', icon: '📉', totalLessons: 10 },
    { id: 51, title: 'Проект: Детекция мошенничества', icon: '🔍', totalLessons: 10 },
    { id: 52, title: 'Проект: Чат-бот с NLP', icon: '🤖', totalLessons: 10 },
    { id: 53, title: 'Проект: Object Detection (YOLO)', icon: '👁️', totalLessons: 10 },
    { id: 54, title: 'Проект: Прогноз временных рядов', icon: '📈', totalLessons: 10 },
    { id: 55, title: 'Проект: Генерация изображений', icon: '🎨', totalLessons: 10 },

    // === KAGGLE COMPETITIONS (56-60) ===
    { id: 56, title: 'Kaggle: Titanic — первый конкурс', icon: '🚢', totalLessons: 8 },
    { id: 57, title: 'Kaggle: House Prices — регрессия', icon: '🏘️', totalLessons: 8 },
    { id: 58, title: 'Kaggle: Digit Recognizer (MNIST)', icon: '🔢', totalLessons: 8 },
    { id: 59, title: 'Kaggle: NLP с Disaster Tweets', icon: '🐦', totalLessons: 8 },
    { id: 60, title: 'Kaggle: Табличные данные (TPS)', icon: '📋', totalLessons: 8 },

    // === ПРАКТИКУМ: ЗАДАЧИ (61-65) ===
    { id: 61, title: 'Практикум: EDA и визуализация', icon: '📊', totalLessons: 10 },
    { id: 62, title: 'Практикум: Feature Engineering', icon: '🛠️', totalLessons: 10 },
    { id: 63, title: 'Практикум: Классические модели', icon: '📐', totalLessons: 10 },
    { id: 64, title: 'Практикум: Нейронные сети', icon: '🧠', totalLessons: 10 },
    { id: 65, title: 'Практикум: NLP задачи', icon: '💬', totalLessons: 10 },

    // === ПРОДВИНУТЫЕ ТЕМЫ (66-70) ===
    { id: 66, title: 'Диффузионные модели (Stable Diffusion)', icon: '🌀', totalLessons: 8 },
    { id: 67, title: 'Мультимодальные модели (CLIP, LLaVA)', icon: '🔗', totalLessons: 8 },
    { id: 68, title: 'RLHF и Alignment', icon: '🎯', totalLessons: 8 },
    { id: 69, title: 'MLflow: эксперименты и версионирование', icon: '📦', totalLessons: 8 },
    { id: 70, title: 'A/B тестирование для ML', icon: '⚗️', totalLessons: 8 }
  ]
}
