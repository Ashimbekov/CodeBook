export default {
  id: 32,
  title: 'Практикум: Техническое письмо',
  description: 'Практика технического письма: ADR, документация, постмортемы, blog posts, emails',
  lessons: [
    {
      id: 1,
      title: 'Практика: API-документация',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напишите профессиональную документацию для REST API-эндпоинта.',
      requirements: ['Используйте пассивный залог', 'Включите: параметры, ответы, ошибки, примеры'],
      questions: [
        { text: 'Write professional documentation for:\nPOST /api/v1/deployments\nCreates a new deployment for a service\nRequired: service_name (string), version (string), environment (string: staging/production)\nOptional: config_overrides (object)', answer: '## POST /api/v1/deployments\n\nInitiates a new deployment for the specified service.\n\n**Authentication**: Bearer token required. The requesting user must hold the `deployments:write` permission for the target environment.\n\n**Request Body** (application/json):\n\n| Field | Type | Required | Description |\n|-------|------|----------|-------------|\n| service_name | string | Yes | The name of the service to be deployed |\n| version | string | Yes | The version tag or commit SHA to be deployed |\n| environment | string | Yes | Target environment: `staging` or `production` |\n| config_overrides | object | No | Environment-specific configuration values that override defaults |\n\n**Responses**:\n- `202 Accepted`: Deployment has been queued. A `deployment_id` is returned for status polling.\n- `400 Bad Request`: Required fields are missing or the `environment` value is invalid.\n- `403 Forbidden`: The authenticated user lacks permission to deploy to the specified environment.\n- `409 Conflict`: A deployment for this service and environment is already in progress.\n\n**Notes**: Deployments are processed asynchronously. The status of a deployment can be tracked via `GET /api/v1/deployments/{deployment_id}`.', explanation: 'Good API documentation uses passive voice, is precise, covers all error cases, and includes authentication requirements.' }
      ],
      solution: 'Правильные ответы:\n1. ## POST /api/v1/deployments',
      hint: 'Структура: краткое описание → аутентификация → параметры (таблица) → ответы → примечания. Используйте пассив: "is returned", "must be provided".',
      explanation: 'Clear API documentation reduces integration friction and support burden. It is one of the most impactful technical writing skills.'
    },
    {
      id: 2,
      title: 'Практика: Writing a Postmortem',
      type: 'practice',
      difficulty: 'hard',
      description: 'Напишите полный постмортем по описанному инциденту.',
      requirements: ['Структура: Summary, Timeline, Root Cause, Impact, Resolution, Action Items', 'Тон: профессиональный, blameless', 'Длина: 300-400 слов'],
      hint: 'Инцидент: Payment service was down for 45 minutes. Cause: a new deployment introduced a breaking change in the database schema migration that was not backward-compatible. 3% of users affected.',
      solution: '# Incident Postmortem: Payment Service Outage\n**Date**: March 15, 2025\n**Duration**: 45 minutes (14:22 – 15:07 UTC)\n**Severity**: P1\n**Status**: Resolved\n\n## Summary\nThe payment service experienced a 45-minute outage following a scheduled deployment. The deployment included a database schema migration that was not backwards-compatible with the running service version, causing payment processing to fail for approximately 3% of users during the window.\n\n## Timeline\n- 14:20 UTC — Deployment of payment-service v2.4.1 initiated\n- 14:22 UTC — Schema migration completes; running instances begin failing\n- 14:27 UTC — First automated alerts triggered (error rate >1%)\n- 14:35 UTC — On-call engineer acknowledges and begins investigation\n- 14:52 UTC — Root cause identified: breaking migration\n- 15:03 UTC — Rollback to v2.4.0 initiated\n- 15:07 UTC — Service fully restored\n\n## Root Cause\nThe schema migration in v2.4.1 renamed a column that was referenced by the running v2.4.0 instances during the deployment window. The migration and deployment were not designed to be executed in a backwards-compatible manner.\n\n## Impact\n- 3% of payment requests (approximately 1,200 transactions) returned errors\n- No payment data was lost; all failed transactions can be replayed\n- No financial data was corrupted\n\n## Resolution\nService was restored by rolling back to the previous deployment version. The migration was reverted manually. A corrected, backwards-compatible migration strategy has been developed.\n\n## Action Items\n| Action | Owner | Due Date |\n|--------|-------|----------|\n| Implement backwards-compatibility check in migration CI gate | DevOps | March 22 |\n| Update deployment runbook to require migration review | Engineering Lead | March 20 |\n| Replay the 1,200 failed transactions | Payments Team | March 16 |',
      explanation: 'A blameless postmortem focuses on systemic causes, not individual mistakes. The goal is learning and prevention, not blame.'
    },
    {
      id: 3,
      title: 'Практика: ADR для архитектурного решения',
      type: 'practice',
      difficulty: 'hard',
      description: 'Напишите ADR для реального архитектурного решения.',
      requirements: ['Полный формат: Title, Status, Context, Decision, Consequences', 'Минимум 3 альтернативы в Context', 'Конкретные, измеримые последствия'],
      hint: 'Решение: использовать Redis для rate limiting вместо в-памяти rate limiting в отдельных экземплярах сервиса.',
      solution: '# ADR-024: Use Redis for Distributed Rate Limiting\n\n## Status\nAccepted\n\n## Context\nOur API gateway requires rate limiting to protect downstream services from abuse. As the service scales horizontally, per-instance in-memory rate limiting has become inadequate — each instance maintains its own counter, allowing clients to effectively multiply their rate limit by the number of instances.\n\nThe following options were considered:\n1. **Per-instance in-memory**: Simple to implement, no additional infrastructure. But rate limits are multiplied by instance count — not viable at scale.\n2. **Redis-backed distributed counter**: Single source of truth for rate limit counts. Adds Redis as an infrastructure dependency. Proven approach used by major API providers.\n3. **External rate limiting service** (e.g., Kong): Full-featured but introduces significant operational complexity and vendor dependency.\n\n## Decision\nWe will implement distributed rate limiting using Redis with the token bucket algorithm, using atomic Lua scripts to ensure correctness under concurrent access.\n\n## Consequences\n**Positive:**\n- Rate limits are enforced consistently across all service instances, regardless of horizontal scale\n- Redis\'s sub-millisecond latency ensures rate limit checks add less than 1ms to request latency\n- The token bucket algorithm supports burst allowances, providing a better user experience than hard windowing\n\n**Negative:**\n- Redis becomes a critical dependency for all API requests; Redis unavailability would require a fallback strategy (we will fail open — allow requests — if Redis is unreachable)\n- Adds operational overhead of managing a highly available Redis cluster (mitigated by using AWS ElastiCache)',
      explanation: 'Good ADRs are honest about both positive and negative consequences. They document alternatives so future teams understand what was considered.'
    },
    {
      id: 4,
      title: 'Практика: Technical blog post introduction',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напишите введение для технической статьи с сильным hook.',
      requirements: ['Hook в первых 2-3 предложениях', 'Чёткий promise (что узнает читатель)', 'Определение аудитории', 'Длина: 100-120 слов'],
      questions: [
        { text: 'Write a blog post introduction for: "How to diagnose and fix slow PostgreSQL queries"', answer: 'Your application feels fine in development. Then you hit production with real data and real load, and suddenly everything is slow — and nobody knows why.\n\nPostgreSQL\'s query performance issues are rarely caused by the database itself. More often, they are caused by missing indexes, inefficient query structures, or table bloat that went unnoticed during development.\n\nIn this post, I\'ll show you a systematic approach to diagnosing slow queries — from reading EXPLAIN ANALYZE output to interpreting pg_stat_statements. By the end, you\'ll have a repeatable process for identifying bottlenecks and a concrete toolkit for fixing them. This guide assumes basic familiarity with SQL and PostgreSQL.', explanation: 'This introduction: 1) Opens with a relatable scenario (problem hook); 2) Identifies the real cause; 3) Promises a systematic approach; 4) Specifies what you\'ll have after reading; 5) Sets expectations about required knowledge.' }
      ],
      solution: 'Правильные ответы:\n1. Your application feels fine in development. Then you hit production with real data and real load, and suddenly everything is slow — and nobody knows why.',
      hint: 'Hook types: problem scenario, surprising fact, question, bold claim. Promise: "By the end, you will..." Audience: "This assumes X knowledge."',
      explanation: 'The introduction determines whether anyone reads your post. A strong hook, clear promise, and honest audience definition are the three essential elements.'
    },
    {
      id: 5,
      title: 'Практика: README.md',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напишите README для open-source проекта.',
      requirements: ['Включите: описание, установка, быстрый старт, примеры, contributing', 'Понятный, конкретный язык', 'Структура с заголовками'],
      hint: 'Проект: go-ratelimiter — Go library for distributed rate limiting using Redis.',
      solution: '# go-ratelimiter\n\nA production-ready, distributed rate limiting library for Go applications, backed by Redis. Implements the token bucket algorithm with atomic operations for correctness under concurrent access.\n\n## Features\n- Token bucket and sliding window algorithms\n- Atomic Redis operations — no race conditions under high concurrency\n- Per-key rate limits (by IP, user ID, API key)\n- Configurable burst allowances\n- Automatic fallback behaviour when Redis is unavailable\n\n## Installation\n```\ngo get github.com/example/go-ratelimiter\n```\n\n## Quick Start\n```go\nlimiter := ratelimiter.New(redisClient, ratelimiter.Config{\n    Limit:  100,\n    Window: time.Minute,\n})\n\nallowed, remaining, err := limiter.Allow(ctx, userID)\nif !allowed {\n    http.Error(w, "rate limit exceeded", http.StatusTooManyRequests)\n    return\n}\n```\n\n## Contributing\nContributions are welcome. Please open an issue before submitting a PR for significant changes. All PRs require tests and must pass the existing test suite.\n\n## License\nMIT',
      explanation: 'A good README sells the library in the first paragraph, shows usage within 30 seconds, and makes contributing easy. It is often the first and last thing a potential user reads.'
    },
    {
      id: 6,
      title: 'Практика: RFC-стиль для внутреннего документа',
      type: 'practice',
      difficulty: 'hard',
      description: 'Напишите internal RFC используя RFC-стиль с MUST/SHOULD/MAY.',
      requirements: ['Используйте MUST, MUST NOT, SHOULD, MAY', 'Полная структура RFC', 'Длина: 200-250 слов'],
      hint: 'Тема: Internal API Design Guidelines — как все команды должны проектировать свои APIs.',
      solution: '# Internal RFC: API Design Guidelines\n**Status**: Accepted\n**Author**: Engineering Team\n\n## Abstract\nThis document defines the API design standards for all internal and external APIs at our company. Implementations that do not conform to these guidelines MUST be approved by the Architecture Review Board.\n\n## API Versioning\nAll public APIs MUST include a version in the URL path (e.g., /api/v1/). APIs MUST NOT remove or modify existing fields in a versioned response — only additions are permitted within a version. APIs SHOULD support the previous major version for a minimum of 12 months after a new major version is released.\n\n## Error Responses\nAll error responses MUST include a machine-readable error code and a human-readable message. Error responses SHOULD include a unique request ID to facilitate debugging. APIs MAY include additional diagnostic information in a separate debug field.\n\n## Authentication\nAll APIs MUST require authentication. API keys MUST NOT be accepted as query parameters — they MUST be provided in the Authorization header. APIs SHOULD implement token rotation support.\n\n## Rate Limiting\nAPIs SHOULD return a Retry-After header when returning 429 Too Many Requests. Rate limit headers (X-RateLimit-Limit, X-RateLimit-Remaining) SHOULD be included in all responses.',
      explanation: 'Writing internal RFCs in RFC style (MUST/SHOULD/MAY) creates clarity about what is mandatory versus recommended. It prevents ambiguity in technical standards.'
    },
    {
      id: 7,
      title: 'Практика: email для технического запроса',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напишите профессиональный email с техническим запросом.',
      requirements: ['Полуформальный тон', 'Чёткий запрос и обоснование', 'Вопросы в конце'],
      hint: 'Контекст: вы просите команду безопасности провести security review нового API до продакшн-запуска.',
      solution: 'Subject: Security Review Request — New Payment API (Launch Target: April 15)\n\nHi Security Team,\n\nI\'m reaching out to request a security review for our new Payment Processing API ahead of its planned production launch on April 15.\n\nBackground: We have built a new REST API that handles payment authorisation and card tokenisation. It integrates with our existing authentication system (JWT-based) and communicates with our payment processor via a third-party SDK.\n\nScope of Review:\n- Authentication and authorisation flow\n- Input validation and injection vulnerabilities\n- Sensitive data handling (PCI-DSS considerations)\n- Rate limiting and abuse prevention\n\nDocumentation available:\n- OpenAPI specification: [link]\n- Architecture diagram: [link]\n- Data flow diagram: [link]\n\nWe have already completed an internal SAST scan (results attached) but would value your team\'s review of the areas flagged, particularly the webhook signature verification logic.\n\nGiven the launch date, would it be feasible to schedule the review in the week of April 1? Please let me know if you need any additional context or if the scope is too broad given your current workload — I\'m happy to prioritise specific areas.\n\nThank you for your time.\n\nBest regards,\nNurdaulet',
      explanation: 'Technical request emails are most effective when they: provide clear context, specify the exact scope, offer supporting materials, and propose a timeline respectfully.'
    },
    {
      id: 8,
      title: 'Практика: написание технического решения в Confluence',
      type: 'practice',
      difficulty: 'hard',
      description: 'Напишите структурированный технический документ для внутренней wiki.',
      requirements: ['Заголовки для навигации', 'Чёткая структура: Problem, Context, Solution, Trade-offs', 'Диаграммы (описание словами)', 'Actionable для команды'],
      hint: 'Тема: How to handle distributed transactions in our microservices architecture.',
      solution: '# Handling Distributed Transactions in Microservices\n**Last Updated**: March 2025 | **Owner**: Platform Team\n\n## Problem Statement\nWhen a single business operation spans multiple services (e.g., placing an order requires updating inventory, creating a payment record, and sending a confirmation email), maintaining consistency across services without a distributed transaction manager is non-trivial.\n\n## Background\nOur current architecture is stateless and uses direct synchronous calls between services. This creates tight coupling and makes partial failure handling complex. When the payment service succeeds but the inventory service fails, we are left in an inconsistent state.\n\n## Recommended Approach: Saga Pattern\nWe recommend implementing the Choreography-based Saga pattern for operations that span more than two services.\n\n**How it works:**\n1. Each service publishes a domain event after completing its part of the transaction\n2. Other services react to these events\n3. If a step fails, compensating transactions are triggered to undo previous steps\n\n**Example — Order Placement:**\nOrder Service → publishes `OrderCreated` → Inventory Service reserves items → publishes `InventoryReserved` → Payment Service charges card → publishes `PaymentCompleted` → Email Service sends confirmation\n\n**On failure:** If Payment fails, it publishes `PaymentFailed` → Inventory Service receives this and releases the reserved items (compensating transaction).\n\n## Trade-offs\n| Aspect | Saga Pattern | Two-Phase Commit |\n|--------|-------------|------------------|\n| Complexity | Medium | High |\n| Performance | Good | Poor |\n| Consistency | Eventual | Strong |\n| Operational overhead | Medium | High |\n\n## When to Use This\n- Use Saga when eventual consistency is acceptable\n- Avoid for financial transactions requiring strong consistency — consider a dedicated financial service with its own ACID database\n\n## Implementation Resources\n- Reference implementation: [link]\n- Event schema registry: [link]',
      explanation: 'Well-structured internal documentation reduces onboarding time and prevents repeated discussions of already-resolved questions. It is a multiplier on team knowledge.'
    },
    {
      id: 9,
      title: 'Практика: технический отчёт для руководства',
      type: 'practice',
      difficulty: 'hard',
      description: 'Напишите технический отчёт для нетехнической аудитории.',
      requirements: ['Без технического жаргона', 'Фокус на бизнес-Impact', 'Чёткие рекомендации', 'Executive Summary в начале'],
      hint: 'Отчёт: результаты Performance Audit. Проблема: медленный сайт. Решение: кэширование и CDN. Стоимость: $2000/месяц. Ожидаемый ROI: 15% рост конверсии.',
      solution: '# Website Performance Audit — Executive Summary\n**Date**: March 2025\n**Prepared by**: Engineering Team\n\n## Executive Summary\nOur website is currently loading 40% slower than industry benchmarks. This directly affects customer experience and revenue: research consistently shows that a 1-second improvement in load time can increase conversions by 7-10%. We recommend two targeted improvements that can be implemented within 30 days at a cost of $2,000 per month and are expected to improve page load times by 60% and increase conversion rates by approximately 15%.\n\n## Current Situation\nOur website takes an average of 4.2 seconds to load on a mobile device. The industry standard for e-commerce is under 2.5 seconds. We are seeing higher-than-normal abandonment rates on product pages, which correlates with these load times.\n\n## Recommended Actions\n**1. Content Delivery Network (CDN) — $1,200/month**\nA CDN stores copies of our website content in data centres around the world, so users receive content from a server close to them. This alone is expected to reduce load times by 40%.\n\n**2. Caching — $800/month additional infrastructure**\nCaching allows the server to serve frequently requested content without processing it from scratch each time, reducing server load and response times.\n\n## Expected Business Impact\n- Page load time: 4.2s → 1.7s (60% improvement)\n- Estimated conversion improvement: 15%\n- Estimated additional monthly revenue (at current traffic): $18,000\n- Monthly cost: $2,000\n- **Return on Investment: 9:1**\n\n## Recommendation\nWe recommend approving both improvements immediately. Implementation can be completed within 30 days.',
      explanation: 'Technical reports for non-technical stakeholders require translating engineering decisions into business outcomes. ROI, conversion rates, and revenue figures are the language of executive communication.'
    },
    {
      id: 10,
      title: 'Финальная практика: комплексное техническое письмо',
      type: 'practice',
      difficulty: 'hard',
      description: 'Напишите комплексный документ, объединяющий несколько форматов.',
      requirements: [
        'Ситуация: вы предлагаете новый подход к secrets management в компании',
        'Создайте: 1) Slack announcement (100 слов), 2) One-pager для engineering team (200 слов), 3) Email для CISO (100 слов)',
        'Разные регистры для разных аудиторий'
      ],
      hint: 'Три аудитории: 1) Engineering team (коллеги, неформально), 2) Technical detail (engineering), 3) C-level (бизнес и compliance).',
      solution: '1. SLACK ANNOUNCEMENT:\n@engineering-team heads up: we\'re moving to HashiCorp Vault for secrets management starting next sprint. TL;DR: no more secrets in .env files or config repos. Instead, apps will fetch secrets at startup from Vault.\n\nThis is MUST DO — we had three secret rotation incidents last quarter that cost us 8 hours of eng time. PTAL at the migration guide I\'ve linked in #devex.\n\nQ&A session Thursday 3pm. Let me know if you have blockers.\n\n---\n\n2. ONE-PAGER (Engineering Team):\n## Secrets Management Migration to HashiCorp Vault\n\nProblem: Currently, secrets are stored in environment variable files committed to config repositories. This creates security risks (broad access, no audit trail) and operational overhead (manual rotation, no automatic expiry).\n\nSolution: HashiCorp Vault provides centralised secret storage with fine-grained access control, automatic rotation, and a full audit log. Services will authenticate using their service accounts and request only the secrets they need (least privilege).\n\nMigration Approach: Each service will be migrated over four sprints. A migration guide and Vault SDK wrapper are available in the devex repository. The DevOps team will support migration sessions for each team.\n\nExpected Outcomes: Elimination of secrets in config repositories; automated rotation for database credentials; compliance with SOC 2 CC6 requirements; reduction in secret-related incidents.\n\n---\n\n3. EMAIL TO CISO:\nSubject: Secrets Management Improvement Initiative — SOC 2 Alignment\n\nDear [CISO name],\n\nI am writing to inform you of a planned improvement to our secrets management practices. Following three incidents last quarter involving stale or exposed credentials, we are migrating to HashiCorp Vault as our centralised secrets management platform.\n\nThis initiative directly addresses SOC 2 CC6 control requirements regarding access credential management, rotation, and audit logging. Implementation is planned over Q2 and will be completed before the next audit cycle.\n\nI would welcome the opportunity to brief you on the approach at your convenience.\n\nRegards,\nNurdaulet',
      explanation: 'The same information presented to three different audiences demonstrates register mastery. Engineering team: informal, direct, action-oriented. CISO: formal, compliance-focused, strategic.'
    }
  ]
}
