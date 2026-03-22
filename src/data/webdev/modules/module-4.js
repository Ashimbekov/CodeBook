export default {
  id: 4,
  title: 'HTML: семантика',
  description: 'Семантические теги header, nav, main, article, section — как правильно структурировать страницу',
  lessons: [
    {
      id: 1,
      title: 'Что такое семантический HTML?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Семантический HTML — это использование тегов, которые несут смысловую нагрузку. Тег не только отображает контент, но и описывает его роль на странице.' },
        { type: 'heading', value: 'Несемантический vs Семантический' },
        { type: 'code', language: 'html', value: '<!-- Несемантический подход (плохо) -->\n<div class="header">\n  <div class="nav">...</div>\n</div>\n<div class="main">\n  <div class="article">...</div>\n</div>\n<div class="footer">...</div>\n\n<!-- Семантический подход (хорошо) -->\n<header>\n  <nav>...</nav>\n</header>\n<main>\n  <article>...</article>\n</main>\n<footer>...</footer>' },
        { type: 'heading', value: 'Зачем нужна семантика?' },
        { type: 'list', items: [
          'SEO: поисковики лучше понимают структуру страницы',
          'Доступность: скринридеры используют теги для навигации',
          'Читаемость кода: другим разработчикам легче понять структуру',
          'Стилизация: браузер даёт некоторые стили по умолчанию'
        ]}
      ]
    },
    {
      id: 2,
      title: 'Header, Nav и Footer',
      type: 'theory',
      content: [
        { type: 'text', value: '<header> содержит вводную информацию или навигацию. <nav> — блок навигационных ссылок. <footer> — подвал страницы или секции.' },
        { type: 'code', language: 'html', value: '<header>\n  <a href="/" class="logo">\n    <img src="logo.svg" alt="Название компании">\n  </a>\n  <nav>\n    <ul>\n      <li><a href="/">Главная</a></li>\n      <li><a href="/about">О нас</a></li>\n      <li><a href="/services">Услуги</a></li>\n      <li><a href="/contact">Контакты</a></li>\n    </ul>\n  </nav>\n</header>\n\n<!-- ... основной контент ... -->\n\n<footer>\n  <p>&copy; 2024 Моя компания. Все права защищены.</p>\n  <nav>\n    <a href="/privacy">Политика конфиденциальности</a>\n    <a href="/terms">Условия использования</a>\n  </nav>\n</footer>' },
        { type: 'note', value: 'На странице может быть несколько <header> и <footer> — они могут принадлежать <article> или <section>, не только всей странице.' }
      ]
    },
    {
      id: 3,
      title: 'Main, Article и Section',
      type: 'theory',
      content: [
        { type: 'text', value: '<main> — главный уникальный контент страницы. <article> — самостоятельная единица контента. <section> — тематическая группа контента.' },
        { type: 'code', language: 'html', value: '<main>\n  <!-- Блог: список статей -->\n  <section>\n    <h2>Последние статьи</h2>\n    \n    <article>\n      <header>\n        <h3>Как выучить HTML за 30 дней</h3>\n        <time datetime="2024-01-15">15 января 2024</time>\n      </header>\n      <p>Текст статьи...</p>\n      <footer>\n        <a href="/post/1">Читать полностью</a>\n      </footer>\n    </article>\n    \n    <article>\n      <header>\n        <h3>CSS Grid vs Flexbox</h3>\n        <time datetime="2024-01-10">10 января 2024</time>\n      </header>\n      <p>Текст статьи...</p>\n    </article>\n  </section>\n  \n  <section>\n    <h2>Популярные темы</h2>\n    <!-- ... -->\n  </section>\n</main>' },
        { type: 'tip', value: 'Простое правило: <article> — если контент можно перенести на другой сайт и он останется понятным (новость, пост, комментарий). <section> — если это часть страницы, нуждающаяся в заголовке.' }
      ]
    },
    {
      id: 4,
      title: 'Aside, Figure, Time и другие семантические теги',
      type: 'theory',
      content: [
        { type: 'text', value: 'В HTML5 есть много других семантических тегов для специфических ситуаций.' },
        { type: 'code', language: 'html', value: '<!-- aside: сайдбар или дополнительный контент -->\n<aside>\n  <h3>Об авторе</h3>\n  <p>Нурдаулет — веб-разработчик из Астаны.</p>\n</aside>\n\n<!-- figure и figcaption: изображение с подписью -->\n<figure>\n  <img src="diagram.png" alt="Схема работы сети">\n  <figcaption>Рис. 1 — Схема работы компьютерной сети</figcaption>\n</figure>\n\n<!-- time: дата и время -->\n<time datetime="2024-03-21T10:30">21 марта в 10:30</time>\n\n<!-- address: контактная информация -->\n<address>\n  <a href="mailto:hello@example.com">hello@example.com</a>\n  <br>г. Астана, ул. Примерная, д. 1\n</address>\n\n<!-- mark: выделение текста -->\n<p>В ответе нужно найти <mark>главное слово</mark>.</p>\n\n<!-- details и summary: спойлер -->\n<details>\n  <summary>Показать ответ</summary>\n  <p>Правильный ответ: 42</p>\n</details>' },
        { type: 'tip', value: '<details> и <summary> работают без JavaScript — браузер сам скрывает и показывает содержимое. Отлично для FAQ-разделов.' }
      ]
    },
    {
      id: 5,
      title: 'Практика: Семантическая страница блога',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай HTML-страницу блога с правильной семантической разметкой.',
      requirements: [
        'Шапка сайта (header) с логотипом и навигацией (nav)',
        'Основной контент (main) с двумя статьями (article)',
        'Каждая статья имеет header с заголовком h2 и time',
        'Сайдбар (aside) с разделом "О блоге"',
        'Подвал (footer) с копирайтом',
        'Не использовать <div> там, где подходит семантический тег'
      ],
      expectedOutput: 'Семантически правильная страница блога',
      hint: 'Начни с общей структуры: header > main > footer. Внутри main поставь section с двумя article. Aside можно расположить рядом с section внутри main.',
      solution: '<!DOCTYPE html>\n<html lang="ru">\n<head>\n  <meta charset="UTF-8">\n  <title>Мой Блог</title>\n</head>\n<body>\n  <header>\n    <h1><a href="/">Мой Блог</a></h1>\n    <nav>\n      <ul>\n        <li><a href="/">Главная</a></li>\n        <li><a href="/about">Обо мне</a></li>\n      </ul>\n    </nav>\n  </header>\n  <main>\n    <section>\n      <h2>Последние записи</h2>\n      <article>\n        <header>\n          <h3>Мой первый пост о HTML</h3>\n          <time datetime="2024-03-01">1 марта 2024</time>\n        </header>\n        <p>HTML — это основа любого сайта. Без него невозможно создать ни одну веб-страницу.</p>\n        <footer><a href="/post/1">Читать далее</a></footer>\n      </article>\n      <article>\n        <header>\n          <h3>Почему CSS важен</h3>\n          <time datetime="2024-03-10">10 марта 2024</time>\n        </header>\n        <p>CSS делает страницу красивой и удобной для пользователя.</p>\n        <footer><a href="/post/2">Читать далее</a></footer>\n      </article>\n    </section>\n    <aside>\n      <h2>О блоге</h2>\n      <p>Здесь я пишу о веб-разработке для начинающих.</p>\n    </aside>\n  </main>\n  <footer>\n    <p>&copy; 2024 Мой Блог</p>\n  </footer>\n</body>\n</html>',
      explanation: 'Семантическая разметка делает код понятным и для людей, и для машин. header, main, footer — основные блоки страницы. article — самостоятельный контент. aside — дополнительная информация. section — тематическая группа.'
    },
    {
      id: 6,
      title: 'Практика: Аудит семантики',
      type: 'practice',
      difficulty: 'medium',
      description: 'Перепиши несемантический HTML в семантический.',
      requirements: [
        'Замени все <div class="header"> на семантические теги',
        'Замени <div class="nav"> на <nav>',
        'Замени <div class="article"> на <article>',
        'Замени <div class="sidebar"> на <aside>',
        'Замени <div class="footer"> на <footer>',
        'Добавь time для дат'
      ],
      expectedOutput: 'Семантически правильный HTML без лишних div',
      hint: 'Читай класс div — обычно он подсказывает, какой семантический тег использовать.',
      solution: '<!-- Было (несемантический) -->\n<!-- <div class="header"><div class="nav">...</div></div> -->\n<!-- <div class="main"><div class="article">...</div></div> -->\n<!-- <div class="sidebar">...</div> -->\n<!-- <div class="footer">...</div> -->\n\n<!-- Стало (семантический) -->\n<!DOCTYPE html>\n<html lang="ru">\n<head><meta charset="UTF-8"><title>Страница</title></head>\n<body>\n  <header>\n    <nav>\n      <ul>\n        <li><a href="/">Главная</a></li>\n        <li><a href="/blog">Блог</a></li>\n      </ul>\n    </nav>\n  </header>\n  <main>\n    <article>\n      <h1>Заголовок статьи</h1>\n      <time datetime="2024-03-15">15 марта 2024</time>\n      <p>Текст статьи...</p>\n    </article>\n    <aside>\n      <h2>Похожие статьи</h2>\n    </aside>\n  </main>\n  <footer>\n    <p>&copy; 2024</p>\n  </footer>\n</body>\n</html>',
      explanation: 'Семантические теги не только заменяют div — они добавляют смысл. Поисковые роботы и скринридеры понимают структуру страницы, не читая атрибуты class. Это улучшает SEO и доступность.'
    }
  ]
}
