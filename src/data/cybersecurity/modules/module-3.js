export default {
  id: 3,
  title: 'Криптография: основы',
  description: 'Симметричное и асимметричное шифрование, хэш-функции, цифровые подписи, генерация случайных чисел и основные криптографические примитивы.',
  lessons: [
    {
      id: 1,
      title: 'Введение в криптографию',
      type: 'theory',
      content: [
        { type: 'text', value: 'Криптография — наука о защите информации с помощью математических методов. Основные задачи: конфиденциальность (шифрование), целостность (хэширование), аутентификация (подписи), неотказуемость (невозможность отрицать действие).' },
        { type: 'heading', value: 'Основные понятия' },
        { type: 'list', value: [
          'Plaintext (открытый текст) — исходные данные',
          'Ciphertext (шифротекст) — зашифрованные данные',
          'Key (ключ) — секрет, используемый для шифрования/дешифрования',
          'Algorithm (алгоритм) — метод преобразования (AES, RSA)',
          'Принцип Керкгоффса: безопасность зависит от ключа, а не секретности алгоритма'
        ]},
        { type: 'code', language: 'python', value: '# Простая демонстрация: шифр Цезаря (НЕ для реального использования!)\n\ndef caesar_encrypt(text: str, shift: int) -> str:\n    """Шифр Цезаря — исторический пример подстановочного шифра"""\n    result = []\n    for char in text:\n        if char.isalpha():\n            base = ord(\'A\') if char.isupper() else ord(\'a\')\n            encrypted = chr((ord(char) - base + shift) % 26 + base)\n            result.append(encrypted)\n        else:\n            result.append(char)\n    return \'\'.join(result)\n\ndef caesar_decrypt(text: str, shift: int) -> str:\n    return caesar_encrypt(text, -shift)\n\n# Шифрование\nplaintext = "Hello Security"\nciphertext = caesar_encrypt(plaintext, 3)\nprint(f"Зашифровано: {ciphertext}")  # Khoor Vhfxulwb\n\n# Дешифрование\ndecrypted = caesar_decrypt(ciphertext, 3)\nprint(f"Дешифровано: {decrypted}")   # Hello Security\n\n# Почему шифр Цезаря небезопасен:\n# - Только 25 возможных ключей (brute force за секунды)\n# - Частотный анализ раскрывает текст\n# - Нет понятия ключевого пространства' },
        { type: 'warning', value: 'Никогда не изобретайте собственные криптографические алгоритмы! Используйте проверенные библиотеки (OpenSSL, libsodium, cryptography для Python). Даже опытные криптографы публикуют алгоритмы для ревью сообществом перед использованием.' }
      ]
    },
    {
      id: 2,
      title: 'Симметричное шифрование',
      type: 'theory',
      content: [
        { type: 'text', value: 'В симметричном шифровании один и тот же ключ используется для шифрования и дешифрования. Быстрое, подходит для больших объёмов данных. Проблема: как безопасно передать ключ?' },
        { type: 'heading', value: 'Основные алгоритмы' },
        { type: 'list', value: [
          'AES (Advanced Encryption Standard) — стандарт, 128/192/256 бит ключ',
          'ChaCha20 — альтернатива AES, быстрее на мобильных устройствах',
          'DES/3DES — устаревшие, НЕ использовать',
          'Режимы: ECB (небезопасен!), CBC, CTR, GCM (шифрование + аутентификация)'
        ]},
        { type: 'code', language: 'python', value: 'from cryptography.hazmat.primitives.ciphers.aead import AESGCM\nimport os\n\n# AES-256-GCM — рекомендуемый режим\n# GCM обеспечивает и шифрование, и проверку целостности (AEAD)\n\ndef encrypt_aes_gcm(plaintext: bytes, key: bytes) -> tuple[bytes, bytes]:\n    """Шифрование AES-256-GCM"""\n    # Nonce (Number used ONCE) — уникальное значение для каждого шифрования\n    nonce = os.urandom(12)  # 96 бит для GCM\n    aesgcm = AESGCM(key)\n    ciphertext = aesgcm.encrypt(nonce, plaintext, None)\n    return nonce, ciphertext\n\ndef decrypt_aes_gcm(nonce: bytes, ciphertext: bytes, key: bytes) -> bytes:\n    """Дешифрование AES-256-GCM"""\n    aesgcm = AESGCM(key)\n    return aesgcm.decrypt(nonce, ciphertext, None)\n\n# Генерация ключа (256 бит = 32 байта)\nkey = AESGCM.generate_key(bit_length=256)\n\n# Шифрование\nmessage = "Секретное сообщение".encode(\'utf-8\')\nnonce, encrypted = encrypt_aes_gcm(message, key)\nprint(f"Зашифровано: {encrypted.hex()[:40]}...")\n\n# Дешифрование\ndecrypted = decrypt_aes_gcm(nonce, encrypted, key)\nprint(f"Дешифровано: {decrypted.decode(\'utf-8\')}")\n\n# Попытка изменить шифротекст — GCM обнаружит!\ntry:\n    tampered = bytearray(encrypted)\n    tampered[0] ^= 0xFF  # Изменяем 1 байт\n    decrypt_aes_gcm(nonce, bytes(tampered), key)\nexcept Exception as e:\n    print(f"Целостность нарушена: {e}")  # InvalidTag!' },
        { type: 'tip', value: 'Всегда используйте AES-GCM или ChaCha20-Poly1305 — они обеспечивают и шифрование, и аутентификацию (AEAD). Никогда не используйте ECB режим — он не скрывает паттерны в данных.' }
      ]
    },
    {
      id: 3,
      title: 'Асимметричное шифрование',
      type: 'theory',
      content: [
        { type: 'text', value: 'Асимметричное шифрование использует пару ключей: публичный (для шифрования) и приватный (для дешифрования). Решает проблему обмена ключами, но медленнее симметричного шифрования.' },
        { type: 'heading', value: 'Основные алгоритмы' },
        { type: 'list', value: [
          'RSA — основан на сложности факторизации больших чисел, ключ 2048+ бит',
          'ECDSA/ECDH — эллиптические кривые, короткие ключи (256 бит ≈ RSA 3072)',
          'Ed25519 — EdDSA на Curve25519, быстрая и безопасная подпись',
          'X25519 — обмен ключами Diffie-Hellman на Curve25519'
        ]},
        { type: 'code', language: 'python', value: 'from cryptography.hazmat.primitives.asymmetric import rsa, padding, ec\nfrom cryptography.hazmat.primitives import hashes, serialization\n\n# === RSA: генерация ключей ===\nprivate_key = rsa.generate_private_key(\n    public_exponent=65537,\n    key_size=4096  # Минимум 2048 бит!\n)\npublic_key = private_key.public_key()\n\n# Шифрование публичным ключом\nmessage = "Секретное сообщение".encode()\nciphertext = public_key.encrypt(\n    message,\n    padding.OAEP(\n        mgf=padding.MGF1(algorithm=hashes.SHA256()),\n        algorithm=hashes.SHA256(),\n        label=None\n    )\n)\nprint(f"RSA зашифровано: {len(ciphertext)} байт")\n\n# Дешифрование приватным ключом\nplaintext = private_key.decrypt(\n    ciphertext,\n    padding.OAEP(\n        mgf=padding.MGF1(algorithm=hashes.SHA256()),\n        algorithm=hashes.SHA256(),\n        label=None\n    )\n)\nprint(f"RSA дешифровано: {plaintext.decode()}")\n\n# === Гибридное шифрование (на практике) ===\n# 1. Генерируем случайный AES ключ (session key)\n# 2. Шифруем данные AES ключом (быстро, большие объёмы)\n# 3. Шифруем AES ключ RSA публичным ключом получателя\n# 4. Отправляем: зашифрованный AES ключ + зашифрованные данные\n# Так работает TLS, PGP, S/MIME' },
        { type: 'tip', value: 'На практике асимметричное шифрование используется для обмена ключами и подписей, а не для шифрования данных напрямую (слишком медленно). Гибридная схема: RSA/ECDH для обмена ключом + AES для данных.' }
      ]
    },
    {
      id: 4,
      title: 'Хэш-функции',
      type: 'theory',
      content: [
        { type: 'text', value: 'Хэш-функция преобразует данные произвольного размера в фиксированный хэш. Свойства: детерминированность, лавинный эффект, необратимость, устойчивость к коллизиям. Применение: проверка целостности, хранение паролей, цифровые подписи.' },
        { type: 'heading', value: 'Алгоритмы хэширования' },
        { type: 'list', value: [
          'SHA-256/SHA-3 — стандартные, для общего применения',
          'BLAKE2/BLAKE3 — быстрее SHA, криптографически безопасны',
          'bcrypt/scrypt/Argon2 — специально для паролей (медленные по дизайну!)',
          'MD5/SHA-1 — СЛОМАНЫ, не использовать для безопасности'
        ]},
        { type: 'code', language: 'python', value: 'import hashlib\nimport bcrypt\nimport secrets\n\n# === Хэширование данных (целостность) ===\ndata = "Важный документ".encode()\nhash_sha256 = hashlib.sha256(data).hexdigest()\nprint(f"SHA-256: {hash_sha256}")\n# Изменение одного символа полностью меняет хэш (лавинный эффект)\n\n# === НЕПРАВИЛЬНОЕ хэширование паролей ===\npassword = "MyPassword123"\n\n# ПЛОХО: простой SHA-256\nbad_hash = hashlib.sha256(password.encode()).hexdigest()\n# Атакующий подберёт за секунды с rainbow table!\n\n# ПЛОХО: SHA-256 + соль\nsalt = secrets.token_hex(16)\nstill_bad = hashlib.sha256((salt + password).encode()).hexdigest()\n# SHA-256 слишком быстрый — GPU перебирает миллиарды в секунду\n\n# === ПРАВИЛЬНОЕ хэширование паролей ===\n\n# bcrypt (рекомендуется)\npassword_bytes = password.encode(\'utf-8\')\nbcrypt_hash = bcrypt.hashpw(password_bytes, bcrypt.gensalt(rounds=12))\nprint(f"bcrypt: {bcrypt_hash.decode()}")\n\n# Проверка пароля\nis_valid = bcrypt.checkpw(password_bytes, bcrypt_hash)\nprint(f"Пароль верный: {is_valid}")\n\n# Argon2 (победитель Password Hashing Competition)\n# pip install argon2-cffi\nfrom argon2 import PasswordHasher\nph = PasswordHasher(\n    time_cost=3,      # Количество итераций\n    memory_cost=65536, # 64 MB RAM\n    parallelism=4      # Потоки\n)\nargon2_hash = ph.hash(password)\nprint(f"Argon2: {argon2_hash[:50]}...")\nph.verify(argon2_hash, password)  # True или исключение' },
        { type: 'warning', value: 'Для хэширования паролей ВСЕГДА используйте bcrypt, scrypt или Argon2. Обычные хэш-функции (SHA-256, MD5) непригодны — они слишком быстрые. GPU перебирает миллиарды SHA-256 хэшей в секунду, но только тысячи bcrypt хэшей.' }
      ]
    },
    {
      id: 5,
      title: 'Цифровые подписи',
      type: 'theory',
      content: [
        { type: 'text', value: 'Цифровая подпись гарантирует: аутентичность (кто отправил), целостность (данные не изменены), неотказуемость (отправитель не может отрицать). Процесс: хэш данных подписывается приватным ключом, верифицируется публичным.' },
        { type: 'code', language: 'python', value: 'from cryptography.hazmat.primitives.asymmetric import ed25519\nfrom cryptography.hazmat.primitives import hashes\nfrom cryptography.hazmat.primitives.asymmetric import utils\n\n# === Ed25519: современная цифровая подпись ===\n\n# Генерация ключей\nprivate_key = ed25519.Ed25519PrivateKey.generate()\npublic_key = private_key.public_key()\n\n# Подписание\nmessage = "Перевод 1000 рублей на счёт X".encode()\nsignature = private_key.sign(message)\nprint(f"Подпись: {signature.hex()[:40]}... ({len(signature)} байт)")\n\n# Верификация (любой может проверить, имея публичный ключ)\ntry:\n    public_key.verify(signature, message)\n    print("Подпись ВЕРНА — сообщение подлинное")\nexcept Exception:\n    print("Подпись НЕВЕРНА — сообщение подделано!")\n\n# Попытка подделки\ntampered_message = "Перевод 999999 рублей на счёт Y".encode()\ntry:\n    public_key.verify(signature, tampered_message)\n    print("Подпись верна")  # Не выполнится!\nexcept Exception:\n    print("Подпись НЕВЕРНА — подделка обнаружена!")\n\n# === Практическое применение ===\n# - Подпись Git коммитов (GPG/SSH ключи)\n# - Подпись Docker образов (Cosign, Notary)\n# - Подпись пакетов (apt, rpm, npm)\n# - JWT токены (подпись payload)\n# - Электронная подпись документов' },
        { type: 'code', language: 'bash', value: '# Подпись Git коммитов с GPG\n\n# Генерация GPG ключа\ngpg --full-generate-key\n# Выбрать: RSA and RSA, 4096 bits\n\n# Настройка Git\ngit config --global user.signingkey YOUR_KEY_ID\ngit config --global commit.gpgsign true\n\n# Подписанный коммит\ngit commit -S -m "Подписанный коммит"\n\n# Проверка подписи\ngit log --show-signature -1\n# gpg: Signature made Mon 05 Apr 2026 10:00:00\n# gpg: Good signature from "Your Name <email>"' },
        { type: 'tip', value: 'Ed25519 — предпочтительный алгоритм для новых проектов: быстрый, компактные подписи (64 байта), устойчив к timing attacks. Для SSH ключей используйте ssh-keygen -t ed25519.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Шифрование и подпись данных',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте систему безопасного обмена сообщениями с использованием гибридного шифрования и цифровых подписей.',
      requirements: [
        'Сгенерируйте RSA ключевую пару для отправителя и получателя',
        'Реализуйте гибридное шифрование: AES-GCM для данных + RSA для ключа',
        'Добавьте цифровую подпись отправителя (Ed25519)',
        'Реализуйте верификацию подписи и дешифрование на стороне получателя',
        'Продемонстрируйте обнаружение подделки при изменении данных'
      ],
      hint: 'Используйте библиотеку cryptography. Гибридная схема: 1) сгенерируйте AES ключ, 2) зашифруйте данные AES-GCM, 3) зашифруйте AES ключ RSA публичным ключом получателя, 4) подпишите всё Ed25519.',
      expectedOutput: 'Ключи сгенерированы: RSA-4096 (Alice, Bob), Ed25519 (Alice)\nСообщение зашифровано гибридным методом: AES-256-GCM + RSA-OAEP\nПодпись создана: Ed25519 (64 байта)\nBob дешифровал сообщение: "Привет, Bob! Это секретное сообщение."\nПодпись Alice верифицирована\nПопытка подделки обнаружена: InvalidSignature',
      solution: 'from cryptography.hazmat.primitives.asymmetric import rsa, padding, ed25519\nfrom cryptography.hazmat.primitives.ciphers.aead import AESGCM\nfrom cryptography.hazmat.primitives import hashes\nimport os\nimport json\nimport base64\n\ndef generate_rsa_keypair():\n    private = rsa.generate_private_key(public_exponent=65537, key_size=4096)\n    return private, private.public_key()\n\ndef hybrid_encrypt(plaintext: bytes, recipient_public_key, sender_sign_key):\n    # 1. Генерируем AES ключ\n    aes_key = AESGCM.generate_key(bit_length=256)\n    nonce = os.urandom(12)\n    \n    # 2. Шифруем данные AES-GCM\n    aesgcm = AESGCM(aes_key)\n    ciphertext = aesgcm.encrypt(nonce, plaintext, None)\n    \n    # 3. Шифруем AES ключ RSA\n    encrypted_key = recipient_public_key.encrypt(\n        aes_key,\n        padding.OAEP(\n            mgf=padding.MGF1(algorithm=hashes.SHA256()),\n            algorithm=hashes.SHA256(), label=None\n        )\n    )\n    \n    # 4. Подписываем всё\n    to_sign = nonce + encrypted_key + ciphertext\n    signature = sender_sign_key.sign(to_sign)\n    \n    return {\n        "nonce": base64.b64encode(nonce).decode(),\n        "encrypted_key": base64.b64encode(encrypted_key).decode(),\n        "ciphertext": base64.b64encode(ciphertext).decode(),\n        "signature": base64.b64encode(signature).decode()\n    }\n\ndef hybrid_decrypt(envelope, recipient_private_key, sender_verify_key):\n    nonce = base64.b64decode(envelope["nonce"])\n    encrypted_key = base64.b64decode(envelope["encrypted_key"])\n    ciphertext = base64.b64decode(envelope["ciphertext"])\n    signature = base64.b64decode(envelope["signature"])\n    \n    # 1. Верификация подписи\n    sender_verify_key.verify(signature, nonce + encrypted_key + ciphertext)\n    \n    # 2. Дешифруем AES ключ\n    aes_key = recipient_private_key.decrypt(\n        encrypted_key,\n        padding.OAEP(\n            mgf=padding.MGF1(algorithm=hashes.SHA256()),\n            algorithm=hashes.SHA256(), label=None\n        )\n    )\n    \n    # 3. Дешифруем данные\n    aesgcm = AESGCM(aes_key)\n    return aesgcm.decrypt(nonce, ciphertext, None)\n\n# Использование\nalice_rsa_priv, alice_rsa_pub = generate_rsa_keypair()\nbob_rsa_priv, bob_rsa_pub = generate_rsa_keypair()\nalice_sign = ed25519.Ed25519PrivateKey.generate()\nalice_verify = alice_sign.public_key()\n\nmessage = "Привет, Bob! Это секретное сообщение.".encode()\nenvelope = hybrid_encrypt(message, bob_rsa_pub, alice_sign)\nresult = hybrid_decrypt(envelope, bob_rsa_priv, alice_verify)\nprint(f"Дешифровано: {result.decode()}")',
      explanation: 'Гибридное шифрование сочетает преимущества обоих типов: RSA для безопасного обмена ключом (не нужен общий секрет), AES-GCM для быстрого шифрования данных. Ed25519 подпись обеспечивает аутентичность отправителя. Так работают TLS, PGP и другие реальные протоколы.'
    }
  ]
}
