export default {
  id: 2,
  title: 'Создание проекта (Vite)',
  description: 'Создание React проекта с Vite: структура файлов, настройка, hot reload и основные npm команды',
  lessons: [
    {
      id: 1,
      title: 'Почему Vite — лучший выбор',
      type: 'theory',
      content: [
        { type: 'text', value: 'Vite — современный инструмент для разработки frontend приложений. В разы быстрее webpack и Create React App благодаря native ES modules. Холодный старт за <1 секунду вместо 10-60 секунд.' },
        { type: 'heading', value: 'Сравнение с CRA' },
        { type: 'code', language: 'jsx', value: '// Create React App (устаревший):\n// - Медленный холодный старт (30-60 сек)\n// - Медленный HMR (горячая замена)\n// - Устаревшие зависимости\n// - Сложно настраивать\n\n// Vite:\n// - Холодный старт < 1 секунды\n// - HMR мгновенный\n// - Современный стек\n// - Простая настройка через vite.config.js\n\n// Создание проекта:\n// npm create vite@latest my-app -- --template react\n// cd my-app\n// npm install\n// npm run dev' },
        { type: 'tip', value: 'npm create vite@latest или yarn create vite или pnpm create vite — все работают. Шаблоны: react (JavaScript), react-ts (TypeScript). Рекомендуем react-ts для новых проектов.' }
      ]
    },
    {
      id: 2,
      title: 'Структура проекта Vite + React',
      type: 'theory',
      content: [
        { type: 'text', value: 'После создания проекта вы увидите стандартную структуру папок. Важно понять назначение каждого файла.' },
        { type: 'heading', value: 'Файловая структура' },
        { type: 'code', language: 'jsx', value: '// my-app/\n// ├── node_modules/          — зависимости (не трогаем, не коммитим)\n// ├── public/               — статические файлы (копируются как есть)\n// │   └── vite.svg\n// ├── src/                  — ВАШ КОД\n// │   ├── assets/           — картинки, шрифты (импортируемые)\n// │   ├── App.css           — стили App\n// │   ├── App.jsx           — корневой компонент\n// │   ├── index.css         — глобальные стили\n// │   └── main.jsx          — точка входа\n// ├── .gitignore\n// ├── index.html            — единственный HTML файл\n// ├── package.json          — зависимости и команды\n// ├── package-lock.json     — зафиксированные версии\n// └── vite.config.js        — конфигурация Vite' },
        { type: 'heading', value: 'Ключевые файлы' },
        { type: 'code', language: 'jsx', value: '// index.html — точка входа для браузера\n// <div id="root"></div>\n// <script type="module" src="/src/main.jsx"></script>\n\n// src/main.jsx — точка входа JavaScript\nimport React from "react";\nimport ReactDOM from "react-dom/client";\nimport App from "./App.jsx";\nimport "./index.css"; // Глобальные стили\n\nReactDOM.createRoot(document.getElementById("root")).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>\n);\n// StrictMode — включает дополнительные проверки в разработке' }
      ]
    },
    {
      id: 3,
      title: 'npm команды и hot reload',
      type: 'theory',
      content: [
        { type: 'text', value: 'package.json содержит команды для запуска, сборки и проверки проекта. HMR (Hot Module Replacement) обновляет компоненты в браузере без перезагрузки страницы.' },
        { type: 'heading', value: 'Основные команды' },
        { type: 'code', language: 'jsx', value: '// package.json scripts:\n// {\n//   "scripts": {\n//     "dev":     "vite",           — запуск сервера разработки\n//     "build":   "vite build",     — сборка для production\n//     "preview": "vite preview",   — просмотр production сборки\n//     "lint":    "eslint ."        — проверка кода\n//   }\n// }\n\n// npm run dev      — запускает на http://localhost:5173\n// npm run build    — создаёт папку dist/\n// npm run preview  — поднимает сервер для dist/\n\n// Горячее обновление (HMR):\n// Изменяете код -> браузер обновляется автоматически\n// Состояние компонента СОХРАНЯЕТСЯ при HMR!' },
        { type: 'tip', value: 'После npm run build в папке dist/ находится готовое приложение для деплоя. Это статические файлы HTML + CSS + JS, которые можно загрузить на любой хостинг.' }
      ]
    },
    {
      id: 4,
      title: 'vite.config.js — основные настройки',
      type: 'theory',
      content: [
        { type: 'text', value: 'vite.config.js позволяет настроить сервер разработки, aliases для путей, порт и другие параметры. Большинство настроек работают без изменений.' },
        { type: 'heading', value: 'Базовая конфигурация' },
        { type: 'code', language: 'jsx', value: '// vite.config.js\nimport { defineConfig } from "vite";\nimport react from "@vitejs/plugin-react";\n\nexport default defineConfig({\n  plugins: [react()], // Поддержка JSX и Fast Refresh\n\n  // Сервер разработки\n  server: {\n    port: 3000,         // Порт (по умолчанию 5173)\n    open: true,         // Открыть браузер автоматически\n    proxy: {\n      "/api": "http://localhost:8080", // Проксировать API запросы\n    },\n  },\n\n  // Aliases для путей (как @ = src/)\n  resolve: {\n    alias: {\n      "@": "/src",\n      "@components": "/src/components",\n      "@hooks": "/src/hooks",\n    },\n  },\n});' },
        { type: 'note', value: 'Alias @ для src — распространённая конвенция. Вместо import Button from "../../components/Button" пишете import Button from "@/components/Button". Работает в любом файле без учёта вложенности.' }
      ]
    },
    {
      id: 5,
      title: 'Импорт стилей и ресурсов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Vite позволяет импортировать CSS, изображения и другие ресурсы прямо в JavaScript файлах. Это отличается от работы с браузерным JavaScript.' },
        { type: 'heading', value: 'Импорт в React с Vite' },
        { type: 'code', language: 'jsx', value: '// Импорт CSS\nimport "./App.css";         // Глобальные стили\nimport styles from "./App.module.css"; // CSS Modules\n\n// CSS Modules — локальные стили (не пересекаются)\nfunction Button() {\n  return <button className={styles.button}>Click</button>;\n  // Vite генерирует уникальный класс: "button_abc123"\n}\n\n// Импорт изображений\nimport logo from "./assets/logo.svg";\nimport photo from "./assets/photo.jpg";\n\nfunction Header() {\n  return (\n    <header>\n      <img src={logo} alt="Логотип" /> {/* URL картинки */}\n    </header>\n  );\n}\n\n// Импорт JSON\nimport data from "./data/products.json";\n// data — уже парсированный объект\n\n// URL без обработки\nimport videoUrl from "./assets/video.mp4?url";\nconst video = <video src={videoUrl} />;' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Настройка проекта',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создайте новый Vite + React проект, настройте алиасы и создайте структуру папок для реального приложения.',
      requirements: [
        'Создать проект: npm create vite@latest my-store -- --template react',
        'Добавить alias @ для src в vite.config.js',
        'Создать папки: src/components, src/pages, src/hooks, src/utils',
        'Создать компонент src/components/Button.jsx',
        'Импортировать Button в App.jsx через alias: @/components/Button',
        'Убедиться что npm run dev работает без ошибок'
      ],
      hint: 'В vite.config.js в resolve.alias добавьте "@": "/src" (с ведущим слешем). Для работы alias в IDE также обновите jsconfig.json или tsconfig.json.',
      solution: '// vite.config.js\nimport { defineConfig } from "vite";\nimport react from "@vitejs/plugin-react";\nimport path from "path";\n\nexport default defineConfig({\n  plugins: [react()],\n  resolve: {\n    alias: {\n      "@": path.resolve(__dirname, "./src"),\n    },\n  },\n});\n\n// src/components/Button.jsx\nfunction Button({ label, onClick, variant = "primary" }) {\n  const styles = {\n    primary:   { background: "#007bff", color: "white" },\n    secondary: { background: "#6c757d", color: "white" },\n    danger:    { background: "#dc3545", color: "white" },\n  };\n  return (\n    <button\n      onClick={onClick}\n      style={{ ...styles[variant], padding: "0.5rem 1rem", border: "none", borderRadius: "4px", cursor: "pointer" }}\n    >\n      {label}\n    </button>\n  );\n}\nexport default Button;\n\n// src/App.jsx\nimport Button from "@/components/Button";\n\nfunction App() {\n  return (\n    <div style={{ padding: "2rem" }}>\n      <h1>Мой магазин</h1>\n      <div style={{ display: "flex", gap: "1rem" }}>\n        <Button label="Добавить" variant="primary" onClick={() => alert("Добавлено!")} />\n        <Button label="Отмена" variant="secondary" />\n        <Button label="Удалить" variant="danger" />\n      </div>\n    </div>\n  );\n}\nexport default App;',
      explanation: 'path.resolve(__dirname, "./src") создаёт абсолютный путь к папке src. Alias @ позволяет импортировать из любой вложенности без ../../. Button принимает variant — union-подобный паттерн для стилей. Разные варианты компонента через один проп — частый React паттерн.'
    }
  ]
}
