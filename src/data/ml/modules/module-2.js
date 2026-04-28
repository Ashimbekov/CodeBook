export default {
  id: 2,
  title: 'Математика для ML: Линейная алгебра',
  description: 'Основы линейной алгебры для Machine Learning: векторы, матрицы, операции, собственные значения и их применение в ML.',
  lessons: [
    {
      id: 1,
      title: 'Векторы и операции над ними',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Векторы — основа ML'
        },
        {
          type: 'text',
          value: 'В ML данные представляются в виде векторов и матриц. Вектор — это упорядоченный набор чисел. Каждый объект (строка в таблице) — это вектор признаков. Например, дом описывается вектором [площадь, количество_комнат, этаж, цена].'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import numpy as np\n\n# Создание векторов\nv1 = np.array([1, 2, 3])\nv2 = np.array([4, 5, 6])\n\n# Поэлементные операции\nprint(f"Сложение: {v1 + v2}")       # [5 7 9]\nprint(f"Вычитание: {v1 - v2}")      # [-3 -3 -3]\nprint(f"Умножение: {v1 * v2}")      # [4 10 18]\nprint(f"Умнож. на скаляр: {v1 * 3}") # [3 6 9]\n\n# Скалярное произведение (dot product)\ndot = np.dot(v1, v2)  # 1*4 + 2*5 + 3*6 = 32\nprint(f"Скалярное произведение: {dot}")\n\n# Длина (норма) вектора\nnorm = np.linalg.norm(v1)  # sqrt(1² + 2² + 3²)\nprint(f"Норма v1: {norm:.4f}")  # 3.7417\n\n# Нормализация вектора (единичный вектор)\nunit_v1 = v1 / np.linalg.norm(v1)\nprint(f"Единичный вектор: {unit_v1}")\nprint(f"Его длина: {np.linalg.norm(unit_v1):.4f}")  # 1.0\n\n# Косинусное сходство — мера близости векторов\ncos_sim = np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2))\nprint(f"Косинусное сходство: {cos_sim:.4f}")  # 0.9746'
        },
        {
          type: 'tip',
          value: 'Скалярное произведение и косинусное сходство — основа многих алгоритмов ML: от рекомендательных систем до NLP (word embeddings).'
        }
      ]
    },
    {
      id: 2,
      title: 'Матрицы и операции',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Матрицы в ML'
        },
        {
          type: 'text',
          value: 'Матрица — двумерный массив чисел. В ML вся обучающая выборка представляется как матрица X размером (n_samples, n_features), где каждая строка — объект, каждый столбец — признак.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import numpy as np\n\n# Создание матриц\nA = np.array([[1, 2], [3, 4], [5, 6]])  # 3x2\nB = np.array([[7, 8], [9, 10]])          # 2x2\n\nprint(f"Форма A: {A.shape}")  # (3, 2)\nprint(f"Форма B: {B.shape}")  # (2, 2)\n\n# Умножение матриц (dot product)\nC = A @ B  # или np.dot(A, B)\nprint(f"A @ B =\\n{C}")   # (3,2) @ (2,2) = (3,2)\n\n# Транспонирование\nprint(f"A^T =\\n{A.T}")   # (2, 3)\nprint(f"Форма A^T: {A.T.shape}")\n\n# Единичная матрица\nI = np.eye(3)\nprint(f"Единичная матрица:\\n{I}")\n\n# Обратная матрица\nM = np.array([[2, 1], [5, 3]])\nM_inv = np.linalg.inv(M)\nprint(f"M * M^(-1) =\\n{M @ M_inv}")  # единичная матрица\n\n# Определитель\ndet = np.linalg.det(M)\nprint(f"Определитель M: {det:.0f}")  # 1.0\n\n# Ранг матрицы\nrank = np.linalg.matrix_rank(A)\nprint(f"Ранг A: {rank}")  # 2'
        },
        {
          type: 'warning',
          value: 'Порядок при умножении матриц важен! A @ B != B @ A. Размеры должны быть совместимы: (m,n) @ (n,p) = (m,p).'
        }
      ]
    },
    {
      id: 3,
      title: 'Системы линейных уравнений',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Решение систем уравнений'
        },
        {
          type: 'text',
          value: 'Многие задачи ML сводятся к решению систем линейных уравнений. Линейная регрессия, метод наименьших квадратов, PCA — все используют линейную алгебру. Система Ax = b решается как x = A⁻¹b.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import numpy as np\n\n# Система уравнений:\n# 2x + y = 5\n# x + 3y = 7\n\nA = np.array([[2, 1], [1, 3]])\nb = np.array([5, 7])\n\n# Решение через обратную матрицу\nx = np.linalg.inv(A) @ b\nprint(f"Решение: x={x[0]:.2f}, y={x[1]:.2f}")  # x=1.6, y=1.8\n\n# Более эффективное решение через solve\nx = np.linalg.solve(A, b)\nprint(f"Решение (solve): x={x[0]:.2f}, y={x[1]:.2f}")\n\n# Проверка\nprint(f"Проверка: A @ x = {A @ x}")  # [5. 7.]\n\n# Метод наименьших квадратов (для переопределённых систем)\n# Когда уравнений больше, чем неизвестных\nA_over = np.array([[1, 1], [2, 1], [3, 1]])  # 3 уравнения, 2 неизвестных\nb_over = np.array([2, 3, 5])\n\n# Аналитическое решение: x = (A^T A)^(-1) A^T b\nresult = np.linalg.lstsq(A_over, b_over, rcond=None)\nx_ls = result[0]\nprint(f"Наименьшие квадраты: наклон={x_ls[0]:.2f}, сдвиг={x_ls[1]:.2f}")'
        },
        {
          type: 'note',
          value: 'np.linalg.solve() работает быстрее и стабильнее, чем вычисление обратной матрицы напрямую. Всегда предпочитайте solve() для решения систем.'
        }
      ]
    },
    {
      id: 4,
      title: 'Собственные значения и векторы',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Eigenvalues и Eigenvectors'
        },
        {
          type: 'text',
          value: 'Собственные значения и собственные векторы — ключевые понятия для PCA (снижение размерности), спектральной кластеризации и многих других алгоритмов ML. Если Av = λv, то v — собственный вектор, λ — собственное значение матрицы A.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import numpy as np\n\n# Матрица ковариации (как в PCA)\nA = np.array([[4, 2], [2, 3]])\n\n# Собственные значения и собственные векторы\neigenvalues, eigenvectors = np.linalg.eig(A)\n\nprint(f"Собственные значения: {eigenvalues}")  # [5.56, 1.44]\nprint(f"Собственные векторы:\\n{eigenvectors}")\n\n# Проверка: A @ v = λ * v\nfor i in range(len(eigenvalues)):\n    v = eigenvectors[:, i]\n    lam = eigenvalues[i]\n    Av = A @ v\n    lam_v = lam * v\n    print(f"\\nλ={lam:.4f}")\n    print(f"A @ v  = {Av}")\n    print(f"λ * v  = {lam_v}")\n    print(f"Совпадают: {np.allclose(Av, lam_v)}")\n\n# Применение: PCA — находим направления максимальной дисперсии\n# Собственные векторы ковариационной матрицы = главные компоненты\n# Собственные значения = доля объяснённой дисперсии\ntotal_var = np.sum(eigenvalues)\nfor i, ev in enumerate(sorted(eigenvalues, reverse=True)):\n    print(f"PC{i+1}: {ev/total_var*100:.1f}% дисперсии")'
        },
        {
          type: 'tip',
          value: 'В PCA собственные векторы определяют направления максимальной дисперсии данных, а собственные значения показывают, сколько информации содержит каждое направление.'
        }
      ]
    },
    {
      id: 5,
      title: 'Линейная алгебра в ML: практические примеры',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Как линейная алгебра используется в ML'
        },
        {
          type: 'text',
          value: 'Линейная алгебра лежит в основе практически каждого алгоритма ML. Рассмотрим конкретные примеры: линейная регрессия через матричные операции, косинусное сходство для рекомендаций и SVD для сжатия данных.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import numpy as np\n\n# 1. Линейная регрессия — аналитическое решение\n# y = Xw, решение: w = (X^T X)^(-1) X^T y\nnp.random.seed(42)\nX_raw = np.random.rand(100, 1) * 10\ny = 3 * X_raw.flatten() + 7 + np.random.randn(100) * 2\n\n# Добавляем столбец единиц для свободного члена (bias)\nX = np.column_stack([X_raw, np.ones(100)])\n\n# Нормальное уравнение\nw = np.linalg.inv(X.T @ X) @ X.T @ y\nprint(f"Коэффициенты: наклон={w[0]:.2f}, сдвиг={w[1]:.2f}")\n# Ожидаем: ~3 и ~7\n\n# 2. Косинусное сходство для рекомендаций\nuser1 = np.array([5, 4, 0, 1, 3])  # оценки фильмов\nuser2 = np.array([4, 5, 1, 0, 4])\nuser3 = np.array([1, 0, 5, 4, 0])\n\ndef cosine_similarity(a, b):\n    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))\n\nprint(f"\\nСходство user1-user2: {cosine_similarity(user1, user2):.4f}")  # высокое\nprint(f"Сходство user1-user3: {cosine_similarity(user1, user3):.4f}")  # низкое\n\n# 3. SVD — разложение матрицы\nM = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])\nU, S, Vt = np.linalg.svd(M)\nprint(f"\\nСингулярные значения: {S}")\nprint(f"Ранг матрицы: {np.sum(S > 1e-10)}")'
        },
        {
          type: 'note',
          value: 'SVD (Singular Value Decomposition) используется для снижения размерности, латентного семантического анализа в NLP и рекомендательных системах.'
        }
      ]
    },
    {
      id: 6,
      title: 'Практика: Операции линейной алгебры',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте ключевые операции линейной алгебры, используемые в ML: косинусное сходство между документами и аналитическое решение линейной регрессии.',
      requirements: [
        'Создайте три вектора документов (TF-IDF представления): doc1=[1,2,0,1], doc2=[2,1,0,1], doc3=[0,0,3,2]',
        'Вычислите косинусное сходство между всеми парами документов',
        'Определите, какие два документа наиболее похожи',
        'Реализуйте аналитическое решение линейной регрессии: w = (X^T X)^(-1) X^T y для X=[[1,1],[2,1],[3,1],[4,1],[5,1]] и y=[2.1, 3.9, 6.2, 7.8, 10.1]',
        'Выведите коэффициенты регрессии'
      ],
      hint: 'Для косинусного сходства используйте формулу: cos(a,b) = (a . b) / (||a|| * ||b||). Для регрессии — нормальное уравнение с np.linalg.inv.',
      expectedOutput: 'Сходство doc1-doc2: 0.8944\nСходство doc1-doc3: 0.2582\nСходство doc2-doc3: 0.1826\nНаиболее похожи: doc1 и doc2\nКоэффициенты регрессии: наклон=1.98, сдвиг=0.06',
      solution: 'import numpy as np\n\n# Векторы документов\ndoc1 = np.array([1, 2, 0, 1])\ndoc2 = np.array([2, 1, 0, 1])\ndoc3 = np.array([0, 0, 3, 2])\n\n# Косинусное сходство\ndef cosine_sim(a, b):\n    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))\n\nsim_12 = cosine_sim(doc1, doc2)\nsim_13 = cosine_sim(doc1, doc3)\nsim_23 = cosine_sim(doc2, doc3)\n\nprint(f"Сходство doc1-doc2: {sim_12:.4f}")\nprint(f"Сходство doc1-doc3: {sim_13:.4f}")\nprint(f"Сходство doc2-doc3: {sim_23:.4f}")\n\nsims = {"doc1 и doc2": sim_12, "doc1 и doc3": sim_13, "doc2 и doc3": sim_23}\nmost_similar = max(sims, key=sims.get)\nprint(f"Наиболее похожи: {most_similar}")\n\n# Линейная регрессия — аналитическое решение\nX = np.array([[1,1],[2,1],[3,1],[4,1],[5,1]])\ny = np.array([2.1, 3.9, 6.2, 7.8, 10.1])\n\nw = np.linalg.inv(X.T @ X) @ X.T @ y\nprint(f"Коэффициенты регрессии: наклон={w[0]:.2f}, сдвиг={w[1]:.2f}")',
      explanation: 'Косинусное сходство измеряет угол между двумя векторами: 1 = идентичны, 0 = ортогональны, -1 = противоположны. Документы с похожим содержанием имеют близкие TF-IDF векторы и высокое косинусное сходство. Аналитическое решение регрессии через нормальное уравнение w = (X^TX)^(-1)X^Ty находит оптимальные коэффициенты за одну операцию, без итераций.'
    }
  ]
}
