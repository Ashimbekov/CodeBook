export default {
  id: 23,
  title: 'Next.js: основы',
  description: 'Введение в Next.js: файловая маршрутизация App Router, серверные и клиентские компоненты, layout, metadata, навигация и создание первого проекта.',
  lessons: [
    {
      id: 1,
      title: 'Что такое Next.js и зачем он нужен',
      type: 'theory',
      content: [
        { type: 'text', value: 'Next.js — React-фреймворк от Vercel для production-приложений. Добавляет SSR, SSG, файловую маршрутизацию, оптимизацию изображений и многое другое прямо из коробки.' },
        { type: 'heading', value: 'Создание проекта' },
        { type: 'code', language: 'jsx', value: '// Создание нового проекта\n// npx create-next-app@latest my-app\n// Выбери: TypeScript? No, ESLint? Yes, Tailwind? Yes, App Router? Yes\n\n// Структура проекта с App Router:\n// my-app/\n// ├── app/                 <- Все маршруты здесь\n// │   ├── layout.jsx       <- Корневой layout\n// │   ├── page.jsx         <- Главная страница (/)\n// │   ├── about/\n// │   │   └── page.jsx     <- Страница /about\n// │   └── blog/\n// │       ├── page.jsx     <- Страница /blog\n// │       └── [slug]/\n// │           └── page.jsx <- Страница /blog/:slug\n// ├── public/              <- Статические файлы\n// ├── components/          <- Переиспользуемые компоненты\n// └── next.config.mjs      <- Конфигурация\n\n// Запуск:\n// npm run dev    <- Разработка (http://localhost:3000)\n// npm run build  <- Сборка для production\n// npm run start  <- Запуск production-сборки' },
        { type: 'list', value: ['App Router (Next.js 13+) — современный подход с серверными компонентами', 'Файловая маршрутизация — структура папок = URL-адреса', 'Серверные компоненты — рендер на сервере по умолчанию', 'Встроенная оптимизация: изображения, шрифты, скрипты'] }
      ]
    },
    {
      id: 2,
      title: 'Серверные и клиентские компоненты',
      type: 'theory',
      content: [
        { type: 'text', value: 'Ключевое отличие Next.js App Router: компоненты по умолчанию — серверные (Server Components). Они рендерятся на сервере и не попадают в клиентский bundle. Для интерактивности нужна директива "use client".' },
        { type: 'heading', value: 'Server vs Client компоненты' },
        { type: 'code', language: 'jsx', value: '// app/page.jsx — серверный компонент (по умолчанию)\n// Может быть async! Нет useState, useEffect, обработчиков событий\nexport default async function HomePage() {\n  // Прямой запрос к БД или API на сервере\n  const posts = await fetch("https://api.example.com/posts").then(r => r.json());\n\n  return (\n    <main>\n      <h1>Блог</h1>\n      <PostList posts={posts} />\n      {/* LikeButton нужна интерактивность */}\n      <LikeButton /> {/* Клиентский компонент */}\n    </main>\n  );\n}\n\n// components/LikeButton.jsx\n"use client"; // Директива в начале файла!\n\nimport { useState } from "react";\n\nexport default function LikeButton() {\n  const [liked, setLiked] = useState(false);\n\n  return (\n    <button onClick={() => setLiked(!liked)}>\n      {liked ? "Liked!" : "Like"}\n    </button>\n  );\n}' },
        { type: 'tip', value: 'Правило: используй серверный компонент там где нет интерактивности. "use client" добавляй только компонентам которые используют useState, useEffect, события браузера, Web API.' }
      ]
    },
    {
      id: 3,
      title: 'Файловая маршрутизация: conventions',
      type: 'theory',
      content: [
        { type: 'text', value: 'Next.js App Router использует специальные имена файлов для разных целей. page.jsx — страница, layout.jsx — обёртка, loading.jsx — загрузка, error.jsx — ошибки.' },
        { type: 'code', language: 'jsx', value: '// Специальные файлы в папке маршрута:\n\n// app/dashboard/\n// ├── page.jsx       <- Содержимое страницы /dashboard\n// ├── layout.jsx     <- Обёртка для /dashboard и всех дочерних маршрутов\n// ├── loading.jsx    <- Показывается пока page.jsx загружается (Suspense)\n// ├── error.jsx      <- Показывается при ошибке (Error Boundary)\n// └── not-found.jsx  <- Страница 404 для этого маршрута\n\n// app/dashboard/layout.jsx\nexport default function DashboardLayout({ children }) {\n  return (\n    <div className="dashboard">\n      <aside>\n        <nav>\n          <a href="/dashboard">Обзор</a>\n          <a href="/dashboard/users">Пользователи</a>\n          <a href="/dashboard/settings">Настройки</a>\n        </nav>\n      </aside>\n      <main>{children}</main>\n    </div>\n  );\n}\n\n// app/dashboard/loading.jsx\nexport default function Loading() {\n  return <div>Загрузка дашборда...</div>;\n}\n\n// app/dashboard/error.jsx\n"use client";\nexport default function Error({ error, reset }) {\n  return (\n    <div>\n      <p>Ошибка: {error.message}</p>\n      <button onClick={reset}>Повторить</button>\n    </div>\n  );\n}' }
      ]
    },
    {
      id: 4,
      title: 'Layout и корневой макет',
      type: 'theory',
      content: [
        { type: 'text', value: 'Корневой layout (app/layout.jsx) обязателен — он содержит html и body теги. Вложенные layout добавляют структуру к конкретным секциям.' },
        { type: 'code', language: 'jsx', value: '// app/layout.jsx — корневой layout (обязателен!)\nimport "./globals.css";\n\nexport const metadata = {\n  title: { template: "%s | Мой Блог", default: "Мой Блог" },\n  description: "Лучший блог о разработке",\n};\n\nexport default function RootLayout({ children }) {\n  return (\n    <html lang="ru">\n      <body>\n        <header>\n          <nav>\n            <a href="/">Главная</a>\n            <a href="/blog">Блог</a>\n            <a href="/about">О нас</a>\n          </nav>\n        </header>\n        <main>{children}</main>\n        <footer>© 2024 Мой Блог</footer>\n      </body>\n    </html>\n  );\n}\n\n// app/blog/layout.jsx — вложенный layout только для /blog/*\nexport default function BlogLayout({ children }) {\n  return (\n    <div>\n      <aside>Категории блога...</aside>\n      <section>{children}</section>\n    </div>\n  );\n}' },
        { type: 'note', value: 'Layout сохраняет состояние при навигации между страницами одного уровня. Это оптимизация: не нужно пересоздавать шапку/меню при каждом переходе.' }
      ]
    },
    {
      id: 5,
      title: 'Динамические маршруты и параметры',
      type: 'theory',
      content: [
        { type: 'text', value: 'Динамические сегменты обозначаются квадратными скобками в имени папки: [slug], [id]. Параметры доступны через пропс params.' },
        { type: 'code', language: 'jsx', value: '// app/blog/[slug]/page.jsx\n// Отвечает на URL: /blog/my-first-post, /blog/react-tutorial\n\nexport default async function BlogPost({ params }) {\n  const { slug } = params;\n\n  // Загружаем данные поста\n  const post = await fetch("https://api.example.com/posts/" + slug, {\n    next: { revalidate: 3600 }, // Кеш 1 час\n  }).then(r => r.json());\n\n  return (\n    <article>\n      <h1>{post.title}</h1>\n      <p>{post.content}</p>\n    </article>\n  );\n}\n\n// generateStaticParams: список статических страниц для SSG\nexport async function generateStaticParams() {\n  const posts = await fetch("https://api.example.com/posts").then(r => r.json());\n  return posts.map(post => ({ slug: post.slug }));\n}\n\n// Динамические метаданные\nexport async function generateMetadata({ params }) {\n  const post = await fetch("https://api.example.com/posts/" + params.slug).then(r => r.json());\n  return {\n    title: post.title,\n    description: post.excerpt,\n  };\n}' }
      ]
    },
    {
      id: 6,
      title: 'Link, useRouter и usePathname',
      type: 'theory',
      content: [
        { type: 'text', value: 'В Next.js используй компонент Link из next/link для навигации. Для программной навигации и информации о маршруте — хуки из next/navigation (только в Client Components).' },
        { type: 'code', language: 'jsx', value: 'import Link from "next/link";\nimport Image from "next/image";\n\n// Серверный компонент — Link работает\nexport default function Navbar() {\n  return (\n    <nav>\n      <Link href="/">Главная</Link>\n      <Link href="/about">О нас</Link>\n      {/* prefetch по умолчанию true — предзагружает страницу */}\n      <Link href="/blog" prefetch={false}>Блог</Link>\n    </nav>\n  );\n}\n\n// Клиентский компонент — хуки навигации\n"use client";\nimport { useRouter, usePathname, useSearchParams } from "next/navigation";\n\nexport default function NavigationClient() {\n  const router = useRouter();\n  const pathname = usePathname(); // Текущий путь\n  const searchParams = useSearchParams();\n\n  return (\n    <div>\n      <p>Текущий путь: {pathname}</p>\n      <button onClick={() => router.push("/dashboard")}>Дашборд</button>\n      <button onClick={() => router.back()}>Назад</button>\n      <button onClick={() => router.refresh()}>Обновить</button>\n    </div>\n  );\n}' },
        { type: 'tip', value: 'next/image автоматически оптимизирует изображения: изменяет размер, конвертирует в WebP, применяет lazy loading. Используй вместо обычного <img>.' }
      ]
    },
    {
      id: 7,
      title: 'Metadata API: SEO без усилий',
      type: 'theory',
      content: [
        { type: 'text', value: 'Next.js имеет встроенный Metadata API для управления тегами <head>. Экспортируй объект metadata или функцию generateMetadata из любого layout/page.' },
        { type: 'code', language: 'jsx', value: '// app/blog/page.jsx — статические метаданные\nexport const metadata = {\n  title: "Блог",\n  description: "Статьи о React и Next.js",\n  openGraph: {\n    title: "Блог о разработке",\n    description: "Статьи о React и Next.js",\n    images: [{ url: "https://example.com/og-image.jpg" }],\n  },\n  twitter: {\n    card: "summary_large_image",\n    title: "Блог о разработке",\n  },\n};\n\n// app/blog/[slug]/page.jsx — динамические метаданные\nexport async function generateMetadata({ params, searchParams }) {\n  const post = await getPost(params.slug);\n\n  if (!post) {\n    return { title: "Пост не найден" };\n  }\n\n  return {\n    title: post.title, // В корневом layout: "{post.title} | Мой Блог"\n    description: post.excerpt,\n    openGraph: {\n      title: post.title,\n      description: post.excerpt,\n      type: "article",\n      publishedTime: post.createdAt,\n      images: [{ url: post.coverImage }],\n    },\n    robots: {\n      index: true,\n      follow: true,\n    },\n  };\n}' }
      ]
    },
    {
      id: 8,
      title: 'Практика: Landing Page на Next.js',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай лендинг-страницу для IT-курсов на Next.js. Включи корневой layout с навигацией, главную страницу и страницу "О курсе".',
      requirements: [
        'Создай проект: npx create-next-app@latest курс-лендинг',
        'app/layout.jsx: html, body, Header с Link на / и /about, Footer',
        'app/page.jsx: Hero секция (заголовок, описание, кнопка-Link), список из 3 карточек курсов',
        'app/about/page.jsx: информация о курсе, экспорт metadata с title "О курсе"',
        'Компонент CourseCard в components/ — серверный компонент',
        'Кнопка "Записаться" с alert — клиентский компонент (use client)',
        'Стилизация: CSS Modules или Tailwind'
      ],
      hint: 'Начни с layout.jsx — это скелет приложения. CourseCard — серверный компонент (нет интерактивности). Кнопка с onClick — отдельный клиентский компонент EnrollButton.jsx с "use client".',
      solution: '// app/layout.jsx\nimport Link from "next/link";\nimport "./globals.css";\n\nexport const metadata = { title: "IT Курсы", description: "Лучшие IT курсы" };\n\nexport default function RootLayout({ children }) {\n  return (\n    <html lang="ru">\n      <body>\n        <header style={{ padding: "1rem", borderBottom: "1px solid #eee", display: "flex", gap: "1rem" }}>\n          <Link href="/">Главная</Link>\n          <Link href="/about">О курсе</Link>\n        </header>\n        <main style={{ padding: "2rem" }}>{children}</main>\n        <footer style={{ textAlign: "center", padding: "1rem", borderTop: "1px solid #eee" }}>© 2024</footer>\n      </body>\n    </html>\n  );\n}\n\n// components/EnrollButton.jsx\n"use client";\nexport default function EnrollButton({ courseName }) {\n  return (\n    <button onClick={() => alert("Записан на: " + courseName)}\n      style={{ background: "#2563eb", color: "white", padding: "8px 16px", borderRadius: "6px", border: "none", cursor: "pointer" }}>\n      Записаться\n    </button>\n  );\n}\n\n// components/CourseCard.jsx (серверный)\nimport EnrollButton from "./EnrollButton";\nexport default function CourseCard({ title, description, price }) {\n  return (\n    <div style={{ border: "1px solid #e5e7eb", borderRadius: "8px", padding: "1rem" }}>\n      <h3>{title}</h3>\n      <p>{description}</p>\n      <p style={{ fontWeight: "bold" }}>{price} тг</p>\n      <EnrollButton courseName={title} />\n    </div>\n  );\n}\n\n// app/page.jsx\nimport CourseCard from "../components/CourseCard";\nconst courses = [\n  { id: 1, title: "React Разработка", description: "Полный курс React", price: "45000" },\n  { id: 2, title: "Next.js", description: "Fullstack с Next.js", price: "60000" },\n  { id: 3, title: "TypeScript", description: "TS для React разработчиков", price: "35000" },\n];\nexport default function HomePage() {\n  return (\n    <div>\n      <section style={{ textAlign: "center", marginBottom: "3rem" }}>\n        <h1 style={{ fontSize: "2.5rem" }}>IT Курсы для профессионалов</h1>\n        <p>Освой React, Next.js и TypeScript с нуля до специалиста</p>\n      </section>\n      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>\n        {courses.map(c => <CourseCard key={c.id} {...c} />)}\n      </div>\n    </div>\n  );\n}\n\n// app/about/page.jsx\nexport const metadata = { title: "О курсе" };\nexport default function AboutPage() {\n  return (\n    <div>\n      <h1>О наших курсах</h1>\n      <p>Мы обучаем разработчиков с 2020 года. Более 5000 выпускников.</p>\n    </div>\n  );\n}',
      explanation: 'Next.js разделяет серверные и клиентские компоненты. CourseCard — серверный (загрузка данных), EnrollButton — клиентский (интерактивность). Layout задаёт общую структуру без повторного кода.'
    }
  ]
}
