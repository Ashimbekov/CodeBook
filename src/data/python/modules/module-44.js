export default {
  id: 44,
  title: 'NumPy: продвинутый',
  description: 'Broadcasting, fancy indexing, булева маска, сортировка и продвинутые операции с массивами',
  lessons: [
    {
      id: 1,
      title: 'Broadcasting: правила и примеры',
      type: 'theory',
      content: [
        { type: 'text', value: 'Broadcasting позволяет выполнять операции над массивами разных форм. NumPy автоматически "растягивает" меньший массив до формы большего без копирования данных.' },
        { type: 'code', language: 'python', value: 'import numpy as np\n\n# Правило broadcasting: размеры совместимы если они равны или один из них = 1\n\n# Скаляр + массив (самый простой случай)\na = np.array([1, 2, 3, 4])\nprint(a + 10)  # [11 12 13 14] — 10 "растянут" до [10, 10, 10, 10]\n\n# 1D + 2D\nmatrix = np.array([[1, 2, 3],\n                   [4, 5, 6]])\nrow = np.array([10, 20, 30])  # shape (3,)\nprint(matrix + row)\n# [[11 22 33]\n#  [14 25 36]] — row добавляется к каждой строке\n\n# Столбец (2,1) + строка (1,3)\ncol = np.array([[10], [20]])  # shape (2, 1)\nprint(col + row)  # (2, 3) результат\n# [[20 30 40]\n#  [30 40 50]]\n\n# Практический пример: центрирование данных\ndata = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])\nmeans = data.mean(axis=0)  # среднее по столбцам\ncentered = data - means     # broadcasting вычитает среднее\nprint(centered.mean(axis=0))  # [~0. ~0. ~0.]' },
        { type: 'tip', value: 'Выравнивание форм происходит справа налево. Форма (3,) совместима с (2, 3) — NumPy добавляет ось слева: (1, 3) -> (2, 3).' }
      ]
    },
    {
      id: 2,
      title: 'Fancy indexing: индексирование массивами',
      type: 'theory',
      content: [
        { type: 'text', value: 'Fancy indexing — выбор элементов с помощью массива индексов. В отличие от срезов, всегда возвращает копию данных.' },
        { type: 'code', language: 'python', value: 'import numpy as np\n\na = np.array([10, 20, 30, 40, 50, 60, 70, 80])\n\n# Массив индексов\nidx = np.array([0, 3, 5, 7])\nprint(a[idx])  # [10 40 60 80]\n\n# Произвольный порядок и повторения\nprint(a[[7, 0, 3, 3]])  # [80 10 40 40]\n\n# 2D fancy indexing\nmatrix = np.array([[1, 2], [3, 4], [5, 6], [7, 8]])\nrows = np.array([0, 2, 3])\nprint(matrix[rows])  # строки 0, 2, 3\n# [[1 2]\n#  [5 6]\n#  [7 8]]\n\n# Выбор конкретных элементов (row, col)\nrow_idx = np.array([0, 1, 2])\ncol_idx = np.array([1, 0, 1])\nprint(matrix[row_idx, col_idx])  # [2 3 6] — элементы (0,1), (1,0), (2,1)\n\n# Fancy indexing возвращает копию\nresult = a[idx]\nresult[0] = 999\nprint(a[0])  # 10 — оригинал не изменился\n\n# Изменение через fancy indexing\na[[1, 3]] = 0\nprint(a)  # [10  0 30  0 50 60 70 80]' },
        { type: 'heading', value: 'np.take, np.put и работа с np.ix_' },
        { type: 'code', language: 'python', value: 'import numpy as np\n\nmatrix = np.array([[1, 2, 3],\n                   [4, 5, 6],\n                   [7, 8, 9]])\n\n# np.take — fancy indexing с указанием оси\nprint(np.take(matrix, [0, 2], axis=0))  # строки 0 и 2\n# [[1 2 3]\n#  [7 8 9]]\n\n# np.ix_ — создаёт сетку индексов для выбора подматрицы\nrows = np.array([0, 2])\ncols = np.array([1, 2])\nix = np.ix_(rows, cols)  # сетка индексов\nprint(matrix[ix])\n# [[2 3]\n#  [8 9]]\n\n# Применение: выбрать топ-K элементов в каждой строке\na = np.array([[5, 1, 8, 3],\n              [2, 9, 4, 7]])\nk = 2\ntopk_indices = np.argsort(a, axis=1)[:, -k:]\nprint(topk_indices)  # индексы двух наибольших элементов в каждой строке\n# [[0 2]  <- 5 и 8\n#  [3 1]] <- 7 и 9\n\n# np.put — изменяет элементы по индексам (in-place)\nb = np.arange(10)\nnp.put(b, [0, 5, 9], [100, 500, 900])\nprint(b)  # [100   1   2   3   4 500   6   7   8 900]' },
        { type: 'tip', value: 'np.ix_ создаёт открытую сетку для выбора подматрицы по строкам и столбцам одновременно. Это более читаемая альтернатива ручному созданию индексных массивов.' }
      ]
    },
    {
      id: 3,
      title: 'Булева маска и where',
      type: 'theory',
      content: [
        { type: 'text', value: 'Булево индексирование фильтрует элементы по условию. np.where позволяет выбирать между двумя массивами поэлементно.' },
        { type: 'code', language: 'python', value: 'import numpy as np\n\na = np.array([5, -3, 8, -1, 0, 12, -7, 4])\n\n# Булева маска\nmask = a > 0\nprint(mask)   # [ True False  True False False  True False  True]\nprint(a[mask])  # [ 5  8 12  4] — только положительные\n\n# Составные условия\nprint(a[(a > 0) & (a < 10)])  # [5 8 4]\nprint(a[(a < 0) | (a > 10)])  # [-3 -1 12 -7]\n\n# np.where(condition, x, y) — выбор поэлементно\nresult = np.where(a > 0, a, 0)  # положительные или 0\nprint(result)  # [5 0 8 0 0 12 0 4]\n\nresult2 = np.where(a > 0, \'pos\', \'non-pos\')\nprint(result2)  # [\'pos\' \'non-pos\' ...]\n\n# Замена значений по условию\nb = a.copy()\nb[b < 0] = 0\nprint(b)  # [5 0 8 0 0 12 0 4]\n\n# np.any и np.all\nprint(np.any(a > 10))   # True — есть хотя бы одно > 10\nprint(np.all(a > 0))    # False — не все > 0\n\n# Подсчёт элементов по условию\nprint(np.sum(a > 0))    # 4 — количество положительных\nprint(np.count_nonzero(a))  # 7 — ненулевые элементы' },
        { type: 'tip', value: 'Используй & (и) и | (или) вместо and/or для поэлементных булевых операций. Обязательно оборачивай условия в скобки из-за приоритета операторов.' }
      ]
    },
    {
      id: 4,
      title: 'Сортировка и поиск',
      type: 'theory',
      content: [
        { type: 'text', value: 'np.sort возвращает отсортированную копию, a.sort() сортирует на месте. np.argsort возвращает индексы сортировки.' },
        { type: 'code', language: 'python', value: 'import numpy as np\n\na = np.array([3, 1, 4, 1, 5, 9, 2, 6])\n\n# Сортировка\nprint(np.sort(a))      # [1 1 2 3 4 5 6 9] — копия\nprint(np.sort(a)[::-1])  # [9 6 5 4 3 2 1 1] — убывание\n\n# argsort — индексы для сортировки\nidx = np.argsort(a)\nprint(idx)     # [1 3 6 0 2 4 7 5]\nprint(a[idx])  # [1 1 2 3 4 5 6 9] — то же что sort\n\n# Пример: получить топ-3 наибольших\ntop3_idx = np.argsort(a)[-3:][::-1]\nprint(a[top3_idx])  # [9 6 5]\n\n# 2D сортировка\nmatrix = np.array([[3, 1, 2], [6, 4, 5]])\nprint(np.sort(matrix, axis=1))  # Сортировка в каждой строке\n# [[1 2 3]\n#  [4 5 6]]\n\n# Поиск\nprint(np.searchsorted([1, 2, 3, 5, 7], 4))  # 3 — позиция вставки\nprint(np.unique(a))             # [1 2 3 4 5 6 9] — уникальные\nvals, counts = np.unique(a, return_counts=True)\nprint(counts)  # [2 1 1 1 1 1 1] — количество вхождений' },
        { type: 'heading', value: 'np.partition и эффективный поиск экстремумов' },
        { type: 'code', language: 'python', value: 'import numpy as np\n\n# np.partition — частичная сортировка (быстрее полной для топ-K)\na = np.array([3, 7, 1, 9, 4, 5, 2, 8, 6])\n\n# Получить K наименьших (порядок внутри не гарантирован)\nk = 3\npartitioned = np.partition(a, k)\nprint(partitioned[:k])   # 3 наименьших: [1 2 3] (не обязательно отсортированы)\n\n# Получить K наибольших\nprint(np.partition(a, -k)[-k:])  # [7 8 9] — 3 наибольших\n\n# argpartition — индексы K наибольших\ntopk_idx = np.argpartition(a, -k)[-k:]\nprint(a[topk_idx])  # [7 8 9]\n\n# Сортировка сложных объектов через structured array\nstudents = np.array([\n    ("Алиса", 92),\n    ("Боб", 78),\n    ("Вера", 88),\n], dtype=[(\'name\', "U10"), (\'score\', int)])\n\n# Сортировка по полю score\nsorted_students = np.sort(students, order="score")\nfor s in sorted_students[::-1]:\n    print(f"{s[\'name\']}: {s[\'score\']}")\n# Алиса: 92\n# Вера: 88\n# Боб: 78' },
        { type: 'note', value: 'np.partition работает за O(n) в среднем вместо O(n log n) для полной сортировки. Используй его когда нужны только K экстремальных значений, не вся отсортированная последовательность.' }
      ]
    },
    {
      id: 5,
      title: 'Объединение и разделение массивов',
      type: 'theory',
      content: [
        { type: 'text', value: 'np.concatenate, np.stack, np.hstack, np.vstack — объединяют массивы. np.split разделяет массив на части.' },
        { type: 'code', language: 'python', value: 'import numpy as np\n\na = np.array([[1, 2], [3, 4]])\nb = np.array([[5, 6], [7, 8]])\n\n# concatenate — объединение по оси\nprint(np.concatenate([a, b], axis=0))  # Вертикально (4x2)\n# [[1 2]\n#  [3 4]\n#  [5 6]\n#  [7 8]]\n\nprint(np.concatenate([a, b], axis=1))  # Горизонтально (2x4)\n# [[1 2 5 6]\n#  [3 4 7 8]]\n\n# Удобные сокращения\nprint(np.vstack([a, b]))  # Вертикально (vertical stack)\nprint(np.hstack([a, b]))  # Горизонтально (horizontal stack)\n\n# stack — добавляет новое измерение\nstacked = np.stack([a, b])  # shape (2, 2, 2)\nprint(stacked.shape)\n\n# split — разделение\nx = np.arange(12).reshape(3, 4)\nparts = np.hsplit(x, 2)  # Делит по горизонтали на 2 части\nprint(parts[0].shape)    # (3, 2)\nprint(parts[1].shape)    # (3, 2)\n\n# vsplit — вертикальное разделение\nrows = np.vsplit(x, 3)\nprint(rows[0])  # [[0 1 2 3]]' },
        { type: 'heading', value: 'np.tile, np.repeat и работа с блоками' },
        { type: 'code', language: 'python', value: 'import numpy as np\n\na = np.array([1, 2, 3])\n\n# np.repeat — повторить каждый элемент\nprint(np.repeat(a, 3))      # [1 1 1 2 2 2 3 3 3]\nprint(np.repeat(a, [1,2,3]))  # [1 2 2 3 3 3] — разное число повторений\n\n# np.tile — повторить весь массив\nprint(np.tile(a, 3))        # [1 2 3 1 2 3 1 2 3]\nprint(np.tile(a, (2, 3)))   # 2 строки, каждая повторена 3 раза\n# [[1 2 3 1 2 3 1 2 3]\n#  [1 2 3 1 2 3 1 2 3]]\n\n# np.block — объединение блоков в матрицу\nA = np.eye(2)\nB = np.zeros((2, 3))\nC = np.ones((3, 2))\nD = np.full((3, 3), 2)\n\nblock = np.block([[A, B], [C, D]])\nprint(block.shape)  # (5, 5)\nprint(block)\n# [[1. 0. 0. 0. 0.]\n#  [0. 1. 0. 0. 0.]\n#  [1. 1. 2. 2. 2.]\n#  [1. 1. 2. 2. 2.]\n#  [1. 1. 2. 2. 2.]]' },
        { type: 'tip', value: 'np.block удобен для составления блочных матриц в линейной алгебре. np.tile используй для создания паттернов или дублирования небольших массивов для broadcast операций.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Broadcasting и fancy indexing',
      type: 'practice',
      difficulty: 'medium',
      description: 'Примени продвинутые техники NumPy для обработки данных о студентах.',
      requirements: [
        'Создай матрицу оценок 5 студентов x 4 предмета (случайные int от 60 до 100, seed=10)',
        'Используя broadcasting, вычти среднее по каждому предмету (нормализация по столбцам)',
        'Найди с помощью булевой маски всех студентов, у кого хотя бы одна оценка < 70',
        'Используй fancy indexing: отобрази оценки только для студентов 0, 2, 4',
        'Найди индекс лучшего студента (с наибольшей суммой оценок) через argsort',
        'Создай булев массив: True если средняя оценка студента >= 80'
      ],
      expectedOutput: 'Матрица оценок:\n[[...], ...]\nСтуденты с оценкой < 70: [...]\nОценки студентов 0, 2, 4:\n[[...], ...]\nЛучший студент: индекс N\nСтуденты с средним >= 80: [True/False ...]',
      hint: 'Для нормализации: grades - grades.mean(axis=0). Для студентов с оценкой < 70: np.any(grades < 70, axis=1). argsort даёт возрастающий порядок — нужен последний элемент.',
      solution: 'import numpy as np\n\nrng = np.random.default_rng(10)\ngrades = rng.integers(60, 101, (5, 4))\nprint("Матрица оценок:")\nprint(grades)\n\nnormalized = grades - grades.mean(axis=0)\nprint("Нормализованные:")\nprint(normalized.round(2))\n\nlow_mask = np.any(grades < 70, axis=1)\nprint(f"Студенты с оценкой < 70: {np.where(low_mask)[0]}")\n\nselected = grades[[0, 2, 4]]\nprint("Оценки студентов 0, 2, 4:")\nprint(selected)\n\ntotals = grades.sum(axis=1)\nbest = np.argsort(totals)[-1]\nprint(f"Лучший студент: индекс {best}")\n\nhigh_avg = grades.mean(axis=1) >= 80\nprint(f"Студенты с средним >= 80: {high_avg}")',
      explanation: 'np.any(grades < 70, axis=1) проверяет условие по строкам — True если хотя бы один элемент строки удовлетворяет условию. np.where(mask)[0] возвращает индексы True-элементов. argsort()[-1] — индекс наибольшего элемента.'
    }
  ]
}
