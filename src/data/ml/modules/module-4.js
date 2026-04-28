export default {
  id: 4,
  title: 'Python для ML: NumPy',
  description: 'NumPy — фундаментальная библиотека для численных вычислений в Python: массивы, операции, broadcasting, генерация данных.',
  lessons: [
    {
      id: 1,
      title: 'Создание массивов NumPy',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'ndarray — основа NumPy'
        },
        {
          type: 'text',
          value: 'NumPy (Numerical Python) — основная библиотека для работы с числовыми данными в ML. Его ключевая структура — ndarray (N-dimensional array). NumPy-массивы работают в 10-100 раз быстрее обычных Python-списков за счёт хранения данных в непрерывной памяти и использования BLAS/LAPACK.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import numpy as np\n\n# Создание массивов\na = np.array([1, 2, 3, 4, 5])        # 1D\nA = np.array([[1, 2, 3], [4, 5, 6]])  # 2D\n\nprint(f"1D массив: {a}")\nprint(f"2D массив:\\n{A}")\nprint(f"Форма: {A.shape}")   # (2, 3)\nprint(f"Размерность: {A.ndim}")  # 2\nprint(f"Тип данных: {A.dtype}")  # int64\n\n# Специальные массивы\nzeros = np.zeros((3, 4))        # матрица нулей\nones = np.ones((2, 3))          # матрица единиц\nfull = np.full((2, 2), 7)       # заполненная значением\neye = np.eye(3)                 # единичная матрица\n\n# Диапазоны\narange = np.arange(0, 10, 2)    # [0, 2, 4, 6, 8]\nlinspace = np.linspace(0, 1, 5) # [0, 0.25, 0.5, 0.75, 1.0]\n\nprint(f"\\nzeros:\\n{zeros}")\nprint(f"linspace: {linspace}")\n\n# Случайные массивы (часто нужны для ML)\nnp.random.seed(42)  # воспроизводимость!\nrand_uniform = np.random.rand(3, 3)       # равномерное [0, 1)\nrand_normal = np.random.randn(3, 3)       # нормальное N(0,1)\nrand_int = np.random.randint(0, 10, (3,3))  # целые [0, 10)\n\nprint(f"\\nСлучайная матрица:\\n{rand_normal.round(2)}")'
        },
        {
          type: 'tip',
          value: 'Всегда устанавливайте np.random.seed() в начале скрипта для воспроизводимости результатов. В ML это особенно важно для сравнения экспериментов.'
        }
      ]
    },
    {
      id: 2,
      title: 'Индексация и срезы',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Выбор элементов массива'
        },
        {
          type: 'text',
          value: 'В ML постоянно нужно выбирать подмножества данных: отдельные признаки, строки по условию, случайные батчи. NumPy предоставляет мощные инструменты индексации.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import numpy as np\n\nA = np.array([[1, 2, 3, 4],\n              [5, 6, 7, 8],\n              [9, 10, 11, 12]])\n\n# Базовая индексация\nprint(f"Элемент [1,2]: {A[1, 2]}")    # 7\nprint(f"Строка 0: {A[0]}")           # [1 2 3 4]\nprint(f"Столбец 1: {A[:, 1]}")       # [2 6 10]\n\n# Срезы\nprint(f"Первые 2 строки:\\n{A[:2]}")\nprint(f"Столбцы 1-2:\\n{A[:, 1:3]}")\n\n# Булева индексация (маска) — КЛЮЧЕВОЕ для ML!\ndata = np.array([10, 25, 30, 15, 40, 5])\nmask = data > 20\nprint(f"\\nМаска: {mask}")               # [F T T F T F]\nprint(f"Элементы > 20: {data[mask]}")   # [25 30 40]\n\n# Fancy indexing\nindices = [0, 2, 4]\nprint(f"Элементы по индексам: {data[indices]}")  # [10 30 40]\n\n# Практика: выборка данных как в ML\nX = np.random.randn(100, 4)  # 100 объектов, 4 признака\ny = np.random.randint(0, 2, 100)  # метки классов\n\n# Выбрать объекты класса 1\nclass_1 = X[y == 1]\nprint(f"\\nОбъектов класса 1: {len(class_1)}")\n\n# Случайная выборка (батч)\nnp.random.seed(42)\nbatch_idx = np.random.choice(100, size=16, replace=False)\nbatch_X = X[batch_idx]\nprint(f"Размер батча: {batch_X.shape}")  # (16, 4)'
        },
        {
          type: 'warning',
          value: 'Срезы NumPy создают представление (view), а не копию! Изменение среза изменит оригинал. Для копии используйте .copy().'
        }
      ]
    },
    {
      id: 3,
      title: 'Операции и broadcasting',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Векторизированные операции и broadcasting'
        },
        {
          type: 'text',
          value: 'Broadcasting — механизм NumPy, позволяющий выполнять операции над массивами разных размеров. Это ключевая концепция для эффективных вычислений в ML: нормализация данных, вычисление расстояний, применение весов.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import numpy as np\n\n# Поэлементные операции (vectorized)\na = np.array([1, 2, 3, 4])\nb = np.array([10, 20, 30, 40])\n\nprint(f"a + b = {a + b}")      # [11 22 33 44]\nprint(f"a * b = {a * b}")      # [10 40 90 160]\nprint(f"a ** 2 = {a ** 2}")    # [1 4 9 16]\nprint(f"np.sqrt(a) = {np.sqrt(a)}")  # [1. 1.41 1.73 2.]\n\n# Broadcasting: скаляр + массив\nprint(f"a + 10 = {a + 10}")    # [11 12 13 14]\nprint(f"a * 2 = {a * 2}")     # [2 4 6 8]\n\n# Broadcasting: вектор + матрица\nX = np.array([[1, 2, 3],\n              [4, 5, 6],\n              [7, 8, 9]])\nmean = np.array([4, 5, 6])  # среднее по столбцам\n\n# Центрирование данных (вычитание среднего)\nX_centered = X - mean  # broadcasting!\nprint(f"Центрированные данные:\\n{X_centered}")\n\n# Нормализация (стандартизация) — часто в ML!\nX_data = np.random.randn(100, 3) * [10, 5, 1] + [100, 50, 0]\nmean = X_data.mean(axis=0)  # среднее по столбцам\nstd = X_data.std(axis=0)    # стд по столбцам\nX_normalized = (X_data - mean) / std  # broadcasting!\n\nprint(f"\\nДо нормализации: mean={X_data.mean(axis=0).round(2)}")\nprint(f"После нормализации: mean={X_normalized.mean(axis=0).round(2)}")\nprint(f"После нормализации: std={X_normalized.std(axis=0).round(2)}")'
        },
        {
          type: 'note',
          value: 'Правило broadcasting: размеры сравниваются справа налево. Измерения совместимы если равны или одно из них = 1. Пример: (3,4) и (4,) совместимы, (3,4) и (3,) — нет.'
        }
      ]
    },
    {
      id: 4,
      title: 'Агрегатные функции и axis',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Вычисления по осям'
        },
        {
          type: 'text',
          value: 'В ML данные представлены как матрица (n_samples, n_features). Часто нужно вычислять статистики по объектам (axis=1) или по признакам (axis=0). Понимание параметра axis критически важно.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import numpy as np\n\n# Матрица данных: 4 объекта, 3 признака\nX = np.array([[10, 20, 30],\n              [40, 50, 60],\n              [70, 80, 90],\n              [25, 35, 45]])\n\n# axis=0: по строкам (сжимаем строки) — статистика по признакам\nprint(f"Среднее по признакам (axis=0): {X.mean(axis=0)}")  # [36.25, 46.25, 56.25]\nprint(f"Макс по признакам: {X.max(axis=0)}")   # [70, 80, 90]\n\n# axis=1: по столбцам (сжимаем столбцы) — статистика по объектам\nprint(f"Среднее по объектам (axis=1): {X.mean(axis=1)}")  # [20, 50, 80, 35]\n\n# Без axis — по всем элементам\nprint(f"Общее среднее: {X.mean()}")  # 46.25\n\n# Полезные функции\nprint(f"\\nСумма по столбцам: {X.sum(axis=0)}")\nprint(f"Кумулятивная сумма: {np.cumsum([1,2,3,4])}")  # [1 3 6 10]\nprint(f"argmax (индекс макс): {X.argmax(axis=1)}")  # [2, 2, 2, 2]\nprint(f"argmin (индекс мин): {X.argmin(axis=0)}")   # [0, 0, 0]\n\n# Практический пример: softmax (из нейросетей)\ndef softmax(x):\n    exp_x = np.exp(x - np.max(x, axis=1, keepdims=True))  # стабильный\n    return exp_x / np.sum(exp_x, axis=1, keepdims=True)\n\nlogits = np.array([[2.0, 1.0, 0.1],\n                   [1.0, 3.0, 0.2]])\nprobs = softmax(logits)\nprint(f"\\nSoftmax:\\n{probs.round(4)}")\nprint(f"Суммы строк: {probs.sum(axis=1)}")  # [1. 1.]'
        },
        {
          type: 'tip',
          value: 'Запомните: axis=0 сжимает строки (результат — по столбцам/признакам), axis=1 сжимает столбцы (результат — по строкам/объектам). keepdims=True сохраняет размерность для broadcasting.'
        }
      ]
    },
    {
      id: 5,
      title: 'Reshape и линейная алгебра в NumPy',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Изменение формы и матричные операции'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import numpy as np\n\n# Reshape — изменение формы массива\na = np.arange(12)\nprint(f"Исходный: {a}")         # [0 1 2 ... 11]\n\nA = a.reshape(3, 4)             # 3 строки, 4 столбца\nprint(f"3x4:\\n{A}")\n\nB = a.reshape(4, -1)            # -1 = вычислить автоматически\nprint(f"4x3:\\n{B}")\n\n# Flatten — развернуть в 1D\nprint(f"Flatten: {A.flatten()}")\n\n# Часто в ML: добавить размерность\nv = np.array([1, 2, 3])\nprint(f"\\nФорма v: {v.shape}")              # (3,)\nprint(f"Столбец: {v.reshape(-1, 1).shape}")  # (3, 1)\nprint(f"Строка: {v.reshape(1, -1).shape}")   # (1, 3)\nprint(f"np.newaxis: {v[:, np.newaxis].shape}")  # (3, 1)\n\n# Конкатенация\nX1 = np.array([[1, 2], [3, 4]])\nX2 = np.array([[5, 6], [7, 8]])\n\nvert = np.vstack([X1, X2])  # вертикально\nhoriz = np.hstack([X1, X2])  # горизонтально\nprint(f"\\nvstack:\\n{vert}")   # (4, 2)\nprint(f"hstack:\\n{horiz}")   # (2, 4)\n\n# Матричные операции\nA = np.random.randn(3, 3)\nprint(f"\\nОпределитель: {np.linalg.det(A):.4f}")\nprint(f"Trace (след): {np.trace(A):.4f}")\neigenvalues = np.linalg.eigvals(A)\nprint(f"Собственные значения: {eigenvalues.round(4)}")'
        },
        {
          type: 'note',
          value: 'reshape(-1, 1) часто нужен в scikit-learn, когда модель ожидает 2D вход, а у вас 1D массив. Ошибка "Expected 2D array, got 1D" — решается reshape.'
        }
      ]
    },
    {
      id: 6,
      title: 'Практика: NumPy для ML задач',
      type: 'practice',
      difficulty: 'medium',
      description: 'Используйте NumPy для реализации базовых ML-операций: нормализация данных, вычисление евклидовых расстояний и реализация простого KNN.',
      requirements: [
        'Создайте матрицу данных X из 5 точек в 2D пространстве: [[1,2], [3,4], [5,6], [8,8], [9,10]]',
        'Нормализуйте данные (Z-score нормализация): X_norm = (X - mean) / std',
        'Вычислите матрицу евклидовых расстояний между всеми парами точек',
        'Для новой точки [4, 5] найдите 2 ближайших соседа из X',
        'Выведите индексы и расстояния до ближайших соседей'
      ],
      hint: 'Евклидово расстояние: d = sqrt(sum((a-b)²)). Для матрицы расстояний можно использовать цикл или broadcasting. np.argsort() поможет найти ближайших соседей.',
      expectedOutput: 'Нормализованные данные:\n...\nМатрица расстояний (5x5):\n...\n2 ближайших соседа для [4, 5]:\nСосед 1: индекс 1, расстояние 1.41\nСосед 2: индекс 2, расстояние 1.41',
      solution: 'import numpy as np\n\n# Данные\nX = np.array([[1, 2], [3, 4], [5, 6], [8, 8], [9, 10]])\n\n# Z-score нормализация\nmean = X.mean(axis=0)\nstd = X.std(axis=0)\nX_norm = (X - mean) / std\nprint(f"Нормализованные данные:\\n{X_norm.round(4)}")\n\n# Матрица евклидовых расстояний\nn = len(X)\ndist_matrix = np.zeros((n, n))\nfor i in range(n):\n    for j in range(n):\n        dist_matrix[i, j] = np.sqrt(np.sum((X[i] - X[j]) ** 2))\nprint(f"\\nМатрица расстояний (5x5):\\n{dist_matrix.round(2)}")\n\n# Ближайшие соседи для новой точки\nnew_point = np.array([4, 5])\ndistances = np.sqrt(np.sum((X - new_point) ** 2, axis=1))\nk = 2\nnearest_idx = np.argsort(distances)[:k]\n\nprint(f"\\n{k} ближайших соседа для {new_point}:")\nfor i, idx in enumerate(nearest_idx):\n    print(f"Сосед {i+1}: индекс {idx}, расстояние {distances[idx]:.2f}")',
      explanation: 'Z-score нормализация приводит каждый признак к среднему 0 и стд 1, что важно для алгоритмов, чувствительных к масштабу (KNN, SVM, нейросети). Евклидово расстояние — мера "прямолинейной" близости между точками. np.argsort() возвращает индексы, которые отсортировали бы массив, что позволяет найти K ближайших точек.'
    }
  ]
}
