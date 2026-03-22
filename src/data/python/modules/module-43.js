export default {
  id: 43,
  title: 'NumPy: основы',
  description: 'ndarray, shape, dtype, базовые операции с массивами — фундамент научных вычислений в Python',
  lessons: [
    {
      id: 1,
      title: 'Что такое NumPy и зачем он нужен',
      type: 'theory',
      content: [
        { type: 'text', value: 'NumPy (Numerical Python) — главная библиотека для численных вычислений в Python. Основа для Pandas, Matplotlib, Scikit-learn и большинства других Data Science инструментов.' },
        { type: 'code', language: 'python', value: 'import numpy as np\n\n# Почему NumPy быстрее обычных списков?\n# Python список: каждый элемент - отдельный объект в памяти\npy_list = [1, 2, 3, 4, 5]\n\n# NumPy массив: непрерывный блок памяти одного типа\nnp_array = np.array([1, 2, 3, 4, 5])\n\nprint(type(py_list))    # <class \'list\'>\nprint(type(np_array))   # <class \'numpy.ndarray\'>\n\n# Скорость: NumPy в 50-100 раз быстрее при векторных операциях\nimport time\n\nsize = 1_000_000\npy = list(range(size))\nnp_arr = np.arange(size)\n\nstart = time.time()\nresult = [x * 2 for x in py]\nprint(f"Список: {time.time() - start:.4f}s")\n\nstart = time.time()\nresult = np_arr * 2\nprint(f"NumPy: {time.time() - start:.4f}s")' },
        { type: 'tip', value: 'Всегда импортируй NumPy как np — это общепринятое соглашение во всём сообществе Data Science.' }
      ]
    },
    {
      id: 2,
      title: 'Создание ndarray',
      type: 'theory',
      content: [
        { type: 'text', value: 'ndarray (N-dimensional array) — основной объект NumPy. Создаётся из списков, через специальные функции или генераторы.' },
        { type: 'code', language: 'python', value: 'import numpy as np\n\n# Из списка\na = np.array([1, 2, 3, 4, 5])\nprint(a)  # [1 2 3 4 5]\n\n# Из вложенного списка (2D массив)\nb = np.array([[1, 2, 3], [4, 5, 6]])\nprint(b)\n# [[1 2 3]\n#  [4 5 6]]\n\n# Специальные массивы\nzeros = np.zeros((3, 4))      # Нули формы 3x4\nones = np.ones((2, 3))        # Единицы\nfull = np.full((2, 2), 7)     # Заполнить числом 7\neye = np.eye(3)               # Единичная матрица 3x3\n\n# Диапазоны\nrange_arr = np.arange(0, 10, 2)    # [0 2 4 6 8]\nlinspace = np.linspace(0, 1, 5)    # 5 равномерных точек от 0 до 1\n\n# Случайные\nrng = np.random.default_rng(42)    # seed для воспроизводимости\nrand = rng.random((3, 3))          # Случайные float от 0 до 1\nrint = rng.integers(1, 10, (3, 3)) # Случайные int от 1 до 9\n\nprint(linspace)  # [0.   0.25 0.5  0.75 1.  ]' },
        { type: 'note', value: 'np.arange работает как range(), а np.linspace задаёт количество точек (включая конечную). Для Data Science чаще используется linspace.' }
      ]
    },
    {
      id: 3,
      title: 'shape, ndim, size, dtype',
      type: 'theory',
      content: [
        { type: 'text', value: 'Атрибуты массива описывают его структуру. shape — кортеж размеров, ndim — количество измерений, size — общее число элементов, dtype — тип данных.' },
        { type: 'code', language: 'python', value: 'import numpy as np\n\na = np.array([[1, 2, 3], [4, 5, 6]])\n\nprint(a.shape)   # (2, 3) — 2 строки, 3 столбца\nprint(a.ndim)    # 2 — двумерный массив\nprint(a.size)    # 6 — всего 6 элементов\nprint(a.dtype)   # int64 — тип данных\n\n# Разные dtype\nfloat_arr = np.array([1.0, 2.5, 3.7])\nprint(float_arr.dtype)  # float64\n\nbool_arr = np.array([True, False, True])\nprint(bool_arr.dtype)  # bool\n\n# Явное указание dtype\nint32_arr = np.array([1, 2, 3], dtype=np.int32)\ncomplex_arr = np.array([1+2j, 3+4j], dtype=np.complex128)\n\n# itemsize — байт на элемент\nprint(int32_arr.itemsize)    # 4 (байта)\nprint(float_arr.itemsize)    # 8 (байта)\n\n# nbytes — общий размер в байтах\nprint(a.nbytes)  # 48 (6 элементов * 8 байт)' },
        { type: 'tip', value: 'int32 занимает вдвое меньше памяти чем int64. Для больших датасетов выбор dtype существенно влияет на производительность.' }
      ]
    },
    {
      id: 4,
      title: 'Индексирование и срезы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Индексирование в NumPy похоже на списки, но расширено для многомерных массивов. Срезы возвращают представление (view), а не копию.' },
        { type: 'code', language: 'python', value: 'import numpy as np\n\na = np.array([[10, 20, 30],\n              [40, 50, 60],\n              [70, 80, 90]])\n\n# Обращение к элементу\nprint(a[0, 1])    # 20 — строка 0, столбец 1\nprint(a[2, 2])    # 90\n\n# Срезы [строки, столбцы]\nprint(a[0, :])    # [10 20 30] — вся первая строка\nprint(a[:, 1])    # [20 50 80] — весь второй столбец\nprint(a[1:, 1:])  # Подматрица 2x2 из нижнего правого угла\n\n# Изменение через срез (view)\nview = a[:2, :2]\nview[0, 0] = 999\nprint(a[0, 0])    # 999 — оригинал изменился!\n\n# Копия через .copy()\ncopy = a[:2, :2].copy()\ncopy[0, 0] = 0\nprint(a[0, 0])    # 999 — оригинал не изменился\n\n# 1D срезы\nb = np.arange(10)\nprint(b[2:7])     # [2 3 4 5 6]\nprint(b[::2])     # [0 2 4 6 8] — каждый второй\nprint(b[::-1])    # [9 8 7 6 5 4 3 2 1 0] — реверс' },
        { type: 'heading', value: 'Булево индексирование и fancy indexing' },
        { type: 'code', language: 'python', value: 'import numpy as np\n\na = np.array([[10, 20, 30],\n              [40, 50, 60],\n              [70, 80, 90]])\n\n# Булево индексирование\nmask = a > 40\nprint(mask)\n# [[False False False]\n#  [False  True  True]\n#  [ True  True  True]]\nprint(a[mask])   # [50 60 70 80 90] — плоский массив элементов где True\n\n# Условие прямо в индексе\nprint(a[a % 30 == 0])  # [30 60 90] — кратные 30\n\n# Изменение через маску\na[a > 80] = 0\nprint(a)\n# [[10 20 30]\n#  [40 50 60]\n#  [70  0  0]]\n\n# Fancy indexing — индексирование массивом индексов\nb = np.array([10, 20, 30, 40, 50])\nindices = np.array([0, 2, 4])\nprint(b[indices])  # [10 30 50]\n\n# 2D fancy indexing\nrows = np.array([0, 2])\ncols = np.array([1, 2])\nprint(a[rows, cols])  # [20, 0] — элементы (0,1) и (2,2)' },
        { type: 'tip', value: 'np.where(condition, x, y) — аналог тернарного оператора для массивов: где condition True — берём x, где False — y. Например: np.where(a > 50, a, 0) заменяет значения <= 50 на ноль.' }
      ]
    },
    {
      id: 5,
      title: 'reshape и изменение формы',
      type: 'theory',
      content: [
        { type: 'text', value: 'reshape изменяет форму массива без копирования данных (если возможно). flatten и ravel преобразуют в 1D. transpose меняет оси местами.' },
        { type: 'code', language: 'python', value: 'import numpy as np\n\na = np.arange(12)  # [0 1 2 ... 11]\n\n# reshape — изменить форму\nb = a.reshape(3, 4)   # 3x4 матрица\nprint(b)\n# [[ 0  1  2  3]\n#  [ 4  5  6  7]\n#  [ 8  9 10 11]]\n\nc = a.reshape(2, 2, 3)  # 3D массив 2x2x3\nprint(c.shape)  # (2, 2, 3)\n\n# -1 — автоматический расчёт размера\nd = a.reshape(4, -1)   # 4x3\nprint(d.shape)  # (4, 3)\n\n# flatten — всегда возвращает копию\nflat = b.flatten()\nprint(flat)  # [ 0  1  2  3  4  5  6  7  8  9 10 11]\n\n# ravel — возвращает view если возможно\nraveled = b.ravel()\n\n# transpose — транспонирование\nmatrix = np.array([[1, 2, 3], [4, 5, 6]])\nprint(matrix.T)      # .T — сокращённая запись\nprint(matrix.T.shape)  # (3, 2)\n\n# newaxis — добавить измерение\nv = np.array([1, 2, 3])\nprint(v.shape)           # (3,)\nprint(v[:, np.newaxis].shape)  # (3, 1) — вектор-столбец\nprint(v[np.newaxis, :].shape)  # (1, 3) — вектор-строка' },
        { type: 'tip', value: 'Используй -1 в reshape когда нужно сохранить одно измерение и автоматически вычислить другое. Например, a.reshape(-1, 1) всегда даёт столбец.' }
      ]
    },
    {
      id: 6,
      title: 'Базовые математические операции',
      type: 'theory',
      content: [
        { type: 'text', value: 'NumPy выполняет операции поэлементно. Стандартные арифметические операторы работают с массивами напрямую. Universal Functions (ufunc) — оптимизированные операции.' },
        { type: 'code', language: 'python', value: 'import numpy as np\n\na = np.array([1, 2, 3, 4])\nb = np.array([10, 20, 30, 40])\n\n# Поэлементные операции\nprint(a + b)    # [11 22 33 44]\nprint(b - a)    # [ 9 18 27 36]\nprint(a * b)    # [ 10  40  90 160]\nprint(b / a)    # [10. 10. 10. 10.]\nprint(a ** 2)   # [ 1  4  9 16]\nprint(b % 30)   # [10 20  0 10]\n\n# Скалярные операции (broadcasting)\nprint(a + 10)   # [11 12 13 14]\nprint(a * 3)    # [ 3  6  9 12]\n\n# Универсальные функции\nprint(np.sqrt(a))          # [1.   1.414 1.732 2.   ]\nprint(np.exp(a))           # [e, e^2, e^3, e^4]\nprint(np.log(a))           # [0.    0.693 1.099 1.386]\nprint(np.sin(np.pi / 2))  # 1.0\nprint(np.abs(np.array([-1, -2, 3])))  # [1 2 3]\n\n# Матричное умножение (dot product)\nA = np.array([[1, 2], [3, 4]])\nB = np.array([[5, 6], [7, 8]])\nprint(np.dot(A, B))  # или A @ B\n# [[19 22]\n#  [43 50]]' },
        { type: 'heading', value: 'Broadcasting: операции с разными формами' },
        { type: 'code', language: 'python', value: 'import numpy as np\n\n# Broadcasting позволяет операции над массивами разных форм\n# Правило: размеры совместимы если равны или один из них = 1\n\n# Добавление вектора-строки к матрице\nmatrix = np.array([[1, 2, 3],\n                   [4, 5, 6]])\nvector = np.array([10, 20, 30])  # форма (3,)\n\nresult = matrix + vector  # вектор добавляется к каждой строке\nprint(result)\n# [[11 22 33]\n#  [14 25 36]]\n\n# Добавление вектора-столбца\ncol = np.array([[100], [200]])  # форма (2, 1)\nresult2 = matrix + col  # добавляется к каждому столбцу\nprint(result2)\n# [[101 102 103]\n#  [204 205 206]]\n\n# Нормализация строк матрицы\nrow_sums = matrix.sum(axis=1, keepdims=True)  # форма (2, 1)\nnormalized = matrix / row_sums\nprint(normalized)\n# [[0.167 0.333 0.5  ]\n#  [0.267 0.333 0.4  ]]' },
        { type: 'note', value: 'keepdims=True сохраняет количество измерений после агрегации: sum(axis=1) даст форму (n,), а sum(axis=1, keepdims=True) — (n, 1). Второе нужно для broadcasting при делении строки на её сумму.' }
      ]
    },
    {
      id: 7,
      title: 'Агрегатные функции и статистика',
      type: 'theory',
      content: [
        { type: 'text', value: 'NumPy предоставляет богатый набор агрегатных функций: sum, mean, std, min, max и другие. Параметр axis задаёт ось агрегации.' },
        { type: 'code', language: 'python', value: 'import numpy as np\n\na = np.array([[1, 2, 3],\n              [4, 5, 6],\n              [7, 8, 9]])\n\n# Глобальные агрегации\nprint(np.sum(a))     # 45\nprint(np.mean(a))    # 5.0\nprint(np.std(a))     # 2.58...\nprint(np.var(a))     # 6.666...\nprint(np.min(a))     # 1\nprint(np.max(a))     # 9\nprint(np.median(a))  # 5.0\n\n# По осям: axis=0 — по строкам (вниз), axis=1 — по столбцам (вправо)\nprint(np.sum(a, axis=0))   # [12 15 18] — сумма по столбцам\nprint(np.sum(a, axis=1))   # [ 6 15 24] — сумма по строкам\nprint(np.mean(a, axis=0))  # [4. 5. 6.]\nprint(np.max(a, axis=1))   # [3 6 9]\n\n# Индексы min/max\nprint(np.argmin(a))   # 0 — индекс минимума (глобальный)\nprint(np.argmax(a))   # 8 — индекс максимума\nprint(np.argmax(a, axis=1))  # [2 2 2] — столбец с максимумом в каждой строке\n\n# Накопительные суммы\nprint(np.cumsum(a, axis=1))\n# [[ 1  3  6]\n#  [ 4  9 15]\n#  [ 7 15 24]]\n\n# Квантили и перцентили\nprint(np.percentile(a, 75))  # 7.0' },
        { type: 'tip', value: 'Запомни правило: axis=0 агрегирует "вниз" (уменьшает количество строк), axis=1 агрегирует "вправо" (уменьшает количество столбцов).' }
      ]
    },
    {
      id: 8,
      title: 'Практика: Работа с ndarray',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создай и обработай NumPy массивы: вычисли статистику, измени форму и выполни операции.',
      requirements: [
        'Создай матрицу 4x5 из случайных целых чисел от 1 до 100 (используй seed=42)',
        'Выведи: shape, dtype, общую сумму, среднее значение, максимум',
        'Найди сумму по каждому столбцу и среднее по каждой строке',
        'Преобразуй матрицу в 1D массив, затем в форму 5x4',
        'Выбери элементы больше 50 через булево индексирование',
        'Нормализуй матрицу: (x - min) / (max - min), все значения должны быть в [0, 1]'
      ],
      expectedOutput: 'shape: (4, 5)\ndtype: int64\nСумма: ...\nСреднее: ...\nМаксимум: ...\nЭлементы > 50: [...]\nМин после нормализации: 0.0\nМакс после нормализации: 1.0',
      hint: 'Для булева индексирования: matrix[matrix > 50]. Нормализация: (matrix - matrix.min()) / (matrix.max() - matrix.min()).',
      solution: 'import numpy as np\n\nrng = np.random.default_rng(42)\nmatrix = rng.integers(1, 101, (4, 5))\n\nprint(f"shape: {matrix.shape}")\nprint(f"dtype: {matrix.dtype}")\nprint(f"Сумма: {np.sum(matrix)}")\nprint(f"Среднее: {np.mean(matrix):.2f}")\nprint(f"Максимум: {np.max(matrix)}")\n\nprint(f"Сумма по столбцам: {np.sum(matrix, axis=0)}")\nprint(f"Среднее по строкам: {np.mean(matrix, axis=1)}")\n\nflat = matrix.flatten()\nreshaped = flat.reshape(5, 4)\nprint(f"Форма 1D: {flat.shape}, форма 5x4: {reshaped.shape}")\n\nbig = matrix[matrix > 50]\nprint(f"Элементы > 50: {big}")\n\nnormalized = (matrix - matrix.min()) / (matrix.max() - matrix.min())\nprint(f"Мин после нормализации: {normalized.min():.1f}")\nprint(f"Макс после нормализации: {normalized.max():.1f}")',
      explanation: 'default_rng(42) создаёт воспроизводимый генератор. Булево индексирование matrix[matrix > 50] автоматически выбирает подходящие элементы. Нормализация приводит данные к диапазону [0, 1] — стандартная операция в ML.'
    }
  ]
}
