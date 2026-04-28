export default {
  id: 3,
  title: 'JWT: JSON Web Tokens',
  description: 'Структура JWT: header.payload.signature, claims, алгоритмы подписи и когда использовать JWT',
  lessons: [
    {
      id: 1,
      title: 'Что такое JWT?',
      type: 'theory',
      content: [
        { type: 'text', value: 'JWT (JSON Web Token) -- это открытый стандарт (RFC 7519) для безопасной передачи информации между сторонами в виде JSON-объекта. JWT подписывается цифровой подписью, поэтому его можно верифицировать.' },
        { type: 'tip', value: 'JWT -- как паспорт. Паспорт содержит информацию о тебе (имя, фото, дата рождения) и защищён от подделки (водяные знаки, голограммы). JWT содержит данные о пользователе и защищён цифровой подписью.' },
        { type: 'heading', value: 'Где используют JWT?' },
        { type: 'list', items: [
          'Аутентификация -- после логина сервер выдаёт JWT, и клиент отправляет его в каждом запросе',
          'Авторизация -- JWT содержит роли и права пользователя',
          'Обмен данными между микросервисами',
          'Single Sign-On (SSO) -- один токен для нескольких сервисов'
        ]},
        { type: 'heading', value: 'Как выглядит JWT?' },
        { type: 'text', value: 'JWT -- это строка из трёх частей, разделённых точками:' },
        { type: 'code', language: 'java', value: '// Структура JWT:\n// xxxxx.yyyyy.zzzzz\n// |       |       |\n// Header  Payload Signature\n\n// Пример реального JWT:\n// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.\n// eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.\n// SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' },
        { type: 'note', value: 'JWT НЕ шифрует данные! Payload можно прочитать, просто декодировав Base64. JWT только гарантирует, что данные не были изменены (целостность). Если нужно скрыть содержимое -- используй JWE (JSON Web Encryption).' }
      ]
    },
    {
      id: 2,
      title: 'Header (заголовок)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Header -- первая часть JWT. Он содержит метаданные о токене: тип и алгоритм подписи.' },
        { type: 'heading', value: 'Структура Header' },
        { type: 'code', language: 'java', value: '// Header в формате JSON:\n// {\n//   "alg": "HS256",   -- алгоритм подписи\n//   "typ": "JWT"       -- тип токена\n// }\n\n// Затем этот JSON кодируется в Base64URL:\n// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' },
        { type: 'heading', value: 'Алгоритмы подписи' },
        { type: 'list', items: [
          'HS256 (HMAC + SHA-256) -- симметричный, один секретный ключ для подписи и проверки',
          'RS256 (RSA + SHA-256) -- асимметричный, приватный ключ для подписи, публичный для проверки',
          'ES256 (ECDSA + SHA-256) -- асимметричный, на эллиптических кривых, более компактный'
        ]},
        { type: 'code', language: 'java', value: 'import java.util.Base64;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Создаём Header\n        String headerJson = "{\\\"alg\\\":\\\"HS256\\\",\\\"typ\\\":\\\"JWT\\\"}";\n        \n        // Кодируем в Base64URL\n        String headerBase64 = Base64.getUrlEncoder()\n            .withoutPadding()\n            .encodeToString(headerJson.getBytes());\n        \n        System.out.println("JSON:   " + headerJson);\n        System.out.println("Base64: " + headerBase64);\n        \n        // Декодируем обратно\n        String decoded = new String(Base64.getUrlDecoder().decode(headerBase64));\n        System.out.println("Decoded: " + decoded);\n    }\n}' },
        { type: 'tip', value: 'Base64URL -- это Base64, но с заменой + на - и / на _, а также без символа = в конце. Это нужно, чтобы JWT можно было передавать в URL без проблем.' },
        { type: 'warning', value: 'Никогда не используй алгоритм "none" в production! Это означает отсутствие подписи, и любой может подделать токен. Это распространённая уязвимость JWT.' }
      ]
    },
    {
      id: 3,
      title: 'Payload (полезная нагрузка)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Payload -- вторая часть JWT. Она содержит claims (утверждения) -- данные о пользователе и токене.' },
        { type: 'heading', value: 'Типы claims' },
        { type: 'list', items: [
          'Registered claims -- стандартные поля (iss, sub, exp, iat, jti)',
          'Public claims -- пользовательские, но зарегистрированные в IANA (email, name)',
          'Private claims -- любые пользовательские данные (role, permissions)'
        ]},
        { type: 'heading', value: 'Стандартные claims' },
        { type: 'code', language: 'java', value: '// Стандартные (registered) claims:\n// {\n//   "iss": "myapp.com",           -- issuer (кто выдал)\n//   "sub": "user123",              -- subject (для кого)\n//   "aud": "myapp-api",            -- audience (для какого сервиса)\n//   "exp": 1700000000,             -- expiration time (когда истекает)\n//   "iat": 1699996400,             -- issued at (когда выдан)\n//   "nbf": 1699996400,             -- not before (не раньше этого времени)\n//   "jti": "unique-token-id-123"   -- JWT ID (уникальный ID токена)\n// }' },
        { type: 'code', language: 'java', value: 'import java.util.Base64;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Создаём Payload с claims\n        long now = System.currentTimeMillis() / 1000;\n        long exp = now + 3600; // +1 час\n        \n        String payloadJson = "{" +\n            "\\\"sub\\\":\\\"user123\\\"," +\n            "\\\"name\\\":\\\"Нурдаулет\\\"," +\n            "\\\"role\\\":\\\"ADMIN\\\"," +\n            "\\\"iat\\\":" + now + "," +\n            "\\\"exp\\\":" + exp +\n            "}";\n        \n        // Кодируем в Base64URL\n        String payloadBase64 = Base64.getUrlEncoder()\n            .withoutPadding()\n            .encodeToString(payloadJson.getBytes());\n        \n        System.out.println("JSON:   " + payloadJson);\n        System.out.println("Base64: " + payloadBase64);\n        System.out.println("Длина:  " + payloadBase64.length() + " символов");\n        \n        // Декодируем (любой может прочитать!)\n        String decoded = new String(Base64.getUrlDecoder().decode(payloadBase64));\n        System.out.println("\\nДекодированный payload:");\n        System.out.println(decoded);\n    }\n}' },
        { type: 'warning', value: 'Payload кодируется, но НЕ шифруется! Любой может декодировать Base64 и прочитать содержимое. Никогда не помещай в JWT пароли, номера карт или другую конфиденциальную информацию.' },
        { type: 'note', value: 'exp (expiration) -- критически важный claim. Без него токен будет действителен вечно. Рекомендуемое время жизни access token: 15-60 минут.' }
      ]
    },
    {
      id: 4,
      title: 'Signature (подпись)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Signature -- третья и самая важная часть JWT. Она гарантирует, что токен не был изменён. Подпись создаётся из header, payload и секретного ключа.' },
        { type: 'heading', value: 'Как создаётся подпись?' },
        { type: 'code', language: 'java', value: '// Формула подписи (для HS256):\n// HMAC-SHA256(\n//   base64UrlEncode(header) + "." + base64UrlEncode(payload),\n//   secret\n// )\n\n// Если кто-то изменит payload -- подпись станет невалидной!' },
        { type: 'code', language: 'java', value: 'import javax.crypto.Mac;\nimport javax.crypto.spec.SecretKeySpec;\nimport java.util.Base64;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        // Секретный ключ (в реальности -- длинная случайная строка)\n        String secret = "my-256-bit-secret-key-for-demo-only";\n        \n        // Header и Payload (Base64URL)\n        String header = Base64.getUrlEncoder().withoutPadding()\n            .encodeToString("{\\\"alg\\\":\\\"HS256\\\",\\\"typ\\\":\\\"JWT\\\"}".getBytes());\n        \n        String payload = Base64.getUrlEncoder().withoutPadding()\n            .encodeToString("{\\\"sub\\\":\\\"user123\\\",\\\"role\\\":\\\"ADMIN\\\"}".getBytes());\n        \n        // Создаём подпись\n        String dataToSign = header + "." + payload;\n        String signature = createSignature(dataToSign, secret);\n        \n        // Полный JWT\n        String jwt = dataToSign + "." + signature;\n        System.out.println("=== JWT ===" );\n        System.out.println("Header:    " + header);\n        System.out.println("Payload:   " + payload);\n        System.out.println("Signature: " + signature);\n        System.out.println("\\nПолный JWT:");\n        System.out.println(jwt);\n        \n        // Проверка подписи\n        System.out.println("\\n=== Проверка ===" );\n        System.out.println("Валидный: " + verifySignature(jwt, secret));\n        \n        // Подделка payload\n        String tamperedPayload = Base64.getUrlEncoder().withoutPadding()\n            .encodeToString("{\\\"sub\\\":\\\"hacker\\\",\\\"role\\\":\\\"ADMIN\\\"}".getBytes());\n        String tamperedJwt = header + "." + tamperedPayload + "." + signature;\n        System.out.println("Подделанный: " + verifySignature(tamperedJwt, secret));\n    }\n    \n    static String createSignature(String data, String secret) throws Exception {\n        Mac hmac = Mac.getInstance("HmacSHA256");\n        SecretKeySpec keySpec = new SecretKeySpec(secret.getBytes(), "HmacSHA256");\n        hmac.init(keySpec);\n        byte[] signatureBytes = hmac.doFinal(data.getBytes());\n        return Base64.getUrlEncoder().withoutPadding().encodeToString(signatureBytes);\n    }\n    \n    static boolean verifySignature(String jwt, String secret) throws Exception {\n        String[] parts = jwt.split("\\\\.");\n        if (parts.length != 3) return false;\n        \n        String dataToSign = parts[0] + "." + parts[1];\n        String expectedSignature = createSignature(dataToSign, secret);\n        return expectedSignature.equals(parts[2]);\n    }\n}' },
        { type: 'tip', value: 'Это и есть магия JWT: если злоумышленник изменит хоть один символ в payload, подпись перестанет совпадать, и сервер отклонит токен. Подпись можно создать только имея секретный ключ.' },
        { type: 'note', value: 'При использовании RS256 подпись создаётся приватным ключом, а проверяется публичным. Это удобно для микросервисов: один сервис подписывает, остальные только проверяют.' }
      ]
    },
    {
      id: 5,
      title: 'Когда использовать (и не использовать) JWT',
      type: 'theory',
      content: [
        { type: 'text', value: 'JWT -- мощный инструмент, но не серебряная пуля. Важно понимать, когда JWT подходит, а когда лучше выбрать другой подход.' },
        { type: 'heading', value: 'JWT подходит для:' },
        { type: 'list', items: [
          'Stateless аутентификация -- сервер не хранит сессии, масштабируется легко',
          'Микросервисы -- токен передаётся между сервисами без общей базы сессий',
          'Single Sign-On (SSO) -- один токен для нескольких приложений',
          'Мобильные приложения -- токен хранится на устройстве',
          'API для третьих лиц -- OAuth 2.0 + JWT'
        ]},
        { type: 'heading', value: 'JWT НЕ подходит для:' },
        { type: 'list', items: [
          'Хранение больших объёмов данных -- JWT передаётся в каждом запросе',
          'Необходимость мгновенного отзыва -- JWT действителен до exp, отозвать его сложно',
          'Чувствительные данные -- payload читается без ключа',
          'Простые монолитные приложения -- серверные сессии проще'
        ]},
        { type: 'heading', value: 'Проблема отзыва JWT' },
        { type: 'code', language: 'java', value: 'import java.util.*;\n\npublic class Main {\n    // Blacklist -- один из способов отзыва JWT\n    static Set<String> tokenBlacklist = new HashSet<>();\n    \n    public static void main(String[] args) {\n        String token1 = "jwt-token-abc123";\n        String token2 = "jwt-token-def456";\n        \n        // Оба токена валидны\n        System.out.println("token1 валиден: " + isTokenValid(token1));\n        System.out.println("token2 валиден: " + isTokenValid(token2));\n        \n        // Пользователь вышел -- добавляем в blacklist\n        System.out.println("\\nПользователь вышел, отзываем token1...");\n        revokeToken(token1);\n        \n        // Теперь token1 невалиден\n        System.out.println("token1 валиден: " + isTokenValid(token1));\n        System.out.println("token2 валиден: " + isTokenValid(token2));\n    }\n    \n    static boolean isTokenValid(String token) {\n        // Проверяем, не отозван ли токен\n        return !tokenBlacklist.contains(token);\n    }\n    \n    static void revokeToken(String token) {\n        tokenBlacklist.add(token);\n    }\n}' },
        { type: 'warning', value: 'Blacklist нарушает stateless-природу JWT, потому что требует хранения состояния (список отозванных токенов). В реальных системах используют Redis для хранения blacklist с TTL равным exp токена.' },
        { type: 'tip', value: 'Альтернатива blacklist -- короткий срок жизни access token (5-15 минут) + refresh token. Если нужно "отозвать" пользователя, просто не выдавай новый access token.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Создание JWT вручную',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай JWT токен вручную из трёх частей (header, payload, signature) и реализуй его верификацию.',
      requirements: [
        'Создай класс Main с методом main',
        'Метод createJwt: собирает JWT из header, payload и подписи (HMAC-SHA256)',
        'Метод verifyJwt: проверяет подпись JWT',
        'Метод decodePayload: извлекает данные из JWT',
        'Создай токен для пользователя с ролью ADMIN и проверь его'
      ],
      expectedOutput: 'JWT создан: eyJ...\nПодпись валидна: true\nPayload: {"sub":"user123","role":"ADMIN",...}\nПосле изменения payload: подпись невалидна',
      hint: 'Используй Base64.getUrlEncoder().withoutPadding() для кодирования и Mac.getInstance("HmacSHA256") для подписи.',
      solution: 'import javax.crypto.Mac;\nimport javax.crypto.spec.SecretKeySpec;\nimport java.util.Base64;\n\npublic class Main {\n    static final String SECRET = "demo-secret-key-min-256-bits-long-!!!";\n    \n    public static void main(String[] args) throws Exception {\n        // Создаём JWT\n        String jwt = createJwt("user123", "ADMIN");\n        System.out.println("JWT создан: " + jwt.substring(0, 50) + "...");\n        \n        // Проверяем подпись\n        System.out.println("Подпись валидна: " + verifyJwt(jwt));\n        \n        // Декодируем payload\n        System.out.println("Payload: " + decodePayload(jwt));\n        \n        // Подделываем токен\n        String[] parts = jwt.split("\\\\.");\n        String fakePayload = Base64.getUrlEncoder().withoutPadding()\n            .encodeToString("{\\\"sub\\\":\\\"hacker\\\",\\\"role\\\":\\\"ADMIN\\\"}".getBytes());\n        String tamperedJwt = parts[0] + "." + fakePayload + "." + parts[2];\n        System.out.println("\\nПосле изменения payload:");\n        System.out.println("Подпись валидна: " + verifyJwt(tamperedJwt));\n    }\n    \n    static String createJwt(String userId, String role) throws Exception {\n        // Header\n        String header = encode("{\\\"alg\\\":\\\"HS256\\\",\\\"typ\\\":\\\"JWT\\\"}");\n        \n        // Payload\n        long now = System.currentTimeMillis() / 1000;\n        String payloadJson = "{\\\"sub\\\":\\\"" + userId + "\\\"," +\n            "\\\"role\\\":\\\"" + role + "\\\"," +\n            "\\\"iat\\\":" + now + "," +\n            "\\\"exp\\\":" + (now + 3600) + "}";\n        String payload = encode(payloadJson);\n        \n        // Signature\n        String signature = sign(header + "." + payload);\n        \n        return header + "." + payload + "." + signature;\n    }\n    \n    static boolean verifyJwt(String jwt) throws Exception {\n        String[] parts = jwt.split("\\\\.");\n        if (parts.length != 3) return false;\n        String expectedSig = sign(parts[0] + "." + parts[1]);\n        return expectedSig.equals(parts[2]);\n    }\n    \n    static String decodePayload(String jwt) {\n        String[] parts = jwt.split("\\\\.");\n        return new String(Base64.getUrlDecoder().decode(parts[1]));\n    }\n    \n    static String encode(String json) {\n        return Base64.getUrlEncoder().withoutPadding().encodeToString(json.getBytes());\n    }\n    \n    static String sign(String data) throws Exception {\n        Mac hmac = Mac.getInstance("HmacSHA256");\n        hmac.init(new SecretKeySpec(SECRET.getBytes(), "HmacSHA256"));\n        return Base64.getUrlEncoder().withoutPadding().encodeToString(hmac.doFinal(data.getBytes()));\n    }\n}',
      explanation: 'Мы создали JWT вручную: 1) Header с алгоритмом HS256 кодируется в Base64URL. 2) Payload с данными пользователя и временными метками кодируется в Base64URL. 3) Подпись создаётся через HMAC-SHA256 из "header.payload" и секретного ключа. При подделке payload подпись перестаёт совпадать -- токен отклоняется.'
    },
    {
      id: 7,
      title: 'Практика: JWT с проверкой expiration',
      type: 'practice',
      difficulty: 'medium',
      description: 'Расширь JWT-систему: добавь проверку срока действия токена и извлечение claims.',
      requirements: [
        'Создай класс Main с методом main',
        'Создание JWT с exp (expiration time)',
        'Метод isExpired: проверяет, не истёк ли токен',
        'Метод getClaim: извлекает конкретный claim из payload',
        'Продемонстрируй работу с валидным и истёкшим токеном'
      ],
      expectedOutput: 'Токен 1 (действует 1 час):\n  Истёк: false\n  sub: user123\n  role: ADMIN\nТокен 2 (истёк):\n  Истёк: true\n  Доступ запрещён!',
      hint: 'Парси JSON payload вручную (через split и replace) или используй простой парсер. Сравнивай exp с текущим временем.',
      solution: 'import javax.crypto.Mac;\nimport javax.crypto.spec.SecretKeySpec;\nimport java.util.Base64;\n\npublic class Main {\n    static final String SECRET = "demo-secret-key-min-256-bits-long-!!!";\n    \n    public static void main(String[] args) throws Exception {\n        // Токен, действующий 1 час\n        String validToken = createJwt("user123", "ADMIN", 3600);\n        System.out.println("Токен 1 (действует 1 час):");\n        System.out.println("  Истёк: " + isExpired(validToken));\n        System.out.println("  sub: " + getClaim(validToken, "sub"));\n        System.out.println("  role: " + getClaim(validToken, "role"));\n        \n        // Токен, который уже истёк (exp в прошлом)\n        String expiredToken = createJwt("user456", "USER", -10);\n        System.out.println("\\nТокен 2 (истёк):");\n        System.out.println("  Истёк: " + isExpired(expiredToken));\n        if (isExpired(expiredToken)) {\n            System.out.println("  Доступ запрещён!");\n        }\n    }\n    \n    static String createJwt(String userId, String role, int ttlSeconds) throws Exception {\n        String header = encode("{\\\"alg\\\":\\\"HS256\\\",\\\"typ\\\":\\\"JWT\\\"}");\n        long now = System.currentTimeMillis() / 1000;\n        String payloadJson = "{\\\"sub\\\":\\\"" + userId + "\\\"," +\n            "\\\"role\\\":\\\"" + role + "\\\"," +\n            "\\\"iat\\\":" + now + "," +\n            "\\\"exp\\\":" + (now + ttlSeconds) + "}";\n        String payload = encode(payloadJson);\n        String signature = sign(header + "." + payload);\n        return header + "." + payload + "." + signature;\n    }\n    \n    static boolean isExpired(String jwt) {\n        String expStr = getClaim(jwt, "exp");\n        if (expStr == null) return true;\n        long exp = Long.parseLong(expStr);\n        long now = System.currentTimeMillis() / 1000;\n        return now > exp;\n    }\n    \n    static String getClaim(String jwt, String claimName) {\n        String[] parts = jwt.split("\\\\.");\n        if (parts.length != 3) return null;\n        String payload = new String(Base64.getUrlDecoder().decode(parts[1]));\n        // Простой парсинг JSON\n        String search = "\\\"" + claimName + "\\\":" ;\n        int idx = payload.indexOf(search);\n        if (idx == -1) return null;\n        int valueStart = idx + search.length();\n        // Пропускаем пробелы\n        while (valueStart < payload.length() && payload.charAt(valueStart) == \' \') valueStart++;\n        if (payload.charAt(valueStart) == \'\\"\') {\n            // Строковое значение\n            int valueEnd = payload.indexOf(\'\\"\', valueStart + 1);\n            return payload.substring(valueStart + 1, valueEnd);\n        } else {\n            // Числовое значение\n            int valueEnd = valueStart;\n            while (valueEnd < payload.length() && \n                   payload.charAt(valueEnd) != \',\' && payload.charAt(valueEnd) != \'}\') {\n                valueEnd++;\n            }\n            return payload.substring(valueStart, valueEnd).trim();\n        }\n    }\n    \n    static String encode(String json) {\n        return Base64.getUrlEncoder().withoutPadding().encodeToString(json.getBytes());\n    }\n    \n    static String sign(String data) throws Exception {\n        Mac hmac = Mac.getInstance("HmacSHA256");\n        hmac.init(new SecretKeySpec(SECRET.getBytes(), "HmacSHA256"));\n        return Base64.getUrlEncoder().withoutPadding().encodeToString(hmac.doFinal(data.getBytes()));\n    }\n}',
      explanation: 'Мы добавили проверку exp -- сравниваем время истечения с текущим временем. getClaim парсит JSON payload и извлекает конкретные значения. Токен с отрицательным TTL уже истёк в момент создания. В реальных приложениях access token живёт 15-60 минут, а проверка exp выполняется при каждом запросе.'
    }
  ]
}
