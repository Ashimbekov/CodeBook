export default {
  id: 10,
  title: 'Guards и Resolvers',
  description: 'Защита маршрутов с помощью Guards, предзагрузка данных через Resolvers и управление доступом',
  lessons: [
    {
      id: 1,
      title: 'Что такое Route Guards',
      type: 'theory',
      content: [
        { type: 'text', value: 'Guards — это функции, которые выполняются перед активацией или деактивацией маршрута. Они контролируют доступ: можно ли перейти на страницу, покинуть её, или загрузить дочерние маршруты.' },
        { type: 'heading', value: 'Типы Guards' },
        { type: 'list', value: [
          'canActivate — можно ли активировать маршрут (проверка авторизации)',
          'canDeactivate — можно ли покинуть маршрут (несохранённые изменения)',
          'canActivateChild — можно ли активировать дочерние маршруты',
          'canMatch — можно ли использовать маршрут при сопоставлении URL',
          'resolve — предзагрузка данных перед активацией'
        ] },
        { type: 'heading', value: 'Функциональный Guard (Angular 15+)' },
        { type: 'code', language: 'typescript', value: '// auth.guard.ts\nimport { inject } from \'@angular/core\';\nimport { CanActivateFn, Router } from \'@angular/router\';\n\nexport const authGuard: CanActivateFn = (route, state) => {\n  const authService = inject(AuthService);\n  const router = inject(Router);\n\n  if (authService.isLoggedIn()) {\n    return true;  // Разрешить доступ\n  }\n\n  // Перенаправить на страницу логина\n  return router.createUrlTree([\'/login\'], {\n    queryParams: { returnUrl: state.url }\n  });\n};\n\n// Применение к маршруту\nexport const routes: Routes = [\n  { path: \'dashboard\', component: DashboardComponent, canActivate: [authGuard] },\n  {\n    path: \'admin\',\n    canActivate: [authGuard, adminGuard],  // несколько guards\n    children: [/* ... */]\n  }\n];' },
        { type: 'tip', value: 'Функциональные Guards — рекомендуемый подход в Angular 15+. Они проще классовых Guards и лучше поддерживают tree-shaking.' }
      ]
    },
    {
      id: 2,
      title: 'Auth Guard и Role Guard',
      type: 'theory',
      content: [
        { type: 'text', value: 'Самые распространённые Guards — проверка авторизации и проверка роли пользователя. Рассмотрим практическую реализацию.' },
        { type: 'heading', value: 'AuthService' },
        { type: 'code', language: 'typescript', value: '// auth.service.ts\n@Injectable({ providedIn: \'root\' })\nexport class AuthService {\n  private currentUser$ = new BehaviorSubject<User | null>(null);\n\n  get user$(): Observable<User | null> {\n    return this.currentUser$.asObservable();\n  }\n\n  isLoggedIn(): boolean {\n    return this.currentUser$.getValue() !== null;\n  }\n\n  hasRole(role: string): boolean {\n    return this.currentUser$.getValue()?.role === role;\n  }\n\n  login(credentials: { email: string; password: string }): Observable<User> {\n    return this.http.post<User>(\'/api/login\', credentials).pipe(\n      tap(user => this.currentUser$.next(user))\n    );\n  }\n\n  logout(): void {\n    this.currentUser$.next(null);\n  }\n}' },
        { type: 'heading', value: 'Guard с проверкой ролей' },
        { type: 'code', language: 'typescript', value: '// role.guard.ts\nimport { inject } from \'@angular/core\';\nimport { CanActivateFn, Router } from \'@angular/router\';\n\nexport const roleGuard: CanActivateFn = (route, state) => {\n  const authService = inject(AuthService);\n  const router = inject(Router);\n\n  // Получаем требуемую роль из данных маршрута\n  const requiredRole = route.data[\'role\'] as string;\n\n  if (!authService.isLoggedIn()) {\n    return router.createUrlTree([\'/login\']);\n  }\n\n  if (requiredRole && !authService.hasRole(requiredRole)) {\n    return router.createUrlTree([\'/forbidden\']);\n  }\n\n  return true;\n};\n\n// Использование с data\nexport const routes: Routes = [\n  {\n    path: \'admin\',\n    canActivate: [roleGuard],\n    data: { role: \'admin\' },   // Передаём требуемую роль\n    children: [/* ... */]\n  },\n  {\n    path: \'editor\',\n    canActivate: [roleGuard],\n    data: { role: \'editor\' },\n    children: [/* ... */]\n  }\n];' },
        { type: 'note', value: 'route.data — объект произвольных данных, привязанных к маршруту. Он доступен в Guards, Resolvers и компонентах. Удобен для передачи конфигурации.' }
      ]
    },
    {
      id: 3,
      title: 'CanDeactivate Guard',
      type: 'theory',
      content: [
        { type: 'text', value: 'CanDeactivate Guard предотвращает уход с текущей страницы. Это полезно, когда пользователь редактирует форму и ещё не сохранил изменения.' },
        { type: 'heading', value: 'Реализация CanDeactivate' },
        { type: 'code', language: 'typescript', value: '// can-deactivate.guard.ts\nimport { CanDeactivateFn } from \'@angular/router\';\n\n// Интерфейс для компонентов с несохранёнными изменениями\nexport interface HasUnsavedChanges {\n  hasUnsavedChanges(): boolean;\n}\n\nexport const unsavedChangesGuard: CanDeactivateFn<HasUnsavedChanges> = (\n  component,\n  currentRoute,\n  currentState,\n  nextState\n) => {\n  if (component.hasUnsavedChanges()) {\n    return confirm(\'У вас есть несохранённые изменения. Покинуть страницу?\');\n  }\n  return true;\n};' },
        { type: 'heading', value: 'Компонент с проверкой' },
        { type: 'code', language: 'typescript', value: '// edit-profile.component.ts\n@Component({\n  selector: \'app-edit-profile\',\n  standalone: true,\n  imports: [FormsModule],\n  template: `\n    <h2>Редактирование профиля</h2>\n    <input [(ngModel)]="name" />\n    <input [(ngModel)]="email" />\n    <button (click)="save()">Сохранить</button>\n  `\n})\nexport class EditProfileComponent implements HasUnsavedChanges {\n  name = \'Иван\';\n  email = \'ivan@mail.ru\';\n  private saved = false;\n  private originalName = \'Иван\';\n  private originalEmail = \'ivan@mail.ru\';\n\n  hasUnsavedChanges(): boolean {\n    if (this.saved) return false;\n    return this.name !== this.originalName || this.email !== this.originalEmail;\n  }\n\n  save(): void {\n    // Сохранение...\n    this.saved = true;\n    this.originalName = this.name;\n    this.originalEmail = this.email;\n  }\n}\n\n// В маршрутах\n{ path: \'profile/edit\', component: EditProfileComponent, canDeactivate: [unsavedChangesGuard] }' },
        { type: 'tip', value: 'Вместо confirm() можно показать красивый модальный диалог через сервис. Guard может возвращать Observable<boolean> для асинхронных проверок.' }
      ]
    },
    {
      id: 4,
      title: 'Resolvers — предзагрузка данных',
      type: 'theory',
      content: [
        { type: 'text', value: 'Resolvers загружают данные ДО активации маршрута. Компонент получает готовые данные через ActivatedRoute, не показывая спиннер загрузки.' },
        { type: 'heading', value: 'Функциональный Resolver' },
        { type: 'code', language: 'typescript', value: '// user.resolver.ts\nimport { inject } from \'@angular/core\';\nimport { ResolveFn, Router } from \'@angular/router\';\nimport { catchError, EMPTY } from \'rxjs\';\n\nexport const userResolver: ResolveFn<User> = (route, state) => {\n  const userService = inject(UserService);\n  const router = inject(Router);\n  const id = Number(route.paramMap.get(\'id\'));\n\n  return userService.getById(id).pipe(\n    catchError(() => {\n      router.navigate([\'/not-found\']);\n      return EMPTY;  // Не активировать маршрут\n    })\n  );\n};\n\n// В маршрутах\nexport const routes: Routes = [\n  {\n    path: \'users/:id\',\n    component: UserDetailComponent,\n    resolve: { user: userResolver }  // Ключ \'user\' доступен через route.data\n  }\n];' },
        { type: 'heading', value: 'Использование данных из Resolver' },
        { type: 'code', language: 'typescript', value: '// user-detail.component.ts\n@Component({\n  selector: \'app-user-detail\',\n  standalone: true,\n  template: `\n    <h2>{{ user.name }}</h2>\n    <p>{{ user.email }}</p>\n  `\n})\nexport class UserDetailComponent implements OnInit {\n  private route = inject(ActivatedRoute);\n  user!: User;\n\n  ngOnInit(): void {\n    // Данные уже загружены — доступны мгновенно!\n    this.user = this.route.snapshot.data[\'user\'];\n\n    // Или реактивно (для изменяемых параметров)\n    // this.route.data.subscribe(data => {\n    //   this.user = data[\'user\'];\n    // });\n  }\n}' },
        { type: 'warning', value: 'Resolver блокирует навигацию до загрузки данных. Если запрос долгий — пользователь увидит зависшую навигацию. Для долгих запросов лучше загружать данные в компоненте с индикатором загрузки.' }
      ]
    },
    {
      id: 5,
      title: 'Комбинирование Guards',
      type: 'theory',
      content: [
        { type: 'text', value: 'В реальных приложениях маршруты защищены несколькими Guards. Angular выполняет их последовательно — если один Guard отклоняет, остальные не выполняются.' },
        { type: 'heading', value: 'Полная конфигурация маршрутов' },
        { type: 'code', language: 'typescript', value: '// app.routes.ts\nexport const routes: Routes = [\n  // Публичные маршруты\n  { path: \'\', component: HomeComponent },\n  { path: \'login\', component: LoginComponent },\n  { path: \'register\', component: RegisterComponent },\n\n  // Защищённые маршруты\n  {\n    path: \'dashboard\',\n    canActivate: [authGuard],\n    component: DashboardComponent\n  },\n\n  // Маршруты с проверкой роли\n  {\n    path: \'admin\',\n    canActivate: [authGuard, roleGuard],\n    data: { role: \'admin\' },\n    loadChildren: () => import(\'./admin/admin.routes\')\n      .then(m => m.adminRoutes)\n  },\n\n  // Маршрут с resolver и guard\n  {\n    path: \'profile/:id\',\n    canActivate: [authGuard],\n    resolve: { user: userResolver },\n    component: ProfileComponent\n  },\n\n  // Форма с защитой от ухода\n  {\n    path: \'profile/edit\',\n    canActivate: [authGuard],\n    canDeactivate: [unsavedChangesGuard],\n    component: EditProfileComponent\n  },\n\n  // 404\n  { path: \'**\', component: NotFoundComponent }\n];' },
        { type: 'heading', value: 'Guard с асинхронной проверкой' },
        { type: 'code', language: 'typescript', value: '// Async guard — проверяет токен на сервере\nexport const tokenValidationGuard: CanActivateFn = (route, state) => {\n  const authService = inject(AuthService);\n  const router = inject(Router);\n\n  return authService.validateToken().pipe(\n    map(isValid => {\n      if (isValid) return true;\n      return router.createUrlTree([\'/login\']);\n    }),\n    catchError(() => {\n      return of(router.createUrlTree([\'/login\']));\n    })\n  );\n};' },
        { type: 'note', value: 'Порядок Guards в массиве canActivate имеет значение. Поставьте authGuard первым — нет смысла проверять роль, если пользователь не авторизован.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Защищённое приложение',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте систему маршрутизации с авторизацией: AuthGuard, RoleGuard, страница логина с редиректом после входа.',
      requirements: [
        'AuthService с методами login(), logout(), isLoggedIn(), hasRole()',
        'AuthGuard — редирект на /login для неавторизованных пользователей',
        'RoleGuard — проверка роли из route.data',
        'Страница логина с формой и редиректом на returnUrl после входа',
        'Защищённый маршрут /dashboard (требует авторизации)',
        'Маршрут /admin (требует роль admin)'
      ],
      hint: 'AuthService хранит текущего пользователя в BehaviorSubject. Guard использует inject(AuthService) для проверки. returnUrl сохраняется в queryParams.',
      expectedOutput: 'Неавторизованный пользователь перенаправляется на /login. После входа — на запрошенную страницу. Обычный пользователь не видит /admin.',
      solution: `// auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface User {
  name: string;
  role: 'admin' | 'user';
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser = new BehaviorSubject<User | null>(null);
  user$ = this.currentUser.asObservable();

  isLoggedIn(): boolean {
    return this.currentUser.getValue() !== null;
  }

  hasRole(role: string): boolean {
    return this.currentUser.getValue()?.role === role;
  }

  login(name: string, role: 'admin' | 'user'): void {
    this.currentUser.next({ name, role });
  }

  logout(): void {
    this.currentUser.next(null);
  }
}

// auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isLoggedIn()) return true;
  return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};

export const roleGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const requiredRole = route.data['role'] as string;
  if (!auth.isLoggedIn()) return router.createUrlTree(['/login']);
  if (requiredRole && !auth.hasRole(requiredRole)) return router.createUrlTree(['/forbidden']);
  return true;
};

// login.component.ts
import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: \`
    <h2>Вход</h2>
    <input [(ngModel)]="name" placeholder="Имя" />
    <select [(ngModel)]="role">
      <option value="user">Пользователь</option>
      <option value="admin">Администратор</option>
    </select>
    <button (click)="login()">Войти</button>
  \`
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  name = '';
  role: 'admin' | 'user' = 'user';

  login(): void {
    this.auth.login(this.name, this.role);
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/dashboard';
    this.router.navigateByUrl(returnUrl);
  }
}

// routes
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', canActivate: [authGuard], component: DashboardComponent },
  { path: 'admin', canActivate: [authGuard, roleGuard], data: { role: 'admin' }, component: AdminComponent },
  { path: 'forbidden', component: ForbiddenComponent },
  { path: '**', component: NotFoundComponent }
];`,
      explanation: 'AuthService управляет состоянием авторизации через BehaviorSubject. authGuard проверяет isLoggedIn() и перенаправляет на /login с сохранением returnUrl. roleGuard проверяет роль из route.data. LoginComponent после успешного входа перенаправляет на returnUrl. Порядок Guards: сначала authGuard, затем roleGuard — нет смысла проверять роль неавторизованного пользователя.'
    }
  ]
}
