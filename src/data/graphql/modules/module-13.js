export default {
  id: 13,
  title: 'Apollo Client: основы',
  description: 'Настройка Apollo Client, хуки useQuery и useMutation, переменные, polling, refetch и обработка состояний.',
  lessons: [
    {
      id: 1,
      title: 'Установка и настройка',
      type: 'theory',
      content: [
        { type: 'text', value: 'Apollo Client — самая популярная клиентская библиотека для GraphQL. Она управляет запросами, кэшированием, состоянием загрузки и ошибками.' },
        { type: 'heading', value: 'Установка' },
        { type: 'code', language: 'bash', value: 'npm install @apollo/client graphql' },
        { type: 'heading', value: 'Настройка клиента' },
        { type: 'code', language: 'javascript', value: 'import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink } from \'@apollo/client\';\n\nconst client = new ApolloClient({\n  link: new HttpLink({\n    uri: \'http://localhost:4000/graphql\',\n    headers: {\n      authorization: `Bearer ${localStorage.getItem(\'token\')}`\n    }\n  }),\n  cache: new InMemoryCache(),\n  defaultOptions: {\n    watchQuery: {\n      fetchPolicy: \'cache-and-network\'\n    }\n  }\n});\n\n// Оборачиваем приложение\nfunction App() {\n  return (\n    <ApolloProvider client={client}>\n      <Router>\n        <Routes />\n      </Router>\n    </ApolloProvider>\n  );\n}' },
        { type: 'tip', value: 'ApolloProvider предоставляет Apollo Client всем компонентам через React Context. Оборачивайте его на самом верхнем уровне приложения.' }
      ]
    },
    {
      id: 2,
      title: 'useQuery — чтение данных',
      type: 'theory',
      content: [
        { type: 'text', value: 'useQuery — основной хук для чтения данных. Он выполняет запрос при монтировании компонента и возвращает data, loading, error.' },
        { type: 'heading', value: 'Базовое использование' },
        { type: 'code', language: 'javascript', value: 'import { gql, useQuery } from \'@apollo/client\';\n\nconst GET_POSTS = gql`\n  query GetPosts {\n    posts {\n      id\n      title\n      author {\n        name\n      }\n      createdAt\n    }\n  }\n`;\n\nfunction PostList() {\n  const { data, loading, error } = useQuery(GET_POSTS);\n\n  if (loading) return <Spinner />;\n  if (error) return <Error message={error.message} />;\n\n  return (\n    <div>\n      {data.posts.map(post => (\n        <article key={post.id}>\n          <h2>{post.title}</h2>\n          <p>Автор: {post.author.name}</p>\n        </article>\n      ))}\n    </div>\n  );\n}' },
        { type: 'heading', value: 'С переменными и опциями' },
        { type: 'code', language: 'javascript', value: 'const GET_USER = gql`\n  query GetUser($id: ID!) {\n    user(id: $id) {\n      id\n      name\n      email\n      posts {\n        id\n        title\n      }\n    }\n  }\n`;\n\nfunction UserProfile({ userId }) {\n  const { data, loading, error, refetch } = useQuery(GET_USER, {\n    variables: { id: userId },\n    // skip: не выполнять, если нет userId\n    skip: !userId,\n    // fetchPolicy: стратегия кэширования\n    fetchPolicy: \'cache-and-network\',\n    // pollInterval: автообновление каждые 30 сек\n    // pollInterval: 30000,\n    // onCompleted: колбэк при завершении\n    onCompleted: (data) => console.log(\'Загружено:\', data),\n    // onError: колбэк при ошибке\n    onError: (error) => console.error(\'Ошибка:\', error)\n  });\n\n  return (\n    <div>\n      {data && <h1>{data.user.name}</h1>}\n      <button onClick={() => refetch()}>Обновить</button>\n    </div>\n  );\n}' },
        { type: 'note', value: 'fetchPolicy определяет, откуда брать данные: cache-first (по умолчанию), cache-and-network, network-only, no-cache, cache-only.' }
      ]
    },
    {
      id: 3,
      title: 'useMutation — изменение данных',
      type: 'theory',
      content: [
        { type: 'text', value: 'useMutation возвращает функцию для вызова мутации и объект с результатом. В отличие от useQuery, мутация не выполняется автоматически.' },
        { type: 'heading', value: 'Базовое использование' },
        { type: 'code', language: 'javascript', value: 'import { gql, useMutation } from \'@apollo/client\';\n\nconst CREATE_POST = gql`\n  mutation CreatePost($input: CreatePostInput!) {\n    createPost(input: $input) {\n      id\n      title\n      body\n    }\n  }\n`;\n\nfunction CreatePostForm() {\n  const [createPost, { data, loading, error }] = useMutation(CREATE_POST);\n  const [title, setTitle] = useState(\'\');\n  const [body, setBody] = useState(\'\');\n\n  const handleSubmit = async (e) => {\n    e.preventDefault();\n    try {\n      const { data } = await createPost({\n        variables: {\n          input: { title, body }\n        }\n      });\n      console.log(\'Создан:\', data.createPost.id);\n      // Очистить форму\n      setTitle(\'\');\n      setBody(\'\');\n    } catch (err) {\n      console.error(\'Ошибка:\', err.message);\n    }\n  };\n\n  return (\n    <form onSubmit={handleSubmit}>\n      <input value={title} onChange={e => setTitle(e.target.value)} />\n      <textarea value={body} onChange={e => setBody(e.target.value)} />\n      <button disabled={loading}>\n        {loading ? \'Создание...\' : \'Создать пост\'}\n      </button>\n      {error && <p className="error">{error.message}</p>}\n    </form>\n  );\n}' },
        { type: 'heading', value: 'Обновление кэша после мутации' },
        { type: 'code', language: 'javascript', value: 'const [createPost] = useMutation(CREATE_POST, {\n  // Вариант 1: refetchQueries — перезапросить данные\n  refetchQueries: [{ query: GET_POSTS }],\n\n  // Вариант 2: update — обновить кэш вручную\n  update: (cache, { data: { createPost } }) => {\n    const existing = cache.readQuery({ query: GET_POSTS });\n    cache.writeQuery({\n      query: GET_POSTS,\n      data: {\n        posts: [createPost, ...existing.posts]\n      }\n    });\n  },\n\n  // Вариант 3: onCompleted\n  onCompleted: () => {\n    navigate(\'/posts\');\n  }\n});' },
        { type: 'tip', value: 'refetchQueries — простой способ обновить данные, но делает лишний запрос. update — эффективнее, обновляет кэш без запроса к серверу.' }
      ]
    },
    {
      id: 4,
      title: 'useLazyQuery',
      type: 'theory',
      content: [
        { type: 'text', value: 'useLazyQuery — как useQuery, но запрос выполняется не при монтировании, а при вызове функции. Идеально для поиска, фильтрации и запросов по действию пользователя.' },
        { type: 'heading', value: 'Пример: живой поиск' },
        { type: 'code', language: 'javascript', value: 'import { gql, useLazyQuery } from \'@apollo/client\';\n\nconst SEARCH = gql`\n  query Search($query: String!) {\n    search(query: $query) {\n      ... on User { id, name, __typename }\n      ... on Post { id, title, __typename }\n    }\n  }\n`;\n\nfunction SearchBar() {\n  const [search, { data, loading }] = useLazyQuery(SEARCH);\n  const [query, setQuery] = useState(\'\');\n\n  // Debounce поиска\n  useEffect(() => {\n    if (query.length < 2) return;\n    const timer = setTimeout(() => {\n      search({ variables: { query } });\n    }, 300);\n    return () => clearTimeout(timer);\n  }, [query, search]);\n\n  return (\n    <div>\n      <input\n        value={query}\n        onChange={e => setQuery(e.target.value)}\n        placeholder="Поиск..."\n      />\n      {loading && <Spinner />}\n      {data?.search.map(item => (\n        <div key={item.id}>\n          {item.__typename === \'User\' ? item.name : item.title}\n        </div>\n      ))}\n    </div>\n  );\n}' },
        { type: 'heading', value: 'useLazyQuery vs useQuery с skip' },
        { type: 'code', language: 'javascript', value: '// Вариант 1: useLazyQuery — вызов по требованию\nconst [getUser, { data }] = useLazyQuery(GET_USER);\n// Вызов: getUser({ variables: { id: "1" } })\n\n// Вариант 2: useQuery с skip — условное выполнение\nconst { data } = useQuery(GET_USER, {\n  variables: { id: selectedId },\n  skip: !selectedId // Не выполнять, пока нет selectedId\n});\n\n// useLazyQuery — когда нужен ручной контроль (поиск, кнопка)\n// skip — когда запрос зависит от данных (пропустить, если нет переменной)' },
        { type: 'note', value: 'useLazyQuery возвращает массив: [функция-вызова, результат]. Функция принимает те же options, что и useQuery. Результат идентичен useQuery.' }
      ]
    },
    {
      id: 5,
      title: 'Polling и Refetch',
      type: 'theory',
      content: [
        { type: 'text', value: 'Polling автоматически перезапрашивает данные через интервал. Refetch позволяет обновить данные по требованию. Оба подхода полезны для актуальности данных.' },
        { type: 'heading', value: 'Polling' },
        { type: 'code', language: 'javascript', value: 'function Dashboard() {\n  const { data, startPolling, stopPolling } = useQuery(GET_STATS, {\n    pollInterval: 10000 // Обновлять каждые 10 секунд\n  });\n\n  // Можно динамически управлять polling\n  useEffect(() => {\n    // Остановить polling при уходе со страницы\n    return () => stopPolling();\n  }, [stopPolling]);\n\n  // Начать/остановить по условию\n  const handleToggle = (active) => {\n    if (active) startPolling(5000);\n    else stopPolling();\n  };\n\n  return (\n    <div>\n      <p>Заказов сегодня: {data?.stats.ordersToday}</p>\n      <p>Обновлено: {new Date().toLocaleTimeString()}</p>\n    </div>\n  );\n}' },
        { type: 'heading', value: 'Refetch с новыми переменными' },
        { type: 'code', language: 'javascript', value: 'function FilterablePosts() {\n  const [status, setStatus] = useState(\'PUBLISHED\');\n  const { data, loading, refetch } = useQuery(GET_POSTS, {\n    variables: { status }\n  });\n\n  const handleFilterChange = (newStatus) => {\n    setStatus(newStatus);\n    // refetch с новыми переменными\n    refetch({ status: newStatus });\n  };\n\n  return (\n    <div>\n      <select value={status} onChange={e => handleFilterChange(e.target.value)}>\n        <option value="PUBLISHED">Опубликованные</option>\n        <option value="DRAFT">Черновики</option>\n        <option value="ARCHIVED">Архив</option>\n      </select>\n      {loading ? <Spinner /> : (\n        data?.posts.map(post => <PostCard key={post.id} post={post} />)\n      )}\n    </div>\n  );\n}' },
        { type: 'tip', value: 'Polling подходит для дашбордов и мониторинга. Для чатов и уведомлений лучше подписки (subscriptions). Refetch — для ручного обновления (кнопка "Обновить", pull-to-refresh).' }
      ]
    },
    {
      id: 6,
      title: 'Auth Link и HTTP Headers',
      type: 'theory',
      content: [
        { type: 'text', value: 'Apollo Links — middleware для запросов. Auth Link добавляет токен в каждый запрос. Можно комбинировать несколько Links в цепочку.' },
        { type: 'heading', value: 'Настройка Auth Link' },
        { type: 'code', language: 'javascript', value: 'import {\n  ApolloClient, InMemoryCache, HttpLink, from, ApolloLink\n} from \'@apollo/client\';\nimport { setContext } from \'@apollo/client/link/context\';\nimport { onError } from \'@apollo/client/link/error\';\n\n// Auth Link — добавляет токен\nconst authLink = setContext((_, { headers }) => ({\n  headers: {\n    ...headers,\n    authorization: localStorage.getItem(\'token\')\n      ? `Bearer ${localStorage.getItem(\'token\')}`\n      : \'\'\n  }\n}));\n\n// Error Link — глобальная обработка ошибок\nconst errorLink = onError(({ graphQLErrors, networkError }) => {\n  if (graphQLErrors) {\n    for (const err of graphQLErrors) {\n      if (err.extensions?.code === \'UNAUTHENTICATED\') {\n        localStorage.removeItem(\'token\');\n        window.location.href = \'/login\';\n      }\n    }\n  }\n});\n\n// HTTP Link\nconst httpLink = new HttpLink({\n  uri: \'http://localhost:4000/graphql\'\n});\n\n// Комбинируем: errorLink -> authLink -> httpLink\nconst client = new ApolloClient({\n  link: from([errorLink, authLink, httpLink]),\n  cache: new InMemoryCache()\n});' },
        { type: 'note', value: 'Порядок Links важен! Запрос проходит слева направо: errorLink перехватывает ошибки, authLink добавляет токен, httpLink отправляет запрос.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Блог на Apollo Client',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте React компоненты блога с Apollo Client: список постов, создание поста и поиск.',
      requirements: [
        'Настройте ApolloClient с authLink и errorLink',
        'Компонент PostList с useQuery — загрузка и отображение списка постов',
        'Компонент CreatePost с useMutation — форма создания поста с обновлением кэша',
        'Компонент SearchPosts с useLazyQuery — поиск с debounce',
        'Обработка состояний: loading, error, пустой результат',
        'refetchQueries или update для обновления списка после создания'
      ],
      hint: 'Используйте gql для определения запросов. useQuery выполняется при монтировании, useMutation — при вызове функции. useLazyQuery — по требованию.',
      expectedOutput: 'Три React компонента, работающих с Apollo Client: список, создание и поиск постов.',
      solution: `import { gql, useQuery, useMutation, useLazyQuery } from '@apollo/client';
import { useState, useEffect } from 'react';

// Запросы
const GET_POSTS = gql\`
  query GetPosts {
    posts {
      id
      title
      body
      author { name }
      createdAt
    }
  }
\`;

const CREATE_POST = gql\`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      id
      title
      body
      author { name }
      createdAt
    }
  }
\`;

const SEARCH_POSTS = gql\`
  query SearchPosts($query: String!) {
    searchPosts(query: $query) {
      id
      title
      author { name }
    }
  }
\`;

// Список постов
function PostList() {
  const { data, loading, error } = useQuery(GET_POSTS);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error.message}</p>;
  if (!data.posts.length) return <p>Постов пока нет</p>;

  return (
    <div>
      {data.posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.body}</p>
          <small>Автор: {post.author.name}</small>
        </article>
      ))}
    </div>
  );
}

// Создание поста
function CreatePost() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [createPost, { loading, error }] = useMutation(CREATE_POST, {
    update: (cache, { data: { createPost } }) => {
      const existing = cache.readQuery({ query: GET_POSTS });
      if (existing) {
        cache.writeQuery({
          query: GET_POSTS,
          data: { posts: [createPost, ...existing.posts] }
        });
      }
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createPost({ variables: { input: { title, body } } });
    setTitle('');
    setBody('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Заголовок" />
      <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Текст" />
      <button disabled={loading}>{loading ? 'Создание...' : 'Создать'}</button>
      {error && <p>{error.message}</p>}
    </form>
  );
}

// Поиск
function SearchPosts() {
  const [query, setQuery] = useState('');
  const [search, { data, loading }] = useLazyQuery(SEARCH_POSTS);

  useEffect(() => {
    if (query.length < 2) return;
    const timer = setTimeout(() => {
      search({ variables: { query } });
    }, 300);
    return () => clearTimeout(timer);
  }, [query, search]);

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Поиск..." />
      {loading && <p>Поиск...</p>}
      {data?.searchPosts.map(post => (
        <div key={post.id}>{post.title} — {post.author.name}</div>
      ))}
    </div>
  );
}`,
      explanation: 'PostList использует useQuery — запрос выполняется при монтировании. CreatePost использует useMutation с update для обновления кэша без повторного запроса. SearchPosts использует useLazyQuery с debounce через setTimeout — запрос выполняется через 300мс после последнего ввода. Каждый компонент обрабатывает loading и error состояния.'
    }
  ]
}
