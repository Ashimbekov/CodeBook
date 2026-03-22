export default {
  id: 26,
  title: 'Практикум: HTML/CSS',
  description: 'Практические задания по HTML и CSS — от простых компонентов до полных лэйаутов',
  lessons: [
    {
      id: 1,
      title: 'Практика: Карточка профиля',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создай карточку профиля пользователя с аватаром, именем, должностью и соцсетями.',
      requirements: [
        'Аватар круглой формы (border-radius: 50%)',
        'Имя в h2, должность в p с другим цветом',
        'Иконки социальных сетей (можно эмодзи или текст)',
        'Hover-эффект на карточке',
        'Карточка по центру страницы (Flexbox или Grid)'
      ],
      expectedOutput: 'Красивая карточка профиля',
      hint: 'Используй display: flex; flex-direction: column; align-items: center; для выравнивания содержимого.',
      solution: '<!-- HTML -->\n<div class="profile-card">\n  <img src="https://i.pravatar.cc/100" alt="Аватар" class="avatar">\n  <h2 class="name">Алина Сейткали</h2>\n  <p class="role">Frontend-разработчик</p>\n  <p class="bio">Создаю красивые интерфейсы с любовью к деталям</p>\n  <div class="social">\n    <a href="#">GitHub</a>\n    <a href="#">LinkedIn</a>\n    <a href="#">Twitter</a>\n  </div>\n</div>\n\n/* CSS */\nbody {\n  min-height: 100vh;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: linear-gradient(135deg, #667eea, #764ba2);\n}\n\n.profile-card {\n  background: white;\n  border-radius: 20px;\n  padding: 40px;\n  text-align: center;\n  width: 280px;\n  box-shadow: 0 20px 60px rgba(0,0,0,0.2);\n  transition: transform 0.3s ease;\n}\n\n.profile-card:hover { transform: translateY(-8px); }\n\n.avatar {\n  width: 100px; height: 100px;\n  border-radius: 50%;\n  border: 4px solid #667eea;\n  margin-bottom: 16px;\n}\n\n.name { font-size: 22px; margin-bottom: 4px; }\n.role { color: #667eea; font-size: 14px; margin-bottom: 12px; }\n.bio { color: #666; font-size: 13px; line-height: 1.5; margin-bottom: 20px; }\n\n.social { display: flex; gap: 12px; justify-content: center; }\n.social a {\n  padding: 6px 12px;\n  background: #f0f0ff;\n  color: #667eea;\n  border-radius: 20px;\n  font-size: 12px;\n  text-decoration: none;\n  transition: background 0.2s;\n}\n.social a:hover { background: #667eea; color: white; }',
      explanation: 'Карточка профиля — классический компонент UI. Gradient на body создаёт красивый фон. border-radius: 50% делает аватар круглым. Transition на transform создаёт плавный lift-эффект при hover.'
    },
    {
      id: 2,
      title: 'Практика: Навигационное меню',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создай горизонтальное навигационное меню с подсветкой активного пункта.',
      requirements: [
        'Лого слева, навигация справа (Flexbox)',
        'Ссылки с hover-эффектом',
        'Активный пункт выделен (другой цвет/граница)',
        'Фиксированный навбар при скролле',
        'Тень при скролле страницы'
      ],
      expectedOutput: 'Фиксированный навбар с активными ссылками',
      hint: 'position: fixed; top: 0; width: 100% для фиксации. JavaScript на scroll для добавления тени.',
      solution: '<!-- HTML -->\n<nav id="navbar">\n  <a href="#" class="logo">WebDev</a>\n  <ul class="nav-links">\n    <li><a href="#" class="active">Главная</a></li>\n    <li><a href="#">О нас</a></li>\n    <li><a href="#">Услуги</a></li>\n    <li><a href="#">Блог</a></li>\n    <li><a href="#" class="btn-cta">Контакт</a></li>\n  </ul>\n</nav>\n\n/* CSS */\n* { box-sizing: border-box; margin: 0; padding: 0; }\n\nnav {\n  position: fixed; top: 0; left: 0; right: 0;\n  display: flex; align-items: center; justify-content: space-between;\n  padding: 0 48px; height: 64px;\n  background: white;\n  transition: box-shadow 0.3s;\n  z-index: 100;\n}\n\nnav.scrolled { box-shadow: 0 2px 20px rgba(0,0,0,0.1); }\n\n.logo { font-size: 22px; font-weight: 700; color: #4f46e5; text-decoration: none; }\n\n.nav-links { list-style: none; display: flex; gap: 8px; }\n\n.nav-links a {\n  padding: 8px 16px; border-radius: 8px;\n  color: #555; text-decoration: none; font-size: 15px;\n  transition: background 0.2s, color 0.2s;\n}\n\n.nav-links a:hover { background: #f0f0ff; color: #4f46e5; }\n.nav-links a.active { background: #4f46e5; color: white; }\n\n.btn-cta {\n  background: #4f46e5 !important;\n  color: white !important;\n  border-radius: 8px;\n}\n\n// JavaScript\nwindow.addEventListener("scroll", () => {\n  document.getElementById("navbar")\n    .classList.toggle("scrolled", window.scrollY > 10);\n});',
      explanation: 'position: fixed + z-index: 100 держит навбар поверх всего. JavaScript добавляет класс .scrolled при прокрутке, что добавляет тень. transition на box-shadow делает появление тени плавным.'
    },
    {
      id: 3,
      title: 'Практика: Сетка услуг (Features grid)',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создай раздел с карточками услуг или преимуществ в адаптивной сетке.',
      requirements: [
        'Минимум 6 карточек с иконкой, заголовком и описанием',
        'Grid с auto-fit и minmax для адаптивности',
        'Hover-анимация на карточках',
        'Заголовок секции по центру',
        'Без media queries (только auto-fit)'
      ],
      expectedOutput: 'Адаптивная сетка карточек услуг',
      hint: 'grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)) создаёт адаптивную сетку автоматически.',
      solution: '<!-- HTML -->\n<section class="features">\n  <h2>Наши преимущества</h2>\n  <div class="features-grid">\n    <div class="feature-card">\n      <div class="icon">🚀</div>\n      <h3>Быстро</h3>\n      <p>Оптимизированный код и быстрая загрузка сайтов</p>\n    </div>\n    <!-- ещё 5 карточек -->\n  </div>\n</section>\n\n/* CSS */\n.features { padding: 80px 24px; }\n.features h2 { text-align: center; font-size: 36px; margin-bottom: 48px; }\n\n.features-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));\n  gap: 24px;\n  max-width: 1200px;\n  margin: 0 auto;\n}\n\n.feature-card {\n  padding: 32px 24px;\n  border: 1px solid #e8e8f0;\n  border-radius: 16px;\n  text-align: center;\n  transition: transform 0.2s, box-shadow 0.2s;\n}\n\n.feature-card:hover {\n  transform: translateY(-6px);\n  box-shadow: 0 16px 40px rgba(0,0,0,0.1);\n}\n\n.icon { font-size: 40px; margin-bottom: 16px; }\n.feature-card h3 { font-size: 20px; margin-bottom: 8px; }\n.feature-card p { color: #666; line-height: 1.6; }',
      explanation: 'auto-fit + minmax — мощная комбинация для адаптивных сеток без @media. Карточки сами выстраиваются в оптимальное количество колонок.'
    },
    {
      id: 4,
      title: 'Практика: Форма обратной связи',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай красивую форму обратной связи с полями и стилизацией состояний.',
      requirements: [
        'Поля: имя, email, тема (select), сообщение (textarea)',
        'Стили для :focus состояния',
        'Стили для :valid и :invalid состояний',
        'Кнопка отправки с hover и active состоянием',
        'Красивый контейнер с тенью'
      ],
      expectedOutput: 'Стильная форма обратной связи',
      hint: 'input:focus { border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(79,70,229,0.2); } — популярный паттерн для фокуса.',
      solution: '/* CSS для формы */\n.contact-form {\n  max-width: 560px; margin: 40px auto;\n  background: white; border-radius: 16px;\n  padding: 40px; box-shadow: 0 8px 32px rgba(0,0,0,0.1);\n}\n\n.form-group { margin-bottom: 20px; }\n\nlabel {\n  display: block; font-size: 14px; font-weight: 500;\n  margin-bottom: 6px; color: #333;\n}\n\ninput, select, textarea {\n  width: 100%; padding: 10px 14px;\n  border: 2px solid #e2e8f0; border-radius: 8px;\n  font-size: 15px; outline: none;\n  transition: border-color 0.2s, box-shadow 0.2s;\n}\n\ninput:focus, select:focus, textarea:focus {\n  border-color: #4f46e5;\n  box-shadow: 0 0 0 3px rgba(79,70,229,0.15);\n}\n\ninput:valid { border-color: #10b981; }\ninput:invalid:not(:placeholder-shown) { border-color: #ef4444; }\n\ntextarea { resize: vertical; min-height: 120px; }\n\n.submit-btn {\n  width: 100%; padding: 14px;\n  background: #4f46e5; color: white; border: none;\n  border-radius: 8px; font-size: 16px; cursor: pointer;\n  transition: background 0.2s, transform 0.1s;\n}\n\n.submit-btn:hover { background: #4338ca; }\n.submit-btn:active { transform: scale(0.98); }',
      explanation: ':valid/:invalid с :not(:placeholder-shown) — отличный трюк: показываем ошибки только если поле не пустое (иначе все поля сразу красные при загрузке). 3px box-shadow — распространённый паттерн для красивого фокуса.'
    },
    {
      id: 5,
      title: 'Практика: Hero-секция лендинга',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай эффектную hero-секцию с заголовком, описанием, кнопками и фоновым изображением.',
      requirements: [
        'Полноэкранная секция (min-height: 100vh)',
        'Градиентный или изображение-фон',
        'Заголовок с gradient text',
        'Две кнопки (primary и secondary)',
        'Текст и кнопки по центру (Flexbox)',
        'Адаптивность (меньший шрифт на мобильном)'
      ],
      expectedOutput: 'Эффектная hero-секция',
      hint: 'Для gradient text: background: linear-gradient(...); -webkit-background-clip: text; -webkit-text-fill-color: transparent;',
      solution: '/* CSS */\n.hero {\n  min-height: 100vh;\n  background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);\n  display: flex; align-items: center; justify-content: center;\n  text-align: center; padding: 24px;\n}\n\n.hero-content { max-width: 700px; }\n\n.hero h1 {\n  font-size: clamp(2rem, 6vw, 4rem);\n  font-weight: 900; margin-bottom: 20px;\n  background: linear-gradient(135deg, #a78bfa, #60a5fa, #34d399);\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n  background-clip: text;\n}\n\n.hero p {\n  color: rgba(255,255,255,0.7);\n  font-size: clamp(1rem, 2.5vw, 1.25rem);\n  line-height: 1.7; margin-bottom: 40px;\n}\n\n.hero-btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }\n\n.btn-primary {\n  padding: 14px 32px; background: #7c3aed; color: white;\n  border: none; border-radius: 50px; font-size: 16px; cursor: pointer;\n  transition: transform 0.2s, box-shadow 0.2s;\n}\n.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(124,58,237,0.5); }\n\n.btn-secondary {\n  padding: 14px 32px; background: transparent; color: white;\n  border: 2px solid rgba(255,255,255,0.4); border-radius: 50px; font-size: 16px; cursor: pointer;\n  transition: background 0.2s;\n}\n.btn-secondary:hover { background: rgba(255,255,255,0.1); }',
      explanation: 'gradient text — эффектный приём для заголовков. clamp() делает шрифт fluid без media queries. Кнопка-pill (border-radius: 50px) — популярный современный дизайн.'
    },
    {
      id: 6,
      title: 'Практика: Мобильное меню',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай адаптивное меню-гамбургер: на мобильном скрытое за кнопкой, на десктопе — горизонтальное.',
      requirements: [
        'Кнопка-гамбургер с анимацией превращения в X при открытии',
        'Выдвигающееся меню сверху (slideDown анимация)',
        'На десктопе (768px+) кнопка скрыта, меню горизонтальное',
        'Закрытие при клике вне меню',
        'Плавные переходы'
      ],
      expectedOutput: 'Адаптивное меню с гамбургером и анимацией',
      hint: 'Для анимации X используй transform: rotate(45deg) на псевдоэлементах ::before и ::after кнопки.',
      solution: '/* CSS */\n.hamburger {\n  display: flex; flex-direction: column; justify-content: space-between;\n  width: 28px; height: 20px; cursor: pointer; padding: 0;\n  background: none; border: none;\n}\n\n.hamburger span {\n  display: block; height: 2px; background: #333;\n  transition: transform 0.3s, opacity 0.3s;\n  transform-origin: center;\n}\n\n.nav.open .hamburger span:nth-child(1) { transform: translateY(9px) rotate(45deg); }\n.nav.open .hamburger span:nth-child(2) { opacity: 0; }\n.nav.open .hamburger span:nth-child(3) { transform: translateY(-9px) rotate(-45deg); }\n\n.nav-menu {\n  max-height: 0; overflow: hidden;\n  transition: max-height 0.3s ease;\n}\n\n.nav.open .nav-menu { max-height: 300px; }\n\n@media (min-width: 768px) {\n  .hamburger { display: none; }\n  .nav-menu { max-height: none; overflow: visible; display: flex; gap: 24px; }\n}\n\n// JavaScript\nconst nav = document.querySelector("nav");\ndocument.querySelector(".hamburger").addEventListener("click", () => {\n  nav.classList.toggle("open");\n});\ndocument.addEventListener("click", (e) => {\n  if (!nav.contains(e.target)) nav.classList.remove("open");\n});',
      explanation: 'Анимация гамбургера через transform на span — элегантное решение без лишних элементов. max-height: 0 → max-height: 300px анимируется лучше, чем display: none → block. Закрытие по клику вне — важная UX-деталь.'
    },
    {
      id: 7,
      title: 'Практика: Аккордеон (FAQ)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай секцию FAQ с аккордеоном — раскрывающимися ответами.',
      requirements: [
        'Список вопросов-ответов',
        'Клик на вопрос открывает/закрывает ответ',
        'Открыт только один вопрос одновременно',
        'Анимация открытия (max-height transition)',
        'Стрелка поворачивается при открытии'
      ],
      expectedOutput: 'Интерактивный FAQ с аккордеоном',
      hint: 'Используй details/summary — это нативный HTML аккордеон без JS! Или реализуй через JS и max-height.',
      solution: '<!-- HTML (нативный вариант) -->\n<details class="faq-item">\n  <summary class="faq-question">Что такое веб-разработка?</summary>\n  <div class="faq-answer">\n    <p>Веб-разработка — создание сайтов и веб-приложений для интернета.</p>\n  </div>\n</details>\n\n/* CSS */\n.faq-item {\n  border: 1px solid #e2e8f0; border-radius: 10px;\n  margin-bottom: 8px; overflow: hidden;\n}\n\n.faq-question {\n  padding: 18px 20px; cursor: pointer;\n  font-weight: 600; list-style: none;\n  display: flex; justify-content: space-between; align-items: center;\n  user-select: none;\n}\n\n.faq-question::after {\n  content: "+";\n  font-size: 20px; transition: transform 0.2s;\n}\n\n.faq-item[open] .faq-question::after { transform: rotate(45deg); }\n\n.faq-answer {\n  padding: 0 20px 18px;\n  color: #555; line-height: 1.7;\n  border-top: 1px solid #e2e8f0;\n  padding-top: 16px;\n}',
      explanation: 'details/summary — нативный HTML-аккордеон без JavaScript! [open] селектор позволяет стилизовать открытое состояние. Для кастомного поведения (только один открыт) — JavaScript нужен.'
    },
    {
      id: 8,
      title: 'Практика: Карточки с flip-анимацией',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай карточки, которые переворачиваются при hover, показывая обратную сторону.',
      requirements: [
        'Карточка переворачивается при :hover',
        'Лицевая сторона: фото и название',
        'Обратная сторона: описание и кнопка',
        'Плавная 3D-анимация переворота',
        'Минимум 3 карточки в сетке'
      ],
      expectedOutput: 'Карточки с 3D flip-анимацией',
      hint: 'perspective на контейнере, transform-style: preserve-3d на карточке, rotateY(180deg) для оборота. backface-visibility: hidden скрывает обратную сторону.',
      solution: '/* CSS */\n.cards-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));\n  gap: 24px; padding: 40px;\n}\n\n.card-flip {\n  height: 320px;\n  perspective: 1000px;\n  cursor: pointer;\n}\n\n.card-inner {\n  width: 100%; height: 100%;\n  position: relative;\n  transform-style: preserve-3d;\n  transition: transform 0.6s ease;\n}\n\n.card-flip:hover .card-inner {\n  transform: rotateY(180deg);\n}\n\n.card-front, .card-back {\n  position: absolute; inset: 0;\n  backface-visibility: hidden;\n  border-radius: 16px; overflow: hidden;\n}\n\n.card-front {\n  background: #1a1a2e;\n  display: flex; flex-direction: column; align-items: center; justify-content: center;\n}\n\n.card-back {\n  background: linear-gradient(135deg, #4f46e5, #7c3aed);\n  transform: rotateY(180deg);\n  display: flex; flex-direction: column; align-items: center; justify-content: center;\n  padding: 24px; color: white; text-align: center;\n}',
      explanation: 'perspective на родителе создаёт 3D-пространство. transform-style: preserve-3d сохраняет 3D для дочерних элементов. backface-visibility: hidden скрывает элемент когда он смотрит "назад". rotateY(180deg) переворачивает карточку.'
    },
    {
      id: 9,
      title: 'Практика: Таблица данных со стилями',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай таблицу с чередующимися строками, hover-эффектом и сортировкой.',
      requirements: [
        'Таблица с минимум 5 строками данных',
        'Стильный заголовок thead',
        'Чередование фона строк (nth-child)',
        'Hover-эффект на строках',
        'Адаптивность (горизонтальный скролл на мобильном)'
      ],
      expectedOutput: 'Стильная таблица данных',
      hint: 'Для адаптивности: обернуть таблицу в div с overflow-x: auto. sticky для шапки: thead th { position: sticky; top: 0; }',
      solution: '/* CSS */\n.table-wrapper {\n  overflow-x: auto;\n  border-radius: 12px;\n  box-shadow: 0 4px 20px rgba(0,0,0,0.08);\n}\n\ntable {\n  width: 100%; border-collapse: collapse;\n  font-size: 14px;\n}\n\nthead th {\n  background: #4f46e5; color: white;\n  padding: 14px 16px; text-align: left;\n  font-weight: 600;\n  position: sticky; top: 0;\n}\n\ntbody tr {\n  transition: background 0.15s;\n}\n\ntbody tr:nth-child(even) { background: #f8f9ff; }\ntbody tr:hover { background: #eef2ff; }\n\ntd { padding: 12px 16px; border-bottom: 1px solid #f0f0f5; }\n\n.badge {\n  display: inline-block; padding: 3px 10px; border-radius: 20px;\n  font-size: 12px; font-weight: 600;\n}\n\n.badge-green { background: #d1fae5; color: #065f46; }\n.badge-red { background: #fee2e2; color: #991b1b; }',
      explanation: 'overflow-x: auto позволяет таблице горизонтально скроллиться на мобильном. border-collapse: collapse убирает двойные рамки. position: sticky у th "залипает" шапку при скролле. Badges добавляют визуальную информацию о статусе.'
    },
    {
      id: 10,
      title: 'Практика: Полный лендинг',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай одностраничный лендинг: навбар, hero, услуги, о нас, форма, футер.',
      requirements: [
        'Фиксированный навбар с logo и ссылками',
        'Hero-секция с заголовком и кнопками',
        'Секция "услуги" (3-4 карточки в Grid)',
        'Секция "о нас" (текст + изображение в Flexbox/Grid)',
        'Форма обратной связи',
        'Футер с ссылками и копирайтом',
        'Плавная прокрутка к секциям'
      ],
      expectedOutput: 'Полный одностраничный лендинг',
      hint: 'scroll-behavior: smooth на html элементе. Якорные ссылки: href="#section-id". Каждая секция: padding: 80px 24px; max-width: 1200px; margin: 0 auto.',
      solution: '/* Минимальная структура */\nhtml { scroll-behavior: smooth; }\n\n* { box-sizing: border-box; margin: 0; padding: 0; }\nbody { font-family: "Inter", Arial, sans-serif; }\n\n.container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }\n\nsection { padding: 80px 0; }\nsection:nth-child(even) { background: #f8f9ff; }\n\n/* Секции: #hero, #services, #about, #contact */\n\n/* Hero */\n#hero {\n  min-height: 100vh;\n  background: linear-gradient(135deg, #0f0c29, #302b63);\n  display: flex; align-items: center;\n}\n\n/* Services grid */\n.services-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: 24px; margin-top: 48px;\n}\n\n/* About */\n.about-content {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 64px; align-items: center;\n}\n\n@media (max-width: 768px) {\n  .about-content { grid-template-columns: 1fr; }\n}\n\n/* Footer */\nfooter {\n  background: #0f0c29; color: #aaa;\n  padding: 40px 0; text-align: center;\n}',
      explanation: 'Одностраничный лендинг — классический проект для отработки всех CSS-навыков: позиционирование, Flexbox, Grid, адаптивность, анимации. scroll-behavior: smooth делает якорные ссылки плавными без JS.'
    }
  ]
}
