export default {
  id: 8,
  title: 'Обработка ошибок',
  description: 'Глобальная обработка исключений: @ExceptionHandler, @ControllerAdvice, кастомные исключения, RFC 7807',
  lessons: [
    {
      id: 1,
      title: 'Проблема обработки ошибок в Spring',
      type: 'theory',
      content: [
        { type: 'text', value: 'Без явной обработки ошибок Spring возвращает HTML страницу с ошибкой или JSON со стектрейсом. Это не подходит для REST API — нужен структурированный JSON ответ.' },
        { type: 'heading', value: 'Что происходит без обработки' },
        { type: 'code', language: 'java', value: '// Без обработки ошибок Spring вернёт нечто подобное:\n// {\n//   "timestamp": "2024-01-15T10:30:00.000+00:00",\n//   "status": 500,\n//   "error": "Internal Server Error",\n//   "message": "...",\n//   "path": "/api/users/999"\n// }\n\n// Это нехорошо — утечка внутренней информации!\n// Нужен свой формат ошибок' },
        { type: 'heading', value: 'Желаемый формат ошибок' },
        { type: 'code', language: 'java', value: '// Лучше вернуть понятный ответ:\n// HTTP 404 Not Found\n// {\n//   "status": 404,\n//   "error": "Not Found",\n//   "message": "Пользователь с id=999 не найден",\n//   "timestamp": "2024-01-15T10:30:00"\n// }' },
        { type: 'tip', value: 'Хорошая обработка ошибок — часть API дизайна. Клиент должен получать понятные сообщения, а не внутренние детали реализации. Никогда не показывай стектрейс в продакшн ответах!' }
      ]
    },
    {
      id: 2,
      title: '@ExceptionHandler в контроллере',
      type: 'theory',
      content: [
        { type: 'text', value: '@ExceptionHandler обрабатывает исключения в рамках одного контроллера. Метод помеченный этой аннотацией вызывается когда нужное исключение возникает в этом же контроллере.' },
        { type: 'code', language: 'java', value: '@RestController\n@RequestMapping("/api/users")\npublic class UserController {\n\n    @GetMapping("/{id}")\n    public User getUser(@PathVariable Long id) {\n        return userService.findById(id)\n            .orElseThrow(() -> new UserNotFoundException("Пользователь не найден: " + id));\n    }\n\n    // Обрабатывает UserNotFoundException только в ЭТОМ контроллере\n    @ExceptionHandler(UserNotFoundException.class)\n    public ResponseEntity<Map<String, String>> handleNotFound(\n            UserNotFoundException ex) {\n        Map<String, String> error = Map.of(\n            "error", "Not Found",\n            "message", ex.getMessage()\n        );\n        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);\n    }\n\n    @ExceptionHandler(IllegalArgumentException.class)\n    public ResponseEntity<Map<String, String>> handleBadRequest(\n            IllegalArgumentException ex) {\n        return ResponseEntity.badRequest()\n            .body(Map.of("error", ex.getMessage()));\n    }\n}' },
        { type: 'note', value: '@ExceptionHandler в контроллере — ограниченное решение. Если то же исключение нужно обрабатывать в нескольких контроллерах — используй @ControllerAdvice.' }
      ]
    },
    {
      id: 3,
      title: '@ControllerAdvice: глобальный обработчик',
      type: 'theory',
      content: [
        { type: 'text', value: '@ControllerAdvice (или @RestControllerAdvice) — глобальный обработчик исключений. Один класс обрабатывает исключения из всех контроллеров приложения.' },
        { type: 'code', language: 'java', value: '@RestControllerAdvice  // @ControllerAdvice + @ResponseBody\npublic class GlobalExceptionHandler {\n\n    // Пользователь не найден -> 404\n    @ExceptionHandler(UserNotFoundException.class)\n    public ResponseEntity<ErrorResponse> handleNotFound(\n            UserNotFoundException ex) {\n        ErrorResponse error = new ErrorResponse(\n            HttpStatus.NOT_FOUND.value(),\n            "Not Found",\n            ex.getMessage()\n        );\n        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);\n    }\n\n    // Нарушение уникальности в БД -> 409\n    @ExceptionHandler(DataIntegrityViolationException.class)\n    public ResponseEntity<ErrorResponse> handleConflict(\n            DataIntegrityViolationException ex) {\n        ErrorResponse error = new ErrorResponse(\n            HttpStatus.CONFLICT.value(),\n            "Conflict",\n            "Ресурс с такими данными уже существует"\n        );\n        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);\n    }\n\n    // Все остальные ошибки -> 500\n    @ExceptionHandler(Exception.class)\n    public ResponseEntity<ErrorResponse> handleGeneral(Exception ex) {\n        ErrorResponse error = new ErrorResponse(\n            HttpStatus.INTERNAL_SERVER_ERROR.value(),\n            "Internal Server Error",\n            "Произошла внутренняя ошибка сервера"\n        );\n        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);\n    }\n}' },
        { type: 'tip', value: 'Порядок важен! Spring выбирает наиболее специфичный обработчик. UserNotFoundException обработается первым, Exception — только если нет более специфичного обработчика.' }
      ]
    },
    {
      id: 4,
      title: 'Кастомные исключения',
      type: 'theory',
      content: [
        { type: 'text', value: 'Свои классы исключений делают код читаемым и позволяют легко маппить исключения на HTTP статусы.' },
        { type: 'code', language: 'java', value: '// Базовый класс для всех бизнес-исключений\npublic abstract class BusinessException extends RuntimeException {\n    private final HttpStatus status;\n\n    public BusinessException(String message, HttpStatus status) {\n        super(message);\n        this.status = status;\n    }\n\n    public HttpStatus getStatus() { return status; }\n}\n\n// Конкретные исключения\npublic class ResourceNotFoundException extends BusinessException {\n    public ResourceNotFoundException(String resource, Long id) {\n        super(resource + " с id=" + id + " не найден", HttpStatus.NOT_FOUND);\n    }\n}\n\npublic class DuplicateResourceException extends BusinessException {\n    public DuplicateResourceException(String message) {\n        super(message, HttpStatus.CONFLICT);\n    }\n}\n\npublic class AccessDeniedException extends BusinessException {\n    public AccessDeniedException(String message) {\n        super(message, HttpStatus.FORBIDDEN);\n    }\n}' },
        { type: 'code', language: 'java', value: '// Универсальный обработчик для всех BusinessException\n@ExceptionHandler(BusinessException.class)\npublic ResponseEntity<ErrorResponse> handleBusinessException(BusinessException ex) {\n    ErrorResponse error = new ErrorResponse(\n        ex.getStatus().value(),\n        ex.getStatus().getReasonPhrase(),\n        ex.getMessage()\n    );\n    return ResponseEntity.status(ex.getStatus()).body(error);\n}' },
        { type: 'note', value: 'Используй RuntimeException (непроверяемые исключения) в Spring приложениях — их не нужно объявлять в throws. Spring автоматически откатывает транзакции при RuntimeException.' }
      ]
    },
    {
      id: 5,
      title: '@ResponseStatus на исключениях',
      type: 'theory',
      content: [
        { type: 'text', value: '@ResponseStatus позволяет задать HTTP статус прямо на классе исключения. Простой способ без @ExceptionHandler.' },
        { type: 'code', language: 'java', value: '// Быстрый способ: @ResponseStatus на исключении\n@ResponseStatus(HttpStatus.NOT_FOUND)\npublic class UserNotFoundException extends RuntimeException {\n    public UserNotFoundException(Long id) {\n        super("Пользователь " + id + " не найден");\n    }\n}\n\n// Spring автоматически вернёт 404 при этом исключении\n// НО: ответ будет в формате Spring по умолчанию\n\n// Для кастомного формата всё равно нужен @ExceptionHandler\n@ResponseStatus(code = HttpStatus.NOT_FOUND, reason = "Пользователь не найден")\npublic class UserNotFoundException extends RuntimeException { ... }' },
        { type: 'heading', value: 'ResponseStatusException' },
        { type: 'code', language: 'java', value: '// Альтернатива: бросать ResponseStatusException напрямую\n@GetMapping("/{id}")\npublic User getUser(@PathVariable Long id) {\n    return userService.findById(id)\n        .orElseThrow(() -> new ResponseStatusException(\n            HttpStatus.NOT_FOUND,\n            "Пользователь " + id + " не найден"\n        ));\n}\n// Не нужно создавать отдельный класс исключения\n// Подходит для простых случаев' },
        { type: 'tip', value: 'ResponseStatusException удобна для быстрого прототипирования. В production-коде лучше использовать кастомные исключения — они более выразительны и легче тестируются.' }
      ]
    },
    {
      id: 6,
      title: 'Класс ErrorResponse и RFC 7807',
      type: 'theory',
      content: [
        { type: 'text', value: 'RFC 7807 (Problem Details for HTTP APIs) — стандарт для описания ошибок в REST API. Spring Boot 3 поддерживает его из коробки через ProblemDetail.' },
        { type: 'code', language: 'java', value: '// Свой класс ErrorResponse (простой вариант)\npublic class ErrorResponse {\n    private int status;\n    private String error;\n    private String message;\n    private LocalDateTime timestamp;\n    private String path;\n\n    public ErrorResponse(int status, String error, String message, String path) {\n        this.status = status;\n        this.error = error;\n        this.message = message;\n        this.timestamp = LocalDateTime.now();\n        this.path = path;\n    }\n    // геттеры\n}' },
        { type: 'code', language: 'java', value: '// Spring Boot 3: ProblemDetail (RFC 7807)\n@ExceptionHandler(ResourceNotFoundException.class)\npublic ProblemDetail handleNotFound(\n        ResourceNotFoundException ex,\n        HttpServletRequest request) {\n    ProblemDetail problem = ProblemDetail\n        .forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());\n    problem.setTitle("Ресурс не найден");\n    problem.setInstance(URI.create(request.getRequestURI()));\n    problem.setProperty("timestamp", Instant.now());\n    return problem;\n}\n// Возвращает:\n// {\n//   "type": "about:blank",\n//   "title": "Ресурс не найден",\n//   "status": 404,\n//   "detail": "Пользователь 42 не найден",\n//   "instance": "/api/users/42",\n//   "timestamp": "2024-01-15T10:30:00Z"\n// }' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Глобальный обработчик ошибок',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай полноценную систему обработки ошибок для REST API с кастомными исключениями и глобальным обработчиком.',
      requirements: [
        'Класс ErrorResponse: status, message, timestamp, path',
        'Исключение UserNotFoundException (404)',
        'Исключение EmailAlreadyExistsException (409)',
        '@RestControllerAdvice с обработчиками для каждого',
        'Обработчик для MethodArgumentNotValidException (400)',
        'Fallback обработчик для Exception (500)'
      ],
      expectedOutput: 'GET /api/users/999 => 404 {"status":404,"message":"Пользователь 999 не найден","timestamp":"..."}\nPOST /api/users {"email":"exist@test.com"} => 409 {"status":409,"message":"Email уже занят"}',
      hint: 'ErrorResponse класс с полями. @RestControllerAdvice класс. Для каждого исключения — отдельный @ExceptionHandler метод. HttpServletRequest request параметр для path.',
      solution: '// ErrorResponse.java\npublic class ErrorResponse {\n    private int status;\n    private String message;\n    private String timestamp;\n    private String path;\n\n    public ErrorResponse(int status, String message, String path) {\n        this.status = status;\n        this.message = message;\n        this.timestamp = LocalDateTime.now().toString();\n        this.path = path;\n    }\n    // геттеры\n}\n\n// UserNotFoundException.java\npublic class UserNotFoundException extends RuntimeException {\n    public UserNotFoundException(Long id) {\n        super("Пользователь " + id + " не найден");\n    }\n}\n\n// EmailAlreadyExistsException.java\npublic class EmailAlreadyExistsException extends RuntimeException {\n    public EmailAlreadyExistsException(String email) {\n        super("Email " + email + " уже занят");\n    }\n}\n\n// GlobalExceptionHandler.java\n@RestControllerAdvice\npublic class GlobalExceptionHandler {\n\n    @ExceptionHandler(UserNotFoundException.class)\n    public ResponseEntity<ErrorResponse> handleNotFound(\n            UserNotFoundException ex, HttpServletRequest req) {\n        return ResponseEntity.status(HttpStatus.NOT_FOUND)\n            .body(new ErrorResponse(404, ex.getMessage(), req.getRequestURI()));\n    }\n\n    @ExceptionHandler(EmailAlreadyExistsException.class)\n    public ResponseEntity<ErrorResponse> handleConflict(\n            EmailAlreadyExistsException ex, HttpServletRequest req) {\n        return ResponseEntity.status(HttpStatus.CONFLICT)\n            .body(new ErrorResponse(409, ex.getMessage(), req.getRequestURI()));\n    }\n\n    @ExceptionHandler(MethodArgumentNotValidException.class)\n    public ResponseEntity<Map<String, Object>> handleValidation(\n            MethodArgumentNotValidException ex, HttpServletRequest req) {\n        Map<String, Object> response = new LinkedHashMap<>();\n        response.put("status", 400);\n        response.put("path", req.getRequestURI());\n        Map<String, String> errors = new LinkedHashMap<>();\n        ex.getBindingResult().getFieldErrors()\n            .forEach(e -> errors.put(e.getField(), e.getDefaultMessage()));\n        response.put("errors", errors);\n        return ResponseEntity.badRequest().body(response);\n    }\n\n    @ExceptionHandler(Exception.class)\n    public ResponseEntity<ErrorResponse> handleGeneral(\n            Exception ex, HttpServletRequest req) {\n        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)\n            .body(new ErrorResponse(500,\n                "Внутренняя ошибка сервера", req.getRequestURI()));\n    }\n}',
      explanation: '@RestControllerAdvice перехватывает исключения из всех контроллеров. Порядок обработчиков: специфичные (UserNotFoundException) → общие (Exception). HttpServletRequest позволяет добавить путь к ответу. Отдельный обработчик для валидации возвращает детализированные ошибки по каждому полю.'
    }
  ]
}
