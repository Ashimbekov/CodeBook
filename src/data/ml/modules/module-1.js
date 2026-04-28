export default {
  id: 1,
  title: 'Введение в Machine Learning',
  description: 'Основные понятия машинного обучения: что это, зачем нужно, типы ML, основные задачи и области применения.',
  lessons: [
    {
      id: 1,
      title: 'Что такое Machine Learning',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Определение Machine Learning'
        },
        {
          type: 'text',
          value: 'Machine Learning (машинное обучение) — это область искусственного интеллекта, в которой компьютерные программы автоматически улучшают свою производительность на основе опыта (данных), без явного программирования всех правил. Вместо того чтобы писать точные инструкции для каждого случая, мы даём алгоритму данные и позволяем ему самому находить закономерности.'
        },
        {
          type: 'text',
          value: 'Артур Сэмюэл (1959): «Machine Learning — это область исследований, которая даёт компьютерам способность учиться, не будучи явно запрограммированными». Том Митчелл (1997): «Программа учится на опыте E по отношению к задаче T с мерой производительности P, если её производительность на T, измеренная P, улучшается с опытом E».'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Традиционное программирование vs Machine Learning\n\n# Традиционный подход: правила задаёт программист\ndef is_spam_traditional(email):\n    spam_words = ["купи", "скидка", "бесплатно", "выигрыш"]\n    for word in spam_words:\n        if word in email.lower():\n            return True\n    return False\n\n# ML подход: модель САМА учится определять спам\n# из тысяч примеров писем, помеченных как спам/не спам\nfrom sklearn.naive_bayes import MultinomialNB\nfrom sklearn.feature_extraction.text import CountVectorizer\n\n# Данные для обучения\nemails = ["купи сейчас со скидкой", "встреча в 15:00", \n          "бесплатный подарок", "отчёт за квартал"]\nlabels = [1, 0, 1, 0]  # 1 = спам, 0 = не спам\n\nvectorizer = CountVectorizer()\nX = vectorizer.fit_transform(emails)\nmodel = MultinomialNB()\nmodel.fit(X, labels)\n\n# Модель сама решает, что является спамом\nnew_email = vectorizer.transform(["получи скидку"])\nprint(model.predict(new_email))  # [1] — спам'
        },
        {
          type: 'tip',
          value: 'Ключевое отличие ML от традиционного программирования: вместо "данные + правила = ответ" мы используем "данные + ответы = правила (модель)".'
        }
      ]
    },
    {
      id: 2,
      title: 'Типы машинного обучения',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Три основных типа ML'
        },
        {
          type: 'text',
          value: 'Машинное обучение делится на три основных типа в зависимости от характера данных и типа обратной связи: обучение с учителем (supervised learning), обучение без учителя (unsupervised learning) и обучение с подкреплением (reinforcement learning).'
        },
        {
          type: 'heading',
          value: '1. Обучение с учителем (Supervised Learning)'
        },
        {
          type: 'text',
          value: 'У нас есть размеченные данные — пары "вход-выход". Модель учится предсказывать выход по входу. Примеры: предсказание цены дома, классификация email как спам/не спам, распознавание изображений.'
        },
        {
          type: 'heading',
          value: '2. Обучение без учителя (Unsupervised Learning)'
        },
        {
          type: 'text',
          value: 'Данные не размечены — нет правильных ответов. Модель сама находит структуру и паттерны в данных. Примеры: кластеризация клиентов, снижение размерности, обнаружение аномалий.'
        },
        {
          type: 'heading',
          value: '3. Обучение с подкреплением (Reinforcement Learning)'
        },
        {
          type: 'text',
          value: 'Агент взаимодействует со средой, получая награды или штрафы за свои действия. Цель — максимизировать суммарную награду. Примеры: игры (AlphaGo), роботы, автопилоты.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Supervised Learning — предсказание цены дома\nfrom sklearn.linear_model import LinearRegression\nimport numpy as np\n\n# Данные: площадь (м²) -> цена (млн руб.)\nX = np.array([[30], [50], [70], [100], [150]])\ny = np.array([2.5, 4.0, 5.5, 7.5, 11.0])\n\nmodel = LinearRegression()\nmodel.fit(X, y)\nprint(f"Цена для 80 м²: {model.predict([[80]])[0]:.1f} млн руб.")\n\n# Unsupervised Learning — кластеризация\nfrom sklearn.cluster import KMeans\n\ndata = np.array([[1, 2], [1.5, 1.8], [5, 8], [8, 8], [1, 0.6], [9, 11]])\nkmeans = KMeans(n_clusters=2, random_state=42, n_init=10)\nkmeans.fit(data)\nprint(f"Кластеры: {kmeans.labels_}")  # [0, 0, 1, 1, 0, 1]'
        },
        {
          type: 'note',
          value: 'Supervised Learning — самый распространённый тип ML на практике. Около 80% реальных задач ML решаются именно обучением с учителем.'
        }
      ]
    },
    {
      id: 3,
      title: 'Задачи ML: регрессия и классификация',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Два главных типа задач Supervised Learning'
        },
        {
          type: 'text',
          value: 'В обучении с учителем выделяют две основные задачи: регрессия (предсказание непрерывного значения) и классификация (предсказание категории/класса).'
        },
        {
          type: 'heading',
          value: 'Регрессия'
        },
        {
          type: 'text',
          value: 'Цель — предсказать числовое значение. Примеры: цена дома, температура завтра, выручка компании, время доставки заказа. Метрики: MSE, MAE, R².'
        },
        {
          type: 'heading',
          value: 'Классификация'
        },
        {
          type: 'text',
          value: 'Цель — определить категорию. Бинарная классификация (2 класса): спам/не спам, болен/здоров. Многоклассовая классификация: порода собаки, цифра на изображении. Метрики: accuracy, precision, recall, F1-score.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Регрессия — предсказываем число\nfrom sklearn.linear_model import LinearRegression\nimport numpy as np\n\n# Предсказание зарплаты по годам опыта\nX = np.array([[1], [3], [5], [7], [10]])\ny = np.array([50000, 80000, 110000, 140000, 190000])\n\nreg_model = LinearRegression()\nreg_model.fit(X, y)\nprint(f"Зарплата при 6 годах опыта: {reg_model.predict([[6]])[0]:.0f} руб.")\n\n# Классификация — предсказываем категорию\nfrom sklearn.tree import DecisionTreeClassifier\n\n# Признаки: [возраст, зарплата (тыс.)] -> купит продукт (0/1)\nX_cls = np.array([[25, 40], [35, 60], [45, 80], [20, 20], [55, 100]])\ny_cls = np.array([0, 0, 1, 0, 1])  # 0 = не купит, 1 = купит\n\ncls_model = DecisionTreeClassifier(random_state=42)\ncls_model.fit(X_cls, y_cls)\nprint(f"Купит ли клиент (40 лет, 70k): {cls_model.predict([[40, 70]])[0]}")'
        },
        {
          type: 'list',
          value: [
            'Регрессия: прогноз погоды, цены акций, рейтинги',
            'Бинарная классификация: спам-фильтр, диагностика болезни',
            'Многоклассовая: распознавание цифр, определение языка',
            'Мультилейбл: теги к статье (может быть несколько)'
          ]
        }
      ]
    },
    {
      id: 4,
      title: 'Workflow машинного обучения',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Этапы ML-проекта'
        },
        {
          type: 'text',
          value: 'Каждый проект машинного обучения проходит стандартные этапы — от постановки задачи до деплоя модели. Понимание этого workflow критически важно для успешной работы.'
        },
        {
          type: 'list',
          value: [
            '1. Постановка задачи — определить, что именно предсказываем и зачем',
            '2. Сбор данных — собрать достаточный объём качественных данных',
            '3. Исследование данных (EDA) — понять структуру, распределения, аномалии',
            '4. Предобработка данных — очистка, кодирование, нормализация',
            '5. Feature Engineering — создание информативных признаков',
            '6. Выбор модели — подобрать подходящий алгоритм',
            '7. Обучение модели — подбор параметров на обучающих данных',
            '8. Оценка модели — проверка на тестовых данных',
            '9. Настройка гиперпараметров — оптимизация модели',
            '10. Деплой — внедрение модели в продакшен'
          ]
        },
        {
          type: 'code',
          language: 'python',
          value: '# Полный ML-пайплайн на примере Iris dataset\nfrom sklearn.datasets import load_iris\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.metrics import accuracy_score, classification_report\n\n# 1-2. Загрузка данных\niris = load_iris()\nX, y = iris.data, iris.target\nprint(f"Размер данных: {X.shape}")  # (150, 4)\n\n# 3. EDA\nprint(f"Классы: {iris.target_names}")\nprint(f"Признаки: {iris.feature_names}")\n\n# 4. Разделение на train/test\nX_train, X_test, y_train, y_test = train_test_split(\n    X, y, test_size=0.2, random_state=42\n)\n\n# 5. Нормализация\nscaler = StandardScaler()\nX_train = scaler.fit_transform(X_train)\nX_test = scaler.transform(X_test)\n\n# 6-7. Обучение модели\nmodel = RandomForestClassifier(n_estimators=100, random_state=42)\nmodel.fit(X_train, y_train)\n\n# 8. Оценка\ny_pred = model.predict(X_test)\nprint(f"Accuracy: {accuracy_score(y_test, y_pred):.2f}")\nprint(classification_report(y_test, y_pred, target_names=iris.target_names))'
        },
        {
          type: 'warning',
          value: 'Никогда не оценивайте модель на данных, на которых она обучалась! Всегда разделяйте данные на обучающую и тестовую выборки.'
        }
      ]
    },
    {
      id: 5,
      title: 'Области применения ML',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Где используется Machine Learning'
        },
        {
          type: 'text',
          value: 'Машинное обучение сегодня применяется практически в каждой индустрии. Рассмотрим основные области, где ML приносит наибольшую пользу.'
        },
        {
          type: 'list',
          value: [
            'Computer Vision — распознавание лиц, автопилот, медицинские снимки',
            'NLP — перевод текста, чат-боты, анализ тональности, GPT',
            'Рекомендательные системы — Netflix, YouTube, Spotify, e-commerce',
            'Финансы — кредитный скоринг, детекция мошенничества, алготрейдинг',
            'Медицина — диагностика заболеваний, разработка лекарств',
            'Производство — предиктивное обслуживание, контроль качества',
            'Маркетинг — сегментация клиентов, предсказание оттока, персонализация',
            'Транспорт — оптимизация маршрутов, прогноз спроса'
          ]
        },
        {
          type: 'code',
          language: 'python',
          value: '# Библиотеки Python для ML\n\n# Основные библиотеки для работы с данными\nimport numpy as np          # Численные вычисления\nimport pandas as pd         # Работа с таблицами\nimport matplotlib.pyplot as plt  # Визуализация\n\n# Scikit-learn — главная библиотека классического ML\nimport sklearn\nprint(f"scikit-learn версия: {sklearn.__version__}")\n\n# Основные модули sklearn:\n# sklearn.linear_model    — линейные модели\n# sklearn.tree            — деревья решений\n# sklearn.ensemble        — ансамблевые методы\n# sklearn.cluster         — кластеризация\n# sklearn.preprocessing   — предобработка\n# sklearn.model_selection — разделение данных, кросс-валидация\n# sklearn.metrics         — метрики оценки\n\n# Deep Learning фреймворки\n# import tensorflow as tf  — TensorFlow + Keras\n# import torch             — PyTorch\n\nprint("Всё готово для изучения ML!")'
        },
        {
          type: 'tip',
          value: 'Для начала работы с ML достаточно установить: pip install numpy pandas matplotlib scikit-learn. Deep Learning фреймворки (TensorFlow, PyTorch) понадобятся позже.'
        }
      ]
    },
    {
      id: 6,
      title: 'Практика: Первая ML модель',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создайте свою первую модель машинного обучения для классификации ирисов с использованием scikit-learn.',
      requirements: [
        'Загрузите датасет Iris из sklearn.datasets',
        'Разделите данные на обучающую (80%) и тестовую (20%) выборки',
        'Обучите модель KNeighborsClassifier с n_neighbors=3',
        'Оцените точность (accuracy) на тестовой выборке',
        'Сделайте предсказание для нового цветка: [5.1, 3.5, 1.4, 0.2]'
      ],
      hint: 'Используйте train_test_split для разделения данных, а accuracy_score для оценки. Не забудьте задать random_state=42 для воспроизводимости.',
      expectedOutput: 'Размер обучающей выборки: 120\nРазмер тестовой выборки: 30\nТочность модели: 1.00\nПредсказание для нового цветка: setosa',
      solution: 'from sklearn.datasets import load_iris\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.neighbors import KNeighborsClassifier\nfrom sklearn.metrics import accuracy_score\n\n# Загрузка данных\niris = load_iris()\nX, y = iris.data, iris.target\n\n# Разделение на train/test\nX_train, X_test, y_train, y_test = train_test_split(\n    X, y, test_size=0.2, random_state=42\n)\n\nprint(f"Размер обучающей выборки: {len(X_train)}")\nprint(f"Размер тестовой выборки: {len(X_test)}")\n\n# Обучение модели\nmodel = KNeighborsClassifier(n_neighbors=3)\nmodel.fit(X_train, y_train)\n\n# Оценка\ny_pred = model.predict(X_test)\naccuracy = accuracy_score(y_test, y_pred)\nprint(f"Точность модели: {accuracy:.2f}")\n\n# Предсказание для нового цветка\nnew_flower = [[5.1, 3.5, 1.4, 0.2]]\nprediction = model.predict(new_flower)\nprint(f"Предсказание для нового цветка: {iris.target_names[prediction[0]]}")',
      explanation: 'KNN (K ближайших соседей) — один из самых простых алгоритмов ML. Он находит K ближайших точек из обучающей выборки к новой точке и присваивает ей наиболее частый класс среди этих соседей. На датасете Iris модель показывает отличную точность, так как классы хорошо разделены в пространстве признаков.'
    }
  ]
}
