export default {
  id: 4,
  title: 'Factory Method',
  description: 'Паттерн Factory Method: создание объектов через подклассы, полиморфное инстанцирование',
  lessons: [
    {
      id: 1,
      title: 'Что такое Factory Method?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Factory Method (Фабричный метод) — порождающий паттерн, который определяет общий интерфейс для создания объектов в суперклассе, позволяя подклассам изменять тип создаваемых объектов.' },
        { type: 'heading', value: 'Проблема' },
        { type: 'text', value: 'Представьте приложение для логистики. Первая версия работает только с грузовиками. Весь код привязан к классу Truck. Когда нужно добавить доставку по морю (Ship), приходится переписывать половину кода.' },
        { type: 'heading', value: 'Решение' },
        { type: 'text', value: 'Factory Method предлагает создавать объекты через специальный метод, а не напрямую через new. Подклассы переопределяют этот метод и возвращают нужный тип.' },
        { type: 'code', language: 'text', value: '┌──────────────────┐       ┌──────────────────┐\n│   Creator        │       │   Product        │\n│ (abstract)       │       │ (interface)      │\n├──────────────────┤       ├──────────────────┤\n│ + createProduct()│──────>│ + deliver()      │\n│ + planDelivery() │       └──────────────────┘\n└────────┬─────────┘               ▲\n         │                    ┌────┴────┐\n    ┌────┴────┐         ┌─────┴──┐  ┌───┴─────┐\n    │ Road    │         │ Truck  │  │ Ship    │\n    │ Creator │         └────────┘  └─────────┘\n    ├─────────┤\n    │ create  │\n    │ Product │\n    └─────────┘' },
        { type: 'note', value: 'Factory Method — один из самых часто используемых паттернов. Он встречается в каждом крупном фреймворке: Spring BeanFactory, Angular Injector, React.createElement.' }
      ]
    },
    {
      id: 2,
      title: 'Реализация на Java',
      type: 'theory',
      content: [
        { type: 'text', value: 'Рассмотрим полный пример Factory Method на примере системы уведомлений.' },
        { type: 'heading', value: 'Шаг 1: Интерфейс продукта' },
        { type: 'code', language: 'java', value: '// Продукт — общий интерфейс для всех уведомлений\npublic interface Notification {\n    void send(String recipient, String message);\n    String getType();\n}' },
        { type: 'heading', value: 'Шаг 2: Конкретные продукты' },
        { type: 'code', language: 'java', value: 'public class EmailNotification implements Notification {\n    @Override\n    public void send(String recipient, String message) {\n        System.out.println("📧 Email → " + recipient + ": " + message);\n    }\n\n    @Override\n    public String getType() { return "EMAIL"; }\n}\n\npublic class SmsNotification implements Notification {\n    @Override\n    public void send(String recipient, String message) {\n        System.out.println("📱 SMS → " + recipient + ": " + message);\n    }\n\n    @Override\n    public String getType() { return "SMS"; }\n}\n\npublic class PushNotification implements Notification {\n    @Override\n    public void send(String recipient, String message) {\n        System.out.println("🔔 Push → " + recipient + ": " + message);\n    }\n\n    @Override\n    public String getType() { return "PUSH"; }\n}' },
        { type: 'heading', value: 'Шаг 3: Абстрактный создатель' },
        { type: 'code', language: 'java', value: '// Создатель определяет фабричный метод\npublic abstract class NotificationFactory {\n    \n    // Фабричный метод — подклассы решают, что создавать\n    public abstract Notification createNotification();\n\n    // Бизнес-логика, использующая фабричный метод\n    public void notifyUser(String recipient, String message) {\n        Notification notification = createNotification();\n        System.out.println("Отправка через " + notification.getType() + "...");\n        notification.send(recipient, message);\n    }\n}' },
        { type: 'heading', value: 'Шаг 4: Конкретные создатели' },
        { type: 'code', language: 'java', value: 'public class EmailNotificationFactory extends NotificationFactory {\n    @Override\n    public Notification createNotification() {\n        return new EmailNotification();\n    }\n}\n\npublic class SmsNotificationFactory extends NotificationFactory {\n    @Override\n    public Notification createNotification() {\n        return new SmsNotification();\n    }\n}\n\npublic class PushNotificationFactory extends NotificationFactory {\n    @Override\n    public Notification createNotification() {\n        return new PushNotification();\n    }\n}\n\n// Использование\npublic class App {\n    public static void main(String[] args) {\n        NotificationFactory factory = new EmailNotificationFactory();\n        factory.notifyUser("user@mail.com", "Добро пожаловать!");\n\n        factory = new SmsNotificationFactory();\n        factory.notifyUser("+7-777-123-4567", "Код: 1234");\n    }\n}' },
        { type: 'tip', value: 'Обратите внимание: метод notifyUser() не знает, какой именно тип уведомления будет создан. Это и есть суть Factory Method — делегирование создания объекта подклассам.' }
      ]
    },
    {
      id: 3,
      title: 'Реализация на TypeScript',
      type: 'theory',
      content: [
        { type: 'text', value: 'Рассмотрим Factory Method на TypeScript на примере создания UI-элементов для разных платформ.' },
        { type: 'code', language: 'typescript', value: '// Интерфейс продукта\ninterface Button {\n    render(): string;\n    onClick(handler: () => void): void;\n}\n\n// Конкретные продукты\nclass WebButton implements Button {\n    render(): string {\n        return "<button class=\'btn\'>Click me</button>";\n    }\n    onClick(handler: () => void): void {\n        console.log("Web: addEventListener(\'click\', handler)");\n        handler();\n    }\n}\n\nclass MobileButton implements Button {\n    render(): string {\n        return "<TouchableOpacity>Click me</TouchableOpacity>";\n    }\n    onClick(handler: () => void): void {\n        console.log("Mobile: onPress={handler}");\n        handler();\n    }\n}\n\nclass DesktopButton implements Button {\n    render(): string {\n        return "JButton(\'Click me\')";\n    }\n    onClick(handler: () => void): void {\n        console.log("Desktop: addActionListener(handler)");\n        handler();\n    }\n}\n\n// Абстрактный создатель\nabstract class Dialog {\n    abstract createButton(): Button;\n\n    renderDialog(): void {\n        const button = this.createButton();\n        console.log("Рендер кнопки: " + button.render());\n        button.onClick(() => console.log("Кнопка нажата!"));\n    }\n}\n\n// Конкретные создатели\nclass WebDialog extends Dialog {\n    createButton(): Button {\n        return new WebButton();\n    }\n}\n\nclass MobileDialog extends Dialog {\n    createButton(): Button {\n        return new MobileButton();\n    }\n}\n\nclass DesktopDialog extends Dialog {\n    createButton(): Button {\n        return new DesktopButton();\n    }\n}\n\n// Использование\nfunction createApp(platform: string): Dialog {\n    switch (platform) {\n        case "web": return new WebDialog();\n        case "mobile": return new MobileDialog();\n        case "desktop": return new DesktopDialog();\n        default: throw new Error("Неизвестная платформа");\n    }\n}\n\nconst app = createApp("web");\napp.renderDialog();' },
        { type: 'heading', value: 'Упрощённая версия: параметризованная фабрика' },
        { type: 'code', language: 'typescript', value: '// Вместо подклассов — один метод с параметром\nclass NotificationFactory {\n    static create(type: "email" | "sms" | "push"): Notification {\n        switch (type) {\n            case "email": return new EmailNotification();\n            case "sms": return new SmsNotification();\n            case "push": return new PushNotification();\n        }\n    }\n}\n\nconst notification = NotificationFactory.create("email");\nnotification.send("user@mail.com", "Hello!");' },
        { type: 'note', value: 'Параметризованная фабрика — это Simple Factory, не путайте с Factory Method. Factory Method использует наследование (подклассы), Simple Factory — условную логику. Оба подхода полезны, но решают разные задачи.' }
      ]
    },
    {
      id: 4,
      title: 'Factory Method vs Simple Factory vs Abstract Factory',
      type: 'theory',
      content: [
        { type: 'text', value: 'Три фабричных паттерна часто путают. Разберём ключевые различия.' },
        { type: 'heading', value: 'Simple Factory (не GoF-паттерн)' },
        { type: 'code', language: 'java', value: '// Один класс с методом, решающим что создавать\nclass AnimalFactory {\n    public static Animal create(String type) {\n        return switch (type) {\n            case "dog" -> new Dog();\n            case "cat" -> new Cat();\n            default -> throw new IllegalArgumentException(type);\n        };\n    }\n}' },
        { type: 'heading', value: 'Factory Method (GoF)' },
        { type: 'code', language: 'java', value: '// Подклассы решают, что создавать\nabstract class AnimalShelter {\n    abstract Animal createAnimal(); // Фабричный метод\n    \n    public void adopt(String owner) {\n        Animal a = createAnimal();\n        a.setOwner(owner);\n    }\n}\n\nclass DogShelter extends AnimalShelter {\n    Animal createAnimal() { return new Dog(); }\n}\n\nclass CatShelter extends AnimalShelter {\n    Animal createAnimal() { return new Cat(); }\n}' },
        { type: 'heading', value: 'Abstract Factory (GoF)' },
        { type: 'code', language: 'java', value: '// Создаёт СЕМЕЙСТВА связанных объектов\ninterface UIFactory {\n    Button createButton();\n    Checkbox createCheckbox();\n    TextField createTextField();\n}\n\nclass WindowsUIFactory implements UIFactory {\n    Button createButton() { return new WindowsButton(); }\n    Checkbox createCheckbox() { return new WindowsCheckbox(); }\n    TextField createTextField() { return new WindowsTextField(); }\n}' },
        { type: 'heading', value: 'Сравнительная таблица' },
        { type: 'list', items: [
          'Simple Factory — один класс, switch/if-else, создаёт одиночные объекты',
          'Factory Method — иерархия классов, подклассы определяют создание, создаёт одиночные объекты',
          'Abstract Factory — интерфейс фабрики, создаёт семейства связанных объектов'
        ]},
        { type: 'tip', value: 'Начинайте с Simple Factory. Когда логика создания начнёт расти — рефакторьте к Factory Method. Если нужны семейства объектов — используйте Abstract Factory.' }
      ]
    },
    {
      id: 5,
      title: 'Практика: фабрика документов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте систему создания документов разных форматов с использованием Factory Method.',
      requirements: [
        'Интерфейс Document с методами open(), save(), close()',
        'Классы PdfDocument, WordDocument, SpreadsheetDocument',
        'Абстрактный класс DocumentCreator с фабричным методом createDocument()',
        'Конкретные создатели: PdfCreator, WordCreator, SpreadsheetCreator',
        'Метод editDocument() в DocumentCreator, который использует фабричный метод'
      ],
      hint: 'DocumentCreator.editDocument() должен вызывать createDocument(), затем open(), позволить редактирование, затем save() и close().',
      expectedOutput: 'Открыт PDF документ\nРедактирование документа...\nPDF сохранён: report.pdf\nPDF закрыт\n---\nОткрыт Word документ\nРедактирование документа...\nWord сохранён: letter.docx\nWord закрыт',
      solution: 'interface Document {\n    void open();\n    void save(String filename);\n    void close();\n}\n\nclass PdfDocument implements Document {\n    public void open() { System.out.println("Открыт PDF документ"); }\n    public void save(String filename) { System.out.println("PDF сохранён: " + filename); }\n    public void close() { System.out.println("PDF закрыт"); }\n}\n\nclass WordDocument implements Document {\n    public void open() { System.out.println("Открыт Word документ"); }\n    public void save(String filename) { System.out.println("Word сохранён: " + filename); }\n    public void close() { System.out.println("Word закрыт"); }\n}\n\nabstract class DocumentCreator {\n    public abstract Document createDocument();\n\n    public void editDocument(String filename) {\n        Document doc = createDocument();\n        doc.open();\n        System.out.println("Редактирование документа...");\n        doc.save(filename);\n        doc.close();\n    }\n}\n\nclass PdfCreator extends DocumentCreator {\n    public Document createDocument() { return new PdfDocument(); }\n}\n\nclass WordCreator extends DocumentCreator {\n    public Document createDocument() { return new WordDocument(); }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        DocumentCreator creator = new PdfCreator();\n        creator.editDocument("report.pdf");\n        System.out.println("---");\n        creator = new WordCreator();\n        creator.editDocument("letter.docx");\n    }\n}',
      explanation: 'Factory Method позволяет DocumentCreator работать с любым типом документа, не зная конкретного класса. Добавление нового формата (например, HTML) требует только создания нового класса документа и создателя — существующий код менять не нужно.'
    },
    {
      id: 6,
      title: 'Практика: фабрика парсеров на TypeScript',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте систему парсинга конфигурационных файлов разных форматов с помощью Factory Method.',
      requirements: [
        'Интерфейс ConfigParser с методами parse(content: string) и getFormat(): string',
        'Классы JsonParser, YamlParser, XmlParser',
        'Абстрактный класс ConfigLoader с фабричным методом createParser()',
        'Конкретные загрузчики: JsonConfigLoader, YamlConfigLoader',
        'Метод loadConfig() читает содержимое и парсит через фабричный метод'
      ],
      hint: 'loadConfig() создаёт парсер через createParser(), затем вызывает parse(). Каждый парсер выводит информацию о формате и содержимом.',
      expectedOutput: 'Загрузка конфигурации...\nПарсинг JSON: {"host":"localhost","port":3000}\nКонфигурация загружена (формат: JSON)\n---\nЗагрузка конфигурации...\nПарсинг YAML: host: localhost\\nport: 3000\nКонфигурация загружена (формат: YAML)',
      solution: 'interface ConfigParser {\n    parse(content: string): Record<string, any>;\n    getFormat(): string;\n}\n\nclass JsonParser implements ConfigParser {\n    parse(content: string): Record<string, any> {\n        console.log("Парсинг JSON: " + content);\n        return JSON.parse(content);\n    }\n    getFormat(): string { return "JSON"; }\n}\n\nclass YamlParser implements ConfigParser {\n    parse(content: string): Record<string, any> {\n        console.log("Парсинг YAML: " + content);\n        // Простая имитация парсинга YAML\n        const result: Record<string, any> = {};\n        content.split("\\n").forEach(line => {\n            const [key, value] = line.split(": ");\n            result[key.trim()] = value?.trim();\n        });\n        return result;\n    }\n    getFormat(): string { return "YAML"; }\n}\n\nabstract class ConfigLoader {\n    abstract createParser(): ConfigParser;\n\n    loadConfig(content: string): Record<string, any> {\n        console.log("Загрузка конфигурации...");\n        const parser = this.createParser();\n        const config = parser.parse(content);\n        console.log(`Конфигурация загружена (формат: ${parser.getFormat()})`);\n        return config;\n    }\n}\n\nclass JsonConfigLoader extends ConfigLoader {\n    createParser(): ConfigParser {\n        return new JsonParser();\n    }\n}\n\nclass YamlConfigLoader extends ConfigLoader {\n    createParser(): ConfigParser {\n        return new YamlParser();\n    }\n}\n\n// Использование\nconst jsonLoader = new JsonConfigLoader();\njsonLoader.loadConfig(\'{"host":"localhost","port":3000}\');\nconsole.log("---");\nconst yamlLoader = new YamlConfigLoader();\nyamlLoader.loadConfig("host: localhost\\nport: 3000");',
      explanation: 'Factory Method здесь позволяет ConfigLoader работать с любым форматом конфигурации. Для добавления нового формата (XML, TOML) достаточно создать новый парсер и загрузчик. Метод loadConfig() не меняется.'
    }
  ]
}
