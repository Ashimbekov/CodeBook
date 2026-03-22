export default {
  id: 25,
  title: 'Отправка Email с JavaMailSender',
  description: 'Настройка и использование JavaMailSender для отправки текстовых и HTML писем, работа с шаблонами Thymeleaf, вложения и асинхронная отправка',
  lessons: [
    {
      id: 1,
      title: 'Настройка JavaMailSender',
      type: 'theory',
      content: [
        { type: 'text', value: 'Spring Boot предоставляет JavaMailSender — абстракцию для отправки email через SMTP. Поддерживает Gmail, Яндекс.Почту, корпоративные серверы и тестовые SMTP-серверы.' },
        { type: 'heading', value: 'Зависимость' },
        { type: 'code', language: 'xml', value: '<dependency>\n    <groupId>org.springframework.boot</groupId>\n    <artifactId>spring-boot-starter-mail</artifactId>\n</dependency>' },
        { type: 'heading', value: 'Настройка SMTP в application.properties' },
        { type: 'code', language: 'java', value: '# Gmail SMTP\nspring.mail.host=smtp.gmail.com\nspring.mail.port=587\nspring.mail.username=yourapp@gmail.com\nspring.mail.password=${GMAIL_APP_PASSWORD}\nspring.mail.properties.mail.smtp.auth=true\nspring.mail.properties.mail.smtp.starttls.enable=true\n\n# Яндекс.Почта\n# spring.mail.host=smtp.yandex.ru\n# spring.mail.port=465\n# spring.mail.properties.mail.smtp.ssl.enable=true\n\n# Для разработки — Mailhog (локальный SMTP без отправки)\n# spring.mail.host=localhost\n# spring.mail.port=1025' },
        { type: 'tip', value: 'Для Gmail используй App Password, а не обычный пароль. Включи двухфакторную аутентификацию и создай App Password в настройках Google аккаунта.' }
      ]
    },
    {
      id: 2,
      title: 'Отправка простых писем',
      type: 'theory',
      content: [
        { type: 'text', value: 'SimpleMailMessage — для простых текстовых писем. MimeMessage — для HTML, вложений и картинок.' },
        { type: 'heading', value: 'EmailService — базовая реализация' },
        { type: 'code', language: 'java', value: '@Service\npublic class EmailService {\n\n    private final JavaMailSender mailSender;\n\n    @Value("${spring.mail.username}")\n    private String fromEmail;\n\n    public EmailService(JavaMailSender mailSender) {\n        this.mailSender = mailSender;\n    }\n\n    // Простое текстовое письмо\n    public void sendSimple(String to, String subject, String text) {\n        SimpleMailMessage message = new SimpleMailMessage();\n        message.setFrom(fromEmail);\n        message.setTo(to);\n        message.setSubject(subject);\n        message.setText(text);\n        mailSender.send(message);\n    }\n\n    // Письмо нескольким получателям\n    public void sendToMany(String[] recipients, String subject, String text) {\n        SimpleMailMessage message = new SimpleMailMessage();\n        message.setFrom(fromEmail);\n        message.setTo(recipients);\n        message.setSubject(subject);\n        message.setText(text);\n        mailSender.send(message);\n    }\n}' }
      ]
    },
    {
      id: 3,
      title: 'HTML письма с MimeMessage',
      type: 'theory',
      content: [
        { type: 'text', value: 'HTML письма выглядят профессиональнее и поддерживают форматирование, картинки, ссылки. Для создания MimeMessage используй MimeMessageHelper.' },
        { type: 'heading', value: 'Отправка HTML письма' },
        { type: 'code', language: 'java', value: 'public void sendHtml(String to, String subject, String htmlContent) throws MessagingException {\n    MimeMessage message = mailSender.createMimeMessage();\n    MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");\n\n    helper.setFrom(fromEmail);\n    helper.setTo(to);\n    helper.setSubject(subject);\n    helper.setText(htmlContent, true);  // true = это HTML\n\n    mailSender.send(message);\n}\n\n// Пример вызова\nString html = "<h1>Добро пожаловать!</h1>" +\n    "<p>Привет, <b>" + username + "</b>!</p>" +\n    "<a href=\\"http://myapp.kz/confirm/" + token + "\\">Подтвердить email</a>";\n\nemailService.sendHtml(userEmail, "Подтверждение регистрации", html);' },
        { type: 'heading', value: 'Вложения к письму' },
        { type: 'code', language: 'java', value: 'public void sendWithAttachment(String to, String subject,\n                               String text, String attachPath) throws MessagingException {\n    MimeMessage message = mailSender.createMimeMessage();\n    MimeMessageHelper helper = new MimeMessageHelper(message, true);\n\n    helper.setTo(to);\n    helper.setSubject(subject);\n    helper.setText(text);\n\n    // Прикрепить файл\n    FileSystemResource file = new FileSystemResource(new File(attachPath));\n    helper.addAttachment("Отчёт.pdf", file);\n\n    mailSender.send(message);\n}' }
      ]
    },
    {
      id: 4,
      title: 'Шаблоны писем с Thymeleaf',
      type: 'theory',
      content: [
        { type: 'text', value: 'Строить HTML через конкатенацию строк неудобно. Thymeleaf позволяет создавать шаблоны писем с переменными, условиями и циклами.' },
        { type: 'heading', value: 'Thymeleaf Email шаблон' },
        { type: 'code', language: 'xml', value: '<!-- src/main/resources/templates/email/welcome.html -->\n<!DOCTYPE html>\n<html xmlns:th="http://www.thymeleaf.org">\n<body>\n    <h1>Добро пожаловать, <span th:text="${username}">Пользователь</span>!</h1>\n    <p>Для подтверждения email нажмите кнопку:</p>\n    <a th:href="${confirmUrl}" style="background: #007bff; color: white; padding: 10px 20px;">\n        Подтвердить\n    </a>\n    <p>Если вы не регистрировались — проигнорируйте это письмо.</p>\n</body>\n</html>' },
        { type: 'code', language: 'java', value: '@Service\npublic class TemplateEmailService {\n\n    private final JavaMailSender mailSender;\n    private final SpringTemplateEngine templateEngine;\n\n    public void sendWelcomeEmail(String to, String username, String confirmToken) throws MessagingException {\n        Context context = new Context();\n        context.setVariable("username", username);\n        context.setVariable("confirmUrl", "https://myapp.kz/confirm/" + confirmToken);\n\n        String html = templateEngine.process("email/welcome", context);\n\n        MimeMessage message = mailSender.createMimeMessage();\n        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");\n        helper.setTo(to);\n        helper.setSubject("Добро пожаловать в MyApp!");\n        helper.setText(html, true);\n        mailSender.send(message);\n    }\n}' }
      ]
    },
    {
      id: 5,
      title: 'Асинхронная отправка и повторные попытки',
      type: 'theory',
      content: [
        { type: 'text', value: 'Отправка email может занимать несколько секунд. Делать это синхронно в HTTP-запросе плохо — пользователь ждёт. @Async решает эту проблему.' },
        { type: 'heading', value: 'Асинхронная отправка' },
        { type: 'code', language: 'java', value: '@Service\npublic class AsyncEmailService {\n\n    private final JavaMailSender mailSender;\n\n    @Async\n    public CompletableFuture<Void> sendAsync(String to, String subject, String text) {\n        try {\n            SimpleMailMessage message = new SimpleMailMessage();\n            message.setTo(to);\n            message.setSubject(subject);\n            message.setText(text);\n            mailSender.send(message);\n            log.info("Email отправлен на {}", to);\n        } catch (MailException e) {\n            log.error("Ошибка отправки email на {}: {}", to, e.getMessage());\n        }\n        return CompletableFuture.completedFuture(null);\n    }\n}\n\n// В сервисе регистрации\n@Service\npublic class AuthService {\n    @Autowired AsyncEmailService emailService;\n\n    public User register(RegisterRequest req) {\n        User user = userRepository.save(new User(req));\n        // Письмо отправляется асинхронно — пользователь не ждёт!\n        emailService.sendAsync(user.getEmail(), "Добро пожаловать!", "Регистрация успешна");\n        return user;\n    }\n}' },
        { type: 'tip', value: 'Для надёжной доставки рассмотри использование очереди сообщений (RabbitMQ, Kafka): сохраняй задачу отправки в очередь, отдельный воркер отправляет. При ошибке — автоматический retry.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: уведомления для интернет-магазина',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте EmailNotificationService для интернет-магазина: подтверждение заказа, уведомление об изменении статуса, восстановление пароля.',
      requirements: [
        'Настрой JavaMailSender (используй Mailhog для разработки)',
        'Метод sendOrderConfirmation(Order order) — HTML письмо с деталями заказа',
        'Метод sendStatusUpdate(Order order, String newStatus) — уведомление о смене статуса',
        'Метод sendPasswordReset(User user, String resetToken) — ссылка для сброса пароля',
        'Все методы должны быть @Async',
        'Обрабатывай MailException с логированием'
      ],
      hint: 'Thymeleaf шаблоны храни в resources/templates/email/. Для каждого типа письма — отдельный HTML файл.',
      expectedOutput: 'Приложение запускается с JavaMailSender (Mailhog localhost:1025).\n\nПосле создания заказа #42 (асинхронно):\nINFO  AsyncEmailService: Email отправлен на alibek@mail.ru\n\nMailhog http://localhost:8025 показывает письмо:\nОт: yourapp@mail.kz\nКому: alibek@mail.ru\nТема: Заказ #42 подтверждён\nHTML тело с деталями заказа: товары, сумма, адрес доставки.\n\nПосле обновления статуса заказа до SHIPPED:\nINFO  AsyncEmailService: Email отправлен на alibek@mail.ru\nTema: Статус заказа изменён\nHTML тело: "Ваш заказ #42 передан в доставку"\n\nПри запросе сброса пароля:\nINFO  AsyncEmailService: Email отправлен на alibek@mail.ru\nТема: Сброс пароля\nHTML тело: ссылка https://myapp.kz/reset/<uuid-token>\n\nЕсли SMTP сервер недоступен:\nERROR Ошибка письма о заказе: Connection refused — основной процесс продолжает работу.',
      solution: '@Service @Slf4j\npublic class EmailNotificationService {\n    @Autowired JavaMailSender mailSender;\n    @Autowired SpringTemplateEngine templateEngine;\n    @Value("${spring.mail.username}") String from;\n\n    @Async\n    public void sendOrderConfirmation(Order order) {\n        try {\n            Context ctx = new Context();\n            ctx.setVariable("order", order);\n            ctx.setVariable("items", order.getItems());\n            String html = templateEngine.process("email/order-confirm", ctx);\n            sendHtml(order.getUserEmail(), "Заказ #" + order.getId() + " подтверждён", html);\n        } catch (Exception e) { log.error("Ошибка письма о заказе: {}", e.getMessage()); }\n    }\n\n    @Async\n    public void sendStatusUpdate(Order order, String status) {\n        try {\n            Context ctx = new Context();\n            ctx.setVariable("orderId", order.getId());\n            ctx.setVariable("status", status);\n            String html = templateEngine.process("email/status-update", ctx);\n            sendHtml(order.getUserEmail(), "Статус заказа изменён", html);\n        } catch (Exception e) { log.error("Ошибка письма о статусе: {}", e.getMessage()); }\n    }\n\n    @Async\n    public void sendPasswordReset(User user, String token) {\n        try {\n            Context ctx = new Context();\n            ctx.setVariable("user", user);\n            ctx.setVariable("resetUrl", "https://myapp.kz/reset/" + token);\n            String html = templateEngine.process("email/password-reset", ctx);\n            sendHtml(user.getEmail(), "Сброс пароля", html);\n        } catch (Exception e) { log.error("Ошибка письма о пароле: {}", e.getMessage()); }\n    }\n\n    private void sendHtml(String to, String subject, String html) throws MessagingException {\n        MimeMessage msg = mailSender.createMimeMessage();\n        MimeMessageHelper h = new MimeMessageHelper(msg, true, "UTF-8");\n        h.setFrom(from); h.setTo(to); h.setSubject(subject); h.setText(html, true);\n        mailSender.send(msg);\n    }\n}',
      explanation: '@Async позволяет немедленно вернуть ответ пользователю, пока письмо отправляется в фоне. try-catch в каждом методе гарантирует, что ошибка отправки email не сломает основной бизнес-процесс.'
    }
  ]
}
