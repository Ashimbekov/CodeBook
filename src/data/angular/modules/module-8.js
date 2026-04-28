export default {
  id: 8,
  title: 'HTTP клиент',
  description: 'Работа с HttpClient для выполнения HTTP-запросов, интерцепторы, обработка ошибок и кэширование',
  lessons: [
    {
      id: 1,
      title: 'Настройка HttpClient',
      type: 'theory',
      content: [
        { type: 'text', value: 'HttpClient — это сервис Angular для выполнения HTTP-запросов. Он возвращает Observable, поддерживает типизацию ответов, интерцепторы и автоматическую сериализацию/десериализацию JSON.' },
        { type: 'heading', value: 'Подключение HttpClient' },
        { type: 'code', language: 'typescript', value: '// app.config.ts\nimport { ApplicationConfig } from \'@angular/core\';\nimport { provideHttpClient, withInterceptors } from \'@angular/common/http\';\nimport { provideRouter } from \'@angular/router\';\nimport { routes } from \'./app.routes\';\n\nexport const appConfig: ApplicationConfig = {\n  providers: [\n    provideRouter(routes),\n    provideHttpClient()  // Подключаем HttpClient\n  ]\n};' },
        { type: 'heading', value: 'Базовые запросы' },
        { type: 'code', language: 'typescript', value: 'import { Injectable, inject } from \'@angular/core\';\nimport { HttpClient } from \'@angular/common/http\';\nimport { Observable } from \'rxjs\';\n\ninterface User {\n  id: number;\n  name: string;\n  email: string;\n}\n\n@Injectable({ providedIn: \'root\' })\nexport class UserService {\n  private http = inject(HttpClient);\n  private apiUrl = \'https://jsonplaceholder.typicode.com/users\';\n\n  // GET — получить всех пользователей\n  getAll(): Observable<User[]> {\n    return this.http.get<User[]>(this.apiUrl);\n  }\n\n  // GET — получить одного пользователя\n  getById(id: number): Observable<User> {\n    return this.http.get<User>(`${this.apiUrl}/${id}`);\n  }\n\n  // POST — создать пользователя\n  create(user: Omit<User, \'id\'>): Observable<User> {\n    return this.http.post<User>(this.apiUrl, user);\n  }\n\n  // PUT — обновить пользователя\n  update(id: number, user: Partial<User>): Observable<User> {\n    return this.http.put<User>(`${this.apiUrl}/${id}`, user);\n  }\n\n  // DELETE — удалить пользователя\n  delete(id: number): Observable<void> {\n    return this.http.delete<void>(`${this.apiUrl}/${id}`);\n  }\n}' },
        { type: 'tip', value: 'HttpClient автоматически парсит JSON-ответы. Типизация get<User[]>() обеспечивает автокомплит и проверку типов. Не забудьте подписаться — без subscribe() или async pipe запрос не выполнится!' }
      ]
    },
    {
      id: 2,
      title: 'Параметры запросов и заголовки',
      type: 'theory',
      content: [
        { type: 'text', value: 'HttpClient позволяет настраивать запросы: добавлять query-параметры, заголовки, отслеживать прогресс загрузки и получать полный ответ с заголовками.' },
        { type: 'heading', value: 'Query параметры' },
        { type: 'code', language: 'typescript', value: 'import { HttpParams, HttpHeaders } from \'@angular/common/http\';\n\n@Injectable({ providedIn: \'root\' })\nexport class ProductService {\n  private http = inject(HttpClient);\n  private apiUrl = \'https://api.example.com/products\';\n\n  // Query параметры: ?page=1&limit=10&sort=price\n  getProducts(page: number, limit: number, sort: string): Observable<Product[]> {\n    const params = new HttpParams()\n      .set(\'page\', page.toString())\n      .set(\'limit\', limit.toString())\n      .set(\'sort\', sort);\n\n    return this.http.get<Product[]>(this.apiUrl, { params });\n  }\n\n  // Или через объект (проще)\n  getProductsSimple(page: number): Observable<Product[]> {\n    return this.http.get<Product[]>(this.apiUrl, {\n      params: { page, limit: 10, sort: \'price\' }\n    });\n  }\n}' },
        { type: 'heading', value: 'Заголовки' },
        { type: 'code', language: 'typescript', value: '// Кастомные заголовки\nconst headers = new HttpHeaders()\n  .set(\'Authorization\', `Bearer ${token}`)\n  .set(\'X-Custom-Header\', \'value\');\n\nthis.http.get<User[]>(url, { headers });\n\n// Или через объект\nthis.http.get<User[]>(url, {\n  headers: {\n    \'Authorization\': `Bearer ${token}`,\n    \'Content-Type\': \'application/json\'\n  }\n});' },
        { type: 'heading', value: 'Полный ответ с заголовками' },
        { type: 'code', language: 'typescript', value: '// Получить полный HttpResponse (включая заголовки и статус)\nthis.http.get<User[]>(this.apiUrl, { observe: \'response\' }).subscribe(response => {\n  console.log(\'Статус:\', response.status);             // 200\n  console.log(\'Заголовки:\', response.headers.get(\'X-Total-Count\'));\n  console.log(\'Данные:\', response.body);               // User[]\n});' },
        { type: 'note', value: 'HttpParams и HttpHeaders — иммутабельные объекты. Метод .set() возвращает НОВЫЙ объект. Поэтому нужно цеплять: params.set().set() или создавать через конструктор.' }
      ]
    },
    {
      id: 3,
      title: 'Обработка ошибок',
      type: 'theory',
      content: [
        { type: 'text', value: 'HTTP-запросы могут завершиться ошибкой: сервер недоступен, нет авторизации, ресурс не найден. Правильная обработка ошибок — ключевая часть работы с API.' },
        { type: 'heading', value: 'Обработка ошибок через catchError' },
        { type: 'code', language: 'typescript', value: 'import { Injectable, inject } from \'@angular/core\';\nimport { HttpClient, HttpErrorResponse } from \'@angular/common/http\';\nimport { Observable, throwError, of } from \'rxjs\';\nimport { catchError, retry } from \'rxjs/operators\';\n\n@Injectable({ providedIn: \'root\' })\nexport class UserService {\n  private http = inject(HttpClient);\n\n  getUsers(): Observable<User[]> {\n    return this.http.get<User[]>(\'https://api.example.com/users\').pipe(\n      retry(2),  // Повторить 2 раза при ошибке\n      catchError(this.handleError)\n    );\n  }\n\n  private handleError(error: HttpErrorResponse): Observable<never> {\n    let message = \'Произошла ошибка\';\n\n    if (error.status === 0) {\n      // Сетевая ошибка или сервер недоступен\n      message = \'Сервер недоступен. Проверьте подключение к интернету.\';\n    } else if (error.status === 401) {\n      message = \'Необходима авторизация.\';\n    } else if (error.status === 403) {\n      message = \'Доступ запрещён.\';\n    } else if (error.status === 404) {\n      message = \'Ресурс не найден.\';\n    } else if (error.status >= 500) {\n      message = \'Ошибка сервера. Попробуйте позже.\';\n    }\n\n    console.error(message, error);\n    return throwError(() => new Error(message));\n  }\n}' },
        { type: 'heading', value: 'Обработка в компоненте' },
        { type: 'code', language: 'typescript', value: '@Component({\n  selector: \'app-users\',\n  standalone: true,\n  imports: [AsyncPipe],\n  template: `\n    @if (error) {\n      <div class="error">\n        <p>{{ error }}</p>\n        <button (click)="retry()">Повторить</button>\n      </div>\n    }\n    @if (loading) {\n      <p>Загрузка...</p>\n    }\n    @for (user of users; track user.id) {\n      <p>{{ user.name }}</p>\n    }\n  `\n})\nexport class UsersComponent implements OnInit {\n  private userService = inject(UserService);\n  users: User[] = [];\n  loading = false;\n  error: string | null = null;\n\n  ngOnInit(): void {\n    this.loadUsers();\n  }\n\n  loadUsers(): void {\n    this.loading = true;\n    this.error = null;\n    this.userService.getUsers().subscribe({\n      next: (users) => {\n        this.users = users;\n        this.loading = false;\n      },\n      error: (err) => {\n        this.error = err.message;\n        this.loading = false;\n      }\n    });\n  }\n\n  retry(): void {\n    this.loadUsers();\n  }\n}' },
        { type: 'warning', value: 'Всегда обрабатывайте ошибки HTTP-запросов! Без catchError или error callback необработанная ошибка может сломать Observable поток.' }
      ]
    },
    {
      id: 4,
      title: 'HTTP Интерцепторы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Интерцепторы — это middleware для HTTP-запросов. Они перехватывают запросы и ответы, позволяя централизованно добавлять заголовки, логирование, обработку ошибок и кэширование.' },
        { type: 'heading', value: 'Функциональный интерцептор (Angular 15+)' },
        { type: 'code', language: 'typescript', value: '// auth.interceptor.ts\nimport { HttpInterceptorFn, HttpHandlerFn, HttpRequest } from \'@angular/common/http\';\nimport { inject } from \'@angular/core\';\n\nexport const authInterceptor: HttpInterceptorFn = (req, next) => {\n  const authService = inject(AuthService);\n  const token = authService.getToken();\n\n  if (token) {\n    // Клонируем запрос и добавляем заголовок\n    const authReq = req.clone({\n      headers: req.headers.set(\'Authorization\', `Bearer ${token}`)\n    });\n    return next(authReq);\n  }\n\n  return next(req);\n};\n\n// logging.interceptor.ts\nimport { tap, finalize } from \'rxjs/operators\';\n\nexport const loggingInterceptor: HttpInterceptorFn = (req, next) => {\n  const started = Date.now();\n  console.log(`➡️ ${req.method} ${req.url}`);\n\n  return next(req).pipe(\n    finalize(() => {\n      const elapsed = Date.now() - started;\n      console.log(`⬅️ ${req.method} ${req.url} — ${elapsed}ms`);\n    })\n  );\n};' },
        { type: 'heading', value: 'Регистрация интерцепторов' },
        { type: 'code', language: 'typescript', value: '// app.config.ts\nimport { provideHttpClient, withInterceptors } from \'@angular/common/http\';\nimport { authInterceptor } from \'./interceptors/auth.interceptor\';\nimport { loggingInterceptor } from \'./interceptors/logging.interceptor\';\n\nexport const appConfig: ApplicationConfig = {\n  providers: [\n    provideRouter(routes),\n    provideHttpClient(\n      withInterceptors([\n        loggingInterceptor,  // Порядок важен!\n        authInterceptor\n      ])\n    )\n  ]\n};' },
        { type: 'tip', value: 'Интерцепторы выполняются в порядке регистрации для запросов и в обратном порядке для ответов. Logging -> Auth для запросов, Auth -> Logging для ответов.' }
      ]
    },
    {
      id: 5,
      title: 'Отмена запросов и работа с загрузкой',
      type: 'theory',
      content: [
        { type: 'text', value: 'При навигации или обновлении данных важно уметь отменять ненужные запросы. RxJS и Angular предоставляют несколько способов управления жизненным циклом HTTP-запросов.' },
        { type: 'heading', value: 'Отмена через takeUntilDestroyed' },
        { type: 'code', language: 'typescript', value: 'import { Component, OnInit, inject, DestroyRef } from \'@angular/core\';\nimport { takeUntilDestroyed } from \'@angular/core/rxjs-interop\';\n\n@Component({ /* ... */ })\nexport class UsersComponent implements OnInit {\n  private userService = inject(UserService);\n  private destroyRef = inject(DestroyRef);\n  users: User[] = [];\n\n  ngOnInit(): void {\n    this.userService.getUsers().pipe(\n      takeUntilDestroyed(this.destroyRef)  // Автоотписка при уничтожении\n    ).subscribe(users => {\n      this.users = users;\n    });\n  }\n}\n\n// Или в поле класса (без ngOnInit)\nexport class UsersComponent {\n  private userService = inject(UserService);\n  users$ = this.userService.getUsers(); // Используем async pipe — автоотписка\n}' },
        { type: 'heading', value: 'Отмена при поиске через switchMap' },
        { type: 'code', language: 'typescript', value: 'import { Component, inject } from \'@angular/core\';\nimport { Subject } from \'rxjs\';\nimport { switchMap, debounceTime, distinctUntilChanged } from \'rxjs/operators\';\n\n@Component({\n  selector: \'app-search\',\n  standalone: true,\n  imports: [AsyncPipe],\n  template: `\n    <input (input)="onSearch($event)" placeholder="Поиск..." />\n    @for (result of results$ | async; track result.id) {\n      <p>{{ result.name }}</p>\n    }\n  `\n})\nexport class SearchComponent {\n  private searchService = inject(SearchService);\n  private searchTerms$ = new Subject<string>();\n\n  // switchMap отменяет предыдущий запрос при новом вводе\n  results$ = this.searchTerms$.pipe(\n    debounceTime(300),           // Ждём 300мс паузы ввода\n    distinctUntilChanged(),       // Игнорируем одинаковые значения\n    switchMap(term =>             // Отменяет предыдущий запрос!\n      term ? this.searchService.search(term) : of([])\n    )\n  );\n\n  onSearch(event: Event): void {\n    const target = event.target as HTMLInputElement;\n    this.searchTerms$.next(target.value);\n  }\n}' },
        { type: 'note', value: 'HTTP-запросы Angular по умолчанию одноразовые (complete после первого значения). Но для WebSocket или SSE поток может быть бесконечным — не забывайте отписываться!' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Сервис работы с REST API',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте сервис для работы с REST API JSONPlaceholder, включающий CRUD-операции, обработку ошибок и отображение состояния загрузки.',
      requirements: [
        'PostService с методами: getAll, getById, create, delete',
        'Обработка ошибок через catchError с понятными сообщениями',
        'PostListComponent отображает список постов через async pipe',
        'Состояния загрузки (loading) и ошибки (error) в компоненте',
        'Кнопка создания нового поста через POST-запрос',
        'Кнопка удаления поста'
      ],
      hint: 'Используйте https://jsonplaceholder.typicode.com/posts. HttpClient.get<Post[]>() возвращает Observable. Обрабатывайте ошибки через pipe(catchError()).',
      expectedOutput: 'Список постов загружается с API. Отображается индикатор загрузки. Ошибки показываются пользователю. Можно добавить и удалить пост.',
      solution: `import { Injectable, inject, Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, retry, tap, finalize } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';

interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

@Injectable({ providedIn: 'root' })
export class PostService {
  private http = inject(HttpClient);
  private apiUrl = 'https://jsonplaceholder.typicode.com/posts';

  getAll(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getById(id: number): Observable<Post> {
    return this.http.get<Post>(\`\${this.apiUrl}/\${id}\`).pipe(
      catchError(this.handleError)
    );
  }

  create(post: Omit<Post, 'id'>): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, post).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(\`\${this.apiUrl}/\${id}\`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let message = 'Произошла неизвестная ошибка';
    if (error.status === 0) {
      message = 'Нет подключения к серверу';
    } else if (error.status === 404) {
      message = 'Ресурс не найден';
    } else if (error.status >= 500) {
      message = 'Ошибка сервера';
    }
    return throwError(() => new Error(message));
  }
}

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [AsyncPipe],
  template: \`
    <h2>Посты</h2>
    <button (click)="createPost()">+ Новый пост</button>

    @if (error) {
      <div class="error">
        <p>{{ error }}</p>
        <button (click)="loadPosts()">Повторить</button>
      </div>
    }

    @if (loading) {
      <p>Загрузка...</p>
    }

    @for (post of posts; track post.id) {
      <div class="post">
        <h3>{{ post.title }}</h3>
        <p>{{ post.body }}</p>
        <button (click)="deletePost(post.id)">Удалить</button>
      </div>
    }
  \`
})
export class PostListComponent implements OnInit {
  private postService = inject(PostService);
  posts: Post[] = [];
  loading = false;
  error: string | null = null;

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.loading = true;
    this.error = null;
    this.postService.getAll().subscribe({
      next: (posts) => {
        this.posts = posts.slice(0, 10);
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  createPost(): void {
    const newPost = { userId: 1, title: 'Новый пост', body: 'Содержание нового поста' };
    this.postService.create(newPost).subscribe({
      next: (post) => { this.posts = [post, ...this.posts]; },
      error: (err) => { this.error = err.message; }
    });
  }

  deletePost(id: number): void {
    this.postService.delete(id).subscribe({
      next: () => { this.posts = this.posts.filter(p => p.id !== id); },
      error: (err) => { this.error = err.message; }
    });
  }
}`,
      explanation: 'PostService инкапсулирует всю работу с API. Каждый метод возвращает типизированный Observable. catchError перехватывает ошибки и возвращает понятное сообщение. Компонент управляет состояниями loading и error. retry(1) автоматически повторяет неудачный запрос один раз.'
    }
  ]
}
