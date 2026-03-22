export default {
  id: 26,
  title: 'Практикум: Компоненты',
  description: 'Практические задания на создание React-компонентов: от простых кнопок до сложных интерактивных виджетов.',
  lessons: [
    {
      id: 1,
      title: 'Компонент Badge: цветные метки',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создай компонент Badge который отображает цветную метку с текстом. Поддерживай варианты: success, warning, error, info и neutral.',
      requirements: [
        'Пропсы: variant ("success"|"warning"|"error"|"info"|"neutral"), children',
        'Каждый вариант имеет свой цвет фона и текста',
        'Опциональный пропс dot — показывает маленький кружок перед текстом',
        'Опциональный пропс size ("sm"|"md") — разный padding'
      ],
      hint: 'Создай объект с цветами для каждого варианта. Используй inline-стили или CSS Modules. dot — просто div с border-radius: 50% и width/height.',
      expectedOutput: 'Badge variant="success" -> зелёный бейдж\nBadge variant="warning" -> жёлтый бейдж\nBadge variant="danger" -> красный бейдж\nBadge size="sm" -> маленький размер\nРендерит <span> с нужными классами и текстом',
      solution: 'const variantStyles = {\n  success: { background: "#dcfce7", color: "#166534" },\n  warning: { background: "#fef9c3", color: "#854d0e" },\n  error: { background: "#fee2e2", color: "#991b1b" },\n  info: { background: "#dbeafe", color: "#1e40af" },\n  neutral: { background: "#f3f4f6", color: "#374151" },\n};\n\nconst sizeStyles = {\n  sm: { padding: "2px 6px", fontSize: "11px" },\n  md: { padding: "4px 10px", fontSize: "12px" },\n};\n\nfunction Badge({ variant = "neutral", size = "md", dot = false, children }) {\n  return (\n    <span style={{\n      ...variantStyles[variant],\n      ...sizeStyles[size],\n      borderRadius: "9999px",\n      fontWeight: 500,\n      display: "inline-flex",\n      alignItems: "center",\n      gap: "4px",\n    }}>\n      {dot && (\n        <span style={{\n          width: "6px", height: "6px",\n          borderRadius: "50%",\n          background: "currentColor",\n          display: "inline-block",\n        }} />\n      )}\n      {children}\n    </span>\n  );\n}\n\nfunction App() {\n  return (\n    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>\n      <Badge variant="success" dot>Активен</Badge>\n      <Badge variant="warning">Ожидание</Badge>\n      <Badge variant="error" size="sm">Ошибка</Badge>\n      <Badge variant="info">Новый</Badge>\n      <Badge>Нейтральный</Badge>\n    </div>\n  );\n}',
      explanation: 'Badge — классический пример простого переиспользуемого компонента с вариантами. Объект variantStyles делает код декларативным и легко расширяемым.'
    },
    {
      id: 2,
      title: 'Компонент Avatar: аватар пользователя',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создай компонент Avatar который показывает аватар из URL или инициалы если изображение недоступно. Поддерживай разные размеры и форму.',
      requirements: [
        'Пропсы: src (URL), alt, name (для инициалов), size ("sm"|"md"|"lg"|"xl"), shape ("circle"|"square")',
        'Если src задан — показывай картинку',
        'Если src не задан — показывай инициалы из name (первые буквы первых двух слов)',
        'При ошибке загрузки img — переключайся на инициалы (onError)',
        'Размеры: sm=24, md=40, lg=56, xl=80 пикселей'
      ],
      hint: 'Для инициалов: name.split(" ").slice(0,2).map(n => n[0]).join(""). Для onError используй useState: const [imgError, setImgError] = useState(false).',
      expectedOutput: 'Avatar с src -> показывает изображение\nAvatar без src -> показывает инициалы из name\nAvatar size="lg" -> большой размер 64px\nonError на img -> fallback к инициалам\nАвтоматический цвет фона по первой букве имени',
      solution: 'import { useState } from "react";\n\nconst sizes = { sm: 24, md: 40, lg: 56, xl: 80 };\nconst fontSizes = { sm: 10, md: 14, lg: 18, xl: 24 };\n\nfunction getInitials(name) {\n  if (!name) return "?";\n  return name.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase();\n}\n\nfunction getColor(name) {\n  const colors = ["#ef4444","#f97316","#eab308","#22c55e","#3b82f6","#8b5cf6","#ec4899"];\n  if (!name) return colors[0];\n  return colors[name.charCodeAt(0) % colors.length];\n}\n\nfunction Avatar({ src, alt, name, size = "md", shape = "circle" }) {\n  const [imgError, setImgError] = useState(false);\n  const px = sizes[size];\n  const fs = fontSizes[size];\n  const borderRadius = shape === "circle" ? "50%" : "6px";\n  const showImage = src && !imgError;\n\n  return (\n    <div style={{\n      width: px, height: px, borderRadius,\n      overflow: "hidden", display: "inline-flex",\n      alignItems: "center", justifyContent: "center",\n      background: showImage ? "transparent" : getColor(name),\n      color: "white", fontSize: fs, fontWeight: 600,\n      flexShrink: 0,\n    }}>\n      {showImage ? (\n        <img src={src} alt={alt || name} width={px} height={px}\n          style={{ objectFit: "cover", width: "100%", height: "100%" }}\n          onError={() => setImgError(true)} />\n      ) : (\n        getInitials(name)\n      )}\n    </div>\n  );\n}\n\nfunction App() {\n  return (\n    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>\n      <Avatar src="https://i.pravatar.cc/150" alt="Пользователь" size="xl" />\n      <Avatar name="Алия Джакупова" size="lg" />\n      <Avatar name="Нурлан" size="md" shape="square" />\n      <Avatar src="broken-url" name="Фарида Сейт" size="sm" />\n    </div>\n  );\n}',
      explanation: 'Avatar с fallback на инициалы — паттерн применяемый в Gmail, GitHub, Slack. onError обработчик переключает отображение если изображение недоступно.'
    },
    {
      id: 3,
      title: 'Компонент Accordion: раскрывающийся список',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай компонент Accordion с раскрывающимися пунктами. Поддерживай режимы: один открытый за раз (single) и несколько открытых (multiple).',
      requirements: [
        'Данные: массив объектов { id, title, content }',
        'Пропс allowMultiple: boolean — можно ли открывать несколько пунктов',
        'Анимация раскрытия через CSS transition',
        'Иконка "стрелка" поворачивается при открытии (transform: rotate)',
        'Доступность: кнопки с aria-expanded и aria-controls'
      ],
      hint: 'Для single режима: useState<string|null>(null). Для multiple: useState<string[]>([]). Стрелка: transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" + transition: "transform 0.2s".',
      expectedOutput: 'Клик на заголовок открывает/закрывает секцию\nРежим single: открытие одной секции закрывает другие\nРежим multi: несколько секций открыты одновременно\nАнимация плавного раскрытия\nАктивная секция подсвечена',
      solution: 'import { useState } from "react";\n\nfunction Accordion({ items, allowMultiple = false }) {\n  const [openIds, setOpenIds] = useState([]);\n\n  const toggle = (id) => {\n    if (allowMultiple) {\n      setOpenIds(prev =>\n        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]\n      );\n    } else {\n      setOpenIds(prev => prev.includes(id) ? [] : [id]);\n    }\n  };\n\n  return (\n    <div style={{ border: "1px solid #e5e7eb", borderRadius: "8px", overflow: "hidden" }}>\n      {items.map((item, index) => {\n        const isOpen = openIds.includes(item.id);\n        return (\n          <div key={item.id}>\n            {index > 0 && <div style={{ borderTop: "1px solid #e5e7eb" }} />}\n            <button\n              onClick={() => toggle(item.id)}\n              aria-expanded={isOpen}\n              aria-controls={"accordion-" + item.id}\n              style={{\n                width: "100%", padding: "14px 16px",\n                background: "none", border: "none", cursor: "pointer",\n                display: "flex", justifyContent: "space-between", alignItems: "center",\n                fontSize: "15px", fontWeight: 500, textAlign: "left",\n              }}\n            >\n              {item.title}\n              <span style={{ transition: "transform 0.2s", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", display: "inline-block" }}>▼</span>\n            </button>\n            <div\n              id={"accordion-" + item.id}\n              style={{\n                maxHeight: isOpen ? "500px" : "0",\n                overflow: "hidden",\n                transition: "max-height 0.3s ease",\n                padding: isOpen ? "0 16px 14px" : "0 16px",\n              }}\n            >\n              <p style={{ margin: 0, color: "#6b7280" }}>{item.content}</p>\n            </div>\n          </div>\n        );\n      })}\n    </div>\n  );\n}\n\nconst faqItems = [\n  { id: "1", title: "Что такое React?", content: "React — библиотека для создания интерфейсов." },\n  { id: "2", title: "Зачем нужны хуки?", content: "Хуки позволяют использовать состояние в функциональных компонентах." },\n  { id: "3", title: "Что такое JSX?", content: "JSX — синтаксис расширяющий JavaScript для описания UI." },\n];\n\nfunction App() {\n  return (\n    <div style={{ maxWidth: "600px", margin: "20px auto" }}>\n      <Accordion items={faqItems} />\n    </div>\n  );\n}',
      explanation: 'Accordion — паттерн раскрытие/скрытие контента. Ключевое: анимация через maxHeight (не display:none!) позволяет применить CSS transition. aria-expanded важен для доступности.'
    },
    {
      id: 4,
      title: 'Компонент Tabs: вкладки',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай компонент Tabs с переключаемыми вкладками. Контент каждой вкладки должен сохраняться при переключении (не размонтироваться).',
      requirements: [
        'Данные: массив { id, label, content }',
        'Активная вкладка подчёркивается/выделяется',
        'Сохранение контента: все вкладки рендерятся, неактивные скрыты через visibility:hidden/display:none',
        'Доступность: role="tablist", role="tab", role="tabpanel", aria-selected',
        'Поддержка навигации клавиатурой (стрелки влево/вправо)'
      ],
      hint: 'Для сохранения состояния вкладок скрывай через style={{ display: isActive ? "block" : "none" }}. Для навигации клавиатурой добавь onKeyDown на tablist.',
      expectedOutput: 'Клик на вкладку показывает её контент\nАктивная вкладка выделена стилем\nКонтент каждой вкладки сохраняется (не размонтируется)\nПоддержка клавиатурной навигации\nПередача children как конфигурация вкладок',
      solution: 'import { useState, useRef } from "react";\n\nfunction Tabs({ tabs, defaultTab }) {\n  const [activeId, setActiveId] = useState(defaultTab || tabs[0]?.id);\n  const tabsRef = useRef([]);\n\n  const handleKeyDown = (e, index) => {\n    if (e.key === "ArrowRight") {\n      const next = (index + 1) % tabs.length;\n      setActiveId(tabs[next].id);\n      tabsRef.current[next]?.focus();\n    } else if (e.key === "ArrowLeft") {\n      const prev = (index - 1 + tabs.length) % tabs.length;\n      setActiveId(tabs[prev].id);\n      tabsRef.current[prev]?.focus();\n    }\n  };\n\n  return (\n    <div>\n      <div role="tablist" style={{ display: "flex", borderBottom: "2px solid #e5e7eb" }}>\n        {tabs.map((tab, i) => {\n          const isActive = tab.id === activeId;\n          return (\n            <button\n              key={tab.id}\n              role="tab"\n              ref={el => tabsRef.current[i] = el}\n              aria-selected={isActive}\n              aria-controls={"panel-" + tab.id}\n              onClick={() => setActiveId(tab.id)}\n              onKeyDown={(e) => handleKeyDown(e, i)}\n              style={{\n                padding: "10px 16px", border: "none", background: "none",\n                cursor: "pointer", fontWeight: isActive ? 600 : 400,\n                color: isActive ? "#2563eb" : "#6b7280",\n                borderBottom: isActive ? "2px solid #2563eb" : "2px solid transparent",\n                marginBottom: "-2px",\n              }}\n            >\n              {tab.label}\n            </button>\n          );\n        })}\n      </div>\n      {tabs.map(tab => (\n        <div\n          key={tab.id}\n          id={"panel-" + tab.id}\n          role="tabpanel"\n          style={{ display: tab.id === activeId ? "block" : "none", padding: "16px 0" }}\n        >\n          {tab.content}\n        </div>\n      ))}\n    </div>\n  );\n}\n\nfunction App() {\n  const tabs = [\n    { id: "overview", label: "Обзор", content: <p>Общий обзор продукта</p> },\n    { id: "features", label: "Возможности", content: <p>Ключевые возможности</p> },\n    { id: "pricing", label: "Цены", content: <p>Тарифные планы</p> },\n  ];\n  return <Tabs tabs={tabs} />;\n}',
      explanation: 'Tabs с сохранением состояния: рендерим все панели, скрываем неактивные через display:none. Это сохраняет состояние форм/скролла внутри вкладок. Навигация стрелками — требование WAI-ARIA.'
    },
    {
      id: 5,
      title: 'Компонент Modal: диалоговое окно',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай компонент Modal с правильным поведением: Portal для рендеринга вне DOM-дерева, блокировка скролла, закрытие по клику на overlay и клавише Escape.',
      requirements: [
        'Использование ReactDOM.createPortal для рендеринга в document.body',
        'Пропсы: isOpen, onClose, title, children, size ("sm"|"md"|"lg")',
        'Закрытие по клику на overlay (но не на содержимое)',
        'Закрытие по нажатию Escape',
        'Блокировка скролла страницы когда Modal открыт (document.body.style.overflow)',
        'Фокус переходит в Modal при открытии'
      ],
      hint: 'Portal: ReactDOM.createPortal(<div>...</div>, document.body). Для Escape: useEffect с window.addEventListener("keydown", handler). Для блокировки скролла: document.body.style.overflow = "hidden" при isOpen.',
      expectedOutput: 'Modal рендерится через ReactDOM.createPortal в document.body\nESC закрывает модальное окно\nКлик по оверлею закрывает модальное окно\nПри открытии: scroll страницы заблокирован (overflow: hidden)\nПри закрытии: scroll восстановлен',
      solution: 'import { useEffect, useRef } from "react";\nimport ReactDOM from "react-dom";\n\nconst modalSizes = {\n  sm: "400px", md: "600px", lg: "800px",\n};\n\nfunction Modal({ isOpen, onClose, title, children, size = "md" }) {\n  const contentRef = useRef(null);\n\n  useEffect(() => {\n    if (!isOpen) return;\n\n    document.body.style.overflow = "hidden";\n    contentRef.current?.focus();\n\n    const handleKeyDown = (e) => {\n      if (e.key === "Escape") onClose();\n    };\n    window.addEventListener("keydown", handleKeyDown);\n\n    return () => {\n      document.body.style.overflow = "";\n      window.removeEventListener("keydown", handleKeyDown);\n    };\n  }, [isOpen, onClose]);\n\n  if (!isOpen) return null;\n\n  return ReactDOM.createPortal(\n    <div\n      role="dialog"\n      aria-modal="true"\n      aria-labelledby="modal-title"\n      onClick={onClose}\n      style={{\n        position: "fixed", inset: 0,\n        background: "rgba(0,0,0,0.5)",\n        display: "flex", alignItems: "center", justifyContent: "center",\n        zIndex: 1000,\n      }}\n    >\n      <div\n        ref={contentRef}\n        tabIndex={-1}\n        onClick={e => e.stopPropagation()}\n        style={{\n          background: "white", borderRadius: "12px",\n          width: "90%", maxWidth: modalSizes[size],\n          maxHeight: "80vh", overflow: "auto",\n          padding: "24px", outline: "none",\n        }}\n      >\n        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>\n          <h2 id="modal-title" style={{ margin: 0 }}>{title}</h2>\n          <button onClick={onClose} aria-label="Закрыть" style={{ border: "none", background: "none", cursor: "pointer", fontSize: "20px" }}>✕</button>\n        </div>\n        {children}\n      </div>\n    </div>,\n    document.body\n  );\n}\n\nfunction App() {\n  const [open, setOpen] = React.useState(false);\n  return (\n    <div>\n      <button onClick={() => setOpen(true)}>Открыть модал</button>\n      <Modal isOpen={open} onClose={() => setOpen(false)} title="Подтверждение">\n        <p>Вы уверены что хотите удалить запись?</p>\n        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>\n          <button onClick={() => setOpen(false)}>Отмена</button>\n          <button onClick={() => setOpen(false)} style={{ background: "#ef4444", color: "white" }}>Удалить</button>\n        </div>\n      </Modal>\n    </div>\n  );\n}',
      explanation: 'Portal рендерит Modal вне DOM-дерева, избегая проблем с overflow:hidden и z-index. Блокировка скролла, Escape и фокус — стандартные требования к доступным диалогам.'
    },
    {
      id: 6,
      title: 'Компонент DataTable: таблица с сортировкой',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай компонент DataTable с сортировкой по столбцам. Клик на заголовок столбца — переключение asc/desc. Поддержи пагинацию.',
      requirements: [
        'Пропсы: columns (массив { key, label, sortable? }), data (массив объектов)',
        'Клик на sortable заголовок: сортировка по этому полю',
        'Повторный клик: переключение asc <-> desc',
        'Иконки ↑ ↓ показывают направление сортировки',
        'Пагинация: пропс pageSize (по умолчанию 5), кнопки Пред/След',
        'Показ текущего диапазона: "Показаны 1-5 из 20"'
      ],
      hint: 'Состояние: { field: null, direction: "asc" }. Сортировка: [...data].sort((a,b) => direction === "asc" ? a[field] > b[field] ? 1 : -1 : a[field] < b[field] ? 1 : -1). Пагинация: sortedData.slice(page*pageSize, (page+1)*pageSize).',
      expectedOutput: 'Клик на заголовок столбца -> сортировка asc\nПовторный клик -> сортировка desc\nТретий клик -> сброс сортировки\nСтрелочка указывает текущее направление\nСортировка работает для строк и чисел',
      solution: 'import { useState, useMemo } from "react";\n\nfunction DataTable({ columns, data, pageSize = 5 }) {\n  const [sort, setSort] = useState({ field: null, dir: "asc" });\n  const [page, setPage] = useState(0);\n\n  const handleSort = (key) => {\n    setSort(prev => ({\n      field: key,\n      dir: prev.field === key && prev.dir === "asc" ? "desc" : "asc",\n    }));\n    setPage(0);\n  };\n\n  const sorted = useMemo(() => {\n    if (!sort.field) return data;\n    return [...data].sort((a, b) => {\n      const av = a[sort.field], bv = b[sort.field];\n      const cmp = av > bv ? 1 : av < bv ? -1 : 0;\n      return sort.dir === "asc" ? cmp : -cmp;\n    });\n  }, [data, sort]);\n\n  const totalPages = Math.ceil(sorted.length / pageSize);\n  const paginated = sorted.slice(page * pageSize, (page + 1) * pageSize);\n  const start = page * pageSize + 1;\n  const end = Math.min((page + 1) * pageSize, sorted.length);\n\n  return (\n    <div>\n      <table style={{ width: "100%", borderCollapse: "collapse" }}>\n        <thead>\n          <tr>\n            {columns.map(col => (\n              <th key={col.key}\n                onClick={col.sortable ? () => handleSort(col.key) : undefined}\n                style={{ padding: "10px", borderBottom: "2px solid #e5e7eb", textAlign: "left", cursor: col.sortable ? "pointer" : "default", userSelect: "none" }}>\n                {col.label}\n                {col.sortable && sort.field === col.key && (sort.dir === "asc" ? " ↑" : " ↓")}\n              </th>\n            ))}\n          </tr>\n        </thead>\n        <tbody>\n          {paginated.map((row, i) => (\n            <tr key={i} style={{ background: i % 2 === 0 ? "white" : "#f9fafb" }}>\n              {columns.map(col => (\n                <td key={col.key} style={{ padding: "10px", borderBottom: "1px solid #e5e7eb" }}>{row[col.key]}</td>\n              ))}\n            </tr>\n          ))}\n        </tbody>\n      </table>\n      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>\n        <span style={{ color: "#6b7280", fontSize: "14px" }}>Показаны {start}-{end} из {sorted.length}</span>\n        <div style={{ display: "flex", gap: "8px" }}>\n          <button onClick={() => setPage(p => p - 1)} disabled={page === 0}>Пред</button>\n          <span>Страница {page + 1} из {totalPages}</span>\n          <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1}>След</button>\n        </div>\n      </div>\n    </div>\n  );\n}',
      explanation: 'DataTable — один из самых востребованных компонентов. useMemo для сортировки предотвращает лишние вычисления. Пагинация реализуется через slice по отсортированному массиву.'
    },
    {
      id: 7,
      title: 'Компонент Toast: уведомления',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай систему Toast уведомлений. ToastProvider хранит список уведомлений, useToast хук добавляет/удаляет их. Автоматическое исчезновение через 3 секунды.',
      requirements: [
        'ToastProvider и useToast через Context API',
        'useToast возвращает: toast(message, type), success, error, warning, info',
        'Уведомления показываются в правом нижнем углу (Portal)',
        'Каждое уведомление: иконка по типу, текст, кнопка закрытия X',
        'Автоматическое удаление через 3 секунды',
        'Анимация появления/исчезновения через CSS'
      ],
      hint: 'Храни массив toasts: [{id, message, type}]. addToast создаёт новый toast с уникальным id (Date.now()). setTimeout в addToast вызывает removeToast(id) через 3000мс.',
      expectedOutput: 'toast.success("Сохранено") -> зелёное уведомление\ntoast.error("Ошибка") -> красное уведомление\nАвтоматически исчезает через 3 секунды\nМожно закрыть кнопкой ×\nНесколько уведомлений отображаются стеком',
      solution: 'import { createContext, useContext, useState, useCallback } from "react";\nimport ReactDOM from "react-dom";\n\nconst ToastContext = createContext(null);\nconst icons = { success: "✓", error: "✕", warning: "⚠", info: "ℹ" };\nconst colors = { success: "#16a34a", error: "#dc2626", warning: "#d97706", info: "#2563eb" };\n\nexport function ToastProvider({ children }) {\n  const [toasts, setToasts] = useState([]);\n\n  const removeToast = useCallback((id) => {\n    setToasts(prev => prev.filter(t => t.id !== id));\n  }, []);\n\n  const addToast = useCallback((message, type = "info") => {\n    const id = Date.now();\n    setToasts(prev => [...prev, { id, message, type }]);\n    setTimeout(() => removeToast(id), 3000);\n  }, [removeToast]);\n\n  const toast = { addToast, success: (m) => addToast(m, "success"), error: (m) => addToast(m, "error"), warning: (m) => addToast(m, "warning"), info: (m) => addToast(m, "info") };\n\n  return (\n    <ToastContext.Provider value={toast}>\n      {children}\n      {ReactDOM.createPortal(\n        <div style={{ position: "fixed", bottom: "20px", right: "20px", display: "flex", flexDirection: "column", gap: "8px", zIndex: 9999 }}>\n          {toasts.map(t => (\n            <div key={t.id} style={{ background: "white", borderLeft: "4px solid " + colors[t.type], borderRadius: "6px", padding: "12px 16px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", minWidth: "280px", display: "flex", alignItems: "center", gap: "10px", animation: "slideIn 0.3s ease" }}>\n              <span style={{ color: colors[t.type], fontSize: "18px" }}>{icons[t.type]}</span>\n              <span style={{ flex: 1 }}>{t.message}</span>\n              <button onClick={() => removeToast(t.id)} style={{ border: "none", background: "none", cursor: "pointer", color: "#9ca3af", fontSize: "16px" }}>✕</button>\n            </div>\n          ))}\n        </div>,\n        document.body\n      )}\n    </ToastContext.Provider>\n  );\n}\n\nexport function useToast() {\n  const ctx = useContext(ToastContext);\n  if (!ctx) throw new Error("useToast должен быть внутри ToastProvider");\n  return ctx;\n}\n\nfunction App() {\n  return (\n    <ToastProvider>\n      <Demo />\n    </ToastProvider>\n  );\n}\n\nfunction Demo() {\n  const { success, error, warning, info } = useToast();\n  return (\n    <div style={{ display: "flex", gap: "8px" }}>\n      <button onClick={() => success("Данные сохранены!")}>Success</button>\n      <button onClick={() => error("Ошибка подключения")}>Error</button>\n      <button onClick={() => warning("Сессия истекает")}>Warning</button>\n      <button onClick={() => info("Новая версия доступна")}>Info</button>\n    </div>\n  );\n}',
      explanation: 'Toast система — отличный пример Context + Portal. Context позволяет вызывать toast из любого компонента. Portal обеспечивает правильное позиционирование поверх всего контента.'
    },
    {
      id: 8,
      title: 'Компонент Pagination: постраничная навигация',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай компонент Pagination с умным отображением страниц: показывает первую, последнюю и диапазон вокруг текущей страницы со многоточием.',
      requirements: [
        'Пропсы: currentPage, totalPages, onPageChange',
        'Кнопки: < Пред и > След (disabled на первой/последней)',
        'Всегда показываем: первую страницу, последнюю, currentPage и ±1 от текущей',
        'Между группами страниц показываем "..." (ellipsis)',
        'Текущая страница выделена цветом'
      ],
      hint: 'Алгоритм: создай Set { 1, lastPage, currentPage-1, currentPage, currentPage+1 }, отфильтруй валидные, отсортируй. Потом добавь "..." между числами с разрывом > 1.',
      expectedOutput: 'Текущая страница выделена\nКнопки "Предыдущая" / "Следующая"\nПри 100 страницах показывает: 1 ... 4 5 6 ... 100\nonPageChange вызывается при смене страницы\nПервая и последняя кнопки заблокированы на краях',
      solution: 'function Pagination({ currentPage, totalPages, onPageChange }) {\n  const getPages = () => {\n    const pages = new Set([1, totalPages, currentPage, currentPage - 1, currentPage + 1]);\n    const valid = [...pages].filter(p => p >= 1 && p <= totalPages).sort((a, b) => a - b);\n\n    const result = [];\n    for (let i = 0; i < valid.length; i++) {\n      if (i > 0 && valid[i] - valid[i - 1] > 1) {\n        result.push("...");\n      }\n      result.push(valid[i]);\n    }\n    return result;\n  };\n\n  const btnStyle = (isActive, isDisabled) => ({\n    padding: "6px 12px", border: "1px solid #e5e7eb",\n    borderRadius: "6px", background: isActive ? "#2563eb" : "white",\n    color: isActive ? "white" : isDisabled ? "#d1d5db" : "#374151",\n    cursor: isDisabled ? "not-allowed" : "pointer",\n    fontWeight: isActive ? 600 : 400,\n  });\n\n  return (\n    <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>\n      <button\n        onClick={() => onPageChange(currentPage - 1)}\n        disabled={currentPage === 1}\n        style={btnStyle(false, currentPage === 1)}>\n        Пред\n      </button>\n      {getPages().map((page, i) =>\n        page === "..." ? (\n          <span key={"e" + i} style={{ padding: "6px" }}>...</span>\n        ) : (\n          <button key={page}\n            onClick={() => onPageChange(page)}\n            style={btnStyle(page === currentPage, false)}>\n            {page}\n          </button>\n        )\n      )}\n      <button\n        onClick={() => onPageChange(currentPage + 1)}\n        disabled={currentPage === totalPages}\n        style={btnStyle(false, currentPage === totalPages)}>\n        След\n      </button>\n    </div>\n  );\n}\n\nfunction App() {\n  const [page, setPage] = React.useState(1);\n  return (\n    <div style={{ padding: "20px" }}>\n      <p>Страница {page} из 25</p>\n      <Pagination currentPage={page} totalPages={25} onPageChange={setPage} />\n    </div>\n  );\n}',
      explanation: 'Умный алгоритм пагинации с ellipsis: Set гарантирует уникальность страниц, фильтрация убирает невалидные, сортировка даёт правильный порядок, затем вставляем "..." в разрывы.'
    },
    {
      id: 9,
      title: 'Компонент SearchableSelect: поиск с выпадающим списком',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай компонент типа autocomplete: input для поиска, выпадающий список с подходящими опциями, выбор мышкой или клавиатурой.',
      requirements: [
        'Пропсы: options (массив { value, label }), value, onChange, placeholder',
        'При вводе в input — фильтрация опций (case-insensitive)',
        'Выпадающий список показывается при фокусе на input',
        'Клавиатурная навигация: ArrowUp/Down для навигации, Enter для выбора, Escape для закрытия',
        'Клик вне компонента — закрытие списка',
        'Показ выбранного значения в input'
      ],
      hint: 'Используй useRef для контейнера и clickOutside через useEffect: document.addEventListener("mousedown", handler). highlightedIndex управляет клавиатурной навигацией.',
      expectedOutput: 'Ввод текста фильтрует список опций\nВыбор опции обновляет значение и закрывает список\nEsc закрывает выпадающий список\nКлик вне компонента закрывает список\nonChange вызывается с выбранным значением',
      solution: 'import { useState, useRef, useEffect } from "react";\n\nfunction SearchableSelect({ options, value, onChange, placeholder = "Выберите..." }) {\n  const [query, setQuery] = useState("");\n  const [isOpen, setIsOpen] = useState(false);\n  const [highlightedIdx, setHighlightedIdx] = useState(-1);\n  const containerRef = useRef(null);\n\n  const filtered = options.filter(o => o.label.toLowerCase().includes(query.toLowerCase()));\n  const selectedOption = options.find(o => o.value === value);\n\n  useEffect(() => {\n    const handler = (e) => {\n      if (!containerRef.current?.contains(e.target)) setIsOpen(false);\n    };\n    document.addEventListener("mousedown", handler);\n    return () => document.removeEventListener("mousedown", handler);\n  }, []);\n\n  const handleKeyDown = (e) => {\n    if (!isOpen) { if (e.key === "ArrowDown") setIsOpen(true); return; }\n    if (e.key === "ArrowDown") setHighlightedIdx(i => Math.min(i + 1, filtered.length - 1));\n    else if (e.key === "ArrowUp") setHighlightedIdx(i => Math.max(i - 1, 0));\n    else if (e.key === "Enter" && highlightedIdx >= 0) { onChange(filtered[highlightedIdx].value); setIsOpen(false); setQuery(""); }\n    else if (e.key === "Escape") setIsOpen(false);\n  };\n\n  const handleSelect = (option) => { onChange(option.value); setQuery(""); setIsOpen(false); };\n\n  return (\n    <div ref={containerRef} style={{ position: "relative", width: "300px" }}>\n      <input\n        value={isOpen ? query : (selectedOption?.label || "")}\n        onChange={e => { setQuery(e.target.value); setIsOpen(true); setHighlightedIdx(-1); }}\n        onFocus={() => setIsOpen(true)}\n        onKeyDown={handleKeyDown}\n        placeholder={placeholder}\n        style={{ width: "100%", padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px", boxSizing: "border-box" }}\n      />\n      {isOpen && filtered.length > 0 && (\n        <ul style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "white", border: "1px solid #d1d5db", borderRadius: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", maxHeight: "200px", overflowY: "auto", padding: 0, margin: "4px 0", listStyle: "none", zIndex: 100 }}>\n          {filtered.map((option, i) => (\n            <li key={option.value}\n              onClick={() => handleSelect(option)}\n              style={{ padding: "8px 12px", cursor: "pointer", background: i === highlightedIdx ? "#eff6ff" : option.value === value ? "#f0f9ff" : "white", fontWeight: option.value === value ? 600 : 400 }}>\n              {option.label}\n            </li>\n          ))}\n        </ul>\n      )}\n    </div>\n  );\n}',
      explanation: 'SearchableSelect (autocomplete) — сложный UI компонент. Ключевые части: clickOutside через document listener, клавиатурная навигация через highlightedIdx, правильное управление query/value.'
    },
    {
      id: 10,
      title: 'Компонент FileUpload: загрузка файлов',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай компонент загрузки файлов с drag-and-drop, предпросмотром изображений и валидацией типа/размера.',
      requirements: [
        'Drag-and-drop зона: onDragOver, onDrop события',
        'Клик на зону — открывает стандартный диалог выбора файлов',
        'Пропсы: accept (типы файлов), maxSize (байты), multiple, onFilesChange',
        'Предпросмотр изображений через URL.createObjectURL',
        'Валидация: проверка типа и размера, показ ошибки',
        'Список выбранных файлов с именем, размером и кнопкой удаления',
        'Cleanup: URL.revokeObjectURL при удалении файла'
      ],
      hint: 'drag state через useState. onDrop: e.preventDefault(), файлы в e.dataTransfer.files. Для input type="file": useRef(null) и ref.current.click(). URL.createObjectURL(file) для превью.',
      expectedOutput: 'Drag & drop файлов в зону загрузки\nПредпросмотр изображений после выбора\nВалидация: только image/*, максимум 5MB\nОшибка валидации показывается под компонентом\nonFilesSelected вызывается с массивом File объектов',
      solution: 'import { useState, useRef, useCallback } from "react";\n\nfunction FileUpload({ accept = "*", maxSize = 5 * 1024 * 1024, multiple = false, onFilesChange }) {\n  const [files, setFiles] = useState([]);\n  const [dragging, setDragging] = useState(false);\n  const [errors, setErrors] = useState([]);\n  const inputRef = useRef(null);\n\n  const validate = (file) => {\n    const errs = [];\n    if (file.size > maxSize) errs.push(file.name + ": превышает " + (maxSize / 1024 / 1024).toFixed(1) + " МБ");\n    if (accept !== "*" && !accept.split(",").some(t => file.type.match(t.trim()))) errs.push(file.name + ": неверный тип файла");\n    return errs;\n  };\n\n  const addFiles = useCallback((newFiles) => {\n    const allErrors = [];\n    const valid = [];\n    Array.from(newFiles).forEach(f => {\n      const errs = validate(f);\n      if (errs.length) { allErrors.push(...errs); }\n      else { valid.push({ file: f, url: f.type.startsWith("image/") ? URL.createObjectURL(f) : null, id: Date.now() + Math.random() }); }\n    });\n    setErrors(allErrors);\n    const updated = multiple ? [...files, ...valid] : valid;\n    setFiles(updated);\n    onFilesChange?.(updated.map(f => f.file));\n  }, [files, multiple, onFilesChange]);\n\n  const removeFile = (id) => {\n    setFiles(prev => {\n      const removed = prev.find(f => f.id === id);\n      if (removed?.url) URL.revokeObjectURL(removed.url);\n      const updated = prev.filter(f => f.id !== id);\n      onFilesChange?.(updated.map(f => f.file));\n      return updated;\n    });\n  };\n\n  return (\n    <div>\n      <div\n        onClick={() => inputRef.current.click()}\n        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}\n        onDragLeave={() => setDragging(false)}\n        onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}\n        style={{ border: "2px dashed " + (dragging ? "#2563eb" : "#d1d5db"), borderRadius: "8px", padding: "32px", textAlign: "center", cursor: "pointer", background: dragging ? "#eff6ff" : "#fafafa", transition: "all 0.2s" }}\n      >\n        <p style={{ margin: 0, color: "#6b7280" }}>Перетащите файлы или <span style={{ color: "#2563eb" }}>выберите</span></p>\n        <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#9ca3af" }}>Макс. {(maxSize / 1024 / 1024).toFixed(0)} МБ</p>\n      </div>\n      <input ref={inputRef} type="file" accept={accept} multiple={multiple} style={{ display: "none" }} onChange={e => addFiles(e.target.files)} />\n      {errors.map((e, i) => <p key={i} style={{ color: "#dc2626", fontSize: "13px", margin: "4px 0" }}>{e}</p>)}\n      {files.length > 0 && (\n        <div style={{ marginTop: "12px", display: "flex", flexWrap: "wrap", gap: "8px" }}>\n          {files.map(f => (\n            <div key={f.id} style={{ border: "1px solid #e5e7eb", borderRadius: "6px", padding: "8px", display: "flex", alignItems: "center", gap: "8px" }}>\n              {f.url && <img src={f.url} alt="" style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px" }} />}\n              <div>\n                <p style={{ margin: 0, fontSize: "13px", fontWeight: 500 }}>{f.file.name}</p>\n                <p style={{ margin: 0, fontSize: "11px", color: "#9ca3af" }}>{(f.file.size / 1024).toFixed(1)} КБ</p>\n              </div>\n              <button onClick={() => removeFile(f.id)} style={{ border: "none", background: "none", cursor: "pointer", color: "#9ca3af" }}>✕</button>\n            </div>\n          ))}\n        </div>\n      )}\n    </div>\n  );\n}',
      explanation: 'FileUpload с drag-and-drop: три ключевых события (dragOver, dragLeave, drop). URL.createObjectURL создаёт временный URL для предпросмотра — важно вызвать revokeObjectURL при удалении чтобы освободить память.'
    }
  ]
}
