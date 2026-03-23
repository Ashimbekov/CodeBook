export default {
  id: 8,
  title: 'Gerund and Infinitive',
  description: 'Герундий и инфинитив: после каких глаголов что использовать, IT-примеры.',
  lessons: [
    {
      id: 1,
      title: 'Инфинитив: to + глагол',
      type: 'theory',
      content: [
        { type: 'text', value: 'Инфинитив (to + verb) используется после определённых глаголов.\n\nГлаголы + инфинитив (to + V):\nwant (хотеть): I want to learn Go.\nneed (нуждаться): We need to fix this bug.\ndecide (решить): She decided to refactor the code.\nplan (планировать): We plan to migrate to the cloud.\nagree (согласиться): He agreed to review my PR.\nrefuse (отказаться): She refused to work with that framework.\nmanage (удаётся): I managed to solve the issue.\nfail (не удалось): The tests failed to run.\nhope (надеяться): I hope to finish this sprint on time.\nexpect (ожидать): We expect to release next month.' },
        { type: 'heading', value: 'IT-примеры с инфинитивом' },
        { type: 'text', value: 'I want to build a microservices architecture. (Я хочу создать микросервисную архитектуру.)\nWe need to update our security patches. (Нам нужно обновить наши патчи безопасности.)\nShe decided to switch from Java to Kotlin. (Она решила перейти с Java на Kotlin.)\nThey plan to open-source the library. (Они планируют открыть исходный код библиотеки.)\nI managed to reduce the response time by 50%. (Мне удалось сократить время ответа на 50%.)\nHe failed to reproduce the bug in staging. (Ему не удалось воспроизвести баг в staging.)\nWe agreed to follow the new coding standards. (Мы договорились следовать новым стандартам кодирования.)' }
      ]
    },
    {
      id: 2,
      title: 'Герундий: глагол + -ing',
      type: 'theory',
      content: [
        { type: 'text', value: 'Герундий (-ing форма) используется после определённых глаголов.\n\nГлаголы + герундий (-ing):\nenjoy (наслаждаться): I enjoy solving complex problems.\nfinish (закончить): She finished writing the tests.\nstart (начать): We started using Docker.\nconsider (рассматривать): We are considering migrating to AWS.\nstop (прекратить): He stopped using that library.\nkeep (продолжать): I keep getting this error.\nmind (возражать): Do you mind helping me?\navoid (избегать): You should avoid using global state.\nrecommend (рекомендовать): I recommend reading the docs.\nsuggest (предлагать): She suggested using Redis for caching.' },
        { type: 'heading', value: 'IT-примеры с герундием' },
        { type: 'text', value: 'I enjoy working on backend systems. (Мне нравится работать над backend системами.)\nShe finished implementing the new feature. (Она закончила реализацию новой функции.)\nWe started using TypeScript for all new projects. (Мы начали использовать TypeScript для всех новых проектов.)\nHe keeps pushing code without testing it. (Он продолжает пушить код без тестирования.)\nI recommend using a linter for all projects. (Рекомендую использовать линтер для всех проектов.)\nAvoid hardcoding credentials in your code. (Избегайте хардкодинга учётных данных в коде.)\nWe stopped using the monolith architecture. (Мы прекратили использовать монолитную архитектуру.)' }
      ]
    },
    {
      id: 3,
      title: 'Глаголы, принимающие оба варианта',
      type: 'theory',
      content: [
        { type: 'text', value: 'Некоторые глаголы могут использоваться как с герундием, так и с инфинитивом:\n\nlike/love/hate/prefer:\nI like to write clean code. = I like writing clean code. (Оба варианта правильны)\n\nstart/begin/continue:\nWe started to use Docker. = We started using Docker. (Оба правильны)\n\nremember (помнить/вспоминать):\nI remember testing this feature. (Помню, как тестировал — прошлое)\nRemember to test this feature before release. (Не забудь протестировать — будущее)\n\nstop:\nI stopped writing tests. (Перестал писать тесты)\nI stopped to write tests. (Остановился, чтобы написать тесты)\n\ntry:\nI tried restarting the server. (Попробовал перезапустить — как способ решить проблему)\nI tried to restart the server but it failed. (Пытался перезапустить — не получилось)' }
      ]
    },
    {
      id: 4,
      title: 'Предлог + герундий',
      type: 'theory',
      content: [
        { type: 'text', value: 'После предлогов всегда используется герундий (-ing), НЕ инфинитив!\n\nПредлоги: in, on, at, by, for, about, of, after, before, without, instead of\n\nПримеры:\nBefore deploying, always run the tests. (Перед деплоем всегда запускай тесты.)\nAfter reviewing the code, she approved the PR. (После проверки кода она одобрила PR.)\nWithout testing, you risk introducing bugs. (Без тестирования ты рискуешь добавить баги.)\nInstead of rewriting everything, consider refactoring. (Вместо переписывания всего, рассмотри рефакторинг.)\nI\'m interested in learning Rust. (Я заинтересован в изучении Rust.)\nHe\'s good at debugging. (Он хорошо разбирается в отладке.)\nThank you for helping me fix this! (Спасибо, что помог мне исправить это!)' },
        { type: 'heading', value: 'Устойчивые выражения с герундием' },
        { type: 'text', value: 'be interested in + -ing (быть заинтересованным в)\nbe good at + -ing (быть хорошим в)\nbe bad at + -ing (плохо разбираться в)\nbe responsible for + -ing (отвечать за)\nbe tired of + -ing (устать от)\nlook forward to + -ing (с нетерпением ждать)\n\nShe is responsible for maintaining the server. (Она отвечает за обслуживание сервера.)\nI\'m tired of fixing the same bugs. (Я устал исправлять одни и те же баги.)\nWe look forward to releasing the new version. (Мы с нетерпением ждём выпуска новой версии.)\nHe\'s good at optimizing database queries. (Он хорошо разбирается в оптимизации запросов к базе данных.)' }
      ]
    },
    {
      id: 5,
      title: 'Словарный запас: глаголы в IT',
      type: 'theory',
      content: [
        { type: 'text', value: 'Глаголы + инфинитив (часто в IT):\nwant to do something (хотеть)\nneed to fix / update / deploy (нужно)\nplan to migrate / release / implement (планировать)\ndecide to switch / refactor / rewrite (решить)\nmanage to solve / optimize / fix (удаться)\nfail to connect / authenticate / load (не удаться)\nexpect to receive / complete / finish (ожидать)\n\nГлаголы + герундий (часто в IT):\nfinish implementing / testing / writing (закончить)\nconsider using / migrating / switching (рассматривать)\nrecommend using / reading / testing (рекомендовать)\navoid using / hardcoding / ignoring (избегать)\nstart using / building / working (начать)\nkeep getting / seeing / trying (продолжать получать/видеть/пробовать)' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Герундий или инфинитив?',
      type: 'practice',
      content: [
        { type: 'text', value: 'Вставьте глагол в форме герундия или инфинитива.' },
        {
          type: 'exercise',
          subtype: 'fill_blank',
          items: [
            { id: 1, question: 'We need ___ (fix) this critical bug immediately.', answer: 'to fix' },
            { id: 2, question: 'I enjoy ___ (solve) complex algorithmic problems.', answer: 'solving' },
            { id: 3, question: 'She decided ___ (switch) from Angular to React.', answer: 'to switch' },
            { id: 4, question: 'We should avoid ___ (hardcode) credentials in the source code.', answer: 'hardcoding' },
            { id: 5, question: 'Before ___ (deploy), always run the test suite.', answer: 'deploying' },
            { id: 6, question: 'He managed ___ (reduce) the build time by 40%.', answer: 'to reduce' },
            { id: 7, question: 'I recommend ___ (use) environment variables for configuration.', answer: 'using' },
            { id: 8, question: 'We finished ___ (migrate) all services to the new platform.', answer: 'migrating' },
            { id: 9, question: 'Stop ___ (ignore) those linting warnings!', answer: 'ignoring' },
            { id: 10, question: 'I hope ___ (complete) this sprint on schedule.', answer: 'to complete' }
          ]
        }
      ]
    },
    {
      id: 7,
      title: 'Практика: Перевод',
      type: 'practice',
      content: [
        { type: 'text', value: 'Переведите предложения на английский язык.' },
        {
          type: 'exercise',
          subtype: 'translation',
          items: [
            { id: 1, question: 'Мне нравится решать сложные технические проблемы.', answer: 'I enjoy solving complex technical problems.' },
            { id: 2, question: 'Мы планируем перейти на микросервисы в следующем квартале.', answer: 'We plan to migrate to microservices next quarter.' },
            { id: 3, question: 'Избегайте использования устаревших библиотек.', answer: 'Avoid using outdated libraries.' },
            { id: 4, question: 'После тестирования отправь pull request.', answer: 'After testing, send a pull request.' },
            { id: 5, question: 'Он хорошо разбирается в оптимизации производительности.', answer: 'He is good at optimizing performance.' },
            { id: 6, question: 'Ей удалось исправить баг за 30 минут.', answer: 'She managed to fix the bug in 30 minutes.' },
            { id: 7, question: 'Рекомендую прочитать документацию перед началом.', answer: 'I recommend reading the documentation before starting.' }
          ]
        }
      ]
    }
  ]
}
