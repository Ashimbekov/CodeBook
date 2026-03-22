export default {
  id: 13,
  title: 'Мониторинг пайплайнов',
  description: 'Метрики пайплайнов, уведомления в Slack/Telegram, badges, DORA метрики, оптимизация скорости.',
  lessons: [
    {
      id: 1,
      title: 'Уведомления в Slack',
      type: 'theory',
      content: [
        { type: 'text', value: 'Уведомления о состоянии деплоя помогают команде быть в курсе. Slack — популярный канал для CI/CD уведомлений.' },
        { type: 'code', language: 'yaml', value: '# GitHub Actions: уведомления в Slack\njobs:\n  deploy:\n    runs-on: ubuntu-latest\n    steps:\n      - name: Деплой\n        run: bash deploy.sh\n\n      - name: Уведомление об успехе\n        if: success()\n        uses: slackapi/slack-github-action@v1\n        with:\n          channel-id: "C12345678"\n          payload: |\n            {\n              "text": ":rocket: Деплой успешен!",\n              "attachments": [{\n                "color": "good",\n                "fields": [\n                  {"title": "Проект", "value": "${{ github.repository }}", "short": true},\n                  {"title": "Ветка", "value": "${{ github.ref_name }}", "short": true},\n                  {"title": "Автор", "value": "${{ github.actor }}", "short": true}\n                ]\n              }]\n            }\n        env:\n          SLACK_BOT_TOKEN: ${{ secrets.SLACK_BOT_TOKEN }}\n\n      - name: Уведомление об ошибке\n        if: failure()\n        uses: slackapi/slack-github-action@v1\n        with:\n          channel-id: "C12345678"\n          slack-message: ":x: Деплой упал! ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}"' },
        { type: 'heading', value: 'Настройка Slack уведомлений' },
        { type: 'list', items: [
          'Создай Slack App на api.slack.com/apps и добавь Bot Token',
          'Добавь SLACK_BOT_TOKEN в secrets репозитория',
          'Пригласи бота в нужный канал командой /invite @bot-name',
          'Channel ID найди в свойствах канала (не название, а идентификатор C12345678)',
          'color: "good" — зелёный, "danger" — красный, "warning" — жёлтый'
        ]},
        { type: 'tip', value: 'Включай прямую ссылку на logs в уведомление об ошибке — это экономит время при расследовании проблем. Шаблон: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}' }
      ]
    },
    {
      id: 2,
      title: 'Уведомления в Telegram',
      type: 'theory',
      content: [
        { type: 'text', value: 'Telegram Bot API — простой способ отправлять уведомления без сторонних actions.' },
        { type: 'code', language: 'yaml', value: 'steps:\n  - name: Уведомление в Telegram\n    if: always()\n    env:\n      TG_TOKEN: ${{ secrets.TELEGRAM_BOT_TOKEN }}\n      TG_CHAT: ${{ secrets.TELEGRAM_CHAT_ID }}\n    run: |\n      STATUS="${{ job.status }}"\n      EMOJI=$([ "$STATUS" = "success" ] && echo "" || echo "")\n      MESSAGE="${EMOJI} *${{ github.repository }}*%0A"\n      MESSAGE+="Статус: $STATUS%0A"\n      MESSAGE+="Ветка: ${{ github.ref_name }}%0A"\n      MESSAGE+="Коммит: ${{ github.event.head_commit.message }}%0A"\n      MESSAGE+="Автор: ${{ github.actor }}%0A"\n      MESSAGE+="[Подробнее](${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }})"\n      curl -s -X POST "https://api.telegram.org/bot${TG_TOKEN}/sendMessage" \\\n        -d "chat_id=${TG_CHAT}&text=${MESSAGE}&parse_mode=Markdown"' },
        { type: 'heading', value: 'Создание Telegram бота для уведомлений' },
        { type: 'list', items: [
          'Создай бота через @BotFather в Telegram командой /newbot',
          'Получи токен бота (формат: 123456789:AABBCCxxx...)',
          'Добавь бота в групповой чат или начни личный диалог',
          'Получи chat_id: отправь сообщение боту и запроси https://api.telegram.org/botTOKEN/getUpdates',
          'Добавь TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID в secrets репозитория'
        ]},
        { type: 'note', value: '%0A — это URL-кодирование переноса строки. В Telegram Markdown * делает текст жирным, _ — курсивным, [текст](url) — ссылкой. Используй parse_mode=MarkdownV2 для расширенного форматирования.' }
      ]
    },
    {
      id: 3,
      title: 'Status Badges в README',
      type: 'theory',
      content: [
        { type: 'text', value: 'Badges (бейджи) в README показывают текущий статус CI/CD, coverage, версию пакета прямо на странице репозитория.' },
        { type: 'code', language: 'bash', value: '# GitHub Actions badge\n# Синтаксис: https://github.com/{owner}/{repo}/actions/workflows/{workflow}.yml/badge.svg\n# В README.md:\n# ![CI](https://github.com/myorg/myapp/actions/workflows/ci.yml/badge.svg)\n# ![Coverage](https://codecov.io/gh/myorg/myapp/branch/main/graph/badge.svg)\n# ![PyPI](https://badge.fury.io/py/mypackage.svg)\n\n# Shields.io — универсальные badges\n# ![версия](https://img.shields.io/github/v/release/myorg/myapp)\n# ![лицензия](https://img.shields.io/github/license/myorg/myapp)\n# ![последний коммит](https://img.shields.io/github/last-commit/myorg/myapp)\n\n# GitLab badge\n# https://gitlab.com/{namespace}/{project}/badges/{branch}/pipeline.svg\n# https://gitlab.com/{namespace}/{project}/badges/{branch}/coverage.svg' },
        { type: 'tip', value: 'Добавляй badges для ветки main — они показывают текущее состояние стабильной версии. Для фильтрации по ветке добавь параметр ?branch=main к URL badge.' },
        { type: 'list', items: [
          'CI статус badge — зелёный при прохождении тестов, красный при ошибке',
          'Coverage badge — процент покрытия тестами (codecov.io, coveralls.io)',
          'Version badge — актуальная версия в PyPI, npm или GitHub releases',
          'License badge — тип лицензии проекта',
          'Shields.io позволяет создать badge для любой метрики через endpoint'
        ]},
        { type: 'note', value: 'GitLab badges настраиваются через Settings > General > Badges — можно добавлять кастомные badges с динамическими URL. GitHub badges генерируются автоматически, специальной настройки не требуется.' }
      ]
    },
    {
      id: 4,
      title: 'DORA метрики',
      type: 'theory',
      content: [
        { type: 'text', value: 'DORA (DevOps Research and Assessment) — 4 ключевые метрики эффективности CI/CD и DevOps практик.' },
        { type: 'heading', value: 'Четыре DORA метрики' },
        { type: 'list', items: [
          'Deployment Frequency — как часто деплоится код (ежечасно, ежедневно, раз в неделю)',
          'Lead Time for Changes — время от коммита до продакшена',
          'Change Failure Rate — процент деплоев приводящих к проблемам',
          'Time to Restore Service — время восстановления при инциденте'
        ]},
        { type: 'code', language: 'yaml', value: '# Измерение Deployment Frequency через GitHub API\njobs:\n  metrics:\n    runs-on: ubuntu-latest\n    if: github.ref == "refs/heads/main"\n    steps:\n      - name: Запись деплоя\n        run: |\n          TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%SZ)\n          COMMIT=${{ github.sha }}\n          # Отправить метрику в Datadog / Prometheus Pushgateway\n          curl -X POST "${{ vars.METRICS_URL }}/deploys" \\\n            -H "Content-Type: application/json" \\\n            -d "{\"timestamp\": \"$TIMESTAMP\", \"commit\": \"$COMMIT\"}"' }
      ]
    },
    {
      id: 5,
      title: 'Оптимизация времени пайплайна',
      type: 'theory',
      content: [
        { type: 'text', value: 'Медленный пайплайн снижает продуктивность команды. Несколько техник для ускорения.' },
        { type: 'heading', value: 'Техники ускорения' },
        { type: 'list', items: [
          'Кеширование зависимостей — экономит 2-5 минут',
          'Параллельные jobs — запускай независимые задачи одновременно',
          'Shallow checkout — git clone --depth=1 без полной истории',
          'paths фильтры — не запускай если не изменились нужные файлы',
          'Параллельные тесты — pytest-xdist или matrix sharding',
          'Быстрые образы — python:3.12-slim вместо python:3.12'
        ]},
        { type: 'code', language: 'yaml', value: '# Shallow checkout для ускорения\nsteps:\n  - uses: actions/checkout@v4\n    with:\n      fetch-depth: 1  # только последний коммит\n\n# paths фильтр\non:\n  push:\n    paths:\n      - "src/**"\n      - "tests/**"\n      - "requirements*.txt"\n    paths-ignore:\n      - "docs/**"\n      - "*.md"' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Уведомления и мониторинг пайплайна',
      type: 'practice',
      difficulty: 'medium',
      description: 'Добавь уведомления в Telegram о результатах деплоя с метриками.',
      requirements: [
        'Telegram уведомление при успехе деплоя с: репозиторий, ветка, автор, ссылка на run',
        'Telegram уведомление при ошибке с той же информацией',
        'Добавить job duration в уведомление (через time команды)',
        'Badge в README для статуса CI workflow',
        'Secrets: TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID'
      ],
      expectedOutput: 'Успешный деплой -> Telegram: "Деплой успешен! myapp/main - admin"\nПадение -> Telegram: "Деплой упал! myapp/main - admin [Подробнее](url)"',
      hint: 'Используй ${{ job.status }} для определения статуса. Добавь step в конце с if: always().',
      solution: '# .github/workflows/deploy-notify.yml\nname: Deploy with Notifications\n\non:\n  push:\n    branches: [main]\n\njobs:\n  deploy:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n\n      - name: Запись времени начала\n        run: echo "START_TIME=$(date +%s)" >> $GITHUB_ENV\n\n      - name: Деплой\n        run: echo "Деплой приложения..."\n\n      - name: Telegram уведомление\n        if: always()\n        env:\n          TG_TOKEN: ${{ secrets.TELEGRAM_BOT_TOKEN }}\n          TG_CHAT: ${{ secrets.TELEGRAM_CHAT_ID }}\n          STATUS: ${{ job.status }}\n        run: |\n          END=$(date +%s)\n          DURATION=$(( END - START_TIME ))\n          [ "$STATUS" = "success" ] && ICON="" || ICON=""\n          MSG="${ICON} *${{ github.repository }}*%0AСтатус: ${STATUS}%0AВетка: ${{ github.ref_name }}%0AАвтор: ${{ github.actor }}%0AВремя: ${DURATION}с%0A[Детали](${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }})"\n          curl -s -X POST "https://api.telegram.org/bot${TG_TOKEN}/sendMessage" \\\n            -d "chat_id=${TG_CHAT}&text=${MSG}&parse_mode=Markdown"',
      explanation: 'GITHUB_ENV позволяет передавать переменные между steps. ${{ job.status }} — итоговый статус job (success/failure/cancelled). always() гарантирует отправку уведомления даже при падении деплоя.'
    }
  ]
}
