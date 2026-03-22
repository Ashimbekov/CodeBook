export default {
  id: 28,
  title: 'Практикум: Полные проекты',
  description: 'Полноценные проекты от нуля: лендинг, портфолио, todo-приложение и другие',
  lessons: [
    {
      id: 1,
      title: 'Проект: Лендинг для продукта',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай полноценный лендинг для воображаемого SaaS-продукта.',
      requirements: [
        'Навбар: logo, ссылки, кнопка CTA, мобильный гамбургер',
        'Hero: градиент, большой заголовок, 2 кнопки, mockup-изображение',
        'Features: 6 карточек в Grid с иконками',
        'Pricing: 3 тарифа (Базовый/Профи/Энтерпрайз)',
        'Testimonials: 3 отзыва клиентов в карусели',
        'CTA секция и Footer',
        'Анимации появления при скролле (IntersectionObserver)',
        'Полная адаптивность'
      ],
      expectedOutput: 'Готовый лендинг продукта',
      hint: 'IntersectionObserver: наблюдай за секциями. Когда они входят во вьюпорт — добавляй класс .visible с transition. Pricing: выдели популярный тариф.',
      solution: '// Структура файлов:\n// index.html — разметка\n// css/style.css — все стили\n// js/app.js — анимации и интерактивность\n\n// Анимации появления (IntersectionObserver)\nconst observer = new IntersectionObserver((entries) => {\n  entries.forEach(entry => {\n    if (entry.isIntersecting) {\n      entry.target.classList.add("visible");\n    }\n  });\n}, { threshold: 0.1 });\n\ndocument.querySelectorAll(".animate-on-scroll").forEach(el => {\n  observer.observe(el);\n});\n\n/* CSS анимации */\n.animate-on-scroll {\n  opacity: 0;\n  transform: translateY(40px);\n  transition: opacity 0.6s ease, transform 0.6s ease;\n}\n\n.animate-on-scroll.visible {\n  opacity: 1;\n  transform: translateY(0);\n}\n\n/* Pricing */\n.pricing-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));\n  gap: 24px;\n}\n\n.pricing-card.popular {\n  border: 2px solid #4f46e5;\n  transform: scale(1.05);\n  position: relative;\n}\n\n.pricing-card.popular::before {\n  content: "Популярный";\n  position: absolute;\n  top: -12px; left: 50%;\n  transform: translateX(-50%);\n  background: #4f46e5;\n  color: white;\n  padding: 4px 16px;\n  border-radius: 20px;\n  font-size: 12px;\n}',
      explanation: 'IntersectionObserver — современный способ определить, когда элемент попал в зону видимости. Намного лучше старого подхода со scroll + getBoundingClientRect. threshold: 0.1 — анимация начинается когда 10% элемента видно.'
    },
    {
      id: 2,
      title: 'Проект: Личное портфолио',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай персональное портфолио веб-разработчика.',
      requirements: [
        'Hero: фото/аватар, имя, должность, typed-анимация',
        'About: расскажи о себе, фото, ключевые факты',
        'Skills: технологии с уровнем владения (прогресс-бары)',
        'Projects: 4 проекта с описанием, стеком и ссылками',
        'Experience/Education: таймлайн',
        'Contact: форма или ссылки на соцсети',
        'Переключение тёмной/светлой темы',
        'Адаптивность для мобильных'
      ],
      expectedOutput: 'Профессиональное портфолио',
      hint: 'Typed-анимация: массив строк, меняй textContent по таймеру. Прогресс-бары анимируй через IntersectionObserver — ширина 0% → N% при попадании в видимость.',
      solution: '// Typed animation\nconst roles = ["Frontend Developer", "HTML/CSS Specialist", "JavaScript Engineer"];\nlet roleIndex = 0;\nlet charIndex = 0;\nlet isDeleting = false;\n\nfunction typeRole() {\n  const current = roles[roleIndex];\n  const el = document.getElementById("role");\n  \n  if (!isDeleting) {\n    el.textContent = current.slice(0, ++charIndex);\n    if (charIndex === current.length) {\n      isDeleting = true;\n      setTimeout(typeRole, 2000);\n      return;\n    }\n  } else {\n    el.textContent = current.slice(0, --charIndex);\n    if (charIndex === 0) {\n      isDeleting = false;\n      roleIndex = (roleIndex + 1) % roles.length;\n    }\n  }\n  setTimeout(typeRole, isDeleting ? 50 : 100);\n}\n\ntypeRole();\n\n// Skills progress bars\nconst skillObserver = new IntersectionObserver((entries) => {\n  entries.forEach(entry => {\n    if (entry.isIntersecting) {\n      const bar = entry.target.querySelector(".bar-fill");\n      bar.style.width = bar.dataset.level + "%";\n      skillObserver.unobserve(entry.target);\n    }\n  });\n});\n\ndocument.querySelectorAll(".skill-bar").forEach(bar => skillObserver.observe(bar));\n\n// Dark/Light theme\nconst themeBtn = document.getElementById("themeToggle");\nconst html = document.documentElement;\n\nconst savedTheme = localStorage.getItem("theme") || "light";\nhtml.setAttribute("data-theme", savedTheme);\n\nthemeBtn.addEventListener("click", () => {\n  const current = html.getAttribute("data-theme");\n  const next = current === "dark" ? "light" : "dark";\n  html.setAttribute("data-theme", next);\n  localStorage.setItem("theme", next);\n});',
      explanation: 'Typed-анимация без библиотек: рекурсивный setTimeout. IntersectionObserver + CSS transition для прогресс-баров — плавная анимация при скролле. Портфолио — лучший способ показать работодателю твои навыки.'
    },
    {
      id: 3,
      title: 'Проект: Полноценное Todo-приложение',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай продакшн-качества менеджер задач со всеми функциями.',
      requirements: [
        'Задачи с названием, описанием, приоритетом, дедлайном',
        'Категории/теги',
        'Drag-and-drop сортировка',
        'Фильтры и поиск',
        'Статистика (выполнено/осталось/просрочено)',
        'Экспорт в JSON',
        'Тёмная тема',
        'PWA манифест'
      ],
      expectedOutput: 'Полноценный менеджер задач',
      hint: 'Drag-and-drop: HTML5 Drag API — dragstart, dragover, drop события. Или используй CSS с pointer events. Статистику считай из массива через reduce.',
      solution: '// Drag-and-drop\nlet dragSrc = null;\n\nfunction handleDragStart(e) {\n  dragSrc = this;\n  e.dataTransfer.effectAllowed = "move";\n  this.classList.add("dragging");\n}\n\nfunction handleDragOver(e) {\n  e.preventDefault();\n  e.dataTransfer.dropEffect = "move";\n  return false;\n}\n\nfunction handleDrop(e) {\n  e.preventDefault();\n  if (dragSrc === this) return;\n  \n  const srcId = parseInt(dragSrc.dataset.id);\n  const dstId = parseInt(this.dataset.id);\n  \n  const srcIdx = todos.findIndex(t => t.id === srcId);\n  const dstIdx = todos.findIndex(t => t.id === dstId);\n  \n  const [moved] = todos.splice(srcIdx, 1);\n  todos.splice(dstIdx, 0, moved);\n  \n  save();\n  render();\n}\n\n// Экспорт в JSON\nfunction exportTodos() {\n  const json = JSON.stringify(todos, null, 2);\n  const blob = new Blob([json], { type: "application/json" });\n  const url = URL.createObjectURL(blob);\n  const a = document.createElement("a");\n  a.href = url;\n  a.download = `todos-${new Date().toISOString().slice(0, 10)}.json`;\n  a.click();\n  URL.revokeObjectURL(url);\n}\n\n// Статистика\nfunction getStats() {\n  const total = todos.length;\n  const done = todos.filter(t => t.done).length;\n  const overdue = todos.filter(t => !t.done && t.deadline && new Date(t.deadline) < new Date()).length;\n  return { total, done, active: total - done, overdue };\n}\n\n// PWA manifest (manifest.json):\n// { "name": "Todo App", "short_name": "Todo",\n//   "start_url": "/", "display": "standalone",\n//   "theme_color": "#4f46e5", "background_color": "#fff",\n//   "icons": [{"src": "icon.png", "sizes": "192x192"}] }',
      explanation: 'HTML5 Drag API встроен в браузер — не нужны библиотеки. URL.createObjectURL + click на ссылке — стандартный способ скачать файл. PWA манифест позволяет установить приложение на устройство как нативное.'
    },
    {
      id: 4,
      title: 'Проект: Мини-социальная сеть',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай ленту постов с возможностью добавлять посты, лайкать и комментировать.',
      requirements: [
        'Форма создания поста (текст + опционально изображение через URL)',
        'Лента постов с автором, временем и контентом',
        'Кнопка лайка с счётчиком (с анимацией)',
        'Комментарии к постам (показывать/скрывать)',
        'Сохранение в localStorage',
        'Ограничение: не более 280 символов (с счётчиком)',
        'Возможность удалять свои посты'
      ],
      expectedOutput: 'Мини социальная сеть',
      hint: 'Храни массив posts [{id, author, content, imageUrl, likes, comments, createdAt}]. Отображай относительное время через Intl.RelativeTimeFormat.',
      solution: 'const currentUser = "Вы";\nlet posts = JSON.parse(localStorage.getItem("posts")) || [];\nlet nextId = posts.length ? Math.max(...posts.map(p => p.id)) + 1 : 1;\n\nfunction save() { localStorage.setItem("posts", JSON.stringify(posts)); }\n\nfunction timeAgo(ts) {\n  const diff = (Date.now() - ts) / 1000;\n  const rtf = new Intl.RelativeTimeFormat("ru", { numeric: "auto" });\n  if (diff < 60) return rtf.format(-Math.round(diff), "second");\n  if (diff < 3600) return rtf.format(-Math.round(diff / 60), "minute");\n  if (diff < 86400) return rtf.format(-Math.round(diff / 3600), "hour");\n  return rtf.format(-Math.round(diff / 86400), "day");\n}\n\nfunction createPost(content, imageUrl) {\n  posts.unshift({\n    id: nextId++, author: currentUser,\n    content, imageUrl: imageUrl || null,\n    likes: 0, likedByMe: false,\n    comments: [], showComments: false,\n    createdAt: Date.now()\n  });\n  save(); render();\n}\n\nfunction toggleLike(id) {\n  const post = posts.find(p => p.id === id);\n  post.likedByMe = !post.likedByMe;\n  post.likes += post.likedByMe ? 1 : -1;\n  save(); render();\n}\n\nfunction addComment(postId, text) {\n  const post = posts.find(p => p.id === postId);\n  post.comments.push({ author: currentUser, text, createdAt: Date.now() });\n  save(); render();\n}\n\nfunction deletePost(id) {\n  posts = posts.filter(p => p.id !== id);\n  save(); render();\n}\n\nfunction render() {\n  document.getElementById("feed").innerHTML = posts.map(post => `\n    <article class="post">\n      <header>\n        <strong>${post.author}</strong>\n        <time>${timeAgo(post.createdAt)}</time>\n        ${post.author === currentUser ? `<button onclick="deletePost(${post.id})">Удалить</button>` : ""}\n      </header>\n      <p>${post.content}</p>\n      ${post.imageUrl ? `<img src="${post.imageUrl}" alt="Изображение поста">` : ""}\n      <footer>\n        <button class="${post.likedByMe ? "liked" : ""}" onclick="toggleLike(${post.id})">\n          ${post.likedByMe ? "❤️" : "🤍"} ${post.likes}\n        </button>\n        <button onclick="toggleComments(${post.id})">\n          💬 ${post.comments.length}\n        </button>\n      </footer>\n    </article>\n  `).join("");\n}',
      explanation: 'Intl.RelativeTimeFormat — встроенный браузерный API для "5 минут назад" на нужном языке. Паттерн posts в localStorage — достаточен для учебного проекта. Условный рендер своих постов (удаление) — важная деталь UX.'
    },
    {
      id: 5,
      title: 'Проект: Quiz-приложение',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай викторину с вопросами, таймером и результатами.',
      requirements: [
        'Минимум 10 вопросов с 4 вариантами ответа',
        'Таймер на каждый вопрос (30 секунд)',
        'Визуальная обратная связь: правильный/неправильный ответ',
        'Прогресс (вопрос 3 из 10)',
        'Результаты с процентом и комментарием',
        'Сохранение рекордов',
        'Возможность перемешивать вопросы'
      ],
      expectedOutput: 'Интерактивный квиз с таймером',
      hint: 'Перемешивание: [...arr].sort(() => Math.random() - 0.5). При правильном ответе — зелёный фон, при неправильном — красный, показать правильный ответ.',
      solution: 'const questions = [\n  {\n    question: "Что выведет: typeof null?",\n    options: ["null", "undefined", "object", "boolean"],\n    correct: 2\n  },\n  {\n    question: "Какой метод добавляет элемент в конец массива?",\n    options: ["push", "pop", "shift", "unshift"],\n    correct: 0\n  },\n  // ... остальные 8 вопросов\n];\n\nlet shuffled = [...questions].sort(() => Math.random() - 0.5);\nlet current = 0;\nlet score = 0;\nlet timer = null;\nlet timeLeft = 30;\n\nfunction startTimer() {\n  clearInterval(timer);\n  timeLeft = 30;\n  updateTimerDisplay();\n  timer = setInterval(() => {\n    timeLeft--;\n    updateTimerDisplay();\n    if (timeLeft <= 0) {\n      clearInterval(timer);\n      highlightAnswer(-1); // время вышло\n      setTimeout(nextQuestion, 1500);\n    }\n  }, 1000);\n}\n\nfunction updateTimerDisplay() {\n  document.getElementById("timer").textContent = timeLeft;\n  document.getElementById("timer").style.color =\n    timeLeft <= 10 ? "red" : "inherit";\n}\n\nfunction answer(index) {\n  clearInterval(timer);\n  const q = shuffled[current];\n  if (index === q.correct) score++;\n  highlightAnswer(index);\n  setTimeout(nextQuestion, 1500);\n}\n\nfunction highlightAnswer(chosen) {\n  const buttons = document.querySelectorAll(".answer-btn");\n  const q = shuffled[current];\n  buttons.forEach((btn, i) => {\n    btn.disabled = true;\n    if (i === q.correct) btn.classList.add("correct");\n    else if (i === chosen && chosen !== q.correct) btn.classList.add("wrong");\n  });\n}\n\nfunction nextQuestion() {\n  current++;\n  if (current < shuffled.length) renderQuestion();\n  else showResults();\n}\n\nfunction renderQuestion() {\n  const q = shuffled[current];\n  document.getElementById("question").textContent = q.question;\n  document.getElementById("progress").textContent =\n    `${current + 1} / ${shuffled.length}`;\n  document.getElementById("answers").innerHTML = q.options.map((opt, i) =>\n    `<button class="answer-btn" onclick="answer(${i})">${opt}</button>`\n  ).join("");\n  startTimer();\n}\n\nfunction showResults() {\n  const pct = Math.round(score / shuffled.length * 100);\n  document.getElementById("quiz").innerHTML = `\n    <h2>Результат: ${score}/${shuffled.length} (${pct}%)</h2>\n    <p>${pct >= 80 ? "Отлично!" : pct >= 60 ? "Хорошо!" : "Нужно повторить!"}</p>\n    <button onclick="location.reload()">Начать заново</button>\n  `;\n}\n\nrenderQuestion();',
      explanation: 'Quiz — отличный проект для отработки состояния и таймеров. Перемешивание через .sort(() => Math.random() - 0.5) — простой но работающий способ. Визуальная обратная связь через классы. clearInterval перед новым startTimer предотвращает несколько одновременных таймеров.'
    },
    {
      id: 6,
      title: 'Проект: Приложение рецептов',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай приложение для просмотра и добавления кулинарных рецептов.',
      requirements: [
        'Список рецептов с поиском и фильтром по категории',
        'Страница рецепта: фото, ингредиенты, шаги приготовления',
        'Калькулятор порций (умножение ингредиентов)',
        'Добавление рецепта через форму',
        'Избранные рецепты в localStorage',
        'Время приготовления и сложность',
        'SPA-навигация через hash'
      ],
      expectedOutput: 'Приложение кулинарных рецептов',
      hint: 'Hash-навигация: window.addEventListener("hashchange", router). location.hash = "#recipe/1" для перехода. Калькулятор порций: ингредиенты * (newServings / defaultServings).',
      solution: 'const recipes = [\n  {\n    id: 1, title: "Плов по-казахски",\n    category: "Мясные блюда", time: 90, difficulty: "Средне",\n    servings: 6,\n    image: "https://source.unsplash.com/400x300?pilaf",\n    ingredients: [\n      { name: "Рис", amount: 500, unit: "г" },\n      { name: "Баранина", amount: 700, unit: "г" },\n      { name: "Морковь", amount: 400, unit: "г" },\n      { name: "Лук", amount: 300, unit: "г" }\n    ],\n    steps: [\n      "Обжарь лук до золотистого цвета",\n      "Добавь мясо и жарь до корочки",\n      "Добавь морковь, жарь 10 минут",\n      "Всыпь рис, залей водой 1:1.5",\n      "Вари 20 минут под крышкой"\n    ]\n  }\n];\n\nfunction router() {\n  const hash = location.hash || "#list";\n  if (hash === "#list") renderList();\n  else if (hash.startsWith("#recipe/")) {\n    const id = parseInt(hash.split("/")[1]);\n    renderRecipe(id);\n  }\n}\n\nfunction renderRecipe(id) {\n  const recipe = recipes.find(r => r.id === id);\n  let servings = recipe.servings;\n  \n  const app = document.getElementById("app");\n  app.innerHTML = `\n    <button onclick="location.hash=#list">← Назад</button>\n    <h1>${recipe.title}</h1>\n    <img src="${recipe.image}" alt="${recipe.title}">\n    <div>Порций: <input type="number" value="${servings}" min="1"\n         onchange="updateServings(${id}, this.value)"></div>\n    <ul id="ingredients">${renderIngredients(recipe.ingredients, servings)}</ul>\n    <ol>${recipe.steps.map(s => `<li>${s}</li>`).join("")}</ol>\n  `;\n}\n\nfunction renderIngredients(ingredients, servings) {\n  const recipe = recipes.find(r => r.ingredients === ingredients);\n  const ratio = recipe ? servings / recipe.servings : 1;\n  return ingredients.map(ing =>\n    `<li>${Math.round(ing.amount * ratio)} ${ing.unit} — ${ing.name}</li>`\n  ).join("");\n}\n\nwindow.addEventListener("hashchange", router);\nrouter();',
      explanation: 'Hash-навигация — простой SPA без библиотек. hashchange событие реагирует на изменение URL после #. Калькулятор порций: умножаем все ингредиенты на коэффициент новые/старые_порции.'
    },
    {
      id: 7,
      title: 'Проект: Дашборд аналитики',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай красивый дашборд с метриками, графиком и таблицей данных.',
      requirements: [
        'Карточки KPI: выручка, пользователи, заказы, конверсия',
        'Простой линейный/барный график через Canvas API или SVG',
        'Таблица последних заказов',
        'Фильтр по периоду (7 дней / 30 дней / 90 дней)',
        'Тёмная/светлая тема',
        'Анимированные числа при загрузке (count up)',
        'Адаптивный сайдбар'
      ],
      expectedOutput: 'Дашборд с аналитикой',
      hint: 'Count-up анимация: setInterval от 0 до целевого числа. Для графика: SVG polyline с вычисленными точками. Генерируй тестовые данные через Array.from.',
      solution: '// Генерация тестовых данных\nfunction generateData(days) {\n  return Array.from({ length: days }, (_, i) => ({\n    date: new Date(Date.now() - (days - i - 1) * 86400000).toLocaleDateString("ru"),\n    revenue: Math.floor(Math.random() * 50000) + 100000,\n    users: Math.floor(Math.random() * 100) + 200,\n    orders: Math.floor(Math.random() * 50) + 80\n  }));\n}\n\n// Count-up анимация\nfunction animateValue(el, start, end, duration) {\n  const range = end - start;\n  const startTime = performance.now();\n  \n  function update(currentTime) {\n    const elapsed = currentTime - startTime;\n    const progress = Math.min(elapsed / duration, 1);\n    const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic\n    el.textContent = Math.round(start + range * eased).toLocaleString();\n    if (progress < 1) requestAnimationFrame(update);\n  }\n  requestAnimationFrame(update);\n}\n\n// SVG-график\nfunction renderChart(data, metric) {\n  const values = data.map(d => d[metric]);\n  const min = Math.min(...values);\n  const max = Math.max(...values);\n  const W = 800, H = 200;\n  \n  const points = values.map((v, i) => {\n    const x = (i / (values.length - 1)) * W;\n    const y = H - ((v - min) / (max - min)) * H;\n    return `${x},${y}`;\n  }).join(" ");\n  \n  return `<svg viewBox="0 0 ${W} ${H}" class="chart">\n    <polyline points="${points}" fill="none" stroke="#4f46e5" stroke-width="2"/>\n    <polyline points="0,${H} ${points} ${W},${H}" fill="rgba(79,70,229,0.1)" stroke="none"/>\n  </svg>`;\n}\n\nlet period = 30;\nlet data = generateData(period);\n\nfunction render() {\n  data = generateData(period);\n  const totals = data.reduce((acc, d) => ({\n    revenue: acc.revenue + d.revenue,\n    users: acc.users + d.users,\n    orders: acc.orders + d.orders\n  }), { revenue: 0, users: 0, orders: 0 });\n  \n  animateValue(document.getElementById("revenue"), 0, totals.revenue, 1500);\n  animateValue(document.getElementById("users"), 0, totals.users, 1200);\n  \n  document.getElementById("chart").innerHTML = renderChart(data, "revenue");\n}\n\nrender();',
      explanation: 'requestAnimationFrame вместо setInterval для count-up — плавная анимация синхронизированная с экраном. SVG polyline — простой способ нарисовать линейный график без библиотек. Генерация тестовых данных через Array.from.'
    },
    {
      id: 8,
      title: 'Проект: Финальный — выбери сам',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай свой проект, применив все знания курса. Предложения: блог-движок, маркетплейс, игра, органайзер.',
      requirements: [
        'Минимальные требования: HTML5, CSS (Flex/Grid), JS (ES6+)',
        'Минимум 3 экрана/состояния приложения',
        'CRUD операции с localStorage',
        'Fetch к внешнему API',
        'Адаптивный дизайн',
        'Семантический HTML и доступность',
        'Git-репозиторий с README'
      ],
      expectedOutput: 'Самостоятельный проект в портфолио',
      hint: 'Идеи: книжный трекер (goodreads-мини), менеджер бюджета, трекер привычек, маркетплейс локальных товаров, ролевая игра в браузере.',
      solution: '// Пример: Трекер привычек\n// Каждый день отмечаешь выполненные привычки\n// Калькулятор streak (сколько дней подряд)\n// Прогресс-колонки по неделям\n\nconst HABITS_KEY = "habits_v2";\nconst COMPLETIONS_KEY = "completions_v2";\n\nlet habits = JSON.parse(localStorage.getItem(HABITS_KEY)) || [\n  { id: 1, name: "Зарядка", icon: "🏃", color: "#10b981" },\n  { id: 2, name: "Чтение 30 мин", icon: "📚", color: "#4f46e5" }\n];\nlet completions = JSON.parse(localStorage.getItem(COMPLETIONS_KEY)) || {};\n\nconst today = new Date().toISOString().slice(0, 10);\n\nfunction toggle(habitId) {\n  const key = `${today}-${habitId}`;\n  completions[key] = !completions[key];\n  localStorage.setItem(COMPLETIONS_KEY, JSON.stringify(completions));\n  render();\n}\n\nfunction getStreak(habitId) {\n  let streak = 0;\n  let date = new Date();\n  while (true) {\n    const key = `${date.toISOString().slice(0, 10)}-${habitId}`;\n    if (!completions[key]) break;\n    streak++;\n    date.setDate(date.getDate() - 1);\n  }\n  return streak;\n}\n\nfunction render() {\n  const grid = document.getElementById("habits");\n  grid.innerHTML = habits.map(h => {\n    const done = !!completions[`${today}-${h.id}`];\n    const streak = getStreak(h.id);\n    return `\n      <div class="habit-card ${done ? "done" : ""}" onclick="toggle(${h.id})">\n        <span class="icon">${h.icon}</span>\n        <h3>${h.name}</h3>\n        <p>🔥 ${streak} дней подряд</p>\n        <div class="check">${done ? "✓" : ""}</div>\n      </div>\n    `;\n  }).join("");\n}\n\nrender();',
      explanation: 'Финальный проект — возможность применить ВСЕ знания: HTML-структура, CSS-стили, JS-логика, LocalStorage, возможно API. README с описанием и скриншотами добавь в GitHub — это твоё портфолио! Трекер привычек — отличный пример: CRUD, localStorage, алгоритм streak.'
    }
  ]
}
