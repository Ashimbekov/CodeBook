export default {
  id: 3,
  title: 'JSX',
  description: 'JSX синтаксис: выражения, условия, списки, атрибуты, самозакрывающиеся теги и правила написания JSX кода',
  lessons: [
    {
      id: 1,
      title: 'Что такое JSX',
      type: 'theory',
      content: [
        { type: 'text', value: 'JSX (JavaScript XML) — синтаксическое расширение JavaScript, которое позволяет писать HTML-подобный код внутри JavaScript. JSX компилируется в вызовы React.createElement().' },
        { type: 'heading', value: 'JSX под капотом' },
        { type: 'code', language: 'jsx', value: '// То, что вы пишете (JSX):\nfunction Greeting({ name }) {\n  return <h1 className="title">Привет, {name}!</h1>;\n}\n\n// То, во что компилируется (Babel/Vite):\nfunction Greeting({ name }) {\n  return React.createElement(\n    "h1",\n    { className: "title" },\n    "Привет, ",\n    name,\n    "!"\n  );\n}\n\n// Результат React.createElement — объект:\n// {\n//   type: "h1",\n//   props: { className: "title", children: "Привет, Алиса!" }\n// }' },
        { type: 'tip', value: 'JSX — не HTML! Хотя выглядит похоже, JSX имеет свои правила. class -> className, for -> htmlFor, все атрибуты в camelCase.' },
        { type: 'heading', value: 'Основные отличия от HTML' },
        { type: 'list', value: ['className вместо class', 'htmlFor вместо for (в label)', 'style принимает объект, не строку', 'Все теги должны быть закрыты: <br /> <img /> <input />', 'Компонент начинается с заглавной буквы: <Button /> не <button />'] }
      ]
    },
    {
      id: 2,
      title: 'Выражения в JSX',
      type: 'theory',
      content: [
        { type: 'text', value: 'Внутри JSX можно вставлять любые JavaScript выражения в фигурных скобках {}. Выражение — это то, что возвращает значение: переменные, вызовы функций, тернарный оператор.' },
        { type: 'heading', value: 'Вставка выражений' },
        { type: 'code', language: 'jsx', value: 'function Profile({ user }) {\n  const fullName = `${user.firstName} ${user.lastName}`;\n  const age = new Date().getFullYear() - user.birthYear;\n\n  return (\n    <div>\n      {/* Переменная */}\n      <h2>{fullName}</h2>\n\n      {/* Выражение */}\n      <p>Возраст: {age} лет</p>\n\n      {/* Вызов функции */}\n      <p>Email: {user.email.toLowerCase()}</p>\n\n      {/* Тернарный оператор */}\n      <span>{user.isAdmin ? "Администратор" : "Пользователь"}</span>\n\n      {/* Математика */}\n      <p>Баланс: {user.balance * 1.1} руб. (с бонусом 10%)</p>\n\n      {/* Массив методов */}\n      <p>Теги: {user.tags.join(", ")}</p>\n    </div>\n  );\n}' },
        { type: 'heading', value: 'Что НЕЛЬЗЯ вставлять напрямую' },
        { type: 'code', language: 'jsx', value: '// Объекты нельзя рендерить напрямую!\n// <p>{user}</p>  <- Ошибка: Objects are not valid as React child\n// <p>{{a: 1}}</p> <- Ошибка\n\n// Нужно извлечь значение:\n<p>{user.name}</p>\n<p>{JSON.stringify(user)}</p> // Для отладки\n\n// undefined, null, false — рендерят ничего (полезно!)\n{isLoading && <Spinner />}  // false -> ничего\n{user ? <Profile /> : null}  // null -> ничего' }
      ]
    },
    {
      id: 3,
      title: 'Атрибуты в JSX',
      type: 'theory',
      content: [
        { type: 'text', value: 'Атрибуты в JSX пишутся в camelCase. Строковые значения в кавычках, JavaScript выражения — в {}. Некоторые атрибуты имеют другие имена, чем в HTML.' },
        { type: 'heading', value: 'Основные атрибуты' },
        { type: 'code', language: 'jsx', value: 'function FormExample() {\n  return (\n    <form>\n      {/* className вместо class */}\n      <div className="form-group">\n        \n        {/* htmlFor вместо for */}\n        <label htmlFor="email">Email:</label>\n        \n        {/* Строковые атрибуты */}\n        <input\n          type="email"\n          id="email"\n          placeholder="Введите email"\n          autoComplete="email"\n        />\n      </div>\n\n      {/* style принимает объект */}\n      <button\n        style={{\n          background: "#007bff",\n          color: "white",\n          padding: "8px 16px",\n          border: "none",\n          borderRadius: "4px"\n        }}\n      >\n        Отправить\n      </button>\n    </form>\n  );\n}' },
        { type: 'heading', value: 'Spread атрибуты' },
        { type: 'code', language: 'jsx', value: '// Передача всех атрибутов через spread\nfunction Input({ label, ...inputProps }) {\n  return (\n    <div>\n      <label>{label}</label>\n      <input {...inputProps} />\n      {/* Все пропсы кроме label передаются в input */}\n    </div>\n  );\n}\n\n// Использование:\n<Input\n  label="Email"\n  type="email"\n  placeholder="Введите email"\n  required\n  autoComplete="email"\n/>' },
        { type: 'tip', value: 'Boolean атрибуты: disabled, checked, required, readOnly. Просто написать disabled={true} или сокращённо disabled (без значения).' }
      ]
    },
    {
      id: 4,
      title: 'Условный рендеринг в JSX',
      type: 'theory',
      content: [
        { type: 'text', value: 'В JSX нет if/else напрямую — только выражения. Для условий используют тернарный оператор ? :, логическое И &&, или выносят условие за скобки.' },
        { type: 'heading', value: 'Паттерны условного рендеринга' },
        { type: 'code', language: 'jsx', value: 'function UserCard({ user, isLoading, error }) {\n  // 1. Ранний возврат (guard clause)\n  if (isLoading) return <div>Загрузка...</div>;\n  if (error) return <div>Ошибка: {error}</div>;\n  if (!user) return null;\n\n  return (\n    <div className="card">\n      <h2>{user.name}</h2>\n\n      {/* 2. Тернарный оператор */}\n      <span>{user.isActive ? "Активен" : "Неактивен"}</span>\n\n      {/* 3. Логическое И (только если truthy) */}\n      {user.isAdmin && <span className="badge">Администратор</span>}\n\n      {/* 4. Логическое ИЛИ (значение по умолчанию) */}\n      <p>{user.bio || "Биография не указана"}</p>\n\n      {/* 5. Nullish coalescing */}\n      <p>{user.phone ?? "Телефон не указан"}</p>\n    </div>\n  );\n}' },
        { type: 'note', value: 'Осторожно с &&: если левая часть — число 0, React отрендерит "0"! Используйте !! или Boolean(): {!!count && <Badge />} или {count > 0 && <Badge />}.' }
      ]
    },
    {
      id: 5,
      title: 'Fragment и множественные элементы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Компонент может возвращать только ОДИН корневой элемент. Чтобы вернуть несколько элементов без лишнего div, используют Fragment.' },
        { type: 'heading', value: 'React Fragment' },
        { type: 'code', language: 'jsx', value: 'import { Fragment } from "react";\n\n// Без Fragment — лишний div в DOM\nfunction BadComponent() {\n  return (\n    <div> {/* Лишний div */}\n      <h2>Заголовок</h2>\n      <p>Текст</p>\n    </div>\n  );\n}\n\n// С Fragment — без лишнего div\nfunction GoodComponent() {\n  return (\n    <Fragment>\n      <h2>Заголовок</h2>\n      <p>Текст</p>\n    </Fragment>\n  );\n}\n\n// Короткий синтаксис (самый распространённый)\nfunction BestComponent() {\n  return (\n    <>\n      <h2>Заголовок</h2>\n      <p>Текст</p>\n    </>\n  );\n}\n\n// Fragment с key (нужен в списках):\nfunction List({ items }) {\n  return items.map(item => (\n    <Fragment key={item.id}> {/* Нельзя <> с key */}\n      <dt>{item.term}</dt>\n      <dd>{item.definition}</dd>\n    </Fragment>\n  ));\n}' }
      ]
    },
    {
      id: 6,
      title: 'Комментарии и специальные символы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Комментарии в JSX пишутся в фигурных скобках. HTML-специальные символы кодируются как в HTML или через Unicode.' },
        { type: 'heading', value: 'Комментарии в JSX' },
        { type: 'code', language: 'jsx', value: 'function Component() {\n  return (\n    <div>\n      {/* Это комментарий в JSX — работает! */}\n      <p>Текст</p>\n      {// Однострочный — но нужна особая осторожность\n      }\n    </div>\n  );\n  // Обычный JS комментарий вне JSX\n}\n\n// Специальные символы:\nfunction Special() {\n  return (\n    <p>\n      &copy; 2025 — копирайт<br />\n      &amp; — амперсанд<br />\n      &lt; &gt; — угловые скобки<br />\n      &#8364; — знак евро (€)<br />\n      {/* Или через переменную: */}\n      {"<"} {">"} {/* Безопасный способ */}\n    </p>\n  );\n}' },
        { type: 'tip', value: 'Никогда не вставляйте HTML напрямую через dangerouslySetInnerHTML без санитизации — риск XSS атаки. Используйте только с доверенным контентом или через DOMPurify.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: JSX задания',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создайте компонент ProfileCard, который отображает информацию о пользователе с условным рендерингом.',
      requirements: [
        'ProfileCard принимает: name, email, avatar, isOnline, bio?, role',
        'Показывать зелёную точку если isOnline, серую — если нет',
        'bio необязательно — показывать "Нет описания" если не передано',
        'role === "admin" — показывать бейдж "Администратор"',
        'Использовать Fragment для обёртки без лишнего div'
      ],
      hint: 'isOnline && или тернарный оператор для точки. bio || "Нет описания" для значения по умолчанию. role === "admin" && <Badge /> для бейджа.',
      expectedOutput: 'Компонент ProfileCard отображает аватар, имя, должность и описание\nПри isOnline=true — зелёный индикатор "Онлайн"\nПри отсутствии avatar — показывает инициалы\nСписок навыков рендерится через map()\ncompactView=true скрывает описание',
      solution: 'function ProfileCard({ name, email, avatar, isOnline, bio, role }) {\n  return (\n    <div style={{ border: "1px solid #ddd", borderRadius: "12px", padding: "1.5rem", maxWidth: "300px" }}>\n      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>\n        <div style={{ position: "relative" }}>\n          <img\n            src={avatar}\n            alt={name}\n            style={{ width: "64px", height: "64px", borderRadius: "50%", objectFit: "cover" }}\n          />\n          <span style={{\n            position: "absolute",\n            bottom: "2px",\n            right: "2px",\n            width: "14px",\n            height: "14px",\n            borderRadius: "50%",\n            background: isOnline ? "#22c55e" : "#9ca3af",\n            border: "2px solid white"\n          }} />\n        </div>\n        <div>\n          <h3 style={{ margin: 0 }}>{name}</h3>\n          {role === "admin" && (\n            <span style={{ background: "#fbbf24", padding: "2px 8px", borderRadius: "999px", fontSize: "12px" }}>\n              Администратор\n            </span>\n          )}\n        </div>\n      </div>\n      <p style={{ color: "#6b7280", fontSize: "14px", margin: "0 0 8px" }}>{email}</p>\n      <p style={{ fontSize: "14px" }}>{bio || "Нет описания"}</p>\n      <p style={{ fontSize: "12px", color: isOnline ? "#22c55e" : "#9ca3af" }}>\n        {isOnline ? "Онлайн" : "Оффлайн"}\n      </p>\n    </div>\n  );\n}\n\n// Использование:\n<ProfileCard\n  name="Алиса Иванова"\n  email="alice@example.com"\n  avatar="https://i.pravatar.cc/150?img=1"\n  isOnline={true}\n  bio="Frontend разработчик"\n  role="admin"\n/>',
      explanation: 'Условный рендеринг через &&: role === "admin" && <span>. Значение по умолчанию: bio || "Нет описания". Динамические стили: background: isOnline ? "#22c55e" : "#9ca3af". Этот паттерн с position: absolute для индикатора онлайн-статуса очень распространён в реальных проектах.'
    }
  ]
}
