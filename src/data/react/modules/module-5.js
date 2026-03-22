export default {
  id: 5,
  title: 'Props',
  description: 'Передача данных через props, PropTypes, дефолтные значения, однонаправленный поток данных и паттерны пропсов',
  lessons: [
    {
      id: 1,
      title: 'Как работают Props',
      type: 'theory',
      content: [
        { type: 'text', value: 'Props (properties) — способ передачи данных от родительского компонента к дочернему. Данные текут только вниз — от родителя к детям. Props иммутабельны — дочерний компонент не может их изменить.' },
        { type: 'heading', value: 'Однонаправленный поток данных' },
        { type: 'code', language: 'jsx', value: '// Родитель контролирует данные\nfunction ParentComponent() {\n  const user = { name: "Алиса", role: "admin" };\n  const products = [{ id: 1, name: "Ноутбук" }, { id: 2, name: "Мышь" }];\n\n  return (\n    <div>\n      {/* Передаём данные вниз */}\n      <UserInfo user={user} />\n      <ProductList products={products} maxItems={5} />\n    </div>\n  );\n}\n\n// Дочерний получает и отображает\nfunction UserInfo({ user }) {\n  // user.name = "Боб"; <- НЕЛЬЗЯ! Props только для чтения\n  return <h2>Пользователь: {user.name}</h2>;\n}\n\nfunction ProductList({ products, maxItems }) {\n  const visible = products.slice(0, maxItems);\n  return <ul>{visible.map(p => <li key={p.id}>{p.name}</li>)}</ul>;\n}' },
        { type: 'tip', value: 'Если дочерний компонент должен изменить данные родителя — родитель передаёт функцию через props. Дочерний вызывает эту функцию. Это "поднятие состояния" (lifting state up).' }
      ]
    },
    {
      id: 2,
      title: 'Типы данных в Props',
      type: 'theory',
      content: [
        { type: 'text', value: 'Через props можно передавать любые JavaScript значения: строки, числа, булевы, объекты, массивы, функции и даже JSX.' },
        { type: 'heading', value: 'Все типы пропсов' },
        { type: 'code', language: 'jsx', value: 'function AllTypesDemo() {\n  const handleClick = () => alert("Клик!");\n  const renderHeader = () => <h1>Заголовок из функции</h1>;\n\n  return (\n    <Demo\n      // Строка\n      title="Привет"\n      // Число (в {})\n      count={42}\n      // Булево\n      isActive={true}\n      isActive2  // Сокращение для true\n      isDisabled={false}\n      // Объект\n      style={{ color: "red", fontSize: 16 }}\n      // Массив\n      items={["яблоко", "банан", "вишня"]}\n      // Функция\n      onClick={handleClick}\n      // JSX\n      icon={<StarIcon />}\n      // Функция возвращающая JSX\n      renderHeader={renderHeader}\n      // null/undefined — ничего не рендерит\n      extra={null}\n    />\n  );\n}' },
        { type: 'heading', value: 'Передача объектов' },
        { type: 'code', language: 'jsx', value: '// Лучше передавать объект целиком\nfunction UserCard({ user }) {\n  return <p>{user.name} - {user.email}</p>;\n}\n// <UserCard user={{ name: "Алиса", email: "a@t.com" }} />\n\n// Или разворачивать объект через spread\nconst userProps = { name: "Алиса", email: "a@t.com", age: 30 };\n// <UserCard {...userProps} /> == <UserCard name="Алиса" email="a@t.com" age={30} />' }
      ]
    },
    {
      id: 3,
      title: 'Callback Props — передача функций',
      type: 'theory',
      content: [
        { type: 'text', value: 'Callback props — функции, которые родитель передаёт детям для обратной связи. Когда что-то происходит в дочернем компоненте — он вызывает callback, и родитель реагирует.' },
        { type: 'heading', value: 'Поднятие состояния (Lifting State Up)' },
        { type: 'code', language: 'jsx', value: 'import { useState } from "react";\n\nfunction Parent() {\n  const [selectedId, setSelectedId] = useState(null);\n  const items = [\n    { id: 1, name: "Товар 1" },\n    { id: 2, name: "Товар 2" },\n  ];\n\n  return (\n    <div>\n      <ItemList\n        items={items}\n        selectedId={selectedId}\n        onSelect={setSelectedId} // Передаём функцию изменения\n      />\n      {selectedId && (\n        <p>Выбран товар #{selectedId}</p>\n      )}\n    </div>\n  );\n}\n\nfunction ItemList({ items, selectedId, onSelect }) {\n  return (\n    <ul>\n      {items.map(item => (\n        <li\n          key={item.id}\n          style={{ fontWeight: item.id === selectedId ? "bold" : "normal" }}\n          onClick={() => onSelect(item.id)} // Вызываем callback\n        >\n          {item.name}\n        </li>\n      ))}\n    </ul>\n  );\n}' },
        { type: 'note', value: 'Соглашение именования: пропс-функция называется on[Событие] (onSelect, onChange, onDelete), внутренний обработчик — handle[Событие] (handleSelect, handleChange).' }
      ]
    },
    {
      id: 4,
      title: 'Значения по умолчанию и обязательные Props',
      type: 'theory',
      content: [
        { type: 'text', value: 'Значения по умолчанию задаются через деструктуризацию. Обязательность можно проверять через PropTypes (устаревший) или TypeScript (рекомендуется).' },
        { type: 'heading', value: 'Значения по умолчанию' },
        { type: 'code', language: 'jsx', value: '// Деструктуризация с дефолтами\nfunction Button({\n  variant = "primary",\n  size = "medium",\n  disabled = false,\n  loading = false,\n  fullWidth = false,\n  children = "Кнопка", // Дефолтный текст\n  onClick\n}) {\n  return (\n    <button\n      disabled={disabled || loading}\n      style={{ width: fullWidth ? "100%" : "auto" }}\n      onClick={onClick}\n    >\n      {loading ? "Загрузка..." : children}\n    </button>\n  );\n}\n\n// Альтернатива — defaultProps (устаревший способ)\nButton.defaultProps = {\n  variant: "primary",\n  // Используйте деструктуризацию вместо этого\n};' },
        { type: 'heading', value: 'PropTypes (проверка в runtime)' },
        { type: 'code', language: 'jsx', value: 'import PropTypes from "prop-types"; // npm install prop-types\n\nfunction UserCard({ name, email, age, role }) {\n  return <div>{name} - {email}</div>;\n}\n\nUserCard.propTypes = {\n  name:  PropTypes.string.isRequired,\n  email: PropTypes.string.isRequired,\n  age:   PropTypes.number,\n  role:  PropTypes.oneOf(["admin", "user", "guest"]),\n};\n\n// Предупреждения в консоли при неправильных типах\n// В TypeScript проектах PropTypes не нужны' }
      ]
    },
    {
      id: 5,
      title: 'Паттерн Compound Components',
      type: 'theory',
      content: [
        { type: 'text', value: 'Compound Components — паттерн где несколько компонентов работают вместе, как HTML select и option. Позволяет создавать гибкие API с явной структурой.' },
        { type: 'heading', value: 'Пример Compound Components' },
        { type: 'code', language: 'jsx', value: '// Tabs компонент в стиле Compound Components\nfunction Tabs({ children, defaultActive = 0 }) {\n  const [active, setActive] = React.useState(defaultActive);\n  return (\n    <div className="tabs">\n      {React.Children.map(children, (child, idx) =>\n        React.cloneElement(child, { isActive: idx === active, onClick: () => setActive(idx) })\n      )}\n    </div>\n  );\n}\n\nfunction Tab({ label, children, isActive, onClick }) {\n  return (\n    <div>\n      <button\n        style={{ fontWeight: isActive ? "bold" : "normal" }}\n        onClick={onClick}\n      >\n        {label}\n      </button>\n      {isActive && <div className="tab-content">{children}</div>}\n    </div>\n  );\n}\n\nTabs.Tab = Tab; // Прикрепляем Tab как свойство Tabs\n\n// Использование:\n<Tabs defaultActive={0}>\n  <Tabs.Tab label="Профиль">Содержимое профиля</Tabs.Tab>\n  <Tabs.Tab label="Настройки">Содержимое настроек</Tabs.Tab>\n  <Tabs.Tab label="Безопасность">Настройки безопасности</Tabs.Tab>\n</Tabs>' }
      ]
    },
    {
      id: 6,
      title: 'Антипаттерны Props',
      type: 'theory',
      content: [
        { type: 'text', value: 'Props drilling, передача лишних данных, мутация props — частые ошибки новичков. Понимание антипаттернов помогает писать чистый код.' },
        { type: 'heading', value: 'Props Drilling и как его избежать' },
        { type: 'code', language: 'jsx', value: '// Props Drilling — проброс через много уровней (ПЛОХО)\nfunction App() {\n  const [user, setUser] = useState({ name: "Алиса" });\n  return <Level1 user={user} setUser={setUser} />;\n}\nfunction Level1({ user, setUser }) {\n  return <Level2 user={user} setUser={setUser} />;\n}\nfunction Level2({ user, setUser }) {\n  return <Level3 user={user} setUser={setUser} />;\n}\nfunction Level3({ user, setUser }) {\n  // Вот где реально используется!\n  return <button onClick={() => setUser({ name: "Боб" })}>{user.name}</button>;\n}\n\n// Решения:\n// 1. Context API (см. модуль 15)\n// 2. Поднять компонент Level3 выше\n// 3. Использовать composition:\nfunction App2() {\n  const [user, setUser] = useState({ name: "Алиса" });\n  // Передаём готовый JSX вместо данных\n  const button = <button onClick={() => setUser({ name: "Боб" })}>{user.name}</button>;\n  return <Level1 userButton={button} />;\n}' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Компонент таблицы с Props',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте гибкий компонент Table, который принимает данные и конфигурацию колонок через props. Поддержка сортировки через callback.',
      requirements: [
        'Table принимает: data (массив объектов), columns (массив конфигов колонок)',
        'Column config: { key, label, render? (custom renderer) }',
        'Если render не задан — показывает data[column.key]',
        'Клик по заголовку колонки вызывает onSort(key) callback',
        'Пустое состояние: если data пустой — показывает emptyMessage',
        'Тестировать на массиве пользователей'
      ],
      hint: 'columns.map() для заголовков, data.map() для строк, columns.map() для ячеек. column.render ? column.render(row) : row[column.key] для кастомного рендеринга.',
      expectedOutput: 'Table рендерит таблицу с заголовками из columns\nДанные отображаются по конфигурации колонок\nПустые данные: "Нет данных"\ncell: fn позволяет кастомный рендер ячейки\nКомпонент переиспользуем для любых данных',
      solution: 'function Table({ data = [], columns = [], onSort, emptyMessage = "Нет данных" }) {\n  if (data.length === 0) {\n    return <p style={{ textAlign: "center", color: "#6b7280" }}>{emptyMessage}</p>;\n  }\n\n  return (\n    <table style={{ width: "100%", borderCollapse: "collapse" }}>\n      <thead>\n        <tr style={{ background: "#f3f4f6" }}>\n          {columns.map(col => (\n            <th\n              key={col.key}\n              style={{ padding: "12px", textAlign: "left", cursor: onSort ? "pointer" : "default", borderBottom: "2px solid #e5e7eb" }}\n              onClick={() => onSort?.(col.key)}\n            >\n              {col.label}\n              {onSort && <span> ↕</span>}\n            </th>\n          ))}\n        </tr>\n      </thead>\n      <tbody>\n        {data.map((row, rowIdx) => (\n          <tr key={row.id ?? rowIdx} style={{ borderBottom: "1px solid #e5e7eb" }}>\n            {columns.map(col => (\n              <td key={col.key} style={{ padding: "12px" }}>\n                {col.render ? col.render(row) : row[col.key]}\n              </td>\n            ))}\n          </tr>\n        ))}\n      </tbody>\n    </table>\n  );\n}\n\n// Использование:\nfunction App() {\n  const [sortKey, setSortKey] = React.useState(null);\n  const users = [\n    { id: 1, name: "Алиса", email: "alice@test.com", role: "admin", active: true },\n    { id: 2, name: "Боб",   email: "bob@test.com",   role: "user",  active: false },\n    { id: 3, name: "Петя",  email: "petya@test.com", role: "user",  active: true },\n  ];\n\n  const columns = [\n    { key: "name",  label: "Имя" },\n    { key: "email", label: "Email" },\n    { key: "role",  label: "Роль" },\n    {\n      key: "active",\n      label: "Статус",\n      render: (user) => (\n        <span style={{ color: user.active ? "#16a34a" : "#dc2626" }}>\n          {user.active ? "Активен" : "Заблокирован"}\n        </span>\n      )\n    },\n  ];\n\n  return (\n    <div style={{ padding: "2rem" }}>\n      <h2>Пользователи {sortKey && `(сортировка: ${sortKey})`}</h2>\n      <Table data={users} columns={columns} onSort={setSortKey} />\n    </div>\n  );\n}',
      explanation: 'Table — data-driven компонент: он не знает ничего о структуре данных, конфигурация передаётся снаружи. column.render позволяет кастомизировать ячейку без изменения Table. onSort — callback, Table не знает как сортировать, просто уведомляет родителя. Это паттерн "умный родитель — тупой ребёнок".'
    }
  ]
}
