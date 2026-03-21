export default {
  id: 9,
  title: 'Многомерные массивы',
  description: 'Двумерные массивы (таблицы), инициализация, перебор строк и столбцов, зубчатые массивы и практические задачи',
  lessons: [
    {
      id: 1,
      title: 'Двумерные массивы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Двумерный массив — это массив массивов. Можно думать о нём как о таблице: строки и столбцы. Каждый элемент имеет два индекса: [строка][столбец].' },
        { type: 'tip', value: 'Представь шахматную доску: 8 строк и 8 столбцов. Чтобы указать клетку, говоришь "строка 3, столбец 5". Двумерный массив — то же самое! [строка][столбец].' },
        { type: 'heading', value: 'Создание двумерного массива' },
        { type: 'code', language: 'java', value: '// Создание: int[строки][столбцы]\nint[][] matrix = new int[3][4];  // 3 строки, 4 столбца\n\n// Создание с инициализацией\nint[][] table = {\n    {1, 2, 3},    // строка 0\n    {4, 5, 6},    // строка 1\n    {7, 8, 9}     // строка 2\n};\n\n// Доступ к элементам: [строка][столбец]\nSystem.out.println(table[0][0]);  // 1 — первая строка, первый столбец\nSystem.out.println(table[1][2]);  // 6 — вторая строка, третий столбец\nSystem.out.println(table[2][1]);  // 8 — третья строка, второй столбец\n\n// Изменение элемента\ntable[0][1] = 99;\nSystem.out.println(table[0][1]);  // 99' },
        { type: 'heading', value: 'Размеры двумерного массива' },
        { type: 'code', language: 'java', value: 'int[][] grid = new int[4][5];\n\nSystem.out.println("Строк: " + grid.length);      // 4 — количество строк\nSystem.out.println("Столбцов: " + grid[0].length); // 5 — столбцов в строке 0\n\n// Для нашей таблицы 3x3\nint[][] t = {{1,2,3},{4,5,6},{7,8,9}};\nSystem.out.println(t.length);     // 3 (строк)\nSystem.out.println(t[0].length);  // 3 (столбцов)' },
        { type: 'note', value: 'matrix.length — количество строк. matrix[0].length — количество столбцов. Запомни эту пару — она используется в каждом цикле по двумерному массиву.' }
      ]
    },
    {
      id: 2,
      title: 'Инициализация и вывод 2D массивов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Для работы с двумерными массивами используются вложенные циклы: внешний проходит по строкам, внутренний — по столбцам каждой строки.' },
        { type: 'heading', value: 'Заполнение по формуле' },
        { type: 'code', language: 'java', value: '// Создаём таблицу умножения 5x5\nint size = 5;\nint[][] mult = new int[size][size];\n\nfor (int i = 0; i < size; i++) {\n    for (int j = 0; j < size; j++) {\n        mult[i][j] = (i + 1) * (j + 1);\n    }\n}\n\n// mult[0][0] = 1*1 = 1\n// mult[2][3] = 3*4 = 12' },
        { type: 'heading', value: 'Вывод двумерного массива' },
        { type: 'code', language: 'java', value: 'int[][] matrix = {\n    {1, 2, 3},\n    {4, 5, 6},\n    {7, 8, 9}\n};\n\n// Красивый вывод таблицы\nfor (int i = 0; i < matrix.length; i++) {\n    for (int j = 0; j < matrix[i].length; j++) {\n        System.out.printf("%4d", matrix[i][j]);\n    }\n    System.out.println();  // новая строка после каждой строки матрицы\n}\n// Вывод:\n//    1   2   3\n//    4   5   6\n//    7   8   9' },
        { type: 'heading', value: 'Arrays.deepToString() для вывода' },
        { type: 'code', language: 'java', value: 'import java.util.Arrays;\n\nint[][] arr = {{1, 2}, {3, 4}, {5, 6}};\n\n// Arrays.toString() не работает для 2D\nSystem.out.println(Arrays.toString(arr));       // [[I@..., [I@...]\n\n// Arrays.deepToString() — правильный способ\nSystem.out.println(Arrays.deepToString(arr));   // [[1, 2], [3, 4], [5, 6]]' },
        { type: 'tip', value: 'Для отладки (проверки что в массиве) используй Arrays.deepToString() — покажет все значения в одной строке. Для красивого вывода — вложенные циклы с printf.' }
      ]
    },
    {
      id: 3,
      title: 'Алгоритмы на 2D массивах',
      type: 'theory',
      content: [
        { type: 'text', value: 'С двумерными массивами можно делать много интересного: суммировать строки и столбцы, находить диагонали, транспонировать матрицы.' },
        { type: 'heading', value: 'Сумма строк и столбцов' },
        { type: 'code', language: 'java', value: 'int[][] scores = {\n    {85, 90, 78},   // студент 0\n    {92, 88, 95},   // студент 1\n    {70, 75, 80}    // студент 2\n};\n\n// Сумма оценок каждого студента (по строкам)\nfor (int i = 0; i < scores.length; i++) {\n    int rowSum = 0;\n    for (int j = 0; j < scores[i].length; j++) {\n        rowSum += scores[i][j];\n    }\n    System.out.println("Студент " + i + ": сумма = " + rowSum);\n}\n// Студент 0: сумма = 253\n// Студент 1: сумма = 275\n// Студент 2: сумма = 225' },
        { type: 'heading', value: 'Главная диагональ' },
        { type: 'code', language: 'java', value: 'int[][] matrix = {\n    {1, 2, 3},\n    {4, 5, 6},\n    {7, 8, 9}\n};\n\n// Главная диагональ — где i == j\nSystem.out.print("Главная диагональ: ");\nfor (int i = 0; i < matrix.length; i++) {\n    System.out.print(matrix[i][i] + " ");  // [0][0], [1][1], [2][2]\n}\n// Главная диагональ: 1 5 9' },
        { type: 'heading', value: 'Транспонирование матрицы' },
        { type: 'code', language: 'java', value: 'import java.util.Arrays;\n\nint[][] original = {{1, 2, 3}, {4, 5, 6}};\n// original: 2 строки, 3 столбца\n\n// Транспонированная: 3 строки, 2 столбца\nint[][] transposed = new int[3][2];\n\nfor (int i = 0; i < original.length; i++) {\n    for (int j = 0; j < original[i].length; j++) {\n        transposed[j][i] = original[i][j];  // меняем индексы местами\n    }\n}\n\nSystem.out.println(Arrays.deepToString(original));    // [[1,2,3],[4,5,6]]\nSystem.out.println(Arrays.deepToString(transposed));  // [[1,4],[2,5],[3,6]]' }
      ]
    },
    {
      id: 4,
      title: 'Зубчатые (jagged) массивы',
      type: 'theory',
      content: [
        { type: 'text', value: 'В Java двумерный массив — это на самом деле массив одномерных массивов. Это значит, что каждая строка может иметь разную длину! Такие массивы называются зубчатыми (jagged).' },
        { type: 'tip', value: 'Представь парковку: в первом ряду 3 места, во втором 5, в третьем 2. Зубчатый массив — это такая неравномерная парковка. В обычном языке программирования такое было бы сложно сделать, а в Java — легко!' },
        { type: 'heading', value: 'Создание зубчатого массива' },
        { type: 'code', language: 'java', value: '// Сначала создаём "массив строк"\nint[][] jagged = new int[3][];\n\n// Потом каждую строку отдельно, разного размера\njagged[0] = new int[3];  // строка 0: 3 элемента\njagged[1] = new int[5];  // строка 1: 5 элементов\njagged[2] = new int[1];  // строка 2: 1 элемент\n\n// Или через инициализацию:\nint[][] triangle = {\n    {1},\n    {1, 2},\n    {1, 2, 3},\n    {1, 2, 3, 4}\n};' },
        { type: 'heading', value: 'Перебор зубчатого массива' },
        { type: 'code', language: 'java', value: 'int[][] pascal = {\n    {1},\n    {1, 1},\n    {1, 2, 1},\n    {1, 3, 3, 1},\n    {1, 4, 6, 4, 1}\n};\n\n// Перебор: каждая строка имеет разную длину\nfor (int i = 0; i < pascal.length; i++) {\n    for (int j = 0; j < pascal[i].length; j++) {  // pascal[i].length!\n        System.out.print(pascal[i][j] + " ");\n    }\n    System.out.println();\n}\n// Вывод (треугольник Паскаля):\n// 1\n// 1 1\n// 1 2 1\n// 1 3 3 1\n// 1 4 6 4 1' },
        { type: 'note', value: 'Важно: в зубчатом массиве всегда используй matrix[i].length внутри внутреннего цикла, а не константу или matrix[0].length — ведь каждая строка имеет свою длину.' }
      ]
    },
    {
      id: 5,
      title: 'Практика: Крестики-нолики',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай программу, которая отображает поле для крестиков-ноликов и проверяет, есть ли победитель. Поле 3x3, хранится как двумерный массив символов.',
      requirements: [
        'Создай поле char[][] board = {{\'X\',\'O\',\'X\'},{\'O\',\'X\',\'O\'},{\'O\',\'X\',\'X\'}}',
        'Выведи поле красиво (с разделителями |)',
        'Проверь главную диагональ — если все три одинаковые и не \' \', объяви победителя',
        'Выведи результат проверки'
      ],
      expectedOutput: 'X | O | X\n---------\nO | X | O\n---------\nO | X | X\nПобедитель по диагонали: X',
      hint: 'Для проверки диагонали сравни board[0][0], board[1][1], board[2][2]. Если все равны между собой — победитель найден.',
      solution: 'public class Main {\n    public static void main(String[] args) {\n        char[][] board = {\n            {\'X\', \'O\', \'X\'},\n            {\'O\', \'X\', \'O\'},\n            {\'O\', \'X\', \'X\'}\n        };\n\n        // Вывод поля\n        for (int i = 0; i < board.length; i++) {\n            System.out.print(board[i][0] + " | " + board[i][1] + " | " + board[i][2]);\n            System.out.println();\n            if (i < board.length - 1) {\n                System.out.println("---------");\n            }\n        }\n\n        // Проверка главной диагонали\n        if (board[0][0] == board[1][1] && board[1][1] == board[2][2]) {\n            System.out.println("Победитель по диагонали: " + board[0][0]);\n        } else {\n            System.out.println("Победителя по диагонали нет");\n        }\n    }\n}',
      explanation: 'Двумерный массив char — удобный способ хранить игровое поле. Вывод строк через цикл с разделителями. Проверка диагонали: board[0][0] == board[1][1] == board[2][2] — если все три клетки совпадают, это победа по главной диагонали.'
    },
    {
      id: 6,
      title: 'Практика: Матричные вычисления',
      type: 'practice',
      difficulty: 'hard',
      description: 'Напиши программу сложения двух матриц 3x3. Сложение матриц: каждый элемент результата = сумма соответствующих элементов исходных матриц.',
      requirements: [
        'Создай две матрицы 3x3 с произвольными числами',
        'Создай третью матрицу result для хранения суммы',
        'Используй вложенные циклы для сложения',
        'Выведи все три матрицы (до и результат) в читаемом виде'
      ],
      expectedOutput: 'Матрица A:\n 1  2  3\n 4  5  6\n 7  8  9\nМатрица B:\n 9  8  7\n 6  5  4\n 3  2  1\nСумма A + B:\n10 10 10\n10 10 10\n10 10 10',
      hint: 'result[i][j] = a[i][j] + b[i][j]. Создай отдельный метод (или просто функцию printMatrix) для красивого вывода — использую её трижды.',
      solution: 'public class Main {\n    public static void main(String[] args) {\n        int[][] a = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};\n        int[][] b = {{9, 8, 7}, {6, 5, 4}, {3, 2, 1}};\n        int[][] result = new int[3][3];\n\n        // Сложение матриц\n        for (int i = 0; i < 3; i++) {\n            for (int j = 0; j < 3; j++) {\n                result[i][j] = a[i][j] + b[i][j];\n            }\n        }\n\n        // Вывод матрицы A\n        System.out.println("Матрица A:");\n        for (int i = 0; i < 3; i++) {\n            for (int j = 0; j < 3; j++) {\n                System.out.printf("%2d ", a[i][j]);\n            }\n            System.out.println();\n        }\n\n        // Вывод матрицы B\n        System.out.println("Матрица B:");\n        for (int i = 0; i < 3; i++) {\n            for (int j = 0; j < 3; j++) {\n                System.out.printf("%2d ", b[i][j]);\n            }\n            System.out.println();\n        }\n\n        // Вывод результата\n        System.out.println("Сумма A + B:");\n        for (int i = 0; i < 3; i++) {\n            for (int j = 0; j < 3; j++) {\n                System.out.printf("%2d ", result[i][j]);\n            }\n            System.out.println();\n        }\n    }\n}',
      explanation: 'Сложение матриц: result[i][j] = a[i][j] + b[i][j]. Это классическая операция линейной алгебры. В Java матрица — просто двумерный массив, и обращаться к элементам удобно через [строка][столбец]. Три отдельных цикла вывода делают код немного длиннее, но очень понятным.'
    }
  ]
}
