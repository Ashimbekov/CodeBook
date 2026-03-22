export default {
  id: 16,
  title: 'Указатели',
  description: 'Указатели в Go — это адреса в памяти. Понимание указателей необходимо для эффективной работы со структурами, методами и передачей данных по ссылке.',
  lessons: [
    {
      id: 1,
      title: 'Что такое указатель?',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Адреса в памяти'
        },
        {
          type: 'text',
          value: 'Указатель — это переменная, которая хранит адрес памяти другой переменной. Аналогия: если переменная — это дом, то указатель — это бумажка с адресом этого дома. Вы можете передать бумажку кому угодно, и они найдут дом напрямую.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    x := 42\n    \n    // & — оператор взятия адреса\n    p := &x // p хранит адрес переменной x\n    \n    fmt.Println("Значение x:", x)  // 42\n    fmt.Println("Адрес x:", p)     // 0xc000014088 (адрес в памяти)\n    fmt.Println("Тип p:", fmt.Sprintf("%T", p)) // *int\n    \n    // * — оператор разыменования (получение значения по адресу)\n    fmt.Println("Значение через p:", *p) // 42\n    \n    // Изменение значения через указатель\n    *p = 100\n    fmt.Println("x после *p = 100:", x) // 100 — x изменился!\n}'
        },
        {
          type: 'note',
          value: 'Тип указателя записывается как *T (звёздочка + тип). Указатель на int — это *int, на string — *string, на struct — *MyStruct. Нулевое значение указателя — nil.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    a := 10\n    b := 20\n    \n    pa := &a\n    pb := &b\n    \n    fmt.Printf("a=%d (адрес: %p)\\n", a, pa)\n    fmt.Printf("b=%d (адрес: %p)\\n", b, pb)\n    \n    // Указатели разные — разные адреса в памяти\n    fmt.Println("pa == pb?", pa == pb) // false\n    \n    // Указатель можно переприсвоить\n    pa = pb // теперь pa указывает туда же, куда pb (на b)\n    *pa = 99\n    fmt.Println("b =", b) // 99\n}'
        }
      ]
    },
    {
      id: 2,
      title: 'Операторы & и *',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Взятие адреса и разыменование'
        },
        {
          type: 'text',
          value: 'Два ключевых оператора для работы с указателями: & (амперсанд) берёт адрес переменной, * (звёздочка) разыменовывает указатель (получает значение по адресу). Запомните: & — "дай мне адрес", * — "дай мне значение по адресу".'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    n := 5\n    \n    // & берёт адрес\n    ptr := &n\n    fmt.Printf("ptr = %p\\n", ptr) // адрес n\n    \n    // * разыменовывает\n    val := *ptr\n    fmt.Println("val =", val) // 5\n    \n    // Двойное разыменование через двойной указатель\n    pptr := &ptr // указатель на указатель\n    fmt.Println("**pptr =", **pptr) // 5\n    \n    **pptr = 42\n    fmt.Println("n =", n) // 42\n}'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\n// Функция, изменяющая значение через указатель\nfunc increment(n *int) {\n    *n++ // разыменовываем и инкрементируем\n}\n\nfunc resetToZero(n *int) {\n    *n = 0\n}\n\nfunc main() {\n    x := 10\n    \n    increment(&x) // передаём адрес x\n    fmt.Println(x) // 11\n    \n    increment(&x)\n    fmt.Println(x) // 12\n    \n    resetToZero(&x)\n    fmt.Println(x) // 0\n}'
        },
        {
          type: 'tip',
          value: 'Символ * используется в двух контекстах: в объявлении типа (*int — тип "указатель на int") и как оператор (*p — "получить значение по указателю"). Контекст определяет смысл.'
        }
      ]
    },
    {
      id: 3,
      title: 'Указатели на структуры',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Автоматическое разыменование полей'
        },
        {
          type: 'text',
          value: 'При работе с указателями на структуры Go автоматически разыменовывает их при обращении к полям. Вам не нужно писать (*p).Field — можно просто p.Field. Это синтаксический сахар для удобства.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\ntype Person struct {\n    Name string\n    Age  int\n}\n\nfunc birthday(p *Person) {\n    p.Age++ // автоматическое разыменование: (*p).Age++\n}\n\nfunc main() {\n    alice := Person{Name: "Алиса", Age: 30}\n    \n    // Указатель на структуру\n    p := &alice\n    \n    // Оба варианта работают одинаково:\n    fmt.Println((*p).Name) // Алиса — явное разыменование\n    fmt.Println(p.Name)    // Алиса — автоматическое разыменование\n    \n    birthday(p)\n    fmt.Println("Возраст:", alice.Age) // 31 — alice изменился!\n    \n    // Передача без &\n    birthday(&alice)\n    fmt.Println("Возраст:", alice.Age) // 32\n}'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\ntype Config struct {\n    Debug   bool\n    Timeout int\n    Host    string\n}\n\n// Функция возвращает указатель на новую структуру\nfunc newConfig() *Config {\n    return &Config{\n        Debug:   false,\n        Timeout: 30,\n        Host:    "localhost",\n    }\n}\n\nfunc main() {\n    cfg := newConfig()\n    fmt.Println(cfg.Host) // localhost\n    \n    cfg.Debug = true\n    cfg.Timeout = 60\n    fmt.Printf("%+v\\n", *cfg) // {Debug:true Timeout:60 Host:localhost}\n}'
        }
      ]
    },
    {
      id: 4,
      title: 'Nil указатели',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Указатель без адреса — nil'
        },
        {
          type: 'text',
          value: 'Nil указатель — это указатель, который ни на что не указывает. Попытка разыменовать nil указатель вызывает панику (panic). Это как попытка пойти по адресу "нигде" — невозможно. Всегда проверяйте указатель на nil перед использованием.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\ntype Node struct {\n    Value int\n    Next  *Node // указатель на следующий узел (может быть nil)\n}\n\nfunc printList(n *Node) {\n    for n != nil { // проверяем на nil перед разыменованием!\n        fmt.Printf("%d -> ", n.Value)\n        n = n.Next\n    }\n    fmt.Println("nil")\n}\n\nfunc main() {\n    // nil указатель\n    var p *int\n    fmt.Println(p)        // <nil>\n    fmt.Println(p == nil) // true\n    \n    // ПАНИКА! Не делайте так без проверки:\n    // fmt.Println(*p) // panic: runtime error: nil pointer dereference\n    \n    // Связный список через указатели\n    list := &Node{1, &Node{2, &Node{3, nil}}}\n    printList(list) // 1 -> 2 -> 3 -> nil\n}'
        },
        {
          type: 'warning',
          value: 'Nil pointer dereference — одна из самых частых причин паник в Go. Всегда проверяйте указатель на nil, если он может быть nil. Особенно важно при работе с полями структур-указателей.'
        }
      ]
    },
    {
      id: 5,
      title: 'Передача по указателю vs по значению',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Когда передавать по указателю?'
        },
        {
          type: 'text',
          value: 'Выбор между передачей по значению и по указателю влияет на производительность и семантику. По значению — безопасно, копия не изменит оригинал. По указателю — эффективно для больших структур и позволяет изменять оригинал.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\ntype BigStruct struct {\n    Data [1000]int // большой массив\n}\n\n// По значению: копируется весь BigStruct (~8KB)\nfunc processByValue(s BigStruct) {\n    s.Data[0] = 999 // изменяет копию, не оригинал\n}\n\n// По указателю: копируется только адрес (8 байт)\nfunc processByPointer(s *BigStruct) {\n    s.Data[0] = 999 // изменяет оригинал!\n}\n\nfunc main() {\n    s := BigStruct{}\n    s.Data[0] = 1\n    \n    processByValue(s)\n    fmt.Println("После byValue:", s.Data[0]) // 1 (не изменился)\n    \n    processByPointer(&s)\n    fmt.Println("После byPointer:", s.Data[0]) // 999 (изменился!)\n}'
        },
        {
          type: 'list',
          value: 'Используйте указатель когда:\n- Функция должна изменить переданные данные\n- Структура большая (>64 байт) — для эффективности\n- Нужно разделить доступ к одним данным между несколькими частями кода\n\nИспользуйте значение когда:\n- Нужна защита от случайных изменений (immutability)\n- Структура маленькая (int, bool, небольшие структуры)\n- Хотите независимую копию данных'
        }
      ]
    },
    {
      id: 6,
      title: 'Функция new()',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Выделение памяти через new()'
        },
        {
          type: 'text',
          value: 'Функция new(T) выделяет память для значения типа T, инициализирует его нулевым значением и возвращает указатель *T. Это альтернатива &T{} для создания указателей на нулевые значения.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\ntype Point struct {\n    X, Y int\n}\n\nfunc main() {\n    // new() выделяет память и возвращает указатель\n    p := new(int)    // *int, значение 0\n    fmt.Println(*p)  // 0\n    *p = 42\n    fmt.Println(*p)  // 42\n    \n    // new для структуры\n    pt := new(Point) // *Point, {0, 0}\n    fmt.Println(*pt) // {0 0}\n    pt.X = 10\n    pt.Y = 20\n    fmt.Println(*pt) // {10 20}\n    \n    // Эквивалентные способы создания указателя на структуру\n    p1 := new(Point)    // нулевая структура\n    p2 := &Point{}      // тоже нулевая структура\n    p3 := &Point{1, 2}  // со значениями\n    \n    fmt.Println(*p1, *p2, *p3) // {0 0} {0 0} {1 2}\n}'
        },
        {
          type: 'note',
          value: 'В большинстве случаев &T{} удобнее new(T), потому что позволяет сразу инициализировать поля. new() используется реже, в основном для простых типов (int, bool).'
        }
      ]
    },
    {
      id: 7,
      title: 'Практика: Связный список',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте связный список (linked list) с функциями: push (добавить в начало), pop (удалить из начала), print (вывести все элементы). Используйте указатели для связи узлов.',
      requirements: [
        'Структура Node с полями Value int и Next *Node',
        'Структура LinkedList с полем Head *Node',
        'Метод Push(value int) — добавить элемент в начало',
        'Метод Pop() (int, bool) — удалить и вернуть элемент из начала',
        'Метод Print() — вывести все элементы'
      ],
      expectedOutput: '3 -> 2 -> 1 -> nil\nPopped: 3\n2 -> 1 -> nil',
      hint: 'При Push создайте новый Node с Next = head. При Pop проверьте head на nil, сохраните значение, переместите head на head.Next.',
      solution: 'package main\n\nimport "fmt"\n\ntype Node struct {\n    Value int\n    Next  *Node\n}\n\ntype LinkedList struct {\n    Head *Node\n    size int\n}\n\nfunc (l *LinkedList) Push(value int) {\n    l.Head = &Node{Value: value, Next: l.Head}\n    l.size++\n}\n\nfunc (l *LinkedList) Pop() (int, bool) {\n    if l.Head == nil {\n        return 0, false\n    }\n    value := l.Head.Value\n    l.Head = l.Head.Next\n    l.size--\n    return value, true\n}\n\nfunc (l *LinkedList) Print() {\n    for n := l.Head; n != nil; n = n.Next {\n        fmt.Printf("%d -> ", n.Value)\n    }\n    fmt.Println("nil")\n}\n\nfunc main() {\n    list := &LinkedList{}\n    \n    list.Push(1)\n    list.Push(2)\n    list.Push(3)\n    list.Print() // 3 -> 2 -> 1 -> nil\n    \n    if val, ok := list.Pop(); ok {\n        fmt.Println("Popped:", val) // Popped: 3\n    }\n    list.Print() // 2 -> 1 -> nil\n    \n    // Пустой список\n    list2 := &LinkedList{}\n    _, ok := list2.Pop()\n    fmt.Println("Pop из пустого:", ok) // false\n}',
      explanation: 'Связный список — классический пример использования указателей. Каждый узел содержит указатель на следующий узел, образуя цепочку. Push добавляет новый узел в начало, делая его новым head. Pop берёт значение из head и перемещает head на следующий узел.'
    }
  ]
}
