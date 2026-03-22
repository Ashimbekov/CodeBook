export default {
  id: 7,
  title: 'Docker Networking — сети контейнеров',
  description: 'Типы сетей Docker: bridge, host, overlay, none. Взаимодействие контейнеров, DNS, публикация портов, пользовательские сети и сети в Docker Compose.',
  lessons: [
    {
      id: 1,
      title: 'Основы Docker networking',
      type: 'theory',
      content: [
        { type: 'text', value: 'Docker создаёт виртуальную сеть для контейнеров. По умолчанию контейнеры изолированы от хоста и друг от друга. Для общения контейнеров их нужно поместить в одну сеть или публиковать порты.' },
        { type: 'code', language: 'bash', value: '# Список сетей Docker:\ndocker network ls\n# NETWORK ID     NAME      DRIVER    SCOPE\n# abc123         bridge    bridge    local\n# def456         host      host      local\n# ghi789         none      null      local\n\n# Типы сетей:\n# bridge  — виртуальный коммутатор (по умолчанию)\n# host    — контейнер использует сеть хоста напрямую\n# overlay — для Docker Swarm, между несколькими хостами\n# none    — полная изоляция, нет сети\n# macvlan — прямой MAC-адрес, контейнер как физическое устройство\n\n# Создать сеть:\ndocker network create mynet\ndocker network create --driver bridge --subnet 172.20.0.0/16 mynet\n\n# Информация о сети:\ndocker network inspect bridge\n\n# Подключить контейнер к сети:\ndocker network connect mynet mycontainer\n\n# Отключить:\ndocker network disconnect mynet mycontainer\n\n# Удалить сеть:\ndocker network rm mynet\n\n# Очистить неиспользуемые сети:\ndocker network prune' },
        { type: 'tip', value: 'Всегда создавай пользовательские сети вместо использования default bridge. В пользовательских сетях работает встроенный DNS: контейнеры обращаются друг к другу по имени, не по IP.' }
      ]
    },
    {
      id: 2,
      title: 'Bridge сеть — стандартная изоляция',
      type: 'theory',
      content: [
        { type: 'text', value: 'Bridge — тип сети по умолчанию. Docker создаёт виртуальный сетевой коммутатор (docker0 на Linux). Контейнеры в одной bridge сети могут общаться между собой, но изолированы от внешней сети.' },
        { type: 'code', language: 'bash', value: '# Default bridge — контейнеры общаются по IP (не по имени):\ndocker run -d --name web1 nginx\ndocker run -d --name web2 nginx\n\n# В default bridge нет DNS по именам:\ndocker exec web1 ping web2  # Не работает!\ndocker exec web1 ping 172.17.0.3  # Работает по IP\n\n# Пользовательская bridge сеть — есть DNS:\ndocker network create myapp-net\n\ndocker run -d --name db --network myapp-net postgres:15 \\\n  -e POSTGRES_PASSWORD=secret\ndocker run -d --name app --network myapp-net myapp \\\n  -e DB_HOST=db  # Обращаемся по имени контейнера!\n\n# Проверить DNS в пользовательской сети:\ndocker exec app ping db  # Работает!\ndocker exec app nslookup db\n# Server:    127.0.0.11  (встроенный DNS resolver Docker)\n# Name:      db\n# Address:   172.20.0.2\n\n# Контейнер может быть в нескольких сетях:\ndocker network connect frontend-net app\ndocker network connect backend-net app\n\n# Проверить сети контейнера:\ndocker inspect app --format "{{json .NetworkSettings.Networks}}" | python3 -m json.tool\n\n# IP контейнера в сети:\ndocker inspect app --format "{{.NetworkSettings.Networks.myapp-net.IPAddress}}"' },
        { type: 'note', value: 'Встроенный DNS в пользовательских сетях Docker (127.0.0.11) разрешает имена контейнеров и сервисов. Это ключевое преимущество пользовательских сетей над default bridge. Имя = имя контейнера (--name) или алиас (--network-alias).' }
      ]
    },
    {
      id: 3,
      title: 'Публикация портов и взаимодействие с хостом',
      type: 'theory',
      content: [
        { type: 'text', value: 'Контейнеры изолированы от хоста. Для доступа извне нужно публиковать порты: -p host_port:container_port. Docker настраивает iptables (или nftables) для перенаправления трафика.' },
        { type: 'code', language: 'bash', value: '# Публикация портов:\ndocker run -p 8080:80 nginx        # localhost:8080 -> container:80\ndocker run -p 443:443 -p 80:80 nginx  # Несколько портов\ndocker run -p 127.0.0.1:8080:80 nginx  # Только localhost (не внешний!)\ndocker run -p 8080-8090:80-90 nginx    # Диапазон портов\n\n# Случайный порт хоста:\ndocker run -p 80 nginx  # Docker выбирает свободный порт\ndocker port mycontainer  # Узнать назначенный порт\n# 80/tcp -> 0.0.0.0:32768\n\n# Expose vs Publish:\n# EXPOSE в Dockerfile — документация, не публикует!\n# -p — реально публикует порт\n\n# Проверить published ports:\ndocker ps\n# CONTAINER ID   IMAGE   PORTS\n# abc123         nginx   0.0.0.0:8080->80/tcp\n\ndocker inspect mycontainer --format "{{json .HostConfig.PortBindings}}"\n\n# Пример: только localhost, безопасно для dev:\ndocker run -d \\\n  --name postgres \\\n  -p 127.0.0.1:5432:5432 \\\n  -e POSTGRES_PASSWORD=secret \\\n  postgres:15\n# PostgreSQL доступен локально, не снаружи!\n\n# Проверить что слушает:\nss -tlnp | grep 5432\n# tcp LISTEN 0 128 127.0.0.1:5432 0.0.0.0:*' },
        { type: 'warning', value: '-p 5432:5432 публикует PostgreSQL на 0.0.0.0:5432 — доступен с любого интерфейса, включая публичный IP! На production используй -p 127.0.0.1:5432:5432 или не публикуй порт вообще (пусть контейнеры общаются через сеть Docker).' }
      ]
    },
    {
      id: 4,
      title: 'Host и none сети',
      type: 'theory',
      content: [
        { type: 'text', value: 'Host network: контейнер использует сетевой стек хоста напрямую без изоляции — максимальная производительность. None network: полная сетевая изоляция — контейнер не имеет доступа к сети.' },
        { type: 'code', language: 'bash', value: '# HOST NETWORK:\n# Контейнер слушает на портах хоста напрямую\ndocker run --network host nginx\n# nginx слушает на 80 порту ХОСТА (не нужен -p!)\n\n# Когда использовать host network:\n# - Максимальная производительность (нет NAT накладных расходов)\n# - Мониторинг инструменты (prometheus node_exporter)\n# - Сетевые инструменты которым нужен полный доступ\n\n# Пример: prometheus node_exporter\ndocker run -d \\\n  --network host \\\n  --name node-exporter \\\n  prom/node-exporter:latest\n# Доступен на хосте: http://localhost:9100/metrics\n\n# ОГРАНИЧЕНИЯ host network:\n# - Работает только на Linux!\n# - На macOS/Windows контейнеры НЕ используют сеть хоста\n#   (они в VM, поэтому host = сеть VM, не твоя сеть)\n\n# NONE NETWORK:\n# Полная изоляция — нет сети вообще\ndocker run --network none ubuntu ip addr\n# lo — только loopback, нет eth0\n\n# Когда использовать none:\n# - Batch jobs без сетевого доступа\n# - Безопасная обработка чувствительных данных\n# - Тесты которые не должны иметь сеть\n\ndocker run --network none ubuntu curl https://google.com\n# curl: (6) Could not resolve host: google.com\n\n# Сравнение производительности:\n# host:   ~wire speed (нет overhead)\n# bridge: ~10% overhead от NAT\n# overlay: ~20-30% overhead (шифрование)' },
        { type: 'tip', value: 'Host network на Linux даёт максимальную сетевую производительность. Используй для мониторинга, high-performance приложений. None network идеален для cryptographic задач, ML инференса и любых задач без сети.' }
      ]
    },
    {
      id: 5,
      title: 'Overlay сети для Docker Swarm',
      type: 'theory',
      content: [
        { type: 'text', value: 'Overlay сети позволяют контейнерам на разных Docker хостах общаться как в одной сети. Используется в Docker Swarm и частично в других оркестраторах. Трафик шифруется между узлами.' },
        { type: 'code', language: 'bash', value: '# Overlay требует Docker Swarm:\ndocker swarm init\n\n# Создать overlay сеть:\ndocker network create \\\n  --driver overlay \\\n  --attachable \\\n  --subnet 10.10.0.0/16 \\\n  myoverlay\n\n# --attachable: позволяет подключать отдельные контейнеры\n# Без --attachable: только Swarm services\n\n# Запустить сервис в overlay сети:\ndocker service create \\\n  --name web \\\n  --network myoverlay \\\n  --replicas 3 \\\n  nginx\n\n# Сервисы в overlay видят друг друга по имени:\n# web.1, web.2, web.3 — реплики\n# web — load balanced endpoint (VIP)\n\n# Шифрованная overlay сеть:\ndocker network create \\\n  --driver overlay \\\n  --opt encrypted \\\n  --subnet 10.20.0.0/16 \\\n  secure-overlay\n# Весь трафик между узлами шифруется\n\n# Overlay использует VXLAN (порт UDP 4789):\n# Инкапсулирует Ethernet кадры в UDP пакеты\n# Позволяет L2 сеть поверх L3 инфраструктуры\n\n# Проверить overlay сеть:\ndocker network inspect myoverlay\n# Peers: список Docker узлов в сети\n\n# Диагностика:\ndocker network inspect myoverlay --format "{{json .Peers}}"' },
        { type: 'note', value: 'Overlay сети требуют открытых портов между хостами: TCP/UDP 2377 (Swarm management), TCP/UDP 7946 (node communication), UDP 4789 (VXLAN). Для современных проектов чаще используют Kubernetes вместо Docker Swarm.' }
      ]
    },
    {
      id: 6,
      title: 'Сети в Docker Compose',
      type: 'theory',
      content: [
        { type: 'text', value: 'Docker Compose автоматически создаёт сеть для проекта. Все сервисы в этой сети могут общаться по имени сервиса. Можно создавать несколько сетей для изоляции сервисов.' },
        { type: 'code', language: 'yaml', value: '# docker-compose.yml с несколькими сетями:\nservices:\n  nginx:\n    image: nginx\n    networks:\n      - frontend\n      - backend\n    ports:\n      - "80:80"\n\n  app:\n    build: .\n    networks:\n      - backend\n    # app НЕ доступен снаружи напрямую\n\n  db:\n    image: postgres:15\n    networks:\n      - backend\n    # db изолирован — только backend сеть\n\n  redis:\n    image: redis:7\n    networks:\n      - backend\n\nnetworks:\n  frontend:\n    driver: bridge\n  backend:\n    driver: bridge\n    internal: true  # Нет доступа в интернет!\n\n# Алиасы в сетях:\nservices:\n  db:\n    networks:\n      backend:\n        aliases:\n          - database\n          - postgres\n    # Доступен как "db", "database" или "postgres"\n\n# Использование внешней сети:\nnetworks:\n  shared:\n    external: true\n    name: my_shared_network\n\n# Статический IP (редко нужен):\nservices:\n  app:\n    networks:\n      backend:\n        ipv4_address: 172.20.0.10\n\nnetworks:\n  backend:\n    ipam:\n      config:\n        - subnet: 172.20.0.0/16' },
        { type: 'code', language: 'bash', value: '# Compose создаёт сеть {project}_{network}:\n# Проект "myapp", сеть "backend" -> "myapp_backend"\n\n# Проверить созданные сети:\ndocker compose up -d\ndocker network ls | grep myapp\n\n# Сервисы обращаются друг к другу по имени:\n# app подключается к db: host=db\n# Compose разрешает "db" в IP контейнера БД\n\n# internal: true — нет выхода в интернет:\n# Полезно для изоляции backend от прямых внешних соединений\n# backend -> db работает\n# db -> internet НЕ работает\n\n# Диагностика сети в Compose:\ndocker compose exec app nslookup db\ndocker compose exec app ping redis\ndocker compose exec nginx curl http://app:3000/health' },
        { type: 'tip', value: 'Архитектурный паттерн: frontend сеть (nginx + app), backend сеть (app + db + redis). nginx в обеих, db только в backend. Это предотвращает прямой доступ к БД из frontend слоя.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Настройка сетей контейнеров',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай изолированную сетевую архитектуру для веб-приложения.',
      requirements: [
        'Создай две сети: frontend и backend',
        'Запусти PostgreSQL только в сети backend',
        'Запусти простое веб-приложение (nginx) в сетях frontend и backend',
        'Запусти второй nginx как "публичный балансировщик" только в сети frontend',
        'Убедись что балансировщик видит приложение, но не видит PostgreSQL напрямую',
        'Продемонстрируй DNS резолюцию по именам контейнеров',
        'Проверь изоляцию: контейнер только в backend не должен пинговаться из frontend'
      ],
      hint: 'docker network create для создания сетей. docker run --network для подключения. docker exec для тестов. nslookup или ping по имени контейнера для проверки DNS. docker network connect для добавления второй сети.',
      expectedOutput: 'docker exec lb ping -c 1 app:\nPING app (172.20.0.3): 56 data bytes\n64 bytes from 172.20.0.3: seq=0 ttl=64 time=0.1 ms\n\ndocker exec lb ping -c 1 postgres:\nping: postgres: Name or service not known\n\ndocker exec app ping -c 1 postgres:\nPING postgres (172.21.0.2): 56 data bytes\n64 bytes from 172.21.0.2: seq=0 ttl=64 time=0.1 ms\n\ndocker exec app nslookup postgres:\nServer: 127.0.0.11\nName: postgres\nAddress: 172.21.0.2\n\nИзоляция работает: lb не видит postgres через DNS.',
      solution: '# 1. Создать сети\ndocker network create frontend\ndocker network create backend\n\n# 2. PostgreSQL только в backend\ndocker run -d \\\n  --name postgres \\\n  --network backend \\\n  -e POSTGRES_PASSWORD=secret \\\n  postgres:15\n\n# 3. Приложение в обеих сетях\ndocker run -d \\\n  --name app \\\n  --network backend \\\n  nginx  # Имитирует приложение\n\ndocker network connect frontend app\n\n# 4. Балансировщик только во frontend\ndocker run -d \\\n  --name lb \\\n  --network frontend \\\n  -p 8080:80 \\\n  nginx\n\n# 5. Проверки\n# lb видит app:\ndocker exec lb ping -c 1 app\n# PING app (172.x.x.x): 56 data bytes\n\n# lb НЕ видит postgres:\ndocker exec lb ping -c 1 postgres\n# ping: postgres: Name or service not known\n\n# app видит postgres:\ndocker exec app ping -c 1 postgres\n# PING postgres (172.x.x.x): 56 data bytes\n\n# 6. DNS резолюция\ndocker exec app nslookup postgres\n# Server:    127.0.0.11\n# Name:      postgres\n# Address:   172.x.x.x\n\ndocker exec lb nslookup app\n# Server:    127.0.0.11\n# Name:      app\n# Address:   172.x.x.x\n\n# 7. Проверить изоляцию\ndocker exec lb nslookup postgres\n# nslookup: can not resolve \'postgres\': Name or service not known\n\n# Инспектировать сети:\ndocker network inspect frontend\ndocker network inspect backend\n\n# Очистка:\ndocker stop lb app postgres\ndocker rm lb app postgres\ndocker network rm frontend backend',
      explanation: 'Многосетевая архитектура изолирует компоненты: lb видит только app (frontend), app видит db (backend), db недоступен из lb. Это принцип минимальных привилегий в сетевой топологии. Docker встроенный DNS позволяет обращаться по именам вместо хрупких IP адресов.'
    }
  ]
}
