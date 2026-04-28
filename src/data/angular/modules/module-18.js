export default {
  id: 18,
  title: 'State Management: NgRx',
  description: 'Основы NgRx: Store, Actions, Reducers и паттерн Redux для управления состоянием в Angular',
  lessons: [
    {
      id: 1,
      title: 'Зачем нужен NgRx',
      type: 'theory',
      content: [
        { type: 'text', value: 'NgRx — это библиотека управления состоянием для Angular, основанная на паттерне Redux. Она предоставляет единый источник истины (Store), предсказуемые изменения через Actions и Reducers, и интеграцию с RxJS.' },
        { type: 'heading', value: 'Когда нужен NgRx' },
        { type: 'list', value: [
          'Сложное состояние, разделяемое между многими компонентами',
          'Состояние, которое нужно сохранять при навигации',
          'Множество асинхронных операций, влияющих на состояние',
          'Команда из нескольких разработчиков — NgRx обеспечивает стандарт',
          'Необходимость в отладке (Redux DevTools, time-travel debugging)'
        ] },
        { type: 'heading', value: 'Архитектура NgRx' },
        { type: 'code', language: 'typescript', value: '// Поток данных в NgRx:\n// 1. Компонент отправляет Action:     store.dispatch(loadUsers())\n// 2. Reducer обрабатывает Action:     (state, action) => newState\n// 3. Store обновляется:               Store = новое состояние\n// 4. Selector извлекает данные:       store.select(selectUsers)\n// 5. Компонент получает обновление:   users$ | async\n\n// Для побочных эффектов (HTTP-запросы):\n// 1. Компонент: dispatch(loadUsers())\n// 2. Effect перехватывает Action\n// 3. Effect делает HTTP-запрос\n// 4. Effect отправляет новый Action: loadUsersSuccess({ users })\n// 5. Reducer обновляет состояние' },
        { type: 'heading', value: 'Установка' },
        { type: 'code', language: 'bash', value: '# Установка NgRx\nnpm install @ngrx/store @ngrx/effects @ngrx/store-devtools\n\n# Опционально\nnpm install @ngrx/entity      # Работа с коллекциями\nnpm install @ngrx/router-store # Состояние роутера в Store' },
        { type: 'tip', value: 'Не используйте NgRx для простых приложений. Для 2-3 страниц хватит сервиса с BehaviorSubject или Signals. NgRx оправдан в enterprise-проектах.' }
      ]
    },
    {
      id: 2,
      title: 'Actions — описание событий',
      type: 'theory',
      content: [
        { type: 'text', value: 'Actions описывают события, происходящие в приложении: пользователь кликнул кнопку, данные загружены с сервера, произошла ошибка. Actions — это объекты с типом и опциональными данными.' },
        { type: 'heading', value: 'Создание Actions' },
        { type: 'code', language: 'typescript', value: '// store/users/users.actions.ts\nimport { createAction, props } from \'@ngrx/store\';\n\n// Загрузка пользователей\nexport const loadUsers = createAction(\n  \'[Users Page] Load Users\'\n);\n\nexport const loadUsersSuccess = createAction(\n  \'[Users API] Load Users Success\',\n  props<{ users: User[] }>()\n);\n\nexport const loadUsersFailure = createAction(\n  \'[Users API] Load Users Failure\',\n  props<{ error: string }>()\n);\n\n// CRUD операции\nexport const addUser = createAction(\n  \'[Users Page] Add User\',\n  props<{ user: Omit<User, \'id\'> }>()\n);\n\nexport const deleteUser = createAction(\n  \'[Users Page] Delete User\',\n  props<{ id: number }>()\n);\n\nexport const selectUser = createAction(\n  \'[Users Page] Select User\',\n  props<{ id: number }>()\n);' },
        { type: 'heading', value: 'Соглашение об именовании' },
        { type: 'code', language: 'typescript', value: '// Формат: [Источник] Описание\n// [Users Page] Load Users        — из компонента\n// [Users API] Load Users Success  — из API (Effect)\n// [Users Guard] Load User         — из Guard\n// [Router] Navigate               — из роутера\n\n// Паттерн триплетов для API-операций:\n// loadX           — запуск запроса\n// loadXSuccess    — успешный ответ\n// loadXFailure    — ошибка' },
        { type: 'note', value: 'Action — просто объект { type: string, ...payload }. createAction — фабрика для удобного создания. Хорошие имена Actions — ключ к отладке через Redux DevTools.' }
      ]
    },
    {
      id: 3,
      title: 'Reducers — обновление состояния',
      type: 'theory',
      content: [
        { type: 'text', value: 'Reducer — это чистая функция, которая принимает текущее состояние и Action, и возвращает новое состояние. Reducer не изменяет текущее состояние, а создаёт новый объект.' },
        { type: 'heading', value: 'Создание Reducer' },
        { type: 'code', language: 'typescript', value: '// store/users/users.reducer.ts\nimport { createReducer, on } from \'@ngrx/store\';\nimport * as UserActions from \'./users.actions\';\n\n// Описание состояния\nexport interface UsersState {\n  users: User[];\n  selectedUserId: number | null;\n  loading: boolean;\n  error: string | null;\n}\n\n// Начальное состояние\nexport const initialState: UsersState = {\n  users: [],\n  selectedUserId: null,\n  loading: false,\n  error: null\n};\n\n// Reducer\nexport const usersReducer = createReducer(\n  initialState,\n\n  // Загрузка начата\n  on(UserActions.loadUsers, (state) => ({\n    ...state,\n    loading: true,\n    error: null\n  })),\n\n  // Загрузка успешна\n  on(UserActions.loadUsersSuccess, (state, { users }) => ({\n    ...state,\n    users,\n    loading: false\n  })),\n\n  // Загрузка с ошибкой\n  on(UserActions.loadUsersFailure, (state, { error }) => ({\n    ...state,\n    loading: false,\n    error\n  })),\n\n  // Выбор пользователя\n  on(UserActions.selectUser, (state, { id }) => ({\n    ...state,\n    selectedUserId: id\n  })),\n\n  // Удаление пользователя\n  on(UserActions.deleteUser, (state, { id }) => ({\n    ...state,\n    users: state.users.filter(u => u.id !== id)\n  }))\n);' },
        { type: 'heading', value: 'Регистрация Store' },
        { type: 'code', language: 'typescript', value: '// app.config.ts\nimport { provideStore } from \'@ngrx/store\';\nimport { provideStoreDevtools } from \'@ngrx/store-devtools\';\nimport { usersReducer } from \'./store/users/users.reducer\';\n\nexport const appConfig: ApplicationConfig = {\n  providers: [\n    provideStore({\n      users: usersReducer  // Ключ \'users\' в глобальном состоянии\n    }),\n    provideStoreDevtools({\n      maxAge: 25,  // Хранить последние 25 действий\n      logOnly: false\n    })\n  ]\n};' },
        { type: 'warning', value: 'Reducer должен быть чистой функцией: не изменять state напрямую, не делать HTTP-запросы, не вызывать Math.random(). Всегда возвращайте новый объект через spread: { ...state, loading: true }.' }
      ]
    },
    {
      id: 4,
      title: 'Store и dispatch в компонентах',
      type: 'theory',
      content: [
        { type: 'text', value: 'Компоненты взаимодействуют со Store через два метода: dispatch() для отправки Actions и select() для получения данных.' },
        { type: 'heading', value: 'Использование Store в компоненте' },
        { type: 'code', language: 'typescript', value: 'import { Component, OnInit, inject } from \'@angular/core\';\nimport { Store } from \'@ngrx/store\';\nimport { AsyncPipe } from \'@angular/common\';\nimport * as UserActions from \'../store/users/users.actions\';\n\n@Component({\n  selector: \'app-user-list\',\n  standalone: true,\n  imports: [AsyncPipe],\n  template: `\n    @if (loading$ | async) {\n      <p>Загрузка...</p>\n    }\n\n    @if (error$ | async; as error) {\n      <p class="error">{{ error }}</p>\n    }\n\n    @for (user of users$ | async; track user.id) {\n      <div class="user"\n           [class.selected]="user.id === (selectedId$ | async)"\n           (click)="selectUser(user.id)">\n        <h3>{{ user.name }}</h3>\n        <p>{{ user.email }}</p>\n        <button (click)="deleteUser(user.id); $event.stopPropagation()">Удалить</button>\n      </div>\n    }\n  `\n})\nexport class UserListComponent implements OnInit {\n  private store = inject(Store);\n\n  // Селекторы — получение данных из Store\n  users$ = this.store.select(state => state.users.users);\n  loading$ = this.store.select(state => state.users.loading);\n  error$ = this.store.select(state => state.users.error);\n  selectedId$ = this.store.select(state => state.users.selectedUserId);\n\n  ngOnInit(): void {\n    // Отправляем Action для загрузки\n    this.store.dispatch(UserActions.loadUsers());\n  }\n\n  selectUser(id: number): void {\n    this.store.dispatch(UserActions.selectUser({ id }));\n  }\n\n  deleteUser(id: number): void {\n    this.store.dispatch(UserActions.deleteUser({ id }));\n  }\n}' },
        { type: 'tip', value: 'Компонент не знает, откуда приходят данные и как они обновляются. Он просто dispatch() Actions и select() данные. Вся логика — в Reducers и Effects.' }
      ]
    },
    {
      id: 5,
      title: 'Selectors — эффективное чтение состояния',
      type: 'theory',
      content: [
        { type: 'text', value: 'Selectors — это чистые функции для извлечения и трансформации данных из Store. Они мемоизируются — пересчитываются только при изменении входных данных.' },
        { type: 'heading', value: 'Создание Selectors' },
        { type: 'code', language: 'typescript', value: '// store/users/users.selectors.ts\nimport { createFeatureSelector, createSelector } from \'@ngrx/store\';\nimport { UsersState } from \'./users.reducer\';\n\n// Селектор фичи (верхний уровень)\nexport const selectUsersState = createFeatureSelector<UsersState>(\'users\');\n\n// Селекторы свойств\nexport const selectAllUsers = createSelector(\n  selectUsersState,\n  (state) => state.users\n);\n\nexport const selectUsersLoading = createSelector(\n  selectUsersState,\n  (state) => state.loading\n);\n\nexport const selectUsersError = createSelector(\n  selectUsersState,\n  (state) => state.error\n);\n\nexport const selectSelectedUserId = createSelector(\n  selectUsersState,\n  (state) => state.selectedUserId\n);\n\n// Составной селектор — выбранный пользователь\nexport const selectSelectedUser = createSelector(\n  selectAllUsers,\n  selectSelectedUserId,\n  (users, selectedId) => users.find(u => u.id === selectedId) || null\n);\n\n// Селектор с фильтрацией\nexport const selectActiveUsers = createSelector(\n  selectAllUsers,\n  (users) => users.filter(u => u.isActive)\n);\n\n// Селектор со статистикой\nexport const selectUsersStats = createSelector(\n  selectAllUsers,\n  (users) => ({\n    total: users.length,\n    active: users.filter(u => u.isActive).length,\n    inactive: users.filter(u => !u.isActive).length\n  })\n);' },
        { type: 'heading', value: 'Использование в компоненте' },
        { type: 'code', language: 'typescript', value: '// Типизированное использование\nexport class UserListComponent {\n  private store = inject(Store);\n\n  users$ = this.store.select(selectAllUsers);\n  loading$ = this.store.select(selectUsersLoading);\n  selectedUser$ = this.store.select(selectSelectedUser);\n  stats$ = this.store.select(selectUsersStats);\n}' },
        { type: 'note', value: 'Selectors мемоизируются: если входные данные не изменились, selector возвращает кэшированный результат без пересчёта. Это важно для производительности.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Простой Store для задач',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте NgRx Store для управления списком задач: Actions, Reducer, Selectors и компонент.',
      requirements: [
        'Actions: addTodo, toggleTodo, deleteTodo, setFilter',
        'State: todos[], filter (all/active/completed)',
        'Reducer обрабатывает все Actions',
        'Selectors: selectAllTodos, selectFilteredTodos, selectCompletedCount',
        'Компонент использует Store.dispatch() и Store.select()',
        'Фильтрация задач через selector'
      ],
      hint: 'createAction для Actions, createReducer с on() для Reducer, createSelector для мемоизированных Selectors. Store.dispatch() и Store.select() в компоненте.',
      expectedOutput: 'Задачи добавляются, отмечаются и удаляются через Store. Фильтрация работает через Selector. Состояние видно в Redux DevTools.',
      solution: `// todos.actions.ts
import { createAction, props } from '@ngrx/store';

export const addTodo = createAction('[Todos] Add', props<{ title: string }>());
export const toggleTodo = createAction('[Todos] Toggle', props<{ id: number }>());
export const deleteTodo = createAction('[Todos] Delete', props<{ id: number }>());
export const setFilter = createAction('[Todos] Set Filter', props<{ filter: 'all' | 'active' | 'completed' }>());

// todos.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as TodoActions from './todos.actions';

interface Todo { id: number; title: string; completed: boolean; }
export interface TodosState { todos: Todo[]; filter: 'all' | 'active' | 'completed'; nextId: number; }

export const initialState: TodosState = {
  todos: [
    { id: 1, title: 'Изучить NgRx Actions', completed: true },
    { id: 2, title: 'Создать Reducer', completed: false },
    { id: 3, title: 'Написать Selectors', completed: false }
  ],
  filter: 'all',
  nextId: 4
};

export const todosReducer = createReducer(
  initialState,
  on(TodoActions.addTodo, (state, { title }) => ({
    ...state,
    todos: [...state.todos, { id: state.nextId, title, completed: false }],
    nextId: state.nextId + 1
  })),
  on(TodoActions.toggleTodo, (state, { id }) => ({
    ...state,
    todos: state.todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
  })),
  on(TodoActions.deleteTodo, (state, { id }) => ({
    ...state,
    todos: state.todos.filter(t => t.id !== id)
  })),
  on(TodoActions.setFilter, (state, { filter }) => ({
    ...state,
    filter
  }))
);

// todos.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TodosState } from './todos.reducer';

export const selectTodosState = createFeatureSelector<TodosState>('todos');
export const selectAllTodos = createSelector(selectTodosState, s => s.todos);
export const selectFilter = createSelector(selectTodosState, s => s.filter);
export const selectFilteredTodos = createSelector(
  selectAllTodos, selectFilter,
  (todos, filter) => {
    if (filter === 'active') return todos.filter(t => !t.completed);
    if (filter === 'completed') return todos.filter(t => t.completed);
    return todos;
  }
);
export const selectCompletedCount = createSelector(
  selectAllTodos, todos => todos.filter(t => t.completed).length
);
export const selectTotalCount = createSelector(selectAllTodos, todos => todos.length);

// todo-list.component.ts
import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import * as TodoActions from './todos.actions';
import * as TodoSelectors from './todos.selectors';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [AsyncPipe],
  template: \`
    <h2>Задачи ({{ completedCount$ | async }}/{{ totalCount$ | async }})</h2>
    <input #input placeholder="Новая задача" (keyup.enter)="add(input)" />
    <div class="filters">
      <button (click)="setFilter('all')">Все</button>
      <button (click)="setFilter('active')">Активные</button>
      <button (click)="setFilter('completed')">Выполненные</button>
    </div>
    @for (todo of filteredTodos$ | async; track todo.id) {
      <div [class.done]="todo.completed">
        <input type="checkbox" [checked]="todo.completed" (change)="toggle(todo.id)" />
        <span>{{ todo.title }}</span>
        <button (click)="delete(todo.id)">✕</button>
      </div>
    }
  \`
})
export class TodoListComponent {
  private store = inject(Store);
  filteredTodos$ = this.store.select(TodoSelectors.selectFilteredTodos);
  completedCount$ = this.store.select(TodoSelectors.selectCompletedCount);
  totalCount$ = this.store.select(TodoSelectors.selectTotalCount);

  add(input: HTMLInputElement): void {
    if (input.value.trim()) {
      this.store.dispatch(TodoActions.addTodo({ title: input.value.trim() }));
      input.value = '';
    }
  }
  toggle(id: number): void { this.store.dispatch(TodoActions.toggleTodo({ id })); }
  delete(id: number): void { this.store.dispatch(TodoActions.deleteTodo({ id })); }
  setFilter(filter: 'all' | 'active' | 'completed'): void {
    this.store.dispatch(TodoActions.setFilter({ filter }));
  }
}`,
      explanation: 'Actions описывают что произошло. Reducer — чистая функция, которая возвращает новое состояние. Selectors извлекают и трансформируют данные из Store с мемоизацией. Компонент dispatch() Actions и select() данные через Selectors. Всё состояние хранится в одном месте (Store) и изменяется предсказуемо через Actions/Reducers.'
    }
  ]
}
