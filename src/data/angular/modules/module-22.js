export default {
  id: 22,
  title: 'Angular Material',
  description: 'Библиотека UI-компонентов Angular Material: установка, темы, основные компоненты и кастомизация',
  lessons: [
    {
      id: 1,
      title: 'Установка и настройка Angular Material',
      type: 'theory',
      content: [
        { type: 'text', value: 'Angular Material — это официальная библиотека UI-компонентов от Google, реализующая Material Design. Она предоставляет готовые компоненты: кнопки, формы, таблицы, диалоги и многое другое.' },
        { type: 'heading', value: 'Установка' },
        { type: 'code', language: 'bash', value: '# Установка Angular Material\nng add @angular/material\n\n# CLI спросит:\n# ? Choose a prebuilt theme: Indigo/Pink\n# ? Set up global Angular Material typography styles? Yes\n# ? Include animations module? Include and enable animations' },
        { type: 'heading', value: 'Импорт компонентов' },
        { type: 'code', language: 'typescript', value: '// Standalone компоненты Material импортируются по одному\nimport { Component } from \'@angular/core\';\nimport { MatButtonModule } from \'@angular/material/button\';\nimport { MatIconModule } from \'@angular/material/icon\';\nimport { MatToolbarModule } from \'@angular/material/toolbar\';\n\n@Component({\n  selector: \'app-header\',\n  standalone: true,\n  imports: [MatButtonModule, MatIconModule, MatToolbarModule],\n  template: `\n    <mat-toolbar color="primary">\n      <mat-icon>menu</mat-icon>\n      <span>Моё приложение</span>\n      <span class="spacer"></span>\n      <button mat-icon-button>\n        <mat-icon>notifications</mat-icon>\n      </button>\n      <button mat-icon-button>\n        <mat-icon>account_circle</mat-icon>\n      </button>\n    </mat-toolbar>\n  `,\n  styles: [`.spacer { flex: 1; }`]\n})\nexport class HeaderComponent {}' },
        { type: 'tip', value: 'Импортируйте только нужные модули: MatButtonModule, MatInputModule и т.д. Не импортируйте всю библиотеку — это увеличит размер бандла.' }
      ]
    },
    {
      id: 2,
      title: 'Кнопки, иконки и карточки',
      type: 'theory',
      content: [
        { type: 'text', value: 'Material предоставляет несколько вариантов кнопок, систему иконок и компонент карточки для создания красивого UI.' },
        { type: 'heading', value: 'Кнопки' },
        { type: 'code', language: 'html', value: '<!-- Варианты кнопок -->\n<button mat-button>Текстовая</button>\n<button mat-raised-button>Приподнятая</button>\n<button mat-flat-button>Плоская</button>\n<button mat-stroked-button>С обводкой</button>\n<button mat-icon-button><mat-icon>favorite</mat-icon></button>\n<button mat-fab><mat-icon>add</mat-icon></button>\n<button mat-mini-fab><mat-icon>edit</mat-icon></button>\n\n<!-- Цвета -->\n<button mat-raised-button color="primary">Primary</button>\n<button mat-raised-button color="accent">Accent</button>\n<button mat-raised-button color="warn">Warn</button>\n\n<!-- С иконкой -->\n<button mat-raised-button color="primary">\n  <mat-icon>save</mat-icon> Сохранить\n</button>' },
        { type: 'heading', value: 'Карточки' },
        { type: 'code', language: 'typescript', value: '@Component({\n  standalone: true,\n  imports: [MatCardModule, MatButtonModule, MatIconModule],\n  template: `\n    <mat-card>\n      <mat-card-header>\n        <mat-card-title>Angular Material</mat-card-title>\n        <mat-card-subtitle>UI библиотека</mat-card-subtitle>\n      </mat-card-header>\n      <img mat-card-image src="angular.png" alt="Angular" />\n      <mat-card-content>\n        <p>Angular Material предоставляет готовые компоненты\n           для создания красивых приложений.</p>\n      </mat-card-content>\n      <mat-card-actions align="end">\n        <button mat-button>Отмена</button>\n        <button mat-raised-button color="primary">Подробнее</button>\n      </mat-card-actions>\n    </mat-card>\n  `\n})' },
        { type: 'note', value: 'Material Icons подключаются через CDN или npm. Добавьте в index.html: <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">' }
      ]
    },
    {
      id: 3,
      title: 'Формы Material',
      type: 'theory',
      content: [
        { type: 'text', value: 'Angular Material предоставляет красивые компоненты для форм: mat-form-field, mat-input, mat-select, mat-checkbox, mat-datepicker.' },
        { type: 'heading', value: 'Поля ввода' },
        { type: 'code', language: 'typescript', value: 'import { MatFormFieldModule } from \'@angular/material/form-field\';\nimport { MatInputModule } from \'@angular/material/input\';\nimport { MatSelectModule } from \'@angular/material/select\';\nimport { MatCheckboxModule } from \'@angular/material/checkbox\';\nimport { MatDatepickerModule } from \'@angular/material/datepicker\';\nimport { MatNativeDateModule } from \'@angular/material/core\';\n\n@Component({\n  standalone: true,\n  imports: [\n    ReactiveFormsModule, MatFormFieldModule, MatInputModule,\n    MatSelectModule, MatCheckboxModule, MatDatepickerModule,\n    MatNativeDateModule, MatButtonModule\n  ],\n  template: `\n    <form [formGroup]="form" (ngSubmit)="onSubmit()">\n      <!-- Текстовое поле -->\n      <mat-form-field appearance="outline">\n        <mat-label>Имя</mat-label>\n        <input matInput formControlName="name" />\n        <mat-hint>Введите полное имя</mat-hint>\n        @if (form.get(\'name\')?.hasError(\'required\')) {\n          <mat-error>Имя обязательно</mat-error>\n        }\n      </mat-form-field>\n\n      <!-- Email -->\n      <mat-form-field appearance="outline">\n        <mat-label>Email</mat-label>\n        <input matInput formControlName="email" type="email" />\n        <mat-icon matSuffix>email</mat-icon>\n        @if (form.get(\'email\')?.hasError(\'email\')) {\n          <mat-error>Некорректный email</mat-error>\n        }\n      </mat-form-field>\n\n      <!-- Select -->\n      <mat-form-field appearance="outline">\n        <mat-label>Роль</mat-label>\n        <mat-select formControlName="role">\n          <mat-option value="user">Пользователь</mat-option>\n          <mat-option value="admin">Администратор</mat-option>\n          <mat-option value="editor">Редактор</mat-option>\n        </mat-select>\n      </mat-form-field>\n\n      <!-- Datepicker -->\n      <mat-form-field appearance="outline">\n        <mat-label>Дата рождения</mat-label>\n        <input matInput [matDatepicker]="picker" formControlName="birthDate" />\n        <mat-datepicker-toggle matSuffix [for]="picker" />\n        <mat-datepicker #picker />\n      </mat-form-field>\n\n      <!-- Checkbox -->\n      <mat-checkbox formControlName="agree">Согласие на обработку</mat-checkbox>\n\n      <button mat-raised-button color="primary" type="submit"\n              [disabled]="form.invalid">Сохранить</button>\n    </form>\n  `\n})' },
        { type: 'tip', value: 'appearance="outline" — самый популярный стиль полей. Альтернативы: "fill". mat-error автоматически показывается при ошибке валидации, когда поле touched.' }
      ]
    },
    {
      id: 4,
      title: 'Таблицы и пагинация',
      type: 'theory',
      content: [
        { type: 'text', value: 'MatTable — мощный компонент для отображения табличных данных с сортировкой, пагинацией и фильтрацией.' },
        { type: 'heading', value: 'MatTable с сортировкой и пагинацией' },
        { type: 'code', language: 'typescript', value: 'import { Component, ViewChild, AfterViewInit } from \'@angular/core\';\nimport { MatTableModule, MatTableDataSource } from \'@angular/material/table\';\nimport { MatSortModule, MatSort } from \'@angular/material/sort\';\nimport { MatPaginatorModule, MatPaginator } from \'@angular/material/paginator\';\nimport { MatFormFieldModule } from \'@angular/material/form-field\';\nimport { MatInputModule } from \'@angular/material/input\';\n\ninterface User {\n  id: number;\n  name: string;\n  email: string;\n  role: string;\n}\n\n@Component({\n  selector: \'app-user-table\',\n  standalone: true,\n  imports: [MatTableModule, MatSortModule, MatPaginatorModule, MatFormFieldModule, MatInputModule],\n  template: `\n    <!-- Фильтр -->\n    <mat-form-field>\n      <mat-label>Поиск</mat-label>\n      <input matInput (keyup)="applyFilter($event)" placeholder="Введите запрос" />\n    </mat-form-field>\n\n    <!-- Таблица -->\n    <table mat-table [dataSource]="dataSource" matSort>\n      <ng-container matColumnDef="id">\n        <th mat-header-cell *matHeaderCellDef mat-sort-header>ID</th>\n        <td mat-cell *matCellDef="let user">{{ user.id }}</td>\n      </ng-container>\n\n      <ng-container matColumnDef="name">\n        <th mat-header-cell *matHeaderCellDef mat-sort-header>Имя</th>\n        <td mat-cell *matCellDef="let user">{{ user.name }}</td>\n      </ng-container>\n\n      <ng-container matColumnDef="email">\n        <th mat-header-cell *matHeaderCellDef mat-sort-header>Email</th>\n        <td mat-cell *matCellDef="let user">{{ user.email }}</td>\n      </ng-container>\n\n      <ng-container matColumnDef="role">\n        <th mat-header-cell *matHeaderCellDef>Роль</th>\n        <td mat-cell *matCellDef="let user">{{ user.role }}</td>\n      </ng-container>\n\n      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>\n      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>\n    </table>\n\n    <!-- Пагинация -->\n    <mat-paginator [pageSizeOptions]="[5, 10, 25]" showFirstLastButtons />\n  `\n})\nexport class UserTableComponent implements AfterViewInit {\n  displayedColumns = [\'id\', \'name\', \'email\', \'role\'];\n  dataSource = new MatTableDataSource<User>([\n    { id: 1, name: \'Иван\', email: \'ivan@mail.ru\', role: \'admin\' },\n    { id: 2, name: \'Мария\', email: \'maria@mail.ru\', role: \'user\' },\n    // ... ещё данные\n  ]);\n\n  @ViewChild(MatSort) sort!: MatSort;\n  @ViewChild(MatPaginator) paginator!: MatPaginator;\n\n  ngAfterViewInit(): void {\n    this.dataSource.sort = this.sort;\n    this.dataSource.paginator = this.paginator;\n  }\n\n  applyFilter(event: Event): void {\n    const value = (event.target as HTMLInputElement).value;\n    this.dataSource.filter = value.trim().toLowerCase();\n  }\n}' },
        { type: 'note', value: 'MatTableDataSource встроенно поддерживает сортировку, пагинацию и фильтрацию. Просто подключите MatSort и MatPaginator через @ViewChild.' }
      ]
    },
    {
      id: 5,
      title: 'Диалоги и Snackbar',
      type: 'theory',
      content: [
        { type: 'text', value: 'MatDialog открывает модальные окна, MatSnackBar показывает уведомления. Это основные компоненты для обратной связи с пользователем.' },
        { type: 'heading', value: 'MatDialog' },
        { type: 'code', language: 'typescript', value: '// confirm-dialog.component.ts\nimport { Component, inject } from \'@angular/core\';\nimport { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from \'@angular/material/dialog\';\nimport { MatButtonModule } from \'@angular/material/button\';\n\n@Component({\n  selector: \'app-confirm-dialog\',\n  standalone: true,\n  imports: [MatDialogModule, MatButtonModule],\n  template: `\n    <h2 mat-dialog-title>{{ data.title }}</h2>\n    <mat-dialog-content>{{ data.message }}</mat-dialog-content>\n    <mat-dialog-actions align="end">\n      <button mat-button mat-dialog-close>Отмена</button>\n      <button mat-raised-button color="warn" [mat-dialog-close]="true">Подтвердить</button>\n    </mat-dialog-actions>\n  `\n})\nexport class ConfirmDialogComponent {\n  data = inject(MAT_DIALOG_DATA);\n}\n\n// Открытие диалога из другого компонента\n@Component({ /* ... */ })\nexport class UserListComponent {\n  private dialog = inject(MatDialog);\n\n  confirmDelete(user: User): void {\n    const dialogRef = this.dialog.open(ConfirmDialogComponent, {\n      width: \'400px\',\n      data: { title: \'Удаление\', message: `Удалить пользователя ${user.name}?` }\n    });\n\n    dialogRef.afterClosed().subscribe(confirmed => {\n      if (confirmed) {\n        this.deleteUser(user.id);\n      }\n    });\n  }\n}' },
        { type: 'heading', value: 'MatSnackBar' },
        { type: 'code', language: 'typescript', value: 'import { MatSnackBar } from \'@angular/material/snack-bar\';\n\n@Component({ /* ... */ })\nexport class UserListComponent {\n  private snackBar = inject(MatSnackBar);\n\n  deleteUser(id: number): void {\n    this.userService.delete(id).subscribe({\n      next: () => {\n        this.snackBar.open(\'Пользователь удалён\', \'OK\', {\n          duration: 3000,\n          horizontalPosition: \'end\',\n          verticalPosition: \'top\'\n        });\n      },\n      error: () => {\n        this.snackBar.open(\'Ошибка удаления\', \'Закрыть\', {\n          duration: 5000,\n          panelClass: [\'error-snackbar\']\n        });\n      }\n    });\n  }\n}' },
        { type: 'tip', value: 'MatDialog.open() возвращает MatDialogRef с методом afterClosed(). [mat-dialog-close]="value" закрывает диалог и передаёт value в afterClosed().' }
      ]
    },
    {
      id: 6,
      title: 'Практика: CRUD страница с Angular Material',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте страницу управления пользователями с Angular Material: таблица, форма добавления через диалог, уведомления.',
      requirements: [
        'MatTable с отображением списка пользователей (id, name, email, role)',
        'Кнопка добавления, открывающая MatDialog с формой',
        'Форма в диалоге с mat-form-field, mat-input, mat-select',
        'Кнопка удаления с подтверждением через MatDialog',
        'MatSnackBar для уведомлений об успешных действиях',
        'MatToolbar для заголовка страницы'
      ],
      hint: 'MatTableDataSource для таблицы. MatDialog.open(DialogComponent, { data }) для открытия. inject(MAT_DIALOG_DATA) для получения данных. snackBar.open() для уведомлений.',
      expectedOutput: 'Страница с таблицей пользователей. Добавление через модальное окно. Удаление с подтверждением. Уведомления о действиях.',
      solution: `import { Component, inject } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

interface User { id: number; name: string; email: string; role: string; }

// Диалог добавления
@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, FormsModule],
  template: \`
    <h2 mat-dialog-title>Новый пользователь</h2>
    <mat-dialog-content>
      <mat-form-field appearance="outline" style="width:100%">
        <mat-label>Имя</mat-label>
        <input matInput [(ngModel)]="user.name" />
      </mat-form-field>
      <mat-form-field appearance="outline" style="width:100%">
        <mat-label>Email</mat-label>
        <input matInput [(ngModel)]="user.email" type="email" />
      </mat-form-field>
      <mat-form-field appearance="outline" style="width:100%">
        <mat-label>Роль</mat-label>
        <mat-select [(ngModel)]="user.role">
          <mat-option value="user">Пользователь</mat-option>
          <mat-option value="admin">Администратор</mat-option>
        </mat-select>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Отмена</button>
      <button mat-raised-button color="primary"
              [mat-dialog-close]="user"
              [disabled]="!user.name || !user.email">Добавить</button>
    </mat-dialog-actions>
  \`
})
export class UserDialogComponent {
  user = { name: '', email: '', role: 'user' };
}

// Основной компонент
@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule, MatToolbarModule, MatDialogModule, MatSnackBarModule],
  template: \`
    <mat-toolbar color="primary">
      <span>Управление пользователями</span>
      <span style="flex:1"></span>
      <button mat-raised-button (click)="openAddDialog()">
        <mat-icon>add</mat-icon> Добавить
      </button>
    </mat-toolbar>
    <table mat-table [dataSource]="dataSource" style="width:100%">
      <ng-container matColumnDef="id">
        <th mat-header-cell *matHeaderCellDef>ID</th>
        <td mat-cell *matCellDef="let u">{{ u.id }}</td>
      </ng-container>
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef>Имя</th>
        <td mat-cell *matCellDef="let u">{{ u.name }}</td>
      </ng-container>
      <ng-container matColumnDef="email">
        <th mat-header-cell *matHeaderCellDef>Email</th>
        <td mat-cell *matCellDef="let u">{{ u.email }}</td>
      </ng-container>
      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef>Действия</th>
        <td mat-cell *matCellDef="let u">
          <button mat-icon-button color="warn" (click)="deleteUser(u)">
            <mat-icon>delete</mat-icon>
          </button>
        </td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="columns"></tr>
      <tr mat-row *matRowDef="let row; columns: columns"></tr>
    </table>
  \`
})
export class UserManagementComponent {
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  columns = ['id', 'name', 'email', 'actions'];
  users: User[] = [
    { id: 1, name: 'Иван', email: 'ivan@mail.ru', role: 'admin' },
    { id: 2, name: 'Мария', email: 'maria@mail.ru', role: 'user' }
  ];
  dataSource = new MatTableDataSource(this.users);
  private nextId = 3;

  openAddDialog(): void {
    const ref = this.dialog.open(UserDialogComponent, { width: '400px' });
    ref.afterClosed().subscribe(result => {
      if (result) {
        this.users = [...this.users, { id: this.nextId++, ...result }];
        this.dataSource.data = this.users;
        this.snackBar.open('Пользователь добавлен', 'OK', { duration: 3000 });
      }
    });
  }

  deleteUser(user: User): void {
    this.users = this.users.filter(u => u.id !== user.id);
    this.dataSource.data = this.users;
    this.snackBar.open(user.name + ' удалён', 'Отменить', { duration: 5000 });
  }
}`,
      explanation: 'MatTableDataSource управляет данными таблицы. MatDialog.open() показывает модальное окно. afterClosed() получает результат из диалога. [mat-dialog-close]="user" закрывает диалог и передаёт объект. MatSnackBar показывает уведомления. Angular Material обеспечивает Material Design стилизацию из коробки.'
    }
  ]
}
