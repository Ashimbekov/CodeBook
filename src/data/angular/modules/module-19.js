export default {
  id: 19,
  title: 'NgRx: Effects и Selectors',
  description: 'Effects для побочных эффектов (HTTP-запросы), продвинутые Selectors и NgRx Entity',
  lessons: [
    {
      id: 1,
      title: 'NgRx Effects — побочные эффекты',
      type: 'theory',
      content: [
        { type: 'text', value: 'Effects перехватывают Actions и выполняют побочные эффекты: HTTP-запросы, навигацию, работу с localStorage. После выполнения Effect отправляет новый Action с результатом.' },
        { type: 'heading', value: 'Создание Effect' },
        { type: 'code', language: 'typescript', value: '// store/users/users.effects.ts\nimport { Injectable, inject } from \'@angular/core\';\nimport { Actions, createEffect, ofType } from \'@ngrx/effects\';\nimport { of } from \'rxjs\';\nimport { map, switchMap, catchError, tap } from \'rxjs/operators\';\nimport * as UserActions from \'./users.actions\';\nimport { UserService } from \'../../services/user.service\';\nimport { Router } from \'@angular/router\';\n\n@Injectable()\nexport class UsersEffects {\n  private actions$ = inject(Actions);\n  private userService = inject(UserService);\n  private router = inject(Router);\n\n  // Загрузка пользователей\n  loadUsers$ = createEffect(() =>\n    this.actions$.pipe(\n      ofType(UserActions.loadUsers),        // Перехватываем Action\n      switchMap(() =>\n        this.userService.getAll().pipe(\n          map(users => UserActions.loadUsersSuccess({ users })),  // Успех\n          catchError(error =>\n            of(UserActions.loadUsersFailure({ error: error.message }))  // Ошибка\n          )\n        )\n      )\n    )\n  );\n\n  // Удаление пользователя\n  deleteUser$ = createEffect(() =>\n    this.actions$.pipe(\n      ofType(UserActions.deleteUser),\n      switchMap(({ id }) =>\n        this.userService.delete(id).pipe(\n          map(() => UserActions.deleteUserSuccess({ id })),\n          catchError(error =>\n            of(UserActions.deleteUserFailure({ error: error.message }))\n          )\n        )\n      )\n    )\n  );\n\n  // Effect без dispatch (для навигации, уведомлений)\n  navigateAfterCreate$ = createEffect(\n    () => this.actions$.pipe(\n      ofType(UserActions.createUserSuccess),\n      tap(({ user }) => {\n        this.router.navigate([\'/users\', user.id]);\n      })\n    ),\n    { dispatch: false }  // Не отправляет новый Action\n  );\n}' },
        { type: 'heading', value: 'Регистрация Effects' },
        { type: 'code', language: 'typescript', value: '// app.config.ts\nimport { provideEffects } from \'@ngrx/effects\';\nimport { UsersEffects } from \'./store/users/users.effects\';\n\nexport const appConfig: ApplicationConfig = {\n  providers: [\n    provideStore({ users: usersReducer }),\n    provideEffects(UsersEffects),  // Регистрация Effects\n    provideStoreDevtools()\n  ]\n};' },
        { type: 'tip', value: 'Effect слушает ВСЕ Actions через actions$. ofType() фильтрует нужные. switchMap для запросов (отменяет предыдущий), exhaustMap для создания (игнорирует повторные).' }
      ]
    },
    {
      id: 2,
      title: 'Продвинутые Effects',
      type: 'theory',
      content: [
        { type: 'text', value: 'Effects могут комбинировать несколько Actions, работать с роутером, показывать уведомления и выполнять сложную логику.' },
        { type: 'heading', value: 'Effect с множественными Actions' },
        { type: 'code', language: 'typescript', value: '// Загрузка данных при инициализации приложения\ninit$ = createEffect(() =>\n  this.actions$.pipe(\n    ofType(AppActions.appInit),\n    switchMap(() => forkJoin({\n      users: this.userService.getAll(),\n      settings: this.settingsService.get()\n    }).pipe(\n      switchMap(({ users, settings }) => [\n        UserActions.loadUsersSuccess({ users }),\n        SettingsActions.loadSettingsSuccess({ settings })\n      ]),\n      catchError(error => of(\n        AppActions.initFailure({ error: error.message })\n      ))\n    ))\n  )\n);' },
        { type: 'heading', value: 'Effect с условием' },
        { type: 'code', language: 'typescript', value: '// Загрузить пользователей только если их ещё нет в Store\nloadUsersIfNeeded$ = createEffect(() =>\n  this.actions$.pipe(\n    ofType(UserActions.loadUsers),\n    withLatestFrom(this.store.select(selectAllUsers)),\n    filter(([action, users]) => users.length === 0),  // Только если пусто\n    switchMap(() =>\n      this.userService.getAll().pipe(\n        map(users => UserActions.loadUsersSuccess({ users })),\n        catchError(error => of(UserActions.loadUsersFailure({ error: error.message })))\n      )\n    )\n  )\n);' },
        { type: 'heading', value: 'Функциональные Effects (Angular 16+)' },
        { type: 'code', language: 'typescript', value: '// Функциональный подход — без класса\nimport { inject } from \'@angular/core\';\nimport { Actions, createEffect, ofType } from \'@ngrx/effects\';\n\nexport const loadUsers = createEffect(\n  (actions$ = inject(Actions), userService = inject(UserService)) =>\n    actions$.pipe(\n      ofType(UserActions.loadUsers),\n      switchMap(() =>\n        userService.getAll().pipe(\n          map(users => UserActions.loadUsersSuccess({ users })),\n          catchError(error => of(UserActions.loadUsersFailure({ error: error.message })))\n        )\n      )\n    ),\n  { functional: true }\n);\n\n// Регистрация\nprovideEffects({ loadUsers })' },
        { type: 'note', value: 'Функциональные Effects — рекомендуемый подход в новых проектах. Они проще, без классов, и лучше поддерживают tree-shaking.' }
      ]
    },
    {
      id: 3,
      title: 'NgRx Entity',
      type: 'theory',
      content: [
        { type: 'text', value: 'NgRx Entity предоставляет утилиты для работы с коллекциями сущностей (CRUD). Он нормализует данные и генерирует селекторы автоматически.' },
        { type: 'heading', value: 'Настройка Entity' },
        { type: 'code', language: 'typescript', value: '// store/users/users.reducer.ts\nimport { EntityState, EntityAdapter, createEntityAdapter } from \'@ngrx/entity\';\nimport { createReducer, on } from \'@ngrx/store\';\n\nexport interface User {\n  id: number;\n  name: string;\n  email: string;\n}\n\n// Интерфейс состояния расширяет EntityState\nexport interface UsersState extends EntityState<User> {\n  selectedUserId: number | null;\n  loading: boolean;\n  error: string | null;\n}\n\n// Адаптер создаёт утилитные функции\nexport const adapter: EntityAdapter<User> = createEntityAdapter<User>({\n  selectId: (user) => user.id,     // Ключ сущности\n  sortComparer: (a, b) => a.name.localeCompare(b.name)  // Сортировка\n});\n\n// Начальное состояние\nexport const initialState: UsersState = adapter.getInitialState({\n  selectedUserId: null,\n  loading: false,\n  error: null\n});\n// initialState = { ids: [], entities: {}, selectedUserId: null, loading: false, error: null }' },
        { type: 'heading', value: 'Reducer с Entity' },
        { type: 'code', language: 'typescript', value: 'export const usersReducer = createReducer(\n  initialState,\n  on(UserActions.loadUsersSuccess, (state, { users }) =>\n    adapter.setAll(users, { ...state, loading: false })   // Заменить все\n  ),\n  on(UserActions.addUserSuccess, (state, { user }) =>\n    adapter.addOne(user, state)                           // Добавить одного\n  ),\n  on(UserActions.updateUserSuccess, (state, { user }) =>\n    adapter.updateOne({ id: user.id, changes: user }, state)  // Обновить\n  ),\n  on(UserActions.deleteUserSuccess, (state, { id }) =>\n    adapter.removeOne(id, state)                          // Удалить\n  ),\n  on(UserActions.loadUsers, (state) => ({ ...state, loading: true }))\n);\n\n// Методы адаптера:\n// addOne, addMany — добавить\n// setOne, setAll — установить (заменить)\n// updateOne, updateMany — обновить\n// removeOne, removeMany, removeAll — удалить\n// upsertOne, upsertMany — добавить или обновить' },
        { type: 'heading', value: 'Селекторы Entity' },
        { type: 'code', language: 'typescript', value: '// users.selectors.ts\nconst { selectAll, selectEntities, selectIds, selectTotal } =\n  adapter.getSelectors(selectUsersState);\n\n// selectAll — массив всех сущностей\nexport const selectAllUsers = selectAll;\n// selectEntities — словарь { [id]: entity }\nexport const selectUserEntities = selectEntities;\n// selectIds — массив id\nexport const selectUserIds = selectIds;\n// selectTotal — количество сущностей\nexport const selectTotalUsers = selectTotal;\n\n// Выбранный пользователь\nexport const selectSelectedUser = createSelector(\n  selectUserEntities,\n  selectUsersState,\n  (entities, state) => state.selectedUserId ? entities[state.selectedUserId] : null\n);' },
        { type: 'tip', value: 'Entity нормализует данные: вместо массива хранит { ids: [1,2,3], entities: { 1: {...}, 2: {...} } }. Это ускоряет операции обновления и удаления O(1) вместо O(n).' }
      ]
    },
    {
      id: 4,
      title: 'Facade паттерн для NgRx',
      type: 'theory',
      content: [
        { type: 'text', value: 'Facade (фасад) — это сервис-обёртка над NgRx Store. Он скрывает детали реализации (Actions, Selectors) и предоставляет простой API для компонентов.' },
        { type: 'heading', value: 'Создание Facade' },
        { type: 'code', language: 'typescript', value: '// store/users/users.facade.ts\nimport { Injectable, inject } from \'@angular/core\';\nimport { Store } from \'@ngrx/store\';\nimport * as UserActions from \'./users.actions\';\nimport * as UserSelectors from \'./users.selectors\';\n\n@Injectable({ providedIn: \'root\' })\nexport class UsersFacade {\n  private store = inject(Store);\n\n  // Селекторы как публичные Observable\n  users$ = this.store.select(UserSelectors.selectAllUsers);\n  loading$ = this.store.select(UserSelectors.selectUsersLoading);\n  error$ = this.store.select(UserSelectors.selectUsersError);\n  selectedUser$ = this.store.select(UserSelectors.selectSelectedUser);\n  stats$ = this.store.select(UserSelectors.selectUsersStats);\n\n  // Методы как обёртки над dispatch\n  loadUsers(): void {\n    this.store.dispatch(UserActions.loadUsers());\n  }\n\n  selectUser(id: number): void {\n    this.store.dispatch(UserActions.selectUser({ id }));\n  }\n\n  createUser(user: Omit<User, \'id\'>): void {\n    this.store.dispatch(UserActions.createUser({ user }));\n  }\n\n  deleteUser(id: number): void {\n    this.store.dispatch(UserActions.deleteUser({ id }));\n  }\n}' },
        { type: 'heading', value: 'Компонент с Facade' },
        { type: 'code', language: 'typescript', value: '// Компонент не знает о Store, Actions, Selectors\n@Component({\n  selector: \'app-user-list\',\n  standalone: true,\n  imports: [AsyncPipe],\n  template: `\n    @if (facade.loading$ | async) { <p>Загрузка...</p> }\n    @for (user of facade.users$ | async; track user.id) {\n      <div (click)="facade.selectUser(user.id)">\n        {{ user.name }}\n        <button (click)="facade.deleteUser(user.id)">Удалить</button>\n      </div>\n    }\n  `\n})\nexport class UserListComponent implements OnInit {\n  facade = inject(UsersFacade);\n\n  ngOnInit(): void {\n    this.facade.loadUsers();\n  }\n}' },
        { type: 'tip', value: 'Facade упрощает компоненты и делает их независимыми от NgRx. Если вы решите заменить NgRx на другое решение, достаточно изменить только Facade.' }
      ]
    },
    {
      id: 5,
      title: 'Лучшие практики NgRx',
      type: 'theory',
      content: [
        { type: 'text', value: 'NgRx — мощный инструмент, но требует дисциплины. Рассмотрим лучшие практики для поддерживаемого NgRx кода.' },
        { type: 'heading', value: 'Структура файлов' },
        { type: 'code', language: 'bash', value: 'src/app/store/\n├── users/\n│   ├── users.actions.ts     # Actions\n│   ├── users.reducer.ts     # State, Reducer\n│   ├── users.selectors.ts   # Selectors\n│   ├── users.effects.ts     # Effects\n│   └── users.facade.ts      # Facade (опционально)\n├── products/\n│   ├── products.actions.ts\n│   ├── products.reducer.ts\n│   ├── products.selectors.ts\n│   └── products.effects.ts\n└── index.ts                  # Barrel exports' },
        { type: 'heading', value: 'Правила' },
        { type: 'list', value: [
          'Один Reducer — одна фича (users, products, cart)',
          'Actions называются как события: [Источник] Что произошло',
          'Reducer — чистая функция, без побочных эффектов',
          'Effects — единственное место для побочных эффектов (HTTP, навигация)',
          'Selectors для ВСЕХ чтений из Store (мемоизация!)',
          'Не дублируйте данные в Store — используйте Selectors для вычислений',
          'Используйте NgRx Entity для коллекций (CRUD)'
        ] },
        { type: 'heading', value: 'Что хранить в Store' },
        { type: 'list', value: [
          'Данные, разделяемые между маршрутами/компонентами',
          'Данные с сервера (кэширование)',
          'Состояние UI, которое нужно сохранять (фильтры, выбранные элементы)',
          'НЕ хранить: локальное состояние формы, временные UI-флаги, derived data'
        ] },
        { type: 'warning', value: 'Не кладите в Store всё подряд. Локальное состояние компонента (isDropdownOpen, formValue) лучше хранить в компоненте через signal() или обычные свойства.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Полный NgRx для продуктов',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте полный NgRx стек для модуля продуктов: Actions, Reducer с Entity, Effects, Selectors и Facade.',
      requirements: [
        'Actions: loadProducts, loadProductsSuccess/Failure, deleteProduct, setFilter',
        'Reducer с NgRx Entity (EntityAdapter)',
        'Selectors: selectAll, selectFiltered, selectLoading, selectTotal',
        'Effect для загрузки (с имитацией HTTP-запроса)',
        'Facade сервис для упрощения использования',
        'Компонент использует только Facade'
      ],
      hint: 'createEntityAdapter<Product>() для адаптера. createEffect с ofType и switchMap для Effect. Facade инжектит Store и предоставляет методы.',
      expectedOutput: 'Полный NgRx цикл: dispatch Action -> Effect -> HTTP -> Success Action -> Reducer -> Selector -> Component.',
      solution: `// products.actions.ts
import { createAction, props } from '@ngrx/store';

interface Product { id: number; name: string; price: number; category: string; }

export const loadProducts = createAction('[Products] Load');
export const loadProductsSuccess = createAction('[Products API] Load Success', props<{ products: Product[] }>());
export const loadProductsFailure = createAction('[Products API] Load Failure', props<{ error: string }>());
export const deleteProduct = createAction('[Products] Delete', props<{ id: number }>());
export const setFilter = createAction('[Products] Set Filter', props<{ category: string }>());

// products.reducer.ts
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

export interface ProductsState extends EntityState<Product> {
  loading: boolean;
  error: string | null;
  filterCategory: string;
}

export const adapter = createEntityAdapter<Product>();
export const initialState: ProductsState = adapter.getInitialState({
  loading: false,
  error: null,
  filterCategory: 'all'
});

export const productsReducer = createReducer(
  initialState,
  on(loadProducts, s => ({ ...s, loading: true, error: null })),
  on(loadProductsSuccess, (s, { products }) => adapter.setAll(products, { ...s, loading: false })),
  on(loadProductsFailure, (s, { error }) => ({ ...s, loading: false, error })),
  on(deleteProduct, (s, { id }) => adapter.removeOne(id, s)),
  on(setFilter, (s, { category }) => ({ ...s, filterCategory: category }))
);

// products.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';

export const selectProductsState = createFeatureSelector<ProductsState>('products');
const { selectAll, selectTotal } = adapter.getSelectors(selectProductsState);
export const selectAllProducts = selectAll;
export const selectTotalProducts = selectTotal;
export const selectLoading = createSelector(selectProductsState, s => s.loading);
export const selectError = createSelector(selectProductsState, s => s.error);
export const selectFilterCategory = createSelector(selectProductsState, s => s.filterCategory);
export const selectFilteredProducts = createSelector(
  selectAllProducts, selectFilterCategory,
  (products, category) => category === 'all' ? products : products.filter(p => p.category === category)
);

// products.effects.ts (функциональный)
import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, delay } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

const mockProducts: Product[] = [
  { id: 1, name: 'Ноутбук', price: 75000, category: 'electronics' },
  { id: 2, name: 'Футболка', price: 2500, category: 'clothing' },
  { id: 3, name: 'Смартфон', price: 45000, category: 'electronics' },
  { id: 4, name: 'Кроссовки', price: 8000, category: 'clothing' }
];

export const loadProductsEffect = createEffect(
  (actions$ = inject(Actions)) => actions$.pipe(
    ofType(loadProducts),
    switchMap(() => of(mockProducts).pipe(
      delay(800),
      map(products => loadProductsSuccess({ products })),
      catchError(err => of(loadProductsFailure({ error: err.message })))
    ))
  ),
  { functional: true }
);

// products.facade.ts
import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';

@Injectable({ providedIn: 'root' })
export class ProductsFacade {
  private store = inject(Store);
  products$ = this.store.select(selectFilteredProducts);
  loading$ = this.store.select(selectLoading);
  total$ = this.store.select(selectTotalProducts);

  load(): void { this.store.dispatch(loadProducts()); }
  delete(id: number): void { this.store.dispatch(deleteProduct({ id })); }
  filter(category: string): void { this.store.dispatch(setFilter({ category })); }
}

// product-list.component.ts
@Component({
  selector: 'app-products',
  standalone: true,
  imports: [AsyncPipe],
  template: \`
    <h2>Товары ({{ facade.total$ | async }})</h2>
    <select (change)="onFilter($event)">
      <option value="all">Все</option>
      <option value="electronics">Электроника</option>
      <option value="clothing">Одежда</option>
    </select>
    @if (facade.loading$ | async) { <p>Загрузка...</p> }
    @for (p of facade.products$ | async; track p.id) {
      <div>{{ p.name }} — {{ p.price }} руб.
        <button (click)="facade.delete(p.id)">Удалить</button>
      </div>
    }
  \`
})
export class ProductListComponent implements OnInit {
  facade = inject(ProductsFacade);
  ngOnInit() { this.facade.load(); }
  onFilter(e: Event) { this.facade.filter((e.target as HTMLSelectElement).value); }
}`,
      explanation: 'Полный NgRx стек: Actions описывают события, Reducer с Entity управляет нормализованным состоянием, функциональный Effect имитирует HTTP-запрос, Selectors с мемоизацией извлекают данные, Facade скрывает NgRx от компонента. Компонент знает только о Facade — простой и тестируемый.'
    }
  ]
}
