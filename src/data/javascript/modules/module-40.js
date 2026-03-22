export default {
  id: 40,
  title: 'MongoDB и Mongoose',
  description: 'Работа с MongoDB через Mongoose: схемы, модели, CRUD операции, populate для связей, виртуальные поля и хуки',
  lessons: [
    {
      id: 1,
      title: 'Подключение и Schema',
      type: 'theory',
      content: [
        { type: 'text', value: 'Mongoose — ODM (Object Document Mapper) для MongoDB. Добавляет схемы, валидацию и удобный API поверх нативного MongoDB драйвера. Schema определяет структуру документа.' },
        { type: 'heading', value: 'Подключение и создание схемы' },
        { type: 'code', language: 'javascript', value: '// npm install mongoose\nconst mongoose = require("mongoose");\n\n// Подключение\nmongoose.connect("mongodb://localhost:27017/mydb")\n  .then(() => console.log("MongoDB подключена"))\n  .catch(err => console.error("Ошибка:", err));\n\n// Обработка событий\nmongoose.connection.on("disconnected", () => console.log("Отключено"));\nprocess.on("SIGINT", async () => {\n  await mongoose.connection.close();\n  process.exit(0);\n});\n\n// Создание схемы\nconst { Schema } = mongoose;\n\nconst userSchema = new Schema({\n  name: {\n    type: String,\n    required: [true, "Имя обязательно"],\n    trim: true,\n    minlength: 2,\n    maxlength: 50\n  },\n  email: {\n    type: String,\n    required: true,\n    unique: true,\n    lowercase: true,\n    match: [/^\\S+@\\S+\\.\\S+$/, "Некорректный email"]\n  },\n  age: { type: Number, min: 0, max: 120 },\n  role: { type: String, enum: ["user", "admin", "moderator"], default: "user" },\n  isActive: { type: Boolean, default: true },\n  tags: [String], // Массив строк\n  address: {\n    city: String,\n    country: { type: String, default: "Kazakhstan" }\n  },\n  createdAt: { type: Date, default: Date.now }\n}, {\n  timestamps: true, // Автоматически добавляет createdAt и updatedAt\n  versionKey: false // Убираем поле __v\n});\n\n// Создание модели\nconst User = mongoose.model("User", userSchema);\nmodule.exports = User;' },
        { type: 'tip', value: 'Опция timestamps: true автоматически добавляет createdAt и updatedAt в каждый документ. Не нужно управлять этим вручную.' }
      ]
    },
    {
      id: 2,
      title: 'Модель и CRUD операции',
      type: 'theory',
      content: [
        { type: 'text', value: 'Mongoose модель предоставляет методы для работы с коллекцией: create, find, findOne, findById, updateOne, deleteOne и многие другие.' },
        { type: 'heading', value: 'Полный CRUD' },
        { type: 'code', language: 'javascript', value: 'const User = require("./models/User");\n\n// CREATE\nasync function createUser() {\n  // Метод 1: new + save()\n  const user = new User({ name: "Алия", email: "aliya@example.com", age: 25 });\n  await user.save(); // Выполняет валидацию\n\n  // Метод 2: create() — короче\n  const user2 = await User.create({ name: "Берик", email: "berik@example.com" });\n\n  // Метод 3: insertMany() — массив\n  const users = await User.insertMany([\n    { name: "Карина", email: "karina@example.com" },\n    { name: "Данияр", email: "daniyar@example.com" }\n  ]);\n}\n\n// READ\nasync function readUsers() {\n  const all = await User.find();                            // Все\n  const active = await User.find({ isActive: true });       // С фильтром\n  const one = await User.findOne({ email: "a@b.com" });     // Первый\n  const byId = await User.findById("507f1f77bcf86cd799439011"); // По ID\n\n  // Выбор полей (проекция)\n  const names = await User.find().select("name email -_id"); // -_id исключает\n\n  // Сортировка, лимит, пропуск\n  const paginated = await User.find()\n    .sort({ createdAt: -1 })\n    .skip(10)\n    .limit(10);\n\n  // Подсчёт\n  const count = await User.countDocuments({ isActive: true });\n}\n\n// UPDATE\nasync function updateUser(id) {\n  // Обновить один документ\n  await User.updateOne({ _id: id }, { $set: { name: "Новое имя" } });\n\n  // Найти и обновить (возвращает документ)\n  const updated = await User.findByIdAndUpdate(\n    id,\n    { $set: { age: 30 }, $push: { tags: "новый" } },\n    { new: true, runValidators: true } // new: true — вернуть обновлённый\n  );\n}\n\n// DELETE\nasync function deleteUser(id) {\n  await User.deleteOne({ _id: id });\n  const deleted = await User.findByIdAndDelete(id); // Возвращает удалённый\n  await User.deleteMany({ isActive: false }); // Удалить несколько\n}' }
      ]
    },
    {
      id: 3,
      title: 'MongoDB операторы запросов',
      type: 'theory',
      content: [
        { type: 'text', value: 'MongoDB поддерживает мощные операторы для фильтрации, обновления и агрегации: $eq, $gt, $in, $set, $push, $pull, $and, $or, $regex и другие.' },
        { type: 'heading', value: 'Операторы запросов и обновления' },
        { type: 'code', language: 'javascript', value: 'const User = require("./models/User");\n\n// ОПЕРАТОРЫ СРАВНЕНИЯ\nawait User.find({ age: { $gt: 18, $lt: 60 } });   // > 18 и < 60\nawait User.find({ age: { $gte: 18, $lte: 60 } });  // >= 18 и <= 60\nawait User.find({ age: { $ne: 18 } });              // != 18\nawait User.find({ role: { $in: ["admin", "moderator"] } }); // В массиве\nawait User.find({ role: { $nin: ["user"] } });       // НЕ в массиве\n\n// ЛОГИЧЕСКИЕ ОПЕРАТОРЫ\nawait User.find({ $and: [{ age: { $gte: 18 } }, { isActive: true }] });\nawait User.find({ $or: [{ role: "admin" }, { age: { $gte: 60 } }] });\nawait User.find({ name: { $not: /^А/ } }); // Отрицание\n\n// ПОИСК ПО СТРОКЕ\nawait User.find({ name: /алия/i }); // Регулярное выражение (нечувствительно к регистру)\nawait User.find({ name: { $regex: "алия", $options: "i" } });\n\n// ОПЕРАТОРЫ ОБНОВЛЕНИЯ\nawait User.updateOne({ _id: id }, {\n  $set: { name: "Новое" },    // Установить значение\n  $unset: { age: "" },        // Удалить поле\n  $inc: { loginCount: 1 },    // Увеличить на 1\n  $push: { tags: "новый" },   // Добавить в массив\n  $pull: { tags: "старый" },  // Удалить из массива\n  $addToSet: { tags: "уникальный" } // Добавить если нет\n});\n\n// СУЩЕСТВОВАНИЕ ПОЛЯ\nawait User.find({ phone: { $exists: true } });\nawait User.find({ phone: { $exists: false } });' }
      ]
    },
    {
      id: 4,
      title: 'populate — связи между документами',
      type: 'theory',
      content: [
        { type: 'text', value: 'populate() — метод Mongoose для "JOIN" в MongoDB. Позволяет ссылаться на документы из других коллекций через ObjectId и автоматически их подгружать.' },
        { type: 'heading', value: 'Связи и populate' },
        { type: 'code', language: 'javascript', value: 'const mongoose = require("mongoose");\n\n// Схема пользователя\nconst userSchema = new mongoose.Schema({\n  name: String,\n  email: String\n});\n\n// Схема поста со ссылкой на автора\nconst postSchema = new mongoose.Schema({\n  title: String,\n  body: String,\n  author: {\n    type: mongoose.Schema.Types.ObjectId,\n    ref: "User", // Ссылка на модель User\n    required: true\n  },\n  tags: [String],\n  comments: [{\n    text: String,\n    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }\n  }]\n}, { timestamps: true });\n\nconst User = mongoose.model("User", userSchema);\nconst Post = mongoose.model("Post", postSchema);\n\n// Создание связанных документов\nasync function createPost() {\n  const user = await User.create({ name: "Алия", email: "a@b.com" });\n  const post = await Post.create({\n    title: "Мой пост",\n    body: "Текст поста",\n    author: user._id // Сохраняем ObjectId\n  });\n}\n\n// Чтение с populate\nasync function getPosts() {\n  // Получить все посты с данными автора\n  const posts = await Post.find().populate("author");\n  // author теперь объект User, а не ObjectId\n\n  // Выбрать только нужные поля автора\n  const posts2 = await Post.find().populate("author", "name email -_id");\n\n  // Вложенный populate\n  const posts3 = await Post.find()\n    .populate("author", "name")\n    .populate("comments.user", "name");\n\n  // Цепочка populate\n  const post = await Post.findById(id)\n    .populate({ path: "author", select: "name", populate: { path: "posts" } });\n}' }
      ]
    },
    {
      id: 5,
      title: 'Виртуальные поля и методы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Виртуальные поля вычисляются из других полей, но не хранятся в БД. Методы схемы добавляют поведение к документам. Pre/post хуки выполняются до/после операций.' },
        { type: 'heading', value: 'Виртуалы, методы, хуки' },
        { type: 'code', language: 'javascript', value: 'const mongoose = require("mongoose");\n\nconst userSchema = new mongoose.Schema({\n  firstName: String,\n  lastName: String,\n  email: String,\n  passwordHash: String,\n  birthDate: Date\n}, { toJSON: { virtuals: true }, toObject: { virtuals: true } }); // Включаем виртуалы в вывод\n\n// ВИРТУАЛЬНЫЕ ПОЛЯ (не хранятся в БД)\nuserSchema.virtual("fullName").get(function() {\n  return `${this.firstName} ${this.lastName}`;\n});\n\nuserSchema.virtual("age").get(function() {\n  if (!this.birthDate) return null;\n  const diff = Date.now() - this.birthDate.getTime();\n  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365));\n});\n\n// Виртуальная связь (не populate)\nuserSchema.virtual("posts", {\n  ref: "Post",\n  localField: "_id",\n  foreignField: "author"\n});\n\n// МЕТОДЫ ЭКЗЕМПЛЯРА\nuserSchema.methods.toSafeObject = function() {\n  const obj = this.toObject();\n  delete obj.passwordHash;\n  return obj;\n};\n\nuserSchema.methods.comparePassword = async function(password) {\n  return bcrypt.compare(password, this.passwordHash);\n};\n\n// СТАТИЧЕСКИЕ МЕТОДЫ\nuserSchema.statics.findByEmail = function(email) {\n  return this.findOne({ email: email.toLowerCase() });\n};\n\n// ХУКИ (middleware)\nuserSchema.pre("save", async function(next) {\n  // Хэшируем пароль перед сохранением\n  if (this.isModified("password")) {\n    this.passwordHash = await bcrypt.hash(this.password, 12);\n  }\n  next();\n});\n\nuserSchema.post("save", function(doc) {\n  console.log(`Пользователь ${doc.email} сохранён`);\n});\n\nuserSchema.pre("findOneAndDelete", async function() {\n  // Удалить все посты перед удалением пользователя\n  const user = await this.model.findOne(this.getFilter());\n  await Post.deleteMany({ author: user._id });\n});\n\nconst User = mongoose.model("User", userSchema);' }
      ]
    },
    {
      id: 6,
      title: 'Агрегация',
      type: 'theory',
      content: [
        { type: 'text', value: 'Агрегационный pipeline — мощный инструмент MongoDB для сложных запросов: группировка, фильтрация, соединение, вычисление статистики.' },
        { type: 'heading', value: 'Агрегационный pipeline' },
        { type: 'code', language: 'javascript', value: 'const Order = require("./models/Order");\n\n// Группировка и статистика\nconst stats = await Order.aggregate([\n  { $match: { status: "completed" } },      // Фильтр\n  { $group: {\n    _id: "$userId",                          // Группировать по userId\n    totalAmount: { $sum: "$amount" },        // Сумма заказов\n    orderCount: { $count: {} },              // Количество\n    avgAmount: { $avg: "$amount" },          // Среднее\n    maxOrder: { $max: "$amount" }            // Максимум\n  }},\n  { $sort: { totalAmount: -1 } },            // Сортировка\n  { $limit: 10 },                            // Топ-10\n  { $lookup: {                               // JOIN с коллекцией users\n    from: "users",\n    localField: "_id",\n    foreignField: "_id",\n    as: "user"\n  }},\n  { $unwind: "$user" },                      // Разворачиваем массив\n  { $project: {                              // Выбор полей\n    userName: "$user.name",\n    totalAmount: 1,\n    orderCount: 1\n  }}\n]);\n\n// Популярные теги\nconst popularTags = await Post.aggregate([\n  { $unwind: "$tags" },                      // Разворачиваем массив tags\n  { $group: { _id: "$tags", count: { $sum: 1 } } },\n  { $sort: { count: -1 } },\n  { $limit: 20 }\n]);\n\n// Статистика по месяцам\nconst monthlySales = await Order.aggregate([\n  { $group: {\n    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },\n    total: { $sum: "$amount" },\n    count: { $count: {} }\n  }},\n  { $sort: { "_id": 1 } }\n]);' }
      ]
    },
    {
      id: 7,
      title: 'Индексы и производительность',
      type: 'theory',
      content: [
        { type: 'text', value: 'Индексы ускоряют поиск в MongoDB. Без индекса MongoDB сканирует все документы (collection scan). С индексом — прямой доступ. Слишком много индексов замедляет запись.' },
        { type: 'heading', value: 'Создание индексов' },
        { type: 'code', language: 'javascript', value: 'const mongoose = require("mongoose");\n\nconst postSchema = new mongoose.Schema({\n  title: String,\n  body: String,\n  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },\n  tags: [String],\n  views: { type: Number, default: 0 },\n  createdAt: { type: Date, default: Date.now }\n});\n\n// Индексы в схеме\npostSchema.index({ author: 1 });              // Простой индекс\npostSchema.index({ createdAt: -1 });           // Убывающий\npostSchema.index({ author: 1, createdAt: -1 }); // Составной\npostSchema.index({ title: "text", body: "text" }); // Текстовый поиск\npostSchema.index({ slug: 1 }, { unique: true }); // Уникальный\n\n// TTL индекс — автоудаление через время\nconst sessionSchema = new mongoose.Schema({\n  token: String,\n  createdAt: { type: Date, default: Date.now }\n});\nsessionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 }); // Удалить через 1 час\n\n// Текстовый поиск\nawait Post.find({ $text: { $search: "mongoose mongodb" } });\n\n// Объяснение запроса (для отладки)\nconst explanation = await Post.find({ author: id }).explain("executionStats");\nconsole.log(explanation.executionStats.totalDocsExamined);' }
      ]
    },
    {
      id: 8,
      title: 'Практика: Блог API с MongoDB',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте REST API для блога с реальной MongoDB через Mongoose. Статьи, авторы, комментарии, populate и пагинация.',
      requirements: [
        'Модели: User (name, email, passwordHash), Post (title, body, author ref, tags[], views)',
        'Виртуальное поле Post.commentsCount',
        'Pre-save хук для хэширования пароля в User',
        'GET /posts — с populate("author", "name email"), пагинация, фильтр по тегу',
        'GET /posts/:id — с populate автора и комментариев',
        'POST /posts — только авторизованные, author берётся из JWT',
        'PUT /posts/:id — только автор поста может редактировать',
        'Текстовый поиск по title и body'
      ],
      hint: 'Определите mongoose схемы с ref для связей. Используйте .populate("author") для получения данных автора. Для пагинации: .skip((page-1)*limit).limit(limit). Индексы ускоряют поиск по часто используемым полям.',
      expectedOutput: 'mongoose.connect() -> "MongoDB подключена"\nPOST /posts -> 201 { _id: "...", title: "...", author: { name: "..." } }\nGET /posts?page=1 -> { posts: [...], total: N, page: 1 }\nGET /posts/:id с populate -> статья с объектом автора вместо id',
      solution: {
        code: '// models/User.js\nconst mongoose = require("mongoose");\nconst bcrypt = require("bcryptjs");\n\nconst userSchema = new mongoose.Schema({\n  name: { type: String, required: true },\n  email: { type: String, required: true, unique: true, lowercase: true },\n  passwordHash: String\n}, { timestamps: true });\n\nuserSchema.pre("save", async function(next) {\n  if (this.isModified("password") && this.password) {\n    this.passwordHash = await bcrypt.hash(this.password, 12);\n    this.password = undefined;\n  }\n  next();\n});\n\nuserSchema.methods.comparePassword = function(pwd) {\n  return bcrypt.compare(pwd, this.passwordHash);\n};\n\nmodule.exports = mongoose.model("User", userSchema);\n\n// models/Post.js\nconst postSchema = new mongoose.Schema({\n  title: { type: String, required: true },\n  body: { type: String, required: true },\n  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },\n  tags: [String],\n  views: { type: Number, default: 0 },\n  comments: [{ text: String, user: { type: mongoose.Schema.Types.ObjectId, ref: "User" } }]\n}, { timestamps: true, toJSON: { virtuals: true } });\n\npostSchema.virtual("commentsCount").get(function() { return this.comments.length; });\npostSchema.index({ title: "text", body: "text" });\npostSchema.index({ author: 1, createdAt: -1 });\n\nmodule.exports = mongoose.model("Post", postSchema);\n\n// routes/posts.js\nconst Post = require("../models/Post");\nconst express = require("express");\nconst router = express.Router();\n\nrouter.get("/", async (req, res) => {\n  const { tag, search, page = 1, limit = 10 } = req.query;\n  const filter = {};\n  if (tag) filter.tags = tag;\n  if (search) filter.$text = { $search: search };\n  const [posts, total] = await Promise.all([\n    Post.find(filter).populate("author", "name email").sort({ createdAt: -1 }).skip((+page-1)*+limit).limit(+limit),\n    Post.countDocuments(filter)\n  ]);\n  res.json({ success: true, data: posts, pagination: { page: +page, total, totalPages: Math.ceil(total/+limit) } });\n});\n\nrouter.post("/", authenticate, async (req, res) => {\n  const post = await Post.create({ ...req.body, author: req.user.userId });\n  res.status(201).json({ success: true, data: post });\n});\n\nmodule.exports = router;',
        language: 'javascript'
      },
      explanation: 'Pre-save хук использует this.isModified("password") — хэширование происходит только если поле password изменилось, а не при каждом сохранении. Виртуальное поле commentsCount вычисляется из this.comments.length и не хранится в БД. Текстовый индекс по title и body позволяет $text поиск. Promise.all для параллельного получения постов и их общего количества — вдвое быстрее чем последовательно. populate("author", "name email") заменяет ObjectId объектом пользователя, но только с полями name и email.'
    }
  ]
};
