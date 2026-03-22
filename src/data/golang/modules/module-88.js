export default {
  id: 88,
  title: 'Практикум: Структуры и интерфейсы',
  description: 'Десять практических задач на структуры, интерфейсы и дженерики в Go: от базовых структур до паттернов итератора и иерархий типов.',
  lessons: [
    {
      id: 1,
      title: 'Структура Student с GPA',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создай структуру Student с методами вычисления GPA и классификации успеваемости.',
      requirements: [
        'Структура Student: Name string, Grades []float64',
        'Метод GPA() float64 — среднее значение оценок',
        'Метод LetterGrade() string — A(90+), B(80+), C(70+), D(60+), F(<60)',
        'Метод String() string — строковое представление',
        'Метод AddGrade(grade float64) — добавить оценку с проверкой 0-100',
        'Создать 3 студента, вывести их GPA и оценку'
      ],
      expectedOutput: 'Алия: GPA=92.33, Оценка=A\nБауыржан: GPA=74.50, Оценка=C\nЗарина: GPA=55.00, Оценка=F',
      hint: 'GPA: сумма всех оценок / количество. Для пустого Grades вернуть 0. LetterGrade: серия if-else или switch с conditions.',
      solution: 'package main\n\nimport "fmt"\n\ntype Student struct {\n    Name   string\n    Grades []float64\n}\n\nfunc (s *Student) AddGrade(grade float64) {\n    if grade < 0 || grade > 100 {\n        fmt.Printf("Неверная оценка: %.1f (допустимо 0-100)\\n", grade)\n        return\n    }\n    s.Grades = append(s.Grades, grade)\n}\n\nfunc (s *Student) GPA() float64 {\n    if len(s.Grades) == 0 {\n        return 0\n    }\n    sum := 0.0\n    for _, g := range s.Grades {\n        sum += g\n    }\n    return sum / float64(len(s.Grades))\n}\n\nfunc (s *Student) LetterGrade() string {\n    gpa := s.GPA()\n    switch {\n    case gpa >= 90:\n        return "A"\n    case gpa >= 80:\n        return "B"\n    case gpa >= 70:\n        return "C"\n    case gpa >= 60:\n        return "D"\n    default:\n        return "F"\n    }\n}\n\nfunc (s *Student) String() string {\n    return fmt.Sprintf("%s: GPA=%.2f, Оценка=%s", s.Name, s.GPA(), s.LetterGrade())\n}\n\nfunc main() {\n    aliya := &Student{Name: "Алия"}\n    aliya.AddGrade(95)\n    aliya.AddGrade(88)\n    aliya.AddGrade(94)\n    fmt.Println(aliya)\n\n    bauyr := &Student{Name: "Бауыржан"}\n    bauyr.AddGrade(70)\n    bauyr.AddGrade(79)\n    fmt.Println(bauyr)\n\n    zarina := &Student{Name: "Зарина"}\n    zarina.AddGrade(55)\n    zarina.AddGrade(50)\n    zarina.AddGrade(60)\n    fmt.Println(zarina)\n}',
      explanation: 'Метод String() позволяет использовать структуру в fmt.Println напрямую. AddGrade с валидацией защищает инварианты структуры. Указатель *Student в методах необходим для изменения поля Grades.'
    },
    {
      id: 2,
      title: 'BankAccount — банковский счёт',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реализуй банковский счёт с историей транзакций, защитой от отрицательного баланса и методами отчётности.',
      requirements: [
        'Структура BankAccount: owner string, balance float64, transactions []Transaction',
        'Структура Transaction: Type string, Amount float64, Balance float64',
        'Методы: Deposit(amount) error, Withdraw(amount) error, Balance() float64',
        'Метод Statement() — вывод выписки',
        'Ошибки: отрицательная сумма, недостаточно средств'
      ],
      expectedOutput: 'Депозит 1000.00 -> баланс: 1000.00\nДепозит 500.00 -> баланс: 1500.00\nСнятие 200.00 -> баланс: 1300.00\nОшибка: недостаточно средств (баланс 1300.00)\nВыписка: 3 операции',
      hint: 'Transaction хранит состояние после операции. Withdraw проверяет amount <= balance перед изменением. Statement итерирует по transactions и выводит каждую.',
      solution: 'package main\n\nimport (\n    "errors"\n    "fmt"\n)\n\ntype Transaction struct {\n    Type    string\n    Amount  float64\n    Balance float64\n}\n\ntype BankAccount struct {\n    owner        string\n    balance      float64\n    transactions []Transaction\n}\n\nfunc NewBankAccount(owner string, initial float64) *BankAccount {\n    return &BankAccount{owner: owner, balance: initial}\n}\n\nfunc (a *BankAccount) Deposit(amount float64) error {\n    if amount <= 0 {\n        return errors.New("сумма депозита должна быть > 0")\n    }\n    a.balance += amount\n    a.transactions = append(a.transactions, Transaction{"deposit", amount, a.balance})\n    fmt.Printf("Депозит %.2f -> баланс: %.2f\\n", amount, a.balance)\n    return nil\n}\n\nfunc (a *BankAccount) Withdraw(amount float64) error {\n    if amount <= 0 {\n        return errors.New("сумма снятия должна быть > 0")\n    }\n    if amount > a.balance {\n        return fmt.Errorf("недостаточно средств (баланс %.2f)", a.balance)\n    }\n    a.balance -= amount\n    a.transactions = append(a.transactions, Transaction{"withdraw", amount, a.balance})\n    fmt.Printf("Снятие %.2f -> баланс: %.2f\\n", amount, a.balance)\n    return nil\n}\n\nfunc (a *BankAccount) Balance() float64 {\n    return a.balance\n}\n\nfunc (a *BankAccount) Statement() {\n    fmt.Printf("Выписка %s: %d операции\\n", a.owner, len(a.transactions))\n    for i, t := range a.transactions {\n        fmt.Printf("  %d. %s: %.2f (баланс: %.2f)\\n", i+1, t.Type, t.Amount, t.Balance)\n    }\n}\n\nfunc main() {\n    acc := NewBankAccount("Нурдаулет", 0)\n    acc.Deposit(1000)\n    acc.Deposit(500)\n    acc.Withdraw(200)\n    if err := acc.Withdraw(2000); err != nil {\n        fmt.Println("Ошибка:", err)\n    }\n    acc.Statement()\n}',
      explanation: 'Transaction хранит баланс ПОСЛЕ операции — это важно для истории. Encapsulation: поля в нижнем регистре, доступ только через методы. errors.New для простых ошибок, fmt.Errorf для форматированных.'
    },
    {
      id: 3,
      title: 'Интерфейс Shape: круг и прямоугольник',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реализуй интерфейс Shape для геометрических фигур и функции работы с коллекцией фигур.',
      requirements: [
        'Интерфейс Shape: Area() float64, Perimeter() float64, String() string',
        'Структуры Circle (radius) и Rectangle (width, height)',
        'Функция TotalArea(shapes []Shape) float64',
        'Функция LargestShape(shapes []Shape) Shape',
        'Создать 3-4 фигуры, вывести их площади и найти наибольшую'
      ],
      expectedOutput: 'Circle(r=5): Area=78.54, Perimeter=31.42\nRectangle(4x6): Area=24.00, Perimeter=20.00\nTotalArea=102.54\nНаибольшая: Circle(r=5)',
      hint: 'math.Pi для числа Пи, math.Pow(r, 2) или r*r для r². Формулы: круг S=πr², P=2πr; прямоугольник S=w*h, P=2*(w+h).',
      solution: 'package main\n\nimport (\n    "fmt"\n    "math"\n)\n\ntype Shape interface {\n    Area() float64\n    Perimeter() float64\n    String() string\n}\n\ntype Circle struct {\n    Radius float64\n}\n\nfunc (c Circle) Area() float64      { return math.Pi * c.Radius * c.Radius }\nfunc (c Circle) Perimeter() float64 { return 2 * math.Pi * c.Radius }\nfunc (c Circle) String() string {\n    return fmt.Sprintf("Circle(r=%.0f)", c.Radius)\n}\n\ntype Rectangle struct {\n    Width, Height float64\n}\n\nfunc (r Rectangle) Area() float64      { return r.Width * r.Height }\nfunc (r Rectangle) Perimeter() float64 { return 2 * (r.Width + r.Height) }\nfunc (r Rectangle) String() string {\n    return fmt.Sprintf("Rectangle(%.0fx%.0f)", r.Width, r.Height)\n}\n\nfunc TotalArea(shapes []Shape) float64 {\n    total := 0.0\n    for _, s := range shapes {\n        total += s.Area()\n    }\n    return total\n}\n\nfunc LargestShape(shapes []Shape) Shape {\n    if len(shapes) == 0 {\n        return nil\n    }\n    largest := shapes[0]\n    for _, s := range shapes[1:] {\n        if s.Area() > largest.Area() {\n            largest = s\n        }\n    }\n    return largest\n}\n\nfunc main() {\n    shapes := []Shape{\n        Circle{Radius: 5},\n        Rectangle{Width: 4, Height: 6},\n        Circle{Radius: 3},\n    }\n    for _, s := range shapes {\n        fmt.Printf("%s: Area=%.2f, Perimeter=%.2f\\n", s, s.Area(), s.Perimeter())\n    }\n    fmt.Printf("TotalArea=%.2f\\n", TotalArea(shapes))\n    fmt.Printf("Наибольшая: %s\\n", LargestShape(shapes))\n}',
      explanation: 'Интерфейс Shape позволяет TotalArea и LargestShape работать с любыми фигурами не зная их конкретного типа. Реализация на value receiver (не pointer) корректна для неизменяемых структур. String() как часть интерфейса позволяет fmt автоматически использовать его.'
    },
    {
      id: 4,
      title: 'Интерфейс Sortable',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй интерфейс Sortable и несколько типов, реализующих его. Напиши обобщённую функцию сортировки пузырьком.',
      requirements: [
        'Интерфейс Sortable: Len() int, Less(i, j int) bool, Swap(i, j int)',
        'IntSlice, StringSlice, PersonSlice реализуют Sortable',
        'Person: Name string, Age int; сортировка по Age',
        'BubbleSort(s Sortable) — сортировка пузырьком через интерфейс',
        'Продемонстрировать сортировку всех трёх типов'
      ],
      expectedOutput: 'IntSlice: [1 2 3 5 8]\nStringSlice: [apple banana cherry]\nPersonSlice: [{Alice 25} {Bob 30} {Charlie 35}]',
      hint: 'BubbleSort принимает Sortable и использует только Len(), Less(), Swap() — не знает о конкретном типе. Это паттерн стандартной библиотеки sort.Interface.',
      solution: 'package main\n\nimport "fmt"\n\ntype Sortable interface {\n    Len() int\n    Less(i, j int) bool\n    Swap(i, j int)\n}\n\nfunc BubbleSort(s Sortable) {\n    n := s.Len()\n    for i := 0; i < n-1; i++ {\n        for j := 0; j < n-1-i; j++ {\n            if !s.Less(j, j+1) {\n                s.Swap(j, j+1)\n            }\n        }\n    }\n}\n\ntype IntSlice []int\n\nfunc (s IntSlice) Len() int           { return len(s) }\nfunc (s IntSlice) Less(i, j int) bool { return s[i] < s[j] }\nfunc (s IntSlice) Swap(i, j int)      { s[i], s[j] = s[j], s[i] }\n\ntype StringSlice []string\n\nfunc (s StringSlice) Len() int           { return len(s) }\nfunc (s StringSlice) Less(i, j int) bool { return s[i] < s[j] }\nfunc (s StringSlice) Swap(i, j int)      { s[i], s[j] = s[j], s[i] }\n\ntype Person struct {\n    Name string\n    Age  int\n}\n\ntype PersonSlice []Person\n\nfunc (s PersonSlice) Len() int           { return len(s) }\nfunc (s PersonSlice) Less(i, j int) bool { return s[i].Age < s[j].Age }\nfunc (s PersonSlice) Swap(i, j int)      { s[i], s[j] = s[j], s[i] }\n\nfunc main() {\n    ints := IntSlice{5, 3, 8, 1, 2}\n    BubbleSort(ints)\n    fmt.Println("IntSlice:", []int(ints))\n\n    strs := StringSlice{"banana", "apple", "cherry"}\n    BubbleSort(strs)\n    fmt.Println("StringSlice:", []string(strs))\n\n    people := PersonSlice{\n        {Name: "Charlie", Age: 35},\n        {Name: "Alice", Age: 25},\n        {Name: "Bob", Age: 30},\n    }\n    BubbleSort(people)\n    fmt.Println("PersonSlice:", []Person(people))\n}',
      explanation: 'Этот паттерн — основа пакета sort в стандартной библиотеке. BubbleSort не знает о конкретных типах, только об интерфейсе. Slice-типы (type IntSlice []int) позволяют добавить методы к базовым типам. Преобразование []int(ints) для вывода работает так как IntSlice — это alias для []int.'
    },
    {
      id: 5,
      title: 'Обобщённый стек (generic Stack)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй типобезопасный стек с использованием дженериков Go 1.18+.',
      requirements: [
        'Stack[T any] с методами Push, Pop, Peek, IsEmpty, Size, Clear',
        'Pop и Peek возвращают (T, bool) — false если стек пуст',
        'Метод ToSlice() []T — элементы от дна к вершине',
        'Демонстрация с int и string стеками'
      ],
      expectedOutput: 'Push 1,2,3 -> size=3\nPeek: 3\nPop: 3, Pop: 2\nSize: 1\nToSlice: [1]\nString stack: Push a,b,c -> Pop: c',
      hint: 'Используй []T как внутреннее хранилище. Push: append, Pop: убери последний элемент (items[:n-1]). Peek: верни последний без удаления.',
      solution: 'package main\n\nimport "fmt"\n\ntype Stack[T any] struct {\n    items []T\n}\n\nfunc (s *Stack[T]) Push(item T) {\n    s.items = append(s.items, item)\n}\n\nfunc (s *Stack[T]) Pop() (T, bool) {\n    if len(s.items) == 0 {\n        var zero T\n        return zero, false\n    }\n    n := len(s.items)\n    item := s.items[n-1]\n    s.items = s.items[:n-1]\n    return item, true\n}\n\nfunc (s *Stack[T]) Peek() (T, bool) {\n    if len(s.items) == 0 {\n        var zero T\n        return zero, false\n    }\n    return s.items[len(s.items)-1], true\n}\n\nfunc (s *Stack[T]) IsEmpty() bool  { return len(s.items) == 0 }\nfunc (s *Stack[T]) Size() int      { return len(s.items) }\nfunc (s *Stack[T]) Clear()         { s.items = nil }\n\nfunc (s *Stack[T]) ToSlice() []T {\n    result := make([]T, len(s.items))\n    copy(result, s.items)\n    return result\n}\n\nfunc main() {\n    var s Stack[int]\n    s.Push(1)\n    s.Push(2)\n    s.Push(3)\n    fmt.Printf("Push 1,2,3 -> size=%d\\n", s.Size())\n\n    if top, ok := s.Peek(); ok {\n        fmt.Printf("Peek: %d\\n", top)\n    }\n\n    v1, _ := s.Pop()\n    v2, _ := s.Pop()\n    fmt.Printf("Pop: %d, Pop: %d\\n", v1, v2)\n    fmt.Printf("Size: %d\\n", s.Size())\n    fmt.Printf("ToSlice: %v\\n", s.ToSlice())\n\n    var ss Stack[string]\n    ss.Push("a")\n    ss.Push("b")\n    ss.Push("c")\n    sv, _ := ss.Pop()\n    fmt.Printf("String stack: Push a,b,c -> Pop: %s\\n", sv)\n}',
      explanation: 'var zero T инициализирует нулевое значение любого типа — это идиома для дженериков. items[:n-1] обрезает слайс, убирая последний элемент. copy в ToSlice создаёт независимую копию, защищая внутреннее состояние от внешних изменений.'
    },
    {
      id: 6,
      title: 'Обобщённая очередь (generic Queue)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй типобезопасную очередь (FIFO) с поддержкой итерации и конвертации в слайс.',
      requirements: [
        'Queue[T any] с Enqueue, Dequeue, Front, IsEmpty, Size',
        'Dequeue и Front возвращают (T, bool)',
        'Метод ForEach(func(T)) — итерация без извлечения',
        'Метод Filter(func(T) bool) *Queue[T] — создать новую очередь из подходящих элементов',
        'Демонстрация с очередью задач (строки)'
      ],
      expectedOutput: 'Enqueue: task1, task2, task3\nFront: task1\nDequeue: task1\nForEach: task2 task3\nFilter (len>5): [task2 task3]',
      hint: 'Очередь: Enqueue добавляет в конец (append), Dequeue берёт из начала (items[0]) и сдвигает items[1:]. Front только смотрит items[0]. ForEach: просто range.',
      solution: 'package main\n\nimport "fmt"\n\ntype Queue[T any] struct {\n    items []T\n}\n\nfunc (q *Queue[T]) Enqueue(item T) {\n    q.items = append(q.items, item)\n}\n\nfunc (q *Queue[T]) Dequeue() (T, bool) {\n    if len(q.items) == 0 {\n        var zero T\n        return zero, false\n    }\n    item := q.items[0]\n    q.items = q.items[1:]\n    return item, true\n}\n\nfunc (q *Queue[T]) Front() (T, bool) {\n    if len(q.items) == 0 {\n        var zero T\n        return zero, false\n    }\n    return q.items[0], true\n}\n\nfunc (q *Queue[T]) IsEmpty() bool { return len(q.items) == 0 }\nfunc (q *Queue[T]) Size() int     { return len(q.items) }\n\nfunc (q *Queue[T]) ForEach(fn func(T)) {\n    for _, item := range q.items {\n        fn(item)\n    }\n}\n\nfunc (q *Queue[T]) Filter(predicate func(T) bool) *Queue[T] {\n    newQ := &Queue[T]{}\n    for _, item := range q.items {\n        if predicate(item) {\n            newQ.Enqueue(item)\n        }\n    }\n    return newQ\n}\n\nfunc main() {\n    q := &Queue[string]{}\n    q.Enqueue("task1")\n    q.Enqueue("task2")\n    q.Enqueue("task3")\n    fmt.Printf("Enqueue: task1, task2, task3\\n")\n\n    if front, ok := q.Front(); ok {\n        fmt.Printf("Front: %s\\n", front)\n    }\n\n    if item, ok := q.Dequeue(); ok {\n        fmt.Printf("Dequeue: %s\\n", item)\n    }\n\n    fmt.Print("ForEach: ")\n    q.ForEach(func(s string) { fmt.Print(s, " ") })\n    fmt.Println()\n\n    long := q.Filter(func(s string) bool { return len(s) > 4 })\n    result := []string{}\n    long.ForEach(func(s string) { result = append(result, s) })\n    fmt.Printf("Filter (len>4): %v\\n", result)\n}',
      explanation: 'items[1:] сдвигает очередь — это O(n) операция. Для высоконагруженных систем используют кольцевой буфер или container/ring. Filter создаёт новую очередь — immutable-стиль. ForEach принимает функцию — это функциональный стиль итерации.'
    },
    {
      id: 7,
      title: 'Связный список (LinkedList)',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй двусвязный список с основными операциями: добавление, удаление, поиск и обход.',
      requirements: [
        'Узел Node[T any]: Value T, Next/Prev *Node[T]',
        'LinkedList[T comparable]: Head, Tail *Node[T], size int',
        'Методы: PushFront, PushBack, PopFront, PopBack, Remove(value T) bool',
        'Find(value T) *Node[T], Len() int, ToSlice() []T',
        'Вывести список после нескольких операций'
      ],
      expectedOutput: 'PushBack 1,2,3: [1 2 3]\nPushFront 0: [0 1 2 3]\nPopBack: 3, список: [0 1 2]\nRemove(1): true, список: [0 2]\nFind(2): найден',
      hint: 'Каждый узел имеет ссылки на предыдущий и следующий. PushBack: новый узел после Tail. PopFront: Head = Head.Next, Head.Prev = nil. Remove: найди узел и перелинкуй соседей.',
      solution: 'package main\n\nimport "fmt"\n\ntype Node[T any] struct {\n    Value T\n    Next  *Node[T]\n    Prev  *Node[T]\n}\n\ntype LinkedList[T comparable] struct {\n    Head *Node[T]\n    Tail *Node[T]\n    size int\n}\n\nfunc (l *LinkedList[T]) PushBack(v T) {\n    node := &Node[T]{Value: v}\n    if l.Tail == nil {\n        l.Head = node\n        l.Tail = node\n    } else {\n        node.Prev = l.Tail\n        l.Tail.Next = node\n        l.Tail = node\n    }\n    l.size++\n}\n\nfunc (l *LinkedList[T]) PushFront(v T) {\n    node := &Node[T]{Value: v}\n    if l.Head == nil {\n        l.Head = node\n        l.Tail = node\n    } else {\n        node.Next = l.Head\n        l.Head.Prev = node\n        l.Head = node\n    }\n    l.size++\n}\n\nfunc (l *LinkedList[T]) PopBack() (T, bool) {\n    if l.Tail == nil {\n        var zero T\n        return zero, false\n    }\n    v := l.Tail.Value\n    if l.Head == l.Tail {\n        l.Head = nil\n        l.Tail = nil\n    } else {\n        l.Tail = l.Tail.Prev\n        l.Tail.Next = nil\n    }\n    l.size--\n    return v, true\n}\n\nfunc (l *LinkedList[T]) PopFront() (T, bool) {\n    if l.Head == nil {\n        var zero T\n        return zero, false\n    }\n    v := l.Head.Value\n    l.Head = l.Head.Next\n    if l.Head != nil {\n        l.Head.Prev = nil\n    } else {\n        l.Tail = nil\n    }\n    l.size--\n    return v, true\n}\n\nfunc (l *LinkedList[T]) Remove(value T) bool {\n    node := l.Find(value)\n    if node == nil {\n        return false\n    }\n    if node.Prev != nil {\n        node.Prev.Next = node.Next\n    } else {\n        l.Head = node.Next\n    }\n    if node.Next != nil {\n        node.Next.Prev = node.Prev\n    } else {\n        l.Tail = node.Prev\n    }\n    l.size--\n    return true\n}\n\nfunc (l *LinkedList[T]) Find(value T) *Node[T] {\n    for n := l.Head; n != nil; n = n.Next {\n        if n.Value == value {\n            return n\n        }\n    }\n    return nil\n}\n\nfunc (l *LinkedList[T]) Len() int { return l.size }\n\nfunc (l *LinkedList[T]) ToSlice() []T {\n    result := make([]T, 0, l.size)\n    for n := l.Head; n != nil; n = n.Next {\n        result = append(result, n.Value)\n    }\n    return result\n}\n\nfunc main() {\n    list := &LinkedList[int]{}\n    list.PushBack(1)\n    list.PushBack(2)\n    list.PushBack(3)\n    fmt.Printf("PushBack 1,2,3: %v\\n", list.ToSlice())\n\n    list.PushFront(0)\n    fmt.Printf("PushFront 0: %v\\n", list.ToSlice())\n\n    v, _ := list.PopBack()\n    fmt.Printf("PopBack: %d, список: %v\\n", v, list.ToSlice())\n\n    removed := list.Remove(1)\n    fmt.Printf("Remove(1): %v, список: %v\\n", removed, list.ToSlice())\n\n    node := list.Find(2)\n    fmt.Printf("Find(2): найден=%v\\n", node != nil)\n}',
      explanation: 'Двусвязный список требует обновления четырёх ссылок при вставке/удалении. Важно обрабатывать граничные случаи: список из одного элемента, операции с головой и хвостом. Ограничение T comparable необходимо для операции сравнения в Find и Remove.'
    },
    {
      id: 8,
      title: 'Паттерн Iterator',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй паттерн Iterator для обхода коллекции без раскрытия её внутренней структуры.',
      requirements: [
        'Интерфейс Iterator[T any]: HasNext() bool, Next() T, Reset()',
        'SliceIterator[T any] — итератор по слайсу',
        'RangeIterator — итератор по числовому диапазону [start, end) с шагом step',
        'FilterIterator[T any] — итератор с фильтрацией',
        'Функция Collect[T any](iter Iterator[T]) []T'
      ],
      expectedOutput: 'SliceIterator [1,2,3,4,5]: 1 2 3 4 5\nRangeIterator [0,10,2]: 0 2 4 6 8\nFilterIterator (чётные): 2 4',
      hint: 'SliceIterator: хранит index int. HasNext: index < len. Next: возвращает items[index] и увеличивает index. RangeIterator: хранит current, сравнивает с end.',
      solution: 'package main\n\nimport "fmt"\n\ntype Iterator[T any] interface {\n    HasNext() bool\n    Next() T\n    Reset()\n}\n\ntype SliceIterator[T any] struct {\n    items []T\n    index int\n}\n\nfunc NewSliceIterator[T any](items []T) *SliceIterator[T] {\n    return &SliceIterator[T]{items: items}\n}\n\nfunc (it *SliceIterator[T]) HasNext() bool { return it.index < len(it.items) }\nfunc (it *SliceIterator[T]) Next() T {\n    item := it.items[it.index]\n    it.index++\n    return item\n}\nfunc (it *SliceIterator[T]) Reset() { it.index = 0 }\n\ntype RangeIterator struct {\n    start, end, step, current int\n}\n\nfunc NewRangeIterator(start, end, step int) *RangeIterator {\n    return &RangeIterator{start: start, end: end, step: step, current: start}\n}\n\nfunc (it *RangeIterator) HasNext() bool { return it.current < it.end }\nfunc (it *RangeIterator) Next() int {\n    v := it.current\n    it.current += it.step\n    return v\n}\nfunc (it *RangeIterator) Reset() { it.current = it.start }\n\ntype FilterIterator[T any] struct {\n    inner     Iterator[T]\n    predicate func(T) bool\n    nextItem  T\n    hasNext   bool\n}\n\nfunc NewFilterIterator[T any](inner Iterator[T], pred func(T) bool) *FilterIterator[T] {\n    it := &FilterIterator[T]{inner: inner, predicate: pred}\n    it.advance()\n    return it\n}\n\nfunc (it *FilterIterator[T]) advance() {\n    for it.inner.HasNext() {\n        v := it.inner.Next()\n        if it.predicate(v) {\n            it.nextItem = v\n            it.hasNext = true\n            return\n        }\n    }\n    it.hasNext = false\n}\n\nfunc (it *FilterIterator[T]) HasNext() bool { return it.hasNext }\nfunc (it *FilterIterator[T]) Next() T {\n    v := it.nextItem\n    it.advance()\n    return v\n}\nfunc (it *FilterIterator[T]) Reset() {\n    it.inner.Reset()\n    it.advance()\n}\n\nfunc Collect[T any](iter Iterator[T]) []T {\n    var result []T\n    for iter.HasNext() {\n        result = append(result, iter.Next())\n    }\n    return result\n}\n\nfunc main() {\n    it1 := NewSliceIterator([]int{1, 2, 3, 4, 5})\n    fmt.Print("SliceIterator [1,2,3,4,5]: ")\n    for it1.HasNext() {\n        fmt.Print(it1.Next(), " ")\n    }\n    fmt.Println()\n\n    it2 := NewRangeIterator(0, 10, 2)\n    fmt.Printf("RangeIterator [0,10,2]: %v\\n", Collect[int](it2))\n\n    base := NewSliceIterator([]int{1, 2, 3, 4, 5})\n    it3 := NewFilterIterator[int](base, func(n int) bool { return n%2 == 0 })\n    fmt.Print("FilterIterator (чётные): ")\n    for it3.HasNext() {\n        fmt.Print(it3.Next(), " ")\n    }\n    fmt.Println()\n}',
      explanation: 'FilterIterator хранит следующий подходящий элемент заранее (advance) — это паттерн look-ahead, необходимый для корректной реализации HasNext с фильтрацией. Collect — удобная утилита, работающая с любым Iterator[T] через дженерики.'
    },
    {
      id: 9,
      title: 'Иерархия Animal',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай иерархию животных через встраивание структур и интерфейсы. Реализуй полиморфное поведение.',
      requirements: [
        'BaseAnimal: Name, Age с общими методами Describe()',
        'Интерфейс Animal: Sound() string, Move() string, Describe() string',
        'Dog (встраивает BaseAnimal): Sound="Woof", Move="бежит"',
        'Cat (встраивает BaseAnimal): Sound="Meow", Move="крадётся"',
        'Bird (встраивает BaseAnimal): Sound="Tweet", Move="летит", HasWings bool',
        'Функция MakeNoise(animals []Animal) — все животные издают звук'
      ],
      expectedOutput: 'Рекс (3 лет): Sound=Woof, Move=бежит\nМурка (2 лет): Sound=Meow, Move=крадётся\nКеша (1 лет): Sound=Tweet, Move=летит\nMakeNoise: Рекс: Woof! Мурка: Meow! Кеша: Tweet!',
      hint: 'BaseAnimal не реализует Animal (нет Sound/Move) — только содержит общие поля. Dog встраивает BaseAnimal и добавляет Sound/Move методы. Это не наследование, это композиция.',
      solution: 'package main\n\nimport "fmt"\n\ntype BaseAnimal struct {\n    Name string\n    Age  int\n}\n\nfunc (a BaseAnimal) Describe() string {\n    return fmt.Sprintf("%s (%d лет)", a.Name, a.Age)\n}\n\ntype Animal interface {\n    Sound() string\n    Move() string\n    Describe() string\n}\n\ntype Dog struct {\n    BaseAnimal\n    Breed string\n}\n\nfunc (d Dog) Sound() string { return "Woof" }\nfunc (d Dog) Move() string  { return "бежит" }\n\ntype Cat struct {\n    BaseAnimal\n    Indoor bool\n}\n\nfunc (c Cat) Sound() string { return "Meow" }\nfunc (c Cat) Move() string  { return "крадётся" }\n\ntype Bird struct {\n    BaseAnimal\n    HasWings bool\n}\n\nfunc (b Bird) Sound() string { return "Tweet" }\nfunc (b Bird) Move() string  { return "летит" }\n\nfunc MakeNoise(animals []Animal) {\n    fmt.Print("MakeNoise: ")\n    for i, a := range animals {\n        if i > 0 {\n            fmt.Print(" ")\n        }\n        fmt.Printf("%s: %s!", a.Describe()[:len([]rune(a.Describe()))], a.Sound())\n    }\n    fmt.Println()\n}\n\nfunc printAnimal(a Animal) {\n    fmt.Printf("%s: Sound=%s, Move=%s\\n", a.Describe(), a.Sound(), a.Move())\n}\n\nfunc main() {\n    dog := Dog{BaseAnimal: BaseAnimal{Name: "Рекс", Age: 3}, Breed: "Лабрадор"}\n    cat := Cat{BaseAnimal: BaseAnimal{Name: "Мурка", Age: 2}}\n    bird := Bird{BaseAnimal: BaseAnimal{Name: "Кеша", Age: 1}, HasWings: true}\n\n    animals := []Animal{dog, cat, bird}\n    for _, a := range animals {\n        printAnimal(a)\n    }\n\n    fmt.Print("MakeNoise: ")\n    for i, a := range animals {\n        if i > 0 {\n            fmt.Print(" ")\n        }\n        fmt.Printf("%s: %s!", a.Describe(), a.Sound())\n    }\n    fmt.Println()\n}',
      explanation: 'Встраивание BaseAnimal (не указатель) — значит Dog содержит копию полей. Методы BaseAnimal (Describe) продвигаются в Dog, поэтому Dog автоматически реализует часть интерфейса. Полиморфизм через []Animal — одна функция работает с любым животным.'
    },
    {
      id: 10,
      title: 'Интерфейс Serializable',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй интерфейс Serializable для сериализации/десериализации структур в JSON и простой текстовый формат.',
      requirements: [
        'Интерфейс Serializable: Marshal() ([]byte, error), Unmarshal([]byte) error, Format() string',
        'Config: host string, port int, debug bool — реализует Serializable в JSON формате',
        'Record: ID, Title, Tags — реализует Serializable',
        'Функция SaveAndLoad[T Serializable](s T, filename string) — демо сохранения',
        'Функция Clone[T Serializable](s T) (T, error) через Marshal/Unmarshal'
      ],
      expectedOutput: 'Config marshal: {"host":"localhost","port":8080,"debug":true}\nConfig format: Config{host=localhost, port=8080}\nRecord marshal: {"id":1,"title":"Go Guide","tags":["go","programming"]}\nClone config: localhost:9090',
      hint: 'encoding/json для Marshal/Unmarshal. Unmarshal принимает []byte и изменяет receiver — нужен pointer receiver. Clone: Marshal -> новый объект -> Unmarshal.',
      solution: 'package main\n\nimport (\n    "encoding/json"\n    "fmt"\n    "strings"\n)\n\ntype Serializable interface {\n    Marshal() ([]byte, error)\n    Unmarshal([]byte) error\n    Format() string\n}\n\ntype Config struct {\n    Host  string `json:"host"`\n    Port  int    `json:"port"`\n    Debug bool   `json:"debug"`\n}\n\nfunc (c *Config) Marshal() ([]byte, error) {\n    return json.Marshal(c)\n}\n\nfunc (c *Config) Unmarshal(data []byte) error {\n    return json.Unmarshal(data, c)\n}\n\nfunc (c *Config) Format() string {\n    return fmt.Sprintf("Config{host=%s, port=%d}", c.Host, c.Port)\n}\n\ntype Record struct {\n    ID    int      `json:"id"`\n    Title string   `json:"title"`\n    Tags  []string `json:"tags"`\n}\n\nfunc (r *Record) Marshal() ([]byte, error) {\n    return json.Marshal(r)\n}\n\nfunc (r *Record) Unmarshal(data []byte) error {\n    return json.Unmarshal(data, r)\n}\n\nfunc (r *Record) Format() string {\n    return fmt.Sprintf("Record{id=%d, title=%q, tags=[%s]}", r.ID, r.Title, strings.Join(r.Tags, ","))\n}\n\nfunc CloneConfig(src *Config) (*Config, error) {\n    data, err := src.Marshal()\n    if err != nil {\n        return nil, err\n    }\n    dst := &Config{}\n    if err := dst.Unmarshal(data); err != nil {\n        return nil, err\n    }\n    return dst, nil\n}\n\nfunc main() {\n    cfg := &Config{Host: "localhost", Port: 8080, Debug: true}\n    data, _ := cfg.Marshal()\n    fmt.Printf("Config marshal: %s\\n", data)\n    fmt.Printf("Config format: %s\\n", cfg.Format())\n\n    rec := &Record{ID: 1, Title: "Go Guide", Tags: []string{"go", "programming"}}\n    rdata, _ := rec.Marshal()\n    fmt.Printf("Record marshal: %s\\n", rdata)\n\n    // Clone и изменение клона\n    cfg2, _ := CloneConfig(cfg)\n    cfg2.Port = 9090\n    fmt.Printf("Clone config: %s:%d\\n", cfg2.Host, cfg2.Port)\n    fmt.Printf("Оригинал не изменён: port=%d\\n", cfg.Port)\n}',
      explanation: 'Pointer receiver необходим для Unmarshal — он модифицирует структуру. Marshal может работать как с value, так и с pointer receiver. Clone через Marshal/Unmarshal — идиоматичный способ глубокого копирования структур с JSON. Интерфейс Serializable открывает возможность для функций работающих с любым сериализуемым типом.'
    }
  ]
}
