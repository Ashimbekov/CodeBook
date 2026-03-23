export default {
  id: 16,
  title: 'IT: OOP Terms in English',
  description: 'Термины объектно-ориентированного программирования на английском: class, method, inheritance, interface.',
  lessons: [
    {
      id: 1,
      title: 'Class and Object: основы ООП',
      type: 'theory',
      content: [
        { type: 'text', value: 'CLASS (класс) — шаблон/чертёж для создания объектов\nA class is a blueprint for creating objects. (Класс — это чертёж для создания объектов.)\nA class defines the properties and behaviours of an object. (Класс определяет свойства и поведение объекта.)\n\nOBJECT / INSTANCE (объект / экземпляр) — конкретное воплощение класса\nAn object is an instance of a class. (Объект — это экземпляр класса.)\nYou create (instantiate) an object from a class. (Ты создаёшь (инстанцируешь) объект из класса.)\nEach object has its own state. (Каждый объект имеет своё состояние.)\n\nПримеры:\nThe User class defines what a user is. (Класс User определяет, что такое пользователь.)\nWe create a new instance of the class. (Мы создаём новый экземпляр класса.)\nThis object is an instance of DatabaseConnection. (Этот объект является экземпляром DatabaseConnection.)' }
      ]
    },
    {
      id: 2,
      title: 'Properties and Methods',
      type: 'theory',
      content: [
        { type: 'text', value: 'PROPERTY / FIELD / ATTRIBUTE (свойство / поле / атрибут) — данные объекта\nA property stores the state of an object. (Свойство хранит состояние объекта.)\nProperties are also called fields or attributes. (Свойства также называются полями или атрибутами.)\n\nMETHOD / FUNCTION (метод / функция) — поведение объекта\nA method defines the behaviour of an object. (Метод определяет поведение объекта.)\nMethods can read and modify properties. (Методы могут читать и изменять свойства.)\n\nCONSTRUCTOR — метод для создания объекта\nThe constructor initializes the object\'s properties. (Конструктор инициализирует свойства объекта.)\nThe constructor is called when you create a new instance. (Конструктор вызывается при создании нового экземпляра.)' },
        { type: 'heading', value: 'Доступ к свойствам и методам' },
        { type: 'text', value: 'The User class has the following properties: id, name, email. (Класс User имеет следующие свойства: id, name, email.)\nCall the save() method to persist the data. (Вызови метод save(), чтобы сохранить данные.)\nThe getName() method returns the user\'s name. (Метод getName() возвращает имя пользователя.)\nAccess the property using dot notation. (Обращайся к свойству через точечную нотацию.)' }
      ]
    },
    {
      id: 3,
      title: 'Inheritance: наследование',
      type: 'theory',
      content: [
        { type: 'text', value: 'INHERITANCE (наследование) — класс наследует свойства и методы другого класса\n\nТерминология:\nparent class / base class / superclass — родительский класс\nchild class / derived class / subclass — дочерний класс\ninherit from — наследовать от\nextend — расширять\noverride — переопределять\n\nПримеры:\nThe AdminUser class inherits from the User class. (Класс AdminUser наследует от класса User.)\nThe child class extends the parent class. (Дочерний класс расширяет родительский.)\nAdmin overrides the getPermissions() method. (Admin переопределяет метод getPermissions().)\nThe subclass inherits all properties of the superclass. (Подкласс наследует все свойства суперкласса.)\nDon\'t repeat code — use inheritance. (Не повторяй код — используй наследование.)' }
      ]
    },
    {
      id: 4,
      title: 'Interface and Abstract Class',
      type: 'theory',
      content: [
        { type: 'text', value: 'INTERFACE (интерфейс) — контракт, который должен реализовать класс\nAn interface defines a contract that classes must implement. (Интерфейс определяет контракт, который классы должны реализовать.)\nAn interface specifies what methods a class must have. (Интерфейс указывает, какие методы должен иметь класс.)\nA class can implement multiple interfaces. (Класс может реализовать несколько интерфейсов.)\n\nКлючевые слова:\nimplement an interface — реализовать интерфейс\ndefine an interface — определить интерфейс\n\nABSTRACT CLASS (абстрактный класс) — класс, который нельзя инстанцировать\nAn abstract class cannot be instantiated directly. (Абстрактный класс нельзя инстанцировать напрямую.)\nAbstract classes provide a partial implementation. (Абстрактные классы предоставляют частичную реализацию.)' },
        { type: 'heading', value: 'Примеры в коде-ревью' },
        { type: 'text', value: 'The class should implement the Serializable interface. (Класс должен реализовывать интерфейс Serializable.)\nThis abstract method must be overridden in the subclass. (Этот абстрактный метод должен быть переопределён в подклассе.)\nProgram to interfaces, not implementations. (Программируй к интерфейсам, а не к реализациям.) — принцип SOLID' }
      ]
    },
    {
      id: 5,
      title: 'Encapsulation and Polymorphism',
      type: 'theory',
      content: [
        { type: 'text', value: 'ENCAPSULATION (инкапсуляция) — скрытие внутреннего состояния\nEncapsulation hides the internal state of an object. (Инкапсуляция скрывает внутреннее состояние объекта.)\nUse getters and setters to access private properties. (Используй геттеры и сеттеры для доступа к приватным свойствам.)\nMark internal methods as private. (Отмечай внутренние методы как приватные.)\n\nМодификаторы доступа:\npublic — доступен отовсюду\nprivate — доступен только внутри класса\nprotected — доступен в классе и подклассах\n\nPOLYMORPHISM (полиморфизм) — разные объекты, одинаковый интерфейс\nPolymorphism allows objects of different classes to be treated as the same type. (Полиморфизм позволяет обращаться с объектами разных классов как с одним типом.)\nThe method behaves differently depending on the object type. (Метод ведёт себя по-разному в зависимости от типа объекта.)' }
      ]
    },
    {
      id: 6,
      title: 'SOLID принципы и паттерны',
      type: 'theory',
      content: [
        { type: 'text', value: 'Важные OOP-концепции для обсуждения:\n\nSingle Responsibility Principle — Принцип единственной ответственности\nA class should have only one reason to change. (Класс должен иметь только одну причину для изменения.)\n\nDependency Injection (DI) — Внедрение зависимостей\nInject dependencies through the constructor. (Внедряй зависимости через конструктор.)\n\nDesign Pattern — Паттерн проектирования\nThis uses the Singleton pattern. (Это использует паттерн Singleton.)\nApply the Factory pattern here. (Примени паттерн Factory здесь.)\n\nRefactoring — Рефакторинг\nExtract this logic into a separate class. (Вынеси эту логику в отдельный класс.)\nThis class has too many responsibilities. (Этот класс имеет слишком много обязанностей.)' }
      ]
    },
    {
      id: 7,
      title: 'Практика: OOP-термины',
      type: 'practice',
            description: 'Переведите на английский язык.',
      solution: 'Правильные ответы:\\n1. The AdminUser class inherits from the User class.\\n2. The constructor initializes the object\'s properties.\\n3. This class must implement the Serializable interface.\\n4. Use getters and setters to access private fields.\\n5. This method overrides the parent class method.\\n6. The object is an instance of the DatabaseConnection class.\\n7. This class violates the Single Responsibility Principle.',
content: [
        { type: 'text', value: 'Переведите на английский язык.' },
        {
          type: 'exercise',
          subtype: 'translation',
          items: [
            { id: 1, question: 'Класс AdminUser наследует от класса User.', answer: 'The AdminUser class inherits from the User class.' },
            { id: 2, question: 'Конструктор инициализирует свойства объекта.', answer: 'The constructor initializes the object\'s properties.' },
            { id: 3, question: 'Этот класс должен реализовать интерфейс Serializable.', answer: 'This class must implement the Serializable interface.' },
            { id: 4, question: 'Используй геттеры и сеттеры для доступа к приватным полям.', answer: 'Use getters and setters to access private fields.' },
            { id: 5, question: 'Этот метод переопределяет метод родительского класса.', answer: 'This method overrides the parent class method.' },
            { id: 6, question: 'Объект является экземпляром класса DatabaseConnection.', answer: 'The object is an instance of the DatabaseConnection class.' },
            { id: 7, question: 'Этот класс нарушает принцип единственной ответственности.', answer: 'This class violates the Single Responsibility Principle.' }
          ]
        }
      ]
    }
  ]
}
