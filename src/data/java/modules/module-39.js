export default {
  id: 39,
  title: 'Дата и время (java.time)',
  description: 'Современный API для работы с датами и временем в Java: LocalDate, LocalTime, LocalDateTime, Period, Duration, ZonedDateTime',
  lessons: [
    {
      id: 1,
      title: 'LocalDate — работа с датами',
      type: 'theory',
      content: [
        { type: 'text', value: 'LocalDate представляет дату без времени (год, месяц, день). Появился в Java 8 как замена старым классам Date и Calendar, которые были запутанными и неудобными.' },
        { type: 'tip', value: 'LocalDate — как страница в настольном календаре. Там написано "21 марта 2026" — только дата, без времени. Если нужно время — это уже LocalTime или LocalDateTime.' },
        { type: 'code', language: 'java', value: 'import java.time.LocalDate;\nimport java.time.Month;\n\n// Текущая дата\nLocalDate today = LocalDate.now();\nSystem.out.println(today); // 2026-03-21\n\n// Конкретная дата\nLocalDate birthday = LocalDate.of(1995, 6, 15);\nSystem.out.println(birthday); // 1995-06-15\n\n// С помощью Month (удобнее)\nLocalDate holiday = LocalDate.of(2026, Month.JANUARY, 1);\nSystem.out.println(holiday); // 2026-01-01' },
        { type: 'heading', value: 'Получение компонентов даты' },
        { type: 'code', language: 'java', value: 'LocalDate date = LocalDate.of(2026, 3, 21);\n\nSystem.out.println(date.getYear());       // 2026\nSystem.out.println(date.getMonth());      // MARCH\nSystem.out.println(date.getMonthValue()); // 3\nSystem.out.println(date.getDayOfMonth()); // 21\nSystem.out.println(date.getDayOfWeek());  // SATURDAY\nSystem.out.println(date.getDayOfYear());  // 80' },
        { type: 'heading', value: 'Операции с датами' },
        { type: 'code', language: 'java', value: 'LocalDate today = LocalDate.of(2026, 3, 21);\n\n// Добавление\nLocalDate nextWeek = today.plusDays(7);\nLocalDate nextMonth = today.plusMonths(1);\nLocalDate nextYear = today.plusYears(1);\nSystem.out.println(nextWeek);   // 2026-03-28\nSystem.out.println(nextMonth);  // 2026-04-21\nSystem.out.println(nextYear);   // 2027-03-21\n\n// Вычитание\nLocalDate lastWeek = today.minusDays(7);\nSystem.out.println(lastWeek);   // 2026-03-14\n\n// Сравнение\nLocalDate date1 = LocalDate.of(2026, 1, 1);\nLocalDate date2 = LocalDate.of(2026, 6, 1);\nSystem.out.println(date1.isBefore(date2)); // true\nSystem.out.println(date1.isAfter(date2));  // false\nSystem.out.println(date1.isEqual(date2));  // false' },
        { type: 'note', value: 'Объекты LocalDate (и другие классы java.time) — неизменяемые (immutable). Методы plusDays(), minusMonths() не меняют исходный объект, а возвращают новый.' }
      ]
    },
    {
      id: 2,
      title: 'LocalTime — работа со временем',
      type: 'theory',
      content: [
        { type: 'text', value: 'LocalTime представляет время без даты (часы, минуты, секунды, наносекунды). Полезен для расписаний, будильников, времени работы.' },
        { type: 'code', language: 'java', value: 'import java.time.LocalTime;\n\n// Текущее время\nLocalTime now = LocalTime.now();\nSystem.out.println(now); // 14:35:22.123456789\n\n// Конкретное время\nLocalTime lunchTime = LocalTime.of(12, 30);\nLocalTime meetingTime = LocalTime.of(14, 45, 30); // с секундами\nSystem.out.println(lunchTime);   // 12:30\nSystem.out.println(meetingTime); // 14:45:30' },
        { type: 'heading', value: 'Компоненты времени' },
        { type: 'code', language: 'java', value: 'LocalTime time = LocalTime.of(14, 45, 30);\n\nSystem.out.println(time.getHour());        // 14\nSystem.out.println(time.getMinute());      // 45\nSystem.out.println(time.getSecond());      // 30\nSystem.out.println(time.getNano());        // 0' },
        { type: 'heading', value: 'Операции со временем' },
        { type: 'code', language: 'java', value: 'LocalTime start = LocalTime.of(9, 0);\n\nLocalTime end = start.plusHours(8).plusMinutes(30);\nSystem.out.println(end); // 17:30\n\n// Сравнение\nLocalTime open = LocalTime.of(9, 0);\nLocalTime close = LocalTime.of(18, 0);\nLocalTime current = LocalTime.of(14, 30);\n\nboolean isOpen = current.isAfter(open) && current.isBefore(close);\nSystem.out.println("Магазин открыт: " + isOpen); // true' },
        { type: 'heading', value: 'Константы' },
        { type: 'code', language: 'java', value: 'System.out.println(LocalTime.MIN);      // 00:00\nSystem.out.println(LocalTime.MAX);      // 23:59:59.999999999\nSystem.out.println(LocalTime.MIDNIGHT); // 00:00\nSystem.out.println(LocalTime.NOON);     // 12:00' },
        { type: 'tip', value: 'LocalTime работает в рамках одного дня. Если добавить 25 часов к 14:00 — получишь 15:00 (следующий день). Для работы с датой И временем используй LocalDateTime.' }
      ]
    },
    {
      id: 3,
      title: 'LocalDateTime — дата и время вместе',
      type: 'theory',
      content: [
        { type: 'text', value: 'LocalDateTime — комбинация LocalDate и LocalTime. Представляет конкретный момент в виде даты+времени, но без информации о часовом поясе.' },
        { type: 'code', language: 'java', value: 'import java.time.LocalDateTime;\n\n// Текущие дата и время\nLocalDateTime now = LocalDateTime.now();\nSystem.out.println(now); // 2026-03-21T14:35:22.123\n\n// Конкретный момент\nLocalDateTime event = LocalDateTime.of(2026, 12, 31, 23, 59, 59);\nSystem.out.println(event); // 2026-12-31T23:59:59\n\n// Из отдельных объектов\nLocalDate date = LocalDate.of(2026, 6, 15);\nLocalTime time = LocalTime.of(10, 0);\nLocalDateTime meeting = LocalDateTime.of(date, time);\nSystem.out.println(meeting); // 2026-06-15T10:00' },
        { type: 'heading', value: 'Преобразования' },
        { type: 'code', language: 'java', value: 'LocalDateTime dateTime = LocalDateTime.of(2026, 3, 21, 14, 30);\n\n// Получить только дату или только время\nLocalDate date = dateTime.toLocalDate();\nLocalTime time = dateTime.toLocalTime();\n\nSystem.out.println(date); // 2026-03-21\nSystem.out.println(time); // 14:30' },
        { type: 'heading', value: 'Операции с LocalDateTime' },
        { type: 'code', language: 'java', value: 'LocalDateTime start = LocalDateTime.of(2026, 3, 21, 9, 0);\n\n// Добавляем 2 дня и 3 часа\nLocalDateTime deadline = start.plusDays(2).plusHours(3);\nSystem.out.println(deadline); // 2026-03-23T12:00\n\n// Изменение компонента\nLocalDateTime sameTimeTomorrow = start.plusDays(1);\nLocalDateTime noonToday = start.withHour(12).withMinute(0);\nSystem.out.println(noonToday); // 2026-03-21T12:00' },
        { type: 'warning', value: 'LocalDateTime не содержит информацию о часовом поясе. Если важен часовой пояс (например, для международных систем) — используй ZonedDateTime или Instant.' }
      ]
    },
    {
      id: 4,
      title: 'Period и Duration — промежутки времени',
      type: 'theory',
      content: [
        { type: 'text', value: 'Period — промежуток в днях, месяцах, годах. Duration — промежуток в часах, минутах, секундах, наносекундах.' },
        { type: 'tip', value: 'Period — как "3 года и 5 месяцев". Duration — как "2 часа 30 минут". Period для дат, Duration для времени.' },
        { type: 'heading', value: 'Period — промежуток в датах' },
        { type: 'code', language: 'java', value: 'import java.time.Period;\n\nLocalDate birth = LocalDate.of(2000, 6, 15);\nLocalDate today = LocalDate.of(2026, 3, 21);\n\nPeriod age = Period.between(birth, today);\nSystem.out.println("Возраст: " + age.getYears() + " лет, "\n    + age.getMonths() + " месяцев, "\n    + age.getDays() + " дней");\n// Возраст: 25 лет, 9 месяцев, 6 дней\n\n// Создать Period вручную\nPeriod threeMonths = Period.ofMonths(3);\nPeriod twoYears = Period.of(2, 0, 0); // 2 года\n\n// Добавить к дате\nLocalDate future = today.plus(threeMonths);\nSystem.out.println(future); // 2026-06-21' },
        { type: 'heading', value: 'Duration — промежуток во времени' },
        { type: 'code', language: 'java', value: 'import java.time.Duration;\n\nLocalTime start = LocalTime.of(9, 0);\nLocalTime end = LocalTime.of(17, 30);\n\nDuration workDay = Duration.between(start, end);\nSystem.out.println("Рабочий день: " + workDay.toHours() + " ч " +\n    (workDay.toMinutes() % 60) + " мин");\n// Рабочий день: 8 ч 30 мин\n\n// Создать Duration вручную\nDuration twoHours = Duration.ofHours(2);\nDuration tenMinutes = Duration.ofMinutes(10);\n\n// Для LocalDateTime\nLocalDateTime dt1 = LocalDateTime.of(2026, 3, 21, 9, 0);\nLocalDateTime dt2 = LocalDateTime.of(2026, 3, 22, 12, 30);\nDuration d = Duration.between(dt1, dt2);\nSystem.out.println("Разница: " + d.toHours() + " часов"); // 27' },
        { type: 'note', value: 'Period.between() и Duration.between() принимают аргументы от меньшего к большему. Если от большего к меньшему — значение будет отрицательным.' }
      ]
    },
    {
      id: 5,
      title: 'DateTimeFormatter — форматирование',
      type: 'theory',
      content: [
        { type: 'text', value: 'DateTimeFormatter позволяет преобразовывать дату/время в строку (форматирование) и строку в дату/время (парсинг).' },
        { type: 'code', language: 'java', value: 'import java.time.format.DateTimeFormatter;\n\nLocalDate date = LocalDate.of(2026, 3, 21);\n\n// Встроенные форматы\nSystem.out.println(date.format(DateTimeFormatter.ISO_DATE));\n// 2026-03-21\n\nSystem.out.println(date.format(DateTimeFormatter.ofPattern("dd.MM.yyyy")));\n// 21.03.2026\n\nSystem.out.println(date.format(DateTimeFormatter.ofPattern("d MMMM yyyy", new java.util.Locale("ru"))));\n// 21 марта 2026' },
        { type: 'heading', value: 'Паттерны форматирования' },
        { type: 'list', items: [
          'yyyy — год (4 цифры): 2026',
          'MM — месяц (2 цифры): 03',
          'MMMM — полное название месяца: March',
          'dd — день (2 цифры): 21',
          'HH — часы 24ч: 14',
          'mm — минуты: 35',
          'ss — секунды: 22',
          'EEE — день недели сокращённо: Sat'
        ]},
        { type: 'code', language: 'java', value: 'LocalDateTime now = LocalDateTime.of(2026, 3, 21, 14, 35, 22);\n\n// Разные форматы\nDateTimeFormatter f1 = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");\nDateTimeFormatter f2 = DateTimeFormatter.ofPattern("yyyy-MM-dd\'T\'HH:mm:ss");\nDateTimeFormatter f3 = DateTimeFormatter.ofPattern("dd MMMM yyyy, HH:mm",\n    new java.util.Locale("ru"));\n\nSystem.out.println(now.format(f1)); // 21/03/2026 14:35\nSystem.out.println(now.format(f2)); // 2026-03-21T14:35:22\nSystem.out.println(now.format(f3)); // 21 марта 2026, 14:35' },
        { type: 'heading', value: 'Парсинг строки в дату' },
        { type: 'code', language: 'java', value: '// Строку -> LocalDate\nDateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd.MM.yyyy");\nLocalDate parsed = LocalDate.parse("21.03.2026", fmt);\nSystem.out.println(parsed); // 2026-03-21\n\n// Строку -> LocalDateTime\nDateTimeFormatter fmt2 = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm");\nLocalDateTime dt = LocalDateTime.parse("21.03.2026 14:30", fmt2);\nSystem.out.println(dt); // 2026-03-21T14:30' }
      ]
    },
    {
      id: 6,
      title: 'ZonedDateTime — часовые пояса',
      type: 'theory',
      content: [
        { type: 'text', value: 'ZonedDateTime — это LocalDateTime + часовой пояс. Нужен для международных систем, когда важно в каком городе происходит событие.' },
        { type: 'code', language: 'java', value: 'import java.time.ZonedDateTime;\nimport java.time.ZoneId;\n\n// Текущее время в нашем часовом поясе\nZonedDateTime now = ZonedDateTime.now();\nSystem.out.println(now);\n// 2026-03-21T14:35:22.123+05:00[Asia/Almaty]\n\n// Создать с конкретным часовым поясом\nZonedDateTime almaty = ZonedDateTime.of(\n    LocalDateTime.of(2026, 3, 21, 14, 0),\n    ZoneId.of("Asia/Almaty")\n);\nSystem.out.println(almaty);\n// 2026-03-21T14:00+05:00[Asia/Almaty]' },
        { type: 'heading', value: 'Перевод между часовыми поясами' },
        { type: 'code', language: 'java', value: '// Конференция в Алматы в 14:00\nZonedDateTime almatyTime = ZonedDateTime.of(\n    LocalDateTime.of(2026, 3, 21, 14, 0),\n    ZoneId.of("Asia/Almaty")  // UTC+5\n);\n\n// Сколько будет в Москве?\nZonedDateTime moscowTime = almatyTime.withZoneSameInstant(\n    ZoneId.of("Europe/Moscow")  // UTC+3\n);\nSystem.out.println("Алматы: " + almatyTime.toLocalTime()); // 14:00\nSystem.out.println("Москва: " + moscowTime.toLocalTime());  // 12:00\n\n// Нью-Йорк (UTC-4)\nZonedDateTime nyTime = almatyTime.withZoneSameInstant(\n    ZoneId.of("America/New_York")\n);\nSystem.out.println("Нью-Йорк: " + nyTime.toLocalTime()); // 05:00' },
        { type: 'heading', value: 'Все доступные часовые пояса' },
        { type: 'code', language: 'java', value: '// Посмотреть все доступные ID\nZoneId.getAvailableZoneIds().stream()\n    .filter(id -> id.contains("Asia"))\n    .sorted()\n    .limit(5)\n    .forEach(System.out::println);\n// Asia/Almaty\n// Asia/Amman\n// Asia/Anadyr\n// ...' },
        { type: 'tip', value: 'Для большинства задач хватает LocalDate и LocalDateTime. ZonedDateTime нужен только когда работаешь с пользователями из разных стран или конвертируешь время между зонами.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: работа с датами и временем',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напиши программу для управления событиями календаря.',
      requirements: [
        'Создай LocalDate для сегодня (21 марта 2026) и дня рождения (15 июня 2000)',
        'Вычисли возраст через Period.between() и выведи в формате "X лет Y месяцев"',
        'Создай LocalDateTime для встречи: 25 марта 2026 в 15:30',
        'Отформатируй встречу в виде "25 марта 2026, 15:30" (используй Locale.forLanguageTag("ru"))',
        'Вычисли сколько часов осталось до встречи от сегодня 09:00',
        'Выведи дату через 100 дней от сегодня'
      ],
      expectedOutput: 'Сегодня: 2026-03-21\nДень рождения: 2000-06-15\nВозраст: 25 лет 9 месяцев\nВстреча: 25 марта 2026, 15:30\nЧасов до встречи: 150\nЧерез 100 дней: 2026-06-29',
      hint: 'Для форматирования с русским языком: DateTimeFormatter.ofPattern("d MMMM yyyy, HH:mm", Locale.forLanguageTag("ru")). Для Duration между двумя LocalDateTime: Duration.between(dt1, dt2).toHours().',
      solution: 'import java.time.*;\nimport java.time.format.*;\nimport java.util.Locale;\n\npublic class Main {\n    public static void main(String[] args) {\n        LocalDate today = LocalDate.of(2026, 3, 21);\n        LocalDate birthday = LocalDate.of(2000, 6, 15);\n        System.out.println("Сегодня: " + today);\n        System.out.println("День рождения: " + birthday);\n\n        Period age = Period.between(birthday, today);\n        System.out.println("Возраст: " + age.getYears() + " лет " + age.getMonths() + " месяцев");\n\n        LocalDateTime meeting = LocalDateTime.of(2026, 3, 25, 15, 30);\n        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("d MMMM yyyy, HH:mm",\n            Locale.forLanguageTag("ru"));\n        System.out.println("Встреча: " + meeting.format(fmt));\n\n        LocalDateTime startFrom = LocalDateTime.of(today, LocalTime.of(9, 0));\n        long hoursLeft = Duration.between(startFrom, meeting).toHours();\n        System.out.println("Часов до встречи: " + hoursLeft);\n\n        LocalDate in100days = today.plusDays(100);\n        System.out.println("Через 100 дней: " + in100days);\n    }\n}',
      explanation: 'java.time — это иммутабельный API. Каждый метод (plusDays, withHour и т.д.) возвращает новый объект. Locale.forLanguageTag("ru") важна для русских названий месяцев. Duration.between() принимает Temporal — оба аргумента должны быть одного типа (оба LocalDateTime или оба LocalTime).'
    }
  ]
}
