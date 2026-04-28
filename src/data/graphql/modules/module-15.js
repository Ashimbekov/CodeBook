export default {
  id: 15,
  title: 'Apollo Client: State Management',
  description: 'Управление локальным состоянием через Apollo Client: reactive variables, local-only fields и замена Redux.',
  lessons: [
    {
      id: 1,
      title: 'Reactive Variables',
      type: 'theory',
      content: [
        { type: 'text', value: 'Reactive Variables — способ хранения локального состояния вне кэша Apollo. При изменении переменной все компоненты, использующие её, перерисовываются.' },
        { type: 'heading', value: 'Создание и использование' },
        { type: 'code', language: 'javascript', value: 'import { makeVar, useReactiveVar } from \'@apollo/client\';\n\n// Создание reactive variable\nexport const isLoggedInVar = makeVar(!!localStorage.getItem(\'token\'));\nexport const cartItemsVar = makeVar([]);\nexport const themeVar = makeVar(\'light\');\n\n// Чтение в компоненте\nfunction Header() {\n  const isLoggedIn = useReactiveVar(isLoggedInVar);\n  const cartItems = useReactiveVar(cartItemsVar);\n  const theme = useReactiveVar(themeVar);\n\n  return (\n    <header className={theme}>\n      <nav>\n        {isLoggedIn ? <LogoutButton /> : <LoginButton />}\n        <span>Корзина: {cartItems.length}</span>\n      </nav>\n    </header>\n  );\n}\n\n// Изменение — просто вызов функции\nfunction LoginButton() {\n  const handleLogin = async () => {\n    const token = await login(email, password);\n    localStorage.setItem(\'token\', token);\n    isLoggedInVar(true); // Обновляем переменную\n  };\n  return <button onClick={handleLogin}>Войти</button>;\n}\n\nfunction ThemeToggle() {\n  const theme = useReactiveVar(themeVar);\n  return (\n    <button onClick={() => themeVar(theme === \'light\' ? \'dark\' : \'light\')}>\n      {theme === \'light\' ? \'Тёмная тема\' : \'Светлая тема\'}\n    </button>\n  );\n}' },
        { type: 'tip', value: 'Reactive Variables — отличная замена React Context для глобального состояния: theme, auth, cart. Не нужны провайдеры и reducers.' }
      ]
    },
    {
      id: 2,
      title: 'Local-Only Fields',
      type: 'theory',
      content: [
        { type: 'text', value: 'Local-only fields — поля с директивой @client. Они существуют только в кэше Apollo и не отправляются на сервер. Можно смешивать серверные и локальные данные в одном запросе.' },
        { type: 'heading', value: 'Определение local-only полей' },
        { type: 'code', language: 'javascript', value: '// Запрос смешивает серверные и локальные данные\nconst GET_CART = gql`\n  query GetCart {\n    # С сервера\n    products {\n      id\n      name\n      price\n    }\n    # Только из кэша (не отправляется на сервер)\n    cartItems @client {\n      productId\n      quantity\n    }\n    isLoggedIn @client\n  }\n`;\n\n// Настройка через type policies\nconst cache = new InMemoryCache({\n  typePolicies: {\n    Query: {\n      fields: {\n        cartItems: {\n          read() {\n            return cartItemsVar(); // Чтение из reactive variable\n          }\n        },\n        isLoggedIn: {\n          read() {\n            return isLoggedInVar();\n          }\n        }\n      }\n    }\n  }\n});' },
        { type: 'heading', value: 'Local-only поля на типах' },
        { type: 'code', language: 'javascript', value: '// Добавляем локальное поле к серверному типу\nconst GET_PRODUCTS = gql`\n  query GetProducts {\n    products {\n      id\n      name\n      price\n      isInCart @client    # Локальное поле на типе Product\n    }\n  }\n`;\n\nconst cache = new InMemoryCache({\n  typePolicies: {\n    Product: {\n      fields: {\n        isInCart: {\n          read(_, { readField }) {\n            const productId = readField(\'id\');\n            const cart = cartItemsVar();\n            return cart.some(item => item.productId === productId);\n          }\n        }\n      }\n    }\n  }\n});\n\n// Теперь каждый продукт имеет поле isInCart\n// которое вычисляется из локального состояния корзины' },
        { type: 'note', value: 'Local-only поля с @client удаляются из запроса перед отправкой на сервер. Сервер не знает о них. Это позволяет обогащать серверные данные локальным состоянием.' }
      ]
    },
    {
      id: 3,
      title: 'Корзина на Reactive Variables',
      type: 'theory',
      content: [
        { type: 'text', value: 'Рассмотрим полный пример реализации корзины покупок с использованием reactive variables и local-only fields.' },
        { type: 'heading', value: 'Модуль корзины' },
        { type: 'code', language: 'javascript', value: '// store/cart.js\nimport { makeVar } from \'@apollo/client\';\n\n// Reactive variable для корзины\nexport const cartItemsVar = makeVar(\n  JSON.parse(localStorage.getItem(\'cart\') || \'[]\')\n);\n\n// Действия\nexport function addToCart(productId, quantity = 1) {\n  const current = cartItemsVar();\n  const existing = current.find(item => item.productId === productId);\n\n  let updated;\n  if (existing) {\n    updated = current.map(item =>\n      item.productId === productId\n        ? { ...item, quantity: item.quantity + quantity }\n        : item\n    );\n  } else {\n    updated = [...current, { productId, quantity }];\n  }\n\n  cartItemsVar(updated);\n  localStorage.setItem(\'cart\', JSON.stringify(updated));\n}\n\nexport function removeFromCart(productId) {\n  const updated = cartItemsVar().filter(item => item.productId !== productId);\n  cartItemsVar(updated);\n  localStorage.setItem(\'cart\', JSON.stringify(updated));\n}\n\nexport function clearCart() {\n  cartItemsVar([]);\n  localStorage.removeItem(\'cart\');\n}\n\nexport function getCartTotal(products) {\n  const cart = cartItemsVar();\n  return cart.reduce((total, item) => {\n    const product = products.find(p => p.id === item.productId);\n    return total + (product?.price || 0) * item.quantity;\n  }, 0);\n}' },
        { type: 'heading', value: 'Компоненты' },
        { type: 'code', language: 'javascript', value: 'function ProductCard({ product }) {\n  const cartItems = useReactiveVar(cartItemsVar);\n  const inCart = cartItems.some(i => i.productId === product.id);\n\n  return (\n    <div>\n      <h3>{product.name}</h3>\n      <p>{product.price} руб.</p>\n      {inCart ? (\n        <button onClick={() => removeFromCart(product.id)}>Убрать</button>\n      ) : (\n        <button onClick={() => addToCart(product.id)}>В корзину</button>\n      )}\n    </div>\n  );\n}\n\nfunction CartSummary() {\n  const cartItems = useReactiveVar(cartItemsVar);\n  const { data } = useQuery(GET_PRODUCTS);\n\n  const total = data ? getCartTotal(data.products) : 0;\n\n  return (\n    <div>\n      <p>Товаров: {cartItems.length}</p>\n      <p>Итого: {total} руб.</p>\n      <button onClick={clearCart}>Очистить</button>\n    </div>\n  );\n}' },
        { type: 'tip', value: 'Reactive Variables + localStorage — полноценная замена Redux для клиентского состояния. Корзина, тема, язык — всё можно хранить без дополнительных библиотек.' }
      ]
    },
    {
      id: 4,
      title: 'Оптимистичные обновления',
      type: 'theory',
      content: [
        { type: 'text', value: 'Оптимистичные обновления показывают результат мутации мгновенно, не дожидаясь ответа сервера. Если сервер вернёт ошибку — кэш откатится.' },
        { type: 'heading', value: 'optimisticResponse' },
        { type: 'code', language: 'javascript', value: 'const [likePost] = useMutation(LIKE_POST);\n\nconst handleLike = (post) => {\n  likePost({\n    variables: { postId: post.id },\n    // Оптимистичный ответ — показываем сразу\n    optimisticResponse: {\n      __typename: \'Mutation\',\n      likePost: {\n        __typename: \'Post\',\n        id: post.id,\n        likesCount: post.likesCount + 1,\n        isLikedByMe: true\n      }\n    },\n    update: (cache, { data: { likePost: updatedPost } }) => {\n      cache.writeFragment({\n        id: `Post:${updatedPost.id}`,\n        fragment: gql`\n          fragment LikedPost on Post {\n            likesCount\n            isLikedByMe\n          }\n        `,\n        data: {\n          likesCount: updatedPost.likesCount,\n          isLikedByMe: updatedPost.isLikedByMe\n        }\n      });\n    }\n  });\n};\n\n// Поведение:\n// 1. Нажатие кнопки — мгновенно показываем +1 лайк\n// 2. Запрос уходит на сервер\n// 3a. Сервер подтвердил — данные остаются\n// 3b. Сервер вернул ошибку — откат к предыдущему значению' },
        { type: 'heading', value: 'Оптимистичное добавление в список' },
        { type: 'code', language: 'javascript', value: 'const [createComment] = useMutation(CREATE_COMMENT);\n\nconst handleAddComment = (text) => {\n  createComment({\n    variables: { postId, text },\n    optimisticResponse: {\n      __typename: \'Mutation\',\n      createComment: {\n        __typename: \'Comment\',\n        id: \'temp-\' + Date.now(), // Временный ID\n        text,\n        author: {\n          __typename: \'User\',\n          id: currentUser.id,\n          name: currentUser.name\n        },\n        createdAt: new Date().toISOString()\n      }\n    },\n    update: (cache, { data: { createComment: newComment } }) => {\n      cache.modify({\n        id: `Post:${postId}`,\n        fields: {\n          comments(existingRefs = []) {\n            const newRef = cache.writeFragment({\n              data: newComment,\n              fragment: gql`\n                fragment NewComment on Comment {\n                  id text createdAt author { id name }\n                }\n              `\n            });\n            return [...existingRefs, newRef];\n          }\n        }\n      });\n    }\n  });\n};' },
        { type: 'note', value: 'Оптимистичные обновления делают UI мгновенным. Пользователь не видит спиннеры. Если сервер ошибётся — данные откатятся, и Apollo покажет предупреждение.' }
      ]
    },
    {
      id: 5,
      title: 'Apollo vs Redux/Zustand',
      type: 'theory',
      content: [
        { type: 'text', value: 'Apollo Client может заменить Redux/Zustand для управления состоянием. Серверное состояние хранится в кэше, клиентское — в reactive variables.' },
        { type: 'heading', value: 'Сравнение подходов' },
        { type: 'code', language: 'javascript', value: '// Redux: отдельный store, actions, reducers, middleware\n// store.js\nconst userSlice = createSlice({\n  name: \'user\',\n  initialState: { data: null, loading: false },\n  reducers: { ... },\n  extraReducers: (builder) => { ... } // async thunks\n});\n\n// Apollo Client: всё в одном\n// Серверные данные — кэш (автоматически)\nconst { data } = useQuery(GET_USER);\n\n// Клиентские данные — reactive variables\nconst theme = useReactiveVar(themeVar);' },
        { type: 'list', value: [
          'Apollo заменяет Redux для серверного состояния (данные API)',
          'Reactive Variables заменяют Redux для простого клиентского состояния',
          'Redux/Zustand нужен для сложной клиентской логики (форм-менеджер, сложные анимации)',
          'Можно комбинировать: Apollo для API + Zustand для клиентского состояния'
        ] },
        { type: 'heading', value: 'Когда достаточно Apollo' },
        { type: 'code', language: 'javascript', value: '// Если ваше состояние — это:\n// 1. Данные с сервера (пользователь, посты, заказы)\n// 2. UI состояние (тема, язык, модальные окна)\n// 3. Корзина покупок\n\n// Apollo Client покрывает всё:\nconst cache = new InMemoryCache({\n  typePolicies: {\n    Query: {\n      fields: {\n        theme: { read: () => themeVar() },\n        isModalOpen: { read: () => modalVar() },\n        cartItems: { read: () => cartVar() }\n      }\n    }\n  }\n});\n\n// Единый запрос для всех данных\nconst { data } = useQuery(gql`\n  query Dashboard {\n    me { name, email }           # С сервера\n    posts { title }              # С сервера\n    theme @client                # Локально\n    cartItems @client { id }     # Локально\n  }\n`);' },
        { type: 'tip', value: 'Начинайте только с Apollo Client. Добавляйте Redux/Zustand, только если появится сложная клиентская логика, которую неудобно реализовать через reactive variables.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Глобальное состояние',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте управление состоянием приложения через Apollo Client: тема, аутентификация и корзина покупок.',
      requirements: [
        'Reactive variable themeVar с начальным значением из localStorage',
        'Reactive variable authTokenVar для токена аутентификации',
        'Reactive variable cartVar для корзины с функциями add/remove/clear',
        'Local-only поле @client isLoggedIn в Query через type policy',
        'Компонент ThemeToggle с useReactiveVar',
        'Оптимистичное обновление для лайка поста'
      ],
      hint: 'makeVar создаёт reactive variable. useReactiveVar подписывает компонент на изменения. Type policy с read() подключает переменную к кэшу.',
      expectedOutput: 'Три reactive variables (тема, токен, корзина), type policies для local-only полей, компонент ThemeToggle и оптимистичный лайк.',
      solution: `import { makeVar, useReactiveVar, InMemoryCache, gql, useMutation } from '@apollo/client';

// Reactive Variables
export const themeVar = makeVar(localStorage.getItem('theme') || 'light');
export const authTokenVar = makeVar(localStorage.getItem('token') || null);
export const cartVar = makeVar(JSON.parse(localStorage.getItem('cart') || '[]'));

// Действия
export function toggleTheme() {
  const next = themeVar() === 'light' ? 'dark' : 'light';
  themeVar(next);
  localStorage.setItem('theme', next);
}

export function setAuthToken(token) {
  authTokenVar(token);
  if (token) localStorage.setItem('token', token);
  else localStorage.removeItem('token');
}

export function addToCart(productId) {
  const cart = cartVar();
  const existing = cart.find(i => i.productId === productId);
  const updated = existing
    ? cart.map(i => i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i)
    : [...cart, { productId, quantity: 1 }];
  cartVar(updated);
  localStorage.setItem('cart', JSON.stringify(updated));
}

export function removeFromCart(productId) {
  const updated = cartVar().filter(i => i.productId !== productId);
  cartVar(updated);
  localStorage.setItem('cart', JSON.stringify(updated));
}

export function clearCart() {
  cartVar([]);
  localStorage.removeItem('cart');
}

// Cache
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        isLoggedIn: { read: () => !!authTokenVar() },
        theme: { read: () => themeVar() },
        cartItems: { read: () => cartVar() }
      }
    }
  }
});

// ThemeToggle
function ThemeToggle() {
  const theme = useReactiveVar(themeVar);
  return (
    <button onClick={toggleTheme}>
      {theme === 'light' ? 'Тёмная тема' : 'Светлая тема'}
    </button>
  );
}

// Оптимистичный лайк
const LIKE_POST = gql\`mutation LikePost($id: ID!) { likePost(id: $id) { id likesCount isLikedByMe } }\`;

function LikeButton({ post }) {
  const [likePost] = useMutation(LIKE_POST);
  return (
    <button onClick={() => likePost({
      variables: { id: post.id },
      optimisticResponse: {
        __typename: 'Mutation',
        likePost: {
          __typename: 'Post',
          id: post.id,
          likesCount: post.likesCount + 1,
          isLikedByMe: true
        }
      }
    })}>
      {post.isLikedByMe ? 'Убрать лайк' : 'Лайк'} ({post.likesCount})
    </button>
  );
}`,
      explanation: 'makeVar создаёт reactive variables, которые хранят состояние вне кэша. useReactiveVar подписывает компонент на изменения. Type policies подключают переменные к GraphQL запросам через @client. localStorage обеспечивает персистентность между сессиями. Оптимистичный лайк мгновенно обновляет UI через optimisticResponse — если сервер вернёт ошибку, кэш откатится.'
    }
  ]
}
