export default {
  id: 16,
  title: 'Бизнес-английский для IT',
  description: 'Деловая лексика IT: stakeholder, ROI, OKR, roadmap, alignment, bandwidth, prioritisation',
  lessons: [
    {
      id: 1,
      title: 'Strategy vocabulary: OKR, roadmap, alignment',
      type: 'theory',
      content: [
        { type: 'text', value: 'Стратегическая лексика — то, что отличает разработчика от инженера, способного влиять на продуктовые решения.' },
        { type: 'heading', value: 'OKR — Objectives and Key Results' },
        { type: 'text', value: '"OKRs align individual and team goals with company-level objectives."\n"Objective: Improve system reliability. Key Result: Achieve 99.99% uptime."\n"OKRs are set quarterly and should be ambitious — 70% completion is considered a success."\n"Our team\'s OKR for Q3 is to reduce mean time to recovery (MTTR) by 50%."' },
        { type: 'heading', value: 'Roadmap' },
        { type: 'text', value: '"A roadmap is a strategic plan that outlines the direction and timeline for a product or project."\n"The roadmap prioritises features based on business value and technical feasibility."\n"We present the roadmap to stakeholders quarterly to ensure alignment."\n"The roadmap is not a commitment — it is a living document that evolves with priorities."' },
        { type: 'heading', value: 'Alignment' },
        { type: 'text', value: '"Alignment means ensuring all stakeholders share the same understanding and goals."\n"We need to get alignment from the product and engineering teams before starting this initiative."\n"Misalignment on requirements is one of the most common causes of project failure."\n"Are we aligned on the definition of done for this feature?"' }
      ]
    },
    {
      id: 2,
      title: 'Financial vocabulary: ROI, TCO, budget, headcount',
      type: 'theory',
      content: [
        { type: 'text', value: 'Senior-инженеры должны понимать бизнес-контекст своих технических решений.' },
        { type: 'heading', value: 'ROI — Return on Investment' },
        { type: 'text', value: '"ROI measures the financial return relative to the cost of an investment."\n"The ROI of migrating to the cloud is difficult to quantify but includes reduced operational overhead."\n"We need to demonstrate ROI to justify the refactoring investment."\n"What is the expected ROI of this infrastructure upgrade?"' },
        { type: 'heading', value: 'TCO — Total Cost of Ownership' },
        { type: 'text', value: '"TCO includes all costs associated with owning and operating a system over its lifetime."\n"When comparing build vs buy, TCO is more informative than initial cost alone."\n"The TCO of the legacy system includes not just maintenance but also the opportunity cost of slower development velocity."' },
        { type: 'heading', value: 'Budget и headcount' },
        { type: 'text', value: '"We\'re operating within a constrained budget this quarter."\n"Headcount: the number of people on the team — often used as a measure of team capacity."\n"We\'re requesting additional headcount to support the new initiative."\n"The project is underfunded — we need to either reduce scope or increase the budget."' }
      ]
    },
    {
      id: 3,
      title: 'Stakeholder management',
      type: 'theory',
      content: [
        { type: 'text', value: 'Управление стейкхолдерами — ключевой навык для senior-инженеров и tech leads.' },
        { type: 'heading', value: 'Stakeholder' },
        { type: 'text', value: '"A stakeholder is anyone with an interest in the outcome of a project."\n"Internal stakeholders: engineering, product, design, marketing, legal."\n"External stakeholders: customers, partners, regulators."\n"Stakeholder mapping: identifying stakeholders and their level of influence and interest."' },
        { type: 'heading', value: 'Managing up' },
        { type: 'text', value: '"Managing up means proactively communicating with your manager and leadership."\n"Senior engineers are expected to manage up — don\'t wait for your manager to ask for updates."\n"Escalate early: if there\'s a risk to delivery, surface it immediately."\n"Frame technical concerns in business terms when communicating with leadership."' },
        { type: 'heading', value: 'Buy-in' },
        { type: 'text', value: '"Buy-in means getting stakeholders to agree with and support a decision."\n"We need buy-in from the security team before launching this feature."\n"How do we get executive buy-in for this infrastructure investment?"\n"Building buy-in takes time — start conversations early."' },
        { type: 'tip', value: 'Золотое правило для stakeholder communication: "Bad news early is better than bad news late." Если что-то идёт не так — сообщайте немедленно, а не в день дедлайна.' }
      ]
    },
    {
      id: 4,
      title: 'Capacity и prioritisation',
      type: 'theory',
      content: [
        { type: 'text', value: 'Управление загрузкой команды — важная часть работы tech lead и senior-инженера.' },
        { type: 'heading', value: 'Bandwidth (в бизнес-контексте)' },
        { type: 'text', value: '"Bandwidth in a business context refers to a person\'s or team\'s available capacity."\n"I don\'t have the bandwidth to take on this project right now."\n"We need to assess the team\'s bandwidth before committing to this deliverable."\n"The team is at full bandwidth this sprint." (не о сети, а о загруженности)' },
        { type: 'heading', value: 'Prioritisation' },
        { type: 'text', value: '"Prioritisation is the process of ordering tasks by importance and urgency."\n"We use the MoSCoW method: Must have, Should have, Could have, Won\'t have."\n"The RICE framework scores features by Reach, Impact, Confidence, and Effort."\n"We cannot do everything — let\'s ruthlessly prioritise."' },
        { type: 'heading', value: 'Trade-off и opportunity cost' },
        { type: 'text', value: '"Every technical decision involves trade-offs."\n"Opportunity cost: the value of the next-best alternative you give up when making a decision."\n"If we spend 3 months on refactoring, the opportunity cost is 3 months of new features."\n"We need to be explicit about what we\'re NOT doing when we commit to something."' }
      ]
    },
    {
      id: 5,
      title: 'Delivery и velocity',
      type: 'theory',
      content: [
        { type: 'text', value: 'Лексика, связанная с доставкой ценности и скоростью команды.' },
        { type: 'heading', value: 'Delivery terms' },
        { type: 'text', value: '"Deliverable: a specific output or result that is expected from a project."\n"Milestone: a significant event or achievement in the project timeline."\n"MVP (Minimum Viable Product): the simplest version of a product that delivers value."\n"Time to market: the time from conception to product availability for customers."' },
        { type: 'heading', value: 'Velocity' },
        { type: 'text', value: '"Velocity in agile: the amount of work a team completes per sprint."\n"We use velocity to forecast how long the backlog will take to complete."\n"Technical debt is slowing our velocity — we need to address it."\n"Don\'t optimise for velocity at the expense of quality and sustainability."' },
        { type: 'heading', value: 'Bottleneck и dependencies' },
        { type: 'text', value: '"A bottleneck is the constraint that limits overall throughput."\n"The code review process is a bottleneck — PRs are waiting 3 days for review."\n"Dependencies: tasks that cannot start until other tasks are complete."\n"We need to identify and manage cross-team dependencies early."' }
      ]
    },
    {
      id: 6,
      title: 'Практика: business case',
      type: 'practice',
      difficulty: 'hard',
      description: 'Напишите краткий бизнес-кейс для технического решения, используя бизнес-лексику.',
      requirements: [
        'Используйте минимум 10 бизнес-терминов из модуля',
        'Структура: Problem → Proposed solution → ROI/value → Resources required → Risk',
        'Контекст: предложить миграцию с монолита на микросервисы'
      ],
      hint: 'Убедите стейкхолдеров, переведя технические преимущества на язык бизнеса: скорость разработки → time to market; независимые деплои → отдельные команды → больше headcount...',
      solution: 'BUSINESS CASE: Microservices Migration\n\nProblem: Our monolithic architecture has become a bottleneck for delivery velocity. The average time to market for new features has increased from 2 weeks to 8 weeks over the past year, directly impacting our competitive position. Developer bandwidth is consumed disproportionately by context switching and merge conflicts.\n\nProposed Solution: A phased migration to microservices over 18 months. We will start with the highest-value, most isolated services (payments, notifications) to demonstrate ROI early.\n\nBusiness Value: By decomposing the monolith, we expect to restore delivery velocity to 2 weeks per feature. This enables faster iteration and improved time to market. Independent deployments will allow teams to work in parallel without dependencies causing delays.\n\nResources Required: This initiative requires 4 senior engineers and alignment from all stakeholder teams (product, QA, DevOps). The TCO of the transition includes an estimated 6 months of reduced feature output during migration.\n\nRisks and Trade-offs: The primary risk is temporary velocity reduction during transition. We mitigate this by maintaining the monolith in parallel. We need buy-in from leadership to protect the team\'s bandwidth during this period.\n\nRecommendation: We recommend proceeding with Phase 1 (payments service extraction) in Q2 to validate the approach and demonstrate ROI before full commitment.',
      explanation: 'Умение писать business cases — навык, который отличает tech lead от senior-инженера. Технические решения нужно формулировать в терминах бизнес-ценности, ROI и рисков.'
    },
    {
      id: 7,
      title: 'Практика: stakeholder update email',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напишите email-обновление для стейкхолдеров о статусе проекта.',
      requirements: [
        'Формат: Subject, Status (на треке/за треком), Highlights, Risks, Next steps',
        'Тон: профессиональный, но не технический (аудитория — не инженеры)',
        'Используйте бизнес-лексику, избегайте технического жаргона'
      ],
      hint: 'Stakeholder updates должны отвечать на вопрос: "Are we on track to deliver, and if not, what do we need?" Фокус на бизнес-влиянии, а не технических деталях.',
      solution: 'Subject: Q2 Platform Reliability Initiative — Weekly Status Update\n\nStatus: ON TRACK\n\nHighlights this week:\n- System uptime improved to 99.94% (from 99.7% at the start of Q2), moving us toward our OKR target of 99.99%\n- Completed migration of 3 critical services to the new infrastructure (ahead of milestone schedule)\n- Successfully onboarded 2 new team members — both ramping up quickly\n\nRisks and Concerns:\n- The database migration (originally planned for Week 6) has been pushed out to Week 8 due to a dependency on the security team\'s review. This does not impact the Q2 OKR target but reduces our buffer.\n- We are at full bandwidth this sprint. Any additional requests should be flagged early for prioritisation.\n\nNext Steps:\n- Begin Phase 2 rollout starting Monday\n- Scheduled alignment meeting with the product team on Thursday to review the roadmap for Q3\n\nBudget: We are within budget for Q2. A headcount request for Q3 will be submitted by end of month.\n\nPlease let me know if you have any questions or concerns.',
      explanation: 'Stakeholder updates — один из важнейших коммуникационных навыков для senior-инженеров. Хороший update: краткий, структурированный, честный о рисках, написан на языке аудитории.'
    }
  ]
}
