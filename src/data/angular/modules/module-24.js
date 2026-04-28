export default {
  id: 24,
  title: 'Деплой Angular приложений',
  description: 'Сборка, окружения, SSR с Angular Universal, деплой на Vercel, Netlify и Docker',
  lessons: [
    {
      id: 1,
      title: 'Сборка Angular приложения',
      type: 'theory',
      content: [
        { type: 'text', value: 'Команда ng build создаёт оптимизированную сборку для продакшена. Angular выполняет tree-shaking, минификацию, AOT-компиляцию и разделение на чанки.' },
        { type: 'heading', value: 'Команды сборки' },
        { type: 'code', language: 'bash', value: '# Сборка для продакшена\nng build\n\n# Результат в папке dist/my-app/browser/\n# dist/my-app/browser/\n#   index.html\n#   main-HASH.js         # Основной бандл\n#   polyfills-HASH.js    # Полифилы\n#   styles-HASH.css      # Глобальные стили\n#   chunk-HASH.js        # Lazy-loaded чанки\n#   assets/              # Статичные файлы\n\n# Сборка с анализом размера\nng build --stats-json\nnpx webpack-bundle-analyzer dist/my-app/stats.json\n\n# Локальный просмотр сборки\nnpx http-server dist/my-app/browser' },
        { type: 'heading', value: 'Оптимизации сборки' },
        { type: 'list', value: [
          'AOT (Ahead-of-Time) компиляция — шаблоны компилируются при сборке, не в браузере',
          'Tree-shaking — удаление неиспользуемого кода',
          'Минификация — уменьшение размера JS и CSS',
          'Code splitting — разделение на чанки для lazy loading',
          'Differential loading — разные бандлы для старых и новых браузеров'
        ] },
        { type: 'tip', value: 'Angular 17+ использует esbuild для сборки — это в 2-4 раза быстрее, чем webpack. Проверьте angular.json: builder должен быть @angular-devkit/build-angular:application.' }
      ]
    },
    {
      id: 2,
      title: 'Environments — окружения',
      type: 'theory',
      content: [
        { type: 'text', value: 'Angular поддерживает разные конфигурации для dev, staging и production. Переменные окружения определяют API URL, ключи и настройки для каждого контекста.' },
        { type: 'heading', value: 'Создание окружений' },
        { type: 'code', language: 'typescript', value: '// src/environments/environment.ts (development)\nexport const environment = {\n  production: false,\n  apiUrl: \'http://localhost:3000/api\',\n  appName: \'My App (DEV)\',\n  features: {\n    analytics: false,\n    debugging: true\n  }\n};\n\n// src/environments/environment.prod.ts (production)\nexport const environment = {\n  production: true,\n  apiUrl: \'https://api.myapp.com\',\n  appName: \'My App\',\n  features: {\n    analytics: true,\n    debugging: false\n  }\n};' },
        { type: 'heading', value: 'Настройка в angular.json' },
        { type: 'code', language: 'typescript', value: '// angular.json\n{\n  "configurations": {\n    "production": {\n      "fileReplacements": [\n        {\n          "replace": "src/environments/environment.ts",\n          "with": "src/environments/environment.prod.ts"\n        }\n      ],\n      "optimization": true,\n      "sourceMap": false\n    },\n    "staging": {\n      "fileReplacements": [\n        {\n          "replace": "src/environments/environment.ts",\n          "with": "src/environments/environment.staging.ts"\n        }\n      ]\n    }\n  }\n}' },
        { type: 'heading', value: 'Использование в коде' },
        { type: 'code', language: 'typescript', value: 'import { environment } from \'../environments/environment\';\n\n@Injectable({ providedIn: \'root\' })\nexport class ApiService {\n  private apiUrl = environment.apiUrl;\n\n  getUsers(): Observable<User[]> {\n    return this.http.get<User[]>(`${this.apiUrl}/users`);\n  }\n}\n\n// Сборка для конкретного окружения\n// ng build --configuration=production\n// ng build --configuration=staging' },
        { type: 'note', value: 'При сборке Angular заменяет файл environment.ts на файл указанного окружения. Код приложения всегда импортирует из environment.ts.' }
      ]
    },
    {
      id: 3,
      title: 'Server-Side Rendering (SSR)',
      type: 'theory',
      content: [
        { type: 'text', value: 'SSR рендерит Angular приложение на сервере и отправляет готовый HTML браузеру. Это улучшает SEO, время первой отрисовки (FCP) и совместимость с краулерами.' },
        { type: 'heading', value: 'Добавление SSR' },
        { type: 'code', language: 'bash', value: '# При создании нового проекта\nng new my-app --ssr\n\n# Для существующего проекта\nng add @angular/ssr\n\n# Создаёт:\n# src/app/app.config.server.ts\n# src/main.server.ts\n# server.ts' },
        { type: 'heading', value: 'Файлы SSR' },
        { type: 'code', language: 'typescript', value: '// app.config.server.ts\nimport { mergeApplicationConfig, ApplicationConfig } from \'@angular/core\';\nimport { provideServerRendering } from \'@angular/platform-server\';\nimport { appConfig } from \'./app.config\';\n\nconst serverConfig: ApplicationConfig = {\n  providers: [\n    provideServerRendering()\n  ]\n};\n\nexport const config = mergeApplicationConfig(appConfig, serverConfig);\n\n// server.ts (Express сервер)\nimport { APP_BASE_HREF } from \'@angular/common\';\nimport { CommonEngine } from \'@angular/ssr\';\nimport express from \'express\';\n\nconst server = express();\nconst commonEngine = new CommonEngine();\n\nserver.get(\'*\', (req, res) => {\n  commonEngine.render({\n    bootstrap,\n    documentFilePath: indexHtml,\n    url: req.originalUrl,\n    providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }]\n  }).then(html => res.send(html));\n});\n\nserver.listen(4000);' },
        { type: 'heading', value: 'Важно при SSR' },
        { type: 'code', language: 'typescript', value: '// На сервере нет window, document, localStorage!\n// Проверяйте платформу:\nimport { isPlatformBrowser } from \'@angular/common\';\nimport { PLATFORM_ID, inject } from \'@angular/core\';\n\n@Component({ /* ... */ })\nexport class AppComponent {\n  private platformId = inject(PLATFORM_ID);\n\n  ngOnInit(): void {\n    if (isPlatformBrowser(this.platformId)) {\n      // Код для браузера\n      localStorage.setItem(\'key\', \'value\');\n      window.addEventListener(\'scroll\', this.onScroll);\n    }\n  }\n}' },
        { type: 'tip', value: 'Angular 17+ поддерживает hydration — SSR рендерит HTML, а затем Angular \"гидратирует\" его, подключая интерактивность без перерисовки. Это быстрее, чем полная перерисовка на клиенте.' }
      ]
    },
    {
      id: 4,
      title: 'Деплой на хостинг',
      type: 'theory',
      content: [
        { type: 'text', value: 'Angular SPA можно задеплоить на любой статический хостинг. Для SSR нужен Node.js сервер. Рассмотрим популярные варианты.' },
        { type: 'heading', value: 'Vercel' },
        { type: 'code', language: 'bash', value: '# Установить Vercel CLI\nnpm i -g vercel\n\n# Деплой (автоматически определяет Angular)\nvercel\n\n# Или через vercel.json\n# {\n#   "buildCommand": "ng build",\n#   "outputDirectory": "dist/my-app/browser",\n#   "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]\n# }' },
        { type: 'heading', value: 'Docker' },
        { type: 'code', language: 'bash', value: '# Dockerfile\n# Stage 1: Build\nFROM node:20-alpine AS build\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\n# Stage 2: Serve with Nginx\nFROM nginx:alpine\nCOPY --from=build /app/dist/my-app/browser /usr/share/nginx/html\nCOPY nginx.conf /etc/nginx/conf.d/default.conf\nEXPOSE 80\nCMD ["nginx", "-g", "daemon off;"]' },
        { type: 'heading', value: 'Nginx конфигурация для SPA' },
        { type: 'code', language: 'bash', value: '# nginx.conf\nserver {\n    listen 80;\n    server_name localhost;\n    root /usr/share/nginx/html;\n    index index.html;\n\n    # Все маршруты перенаправляем на index.html\n    location / {\n        try_files $uri $uri/ /index.html;\n    }\n\n    # Кэширование статических файлов\n    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg)$ {\n        expires 1y;\n        add_header Cache-Control "public, immutable";\n    }\n}' },
        { type: 'warning', value: 'Для SPA сервер ДОЛЖЕН возвращать index.html для всех маршрутов (кроме статических файлов). Иначе при обновлении страницы /users/42 сервер вернёт 404.' }
      ]
    },
    {
      id: 5,
      title: 'CI/CD для Angular',
      type: 'theory',
      content: [
        { type: 'text', value: 'Непрерывная интеграция и деплой автоматизируют тестирование и публикацию. Рассмотрим настройку GitHub Actions для Angular.' },
        { type: 'heading', value: 'GitHub Actions' },
        { type: 'code', language: 'bash', value: '# .github/workflows/ci.yml\nname: CI/CD\n\non:\n  push:\n    branches: [main]\n  pull_request:\n    branches: [main]\n\njobs:\n  build-and-test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n\n      - name: Setup Node.js\n        uses: actions/setup-node@v4\n        with:\n          node-version: 20\n          cache: npm\n\n      - name: Install dependencies\n        run: npm ci\n\n      - name: Lint\n        run: npm run lint\n\n      - name: Test\n        run: npm run test -- --watch=false --browsers=ChromeHeadless\n\n      - name: Build\n        run: npm run build\n\n      - name: Deploy to Vercel\n        if: github.ref == \'refs/heads/main\'\n        uses: amondnet/vercel-action@v25\n        with:\n          vercel-token: ${{ secrets.VERCEL_TOKEN }}\n          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}\n          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}\n          vercel-args: --prod' },
        { type: 'heading', value: 'Чеклист перед деплоем' },
        { type: 'list', value: [
          'Все тесты проходят (ng test --watch=false)',
          'Линтер не выдаёт ошибок (ng lint)',
          'Сборка успешна без ошибок (ng build)',
          'Бюджеты не превышены (проверяются при ng build)',
          'Environment файлы настроены для production',
          'API URL указывает на продакшн сервер',
          'Source maps отключены для production'
        ] },
        { type: 'tip', value: 'Добавьте pre-push хук через Husky: npm install husky. Он запустит тесты и линтер перед каждым push — плохой код не попадёт в репозиторий.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Подготовка к деплою',
      type: 'practice',
      difficulty: 'easy',
      description: 'Подготовьте Angular приложение к деплою: создайте файлы окружений, Dockerfile, nginx.conf и конфигурацию CI/CD.',
      requirements: [
        'Файл environment.ts для development (apiUrl: localhost)',
        'Файл environment.prod.ts для production',
        'Dockerfile с multi-stage build (Node.js + Nginx)',
        'nginx.conf с поддержкой SPA маршрутизации',
        'Конфигурация fileReplacements в angular.json',
        'Команды сборки для dev и production'
      ],
      hint: 'environment файлы экспортируют объект с настройками. Dockerfile: первый stage собирает, второй обслуживает через Nginx. try_files в Nginx для SPA.',
      expectedOutput: 'Приложение собирается с правильным окружением. Docker контейнер обслуживает SPA корректно. Все маршруты работают при обновлении страницы.',
      solution: `// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  appName: 'Angular App (DEV)'
};

// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.myapp.com',
  appName: 'Angular App'
};

// Dockerfile
// FROM node:20-alpine AS build
// WORKDIR /app
// COPY package*.json ./
// RUN npm ci
// COPY . .
// RUN npm run build
//
// FROM nginx:alpine
// COPY --from=build /app/dist/my-app/browser /usr/share/nginx/html
// COPY nginx.conf /etc/nginx/conf.d/default.conf
// EXPOSE 80
// CMD ["nginx", "-g", "daemon off;"]

// nginx.conf
// server {
//     listen 80;
//     root /usr/share/nginx/html;
//     index index.html;
//
//     location / {
//         try_files $uri $uri/ /index.html;
//     }
//
//     location ~* \\.(js|css|png|jpg|ico|svg)$ {
//         expires 1y;
//         add_header Cache-Control "public, immutable";
//     }
//
//     gzip on;
//     gzip_types text/plain text/css application/json application/javascript;
// }

// angular.json (фрагмент)
// "configurations": {
//   "production": {
//     "fileReplacements": [{
//       "replace": "src/environments/environment.ts",
//       "with": "src/environments/environment.prod.ts"
//     }],
//     "optimization": true,
//     "sourceMap": false,
//     "budgets": [
//       { "type": "initial", "maximumWarning": "500kb", "maximumError": "1mb" }
//     ]
//   }
// }

// Использование
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(\`\${this.apiUrl}/users\`);
  }
}

// Команды
// npm run build                    -> development build
// ng build --configuration=production -> production build
// docker build -t my-angular-app .
// docker run -p 80:80 my-angular-app`,
      explanation: 'Environment файлы содержат конфигурацию для каждого окружения. fileReplacements в angular.json подставляет нужный файл при сборке. Multi-stage Dockerfile сначала собирает приложение в Node.js контейнере, затем копирует результат в Nginx. try_files в nginx обеспечивает SPA-маршрутизацию — все URL возвращают index.html. Кэширование статических файлов на 1 год с immutable (хеши в именах файлов обеспечивают инвалидацию).'
    }
  ]
}
