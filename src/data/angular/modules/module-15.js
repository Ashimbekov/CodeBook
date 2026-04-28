export default {
  id: 15,
  title: 'Модули NgModule',
  description: 'Система модулей Angular: NgModule, SharedModule, CoreModule, Feature Modules и организация кода',
  lessons: [
    {
      id: 1,
      title: 'Что такое NgModule',
      type: 'theory',
      content: [
        { type: 'text', value: 'NgModule — это механизм группировки компонентов, директив, пайпов и сервисов в логические блоки. До Angular 14 модули были обязательны. Сейчас есть standalone компоненты, но понимание модулей важно для поддержки существующих проектов.' },
        { type: 'heading', value: 'Структура NgModule' },
        { type: 'code', language: 'typescript', value: '// app.module.ts\nimport { NgModule } from \'@angular/core\';\nimport { BrowserModule } from \'@angular/platform-browser\';\nimport { FormsModule } from \'@angular/forms\';\nimport { HttpClientModule } from \'@angular/common/http\';\nimport { AppRoutingModule } from \'./app-routing.module\';\nimport { AppComponent } from \'./app.component\';\nimport { HeaderComponent } from \'./header/header.component\';\nimport { FooterComponent } from \'./footer/footer.component\';\n\n@NgModule({\n  declarations: [    // Компоненты, директивы, пайпы ЭТОГО модуля\n    AppComponent,\n    HeaderComponent,\n    FooterComponent\n  ],\n  imports: [          // Другие модули, которые нужны\n    BrowserModule,\n    FormsModule,\n    HttpClientModule,\n    AppRoutingModule\n  ],\n  providers: [],      // Сервисы (обычно providedIn: \'root\')\n  bootstrap: [AppComponent]  // Корневой компонент (только в AppModule)\n})\nexport class AppModule {}' },
        { type: 'heading', value: 'Свойства @NgModule' },
        { type: 'list', value: [
          'declarations — компоненты, директивы и пайпы, принадлежащие модулю',
          'imports — другие модули, чьи exports нужны в этом модуле',
          'exports — компоненты/директивы/пайпы, доступные другим модулям',
          'providers — сервисы, доступные в этом модуле и его детях',
          'bootstrap — корневой компонент (только для AppModule)'
        ] },
        { type: 'note', value: 'Каждый компонент должен принадлежать ОДНОМУ модулю. Нельзя объявить один компонент в двух declarations. Для переиспользования — exports в SharedModule.' }
      ]
    },
    {
      id: 2,
      title: 'Feature Modules',
      type: 'theory',
      content: [
        { type: 'text', value: 'Feature Module (модуль фичи) группирует функциональность одной области приложения: пользователи, заказы, админ-панель. Каждый Feature Module имеет свой роутинг, компоненты и сервисы.' },
        { type: 'heading', value: 'Создание Feature Module' },
        { type: 'code', language: 'bash', value: '# Генерация модуля с роутингом\nng generate module users --routing\n\n# Создаёт:\n# src/app/users/users.module.ts\n# src/app/users/users-routing.module.ts' },
        { type: 'heading', value: 'Структура Feature Module' },
        { type: 'code', language: 'typescript', value: '// users/users.module.ts\nimport { NgModule } from \'@angular/core\';\nimport { CommonModule } from \'@angular/common\';\nimport { UsersRoutingModule } from \'./users-routing.module\';\nimport { UserListComponent } from \'./user-list/user-list.component\';\nimport { UserDetailComponent } from \'./user-detail/user-detail.component\';\nimport { UserFormComponent } from \'./user-form/user-form.component\';\nimport { SharedModule } from \'../shared/shared.module\';\n\n@NgModule({\n  declarations: [\n    UserListComponent,\n    UserDetailComponent,\n    UserFormComponent\n  ],\n  imports: [\n    CommonModule,      // *ngIf, *ngFor, pipes (вместо BrowserModule)\n    UsersRoutingModule,\n    SharedModule        // Общие компоненты\n  ]\n})\nexport class UsersModule {}\n\n// users/users-routing.module.ts\nimport { NgModule } from \'@angular/core\';\nimport { RouterModule, Routes } from \'@angular/router\';\n\nconst routes: Routes = [\n  { path: \'\', component: UserListComponent },\n  { path: \':id\', component: UserDetailComponent },\n  { path: \'new\', component: UserFormComponent }\n];\n\n@NgModule({\n  imports: [RouterModule.forChild(routes)],\n  exports: [RouterModule]\n})\nexport class UsersRoutingModule {}' },
        { type: 'tip', value: 'Feature Modules используют CommonModule вместо BrowserModule. BrowserModule импортируется только один раз — в AppModule.' }
      ]
    },
    {
      id: 3,
      title: 'SharedModule и CoreModule',
      type: 'theory',
      content: [
        { type: 'text', value: 'SharedModule содержит переиспользуемые компоненты, директивы и пайпы. CoreModule содержит синглтон-сервисы и компоненты, которые используются один раз (Header, Footer).' },
        { type: 'heading', value: 'SharedModule' },
        { type: 'code', language: 'typescript', value: '// shared/shared.module.ts\nimport { NgModule } from \'@angular/core\';\nimport { CommonModule } from \'@angular/common\';\nimport { FormsModule, ReactiveFormsModule } from \'@angular/forms\';\nimport { ButtonComponent } from \'./components/button/button.component\';\nimport { CardComponent } from \'./components/card/card.component\';\nimport { LoadingSpinnerComponent } from \'./components/loading-spinner/loading-spinner.component\';\nimport { TruncatePipe } from \'./pipes/truncate.pipe\';\nimport { HighlightDirective } from \'./directives/highlight.directive\';\n\n@NgModule({\n  declarations: [\n    ButtonComponent,\n    CardComponent,\n    LoadingSpinnerComponent,\n    TruncatePipe,\n    HighlightDirective\n  ],\n  imports: [\n    CommonModule,\n    FormsModule,\n    ReactiveFormsModule\n  ],\n  exports: [\n    // Переэкспортируем всё, что нужно другим модулям\n    CommonModule,\n    FormsModule,\n    ReactiveFormsModule,\n    ButtonComponent,\n    CardComponent,\n    LoadingSpinnerComponent,\n    TruncatePipe,\n    HighlightDirective\n  ]\n})\nexport class SharedModule {}' },
        { type: 'heading', value: 'CoreModule' },
        { type: 'code', language: 'typescript', value: '// core/core.module.ts\nimport { NgModule, Optional, SkipSelf } from \'@angular/core\';\nimport { HTTP_INTERCEPTORS } from \'@angular/common/http\';\nimport { AuthInterceptor } from \'./interceptors/auth.interceptor\';\nimport { HeaderComponent } from \'./components/header/header.component\';\nimport { FooterComponent } from \'./components/footer/footer.component\';\n\n@NgModule({\n  declarations: [HeaderComponent, FooterComponent],\n  exports: [HeaderComponent, FooterComponent],\n  providers: [\n    {\n      provide: HTTP_INTERCEPTORS,\n      useClass: AuthInterceptor,\n      multi: true\n    }\n  ]\n})\nexport class CoreModule {\n  // Защита от повторного импорта\n  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {\n    if (parentModule) {\n      throw new Error(\'CoreModule уже загружен. Импортируйте его только в AppModule!\');\n    }\n  }\n}' },
        { type: 'note', value: 'SharedModule импортируется в каждый Feature Module. CoreModule — только в AppModule. Это предотвращает дублирование синглтон-сервисов.' }
      ]
    },
    {
      id: 4,
      title: 'Lazy Loading модулей',
      type: 'theory',
      content: [
        { type: 'text', value: 'Lazy Loading позволяет загружать Feature Modules по требованию. Код модуля скачивается только при навигации на соответствующий маршрут.' },
        { type: 'heading', value: 'Настройка Lazy Loading' },
        { type: 'code', language: 'typescript', value: '// app-routing.module.ts\nconst routes: Routes = [\n  { path: \'\', component: HomeComponent },\n  {\n    path: \'users\',\n    loadChildren: () => import(\'./users/users.module\')\n      .then(m => m.UsersModule)\n  },\n  {\n    path: \'admin\',\n    loadChildren: () => import(\'./admin/admin.module\')\n      .then(m => m.AdminModule)\n  },\n  {\n    path: \'orders\',\n    loadChildren: () => import(\'./orders/orders.module\')\n      .then(m => m.OrdersModule)\n  }\n];\n\n@NgModule({\n  imports: [RouterModule.forRoot(routes)],\n  exports: [RouterModule]\n})\nexport class AppRoutingModule {}' },
        { type: 'heading', value: 'Структура проекта с модулями' },
        { type: 'code', language: 'bash', value: 'src/app/\n├── core/                    # CoreModule (синглтоны)\n│   ├── core.module.ts\n│   ├── interceptors/\n│   ├── guards/\n│   └── components/\n│       ├── header/\n│       └── footer/\n├── shared/                  # SharedModule (переиспользуемое)\n│   ├── shared.module.ts\n│   ├── components/\n│   ├── directives/\n│   └── pipes/\n├── users/                   # Feature Module\n│   ├── users.module.ts\n│   ├── users-routing.module.ts\n│   ├── user-list/\n│   ├── user-detail/\n│   └── services/\n├── admin/                   # Feature Module (lazy)\n│   ├── admin.module.ts\n│   └── ...\n├── app.module.ts\n├── app-routing.module.ts\n└── app.component.ts' },
        { type: 'tip', value: 'При Lazy Loading модуль получает свой инжектор. Сервисы, объявленные в providers Feature Module, будут доступны только внутри этого модуля.' }
      ]
    },
    {
      id: 5,
      title: 'Миграция на Standalone',
      type: 'theory',
      content: [
        { type: 'text', value: 'Angular развивается в сторону standalone компонентов, которые не требуют NgModule. Новые проекты рекомендуется создавать без модулей. Для существующих проектов Angular предоставляет инструменты миграции.' },
        { type: 'heading', value: 'NgModule vs Standalone' },
        { type: 'code', language: 'typescript', value: '// NgModule подход (старый)\n@NgModule({\n  declarations: [UserListComponent, UserCardComponent],\n  imports: [CommonModule, SharedModule],\n  exports: [UserListComponent]\n})\nexport class UsersModule {}\n\n// Standalone подход (новый)\n@Component({\n  selector: \'app-user-list\',\n  standalone: true,\n  imports: [UserCardComponent, AsyncPipe, DatePipe],\n  template: `...`\n})\nexport class UserListComponent {}\n// Нет модуля! Импорты указаны прямо в компоненте.' },
        { type: 'heading', value: 'Автоматическая миграция' },
        { type: 'code', language: 'bash', value: '# Angular CLI может автоматически мигрировать на standalone\nng generate @angular/core:standalone\n\n# Шаги миграции:\n# 1. Конвертирует компоненты в standalone\n# 2. Удаляет ненужные NgModule\n# 3. Обновляет imports' },
        { type: 'heading', value: 'Когда ещё нужны NgModule' },
        { type: 'list', value: [
          'Поддержка существующих проектов на Angular < 14',
          'Библиотеки Angular, которые используют NgModule',
          'Некоторые сторонние библиотеки ещё не поддерживают standalone',
          'Сложная конфигурация провайдеров на уровне модуля'
        ] },
        { type: 'note', value: 'Angular 17+ по умолчанию создаёт standalone проекты. NgModule всё ещё поддерживается, но для новых проектов рекомендуется standalone подход.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Организация проекта с модулями',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спроектируйте структуру приложения интернет-магазина с CoreModule, SharedModule и Feature Modules.',
      requirements: [
        'CoreModule: HeaderComponent, FooterComponent, AuthService, AuthInterceptor',
        'SharedModule: ButtonComponent, CardComponent, LoadingComponent, TruncatePipe',
        'ProductsModule: ProductListComponent, ProductDetailComponent (lazy loaded)',
        'CartModule: CartComponent, CartItemComponent (lazy loaded)',
        'Правильные imports/exports в каждом модуле',
        'Lazy loading для ProductsModule и CartModule'
      ],
      hint: 'CoreModule импортируется только в AppModule. SharedModule — в каждый Feature Module. Feature Modules загружаются через loadChildren.',
      expectedOutput: 'Структура модулей правильно организована. CoreModule защищён от повторного импорта. SharedModule экспортирует общие компоненты. Feature Modules загружаются лениво.',
      solution: `// core/core.module.ts
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HeaderComponent } from './components/header.component';
import { FooterComponent } from './components/footer.component';

@NgModule({
  declarations: [HeaderComponent, FooterComponent],
  exports: [HeaderComponent, FooterComponent]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parent: CoreModule) {
    if (parent) {
      throw new Error('CoreModule уже загружен!');
    }
  }
}

// shared/shared.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from './components/button.component';
import { CardComponent } from './components/card.component';
import { LoadingComponent } from './components/loading.component';
import { TruncatePipe } from './pipes/truncate.pipe';

@NgModule({
  declarations: [ButtonComponent, CardComponent, LoadingComponent, TruncatePipe],
  imports: [CommonModule, FormsModule],
  exports: [
    CommonModule, FormsModule,
    ButtonComponent, CardComponent, LoadingComponent, TruncatePipe
  ]
})
export class SharedModule {}

// products/products.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { ProductListComponent } from './product-list.component';
import { ProductDetailComponent } from './product-detail.component';

const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: ':id', component: ProductDetailComponent }
];

@NgModule({
  declarations: [ProductListComponent, ProductDetailComponent],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class ProductsModule {}

// cart/cart.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { CartComponent } from './cart.component';
import { CartItemComponent } from './cart-item.component';

const routes: Routes = [
  { path: '', component: CartComponent }
];

@NgModule({
  declarations: [CartComponent, CartItemComponent],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class CartModule {}

// app-routing.module.ts
const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', loadChildren: () => import('./products/products.module').then(m => m.ProductsModule) },
  { path: 'cart', loadChildren: () => import('./cart/cart.module').then(m => m.CartModule) }
];

// app.module.ts
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, CoreModule, AppRoutingModule],
  bootstrap: [AppComponent]
})
export class AppModule {}`,
      explanation: 'CoreModule содержит синглтон-компоненты и защищён от повторного импорта. SharedModule экспортирует общие компоненты, директивы, пайпы и часто используемые модули (CommonModule, FormsModule). Feature Modules (Products, Cart) импортируют SharedModule и определяют свой роутинг через RouterModule.forChild(). loadChildren обеспечивает lazy loading — код модуля загружается только при навигации.'
    }
  ]
}
