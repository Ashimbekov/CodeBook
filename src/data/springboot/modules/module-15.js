export default {
  id: 15,
  title: 'Spring Security: авторизация',
  description: 'Тонкая авторизация через @PreAuthorize, @PostAuthorize, роли и разрешения, Method Security',
  lessons: [
    {
      id: 1,
      title: 'Method Security: @PreAuthorize',
      type: 'theory',
      content: [
        { type: 'text', value: '@PreAuthorize позволяет контролировать доступ на уровне методов, а не только URL. Это более гибкий подход к авторизации.' },
        { type: 'heading', value: 'Включение Method Security' },
        { type: 'code', language: 'java', value: '@Configuration\n@EnableWebSecurity\n@EnableMethodSecurity  // ОБЯЗАТЕЛЬНО для @PreAuthorize!\npublic class SecurityConfig {\n    // ...\n}' },
        { type: 'heading', value: 'Примеры @PreAuthorize' },
        { type: 'code', language: 'java', value: '@RestController\n@RequestMapping("/api/products")\npublic class ProductController {\n\n    // Только аутентифицированные\n    @GetMapping\n    @PreAuthorize("isAuthenticated()")\n    public List<Product> getAll() { ... }\n\n    // Только ADMIN\n    @PostMapping\n    @PreAuthorize("hasRole(\'ADMIN\')")\n    public Product create(@RequestBody Product product) { ... }\n\n    // ADMIN или MANAGER\n    @PutMapping("/{id}")\n    @PreAuthorize("hasAnyRole(\'ADMIN\', \'MANAGER\')")\n    public Product update(@PathVariable Long id,\n                          @RequestBody Product product) { ... }\n\n    // Проверка конкретного разрешения\n    @DeleteMapping("/{id}")\n    @PreAuthorize("hasAuthority(\'PRODUCT_DELETE\')")\n    public void delete(@PathVariable Long id) { ... }\n\n    // Доступ к параметрам метода в выражении\n    @GetMapping("/{id}/owner")\n    @PreAuthorize("hasRole(\'ADMIN\') or @productService.isOwner(#id, authentication.name)")\n    public Product getOwned(@PathVariable Long id) { ... }\n}' },
        { type: 'tip', value: 'В @PreAuthorize используется SpEL (Spring Expression Language). authentication.name — логин пользователя. #paramName — параметр метода. @beanName.method() — вызов метода бина.' }
      ]
    },
    {
      id: 2,
      title: '@PostAuthorize и @PreFilter/@PostFilter',
      type: 'theory',
      content: [
        { type: 'text', value: '@PostAuthorize проверяет права ПОСЛЕ выполнения метода, используя его результат. @PostFilter фильтрует коллекцию результатов.' },
        { type: 'code', language: 'java', value: '@Service\npublic class OrderService {\n\n    // Проверяем ПОСЛЕ: возвращаемый заказ принадлежит текущему пользователю\n    // или пользователь — администратор\n    @PostAuthorize(\n        "returnObject.ownerEmail == authentication.name or hasRole(\'ADMIN\')")\n    public Order getOrder(Long id) {\n        return orderRepository.findById(id).orElseThrow();\n    }\n\n    // Фильтрует результирующую коллекцию:\n    // оставляет только заказы текущего пользователя\n    @PostFilter("filterObject.ownerEmail == authentication.name")\n    public List<Order> findAll() {\n        return orderRepository.findAll();\n        // Если пользователь не ADMIN — получит только свои заказы\n    }\n\n    // PreFilter — фильтрует входящую коллекцию\n    @PreFilter("filterObject.price > 0")\n    public List<Order> createBatch(List<Order> orders) {\n        return orderRepository.saveAll(orders);\n    }\n}' },
        { type: 'warning', value: '@PostFilter загружает ВСЕ данные из БД и потом фильтрует в памяти. При большом количестве данных это неэффективно. Лучше фильтровать на уровне запроса к БД.' }
      ]
    },
    {
      id: 3,
      title: 'Роли vs Разрешения (Authorities)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Spring Security различает роли (ROLE_X) и разрешения (authorities). Роли — грубая гранулярность, разрешения — тонкая.' },
        { type: 'code', language: 'java', value: '// Роли — грубые категории пользователей\npublic enum Role {\n    USER, ADMIN, MODERATOR\n}\n\n// Разрешения — конкретные действия\npublic enum Permission {\n    USER_READ,\n    USER_CREATE,\n    USER_UPDATE,\n    USER_DELETE,\n    PRODUCT_READ,\n    PRODUCT_CREATE,\n    PRODUCT_UPDATE,\n    PRODUCT_DELETE\n}\n\n// Маппинг ролей на разрешения\npublic enum Role {\n    USER(Set.of(Permission.USER_READ, Permission.PRODUCT_READ)),\n    ADMIN(Set.of(Permission.values())); // все разрешения\n\n    private final Set<Permission> permissions;\n\n    Role(Set<Permission> permissions) {\n        this.permissions = permissions;\n    }\n\n    // Конвертация в GrantedAuthority для Spring Security\n    public List<SimpleGrantedAuthority> getAuthorities() {\n        List<SimpleGrantedAuthority> authorities = new ArrayList<>(\n            permissions.stream()\n                .map(p -> new SimpleGrantedAuthority(p.name()))\n                .collect(Collectors.toList())\n        );\n        authorities.add(new SimpleGrantedAuthority("ROLE_" + name()));\n        return authorities;\n    }\n}' },
        { type: 'code', language: 'java', value: '// Использование разрешений вместо ролей\n@DeleteMapping("/{id}")\n@PreAuthorize("hasAuthority(\'USER_DELETE\')")\npublic void deleteUser(@PathVariable Long id) { ... }\n\n// hasRole("ADMIN") vs hasAuthority("ROLE_ADMIN") — одно и то же\n// hasAuthority("USER_DELETE") — конкретное разрешение' }
      ]
    },
    {
      id: 4,
      title: 'Собственный AccessDeniedHandler',
      type: 'theory',
      content: [
        { type: 'text', value: 'По умолчанию Spring Security возвращает HTML страницу при 403 Forbidden. Для REST API нужен JSON ответ.' },
        { type: 'code', language: 'java', value: '// Кастомный обработчик ошибок доступа\n@Component\npublic class CustomAccessDeniedHandler implements AccessDeniedHandler {\n\n    @Override\n    public void handle(\n            HttpServletRequest request,\n            HttpServletResponse response,\n            AccessDeniedException ex) throws IOException {\n        response.setStatus(HttpServletResponse.SC_FORBIDDEN);\n        response.setContentType("application/json");\n        response.setCharacterEncoding("UTF-8");\n        response.getWriter().write(\n            "{\\"status\\": 403, \\"message\\": \\"Доступ запрещён\\"}"\n        );\n    }\n}\n\n// Кастомный обработчик для неаутентифицированных\n@Component\npublic class CustomAuthEntryPoint implements AuthenticationEntryPoint {\n\n    @Override\n    public void commence(\n            HttpServletRequest request,\n            HttpServletResponse response,\n            AuthenticationException ex) throws IOException {\n        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);\n        response.setContentType("application/json");\n        response.getWriter().write(\n            "{\\"status\\": 401, \\"message\\": \\"Необходима аутентификация\\"}"\n        );\n    }\n}\n\n// Подключение в SecurityConfig\nhttp.exceptionHandling(ex -> ex\n    .accessDeniedHandler(accessDeniedHandler)\n    .authenticationEntryPoint(authEntryPoint)\n);' }
      ]
    },
    {
      id: 5,
      title: 'Практика: Ролевая модель доступа',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй систему с тремя ролями (USER, MODERATOR, ADMIN) и разными уровнями доступа к API.',
      requirements: [
        'USER: GET /posts, GET /posts/{id}, POST /posts (свои)',
        'MODERATOR: всё что USER + DELETE /posts/{id} любого',
        'ADMIN: полный доступ + GET /admin/users',
        '@PreAuthorize на методах сервиса',
        'CustomAccessDeniedHandler возвращающий JSON'
      ],
      expectedOutput: 'DELETE /posts/5 (USER) => 403 {"status":403,"message":"Доступ запрещён"}\nDELETE /posts/5 (MODERATOR) => 204\nGET /admin/users (ADMIN) => список пользователей',
      hint: '@EnableMethodSecurity в SecurityConfig. @PreAuthorize("hasAnyRole(\'MODERATOR\',\'ADMIN\')") на deletePost. @PreAuthorize("hasRole(\'ADMIN\')") на getUsers. AccessDeniedHandler как @Component.',
      solution: '// SecurityConfig\n@Configuration\n@EnableWebSecurity\n@EnableMethodSecurity\npublic class SecurityConfig {\n    @Bean\n    public SecurityFilterChain filterChain(\n            HttpSecurity http,\n            CustomAccessDeniedHandler accessDeniedHandler,\n            CustomAuthEntryPoint authEntryPoint) throws Exception {\n        http\n            .csrf(csrf -> csrf.disable())\n            .sessionManagement(s -> s.sessionCreationPolicy(\n                SessionCreationPolicy.STATELESS))\n            .authorizeHttpRequests(auth -> auth\n                .requestMatchers("/api/auth/**").permitAll()\n                .anyRequest().authenticated())\n            .exceptionHandling(ex -> ex\n                .accessDeniedHandler(accessDeniedHandler)\n                .authenticationEntryPoint(authEntryPoint));\n        return http.build();\n    }\n}\n\n// PostService\n@Service\npublic class PostService {\n    @PreAuthorize("isAuthenticated()")\n    public List<Post> findAll() { return postRepository.findAll(); }\n\n    @PreAuthorize("isAuthenticated()")\n    public Post create(Post post) {\n        String author = SecurityContextHolder.getContext()\n            .getAuthentication().getName();\n        post.setAuthorEmail(author);\n        return postRepository.save(post);\n    }\n\n    @PreAuthorize("hasAnyRole(\'MODERATOR\', \'ADMIN\') or " +\n                  "@postService.isAuthor(#id, authentication.name)")\n    public void delete(Long id) { postRepository.deleteById(id); }\n\n    public boolean isAuthor(Long id, String email) {\n        return postRepository.findById(id)\n            .map(p -> p.getAuthorEmail().equals(email))\n            .orElse(false);\n    }\n}\n\n// AdminController\n@RestController\n@RequestMapping("/api/admin")\npublic class AdminController {\n    @GetMapping("/users")\n    @PreAuthorize("hasRole(\'ADMIN\')")\n    public List<AppUser> getUsers() {\n        return userRepository.findAll();\n    }\n}',
      explanation: '@EnableMethodSecurity включает поддержку @PreAuthorize. SpEL позволяет сложные условия: или роль MODERATOR/ADMIN, или текущий пользователь — автор поста. @beanName.method() в SpEL вызывает метод бина для проверки. AccessDeniedHandler и AuthenticationEntryPoint обеспечивают единый формат ошибок.'
    },
    {
      id: 6,
      title: 'Практика: Защита данных пользователя',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй защиту чтобы пользователи видели только свои данные, а администраторы — все.',
      requirements: [
        'GET /api/users/{id} — пользователь видит только себя, admin — любого',
        'GET /api/users/{id}/orders — пользователь только свои заказы',
        'PUT /api/users/{id} — пользователь только свой профиль',
        '@PostAuthorize для проверки результата',
        'Возвращать 403 если попытка доступа к чужим данным'
      ],
      expectedOutput: 'GET /api/users/5 (auth как user id=3) => 403\nGET /api/users/3 (auth как user id=3) => {"id":3,"email":"..."}',
      hint: '@PostAuthorize("returnObject.id == authentication.principal.id or hasRole(\'ADMIN\')"). Для этого UserDetails должен реализовывать метод getId() — создай CustomUserDetails класс.',
      solution: '// CustomUserDetails.java\npublic class CustomUserDetails implements UserDetails {\n    private final Long id;\n    private final String email;\n    private final String password;\n    private final Collection<GrantedAuthority> authorities;\n\n    public CustomUserDetails(AppUser user) {\n        this.id = user.getId();\n        this.email = user.getEmail();\n        this.password = user.getPasswordHash();\n        this.authorities = List.of(\n            new SimpleGrantedAuthority("ROLE_" + user.getRole()));\n    }\n\n    public Long getId() { return id; }\n    @Override\n    public String getUsername() { return email; }\n    // остальные методы UserDetails...\n}\n\n// UserService.java\n@Service\npublic class UserService {\n\n    @PostAuthorize(\n        "returnObject.id == authentication.principal.id or hasRole(\'ADMIN\')")\n    public AppUser findById(Long id) {\n        return userRepository.findById(id)\n            .orElseThrow(() -> new RuntimeException("Пользователь не найден"));\n    }\n\n    @PreAuthorize(\n        "#id == authentication.principal.id or hasRole(\'ADMIN\')")\n    public List<Order> getOrders(Long id) {\n        return orderRepository.findByUserId(id);\n    }\n\n    @PreAuthorize(\n        "#id == authentication.principal.id or hasRole(\'ADMIN\')")\n    public AppUser update(Long id, UpdateUserRequest req) {\n        AppUser user = findUserById(id);\n        user.setName(req.getName());\n        return userRepository.save(user);\n    }\n}',
      explanation: 'CustomUserDetails позволяет хранить id в объекте аутентификации и использовать его в SpEL через authentication.principal.id. @PreAuthorize проверяет ДО выполнения — эффективнее. @PostAuthorize — ПОСЛЕ, когда нужно проверить результат. #id — параметр метода доступен в SpEL через #имяПараметра.'
    }
  ]
}
