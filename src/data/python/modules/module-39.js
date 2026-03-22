export default {
  id: 39,
  title: 'datetime',
  description: 'Научимся работать с датами и временем в Python: объекты date, time, datetime, timedelta и форматирование через strftime/strptime',
  lessons: [
    {
      id: 1, title: 'Объекты date и time', type: 'theory',
      content: [
        { type: 'text', value: 'Модуль datetime содержит несколько классов для работы со временем. date хранит только дату (год, месяц, день), time — только время (часы, минуты, секунды).' },
        { type: 'heading', value: 'Класс date' },
        { type: 'code', language: 'python', value: 'from datetime import date\n\n# Создание даты\nd = date(2024, 3, 15)  # год, месяц, день\ntoday = date.today()   # сегодняшняя дата\n\nprint(d)             # 2024-03-15\nprint(today)         # текущая дата\nprint(d.year)        # 2024\nprint(d.month)       # 3\nprint(d.day)         # 15\nprint(d.weekday())   # 0=пн, 1=вт, ..., 6=вс\nprint(d.isoformat()) # "2024-03-15"\n\n# Из ISO строки\nd2 = date.fromisoformat("2024-12-31")\nprint(d2)' },
        { type: 'heading', value: 'Класс time' },
        { type: 'code', language: 'python', value: 'from datetime import time\n\nt = time(14, 30, 45, 500000)  # час, мин, сек, микросек\nprint(t)           # 14:30:45.500000\nprint(t.hour)      # 14\nprint(t.minute)    # 30\nprint(t.second)    # 45\nprint(t.microsecond)  # 500000\n\n# Время без микросекунд\nt2 = time(9, 0)\nprint(t2)  # 09:00:00' }
      ]
    },
    {
      id: 2, title: 'Класс datetime — дата и время', type: 'theory',
      content: [
        { type: 'text', value: 'datetime — самый используемый класс модуля. Он объединяет дату и время и предоставляет методы для текущего момента, парсинга и форматирования.' },
        { type: 'heading', value: 'Создание datetime' },
        { type: 'code', language: 'python', value: 'from datetime import datetime\n\n# Конструктор\ndt = datetime(2024, 3, 15, 14, 30, 0)\nprint(dt)  # 2024-03-15 14:30:00\n\n# Текущее время\nnow = datetime.now()\nprint(now)   # 2024-03-15 14:30:45.123456\n\n# UTC время\nutc = datetime.utcnow()\nprint(utc)\n\n# Из timestamp (Unix time)\nfrom_ts = datetime.fromtimestamp(1710504645)\nprint(from_ts)\n\n# В timestamp\nts = now.timestamp()\nprint(ts)  # 1710504645.123\n\n# Комбинирование date и time\nfrom datetime import date, time\ncombined = datetime.combine(date.today(), time(18, 0))\nprint(combined)' },
        { type: 'tip', value: 'datetime.now() возвращает локальное время, datetime.utcnow() — UTC. Для серьёзных приложений используй timezone-aware объекты через pytz или zoneinfo.' }
      ]
    },
    {
      id: 3, title: 'timedelta — работа с интервалами', type: 'theory',
      content: [
        { type: 'text', value: 'timedelta представляет разницу между двумя моментами времени. Можно складывать и вычитать с date и datetime, что позволяет делать расчёты с датами.' },
        { type: 'heading', value: 'Создание timedelta' },
        { type: 'code', language: 'python', value: 'from datetime import datetime, timedelta\n\n# Создание интервала\none_day     = timedelta(days=1)\nthree_hours = timedelta(hours=3)\nweek        = timedelta(weeks=1)\nmixed       = timedelta(days=2, hours=3, minutes=30)\n\n# Арифметика с датами\nnow = datetime.now()\ntomorrow   = now + timedelta(days=1)\nyesterday  = now - timedelta(days=1)\nnext_week  = now + timedelta(weeks=1)\nin_2_hours = now + timedelta(hours=2)\n\nprint(tomorrow)\nprint(yesterday)' },
        { type: 'heading', value: 'Разница между датами' },
        { type: 'code', language: 'python', value: 'from datetime import datetime, date\n\n# Разность дат даёт timedelta\nbirthday = date(1990, 5, 15)\ntoday = date.today()\nage_delta = today - birthday\n\nprint(f"Дней прожито: {age_delta.days}")\nprint(f"Лет примерно: {age_delta.days // 365}")\n\n# Разница datetime\nstart = datetime(2024, 1, 1, 9, 0)\nend = datetime(2024, 1, 1, 17, 30)\nduration = end - start\n\nprint(f"Рабочий день: {duration}")          # 8:30:00\nprint(f"В часах: {duration.total_seconds() / 3600}")  # 8.5' },
        { type: 'note', value: 'timedelta хранит данные в днях, секундах и микросекундах. Используй total_seconds() для получения общего числа секунд.' }
      ]
    },
    {
      id: 4, title: 'strftime и strptime — форматирование', type: 'theory',
      content: [
        { type: 'text', value: 'strftime() конвертирует datetime в строку по шаблону. strptime() парсит строку в datetime. Это ключевые инструменты для работы с датами из внешних источников.' },
        { type: 'heading', value: 'strftime — datetime в строку' },
        { type: 'code', language: 'python', value: 'from datetime import datetime\n\ndt = datetime(2024, 3, 15, 14, 30, 45)\n\n# Основные директивы:\n# %Y — год (2024)    %m — месяц (03)   %d — день (15)\n# %H — час (14)     %M — минуты (30)  %S — секунды (45)\n# %A — день недели  %B — месяц строкой %p — AM/PM\n\nprint(dt.strftime("%d.%m.%Y"))          # 15.03.2024\nprint(dt.strftime("%Y-%m-%d %H:%M"))    # 2024-03-15 14:30\nprint(dt.strftime("%d %B %Y"))          # 15 March 2024\nprint(dt.strftime("Дата: %d.%m.%Y, %H:%M:%S"))' },
        { type: 'heading', value: 'strptime — строка в datetime' },
        { type: 'code', language: 'python', value: 'from datetime import datetime\n\n# Парсинг разных форматов\ndt1 = datetime.strptime("15.03.2024", "%d.%m.%Y")\ndt2 = datetime.strptime("2024-03-15 14:30", "%Y-%m-%d %H:%M")\ndt3 = datetime.strptime("March 15, 2024", "%B %d, %Y")\n\nprint(dt1)  # 2024-03-15 00:00:00\nprint(dt2)  # 2024-03-15 14:30:00\n\n# ISO формат — специальный метод\ndt4 = datetime.fromisoformat("2024-03-15T14:30:00")\nprint(dt4)' },
        { type: 'tip', value: 'fromisoformat() и isoformat() — самые простые методы для работы с ISO 8601 форматом, который используется в JSON и API.' }
      ]
    },
    {
      id: 5, title: 'Часовые пояса', type: 'theory',
      content: [
        { type: 'text', value: 'datetime объекты бывают naive (без информации о часовом поясе) и aware (со знанием часового пояса). Для серьёзных приложений нужны aware объекты.' },
        { type: 'heading', value: 'Работа с часовыми поясами через zoneinfo' },
        { type: 'code', language: 'python', value: 'from datetime import datetime\nfrom zoneinfo import ZoneInfo  # Python 3.9+\n\n# Timezone-aware datetime\nmoscow_tz = ZoneInfo("Europe/Moscow")\nnow_moscow = datetime.now(moscow_tz)\nprint(now_moscow)  # 2024-03-15 17:30:00+03:00\n\n# Конвертация между поясами\nnew_york_tz = ZoneInfo("America/New_York")\nnow_ny = now_moscow.astimezone(new_york_tz)\nprint(now_ny)  # 2024-03-15 09:30:00-05:00\n\n# UTC\nfrom datetime import timezone\nutc_dt = datetime.now(timezone.utc)\nprint(utc_dt)' },
        { type: 'note', value: 'zoneinfo встроен в Python 3.9+. Для 3.6-3.8 используй backports.zoneinfo или популярную библиотеку pytz.' }
      ]
    },
    {
      id: 6, title: 'Практика: Календарь событий', type: 'practice', difficulty: 'medium',
      description: 'Создай систему управления событиями с использованием datetime и timedelta.',
      requirements: [
        'Класс Event: title, start(datetime), duration(timedelta)',
        'Свойство end возвращает start + duration',
        'Метод is_active(moment) проверяет активно ли событие в данный момент',
        'Функция events_today(events, date) возвращает события на дату',
        'Функция next_event(events) возвращает ближайшее будущее событие',
        'Форматированный вывод через strftime'
      ],
      expectedOutput: 'Событие: Встреча\nНачало: 15.03.2024 10:00\nКонец:  15.03.2024 11:30\nПродолжительность: 1:30:00\nСобытий сегодня: 2\nСледующее: Обед в 12:00',
      hint: 'is_active: start <= moment <= end. events_today: e.start.date() == date. next_event: min(e for e in events if e.start > now, key=lambda e: e.start).',
      solution: 'from datetime import datetime, timedelta, date\n\nclass Event:\n    def __init__(self, title: str, start: datetime, duration: timedelta):\n        self.title = title\n        self.start = start\n        self.duration = duration\n\n    @property\n    def end(self) -> datetime:\n        return self.start + self.duration\n\n    def is_active(self, moment: datetime) -> bool:\n        return self.start <= moment <= self.end\n\n    def __repr__(self) -> str:\n        return (f"Event(\'{self.title}\', "\n                f"{self.start.strftime(\'%d.%m %H:%M\')} - "\n                f"{self.end.strftime(\'%H:%M\')})")\n\ndef events_today(events, check_date: date):\n    return [e for e in events if e.start.date() == check_date]\n\ndef next_event(events):\n    now = datetime.now()\n    future = [e for e in events if e.start > now]\n    return min(future, key=lambda e: e.start) if future else None\n\n# Демонстрация\nbase = datetime(2024, 3, 15, 10, 0)\nevents = [\n    Event("Встреча", base, timedelta(hours=1, minutes=30)),\n    Event("Обед",    base.replace(hour=12), timedelta(hours=1)),\n    Event("Коллзвонок", datetime(2024, 3, 16, 9, 0), timedelta(minutes=45)),\n]\n\ne = events[0]\nprint(f"Событие: {e.title}")\nprint(f"Начало: {e.start.strftime(\'%d.%m.%Y %H:%M\')}")\nprint(f"Конец:  {e.end.strftime(\'%d.%m.%Y %H:%M\')}")\nprint(f"Продолжительность: {e.duration}")\n\ntoday_events = events_today(events, date(2024, 3, 15))\nprint(f"Событий сегодня: {len(today_events)}")',
      explanation: 'Класс Event инкапсулирует логику работы с датами. Свойство end вычисляется из start + duration — это лучше чем хранить и то, и другое (избегаем рассинхронизации). strftime обеспечивает читаемый вывод.'
    }
  ]
}
