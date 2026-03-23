export default {
  id: 7,
  title: 'Пассивный залог: все времена',
  description: 'Passive Voice во всех временах: образование, использование, разница с активным залогом. Незаменим в IT-документации и технических текстах.',
  lessons: [
    {
      id: 1,
      title: 'Что такое пассивный залог и зачем он нужен',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Пассивный залог (Passive Voice) используется, когда:\n1. Исполнитель действия неизвестен или не важен\n2. Акцент на результате, а не на том, кто сделал\n3. Формальный/технический стиль письма\n4. Нежелание называть конкретного человека\n\nАктивный залог: ПОДЛЕЖАЩЕЕ + ГЛАГОЛ + ДОПОЛНЕНИЕ\n"The developer fixed the bug."\n\nПассивный залог: ДОПОЛНЕНИЕ (→ подлежащее) + be + V3 + (by АГЕНТ)\n"The bug was fixed (by the developer)."\n\nВ IT-документации пассивный залог очень распространён:\n"The request is authenticated using OAuth 2.0."\n"Data is stored in a PostgreSQL database."\n"The service is deployed using Docker containers."'
        },
        {
          type: 'text',
          value: 'Структура пассивного залога: be (в нужном времени) + V3\n\nPresent Simple: is/are + V3 — "It is deployed every Friday."\nPast Simple: was/were + V3 — "It was deployed last week."\nFuture Simple: will be + V3 — "It will be deployed tomorrow."\nPresent Continuous: is/are being + V3 — "It is being deployed now."\nPast Continuous: was/were being + V3 — "It was being deployed when the incident occurred."\nPresent Perfect: has/have been + V3 — "It has been deployed successfully."\nPast Perfect: had been + V3 — "It had been deployed before the issue was found."\nFuture Perfect: will have been + V3 — "It will have been deployed by 5 PM."\nModal: can/should/must + be + V3 — "It should be tested before deployment."'
        },
        {
          type: 'tip',
          value: 'Агент (by...) добавляется только когда он важен: "The bug was found by the QA team." Если неважно кто — опускаем: "The bug was fixed." (не нужно говорить кем)'
        }
      ]
    },
    {
      id: 2,
      title: 'Present и Past Simple Passive',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Present Simple Passive (is/are + V3) — постоянные факты, процессы:\n1. The API is secured with JWT tokens.\n2. New features are deployed every two weeks.\n3. User passwords are hashed using bcrypt.\n4. Code changes are reviewed before merging.\n5. The database is backed up every night.\n6. Errors are logged to a centralised monitoring system.\n7. Requests are load-balanced across three servers.\n8. The application is tested in a staging environment first.\n\nPast Simple Passive (was/were + V3) — прошедшие события:\n1. The server was rebooted at 3 AM.\n2. The bug was introduced in version 2.4.\n3. The API was redesigned to follow REST principles.\n4. New security patches were applied over the weekend.\n5. The project was completed on time.\n6. The database migration was run last Tuesday.\n7. Sensitive data was accidentally exposed in the logs.\n8. The certificate was renewed before it expired.'
        },
        {
          type: 'text',
          value: 'Активный → Пассивный (трансформации):\n\n1. "We deploy the app every Friday."\n→ "The app is deployed every Friday."\n\n2. "The team reviewed the code."\n→ "The code was reviewed by the team."\n\n3. "They store user data in S3."\n→ "User data is stored in S3."\n\n4. "Engineers fixed three critical bugs this week."\n→ "Three critical bugs were fixed this week."\n\n5. "Someone introduced a memory leak in the last commit."\n→ "A memory leak was introduced in the last commit."'
        }
      ]
    },
    {
      id: 3,
      title: 'Future и Perfect Passive',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Future Simple Passive (will be + V3) — план на будущее:\n1. The new microservice will be deployed next sprint.\n2. All data will be encrypted before transmission.\n3. The legacy system will be replaced by Q3.\n4. Users will be notified about the maintenance window.\n5. The feature will be announced at the conference.\n\nPresent Perfect Passive (has/have been + V3) — прошлое с результатом:\n1. The security audit has been completed.\n2. All known bugs have been fixed in this release.\n3. The database has been migrated to PostgreSQL.\n4. The API documentation has been updated.\n5. New developers have been onboarded successfully.\n6. The performance issue has been resolved by adding an index.\n\nPast Perfect Passive (had been + V3) — прошлое до другого прошлого:\n1. The code had been reviewed before it was merged.\n2. The backup had been corrupted before we needed it.\n3. The feature had been tested in staging before the production deployment.'
        },
        {
          type: 'text',
          value: 'Continuous Passive (is/was being + V3) — действие в процессе:\n1. The server is currently being upgraded. (Present Continuous Passive)\n2. The code was being reviewed when the incident occurred. (Past Continuous Passive)\n3. The application is being monitored by the DevOps team.\n4. New requirements were being gathered when the sprint started.\n5. The API is being redesigned to improve performance.\n\nModal Passive (modal + be + V3):\n1. Bugs should be fixed before merging to main.\n2. All code must be reviewed by a senior developer.\n3. Passwords cannot be stored in plain text.\n4. The database should be backed up daily.\n5. Users must be notified before data deletion.\n6. This endpoint can be accessed without authentication.'
        }
      ]
    },
    {
      id: 4,
      title: 'Passive в IT-документации',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'IT-документация активно использует пассивный залог. Вот типичные паттерны:\n\nAPI Документация:\n1. "A request must be authenticated before accessing protected endpoints."\n2. "The response is returned in JSON format."\n3. "Rate limits are enforced per API key."\n4. "Errors are reported with appropriate HTTP status codes."\n5. "The payload is validated against the JSON schema."\n\nREADME / Инструкции:\n1. "The application is packaged as a Docker container."\n2. "Environment variables are loaded from a .env file."\n3. "Dependencies are managed using npm."\n4. "The database schema is created during the first run."\n5. "Tests are run automatically on every commit."'
        },
        {
          type: 'text',
          value: 'Incident Reports:\n1. "The issue was detected by the monitoring system at 14:27 UTC."\n2. "The root cause was identified as a misconfigured load balancer."\n3. "Service was restored within 23 minutes."\n4. "Affected users were notified via email."\n5. "The fix was deployed and verified in production."\n6. "Similar issues will be prevented by improving the deployment checklist."\n\nRelease Notes:\n1. "Three critical security vulnerabilities have been patched."\n2. "The authentication flow has been redesigned for better UX."\n3. "Legacy API endpoints will be deprecated in version 3.0."\n4. "Performance has been improved by 40% through query optimisation."\n5. "Support for Python 3.7 has been dropped."'
        }
      ]
    },
    {
      id: 5,
      title: 'By и With в пассивном залоге',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'BY — указывает на агента (кто/что совершило действие):\n- The bug was found by the QA team.\n- The service was built by the platform team.\n- The issue was caused by a race condition.\n- The code was written by a contractor.\n\nWITH — указывает на инструмент или средство (чем/с помощью чего):\n- Passwords are encrypted with AES-256.\n- The API is secured with OAuth 2.0.\n- Files are compressed with gzip.\n- The connection is established with TLS 1.3.\n- Containers are managed with Kubernetes.'
        },
        {
          type: 'text',
          value: 'Сравнение BY и WITH:\n\n"The data is encrypted by the system." (агент — система шифрует)\n"The data is encrypted with AES-256." (инструмент — используется алгоритм)\n\n"The deployment was handled by the DevOps team." (кто — DevOps команда)\n"The deployment was automated with Jenkins." (чем — с помощью Jenkins)\n\n"The bug was reported by a user." (кто — пользователь)\n"The bug was tracked with Jira." (чем — в Jira)\n\nПрактические примеры:\n1. User authentication is handled by the identity service.\n2. User authentication is implemented with JWT tokens.\n3. The database was managed by the DBA team for years.\n4. The database was migrated with a custom Python script.\n5. The tests were written by the development team.\n6. The tests are run with pytest and coverage reports are generated with coverage.py.'
        },
        {
          type: 'note',
          value: 'Когда агент — инструмент/автоматический процесс, часто используется "by": "The request was rejected by the firewall." Это технически правильно, т.к. firewall — это агент (хотя и не человек).'
        }
      ]
    },
    {
      id: 6,
      title: 'Типичные ошибки с пассивным залогом',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Ошибки при образовании:\n\n1. НЕВЕРНО: The bug was fix yesterday.\n   ВЕРНО: The bug was fixed yesterday.\n   (нужна форма V3, не V1)\n\n2. НЕВЕРНО: The app is deployed by us every Friday. (неестественно)\n   ВЕРНО: The app is deployed every Friday. (агент "us" не нужен)\n   Или активный: We deploy the app every Friday.\n\n3. НЕВЕРНО: The code reviewed by the senior developer.\n   ВЕРНО: The code was reviewed by the senior developer.\n   (нельзя пропускать "be")\n\n4. НЕВЕРНО: The feature is being deployed since yesterday.\n   ВЕРНО: The feature has been being deployed since yesterday.\n   (очень редкая форма) Лучше: The deployment has been in progress since yesterday.\n\n5. НЕВЕРНО: It will deployed tomorrow.\n   ВЕРНО: It will be deployed tomorrow.'
        },
        {
          type: 'text',
          value: 'Когда НЕ использовать пассивный залог:\n\n1. Когда агент важен и его стоит назвать:\n   Плохо: "A mistake was made." (кто ошибся?)\n   Лучше: "The developer made a mistake."\n\n2. Когда пассив делает предложение слишком тяжёлым:\n   Плохо: "The decision was made by the team that the deadline should be extended by two weeks."\n   Лучше: "The team decided to extend the deadline by two weeks."\n\n3. Инструкции пользователю — лучше активный залог:\n   Плохо: "The button should be clicked by the user."\n   Лучше: "Click the button." или "You should click the button."'
        }
      ]
    },
    {
      id: 7,
      title: 'Практика: технические тексты',
      type: 'practice',
      description: 'Переведи предложения в пассивный залог и исправь ошибки в пассивных конструкциях.',
      solution: 'Правильные ответы (пассивный залог):\n1. All code is tested before deployment.\n2. The new microservices architecture was designed by the architect.\n3. Version 3.0 will be released next quarter.\n4. The pull request has already been reviewed.\n5. The bug had been introduced before we noticed it.\n6. The hotfix is currently being deployed.\n\nИсправление ошибок:\n1. The code was reviewed last week.\n2. New features will be deployed on Friday.\n3. The application is developed by a team of 10 engineers.\n4. All bugs were fixed before the release.\n5. The service is monitored 24/7.',
      content: [
        {
          type: 'text',
          value: 'Переведите в пассивный залог:\n\n1. We test all code before deployment.\n→ All code is tested before deployment.\n\n2. The architect designed the new microservices architecture.\n→ The new microservices architecture was designed by the architect.\n\n3. They will release version 3.0 next quarter.\n→ Version 3.0 will be released next quarter.\n\n4. The team has already reviewed the pull request.\n→ The pull request has already been reviewed.\n\n5. Someone had introduced the bug before we noticed it.\n→ The bug had been introduced before we noticed it.\n\n6. Engineers are currently deploying the hotfix.\n→ The hotfix is currently being deployed.'
        },
        {
          type: 'text',
          value: 'Напишите технический README раздел "How it works", используя пассивный залог:\n\nПример:\n"How the Authentication Service Works\n\nRequests are received by the API gateway and forwarded to the authentication service. Each request is validated for proper headers and format. The JWT token is extracted from the Authorization header and verified using the public key. If the token has expired or is invalid, a 401 response is returned. If validation is successful, the request is forwarded to the appropriate microservice. All authentication events are logged for security auditing. Rate limiting is enforced per user to prevent brute-force attacks."'
        },
        {
          type: 'text',
          value: 'Исправьте ошибки в пассивном залоге:\n\n1. The code has reviewed last week.\n→ The code was reviewed last week. (прошедшее время, не Perfect)\n\n2. New features will deployed on Friday.\n→ New features will be deployed on Friday.\n\n3. The application is develop by a team of 10 engineers.\n→ The application is developed by a team of 10 engineers.\n\n4. All bugs were being fix before the release.\n→ All bugs were fixed before the release. (или: were being fixed — если процесс)\n\n5. The service is monitor 24/7.\n→ The service is monitored 24/7.'
        }
      ]
    }
  ]
}
