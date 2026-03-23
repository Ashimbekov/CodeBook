export default {
  id: 16,
  title: 'IT-лексика: компьютер и интернет',
  description: 'Компьютерные термины, интернет, браузер, файлы, устройства',
  lessons: [
    {
      id: 1,
      title: 'Компьютер и его части',
      type: 'theory',
      content: [
        { type: 'text', value: 'Начнём с базового словаря компьютерного железа и периферии. Эти слова вы будете слышать каждый день на работе.' },
        { type: 'code', language: 'text', value: 'Устройства:\ncomputer      - компьютер\nlaptop        - ноутбук\ndesktop       - настольный компьютер\ntablet        - планшет\nsmartphone    - смартфон\nserver        - сервер\n\nПериферия:\nmonitor/screen- монитор/экран\nkeyboard      - клавиатура\nmouse         - мышь\nheadphones    - наушники\nmicrophone    - микрофон\nwebcam        - веб-камера\nprinter       - принтер\ncable         - кабель\ncharger       - зарядное устройство\nUSB drive     - USB-накопитель' },
        { type: 'code', language: 'text', value: 'Компоненты:\nCPU (processor) - процессор\nRAM (memory)    - оперативная память\nhard drive / SSD- жёсткий диск / SSD\ngraphics card   - видеокарта\nbattery         - батарея\nfan             - вентилятор\nport            - порт\nUSB port        - USB-порт\nHDMI port       - HDMI-порт\ncharging port   - порт зарядки' }
      ]
    },
    {
      id: 2,
      title: 'Браузер и интернет',
      type: 'theory',
      content: [
        { type: 'text', value: 'Браузер — основной инструмент веб-разработчика. Знание терминологии браузера и интернета обязательно.' },
        { type: 'code', language: 'text', value: 'Браузер:\nbrowser         - браузер\ntab             - вкладка\nwindow          - окно\naddress bar     - адресная строка\nbookmark        - закладка\nhistory         - история браузера\ncache           - кэш\ncookies         - куки\nextension       - расширение\ndevtools        - инструменты разработчика\nincognito mode  - режим инкогнито\n\nДействия в браузере:\nopen a tab      - открыть вкладку\nclose a tab     - закрыть вкладку\nrefresh/reload  - обновить\nscroll          - прокручивать\nclick           - кликнуть\nright-click     - правая кнопка мыши\ndouble-click    - двойной клик\ndrag and drop   - перетащить' }
      ]
    },
    {
      id: 3,
      title: 'Приложения и файлы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Файловая система и работа с приложениями — ежедневные задачи любого разработчика.' },
        { type: 'code', language: 'text', value: 'Файлы и папки:\nfile            - файл\nfolder/directory- папка/директория\npath            - путь\nfilename        - имя файла\nextension       - расширение\nroot folder     - корневая папка\nsubfolder       - подпапка\nhidden file     - скрытый файл\n\nДействия с файлами:\nopen            - открыть\nsave            - сохранить\ncopy            - скопировать\npaste           - вставить\ndelete/remove   - удалить\nmove            - переместить\nrename          - переименовать\ndownload        - скачать\nupload          - загрузить (на сервер)\ncompress/zip    - сжать/заархивировать\nextract/unzip   - распаковать' },
        { type: 'code', language: 'text', value: 'Типы файлов:\n.txt    - текстовый файл\n.js     - JavaScript файл\n.py     - Python файл\n.html   - HTML файл\n.css    - CSS файл\n.json   - JSON файл\n.md     - Markdown файл\n.pdf    - PDF документ\n.png/.jpg - изображение\n.zip    - архив\n.exe    - исполняемый файл (Windows)\n.sh     - shell-скрипт' }
      ]
    },
    {
      id: 4,
      title: 'Приложения и программы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Словарь для работы с программным обеспечением — установка, запуск, обновление приложений.' },
        { type: 'code', language: 'text', value: 'Приложения:\napp / application - приложение\nprogram / software- программа / ПО\noperating system  - операционная система\nOS (Windows/Linux/macOS) - ОС\nmobile app        - мобильное приложение\nweb app           - веб-приложение\ndesktop app       - десктопное приложение\nopen-source app   - приложение с открытым исходным кодом\n\nДействия с программами:\ninstall           - установить\nuninstall / remove- удалить\nupdate / upgrade  - обновить\nlaunch / start    - запустить\nquit / exit       - выйти\nrestart           - перезапустить\nlog in / sign in  - войти\nlog out / sign out- выйти из аккаунта\nregister / sign up- зарегистрироваться' }
      ]
    },
    {
      id: 5,
      title: 'Интернет и сети',
      type: 'theory',
      content: [
        { type: 'text', value: 'Сетевая терминология — обязательный словарь для любого разработчика.' },
        { type: 'code', language: 'text', value: 'Интернет-терминология:\ninternet          - интернет\nwifi              - вайфай\nnetwork           - сеть\nconnection        - подключение\nbandwidth         - пропускная способность\nspeed             - скорость\nlatency           - задержка\nping              - пинг\nserver            - сервер\nclient            - клиент\nhost              - хост\n\nАдреса и протоколы:\nURL (address)     - URL (адрес)\nIP address        - IP-адрес\nHTTP/HTTPS        - протокол\ndomain            - домен\nport              - порт\nSSL certificate   - SSL-сертификат\nVPN               - VPN' },
        { type: 'code', language: 'text', value: 'Облако (Cloud):\ncloud             - облако\ncloud storage     - облачное хранилище\nbackup            - резервная копия\nsync              - синхронизация\nAWS/Azure/GCP     - облачные провайдеры\ncontainer         - контейнер\nvirtual machine (VM) - виртуальная машина\nserverless        - бессерверный' }
      ]
    },
    {
      id: 6,
      title: 'Безопасность и аутентификация',
      type: 'theory',
      content: [
        { type: 'text', value: 'Базовый словарь по безопасности — важен для любого разработчика.' },
        { type: 'code', language: 'text', value: 'Безопасность:\npassword          - пароль\nusername          - имя пользователя\nauthentication    - аутентификация\nauthorization     - авторизация\npermission        - разрешение\naccess            - доступ\nencryption        - шифрование\nsecurity          - безопасность\nvulnerability     - уязвимость\nhack / breach     - взлом / утечка\nfirewall          - файервол\ntwo-factor auth (2FA) - двухфакторная аутентификация\nSSH key           - SSH-ключ\nAPI key           - API-ключ\ntoken             - токен' }
      ]
    },
    {
      id: 7,
      title: 'Практика: IT-лексика компьютер',
      type: 'practice',
      content: [
        {
          type: 'task',
          taskType: 'match',
          question: 'Соедините английские слова с переводами:',
          pairs: [
            { left: 'download', right: 'скачать' },
            { left: 'upload', right: 'загрузить на сервер' },
            { left: 'install', right: 'установить' },
            { left: 'delete', right: 'удалить' }
          ],
          explanation: 'Download — скачать (загрузить к себе). Upload — загрузить (отправить на сервер). Не путайте направление!'
        },
        {
          type: 'task',
          taskType: 'translate',
          question: 'Переведите: "Скачайте и установите приложение."',
          solution: 'Download and install the application.',
          explanation: 'Повелительное наклонение: download (скачайте), install (установите). the application — конкретное приложение.'
        },
        {
          type: 'task',
          taskType: 'multiple_choice',
          question: 'Что такое "cache"?',
          options: ['временная память', 'корзина', 'загрузчик', 'архив'],
          correct: 0,
          explanation: 'Cache [кэш] — временная память, которая хранит часто используемые данные для быстрого доступа.'
        }
      ]
    },
    {
      id: 8,
      title: 'Практика: Действия с файлами и программами',
      type: 'practice',
      content: [
        {
          type: 'task',
          taskType: 'translate',
          question: 'Переведите: "Сохраните файл и закройте приложение."',
          solution: 'Save the file and close the application.',
          explanation: 'save = сохранить, close = закрыть. Повелительное наклонение — просто базовая форма глагола.'
        },
        {
          type: 'task',
          taskType: 'fill_blank',
          question: 'Выберите слово: "I need to ___ (log in/log out) to check my email."',
          solution: 'log in',
          explanation: '"Log in" = войти в систему. "Log out" = выйти. "I need to log in to check my email." — Мне нужно войти, чтобы проверить почту.'
        },
        {
          type: 'task',
          taskType: 'translate',
          question: 'Переведите: "Перезапустите сервер и проверьте соединение."',
          solution: 'Restart the server and check the connection.',
          explanation: 'restart = перезапустить, check = проверить, connection = соединение/подключение.'
        }
      ]
    }
  ]
}
