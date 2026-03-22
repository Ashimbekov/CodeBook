export default {
  id: 28,
  title: 'Дата и время',
  description: 'Пакет time предоставляет всё необходимое для работы с датами, временем и временными интервалами. От получения текущего времени до работы с часовыми поясами.',
  lessons: [
    {
      id: 1,
      title: 'time.Now и time.Date — создание времени',
      content: [
        {
          type: 'text',
          value: 'Тип time.Time представляет момент времени с наносекундной точностью. time.Now() — текущий момент, time.Date() — конкретная дата и время. Как разница между "сейчас" и "15 января 2024 года".'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "time"\n)\n\nfunc main() {\n    // Текущее время\n    now := time.Now()\n    fmt.Println(now) // 2024-01-15 14:30:00.123456789 +0600 ALMT\n    \n    // Компоненты времени\n    fmt.Println("Год:    ", now.Year())\n    fmt.Println("Месяц:  ", now.Month())        // January (тип Month)\n    fmt.Println("Число:  ", now.Day())\n    fmt.Println("Час:    ", now.Hour())\n    fmt.Println("Минута: ", now.Minute())\n    fmt.Println("Секунда:", now.Second())\n    fmt.Println("Наносек:", now.Nanosecond())\n    fmt.Println("Weekday:", now.Weekday())       // Monday\n    fmt.Println("YearDay:", now.YearDay())       // 15 (день года)\n    \n    // Создание конкретной даты\n    birthday := time.Date(1993, time.March, 15, 0, 0, 0, 0, time.UTC)\n    fmt.Println("День рождения:", birthday)\n    \n    // Нулевое время\n    var zeroTime time.Time\n    fmt.Println("Нулевое время:", zeroTime)      // 0001-01-01 00:00:00\n    fmt.Println("Является нулевым:", zeroTime.IsZero()) // true\n    \n    // Unix timestamp\n    unixSec := now.Unix()        // секунды с 1970-01-01\n    unixMilli := now.UnixMilli() // миллисекунды\n    unixNano := now.UnixNano()   // наносекунды\n    fmt.Printf("Unix: %d, Milli: %d, Nano: %d\\n", unixSec, unixMilli, unixNano)\n    \n    // Из Unix timestamp\n    fromUnix := time.Unix(unixSec, 0)\n    fmt.Println("Из Unix:", fromUnix)\n}'
        }
      ]
    },
    {
      id: 2,
      title: 'Форматирование и парсинг — уникальная система Layout',
      content: [
        {
          type: 'text',
          value: 'Go использует уникальный подход к форматированию времени: вместо символов типа YYYY-MM-DD, используется эталонное время — 15:04:05 02 Jan 2006 MST. Это конкретный момент времени (Mon Jan 2 15:04:05 MST 2006), который выступает как шаблон.'
        },
        {
          type: 'note',
          value: 'Мнемоника для запоминания: 1 2 3 4 5 6 7 (месяц, день, час, минута, секунда, год, день недели). Или так: 01/02 03:04:05PM 06 -0700 (месяц/день час:мин:сек год зона).'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "time"\n)\n\nfunc main() {\n    now := time.Now()\n    \n    // Готовые константы форматов\n    fmt.Println(now.Format(time.RFC3339))         // 2024-01-15T14:30:00+06:00\n    fmt.Println(now.Format(time.RFC822))          // 15 Jan 24 14:30 ALMT\n    fmt.Println(now.Format(time.RFC1123))         // Mon, 15 Jan 2024 14:30:00 ALMT\n    fmt.Println(now.Format(time.Kitchen))         // 2:30PM\n    fmt.Println(now.Format(time.StampMilli))      // Jan 15 14:30:00.123\n    \n    // Кастомные форматы — используем ЭТАЛОННОЕ ВРЕМЯ\n    fmt.Println(now.Format("02.01.2006"))          // 15.01.2024\n    fmt.Println(now.Format("02 January 2006"))     // 15 January 2024\n    fmt.Println(now.Format("15:04:05"))            // 14:30:00\n    fmt.Println(now.Format("02.01.2006 15:04"))    // 15.01.2024 14:30\n    fmt.Println(now.Format("2006/01/02"))          // 2024/01/15\n    fmt.Println(now.Format("Mon, 02 Jan 2006"))    // Mon, 15 Jan 2024\n    fmt.Println(now.Format("3:04 PM"))             // 2:30 PM (12-часовой)\n    \n    // Парсинг строки в time.Time\n    layout := "02.01.2006"\n    t, err := time.Parse(layout, "15.03.2024")\n    if err != nil {\n        fmt.Println("Ошибка:", err)\n    } else {\n        fmt.Println("Распарсено:", t.Format("2 January 2006"))\n    }\n    \n    // Парсинг с временной зоной\n    t2, _ := time.Parse(time.RFC3339, "2024-03-15T10:30:00+06:00")\n    fmt.Println("RFC3339:", t2)\n}'
        },
        {
          type: 'warning',
          value: 'Главная ошибка новичков в Go: перепутать год 2006 и 2024, или месяц 01 и 12. Запомните: эталон — 01/02/06 15:04:05 (месяц/день/год час:мин:сек). Год — всегда 2006, час — всегда 15 (не 00!).'
        }
      ]
    },
    {
      id: 3,
      title: 'Duration — временные интервалы',
      content: [
        {
          type: 'text',
          value: 'time.Duration — тип для представления длительностей, хранится в наносекундах (int64). Есть готовые константы: time.Second, time.Minute, time.Hour. Как линейка для измерения времени.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "time"\n)\n\nfunc main() {\n    // Константы Duration\n    fmt.Println(time.Nanosecond)   // 1ns\n    fmt.Println(time.Microsecond)  // 1µs\n    fmt.Println(time.Millisecond)  // 1ms\n    fmt.Println(time.Second)       // 1s\n    fmt.Println(time.Minute)       // 1m0s\n    fmt.Println(time.Hour)         // 1h0m0s\n    \n    // Создание Duration\n    d1 := 5 * time.Second\n    d2 := 2*time.Hour + 30*time.Minute\n    d3 := 100 * time.Millisecond\n    \n    fmt.Println(d1)  // 5s\n    fmt.Println(d2)  // 2h30m0s\n    fmt.Println(d3)  // 100ms\n    \n    // Компоненты\n    fmt.Println(d2.Hours())   // 2.5\n    fmt.Println(d2.Minutes()) // 150\n    fmt.Println(d2.Seconds()) // 9000\n    \n    // Арифметика со временем\n    now := time.Now()\n    tomorrow := now.Add(24 * time.Hour)\n    yesterday := now.Add(-24 * time.Hour)\n    \n    fmt.Println("Завтра:   ", tomorrow.Format("02.01.2006"))\n    fmt.Println("Вчера:    ", yesterday.Format("02.01.2006"))\n    \n    // AddDate — добавить годы, месяцы, дни\n    nextMonth := now.AddDate(0, 1, 0)  // +1 месяц\n    nextYear := now.AddDate(1, 0, 0)   // +1 год\n    birthday := now.AddDate(-30, 0, 0) // -30 лет\n    \n    fmt.Println("Через месяц:", nextMonth.Format("02.01.2006"))\n    fmt.Println("Через год:  ", nextYear.Format("02.01.2006"))\n    fmt.Println("30 лет назад:", birthday.Format("02.01.2006"))\n    \n    // Sub — разность двух моментов\n    start := time.Date(2024, 1, 1, 0, 0, 0, 0, time.UTC)\n    end := time.Date(2024, 12, 31, 0, 0, 0, 0, time.UTC)\n    diff := end.Sub(start)\n    fmt.Printf("В 2024 году: %.0f дней\\n", diff.Hours()/24)\n    \n    // ParseDuration — из строки\n    d, _ := time.ParseDuration("1h30m15s")\n    fmt.Println("Распарсено:", d) // 1h30m15s\n}'
        }
      ]
    },
    {
      id: 4,
      title: 'Сравнение и проверка времени',
      content: [
        {
          type: 'text',
          value: 'time.Time поддерживает сравнение: Before, After, Equal. time.Since и time.Until — удобные сокращения для вычисления прошедшего/оставшегося времени.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "time"\n)\n\nfunc main() {\n    t1 := time.Date(2024, 1, 1, 0, 0, 0, 0, time.UTC)\n    t2 := time.Date(2024, 6, 1, 0, 0, 0, 0, time.UTC)\n    t3 := time.Date(2024, 1, 1, 0, 0, 0, 0, time.UTC)\n    \n    fmt.Println(t1.Before(t2)) // true\n    fmt.Println(t1.After(t2))  // false\n    fmt.Println(t1.Equal(t3))  // true\n    \n    // time.Since — время с момента t\n    past := time.Now().Add(-2 * time.Hour)\n    elapsed := time.Since(past)\n    fmt.Printf("Прошло: %.0f минут\\n", elapsed.Minutes())\n    \n    // time.Until — время до момента t\n    future := time.Now().Add(24 * time.Hour)\n    remaining := time.Until(future)\n    fmt.Printf("До события: %.0f часов\\n", remaining.Hours())\n    \n    // Измерение производительности\n    start := time.Now()\n    // ... какая-то работа ...\n    sum := 0\n    for i := 0; i < 1000000; i++ {\n        sum += i\n    }\n    elapsed2 := time.Since(start)\n    fmt.Printf("Вычисление заняло: %v (сумма: %d)\\n", elapsed2, sum)\n    \n    // Усечение времени\n    now := time.Now()\n    truncated := now.Truncate(time.Hour)    // начало часа\n    rounded := now.Round(time.Minute)       // округлённые минуты\n    \n    fmt.Println("Сейчас:    ", now.Format("15:04:05.000"))\n    fmt.Println("Начало часа:", truncated.Format("15:04:05"))\n    fmt.Println("Округлённо:", rounded.Format("15:04:05"))\n}'
        }
      ]
    },
    {
      id: 5,
      title: 'time.After, time.Sleep, time.Tick',
      content: [
        {
          type: 'text',
          value: 'Для таймеров, тиков и ожидания в Go используются функции из пакета time. time.Sleep блокирует горутину. time.After и time.Tick создают каналы, получающие сигнал через указанное время.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "time"\n)\n\nfunc main() {\n    // time.Sleep — пауза\n    fmt.Println("Начало")\n    time.Sleep(100 * time.Millisecond)\n    fmt.Println("Прошло 100ms")\n    \n    // time.After — канал, который получит значение через d\n    timeout := time.After(200 * time.Millisecond)\n    done := make(chan bool)\n    \n    go func() {\n        time.Sleep(100 * time.Millisecond)\n        done <- true\n    }()\n    \n    select {\n    case <-done:\n        fmt.Println("Операция завершена вовремя")\n    case <-timeout:\n        fmt.Println("Таймаут!")\n    }\n    \n    // time.NewTimer — одноразовый таймер с управлением\n    timer := time.NewTimer(500 * time.Millisecond)\n    go func() {\n        <-timer.C\n        fmt.Println("Таймер сработал")\n    }()\n    \n    // Можно отменить до срабатывания\n    if timer.Stop() {\n        fmt.Println("Таймер отменён")\n    }\n    \n    // time.NewTick — периодический тик\n    ticker := time.NewTicker(50 * time.Millisecond)\n    count := 0\n    for range ticker.C {\n        count++\n        fmt.Printf("Тик %d\\n", count)\n        if count >= 3 {\n            ticker.Stop()\n            break\n        }\n    }\n    \n    fmt.Println("Готово")\n}'
        },
        {
          type: 'warning',
          value: 'time.Tick создаёт утечку горутины если не остановить — используйте time.NewTicker и вызывайте Stop(). time.After тоже может вызвать утечку в select — предпочтительнее time.NewTimer с явным Stop().'
        }
      ]
    },
    {
      id: 6,
      title: 'Часовые пояса',
      content: [
        {
          type: 'text',
          value: 'Работа с часовыми поясами — источник ошибок в любом языке. Go предоставляет тип *time.Location для представления часового пояса.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "time"\n)\n\nfunc main() {\n    // time.UTC и time.Local\n    now := time.Now()\n    utc := now.UTC()\n    local := now.Local()\n    \n    fmt.Println("Местное:", local.Format("15:04:05 MST"))\n    fmt.Println("UTC:    ", utc.Format("15:04:05 MST"))\n    \n    // Загрузка часового пояса\n    almaty, err := time.LoadLocation("Asia/Almaty")\n    if err != nil {\n        fmt.Println("Ошибка загрузки зоны:", err)\n        return\n    }\n    \n    moscow, _ := time.LoadLocation("Europe/Moscow")\n    london, _ := time.LoadLocation("Europe/London")\n    newYork, _ := time.LoadLocation("America/New_York")\n    \n    almatyTime := now.In(almaty)\n    moscowTime := now.In(moscow)\n    londonTime := now.In(london)\n    newYorkTime := now.In(newYork)\n    \n    fmt.Printf("Алматы:  %s\\n", almatyTime.Format("15:04 MST"))\n    fmt.Printf("Москва:  %s\\n", moscowTime.Format("15:04 MST"))\n    fmt.Printf("Лондон:  %s\\n", londonTime.Format("15:04 MST"))\n    fmt.Printf("Нью-Йорк:%s\\n", newYorkTime.Format("15:04 MST"))\n    \n    // Создание времени в конкретной зоне\n    meetingAlmaty := time.Date(2024, 3, 15, 10, 0, 0, 0, almaty)\n    meetingMoscow := meetingAlmaty.In(moscow)\n    \n    fmt.Printf("\\nВстреча в Алматы: %s\\n", meetingAlmaty.Format("15:04 MST"))\n    fmt.Printf("То же в Москве:   %s\\n", meetingMoscow.Format("15:04 MST"))\n    \n    // time.FixedZone — создание зоны вручную\n    utcPlus6 := time.FixedZone("UTC+6", 6*60*60)\n    t := time.Now().In(utcPlus6)\n    fmt.Println("UTC+6:", t.Format("15:04 MST"))\n}'
        }
      ]
    },
    {
      id: 7,
      title: 'Практика: Планировщик событий',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте систему управления событиями с датами и временем.',
      requirements: [
        'Создать тип Event с полями Title string, StartTime time.Time, Duration time.Duration, Location string',
        'Метод EndTime() time.Time — вычисляет время окончания',
        'Метод IsUpcoming() bool — возвращает true если событие ещё не началось',
        'Метод IsPast() bool — возвращает true если событие уже закончилось',
        'Метод String() string — форматированное представление: "15 января 2024, 10:00-11:30 | Совещание (офис)"',
        'Функция FilterUpcoming(events []Event) []Event — только предстоящие события',
        'Функция SortByTime(events []Event) []Event — сортировка по времени начала',
        'В main() создать 5 событий (прошлые и будущие) и вывести только предстоящие'
      ],
      expectedOutput: 'Предстоящие события:\n15.03.2026, 10:00-11:00 | Совещание (Конференц-зал)\n20.03.2026, 14:00-15:30 | Презентация (Онлайн)',
      hint: 'time.Now().Add() для создания будущих событий. Используйте sort.Slice с time.Before для сортировки. IsUpcoming: StartTime.After(time.Now()).',
      solution: 'package main\n\nimport (\n    "fmt"\n    "sort"\n    "time"\n)\n\ntype Event struct {\n    Title     string\n    StartTime time.Time\n    Duration  time.Duration\n    Location  string\n}\n\nfunc (e Event) EndTime() time.Time {\n    return e.StartTime.Add(e.Duration)\n}\n\nfunc (e Event) IsUpcoming() bool {\n    return e.StartTime.After(time.Now())\n}\n\nfunc (e Event) IsPast() bool {\n    return e.EndTime().Before(time.Now())\n}\n\nfunc (e Event) String() string {\n    start := e.StartTime.Format("02.01.2006, 15:04")\n    end := e.EndTime().Format("15:04")\n    return fmt.Sprintf("%s-%s | %s (%s)", start, end, e.Title, e.Location)\n}\n\nfunc FilterUpcoming(events []Event) []Event {\n    var result []Event\n    for _, e := range events {\n        if e.IsUpcoming() {\n            result = append(result, e)\n        }\n    }\n    return result\n}\n\nfunc SortByTime(events []Event) []Event {\n    sorted := make([]Event, len(events))\n    copy(sorted, events)\n    sort.Slice(sorted, func(i, j int) bool {\n        return sorted[i].StartTime.Before(sorted[j].StartTime)\n    })\n    return sorted\n}\n\nfunc main() {\n    now := time.Now()\n    \n    events := []Event{\n        {\n            Title:     "Совещание",\n            StartTime: now.Add(5 * 24 * time.Hour),\n            Duration:  1 * time.Hour,\n            Location:  "Конференц-зал",\n        },\n        {\n            Title:     "Встреча с клиентом",\n            StartTime: now.Add(-2 * 24 * time.Hour), // прошлое\n            Duration:  90 * time.Minute,\n            Location:  "Кафе",\n        },\n        {\n            Title:     "Презентация",\n            StartTime: now.Add(10 * 24 * time.Hour),\n            Duration:  90 * time.Minute,\n            Location:  "Онлайн",\n        },\n        {\n            Title:     "Стэндап",\n            StartTime: now.Add(-1 * time.Hour), // час назад\n            Duration:  15 * time.Minute,\n            Location:  "Zoom",\n        },\n        {\n            Title:     "Ревью кода",\n            StartTime: now.Add(3 * 24 * time.Hour),\n            Duration:  2 * time.Hour,\n            Location:  "GitHub",\n        },\n    }\n    \n    fmt.Println("Все события:")\n    for _, e := range events {\n        status := "предстоит"\n        if e.IsPast() {\n            status = "прошло"\n        } else if !e.IsUpcoming() {\n            status = "идёт сейчас"\n        }\n        fmt.Printf("  [%s] %s\\n", status, e)\n    }\n    \n    fmt.Println("\\nПредстоящие события (по времени):")\n    upcoming := SortByTime(FilterUpcoming(events))\n    for _, e := range upcoming {\n        fmt.Println(" ", e)\n    }\n    \n    fmt.Printf("\\nВсего событий: %d, предстоящих: %d\\n",\n        len(events), len(upcoming))\n}',
      explanation: 'time.Time поддерживает Before/After для сравнения. Add(duration) и AddDate(y,m,d) для арифметики. Format с layout-строкой для красивого вывода. sort.Slice с функцией сравнения time.Before для сортировки событий.'
    }
  ]
}
