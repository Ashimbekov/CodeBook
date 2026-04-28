export default {
  id: 13,
  title: 'Псевдоклассы и псевдоэлементы',
  description: ':hover, :focus, :nth-child, ::before, ::after — динамическая стилизация и декоративные элементы.',
  lessons: [
    {
      id: 1,
      title: 'Интерактивные псевдоклассы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Псевдоклассы добавляют стили на основе состояния элемента: наведение, фокус, нажатие. Они критичны для интерактивности без JavaScript.' },
        { type: 'heading', value: 'Состояния интерактивности' },
        { type: 'code', language: 'css', value: '/* :hover — наведение курсора */\n.button:hover {\n  background: #2563eb;\n  transform: translateY(-1px);\n}\n\n/* :active — нажатие (момент клика) */\n.button:active {\n  transform: scale(0.98);\n}\n\n/* :focus — получение фокуса (Tab, клик) */\ninput:focus {\n  border-color: #3b82f6;\n  outline: none;\n  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);\n}\n\n/* :focus-visible — фокус только от клавиатуры */\nbutton:focus-visible {\n  outline: 2px solid #3b82f6;\n  outline-offset: 2px;\n}\n\n/* :focus-within — если ЛЮБОЙ потомок в фокусе */\n.search-box:focus-within {\n  border-color: #3b82f6;\n  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);\n}\n\n/* :visited — посещённая ссылка */\na:visited { color: #7c3aed; }' },
        { type: 'heading', value: 'Правильный порядок (LVHFA)' },
        { type: 'code', language: 'css', value: '/* Порядок важен для ссылок! */\na:link    { color: #3b82f6; }   /* L — обычная */\na:visited { color: #7c3aed; }   /* V — посещённая */\na:hover   { color: #2563eb; }   /* H — наведение */\na:focus   { color: #2563eb; }   /* F — фокус */\na:active  { color: #1d4ed8; }   /* A — нажатие */' },
        { type: 'tip', value: 'Используйте :focus-visible вместо :focus для кнопок и ссылок. Это показывает outline только при навигации клавиатурой, не при клике мышью.' }
      ]
    },
    {
      id: 2,
      title: 'Структурные псевдоклассы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Структурные псевдоклассы выбирают элементы по их позиции в DOM: первый, последний, чётный, нечётный, каждый N-й.' },
        { type: 'heading', value: ':first-child, :last-child, :nth-child' },
        { type: 'code', language: 'css', value: '/* Первый и последний */\nli:first-child { font-weight: bold; }\nli:last-child  { border-bottom: none; }\n\n/* Единственный ребёнок */\np:only-child { margin: 0; }\n\n/* По номеру */\nli:nth-child(3)  { color: red; }     /* третий элемент */\n\n/* Чётные и нечётные */\ntr:nth-child(even) { background: #f8fafc; }  /* полосатая таблица */\ntr:nth-child(odd)  { background: white; }\n\n/* Формулы an+b */\nli:nth-child(3n)     { }  /* каждый 3-й: 3, 6, 9, 12... */\nli:nth-child(3n+1)   { }  /* 1, 4, 7, 10... */\nli:nth-child(-n+3)   { }  /* первые 3: 1, 2, 3 */\nli:nth-child(n+4)    { }  /* начиная с 4-го */\nli:nth-last-child(2) { }  /* второй с конца */' },
        { type: 'heading', value: ':nth-of-type' },
        { type: 'code', language: 'css', value: '/* nth-child vs nth-of-type */\n/* nth-child считает ВСЕ дочерние элементы */\n/* nth-of-type считает только элементы указанного типа */\n\n/* <div>\n     <h2>Заголовок</h2>\n     <p>Первый параграф</p>\n     <p>Второй параграф</p>\n   </div> */\n\np:nth-child(2)   { }  /* <p>Первый параграф</p> — 2-й ребёнок div */\np:nth-of-type(2) { }  /* <p>Второй параграф</p> — 2-й параграф */\n\n/* :first-of-type — первый элемент данного типа */\nh2:first-of-type { margin-top: 0; }' },
        { type: 'tip', value: 'Для полосатых таблиц используйте :nth-child(even). Для «первые N элементов» — :nth-child(-n+N). Для «каждый K-й» — :nth-child(Kn).' }
      ]
    },
    {
      id: 3,
      title: 'Псевдоклассы состояния и валидации',
      type: 'theory',
      content: [
        { type: 'text', value: 'CSS может стилизовать формы на основе их валидности, заполненности и состояния — без JavaScript.' },
        { type: 'heading', value: 'Валидация форм через CSS' },
        { type: 'code', language: 'css', value: '/* :valid / :invalid — на основе HTML-валидации */\ninput:valid   { border-color: #22c55e; }\ninput:invalid { border-color: #ef4444; }\n\n/* :required / :optional */\ninput:required { border-left: 3px solid #3b82f6; }\n\n/* :placeholder-shown — есть ли placeholder (поле пустое) */\ninput:placeholder-shown { border-color: #d1d5db; }\n\n/* Показать ошибку только после ввода */\ninput:not(:placeholder-shown):invalid {\n  border-color: #ef4444;\n  background: #fef2f2;\n}\n\n/* :checked — для checkbox/radio */\ninput[type="checkbox"]:checked + label {\n  color: #3b82f6;\n  text-decoration: line-through;\n}\n\n/* :disabled / :enabled */\nbutton:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n\n/* :read-only */\ninput:read-only {\n  background: #f3f4f6;\n  cursor: default;\n}' },
        { type: 'heading', value: 'Floating labels (только CSS!)' },
        { type: 'code', language: 'css', value: '.field {\n  position: relative;\n}\n\n.field input {\n  padding: 1.5rem 1rem 0.5rem;\n  border: 1px solid #d1d5db;\n  border-radius: 8px;\n  width: 100%;\n}\n\n.field label {\n  position: absolute;\n  left: 1rem;\n  top: 50%;\n  transform: translateY(-50%);\n  transition: all 0.2s ease;\n  color: #9ca3af;\n  pointer-events: none;\n}\n\n/* Когда поле заполнено или в фокусе — label поднимается */\n.field input:focus + label,\n.field input:not(:placeholder-shown) + label {\n  top: 0.5rem;\n  transform: none;\n  font-size: 0.75rem;\n  color: #3b82f6;\n}' },
        { type: 'note', value: ':placeholder-shown проверяет видимость placeholder. Если input заполнен — placeholder скрыт и :placeholder-shown не срабатывает. Это позволяет определить, пуст ли input.' }
      ]
    },
    {
      id: 4,
      title: 'Псевдоэлементы ::before и ::after',
      type: 'theory',
      content: [
        { type: 'text', value: 'Псевдоэлементы создают виртуальные элементы внутри существующих. ::before и ::after — самые важные: они позволяют добавлять декорации без лишнего HTML.' },
        { type: 'heading', value: '::before и ::after' },
        { type: 'code', language: 'css', value: '/* ::before — виртуальный первый ребёнок */\n/* ::after — виртуальный последний ребёнок */\n\n/* ОБЯЗАТЕЛЬНО указать content! */\n.element::before {\n  content: "";  /* пустая строка для декоративных элементов */\n}\n\n/* Текстовый контент */\n.required::after {\n  content: " *";\n  color: #ef4444;\n}\n\n.external-link::after {\n  content: " ↗";\n  font-size: 0.8em;\n}\n\n/* Кавычки */\nblockquote::before { content: "\\201C"; }  /* « */\nblockquote::after  { content: "\\201D"; }  /* » */' },
        { type: 'heading', value: 'Декоративные элементы' },
        { type: 'code', language: 'css', value: '/* Декоративная линия под заголовком */\n.heading::after {\n  content: "";\n  display: block;\n  width: 60px;\n  height: 3px;\n  background: #3b82f6;\n  margin-top: 0.5rem;\n  border-radius: 2px;\n}\n\n/* Цветная полоса сверху карточки */\n.card {\n  position: relative;\n  overflow: hidden;\n}\n\n.card::before {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  height: 4px;\n  background: linear-gradient(to right, #3b82f6, #8b5cf6);\n}\n\n/* Кастомный чекбокс */\n.checkbox::before {\n  content: "";\n  width: 20px;\n  height: 20px;\n  border: 2px solid #d1d5db;\n  border-radius: 4px;\n  display: inline-block;\n  vertical-align: middle;\n  margin-right: 0.5rem;\n}' },
        { type: 'tip', value: 'Псевдоэлементы НЕ работают на <img>, <input>, <br>, <hr> — на элементах без содержимого (void elements). Они вставляются ВНУТРЬ элемента, а void-элементы не имеют содержимого.' }
      ]
    },
    {
      id: 5,
      title: 'Другие псевдоэлементы и :not()',
      type: 'theory',
      content: [
        { type: 'text', value: 'Помимо ::before и ::after, CSS предлагает ::placeholder, ::selection, ::marker и другие. Псевдокласс :not() — мощный инструмент исключения.' },
        { type: 'heading', value: 'Полезные псевдоэлементы' },
        { type: 'code', language: 'css', value: '/* ::placeholder — стиль placeholder текста */\ninput::placeholder {\n  color: #9ca3af;\n  font-style: italic;\n}\n\n/* ::selection — стиль выделенного текста */\n::selection {\n  background: #3b82f6;\n  color: white;\n}\n\n/* ::marker — маркеры списков */\nli::marker {\n  color: #3b82f6;\n  font-size: 1.2em;\n}\n\n/* ::first-line и ::first-letter */\np::first-line {\n  font-weight: bold;\n}\n\np.drop-cap::first-letter {\n  float: left;\n  font-size: 3em;\n  line-height: 1;\n  margin-right: 0.1em;\n  color: #3b82f6;\n}' },
        { type: 'heading', value: ':not() — исключение' },
        { type: 'code', language: 'css', value: '/* Все параграфы, кроме последнего */\np:not(:last-child) {\n  margin-bottom: 1rem;\n}\n\n/* Ссылки, кроме тех, что в nav */\na:not(nav a) {\n  text-decoration: underline;\n}\n\n/* Инпуты, кроме чекбоксов и радио */\ninput:not([type="checkbox"]):not([type="radio"]) {\n  width: 100%;\n  padding: 0.5rem;\n}\n\n/* Элементы без класса */\ndiv:not([class]) {\n  border: 1px dashed red;  /* для отладки */\n}\n\n/* Список без последнего разделителя */\n.list-item:not(:last-child) {\n  border-bottom: 1px solid #e5e7eb;\n}' },
        { type: 'note', value: ':not() в современном CSS принимает список селекторов: :not(.a, .b, .c). В старых браузерах работает только с одним простым селектором.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Стилизация формы',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте стилизованную форму с floating labels, кастомными чекбоксами и валидацией через CSS.',
      requirements: [
        'Floating labels: label поднимается при фокусе и заполнении',
        'Стилизация :focus с border-color и box-shadow',
        'Индикация обязательных полей через ::after (* красная)',
        'Подсветка валидных/невалидных полей (:valid, :invalid)',
        'Кастомный чекбокс через ::before',
        'Стилизация ::placeholder'
      ],
      hint: 'Используйте :placeholder-shown для определения пустого поля. Label должен быть после input для использования +.',
      expectedOutput: 'Красивая форма с парящими подписями, цветовой индикацией валидации и стилизованными чекбоксами.',
      solution: '.form-field {\n  position: relative;\n  margin-bottom: 1.5rem;\n}\n\n.form-field input {\n  width: 100%;\n  padding: 1.25rem 1rem 0.5rem;\n  border: 2px solid #d1d5db;\n  border-radius: 8px;\n  font-size: 1rem;\n  transition: border-color 0.2s;\n}\n\n.form-field input::placeholder {\n  color: transparent;\n}\n\n.form-field label {\n  position: absolute;\n  left: 1rem;\n  top: 50%;\n  transform: translateY(-50%);\n  color: #6b7280;\n  transition: all 0.2s ease;\n  pointer-events: none;\n}\n\n.form-field input:focus + label,\n.form-field input:not(:placeholder-shown) + label {\n  top: 0.6rem;\n  transform: none;\n  font-size: 0.75rem;\n  color: #3b82f6;\n}\n\n.form-field input:focus {\n  border-color: #3b82f6;\n  outline: none;\n  box-shadow: 0 0 0 3px rgba(59,130,246,0.15);\n}\n\n.form-field.required label::after {\n  content: " *";\n  color: #ef4444;\n}\n\n.form-field input:not(:placeholder-shown):valid {\n  border-color: #22c55e;\n}\n\n.form-field input:not(:placeholder-shown):invalid {\n  border-color: #ef4444;\n}\n\n.custom-checkbox {\n  display: none;\n}\n\n.custom-checkbox + label::before {\n  content: "";\n  display: inline-block;\n  width: 20px;\n  height: 20px;\n  border: 2px solid #d1d5db;\n  border-radius: 4px;\n  margin-right: 0.5rem;\n  vertical-align: middle;\n  transition: all 0.2s;\n}\n\n.custom-checkbox:checked + label::before {\n  background: #3b82f6;\n  border-color: #3b82f6;\n}',
      explanation: 'Floating labels используют :placeholder-shown и + (adjacent sibling). Валидация работает через HTML-атрибуты (required, type="email") и CSS :valid/:invalid. Кастомный чекбокс скрывает нативный input и стилизует label::before.'
    }
  ]
}
