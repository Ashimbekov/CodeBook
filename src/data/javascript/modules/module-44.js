export default {
  id: 44,
  title: 'Webpack и Vite',
  description: 'Сборка проектов: Webpack (entry/output/loaders/plugins/HMR) и Vite (быстрый дев-сервер, rollup, конфигурация)',
  lessons: [
    {
      id: 1,
      title: 'Зачем нужны сборщики',
      type: 'theory',
      content: [
        { type: 'text', value: 'Сборщики (bundlers) объединяют модули JavaScript, CSS, изображения в оптимизированные файлы для браузера. Решают проблемы: модульность, оптимизация, трансформации (TypeScript, JSX, Sass).' },
        { type: 'heading', value: 'Сравнение Webpack и Vite' },
        { type: 'code', language: 'javascript', value: '// Webpack — классический сборщик (2012)\n// + Гибкий, огромная экосистема\n// + Мощная оптимизация для production\n// - Медленный холодный старт\n// - Сложная конфигурация\n\n// Vite — современный сборщик (2020)\n// + Мгновенный старт (использует ES modules напрямую)\n// + HMR за ~50ms (Webpack ~2s)\n// + Минимальная конфигурация\n// + Использует Rollup для production\n// - Меньше плагинов (но достаточно для большинства задач)\n\n// Как работает Vite в development:\n// Браузер запрашивает файл -> Vite трансформирует -> отдаёт\n// НЕ нужно пересобирать всё при изменении файла!\n\n// Как работает Webpack:\n// Строит граф зависимостей -> собирает bundle -> отдаёт браузеру\n// При изменении — пересобирает (медленно для больших проектов)\n\n// Выбор:\n// Vite — для новых проектов React/Vue/Svelte\n// Webpack — для больших enterprise проектов\n//           или если нужны специфические плагины' }
      ]
    },
    {
      id: 2,
      title: 'Webpack — entry и output',
      type: 'theory',
      content: [
        { type: 'text', value: 'Webpack строит граф зависимостей от точки входа (entry) и создаёт итоговые файлы (output). Конфигурация в webpack.config.js.' },
        { type: 'heading', value: 'Базовая конфигурация Webpack' },
        { type: 'code', language: 'javascript', value: '// npm install --save-dev webpack webpack-cli\n\n// webpack.config.js\nconst path = require("path");\nconst HtmlWebpackPlugin = require("html-webpack-plugin");\n\nmodule.exports = {\n  // Режим: development или production\n  mode: process.env.NODE_ENV || "development",\n\n  // ENTRY — точка входа\n  entry: "./src/index.js",\n  // Несколько точек входа:\n  // entry: {\n  //   main: "./src/index.js",\n  //   admin: "./src/admin.js"\n  // },\n\n  // OUTPUT — куда складывать результат\n  output: {\n    path: path.resolve(__dirname, "dist"),\n    filename: "[name].[contenthash].js", // Хэш для кэширования\n    clean: true,                          // Очищать dist перед сборкой\n    publicPath: "/",\n  },\n\n  // Source maps для отладки\n  devtool: process.env.NODE_ENV === "production"\n    ? "source-map"\n    : "eval-source-map",\n\n  // Resolve — как webpack ищет модули\n  resolve: {\n    extensions: [".js", ".jsx", ".ts", ".tsx"],\n    alias: {\n      "@": path.resolve(__dirname, "src"),\n      "@components": path.resolve(__dirname, "src/components")\n    }\n  }\n};\n\n// package.json scripts:\n// "build": "webpack --mode production"\n// "dev": "webpack serve --mode development"' }
      ]
    },
    {
      id: 3,
      title: 'Webpack loaders',
      type: 'theory',
      content: [
        { type: 'text', value: 'Loaders трансформируют файлы при импорте. Webpack по умолчанию понимает только JS/JSON. Loaders добавляют поддержку CSS, TypeScript, изображений, SVG и других форматов.' },
        { type: 'heading', value: 'Настройка loaders' },
        { type: 'code', language: 'javascript', value: '// npm install --save-dev babel-loader @babel/core @babel/preset-env\n// npm install --save-dev css-loader style-loader\n// npm install --save-dev ts-loader typescript\n\nmodule.exports = {\n  module: {\n    rules: [\n      // Babel — трансформация JS/JSX\n      {\n        test: /\\.(js|jsx)$/,      // К каким файлам применять\n        exclude: /node_modules/,  // Исключить\n        use: {\n          loader: "babel-loader",\n          options: { presets: ["@babel/preset-env", "@babel/preset-react"] }\n        }\n      },\n\n      // TypeScript\n      {\n        test: /\\.tsx?$/,\n        use: "ts-loader",\n        exclude: /node_modules/\n      },\n\n      // CSS\n      {\n        test: /\\.css$/,\n        use: ["style-loader", "css-loader"] // Порядок: справа налево!\n      },\n      // CSS Modules\n      {\n        test: /\\.module\\.css$/,\n        use: [\"style-loader\", { loader: \"css-loader\", options: { modules: true } }]\n      },\n      // Sass\n      {\n        test: /\\.s[ac]ss$/,\n        use: ["style-loader", "css-loader", "sass-loader"]\n      },\n\n      // Изображения\n      {\n        test: /\\.(png|jpg|gif|svg|webp)$/,\n        type: "asset/resource", // Webpack 5 встроенный\n        generator: { filename: "images/[hash][ext][query]" }\n      },\n\n      // Шрифты\n      {\n        test: /\\.(woff|woff2|eot|ttf|otf)$/,\n        type: "asset/resource"\n      }\n    ]\n  }\n};' }
      ]
    },
    {
      id: 4,
      title: 'Webpack plugins и HMR',
      type: 'theory',
      content: [
        { type: 'text', value: 'Плагины выполняют задачи на уровне всего bundle: генерация HTML, извлечение CSS, оптимизация, копирование файлов. HMR (Hot Module Replacement) — обновление без перезагрузки страницы.' },
        { type: 'heading', value: 'Плагины и Dev Server' },
        { type: 'code', language: 'javascript', value: '// npm install --save-dev html-webpack-plugin mini-css-extract-plugin\n// npm install --save-dev webpack-dev-server copy-webpack-plugin\n\nconst HtmlWebpackPlugin = require("html-webpack-plugin");\nconst MiniCssExtractPlugin = require("mini-css-extract-plugin");\nconst CopyPlugin = require("copy-webpack-plugin");\nconst { DefinePlugin } = require("webpack");\n\nmodule.exports = {\n  plugins: [\n    // Генерация index.html с подключёнными скриптами\n    new HtmlWebpackPlugin({\n      template: "./public/index.html",\n      title: "My App",\n      favicon: "./public/favicon.ico"\n    }),\n\n    // Извлечение CSS в отдельный файл (для production)\n    new MiniCssExtractPlugin({\n      filename: "[name].[contenthash].css"\n    }),\n\n    // Переменные окружения\n    new DefinePlugin({\n      "process.env.API_URL": JSON.stringify(process.env.API_URL)\n    }),\n\n    // Копирование файлов\n    new CopyPlugin({\n      patterns: [{ from: "public", to: ".", globOptions: { ignore: ["**/index.html"] } }]\n    })\n  ],\n\n  // Dev Server с HMR\n  devServer: {\n    static: "./dist",\n    port: 3000,\n    open: true,   // Открыть браузер\n    hot: true,    // HMR — обновление без перезагрузки\n    historyApiFallback: true, // Для SPA с react-router\n    proxy: {\n      "/api": "http://localhost:8080" // Проксирование API\n    }\n  },\n\n  // Оптимизация для production\n  optimization: {\n    splitChunks: {\n      chunks: "all" // Code splitting — вендоры в отдельный чанк\n    },\n    runtimeChunk: "single"\n  }\n};' }
      ]
    },
    {
      id: 5,
      title: 'Vite — конфигурация',
      type: 'theory',
      content: [
        { type: 'text', value: 'Vite требует минимальной конфигурации. Из коробки поддерживает TypeScript, JSX, CSS Modules, assets. Конфигурация в vite.config.js/ts.' },
        { type: 'heading', value: 'Vite конфигурация' },
        { type: 'code', language: 'javascript', value: '// npm create vite@latest my-app -- --template react\n// npm install\n// npm run dev\n\n// vite.config.js\nimport { defineConfig } from "vite";\nimport react from "@vitejs/plugin-react";\nimport path from "path";\n\nexport default defineConfig({\n  plugins: [react()], // Или vue(), svelte()\n\n  // Алиасы\n  resolve: {\n    alias: {\n      "@": path.resolve(__dirname, "./src"),\n    }\n  },\n\n  // Dev сервер\n  server: {\n    port: 3000,\n    open: true,\n    proxy: {\n      "/api": {\n        target: "http://localhost:8080",\n        changeOrigin: true,\n        rewrite: (path) => path.replace(/^\\/api/, "")\n      }\n    }\n  },\n\n  // Production сборка\n  build: {\n    outDir: "dist",\n    sourcemap: true,\n    rollupOptions: {\n      output: {\n        manualChunks: {\n          vendor: ["react", "react-dom"],  // Вендоры отдельно\n          router: ["react-router-dom"]\n        }\n      }\n    },\n    chunkSizeWarningLimit: 1000\n  },\n\n  // Переменные окружения\n  // .env файлы: .env, .env.development, .env.production\n  // Переменные с VITE_ доступны в коде:\n  // import.meta.env.VITE_API_URL\n  define: {\n    __APP_VERSION__: JSON.stringify(process.env.npm_package_version)\n  }\n});\n\n// Структура Vite проекта:\n// src/\n//   main.jsx  — точка входа\n//   App.jsx\n// public/    — статика (копируется в dist без обработки)\n// index.html — шаблон (в корне, не в public!)' },
        { type: 'tip', value: 'В Vite переменные окружения должны начинаться с VITE_: VITE_API_URL=http://api.com. Доступны через import.meta.env.VITE_API_URL. Переменные без VITE_ не попадают в клиентский код.' }
      ]
    },
    {
      id: 6,
      title: 'Code Splitting и оптимизация',
      type: 'theory',
      content: [
        { type: 'text', value: 'Code splitting разделяет bundle на части, загружаемые по требованию. Уменьшает начальный размер, ускоряет загрузку. Работает через динамический import().' },
        { type: 'heading', value: 'Динамические импорты' },
        { type: 'code', language: 'javascript', value: '// Динамический импорт — оба сборщика поддерживают\nconst loadModule = async () => {\n  const { default: HeavyComponent } = await import("./HeavyComponent.js");\n  return HeavyComponent;\n};\n\n// React.lazy для компонентов\nimport { lazy, Suspense } from "react";\n\nconst AdminPanel = lazy(() => import("./AdminPanel"));\nconst UserProfile = lazy(() => import("./UserProfile"));\n\nfunction App() {\n  return (\n    <Suspense fallback={<div>Загрузка...</div>}>\n      <AdminPanel />\n    </Suspense>\n  );\n}\n\n// Анализ bundle\n// Webpack: npm install --save-dev webpack-bundle-analyzer\nconst BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;\n// plugins: [new BundleAnalyzerPlugin()]\n\n// Vite: vite-bundle-visualizer\n// npx vite-bundle-visualizer\n\n// Tree shaking — удаление неиспользуемого кода\n// Работает с ES modules (import/export)\n// НЕ работает с CommonJS (require)\n\n// Правильно (tree-shakeable):\nimport { specificFunction } from "big-library";\n\n// Плохо (импортирует всё):\nimport BigLibrary from "big-library";\nconst { specificFunction } = BigLibrary;\n\n// Preloading критических ресурсов (Vite)\n// vite.config.js:\n// build: { rollupOptions: { output: { manualChunks: ... } } }' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Конфигурация Vite',
      type: 'practice',
      difficulty: 'medium',
      description: 'Настройте Vite конфигурацию для React проекта с TypeScript: алиасы, proxy, env переменные и production оптимизации.',
      requirements: [
        'Плагин @vitejs/plugin-react',
        'Алиас @ для ./src директории',
        'Proxy /api -> http://localhost:8080',
        'Переменная __BUILD_DATE__ с датой сборки',
        'Production: sourcemap, manual chunks (vendor, router)',
        'Поддержка CSS Modules (автоматически в Vite)',
        'Предварительная загрузка шрифтов через assetsInclude'
      ],
      solution: {
        code: '// vite.config.ts\nimport { defineConfig, loadEnv } from "vite";\nimport react from "@vitejs/plugin-react";\nimport path from "path";\n\nexport default defineConfig(({ command, mode }) => {\n  const env = loadEnv(mode, process.cwd(), "");\n  const isProduction = mode === "production";\n\n  return {\n    plugins: [react()],\n\n    resolve: {\n      alias: { "@": path.resolve(__dirname, "./src") }\n    },\n\n    server: {\n      port: 3000,\n      open: true,\n      proxy: {\n        "/api": {\n          target: "http://localhost:8080",\n          changeOrigin: true\n        }\n      }\n    },\n\n    define: {\n      __BUILD_DATE__: JSON.stringify(new Date().toISOString())\n    },\n\n    assetsInclude: ["**/*.woff", "**/*.woff2"],\n\n    build: {\n      outDir: "dist",\n      sourcemap: isProduction,\n      minify: isProduction ? "terser" : false,\n      rollupOptions: {\n        output: {\n          manualChunks: {\n            vendor: ["react", "react-dom"],\n            router: ["react-router-dom"]\n          }\n        }\n      }\n    }\n  };\n});\n\n// .env.development\nVITE_API_URL=http://localhost:8080\nVITE_APP_TITLE=My App (Dev)\n\n// .env.production\nVITE_API_URL=https://api.myapp.com\nVITE_APP_TITLE=My App',
        language: 'javascript'
      }
    }
  ]
};
