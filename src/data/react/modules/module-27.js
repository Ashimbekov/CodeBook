export default {
  id: 27,
  title: 'Практикум: Хуки и состояние',
  description: 'Практические задания на создание кастомных хуков и работу с состоянием в React.',
  lessons: [
    {
      id: 1,
      title: 'Хук useLocalStorage: синхронизация с localStorage',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай хук useLocalStorage который работает как useState но синхронизирует значение с localStorage. Поддержи сериализацию JSON.',
      requirements: [
        'API: const [value, setValue] = useLocalStorage(key, initialValue)',
        'При инициализации: читаем из localStorage, если нет — используем initialValue',
        'setValue обновляет и state, и localStorage',
        'Поддержка функции в setValue: setValue(prev => prev + 1)',
        'Обработка ошибок (невалидный JSON в localStorage)',
        'Синхронизация между вкладками через событие storage'
      ],
      hint: 'Используй lazy initializer в useState: useState(() => { try { return JSON.parse(localStorage.getItem(key)) ?? initialValue } catch { return initialValue } }). Для setValue: используй функциональный апдейт.',
      expectedOutput: 'const [theme, setTheme] = useLocalStorage("theme", "light")\nsetTheme("dark") -> localStorage["theme"] = "dark"\nПри перезагрузке страницы -> значение восстановлено из localStorage\nОшибка парсинга JSON -> возвращает defaultValue\nОбновление в одной вкладке -> синхронизация через storage event',
      solution: 'import { useState, useEffect, useCallback } from "react";\n\nfunction useLocalStorage(key, initialValue) {\n  const [storedValue, setStoredValue] = useState(() => {\n    try {\n      const item = window.localStorage.getItem(key);\n      return item !== null ? JSON.parse(item) : initialValue;\n    } catch (err) {\n      console.error("useLocalStorage read error:", err);\n      return initialValue;\n    }\n  });\n\n  const setValue = useCallback((value) => {\n    try {\n      const valueToStore = value instanceof Function ? value(storedValue) : value;\n      setStoredValue(valueToStore);\n      window.localStorage.setItem(key, JSON.stringify(valueToStore));\n    } catch (err) {\n      console.error("useLocalStorage write error:", err);\n    }\n  }, [key, storedValue]);\n\n  // Синхронизация между вкладками\n  useEffect(() => {\n    const handleStorage = (e) => {\n      if (e.key === key && e.newValue !== null) {\n        try { setStoredValue(JSON.parse(e.newValue)); } catch {}\n      }\n    };\n    window.addEventListener("storage", handleStorage);\n    return () => window.removeEventListener("storage", handleStorage);\n  }, [key]);\n\n  return [storedValue, setValue];\n}\n\n// Демо\nfunction App() {\n  const [name, setName] = useLocalStorage("user-name", "");\n  const [theme, setTheme] = useLocalStorage("theme", "light");\n  const [count, setCount] = useLocalStorage("count", 0);\n\n  return (\n    <div style={{ padding: "20px" }}>\n      <input value={name} onChange={e => setName(e.target.value)} placeholder="Ваше имя (сохраняется)" />\n      <button onClick={() => setTheme(t => t === "light" ? "dark" : "light")}>Тема: {theme}</button>\n      <button onClick={() => setCount(c => c + 1)}>Счётчик: {count}</button>\n      <p>Обновите страницу — данные сохранятся!</p>\n    </div>\n  );\n}',
      explanation: 'useLocalStorage использует lazy initializer для чтения из localStorage только при монтировании. Событие storage синхронизирует значение если оно изменилось в другой вкладке.'
    },
    {
      id: 2,
      title: 'Хук useDebounce и useThrottle',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай хуки useDebounce (задержка выполнения) и useThrottle (ограничение частоты). Применяй для оптимизации поиска и обработчиков событий.',
      requirements: [
        'useDebounce(value, delay): возвращает задебаунсированное значение',
        'Значение обновляется только если не было изменений в течение delay мс',
        'useThrottle(value, limit): значение обновляется не чаще чем раз в limit мс',
        'useDebounce применяется для поиска: API запрос при остановке ввода',
        'useThrottle применяется для scroll/resize обработчиков'
      ],
      hint: 'useDebounce: useEffect с setTimeout. Cleanup (return) отменяет предыдущий таймер. useThrottle: useRef для последнего времени обновления, сравниваем Date.now() с lastUpdated.',
      expectedOutput: 'useDebounce(value, 500) -> обновляется через 500мс после последнего изменения\nПри быстром вводе "hello" -> fetch запрос только один раз\nuseThrottle(scrollY, 100) -> обновляется не чаще 10 раз/сек\nThrottle при scroll -> только каждые 100мс',
      solution: 'import { useState, useEffect, useRef, useCallback } from "react";\n\nfunction useDebounce(value, delay = 500) {\n  const [debouncedValue, setDebouncedValue] = useState(value);\n\n  useEffect(() => {\n    const timer = setTimeout(() => setDebouncedValue(value), delay);\n    return () => clearTimeout(timer);\n  }, [value, delay]);\n\n  return debouncedValue;\n}\n\nfunction useThrottle(value, limit = 300) {\n  const [throttledValue, setThrottledValue] = useState(value);\n  const lastUpdated = useRef(Date.now());\n\n  useEffect(() => {\n    const now = Date.now();\n    if (now - lastUpdated.current >= limit) {\n      lastUpdated.current = now;\n      setThrottledValue(value);\n    } else {\n      const timer = setTimeout(() => {\n        lastUpdated.current = Date.now();\n        setThrottledValue(value);\n      }, limit - (now - lastUpdated.current));\n      return () => clearTimeout(timer);\n    }\n  }, [value, limit]);\n\n  return throttledValue;\n}\n\n// Применение debounce для поиска\nfunction SearchInput() {\n  const [query, setQuery] = useState("");\n  const debouncedQuery = useDebounce(query, 500);\n  const [results, setResults] = useState([]);\n\n  useEffect(() => {\n    if (!debouncedQuery) { setResults([]); return; }\n    fetch("https://jsonplaceholder.typicode.com/posts?title_like=" + debouncedQuery)\n      .then(r => r.json())\n      .then(data => setResults(data.slice(0, 5)));\n  }, [debouncedQuery]);\n\n  return (\n    <div>\n      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Поиск... (дебаунс 500мс)" />\n      <p>Запрос: {debouncedQuery || "(пусто)"}</p>\n      {results.map(r => <p key={r.id}>{r.title}</p>)}\n    </div>\n  );\n}',
      explanation: 'Debounce vs Throttle: debounce ждёт паузы в изменениях (поиск), throttle ограничивает частоту (scroll). Оба используют таймеры, но с разной логикой. Cleanup важен для предотвращения утечек памяти.'
    },
    {
      id: 3,
      title: 'Хук useForm: управление формами',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай универсальный хук useForm для управления формами с валидацией, touched state и async submit.',
      requirements: [
        'useForm({ initialValues, validate, onSubmit })',
        'Возвращает: values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, reset',
        'handleChange обновляет values и очищает ошибку поля',
        'handleBlur помечает поле как touched',
        'Ошибки показываются только для touched полей',
        'handleSubmit: вызывает validate, если ошибок нет — вызывает onSubmit'
      ],
      hint: 'touched — объект { fieldName: boolean }. handleBlur: setTouched(prev => ({...prev, [name]: true})). В handleSubmit: сначала помечаем все поля как touched, потом проверяем ошибки.',
      expectedOutput: 'const { values, errors, handleChange, handleSubmit } = useForm(initial, rules)\nHandleChange обновляет values\nValidation запускается при submit или onBlur\nErrors: { field: "сообщение об ошибке" }\nHandleSubmit вызывает onSubmit только при валидных данных',
      solution: 'import { useState, useCallback } from "react";\n\nfunction useForm({ initialValues, validate, onSubmit }) {\n  const [values, setValues] = useState(initialValues);\n  const [errors, setErrors] = useState({});\n  const [touched, setTouched] = useState({});\n  const [isSubmitting, setIsSubmitting] = useState(false);\n\n  const handleChange = useCallback((e) => {\n    const { name, value } = e.target;\n    setValues(prev => ({ ...prev, [name]: value }));\n    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));\n  }, [errors]);\n\n  const handleBlur = useCallback((e) => {\n    const { name } = e.target;\n    setTouched(prev => ({ ...prev, [name]: true }));\n    if (validate) {\n      const newErrors = validate({ ...values, [name]: values[name] });\n      if (newErrors[name]) setErrors(prev => ({ ...prev, [name]: newErrors[name] }));\n    }\n  }, [values, validate]);\n\n  const handleSubmit = useCallback(async (e) => {\n    e.preventDefault();\n    const allTouched = Object.keys(initialValues).reduce((acc, k) => ({ ...acc, [k]: true }), {});\n    setTouched(allTouched);\n    const newErrors = validate ? validate(values) : {};\n    setErrors(newErrors);\n    if (Object.keys(newErrors).some(k => newErrors[k])) return;\n    setIsSubmitting(true);\n    try { await onSubmit(values); } finally { setIsSubmitting(false); }\n  }, [values, validate, onSubmit, initialValues]);\n\n  const reset = useCallback(() => {\n    setValues(initialValues); setErrors({}); setTouched({});\n  }, [initialValues]);\n\n  return { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, reset };\n}\n\n// Пример использования\nfunction RegistrationForm() {\n  const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting } = useForm({\n    initialValues: { name: "", email: "", password: "" },\n    validate: (values) => {\n      const errors = {};\n      if (!values.name) errors.name = "Имя обязательно";\n      if (!values.email || !values.email.includes("@")) errors.email = "Неверный email";\n      if (!values.password || values.password.length < 6) errors.password = "Минимум 6 символов";\n      return errors;\n    },\n    onSubmit: async (values) => {\n      await new Promise(r => setTimeout(r, 1000));\n      console.log("Отправлено:", values);\n    },\n  });\n\n  return (\n    <form onSubmit={handleSubmit}>\n      {["name", "email", "password"].map(field => (\n        <div key={field}>\n          <input name={field} type={field === "password" ? "password" : "text"}\n            value={values[field]} onChange={handleChange} onBlur={handleBlur}\n            placeholder={field} />\n          {touched[field] && errors[field] && <span style={{color:"red"}}>{errors[field]}</span>}\n        </div>\n      ))}\n      <button type="submit" disabled={isSubmitting}>{isSubmitting ? "Регистрация..." : "Зарегистрироваться"}</button>\n    </form>\n  );\n}',
      explanation: 'useForm инкапсулирует всю логику формы. Ключевые паттерны: touched предотвращает показ ошибок до взаимодействия; в handleSubmit помечаем всё как touched чтобы показать все ошибки при попытке отправки.'
    },
    {
      id: 4,
      title: 'Хук useIntersectionObserver: ленивая загрузка',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай хук useIntersectionObserver для отслеживания видимости элемента в viewport. Используй для ленивой загрузки изображений и бесконечной прокрутки.',
      requirements: [
        'useIntersectionObserver(options): возвращает [ref, isIntersecting]',
        'Подключается к Intersection Observer API',
        'Пропс once: boolean — останавливать наблюдение после первого пересечения',
        'Поддержка threshold и rootMargin',
        'Применение 1: LazyImage — загружает изображение только когда попадает в viewport',
        'Применение 2: InfiniteScroll — загружает следующую страницу когда достигнут конец'
      ],
      hint: 'IntersectionObserver принимает callback и options. observer.observe(element). Cleanup: observer.unobserve(element). Ref callback: useCallback((node) => { if (node) observer.observe(node) }).',
      expectedOutput: 'const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 })\nПри прокрутке к элементу: isVisible -> true\nКомпонент загружает данные только когда стал видимым\nОтсоединяется при размонтировании (observer.disconnect())\nLazy loading изображений: src устанавливается при isVisible',
      solution: 'import { useState, useEffect, useRef, useCallback } from "react";\n\nfunction useIntersectionObserver({ threshold = 0, rootMargin = "0px", once = false } = {}) {\n  const [isIntersecting, setIsIntersecting] = useState(false);\n  const [hasIntersected, setHasIntersected] = useState(false);\n  const ref = useRef(null);\n\n  useEffect(() => {\n    const element = ref.current;\n    if (!element) return;\n    if (once && hasIntersected) return;\n\n    const observer = new IntersectionObserver(\n      ([entry]) => {\n        setIsIntersecting(entry.isIntersecting);\n        if (entry.isIntersecting) { setHasIntersected(true); if (once) observer.unobserve(element); }\n      },\n      { threshold, rootMargin }\n    );\n\n    observer.observe(element);\n    return () => observer.unobserve(element);\n  }, [threshold, rootMargin, once, hasIntersected]);\n\n  return [ref, isIntersecting];\n}\n\n// LazyImage\nfunction LazyImage({ src, alt, ...props }) {\n  const [ref, isVisible] = useIntersectionObserver({ once: true, rootMargin: "100px" });\n  const [loaded, setLoaded] = useState(false);\n\n  return (\n    <div ref={ref} style={{ minHeight: "200px", background: "#f3f4f6", ...props.style }}>\n      {isVisible && (\n        <img src={src} alt={alt}\n          onLoad={() => setLoaded(true)}\n          style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.3s", width: "100%" }} />\n      )}\n    </div>\n  );\n}\n\n// InfiniteScroll\nfunction InfiniteList() {\n  const [items, setItems] = useState(Array.from({ length: 10 }, (_, i) => i + 1));\n  const [loading, setLoading] = useState(false);\n  const [sentinelRef, isVisible] = useIntersectionObserver({ threshold: 0.5 });\n\n  useEffect(() => {\n    if (!isVisible || loading) return;\n    setLoading(true);\n    setTimeout(() => {\n      setItems(prev => [...prev, ...Array.from({ length: 10 }, (_, i) => prev.length + i + 1)]);\n      setLoading(false);\n    }, 800);\n  }, [isVisible]);\n\n  return (\n    <div style={{ height: "400px", overflowY: "auto" }}>\n      {items.map(i => <div key={i} style={{ padding: "20px", borderBottom: "1px solid #eee" }}>Элемент {i}</div>)}\n      <div ref={sentinelRef} style={{ padding: "20px", textAlign: "center", color: "#9ca3af" }}>\n        {loading ? "Загрузка..." : "Прокрутите вниз"}\n      </div>\n    </div>\n  );\n}',
      explanation: 'IntersectionObserver — современный браузерный API для отслеживания видимости. Более производительный чем обработчики scroll. once: true останавливает наблюдение после первого появления — идеально для LazyImage.'
    },
    {
      id: 5,
      title: 'Хук useUndoRedo: история изменений',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай хук useUndoRedo который добавляет историю изменений к любому состоянию. Поддержи команды Ctrl+Z и Ctrl+Y.',
      requirements: [
        'useUndoRedo(initialState): возвращает [state, setState, { undo, redo, canUndo, canRedo, history }]',
        'История хранится как массив прошлых состояний',
        'undo: переходит к предыдущему состоянию',
        'redo: переходит к следующему состоянию после undo',
        'canUndo, canRedo: boolean флаги',
        'При новом setState: история redo очищается',
        'Клавиатурный шорткат Ctrl+Z / Ctrl+Y'
      ],
      hint: 'Хранить три массива: past (история до текущего), present (текущее), future (история redo). setState: past = [...past, present], present = newValue, future = []. undo: future = [present, ...future], present = past[last], past = past.slice(0,-1).',
      expectedOutput: 'const [state, setState, { undo, redo, canUndo, canRedo }] = useUndoRedo(initial)\nundo() -> возвращает предыдущее состояние\nredo() -> возвращает следующее состояние\ncanUndo=false на первом состоянии\nCtrl+Z / Ctrl+Y работают через keydown listener',
      solution: 'import { useState, useCallback, useEffect } from "react";\n\nfunction useUndoRedo(initialState) {\n  const [history, setHistory] = useState({\n    past: [],\n    present: initialState,\n    future: [],\n  });\n\n  const setState = useCallback((newState) => {\n    setHistory(prev => ({\n      past: [...prev.past, prev.present],\n      present: newState instanceof Function ? newState(prev.present) : newState,\n      future: [], // Очищаем историю вперёд\n    }));\n  }, []);\n\n  const undo = useCallback(() => {\n    setHistory(prev => {\n      if (prev.past.length === 0) return prev;\n      const previous = prev.past[prev.past.length - 1];\n      return {\n        past: prev.past.slice(0, -1),\n        present: previous,\n        future: [prev.present, ...prev.future],\n      };\n    });\n  }, []);\n\n  const redo = useCallback(() => {\n    setHistory(prev => {\n      if (prev.future.length === 0) return prev;\n      const next = prev.future[0];\n      return {\n        past: [...prev.past, prev.present],\n        present: next,\n        future: prev.future.slice(1),\n      };\n    });\n  }, []);\n\n  // Ctrl+Z / Ctrl+Y\n  useEffect(() => {\n    const handler = (e) => {\n      if (e.ctrlKey || e.metaKey) {\n        if (e.key === "z" && !e.shiftKey) { e.preventDefault(); undo(); }\n        if (e.key === "y" || (e.key === "z" && e.shiftKey)) { e.preventDefault(); redo(); }\n      }\n    };\n    window.addEventListener("keydown", handler);\n    return () => window.removeEventListener("keydown", handler);\n  }, [undo, redo]);\n\n  return [\n    history.present,\n    setState,\n    { undo, redo, canUndo: history.past.length > 0, canRedo: history.future.length > 0, history },\n  ];\n}\n\nfunction TextEditor() {\n  const [text, setText, { undo, redo, canUndo, canRedo }] = useUndoRedo("");\n\n  return (\n    <div>\n      <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>\n        <button onClick={undo} disabled={!canUndo}>↩ Undo (Ctrl+Z)</button>\n        <button onClick={redo} disabled={!canRedo}>↪ Redo (Ctrl+Y)</button>\n      </div>\n      <textarea value={text} onChange={e => setText(e.target.value)}\n        style={{ width: "100%", height: "150px" }}\n        placeholder="Введите текст и попробуйте Ctrl+Z" />\n    </div>\n  );\n}',
      explanation: 'Undo/Redo реализуется через три стека: past, present, future. Undo: переносим present в future, достаём из past. Redo: обратная операция. При новом setState future очищается — нельзя "вернуть" то, что уже изменили.'
    },
    {
      id: 6,
      title: 'Хук useWebSocket: реальное время',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай хук useWebSocket для работы с WebSocket соединением. Реализуй автоматическое переподключение при обрыве связи.',
      requirements: [
        'useWebSocket(url): возвращает { messages, sendMessage, status, disconnect }',
        'status: "connecting" | "connected" | "disconnected" | "error"',
        'Автоматическое переподключение через 3 секунды при разрыве',
        'sendMessage сериализует объекты в JSON',
        'Очистка соединения при размонтировании компонента',
        'Максимум 5 попыток переподключения'
      ],
      hint: 'WebSocket: new WebSocket(url). События: onopen, onmessage, onerror, onclose. reconnectAttempts хранить в useRef (не useState!). В cleanup: ws.close(), clearTimeout(reconnectTimer).',
      expectedOutput: 'const { send, lastMessage, readyState } = useWebSocket("ws://...")\nreadyState: 0=CONNECTING, 1=OPEN, 3=CLOSED\nПри разрыве: автоматическое переподключение через 3с\nlastMessage обновляется при каждом новом сообщении\nПри размонтировании: соединение закрывается',
      solution: 'import { useState, useEffect, useRef, useCallback } from "react";\n\nfunction useWebSocket(url) {\n  const [messages, setMessages] = useState([]);\n  const [status, setStatus] = useState("connecting");\n  const wsRef = useRef(null);\n  const reconnectTimer = useRef(null);\n  const attempts = useRef(0);\n  const MAX_ATTEMPTS = 5;\n\n  const connect = useCallback(() => {\n    try {\n      const ws = new WebSocket(url);\n      wsRef.current = ws;\n      setStatus("connecting");\n\n      ws.onopen = () => { setStatus("connected"); attempts.current = 0; };\n\n      ws.onmessage = (e) => {\n        try {\n          const data = JSON.parse(e.data);\n          setMessages(prev => [...prev, { ...data, timestamp: Date.now() }]);\n        } catch {\n          setMessages(prev => [...prev, { text: e.data, timestamp: Date.now() }]);\n        }\n      };\n\n      ws.onerror = () => setStatus("error");\n\n      ws.onclose = () => {\n        setStatus("disconnected");\n        if (attempts.current < MAX_ATTEMPTS) {\n          attempts.current++;\n          reconnectTimer.current = setTimeout(connect, 3000);\n        }\n      };\n    } catch (err) {\n      setStatus("error");\n    }\n  }, [url]);\n\n  useEffect(() => {\n    connect();\n    return () => {\n      clearTimeout(reconnectTimer.current);\n      wsRef.current?.close();\n    };\n  }, [connect]);\n\n  const sendMessage = useCallback((data) => {\n    if (wsRef.current?.readyState === WebSocket.OPEN) {\n      wsRef.current.send(typeof data === "string" ? data : JSON.stringify(data));\n    }\n  }, []);\n\n  const disconnect = useCallback(() => {\n    attempts.current = MAX_ATTEMPTS; // Блокируем переподключение\n    wsRef.current?.close();\n  }, []);\n\n  return { messages, sendMessage, status, disconnect };\n}\n\n// Демо (требует WebSocket сервер или wss://echo.websocket.events)\nfunction Chat() {\n  const { messages, sendMessage, status } = useWebSocket("wss://echo.websocket.events");\n  const [input, setInput] = React.useState("");\n\n  return (\n    <div>\n      <p>Статус: <strong>{status}</strong></p>\n      <div style={{ height: "200px", overflowY: "auto", border: "1px solid #eee", padding: "8px" }}>\n        {messages.map((m, i) => <p key={i} style={{ margin: "4px 0" }}>{m.text || JSON.stringify(m)}</p>)}\n      </div>\n      <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>\n        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Сообщение" />\n        <button onClick={() => { sendMessage({ text: input }); setInput(""); }}>Отправить</button>\n      </div>\n    </div>\n  );\n}',
      explanation: 'WebSocket хук: reconnectAttempts в useRef (не useState) чтобы не вызывать ререндер при изменении. Cleanup закрывает соединение и очищает таймер переподключения. MAX_ATTEMPTS предотвращает бесконечный цикл.'
    },
    {
      id: 7,
      title: 'Хук useAnimation: программные анимации',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай хук useAnimation использующий requestAnimationFrame для плавных анимаций. Реализуй счётчик с плавным изменением числа.',
      requirements: [
        'useCountUp({ from, to, duration, onComplete }) — плавно считает от from до to за duration мс',
        'Использует requestAnimationFrame для каждого кадра',
        'easing функция: easeOutQuad для замедления в конце',
        'Возвращает { value, start, stop, reset }',
        'При вызове start — начинает анимацию',
        'Cleanup: cancelAnimationFrame при размонтировании'
      ],
      hint: 'requestAnimationFrame передаёт timestamp. Прогресс: (currentTime - startTime) / duration, clamped 0-1. easeOutQuad(t): t * (2 - t). Значение: from + (to - from) * easedProgress.',
      expectedOutput: 'const { value, start, stop } = useAnimation({ from: 0, to: 100, duration: 1000 })\nstart() -> value анимируется от 0 до 100 за 1000мс через requestAnimationFrame\nstop() -> анимация останавливается\nEasing функции: linear, easeIn, easeOut\nАнимация очищается при размонтировании',
      solution: 'import { useState, useRef, useCallback, useEffect } from "react";\n\nconst easeOutQuad = t => t * (2 - t);\n\nfunction useCountUp({ from = 0, to, duration = 1000, onComplete } = {}) {\n  const [value, setValue] = useState(from);\n  const frameRef = useRef(null);\n  const startTimeRef = useRef(null);\n  const isRunning = useRef(false);\n\n  const animate = useCallback((timestamp) => {\n    if (!startTimeRef.current) startTimeRef.current = timestamp;\n    const elapsed = timestamp - startTimeRef.current;\n    const progress = Math.min(elapsed / duration, 1);\n    const easedProgress = easeOutQuad(progress);\n    const currentValue = Math.round(from + (to - from) * easedProgress);\n\n    setValue(currentValue);\n\n    if (progress < 1) {\n      frameRef.current = requestAnimationFrame(animate);\n    } else {\n      isRunning.current = false;\n      onComplete?.();\n    }\n  }, [from, to, duration, onComplete]);\n\n  const start = useCallback(() => {\n    if (isRunning.current) return;\n    isRunning.current = true;\n    startTimeRef.current = null;\n    setValue(from);\n    frameRef.current = requestAnimationFrame(animate);\n  }, [from, animate]);\n\n  const stop = useCallback(() => {\n    cancelAnimationFrame(frameRef.current);\n    isRunning.current = false;\n  }, []);\n\n  const reset = useCallback(() => {\n    stop();\n    setValue(from);\n  }, [stop, from]);\n\n  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);\n\n  return { value, start, stop, reset };\n}\n\n// Статистика с анимацией\nfunction Stats() {\n  const users = useCountUp({ from: 0, to: 15842, duration: 2000 });\n  const revenue = useCountUp({ from: 0, to: 284751, duration: 2500 });\n  const rating = useCountUp({ from: 0, to: 98, duration: 1500 });\n\n  const startAll = () => { users.start(); revenue.start(); rating.start(); };\n\n  return (\n    <div style={{ display: "flex", gap: "24px", padding: "20px" }}>\n      <div style={{ textAlign: "center" }}>\n        <div style={{ fontSize: "36px", fontWeight: "bold", color: "#2563eb" }}>{users.value.toLocaleString()}</div>\n        <div>Пользователей</div>\n      </div>\n      <div style={{ textAlign: "center" }}>\n        <div style={{ fontSize: "36px", fontWeight: "bold", color: "#16a34a" }}>{revenue.value.toLocaleString()} тг</div>\n        <div>Выручка</div>\n      </div>\n      <div style={{ textAlign: "center" }}>\n        <div style={{ fontSize: "36px", fontWeight: "bold", color: "#dc2626" }}>{rating.value}%</div>\n        <div>Удовлетворённость</div>\n      </div>\n      <button onClick={startAll}>Запустить анимацию</button>\n    </div>\n  );\n}',
      explanation: 'requestAnimationFrame даёт 60 fps анимацию синхронизованную с обновлением экрана. easeOutQuad создаёт плавное замедление. cancelAnimationFrame в cleanup предотвращает утечки памяти.'
    },
    {
      id: 8,
      title: 'useReducer: сложная логика состояния',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй корзину интернет-магазина используя useReducer. Логика должна быть чистой и тестируемой.',
      requirements: [
        'Состояние: items (массив), discount (0-100), shippingMethod ("standard"|"express")',
        'Actions: ADD_ITEM, REMOVE_ITEM, UPDATE_QUANTITY, APPLY_DISCOUNT, SET_SHIPPING, CLEAR_CART',
        'ADD_ITEM: если товар уже есть — увеличивает количество, иначе добавляет с quantity: 1',
        'Вычисляемые значения: subtotal, discountAmount, shippingCost, total',
        'shippingCost: standard=500, express=1200, бесплатно при subtotal > 15000',
        'Компонент CartPage использует useReducer напрямую'
      ],
      hint: 'Вычисляемые значения (subtotal, total) вычисляй из state внутри компонента или useReducer через useMemo. Reducer — чистая функция, никаких side effects.',
      expectedOutput: 'Корзина управляется через useReducer\nadd_item: добавляет товар или увеличивает количество\nremove_item: удаляет товар\nupdate_quantity: обновляет количество\nclear_cart: очищает корзину\nReduce вычисляет total из items',
      solution: 'import { useReducer, useMemo } from "react";\n\nconst initialState = { items: [], discount: 0, shippingMethod: "standard" };\n\nfunction cartReducer(state, action) {\n  switch (action.type) {\n    case "ADD_ITEM": {\n      const existing = state.items.find(i => i.id === action.payload.id);\n      if (existing) {\n        return { ...state, items: state.items.map(i => i.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i) };\n      }\n      return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] };\n    }\n    case "REMOVE_ITEM": return { ...state, items: state.items.filter(i => i.id !== action.payload) };\n    case "UPDATE_QUANTITY": {\n      if (action.payload.quantity <= 0) return { ...state, items: state.items.filter(i => i.id !== action.payload.id) };\n      return { ...state, items: state.items.map(i => i.id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i) };\n    }\n    case "APPLY_DISCOUNT": return { ...state, discount: Math.min(100, Math.max(0, action.payload)) };\n    case "SET_SHIPPING": return { ...state, shippingMethod: action.payload };\n    case "CLEAR_CART": return initialState;\n    default: return state;\n  }\n}\n\nfunction CartPage() {\n  const [state, dispatch] = useReducer(cartReducer, initialState);\n  const { items, discount, shippingMethod } = state;\n\n  const { subtotal, discountAmount, shippingCost, total } = useMemo(() => {\n    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);\n    const discountAmount = (subtotal * discount) / 100;\n    const shippingCost = subtotal > 15000 ? 0 : shippingMethod === "express" ? 1200 : 500;\n    return { subtotal, discountAmount, shippingCost, total: subtotal - discountAmount + shippingCost };\n  }, [items, discount, shippingMethod]);\n\n  const sampleProducts = [\n    { id: 1, name: "Наушники", price: 5000 },\n    { id: 2, name: "Мышь", price: 3500 },\n    { id: 3, name: "Клавиатура", price: 8000 },\n  ];\n\n  return (\n    <div style={{ padding: "20px" }}>\n      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>\n        {sampleProducts.map(p => (\n          <button key={p.id} onClick={() => dispatch({ type: "ADD_ITEM", payload: p })}>\n            + {p.name} ({p.price} тг)\n          </button>\n        ))}\n      </div>\n      {items.map(item => (\n        <div key={item.id} style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "8px" }}>\n          <span>{item.name}</span>\n          <button onClick={() => dispatch({ type: "UPDATE_QUANTITY", payload: { id: item.id, quantity: item.quantity - 1 } })}>-</button>\n          <span>{item.quantity}</span>\n          <button onClick={() => dispatch({ type: "UPDATE_QUANTITY", payload: { id: item.id, quantity: item.quantity + 1 } })}>+</button>\n          <button onClick={() => dispatch({ type: "REMOVE_ITEM", payload: item.id })}>Удалить</button>\n        </div>\n      ))}\n      <div style={{ marginTop: "16px", borderTop: "1px solid #eee", paddingTop: "16px" }}>\n        <p>Промокод: <input type="number" onChange={e => dispatch({ type: "APPLY_DISCOUNT", payload: Number(e.target.value) })} style={{ width: "60px" }} /> %</p>\n        <p>Доставка: <button onClick={() => dispatch({ type: "SET_SHIPPING", payload: "standard" })}>Стандарт</button> <button onClick={() => dispatch({ type: "SET_SHIPPING", payload: "express" })}>Экспресс</button></p>\n        <p>Подитог: {subtotal} тг</p>\n        {discount > 0 && <p>Скидка {discount}%: -{discountAmount} тг</p>}\n        <p>Доставка: {shippingCost === 0 ? "Бесплатно" : shippingCost + " тг"}</p>\n        <p><strong>Итого: {total} тг</strong></p>\n      </div>\n    </div>\n  );\n}',
      explanation: 'useReducer идеален для корзины: все изменения состояния через actions, чистые функции легко тестировать. useMemo для вычисляемых значений: пересчитываются только при изменении items/discount/shippingMethod.'
    },
    {
      id: 9,
      title: 'Хук useMediaQuery: адаптивность в JS',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создай хук useMediaQuery для проверки CSS медиазапросов в JavaScript. Используй для показа/скрытия элементов на основе размера экрана.',
      requirements: [
        'useMediaQuery(query): возвращает boolean',
        'Отслеживает изменения через MediaQueryList.addEventListener("change", ...)',
        'Cleanup: removeEventListener при размонтировании',
        'Хуки-сокращения: useIsMobile(), useIsTablet(), useIsDesktop()',
        'Демо: компонент который показывает разный контент на мобильных и десктопе'
      ],
      hint: 'window.matchMedia(query) создаёт MediaQueryList. Начальное значение: mql.matches. Событие change: mql.addEventListener("change", handler) где handler = e => setMatches(e.matches).',
      expectedOutput: 'useMediaQuery("(max-width: 768px)") -> true на мобильных\nПри изменении размера окна -> значение обновляется\nКомпонент показывает мобильное/десктопное меню в зависимости от breakpoint\nОтписка от listener при размонтировании',
      solution: 'import { useState, useEffect } from "react";\n\nfunction useMediaQuery(query) {\n  const [matches, setMatches] = useState(() => {\n    if (typeof window === "undefined") return false;\n    return window.matchMedia(query).matches;\n  });\n\n  useEffect(() => {\n    const mql = window.matchMedia(query);\n    const handler = (e) => setMatches(e.matches);\n\n    mql.addEventListener("change", handler);\n    setMatches(mql.matches);\n\n    return () => mql.removeEventListener("change", handler);\n  }, [query]);\n\n  return matches;\n}\n\n// Удобные обёртки\nconst useIsMobile = () => useMediaQuery("(max-width: 767px)");\nconst useIsTablet = () => useMediaQuery("(min-width: 768px) and (max-width: 1023px)");\nconst useIsDesktop = () => useMediaQuery("(min-width: 1024px)");\nconst usePrefersDark = () => useMediaQuery("(prefers-color-scheme: dark)");\n\n// Демо\nfunction ResponsiveLayout() {\n  const isMobile = useIsMobile();\n  const isDesktop = useIsDesktop();\n  const prefersDark = usePrefersDark();\n\n  return (\n    <div style={{ padding: "20px", background: prefersDark ? "#1f2937" : "#f9fafb", color: prefersDark ? "#f9fafb" : "#111827", minHeight: "200px" }}>\n      <p>Тема: {prefersDark ? "Тёмная" : "Светлая"}</p>\n      {isMobile && <p>Мобильный вид: компактное меню</p>}\n      {isDesktop && <p>Десктопный вид: боковая панель</p>}\n      <p>Ширина экрана: {isMobile ? "< 768px" : isDesktop ? ">= 1024px" : "768-1023px"}</p>\n    </div>\n  );\n}',
      explanation: 'useMediaQuery позволяет реагировать на изменение viewport в JS, а не только через CSS. Это нужно когда нужна разная JS-логика на разных устройствах, а не только визуальные изменения.'
    },
    {
      id: 10,
      title: 'Хук usePrevious и useCompare: отслеживание изменений',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создай хуки usePrevious (предыдущее значение) и useWhyDidYouUpdate (отладка ненужных ререндеров). Полезны для отладки и условной логики.',
      requirements: [
        'usePrevious(value): возвращает предыдущее значение пропса/state',
        'При первом рендере возвращает undefined',
        'useWhyDidYouUpdate(name, props): логирует в консоль какие пропсы изменились',
        'Показывает: старое и новое значение каждого изменившегося пропса',
        'Демо: компонент который сравнивает текущее и предыдущее значение счётчика',
        'Компонент с useWhyDidYouUpdate показывающий изменения пропсов'
      ],
      hint: 'usePrevious использует useRef: ref.current хранит предыдущее значение. В useEffect (без зависимостей от value или с [value]): сохраняем value в ref.current ПОСЛЕ рендера. Возвращаем ref.current ДО обновления.',
      expectedOutput: 'usePrevious(count) -> undefined при первом рендере, затем предыдущее значение\nusePrevious("hello") -> при изменении на "world" возвращает "hello"\nuseWhyDidYouUpdate("MyComponent", props) -> в консоли список изменившихся пропсов\nПомогает найти лишние ре-рендеры',
      solution: 'import { useRef, useEffect } from "react";\n\nfunction usePrevious(value) {\n  const ref = useRef(undefined);\n\n  useEffect(() => {\n    ref.current = value;\n  }); // Без зависимостей — каждый рендер\n\n  return ref.current; // Возвращаем ПРЕДЫДУЩЕЕ (до текущего рендера)\n}\n\nfunction useWhyDidYouUpdate(name, props) {\n  const prevProps = useRef({});\n\n  useEffect(() => {\n    const allKeys = new Set([...Object.keys(prevProps.current), ...Object.keys(props)]);\n    const changed = {};\n\n    allKeys.forEach(key => {\n      if (prevProps.current[key] !== props[key]) {\n        changed[key] = {\n          from: prevProps.current[key],\n          to: props[key],\n        };\n      }\n    });\n\n    if (Object.keys(changed).length) {\n      console.log("[useWhyDidYouUpdate]", name, changed);\n    }\n\n    prevProps.current = props;\n  });\n}\n\n// Демо usePrevious\nfunction CounterWithHistory() {\n  const [count, setCount] = React.useState(0);\n  const prevCount = usePrevious(count);\n\n  return (\n    <div>\n      <p>Текущее: {count}</p>\n      <p>Предыдущее: {prevCount ?? "нет"}</p>\n      <p>Изменение: {prevCount !== undefined ? count - prevCount > 0 ? "+" : "" + (count - prevCount) : "—"}</p>\n      <button onClick={() => setCount(c => c + 1)}>+1</button>\n      <button onClick={() => setCount(c => c - 1)}>-1</button>\n    </div>\n  );\n}\n\n// Демо useWhyDidYouUpdate\nfunction DebugComponent({ name, age, score }) {\n  useWhyDidYouUpdate("DebugComponent", { name, age, score });\n  return <div>{name} — {age} лет, счёт: {score}</div>;\n}',
      explanation: 'usePrevious хитро использует useEffect: он запускается ПОСЛЕ рендера, поэтому во время рендера ref.current всё ещё содержит предыдущее значение. useWhyDidYouUpdate помогает найти лишние ререндеры — ценный инструмент отладки.'
    }
  ]
}
