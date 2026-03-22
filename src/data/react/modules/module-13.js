export default {
  id: 13,
  title: 'useMemo и оптимизация',
  description: 'Хук useMemo, React.memo, когда оптимизировать и когда нет, паттерны производительности и профилирование',
  lessons: [
    {
      id: 1,
      title: 'useMemo — мемоизация вычислений',
      type: 'theory',
      content: [
        { type: 'text', value: 'useMemo кэширует результат дорогого вычисления. Пересчитывает только при изменении зависимостей. Не путайте с useCallback — useMemo кэширует значение, useCallback — функцию.' },
        { type: 'heading', value: 'Синтаксис и применение' },
        { type: 'code', language: 'jsx', value: 'import { useMemo, useState } from "react";\n\nfunction ProductList({ products, filters }) {\n  // БЕЗ useMemo: пересчитывается при каждом рендере!\n  const expensiveResult = products\n    .filter(p => p.price >= filters.minPrice)\n    .filter(p => !filters.category || p.category === filters.category)\n    .sort((a, b) => a.price - b.price);\n\n  // С useMemo: пересчитывается только при изменении products или filters\n  const filteredProducts = useMemo(() =>\n    products\n      .filter(p => p.price >= filters.minPrice)\n      .filter(p => !filters.category || p.category === filters.category)\n      .sort((a, b) => a.price - b.price),\n    [products, filters.minPrice, filters.category] // Точные зависимости!\n  );\n\n  // Вычисляемая статистика\n  const stats = useMemo(() => ({\n    total: filteredProducts.length,\n    minPrice: Math.min(...filteredProducts.map(p => p.price)),\n    maxPrice: Math.max(...filteredProducts.map(p => p.price)),\n    avgPrice: filteredProducts.reduce((sum, p) => sum + p.price, 0) / filteredProducts.length,\n  }), [filteredProducts]);\n\n  return (\n    <div>\n      <p>Найдено: {stats.total}, цена: {stats.minPrice} - {stats.maxPrice} руб.</p>\n      {filteredProducts.map(p => <ProductCard key={p.id} product={p} />)}\n    </div>\n  );\n}' },
        { type: 'tip', value: 'useMemo полезен для: тяжёлых вычислений (фильтрация/сортировка больших массивов), создания стабильных ссылок для объектов в зависимостях useEffect, передачи объектов в мемоизированные компоненты.' }
      ]
    },
    {
      id: 2,
      title: 'React.memo — мемоизация компонентов',
      type: 'theory',
      content: [
        { type: 'text', value: 'React.memo — HOC, который предотвращает ре-рендер компонента если его props не изменились (shallow comparison). Пара для useCallback.' },
        { type: 'heading', value: 'Использование React.memo' },
        { type: 'code', language: 'jsx', value: 'import { memo, useState, useCallback } from "react";\n\n// Без memo: перерендерит при каждом изменении Parent\nfunction ExpensiveChildBad({ data, onClick }) {\n  console.log("Рендер ExpensiveChild");\n  // Дорогой рендер...\n  return <div onClick={onClick}>{data.title}</div>;\n}\n\n// С memo: перерендерит только при изменении data или onClick\nconst ExpensiveChild = memo(function ExpensiveChild({ data, onClick }) {\n  console.log("Рендер ExpensiveChild"); // Будет реже!\n  return <div onClick={onClick}>{data.title}</div>;\n});\n\nfunction Parent() {\n  const [count, setCount] = useState(0);\n  const [items] = useState([{ id: 1, title: "Элемент 1" }]);\n\n  // useCallback: стабильная функция для memo\n  const handleClick = useCallback((id) => {\n    console.log("Клик по:", id);\n  }, []);\n\n  return (\n    <div>\n      <button onClick={() => setCount(c => c + 1)}>+1 ({count})</button>\n      {/* ExpensiveChild НЕ перерендерится при изменении count! */}\n      {items.map(item => (\n        <ExpensiveChild key={item.id} data={item} onClick={() => handleClick(item.id)} />\n      ))}\n    </div>\n  );\n}' },
        { type: 'note', value: 'memo делает shallow comparison. Если передаёте объект { a: 1 } — каждый рендер новый объект, даже если значения одинаковые. Используйте useMemo для стабилизации объектов.' }
      ]
    },
    {
      id: 3,
      title: 'Когда НЕ нужна оптимизация',
      type: 'theory',
      content: [
        { type: 'text', value: 'Преждевременная оптимизация — главная ошибка. Большинство React компонентов рендерятся быстро. useMemo и memo добавляют сложность и небольшой overhead.' },
        { type: 'heading', value: 'Правило оптимизации' },
        { type: 'code', language: 'jsx', value: '// НЕ НУЖНА оптимизация:\n// 1. Простые вычисления\nconst doubled = useMemo(() => count * 2, [count]);\n// Это быстрее без useMemo! Умножение за наносекунды.\n\n// 2. Маленькие компоненты\nconst SimpleLabel = memo(function Label({ text }) {\n  return <span>{text}</span>;\n});\n// memo добавляет overhead больше, чем сам рендер!\n\n// 3. Компоненты которые и так редко рендерятся\n\n// НУЖНА оптимизация:\n// 1. Фильтрация/сортировка больших массивов (1000+ элементов)\n// 2. Компоненты внутри виртуализированных списков\n// 3. Компоненты с дорогим рендером (графики, сложные таблицы)\n// 4. Функции как зависимости useEffect\n\n// Процесс оптимизации:\n// 1. Профилируй (React DevTools Profiler)\n// 2. Найди реальную проблему\n// 3. Измерь улучшение\n// 4. Только тогда применяй оптимизацию' }
      ]
    },
    {
      id: 4,
      title: 'Паттерн разделения состояния',
      type: 'theory',
      content: [
        { type: 'text', value: 'Часто лучшая оптимизация — правильная архитектура. Разделение состояния по "уровням" предотвращает лишние рендеры без memo.' },
        { type: 'heading', value: 'State Colocation' },
        { type: 'code', language: 'jsx', value: '// ПЛОХО: глобальное состояние заставляет рендерить всё\nfunction App() {\n  const [searchQuery, setSearchQuery] = useState(""); // Меняется часто!\n  const [bigList] = useState(/* 1000 элементов */);\n\n  return (\n    <div>\n      {/* SearchBar перерендерит ВСЕХ детей при каждом вводе! */}\n      <SearchBar query={searchQuery} onChange={setSearchQuery} />\n      <ExpensiveList items={bigList} /> {/* Ненужный рендер! */}\n    </div>\n  );\n}\n\n// ХОРОШО: локальное состояние — только нужные компоненты рендерятся\nfunction SearchSection() { // Изолируем поиск в отдельный компонент\n  const [searchQuery, setSearchQuery] = useState("");\n  return <SearchBar query={searchQuery} onChange={setSearchQuery} />;\n}\n\nfunction App() {\n  const [bigList] = useState(/* 1000 элементов */);\n  return (\n    <div>\n      <SearchSection /> {/* Перерендерит только себя */}\n      <ExpensiveList items={bigList} /> {/* Не трогается! */}\n    </div>\n  );\n}' }
      ]
    },
    {
      id: 5,
      title: 'Профилирование с React DevTools',
      type: 'theory',
      content: [
        { type: 'text', value: 'React DevTools Profiler показывает какие компоненты рендерятся, как часто и сколько времени занимает. Главный инструмент для поиска проблем производительности.' },
        { type: 'heading', value: 'Как профилировать' },
        { type: 'code', language: 'jsx', value: '// 1. Установите расширение React DevTools в браузере\n// 2. Откройте DevTools -> Profiler вкладка\n// 3. Нажмите "Start profiling" (кружок записи)\n// 4. Взаимодействуйте с приложением\n// 5. Нажмите "Stop profiling"\n// 6. Смотрите:\n//    - Flame chart: визуализация дерева рендеров\n//    - Ranked chart: компоненты отсортированные по времени\n//    - Что стало причиной рендера каждого компонента\n\n// Программное профилирование:\nimport { Profiler } from "react";\n\nfunction onRenderCallback(id, phase, actualDuration) {\n  console.log(`${id} (${phase}): ${actualDuration}мс`);\n}\n\n<Profiler id="ProductList" onRender={onRenderCallback}>\n  <ProductList products={products} />\n</Profiler>' },
        { type: 'tip', value: 'В React DevTools Components вкладке выберите компонент и нажмите иконку часов — увидите последние рендеры и их причины (props/state/context). Это быстрее чем console.log.' }
      ]
    },
    {
      id: 6,
      title: 'Дорогие вычисления — пример' ,
      type: 'theory',
      content: [
        { type: 'text', value: 'Реальные примеры дорогих вычислений: поиск по большому массиву, сортировка, агрегация данных, парсинг текста. Вот когда useMemo реально помогает.' },
        { type: 'code', language: 'jsx', value: 'import { useState, useMemo } from "react";\n\n// Генерируем 10 000 элементов\nconst BIG_DATA = Array.from({ length: 10_000 }, (_, i) => ({\n  id: i,\n  name: `Продукт ${i}`,\n  price: Math.floor(Math.random() * 10_000),\n  category: ["электроника", "одежда", "еда"][i % 3],\n  rating: Math.random() * 5,\n}));\n\nfunction BigDataTable() {\n  const [search,   setSearch]   = useState("");\n  const [category, setCategory] = useState("");\n  const [minPrice, setMinPrice] = useState(0);\n  const [sortKey,  setSortKey]  = useState("name");\n  const [uiState,  setUiState]  = useState(0); // Часто меняется\n\n  // БЕЗ useMemo: 10000 операций на каждый рендер (включая смену uiState)\n  // С useMemo: только при изменении фильтров\n  const processedData = useMemo(() => {\n    const start = performance.now();\n    const result = BIG_DATA\n      .filter(p => !search   || p.name.toLowerCase().includes(search.toLowerCase()))\n      .filter(p => !category || p.category === category)\n      .filter(p => p.price >= minPrice)\n      .sort((a, b) => sortKey === "price" ? a.price - b.price :\n                      sortKey === "rating" ? b.rating - a.rating :\n                      a.name.localeCompare(b.name))\n      .slice(0, 100); // Показываем первые 100\n    console.log(`Вычисление заняло: ${(performance.now() - start).toFixed(2)}мс`);\n    return result;\n  }, [search, category, minPrice, sortKey]);\n\n  return (\n    <div>\n      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск..." />\n      <button onClick={() => setUiState(s => s + 1)}>Смена UI ({uiState})</button>\n      <p>Найдено: {processedData.length}</p>\n    </div>\n  );\n}' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Оптимизированный дашборд',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте дашборд с таблицей данных, применив useMemo, React.memo и useCallback правильно. Продемонстрируйте разницу в производительности.',
      requirements: [
        'Массив из 1000 элементов с фильтрацией и сортировкой',
        'TableRow компонент обёрнут в memo',
        'Обработчики onSort и onRowClick через useCallback',
        'Stats компонент получает агрегированные данные через useMemo',
        'Отдельный SearchInput компонент с локальным state (state colocation)',
        'Логировать рендеры для демонстрации оптимизации'
      ],
      hint: 'SearchInput имеет свой state и вызывает onSearch callback с дебаунсом. TableRow memo(function Row) — не рендерится если row prop не изменился. Stats получает уже отфильтрованные данные.',
      expectedOutput: 'Таблица из 1000+ строк рендерится без лагов\nФильтрация через useMemo — пересчёт только при изменении данных/фильтра\nСортировка через useMemo — не пересчитывается без изменений\nRe-render компонентов только при изменении их props (React.memo)\nSortButton мемоизирован через useCallback',
      solution: 'import { useState, useMemo, useCallback, memo, useEffect, useRef } from "react";\n\n// Генерация данных\nconst EMPLOYEES = Array.from({ length: 1000 }, (_, i) => ({\n  id: i + 1,\n  name: ["Алиса", "Боб", "Вера", "Дима", "Елена"][i % 5] + ` ${i + 1}`,\n  department: ["IT", "HR", "Маркетинг", "Финансы"][i % 4],\n  salary: 50_000 + Math.floor(Math.random() * 150_000),\n  rating: (3 + Math.random() * 2).toFixed(1),\n}));\n\n// Мемоизированная строка таблицы\nconst TableRow = memo(function TableRow({ employee, onSelect, isSelected }) {\n  return (\n    <tr\n      onClick={() => onSelect(employee.id)}\n      style={{ background: isSelected ? "#dbeafe" : "white", cursor: "pointer" }}\n    >\n      <td style={{ padding: "8px" }}>{employee.id}</td>\n      <td style={{ padding: "8px" }}>{employee.name}</td>\n      <td style={{ padding: "8px" }}>{employee.department}</td>\n      <td style={{ padding: "8px" }}>{employee.salary.toLocaleString()} руб.</td>\n      <td style={{ padding: "8px" }}>{employee.rating}</td>\n    </tr>\n  );\n});\n\n// Статистика — только при изменении данных\nconst Stats = memo(function Stats({ data }) {\n  const stats = useMemo(() => ({\n    count: data.length,\n    avgSalary: Math.round(data.reduce((s, e) => s + e.salary, 0) / (data.length || 1)),\n    maxSalary: Math.max(...data.map(e => e.salary)),\n    avgRating: (data.reduce((s, e) => s + Number(e.rating), 0) / (data.length || 1)).toFixed(2),\n  }), [data]);\n  return (\n    <div style={{ display: "flex", gap: "1rem", padding: "1rem", background: "#f9fafb", borderRadius: "8px", marginBottom: "1rem" }}>\n      <span>Сотрудников: <strong>{stats.count}</strong></span>\n      <span>Средняя ЗП: <strong>{stats.avgSalary.toLocaleString()} руб.</strong></span>\n      <span>Макс ЗП: <strong>{stats.maxSalary.toLocaleString()} руб.</strong></span>\n      <span>Рейтинг: <strong>{stats.avgRating}</strong></span>\n    </div>\n  );\n});\n\n// Поиск с локальным state (state colocation)\nfunction SearchInput({ onSearch }) {\n  const [value, setValue] = useState("");\n  const timerRef = useRef(null);\n\n  const handleChange = (e) => {\n    setValue(e.target.value);\n    clearTimeout(timerRef.current);\n    timerRef.current = setTimeout(() => onSearch(e.target.value), 300);\n  };\n\n  return <input value={value} onChange={handleChange} placeholder="Поиск по имени..." style={{ padding: "8px", border: "1px solid #ddd", borderRadius: "6px", width: "250px" }} />;\n}\n\nexport default function EmployeeDashboard() {\n  const [search,     setSearch]     = useState("");\n  const [department, setDepartment] = useState("");\n  const [sortField,  setSortField]  = useState("id");\n  const [sortDir,    setSortDir]    = useState("asc");\n  const [selected,   setSelected]   = useState(null);\n\n  const filtered = useMemo(() =>\n    EMPLOYEES\n      .filter(e => !search     || e.name.toLowerCase().includes(search.toLowerCase()))\n      .filter(e => !department || e.department === department)\n      .sort((a, b) => {\n        const av = a[sortField], bv = b[sortField];\n        const cmp = typeof av === "number" ? av - bv : String(av).localeCompare(String(bv));\n        return sortDir === "asc" ? cmp : -cmp;\n      })\n      .slice(0, 50),\n    [search, department, sortField, sortDir]\n  );\n\n  const handleSort = useCallback((field) => {\n    setSortField(prev => {\n      if (prev === field) setSortDir(d => d === "asc" ? "desc" : "asc");\n      return field;\n    });\n  }, []);\n\n  const handleSelect = useCallback((id) => {\n    setSelected(prev => prev === id ? null : id);\n  }, []);\n\n  const Th = ({ field, label }) => (\n    <th onClick={() => handleSort(field)} style={{ padding: "8px", cursor: "pointer", userSelect: "none", background: "#f3f4f6" }}>\n      {label} {sortField === field ? (sortDir === "asc" ? "↑" : "↓") : ""}\n    </th>\n  );\n\n  return (\n    <div style={{ padding: "1rem" }}>\n      <h2>Сотрудники</h2>\n      <Stats data={filtered} />\n      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>\n        <SearchInput onSearch={setSearch} />\n        <select value={department} onChange={e => setDepartment(e.target.value)} style={{ padding: "8px" }}>\n          <option value="">Все отделы</option>\n          {["IT", "HR", "Маркетинг", "Финансы"].map(d => <option key={d} value={d}>{d}</option>)}\n        </select>\n      </div>\n      <table style={{ width: "100%", borderCollapse: "collapse" }}>\n        <thead><tr><Th field="id" label="ID" /><Th field="name" label="Имя" /><Th field="department" label="Отдел" /><Th field="salary" label="ЗП" /><Th field="rating" label="Рейтинг" /></tr></thead>\n        <tbody>\n          {filtered.map(emp => (\n            <TableRow key={emp.id} employee={emp} onSelect={handleSelect} isSelected={selected === emp.id} />\n          ))}\n        </tbody>\n      </table>\n      <p style={{ color: "#6b7280", fontSize: "14px" }}>Показано {filtered.length} из {EMPLOYEES.length}</p>\n    </div>\n  );\n}',
      explanation: 'TableRow в memo — не рендерится при смене selected (если это не его id). handleSort и handleSelect в useCallback — стабильные ссылки для memo TableRow. Stats в memo с useMemo внутри — оптимально. SearchInput с дебаунсом через useRef — не вызывает лишних фильтраций. State colocation: SearchInput имеет свой value state, не влияет на главный компонент при вводе.'
    }
  ]
}
