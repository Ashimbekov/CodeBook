export default {
  id: 27,
  title: 'Type Hints',
  description: 'Изучим систему подсказок типов Python: аннотации переменных и функций, модуль typing с Optional, Union, List, Dict и другими типами',
  lessons: [
    {
      id: 1, title: 'Зачем нужны подсказки типов', type: 'theory',
      content: [
        { type: 'text', value: 'Type hints (подсказки типов) — это необязательные аннотации, которые документируют ожидаемые типы переменных и параметров функций. Python их не проверяет в рантайме, но IDE и инструменты вроде mypy делают это статически.' },
        { type: 'tip', value: 'Представь type hints как дорожные знаки: Python не штрафует за их нарушение, но они помогают ориентироваться и IDEшникам, и другим разработчикам.' },
        { type: 'heading', value: 'Базовые аннотации' },
        { type: 'code', language: 'python', value: '# Без type hints\ndef greet(name):\n    return "Привет, " + name\n\n# С type hints\ndef greet(name: str) -> str:\n    return "Привет, " + name\n\n# Аннотации переменных\nage: int = 25\nname: str = "Аня"\npi: float = 3.14159\nactive: bool = True\n\n# Только аннотация, без значения\nusername: str  # переменная объявлена, но не инициализирована' },
        { type: 'heading', value: 'Аннотации функций' },
        { type: 'code', language: 'python', value: 'def add(a: int, b: int) -> int:\n    return a + b\n\ndef divide(a: float, b: float) -> float:\n    return a / b\n\ndef get_full_name(first: str, last: str) -> str:\n    return f"{first} {last}"\n\n# Функция без возвращаемого значения\ndef print_info(name: str, age: int) -> None:\n    print(f"{name}: {age} лет")' },
        { type: 'note', value: 'Type hints работают как документация. Функция greet(name: str) сразу говорит "ожидаю строку". Без них приходится читать тело функции.' }
      ]
    },
    {
      id: 2, title: 'Базовые типы из модуля typing', type: 'theory',
      content: [
        { type: 'text', value: 'Для сложных типов — коллекций, словарей, опциональных значений — используется модуль typing. В Python 3.9+ многие типы можно использовать напрямую (list[int] вместо List[int]).' },
        { type: 'heading', value: 'List, Dict, Tuple, Set' },
        { type: 'code', language: 'python', value: 'from typing import List, Dict, Tuple, Set\n\n# Python < 3.9\ndef process_scores(scores: List[int]) -> Dict[str, float]:\n    return {"sum": sum(scores), "avg": sum(scores)/len(scores)}\n\n# Python 3.9+  — можно без импорта\ndef process_scores_new(scores: list[int]) -> dict[str, float]:\n    return {"sum": sum(scores), "avg": sum(scores)/len(scores)}\n\n# Tuple с фиксированными типами\ndef get_point() -> Tuple[float, float]:\n    return 1.0, 2.0\n\n# Set уникальных строк\ndef get_tags(text: str) -> Set[str]:\n    return set(text.lower().split())' },
        { type: 'heading', value: 'Callable — тип функции' },
        { type: 'code', language: 'python', value: 'from typing import Callable\n\n# Callable[[типы_аргументов], тип_возврата]\ndef apply(func: Callable[[int, int], int], a: int, b: int) -> int:\n    return func(a, b)\n\nprint(apply(lambda x, y: x + y, 3, 4))  # 7\nprint(apply(lambda x, y: x * y, 3, 4))  # 12' }
      ]
    },
    {
      id: 3, title: 'Optional и Union', type: 'theory',
      content: [
        { type: 'text', value: 'Optional[X] означает, что значение может быть X или None. Union[X, Y] означает, что значение может быть X или Y. Это самые распространённые составные типы.' },
        { type: 'heading', value: 'Optional — может быть None' },
        { type: 'code', language: 'python', value: 'from typing import Optional\n\n# Optional[str] — это то же что Union[str, None]\ndef find_user(user_id: int) -> Optional[str]:\n    users = {1: "Аня", 2: "Боря"}\n    return users.get(user_id)  # может вернуть None\n\nname = find_user(1)\nif name is not None:\n    print(name.upper())  # IDE знает, что name теперь str\n\n# Параметр со значением None по умолчанию\ndef greet(name: str, title: Optional[str] = None) -> str:\n    if title:\n        return f"Добрый день, {title} {name}!"\n    return f"Привет, {name}!"' },
        { type: 'heading', value: 'Union — один из нескольких типов' },
        { type: 'code', language: 'python', value: 'from typing import Union\n\n# Python 3.9 и ниже\ndef process(value: Union[int, str, float]) -> str:\n    return str(value)\n\n# Python 3.10+ — новый синтаксис с |\ndef process_new(value: int | str | float) -> str:\n    return str(value)\n\nprint(process(42))      # "42"\nprint(process("hello")) # "hello"\nprint(process(3.14))    # "3.14"' },
        { type: 'tip', value: 'В Python 3.10+ вместо Optional[str] можно писать str | None, а вместо Union[int, str] — int | str. Это чище и не требует импорта.' }
      ]
    },
    {
      id: 4, title: 'TypeVar и Generic типы', type: 'theory',
      content: [
        { type: 'text', value: 'TypeVar позволяет создавать обобщённые функции (generic), которые работают с разными типами, сохраняя информацию о типе. Это основа для написания полиморфного типобезопасного кода.' },
        { type: 'heading', value: 'TypeVar — параметрический тип' },
        { type: 'code', language: 'python', value: 'from typing import TypeVar, List\n\nT = TypeVar("T")  # T — это "любой тип"\n\ndef first(items: List[T]) -> T:\n    """Возвращает первый элемент списка."""\n    return items[0]\n\n# IDE знает: first([1,2,3]) возвращает int\n# IDE знает: first(["a","b"]) возвращает str\nprint(first([1, 2, 3]))      # 1 (int)\nprint(first(["a", "b"]))     # "a" (str)\n\ndef identity(x: T) -> T:\n    return x\n\nresult: int = identity(42)   # OK\nresult2: str = identity("x") # OK' },
        { type: 'heading', value: 'Ограниченный TypeVar' },
        { type: 'code', language: 'python', value: 'from typing import TypeVar\n\n# Тип только из числового семейства\nNumber = TypeVar("Number", int, float)\n\ndef double(x: Number) -> Number:\n    return x * 2\n\nprint(double(5))    # 10 (int)\nprint(double(2.5))  # 5.0 (float)' },
        { type: 'note', value: 'TypeVar используется для библиотечного кода. В обычных приложениях он встречается редко — чаще достаточно Optional и Union.' }
      ]
    },
    {
      id: 5, title: 'Аннотации в классах и Protocol', type: 'theory',
      content: [
        { type: 'text', value: 'Type hints работают и в классах: аннотируются атрибуты, методы, свойства. Protocol позволяет описывать "структурную" типизацию — duck typing с проверкой.' },
        { type: 'heading', value: 'Аннотации в классе' },
        { type: 'code', language: 'python', value: 'from typing import Optional, List\n\nclass Student:\n    name: str\n    age: int\n    grades: List[float]\n    mentor: Optional["Student"] = None  # ссылка на тот же класс\n\n    def __init__(self, name: str, age: int) -> None:\n        self.name = name\n        self.age = age\n        self.grades = []\n\n    def add_grade(self, grade: float) -> None:\n        self.grades.append(grade)\n\n    def average(self) -> float:\n        if not self.grades:\n            return 0.0\n        return sum(self.grades) / len(self.grades)\n\ns = Student("Аня", 20)\ns.add_grade(85.0)\ns.add_grade(92.0)\nprint(s.average())  # 88.5' },
        { type: 'heading', value: 'Protocol — структурная типизация' },
        { type: 'code', language: 'python', value: 'from typing import Protocol\n\nclass Drawable(Protocol):\n    def draw(self) -> None: ...\n\nclass Circle:\n    def draw(self) -> None:\n        print("Рисую круг")\n\nclass Rectangle:\n    def draw(self) -> None:\n        print("Рисую прямоугольник")\n\ndef render(shape: Drawable) -> None:\n    shape.draw()\n\n# Circle и Rectangle не наследуют Drawable,\n# но соответствуют протоколу (duck typing + type safety)\nrender(Circle())     # Рисую круг\nrender(Rectangle())  # Рисую прямоугольник' }
      ]
    },
    {
      id: 6, title: 'Any, Final, Literal', type: 'theory',
      content: [
        { type: 'text', value: 'Модуль typing содержит несколько специальных типов: Any отключает проверку, Final запрещает переопределение, Literal ограничивает допустимые значения.' },
        { type: 'heading', value: 'Any, Final, Literal' },
        { type: 'code', language: 'python', value: 'from typing import Any, Final, Literal\n\n# Any — отключить проверку типа\ndef serialize(data: Any) -> str:\n    return str(data)\n\n# Final — константа, нельзя переопределить\nMAX_SIZE: Final = 100\nPI: Final[float] = 3.14159\n\n# Literal — только конкретные значения\nDirection = Literal["north", "south", "east", "west"]\n\ndef move(direction: Direction, steps: int) -> None:\n    print(f"Движение {direction} на {steps} шагов")\n\nmove("north", 5)   # OK\n# move("up", 5)    # mypy ошибка: "up" не входит в Literal' },
        { type: 'tip', value: 'Literal особенно полезен для функций, принимающих только определённые строки — например, режимы работы: mode: Literal["read", "write", "append"].' }
      ]
    },
    {
      id: 7, title: 'Практика: Типизированный стек', type: 'practice', difficulty: 'medium',
      description: 'Реализуй обобщённый класс Stack[T] с полными аннотациями типов. Стек должен быть типобезопасным и работать с любым типом.',
      requirements: [
        'Класс Stack с TypeVar T',
        'Методы: push(item: T) -> None, pop() -> T, peek() -> T, is_empty() -> bool, size() -> int',
        'pop() и peek() возвращают Optional[T] или бросают исключение при пустом стеке',
        'Все методы полностью аннотированы',
        'Продемонстрируй работу с int-стеком и str-стеком'
      ],
      expectedOutput: 'Стек чисел: [1, 2, 3]\nPeek: 3\nPop: 3\nРазмер: 2\nСтек строк: ["hello", "world"]\nPop строки: world',
      hint: 'Используй Generic[T] как родительский класс. from typing import TypeVar, Generic, Optional. T = TypeVar("T").',
      solution: 'from typing import TypeVar, Generic, Optional, List\n\nT = TypeVar("T")\n\nclass Stack(Generic[T]):\n    def __init__(self) -> None:\n        self._items: List[T] = []\n\n    def push(self, item: T) -> None:\n        self._items.append(item)\n\n    def pop(self) -> T:\n        if self.is_empty():\n            raise IndexError("Стек пуст")\n        return self._items.pop()\n\n    def peek(self) -> T:\n        if self.is_empty():\n            raise IndexError("Стек пуст")\n        return self._items[-1]\n\n    def is_empty(self) -> bool:\n        return len(self._items) == 0\n\n    def size(self) -> int:\n        return len(self._items)\n\n    def __repr__(self) -> str:\n        return f"Stack({self._items})"\n\nint_stack: Stack[int] = Stack()\nint_stack.push(1)\nint_stack.push(2)\nint_stack.push(3)\nprint(f"Стек чисел: {int_stack._items}")\nprint(f"Peek: {int_stack.peek()}")\nprint(f"Pop: {int_stack.pop()}")\nprint(f"Размер: {int_stack.size()}")\n\nstr_stack: Stack[str] = Stack()\nstr_stack.push("hello")\nstr_stack.push("world")\nprint(f"Стек строк: {str_stack._items}")\nprint(f"Pop строки: {str_stack.pop()}")',
      explanation: 'Generic[T] делает класс параметрическим. Список _items: List[T] типизирован тем же параметром. При создании Stack[int] все методы автоматически работают с int. Type checker поймает ошибку если попытаться push строку в Stack[int].'
    }
  ]
}
