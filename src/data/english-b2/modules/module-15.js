export default {
  id: 15,
  title: 'Продвинутые фразовые глаголы',
  description: 'IT-фразовые глаголы: phase in/out, ramp up, spin off, drill down, circle back, double down',
  lessons: [
    {
      id: 1,
      title: 'Фразовые глаголы для управления проектами',
      type: 'theory',
      content: [
        { type: 'text', value: 'Фразовые глаголы — неотъемлемая часть делового и IT-английского. Без них речь звучит как переведённая с русского. Изучайте их в контексте, не по словарю.' },
        { type: 'heading', value: 'Phase in / Phase out — постепенно вводить/выводить' },
        { type: 'text', value: '"We are phasing out the legacy API over the next two quarters."\n"The new authentication system will be phased in gradually, starting with 5% of users."\n"The deprecation roadmap shows how we plan to phase out version 1.x."' },
        { type: 'heading', value: 'Ramp up — наращивать, разгонять' },
        { type: 'text', value: '"We need to ramp up our infrastructure before the product launch."\n"The new developer is ramping up quickly — she made her first contribution in week two."\n"Traffic is ramping up faster than expected, so we\'re scaling out the fleet."' },
        { type: 'heading', value: 'Roll out — внедрять, выпускать' },
        { type: 'text', value: '"We\'re rolling out the new feature to 10% of users this week."\n"The update was rolled out to all regions over a 48-hour window."\n"The rollout was paused after we detected elevated error rates."' },
        { type: 'heading', value: 'Roll back — откатывать' },
        { type: 'text', value: '"We had to roll back the deployment after it caused a spike in error rates."\n"Always have a rollback plan before deploying to production."\n"The database migration was rolled back when data inconsistencies were detected."' }
      ]
    },
    {
      id: 2,
      title: 'Фразовые глаголы для обсуждений и совещаний',
      type: 'theory',
      content: [
        { type: 'text', value: 'Эти глаголы вы услышите на каждом standup, sprint planning и архитектурном обсуждении.' },
        { type: 'heading', value: 'Circle back — вернуться к теме позже' },
        { type: 'text', value: '"Let\'s circle back to this after we\'ve gathered more data."\n"Can we circle back to the authentication issue in the second half of the meeting?"\n"I\'ll circle back with you once I\'ve reviewed the proposal."' },
        { type: 'heading', value: 'Drill down — углубиться, детализировать' },
        { type: 'text', value: '"Let\'s drill down into the performance metrics for this endpoint."\n"If we drill down into the error logs, we can see the root cause."\n"The dashboard allows you to drill down from a summary to individual request traces."' },
        { type: 'heading', value: 'Double down — удвоить усилия, усилить ставку' },
        { type: 'text', value: '"Instead of changing our approach, we\'re doubling down on the current strategy."\n"After the positive user feedback, we\'re doubling down on the AI features."\n"He doubled down on his architectural decision despite the team\'s concerns."' },
        { type: 'heading', value: 'Touch base — быстро пообщаться, уточнить' },
        { type: 'text', value: '"Can we touch base tomorrow morning before the standup?"\n"I\'ll touch base with the product team to align on the requirements."\n"Let\'s touch base at end of day to see how the migration is progressing."' }
      ]
    },
    {
      id: 3,
      title: 'Фразовые глаголы для технических задач',
      type: 'theory',
      content: [
        { type: 'text', value: 'Технические обсуждения насыщены фразовыми глаголами, которые часто нельзя заменить одним словом.' },
        { type: 'heading', value: 'Spin up / Spin off — запускать / выделять' },
        { type: 'text', value: '"We spun up a new EC2 instance to handle the increased load."\n"The team was spun off from the main engineering org to focus on the new product."\n"It takes less than 60 seconds to spin up a new container."' },
        { type: 'heading', value: 'Set up / Take down' },
        { type: 'text', value: '"Let me set up a local development environment for you."\n"We set up monitoring before the launch."\n"The test environment was taken down after the regression suite completed."' },
        { type: 'heading', value: 'Break down / Break up' },
        { type: 'text', value: '"Let\'s break down this large ticket into smaller subtasks."\n"The monolith was broken up into microservices over six months."\n"The task breaks down into three phases: analysis, implementation, and testing."' },
        { type: 'heading', value: 'Iron out — устранять, сглаживать' },
        { type: 'text', value: '"We still need to iron out a few bugs before the release."\n"Let\'s iron out the details of the API contract in today\'s meeting."\n"The team is working to iron out the performance issues."' }
      ]
    },
    {
      id: 4,
      title: 'Фразовые глаголы для карьеры и команды',
      type: 'theory',
      content: [
        { type: 'text', value: 'Эти фразовые глаголы используются в контексте карьерного роста, командной работы и hr-коммуникации.' },
        { type: 'heading', value: 'Onboard / Offboard' },
        { type: 'text', value: '"The new senior engineer was onboarded to the platform team last week."\n"Onboarding a new developer takes about two weeks with our current setup."\n"When an employee is offboarded, their access should be revoked immediately."' },
        { type: 'heading', value: 'Step up / Step back' },
        { type: 'text', value: '"She stepped up when the tech lead went on parental leave."\n"Sometimes you need to step back and see the big picture."\n"He stepped up to the challenge of redesigning the entire data pipeline."' },
        { type: 'heading', value: 'Burn out / Burn down' },
        { type: 'text', value: '"The team is starting to burn out from constant overtime."\n"The sprint burndown chart shows we\'re on track to complete all stories."\n"Preventing burnout requires sustainable pace and proper work-life balance."' },
        { type: 'heading', value: 'Level up — повышать уровень' },
        { type: 'text', value: '"This project will help you level up your Kubernetes skills."\n"The engineering ladder defines what it takes to level up from senior to staff."\n"We invest in training to help our engineers level up."' }
      ]
    },
    {
      id: 5,
      title: 'Фразовые глаголы: code и deployment',
      type: 'theory',
      content: [
        { type: 'text', value: 'В повседневной работе разработчика эти фразовые глаголы используются постоянно.' },
        { type: 'heading', value: 'Check in / Check out' },
        { type: 'text', value: '"Don\'t forget to check in your changes before leaving for the day."\n"I checked out a new branch to work on the feature."\n"Check out the new performance improvements in the latest release."' },
        { type: 'heading', value: 'Pull in / Push out' },
        { type: 'text', value: '"Can we pull this feature into the current sprint?"\n"The release was pushed out to next week due to QA findings."\n"We pull in changes from upstream regularly to avoid large merge conflicts."' },
        { type: 'heading', value: 'Cut — выпускать' },
        { type: 'text', value: '"We\'re cutting a hotfix release today."\n"The release was cut from the main branch after all tests passed."\n"When do you plan to cut v3.0?"' },
        { type: 'heading', value: 'Tear down / Build out' },
        { type: 'text', value: '"After the demo, we tear down the demo environment to save costs."\n"We\'re building out the observability stack this quarter."\n"The infrastructure team is building out a self-service platform for developers."' },
        { type: 'tip', value: 'Совет по изучению фразовых глаголов: читайте Slack-каналы и PR-обсуждения в open-source репозиториях на GitHub. Там они используются в естественном контексте.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: фразовые глаголы в диалоге',
      type: 'practice',
      difficulty: 'medium',
      description: 'Используйте подходящие фразовые глаголы в диалоге стендапа.',
      requirements: [
        'Замените выделенные слова/фразы подходящими фразовыми глаголами',
        'Диалог должен звучать естественно',
        'Используйте правильное время'
      ],
      questions: [
        { text: 'Replace with phrasal verbs:\n"Yesterday we gradually removed the old authentication service. Today we\'re increasing our monitoring capacity. Tomorrow we plan to investigate the performance issue more deeply and return to it after the sprint review."\n→', answer: 'Yesterday we phased out the old authentication service. Today we\'re ramping up our monitoring capacity. Tomorrow we plan to drill down into the performance issue and circle back to it after the sprint review.', explanation: 'phase out = gradually remove; ramp up = increase capacity/speed; drill down = investigate in depth; circle back = return to later' }
      ],
      solution: 'Правильные ответы:\n1. Yesterday we phased out the old authentication service. Today we\\\'re ramping up our monitoring capacity. Tomorrow we plan to drill down into the performance issue and circle back to it after the sprint...',
      hint: 'Подберите фразовый глагол, который наиболее точно передаёт смысл: постепенность (phase out/in), нарастание (ramp up), углубление (drill down), возврат к теме (circle back).',
      explanation: 'Фразовые глаголы — основной признак fluent speaker. В международных командах их естественное использование показывает, что вы владеете языком, а не только знаете его правила.'
    },
    {
      id: 7,
      title: 'Практика: phrasal verbs в context',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напишите update для стендапа, используя минимум 8 фразовых глаголов из этого модуля.',
      requirements: [
        'Используйте минимум 8 фразовых глаголов',
        'Формат: Yesterday / Today / Blockers',
        'Длина: 6-8 предложений'
      ],
      hint: 'Standup структура: что сделал вчера, что делаешь сегодня, какие блокеры есть.',
      solution: 'Yesterday: I finished phasing out the old payment SDK and rolled out the new one to our staging environment. I also drilled down into the timeout errors we\'ve been seeing and identified the root cause — a misconfigured connection pool. I touched base with the DevOps team about ramping up the connection pool limit.\n\nToday: I\'m going to spin up a test environment to verify the fix, then break down the remaining migration tasks into smaller subtasks. I also need to circle back to the API versioning discussion from last week\'s meeting.\n\nBlockers: The infrastructure team hasn\'t spun up the new Redis instance yet. I\'ve followed up with them but may need to escalate. Otherwise, I\'m on track to cut the hotfix release by end of day.',
      explanation: 'Standup updates с фразовыми глаголами звучат естественно и профессионально. Это демонстрирует fluency и облегчает коммуникацию в международных командах.'
    },
    {
      id: 8,
      title: 'Практика: тест на фразовые глаголы',
      type: 'practice',
      difficulty: 'medium',
      description: 'Определите правильный фразовый глагол для каждого контекста.',
      requirements: [
        'Выберите наиболее подходящий фразовый глагол',
        'Объясните выбор',
        'Слова для выбора: spin up, phase out, drill down, circle back, ramp up, roll back, double down, iron out'
      ],
      questions: [
        { text: 'The deployment caused errors. We need to ___ to the previous version immediately.', answer: 'roll back', explanation: 'Roll back = вернуться к предыдущей версии после неудачного деплоя' },
        { text: 'I don\'t have enough information to decide now. Let\'s ___ to this topic in tomorrow\'s meeting.', answer: 'circle back', explanation: 'Circle back = вернуться к теме позже, когда будет больше информации' },
        { text: 'Before the product launch, we need to ___ our server capacity.', answer: 'ramp up', explanation: 'Ramp up = наращивать мощность/ресурсы перед ростом нагрузки' }
      ],
      solution: 'Правильные ответы:\n1. roll back\n2. circle back\n3. ramp up',
      hint: 'Контекст определяет выбор: технические действия (roll back, spin up), общение (circle back, touch base), масштабирование (ramp up, scale up), постепенные изменения (phase in/out).',
      explanation: 'Фразовые глаголы часто не заменяются одним словом — они несут нюанс. Roll back подразумевает revertion после ошибки; circle back — намеренный отложенный возврат к теме.'
    }
  ]
}
