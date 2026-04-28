export default {
  id: 21,
  title: 'Тестирование сервисов и HTTP',
  description: 'Тестирование сервисов, HttpClientTestingModule, мок HTTP-запросов и тестирование интерцепторов',
  lessons: [
    {
      id: 1,
      title: 'Тестирование простых сервисов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Сервисы без зависимостей тестируются просто: создаём экземпляр и проверяем методы. Для сервисов с зависимостями используем TestBed и моки.' },
        { type: 'heading', value: 'Тест простого сервиса' },
        { type: 'code', language: 'typescript', value: '// calculator.service.spec.ts\nimport { CalculatorService } from \'./calculator.service\';\n\ndescribe(\'CalculatorService\', () => {\n  let service: CalculatorService;\n\n  beforeEach(() => {\n    service = new CalculatorService();  // Простое создание\n  });\n\n  it(\'должен сложить два числа\', () => {\n    expect(service.add(2, 3)).toBe(5);\n  });\n\n  it(\'должен вычесть два числа\', () => {\n    expect(service.subtract(10, 4)).toBe(6);\n  });\n\n  it(\'должен бросить ошибку при делении на ноль\', () => {\n    expect(() => service.divide(10, 0)).toThrowError();\n  });\n});' },
        { type: 'heading', value: 'Тест сервиса с зависимостями' },
        { type: 'code', language: 'typescript', value: '// user.service.spec.ts\nimport { TestBed } from \'@angular/core/testing\';\nimport { UserService } from \'./user.service\';\nimport { LoggerService } from \'./logger.service\';\n\ndescribe(\'UserService\', () => {\n  let service: UserService;\n  let mockLogger: jasmine.SpyObj<LoggerService>;\n\n  beforeEach(() => {\n    mockLogger = jasmine.createSpyObj(\'LoggerService\', [\'log\', \'error\']);\n\n    TestBed.configureTestingModule({\n      providers: [\n        UserService,\n        { provide: LoggerService, useValue: mockLogger }\n      ]\n    });\n\n    service = TestBed.inject(UserService);\n  });\n\n  it(\'должен создаться\', () => {\n    expect(service).toBeTruthy();\n  });\n\n  it(\'должен добавить пользователя\', () => {\n    service.addUser({ name: \'Иван\', email: \'ivan@mail.ru\' });\n    expect(service.getAll().length).toBe(1);\n    expect(mockLogger.log).toHaveBeenCalledWith(\'Пользователь добавлен: Иван\');\n  });\n});' },
        { type: 'tip', value: 'TestBed.inject(Service) — получает экземпляр сервиса из DI контейнера. Это гарантирует, что сервис создан с правильными зависимостями (моками).' }
      ]
    },
    {
      id: 2,
      title: 'Тестирование HTTP-запросов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Angular предоставляет HttpClientTestingModule для тестирования HTTP-запросов без реального сервера. HttpTestingController позволяет перехватывать запросы и возвращать мок-данные.' },
        { type: 'heading', value: 'Настройка HttpClientTesting' },
        { type: 'code', language: 'typescript', value: 'import { TestBed } from \'@angular/core/testing\';\nimport { provideHttpClient } from \'@angular/common/http\';\nimport { provideHttpClientTesting, HttpTestingController } from \'@angular/common/http/testing\';\nimport { UserService } from \'./user.service\';\n\ndescribe(\'UserService (HTTP)\', () => {\n  let service: UserService;\n  let httpMock: HttpTestingController;\n\n  beforeEach(() => {\n    TestBed.configureTestingModule({\n      providers: [\n        UserService,\n        provideHttpClient(),\n        provideHttpClientTesting()  // Подменяет реальный HTTP\n      ]\n    });\n\n    service = TestBed.inject(UserService);\n    httpMock = TestBed.inject(HttpTestingController);\n  });\n\n  afterEach(() => {\n    // Проверяем, что нет незавершённых запросов\n    httpMock.verify();\n  });\n\n  it(\'должен получить список пользователей\', () => {\n    const mockUsers = [\n      { id: 1, name: \'Иван\', email: \'ivan@mail.ru\' },\n      { id: 2, name: \'Мария\', email: \'maria@mail.ru\' }\n    ];\n\n    service.getAll().subscribe(users => {\n      expect(users.length).toBe(2);\n      expect(users[0].name).toBe(\'Иван\');\n    });\n\n    // Перехватываем запрос\n    const req = httpMock.expectOne(\'/api/users\');\n    expect(req.request.method).toBe(\'GET\');\n\n    // Отправляем мок-ответ\n    req.flush(mockUsers);\n  });\n});' },
        { type: 'note', value: 'httpMock.verify() в afterEach проверяет, что все ожидаемые запросы были обработаны и нет \"висящих\" запросов. Это предотвращает ложные успехи.' }
      ]
    },
    {
      id: 3,
      title: 'Тестирование POST, PUT, DELETE',
      type: 'theory',
      content: [
        { type: 'text', value: 'Кроме GET-запросов, важно тестировать POST, PUT и DELETE, проверяя тело запроса, заголовки и обработку ответов.' },
        { type: 'heading', value: 'Тест CRUD операций' },
        { type: 'code', language: 'typescript', value: '// POST\nit(\'должен создать пользователя\', () => {\n  const newUser = { name: \'Алексей\', email: \'alex@mail.ru\' };\n  const createdUser = { id: 3, ...newUser };\n\n  service.create(newUser).subscribe(user => {\n    expect(user.id).toBe(3);\n    expect(user.name).toBe(\'Алексей\');\n  });\n\n  const req = httpMock.expectOne(\'/api/users\');\n  expect(req.request.method).toBe(\'POST\');\n  expect(req.request.body).toEqual(newUser);  // Проверяем тело запроса\n  req.flush(createdUser);\n});\n\n// PUT\nit(\'должен обновить пользователя\', () => {\n  const updates = { name: \'Иван Обновлённый\' };\n\n  service.update(1, updates).subscribe(user => {\n    expect(user.name).toBe(\'Иван Обновлённый\');\n  });\n\n  const req = httpMock.expectOne(\'/api/users/1\');\n  expect(req.request.method).toBe(\'PUT\');\n  expect(req.request.body).toEqual(updates);\n  req.flush({ id: 1, name: \'Иван Обновлённый\', email: \'ivan@mail.ru\' });\n});\n\n// DELETE\nit(\'должен удалить пользователя\', () => {\n  service.delete(1).subscribe(() => {\n    // Успех\n  });\n\n  const req = httpMock.expectOne(\'/api/users/1\');\n  expect(req.request.method).toBe(\'DELETE\');\n  req.flush(null);\n});' },
        { type: 'heading', value: 'Тест обработки ошибок' },
        { type: 'code', language: 'typescript', value: 'it(\'должен обработать ошибку 404\', () => {\n  service.getById(999).subscribe({\n    next: () => fail(\'Должна быть ошибка\'),\n    error: (err) => {\n      expect(err.message).toContain(\'не найден\');\n    }\n  });\n\n  const req = httpMock.expectOne(\'/api/users/999\');\n  req.flush(\'Not Found\', { status: 404, statusText: \'Not Found\' });\n});\n\nit(\'должен обработать сетевую ошибку\', () => {\n  service.getAll().subscribe({\n    next: () => fail(\'Должна быть ошибка\'),\n    error: (err) => {\n      expect(err.message).toContain(\'Сервер недоступен\');\n    }\n  });\n\n  const req = httpMock.expectOne(\'/api/users\');\n  req.error(new ProgressEvent(\'error\'));  // Сетевая ошибка\n});' },
        { type: 'tip', value: 'req.flush(body, options) — успешный ответ. req.error(event) — сетевая ошибка. req.flush(body, { status: 404, statusText: ... }) — HTTP ошибка с кодом.' }
      ]
    },
    {
      id: 4,
      title: 'Тестирование интерцепторов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Интерцепторы тестируются через реальные HTTP-запросы с HttpTestingController. Проверяем, что интерцептор правильно модифицирует запросы и ответы.' },
        { type: 'heading', value: 'Тест Auth Interceptor' },
        { type: 'code', language: 'typescript', value: 'import { provideHttpClient, withInterceptors } from \'@angular/common/http\';\nimport { provideHttpClientTesting, HttpTestingController } from \'@angular/common/http/testing\';\nimport { authInterceptor } from \'./auth.interceptor\';\n\ndescribe(\'AuthInterceptor\', () => {\n  let httpMock: HttpTestingController;\n  let http: HttpClient;\n  let mockAuthService: jasmine.SpyObj<AuthService>;\n\n  beforeEach(() => {\n    mockAuthService = jasmine.createSpyObj(\'AuthService\', [\'getToken\']);\n\n    TestBed.configureTestingModule({\n      providers: [\n        provideHttpClient(withInterceptors([authInterceptor])),\n        provideHttpClientTesting(),\n        { provide: AuthService, useValue: mockAuthService }\n      ]\n    });\n\n    http = TestBed.inject(HttpClient);\n    httpMock = TestBed.inject(HttpTestingController);\n  });\n\n  afterEach(() => httpMock.verify());\n\n  it(\'должен добавить Authorization заголовок\', () => {\n    mockAuthService.getToken.and.returnValue(\'test-token-123\');\n\n    http.get(\'/api/data\').subscribe();\n\n    const req = httpMock.expectOne(\'/api/data\');\n    expect(req.request.headers.get(\'Authorization\'))\n      .toBe(\'Bearer test-token-123\');\n    req.flush({});\n  });\n\n  it(\'не должен добавлять заголовок без токена\', () => {\n    mockAuthService.getToken.and.returnValue(null);\n\n    http.get(\'/api/data\').subscribe();\n\n    const req = httpMock.expectOne(\'/api/data\');\n    expect(req.request.headers.has(\'Authorization\')).toBeFalse();\n    req.flush({});\n  });\n});' },
        { type: 'note', value: 'Интерцептор тестируется косвенно — через HTTP-запрос. Мы проверяем, что перехваченный запрос содержит нужные заголовки или что ответ обработан правильно.' }
      ]
    },
    {
      id: 5,
      title: 'Тестирование Observable сервисов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Сервисы с BehaviorSubject и реактивной логикой требуют тестирования Observable потоков. Важно проверять последовательность значений и побочные эффекты.' },
        { type: 'heading', value: 'Тест сервиса с BehaviorSubject' },
        { type: 'code', language: 'typescript', value: 'describe(\'CartService\', () => {\n  let service: CartService;\n\n  beforeEach(() => {\n    TestBed.configureTestingModule({ providers: [CartService] });\n    service = TestBed.inject(CartService);\n  });\n\n  it(\'должен начинаться с пустой корзины\', (done) => {\n    service.items$.subscribe(items => {\n      expect(items.length).toBe(0);\n      done();\n    });\n  });\n\n  it(\'должен добавить товар\', (done) => {\n    service.addItem({ id: 1, name: \'Ноутбук\', price: 75000 });\n\n    service.items$.subscribe(items => {\n      expect(items.length).toBe(1);\n      expect(items[0].name).toBe(\'Ноутбук\');\n      expect(items[0].quantity).toBe(1);\n      done();\n    });\n  });\n\n  it(\'должен увеличить quantity при повторном добавлении\', (done) => {\n    service.addItem({ id: 1, name: \'Ноутбук\', price: 75000 });\n    service.addItem({ id: 1, name: \'Ноутбук\', price: 75000 });\n\n    service.items$.subscribe(items => {\n      expect(items.length).toBe(1);\n      expect(items[0].quantity).toBe(2);\n      done();\n    });\n  });\n\n  it(\'должен правильно считать общую стоимость\', (done) => {\n    service.addItem({ id: 1, name: \'Ноутбук\', price: 75000 });\n    service.addItem({ id: 2, name: \'Мышка\', price: 3000 });\n\n    service.totalPrice$.subscribe(total => {\n      expect(total).toBe(78000);\n      done();\n    });\n  });\n\n  it(\'должен удалить товар\', (done) => {\n    service.addItem({ id: 1, name: \'Ноутбук\', price: 75000 });\n    service.addItem({ id: 2, name: \'Мышка\', price: 3000 });\n    service.removeItem(1);\n\n    service.items$.subscribe(items => {\n      expect(items.length).toBe(1);\n      expect(items[0].id).toBe(2);\n      done();\n    });\n  });\n\n  it(\'должен очистить корзину\', (done) => {\n    service.addItem({ id: 1, name: \'Ноутбук\', price: 75000 });\n    service.clear();\n\n    service.items$.subscribe(items => {\n      expect(items.length).toBe(0);\n      done();\n    });\n  });\n});' },
        { type: 'tip', value: 'BehaviorSubject сразу выдаёт текущее значение при подписке. Поэтому можно подписаться ПОСЛЕ изменений и получить актуальное состояние.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Тесты для API сервиса',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напишите полный набор тестов для сервиса работы с API задач: GET, POST, DELETE, обработка ошибок.',
      requirements: [
        'Тест GET /api/todos — успешная загрузка списка',
        'Тест GET /api/todos/:id — загрузка одной задачи',
        'Тест POST /api/todos — создание задачи с проверкой тела запроса',
        'Тест DELETE /api/todos/:id — удаление задачи',
        'Тест обработки ошибки 500',
        'httpMock.verify() в afterEach'
      ],
      hint: 'provideHttpClientTesting() для мока HTTP. httpMock.expectOne(url) перехватывает запрос. req.flush(data) отправляет ответ. req.flush(msg, {status: 500}) для ошибок.',
      expectedOutput: 'Все тесты проходят. HTTP-запросы перехватываются и проверяются. Ошибки обрабатываются правильно.',
      solution: `import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

// todo.service.ts (тестируемый сервис)
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class TodoService {
  private http = inject(HttpClient);
  private url = '/api/todos';

  getAll(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.url).pipe(
      catchError(err => throwError(() => new Error('Ошибка загрузки')))
    );
  }
  getById(id: number): Observable<Todo> {
    return this.http.get<Todo>(\`\${this.url}/\${id}\`);
  }
  create(todo: Omit<Todo, 'id'>): Observable<Todo> {
    return this.http.post<Todo>(this.url, todo);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(\`\${this.url}/\${id}\`);
  }
}

// todo.service.spec.ts
describe('TodoService', () => {
  let service: TodoService;
  let httpMock: HttpTestingController;

  const mockTodos: Todo[] = [
    { id: 1, title: 'Изучить Angular', completed: true },
    { id: 2, title: 'Написать тесты', completed: false }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TodoService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(TodoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('должен создаться', () => {
    expect(service).toBeTruthy();
  });

  it('GET /api/todos — должен вернуть список задач', () => {
    service.getAll().subscribe(todos => {
      expect(todos.length).toBe(2);
      expect(todos).toEqual(mockTodos);
    });

    const req = httpMock.expectOne('/api/todos');
    expect(req.request.method).toBe('GET');
    req.flush(mockTodos);
  });

  it('GET /api/todos/1 — должен вернуть задачу по id', () => {
    service.getById(1).subscribe(todo => {
      expect(todo.id).toBe(1);
      expect(todo.title).toBe('Изучить Angular');
    });

    const req = httpMock.expectOne('/api/todos/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockTodos[0]);
  });

  it('POST /api/todos — должен создать задачу', () => {
    const newTodo = { title: 'Новая задача', completed: false };
    const created = { id: 3, ...newTodo };

    service.create(newTodo).subscribe(todo => {
      expect(todo.id).toBe(3);
      expect(todo.title).toBe('Новая задача');
    });

    const req = httpMock.expectOne('/api/todos');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newTodo);
    req.flush(created);
  });

  it('DELETE /api/todos/1 — должен удалить задачу', () => {
    service.delete(1).subscribe();

    const req = httpMock.expectOne('/api/todos/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('должен обработать ошибку сервера', () => {
    service.getAll().subscribe({
      next: () => fail('Ожидалась ошибка'),
      error: (err) => {
        expect(err.message).toBe('Ошибка загрузки');
      }
    });

    const req = httpMock.expectOne('/api/todos');
    req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
  });
});`,
      explanation: 'provideHttpClientTesting() заменяет реальный HTTP-транспорт на мок. httpMock.expectOne(url) перехватывает запрос к указанному URL. req.request проверяет метод, тело, заголовки. req.flush(data) отправляет мок-ответ. req.flush(msg, {status}) имитирует HTTP-ошибку. httpMock.verify() проверяет отсутствие необработанных запросов.'
    }
  ]
}
