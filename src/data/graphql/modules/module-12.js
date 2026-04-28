export default {
  id: 12,
  title: 'File Upload в GraphQL',
  description: 'Загрузка файлов через GraphQL: спецификация multipart, Apollo Upload, presigned URLs и лучшие практики.',
  lessons: [
    {
      id: 1,
      title: 'Способы загрузки файлов',
      type: 'theory',
      content: [
        { type: 'text', value: 'GraphQL изначально не поддерживает загрузку файлов. Существует несколько подходов: GraphQL Multipart Request, presigned URLs и гибридный подход с REST.' },
        { type: 'heading', value: 'Три подхода' },
        { type: 'list', value: [
          'GraphQL Multipart Request — файл отправляется прямо в мутации через multipart/form-data',
          'Presigned URL — GraphQL возвращает URL для прямой загрузки в S3/Cloud Storage',
          'Гибридный — загрузка через REST, ссылка передаётся в мутацию'
        ] },
        { type: 'heading', value: 'Presigned URL (рекомендуемый)' },
        { type: 'code', language: 'graphql', value: '# Шаг 1: получаем URL для загрузки\nmutation GetUploadUrl($filename: String!, $contentType: String!) {\n  createPresignedUrl(filename: $filename, contentType: $contentType) {\n    uploadUrl       # URL для PUT запроса\n    fileUrl         # URL файла после загрузки\n    key             # Ключ в хранилище\n  }\n}\n\n# Шаг 2: загружаем файл напрямую в хранилище (REST)\n# PUT uploadUrl с файлом в body\n\n# Шаг 3: сохраняем ссылку через мутацию\nmutation UpdateAvatar($fileUrl: String!) {\n  updateProfile(input: { avatar: $fileUrl }) {\n    id\n    avatar\n  }\n}' },
        { type: 'tip', value: 'Presigned URL — лучший подход для production. Файл загружается напрямую в облачное хранилище (S3, GCS), минуя GraphQL сервер. Это экономит ресурсы сервера.' }
      ]
    },
    {
      id: 2,
      title: 'GraphQL Upload (Multipart)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Спецификация GraphQL Multipart Request позволяет отправлять файлы как часть GraphQL мутации через multipart/form-data.' },
        { type: 'heading', value: 'Серверная настройка' },
        { type: 'code', language: 'bash', value: 'npm install graphql-upload-ts' },
        { type: 'code', language: 'javascript', value: 'import { GraphQLUpload } from \'graphql-upload-ts\';\nimport { createWriteStream, existsSync, mkdirSync } from \'fs\';\nimport path from \'path\';\n\n// Схема\nconst typeDefs = `#graphql\n  scalar Upload\n\n  type File {\n    filename: String!\n    mimetype: String!\n    url: String!\n  }\n\n  type Mutation {\n    uploadFile(file: Upload!): File!\n    uploadAvatar(file: Upload!): User!\n  }\n`;\n\nconst resolvers = {\n  Upload: GraphQLUpload,\n\n  Mutation: {\n    uploadFile: async (_, { file }) => {\n      const { createReadStream, filename, mimetype } = await file;\n\n      // Создаём папку для загрузок\n      const uploadDir = \'./uploads\';\n      if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true });\n\n      // Уникальное имя файла\n      const uniqueName = `${Date.now()}-${filename}`;\n      const filePath = path.join(uploadDir, uniqueName);\n\n      // Сохраняем файл\n      await new Promise((resolve, reject) => {\n        createReadStream()\n          .pipe(createWriteStream(filePath))\n          .on(\'finish\', resolve)\n          .on(\'error\', reject);\n      });\n\n      return {\n        filename: uniqueName,\n        mimetype,\n        url: `/uploads/${uniqueName}`\n      };\n    }\n  }\n};' },
        { type: 'note', value: 'GraphQL Upload отправляет файл через multipart/form-data — это нестандартное расширение GraphQL. Не все клиенты и CDN поддерживают его. Presigned URL более универсален.' }
      ]
    },
    {
      id: 3,
      title: 'Presigned URL с S3',
      type: 'theory',
      content: [
        { type: 'text', value: 'Presigned URL позволяет клиенту загружать файлы напрямую в облачное хранилище (AWS S3, Google Cloud Storage) без участия GraphQL сервера.' },
        { type: 'heading', value: 'Серверная реализация (AWS S3)' },
        { type: 'code', language: 'javascript', value: 'import { S3Client, PutObjectCommand } from \'@aws-sdk/client-s3\';\nimport { getSignedUrl } from \'@aws-sdk/s3-request-presigner\';\nimport { v4 as uuid } from \'uuid\';\n\nconst s3 = new S3Client({ region: process.env.AWS_REGION });\n\nconst resolvers = {\n  Mutation: {\n    createPresignedUrl: async (_, { filename, contentType }, { user }) => {\n      if (!user) throw new AuthError();\n\n      // Генерируем уникальный ключ\n      const ext = filename.split(\'.\').pop();\n      const key = `uploads/${user.id}/${uuid()}.${ext}`;\n\n      // Создаём presigned URL (действителен 15 минут)\n      const command = new PutObjectCommand({\n        Bucket: process.env.S3_BUCKET,\n        Key: key,\n        ContentType: contentType\n      });\n\n      const uploadUrl = await getSignedUrl(s3, command, {\n        expiresIn: 900 // 15 минут\n      });\n\n      const fileUrl = `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${key}`;\n\n      return { uploadUrl, fileUrl, key };\n    },\n\n    // После загрузки файла клиент вызывает эту мутацию\n    completeUpload: async (_, { key, type }, { user, db }) => {\n      const fileUrl = `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${key}`;\n\n      if (type === \'AVATAR\') {\n        return db.user.update({\n          where: { id: user.id },\n          data: { avatar: fileUrl }\n        });\n      }\n      // другие типы файлов...\n    }\n  }\n};' },
        { type: 'heading', value: 'Клиентский код' },
        { type: 'code', language: 'javascript', value: '// React компонент загрузки аватара\nfunction AvatarUpload() {\n  const [createUrl] = useMutation(CREATE_PRESIGNED_URL);\n  const [completeUpload] = useMutation(COMPLETE_UPLOAD);\n\n  const handleUpload = async (event) => {\n    const file = event.target.files[0];\n    if (!file) return;\n\n    // 1. Получаем presigned URL\n    const { data } = await createUrl({\n      variables: {\n        filename: file.name,\n        contentType: file.type\n      }\n    });\n\n    // 2. Загружаем файл напрямую в S3\n    await fetch(data.createPresignedUrl.uploadUrl, {\n      method: \'PUT\',\n      body: file,\n      headers: { \'Content-Type\': file.type }\n    });\n\n    // 3. Уведомляем сервер\n    await completeUpload({\n      variables: {\n        key: data.createPresignedUrl.key,\n        type: \'AVATAR\'\n      }\n    });\n  };\n\n  return <input type="file" accept="image/*" onChange={handleUpload} />;\n}' },
        { type: 'tip', value: 'При загрузке через presigned URL файл идёт напрямую с клиента в S3 — сервер GraphQL не тратит ресурсы на передачу файлов. Это масштабируется гораздо лучше.' }
      ]
    },
    {
      id: 4,
      title: 'Валидация и безопасность',
      type: 'theory',
      content: [
        { type: 'text', value: 'При загрузке файлов важно проверять: размер, тип файла, содержимое. Без валидации можно загрузить вредоносный файл или исчерпать дисковое пространство.' },
        { type: 'heading', value: 'Валидация на сервере' },
        { type: 'code', language: 'javascript', value: 'const ALLOWED_TYPES = [\'image/jpeg\', \'image/png\', \'image/webp\', \'image/gif\'];\nconst MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB\n\nconst resolvers = {\n  Mutation: {\n    uploadAvatar: async (_, { file }, { user }) => {\n      const { createReadStream, filename, mimetype } = await file;\n\n      // Проверка типа файла\n      if (!ALLOWED_TYPES.includes(mimetype)) {\n        throw new GraphQLError(\n          `Недопустимый тип файла: ${mimetype}. Разрешены: ${ALLOWED_TYPES.join(\', \')}`,\n          { extensions: { code: \'BAD_USER_INPUT\' } }\n        );\n      }\n\n      // Проверка расширения\n      const ext = filename.split(\'.\').pop().toLowerCase();\n      if (![\'jpg\', \'jpeg\', \'png\', \'webp\', \'gif\'].includes(ext)) {\n        throw new GraphQLError(\'Недопустимое расширение файла\');\n      }\n\n      // Проверка размера (читаем поток)\n      const stream = createReadStream();\n      let size = 0;\n      const chunks = [];\n\n      for await (const chunk of stream) {\n        size += chunk.length;\n        if (size > MAX_FILE_SIZE) {\n          stream.destroy();\n          throw new GraphQLError(\n            `Файл слишком большой. Максимум: ${MAX_FILE_SIZE / 1024 / 1024} MB`\n          );\n        }\n        chunks.push(chunk);\n      }\n\n      const buffer = Buffer.concat(chunks);\n      // Дальнейшая обработка...\n    }\n  }\n};' },
        { type: 'heading', value: 'Presigned URL с ограничениями' },
        { type: 'code', language: 'javascript', value: '// S3 presigned URL с ограничениями\nconst command = new PutObjectCommand({\n  Bucket: process.env.S3_BUCKET,\n  Key: key,\n  ContentType: contentType,\n  // Ограничения через Conditions\n  ContentLength: undefined // Проверяется через S3 bucket policy\n});\n\n// S3 Bucket Policy для ограничения размера\n// {\n//   "Condition": {\n//     "StringEquals": {\n//       "s3:prefix": "uploads/"\n//     },\n//     "NumericLessThanEquals": {\n//       "s3:content-length-range": 5242880\n//     }\n//   }\n// }' },
        { type: 'note', value: 'Всегда валидируйте файлы и на клиенте (для UX), и на сервере (для безопасности). Клиентская валидация обходится, серверная — нет.' }
      ]
    },
    {
      id: 5,
      title: 'Множественная загрузка и прогресс',
      type: 'theory',
      content: [
        { type: 'text', value: 'Для загрузки нескольких файлов и отображения прогресса нужны дополнительные настройки на клиенте и сервере.' },
        { type: 'heading', value: 'Множественная загрузка' },
        { type: 'code', language: 'graphql', value: 'type Mutation {\n  uploadFiles(files: [Upload!]!): [File!]!\n  createPost(input: CreatePostInput!, images: [Upload!]): Post!\n}\n\n# Или через presigned URLs\ntype Mutation {\n  createPresignedUrls(\n    files: [FileInput!]!\n  ): [PresignedUrlPayload!]!\n}\n\ninput FileInput {\n  filename: String!\n  contentType: String!\n}' },
        { type: 'code', language: 'javascript', value: '// Параллельная загрузка с прогрессом (presigned URL)\nfunction MultiFileUpload() {\n  const [progress, setProgress] = useState({});\n  const [createUrls] = useMutation(CREATE_PRESIGNED_URLS);\n\n  const handleUpload = async (files) => {\n    // 1. Получаем URLs для всех файлов\n    const { data } = await createUrls({\n      variables: {\n        files: files.map(f => ({\n          filename: f.name,\n          contentType: f.type\n        }))\n      }\n    });\n\n    // 2. Загружаем параллельно с отслеживанием прогресса\n    const uploads = data.createPresignedUrls.map((urlData, i) => {\n      return new Promise((resolve, reject) => {\n        const xhr = new XMLHttpRequest();\n        xhr.upload.onprogress = (event) => {\n          if (event.lengthComputable) {\n            setProgress(prev => ({\n              ...prev,\n              [files[i].name]: Math.round((event.loaded / event.total) * 100)\n            }));\n          }\n        };\n        xhr.onload = () => resolve(urlData.fileUrl);\n        xhr.onerror = () => reject(new Error(\'Ошибка загрузки\'));\n        xhr.open(\'PUT\', urlData.uploadUrl);\n        xhr.setRequestHeader(\'Content-Type\', files[i].type);\n        xhr.send(files[i]);\n      });\n    });\n\n    const urls = await Promise.all(uploads);\n    return urls; // Массив URL загруженных файлов\n  };\n\n  return (\n    <div>\n      <input type="file" multiple onChange={(e) => handleUpload([...e.target.files])} />\n      {Object.entries(progress).map(([name, pct]) => (\n        <div key={name}>{name}: {pct}%</div>\n      ))}\n    </div>\n  );\n}' },
        { type: 'tip', value: 'Для отслеживания прогресса загрузки используйте XMLHttpRequest вместо fetch — у него есть событие upload.onprogress. fetch API не поддерживает прогресс загрузки.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Загрузка аватара',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте систему загрузки аватара пользователя через presigned URL с валидацией типа и размера файла.',
      requirements: [
        'Тип PresignedUrlPayload: uploadUrl, fileUrl, key',
        'Мутация createAvatarUploadUrl(filename, contentType) — генерация presigned URL',
        'Мутация updateAvatar(key) — сохранение URL аватара в профиле',
        'Валидация contentType (только image/jpeg, image/png, image/webp)',
        'Валидация расширения файла',
        'Клиентский код: получение URL, загрузка файла, обновление профиля'
      ],
      hint: 'Проверяйте contentType на сервере перед генерацией URL. Используйте uuid для уникального имени файла. Клиент делает PUT запрос на uploadUrl.',
      expectedOutput: 'Мутации для presigned URL загрузки аватара с валидацией и клиентский код.',
      solution: `// Схема
const typeDefs = \`#graphql
  type PresignedUrlPayload {
    uploadUrl: String!
    fileUrl: String!
    key: String!
  }

  type Mutation {
    createAvatarUploadUrl(filename: String!, contentType: String!): PresignedUrlPayload!
    updateAvatar(key: String!): User!
  }
\`;

// Резолвер
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];

const resolvers = {
  Mutation: {
    createAvatarUploadUrl: async (_, { filename, contentType }, { user }) => {
      if (!user) throw new GraphQLError('Не авторизован');

      if (!ALLOWED_IMAGE_TYPES.includes(contentType)) {
        throw new GraphQLError(
          \`Недопустимый тип файла. Разрешены: \${ALLOWED_IMAGE_TYPES.join(', ')}\`
        );
      }

      const ext = filename.split('.').pop().toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        throw new GraphQLError('Недопустимое расширение файла');
      }

      const key = \`avatars/\${user.id}/\${uuid()}.\${ext}\`;
      const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: key,
        ContentType: contentType
      });

      const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 900 });
      const fileUrl = \`https://\${process.env.S3_BUCKET}.s3.amazonaws.com/\${key}\`;

      return { uploadUrl, fileUrl, key };
    },

    updateAvatar: async (_, { key }, { user, db }) => {
      if (!user) throw new GraphQLError('Не авторизован');
      const fileUrl = \`https://\${process.env.S3_BUCKET}.s3.amazonaws.com/\${key}\`;
      return db.user.update({
        where: { id: user.id },
        data: { avatar: fileUrl }
      });
    }
  }
};

// Клиентский код
async function uploadAvatar(file) {
  const { data } = await client.mutate({
    mutation: CREATE_AVATAR_URL,
    variables: { filename: file.name, contentType: file.type }
  });

  await fetch(data.createAvatarUploadUrl.uploadUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type }
  });

  await client.mutate({
    mutation: UPDATE_AVATAR,
    variables: { key: data.createAvatarUploadUrl.key }
  });
}`,
      explanation: 'Двухэтапный процесс: 1) GraphQL мутация генерирует presigned URL с проверкой типа файла. 2) Клиент загружает файл напрямую в S3 через PUT. 3) После загрузки мутация updateAvatar сохраняет URL в БД. Валидация типа и расширения файла на сервере предотвращает загрузку нежелательных файлов. uuid обеспечивает уникальность имён файлов.'
    }
  ]
}
