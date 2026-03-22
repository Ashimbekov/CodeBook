export default {
  id: 61,
  title: 'Protocol Buffers в Go',
  description: 'Эффективная сериализация данных с Protocol Buffers: синтаксис .proto файлов, скалярные типы, repeated и map поля, компиляция и работа со сгенерированным Go кодом.',
  lessons: [
    {
      id: 1,
      title: 'Что такое Protocol Buffers',
      type: 'theory',
      content: [
        { type: 'text', value: 'Protocol Buffers (protobuf) — это формат сериализации данных от Google. Думайте о нём как о JSON, но в 3–10 раз компактнее и в 5–10 раз быстрее. Вместо текстового формата данные кодируются в бинарный вид, а схема описывается в .proto файле.' },
        { type: 'heading', value: 'JSON vs Protobuf — в чём разница' },
        { type: 'code', language: 'go', value: '// JSON (текст, читаем, но объёмный):\n// {"id":42,"name":"Айгерим","email":"a@mail.ru","age":25}\n// Размер: ~52 байта\n\n// Protobuf (бинарный, компактный):\n// \\x08\\x2a\\x12\\x07\\xd0\\x90...  (примерно 20 байт)\n// Тот же объект, но в 2+ раза меньше!\n\n// Аналогия: JSON — это рукописный текст,\n// а protobuf — это азбука Морзе: те же данные, но короче.' },
        { type: 'heading', value: 'Когда использовать protobuf' },
        { type: 'list', value: 'Микросервисная коммуникация (gRPC использует protobuf)\nСохранение данных в файлы/базу данных\nПередача большого объёма данных по сети\nМобильные приложения (экономия трафика)\nСистемы реального времени (игры, финтех)' },
        { type: 'note', value: 'Protobuf не читается человеком напрямую, поэтому для отладки и публичных API часто всё ещё используют JSON. Protobuf — это инструмент производительности, а не удобства.' }
      ]
    },
    {
      id: 2,
      title: 'Синтаксис .proto файлов',
      type: 'theory',
      content: [
        { type: 'text', value: '.proto файл — это схема ваших данных. Это как интерфейс в Go, только для данных. Один раз описываете структуру, и инструмент генерирует код для любого языка.' },
        { type: 'heading', value: 'Базовый синтаксис proto3' },
        { type: 'code', language: 'go', value: '// Файл: user.proto\nsyntax = "proto3";  // обязательно указываем версию\n\n// Пакет для namespace — как package в Go\npackage users;\n\n// Указываем Go пакет для генерации\noption go_package = "github.com/myapp/proto/users";\n\n// message — как struct в Go\nmessage User {\n    // Каждое поле имеет тип, имя и уникальный номер\n    // Номера 1-15 кодируются 1 байтом (используйте для частых полей)\n    // Номера 16-2047 кодируются 2 байтами\n    uint64 id    = 1;  // 1 — это тег поля, не значение!\n    string name  = 2;\n    string email = 3;\n    uint32 age   = 4;\n}\n\nmessage CreateUserRequest {\n    string name  = 1;\n    string email = 2;\n    uint32 age   = 3;\n}\n\nmessage CreateUserResponse {\n    User user          = 1;\n    string error_message = 2;\n}' },
        { type: 'warning', value: 'Номера полей (теги) — это не значения, а идентификаторы при сериализации. НИКОГДА не меняйте номер поля после публикации схемы — это сломает совместимость с уже сериализованными данными.' },
        { type: 'tip', value: 'Зарезервируйте номера 1-15 для самых часто используемых полей — они занимают меньше места при кодировании.' }
      ]
    },
    {
      id: 3,
      title: 'Скалярные типы в protobuf',
      type: 'theory',
      content: [
        { type: 'text', value: 'В protobuf есть своя система типов, которая немного отличается от Go. Знание этого соответствия необходимо, чтобы правильно описывать данные.' },
        { type: 'heading', value: 'Таблица типов proto3 → Go' },
        { type: 'code', language: 'go', value: '// proto3 тип       -> Go тип\n// double            -> float64\n// float             -> float32\n// int32             -> int32   (неэффективен для отрицательных чисел!)\n// int64             -> int64\n// uint32            -> uint32\n// uint64            -> uint64\n// sint32            -> int32   (эффективен для отрицательных)\n// sint64            -> int64\n// bool              -> bool\n// string            -> string  (всегда UTF-8)\n// bytes             -> []byte\n// fixed32           -> uint32  (всегда 4 байта)\n// fixed64           -> uint64  (всегда 8 байт)\n\n// Пример:\nmessage Product {\n    uint64  id          = 1;\n    string  name        = 2;\n    double  price       = 3;   // float64 в Go\n    float   rating      = 4;   // float32 в Go\n    bool    in_stock    = 5;\n    bytes   image_data  = 6;   // []byte в Go\n    sint32  temperature = 7;   // для отрицательных чисел лучше sint\n}' },
        { type: 'heading', value: 'Значения по умолчанию (zero values)' },
        { type: 'code', language: 'go', value: '// В proto3 у каждого типа есть zero value:\n// string -> ""\n// bool   -> false\n// число  -> 0\n// bytes  -> nil (пустой []byte)\n// message -> nil\n\n// ВАЖНО: нельзя отличить "поле не задано" от "поле = 0"\n// Для этого используйте google.protobuf.Int64Value (wrapper types)\n\nmessage SearchFilter {\n    string query = 1;\n    // Если min_price = 0, это "не задано" или "цена 0"?\n    double min_price = 2;  // ambiguous!\n\n    // Лучше использовать optional (proto3 optional):\n    optional double min_price_opt = 3; // -> *float64 в Go\n}' },
        { type: 'note', value: 'Используйте sint32/sint64 вместо int32/int64 для полей, которые могут быть отрицательными — они используют zigzag-кодирование и занимают меньше места для отрицательных чисел.' }
      ]
    },
    {
      id: 4,
      title: 'Repeated и map поля',
      type: 'theory',
      content: [
        { type: 'text', value: 'Для коллекций в protobuf есть два инструмента: repeated (как срез в Go) и map (как map в Go). Это основа для передачи списков и словарей.' },
        { type: 'heading', value: 'Repeated поля — срезы в protobuf' },
        { type: 'code', language: 'go', value: '// Файл: catalog.proto\nsyntax = "proto3";\npackage catalog;\noption go_package = "github.com/myapp/proto/catalog";\n\nmessage Tag {\n    string name  = 1;\n    string color = 2;\n}\n\nmessage Product {\n    uint64          id       = 1;\n    string          name     = 2;\n    repeated string images   = 3;  // []string в Go\n    repeated Tag    tags     = 4;  // []*Tag в Go\n    repeated double prices   = 5;  // []float64 в Go\n}\n\n// В Go это выглядит так:\n// type Product struct {\n//     Id     uint64\n//     Name   string\n//     Images []string   // repeated string\n//     Tags   []*Tag     // repeated message\n//     Prices []float64  // repeated double\n// }' },
        { type: 'heading', value: 'Map поля — словари в protobuf' },
        { type: 'code', language: 'go', value: '// Файл: settings.proto\nsyntax = "proto3";\npackage settings;\noption go_package = "github.com/myapp/proto/settings";\n\nmessage UserSettings {\n    uint64 user_id = 1;\n\n    // map<ключ, значение>\n    // Ключ: любой скалярный тип кроме float/double/bytes\n    map<string, string>  preferences   = 2;  // map[string]string в Go\n    map<string, int32>   feature_flags = 3;  // map[string]int32 в Go\n    map<int32,  string>  error_codes   = 4;  // map[int32]string в Go\n}\n\nmessage Inventory {\n    // product_id -> quantity\n    map<uint64, uint32> stock = 1;  // map[uint64]uint32 в Go\n}\n\n// Ограничения map в protobuf:\n// - Порядок элементов не гарантирован\n// - Ключ не может быть float, double или bytes\n// - Нельзя использовать repeated map' },
        { type: 'tip', value: 'Map поля не поддерживают repeated. Если нужен список пар ключ-значение с определённым порядком — создайте отдельный message с полями key и value, а потом используйте repeated для него.' }
      ]
    },
    {
      id: 5,
      title: 'Компиляция .proto файлов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Чтобы использовать protobuf в Go, нужно скомпилировать .proto файлы в Go код с помощью protoc и плагина protoc-gen-go. Это как запустить генератор кода.' },
        { type: 'heading', value: 'Установка инструментов' },
        { type: 'code', language: 'go', value: '// Шаг 1: Установить protoc (компилятор protobuf)\n// Ubuntu/Debian:\n// sudo apt install protobuf-compiler\n// macOS:\n// brew install protobuf\n\n// Шаг 2: Установить Go плагин\n// go install google.golang.org/protobuf/cmd/protoc-gen-go@latest\n\n// Шаг 3: Убедитесь что $GOPATH/bin в $PATH\n// export PATH="$PATH:$(go env GOPATH)/bin"\n\n// Структура проекта:\n// myapp/\n//   proto/\n//     user.proto\n//     product.proto\n//   gen/\n//     user.pb.go    <- сгенерировано\n//     product.pb.go <- сгенерировано\n//   main.go\n\n// Шаг 4: Компиляция\n// protoc \\\n//   --go_out=./gen \\\n//   --go_opt=paths=source_relative \\\n//   ./proto/user.proto\n\n// Или для всех файлов сразу:\n// protoc \\\n//   --go_out=./gen \\\n//   --go_opt=paths=source_relative \\\n//   ./proto/*.proto' },
        { type: 'heading', value: 'Makefile для автоматизации' },
        { type: 'code', language: 'go', value: '// Makefile:\n// .PHONY: proto\n// proto:\n// \tprotoc \\\n// \t  --go_out=. \\\n// \t  --go_opt=paths=source_relative \\\n// \t  proto/*.proto\n//\n// clean-proto:\n// \trm -f gen/*.pb.go\n\n// go.mod — нужные зависимости:\npackage main\n\nimport (\n    // "google.golang.org/protobuf/proto"\n    // go get google.golang.org/protobuf\n    _ "google.golang.org/protobuf/proto"\n)\n\n// Команда для добавления зависимостей:\n// go get google.golang.org/protobuf' },
        { type: 'warning', value: 'Никогда не редактируйте сгенерированные .pb.go файлы вручную — они перезаписываются при следующей компиляции. Добавьте gen/*.pb.go в .gitignore или наоборот включите в репозиторий (что проще для CI/CD).' }
      ]
    },
    {
      id: 6,
      title: 'Практика: работа со сгенерированным Go кодом',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай структуры protobuf для адресной книги, скомпилируй их и напиши код для сериализации/десериализации с использованием пакета google.golang.org/protobuf/proto.',
      requirements: [
        'Установи google.golang.org/protobuf: go get google.golang.org/protobuf',
        'Создай .proto схему для Person (id uint64, name string, email string, phones repeated string)',
        'Создай AddressBook message с repeated Person persons',
        'Используй proto.Marshal() для сериализации в байты',
        'Используй proto.Unmarshal() для десериализации',
        'Сравни размер protobuf и JSON для одного объекта',
        'Выведи результаты в читаемом виде'
      ],
      expectedOutput: 'Создан Person: {id:1 name:Нурдаулет email:n@mail.ru phones:[+7701...]}\nProto размер: ~35 байт\nJSON размер: ~85 байт\nСжатие: ~59%\nДесериализация успешна: {id:1 name:Нурдаулет}',
      hint: 'Поскольку protoc может быть сложно настроить, для практики создай Go-структуры вручную, имитирующие сгенерированный protobuf код. Используй encoding/json для сравнения размеров. В реальном проекте структуры генерируются автоматически.',
      solution: 'package main\n\nimport (\n    "encoding/json"\n    "fmt"\n    "log"\n\n    "google.golang.org/protobuf/proto"\n    pb "google.golang.org/protobuf/types/known/wrapperspb"\n)\n\n// Для демонстрации используем встроенный тип из google/protobuf\n// В реальном проекте здесь будет ваш сгенерированный код\n\n// Эмулируем структуру адресной книги вручную\ntype Person struct {\n    ID     uint64   `json:"id"`\n    Name   string   `json:"name"`\n    Email  string   `json:"email"`\n    Phones []string `json:"phones"`\n}\n\ntype AddressBook struct {\n    Persons []*Person `json:"persons"`\n}\n\nfunc main() {\n    // Используем wrapperspb для демонстрации proto API\n    // StringValue — это встроенный protobuf wrapper тип\n    name := pb.String("Нурдаулет Бекжанов")\n\n    // Сериализация\n    data, err := proto.Marshal(name)\n    if err != nil {\n        log.Fatal("Marshal error:", err)\n    }\n    fmt.Printf("Proto сериализация StringValue:\\n")\n    fmt.Printf("  Значение: %s\\n", name.GetValue())\n    fmt.Printf("  Proto байты: %v\\n", data)\n    fmt.Printf("  Proto размер: %d байт\\n", len(data))\n\n    // JSON для сравнения\n    jsonData, _ := json.Marshal(map[string]string{"value": name.GetValue()})\n    fmt.Printf("  JSON размер: %d байт\\n", len(jsonData))\n\n    // Десериализация\n    restored := &pb.StringValue{}\n    if err := proto.Unmarshal(data, restored); err != nil {\n        log.Fatal("Unmarshal error:", err)\n    }\n    fmt.Printf("\\nДесериализация:\\n")\n    fmt.Printf("  Восстановлено: %s\\n", restored.GetValue())\n    fmt.Printf("  Совпадает: %v\\n", name.GetValue() == restored.GetValue())\n\n    // Демонстрация работы с JSON структурами\n    book := &AddressBook{\n        Persons: []*Person{\n            {ID: 1, Name: "Нурдаулет", Email: "n@mail.ru", Phones: []string{"+77011234567", "+77019876543"}},\n            {ID: 2, Name: "Айгерим",   Email: "a@mail.ru", Phones: []string{"+77021111111"}},\n        },\n    }\n\n    jsonBook, _ := json.MarshalIndent(book, "", "  ")\n    fmt.Printf("\\nАдресная книга (JSON):\\n%s\\n", jsonBook)\n    fmt.Printf("JSON размер: %d байт\\n", len(jsonBook))\n\n    // В реальном protobuf с полным .proto файлом размер был бы ~2-3x меньше\n    fmt.Println("\\nВ реальном protobuf с .proto схемой размер был бы значительно меньше!")\n}',
      explanation: 'proto.Marshal() сериализует protobuf-сообщение в компактный бинарный формат. proto.Unmarshal() выполняет обратное преобразование. Ключевое преимущество protobuf — схема известна обеим сторонам заранее, поэтому имена полей не передаются (только числовые теги), что экономит место. В реальном проекте используйте protoc для генерации Go кода из .proto файлов, а не пишите структуры вручную.'
    }
  ]
}
