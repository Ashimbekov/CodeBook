export default {
  id: 18,
  title: 'Фразовые глаголы: IT-специфичные',
  description: 'IT фразовые глаголы: phase out, roll out, opt in/out, scale up/down, spin up, tear down, и другие. Идиомы и коллокации для IT-специалистов.',
  lessons: [
    {
      id: 1,
      title: 'Phase out, Roll out, Roll back',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'PHASE OUT (постепенно выводить из использования) — постепенно прекращать использование чего-либо.\n\n"Phase out" подчёркивает постепенность процесса.\n\nExamples:\n1. "We are phasing out the legacy API — it will be fully retired in Q4."\n2. "Python 2 was phased out in 2020."\n3. "We\'re phasing out on-premises servers in favour of the cloud."\n4. "The old authentication system is being phased out over the next six months."\n5. "We need to phase out this library as it\'s no longer maintained."\n\nФразы: "to phase something out", "to be phased out", "phasing out"\n\nROLL OUT (внедрять, постепенно запускать) — постепенно разворачивать функцию или обновление.\n\nExamples:\n1. "We\'re rolling out the new UI to 10% of users first."\n2. "The feature will be rolled out gradually to avoid overwhelming support."\n3. "We rolled out the update across all regions last week."\n4. "The new pricing model is being rolled out to enterprise customers first."\n5. "We use feature flags to control the rollout."\n\nРАЗНИЦА:\n"Phase out" = убираем старое. "Roll out" = внедряем новое.'
        },
        {
          type: 'text',
          value: 'ROLL BACK (откатывать) — возвращаться к предыдущей версии.\n\nExamples:\n1. "We had to roll back the deployment after the error rate spiked."\n2. "The database migration was rolled back because it caused data issues."\n3. "Blue-green deployment makes it easy to roll back to the previous version."\n4. "We rolled back to version 2.3 while investigating the bug in 2.4."\n\nRE-ROLL (перезапускать, исправлять релиз):\n"We need to re-roll the release with the bug fix included."\n\nHAND OFF (передавать) — передать ответственность или работу:\n"The backend team will hand off the API documentation to the frontend team."\n"During on-call transition, we hand off any open incidents."\n\nMOCK UP (создавать прототип/макет):\n"The designer mocked up three different UI variants for testing."\n"Let me mock up a quick proof of concept before we commit to this approach."'
        }
      ]
    },
    {
      id: 2,
      title: 'Opt in, Opt out, Scale up, Scale down',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'OPT IN (соглашаться/подписываться) — добровольно участвовать.\nOPT OUT (отказываться) — отказаться от участия.\n\nExamples — Opt in:\n1. "Users who opt in to beta testing will receive new features first."\n2. "We only send marketing emails to users who have opted in."\n3. "Opt in to error reporting to help us improve the product."\n4. "The feature is opt-in — enable it in your account settings."\n\nExamples — Opt out:\n1. "Users can opt out of telemetry data collection."\n2. "Administrators can opt out of automatic updates."\n3. "You can opt out of the beta program at any time."\n4. "GDPR requires that users can easily opt out of data processing."\n\nКлючевые фразы:\n- "opt-in feature" (функция по подписке)\n- "opt-out mechanism" (механизм отказа)\n- "double opt-in" (двойное подтверждение)\n- "opt in by default" (включено по умолчанию)'
        },
        {
          type: 'text',
          value: 'SCALE UP (масштабировать вверх) — увеличить ресурсы/возможности.\nSCALE DOWN (масштабировать вниз) — уменьшить ресурсы.\n\nExamples — Scale up:\n1. "We need to scale up the database before the product launch."\n2. "The team scaled up from 3 to 15 engineers in one year."\n3. "We scaled up our infrastructure to handle the traffic spike."\n4. "The startup scaled up quickly after receiving Series A funding."\n5. "We scaled up the number of worker processes to handle the queue backlog."\n\nExamples — Scale down:\n1. "After the traffic spike, we scaled down to reduce costs."\n2. "We scale down overnight when traffic is low."\n3. "The auto-scaler scaled down from 20 to 5 instances after peak hours."\n\nSCALE OUT (добавить серверы) vs SCALE UP (добавить ресурсы одному серверу):\n"We scale out by adding more server instances, not scale up by using bigger servers."\n"Scaling out is more cost-effective for stateless applications."'
        }
      ]
    },
    {
      id: 3,
      title: 'Spin up, Tear down, Bring up, Take down',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'SPIN UP (запустить, поднять) — запустить новый сервер, контейнер или сервис.\n\nExamples:\n1. "We can spin up a new environment in minutes using Terraform."\n2. "The auto-scaler spun up 10 additional instances to handle the traffic."\n3. "Spin up a local Docker container to test the new feature."\n4. "It took 30 seconds to spin up a new Kubernetes pod."\n5. "We spin up a fresh environment for each PR to run integration tests."\n\nTEAR DOWN (уничтожить, остановить) — остановить и удалить инфраструктуру.\n\nExamples:\n1. "After the PR is merged, the environment is automatically torn down."\n2. "We tear down the staging environment on weekends to save costs."\n3. "The test suite spins up containers before testing and tears them down after."\n4. "Terraform can tear down the entire infrastructure with one command."\n\nBRING UP / BRING DOWN:\n"Bring up" = запустить сервис. "Bring down" = остановить.\n"The on-call engineer brought up the service after the incident."\n"We brought down the service for scheduled maintenance."'
        },
        {
          type: 'text',
          value: 'SET UP (настраивать) — конфигурировать или устанавливать.\n\nExamples:\n1. "Let me set up a local development environment for you."\n2. "We need to set up monitoring before the launch."\n3. "Setting up the CI/CD pipeline took two days."\n4. "She set up the project from scratch, including the infrastructure."\n\nBOOT UP (загрузиться) — запуститься, загрузиться.\n"The server boots up in 45 seconds."\n"After the restart, all services boot up automatically."\n\nSHUT DOWN (выключить) — корректно остановить.\n"We shut down the old server after migrating all data."\n"The application gracefully shuts down when it receives a SIGTERM signal."\n\nWRITE UP (написать отчёт/документ):\n"Can you write up the post-mortem and share it with the team?"\n"I\'ll write up the technical specification for the new feature."'
        }
      ]
    },
    {
      id: 4,
      title: 'IT Идиомы: "hit the ground running" и другие',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'IT ИДИОМЫ — устойчивые выражения, широко используемые в технологической среде.\n\nHIT THE GROUND RUNNING — начать продуктивно работать с первого дня.\n\n"We need someone who can hit the ground running — no time for extended onboarding."\n"She hit the ground running and delivered her first feature in week one."\n"As an experienced developer, he hit the ground running at the new company."\n\nMOVE THE NEEDLE — добиться заметного прогресса, изменить показатели.\n\n"This optimisation doesn\'t move the needle — let\'s focus on bigger improvements."\n"We need features that move the needle on user retention."\n"Does this work actually move the needle on performance?"\n"Adding one more developer won\'t move the needle on our velocity."\n\nLOW-HANGING FRUIT — лёгкие, быстро реализуемые задачи.\n\n"Let\'s pick the low-hanging fruit first before tackling complex features."\n"The performance improvements are low-hanging fruit — we can implement them in a day."\n"We always start with low-hanging fruit to show quick wins to stakeholders."\n"Fixing typos in the docs is low-hanging fruit, but it doesn\'t add business value."'
        },
        {
          type: 'text',
          value: 'TECHNICAL DEBT — технический долг: накопленные компромиссы в коде.\n\n"We\'ve accumulated so much technical debt that new features take twice as long."\n"Let\'s allocate 20% of each sprint to paying off technical debt."\n"This quick fix will add to our technical debt — we\'ll need to refactor later."\n"The codebase is drowning in technical debt after years of cutting corners."\n\nSPAGHETTI CODE — запутанный, неструктурированный код.\n\n"This module is spaghetti code — nobody understands how it works."\n"The legacy system is full of spaghetti code that\'s impossible to maintain."\n"We need to untangle this spaghetti code before adding new features."\n\nBAND-AID FIX — временное, поверхностное решение проблемы.\n\n"This is a band-aid fix — we need to address the root cause."\n"We\'ve been applying band-aid fixes instead of solving the real issue."\n\nBOILING THE OCEAN — пытаться решить слишком большую задачу сразу.\n\n"We\'re boiling the ocean — let\'s break this into smaller pieces."\n"Don\'t boil the ocean; start with an MVP and iterate."'
        }
      ]
    },
    {
      id: 5,
      title: 'Больше IT идиом: pain points, bottleneck, rubber duck',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'PAIN POINT — болевая точка, проблема пользователя или команды.\n\n"The main pain point for our users is the slow checkout process."\n"What are the biggest pain points in your current development workflow?"\n"We identified three major pain points through user research."\n"This feature directly addresses the pain point of manual data entry."\n\nBOTTLENECK — узкое место, ограничивающее производительность.\n\n"The database is the bottleneck — all other services are waiting for it."\n"We identified the bottleneck using profiling tools."\n"Fixing the bottleneck in the query reduced response time by 90%."\n"The code review process is a bottleneck — PRs wait too long for review."\n\nRUBBER DUCK DEBUGGING — объяснять проблему воображаемой утке, чтобы найти решение.\n\n"I was rubber duck debugging and explained the problem out loud — then I saw the issue."\n"When stuck, try rubber duck debugging: explain your code step by step."\n\nBIKE-SHEDDING (BIKESHEDDING) — спорить о мелких, незначительных деталях.\n\n"We spent an hour bikeshedding about variable names instead of discussing the architecture."\n"Don\'t bikeshed — the button color doesn\'t matter as much as the core functionality."'
        },
        {
          type: 'text',
          value: 'Больше полезных IT идиом:\n\nGARBAGE IN, GARBAGE OUT (GIGO) — плохие входные данные дают плохие результаты.\n"The model\'s predictions are poor because of bad training data — garbage in, garbage out."\n\nSHIP IT — выпустить функцию/продукт.\n"The feature is good enough. Ship it!"\n"We have a \'ship it\' culture — we prefer done over perfect."\n\nGReen FIELD vs BROWN FIELD:\nGreen field — разработка с нуля: "We\'re doing green field development — no legacy constraints."\nBrown field — работа с существующей системой: "Brown field development means working around legacy code."\n\nYAK SHAVING — выполнять мелкие задачи, кажущиеся необходимыми, но далёкие от цели.\n"I started fixing a bug but ended up yak shaving — updating dependencies, fixing CI, etc."\n\nCONWAY\'S LAW — архитектура системы отражает структуру команды.\n"Conway\'s Law suggests that our microservices architecture will reflect our team structure."'
        }
      ]
    },
    {
      id: 6,
      title: 'Коллокации: make, run, raise, close, deploy',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'КОЛЛОКАЦИИ — устойчивые сочетания слов, которые звучат естественно.\n\nMAKE + noun:\n- make a commit — сделать коммит\n- make a change — внести изменение\n- make a request — сделать запрос\n- make a decision — принять решение\n- make a trade-off — пойти на компромисс\n- make progress — добиться прогресса\n- make a mistake — совершить ошибку\n- make an assumption — сделать допущение\n\nExamples:\n1. "I made three commits this morning fixing the authentication bug."\n2. "We need to make a decision about the database before starting development."\n3. "We made several assumptions about user behaviour that turned out to be wrong."\n\nRUN + noun:\n- run tests — запускать тесты\n- run a deployment — выполнять деплой\n- run a migration — выполнять миграцию\n- run a script — запускать скрипт\n- run a query — выполнять запрос\n- run a pipeline — запускать пайплайн\n- run a meeting — вести митинг\n\nExamples:\n1. "Run the tests before pushing your changes."\n2. "She runs the daily standup for the team."\n3. "We run database migrations as part of the deployment process."'
        },
        {
          type: 'text',
          value: 'RAISE + noun:\n- raise an issue — поднять проблему / создать тикет\n- raise a pull request — создать PR\n- raise a concern — высказать опасение\n- raise a question — задать вопрос\n- raise a ticket — создать тикет\n- raise the alarm — поднять тревогу\n- raise awareness — повысить осведомлённость\n\nExamples:\n1. "Please raise an issue in Jira if you find a bug."\n2. "She raised a concern about the security implications of this approach."\n3. "He raised a pull request for the feature branch."\n4. "The monitoring system raised an alarm when the CPU hit 95%."\n\nCLOSE + noun:\n- close a ticket — закрыть тикет\n- close a PR — закрыть PR\n- close an issue — закрыть задачу\n- close the gap — устранить разрыв\n\nExamples:\n1. "Please close the ticket once the fix is deployed and verified."\n2. "The PR was closed without merging because the approach was changed."\n\nDEPLOY TO + place:\n- deploy to production\n- deploy to staging\n- deploy to the cloud\n\nExamples:\n1. "We deploy to production every Tuesday after successful staging tests."\n2. "The hotfix was deployed to production within 20 minutes."'
        }
      ]
    },
    {
      id: 7,
      title: 'Ещё коллокации и практика',
      type: 'practice',
      content: [
        {
          type: 'text',
          value: 'Больше важных IT коллокаций:\n\nWRITE + noun:\n- write code — писать код\n- write tests — писать тесты\n- write documentation — писать документацию\n- write a specification — писать спецификацию\n- write a query — писать запрос\n\nFIX + noun:\n- fix a bug — исправить баг\n- fix an issue — исправить проблему\n- fix a typo — исправить опечатку\n\nREVIEW + noun:\n- review code — ревьюить код\n- review a pull request — ревьюить PR\n- review requirements — проверять требования\n\nMERGE + noun:\n- merge a pull request — вмержить PR\n- merge branches — смержить ветки\n- merge conflicts — конфликты при слиянии\n\nBREAK + noun:\n- break a build — сломать сборку\n- break backward compatibility — сломать обратную совместимость\n- break a feature — сломать функциональность\n\nExamples в контексте:\n1. "I need to write tests for this function before I merge the PR."\n2. "She reviewed the code and found a potential memory leak."\n3. "The merge conflicts took an hour to resolve."\n4. "This change will break backward compatibility for clients using v1."'
        },
        {
          type: 'text',
          value: 'Практика — заполните пропуски нужными словами:\n\n1. We need to _____ out the legacy authentication system before the end of the quarter.\n→ phase\n\n2. Can you _____ up a test environment so I can verify the fix?\n→ spin\n\n3. The new feature is being _____ out to 5% of users initially.\n→ rolled\n\n4. Please _____ the ticket once you\'ve verified the fix in production.\n→ close\n\n5. The intern hit the ground _____ and delivered his first feature in week one.\n→ running\n\n6. We should address the low-_____ fruit before tackling the complex refactoring.\n→ hanging\n\n7. The team has been _____ up technical debt for years by skipping code reviews.\n→ building\n\n8. After the incident, the team _____ down the affected service and investigated the root cause.\n→ brought\n\n9. We _____ an issue in GitHub to track the bug.\n→ raised\n\n10. Let\'s not _____ the ocean — let\'s focus on the MVP first.\n→ boil'
        },
        {
          type: 'text',
          value: 'Переведите на английский, используя правильные коллокации:\n\n1. Нам нужно запустить тесты перед мержем в мейн.\n→ We need to run the tests before merging into main.\n\n2. Она создала PR и попросила двух коллег проревьюить код.\n→ She raised a pull request and asked two colleagues to review the code.\n\n3. Давай постепенно выводим это API — оно устарело и не поддерживается.\n→ Let\'s phase out this API — it\'s deprecated and no longer maintained.\n\n4. Деплой в продакшн запланирован на пятницу после обеда.\n→ The deployment to production is scheduled for Friday afternoon.\n\n5. Команда запустила новый инстанс за пять минут, используя Terraform.\n→ The team spun up a new instance in five minutes using Terraform.\n\n6. Мы накопили слишком много технического долга — нужно выделить время на рефакторинг.\n→ We\'ve accumulated too much technical debt — we need to allocate time for refactoring.'
        },
        {
          type: 'text',
          value: 'Финальная практика — напишите короткий абзац о типичном рабочем дне DevOps инженера, используя минимум 8 фразовых глаголов и коллокаций из этого модуля:\n\nПример:\n"A typical day as a DevOps engineer involves spinning up ephemeral environments for developers, running pipelines, and monitoring deployments. This morning, I rolled out a new version of the authentication service to 10% of users. The deployment looked fine for 30 minutes, but then I noticed the error rate creeping up, so I rolled it back immediately. I raised a ticket to investigate the root cause. In the afternoon, I set up a new monitoring dashboard and wrote up a summary of the incident for the post-mortem. We\'re also phasing out our legacy Jenkins pipelines and migrating to GitHub Actions — we\'ve been picking the low-hanging fruit first, starting with the simplest services. By end of sprint, we\'ll have scaled down our on-premises infrastructure significantly."'
        }
      ]
    },
    {
      id: 8,
      title: 'Полный обзор: 50 самых важных IT фраз',
      type: 'practice',
      content: [
        {
          type: 'text',
          value: 'Топ-50 IT фразовых глаголов и идиом для ежедневного использования:\n\nДЕПЛОЙМЕНТ И ИНФРАСТРУКТУРА:\n1. spin up an instance — запустить инстанс\n2. tear down infrastructure — уничтожить инфраструктуру\n3. roll out a feature — внедрить функцию\n4. roll back a deployment — откатить деплой\n5. phase out a service — вывести сервис из использования\n6. bring up / bring down a service — поднять / остановить сервис\n7. scale up / scale down — масштабировать вверх / вниз\n8. deploy to production — задеплоить в продакшн\n\nКОД И ПРОЦЕССЫ:\n9. make a commit — сделать коммит\n10. raise a pull request — создать PR\n11. review code — ревьюить код\n12. merge a branch — смержить ветку\n13. run tests — запустить тесты\n14. fix a bug — исправить баг\n15. write documentation — писать документацию\n16. close a ticket — закрыть тикет\n17. raise an issue — создать задачу\n18. break a build — сломать сборку'
        },
        {
          type: 'text',
          value: 'КОММУНИКАЦИЯ И МЕНЕДЖМЕНТ:\n19. run a meeting — вести митинг\n20. hand off work — передать работу\n21. opt in / opt out — подписаться / отписаться\n22. write up a report — написать отчёт\n23. sign off on something — утвердить что-то\n24. kick off a project — запустить проект\n25. wrap up a sprint — завершить спринт\n\nИДИОМЫ:\n26. hit the ground running — начать продуктивно сразу\n27. move the needle — добиться прогресса\n28. low-hanging fruit — лёгкие задачи\n29. technical debt — технический долг\n30. spaghetti code — запутанный код\n31. band-aid fix — временное решение\n32. boiling the ocean — делать слишком много сразу\n33. pain point — болевая точка\n34. bottleneck — узкое место\n35. rubber duck debugging — объяснять задачу вслух\n36. bikeshedding — споры о мелочах\n37. ship it — выпустить продукт\n38. green/brown field — с нуля / с наследием\n\nКОЛЛОКАЦИИ:\n39. make a decision — принять решение\n40. make a trade-off — пойти на компромисс\n41. run a query — выполнить запрос\n42. run a migration — выполнить миграцию\n43. raise a concern — высказать опасение\n44. close the gap — устранить разрыв\n45. break backward compatibility — нарушить обратную совместимость\n46. deploy to staging — задеплоить на стейджинг\n47. write tests — писать тесты\n48. merge conflicts — конфликты при слиянии\n49. fix a typo — исправить опечатку\n50. hit a deadline — выполнить в срок'
        }
      ]
    }
  ]
}
