export default {
  id: 13,
  title: 'Spring Security: основы',
  description: 'Настройка Spring Security: аутентификация, конфигурация, защита endpoints, In-Memory и DB пользователи',
  lessons: [
    {
      id: 1,
      title: 'Что такое Spring Security и зачем он нужен',
      type: 'theory',
      content: [
        { type: 'text', value: 'Spring Security — фреймворк безопасности для Spring приложений. Обеспечивает аутентификацию (кто ты?) и авторизацию (что ты можешь делать?).' },
        { type: 'heading', value: 'Что делает Spring Security' },
        { type: 'list', items: [
          'Защищает endpoints — только аутентифицированные пользователи',
          'Управление ролями — ADMIN видит больше чем USER',
          'Защита от CSRF атак',
          'Защита от session fixation',
          'Интеграция с OAuth2, JWT, LDAP',
          'Хэширование паролей через BCrypt'
        ]},
        { type: 'code', language: 'java', value: '<!-- pom.xml -->\n<dependency>\n    <groupId>org.springframework.boot</groupId>\n    <artifactId>spring-boot-starter-security</artifactId>\n</dependency>' },
        { type: 'warning', value: 'Сразу после добавления зависимости Spring Security закрывает ВСЕ endpoints! Для доступа нужен логин. По умолчанию: логин "user", пароль выводится в консоль при запуске.' },
        { type: 'note', value: 'Пароль по умолчанию: в логах ищи строку "Using generated security password: xxxxxx". Это только для разработки — в продакшне пароли задаются явно.' }
      ]
    },
    {
      id: 2,
      title: 'SecurityFilterChain: конфигурация безопасности',
      type: 'theory',
      content: [
        { type: 'text', value: 'SecurityFilterChain — основной способ настройки Spring Security в версии 6.x. Создаётся как @Bean в @Configuration классе.' },
        { type: 'code', language: 'java', value: '@Configuration\n@EnableWebSecurity\npublic class SecurityConfig {\n\n    @Bean\n    public SecurityFilterChain securityFilterChain(HttpSecurity http)\n            throws Exception {\n        http\n            // Настройка авторизации\n            .authorizeHttpRequests(auth -> auth\n                // Публичные endpoints — доступны всем\n                .requestMatchers("/api/auth/**").permitAll()\n                .requestMatchers("/api/public/**").permitAll()\n                .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()\n                // Только для администраторов\n                .requestMatchers("/api/admin/**").hasRole("ADMIN")\n                // Все остальные — только аутентифицированным\n                .anyRequest().authenticated()\n            )\n            // Отключаем CSRF для REST API (используем JWT)\n            .csrf(csrf -> csrf.disable())\n            // Сессии не нужны для REST + JWT\n            .sessionManagement(session -> session\n                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)\n            );\n\n        return http.build();\n    }\n}' },
        { type: 'tip', value: 'permitAll() — доступ без аутентификации. authenticated() — нужна любая аутентификация. hasRole("ADMIN") — нужна роль ADMIN. hasAnyRole("USER", "ADMIN") — одна из ролей.' }
      ]
    },
    {
      id: 3,
      title: 'UserDetailsService: загрузка пользователей',
      type: 'theory',
      content: [
        { type: 'text', value: 'UserDetailsService — интерфейс для загрузки пользователей при аутентификации. Spring Security вызывает его метод loadUserByUsername() когда пользователь вводит логин.' },
        { type: 'heading', value: 'In-Memory пользователи (для тестов)' },
        { type: 'code', language: 'java', value: '@Bean\npublic UserDetailsService userDetailsService(PasswordEncoder encoder) {\n    UserDetails user = User.builder()\n        .username("user")\n        .password(encoder.encode("password"))\n        .roles("USER")\n        .build();\n\n    UserDetails admin = User.builder()\n        .username("admin")\n        .password(encoder.encode("admin123"))\n        .roles("USER", "ADMIN")\n        .build();\n\n    return new InMemoryUserDetailsManager(user, admin);\n}' },
        { type: 'heading', value: 'UserDetailsService из базы данных' },
        { type: 'code', language: 'java', value: '@Service\npublic class CustomUserDetailsService implements UserDetailsService {\n    private final UserRepository userRepository;\n\n    public CustomUserDetailsService(UserRepository userRepository) {\n        this.userRepository = userRepository;\n    }\n\n    @Override\n    public UserDetails loadUserByUsername(String email)\n            throws UsernameNotFoundException {\n        User user = userRepository.findByEmail(email)\n            .orElseThrow(() -> new UsernameNotFoundException(\n                "Пользователь не найден: " + email\n            ));\n\n        return org.springframework.security.core.userdetails.User\n            .withUsername(user.getEmail())\n            .password(user.getPasswordHash())\n            .roles(user.getRole()) // "ADMIN" -> "ROLE_ADMIN"\n            .build();\n    }\n}' },
        { type: 'note', value: 'Spring Security хранит роли с префиксом ROLE_. hasRole("ADMIN") проверяет ROLE_ADMIN. При создании UserDetails метод roles() добавляет ROLE_ автоматически. При прямом указании authorities() — нужно добавлять ROLE_ самому.' }
      ]
    },
    {
      id: 4,
      title: 'PasswordEncoder: безопасное хранение паролей',
      type: 'theory',
      content: [
        { type: 'text', value: 'Никогда не храни пароли в открытом виде! BCryptPasswordEncoder — стандарт для хэширования паролей в Spring.' },
        { type: 'code', language: 'java', value: '// Регистрация PasswordEncoder как бина\n@Bean\npublic PasswordEncoder passwordEncoder() {\n    return new BCryptPasswordEncoder(); // strength по умолчанию 10\n    // Или с явным параметром: new BCryptPasswordEncoder(12);\n    // Чем выше — тем медленнее хэш, но надёжнее\n}\n\n// Использование при регистрации\n@Service\npublic class AuthService {\n    private final PasswordEncoder passwordEncoder;\n    private final UserRepository userRepository;\n\n    public User register(RegisterRequest request) {\n        if (userRepository.existsByEmail(request.getEmail())) {\n            throw new EmailAlreadyExistsException(request.getEmail());\n        }\n        User user = new User();\n        user.setEmail(request.getEmail());\n        // Хэшируем пароль перед сохранением\n        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));\n        user.setRole("USER");\n        return userRepository.save(user);\n    }\n}' },
        { type: 'code', language: 'java', value: '// BCrypt: каждый раз разный хэш одного пароля!\nString password = "mySecret123";\nString hash1 = passwordEncoder.encode(password); // $2a$10$abc...\nString hash2 = passwordEncoder.encode(password); // $2a$10$xyz... (другой!)\n\n// Проверка пароля\nboolean valid = passwordEncoder.matches(password, hash1); // true\n// Внутри BCrypt извлекает соль из хэша и сравнивает' },
        { type: 'warning', value: 'Никогда не пиши passwordEncoder.encode(storedHash) == inputPassword. Всегда используй passwordEncoder.matches(rawPassword, storedHash). BCrypt генерирует разный хэш для одного пароля!' }
      ]
    },
    {
      id: 5,
      title: 'HTTP Basic и Form Login',
      type: 'theory',
      content: [
        { type: 'text', value: 'Spring Security поддерживает несколько методов аутентификации. HTTP Basic и Form Login — классические способы.' },
        { type: 'code', language: 'java', value: '// HTTP Basic Authentication\n// Клиент передаёт: Authorization: Basic base64(login:password)\n@Bean\npublic SecurityFilterChain httpBasicFilter(HttpSecurity http)\n        throws Exception {\n    http\n        .authorizeHttpRequests(auth -> auth.anyRequest().authenticated())\n        .httpBasic(Customizer.withDefaults()); // включаем HTTP Basic\n    return http.build();\n}' },
        { type: 'code', language: 'java', value: '// Form Login (для веб-приложений с HTML формами)\n@Bean\npublic SecurityFilterChain formLoginFilter(HttpSecurity http)\n        throws Exception {\n    http\n        .authorizeHttpRequests(auth -> auth\n            .requestMatchers("/login", "/css/**").permitAll()\n            .anyRequest().authenticated()\n        )\n        .formLogin(form -> form\n            .loginPage("/login")           // своя страница входа\n            .defaultSuccessUrl("/dashboard") // после успешного входа\n            .failureUrl("/login?error")     // при ошибке\n            .permitAll()\n        )\n        .logout(logout -> logout\n            .logoutUrl("/logout")\n            .logoutSuccessUrl("/login?logout")\n        );\n    return http.build();\n}' },
        { type: 'note', value: 'Для REST API (мобильные клиенты, SPA) используй JWT токены — они stateless. HTTP Basic и Form Login — для браузерных приложений с сессиями.' }
      ]
    },
    {
      id: 6,
      title: 'SecurityContext: текущий пользователь',
      type: 'theory',
      content: [
        { type: 'text', value: 'SecurityContext хранит информацию об аутентифицированном пользователе в рамках текущего запроса.' },
        { type: 'code', language: 'java', value: '@RestController\n@RequestMapping("/api")\npublic class ProfileController {\n\n    // Способ 1: через SecurityContextHolder\n    @GetMapping("/me")\n    public String getCurrentUser() {\n        Authentication auth = SecurityContextHolder\n            .getContext()\n            .getAuthentication();\n        return "Привет, " + auth.getName();\n    }\n\n    // Способ 2: через @AuthenticationPrincipal (рекомендуется)\n    @GetMapping("/profile")\n    public String getProfile(\n            @AuthenticationPrincipal UserDetails userDetails) {\n        return "Email: " + userDetails.getUsername();\n    }\n\n    // Способ 3: через Principal\n    @GetMapping("/info")\n    public String getInfo(Principal principal) {\n        return "Логин: " + principal.getName();\n    }\n}' },
        { type: 'tip', value: '@AuthenticationPrincipal — лучший способ получить текущего пользователя в контроллере. Spring автоматически извлекает UserDetails из SecurityContext.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Защита REST API',
      type: 'practice',
      difficulty: 'medium',
      description: 'Настрой Spring Security для REST API с разными уровнями доступа для публичных, пользовательских и административных endpoints.',
      requirements: [
        'GET /api/products — публичный (без аутентификации)',
        'POST /api/products — только ADMIN',
        'GET /api/profile — только аутентифицированный USER',
        'GET /api/admin/stats — только ADMIN',
        'In-Memory пользователи: user/password (роль USER) и admin/admin (роли USER+ADMIN)'
      ],
      expectedOutput: 'GET /api/products => 200 (без токена)\nPOST /api/products (user) => 403 Forbidden\nPOST /api/products (admin) => 201 Created\nGET /api/profile (без токена) => 401 Unauthorized',
      hint: '@Configuration @EnableWebSecurity класс с @Bean SecurityFilterChain. requestMatchers для каждого пути. InMemoryUserDetailsManager с двумя пользователями. BCryptPasswordEncoder как @Bean.',
      solution: '@Configuration\n@EnableWebSecurity\npublic class SecurityConfig {\n\n    @Bean\n    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {\n        http\n            .authorizeHttpRequests(auth -> auth\n                .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()\n                .requestMatchers("/api/admin/**").hasRole("ADMIN")\n                .requestMatchers(HttpMethod.POST, "/api/products/**").hasRole("ADMIN")\n                .requestMatchers(HttpMethod.PUT, "/api/products/**").hasRole("ADMIN")\n                .requestMatchers(HttpMethod.DELETE, "/api/products/**").hasRole("ADMIN")\n                .requestMatchers("/api/profile/**").authenticated()\n                .anyRequest().authenticated()\n            )\n            .csrf(csrf -> csrf.disable())\n            .httpBasic(Customizer.withDefaults());\n        return http.build();\n    }\n\n    @Bean\n    public UserDetailsService userDetailsService(PasswordEncoder encoder) {\n        return new InMemoryUserDetailsManager(\n            User.withUsername("user")\n                .password(encoder.encode("password"))\n                .roles("USER")\n                .build(),\n            User.withUsername("admin")\n                .password(encoder.encode("admin"))\n                .roles("USER", "ADMIN")\n                .build()\n        );\n    }\n\n    @Bean\n    public PasswordEncoder passwordEncoder() {\n        return new BCryptPasswordEncoder();\n    }\n}\n\n// ProfileController.java\n@RestController\n@RequestMapping("/api")\npublic class ProfileController {\n\n    @GetMapping("/profile")\n    public Map<String, String> getProfile(\n            @AuthenticationPrincipal UserDetails user) {\n        return Map.of(\n            "username", user.getUsername(),\n            "roles", user.getAuthorities().toString()\n        );\n    }\n\n    @GetMapping("/admin/stats")\n    public Map<String, Object> getStats() {\n        return Map.of("totalUsers", 100, "totalOrders", 500);\n    }\n}',
      explanation: 'requestMatchers с HttpMethod позволяет задать права на уровне метода. GET /products открыт, POST требует ADMIN. csrf().disable() необходимо для REST API — CSRF защита для браузерных форм, не нужна для API с токенами. httpBasic включает передачу credentials в заголовке Authorization.'
    },
    {
      id: 8,
      title: 'Практика: Регистрация и аутентификация через БД',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй полную систему регистрации и входа с хранением пользователей в базе данных.',
      requirements: [
        'Entity AppUser: id, email, passwordHash, role',
        'UserRepository с findByEmail()',
        'CustomUserDetailsService implements UserDetailsService',
        'POST /api/auth/register — регистрация с хэшированием пароля',
        'SecurityConfig с разрешением /api/auth/** и защитой остальных'
      ],
      expectedOutput: 'POST /api/auth/register {"email":"user@test.com","password":"secret123"} => 201\nGET /api/profile (Basic auth) => {"email":"user@test.com","role":"USER"}',
      hint: 'AppUser entity с email, passwordHash, role. Implements UserDetailsService -> loadUserByUsername(email). В register() вызывать passwordEncoder.encode(password) перед save().',
      solution: '// AppUser.java\n@Entity\n@Table(name = "app_users")\npublic class AppUser {\n    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)\n    private Long id;\n\n    @Column(unique = true, nullable = false)\n    private String email;\n\n    @Column(name = "password_hash", nullable = false)\n    private String passwordHash;\n\n    private String role = "USER";\n    // геттеры, сеттеры, конструкторы\n}\n\n// UserRepository.java\npublic interface UserRepository extends JpaRepository<AppUser, Long> {\n    Optional<AppUser> findByEmail(String email);\n    boolean existsByEmail(String email);\n}\n\n// CustomUserDetailsService.java\n@Service\npublic class CustomUserDetailsService implements UserDetailsService {\n    private final UserRepository userRepository;\n\n    public CustomUserDetailsService(UserRepository userRepository) {\n        this.userRepository = userRepository;\n    }\n\n    @Override\n    public UserDetails loadUserByUsername(String email)\n            throws UsernameNotFoundException {\n        AppUser user = userRepository.findByEmail(email)\n            .orElseThrow(() -> new UsernameNotFoundException("Не найден: " + email));\n        return User.withUsername(user.getEmail())\n            .password(user.getPasswordHash())\n            .roles(user.getRole())\n            .build();\n    }\n}\n\n// AuthController.java\n@RestController\n@RequestMapping("/api/auth")\npublic class AuthController {\n    private final UserRepository userRepository;\n    private final PasswordEncoder passwordEncoder;\n\n    @PostMapping("/register")\n    public ResponseEntity<String> register(\n            @RequestBody @Valid RegisterRequest req) {\n        if (userRepository.existsByEmail(req.getEmail())) {\n            return ResponseEntity.badRequest().body("Email занят");\n        }\n        AppUser user = new AppUser();\n        user.setEmail(req.getEmail());\n        user.setPasswordHash(passwordEncoder.encode(req.getPassword()));\n        userRepository.save(user);\n        return ResponseEntity.status(HttpStatus.CREATED)\n            .body("Пользователь зарегистрирован");\n    }\n}',
      explanation: 'CustomUserDetailsService связывает Spring Security с базой данных. loadUserByUsername() загружает пользователя по email и конвертирует его в UserDetails который понимает Security. passwordEncoder.encode() при регистрации, matches() происходит автоматически при входе через AuthenticationManager.'
    }
  ]
}
