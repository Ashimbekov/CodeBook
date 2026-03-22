export default {
  id: 5,
  title: 'Циклы (for, while)',
  description: 'Циклы for и while, функции range() и enumerate(), операторы break/continue/else, вложенные циклы.',
  lessons: [
    {
      id: 1,
      title: 'Цикл for',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Перебор элементов'
        },
        {
          type: 'text',
          value: 'Цикл for в Python перебирает элементы любого итерируемого объекта: строки, списка, кортежа, словаря, файла и т.д. Это отличает его от for в C/Java, где цикл работает со счётчиком.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Перебор списка\nfruits = ["яблоко", "банан", "вишня"]\nfor fruit in fruits:\n    print(fruit)\n\n# Перебор строки (посимвольно)\nfor char in "Python":\n    print(char, end=" ")\n# Вывод: P y t h o n\n\n# Перебор словаря (ключи по умолчанию)\nperson = {"имя": "Иван", "возраст": 30}\nfor key in person:\n    print(key, ":", person[key])\n\n# Перебор пар ключ-значение\nfor key, value in person.items():\n    print(f"{key} = {value}")'
        }
      ]
    },
    {
      id: 2,
      title: 'Функция range()',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Генерация числовых последовательностей'
        },
        {
          type: 'text',
          value: 'Функция range() создаёт последовательность чисел. Она принимает 1, 2 или 3 аргумента: stop; start, stop; start, stop, step. range() не создаёт список в памяти — это "ленивая" последовательность, которая экономит память.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# range(stop) — от 0 до stop-1\nfor i in range(5):\n    print(i, end=" ")  # 0 1 2 3 4\n\n# range(start, stop)\nfor i in range(1, 6):\n    print(i, end=" ")  # 1 2 3 4 5\n\n# range(start, stop, step)\nfor i in range(0, 11, 2):\n    print(i, end=" ")  # 0 2 4 6 8 10\n\n# Обратный порядок\nfor i in range(10, 0, -1):\n    print(i, end=" ")  # 10 9 8 7 6 5 4 3 2 1\n\n# Преобразование в список\nprint(list(range(5)))    # [0, 1, 2, 3, 4]\nprint(list(range(2, 8, 2)))  # [2, 4, 6]\n\n# Сумма чисел от 1 до 100\ntotal = 0\nfor i in range(1, 101):\n    total += i\nprint(total)  # 5050'
        },
        {
          type: 'tip',
          value: 'range() экономит память: range(1000000) не создаёт список из миллиона чисел — она вычисляет каждое число по запросу. Поэтому for i in range(n) всегда предпочтительнее for i in list(range(n)).'
        }
      ]
    },
    {
      id: 3,
      title: 'Функция enumerate()',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Перебор с индексом'
        },
        {
          type: 'text',
          value: 'Функция enumerate() позволяет получать индекс и значение одновременно при переборе. Это идиоматический Python-способ, когда нужен счётчик. Не используйте range(len(list)) — это непитоничный код.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'languages = ["Python", "JavaScript", "Go", "Rust"]\n\n# Антипаттерн: range(len())\nfor i in range(len(languages)):\n    print(f"{i}: {languages[i]}")\n\n# Питоничный способ: enumerate()\nfor i, lang in enumerate(languages):\n    print(f"{i}: {lang}")\n\n# Начало нумерации с 1\nfor i, lang in enumerate(languages, start=1):\n    print(f"{i}. {lang}")\n# 1. Python\n# 2. JavaScript\n# 3. Go\n# 4. Rust\n\n# Практический пример: нахождение всех позиций элемента\ndata = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3]\nfor i, val in enumerate(data):\n    if val == 1:\n        print(f"Число 1 найдено на позиции {i}")'
        }
      ]
    },
    {
      id: 4,
      title: 'Цикл while',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Цикл с условием'
        },
        {
          type: 'text',
          value: 'Цикл while выполняется пока условие истинно. Он используется, когда количество итераций неизвестно заранее. Будьте осторожны с бесконечными циклами: убедитесь, что условие в какой-то момент станет ложным.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Базовый while\ncounter = 0\nwhile counter < 5:\n    print(counter)\n    counter += 1  # без этого — бесконечный цикл!\n\n# Угадай число\nimport random\nsecret = random.randint(1, 10)\nguess = 0\nattempts = 0\n\nwhile guess != secret:\n    guess = random.randint(1, 10)  # симуляция\n    attempts += 1\n\nprint(f"Угадано за {attempts} попыток")\n\n# Бесконечный цикл с явным выходом\nwhile True:\n    data = input("Введите команду (quit для выхода): ")\n    if data == "quit":\n        break\n    print(f"Вы ввели: {data}")'
        },
        {
          type: 'warning',
          value: 'Всегда проверяйте, что условие while когда-то станет False. Бесконечный цикл (while True без break) допустим только когда логика break гарантированно сработает.'
        }
      ]
    },
    {
      id: 5,
      title: 'break, continue, else',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Управление циклом'
        },
        {
          type: 'text',
          value: 'break немедленно прерывает цикл. continue пропускает текущую итерацию и переходит к следующей. else в цикле — уникальная особенность Python: блок else выполняется, если цикл завершился нормально (без break).'
        },
        {
          type: 'code',
          language: 'python',
          value: '# break — досрочный выход\nfor i in range(10):\n    if i == 5:\n        break\n    print(i, end=" ")  # 0 1 2 3 4\n\nprint("\\nПосле break")\n\n# continue — пропуск итерации\nfor i in range(10):\n    if i % 2 == 0:\n        continue  # пропускаем чётные\n    print(i, end=" ")  # 1 3 5 7 9\n\n# else в цикле — выполняется если не было break\ndef find_prime(n):\n    for i in range(2, n):\n        if n % i == 0:\n            print(f"{n} не простое ({n} = {i} * {n//i})")\n            break\n    else:\n        # Дошли до конца без break — число простое!\n        print(f"{n} — простое число")\n\nfind_prime(7)   # 7 — простое число\nfind_prime(12)  # 12 не простое (12 = 2 * 6)'
        }
      ]
    },
    {
      id: 6,
      title: 'Вложенные циклы',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Циклы внутри циклов'
        },
        {
          type: 'text',
          value: 'Вложенные циклы используются для работы с двумерными структурами данных (матрицы, таблицы) или генерации комбинаций. Внутренний цикл выполняется полностью для каждой итерации внешнего.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Таблица умножения\nfor i in range(1, 4):\n    for j in range(1, 4):\n        print(f"{i}*{j}={i*j}", end="  ")\n    print()  # перенос строки\n# 1*1=1  1*2=2  1*3=3\n# 2*1=2  2*2=4  2*3=6\n# 3*1=3  3*2=6  3*3=9\n\n# Обход матрицы\nmatrix = [\n    [1, 2, 3],\n    [4, 5, 6],\n    [7, 8, 9]\n]\n\nfor row in matrix:\n    for cell in row:\n        print(cell, end=" ")\n    print()\n\n# Нахождение суммы всех элементов\ntotal = 0\nfor row in matrix:\n    for cell in row:\n        total += cell\nprint("Сумма:", total)  # 45'
        }
      ]
    },
    {
      id: 7,
      title: 'Практика: Пирамида из звёздочек',
      type: 'practice',
      difficulty: 'beginner',
      description: 'Напишите программу для вывода пирамиды из звёздочек. Высота пирамиды задаётся переменной height = 5.',
      requirements: [
        'Задайте height = 5',
        'Выведите пирамиду: строка i содержит 2*i-1 звёздочек, центрированных',
        'На строке 1: одна звёздочка, на строке 5: девять звёздочек',
        'Используйте вложенные циклы или умножение строк',
        'Используйте только пробелы для выравнивания'
      ],
      expectedOutput: '    *\n   ***\n  *****\n ******* \n*********',
      hint: 'На строке i нужно (height - i) пробелов слева и (2*i - 1) звёздочек. Используйте " " * spaces + "*" * stars.',
      solution: 'height = 5\nfor i in range(1, height + 1):\n    spaces = " " * (height - i)\n    stars = "*" * (2 * i - 1)\n    print(spaces + stars)',
      explanation: 'Формула (2*i - 1) даёт нечётные числа: 1, 3, 5, 7, 9. Формула (height - i) уменьшает количество пробелов с каждой строкой, создавая эффект центрирования. Умножение строки на число повторяет её указанное количество раз.'
    }
  ]
}
