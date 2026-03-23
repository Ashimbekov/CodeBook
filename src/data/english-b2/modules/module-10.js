export default {
  id: 10,
  title: 'Formal vs Informal Register',
  description: 'Различия формального и неформального стиля в IT-коммуникации',
  lessons: [
    {
      id: 1,
      title: 'Что такое register и почему он важен',
      type: 'theory',
      content: [
        { type: 'text', value: 'Register — это стиль языка, который выбирается в зависимости от контекста, аудитории и цели общения. В IT вы постоянно переключаетесь между регистрами: Slack-сообщение коллеге vs. email клиенту vs. RFC-документ.' },
        { type: 'heading', value: 'Спектр регистров' },
        { type: 'list', items: [
          'Very formal: юридические документы, стандарты, официальные отчёты',
          'Formal: деловые письма, техническая документация, RFC',
          'Semi-formal: email коллегам, Pull Request описания, ADR',
          'Informal: Slack/Discord, стендапы, разговоры с командой',
          'Very informal: мемы, сленг, приватные чаты'
        ]},
        { type: 'heading', value: 'Основные различия' },
        { type: 'text', value: 'INFORMAL → FORMAL:\n"I can\'t" → "I am unable to"\n"find out" → "ascertain"\n"use" → "utilise"\n"help" → "assist"\n"get" → "obtain"\n"look into" → "investigate"\n"set up" → "establish"' },
        { type: 'tip', value: 'Ошибка в выборе регистра может дорого стоить: слишком неформальный email клиенту выглядит непрофессионально, а слишком формальный Slack-сообщение коллеге — странно и холодно.' }
      ]
    },
    {
      id: 2,
      title: 'Формальный стиль: деловая переписка и документы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Формальный стиль используется в официальных письмах, договорах, RFC и техдокументации.' },
        { type: 'heading', value: 'Характеристики формального стиля' },
        { type: 'list', items: [
          'Полные формы: "I am", "we have", "it is" (без сокращений)',
          'Избегание фразовых глаголов: "terminate" вместо "end up", "establish" вместо "set up"',
          'Пассивный залог чаще: "It has been decided that..."',
          'Длинные, сложные предложения с несколькими придаточными',
          'Нейтральная, безличная лексика'
        ]},
        { type: 'heading', value: 'Email клиенту (формальный)' },
        { type: 'text', value: '"Dear Mr Johnson,\n\nI am writing to inform you of a critical service disruption that occurred between 14:00 and 16:30 UTC on 15 March 2025. The incident was caused by a misconfiguration in our load balancing infrastructure and resulted in a 2.5-hour service outage.\n\nWe sincerely apologise for any inconvenience this may have caused. We have since implemented additional safeguards to prevent a recurrence of this issue.\n\nYours sincerely,\nNurdaulet"' },
        { type: 'warning', value: 'Избегайте в формальных текстах:\n- Сокращения: don\'t, can\'t, we\'ve → do not, cannot, we have\n- Фразовые глаголы там, где есть одно слово\n- Восклицательные знаки (кроме самых редких случаев)\n- Жаргон и сленг' }
      ]
    },
    {
      id: 3,
      title: 'Неформальный стиль: Slack, стендапы, командное общение',
      type: 'theory',
      content: [
        { type: 'text', value: 'Неформальный стиль делает командное общение быстрым и живым. Слишком формальный Slack снижает скорость коммуникации и создаёт барьеры.' },
        { type: 'heading', value: 'Характеристики неформального стиля' },
        { type: 'list', items: [
          'Сокращения повсюду: I\'m, we\'re, it\'s, can\'t, won\'t',
          'Фразовые глаголы: check out, dig into, break down, spin up',
          'Прямые вопросы без вводных: "Can you review this PR?" вместо "I was wondering if you might be able to..."',
          'Сленг и аббревиатуры: LGTM, WIP, TIL, btw, fwiw',
          'Эллипсис (пропуск слов): "Pushed the fix." вместо "I have pushed the fix."'
        ]},
        { type: 'heading', value: 'Slack-сообщение коллеге (неформальный)' },
        { type: 'text', value: '"Hey! Heads up — prod is throwing 500s. Looks like the DB connection pool is maxed out. Can you take a look? I\'m digging into the logs now. Might be related to the deploy we did this morning."' },
        { type: 'tip', value: 'Неформальность не означает небрежность. Даже в Slack важны ясность и конкретность. Избегайте сообщений типа "it\'s broken" — добавляйте контекст: что, где, когда, как воспроизвести.' }
      ]
    },
    {
      id: 4,
      title: 'Полуформальный стиль: Pull Request, ADR, email коллегам',
      type: 'theory',
      content: [
        { type: 'text', value: 'Большинство IT-коммуникации находится в полуформальной зоне. Это профессионально, но не скованно.' },
        { type: 'heading', value: 'Pull Request description' },
        { type: 'text', value: '"## What does this PR do?\n\nAdds rate limiting to the authentication endpoint to prevent brute-force attacks. The implementation uses a sliding window algorithm with Redis as the backing store.\n\n## Why?\n\nWe\'ve been seeing an increasing number of credential stuffing attempts. This addresses the most critical vector.\n\n## Testing\n\n- Added unit tests for the rate limiter logic\n- Tested manually against staging with ApacheBench\n- All existing tests pass\n\n## Notes\n\nThe rate limit is currently set to 10 requests/minute per IP. We should revisit this threshold after monitoring production traffic for a week."' },
        { type: 'heading', value: 'Email коллеге-инженеру' },
        { type: 'text', value: '"Hi Team,\n\nJust a heads-up: we\'re planning to upgrade the Kafka cluster to version 3.6 this weekend.\n\nThis should be transparent to consumers, but I\'d recommend keeping an eye on your services during the Saturday 2-4 AM maintenance window.\n\nLet me know if you have any concerns or if this conflicts with any planned work.\n\nThanks,\nNurdaulet"' }
      ]
    },
    {
      id: 5,
      title: 'Tone: уверенность, дипломатичность, нейтральность',
      type: 'theory',
      content: [
        { type: 'text', value: 'Помимо формальности, важен tone — тон сообщения. В IT особенно важны дипломатичность в code review и уверенность в презентациях.' },
        { type: 'heading', value: 'Смягчение критики (hedging)' },
        { type: 'text', value: 'Прямо: "This code is wrong."\nДипломатично: "I think there might be an issue here — this could cause a race condition under high concurrency."\n\nПрямо: "You should refactor this."\nДипломатично: "It might be worth considering whether we could refactor this to improve readability."' },
        { type: 'heading', value: 'Hedging phrases' },
        { type: 'list', items: [
          '"It seems to me that..." — кажется, что...',
          '"I might be wrong, but..." — возможно, я ошибаюсь, но...',
          '"I was wondering if..." — интересно, не мог бы ты...',
          '"It could be argued that..." — можно утверждать, что...',
          '"There\'s a possibility that..." — возможно, что...',
          '"You might want to consider..." — стоит рассмотреть...'
        ]},
        { type: 'heading', value: 'Уверенный тон для презентаций' },
        { type: 'text', value: '"I am confident that this solution will scale to meet our needs."\n"The data clearly shows a 40% performance improvement."\n"There is no doubt that this approach is more maintainable."' },
        { type: 'tip', value: 'В code review используйте вопросы вместо утверждений: "Have we considered the edge case where X is null?" вместо "You forgot to handle null." Это значительно снижает конфликтность.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: переключение регистров',
      type: 'practice',
      difficulty: 'medium',
      description: 'Перепишите сообщения в нужном регистре.',
      requirements: [
        'Адаптируйте тон и лексику к указанному регистру',
        'Сохраните содержание',
        'Используйте типичные фразы для каждого регистра'
      ],
      questions: [
        { text: 'INFORMAL: "Hey, the deploy broke prod. Servers are down. Fix it ASAP!"\n→ Formal email to the client:', answer: 'Dear [Client Name],\n\nWe would like to inform you that we are currently experiencing a service disruption following a recent deployment. Our engineering team is actively investigating the issue and working to restore full service as quickly as possible.\n\nWe sincerely apologise for any inconvenience this may cause and will provide an update within the next 30 minutes.\n\nKind regards,\nThe Engineering Team', explanation: 'Формальный стиль: полные формы, пассив, официальная лексика, извинения, обязательство обновлять статус' },
        { text: 'FORMAL: "We strongly recommend that all development team members ensure their local development environments are configured in accordance with the updated specifications provided in the documentation."\n→ Slack message to team:', answer: 'Hey team! Quick reminder: please update your local dev setup to match the new docs. Check the updated README for details. Let me know if you hit any issues!', explanation: 'Неформальный стиль: сокращения, фразовые глаголы, прямота, восклицательные знаки допустимы' }
      ],
      solution: 'Правильные ответы:\n1. Dear [Client Name],\n2. Hey team! Quick reminder: please update your local dev setup to match the new docs. Check the updated README for details. Let me know if you hit any issues!',
      hint: 'Формальный: полные формы, пассив, длинные предложения, нейтральная лексика. Неформальный: сокращения, фразовые глаголы, короткие предложения, сленг допустим.',
      explanation: 'Умение переключаться между регистрами — признак языковой зрелости. В IT это критически важно: неправильный тон в письме клиенту или на митинге может навредить профессиональной репутации.'
    },
    {
      id: 7,
      title: 'Практика: написание инцидент-репорта',
      type: 'practice',
      difficulty: 'hard',
      description: 'Напишите два варианта описания инцидента: внутренний (Slack) и внешний (email клиенту).',
      requirements: [
        'Внутренний: быстрый Slack-пост для команды — неформально, с деталями',
        'Внешний: email клиенту — формально, без технического жаргона',
        'Оба должны передавать одну и ту же информацию'
      ],
      hint: 'Инцидент: оплата не работала с 14:00 до 15:30 из-за ошибки в деплое. Затронуто ~200 пользователей. Откатились на предыдущую версию.',
      solution: 'INTERNAL (Slack):\n@channel Heads up: payment service was down 14:00–15:30 UTC. Root cause: the v2.4.1 deploy introduced a regression in the payment processor integration. We rolled back to v2.4.0 and service is fully restored. ~200 users affected. I\'m writing up the postmortem now — will share in #incidents. Let\'s do a proper RCA tomorrow at 10 AM.\n\nEXTERNAL (Email to Client):\nDear Valued Customer,\n\nWe are writing to inform you that our payment processing service experienced an interruption between 14:00 and 15:30 UTC today. During this period, payment transactions could not be completed.\n\nWe have now fully resolved the issue and restored service. We have confirmed that no payment data was lost during this period.\n\nWe sincerely apologise for the inconvenience caused to you and your customers. We are conducting a thorough investigation to prevent similar incidents in the future and will share a full report within 48 hours.\n\nIf you have any questions or concerns, please do not hesitate to contact us.\n\nKind regards,\nThe Engineering Team',
      explanation: 'Внутреннее сообщение быстрое, техническое, с деталями для команды. Внешнее — официальное, без жаргона, сфокусированное на влиянии на клиента и мерах по исправлению. Оба важны и требуют разных навыков.'
    }
  ]
}
