export default {
  id: 24,
  title: 'Compliance и стандарты',
  description: 'GDPR, PCI DSS, SOC 2, ISO 27001: требования, внедрение, аудит и построение программы соответствия стандартам безопасности.',
  lessons: [
    {
      id: 1,
      title: 'Обзор стандартов и регуляций безопасности',
      type: 'theory',
      content: [
        { type: 'text', value: 'Compliance (соответствие) — выполнение обязательных (регуляции) и добровольных (стандарты) требований безопасности. Несоблюдение регуляций влечёт штрафы, судебные иски и репутационный ущерб. Стандарты помогают структурировать программу безопасности.' },
        { type: 'heading', value: 'Основные регуляции и стандарты' },
        { type: 'list', value: [
          'GDPR — защита персональных данных граждан ЕС (штраф до 4% годового оборота)',
          'PCI DSS — безопасность платёжных карт (обязателен для обработки карт)',
          'SOC 2 — доверие к SaaS-провайдерам (Type I: дизайн, Type II: операционная эффективность)',
          'ISO 27001 — международная система управления информационной безопасностью (ISMS)',
          'HIPAA — защита медицинских данных (США)',
          'ФЗ-152 — защита персональных данных (Россия)',
          'SOX — финансовая отчётность и внутренний контроль (публичные компании)',
          'NIST CSF — фреймворк кибербезопасности (Identify, Protect, Detect, Respond, Recover)'
        ]},
        { type: 'code', language: 'bash', value: '# === Какой стандарт нужен вашей компании? ===\n\n# Обрабатываете данные граждан ЕС?\n#   -> GDPR (обязательно)\n\n# Принимаете платежи картами?\n#   -> PCI DSS (обязательно)\n\n# SaaS продукт для бизнеса?\n#   -> SOC 2 (клиенты потребуют)\n\n# Международные клиенты / enterprise?\n#   -> ISO 27001 (конкурентное преимущество)\n\n# Медицинские данные (США)?\n#   -> HIPAA (обязательно)\n\n# Персональные данные граждан РФ?\n#   -> ФЗ-152 (обязательно)\n\n# Стартап, ещё нет клиентов?\n#   -> SOC 2 Type I (минимальный порог для B2B продаж)\n#   -> GDPR (если рынок ЕС)\n\n# === Порядок внедрения ===\n# 1. NIST CSF или ISO 27001 как основа (фреймворк)\n# 2. GDPR / ФЗ-152 (регуляторные требования)\n# 3. PCI DSS (если есть платежи)\n# 4. SOC 2 (для B2B SaaS)\n# Многие контроли пересекаются — одно внедрение закрывает\n# требования нескольких стандартов' },
        { type: 'tip', value: 'Compliance не равно безопасности. Компания может пройти аудит SOC 2 и быть взломанной на следующий день. Compliance — минимальный порог. Настоящая безопасность — непрерывный процесс улучшения, выходящий за рамки чеклистов.' }
      ]
    },
    {
      id: 2,
      title: 'GDPR: защита персональных данных',
      type: 'theory',
      content: [
        { type: 'text', value: 'GDPR (General Data Protection Regulation) — регуляция ЕС по защите персональных данных. Применяется к любой компании, обрабатывающей данные граждан ЕС, независимо от местоположения компании. Штрафы: до 20 млн евро или 4% годового оборота.' },
        { type: 'heading', value: 'Ключевые принципы GDPR' },
        { type: 'list', value: [
          'Законность и прозрачность: правовое основание для обработки данных',
          'Ограничение цели: данные собираются для конкретных целей',
          'Минимизация данных: собирайте только необходимое',
          'Точность: данные должны быть актуальными',
          'Ограничение хранения: не хранить дольше необходимого',
          'Целостность и конфиденциальность: защита данных',
          'Подотчётность: контролёр может доказать соблюдение GDPR'
        ]},
        { type: 'heading', value: 'Права субъектов данных' },
        { type: 'list', value: [
          'Right to Access: пользователь может запросить копию своих данных',
          'Right to Rectification: исправление неточных данных',
          'Right to Erasure (Right to be Forgotten): удаление всех данных',
          'Right to Portability: получение данных в машиночитаемом формате',
          'Right to Object: отказ от обработки данных',
          'Right to Restrict Processing: ограничение обработки'
        ]},
        { type: 'code', language: 'python', value: '# === GDPR Compliance в коде ===\n\n# 1. Right to Access — экспорт данных пользователя\nclass GDPRService:\n    def __init__(self, db):\n        self.db = db\n    \n    def export_user_data(self, user_id: str) -> dict:\n        """Ст. 15 GDPR: Право на доступ к данным"""\n        return {\n            "personal_info": self.db.users.find_one(\n                {"_id": user_id},\n                # Исключаем внутренние поля\n                {"_id": 0, "password_hash": 0, "internal_notes": 0}\n            ),\n            "orders": list(self.db.orders.find({"user_id": user_id})),\n            "activity_log": list(self.db.activity.find({"user_id": user_id})),\n            "consents": list(self.db.consents.find({"user_id": user_id})),\n            "exported_at": datetime.utcnow().isoformat(),\n            "format": "JSON (machine-readable)"\n        }\n    \n    def delete_user_data(self, user_id: str) -> dict:\n        """Ст. 17 GDPR: Право на удаление (забвение)"""\n        results = {}\n        \n        # Удаление из всех коллекций\n        results["users"] = self.db.users.delete_one({"_id": user_id}).deleted_count\n        results["orders"] = self.db.orders.delete_many({"user_id": user_id}).deleted_count\n        results["activity"] = self.db.activity.delete_many({"user_id": user_id}).deleted_count\n        results["sessions"] = self.db.sessions.delete_many({"user_id": user_id}).deleted_count\n        \n        # Анонимизация данных, которые нельзя удалить (финансовая отчётность)\n        self.db.transactions.update_many(\n            {"user_id": user_id},\n            {"$set": {"user_id": "DELETED", "user_name": "ANONYMOUS"}}\n        )\n        results["transactions_anonymized"] = True\n        \n        # Удаление из бэкапов (в течение 30 дней)\n        self.schedule_backup_deletion(user_id, days=30)\n        \n        # Логирование факта удаления (без PII)\n        self.audit_log("gdpr.erasure", {\n            "anonymized_id": hashlib.sha256(user_id.encode()).hexdigest()[:8],\n            "collections_affected": list(results.keys())\n        })\n        \n        return results\n    \n    def record_consent(self, user_id: str, purpose: str, granted: bool):\n        """Ст. 7 GDPR: Управление согласиями"""\n        self.db.consents.insert_one({\n            "user_id": user_id,\n            "purpose": purpose,      # "marketing", "analytics", "third_party"\n            "granted": granted,\n            "timestamp": datetime.utcnow(),\n            "ip_address": get_client_ip(),\n            "method": "explicit_checkbox",  # Не pre-checked!\n            "version": "privacy_policy_v2.3"\n        })' },
        { type: 'warning', value: 'Data Breach Notification: при утечке персональных данных вы ОБЯЗАНЫ уведомить надзорный орган в течение 72 часов (ст. 33 GDPR). Если утечка угрожает правам пользователей — уведомить и пользователей (ст. 34). Имейте готовый план уведомления!' }
      ]
    },
    {
      id: 3,
      title: 'PCI DSS: безопасность платёжных данных',
      type: 'theory',
      content: [
        { type: 'text', value: 'PCI DSS (Payment Card Industry Data Security Standard) — обязательный стандарт для всех организаций, обрабатывающих, хранящих или передающих данные платёжных карт. 12 основных требований, разделённых на 6 целей. Несоблюдение — штрафы до $500K за инцидент и отзыв права приёма карт.' },
        { type: 'heading', value: '12 требований PCI DSS v4.0' },
        { type: 'list', value: [
          '1. Установить и поддерживать сетевые контроли безопасности (firewall)',
          '2. Применять безопасные конфигурации ко всем компонентам (hardening)',
          '3. Защитить хранимые данные аккаунтов (шифрование, маскирование)',
          '4. Защитить данные при передаче по открытым сетям (TLS)',
          '5. Защитить все системы от вредоносного ПО (антивирус)',
          '6. Разрабатывать и поддерживать безопасные системы (secure SDLC)',
          '7. Ограничить доступ к данным по принципу need-to-know',
          '8. Идентифицировать и аутентифицировать доступ к компонентам (MFA)',
          '9. Ограничить физический доступ к данным аккаунтов',
          '10. Логировать и мониторить доступ к сетевым ресурсам и данным',
          '11. Регулярно тестировать системы безопасности (пентест, сканирование)',
          '12. Поддерживать политику информационной безопасности'
        ]},
        { type: 'code', language: 'python', value: '# === PCI DSS: безопасная обработка карт ===\n\n# ПРАВИЛО №1: Минимизируйте Cardholder Data Environment (CDE)\n# Используйте Stripe/Braintree — карточные данные НЕ касаются вашего сервера\n\n# === Правильно: Stripe Tokenization ===\n# Клиент -> Stripe.js (номер карты) -> Stripe -> token\n# Клиент -> Ваш сервер (только token) -> Stripe API -> Оплата\n# Ваш сервер НИКОГДА не видит номер карты!\n\nimport stripe\nstripe.api_key = "sk_live_..."  # Серверный ключ (НИКОГДА в клиенте!)\n\ndef process_payment(payment_token: str, amount: int):\n    """PCI-compliant оплата через Stripe"""\n    try:\n        charge = stripe.PaymentIntent.create(\n            amount=amount,          # В копейках: 1000 = 10.00\n            currency="usd",\n            payment_method=payment_token,  # Токен от Stripe.js\n            confirm=True,\n            # Метаданные для аудита\n            metadata={\n                "order_id": "ORD-12345",\n                "source": "mobile_app"\n            }\n        )\n        return {"status": "success", "id": charge.id}\n    except stripe.error.CardError as e:\n        return {"status": "declined", "message": e.user_message}\n\n# === НЕПРАВИЛЬНО: хранение карт на своём сервере ===\n# НИКОГДА не делайте так:\n# db.save({\n#     "card_number": "4111111111111111",  # ЗАПРЕЩЕНО!\n#     "cvv": "123",                        # КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО!\n#     "expiry": "12/28"\n# })\n\n# === Маскирование и токенизация ===\ndef mask_card_number(card: str) -> str:\n    """PCI DSS Req 3.4: маскировать при отображении"""\n    # Показывать только первые 6 и последние 4 цифры\n    return f"{card[:6]}******{card[-4:]}"\n    # 411111******1111\n\n# Если НЕОБХОДИМО хранить (PAN):\n# - Шифрование AES-256 (Req 3.5)\n# - Ключи отдельно от данных (Req 3.6)\n# - Доступ ограничен (Req 7)\n# - Логирование доступа (Req 10)\n# Но лучше — НЕ хранить, использовать токенизацию!' },
        { type: 'code', language: 'bash', value: '# === PCI DSS: Уровни соответствия ===\n\n# Level 1: >6 млн транзакций/год\n#   - Ежегодный QSA аудит (Qualified Security Assessor)\n#   - Ежеквартальное ASV сканирование\n#   - Ежегодный пентест\n\n# Level 2: 1-6 млн транзакций/год\n#   - SAQ (Self-Assessment Questionnaire)\n#   - Ежеквартальное ASV сканирование\n\n# Level 3: 20K-1 млн e-commerce транзакций/год\n#   - SAQ\n#   - Ежеквартальное ASV сканирование\n\n# Level 4: <20K e-commerce или <1 млн других\n#   - SAQ (рекомендуется)\n#   - ASV (рекомендуется)\n\n# SAQ типы (зависит от архитектуры):\n# SAQ A: полная передача обработки третьей стороне (Stripe checkout)\n#        Самый простой — ~20 вопросов\n# SAQ A-EP: e-commerce с redirect на платёжный шлюз\n# SAQ D: полная обработка карт на своём сервере\n#         Самый сложный — 300+ вопросов\n\n# РЕКОМЕНДАЦИЯ: используйте SAQ A (Stripe/Braintree hosted)\n# Это сокращает scope PCI DSS до минимума!' },
        { type: 'tip', value: 'Лучшая стратегия PCI DSS — минимизировать scope. Используйте hosted payment pages (Stripe Checkout, PayPal), чтобы карточные данные никогда не касались ваших серверов. Это снижает уровень с SAQ D (300+ контролей) до SAQ A (~20 контролей).' }
      ]
    },
    {
      id: 4,
      title: 'SOC 2 и ISO 27001',
      type: 'theory',
      content: [
        { type: 'text', value: 'SOC 2 — стандарт доверия для SaaS-провайдеров, основан на Trust Services Criteria (Security, Availability, Confidentiality, Processing Integrity, Privacy). ISO 27001 — международный стандарт системы управления информационной безопасностью (ISMS). Оба часто требуются enterprise-клиентами.' },
        { type: 'heading', value: 'SOC 2: Trust Services Criteria' },
        { type: 'list', value: [
          'Security (обязательный): защита от несанкционированного доступа (firewalls, MFA, encryption)',
          'Availability: система доступна согласно SLA (мониторинг, DR plan)',
          'Confidentiality: защита конфиденциальных данных (encryption at rest/transit)',
          'Processing Integrity: данные обрабатываются корректно и полно',
          'Privacy: персональные данные обрабатываются по политике конфиденциальности'
        ]},
        { type: 'heading', value: 'SOC 2 Type I vs Type II' },
        { type: 'list', value: [
          'Type I: дизайн контролей на конкретную дату (снимок) — быстрее получить',
          'Type II: операционная эффективность за период 6-12 месяцев — более ценный',
          'Путь: Type I (3-6 месяцев) -> Type II (6-12 месяцев наблюдения)'
        ]},
        { type: 'code', language: 'yaml', value: '# === SOC 2: Типичные контроли (CC — Common Criteria) ===\n\n# CC6.1: Логический и физический доступ\ncontrols:\n  access_management:\n    - name: "MFA обязателен для всех сотрудников"\n      evidence: "IdP configuration screenshot (Okta/Google Workspace)"\n      frequency: "Continuous"\n    \n    - name: "Принцип наименьших привилегий"\n      evidence: "IAM policy review, access audit report"\n      frequency: "Quarterly"\n    \n    - name: "Offboarding: отзыв доступа в день увольнения"\n      evidence: "HR process document, access removal tickets"\n      frequency: "Per event"\n\n# CC6.6: Безопасность сетевых границ  \n  network_security:\n    - name: "WAF для всех публичных endpoints"\n      evidence: "WAF configuration, rule set"\n      frequency: "Continuous"\n    \n    - name: "Encryption in transit (TLS 1.2+)"\n      evidence: "SSL Labs scan report (A+ rating)"\n      frequency: "Quarterly"\n\n# CC7.2: Мониторинг и обнаружение\n  monitoring:\n    - name: "Централизованное логирование"\n      evidence: "SIEM dashboard, log retention policy"\n      frequency: "Continuous"\n    \n    - name: "Alerts на подозрительную активность"\n      evidence: "Alert rules, incident tickets"\n      frequency: "Continuous"\n\n# CC8.1: Управление изменениями\n  change_management:\n    - name: "Code review обязателен перед merge"\n      evidence: "Branch protection rules, PR history"\n      frequency: "Per change"\n    \n    - name: "Автоматическое тестирование в CI/CD"\n      evidence: "CI pipeline configuration, test reports"\n      frequency: "Per deployment"' },
        { type: 'code', language: 'bash', value: '# === ISO 27001: Структура ISMS ===\n\n# ISO 27001 — цикл PDCA:\n# Plan: Определить scope, риски, цели, контроли\n# Do: Внедрить контроли и политики\n# Check: Мониторинг, внутренние аудиты, KPI\n# Act: Корректирующие действия, улучшения\n\n# Annex A: 93 контроля в 4 темах (ISO 27001:2022)\n\n# A.5 Organizational (37 контролей)\n#   5.1 Information security policies\n#   5.2 Information security roles\n#   5.15 Access control\n#   5.23 Information security for cloud services\n\n# A.6 People (8 контролей)\n#   6.1 Screening (background checks)\n#   6.3 Information security awareness training\n#   6.5 Responsibilities after termination\n\n# A.7 Physical (14 контролей)\n#   7.1 Physical security perimeter\n#   7.4 Physical security monitoring\n\n# A.8 Technological (34 контроля)\n#   8.5 Secure authentication\n#   8.9 Configuration management\n#   8.12 Data leakage prevention\n#   8.24 Use of cryptography\n#   8.28 Secure coding\n\n# Документация ISO 27001:\n# - Information Security Policy (политика ИБ)\n# - Risk Assessment Report (оценка рисков)\n# - Statement of Applicability (SoA)\n# - Risk Treatment Plan\n# - Internal Audit Reports\n# - Management Review Minutes\n# - Corrective Action Records' },
        { type: 'tip', value: 'Используйте автоматизированные платформы compliance: Vanta, Drata, Secureframe. Они автоматически собирают evidence (скриншоты конфигураций, логи), отслеживают контроли и готовят к аудиту. Это сокращает подготовку к SOC 2 с 12 месяцев до 3-4.' }
      ]
    },
    {
      id: 5,
      title: 'Построение программы compliance',
      type: 'theory',
      content: [
        { type: 'text', value: 'Программа compliance — непрерывный процесс: оценка рисков, внедрение контролей, мониторинг, аудит, улучшение. Ключевой фактор успеха — автоматизация сбора evidence и мониторинга контролей.' },
        { type: 'heading', value: 'Этапы построения программы' },
        { type: 'list', value: [
          '1. Gap Analysis: текущее состояние vs требования стандарта',
          '2. Risk Assessment: идентификация активов, угроз, уязвимостей',
          '3. Политики и процедуры: документация всех процессов',
          '4. Внедрение контролей: технические и организационные меры',
          '5. Обучение сотрудников: security awareness training',
          '6. Мониторинг и evidence collection: непрерывный сбор доказательств',
          '7. Внутренний аудит: проверка эффективности контролей',
          '8. Внешний аудит: сертификация (ISO 27001) или отчёт (SOC 2)'
        ]},
        { type: 'code', language: 'python', value: '# === Автоматизация Compliance Checks ===\nimport json\nfrom datetime import datetime, timezone\n\nclass ComplianceChecker:\n    """Автоматическая проверка контролей безопасности"""\n    \n    def __init__(self):\n        self.results = []\n    \n    def check(self, control_id: str, description: str,\n              check_fn, framework: str = "SOC2"):\n        """Выполнить проверку контроля"""\n        try:\n            passed, evidence = check_fn()\n            self.results.append({\n                "control": control_id,\n                "description": description,\n                "framework": framework,\n                "status": "PASS" if passed else "FAIL",\n                "evidence": evidence,\n                "checked_at": datetime.now(timezone.utc).isoformat()\n            })\n        except Exception as e:\n            self.results.append({\n                "control": control_id,\n                "status": "ERROR",\n                "error": str(e)\n            })\n    \n    def report(self):\n        total = len(self.results)\n        passed = sum(1 for r in self.results if r["status"] == "PASS")\n        failed = sum(1 for r in self.results if r["status"] == "FAIL")\n        \n        print(f"\\n=== Compliance Report ===")\n        print(f"Date: {datetime.now(timezone.utc).isoformat()}")\n        print(f"Total: {total} | Pass: {passed} | Fail: {failed}")\n        print(f"Score: {passed/total*100:.1f}%\\n")\n        \n        for r in self.results:\n            icon = "PASS" if r["status"] == "PASS" else "FAIL"\n            print(f"[{icon}] {r[\'control\']}: {r[\'description\']}")\n            if r["status"] == "FAIL":\n                print(f"       Evidence: {r.get(\'evidence\', \'N/A\')}")\n\n# === Примеры проверок ===\ndef check_mfa_enabled():\n    """CC6.1: MFA для всех пользователей"""\n    # В реальности — API call к IdP (Okta, Google Workspace)\n    users_without_mfa = []  # API: get users where mfa=false\n    passed = len(users_without_mfa) == 0\n    evidence = f"Users without MFA: {len(users_without_mfa)}"\n    return passed, evidence\n\ndef check_encryption_at_rest():\n    """CC6.7: Шифрование данных"""\n    # Проверка AWS RDS encryption\n    # rds.describe_db_instances() -> StorageEncrypted\n    encrypted = True  # API check\n    evidence = "All RDS instances: StorageEncrypted=true"\n    return encrypted, evidence\n\ndef check_tls_version():\n    """CC6.6: Encryption in transit"""\n    import ssl\n    import socket\n    hostname = "api.example.com"\n    ctx = ssl.create_default_context()\n    with ctx.wrap_socket(socket.socket(), server_hostname=hostname) as s:\n        s.connect((hostname, 443))\n        version = s.version()\n    passed = version in ("TLSv1.2", "TLSv1.3")\n    return passed, f"TLS version: {version}"\n\ndef check_branch_protection():\n    """CC8.1: Code review required"""\n    # GitHub API: check branch protection rules\n    # GET /repos/{owner}/{repo}/branches/main/protection\n    protection = {"required_reviews": 1, "dismiss_stale": True}\n    passed = protection["required_reviews"] >= 1\n    evidence = json.dumps(protection)\n    return passed, evidence\n\n# Запуск\nchecker = ComplianceChecker()\nchecker.check("CC6.1", "MFA для всех пользователей", check_mfa_enabled)\nchecker.check("CC6.6", "TLS 1.2+ для всех endpoints", check_tls_version)\nchecker.check("CC6.7", "Шифрование данных at rest", check_encryption_at_rest)\nchecker.check("CC8.1", "Code review обязателен", check_branch_protection)\nchecker.report()' },
        { type: 'code', language: 'yaml', value: '# === CI/CD: Compliance Gates ===\n# .github/workflows/compliance.yml\n\nname: Security & Compliance Checks\non:\n  pull_request:\n    branches: [main]\n  schedule:\n    - cron: "0 6 * * 1"  # Каждый понедельник в 6:00\n\njobs:\n  security-scan:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      \n      # SAST: статический анализ\n      - name: Semgrep SAST\n        uses: returntocorp/semgrep-action@v1\n        with:\n          config: >-\n            p/owasp-top-ten\n            p/javascript\n            p/python\n      \n      # Сканирование зависимостей\n      - name: Dependency Check (SCA)\n        uses: dependency-check/Dependency-Check_Action@main\n        with:\n          project: "myapp"\n          path: "."\n          format: "JSON"\n      \n      # Сканирование секретов\n      - name: Secret Scanning\n        uses: trufflesecurity/trufflehog@main\n        with:\n          path: "./"\n          extra_args: --only-verified\n      \n      # Проверка лицензий\n      - name: License Check\n        run: |\n          npx license-checker --production --failOn \"GPL-3.0;AGPL-3.0\"\n      \n      # Docker image scan\n      - name: Trivy Container Scan\n        uses: aquasecurity/trivy-action@master\n        with:\n          image-ref: "myapp:${{ github.sha }}"\n          severity: "CRITICAL,HIGH"\n          exit-code: "1"  # Fail pipeline on HIGH/CRITICAL' },
        { type: 'warning', value: 'Compliance — это не разовое мероприятие, а непрерывный процесс. SOC 2 Type II требует доказательства работы контролей за 6-12 месяцев. Если контроль "выключен" хотя бы на день — это найдут при аудите. Автоматизируйте мониторинг контролей.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Compliance Assessment',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте автоматизированный инструмент оценки compliance для веб-приложения: GDPR checklist, PCI DSS контроли, SOC 2 checks и генерация отчёта.',
      requirements: [
        'Реализуйте GDPR Data Subject Rights API (export, delete, consent management)',
        'Создайте автоматический PCI DSS checklist с проверкой TLS, encryption, access control',
        'Реализуйте SOC 2 compliance checker с автоматическим сбором evidence',
        'Создайте unified compliance report с результатами по всем фреймворкам',
        'Настройте CI/CD pipeline с security и compliance gates'
      ],
      hint: 'Для GDPR: создайте класс GDPRService с методами export_data, delete_data, record_consent. Для PCI DSS: проверяйте TLS (ssl module), encryption status. Для SOC 2: автоматические проверки контролей с evidence collection.',
      expectedOutput: 'GDPR Service: export_data returns user data in JSON format\nGDPR Service: delete_data removes from 5 collections, anonymizes transactions\nGDPR Service: consent recorded with timestamp and purpose\n\nPCI DSS Check: TLS 1.3 enabled — PASS\nPCI DSS Check: Card data not stored — PASS\nPCI DSS Check: Access logging enabled — PASS\n\nSOC 2 Report:\n[PASS] CC6.1: MFA для всех пользователей\n[PASS] CC6.6: TLS 1.2+ для всех endpoints\n[PASS] CC6.7: Шифрование данных at rest\n[PASS] CC8.1: Code review обязателен\nScore: 100% (4/4 controls passed)\n\nCI/CD: SAST, SCA, secret scanning, container scan — configured',
      solution: '#!/usr/bin/env python3\n"""Compliance Assessment Tool"""\nimport hashlib\nimport json\nfrom datetime import datetime, timezone\n\n# === 1. GDPR Service ===\nclass GDPRService:\n    def __init__(self):\n        # Имитация БД\n        self.users = {"u1": {"name": "Ivan", "email": "ivan@test.com"}}\n        self.orders = {"u1": [{"id": "o1", "total": 100}]}\n        self.consents = []\n        self.deletion_log = []\n    \n    def export_data(self, user_id):\n        """Art. 15: Right to Access"""\n        return {\n            "personal": self.users.get(user_id, {}),\n            "orders": self.orders.get(user_id, []),\n            "consents": [c for c in self.consents if c["user_id"] == user_id],\n            "exported_at": datetime.now(timezone.utc).isoformat()\n        }\n    \n    def delete_data(self, user_id):\n        """Art. 17: Right to Erasure"""\n        results = {}\n        if user_id in self.users:\n            del self.users[user_id]\n            results["users"] = "deleted"\n        if user_id in self.orders:\n            del self.orders[user_id]\n            results["orders"] = "deleted"\n        anon_id = hashlib.sha256(user_id.encode()).hexdigest()[:8]\n        self.deletion_log.append({"anon_id": anon_id, "ts": datetime.now(timezone.utc).isoformat()})\n        results["audit"] = "logged"\n        return results\n    \n    def record_consent(self, user_id, purpose, granted):\n        """Art. 7: Consent Management"""\n        self.consents.append({\n            "user_id": user_id,\n            "purpose": purpose,\n            "granted": granted,\n            "timestamp": datetime.now(timezone.utc).isoformat()\n        })\n        return True\n\n# === 2. Compliance Checker ===\nclass ComplianceChecker:\n    def __init__(self):\n        self.results = []\n    \n    def check(self, framework, control_id, description, passed, evidence):\n        self.results.append({\n            "framework": framework,\n            "control": control_id,\n            "description": description,\n            "status": "PASS" if passed else "FAIL",\n            "evidence": evidence,\n            "checked_at": datetime.now(timezone.utc).isoformat()\n        })\n    \n    def report(self):\n        total = len(self.results)\n        passed = sum(1 for r in self.results if r["status"] == "PASS")\n        print(f"\\n=== Compliance Report ===")\n        print(f"Score: {passed}/{total} ({passed/total*100:.0f}%)\\n")\n        for r in self.results:\n            status = "PASS" if r["status"] == "PASS" else "FAIL"\n            print(f"[{status}] {r[\'framework\']} {r[\'control\']}: {r[\'description\']}")\n        return passed == total\n\n# === Run Assessment ===\nprint("=== GDPR Assessment ===")\ngdpr = GDPRService()\ngdpr.record_consent("u1", "marketing", True)\nprint(f"Export: {json.dumps(gdpr.export_data(\'u1\'), indent=2)}")\nprint(f"Delete: {gdpr.delete_data(\'u1\')}")\nprint(f"Post-delete export: {gdpr.export_data(\'u1\')}")\n\nchecker = ComplianceChecker()\n# PCI DSS checks\nchecker.check("PCI-DSS", "Req-4", "TLS 1.2+ enforced", True, "TLSv1.3")\nchecker.check("PCI-DSS", "Req-3", "No card data stored", True, "Stripe tokenization")\nchecker.check("PCI-DSS", "Req-10", "Access logging enabled", True, "ELK Stack active")\n# SOC 2 checks\nchecker.check("SOC2", "CC6.1", "MFA для всех пользователей", True, "Okta: 100% MFA")\nchecker.check("SOC2", "CC6.6", "TLS 1.2+ для endpoints", True, "SSL Labs: A+")\nchecker.check("SOC2", "CC6.7", "Encryption at rest", True, "AWS RDS: encrypted")\nchecker.check("SOC2", "CC8.1", "Code review required", True, "GitHub: branch protection")\nchecker.report()',
      explanation: 'Compliance assessment включает: GDPR проверки (права субъектов данных, управление согласиями), PCI DSS контроли (шифрование, логирование, доступ), SOC 2 контроли (security, availability). Автоматизация через CI/CD и compliance checkers обеспечивает непрерывное соответствие, а не разовую проверку перед аудитом.'
    }
  ]
}
