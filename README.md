# CodeBook

Интерактивная платформа для изучения программирования. Курсы по языкам, фреймворкам, алгоритмам и подготовке к собеседованиям — теория + практика в одном месте.

## Курсы

Python, JavaScript, TypeScript, Java, Kotlin, Go, SQL, React, Django, FastAPI, Spring Boot, Docker, Kubernetes, CI/CD, алгоритмы, системный дизайн, подготовка к собеседованиям, веб-разработка, English (A1–B2).

## Стек

- **Vue 3** + Composition API
- **Vue Router** — маршрутизация
- **Pinia** — стейт-менеджмент
- **Vite** — сборка
- **Highlight.js** — подсветка кода

## Запуск

```bash
npm install
npm run dev -- --port 5569
```

Dev-сервер запустится на `http://localhost:5569`.

Для доступа по сети:

```bash
npx vite --host 0.0.0.0 --port 5569
```

## Сборка

```bash
npm run build
npm run preview
```

## Структура

```
src/
├── components/   # UI-компоненты (курсы, уроки, практика)
├── data/         # Данные курсов (модули, уроки)
├── views/        # Страницы (Home, Course, Lesson, Roadmap)
├── router/       # Маршрутизация
├── stores/       # Pinia-хранилища
└── assets/       # Стили
```


