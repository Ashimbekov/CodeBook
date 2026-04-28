export default {
  id: 59,
  title: 'Практикум: JWT и авторизация',
  description: 'Практические задачи по JWT аутентификации и авторизации в Spring Boot: генерация токенов, фильтры безопасности, роли, refresh tokens, блокировка аккаунтов и API ключи.',
  lessons: [
    {
      id: 1,
      title: 'Задача: Генерация JWT токена',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создайте JwtService для генерации и валидации JWT токенов с использованием библиотеки io.jsonwebtoken (jjwt).',
      requirements: [
        'Класс JwtService с методами generateToken(UserDetails) и validateToken(String, UserDetails)',
        'Метод extractUsername(String token) для извлечения subject из токена',
        'Настраиваемый secret key и время жизни токена через @Value',
        'Использование алгоритма HS256 для подписи токена'
      ],
      expectedOutput: 'generateToken(user) → "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyQGV4YW1wbGUuY29tIiwiaWF0IjoxNzA5...\n\nextractUsername(token) → "user@example.com"\n\nvalidateToken(token, userDetails) → true (если username совпадает и токен не истёк)',
      hint: 'Используйте Jwts.builder() для создания токена и Jwts.parserBuilder() для парсинга. Для secret key используйте Keys.hmacShaKeyFor().',
      solution: `import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("\${jwt.secret}")
    private String secretKey;

    @Value("\${jwt.expiration:86400000}")
    private long jwtExpiration;

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}`,
      explanation: 'JwtService инкапсулирует всю логику работы с JWT. Метод generateToken создаёт токен с subject (username), временем создания и истечения. Метод validateToken проверяет совпадение username и не истёк ли токен. Ключ подписи декодируется из Base64-строки и используется для HMAC-SHA256.'
    },
    {
      id: 2,
      title: 'Задача: JWT фильтр валидации',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реализуйте фильтр JwtAuthenticationFilter, который перехватывает каждый HTTP-запрос, извлекает JWT из заголовка Authorization и устанавливает аутентификацию в SecurityContext.',
      requirements: [
        'Наследование от OncePerRequestFilter для гарантии однократного выполнения',
        'Извлечение токена из заголовка Authorization: Bearer <token>',
        'Валидация токена через JwtService и установка Authentication в SecurityContextHolder',
        'Пропуск фильтра если заголовок отсутствует или не начинается с "Bearer "'
      ],
      expectedOutput: 'GET /api/users (Authorization: Bearer eyJhbGc...) → фильтр извлекает токен, валидирует, устанавливает Authentication → запрос проходит\n\nGET /api/users (без заголовка) → фильтр пропускает → запрос передаётся дальше (Security решит 401)',
      hint: 'Используйте request.getHeader("Authorization") для получения заголовка. UsernamePasswordAuthenticationToken создаётся с userDetails, null (credentials) и authorities.',
      solution: `import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = authHeader.substring(7);
        final String username = jwtService.extractUsername(jwt);

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            if (jwtService.validateToken(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);
    }
}`,
      explanation: 'OncePerRequestFilter гарантирует, что фильтр выполняется один раз за запрос. Фильтр извлекает JWT из заголовка Bearer, валидирует через JwtService, загружает UserDetails и устанавливает UsernamePasswordAuthenticationToken в SecurityContextHolder. Это позволяет Spring Security знать, что пользователь аутентифицирован.'
    },
    {
      id: 3,
      title: 'Задача: Login и Register эндпоинты',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте контроллер AuthController с эндпоинтами регистрации и логина, возвращающими JWT токен.',
      requirements: [
        'POST /api/auth/register — регистрация с email, password, firstName, lastName',
        'POST /api/auth/login — аутентификация по email и password, возврат JWT',
        'DTO классы: RegisterRequest, LoginRequest, AuthResponse (с token)',
        'Хеширование пароля при регистрации через PasswordEncoder'
      ],
      expectedOutput: 'POST /api/auth/register {email:"user@test.com", password:"pass123", firstName:"John", lastName:"Doe"}\n→ 200 { "token": "eyJhbGciOiJIUzI1NiJ9..." }\n\nPOST /api/auth/login {email:"user@test.com", password:"pass123"}\n→ 200 { "token": "eyJhbGciOiJIUzI1NiJ9..." }\n\nPOST /api/auth/login {email:"user@test.com", password:"wrong"}\n→ 401 { "message": "Неверные учётные данные" }',
      hint: 'Используйте AuthenticationManager.authenticate() для проверки учётных данных при логине. При регистрации сохраните пользователя с закодированным паролем и верните токен.',
      solution: `// --- DTOs ---
@Data
public class RegisterRequest {
    @NotBlank @Email
    private String email;
    @NotBlank @Size(min = 6)
    private String password;
    @NotBlank
    private String firstName;
    @NotBlank
    private String lastName;
}

@Data
public class LoginRequest {
    @NotBlank @Email
    private String email;
    @NotBlank
    private String password;
}

@Data @AllArgsConstructor @NoArgsConstructor
public class AuthResponse {
    private String token;
}

// --- Entity ---
@Entity
@Table(name = "users")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class User implements UserDetails {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true)
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    @Enumerated(EnumType.STRING)
    private Role role;

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
    public boolean isEnabled() { return true; }
}

// --- Controller ---
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email уже зарегистрирован");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .role(Role.USER)
                .build();

        userRepository.save(user);
        String token = jwtService.generateToken(user);
        return ResponseEntity.ok(new AuthResponse(token));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(), request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        String token = jwtService.generateToken(user);
        return ResponseEntity.ok(new AuthResponse(token));
    }
}`,
      explanation: 'Register создаёт нового пользователя с хешированным паролем и возвращает JWT. Login использует AuthenticationManager для проверки учётных данных — если пароль неверный, Spring бросит BadCredentialsException (401). При успешной аутентификации генерируется новый JWT токен.'
    },
    {
      id: 4,
      title: 'Задача: Ролевая модель доступа',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте систему ролей с разграничением доступа к эндпоинтам через @PreAuthorize.',
      requirements: [
        'Enum Role: USER, MODERATOR, ADMIN с иерархией привилегий',
        'Entity UserRole с ManyToMany связью между User и Role',
        'Защита эндпоинтов через @PreAuthorize("hasRole(\'ADMIN\')")',
        'Добавление ролей в JWT claims и их извлечение при валидации'
      ],
      expectedOutput: 'GET /api/admin/users (role=ADMIN) → 200 [{id:1, email:"admin@test.com", roles:["ADMIN"]}]\nGET /api/admin/users (role=USER) → 403 Forbidden\n\nDELETE /api/admin/users/1 (role=ADMIN) → 204 No Content\nDELETE /api/admin/users/1 (role=USER) → 403 Forbidden\n\nGET /api/moderator/posts (role=MODERATOR) → 200 [...]\nGET /api/moderator/posts (role=USER) → 403 Forbidden',
      hint: 'Добавьте роли в JWT claims при генерации: .claim("roles", roles). При валидации извлеките роли и создайте GrantedAuthority для каждой роли.',
      solution: `// --- Role Entity ---
@Entity
@Table(name = "roles")
@Data @NoArgsConstructor @AllArgsConstructor
public class RoleEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Enumerated(EnumType.STRING)
    @Column(unique = true)
    private RoleName name;
}

public enum RoleName { USER, MODERATOR, ADMIN }

// --- User с ролями ---
@Entity
@Table(name = "users")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class User implements UserDetails {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String email;
    private String password;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<RoleEntity> roles = new HashSet<>();

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getName().name()))
                .collect(Collectors.toSet());
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
    public boolean isEnabled() { return true; }
}

// --- JwtService с ролями ---
public String generateToken(User user) {
    List<String> roles = user.getRoles().stream()
            .map(r -> r.getName().name())
            .collect(Collectors.toList());

    return Jwts.builder()
            .setSubject(user.getEmail())
            .claim("roles", roles)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
            .signWith(getSignInKey(), SignatureAlgorithm.HS256)
            .compact();
}

// --- Admin Controller ---
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = userRepository.findAll().stream()
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

// --- SecurityConfig ---
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/moderator/**").hasAnyRole("MODERATOR", "ADMIN")
                .anyRequest().authenticated())
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}`,
      explanation: 'ManyToMany связь между User и Role позволяет пользователю иметь несколько ролей. Роли добавляются в JWT claims и используются для создания GrantedAuthority. @PreAuthorize на уровне класса или метода проверяет наличие роли. @EnableMethodSecurity активирует аннотации безопасности на уровне методов.'
    },
    {
      id: 5,
      title: 'Задача: Refresh Token механизм',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте механизм refresh токенов: короткоживущий access token и долгоживущий refresh token для обновления сессии.',
      requirements: [
        'Entity RefreshToken: id, token (UUID), user, expiryDate',
        'Access token с коротким сроком жизни (15 минут)',
        'Refresh token с длинным сроком жизни (7 дней), хранится в БД',
        'POST /api/auth/refresh — обновление access token по refresh token'
      ],
      expectedOutput: 'POST /api/auth/login → { "accessToken": "eyJ...", "refreshToken": "550e8400-e29b-41d4-a716-446655440000" }\n\nPOST /api/auth/refresh { "refreshToken": "550e8400-..." }\n→ { "accessToken": "eyJ... (новый)", "refreshToken": "550e8400-..." }\n\nPOST /api/auth/refresh { "refreshToken": "expired-token" }\n→ 401 { "message": "Refresh token истёк. Пожалуйста, войдите снова" }',
      hint: 'Refresh token — это UUID, сохранённый в БД с привязкой к пользователю. При обновлении проверьте что refresh token существует и не истёк.',
      solution: `// --- RefreshToken Entity ---
@Entity
@Table(name = "refresh_tokens")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class RefreshToken {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String token;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @Column(nullable = false)
    private Instant expiryDate;

    public boolean isExpired() {
        return expiryDate.isBefore(Instant.now());
    }
}

// --- RefreshTokenService ---
@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    @Value("\${jwt.refresh-expiration:604800000}")
    private long refreshExpiration;

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;

    public RefreshToken createRefreshToken(Long userId) {
        refreshTokenRepository.deleteByUserId(userId);

        RefreshToken refreshToken = RefreshToken.builder()
                .user(userRepository.findById(userId).orElseThrow())
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusMillis(refreshExpiration))
                .build();

        return refreshTokenRepository.save(refreshToken);
    }

    public RefreshToken verifyRefreshToken(String token) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Refresh token не найден"));

        if (refreshToken.isExpired()) {
            refreshTokenRepository.delete(refreshToken);
            throw new RuntimeException("Refresh token истёк. Пожалуйста, войдите снова");
        }

        return refreshToken;
    }
}

// --- AuthController обновлённый ---
@PostMapping("/login")
public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
    authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

    User user = userRepository.findByEmail(request.getEmail()).orElseThrow();
    String accessToken = jwtService.generateToken(user);
    RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());

    return ResponseEntity.ok(new AuthResponse(accessToken, refreshToken.getToken()));
}

@PostMapping("/refresh")
public ResponseEntity<AuthResponse> refreshToken(@RequestBody RefreshTokenRequest request) {
    RefreshToken refreshToken = refreshTokenService.verifyRefreshToken(request.getRefreshToken());
    User user = refreshToken.getUser();
    String newAccessToken = jwtService.generateToken(user);

    return ResponseEntity.ok(new AuthResponse(newAccessToken, refreshToken.getToken()));
}`,
      explanation: 'Refresh token — это UUID, хранящийся в БД. Access token живёт 15 минут, refresh token — 7 дней. При истечении access token клиент отправляет refresh token для получения нового access token без повторного ввода пароля. При истечении refresh token пользователь должен войти заново.'
    },
    {
      id: 6,
      title: 'Задача: Хеширование паролей с BCrypt',
      type: 'practice',
      difficulty: 'easy',
      description: 'Настройте хеширование паролей с BCryptPasswordEncoder, включая настройку силы хеширования и проверку паролей.',
      requirements: [
        'Конфигурация BCryptPasswordEncoder bean с настраиваемой strength',
        'Сервис для смены пароля с проверкой текущего пароля',
        'Валидация сложности пароля через кастомный валидатор',
        'Endpoint POST /api/users/change-password'
      ],
      expectedOutput: 'POST /api/users/change-password { "currentPassword":"old123", "newPassword":"newSecure456!" }\n→ 200 { "message": "Пароль успешно изменён" }\n\nPOST /api/users/change-password { "currentPassword":"wrong", "newPassword":"newSecure456!" }\n→ 400 { "message": "Текущий пароль неверен" }\n\nPOST /api/users/change-password { "currentPassword":"old123", "newPassword":"123" }\n→ 400 { "message": "Пароль должен содержать минимум 8 символов, заглавную букву, цифру и спецсимвол" }',
      hint: 'BCryptPasswordEncoder.matches(rawPassword, encodedPassword) проверяет совпадение пароля с хешем. Для валидации сложности используйте regex паттерн.',
      solution: `// --- SecurityConfig ---
@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12); // strength = 12 (по умолчанию 10)
    }
}

// --- Password Validator ---
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = StrongPasswordValidator.class)
public @interface StrongPassword {
    String message() default "Пароль должен содержать минимум 8 символов, заглавную букву, цифру и спецсимвол";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

public class StrongPasswordValidator implements ConstraintValidator<StrongPassword, String> {
    private static final String PASSWORD_PATTERN =
            "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\\\d)(?=.*[@$!%*?&])[A-Za-z\\\\d@$!%*?&]{8,}$";

    @Override
    public boolean isValid(String password, ConstraintValidatorContext context) {
        if (password == null) return false;
        return password.matches(PASSWORD_PATTERN);
    }
}

// --- DTO ---
@Data
public class ChangePasswordRequest {
    @NotBlank
    private String currentPassword;
    @NotBlank @StrongPassword
    private String newPassword;
}

// --- Service ---
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Текущий пароль неверен");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}

// --- Controller ---
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/change-password")
    public ResponseEntity<Map<String, String>> changePassword(
            @AuthenticationPrincipal User currentUser,
            @Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(currentUser.getId(), request);
        return ResponseEntity.ok(Map.of("message", "Пароль успешно изменён"));
    }
}`,
      explanation: 'BCryptPasswordEncoder с strength=12 означает 2^12 = 4096 раундов хеширования, что замедляет brute-force атаки. Метод matches() сравнивает raw-пароль с хешем без декодирования. Кастомный валидатор @StrongPassword проверяет сложность пароля через regex перед хешированием.'
    },
    {
      id: 7,
      title: 'Задача: Блокировка аккаунта после неудачных попыток',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте механизм блокировки аккаунта после 5 неудачных попыток входа с автоматической разблокировкой через 30 минут.',
      requirements: [
        'Поля в User: failedAttempts (int), lockUntil (LocalDateTime)',
        'Увеличение счётчика при каждом неудачном входе',
        'Блокировка на 30 минут после 5 неудачных попыток',
        'Сброс счётчика при успешном входе и автоматическая разблокировка по таймеру'
      ],
      expectedOutput: 'POST /api/auth/login (wrong password, attempt 1-4) → 401 { "message":"Неверные данные. Осталось попыток: 4/3/2/1" }\n\nPOST /api/auth/login (wrong password, attempt 5) → 423 { "message":"Аккаунт заблокирован на 30 минут" }\n\nPOST /api/auth/login (correct, but locked) → 423 { "message":"Аккаунт заблокирован. Попробуйте через 25 мин" }\n\n(после 30 минут) POST /api/auth/login (correct) → 200 { "token":"..." }',
      hint: 'Используйте @EventListener для AuthenticationFailureBadCredentialsEvent и AuthenticationSuccessEvent. Проверяйте lockUntil.isAfter(LocalDateTime.now()) для определения блокировки.',
      solution: `// --- User с полями блокировки ---
@Entity
@Table(name = "users")
public class User implements UserDetails {
    // ... остальные поля
    private int failedAttempts = 0;
    private LocalDateTime lockUntil;

    public boolean isAccountLocked() {
        return lockUntil != null && lockUntil.isAfter(LocalDateTime.now());
    }

    @Override
    public boolean isAccountNonLocked() {
        return !isAccountLocked();
    }
}

// --- LoginAttemptService ---
@Service
@RequiredArgsConstructor
public class LoginAttemptService {

    private static final int MAX_ATTEMPTS = 5;
    private static final int LOCK_DURATION_MINUTES = 30;

    private final UserRepository userRepository;

    @Transactional
    public void loginFailed(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) return;

        int newFailedAttempts = user.getFailedAttempts() + 1;
        user.setFailedAttempts(newFailedAttempts);

        if (newFailedAttempts >= MAX_ATTEMPTS) {
            user.setLockUntil(LocalDateTime.now().plusMinutes(LOCK_DURATION_MINUTES));
        }

        userRepository.save(user);
    }

    @Transactional
    public void loginSucceeded(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) return;

        user.setFailedAttempts(0);
        user.setLockUntil(null);
        userRepository.save(user);
    }

    public int getRemainingAttempts(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) return MAX_ATTEMPTS;
        return MAX_ATTEMPTS - user.getFailedAttempts();
    }
}

// --- AuthController с блокировкой ---
@PostMapping("/login")
public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
    User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new BadCredentialsException("Неверные данные"));

    if (user.isAccountLocked()) {
        long minutesLeft = ChronoUnit.MINUTES.between(LocalDateTime.now(), user.getLockUntil());
        return ResponseEntity.status(423)
                .body(Map.of("message", "Аккаунт заблокирован. Попробуйте через " + minutesLeft + " мин"));
    }

    try {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        loginAttemptService.loginSucceeded(request.getEmail());
        String token = jwtService.generateToken(user);
        return ResponseEntity.ok(new AuthResponse(token));
    } catch (BadCredentialsException e) {
        loginAttemptService.loginFailed(request.getEmail());
        int remaining = loginAttemptService.getRemainingAttempts(request.getEmail());
        if (remaining <= 0) {
            return ResponseEntity.status(423)
                    .body(Map.of("message", "Аккаунт заблокирован на 30 минут"));
        }
        return ResponseEntity.status(401)
                .body(Map.of("message", "Неверные данные. Осталось попыток: " + remaining));
    }
}`,
      explanation: 'Механизм блокировки защищает от brute-force атак. Счётчик failedAttempts увеличивается при каждой неудачной попытке. После 5 неудач устанавливается lockUntil = now + 30 минут. При проверке блокировки сравниваем lockUntil с текущим временем. При успешном входе сбрасываем счётчик и lockUntil.'
    },
    {
      id: 8,
      title: 'Задача: Remember me / постоянные сессии',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте функцию "Запомнить меня" с хранением persistent token в базе данных для длительных сессий.',
      requirements: [
        'Entity PersistentLogin: id, series, token, username, lastUsed',
        'Генерация persistent token при логине с флагом rememberMe=true',
        'Автоматическая аутентификация по persistent token при истечении JWT',
        'Endpoint DELETE /api/auth/sessions для отзыва всех сессий'
      ],
      expectedOutput: 'POST /api/auth/login { "email":"user@test.com", "password":"pass", "rememberMe":true }\n→ 200 { "accessToken":"eyJ...", "refreshToken":"...", "rememberMeToken":"abc123-series:def456-token" }\n\nDELETE /api/auth/sessions\n→ 200 { "message":"Все сессии завершены", "sessionsRevoked": 3 }',
      hint: 'Используйте series-based token: series (неизменный) + token (обновляется при каждом использовании). Это позволяет обнаружить кражу токена.',
      solution: `// --- PersistentLogin Entity ---
@Entity
@Table(name = "persistent_logins")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class PersistentLogin {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String series;

    @Column(nullable = false)
    private String token;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private LocalDateTime lastUsed;

    @Column(nullable = false)
    private LocalDateTime expiryDate;
}

// --- PersistentLoginService ---
@Service
@RequiredArgsConstructor
public class PersistentLoginService {

    private static final int REMEMBER_ME_DAYS = 30;

    private final PersistentLoginRepository persistentLoginRepository;
    private final UserDetailsService userDetailsService;

    public PersistentLogin createPersistentLogin(String username) {
        PersistentLogin login = PersistentLogin.builder()
                .series(UUID.randomUUID().toString())
                .token(UUID.randomUUID().toString())
                .username(username)
                .lastUsed(LocalDateTime.now())
                .expiryDate(LocalDateTime.now().plusDays(REMEMBER_ME_DAYS))
                .build();
        return persistentLoginRepository.save(login);
    }

    public UserDetails validatePersistentToken(String series, String token) {
        PersistentLogin login = persistentLoginRepository.findBySeries(series)
                .orElseThrow(() -> new RuntimeException("Сессия не найдена"));

        if (login.getExpiryDate().isBefore(LocalDateTime.now())) {
            persistentLoginRepository.delete(login);
            throw new RuntimeException("Сессия истекла");
        }

        if (!login.getToken().equals(token)) {
            persistentLoginRepository.deleteByUsername(login.getUsername());
            throw new RuntimeException("Возможна кража токена. Все сессии отозваны");
        }

        login.setToken(UUID.randomUUID().toString());
        login.setLastUsed(LocalDateTime.now());
        persistentLoginRepository.save(login);

        return userDetailsService.loadUserByUsername(login.getUsername());
    }

    @Transactional
    public int revokeAllSessions(String username) {
        return persistentLoginRepository.deleteAllByUsername(username);
    }
}

// --- Controller ---
@DeleteMapping("/sessions")
public ResponseEntity<Map<String, Object>> revokeSessions(
        @AuthenticationPrincipal User currentUser) {
    int revoked = persistentLoginService.revokeAllSessions(currentUser.getUsername());
    return ResponseEntity.ok(Map.of(
            "message", "Все сессии завершены",
            "sessionsRevoked", revoked));
}`,
      explanation: 'Series-based persistent token состоит из двух частей: series (постоянная) и token (обновляется при каждом использовании). Если злоумышленник украл токен и использовал его, при следующей попытке пользователя token не совпадёт — это означает кражу, и все сессии отзываются.'
    },
    {
      id: 9,
      title: 'Задача: Аутентификация по API ключу',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте аутентификацию по API ключу через заголовок X-API-Key для внешних интеграций.',
      requirements: [
        'Entity ApiKey: id, keyValue (хешированный), name, user, createdAt, expiresAt, active',
        'ApiKeyFilter для извлечения и валидации ключа из заголовка X-API-Key',
        'Endpoint POST /api/keys — генерация нового API ключа (показывается один раз)',
        'Поддержка нескольких ключей у одного пользователя с возможностью отзыва'
      ],
      expectedOutput: 'POST /api/keys { "name":"My Integration" }\n→ 201 { "key":"sk_live_abc123def456...", "name":"My Integration", "expiresAt":"2025-03-10" }\n\nGET /api/data (X-API-Key: sk_live_abc123def456...)\n→ 200 { "data": [...] }\n\nDELETE /api/keys/1 → 200 { "message":"API ключ отозван" }\n\nGET /api/data (X-API-Key: sk_live_abc123def456...) → 401 Unauthorized',
      hint: 'Хешируйте API ключ перед сохранением в БД (как пароль). При валидации хешируйте входящий ключ и ищите в БД. Используйте prefix для быстрого поиска.',
      solution: `// --- ApiKey Entity ---
@Entity
@Table(name = "api_keys")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ApiKey {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    @Column(unique = true)
    private String keyPrefix; // первые 8 символов для поиска

    private String keyHash; // SHA-256 хеш полного ключа

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    private boolean active = true;
}

// --- ApiKeyService ---
@Service
@RequiredArgsConstructor
public class ApiKeyService {

    private final ApiKeyRepository apiKeyRepository;
    private final UserRepository userRepository;

    public ApiKeyResponse generateApiKey(Long userId, String name) {
        String rawKey = "sk_live_" + UUID.randomUUID().toString().replace("-", "");
        String prefix = rawKey.substring(0, 16);
        String hash = DigestUtils.sha256Hex(rawKey);

        ApiKey apiKey = ApiKey.builder()
                .name(name)
                .keyPrefix(prefix)
                .keyHash(hash)
                .user(userRepository.findById(userId).orElseThrow())
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusDays(90))
                .active(true)
                .build();

        apiKeyRepository.save(apiKey);
        return new ApiKeyResponse(rawKey, name, apiKey.getExpiresAt());
    }

    public Optional<User> validateApiKey(String rawKey) {
        String prefix = rawKey.substring(0, 16);
        String hash = DigestUtils.sha256Hex(rawKey);

        return apiKeyRepository.findByKeyPrefixAndKeyHashAndActiveTrue(prefix, hash)
                .filter(key -> key.getExpiresAt().isAfter(LocalDateTime.now()))
                .map(ApiKey::getUser);
    }

    @Transactional
    public void revokeApiKey(Long keyId, Long userId) {
        ApiKey key = apiKeyRepository.findByIdAndUserId(keyId, userId)
                .orElseThrow(() -> new RuntimeException("API ключ не найден"));
        key.setActive(false);
        apiKeyRepository.save(key);
    }
}

// --- ApiKeyFilter ---
@Component
@RequiredArgsConstructor
public class ApiKeyFilter extends OncePerRequestFilter {

    private final ApiKeyService apiKeyService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String apiKey = request.getHeader("X-API-Key");

        if (apiKey != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            Optional<User> user = apiKeyService.validateApiKey(apiKey);
            user.ifPresent(u -> {
                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(u, null, u.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(auth);
            });
        }

        filterChain.doFilter(request, response);
    }
}`,
      explanation: 'API ключ генерируется как случайная строка с префиксом sk_live_. Ключ хешируется SHA-256 перед сохранением. Prefix (первые 16 символов) хранится отдельно для быстрого поиска. При валидации входящий ключ хешируется и сравнивается с БД. Ключ показывается пользователю только один раз при создании.'
    },
    {
      id: 10,
      title: 'Задача: Безопасность на уровне методов',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте комплексную безопасность на уровне методов с использованием @Secured, @RolesAllowed и SpEL выражений в @PreAuthorize.',
      requirements: [
        '@PreAuthorize с SpEL: доступ к текущему пользователю, проверка владельца ресурса',
        '@PostAuthorize для фильтрации результата после выполнения метода',
        '@PreFilter и @PostFilter для фильтрации коллекций',
        'Кастомный PermissionEvaluator для hasPermission() в SpEL'
      ],
      expectedOutput: 'GET /api/posts/1 (автор поста) → 200 { "id":1, "title":"My Post", "content":"..." }\nGET /api/posts/1 (другой user) → 403 Forbidden\n\nPUT /api/posts/1 (автор ИЛИ ADMIN) → 200 OK\nDELETE /api/posts/1 (только ADMIN) → 204 No Content\n\nGET /api/posts (user) → 200 [только свои посты через @PostFilter]',
      hint: 'В SpEL используйте #id для параметра метода, authentication.principal для текущего пользователя. returnObject — для @PostAuthorize.',
      solution: `// --- PostService с method-level security ---
@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;

    @PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal.id")
    public List<Post> getPostsByUser(Long userId) {
        return postRepository.findByAuthorId(userId);
    }

    @PostAuthorize("returnObject.author.id == authentication.principal.id or hasRole('ADMIN')")
    public Post getPost(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Пост не найден"));
    }

    @PreAuthorize("hasRole('USER')")
    public Post createPost(Post post, @AuthenticationPrincipal User user) {
        post.setAuthor(user);
        return postRepository.save(post);
    }

    @PreAuthorize("@postSecurity.isOwner(#id, authentication.principal.id) or hasRole('ADMIN')")
    public Post updatePost(Long id, PostUpdateRequest request) {
        Post post = postRepository.findById(id).orElseThrow();
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        return postRepository.save(post);
    }

    @Secured("ROLE_ADMIN")
    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }

    @PostFilter("filterObject.author.id == authentication.principal.id")
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }
}

// --- Custom Security Bean ---
@Component("postSecurity")
@RequiredArgsConstructor
public class PostSecurity {

    private final PostRepository postRepository;

    public boolean isOwner(Long postId, Long userId) {
        return postRepository.findById(postId)
                .map(post -> post.getAuthor().getId().equals(userId))
                .orElse(false);
    }
}

// --- Custom PermissionEvaluator ---
@Component
public class CustomPermissionEvaluator implements PermissionEvaluator {

    @Autowired
    private PostRepository postRepository;

    @Override
    public boolean hasPermission(Authentication auth, Object targetDomainObject, Object permission) {
        if (targetDomainObject instanceof Post post) {
            User user = (User) auth.getPrincipal();
            return switch (permission.toString()) {
                case "READ" -> true;
                case "WRITE" -> post.getAuthor().getId().equals(user.getId());
                case "DELETE" -> user.getAuthorities().stream()
                        .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
                default -> false;
            };
        }
        return false;
    }

    @Override
    public boolean hasPermission(Authentication auth, Serializable targetId,
                                  String targetType, Object permission) {
        if ("Post".equals(targetType)) {
            Post post = postRepository.findById((Long) targetId).orElse(null);
            return post != null && hasPermission(auth, post, permission);
        }
        return false;
    }
}

// --- SecurityConfig ---
@Configuration
@EnableMethodSecurity(securedEnabled = true, jsr250Enabled = true)
public class MethodSecurityConfig {

    @Bean
    public MethodSecurityExpressionHandler methodSecurityExpressionHandler(
            CustomPermissionEvaluator evaluator) {
        DefaultMethodSecurityExpressionHandler handler =
                new DefaultMethodSecurityExpressionHandler();
        handler.setPermissionEvaluator(evaluator);
        return handler;
    }
}`,
      explanation: '@PreAuthorize проверяет доступ до выполнения метода, @PostAuthorize — после (с доступом к returnObject). @PostFilter фильтрует возвращаемую коллекцию. SpEL позволяет обращаться к authentication.principal, параметрам метода через #param, и Spring beans через @beanName. CustomPermissionEvaluator реализует логику hasPermission() для fine-grained контроля доступа.'
    }
  ]
}
