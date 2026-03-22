export default {
  id: 52,
  title: 'Clean Code в Python',
  description: 'Принципы чистого кода: читаемость, функции, DRY, KISS, SOLID — пишем код который легко поддерживать',
  lessons: [
    {
      id: 1,
      title: 'Говорящие имена и читаемость',
      type: 'theory',
      content: [
        { type: 'text', value: 'Чистый код читается как хорошо написанная проза. Имена должны раскрывать намерение, исключать дезинформацию и быть различимыми.' },
        { type: 'code', language: 'python', value: '# Плохо: непонятные имена\ndef calc(d, r=0.1):\n    return d - d * r\n\nresult = calc(5000)\n\n# Хорошо: говорящие имена\ndef calculate_discounted_price(original_price, discount_rate=0.1):\n    """Вычисляет цену со скидкой.\n\n    Args:\n        original_price: Исходная цена товара.\n        discount_rate: Ставка скидки (по умолчанию 10%).\n\n    Returns:\n        Цена после применения скидки.\n    """\n    return original_price * (1 - discount_rate)\n\ndiscounted_price = calculate_discounted_price(5000)\n\n# Плохо: магические числа\ndef get_subscription_price(plan):\n    if plan == 1:\n        return 299\n    elif plan == 2:\n        return 599\n    elif plan == 3:\n        return 999\n\n# Хорошо: именованные константы\nBASIC_PLAN_PRICE = 299\nPRO_PLAN_PRICE = 599\nENTERPRISE_PLAN_PRICE = 999\n\nfrom enum import Enum\n\nclass SubscriptionPlan(Enum):\n    BASIC = 1\n    PRO = 2\n    ENTERPRISE = 3\n\nPLAN_PRICES = {\n    SubscriptionPlan.BASIC: 299,\n    SubscriptionPlan.PRO: 599,\n    SubscriptionPlan.ENTERPRISE: 999\n}\n\ndef get_subscription_price(plan: SubscriptionPlan) -> int:\n    return PLAN_PRICES[plan]' }
      ]
    },
    {
      id: 2,
      title: 'Функции: маленькие и одноответственные',
      type: 'theory',
      content: [
        { type: 'text', value: 'Функция должна делать одну вещь и делать её хорошо. Если функцию трудно назвать без союза "и", она делает слишком много.' },
        { type: 'code', language: 'python', value: '# Плохо: функция делает слишком много\ndef process_user_data(user_data):\n    # Валидация\n    if not user_data.get(\'email\'):\n        return None\n    if \'@\' not in user_data[\'email\']:\n        return None\n    # Нормализация\n    user_data[\'email\'] = user_data[\'email\'].lower().strip()\n    user_data[\'name\'] = user_data[\'name\'].strip().title()\n    # Сохранение в базу данных\n    db.save(user_data)\n    # Отправка email\n    send_welcome_email(user_data[\'email\'])\n    return user_data\n\n# Хорошо: каждая функция — одна ответственность\ndef validate_user_email(email: str) -> bool:\n    """Проверяет корректность email."""\n    return bool(email) and \'@\' in email\n\ndef normalize_user_data(user_data: dict) -> dict:\n    """Нормализует данные пользователя."""\n    return {\n        **user_data,\n        \'email\': user_data[\'email\'].lower().strip(),\n        \'name\': user_data[\'name\'].strip().title()\n    }\n\ndef register_user(user_data: dict) -> dict | None:\n    """Полный процесс регистрации пользователя."""\n    if not validate_user_email(user_data.get(\'email\', \'\')):\n        return None\n    normalized = normalize_user_data(user_data)\n    db.save(normalized)\n    send_welcome_email(normalized[\'email\'])\n    return normalized\n\n# Аргументы: чем меньше, тем лучше\n# Идеал: 0-2 аргумента. 3+ — сигнал рефакторинга\n# Если много аргументов — передай объект/dataclass\nfrom dataclasses import dataclass\n\n@dataclass\nclass UserRegistrationData:\n    name: str\n    email: str\n    password: str\n    age: int = 0\n\ndef register(data: UserRegistrationData) -> dict:\n    pass' }
      ]
    },
    {
      id: 3,
      title: 'DRY: Don\'t Repeat Yourself',
      type: 'theory',
      content: [
        { type: 'text', value: 'DRY — каждый кусок знания должен иметь одно единственное представление в системе. Дублирование — корень зла: при изменении нужно менять в нескольких местах.' },
        { type: 'code', language: 'python', value: '# Плохо: дублирование логики\ndef get_user_full_name(user):\n    first = user[\'first_name\'].strip().title()\n    last = user[\'last_name\'].strip().title()\n    return f"{first} {last}"\n\ndef display_user_profile(user):\n    first = user[\'first_name\'].strip().title()  # дублирование!\n    last = user[\'last_name\'].strip().title()    # дублирование!\n    print(f"Профиль: {first} {last}")\n\ndef send_email_to_user(user):\n    first = user[\'first_name\'].strip().title()  # дублирование!\n    last = user[\'last_name\'].strip().title()    # дублирование!\n    send(f"Привет, {first} {last}!")\n\n# Хорошо: единый источник истины\ndef format_full_name(first_name: str, last_name: str) -> str:\n    return f"{first_name.strip().title()} {last_name.strip().title()}"\n\ndef get_user_full_name(user: dict) -> str:\n    return format_full_name(user[\'first_name\'], user[\'last_name\'])\n\ndef display_user_profile(user: dict) -> None:\n    print(f"Профиль: {get_user_full_name(user)}")\n\ndef send_email_to_user(user: dict) -> None:\n    send(f"Привет, {get_user_full_name(user)}!")\n\n# DRY в конфигурации\n# Плохо\nDEV_DB_HOST = \'localhost\'\nDEV_DB_PORT = 5432\nPROD_DB_HOST = \'prod.server.com\'\nPROD_DB_PORT = 5432  # дублирование!\n\n# Хорошо\nDEFAULT_DB_PORT = 5432\nDATABASES = {\n    \'dev\': {\'host\': \'localhost\', \'port\': DEFAULT_DB_PORT},\n    \'prod\': {\'host\': \'prod.server.com\', \'port\': DEFAULT_DB_PORT}\n}' }
      ]
    },
    {
      id: 4,
      title: 'Обработка ошибок и защитные условия',
      type: 'theory',
      content: [
        { type: 'text', value: 'Чистая обработка ошибок: конкретные исключения, ранний выход, не использовать исключения для управления потоком.' },
        { type: 'code', language: 'python', value: '# Плохо: глубокая вложенность\ndef process_order(order):\n    if order is not None:\n        if order.get(\'items\'):\n            if len(order[\'items\']) > 0:\n                if order.get(\'user_id\'):\n                    # Основная логика глубоко в недрах\n                    return calculate_total(order)\n    return None\n\n# Хорошо: ранний выход (Guard Clauses)\ndef process_order(order):\n    if order is None:\n        raise ValueError("Заказ не может быть None")\n    if not order.get(\'items\'):\n        raise ValueError("Заказ должен содержать товары")\n    if not order.get(\'user_id\'):\n        raise ValueError("Заказ должен иметь пользователя")\n\n    # Основная логика без вложенности\n    return calculate_total(order)\n\n# Конкретные исключения\nclass OrderValidationError(ValueError):\n    pass\n\nclass EmptyOrderError(OrderValidationError):\n    pass\n\nclass MissingUserError(OrderValidationError):\n    pass\n\n# Плохо: ловить все исключения\ntry:\n    result = risky_operation()\nexcept Exception:  # слишком широко!\n    pass           # никогда так не делай!\n\n# Хорошо: конкретные исключения с логированием\nimport logging\nlogger = logging.getLogger(__name__)\n\ntry:\n    result = risky_operation()\nexcept ConnectionError as e:\n    logger.error("Ошибка соединения: %s", e)\n    raise\nexcept ValueError as e:\n    logger.warning("Некорректные данные: %s", e)\n    result = default_value' }
      ]
    },
    {
      id: 5,
      title: 'SOLID принципы (кратко)',
      type: 'theory',
      content: [
        { type: 'text', value: 'SOLID — пять принципов объектно-ориентированного дизайна. Делают код гибким, понятным и поддерживаемым.' },
        { type: 'code', language: 'python', value: 'from abc import ABC, abstractmethod\n\n# S — Single Responsibility: один класс = одна ответственность\nclass UserRepository:  # только работа с БД\n    def find_by_id(self, user_id): ...\n    def save(self, user): ...\n\nclass UserEmailService:  # только отправка email\n    def send_welcome(self, user): ...\n    def send_notification(self, user, message): ...\n\n# O — Open/Closed: открыт для расширения, закрыт для изменения\nclass DiscountStrategy(ABC):\n    @abstractmethod\n    def calculate(self, price: float) -> float: ...\n\nclass NoDiscount(DiscountStrategy):\n    def calculate(self, price): return price\n\nclass PercentDiscount(DiscountStrategy):\n    def __init__(self, percent): self.percent = percent\n    def calculate(self, price): return price * (1 - self.percent / 100)\n\nclass BlackFridayDiscount(DiscountStrategy):  # расширяем без изменения существующего\n    def calculate(self, price): return price * 0.5\n\n# L — Liskov Substitution: подтип должен заменять базовый тип\nclass Shape(ABC):\n    @abstractmethod\n    def area(self) -> float: ...\n\nclass Rectangle(Shape):\n    def __init__(self, w, h): self.w, self.h = w, h\n    def area(self): return self.w * self.h\n\nclass Circle(Shape):\n    def __init__(self, r): self.r = r\n    def area(self): return 3.14 * self.r ** 2\n\ndef print_area(shape: Shape):  # работает с любым Shape\n    print(shape.area())\n\n# I — Interface Segregation: лучше много маленьких интерфейсов\n# D — Dependency Inversion: зависей от абстракций, не от конкретик\nclass NotificationService:\n    def __init__(self, sender: \'MessageSender\'):  # абстракция\n        self.sender = sender\n\n    def notify(self, user, message):\n        self.sender.send(user, message)' }
      ]
    },
    {
      id: 6,
      title: 'Code смells и рефакторинг',
      type: 'theory',
      content: [
        { type: 'text', value: 'Code smells — признаки проблем в коде. Не ошибки, но сигналы что код трудно поддерживать.' },
        { type: 'code', language: 'python', value: '# Smell 1: Длинная функция — разбей на части\n# Smell 2: Длинный список параметров — используй объект/dataclass\n\n# Smell 3: Переключатель по типу — используй полиморфизм\n# Плохо\ndef get_area(shape_type, *args):\n    if shape_type == \'circle\':\n        return 3.14 * args[0] ** 2\n    elif shape_type == \'rectangle\':\n        return args[0] * args[1]\n    elif shape_type == \'triangle\':\n        return 0.5 * args[0] * args[1]\n\n# Хорошо — полиморфизм (см. SOLID выше)\n\n# Smell 4: Дублирующий код — Extract Method\n\n# Smell 5: Мёртвый код — удали его\ndef old_calculate():  # никогда не вызывается\n    pass\n\n# Smell 6: Комментарий вместо имени\n# Плохо\nd = 86400  # секунд в сутках\n\n# Хорошо\nSECONDS_PER_DAY = 86400\n\n# Smell 7: Shotgun Surgery — изменение в одном месте требует изменений в 10\n# Решение: собери связанные данные/поведение в один класс\n\n# Smell 8: Feature Envy — метод больше работает с другим классом\n# Плохо\nclass Order:\n    def get_customer_discount(self, customer):\n        if customer.is_premium:\n            return 0.15\n        elif customer.purchase_count > 10:\n            return 0.05\n        return 0\n\n# Хорошо — логика скидки принадлежит Customer\nclass Customer:\n    @property\n    def discount_rate(self) -> float:\n        if self.is_premium:\n            return 0.15\n        elif self.purchase_count > 10:\n            return 0.05\n        return 0.0' },
        { type: 'tip', value: 'Рефакторинг без тестов — опасно. Сначала напиши тесты, убедись что они проходят, затем рефактори. Тесты — страховка что ты ничего не сломал.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Рефакторинг функции',
      type: 'practice',
      difficulty: 'medium',
      description: 'Отрефактори "грязный" код в чистый, применяя изученные принципы.',
      requirements: [
        'Функция process_data(d) принимает список словарей с ключами n(имя), a(возраст), s(зарплата)',
        'Она должна: отфильтровать возраст < 18, нормализовать имена (title case), вычислить налог 13%, отсортировать по зарплате',
        'Разбей на 4 маленькие функции с понятными именами',
        'Добавь type hints и docstrings',
        'Убери магические числа (18 и 0.13)',
        'Добавь обработку ошибок для некорректных данных'
      ],
      expectedOutput: 'Отрефакторенный код с:\n- Понятными именами\n- 4 функциями по 1 задаче\n- Type hints\n- Константами вместо магических чисел\n- Обработкой ошибок',
      hint: 'MIN_WORKING_AGE = 18, INCOME_TAX_RATE = 0.13. validate_employee(), normalize_employee(), calculate_net_salary(), process_employees() — хорошие имена.',
      solution: 'from typing import TypedDict\n\nMIN_WORKING_AGE = 18\nINCOME_TAX_RATE = 0.13\n\n\nclass Employee(TypedDict):\n    name: str\n    age: int\n    salary: float\n\n\ndef is_eligible_employee(employee: Employee) -> bool:\n    """Проверяет достижение работником трудоспособного возраста."""\n    return employee.get(\'age\', 0) >= MIN_WORKING_AGE\n\n\ndef normalize_employee_name(employee: Employee) -> Employee:\n    """Нормализует имя сотрудника в формат Title Case."""\n    return {\n        **employee,\n        \'name\': employee[\'name\'].strip().title()\n    }\n\n\ndef calculate_net_salary(gross_salary: float) -> float:\n    """Вычисляет зарплату после вычета подоходного налога."""\n    if gross_salary < 0:\n        raise ValueError(f"Зарплата не может быть отрицательной: {gross_salary}")\n    tax = gross_salary * INCOME_TAX_RATE\n    return gross_salary - tax\n\n\ndef process_employees(raw_data: list[dict]) -> list[Employee]:\n    """Обрабатывает список сотрудников: фильтрация, нормализация, сортировка.\n\n    Args:\n        raw_data: Список словарей с ключами name, age, salary.\n\n    Returns:\n        Отсортированный по зарплате список обработанных сотрудников.\n    """\n    result = []\n    for record in raw_data:\n        try:\n            employee = Employee(\n                name=record[\'name\'],\n                age=int(record[\'age\']),\n                salary=float(record[\'salary\'])\n            )\n        except (KeyError, ValueError) as e:\n            print(f"Пропуск некорректной записи {record}: {e}")\n            continue\n\n        if not is_eligible_employee(employee):\n            continue\n\n        normalized = normalize_employee_name(employee)\n        normalized[\'net_salary\'] = calculate_net_salary(normalized[\'salary\'])\n        result.append(normalized)\n\n    return sorted(result, key=lambda e: e[\'salary\'], reverse=True)\n\n\n# Тест\nraw = [\n    {\'name\': \'алиса иванова\', \'age\': 28, \'salary\': 80000},\n    {\'name\': \'Боб\', \'age\': 16, \'salary\': 30000},  # несовершеннолетний\n    {\'name\': \'ВАСЯ\', \'age\': 35, \'salary\': 95000},\n    {\'name\': \'дина\', \'age\': \'двадцать\', \'salary\': 60000},  # ошибка\n]\nfor emp in process_employees(raw):\n    print(f"{emp[\'name\']}: зарплата {emp[\'salary\']:,.0f}, чистыми {emp[\'net_salary\']:,.0f}")',
      explanation: 'TypedDict документирует структуру словаря. Каждая функция — одна ответственность. try/except в цикле позволяет пропустить плохие записи не останавливая обработку. Константы MIN_WORKING_AGE и INCOME_TAX_RATE — единый источник истины.'
    }
  ]
}
