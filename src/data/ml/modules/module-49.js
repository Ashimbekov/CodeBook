export default {
  id: 49,
  title: 'Проект: Рекомендательная система фильмов',
  description: 'Рекомендательная система на MovieLens: collaborative filtering, SVD, content-based и гибридный подход с веб-интерфейсом.',
  lessons: [
    {
      id: 1,
      title: 'Описание проекта: Рекомендательные системы',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: `# Проект: Рекомендательная система фильмов

## Цель проекта

Построить рекомендательную систему, которая предлагает пользователям фильмы на основе их предпочтений и поведения других пользователей.

## Бизнес-значение

Рекомендательные системы генерируют:
- **35%** выручки Amazon (рекомендации товаров)
- **80%** просмотров Netflix (персональные рекомендации)
- **60%** кликов YouTube (recommended videos)

## Типы рекомендательных систем

### 1. Collaborative Filtering (совместная фильтрация)
Основа: "похожие пользователи любят похожие фильмы"

- **User-based CF**: найти похожих пользователей → рекомендовать их фильмы
- **Item-based CF**: найти похожие фильмы → рекомендовать пользователю

### 2. Content-based Filtering (на основе контента)
Основа: "если вам нравятся боевики, предложим другие боевики"

- Используем описания, жанры, актёров
- TF-IDF на описаниях фильмов

### 3. Hybrid (гибридный)
Комбинация collaborative + content-based = лучший результат

## Датасет MovieLens

\`\`\`python
# MovieLens 100k: 100,000 рейтингов, 943 пользователя, 1682 фильма
# Скачать: https://grouplens.org/datasets/movielens/

import pandas as pd

ratings = pd.read_csv('ratings.csv')
# userId, movieId, rating (1-5), timestamp

movies = pd.read_csv('movies.csv')
# movieId, title, genres
\`\`\`

## Метрики рекомендательных систем

| Метрика | Описание | Формула |
|---------|----------|---------|
| RMSE | Ошибка предсказания рейтинга | √(Σ(r-r̂)²/n) |
| MAE | Средняя абсолютная ошибка | Σ|r-r̂|/n |
| Precision@K | Доля релевантных в топ-K | rel_in_topK / K |
| Recall@K | Покрытие релевантных | rel_in_topK / total_rel |
| NDCG | Качество ранжирования | Учитывает позицию |

## План проекта

1. **User-based CF** — рекомендации по похожим пользователям
2. **Matrix Factorization (SVD)** — факторизация матрицы рейтингов
3. **Content-based** — рекомендации по описаниям фильмов
4. **Гибридная модель** — комбинация подходов
5. **Веб-интерфейс** — интерактивные рекомендации`
        }
      ]
    },
    {
      id: 2,
      title: 'Collaborative Filtering',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: `# Collaborative Filtering: теория

## Принцип работы

Collaborative Filtering (CF) основан на коллективном мнении пользователей:
- Не нужно знать содержание фильма
- Достаточно матрицы "пользователь × фильм" с рейтингами

## User-based CF

**Шаг 1**: Построить матрицу рейтингов

\`\`\`
          Film1  Film2  Film3  Film4
User_A:    5      3      -      4
User_B:    4      -      2      5
User_C:    -      3      5      -
User_D:    5      4      -      4
\`\`\`

**Шаг 2**: Найти похожих пользователей (cosine similarity)

\`\`\`python
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Матрица рейтингов (NaN -> 0 для вычисления сходства)
user_similarity = cosine_similarity(user_item_matrix.fillna(0))
# similarity(User_A, User_D) = 0.98 -> очень похожи
\`\`\`

**Шаг 3**: Предсказать рейтинг

\`\`\`python
def predict_user_based(user_id, item_id, user_sim, ratings_matrix, k=10):
    """Предсказание рейтинга на основе k похожих пользователей."""
    # Найти k похожих пользователей, которые оценили item_id
    sim_scores = user_sim[user_id]
    item_ratings = ratings_matrix[:, item_id]

    # Индексы пользователей, которые оценили фильм
    rated_mask = ~np.isnan(item_ratings)
    if rated_mask.sum() == 0:
        return ratings_matrix[user_id].nanmean()  # fallback

    # Топ-k похожих
    similar_users = np.argsort(sim_scores)[::-1]
    similar_users = [u for u in similar_users
                     if u != user_id and rated_mask[u]][:k]

    if not similar_users:
        return ratings_matrix[user_id].nanmean()

    # Взвешенное среднее
    numerator = sum(sim_scores[u] * item_ratings[u] for u in similar_users)
    denominator = sum(abs(sim_scores[u]) for u in similar_users)

    return numerator / denominator if denominator > 0 else 3.0
\`\`\`

## Item-based CF

Вместо похожих пользователей ищем похожие фильмы:

\`\`\`python
# Транспонированная матрица: строки = фильмы
item_similarity = cosine_similarity(user_item_matrix.T.fillna(0))

def predict_item_based(user_id, item_id, item_sim, ratings_matrix, k=10):
    """Предсказание на основе k похожих фильмов."""
    sim_scores = item_sim[item_id]
    user_ratings = ratings_matrix[user_id]

    rated_items = np.where(~np.isnan(user_ratings))[0]
    rated_items = [i for i in rated_items if i != item_id]

    # Топ-k похожих фильмов, которые пользователь оценил
    similar_items = sorted(rated_items, key=lambda i: sim_scores[i], reverse=True)[:k]

    numerator = sum(sim_scores[i] * user_ratings[i] for i in similar_items)
    denominator = sum(abs(sim_scores[i]) for i in similar_items)

    return numerator / denominator if denominator > 0 else 3.0
\`\`\`

## Преимущества и недостатки

### User-based CF
- ✅ Может обнаружить неожиданные рекомендации
- ❌ Плохо масштабируется (миллионы пользователей)
- ❌ Cold start для новых пользователей

### Item-based CF
- ✅ Лучше масштабируется (фильмов меньше, чем пользователей)
- ✅ Сходство фильмов стабильнее во времени
- ❌ Cold start для новых фильмов`
        }
      ]
    },
    {
      id: 3,
      title: 'Практика: User-based CF',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте User-based Collaborative Filtering с нуля.',
      requirements: [
        'Создайте синтетический датасет: 100 пользователей, 50 фильмов, рейтинги 1-5',
        'Постройте матрицу пользователь-фильм и вычислите cosine similarity',
        'Реализуйте функцию предсказания рейтинга (k ближайших пользователей)',
        'Сгенерируйте топ-5 рекомендаций для конкретного пользователя',
        'Оцените качество через RMSE на тестовой выборке'
      ],
      hint: 'cosine_similarity из sklearn.metrics.pairwise. Заполняйте NaN нулями для similarity, но используйте маску для предсказаний. k=10-20 обычно оптимально.',
      expectedOutput: 'User-based Collaborative Filtering:\n  Users: 100, Movies: 50\n  Ratings: XXXX\n  Sparsity: XX.X%\n\nUser 0 - Топ-5 рекомендаций:\n  Movie XX: predicted=X.XX\n  ...\n\nRMSE on test: X.XX',
      solution: `import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

np.random.seed(42)

# Создание синтетического датасета
n_users, n_movies = 100, 50
n_ratings = 3000

# Скрытые предпочтения пользователей (5 латентных факторов)
user_factors = np.random.randn(n_users, 5)
movie_factors = np.random.randn(n_movies, 5)

# Генерация рейтингов
true_ratings = user_factors @ movie_factors.T + 3  # базовый рейтинг ~3
true_ratings = true_ratings.clip(1, 5)

# Выбираем случайные пары (user, movie) для рейтингов
all_pairs = [(u, m) for u in range(n_users) for m in range(n_movies)]
rated_pairs = np.random.choice(len(all_pairs), n_ratings, replace=False)

# Матрица рейтингов с пропусками
ratings_matrix = np.full((n_users, n_movies), np.nan)
for idx in rated_pairs:
    u, m = all_pairs[idx]
    noise = np.random.normal(0, 0.5)
    ratings_matrix[u, m] = np.clip(true_ratings[u, m] + noise, 1, 5)

# Округляем до целых
ratings_matrix = np.where(np.isnan(ratings_matrix), np.nan, np.round(ratings_matrix))

movie_names = [f"Movie_{i}" for i in range(n_movies)]
total_ratings = np.sum(~np.isnan(ratings_matrix))
sparsity = 1 - total_ratings / (n_users * n_movies)

print("User-based Collaborative Filtering:")
print(f"  Users: {n_users}, Movies: {n_movies}")
print(f"  Ratings: {int(total_ratings)}")
print(f"  Sparsity: {sparsity*100:.1f}%")

# Cosine Similarity между пользователями
matrix_filled = np.nan_to_num(ratings_matrix, nan=0)
user_sim = cosine_similarity(matrix_filled)
np.fill_diagonal(user_sim, 0)  # исключаем сходство с самим собой

# Предсказание рейтинга
def predict_rating(user_id, item_id, user_sim, ratings, k=15):
    sim_scores = user_sim[user_id]
    item_ratings = ratings[:, item_id]
    rated_mask = ~np.isnan(item_ratings)

    if rated_mask.sum() == 0:
        return np.nanmean(ratings[user_id])

    candidates = np.where(rated_mask)[0]
    candidates = candidates[candidates != user_id]

    if len(candidates) == 0:
        return np.nanmean(ratings[user_id])

    # Топ-k по сходству
    top_k = sorted(candidates, key=lambda u: sim_scores[u], reverse=True)[:k]

    numerator = sum(sim_scores[u] * item_ratings[u] for u in top_k)
    denominator = sum(abs(sim_scores[u]) for u in top_k)

    if denominator == 0:
        return np.nanmean(ratings[user_id])
    return np.clip(numerator / denominator, 1, 5)

# Рекомендации для пользователя 0
user_id = 0
unrated = np.where(np.isnan(ratings_matrix[user_id]))[0]
predictions = []
for m in unrated:
    pred = predict_rating(user_id, m, user_sim, ratings_matrix)
    predictions.append((m, pred))

predictions.sort(key=lambda x: x[1], reverse=True)

print(f"\\nUser {user_id} - Топ-5 рекомендаций:")
for movie_id, pred_rating in predictions[:5]:
    print(f"  {movie_names[movie_id]}: predicted={pred_rating:.2f}")

# Оценка RMSE на тестовой выборке
test_size = 500
test_indices = np.random.choice(len(rated_pairs), min(test_size, len(rated_pairs)), replace=False)

errors = []
for idx in test_indices:
    u, m = all_pairs[rated_pairs[idx]]
    actual = ratings_matrix[u, m]
    # Временно убираем рейтинг
    temp = ratings_matrix[u, m]
    ratings_matrix[u, m] = np.nan
    predicted = predict_rating(u, m, user_sim, ratings_matrix)
    ratings_matrix[u, m] = temp
    errors.append((actual - predicted) ** 2)

rmse = np.sqrt(np.mean(errors))
print(f"\\nRMSE on test ({len(errors)} samples): {rmse:.4f}")

# Статистика сходства
print(f"\\nUser Similarity stats:")
sim_values = user_sim[user_sim > 0]
print(f"  Mean: {sim_values.mean():.4f}")
print(f"  Max: {sim_values.max():.4f}")
print(f"  Min: {sim_values.min():.4f}")`,
      explanation: 'User-based CF находит пользователей с похожими вкусами и использует их рейтинги для предсказания. Cosine similarity измеряет угол между векторами рейтингов — чем ближе к 1, тем похожее вкусы. k=15 ближайших соседей — баланс между точностью и обобщением.'
    },
    {
      id: 4,
      title: 'Matrix Factorization: SVD',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: `# Matrix Factorization: SVD для рекомендаций

## Идея Matrix Factorization

Разложить матрицу рейтингов R (users × items) на произведение двух матриц:

\`\`\`
R ≈ U × V^T

R: (n_users × n_items) — матрица рейтингов
U: (n_users × k) — латентные факторы пользователей
V: (n_items × k) — латентные факторы фильмов
k: количество латентных факторов (обычно 20-100)
\`\`\`

Латентные факторы могут означать: жанр, эпоха, настроение, стиль...

## SVD (Singular Value Decomposition)

\`\`\`python
import numpy as np
from scipy.sparse.linalg import svds

# Заполняем пропуски средними по пользователям
R = ratings_matrix.copy()
user_means = np.nanmean(R, axis=1)
R_filled = R.copy()
for i in range(len(R)):
    R_filled[i] = np.where(np.isnan(R[i]), user_means[i], R[i])

# SVD разложение
U, sigma, Vt = svds(R_filled, k=20)

# Восстановление матрицы
sigma_diag = np.diag(sigma)
predicted_ratings = U @ sigma_diag @ Vt + user_means.reshape(-1, 1)
predicted_ratings = np.clip(predicted_ratings, 1, 5)
\`\`\`

## Surprise Library

Специализированная библиотека для рекомендательных систем:

\`\`\`python
from surprise import SVD, Dataset, Reader, accuracy
from surprise.model_selection import cross_validate

# Подготовка данных
reader = Reader(rating_scale=(1, 5))
data = Dataset.load_from_df(
    ratings_df[['userId', 'movieId', 'rating']], reader
)

# SVD модель
model = SVD(n_factors=50, n_epochs=20, lr_all=0.005, reg_all=0.02)

# Cross-validation
results = cross_validate(model, data, measures=['RMSE', 'MAE'], cv=5)
print(f"RMSE: {results['test_rmse'].mean():.4f}")
print(f"MAE: {results['test_mae'].mean():.4f}")

# Обучение
trainset = data.build_full_trainset()
model.fit(trainset)

# Предсказание
prediction = model.predict(uid='user1', iid='movie42')
print(f"Predicted rating: {prediction.est:.2f}")
\`\`\`

## ALS (Alternating Least Squares)

Оптимизация по очереди U и V:

\`\`\`python
# Фиксируем V, оптимизируем U
# Фиксируем U, оптимизируем V
# Повторяем до сходимости

from surprise import SVDpp, NMF

# SVD++ (учитывает неявные рейтинги)
model = SVDpp(n_factors=50, n_epochs=20)

# NMF (неотрицательная факторизация)
model = NMF(n_factors=50, n_epochs=50)
\`\`\`

## Преимущества SVD

1. **Масштабируемость** — работает с миллионами рейтингов
2. **Качество** — выигрывает Netflix Prize (Netflix Competition)
3. **Латентные факторы** — автоматически находит скрытые паттерны
4. **Регуляризация** — борется с переобучением

## SVD vs CF

| Аспект | User-based CF | SVD |
|--------|--------------|-----|
| Масштабируемость | O(n²) | O(n·k) |
| Cold start | Плохо | Плохо |
| Качество | Хорошо | Лучше |
| Интерпретируемость | Высокая | Средняя |
| Обучение | Нет | Да |`
        }
      ]
    },
    {
      id: 5,
      title: 'Практика: SVD рекомендации',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте рекомендательную систему на основе SVD факторизации.',
      requirements: [
        'Создайте синтетический датасет рейтингов (200 пользователей, 100 фильмов)',
        'Реализуйте SVD через scipy.sparse.linalg.svds',
        'Предскажите рейтинги для всех пар (user, movie)',
        'Сгенерируйте топ-10 рекомендаций для 3 пользователей',
        'Оцените RMSE и сравните с User-based CF'
      ],
      hint: 'svds(matrix, k=20) для SVD. Заполните NaN средними по пользователям перед SVD. Не рекомендуйте фильмы, которые пользователь уже смотрел.',
      expectedOutput: 'SVD Recommender System:\n  Users: 200, Movies: 100\n  Latent factors: 20\n\nUser 0 - Топ-10 рекомендаций:\n  Movie XX: predicted=X.XX\n  ...\n\nRMSE:\n  SVD: X.XX\n  User-based CF: X.XX',
      solution: `import numpy as np
from scipy.sparse.linalg import svds
from sklearn.metrics.pairwise import cosine_similarity

np.random.seed(42)

# Синтетический датасет
n_users, n_movies = 200, 100
n_factors_true = 5

# Скрытые факторы
user_prefs = np.random.randn(n_users, n_factors_true) * 0.5
movie_attrs = np.random.randn(n_movies, n_factors_true) * 0.5

# Истинные рейтинги
true_ratings = user_prefs @ movie_attrs.T + 3.5
true_ratings = true_ratings.clip(1, 5)

# Наблюдаемые рейтинги (60% заполнены)
observed_mask = np.random.random((n_users, n_movies)) < 0.6
ratings_matrix = np.where(observed_mask, true_ratings + np.random.normal(0, 0.3, (n_users, n_movies)), np.nan)
ratings_matrix = np.clip(ratings_matrix, 1, 5)
ratings_matrix = np.where(np.isnan(ratings_matrix), np.nan, np.round(ratings_matrix, 1))

movie_names = [f"Movie_{i}" for i in range(n_movies)]
total = np.sum(~np.isnan(ratings_matrix))

print("SVD Recommender System:")
print(f"  Users: {n_users}, Movies: {n_movies}")
print(f"  Ratings: {int(total)}")
print(f"  Sparsity: {1 - total/(n_users*n_movies):.1%}")

# === SVD ===
k = 20
print(f"  Latent factors: {k}")

# Заполнение пропусков средними по пользователям
user_means = np.nanmean(ratings_matrix, axis=1)
R_filled = ratings_matrix.copy()
for i in range(n_users):
    R_filled[i] = np.where(np.isnan(R_filled[i]), user_means[i], R_filled[i])

# SVD разложение
U, sigma, Vt = svds(R_filled, k=k)
sigma_diag = np.diag(sigma)

# Предсказания
predicted_svd = U @ sigma_diag @ Vt
predicted_svd = np.clip(predicted_svd, 1, 5)

# Рекомендации для пользователей
for user_id in [0, 50, 100]:
    unrated = np.where(np.isnan(ratings_matrix[user_id]))[0]
    preds = [(m, predicted_svd[user_id, m]) for m in unrated]
    preds.sort(key=lambda x: x[1], reverse=True)

    print(f"\\nUser {user_id} - Топ-10 рекомендаций:")
    already_rated = np.sum(~np.isnan(ratings_matrix[user_id]))
    print(f"  (уже оценил {already_rated} фильмов)")
    for movie_id, pred in preds[:10]:
        print(f"  {movie_names[movie_id]}: predicted={pred:.2f}")

# === Сравнение с User-based CF ===
# User-based CF
matrix_filled_0 = np.nan_to_num(ratings_matrix, nan=0)
user_sim = cosine_similarity(matrix_filled_0)
np.fill_diagonal(user_sim, 0)

def predict_cf(user_id, item_id, user_sim, ratings, k=15):
    sim_scores = user_sim[user_id]
    item_ratings = ratings[:, item_id]
    rated_mask = ~np.isnan(item_ratings)
    candidates = np.where(rated_mask)[0]
    candidates = candidates[candidates != user_id]
    if len(candidates) == 0:
        return np.nanmean(ratings[user_id])
    top_k = sorted(candidates, key=lambda u: sim_scores[u], reverse=True)[:k]
    num = sum(sim_scores[u] * item_ratings[u] for u in top_k)
    den = sum(abs(sim_scores[u]) for u in top_k)
    return np.clip(num / den, 1, 5) if den > 0 else np.nanmean(ratings[user_id])

# RMSE на выборке
test_pairs = []
for u in range(n_users):
    for m in range(n_movies):
        if not np.isnan(ratings_matrix[u, m]):
            test_pairs.append((u, m))

sample_idx = np.random.choice(len(test_pairs), min(2000, len(test_pairs)), replace=False)
test_sample = [test_pairs[i] for i in sample_idx]

svd_errors, cf_errors = [], []
for u, m in test_sample:
    actual = ratings_matrix[u, m]
    svd_errors.append((actual - predicted_svd[u, m]) ** 2)
    cf_pred = predict_cf(u, m, user_sim, ratings_matrix)
    cf_errors.append((actual - cf_pred) ** 2)

rmse_svd = np.sqrt(np.mean(svd_errors))
rmse_cf = np.sqrt(np.mean(cf_errors))

print(f"\\nRMSE ({len(test_sample)} samples):")
print(f"  SVD (k={k}): {rmse_svd:.4f}")
print(f"  User-based CF: {rmse_cf:.4f}")
print(f"  Улучшение SVD: {(rmse_cf - rmse_svd) / rmse_cf * 100:.1f}%")`,
      explanation: 'SVD раскладывает матрицу рейтингов на латентные факторы пользователей и фильмов. 20 факторов обычно достаточно для захвата основных паттернов. SVD масштабируется лучше CF и обычно даёт меньший RMSE. Ключ — правильное заполнение пропусков перед SVD (средними по пользователям).'
    },
    {
      id: 6,
      title: 'Content-based Filtering',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: `# Content-based Filtering

## Принцип

Рекомендуем фильмы, **похожие по содержанию** на те, что пользователь уже оценил высоко.

Используем:
- Жанры фильмов
- Описания / синопсисы (TF-IDF)
- Актёры, режиссёры
- Теги и ключевые слова

## Шаг 1: Представление фильмов

\`\`\`python
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer

movies = pd.DataFrame({
    'movieId': range(10),
    'title': ['The Matrix', 'Inception', 'Toy Story', ...],
    'genres': ['Action|Sci-Fi', 'Action|Sci-Fi|Thriller', 'Animation|Comedy', ...],
    'description': ['A hacker discovers reality...', ...]
})

# TF-IDF на жанрах
tfidf_genres = TfidfVectorizer()
genre_features = tfidf_genres.fit_transform(movies['genres'].str.replace('|', ' '))

# TF-IDF на описаниях
tfidf_desc = TfidfVectorizer(max_features=5000, stop_words='english')
desc_features = tfidf_desc.fit_transform(movies['description'])
\`\`\`

## Шаг 2: Сходство фильмов

\`\`\`python
from sklearn.metrics.pairwise import cosine_similarity

# Сходство по жанрам
genre_sim = cosine_similarity(genre_features)

# Сходство по описаниям
desc_sim = cosine_similarity(desc_features)

# Комбинированное сходство
combined_sim = 0.4 * genre_sim + 0.6 * desc_sim
\`\`\`

## Шаг 3: Рекомендации для пользователя

\`\`\`python
def content_based_recommend(user_id, ratings, movie_sim, n=10):
    """Рекомендации на основе контента."""
    # Фильмы, которые пользователь оценил высоко (>= 4)
    user_ratings = ratings[user_id]
    liked = np.where(user_ratings >= 4)[0]
    unrated = np.where(np.isnan(user_ratings))[0]

    if len(liked) == 0:
        return []

    # Для каждого неоценённого фильма — средневзвешенное сходство
    scores = []
    for movie_id in unrated:
        # Сходство с каждым понравившимся фильмом
        similarities = movie_sim[movie_id, liked]
        weights = user_ratings[liked]
        score = np.average(similarities, weights=weights)
        scores.append((movie_id, score))

    scores.sort(key=lambda x: x[1], reverse=True)
    return scores[:n]
\`\`\`

## Преимущества и недостатки

### Плюсы
- ✅ **Нет cold start для фильмов** — достаточно описания
- ✅ **Прозрачность** — можно объяснить, почему рекомендован
- ✅ **Не нужны другие пользователи** — работает для одного

### Минусы
- ❌ **Ограниченность** — рекомендует только похожее (нет serendipity)
- ❌ **Cold start для пользователей** — нужна история оценок
- ❌ **Качество описаний** — зависит от метаданных

## Пример: рекомендации по жанрам

\`\`\`python
# Пользователь любит: "The Matrix" (Action|Sci-Fi), "Inception" (Action|Sci-Fi|Thriller)
# Похожие по жанрам:
# "Interstellar" (Action|Sci-Fi|Drama) -> sim = 0.82
# "Die Hard" (Action|Thriller) -> sim = 0.71
# "Toy Story" (Animation|Comedy) -> sim = 0.05
\`\`\``
        }
      ]
    },
    {
      id: 7,
      title: 'Практика: Content-based система',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте Content-based рекомендательную систему на основе жанров и описаний фильмов.',
      requirements: [
        'Создайте датасет из 100 фильмов с жанрами и описаниями',
        'Постройте TF-IDF на жанрах и описаниях',
        'Вычислите комбинированное сходство фильмов',
        'Реализуйте функцию рекомендации по профилю пользователя',
        'Покажите "похожие фильмы" для нескольких примеров'
      ],
      hint: 'genres.str.replace("|", " ") для TfidfVectorizer. Комбинированное сходство: 0.4 * genre_sim + 0.6 * desc_sim. Для рекомендаций используйте средневзвешенное сходство.',
      expectedOutput: 'Content-based Recommender:\n  Movies: 100\n  Genre features: XX\n  Description features: XXXX\n\nПохожие на "Action Sci-Fi Movie 0":\n  1. Movie XX (sim=0.XX)\n  ...\n\nРекомендации для пользователя:\n  ...',
      solution: `import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

np.random.seed(42)

# Создание датасета фильмов
genres_list = ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Thriller',
               'Romance', 'Horror', 'Animation', 'Documentary', 'Adventure']
desc_words = {
    'Action': ['fight', 'battle', 'hero', 'weapon', 'explosion', 'chase', 'warrior', 'mission'],
    'Comedy': ['funny', 'laugh', 'joke', 'humor', 'hilarious', 'comedy', 'amusing', 'witty'],
    'Drama': ['emotional', 'struggle', 'family', 'relationship', 'life', 'journey', 'heart', 'deep'],
    'Sci-Fi': ['space', 'future', 'technology', 'alien', 'robot', 'universe', 'science', 'quantum'],
    'Thriller': ['suspense', 'mystery', 'danger', 'dark', 'twist', 'tension', 'crime', 'detective'],
    'Romance': ['love', 'passion', 'romantic', 'heart', 'couple', 'relationship', 'feeling', 'kiss'],
    'Horror': ['scary', 'ghost', 'monster', 'fear', 'nightmare', 'creepy', 'dark', 'terror'],
    'Animation': ['animated', 'cartoon', 'colorful', 'magical', 'fantasy', 'adventure', 'fun', 'dream'],
    'Documentary': ['real', 'truth', 'story', 'history', 'world', 'nature', 'people', 'society'],
    'Adventure': ['quest', 'explore', 'journey', 'discovery', 'treasure', 'expedition', 'wild', 'brave']
}

n_movies = 100
movies = []
for i in range(n_movies):
    n_genres = np.random.choice([1, 2, 3], p=[0.3, 0.5, 0.2])
    movie_genres = list(np.random.choice(genres_list, n_genres, replace=False))

    words = []
    for g in movie_genres:
        n_words = np.random.randint(3, 6)
        words.extend(np.random.choice(desc_words[g], n_words))
    words.extend(np.random.choice(['movie', 'film', 'story', 'great', 'amazing', 'watch'], 3))
    description = ' '.join(words)

    movies.append({
        'id': i,
        'title': f"{' '.join(movie_genres)} Movie {i}",
        'genres': '|'.join(movie_genres),
        'description': description
    })

print("Content-based Recommender:")
print(f"  Movies: {len(movies)}")

# TF-IDF на жанрах
genre_texts = [m['genres'].replace('|', ' ') for m in movies]
tfidf_genres = TfidfVectorizer()
genre_features = tfidf_genres.fit_transform(genre_texts)
print(f"  Genre features: {genre_features.shape[1]}")

# TF-IDF на описаниях
desc_texts = [m['description'] for m in movies]
tfidf_desc = TfidfVectorizer(max_features=1000)
desc_features = tfidf_desc.fit_transform(desc_texts)
print(f"  Description features: {desc_features.shape[1]}")

# Комбинированное сходство
genre_sim = cosine_similarity(genre_features)
desc_sim = cosine_similarity(desc_features)
combined_sim = 0.4 * genre_sim + 0.6 * desc_sim
np.fill_diagonal(combined_sim, 0)

# Похожие фильмы
for movie_idx in [0, 25, 50]:
    sim_scores = combined_sim[movie_idx]
    top_similar = np.argsort(sim_scores)[::-1][:5]
    print(f"\\nПохожие на '{movies[movie_idx]['title']}':")
    print(f"  Жанры: {movies[movie_idx]['genres']}")
    for rank, idx in enumerate(top_similar, 1):
        print(f"  {rank}. {movies[idx]['title']} (sim={sim_scores[idx]:.4f})")

# Рекомендации для пользователя
# Пользователь оценил фильмы
user_ratings = np.full(n_movies, np.nan)
# Выбираем 10 фильмов и ставим рейтинги
rated_movies = np.random.choice(n_movies, 10, replace=False)
for m in rated_movies:
    user_ratings[m] = np.random.choice([3, 4, 5], p=[0.3, 0.4, 0.3])

liked = np.where(user_ratings >= 4)[0]
unrated = np.where(np.isnan(user_ratings))[0]

print(f"\\nПрофиль пользователя:")
print(f"  Оценено: {(~np.isnan(user_ratings)).sum()} фильмов")
print(f"  Понравились (>=4):")
for m in liked:
    print(f"    {movies[m]['title']} ({user_ratings[m]:.0f}/5)")

# Рекомендации
scores = []
for movie_id in unrated:
    if len(liked) > 0:
        similarities = combined_sim[movie_id, liked]
        weights = user_ratings[liked]
        score = np.average(similarities, weights=weights)
    else:
        score = 0
    scores.append((movie_id, score))

scores.sort(key=lambda x: x[1], reverse=True)
print(f"\\nТоп-5 рекомендаций:")
for movie_id, score in scores[:5]:
    print(f"  {movies[movie_id]['title']} (score={score:.4f})")
    print(f"    Жанры: {movies[movie_id]['genres']}")`,
      explanation: 'Content-based фильтрация анализирует характеристики фильмов (жанры, описания). TF-IDF преобразует текст в числовые векторы. Cosine similarity измеряет близость фильмов в пространстве признаков. Комбинация жанров и описаний (0.4/0.6) даёт более точные рекомендации, чем каждый по отдельности.'
    },
    {
      id: 8,
      title: 'Гибридная модель',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: `# Гибридная рекомендательная система

## Зачем комбинировать?

Каждый подход имеет слабости:
- **CF** — cold start проблема (новые пользователи/фильмы)
- **Content-based** — ограниченность (только похожий контент)
- **SVD** — не учитывает контент фильмов

Гибрид решает эти проблемы, комбинируя преимущества.

## Стратегии гибридизации

### 1. Weighted Hybrid
Взвешенная комбинация предсказаний:

\`\`\`python
def hybrid_predict(user, item, cf_model, cb_model, svd_model,
                   w_cf=0.4, w_cb=0.3, w_svd=0.3):
    pred_cf = cf_model.predict(user, item)
    pred_cb = cb_model.predict(user, item)
    pred_svd = svd_model.predict(user, item)
    return w_cf * pred_cf + w_cb * pred_cb + w_svd * pred_svd
\`\`\`

### 2. Switching Hybrid
Переключение между моделями по ситуации:

\`\`\`python
def switching_hybrid(user, item, cf_model, cb_model):
    # Если достаточно данных о пользователе — используем CF
    if user.n_ratings >= 20:
        return cf_model.predict(user, item)
    # Иначе — content-based (не требует истории)
    return cb_model.predict(user, item)
\`\`\`

### 3. Feature Augmentation
Один метод создаёт признаки для другого:

\`\`\`python
# Используем SVD latent factors как признаки
user_features = svd_model.get_user_factors(user)  # (k,)
item_features = svd_model.get_item_factors(item)   # (k,)
content_features = cb_model.get_features(item)     # (d,)

combined_features = np.concatenate([
    user_features, item_features, content_features
])

# Обучаем meta-model (RF, GBT, или нейросеть)
prediction = meta_model.predict(combined_features)
\`\`\`

### 4. Meta-learning (Stacking)
Мета-модель учится комбинировать предсказания:

\`\`\`python
from sklearn.ensemble import GradientBoostingRegressor

# Признаки = предсказания базовых моделей
X_meta = np.column_stack([
    cf_predictions,
    svd_predictions,
    content_predictions,
    user_avg_rating,
    item_avg_rating,
    n_user_ratings,
    n_item_ratings
])

# Мета-модель
meta = GradientBoostingRegressor()
meta.fit(X_meta_train, y_train)
\`\`\`

## Netflix Prize

В 2009 году команда BellKor's Pragmatic Chaos выиграла $1M, используя гибрид из:
- SVD (несколько вариаций)
- Restricted Boltzmann Machines (RBM)
- k-NN collaborative filtering
- Stacking нескольких сотен моделей

**Ключевой урок**: blending (комбинация) моделей — самый надёжный способ улучшить качество.

## Оптимизация весов

\`\`\`python
from scipy.optimize import minimize

def hybrid_rmse(weights, predictions, y_true):
    """RMSE для гибридной модели с данными весами."""
    weights = weights / weights.sum()  # нормализация
    hybrid_pred = sum(w * p for w, p in zip(weights, predictions))
    return np.sqrt(np.mean((y_true - hybrid_pred) ** 2))

# Оптимизация весов
result = minimize(
    hybrid_rmse,
    x0=np.array([0.33, 0.33, 0.34]),  # начальные веса
    args=(predictions_list, y_true),
    method='Nelder-Mead',
    bounds=[(0, 1), (0, 1), (0, 1)]
)
optimal_weights = result.x / result.x.sum()
\`\`\``
        }
      ]
    },
    {
      id: 9,
      title: 'Практика: Гибридная рекомендательная система',
      type: 'practice',
      difficulty: 'hard',
      description: 'Постройте гибридную рекомендательную систему, комбинируя CF, SVD и Content-based.',
      requirements: [
        'Создайте датасет: 150 пользователей, 80 фильмов с жанрами и рейтингами',
        'Реализуйте 3 базовых подхода: User-based CF, SVD, Content-based',
        'Создайте weighted hybrid с оптимизацией весов',
        'Сравните RMSE всех подходов (включая гибрид)',
        'Покажите финальные рекомендации для 3 пользователей'
      ],
      hint: 'scipy.optimize.minimize для оптимизации весов. Нормализуйте веса: w = w / w.sum(). Используйте кросс-валидацию для честного сравнения.',
      expectedOutput: 'Hybrid Recommender System:\n  Users: 150, Movies: 80\n\nRMSE Comparison:\n  User-based CF: X.XX\n  SVD: X.XX\n  Content-based: X.XX\n  Hybrid: X.XX\n\nОптимальные веса: CF=0.XX, SVD=0.XX, CB=0.XX\n\nРекомендации для пользователей:\n  ...',
      solution: `import numpy as np
from scipy.sparse.linalg import svds
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
from scipy.optimize import minimize

np.random.seed(42)

# Датасет
n_users, n_movies = 150, 80
genres_list = ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Thriller', 'Romance', 'Horror', 'Adventure']

# Фильмы с жанрами
movie_genres = []
movie_genre_text = []
for i in range(n_movies):
    n_g = np.random.choice([1, 2, 3], p=[0.2, 0.5, 0.3])
    g = list(np.random.choice(genres_list, n_g, replace=False))
    movie_genres.append(g)
    movie_genre_text.append(' '.join(g))

# Латентные факторы
user_factors = np.random.randn(n_users, 5)
movie_factors = np.random.randn(n_movies, 5)
true_R = user_factors @ movie_factors.T + 3.5
true_R = true_R.clip(1, 5)

# Наблюдаемая матрица (55% заполнена)
mask = np.random.random((n_users, n_movies)) < 0.55
R = np.where(mask, np.round(true_R + np.random.normal(0, 0.4, true_R.shape), 1).clip(1, 5), np.nan)

total = np.sum(~np.isnan(R))
print("Hybrid Recommender System:")
print(f"  Users: {n_users}, Movies: {n_movies}")
print(f"  Ratings: {int(total)}, Sparsity: {1-total/(n_users*n_movies):.1%}")

# Тестовая выборка
test_pairs = [(u, m) for u in range(n_users) for m in range(n_movies) if not np.isnan(R[u, m])]
test_idx = np.random.choice(len(test_pairs), min(2000, len(test_pairs)), replace=False)
test_set = [test_pairs[i] for i in test_idx]
y_true = np.array([R[u, m] for u, m in test_set])

# === 1. User-based CF ===
R_filled_0 = np.nan_to_num(R, nan=0)
user_sim = cosine_similarity(R_filled_0)
np.fill_diagonal(user_sim, 0)

def predict_cf(u, m, k=15):
    sims = user_sim[u]
    item_r = R[:, m]
    rated = np.where(~np.isnan(item_r) & (np.arange(n_users) != u))[0]
    if len(rated) == 0:
        return np.nanmean(R[u]) if np.any(~np.isnan(R[u])) else 3.0
    top_k = sorted(rated, key=lambda x: sims[x], reverse=True)[:k]
    num = sum(sims[i] * item_r[i] for i in top_k)
    den = sum(abs(sims[i]) for i in top_k)
    return np.clip(num / den, 1, 5) if den > 0 else 3.0

cf_preds = np.array([predict_cf(u, m) for u, m in test_set])

# === 2. SVD ===
user_means = np.nanmean(R, axis=1)
R_svd = R.copy()
for i in range(n_users):
    R_svd[i] = np.where(np.isnan(R_svd[i]), user_means[i], R_svd[i])

U, sigma, Vt = svds(R_svd, k=15)
predicted_svd_full = np.clip(U @ np.diag(sigma) @ Vt, 1, 5)
svd_preds = np.array([predicted_svd_full[u, m] for u, m in test_set])

# === 3. Content-based ===
tfidf = TfidfVectorizer()
genre_features = tfidf.fit_transform(movie_genre_text)
movie_sim = cosine_similarity(genre_features)
np.fill_diagonal(movie_sim, 0)

def predict_cb(u, m):
    user_r = R[u]
    rated = np.where(~np.isnan(user_r))[0]
    rated = rated[rated != m]
    if len(rated) == 0:
        return np.nanmean(R[u]) if np.any(~np.isnan(R[u])) else 3.0
    sims = movie_sim[m, rated]
    weights = user_r[rated]
    if sims.sum() == 0:
        return np.nanmean(R[u])
    return np.clip(np.average(weights, weights=np.abs(sims) + 1e-6), 1, 5)

cb_preds = np.array([predict_cb(u, m) for u, m in test_set])

# === RMSE по отдельности ===
def rmse(pred, true):
    return np.sqrt(np.mean((true - pred) ** 2))

rmse_cf = rmse(cf_preds, y_true)
rmse_svd = rmse(svd_preds, y_true)
rmse_cb = rmse(cb_preds, y_true)

print(f"\\nRMSE Comparison:")
print(f"  User-based CF: {rmse_cf:.4f}")
print(f"  SVD:           {rmse_svd:.4f}")
print(f"  Content-based: {rmse_cb:.4f}")

# === Гибрид: оптимизация весов ===
def hybrid_rmse(weights):
    w = np.abs(weights)
    w = w / w.sum()
    hybrid = w[0] * cf_preds + w[1] * svd_preds + w[2] * cb_preds
    return rmse(hybrid, y_true)

result = minimize(hybrid_rmse, x0=[0.33, 0.33, 0.34], method='Nelder-Mead')
optimal_w = np.abs(result.x)
optimal_w = optimal_w / optimal_w.sum()

hybrid_preds = optimal_w[0] * cf_preds + optimal_w[1] * svd_preds + optimal_w[2] * cb_preds
rmse_hybrid = rmse(hybrid_preds, y_true)

print(f"  Hybrid:        {rmse_hybrid:.4f}")
print(f"\\nОптимальные веса: CF={optimal_w[0]:.2f}, SVD={optimal_w[1]:.2f}, CB={optimal_w[2]:.2f}")

# === Рекомендации ===
for user_id in [0, 50, 100]:
    unrated = np.where(np.isnan(R[user_id]))[0]
    recs = []
    for m in unrated:
        p_cf = predict_cf(user_id, m)
        p_svd = predicted_svd_full[user_id, m]
        p_cb = predict_cb(user_id, m)
        p_hybrid = optimal_w[0] * p_cf + optimal_w[1] * p_svd + optimal_w[2] * p_cb
        recs.append((m, p_hybrid))
    recs.sort(key=lambda x: x[1], reverse=True)

    rated_count = np.sum(~np.isnan(R[user_id]))
    print(f"\\nUser {user_id} (оценил {rated_count} фильмов) - Топ-5:")
    for movie_id, score in recs[:5]:
        genres = ', '.join(movie_genres[movie_id])
        print(f"  Movie_{movie_id} [{genres}]: {score:.2f}")`,
      explanation: 'Гибридная система комбинирует три подхода, используя оптимальные веса. Оптимизация весов через scipy.optimize.minimize находит лучшую комбинацию по RMSE. SVD обычно получает наибольший вес, Content-based помогает при cold start. Гибрид почти всегда лучше любого отдельного метода.'
    },
    {
      id: 10,
      title: 'Практика: Web-интерфейс для рекомендаций',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте веб-приложение с интерактивными рекомендациями фильмов на Streamlit.',
      requirements: [
        'Обучите гибридную рекомендательную модель',
        'Создайте Streamlit приложение с выбором пользователя',
        'Добавьте оценку фильмов пользователем',
        'Покажите топ-10 рекомендаций с жанрами и скорами',
        'Выведите полный код приложения'
      ],
      hint: 'streamlit: st.selectbox для выбора, st.slider для оценки, st.columns для layout. st.metric для отображения скоров. Запуск: streamlit run app.py.',
      expectedOutput: 'Recommendation Web App:\n  Model trained on XXX ratings\n  Users: XXX, Movies: XXX\n\nStreamlit App Features:\n  - User selection\n  - Movie rating\n  - Top-10 recommendations\n  - Similar movies\n\napp.py saved\nRun: streamlit run app.py',
      solution: `import numpy as np
from scipy.sparse.linalg import svds
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer

np.random.seed(42)

# Обучение модели
n_users, n_movies = 100, 60
genres_list = ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Thriller', 'Romance', 'Horror', 'Adventure']

movie_data = []
genre_texts = []
for i in range(n_movies):
    n_g = np.random.choice([1, 2, 3], p=[0.2, 0.5, 0.3])
    g = list(np.random.choice(genres_list, n_g, replace=False))
    title = f"{' '.join(g)} Film {i}"
    movie_data.append({'id': i, 'title': title, 'genres': g})
    genre_texts.append(' '.join(g))

# Рейтинги
user_f = np.random.randn(n_users, 5)
movie_f = np.random.randn(n_movies, 5)
true_R = (user_f @ movie_f.T + 3.5).clip(1, 5)
mask = np.random.random((n_users, n_movies)) < 0.5
R = np.where(mask, np.round(true_R + np.random.normal(0, 0.3, true_R.shape), 1).clip(1, 5), np.nan)

total_ratings = int(np.sum(~np.isnan(R)))
print("Recommendation Web App:")
print(f"  Model trained on {total_ratings} ratings")
print(f"  Users: {n_users}, Movies: {n_movies}")

# SVD
user_means = np.nanmean(R, axis=1)
R_filled = R.copy()
for i in range(n_users):
    R_filled[i] = np.where(np.isnan(R_filled[i]), user_means[i], R_filled[i])

U, sigma, Vt = svds(R_filled, k=15)
svd_predictions = np.clip(U @ np.diag(sigma) @ Vt, 1, 5)

# Content similarity
tfidf = TfidfVectorizer()
genre_features = tfidf.fit_transform(genre_texts)
movie_sim = cosine_similarity(genre_features)

# Рекомендации для демо
def get_recommendations(user_id, top_n=10):
    unrated = np.where(np.isnan(R[user_id]))[0]
    recs = []
    for m in unrated:
        svd_score = svd_predictions[user_id, m]
        # Content boost
        rated = np.where(~np.isnan(R[user_id]))[0]
        if len(rated) > 0:
            liked = rated[R[user_id, rated] >= 4]
            if len(liked) > 0:
                cb_score = movie_sim[m, liked].mean()
            else:
                cb_score = 0
        else:
            cb_score = 0
        final_score = 0.7 * svd_score + 0.3 * (cb_score * 5)
        recs.append((m, final_score))
    recs.sort(key=lambda x: x[1], reverse=True)
    return recs[:top_n]

# Демо рекомендации
for uid in [0, 25, 50]:
    recs = get_recommendations(uid)
    rated_count = np.sum(~np.isnan(R[uid]))
    print(f"\\nUser {uid} (оценил {rated_count} фильмов):")
    for mid, score in recs[:5]:
        genres = ', '.join(movie_data[mid]['genres'])
        print(f"  {movie_data[mid]['title']} [{genres}] score={score:.2f}")

# === Streamlit App Code ===
streamlit_code = '''
import streamlit as st
import numpy as np
import pandas as pd
from scipy.sparse.linalg import svds
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer

st.set_page_config(page_title="Movie Recommender", page_icon="🎬", layout="wide")

@st.cache_data
def load_data():
    """Загрузка и подготовка данных."""
    np.random.seed(42)
    n_users, n_movies = 100, 60
    genres_list = ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Thriller',
                   'Romance', 'Horror', 'Adventure']

    movies = []
    genre_texts = []
    for i in range(n_movies):
        n_g = np.random.choice([1, 2, 3], p=[0.2, 0.5, 0.3])
        g = list(np.random.choice(genres_list, n_g, replace=False))
        movies.append({'id': i, 'title': f"{' '.join(g)} Film {i}", 'genres': g})
        genre_texts.append(' '.join(g))

    user_f = np.random.randn(n_users, 5)
    movie_f = np.random.randn(n_movies, 5)
    true_R = (user_f @ movie_f.T + 3.5).clip(1, 5)
    mask = np.random.random((n_users, n_movies)) < 0.5
    R = np.where(mask, np.round(true_R + np.random.normal(0, 0.3, true_R.shape), 1).clip(1, 5), np.nan)

    # SVD
    user_means = np.nanmean(R, axis=1)
    R_filled = R.copy()
    for i in range(n_users):
        R_filled[i] = np.where(np.isnan(R_filled[i]), user_means[i], R_filled[i])
    U, sigma, Vt = svds(R_filled, k=15)
    svd_pred = np.clip(U @ np.diag(sigma) @ Vt, 1, 5)

    # Content similarity
    tfidf = TfidfVectorizer()
    genre_feat = tfidf.fit_transform(genre_texts)
    movie_sim = cosine_similarity(genre_feat)

    return movies, R, svd_pred, movie_sim, n_users, n_movies

movies, R, svd_pred, movie_sim, n_users, n_movies = load_data()

st.title("Рекомендательная система фильмов")
st.markdown("Гибридная система: SVD + Content-based Filtering")

# Sidebar
st.sidebar.header("Настройки")
user_id = st.sidebar.selectbox("Выберите пользователя", range(n_users))
n_recs = st.sidebar.slider("Количество рекомендаций", 5, 20, 10)

# Профиль пользователя
col1, col2 = st.columns(2)

with col1:
    st.subheader(f"Профиль пользователя {user_id}")
    rated = np.where(~np.isnan(R[user_id]))[0]
    st.metric("Оценено фильмов", len(rated))
    st.metric("Средний рейтинг", f"{np.nanmean(R[user_id]):.1f}")

    st.markdown("**Оценённые фильмы:**")
    for m in rated[:10]:
        rating = R[user_id, m]
        stars = "★" * int(rating) + "☆" * (5 - int(rating))
        st.write(f"{movies[m]['title']} {stars} ({rating:.1f})")

with col2:
    st.subheader("Рекомендации")
    unrated = np.where(np.isnan(R[user_id]))[0]
    recs = []
    for m in unrated:
        svd_s = svd_pred[user_id, m]
        liked = rated[R[user_id, rated] >= 4] if len(rated) > 0 else []
        cb_s = movie_sim[m, liked].mean() if len(liked) > 0 else 0
        score = 0.7 * svd_s + 0.3 * (cb_s * 5)
        recs.append((m, score))
    recs.sort(key=lambda x: x[1], reverse=True)

    for rank, (mid, score) in enumerate(recs[:n_recs], 1):
        genres_str = ", ".join(movies[mid]["genres"])
        st.write(f"**{rank}. {movies[mid]['title']}**")
        st.write(f"   Жанры: {genres_str} | Score: {score:.2f}")
        st.progress(min(score / 5, 1.0))

# Похожие фильмы
st.subheader("Найти похожие фильмы")
selected_movie = st.selectbox("Выберите фильм", range(n_movies),
                               format_func=lambda x: movies[x]["title"])
sim_scores = movie_sim[selected_movie]
top_similar = np.argsort(sim_scores)[::-1][:5]
for idx in top_similar:
    if idx != selected_movie:
        st.write(f"  {movies[idx]['title']} (similarity: {sim_scores[idx]:.4f})")

# Оценить фильм
st.sidebar.markdown("---")
st.sidebar.subheader("Оценить фильм")
movie_to_rate = st.sidebar.selectbox("Фильм", range(n_movies),
                                      format_func=lambda x: movies[x]["title"])
rating = st.sidebar.slider("Оценка", 1, 5, 3)
if st.sidebar.button("Оценить"):
    st.sidebar.success(f"Оценка {rating}/5 для {movies[movie_to_rate]['title']}")
'''

print(f"\\nStreamlit App Features:")
print(f"  - Выбор пользователя")
print(f"  - Профиль с оценёнными фильмами")
print(f"  - Топ-N рекомендаций с прогресс-барами")
print(f"  - Поиск похожих фильмов")
print(f"  - Интерфейс оценки фильмов")

print(f"\\nЗапуск: streamlit run app.py")
print(f"\\n--- Streamlit App Code ---")
print(streamlit_code)`,
      explanation: 'Streamlit позволяет быстро создать интерактивный веб-интерфейс для ML-модели. @st.cache_data кэширует данные для производительности. Приложение показывает профиль пользователя, рекомендации с score и прогресс-барами, поиск похожих фильмов. В production нужно добавить: базу данных, авторизацию, real-time обновление модели.'
    }
  ]
}