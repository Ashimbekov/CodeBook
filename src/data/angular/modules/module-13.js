export default {
  id: 13,
  title: 'RxJS: Основы',
  description: 'Observable, Observer, Subject, основные операторы и паттерны реактивного программирования',
  lessons: [
    {
      id: 1,
      title: 'Что такое RxJS и Observable',
      type: 'theory',
      content: [
        { type: 'text', value: 'RxJS (Reactive Extensions for JavaScript) — библиотека реактивного программирования. Observable — это поток данных, на который можно подписаться. Angular использует RxJS повсеместно: HttpClient, Router, Forms, EventEmitter.' },
        { type: 'heading', value: 'Observable vs Promise' },
        { type: 'code', language: 'typescript', value: '// Promise — одно значение, выполняется сразу\nconst promise = new Promise<string>(resolve => {\n  resolve(\'Привет\');  // Одно значение\n});\npromise.then(value => console.log(value));\n\n// Observable — поток значений, выполняется при подписке\nimport { Observable } from \'rxjs\';\n\nconst observable = new Observable<string>(subscriber => {\n  subscriber.next(\'Привет\');    // Первое значение\n  subscriber.next(\'Мир\');       // Второе значение\n  setTimeout(() => {\n    subscriber.next(\'Задержка\');  // Третье — через 1 сек\n    subscriber.complete();       // Завершение потока\n  }, 1000);\n});\n\n// Подписка запускает Observable\nconst subscription = observable.subscribe({\n  next: (value) => console.log(value),     // Каждое значение\n  error: (err) => console.error(err),       // Ошибка\n  complete: () => console.log(\'Завершено\')  // Завершение\n});\n\n// Отписка (важно для предотвращения утечек!)\nsubscription.unsubscribe();' },
        { type: 'heading', value: 'Ключевые отличия Observable от Promise' },
        { type: 'list', value: [
          'Observable ленивый — выполняется только при подписке',
          'Observable может выдавать множество значений (поток)',
          'Observable можно отменить (unsubscribe)',
          'Observable поддерживает операторы трансформации (map, filter и др.)',
          'Promise — одно значение, нельзя отменить, выполняется сразу'
        ] },
        { type: 'tip', value: 'В Angular почти всё Observable: HTTP-ответы, параметры маршрутов, события форм. Понимание RxJS критически важно для Angular-разработчика.' }
      ]
    },
    {
      id: 2,
      title: 'Создание Observable',
      type: 'theory',
      content: [
        { type: 'text', value: 'RxJS предоставляет множество функций для создания Observable: of, from, interval, timer, fromEvent и другие.' },
        { type: 'heading', value: 'Функции создания' },
        { type: 'code', language: 'typescript', value: 'import { of, from, interval, timer, fromEvent, EMPTY, NEVER, throwError } from \'rxjs\';\n\n// of — создаёт Observable из значений\nof(1, 2, 3).subscribe(v => console.log(v));\n// 1, 2, 3, complete\n\n// of с массивом (выдаёт ВЕСЬ массив как одно значение)\nof([1, 2, 3]).subscribe(v => console.log(v));\n// [1, 2, 3], complete\n\n// from — создаёт Observable из массива, Promise, итерируемого\nfrom([1, 2, 3]).subscribe(v => console.log(v));\n// 1, 2, 3, complete (каждый элемент отдельно!)\n\nfrom(fetch(\'/api/users\').then(r => r.json())).subscribe(v => console.log(v));\n// Результат промиса\n\n// interval — выдаёт числа с интервалом (мс)\ninterval(1000).subscribe(v => console.log(v));\n// 0, 1, 2, 3, ... (каждую секунду)\n\n// timer — задержка перед первым значением\ntimer(2000).subscribe(() => console.log(\'Через 2 сек\'));\ntimer(1000, 500).subscribe(v => console.log(v));\n// Первое через 1с, далее каждые 500мс\n\n// fromEvent — из DOM-событий\nfromEvent(document, \'click\').subscribe(event => console.log(event));\n\n// EMPTY — сразу завершается\n// NEVER — никогда не завершается и не выдаёт значений\n// throwError — сразу выдаёт ошибку\nthrowError(() => new Error(\'Ошибка!\')).subscribe({\n  error: (err) => console.error(err.message)\n});' },
        { type: 'note', value: 'of() и from() — самые частые функции создания. of(array) выдаёт массив целиком, from(array) — каждый элемент по отдельности. Это важное различие!' }
      ]
    },
    {
      id: 3,
      title: 'Операторы трансформации: map, filter, tap',
      type: 'theory',
      content: [
        { type: 'text', value: 'Операторы — это функции, которые трансформируют, фильтруют и комбинируют потоки данных. Они применяются через метод pipe().' },
        { type: 'heading', value: 'Основные операторы' },
        { type: 'code', language: 'typescript', value: 'import { of, from } from \'rxjs\';\nimport { map, filter, tap, take, skip, distinctUntilChanged } from \'rxjs/operators\';\n\n// map — трансформирует каждое значение\nof(1, 2, 3).pipe(\n  map(x => x * 10)\n).subscribe(v => console.log(v));\n// 10, 20, 30\n\n// filter — пропускает только подходящие значения\nof(1, 2, 3, 4, 5, 6).pipe(\n  filter(x => x % 2 === 0)\n).subscribe(v => console.log(v));\n// 2, 4, 6\n\n// tap — побочный эффект без изменения значения (для логирования)\nof(1, 2, 3).pipe(\n  tap(v => console.log(\'До:\', v)),\n  map(x => x * 10),\n  tap(v => console.log(\'После:\', v))\n).subscribe();\n// До: 1, После: 10, До: 2, После: 20, ...\n\n// take — берёт первые N значений и завершается\ninterval(1000).pipe(\n  take(3)\n).subscribe(v => console.log(v));\n// 0, 1, 2, complete\n\n// skip — пропускает первые N значений\nof(1, 2, 3, 4, 5).pipe(\n  skip(2)\n).subscribe(v => console.log(v));\n// 3, 4, 5\n\n// distinctUntilChanged — пропускает повторяющиеся подряд значения\nof(1, 1, 2, 2, 3, 1).pipe(\n  distinctUntilChanged()\n).subscribe(v => console.log(v));\n// 1, 2, 3, 1' },
        { type: 'heading', value: 'Комбинирование операторов' },
        { type: 'code', language: 'typescript', value: '// Реальный пример: обработка списка пользователей\nthis.http.get<User[]>(\'/api/users\').pipe(\n  map(users => users.filter(u => u.isActive)),     // Только активные\n  map(users => users.sort((a, b) =>                 // Сортировка\n    a.name.localeCompare(b.name)\n  )),\n  tap(users => console.log(\'Загружено:\', users.length)), // Логирование\n).subscribe(users => this.users = users);' },
        { type: 'tip', value: 'pipe() принимает любое количество операторов. Они выполняются слева направо. Каждый оператор получает Observable и возвращает новый Observable.' }
      ]
    },
    {
      id: 4,
      title: 'Subject и BehaviorSubject',
      type: 'theory',
      content: [
        { type: 'text', value: 'Subject — это Observable, в который можно вручную отправлять значения. Он одновременно является и Observable (можно подписаться), и Observer (можно отправлять next/error/complete).' },
        { type: 'heading', value: 'Типы Subject' },
        { type: 'code', language: 'typescript', value: 'import { Subject, BehaviorSubject, ReplaySubject, AsyncSubject } from \'rxjs\';\n\n// Subject — базовый. Новые подписчики не получают предыдущие значения\nconst subject = new Subject<string>();\nsubject.next(\'Привет\');      // Никто не подписан — пропущено!\nsubject.subscribe(v => console.log(\'A:\', v));\nsubject.next(\'Мир\');         // A: Мир\nsubject.subscribe(v => console.log(\'B:\', v));\nsubject.next(\'RxJS\');        // A: RxJS, B: RxJS\n\n// BehaviorSubject — хранит текущее значение, отдаёт его новым подписчикам\nconst behavior = new BehaviorSubject<string>(\'начальное\');\nbehavior.subscribe(v => console.log(\'A:\', v)); // A: начальное (сразу!)\nbehavior.next(\'обновлено\');    // A: обновлено\nbehavior.subscribe(v => console.log(\'B:\', v)); // B: обновлено (последнее!)\nconsole.log(behavior.getValue()); // \'обновлено\' (синхронный доступ)\n\n// ReplaySubject — запоминает последние N значений\nconst replay = new ReplaySubject<string>(2); // Хранит 2 последних\nreplay.next(\'a\');\nreplay.next(\'b\');\nreplay.next(\'c\');\nreplay.subscribe(v => console.log(v));\n// b, c (последние 2)\n\n// AsyncSubject — выдаёт ТОЛЬКО последнее значение при complete\nconst async = new AsyncSubject<string>();\nasync.next(\'a\');\nasync.next(\'b\');\nasync.subscribe(v => console.log(v));\nasync.next(\'c\');\nasync.complete(); // Только сейчас: c' },
        { type: 'heading', value: 'BehaviorSubject в сервисах' },
        { type: 'code', language: 'typescript', value: '// Типичное использование в Angular\n@Injectable({ providedIn: \'root\' })\nexport class ThemeService {\n  private theme$ = new BehaviorSubject<\'light\' | \'dark\'>(\'light\');\n\n  // Публичный Observable (без возможности next)\n  readonly currentTheme$ = this.theme$.asObservable();\n\n  // Текущее значение\n  get currentTheme(): \'light\' | \'dark\' {\n    return this.theme$.getValue();\n  }\n\n  // Методы изменения\n  setTheme(theme: \'light\' | \'dark\'): void {\n    this.theme$.next(theme);\n  }\n\n  toggleTheme(): void {\n    this.theme$.next(this.currentTheme === \'light\' ? \'dark\' : \'light\');\n  }\n}' },
        { type: 'warning', value: 'Не используйте Subject.next() из шаблона. Subject — деталь реализации сервиса. Предоставляйте Observable через asObservable() и методы для изменения.' }
      ]
    },
    {
      id: 5,
      title: 'Управление подписками',
      type: 'theory',
      content: [
        { type: 'text', value: 'Утечки памяти — главная проблема с RxJS. Если подписка не отменена, она продолжает работать даже после уничтожения компонента. Angular предоставляет несколько способов управления подписками.' },
        { type: 'heading', value: 'Способы отписки' },
        { type: 'code', language: 'typescript', value: '// 1. Async pipe (лучший вариант!) — автоотписка\n@Component({\n  template: `@if (user$ | async; as user) { <p>{{ user.name }}</p> }`\n})\nexport class UserComponent {\n  user$ = inject(UserService).getUser();\n  // Async pipe сам отпишется при уничтожении компонента!\n}\n\n// 2. takeUntilDestroyed (Angular 16+)\nimport { takeUntilDestroyed } from \'@angular/core/rxjs-interop\';\n\n@Component({ /* ... */ })\nexport class TimerComponent {\n  private destroyRef = inject(DestroyRef);\n\n  ngOnInit(): void {\n    interval(1000).pipe(\n      takeUntilDestroyed(this.destroyRef)\n    ).subscribe(v => console.log(v));\n  }\n}\n\n// 3. В поле класса (без ngOnInit)\nexport class TimerComponent {\n  // takeUntilDestroyed() без аргумента — работает в контексте injection\n  timer$ = interval(1000).pipe(takeUntilDestroyed());\n}\n\n// 4. Ручная отписка через Subscription\nexport class OldComponent implements OnDestroy {\n  private subscription = new Subscription();\n\n  ngOnInit(): void {\n    this.subscription.add(\n      interval(1000).subscribe(v => console.log(v))\n    );\n    this.subscription.add(\n      fromEvent(window, \'resize\').subscribe(() => this.onResize())\n    );\n  }\n\n  ngOnDestroy(): void {\n    this.subscription.unsubscribe(); // Отписка от всех\n  }\n}' },
        { type: 'heading', value: 'Приоритет подходов' },
        { type: 'list', value: [
          '1. async pipe — лучший вариант, никакого кода для отписки',
          '2. takeUntilDestroyed() — для подписок в полях класса',
          '3. takeUntilDestroyed(destroyRef) — для подписок в ngOnInit',
          '4. Subscription + ngOnDestroy — устаревший, но рабочий подход'
        ] },
        { type: 'tip', value: 'HTTP-запросы Angular автоматически завершаются после одного ответа — для них отписка не обязательна. Но для interval, fromEvent, Subject — отписка критична!' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Поиск в реальном времени',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте компонент поиска с debounce, который реагирует на ввод пользователя и фильтрует список через Subject и операторы RxJS.',
      requirements: [
        'Subject для отправки поисковых запросов при вводе',
        'Операторы debounceTime(300), distinctUntilChanged, switchMap',
        'Отображение результатов через async pipe',
        'Индикатор загрузки при поиске',
        'Сообщение при пустом результате',
        'Автоотписка через takeUntilDestroyed или async pipe'
      ],
      hint: 'Subject.next(term) при каждом вводе. pipe(debounceTime(300), distinctUntilChanged(), switchMap(term => search(term))). Async pipe для отображения.',
      expectedOutput: 'Поиск с задержкой 300мс. Повторяющиеся запросы не отправляются. Предыдущие запросы отменяются. Результаты обновляются реактивно.',
      solution: `import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Subject, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap, catchError } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface SearchResult {
  id: number;
  title: string;
  description: string;
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [AsyncPipe],
  template: \`
    <h2>Поиск</h2>
    <input
      (input)="onSearch($event)"
      placeholder="Введите запрос..."
    />

    @if (loading) {
      <p class="loading">Поиск...</p>
    }

    @if (results$ | async; as results) {
      @if (results.length > 0) {
        @for (item of results; track item.id) {
          <div class="result">
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </div>
        }
      } @else if (searched) {
        <p>Ничего не найдено</p>
      }
    }
  \`
})
export class SearchComponent {
  private searchTerms$ = new Subject<string>();
  loading = false;
  searched = false;

  results$: Observable<SearchResult[]> = this.searchTerms$.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    tap(() => { this.loading = true; this.searched = true; }),
    switchMap(term => {
      if (!term.trim()) {
        this.loading = false;
        this.searched = false;
        return of([]);
      }
      return this.fakeSearch(term).pipe(
        tap(() => this.loading = false),
        catchError(() => {
          this.loading = false;
          return of([]);
        })
      );
    }),
    takeUntilDestroyed()
  );

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerms$.next(target.value);
  }

  private fakeSearch(term: string): Observable<SearchResult[]> {
    const allItems: SearchResult[] = [
      { id: 1, title: 'Angular Компоненты', description: 'Создание и использование компонентов' },
      { id: 2, title: 'RxJS Операторы', description: 'map, filter, switchMap и другие' },
      { id: 3, title: 'Angular Роутинг', description: 'Навигация и lazy loading' },
      { id: 4, title: 'TypeScript Типы', description: 'Интерфейсы, дженерики, декораторы' },
      { id: 5, title: 'Angular Формы', description: 'Reactive и Template-driven формы' }
    ];
    const filtered = allItems.filter(item =>
      item.title.toLowerCase().includes(term.toLowerCase()) ||
      item.description.toLowerCase().includes(term.toLowerCase())
    );
    return of(filtered);
  }
}`,
      explanation: 'Subject получает значение при каждом вводе через next(). debounceTime(300) ждёт 300мс паузы ввода. distinctUntilChanged() игнорирует одинаковые подряд значения. switchMap отменяет предыдущий запрос при новом вводе — это предотвращает гонку запросов. takeUntilDestroyed() отписывается при уничтожении компонента. async pipe отображает последнее значение Observable.'
    }
  ]
}
