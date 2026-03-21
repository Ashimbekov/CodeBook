export default {
  id: 23,
  title: 'Работа с файлами',
  description: 'Научимся читать и записывать файлы, работать с директориями и управлять файловой системой в Java',
  lessons: [
    {
      id: 1, title: 'Класс File', type: 'theory',
      content: [
        { type: 'text', value: 'Класс File в Java — это как адресная карточка файла или папки. Он не хранит содержимое файла, а лишь знает, где этот файл находится и что о нём можно узнать.' },
        { type: 'tip', value: 'Представь, что File — это ярлык на рабочем столе. Ярлык не является самим файлом, но через него можно узнать, существует ли файл, какой у него размер, когда он был изменён.' },
        { type: 'heading', value: 'Создание объекта File' },
        { type: 'code', language: 'java', value: 'import java.io.File;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Создаём объект File — указываем путь к файлу\n        File file = new File("test.txt");\n        File file2 = new File("C:/documents/notes.txt"); // Windows\n        File file3 = new File("/home/user/notes.txt");   // Linux/Mac\n\n        // Проверяем существует ли файл\n        System.out.println("Файл существует: " + file.exists());\n\n        // Информация о файле\n        System.out.println("Имя файла: " + file.getName());\n        System.out.println("Полный путь: " + file.getAbsolutePath());\n        System.out.println("Это файл?: " + file.isFile());\n        System.out.println("Это папка?: " + file.isDirectory());\n    }\n}' },
        { type: 'heading', value: 'Создание и удаление файлов' },
        { type: 'code', language: 'java', value: 'import java.io.File;\nimport java.io.IOException;\n\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        File file = new File("myfile.txt");\n\n        // Создаём новый файл\n        boolean created = file.createNewFile();\n        System.out.println("Файл создан: " + created);\n        // false — если файл уже существовал\n\n        // Удаляем файл\n        boolean deleted = file.delete();\n        System.out.println("Файл удалён: " + deleted);\n    }\n}' },
        { type: 'heading', value: 'Работа с папками' },
        { type: 'code', language: 'java', value: 'import java.io.File;\n\npublic class Main {\n    public static void main(String[] args) {\n        File dir = new File("myFolder");\n\n        // Создать одну папку\n        dir.mkdir();\n\n        // Создать папку и все родительские папки\n        File deepDir = new File("parent/child/grandchild");\n        deepDir.mkdirs(); // создаст все три папки\n\n        // Список файлов в папке\n        File currentDir = new File(".");\n        String[] files = currentDir.list();\n        for (String name : files) {\n            System.out.println(name);\n        }\n    }\n}' },
        { type: 'note', value: 'File работает с путями, а не с содержимым. Для чтения и записи содержимого нужны другие классы: BufferedReader, BufferedWriter и т.д.' }
      ]
    },
    {
      id: 2, title: 'Чтение файлов: BufferedReader', type: 'theory',
      content: [
        { type: 'text', value: 'BufferedReader — это быстрый читатель файлов. "Buffered" означает "буферизованный" — он читает данные большими кусками в память, а потом отдаёт по строчке. Это намного быстрее, чем читать по одному символу.' },
        { type: 'tip', value: 'Представь, что ты грузчик. Без буфера ты ходишь на склад за каждой коробкой по одной — долго. С буфером ты берёшь тележку (буфер), загружаешь сразу 20 коробок и везёшь все — быстро!' },
        { type: 'heading', value: 'Чтение файла построчно' },
        { type: 'code', language: 'java', value: 'import java.io.BufferedReader;\nimport java.io.FileReader;\nimport java.io.IOException;\n\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader reader = new BufferedReader(\n            new FileReader("test.txt")\n        );\n\n        String line;\n        // readLine() возвращает null когда файл закончился\n        while ((line = reader.readLine()) != null) {\n            System.out.println(line);\n        }\n\n        reader.close(); // ВАЖНО: всегда закрывать!\n    }\n}' },
        { type: 'heading', value: 'Чтение всего файла в список строк' },
        { type: 'code', language: 'java', value: 'import java.io.BufferedReader;\nimport java.io.FileReader;\nimport java.io.IOException;\nimport java.util.ArrayList;\nimport java.util.List;\n\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        List<String> lines = new ArrayList<>();\n\n        BufferedReader reader = new BufferedReader(\n            new FileReader("test.txt")\n        );\n\n        String line;\n        while ((line = reader.readLine()) != null) {\n            lines.add(line);\n        }\n        reader.close();\n\n        System.out.println("Строк в файле: " + lines.size());\n        System.out.println("Первая строка: " + lines.get(0));\n    }\n}' },
        { type: 'warning', value: 'Если файл не существует, Java бросит FileNotFoundException. Всегда проверяй существование файла или обрабатывай исключения через try-catch или throws.' }
      ]
    },
    {
      id: 3, title: 'Чтение файлов: Scanner', type: 'theory',
      content: [
        { type: 'text', value: 'Scanner — класс, который мы уже использовали для чтения с клавиатуры. Но он умеет читать и файлы! Scanner удобен когда нужно читать числа, слова или данные определённого формата.' },
        { type: 'tip', value: 'Scanner — как умный разборщик текста. Ты говоришь ему "дай мне следующее число" или "дай мне следующее слово", и он сам разбирает строку.' },
        { type: 'heading', value: 'Чтение файла через Scanner' },
        { type: 'code', language: 'java', value: 'import java.io.File;\nimport java.io.IOException;\nimport java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        Scanner scanner = new Scanner(new File("numbers.txt"));\n\n        int sum = 0;\n        while (scanner.hasNextInt()) {\n            int number = scanner.nextInt();\n            sum += number;\n            System.out.println("Число: " + number);\n        }\n        System.out.println("Сумма: " + sum);\n\n        scanner.close();\n    }\n}' },
        { type: 'heading', value: 'Чтение построчно через Scanner' },
        { type: 'code', language: 'java', value: 'import java.io.File;\nimport java.io.IOException;\nimport java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        Scanner scanner = new Scanner(new File("data.txt"));\n\n        while (scanner.hasNextLine()) {\n            String line = scanner.nextLine();\n            System.out.println("Строка: " + line);\n        }\n\n        scanner.close();\n    }\n}' },
        { type: 'heading', value: 'BufferedReader vs Scanner' },
        { type: 'list', items: [
          'BufferedReader — быстрее, лучше для больших файлов',
          'Scanner — удобнее для разбора чисел и слов',
          'BufferedReader читает строки, Scanner умеет читать int, double, слова',
          'Для простых задач Scanner достаточно',
          'Для больших файлов используй BufferedReader'
        ]},
        { type: 'note', value: 'Оба класса нужно закрывать методом close() после использования. Или использовать try-with-resources — об этом в следующем уроке!' }
      ]
    },
    {
      id: 4, title: 'Запись в файлы: BufferedWriter и PrintWriter', type: 'theory',
      content: [
        { type: 'text', value: 'Для записи в файлы используют BufferedWriter и PrintWriter. Как при чтении есть "буфер", так и здесь — данные сначала накапливаются в памяти, а потом разом записываются на диск.' },
        { type: 'heading', value: 'BufferedWriter — запись строк' },
        { type: 'code', language: 'java', value: 'import java.io.BufferedWriter;\nimport java.io.FileWriter;\nimport java.io.IOException;\n\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedWriter writer = new BufferedWriter(\n            new FileWriter("output.txt")\n        );\n\n        writer.write("Первая строка");\n        writer.newLine(); // перевод строки\n        writer.write("Вторая строка");\n        writer.newLine();\n        writer.write("Третья строка");\n\n        writer.close(); // ОБЯЗАТЕЛЬНО! Иначе данные могут не записаться\n\n        System.out.println("Файл записан!");\n    }\n}' },
        { type: 'heading', value: 'Добавление данных в конец файла' },
        { type: 'code', language: 'java', value: 'import java.io.BufferedWriter;\nimport java.io.FileWriter;\nimport java.io.IOException;\n\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        // true — append mode, добавить в конец, не затирать!\n        BufferedWriter writer = new BufferedWriter(\n            new FileWriter("log.txt", true)\n        );\n\n        writer.write("Новая запись в лог");\n        writer.newLine();\n        writer.close();\n    }\n}' },
        { type: 'heading', value: 'PrintWriter — удобная запись' },
        { type: 'code', language: 'java', value: 'import java.io.PrintWriter;\nimport java.io.IOException;\n\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        PrintWriter pw = new PrintWriter("report.txt");\n\n        // println работает так же как System.out.println!\n        pw.println("=== Отчёт ===" );\n        pw.println("Имя: Иван");\n        pw.println("Возраст: " + 25);\n        pw.printf("Баланс: %.2f%n", 1234.56);\n\n        pw.close();\n        System.out.println("Отчёт создан!");\n    }\n}' },
        { type: 'tip', value: 'PrintWriter — самый удобный для записи, так как у него есть println(), print() и printf() — как у System.out. Когда нужно записать текстовый файл с форматированием — используй PrintWriter.' },
        { type: 'warning', value: 'Если забыть вызвать close() или flush(), часть данных может остаться в буфере и не записаться в файл! Всегда закрывай писателей.' }
      ]
    },
    {
      id: 5, title: 'Try-with-resources', type: 'theory',
      content: [
        { type: 'text', value: 'Проблема с файлами: нужно всегда закрывать их через close(). Но если произойдёт ошибка между открытием и закрытием — файл останется открытым! Try-with-resources решает эту проблему автоматически.' },
        { type: 'tip', value: 'Представь, что ты берёшь книгу из библиотеки. Try-with-resources — это умный контракт, который гарантирует: что бы ни случилось, книга будет возвращена в библиотеку!' },
        { type: 'heading', value: 'Синтаксис try-with-resources' },
        { type: 'code', language: 'java', value: 'import java.io.BufferedReader;\nimport java.io.FileReader;\nimport java.io.IOException;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Ресурс объявляется в скобках try()\n        // Java сама закроет его когда блок закончится!\n        try (BufferedReader reader = new BufferedReader(\n                new FileReader("test.txt"))) {\n\n            String line;\n            while ((line = reader.readLine()) != null) {\n                System.out.println(line);\n            }\n            // reader.close() вызовется автоматически!\n\n        } catch (IOException e) {\n            System.out.println("Ошибка: " + e.getMessage());\n        }\n    }\n}' },
        { type: 'heading', value: 'Несколько ресурсов в try' },
        { type: 'code', language: 'java', value: 'import java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Можно открыть несколько ресурсов сразу через ;\n        try (BufferedReader reader = new BufferedReader(new FileReader("input.txt"));\n             BufferedWriter writer = new BufferedWriter(new FileWriter("output.txt"))) {\n\n            String line;\n            while ((line = reader.readLine()) != null) {\n                // Копируем файл, переводя всё в верхний регистр\n                writer.write(line.toUpperCase());\n                writer.newLine();\n            }\n            System.out.println("Файл скопирован!");\n\n        } catch (IOException e) {\n            System.out.println("Ошибка: " + e.getMessage());\n        }\n        // Оба ресурса закроются автоматически!\n    }\n}' },
        { type: 'heading', value: 'Сравнение старого и нового стиля' },
        { type: 'code', language: 'java', value: '// СТАРЫЙ стиль (плохо — если ошибка, close() не вызовется)\nBufferedReader reader = new BufferedReader(new FileReader("file.txt"));\nString line = reader.readLine();\nreader.close(); // что если строка выше упала с ошибкой?\n\n// НОВЫЙ стиль (хорошо — close() всегда вызовется)\ntry (BufferedReader reader = new BufferedReader(new FileReader("file.txt"))) {\n    String line = reader.readLine();\n} // close() здесь — всегда!' },
        { type: 'note', value: 'Try-with-resources работает с любым классом, который реализует интерфейс AutoCloseable или Closeable. Все файловые классы Java его реализуют.' }
      ]
    },
    {
      id: 6, title: 'Практика: Счётчик слов', type: 'practice', difficulty: 'easy',
      description: 'Напиши программу, которая создаёт текстовый файл с несколькими строками, читает его обратно и считает количество строк и слов.',
      requirements: [
        'Создай файл "story.txt" и запиши в него 3 строки текста',
        'Прочитай файл обратно с помощью BufferedReader',
        'Подсчитай количество строк',
        'Подсчитай общее количество слов (строки разделяются пробелами)',
        'Выведи результат',
        'Используй try-with-resources'
      ],
      expectedOutput: 'Файл создан!\nЖил был мальчик\nОн любил программировать\nJava это круто\nСтрок: 3\nСлов: 9',
      hint: 'Для подсчёта слов в строке используй метод split(" ") — он разбивает строку по пробелам и возвращает массив слов.',
      solution: 'import java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Записываем файл\n        try (PrintWriter pw = new PrintWriter("story.txt")) {\n            pw.println("Жил был мальчик");\n            pw.println("Он любил программировать");\n            pw.println("Java это круто");\n            System.out.println("Файл создан!");\n        } catch (IOException e) {\n            System.out.println("Ошибка записи: " + e.getMessage());\n        }\n\n        // Читаем и считаем\n        int lineCount = 0;\n        int wordCount = 0;\n\n        try (BufferedReader reader = new BufferedReader(new FileReader("story.txt"))) {\n            String line;\n            while ((line = reader.readLine()) != null) {\n                System.out.println(line);\n                lineCount++;\n                wordCount += line.split(" ").length;\n            }\n        } catch (IOException e) {\n            System.out.println("Ошибка чтения: " + e.getMessage());\n        }\n\n        System.out.println("Строк: " + lineCount);\n        System.out.println("Слов: " + wordCount);\n    }\n}',
      explanation: 'Мы использовали PrintWriter для создания файла и BufferedReader для чтения. Метод split(" ") разбивает строку по пробелам — длина массива и есть количество слов. Try-with-resources гарантирует закрытие файлов.'
    },
    {
      id: 7, title: 'Практика: Файловый менеджер', type: 'practice', difficulty: 'medium',
      description: 'Напиши программу, которая анализирует текущую директорию: выводит список всех файлов, их размеры, и копирует один файл в другой.',
      requirements: [
        'Создай файл "source.txt" с несколькими строками',
        'Скопируй содержимое в файл "copy.txt"',
        'Выведи информацию о созданных файлах: имя и размер в байтах',
        'Проверь, что оба файла существуют с помощью file.exists()',
        'Удали файл "source.txt" в конце'
      ],
      expectedOutput: 'Создаём source.txt...\nКопируем в copy.txt...\nГотово!\nsource.txt: 45 байт\ncopy.txt: 45 байт\nУдаляем source.txt...\nsource.txt существует: false\ncopy.txt существует: true',
      hint: 'Для копирования читай каждую строку из source.txt и сразу записывай в copy.txt. Для получения размера файла используй file.length().',
      solution: 'import java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Создаём source.txt...");\n        try (PrintWriter pw = new PrintWriter("source.txt")) {\n            pw.println("Привет из Java!");\n            pw.println("Работа с файлами");\n            pw.println("Это строка 3");\n        } catch (IOException e) {\n            e.printStackTrace();\n        }\n\n        System.out.println("Копируем в copy.txt...");\n        try (BufferedReader reader = new BufferedReader(new FileReader("source.txt"));\n             PrintWriter writer = new PrintWriter("copy.txt")) {\n            String line;\n            while ((line = reader.readLine()) != null) {\n                writer.println(line);\n            }\n        } catch (IOException e) {\n            e.printStackTrace();\n        }\n\n        System.out.println("Готово!");\n\n        File source = new File("source.txt");\n        File copy = new File("copy.txt");\n        System.out.println("source.txt: " + source.length() + " байт");\n        System.out.println("copy.txt: " + copy.length() + " байт");\n\n        System.out.println("Удаляем source.txt...");\n        source.delete();\n\n        System.out.println("source.txt существует: " + source.exists());\n        System.out.println("copy.txt существует: " + copy.exists());\n    }\n}',
      explanation: 'Мы использовали File для получения информации о файлах, PrintWriter для записи, BufferedReader для чтения. Копирование — это чтение из одного файла и запись в другой. Метод file.length() возвращает размер в байтах.'
    }
  ]
}
