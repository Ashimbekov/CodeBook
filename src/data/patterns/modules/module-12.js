export default {
  id: 12,
  title: 'Facade',
  description: 'Паттерн Facade: упрощение сложных подсистем через единый интерфейс',
  lessons: [
    {
      id: 1,
      title: 'Что такое Facade?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Facade (Фасад) — структурный паттерн, предоставляющий простой интерфейс к сложной подсистеме. Фасад не инкапсулирует подсистему — он предлагает упрощённый доступ к наиболее востребованным функциям.' },
        { type: 'heading', value: 'Аналогия' },
        { type: 'text', value: 'Официант в ресторане — фасад. Вы говорите «принесите стейк», а он координирует повара, бармена и кухню. Вам не нужно знать, как работает каждая часть.' },
        { type: 'heading', value: 'Когда использовать?' },
        { type: 'list', items: [
          'Сложная подсистема с множеством классов и зависимостей',
          'Нужно предоставить простой API для часто используемых сценариев',
          'Хотите уменьшить зависимость клиентского кода от деталей подсистемы',
          'Нужно разделить систему на слои (layered architecture)'
        ]},
        { type: 'note', value: 'Facade не запрещает прямой доступ к подсистеме. Опытные разработчики всё ещё могут обращаться к внутренним классам, если фасад не покрывает их нужды.' }
      ]
    },
    {
      id: 2,
      title: 'Реализация на Java: система оформления заказа',
      type: 'theory',
      content: [
        { type: 'code', language: 'java', value: '// Подсистема: множество сложных компонентов\nclass InventoryService {\n    boolean checkStock(String productId) {\n        System.out.println("📦 Проверка наличия: " + productId);\n        return true;\n    }\n    void reserve(String productId) {\n        System.out.println("📦 Товар зарезервирован: " + productId);\n    }\n}\n\nclass PaymentService {\n    boolean processPayment(String cardNumber, double amount) {\n        System.out.printf("💳 Оплата %.2f с карты %s%n", amount, cardNumber);\n        return true;\n    }\n    void refund(String transactionId) {\n        System.out.println("💳 Возврат: " + transactionId);\n    }\n}\n\nclass ShippingService {\n    String createShipment(String address, String productId) {\n        System.out.println("🚚 Доставка " + productId + " → " + address);\n        return "SHIP-" + System.currentTimeMillis();\n    }\n}\n\nclass NotificationService {\n    void sendEmail(String email, String subject, String body) {\n        System.out.println("📧 Email → " + email + ": " + subject);\n    }\n    void sendSms(String phone, String message) {\n        System.out.println("📱 SMS → " + phone + ": " + message);\n    }\n}\n\nclass FraudDetectionService {\n    boolean checkFraud(String cardNumber, double amount) {\n        System.out.println("🔍 Проверка мошенничества...");\n        return false; // false = нет мошенничества\n    }\n}\n\n// ФАСАД: простой интерфейс для клиента\npublic class OrderFacade {\n    private final InventoryService inventory = new InventoryService();\n    private final PaymentService payment = new PaymentService();\n    private final ShippingService shipping = new ShippingService();\n    private final NotificationService notification = new NotificationService();\n    private final FraudDetectionService fraud = new FraudDetectionService();\n\n    public String placeOrder(String productId, String card,\n                              double amount, String address, String email) {\n        System.out.println("=== Оформление заказа ===" );\n\n        // 1. Проверка наличия\n        if (!inventory.checkStock(productId)) {\n            throw new RuntimeException("Товар отсутствует");\n        }\n\n        // 2. Проверка мошенничества\n        if (fraud.checkFraud(card, amount)) {\n            throw new RuntimeException("Подозрительная операция");\n        }\n\n        // 3. Резервирование\n        inventory.reserve(productId);\n\n        // 4. Оплата\n        if (!payment.processPayment(card, amount)) {\n            throw new RuntimeException("Ошибка оплаты");\n        }\n\n        // 5. Доставка\n        String shipmentId = shipping.createShipment(address, productId);\n\n        // 6. Уведомление\n        notification.sendEmail(email, "Заказ оформлен", "Доставка: " + shipmentId);\n\n        return shipmentId;\n    }\n}\n\n// Клиент: один вызов вместо шести\nOrderFacade shop = new OrderFacade();\nString id = shop.placeOrder("LAPTOP-1", "4111-1111", 85000, "Алматы, ул. Абая 1", "user@mail.com");' },
        { type: 'tip', value: 'Без фасада клиенту пришлось бы вызывать 6 сервисов в правильном порядке и обрабатывать ошибки каждого. Фасад скрывает эту сложность за одним методом.' }
      ]
    },
    {
      id: 3,
      title: 'Facade на TypeScript',
      type: 'theory',
      content: [
        { type: 'code', language: 'typescript', value: '// Подсистема: сложные API для работы с мультимедиа\nclass AudioDecoder {\n    decode(file: string): string {\n        console.log(`🎵 Декодирование аудио: ${file}`);\n        return `audio_data_${file}`;\n    }\n}\n\nclass VideoDecoder {\n    decode(file: string): string {\n        console.log(`🎬 Декодирование видео: ${file}`);\n        return `video_data_${file}`;\n    }\n}\n\nclass SubtitleParser {\n    parse(file: string): string[] {\n        console.log(`📝 Загрузка субтитров: ${file}`);\n        return ["00:01 Привет", "00:05 Мир"];\n    }\n}\n\nclass AudioMixer {\n    mix(audioData: string, volume: number): string {\n        console.log(`🔊 Микширование аудио (громкость: ${volume}%)`);\n        return `mixed_${audioData}`;\n    }\n}\n\nclass VideoRenderer {\n    render(videoData: string, width: number, height: number): string {\n        console.log(`🖥️ Рендер видео ${width}x${height}`);\n        return `rendered_${videoData}`;\n    }\n}\n\n// Фасад\nclass MediaPlayerFacade {\n    private audioDecoder = new AudioDecoder();\n    private videoDecoder = new VideoDecoder();\n    private subtitleParser = new SubtitleParser();\n    private audioMixer = new AudioMixer();\n    private videoRenderer = new VideoRenderer();\n\n    playVideo(file: string, options: {\n        width?: number;\n        height?: number;\n        volume?: number;\n        subtitles?: string;\n    } = {}): void {\n        const { width = 1920, height = 1080, volume = 80, subtitles } = options;\n\n        console.log(`▶️ Воспроизведение: ${file}`);\n\n        const audioData = this.audioDecoder.decode(file);\n        const videoData = this.videoDecoder.decode(file);\n\n        this.audioMixer.mix(audioData, volume);\n        this.videoRenderer.render(videoData, width, height);\n\n        if (subtitles) {\n            this.subtitleParser.parse(subtitles);\n        }\n\n        console.log("✅ Воспроизведение начато!");\n    }\n}\n\n// Клиент: просто и понятно\nconst player = new MediaPlayerFacade();\nplayer.playVideo("movie.mp4", {\n    volume: 70,\n    subtitles: "movie_ru.srt"\n});' },
        { type: 'note', value: 'Facade — один из самых простых и часто используемых паттернов. jQuery — это фасад над DOM API. Axios — фасад над XMLHttpRequest/fetch.' }
      ]
    },
    {
      id: 4,
      title: 'Практика: фасад для системы деплоя',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте фасад для автоматизации деплоя приложения.',
      requirements: [
        'Подсистемы: GitService, TestRunner, DockerService, KubernetesService, SlackNotifier',
        'GitService: pull(), getLatestCommit()',
        'TestRunner: runTests() → boolean',
        'DockerService: buildImage(tag), pushImage(tag)',
        'KubernetesService: deploy(image), rollback()',
        'DeployFacade: deploy(branch) — оркестрирует все шаги'
      ],
      hint: 'Фасад должен выполнить шаги последовательно и остановиться при ошибке (тесты не прошли → не деплоить).',
      expectedOutput: '=== Деплой ===\nGit: pull origin main\nGit: latest commit abc123\nTests: запуск...\nTests: ✅ Все тесты пройдены\nDocker: build image app:abc123\nDocker: push app:abc123\nK8s: deploy app:abc123\nSlack: Деплой app:abc123 успешен!',
      solution: 'class GitService {\n    pull(branch: string): void { console.log(`Git: pull origin ${branch}`); }\n    getLatestCommit(): string { console.log("Git: latest commit abc123"); return "abc123"; }\n}\n\nclass TestRunner {\n    runTests(): boolean {\n        console.log("Tests: запуск...");\n        console.log("Tests: ✅ Все тесты пройдены");\n        return true;\n    }\n}\n\nclass DockerService {\n    buildImage(tag: string): void { console.log(`Docker: build image ${tag}`); }\n    pushImage(tag: string): void { console.log(`Docker: push ${tag}`); }\n}\n\nclass KubernetesService {\n    deploy(image: string): void { console.log(`K8s: deploy ${image}`); }\n    rollback(): void { console.log("K8s: rollback to previous version"); }\n}\n\nclass SlackNotifier {\n    notify(message: string): void { console.log(`Slack: ${message}`); }\n}\n\nclass DeployFacade {\n    private git = new GitService();\n    private tests = new TestRunner();\n    private docker = new DockerService();\n    private k8s = new KubernetesService();\n    private slack = new SlackNotifier();\n\n    deploy(branch: string): boolean {\n        console.log("=== Деплой ===");\n        try {\n            this.git.pull(branch);\n            const commit = this.git.getLatestCommit();\n            const image = `app:${commit}`;\n\n            if (!this.tests.runTests()) {\n                this.slack.notify("Деплой отменён: тесты не пройдены");\n                return false;\n            }\n\n            this.docker.buildImage(image);\n            this.docker.pushImage(image);\n            this.k8s.deploy(image);\n            this.slack.notify(`Деплой ${image} успешен!`);\n            return true;\n        } catch (error) {\n            this.k8s.rollback();\n            this.slack.notify("Деплой провален, выполнен rollback");\n            return false;\n        }\n    }\n}\n\nnew DeployFacade().deploy("main");',
      explanation: 'DeployFacade координирует 5 сервисов в правильном порядке. Клиент вызывает один метод deploy("main"). Обработка ошибок (rollback, уведомление) инкапсулирована внутри фасада.'
    },
    {
      id: 5,
      title: 'Практика: фасад для работы с файлами',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реализуйте Facade на Java для упрощения работы с файловой системой.',
      requirements: [
        'Подсистемы: FileReader, FileWriter, FileCompressor, FileEncryptor',
        'FileFacade с методами: saveSecure(path, data) — шифрует и сохраняет',
        'loadSecure(path) — читает и расшифровывает',
        'archive(srcPath, destPath) — сжимает файл',
        'Каждый метод оркестрирует несколько подсистем'
      ],
      hint: 'saveSecure() вызывает encrypt() затем write(). loadSecure() вызывает read() затем decrypt().',
      expectedOutput: '=== Безопасное сохранение ===\n🔐 Шифрование данных\n💾 Запись в secret.dat\n=== Безопасное чтение ===\n📖 Чтение из secret.dat\n🔓 Расшифровка данных\nДанные: Секретное сообщение\n=== Архивирование ===\n📖 Чтение из data.txt\n📦 Сжатие данных\n💾 Запись в data.zip',
      solution: 'class FileReaderService {\n    String read(String path) {\n        System.out.println("📖 Чтение из " + path);\n        return "encrypted_data";\n    }\n}\n\nclass FileWriterService {\n    void write(String path, String data) {\n        System.out.println("💾 Запись в " + path);\n    }\n}\n\nclass FileEncryptor {\n    String encrypt(String data) {\n        System.out.println("🔐 Шифрование данных");\n        return "encrypted_" + data;\n    }\n    String decrypt(String data) {\n        System.out.println("🔓 Расшифровка данных");\n        return data.replace("encrypted_", "");\n    }\n}\n\nclass FileCompressor {\n    String compress(String data) {\n        System.out.println("📦 Сжатие данных");\n        return "compressed_" + data;\n    }\n}\n\npublic class FileFacade {\n    private FileReaderService reader = new FileReaderService();\n    private FileWriterService writer = new FileWriterService();\n    private FileEncryptor encryptor = new FileEncryptor();\n    private FileCompressor compressor = new FileCompressor();\n\n    public void saveSecure(String path, String data) {\n        System.out.println("=== Безопасное сохранение ===");\n        String encrypted = encryptor.encrypt(data);\n        writer.write(path, encrypted);\n    }\n\n    public String loadSecure(String path) {\n        System.out.println("=== Безопасное чтение ===");\n        String data = reader.read(path);\n        return encryptor.decrypt(data);\n    }\n\n    public void archive(String src, String dest) {\n        System.out.println("=== Архивирование ===");\n        String data = reader.read(src);\n        String compressed = compressor.compress(data);\n        writer.write(dest, compressed);\n    }\n\n    public static void main(String[] args) {\n        FileFacade fs = new FileFacade();\n        fs.saveSecure("secret.dat", "Секретное сообщение");\n        String data = fs.loadSecure("secret.dat");\n        System.out.println("Данные: " + data);\n        fs.archive("data.txt", "data.zip");\n    }\n}',
      explanation: 'FileFacade предоставляет три высокоуровневых метода, каждый из которых координирует несколько подсистем. Клиенту не нужно знать о FileEncryptor или FileCompressor — он работает через простой API фасада.'
    },
    {
      id: 6,
      title: 'Практика: API Gateway как Facade на TypeScript',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте API Gateway, который агрегирует данные из нескольких микросервисов.',
      requirements: [
        'Сервисы: UserService, OrderService, ProductService, ReviewService',
        'ApiGateway фасад с методом getUserDashboard(userId)',
        'Метод собирает данные из всех сервисов и возвращает единый объект',
        'Обработка ошибок: если один сервис недоступен, вернуть частичные данные',
        'Использование Promise.allSettled для параллельных запросов'
      ],
      hint: 'Promise.allSettled() возвращает результат всех промисов, даже если некоторые отклонены. Проверяйте status === "fulfilled".',
      expectedOutput: '{\n  user: { id: 1, name: "Иван" },\n  orders: [{ id: 101, total: 5000 }],\n  recommendations: [{ id: 42, name: "Ноутбук" }],\n  reviews: { error: "Сервис отзывов недоступен" }\n}',
      solution: 'class UserService {\n    async getUser(id: number) {\n        return { id, name: "Иван", email: "ivan@mail.com" };\n    }\n}\n\nclass OrderService {\n    async getOrders(userId: number) {\n        return [{ id: 101, total: 5000, status: "delivered" }];\n    }\n}\n\nclass ProductService {\n    async getRecommendations(userId: number) {\n        return [{ id: 42, name: "Ноутбук", price: 85000 }];\n    }\n}\n\nclass ReviewService {\n    async getUserReviews(userId: number): Promise<any[]> {\n        throw new Error("Сервис отзывов недоступен");\n    }\n}\n\nclass ApiGateway {\n    private userService = new UserService();\n    private orderService = new OrderService();\n    private productService = new ProductService();\n    private reviewService = new ReviewService();\n\n    async getUserDashboard(userId: number) {\n        const [userResult, ordersResult, recsResult, reviewsResult] =\n            await Promise.allSettled([\n                this.userService.getUser(userId),\n                this.orderService.getOrders(userId),\n                this.productService.getRecommendations(userId),\n                this.reviewService.getUserReviews(userId)\n            ]);\n\n        return {\n            user: userResult.status === "fulfilled" ? userResult.value : { error: "Недоступен" },\n            orders: ordersResult.status === "fulfilled" ? ordersResult.value : { error: "Недоступен" },\n            recommendations: recsResult.status === "fulfilled" ? recsResult.value : { error: "Недоступен" },\n            reviews: reviewsResult.status === "fulfilled" ? reviewsResult.value : { error: (reviewsResult as PromiseRejectedResult).reason.message }\n        };\n    }\n}\n\nasync function main() {\n    const gateway = new ApiGateway();\n    const dashboard = await gateway.getUserDashboard(1);\n    console.log(JSON.stringify(dashboard, null, 2));\n}\n\nmain();',
      explanation: 'API Gateway — классический Facade в микросервисной архитектуре. Клиент делает один запрос, Gateway параллельно запрашивает 4 сервиса. Promise.allSettled обеспечивает graceful degradation — если один сервис упал, остальные данные всё равно доступны.'
    }
  ]
}
