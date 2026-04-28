export default {
  id: 16,
  title: 'Standalone компоненты',
  description: 'Standalone компоненты Angular 14+: создание без NgModule, маршрутизация и миграция',
  lessons: [
    {
      id: 1,
      title: 'Что такое Standalone компоненты',
      type: 'theory',
      content: [
        { type: 'text', value: 'Standalone компоненты — это компоненты, которые не требуют NgModule для работы. Они сами объявляют свои зависимости через свойство imports в декораторе @Component. Это значительно упрощает архитектуру Angular-приложений.' },
        { type: 'heading', value: 'Standalone vs NgModule подход' },
        { type: 'code', language: 'typescript', value: '// NgModule подход (старый):\n// 1. Создать компонент\n// 2. Объявить в NgModule declarations\n// 3. Импортировать зависимости в NgModule imports\n// 4. Экспортировать из NgModule если нужно\n\n// Standalone подход (новый):\n@Component({\n  selector: \'app-user-card\',\n  standalone: true,          // ← Ключевое свойство!\n  imports: [                 // ← Зависимости прямо здесь\n    AsyncPipe,\n    DatePipe,\n    RouterLink,\n    NgOptimizedImage\n  ],\n  template: `\n    @if (user$ | async; as user) {\n      <div class="card">\n        <h3>{{ user.name }}</h3>\n        <p>{{ user.createdAt | date:\'dd.MM.yyyy\' }}</p>\n        <a [routerLink]="[\'/users\', user.id]">Подробнее</a>\n      </div>\n    }\n  `\n})\nexport class UserCardComponent {\n  @Input({ required: true }) user$!: Observable<User>;\n}' },
        { type: 'heading', value: 'Преимущества standalone' },
        { type: 'list', value: [
          'Нет NgModule — меньше файлов и boilerplate кода',
          'Явные зависимости — видно, что использует компонент',
          'Лучший tree-shaking — неиспользуемые компоненты не попадают в бандл',
          'Проще переиспользовать — компонент самодостаточен',
          'Проще тестировать — все зависимости видны в одном месте'
        ] },
        { type: 'tip', value: 'С Angular 17+ все новые проекты создаются со standalone компонентами по умолчанию. NgModule больше не нужен для большинства приложений.' }
      ]
    },
    {
      id: 2,
      title: 'Bootstrapping без модулей',
      type: 'theory',
      content: [
        { type: 'text', value: 'Standalone приложение запускается через bootstrapApplication() вместо platformBrowserDynamic().bootstrapModule(). Конфигурация описывается в app.config.ts.' },
        { type: 'heading', value: 'Точка входа' },
        { type: 'code', language: 'typescript', value: '// main.ts\nimport { bootstrapApplication } from \'@angular/platform-browser\';\nimport { AppComponent } from \'./app/app.component\';\nimport { appConfig } from \'./app/app.config\';\n\nbootstrapApplication(AppComponent, appConfig)\n  .catch(err => console.error(err));' },
        { type: 'heading', value: 'Конфигурация приложения' },
        { type: 'code', language: 'typescript', value: '// app.config.ts\nimport { ApplicationConfig } from \'@angular/core\';\nimport { provideRouter, withPreloading, PreloadAllModules } from \'@angular/router\';\nimport { provideHttpClient, withInterceptors } from \'@angular/common/http\';\nimport { provideAnimations } from \'@angular/platform-browser/animations\';\nimport { routes } from \'./app.routes\';\nimport { authInterceptor } from \'./interceptors/auth.interceptor\';\n\nexport const appConfig: ApplicationConfig = {\n  providers: [\n    provideRouter(\n      routes,\n      withPreloading(PreloadAllModules)\n    ),\n    provideHttpClient(\n      withInterceptors([authInterceptor])\n    ),\n    provideAnimations()\n  ]\n};' },
        { type: 'heading', value: 'Маршруты' },
        { type: 'code', language: 'typescript', value: '// app.routes.ts\nimport { Routes } from \'@angular/router\';\n\nexport const routes: Routes = [\n  {\n    path: \'\',\n    loadComponent: () => import(\'./home/home.component\')\n      .then(c => c.HomeComponent)\n  },\n  {\n    path: \'users\',\n    loadComponent: () => import(\'./users/user-list.component\')\n      .then(c => c.UserListComponent)\n  },\n  {\n    path: \'users/:id\',\n    loadComponent: () => import(\'./users/user-detail.component\')\n      .then(c => c.UserDetailComponent)\n  }\n];' },
        { type: 'note', value: 'loadComponent — lazy loading для standalone компонентов. loadChildren используется для группы маршрутов (файл с массивом Routes).' }
      ]
    },
    {
      id: 3,
      title: 'Standalone директивы и пайпы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Не только компоненты могут быть standalone. Директивы и пайпы тоже поддерживают standalone: true и импортируются напрямую в компоненты.' },
        { type: 'heading', value: 'Standalone пайп' },
        { type: 'code', language: 'typescript', value: '// pipes/relative-time.pipe.ts\nimport { Pipe, PipeTransform } from \'@angular/core\';\n\n@Pipe({\n  name: \'relativeTime\',\n  standalone: true\n})\nexport class RelativeTimePipe implements PipeTransform {\n  transform(date: Date | string): string {\n    const diff = Date.now() - new Date(date).getTime();\n    const minutes = Math.floor(diff / 60000);\n    if (minutes < 60) return `${minutes} мин. назад`;\n    const hours = Math.floor(minutes / 60);\n    if (hours < 24) return `${hours} ч. назад`;\n    const days = Math.floor(hours / 24);\n    return `${days} дн. назад`;\n  }\n}' },
        { type: 'heading', value: 'Standalone директива' },
        { type: 'code', language: 'typescript', value: '// directives/auto-focus.directive.ts\nimport { Directive, ElementRef, AfterViewInit } from \'@angular/core\';\n\n@Directive({\n  selector: \'[appAutoFocus]\',\n  standalone: true\n})\nexport class AutoFocusDirective implements AfterViewInit {\n  constructor(private el: ElementRef) {}\n\n  ngAfterViewInit(): void {\n    this.el.nativeElement.focus();\n  }\n}' },
        { type: 'heading', value: 'Использование в компоненте' },
        { type: 'code', language: 'typescript', value: '@Component({\n  selector: \'app-chat\',\n  standalone: true,\n  imports: [\n    RelativeTimePipe,     // Standalone пайп\n    AutoFocusDirective,   // Standalone директива\n    AsyncPipe             // Встроенный пайп\n  ],\n  template: `\n    <div class="chat">\n      @for (msg of messages$ | async; track msg.id) {\n        <div class="message">\n          <p>{{ msg.text }}</p>\n          <small>{{ msg.createdAt | relativeTime }}</small>\n        </div>\n      }\n      <input appAutoFocus placeholder="Сообщение..." />\n    </div>\n  `\n})\nexport class ChatComponent {\n  messages$ = inject(ChatService).messages$;\n}' },
        { type: 'tip', value: 'Все встроенные пайпы Angular (DatePipe, AsyncPipe, CurrencyPipe) уже standalone. Импортируйте их напрямую из @angular/common.' }
      ]
    },
    {
      id: 4,
      title: 'Группировка маршрутов без модулей',
      type: 'theory',
      content: [
        { type: 'text', value: 'Без NgModule группировка маршрутов делается через файлы Routes и loadChildren. Это обеспечивает lazy loading и организацию кода.' },
        { type: 'heading', value: 'Группировка маршрутов' },
        { type: 'code', language: 'typescript', value: '// app.routes.ts\nexport const routes: Routes = [\n  { path: \'\', loadComponent: () => import(\'./home.component\').then(c => c.HomeComponent) },\n  {\n    path: \'admin\',\n    loadChildren: () => import(\'./admin/admin.routes\').then(r => r.adminRoutes)\n  },\n  {\n    path: \'shop\',\n    loadChildren: () => import(\'./shop/shop.routes\').then(r => r.shopRoutes)\n  }\n];\n\n// admin/admin.routes.ts\nimport { Routes } from \'@angular/router\';\nimport { authGuard } from \'../guards/auth.guard\';\n\nexport const adminRoutes: Routes = [\n  {\n    path: \'\',\n    canActivate: [authGuard],\n    loadComponent: () => import(\'./admin-layout.component\').then(c => c.AdminLayoutComponent),\n    children: [\n      { path: \'\', redirectTo: \'dashboard\', pathMatch: \'full\' },\n      { path: \'dashboard\', loadComponent: () => import(\'./dashboard.component\').then(c => c.DashboardComponent) },\n      { path: \'users\', loadComponent: () => import(\'./users.component\').then(c => c.UsersComponent) }\n    ]\n  }\n];' },
        { type: 'heading', value: 'Провайдеры для группы маршрутов' },
        { type: 'code', language: 'typescript', value: '// Провайдеры на уровне маршрута (аналог providers в NgModule)\nexport const adminRoutes: Routes = [\n  {\n    path: \'\',\n    providers: [\n      AdminService,  // Сервис доступен только внутри admin маршрутов\n      { provide: API_URL, useValue: \'/api/admin\' }\n    ],\n    loadComponent: () => import(\'./admin-layout.component\').then(c => c.AdminLayoutComponent),\n    children: [/* ... */]\n  }\n];' },
        { type: 'note', value: 'providers в маршруте создаёт отдельный инжектор, аналогично providers в NgModule. Сервисы, предоставленные на уровне маршрута, доступны только в этом маршруте и его детях.' }
      ]
    },
    {
      id: 5,
      title: 'Паттерны организации standalone проекта',
      type: 'theory',
      content: [
        { type: 'text', value: 'Без NgModule нужны новые паттерны организации кода. Рассмотрим рекомендуемую структуру standalone проекта.' },
        { type: 'heading', value: 'Структура проекта' },
        { type: 'code', language: 'bash', value: 'src/app/\n├── app.component.ts         # Корневой standalone компонент\n├── app.config.ts            # Конфигурация приложения\n├── app.routes.ts            # Корневые маршруты\n├── core/                    # Синглтон-сервисы и утилиты\n│   ├── services/\n│   │   ├── auth.service.ts\n│   │   └── api.service.ts\n│   ├── interceptors/\n│   │   └── auth.interceptor.ts\n│   ├── guards/\n│   │   └── auth.guard.ts\n│   └── models/\n│       └── user.model.ts\n├── shared/                  # Переиспользуемые standalone компоненты\n│   ├── components/\n│   │   ├── button.component.ts\n│   │   ├── card.component.ts\n│   │   └── modal.component.ts\n│   ├── directives/\n│   │   └── highlight.directive.ts\n│   └── pipes/\n│       └── truncate.pipe.ts\n├── features/                # Фичи — каждая в своей папке\n│   ├── users/\n│   │   ├── user-list.component.ts\n│   │   ├── user-detail.component.ts\n│   │   ├── user.service.ts\n│   │   └── users.routes.ts\n│   └── products/\n│       ├── product-list.component.ts\n│       ├── product.service.ts\n│       └── products.routes.ts\n└── layout/\n    ├── header.component.ts\n    └── footer.component.ts' },
        { type: 'heading', value: 'Barrel exports для удобного импорта' },
        { type: 'code', language: 'typescript', value: '// shared/components/index.ts (barrel file)\nexport { ButtonComponent } from \'./button.component\';\nexport { CardComponent } from \'./card.component\';\nexport { ModalComponent } from \'./modal.component\';\n\n// Использование:\nimport { ButtonComponent, CardComponent } from \'../shared/components\';\n// Вместо:\n// import { ButtonComponent } from \'../shared/components/button.component\';\n// import { CardComponent } from \'../shared/components/card.component\';' },
        { type: 'tip', value: 'Организуйте код по фичам (features/), а не по типам (components/, services/). Файлы одной фичи лежат рядом — это облегчает навигацию и удаление фич.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Standalone приложение',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создайте структуру standalone приложения с корневым компонентом, конфигурацией, маршрутами и несколькими standalone компонентами.',
      requirements: [
        'AppComponent (standalone) с навигацией и router-outlet',
        'app.config.ts с provideRouter и provideHttpClient',
        'HomeComponent и AboutComponent (standalone, lazy loaded)',
        'Standalone пайп для форматирования',
        'Standalone директива',
        'Маршруты в app.routes.ts с loadComponent'
      ],
      hint: 'Каждый компонент имеет standalone: true и сам импортирует свои зависимости. loadComponent() для lazy loading. app.config.ts для провайдеров.',
      expectedOutput: 'Приложение без NgModule. Компоненты самодостаточны. Lazy loading работает через loadComponent. Навигация между страницами работает.',
      solution: `// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient()
  ]
};

// app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./home.component').then(c => c.HomeComponent) },
  { path: 'about', loadComponent: () => import('./about.component').then(c => c.AboutComponent) },
  { path: '**', loadComponent: () => import('./not-found.component').then(c => c.NotFoundComponent) }
];

// app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: \`
    <nav>
      <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Главная</a>
      <a routerLink="/about" routerLinkActive="active">О нас</a>
    </nav>
    <main>
      <router-outlet />
    </main>
  \`
})
export class AppComponent {}

// greeting.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'greeting', standalone: true })
export class GreetingPipe implements PipeTransform {
  transform(name: string): string {
    const hour = new Date().getHours();
    if (hour < 12) return \`Доброе утро, \${name}!\`;
    if (hour < 18) return \`Добрый день, \${name}!\`;
    return \`Добрый вечер, \${name}!\`;
  }
}

// home.component.ts
import { Component } from '@angular/core';
import { GreetingPipe } from './greeting.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [GreetingPipe],
  template: \`
    <h1>{{ 'Angular' | greeting }}</h1>
    <p>Standalone приложение без NgModule</p>
  \`
})
export class HomeComponent {}`,
      explanation: 'Каждый компонент объявлен как standalone: true и сам управляет своими зависимостями через imports. app.config.ts заменяет AppModule — здесь провайдеры. app.routes.ts содержит маршруты. loadComponent обеспечивает lazy loading. Пайп GreetingPipe тоже standalone и импортируется напрямую в HomeComponent. Нет ни одного NgModule во всём приложении.'
    }
  ]
}
