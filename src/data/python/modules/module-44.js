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
        { type: 'code', language: 'python', value: 'import numpy as np\n\na = np.array([10, 20, 30, 40, 50, 60, 70, 80])\n\n# Массив индексов\nidx = np.array([0, 3, 5, 7])\nprint(a[idx])  # [10 40 60 80]\n\n# Произвольный порядок и повторения\nprint(a[[7, 0, 3, 3]])  # [80 10 40 40]\n\n# 2D fancy indexing\nmatrix = np.array([[1, 2], [3, 4], [5, 6], [7, 8]])\nrows = np.array([0, 2, 3])\nprint(matrix[rows])  # строки 0, 2, 3\n# [[1 2]\n#  [5 6]\n#  [7 8]]\n\n# Выбор конкретных элементов (row, col)\nrow_idx = np.array([0, 1, 2])\ncol_idx = np.array([1, 0, 1])\nprint(matrix[row_idx, col_idx])  # [2 3 6] — элементы (0,1), (1,0), (2,1)\n\n# Fancy indexing возвращает копию\nresult = a[idx]\nresult[0] = 999\nprint(a[0])  # 10 — оригинал не изменился\n\n# Изменение через fancy indexing\na[[1, 3]] = 0\nprint(a)  # [10  0 30  0 50 60 70 80]' }
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
        { type: 'code', language: 'python', value: 'import numpy as np\n\na = np.array([3, 1, 4, 1, 5, 9, 2, 6])\n\n# Сортировка\nprint(np.sort(a))      # [1 1 2 3 4 5 6 9] — копия\nprint(np.sort(a)[::-1])  # [9 6 5 4 3 2 1 1] — убывание\n\n# argsort — индексы для сортировки\nidx = np.argsort(a)\nprint(idx)     # [1 3 6 0 2 4 7 5]\nprint(a[idx])  # [1 1 2 3 4 5 6 9] — то же что sort\n\n# Пример: получить топ-3 наибольших\ntop3_idx = np.argsort(a)[-3:][::-1]\nprint(a[top3_idx])  # [9 6 5]\n\n# 2D сортировка\nmatrix = np.array([[3, 1, 2], [6, 4, 5]])\nprint(np.sort(matrix, axis=1))  # Сортировка в каждой строке\n# [[1 2 3]\n#  [4 5 6]]\n\n# Поиск\nprint(np.searchsorted([1, 2, 3, 5, 7], 4))  # 3 — позиция вставки\nprint(np.unique(a))             # [1 2 3 4 5 6 9] — уникальные\nvals, counts = np.unique(a, return_counts=True)\nprint(counts)  # [2 1 1 1 1 1 1] — количество вхождений' }
      ]
    },
    {
      id: 5,
      title: 'Объединение и разделение массивов',
      type: 'theory',
      content: [
        { type: 'text', value: 'np.concatenate, np.stack, np.hstack, np.vstack — объединяют массивы. np.split разделяет массив на части.' },
        { type: 'code', language: 'python', value: 'import numpy as np\n\na = np.array([[1, 2], [3, 4]])\nb = np.array([[5, 6], [7, 8]])\n\n# concatenate — объединение по оси\nprint(np.concatenate([a, b], axis=0))  # Вертикально (4x2)\n# [[1 2]\n#  [3 4]\n#  [5 6]\n#  [7 8]]\n\nprint(np.concatenate([a, b], axis=1))  # Горизонтально (2x4)\n# [[1 2 5 6]\n#  [3 4 7 8]]\n\n# Удобные сокращения\nprint(np.vstack([a, b]))  # Вертикально (vertical stack)\nprint(np.hstack([a, b]))  # Горизонтально (horizontal stack)\n\n# stack — добавляет новое измерение\nstacked = np.stack([a, b])  # shape (2, 2, 2)\nprint(stacked.shape)\n\n# split — разделение\nx = np.arange(12).reshape(3, 4)\nparts = np.hsplit(x, 2)  # Делит по горизонтали на 2 части\nprint(parts[0].shape)    # (3, 2)\nprint(parts[1].shape)    # (3, 2)\n\n# vsplit — вертикальное разделение\nrows = np.vsplit(x, 3)\nprint(rows[0])  # [[0 1 2 3]]' }
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
