export default {
  id: 5,
  title: 'HTML: таблицы и медиа',
  description: 'Таблицы для табличных данных, изображения, видео и аудио — мультимедиа в HTML',
  lessons: [
    {
      id: 1,
      title: 'Таблицы: базовая структура',
      type: 'theory',
      content: [
        { type: 'text', value: 'Таблицы предназначены для отображения табличных данных — расписаний, прайс-листов, сравнительных характеристик. Не используй таблицы для вёрстки!' },
        { type: 'code', language: 'html', value: '<table>\n  <thead>\n    <tr>\n      <th>Имя</th>\n      <th>Возраст</th>\n      <th>Город</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Алина</td>\n      <td>25</td>\n      <td>Алматы</td>\n    </tr>\n    <tr>\n      <td>Берик</td>\n      <td>30</td>\n      <td>Астана</td>\n    </tr>\n  </tbody>\n  <tfoot>\n    <tr>\n      <td colspan="3">Всего: 2 записи</td>\n    </tr>\n  </tfoot>\n</table>' },
        { type: 'list', items: [
          '<table> — контейнер таблицы',
          '<thead> — шапка таблицы с заголовками',
          '<tbody> — тело таблицы с данными',
          '<tfoot> — подвал таблицы (итоги)',
          '<tr> — строка (table row)',
          '<th> — ячейка заголовка (table header)',
          '<td> — ячейка данных (table data)'
        ]}
      ]
    },
    {
      id: 2,
      title: 'Объединение ячеек таблицы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Ячейки таблицы можно объединять по горизонтали (colspan) и по вертикали (rowspan).' },
        { type: 'code', language: 'html', value: '<table border="1">\n  <tr>\n    <th rowspan="2">Имя</th>\n    <th colspan="2">Оценки</th>\n  </tr>\n  <tr>\n    <th>Математика</th>\n    <th>Физика</th>\n  </tr>\n  <tr>\n    <td>Айгерим</td>\n    <td>5</td>\n    <td>4</td>\n  </tr>\n  <tr>\n    <td>Данияр</td>\n    <td>4</td>\n    <td>5</td>\n  </tr>\n</table>' },
        { type: 'tip', value: 'rowspan="2" означает, что ячейка занимает 2 строки. colspan="2" — 2 колонки. При использовании rowspan не добавляй лишние ячейки в строки ниже — их место уже занято.' },
        { type: 'heading', value: 'Доступность таблиц' },
        { type: 'code', language: 'html', value: '<table>\n  <caption>Расписание занятий на неделю</caption>\n  <thead>\n    <tr>\n      <th scope="col">Время</th>\n      <th scope="col">Понедельник</th>\n      <th scope="col">Вторник</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <th scope="row">9:00</th>\n      <td>Математика</td>\n      <td>Физика</td>\n    </tr>\n  </tbody>\n</table>' }
      ]
    },
    {
      id: 3,
      title: 'Изображения: адаптивность и форматы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Современный веб требует адаптивных изображений. Тег <picture> и атрибут srcset позволяют загружать разные изображения для разных экранов.' },
        { type: 'code', language: 'html', value: '<!-- Простое изображение -->\n<img src="photo.jpg" alt="Описание" width="800" height="600">\n\n<!-- Адаптивное изображение через srcset -->\n<img\n  src="photo-800.jpg"\n  srcset="photo-400.jpg 400w,\n          photo-800.jpg 800w,\n          photo-1600.jpg 1600w"\n  sizes="(max-width: 600px) 400px, 800px"\n  alt="Описание">\n\n<!-- Тег picture: разные форматы и размеры -->\n<picture>\n  <source media="(min-width: 800px)" srcset="hero-large.webp" type="image/webp">\n  <source media="(min-width: 800px)" srcset="hero-large.jpg">\n  <source srcset="hero-small.webp" type="image/webp">\n  <img src="hero-small.jpg" alt="Герой страницы">\n</picture>' },
        { type: 'heading', value: 'Форматы изображений' },
        { type: 'list', items: [
          'JPEG/JPG — фотографии, много цветов, с потерей качества',
          'PNG — логотипы, иконки, с прозрачностью',
          'WebP — современный формат Google, меньше весит, чем JPEG/PNG',
          'SVG — векторная графика, масштабируется без потери качества',
          'AVIF — самый новый формат, самое лучшее сжатие'
        ]},
        { type: 'tip', value: 'Используй WebP вместо JPEG/PNG там, где возможно. WebP весит на 25-30% меньше при том же качестве.' }
      ]
    },
    {
      id: 4,
      title: 'Видео и аудио',
      type: 'theory',
      content: [
        { type: 'text', value: 'HTML5 добавил теги <video> и <audio> для нативного воспроизведения медиа без Flash или сторонних плагинов.' },
        { type: 'code', language: 'html', value: '<!-- Видео -->\n<video\n  src="movie.mp4"\n  width="800"\n  height="450"\n  controls\n  autoplay\n  muted\n  loop\n  poster="preview.jpg">\n  Ваш браузер не поддерживает видео.\n</video>\n\n<!-- Видео с несколькими форматами (резервные) -->\n<video controls poster="preview.jpg">\n  <source src="movie.webm" type="video/webm">\n  <source src="movie.mp4" type="video/mp4">\n  <p>Ваш браузер не поддерживает видео.</p>\n</video>\n\n<!-- Аудио -->\n<audio controls>\n  <source src="song.ogg" type="audio/ogg">\n  <source src="song.mp3" type="audio/mpeg">\n  Ваш браузер не поддерживает аудио.\n</audio>' },
        { type: 'list', items: [
          'controls — показывает встроенные кнопки управления',
          'autoplay — автовоспроизведение (часто блокируется браузером)',
          'muted — без звука (нужно для autoplay)',
          'loop — повторять воспроизведение',
          'poster — изображение до начала воспроизведения',
          'preload="none/metadata/auto" — стратегия предзагрузки'
        ]}
      ]
    },
    {
      id: 5,
      title: 'Iframe: встраивание внешнего контента',
      type: 'theory',
      content: [
        { type: 'text', value: '<iframe> позволяет встраивать другие веб-страницы или сервисы (YouTube, Google Maps, презентации) прямо в твою страницу.' },
        { type: 'code', language: 'html', value: '<!-- YouTube видео -->\n<iframe\n  width="560"\n  height="315"\n  src="https://www.youtube.com/embed/VIDEO_ID"\n  title="Название видео"\n  frameborder="0"\n  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"\n  allowfullscreen>\n</iframe>\n\n<!-- Google Maps -->\n<iframe\n  src="https://maps.google.com/maps?q=Астана&output=embed"\n  width="600"\n  height="450"\n  style="border:0"\n  loading="lazy"\n  allowfullscreen>\n</iframe>' },
        { type: 'warning', value: 'Встраивай только доверенные источники в iframe. Вредоносный сайт в iframe может попытаться обмануть пользователей (clickjacking). Используй атрибут sandbox для ограничений.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Мультимедийная страница',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай страницу с таблицей данных, адаптивным изображением и встроенным видео.',
      requirements: [
        'Таблица расписания (минимум 3 строки, 3 столбца) с thead и tbody',
        'Объединение ячеек через colspan или rowspan',
        'Адаптивное изображение с атрибутом alt',
        'Тег picture с несколькими source',
        'Тег video или iframe с YouTube-видео',
        'Подписи к изображению через figure и figcaption'
      ],
      expectedOutput: 'Страница с таблицей, адаптивным фото и видео',
      hint: 'Для таблицы используй caption для заголовка. Для фото — figure > img + figcaption. Для видео можно использовать iframe от YouTube.',
      solution: '<!DOCTYPE html>\n<html lang="ru">\n<head>\n  <meta charset="UTF-8">\n  <title>Медиастраница</title>\n</head>\n<body>\n  <h1>Расписание и медиа</h1>\n  <table>\n    <caption>Расписание занятий</caption>\n    <thead>\n      <tr>\n        <th scope="col">День</th>\n        <th scope="col">Предмет</th>\n        <th scope="col">Время</th>\n      </tr>\n    </thead>\n    <tbody>\n      <tr>\n        <td rowspan="2">Понедельник</td>\n        <td>HTML/CSS</td>\n        <td>10:00-12:00</td>\n      </tr>\n      <tr>\n        <td>JavaScript</td>\n        <td>14:00-16:00</td>\n      </tr>\n      <tr>\n        <td>Вторник</td>\n        <td colspan="2">Практика и проекты</td>\n      </tr>\n    </tbody>\n  </table>\n  <figure>\n    <picture>\n      <source media="(min-width: 800px)" srcset="large.webp" type="image/webp">\n      <img src="small.jpg" alt="Обучение веб-разработке">\n    </picture>\n    <figcaption>Современное рабочее место веб-разработчика</figcaption>\n  </figure>\n  <h2>Видеоурок</h2>\n  <iframe\n    width="560" height="315"\n    src="https://www.youtube.com/embed/dQw4w9WgXcQ"\n    title="Пример видео"\n    frameborder="0"\n    allowfullscreen>\n  </iframe>\n</body>\n</html>',
      explanation: 'Таблицы с thead/tbody/tfoot и scope у th улучшают доступность. figure+figcaption связывает изображение с его описанием. picture позволяет браузеру выбрать оптимальный формат и размер изображения.'
    }
  ]
}
