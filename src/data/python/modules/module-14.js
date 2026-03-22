export default {
  id: 14,
  title: 'Обработка исключений',
  description: 'Исключения Python: try/except/else/finally, raise, создание собственных исключений, иерархия исключений.',
  lessons: [
    {
      id: 1,
      title: 'try / except',
      content: [
        {
          type: 'heading',
          value: 'Перехват исключений'
        },
        {
          type: 'text',
          value: 'Исключение (exception) — это ошибка, которая возникает во время выполнения программы. Блок try/except позволяет перехватить исключение и обработать его, не завершая программу аварийно.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Базовый try/except\ntry:\n    result = 10 / 0\nexcept ZeroDivisionError:\n    print("Деление на ноль!")\n\n# Получение информации об ошибке\ntry:\n    number = int("hello")\nexcept ValueError as e:\n    print(f"Ошибка значения: {e}")\n\n# Несколько except блоков\ndef safe_divide(a, b):\n    try:\n        return a / b\n    except ZeroDivisionError:\n        print("Нельзя делить на ноль")\n        return None\n    except TypeError as e:\n        print(f"Неверный тип: {e}")\n        return None\n\nprint(safe_divide(10, 2))   # 5.0\nprint(safe_divide(10, 0))   # None\nprint(safe_divide("a", 2))  # None\n\n# Перехват нескольких типов в одном except\ntry:\n    data = int(input("Введите число: "))\nexcept (ValueError, TypeError) as e:\n    print(f"Ошибка: {e}")\n\n# Перехват любого исключения (осторожно!)\ntry:\n    risky_operation()\nexcept Exception as e:\n    print(f"Произошла ошибка: {type(e).__name__}: {e}")'
        }
      ]
    },
    {
      id: 2,
      title: 'else и finally',
      content: [
        {
          type: 'heading',
          value: 'Дополнительные блоки'
        },
        {
          type: 'text',
          value: 'Блок else выполняется если исключение НЕ возникло (т.е. try-блок выполнился успешно). Блок finally выполняется всегда — и при успехе, и при ошибке. Используйте finally для освобождения ресурсов.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# try / except / else / finally\ndef read_number(text):\n    try:\n        n = int(text)\n    except ValueError:\n        print("Не число!")\n    else:\n        # Выполняется ТОЛЬКО если исключения не было\n        print(f"Успех: {n * 2}")\n    finally:\n        # Выполняется ВСЕГДА\n        print("Завершение обработки")\n\nread_number("42")     # Успех: 84, Завершение\nread_number("hello")  # Не число!, Завершение\n\n# finally для освобождения ресурсов\nconn = None\ntry:\n    conn = connect_to_database()\n    data = conn.query("SELECT * FROM users")\nexcept ConnectionError as e:\n    print(f"Не удалось подключиться: {e}")\nfinally:\n    if conn:\n        conn.close()  # закрываем всегда!\n\n# Практический пример\ndef load_config(filename):\n    try:\n        with open(filename) as f:\n            import json\n            return json.load(f)\n    except FileNotFoundError:\n        print(f"Файл {filename} не найден, используем дефолтный конфиг")\n        return {}\n    except json.JSONDecodeError as e:\n        print(f"Ошибка формата JSON: {e}")\n        return None'
        }
      ]
    },
    {
      id: 3,
      title: 'Оператор raise',
      content: [
        {
          type: 'heading',
          value: 'Генерация исключений'
        },
        {
          type: 'text',
          value: 'raise позволяет генерировать исключения явно. Это полезно для валидации аргументов, сигнализации об ошибках из функций и перебрасывания исключений с дополнительным контекстом.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Генерация стандартных исключений\ndef divide(a, b):\n    if b == 0:\n        raise ValueError("Делитель не может быть нулём")\n    return a / b\n\ntry:\n    print(divide(10, 0))\nexcept ValueError as e:\n    print(e)  # Делитель не может быть нулём\n\n# Различные исключения для разных случаев\ndef set_age(age):\n    if not isinstance(age, int):\n        raise TypeError(f"Возраст должен быть int, получен {type(age).__name__}")\n    if age < 0:\n        raise ValueError(f"Возраст не может быть отрицательным: {age}")\n    if age > 150:\n        raise ValueError(f"Нереалистичный возраст: {age}")\n    return age\n\n# Перебрасывание с контекстом\ndef process_data(data):\n    try:\n        return complex_processing(data)\n    except ValueError as e:\n        raise RuntimeError("Ошибка обработки данных") from e\n\n# raise без аргументов — повторно бросает текущее исключение\ndef risky():\n    try:\n        1 / 0\n    except ZeroDivisionError:\n        print("Поймали, логируем...")\n        raise  # пробрасываем дальше'
        }
      ]
    },
    {
      id: 4,
      title: 'Иерархия исключений',
      content: [
        {
          type: 'heading',
          value: 'Дерево исключений Python'
        },
        {
          type: 'text',
          value: 'Все встроенные исключения Python образуют иерархию наследования. BaseException — корень. Exception — база для всех не-системных исключений. Перехватывая родительский класс, вы перехватываете и все дочерние.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Основные категории исключений:\n# BaseException\n#   SystemExit           — sys.exit()\n#   KeyboardInterrupt    — Ctrl+C\n#   Exception            — все обычные исключения\n#     ValueError         — неверное значение (int("abc"))\n#     TypeError          — неверный тип ("a" + 1)\n#     KeyError           — ключ в словаре ({}.get нет)\n#     IndexError         — индекс списка ([1,2][5])\n#     AttributeError     — нет атрибута\n#     FileNotFoundError  — файл не найден (подкласс OSError)\n#     ImportError        — ошибка импорта\n#     NameError          — имя не определено\n#     StopIteration      — конец итератора\n#     RuntimeError       — общие ошибки выполнения\n#     ArithmeticError\n#       ZeroDivisionError — деление на ноль\n#       OverflowError    — переполнение\n\n# Перехват по иерархии\ntry:\n    result = int("abc")\nexcept ValueError:  # перехватит ValueError и подклассы\n    print("Значение")\nexcept Exception:   # перехватит остальные Exception\n    print("Что-то пошло не так")\n\n# Проверка типа исключения\ntry:\n    [1, 2][10]\nexcept Exception as e:\n    print(type(e).__name__)  # IndexError\n    print(isinstance(e, LookupError))  # True (IndexError -> LookupError)\n    print(isinstance(e, Exception))    # True'
        }
      ]
    },
    {
      id: 5,
      title: 'Пользовательские исключения',
      content: [
        {
          type: 'heading',
          value: 'Создание своих классов исключений'
        },
        {
          type: 'text',
          value: 'Собственные исключения делают код яснее: вместо ValueError можно бросать InsufficientFundsError. Создайте класс, унаследованный от Exception (или более специфичного класса). Можно добавить атрибуты для дополнительных данных.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Простое пользовательское исключение\nclass AppError(Exception):\n    """Базовое исключение приложения."""\n    pass\n\nclass ValidationError(AppError):\n    """Ошибка валидации данных."""\n    def __init__(self, field, message):\n        self.field = field\n        self.message = message\n        super().__init__(f"Поле \'{field}\': {message}")\n\nclass InsufficientFundsError(AppError):\n    """Недостаточно средств."""\n    def __init__(self, balance, amount):\n        self.balance = balance\n        self.amount = amount\n        deficit = amount - balance\n        super().__init__(f"Недостаточно средств. Нужно: {amount}, есть: {balance}, не хватает: {deficit}")\n\n# Использование\ndef transfer(from_account, amount):\n    if amount <= 0:\n        raise ValidationError("amount", "Сумма должна быть положительной")\n    if from_account.balance < amount:\n        raise InsufficientFundsError(from_account.balance, amount)\n    from_account.balance -= amount\n\ntry:\n    transfer(account, 1000)\nexcept InsufficientFundsError as e:\n    print(f"Ошибка перевода: {e}")\n    print(f"Баланс: {e.balance}, Нужно: {e.amount}")\nexcept ValidationError as e:\n    print(f"Ошибка в поле {e.field}: {e.message}")\nexcept AppError:\n    print("Общая ошибка приложения")'
        }
      ]
    },
    {
      id: 6,
      title: 'Контекстные менеджеры и __exit__',
      content: [
        {
          type: 'heading',
          value: 'suppress и ExitStack'
        },
        {
          type: 'code',
          language: 'python',
          value: 'from contextlib import suppress\n\n# suppress — игнорирует указанные исключения\nwith suppress(FileNotFoundError):\n    import os\n    os.remove("temp.txt")  # не вызовет ошибку если файл не существует\n\n# Аналог without suppress:\ntry:\n    os.remove("temp.txt")\nexcept FileNotFoundError:\n    pass  # suppress делает то же самое, но чище\n\n# Логирование исключений\nimport logging\n\ndef safe_parse(text):\n    try:\n        return int(text)\n    except ValueError as e:\n        logging.error(f"Не удалось разобрать \'{text}\': {e}")\n        return None\n\n# exc_info=True добавляет traceback в лог\ntry:\n    risky_operation()\nexcept Exception:\n    logging.exception("Произошла ошибка")\n    # logging.exception автоматически включает traceback'
        }
      ]
    },
    {
      id: 7,
      title: 'Практика: Валидатор данных',
      type: 'practice',
      difficulty: 'intermediate',
      description: 'Создайте систему валидации данных пользователя с пользовательскими исключениями.',
      requirements: [
        'Создайте класс ValidationError с полями field и message',
        'Функция validate_email(email) — проверяет формат email (должен содержать @ и точку)',
        'Функция validate_age(age) — число 0-120',
        'Функция validate_username(username) — 3-20 символов, только буквы/цифры/_',
        'Функция validate_user(data) — вызывает все валидаторы, собирает ошибки в список'
      ],
      expectedOutput: 'Пользователь валиден!\nОшибки валидации:\n  email: Неверный формат email\n  age: Возраст должен быть от 0 до 120\n  username: Слишком короткий логин',
      hint: 'Для проверки email проверьте наличие @ и точки после @. Используйте try/except внутри validate_user для сбора всех ошибок. Для username используйте isalnum() или проверку через множество допустимых символов.',
      solution: 'class ValidationError(Exception):\n    def __init__(self, field, message):\n        self.field = field\n        self.message = message\n        super().__init__(f"{field}: {message}")\n\ndef validate_email(email):\n    if "@" not in email:\n        raise ValidationError("email", "Неверный формат email")\n    local, _, domain = email.partition("@")\n    if not local or "." not in domain:\n        raise ValidationError("email", "Неверный формат email")\n\ndef validate_age(age):\n    if not isinstance(age, int) or isinstance(age, bool):\n        raise ValidationError("age", "Возраст должен быть целым числом")\n    if not 0 <= age <= 120:\n        raise ValidationError("age", "Возраст должен быть от 0 до 120")\n\ndef validate_username(username):\n    if len(username) < 3:\n        raise ValidationError("username", "Слишком короткий логин")\n    if len(username) > 20:\n        raise ValidationError("username", "Логин слишком длинный")\n    allowed = set("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_")\n    if not all(c in allowed for c in username):\n        raise ValidationError("username", "Только буквы, цифры и _")\n\ndef validate_user(data):\n    errors = []\n    for validator, key in [(validate_email, "email"), (validate_age, "age"), (validate_username, "username")]:\n        try:\n            validator(data.get(key))\n        except ValidationError as e:\n            errors.append(e)\n    return errors\n\nvalid_user = {"email": "user@example.com", "age": 25, "username": "ivan_dev"}\nif not validate_user(valid_user):\n    print("Пользователь валиден!")\n\ninvalid_user = {"email": "not-email", "age": 200, "username": "ab"}\nerrors = validate_user(invalid_user)\nif errors:\n    print("Ошибки валидации:")\n    for e in errors:\n        print(f"  {e.field}: {e.message}")',
      explanation: 'Сбор всех ошибок валидации (а не остановка на первой) — удобнее для пользователя. Каждый валидатор независим — легко тестировать и расширять. Хранение поля в ValidationError.field позволяет выводить структурированные сообщения об ошибках.'
    }
  ]
}
