export default {
  id: 10,
  title: 'Шифрование',
  description: 'Симметричное и асимметричное шифрование, AES, RSA, TLS и цифровые подписи',
  lessons: [
    {
      id: 1,
      title: 'Основы шифрования',
      type: 'theory',
      content: [
        { type: 'text', value: 'Шифрование -- это процесс превращения читаемых данных (plaintext) в нечитаемые (ciphertext) с помощью ключа. Только владелец ключа может расшифровать данные обратно.' },
        { type: 'heading', value: 'Два типа шифрования' },
        { type: 'list', items: [
          'Симметричное -- один ключ для шифрования и расшифровки (AES, DES)',
          'Асимметричное -- два ключа: публичный для шифрования, приватный для расшифровки (RSA, ECDSA)'
        ]},
        { type: 'tip', value: 'Симметричное шифрование -- как замок с одним ключом. Ты и получатель должны иметь копию одного ключа. Асимметричное -- как почтовый ящик: любой может бросить письмо (публичный ключ), но только ты можешь его открыть (приватный ключ).' },
        { type: 'code', language: 'java', value: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("=== Симметричное шифрование (упрощённо) ===");\n        String message = "Hello, Security!";\n        int key = 42; // простой ключ (в реальности -- 256 бит)\n        \n        String encrypted = symmetricEncrypt(message, key);\n        String decrypted = symmetricEncrypt(encrypted, key); // XOR обратим!\n        \n        System.out.println("Plaintext:  " + message);\n        System.out.println("Encrypted:  " + encrypted);\n        System.out.println("Decrypted:  " + decrypted);\n        \n        System.out.println("\\n=== Асимметричное шифрование (концепция) ===");\n        System.out.println("Публичный ключ: шифрует (доступен всем)");\n        System.out.println("Приватный ключ: расшифровывает (только у владельца)");\n        System.out.println("Пример: HTTPS -- браузер шифрует публичным ключом сервера");\n    }\n    \n    static String symmetricEncrypt(String text, int key) {\n        StringBuilder result = new StringBuilder();\n        for (char c : text.toCharArray()) {\n            result.append((char)(c ^ key)); // XOR -- простейшее шифрование\n        }\n        return result.toString();\n    }\n}' },
        { type: 'note', value: 'XOR -- простейший шифр для демонстрации. В реальности используй AES-256-GCM -- он быстрый и безопасный. Никогда не изобретай свой шифр!' }
      ]
    },
    {
      id: 2,
      title: 'AES: симметричное шифрование',
      type: 'theory',
      content: [
        { type: 'text', value: 'AES (Advanced Encryption Standard) -- стандарт симметричного шифрования. Используется повсеместно: HTTPS, Wi-Fi, VPN, шифрование дисков.' },
        { type: 'heading', value: 'Параметры AES' },
        { type: 'list', items: [
          'Размер ключа: 128, 192 или 256 бит (рекомендуется 256)',
          'Режимы: ECB (небезопасный!), CBC, GCM (рекомендуется)',
          'IV (Initialization Vector) -- случайный вектор для каждого сообщения',
          'GCM -- обеспечивает и шифрование, и проверку целостности (AEAD)'
        ]},
        { type: 'code', language: 'java', value: 'import javax.crypto.Cipher;\nimport javax.crypto.KeyGenerator;\nimport javax.crypto.SecretKey;\nimport javax.crypto.spec.GCMParameterSpec;\nimport java.security.SecureRandom;\nimport java.util.Base64;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        // Генерация AES-256 ключа\n        KeyGenerator keyGen = KeyGenerator.getInstance("AES");\n        keyGen.init(256);\n        SecretKey key = keyGen.generateKey();\n        System.out.println("AES-256 ключ: " + Base64.getEncoder().encodeToString(key.getEncoded()));\n        \n        String plaintext = "Секретное сообщение: перевод 500000 тг";\n        System.out.println("\\nPlaintext: " + plaintext);\n        \n        // Шифрование\n        byte[] iv = new byte[12]; // 96 бит для GCM\n        new SecureRandom().nextBytes(iv);\n        \n        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");\n        cipher.init(Cipher.ENCRYPT_MODE, key, new GCMParameterSpec(128, iv));\n        byte[] encrypted = cipher.doFinal(plaintext.getBytes("UTF-8"));\n        \n        String encBase64 = Base64.getEncoder().encodeToString(encrypted);\n        String ivBase64 = Base64.getEncoder().encodeToString(iv);\n        System.out.println("Encrypted: " + encBase64);\n        System.out.println("IV: " + ivBase64);\n        \n        // Расшифровка\n        Cipher decipher = Cipher.getInstance("AES/GCM/NoPadding");\n        decipher.init(Cipher.DECRYPT_MODE, key, new GCMParameterSpec(128, iv));\n        byte[] decrypted = decipher.doFinal(encrypted);\n        \n        System.out.println("Decrypted: " + new String(decrypted, "UTF-8"));\n    }\n}' },
        { type: 'warning', value: 'НИКОГДА не используй режим ECB! Он шифрует одинаковые блоки одинаково -- видны паттерны в данных. Всегда используй GCM (лучший выбор) или CBC + HMAC.' }
      ]
    },
    {
      id: 3,
      title: 'RSA: асимметричное шифрование',
      type: 'theory',
      content: [
        { type: 'text', value: 'RSA -- алгоритм асимметричного шифрования. Два ключа: публичный (для шифрования/верификации) и приватный (для расшифровки/подписи).' },
        { type: 'heading', value: 'Использование RSA' },
        { type: 'list', items: [
          'HTTPS/TLS -- обмен сессионным ключом',
          'JWT подпись (RS256) -- подписание приватным, верификация публичным',
          'SSH ключи -- авторизация без пароля',
          'Электронная подпись -- подтверждение авторства документа'
        ]},
        { type: 'code', language: 'java', value: 'import java.security.*;\nimport javax.crypto.Cipher;\nimport java.util.Base64;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        // Генерация пары ключей RSA-2048\n        KeyPairGenerator keyPairGen = KeyPairGenerator.getInstance("RSA");\n        keyPairGen.initialize(2048);\n        KeyPair keyPair = keyPairGen.generateKeyPair();\n        \n        PublicKey publicKey = keyPair.getPublic();\n        PrivateKey privateKey = keyPair.getPrivate();\n        \n        System.out.println("RSA-2048 ключи сгенерированы");\n        System.out.println("Public key:  " + Base64.getEncoder().encodeToString(publicKey.getEncoded()).substring(0, 40) + "...");\n        System.out.println("Private key: " + Base64.getEncoder().encodeToString(privateKey.getEncoded()).substring(0, 40) + "...\\n");\n        \n        // Шифрование публичным ключом\n        String message = "Top Secret: code 42";\n        Cipher cipher = Cipher.getInstance("RSA/ECB/OAEPWithSHA-256AndMGF1Padding");\n        cipher.init(Cipher.ENCRYPT_MODE, publicKey);\n        byte[] encrypted = cipher.doFinal(message.getBytes());\n        System.out.println("Plaintext:  " + message);\n        System.out.println("Encrypted:  " + Base64.getEncoder().encodeToString(encrypted).substring(0, 40) + "...\\n");\n        \n        // Расшифровка приватным ключом\n        cipher.init(Cipher.DECRYPT_MODE, privateKey);\n        byte[] decrypted = cipher.doFinal(encrypted);\n        System.out.println("Decrypted:  " + new String(decrypted));\n        \n        // Цифровая подпись\n        System.out.println("\\n=== Цифровая подпись ===" );\n        String document = "Договор #123: сумма 1000000 тг";\n        Signature signer = Signature.getInstance("SHA256withRSA");\n        signer.initSign(privateKey);\n        signer.update(document.getBytes());\n        byte[] signature = signer.sign();\n        System.out.println("Документ:  " + document);\n        System.out.println("Подпись:   " + Base64.getEncoder().encodeToString(signature).substring(0, 40) + "...");\n        \n        // Верификация подписи\n        Signature verifier = Signature.getInstance("SHA256withRSA");\n        verifier.initVerify(publicKey);\n        verifier.update(document.getBytes());\n        System.out.println("Верификация: " + verifier.verify(signature));\n        \n        // Попытка подделки\n        verifier.initVerify(publicKey);\n        verifier.update("Договор #123: сумма 9999999 тг".getBytes());\n        System.out.println("Подделка:    " + verifier.verify(signature));\n    }\n}' },
        { type: 'note', value: 'RSA медленнее AES в ~1000 раз. Поэтому в TLS RSA используется только для обмена AES-ключом, а дальше всё шифруется AES. Это называется гибридное шифрование.' }
      ]
    },
    {
      id: 4,
      title: 'TLS/HTTPS: шифрование в сети',
      type: 'theory',
      content: [
        { type: 'text', value: 'TLS (Transport Layer Security) -- протокол шифрования данных между клиентом и сервером. HTTPS = HTTP + TLS.' },
        { type: 'heading', value: 'TLS Handshake (упрощённо)' },
        { type: 'list', items: [
          'Client Hello: браузер отправляет поддерживаемые алгоритмы шифрования',
          'Server Hello: сервер выбирает алгоритм и отправляет сертификат',
          'Верификация: браузер проверяет сертификат через CA',
          'Key Exchange: обмен сессионным ключом (через RSA или ECDHE)',
          'Encrypted: все данные шифруются сессионным AES-ключом'
        ]},
        { type: 'code', language: 'java', value: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("=== TLS Handshake (упрощённо) ===\\n");\n        \n        // Шаг 1\n        System.out.println("1. Client Hello:");\n        System.out.println("   Поддерживаемые шифры: TLS_AES_256_GCM_SHA384, TLS_CHACHA20_POLY1305");\n        System.out.println("   TLS версия: 1.3\\n");\n        \n        // Шаг 2\n        System.out.println("2. Server Hello:");\n        System.out.println("   Выбранный шифр: TLS_AES_256_GCM_SHA384");\n        System.out.println("   Сертификат: CN=kaspi.kz, Issuer=Let\\'s Encrypt\\n");\n        \n        // Шаг 3\n        System.out.println("3. Certificate Verification:");\n        System.out.println("   Подпись сертификата валидна: true");\n        System.out.println("   Домен совпадает: kaspi.kz == kaspi.kz");\n        System.out.println("   Не истёк: true");\n        System.out.println("   Цепочка доверия: kaspi.kz -> Let\\'s Encrypt -> Root CA\\n");\n        \n        // Шаг 4\n        System.out.println("4. Key Exchange (ECDHE):");\n        System.out.println("   Генерация эфемерных ключей...");\n        System.out.println("   Общий секрет вычислен (без передачи по сети!)\\n");\n        \n        // Шаг 5\n        System.out.println("5. Encrypted Communication:");\n        System.out.println("   Все данные шифруются AES-256-GCM");\n        System.out.println("   Forward Secrecy: даже при утечке ключа сервера");\n        System.out.println("   прошлые сессии не расшифруются\\n");\n        \n        // Без TLS\n        System.out.println("=== Без TLS (HTTP) ===");\n        System.out.println("   Логин: POST /login {password: \\'mypass\\'}  <-- ВИДНО ВСЕМ!");\n        System.out.println("   Cookie: session=abc123  <-- ПЕРЕХВАТ!");\n        System.out.println("   Man-in-the-Middle может читать и изменять ВСЕ данные");\n    }\n}' },
        { type: 'warning', value: 'В 2025 году нет причин использовать HTTP. Всегда используй HTTPS! Let\'s Encrypt выдаёт бесплатные TLS-сертификаты. Без HTTPS любые пароли, токены и данные передаются в открытом виде.' },
        { type: 'tip', value: 'TLS 1.3 (2018) значительно быстрее и безопаснее TLS 1.2: handshake за 1 round-trip вместо 2, убраны устаревшие алгоритмы, обязательный forward secrecy.' }
      ]
    },
    {
      id: 5,
      title: 'Практика: AES шифрование сообщений',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй систему шифрования сообщений с помощью AES-GCM с управлением ключами.',
      requirements: [
        'Создай класс Main с методом main',
        'Генерация AES-256 ключа',
        'Метод encrypt: шифрование с новым IV для каждого сообщения',
        'Метод decrypt: расшифровка (нужен тот же ключ и IV)',
        'Формат: IV:ciphertext (Base64)',
        'Покажи что разные сообщения с одним ключом дают разные шифротексты'
      ],
      expectedOutput: 'Сообщение 1: "Привет" -> encrypted1\nСообщение 2: "Привет" -> encrypted2 (отличается!)\nДешифровка 1: "Привет"\nДешифровка 2: "Привет"\nНеверный ключ: ОШИБКА дешифровки',
      hint: 'Генерируй новый IV (12 байт) для каждого шифрования. Конкатенируй IV + ciphertext для хранения.',
      solution: 'import javax.crypto.*;\nimport javax.crypto.spec.*;\nimport java.security.SecureRandom;\nimport java.util.Base64;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        // Генерация ключа\n        KeyGenerator keyGen = KeyGenerator.getInstance("AES");\n        keyGen.init(256);\n        SecretKey key = keyGen.generateKey();\n        SecretKey wrongKey = keyGen.generateKey();\n        \n        // Одинаковые сообщения -> разные шифротексты (разные IV)\n        String msg = "Привет, мир!";\n        String enc1 = encrypt(msg, key);\n        String enc2 = encrypt(msg, key);\n        \n        System.out.println("Сообщение: \\\"" + msg + "\\\"");\n        System.out.println("Encrypted 1: " + enc1.substring(0, 40) + "...");\n        System.out.println("Encrypted 2: " + enc2.substring(0, 40) + "...");\n        System.out.println("Одинаковые? " + enc1.equals(enc2) + " (разные IV!)\\n");\n        \n        // Дешифровка\n        System.out.println("Decrypted 1: \\\"" + decrypt(enc1, key) + "\\\"");\n        System.out.println("Decrypted 2: \\\"" + decrypt(enc2, key) + "\\\"");\n        \n        // Несколько разных сообщений\n        System.out.println();\n        String[] messages = {"Секретный код: 42", "Перевод: 500000 тг", "PIN: скрыт"};\n        for (String m : messages) {\n            String encrypted = encrypt(m, key);\n            String decrypted = decrypt(encrypted, key);\n            System.out.println("\\\"" + m + "\\\" -> encrypted -> \\\"" + decrypted + "\\\"");\n        }\n        \n        // Неверный ключ\n        System.out.println("\\nНеверный ключ:");\n        try {\n            decrypt(enc1, wrongKey);\n        } catch (Exception e) {\n            System.out.println("  ОШИБКА: " + e.getClass().getSimpleName());\n        }\n    }\n    \n    static String encrypt(String plaintext, SecretKey key) throws Exception {\n        byte[] iv = new byte[12];\n        new SecureRandom().nextBytes(iv);\n        \n        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");\n        cipher.init(Cipher.ENCRYPT_MODE, key, new GCMParameterSpec(128, iv));\n        byte[] encrypted = cipher.doFinal(plaintext.getBytes("UTF-8"));\n        \n        // IV + ciphertext\n        byte[] combined = new byte[iv.length + encrypted.length];\n        System.arraycopy(iv, 0, combined, 0, iv.length);\n        System.arraycopy(encrypted, 0, combined, iv.length, encrypted.length);\n        \n        return Base64.getEncoder().encodeToString(combined);\n    }\n    \n    static String decrypt(String encryptedBase64, SecretKey key) throws Exception {\n        byte[] combined = Base64.getDecoder().decode(encryptedBase64);\n        \n        byte[] iv = new byte[12];\n        byte[] encrypted = new byte[combined.length - 12];\n        System.arraycopy(combined, 0, iv, 0, 12);\n        System.arraycopy(combined, 12, encrypted, 0, encrypted.length);\n        \n        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");\n        cipher.init(Cipher.DECRYPT_MODE, key, new GCMParameterSpec(128, iv));\n        return new String(cipher.doFinal(encrypted), "UTF-8");\n    }\n}',
      explanation: 'AES-256-GCM: 1) Каждое сообщение шифруется с уникальным IV (12 байт) -- поэтому одинаковые сообщения дают разный ciphertext. 2) IV хранится вместе с ciphertext (не секретный). 3) GCM обеспечивает AEAD -- шифрование + проверку целостности. 4) Неверный ключ вызывает AEADBadTagException. Это production-ready подход.'
    },
    {
      id: 6,
      title: 'Практика: RSA цифровая подпись',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй систему цифровых подписей документов с помощью RSA.',
      requirements: [
        'Создай класс Main с методом main',
        'Генерация RSA-2048 пары ключей',
        'Метод signDocument: подписание документа приватным ключом',
        'Метод verifySignature: верификация подписи публичным ключом',
        'Покажи что изменённый документ не проходит верификацию'
      ],
      expectedOutput: 'Документ подписан\nВерификация оригинала: true\nВерификация изменённого: false\nВерификация чужим ключом: false',
      hint: 'Используй java.security.Signature с алгоритмом SHA256withRSA.',
      solution: 'import java.security.*;\nimport java.util.Base64;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        // Генерация ключей\n        KeyPairGenerator gen = KeyPairGenerator.getInstance("RSA");\n        gen.initialize(2048);\n        KeyPair authorKeys = gen.generateKeyPair();\n        KeyPair otherKeys = gen.generateKeyPair();\n        \n        // Документ\n        String document = "Договор аренды #42. Сумма: 200000 тг/мес. Срок: 12 месяцев.";\n        System.out.println("Документ: " + document);\n        \n        // Подписание\n        byte[] signature = signDocument(document, authorKeys.getPrivate());\n        System.out.println("Подпись: " + Base64.getEncoder().encodeToString(signature).substring(0, 40) + "...");\n        \n        // Верификация оригинала\n        boolean valid = verifySignature(document, signature, authorKeys.getPublic());\n        System.out.println("\\nВерификация оригинала: " + valid);\n        \n        // Верификация изменённого документа\n        String tampered = "Договор аренды #42. Сумма: 999999 тг/мес. Срок: 12 месяцев.";\n        boolean tamperedValid = verifySignature(tampered, signature, authorKeys.getPublic());\n        System.out.println("Верификация изменённого: " + tamperedValid);\n        \n        // Верификация чужим ключом\n        boolean wrongKey = verifySignature(document, signature, otherKeys.getPublic());\n        System.out.println("Верификация чужим ключом: " + wrongKey);\n        \n        // Подпись нескольких документов\n        System.out.println("\\n=== Пакетная подпись ===");\n        String[] docs = {\n            "Акт приёма-передачи #1",\n            "Счёт на оплату #1001",\n            "Накладная #555"\n        };\n        for (String doc : docs) {\n            byte[] sig = signDocument(doc, authorKeys.getPrivate());\n            boolean v = verifySignature(doc, sig, authorKeys.getPublic());\n            System.out.println(doc + " -> подписан, верификация: " + v);\n        }\n    }\n    \n    static byte[] signDocument(String document, PrivateKey privateKey) throws Exception {\n        Signature signer = Signature.getInstance("SHA256withRSA");\n        signer.initSign(privateKey);\n        signer.update(document.getBytes("UTF-8"));\n        return signer.sign();\n    }\n    \n    static boolean verifySignature(String document, byte[] signature, PublicKey publicKey) throws Exception {\n        Signature verifier = Signature.getInstance("SHA256withRSA");\n        verifier.initVerify(publicKey);\n        verifier.update(document.getBytes("UTF-8"));\n        return verifier.verify(signature);\n    }\n}',
      explanation: 'RSA цифровая подпись: 1) Документ хешируется SHA-256, хеш подписывается приватным ключом. 2) Верификация: вычисляется хеш документа и проверяется подпись публичным ключом. 3) Изменение даже одного символа делает подпись невалидной. 4) Чужой публичный ключ не может верифицировать подпись. Это основа ЭЦП, используемой в eGov и банкинге.'
    }
  ]
}
