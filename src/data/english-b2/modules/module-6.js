export default {
  id: 6,
  title: 'Advanced Modal Verbs',
  description: 'Продвинутые модальные глаголы: must have been, could have done, должны и предположения',
  lessons: [
    {
      id: 1,
      title: 'Модальные глаголы + have + Past Participle: логические выводы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Конструкция "modal + have + Past Participle" используется для рассуждений о прошлых событиях. Это крайне важно в IT при анализе инцидентов, code review и обсуждении прошлых решений.' },
        { type: 'heading', value: 'Must have + Past Participle — уверенный вывод о прошлом' },
        { type: 'text', value: '"The server must have run out of memory — look at the OOM logs." (мы уверены на 95%+)\n"Someone must have pushed directly to main without going through the PR process."\n"The configuration must have been overwritten during the deployment."' },
        { type: 'heading', value: 'Can\'t/Couldn\'t have — невозможность в прошлом' },
        { type: 'text', value: '"The bug can\'t have been introduced today — this code hasn\'t changed in weeks."\n"She couldn\'t have approved the PR — she was on vacation all last week."\n"The data can\'t have been corrupted at the source — checksums match."' },
        { type: 'heading', value: 'May/Might have — слабая вероятность в прошлом' },
        { type: 'text', value: '"The spike in traffic might have caused the slowdown."\n"We may have introduced a memory leak in the last refactoring."\n"The issue might have been triggered by the timezone change."' },
        { type: 'heading', value: 'Could have — возможность в прошлом (нереализованная)' },
        { type: 'text', value: '"We could have implemented this more efficiently using a hash map."\n"The outage could have been avoided with proper monitoring in place."' }
      ]
    },
    {
      id: 2,
      title: 'Should have / Ought to have — упрёк и рекомендации',
      type: 'theory',
      content: [
        { type: 'text', value: '"Should have + Past Participle" выражает, что что-то нужно было сделать, но не было сделано. Незаменимо в постмортемах и code review.' },
        { type: 'heading', value: 'Should have — что должны были сделать' },
        { type: 'text', value: '"We should have written tests before refactoring." (но не написали)\n"The team should have reviewed the security implications before deploying."\n"I should have checked the database indexes — the query is doing a full scan."' },
        { type: 'heading', value: 'Shouldn\'t have — что не должны были делать' },
        { type: 'text', value: '"We shouldn\'t have deployed on Friday afternoon." (но задеплоили)\n"You shouldn\'t have merged without code review — that\'s how bugs get into production."\n"The config shouldn\'t have been committed to the repository."' },
        { type: 'heading', value: 'Ought to have — более формальный аналог should have' },
        { type: 'text', value: '"The team ought to have followed the established deployment procedures."\n"This architecture decision ought to have been documented in the ADR."' },
        { type: 'tip', value: 'В postmortem документах "should have" — стандартная формулировка для рекомендаций и анализа ошибок. Это звучит профессионально и не обвинительно: "The monitoring should have been configured to detect this type of failure."' }
      ]
    },
    {
      id: 3,
      title: 'Need not have vs Didn\'t need to',
      type: 'theory',
      content: [
        { type: 'text', value: 'Тонкое различие между двумя конструкциями, которое часто путают.' },
        { type: 'heading', value: 'Needn\'t have + Past Participle — сделали, но не нужно было' },
        { type: 'text', value: '"We needn\'t have rewritten the entire service — a small patch would have fixed the issue."\n(Мы переписали весь сервис, но это было не нужно)\n\n"You needn\'t have optimised that query — the bottleneck was elsewhere."\n(Оптимизировали запрос, но это не было нужно)' },
        { type: 'heading', value: 'Didn\'t need to — не нужно было, и не сделали' },
        { type: 'text', value: '"We didn\'t need to refactor the code, so we focused on new features instead."\n(Не нужно было, и мы этого не делали)\n\n"She didn\'t need to attend the meeting — the decision had already been made."' },
        { type: 'tip', value: 'Ключевое различие:\n"We needn\'t have optimised it" → оптимизировали (зря)\n"We didn\'t need to optimise it" → не оптимизировали (правильно решили)' }
      ]
    },
    {
      id: 4,
      title: 'Would have, Could have в условных конструкциях',
      type: 'theory',
      content: [
        { type: 'text', value: 'Эти конструкции уже встречались в теме смешанных условных, но здесь мы рассмотрим их подробнее.' },
        { type: 'heading', value: 'Would have — следствие нереального условия в прошлом' },
        { type: 'text', value: '"If we had used Redis for caching, the response times would have been 10x faster."\n"The migration would have taken three days, not three weeks, had we prepared properly."\n"Without Kubernetes, we would have spent hours on manual deployments."' },
        { type: 'heading', value: 'Could have — возможность при другом раскладе' },
        { type: 'text', value: '"We could have shipped this feature in one sprint if the requirements had been clear from the start."\n"The bug could have been caught in code review if we had had more senior reviewers."' },
        { type: 'heading', value: 'Would have been able to — о способности' },
        { type: 'text', value: '"I would have been able to fix the issue faster if I had better knowledge of the legacy codebase."\n"The junior devs would have been able to contribute more if we had better documentation."' }
      ]
    },
    {
      id: 5,
      title: 'Modals for obligation, permission, advice в IT-контексте',
      type: 'theory',
      content: [
        { type: 'text', value: 'Модальные глаголы в настоящем времени также имеют тонкие различия, важные в IT-общении.' },
        { type: 'heading', value: 'Must vs Have to — обязательство' },
        { type: 'text', value: '"You must not store passwords in plain text." (строгое правило — нарушение недопустимо)\n"We have to meet the compliance requirements by Q4." (внешнее требование)\n"All PRs have to be reviewed before merging." (установленный процесс)' },
        { type: 'heading', value: 'Should vs Ought to — рекомендации' },
        { type: 'text', value: '"You should add error handling to every async function." (рекомендация)\n"The API response ought to include an error code and message." (несколько более формально)' },
        { type: 'heading', value: 'May vs Can — разрешение' },
        { type: 'text', value: '"You may use this library in your project." (официальное разрешение)\n"You can access the staging environment with your regular credentials." (практическая возможность)' },
        { type: 'heading', value: 'Had better — срочная рекомендация, предупреждение' },
        { type: 'text', value: '"You\'d better run the tests before committing — the CI pipeline will catch it anyway."\n"We\'d better address this vulnerability before the security audit."' },
        { type: 'tip', value: 'В RFC-документах используется специальная модальность: MUST (обязательно), SHOULD (рекомендуется), MAY (допустимо), MUST NOT (запрещено). Это стандарт RFC 2119.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: анализ инцидента',
      type: 'practice',
      difficulty: 'medium',
      description: 'Используйте модальные глаголы для анализа описанного инцидента.',
      requirements: [
        'Используйте must have, should have, could have, might have',
        'Опишите выводы и рекомендации',
        'Контекст: сервер упал в ночь пятницы'
      ],
      questions: [
        { text: 'The server crashed at 2 AM on Friday. Memory usage was at 99%. No alerts were sent.\nANALYSIS: What must have happened? What should the team have done? What could have prevented this?', answer: 'The server must have run out of memory — the OOM killer must have terminated processes. The team should have configured memory alerts before the crash threshold. The monitoring system should have been set up to alert at 85% memory usage, not just at critical levels. We could have prevented this outage by implementing a memory leak detection tool in the CI pipeline. The deployment on Friday must have introduced a memory leak. We shouldn\'t have deployed a new version late on a Friday without extended monitoring.', explanation: 'Анализ инцидентов требует точных модальных конструкций: уверенные выводы (must have), ошибки и рекомендации (should have / shouldn\'t have), нереализованные возможности (could have).' }
      ],
      solution: 'Правильные ответы:\n1. The server must have run out of memory — the OOM killer must have terminated processes. The team should have configured memory alerts before the crash threshold. The monitoring system should have been set up to alert at 85% memory usage, not just at critical levels. We could have prevented this outa',
      hint: 'Структура анализа: 1) Что произошло (must have), 2) Что было невозможно (can\'t have), 3) Что надо было сделать (should have), 4) Как можно было предотвратить (could have).',
      explanation: 'Точное использование модальных глаголов в постмортемах — признак профессионала. Оно позволяет чётко разграничить факты, выводы и рекомендации без обвинительного тона.'
    },
    {
      id: 7,
      title: 'Практика: code review комментарии',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напишите код-ревью комментарии, используя модальные глаголы правильно.',
      requirements: [
        'Используйте разные модальные глаголы для разных уровней критики',
        'Комментарии должны быть конструктивными',
        'Включите: must, should, could, might, need not have'
      ],
      hint: 'Распределите: "must" для блокирующих проблем, "should" для рекомендаций, "could" для предложений улучшения, "might" для осторожных предположений.',
      solution: 'BLOCKING: "This function must validate the input before processing — passing null will cause a NullPointerException."\n\nRECOMMENDATION: "You should extract this logic into a separate method — it\'s used in three places."\n\nSUGGESTION: "You could use Optional here instead of null checks to make the intent clearer."\n\nOPTIONAL: "You might want to consider adding a cache here — this lookup happens on every request."\n\nOVERWORK: "You needn\'t have reimplemented this sort algorithm — Collections.sort() would have done the job."',
      explanation: 'Профессиональный code review использует модальные глаголы для разграничения критики по важности. Must — блокирующее, should — рекомендация, could/might — предложение. Это уменьшает конфликтность и улучшает коммуникацию в команде.'
    }
  ]
}
