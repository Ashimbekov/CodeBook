export default {
  id: 21,
  title: 'Стилизация (CSS Modules, Tailwind)',
  description: 'Современные подходы к стилизации React-компонентов: CSS Modules для локальных стилей, Tailwind CSS для утилитарных классов, clsx/classnames для условных классов.',
  lessons: [
    {
      id: 1,
      title: 'CSS Modules: локальная область видимости',
      type: 'theory',
      content: [
        { type: 'text', value: 'CSS Modules автоматически генерируют уникальные имена классов, предотвращая конфликты стилей между компонентами. Файл .module.css обрабатывается сборщиком.' },
        { type: 'heading', value: 'Создание и использование CSS Module' },
        { type: 'code', language: 'jsx', value: '// Button.module.css\n// .button { ... }\n// .primary { ... }\n// .secondary { ... }\n// .disabled { ... }\n\nimport styles from "./Button.module.css";\n\nfunction Button({ variant = "primary", disabled, children, onClick }) {\n  return (\n    <button\n      className={\n        // Объединяем классы вручную\n        [styles.button, styles[variant], disabled && styles.disabled]\n          .filter(Boolean)\n          .join(" ")\n      }\n      onClick={onClick}\n      disabled={disabled}\n    >\n      {children}\n    </button>\n  );\n}\n\n// В DOM: class="Button_button__x9Aw2 Button_primary__3kQ1p"\n// Уникальные имена — нет конфликтов!\n\n// Глобальный класс (не трансформируется)\n// :global(.global-class) { ... }\n// Компонент может использовать .global-class без import' },
        { type: 'note', value: 'В Vite CSS Modules работают из коробки — просто назови файл *.module.css. В CRA тоже поддерживается без настройки.' }
      ]
    },
    {
      id: 2,
      title: 'CSS Modules: составные классы и темизация',
      type: 'theory',
      content: [
        { type: 'text', value: 'Директива composes позволяет наследовать стили одного класса в другом. CSS-переменные обеспечивают темизацию.' },
        { type: 'code', language: 'jsx', value: '/* Card.module.css */\n/*\n.base {\n  border-radius: 8px;\n  padding: 16px;\n  box-shadow: 0 2px 8px rgba(0,0,0,0.1);\n}\n\n.card {\n  composes: base;  <-- Наследуем стили из .base\n  background: var(--color-surface);\n}\n\n.cardHover:hover {\n  transform: translateY(-2px);\n  transition: transform 0.2s;\n}\n*/\n\nimport styles from "./Card.module.css";\nimport clsx from "clsx"; // npm install clsx\n\nfunction Card({ hoverable, className, children }) {\n  return (\n    <div\n      className={clsx(\n        styles.card,\n        hoverable && styles.cardHover,\n        className // Позволяем передавать внешние классы\n      )}\n    >\n      {children}\n    </div>\n  );\n}' },
        { type: 'tip', value: 'Библиотека clsx (1KB) — стандарт для объединения классов. Поддерживает строки, объекты и массивы: clsx("a", isB && "b", { c: isC, d: isD }).' }
      ]
    },
    {
      id: 3,
      title: 'Tailwind CSS: утилитарный подход',
      type: 'theory',
      content: [
        { type: 'text', value: 'Tailwind CSS предоставляет низкоуровневые CSS-классы прямо в HTML/JSX. Не нужно писать CSS-файлы — стилизуешь компоненты через классы.' },
        { type: 'heading', value: 'Основные классы Tailwind' },
        { type: 'code', language: 'jsx', value: '// npm install tailwindcss @tailwindcss/vite\n// Полная настройка: см. документацию tailwindcss.com\n\nfunction UserCard({ user }) {\n  return (\n    <div className="bg-white rounded-xl shadow-md p-6 max-w-sm w-full">\n      <div className="flex items-center gap-4 mb-4">\n        <img\n          src={user.avatar}\n          alt={user.name}\n          className="w-16 h-16 rounded-full object-cover"\n        />\n        <div>\n          <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>\n          <p className="text-sm text-gray-500">{user.role}</p>\n        </div>\n      </div>\n      <p className="text-gray-700 text-sm leading-relaxed">{user.bio}</p>\n      <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">\n        Подписаться\n      </button>\n    </div>\n  );\n}\n// Нет ни одного CSS-файла!' },
        { type: 'note', value: 'Tailwind использует PurgeCSS — в продакшн-сборке включаются только использованные классы. Итоговый CSS очень маленький.' }
      ]
    },
    {
      id: 4,
      title: 'Tailwind: адаптивность и состояния',
      type: 'theory',
      content: [
        { type: 'text', value: 'Tailwind имеет префиксы для брейкпоинтов (sm:, md:, lg:, xl:) и псевдоклассов (hover:, focus:, active:, disabled:).' },
        { type: 'code', language: 'jsx', value: 'function ResponsiveNav() {\n  return (\n    <nav className="flex flex-col sm:flex-row gap-2 sm:gap-6 p-4">\n      {/*\n        flex-col — вертикально на мобильных\n        sm:flex-row — горизонтально от sm (640px+)\n      */}\n      <a className="\n        text-gray-600\n        hover:text-blue-600  // При наведении\n        focus:outline-none focus:ring-2 focus:ring-blue-500  // При фокусе\n        transition-colors duration-200\n        font-medium\n        md:text-lg  // Размер на md (768px+)\n      ">Главная</a>\n    </nav>\n  );\n}\n\n// Тёмная тема с dark: префиксом\nfunction Card() {\n  return (\n    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white\n                    rounded-lg p-4 shadow dark:shadow-gray-700">\n      Карточка с поддержкой тёмной темы\n    </div>\n  );\n}' },
        { type: 'tip', value: 'Плагин Prettier для Tailwind автоматически сортирует классы в правильном порядке: npm install -D prettier-plugin-tailwindcss.' }
      ]
    },
    {
      id: 5,
      title: 'Компонент с вариантами: cva (class-variance-authority)',
      type: 'theory',
      content: [
        { type: 'text', value: 'cva — библиотека для создания компонентов с вариантами стилей. Идеально сочетается с Tailwind.' },
        { type: 'code', language: 'jsx', value: '// npm install class-variance-authority\nimport { cva } from "class-variance-authority";\nimport clsx from "clsx";\n\n// Определяем варианты кнопки\nconst buttonVariants = cva(\n  // Базовые классы\n  "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none",\n  {\n    variants: {\n      variant: {\n        default: "bg-blue-600 text-white hover:bg-blue-700",\n        outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",\n        ghost: "text-gray-700 hover:bg-gray-100",\n        danger: "bg-red-600 text-white hover:bg-red-700",\n      },\n      size: {\n        sm: "h-8 px-3 text-sm",\n        md: "h-10 px-4 text-sm",\n        lg: "h-12 px-6 text-base",\n      },\n    },\n    defaultVariants: {\n      variant: "default",\n      size: "md",\n    },\n  }\n);\n\nfunction Button({ variant, size, className, children, ...props }) {\n  return (\n    <button\n      className={clsx(buttonVariants({ variant, size }), className)}\n      {...props}\n    >\n      {children}\n    </button>\n  );\n}\n\n// Использование\n// <Button>Основная</Button>\n// <Button variant="outline" size="sm">Маленькая</Button>\n// <Button variant="danger" size="lg">Удалить</Button>' }
      ]
    },
    {
      id: 6,
      title: 'CSS-in-JS: styled-components и emotion',
      type: 'theory',
      content: [
        { type: 'text', value: 'CSS-in-JS библиотеки позволяют писать стили как JavaScript код. Поддерживают динамические стили на основе пропсов, темизацию и автоматический критический CSS.' },
        { type: 'code', language: 'jsx', value: '// npm install styled-components\nimport styled from "styled-components";\n\n// Создаём стилизованный компонент\nconst Button = styled.button`\n  background: ${props => props.primary ? "#007bff" : "#6c757d"};\n  color: white;\n  padding: 8px 16px;\n  border: none;\n  border-radius: 4px;\n  cursor: pointer;\n  font-size: ${props => props.large ? "18px" : "14px"};\n\n  &:hover {\n    opacity: 0.9;\n  }\n\n  &:disabled {\n    opacity: 0.5;\n    cursor: not-allowed;\n  }\n`;\n\nconst Card = styled.div`\n  border-radius: 8px;\n  padding: 16px;\n  background: ${({ theme }) => theme.colors.surface};\n  color: ${({ theme }) => theme.colors.text};\n`;\n\n// Использование\nfunction App() {\n  return (\n    <div>\n      <Button primary>Основная кнопка</Button>\n      <Button large>Большая кнопка</Button>\n      <Card>Карточка с темой</Card>\n    </div>\n  );\n}' },
        { type: 'note', value: 'CSS-in-JS добавляет runtime overhead. В 2024 году многие команды переходят на CSS Modules или Tailwind. Тем не менее styled-components хорош для компонентных библиотек.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Design System Button компонент',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай переиспользуемый компонент Button с вариантами (primary, secondary, danger, ghost), размерами (sm, md, lg) и состояниями (loading, disabled). Используй CSS Modules или Tailwind.',
      requirements: [
        'Button принимает пропсы: variant, size, loading, disabled, children, onClick',
        'Варианты variant: "primary" | "secondary" | "danger" | "ghost"',
        'Размеры size: "sm" | "md" | "lg" — разные padding и font-size',
        'При loading показывает спиннер (анимированный ●●●) и disabled',
        'Правильные aria-атрибуты: aria-busy при loading, aria-disabled при disabled',
        'Использование clsx для объединения классов'
      ],
      hint: 'Создай объекты variantClasses и sizeClasses: const variantClasses = { primary: styles.primary, secondary: styles.secondary, ... }. Используй clsx(styles.base, variantClasses[variant], sizeClasses[size], loading && styles.loading).',
      solution: 'import clsx from "clsx";\n\n// Для простоты используем inline-styles, но подход с классами аналогичен\nconst variants = {\n  primary: { background: "#2563eb", color: "white" },\n  secondary: { background: "#6b7280", color: "white" },\n  danger: { background: "#dc2626", color: "white" },\n  ghost: { background: "transparent", color: "#374151", border: "1px solid #d1d5db" },\n};\n\nconst sizes = {\n  sm: { padding: "6px 12px", fontSize: "12px" },\n  md: { padding: "8px 16px", fontSize: "14px" },\n  lg: { padding: "12px 24px", fontSize: "16px" },\n};\n\nfunction Button({\n  variant = "primary",\n  size = "md",\n  loading = false,\n  disabled = false,\n  children,\n  onClick,\n  ...rest\n}) {\n  const isDisabled = disabled || loading;\n\n  return (\n    <button\n      onClick={onClick}\n      disabled={isDisabled}\n      aria-busy={loading}\n      aria-disabled={isDisabled}\n      style={{\n        ...variants[variant],\n        ...sizes[size],\n        borderRadius: "6px",\n        border: "none",\n        cursor: isDisabled ? "not-allowed" : "pointer",\n        opacity: isDisabled ? 0.6 : 1,\n        display: "inline-flex",\n        alignItems: "center",\n        gap: "6px",\n        transition: "opacity 0.2s",\n        ...(variants[variant].border && { border: variants[variant].border }),\n      }}\n      {...rest}\n    >\n      {loading && <span>●</span>}\n      {children}\n    </button>\n  );\n}\n\n// Демо\nfunction App() {\n  const [isLoading, setIsLoading] = React.useState(false);\n  const handleClick = () => {\n    setIsLoading(true);\n    setTimeout(() => setIsLoading(false), 2000);\n  };\n  return (\n    <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "20px" }}>\n      <Button variant="primary" onClick={handleClick} loading={isLoading}>Сохранить</Button>\n      <Button variant="secondary" size="sm">Отмена (sm)</Button>\n      <Button variant="danger" size="lg">Удалить (lg)</Button>\n      <Button variant="ghost" disabled>Заблокировано</Button>\n    </div>\n  );\n}',
      explanation: 'Design system компонент инкапсулирует все визуальные варианты. clsx позволяет гибко комбинировать классы. Важно помнить об aria-атрибутах для доступности.'
    }
  ]
}
