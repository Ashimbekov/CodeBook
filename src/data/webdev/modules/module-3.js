export default {
  id: 3,
  title: 'HTML: формы',
  description: 'Создание форм с полями ввода: input, select, textarea — основа взаимодействия с пользователем',
  lessons: [
    {
      id: 1,
      title: 'Тег form и атрибуты отправки',
      type: 'theory',
      content: [
        { type: 'text', value: 'Форма — это способ собрать данные от пользователя и отправить их на сервер. Тег <form> является контейнером для всех элементов формы.' },
        { type: 'code', language: 'html', value: '<form action="/submit" method="POST">\n  <!-- Элементы формы -->\n  <input type="text" name="username">\n  <button type="submit">Отправить</button>\n</form>' },
        { type: 'heading', value: 'Атрибуты тега form' },
        { type: 'list', items: [
          'action — URL, куда отправляются данные (адрес обработчика на сервере)',
          'method="GET" — данные добавляются к URL (для поиска, фильтров)',
          'method="POST" — данные в теле запроса (для регистрации, логина)',
          'enctype="multipart/form-data" — нужно для загрузки файлов'
        ]},
        { type: 'note', value: 'Каждый input в форме должен иметь атрибут name — именно это имя используется как ключ при отправке данных на сервер.' }
      ]
    },
    {
      id: 2,
      title: 'Input: типы текстовых полей',
      type: 'theory',
      content: [
        { type: 'text', value: 'Тег <input> — самый универсальный элемент формы. Его внешний вид и поведение определяет атрибут type.' },
        { type: 'code', language: 'html', value: '<input type="text" placeholder="Ваше имя">\n<input type="email" placeholder="email@example.com">\n<input type="password" placeholder="Пароль">\n<input type="number" min="1" max="100" step="1">\n<input type="tel" placeholder="+7 (xxx) xxx-xx-xx">\n<input type="url" placeholder="https://">\n<input type="date">\n<input type="time">\n<input type="color">\n<input type="range" min="0" max="100" value="50">\n<input type="search" placeholder="Поиск...">' },
        { type: 'tip', value: 'Используй правильный type! Браузер сам добавит удобную клавиатуру на мобильном (tel — цифровую, email — с @), а также встроенную валидацию (email проверит формат).' },
        { type: 'heading', value: 'Важные атрибуты input' },
        { type: 'list', items: [
          'required — поле обязательно для заполнения',
          'disabled — поле заблокировано',
          'readonly — только для чтения',
          'maxlength="50" — максимум 50 символов',
          'pattern="[A-Z]{3}" — регулярное выражение для валидации',
          'autofocus — фокус на поле при загрузке страницы'
        ]}
      ]
    },
    {
      id: 3,
      title: 'Checkbox, Radio и скрытые поля',
      type: 'theory',
      content: [
        { type: 'text', value: 'Некоторые типы input используются для выбора из вариантов.' },
        { type: 'code', language: 'html', value: '<!-- Checkbox - можно выбрать несколько -->\n<label>\n  <input type="checkbox" name="hobby" value="coding"> Программирование\n</label>\n<label>\n  <input type="checkbox" name="hobby" value="games" checked> Игры\n</label>\n\n<!-- Radio - только один вариант из группы -->\n<label>\n  <input type="radio" name="gender" value="male"> Мужской\n</label>\n<label>\n  <input type="radio" name="gender" value="female"> Женский\n</label>\n\n<!-- Hidden - скрытое поле (не видно пользователю) -->\n<input type="hidden" name="csrf_token" value="abc123">' },
        { type: 'note', value: 'Radio-кнопки объединяются в группу по атрибуту name — все с одинаковым name являются взаимоисключающими. Checkbox с одинаковым name позволяют выбрать несколько.' },
        { type: 'tip', value: 'Всегда оборачивай input в <label> или используй атрибут for/id. Это увеличивает зону клика и делает форму доступной для скринридеров.' }
      ]
    },
    {
      id: 4,
      title: 'Select и Textarea',
      type: 'theory',
      content: [
        { type: 'text', value: '<select> создаёт выпадающий список, <textarea> — многострочное поле для текста.' },
        { type: 'code', language: 'html', value: '<!-- Выпадающий список -->\n<select name="city">\n  <option value="">-- Выберите город --</option>\n  <option value="almaty">Алматы</option>\n  <option value="astana" selected>Астана</option>\n  <option value="shymkent">Шымкент</option>\n</select>\n\n<!-- Группировка опций -->\n<select name="country">\n  <optgroup label="СНГ">\n    <option value="kz">Казахстан</option>\n    <option value="ru">Россия</option>\n  </optgroup>\n  <optgroup label="Европа">\n    <option value="de">Германия</option>\n  </optgroup>\n</select>\n\n<!-- Многострочный текст -->\n<textarea name="comment" rows="5" cols="40"\n  placeholder="Напишите ваш комментарий..."></textarea>' },
        { type: 'tip', value: 'В select первый option с пустым value служит "подсказкой". Это хорошая практика — пользователь явно видит, что нужно сделать выбор.' }
      ]
    },
    {
      id: 5,
      title: 'Label и fieldset — доступность форм',
      type: 'theory',
      content: [
        { type: 'text', value: '<label> связывает текстовое описание с элементом формы. <fieldset> группирует связанные поля, <legend> даёт им название.' },
        { type: 'code', language: 'html', value: '<form>\n  <fieldset>\n    <legend>Личная информация</legend>\n    \n    <!-- Способ 1: обёртка -->\n    <label>\n      Имя:\n      <input type="text" name="name" required>\n    </label>\n    \n    <!-- Способ 2: связь через for/id -->\n    <label for="email">Email:</label>\n    <input type="email" id="email" name="email" required>\n  </fieldset>\n  \n  <fieldset>\n    <legend>Предпочтения</legend>\n    <label>\n      <input type="checkbox" name="newsletter" value="yes">\n      Подписаться на новости\n    </label>\n  </fieldset>\n  \n  <button type="submit">Отправить</button>\n  <button type="reset">Сбросить</button>\n</form>' },
        { type: 'warning', value: 'Никогда не убирай <label> "для экономии кода". Без label форма недоступна для слабовидящих пользователей, которые используют скринридеры.' }
      ]
    },
    {
      id: 6,
      title: 'Кнопки и валидация',
      type: 'theory',
      content: [
        { type: 'text', value: 'Кнопки в формах могут быть разного типа, а HTML5 предоставляет встроенную валидацию без JavaScript.' },
        { type: 'code', language: 'html', value: '<!-- Типы кнопок -->\n<button type="submit">Отправить форму</button>\n<button type="reset">Сбросить</button>\n<button type="button" onclick="doSomething()">Просто кнопка</button>\n\n<!-- input type="submit" - устаревший способ -->\n<input type="submit" value="Отправить">\n\n<!-- Встроенная HTML5 валидация -->\n<input type="email" required>\n<input type="url" required>\n<input type="number" min="18" max="100">\n<input type="text" pattern="[A-Za-z]{3,}" title="Минимум 3 буквы">\n\n<!-- novalidate отключает встроенную валидацию -->\n<form novalidate>\n  <input type="email">\n</form>' },
        { type: 'note', value: 'Встроенная HTML5-валидация — это хорошо, но недостаточно. Всегда проверяй данные и на сервере, так как HTML-валидацию легко обойти.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Форма регистрации',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай форму регистрации пользователя со всеми необходимыми полями и валидацией.',
      requirements: [
        'Поля: имя (text), email, пароль, подтверждение пароля',
        'Выбор страны через select',
        'Дата рождения (input type="date")',
        'Checkbox для согласия с условиями (required)',
        'Кнопки "Зарегистрироваться" и "Сбросить"',
        'Все поля с правильными label',
        'Обязательные поля с атрибутом required'
      ],
      expectedOutput: 'Полная форма регистрации с валидацией',
      hint: 'Используй fieldset для группировки. Не забудь name у каждого input и связи label через for/id.',
      solution: '<!DOCTYPE html>\n<html lang="ru">\n<head>\n  <meta charset="UTF-8">\n  <title>Регистрация</title>\n</head>\n<body>\n  <h1>Регистрация</h1>\n  <form action="/register" method="POST">\n    <fieldset>\n      <legend>Личные данные</legend>\n      <label for="name">Имя:</label>\n      <input type="text" id="name" name="name" required minlength="2"><br>\n      <label for="email">Email:</label>\n      <input type="email" id="email" name="email" required><br>\n      <label for="birthdate">Дата рождения:</label>\n      <input type="date" id="birthdate" name="birthdate"><br>\n      <label for="country">Страна:</label>\n      <select id="country" name="country">\n        <option value="">-- Выберите страну --</option>\n        <option value="kz">Казахстан</option>\n        <option value="ru">Россия</option>\n        <option value="other">Другая</option>\n      </select>\n    </fieldset>\n    <fieldset>\n      <legend>Безопасность</legend>\n      <label for="password">Пароль:</label>\n      <input type="password" id="password" name="password" required minlength="8"><br>\n      <label for="password2">Повторите пароль:</label>\n      <input type="password" id="password2" name="password2" required>\n    </fieldset>\n    <label>\n      <input type="checkbox" name="agree" value="yes" required>\n      Я согласен с условиями использования\n    </label><br>\n    <button type="submit">Зарегистрироваться</button>\n    <button type="reset">Сбросить</button>\n  </form>\n</body>\n</html>',
      explanation: 'Форма регистрации использует разные типы input для разных данных. required обеспечивает базовую валидацию. fieldset и legend помогают организовать форму логически, а label — сделать её доступной.'
    }
  ]
}
