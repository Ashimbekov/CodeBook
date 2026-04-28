export default {
  id: 12,
  title: 'Сети в Linux',
  description: 'Сетевая конфигурация Linux: интерфейсы, IP-адреса, маршрутизация, DNS, firewall (iptables/nftables).',
  lessons: [
    {
      id: 1,
      title: 'Сетевые интерфейсы и IP-адреса',
      type: 'theory',
      content: [
        { type: 'text', value: 'Сетевой интерфейс — точка подключения к сети. В Linux интерфейсы именуются как eth0, ens33 (Ethernet), wlan0 (Wi-Fi), lo (loopback). Команда ip заменила устаревшие ifconfig и route.' },
        { type: 'code', language: 'bash', value: '# Показать все интерфейсы:\nip addr show\n# или сокращённо:\nip a\n\n# Вывод:\n# 1: lo: <LOOPBACK,UP> mtu 65536\n#     inet 127.0.0.1/8 scope host lo\n# 2: eth0: <BROADCAST,MULTICAST,UP> mtu 1500\n#     inet 192.168.1.100/24 brd 192.168.1.255 scope global eth0\n#     inet6 fe80::1/64 scope link\n\n# Показать только IPv4:\nip -4 addr show\n\n# Конкретный интерфейс:\nip addr show eth0\n\n# Назначить IP-адрес (временно):\nsudo ip addr add 192.168.1.200/24 dev eth0\nsudo ip addr del 192.168.1.200/24 dev eth0\n\n# Включить/выключить интерфейс:\nsudo ip link set eth0 up\nsudo ip link set eth0 down\n\n# Информация о линке:\nip link show\nip -s link show eth0    # со статистикой (TX/RX пакеты)' },
        { type: 'tip', value: 'ifconfig устарел! Используйте ip. Соответствия: ifconfig -> ip addr show, route -> ip route show, netstat -> ss. Команда ip — мощнее и является стандартом.' }
      ]
    },
    {
      id: 2,
      title: 'Маршрутизация и DNS',
      type: 'theory',
      content: [
        { type: 'text', value: 'Маршрутизация определяет путь пакетов в сети. Default gateway — маршрутизатор для пакетов, не предназначенных для локальной сети. DNS преобразует доменные имена в IP-адреса.' },
        { type: 'code', language: 'bash', value: '# Таблица маршрутизации:\nip route show\n# default via 192.168.1.1 dev eth0       — шлюз по умолчанию\n# 192.168.1.0/24 dev eth0 proto kernel    — локальная сеть\n\n# Добавить/удалить маршрут:\nsudo ip route add 10.0.0.0/8 via 192.168.1.254\nsudo ip route del 10.0.0.0/8\nsudo ip route add default via 192.168.1.1\n\n# Трассировка маршрута:\ntraceroute google.com\ntracepath google.com    # без root\nmtr google.com          # интерактивный (apt install mtr)\n\n# DNS конфигурация:\ncat /etc/resolv.conf\n# nameserver 8.8.8.8\n# nameserver 8.8.4.4\n# search example.com\n\n# DNS запросы:\nnslookup google.com\ndig google.com\ndig google.com +short        # только IP\ndig -x 8.8.8.8              # обратный запрос (PTR)\nhost google.com\n\n# Локальный DNS: /etc/hosts\ncat /etc/hosts\n# 127.0.0.1  localhost\n# 192.168.1.50  myserver.local\n# Записи в /etc/hosts имеют приоритет над DNS' },
        { type: 'note', value: '/etc/hosts проверяется ДО DNS-серверов. Это удобно для тестирования: добавьте 192.168.1.50 myapp.local и обращайтесь к серверу по имени без настройки DNS.' }
      ]
    },
    {
      id: 3,
      title: 'Диагностика сети: ping, ss, netstat',
      type: 'theory',
      content: [
        { type: 'text', value: 'Диагностические инструменты помогают найти проблемы с сетью. ping проверяет доступность, ss показывает открытые порты и соединения, curl и wget тестируют HTTP.' },
        { type: 'code', language: 'bash', value: '# ping — проверка доступности:\nping google.com                  # бесконечный ping (Ctrl+C)\nping -c 4 google.com             # 4 пакета\nping -c 1 -W 2 192.168.1.1      # 1 пакет, таймаут 2 сек\n\n# ss — сокеты и соединения (замена netstat):\nss -tuln                         # TCP/UDP слушающие порты\n# -t TCP, -u UDP, -l listening, -n числовые адреса\n\nss -tlnp                         # + имя процесса\n# State  Recv-Q Send-Q Local Address:Port Peer Address:Port Process\n# LISTEN 0      511    0.0.0.0:80         0.0.0.0:*         nginx\n# LISTEN 0      128    0.0.0.0:22         0.0.0.0:*         sshd\n\nss -tn                           # активные TCP соединения\nss -s                            # статистика\n\n# netstat (устаревший, но ещё используется):\nnetstat -tuln\nnetstat -anp | grep :80\n\n# curl — HTTP запросы:\ncurl http://localhost              # GET запрос\ncurl -I http://example.com         # только заголовки\ncurl -v http://example.com         # подробно\ncurl -o file.html http://example.com  # скачать\n\n# wget — скачивание файлов:\nwget http://example.com/file.tar.gz\nwget -q -O - http://example.com    # на stdout' },
        { type: 'tip', value: 'ss -tlnp — первая команда при проблемах с сетевыми сервисами. Она покажет какие порты слушают и какие процессы их заняли.' }
      ]
    },
    {
      id: 4,
      title: 'Постоянная настройка сети: Netplan и NetworkManager',
      type: 'theory',
      content: [
        { type: 'text', value: 'Команда ip настраивает сеть временно (до перезагрузки). Для постоянной конфигурации используется Netplan (Ubuntu) или NetworkManager. На серверах часто используют Netplan.' },
        { type: 'heading', value: 'Netplan (Ubuntu Server)' },
        { type: 'code', language: 'yaml', value: '# /etc/netplan/01-config.yaml\nnetwork:\n  version: 2\n  renderer: networkd\n  ethernets:\n    eth0:\n      addresses:\n        - 192.168.1.100/24\n      routes:\n        - to: default\n          via: 192.168.1.1\n      nameservers:\n        addresses:\n          - 8.8.8.8\n          - 8.8.4.4\n        search:\n          - example.com' },
        { type: 'code', language: 'bash', value: '# Применить конфигурацию Netplan:\nsudo netplan apply\n\n# Проверить синтаксис:\nsudo netplan try    # применить на 120 сек, потом откатить\n\n# DHCP (автоматическое получение IP):\n# /etc/netplan/01-config.yaml\n# network:\n#   version: 2\n#   ethernets:\n#     eth0:\n#       dhcp4: true\n\n# NetworkManager (десктоп):\nnmcli device status              # список устройств\nnmcli connection show             # список соединений\nnmcli connection modify eth0 ipv4.addresses 192.168.1.100/24\nnmcli connection up eth0          # применить\n\n# На RHEL/CentOS:\n# /etc/sysconfig/network-scripts/ifcfg-eth0\n# или nmcli / nmtui (текстовый интерфейс)' },
        { type: 'tip', value: 'Netplan try — безопасный способ изменить сетевую конфигурацию на удалённом сервере. Если что-то пойдёт не так, конфигурация откатится через 120 секунд и вы не потеряете доступ.' }
      ]
    },
    {
      id: 5,
      title: 'iptables — firewall',
      type: 'theory',
      content: [
        { type: 'text', value: 'iptables — классический firewall Linux. Работает с цепочками правил: INPUT (входящие), OUTPUT (исходящие), FORWARD (транзитные). Каждый пакет проверяется по правилам, первое совпадение определяет действие.' },
        { type: 'code', language: 'bash', value: '# Просмотр правил:\nsudo iptables -L -n -v             # все правила\nsudo iptables -L INPUT -n --line-numbers  # с номерами строк\n\n# Политика по умолчанию:\nsudo iptables -P INPUT DROP        # запретить всё входящее\nsudo iptables -P FORWARD DROP\nsudo iptables -P OUTPUT ACCEPT     # разрешить всё исходящее\n\n# Разрешить loopback:\nsudo iptables -A INPUT -i lo -j ACCEPT\n\n# Разрешить установленные соединения:\nsudo iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT\n\n# Разрешить SSH:\nsudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT\n\n# Разрешить HTTP и HTTPS:\nsudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT\nsudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT\n\n# Разрешить ping:\nsudo iptables -A INPUT -p icmp --icmp-type echo-request -j ACCEPT\n\n# Заблокировать IP:\nsudo iptables -A INPUT -s 10.0.0.5 -j DROP\n\n# Удалить правило по номеру:\nsudo iptables -D INPUT 3\n\n# Очистить все правила:\nsudo iptables -F' },
        { type: 'heading', value: 'Сохранение правил' },
        { type: 'code', language: 'bash', value: '# Правила iptables теряются при перезагрузке!\n# Сохранить:\nsudo apt install iptables-persistent\nsudo netfilter-persistent save\n# Или:\nsudo iptables-save > /etc/iptables/rules.v4\nsudo iptables-restore < /etc/iptables/rules.v4\n\n# UFW — дружелюбная обёртка над iptables (Ubuntu):\nsudo ufw enable\nsudo ufw allow ssh\nsudo ufw allow 80/tcp\nsudo ufw allow 443/tcp\nsudo ufw deny from 10.0.0.5\nsudo ufw status verbose\nsudo ufw status numbered\nsudo ufw delete 3\n\n# firewalld — альтернатива для RHEL/CentOS:\nsudo firewall-cmd --add-service=http --permanent\nsudo firewall-cmd --add-port=8080/tcp --permanent\nsudo firewall-cmd --reload\nsudo firewall-cmd --list-all' },
        { type: 'tip', value: 'Для серверов используйте UFW — он проще iptables и достаточен для большинства задач. Правило ufw allow ssh ОБЯЗАТЕЛЬНО перед ufw enable — иначе потеряете SSH-доступ!' }
      ]
    },
    {
      id: 6,
      title: 'nftables — современный firewall',
      type: 'theory',
      content: [
        { type: 'text', value: 'nftables — замена iptables в современных ядрах Linux. Единый фреймворк для IPv4, IPv6, ARP. Более производительный и с понятным синтаксисом.' },
        { type: 'code', language: 'bash', value: '# Проверить наличие nftables:\nsudo nft list ruleset\n\n# Базовая конфигурация:\nsudo nft add table inet filter\nsudo nft add chain inet filter input { type filter hook input priority 0 \; policy drop \; }\nsudo nft add chain inet filter forward { type filter hook forward priority 0 \; policy drop \; }\nsudo nft add chain inet filter output { type filter hook output priority 0 \; policy accept \; }\n\n# Правила:\nsudo nft add rule inet filter input iif lo accept\nsudo nft add rule inet filter input ct state established,related accept\nsudo nft add rule inet filter input tcp dport 22 accept\nsudo nft add rule inet filter input tcp dport {80, 443} accept\nsudo nft add rule inet filter input icmp type echo-request accept\n\n# Просмотр:\nsudo nft list ruleset\n\n# Сохранение:\nsudo nft list ruleset > /etc/nftables.conf\nsudo systemctl enable nftables' },
        { type: 'note', value: 'В Ubuntu 22.04+ iptables по умолчанию использует nftables как бэкенд (iptables-nft). Для новых проектов рекомендуется nftables или UFW, которая работает поверх nftables.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Настройка сети',
      type: 'practice',
      difficulty: 'medium',
      description: 'Настройте сетевые параметры и firewall на Linux-сервере.',
      requirements: [
        'Выведите все сетевые интерфейсы и их IP-адреса',
        'Проверьте таблицу маршрутизации и шлюз по умолчанию',
        'Выполните DNS-запрос для google.com и покажите IP-адрес',
        'Найдите все открытые порты на сервере',
        'Настройте UFW: разрешите SSH (22), HTTP (80), HTTPS (443)',
        'Проверьте доступность внешнего хоста через ping и tracepath'
      ],
      hint: 'ip addr show для интерфейсов. ip route show для маршрутов. dig google.com +short для DNS. ss -tlnp для открытых портов. sudo ufw allow ssh для UFW.',
      expectedOutput: 'ip addr: eth0 192.168.1.100/24, lo 127.0.0.1/8\nip route: default via 192.168.1.1\ndig google.com: 142.250.x.x\nss -tlnp: 22(sshd), 80(nginx), 5432(postgres)\nufw status: 22,80,443 ALLOW',
      solution: '# 1. Интерфейсы и IP\nip addr show\nip -4 addr show | grep inet\n\n# 2. Маршрутизация\nip route show\n# default via 192.168.1.1 dev eth0\n\n# 3. DNS запрос\ndig google.com +short\nnslookup google.com\n\n# 4. Открытые порты\nsudo ss -tlnp\nsudo ss -tulnp  # TCP + UDP\n\n# 5. UFW\nsudo ufw allow ssh\nsudo ufw allow 80/tcp\nsudo ufw allow 443/tcp\nsudo ufw enable\nsudo ufw status verbose\n\n# 6. Доступность\nping -c 4 google.com\ntracepath google.com',
      explanation: 'ip addr show показывает все интерфейсы с IP. ip route — маршруты. dig +short — быстрый DNS-запрос. ss -tlnp — TCP listening порты с именами процессов. UFW управляет iptables/nftables через простой интерфейс.'
    }
  ]
}
