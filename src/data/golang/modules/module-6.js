export default {
  id: 6,
  title: 'Условные конструкции',
  description: 'Изучаем if, if-else, цепочки условий, вложенные условия и уникальные возможности Go — инициализирующее выражение в if.',
  lessons: [
    {
      id: 1,
      title: 'Базовый if',
      content: [
        {
          type: 'heading',
          value: 'Условный оператор if'
        },
        {
          type: 'text',
          value: 'Оператор if позволяет выполнять код только при выполнении условия. В Go условие не нужно заключать в скобки, но тело if обязательно должно быть в фигурных скобках — даже для одной строки.'
        },
        {
          type: 'text',
          value: 'Аналогия: if — это как светофор. Если свет зелёный (условие истинно) — едем. Если нет — стоим.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    temperature := 25\n\n    // Скобки вокруг условия не нужны!\n    if temperature > 20 {\n        fmt.Println("Тепло, можно идти без куртки")\n    }\n\n    // Нельзя опустить фигурные скобки (в отличие от C/Java)\n    // if temperature > 20\n    //     fmt.Println("Ошибка!")  // ОШИБКА компиляции!\n\n    score := 85\n    if score >= 90 {\n        fmt.Println("Отлично!")\n    }\n    if score >= 70 {\n        fmt.Println("Хорошо!") // Выведется\n    }\n    if score >= 50 {\n        fmt.Println("Удовлетворительно!") // Выведется\n    }\n}'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc checkAge(age int) {\n    if age < 0 {\n        fmt.Println("Некорректный возраст")\n    }\n\n    if age >= 18 {\n        fmt.Println("Доступ разрешён")\n    }\n\n    if age >= 65 {\n        fmt.Println("Пенсионная скидка доступна")\n    }\n}\n\nfunc main() {\n    checkAge(20)  // Доступ разрешён\n    checkAge(70)  // Доступ разрешён + Пенсионная скидка\n    checkAge(-5)  // Некорректный возраст\n}'
        },
        {
          type: 'note',
          value: 'В Go открывающая фигурная скобка { должна стоять на той же строке, что и if. Это не соглашение — это правило языка! Перенос скобки на следующую строку вызовет ошибку компиляции.'
        }
      ]
    },
    {
      id: 2,
      title: 'if-else',
      content: [
        {
          type: 'heading',
          value: 'Ветвление с else'
        },
        {
          type: 'text',
          value: 'Блок else выполняется, когда условие if не выполнено. Это позволяет задать два варианта поведения: "если... то... иначе...".'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    number := 7\n\n    if number%2 == 0 {\n        fmt.Println(number, "- чётное")\n    } else {\n        fmt.Println(number, "- нечётное") // Выведется\n    }\n\n    // Проверка пароля\n    password := "qwerty"\n    correctPassword := "secure123"\n\n    if password == correctPassword {\n        fmt.Println("Добро пожаловать!")\n    } else {\n        fmt.Println("Неверный пароль!") // Выведется\n    }\n\n    // Важно: else должен быть на той же строке, что }\n    x := 5\n    if x > 3 {\n        fmt.Println("Больше трёх")\n    } else {\n        fmt.Println("Три или меньше")\n    }\n    // Если } и else на разных строках - ошибка!\n}'
        },
        {
          type: 'heading',
          value: 'Переменная в блоке if-else'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc classify(n int) string {\n    if n > 0 {\n        return "положительное"\n    } else {\n        return "отрицательное или ноль"\n    }\n}\n\nfunc main() {\n    result := classify(42)\n    fmt.Println(result) // положительное\n\n    // Лучший стиль: ранний возврат (early return)\n    // вместо глубокой вложенности\n    fmt.Println(classify(-5))  // отрицательное или ноль\n    fmt.Println(classify(0))   // отрицательное или ноль\n}'
        },
        {
          type: 'tip',
          value: 'Go-идиома "ранний возврат": вместо if-else используйте if с return внутри. Это уменьшает вложенность кода и делает его читаемее. "Счастливый путь" (успешное выполнение) идёт без лишних отступов.'
        }
      ]
    },
    {
      id: 3,
      title: 'if с инициализирующим выражением',
      content: [
        {
          type: 'heading',
          value: 'Уникальная возможность Go'
        },
        {
          type: 'text',
          value: 'В Go можно объявить переменную прямо в условии if — она будет существовать только внутри блоков if и else. Это уменьшает "загрязнение" области видимости и делает код чище.'
        },
        {
          type: 'text',
          value: 'Аналогия: Представьте, что вы открываете ящик (объявляете переменную), заглядываете внутрь (проверяете условие) и закрываете (переменная уничтожается после if-else). Ящик существует только пока вы с ним работаете.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "strconv"\n)\n\nfunc main() {\n    // Синтаксис: if init; condition { ... }\n    if x := 10; x > 5 {\n        fmt.Println("x больше 5:", x) // x доступна здесь\n    } else {\n        fmt.Println("x не больше 5:", x) // и здесь\n    }\n    // x недоступна здесь! Выход из области видимости.\n    // fmt.Println(x) // ОШИБКА!\n\n    // Классический пример: обработка ошибок\n    if n, err := strconv.Atoi("42"); err != nil {\n        fmt.Println("Ошибка:", err)\n    } else {\n        fmt.Println("Число:", n*2) // Число: 84\n    }\n\n    // Без этой возможности пришлось бы писать:\n    // n, err := strconv.Atoi("42")\n    // if err != nil { ... } else { ... }\n    // Переменные n и err "живут" дальше (загрязняют область видимости)\n}'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "os"\n)\n\nfunc main() {\n    // Открытие файла с обработкой ошибки\n    if file, err := os.Open("test.txt"); err != nil {\n        fmt.Println("Файл не найден:", err)\n    } else {\n        defer file.Close()\n        fmt.Println("Файл открыт:", file.Name())\n    }\n\n    // Проверка значения в map\n    userRoles := map[string]string{\n        "alice": "admin",\n        "bob":   "user",\n    }\n\n    if role, ok := userRoles["alice"]; ok {\n        fmt.Println("Роль alice:", role) // Роль alice: admin\n    } else {\n        fmt.Println("Пользователь не найден")\n    }\n}'
        },
        {
          type: 'note',
          value: 'Этот паттерн очень часто используется в Go для обработки ошибок и проверки наличия ключей в map. Вы будете видеть его в каждой Go-программе!'
        }
      ]
    },
    {
      id: 4,
      title: 'Цепочка if-else if',
      content: [
        {
          type: 'heading',
          value: 'Множественные условия'
        },
        {
          type: 'text',
          value: 'Когда нужно проверить несколько условий по очереди, используется цепочка if-else if. Проверка идёт сверху вниз, и выполняется первый подходящий блок.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc getGrade(score int) string {\n    if score >= 90 {\n        return "Отлично (A)"\n    } else if score >= 80 {\n        return "Хорошо (B)"\n    } else if score >= 70 {\n        return "Удовлетворительно (C)"\n    } else if score >= 60 {\n        return "Посредственно (D)"\n    } else {\n        return "Неудовлетворительно (F)"\n    }\n}\n\nfunc main() {\n    scores := []int{95, 83, 72, 61, 45}\n    for _, score := range scores {\n        fmt.Printf("Оценка %d: %s\\n", score, getGrade(score))\n    }\n\n    // Вывод:\n    // Оценка 95: Отлично (A)\n    // Оценка 83: Хорошо (B)\n    // Оценка 72: Удовлетворительно (C)\n    // Оценка 61: Посредственно (D)\n    // Оценка 45: Неудовлетворительно (F)\n}'
        },
        {
          type: 'heading',
          value: 'Практический пример'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc classifyBMI(bmi float64) string {\n    if bmi < 18.5 {\n        return "Недостаточный вес"\n    } else if bmi < 25.0 {\n        return "Нормальный вес"\n    } else if bmi < 30.0 {\n        return "Избыточный вес"\n    } else {\n        return "Ожирение"\n    }\n}\n\nfunc main() {\n    weight := 70.0  // кг\n    height := 1.75  // м\n    bmi := weight / (height * height)\n\n    fmt.Printf("Вес: %.1f кг\\n", weight)\n    fmt.Printf("Рост: %.2f м\\n", height)\n    fmt.Printf("ИМТ: %.2f\\n", bmi)\n    fmt.Printf("Категория: %s\\n", classifyBMI(bmi))\n    // ИМТ: 22.86\n    // Категория: Нормальный вес\n}'
        },
        {
          type: 'warning',
          value: 'При использовании цепочки if-else if важен порядок проверок! Если вы проверяете score >= 60 перед score >= 90, то значение 95 попадёт в блок >= 60 и никогда не дойдёт до >= 90.'
        }
      ]
    },
    {
      id: 5,
      title: 'Вложенные условия',
      content: [
        {
          type: 'heading',
          value: 'Условия внутри условий'
        },
        {
          type: 'text',
          value: 'Условные операторы можно вкладывать друг в друга. Однако глубокая вложенность ("pyramide of doom") ухудшает читаемость. В Go принято избегать лишней вложенности с помощью раннего возврата.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\n// Плохой стиль: глубокая вложенность\nfunc checkUserBad(name string, age int, isVerified bool) string {\n    if name != "" {\n        if age >= 18 {\n            if isVerified {\n                return "Доступ разрешён"\n            } else {\n                return "Требуется верификация"\n            }\n        } else {\n            return "Слишком молод"\n        }\n    } else {\n        return "Имя не указано"\n    }\n}\n\n// Хороший стиль: ранний возврат\nfunc checkUserGood(name string, age int, isVerified bool) string {\n    if name == "" {\n        return "Имя не указано"\n    }\n    if age < 18 {\n        return "Слишком молод"\n    }\n    if !isVerified {\n        return "Требуется верификация"\n    }\n    return "Доступ разрешён"\n}\n\nfunc main() {\n    fmt.Println(checkUserBad("Иван", 25, true))    // Доступ разрешён\n    fmt.Println(checkUserGood("Иван", 25, true))   // Доступ разрешён\n    fmt.Println(checkUserGood("", 25, true))       // Имя не указано\n    fmt.Println(checkUserGood("Иван", 15, true))   // Слишком молод\n}'
        },
        {
          type: 'tip',
          value: 'Правило в Go: "Обрабатывай ошибку — и выходи". Если что-то пошло не так — верни ошибку/сообщение сразу. "Счастливый путь" (нормальное выполнение) должен быть прямым, без вложенности.'
        }
      ]
    },
    {
      id: 6,
      title: 'Комбинирование условий',
      content: [
        {
          type: 'heading',
          value: 'Сложные условия'
        },
        {
          type: 'text',
          value: 'Реальные условия часто сложные. Go позволяет комбинировать условия с помощью &&, || и скобок для группировки.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc canRent(age int, hasLicense bool, creditScore int) bool {\n    // Возраст от 21 до 75, есть права, кредитный рейтинг > 600\n    return age >= 21 && age <= 75 && hasLicense && creditScore > 600\n}\n\nfunc getDiscount(isStudent bool, isEmployee bool, purchaseAmount float64) float64 {\n    // Студент или сотрудник + покупка от 1000 рублей\n    if (isStudent || isEmployee) && purchaseAmount >= 1000 {\n        return 0.15 // 15% скидка\n    }\n    // Просто большая покупка\n    if purchaseAmount >= 5000 {\n        return 0.10 // 10% скидка\n    }\n    return 0 // Нет скидки\n}\n\nfunc main() {\n    fmt.Println(canRent(25, true, 700))  // true\n    fmt.Println(canRent(18, true, 700))  // false (слишком молод)\n    fmt.Println(canRent(25, false, 700)) // false (нет прав)\n    fmt.Println(canRent(25, true, 500))  // false (низкий рейтинг)\n\n    amount := 1500.0\n    discount := getDiscount(true, false, amount)\n    fmt.Printf("Сумма: %.0f, Скидка: %.0f%%\\n", amount, discount*100)\n    // Сумма: 1500, Скидка: 15%\n}'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc classifyTriangle(a, b, c int) string {\n    // Проверка существования треугольника\n    if a+b <= c || b+c <= a || a+c <= b {\n        return "Не является треугольником"\n    }\n\n    // Определение типа треугольника\n    if a == b && b == c {\n        return "Равносторонний"\n    } else if a == b || b == c || a == c {\n        return "Равнобедренный"\n    } else {\n        return "Разносторонний"\n    }\n}\n\nfunc main() {\n    fmt.Println(classifyTriangle(3, 3, 3)) // Равносторонний\n    fmt.Println(classifyTriangle(3, 3, 4)) // Равнобедренный\n    fmt.Println(classifyTriangle(3, 4, 5)) // Разносторонний\n    fmt.Println(classifyTriangle(1, 2, 10)) // Не является треугольником\n}'
        }
      ]
    },
    {
      id: 7,
      title: 'Практика: Калькулятор скидок',
      type: 'practice',
      difficulty: 'beginner',
      description: 'Напишите функцию, которая определяет размер скидки для клиента в интернет-магазине на основе нескольких условий.',
      requirements: [
        'Функция calculateDiscount(totalAmount float64, isPremium bool, itemCount int) float64',
        'Если isPremium И сумма >= 5000 — скидка 20%',
        'Если isPremium ИЛИ сумма >= 3000 — скидка 10%',
        'Если количество товаров >= 5 — дополнительно 5%',
        'Максимальная скидка 25% (не более)',
        'Протестируйте функцию с несколькими наборами данных'
      ],
      expectedOutput: 'Сумма: 6000, Premium: true, Товаров: 3 -> Скидка: 20.00%\nСумма: 3500, Premium: false, Товаров: 6 -> Скидка: 15.00%\nСумма: 1000, Premium: false, Товаров: 2 -> Скидка: 0.00%\nСумма: 6000, Premium: true, Товаров: 6 -> Скидка: 25.00%',
      hint: 'Начните с базовой скидки 0. Используйте if-else if для определения основной скидки. Затем добавьте дополнительную скидку за количество товаров. В конце проверьте, не превышает ли скидка максимум.',
      solution: 'package main\n\nimport "fmt"\n\nfunc calculateDiscount(totalAmount float64, isPremium bool, itemCount int) float64 {\n    var discount float64\n\n    if isPremium && totalAmount >= 5000 {\n        discount = 0.20\n    } else if isPremium || totalAmount >= 3000 {\n        discount = 0.10\n    }\n\n    if itemCount >= 5 {\n        discount += 0.05\n    }\n\n    if discount > 0.25 {\n        discount = 0.25\n    }\n\n    return discount\n}\n\nfunc main() {\n    tests := []struct {\n        amount   float64\n        premium  bool\n        items    int\n    }{\n        {6000, true, 3},\n        {3500, false, 6},\n        {1000, false, 2},\n        {6000, true, 6},\n    }\n\n    for _, t := range tests {\n        d := calculateDiscount(t.amount, t.premium, t.items)\n        fmt.Printf("Сумма: %.0f, Premium: %t, Товаров: %d -> Скидка: %.2f%%\\n",\n            t.amount, t.premium, t.items, d*100)\n    }\n}',
      explanation: 'Функция использует цепочку if-else if для определения базовой скидки. Потом отдельным if добавляется скидка за количество товаров. Финальная проверка не позволяет скидке превысить максимум. Тесты оформлены как срез анонимных структур — это удобный паттерн для табличного тестирования в Go.'
    }
  ]
}
