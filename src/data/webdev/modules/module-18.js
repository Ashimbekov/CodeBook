export default {
  id: 18,
  title: 'JavaScript: события',
  description: 'Обработка событий: addEventListener, объект события, делегирование и всплытие',
  lessons: [
    {
      id: 1,
      title: 'addEventListener: подписка на события',
      type: 'theory',
      content: [
        { type: 'text', value: 'События — способ реагировать на действия пользователя и браузера. addEventListener — современный и правильный способ подписаться на событие.' },
        { type: 'code', language: 'javascript', value: 'const btn = document.querySelector(".btn");\n\n// Подписка на событие\nbtn.addEventListener("click", function() {\n  console.log("Кнопка нажата!");\n});\n\n// Стрелочная функция\nbtn.addEventListener("click", () => {\n  console.log("Кнопка нажата!");\n});\n\n// Именованная функция (можно удалить потом)\nfunction handleClick() {\n  console.log("Клик!");\n}\nbtn.addEventListener("click", handleClick);\n\n// Удаление обработчика\nbtn.removeEventListener("click", handleClick);\n\n// Одноразовый обработчик\nbtn.addEventListener("click", () => {\n  console.log("Только один раз!");\n}, { once: true });\n\n// Старый способ (не использовать!)\n// btn.onclick = function() { ... };' },
        { type: 'list', items: [
          'addEventListener принимает тип события, функцию-обработчик и опциональный объект настроек',
          'once: true — обработчик сработает один раз и автоматически удалится',
          'passive: true — подсказка браузеру что preventDefault не будет вызван (оптимизация прокрутки)',
          'removeEventListener требует ту же функцию — анонимные функции удалить нельзя',
          'На один элемент можно подписать несколько обработчиков на одно событие',
          'btn.onclick — старый способ, позволяет только один обработчик на событие'
        ]},
        { type: 'tip', value: 'Всегда используй addEventListener вместо onclick/onsubmit/... Атрибутный способ позволяет только один обработчик и смешивает HTML с JS. addEventListener поддерживает несколько обработчиков и опции (once, passive, capture).' }
      ]
    },
    {
      id: 2,
      title: 'Типы событий',
      type: 'theory',
      content: [
        { type: 'text', value: 'Браузер генерирует десятки разных событий. Вот самые важные.' },
        { type: 'code', language: 'javascript', value: '// Мышь\nel.addEventListener("click", fn);       // клик\nel.addEventListener("dblclick", fn);    // двойной клик\nel.addEventListener("mousedown", fn);   // нажатие кнопки\nel.addEventListener("mouseup", fn);     // отпускание\nel.addEventListener("mousemove", fn);   // движение мыши\nel.addEventListener("mouseover", fn);   // навели мышь\nel.addEventListener("mouseout", fn);    // убрали мышь\nel.addEventListener("contextmenu", fn); // правая кнопка\n\n// Клавиатура\nel.addEventListener("keydown", fn);   // нажата клавиша\nel.addEventListener("keyup", fn);     // отпущена\nel.addEventListener("keypress", fn);  // устаревший\n\n// Форма\nform.addEventListener("submit", fn);   // отправка формы\ninput.addEventListener("change", fn);  // изменение значения\ninput.addEventListener("input", fn);   // каждый символ\ninput.addEventListener("focus", fn);   // получил фокус\ninput.addEventListener("blur", fn);    // потерял фокус\n\n// Документ\nwindow.addEventListener("load", fn);          // страница загружена\ndocument.addEventListener("DOMContentLoaded", fn); // DOM готов\nwindow.addEventListener("resize", fn);        // изменение размера\nwindow.addEventListener("scroll", fn);        // прокрутка\nwindow.addEventListener("beforeunload", fn);  // закрытие' },
        { type: 'heading', value: 'Разница между похожими событиями' },
        { type: 'list', items: [
          'input — срабатывает при каждом изменении значения (каждый символ)',
          'change — срабатывает после потери фокуса, когда значение изменилось',
          'mouseover/mouseout — срабатывают при входе в дочерние элементы тоже',
          'mouseenter/mouseleave — срабатывают только при входе/выходе из самого элемента',
          'DOMContentLoaded — DOM построен, load — вся страница включая картинки загружена',
          'keydown срабатывает при удержании клавиши, keypress — устарел, использовать keydown'
        ]},
        { type: 'tip', value: 'Для живого поиска используй событие input, а не keydown. input срабатывает при любом изменении (вставка, автозаполнение), keydown — только при нажатии клавиш.' }
      ]
    },
    {
      id: 3,
      title: 'Объект события (Event Object)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Обработчик события получает объект события с информацией о том, что произошло.' },
        { type: 'code', language: 'javascript', value: 'document.addEventListener("click", (event) => {\n  // Информация о событии\n  console.log(event.type);       // "click"\n  console.log(event.target);     // элемент, по которому кликнули\n  console.log(event.currentTarget); // элемент с обработчиком\n  \n  // Координаты мыши\n  console.log(event.clientX, event.clientY); // от края окна\n  console.log(event.pageX, event.pageY);     // от края страницы\n});\n\n// Клавиатурные события\ndocument.addEventListener("keydown", (e) => {\n  console.log(e.key);      // "Enter", "Escape", "a", " "\n  console.log(e.code);     // "Enter", "KeyA", "Space"\n  console.log(e.ctrlKey);  // true если зажат Ctrl\n  console.log(e.altKey);   // Alt\n  console.log(e.shiftKey); // Shift\n  \n  if (e.key === "Escape") closeModal();\n  if (e.ctrlKey && e.key === "s") saveDocument();\n});\n\n// Отмена действия по умолчанию\nform.addEventListener("submit", (e) => {\n  e.preventDefault(); // НЕ перезагружать страницу\n  validateAndSend();\n});\n\nlink.addEventListener("click", (e) => {\n  e.preventDefault(); // НЕ переходить по ссылке\n});' },
        { type: 'list', items: [
          'event.target — элемент, на котором произошло событие (где кликнули)',
          'event.currentTarget — элемент, к которому привязан обработчик (может быть родителем)',
          'e.key возвращает читаемое название клавиши: "Enter", "Escape", "ArrowUp", "a"',
          'e.code возвращает физическое название клавиши: "KeyA", "Space" — не зависит от раскладки',
          'e.preventDefault() отменяет стандартное действие браузера (переход, отправка формы)',
          'e.stopPropagation() останавливает всплытие события к родительским элементам'
        ]},
        { type: 'tip', value: 'Для горячих клавиш используй e.key, а не e.keyCode — keyCode устарел. Проверяй модификаторы через e.ctrlKey, e.altKey, e.shiftKey, e.metaKey (Cmd на Mac).' }
      ]
    },
    {
      id: 4,
      title: 'Всплытие событий (Event Bubbling)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Когда происходит событие, оно сначала срабатывает на целевом элементе, потом всплывает к родителям до document.' },
        { type: 'code', language: 'javascript', value: '// HTML: <div id="outer"><div id="inner"><button id="btn">Клик</button></div></div>\n\ndocument.getElementById("btn").addEventListener("click", () => {\n  console.log("1. кнопка");\n});\ndocument.getElementById("inner").addEventListener("click", () => {\n  console.log("2. inner div");\n});\ndocument.getElementById("outer").addEventListener("click", () => {\n  console.log("3. outer div");\n});\n\n// При клике на кнопку выведется:\n// 1. кнопка\n// 2. inner div\n// 3. outer div\n\n// Остановить всплытие\nbtn.addEventListener("click", (e) => {\n  e.stopPropagation(); // не всплывать дальше\n});\n\n// Захват (capturing) — обратный порядок\nel.addEventListener("click", fn, { capture: true }); // сверху вниз' },
        { type: 'tip', value: 'Редко нужно останавливать всплытие. Чаще просто проверяй event.target в обработчике.' }
      ]
    },
    {
      id: 5,
      title: 'Делегирование событий',
      type: 'theory',
      content: [
        { type: 'text', value: 'Делегирование — вместо добавления обработчика к каждому элементу, добавляем один обработчик на родителя. Работает благодаря всплытию.' },
        { type: 'code', language: 'javascript', value: '// Плохо: обработчик на каждый элемент\nconst items = document.querySelectorAll(".list-item");\nitems.forEach(item => {\n  item.addEventListener("click", handleClick); // N обработчиков\n});\n\n// Хорошо: делегирование на родителя\nconst list = document.querySelector(".list");\nlist.addEventListener("click", (e) => {\n  // Проверяем, на что кликнули\n  if (e.target.classList.contains("list-item")) {\n    handleClick(e.target);\n  }\n  \n  // closest — найти ближайшего предка с селектором\n  const item = e.target.closest(".list-item");\n  if (item) handleClick(item);\n});\n\n// Практический пример: кнопки в таблице\ndocument.querySelector("table").addEventListener("click", (e) => {\n  const btn = e.target.closest("button");\n  if (!btn) return;\n  \n  const action = btn.dataset.action;\n  const row = btn.closest("tr");\n  const id = row.dataset.id;\n  \n  if (action === "edit") editItem(id);\n  if (action === "delete") deleteItem(id);\n});' },
        { type: 'tip', value: 'Делегирование особенно полезно для динамически добавляемых элементов — новые элементы автоматически получают обработчик родителя.' }
      ]
    },
    {
      id: 6,
      title: 'Пользовательские события и throttle/debounce',
      type: 'theory',
      content: [
        { type: 'text', value: 'Можно создавать и генерировать собственные события. Debounce и throttle ограничивают частоту вызова обработчиков.' },
        { type: 'code', language: 'javascript', value: '// Пользовательское событие\nconst event = new CustomEvent("userLoggedIn", {\n  detail: { userId: 123, name: "Алина" },\n  bubbles: true\n});\ndocument.dispatchEvent(event);\n\ndocument.addEventListener("userLoggedIn", (e) => {\n  console.log("Вошёл:", e.detail.name);\n});\n\n// Debounce — ждать паузу после последнего вызова\nfunction debounce(fn, delay) {\n  let timer;\n  return function(...args) {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn.apply(this, args), delay);\n  };\n}\n\n// Поиск срабатывает только после 300мс паузы\nconst search = debounce((query) => {\n  fetchResults(query);\n}, 300);\n\ninput.addEventListener("input", (e) => search(e.target.value));\n\n// Throttle — не чаще N раз в секунду\nfunction throttle(fn, interval) {\n  let lastTime = 0;\n  return function(...args) {\n    const now = Date.now();\n    if (now - lastTime >= interval) {\n      lastTime = now;\n      fn.apply(this, args);\n    }\n  };\n}\n\nwindow.addEventListener("scroll", throttle(() => {\n  updateScrollProgress();\n}, 100));' },
        { type: 'heading', value: 'Debounce vs Throttle' },
        { type: 'list', items: [
          'Debounce — функция вызывается только после паузы (ждёт тишины). Для поиска по мере ввода',
          'Throttle — функция вызывается не чаще чем раз в N мс. Для scroll, resize, mousemove',
          'CustomEvent позволяет создавать систему событий для компонентов без фреймворка',
          'bubbles: true — пользовательское событие будет всплывать как встроенное',
          'detail — объект с произвольными данными для передачи в обработчик'
        ]},
        { type: 'tip', value: 'Debounce значительно снижает количество запросов к API при поиске: без debounce каждый символ вызывает fetch, с debounce(300) — только когда пользователь остановился на 300мс. Это снижает нагрузку на сервер в 10-20 раз.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Интерактивная форма',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай форму с живой валидацией и обработкой событий.',
      requirements: [
        'Форма с полями: имя (min 2 символа), email, пароль (min 8 символов)',
        'Живая валидация при событии "input" (не submit)',
        'Показывать ошибку рядом с полем при неправильном вводе',
        'Убирать ошибку при исправлении',
        'При submit — e.preventDefault() и проверить все поля',
        'При успешной валидации — показать сообщение об успехе'
      ],
      expectedOutput: 'Форма с живой валидацией',
      hint: 'Добавь span.error рядом с каждым input. В обработчике input изменяй textContent этого span и добавляй/убирай класс .error на input.',
      solution: 'function validateField(input, rule) {\n  const errorEl = input.nextElementSibling;\n  const isValid = rule(input.value);\n  input.classList.toggle("invalid", !isValid);\n  input.classList.toggle("valid", isValid);\n  errorEl.textContent = isValid ? "" : errorEl.dataset.error;\n  return isValid;\n}\n\nconst nameInput = document.getElementById("name");\nconst emailInput = document.getElementById("email");\nconst passInput = document.getElementById("password");\nconst form = document.getElementById("form");\n\nnameInput.addEventListener("input", () =>\n  validateField(nameInput, v => v.trim().length >= 2)\n);\n\nemailInput.addEventListener("input", () =>\n  validateField(emailInput, v => /^[^@]+@[^@]+\\.[^@]+$/.test(v))\n);\n\npassInput.addEventListener("input", () =>\n  validateField(passInput, v => v.length >= 8)\n);\n\nform.addEventListener("submit", (e) => {\n  e.preventDefault();\n  const v1 = validateField(nameInput, v => v.trim().length >= 2);\n  const v2 = validateField(emailInput, v => /^[^@]+@[^@]+\\.[^@]+$/.test(v));\n  const v3 = validateField(passInput, v => v.length >= 8);\n  if (v1 && v2 && v3) {\n    document.getElementById("success").style.display = "block";\n  }\n});',
      explanation: 'Живая валидация улучшает UX — пользователь видит ошибки сразу, не после нажатия. e.preventDefault() останавливает стандартное поведение формы. classList.toggle(class, condition) удобен для переключения в зависимости от условия.'
    }
  ]
}
