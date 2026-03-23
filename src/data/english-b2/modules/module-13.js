export default {
  id: 13,
  title: 'IT: Security и Compliance',
  description: 'Терминология информационной безопасности: vulnerability, exploit, penetration testing, CORS, CSRF, XSS',
  lessons: [
    {
      id: 1,
      title: 'Основы безопасности: vulnerability, threat, exploit',
      type: 'theory',
      content: [
        { type: 'text', value: 'Безопасность — тема, которую обсуждают на всех уровнях: от code review до архитектурных решений. Знание терминологии критически важно.' },
        { type: 'heading', value: 'Ключевые термины' },
        { type: 'text', value: '"Vulnerability: a weakness in a system that can be exploited."\n"Threat: a potential danger that could exploit a vulnerability."\n"Exploit: code or technique that takes advantage of a vulnerability."\n"Attack vector: the method used to exploit a vulnerability."\n"Attack surface: the total number of points where an attacker can try to enter."' },
        { type: 'heading', value: 'Типы уязвимостей' },
        { type: 'text', value: '"Zero-day vulnerability: a flaw unknown to the vendor, with no available patch."\n"CVE (Common Vulnerabilities and Exposures): a standardised identifier for publicly known vulnerabilities."\n"CVSS score: a numerical rating of vulnerability severity from 0 to 10."\n"The vulnerability was rated critical with a CVSS score of 9.8."' },
        { type: 'heading', value: 'В контексте code review' },
        { type: 'text', value: '"This input is not sanitised and could be vulnerable to injection attacks."\n"The error messages reveal too much about the internal system, increasing the attack surface."\n"Hardcoded credentials in the source code represent a critical security vulnerability."' },
        { type: 'tip', value: '"Responsible disclosure": если найдена уязвимость в чужом продукте, правильно сообщить вендору до публичного раскрытия. "We practice responsible disclosure — we found this CVE and reported it to the vendor before publishing our research."' }
      ]
    },
    {
      id: 2,
      title: 'Web Security: CORS, CSRF, XSS, SQLi',
      type: 'theory',
      content: [
        { type: 'text', value: 'Веб-уязвимости из OWASP Top 10 — обязательный словарный запас для backend и frontend разработчиков.' },
        { type: 'heading', value: 'CORS — Cross-Origin Resource Sharing' },
        { type: 'text', value: '"CORS is a browser mechanism that controls how resources are shared between different origins."\n"An origin is defined by protocol, domain, and port."\n"Without proper CORS headers, browsers block cross-origin requests."\n"Misconfigured CORS with wildcard (*) allows any origin to make credentialed requests — a security risk."' },
        { type: 'heading', value: 'CSRF — Cross-Site Request Forgery' },
        { type: 'text', value: '"CSRF tricks authenticated users into making unintended requests to a web application."\n"A CSRF token is a random value included in requests to verify they originate from the legitimate site."\n"SameSite cookie attribute provides built-in CSRF protection in modern browsers."' },
        { type: 'heading', value: 'XSS — Cross-Site Scripting' },
        { type: 'text', value: '"XSS allows attackers to inject malicious scripts into web pages viewed by other users."\n"Stored XSS: the malicious script is saved to the database and served to all users."\n"Reflected XSS: the script is embedded in a URL and executed when the victim clicks the link."\n"Prevention: sanitise and encode all user-supplied output, use Content Security Policy (CSP)."' },
        { type: 'heading', value: 'SQL Injection' },
        { type: 'text', value: '"SQL injection allows attackers to manipulate database queries by injecting SQL code."\n"Prevention: use parameterised queries or prepared statements — never concatenate user input into SQL."' }
      ]
    },
    {
      id: 3,
      title: 'Authentication и Authorization',
      type: 'theory',
      content: [
        { type: 'text', value: 'Аутентификация и авторизация — разные концепции, которые часто путают даже опытные разработчики.' },
        { type: 'heading', value: 'Authentication — кто ты?' },
        { type: 'text', value: '"Authentication verifies the identity of a user or service."\n"Multi-factor authentication (MFA): requires two or more verification factors."\n"Factors: something you know (password), something you have (OTP device), something you are (biometrics)."\n"OAuth 2.0 is an authorisation framework — but it\'s often used as the foundation for authentication via OIDC."' },
        { type: 'heading', value: 'Authorization — что тебе разрешено?' },
        { type: 'text', value: '"Authorization determines what an authenticated user is allowed to do."\n"RBAC (Role-Based Access Control): permissions are assigned to roles, not individuals."\n"ABAC (Attribute-Based Access Control): permissions are based on attributes (user department, resource type, etc.)."\n"The principle of least privilege: grant only the minimum permissions required."' },
        { type: 'heading', value: 'JWT и sessions' },
        { type: 'text', value: '"JWT (JSON Web Token) is a compact, URL-safe token containing claims about the user."\n"A JWT has three parts: header, payload, and signature."\n"Never store sensitive data in JWT claims — they are base64-encoded, not encrypted."\n"Refresh tokens allow obtaining new access tokens without re-authentication."' },
        { type: 'tip', value: 'Классический вопрос интервью: "What is the difference between authentication and authorisation?" Убедитесь, что можете объяснить это чётко и с примерами.' }
      ]
    },
    {
      id: 4,
      title: 'Encryption и cryptography',
      type: 'theory',
      content: [
        { type: 'text', value: 'Криптография — базовая область знаний для разработчиков, работающих с чувствительными данными.' },
        { type: 'heading', value: 'Symmetric vs Asymmetric encryption' },
        { type: 'text', value: '"Symmetric encryption uses the same key for encryption and decryption (e.g., AES-256)."\n"Asymmetric encryption uses a key pair: a public key for encryption and a private key for decryption (e.g., RSA, ECDSA)."\n"TLS uses asymmetric cryptography for key exchange, then switches to symmetric for bulk data transfer."' },
        { type: 'heading', value: 'Hashing' },
        { type: 'text', value: '"A hash function produces a fixed-size output from any input — it is one-way (cannot be reversed)."\n"Passwords should be hashed with a slow algorithm like bcrypt, not SHA-256 (too fast, vulnerable to brute force)."\n"Salt: a random value added to the password before hashing to prevent rainbow table attacks."' },
        { type: 'heading', value: 'Encryption at rest and in transit' },
        { type: 'text', value: '"Encryption at rest: data is encrypted when stored (e.g., encrypted EBS volumes, S3 SSE)."\n"Encryption in transit: data is encrypted as it moves between systems (TLS/HTTPS)."\n"End-to-end encryption: only the communicating parties can decrypt the data, not the service provider."' }
      ]
    },
    {
      id: 5,
      title: 'Penetration Testing и Security Audits',
      type: 'theory',
      content: [
        { type: 'text', value: 'Проверка безопасности — часть зрелого SDLC. Знание терминологии важно для общения с командой безопасности.' },
        { type: 'heading', value: 'Penetration Testing' },
        { type: 'text', value: '"Penetration testing (pen testing) is a simulated cyberattack to identify exploitable vulnerabilities."\n"Black box testing: tester has no prior knowledge of the target system."\n"White box testing: tester has full access to source code and architecture documentation."\n"Grey box testing: tester has partial knowledge."' },
        { type: 'heading', value: 'Vulnerability Assessment vs Pen Testing' },
        { type: 'text', value: '"A vulnerability assessment identifies and lists vulnerabilities but does not exploit them."\n"Penetration testing goes further: it actively exploits vulnerabilities to determine the true impact."\n"The pen test report includes: scope, findings, severity ratings, and remediation recommendations."' },
        { type: 'heading', value: 'Compliance frameworks' },
        { type: 'text', value: '"SOC 2: audit framework for service organisations, covering security, availability, and confidentiality."\n"PCI DSS: standard for organisations handling credit card data."\n"GDPR: EU regulation for personal data protection."\n"ISO 27001: international standard for information security management systems."' },
        { type: 'note', value: 'Полезные фразы для security discussions:\n"Our threat model identifies X as the primary attack vector."\n"We have implemented defence in depth."\n"The finding was remediated in the next release cycle."' }
      ]
    },
    {
      id: 6,
      title: 'Security в DevOps: DevSecOps',
      type: 'theory',
      content: [
        { type: 'text', value: 'Современный подход — "shift security left", то есть встроить безопасность в каждый этап разработки.' },
        { type: 'heading', value: 'DevSecOps principles' },
        { type: 'text', value: '"Shift left: integrating security practices early in the development lifecycle, not just before release."\n"SAST (Static Application Security Testing): analysing source code for vulnerabilities without executing it."\n"DAST (Dynamic Application Security Testing): testing the running application for vulnerabilities."\n"SCA (Software Composition Analysis): scanning dependencies for known vulnerabilities."' },
        { type: 'heading', value: 'Security in CI/CD' },
        { type: 'text', value: '"We run SAST tools (e.g., Semgrep, SonarQube) on every pull request."\n"Dependency scanning alerts us to CVEs in third-party packages."\n"Secrets scanning prevents credentials from being committed to the repository."\n"Container image scanning checks for OS and package vulnerabilities before deployment."' },
        { type: 'tip', value: 'Популярная фраза: "Security is everyone\'s responsibility." В DevSecOps командах security reviews — часть каждого PR, а не отдельный этап перед релизом.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: security review',
      type: 'practice',
      difficulty: 'hard',
      description: 'Напишите security review для описанного сценария, используя правильную терминологию.',
      requirements: [
        'Определите уязвимости',
        'Назовите тип каждой уязвимости',
        'Предложите remediation для каждой'
      ],
      questions: [
        { text: 'Code snippet:\nconst query = "SELECT * FROM users WHERE email = \'" + userInput + "\';";\nconst result = db.execute(query);\n\nWhat security issues do you see?', answer: 'VULNERABILITY: SQL Injection\nSEVERITY: Critical (CVSS 9.0+)\nDESCRIPTION: The user input is directly concatenated into the SQL query without sanitisation. An attacker could inject SQL code to dump the entire database, modify data, or bypass authentication (e.g., input: \' OR \'1\'=\'1).\nREMEDIATION: Use parameterised queries or prepared statements:\nconst query = "SELECT * FROM users WHERE email = $1";\nconst result = db.execute(query, [userInput]);\nThis ensures user input is always treated as data, never as SQL code.', explanation: 'SQL injection остаётся в OWASP Top 10 уже многие годы. Parameterised queries — единственная надёжная защита. Никогда не конкатенируйте пользовательский ввод в SQL.' }
      ],
      solution: 'Правильные ответы:\n1. VULNERABILITY: SQL Injection',
      hint: 'Структура security finding: 1) Тип уязвимости, 2) Severity rating, 3) Описание и потенциальный impact, 4) Шаги по воспроизведению, 5) Remediation.',
      explanation: 'Security reviews — важная часть работы senior-разработчика. Умение идентифицировать уязвимости и формулировать remediation на английском необходимо для работы в международных командах и прохождения security audits.'
    }
  ]
}
