export default {
  id: 23,
  title: 'Writing: Technical Specs and RFC',
  description: 'Как писать технические спецификации, RFC (Request for Comments) и design documents на английском. Структура, язык и примеры.',
  lessons: [
    {
      id: 1,
      title: 'What is a technical spec?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Technical spec (техническая спецификация) — документ, который описывает, как будет работать система или функция. Это ответ на вопросы: что мы строим, зачем, как и что произойдёт, если что-то пойдёт не так.' },
        { type: 'heading', value: 'Why write specs?' },
        { type: 'list', items: [
          'Alignment — все в команде понимают задачу одинаково',
          'Discovery — в процессе написания находятся проблемы до начала кодинга',
          'Documentation — документация создаётся до реализации',
          'Review — другие могут предложить улучшения заранее'
        ]},
        { type: 'heading', value: 'Standard spec sections' },
        { type: 'list', items: [
          'Summary / Overview — краткое описание (1-2 абзаца)',
          'Problem Statement — какую проблему решаем',
          'Goals and Non-Goals — что входит и что НЕ входит в скоуп',
          'Proposed Solution / Design — предлагаемое решение',
          'Technical Details — детали реализации',
          'Alternatives Considered — рассмотренные альтернативы',
          'Open Questions — открытые вопросы',
          'Timeline — сроки'
        ]},
        { type: 'tip', value: 'Раздел "Non-Goals" (что мы НЕ будем делать) — один из важнейших. Он предотвращает scope creep (расширение скоупа) и несоответствие ожиданий.' }
      ]
    },
    {
      id: 2,
      title: 'Writing the Problem Statement',
      type: 'theory',
      content: [
        { type: 'text', value: 'Problem Statement — раздел, где ты объясняешь ЗАЧЕМ нужна эта работа. Хорошая формулировка проблемы критически важна.' },
        { type: 'heading', value: 'Structure of a problem statement' },
        { type: 'list', items: [
          '1. Текущее состояние (what is happening now)',
          '2. Проблема/боль (what is wrong or missing)',
          '3. Влияние (what is the impact)',
          '4. Желаемое состояние (what we want instead)'
        ]},
        { type: 'heading', value: 'Useful phrases' },
        { type: 'list', items: [
          '"Currently, our system..." — в настоящее время наша система...',
          '"This leads to..." — это приводит к...',
          '"As a result, users experience..." — в результате пользователи испытывают...',
          '"The root cause is..." — первопричина заключается в...',
          '"This proposal aims to..." — данное предложение направлено на...',
          '"By solving X, we will be able to..." — решив X, мы сможем...'
        ]},
        { type: 'code', language: 'text', value: 'Example Problem Statement:\n\nCurrently, user authentication tokens are stored in localStorage.\nThis leads to security vulnerabilities where XSS attacks can steal\nuser tokens. As a result, we have had 3 reported security incidents\nin the past quarter.\n\nThis proposal aims to migrate token storage to HttpOnly cookies,\neliminating the XSS attack vector and improving our security posture.' },
        { type: 'note', value: 'Хорошая постановка проблемы включает конкретные данные: числа, проценты, частоту. "3 security incidents" убедительнее, чем "some incidents".' }
      ]
    },
    {
      id: 3,
      title: 'Writing Goals and Non-Goals',
      type: 'theory',
      content: [
        { type: 'text', value: 'Раздел Goals / Non-Goals помогает ограничить скоуп работы и выровнять ожидания всех участников.' },
        { type: 'heading', value: 'Writing Goals' },
        { type: 'text', value: 'Goals должны быть конкретными, измеримыми и достижимыми в рамках проекта.' },
        { type: 'list', items: [
          '"Reduce API response time to under 200ms for 95% of requests"',
          '"Enable users to export reports in CSV and PDF formats"',
          '"Support concurrent connections for up to 10,000 users"',
          '"Achieve 99.9% uptime for the payment service"'
        ]},
        { type: 'heading', value: 'Writing Non-Goals' },
        { type: 'text', value: 'Non-Goals — явное указание на то, что НЕ будет сделано в рамках этой задачи.' },
        { type: 'list', items: [
          '"This proposal does not cover mobile app changes"',
          '"Migrating legacy users is out of scope for this phase"',
          '"Performance optimization is not a goal of this iteration"',
          '"We are not addressing internationalization in this spec"'
        ]},
        { type: 'tip', value: 'Используй конструкцию "out of scope" — очень профессиональное выражение. "X is out of scope for this initiative" означает, что X не входит в текущий объём работ.' }
      ]
    },
    {
      id: 4,
      title: 'Writing the Proposed Solution',
      type: 'theory',
      content: [
        { type: 'text', value: 'Раздел Proposed Solution — сердце технической спецификации. Здесь ты описываешь своё решение максимально чётко.' },
        { type: 'heading', value: 'Key phrases for describing solutions' },
        { type: 'list', items: [
          '"We propose to..." — мы предлагаем...',
          '"The solution consists of..." — решение состоит из...',
          '"We will implement X by doing Y" — мы реализуем X путём Y',
          '"The architecture involves..." — архитектура включает...',
          '"Data will flow as follows:..." — данные будут передаваться следующим образом...',
          '"This approach was chosen because..." — этот подход был выбран, потому что...',
          '"The key trade-off is..." — ключевой компромисс заключается в...'
        ]},
        { type: 'heading', value: 'Describing components' },
        { type: 'list', items: [
          '"Component A is responsible for..." — компонент A отвечает за...',
          '"The service exposes the following endpoints:..." — сервис предоставляет следующие эндпоинты...',
          '"Upon receiving a request, the system will..." — при получении запроса система...',
          '"In the event of failure,..." — в случае сбоя...',
          '"The retry mechanism ensures that..." — механизм повторных попыток гарантирует...'
        ]},
        { type: 'note', value: 'В Proposed Solution всегда объясняй почему — почему именно это решение, почему такая архитектура. Это делает документ убедительным и полезным для будущих разработчиков.' }
      ]
    },
    {
      id: 5,
      title: 'Alternatives Considered and Open Questions',
      type: 'theory',
      content: [
        { type: 'text', value: 'Хорошая техническая спека показывает, что автор думал об альтернативах и честно признаёт неизвестные вопросы.' },
        { type: 'heading', value: 'Writing Alternatives Considered' },
        { type: 'list', items: [
          '"We considered X but rejected it because..." — мы рассматривали X, но отклонили, потому что...',
          '"Option A would have required... which is unacceptable because..." — вариант A потребовал бы...',
          '"The main downside of X is..." — главный недостаток X заключается в...',
          '"Compared to our proposed solution, X has the disadvantage of..." — по сравнению с нашим решением, X имеет недостаток...'
        ]},
        { type: 'heading', value: 'Writing Open Questions' },
        { type: 'text', value: 'Open Questions — раздел, где ты честно перечисляешь нерешённые вопросы, требующие обсуждения или дополнительных исследований.' },
        { type: 'list', items: [
          '"How should we handle the case where...?"',
          '"It\'s unclear whether X will scale to Y requests per second."',
          '"We need to determine the retention policy for..."',
          '"Should we support backward compatibility with version 1?"',
          '"The impact on latency needs to be benchmarked."'
        ]},
        { type: 'tip', value: 'Раздел Open Questions показывает интеллектуальную честность. Не бойся писать "мы ещё не знаем" — это лучше, чем скрывать неопределённости.' }
      ]
    },
    {
      id: 6,
      title: 'Practice: Write a mini-spec',
      type: 'practice',
      difficulty: 'hard',
      description: 'Напиши мини-техническую спецификацию для следующей задачи.',
      solution: 'Правильные ответы включают все разделы:\nSummary: краткое описание функции сброса пароля.\nProblem Statement: текущие 50 тикетов/неделю, 2 часа на решение.\nGoals: восстановление через email, < 5 минут, токен 1 час, работает на мобильном и desktop.\nNon-Goals: SMS вне скопа, social login вне скопа.\nProposed Solution: "Забыл пароль" → email → токен 1 час → форма сброса → инвалидация старого пароля.',
      scenario: 'Задача: Добавить функцию "забыл пароль" в веб-приложение. Сейчас у пользователей нет способа восстановить пароль самостоятельно — они звонят в поддержку.',
      template: 'Summary:\n[1-2 предложения о том, что предлагается]\n\nProblem Statement:\n[Текущая ситуация, проблема, влияние]\n\nGoals:\n[3-4 конкретные цели в формате bullet points]\n\nNon-Goals:\n[2-3 вещи, которые НЕ будут сделаны]\n\nProposed Solution:\n[Кратко: как это будет работать — шаги для пользователя и технические детали]',
      sampleAnswer: 'Summary:\nThis spec proposes adding a self-service password reset feature via email, reducing support load and improving user experience.\n\nProblem Statement:\nCurrently, users who forget their password must contact support. This results in approximately 50 support tickets per week and an average 2-hour resolution time. By enabling self-service password reset, we can eliminate this friction.\n\nGoals:\n- Enable users to reset password via email link\n- Complete reset flow in under 5 minutes\n- Tokens expire after 1 hour for security\n- Works on mobile and desktop\n\nNon-Goals:\n- SMS-based reset is out of scope for this phase\n- Social login is not addressed in this spec\n\nProposed Solution:\nUser clicks "Forgot password" on the login page. They enter their email and receive a time-limited token (1 hour) via email. Clicking the link opens a reset form. Upon submission, the old password is invalidated and the new one is set.'
    },
    {
      id: 7,
      title: 'Practice: Improve weak spec writing',
      type: 'practice',
      difficulty: 'medium',
      description: 'Улучши следующие слабо написанные части технической спеки.',
      solution: 'Правильные улучшенные варианты:\n1. Проблема: "API response times for the search endpoint average 4.2 seconds under normal load (target: < 500ms). This causes 35% of users to abandon searches, directly impacting conversion rate."\n2. Цель: "Reduce search API response time from 4.2s to under 500ms for 95th percentile requests under load of 1,000 concurrent users."\n3. Redis: "We will introduce Redis as a caching layer for search results. Queries with identical parameters will be served from cache for 5 minutes, reducing database load."',
      tasks: [
        {
          weak: 'Problem: The system is slow.',
          instruction: 'Перепиши с конкретными данными и описанием влияния.',
          improved: 'Problem: API response times for the search endpoint average 4.2 seconds under normal load (target: < 500ms). This causes 35% of users to abandon searches before results load, directly impacting conversion rate.'
        },
        {
          weak: 'Goal: Make the system faster.',
          instruction: 'Сделай цель конкретной и измеримой.',
          improved: 'Goal: Reduce search API response time from 4.2s to under 500ms for 95th percentile requests under load of 1,000 concurrent users.'
        },
        {
          weak: 'We will use Redis.',
          instruction: 'Добавь объяснение почему именно Redis и какую роль он играет.',
          improved: 'We will introduce Redis as a caching layer for search results. Queries with identical parameters will be served from cache for 5 minutes, reducing database load. Redis was chosen over Memcached because we require pub/sub functionality for cache invalidation.'
        }
      ]
    }
  ]
}
