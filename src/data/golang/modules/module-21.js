export default {
  id: 21,
  title: 'Композиция вместо наследования',
  description: 'Go не поддерживает наследование классов — вместо этого используется композиция через встраивание структур. Это мощный механизм, который даёт гибкость без сложностей наследования.',
  lessons: [
    {
      id: 1,
      title: 'Почему Go выбрал композицию',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'В большинстве объектно-ориентированных языков (Java, C++, Python) есть наследование: класс-потомок наследует поля и методы класса-родителя. Go сознательно отказался от этого механизма.'
        },
        {
          type: 'heading',
          value: 'Проблемы наследования'
        },
        {
          type: 'list',
          value: 'Хрупкий базовый класс: изменение родителя ломает потомков\nГлубокие иерархии сложно понимать и поддерживать\nЗависимость от реализации родителя, а не от интерфейса\nПроблема ромба: неоднозначность при множественном наследовании'
        },
        {
          type: 'text',
          value: 'Go предлагает альтернативу: композицию через встраивание (embedding). Представьте конструктор LEGO: вместо того чтобы создавать один монолитный блок, вы собираете сложные вещи из простых кирпичиков.'
        },
        {
          type: 'note',
          value: 'Принцип Go: "Предпочитай композицию наследованию" — это один из ключевых принципов проектирования в Go, унаследованный из книги "Design Patterns" (Gang of Four).'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\n// Вместо наследования — встраивание\ntype Animal struct {\n    Name string\n    Age  int\n}\n\nfunc (a Animal) Describe() string {\n    return fmt.Sprintf("%s, возраст %d лет", a.Name, a.Age)\n}\n\n// Dog "содержит" Animal, а не "наследует" от него\ntype Dog struct {\n    Animal        // встраивание (embedding)\n    Breed  string\n}\n\nfunc main() {\n    d := Dog{\n        Animal: Animal{Name: "Бобик", Age: 3},\n        Breed:  "Лабрадор",\n    }\n    \n    // Доступ к полям Animal напрямую\n    fmt.Println(d.Name)       // Бобик\n    fmt.Println(d.Age)        // 3\n    fmt.Println(d.Breed)      // Лабрадор\n    \n    // Вызов метода Animal напрямую\n    fmt.Println(d.Describe()) // Бобик, возраст 3 лет\n}'
        }
      ]
    },
    {
      id: 2,
      title: 'Встраивание структур (embedding)',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Встраивание — это когда одна структура включает другую структуру без указания имени поля. Встроенная структура становится "анонимным полем".'
        },
        {
          type: 'heading',
          value: 'Синтаксис встраивания'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\ntype Address struct {\n    Street string\n    City   string\n    Zip    string\n}\n\nfunc (a Address) FullAddress() string {\n    return fmt.Sprintf("%s, %s %s", a.Street, a.City, a.Zip)\n}\n\ntype Person struct {\n    Name    string\n    Age     int\n    Address // встроенная структура (без имени поля!)\n}\n\ntype Company struct {\n    CompanyName string\n    Address     // та же Address встроена в Company\n}\n\nfunc main() {\n    p := Person{\n        Name: "Алибек",\n        Age:  30,\n        Address: Address{\n            Street: "ул. Абая 10",\n            City:   "Алматы",\n            Zip:    "050000",\n        },\n    }\n    \n    // Продвинутые поля: доступ напрямую\n    fmt.Println(p.City)         // Алматы (через embedding)\n    fmt.Println(p.Address.City) // Алматы (явный доступ)\n    \n    // Продвинутые методы\n    fmt.Println(p.FullAddress()) // ул. Абая 10, Алматы 050000\n    \n    c := Company{\n        CompanyName: "Tech Inc",\n        Address: Address{\n            Street: "пр. Достык 5",\n            City:   "Алматы",\n            Zip:    "050010",\n        },\n    }\n    fmt.Println(c.FullAddress()) // пр. Достык 5, Алматы 050010\n}'
        },
        {
          type: 'heading',
          value: 'Именованное поле vs встраивание'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\ntype Engine struct {\n    Horsepower int\n    Cylinders  int\n}\n\nfunc (e Engine) Start() string {\n    return fmt.Sprintf("Двигатель %d л.с. запущен!", e.Horsepower)\n}\n\n// Вариант 1: именованное поле — нужно явно обращаться\ntype CarWithField struct {\n    Model  string\n    Engine Engine // именованное поле\n}\n\n// Вариант 2: встраивание — методы "продвигаются"\ntype CarEmbedded struct {\n    Model  string\n    Engine // встраивание\n}\n\nfunc main() {\n    c1 := CarWithField{\n        Model:  "Toyota",\n        Engine: Engine{Horsepower: 150, Cylinders: 4},\n    }\n    \n    c2 := CarEmbedded{\n        Model:  "Honda",\n        Engine: Engine{Horsepower: 180, Cylinders: 6},\n    }\n    \n    // Именованное поле — нужен явный доступ\n    fmt.Println(c1.Engine.Start())    // OK\n    // fmt.Println(c1.Start())        // ОШИБКА! метод не продвигается\n    \n    // Встраивание — методы доступны напрямую\n    fmt.Println(c2.Start())           // OK! метод продвинут\n    fmt.Println(c2.Engine.Start())    // тоже OK (явный доступ)\n    fmt.Println(c2.Horsepower)        // 180 — поле тоже продвинуто\n}'
        },
        {
          type: 'tip',
          value: 'Используйте встраивание когда хотите "расширить" тип. Используйте именованное поле когда структура — лишь "часть" объекта, а не его основа.'
        }
      ]
    },
    {
      id: 3,
      title: 'Продвинутые методы (promoted methods)',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Когда вы встраиваете структуру, её методы "продвигаются" во внешнюю структуру. Это как если бы вы автоматически делегировали вызовы внутреннему объекту. Лифт в здании — вы попали во внешнее здание (внешняя структура), но кнопки лифта (методы встроенной структуры) доступны вам сразу.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\ntype Logger struct {\n    Prefix string\n}\n\nfunc (l Logger) Log(msg string) {\n    fmt.Printf("[%s] %s\\n", l.Prefix, msg)\n}\n\nfunc (l Logger) LogError(msg string) {\n    fmt.Printf("[%s][ERROR] %s\\n", l.Prefix, msg)\n}\n\ntype Service struct {\n    Name   string\n    Logger // встраиваем Logger\n}\n\nfunc (s *Service) DoWork() {\n    s.Log("Начинаю работу...")    // вызов метода Logger\n    // ... бизнес-логика ...\n    s.Log("Работа завершена!")\n}\n\ntype Database struct {\n    Host string\n    Port int\n    Logger // тот же Logger встроен\n}\n\nfunc (db *Database) Connect() {\n    db.Log(fmt.Sprintf("Подключаюсь к %s:%d", db.Host, db.Port))\n}\n\nfunc main() {\n    svc := Service{\n        Name:   "UserService",\n        Logger: Logger{Prefix: "UserService"},\n    }\n    \n    db := Database{\n        Host:   "localhost",\n        Port:   5432,\n        Logger: Logger{Prefix: "DB"},\n    }\n    \n    svc.DoWork()\n    // [UserService] Начинаю работу...\n    // [UserService] Работа завершена!\n    \n    db.Connect()\n    // [DB] Подключаюсь к localhost:5432\n    \n    svc.LogError("Что-то пошло не так")\n    // [UserService][ERROR] Что-то пошло не так\n}'
        },
        {
          type: 'heading',
          value: 'Переопределение продвинутых методов'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\ntype Base struct{}\n\nfunc (b Base) Hello() string {\n    return "Привет от Base!"\n}\n\nfunc (b Base) Greet(name string) string {\n    return b.Hello() + " " + name // вызов собственного метода\n}\n\ntype Child struct {\n    Base\n}\n\n// Переопределяем метод Hello в Child\nfunc (c Child) Hello() string {\n    return "Привет от Child!"\n}\n\nfunc main() {\n    b := Base{}\n    c := Child{}\n    \n    fmt.Println(b.Hello())        // Привет от Base!\n    fmt.Println(c.Hello())        // Привет от Child! (переопределён)\n    \n    // ВАЖНО: Greet вызывает Base.Hello, а не Child.Hello\n    // Go НЕ поддерживает виртуальные методы!\n    fmt.Println(b.Greet("Нурик")) // Привет от Base! Нурик\n    fmt.Println(c.Greet("Нурик")) // Привет от Base! Нурик (не Child!)\n    \n    // Явный вызов Base.Hello через c\n    fmt.Println(c.Base.Hello())   // Привет от Base!\n}'
        },
        {
          type: 'warning',
          value: 'В Go нет виртуальных методов! Встроенный тип не знает о внешнем. Если Base.Greet вызывает Base.Hello, то Child.Greet тоже вызовет Base.Hello, даже если Child переопределил Hello. Это фундаментальное отличие от наследования в ООП.'
        }
      ]
    },
    {
      id: 4,
      title: 'Паттерны композиции',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Рассмотрим реальные паттерны использования композиции в Go. Как из кирпичиков строят дом — так из простых структур строят сложные системы.'
        },
        {
          type: 'heading',
          value: 'Паттерн: Миксин (Mixin)'
        },
        {
          type: 'text',
          value: 'Добавление повторяющегося поведения к разным структурам через встраивание.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "time"\n)\n\n// Миксин для временных меток\ntype Timestamps struct {\n    CreatedAt time.Time\n    UpdatedAt time.Time\n}\n\nfunc (t *Timestamps) Touch() {\n    t.UpdatedAt = time.Now()\n}\n\nfunc (t Timestamps) Age() string {\n    return fmt.Sprintf("Создано: %s", t.CreatedAt.Format("02.01.2006"))\n}\n\n// Миксин для мягкого удаления\ntype SoftDelete struct {\n    DeletedAt *time.Time\n    IsDeleted bool\n}\n\nfunc (s *SoftDelete) Delete() {\n    now := time.Now()\n    s.DeletedAt = &now\n    s.IsDeleted = true\n}\n\n// User использует оба миксина\ntype User struct {\n    ID    int\n    Name  string\n    Email string\n    Timestamps\n    SoftDelete\n}\n\n// Post использует только Timestamps\ntype Post struct {\n    ID      int\n    Title   string\n    Content string\n    Timestamps\n}\n\nfunc main() {\n    u := User{\n        ID:    1,\n        Name:  "Айжан",\n        Email: "aizhan@example.com",\n        Timestamps: Timestamps{\n            CreatedAt: time.Now(),\n            UpdatedAt: time.Now(),\n        },\n    }\n    \n    fmt.Println(u.Age())\n    fmt.Println("Удалён:", u.IsDeleted) // false\n    u.Delete()\n    fmt.Println("Удалён:", u.IsDeleted) // true\n    u.Touch()\n    fmt.Println("Обновлено:", u.UpdatedAt.Format("15:04:05"))\n}'
        },
        {
          type: 'heading',
          value: 'Паттерн: Декоратор через встраивание'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\ntype ReadWriter interface {\n    Read() string\n    Write(data string)\n}\n\ntype FileStorage struct {\n    data string\n    name string\n}\n\nfunc (f *FileStorage) Read() string {\n    return f.data\n}\n\nfunc (f *FileStorage) Write(data string) {\n    f.data = data\n    fmt.Printf("Записано в файл %s: %s\\n", f.name, data)\n}\n\n// Кешируемое хранилище — декоратор поверх FileStorage\ntype CachedStorage struct {\n    *FileStorage       // встраиваем указатель!\n    cache map[string]string\n}\n\nfunc NewCachedStorage(name string) *CachedStorage {\n    return &CachedStorage{\n        FileStorage: &FileStorage{name: name},\n        cache:       make(map[string]string),\n    }\n}\n\n// Переопределяем Read с кешированием\nfunc (c *CachedStorage) Read() string {\n    if val, ok := c.cache["data"]; ok {\n        fmt.Println("Из кеша!")\n        return val\n    }\n    result := c.FileStorage.Read() // явный вызов оригинала\n    c.cache["data"] = result\n    return result\n}\n\nfunc main() {\n    cs := NewCachedStorage("test.txt")\n    cs.Write("Hello, World!")\n    \n    fmt.Println(cs.Read()) // из файла\n    fmt.Println(cs.Read()) // Из кеша!\n    fmt.Println(cs.Read()) // Из кеша!\n}'
        }
      ]
    },
    {
      id: 5,
      title: 'Композиция с интерфейсами',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Настоящая сила Go проявляется когда встраивание комбинируется с интерфейсами. Интерфейсы тоже поддерживают встраивание — это позволяет строить составные интерфейсы.'
        },
        {
          type: 'heading',
          value: 'Встраивание интерфейсов'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\n// Маленькие интерфейсы\ntype Reader interface {\n    Read() ([]byte, error)\n}\n\ntype Writer interface {\n    Write(p []byte) (int, error)\n}\n\ntype Closer interface {\n    Close() error\n}\n\n// Составные интерфейсы через встраивание\ntype ReadWriter interface {\n    Reader\n    Writer\n}\n\ntype ReadWriteCloser interface {\n    Reader\n    Writer\n    Closer\n}\n\n// Реализация\ntype Buffer struct {\n    data   []byte\n    closed bool\n}\n\nfunc (b *Buffer) Read() ([]byte, error) {\n    if b.closed {\n        return nil, fmt.Errorf("буфер закрыт")\n    }\n    return b.data, nil\n}\n\nfunc (b *Buffer) Write(p []byte) (int, error) {\n    if b.closed {\n        return 0, fmt.Errorf("буфер закрыт")\n    }\n    b.data = append(b.data, p...)\n    return len(p), nil\n}\n\nfunc (b *Buffer) Close() error {\n    b.closed = true\n    fmt.Println("Буфер закрыт")\n    return nil\n}\n\n// Функция принимает составной интерфейс\nfunc processData(rwc ReadWriteCloser) {\n    rwc.Write([]byte("Hello, Go!"))\n    data, _ := rwc.Read()\n    fmt.Printf("Прочитано: %s\\n", data)\n    rwc.Close()\n}\n\nfunc main() {\n    buf := &Buffer{}\n    processData(buf)\n    // Прочитано: Hello, Go!\n    // Буфер закрыт\n}'
        },
        {
          type: 'heading',
          value: 'Структура реализует несколько интерфейсов через встраивание'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\ntype Stringer interface {\n    String() string\n}\n\ntype Saver interface {\n    Save() error\n}\n\ntype Validator interface {\n    Validate() error\n}\n\n// Базовые реализации\ntype BaseModel struct {\n    ID   int\n    Name string\n}\n\nfunc (b BaseModel) String() string {\n    return fmt.Sprintf("Model{id=%d, name=%s}", b.ID, b.Name)\n}\n\ntype DBSaver struct {\n    TableName string\n}\n\nfunc (d DBSaver) Save() error {\n    fmt.Printf("Сохраняем в таблицу %s\\n", d.TableName)\n    return nil\n}\n\n// Продукт использует композицию для реализации нескольких интерфейсов\ntype Product struct {\n    BaseModel\n    DBSaver\n    Price float64\n}\n\nfunc (p Product) Validate() error {\n    if p.Price <= 0 {\n        return fmt.Errorf("цена должна быть больше 0")\n    }\n    if p.Name == "" {\n        return fmt.Errorf("название не может быть пустым")\n    }\n    return nil\n}\n\nfunc saveIfValid(v Validator, s Saver) error {\n    if err := v.Validate(); err != nil {\n        return fmt.Errorf("валидация: %w", err)\n    }\n    return s.Save()\n}\n\nfunc main() {\n    p := Product{\n        BaseModel: BaseModel{ID: 1, Name: "Ноутбук"},\n        DBSaver:   DBSaver{TableName: "products"},\n        Price:     99999.99,\n    }\n    \n    fmt.Println(p.String())\n    err := saveIfValid(p, p)\n    if err != nil {\n        fmt.Println("Ошибка:", err)\n    }\n    // Model{id=1, name=Ноутбук}\n    // Сохраняем в таблицу products\n}'
        },
        {
          type: 'tip',
          value: 'Стандартная библиотека Go активно использует встраивание интерфейсов: io.ReadWriter = io.Reader + io.Writer, io.ReadWriteCloser = io.ReadWriter + io.Closer и т.д.'
        }
      ]
    },
    {
      id: 6,
      title: 'Практика: Система игровых персонажей',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте систему игровых персонажей с использованием композиции вместо наследования.',
      requirements: [
        'Создать базовую структуру Character с полями Name, Health, Level и методами TakeDamage(damage int), Heal(amount int), IsAlive() bool',
        'Создать структуру Fighter с полями Strength, Armor и методом Attack() int',
        'Создать структуру Mage с полями MagicPower, Mana и методом CastSpell() int',
        'Создать структуру Paladin который встраивает Fighter И Mage (оба), добавить метод HolyStrike() int который комбинирует Attack() + CastSpell()',
        'Создать интерфейс Combatant с методами Attack() int и IsAlive() bool',
        'Написать функцию Battle(a, b Combatant) string которая симулирует бой — каждый атакует другого по очереди, возвращает имя победителя'
      ],
      expectedOutput: 'Паладин Артур против Мага Мерлин\nАртур атакует: 45 урона\nМерлин атакует: 60 урона\n...\nПобедитель: Артур',
      hint: 'Paladin должен встраивать Character, Fighter и Mage. HolyStrike возвращает сумму Attack() и CastSpell(). В Battle используйте цикл while IsAlive().',
      solution: 'package main\n\nimport "fmt"\n\ntype Character struct {\n    Name   string\n    Health int\n    Level  int\n}\n\nfunc (c *Character) TakeDamage(damage int) {\n    c.Health -= damage\n    if c.Health < 0 {\n        c.Health = 0\n    }\n}\n\nfunc (c *Character) Heal(amount int) {\n    c.Health += amount\n}\n\nfunc (c Character) IsAlive() bool {\n    return c.Health > 0\n}\n\ntype Fighter struct {\n    Strength int\n    Armor    int\n}\n\nfunc (f Fighter) Attack() int {\n    return f.Strength * 2\n}\n\ntype Mage struct {\n    MagicPower int\n    Mana       int\n}\n\nfunc (m Mage) CastSpell() int {\n    return m.MagicPower * 3\n}\n\ntype Paladin struct {\n    Character\n    Fighter\n    Mage\n}\n\nfunc (p Paladin) HolyStrike() int {\n    return p.Fighter.Attack() + p.Mage.CastSpell()\n}\n\nfunc (p Paladin) Attack() int {\n    return p.HolyStrike()\n}\n\ntype Combatant interface {\n    Attack() int\n    IsAlive() bool\n    TakeDamage(damage int)\n    GetName() string\n}\n\nfunc (p *Paladin) GetName() string { return p.Character.Name }\n\ntype SimpleMage struct {\n    Character\n    Mage\n}\n\nfunc (m SimpleMage) Attack() int { return m.CastSpell() }\nfunc (m *SimpleMage) GetName() string { return m.Character.Name }\n\nfunc Battle(a, b Combatant) string {\n    fmt.Printf("%s против %s\\n", a.GetName(), b.GetName())\n    round := 1\n    for a.IsAlive() && b.IsAlive() {\n        dmg := a.Attack()\n        b.TakeDamage(dmg)\n        fmt.Printf("Раунд %d: %s атакует на %d урона (у %s осталось HP)\\n",\n            round, a.GetName(), dmg, b.GetName())\n        if !b.IsAlive() {\n            break\n        }\n        dmg = b.Attack()\n        a.TakeDamage(dmg)\n        fmt.Printf("Раунд %d: %s атакует на %d урона\\n",\n            round, b.GetName(), dmg)\n        round++\n    }\n    if a.IsAlive() {\n        return a.GetName()\n    }\n    return b.GetName()\n}\n\nfunc main() {\n    paladin := &Paladin{\n        Character: Character{Name: "Артур", Health: 200, Level: 10},\n        Fighter:   Fighter{Strength: 15, Armor: 10},\n        Mage:      Mage{MagicPower: 10, Mana: 100},\n    }\n    mage := &SimpleMage{\n        Character: Character{Name: "Мерлин", Health: 150, Level: 10},\n        Mage:      Mage{MagicPower: 20, Mana: 200},\n    }\n    winner := Battle(paladin, mage)\n    fmt.Println("Победитель:", winner)\n}',
      explanation: 'Paladin встраивает три структуры: Character (базовые характеристики), Fighter (физический бой), Mage (магия). Метод HolyStrike() комбинирует оба вида атаки. Интерфейс Combatant абстрагирует боевую систему, позволяя функции Battle работать с любым типом бойца.'
    }
  ]
}
