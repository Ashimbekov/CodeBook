export default {
  id: 24,
  title: 'Next.js: SSR и SSG',
  description: 'Стратегии рендеринга в Next.js: Static Site Generation (SSG), Server-Side Rendering (SSR), Incremental Static Regeneration (ISR), кеширование fetch и Route Handlers.',
  lessons: [
    {
      id: 1,
      title: 'Стратегии рендеринга: SSG, SSR, ISR',
      type: 'theory',
      content: [
        { type: 'text', value: 'Next.js поддерживает несколько стратегий рендеринга. Выбор зависит от того как часто меняются данные и насколько важна скорость загрузки.' },
        { type: 'heading', value: 'Сравнение стратегий' },
        { type: 'code', language: 'jsx', value: '// SSG (Static Site Generation) — страница генерируется при сборке\n// Лучше для: блоги, документация, маркетинг-страницы\n// Самый быстрый — HTML готов заранее, раздаётся с CDN\n\n// SSR (Server-Side Rendering) — страница генерируется на каждый запрос\n// Лучше для: дашборды с персональными данными, корзина, авторизация\n// Всегда актуальные данные, но каждый запрос к серверу\n\n// ISR (Incremental Static Regeneration) — SSG + периодическое обновление\n// Лучше для: новостные сайты, каталоги с редкими обновлениями\n// Быстро как SSG + актуальность как SSR\n\n// CSR (Client-Side Rendering) — рендер в браузере (как обычный React)\n// Лучше для: личный кабинет после авторизации, сложный интерактивный UI' },
        { type: 'tip', value: 'В App Router стратегия задаётся через опции fetch(). Нет лишних конфигов — один API для всего.' }
      ]
    },
    {
      id: 2,
      title: 'SSG: статическая генерация',
      type: 'theory',
      content: [
        { type: 'text', value: 'По умолчанию все страницы в App Router статически генерируются если нет динамических данных. Используй cache: "force-cache" явно или просто не указывай опции.' },
        { type: 'code', language: 'jsx', value: '// app/blog/page.jsx — статически генерируется при сборке\nexport default async function BlogPage() {\n  // cache: "force-cache" — кешируем бессрочно (SSG-поведение)\n  const posts = await fetch("https://api.example.com/posts", {\n    cache: "force-cache", // По умолчанию в серверных компонентах\n  }).then(r => r.json());\n\n  return (\n    <ul>\n      {posts.map(post => (\n        <li key={post.id}>\n          <a href={"/blog/" + post.slug}>{post.title}</a>\n        </li>\n      ))}\n    </ul>\n  );\n}\n\n// app/blog/[slug]/page.jsx — статические страницы для каждого поста\nexport async function generateStaticParams() {\n  // При сборке: Next.js вызывает эту функцию\n  // и генерирует HTML для каждого slug\n  const posts = await fetch("https://api.example.com/posts").then(r => r.json());\n  return posts.map(post => ({ slug: post.slug }));\n  // Результат: /blog/react-intro, /blog/nextjs-guide, etc.\n}\n\nexport default async function BlogPost({ params }) {\n  const post = await fetch(\n    "https://api.example.com/posts/" + params.slug,\n    { cache: "force-cache" }\n  ).then(r => r.json());\n  return <article><h1>{post.title}</h1><p>{post.content}</p></article>;\n}' }
      ]
    },
    {
      id: 3,
      title: 'SSR: рендер на каждый запрос',
      type: 'theory',
      content: [
        { type: 'text', value: 'SSR активируется через cache: "no-store" в fetch или использование динамических функций (headers(), cookies(), searchParams).' },
        { type: 'code', language: 'jsx', value: 'import { cookies, headers } from "next/headers";\n\n// app/dashboard/page.jsx — рендерится на каждый запрос\nexport default async function DashboardPage() {\n  // cache: "no-store" = SSR, данные не кешируются\n  const stats = await fetch("https://api.example.com/stats", {\n    cache: "no-store",\n  }).then(r => r.json());\n\n  return <div>Продажи сегодня: {stats.sales}</div>;\n}\n\n// Использование cookies автоматически делает страницу динамической (SSR)\nexport default async function ProfilePage() {\n  const cookieStore = cookies();\n  const token = cookieStore.get("auth_token")?.value;\n\n  if (!token) {\n    redirect("/login");\n  }\n\n  const user = await fetchUserProfile(token);\n  return <div>Добро пожаловать, {user.name}!</div>;\n}\n\n// Явное указание динамического рендеринга\nexport const dynamic = "force-dynamic"; // Всегда SSR\n// export const dynamic = "force-static"; // Всегда SSG\n// export const dynamic = "auto"; // Next.js решает (по умолчанию)' },
        { type: 'note', value: 'Любое использование headers(), cookies() или searchParams (в page) автоматически переключает страницу в динамический режим (SSR). Это называется "динамические функции".' }
      ]
    },
    {
      id: 4,
      title: 'ISR: Incremental Static Regeneration',
      type: 'theory',
      content: [
        { type: 'text', value: 'ISR — компромисс между SSG и SSR. Страницы статически генерируются и обновляются в фоне через заданный интервал. Пользователь всегда получает быстрый ответ.' },
        { type: 'code', language: 'jsx', value: '// app/news/page.jsx — ISR с обновлением каждые 60 секунд\nexport const revalidate = 60; // Секунды до следующего обновления\n\nexport default async function NewsPage() {\n  const news = await fetch("https://api.example.com/news", {\n    next: { revalidate: 60 }, // Или указываем в fetch\n  }).then(r => r.json());\n\n  return (\n    <div>\n      <h1>Последние новости</h1>\n      {news.map(item => <article key={item.id}>{item.title}</article>)}\n    </div>\n  );\n}\n\n// On-demand revalidation — ручное обновление через API\n// app/api/revalidate/route.js\nimport { revalidatePath, revalidateTag } from "next/cache";\nimport { NextResponse } from "next/server";\n\nexport async function POST(request) {\n  const { path, secret } = await request.json();\n\n  if (secret !== process.env.REVALIDATE_SECRET) {\n    return NextResponse.json({ error: "Неверный секрет" }, { status: 401 });\n  }\n\n  revalidatePath(path); // Обновляем конкретный путь\n  // revalidateTag("posts"); // Или по тегу\n\n  return NextResponse.json({ revalidated: true });\n}\n\n// Тегирование запросов для on-demand revalidation\nconst posts = await fetch("/api/posts", {\n  next: { tags: ["posts"] }\n});' }
      ]
    },
    {
      id: 5,
      title: 'Route Handlers: API в Next.js',
      type: 'theory',
      content: [
        { type: 'text', value: 'Route Handlers заменяют Express/Fastify для создания API endpoint-ов прямо в Next.js. Файл route.js в папке app экспортирует функции GET, POST, PUT, DELETE.' },
        { type: 'code', language: 'jsx', value: '// app/api/users/route.js\nimport { NextResponse } from "next/server";\n\nconst users = [{ id: 1, name: "Алия" }, { id: 2, name: "Нурлан" }];\n\n// GET /api/users\nexport async function GET(request) {\n  const { searchParams } = new URL(request.url);\n  const search = searchParams.get("search");\n\n  const filtered = search\n    ? users.filter(u => u.name.includes(search))\n    : users;\n\n  return NextResponse.json(filtered);\n}\n\n// POST /api/users\nexport async function POST(request) {\n  const body = await request.json();\n\n  const newUser = { id: Date.now(), ...body };\n  users.push(newUser);\n\n  return NextResponse.json(newUser, { status: 201 });\n}\n\n// app/api/users/[id]/route.js\nexport async function GET(request, { params }) {\n  const user = users.find(u => u.id === parseInt(params.id));\n  if (!user) {\n    return NextResponse.json({ error: "Не найден" }, { status: 404 });\n  }\n  return NextResponse.json(user);\n}\n\nexport async function DELETE(request, { params }) {\n  const idx = users.findIndex(u => u.id === parseInt(params.id));\n  if (idx === -1) {\n    return NextResponse.json({ error: "Не найден" }, { status: 404 });\n  }\n  users.splice(idx, 1);\n  return new Response(null, { status: 204 });\n}' }
      ]
    },
    {
      id: 6,
      title: 'Server Actions: мутации без API',
      type: 'theory',
      content: [
        { type: 'text', value: 'Server Actions позволяют вызывать серверные функции прямо из клиентских компонентов. Это альтернатива Route Handlers для форм и мутаций.' },
        { type: 'code', language: 'jsx', value: '// app/actions.js\n"use server"; // Все функции в этом файле — серверные\n\nimport { revalidatePath } from "next/cache";\nimport { redirect } from "next/navigation";\n\nexport async function createPost(formData) {\n  const title = formData.get("title");\n  const content = formData.get("content");\n\n  // Валидация\n  if (!title || !content) {\n    return { error: "Заполните все поля" };\n  }\n\n  // Сохранение в БД (например, через Prisma)\n  await db.post.create({ data: { title, content } });\n\n  // Обновляем кеш страницы с постами\n  revalidatePath("/blog");\n\n  // Редирект\n  redirect("/blog");\n}\n\n// app/blog/new/page.jsx (клиентский компонент)\n"use client";\nimport { createPost } from "../actions";\nimport { useFormState } from "react-dom";\n\nexport default function NewPostPage() {\n  const [state, formAction] = useFormState(createPost, null);\n\n  return (\n    <form action={formAction}>\n      {state?.error && <p style={{color: "red"}}>{state.error}</p>}\n      <input name="title" placeholder="Заголовок" required />\n      <textarea name="content" placeholder="Содержание" required />\n      <button type="submit">Опубликовать</button>\n    </form>\n  );\n}' },
        { type: 'tip', value: 'Server Actions работают даже без JavaScript на клиенте (progressive enhancement). Форма работает как обычная HTML-форма с серверной обработкой.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: блог с ISR и динамическими маршрутами',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай блог на Next.js с ISR. Список постов обновляется каждые 30 секунд. Каждый пост имеет динамическую страницу с SEO-метаданными.',
      requirements: [
        'app/blog/page.jsx: ISR (revalidate: 30), загрузка с JSONPlaceholder /posts?_limit=5',
        'app/blog/[id]/page.jsx: загрузка одного поста, generateStaticParams для id 1-5',
        'Динамические метаданные через generateMetadata по id поста',
        'Навигация: Link на каждый пост в списке, кнопка "Назад" в Link',
        'Компонент PostCard для отображения карточки поста',
        'Обработка 404 через notFound() если пост не найден'
      ],
      hint: 'import { notFound } from "next/navigation" — вызови notFound() если пост не найден (post === null или res.status === 404). generateStaticParams возвращает [{ id: "1" }, { id: "2" }, ...] — id всегда строка!',
      expectedOutput: 'Список постов загружается через getStaticProps с revalidate: 30\nСтраница /blog/[slug] генерируется через getStaticPaths\nISR: страница обновляется в фоне каждые 30 секунд\nDynamic import для компонента комментариев\nfallback: "blocking" для новых постов',
      solution: '// app/blog/page.jsx\nexport const revalidate = 30;\n\nexport default async function BlogPage() {\n  const posts = await fetch(\n    "https://jsonplaceholder.typicode.com/posts?_limit=5",\n    { next: { revalidate: 30 } }\n  ).then(r => r.json());\n\n  return (\n    <div>\n      <h1>Блог</h1>\n      {posts.map(post => (\n        <div key={post.id} style={{ border: "1px solid #eee", padding: "1rem", marginBottom: "1rem" }}>\n          <h2>{post.title}</h2>\n          <p>{post.body.slice(0, 100)}...</p>\n          <a href={"/blog/" + post.id}>Читать далее</a>\n        </div>\n      ))}\n    </div>\n  );\n}\n\n// app/blog/[id]/page.jsx\nimport { notFound } from "next/navigation";\nimport Link from "next/link";\n\nexport async function generateStaticParams() {\n  return [1, 2, 3, 4, 5].map(id => ({ id: String(id) }));\n}\n\nexport async function generateMetadata({ params }) {\n  const post = await fetch(\n    "https://jsonplaceholder.typicode.com/posts/" + params.id\n  ).then(r => r.json());\n  if (!post.id) return { title: "Пост не найден" };\n  return { title: post.title, description: post.body.slice(0, 150) };\n}\n\nexport default async function PostPage({ params }) {\n  const res = await fetch(\n    "https://jsonplaceholder.typicode.com/posts/" + params.id\n  );\n  if (!res.ok) notFound();\n  const post = await res.json();\n\n  return (\n    <article>\n      <Link href="/blog">Назад к списку</Link>\n      <h1>{post.title}</h1>\n      <p>{post.body}</p>\n      <small>Пост #{post.id} от автора {post.userId}</small>\n    </article>\n  );\n}',
      explanation: 'ISR (revalidate: 30) означает: страница генерируется статически при первом запросе и обновляется в фоне каждые 30 секунд. generateStaticParams предварительно создаёт страницы для id 1-5 при сборке.'
    }
  ]
}
