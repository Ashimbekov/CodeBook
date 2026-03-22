export default {
  id: 1,
  title: 'Введение в React',
  description: 'Что такое React, зачем он нужен, Virtual DOM, компонентный подход и сравнение с vanilla JS',
  lessons: [
    {
      id: 1,
      title: 'Что такое React и зачем он нужен',
      type: 'theory',
      content: [
        { type: 'text', value: 'React — это JavaScript библиотека для создания пользовательских интерфейсов. Разработана Facebook в 2013 году. React позволяет строить интерфейсы из маленьких независимых кусочков кода — компонентов.' },
        { type: 'tip', value: 'React — не фреймворк, а библиотека. Он отвечает только за UI. Для роутинга нужен React Router, для глобального состояния — Redux или Zustand.' },
        { type: 'heading', value: 'Проблема, которую решает React' },
        { type: 'code', language: 'jsx', value: '// Без React — ручное обновление DOM\nconst count = 0;\ndocument.getElementById("counter").textContent = count;\ndocument.getElementById("btn").addEventListener("click", () => {\n  count++;\n  document.getElementById("counter").textContent = count;\n  // Нужно вручную обновлять ВСЕ зависимые элементы!\n});\n\n// С React — описываете ЧТО, React сам обновляет КАК\nfunction Counter() {\n  const [count, setCount] = React.useState(0);\n  return (\n    <div>\n      <p>Счётчик: {count}</p>\n      <button onClick={() => setCount(count + 1)}>+1</button>\n    </div>\n  );\n}' },
        { type: 'heading', value: 'Ключевые принципы React' },
        { type: 'list', value: ['Декларативность — описываете что показать, не как обновить DOM', 'Компонентный подход — интерфейс из маленьких переиспользуемых блоков', 'Однонаправленный поток данных — данные текут сверху вниз', 'Virtual DOM — обновляет только то, что изменилось'] },
        { type: 'note', value: 'React используется в Instagram, Facebook, Airbnb, Netflix. По данным Stack Overflow, React — самый популярный frontend фреймворк уже несколько лет подряд.' }
      ]
    },
    {
      id: 2,
      title: 'Virtual DOM — как React обновляет страницу',
      type: 'theory',
      content: [
        { type: 'text', value: 'Virtual DOM — это лёгкая копия реального DOM в памяти JavaScript. Когда данные меняются, React сначала обновляет Virtual DOM, сравнивает его со старой версией (diffing) и применяет ТОЛЬКО необходимые изменения к реальному DOM.' },
        { type: 'heading', value: 'Как работает Virtual DOM' },
        { type: 'code', language: 'jsx', value: '// 1. У вас есть состояние\nconst [items, setItems] = useState(["яблоко", "банан"]);\n\n// 2. Вы добавляете элемент\nsetItems([...items, "вишня"]);\n\n// 3. React создаёт новый Virtual DOM:\n// <ul>\n//   <li>яблоко</li>\n//   <li>банан</li>\n//   <li>вишня</li>  <- только это новое!\n// </ul>\n\n// 4. Diffing: сравнивает старый и новый Virtual DOM\n// Находит: добавился только один <li>вишня</li>\n\n// 5. Применяет ТОЛЬКО это изменение к реальному DOM\n// Не перерисовывает весь список!' },
        { type: 'tip', value: 'Прямое изменение DOM через document.getElementById каждый раз вызывает перерисовку браузером. Virtual DOM батчит изменения и минимизирует обращения к реальному DOM — это быстрее.' },
        { type: 'heading', value: 'Reconciliation (согласование)' },
        { type: 'text', value: 'Алгоритм сравнения Virtual DOM называется reconciliation. React Fiber (алгоритм с 2017 года) делает это инкрементально, разбивая работу на небольшие куски, не блокируя браузер.' }
      ]
    },
    {
      id: 3,
      title: 'Компонентный подход',
      type: 'theory',
      content: [
        { type: 'text', value: 'Компонент — это функция, которая принимает данные (props) и возвращает JSX (описание UI). Весь интерфейс в React состоит из компонентов.' },
        { type: 'heading', value: 'Страница как дерево компонентов' },
        { type: 'code', language: 'jsx', value: '// Страница раскладывается на компоненты:\n// <App>\n//   <Header>\n//     <Logo />\n//     <Navigation />\n//   </Header>\n//   <Main>\n//     <ProductList>\n//       <ProductCard />\n//       <ProductCard />\n//       <ProductCard />\n//     </ProductList>\n//   </Main>\n//   <Footer />\n// </App>\n\n// Каждый компонент — отдельная функция\nfunction ProductCard({ title, price, image }) {\n  return (\n    <div className="card">\n      <img src={image} alt={title} />\n      <h3>{title}</h3>\n      <p>{price} руб.</p>\n      <button>В корзину</button>\n    </div>\n  );\n}' },
        { type: 'heading', value: 'Преимущества компонентов' },
        { type: 'list', value: ['Переиспользование — один ProductCard для 100 товаров', 'Изоляция — изменение одного компонента не ломает другие', 'Тестируемость — каждый компонент тестируется отдельно', 'Командная работа — разные разработчики работают над разными компонентами'] }
      ]
    },
    {
      id: 4,
      title: 'Первое React приложение',
      type: 'theory',
      content: [
        { type: 'text', value: 'Минимальное React приложение состоит из двух файлов: index.html и JavaScript файла. В современных проектах используют Vite или Create React App для настройки окружения.' },
        { type: 'heading', value: 'Минимальный пример' },
        { type: 'code', language: 'jsx', value: '// index.html\n// <div id="root"></div>\n// <script type="module" src="./main.jsx"></script>\n\n// main.jsx\nimport React from "react";\nimport ReactDOM from "react-dom/client";\n\nfunction App() {\n  return <h1>Привет, React!</h1>;\n}\n\nconst root = ReactDOM.createRoot(document.getElementById("root"));\nroot.render(<App />);\n\n// React 18: createRoot вместо ReactDOM.render\n// <App /> — это JSX, который превращается в React.createElement("h1", null, "Привет, React!")' },
        { type: 'heading', value: 'Структура React проекта' },
        { type: 'code', language: 'jsx', value: '// Типичная структура проекта:\n// src/\n//   main.jsx        — точка входа\n//   App.jsx         — корневой компонент\n//   components/     — переиспользуемые компоненты\n//     Button.jsx\n//     Modal.jsx\n//   pages/          — страницы (роуты)\n//     HomePage.jsx\n//   hooks/          — кастомные хуки\n//   utils/          — утилитные функции' }
      ]
    },
    {
      id: 5,
      title: 'React vs Vanilla JS vs другие фреймворки',
      type: 'theory',
      content: [
        { type: 'text', value: 'Когда использовать React, когда — vanilla JS, а когда — Vue или Angular? Понимание различий помогает выбрать правильный инструмент.' },
        { type: 'heading', value: 'Сравнение подходов' },
        { type: 'code', language: 'jsx', value: '// Vanilla JS: полный контроль, но много кода\nfunction updateList(items) {\n  const ul = document.querySelector("#list");\n  ul.innerHTML = ""; // Очищаем весь список!\n  items.forEach(item => {\n    const li = document.createElement("li");\n    li.textContent = item;\n    ul.appendChild(li);\n  });\n}\n\n// React: декларативно, производительно\nfunction List({ items }) {\n  return (\n    <ul id="list">\n      {items.map((item, i) => <li key={i}>{item}</li>)}\n    </ul>\n  );\n}' },
        { type: 'list', value: ['Vanilla JS — для простых страниц без сложного состояния', 'React — для сложных SPA с много компонентами и состоянием', 'Vue — похож на React, более опинионированный, плавная кривая обучения', 'Angular — полный фреймворк, подходит для enterprise, больше boilerplate'] },
        { type: 'tip', value: 'React — самый популярный выбор для frontend разработки в 2025 году. Знание React открывает возможности в React Native (мобильные приложения), Next.js (SSR) и Electron (десктоп).' }
      ]
    },
    {
      id: 6,
      title: 'Экосистема React',
      type: 'theory',
      content: [
        { type: 'text', value: 'React — это ядро. Вокруг него существует огромная экосистема библиотек и инструментов для всего необходимого в реальных приложениях.' },
        { type: 'heading', value: 'Основные инструменты' },
        { type: 'code', language: 'jsx', value: '// Создание проекта:\n// Vite (рекомендуется): npm create vite@latest\n// Next.js (SSR/SSG):    npx create-next-app@latest\n\n// Роутинг:\n// React Router v6:       npm install react-router-dom\n\n// Состояние (глобальное):\n// Redux Toolkit:          npm install @reduxjs/toolkit\n// Zustand (проще):        npm install zustand\n\n// Запросы к API:\n// TanStack Query:         npm install @tanstack/react-query\n// axios:                  npm install axios\n\n// Стилизация:\n// Tailwind CSS:           npm install tailwindcss\n// CSS Modules:            встроен в Vite\n// styled-components:      npm install styled-components\n\n// Тестирование:\n// Vitest + Testing Library: npm install vitest @testing-library/react' },
        { type: 'note', value: 'Не нужно сразу учить всё. Начните с React основ + React Router + fetch/axios. Когда поймёте проблему — добавляйте инструменты. Не усложняйте раньше времени.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Первый компонент',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создайте своё первое React приложение с несколькими компонентами. Без хуков, только структура и JSX.',
      requirements: [
        'Компонент Header с заголовком и навигацией',
        'Компонент Card принимает props: title, description, imageUrl',
        'Компонент App рендерит Header и три Card',
        'Использовать className для стилей',
        'Все компоненты — функциональные'
      ],
      hint: 'Начните с App, затем создайте Header и Card как отдельные функции. Props передаются как атрибуты: <Card title="..." description="..." />',
      expectedOutput: 'Компонент Header рендерит заголовок и навигацию\nКомпонент Card принимает props title, description, imageUrl и отображает их\nApp рендерит Header и три Card с разными данными\nВсе компоненты — функциональные, используют className',
      solution: 'function Header() {\n  return (\n    <header style={{ background: "#007bff", color: "white", padding: "1rem" }}>\n      <h1>Мой первый React сайт</h1>\n      <nav>\n        <a href="#" style={{ color: "white", marginRight: "1rem" }}>Главная</a>\n        <a href="#" style={{ color: "white", marginRight: "1rem" }}>О нас</a>\n        <a href="#" style={{ color: "white" }}>Контакты</a>\n      </nav>\n    </header>\n  );\n}\n\nfunction Card({ title, description, imageUrl }) {\n  return (\n    <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "1rem", margin: "1rem" }}>\n      <img src={imageUrl} alt={title} style={{ width: "100%", height: "150px", objectFit: "cover" }} />\n      <h2>{title}</h2>\n      <p>{description}</p>\n    </div>\n  );\n}\n\nfunction App() {\n  return (\n    <div>\n      <Header />\n      <main style={{ padding: "1rem" }}>\n        <h2>Наши продукты</h2>\n        <div style={{ display: "flex", flexWrap: "wrap" }}>\n          <Card\n            title="Ноутбук"\n            description="Мощный ноутбук для работы и учёбы"\n            imageUrl="https://via.placeholder.com/300x150"\n          />\n          <Card\n            title="Смартфон"\n            description="Флагманский смартфон с отличной камерой"\n            imageUrl="https://via.placeholder.com/300x150"\n          />\n          <Card\n            title="Наушники"\n            description="Беспроводные наушники с шумоподавлением"\n            imageUrl="https://via.placeholder.com/300x150"\n          />\n        </div>\n      </main>\n    </div>\n  );\n}\n\nexport default App;',
      explanation: 'Header и Card — отдельные компоненты. App их объединяет. Данные передаются через props — атрибуты при использовании. Card деструктурирует props: { title, description, imageUrl }. Это основа React: разбить UI на компоненты и соединить через props.'
    }
  ]
}
