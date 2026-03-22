export default {
  id: 32,
  title: 'Практикум: Security и Авторизация',
  description: 'Серия практических задач по реализации полной системы аутентификации и авторизации: регистрация, JWT, роли, OAuth2 и продвинутые сценарии безопасности',
  lessons: [
    {
      id: 1,
      title: 'Задача: базовая конфигурация Spring Security',
      type: 'practice',
      difficulty: 'easy',
      description: 'Настройте Spring Security для REST API: отключите form login, настройте stateless сессии, создайте публичные и защищённые пути.',
      requirements: [
        'Добавь spring-boot-starter-security',
        'SecurityConfig extends SecurityFilterChain через @Bean',
        'Отключи CSRF (REST API без браузера)',
        'Сессии — STATELESS',
        'Разреши без аутентификации: POST /auth/register, POST /auth/login, GET /api/posts/**',
        'Остальное — только аутентифицированные',
        'Включи CORS с allowedOriginPatterns("*") для разработки'
      ],
      hint: 'SessionCreationPolicy.STATELESS для JWT API. http.csrf(csrf -> csrf.disable()) в Spring Security 6.',
      solution: '@Configuration @EnableWebSecurity @EnableMethodSecurity\npublic class SecurityConfig {\n\n    @Autowired JwtAuthFilter jwtAuthFilter;\n\n    @Bean\n    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {\n        return http\n            .csrf(csrf -> csrf.disable())\n            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))\n            .authorizeHttpRequests(auth -> auth\n                .requestMatchers("/auth/**").permitAll()\n                .requestMatchers(HttpMethod.GET, "/api/posts/**").permitAll()\n                .requestMatchers("/actuator/health").permitAll()\n                .anyRequest().authenticated()\n            )\n            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)\n            .exceptionHandling(ex -> ex\n                .authenticationEntryPoint((req, res, e) -> res.sendError(401))\n                .accessDeniedHandler((req, res, e) -> res.sendError(403))\n            )\n            .build();\n    }\n\n    @Bean\n    public PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(12); }\n}',
      explanation: '@EnableMethodSecurity включает @PreAuthorize на методах. addFilterBefore добавляет JWT фильтр перед стандартным фильтром аутентификации. STATELESS — не создавать HTTP сессии.'
    },
    {
      id: 2,
      title: 'Задача: регистрация и login с JWT',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте полный flow регистрации и входа: хеширование пароля, генерация JWT токена, refresh токена.',
      requirements: [
        'POST /auth/register — регистрация с валидацией email и пароля',
        'POST /auth/login — возвращает { accessToken, refreshToken, expiresIn }',
        'POST /auth/refresh — обновляет access токен по refresh токену',
        'POST /auth/logout — инвалидирует refresh токен',
        'Access token: 15 минут, Refresh token: 7 дней',
        'Refresh токены хранить в БД (RefreshToken entity)',
        'При logout — удалять refresh токен из БД'
      ],
      hint: 'io.jsonwebtoken:jjwt-api для работы с JWT. RefreshToken сущность: id, token (UUID), userId, expiresAt. При обновлении — rotate токен (удалить старый, создать новый).',
      solution: '@Service\npublic class AuthService {\n    @Autowired UserRepository userRepo;\n    @Autowired RefreshTokenRepository tokenRepo;\n    @Autowired PasswordEncoder encoder;\n    @Autowired JwtUtil jwtUtil;\n\n    public AuthResponse register(RegisterRequest req) {\n        if (userRepo.existsByEmail(req.getEmail()))\n            throw new EmailAlreadyExistsException(req.getEmail());\n        User user = userRepo.save(new User(req.getName(), req.getEmail(),\n            encoder.encode(req.getPassword())));\n        return generateTokens(user);\n    }\n\n    public AuthResponse login(LoginRequest req) {\n        User user = userRepo.findByEmail(req.getEmail())\n            .filter(u -> encoder.matches(req.getPassword(), u.getPasswordHash()))\n            .orElseThrow(() -> new BadCredentialsException("Неверные данные"));\n        return generateTokens(user);\n    }\n\n    public AuthResponse refresh(String refreshToken) {\n        RefreshToken token = tokenRepo.findByToken(refreshToken)\n            .filter(t -> t.getExpiresAt().isAfter(LocalDateTime.now()))\n            .orElseThrow(() -> new InvalidTokenException("Недействительный токен"));\n        tokenRepo.delete(token);\n        User user = userRepo.findById(token.getUserId()).orElseThrow();\n        return generateTokens(user);\n    }\n\n    private AuthResponse generateTokens(User user) {\n        String accessToken = jwtUtil.generateAccess(user);\n        String refreshToken = UUID.randomUUID().toString();\n        tokenRepo.save(new RefreshToken(refreshToken, user.getId(), LocalDateTime.now().plusDays(7)));\n        return new AuthResponse(accessToken, refreshToken, 900);\n    }\n}',
      explanation: 'Token rotation (удаление старого refresh токена) предотвращает повторное использование. Хранение refresh токенов в БД позволяет инвалидировать их при logout или смене пароля.'
    },
    {
      id: 3,
      title: 'Задача: роли и @PreAuthorize',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте систему ролей ADMIN/MODERATOR/USER с детальным контролем доступа через @PreAuthorize.',
      requirements: [
        'Роли хранятся в БД: User -> Set<Role>',
        '@PreAuthorize("hasRole(\'ADMIN\')") на методах',
        'GET /admin/users — только ADMIN',
        'DELETE /api/posts/{id} — автор поста или ADMIN/MODERATOR',
        'PUT /api/posts/{id}/ban — только MODERATOR и ADMIN',
        'POST /api/posts — любой аутентифицированный',
        'Возвращать 403 с понятным сообщением при отсутствии доступа'
      ],
      hint: '@PreAuthorize("@postSecurityService.canDelete(#id, authentication)") для сложных проверок. postSecurityService — Spring Bean с бизнес-логикой проверки.',
      solution: '// Role entity\npublic enum RoleName { ROLE_USER, ROLE_MODERATOR, ROLE_ADMIN }\n\n// SecurityConfig\n@Bean\npublic UserDetailsService userDetailsService() {\n    return email -> {\n        User user = userRepo.findByEmail(email).orElseThrow();\n        return new org.springframework.security.core.userdetails.User(\n            user.getEmail(), user.getPasswordHash(),\n            user.getRoles().stream().map(r -> new SimpleGrantedAuthority(r.getName()))\n                .collect(Collectors.toList()));\n    };\n}\n\n// PostController\n@DeleteMapping("/{id}")\n@PreAuthorize("hasAnyRole(\'ADMIN\', \'MODERATOR\') or @postSecurity.isOwner(#id, authentication)")\npublic void deletePost(@PathVariable Long id) { service.delete(id); }\n\n@PutMapping("/{id}/ban")\n@PreAuthorize("hasAnyRole(\'ADMIN\', \'MODERATOR\')")\npublic PostResponse banPost(@PathVariable Long id) { return PostResponse.from(service.ban(id)); }\n\n// PostSecurityService\n@Component("postSecurity")\npublic class PostSecurityService {\n    @Autowired PostRepository repo;\n    public boolean isOwner(Long postId, Authentication auth) {\n        return repo.findById(postId)\n            .map(p -> p.getAuthorEmail().equals(auth.getName()))\n            .orElse(false);\n    }\n}',
      explanation: '@PreAuthorize с SpEL выражениями даёт гибкий контроль доступа. Кастомный Bean @postSecurity позволяет инкапсулировать сложные проверки с доступом к БД.'
    },
    {
      id: 4,
      title: 'Задача: OAuth2 с Google',
      type: 'practice',
      difficulty: 'hard',
      description: 'Добавьте вход через Google OAuth2: при первом входе — автоматически создавать пользователя, возвращать JWT токен.',
      requirements: [
        'Добавь spring-boot-starter-oauth2-client',
        'Настрой Google OAuth2 через application.properties',
        'OAuth2SuccessHandler — после успешного OAuth2 входа генерировать JWT и редиректить',
        'CustomOAuth2UserService — загружать пользователя или создавать нового',
        'GET /auth/oauth2/google — начало OAuth2 flow',
        'Хранить в User: googleId, email, name, avatarUrl',
        'Если email уже есть в БД — связать аккаунты'
      ],
      hint: 'OAuth2UserService загружает данные из Google. В SuccessHandler: создай/обнови пользователя, выдай JWT, сделай redirect на фронтенд с ?token=...',
      solution: '# application.properties\nspring.security.oauth2.client.registration.google.client-id=${GOOGLE_CLIENT_ID}\nspring.security.oauth2.client.registration.google.client-secret=${GOOGLE_CLIENT_SECRET}\nspring.security.oauth2.client.registration.google.scope=email,profile\n\n@Service\npublic class CustomOAuth2UserService extends DefaultOAuth2UserService {\n    @Autowired UserRepository userRepo;\n\n    @Override\n    public OAuth2User loadUser(OAuth2UserRequest request) {\n        OAuth2User oAuth2User = super.loadUser(request);\n        String email = oAuth2User.getAttribute("email");\n        String googleId = oAuth2User.getAttribute("sub");\n        String name = oAuth2User.getAttribute("name");\n        String avatar = oAuth2User.getAttribute("picture");\n\n        User user = userRepo.findByEmail(email)\n            .orElseGet(() -> new User(name, email));\n        user.setGoogleId(googleId);\n        user.setAvatarUrl(avatar);\n        userRepo.save(user);\n\n        return new CustomUserPrincipal(user, oAuth2User.getAttributes());\n    }\n}\n\n@Component\npublic class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {\n    @Autowired JwtUtil jwtUtil;\n    @Autowired UserRepository userRepo;\n\n    @Override\n    public void onAuthenticationSuccess(HttpServletRequest req, HttpServletResponse res,\n                                        Authentication auth) throws IOException {\n        CustomUserPrincipal principal = (CustomUserPrincipal) auth.getPrincipal();\n        String token = jwtUtil.generateAccess(principal.getUser());\n        getRedirectStrategy().sendRedirect(req, res,\n            "https://myfrontend.kz/oauth2/callback?token=" + token);\n    }\n}',
      explanation: 'CustomOAuth2UserService перехватывает данные от Google и синхронизирует с локальной БД. SuccessHandler генерирует JWT и редиректирует на фронтенд — SPA получает токен через URL параметр.'
    },
    {
      id: 5,
      title: 'Задача: двухфакторная аутентификация (2FA)',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте опциональную двухфакторную аутентификацию через TOTP (Google Authenticator совместимый).',
      requirements: [
        'Добавь dev.samstevens.totp:totp библиотеку',
        'POST /auth/2fa/enable — генерирует секрет и QR код',
        'POST /auth/2fa/verify — подтверждает включение 2FA',
        'POST /auth/2fa/disable — отключает 2FA',
        'При login если 2FA включена — возвращать { requiresTwoFactor: true, tempToken }',
        'POST /auth/2fa/validate — принимает tempToken + code, возвращает полный JWT',
        'Хранить секрет 2FA в User зашифровано'
      ],
      hint: 'TotpUtil.generateSecret() генерирует секрет. TotpUtil.verify(code, secret) проверяет код. QR код: "otpauth://totp/MyApp:email?secret=SECRET&issuer=MyApp"',
      solution: '@Service\npublic class TwoFactorService {\n    @Autowired UserRepository userRepo;\n    @Autowired JwtUtil jwtUtil;\n\n    public TwoFactorSetupResponse enable(Long userId) {\n        String secret = new DefaultSecretGenerator().generate();\n        String qrUri = String.format(\n            "otpauth://totp/MyApp:%s?secret=%s&issuer=MyApp",\n            userRepo.findById(userId).get().getEmail(), secret);\n        // Временно сохраняем секрет (не подтверждённый)\n        userRepo.saveTempSecret(userId, secret);\n        return new TwoFactorSetupResponse(secret, qrUri);\n    }\n\n    public void verify(Long userId, String code) {\n        User user = userRepo.findById(userId).orElseThrow();\n        boolean valid = new DefaultCodeVerifier(\n            new DefaultCodeGenerator(), new SystemTimeProvider())\n            .isValidCode(user.getTempTwoFactorSecret(), code);\n        if (!valid) throw new InvalidCodeException("Неверный код");\n        user.setTwoFactorSecret(user.getTempTwoFactorSecret());\n        user.setTwoFactorEnabled(true);\n        userRepo.save(user);\n    }\n\n    // В AuthService.login() — если twoFactorEnabled:\n    // return AuthResponse.requiresTwoFactor(jwtUtil.generateTempToken(user))\n}',
      explanation: 'TOTP коды меняются каждые 30 секунд и вычисляются локально на устройстве пользователя. Временный токен после login позволяет идентифицировать пользователя при вводе кода без полного JWT.'
    },
    {
      id: 6,
      title: 'Задача: Password Reset через email',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте полный flow сброса пароля: запрос сброса, отправка email со ссылкой, подтверждение нового пароля.',
      requirements: [
        'POST /auth/forgot-password — принимает email, отправляет письмо со ссылкой',
        'Ссылка: https://myapp.kz/reset-password?token=UUID',
        'Токен хранится в БД (PasswordResetToken): token, userId, expiresAt (1 час)',
        'GET /auth/reset-password?token=X — проверить валидность токена',
        'POST /auth/reset-password — принимает token + newPassword, меняет пароль',
        'После использования токен удаляется',
        'Пользователю без email регистрации (OAuth2) — возвращать подходящее сообщение'
      ],
      hint: 'Не раскрывай в ответе, существует ли email. Возвращай одинаковый ответ: "Если email существует, письмо отправлено". Это защита от перебора email.',
      solution: '@Service\npublic class PasswordResetService {\n    @Autowired UserRepository userRepo;\n    @Autowired PasswordResetTokenRepository tokenRepo;\n    @Autowired EmailService emailService;\n    @Autowired PasswordEncoder encoder;\n\n    public void requestReset(String email) {\n        // Не раскрываем, существует ли email!\n        userRepo.findByEmail(email).ifPresent(user -> {\n            tokenRepo.deleteByUserId(user.getId());\n            String token = UUID.randomUUID().toString();\n            tokenRepo.save(new PasswordResetToken(token, user.getId(),\n                LocalDateTime.now().plusHours(1)));\n            emailService.sendPasswordReset(email, token);\n        });\n    }\n\n    public void resetPassword(String token, String newPassword) {\n        PasswordResetToken resetToken = tokenRepo.findByToken(token)\n            .filter(t -> t.getExpiresAt().isAfter(LocalDateTime.now()))\n            .orElseThrow(() -> new InvalidTokenException("Токен недействителен или истёк"));\n\n        User user = userRepo.findById(resetToken.getUserId()).orElseThrow();\n        user.setPasswordHash(encoder.encode(newPassword));\n        userRepo.save(user);\n        tokenRepo.delete(resetToken);\n        // Инвалидировать все refresh токены пользователя\n        refreshTokenRepo.deleteByUserId(user.getId());\n    }\n}',
      explanation: 'Одинаковый ответ при существующем и несуществующем email — защита от user enumeration атаки. Удаление refresh токенов при смене пароля завершает все активные сессии.'
    },
    {
      id: 7,
      title: 'Задача: API Key аутентификация для сервисов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте API Key аутентификацию для машинного взаимодействия: генерация ключей, хранение в БД, ограничение прав.',
      requirements: [
        'ApiKey entity: id, keyHash, name, userId, permissions (Set<String>), active, lastUsed',
        'POST /api/keys — генерировать новый API key (возвращается один раз)',
        'DELETE /api/keys/{id} — отозвать ключ',
        'ApiKeyFilter — проверять X-API-Key заголовок',
        'Хешировать ключ через SHA-256 перед сохранением в БД',
        'API ключ с permission "read" — только GET запросы',
        'Обновлять lastUsed при каждом запросе'
      ],
      hint: 'Генерируй ключ: Base64.encodeToString(SecureRandom().generateSeed(32)). Хешируй для хранения: DigestUtils.sha256Hex(apiKey). Сравнивай хеши.',
      solution: '@Component\npublic class ApiKeyFilter extends OncePerRequestFilter {\n    @Autowired ApiKeyRepository apiKeyRepo;\n    @Autowired UserRepository userRepo;\n\n    @Override\n    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res,\n                                    FilterChain chain) throws IOException, ServletException {\n        String apiKey = req.getHeader("X-API-Key");\n        if (apiKey != null) {\n            String keyHash = DigestUtils.sha256Hex(apiKey);\n            apiKeyRepo.findByKeyHashAndActiveTrue(keyHash).ifPresent(key -> {\n                if ("read".equals(key.getPermissions().contains("read"))\n                    && !req.getMethod().equals("GET")) {\n                    // Нет прав\n                    return;\n                }\n                key.setLastUsed(LocalDateTime.now());\n                apiKeyRepo.save(key);\n                User user = userRepo.findById(key.getUserId()).orElseThrow();\n                UsernamePasswordAuthenticationToken auth =\n                    new UsernamePasswordAuthenticationToken(user.getEmail(), null,\n                        List.of(new SimpleGrantedAuthority("API_KEY")));\n                SecurityContextHolder.getContext().setAuthentication(auth);\n            });\n        }\n        chain.doFilter(req, res);\n    }\n}',
      explanation: 'API ключ хранится как SHA-256 хеш — если БД утечёт, ключи нельзя восстановить. Генерированный ключ показывается пользователю один раз. OncePerRequestFilter гарантирует однократное выполнение.'
    },
    {
      id: 8,
      title: 'Задача: Rate Limiting с Spring Security',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте защиту от brute force атак: блокировка IP после N неудачных попыток входа, временная блокировка аккаунта.',
      requirements: [
        'AuthenticationFailureListener — слушает BadCredentialsException',
        'После 5 неудачных попыток — блокировать IP на 15 минут через Redis',
        'LoginAttemptService: хранить счётчики в Redis с TTL',
        'Заблокированный IP получает 429 с Retry-After',
        'Также блокировать сам аккаунт после 10 неудачных попыток',
        'GET /admin/blocked-ips — список заблокированных IP (только ADMIN)',
        'POST /admin/unblock/{ip} — разблокировать IP вручную'
      ],
      hint: 'ApplicationEventPublisher.publish(new AuthFailureEvent(ip, email)) после неудачного входа. @EventListener в LoginAttemptService обновляет счётчик.',
      solution: '@Service\npublic class LoginAttemptService {\n    @Autowired StringRedisTemplate redis;\n    private static final int MAX_ATTEMPTS = 5;\n    private static final int BLOCK_MINUTES = 15;\n\n    public boolean isBlocked(String ip) {\n        String value = redis.opsForValue().get("login_attempts:" + ip);\n        return value != null && Integer.parseInt(value) >= MAX_ATTEMPTS;\n    }\n\n    public void recordFailure(String ip) {\n        String key = "login_attempts:" + ip;\n        Long count = redis.opsForValue().increment(key);\n        if (count == 1) redis.expire(key, Duration.ofMinutes(BLOCK_MINUTES));\n        if (count >= MAX_ATTEMPTS) {\n            redis.opsForValue().set("blocked:" + ip, "1", Duration.ofMinutes(BLOCK_MINUTES));\n            log.warn("IP заблокирован после {} попыток: {}", count, ip);\n        }\n    }\n\n    public void resetAttempts(String ip) {\n        redis.delete("login_attempts:" + ip);\n        redis.delete("blocked:" + ip);\n    }\n}\n\n// В SecurityConfig добавить фильтр проверки блокировки\n// перед аутентификацией',
      explanation: 'Redis TTL автоматически сбрасывает счётчик через 15 минут. Отдельный ключ "blocked:" позволяет проверять блокировку без подсчёта. Логирование блокировок помогает выявлять реальные атаки.'
    },
    {
      id: 9,
      title: 'Задача: Security тесты с @WithMockUser',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напишите тесты Spring Security: проверить доступность публичных эндпоинтов, защиту приватных, работу ролей.',
      requirements: [
        '@WebMvcTest с @WithMockUser для аутентифицированных тестов',
        'Тест: GET /api/posts возвращает 200 без аутентификации',
        'Тест: POST /api/posts возвращает 401 без токена',
        'Тест: POST /api/posts возвращает 201 с @WithMockUser',
        'Тест: DELETE /api/posts/{id} с ROLE_USER и чужим постом — 403',
        'Тест: DELETE /api/posts/{id} с ROLE_ADMIN — 204',
        'Тест: /admin/users с ROLE_USER — 403, с ROLE_ADMIN — 200'
      ],
      hint: '@WithMockUser(roles = "ADMIN") устанавливает роль. @WithMockUser(username = "user@mail.ru") устанавливает principal.getName().',
      solution: '@WebMvcTest(PostController.class)\nclass PostControllerSecurityTest {\n    @Autowired MockMvc mockMvc;\n    @MockBean PostService service;\n    @MockBean PostSecurityService postSecurity;\n\n    @Test\n    void publicListIsAccessibleWithoutAuth() throws Exception {\n        when(service.findPublished(any())).thenReturn(Page.empty());\n        mockMvc.perform(get("/api/posts")).andExpect(status().isOk());\n    }\n\n    @Test\n    void createRequiresAuth() throws Exception {\n        mockMvc.perform(post("/api/posts").contentType(APPLICATION_JSON).content("{}"))\n            .andExpect(status().isUnauthorized());\n    }\n\n    @Test @WithMockUser\n    void authenticatedUserCanCreate() throws Exception {\n        when(service.create(any(), any())).thenReturn(new Post());\n        mockMvc.perform(post("/api/posts").contentType(APPLICATION_JSON)\n                .content("{\"title\":\"Test\",\"content\":\"Content\"}"))\n            .andExpect(status().isCreated());\n    }\n\n    @Test @WithMockUser(roles = "ADMIN")\n    void adminCanDelete() throws Exception {\n        when(postSecurity.isOwner(any(), any())).thenReturn(false);\n        doNothing().when(service).delete(1L);\n        mockMvc.perform(delete("/api/posts/1")).andExpect(status().isNoContent());\n    }\n}',
      explanation: '@WithMockUser создаёт SecurityContext без JWT. Тестирование Security правил отдельно от бизнес-логики — чёткая ответственность тестов. @MockBean заменяет реальные сервисы.'
    },
    {
      id: 10,
      title: 'Задача: интеграционный тест полного Security flow',
      type: 'practice',
      difficulty: 'hard',
      description: 'Напишите end-to-end интеграционный тест полного Security flow: регистрация, login, использование токена, refresh, logout.',
      requirements: [
        '@SpringBootTest(webEnvironment = RANDOM_PORT) с Testcontainers PostgreSQL',
        'Тест 1: регистрация — проверить что пользователь создан',
        'Тест 2: login — проверить accessToken и refreshToken в ответе',
        'Тест 3: защищённый запрос с токеном — 200',
        'Тест 4: защищённый запрос без токена — 401',
        'Тест 5: refresh токена — новый accessToken',
        'Тест 6: повторный refresh с тем же токеном — 401 (rotation)',
        'Тест 7: logout — токен инвалидирован'
      ],
      hint: 'Сохраняй токены между тестами в переменные класса. @TestMethodOrder(MethodOrderer.OrderAnnotation.class) для порядка тестов.',
      solution: '@SpringBootTest(webEnvironment = RANDOM_PORT)\n@Testcontainers\n@TestMethodOrder(MethodOrderer.OrderAnnotation.class)\nclass AuthFlowIT extends AbstractIT {\n    @Autowired TestRestTemplate rest;\n    static String accessToken;\n    static String refreshToken;\n\n    @Test @Order(1)\n    void registerUser() {\n        var req = new RegisterRequest("Дана", "dana@mail.ru", "Password123!");\n        var res = rest.postForEntity("/auth/register", req, AuthResponse.class);\n        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.CREATED);\n        accessToken = res.getBody().getAccessToken();\n        refreshToken = res.getBody().getRefreshToken();\n    }\n\n    @Test @Order(2)\n    void accessProtectedWithToken() {\n        var headers = new HttpHeaders();\n        headers.setBearerAuth(accessToken);\n        var res = rest.exchange("/api/profile", HttpMethod.GET, new HttpEntity<>(headers), UserResponse.class);\n        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.OK);\n    }\n\n    @Test @Order(3)\n    void accessWithoutToken_Returns401() {\n        var res = rest.getForEntity("/api/profile", String.class);\n        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);\n    }\n\n    @Test @Order(4)\n    void refreshToken() {\n        var req = new RefreshRequest(refreshToken);\n        var res = rest.postForEntity("/auth/refresh", req, AuthResponse.class);\n        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.OK);\n        // Новый refresh токен\n        refreshToken = res.getBody().getRefreshToken();\n    }\n}',
      explanation: '@TestMethodOrder сохраняет порядок тестов. static переменные разделяются между методами одного класса. Тест rotation: после refresh старый токен не работает — проверяется безопасность.'
    }
  ]
}
