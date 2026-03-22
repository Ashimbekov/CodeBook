export default {
  id: 48,
  title: 'Производительность JavaScript',
  description: 'Оптимизация: lazy loading, debounce, throttle, memoize, виртуализация, Web Workers и профилирование',
  lessons: [
    {
      id: 1,
      title: 'Lazy Loading',
      type: 'theory',
      content: [
        { type: 'text', value: 'Lazy loading — загрузка ресурсов только когда они нужны. Сокращает начальное время загрузки. Применяется для изображений, компонентов, модулей, маршрутов.' },
        { type: 'heading', value: 'Ленивая загрузка' },
        { type: 'code', language: 'javascript', value: '// 1. Динамические импорты (Code Splitting)\nconst loadChart = async () => {\n  const { Chart } = await import("chart.js"); // Загрузится только при вызове\n  return new Chart(...);\n};\n\n// React.lazy для компонентов\nconst HeavyDashboard = React.lazy(() => import("./HeavyDashboard"));\n\n// 2. Lazy загрузка изображений через Intersection Observer\nconst lazyLoadImages = () => {\n  const images = document.querySelectorAll("img[data-src]");\n\n  const observer = new IntersectionObserver((entries) => {\n    entries.forEach(entry => {\n      if (entry.isIntersecting) {\n        const img = entry.target;\n        img.src = img.dataset.src;  // Загружаем реальный src\n        img.removeAttribute("data-src");\n        observer.unobserve(img);    // Больше не наблюдаем\n      }\n    });\n  }, { rootMargin: "200px" }); // Предзагрузка за 200px до входа в viewport\n\n  images.forEach(img => observer.observe(img));\n};\n// HTML: <img data-src="photo.jpg" src="placeholder.jpg" />\n\n// 3. Отложенная инициализация\nclass HeavyService {\n  constructor() {\n    this._client = null; // Не создаём сразу\n  }\n\n  get client() {\n    if (!this._client) {\n      this._client = new ExpensiveConnection(); // Создаём при первом обращении\n    }\n    return this._client;\n  }\n}\n\n// 4. HTML атрибут loading="lazy"\n// <img src="image.jpg" loading="lazy" />\n// <iframe src="video.html" loading="lazy"></iframe>' },
        { type: 'tip', value: 'IntersectionObserver — мощный API для lazy loading. Он не блокирует главный поток в отличие от scroll событий. Поддерживается во всех современных браузерах.' }
      ]
    },
    {
      id: 2,
      title: 'debounce',
      type: 'theory',
      content: [
        { type: 'text', value: 'Debounce откладывает выполнение функции до окончания быстрых событий. Пример: поиск при вводе текста — не отправляем запрос на каждую букву, а ждём паузы.' },
        { type: 'heading', value: 'Реализация debounce' },
        { type: 'code', language: 'javascript', value: '// Реализация debounce\nfunction debounce(fn, delay) {\n  let timer;\n  return function(...args) {\n    clearTimeout(timer);\n    timer = setTimeout(() => {\n      fn.apply(this, args);\n    }, delay);\n  };\n}\n\n// Расширенный debounce с leading опцией\nfunction debounceAdvanced(fn, delay, { leading = false } = {}) {\n  let timer;\n  return function(...args) {\n    const callNow = leading && !timer;\n    clearTimeout(timer);\n    timer = setTimeout(() => {\n      timer = null;\n      if (!leading) fn.apply(this, args);\n    }, delay);\n    if (callNow) fn.apply(this, args);\n  };\n}\n\n// Использование\nconst searchInput = document.getElementById("search");\n\n// Без debounce: 1 запрос на каждую букву\n// С debounce: 1 запрос через 300мс после остановки ввода\nconst search = debounce(async (query) => {\n  if (!query) return;\n  const results = await fetch(`/api/search?q=${query}`).then(r => r.json());\n  renderResults(results);\n}, 300);\n\nsearchInput.addEventListener("input", (e) => search(e.target.value));\n\n// Другие случаи применения:\n// Автосохранение при редактировании\nconst autoSave = debounce((content) => {\n  saveToServer(content);\n  console.log("Сохранено");\n}, 1000);\n\neditor.addEventListener("input", (e) => autoSave(e.target.value));\n\n// Resize обработчик\nconst handleResize = debounce(() => {\n  recalculateLayout();\n}, 200);\n\nwindow.addEventListener("resize", handleResize);' }
      ]
    },
    {
      id: 3,
      title: 'throttle',
      type: 'theory',
      content: [
        { type: 'text', value: 'Throttle ограничивает частоту вызовов функции: не чаще одного раза за указанный интервал. В отличие от debounce, вызывается равномерно, а не после паузы.' },
        { type: 'heading', value: 'Реализация throttle' },
        { type: 'code', language: 'javascript', value: '// Реализация throttle\nfunction throttle(fn, interval) {\n  let lastTime = 0;\n  return function(...args) {\n    const now = Date.now();\n    if (now - lastTime >= interval) {\n      lastTime = now;\n      return fn.apply(this, args);\n    }\n  };\n}\n\n// Throttle через setTimeout (trailing вызов)\nfunction throttleTrailing(fn, interval) {\n  let timer = null;\n  return function(...args) {\n    if (!timer) {\n      timer = setTimeout(() => {\n        fn.apply(this, args);\n        timer = null;\n      }, interval);\n    }\n  };\n}\n\n// Случаи применения throttle:\n\n// 1. Scroll события — обновление позиции не чаще 60 FPS\nconst handleScroll = throttle(() => {\n  const scrollY = window.scrollY;\n  updateScrollIndicator(scrollY);\n  if (scrollY > 500) showBackToTop();\n}, 16); // ~60 FPS = 1000/60 ≈ 16ms\n\nwindow.addEventListener("scroll", handleScroll);\n\n// 2. mousemove — обновление cursor позиции\nconst handleMouseMove = throttle((e) => {\n  updateCursorFollower(e.clientX, e.clientY);\n}, 50);\n\n// 3. Кнопка отправки формы — не спамить нажатиями\nconst submitForm = throttle(async (data) => {\n  await sendToAPI(data);\n}, 2000);\n\n// Разница debounce vs throttle:\n// Debounce: Ждёт паузу -> вызывает ОДИН раз в конце\n// Throttle: Вызывает РАВНОМЕРНО с ограниченной частотой\n//\n// Поиск при вводе -> debounce\n// Scroll/resize обработчики -> throttle\n// API вызовы при клике -> throttle\n// Автосохранение -> debounce' }
      ]
    },
    {
      id: 4,
      title: 'memoize — кэширование',
      type: 'theory',
      content: [
        { type: 'text', value: 'Memoize кэширует результаты функции по аргументам. При повторном вызове с теми же аргументами возвращает кэшированный результат без вычислений.' },
        { type: 'heading', value: 'Реализация memoize' },
        { type: 'code', language: 'javascript', value: '// Простая реализация\nfunction memoize(fn) {\n  const cache = new Map();\n  return function(...args) {\n    const key = JSON.stringify(args);\n    if (cache.has(key)) {\n      return cache.get(key);\n    }\n    const result = fn.apply(this, args);\n    cache.set(key, result);\n    return result;\n  };\n}\n\n// С TTL (time-to-live)\nfunction memoizeWithTTL(fn, ttl = 60000) {\n  const cache = new Map();\n  return function(...args) {\n    const key = JSON.stringify(args);\n    const cached = cache.get(key);\n    if (cached && Date.now() - cached.timestamp < ttl) {\n      return cached.value;\n    }\n    const result = fn.apply(this, args);\n    cache.set(key, { value: result, timestamp: Date.now() });\n    return result;\n  };\n}\n\n// Использование\n// Дорогое вычисление - запускается один раз\nconst fibonacci = memoize(function(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n});\n\nconsole.log(fibonacci(40)); // Быстро, несмотря на рекурсию\n\n// API запрос с кэшированием\nconst getUser = memoizeWithTTL(async (id) => {\n  const res = await fetch(`/api/users/${id}`);\n  return res.json();\n}, 30000); // Кэш на 30 секунд\n\n// React useMemo и useCallback — встроенный memoize\nimport { useMemo, useCallback } from "react";\n\nfunction Component({ data, onUpdate }) {\n  const processed = useMemo(() =>\n    data.filter(x => x.active).sort((a, b) => a.name.localeCompare(b.name)),\n    [data] // Пересчитать только если data изменился\n  );\n\n  const handleClick = useCallback((id) => {\n    onUpdate(id);\n  }, [onUpdate]);\n}' }
      ]
    },
    {
      id: 5,
      title: 'Виртуализация и другие техники',
      type: 'theory',
      content: [
        { type: 'text', value: 'Виртуализация рендерит только видимые элементы большого списка. requestAnimationFrame синхронизирует с рефрешем. Web Workers выносят тяжёлые задачи в фоновый поток.' },
        { type: 'heading', value: 'Дополнительные техники' },
        { type: 'code', language: 'javascript', value: '// 1. requestAnimationFrame для анимаций\nfunction animateCounter(from, to, duration) {\n  const start = performance.now();\n  const update = (time) => {\n    const elapsed = time - start;\n    const progress = Math.min(elapsed / duration, 1);\n    const current = Math.floor(from + (to - from) * progress);\n    element.textContent = current;\n    if (progress < 1) requestAnimationFrame(update);\n  };\n  requestAnimationFrame(update);\n}\n\n// 2. DocumentFragment — batch DOM обновления\nconst renderItems = (items) => {\n  const fragment = document.createDocumentFragment();\n  items.forEach(item => {\n    const li = document.createElement("li");\n    li.textContent = item.name;\n    fragment.appendChild(li); // Не вызывает reflow!\n  });\n  list.appendChild(fragment); // Один reflow в конце\n};\n\n// 3. Web Workers — тяжёлые вычисления\n// worker.js\nself.onmessage = (e) => {\n  const result = heavyCalculation(e.data);\n  self.postMessage(result);\n};\n\n// main.js\nconst worker = new Worker("worker.js");\nworker.postMessage(largeDataset);\nworker.onmessage = (e) => {\n  console.log("Результат:", e.data);\n  // Главный поток не был заблокирован!\n};\n\n// 4. Pooling объектов\nclass ObjectPool {\n  constructor(create, size = 10) {\n    this.create = create;\n    this.pool = Array.from({ length: size }, create);\n  }\n\n  acquire() {\n    return this.pool.pop() || this.create();\n  }\n\n  release(obj) {\n    this.pool.push(obj); // Возвращаем в пул\n  }\n}\n\n// 5. Виртуализация списка (концепция)\nfunction VirtualList({ items, itemHeight, visibleCount }) {\n  const [scrollTop, setScrollTop] = useState(0);\n  const startIdx = Math.floor(scrollTop / itemHeight);\n  const visible = items.slice(startIdx, startIdx + visibleCount);\n  // Рендерим только visible, не все items!\n}' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Оптимизация',
      type: 'practice',
      difficulty: 'medium',
      description: 'Оптимизируйте медленное приложение: добавьте debounce для поиска, throttle для scroll, memoize для вычислений и lazy loading для изображений.',
      requirements: [
        'Добавьте debounce(300ms) к полю поиска, которое делает fetch',
        'Добавьте throttle(50ms) к mousemove обработчику для отслеживания курсора',
        'Мемоизируйте функцию filterAndSort(items, filter, sort)',
        'Реализуйте lazy loading изображений через IntersectionObserver',
        'Используйте requestAnimationFrame для анимации числового счётчика'
      ],
      hint: 'debounce(fn, ms) — откладывает вызов на ms после последнего события. throttle(fn, ms) — вызывает не чаще раза в ms. memoize — кэширует результат по ключу из аргументов. Lazy loading через IntersectionObserver.',
      expectedOutput: 'Поиск с debounce(300): запрос отправляется через 300мс после окончания ввода\nScroll с throttle(100): обработчик вызывается не чаще 10 раз в секунду\nmemoize(fib)(40) -> второй вызов мгновенный (из кэша)\nКартинки загружаются только при попадании в viewport',
      solution: {
        code: '// debounce для поиска\nfunction debounce(fn, delay) {\n  let timer;\n  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };\n}\n\n// throttle для mousemove\nfunction throttle(fn, interval) {\n  let last = 0;\n  return (...args) => {\n    const now = Date.now();\n    if (now - last >= interval) { last = now; return fn(...args); }\n  };\n}\n\n// memoize для вычислений\nfunction memoize(fn) {\n  const cache = new Map();\n  return (...args) => {\n    const key = JSON.stringify(args);\n    if (cache.has(key)) return cache.get(key);\n    const result = fn(...args);\n    cache.set(key, result);\n    return result;\n  };\n}\n\n// Поиск с debounce\nconst search = debounce(async (query) => {\n  if (!query.trim()) return;\n  const data = await fetch(`/api/search?q=${encodeURIComponent(query)}`).then(r => r.json());\n  document.getElementById("results").innerHTML = data.map(i => `<li>${i.name}</li>`).join("");\n}, 300);\ndocument.getElementById("search").addEventListener("input", e => search(e.target.value));\n\n// Cursor с throttle\nconst updateCursor = throttle((x, y) => {\n  document.getElementById("cursor").style.transform = `translate(${x}px, ${y}px)`;\n}, 50);\ndocument.addEventListener("mousemove", e => updateCursor(e.clientX, e.clientY));\n\n// Мемоизированная фильтрация\nconst filterAndSort = memoize((items, filter, sort) =>\n  items.filter(i => i.name.includes(filter)).sort((a, b) => a[sort] > b[sort] ? 1 : -1)\n);\n\n// Lazy loading изображений\nconst observer = new IntersectionObserver(entries => {\n  entries.filter(e => e.isIntersecting).forEach(e => {\n    e.target.src = e.target.dataset.src;\n    observer.unobserve(e.target);\n  });\n}, { rootMargin: "100px" });\ndocument.querySelectorAll("img[data-src]").forEach(img => observer.observe(img));\n\n// rAF счётчик\nfunction animateCounter(el, from, to, ms) {\n  const start = performance.now();\n  const tick = (now) => {\n    const progress = Math.min((now - start) / ms, 1);\n    el.textContent = Math.floor(from + (to - from) * progress);\n    if (progress < 1) requestAnimationFrame(tick);\n  };\n  requestAnimationFrame(tick);\n}\n\nanimateCounter(document.getElementById("counter"), 0, 1000, 2000);',
        language: 'javascript'
      },
      explanation: 'Debounce для поиска откладывает fetch на 300мс после последнего нажатия — без него каждая буква отправляла бы запрос. Throttle для mousemove ограничивает обновления до 20 раз в секунду (50мс), что достаточно для плавного движения. Memoize кэширует результаты filterAndSort — при тех же параметрах не пересчитывает. IntersectionObserver срабатывает когда изображение входит в область видимости с запасом 100px — изображение уже загружается до скролла. requestAnimationFrame синхронизирует анимацию с циклом рендеринга браузера — обновление происходит не чаще 60 раз в секунду.'
    }
  ]
};
