export default {
  id: 20,
  title: 'Тестирование компонентов',
  description: 'Модульное тестирование Angular компонентов: TestBed, ComponentFixture, взаимодействие с DOM',
  lessons: [
    {
      id: 1,
      title: 'Основы тестирования в Angular',
      type: 'theory',
      content: [
        { type: 'text', value: 'Angular CLI генерирует тесты автоматически для каждого компонента и сервиса. По умолчанию используются Jasmine (тестовый фреймворк) и Karma (test runner). Альтернатива — Jest.' },
        { type: 'heading', value: 'Запуск тестов' },
        { type: 'code', language: 'bash', value: '# Запуск всех тестов\nng test\n\n# Однократный запуск (для CI)\nng test --watch=false --browsers=ChromeHeadless\n\n# Запуск конкретного файла\nng test --include=**/user.component.spec.ts' },
        { type: 'heading', value: 'Структура теста' },
        { type: 'code', language: 'typescript', value: '// user.component.spec.ts\nimport { ComponentFixture, TestBed } from \'@angular/core/testing\';\nimport { UserComponent } from \'./user.component\';\n\ndescribe(\'UserComponent\', () => {\n  let component: UserComponent;\n  let fixture: ComponentFixture<UserComponent>;\n\n  beforeEach(async () => {\n    await TestBed.configureTestingModule({\n      imports: [UserComponent]  // Standalone компонент\n    }).compileComponents();\n\n    fixture = TestBed.createComponent(UserComponent);\n    component = fixture.componentInstance;\n    fixture.detectChanges();  // Запускаем change detection\n  });\n\n  it(\'должен создаться\', () => {\n    expect(component).toBeTruthy();\n  });\n\n  it(\'должен отображать имя\', () => {\n    component.name = \'Иван\';\n    fixture.detectChanges();\n\n    const element = fixture.nativeElement;\n    expect(element.querySelector(\'h1\').textContent).toContain(\'Иван\');\n  });\n});' },
        { type: 'heading', value: 'Ключевые понятия' },
        { type: 'list', value: [
          'TestBed — утилита для настройки тестового модуля (аналог NgModule для тестов)',
          'ComponentFixture — обёртка вокруг компонента для тестирования',
          'fixture.componentInstance — экземпляр класса компонента',
          'fixture.nativeElement — корневой DOM-элемент компонента',
          'fixture.detectChanges() — запускает change detection вручную',
          'fixture.debugElement — обёртка с утилитами для поиска элементов'
        ] },
        { type: 'tip', value: 'fixture.detectChanges() нужно вызывать после каждого изменения данных компонента. Иначе DOM не обновится и тесты будут проверять устаревшее состояние.' }
      ]
    },
    {
      id: 2,
      title: 'Тестирование шаблона и DOM',
      type: 'theory',
      content: [
        { type: 'text', value: 'Тестирование шаблона проверяет, что компонент правильно отображает данные и реагирует на пользовательские действия.' },
        { type: 'heading', value: 'Проверка содержимого' },
        { type: 'code', language: 'typescript', value: 'describe(\'ProductCardComponent\', () => {\n  let component: ProductCardComponent;\n  let fixture: ComponentFixture<ProductCardComponent>;\n\n  beforeEach(async () => {\n    await TestBed.configureTestingModule({\n      imports: [ProductCardComponent]\n    }).compileComponents();\n    fixture = TestBed.createComponent(ProductCardComponent);\n    component = fixture.componentInstance;\n  });\n\n  it(\'должен отображать название продукта\', () => {\n    component.product = { id: 1, name: \'Ноутбук\', price: 75000 };\n    fixture.detectChanges();\n\n    const nameEl = fixture.nativeElement.querySelector(\'.product-name\');\n    expect(nameEl.textContent).toBe(\'Ноутбук\');\n  });\n\n  it(\'должен отображать цену в формате\', () => {\n    component.product = { id: 1, name: \'Ноутбук\', price: 75000 };\n    fixture.detectChanges();\n\n    const priceEl = fixture.nativeElement.querySelector(\'.price\');\n    expect(priceEl.textContent).toContain(\'75\');\n  });\n\n  it(\'должен показывать бейдж \"Нет в наличии\" для outOfStock\', () => {\n    component.product = { id: 1, name: \'Ноутбук\', price: 75000, inStock: false };\n    fixture.detectChanges();\n\n    const badge = fixture.nativeElement.querySelector(\'.out-of-stock\');\n    expect(badge).toBeTruthy();\n  });\n\n  it(\'не должен показывать бейдж для товара в наличии\', () => {\n    component.product = { id: 1, name: \'Ноутбук\', price: 75000, inStock: true };\n    fixture.detectChanges();\n\n    const badge = fixture.nativeElement.querySelector(\'.out-of-stock\');\n    expect(badge).toBeNull();\n  });\n});' },
        { type: 'heading', value: 'Тестирование событий' },
        { type: 'code', language: 'typescript', value: 'it(\'должен вызывать onAddToCart при клике на кнопку\', () => {\n  component.product = { id: 1, name: \'Ноутбук\', price: 75000, inStock: true };\n  fixture.detectChanges();\n\n  spyOn(component, \'onAddToCart\');\n\n  const button = fixture.nativeElement.querySelector(\'button.add-to-cart\');\n  button.click();\n\n  expect(component.onAddToCart).toHaveBeenCalled();\n});\n\nit(\'должен эмитить событие addToCart с продуктом\', () => {\n  component.product = { id: 1, name: \'Ноутбук\', price: 75000, inStock: true };\n  fixture.detectChanges();\n\n  let emittedProduct: Product | undefined;\n  component.addToCart.subscribe(p => emittedProduct = p);\n\n  const button = fixture.nativeElement.querySelector(\'button.add-to-cart\');\n  button.click();\n\n  expect(emittedProduct).toEqual(component.product);\n});\n\nit(\'должен обновлять значение при вводе\', () => {\n  fixture.detectChanges();\n\n  const input = fixture.nativeElement.querySelector(\'input\');\n  input.value = \'новый текст\';\n  input.dispatchEvent(new Event(\'input\'));\n  fixture.detectChanges();\n\n  expect(component.searchTerm).toBe(\'новый текст\');\n});' },
        { type: 'note', value: 'Для проверки @Output используйте подписку на EventEmitter. Для событий DOM используйте element.click() или element.dispatchEvent().' }
      ]
    },
    {
      id: 3,
      title: 'Тестирование с зависимостями',
      type: 'theory',
      content: [
        { type: 'text', value: 'Компоненты часто зависят от сервисов. В тестах используются моки (подмены), чтобы изолировать компонент от реальных зависимостей.' },
        { type: 'heading', value: 'Мок сервиса' },
        { type: 'code', language: 'typescript', value: 'describe(\'UserListComponent\', () => {\n  let component: UserListComponent;\n  let fixture: ComponentFixture<UserListComponent>;\n  let mockUserService: jasmine.SpyObj<UserService>;\n\n  beforeEach(async () => {\n    // Создаём мок сервиса\n    mockUserService = jasmine.createSpyObj(\'UserService\', [\'getAll\', \'delete\']);\n    mockUserService.getAll.and.returnValue(of([\n      { id: 1, name: \'Иван\', email: \'ivan@mail.ru\' },\n      { id: 2, name: \'Мария\', email: \'maria@mail.ru\' }\n    ]));\n\n    await TestBed.configureTestingModule({\n      imports: [UserListComponent],\n      providers: [\n        { provide: UserService, useValue: mockUserService }  // Подменяем!\n      ]\n    }).compileComponents();\n\n    fixture = TestBed.createComponent(UserListComponent);\n    component = fixture.componentInstance;\n    fixture.detectChanges();\n  });\n\n  it(\'должен загрузить пользователей при инициализации\', () => {\n    expect(mockUserService.getAll).toHaveBeenCalled();\n  });\n\n  it(\'должен отобразить 2 пользователей\', () => {\n    const items = fixture.nativeElement.querySelectorAll(\'.user-item\');\n    expect(items.length).toBe(2);\n  });\n\n  it(\'должен вызвать delete при клике на удаление\', () => {\n    mockUserService.delete.and.returnValue(of(void 0));\n\n    component.deleteUser(1);\n\n    expect(mockUserService.delete).toHaveBeenCalledWith(1);\n  });\n});' },
        { type: 'heading', value: 'Мок дочерних компонентов' },
        { type: 'code', language: 'typescript', value: '// Если дочерний компонент сложный, замените его моком\n@Component({\n  selector: \'app-user-card\',\n  standalone: true,\n  template: \'<div class="mock-user-card"></div>\'\n})\nclass MockUserCardComponent {\n  @Input() user: any;\n  @Output() deleted = new EventEmitter();\n}\n\nbeforeEach(async () => {\n  await TestBed.configureTestingModule({\n    imports: [UserListComponent]\n  })\n  .overrideComponent(UserListComponent, {\n    remove: { imports: [UserCardComponent] },\n    add: { imports: [MockUserCardComponent] }\n  })\n  .compileComponents();\n});' },
        { type: 'tip', value: 'jasmine.createSpyObj создаёт мок с методами-шпионами. Используйте .and.returnValue() для задания возвращаемого значения. .and.returnValue(of(data)) для Observable.' }
      ]
    },
    {
      id: 4,
      title: 'Тестирование асинхронного кода',
      type: 'theory',
      content: [
        { type: 'text', value: 'Angular предоставляет утилиты для тестирования асинхронного кода: fakeAsync, tick, waitForAsync и done callback.' },
        { type: 'heading', value: 'fakeAsync и tick' },
        { type: 'code', language: 'typescript', value: 'import { fakeAsync, tick } from \'@angular/core/testing\';\n\nit(\'должен показать результаты после задержки\', fakeAsync(() => {\n  component.search(\'Angular\');\n  // Не ждём реальные 300мс, а \"прокручиваем\" время\n  tick(300);  // Пропустить 300мс debounceTime\n  fixture.detectChanges();\n\n  const results = fixture.nativeElement.querySelectorAll(\'.result\');\n  expect(results.length).toBeGreaterThan(0);\n}));\n\nit(\'должен обновить данные после HTTP-запроса\', fakeAsync(() => {\n  mockService.getData.and.returnValue(of(mockData).pipe(delay(1000)));\n\n  component.loadData();\n  expect(component.loading).toBeTrue();\n\n  tick(1000);  // Прокрутить 1 секунду\n  fixture.detectChanges();\n\n  expect(component.loading).toBeFalse();\n  expect(component.data).toEqual(mockData);\n}));' },
        { type: 'heading', value: 'waitForAsync' },
        { type: 'code', language: 'typescript', value: '// Для реальных асинхронных операций (Promise)\nit(\'должен загрузить данные\', waitForAsync(() => {\n  mockService.getData.and.returnValue(Promise.resolve(mockData));\n\n  component.loadData();\n\n  fixture.whenStable().then(() => {\n    fixture.detectChanges();\n    expect(component.data).toEqual(mockData);\n  });\n}));' },
        { type: 'heading', value: 'Тестирование Observable' },
        { type: 'code', language: 'typescript', value: 'it(\'должен получить пользователей из Observable\', (done) => {\n  mockService.getUsers.and.returnValue(of([\n    { id: 1, name: \'Иван\' }\n  ]));\n\n  component.users$.subscribe(users => {\n    expect(users.length).toBe(1);\n    expect(users[0].name).toBe(\'Иван\');\n    done();  // Сигнал о завершении асинхронного теста\n  });\n\n  component.loadUsers();\n});' },
        { type: 'note', value: 'fakeAsync + tick — для контроля виртуального времени (debounce, delay). waitForAsync — для реальных Promise. done — для ручного завершения асинхронного теста.' }
      ]
    },
    {
      id: 5,
      title: 'DebugElement и запросы к DOM',
      type: 'theory',
      content: [
        { type: 'text', value: 'DebugElement — обёртка Angular над DOM-элементом, предоставляющая утилиты для поиска элементов, проверки директив и эмуляции событий.' },
        { type: 'heading', value: 'Использование DebugElement' },
        { type: 'code', language: 'typescript', value: 'import { By } from \'@angular/platform-browser\';\nimport { DebugElement } from \'@angular/core\';\n\n// Поиск по CSS-селектору\nconst heading: DebugElement = fixture.debugElement.query(By.css(\'h1\'));\nexpect(heading.nativeElement.textContent).toBe(\'Заголовок\');\n\n// Поиск всех элементов\nconst items: DebugElement[] = fixture.debugElement.queryAll(By.css(\'.item\'));\nexpect(items.length).toBe(3);\n\n// Поиск по директиве\nconst tooltips = fixture.debugElement.queryAll(By.directive(TooltipDirective));\nexpect(tooltips.length).toBe(2);\n\n// Эмуляция событий через triggerEventHandler\nconst button = fixture.debugElement.query(By.css(\'button\'));\nbutton.triggerEventHandler(\'click\', null);\nfixture.detectChanges();\n\n// Проверка атрибутов\nconst link = fixture.debugElement.query(By.css(\'a\'));\nexpect(link.attributes[\'href\']).toBe(\'/users/1\');\n\n// Проверка CSS-классов\nconst card = fixture.debugElement.query(By.css(\'.card\'));\nexpect(card.classes[\'active\']).toBeTrue();\n\n// Проверка стилей\nexpect(card.styles[\'background-color\']).toBe(\'red\');' },
        { type: 'tip', value: 'fixture.nativeElement — прямой доступ к DOM (querySelector). fixture.debugElement — Angular обёртка с By.css, By.directive и triggerEventHandler. Оба подхода валидны.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Тестирование компонента счётчика',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напишите полный набор тестов для компонента счётчика: отображение, события, взаимодействие с сервисом.',
      requirements: [
        'Тест создания компонента',
        'Тест отображения начального значения',
        'Тест клика на кнопку "+" (инкремент)',
        'Тест клика на кнопку "-" (декремент)',
        'Тест блокировки кнопки "-" при значении 0',
        'Тест мока сервиса для сохранения значения'
      ],
      hint: 'TestBed.configureTestingModule для настройки. fixture.detectChanges() после изменений. jasmine.createSpyObj для мока сервиса.',
      expectedOutput: 'Все тесты проходят: компонент создаётся, отображает данные, реагирует на клики, взаимодействует с сервисом.',
      solution: `// counter.component.ts
import { Component, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CounterService {
  save(value: number): Observable<void> {
    return this.http.post<void>('/api/counter', { value });
  }
}

@Component({
  selector: 'app-counter',
  standalone: true,
  template: \`
    <h2 class="value">{{ count }}</h2>
    <button class="decrement" (click)="decrement()" [disabled]="count <= 0">-</button>
    <button class="increment" (click)="increment()">+</button>
    <button class="save" (click)="save()">Сохранить</button>
  \`
})
export class CounterComponent {
  private counterService = inject(CounterService);
  count = 0;

  increment(): void { this.count++; }
  decrement(): void { if (this.count > 0) this.count--; }
  save(): void { this.counterService.save(this.count).subscribe(); }
}

// counter.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CounterComponent } from './counter.component';
import { CounterService } from './counter.service';

describe('CounterComponent', () => {
  let component: CounterComponent;
  let fixture: ComponentFixture<CounterComponent>;
  let mockService: jasmine.SpyObj<CounterService>;

  beforeEach(async () => {
    mockService = jasmine.createSpyObj('CounterService', ['save']);
    mockService.save.and.returnValue(of(void 0));

    await TestBed.configureTestingModule({
      imports: [CounterComponent],
      providers: [{ provide: CounterService, useValue: mockService }]
    }).compileComponents();

    fixture = TestBed.createComponent(CounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('должен создаться', () => {
    expect(component).toBeTruthy();
  });

  it('должен отображать начальное значение 0', () => {
    const valueEl = fixture.nativeElement.querySelector('.value');
    expect(valueEl.textContent).toContain('0');
  });

  it('должен увеличить счётчик при клике на +', () => {
    const btn = fixture.nativeElement.querySelector('.increment');
    btn.click();
    fixture.detectChanges();

    expect(component.count).toBe(1);
    const valueEl = fixture.nativeElement.querySelector('.value');
    expect(valueEl.textContent).toContain('1');
  });

  it('должен уменьшить счётчик при клике на -', () => {
    component.count = 5;
    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector('.decrement');
    btn.click();
    fixture.detectChanges();

    expect(component.count).toBe(4);
  });

  it('не должен уменьшать ниже 0', () => {
    component.count = 0;
    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector('.decrement');
    expect(btn.disabled).toBeTrue();

    component.decrement();
    expect(component.count).toBe(0);
  });

  it('должен вызвать сервис при сохранении', () => {
    component.count = 42;
    const btn = fixture.nativeElement.querySelector('.save');
    btn.click();

    expect(mockService.save).toHaveBeenCalledWith(42);
  });
});`,
      explanation: 'TestBed создаёт тестовый модуль с компонентом и мок-сервисом. fixture.detectChanges() обновляет DOM после изменений. querySelector находит элементы в шаблоне. element.click() эмулирует клик. jasmine.createSpyObj создаёт мок с методами-шпионами. toHaveBeenCalledWith проверяет аргументы вызова.'
    }
  ]
}
