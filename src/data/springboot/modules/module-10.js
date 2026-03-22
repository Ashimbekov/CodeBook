export default {
  id: 10,
  title: 'JPA связи между сущностями',
  description: 'Связи между Entity: @OneToMany, @ManyToOne, @ManyToMany, @OneToOne, управление ленивой загрузкой',
  lessons: [
    {
      id: 1,
      title: 'Типы связей в JPA',
      type: 'theory',
      content: [
        { type: 'text', value: 'Реляционные базы данных строятся на связях между таблицами. JPA отражает эти связи между Entity классами через аннотации.' },
        { type: 'heading', value: 'Четыре типа связей' },
        { type: 'list', items: [
          '@OneToOne — один к одному. Пользователь и его профиль',
          '@OneToMany — один ко многим. Пользователь и его заказы',
          '@ManyToOne — многие к одному. Заказ и пользователь (обратная сторона OneToMany)',
          '@ManyToMany — многие ко многим. Студент и курсы'
        ]},
        { type: 'code', language: 'java', value: '// Пример отношений в интернет-магазине:\n// User (1) ----< Order (много)      : OneToMany/ManyToOne\n// Order (1) ----< OrderItem (много) : OneToMany/ManyToOne\n// Product (много) >----< Tag (много): ManyToMany\n// User (1) ---- UserProfile (1)     : OneToOne' },
        { type: 'tip', value: 'Всегда думай о связях с обеих сторон. @ManyToOne и @OneToMany — это одна и та же связь, просто смотришь с разных Entity. Определи "владельца" связи — сторону с внешним ключом.' }
      ]
    },
    {
      id: 2,
      title: '@ManyToOne и @OneToMany',
      type: 'theory',
      content: [
        { type: 'text', value: 'Самая частая связь в реальных приложениях. Пример: у одного пользователя много заказов.' },
        { type: 'code', language: 'java', value: '// "Многие" сторона — Order (хранит внешний ключ)\n@Entity\n@Table(name = "orders")\npublic class Order {\n    @Id\n    @GeneratedValue(strategy = GenerationType.IDENTITY)\n    private Long id;\n\n    private String description;\n    private BigDecimal total;\n\n    // Внешний ключ user_id в таблице orders\n    @ManyToOne(fetch = FetchType.LAZY)  // LAZY - загружать только по запросу\n    @JoinColumn(name = "user_id", nullable = false)\n    private User user;\n}\n\n// "Один" сторона — User\n@Entity\n@Table(name = "users")\npublic class User {\n    @Id\n    @GeneratedValue(strategy = GenerationType.IDENTITY)\n    private Long id;\n\n    private String name;\n    private String email;\n\n    // mappedBy ссылается на поле "user" в Order\n    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL,\n               fetch = FetchType.LAZY)\n    private List<Order> orders = new ArrayList<>();\n}' },
        { type: 'heading', value: 'Cascade: каскадные операции' },
        { type: 'code', language: 'java', value: '// CascadeType определяет что происходит с связанными объектами\n@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)\n// ALL: при save/delete User — то же происходит с его Orders\n\n// Типы каскадов:\n// PERSIST — сохранять Orders вместе с User\n// MERGE   — обновлять Orders вместе с User\n// REMOVE  — удалять Orders при удалении User\n// ALL     — все вышеперечисленные\n// DETACH  — отсоединять от контекста\n// REFRESH — обновлять из БД' },
        { type: 'warning', value: 'cascade = CascadeType.ALL + orphanRemoval = true — удаляет дочерние записи из БД когда они убираются из коллекции. Используй осторожно!' }
      ]
    },
    {
      id: 3,
      title: '@ManyToMany',
      type: 'theory',
      content: [
        { type: 'text', value: 'Связь многие-ко-многим требует промежуточной таблицы. JPA создаёт её автоматически или ты можешь настроить вручную.' },
        { type: 'code', language: 'java', value: '@Entity\npublic class Student {\n    @Id\n    @GeneratedValue(strategy = GenerationType.IDENTITY)\n    private Long id;\n    private String name;\n\n    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})\n    @JoinTable(\n        name = "student_course",          // название промежуточной таблицы\n        joinColumns = @JoinColumn(name = "student_id"),\n        inverseJoinColumns = @JoinColumn(name = "course_id")\n    )\n    private Set<Course> courses = new HashSet<>();\n\n    // Вспомогательные методы для управления связью\n    public void addCourse(Course course) {\n        this.courses.add(course);\n        course.getStudents().add(this);\n    }\n\n    public void removeCourse(Course course) {\n        this.courses.remove(course);\n        course.getStudents().remove(this);\n    }\n}\n\n@Entity\npublic class Course {\n    @Id\n    @GeneratedValue(strategy = GenerationType.IDENTITY)\n    private Long id;\n    private String title;\n\n    @ManyToMany(mappedBy = "courses")  // обратная сторона\n    private Set<Student> students = new HashSet<>();\n}' },
        { type: 'tip', value: 'Для @ManyToMany используй Set вместо List — Set не допускает дублей и работает с equals/hashCode. Переопредели equals и hashCode по бизнес-ключу, не по id.' }
      ]
    },
    {
      id: 4,
      title: 'Lazy vs Eager загрузка',
      type: 'theory',
      content: [
        { type: 'text', value: 'FetchType определяет когда JPA загружает связанные данные: сразу (EAGER) или по требованию (LAZY).' },
        { type: 'code', language: 'java', value: '// EAGER — загружает связанные данные СРАЗУ при загрузке User\n@OneToMany(fetch = FetchType.EAGER)  // не рекомендуется для коллекций!\nprivate List<Order> orders;\n// SQL: SELECT * FROM users u JOIN orders o ON u.id = o.user_id\n// Всегда грузит ВСЕ заказы даже если они не нужны!\n\n// LAZY — загружает связанные данные ТОЛЬКО когда обращаешься к ним\n@OneToMany(fetch = FetchType.LAZY)  // рекомендуется\nprivate List<Order> orders;\n// SQL сначала: SELECT * FROM users WHERE id = ?\n// SQL потом (при user.getOrders()): SELECT * FROM orders WHERE user_id = ?' },
        { type: 'heading', value: 'Проблема N+1' },
        { type: 'code', language: 'java', value: '// N+1 проблема с LAZY:\nList<User> users = userRepository.findAll(); // 1 запрос\nfor (User user : users) {\n    user.getOrders().size(); // N запросов (по одному на каждого пользователя!)\n}\n// Итого: 1 + N запросов\n\n// Решение: JOIN FETCH в JPQL\n@Query("SELECT u FROM User u LEFT JOIN FETCH u.orders")\nList<User> findAllWithOrders();\n// Один запрос с JOIN — загружает всё сразу' },
        { type: 'warning', value: 'По умолчанию: @OneToMany и @ManyToMany — LAZY, @ManyToOne и @OneToOne — EAGER. Рекомендуется везде использовать LAZY и явно загружать нужные связи через JOIN FETCH.' }
      ]
    },
    {
      id: 5,
      title: '@OneToOne',
      type: 'theory',
      content: [
        { type: 'text', value: '@OneToOne — связь один-к-одному. Например, у каждого пользователя есть один профиль с дополнительными данными.' },
        { type: 'code', language: 'java', value: '@Entity\npublic class User {\n    @Id\n    @GeneratedValue(strategy = GenerationType.IDENTITY)\n    private Long id;\n    private String email;\n\n    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL,\n              fetch = FetchType.LAZY)\n    private UserProfile profile;\n}\n\n@Entity\npublic class UserProfile {\n    @Id\n    @GeneratedValue(strategy = GenerationType.IDENTITY)\n    private Long id;\n\n    private String bio;\n    private String avatarUrl;\n    private String phone;\n\n    @OneToOne(fetch = FetchType.LAZY)\n    @JoinColumn(name = "user_id", unique = true)\n    private User user;  // внешний ключ здесь\n}' },
        { type: 'tip', value: 'Вместо @OneToOne иногда лучше добавить поля прямо в основную сущность. @OneToOne полезен когда данные редко нужны (LAZY) или когда профиль существует отдельно от пользователя.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Блог с постами и комментариями',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай модель данных для блога: авторы, посты, комментарии с правильными JPA связями.',
      requirements: [
        'Author: id, name, email. Один автор — много постов',
        'Post: id, title, content, author (ManyToOne), комментарии (OneToMany)',
        'Comment: id, text, post (ManyToOne)',
        'GET /authors/{id}/posts — все посты автора',
        'POST /posts/{id}/comments — добавить комментарий'
      ],
      expectedOutput: 'GET /authors/1/posts => [{"id":1,"title":"...","commentsCount":3}]\nPOST /posts/1/comments {"text":"Отличная статья!"} => 201 {"id":1,"text":"..."}',
      hint: 'Author ← Post ← Comment (каждая стрелка ManyToOne). На Author: @OneToMany(mappedBy="author"). На Post: @OneToMany(mappedBy="post"). Используй CascadeType.ALL.',
      solution: '// Author.java\n@Entity\npublic class Author {\n    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)\n    private Long id;\n    private String name;\n    private String email;\n\n    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL,\n               fetch = FetchType.LAZY)\n    private List<Post> posts = new ArrayList<>();\n    // геттеры, сеттеры, конструкторы\n}\n\n// Post.java\n@Entity\npublic class Post {\n    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)\n    private Long id;\n    private String title;\n    private String content;\n\n    @ManyToOne(fetch = FetchType.LAZY)\n    @JoinColumn(name = "author_id")\n    private Author author;\n\n    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL,\n               fetch = FetchType.LAZY)\n    private List<Comment> comments = new ArrayList<>();\n    // геттеры, сеттеры\n}\n\n// Comment.java\n@Entity\npublic class Comment {\n    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)\n    private Long id;\n    private String text;\n\n    @ManyToOne(fetch = FetchType.LAZY)\n    @JoinColumn(name = "post_id")\n    private Post post;\n    // геттеры, сеттеры\n}\n\n// BlogController.java\n@RestController\npublic class BlogController {\n    private final AuthorRepository authorRepository;\n    private final PostRepository postRepository;\n    private final CommentRepository commentRepository;\n\n    @GetMapping("/authors/{id}/posts")\n    public ResponseEntity<List<Post>> getAuthorPosts(@PathVariable Long id) {\n        Author author = authorRepository.findById(id)\n            .orElseThrow(() -> new RuntimeException("Автор не найден"));\n        return ResponseEntity.ok(author.getPosts());\n    }\n\n    @PostMapping("/posts/{id}/comments")\n    @Transactional\n    public ResponseEntity<Comment> addComment(\n            @PathVariable Long id,\n            @RequestBody Comment comment) {\n        Post post = postRepository.findById(id)\n            .orElseThrow(() -> new RuntimeException("Пост не найден"));\n        comment.setPost(post);\n        Comment saved = commentRepository.save(comment);\n        return ResponseEntity.status(HttpStatus.CREATED).body(saved);\n    }\n}',
      explanation: 'Связи настраиваются с двух сторон: "один" конец использует mappedBy (не владеет внешним ключом), "многие" конец использует @JoinColumn (владеет внешним ключом). Всегда устанавливай связь с обеих сторон: post.setPost(post) и commentRepository.save(comment).'
    },
    {
      id: 7,
      title: 'Практика: Студенты и курсы (ManyToMany)',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй связь многие-ко-многим между студентами и курсами.',
      requirements: [
        'Student: id, name. Course: id, title, maxStudents',
        '@ManyToMany между Student и Course',
        'POST /students/{studentId}/courses/{courseId} — записать студента на курс',
        'DELETE /students/{studentId}/courses/{courseId} — отписать от курса',
        'GET /courses/{courseId}/students — список студентов курса'
      ],
      expectedOutput: 'POST /students/1/courses/2 => 200 "Студент записан на курс Spring Boot"\nGET /courses/2/students => [{"id":1,"name":"Иван"},{"id":3,"name":"Мария"}]',
      hint: 'Student имеет @ManyToMany @JoinTable. Course имеет @ManyToMany(mappedBy="courses"). Вспомогательные методы addCourse/removeCourse на Student для поддержания двусторонней синхронизации.',
      solution: '// Student.java\n@Entity\npublic class Student {\n    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)\n    private Long id;\n    private String name;\n\n    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})\n    @JoinTable(\n        name = "student_course",\n        joinColumns = @JoinColumn(name = "student_id"),\n        inverseJoinColumns = @JoinColumn(name = "course_id")\n    )\n    private Set<Course> courses = new HashSet<>();\n\n    public void addCourse(Course c) {\n        courses.add(c);\n        c.getStudents().add(this);\n    }\n    public void removeCourse(Course c) {\n        courses.remove(c);\n        c.getStudents().remove(this);\n    }\n    // геттеры, сеттеры\n}\n\n// Course.java\n@Entity\npublic class Course {\n    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)\n    private Long id;\n    private String title;\n    private int maxStudents;\n\n    @ManyToMany(mappedBy = "courses")\n    private Set<Student> students = new HashSet<>();\n    // геттеры, сеттеры\n}\n\n// EnrollmentController.java\n@RestController\npublic class EnrollmentController {\n\n    @PostMapping("/students/{studentId}/courses/{courseId}")\n    @Transactional\n    public ResponseEntity<String> enroll(\n            @PathVariable Long studentId,\n            @PathVariable Long courseId) {\n        Student student = studentRepository.findById(studentId).orElseThrow();\n        Course course = courseRepository.findById(courseId).orElseThrow();\n        student.addCourse(course);\n        studentRepository.save(student);\n        return ResponseEntity.ok("Студент записан на курс " + course.getTitle());\n    }\n\n    @DeleteMapping("/students/{studentId}/courses/{courseId}")\n    @Transactional\n    public ResponseEntity<Void> unenroll(\n            @PathVariable Long studentId,\n            @PathVariable Long courseId) {\n        Student student = studentRepository.findById(studentId).orElseThrow();\n        Course course = courseRepository.findById(courseId).orElseThrow();\n        student.removeCourse(course);\n        studentRepository.save(student);\n        return ResponseEntity.noContent().build();\n    }\n\n    @GetMapping("/courses/{courseId}/students")\n    public Set<Student> getCourseStudents(@PathVariable Long courseId) {\n        Course course = courseRepository.findById(courseId).orElseThrow();\n        return course.getStudents();\n    }\n}',
      explanation: '@ManyToMany с @JoinTable создаёт промежуточную таблицу student_course автоматически. Вспомогательные методы addCourse/removeCourse поддерживают синхронность обеих сторон связи в памяти. Без синхронизации в памяти — данные в памяти не совпадут с данными в БД до следующей загрузки.'
    }
  ]
}
