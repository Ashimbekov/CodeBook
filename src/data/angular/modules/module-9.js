export default {
  id: 9,
  title: 'Роутинг',
  description: 'Настройка маршрутов, RouterModule, параметры URL, вложенные маршруты и lazy loading модулей',
  lessons: [
    {
      id: 1,
      title: 'Настройка маршрутов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Роутинг в Angular позволяет создавать SPA (Single Page Application) с навигацией между страницами без перезагрузки. Каждый маршрут связывает URL с компонентом.' },
        { type: 'heading', value: 'Определение маршрутов' },
        { type: 'code', language: 'typescript', value: '// app.routes.ts\nimport { Routes } from \'@angular/router\';\nimport { HomeComponent } from \'./pages/home.component\';\nimport { AboutComponent } from \'./pages/about.component\';\nimport { NotFoundComponent } from \'./pages/not-found.component\';\n\nexport const routes: Routes = [\n  { path: \'\', component: HomeComponent },           // Главная: /\n  { path: \'about\', component: AboutComponent },      // О нас: /about\n  { path: \'**\', component: NotFoundComponent }       // 404: всё остальное\n];\n\n// app.config.ts\nimport { provideRouter } from \'@angular/router\';\nimport { routes } from \'./app.routes\';\n\nexport const appConfig: ApplicationConfig = {\n  providers: [\n    provideRouter(routes)\n  ]\n};' },
        { type: 'heading', value: 'RouterOutlet и навигация' },
        { type: 'code', language: 'typescript', value: '// app.component.ts\nimport { Component } from \'@angular/core\';\nimport { RouterOutlet, RouterLink, RouterLinkActive } from \'@angular/router\';\n\n@Component({\n  selector: \'app-root\',\n  standalone: true,\n  imports: [RouterOutlet, RouterLink, RouterLinkActive],\n  template: `\n    <nav>\n      <!-- routerLink для навигации без перезагрузки -->\n      <a routerLink="/" routerLinkActive="active"\n         [routerLinkActiveOptions]="{ exact: true }">Главная</a>\n      <a routerLink="/about" routerLinkActive="active">О нас</a>\n      <a routerLink="/contacts" routerLinkActive="active">Контакты</a>\n    </nav>\n\n    <!-- Сюда подставляется компонент текущего маршрута -->\n    <router-outlet />\n  `,\n  styles: [`\n    .active { color: #dd0031; font-weight: bold; }\n  `]\n})\nexport class AppComponent {}' },
        { type: 'tip', value: 'routerLinkActive автоматически добавляет CSS-класс к активной ссылке. Для главной страницы добавьте { exact: true }, иначе "/" будет активен на всех маршрутах.' }
      ]
    },
    {
      id: 2,
      title: 'Параметры маршрута',
      type: 'theory',
      content: [
        { type: 'text', value: 'Маршруты могут содержать динамические параметры: ID пользователя, slug статьи и т.д. Angular предоставляет несколько способов получения параметров.' },
        { type: 'heading', value: 'Определение параметров' },
        { type: 'code', language: 'typescript', value: '// app.routes.ts\nexport const routes: Routes = [\n  { path: \'users\', component: UserListComponent },\n  { path: \'users/:id\', component: UserDetailComponent },    // :id — параметр\n  { path: \'posts/:category/:id\', component: PostComponent } // несколько параметров\n];' },
        { type: 'heading', value: 'Получение параметров в компоненте' },
        { type: 'code', language: 'typescript', value: 'import { Component, OnInit, inject } from \'@angular/core\';\nimport { ActivatedRoute, Router } from \'@angular/router\';\n\n@Component({\n  selector: \'app-user-detail\',\n  standalone: true,\n  imports: [AsyncPipe],\n  template: `\n    @if (user$ | async; as user) {\n      <h2>{{ user.name }}</h2>\n      <p>{{ user.email }}</p>\n      <button (click)="goBack()">Назад</button>\n    } @else {\n      <p>Загрузка...</p>\n    }\n  `\n})\nexport class UserDetailComponent implements OnInit {\n  private route = inject(ActivatedRoute);\n  private router = inject(Router);\n  private userService = inject(UserService);\n  user$!: Observable<User>;\n\n  ngOnInit(): void {\n    // Способ 1: Observable (реагирует на изменение параметра)\n    this.user$ = this.route.paramMap.pipe(\n      switchMap(params => {\n        const id = Number(params.get(\'id\'));\n        return this.userService.getById(id);\n      })\n    );\n\n    // Способ 2: Снимок (snapshot) — для одноразового чтения\n    // const id = Number(this.route.snapshot.paramMap.get(\'id\'));\n  }\n\n  goBack(): void {\n    this.router.navigate([\'/users\']);\n  }\n}' },
        { type: 'heading', value: 'Query параметры' },
        { type: 'code', language: 'typescript', value: '// URL: /products?category=electronics&sort=price\n\n// Передача query параметров\n// <a [routerLink]="[\'/products\']"\n//    [queryParams]="{ category: \'electronics\', sort: \'price\' }">Электроника</a>\n\n// Или программно\nthis.router.navigate([\'/products\'], {\n  queryParams: { category: \'electronics\', sort: \'price\' }\n});\n\n// Получение query параметров\nexport class ProductListComponent implements OnInit {\n  private route = inject(ActivatedRoute);\n\n  ngOnInit(): void {\n    this.route.queryParamMap.subscribe(params => {\n      const category = params.get(\'category\');\n      const sort = params.get(\'sort\');\n      console.log(category, sort);\n    });\n  }\n}' },
        { type: 'note', value: 'Используйте paramMap Observable, если компонент может быть переиспользован с разными параметрами (например, переход от /users/1 к /users/2). Для одноразового чтения используйте snapshot.' }
      ]
    },
    {
      id: 3,
      title: 'Вложенные маршруты',
      type: 'theory',
      content: [
        { type: 'text', value: 'Вложенные маршруты (child routes) позволяют создавать иерархию маршрутов. Родительский компонент содержит свой <router-outlet>, куда подставляются дочерние компоненты.' },
        { type: 'heading', value: 'Определение дочерних маршрутов' },
        { type: 'code', language: 'typescript', value: '// app.routes.ts\nexport const routes: Routes = [\n  { path: \'\', component: HomeComponent },\n  {\n    path: \'admin\',\n    component: AdminLayoutComponent,\n    children: [\n      { path: \'\', redirectTo: \'dashboard\', pathMatch: \'full\' },\n      { path: \'dashboard\', component: DashboardComponent },\n      { path: \'users\', component: AdminUsersComponent },\n      { path: \'users/:id\', component: AdminUserEditComponent },\n      { path: \'settings\', component: SettingsComponent }\n    ]\n  }\n];' },
        { type: 'heading', value: 'Родительский компонент с layout' },
        { type: 'code', language: 'typescript', value: '// admin-layout.component.ts\n@Component({\n  selector: \'app-admin-layout\',\n  standalone: true,\n  imports: [RouterOutlet, RouterLink, RouterLinkActive],\n  template: `\n    <div class="admin">\n      <aside class="sidebar">\n        <h3>Админ панель</h3>\n        <nav>\n          <a routerLink="dashboard" routerLinkActive="active">Дашборд</a>\n          <a routerLink="users" routerLinkActive="active">Пользователи</a>\n          <a routerLink="settings" routerLinkActive="active">Настройки</a>\n        </nav>\n      </aside>\n      <main class="content">\n        <!-- Дочерние маршруты рендерятся здесь -->\n        <router-outlet />\n      </main>\n    </div>\n  `,\n  styles: [`\n    .admin { display: flex; min-height: 100vh; }\n    .sidebar { width: 250px; background: #2c3e50; color: white; padding: 1rem; }\n    .sidebar a { display: block; color: white; padding: 8px; text-decoration: none; }\n    .active { background: #dd0031; border-radius: 4px; }\n    .content { flex: 1; padding: 2rem; }\n  `]\n})\nexport class AdminLayoutComponent {}' },
        { type: 'tip', value: 'Вложенные маршруты идеальны для layout-ов: админ-панель с сайдбаром, пользовательский кабинет с табами, документация с навигацией.' }
      ]
    },
    {
      id: 4,
      title: 'Lazy Loading маршрутов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Lazy loading — это загрузка модулей по требованию. Вместо загрузки всего приложения сразу, код загружается только когда пользователь переходит на соответствующий маршрут.' },
        { type: 'heading', value: 'Lazy loading компонентов' },
        { type: 'code', language: 'typescript', value: '// app.routes.ts\nexport const routes: Routes = [\n  { path: \'\', component: HomeComponent },\n\n  // Lazy loading отдельного компонента\n  {\n    path: \'about\',\n    loadComponent: () => import(\'./pages/about.component\')\n      .then(m => m.AboutComponent)\n  },\n\n  // Lazy loading группы маршрутов\n  {\n    path: \'admin\',\n    loadChildren: () => import(\'./admin/admin.routes\')\n      .then(m => m.adminRoutes)\n  },\n\n  // Lazy loading с layout\n  {\n    path: \'shop\',\n    loadComponent: () => import(\'./shop/shop-layout.component\')\n      .then(m => m.ShopLayoutComponent),\n    loadChildren: () => import(\'./shop/shop.routes\')\n      .then(m => m.shopRoutes)\n  }\n];' },
        { type: 'heading', value: 'Файл дочерних маршрутов' },
        { type: 'code', language: 'typescript', value: '// admin/admin.routes.ts\nimport { Routes } from \'@angular/router\';\n\nexport const adminRoutes: Routes = [\n  {\n    path: \'\',\n    loadComponent: () => import(\'./admin-layout.component\')\n      .then(m => m.AdminLayoutComponent),\n    children: [\n      { path: \'\', redirectTo: \'dashboard\', pathMatch: \'full\' },\n      {\n        path: \'dashboard\',\n        loadComponent: () => import(\'./dashboard.component\')\n          .then(m => m.DashboardComponent)\n      },\n      {\n        path: \'users\',\n        loadComponent: () => import(\'./users.component\')\n          .then(m => m.UsersComponent)\n      }\n    ]\n  }\n];' },
        { type: 'heading', value: 'Preloading — предзагрузка' },
        { type: 'code', language: 'typescript', value: '// Предзагрузка всех lazy-маршрутов после загрузки главной страницы\nimport { provideRouter, withPreloading, PreloadAllModules } from \'@angular/router\';\n\nexport const appConfig: ApplicationConfig = {\n  providers: [\n    provideRouter(\n      routes,\n      withPreloading(PreloadAllModules)  // Предзагрузить всё в фоне\n    )\n  ]\n};' },
        { type: 'tip', value: 'Lazy loading критичен для больших приложений. Без него Angular загрузит весь код при первом визите. С lazy loading начальный бандл может быть в 5-10 раз меньше.' }
      ]
    },
    {
      id: 5,
      title: 'Программная навигация',
      type: 'theory',
      content: [
        { type: 'text', value: 'Помимо навигации через routerLink, Angular позволяет программно переходить между маршрутами через сервис Router. Это нужно для редиректов после действий: авторизация, сохранение формы.' },
        { type: 'heading', value: 'Router.navigate()' },
        { type: 'code', language: 'typescript', value: 'import { Component, inject } from \'@angular/core\';\nimport { Router } from \'@angular/router\';\n\n@Component({ /* ... */ })\nexport class LoginComponent {\n  private router = inject(Router);\n  private authService = inject(AuthService);\n\n  async login(username: string, password: string): Promise<void> {\n    try {\n      await this.authService.login(username, password);\n\n      // Навигация по абсолютному пути\n      this.router.navigate([\'/dashboard\']);\n\n      // С параметрами\n      this.router.navigate([\'/users\', userId]);\n      // => /users/42\n\n      // С query параметрами\n      this.router.navigate([\'/products\'], {\n        queryParams: { category: \'electronics\', page: 1 }\n      });\n      // => /products?category=electronics&page=1\n\n      // Относительная навигация\n      this.router.navigate([\'../details\'], { relativeTo: this.route });\n\n      // Заменить текущую запись в истории (без кнопки \"назад\")\n      this.router.navigate([\'/dashboard\'], { replaceUrl: true });\n\n    } catch (error) {\n      console.error(\'Ошибка авторизации\');\n    }\n  }\n}' },
        { type: 'heading', value: 'Передача данных между маршрутами' },
        { type: 'code', language: 'typescript', value: '// Передача state (не отображается в URL)\nthis.router.navigate([\'/user\', id], {\n  state: { fromPage: \'dashboard\', timestamp: Date.now() }\n});\n\n// Получение state в целевом компоненте\nexport class UserComponent {\n  private router = inject(Router);\n\n  ngOnInit(): void {\n    const state = this.router.getCurrentNavigation()?.extras.state;\n    console.log(state?.fromPage); // \'dashboard\'\n  }\n}' },
        { type: 'note', value: 'Router state хранится только в памяти. При обновлении страницы (F5) state будет потерян. Для постоянных данных используйте query params или localStorage.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Многостраничное приложение',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте SPA с несколькими страницами, навигацией, вложенными маршрутами и lazy loading.',
      requirements: [
        'Маршруты: главная (/), каталог (/products), карточка товара (/products/:id), о нас (/about)',
        'Навигация с routerLink и подсветкой активного пункта',
        'Страница товара получает id из URL через ActivatedRoute',
        'Lazy loading для страницы about',
        'Редирект с /home на / ',
        'Страница 404 для несуществующих маршрутов'
      ],
      hint: 'Определите маршруты в app.routes.ts. Используйте RouterOutlet в app.component. Для lazy loading используйте loadComponent с динамическим import().',
      expectedOutput: 'SPA с навигацией между страницами. Переход без перезагрузки. Страница товара показывает данные по ID из URL. Несуществующие URL ведут на 404.',
      solution: `// app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';
import { ProductListComponent } from './pages/product-list.component';
import { ProductDetailComponent } from './pages/product-detail.component';
import { NotFoundComponent } from './pages/not-found.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: 'products', component: ProductListComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  {
    path: 'about',
    loadComponent: () => import('./pages/about.component')
      .then(m => m.AboutComponent)
  },
  { path: '**', component: NotFoundComponent }
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
      <a routerLink="/" routerLinkActive="active"
         [routerLinkActiveOptions]="{ exact: true }">Главная</a>
      <a routerLink="/products" routerLinkActive="active">Каталог</a>
      <a routerLink="/about" routerLinkActive="active">О нас</a>
    </nav>
    <router-outlet />
  \`
})
export class AppComponent {}

// product-detail.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  template: \`
    <h2>Товар #{{ productId }}</h2>
    <p>Название: {{ product?.name }}</p>
    <p>Цена: {{ product?.price }} руб.</p>
    <button (click)="goBack()">Назад к каталогу</button>
  \`
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  productId!: number;
  product: any = null;

  private products = [
    { id: 1, name: 'Ноутбук', price: 75000 },
    { id: 2, name: 'Смартфон', price: 45000 },
    { id: 3, name: 'Наушники', price: 12000 }
  ];

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.productId = Number(params.get('id'));
      this.product = this.products.find(p => p.id === this.productId);
    });
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}`,
      explanation: 'Маршруты определяются как массив объектов Routes. RouterOutlet — место рендеринга текущего компонента маршрута. RouterLink обеспечивает навигацию без перезагрузки. ActivatedRoute.paramMap.subscribe реактивно получает параметры URL. loadComponent обеспечивает lazy loading — код страницы "О нас" загружается только при переходе на неё.'
    }
  ]
}
