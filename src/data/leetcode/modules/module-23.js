export default {
  id: 23,
  title: 'Intervals',
  description: 'Задачи на интервалы: merge, insert, meeting rooms, non-overlapping intervals.',
  lessons: [
    {
      id: 1,
      title: 'Паттерн работы с интервалами',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Интервалы на собеседованиях'
        },
        {
          type: 'text',
          value: 'Задачи на интервалы — частая тема. Ключевой приём: сортировка по началу (или концу), затем линейный проход с обработкой пересечений.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Три отношения между интервалами [a, b] и [c, d]:\n// 1. Не пересекаются: b < c или d < a\n// 2. Пересекаются: !(b < c || d < a) → a <= d && c <= b\n// 3. Один содержит другой: a <= c && d <= b\n\n// Шаблон: сортировка + линейный проход\nfunction intervalProblem(intervals) {\n  intervals.sort((a, b) => a[0] - b[0]); // сорт. по началу\n\n  const result = [intervals[0]];\n\n  for (let i = 1; i < intervals.length; i++) {\n    const prev = result[result.length - 1];\n    const curr = intervals[i];\n\n    if (curr[0] <= prev[1]) {\n      // Пересекаются — объединяем/обрабатываем\n      prev[1] = Math.max(prev[1], curr[1]);\n    } else {\n      // Не пересекаются — добавляем\n      result.push(curr);\n    }\n  }\n\n  return result;\n}'
        },
        {
          type: 'tip',
          value: 'Перед решением всегда уточняйте: интервалы открытые или закрытые? [1,2] и [2,3] пересекаются при закрытых, не пересекаются при открытых.'
        }
      ]
    },
    {
      id: 2,
      title: 'Line Sweep и Events',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Метод событий (Event-based подход)'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Meeting Rooms II: минимум переговорных\n// Разложить на события: начало (+1) и конец (-1)\nfunction minMeetingRooms(intervals) {\n  const events = [];\n  for (const [start, end] of intervals) {\n    events.push([start, 1]);  // начало встречи\n    events.push([end, -1]);   // конец встречи\n  }\n\n  // Сортируем: по времени, при равных — конец раньше начала\n  events.sort((a, b) => a[0] - b[0] || a[1] - b[1]);\n\n  let rooms = 0, maxRooms = 0;\n  for (const [, delta] of events) {\n    rooms += delta;\n    maxRooms = Math.max(maxRooms, rooms);\n  }\n\n  return maxRooms;\n}\n\n// [[0,30],[5,10],[15,20]]\n// Events: [0,+1],[5,+1],[10,-1],[15,+1],[20,-1],[30,-1]\n// Rooms:    1      2      1      2       1       0\n// Max = 2'
        },
        {
          type: 'note',
          value: 'Event-based подход особенно полезен для задач "максимальное количество одновременных событий": разбиваем интервалы на пары (start, +1) и (end, -1), сортируем, сканируем.'
        }
      ]
    },
    {
      id: 3,
      title: 'Практика: Merge Intervals',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #56: объедините все пересекающиеся интервалы.',
      requirements: [
        'Реализуйте функцию merge(intervals)',
        'Объедините все перекрывающиеся интервалы',
        'Верните массив непересекающихся интервалов'
      ],
      hint: 'Сортируйте по началу. Если текущий начинается до конца предыдущего — объединяем (обновляем конец). Иначе — новый интервал.',
      expectedOutput: 'merge([[1,3],[2,6],[8,10],[15,18]]) -> [[1,6],[8,10],[15,18]]\nmerge([[1,4],[4,5]]) -> [[1,5]]',
      solution: 'function merge(intervals) {\n  intervals.sort((a, b) => a[0] - b[0]);\n  const result = [intervals[0]];\n\n  for (let i = 1; i < intervals.length; i++) {\n    const prev = result[result.length - 1];\n    const [start, end] = intervals[i];\n\n    if (start <= prev[1]) {\n      prev[1] = Math.max(prev[1], end); // объединяем\n    } else {\n      result.push([start, end]); // новый интервал\n    }\n  }\n\n  return result;\n}\n\nconsole.log(merge([[1,3],[2,6],[8,10],[15,18]]));\n// [[1,6],[8,10],[15,18]]\n\nconsole.log(merge([[1,4],[4,5]])); // [[1,5]]',
      explanation: 'Сортировка по началу гарантирует, что если текущий интервал пересекается с предыдущим, то start <= prev.end. При объединении берём max(prev.end, curr.end), потому что один интервал может полностью содержать другой. O(n log n) из-за сортировки.'
    },
    {
      id: 4,
      title: 'Практика: Insert Interval',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #57: вставьте новый интервал в отсортированный список непересекающихся интервалов.',
      requirements: [
        'Реализуйте функцию insert(intervals, newInterval)',
        'intervals уже отсортированы и не пересекаются',
        'Вставьте newInterval, объединяя при необходимости',
        'Верните новый список интервалов'
      ],
      hint: 'Три фазы: 1) добавить все интервалы до newInterval, 2) объединить пересекающиеся с newInterval, 3) добавить оставшиеся.',
      expectedOutput: 'insert([[1,3],[6,9]], [2,5]) -> [[1,5],[6,9]]\ninsert([[1,2],[3,5],[6,7],[8,10],[12,16]], [4,8]) -> [[1,2],[3,10],[12,16]]',
      solution: 'function insert(intervals, newInterval) {\n  const result = [];\n  let i = 0;\n\n  // 1. Добавить все интервалы, заканчивающиеся до newInterval\n  while (i < intervals.length && intervals[i][1] < newInterval[0]) {\n    result.push(intervals[i]);\n    i++;\n  }\n\n  // 2. Объединить пересекающиеся с newInterval\n  while (i < intervals.length && intervals[i][0] <= newInterval[1]) {\n    newInterval[0] = Math.min(newInterval[0], intervals[i][0]);\n    newInterval[1] = Math.max(newInterval[1], intervals[i][1]);\n    i++;\n  }\n  result.push(newInterval);\n\n  // 3. Добавить оставшиеся\n  while (i < intervals.length) {\n    result.push(intervals[i]);\n    i++;\n  }\n\n  return result;\n}\n\nconsole.log(insert([[1,3],[6,9]], [2,5])); // [[1,5],[6,9]]\nconsole.log(insert([[1,2],[3,5],[6,7],[8,10],[12,16]], [4,8]));\n// [[1,2],[3,10],[12,16]]',
      explanation: 'Три чётких фазы: 1) интервалы до newInterval (end < newStart), 2) пересекающиеся (start <= newEnd) — объединяем, 3) интервалы после. Это O(n) — один проход. Чистый и понятный код, который легко объяснить на собеседовании.'
    },
    {
      id: 5,
      title: 'Практика: Non-overlapping Intervals',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #435: минимальное количество интервалов для удаления, чтобы не было пересечений.',
      requirements: [
        'Реализуйте функцию eraseOverlapIntervals(intervals)',
        'Верните минимальное количество интервалов для удаления',
        'Оставшиеся интервалы не должны пересекаться'
      ],
      hint: 'Сортируйте по концу. Жадно оставляем интервал с наименьшим концом — он оставляет максимум места.',
      expectedOutput: 'eraseOverlapIntervals([[1,2],[2,3],[3,4],[1,3]]) -> 1\neraseOverlapIntervals([[1,2],[1,2],[1,2]]) -> 2\neraseOverlapIntervals([[1,2],[2,3]]) -> 0',
      solution: 'function eraseOverlapIntervals(intervals) {\n  // Сортировка по концу — ключ к жадному решению!\n  intervals.sort((a, b) => a[1] - b[1]);\n\n  let count = 0;\n  let prevEnd = -Infinity;\n\n  for (const [start, end] of intervals) {\n    if (start >= prevEnd) {\n      prevEnd = end; // не пересекается — оставляем\n    } else {\n      count++; // пересекается — удаляем\n    }\n  }\n\n  return count;\n}\n\nconsole.log(eraseOverlapIntervals([[1,2],[2,3],[3,4],[1,3]])); // 1\n// Удаляем [1,3], остаётся [1,2],[2,3],[3,4]\n\nconsole.log(eraseOverlapIntervals([[1,2],[1,2],[1,2]])); // 2\nconsole.log(eraseOverlapIntervals([[1,2],[2,3]])); // 0',
      explanation: 'Сортировка по концу: выбирая интервал с наименьшим концом, мы максимизируем оставшееся пространство для следующих интервалов. Это доказуемо оптимальный жадный выбор (Activity Selection Problem). O(n log n).'
    },
    {
      id: 6,
      title: 'Практика: Meeting Rooms II',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #253: найдите минимальное количество переговорных комнат.',
      requirements: [
        'Реализуйте функцию minMeetingRooms(intervals)',
        'intervals[i] = [start, end] — время встречи',
        'Найдите минимальное количество комнат, чтобы все встречи прошли'
      ],
      hint: 'Разложите на события (start → +1, end → -1). Отсортируйте. Максимум одновременных встреч = ответ.',
      expectedOutput: 'minMeetingRooms([[0,30],[5,10],[15,20]]) -> 2\nminMeetingRooms([[7,10],[2,4]]) -> 1',
      solution: '// Подход 1: Events\nfunction minMeetingRooms(intervals) {\n  const starts = intervals.map(i => i[0]).sort((a, b) => a - b);\n  const ends = intervals.map(i => i[1]).sort((a, b) => a - b);\n\n  let rooms = 0, maxRooms = 0;\n  let s = 0, e = 0;\n\n  while (s < starts.length) {\n    if (starts[s] < ends[e]) {\n      rooms++;\n      s++;\n    } else {\n      rooms--;\n      e++;\n    }\n    maxRooms = Math.max(maxRooms, rooms);\n  }\n\n  return maxRooms;\n}\n\n// Подход 2: Line Sweep\nfunction minMeetingRooms2(intervals) {\n  const events = [];\n  for (const [start, end] of intervals) {\n    events.push([start, 1]);\n    events.push([end, -1]);\n  }\n  events.sort((a, b) => a[0] - b[0] || a[1] - b[1]);\n\n  let rooms = 0, maxRooms = 0;\n  for (const [, delta] of events) {\n    rooms += delta;\n    maxRooms = Math.max(maxRooms, rooms);\n  }\n  return maxRooms;\n}\n\nconsole.log(minMeetingRooms([[0,30],[5,10],[15,20]])); // 2\nconsole.log(minMeetingRooms([[7,10],[2,4]])); // 1',
      explanation: 'Два подхода: 1) Два отсортированных массива (starts и ends) — два указателя определяют, начинается или заканчивается встреча. 2) Events — объединяем в один массив и сканируем. Оба O(n log n). Первый подход интуитивнее, второй — универсальнее.'
    },
    {
      id: 7,
      title: 'Практика: Minimum Number of Arrows',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #452: минимальное количество стрел, чтобы лопнуть все шары.',
      requirements: [
        'Реализуйте функцию findMinArrowShots(points)',
        'points[i] = [xstart, xend] — горизонтальный диаметр шара',
        'Стрела, выпущенная в точку x, лопает все шары, содержащие x',
        'Найдите минимальное количество стрел'
      ],
      hint: 'Сортируйте по концу. Жадно: стреляем в конец первого шара. Пропускаем все шары, которые эта стрела лопает.',
      expectedOutput: 'findMinArrowShots([[10,16],[2,8],[1,6],[7,12]]) -> 2\nfindMinArrowShots([[1,2],[3,4],[5,6],[7,8]]) -> 4',
      solution: 'function findMinArrowShots(points) {\n  points.sort((a, b) => a[1] - b[1]); // сорт. по концу\n\n  let arrows = 1;\n  let arrowPos = points[0][1]; // стреляем в конец первого\n\n  for (let i = 1; i < points.length; i++) {\n    if (points[i][0] > arrowPos) {\n      // Текущая стрела не достаёт — нужна новая\n      arrows++;\n      arrowPos = points[i][1];\n    }\n    // Иначе: текущая стрела лопает этот шар\n  }\n\n  return arrows;\n}\n\nconsole.log(findMinArrowShots([[10,16],[2,8],[1,6],[7,12]])); // 2\n// Стрела в x=6 лопает [2,8] и [1,6]\n// Стрела в x=12 лопает [10,16] и [7,12]\n\nconsole.log(findMinArrowShots([[1,2],[3,4],[5,6],[7,8]])); // 4',
      explanation: 'Аналогично Non-overlapping Intervals. Сортируем по концу и жадно стреляем в конец первого шара. Все шары, начало которых <= arrowPos, лопаются этой стрелой. Когда шар не достаётся — нужна новая стрела. O(n log n).'
    }
  ]
}
