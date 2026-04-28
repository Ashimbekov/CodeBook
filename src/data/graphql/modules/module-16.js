export default {
  id: 16,
  title: 'GraphQL с React',
  description: 'Паттерны интеграции GraphQL с React: fragment co-location, optimistic UI, suspense, error boundaries.',
  lessons: [
    {
      id: 1,
      title: 'Fragment Co-location',
      type: 'theory',
      content: [
        { type: 'text', value: 'Fragment co-location — паттерн, при котором каждый компонент определяет GraphQL фрагмент с полями, которые ему нужны. Родительский компонент собирает фрагменты в один запрос.' },
        { type: 'heading', value: 'Принцип работы' },
        { type: 'code', language: 'javascript', value: '// UserAvatar.jsx — определяет свой фрагмент\nexport const USER_AVATAR_FRAGMENT = gql`\n  fragment UserAvatarFields on User {\n    id\n    name\n    avatar\n  }\n`;\n\nfunction UserAvatar({ user }) {\n  return <img src={user.avatar} alt={user.name} />;\n}\n\n// PostCard.jsx — определяет свой фрагмент, включает UserAvatar\nexport const POST_CARD_FRAGMENT = gql`\n  ${USER_AVATAR_FRAGMENT}\n  fragment PostCardFields on Post {\n    id\n    title\n    createdAt\n    author {\n      ...UserAvatarFields\n    }\n  }\n`;\n\nfunction PostCard({ post }) {\n  return (\n    <article>\n      <UserAvatar user={post.author} />\n      <h2>{post.title}</h2>\n    </article>\n  );\n}\n\n// PostList.jsx — собирает фрагменты в запрос\nconst GET_POSTS = gql`\n  ${POST_CARD_FRAGMENT}\n  query GetPosts {\n    posts {\n      ...PostCardFields\n    }\n  }\n`;\n\nfunction PostList() {\n  const { data } = useQuery(GET_POSTS);\n  return data?.posts.map(post => <PostCard key={post.id} post={post} />);\n}' },
        { type: 'tip', value: 'Fragment co-location гарантирует, что компонент всегда получит нужные данные. При изменении компонента обновляется только его фрагмент — остальные запросы не трогаются.' }
      ]
    },
    {
      id: 2,
      title: 'Optimistic UI паттерны',
      type: 'theory',
      content: [
        { type: 'text', value: 'Optimistic UI — мгновенное отображение результата действия без ожидания сервера. Рассмотрим типичные сценарии: лайки, комментарии, удаление.' },
        { type: 'heading', value: 'Toggle (лайк/закладка)' },
        { type: 'code', language: 'javascript', value: 'function LikeButton({ post }) {\n  const [toggleLike] = useMutation(TOGGLE_LIKE, {\n    optimisticResponse: {\n      __typename: \'Mutation\',\n      toggleLike: {\n        __typename: \'Post\',\n        id: post.id,\n        isLiked: !post.isLiked,\n        likesCount: post.isLiked ? post.likesCount - 1 : post.likesCount + 1\n      }\n    }\n  });\n\n  return (\n    <button\n      className={post.isLiked ? \'liked\' : \'\'}\n      onClick={() => toggleLike({ variables: { postId: post.id } })}\n    >\n      {post.isLiked ? \'Убрать\' : \'Лайк\'} ({post.likesCount})\n    </button>\n  );\n}' },
        { type: 'heading', value: 'Удаление с анимацией' },
        { type: 'code', language: 'javascript', value: 'function PostItem({ post }) {\n  const [isDeleting, setIsDeleting] = useState(false);\n  const [deletePost] = useMutation(DELETE_POST, {\n    optimisticResponse: {\n      __typename: \'Mutation\',\n      deletePost: { __typename: \'Post\', id: post.id }\n    },\n    update(cache) {\n      cache.evict({ id: `Post:${post.id}` });\n      cache.gc();\n    }\n  });\n\n  const handleDelete = async () => {\n    setIsDeleting(true);\n    // Анимация исчезновения\n    await new Promise(r => setTimeout(r, 300));\n    deletePost({ variables: { id: post.id } });\n  };\n\n  return (\n    <div className={`post ${isDeleting ? \'fade-out\' : \'\'}`}>\n      <h2>{post.title}</h2>\n      <button onClick={handleDelete}>Удалить</button>\n    </div>\n  );\n}' },
        { type: 'note', value: 'Оптимистичные обновления работают в 99% случаев. При ошибке сервера Apollo автоматически откатит кэш. Для критичных операций (оплата) используйте loading состояние.' }
      ]
    },
    {
      id: 3,
      title: 'Error Boundaries для GraphQL',
      type: 'theory',
      content: [
        { type: 'text', value: 'Error Boundaries ловят ошибки рендеринга. В сочетании с Apollo Client errorPolicy можно гибко управлять отображением ошибок на уровне компонентов.' },
        { type: 'heading', value: 'GraphQL Error Boundary' },
        { type: 'code', language: 'javascript', value: 'import { ErrorBoundary } from \'react-error-boundary\';\n\n// Компонент ошибки\nfunction GraphQLErrorFallback({ error, resetErrorBoundary }) {\n  return (\n    <div className="error-container">\n      <h2>Что-то пошло не так</h2>\n      <p>{error.message}</p>\n      <button onClick={resetErrorBoundary}>Попробовать снова</button>\n    </div>\n  );\n}\n\n// Оборачиваем секции приложения\nfunction App() {\n  return (\n    <div>\n      <Header /> {/* Всегда видим */}\n      <ErrorBoundary FallbackComponent={GraphQLErrorFallback}>\n        <PostList /> {/* Изолированная ошибка */}\n      </ErrorBoundary>\n      <ErrorBoundary FallbackComponent={GraphQLErrorFallback}>\n        <Sidebar /> {/* Своя изолированная ошибка */}\n      </ErrorBoundary>\n    </div>\n  );\n}' },
        { type: 'heading', value: 'errorPolicy в Apollo Client' },
        { type: 'code', language: 'javascript', value: '// errorPolicy определяет поведение при ошибках\n// "none" (по умолчанию) — при ошибке data = undefined\n// "all" — data может содержать частичные данные + errors\n// "ignore" — ошибки игнорируются, только data\n\nconst { data, error } = useQuery(GET_DASHBOARD, {\n  errorPolicy: \'all\'\n});\n\n// С errorPolicy: \'all\' получаем частичные данные\n// Даже если часть запроса упала\nif (data) {\n  return (\n    <div>\n      {data.user && <UserCard user={data.user} />}\n      {data.posts && <PostList posts={data.posts} />}\n      {error && <p>Некоторые данные не загрузились</p>}\n    </div>\n  );\n}' },
        { type: 'tip', value: 'Используйте errorPolicy: \"all\" для дашбордов, где важно показать максимум данных. Используйте Error Boundaries для изоляции ошибок между секциями страницы.' }
      ]
    },
    {
      id: 4,
      title: 'Паттерны загрузки данных',
      type: 'theory',
      content: [
        { type: 'text', value: 'Правильные паттерны загрузки улучшают UX: skeleton screens, prefetching, pagination patterns. Рассмотрим лучшие практики.' },
        { type: 'heading', value: 'Skeleton Loading' },
        { type: 'code', language: 'javascript', value: 'function PostList() {\n  const { data, loading, previousData } = useQuery(GET_POSTS);\n\n  // Показываем предыдущие данные пока загружаются новые\n  const posts = data?.posts || previousData?.posts;\n\n  if (loading && !posts) {\n    return (\n      <div>\n        {[1, 2, 3].map(i => <PostSkeleton key={i} />)}\n      </div>\n    );\n  }\n\n  return (\n    <div className={loading ? \'opacity-50\' : \'\'}>\n      {posts.map(post => <PostCard key={post.id} post={post} />)}\n    </div>\n  );\n}\n\nfunction PostSkeleton() {\n  return (\n    <div className="animate-pulse">\n      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />\n      <div className="h-3 bg-gray-200 rounded w-1/2" />\n    </div>\n  );\n}' },
        { type: 'heading', value: 'Prefetching' },
        { type: 'code', language: 'javascript', value: 'import { useApolloClient } from \'@apollo/client\';\n\nfunction PostListItem({ post }) {\n  const client = useApolloClient();\n\n  // Prefetch при наведении мыши\n  const handleMouseEnter = () => {\n    client.query({\n      query: GET_POST_DETAIL,\n      variables: { id: post.id }\n    });\n  };\n\n  return (\n    <Link\n      to={`/posts/${post.id}`}\n      onMouseEnter={handleMouseEnter}\n    >\n      {post.title}\n    </Link>\n  );\n}\n\n// Когда пользователь кликнет, данные уже в кэше!' },
        { type: 'note', value: 'Prefetching загружает данные заранее — при наведении мыши или при рендеринге списка. К моменту клика данные уже в кэше, и страница открывается мгновенно.' }
      ]
    },
    {
      id: 5,
      title: 'Формы и мутации',
      type: 'theory',
      content: [
        { type: 'text', value: 'Работа с формами — частый сценарий: создание и редактирование объектов. Рассмотрим паттерны интеграции форм с GraphQL мутациями.' },
        { type: 'heading', value: 'Форма с React Hook Form' },
        { type: 'code', language: 'javascript', value: 'import { useForm } from \'react-hook-form\';\nimport { useMutation, useQuery } from \'@apollo/client\';\n\nfunction EditPostForm({ postId }) {\n  // Загружаем текущие данные\n  const { data, loading: queryLoading } = useQuery(GET_POST, {\n    variables: { id: postId }\n  });\n\n  // Мутация обновления\n  const [updatePost, { loading: mutationLoading }] = useMutation(UPDATE_POST);\n\n  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm();\n\n  // Заполняем форму данными с сервера\n  useEffect(() => {\n    if (data?.post) {\n      reset({\n        title: data.post.title,\n        body: data.post.body,\n        status: data.post.status\n      });\n    }\n  }, [data, reset]);\n\n  const onSubmit = async (formData) => {\n    try {\n      await updatePost({\n        variables: { id: postId, input: formData }\n      });\n      alert(\'Сохранено!\');\n    } catch (err) {\n      alert(\'Ошибка: \' + err.message);\n    }\n  };\n\n  if (queryLoading) return <Spinner />;\n\n  return (\n    <form onSubmit={handleSubmit(onSubmit)}>\n      <input {...register(\'title\', { required: \'Заголовок обязателен\' })} />\n      {errors.title && <span>{errors.title.message}</span>}\n\n      <textarea {...register(\'body\', { required: true })} />\n\n      <select {...register(\'status\')}>\n        <option value="DRAFT">Черновик</option>\n        <option value="PUBLISHED">Опубликован</option>\n      </select>\n\n      <button disabled={mutationLoading || !isDirty}>\n        {mutationLoading ? \'Сохранение...\' : \'Сохранить\'}\n      </button>\n    </form>\n  );\n}' },
        { type: 'tip', value: 'React Hook Form минимизирует перерисовки при вводе. В сочетании с Apollo Client получаем эффективную связку: данные из кэша + валидация форм + мутации.' }
      ]
    },
    {
      id: 6,
      title: 'subscribeToMore',
      type: 'theory',
      content: [
        { type: 'text', value: 'subscribeToMore добавляет подписку к существующему запросу, автоматически обновляя кэш при получении новых данных. Идеально для списков с real-time обновлениями.' },
        { type: 'heading', value: 'Реализация' },
        { type: 'code', language: 'javascript', value: 'const MESSAGES_QUERY = gql`\n  query GetMessages($chatId: ID!) {\n    messages(chatId: $chatId) {\n      id\n      text\n      sender { name avatar }\n      createdAt\n    }\n  }\n`;\n\nconst MESSAGE_SUBSCRIPTION = gql`\n  subscription OnNewMessage($chatId: ID!) {\n    messageAdded(chatId: $chatId) {\n      id\n      text\n      sender { name avatar }\n      createdAt\n    }\n  }\n`;\n\nfunction ChatRoom({ chatId }) {\n  const { data, loading, subscribeToMore } = useQuery(MESSAGES_QUERY, {\n    variables: { chatId }\n  });\n\n  useEffect(() => {\n    const unsubscribe = subscribeToMore({\n      document: MESSAGE_SUBSCRIPTION,\n      variables: { chatId },\n      updateQuery: (prev, { subscriptionData }) => {\n        if (!subscriptionData.data) return prev;\n        const newMessage = subscriptionData.data.messageAdded;\n\n        // Проверяем дубликаты\n        if (prev.messages.some(m => m.id === newMessage.id)) {\n          return prev;\n        }\n\n        return {\n          ...prev,\n          messages: [...prev.messages, newMessage]\n        };\n      }\n    });\n\n    return () => unsubscribe();\n  }, [chatId, subscribeToMore]);\n\n  if (loading) return <Spinner />;\n\n  return (\n    <div className="chat">\n      {data.messages.map(msg => (\n        <Message key={msg.id} message={msg} />\n      ))}\n    </div>\n  );\n}' },
        { type: 'note', value: 'subscribeToMore загружает начальные данные через Query, затем дополняет их через Subscription. updateQuery определяет, как новые данные объединяются с существующими.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Компонент с real-time',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте React компонент комментариев с подгрузкой, оптимистичным добавлением и real-time обновлениями.',
      requirements: [
        'Fragment co-location: CommentItem определяет свой фрагмент',
        'useQuery для загрузки комментариев к посту',
        'useMutation для добавления комментария с optimisticResponse',
        'subscribeToMore для получения новых комментариев в реальном времени',
        'Обработка loading, error и пустого состояния',
        'Skeleton loading при первой загрузке'
      ],
      hint: 'subscribeToMore вызывается в useEffect с зависимостью от postId. optimisticResponse должен содержать __typename для корректной нормализации. updateQuery добавляет новый комментарий в массив.',
      expectedOutput: 'React компонент комментариев с fragment co-location, оптимистичным добавлением и real-time подпиской.',
      solution: `import { gql, useQuery, useMutation } from '@apollo/client';
import { useState, useEffect } from 'react';

// Fragment co-location
const COMMENT_FIELDS = gql\`
  fragment CommentFields on Comment {
    id
    text
    createdAt
    author { id name avatar }
  }
\`;

const GET_COMMENTS = gql\`
  \${COMMENT_FIELDS}
  query GetComments($postId: ID!) {
    comments(postId: $postId) { ...CommentFields }
  }
\`;

const ADD_COMMENT = gql\`
  \${COMMENT_FIELDS}
  mutation AddComment($postId: ID!, $text: String!) {
    addComment(postId: $postId, text: $text) { ...CommentFields }
  }
\`;

const COMMENT_ADDED = gql\`
  \${COMMENT_FIELDS}
  subscription OnCommentAdded($postId: ID!) {
    commentAdded(postId: $postId) { ...CommentFields }
  }
\`;

function Comments({ postId, currentUser }) {
  const [text, setText] = useState('');
  const { data, loading, subscribeToMore } = useQuery(GET_COMMENTS, {
    variables: { postId }
  });

  const [addComment] = useMutation(ADD_COMMENT, {
    optimisticResponse: {
      __typename: 'Mutation',
      addComment: {
        __typename: 'Comment',
        id: 'temp-' + Date.now(),
        text,
        createdAt: new Date().toISOString(),
        author: { __typename: 'User', ...currentUser }
      }
    },
    update(cache, { data: { addComment } }) {
      const existing = cache.readQuery({
        query: GET_COMMENTS,
        variables: { postId }
      });
      cache.writeQuery({
        query: GET_COMMENTS,
        variables: { postId },
        data: { comments: [...(existing?.comments || []), addComment] }
      });
    }
  });

  useEffect(() => {
    const unsubscribe = subscribeToMore({
      document: COMMENT_ADDED,
      variables: { postId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newComment = subscriptionData.data.commentAdded;
        if (prev.comments.some(c => c.id === newComment.id)) return prev;
        return { ...prev, comments: [...prev.comments, newComment] };
      }
    });
    return () => unsubscribe();
  }, [postId, subscribeToMore]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    addComment({ variables: { postId, text } });
    setText('');
  };

  if (loading) return <div className="animate-pulse"><div className="h-4 bg-gray-200 rounded mb-2" /><div className="h-4 bg-gray-200 rounded mb-2" /></div>;

  return (
    <div>
      {data?.comments.length === 0 && <p>Комментариев пока нет</p>}
      {data?.comments.map(c => (
        <div key={c.id}>
          <strong>{c.author.name}</strong>
          <p>{c.text}</p>
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input value={text} onChange={e => setText(e.target.value)} placeholder="Комментарий..." />
        <button type="submit">Отправить</button>
      </form>
    </div>
  );
}`,
      explanation: 'Fragment COMMENT_FIELDS определяет данные комментария в одном месте. useQuery загружает начальные данные. useMutation с optimisticResponse мгновенно показывает новый комментарий. subscribeToMore добавляет комментарии от других пользователей в реальном времени. updateQuery проверяет дубликаты перед добавлением. Skeleton loading показывается при первой загрузке.'
    }
  ]
}
