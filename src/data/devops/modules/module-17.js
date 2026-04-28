export default {
  id: 17,
  title: 'Ansible: основы',
  description: 'Управление конфигурацией с Ansible: playbooks, inventory, модули, tasks и handlers.',
  lessons: [
    {
      id: 1,
      title: 'Что такое Ansible',
      type: 'theory',
      content: [
        { type: 'text', value: 'Ansible — инструмент управления конфигурацией и автоматизации. Он agentless (не требует установки агентов на серверы), работает по SSH и использует YAML для описания задач.' },
        { type: 'heading', value: 'Ansible vs Terraform' },
        { type: 'list', value: [
          'Terraform — создаёт инфраструктуру (серверы, сети, БД)',
          'Ansible — настраивает инфраструктуру (установка ПО, конфигурация, деплой)',
          'Terraform — декларативный (ЧТО создать), Ansible — процедурный + декларативный',
          'Часто используются вместе: Terraform создаёт серверы, Ansible их настраивает'
        ] },
        { type: 'heading', value: 'Установка и первые шаги' },
        { type: 'code', language: 'bash', value: '# Установка Ansible\nsudo apt update && sudo apt install ansible\n# или через pip:\npip install ansible\n\nansible --version\n# ansible [core 2.16.0]\n\n# Ad-hoc команды (без playbook)\nansible all -i "server1,server2," -m ping\nansible all -i inventory.ini -m shell -a "uptime"\nansible webservers -i inventory.ini -m apt -a "name=nginx state=present" --become' },
        { type: 'tip', value: 'Ansible agentless — не нужно ничего устанавливать на целевые серверы. Достаточно Python и SSH. Это главное преимущество над Chef и Puppet, которые требуют агенты.' }
      ]
    },
    {
      id: 2,
      title: 'Inventory',
      type: 'theory',
      content: [
        { type: 'text', value: 'Inventory определяет список серверов и их группы. Может быть статическим (INI/YAML файл) или динамическим (скрипт, получающий серверы из облака).' },
        { type: 'heading', value: 'Статический Inventory' },
        { type: 'code', language: 'bash', value: '# inventory.ini\n[webservers]\nweb1 ansible_host=192.168.1.10 ansible_user=deploy\nweb2 ansible_host=192.168.1.11 ansible_user=deploy\n\n[dbservers]\ndb1 ansible_host=192.168.1.20 ansible_user=admin\ndb2 ansible_host=192.168.1.21 ansible_user=admin\n\n[monitoring]\nprometheus ansible_host=192.168.1.30\n\n# Группа групп\n[production:children]\nwebservers\ndbservers\nmonitoring\n\n# Переменные для группы\n[production:vars]\nansible_ssh_private_key_file=~/.ssh/prod-key\nansible_python_interpreter=/usr/bin/python3\nntp_server=time.google.com' },
        { type: 'heading', value: 'YAML формат Inventory' },
        { type: 'code', language: 'yaml', value: '# inventory.yml\nall:\n  children:\n    webservers:\n      hosts:\n        web1:\n          ansible_host: 192.168.1.10\n        web2:\n          ansible_host: 192.168.1.11\n      vars:\n        http_port: 80\n        app_env: production\n    dbservers:\n      hosts:\n        db1:\n          ansible_host: 192.168.1.20\n          db_role: primary\n        db2:\n          ansible_host: 192.168.1.21\n          db_role: replica' },
        { type: 'code', language: 'bash', value: '# Проверить inventory\nansible-inventory -i inventory.yml --list\nansible-inventory -i inventory.yml --graph\n# @all:\n#   |--@webservers:\n#   |  |--web1\n#   |  |--web2\n#   |--@dbservers:\n#   |  |--db1\n#   |  |--db2' },
        { type: 'note', value: 'Для облака используй динамический inventory: AWS EC2 plugin, GCP plugin. Они автоматически находят серверы по тегам. Пример: pip install boto3 && ansible-inventory -i aws_ec2.yml --list.' }
      ]
    },
    {
      id: 3,
      title: 'Playbooks',
      type: 'theory',
      content: [
        { type: 'text', value: 'Playbook — YAML файл с набором задач (tasks) для группы серверов. Playbook описывает желаемое состояние: какие пакеты установлены, какие файлы на месте, какие сервисы запущены.' },
        { type: 'heading', value: 'Первый Playbook' },
        { type: 'code', language: 'yaml', value: '# setup-webserver.yml\n---\n- name: Настройка веб-сервера\n  hosts: webservers\n  become: true               # Выполнять от sudo\n  vars:\n    http_port: 80\n    app_user: deploy\n\n  tasks:\n    - name: Обновить пакеты\n      apt:\n        update_cache: true\n        cache_valid_time: 3600\n\n    - name: Установить nginx\n      apt:\n        name:\n          - nginx\n          - curl\n          - htop\n        state: present\n\n    - name: Запустить nginx\n      service:\n        name: nginx\n        state: started\n        enabled: true\n\n    - name: Копировать конфигурацию nginx\n      template:\n        src: templates/nginx.conf.j2\n        dest: /etc/nginx/sites-available/default\n        owner: root\n        group: root\n        mode: "0644"\n      notify: Перезапустить nginx\n\n    - name: Создать пользователя приложения\n      user:\n        name: "{{ app_user }}"\n        shell: /bin/bash\n        groups: www-data\n        append: true\n\n  handlers:\n    - name: Перезапустить nginx\n      service:\n        name: nginx\n        state: restarted' },
        { type: 'code', language: 'bash', value: '# Запуск playbook\nansible-playbook -i inventory.ini setup-webserver.yml\n\n# С дополнительными параметрами\nansible-playbook -i inventory.ini setup-webserver.yml -v       # Verbose\nansible-playbook -i inventory.ini setup-webserver.yml --check  # Dry run\nansible-playbook -i inventory.ini setup-webserver.yml --diff   # Показать изменения\nansible-playbook -i inventory.ini setup-webserver.yml --limit web1  # Только web1' },
        { type: 'tip', value: 'Handlers выполняются ТОЛЬКО если task сделал изменение (changed). Если конфиг не изменился — nginx не перезапустится. Это идемпотентность: playbook можно запускать повторно без побочных эффектов.' }
      ]
    },
    {
      id: 4,
      title: 'Модули Ansible',
      type: 'theory',
      content: [
        { type: 'text', value: 'Модули — строительные блоки Ansible. Каждый модуль выполняет одну задачу: управление пакетами, файлами, сервисами, пользователями. Ansible имеет 3000+ встроенных модулей.' },
        { type: 'heading', value: 'Основные модули' },
        { type: 'code', language: 'yaml', value: '# Управление пакетами\n- name: Установить пакеты (Debian/Ubuntu)\n  apt:\n    name: [nginx, docker.io, python3-pip]\n    state: present\n    update_cache: true\n\n- name: Установить пакеты (CentOS/RHEL)\n  yum:\n    name: [nginx, docker]\n    state: present\n\n# Управление файлами\n- name: Копировать файл\n  copy:\n    src: files/app.conf\n    dest: /etc/app/app.conf\n    owner: root\n    mode: "0644"\n\n- name: Шаблон Jinja2\n  template:\n    src: templates/nginx.conf.j2\n    dest: /etc/nginx/nginx.conf\n\n- name: Создать каталог\n  file:\n    path: /opt/myapp\n    state: directory\n    owner: deploy\n    mode: "0755"\n\n- name: Скачать файл\n  get_url:\n    url: https://example.com/app.tar.gz\n    dest: /tmp/app.tar.gz\n    checksum: sha256:abc123...' },
        { type: 'code', language: 'yaml', value: '# Управление сервисами\n- name: Запустить и включить сервис\n  service:\n    name: nginx\n    state: started\n    enabled: true\n\n# Выполнение команд\n- name: Запустить команду\n  shell: docker compose up -d\n  args:\n    chdir: /opt/myapp\n\n- name: Запустить команду (идемпотентно)\n  command: /opt/scripts/init.sh\n  args:\n    creates: /opt/myapp/.initialized  # Не запускать если файл существует\n\n# Docker\n- name: Запустить Docker контейнер\n  docker_container:\n    name: myapp\n    image: myapp:latest\n    state: started\n    restart_policy: unless-stopped\n    ports:\n      - "8080:8080"\n    env:\n      DATABASE_URL: "postgresql://db:5432/myapp"\n\n# Управление пользователями\n- name: Создать пользователя\n  user:\n    name: deploy\n    groups: [docker, sudo]\n    shell: /bin/bash\n    ssh_key: "{{ lookup(\'file\', \'~/.ssh/id_ed25519.pub\') }}"' },
        { type: 'note', value: 'Большинство модулей идемпотентны: apt state=present не переустановит уже установленный пакет. shell и command НЕ идемпотентны — используй args: creates или when для условного выполнения.' }
      ]
    },
    {
      id: 5,
      title: 'Переменные, условия и циклы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Ansible поддерживает переменные, условия (when), циклы (loop), фильтры Jinja2 и регистрацию результатов. Это делает playbooks гибкими и адаптивными.' },
        { type: 'heading', value: 'Переменные и условия' },
        { type: 'code', language: 'yaml', value: '---\n- name: Настройка серверов\n  hosts: all\n  become: true\n  vars:\n    app_version: "1.2.3"\n    packages:\n      - nginx\n      - curl\n\n  tasks:\n    - name: Установить пакеты (Ubuntu)\n      apt:\n        name: "{{ packages }}"\n        state: present\n      when: ansible_os_family == "Debian"\n\n    - name: Установить пакеты (CentOS)\n      yum:\n        name: "{{ packages }}"\n        state: present\n      when: ansible_os_family == "RedHat"\n\n    - name: Деплой приложения\n      shell: |\n        docker pull myapp:{{ app_version }}\n        docker stop myapp || true\n        docker run -d --name myapp -p 8080:8080 myapp:{{ app_version }}\n      register: deploy_result\n\n    - name: Показать результат деплоя\n      debug:\n        msg: "Деплой: {{ deploy_result.stdout }}"' },
        { type: 'heading', value: 'Циклы' },
        { type: 'code', language: 'yaml', value: '# Простой цикл\n- name: Создать пользователей\n  user:\n    name: "{{ item }}"\n    state: present\n  loop:\n    - alice\n    - bob\n    - charlie\n\n# Цикл с dict\n- name: Копировать конфиги\n  template:\n    src: "{{ item.src }}"\n    dest: "{{ item.dest }}"\n  loop:\n    - { src: "nginx.conf.j2", dest: "/etc/nginx/nginx.conf" }\n    - { src: "app.conf.j2", dest: "/etc/app/app.conf" }\n\n# Условный цикл\n- name: Запустить сервисы\n  service:\n    name: "{{ item }}"\n    state: started\n    enabled: true\n  loop: "{{ services }}"\n  when: item != "debug-server"\n  vars:\n    services:\n      - nginx\n      - postgresql\n      - redis\n      - debug-server' },
        { type: 'tip', value: 'register сохраняет результат task в переменную. Используй .stdout, .stderr, .rc (return code), .changed для анализа результата. when: result.rc == 0 — условие на основе результата.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Настройка сервера',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напишите Ansible playbook для настройки веб-сервера с нуля.',
      requirements: [
        'Создайте inventory с группами webservers и dbservers',
        'Напишите playbook для установки nginx, Docker и основных утилит',
        'Используйте шаблон (template) для конфигурации nginx',
        'Добавьте handler для перезапуска nginx при изменении конфига',
        'Используйте when для условной установки (Ubuntu vs CentOS)',
        'Добавьте цикл для создания нескольких пользователей'
      ],
      hint: 'become: true для sudo. template: src: templates/nginx.conf.j2. notify: handler_name. when: ansible_os_family == "Debian". loop: [user1, user2].',
      expectedOutput: 'Inventory создан с 2 группами\nPlaybook устанавливает nginx, docker, утилиты\nШаблон nginx.conf копируется с переменными\nHandler перезапускает nginx только при изменении\nУсловия работают для Ubuntu и CentOS\nПользователи alice, bob, charlie созданы',
      solution: '# inventory.ini\n# [webservers]\n# web1 ansible_host=192.168.1.10\n# web2 ansible_host=192.168.1.11\n# [dbservers]\n# db1 ansible_host=192.168.1.20\n# [all:vars]\n# ansible_user=deploy\n# ansible_ssh_private_key_file=~/.ssh/key\n\n# setup.yml\n# ---\n# - name: Настройка веб-серверов\n#   hosts: webservers\n#   become: true\n#   vars:\n#     http_port: 80\n#     users: [alice, bob, charlie]\n#   tasks:\n#     - name: Обновить кэш пакетов\n#       apt: update_cache=true\n#       when: ansible_os_family == "Debian"\n#\n#     - name: Установить пакеты\n#       apt:\n#         name: [nginx, docker.io, curl, htop]\n#         state: present\n#       when: ansible_os_family == "Debian"\n#\n#     - name: Копировать конфиг nginx\n#       template:\n#         src: templates/nginx.conf.j2\n#         dest: /etc/nginx/sites-available/default\n#       notify: restart nginx\n#\n#     - name: Запустить nginx\n#       service: name=nginx state=started enabled=true\n#\n#     - name: Создать пользователей\n#       user:\n#         name: "{{ item }}"\n#         groups: [docker]\n#         shell: /bin/bash\n#       loop: "{{ users }}"\n#\n#   handlers:\n#     - name: restart nginx\n#       service: name=nginx state=restarted\n\nansible-playbook -i inventory.ini setup.yml --check\nansible-playbook -i inventory.ini setup.yml',
      explanation: 'Playbook декларативно описывает состояние сервера. become: true даёт sudo. template подставляет переменные из Jinja2. handler restart nginx вызывается notify и выполняется только если конфиг изменился. loop создаёт нескольких пользователей одной задачей. --check — сухой запуск.'
    }
  ]
}
