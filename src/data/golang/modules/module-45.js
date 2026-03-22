export default {
  id: 45,
  title: 'Generics',
  description: 'Обобщённое программирование в Go: параметры типа, ограничения типов, интерфейс comparable и any, пользовательские ограничения, обобщённые структуры данных.',
  lessons: [
    {
      id: 1,
      title: 'Зачем нужны обобщения (generics)',
      type: 'theory',
      content: [
        { type: 'text', value: 'До Go 1.18 для работы с разными типами нужно было либо дублировать код, либо использовать interface{} с потерей типовой безопасности. Generics решают обе проблемы.' },
        { type: 'tip', value: 'Generics как форма для печенья: одна форма подходит для любого теста — шоколадного, ванильного, имбирного. Без generics нужна отдельная форма для каждого вида теста.' },
        { type: 'heading', value: 'Проблема: дублирование кода' },
        { type: 'code', language: 'go', value: 'package main\n\nimport "fmt"\n\n// БЕЗ generics — копируем функцию для каждого типа\nfunc SumInts(nums []int) int {\n    total := 0\n    for _, n := range nums {\n        total += n\n    }\n    return total\n}\n\nfunc SumFloat64s(nums []float64) float64 {\n    var total float64\n    for _, n := range nums {\n        total += n\n    }\n    return total\n}\n\n// С interface{} — теряем типобезопасность\nfunc SumAny(nums []interface{}) interface{} {\n    // Нет гарантии типов — runtime panic возможна\n    total := 0.0\n    for _, n := range nums {\n        total += n.(float64) // может паниковать!\n    }\n    return total\n}\n\nfunc main() {\n    fmt.Println(SumInts([]int{1, 2, 3, 4, 5}))           // 15\n    fmt.Println(SumFloat64s([]float64{1.1, 2.2, 3.3}))   // 6.6\n}' },
        { type: 'heading', value: 'С generics — одна функция для всех' },
        { type: 'code', language: 'go', value: 'package main\n\nimport "fmt"\n\n// T — параметр типа, ~int | ~float64 — ограничение\nfunc Sum[T int | int32 | int64 | float32 | float64](nums []T) T {\n    var total T\n    for _, n := range nums {\n        total += n\n    }\n    return total\n}\n\nfunc main() {\n    fmt.Println(Sum([]int{1, 2, 3, 4, 5}))           // 15\n    fmt.Println(Sum([]float64{1.1, 2.2, 3.3}))       // 6.6\n    fmt.Println(Sum([]int32{10, 20, 30}))             // 60\n    // Все три вызова — одна функция!\n}' }
      ]
    },
    {
      id: 2,
      title: 'Параметры типа и синтаксис',
      type: 'theory',
      content: [
        { type: 'text', value: 'Синтаксис generics в Go: квадратные скобки после имени функции/типа содержат параметры типа с ограничениями. Это отличие от Java/C++ (угловые скобки).' },
        { type: 'heading', value: 'Синтаксис обобщённых функций' },
        { type: 'code', language: 'go', value: 'package main\n\nimport "fmt"\n\n// func ИмяФункции[ПараметрТипа Ограничение](параметры) тип_возврата\nfunc Min[T int | float64 | string](a, b T) T {\n    if a < b {\n        return a\n    }\n    return b\n}\n\nfunc Contains[T comparable](slice []T, item T) bool {\n    for _, v := range slice {\n        if v == item {\n            return true\n        }\n    }\n    return false\n}\n\nfunc Map[T, U any](slice []T, f func(T) U) []U {\n    result := make([]U, len(slice))\n    for i, v := range slice {\n        result[i] = f(v)\n    }\n    return result\n}\n\nfunc main() {\n    fmt.Println(Min(3, 5))           // 3\n    fmt.Println(Min(3.14, 2.71))     // 2.71\n    fmt.Println(Min("apple", "banana")) // apple\n\n    fmt.Println(Contains([]int{1, 2, 3}, 2))        // true\n    fmt.Println(Contains([]string{"a", "b"}, "c"))  // false\n\n    doubled := Map([]int{1, 2, 3}, func(n int) int { return n * 2 })\n    fmt.Println(doubled) // [2 4 6]\n\n    lengths := Map([]string{"hi", "hello"}, func(s string) int { return len(s) })\n    fmt.Println(lengths) // [2 5]\n}' },
        { type: 'heading', value: 'Множественные параметры типа' },
        { type: 'code', language: 'go', value: 'package main\n\nimport "fmt"\n\n// Функция с двумя параметрами типа\nfunc Zip[K comparable, V any](keys []K, vals []V) map[K]V {\n    result := make(map[K]V)\n    for i := 0; i < len(keys) && i < len(vals); i++ {\n        result[keys[i]] = vals[i]\n    }\n    return result\n}\n\nfunc Filter[T any](slice []T, pred func(T) bool) []T {\n    var result []T\n    for _, v := range slice {\n        if pred(v) {\n            result = append(result, v)\n        }\n    }\n    return result\n}\n\nfunc main() {\n    m := Zip([]string{"a", "b", "c"}, []int{1, 2, 3})\n    fmt.Println(m) // map[a:1 b:2 c:3]\n\n    evens := Filter([]int{1, 2, 3, 4, 5, 6}, func(n int) bool {\n        return n%2 == 0\n    })\n    fmt.Println(evens) // [2 4 6]\n}' }
      ]
    },
    {
      id: 3,
      title: 'Ограничения типов (constraints)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Ограничения определяют, какие операции можно выполнять с параметром типа. Они выражаются через интерфейсы. Пакет golang.org/x/exp/constraints предоставляет стандартные ограничения.' },
        { type: 'heading', value: 'Встроенные ограничения' },
        { type: 'code', language: 'go', value: 'package main\n\nimport "fmt"\n\n// any = interface{} — любой тип\nfunc Ptr[T any](v T) *T {\n    return &v\n}\n\n// comparable — типы поддерживающие == и !=\nfunc Equal[T comparable](a, b T) bool {\n    return a == b\n}\n\n// Числовое ограничение вручную\ntype Number interface {\n    int | int8 | int16 | int32 | int64 |\n        uint | uint8 | uint16 | uint32 | uint64 |\n        float32 | float64\n}\n\nfunc Abs[T Number](n T) T {\n    if n < 0 {\n        return -n\n    }\n    return n\n}\n\nfunc main() {\n    p := Ptr(42)\n    fmt.Println(*p) // 42\n\n    fmt.Println(Equal(1, 1))     // true\n    fmt.Println(Equal("a", "b")) // false\n\n    fmt.Println(Abs(-5))    // 5\n    fmt.Println(Abs(-3.14)) // 3.14\n}' },
        { type: 'heading', value: 'Тильда (~): базовый тип' },
        { type: 'code', language: 'go', value: 'package main\n\nimport "fmt"\n\ntype MyInt int\ntype Celsius float64\n\n// int | float64 — только точные типы\ntype StrictNumber interface {\n    int | float64\n}\n\n// ~int | ~float64 — int И любые типы с базовым типом int/float64\ntype Number interface {\n    ~int | ~float64\n}\n\nfunc Double[T Number](n T) T {\n    return n * 2\n}\n\nfunc main() {\n    fmt.Println(Double(5))              // 10 — int\n    fmt.Println(Double(MyInt(5)))       // 10 — MyInt (базовый тип int)\n    fmt.Println(Double(Celsius(36.6)))  // 73.2 — Celsius (базовый float64)\n\n    // Без ~ : Double(MyInt(5)) — ОШИБКА компиляции!\n    // С ~ : работает для всех типов на основе int\n}' }
      ]
    },
    {
      id: 4,
      title: 'Обобщённые структуры данных',
      type: 'theory',
      content: [
        { type: 'text', value: 'Generics позволяют создавать типобезопасные структуры данных: стеки, очереди, деревья — без дублирования кода для каждого типа.' },
        { type: 'heading', value: 'Обобщённый стек' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "errors"\n    "fmt"\n)\n\ntype Stack[T any] struct {\n    items []T\n}\n\nfunc (s *Stack[T]) Push(item T) {\n    s.items = append(s.items, item)\n}\n\nfunc (s *Stack[T]) Pop() (T, error) {\n    var zero T\n    if len(s.items) == 0 {\n        return zero, errors.New("стек пуст")\n    }\n    top := s.items[len(s.items)-1]\n    s.items = s.items[:len(s.items)-1]\n    return top, nil\n}\n\nfunc (s *Stack[T]) Peek() (T, error) {\n    var zero T\n    if len(s.items) == 0 {\n        return zero, errors.New("стек пуст")\n    }\n    return s.items[len(s.items)-1], nil\n}\n\nfunc (s *Stack[T]) Len() int {\n    return len(s.items)\n}\n\nfunc main() {\n    // Стек int\n    var intStack Stack[int]\n    intStack.Push(1)\n    intStack.Push(2)\n    intStack.Push(3)\n    top, _ := intStack.Pop()\n    fmt.Println("Вершина:", top) // 3\n\n    // Стек string\n    var strStack Stack[string]\n    strStack.Push("Go")\n    strStack.Push("generics")\n    v, _ := strStack.Peek()\n    fmt.Println("Вершина стека строк:", v) // generics\n}' },
        { type: 'heading', value: 'Обобщённый словарь с дефолтом' },
        { type: 'code', language: 'go', value: 'package main\n\nimport "fmt"\n\ntype DefaultMap[K comparable, V any] struct {\n    data         map[K]V\n    defaultValue V\n}\n\nfunc NewDefaultMap[K comparable, V any](def V) *DefaultMap[K, V] {\n    return &DefaultMap[K, V]{\n        data:         make(map[K]V),\n        defaultValue: def,\n    }\n}\n\nfunc (m *DefaultMap[K, V]) Get(key K) V {\n    if v, ok := m.data[key]; ok {\n        return v\n    }\n    return m.defaultValue\n}\n\nfunc (m *DefaultMap[K, V]) Set(key K, value V) {\n    m.data[key] = value\n}\n\nfunc main() {\n    // Счётчик слов — default 0\n    wordCount := NewDefaultMap[string, int](0)\n    words := []string{"go", "is", "great", "go", "is", "go"}\n    for _, w := range words {\n        wordCount.Set(w, wordCount.Get(w)+1)\n    }\n    fmt.Println("go:", wordCount.Get("go"))       // 3\n    fmt.Println("python:", wordCount.Get("python")) // 0\n}' }
      ]
    },
    {
      id: 5,
      title: 'Пользовательские ограничения',
      type: 'theory',
      content: [
        { type: 'text', value: 'Пользовательские ограничения создаются через интерфейсы и позволяют точно задать, какие типы и операции допустимы для параметра типа.' },
        { type: 'heading', value: 'Ограничение с методами' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "fmt"\n    "strings"\n)\n\n// Stringer — тип должен иметь метод String() string\ntype Stringer interface {\n    String() string\n}\n\nfunc PrintAll[T Stringer](items []T) {\n    for _, item := range items {\n        fmt.Println(item.String())\n    }\n}\n\ntype Person struct {\n    Name string\n    Age  int\n}\n\nfunc (p Person) String() string {\n    return fmt.Sprintf("%s (%d лет)", p.Name, p.Age)\n}\n\ntype Color int\n\nconst (\n    Red Color = iota\n    Green\n    Blue\n)\n\nfunc (c Color) String() string {\n    return []string{"красный", "зелёный", "синий"}[c]\n}\n\nfunc main() {\n    people := []Person{\n        {Name: "Нурдаулет", Age: 25},\n        {Name: "Айгерим", Age: 22},\n    }\n    PrintAll(people)\n\n    colors := []Color{Red, Green, Blue}\n    PrintAll(colors)\n}' },
        { type: 'heading', value: 'Комбинированные ограничения' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "fmt"\n    "strings"\n)\n\n// Ordered — тип поддерживает операции сравнения < > <= >=\ntype Ordered interface {\n    ~int | ~int8 | ~int16 | ~int32 | ~int64 |\n        ~uint | ~uint8 | ~uint16 | ~uint32 | ~uint64 | ~uintptr |\n        ~float32 | ~float64 |\n        ~string\n}\n\nfunc Max[T Ordered](a, b T) T {\n    if a > b {\n        return a\n    }\n    return b\n}\n\nfunc SortSlice[T Ordered](s []T) []T {\n    result := make([]T, len(s))\n    copy(result, s)\n    for i := 1; i < len(result); i++ {\n        for j := i; j > 0 && result[j] < result[j-1]; j-- {\n            result[j], result[j-1] = result[j-1], result[j]\n        }\n    }\n    return result\n}\n\nfunc main() {\n    fmt.Println(Max(3, 5))               // 5\n    fmt.Println(Max("apple", "banana"))  // banana\n    fmt.Println(SortSlice([]int{5, 2, 8, 1, 9}))  // [1 2 5 8 9]\n    fmt.Println(SortSlice([]string{"c", "a", "b"})) // [a b c]\n    _ = strings.Compare // для импорта\n}' }
      ]
    },
    {
      id: 6,
      title: 'Когда использовать generics',
      type: 'theory',
      content: [
        { type: 'text', value: 'Generics — мощный инструмент, но не панацея. Важно знать, когда они помогают, а когда усложняют код без пользы.' },
        { type: 'heading', value: 'Хорошие кандидаты для generics' },
        { type: 'code', language: 'go', value: 'package main\n\nimport "fmt"\n\n// 1. Алгоритмы над коллекциями\nfunc Reduce[T, R any](slice []T, initial R, fn func(R, T) R) R {\n    result := initial\n    for _, v := range slice {\n        result = fn(result, v)\n    }\n    return result\n}\n\n// 2. Структуры данных (стеки, очереди, деревья)\ntype Pair[A, B any] struct {\n    First  A\n    Second B\n}\n\nfunc NewPair[A, B any](a A, b B) Pair[A, B] {\n    return Pair[A, B]{First: a, Second: b}\n}\n\n// 3. Утилиты для работы с типами\nfunc Keys[K comparable, V any](m map[K]V) []K {\n    keys := make([]K, 0, len(m))\n    for k := range m {\n        keys = append(keys, k)\n    }\n    return keys\n}\n\nfunc Values[K comparable, V any](m map[K]V) []V {\n    vals := make([]V, 0, len(m))\n    for _, v := range m {\n        vals = append(vals, v)\n    }\n    return vals\n}\n\nfunc main() {\n    // Reduce: сумма\n    sum := Reduce([]int{1, 2, 3, 4, 5}, 0, func(acc, n int) int { return acc + n })\n    fmt.Println("Сумма:", sum) // 15\n\n    // Pair\n    p := NewPair("привет", 42)\n    fmt.Println(p.First, p.Second) // привет 42\n\n    m := map[string]int{"a": 1, "b": 2, "c": 3}\n    fmt.Println("Ключи:", Keys(m)) // [a b c] (в случайном порядке)\n}' },
        { type: 'warning', value: 'Не используй generics когда: есть конкретный тип — лучше обычная функция; поведение зависит от типа (используй интерфейсы); код становится сложнее для чтения. Generics для "алгоритм + коллекция" — отлично. Generics для бизнес-логики — обычно лишнее.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: обобщённые утилиты',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй пакет утилит для работы с коллекциями используя generics: Map, Filter, Reduce, Contains, Unique.',
      requirements: [
        'Map[T, U any](slice []T, fn func(T) U) []U — преобразование',
        'Filter[T any](slice []T, pred func(T) bool) []T — фильтрация',
        'Reduce[T, R any](slice []T, init R, fn func(R, T) R) R — свёртка',
        'Contains[T comparable](slice []T, item T) bool — проверка наличия',
        'Unique[T comparable](slice []T) []T — уникальные элементы',
        'Протестируй каждую функцию с int и string'
      ],
      expectedOutput: 'Map: [2 4 6 8 10]\nFilter: [2 4]\nReduce: 15\nContains: true false\nUnique int: [1 2 3 4 5]\nUnique string: [a b c]',
      hint: 'Для Unique используй map[T]struct{} как множество. Порядок в Unique соответствует первому появлению элемента.',
      solution: 'package main\n\nimport "fmt"\n\nfunc Map[T, U any](slice []T, fn func(T) U) []U {\n    result := make([]U, len(slice))\n    for i, v := range slice {\n        result[i] = fn(v)\n    }\n    return result\n}\n\nfunc Filter[T any](slice []T, pred func(T) bool) []T {\n    var result []T\n    for _, v := range slice {\n        if pred(v) {\n            result = append(result, v)\n        }\n    }\n    return result\n}\n\nfunc Reduce[T, R any](slice []T, init R, fn func(R, T) R) R {\n    result := init\n    for _, v := range slice {\n        result = fn(result, v)\n    }\n    return result\n}\n\nfunc Contains[T comparable](slice []T, item T) bool {\n    for _, v := range slice {\n        if v == item {\n            return true\n        }\n    }\n    return false\n}\n\nfunc Unique[T comparable](slice []T) []T {\n    seen := make(map[T]struct{})\n    var result []T\n    for _, v := range slice {\n        if _, ok := seen[v]; !ok {\n            seen[v] = struct{}{}\n            result = append(result, v)\n        }\n    }\n    return result\n}\n\nfunc main() {\n    nums := []int{1, 2, 3, 4, 5}\n    doubled := Map(nums, func(n int) int { return n * 2 })\n    fmt.Println("Map:", doubled)\n\n    evens := Filter(nums, func(n int) bool { return n%2 == 0 })\n    fmt.Println("Filter:", evens)\n\n    sum := Reduce(nums, 0, func(acc, n int) int { return acc + n })\n    fmt.Println("Reduce:", sum)\n\n    fmt.Println("Contains:", Contains(nums, 3), Contains(nums, 6))\n\n    dupeInts := []int{1, 2, 2, 3, 1, 4, 3, 5}\n    fmt.Println("Unique int:", Unique(dupeInts))\n\n    dupeStrs := []string{"a", "b", "a", "c", "b"}\n    fmt.Println("Unique string:", Unique(dupeStrs))\n}',
      explanation: 'Generics позволили написать универсальные функции коллекций один раз. Map принимает два параметра типа (T входной, U выходной), что позволяет преобразовывать []int в []string и наоборот. Unique использует map[T]struct{} как множество — ключ comparable (интерфейс) гарантирует поддержку операции ==. Reduce аккумулирует результат с другим типом R, что позволяет строить строки из чисел и другие трансформации.'
    }
  ]
}
