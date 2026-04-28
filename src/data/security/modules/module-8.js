export default {
  id: 8,
  title: 'Session vs Token',
  description: 'Серверные сессии, cookie-based auth, stateless tokens и сравнение подходов',
  lessons: [
    {
      id: 1,
      title: 'Серверные сессии (Session-based Auth)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Session-based аутентификация -- классический подход: сервер создаёт сессию после логина и хранит её в памяти или базе данных. Клиент получает session ID в cookie.' },
        { type: 'heading', value: 'Как работают сессии?' },
        { type: 'list', items: [
          'Пользователь отправляет логин/пароль',
          'Сервер проверяет credentials и создаёт сессию (sessionId -> userData)',
          'Сервер отправляет sessionId в cookie (Set-Cookie header)',
          'Браузер автоматически отправляет cookie в каждом запросе',
          'Сервер ищет sessionId в хранилище и определяет пользователя'
        ]},
        { type: 'code', language: 'java', value: 'import java.util.*;\n\npublic class Main {\n    static Map<String, Map<String, String>> sessions = new HashMap<>();\n    \n    public static void main(String[] args) {\n        // 1. Логин\n        String sessionId = createSession("user123", "ADMIN");\n        System.out.println("1. Логин -> Set-Cookie: SESSION=" + sessionId);\n        \n        // 2. Запросы с cookie\n        System.out.println("\\n2. Запрос с cookie SESSION=" + sessionId);\n        Map<String, String> session = getSession(sessionId);\n        if (session != null) {\n            System.out.println("   User: " + session.get("userId"));\n            System.out.println("   Role: " + session.get("role"));\n            System.out.println("   -> 200 OK");\n        }\n        \n        // 3. Запрос без cookie\n        System.out.println("\\n3. Запрос без cookie");\n        Map<String, String> noSession = getSession("invalid-id");\n        System.out.println("   -> " + (noSession == null ? "401 Unauthorized" : "200 OK"));\n        \n        // 4. Logout -- удаляем сессию\n        System.out.println("\\n4. Logout");\n        destroySession(sessionId);\n        System.out.println("   Сессия удалена");\n        System.out.println("   Старый cookie: " + (getSession(sessionId) == null ? "невалиден" : "валиден"));\n    }\n    \n    static String createSession(String userId, String role) {\n        String id = UUID.randomUUID().toString();\n        Map<String, String> data = new HashMap<>();\n        data.put("userId", userId);\n        data.put("role", role);\n        data.put("createdAt", String.valueOf(System.currentTimeMillis()));\n        sessions.put(id, data);\n        return id;\n    }\n    \n    static Map<String, String> getSession(String sessionId) {\n        return sessions.get(sessionId);\n    }\n    \n    static void destroySession(String sessionId) {\n        sessions.remove(sessionId);\n    }\n}' },
        { type: 'note', value: 'Сессии хранятся на сервере -- это stateful подход. При логауте достаточно удалить сессию с сервера, и cookie становится бесполезным. Это преимущество перед JWT.' }
      ]
    },
    {
      id: 2,
      title: 'Cookies: HttpOnly, Secure, SameSite',
      type: 'theory',
      content: [
        { type: 'text', value: 'Cookie -- это механизм хранения данных в браузере. Для безопасности cookie имеют важные атрибуты, которые защищают от атак.' },
        { type: 'heading', value: 'Атрибуты безопасности Cookie' },
        { type: 'list', items: [
          'HttpOnly -- cookie недоступен через JavaScript (защита от XSS)',
          'Secure -- cookie передаётся только по HTTPS',
          'SameSite=Strict -- cookie не отправляется при cross-site запросах (защита от CSRF)',
          'SameSite=Lax -- cookie отправляется при навигации, но не при POST/AJAX',
          'Max-Age / Expires -- время жизни cookie',
          'Path -- ограничение пути, для которого действует cookie',
          'Domain -- домен, для которого действует cookie'
        ]},
        { type: 'code', language: 'java', value: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("=== Примеры Set-Cookie заголовков ===\\n");\n        \n        // Плохой cookie (уязвим)\n        System.out.println("ПЛОХО:");\n        System.out.println("Set-Cookie: session=abc123");\n        System.out.println("  -> Доступен через JavaScript (XSS)");\n        System.out.println("  -> Передаётся по HTTP (перехват)");\n        System.out.println("  -> Отправляется на другие сайты (CSRF)\\n");\n        \n        // Хороший cookie (защищённый)\n        System.out.println("ХОРОШО:");\n        String secureCookie = buildSecureCookie("session", "abc123", 3600);\n        System.out.println(secureCookie);\n        System.out.println("  -> HttpOnly: невидим для JavaScript");\n        System.out.println("  -> Secure: только HTTPS");\n        System.out.println("  -> SameSite=Lax: защита от CSRF");\n        System.out.println("  -> Max-Age=3600: истекает через 1 час");\n        System.out.println("  -> Path=/: действует для всего сайта");\n    }\n    \n    static String buildSecureCookie(String name, String value, int maxAge) {\n        return "Set-Cookie: " + name + "=" + value + \n            "; HttpOnly" +\n            "; Secure" +\n            "; SameSite=Lax" +\n            "; Max-Age=" + maxAge +\n            "; Path=/";\n    }\n}' },
        { type: 'warning', value: 'ВСЕГДА ставь HttpOnly для session cookie! Без него XSS-атака может украсть cookie через document.cookie, и злоумышленник получит доступ к аккаунту пользователя.' },
        { type: 'tip', value: 'SameSite=Lax -- хороший баланс. Strict может сломать навигацию (ссылка из email не будет работать), а None требует Secure и разрешает cross-site (нужен для виджетов и iframe).' }
      ]
    },
    {
      id: 3,
      title: 'Token-based Auth (JWT)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Token-based аутентификация -- stateless подход: сервер НЕ хранит состояние. Вся информация о пользователе содержится в самом токене (JWT).' },
        { type: 'heading', value: 'Как работает Token-based Auth?' },
        { type: 'list', items: [
          'Пользователь отправляет логин/пароль',
          'Сервер проверяет и создаёт JWT (подписанный токен)',
          'Клиент хранит JWT (localStorage, sessionStorage, cookie)',
          'Клиент отправляет JWT в заголовке Authorization: Bearer <token>',
          'Сервер верифицирует подпись JWT -- НЕ обращается к базе данных'
        ]},
        { type: 'heading', value: 'Где хранить JWT на клиенте?' },
        { type: 'code', language: 'java', value: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("=== Где хранить JWT на клиенте? ===\\n");\n        \n        // Вариант 1: localStorage\n        System.out.println("1. localStorage:");\n        System.out.println("   + Не отправляется автоматически (нет CSRF)");\n        System.out.println("   + Доступен между вкладками");\n        System.out.println("   - Доступен через JavaScript (уязвим к XSS!)");\n        System.out.println("   - Не удаляется при закрытии браузера\\n");\n        \n        // Вариант 2: sessionStorage\n        System.out.println("2. sessionStorage:");\n        System.out.println("   + Удаляется при закрытии вкладки");\n        System.out.println("   - Доступен через JavaScript (уязвим к XSS!)");\n        System.out.println("   - НЕ доступен между вкладками\\n");\n        \n        // Вариант 3: httpOnly cookie\n        System.out.println("3. httpOnly cookie:");\n        System.out.println("   + Недоступен для JavaScript (защита от XSS!)");\n        System.out.println("   + Автоматическая отправка");\n        System.out.println("   - Нужна CSRF-защита (SameSite)");\n        System.out.println("   - Ограничение размера (4KB)\\n");\n        \n        // Рекомендация\n        System.out.println("РЕКОМЕНДАЦИЯ:");\n        System.out.println("  httpOnly cookie с SameSite=Lax + Secure");\n        System.out.println("  Это самый безопасный вариант для веб-приложений.");\n    }\n}' },
        { type: 'warning', value: 'localStorage -- ПЛОХОЕ место для JWT! Любой XSS-скрипт может прочитать его через window.localStorage.getItem("token"). HttpOnly cookie недоступен для JavaScript.' }
      ]
    },
    {
      id: 4,
      title: 'Session vs Token: сравнение',
      type: 'theory',
      content: [
        { type: 'text', value: 'Оба подхода имеют плюсы и минусы. Выбор зависит от архитектуры приложения.' },
        { type: 'heading', value: 'Сравнительная таблица' },
        { type: 'code', language: 'java', value: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("=== Session vs Token ===\\n");\n        \n        String[][] comparison = {\n            {"Критерий", "Session", "JWT Token"},\n            {"Состояние", "Stateful (сервер)", "Stateless (клиент)"},\n            {"Хранение", "Сервер (память/Redis)", "Клиент (cookie/storage)"},\n            {"Масштабирование", "Сложнее (sticky sessions)", "Проще (любой сервер)"},\n            {"Отзыв доступа", "Мгновенный (удалить сессию)", "Сложный (blacklist)"},\n            {"Размер", "Маленький (session ID)", "Большой (весь payload)"},\n            {"Микросервисы", "Нужен общий store", "Независимая верификация"},\n            {"Безопасность", "Сервер контролирует", "Клиент может прочитать"},\n            {"Мобильные", "Проблемы с cookies", "Хорошо работает"},\n        };\n        \n        for (String[] row : comparison) {\n            System.out.printf("%-18s | %-28s | %-28s%n", row[0], row[1], row[2]);\n            if (row == comparison[0]) {\n                System.out.println("-".repeat(80));\n            }\n        }\n        \n        System.out.println("\\n=== Когда что выбрать? ===");\n        System.out.println("\\nSession подходит для:");\n        System.out.println("  - Монолитных веб-приложений");\n        System.out.println("  - Когда нужен мгновенный отзыв доступа");\n        System.out.println("  - Банковские приложения (строгий контроль)");\n        \n        System.out.println("\\nJWT подходит для:");\n        System.out.println("  - Микросервисной архитектуры");\n        System.out.println("  - Мобильных приложений");\n        System.out.println("  - SSO и OAuth");\n        System.out.println("  - Когда важна горизонтальная масштабируемость");\n    }\n}' },
        { type: 'tip', value: 'Многие крупные сервисы комбинируют оба подхода. Kaspi использует JWT для API мобильного приложения и сессии для веб-версии.' },
        { type: 'note', value: 'Гибридный подход: JWT как access token (stateless, живёт 15 минут) + серверная сессия для refresh token (stateful, можно отозвать). Это best practice.' }
      ]
    },
    {
      id: 5,
      title: 'Практика: Session Store с TTL',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй серверное хранилище сессий с автоматическим истечением (TTL) и поддержкой нескольких устройств.',
      requirements: [
        'Создай класс Main с методом main',
        'Сессия содержит: userId, role, device, createdAt, expiresAt',
        'Один пользователь может иметь несколько сессий (разные устройства)',
        'Метод cleanExpired: удаление истёкших сессий',
        'Метод killAllSessions: завершение всех сессий пользователя'
      ],
      expectedOutput: 'Логин с Desktop: session1\nЛогин с Mobile: session2\nАктивные сессии user123: 2\nСписок: [Desktop, Mobile]\nУдаление всех сессий user123\nАктивные сессии user123: 0',
      hint: 'Используй Map<String, SessionData> и дополнительный индекс Map<String, Set<String>> для быстрого поиска сессий по userId.',
      solution: 'import java.util.*;\n\npublic class Main {\n    static Map<String, Map<String, Object>> sessions = new LinkedHashMap<>();\n    static Map<String, Set<String>> userSessions = new HashMap<>(); // userId -> sessionIds\n    \n    public static void main(String[] args) {\n        // Логин с разных устройств\n        String s1 = login("user123", "ADMIN", "Desktop Chrome", 3600);\n        System.out.println("Логин с Desktop: " + s1.substring(0, 12) + "...");\n        \n        String s2 = login("user123", "ADMIN", "Mobile App", 7200);\n        System.out.println("Логин с Mobile: " + s2.substring(0, 12) + "...");\n        \n        String s3 = login("user456", "USER", "Desktop Firefox", 3600);\n        System.out.println("Логин user456 с Firefox: " + s3.substring(0, 12) + "...");\n        \n        // Активные сессии\n        System.out.println("\\nАктивные сессии user123: " + getUserSessionCount("user123"));\n        System.out.println("Устройства: " + getUserDevices("user123"));\n        \n        // Добавим \"истёкшую\" сессию\n        String expired = login("user123", "ADMIN", "Old Tablet", -100); // уже истёк\n        System.out.println("\\nДо очистки: " + sessions.size() + " сессий");\n        cleanExpired();\n        System.out.println("После очистки: " + sessions.size() + " сессий");\n        \n        // Удаляем все сессии user123\n        System.out.println("\\nУдаление всех сессий user123");\n        killAllSessions("user123");\n        System.out.println("Активные сессии user123: " + getUserSessionCount("user123"));\n        System.out.println("Активные сессии user456: " + getUserSessionCount("user456"));\n    }\n    \n    static String login(String userId, String role, String device, int ttlSec) {\n        String sessionId = UUID.randomUUID().toString();\n        long now = System.currentTimeMillis();\n        \n        Map<String, Object> data = new HashMap<>();\n        data.put("userId", userId);\n        data.put("role", role);\n        data.put("device", device);\n        data.put("createdAt", now);\n        data.put("expiresAt", now + ttlSec * 1000L);\n        \n        sessions.put(sessionId, data);\n        userSessions.computeIfAbsent(userId, k -> new LinkedHashSet<>()).add(sessionId);\n        return sessionId;\n    }\n    \n    static int getUserSessionCount(String userId) {\n        Set<String> sids = userSessions.getOrDefault(userId, Collections.emptySet());\n        return (int) sids.stream().filter(sessions::containsKey).count();\n    }\n    \n    static List<String> getUserDevices(String userId) {\n        List<String> devices = new ArrayList<>();\n        Set<String> sids = userSessions.getOrDefault(userId, Collections.emptySet());\n        for (String sid : sids) {\n            Map<String, Object> s = sessions.get(sid);\n            if (s != null) devices.add((String) s.get("device"));\n        }\n        return devices;\n    }\n    \n    static void cleanExpired() {\n        long now = System.currentTimeMillis();\n        sessions.entrySet().removeIf(e -> (long) e.getValue().get("expiresAt") < now);\n    }\n    \n    static void killAllSessions(String userId) {\n        Set<String> sids = userSessions.remove(userId);\n        if (sids != null) sids.forEach(sessions::remove);\n    }\n}',
      explanation: 'Мы реализовали серверное хранилище сессий с: 1) Множественными сессиями на пользователя (Desktop, Mobile). 2) TTL -- сессии автоматически истекают. 3) cleanExpired удаляет истёкшие сессии. 4) killAllSessions завершает ВСЕ сессии пользователя (полезно при смене пароля или обнаружении взлома). Индекс userSessions обеспечивает быстрый поиск.'
    },
    {
      id: 6,
      title: 'Практика: Гибридный подход (JWT + Session)',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй гибридную аутентификацию: JWT access token (stateless) + серверный refresh token (stateful).',
      requirements: [
        'Создай класс Main с методом main',
        'Access token: JWT с коротким TTL (имитация 15 минут)',
        'Refresh token: серверный (хранится в Map) с длинным TTL',
        'Обновление: refresh token -> новый access + новый refresh (ротация)',
        'Возможность мгновенного отзыва через удаление refresh token'
      ],
      expectedOutput: 'Login: access=eyJ... refresh=ref_xxx\nAPI call: 200 OK (user=admin)\nRefresh: новый access + refresh\nОтзыв refresh token\nRefresh после отзыва: ОТКАЗ\nAPI call со старым access: 200 OK (ещё живой)',
      hint: 'Access token -- полноценный JWT с подписью. Refresh token -- UUID в серверном хранилище.',
      solution: 'import javax.crypto.Mac;\nimport javax.crypto.spec.SecretKeySpec;\nimport java.util.*;\n\npublic class Main {\n    static final String SECRET = "demo-secret-key-at-least-256-bits-!!!";\n    static Map<String, String[]> refreshStore = new HashMap<>(); // refreshId -> [userId, role, expiresAt]\n    \n    public static void main(String[] args) throws Exception {\n        // Login\n        String[] tokens = login("admin", "ADMIN");\n        System.out.println("Login:");\n        System.out.println("  access: " + tokens[0].substring(0, 30) + "...");\n        System.out.println("  refresh: " + tokens[1]);\n        \n        // API call\n        System.out.print("\\nAPI call: ");\n        apiCall(tokens[0]);\n        \n        // Refresh\n        String[] newTokens = refresh(tokens[1]);\n        System.out.println("\\nRefresh:");\n        System.out.println("  новый access: " + newTokens[0].substring(0, 30) + "...");\n        System.out.println("  новый refresh: " + newTokens[1]);\n        \n        // Старый refresh невалиден\n        System.out.print("\\nСтарый refresh: ");\n        try {\n            refresh(tokens[1]);\n        } catch (Exception e) {\n            System.out.println(e.getMessage());\n        }\n        \n        // Отзыв нового refresh\n        revokeRefreshToken(newTokens[1]);\n        System.out.println("\\nОтзыв refresh token: OK");\n        System.out.print("Refresh после отзыва: ");\n        try {\n            refresh(newTokens[1]);\n        } catch (Exception e) {\n            System.out.println(e.getMessage());\n        }\n        \n        // Access token всё ещё работает (stateless!)\n        System.out.print("\\nAPI со старым access: ");\n        apiCall(newTokens[0]);\n        System.out.println("(Будет работать до exp, затем потребуется refresh)");\n    }\n    \n    static String[] login(String userId, String role) throws Exception {\n        String access = createJwt(userId, role, 900); // 15 min\n        String refreshId = "ref_" + UUID.randomUUID().toString().substring(0, 12);\n        long exp = System.currentTimeMillis() / 1000 + 604800; // 7 days\n        refreshStore.put(refreshId, new String[]{userId, role, String.valueOf(exp)});\n        return new String[]{access, refreshId};\n    }\n    \n    static String[] refresh(String refreshId) throws Exception {\n        String[] data = refreshStore.remove(refreshId); // ротация\n        if (data == null) throw new RuntimeException("ОТКАЗ: невалидный refresh token");\n        long exp = Long.parseLong(data[2]);\n        if (System.currentTimeMillis() / 1000 > exp) throw new RuntimeException("ОТКАЗ: refresh истёк");\n        return login(data[0], data[1]);\n    }\n    \n    static void revokeRefreshToken(String refreshId) {\n        refreshStore.remove(refreshId);\n    }\n    \n    static void apiCall(String jwt) throws Exception {\n        if (!verifyJwt(jwt)) { System.out.println("401 Unauthorized"); return; }\n        String user = getClaim(jwt, "sub");\n        System.out.println("200 OK (user=" + user + ")");\n    }\n    \n    static String createJwt(String sub, String role, int ttl) throws Exception {\n        String h = enc("{\\\"alg\\\":\\\"HS256\\\",\\\"typ\\\":\\\"JWT\\\"}");\n        long now = System.currentTimeMillis() / 1000;\n        String p = enc("{\\\"sub\\\":\\\"" + sub + "\\\",\\\"role\\\":\\\"" + role + "\\\",\\\"exp\\\":" + (now + ttl) + "}");\n        return h + "." + p + "." + sign(h + "." + p);\n    }\n    \n    static boolean verifyJwt(String jwt) throws Exception {\n        String[] p = jwt.split("\\\\."); return p.length == 3 && sign(p[0] + "." + p[1]).equals(p[2]);\n    }\n    static String getClaim(String jwt, String n) {\n        String p = new String(Base64.getUrlDecoder().decode(jwt.split("\\\\.")[1]));\n        String s = "\\\"" + n + "\\\":\\\""; int i = p.indexOf(s); if (i == -1) return null;\n        int st = i + s.length(); return p.substring(st, p.indexOf(\'\\"\', st));\n    }\n    static String enc(String s) { return Base64.getUrlEncoder().withoutPadding().encodeToString(s.getBytes()); }\n    static String sign(String d) throws Exception {\n        Mac h = Mac.getInstance("HmacSHA256");\n        h.init(new SecretKeySpec(SECRET.getBytes(), "HmacSHA256"));\n        return Base64.getUrlEncoder().withoutPadding().encodeToString(h.doFinal(d.getBytes()));\n    }\n}',
      explanation: 'Гибридный подход: JWT access token (stateless, 15 мин) + серверный refresh token (stateful, 7 дней). Access token проверяется без БД -- только подпись. Refresh token хранится на сервере и может быть мгновенно отозван. При refresh -- ротация: старый удаляется, выдаётся новый. Access token продолжает работать до exp даже после отзыва refresh -- это trade-off за stateless. Этот подход используют Kaspi, Google, Auth0.'
    }
  ]
}
