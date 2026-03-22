export default {
  id: 14,
  title: 'JWT аутентификация',
  description: 'Реализация JWT аутентификации: генерация токенов, JwtFilter, refresh токены',
  lessons: [
    {
      id: 1,
      title: 'Что такое JWT и как работает',
      type: 'theory',
      content: [
        { type: 'text', value: 'JWT (JSON Web Token) — стандарт для передачи данных между сторонами в виде подписанного JSON. Идеален для stateless REST API аутентификации.' },
        { type: 'heading', value: 'Структура JWT' },
        { type: 'text', value: 'JWT состоит из трёх частей, разделённых точками: Header.Payload.Signature' },
        { type: 'code', language: 'java', value: '// Пример JWT токена:\n// eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyQGV4YW1wbGUuY29tIiwiaWF0Ij\n// oxNzA1MzE0ODAwLCJleHAiOjE3MDUzMTg0MDB9.HMAC-подпись\n\n// Header (алгоритм подписи):\n// {"alg":"HS256","typ":"JWT"}\n\n// Payload (данные пользователя):\n// {\n//   "sub": "user@example.com",  // subject — кто это\n//   "iat": 1705314800,          // issued at — когда выдан\n//   "exp": 1705318400,          // expiration — когда истекает\n//   "role": "USER"\n// }\n\n// Signature = HMAC-SHA256(header + "." + payload, secretKey)' },
        { type: 'heading', value: 'Как работает JWT аутентификация' },
        { type: 'list', items: [
          '1. Клиент POST /auth/login с email и паролем',
          '2. Сервер проверяет пароль, создаёт JWT токен',
          '3. Клиент сохраняет токен (localStorage, cookie)',
          '4. Клиент отправляет токен в каждом запросе: Authorization: Bearer <token>',
          '5. Сервер проверяет подпись токена и извлекает данные пользователя',
          '6. Если токен валидный — запрос выполняется'
        ]},
        { type: 'tip', value: 'JWT stateless — сервер не хранит сессии. Информация о пользователе хранится в самом токене. Это позволяет масштабировать приложение горизонтально.' }
      ]
    },
    {
      id: 2,
      title: 'Зависимости и JwtUtil',
      type: 'theory',
      content: [
        { type: 'text', value: 'Для работы с JWT используем библиотеку jjwt (Java JWT). Создадим утилитный класс для генерации и валидации токенов.' },
        { type: 'code', language: 'java', value: '<!-- pom.xml -->\n<dependency>\n    <groupId>io.jsonwebtoken</groupId>\n    <artifactId>jjwt-api</artifactId>\n    <version>0.12.3</version>\n</dependency>\n<dependency>\n    <groupId>io.jsonwebtoken</groupId>\n    <artifactId>jjwt-impl</artifactId>\n    <version>0.12.3</version>\n    <scope>runtime</scope>\n</dependency>\n<dependency>\n    <groupId>io.jsonwebtoken</groupId>\n    <artifactId>jjwt-jackson</artifactId>\n    <version>0.12.3</version>\n    <scope>runtime</scope>\n</dependency>' },
        { type: 'code', language: 'java', value: '// application.properties\njwt.secret=mySecretKeyForSigningJwtTokensMinimum256BitsLong\njwt.expiration=86400000  // 24 часа в миллисекундах\n\n// JwtUtil.java\n@Component\npublic class JwtUtil {\n\n    @Value("${jwt.secret}")\n    private String secret;\n\n    @Value("${jwt.expiration}")\n    private long expiration;\n\n    private SecretKey getSigningKey() {\n        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));\n    }\n\n    public String generateToken(String username) {\n        return Jwts.builder()\n            .subject(username)\n            .issuedAt(new Date())\n            .expiration(new Date(System.currentTimeMillis() + expiration))\n            .signWith(getSigningKey())\n            .compact();\n    }\n\n    public String extractUsername(String token) {\n        return parseClaims(token).getSubject();\n    }\n\n    public boolean isTokenValid(String token, UserDetails userDetails) {\n        final String username = extractUsername(token);\n        return username.equals(userDetails.getUsername())\n            && !isTokenExpired(token);\n    }\n\n    private boolean isTokenExpired(String token) {\n        return parseClaims(token).getExpiration().before(new Date());\n    }\n\n    private Claims parseClaims(String token) {\n        return Jwts.parser()\n            .verifyWith(getSigningKey())\n            .build()\n            .parseSignedClaims(token)\n            .getPayload();\n    }\n}' }
      ]
    },
    {
      id: 3,
      title: 'JwtAuthenticationFilter',
      type: 'theory',
      content: [
        { type: 'text', value: 'JWT фильтр перехватывает каждый запрос, извлекает токен из заголовка Authorization и устанавливает аутентификацию в SecurityContext.' },
        { type: 'code', language: 'java', value: '@Component\npublic class JwtAuthenticationFilter extends OncePerRequestFilter {\n\n    private final JwtUtil jwtUtil;\n    private final UserDetailsService userDetailsService;\n\n    public JwtAuthenticationFilter(JwtUtil jwtUtil,\n                                    UserDetailsService userDetailsService) {\n        this.jwtUtil = jwtUtil;\n        this.userDetailsService = userDetailsService;\n    }\n\n    @Override\n    protected void doFilterInternal(\n            HttpServletRequest request,\n            HttpServletResponse response,\n            FilterChain filterChain) throws ServletException, IOException {\n\n        final String authHeader = request.getHeader("Authorization");\n\n        // Если заголовка нет или не начинается с "Bearer " — пропускаем\n        if (authHeader == null || !authHeader.startsWith("Bearer ")) {\n            filterChain.doFilter(request, response);\n            return;\n        }\n\n        String jwt = authHeader.substring(7); // убираем "Bearer "\n        String username;\n\n        try {\n            username = jwtUtil.extractUsername(jwt);\n        } catch (Exception e) {\n            // Невалидный токен — пропускаем без аутентификации\n            filterChain.doFilter(request, response);\n            return;\n        }\n\n        // Если username извлечён и пользователь ещё не аутентифицирован\n        if (username != null &&\n            SecurityContextHolder.getContext().getAuthentication() == null) {\n\n            UserDetails userDetails =\n                userDetailsService.loadUserByUsername(username);\n\n            if (jwtUtil.isTokenValid(jwt, userDetails)) {\n                // Создаём объект аутентификации\n                UsernamePasswordAuthenticationToken authToken =\n                    new UsernamePasswordAuthenticationToken(\n                        userDetails, null, userDetails.getAuthorities()\n                    );\n                authToken.setDetails(\n                    new WebAuthenticationDetailsSource().buildDetails(request)\n                );\n                // Устанавливаем в SecurityContext\n                SecurityContextHolder.getContext().setAuthentication(authToken);\n            }\n        }\n\n        filterChain.doFilter(request, response);\n    }\n}' },
        { type: 'note', value: 'OncePerRequestFilter гарантирует что фильтр выполнится ровно один раз на запрос. JwtAuthenticationFilter регистрируется в SecurityFilterChain через addFilterBefore().' }
      ]
    },
    {
      id: 4,
      title: 'AuthController: login endpoint',
      type: 'theory',
      content: [
        { type: 'text', value: 'Endpoint для входа принимает credentials, проверяет их через AuthenticationManager и возвращает JWT токен.' },
        { type: 'code', language: 'java', value: '// AuthController.java\n@RestController\n@RequestMapping("/api/auth")\npublic class AuthController {\n\n    private final AuthenticationManager authenticationManager;\n    private final JwtUtil jwtUtil;\n    private final CustomUserDetailsService userDetailsService;\n\n    @PostMapping("/login")\n    public ResponseEntity<Map<String, String>> login(\n            @RequestBody LoginRequest request) {\n        try {\n            // Spring Security проверяет credentials\n            authenticationManager.authenticate(\n                new UsernamePasswordAuthenticationToken(\n                    request.getEmail(),\n                    request.getPassword()\n                )\n            );\n        } catch (BadCredentialsException e) {\n            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)\n                .body(Map.of("error", "Неверный email или пароль"));\n        }\n\n        UserDetails userDetails =\n            userDetailsService.loadUserByUsername(request.getEmail());\n        String token = jwtUtil.generateToken(userDetails.getUsername());\n\n        return ResponseEntity.ok(Map.of(\n            "token", token,\n            "type", "Bearer"\n        ));\n    }\n\n    @PostMapping("/register")\n    public ResponseEntity<String> register(\n            @Valid @RequestBody RegisterRequest request) {\n        // ... логика регистрации\n    }\n}' },
        { type: 'code', language: 'java', value: '// SecurityConfig с JWT фильтром\n@Bean\npublic SecurityFilterChain filterChain(\n        HttpSecurity http,\n        JwtAuthenticationFilter jwtFilter) throws Exception {\n    http\n        .csrf(csrf -> csrf.disable())\n        .sessionManagement(s -> s\n            .sessionCreationPolicy(SessionCreationPolicy.STATELESS))\n        .authorizeHttpRequests(auth -> auth\n            .requestMatchers("/api/auth/**").permitAll()\n            .anyRequest().authenticated()\n        )\n        // JWT фильтр перед UsernamePasswordAuthenticationFilter\n        .addFilterBefore(jwtFilter,\n            UsernamePasswordAuthenticationFilter.class);\n    return http.build();\n}\n\n@Bean\npublic AuthenticationManager authenticationManager(\n        AuthenticationConfiguration config) throws Exception {\n    return config.getAuthenticationManager();\n}' }
      ]
    },
    {
      id: 5,
      title: 'Refresh токены',
      type: 'theory',
      content: [
        { type: 'text', value: 'Access токен короткоживущий (15 минут - 1 час). Refresh токен долгоживущий (7-30 дней) — используется для получения нового access токена без повторного входа.' },
        { type: 'code', language: 'java', value: '// Возвращаем оба токена при логине\n@PostMapping("/login")\npublic TokenResponse login(@RequestBody LoginRequest req) {\n    // ... проверка credentials\n    String accessToken = jwtUtil.generateAccessToken(email);\n    String refreshToken = jwtUtil.generateRefreshToken(email);\n    // Сохраняем refresh токен в БД\n    refreshTokenRepository.save(new RefreshToken(email, refreshToken));\n    return new TokenResponse(accessToken, refreshToken);\n}\n\n// Обновление access токена\n@PostMapping("/refresh")\npublic TokenResponse refresh(@RequestBody Map<String, String> body) {\n    String refreshToken = body.get("refreshToken");\n\n    // Проверяем refresh токен в БД\n    RefreshToken stored = refreshTokenRepository\n        .findByToken(refreshToken)\n        .orElseThrow(() -> new RuntimeException("Невалидный refresh токен"));\n\n    // Проверяем не истёк ли\n    if (stored.isExpired()) {\n        refreshTokenRepository.delete(stored);\n        throw new RuntimeException("Refresh токен истёк, войдите снова");\n    }\n\n    // Генерируем новый access токен\n    String newAccessToken = jwtUtil.generateAccessToken(stored.getEmail());\n    return new TokenResponse(newAccessToken, refreshToken);\n}' },
        { type: 'tip', value: 'Access токен: 15 минут - 1 час. Refresh токен: 7-30 дней. При logout — удаляй refresh токен из БД. При смене пароля — инвалидируй все refresh токены пользователя.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Полная JWT аутентификация',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй полную систему JWT аутентификации с регистрацией, входом и защищёнными endpoints.',
      requirements: [
        'POST /api/auth/register — регистрация, возвращает JWT',
        'POST /api/auth/login — вход, возвращает JWT',
        'GET /api/me — профиль (только с токеном)',
        'JwtUtil для генерации и валидации',
        'JwtAuthenticationFilter в SecurityFilterChain'
      ],
      expectedOutput: 'POST /api/auth/login {"email":"user@test.com","password":"pass"} => {"token":"eyJ..."}\nGET /api/me Headers: Authorization: Bearer eyJ... => {"email":"user@test.com"}',
      hint: 'JwtUtil с generateToken() и isTokenValid(). JwtAuthenticationFilter extends OncePerRequestFilter. SecurityConfig: addFilterBefore(jwtFilter, ...). AuthenticationManager как @Bean.',
      solution: '// Полная реализация в нескольких файлах:\n\n// 1. JwtUtil — генерация и валидация токенов (см. урок 2)\n\n// 2. JwtAuthenticationFilter — фильтр (см. урок 3)\n\n// 3. SecurityConfig\n@Configuration\n@EnableWebSecurity\npublic class SecurityConfig {\n    @Bean\n    public SecurityFilterChain filterChain(\n            HttpSecurity http,\n            JwtAuthenticationFilter jwtFilter) throws Exception {\n        http\n            .csrf(csrf -> csrf.disable())\n            .sessionManagement(s -> s.sessionCreationPolicy(\n                SessionCreationPolicy.STATELESS))\n            .authorizeHttpRequests(auth -> auth\n                .requestMatchers("/api/auth/**").permitAll()\n                .anyRequest().authenticated())\n            .addFilterBefore(jwtFilter,\n                UsernamePasswordAuthenticationFilter.class);\n        return http.build();\n    }\n    @Bean\n    public PasswordEncoder passwordEncoder() {\n        return new BCryptPasswordEncoder();\n    }\n    @Bean\n    public AuthenticationManager authManager(\n            AuthenticationConfiguration config) throws Exception {\n        return config.getAuthenticationManager();\n    }\n}\n\n// 4. AuthController\n@RestController\n@RequestMapping("/api/auth")\npublic class AuthController {\n    @PostMapping("/login")\n    public ResponseEntity<?> login(@RequestBody LoginRequest req) {\n        try {\n            authManager.authenticate(new UsernamePasswordAuthenticationToken(\n                req.getEmail(), req.getPassword()));\n        } catch (BadCredentialsException e) {\n            return ResponseEntity.status(401)\n                .body(Map.of("error", "Неверные credentials"));\n        }\n        String token = jwtUtil.generateToken(req.getEmail());\n        return ResponseEntity.ok(Map.of("token", token, "type", "Bearer"));\n    }\n}\n\n// 5. MeController\n@RestController\npublic class MeController {\n    @GetMapping("/api/me")\n    public Map<String, Object> me(\n            @AuthenticationPrincipal UserDetails user) {\n        return Map.of(\n            "email", user.getUsername(),\n            "roles", user.getAuthorities()\n        );\n    }\n}',
      explanation: 'JWT аутентификация: клиент логинится → получает токен → отправляет токен в каждом запросе. JwtAuthenticationFilter перехватывает запросы, читает токен из заголовка, валидирует его и устанавливает аутентификацию в SecurityContext. SessionCreationPolicy.STATELESS — сервер не создаёт сессии.'
    },
    {
      id: 7,
      title: 'Практика: Добавление claims в токен',
      type: 'practice',
      difficulty: 'medium',
      description: 'Расширь JWT токен дополнительными данными: роль пользователя и userId.',
      requirements: [
        'Добавь в payload: userId (Long), role (String)',
        'JwtUtil.generateToken принимает UserDetails и User entity',
        'Метод extractUserId(token) -> Long',
        'Метод extractRole(token) -> String',
        'GET /api/me возвращает userId, email, role из токена'
      ],
      expectedOutput: 'Token payload: {"sub":"user@test.com","userId":42,"role":"USER","exp":...}\nGET /api/me => {"userId":42,"email":"user@test.com","role":"USER"}',
      hint: 'Jwts.builder().claim("userId", user.getId()).claim("role", user.getRole()). В parseClaims: claims.get("userId", Long.class). Создай TokenData DTO для /api/me ответа.',
      solution: '// Расширенный JwtUtil\n@Component\npublic class JwtUtil {\n    // ... (поля и getSigningKey как прежде)\n\n    public String generateToken(AppUser user) {\n        return Jwts.builder()\n            .subject(user.getEmail())\n            .claim("userId", user.getId())\n            .claim("role", user.getRole())\n            .issuedAt(new Date())\n            .expiration(new Date(System.currentTimeMillis() + expiration))\n            .signWith(getSigningKey())\n            .compact();\n    }\n\n    public Long extractUserId(String token) {\n        return parseClaims(token).get("userId", Long.class);\n    }\n\n    public String extractRole(String token) {\n        return parseClaims(token).get("role", String.class);\n    }\n\n    // extractUsername, isTokenValid, parseClaims как прежде\n}\n\n// MeController.java\n@RestController\npublic class MeController {\n    private final JwtUtil jwtUtil;\n\n    @GetMapping("/api/me")\n    public Map<String, Object> me(HttpServletRequest request) {\n        String token = request.getHeader("Authorization").substring(7);\n        return Map.of(\n            "userId", jwtUtil.extractUserId(token),\n            "email", jwtUtil.extractUsername(token),\n            "role", jwtUtil.extractRole(token)\n        );\n    }\n}',
      explanation: 'JWT claims — произвольные данные в payload токена. .claim("key", value) добавляет их при генерации. claims.get("key", Type.class) извлекает при разборе. Токен хранит всё необходимое — сервер не обращается к БД на каждый запрос. Но токен нельзя отозвать до истечения (хранить в blacklist или делать короткоживущим).'
    }
  ]
}
