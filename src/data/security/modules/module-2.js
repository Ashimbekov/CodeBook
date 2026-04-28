export default {
  id: 2,
  title: 'Хеширование паролей',
  description: 'Эволюция хеширования: от MD5 до Argon2, соль, rainbow tables и безопасное хранение паролей',
  lessons: [
    {
      id: 1,
      title: 'Зачем хешировать пароли?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Правило номер один: НИКОГДА не храни пароли в открытом виде! Если базу данных взломают -- все пароли утекут. Вместо этого храни хеш пароля.' },
        { type: 'heading', value: 'Что такое хеширование?' },
        { type: 'text', value: 'Хеш-функция -- это односторонняя функция: превращает любой текст в строку фиксированной длины. Из хеша невозможно восстановить исходный пароль.' },
        { type: 'code', language: 'java', value: '// Концепция хеширования\n// "password123" -> "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f"\n// "password124" -> "совершенно другой хеш"\n// Из хеша НЕЛЬЗЯ получить обратно "password123"' },
        { type: 'tip', value: 'Хеширование -- как мясорубка. Из мяса можно сделать фарш, но из фарша нельзя собрать обратно кусок мяса. Так же и хеш: из пароля можно получить хеш, но из хеша нельзя получить пароль.' },
        { type: 'heading', value: 'Как работает проверка пароля?' },
        { type: 'list', items: [
          'При регистрации: хешируем пароль и сохраняем хеш в базу',
          'При входе: хешируем введённый пароль и сравниваем хеши',
          'Если хеши совпадают -- пароль верный',
          'Сам пароль нигде не хранится!'
        ]},
        { type: 'warning', value: 'Если кто-то говорит "мы отправим вам ваш пароль на email" -- значит они хранят пароли в открытом виде! Нормальный сервис может только СБРОСИТЬ пароль, но не показать текущий.' }
      ]
    },
    {
      id: 2,
      title: 'MD5 и SHA: почему они устарели',
      type: 'theory',
      content: [
        { type: 'text', value: 'MD5 и SHA-1 были популярными хеш-функциями, но для хеширования паролей они больше НЕ безопасны. Разберём почему.' },
        { type: 'heading', value: 'MD5 (Message Digest 5)' },
        { type: 'text', value: 'MD5 создаёт 128-битный хеш (32 символа hex). Разработан в 1991 году. Проблема: слишком быстрый! Современный GPU может вычислить миллиарды MD5 хешей в секунду.' },
        { type: 'code', language: 'java', value: 'import java.security.MessageDigest;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        String password = "myPassword123";\n        \n        // MD5 хеширование (НЕ ИСПОЛЬЗОВАТЬ для паролей!)\n        MessageDigest md5 = MessageDigest.getInstance("MD5");\n        byte[] md5Hash = md5.digest(password.getBytes());\n        System.out.println("MD5:    " + bytesToHex(md5Hash));\n        \n        // SHA-256 хеширование (тоже НЕ рекомендуется для паролей)\n        MessageDigest sha256 = MessageDigest.getInstance("SHA-256");\n        byte[] sha256Hash = sha256.digest(password.getBytes());\n        System.out.println("SHA-256: " + bytesToHex(sha256Hash));\n        \n        // Одинаковый пароль = одинаковый хеш (проблема!)\n        byte[] hash2 = md5.digest(password.getBytes());\n        System.out.println("\\nОдинаковые хеши: " + bytesToHex(md5Hash).equals(bytesToHex(hash2)));\n    }\n    \n    static String bytesToHex(byte[] bytes) {\n        StringBuilder sb = new StringBuilder();\n        for (byte b : bytes) {\n            sb.append(String.format("%02x", b));\n        }\n        return sb.toString();\n    }\n}' },
        { type: 'heading', value: 'Почему быстрые хеши -- это плохо для паролей?' },
        { type: 'list', items: [
          'GPU может вычислить 10+ миллиардов MD5 в секунду',
          'Весь словарь паролей (миллиарды вариантов) проверяется за минуты',
          'Rainbow tables -- заранее посчитанные хеши для миллионов паролей',
          'SHA-256 лучше, но всё ещё слишком быстрый для паролей'
        ]},
        { type: 'warning', value: 'MD5 и SHA-1 подходят для проверки целостности файлов (checksum), но НИКОГДА не используй их для паролей!' }
      ]
    },
    {
      id: 3,
      title: 'Соль (Salt) и Rainbow Tables',
      type: 'theory',
      content: [
        { type: 'text', value: 'Даже если хеш-функция хорошая, одинаковые пароли дают одинаковые хеши. Это позволяет использовать rainbow tables -- заранее вычисленные таблицы хешей.' },
        { type: 'heading', value: 'Что такое Rainbow Table?' },
        { type: 'text', value: 'Rainbow table -- это база данных, где для каждого популярного пароля уже посчитан хеш. Атакующий просто ищет хеш в таблице и получает пароль. Без соли два пользователя с паролем "123456" имеют одинаковый хеш.' },
        { type: 'heading', value: 'Что такое соль (Salt)?' },
        { type: 'text', value: 'Соль -- это случайная строка, которая добавляется к паролю ПЕРЕД хешированием. Каждый пользователь получает свою уникальную соль.' },
        { type: 'code', language: 'java', value: 'import java.security.MessageDigest;\nimport java.security.SecureRandom;\nimport java.util.Base64;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        String password = "password123";\n        \n        // БЕЗ СОЛИ: одинаковые пароли = одинаковые хеши\n        System.out.println("=== Без соли ===" );\n        System.out.println("Хеш 1: " + hashWithoutSalt(password));\n        System.out.println("Хеш 2: " + hashWithoutSalt(password));\n        System.out.println("Одинаковые? ДА -- уязвимо!\\n");\n        \n        // С СОЛЬЮ: одинаковые пароли = РАЗНЫЕ хеши\n        System.out.println("=== С солью ===" );\n        String salted1 = hashWithSalt(password);\n        String salted2 = hashWithSalt(password);\n        System.out.println("Хеш 1: " + salted1);\n        System.out.println("Хеш 2: " + salted2);\n        System.out.println("Одинаковые? " + salted1.equals(salted2) + " -- безопасно!");\n    }\n    \n    static String hashWithoutSalt(String password) throws Exception {\n        MessageDigest md = MessageDigest.getInstance("SHA-256");\n        byte[] hash = md.digest(password.getBytes());\n        return Base64.getEncoder().encodeToString(hash);\n    }\n    \n    static String hashWithSalt(String password) throws Exception {\n        // Генерируем случайную соль\n        SecureRandom random = new SecureRandom();\n        byte[] salt = new byte[16];\n        random.nextBytes(salt);\n        \n        // Хешируем пароль + соль\n        MessageDigest md = MessageDigest.getInstance("SHA-256");\n        md.update(salt);\n        byte[] hash = md.digest(password.getBytes());\n        \n        // Сохраняем соль + хеш вместе\n        String saltStr = Base64.getEncoder().encodeToString(salt);\n        String hashStr = Base64.getEncoder().encodeToString(hash);\n        return saltStr + ":" + hashStr;\n    }\n}' },
        { type: 'note', value: 'Соль хранится рядом с хешем в базе данных (обычно через разделитель). Она не секретная! Её задача -- сделать каждый хеш уникальным, чтобы rainbow tables стали бесполезны.' }
      ]
    },
    {
      id: 4,
      title: 'bcrypt и Argon2: современные алгоритмы',
      type: 'theory',
      content: [
        { type: 'text', value: 'bcrypt и Argon2 -- это специальные алгоритмы, разработанные именно для хеширования паролей. Они намеренно медленные и устойчивы к GPU-атакам.' },
        { type: 'heading', value: 'bcrypt' },
        { type: 'text', value: 'bcrypt (1999) -- алгоритм на основе Blowfish. Ключевая особенность: параметр cost (work factor), который определяет количество итераций. Чем больше cost, тем медленнее хеширование.' },
        { type: 'list', items: [
          'Автоматически генерирует и хранит соль',
          'cost=10: ~100 мс на хеш (рекомендуемый минимум)',
          'cost=12: ~300 мс на хеш',
          'Увеличение cost на 1 удваивает время'
        ]},
        { type: 'heading', value: 'Argon2' },
        { type: 'text', value: 'Argon2 (2015) -- победитель конкурса Password Hashing Competition. Он ещё безопаснее bcrypt, потому что использует много оперативной памяти, что делает GPU-атаки практически невозможными.' },
        { type: 'code', language: 'java', value: '// Имитация работы bcrypt (упрощённая модель)\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        String password = "securePass123";\n        \n        // Имитация bcrypt с разными cost factors\n        System.out.println("=== Имитация bcrypt ===");\n        for (int cost = 10; cost <= 14; cost++) {\n            long start = System.currentTimeMillis();\n            String hash = simpleBcrypt(password, cost);\n            long time = System.currentTimeMillis() - start;\n            System.out.println("Cost " + cost + ": " + time + " мс -> " + hash.substring(0, 30) + "...");\n        }\n        \n        // Проверка пароля\n        System.out.println("\\n=== Проверка пароля ===");\n        String storedHash = simpleBcrypt(password, 10);\n        System.out.println("Верный пароль: " + verifyPassword(password, 10, storedHash));\n        System.out.println("Неверный пароль: " + verifyPassword("wrongPass", 10, storedHash));\n    }\n    \n    // Упрощённая имитация bcrypt (в реальности используй библиотеку!)\n    static String simpleBcrypt(String password, int cost) throws Exception {\n        java.security.MessageDigest md = java.security.MessageDigest.getInstance("SHA-256");\n        byte[] hash = password.getBytes();\n        \n        // Многократное хеширование (2^cost итераций)\n        int iterations = 1 << cost; // 2^cost\n        for (int i = 0; i < iterations; i++) {\n            md.update(hash);\n            hash = md.digest();\n        }\n        \n        return java.util.Base64.getEncoder().encodeToString(hash);\n    }\n    \n    static boolean verifyPassword(String password, int cost, String storedHash) throws Exception {\n        String newHash = simpleBcrypt(password, cost);\n        return newHash.equals(storedHash);\n    }\n}' },
        { type: 'heading', value: 'Что выбрать?' },
        { type: 'list', items: [
          'bcrypt -- проверенный временем, поддерживается везде, хороший выбор для большинства',
          'Argon2 -- самый безопасный, но требует больше памяти и настройки',
          'scrypt -- компромисс между bcrypt и Argon2'
        ]},
        { type: 'tip', value: 'Google использует scrypt, Dropbox -- bcrypt поверх SHA-512. Для нового проекта рекомендуется bcrypt с cost >= 12 или Argon2id.' }
      ]
    },
    {
      id: 5,
      title: 'Практика: Хеширование с солью',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй систему регистрации и входа с хешированием паролей и солью.',
      requirements: [
        'Создай класс Main с методом main',
        'Метод register: хеширует пароль с уникальной солью (SHA-256)',
        'Метод login: проверяет пароль по сохранённому хешу и соли',
        'Храни пользователей в Map<String, String> (username -> salt:hash)',
        'Зарегистрируй 2 пользователя и проверь вход с верным/неверным паролем'
      ],
      expectedOutput: 'Регистрация admin: OK\nРегистрация user1: OK\nВход admin/adminPass: true\nВход admin/wrongPass: false\nВход user1/user1Pass: true\nВход unknown/pass: false',
      hint: 'Используй SecureRandom для генерации соли и MessageDigest для SHA-256. Храни соль и хеш через разделитель ":".',
      solution: 'import java.security.MessageDigest;\nimport java.security.SecureRandom;\nimport java.util.Base64;\nimport java.util.HashMap;\nimport java.util.Map;\n\npublic class Main {\n    static Map<String, String> userStore = new HashMap<>(); // username -> salt:hash\n    \n    public static void main(String[] args) throws Exception {\n        // Регистрация\n        System.out.println("Регистрация admin: " + register("admin", "adminPass"));\n        System.out.println("Регистрация user1: " + register("user1", "user1Pass"));\n        \n        // Вход\n        System.out.println("Вход admin/adminPass: " + login("admin", "adminPass"));\n        System.out.println("Вход admin/wrongPass: " + login("admin", "wrongPass"));\n        System.out.println("Вход user1/user1Pass: " + login("user1", "user1Pass"));\n        System.out.println("Вход unknown/pass: " + login("unknown", "pass"));\n    }\n    \n    static String register(String username, String password) throws Exception {\n        if (userStore.containsKey(username)) return "уже существует";\n        \n        // Генерируем соль\n        SecureRandom random = new SecureRandom();\n        byte[] salt = new byte[16];\n        random.nextBytes(salt);\n        String saltBase64 = Base64.getEncoder().encodeToString(salt);\n        \n        // Хешируем пароль с солью\n        String hash = hashPassword(password, salt);\n        \n        // Сохраняем salt:hash\n        userStore.put(username, saltBase64 + ":" + hash);\n        return "OK";\n    }\n    \n    static boolean login(String username, String password) throws Exception {\n        String stored = userStore.get(username);\n        if (stored == null) return false;\n        \n        // Извлекаем соль и хеш\n        String[] parts = stored.split(":");\n        byte[] salt = Base64.getDecoder().decode(parts[0]);\n        String storedHash = parts[1];\n        \n        // Хешируем введённый пароль с той же солью\n        String inputHash = hashPassword(password, salt);\n        return storedHash.equals(inputHash);\n    }\n    \n    static String hashPassword(String password, byte[] salt) throws Exception {\n        MessageDigest md = MessageDigest.getInstance("SHA-256");\n        md.update(salt);\n        byte[] hash = md.digest(password.getBytes());\n        return Base64.getEncoder().encodeToString(hash);\n    }\n}',
      explanation: 'При регистрации генерируется уникальная соль для каждого пользователя. Пароль хешируется с этой солью через SHA-256. В хранилище сохраняется "соль:хеш". При входе извлекается соль из хранилища, введённый пароль хешируется с той же солью, и результат сравнивается с сохранённым хешем.'
    },
    {
      id: 6,
      title: 'Практика: Имитация bcrypt',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй упрощённую версию bcrypt с настраиваемым cost factor и продемонстрируй влияние cost на время хеширования.',
      requirements: [
        'Создай класс Main с методом main',
        'Метод hashPassword(password, cost): многократное хеширование (2^cost итераций) с солью',
        'Метод verifyPassword(password, storedHash): проверка пароля',
        'Формат хранения: cost:salt:hash',
        'Продемонстрируй время хеширования для cost 10, 12, 14, 16'
      ],
      expectedOutput: 'Cost 10 (1024 итераций): ~X мс\nCost 12 (4096 итераций): ~X мс\nCost 14 (16384 итераций): ~X мс\nCost 16 (65536 итераций): ~X мс\nПроверка верного пароля: true\nПроверка неверного пароля: false',
      hint: 'Используй 1 << cost для вычисления количества итераций (2^cost). В каждой итерации обновляй хеш через MessageDigest.',
      solution: 'import java.security.MessageDigest;\nimport java.security.SecureRandom;\nimport java.util.Base64;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        String password = "mySecurePassword";\n        \n        // Демонстрация влияния cost factor\n        int[] costs = {10, 12, 14, 16};\n        for (int cost : costs) {\n            long start = System.nanoTime();\n            String hashed = hashPassword(password, cost);\n            long timeMs = (System.nanoTime() - start) / 1_000_000;\n            int iterations = 1 << cost;\n            System.out.println("Cost " + cost + " (" + iterations + " итераций): " + timeMs + " мс");\n        }\n        \n        // Проверка пароля\n        System.out.println();\n        String stored = hashPassword(password, 12);\n        System.out.println("Сохранённый хеш: " + stored.substring(0, 40) + "...");\n        System.out.println("Проверка верного пароля: " + verifyPassword(password, stored));\n        System.out.println("Проверка неверного пароля: " + verifyPassword("wrongPass", stored));\n    }\n    \n    static String hashPassword(String password, int cost) throws Exception {\n        SecureRandom random = new SecureRandom();\n        byte[] salt = new byte[16];\n        random.nextBytes(salt);\n        \n        byte[] hash = computeHash(password, salt, cost);\n        \n        String saltB64 = Base64.getEncoder().encodeToString(salt);\n        String hashB64 = Base64.getEncoder().encodeToString(hash);\n        return cost + ":" + saltB64 + ":" + hashB64;\n    }\n    \n    static boolean verifyPassword(String password, String stored) throws Exception {\n        String[] parts = stored.split(":");\n        int cost = Integer.parseInt(parts[0]);\n        byte[] salt = Base64.getDecoder().decode(parts[1]);\n        String storedHash = parts[2];\n        \n        byte[] hash = computeHash(password, salt, cost);\n        String computedHash = Base64.getEncoder().encodeToString(hash);\n        return storedHash.equals(computedHash);\n    }\n    \n    static byte[] computeHash(String password, byte[] salt, int cost) throws Exception {\n        MessageDigest md = MessageDigest.getInstance("SHA-256");\n        md.update(salt);\n        byte[] hash = md.digest(password.getBytes());\n        \n        int iterations = 1 << cost;\n        for (int i = 1; i < iterations; i++) {\n            md.reset();\n            hash = md.digest(hash);\n        }\n        return hash;\n    }\n}',
      explanation: 'Мы имитируем bcrypt через многократное хеширование SHA-256. Cost factor определяет количество итераций (2^cost). При cost=10 это 1024 итерации, при cost=16 -- 65536. Чем больше cost, тем дольше хеширование. Это намеренно замедляет brute force. Формат "cost:salt:hash" хранит все параметры для проверки.'
    }
  ]
}
