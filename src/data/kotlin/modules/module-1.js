export default {
  id: 1,
  title: 'Введение в Kotlin',
  description: 'Что такое Kotlin, зачем он нужен, как установить и написать первую программу',
  lessons: [
    {
      id: 1,
      title: 'Что такое Kotlin?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Kotlin — это современный язык программирования, созданный компанией JetBrains. Он работает поверх Java Virtual Machine (JVM) и полностью совместим с Java. Kotlin используется для Android-разработки, серверной части, веб-приложений и даже мультиплатформенных проектов.' },
        { type: 'tip', value: 'Представь, что Java — это старый надёжный автомобиль. Kotlin — это тот же автомобиль, но с современными технологиями: автопилотом, удобными кнопками и защитой от аварий. Едешь туда же, но гораздо комфортнее.' },
        { type: 'heading', value: 'Почему Kotlin?' },
        { type: 'list', items: [
          'Официальный язык Android-разработки (с 2017 года Google объявил Kotlin приоритетным)',
          'Меньше кода — в 2–3 раза лаконичнее Java',
          'Безопасность — защита от NullPointerException встроена в язык',
          'Совместимость — можно использовать все Java-библиотеки',
          'Современный синтаксис — функции высшего порядка, корутины, расширения'
        ]},
        { type: 'heading', value: 'Где используется Kotlin?' },
        { type: 'text', value: 'Kotlin применяют в Android-приложениях (Instagram, Pinterest, Trello), серверных приложениях (на Spring Boot), в мультиплатформенных проектах (один код для iOS, Android и веба). Крупнейшие компании мира перевели свои приложения на Kotlin.' },
        { type: 'note', value: 'JetBrains — это та же компания, которая создала IntelliJ IDEA, PyCharm, WebStorm. Они сделали Kotlin для своих нужд, и он стал настолько хорош, что теперь его используют миллионы разработчиков.' }
      ]
    },
    {
      id: 2,
      title: 'Установка Kotlin',
      type: 'theory',
      content: [
        { type: 'text', value: 'Чтобы писать программы на Kotlin, нужно установить JDK и IDE. Так как Kotlin работает на JVM, без Java Development Kit не обойтись.' },
        { type: 'heading', value: 'Шаг 1: Установи JDK' },
        { type: 'list', items: [
          'Перейди на сайт adoptium.net',
          'Скачай JDK 17 или 21 (LTS версии)',
          'Установи и проверь командой: java --version'
        ]},
        { type: 'code', language: 'bash', value: '$ java --version\nopenjdk 21.0.2 2024-01-16 LTS' },
        { type: 'heading', value: 'Шаг 2: Установи IntelliJ IDEA' },
        { type: 'text', value: 'IntelliJ IDEA Community Edition — бесплатная IDE от JetBrains с поддержкой Kotlin из коробки. Скачай с сайта jetbrains.com/idea.' },
        { type: 'tip', value: 'IntelliJ IDEA — это как умный текстовый редактор, который знает Kotlin. Он подсказывает, исправляет ошибки, автодополняет код и запускает программы одной кнопкой.' },
        { type: 'heading', value: 'Шаг 3: Создай первый проект' },
        { type: 'list', items: [
          'Открой IntelliJ IDEA',
          'Нажми "New Project"',
          'Выбери Kotlin > JVM Application',
          'Дай проекту имя, нажми Create'
        ]},
        { type: 'warning', value: 'Выбирай именно Kotlin при создании проекта, а не Java. IntelliJ умеет работать с обоими языками, но для нашего курса нужен Kotlin.' }
      ]
    },
    {
      id: 3,
      title: 'Первая программа на Kotlin',
      type: 'theory',
      content: [
        { type: 'text', value: 'По традиции первая программа на любом языке выводит "Hello, World!". В Kotlin это выглядит удивительно просто.' },
        { type: 'heading', value: 'Hello World на Kotlin' },
        { type: 'code', language: 'kotlin', value: 'fun main() {\n    println("Hello, World!")\n}' },
        { type: 'text', value: 'Сравни с Java — там нужно было написать класс, статический метод, System.out.println. В Kotlin всё гораздо короче. Разберём код по частям:' },
        { type: 'list', items: [
          'fun — ключевое слово для объявления функции (от слова "function")',
          'main() — название функции. Kotlin начинает выполнение программы с main',
          'println() — выводит текст на экран с переходом на новую строку',
          'Фигурные скобки {} — тело функции, внутри пишем команды'
        ]},
        { type: 'tip', value: 'В Kotlin не нужно ставить точку с запятой в конце строки! Это одно из удобств языка. Хотя если поставишь — ошибки не будет.' },
        { type: 'heading', value: 'Запуск программы' },
        { type: 'text', value: 'В IntelliJ IDEA нажми зелёный треугольник (кнопку Run) рядом с функцией main. Или используй Shift+F10.' },
        { type: 'code', language: 'bash', value: '$ kotlinc main.kt -include-runtime -d main.jar\n$ java -jar main.jar\nHello, World!' },
        { type: 'note', value: 'В IntelliJ IDEA можно запускать программы одной кнопкой — IDE всё сделает автоматически. Команды компиляции нужны только если работаешь через терминал.' }
      ]
    },
    {
      id: 4,
      title: 'Kotlin vs Java: основные отличия',
      type: 'theory',
      content: [
        { type: 'text', value: 'Kotlin был создан как улучшенная версия Java. Разберём главные отличия, которые делают Kotlin приятнее в использовании.' },
        { type: 'heading', value: 'Меньше кода' },
        { type: 'code', language: 'kotlin', value: '// Java:\n// public class Person {\n//     private String name;\n//     private int age;\n//     public Person(String name, int age) {\n//         this.name = name;\n//         this.age = age;\n//     }\n//     public String getName() { return name; }\n//     public int getAge() { return age; }\n// }\n\n// Kotlin — то же самое в одну строку:\ndata class Person(val name: String, val age: Int)' },
        { type: 'heading', value: 'Безопасность от null' },
        { type: 'text', value: 'В Java самая частая ошибка — NullPointerException (NPE). Котлин решает эту проблему на уровне типов: переменная не может быть null, если ты явно не разрешишь это.' },
        { type: 'code', language: 'kotlin', value: 'var name: String = "Нурдаулет"  // не может быть null\nvar nickname: String? = null      // может быть null (знак вопроса!)' },
        { type: 'heading', value: 'Вывод типов (Type Inference)' },
        { type: 'code', language: 'kotlin', value: '// В Java нужно явно указывать тип:\n// String name = "Нурдаулет";\n\n// Kotlin сам понимает тип по значению:\nval name = "Нурдаулет"  // Kotlin видит: это строка\nval age = 25             // Kotlin видит: это число' },
        { type: 'tip', value: 'Kotlin как умный помощник — он видит "Нурдаулет" и сам понимает, что это строка. Не нужно каждый раз объяснять ему тип.' },
        { type: 'warning', value: 'Совместимость Kotlin и Java двусторонняя: можно вызывать Java-код из Kotlin и наоборот. Это значит, что ты можешь использовать любые Java-библиотеки в Kotlin-проектах.' }
      ]
    },
    {
      id: 5,
      title: 'Практика: Первая программа',
      type: 'practice',
      difficulty: 'easy',
      description: 'Напиши программу на Kotlin, которая выводит приветствие с твоим именем и городом.',
      requirements: [
        'Создай функцию main',
        'Выведи строку "Привет! Я изучаю Kotlin."',
        'Выведи строку "Меня зовут [твоё имя]."',
        'Выведи строку "Я из [твой город]."'
      ],
      expectedOutput: 'Привет! Я изучаю Kotlin.\nМеня зовут Нурдаулет.\nЯ из Астаны.',
      hint: 'Используй три вызова println() внутри функции main. Каждый println() выводит одну строку.',
      solution: 'fun main() {\n    println("Привет! Я изучаю Kotlin.")\n    println("Меня зовут Нурдаулет.")\n    println("Я из Астаны.")\n}',
      explanation: 'Функция main — точка входа программы. Каждый println() выводит строку и переходит на следующую. Никаких классов, никаких System.out — Kotlin гораздо лаконичнее Java.'
    },
    {
      id: 6,
      title: 'Практика: Информация о себе',
      type: 'practice',
      difficulty: 'easy',
      description: 'Выведи информацию в формате "ключ: значение" используя несколько строк вывода.',
      requirements: [
        'Выведи своё имя в формате "Имя: Нурдаулет"',
        'Выведи возраст в формате "Возраст: 20"',
        'Выведи язык программирования в формате "Язык: Kotlin"',
        'Выведи цель в формате "Цель: Стать разработчиком"'
      ],
      expectedOutput: 'Имя: Нурдаулет\nВозраст: 20\nЯзык: Kotlin\nЦель: Стать разработчиком',
      hint: 'Четыре вызова println() с нужным текстом внутри кавычек.',
      solution: 'fun main() {\n    println("Имя: Нурдаулет")\n    println("Возраст: 20")\n    println("Язык: Kotlin")\n    println("Цель: Стать разработчиком")\n}',
      explanation: 'Простой вывод строк — основа любой программы. В Kotlin println() без аргументов выводит пустую строку (перевод строки).'
    },
    {
      id: 7,
      title: 'Практика: print vs println',
      type: 'practice',
      difficulty: 'easy',
      description: 'Используй print() и println() чтобы вывести текст в одну строку и на разных строках.',
      requirements: [
        'Выведи "Kotlin " и "это " в одну строку используя print()',
        'Добавь "круто!" на той же строке и перейди на следующую через println()',
        'На следующей строке выведи "Поехали учиться!"'
      ],
      expectedOutput: 'Kotlin это круто!\nПоехали учиться!',
      hint: 'print() выводит текст без перехода на новую строку. println() выводит текст И переходит на новую строку.',
      solution: 'fun main() {\n    print("Kotlin ")\n    print("это ")\n    println("круто!")\n    println("Поехали учиться!")\n}',
      explanation: 'print() и println() — два основных инструмента вывода. print() склеивает вывод в одну строку, println() каждый раз начинает новую строку. Комбинируя их, можно формировать любой вывод.'
    }
  ]
}
