export default {
  id: 40,
  title: 'logging',
  description: 'Изучим профессиональное логирование в Python: настройку Logger, уровни логов, обработчики (handlers) и форматтеры',
  lessons: [
    {
      id: 1, title: 'Зачем logging вместо print()', type: 'theory',
      content: [
        { type: 'text', value: 'print() — для обучения. logging — для продакшн-кода. Логирование позволяет контролировать уровень деталей, направлять вывод в файлы и настраивать формат без изменения кода.' },
        { type: 'heading', value: 'Уровни логирования' },
        { type: 'code', language: 'python', value: 'import logging\n\n# 5 уровней по возрастанию важности:\nlogging.debug("DEBUG: детальная отладка")      # 10\nlogging.info("INFO: нормальная работа")         # 20\nlogging.warning("WARNING: что-то подозрительно")  # 30\nlogging.error("ERROR: ошибка, но продолжаем")  # 40\nlogging.critical("CRITICAL: всё сломалось!")   # 50\n\n# По умолчанию выводятся только WARNING и выше\n# В консоли появятся только последние 3' },
        { type: 'heading', value: 'Базовая настройка через basicConfig' },
        { type: 'code', language: 'python', value: 'import logging\n\nlogging.basicConfig(\n    level=logging.DEBUG,  # показывать всё начиная с DEBUG\n    format="%(asctime)s - %(levelname)s - %(message)s",\n    datefmt="%Y-%m-%d %H:%M:%S"\n)\n\nlogging.debug("Начинаем работу")\nlogging.info("Пользователь авторизован")\nlogging.warning("Диск заполнен на 80%")\nlogging.error("Ошибка подключения к БД")\n# 2024-03-15 14:30:00 - DEBUG - Начинаем работу\n# 2024-03-15 14:30:00 - INFO - Пользователь авторизован\n# ...' },
        { type: 'tip', value: 'Никогда не используй print() для диагностики в продакшн-коде. Логи можно фильтровать, направлять в файлы, отправлять в облако — print() так не умеет.' }
      ]
    },
    {
      id: 2, title: 'Logger — именованные логгеры', type: 'theory',
      content: [
        { type: 'text', value: 'Хорошая практика — создавать именованный логгер для каждого модуля. Это позволяет настраивать уровни для разных частей программы независимо.' },
        { type: 'heading', value: 'Создание логгера' },
        { type: 'code', language: 'python', value: 'import logging\n\n# Создаём логгер для модуля\nlogger = logging.getLogger(__name__)  # имя = имя модуля\n\n# Или с явным именем\ndb_logger = logging.getLogger("myapp.database")\napi_logger = logging.getLogger("myapp.api")\n\n# Логгеры образуют иерархию по точкам:\n# "myapp" — родитель для "myapp.database" и "myapp.api"\n\nlogger.debug("Отладка модуля")\nlogger.info("Всё работает")\nlogger.warning("Предупреждение")\n\n# Логирование с форматированием\nuser_id = 42\nlogger.info("Пользователь %s вошёл в систему", user_id)  # безопаснее чем f-строка!' },
        { type: 'heading', value: 'Конфигурация уровней' },
        { type: 'code', language: 'python', value: 'import logging\n\n# Устанавливаем уровни для разных логгеров\nlogging.getLogger("myapp").setLevel(logging.DEBUG)\nlogging.getLogger("myapp.database").setLevel(logging.WARNING)  # только важное\nlogging.getLogger("myapp.api").setLevel(logging.INFO)\n\n# Отключить надоедливые логи сторонних библиотек\nlogging.getLogger("urllib3").setLevel(logging.WARNING)\nlogging.getLogger("requests").setLevel(logging.WARNING)' }
      ]
    },
    {
      id: 3, title: 'Handlers — куда пишем логи', type: 'theory',
      content: [
        { type: 'text', value: 'Handler определяет куда записываются логи: в консоль, файл, сеть, email. Один логгер может иметь несколько обработчиков одновременно.' },
        { type: 'heading', value: 'StreamHandler и FileHandler' },
        { type: 'code', language: 'python', value: 'import logging\n\nlogger = logging.getLogger("myapp")\nlogger.setLevel(logging.DEBUG)  # логгер принимает все уровни\n\n# Handler 1: консоль — только WARNING и выше\nconsole_handler = logging.StreamHandler()\nconsole_handler.setLevel(logging.WARNING)\n\n# Handler 2: файл — всё начиная с DEBUG\nfile_handler = logging.FileHandler("app.log", encoding="utf-8")\nfile_handler.setLevel(logging.DEBUG)\n\n# Добавляем обработчики к логгеру\nlogger.addHandler(console_handler)\nlogger.addHandler(file_handler)\n\nlogger.debug("Детали — только в файл")\nlogger.warning("Предупреждение — и в консоль, и в файл")\nlogger.error("Ошибка — и в консоль, и в файл")' },
        { type: 'heading', value: 'RotatingFileHandler — ротация файлов' },
        { type: 'code', language: 'python', value: 'import logging\nfrom logging.handlers import RotatingFileHandler\n\nhandler = RotatingFileHandler(\n    "app.log",\n    maxBytes=10 * 1024 * 1024,  # 10 МБ\n    backupCount=5               # хранить 5 архивных файлов\n)\n# При превышении 10 МБ: app.log -> app.log.1 -> app.log.2 ...\n\nlogger = logging.getLogger("myapp")\nlogger.addHandler(handler)' },
        { type: 'note', value: 'RotatingFileHandler предотвращает бесконтрольный рост лог-файлов. TimedRotatingFileHandler ротирует по времени (каждый день, неделю и т.д.).' }
      ]
    },
    {
      id: 4, title: 'Formatter — формат записей', type: 'theory',
      content: [
        { type: 'text', value: 'Formatter определяет как выглядит каждая запись лога. Разные handler\'ы могут использовать разные форматы — например, краткий для консоли и подробный для файла.' },
        { type: 'heading', value: 'Настройка форматтеров' },
        { type: 'code', language: 'python', value: 'import logging\n\n# Доступные поля форматтера:\n# %(asctime)s   — время\n# %(name)s      — имя логгера\n# %(levelname)s — уровень (DEBUG, INFO, ...)\n# %(message)s   — само сообщение\n# %(filename)s  — имя файла\n# %(lineno)d    — номер строки\n# %(funcName)s  — имя функции\n\ndetailed_fmt = logging.Formatter(\n    "%(asctime)s [%(levelname)8s] %(name)s:%(lineno)d - %(message)s",\n    datefmt="%Y-%m-%d %H:%M:%S"\n)\n\nsimple_fmt = logging.Formatter("%(levelname)s: %(message)s")\n\nlogger = logging.getLogger("test")\n\nconsole = logging.StreamHandler()\nconsole.setFormatter(simple_fmt)\n\nfile_h = logging.FileHandler("detailed.log")\nfile_h.setFormatter(detailed_fmt)\n\nlogger.addHandler(console)\nlogger.addHandler(file_h)\nlogger.setLevel(logging.DEBUG)\n\nlogger.info("Сервер запущен")' }
      ]
    },
    {
      id: 5, title: 'Логирование исключений и dictConfig', type: 'theory',
      content: [
        { type: 'text', value: 'logger.exception() автоматически добавляет traceback в лог. dictConfig позволяет настраивать логирование через словарь — удобно для вынесения конфигурации в файл.' },
        { type: 'heading', value: 'Логирование исключений' },
        { type: 'code', language: 'python', value: 'import logging\n\nlogger = logging.getLogger(__name__)\n\ndef process_data(data):\n    try:\n        result = 10 / data\n        logger.info("Результат: %s", result)\n        return result\n    except ZeroDivisionError:\n        logger.exception("Ошибка при обработке данных: %s", data)\n        # exception() автоматически добавляет трейсбэк!\n        return None\n    except Exception as e:\n        logger.error("Неожиданная ошибка: %s", e, exc_info=True)\n        raise\n\nprocess_data(0)\n# ERROR:__main__:Ошибка при обработке данных: 0\n# Traceback (most recent call last):\n#   ...\n# ZeroDivisionError: division by zero' },
        { type: 'heading', value: 'dictConfig — конфигурация через словарь' },
        { type: 'code', language: 'python', value: 'import logging\nimport logging.config\n\nLOGGING_CONFIG = {\n    "version": 1,\n    "disable_existing_loggers": False,\n    "formatters": {\n        "simple": {"format": "%(levelname)s: %(message)s"},\n        "detailed": {"format": "%(asctime)s %(name)s %(levelname)s: %(message)s"}\n    },\n    "handlers": {\n        "console": {\n            "class": "logging.StreamHandler",\n            "formatter": "simple",\n            "level": "WARNING"\n        },\n        "file": {\n            "class": "logging.FileHandler",\n            "filename": "app.log",\n            "formatter": "detailed",\n            "level": "DEBUG"\n        }\n    },\n    "root": {\n        "level": "DEBUG",\n        "handlers": ["console", "file"]\n    }\n}\n\nlogging.config.dictConfig(LOGGING_CONFIG)' }
      ]
    },
    {
      id: 6, title: 'Практика: Система логирования для приложения', type: 'practice', difficulty: 'medium',
      description: 'Настрой полноценную систему логирования для небольшого приложения с разными уровнями и направлениями.',
      requirements: [
        'Создай логгер "app" с уровнем DEBUG',
        'Добавь StreamHandler для WARNING+ с простым форматом',
        'Добавь FileHandler "app.log" для DEBUG+ с подробным форматом (включая имя файла и строку)',
        'Функция simulate_app() выполняет действия и логирует: INFO для успешных, WARNING для подозрительных, ERROR с exception() для ошибок',
        'Продемонстрируй что в консоль идут только WARNING+, а в файл всё'
      ],
      expectedOutput: 'WARNING: Диск заполнен на 85%\nERROR: Ошибка при делении\nTraceback...\n[В файле: DEBUG и INFO тоже есть]',
      hint: 'logger.exception() вызывай внутри except блока. FileHandler нужно создать перед добавлением, иначе он создаёт файл при импорте.',
      solution: 'import logging\nimport os\n\ndef setup_logging():\n    logger = logging.getLogger("app")\n    logger.setLevel(logging.DEBUG)\n\n    # Консоль: WARNING и выше, краткий формат\n    console = logging.StreamHandler()\n    console.setLevel(logging.WARNING)\n    console.setFormatter(logging.Formatter("%(levelname)s: %(message)s"))\n\n    # Файл: DEBUG и выше, подробный формат\n    file_h = logging.FileHandler("app.log", encoding="utf-8")\n    file_h.setLevel(logging.DEBUG)\n    file_h.setFormatter(logging.Formatter(\n        "%(asctime)s [%(levelname)s] %(filename)s:%(lineno)d - %(message)s",\n        datefmt="%H:%M:%S"\n    ))\n\n    logger.addHandler(console)\n    logger.addHandler(file_h)\n    return logger\n\ndef simulate_app(logger):\n    logger.debug("Приложение запущено")\n    logger.info("Пользователь alice авторизован")\n    logger.info("Запрос к БД выполнен: 42 записи")\n\n    disk_usage = 85\n    if disk_usage > 80:\n        logger.warning("Диск заполнен на %d%%", disk_usage)\n\n    try:\n        result = 100 / 0\n    except ZeroDivisionError:\n        logger.exception("Ошибка при делении")\n\n    logger.info("Сеанс завершён")\n\nlogger = setup_logging()\nsimulate_app(logger)\n\nprint("\\n--- Содержимое app.log ---")\nwith open("app.log", encoding="utf-8") as f:\n    print(f.read())\nos.remove("app.log")',
      explanation: 'Два handler\'а для разных аудиторий: оператор видит только WARNING+ в консоли, разработчик читает всё в файле. exception() автоматически добавляет traceback — это критически важно для диагностики ошибок в продакшне.'
    }
  ]
}
