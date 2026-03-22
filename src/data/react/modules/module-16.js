export default {
  id: 16,
  title: 'React Router',
  description: 'Клиентская маршрутизация с React Router v6: BrowserRouter, Routes, Route, Link, NavLink, useNavigate, useParams, useSearchParams и вложенные маршруты.',
  lessons: [
    {
      id: 1,
      title: 'Основы маршрутизации: BrowserRouter и Routes',
      type: 'theory',
      content: [
        { type: 'text', value: 'React Router — стандартная библиотека для маршрутизации в React. Она позволяет создавать одностраничные приложения (SPA) с разными URL-адресами без перезагрузки страницы.' },
        { type: 'heading', value: 'Установка и базовая настройка' },
        { type: 'code', language: 'jsx', value: '// npm install react-router-dom\n\nimport { BrowserRouter, Routes, Route } from "react-router-dom";\n\nfunction App() {\n  return (\n    <BrowserRouter>\n      <Routes>\n        <Route path="/" element={<Home />} />\n        <Route path="/about" element={<About />} />\n        <Route path="/users" element={<Users />} />\n        <Route path="*" element={<NotFound />} />\n      </Routes>\n    </BrowserRouter>\n  );\n}\n\n// path="*" — маршрут 404, срабатывает на всё неизвестное' },
        { type: 'note', value: 'В React Router v6 нет атрибута exact — маршруты по умолчанию точные. Символ * означает "любой суффикс" и используется для 404 и вложенных маршрутов.' }
      ]
    },
    {
      id: 2,
      title: 'Навигация: Link, NavLink и useNavigate',
      type: 'theory',
      content: [
        { type: 'text', value: 'Для навигации используем компоненты Link и NavLink вместо тега <a>. Link не перезагружает страницу. NavLink дополнительно добавляет CSS-класс активному маршруту.' },
        { type: 'heading', value: 'Link, NavLink и программная навигация' },
        { type: 'code', language: 'jsx', value: 'import { Link, NavLink, useNavigate } from "react-router-dom";\n\nfunction Navigation() {\n  const navigate = useNavigate();\n\n  const handleLogout = () => {\n    // Логика выхода...\n    navigate("/login"); // Программный переход\n  };\n\n  return (\n    <nav>\n      {/* Обычная ссылка */}\n      <Link to="/">Главная</Link>\n\n      {/* NavLink добавляет класс "active" к активному маршруту */}\n      <NavLink\n        to="/about"\n        className={({ isActive }) => isActive ? "nav-active" : ""}\n      >\n        О нас\n      </NavLink>\n\n      <NavLink to="/users">Пользователи</NavLink>\n\n      {/* Кнопка с программной навигацией */}\n      <button onClick={handleLogout}>Выйти</button>\n    </nav>\n  );\n}' },
        { type: 'tip', value: 'useNavigate(-1) работает как кнопка "Назад" браузера. navigate("/dashboard", { replace: true }) заменяет текущую запись в истории вместо добавления новой.' }
      ]
    },
    {
      id: 3,
      title: 'Динамические параметры: useParams',
      type: 'theory',
      content: [
        { type: 'text', value: 'Динамические сегменты маршрута объявляются через двоеточие. Хук useParams возвращает объект с параметрами текущего URL.' },
        { type: 'heading', value: 'Маршруты с параметрами' },
        { type: 'code', language: 'jsx', value: 'import { Routes, Route, useParams, Link } from "react-router-dom";\n\n// Маршруты\nfunction App() {\n  return (\n    <Routes>\n      <Route path="/users" element={<UserList />} />\n      <Route path="/users/:userId" element={<UserDetail />} />\n      <Route path="/posts/:category/:postId" element={<Post />} />\n    </Routes>\n  );\n}\n\n// Страница детализации пользователя\nfunction UserDetail() {\n  const { userId } = useParams();\n\n  return (\n    <div>\n      <h1>Пользователь #{userId}</h1>\n      <Link to="/users">Назад к списку</Link>\n    </div>\n  );\n}\n\n// Несколько параметров\nfunction Post() {\n  const { category, postId } = useParams();\n  return <h1>Пост {postId} в категории {category}</h1>;\n}' },
        { type: 'note', value: 'Параметры из useParams — всегда строки. Если нужно число, конвертируй явно: const id = parseInt(userId, 10) или Number(userId).' }
      ]
    },
    {
      id: 4,
      title: 'Параметры запроса: useSearchParams',
      type: 'theory',
      content: [
        { type: 'text', value: 'Параметры запроса (query params) — часть URL после знака ?. Например: /products?category=phones&sort=price. Хук useSearchParams работает аналогично useState.' },
        { type: 'heading', value: 'Работа с query параметрами' },
        { type: 'code', language: 'jsx', value: 'import { useSearchParams } from "react-router-dom";\n\nfunction ProductList() {\n  const [searchParams, setSearchParams] = useSearchParams();\n\n  // Читаем параметры\n  const category = searchParams.get("category") || "all";\n  const sort = searchParams.get("sort") || "name";\n  const page = parseInt(searchParams.get("page") || "1");\n\n  const handleCategoryChange = (newCategory) => {\n    // Обновляем параметры (остальные сохраняются)\n    setSearchParams(prev => {\n      prev.set("category", newCategory);\n      prev.set("page", "1"); // Сбрасываем страницу\n      return prev;\n    });\n  };\n\n  return (\n    <div>\n      <p>Категория: {category}, Сортировка: {sort}, Страница: {page}</p>\n      <button onClick={() => handleCategoryChange("phones")}>Телефоны</button>\n      <button onClick={() => handleCategoryChange("laptops")}>Ноутбуки</button>\n    </div>\n  );\n  // URL меняется на /products?category=phones&sort=name&page=1\n}' },
        { type: 'tip', value: 'useSearchParams сохраняет остальные параметры при изменении одного, если использовать setSearchParams(prev => { prev.set(...); return prev; }).' }
      ]
    },
    {
      id: 5,
      title: 'Вложенные маршруты и Outlet',
      type: 'theory',
      content: [
        { type: 'text', value: 'Вложенные маршруты позволяют создавать layout-компоненты с общими элементами (шапка, боковое меню). Компонент Outlet рендерит дочерний маршрут.' },
        { type: 'heading', value: 'Layout с вложенными маршрутами' },
        { type: 'code', language: 'jsx', value: 'import { Routes, Route, Outlet, Link } from "react-router-dom";\n\n// Layout-компонент с общей навигацией\nfunction DashboardLayout() {\n  return (\n    <div className="dashboard">\n      <nav>\n        <Link to="/dashboard">Обзор</Link>\n        <Link to="/dashboard/stats">Статистика</Link>\n        <Link to="/dashboard/settings">Настройки</Link>\n      </nav>\n      <main>\n        {/* Здесь рендерится дочерний маршрут */}\n        <Outlet />\n      </main>\n    </div>\n  );\n}\n\nfunction App() {\n  return (\n    <Routes>\n      <Route path="/" element={<Home />} />\n      {/* DashboardLayout оборачивает дочерние маршруты */}\n      <Route path="/dashboard" element={<DashboardLayout />}>\n        <Route index element={<DashboardHome />} />\n        <Route path="stats" element={<Stats />} />\n        <Route path="settings" element={<Settings />} />\n      </Route>\n    </Routes>\n  );\n}\n// index — маршрут по умолчанию (URL: /dashboard)' },
        { type: 'note', value: 'Route с index — это дочерний маршрут который совпадает с родительским URL. При переходе на /dashboard рендерится DashboardLayout + DashboardHome внутри Outlet.' }
      ]
    },
    {
      id: 6,
      title: 'Защищённые маршруты (Protected Routes)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Защищённые маршруты доступны только авторизованным пользователям. При попытке доступа неавторизованного пользователя происходит редирект на страницу входа.' },
        { type: 'heading', value: 'Реализация Protected Route' },
        { type: 'code', language: 'jsx', value: 'import { Navigate, Outlet, useLocation } from "react-router-dom";\n\n// Компонент-обёртка для защищённых маршрутов\nfunction ProtectedRoute({ isAuthenticated }) {\n  const location = useLocation();\n\n  if (!isAuthenticated) {\n    // Редирект на login с сохранением исходного пути\n    return <Navigate to="/login" state={{ from: location }} replace />;\n  }\n\n  return <Outlet />;\n}\n\nfunction App() {\n  const { isAuthenticated } = useAuth();\n\n  return (\n    <Routes>\n      <Route path="/login" element={<Login />} />\n      <Route path="/public" element={<Public />} />\n\n      {/* Все дочерние маршруты защищены */}\n      <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>\n        <Route path="/dashboard" element={<Dashboard />} />\n        <Route path="/profile" element={<Profile />} />\n      </Route>\n    </Routes>\n  );\n}\n\n// В Login — редирект обратно после входа\nfunction Login() {\n  const navigate = useNavigate();\n  const location = useLocation();\n  const from = location.state?.from?.pathname || "/";\n\n  const handleLogin = () => {\n    // ... авторизация ...\n    navigate(from, { replace: true });\n  };\n}' },
        { type: 'tip', value: 'replace: true при редиректе означает, что страница логина не попадёт в историю браузера. Пользователь не сможет нажать "Назад" и попасть на логин после успешного входа.' }
      ]
    },
    {
      id: 7,
      title: 'useLocation и передача состояния между страницами',
      type: 'theory',
      content: [
        { type: 'text', value: 'Хук useLocation возвращает объект с информацией о текущем URL. Через state можно передавать данные между страницами без URL-параметров.' },
        { type: 'code', language: 'jsx', value: 'import { useLocation, useNavigate, Link } from "react-router-dom";\n\n// Страница со списком\nfunction ProductList() {\n  const products = [{ id: 1, name: "Телефон", price: 50000 }];\n  return (\n    <ul>\n      {products.map(p => (\n        <li key={p.id}>\n          {/* Передаём данные о продукте через state */}\n          <Link to={"/product/" + p.id} state={{ product: p }}>\n            {p.name}\n          </Link>\n        </li>\n      ))}\n    </ul>\n  );\n}\n\n// Страница детализации\nfunction ProductDetail() {\n  const { state } = useLocation();\n  const { productId } = useParams();\n\n  // Используем state если пришли со списка,\n  // иначе загружаем данные по id\n  const product = state?.product;\n\n  if (!product) {\n    return <p>Загрузка продукта #{productId}...</p>;\n  }\n\n  return (\n    <div>\n      <h1>{product.name}</h1>\n      <p>Цена: {product.price} тг</p>\n    </div>\n  );\n}' },
        { type: 'note', value: 'State не сохраняется при обновлении страницы (F5)! Всегда предусматривай запасной вариант — загрузку данных по URL-параметру.' }
      ]
    },
    {
      id: 8,
      title: 'Практика: Мультистраничное SPA',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай мини-приложение "Блог" с React Router. Необходимо реализовать список постов, страницу отдельного поста и страницу 404.',
      requirements: [
        'BrowserRouter оборачивает всё приложение в main.jsx',
        'Маршрут "/" — список постов (минимум 3 поста с id, title, excerpt)',
        'Маршрут "/posts/:id" — страница поста с useParams',
        'Маршрут "*" — страница 404 с кнопкой "На главную"',
        'Навигация: Link/NavLink в шапке с подсветкой активного маршрута',
        'На странице поста: кнопка "Назад" через useNavigate(-1)'
      ],
      hint: 'Начни с данных: const posts = [{id:1, title:"...", ...}]. Для поиска поста по id используй posts.find(p => p.id === parseInt(id)). Не забудь обработать случай когда пост не найден.',
      solution: 'import { BrowserRouter, Routes, Route, Link, NavLink, useParams, useNavigate } from "react-router-dom";\n\nconst posts = [\n  { id: 1, title: "Введение в React", excerpt: "React — библиотека для UI.", body: "React создан Facebook..." },\n  { id: 2, title: "Хуки в React", excerpt: "useState и useEffect.", body: "Хуки появились в React 16.8..." },\n  { id: 3, title: "React Router", excerpt: "Маршрутизация в SPA.", body: "React Router v6..." },\n];\n\nfunction Header() {\n  return (\n    <header>\n      <NavLink to="/" end className={({isActive}) => isActive ? "active" : ""}>Блог</NavLink>\n    </header>\n  );\n}\n\nfunction PostList() {\n  return (\n    <div>\n      <h1>Все посты</h1>\n      {posts.map(p => (\n        <div key={p.id}>\n          <h2><Link to={"/posts/" + p.id}>{p.title}</Link></h2>\n          <p>{p.excerpt}</p>\n        </div>\n      ))}\n    </div>\n  );\n}\n\nfunction PostDetail() {\n  const { id } = useParams();\n  const navigate = useNavigate();\n  const post = posts.find(p => p.id === parseInt(id));\n\n  if (!post) return <NotFound />;\n\n  return (\n    <div>\n      <button onClick={() => navigate(-1)}>Назад</button>\n      <h1>{post.title}</h1>\n      <p>{post.body}</p>\n    </div>\n  );\n}\n\nfunction NotFound() {\n  const navigate = useNavigate();\n  return (\n    <div>\n      <h1>404 — Страница не найдена</h1>\n      <button onClick={() => navigate("/")}>На главную</button>\n    </div>\n  );\n}\n\nexport default function App() {\n  return (\n    <BrowserRouter>\n      <Header />\n      <Routes>\n        <Route path="/" element={<PostList />} />\n        <Route path="/posts/:id" element={<PostDetail />} />\n        <Route path="*" element={<NotFound />} />\n      </Routes>\n    </BrowserRouter>\n  );\n}',
      explanation: 'Это базовая структура любого SPA на React Router. BrowserRouter на верхнем уровне, Routes определяют маршруты, Link/NavLink для навигации, useParams для динамических сегментов.'
    }
  ]
}
