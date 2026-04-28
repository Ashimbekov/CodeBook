export default {
  id: 16,
  title: 'Файловые системы и LVM',
  description: 'Файловые системы ext4, XFS, Btrfs. LVM для гибкого управления дисками. RAID, mount, fstab.',
  lessons: [
    {
      id: 1,
      title: 'Файловые системы: ext4, XFS, Btrfs',
      type: 'theory',
      content: [
        { type: 'text', value: 'Файловая система определяет как данные хранятся на диске. ext4 — стандарт для Linux, XFS — для больших файлов и высокой производительности, Btrfs — современная ФС с снапшотами и сжатием.' },
        { type: 'code', language: 'bash', value: '# Проверить текущие файловые системы:\ndf -Th\n# Filesystem     Type  Size  Used Avail Use% Mounted on\n# /dev/sda1      ext4  50G   15G  33G   31% /\n# /dev/sdb1      xfs   100G  40G  60G   40% /data\n\nlsblk -f\n# NAME  FSTYPE LABEL UUID                                 MOUNTPOINT\n# sda\n# ├─sda1 ext4        a1b2c3d4-...                         /\n# └─sda2 swap        e5f6g7h8-...                         [SWAP]\n\n# Сравнение файловых систем:\n# ext4:\n#  + Стабильная, проверенная, широкая поддержка\n#  + Журналирование, быстрая проверка fsck\n#  + Хороша для корневой ФС и общего применения\n#  - Максимальный размер файла: 16 TB, ФС: 1 EB\n\n# XFS:\n#  + Отлично для больших файлов и высокого I/O\n#  + Параллельный I/O, хорошее масштабирование\n#  + Стандарт для RHEL/CentOS\n#  - Нельзя уменьшить размер (только увеличить)\n\n# Btrfs:\n#  + Снапшоты, сжатие, RAID на уровне ФС\n#  + Подтома (subvolumes), дедупликация\n#  + Copy-on-Write (CoW)\n#  - Менее зрелая, RAID 5/6 нестабилен' },
        { type: 'tip', value: 'Для серверов: ext4 для корневого раздела, XFS для больших данных (/var/lib, базы данных). Btrfs — если нужны снапшоты и сжатие (отлично для /home).' }
      ]
    },
    {
      id: 2,
      title: 'Разделы и форматирование',
      type: 'theory',
      content: [
        { type: 'text', value: 'Перед использованием диска его нужно разбить на разделы (partition) и отформатировать (создать файловую систему). fdisk/gdisk для разметки, mkfs для форматирования.' },
        { type: 'code', language: 'bash', value: '# Просмотр дисков и разделов:\nlsblk\n# NAME   MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT\n# sda      8:0    0   50G  0 disk\n# ├─sda1   8:1    0   49G  0 part /\n# └─sda2   8:2    0    1G  0 part [SWAP]\n# sdb      8:16   0  100G  0 disk\n\nsudo fdisk -l /dev/sdb       # информация о диске\n\n# Создать раздел (GPT):\nsudo gdisk /dev/sdb\n# n — новый раздел\n# Enter (номер, первый сектор, последний сектор — по умолчанию)\n# 8300 — тип Linux filesystem\n# w — записать\n\n# Или одной командой:\nsudo parted /dev/sdb mklabel gpt\nsudo parted /dev/sdb mkpart primary ext4 0% 100%\n\n# Форматирование:\nsudo mkfs.ext4 /dev/sdb1\nsudo mkfs.xfs /dev/sdb1\nsudo mkfs.btrfs /dev/sdb1\n\n# С меткой:\nsudo mkfs.ext4 -L "data" /dev/sdb1\n\n# Монтирование:\nsudo mkdir -p /mnt/data\nsudo mount /dev/sdb1 /mnt/data\ndf -h /mnt/data' },
        { type: 'note', value: 'ВНИМАНИЕ: mkfs УНИЧТОЖАЕТ все данные на разделе! Всегда дважды проверяйте имя устройства (lsblk) перед форматированием. Никогда не форматируйте системный раздел.' }
      ]
    },
    {
      id: 3,
      title: 'mount и /etc/fstab',
      type: 'theory',
      content: [
        { type: 'text', value: 'mount подключает файловую систему к дереву каталогов. /etc/fstab определяет автоматическое монтирование при загрузке. Ошибка в fstab может привести к незагружаемой системе.' },
        { type: 'code', language: 'bash', value: '# Монтирование:\nsudo mount /dev/sdb1 /mnt/data\nsudo mount -t ext4 /dev/sdb1 /mnt/data     # указать тип ФС\nsudo mount -o ro /dev/sdb1 /mnt/data       # только чтение\nsudo mount -o noexec,nosuid /dev/sdb1 /mnt/data  # без exec и SUID\n\n# Размонтирование:\nsudo umount /mnt/data\nsudo umount -l /mnt/data    # ленивое (если занят)\n\n# Показать все точки монтирования:\nmount | column -t\nfindmnt\nfindmnt -t ext4\n\n# /etc/fstab — автомонтирование при загрузке:\ncat /etc/fstab\n# <device>         <mount>   <type> <options>       <dump> <fsck>\n# UUID=a1b2c3d4... /         ext4   errors=remount-ro 0      1\n# UUID=e5f6g7h8... none      swap   sw                0      0\n# UUID=i9j0k1l2... /data     ext4   defaults          0      2\n\n# Узнать UUID:\nsudo blkid /dev/sdb1\n# /dev/sdb1: UUID="a1b2c3d4-..." TYPE="ext4"\n\n# Добавить в fstab:\necho "UUID=a1b2c3d4-... /mnt/data ext4 defaults 0 2" | sudo tee -a /etc/fstab\n\n# Проверить fstab БЕЗ перезагрузки:\nsudo mount -a\n# Если нет ошибок — fstab корректен' },
        { type: 'tip', value: 'Всегда используйте UUID в fstab вместо /dev/sdX — порядок дисков может измениться при перезагрузке. sudo mount -a проверяет fstab без перезагрузки — обязательно выполните после изменений.' }
      ]
    },
    {
      id: 4,
      title: 'LVM — Logical Volume Manager',
      type: 'theory',
      content: [
        { type: 'text', value: 'LVM добавляет уровень абстракции между физическими дисками и файловыми системами. Позволяет динамически изменять размер разделов, создавать снапшоты, объединять диски.' },
        { type: 'code', language: 'bash', value: '# Структура LVM:\n# Physical Volume (PV) — физический диск/раздел\n# Volume Group (VG) — группа PV (пул хранения)\n# Logical Volume (LV) — виртуальный раздел из VG\n\n# Установка:\nsudo apt install lvm2\n\n# 1. Создать Physical Volume:\nsudo pvcreate /dev/sdb /dev/sdc\nsudo pvs    # показать PV\n\n# 2. Создать Volume Group:\nsudo vgcreate data-vg /dev/sdb /dev/sdc\nsudo vgs    # показать VG\n\n# 3. Создать Logical Volume:\nsudo lvcreate -L 50G -n app-lv data-vg    # 50 GB\nsudo lvcreate -l 100%FREE -n data-lv data-vg  # всё свободное место\nsudo lvs    # показать LV\n\n# 4. Форматировать и монтировать:\nsudo mkfs.ext4 /dev/data-vg/app-lv\nsudo mkdir /opt/app\nsudo mount /dev/data-vg/app-lv /opt/app\n\n# В fstab:\n# /dev/data-vg/app-lv /opt/app ext4 defaults 0 2' },
        { type: 'heading', value: 'Изменение размеров LVM' },
        { type: 'code', language: 'bash', value: '# Увеличить LV (ОНЛАЙН, без остановки):\nsudo lvextend -L +20G /dev/data-vg/app-lv\n# Или увеличить до конкретного размера:\nsudo lvextend -L 100G /dev/data-vg/app-lv\n\n# Расширить файловую систему:\nsudo resize2fs /dev/data-vg/app-lv   # для ext4\nsudo xfs_growfs /opt/app              # для XFS\n\n# Или одной командой (extend + resize):\nsudo lvextend -r -L +20G /dev/data-vg/app-lv\n# -r автоматически расширит ФС\n\n# Добавить новый диск в VG:\nsudo pvcreate /dev/sdd\nsudo vgextend data-vg /dev/sdd\nsudo lvextend -r -l +100%FREE /dev/data-vg/app-lv\n\n# Уменьшить LV (ext4, требует umount!):\nsudo umount /opt/app\nsudo e2fsck -f /dev/data-vg/app-lv\nsudo resize2fs /dev/data-vg/app-lv 30G\nsudo lvreduce -L 30G /dev/data-vg/app-lv\nsudo mount /dev/data-vg/app-lv /opt/app' },
        { type: 'tip', value: 'Главное преимущество LVM — увеличение размера раздела ОНЛАЙН, без остановки сервисов. Добавляете новый диск в VG и расширяете LV. Для ext4 и XFS это безопасная операция.' }
      ]
    },
    {
      id: 5,
      title: 'LVM снапшоты',
      type: 'theory',
      content: [
        { type: 'text', value: 'LVM снапшоты — мгновенные копии данных на определённый момент времени. Используются для бэкапов без остановки сервисов, тестирования обновлений с возможностью отката.' },
        { type: 'code', language: 'bash', value: '# Создать снапшот:\nsudo lvcreate -L 5G -s -n app-snap /dev/data-vg/app-lv\n# -s снапшот, -L размер для хранения изменений\n\n# Список снапшотов:\nsudo lvs\n# LV        VG      Attr       LSize  Origin\n# app-lv    data-vg owi-a-s--- 50.00g\n# app-snap  data-vg swi-a-s---  5.00g app-lv\n\n# Монтировать снапшот (для бэкапа):\nsudo mkdir /mnt/snapshot\nsudo mount -o ro /dev/data-vg/app-snap /mnt/snapshot\ntar -czvf backup.tar.gz /mnt/snapshot/\nsudo umount /mnt/snapshot\n\n# Откатиться к снапшоту:\nsudo umount /opt/app\nsudo lvconvert --merge /dev/data-vg/app-snap\nsudo mount /dev/data-vg/app-lv /opt/app\n\n# Удалить снапшот:\nsudo lvremove /dev/data-vg/app-snap' },
        { type: 'note', value: 'Размер снапшота должен быть достаточным для хранения изменений. Если снапшот переполнится — он станет недействительным. Для бэкапа: создали снапшот -> бэкап -> удалили снапшот.' }
      ]
    },
    {
      id: 6,
      title: 'RAID — массивы дисков',
      type: 'theory',
      content: [
        { type: 'text', value: 'RAID объединяет несколько дисков для повышения надёжности (зеркалирование) или производительности (полосование). mdadm — утилита для программного RAID в Linux.' },
        { type: 'code', language: 'bash', value: '# Уровни RAID:\n# RAID 0 — полосование (striping): скорость x2, нет отказоустойчивости\n# RAID 1 — зеркалирование (mirroring): данные дублируются на 2 диска\n# RAID 5 — полосование с чётностью: нужно 3+ диска, переживёт потерю 1\n# RAID 10 — зеркало + полосование: нужно 4+ диска, лучшая производительность\n\nsudo apt install mdadm\n\n# Создать RAID 1 (зеркало):\nsudo mdadm --create /dev/md0 --level=1 --raid-devices=2 /dev/sdb /dev/sdc\n\n# Проверить статус:\ncat /proc/mdstat\n# md0 : active raid1 sdc[1] sdb[0]\n#       104320 blocks super 1.2 [2/2] [UU]\n\nsudo mdadm --detail /dev/md0\n\n# Использовать как обычный диск:\nsudo mkfs.ext4 /dev/md0\nsudo mount /dev/md0 /mnt/raid\n\n# Сохранить конфигурацию:\nsudo mdadm --detail --scan | sudo tee -a /etc/mdadm/mdadm.conf\nsudo update-initramfs -u\n\n# Замена неисправного диска:\nsudo mdadm --manage /dev/md0 --remove /dev/sdb  # удалить сбойный\nsudo mdadm --manage /dev/md0 --add /dev/sdd     # добавить новый\n# Ребилд начнётся автоматически' },
        { type: 'tip', value: 'RAID 1 — минимум для production серверов. Зеркалирование защищает от выхода из строя одного диска. RAID не заменяет бэкапы! RAID защищает от аппаратных сбоев, бэкапы — от человеческих ошибок.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Управление дисками',
      type: 'practice',
      difficulty: 'hard',
      description: 'Настройте LVM и управляйте файловыми системами.',
      requirements: [
        'Выведите информацию обо всех дисках и разделах системы',
        'Проверьте текущее использование файловых систем',
        'Покажите текущие LVM тома (если есть) или опишите команды создания',
        'Добавьте запись в /etc/fstab для нового раздела (используя UUID)',
        'Проверьте fstab командой mount -a',
        'Напишите скрипт мониторинга свободного места на дисках'
      ],
      hint: 'lsblk -f для дисков. df -Th для использования. pvs, vgs, lvs для LVM. blkid для UUID. mount -a для проверки fstab.',
      expectedOutput: 'lsblk: список дисков с типами ФС\ndf -Th: использование с типами ФС\npvs/vgs/lvs: LVM структура\nfstab: запись с UUID добавлена\nmount -a: ошибок нет\nСкрипт: предупреждение при использовании > 80%',
      solution: '# 1. Информация о дисках\nlsblk -f\nsudo fdisk -l\n\n# 2. Использование ФС\ndf -Th\ndf -h --output=source,fstype,size,used,avail,pcent,target\n\n# 3. LVM информация\nsudo pvs 2>/dev/null || echo "LVM: нет Physical Volumes"\nsudo vgs 2>/dev/null || echo "LVM: нет Volume Groups"\nsudo lvs 2>/dev/null || echo "LVM: нет Logical Volumes"\n\n# 4-5. fstab (пример)\n# sudo blkid /dev/sdb1\n# echo "UUID=xxx /mnt/data ext4 defaults 0 2" | sudo tee -a /etc/fstab\n# sudo mount -a\n\n# 6. Скрипт мониторинга\ncat << \'SCRIPT\'\n#!/bin/bash\nTHRESHOLD=80\ndf -h --output=target,pcent | tail -n +2 | while read MOUNT USAGE; do\n    PERCENT=${USAGE%\\%}\n    if [[ $PERCENT -gt $THRESHOLD ]]; then\n        echo "ВНИМАНИЕ: $MOUNT использован на ${USAGE}"\n    fi\ndone\nSCRIPT',
      explanation: 'lsblk -f показывает файловые системы и UUID. df -Th — использование с типом ФС. pvs/vgs/lvs — LVM-структура. UUID в fstab предотвращает проблемы при изменении порядка дисков. mount -a проверяет fstab без перезагрузки.'
    }
  ]
}
