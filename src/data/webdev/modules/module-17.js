export default {
  id: 17,
  title: 'JavaScript: DOM',
  description: 'Манипуляции с DOM — querySelector, createElement, classList, textContent',
  lessons: [
    {
      id: 1,
      title: 'Что такое DOM?',
      type: 'theory',
      content: [
        { type: 'text', value: 'DOM (Document Object Model) — это представление HTML-страницы в виде дерева объектов. JS работает с DOM для чтения и изменения страницы.' },
        { type: 'code', language: 'javascript', value: '// Корневые объекты\nconsole.log(document);           // весь документ\nconsole.log(document.body);      // <body>\nconsole.log(document.head);      // <head>\nconsole.log(document.title);     // заголовок страницы\n\n// Изменение title\ndocument.title = "Новый заголовок";\n\n// Доступ к элементам\ndocument.getElementById("myId");\ndocument.getElementsByClassName("myClass"); // HTMLCollection\ndocument.getElementsByTagName("p");         // HTMLCollection' },
        { type: 'tip', value: 'Думай о DOM как о живом JSON-дереве. Каждый HTML-элемент — объект с методами и свойствами. Изменяешь объект — меняется страница мгновенно.' }
      ]
    },
    {
      id: 2,
      title: 'querySelector и querySelectorAll',
      type: 'theory',
      content: [
        { type: 'text', value: 'querySelector и querySelectorAll — современные методы поиска элементов. Используют CSS-селекторы.' },
        { type: 'code', language: 'javascript', value: '// querySelector — первый подходящий элемент (или null)\nconst title = document.querySelector("h1");\nconst btn = document.querySelector(".submit-btn");\nconst nav = document.querySelector("#main-nav");\nconst input = document.querySelector("form input[type=email]");\n\n// querySelectorAll — все подходящие (NodeList)\nconst allLinks = document.querySelectorAll("a");\nconst cards = document.querySelectorAll(".card");\n\n// NodeList можно перебирать\ncards.forEach(card => {\n  console.log(card.textContent);\n});\n\n// Или конвертировать в массив\nconst cardsArray = Array.from(cards);\nconst filtered = cardsArray.filter(c => c.classList.contains("active"));\n\n// Поиск внутри элемента\nconst form = document.querySelector("form");\nconst inputs = form.querySelectorAll("input"); // только внутри формы\n\n// Навигация по дереву\nconst parent = element.parentElement;\nconst children = element.children;\nconst next = element.nextElementSibling;\nconst prev = element.previousElementSibling;' }
      ]
    },
    {
      id: 3,
      title: 'Чтение и изменение содержимого',
      type: 'theory',
      content: [
        { type: 'text', value: 'После нахождения элемента можно читать и менять его текст, HTML и атрибуты.' },
        { type: 'code', language: 'javascript', value: 'const el = document.querySelector(".title");\n\n// Текстовое содержимое\nconsole.log(el.textContent);  // весь текст, включая скрытое\nconsole.log(el.innerText);    // видимый текст\nel.textContent = "Новый текст"; // безопасно (экранирует HTML)\n\n// HTML содержимое\nconsole.log(el.innerHTML); // с HTML-тегами\nel.innerHTML = "<strong>Жирный текст</strong>"; // опасно!\n\n// Атрибуты\nconst img = document.querySelector("img");\nconsole.log(img.src);          // атрибут как свойство\nconsole.log(img.alt);\nimg.src = "new-image.jpg";\n\nconst link = document.querySelector("a");\nconsole.log(link.getAttribute("href")); // getAttribute\nlink.setAttribute("href", "/new-page");\nlink.removeAttribute("disabled");\n\n// data-атрибуты\nconst btn = document.querySelector("[data-id]");\nconsole.log(btn.dataset.id);   // значение data-id\nconsole.log(btn.dataset.userId); // data-user-id → userId (camelCase)' },
        { type: 'warning', value: 'Никогда не вставляй пользовательский ввод через innerHTML — это XSS-уязвимость. Используй textContent для текста или DOM-методы для HTML.' }
      ]
    },
    {
      id: 4,
      title: 'classList: работа с классами',
      type: 'theory',
      content: [
        { type: 'text', value: 'classList — API для работы с классами элемента. Намного удобнее, чем работа со строкой className.' },
        { type: 'code', language: 'javascript', value: 'const el = document.querySelector(".card");\n\n// Основные методы\nel.classList.add("active");         // добавить класс\nel.classList.remove("hidden");      // удалить класс\nel.classList.toggle("open");        // добавить/удалить\nel.classList.toggle("dark", true);  // принудительно добавить\nel.classList.contains("active");    // проверить наличие → true/false\nel.classList.replace("old", "new"); // заменить класс\n\n// Несколько классов\nel.classList.add("red", "bold", "large");\nel.classList.remove("red", "bold");\n\n// Получить все классы\nconsole.log(el.classList.toString()); // "card active"\nconsole.log([...el.classList]);       // ["card", "active"]\n\n// Пример: кнопка лайка\nconst likeBtn = document.querySelector(".like-btn");\nlikeBtn.addEventListener("click", () => {\n  likeBtn.classList.toggle("liked");\n});' }
      ]
    },
    {
      id: 5,
      title: 'Создание и вставка элементов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Элементы можно создавать динамически и вставлять в DOM.' },
        { type: 'code', language: 'javascript', value: '// Создать элемент\nconst div = document.createElement("div");\ndiv.className = "card";\ndiv.textContent = "Новая карточка";\n\n// Вставка\nconst container = document.querySelector(".container");\ncontainer.appendChild(div);          // в конец\ncontainer.prepend(div);              // в начало\ncontainer.insertBefore(div, ref);    // перед ref\n\n// Современные методы\ncontainer.append(div, "текст");      // несколько элементов и текст\ncontainer.before(div);              // перед контейнером\ncontainer.after(div);               // после контейнера\ncontainer.replaceWith(div);         // заменить контейнер\n\n// insertAdjacentHTML — вставка HTML\nel.insertAdjacentHTML("beforeend", "<p>Абзац</p>");\n// "beforebegin" — перед el\n// "afterbegin" — первый дочерний\n// "beforeend" — последний дочерний\n// "afterend" — после el\n\n// Удаление\nconst old = document.querySelector(".old-item");\nold.remove();\n\n// Клонирование\nconst clone = div.cloneNode(true); // true = с детьми' }
      ]
    },
    {
      id: 6,
      title: 'Изменение стилей через JS',
      type: 'theory',
      content: [
        { type: 'text', value: 'JS может менять CSS-стили напрямую или через CSS-классы (предпочтительно).' },
        { type: 'code', language: 'javascript', value: 'const el = document.querySelector(".box");\n\n// Инлайн стили (нежелательно для сложного)\nel.style.color = "red";\nel.style.fontSize = "18px";      // camelCase!\nel.style.backgroundColor = "blue";\nel.style.display = "none";       // скрыть\n\n// Считать вычисленный стиль\nconst style = window.getComputedStyle(el);\nconsole.log(style.color);       // rgb(255, 0, 0)\nconsole.log(style.fontSize);    // "18px"\n\n// CSS-переменные через JS\nel.style.setProperty("--color", "blue");\nconst color = el.style.getPropertyValue("--color");\n\n// ЛУЧШЕ: управляй классами, а стили в CSS\n// В CSS: .hidden { display: none; }\n// В JS:\nel.classList.add("hidden");    // скрыть\nel.classList.remove("hidden"); // показать\nel.classList.toggle("hidden"); // переключить' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Динамический список задач',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай интерактивный список задач с добавлением и удалением элементов через DOM.',
      requirements: [
        'Поле ввода для новой задачи и кнопка добавления',
        'При нажатии кнопки (или Enter) добавляется новый <li>',
        'У каждого элемента списка кнопка удаления',
        'При клике на задачу — пометить как выполненную (класс .done)',
        'Если поле пустое — не добавлять'
      ],
      expectedOutput: 'Интерактивный список задач с DOM',
      hint: 'createElement("li"), потом добавь textContent и кнопку delete через appendChild. При клике на li — classList.toggle("done").',
      solution: '// HTML:\n// <input id="input" type="text" placeholder="Новая задача">\n// <button id="addBtn">Добавить</button>\n// <ul id="list"></ul>\n\nconst input = document.getElementById("input");\nconst addBtn = document.getElementById("addBtn");\nconst list = document.getElementById("list");\n\nfunction addTask(text) {\n  if (!text.trim()) return;\n  \n  const li = document.createElement("li");\n  li.textContent = text;\n  li.style.cursor = "pointer";\n  \n  const deleteBtn = document.createElement("button");\n  deleteBtn.textContent = "✕";\n  deleteBtn.style.marginLeft = "8px";\n  deleteBtn.addEventListener("click", (e) => {\n    e.stopPropagation();\n    li.remove();\n  });\n  \n  li.appendChild(deleteBtn);\n  \n  li.addEventListener("click", () => {\n    li.classList.toggle("done");\n  });\n  \n  list.appendChild(li);\n  input.value = "";\n  input.focus();\n}\n\naddBtn.addEventListener("click", () => addTask(input.value));\ninput.addEventListener("keydown", (e) => {\n  if (e.key === "Enter") addTask(input.value);\n});',
      explanation: 'createElement + appendChild — основа динамических DOM-операций. e.stopPropagation() предотвращает всплытие события клика на кнопку к li. classList.toggle("done") переключает выполнение задачи.'
    },
    {
      id: 8,
      title: 'Практика: Фильтрация списка',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай список карточек с фильтрацией по тексту поиска в реальном времени.',
      requirements: [
        'Массив из 6+ объектов (название, категория)',
        'Отрисовать все карточки в DOM через createElement',
        'Поле поиска: при вводе фильтровать карточки по названию',
        'Скрывать/показывать карточки с classList (не пересоздавать!)',
        'Подсветить найденный текст через innerHTML'
      ],
      expectedOutput: 'Список карточек с живым поиском',
      hint: 'При фильтрации используй classList.toggle("hidden", !matches). Не пересоздавай карточки каждый раз — только скрывай ненужные.',
      solution: 'const items = [\n  { name: "JavaScript", category: "Язык" },\n  { name: "Python", category: "Язык" },\n  { name: "React", category: "Библиотека" },\n  { name: "Vue.js", category: "Фреймворк" },\n  { name: "Node.js", category: "Рантайм" },\n  { name: "TypeScript", category: "Язык" }\n];\n\nconst container = document.getElementById("container");\nconst searchInput = document.getElementById("search");\n\n// Создаём карточки один раз\nconst cards = items.map(item => {\n  const card = document.createElement("div");\n  card.className = "card";\n  card.dataset.name = item.name.toLowerCase();\n  card.innerHTML = `<strong>${item.name}</strong><br><small>${item.category}</small>`;\n  container.appendChild(card);\n  return card;\n});\n\n// Фильтрация при поиске\nsearchInput.addEventListener("input", () => {\n  const query = searchInput.value.toLowerCase();\n  cards.forEach((card, i) => {\n    const matches = items[i].name.toLowerCase().includes(query);\n    card.classList.toggle("hidden", !matches);\n  });\n});',
      explanation: 'Карточки создаём один раз, потом только скрываем/показываем — это эффективнее, чем пересоздавать DOM при каждом нажатии клавиши. classList.toggle(class, condition) — удобный метод с условием.'
    }
  ]
}
