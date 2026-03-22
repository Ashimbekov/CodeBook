export default {
  id: 27,
  title: 'Практикум: JavaScript',
  description: 'Практические JS-задания — алгоритмы, DOM, события, API, хранилище и мини-приложения',
  lessons: [
    {
      id: 1,
      title: 'Практика: Калькулятор',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай рабочий калькулятор с основными операциями и красивым интерфейсом.',
      requirements: [
        'Кнопки: цифры 0-9, +, -, *, /, ., =, C, ±',
        'Дисплей показывает текущий ввод',
        'Поддержка десятичных чисел',
        'Обработка ошибок (деление на 0)',
        'Клавиатурный ввод (keydown)'
      ],
      expectedOutput: 'Работающий калькулятор',
      hint: 'Храни состояние: currentInput, previousInput, operator. При нажатии = вычисляй результат через switch (operator).',
      solution: 'class Calculator {\n  constructor() {\n    this.current = "0";\n    this.previous = null;\n    this.operator = null;\n    this.shouldReset = false;\n    this.display = document.getElementById("display");\n  }\n  \n  appendDigit(digit) {\n    if (this.shouldReset) {\n      this.current = digit;\n      this.shouldReset = false;\n    } else {\n      if (digit === "." && this.current.includes(".")) return;\n      this.current = this.current === "0" && digit !== "."\n        ? digit\n        : this.current + digit;\n    }\n    this.update();\n  }\n  \n  setOperator(op) {\n    if (this.operator && !this.shouldReset) this.calculate();\n    this.previous = parseFloat(this.current);\n    this.operator = op;\n    this.shouldReset = true;\n  }\n  \n  calculate() {\n    if (!this.operator || this.previous === null) return;\n    const a = this.previous, b = parseFloat(this.current);\n    const ops = { "+": a+b, "-": a-b, "*": a*b, "/": b === 0 ? "Ошибка" : a/b };\n    this.current = String(parseFloat(ops[this.operator].toFixed(10)));\n    this.operator = null;\n    this.shouldReset = true;\n    this.update();\n  }\n  \n  clear() { this.current = "0"; this.previous = null; this.operator = null; this.update(); }\n  toggle() { this.current = String(-parseFloat(this.current)); this.update(); }\n  update() { this.display.textContent = this.current; }\n}\n\nconst calc = new Calculator();\ndocument.addEventListener("keydown", (e) => {\n  if ("0123456789.".includes(e.key)) calc.appendDigit(e.key);\n  if ("+-*/".includes(e.key)) calc.setOperator(e.key);\n  if (e.key === "Enter" || e.key === "=") calc.calculate();\n  if (e.key === "Escape") calc.clear();\n});',
      explanation: 'Калькулятор — классический проект для изучения состояния (state). shouldReset флаг решает проблему перезаписи после равно. OOP-подход с классом делает код структурированным.'
    },
    {
      id: 2,
      title: 'Практика: Список задач с LocalStorage',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай полноценный менеджер задач с сохранением в localStorage.',
      requirements: [
        'Добавление задач (Enter или кнопка)',
        'Отметка выполненных (checkbox)',
        'Удаление задач',
        'Фильтры: Все, Активные, Выполненные',
        'Счётчик оставшихся задач',
        'Сохранение в localStorage'
      ],
      expectedOutput: 'Todo-приложение с localStorage',
      hint: 'Храни todos как массив объектов [{id, text, done}]. Перерисовывай список при каждом изменении. Сохраняй в localStorage после каждого изменения.',
      solution: 'let todos = JSON.parse(localStorage.getItem("todos")) || [];\nlet filter = "all";\nlet nextId = todos.length ? Math.max(...todos.map(t => t.id)) + 1 : 1;\n\nfunction save() { localStorage.setItem("todos", JSON.stringify(todos)); }\n\nfunction addTodo(text) {\n  if (!text.trim()) return;\n  todos.push({ id: nextId++, text, done: false });\n  save(); render();\n}\n\nfunction toggleTodo(id) {\n  todos = todos.map(t => t.id === id ? { ...t, done: !t.done } : t);\n  save(); render();\n}\n\nfunction deleteTodo(id) {\n  todos = todos.filter(t => t.id !== id);\n  save(); render();\n}\n\nfunction render() {\n  const filtered = filter === "all" ? todos\n    : filter === "active" ? todos.filter(t => !t.done)\n    : todos.filter(t => t.done);\n  \n  const list = document.getElementById("list");\n  list.innerHTML = filtered.map(todo => `\n    <li class="${todo.done ? "done" : ""}">\n      <input type="checkbox" ${todo.done ? "checked" : ""}\n             onchange="toggleTodo(${todo.id})">\n      <span>${todo.text}</span>\n      <button onclick="deleteTodo(${todo.id})">✕</button>\n    </li>\n  `).join("");\n  \n  document.getElementById("count").textContent =\n    `${todos.filter(t => !t.done).length} задач осталось`;\n}\n\nrender();',
      explanation: 'Паттерн: массив todos → save() в localStorage → render() в DOM. Полное перерисовывание при каждом изменении — просто и надёжно. В реальных приложениях используют виртуальный DOM (React) для оптимизации.'
    },
    {
      id: 3,
      title: 'Практика: Погодное приложение',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай приложение погоды с поиском города через API.',
      requirements: [
        'Поиск города с debounce 500ms',
        'Fetch к OpenWeatherMap API (нужен бесплатный ключ) или wttr.in',
        'Отображение: город, температура, описание, иконка',
        'Обработка ошибок (город не найден, нет сети)',
        'Сохранять последний поиск в localStorage'
      ],
      expectedOutput: 'Погодное приложение с API',
      hint: 'wttr.in не требует API-ключа: fetch("https://wttr.in/Алматы?format=j1"). Поле format=j1 возвращает JSON.',
      solution: 'const searchInput = document.getElementById("city");\nconst weatherEl = document.getElementById("weather");\nconst lastCity = localStorage.getItem("lastCity");\n\nfunction debounce(fn, delay) {\n  let timer;\n  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };\n}\n\nasync function getWeather(city) {\n  if (!city.trim()) return;\n  weatherEl.innerHTML = "<div class=\'loading\'>Загрузка...</div>";\n  \n  try {\n    const res = await fetch(\n      `https://wttr.in/${encodeURIComponent(city)}?format=j1`\n    );\n    if (!res.ok) throw new Error("Город не найден");\n    const data = await res.json();\n    \n    const current = data.current_condition[0];\n    const temp = current.temp_C;\n    const desc = current.weatherDesc[0].value;\n    const feels = current.FeelsLikeC;\n    \n    weatherEl.innerHTML = `\n      <div class="weather-card">\n        <h2>${city}</h2>\n        <div class="temp">${temp}°C</div>\n        <p>${desc}</p>\n        <p>Ощущается как ${feels}°C</p>\n        <p>Влажность: ${current.humidity}%</p>\n      </div>\n    `;\n    localStorage.setItem("lastCity", city);\n  } catch (e) {\n    weatherEl.innerHTML = `<p class="error">${e.message}</p>`;\n  }\n}\n\nsearchInput.addEventListener("input",\n  debounce((e) => getWeather(e.target.value), 500)\n);\n\nif (lastCity) {\n  searchInput.value = lastCity;\n  getWeather(lastCity);\n}',
      explanation: 'wttr.in — удобный бесплатный API погоды без регистрации. Debounce предотвращает запрос при каждом нажатии клавиши. localStorage сохраняет последний город для удобства.'
    },
    {
      id: 4,
      title: 'Практика: Игра "Угадай число"',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай игру, где компьютер загадывает число, а игрок пытается угадать.',
      requirements: [
        'Случайное число от 1 до 100',
        'Подсказки: "больше" или "меньше"',
        'Счётчик попыток',
        'Таймер',
        'Таблица рекордов в localStorage',
        'Анимация при выигрыше'
      ],
      expectedOutput: 'Интерактивная игра с таблицей рекордов',
      hint: 'Math.floor(Math.random() * 100) + 1 генерирует число 1-100. Таймер: setInterval для подсчёта секунд.',
      solution: 'class GuessGame {\n  constructor() {\n    this.secret = Math.floor(Math.random() * 100) + 1;\n    this.attempts = 0;\n    this.seconds = 0;\n    this.timer = setInterval(() => {\n      this.seconds++;\n      document.getElementById("timer").textContent = this.seconds + "s";\n    }, 1000);\n  }\n  \n  guess(num) {\n    if (isNaN(num) || num < 1 || num > 100) {\n      return this.showMessage("Введи число от 1 до 100", "warn");\n    }\n    this.attempts++;\n    \n    if (num < this.secret) return this.showMessage("Больше!", "hint");\n    if (num > this.secret) return this.showMessage("Меньше!", "hint");\n    \n    clearInterval(this.timer);\n    this.saveRecord();\n    this.showMessage(`Угадал за ${this.attempts} попыток и ${this.seconds}s!`, "win");\n    document.getElementById("guess-input").disabled = true;\n  }\n  \n  saveRecord() {\n    const records = JSON.parse(localStorage.getItem("records")) || [];\n    records.push({ attempts: this.attempts, time: this.seconds, date: new Date().toLocaleDateString() });\n    records.sort((a, b) => a.attempts - b.attempts);\n    localStorage.setItem("records", JSON.stringify(records.slice(0, 10)));\n    this.renderRecords(records);\n  }\n  \n  renderRecords(records) {\n    const tbody = document.getElementById("records");\n    tbody.innerHTML = records.map((r, i) =>\n      `<tr><td>${i+1}</td><td>${r.attempts}</td><td>${r.time}s</td><td>${r.date}</td></tr>`\n    ).join("");\n  }\n  \n  showMessage(text, type) {\n    const el = document.getElementById("message");\n    el.textContent = text;\n    el.className = type;\n  }\n}\n\nlet game = new GuessGame();\n\ndocument.getElementById("submit").addEventListener("click", () => {\n  game.guess(parseInt(document.getElementById("guess-input").value));\n});\n\ndocument.getElementById("restart").addEventListener("click", () => {\n  game = new GuessGame();\n  document.getElementById("guess-input").disabled = false;\n});',
      explanation: 'Игра показывает хорошую структуру через класс. setInterval создаёт таймер. Таблица рекордов в localStorage сохраняется между сессиями. Сортировка рекордов по попыткам создаёт соревновательный элемент.'
    },
    {
      id: 5,
      title: 'Практика: Генератор карточек',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай приложение для генерации случайных пользовательских карточек через API.',
      requirements: [
        'Кнопка "Следующий пользователь"',
        'Fetch к https://randomuser.me/api/',
        'Отображение: фото, имя, email, телефон, страна',
        'Анимация смены карточки (fade/slide)',
        'Кнопка "Сохранить" добавляет в список избранных',
        'Список избранных в localStorage'
      ],
      expectedOutput: 'Приложение для изучения карточек пользователей',
      hint: 'randomuser.me/api/ возвращает {results: [{name, email, phone, picture, location}]}. Анимация: сначала opacity 0, потом transition к opacity 1.',
      solution: 'const card = document.getElementById("card");\nconst favorites = JSON.parse(localStorage.getItem("favorites")) || [];\n\nasync function loadUser() {\n  card.style.opacity = "0";\n  \n  try {\n    const res = await fetch("https://randomuser.me/api/");\n    const { results: [user] } = await res.json();\n    \n    card.innerHTML = `\n      <img src="${user.picture.large}" alt="${user.name.first}">\n      <h2>${user.name.first} ${user.name.last}</h2>\n      <p>📧 ${user.email}</p>\n      <p>📱 ${user.phone}</p>\n      <p>🌍 ${user.location.country}</p>\n      <button id="saveBtn">В избранные</button>\n    `;\n    \n    card.style.transition = "opacity 0.4s";\n    setTimeout(() => card.style.opacity = "1", 50);\n    \n    document.getElementById("saveBtn").addEventListener("click", () => {\n      favorites.push({ name: `${user.name.first} ${user.name.last}`, email: user.email });\n      localStorage.setItem("favorites", JSON.stringify(favorites));\n      renderFavorites();\n    });\n  } catch (e) {\n    card.innerHTML = `<p>Ошибка: ${e.message}</p>`;\n    card.style.opacity = "1";\n  }\n}\n\nfunction renderFavorites() {\n  document.getElementById("favList").innerHTML =\n    favorites.map(f => `<li>${f.name} — ${f.email}</li>`).join("");\n}\n\ndocument.getElementById("nextBtn").addEventListener("click", loadUser);\nrenderFavorites();\nloadUser();',
      explanation: 'randomuser.me — бесплатный API для тестовых данных. Анимация: opacity: 0 → setTimeout → opacity: 1 создаёт fade-in. Favorites в localStorage сохраняются между сессиями.'
    },
    {
      id: 6,
      title: 'Практика: Таймер Помодоро',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай таймер техники Помодоро с циклами работы и перерывов.',
      requirements: [
        '25 минут работы → 5 минут перерыв (чередование)',
        'Кнопки старт/пауза/сброс',
        'Визуальный прогресс-бар или SVG-круг',
        'Звуковое уведомление при окончании таймера',
        'Счётчик завершённых помодоро',
        'Длинный перерыв (15 мин) каждые 4 помодоро'
      ],
      expectedOutput: 'Таймер Помодоро',
      hint: 'setInterval(fn, 1000) для обратного отсчёта. AudioContext или простой Audio объект для звука. SVG-круг с stroke-dasharray для прогресса.',
      solution: 'const WORK_TIME = 25 * 60;\nconst SHORT_BREAK = 5 * 60;\nconst LONG_BREAK = 15 * 60;\n\nlet timeLeft = WORK_TIME;\nlet totalTime = WORK_TIME;\nlet isRunning = false;\nlet interval = null;\nlet pomodoros = 0;\nlet isWork = true;\n\nconst timerEl = document.getElementById("timer");\nconst progressEl = document.getElementById("progress");\nconst modeEl = document.getElementById("mode");\nconst countEl = document.getElementById("count");\n\nfunction format(seconds) {\n  const m = Math.floor(seconds / 60).toString().padStart(2, "0");\n  const s = (seconds % 60).toString().padStart(2, "0");\n  return `${m}:${s}`;\n}\n\nfunction tick() {\n  timeLeft--;\n  timerEl.textContent = format(timeLeft);\n  const pct = ((totalTime - timeLeft) / totalTime) * 100;\n  progressEl.style.setProperty("--progress", pct + "%");\n  \n  if (timeLeft <= 0) {\n    clearInterval(interval);\n    isRunning = false;\n    new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg").play().catch(() => {});\n    \n    if (isWork) {\n      pomodoros++;\n      countEl.textContent = pomodoros;\n      isWork = false;\n      const breakTime = pomodoros % 4 === 0 ? LONG_BREAK : SHORT_BREAK;\n      timeLeft = totalTime = breakTime;\n      modeEl.textContent = "Перерыв!";\n    } else {\n      isWork = true;\n      timeLeft = totalTime = WORK_TIME;\n      modeEl.textContent = "Работа";\n    }\n    timerEl.textContent = format(timeLeft);\n  }\n}\n\nfunction toggle() {\n  if (isRunning) { clearInterval(interval); isRunning = false; }\n  else { interval = setInterval(tick, 1000); isRunning = true; }\n}\n\nfunction reset() {\n  clearInterval(interval); isRunning = false;\n  isWork = true; timeLeft = totalTime = WORK_TIME;\n  timerEl.textContent = format(timeLeft);\n  modeEl.textContent = "Работа";\n}\n\ndocument.getElementById("toggleBtn").addEventListener("click", toggle);\ndocument.getElementById("resetBtn").addEventListener("click", reset);\ntimerEl.textContent = format(timeLeft);',
      explanation: 'setInterval с 1000мс — основа таймера. Чередование режимов через isWork флаг. Длинный перерыв каждые 4 помодоро: pomodoros % 4 === 0. SVG stroke-dasharray позволяет создать красивый круговой прогресс через CSS-переменную.'
    },
    {
      id: 7,
      title: 'Практика: Слайдер изображений',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай карусель/слайдер с навигацией, индикаторами и автоматическим переключением.',
      requirements: [
        'Минимум 5 слайдов (можно Unsplash URL)',
        'Кнопки prev/next',
        'Индикаторы-точки с текущим слайдом',
        'Автоматическое переключение каждые 4 секунды',
        'Пауза при hover',
        'Плавная анимация перехода'
      ],
      expectedOutput: 'Карусель с автоматическим переключением',
      hint: 'Храни currentIndex. Кнопка next: currentIndex = (currentIndex + 1) % slides.length. transform: translateX(-index * 100%) для смещения.',
      solution: 'const slides = [\n  { url: "https://source.unsplash.com/800x400?nature", caption: "Природа" },\n  { url: "https://source.unsplash.com/800x400?city", caption: "Город" },\n  { url: "https://source.unsplash.com/800x400?technology", caption: "Технологии" },\n  { url: "https://source.unsplash.com/800x400?food", caption: "Еда" },\n  { url: "https://source.unsplash.com/800x400?travel", caption: "Путешествия" }\n];\n\nlet current = 0;\nlet autoInterval;\n\nconst track = document.getElementById("track");\nconst dotsEl = document.getElementById("dots");\n\n// Создаём слайды\ntrack.innerHTML = slides.map((s, i) => `\n  <div class="slide"><img src="${s.url}" alt="${s.caption}"><p>${s.caption}</p></div>\n`).join("");\n\ndotsEl.innerHTML = slides.map((_, i) =>\n  `<button class="dot ${i === 0 ? "active" : ""}" onclick="goTo(${i})"></button>`\n).join("");\n\nfunction goTo(index) {\n  current = (index + slides.length) % slides.length;\n  track.style.transform = `translateX(-${current * 100}%)`;\n  document.querySelectorAll(".dot").forEach((d, i) =>\n    d.classList.toggle("active", i === current)\n  );\n}\n\nfunction next() { goTo(current + 1); }\nfunction prev() { goTo(current - 1); }\n\nfunction startAuto() { autoInterval = setInterval(next, 4000); }\nfunction stopAuto() { clearInterval(autoInterval); }\n\ndocument.getElementById("prevBtn").addEventListener("click", prev);\ndocument.getElementById("nextBtn").addEventListener("click", next);\ndocument.querySelector(".slider").addEventListener("mouseenter", stopAuto);\ndocument.querySelector(".slider").addEventListener("mouseleave", startAuto);\n\nstartAuto();',
      explanation: 'Слайдер через transform: translateX(-index * 100%) — самый производительный способ. Трек с overflow: hidden скрывает лишнее. (index + length) % length решает проблему отрицательных индексов при нажатии prev.'
    },
    {
      id: 8,
      title: 'Практика: Живой поиск с фильтрами',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай страницу продуктов с живым поиском и фильтрами по категории и цене.',
      requirements: [
        'Массив из 20+ товаров (название, цена, категория, рейтинг)',
        'Текстовый поиск по названию с debounce',
        'Фильтр по категории (select)',
        'Фильтр по цене (range input)',
        'Сортировка (по цене, рейтингу, названию)',
        'Счётчик найденных товаров',
        'Анимация появления карточек'
      ],
      expectedOutput: 'Страница каталога с фильтрами',
      hint: 'Состояние фильтров в объекте { query, category, maxPrice, sort }. Фильтрация — цепочка .filter().sort(). Перерисовывать DOM при изменении любого фильтра.',
      solution: 'const products = [\n  { id: 1, name: "MacBook Pro", price: 450000, category: "Ноутбуки", rating: 4.9 },\n  { id: 2, name: "iPhone 15", price: 350000, category: "Телефоны", rating: 4.8 },\n  { id: 3, name: "iPad Air", price: 220000, category: "Планшеты", rating: 4.7 },\n  // ... остальные\n];\n\nlet filters = { query: "", category: "all", maxPrice: 1000000, sort: "name" };\n\nfunction applyFilters() {\n  let result = products\n    .filter(p => p.name.toLowerCase().includes(filters.query.toLowerCase()))\n    .filter(p => filters.category === "all" || p.category === filters.category)\n    .filter(p => p.price <= filters.maxPrice);\n  \n  result.sort((a, b) => {\n    if (filters.sort === "price-asc") return a.price - b.price;\n    if (filters.sort === "price-desc") return b.price - a.price;\n    if (filters.sort === "rating") return b.rating - a.rating;\n    return a.name.localeCompare(b.name);\n  });\n  \n  return result;\n}\n\nfunction render() {\n  const results = applyFilters();\n  const grid = document.getElementById("grid");\n  document.getElementById("count").textContent = `Найдено: ${results.length}`;\n  \n  grid.innerHTML = results.map(p => `\n    <div class="product-card">\n      <h3>${p.name}</h3>\n      <p class="category">${p.category}</p>\n      <p class="price">${p.price.toLocaleString()} ₸</p>\n      <p>★ ${p.rating}</p>\n    </div>\n  `).join("");\n}\n\nconst debounced = (() => {\n  let t; return (fn) => { clearTimeout(t); t = setTimeout(fn, 300); };\n})();\n\ndocument.getElementById("search").addEventListener("input", (e) => {\n  debounced(() => { filters.query = e.target.value; render(); });\n});\n\n["category", "sort"].forEach(id => {\n  document.getElementById(id).addEventListener("change", (e) => {\n    filters[id] = e.target.value; render();\n  });\n});\n\ndocument.getElementById("maxPrice").addEventListener("input", (e) => {\n  filters.maxPrice = parseInt(e.target.value);\n  document.getElementById("priceLabel").textContent =\n    parseInt(e.target.value).toLocaleString() + " ₸";\n  render();\n});\n\nrender();',
      explanation: 'Состояние фильтров в одном объекте. Цепочка filter().filter().filter().sort() — читаемо. Debounce только для поиска, остальные реагируют мгновенно. toLocaleString() форматирует число с разделителями.'
    },
    {
      id: 9,
      title: 'Практика: Форма с мульти-шагами',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай форму регистрации из нескольких шагов с валидацией на каждом шаге.',
      requirements: [
        'Шаг 1: личные данные (имя, email)',
        'Шаг 2: пароль и подтверждение',
        'Шаг 3: предпочтения (несколько checkbox)',
        'Шаг 4: превью и подтверждение',
        'Прогресс-бар сверху',
        'Валидация перед переходом на следующий шаг'
      ],
      expectedOutput: 'Multi-step форма с валидацией',
      hint: 'Скрывай/показывай секции по текущему шагу. Данные храни в объекте formData. Обновляй прогресс-бар при каждом переходе.',
      solution: 'const formData = {};\nlet currentStep = 1;\nconst totalSteps = 4;\n\nfunction showStep(step) {\n  document.querySelectorAll(".step").forEach((s, i) => {\n    s.classList.toggle("active", i + 1 === step);\n  });\n  document.getElementById("progress").style.width =\n    ((step - 1) / (totalSteps - 1) * 100) + "%";\n  document.getElementById("stepInfo").textContent =\n    `Шаг ${step} из ${totalSteps}`;\n  document.getElementById("prevBtn").style.visibility =\n    step === 1 ? "hidden" : "visible";\n  document.getElementById("nextBtn").textContent =\n    step === totalSteps ? "Готово!" : "Далее";\n}\n\nfunction validateStep(step) {\n  if (step === 1) {\n    const name = document.getElementById("name").value;\n    const email = document.getElementById("email").value;\n    if (!name.trim()) { alert("Введите имя"); return false; }\n    if (!/^[^@]+@[^@]+\\.[^@]+$/.test(email)) { alert("Некорректный email"); return false; }\n    formData.name = name; formData.email = email;\n  }\n  if (step === 2) {\n    const pass = document.getElementById("password").value;\n    const confirm = document.getElementById("confirm").value;\n    if (pass.length < 8) { alert("Пароль минимум 8 символов"); return false; }\n    if (pass !== confirm) { alert("Пароли не совпадают"); return false; }\n    formData.password = pass;\n  }\n  return true;\n}\n\ndocument.getElementById("nextBtn").addEventListener("click", () => {\n  if (!validateStep(currentStep)) return;\n  if (currentStep < totalSteps) { currentStep++; showStep(currentStep); }\n  else submitForm();\n});\n\ndocument.getElementById("prevBtn").addEventListener("click", () => {\n  if (currentStep > 1) { currentStep--; showStep(currentStep); }\n});\n\nshowStep(1);',
      explanation: 'Multi-step форма — стандарт для сложных регистраций. Данные копятся в formData. Валидация на каждом шаге предотвращает переход с ошибками. Прогресс-бар даёт ощущение прогресса.'
    },
    {
      id: 10,
      title: 'Практика: Клон Notes с Markdown',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай приложение заметок с редактором и live-preview Markdown.',
      requirements: [
        'Список заметок слева, редактор справа',
        'Создание, удаление, переименование заметок',
        'Live Markdown preview (простой парсер)',
        'Сохранение в localStorage',
        'Поиск по заметкам',
        'Дата последнего изменения'
      ],
      expectedOutput: 'Приложение заметок с Markdown',
      hint: 'Простой Markdown парсер: replace(/#{1,3} (.+)/g, "<h1>$1</h1>"). Или используй библиотеку marked.js через CDN.',
      solution: 'let notes = JSON.parse(localStorage.getItem("notes")) || [];\nlet activeId = notes.length > 0 ? notes[0].id : null;\nlet nextId = notes.length ? Math.max(...notes.map(n => n.id)) + 1 : 1;\n\nfunction save() { localStorage.setItem("notes", JSON.stringify(notes)); }\n\nfunction createNote() {\n  const note = { id: nextId++, title: "Новая заметка", content: "", updatedAt: Date.now() };\n  notes.unshift(note);\n  activeId = note.id;\n  save(); render();\n}\n\nfunction deleteNote(id) {\n  notes = notes.filter(n => n.id !== id);\n  if (activeId === id) activeId = notes.length ? notes[0].id : null;\n  save(); render();\n}\n\nfunction renderMarkdown(text) {\n  return text\n    .replace(/### (.+)/g, "<h3>$1</h3>")\n    .replace(/## (.+)/g, "<h2>$1</h2>")\n    .replace(/# (.+)/g, "<h1>$1</h1>")\n    .replace(/\\*\\*(.+?)\\*\\*/g, "<strong>$1</strong>")\n    .replace(/\\*(.+?)\\*/g, "<em>$1</em>")\n    .replace(/\\n/g, "<br>");\n}\n\nfunction render() {\n  const query = document.getElementById("search").value.toLowerCase();\n  const filtered = notes.filter(n =>\n    n.title.toLowerCase().includes(query) ||\n    n.content.toLowerCase().includes(query)\n  );\n  \n  document.getElementById("notesList").innerHTML = filtered.map(note => `\n    <div class="note-item ${note.id === activeId ? "active" : ""}" onclick="setActive(${note.id})">\n      <h4>${note.title}</h4>\n      <small>${new Date(note.updatedAt).toLocaleDateString()}</small>\n      <button onclick="event.stopPropagation(); deleteNote(${note.id})">✕</button>\n    </div>\n  `).join("");\n  \n  const active = notes.find(n => n.id === activeId);\n  const editor = document.getElementById("editor");\n  const preview = document.getElementById("preview");\n  if (active) {\n    editor.value = active.content;\n    preview.innerHTML = renderMarkdown(active.content);\n  }\n}\n\nfunction setActive(id) { activeId = id; render(); }\n\ndocument.getElementById("editor").addEventListener("input", (e) => {\n  const note = notes.find(n => n.id === activeId);\n  if (!note) return;\n  note.content = e.target.value;\n  note.title = e.target.value.split("\\n")[0].replace(/^#+ /, "") || "Без названия";\n  note.updatedAt = Date.now();\n  save(); render();\n});\n\ndocument.getElementById("newBtn").addEventListener("click", createNote);\ndocument.getElementById("search").addEventListener("input", render);\nrender();',
      explanation: 'Split-панель с редактором и превью — классический паттерн. Markdown парсер через regex — простое решение для базового форматирования. Автоимя заметки из первой строки — удобная деталь. Поиск по содержимому — ключевая функция менеджера заметок.'
    }
  ]
}
