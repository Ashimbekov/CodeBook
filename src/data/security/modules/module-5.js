export default {
  id: 5,
  title: 'OAuth 2.0: теория',
  description: 'Протокол OAuth 2.0: flows, grant types, authorization code, client credentials, scopes',
  lessons: [
    {
      id: 1,
      title: 'Что такое OAuth 2.0?',
      type: 'theory',
      content: [
        { type: 'text', value: 'OAuth 2.0 -- это протокол авторизации, который позволяет приложению получить ограниченный доступ к ресурсам пользователя на другом сервисе БЕЗ передачи пароля.' },
        { type: 'tip', value: 'Когда ты нажимаешь "Войти через Google" -- это OAuth 2.0. Ты НЕ даёшь приложению свой пароль от Google. Вместо этого Google сам подтверждает твою личность и выдаёт токен с ограниченными правами.' },
        { type: 'heading', value: 'Зачем нужен OAuth?' },
        { type: 'list', items: [
          'Безопасность -- пользователь не передаёт пароль третьему приложению',
          'Ограниченный доступ -- приложение получает только те права, которые нужны (scopes)',
          'Отзыв доступа -- пользователь может отозвать доступ в любой момент',
          'Стандарт -- все крупные сервисы поддерживают OAuth 2.0'
        ]},
        { type: 'heading', value: 'Участники OAuth 2.0' },
        { type: 'list', items: [
          'Resource Owner -- пользователь (владелец данных)',
          'Client -- приложение, которое хочет получить доступ к данным',
          'Authorization Server -- сервер авторизации (Google, GitHub)',
          'Resource Server -- сервер с данными пользователя (Google API, GitHub API)'
        ]},
        { type: 'code', language: 'java', value: '// Пример: приложение хочет получить email пользователя из Google\n//\n// Resource Owner:        Пользователь (Нурдаулет)\n// Client:               Моё приложение (myapp.com)\n// Authorization Server: accounts.google.com\n// Resource Server:      googleapis.com/userinfo\n//\n// Поток:\n// 1. myapp.com -> Google: "Дай мне email Нурдаулета"\n// 2. Google -> Нурдаулет: "Разрешить myapp.com доступ к email?"\n// 3. Нурдаулет -> Google: "Да, разрешаю"\n// 4. Google -> myapp.com: "Вот токен доступа"\n// 5. myapp.com -> Google API: "Дай email (вот токен)"\n// 6. Google API -> myapp.com: "nurdaulet@gmail.com"' },
        { type: 'note', value: 'OAuth 2.0 -- это протокол АВТОРИЗАЦИИ, не аутентификации. Он определяет, ЧТО приложению можно делать, но не КТО пользователь. Для аутентификации используют OpenID Connect (OIDC) -- расширение OAuth 2.0.' }
      ]
    },
    {
      id: 2,
      title: 'Authorization Code Flow',
      type: 'theory',
      content: [
        { type: 'text', value: 'Authorization Code Flow -- самый безопасный и распространённый flow OAuth 2.0. Используется для серверных веб-приложений.' },
        { type: 'heading', value: 'Шаги Authorization Code Flow' },
        { type: 'list', items: [
          'Шаг 1: Приложение перенаправляет пользователя на Authorization Server',
          'Шаг 2: Пользователь вводит логин/пароль и даёт согласие',
          'Шаг 3: Authorization Server возвращает authorization code',
          'Шаг 4: Приложение обменивает code на access token (server-to-server)',
          'Шаг 5: Приложение использует access token для доступа к ресурсам'
        ]},
        { type: 'code', language: 'java', value: 'import java.util.*;\n\npublic class Main {\n    // Имитация Authorization Code Flow\n    static Map<String, String> authCodes = new HashMap<>(); // code -> userId\n    static Map<String, String> accessTokens = new HashMap<>(); // token -> userId\n    static Map<String, Set<String>> tokenScopes = new HashMap<>(); // token -> scopes\n    \n    public static void main(String[] args) {\n        String clientId = "myapp-client-id";\n        String redirectUri = "https://myapp.com/callback";\n        \n        // Шаг 1: Формируем URL для авторизации\n        String authUrl = buildAuthUrl(clientId, redirectUri, "email profile");\n        System.out.println("Шаг 1: Перенаправляем пользователя:");\n        System.out.println("  " + authUrl);\n        \n        // Шаг 2-3: Пользователь авторизовался, получаем code\n        String code = simulateUserConsent("user123");\n        System.out.println("\\nШаг 3: Получили authorization code: " + code);\n        \n        // Шаг 4: Обмениваем code на access token\n        String[] tokenData = exchangeCodeForToken(code, clientId, "myapp-secret-value");\n        System.out.println("\\nШаг 4: Обменяли code на token:");\n        System.out.println("  access_token: " + tokenData[0]);\n        System.out.println("  token_type: Bearer");\n        System.out.println("  scope: " + tokenData[1]);\n        \n        // Шаг 5: Используем token для доступа к ресурсам\n        System.out.println("\\nШаг 5: Доступ к ресурсам:");\n        accessResource(tokenData[0], "email");\n        accessResource(tokenData[0], "photos"); // нет такого scope\n    }\n    \n    static String buildAuthUrl(String clientId, String redirectUri, String scope) {\n        return "https://auth.example.com/authorize" +\n            "?client_id=" + clientId +\n            "&redirect_uri=" + redirectUri +\n            "&response_type=code" +\n            "&scope=" + scope.replace(" ", "+") +\n            "&state=" + UUID.randomUUID().toString().substring(0, 8);\n    }\n    \n    static String simulateUserConsent(String userId) {\n        String code = "auth_code_" + UUID.randomUUID().toString().substring(0, 8);\n        authCodes.put(code, userId);\n        return code;\n    }\n    \n    static String[] exchangeCodeForToken(String code, String clientId, String clientSecret) {\n        String userId = authCodes.remove(code); // code одноразовый!\n        if (userId == null) throw new RuntimeException("Invalid code");\n        \n        String token = "access_" + UUID.randomUUID().toString().substring(0, 12);\n        accessTokens.put(token, userId);\n        tokenScopes.put(token, new HashSet<>(Arrays.asList("email", "profile")));\n        \n        return new String[]{token, "email profile"};\n    }\n    \n    static void accessResource(String token, String resource) {\n        String userId = accessTokens.get(token);\n        Set<String> scopes = tokenScopes.get(token);\n        \n        if (userId == null) {\n            System.out.println("  " + resource + ": 401 Unauthorized");\n        } else if (!scopes.contains(resource)) {\n            System.out.println("  " + resource + ": 403 Forbidden (нет scope)");\n        } else {\n            System.out.println("  " + resource + ": 200 OK (user=" + userId + ")");\n        }\n    }\n}' },
        { type: 'warning', value: 'Authorization code -- ОДНОРАЗОВЫЙ! После обмена на token он должен быть уничтожен. Если кто-то попытается использовать код повторно, сервер должен отозвать все ранее выданные токены.' }
      ]
    },
    {
      id: 3,
      title: 'Client Credentials Flow',
      type: 'theory',
      content: [
        { type: 'text', value: 'Client Credentials Flow используется для взаимодействия между сервисами (machine-to-machine), когда нет пользователя. Например, микросервис обращается к другому микросервису.' },
        { type: 'heading', value: 'Отличие от Authorization Code Flow' },
        { type: 'list', items: [
          'Нет пользователя -- сервис действует от своего имени',
          'Нет браузера и redirect -- прямой запрос на token endpoint',
          'Используются client_id и client_secret',
          'Применяется в микросервисах, cron-задачах, batch-обработке'
        ]},
        { type: 'code', language: 'java', value: 'import java.util.*;\n\npublic class Main {\n    static Map<String, String> registeredClients = new HashMap<>(); // clientId -> secret\n    static Map<String, Set<String>> clientScopes = new HashMap<>(); // clientId -> scopes\n    \n    public static void main(String[] args) {\n        // Регистрация клиентов (сервисов)\n        registerClient("payment-service", "ps-secret-value-123", "process_payments,read_orders");\n        registerClient("notification-service", "ns-secret-value-456", "send_emails,send_sms");\n        registerClient("analytics-service", "as-secret-value-789", "read_orders,read_users");\n        \n        System.out.println("=== Client Credentials Flow ===\\n");\n        \n        // Payment Service получает токен\n        String token1 = getToken("payment-service", "ps-secret-value-123");\n        System.out.println("Payment Service:");\n        System.out.println("  token: " + token1);\n        callApi(token1, "process_payments"); // OK\n        callApi(token1, "send_emails");      // Нет scope\n        \n        // Notification Service получает токен\n        System.out.println();\n        String token2 = getToken("notification-service", "ns-secret-value-456");\n        System.out.println("Notification Service:");\n        System.out.println("  token: " + token2);\n        callApi(token2, "send_emails"); // OK\n        callApi(token2, "process_payments"); // Нет scope\n        \n        // Неверный secret\n        System.out.println();\n        System.out.println("Неверный secret:");\n        String token3 = getToken("payment-service", "wrong-secret");\n        System.out.println("  token: " + token3);\n    }\n    \n    static void registerClient(String clientId, String secret, String scopes) {\n        registeredClients.put(clientId, secret);\n        clientScopes.put(clientId, new HashSet<>(Arrays.asList(scopes.split(","))));\n    }\n    \n    static String getToken(String clientId, String clientSecret) {\n        String storedSecret = registeredClients.get(clientId);\n        if (storedSecret == null || !storedSecret.equals(clientSecret)) {\n            return "ERROR: Invalid credentials";\n        }\n        return "token_" + clientId + "_" + UUID.randomUUID().toString().substring(0, 8);\n    }\n    \n    static void callApi(String token, String action) {\n        if (token.startsWith("ERROR")) {\n            System.out.println("  " + action + ": 401 Unauthorized");\n            return;\n        }\n        // Извлекаем clientId из токена (упрощённо)\n        String clientId = token.split("_")[1] + "-" + token.split("_")[2];\n        Set<String> scopes = clientScopes.get(clientId);\n        \n        if (scopes != null && scopes.contains(action)) {\n            System.out.println("  " + action + ": 200 OK");\n        } else {\n            System.out.println("  " + action + ": 403 Forbidden (нет scope)");\n        }\n    }\n}' },
        { type: 'tip', value: 'В микросервисной архитектуре Kaspi каждый сервис имеет свой client_id и secret. Payment Service не может отправлять SMS, а Notification Service не может обрабатывать платежи -- принцип минимальных привилегий.' },
        { type: 'note', value: 'Client Credentials Flow -- самый простой flow OAuth 2.0. Один POST-запрос с client_id и client_secret -- и вот токен. Никаких redirect-ов и пользовательского согласия.' }
      ]
    },
    {
      id: 4,
      title: 'PKCE: защита для публичных клиентов',
      type: 'theory',
      content: [
        { type: 'text', value: 'PKCE (Proof Key for Code Exchange, произносится "pixi") -- расширение OAuth 2.0, которое защищает Authorization Code Flow от перехвата кода. Обязателен для мобильных приложений и SPA.' },
        { type: 'heading', value: 'Проблема без PKCE' },
        { type: 'text', value: 'Мобильные приложения и SPA не могут безопасно хранить client_secret. Если злоумышленник перехватит authorization code -- он получит access token.' },
        { type: 'heading', value: 'Как работает PKCE?' },
        { type: 'list', items: [
          'Клиент генерирует случайный code_verifier (43-128 символов)',
          'Вычисляет code_challenge = SHA256(code_verifier), кодирует в Base64URL',
          'Отправляет code_challenge при запросе авторизации',
          'При обмене code на token отправляет оригинальный code_verifier',
          'Сервер проверяет: SHA256(code_verifier) == code_challenge'
        ]},
        { type: 'code', language: 'java', value: 'import java.security.MessageDigest;\nimport java.security.SecureRandom;\nimport java.util.Base64;\nimport java.util.HashMap;\nimport java.util.Map;\n\npublic class Main {\n    static Map<String, String> codeToChallenge = new HashMap<>(); // code -> challenge\n    static Map<String, String> codeToUser = new HashMap<>(); // code -> userId\n    \n    public static void main(String[] args) throws Exception {\n        System.out.println("=== PKCE Flow ===\\n");\n        \n        // Шаг 1: Клиент генерирует code_verifier и code_challenge\n        String codeVerifier = generateCodeVerifier();\n        String codeChallenge = generateCodeChallenge(codeVerifier);\n        System.out.println("code_verifier:  " + codeVerifier);\n        System.out.println("code_challenge: " + codeChallenge);\n        \n        // Шаг 2: Запрос авторизации с code_challenge\n        String code = authorize("user123", codeChallenge);\n        System.out.println("\\nAuthorization code: " + code);\n        \n        // Шаг 3: Обмен code на token с code_verifier\n        System.out.println("\\nОбмен с правильным verifier:");\n        String token = exchangeCode(code, codeVerifier);\n        System.out.println("  Результат: " + token);\n        \n        // Попытка без PKCE (злоумышленник перехватил code)\n        String code2 = authorize("user456", generateCodeChallenge(generateCodeVerifier()));\n        System.out.println("\\nЗлоумышленник перехватил code, но не знает verifier:");\n        String stolenToken = exchangeCode(code2, "wrong_verifier_attempt");\n        System.out.println("  Результат: " + stolenToken);\n    }\n    \n    static String generateCodeVerifier() {\n        SecureRandom random = new SecureRandom();\n        byte[] bytes = new byte[32];\n        random.nextBytes(bytes);\n        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);\n    }\n    \n    static String generateCodeChallenge(String verifier) throws Exception {\n        MessageDigest md = MessageDigest.getInstance("SHA-256");\n        byte[] hash = md.digest(verifier.getBytes());\n        return Base64.getUrlEncoder().withoutPadding().encodeToString(hash);\n    }\n    \n    static String authorize(String userId, String challenge) {\n        String code = "code_" + userId.hashCode();\n        codeToChallenge.put(code, challenge);\n        codeToUser.put(code, userId);\n        return code;\n    }\n    \n    static String exchangeCode(String code, String codeVerifier) throws Exception {\n        String storedChallenge = codeToChallenge.get(code);\n        if (storedChallenge == null) return "ERROR: Invalid code";\n        \n        // Проверяем: SHA256(verifier) == stored challenge\n        String computedChallenge = generateCodeChallenge(codeVerifier);\n        if (!computedChallenge.equals(storedChallenge)) {\n            return "ERROR: PKCE verification failed!";\n        }\n        \n        codeToChallenge.remove(code);\n        return "access_token_for_" + codeToUser.remove(code);\n    }\n}' },
        { type: 'note', value: 'С 2021 года PKCE рекомендуется для ВСЕХ OAuth-клиентов, не только для публичных. OAuth 2.1 делает PKCE обязательным.' }
      ]
    },
    {
      id: 5,
      title: 'Scopes и согласие пользователя',
      type: 'theory',
      content: [
        { type: 'text', value: 'Scopes (области доступа) -- это механизм ограничения прав, которые приложение запрашивает у пользователя. Вместо полного доступа приложение получает только нужные разрешения.' },
        { type: 'heading', value: 'Примеры scopes' },
        { type: 'list', items: [
          'Google: email, profile, calendar.readonly, drive.file',
          'GitHub: repo, user, gist, admin:org',
          'Kaspi: accounts.read, transfers.create, history.read'
        ]},
        { type: 'code', language: 'java', value: 'import java.util.*;\n\npublic class Main {\n    // Определение scopes и их описания\n    static Map<String, String> scopeDescriptions = new LinkedHashMap<>();\n    \n    public static void main(String[] args) {\n        // Настройка scopes\n        scopeDescriptions.put("profile", "Просмотр вашего профиля (имя, фото)");\n        scopeDescriptions.put("email", "Доступ к вашему email адресу");\n        scopeDescriptions.put("contacts.read", "Чтение списка контактов");\n        scopeDescriptions.put("calendar.write", "Создание событий в календаре");\n        scopeDescriptions.put("drive.files", "Доступ к файлам на Google Drive");\n        \n        // Приложение запрашивает scopes\n        List<String> requestedScopes = Arrays.asList("profile", "email", "contacts.read");\n        \n        System.out.println("=== Экран согласия ===");\n        System.out.println("Приложение \\\"MyApp\\\" запрашивает доступ:\\n");\n        for (String scope : requestedScopes) {\n            String desc = scopeDescriptions.getOrDefault(scope, scope);\n            System.out.println("  [x] " + desc);\n        }\n        System.out.println();\n        \n        // Пользователь может отклонить некоторые scopes\n        List<String> approvedScopes = Arrays.asList("profile", "email"); // без contacts\n        System.out.println("Пользователь одобрил: " + approvedScopes);\n        System.out.println("Отклонил: contacts.read\\n");\n        \n        // Проверка доступа\n        String token = "demo_token";\n        Set<String> grantedScopes = new HashSet<>(approvedScopes);\n        \n        checkScope(grantedScopes, "profile", "Получение имени");\n        checkScope(grantedScopes, "email", "Получение email");\n        checkScope(grantedScopes, "contacts.read", "Чтение контактов");\n        checkScope(grantedScopes, "calendar.write", "Создание события");\n    }\n    \n    static void checkScope(Set<String> granted, String scope, String action) {\n        boolean allowed = granted.contains(scope);\n        System.out.println(action + " (" + scope + "): " + (allowed ? "РАЗРЕШЕНО" : "ЗАПРЕЩЕНО"));\n    }\n}' },
        { type: 'tip', value: 'Запрашивай МИНИМУМ scopes! Если приложению нужен только email -- не запрашивай доступ к drive и calendar. Пользователи чаще отклоняют приложения с избыточными запросами.' },
        { type: 'warning', value: 'Scopes не заменяют авторизацию на вашем сервере! Если пользователь дал scope "profile" -- это значит, что ваше приложение может читать ЕГО профиль в Google, но не профили других пользователей.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Authorization Code Flow',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй полный Authorization Code Flow: регистрация клиента, авторизация пользователя, обмен code на token, доступ к ресурсам.',
      requirements: [
        'Создай класс Main с методом main',
        'Регистрация OAuth-клиента с redirect_uri и scopes',
        'Генерация authorization URL',
        'Выдача одноразового authorization code',
        'Обмен code + client_secret на access_token',
        'Проверка scope при доступе к ресурсам'
      ],
      expectedOutput: 'Клиент зарегистрирован: myapp\nAuth URL: https://auth.server/authorize?...\nCode: auth_xxxx\nToken: access_xxxx (scopes: email,profile)\nGET /userinfo (email): 200 OK\nGET /contacts (contacts): 403 Forbidden',
      hint: 'Используй HashMap для хранения клиентов, кодов и токенов. Authorization code должен быть одноразовым.',
      solution: 'import java.util.*;\n\npublic class Main {\n    static Map<String, String[]> clients = new HashMap<>(); // clientId -> [secret, redirectUri, scopes]\n    static Map<String, String[]> authCodes = new HashMap<>(); // code -> [clientId, userId, scopes]\n    static Map<String, String[]> tokens = new HashMap<>(); // token -> [userId, scopes]\n    \n    public static void main(String[] args) {\n        // 1. Регистрация клиента\n        registerClient("myapp", "myapp-secret-val", "https://myapp.com/callback", "email,profile");\n        System.out.println("Клиент зарегистрирован: myapp");\n        \n        // 2. Authorization URL\n        String authUrl = buildAuthUrl("myapp", "email profile", "random-state-123");\n        System.out.println("Auth URL: " + authUrl);\n        \n        // 3. Пользователь авторизовался -> code\n        String code = issueCode("myapp", "user123", "email,profile");\n        System.out.println("Code: " + code);\n        \n        // 4. Обмен code на token\n        String token = exchangeCode(code, "myapp", "myapp-secret-val");\n        System.out.println("Token: " + token + " (scopes: " + String.join(",", getTokenScopes(token)) + ")");\n        \n        // 5. Доступ к ресурсам\n        System.out.println("GET /userinfo (email): " + accessResource(token, "email"));\n        System.out.println("GET /contacts (contacts): " + accessResource(token, "contacts"));\n        \n        // 6. Повторное использование code\n        System.out.println("\\nПовторное использование code:");\n        String token2 = exchangeCode(code, "myapp", "myapp-secret-val");\n        System.out.println("Результат: " + token2);\n    }\n    \n    static void registerClient(String id, String secret, String redirect, String scopes) {\n        clients.put(id, new String[]{secret, redirect, scopes});\n    }\n    \n    static String buildAuthUrl(String clientId, String scope, String state) {\n        String[] client = clients.get(clientId);\n        return "https://auth.server/authorize?client_id=" + clientId +\n            "&redirect_uri=" + client[1] + "&response_type=code" +\n            "&scope=" + scope.replace(" ", "+") + "&state=" + state;\n    }\n    \n    static String issueCode(String clientId, String userId, String scopes) {\n        String code = "auth_" + UUID.randomUUID().toString().substring(0, 8);\n        authCodes.put(code, new String[]{clientId, userId, scopes});\n        return code;\n    }\n    \n    static String exchangeCode(String code, String clientId, String clientSecret) {\n        String[] codeData = authCodes.remove(code); // одноразовый!\n        if (codeData == null) return "ERROR: code уже использован или невалиден";\n        \n        String[] client = clients.get(clientId);\n        if (client == null || !client[0].equals(clientSecret)) return "ERROR: invalid client";\n        if (!codeData[0].equals(clientId)) return "ERROR: code выдан другому клиенту";\n        \n        String token = "access_" + UUID.randomUUID().toString().substring(0, 12);\n        tokens.put(token, new String[]{codeData[1], codeData[2]});\n        return token;\n    }\n    \n    static Set<String> getTokenScopes(String token) {\n        String[] data = tokens.get(token);\n        return data != null ? new HashSet<>(Arrays.asList(data[1].split(","))) : Collections.emptySet();\n    }\n    \n    static String accessResource(String token, String requiredScope) {\n        String[] data = tokens.get(token);\n        if (data == null) return "401 Unauthorized";\n        Set<String> scopes = new HashSet<>(Arrays.asList(data[1].split(",")));\n        return scopes.contains(requiredScope) ? "200 OK" : "403 Forbidden";\n    }\n}',
      explanation: 'Мы реализовали полный Authorization Code Flow: 1) Регистрация клиента с секретом и callback URL. 2) Генерация authorization URL с параметрами. 3) Выдача одноразового authorization code. 4) Обмен code на access token с проверкой client_secret. 5) Доступ к ресурсам с проверкой scopes. Повторное использование code возвращает ошибку.'
    },
    {
      id: 7,
      title: 'Практика: OAuth с PKCE',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй Authorization Code Flow с PKCE для защиты от перехвата кода.',
      requirements: [
        'Создай класс Main с методом main',
        'Генерация code_verifier и code_challenge (SHA-256)',
        'Авторизация с отправкой code_challenge',
        'Обмен code на token с проверкой code_verifier',
        'Продемонстрируй успешный flow и попытку атаки (без verifier)'
      ],
      expectedOutput: '=== PKCE OAuth Flow ===\ncode_verifier: ...\ncode_challenge: ...\nAuthorization code: ...\nОбмен с верным verifier: access_token=...\n\n=== Атака: перехват code ===\nОбмен без verifier: ERROR: PKCE failed',
      hint: 'Храни code_challenge вместе с authorization code. При обмене вычисляй SHA256(code_verifier) и сравнивай с сохранённым code_challenge.',
      solution: 'import java.security.MessageDigest;\nimport java.security.SecureRandom;\nimport java.util.*;\n\npublic class Main {\n    static Map<String, String[]> authCodes = new HashMap<>(); // code -> [userId, challenge, scopes]\n    \n    public static void main(String[] args) throws Exception {\n        System.out.println("=== PKCE OAuth Flow ===");\n        \n        // 1. Клиент генерирует PKCE пару\n        String codeVerifier = generateVerifier();\n        String codeChallenge = generateChallenge(codeVerifier);\n        System.out.println("code_verifier:  " + codeVerifier.substring(0, 20) + "...");\n        System.out.println("code_challenge: " + codeChallenge.substring(0, 20) + "...");\n        \n        // 2. Авторизация с code_challenge\n        String code = authorize("user123", codeChallenge, "email,profile");\n        System.out.println("Authorization code: " + code);\n        \n        // 3. Обмен code на token с code_verifier\n        String result = exchangeWithPkce(code, codeVerifier);\n        System.out.println("Обмен с верным verifier: " + result);\n        \n        // === Атака ===\n        System.out.println("\\n=== Атака: перехват code ===");\n        String verifier2 = generateVerifier();\n        String challenge2 = generateChallenge(verifier2);\n        String code2 = authorize("victim", challenge2, "email");\n        \n        // Злоумышленник перехватил code2, но не знает verifier2\n        String attackResult = exchangeWithPkce(code2, "attackers_fake_verifier_value");\n        System.out.println("Обмен без верного verifier: " + attackResult);\n        \n        // Законный пользователь тоже не может -- code уже использован\n        String code3 = authorize("user999", generateChallenge(generateVerifier()), "profile");\n        String legitimateResult = exchangeWithPkce(code3, generateVerifier());\n        System.out.println("Обмен с новым random verifier: " + legitimateResult);\n    }\n    \n    static String generateVerifier() {\n        byte[] bytes = new byte[32];\n        new SecureRandom().nextBytes(bytes);\n        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);\n    }\n    \n    static String generateChallenge(String verifier) throws Exception {\n        MessageDigest md = MessageDigest.getInstance("SHA-256");\n        byte[] hash = md.digest(verifier.getBytes());\n        return Base64.getUrlEncoder().withoutPadding().encodeToString(hash);\n    }\n    \n    static String authorize(String userId, String challenge, String scopes) {\n        String code = "code_" + UUID.randomUUID().toString().substring(0, 8);\n        authCodes.put(code, new String[]{userId, challenge, scopes});\n        return code;\n    }\n    \n    static String exchangeWithPkce(String code, String codeVerifier) throws Exception {\n        String[] data = authCodes.remove(code);\n        if (data == null) return "ERROR: invalid or expired code";\n        \n        // PKCE проверка\n        String computedChallenge = generateChallenge(codeVerifier);\n        if (!computedChallenge.equals(data[1])) {\n            return "ERROR: PKCE verification failed!";\n        }\n        \n        return "access_token=" + UUID.randomUUID().toString().substring(0, 12) +\n            " (user=" + data[0] + ", scopes=" + data[2] + ")";\n    }\n}',
      explanation: 'PKCE защищает от перехвата authorization code. Клиент генерирует пару code_verifier/code_challenge. Challenge отправляется при авторизации и сохраняется на сервере. При обмене code на token клиент отправляет verifier, сервер проверяет SHA256(verifier) == challenge. Злоумышленник, перехвативший code, не может получить token без оригинального verifier.'
    }
  ]
}
