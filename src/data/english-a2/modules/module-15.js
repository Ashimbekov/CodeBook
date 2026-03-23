export default {
  id: 15,
  title: 'IT: Data Types and Variables',
  description: 'Типы данных и переменные на английском: integer, string, boolean, array, object и их использование.',
  lessons: [
    {
      id: 1,
      title: 'Primitive data types: числа и строки',
      type: 'theory',
      content: [
        { type: 'text', value: 'Основные типы данных (primitive data types) на английском:\n\nINTEGER (int) — целое число\nA variable of type integer stores whole numbers. (Переменная типа integer хранит целые числа.)\nExamples: -5, 0, 42, 1000\n\nFLOAT / DOUBLE — число с плавающей точкой\nA float stores decimal numbers. (Float хранит числа с десятичной точкой.)\nExamples: 3.14, -0.5, 2.718\n\nSTRING — строка (текст)\nA string is a sequence of characters. (Строка — это последовательность символов.)\nStrings are enclosed in quotes. (Строки заключаются в кавычки.)\nExamples: "hello", "user@email.com", "localhost:3000"\n\nCHAR — один символ\nA char stores a single character. (Char хранит один символ.)\nExamples: \'a\', \'Z\', \'5\'' },
        { type: 'heading', value: 'Как говорить о типах данных' },
        { type: 'text', value: 'The variable is of type string. (Переменная имеет тип string.)\nThis function returns an integer. (Эта функция возвращает целое число.)\nThe value is stored as a float. (Значение хранится как float.)\nThe parameter must be a string. (Параметр должен быть строкой.)\nThis field accepts integers only. (Это поле принимает только целые числа.)\nConvert the string to an integer. (Преобразуй строку в целое число.) — parse/cast/convert' }
      ]
    },
    {
      id: 2,
      title: 'Boolean: true/false',
      type: 'theory',
      content: [
        { type: 'text', value: 'BOOLEAN (bool) — логический тип данных\nA boolean has only two values: true or false. (Булев тип имеет только два значения: true или false.)\n\nИспользование:\nA boolean flag indicates whether a condition is met. (Булев флаг показывает, выполнено ли условие.)\nThe is_active field is a boolean. (Поле is_active является булевым.)\n\nОбщие булевы поля в IT:\nisActive (активен ли), isEnabled (включён ли), isValid (действителен ли)\nhasPermission (есть ли разрешение), isAuthenticated (аутентифицирован ли)\nisLoading (загружается ли), isDone (завершён ли), hasError (есть ли ошибка)\n\nПримеры предложений:\nThe function returns true if the user is authenticated. (Функция возвращает true, если пользователь аутентифицирован.)\nIf is_active is false, the account is disabled. (Если is_active равно false, учётная запись отключена.)\nSet the loading flag to true while fetching data. (Установите флаг загрузки в true при получении данных.)' }
      ]
    },
    {
      id: 3,
      title: 'Array: массивы',
      type: 'theory',
      content: [
        { type: 'text', value: 'ARRAY — массив (упорядоченная коллекция элементов)\n\nОпределение:\nAn array is an ordered collection of elements. (Массив — это упорядоченная коллекция элементов.)\nArrays store multiple values in a single variable. (Массивы хранят несколько значений в одной переменной.)\nElements are accessed by their index. (Элементы доступны по их индексу.)\nArray indices start at 0 in most languages. (Индексы массива начинаются с 0 в большинстве языков.)' },
        { type: 'heading', value: 'Операции с массивами' },
        { type: 'text', value: 'push / append — добавить в конец: Add an element to the end of the array.\npop — удалить из конца: Remove the last element from the array.\nshift — удалить из начала: Remove the first element.\nunshift / prepend — добавить в начало: Add an element to the beginning.\nslice — срез: Get a portion of the array.\nfilter — фильтровать: Create a new array with elements that pass the test.\nmap — преобразовать: Create a new array by transforming each element.\nfind — найти: Find the first element that matches.\nlength — длина: The number of elements in the array.\n\nIT-примеры:\nThe API returns an array of user objects. (API возвращает массив объектов пользователей.)\nFilter the array to get only active users. (Отфильтруй массив, чтобы получить только активных пользователей.)\nThe errors array is empty — all checks passed. (Массив ошибок пуст — все проверки прошли.)' }
      ]
    },
    {
      id: 4,
      title: 'Object: объекты и словари',
      type: 'theory',
      content: [
        { type: 'text', value: 'OBJECT (объект) / DICTIONARY (словарь) / MAP (карта) / HASH MAP (хэш-карта)\n\nОпределение:\nAn object stores key-value pairs. (Объект хранит пары ключ-значение.)\nA key maps to a value. (Ключ ведёт к значению.)\nObjects can contain any data type as a value. (Объекты могут содержать любой тип данных как значение.)' },
        { type: 'heading', value: 'Описание объектов' },
        { type: 'text', value: 'The user object has the following fields: id, name, email. (Объект пользователя имеет следующие поля: id, name, email.)\nAccess the value by its key. (Доступ к значению по ключу.)\nThe object contains nested objects. (Объект содержит вложенные объекты.)\nIterate over the object\'s keys. (Проходись по ключам объекта.)\nSerialize the object to JSON. (Сериализуй объект в JSON.)\nDeserialize the JSON response. (Десериализуй JSON-ответ.)' }
      ]
    },
    {
      id: 5,
      title: 'Переменные: объявление и присваивание',
      type: 'theory',
      content: [
        { type: 'text', value: 'Ключевые термины для переменных:\n\ndeclare (объявить): Declare a variable. (Объявить переменную.)\ninitialize (инициализировать): Initialize the variable with a value. (Инициализировать переменную значением.)\nassign (присвоить): Assign a new value to the variable. (Присвоить новое значение переменной.)\ndefine (определить): Define a constant. (Определить константу.)\n\nТипы переменных:\nvariable — переменная (значение может меняться)\nconstant (const) — константа (значение не меняется)\nglobal variable — глобальная переменная\nlocal variable — локальная переменная\ninstance variable — переменная экземпляра\nclass variable — переменная класса\nparameter / argument — параметр / аргумент' },
        { type: 'heading', value: 'Описание переменных в коде-ревью' },
        { type: 'text', value: 'Use a descriptive variable name. (Используй описательное имя переменной.)\nThis variable is not used anywhere. (Эта переменная нигде не используется.)\nThe variable is declared but not initialized. (Переменная объявлена, но не инициализирована.)\nAvoid global variables. (Избегай глобальных переменных.)\nThe naming convention is not followed here. (Здесь не соблюдается соглашение об именовании.)\nUse camelCase for variables and PascalCase for classes. (Используй camelCase для переменных и PascalCase для классов.)' }
      ]
    },
    {
      id: 6,
      title: 'Null, Undefined, None: отсутствующие значения',
      type: 'theory',
      content: [
        { type: 'text', value: 'NULL / NONE / NIL — отсутствие значения\n\nNull represents the intentional absence of a value. (Null представляет намеренное отсутствие значения.)\nCheck for null before using the value. (Проверяй на null перед использованием значения.)\n\nUNDEFINED (JavaScript) — переменная объявлена, но не присвоена\nNone (Python) — аналог null в Python\nnil (Ruby, Go) — аналог null\n\nNull safety — безопасность с null:\nThis function may return null. (Эта функция может вернуть null.)\nHandle the null case. (Обработай случай с null.)\nAvoid null pointer exceptions. (Избегай исключений null pointer.)\nUse optional types to avoid null issues. (Используй опциональные типы, чтобы избежать проблем с null.)\nAlways validate that the value is not null. (Всегда проверяй, что значение не равно null.)' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Описание типов данных',
      type: 'practice',
      content: [
        { type: 'text', value: 'Переведите технические описания на английский язык.' },
        {
          type: 'exercise',
          subtype: 'translation',
          items: [
            { id: 1, question: 'Эта функция возвращает булево значение.', answer: 'This function returns a boolean value.' },
            { id: 2, question: 'Массив содержит пять элементов.', answer: 'The array contains five elements.' },
            { id: 3, question: 'Поле username имеет тип string.', answer: 'The username field is of type string.' },
            { id: 4, question: 'Преобразуй строку в целое число.', answer: 'Convert the string to an integer.' },
            { id: 5, question: 'Всегда проверяй на null перед использованием.', answer: 'Always check for null before using.' },
            { id: 6, question: 'Объект содержит поля id, name и email.', answer: 'The object contains the fields id, name, and email.' },
            { id: 7, question: 'Отфильтруй массив, чтобы получить активных пользователей.', answer: 'Filter the array to get active users.' }
          ]
        }
      ]
    },
    {
      id: 8,
      title: 'Практика: Заполнить пропуски',
      type: 'practice',
      content: [
        { type: 'text', value: 'Вставьте правильный термин: string, integer, boolean, array, object, null.' },
        {
          type: 'exercise',
          subtype: 'fill_blank',
          items: [
            { id: 1, question: 'A variable that stores true or false is called a ___.', answer: 'boolean' },
            { id: 2, question: 'The user\'s name is stored as a ___.', answer: 'string' },
            { id: 3, question: 'The count of items is an ___ value.', answer: 'integer' },
            { id: 4, question: 'The API returns an ___ of product objects.', answer: 'array' },
            { id: 5, question: 'An ___ stores key-value pairs.', answer: 'object' },
            { id: 6, question: 'If the value is not found, the function returns ___.', answer: 'null' },
            { id: 7, question: 'The price field is a floating-point number, not an ___.', answer: 'integer' }
          ]
        }
      ]
    }
  ]
}
