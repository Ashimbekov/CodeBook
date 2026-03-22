export default {
  id: 12,
  title: 'useRef и useCallback',
  description: 'useRef для DOM и мутируемых значений, forwardRef, useCallback для стабилизации функций и предотвращения лишних рендеров',
  lessons: [
    {
      id: 1,
      title: 'useRef — ссылка на DOM элемент',
      type: 'theory',
      content: [
        { type: 'text', value: 'useRef возвращает объект { current: значение }. При использовании с ref атрибутом — указывает на DOM элемент. Изменение ref.current НЕ вызывает ре-рендер.' },
        { type: 'heading', value: 'Базовое использование useRef' },
        { type: 'code', language: 'jsx', value: 'import { useRef, useEffect } from "react";\n\nfunction InputWithFocus() {\n  const inputRef = useRef(null); // Начальное значение null\n\n  // Автофокус при монтировании\n  useEffect(() => {\n    inputRef.current?.focus(); // current = HTMLInputElement\n  }, []);\n\n  const handleClear = () => {\n    if (inputRef.current) {\n      inputRef.current.value = ""; // Можно менять DOM напрямую\n      inputRef.current.focus();\n    }\n  };\n\n  return (\n    <div>\n      <input ref={inputRef} type="text" placeholder="Будет в фокусе" />\n      <button onClick={handleClear}>Очистить</button>\n    </div>\n  );\n}\n\n// Измерение размеров элемента\nfunction MeasureDiv() {\n  const divRef = useRef(null);\n\n  useEffect(() => {\n    if (divRef.current) {\n      const { width, height } = divRef.current.getBoundingClientRect();\n      console.log(`Размер: ${width}x${height}`);\n    }\n  }, []); // После первого рендера\n\n  return <div ref={divRef} style={{ width: "50%", height: "200px", background: "#f0f0f0" }} />;\n}' }
      ]
    },
    {
      id: 2,
      title: 'useRef для мутируемых значений',
      type: 'theory',
      content: [
        { type: 'text', value: 'useRef — не только для DOM. Любое мутируемое значение, которое не должно вызывать ре-рендер: таймеры, предыдущие значения, флаги.' },
        { type: 'heading', value: 'Ref для хранения значений' },
        { type: 'code', language: 'jsx', value: 'import { useRef, useState, useEffect } from "react";\n\n// 1. Таймер через ref\nfunction Timer() {\n  const [seconds, setSeconds] = useState(0);\n  const timerRef = useRef(null);\n\n  const start = () => {\n    if (timerRef.current) return; // Уже запущен\n    timerRef.current = setInterval(() => {\n      setSeconds(s => s + 1);\n    }, 1000);\n  };\n\n  const stop = () => {\n    clearInterval(timerRef.current);\n    timerRef.current = null;\n  };\n\n  useEffect(() => () => clearInterval(timerRef.current), []);\n\n  return (\n    <div>\n      <p>{seconds} сек.</p>\n      <button onClick={start}>Старт</button>\n      <button onClick={stop}>Стоп</button>\n    </div>\n  );\n}\n\n// 2. Предыдущее значение\nfunction usePrevious(value) {\n  const prevRef = useRef(undefined);\n  useEffect(() => {\n    prevRef.current = value; // Обновляется ПОСЛЕ рендера\n  });\n  return prevRef.current; // Возвращает значение ПРЕДЫДУЩЕГО рендера\n}\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  const prevCount = usePrevious(count);\n  return <p>Текущий: {count}, предыдущий: {prevCount}</p>;\n}' }
      ]
    },
    {
      id: 3,
      title: 'forwardRef',
      type: 'theory',
      content: [
        { type: 'text', value: 'forwardRef позволяет родительскому компоненту передать ref вглубь — к DOM элементу дочернего компонента. Нужно для библиотечных компонентов.' },
        { type: 'heading', value: 'Передача ref через forwardRef' },
        { type: 'code', language: 'jsx', value: 'import { forwardRef, useRef, useImperativeHandle } from "react";\n\n// Обычный компонент — ref НЕ работает напрямую\nfunction RegularInput({ ...props }) {\n  return <input {...props} />;\n}\n// <RegularInput ref={myRef} /> <- ref будет null!\n\n// С forwardRef — ref передаётся в input\nconst ForwardedInput = forwardRef(function Input({ label, ...props }, ref) {\n  return (\n    <div>\n      {label && <label>{label}</label>}\n      <input ref={ref} {...props} /> {/* ref прокинут сюда */}\n    </div>\n  );\n});\n\n// Использование:\nfunction Parent() {\n  const inputRef = useRef(null);\n\n  return (\n    <div>\n      <ForwardedInput\n        ref={inputRef} // Теперь ref = HTMLInputElement!\n        label="Email"\n        type="email"\n      />\n      <button onClick={() => inputRef.current?.focus()}>Фокус</button>\n    </div>\n  );\n}' },
        { type: 'heading', value: 'useImperativeHandle — кастомное API через ref' },
        { type: 'code', language: 'jsx', value: 'const FancyInput = forwardRef(function FancyInput(props, ref) {\n  const inputRef = useRef(null);\n\n  // Открываем только нужные методы, не весь HTMLInputElement\n  useImperativeHandle(ref, () => ({\n    focus: () => inputRef.current?.focus(),\n    clear: () => { if (inputRef.current) inputRef.current.value = ""; },\n    getValue: () => inputRef.current?.value || "",\n  }));\n\n  return <input ref={inputRef} {...props} />;\n});\n\nfunction Parent() {\n  const fancyRef = useRef(null);\n  // fancyRef.current = { focus, clear, getValue } — только наши методы!\n  return (\n    <>\n      <FancyInput ref={fancyRef} />\n      <button onClick={() => fancyRef.current?.focus()}>Фокус</button>\n      <button onClick={() => fancyRef.current?.clear()}>Очистить</button>\n    </>\n  );\n}' }
      ]
    },
    {
      id: 4,
      title: 'useCallback — стабильные функции',
      type: 'theory',
      content: [
        { type: 'text', value: 'useCallback возвращает мемоизированную функцию. Функция создаётся заново только при изменении зависимостей. Полезно когда функция передаётся в дочерние компоненты.' },
        { type: 'heading', value: 'Зачем нужен useCallback' },
        { type: 'code', language: 'jsx', value: 'import { useState, useCallback, memo } from "react";\n\n// Дочерний компонент обёрнут в memo — не рендерится если props не изменились\nconst Button = memo(function Button({ onClick, label }) {\n  console.log(`Рендер кнопки: ${label}`);\n  return <button onClick={onClick}>{label}</button>;\n});\n\nfunction Parent() {\n  const [count, setCount] = useState(0);\n  const [text, setText]   = useState("");\n\n  // БЕЗ useCallback: новая функция каждый рендер -> Button всегда перерендеривается!\n  const handleClickBad = () => setCount(c => c + 1);\n\n  // С useCallback: та же ссылка если зависимости не изменились\n  const handleClickGood = useCallback(() => {\n    setCount(c => c + 1);\n  }, []); // Нет зависимостей -> функция создаётся один раз\n\n  return (\n    <div>\n      <input value={text} onChange={e => setText(e.target.value)} />\n      <p>Счёт: {count}</p>\n      <Button onClick={handleClickGood} label="Увеличить" />\n      {/* Кнопка НЕ перерендерится при изменении text */}\n    </div>\n  );\n}' },
        { type: 'tip', value: 'useCallback полезен ТОЛЬКО в паре с memo или когда функция в зависимостях useEffect. Без этого он добавляет overhead без пользы. Не оборачивайте всё в useCallback.' }
      ]
    },
    {
      id: 5,
      title: 'Паттерн: Infinite Scroll с useRef',
      type: 'theory',
      content: [
        { type: 'text', value: 'Infinite scroll (бесконечная прокрутка) — загрузка данных при скролле к низу страницы. Intersection Observer API + useRef делают это эффективно.' },
        { type: 'code', language: 'jsx', value: 'import { useRef, useEffect, useState, useCallback } from "react";\n\nfunction InfiniteList({ fetchMoreData }) {\n  const [items, setItems] = useState([]);\n  const [page, setPage]   = useState(1);\n  const [hasMore, setHasMore] = useState(true);\n  const [loading, setLoading] = useState(false);\n  const loaderRef = useRef(null); // Ссылка на "конец списка"\n\n  const loadMore = useCallback(async () => {\n    if (loading || !hasMore) return;\n    setLoading(true);\n    const newItems = await fetchMoreData(page);\n    if (newItems.length === 0) { setHasMore(false); return; }\n    setItems(prev => [...prev, ...newItems]);\n    setPage(p => p + 1);\n    setLoading(false);\n  }, [page, loading, hasMore, fetchMoreData]);\n\n  // Наблюдаем за loaderRef\n  useEffect(() => {\n    const observer = new IntersectionObserver(\n      (entries) => { if (entries[0].isIntersecting) loadMore(); },\n      { threshold: 0.1 }\n    );\n    const el = loaderRef.current;\n    if (el) observer.observe(el);\n    return () => { if (el) observer.unobserve(el); };\n  }, [loadMore]);\n\n  return (\n    <ul>\n      {items.map(item => <li key={item.id}>{item.name}</li>)}\n      <li ref={loaderRef}>{loading ? "Загрузка..." : hasMore ? "Прокрутите ещё" : "Всё загружено"}</li>\n    </ul>\n  );\n}' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Текстовый редактор',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте простой текстовый редактор с тулбаром. Используйте useRef для доступа к textarea и useCallback для стабильных обработчиков.',
      requirements: [
        'Textarea с ref для вставки форматирования по позиции курсора',
        'Кнопки: Жирный (**text**), Курсив (*text*), Код (`code`), Ссылка ([text](url))',
        'Каждая кнопка оборачивает выделенный текст или вставляет шаблон',
        'useCallback для всех обработчиков кнопок',
        'Счётчик символов внизу',
        'Кнопка копирования в буфер обмена'
      ],
      hint: 'textarea.selectionStart и textarea.selectionEnd — позиции выделения. Вставка: text.slice(0, start) + wrapped + text.slice(end). После вставки — focus и установите позицию курсора.',
      expectedOutput: 'Textarea с кнопками тулбара: жирный, курсив, подчёркнутый\nКнопки работают через useRef — не вызывают ре-рендер\nКнопки мемоизированы через useCallback\nФокус возвращается в textarea после кнопки\nСчётчик символов обновляется при вводе',
      solution: 'import { useRef, useState, useCallback } from "react";\n\nconst TOOLS = [\n  { label: "B", title: "Жирный",  wrap: (t) => t ? `**${t}**` : "**жирный текст**", offset: 2 },\n  { label: "I", title: "Курсив",  wrap: (t) => t ? `*${t}*`   : "*курсив*",         offset: 1 },\n  { label: "</>", title: "Код",  wrap: (t) => t ? `\\`${t}\\`` : "\\`код\\`",          offset: 1 },\n  { label: "🔗", title: "Ссылка", wrap: (t) => `[${t || "текст ссылки"}](url)`,    offset: 1 },\n];\n\nfunction TextEditor() {\n  const [text, setText] = useState("");\n  const [copied, setCopied] = useState(false);\n  const textareaRef = useRef(null);\n\n  const applyTool = useCallback((tool) => {\n    const ta = textareaRef.current;\n    if (!ta) return;\n\n    const start    = ta.selectionStart;\n    const end      = ta.selectionEnd;\n    const selected = text.slice(start, end);\n    const wrapped  = tool.wrap(selected);\n    const newText  = text.slice(0, start) + wrapped + text.slice(end);\n    setText(newText);\n\n    // Восстановить фокус и курсор\n    requestAnimationFrame(() => {\n      ta.focus();\n      const newPos = selected ? start + wrapped.length : start + tool.offset;\n      ta.setSelectionRange(newPos, newPos);\n    });\n  }, [text]);\n\n  const handleCopy = useCallback(() => {\n    navigator.clipboard.writeText(text).then(() => {\n      setCopied(true);\n      setTimeout(() => setCopied(false), 2000);\n    });\n  }, [text]);\n\n  const charCount    = text.length;\n  const wordCount    = text.trim() ? text.trim().split(/\\s+/).length : 0;\n  const lineCount    = text.split("\\n").length;\n\n  return (\n    <div style={{ maxWidth: "600px", border: "1px solid #e5e7eb", borderRadius: "12px", overflow: "hidden" }}>\n      <div style={{ display: "flex", gap: "4px", padding: "8px", borderBottom: "1px solid #e5e7eb", background: "#f9fafb" }}>\n        {TOOLS.map(tool => (\n          <button\n            key={tool.label}\n            title={tool.title}\n            onClick={() => applyTool(tool)}\n            style={{ padding: "6px 10px", border: "1px solid #ddd", borderRadius: "4px", background: "white", cursor: "pointer", fontWeight: "600" }}\n          >\n            {tool.label}\n          </button>\n        ))}\n        <button\n          onClick={handleCopy}\n          style={{ marginLeft: "auto", padding: "6px 10px", border: "1px solid #ddd", borderRadius: "4px", background: copied ? "#dcfce7" : "white", cursor: "pointer" }}\n        >\n          {copied ? "✓ Скопировано" : "Копировать"}\n        </button>\n      </div>\n      <textarea\n        ref={textareaRef}\n        value={text}\n        onChange={e => setText(e.target.value)}\n        placeholder="Начните вводить текст...\\n\\nИспользуйте кнопки или выделите текст и нажмите кнопку форматирования."\n        style={{ width: "100%", minHeight: "300px", padding: "1rem", border: "none", outline: "none", fontFamily: "monospace", fontSize: "14px", resize: "vertical" }}\n      />\n      <div style={{ display: "flex", gap: "1rem", padding: "8px 12px", borderTop: "1px solid #e5e7eb", background: "#f9fafb", fontSize: "12px", color: "#6b7280" }}>\n        <span>{charCount} символов</span>\n        <span>{wordCount} слов</span>\n        <span>{lineCount} строк</span>\n      </div>\n    </div>\n  );\n}\nexport default TextEditor;',
      explanation: 'useRef дает прямой доступ к textarea для чтения selectionStart/selectionEnd. requestAnimationFrame для курсора — DOM должен обновиться после setText. useCallback с [text] — applyTool использует text в closure. handleCopy в useCallback — стабильная ссылка. Счётчики вычисляются из text без state.'
    }
  ]
}
