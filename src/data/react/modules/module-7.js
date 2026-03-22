export default {
  id: 7,
  title: 'Обработка событий',
  description: 'Синтетические события React, onClick, onChange, onSubmit, preventDefault, делегирование и паттерны обработчиков',
  lessons: [
    {
      id: 1,
      title: 'Синтетические события React',
      type: 'theory',
      content: [
        { type: 'text', value: 'React оборачивает нативные DOM события в SyntheticEvent — кросс-браузерную обёртку с единым API. Интерфейс такой же как у нативных событий, но работает одинаково во всех браузерах.' },
        { type: 'heading', value: 'Синтаксис обработчиков' },
        { type: 'code', language: 'jsx', value: '// HTML: строка\n// <button onclick="handleClick()">Click</button>\n\n// React: функция, не строка!\nfunction Button() {\n  // Обработчик внутри компонента\n  const handleClick = (e) => {\n    console.log("Клик!", e.target); // e — SyntheticEvent\n    e.preventDefault(); // Доступны все нативные методы\n    e.stopPropagation();\n  };\n\n  return (\n    <button onClick={handleClick}>       {/* Функция, не вызов! */}\n      Click\n    </button>\n  );\n}\n\n// НЕ ПИШИТЕ onClick={handleClick()}\n// Это вызовет функцию при рендере, а не при клике!' },
        { type: 'tip', value: 'onClick={handleClick} — передаём ссылку на функцию. onClick={handleClick()} — вызываем функцию при рендере (почти всегда ошибка). onClick={() => handleClick()} — создаём новую функцию при каждом рендере (приемлемо).' }
      ]
    },
    {
      id: 2,
      title: 'onClick и клики',
      type: 'theory',
      content: [
        { type: 'text', value: 'onClick — самое частое событие. Срабатывает на любом элементе. Полезен e.target для определения источника клика при делегировании.' },
        { type: 'heading', value: 'Варианты onClick' },
        { type: 'code', language: 'jsx', value: 'function ClickExamples() {\n  const [log, setLog] = useState([]);\n  const addLog = (msg) => setLog(prev => [...prev, msg]);\n\n  return (\n    <div>\n      {/* Простой клик */}\n      <button onClick={() => addLog("простой клик")}>Клик</button>\n\n      {/* Передача аргументов */}\n      <button onClick={() => addLog("клик с ID: 42")}>С аргументом</button>\n\n      {/* Использование e */}\n      <button onClick={(e) => addLog(`X:${e.clientX} Y:${e.clientY}`)}>С координатами</button>\n\n      {/* Двойной клик */}\n      <div onDoubleClick={() => addLog("двойной клик")}>Дважды кликни</div>\n\n      {/* Правая кнопка */}\n      <div onContextMenu={(e) => { e.preventDefault(); addLog("правый клик"); }}>\n        Правый клик\n      </div>\n\n      {/* Делегирование событий */}\n      <ul onClick={(e) => {\n        const li = e.target.closest("li");\n        if (li) addLog(`Клик по: ${li.dataset.id}`);\n      }}>\n        <li data-id="1">Пункт 1</li>\n        <li data-id="2">Пункт 2</li>\n      </ul>\n\n      <div>{log.map((l, i) => <p key={i}>{l}</p>)}</div>\n    </div>\n  );\n}' }
      ]
    },
    {
      id: 3,
      title: 'onChange — работа с полями ввода',
      type: 'theory',
      content: [
        { type: 'text', value: 'onChange в React срабатывает при каждом изменении input — в отличие от HTML где это срабатывает при потере фокуса. e.target.value содержит текущее значение.' },
        { type: 'heading', value: 'Controlled и Uncontrolled inputs' },
        { type: 'code', language: 'jsx', value: 'import { useState } from "react";\n\n// Controlled input — React контролирует значение\nfunction ControlledForm() {\n  const [name, setName] = useState("");\n  const [email, setEmail] = useState("");\n  const [role, setRole] = useState("user");\n  const [agree, setAgree] = useState(false);\n\n  return (\n    <form>\n      {/* text input */}\n      <input\n        type="text"\n        value={name}  // React контролирует\n        onChange={(e) => setName(e.target.value)}\n        placeholder="Имя"\n      />\n\n      {/* email input */}\n      <input\n        type="email"\n        value={email}\n        onChange={(e) => setEmail(e.target.value)}\n      />\n\n      {/* select */}\n      <select value={role} onChange={(e) => setRole(e.target.value)}>\n        <option value="user">Пользователь</option>\n        <option value="admin">Администратор</option>\n      </select>\n\n      {/* checkbox */}\n      <input\n        type="checkbox"\n        checked={agree}  // checked, не value!\n        onChange={(e) => setAgree(e.target.checked)} // .checked!\n      />\n\n      <p>Имя: {name}, Роль: {role}, Согласие: {agree ? "да" : "нет"}</p>\n    </form>\n  );\n}' },
        { type: 'note', value: 'Uncontrolled inputs (без value и onChange) используют ref для чтения значения. В большинстве случаев предпочтительны controlled inputs — React знает актуальное значение в любой момент.' }
      ]
    },
    {
      id: 4,
      title: 'onSubmit — отправка форм',
      type: 'theory',
      content: [
        { type: 'text', value: 'onSubmit на форме срабатывает при отправке. Всегда вызывайте e.preventDefault() чтобы предотвратить перезагрузку страницы. Submit можно вызвать кнопкой или Enter в поле.' },
        { type: 'heading', value: 'Обработка отправки формы' },
        { type: 'code', language: 'jsx', value: 'import { useState } from "react";\n\nfunction LoginForm() {\n  const [form, setForm] = useState({ email: "", password: "" });\n  const [loading, setLoading] = useState(false);\n  const [error, setError] = useState("");\n\n  const handleChange = (e) => {\n    const { name, value } = e.target; // name из атрибута input\n    setForm(prev => ({ ...prev, [name]: value }));\n  };\n\n  const handleSubmit = async (e) => {\n    e.preventDefault(); // ОБЯЗАТЕЛЬНО! Предотвращаем перезагрузку\n    setLoading(true);\n    setError("");\n    try {\n      // Имитация API запроса\n      await new Promise(resolve => setTimeout(resolve, 1000));\n      if (form.email !== "test@test.com") {\n        throw new Error("Неверные данные");\n      }\n      alert("Вход выполнен!");\n    } catch (err) {\n      setError(err.message);\n    } finally {\n      setLoading(false);\n    }\n  };\n\n  return (\n    <form onSubmit={handleSubmit}>\n      <input name="email"    type="email"    value={form.email}    onChange={handleChange} required />\n      <input name="password" type="password" value={form.password} onChange={handleChange} required />\n      {error && <p style={{ color: "red" }}>{error}</p>}\n      <button type="submit" disabled={loading}>\n        {loading ? "Входим..." : "Войти"}\n      </button>\n    </form>\n  );\n}' }
      ]
    },
    {
      id: 5,
      title: 'Клавиатурные события',
      type: 'theory',
      content: [
        { type: 'text', value: 'onKeyDown, onKeyUp, onKeyPress (устаревший) — события клавиатуры. Используйте e.key для определения нажатой клавиши. Поддерживаются комбинации: e.ctrlKey, e.shiftKey, e.altKey.' },
        { type: 'heading', value: 'Обработка клавиш' },
        { type: 'code', language: 'jsx', value: 'function SearchInput() {\n  const [query, setQuery] = useState("");\n  const [tags, setTags] = useState([]);\n\n  const handleKeyDown = (e) => {\n    // Enter — поиск\n    if (e.key === "Enter") {\n      console.log("Поиск:", query);\n    }\n\n    // Escape — очистить\n    if (e.key === "Escape") {\n      setQuery("");\n    }\n\n    // Ctrl+Enter — добавить тег\n    if (e.key === "Enter" && e.ctrlKey) {\n      e.preventDefault();\n      if (query.trim()) {\n        setTags(prev => [...prev, query.trim()]);\n        setQuery("");\n      }\n    }\n\n    // Backspace на пустом поле — удалить последний тег\n    if (e.key === "Backspace" && query === "" && tags.length > 0) {\n      setTags(prev => prev.slice(0, -1));\n    }\n  };\n\n  return (\n    <div>\n      <div>{tags.map((t, i) => <span key={i}>[{t}] </span>)}</div>\n      <input\n        value={query}\n        onChange={e => setQuery(e.target.value)}\n        onKeyDown={handleKeyDown}\n        placeholder="Введите тег, Ctrl+Enter для добавления"\n      />\n    </div>\n  );\n}' }
      ]
    },
    {
      id: 6,
      title: 'Всплытие событий и stopPropagation',
      type: 'theory',
      content: [
        { type: 'text', value: 'События в React всплывают (bubble) от дочернего элемента к родительскому. stopPropagation останавливает всплытие. Это важно при вложенных кликабельных элементах.' },
        { type: 'heading', value: 'Управление всплытием' },
        { type: 'code', language: 'jsx', value: 'function ProductCard({ product, onCardClick, onDeleteClick }) {\n  return (\n    <div\n      onClick={() => onCardClick(product.id)}\n      style={{ border: "1px solid #ddd", padding: "1rem", cursor: "pointer" }}\n    >\n      <h3>{product.name}</h3>\n      <button\n        onClick={(e) => {\n          e.stopPropagation(); // Останавливаем всплытие к div!\n          onDeleteClick(product.id);\n        }}\n        style={{ color: "red" }}\n      >\n        Удалить\n      </button>\n    </div>\n  );\n  // Без stopPropagation: клик по кнопке вызвал бы onCardClick тоже!\n}\n\n// Modal backdrop click:\nfunction Modal({ onClose, children }) {\n  return (\n    <div\n      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)" }}\n      onClick={onClose}  // Клик по фону — закрыть\n    >\n      <div\n        style={{ background: "white", padding: "2rem" }}\n        onClick={(e) => e.stopPropagation()} // Клик по содержимому — НЕ закрывать\n      >\n        {children}\n      </div>\n    </div>\n  );\n}' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Интерактивная форма',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте форму регистрации с валидацией в реальном времени, управляемыми полями и обработкой всех событий.',
      requirements: [
        'Поля: name (min 2), email (валидный), password (min 6), confirmPassword',
        'Валидация при onChange — ошибки показываются под полем',
        'Кнопка Submit неактивна если есть ошибки',
        'Enter в поле переходит к следующему (onKeyDown)',
        'Показывать/скрывать пароль по клику на иконку',
        'При успешной отправке — показать успех'
      ],
      hint: 'validate(form) возвращает объект ошибок. Используйте refs для перехода между полями. showPassword state переключает type="password" / type="text".',
      expectedOutput: 'Форма с полями: имя, email, пароль, подтверждение пароля\nВалидация в реальном времени при вводе\nEmail: проверка формата\nПароль: минимум 8 символов\nОшибки показываются под полями\nПри успешной отправке: "Регистрация прошла успешно"',
      solution: 'import { useState, useRef } from "react";\n\nfunction RegistrationForm() {\n  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });\n  const [errors, setErrors] = useState({});\n  const [showPassword, setShowPassword] = useState(false);\n  const [submitted, setSubmitted] = useState(false);\n\n  const emailRef  = useRef(null);\n  const passRef   = useRef(null);\n  const confirmRef = useRef(null);\n\n  const validate = (data) => {\n    const errs = {};\n    if (data.name.length < 2) errs.name = "Минимум 2 символа";\n    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(data.email)) errs.email = "Некорректный email";\n    if (data.password.length < 6) errs.password = "Минимум 6 символов";\n    if (data.password !== data.confirmPassword) errs.confirmPassword = "Пароли не совпадают";\n    return errs;\n  };\n\n  const handleChange = (e) => {\n    const { name, value } = e.target;\n    const newForm = { ...form, [name]: value };\n    setForm(newForm);\n    setErrors(validate(newForm));\n  };\n\n  const handleKeyDown = (e, nextRef) => {\n    if (e.key === "Enter" && nextRef?.current) {\n      e.preventDefault();\n      nextRef.current.focus();\n    }\n  };\n\n  const handleSubmit = (e) => {\n    e.preventDefault();\n    const errs = validate(form);\n    if (Object.keys(errs).length > 0) { setErrors(errs); return; }\n    setSubmitted(true);\n  };\n\n  const isValid = Object.keys(validate(form)).length === 0;\n  const inputStyle = { display: "block", width: "100%", padding: "8px", marginBottom: "4px", border: "1px solid #ddd", borderRadius: "6px" };\n  const errStyle   = { color: "#ef4444", fontSize: "12px", marginBottom: "8px" };\n\n  if (submitted) return <div style={{ color: "#16a34a", padding: "2rem" }}>Регистрация успешна! Добро пожаловать, {form.name}!</div>;\n\n  return (\n    <form onSubmit={handleSubmit} style={{ maxWidth: "400px", padding: "2rem" }}>\n      <h2>Регистрация</h2>\n      <input style={inputStyle} name="name" placeholder="Имя" value={form.name} onChange={handleChange} onKeyDown={(e) => handleKeyDown(e, emailRef)} />\n      {errors.name && <p style={errStyle}>{errors.name}</p>}\n      <input style={inputStyle} ref={emailRef} name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} onKeyDown={(e) => handleKeyDown(e, passRef)} />\n      {errors.email && <p style={errStyle}>{errors.email}</p>}\n      <div style={{ position: "relative" }}>\n        <input style={inputStyle} ref={passRef} name="password" type={showPassword ? "text" : "password"} placeholder="Пароль" value={form.password} onChange={handleChange} onKeyDown={(e) => handleKeyDown(e, confirmRef)} />\n        <button type="button" onClick={() => setShowPassword(p => !p)} style={{ position: "absolute", right: "8px", top: "8px", background: "none", border: "none", cursor: "pointer" }}>\n          {showPassword ? "🙈" : "👁"}\n        </button>\n      </div>\n      {errors.password && <p style={errStyle}>{errors.password}</p>}\n      <input style={inputStyle} ref={confirmRef} name="confirmPassword" type="password" placeholder="Повторите пароль" value={form.confirmPassword} onChange={handleChange} />\n      {errors.confirmPassword && <p style={errStyle}>{errors.confirmPassword}</p>}\n      <button type="submit" disabled={!isValid || form.name === ""} style={{ width: "100%", padding: "10px", background: isValid ? "#3b82f6" : "#9ca3af", color: "white", border: "none", borderRadius: "6px", cursor: isValid ? "pointer" : "not-allowed" }}>\n        Зарегистрироваться\n      </button>\n    </form>\n  );\n}\nexport default RegistrationForm;',
      explanation: 'validate возвращает объект ошибок — чистая функция. isValid = 0 ошибок. handleChange вычисляет новую форму и сразу валидирует. useRef для навигации между полями через Enter. showPassword меняет type атрибут. Button disabled через !isValid — UX паттерн.'
    }
  ]
}
