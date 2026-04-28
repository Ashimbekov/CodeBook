export default {
  id: 65,
  title: 'Практикум: Полный проект — Task Manager',
  description: 'Финальный практикум: построение полноценного Task Manager с нуля. Модели, CRUD, комментарии, файлы, уведомления, дашборд, поиск, администрирование и интеграционные тесты.',
  lessons: [
    {
      id: 1,
      title: 'Задача: Модели Project и Task',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создайте доменные модели для Project и Task со всеми необходимыми связями, статусами и приоритетами.',
      requirements: [
        'Entity Project: id, name, description, owner (User), members (ManyToMany), createdAt',
        'Entity Task: id, title, description, status (enum), priority (enum), assignee, project, dueDate',
        'Enum TaskStatus: TODO, IN_PROGRESS, IN_REVIEW, DONE, CANCELLED',
        'Enum TaskPriority: LOW, MEDIUM, HIGH, CRITICAL'
      ],
      expectedOutput: 'Project{id=1, name="Backend API", owner=User(1), members=[User(1),User(2)]}\nTask{id=1, title="Добавить авторизацию", status=IN_PROGRESS, priority=HIGH, assignee=User(2), project=Project(1)}\n\nТаблицы: projects, tasks, project_members (join table)',
      hint: 'Используйте @ManyToOne для связи Task→Project, @ManyToMany для Project→Users. @Enumerated(EnumType.STRING) для enum полей.',
      solution: `// --- Enums ---
public enum TaskStatus {
    TODO, IN_PROGRESS, IN_REVIEW, DONE, CANCELLED
}

public enum TaskPriority {
    LOW, MEDIUM, HIGH, CRITICAL
}

// --- Project Entity ---
@Entity
@Table(name = "projects")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Project {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 2000)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @ManyToMany
    @JoinTable(name = "project_members",
            joinColumns = @JoinColumn(name = "project_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id"))
    private Set<User> members = new HashSet<>();

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
    private List<Task> tasks = new ArrayList<>();

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}

// --- Task Entity ---
@Entity
@Table(name = "tasks")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Task {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 5000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskStatus status = TaskStatus.TODO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskPriority priority = TaskPriority.MEDIUM;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignee_id")
    private User assignee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_id", nullable = false)
    private User creator;

    private LocalDate dueDate;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @ElementCollection
    @CollectionTable(name = "task_tags", joinColumns = @JoinColumn(name = "task_id"))
    @Column(name = "tag")
    private Set<String> tags = new HashSet<>();
}

// --- User Entity ---
@Entity
@Table(name = "users")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class User implements UserDetails {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;
    private String firstName;
    private String lastName;

    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;

    @CreationTimestamp
    private LocalDateTime createdAt;

    private boolean active = true;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getUsername() { return email; }
    @Override
    public boolean isAccountNonExpired() { return true; }
    @Override
    public boolean isAccountNonLocked() { return true; }
    @Override
    public boolean isCredentialsNonExpired() { return true; }
    @Override
    public boolean isEnabled() { return active; }

    public String getFullName() { return firstName + " " + lastName; }
}

public enum Role { USER, ADMIN }`,
      explanation: 'Project содержит owner (создатель) и members (участники) через ManyToMany. Task связан с Project, assignee (исполнитель) и creator через ManyToOne. Enum-ы TaskStatus и TaskPriority хранятся как строки (@Enumerated(STRING)). @CreationTimestamp и @UpdateTimestamp автоматически заполняются Hibernate. tags через @ElementCollection хранятся в отдельной таблице.'
    },
    {
      id: 2,
      title: 'Задача: Task CRUD с валидацией',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реализуйте полный CRUD для задач с валидацией входных данных и контролем переходов статусов.',
      requirements: [
        'POST /api/projects/{projectId}/tasks — создание задачи',
        'GET /api/tasks/{id} — получение с деталями (assignee, project, comments count)',
        'PUT /api/tasks/{id} — обновление с валидацией перехода статусов',
        'DELETE /api/tasks/{id} — soft delete (status=CANCELLED)'
      ],
      expectedOutput: 'POST /api/projects/1/tasks { "title":"Fix bug", "priority":"HIGH" }\n→ 201 { "id":1, "title":"Fix bug", "status":"TODO", "priority":"HIGH" }\n\nPUT /api/tasks/1 { "status":"IN_PROGRESS" } → 200 OK\nPUT /api/tasks/1 { "status":"DONE" } → 400 "Нельзя перейти из IN_PROGRESS в DONE. Допустимые: IN_REVIEW"\n\nDELETE /api/tasks/1 → 200 { "status":"CANCELLED" }',
      hint: 'Создайте Map<TaskStatus, Set<TaskStatus>> для допустимых переходов. @Valid на DTO автоматически валидирует поля.',
      solution: `// --- Status Transition Validator ---
@Component
public class TaskStatusValidator {

    private static final Map<TaskStatus, Set<TaskStatus>> ALLOWED_TRANSITIONS = Map.of(
            TaskStatus.TODO, Set.of(TaskStatus.IN_PROGRESS, TaskStatus.CANCELLED),
            TaskStatus.IN_PROGRESS, Set.of(TaskStatus.IN_REVIEW, TaskStatus.TODO, TaskStatus.CANCELLED),
            TaskStatus.IN_REVIEW, Set.of(TaskStatus.DONE, TaskStatus.IN_PROGRESS, TaskStatus.CANCELLED),
            TaskStatus.DONE, Set.of(TaskStatus.TODO),
            TaskStatus.CANCELLED, Set.of(TaskStatus.TODO)
    );

    public void validateTransition(TaskStatus from, TaskStatus to) {
        Set<TaskStatus> allowed = ALLOWED_TRANSITIONS.getOrDefault(from, Set.of());
        if (!allowed.contains(to)) {
            throw new BadRequestException(
                    "Нельзя перейти из " + from + " в " + to +
                    ". Допустимые: " + allowed);
        }
    }
}

// --- DTOs ---
@Data
public class TaskCreateDto {
    @NotBlank @Size(min = 3, max = 200)
    private String title;
    @Size(max = 5000)
    private String description;
    private TaskPriority priority = TaskPriority.MEDIUM;
    private Long assigneeId;
    private LocalDate dueDate;
    private Set<String> tags;
}

@Data
public class TaskUpdateDto {
    @Size(min = 3, max = 200)
    private String title;
    @Size(max = 5000)
    private String description;
    private TaskStatus status;
    private TaskPriority priority;
    private Long assigneeId;
    private LocalDate dueDate;
    private Set<String> tags;
}

// --- TaskService ---
@Service
@RequiredArgsConstructor
@Transactional
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final TaskStatusValidator statusValidator;
    private final ApplicationEventPublisher eventPublisher;

    public TaskDto create(Long projectId, TaskCreateDto dto, User creator) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new NotFoundException("Проект не найден"));

        Task task = Task.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .status(TaskStatus.TODO)
                .priority(dto.getPriority())
                .project(project)
                .creator(creator)
                .dueDate(dto.getDueDate())
                .tags(dto.getTags() != null ? dto.getTags() : Set.of())
                .build();

        if (dto.getAssigneeId() != null) {
            User assignee = userRepository.findById(dto.getAssigneeId())
                    .orElseThrow(() -> new NotFoundException("Пользователь не найден"));
            task.setAssignee(assignee);
        }

        task = taskRepository.save(task);
        eventPublisher.publishEvent(new TaskCreatedEvent(task));
        return TaskDto.fromEntity(task);
    }

    public TaskDto update(Long taskId, TaskUpdateDto dto, User currentUser) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new NotFoundException("Задача не найдена"));

        if (dto.getStatus() != null && dto.getStatus() != task.getStatus()) {
            statusValidator.validateTransition(task.getStatus(), dto.getStatus());
            task.setStatus(dto.getStatus());
        }

        if (dto.getTitle() != null) task.setTitle(dto.getTitle());
        if (dto.getDescription() != null) task.setDescription(dto.getDescription());
        if (dto.getPriority() != null) task.setPriority(dto.getPriority());
        if (dto.getDueDate() != null) task.setDueDate(dto.getDueDate());
        if (dto.getTags() != null) task.setTags(dto.getTags());

        if (dto.getAssigneeId() != null) {
            User assignee = userRepository.findById(dto.getAssigneeId()).orElseThrow();
            task.setAssignee(assignee);
            eventPublisher.publishEvent(new TaskAssignedEvent(task, assignee));
        }

        return TaskDto.fromEntity(taskRepository.save(task));
    }

    public void delete(Long taskId) {
        Task task = taskRepository.findById(taskId).orElseThrow();
        task.setStatus(TaskStatus.CANCELLED);
        taskRepository.save(task);
    }
}

// --- Controller ---
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping("/projects/{projectId}/tasks")
    public ResponseEntity<TaskDto> create(@PathVariable Long projectId,
                                           @Valid @RequestBody TaskCreateDto dto,
                                           @AuthenticationPrincipal User user) {
        return ResponseEntity.status(201).body(taskService.create(projectId, dto, user));
    }

    @PutMapping("/tasks/{id}")
    public ResponseEntity<TaskDto> update(@PathVariable Long id,
                                           @Valid @RequestBody TaskUpdateDto dto,
                                           @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(taskService.update(id, dto, user));
    }

    @DeleteMapping("/tasks/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        taskService.delete(id);
        return ResponseEntity.noContent().build();
    }
}`,
      explanation: 'CRUD операции с валидацией: @Valid проверяет DTO, TaskStatusValidator контролирует допустимые переходы статусов. Soft delete изменяет статус на CANCELLED вместо физического удаления. ApplicationEventPublisher публикует доменные события (TaskCreated, TaskAssigned) для уведомлений. @Transactional обеспечивает атомарность.'
    },
    {
      id: 3,
      title: 'Задача: Управление исполнителями',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реализуйте назначение и снятие исполнителей с задач, включая историю назначений.',
      requirements: [
        'POST /api/tasks/{id}/assign — назначить исполнителя',
        'POST /api/tasks/{id}/unassign — снять исполнителя',
        'Entity TaskAssignmentHistory: taskId, assigneeId, assignedBy, assignedAt, unassignedAt',
        'GET /api/tasks/{id}/assignments — история назначений задачи'
      ],
      expectedOutput: 'POST /api/tasks/1/assign { "userId": 42 }\n→ 200 { "taskId":1, "assignee":{ "id":42, "name":"Иван Петров" } }\n\nPOST /api/tasks/1/unassign\n→ 200 { "taskId":1, "assignee":null }\n\nGET /api/tasks/1/assignments\n→ [ { "assignee":"Иван", "assignedBy":"Админ", "assignedAt":"...", "unassignedAt":"..." } ]',
      hint: 'При каждом назначении создавайте запись в TaskAssignmentHistory. При снятии обновляйте unassignedAt у текущего назначения.',
      solution: `// --- TaskAssignmentHistory Entity ---
@Entity
@Table(name = "task_assignment_history")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class TaskAssignmentHistory {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id")
    private Task task;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignee_id")
    private User assignee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_by_id")
    private User assignedBy;

    private LocalDateTime assignedAt;
    private LocalDateTime unassignedAt;
}

// --- AssignmentService ---
@Service
@RequiredArgsConstructor
@Transactional
public class AssignmentService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final TaskAssignmentHistoryRepository historyRepository;
    private final ApplicationEventPublisher eventPublisher;

    public TaskDto assignTask(Long taskId, Long userId, User currentUser) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new NotFoundException("Задача не найдена"));
        User assignee = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Пользователь не найден"));

        // Закрываем предыдущее назначение
        if (task.getAssignee() != null) {
            closeCurrentAssignment(task);
        }

        task.setAssignee(assignee);
        taskRepository.save(task);

        // Создаём запись истории
        historyRepository.save(TaskAssignmentHistory.builder()
                .task(task)
                .assignee(assignee)
                .assignedBy(currentUser)
                .assignedAt(LocalDateTime.now())
                .build());

        eventPublisher.publishEvent(new TaskAssignedEvent(task, assignee, currentUser));
        return TaskDto.fromEntity(task);
    }

    public TaskDto unassignTask(Long taskId, User currentUser) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new NotFoundException("Задача не найдена"));

        if (task.getAssignee() == null) {
            throw new BadRequestException("Задача не назначена");
        }

        closeCurrentAssignment(task);
        task.setAssignee(null);
        taskRepository.save(task);

        return TaskDto.fromEntity(task);
    }

    public List<AssignmentHistoryDto> getHistory(Long taskId) {
        return historyRepository.findByTaskIdOrderByAssignedAtDesc(taskId).stream()
                .map(AssignmentHistoryDto::fromEntity)
                .collect(Collectors.toList());
    }

    private void closeCurrentAssignment(Task task) {
        historyRepository.findByTaskIdAndUnassignedAtIsNull(task.getId())
                .ifPresent(history -> {
                    history.setUnassignedAt(LocalDateTime.now());
                    historyRepository.save(history);
                });
    }
}

// --- Controller ---
@RestController
@RequestMapping("/api/tasks/{taskId}")
@RequiredArgsConstructor
public class AssignmentController {

    private final AssignmentService assignmentService;

    @PostMapping("/assign")
    public ResponseEntity<TaskDto> assign(@PathVariable Long taskId,
                                           @RequestBody AssignRequest request,
                                           @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(assignmentService.assignTask(taskId, request.getUserId(), currentUser));
    }

    @PostMapping("/unassign")
    public ResponseEntity<TaskDto> unassign(@PathVariable Long taskId,
                                             @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(assignmentService.unassignTask(taskId, currentUser));
    }

    @GetMapping("/assignments")
    public ResponseEntity<List<AssignmentHistoryDto>> history(@PathVariable Long taskId) {
        return ResponseEntity.ok(assignmentService.getHistory(taskId));
    }
}`,
      explanation: 'При каждом назначении создаётся запись в истории с assignedBy (кто назначил). При переназначении предыдущая запись закрывается (unassignedAt). Это позволяет отслеживать кто, когда и кем был назначен. Событие TaskAssignedEvent позволяет отправить уведомление исполнителю.'
    },
    {
      id: 4,
      title: 'Задача: Система комментариев',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте систему комментариев к задачам с поддержкой вложенных ответов и пагинации.',
      requirements: [
        'Entity TaskComment: id, content, author, task, parentComment (self-referencing), createdAt',
        'POST /api/tasks/{id}/comments — добавление комментария',
        'POST /api/tasks/{id}/comments/{commentId}/replies — ответ на комментарий',
        'GET /api/tasks/{id}/comments — пагинированный список с вложенными ответами'
      ],
      expectedOutput: 'POST /api/tasks/1/comments { "content":"Нужно добавить валидацию" }\n→ 201 { "id":1, "content":"Нужно добавить валидацию", "author":"Иван" }\n\nPOST /api/tasks/1/comments/1/replies { "content":"Согласен, @Valid на DTO" }\n→ 201 { "id":2, "content":"Согласен...", "parentId":1 }\n\nGET /api/tasks/1/comments?page=0&size=20\n→ [{ "id":1, "content":"Нужно...", "replies":[{ "id":2, "content":"Согласен..." }] }]',
      hint: 'Используйте self-referencing @ManyToOne для parentComment. Загружайте только корневые комментарии (parent=null) с replies через fetch join или подзапрос.',
      solution: `// --- TaskComment Entity ---
@Entity
@Table(name = "task_comments")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class TaskComment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 2000)
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private TaskComment parent;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL)
    @OrderBy("createdAt ASC")
    private List<TaskComment> replies = new ArrayList<>();

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}

// --- Repository ---
public interface TaskCommentRepository extends JpaRepository<TaskComment, Long> {

    @Query("SELECT c FROM TaskComment c LEFT JOIN FETCH c.replies WHERE c.task.id = :taskId AND c.parent IS NULL ORDER BY c.createdAt DESC")
    Page<TaskComment> findRootCommentsByTaskId(@Param("taskId") Long taskId, Pageable pageable);

    long countByTaskId(Long taskId);
}

// --- CommentService ---
@Service
@RequiredArgsConstructor
@Transactional
public class CommentService {

    private final TaskCommentRepository commentRepository;
    private final TaskRepository taskRepository;
    private final ApplicationEventPublisher eventPublisher;

    public CommentDto addComment(Long taskId, String content, User author) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new NotFoundException("Задача не найдена"));

        TaskComment comment = TaskComment.builder()
                .content(content)
                .author(author)
                .task(task)
                .build();

        comment = commentRepository.save(comment);
        eventPublisher.publishEvent(new CommentAddedEvent(comment));
        return CommentDto.fromEntity(comment);
    }

    public CommentDto addReply(Long taskId, Long parentId, String content, User author) {
        Task task = taskRepository.findById(taskId).orElseThrow();
        TaskComment parent = commentRepository.findById(parentId)
                .orElseThrow(() -> new NotFoundException("Комментарий не найден"));

        if (!parent.getTask().getId().equals(taskId)) {
            throw new BadRequestException("Комментарий не принадлежит этой задаче");
        }

        // Ограничиваем глубину вложенности
        if (parent.getParent() != null) {
            throw new BadRequestException("Максимальная глубина вложенности — 1 уровень");
        }

        TaskComment reply = TaskComment.builder()
                .content(content)
                .author(author)
                .task(task)
                .parent(parent)
                .build();

        return CommentDto.fromEntity(commentRepository.save(reply));
    }

    public Page<CommentDto> getComments(Long taskId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return commentRepository.findRootCommentsByTaskId(taskId, pageable)
                .map(CommentDto::fromEntity);
    }

    public void deleteComment(Long commentId, User currentUser) {
        TaskComment comment = commentRepository.findById(commentId).orElseThrow();
        if (!comment.getAuthor().getId().equals(currentUser.getId())
                && currentUser.getRole() != Role.ADMIN) {
            throw new ForbiddenException("Можно удалять только свои комментарии");
        }
        commentRepository.delete(comment);
    }
}

// --- Controller ---
@RestController
@RequestMapping("/api/tasks/{taskId}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<CommentDto> addComment(
            @PathVariable Long taskId,
            @Valid @RequestBody CommentCreateDto dto,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.status(201)
                .body(commentService.addComment(taskId, dto.getContent(), user));
    }

    @PostMapping("/{commentId}/replies")
    public ResponseEntity<CommentDto> addReply(
            @PathVariable Long taskId,
            @PathVariable Long commentId,
            @Valid @RequestBody CommentCreateDto dto,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.status(201)
                .body(commentService.addReply(taskId, commentId, dto.getContent(), user));
    }

    @GetMapping
    public ResponseEntity<Page<CommentDto>> getComments(
            @PathVariable Long taskId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(commentService.getComments(taskId, page, size));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> delete(@PathVariable Long taskId,
                                        @PathVariable Long commentId,
                                        @AuthenticationPrincipal User user) {
        commentService.deleteComment(commentId, user);
        return ResponseEntity.noContent().build();
    }
}`,
      explanation: 'Self-referencing @ManyToOne создаёт древовидную структуру комментариев. Корневые комментарии имеют parent=null. Replies загружаются через LEFT JOIN FETCH. Глубина ограничена одним уровнем для простоты. Удаление доступно автору и админу. CascadeType.ALL удаляет replies при удалении родительского комментария.'
    },
    {
      id: 5,
      title: 'Задача: Загрузка файлов-вложений',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте загрузку и скачивание файлов-вложений к задачам с хранением на файловой системе.',
      requirements: [
        'Entity TaskAttachment: id, fileName, fileType, fileSize, storagePath, task, uploadedBy',
        'POST /api/tasks/{id}/attachments — загрузка файла (MultipartFile)',
        'GET /api/tasks/{id}/attachments/{attachmentId}/download — скачивание файла',
        'Валидация: максимальный размер 10MB, допустимые типы (pdf, docx, png, jpg)'
      ],
      expectedOutput: 'POST /api/tasks/1/attachments (multipart: file=screenshot.png)\n→ 201 { "id":1, "fileName":"screenshot.png", "fileType":"image/png", "fileSize":245760 }\n\nGET /api/tasks/1/attachments\n→ [{ "id":1, "fileName":"screenshot.png", "fileSize":"240 KB" }]\n\nGET /api/tasks/1/attachments/1/download\n→ 200 (binary) Content-Disposition: attachment; filename="screenshot.png"',
      hint: 'Сохраняйте файл в директорию uploads/{taskId}/{uuid}_{fileName}. Используйте Files.copy(inputStream, targetPath). Для скачивания — InputStreamResource.',
      solution: `// --- TaskAttachment Entity ---
@Entity
@Table(name = "task_attachments")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class TaskAttachment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fileName;

    private String fileType;
    private long fileSize;
    private String storagePath;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id")
    private Task task;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by_id")
    private User uploadedBy;

    @CreationTimestamp
    private LocalDateTime uploadedAt;
}

// --- FileStorageService ---
@Service
@Slf4j
public class FileStorageService {

    @Value("\${file.upload-dir:./uploads}")
    private String uploadDir;

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
    private static final Set<String> ALLOWED_TYPES = Set.of(
            "application/pdf", "image/png", "image/jpeg",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document");

    @PostConstruct
    public void init() throws IOException {
        Files.createDirectories(Path.of(uploadDir));
    }

    public String store(MultipartFile file, Long taskId) throws IOException {
        validateFile(file);

        String uniqueName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path taskDir = Path.of(uploadDir, taskId.toString());
        Files.createDirectories(taskDir);
        Path targetPath = taskDir.resolve(uniqueName);

        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
        log.info("File stored: {}", targetPath);
        return targetPath.toString();
    }

    public Resource loadAsResource(String storagePath) {
        try {
            Path path = Path.of(storagePath);
            Resource resource = new UrlResource(path.toUri());
            if (resource.exists()) return resource;
            throw new NotFoundException("Файл не найден");
        } catch (MalformedURLException e) {
            throw new NotFoundException("Файл не найден: " + storagePath);
        }
    }

    public void delete(String storagePath) throws IOException {
        Files.deleteIfExists(Path.of(storagePath));
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new BadRequestException("Файл пуст");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new BadRequestException("Размер файла превышает 10 MB");
        }
        if (!ALLOWED_TYPES.contains(file.getContentType())) {
            throw new BadRequestException("Недопустимый тип файла: " + file.getContentType());
        }
    }
}

// --- AttachmentService ---
@Service
@RequiredArgsConstructor
@Transactional
public class AttachmentService {

    private final TaskAttachmentRepository attachmentRepository;
    private final TaskRepository taskRepository;
    private final FileStorageService fileStorageService;

    public AttachmentDto upload(Long taskId, MultipartFile file, User user) throws IOException {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new NotFoundException("Задача не найдена"));

        String storagePath = fileStorageService.store(file, taskId);

        TaskAttachment attachment = TaskAttachment.builder()
                .fileName(file.getOriginalFilename())
                .fileType(file.getContentType())
                .fileSize(file.getSize())
                .storagePath(storagePath)
                .task(task)
                .uploadedBy(user)
                .build();

        return AttachmentDto.fromEntity(attachmentRepository.save(attachment));
    }

    public Resource download(Long attachmentId) {
        TaskAttachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new NotFoundException("Вложение не найдено"));
        return fileStorageService.loadAsResource(attachment.getStoragePath());
    }
}

// --- Controller ---
@RestController
@RequestMapping("/api/tasks/{taskId}/attachments")
@RequiredArgsConstructor
public class AttachmentController {

    private final AttachmentService attachmentService;

    @PostMapping
    public ResponseEntity<AttachmentDto> upload(
            @PathVariable Long taskId,
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal User user) throws IOException {
        return ResponseEntity.status(201).body(attachmentService.upload(taskId, file, user));
    }

    @GetMapping("/{attachmentId}/download")
    public ResponseEntity<Resource> download(@PathVariable Long taskId,
                                              @PathVariable Long attachmentId) {
        Resource resource = attachmentService.download(attachmentId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\\"" + resource.getFilename() + "\\"")
                .body(resource);
    }
}`,
      explanation: 'Файлы хранятся на файловой системе в uploads/{taskId}/. Метаданные (имя, тип, размер, путь) хранятся в БД. Валидация проверяет размер (max 10MB) и тип файла (whitelist). UUID-префикс предотвращает конфликты имён. Resource оборачивает файл для скачивания через ResponseEntity с Content-Disposition header.'
    },
    {
      id: 6,
      title: 'Задача: Система уведомлений',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте систему уведомлений: email при назначении задачи, in-app уведомления и асинхронная отправка.',
      requirements: [
        '@EventListener для обработки доменных событий (TaskAssigned, CommentAdded)',
        '@Async отправка email-уведомлений без блокировки основного потока',
        'Entity Notification: id, userId, message, type, read, createdAt',
        'GET /api/notifications — список уведомлений, PUT /{id}/read — пометить прочитанным'
      ],
      expectedOutput: 'TaskAssignedEvent → \n  1. Email: "Вам назначена задача: Fix bug"\n  2. In-app: Notification{userId=42, message="Вам назначена задача: Fix bug", read=false}\n\nGET /api/notifications → [{ "id":1, "message":"Вам назначена...", "read":false, "createdAt":"..." }]\nPUT /api/notifications/1/read → 200 { "read":true }\n\nGET /api/notifications/unread-count → { "count": 5 }',
      hint: '@EventListener автоматически вызывается при publishEvent(). @Async на обработчике отправляет email в отдельном потоке. Создавайте Notification для in-app уведомлений.',
      solution: `// --- Notification Entity ---
@Entity
@Table(name = "notifications")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Notification {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private String message;

    @Enumerated(EnumType.STRING)
    private NotificationType type;

    private boolean read = false;

    @CreationTimestamp
    private LocalDateTime createdAt;

    private String link; // ссылка на связанный ресурс
}

public enum NotificationType {
    TASK_ASSIGNED, TASK_UNASSIGNED, COMMENT_ADDED, STATUS_CHANGED, MENTION
}

// --- Domain Events ---
@Data @AllArgsConstructor
public class TaskAssignedEvent {
    private Task task;
    private User assignee;
    private User assignedBy;
}

@Data @AllArgsConstructor
public class CommentAddedEvent {
    private TaskComment comment;
}

// --- Notification Service ---
@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final JavaMailSender mailSender;

    @Async
    @EventListener
    public void onTaskAssigned(TaskAssignedEvent event) {
        Task task = event.getTask();
        User assignee = event.getAssignee();

        // In-app уведомление
        Notification notification = Notification.builder()
                .user(assignee)
                .message("Вам назначена задача: " + task.getTitle())
                .type(NotificationType.TASK_ASSIGNED)
                .link("/tasks/" + task.getId())
                .build();
        notificationRepository.save(notification);

        // Email уведомление
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(assignee.getEmail());
            message.setSubject("Новая задача: " + task.getTitle());
            message.setText(String.format(
                    "Вам назначена задача \\"%s\\" в проекте \\"%s\\".\\n" +
                    "Приоритет: %s\\nНазначил: %s",
                    task.getTitle(), task.getProject().getName(),
                    task.getPriority(), event.getAssignedBy().getFullName()));
            mailSender.send(message);
            log.info("Email уведомление отправлено: {}", assignee.getEmail());
        } catch (Exception e) {
            log.error("Ошибка отправки email: {}", e.getMessage());
        }
    }

    @Async
    @EventListener
    public void onCommentAdded(CommentAddedEvent event) {
        TaskComment comment = event.getComment();
        Task task = comment.getTask();

        // Уведомить assignee и creator (кроме автора комментария)
        Set<User> recipients = new HashSet<>();
        if (task.getAssignee() != null) recipients.add(task.getAssignee());
        recipients.add(task.getCreator());
        recipients.remove(comment.getAuthor());

        for (User recipient : recipients) {
            notificationRepository.save(Notification.builder()
                    .user(recipient)
                    .message(comment.getAuthor().getFullName() +
                            " прокомментировал задачу: " + task.getTitle())
                    .type(NotificationType.COMMENT_ADDED)
                    .link("/tasks/" + task.getId())
                    .build());
        }
    }

    public Page<NotificationDto> getUserNotifications(Long userId, Pageable pageable) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(NotificationDto::fromEntity);
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    @Transactional
    public void markAsRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new NotFoundException("Уведомление не найдено"));
        if (!notification.getUser().getId().equals(userId)) {
            throw new ForbiddenException("Нет доступа");
        }
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        notificationRepository.markAllAsReadByUserId(userId);
    }
}

// --- Controller ---
@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<Page<NotificationDto>> list(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(notificationService
                .getUserNotifications(user.getId(), PageRequest.of(page, size)));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> unreadCount(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(Map.of("count", notificationService.getUnreadCount(user.getId())));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id,
                                            @AuthenticationPrincipal User user) {
        notificationService.markAsRead(id, user.getId());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(@AuthenticationPrincipal User user) {
        notificationService.markAllAsRead(user.getId());
        return ResponseEntity.ok().build();
    }
}`,
      explanation: '@EventListener автоматически вызывается при публикации доменного события. @Async выполняет обработчик в отдельном потоке — основной поток не ждёт отправки email. In-app уведомления хранятся в БД с типом и ссылкой. Уведомления отправляются assignee и creator, но не автору действия. markAllAsRead использует bulk UPDATE запрос.'
    },
    {
      id: 7,
      title: 'Задача: Dashboard API',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте API для дашборда: статистика задач по статусам, приоритетам, просроченные, нагрузка пользователей.',
      requirements: [
        'GET /api/dashboard/stats — общая статистика: задачи по статусам и приоритетам',
        'GET /api/dashboard/overdue — просроченные задачи (dueDate < today и status != DONE)',
        'GET /api/dashboard/workload — нагрузка на каждого пользователя',
        'GET /api/dashboard/activity — последние действия (создание, изменение статуса)'
      ],
      expectedOutput: 'GET /api/dashboard/stats → {\n  "total": 150,\n  "byStatus": { "TODO":45, "IN_PROGRESS":30, "IN_REVIEW":15, "DONE":60 },\n  "byPriority": { "LOW":20, "MEDIUM":50, "HIGH":60, "CRITICAL":20 },\n  "completedThisWeek": 12,\n  "overdue": 8\n}\n\nGET /api/dashboard/workload → [\n  { "user":"Иван", "assigned":12, "inProgress":5, "completed":30 },\n  { "user":"Мария", "assigned":8, "inProgress":3, "completed":25 }\n]',
      hint: 'Используйте JPQL с GROUP BY для агрегации. Для overdue: WHERE dueDate < CURRENT_DATE AND status NOT IN (DONE, CANCELLED).',
      solution: `// --- Dashboard DTOs ---
@Data @Builder
public class DashboardStats {
    private long total;
    private Map<String, Long> byStatus;
    private Map<String, Long> byPriority;
    private long completedThisWeek;
    private long overdue;
    private long createdToday;
}

@Data @Builder
public class UserWorkload {
    private Long userId;
    private String userName;
    private long assigned;
    private long inProgress;
    private long completedThisMonth;
}

// --- Repository methods ---
public interface TaskRepository extends JpaRepository<Task, Long> {

    @Query("SELECT t.status, COUNT(t) FROM Task t WHERE t.project.id = :projectId GROUP BY t.status")
    List<Object[]> countByStatusForProject(@Param("projectId") Long projectId);

    @Query("SELECT t.priority, COUNT(t) FROM Task t WHERE t.project.id = :projectId GROUP BY t.priority")
    List<Object[]> countByPriorityForProject(@Param("projectId") Long projectId);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.status = 'DONE' AND t.updatedAt >= :since")
    long countCompletedSince(@Param("since") LocalDateTime since);

    @Query("SELECT t FROM Task t WHERE t.dueDate < CURRENT_DATE AND t.status NOT IN ('DONE', 'CANCELLED') ORDER BY t.dueDate ASC")
    List<Task> findOverdueTasks();

    @Query("""
            SELECT t.assignee.id, t.assignee.firstName, t.assignee.lastName,
                   COUNT(t),
                   SUM(CASE WHEN t.status = 'IN_PROGRESS' THEN 1 ELSE 0 END),
                   SUM(CASE WHEN t.status = 'DONE' AND t.updatedAt >= :since THEN 1 ELSE 0 END)
            FROM Task t
            WHERE t.assignee IS NOT NULL
            GROUP BY t.assignee.id, t.assignee.firstName, t.assignee.lastName
            ORDER BY COUNT(t) DESC
            """)
    List<Object[]> getUserWorkload(@Param("since") LocalDateTime since);

    long countByCreatedAtAfter(LocalDateTime since);
}

// --- DashboardService ---
@Service
@RequiredArgsConstructor
public class DashboardService {

    private final TaskRepository taskRepository;

    public DashboardStats getStats(Long projectId) {
        Map<String, Long> byStatus = taskRepository.countByStatusForProject(projectId).stream()
                .collect(Collectors.toMap(
                        row -> ((TaskStatus) row[0]).name(),
                        row -> (Long) row[1]));

        Map<String, Long> byPriority = taskRepository.countByPriorityForProject(projectId).stream()
                .collect(Collectors.toMap(
                        row -> ((TaskPriority) row[0]).name(),
                        row -> (Long) row[1]));

        LocalDateTime weekAgo = LocalDateTime.now().minusWeeks(1);
        LocalDateTime todayStart = LocalDate.now().atStartOfDay();

        return DashboardStats.builder()
                .total(byStatus.values().stream().mapToLong(Long::longValue).sum())
                .byStatus(byStatus)
                .byPriority(byPriority)
                .completedThisWeek(taskRepository.countCompletedSince(weekAgo))
                .overdue(taskRepository.findOverdueTasks().size())
                .createdToday(taskRepository.countByCreatedAtAfter(todayStart))
                .build();
    }

    public List<UserWorkload> getWorkload() {
        LocalDateTime monthAgo = LocalDateTime.now().minusMonths(1);
        return taskRepository.getUserWorkload(monthAgo).stream()
                .map(row -> UserWorkload.builder()
                        .userId(((Number) row[0]).longValue())
                        .userName(row[1] + " " + row[2])
                        .assigned(((Number) row[3]).longValue())
                        .inProgress(((Number) row[4]).longValue())
                        .completedThisMonth(((Number) row[5]).longValue())
                        .build())
                .collect(Collectors.toList());
    }

    public List<TaskDto> getOverdueTasks() {
        return taskRepository.findOverdueTasks().stream()
                .map(TaskDto::fromEntity)
                .collect(Collectors.toList());
    }
}

// --- Controller ---
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStats> stats(@RequestParam Long projectId) {
        return ResponseEntity.ok(dashboardService.getStats(projectId));
    }

    @GetMapping("/overdue")
    public ResponseEntity<List<TaskDto>> overdue() {
        return ResponseEntity.ok(dashboardService.getOverdueTasks());
    }

    @GetMapping("/workload")
    public ResponseEntity<List<UserWorkload>> workload() {
        return ResponseEntity.ok(dashboardService.getWorkload());
    }
}`,
      explanation: 'Dashboard API агрегирует данные через JPQL GROUP BY запросы. byStatus/byPriority считают задачи по категориям. Overdue — задачи с dueDate в прошлом и незавершённым статусом. Workload показывает нагрузку на каждого пользователя: назначенные, в работе, завершённые за месяц. CASE WHEN в JPQL позволяет считать условные агрегаты в одном запросе.'
    },
    {
      id: 8,
      title: 'Задача: Поиск и фильтрация задач',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте комплексный поиск задач с фильтрацией по статусу, приоритету, исполнителю, дате и текстовому поиску.',
      requirements: [
        'JPA Specification для динамической фильтрации по всем полям',
        'Текстовый поиск по title и description (LIKE или fulltext)',
        'Фильтрация по диапазону дат (createdAt, dueDate)',
        'Комбинирование всех фильтров: GET /api/tasks?status=IN_PROGRESS&priority=HIGH&assignee=42&q=bug&dueBefore=2024-04-01'
      ],
      expectedOutput: 'GET /api/tasks?status=IN_PROGRESS&priority=HIGH&assigneeId=42\n→ [задачи IN_PROGRESS + HIGH приоритета + назначены User#42]\n\nGET /api/tasks?q=авторизация&status=TODO&dueBefore=2024-04-01\n→ [задачи с "авторизация" в title/description, TODO, до 1 апреля]\n\nGET /api/tasks?projectId=1&tags=bug,urgent\n→ [задачи проекта #1 с тегами "bug" ИЛИ "urgent"]',
      hint: 'Создайте TaskSpecification с методами для каждого фильтра. Комбинируйте через Specification.where().and(). Null-safe: если параметр null, не применяйте фильтр.',
      solution: `// --- TaskFilter DTO ---
@Data @Builder
public class TaskFilter {
    private Long projectId;
    private TaskStatus status;
    private TaskPriority priority;
    private Long assigneeId;
    private Long creatorId;
    private String query; // текстовый поиск
    private LocalDate dueBefore;
    private LocalDate dueAfter;
    private LocalDateTime createdAfter;
    private LocalDateTime createdBefore;
    private Set<String> tags;
    private Boolean overdue;
}

// --- TaskSpecification ---
public class TaskSpecification {

    public static Specification<Task> withFilter(TaskFilter filter) {
        return Specification
                .where(byProject(filter.getProjectId()))
                .and(byStatus(filter.getStatus()))
                .and(byPriority(filter.getPriority()))
                .and(byAssignee(filter.getAssigneeId()))
                .and(byCreator(filter.getCreatorId()))
                .and(byTextSearch(filter.getQuery()))
                .and(byDueDateBefore(filter.getDueBefore()))
                .and(byDueDateAfter(filter.getDueAfter()))
                .and(byCreatedAfter(filter.getCreatedAfter()))
                .and(byCreatedBefore(filter.getCreatedBefore()))
                .and(byTags(filter.getTags()))
                .and(byOverdue(filter.getOverdue()));
    }

    private static Specification<Task> byProject(Long projectId) {
        if (projectId == null) return null;
        return (root, query, cb) -> cb.equal(root.get("project").get("id"), projectId);
    }

    private static Specification<Task> byStatus(TaskStatus status) {
        if (status == null) return null;
        return (root, query, cb) -> cb.equal(root.get("status"), status);
    }

    private static Specification<Task> byPriority(TaskPriority priority) {
        if (priority == null) return null;
        return (root, query, cb) -> cb.equal(root.get("priority"), priority);
    }

    private static Specification<Task> byAssignee(Long assigneeId) {
        if (assigneeId == null) return null;
        return (root, query, cb) -> cb.equal(root.get("assignee").get("id"), assigneeId);
    }

    private static Specification<Task> byCreator(Long creatorId) {
        if (creatorId == null) return null;
        return (root, query, cb) -> cb.equal(root.get("creator").get("id"), creatorId);
    }

    private static Specification<Task> byTextSearch(String searchQuery) {
        if (searchQuery == null || searchQuery.isBlank()) return null;
        return (root, query, cb) -> {
            String pattern = "%" + searchQuery.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("title")), pattern),
                    cb.like(cb.lower(root.get("description")), pattern));
        };
    }

    private static Specification<Task> byDueDateBefore(LocalDate date) {
        if (date == null) return null;
        return (root, query, cb) -> cb.lessThanOrEqualTo(root.get("dueDate"), date);
    }

    private static Specification<Task> byDueDateAfter(LocalDate date) {
        if (date == null) return null;
        return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("dueDate"), date);
    }

    private static Specification<Task> byCreatedAfter(LocalDateTime dateTime) {
        if (dateTime == null) return null;
        return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("createdAt"), dateTime);
    }

    private static Specification<Task> byCreatedBefore(LocalDateTime dateTime) {
        if (dateTime == null) return null;
        return (root, query, cb) -> cb.lessThanOrEqualTo(root.get("createdAt"), dateTime);
    }

    private static Specification<Task> byTags(Set<String> tags) {
        if (tags == null || tags.isEmpty()) return null;
        return (root, query, cb) -> root.join("tags").in(tags);
    }

    private static Specification<Task> byOverdue(Boolean overdue) {
        if (overdue == null || !overdue) return null;
        return (root, query, cb) -> cb.and(
                cb.lessThan(root.get("dueDate"), LocalDate.now()),
                cb.notEqual(root.get("status"), TaskStatus.DONE),
                cb.notEqual(root.get("status"), TaskStatus.CANCELLED));
    }
}

// --- Controller ---
@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskSearchController {

    private final TaskRepository taskRepository;

    @GetMapping
    public ResponseEntity<Page<TaskDto>> search(
            @RequestParam(required = false) Long projectId,
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) TaskPriority priority,
            @RequestParam(required = false) Long assigneeId,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dueBefore,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dueAfter,
            @RequestParam(required = false) Set<String> tags,
            @RequestParam(required = false) Boolean overdue,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort) {

        TaskFilter filter = TaskFilter.builder()
                .projectId(projectId).status(status).priority(priority)
                .assigneeId(assigneeId).query(q)
                .dueBefore(dueBefore).dueAfter(dueAfter)
                .tags(tags).overdue(overdue).build();

        Specification<Task> spec = TaskSpecification.withFilter(filter);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        return ResponseEntity.ok(taskRepository.findAll(spec, pageable).map(TaskDto::fromEntity));
    }
}`,
      explanation: 'TaskSpecification комбинирует все фильтры через Specification.where().and(). Каждый метод возвращает null если параметр не передан — null спецификации игнорируются. Текстовый поиск использует LIKE по title и description. byOverdue фильтрует задачи с просроченным дедлайном. byTags использует JOIN с коллекцией тегов.'
    },
    {
      id: 9,
      title: 'Задача: Admin panel API',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте API для административной панели: управление пользователями, настройки проекта и аудит лог.',
      requirements: [
        'CRUD пользователей: создание, деактивация, смена роли (только ADMIN)',
        'Настройки проекта: переименование, архивация, управление участниками',
        'Audit Log: запись всех административных действий',
        'GET /api/admin/audit-log — история действий с фильтрацией'
      ],
      expectedOutput: 'PUT /api/admin/users/42/role { "role":"ADMIN" }\n→ 200 { "id":42, "role":"ADMIN" }\n\nPUT /api/admin/users/42/deactivate → 200 { "active":false }\n\nGET /api/admin/audit-log?action=ROLE_CHANGED&userId=42\n→ [{ "action":"ROLE_CHANGED", "targetUser":"user@test.com", "details":"USER→ADMIN", "performedBy":"admin", "timestamp":"..." }]',
      hint: 'Используйте AOP (@Around или @AfterReturning) для автоматического логирования административных действий. Или Spring Events.',
      solution: `// --- AuditLog Entity ---
@Entity
@Table(name = "audit_logs")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AuditLog {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String action;

    private String entityType;
    private Long entityId;

    @Column(length = 2000)
    private String details;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "performed_by_id")
    private User performedBy;

    private String ipAddress;

    @CreationTimestamp
    private LocalDateTime timestamp;
}

// --- Audit annotation ---
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Audited {
    String action();
    String entityType() default "";
}

// --- Audit AOP ---
@Aspect
@Component
@RequiredArgsConstructor
@Slf4j
public class AuditAspect {

    private final AuditLogRepository auditLogRepository;
    private final HttpServletRequest request;

    @AfterReturning(pointcut = "@annotation(audited)", returning = "result")
    public void audit(JoinPoint joinPoint, Audited audited, Object result) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = auth != null ? (User) auth.getPrincipal() : null;

        String details = buildDetails(joinPoint);

        AuditLog log = AuditLog.builder()
                .action(audited.action())
                .entityType(audited.entityType())
                .details(details)
                .performedBy(currentUser)
                .ipAddress(request.getRemoteAddr())
                .build();

        auditLogRepository.save(log);
    }

    private String buildDetails(JoinPoint joinPoint) {
        Object[] args = joinPoint.getArgs();
        return Arrays.stream(args)
                .filter(a -> !(a instanceof HttpServletRequest))
                .map(Object::toString)
                .collect(Collectors.joining(", "));
    }
}

// --- Admin Service ---
@Service
@RequiredArgsConstructor
@Transactional
public class AdminService {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final AuditLogRepository auditLogRepository;

    @Audited(action = "ROLE_CHANGED", entityType = "User")
    public UserDto changeRole(Long userId, Role newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Пользователь не найден"));
        Role oldRole = user.getRole();
        user.setRole(newRole);
        userRepository.save(user);
        return UserDto.fromEntity(user);
    }

    @Audited(action = "USER_DEACTIVATED", entityType = "User")
    public UserDto deactivateUser(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        user.setActive(false);
        return UserDto.fromEntity(userRepository.save(user));
    }

    @Audited(action = "USER_ACTIVATED", entityType = "User")
    public UserDto activateUser(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        user.setActive(true);
        return UserDto.fromEntity(userRepository.save(user));
    }

    @Audited(action = "PROJECT_ARCHIVED", entityType = "Project")
    public void archiveProject(Long projectId) {
        Project project = projectRepository.findById(projectId).orElseThrow();
        project.setArchived(true);
        projectRepository.save(project);
    }

    public Page<AuditLogDto> getAuditLog(String action, Long userId,
                                           LocalDateTime from, LocalDateTime to,
                                           Pageable pageable) {
        Specification<AuditLog> spec = Specification
                .where(action != null ? (root, q, cb) -> cb.equal(root.get("action"), action) : null)
                .and(userId != null ? (root, q, cb) -> cb.equal(root.get("performedBy").get("id"), userId) : null)
                .and(from != null ? (root, q, cb) -> cb.greaterThanOrEqualTo(root.get("timestamp"), from) : null)
                .and(to != null ? (root, q, cb) -> cb.lessThanOrEqualTo(root.get("timestamp"), to) : null);

        return auditLogRepository.findAll(spec, pageable).map(AuditLogDto::fromEntity);
    }
}

// --- Admin Controller ---
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @PutMapping("/users/{id}/role")
    public ResponseEntity<UserDto> changeRole(@PathVariable Long id,
                                               @RequestBody RoleChangeRequest request) {
        return ResponseEntity.ok(adminService.changeRole(id, request.getRole()));
    }

    @PutMapping("/users/{id}/deactivate")
    public ResponseEntity<UserDto> deactivate(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.deactivateUser(id));
    }

    @PutMapping("/users/{id}/activate")
    public ResponseEntity<UserDto> activate(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.activateUser(id));
    }

    @GetMapping("/audit-log")
    public ResponseEntity<Page<AuditLogDto>> auditLog(
            @RequestParam(required = false) String action,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        return ResponseEntity.ok(adminService.getAuditLog(action, userId, from, to,
                PageRequest.of(page, size, Sort.by("timestamp").descending())));
    }
}`,
      explanation: '@Audited кастомная аннотация + AOP аспект автоматически записывают все административные действия в audit log. @PreAuthorize("hasRole(ADMIN)") ограничивает доступ. Deactivate не удаляет пользователя, а отключает аккаунт. Audit log фильтруется через Specification по действию, пользователю и дате.'
    },
    {
      id: 10,
      title: 'Задача: Интеграционные тесты',
      type: 'practice',
      difficulty: 'hard',
      description: 'Напишите комплексные интеграционные тесты для Task Manager с TestContainers и MockMvc.',
      requirements: [
        'TestContainers для PostgreSQL и Redis в тестах',
        'MockMvc тесты для CRUD операций с аутентификацией',
        'Тест полного flow: регистрация → логин → создание проекта → создание задачи → назначение → комментарий',
        'Тесты ошибочных сценариев: невалидные данные, несуществующие ресурсы, нет доступа'
      ],
      expectedOutput: 'TaskManagerIntegrationTest:\n  ✓ shouldRegisterAndLogin (150ms)\n  ✓ shouldCreateProjectAndTask (200ms)\n  ✓ shouldAssignTaskAndNotify (180ms)\n  ✓ shouldFilterTasksByStatus (120ms)\n  ✓ shouldReturn404ForNonExistentTask (50ms)\n  ✓ shouldReturn403ForNonAdminAccess (60ms)\n  ✓ shouldValidateTaskStatusTransition (80ms)\n  ✓ fullWorkflowTest (500ms)\n\n8 tests passed, 0 failed',
      hint: 'Используйте @Testcontainers и @Container для PostgreSQL. @WithMockUser для тестов с аутентификацией. @Sql для подготовки данных.',
      solution: `// --- Test Configuration ---
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
@AutoConfigureMockMvc
@ActiveProfiles("test")
class TaskManagerIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15")
            .withDatabaseName("testdb")
            .withUsername("test")
            .withPassword("test");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private String adminToken;
    private String userToken;

    @BeforeEach
    void setUp() throws Exception {
        // Создаём тестовых пользователей
        User admin = userRepository.save(User.builder()
                .email("admin@test.com")
                .password(passwordEncoder.encode("admin123"))
                .firstName("Admin").lastName("User")
                .role(Role.ADMIN).active(true).build());

        User user = userRepository.save(User.builder()
                .email("user@test.com")
                .password(passwordEncoder.encode("user123"))
                .firstName("Regular").lastName("User")
                .role(Role.USER).active(true).build());

        adminToken = login("admin@test.com", "admin123");
        userToken = login("user@test.com", "user123");
    }

    private String login(String email, String password) throws Exception {
        String response = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(
                        Map.of("email", email, "password", password))))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        return objectMapper.readTree(response).get("token").asText();
    }

    @Test
    void shouldCreateProjectAndTask() throws Exception {
        // Создаём проект
        String projectJson = mockMvc.perform(post("/api/projects")
                .header("Authorization", "Bearer " + adminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\\"name\\":\\"Test Project\\",\\"description\\":\\"Description\\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Test Project"))
                .andReturn().getResponse().getContentAsString();

        Long projectId = objectMapper.readTree(projectJson).get("id").asLong();

        // Создаём задачу
        mockMvc.perform(post("/api/projects/" + projectId + "/tasks")
                .header("Authorization", "Bearer " + adminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\\"title\\":\\"Fix bug\\",\\"priority\\":\\"HIGH\\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("Fix bug"))
                .andExpect(jsonPath("$.status").value("TODO"))
                .andExpect(jsonPath("$.priority").value("HIGH"));
    }

    @Test
    void shouldValidateTaskStatusTransition() throws Exception {
        Long taskId = createTestTask();

        // TODO → IN_PROGRESS: OK
        mockMvc.perform(put("/api/tasks/" + taskId)
                .header("Authorization", "Bearer " + adminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\\"status\\":\\"IN_PROGRESS\\"}"))
                .andExpect(status().isOk());

        // IN_PROGRESS → DONE: NOT ALLOWED
        mockMvc.perform(put("/api/tasks/" + taskId)
                .header("Authorization", "Bearer " + adminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\\"status\\":\\"DONE\\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(
                        org.hamcrest.Matchers.containsString("Нельзя перейти")));
    }

    @Test
    void shouldReturn404ForNonExistentTask() throws Exception {
        mockMvc.perform(get("/api/tasks/99999")
                .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldReturn403ForNonAdminAccess() throws Exception {
        mockMvc.perform(get("/api/admin/users")
                .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isForbidden());
    }

    @Test
    void fullWorkflowTest() throws Exception {
        // 1. Создаём проект
        Long projectId = createTestProject();

        // 2. Создаём задачу
        Long taskId = createTestTask(projectId);

        // 3. Назначаем исполнителя
        User assignee = userRepository.findByEmail("user@test.com").orElseThrow();
        mockMvc.perform(post("/api/tasks/" + taskId + "/assign")
                .header("Authorization", "Bearer " + adminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\\"userId\\":" + assignee.getId() + "}"))
                .andExpect(status().isOk());

        // 4. Добавляем комментарий
        mockMvc.perform(post("/api/tasks/" + taskId + "/comments")
                .header("Authorization", "Bearer " + userToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\\"content\\":\\"Начал работу над задачей\\"}"))
                .andExpect(status().isCreated());

        // 5. Меняем статус
        mockMvc.perform(put("/api/tasks/" + taskId)
                .header("Authorization", "Bearer " + userToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\\"status\\":\\"IN_PROGRESS\\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("IN_PROGRESS"));

        // 6. Проверяем дашборд
        mockMvc.perform(get("/api/dashboard/stats?projectId=" + projectId)
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.total").value(1));
    }

    private Long createTestProject() throws Exception {
        String json = mockMvc.perform(post("/api/projects")
                .header("Authorization", "Bearer " + adminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\\"name\\":\\"Test Project\\"}"))
                .andReturn().getResponse().getContentAsString();
        return objectMapper.readTree(json).get("id").asLong();
    }

    private Long createTestTask() throws Exception {
        return createTestTask(createTestProject());
    }

    private Long createTestTask(Long projectId) throws Exception {
        String json = mockMvc.perform(post("/api/projects/" + projectId + "/tasks")
                .header("Authorization", "Bearer " + adminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\\"title\\":\\"Test Task\\",\\"priority\\":\\"MEDIUM\\"}"))
                .andReturn().getResponse().getContentAsString();
        return objectMapper.readTree(json).get("id").asLong();
    }
}`,
      explanation: 'TestContainers запускает реальную PostgreSQL в Docker для тестов. @DynamicPropertySource подставляет параметры подключения. MockMvc тестирует HTTP endpoints без запуска сервера. Тесты покрывают: CRUD операции, валидацию, права доступа (403), отсутствие ресурса (404) и полный workflow от создания до завершения задачи. @BeforeEach создаёт тестовых пользователей и получает JWT токены.'
    }
  ]
}
