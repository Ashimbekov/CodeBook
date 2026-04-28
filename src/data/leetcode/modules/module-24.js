export default {
  id: 24,
  title: 'Segment Tree и BIT',
  description: 'Дерево отрезков (Segment Tree) и Binary Indexed Tree (BIT/Fenwick Tree) для range queries.',
  lessons: [
    {
      id: 1,
      title: 'Range Query задачи',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Зачем нужны специальные структуры?'
        },
        {
          type: 'text',
          value: 'Prefix Sum решает статические range sum queries за O(1). Но что если массив меняется? Наивный подход: update O(1), query O(n) или update O(n), query O(1). Segment Tree и BIT дают O(log n) для обоих.'
        },
        {
          type: 'heading',
          value: 'Сравнение подходов'
        },
        {
          type: 'list',
          value: [
            'Prefix Sum: build O(n), query O(1), update O(n) — для статических массивов',
            'Segment Tree: build O(n), query O(log n), update O(log n) — универсальный',
            'BIT (Fenwick Tree): build O(n), query O(log n), update O(log n) — проще в реализации, но только для коммутативных операций'
          ]
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Prefix Sum — напоминание\nclass PrefixSum {\n  constructor(nums) {\n    this.prefix = [0];\n    for (const num of nums) {\n      this.prefix.push(this.prefix[this.prefix.length - 1] + num);\n    }\n  }\n  query(left, right) { // sum [left, right]\n    return this.prefix[right + 1] - this.prefix[left];\n  }\n  // update — O(n), нужно пересчитать весь prefix\n}'
        },
        {
          type: 'tip',
          value: 'На собеседованиях Segment Tree и BIT спрашивают редко (обычно Hard). Но знание этих структур выделяет кандидата. Чаще спрашивают в Яндексе и Google.'
        }
      ]
    },
    {
      id: 2,
      title: 'Binary Indexed Tree (Fenwick Tree)',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'BIT: элегантная структура'
        },
        {
          type: 'text',
          value: 'BIT (Fenwick Tree) использует хитрую индексацию на основе младшего единичного бита. Проще в реализации, чем Segment Tree, но поддерживает только коммутативные операции (сумма, XOR).'
        },
        {
          type: 'code',
          language: 'javascript',
          value: 'class BIT {\n  constructor(n) {\n    this.n = n;\n    this.tree = new Array(n + 1).fill(0);\n  }\n\n  // Добавить delta к элементу с индексом i (1-indexed)\n  update(i, delta) {\n    for (; i <= this.n; i += i & (-i)) {\n      this.tree[i] += delta;\n    }\n  }\n\n  // Префиксная сумма [1, i]\n  query(i) {\n    let sum = 0;\n    for (; i > 0; i -= i & (-i)) {\n      sum += this.tree[i];\n    }\n    return sum;\n  }\n\n  // Сумма на отрезке [left, right] (1-indexed)\n  rangeQuery(left, right) {\n    return this.query(right) - this.query(left - 1);\n  }\n}\n\n// i & (-i) = младший единичный бит\n// update: прибавляем ко всем ответственным узлам\n// query: суммируем по "ступенькам" вниз'
        },
        {
          type: 'note',
          value: 'BIT использует 1-indexed массив. Ключевая операция: i & (-i) извлекает младший единичный бит. Update идёт вверх (i += lowbit), query — вниз (i -= lowbit).'
        }
      ]
    },
    {
      id: 3,
      title: 'Практика: Range Sum Query - Mutable',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #307: реализуйте структуру данных для range sum query с обновлением.',
      requirements: [
        'Реализуйте класс NumArray',
        'update(index, val): обновить значение',
        'sumRange(left, right): сумма на отрезке',
        'Обе операции O(log n)',
        'Используйте BIT или Segment Tree'
      ],
      hint: 'BIT: при update вычислите delta = val - oldVal. query(right+1) - query(left) для суммы.',
      expectedOutput: 'NumArray([1,3,5]): sumRange(0,2)->9, update(1,2), sumRange(0,2)->8',
      solution: 'class NumArray {\n  constructor(nums) {\n    this.n = nums.length;\n    this.nums = new Array(this.n).fill(0);\n    this.bit = new Array(this.n + 1).fill(0);\n\n    for (let i = 0; i < this.n; i++) {\n      this.update(i, nums[i]);\n    }\n  }\n\n  update(index, val) {\n    const delta = val - this.nums[index];\n    this.nums[index] = val;\n\n    let i = index + 1; // 1-indexed\n    while (i <= this.n) {\n      this.bit[i] += delta;\n      i += i & (-i);\n    }\n  }\n\n  _prefixSum(i) { // sum [0, i-1]\n    let sum = 0;\n    while (i > 0) {\n      sum += this.bit[i];\n      i -= i & (-i);\n    }\n    return sum;\n  }\n\n  sumRange(left, right) {\n    return this._prefixSum(right + 1) - this._prefixSum(left);\n  }\n}\n\nconst na = new NumArray([1, 3, 5]);\nconsole.log(na.sumRange(0, 2)); // 9\nna.update(1, 2);\nconsole.log(na.sumRange(0, 2)); // 8',
      explanation: 'BIT хранит частичные суммы. При update вычисляем delta и обновляем все ответственные узлы (i += i & (-i)). При query суммируем по "ступенькам" вниз (i -= i & (-i)). Каждая операция проходит O(log n) узлов. Инициализация: O(n log n).'
    },
    {
      id: 4,
      title: 'Практика: Segment Tree реализация',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте Segment Tree для range sum query с point update.',
      requirements: [
        'Реализуйте класс SegmentTree',
        'build: построить дерево за O(n)',
        'update(index, val): обновить значение за O(log n)',
        'query(left, right): сумма на отрезке за O(log n)'
      ],
      hint: 'Массив размера 4*n. Рекурсивно: build строит, query собирает, update обновляет.',
      expectedOutput: 'SegmentTree([1,3,5,7,9,11]): query(1,3)->15, update(1,10), query(1,3)->22',
      solution: 'class SegmentTree {\n  constructor(nums) {\n    this.n = nums.length;\n    this.tree = new Array(4 * this.n).fill(0);\n    this._build(nums, 1, 0, this.n - 1);\n  }\n\n  _build(nums, node, start, end) {\n    if (start === end) {\n      this.tree[node] = nums[start];\n      return;\n    }\n    const mid = (start + end) >> 1;\n    this._build(nums, 2 * node, start, mid);\n    this._build(nums, 2 * node + 1, mid + 1, end);\n    this.tree[node] = this.tree[2 * node] + this.tree[2 * node + 1];\n  }\n\n  update(idx, val, node = 1, start = 0, end = this.n - 1) {\n    if (start === end) {\n      this.tree[node] = val;\n      return;\n    }\n    const mid = (start + end) >> 1;\n    if (idx <= mid) this.update(idx, val, 2 * node, start, mid);\n    else this.update(idx, val, 2 * node + 1, mid + 1, end);\n    this.tree[node] = this.tree[2 * node] + this.tree[2 * node + 1];\n  }\n\n  query(l, r, node = 1, start = 0, end = this.n - 1) {\n    if (r < start || end < l) return 0; // вне диапазона\n    if (l <= start && end <= r) return this.tree[node]; // полностью внутри\n    const mid = (start + end) >> 1;\n    return this.query(l, r, 2 * node, start, mid) +\n           this.query(l, r, 2 * node + 1, mid + 1, end);\n  }\n}\n\nconst st = new SegmentTree([1, 3, 5, 7, 9, 11]);\nconsole.log(st.query(1, 3)); // 15 (3+5+7)\nst.update(1, 10);\nconsole.log(st.query(1, 3)); // 22 (10+5+7)',
      explanation: 'Segment Tree: каждый узел хранит сумму отрезка. Листья = элементы массива. Build: рекурсивно снизу вверх O(n). Query: если отрезок полностью внутри — возвращаем, вне — 0, частично — рекурсия в оба ребёнка. Update: спускаемся к листу, обновляем, поднимаемся обратно. O(log n) для query и update.'
    },
    {
      id: 5,
      title: 'Практика: Count of Smaller Numbers After Self',
      type: 'practice',
      difficulty: 'hard',
      description: 'LeetCode #315: для каждого элемента подсчитайте количество меньших элементов справа.',
      requirements: [
        'Реализуйте функцию countSmaller(nums)',
        'counts[i] = количество элементов nums[j] < nums[i] при j > i',
        'Используйте BIT или merge sort'
      ],
      hint: 'Обходите массив справа налево. BIT для подсчёта: update(val, 1) и query(val-1) = количество меньших.',
      expectedOutput: 'countSmaller([5,2,6,1]) -> [2,1,1,0]',
      solution: '// Решение с BIT + координатная компрессия\nfunction countSmaller(nums) {\n  // Координатная компрессия\n  const sorted = [...new Set(nums)].sort((a, b) => a - b);\n  const rank = new Map();\n  sorted.forEach((val, idx) => rank.set(val, idx + 1));\n\n  const n = sorted.length;\n  const bit = new Array(n + 1).fill(0);\n\n  function update(i) {\n    for (; i <= n; i += i & (-i)) bit[i]++;\n  }\n\n  function query(i) {\n    let sum = 0;\n    for (; i > 0; i -= i & (-i)) sum += bit[i];\n    return sum;\n  }\n\n  const result = new Array(nums.length).fill(0);\n\n  // Справа налево\n  for (let i = nums.length - 1; i >= 0; i--) {\n    const r = rank.get(nums[i]);\n    result[i] = query(r - 1); // количество меньших\n    update(r);                 // добавляем текущий\n  }\n\n  return result;\n}\n\nconsole.log(countSmaller([5,2,6,1])); // [2,1,1,0]\n// 5: справа [2,6,1], меньше 5: {2,1} → 2\n// 2: справа [6,1], меньше 2: {1} → 1\n// 6: справа [1], меньше 6: {1} → 1\n// 1: справа [], → 0',
      explanation: 'BIT + координатная компрессия: сжимаем значения в ранги [1..n]. Обходим справа налево: query(rank-1) = количество уже добавленных элементов с меньшим рангом, update(rank) = добавляем текущий. Координатная компрессия нужна, чтобы BIT имел разумный размер. O(n log n).'
    },
    {
      id: 6,
      title: 'Практика: Range Sum Query 2D - Mutable',
      type: 'practice',
      difficulty: 'hard',
      description: 'LeetCode #308: 2D range sum query с обновлением.',
      requirements: [
        'Реализуйте класс NumMatrix',
        'update(row, col, val): обновить значение',
        'sumRegion(row1, col1, row2, col2): сумма в прямоугольнике',
        'Используйте 2D BIT'
      ],
      hint: '2D BIT: два вложенных цикла с i & (-i) по обоим измерениям.',
      expectedOutput: 'NumMatrix([[3,0,1,4,2],[5,6,3,2,1],[1,2,0,1,5],[4,1,0,1,7],[1,0,3,0,5]]): sumRegion(2,1,4,3)->8',
      solution: 'class NumMatrix {\n  constructor(matrix) {\n    this.m = matrix.length;\n    this.n = matrix[0].length;\n    this.nums = Array.from({length: this.m}, () => Array(this.n).fill(0));\n    this.bit = Array.from({length: this.m + 1}, () => Array(this.n + 1).fill(0));\n\n    for (let i = 0; i < this.m; i++) {\n      for (let j = 0; j < this.n; j++) {\n        this.update(i, j, matrix[i][j]);\n      }\n    }\n  }\n\n  update(row, col, val) {\n    const delta = val - this.nums[row][col];\n    this.nums[row][col] = val;\n\n    for (let i = row + 1; i <= this.m; i += i & (-i)) {\n      for (let j = col + 1; j <= this.n; j += j & (-j)) {\n        this.bit[i][j] += delta;\n      }\n    }\n  }\n\n  _sum(row, col) {\n    let sum = 0;\n    for (let i = row; i > 0; i -= i & (-i)) {\n      for (let j = col; j > 0; j -= j & (-j)) {\n        sum += this.bit[i][j];\n      }\n    }\n    return sum;\n  }\n\n  sumRegion(r1, c1, r2, c2) {\n    return this._sum(r2 + 1, c2 + 1)\n         - this._sum(r1, c2 + 1)\n         - this._sum(r2 + 1, c1)\n         + this._sum(r1, c1);\n  }\n}\n\nconst matrix = [[3,0,1,4,2],[5,6,3,2,1],[1,2,0,1,5],[4,1,0,1,7],[1,0,3,0,5]];\nconst nm = new NumMatrix(matrix);\nconsole.log(nm.sumRegion(2, 1, 4, 3)); // 8',
      explanation: '2D BIT — расширение BIT на две размерности. Update и query имеют два вложенных цикла по i и j. sumRegion использует принцип включения-исключения (как 2D prefix sum). Каждая операция O(log(m) * log(n)).'
    },
    {
      id: 7,
      title: 'Практика: Merge Sort для inversions',
      type: 'practice',
      difficulty: 'hard',
      description: 'Подсчитайте количество инверсий в массиве (пар i<j, nums[i]>nums[j]) с помощью merge sort.',
      requirements: [
        'Реализуйте функцию countInversions(nums)',
        'Инверсия: пара (i,j) где i < j и nums[i] > nums[j]',
        'Решение O(n log n) через модифицированный merge sort'
      ],
      hint: 'При merge: когда элемент из правой половины меньше элемента из левой, все оставшиеся в левой образуют инверсии с ним.',
      expectedOutput: 'countInversions([2,4,1,3,5]) -> 3\ncountInversions([5,4,3,2,1]) -> 10',
      solution: 'function countInversions(nums) {\n  let count = 0;\n\n  function mergeSort(arr) {\n    if (arr.length <= 1) return arr;\n\n    const mid = arr.length >> 1;\n    const left = mergeSort(arr.slice(0, mid));\n    const right = mergeSort(arr.slice(mid));\n\n    return merge(left, right);\n  }\n\n  function merge(left, right) {\n    const result = [];\n    let i = 0, j = 0;\n\n    while (i < left.length && j < right.length) {\n      if (left[i] <= right[j]) {\n        result.push(left[i++]);\n      } else {\n        // left[i] > right[j]: все left[i..] > right[j]\n        count += left.length - i;\n        result.push(right[j++]);\n      }\n    }\n\n    while (i < left.length) result.push(left[i++]);\n    while (j < right.length) result.push(right[j++]);\n\n    return result;\n  }\n\n  mergeSort(nums);\n  return count;\n}\n\nconsole.log(countInversions([2,4,1,3,5])); // 3\n// Инверсии: (2,1), (4,1), (4,3)\n\nconsole.log(countInversions([5,4,3,2,1])); // 10\n// Полностью отсортирован в обратном порядке: C(5,2)=10',
      explanation: 'Модифицированный merge sort: при слиянии, если left[i] > right[j], то все оставшиеся в левой части (left[i..end]) больше right[j] — это (left.length - i) инверсий. Merge sort гарантирует, что все инверсии между левой и правой частями подсчитываются ровно один раз. O(n log n).'
    }
  ]
}
