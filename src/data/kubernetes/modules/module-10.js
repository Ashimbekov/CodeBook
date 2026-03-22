export default {
  id: 10,
  title: 'Jobs и CronJobs: разовые и периодические задачи',
  description: 'Запуск разовых задач с Job и периодических задач с CronJob: backoffLimit, параллелизм, расписание',
  lessons: [
    {
      id: 1,
      title: 'Job: разовые задачи',
      type: 'theory',
      content: [
        { type: 'text', value: 'Job создаёт один или несколько Pod для выполнения задачи до успешного завершения. В отличие от Deployment, Job не перезапускает Pod бесконечно — только пока задача не завершится успешно.' },
        { type: 'text', value: 'Job используется для: миграций базы данных, обработки очереди, создания бэкапов, тестирования, ETL-задач.' },
        { type: 'code', language: 'yaml', value: 'apiVersion: batch/v1\nkind: Job\nmetadata:\n  name: data-migration\nspec:\n  completions: 1          # сколько раз Pod должен успешно завершиться\n  parallelism: 1          # сколько Pod выполняется одновременно\n  backoffLimit: 3         # максимум попыток при ошибке\n  activeDeadlineSeconds: 300  # максимальное время выполнения\n  ttlSecondsAfterFinished: 3600  # удалить Job через 1ч после завершения\n  template:\n    spec:\n      restartPolicy: OnFailure  # Never или OnFailure (не Always!)\n      containers:\n      - name: migration\n        image: my-app:latest\n        command: [\'python\', \'manage.py\', \'migrate\']\n        env:\n        - name: DB_HOST\n          value: postgres-service' },
        { type: 'code', language: 'bash', value: '# Создать и следить за Job\nkubectl apply -f job.yaml\nkubectl get jobs\nkubectl describe job data-migration\n\n# Логи Job Pod\nkubectl logs -l job-name=data-migration\n\n# Дождаться завершения\nkubectl wait --for=condition=complete job/data-migration --timeout=300s' }
      ]
    },
    {
      id: 2,
      title: 'Параллельные Job',
      type: 'theory',
      content: [
        { type: 'text', value: 'Job может запускать несколько Pod параллельно для обработки большого объёма данных. Параметры completions и parallelism управляют этим поведением.' },
        { type: 'heading', value: 'Типы Job' },
        { type: 'list', items: [
          'Non-parallel Job: completions=1, parallelism=1 — один Pod до успешного завершения',
          'Parallel with fixed count: completions=N, parallelism=M — N успешных завершений, M одновременно',
          'Parallel with work queue: completions не задан, parallelism=M — Pod сами определяют когда нет работы'
        ]},
        { type: 'code', language: 'yaml', value: 'apiVersion: batch/v1\nkind: Job\nmetadata:\n  name: parallel-processor\nspec:\n  completions: 10    # обработать 10 элементов\n  parallelism: 3     # по 3 одновременно\n  backoffLimit: 6\n  template:\n    spec:\n      restartPolicy: OnFailure\n      containers:\n      - name: worker\n        image: busybox\n        command: [\'sh\', \'-c\', \'echo Processing item $JOB_COMPLETION_INDEX; sleep 5\']\n        env:\n        - name: JOB_COMPLETION_INDEX\n          valueFrom:\n            fieldRef:\n              fieldPath: metadata.annotations[\'batch.kubernetes.io/job-completion-index\']' },
        { type: 'note', value: 'С Kubernetes 1.21+ доступен Indexed Job: каждый Pod получает уникальный индекс через переменную JOB_COMPLETION_INDEX. Это удобно для обработки шардированных данных.' }
      ]
    },
    {
      id: 3,
      title: 'backoffLimit и обработка ошибок',
      type: 'theory',
      content: [
        { type: 'text', value: 'backoffLimit определяет максимальное количество повторных попыток при ошибке. Kubernetes использует экспоненциальный backoff между попытками (10с, 20с, 40с...).' },
        { type: 'code', language: 'yaml', value: 'spec:\n  backoffLimit: 4  # 4 попытки, потом Job Failed\n  # activeDeadlineSeconds применяется к активному времени Job\n  activeDeadlineSeconds: 600\n  # podFailurePolicy (K8s 1.26+) - более гибкая обработка ошибок\n  podFailurePolicy:\n    rules:\n    - action: Ignore\n      onExitCodes:\n        containerName: main\n        operator: In\n        values: [42]  # ExitCode 42 - игнорировать (нет работы)\n    - action: FailJob\n      onExitCodes:\n        operator: In\n        values: [1, 2]  # ExitCode 1,2 - сразу завершить Job как Failed' },
        { type: 'code', language: 'bash', value: '# Статус Failed Job\nkubectl get job my-job\nkubectl describe job my-job  # Events покажут причину\n\n# Pod с ошибками\nkubectl get pods -l job-name=my-job\nkubectl logs <failed-pod-name>  # Логи последней попытки\nkubectl logs <pod-name> --previous  # Предыдущая попытка' }
      ]
    },
    {
      id: 4,
      title: 'CronJob: периодические задачи',
      type: 'theory',
      content: [
        { type: 'text', value: 'CronJob создаёт Job по расписанию в формате cron. Используется для периодических задач: бэкапы, отчёты, очистка данных, регулярные синхронизации.' },
        { type: 'code', language: 'yaml', value: 'apiVersion: batch/v1\nkind: CronJob\nmetadata:\n  name: daily-backup\nspec:\n  schedule: "0 2 * * *"    # каждый день в 02:00\n  # Формат: минута час день-месяца месяц день-недели\n  # "*/5 * * * *"  - каждые 5 минут\n  # "0 9 * * 1-5" - в 9:00 по будням\n  # "@hourly"     - каждый час (только некоторые контроллеры)\n  concurrencyPolicy: Forbid  # не запускать если предыдущий ещё работает\n  startingDeadlineSeconds: 300  # максимальная задержка старта\n  successfulJobsHistoryLimit: 3  # хранить 3 успешных\n  failedJobsHistoryLimit: 1      # хранить 1 провальный\n  jobTemplate:\n    spec:\n      backoffLimit: 2\n      template:\n        spec:\n          restartPolicy: OnFailure\n          containers:\n          - name: backup\n            image: my-backup-tool:latest\n            command: [\'/backup.sh\']\n            env:\n            - name: BACKUP_DEST\n              value: "s3://my-bucket/backups"' }
      ]
    },
    {
      id: 5,
      title: 'ConcurrencyPolicy и управление CronJob',
      type: 'theory',
      content: [
        { type: 'text', value: 'ConcurrencyPolicy определяет поведение когда предыдущий запуск CronJob ещё работает в момент следующего запуска.' },
        { type: 'list', items: [
          'Allow — запустить новый Job даже если предыдущий ещё работает (по умолчанию)',
          'Forbid — пропустить запуск если предыдущий Job ещё работает',
          'Replace — остановить предыдущий Job и запустить новый'
        ]},
        { type: 'code', language: 'bash', value: '# Посмотреть CronJob\nkubectl get cronjob\nkubectl describe cronjob daily-backup\n\n# История запусков\nkubectl get jobs -l app=daily-backup\n\n# Запустить CronJob вручную (для тестирования)\nkubectl create job --from=cronjob/daily-backup manual-backup-$(date +%Y%m%d)\n\n# Приостановить CronJob\nkubectl patch cronjob daily-backup -p \'{"spec": {"suspend": true}}\'\n\n# Возобновить\nkubectl patch cronjob daily-backup -p \'{"spec": {"suspend": false}}\'' },
        { type: 'tip', value: 'Всегда тестируйте CronJob вручную через kubectl create job --from=cronjob перед включением расписания. Так вы убедитесь что Job работает корректно без ожидания планового времени.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Job для миграции и CronJob для бэкапа',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте Job для однократной миграции и CronJob для регулярного резервного копирования.',
      requirements: [
        'Создать Job для "миграции базы данных"',
        'Настроить backoffLimit и activeDeadlineSeconds',
        'Следить за выполнением Job',
        'Создать CronJob который запускается каждые 2 минуты',
        'Запустить CronJob вручную и проверить результат'
      ],
      hint: 'Для тестирования используйте schedule: "*/2 * * * *" (каждые 2 минуты). kubectl get jobs показывает историю. kubectl create job --from=cronjob для немедленного запуска.',
      expectedOutput: 'kubectl logs -l job-name=db-migration-v2:\nStarting migration...\nRunning SQL migrations...\nMigration completed successfully!\n\nkubectl get jobs:\nNAME              COMPLETIONS   DURATION   AGE\ndb-migration-v2   1/1           8s         1m\n\nkubectl logs -l job-name=manual-backup-test:\nBackup started at Thu Mar 21 10:00:00 UTC 2026\nBackup done\n\nkubectl get jobs (после 6 минут):\nNAME                    COMPLETIONS\nmanual-backup-test      1/1\ndata-backup-xxx-1       1/1\ndata-backup-xxx-2       1/1',
      solution: '# migration-job.yaml\napiVersion: batch/v1\nkind: Job\nmetadata:\n  name: db-migration-v2\nspec:\n  backoffLimit: 3\n  activeDeadlineSeconds: 120\n  ttlSecondsAfterFinished: 600\n  template:\n    spec:\n      restartPolicy: OnFailure\n      containers:\n      - name: migration\n        image: busybox\n        command:\n        - sh\n        - -c\n        - |\n          echo "Starting migration..."\n          sleep 5\n          echo "Running SQL migrations..."\n          sleep 3\n          echo "Migration completed successfully!"\n          exit 0\n\nkubectl apply -f migration-job.yaml\n\n# Следить за Job\nkubectl get jobs -w\nkubectl logs -l job-name=db-migration-v2 -f\n\n# Дождаться завершения\nkubectl wait --for=condition=complete job/db-migration-v2 --timeout=120s\necho "Migration status: $?"\n\n# CronJob для бэкапа\ncat <<EOF | kubectl apply -f -\napiVersion: batch/v1\nkind: CronJob\nmetadata:\n  name: data-backup\nspec:\n  schedule: "*/2 * * * *"\n  concurrencyPolicy: Forbid\n  successfulJobsHistoryLimit: 3\n  failedJobsHistoryLimit: 2\n  jobTemplate:\n    spec:\n      backoffLimit: 1\n      template:\n        spec:\n          restartPolicy: OnFailure\n          containers:\n          - name: backup\n            image: busybox\n            command: [\'sh\', \'-c\', \'echo "Backup started at $(date)"; sleep 10; echo "Backup done"\']\nEOF\n\n# Ручной запуск для тестирования\nkubectl create job --from=cronjob/data-backup manual-backup-test\n\n# Следить\nkubectl get jobs -w\nkubectl logs -l job-name=manual-backup-test',
      explanation: 'Job гарантирует успешное выполнение задачи, автоматически повторяя при ошибке. backoffLimit ограничивает число попыток. CronJob планирует запуски по cron-расписанию. successfulJobsHistoryLimit и failedJobsHistoryLimit предотвращают накопление старых Job объектов.'
    }
  ]
}
