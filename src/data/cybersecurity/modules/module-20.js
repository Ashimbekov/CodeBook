export default {
  id: 20,
  title: 'Социальная инженерия',
  description: 'Фишинг, pretexting, awareness training — психологические атаки и методы защиты от них.',
  lessons: [
    {
      id: 1,
      title: 'Что такое социальная инженерия',
      type: 'theory',
      content: [
        { type: 'text', value: 'Социальная инженерия — манипулирование людьми для получения конфиденциальной информации или выполнения действий. Атакующий эксплуатирует психологию, а не технологии: доверие, страх, любопытство, жадность, срочность.' },
        { type: 'heading', value: 'Типы социальной инженерии' },
        { type: 'list', value: [
          'Phishing — массовые фишинговые письма (email, SMS)',
          'Spear Phishing — целенаправленный фишинг конкретного человека',
          'Whaling — фишинг руководителей (CEO fraud)',
          'Vishing — голосовой фишинг (телефонные звонки)',
          'Smishing — фишинг через SMS',
          'Pretexting — создание ложного предлога для получения информации',
          'Baiting — подбрасывание заражённых USB/файлов',
          'Tailgating — физическое проникновение за авторизованным сотрудником'
        ]},
        { type: 'code', language: 'bash', value: '# === Статистика фишинга ===\n# 91% кибератак начинается с фишингового письма\n# Средний ущерб от BEC (Business Email Compromise): $150,000\n# 30% фишинговых писем открываются сотрудниками\n# 12% кликают на вредоносные ссылки\n\n# === Психологические принципы ===\n# 1. Authority (авторитет): "Это запрос от CEO"\n# 2. Urgency (срочность): "Действуйте немедленно!"\n# 3. Fear (страх): "Ваш аккаунт будет заблокирован"\n# 4. Curiosity (любопытство): "Посмотрите эти фото"\n# 5. Reciprocity (взаимность): "Мы дарим вам подарок"\n# 6. Social Proof (социальное доказательство): "Все коллеги уже обновили"' },
        { type: 'warning', value: 'Социальная инженерия — самая эффективная атака. Даже при идеальной технической защите один сотрудник может скомпрометировать всю компанию, открыв фишинговое письмо. Обучение персонала — ключевая защита.' }
      ]
    },
    {
      id: 2,
      title: 'Фишинг: техники и распознавание',
      type: 'theory',
      content: [
        { type: 'text', value: 'Фишинговые письма имитируют легитимные сообщения от банков, сервисов, коллег. Цель: получить учётные данные, установить malware, инициировать денежный перевод. Ключ к защите — умение распознавать признаки фишинга.' },
        { type: 'heading', value: 'Признаки фишинга' },
        { type: 'list', value: [
          'Срочность: "Немедленно подтвердите", "Осталось 2 часа"',
          'Ошибки: грамматические ошибки, странный стиль',
          'Домен: microsoftt.com, goog1e.com, amaz0n.com',
          'Ссылки: наведите курсор — реальный URL отличается от текста',
          'Вложения: .exe, .js, .docm (макросы), .zip с паролем',
          'Запрос данных: пароль, номер карты, SSN по email',
          'Generic обращение: "Уважаемый клиент" вместо имени'
        ]},
        { type: 'code', language: 'bash', value: '# === Анализ подозрительного email ===\n\n# 1. Проверяем заголовки (headers)\n# From: support@paypa1.com  # Цифра 1 вместо l!\n# Reply-To: attacker@evil.com  # Ответ идёт на другой адрес!\n# Received: from mail.suspicious-server.ru  # Отправлен не с PayPal\n\n# 2. SPF, DKIM, DMARC проверка\n# Если email не прошёл SPF/DKIM — скорее всего подделка\n# Authentication-Results: spf=fail dkim=fail dmarc=fail\n\n# 3. Анализ ссылки\n# Текст ссылки: https://paypal.com/verify\n# Реальный URL:  https://paypa1-verify.evil.com/steal\n\n# 4. Проверка домена\nwhois paypa1-verify.evil.com\n# Creation Date: 2026-04-04  # Создан вчера!\n\n# 5. VirusTotal: проверка URL\n# https://www.virustotal.com/gui/url/\n# Загрузите подозрительную ссылку для проверки\n\n# === Email Security Headers ===\n# SPF: определяет какие серверы могут отправлять email от домена\n# v=spf1 include:_spf.google.com ~all\n\n# DKIM: цифровая подпись email\n# DKIM-Signature: v=1; a=rsa-sha256; d=example.com\n\n# DMARC: политика обработки писем не прошедших SPF/DKIM\n# v=DMARC1; p=reject; rua=mailto:dmarc@example.com' },
        { type: 'tip', value: 'Настройте SPF, DKIM и DMARC для вашего домена — это защитит от email spoofing. DMARC p=reject отклоняет письма не прошедшие проверку. Это не защищает от фишинга с других доменов, но защищает ваш бренд от подделки.' }
      ]
    },
    {
      id: 3,
      title: 'Техническая защита от фишинга',
      type: 'theory',
      content: [
        { type: 'text', value: 'Многоуровневая техническая защита от фишинга: email filtering, URL scanning, DMARC, sandbox для вложений, browser isolation, security awareness training.' },
        { type: 'code', language: 'bash', value: '# === DNS записи для защиты email ===\n\n# SPF (Sender Policy Framework)\n# Какие серверы могут отправлять email от имени вашего домена\n# TXT запись в DNS:\nexample.com. IN TXT "v=spf1 include:_spf.google.com include:sendgrid.net -all"\n# -all: жёстко отклонять не прошедших проверку\n# ~all: мягко (помечать как spam)\n\n# DKIM (DomainKeys Identified Mail)\n# Цифровая подпись каждого письма\n# Настраивается через email провайдера (Google Workspace, O365)\n# Публичный ключ в DNS:\n# google._domainkey.example.com IN TXT "v=DKIM1; k=rsa; p=MIIBIj..."\n\n# DMARC (Domain-based Message Authentication)\n# Политика обработки не прошедших SPF/DKIM\n_dmarc.example.com. IN TXT "v=DMARC1; p=reject; rua=mailto:dmarc-reports@example.com; ruf=mailto:dmarc-forensic@example.com; pct=100"\n\n# p=reject: отклонять поддельные письма\n# rua: куда отправлять агрегированные отчёты\n# ruf: куда отправлять forensic отчёты\n# pct=100: применять ко всем письмам' },
        { type: 'heading', value: 'Дополнительные меры защиты' },
        { type: 'list', value: [
          'Email Gateway: фильтрация фишинга на уровне почтового шлюза',
          'URL Rewriting: проверка ссылок при клике (Microsoft Defender, Proofpoint)',
          'Sandbox: запуск вложений в изолированной среде',
          'MFA: даже если пароль украден, второй фактор защищает',
          'FIDO2/Passkeys: полностью фишинг-устойчивы (привязаны к домену)',
          'Zero Trust: не доверять даже внутренним email без верификации'
        ]},
        { type: 'tip', value: 'FIDO2/Passkeys — единственный метод аутентификации, полностью устойчивый к фишингу. Ключ привязан к конкретному домену и не может быть использован на фишинговом сайте.' }
      ]
    },
    {
      id: 4,
      title: 'Security Awareness Training',
      type: 'theory',
      content: [
        { type: 'text', value: 'Обучение сотрудников — ключевой элемент защиты от социальной инженерии. Включает: регулярные тренинги, фишинг-симуляции, clear reporting process, культура безопасности.' },
        { type: 'heading', value: 'Программа Security Awareness' },
        { type: 'list', value: [
          'Onboarding: обязательный security тренинг для новых сотрудников',
          'Quarterly Training: ежеквартальные обновления (новые угрозы)',
          'Phishing Simulations: регулярные тестовые фишинговые рассылки',
          'Reporting: простой механизм сообщения о подозрительных письмах (кнопка в email клиенте)',
          'Incident Drills: учебные инциденты (что делать если кликнули)',
          'Metrics: процент кликов на фишинг, время обнаружения, количество репортов'
        ]},
        { type: 'code', language: 'python', value: '# === Фишинг-симуляция (GoPhish) ===\n# GoPhish — open-source платформа для фишинг-тестирования\n\n# Установка\n# docker run -d -p 3333:3333 -p 8080:80 gophish/gophish\n\n# Настройка через API:\nimport requests\n\nGOPHISH_URL = "https://localhost:3333"\nAPI_KEY = "your-api-key"\nheaders = {"Authorization": f"Bearer {API_KEY}"}\n\n# 1. Создание email шаблона\ntemplate = {\n    "name": "IT Department Password Reset",\n    "subject": "Требуется обновление пароля",\n    "html": """\n    <p>Уважаемый сотрудник,</p>\n    <p>В связи с обновлением политики безопасности, \n    просим обновить ваш пароль в течение 24 часов.</p>\n    <p><a href=\"{{.URL}}\">Обновить пароль</a></p>\n    <p>IT отдел</p>\n    \"\"\"\n}\nrequests.post(f"{GOPHISH_URL}/api/templates/",\n    json=template, headers=headers, verify=False)\n\n# 2. Анализ результатов\n# - Процент открывших email\n# - Процент кликнувших на ссылку  \n# - Процент введших credentials\n# - Процент сообщивших о фишинге (цель: > 70%)' },
        { type: 'tip', value: 'Фишинг-симуляции не должны наказывать сотрудников! Цель — обучение, не запугивание. Те кто попался, получают дополнительное обучение. Те кто сообщил — благодарность. Метрики должны улучшаться со временем.' }
      ]
    },
    {
      id: 5,
      title: 'BEC и продвинутые атаки',
      type: 'theory',
      content: [
        { type: 'text', value: 'BEC (Business Email Compromise) — целенаправленная атака на бизнес-процессы. CEO fraud, invoice fraud, vendor impersonation. Ущерб: $43 млрд за 2016-2021 (FBI). Deepfake аудио/видео усиливает угрозу.' },
        { type: 'heading', value: 'Типы BEC атак' },
        { type: 'list', value: [
          'CEO Fraud: "Это CEO, срочно переведите $50K на этот счёт"',
          'Invoice Fraud: поддельный счёт от "поставщика" с изменёнными реквизитами',
          'Vendor Impersonation: атакующий выдаёт себя за поставщика/партнёра',
          'Payroll Diversion: "Измените мои банковские реквизиты для зарплаты"',
          'Deepfake: поддельный голос/видео руководителя (AI generated)'
        ]},
        { type: 'heading', value: 'Защита от BEC' },
        { type: 'list', value: [
          'Двойная верификация: любой перевод > $X требует подтверждения по другому каналу',
          'Процедуры: формальный процесс изменения реквизитов (не через email)',
          'Warning banners: "[EXTERNAL] Это письмо из внешнего источника"',
          'AI detection: анализ стиля письма, аномалий',
          'Financial controls: разделение обязанностей (initiator != approver)'
        ]},
        { type: 'warning', value: 'Deepfake технологии позволяют имитировать голос человека по нескольким минутам записи. В 2019 году CEO британской компании перевёл $243K после звонка от "руководителя" материнской компании — это был deepfake голос.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Анализ фишингового письма',
      type: 'practice',
      difficulty: 'easy',
      description: 'Проанализируйте подозрительное email: проверьте заголовки, ссылки, домен отправителя и определите признаки фишинга.',
      requirements: [
        'Проверьте email заголовки: From, Reply-To, Received, SPF/DKIM',
        'Проанализируйте ссылки в письме (реальный URL vs отображаемый)',
        'Проверьте домен отправителя (WHOIS, возраст домена)',
        'Определите психологические приёмы в тексте письма',
        'Составьте рекомендации для сотрудников'
      ],
      hint: 'Проверьте From vs Reply-To, наведите на ссылки (не кликайте!), whois домена, грамматические ошибки, tone of urgency.',
      expectedOutput: 'Анализ:\nFrom: security@microsoftt.com (лишняя t!)\nReply-To: admin@evil-server.ru (другой домен!)\nSPF: FAIL, DKIM: FAIL\nСсылка: текст "microsoft.com", реальный URL "evil-phishing.com/steal"\nДомен microsoftt.com создан вчера\nПриёмы: срочность, авторитет (Microsoft), страх (аккаунт заблокирован)\nВердикт: ФИШИНГ',
      solution: '#!/bin/bash\n# Анализ подозрительного email\n\necho "=== Анализ фишингового письма ==="\n\n# 1. Проверка заголовков\necho "--- Email Headers ---"\necho "From: security@microsoftt.com"\necho "Reply-To: admin@evil-server.ru"\necho "Received: from mail.evil-server.ru (185.x.x.x)"\necho "Authentication-Results: spf=fail; dkim=fail; dmarc=fail"\necho ""\necho "ПОДОЗРИТЕЛЬНО: From и Reply-To разные домены!"\necho "ПОДОЗРИТЕЛЬНО: SPF, DKIM, DMARC — все FAIL!"\n\n# 2. Проверка домена\necho "\\n--- Проверка домена ---"\nwhois microsoftt.com 2>/dev/null | grep -iE "creation|registrar"\necho "Домен microsoftt.com — typosquatting (лишняя t)!"\n\n# 3. Анализ ссылок\necho "\\n--- Ссылки ---"\necho "Текст: https://account.microsoft.com/verify"\necho "Реальный URL: https://evil-phishing.com/steal-creds"\necho "ОПАСНО: URL не совпадает!"\n\n# 4. Психологические приёмы\necho "\\n--- Психологические приёмы ---"\necho "1. СРОЧНОСТЬ: Подтвердите в течение 24 часов"\necho "2. СТРАХ: Ваш аккаунт будет заблокирован"\necho "3. АВТОРИТЕТ: От имени Microsoft Security"\n\n# 5. Вердикт\necho "\\n=== ВЕРДИКТ: ФИШИНГ ==="\necho "Рекомендации: не кликать, сообщить в IT Security, удалить"',
      explanation: 'Анализ фишинга: проверьте заголовки (From/Reply-To, SPF/DKIM/DMARC), ссылки (реальный URL), домен отправителя (typosquatting, возраст), психологические приёмы (срочность, страх, авторитет). При подозрении: не кликайте, не отвечайте, сообщите в IT Security.'
    }
  ]
}
