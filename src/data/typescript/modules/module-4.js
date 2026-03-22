export default {
  id: 4,
  title: 'Массивы и кортежи',
  description: 'Типизированные массивы, методы работы с массивами, кортежи (tuples) и их использование в TypeScript.',
  lessons: [
    {
      id: 1,
      title: 'Типизированные массивы',
      type: 'theory',
      content: [
        { type: 'text', value: 'В TypeScript массивы типизируются — компилятор знает тип каждого элемента. Это даёт автодополнение и защиту от ошибок.' },
        { type: 'code', language: 'typescript', value: '// Только числа\nconst ages: number[] = [25, 30, 22];\nages.push(28);    // OK\n// ages.push("hi"); — Ошибка!\n\n// Только строки\nconst names: string[] = ["Алибек", "Жанар"];\n\n// Массив объектов\ninterface User { id: number; name: string; }\nconst users: User[] = [\n    { id: 1, name: "Алибек" },\n    { id: 2, name: "Жанар" }\n];\n// Полное автодополнение: users[0].id, users[0].name\n\n// Смешанные типы\nconst mixed: (string | number)[] = ["Алибек", 25, "Астана", 2024];' },
        { type: 'note', value: 'Array<User> и User[] — полностью одинаковые типы. Предпочтительный стиль — T[] для простых типов, Array<T> для сложных (например Array<User | null>).' }
      ]
    },
    {
      id: 2,
      title: 'Методы массивов с типами',
      type: 'theory',
      content: [
        { type: 'text', value: 'TypeScript знает возвращаемые типы всех методов массива. Это позволяет безопасно использовать цепочки методов.' },
        { type: 'code', language: 'typescript', value: 'const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];\n\n// map возвращает T[] (новый тип элемента)\nconst doubled: number[] = numbers.map(n => n * 2);\nconst strings: string[] = numbers.map(n => n.toString());\n\n// filter возвращает T[]\nconst evens: number[] = numbers.filter(n => n % 2 === 0);\n\n// find возвращает T | undefined\nconst found: number | undefined = numbers.find(n => n > 5);\n\n// reduce — тип аккумулятора\nconst sum: number = numbers.reduce((acc, n) => acc + n, 0);\n\n// flatMap\nconst words = ["hello world", "foo bar"];\nconst allWords: string[] = words.flatMap(s => s.split(" "));' },
        { type: 'tip', value: 'find возвращает T | undefined — всегда проверяйте результат! findIndex возвращает number (-1 если не найден).' }
      ]
    },
    {
      id: 3,
      title: 'Кортежи (Tuples)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Кортеж (tuple) — массив фиксированной длины с конкретным типом для каждой позиции. Используется когда порядок элементов важен.' },
        { type: 'code', language: 'typescript', value: '// Кортеж: [строка, число]\nconst person: [string, number] = ["Алибек", 25];\nconsole.log(person[0]); // string\nconsole.log(person[1]); // number\n// console.log(person[2]); — Ошибка: выход за пределы\n// const [name, age, city] = person; — Ошибка: слишком много\n\n// Деструктуризация кортежа\nconst [name, age] = person;\nconsole.log(`${name}, ${age} лет`);\n\n// Кортеж с именами (TS 4.0+)\ntype NameAge = [name: string, age: number];\n\n// Возврат нескольких значений\nfunction minMax(nums: number[]): [number, number] {\n    return [Math.min(...nums), Math.max(...nums)];\n}\nconst [min, max] = minMax([3, 1, 4, 1, 5, 9]);\nconsole.log(`Min: ${min}, Max: ${max}`);' },
        { type: 'note', value: 'useState в React возвращает кортеж: const [value, setValue] = useState(0) — именно поэтому деструктуризация работает так удобно.' }
      ]
    },
    {
      id: 4,
      title: 'Readonly массивы и кортежи',
      type: 'theory',
      content: [
        { type: 'text', value: 'readonly запрещает мутацию — добавление, удаление и изменение элементов. Идеально для неизменяемых данных.' },
        { type: 'code', language: 'typescript', value: '// Readonly массив\nconst COLORS: readonly string[] = ["красный", "зелёный", "синий"];\n// COLORS.push("жёлтый"); — Ошибка!\n// COLORS[0] = "белый";   — Ошибка!\n\n// Readonly кортеж\nconst POINT: readonly [number, number] = [10, 20];\n// POINT[0] = 5; — Ошибка!\n\n// Функция с readonly параметром\nfunction sumArray(arr: readonly number[]): number {\n    return arr.reduce((sum, n) => sum + n, 0);\n    // arr.push(1); — Ошибка: нельзя мутировать readonly\n}\n\n// Обычный массив можно передать как readonly\nconst nums = [1, 2, 3];\nconsole.log(sumArray(nums)); // OK' },
        { type: 'tip', value: 'Принимайте readonly параметры в функциях — это явный сигнал что функция не изменяет переданный массив. Хорошая практика!' }
      ]
    },
    {
      id: 5,
      title: 'Spread и Rest с типами',
      type: 'theory',
      content: [
        { type: 'text', value: 'Spread (...) и Rest параметры полностью типизированы в TypeScript.' },
        { type: 'code', language: 'typescript', value: '// Rest параметры\nfunction sum(...numbers: number[]): number {\n    return numbers.reduce((a, b) => a + b, 0);\n}\nconsole.log(sum(1, 2, 3, 4, 5)); // 15\n\n// Spread в функции\nconst nums = [1, 2, 3];\nconsole.log(Math.max(...nums));\n\n// Spread кортежей\ntype StringThenNumber = [string, ...number[]];\nconst data: StringThenNumber = ["заголовок", 1, 2, 3];\n\n// Объединение массивов с сохранением типов\nconst arr1: number[] = [1, 2];\nconst arr2: number[] = [3, 4];\nconst combined: number[] = [...arr1, ...arr2];\n\n// Копия массива\nconst original = [1, 2, 3];\nconst copy: number[] = [...original];' },
        { type: 'note', value: '...numbers: number[] — rest параметр, собирает все аргументы в массив. Должен быть последним параметром функции.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: работа с массивами',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напишите набор функций для работы с типизированными массивами студентов.',
      requirements: [
        'interface Student { name: string; grade: number; subject: string; }',
        'topStudents(students: Student[], n: number): Student[] — топ N по оценке',
        'groupBySubject(students: Student[]): Record<string, Student[]> — группировка по предмету',
        'averageGrade(students: Student[]): [string, number][] — массив кортежей [предмет, средняя оценка]'
      ],
      expectedOutput: 'Топ 2: Дамир, Айгерим\nПо предметам: Math: 2, Physics: 1\nСредние: [["Math",87.5],["Physics",92]]',
      hint: 'groupBySubject использует reduce для построения объекта. averageGrade — map по Object.entries результата groupBySubject.',
      solution: 'interface Student {\n    name: string;\n    grade: number;\n    subject: string;\n}\n\nfunction topStudents(students: Student[], n: number): Student[] {\n    return [...students].sort((a, b) => b.grade - a.grade).slice(0, n);\n}\n\nfunction groupBySubject(students: Student[]): Record<string, Student[]> {\n    return students.reduce((acc, s) => {\n        if (!acc[s.subject]) acc[s.subject] = [];\n        acc[s.subject].push(s);\n        return acc;\n    }, {} as Record<string, Student[]>);\n}\n\nfunction averageGrade(students: Student[]): [string, number][] {\n    const groups = groupBySubject(students);\n    return Object.entries(groups).map(([subject, list]) => {\n        const avg = list.reduce((sum, s) => sum + s.grade, 0) / list.length;\n        return [subject, avg] as [string, number];\n    });\n}\n\nconst students: Student[] = [\n    { name: "Дамир", grade: 95, subject: "Math" },\n    { name: "Айгерим", grade: 90, subject: "Physics" },\n    { name: "Берик", grade: 80, subject: "Math" },\n];\n\nconsole.log("Топ 2:", topStudents(students, 2).map(s => s.name).join(", "));\nconsole.log(averageGrade(students));',
      explanation: 'Record<string, Student[]> — объект с динамическими строковыми ключами. [...students] — копия массива перед sort чтобы не мутировать оригинал.'
    }
  ]
}
