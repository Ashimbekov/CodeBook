export default {
  id: 18,
  title: 'Ansible: продвинутый',
  description: 'Роли Ansible, шаблоны Jinja2, Ansible Vault для секретов, Galaxy и продвинутые паттерны.',
  lessons: [
    {
      id: 1,
      title: 'Роли Ansible',
      type: 'theory',
      content: [
        { type: 'text', value: 'Роли — стандартный способ организации Ansible-кода. Роль инкапсулирует tasks, handlers, templates, files и переменные в переиспользуемую структуру.' },
        { type: 'heading', value: 'Структура роли' },
        { type: 'code', language: 'bash', value: '# Создание роли\nansible-galaxy init roles/nginx\n\n# Структура:\nroles/nginx/\n├── defaults/\n│   └── main.yml      # Переменные по умолчанию (низший приоритет)\n├── files/\n│   └── nginx.key     # Статические файлы\n├── handlers/\n│   └── main.yml      # Handlers\n├── meta/\n│   └── main.yml      # Метаданные роли (зависимости)\n├── tasks/\n│   └── main.yml      # Задачи\n├── templates/\n│   └── nginx.conf.j2 # Шаблоны Jinja2\n└── vars/\n    └── main.yml      # Переменные (высший приоритет)' },
        { type: 'heading', value: 'Пример роли nginx' },
        { type: 'code', language: 'yaml', value: '# roles/nginx/defaults/main.yml\nnginx_port: 80\nnginx_worker_processes: auto\nnginx_worker_connections: 1024\n\n# roles/nginx/tasks/main.yml\n---\n- name: Установить nginx\n  apt:\n    name: nginx\n    state: present\n    update_cache: true\n\n- name: Копировать конфигурацию\n  template:\n    src: nginx.conf.j2\n    dest: /etc/nginx/nginx.conf\n  notify: restart nginx\n\n- name: Запустить nginx\n  service:\n    name: nginx\n    state: started\n    enabled: true\n\n# roles/nginx/handlers/main.yml\n---\n- name: restart nginx\n  service:\n    name: nginx\n    state: restarted\n\n# Использование роли в playbook:\n# site.yml\n---\n- hosts: webservers\n  become: true\n  roles:\n    - nginx\n    - { role: app, app_version: "1.2.3" }\n    - { role: monitoring, when: enable_monitoring }' },
        { type: 'tip', value: 'Роли делают playbooks чистыми и переиспользуемыми. Одна роль = одна ответственность. Роль nginx, роль docker, роль postgresql — комбинируй их в разных playbooks.' }
      ]
    },
    {
      id: 2,
      title: 'Шаблоны Jinja2',
      type: 'theory',
      content: [
        { type: 'text', value: 'Jinja2 — шаблонизатор, используемый Ansible для генерации конфигурационных файлов. Поддерживает переменные, условия, циклы и фильтры.' },
        { type: 'heading', value: 'Синтаксис Jinja2' },
        { type: 'code', language: 'yaml', value: '# templates/nginx.conf.j2\nworker_processes {{ nginx_worker_processes }};\n\nevents {\n    worker_connections {{ nginx_worker_connections }};\n}\n\nhttp {\n    {% for server in nginx_servers %}\n    server {\n        listen {{ server.port }};\n        server_name {{ server.name }};\n\n        location / {\n            proxy_pass http://{{ server.backend }};\n            proxy_set_header Host $host;\n            proxy_set_header X-Real-IP $remote_addr;\n        }\n\n        {% if server.ssl is defined and server.ssl %}\n        listen 443 ssl;\n        ssl_certificate /etc/nginx/ssl/{{ server.name }}.crt;\n        ssl_certificate_key /etc/nginx/ssl/{{ server.name }}.key;\n        {% endif %}\n    }\n    {% endfor %}\n}' },
        { type: 'heading', value: 'Фильтры Jinja2' },
        { type: 'code', language: 'yaml', value: '# Полезные фильтры:\n# {{ variable | default("значение_по_умолчанию") }}\n# {{ variable | upper }}\n# {{ variable | lower }}\n# {{ list | join(", ") }}\n# {{ password | hash("sha512") }}\n# {{ dict | to_json }}\n# {{ dict | to_yaml }}\n# {{ path | basename }}\n# {{ path | dirname }}\n# {{ "строка" | regex_replace("old", "new") }}\n\n# templates/env.j2\n# Файл окружения\nAPP_ENV={{ app_env | default("production") }}\nDATABASE_URL={{ database_url }}\nSECRET_KEY={{ secret_key }}\nALLOWED_HOSTS={{ allowed_hosts | join(",") }}\nDEBUG={{ debug | default(false) | lower }}\n\n{% for key, value in extra_env.items() %}\n{{ key }}={{ value }}\n{% endfor %}' },
        { type: 'note', value: 'Шаблоны Jinja2 позволяют генерировать любые конфигурационные файлы: nginx.conf, docker-compose.yml, .env, systemd units. Один шаблон + разные переменные = разные окружения.' }
      ]
    },
    {
      id: 3,
      title: 'Ansible Vault',
      type: 'theory',
      content: [
        { type: 'text', value: 'Ansible Vault шифрует файлы с секретами (пароли, ключи, токены). Зашифрованные файлы можно безопасно хранить в Git.' },
        { type: 'heading', value: 'Работа с Vault' },
        { type: 'code', language: 'bash', value: '# Создать зашифрованный файл\nansible-vault create secrets.yml\n\n# Зашифровать существующий файл\nansible-vault encrypt group_vars/production/secrets.yml\n\n# Расшифровать\nansible-vault decrypt secrets.yml\n\n# Редактировать зашифрованный файл\nansible-vault edit secrets.yml\n\n# Просмотреть содержимое\nansible-vault view secrets.yml\n\n# Перешифровать с новым паролем\nansible-vault rekey secrets.yml\n\n# Запуск playbook с vault\nansible-playbook site.yml --ask-vault-pass\nansible-playbook site.yml --vault-password-file ~/.vault_pass\n\n# Шифрование отдельных значений\nansible-vault encrypt_string \'supersecret\' --name \'db_password\'\n# db_password: !vault |\n#   $ANSIBLE_VAULT;1.1;AES256\n#   6130326...' },
        { type: 'heading', value: 'Использование в проекте' },
        { type: 'code', language: 'yaml', value: '# group_vars/production/secrets.yml (зашифрованный)\ndb_password: supersecret\napi_key: abc123def456\nssl_private_key: |\n  -----BEGIN PRIVATE KEY-----\n  MIIEvgIBADANBg...\n  -----END PRIVATE KEY-----\n\n# group_vars/production/vars.yml (открытый)\napp_env: production\napp_port: 8080\ndb_host: db.company.com\n\n# В playbook используем как обычные переменные:\n- name: Настроить приложение\n  template:\n    src: env.j2\n    dest: /opt/app/.env\n  vars:\n    database_url: "postgresql://app:{{ db_password }}@{{ db_host }}:5432/myapp"' },
        { type: 'warning', value: 'Пароль Vault должен быть надёжным. Храни его в менеджере паролей или CI/CD секретах, НЕ в Git. В CI/CD: echo "$VAULT_PASS" > .vault_pass && ansible-playbook --vault-password-file .vault_pass.' }
      ]
    },
    {
      id: 4,
      title: 'Ansible Galaxy',
      type: 'theory',
      content: [
        { type: 'text', value: 'Ansible Galaxy — репозиторий готовых ролей от сообщества. Вместо написания роли с нуля, используй проверенные роли для nginx, Docker, PostgreSQL, мониторинга.' },
        { type: 'heading', value: 'Использование Galaxy' },
        { type: 'code', language: 'bash', value: '# Установка ролей\nansible-galaxy install geerlingguy.docker\nansible-galaxy install geerlingguy.nginx\nansible-galaxy install geerlingguy.postgresql\n\n# Установка из requirements.yml\nansible-galaxy install -r requirements.yml' },
        { type: 'code', language: 'yaml', value: '# requirements.yml\nroles:\n  - name: geerlingguy.docker\n    version: "7.1.0"\n  - name: geerlingguy.nginx\n    version: "3.2.0"\n  - name: geerlingguy.postgresql\n    version: "3.5.0"\n  - name: custom-role\n    src: git+https://github.com/company/ansible-role-app.git\n    version: main\n\ncollections:\n  - name: community.docker\n    version: "3.4.0"\n  - name: amazon.aws\n    version: "7.0.0"' },
        { type: 'code', language: 'yaml', value: '# Использование Galaxy ролей в playbook\n---\n- hosts: all\n  become: true\n  roles:\n    - role: geerlingguy.docker\n      docker_users:\n        - deploy\n    - role: geerlingguy.nginx\n      nginx_vhosts:\n        - listen: "80"\n          server_name: "app.company.com"\n          extra_parameters: |\n            location / {\n              proxy_pass http://localhost:8080;\n            }' },
        { type: 'tip', value: 'Роли от geerlingguy (Jeff Geerling) — золотой стандарт качества. Всегда указывай version в requirements.yml для воспроизводимости. ansible-galaxy install -r requirements.yml — аналог pip install -r requirements.txt.' }
      ]
    },
    {
      id: 5,
      title: 'Продвинутые паттерны',
      type: 'theory',
      content: [
        { type: 'text', value: 'Продвинутые возможности Ansible: делегирование задач, блоки с обработкой ошибок, асинхронные задачи, стратегии выполнения.' },
        { type: 'heading', value: 'Блоки и обработка ошибок' },
        { type: 'code', language: 'yaml', value: '- name: Деплой с обработкой ошибок\n  block:\n    - name: Скачать новую версию\n      get_url:\n        url: "https://releases.company.com/app-{{ version }}.tar.gz"\n        dest: /tmp/app.tar.gz\n\n    - name: Распаковать\n      unarchive:\n        src: /tmp/app.tar.gz\n        dest: /opt/app/\n        remote_src: true\n\n    - name: Перезапустить сервис\n      service:\n        name: myapp\n        state: restarted\n\n  rescue:\n    - name: Откат при ошибке\n      debug:\n        msg: "Деплой провалился, выполняю откат!"\n\n    - name: Восстановить предыдущую версию\n      copy:\n        src: /opt/app/backup/\n        dest: /opt/app/current/\n        remote_src: true\n\n  always:\n    - name: Очистка временных файлов\n      file:\n        path: /tmp/app.tar.gz\n        state: absent' },
        { type: 'heading', value: 'Делегирование и стратегии' },
        { type: 'code', language: 'yaml', value: '# Делегирование задачи другому хосту\n- name: Обновить DNS запись\n  route53:\n    zone: company.com\n    record: app.company.com\n    type: A\n    value: "{{ ansible_host }}"\n  delegate_to: localhost     # Выполнить на control machine\n\n# Последовательное обновление (rolling update)\n- hosts: webservers\n  serial: 1                  # По одному серверу\n  # serial: "25%"            # По 25% серверов\n  tasks:\n    - name: Отключить от балансировщика\n      uri:\n        url: "http://lb/api/disable/{{ inventory_hostname }}"\n        method: POST\n      delegate_to: localhost\n\n    - name: Обновить приложение\n      apt:\n        name: myapp\n        state: latest\n\n    - name: Включить в балансировщик\n      uri:\n        url: "http://lb/api/enable/{{ inventory_hostname }}"\n        method: POST\n      delegate_to: localhost' },
        { type: 'note', value: 'serial: 1 обновляет серверы по одному — это zero-downtime deployment. block/rescue/always — аналог try/catch/finally. delegate_to выполняет задачу на другом хосте (полезно для API-вызовов).' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Полный деплой с Ansible',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте набор ролей и playbook для деплоя веб-приложения с базой данных.',
      requirements: [
        'Создайте роль docker для установки Docker',
        'Создайте роль app для деплоя приложения (Docker container)',
        'Используйте Ansible Vault для паролей БД',
        'Используйте шаблон Jinja2 для docker-compose.yml',
        'Добавьте handler для перезапуска приложения',
        'Реализуйте rolling update через serial'
      ],
      hint: 'ansible-galaxy init roles/docker. ansible-vault create secrets.yml. template: src: docker-compose.yml.j2. serial: 1 для rolling update.',
      expectedOutput: 'Роли docker/ и app/ созданы\nVault файл с db_password зашифрован\nШаблон docker-compose.yml генерируется с переменными\nHandler перезапускает docker compose\nRolling update: серверы обновляются по одному',
      solution: '# Структура:\n# roles/docker/tasks/main.yml\n# - name: Install Docker\n#   apt: name=docker.io state=present\n# - name: Start Docker\n#   service: name=docker state=started enabled=true\n# - name: Add user to docker group\n#   user: name={{ ansible_user }} groups=docker append=true\n\n# roles/app/tasks/main.yml\n# - name: Create app directory\n#   file: path=/opt/app state=directory\n# - name: Deploy docker-compose\n#   template:\n#     src: docker-compose.yml.j2\n#     dest: /opt/app/docker-compose.yml\n#   notify: restart app\n# - name: Deploy env file\n#   template: src=env.j2 dest=/opt/app/.env mode=0600\n#   notify: restart app\n# - name: Start application\n#   shell: docker compose up -d\n#   args: { chdir: /opt/app }\n\n# roles/app/handlers/main.yml\n# - name: restart app\n#   shell: docker compose up -d --force-recreate\n#   args: { chdir: /opt/app }\n\n# roles/app/templates/docker-compose.yml.j2\n# services:\n#   app:\n#     image: myapp:{{ app_version }}\n#     ports: ["{{ app_port }}:8080"]\n#     environment:\n#       DATABASE_URL: postgresql://app:{{ db_password }}@{{ db_host }}:5432/myapp\n\n# site.yml\n# - hosts: webservers\n#   become: true\n#   serial: 1\n#   roles: [docker, app]\n\nansible-playbook -i inventory.ini site.yml --ask-vault-pass',
      explanation: 'Роли разделяют ответственность: docker устанавливает Docker, app деплоит приложение. Vault шифрует секреты. Jinja2 шаблоны генерируют конфигурации с подставленными переменными. serial: 1 обновляет серверы по одному для zero-downtime. Handlers запускают перезапуск только при изменениях.'
    }
  ]
}
