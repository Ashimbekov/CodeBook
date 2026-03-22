export default {
  id: 24,
  title: 'Работа с файлами: MultipartFile',
  description: 'Загрузка и скачивание файлов через REST API с использованием MultipartFile, хранение в файловой системе и облачных сервисах, валидация и безопасность',
  lessons: [
    {
      id: 1,
      title: 'Загрузка файлов через MultipartFile',
      type: 'theory',
      content: [
        { type: 'text', value: 'MultipartFile — интерфейс Spring для работы с загружаемыми файлами. Клиент отправляет файл через multipart/form-data запрос, Spring автоматически маппит его в MultipartFile.' },
        { type: 'heading', value: 'Базовый endpoint загрузки' },
        { type: 'code', language: 'java', value: '@RestController\n@RequestMapping("/api/files")\npublic class FileController {\n\n    @PostMapping("/upload")\n    public ResponseEntity<String> uploadFile(\n        @RequestParam("file") MultipartFile file\n    ) {\n        if (file.isEmpty()) {\n            return ResponseEntity.badRequest().body("Файл пустой");\n        }\n\n        String filename = file.getOriginalFilename();\n        long size = file.getSize();\n        String contentType = file.getContentType();\n\n        // Сохранить файл\n        fileService.store(file);\n\n        return ResponseEntity.ok(\n            String.format("Загружен: %s (%d байт, %s)", filename, size, contentType)\n        );\n    }\n\n    // Загрузка нескольких файлов\n    @PostMapping("/upload-multiple")\n    public ResponseEntity<List<String>> uploadMultiple(\n        @RequestParam("files") List<MultipartFile> files\n    ) {\n        List<String> saved = files.stream()\n            .map(fileService::store)\n            .collect(Collectors.toList());\n        return ResponseEntity.ok(saved);\n    }\n}' },
        { type: 'heading', value: 'Настройка лимитов в application.properties' },
        { type: 'code', language: 'java', value: '# Максимальный размер одного файла\nspring.servlet.multipart.max-file-size=10MB\n# Максимальный размер всего запроса\nspring.servlet.multipart.max-request-size=50MB' }
      ]
    },
    {
      id: 2,
      title: 'FileService: сохранение на диск',
      type: 'theory',
      content: [
        { type: 'text', value: 'Сервис для работы с файлами: сохранение с уникальными именами, предотвращение атак path traversal, организация директорий.' },
        { type: 'heading', value: 'Реализация FileService' },
        { type: 'code', language: 'java', value: '@Service\npublic class FileStorageService {\n\n    private final Path uploadDir;\n\n    public FileStorageService(@Value("${app.upload.dir:uploads}") String uploadDir) {\n        this.uploadDir = Paths.get(uploadDir).toAbsolutePath().normalize();\n        try {\n            Files.createDirectories(this.uploadDir);\n        } catch (IOException e) {\n            throw new RuntimeException("Не удалось создать директорию загрузок", e);\n        }\n    }\n\n    public String store(MultipartFile file) {\n        // Безопасное имя файла — UUID + расширение\n        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());\n        String extension = getExtension(originalFilename);\n        String storedFilename = UUID.randomUUID().toString() + "." + extension;\n\n        // Проверка path traversal\n        if (originalFilename.contains("..")) {\n            throw new IllegalArgumentException("Недопустимое имя файла: " + originalFilename);\n        }\n\n        try {\n            Path targetLocation = uploadDir.resolve(storedFilename);\n            Files.copy(file.getInputStream(), targetLocation,\n                StandardCopyOption.REPLACE_EXISTING);\n            return storedFilename;\n        } catch (IOException e) {\n            throw new RuntimeException("Ошибка сохранения файла", e);\n        }\n    }\n\n    private String getExtension(String filename) {\n        return Optional.ofNullable(filename)\n            .filter(f -> f.contains("."))\n            .map(f -> f.substring(f.lastIndexOf(".") + 1))\n            .orElse("bin");\n    }\n}' }
      ]
    },
    {
      id: 3,
      title: 'Скачивание файлов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Для скачивания файлов используется Resource. Spring умеет отдавать файлы из classpath, файловой системы и URL.' },
        { type: 'heading', value: 'Endpoint для скачивания' },
        { type: 'code', language: 'java', value: '@GetMapping("/download/{filename:.+}")\npublic ResponseEntity<Resource> downloadFile(@PathVariable String filename) {\n    Resource resource = fileService.loadAsResource(filename);\n\n    String contentType = "application/octet-stream";\n    try {\n        contentType = Files.probeContentType(Paths.get(filename));\n    } catch (IOException e) {\n        // используем default\n    }\n\n    return ResponseEntity.ok()\n        .contentType(MediaType.parseMediaType(contentType))\n        .header(HttpHeaders.CONTENT_DISPOSITION,\n            "attachment; filename=\\"" + resource.getFilename() + "\\"" )\n        .body(resource);\n}\n\n// Просмотр в браузере (inline) вместо скачивания\n@GetMapping("/view/{filename:.+}")\npublic ResponseEntity<Resource> viewFile(@PathVariable String filename) {\n    Resource resource = fileService.loadAsResource(filename);\n    return ResponseEntity.ok()\n        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\\"" + filename + "\\"" )\n        .body(resource);\n}' },
        { type: 'code', language: 'java', value: 'public Resource loadAsResource(String filename) {\n    try {\n        Path filePath = uploadDir.resolve(filename).normalize();\n        Resource resource = new UrlResource(filePath.toUri());\n        if (resource.exists() && resource.isReadable()) {\n            return resource;\n        }\n        throw new FileNotFoundException("Файл не найден: " + filename);\n    } catch (MalformedURLException e) {\n        throw new FileNotFoundException("Файл не найден: " + filename);\n    }\n}' }
      ]
    },
    {
      id: 4,
      title: 'Валидация файлов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Принимать нужно только безопасные файлы: проверять тип, размер, расширение. Полагаться только на расширение опасно — нужно проверять MIME-тип.' },
        { type: 'heading', value: 'FileValidator' },
        { type: 'code', language: 'java', value: '@Component\npublic class FileValidator {\n\n    private static final Set<String> ALLOWED_IMAGE_TYPES = Set.of(\n        "image/jpeg", "image/png", "image/gif", "image/webp"\n    );\n    private static final long MAX_SIZE = 5 * 1024 * 1024; // 5 MB\n\n    public void validateImage(MultipartFile file) {\n        if (file == null || file.isEmpty()) {\n            throw new ValidationException("Файл не может быть пустым");\n        }\n        if (file.getSize() > MAX_SIZE) {\n            throw new ValidationException("Файл слишком большой. Максимум 5 МБ");\n        }\n        if (!ALLOWED_IMAGE_TYPES.contains(file.getContentType())) {\n            throw new ValidationException(\n                "Неподдерживаемый тип файла: " + file.getContentType());\n        }\n    }\n\n    // Более надёжная проверка через Apache Tika\n    public String detectMimeType(MultipartFile file) throws IOException {\n        Tika tika = new Tika();\n        return tika.detect(file.getInputStream(), file.getOriginalFilename());\n    }\n}' },
        { type: 'warning', value: 'Никогда не доверяй file.getContentType() — клиент может подделать MIME-тип. Используй Apache Tika или анализ magic bytes для реальной проверки типа файла.' }
      ]
    },
    {
      id: 5,
      title: 'Хранение в Amazon S3',
      type: 'theory',
      content: [
        { type: 'text', value: 'Для продакшена файлы лучше хранить в облаке (AWS S3, MinIO). Это масштабируемо, надёжно и не зависит от локальной файловой системы сервера.' },
        { type: 'heading', value: 'S3 конфигурация' },
        { type: 'code', language: 'xml', value: '<dependency>\n    <groupId>software.amazon.awssdk</groupId>\n    <artifactId>s3</artifactId>\n    <version>2.22.0</version>\n</dependency>' },
        { type: 'code', language: 'java', value: '@Service\npublic class S3StorageService {\n\n    private final S3Client s3Client;\n    private final String bucketName;\n\n    public S3StorageService(S3Client s3Client,\n                             @Value("${aws.s3.bucket}") String bucketName) {\n        this.s3Client = s3Client;\n        this.bucketName = bucketName;\n    }\n\n    public String upload(MultipartFile file) throws IOException {\n        String key = UUID.randomUUID() + "_" + file.getOriginalFilename();\n\n        s3Client.putObject(\n            PutObjectRequest.builder()\n                .bucket(bucketName)\n                .key(key)\n                .contentType(file.getContentType())\n                .build(),\n            RequestBody.fromInputStream(file.getInputStream(), file.getSize())\n        );\n\n        return String.format("https://%s.s3.amazonaws.com/%s", bucketName, key);\n    }\n\n    public void delete(String key) {\n        s3Client.deleteObject(b -> b.bucket(bucketName).key(key));\n    }\n}' }
      ]
    },
    {
      id: 6,
      title: 'Практика: сервис загрузки аватаров',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте сервис загрузки аватаров пользователей: принимать только изображения до 2 МБ, сохранять с UUID-именем, возвращать URL для доступа, поддерживать удаление старого аватара.',
      requirements: [
        'POST /api/users/{id}/avatar — загружает аватар',
        'Принимать только image/jpeg и image/png, максимум 2 МБ',
        'Сохранять файл как UUID + расширение в папку uploads/avatars/',
        'Обновлять поле avatarUrl в User сущности',
        'GET /api/users/{id}/avatar — скачивать аватар',
        'При загрузке нового аватара удалять старый файл',
        'Возвращать 400 при невалидном файле с понятным сообщением'
      ],
      hint: 'Для удаления старого файла сохраняй текущее имя файла в User.avatarPath. Files.deleteIfExists() безопасно удаляет файл, даже если его нет.',
      expectedOutput: 'POST /api/users/1/avatar (файл: avatar.jpg, 512 KB, image/jpeg):\nHTTP 200 OK\n{"avatarUrl": "/api/users/1/avatar"}\n\nФайл сохранён как: uploads/avatars/f3a2b1c4-5d6e-7f8a-9b0c-1d2e3f4a5b6c.jpg\n\nGET /api/users/1/avatar:\nHTTP 200 OK\nContent-Type: image/jpeg\nContent-Length: 524288\n[бинарные данные изображения]\n\nPOST /api/users/1/avatar (новый файл):\nСтарый файл uploads/avatars/f3a2b1c4-...jpg удалён.\nНовый файл сохранён с новым UUID именем.\nHTTP 200 OK\n\nPOST /api/users/1/avatar (файл: document.pdf, image/pdf):\nHTTP 400 Bad Request\n{"error": "Только JPEG и PNG"}\n\nPOST /api/users/1/avatar (файл: large.jpg, 3 MB):\nHTTP 400 Bad Request\n{"error": "Максимум 2 МБ"}',
      solution: '@RestController @RequestMapping("/api/users")\npublic class AvatarController {\n    @Autowired UserService userService;\n    @Autowired FileStorageService fileService;\n\n    @PostMapping("/{id}/avatar")\n    public ResponseEntity<Map<String, String>> uploadAvatar(\n        @PathVariable Long id, @RequestParam("file") MultipartFile file) {\n        validateAvatar(file);\n        User user = userService.findById(id);\n        if (user.getAvatarPath() != null) {\n            fileService.delete(user.getAvatarPath());\n        }\n        String savedName = fileService.store(file, "avatars");\n        user.setAvatarPath(savedName);\n        user.setAvatarUrl("/api/users/" + id + "/avatar");\n        userService.save(user);\n        return ResponseEntity.ok(Map.of("avatarUrl", user.getAvatarUrl()));\n    }\n\n    @GetMapping("/{id}/avatar")\n    public ResponseEntity<Resource> getAvatar(@PathVariable Long id) {\n        User user = userService.findById(id);\n        Resource resource = fileService.loadAsResource("avatars/" + user.getAvatarPath());\n        return ResponseEntity.ok()\n            .contentType(MediaType.IMAGE_JPEG)\n            .body(resource);\n    }\n\n    private void validateAvatar(MultipartFile file) {\n        if (file.isEmpty()) throw new ValidationException("Файл пустой");\n        if (file.getSize() > 2 * 1024 * 1024) throw new ValidationException("Максимум 2 МБ");\n        Set<String> allowed = Set.of("image/jpeg", "image/png");\n        if (!allowed.contains(file.getContentType()))\n            throw new ValidationException("Только JPEG и PNG");\n    }\n}',
      explanation: 'Удаление старого файла перед загрузкой нового предотвращает накопление мусора. UUID-имена исключают коллизии и скрывают оригинальные имена файлов от пользователей.'
    }
  ]
}
