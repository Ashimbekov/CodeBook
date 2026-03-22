export default {
  id: 4,
  title: 'Компоненты',
  description: 'Функциональные компоненты, именование, экспорт, children, композиция и паттерны построения компонентов',
  lessons: [
    {
      id: 1,
      title: 'Функциональные компоненты',
      type: 'theory',
      content: [
        { type: 'text', value: 'Функциональный компонент — это обычная JavaScript функция, которая принимает props и возвращает JSX. Это современный стандарт React начиная с версии 16.8 (хуки).' },
        { type: 'heading', value: 'Правила компонентов' },
        { type: 'code', language: 'jsx', value: '// 1. Имя начинается с ЗАГЛАВНОЙ буквы (обязательно!)\nfunction MyComponent() { return <div />; }\n\n// 2. Может принимать props (объект)\nfunction Greeting({ name, age }) {\n  return <p>Привет, {name}! Тебе {age} лет.</p>;\n}\n\n// 3. Должен вернуть JSX, null или React.Fragment\nfunction Empty() { return null; } // OK — ничего не рендерит\nfunction List({ items }) {\n  if (items.length === 0) return null;\n  return <ul>{items.map(i => <li key={i}>{i}</li>)}</ul>;\n}\n\n// 4. НЕ должен напрямую изменять props\nfunction Bad({ count }) {\n  count++; // ПЛОХО! Props иммутабельны!\n  return <p>{count}</p>;\n}\nfunction Good({ count }) {\n  const displayCount = count + 1; // Создаём новое значение\n  return <p>{displayCount}</p>;\n}' },
        { type: 'note', value: 'Классовые компоненты (class MyComp extends React.Component) — устаревший подход. Новый код пишите на функциональных компонентах с хуками.' }
      ]
    },
    {
      id: 2,
      title: 'Экспорт и импорт компонентов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Каждый компонент обычно живёт в отдельном файле. Используйте named export или default export — у каждого свои плюсы.' },
        { type: 'heading', value: 'Default vs Named export' },
        { type: 'code', language: 'jsx', value: '// Default export — один на файл, имя при импорте любое\n// Button.jsx\nfunction Button({ children, onClick }) {\n  return <button onClick={onClick}>{children}</button>;\n}\nexport default Button;\n\n// Импорт:\nimport Button from "./Button";           // Имя можно выбрать\nimport MyButton from "./Button";          // Тоже работает\nimport CoolButton from "./Button";        // Тоже\n\n// Named export — несколько на файл, имя фиксировано\n// ui.jsx\nexport function Button({ children }) { return <button>{children}</button>; }\nexport function Input({ ...props }) { return <input {...props} />; }\nexport function Label({ children }) { return <label>{children}</label>; }\n\n// Импорт:\nimport { Button, Input, Label } from "./ui";\n// Или с переименованием:\nimport { Button as Btn } from "./ui";' },
        { type: 'tip', value: 'Соглашение: один компонент — один файл, default export. Для маленьких вспомогательных компонентов можно использовать named exports из одного файла.' }
      ]
    },
    {
      id: 3,
      title: 'Props и деструктуризация',
      type: 'theory',
      content: [
        { type: 'text', value: 'Props — объект, передаваемый компоненту. Деструктуризация делает код чище. Значения по умолчанию задаются прямо в параметрах.' },
        { type: 'heading', value: 'Паттерны работы с props' },
        { type: 'code', language: 'jsx', value: '// Без деструктуризации (громоздко)\nfunction Button(props) {\n  return (\n    <button\n      className={props.variant}\n      onClick={props.onClick}\n      disabled={props.disabled}\n    >\n      {props.children}\n    </button>\n  );\n}\n\n// С деструктуризацией (чисто)\nfunction Button({ variant = "primary", disabled = false, onClick, children }) {\n  return (\n    <button className={`btn btn-${variant}`} onClick={onClick} disabled={disabled}>\n      {children}\n    </button>\n  );\n}\n\n// Значения по умолчанию:\n// variant = "primary"  — если не передан, будет "primary"\n// disabled = false     — если не передан, будет false\n\n// Остальные пропсы через rest:\nfunction Input({ label, className = "", ...inputProps }) {\n  return (\n    <div className={`input-wrapper ${className}`}>\n      {label && <label>{label}</label>}\n      <input {...inputProps} /> {/* type, value, onChange, placeholder... */}\n    </div>\n  );\n}' }
      ]
    },
    {
      id: 4,
      title: 'children prop',
      type: 'theory',
      content: [
        { type: 'text', value: 'children — специальный prop, который содержит содержимое между открывающим и закрывающим тегами компонента. Позволяет создавать компоненты-обёртки.' },
        { type: 'heading', value: 'Использование children' },
        { type: 'code', language: 'jsx', value: '// Компонент-обёртка с children\nfunction Card({ title, children, footer }) {\n  return (\n    <div className="card">\n      <div className="card-header">\n        <h3>{title}</h3>\n      </div>\n      <div className="card-body">\n        {children} {/* Всё что между тегами Card */}\n      </div>\n      {footer && <div className="card-footer">{footer}</div>}\n    </div>\n  );\n}\n\n// Использование:\n<Card\n  title="Профиль пользователя"\n  footer={<button>Редактировать</button>}\n>\n  <p>Имя: Алиса Иванова</p>\n  <p>Email: alice@example.com</p>\n  <img src="/avatar.jpg" alt="Аватар" />\n</Card>' },
        { type: 'heading', value: 'Render Props паттерн' },
        { type: 'code', language: 'jsx', value: '// children как функция (render props)\nfunction DataFetcher({ url, children }) {\n  const [data, setData] = React.useState(null);\n  const [loading, setLoading] = React.useState(true);\n\n  React.useEffect(() => {\n    fetch(url).then(r => r.json()).then(d => {\n      setData(d); setLoading(false);\n    });\n  }, [url]);\n\n  return children({ data, loading }); // children — функция!\n}\n\n// Использование:\n<DataFetcher url="/api/users">\n  {({ data, loading }) => (\n    loading ? <Spinner /> : <UserList users={data} />\n  )}\n</DataFetcher>' }
      ]
    },
    {
      id: 5,
      title: 'Компонентная композиция',
      type: 'theory',
      content: [
        { type: 'text', value: 'Композиция — главный способ переиспользования кода в React. Вместо наследования используйте вложение компонентов и передачу children или component props.' },
        { type: 'heading', value: 'Паттерны композиции' },
        { type: 'code', language: 'jsx', value: '// 1. Container + Presentational паттерн\nfunction UserListContainer() {\n  const [users, setUsers] = React.useState([]);\n  // Логика: загрузка, фильтрация...\n  return <UserList users={users} />; // Только UI\n}\n\nfunction UserList({ users }) {\n  return <ul>{users.map(u => <UserItem key={u.id} user={u} />)}</ul>;\n}\n\n// 2. Специализация через props\nfunction Dialog({ title, content, actions, width = "400px" }) {\n  return (\n    <div style={{ width }}>\n      <h2>{title}</h2>\n      <p>{content}</p>\n      <div>{actions}</div>\n    </div>\n  );\n}\n\n// Специализированные диалоги:\nfunction ConfirmDialog({ onConfirm, onCancel, message }) {\n  return (\n    <Dialog\n      title="Подтверждение"\n      content={message}\n      actions={\n        <>\n          <button onClick={onConfirm}>Да</button>\n          <button onClick={onCancel}>Нет</button>\n        </>\n      }\n    />\n  );\n}' }
      ]
    },
    {
      id: 6,
      title: 'Именование и конвенции',
      type: 'theory',
      content: [
        { type: 'text', value: 'Правильное именование компонентов и файлов — важная часть поддерживаемости кода. Следуйте общепринятым соглашениям.' },
        { type: 'heading', value: 'Правила именования' },
        { type: 'code', language: 'jsx', value: '// Компоненты: PascalCase\nfunction UserProfile() {}\nfunction ProductCard() {}\nfunction NavigationMenu() {}\n\n// Файлы компонентов: PascalCase.jsx\n// UserProfile.jsx, ProductCard.jsx, NavigationMenu.jsx\n\n// Props: camelCase\nfunction Card({ cardTitle, isVisible, onCardClick }) {}\n\n// Обработчики событий: on + глагол\nfunction Button({ onClick, onHover, onFocus }) {}\n\n// Boolean пропсы: is/has/can + прилагательное\nfunction Modal({ isOpen, hasFooter, canClose }) {}\n\n// Функции обработчики внутри: handle + событие\nfunction Form() {\n  const handleSubmit = (e) => { e.preventDefault(); };\n  const handleChange = (e) => {};\n  return <form onSubmit={handleSubmit}><input onChange={handleChange} /></form>;\n}' },
        { type: 'list', value: ['Один компонент — один файл (исключение: маленькие вспомогательные)', 'Файл компонента называется так же как компонент', 'Не начинайте имя компонента с маленькой буквы!', 'Обработчики событий: handleClick, handleSubmit, handleChange'] }
      ]
    },
    {
      id: 7,
      title: 'Pure Components и побочные эффекты',
      type: 'theory',
      content: [
        { type: 'text', value: 'Компонент должен быть "чистой функцией" относительно props: одинаковые props → одинаковый UI. Побочные эффекты (запросы, таймеры) выносятся в useEffect.' },
        { type: 'heading', value: 'Правило чистоты' },
        { type: 'code', language: 'jsx', value: '// НЕЛЬЗЯ — побочный эффект в render\nlet count = 0;\nfunction BadCounter() {\n  count++; // Изменяет внешнюю переменную при каждом рендере!\n  return <p>{count}</p>;\n}\n\n// НЕЛЬЗЯ — мутация props\nfunction BadList({ items }) {\n  items.push("новый"); // Мутирует переданный массив!\n  return <ul>{items.map(i => <li>{i}</li>)}</ul>;\n}\n\n// МОЖНО — новый массив через spread/map\nfunction GoodList({ items }) {\n  const allItems = [...items, "дополнительный"]; // Не мутируем items\n  return <ul>{allItems.map((i, idx) => <li key={idx}>{i}</li>)}</ul>;\n}\n\n// В StrictMode React рендерит дважды для обнаружения нечистоты!' },
        { type: 'note', value: 'React.StrictMode в development намеренно вызывает функции компонентов дважды, чтобы найти побочные эффекты. Если UI дублируется — у вас нечистый компонент.' }
      ]
    },
    {
      id: 8,
      title: 'Практика: Библиотека компонентов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте набор базовых UI компонентов: Button, Badge, Avatar, Card — с вариантами и children prop.',
      requirements: [
        'Button: variant (primary/secondary/danger), size (sm/md/lg), disabled, children',
        'Badge: variant (success/warning/error/info), children',
        'Avatar: src, name (для alt), size (sm/md/lg), показывать инициалы если нет src',
        'Card: children, title?, footer?, нет лишних div',
        'Использовать все компоненты в App'
      ],
      hint: 'Avatar без src показывает первую букву имени на цветном фоне. Card с fragment или минимальной обёрткой. Варианты лучше хранить в объекте стилей.',
      expectedOutput: 'Button рендерит кнопку с вариантами primary/secondary/danger\nBadge отображает цветной бейдж с текстом\nAvatar показывает изображение или инициалы\nCard принимает children и рендерит в контейнере\nВсе компоненты поддерживают дополнительные className',
      solution: 'function Button({ variant = "primary", size = "md", disabled = false, onClick, children }) {\n  const base = { border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "500" };\n  const variants = {\n    primary:   { ...base, background: "#3b82f6", color: "white" },\n    secondary: { ...base, background: "#6b7280", color: "white" },\n    danger:    { ...base, background: "#ef4444", color: "white" },\n  };\n  const sizes = { sm: "6px 12px", md: "8px 16px", lg: "12px 24px" };\n  return (\n    <button style={{ ...variants[variant], padding: sizes[size] }} disabled={disabled} onClick={onClick}>\n      {children}\n    </button>\n  );\n}\n\nfunction Badge({ variant = "info", children }) {\n  const colors = {\n    success: { background: "#dcfce7", color: "#166534" },\n    warning: { background: "#fef9c3", color: "#854d0e" },\n    error:   { background: "#fee2e2", color: "#991b1b" },\n    info:    { background: "#dbeafe", color: "#1e40af" },\n  };\n  return (\n    <span style={{ ...colors[variant], padding: "2px 10px", borderRadius: "999px", fontSize: "12px", fontWeight: "600" }}>\n      {children}\n    </span>\n  );\n}\n\nfunction Avatar({ src, name, size = "md" }) {\n  const sizes = { sm: 32, md: 48, lg: 64 };\n  const px = sizes[size];\n  const initials = name.charAt(0).toUpperCase();\n  if (!src) {\n    return (\n      <div style={{ width: px, height: px, borderRadius: "50%", background: "#3b82f6", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: px * 0.4 }}>\n        {initials}\n      </div>\n    );\n  }\n  return <img src={src} alt={name} style={{ width: px, height: px, borderRadius: "50%", objectFit: "cover" }} />;\n}\n\nfunction Card({ title, footer, children }) {\n  return (\n    <div style={{ border: "1px solid #e5e7eb", borderRadius: "12px", overflow: "hidden", background: "white" }}>\n      {title && <div style={{ padding: "1rem", borderBottom: "1px solid #e5e7eb", fontWeight: "700" }}>{title}</div>}\n      <div style={{ padding: "1rem" }}>{children}</div>\n      {footer && <div style={{ padding: "1rem", borderTop: "1px solid #e5e7eb", background: "#f9fafb" }}>{footer}</div>}\n    </div>\n  );\n}\n\nfunction App() {\n  return (\n    <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>\n      <div style={{ display: "flex", gap: "0.5rem" }}>\n        <Button variant="primary">Сохранить</Button>\n        <Button variant="secondary">Отмена</Button>\n        <Button variant="danger" disabled>Удалить</Button>\n      </div>\n      <div style={{ display: "flex", gap: "0.5rem" }}>\n        <Badge variant="success">Активен</Badge>\n        <Badge variant="warning">В ожидании</Badge>\n        <Badge variant="error">Ошибка</Badge>\n      </div>\n      <div style={{ display: "flex", gap: "1rem" }}>\n        <Avatar name="Алиса Иванова" size="sm" />\n        <Avatar src="https://i.pravatar.cc/150?img=1" name="Боб" size="md" />\n        <Avatar name="Пётр Сидоров" size="lg" />\n      </div>\n      <Card title="Профиль" footer={<Button variant="primary" size="sm">Редактировать</Button>}>\n        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>\n          <Avatar name="Алиса" size="md" />\n          <div>\n            <p style={{ margin: 0, fontWeight: "600" }}>Алиса Иванова</p>\n            <Badge variant="info">Разработчик</Badge>\n          </div>\n        </div>\n      </Card>\n    </div>\n  );\n}',
      explanation: 'Каждый компонент — независимый блок. Стили через объект-маппинг variant/size — чисто и расширяемо. Avatar с fallback на инициалы — частый UX паттерн. Card с опциональными title и footer через && — гибкость без лишних props. Компоненты можно комбинировать (Avatar внутри Card).'
    }
  ]
}
