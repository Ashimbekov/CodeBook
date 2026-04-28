export default {
  id: 46,
  title: 'Проект: Предсказание цен на жильё',
  description: 'Полный ML-проект от EDA до деплоя: регрессия на данных о жилье с использованием LinearRegression, RandomForest, GradientBoosting, GridSearchCV и Flask API.',
  lessons: [
    {
      id: 1,
      title: 'Описание проекта и датасет',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: `# Проект: Предсказание цен на жильё

## Цель проекта

Построить модель машинного обучения, которая предсказывает стоимость жилья по набору характеристик. Это классическая задача **регрессии** — одна из самых распространённых в Data Science.

## Бизнес-контекст

Предсказание цен на жильё используется:
- **Риэлторами** — для оценки объектов
- **Банками** — для оценки залога при ипотеке
- **Инвесторами** — для анализа рынка
- **Покупателями** — для понимания справедливой цены

## Датасет

В реальных проектах используются датасеты:
- **Boston Housing** — классический (506 объектов, 13 признаков)
- **Ames Housing** — расширенный (2930 объектов, 80 признаков, Kaggle)
- **California Housing** — встроен в sklearn (20640 объектов, 8 признаков)

Мы будем работать с California Housing из sklearn:

\`\`\`python
from sklearn.datasets import fetch_california_housing
data = fetch_california_housing()
print(data.feature_names)
# ['MedInc', 'HouseAge', 'AveRooms', 'AveBedrms',
#  'Population', 'AveOccup', 'Latitude', 'Longitude']
# target: MedHouseVal (медианная стоимость в $100,000)
\`\`\`

## Признаки датасета

| Признак | Описание |
|---------|----------|
| MedInc | Медианный доход в блоке |
| HouseAge | Медианный возраст домов |
| AveRooms | Среднее кол-во комнат |
| AveBedrms | Среднее кол-во спален |
| Population | Население блока |
| AveOccup | Средняя заполненность |
| Latitude | Широта |
| Longitude | Долгота |

## План проекта

1. **EDA** — исследование данных, визуализация
2. **Feature Engineering** — обработка и создание признаков
3. **Моделирование** — обучение и сравнение моделей
4. **Оптимизация** — подбор гиперпараметров
5. **Деплой** — REST API для предсказаний

## Метрики регрессии

- **MAE** (Mean Absolute Error) — средняя абсолютная ошибка
- **RMSE** (Root Mean Squared Error) — корень из средней квадратичной ошибки
- **R²** (коэффициент детерминации) — доля объяснённой дисперсии

\`\`\`python
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import numpy as np

mae = mean_absolute_error(y_true, y_pred)
rmse = np.sqrt(mean_squared_error(y_true, y_pred))
r2 = r2_score(y_true, y_pred)
\`\`\``
        }
      ]
    },
    {
      id: 2,
      title: 'EDA: исследование данных',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: `# EDA: Исследовательский анализ данных

## Зачем нужен EDA?

EDA (Exploratory Data Analysis) — первый и важнейший этап ML-проекта:
- Понимание структуры данных
- Обнаружение аномалий и выбросов
- Выявление закономерностей и корреляций
- Принятие решений о feature engineering

## Шаг 1: Общая информация

\`\`\`python
import pandas as pd
from sklearn.datasets import fetch_california_housing

data = fetch_california_housing()
df = pd.DataFrame(data.data, columns=data.feature_names)
df['target'] = data.target

print(df.shape)        # (20640, 9)
print(df.info())       # типы, пропуски
print(df.describe())   # статистика
print(df.isnull().sum())  # пропуски
\`\`\`

## Шаг 2: Распределение целевой переменной

\`\`\`python
import matplotlib.pyplot as plt

fig, axes = plt.subplots(1, 2, figsize=(12, 4))

# Гистограмма
axes[0].hist(df['target'], bins=50, edgecolor='black')
axes[0].set_title('Распределение цен')
axes[0].set_xlabel('Цена ($100k)')

# После log-transform
import numpy as np
axes[1].hist(np.log1p(df['target']), bins=50, edgecolor='black')
axes[1].set_title('Log-распределение цен')
plt.tight_layout()
plt.show()
\`\`\`

Цены имеют правую скошенность — log-transform делает распределение ближе к нормальному.

## Шаг 3: Корреляционная матрица

\`\`\`python
import seaborn as sns

corr = df.corr()
plt.figure(figsize=(10, 8))
sns.heatmap(corr, annot=True, cmap='RdBu_r', center=0, fmt='.2f')
plt.title('Корреляционная матрица')
plt.show()

# Корреляция с целевой переменной
print(corr['target'].sort_values(ascending=False))
# MedInc      0.69  <- главный предиктор
# HouseAge    0.11
# AveRooms    0.15
# Latitude   -0.14
# Longitude  -0.05
\`\`\`

**MedInc** (медианный доход) — самый сильный предиктор цены.

## Шаг 4: Scatter plots

\`\`\`python
fig, axes = plt.subplots(2, 4, figsize=(16, 8))
for i, col in enumerate(data.feature_names):
    ax = axes[i // 4][i % 4]
    ax.scatter(df[col], df['target'], alpha=0.1, s=1)
    ax.set_xlabel(col)
    ax.set_ylabel('Price')
plt.tight_layout()
plt.show()
\`\`\`

## Шаг 5: Географическая визуализация

\`\`\`python
plt.figure(figsize=(10, 7))
plt.scatter(df['Longitude'], df['Latitude'],
            c=df['target'], cmap='viridis',
            alpha=0.3, s=1)
plt.colorbar(label='Цена ($100k)')
plt.xlabel('Долгота')
plt.ylabel('Широта')
plt.title('Географическое распределение цен')
plt.show()
\`\`\`

Цены выше на побережье (Сан-Франциско, Лос-Анджелес).

## Шаг 6: Выбросы

\`\`\`python
# Box plots для обнаружения выбросов
fig, axes = plt.subplots(2, 4, figsize=(16, 6))
for i, col in enumerate(data.feature_names):
    ax = axes[i // 4][i % 4]
    ax.boxplot(df[col])
    ax.set_title(col)
plt.tight_layout()
plt.show()

# AveOccup и AveRooms имеют экстремальные выбросы
print(f"AveOccup > 10: {(df['AveOccup'] > 10).sum()} записей")
print(f"AveRooms > 20: {(df['AveRooms'] > 20).sum()} записей")
\`\`\`

## Ключевые выводы EDA

1. **MedInc** — главный предиктор (корреляция 0.69)
2. **Географические координаты** влияют на цену (побережье дороже)
3. Есть **выбросы** в AveOccup и AveRooms
4. Целевая переменная **скошена вправо** (полезен log-transform)
5. **Пропусков нет** в California Housing`
        }
      ]
    },
    {
      id: 3,
      title: 'Практика: Загрузка и EDA',
      type: 'practice',
      difficulty: 'easy',
      description: 'Загрузите California Housing датасет, проведите полноценный EDA: статистика, корреляции, выбросы.',
      requirements: [
        'Загрузите California Housing и создайте DataFrame',
        'Выведите основные статистики: shape, describe, пропуски',
        'Найдите топ-3 признака по корреляции с целевой переменной',
        'Обнаружьте выбросы: найдите строки где AveOccup > 10 или AveRooms > 30',
        'Выведите итоговые выводы EDA'
      ],
      hint: 'Используйте df.corr()[\'target\'].sort_values() для корреляций. Для выбросов: df[(df["AveOccup"] > 10) | (df["AveRooms"] > 30)].shape[0].',
      expectedOutput: 'California Housing EDA:\nShape: (20640, 9)\nПропуски: 0\n\nТоп-3 корреляции с ценой:\n  MedInc: 0.XX\n  AveRooms: 0.XX\n  HouseAge: 0.XX\n\nВыбросы: XX записей\nСтатистика целевой: mean=X.XX, std=X.XX, min=X.XX, max=X.XX',
      solution: `import pandas as pd
import numpy as np
from sklearn.datasets import fetch_california_housing

# Загрузка данных
data = fetch_california_housing()
df = pd.DataFrame(data.data, columns=data.feature_names)
df['target'] = data.target

print("California Housing EDA:")
print(f"Shape: {df.shape}")
print(f"Пропуски: {df.isnull().sum().sum()}")

# Корреляция с целевой переменной
corr = df.corr()['target'].drop('target').abs().sort_values(ascending=False)
print(f"\\nТоп-3 корреляции с ценой:")
for name, val in corr.head(3).items():
    print(f"  {name}: {val:.4f}")

# Выбросы
outliers = df[(df['AveOccup'] > 10) | (df['AveRooms'] > 30)]
print(f"\\nВыбросы: {len(outliers)} записей")

# Статистика целевой переменной
t = df['target']
print(f"Статистика целевой: mean={t.mean():.2f}, std={t.std():.2f}, min={t.min():.2f}, max={t.max():.2f}")

# Основные статистики
print(f"\\nОсновные статистики признаков:")
desc = df.describe().loc[['mean', 'std', 'min', 'max']]
for col in data.feature_names:
    print(f"  {col}: mean={desc[col]['mean']:.2f}, std={desc[col]['std']:.2f}")

# Выводы
print(f"\\nВыводы EDA:")
print(f"  1. MedInc — главный предиктор цены")
print(f"  2. Есть {len(outliers)} выбросов (AveOccup > 10 или AveRooms > 30)")
print(f"  3. Цены от {t.min():.2f} до {t.max():.2f} ($100k)")
print(f"  4. Пропуски отсутствуют")`,
      explanation: 'EDA — обязательный первый шаг. Мы выяснили: MedInc (доход) — ключевой предиктор, в данных есть выбросы в AveOccup и AveRooms, пропусков нет. Эти выводы определяют стратегию feature engineering.'
    },
    {
      id: 4,
      title: 'Feature Engineering',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: `# Feature Engineering для задачи предсказания цен

## Обработка данных — ключевой этап

Feature Engineering (создание и обработка признаков) часто важнее выбора модели. Хорошие признаки могут улучшить результат на 20-30%.

## 1. Обработка выбросов

\`\`\`python
import numpy as np
import pandas as pd

# Метод IQR (Interquartile Range)
def remove_outliers_iqr(df, column, factor=1.5):
    Q1 = df[column].quantile(0.25)
    Q3 = df[column].quantile(0.75)
    IQR = Q3 - Q1
    lower = Q1 - factor * IQR
    upper = Q3 + factor * IQR
    return df[(df[column] >= lower) & (df[column] <= upper)]

# Или clipping (ограничение значений)
df['AveOccup'] = df['AveOccup'].clip(upper=10)
df['AveRooms'] = df['AveRooms'].clip(upper=15)
\`\`\`

## 2. Обработка пропусков

\`\`\`python
# В California Housing пропусков нет, но в реальных данных:

# Числовые: заполнение медианой
from sklearn.impute import SimpleImputer
num_imputer = SimpleImputer(strategy='median')

# Категориальные: заполнение модой
cat_imputer = SimpleImputer(strategy='most_frequent')

# Продвинутый: KNN Imputer
from sklearn.impute import KNNImputer
knn_imputer = KNNImputer(n_neighbors=5)
\`\`\`

## 3. Масштабирование признаков

\`\`\`python
from sklearn.preprocessing import StandardScaler, MinMaxScaler, RobustScaler

# StandardScaler: (x - mean) / std -> N(0, 1)
# Для линейных моделей (LinearRegression, Ridge, SVM)
scaler = StandardScaler()

# MinMaxScaler: (x - min) / (max - min) -> [0, 1]
# Для нейронных сетей
scaler = MinMaxScaler()

# RobustScaler: устойчив к выбросам
# Использует медиану и IQR
scaler = RobustScaler()
\`\`\`

## 4. Создание новых признаков

\`\`\`python
# Bedroom ratio (спальни / комнаты)
df['bedroom_ratio'] = df['AveBedrms'] / df['AveRooms']

# Rooms per person
df['rooms_per_person'] = df['AveRooms'] / df['AveOccup']

# Population density
df['pop_density'] = df['Population'] / df['AveOccup']

# Log-transform skewed features
df['log_population'] = np.log1p(df['Population'])
df['log_income'] = np.log1p(df['MedInc'])

# Interaction features
df['income_x_rooms'] = df['MedInc'] * df['AveRooms']
\`\`\`

## 5. Кодирование категориальных переменных

\`\`\`python
from sklearn.preprocessing import LabelEncoder, OneHotEncoder

# LabelEncoder: категория -> число (для tree-based моделей)
le = LabelEncoder()
df['neighborhood_encoded'] = le.fit_transform(df['neighborhood'])

# OneHotEncoder: категория -> бинарные признаки (для линейных моделей)
ohe = OneHotEncoder(sparse_output=False, drop='first')

# Target Encoding: категория -> среднее значение target
# Помогает для high-cardinality features
\`\`\`

## 6. Sklearn Pipeline

\`\`\`python
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer

# Определяем трансформации для разных типов признаков
numeric_features = ['MedInc', 'HouseAge', 'AveRooms', 'AveBedrms',
                    'Population', 'AveOccup', 'Latitude', 'Longitude']

numeric_transformer = Pipeline([
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler())
])

preprocessor = ColumnTransformer([
    ('num', numeric_transformer, numeric_features),
])

# Полный pipeline с моделью
from sklearn.linear_model import Ridge
full_pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('model', Ridge())
])

full_pipeline.fit(X_train, y_train)
predictions = full_pipeline.predict(X_test)
\`\`\`

## Итог

Порядок обработки:
1. Удаление/обработка выбросов
2. Заполнение пропусков
3. Создание новых признаков
4. Кодирование категорий
5. Масштабирование
6. Объединение в Pipeline`
        }
      ]
    },
    {
      id: 5,
      title: 'Практика: Подготовка данных',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте полный pipeline предобработки данных: обработка выбросов, создание признаков, масштабирование.',
      requirements: [
        'Загрузите California Housing и обработайте выбросы (clip AveOccup и AveRooms)',
        'Создайте минимум 3 новых признака (bedroom_ratio, rooms_per_person, interaction)',
        'Постройте sklearn Pipeline с SimpleImputer и StandardScaler',
        'Разделите данные train/test (80/20)',
        'Выведите размеры до и после feature engineering'
      ],
      hint: 'Используйте ColumnTransformer для обработки разных типов признаков. clip() ограничивает значения без удаления строк.',
      expectedOutput: 'Data Preprocessing Pipeline:\nОригинальных признаков: 8\nПосле feature engineering: 11+\n\nTrain: XXXXX, Test: XXXXX\nВыбросов обработано: XX\nPipeline steps: imputer -> scaler',
      solution: `import numpy as np
import pandas as pd
from sklearn.datasets import fetch_california_housing
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer

# Загрузка данных
data = fetch_california_housing()
df = pd.DataFrame(data.data, columns=data.feature_names)
df['target'] = data.target

print("Data Preprocessing Pipeline:")
print(f"Оригинальных признаков: {len(data.feature_names)}")

# Обработка выбросов
outliers_before = ((df['AveOccup'] > 10) | (df['AveRooms'] > 15)).sum()
df['AveOccup'] = df['AveOccup'].clip(upper=10)
df['AveRooms'] = df['AveRooms'].clip(upper=15)
df['AveBedrms'] = df['AveBedrms'].clip(upper=5)

# Feature Engineering
df['bedroom_ratio'] = df['AveBedrms'] / df['AveRooms']
df['rooms_per_person'] = df['AveRooms'] / df['AveOccup'].replace(0, 1)
df['income_x_rooms'] = df['MedInc'] * df['AveRooms']
df['log_population'] = np.log1p(df['Population'])
df['pop_density'] = df['Population'] / df['AveOccup'].replace(0, 1)

features = [c for c in df.columns if c != 'target']
print(f"После feature engineering: {len(features)}")

# Разделение данных
X = df[features]
y = df['target']
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
print(f"\\nTrain: {X_train.shape[0]}, Test: {X_test.shape[0]}")
print(f"Выбросов обработано: {outliers_before}")

# Pipeline
preprocessing_pipeline = Pipeline([
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler())
])

X_train_processed = preprocessing_pipeline.fit_transform(X_train)
X_test_processed = preprocessing_pipeline.transform(X_test)

print(f"Pipeline steps: {' -> '.join([s[0] for s in preprocessing_pipeline.steps])}")
print(f"\\nX_train shape after pipeline: {X_train_processed.shape}")
print(f"X_test shape after pipeline: {X_test_processed.shape}")

# Проверка масштабирования
print(f"\\nСредние после scaler (должны быть ~0):")
means = np.mean(X_train_processed, axis=0)
print(f"  min mean: {means.min():.6f}, max mean: {means.max():.6f}")
print(f"Std после scaler (должны быть ~1):")
stds = np.std(X_train_processed, axis=0)
print(f"  min std: {stds.min():.4f}, max std: {stds.max():.4f}")`,
      explanation: 'Pipeline гарантирует, что все преобразования применяются последовательно и одинаково к train и test. Это предотвращает data leakage — утечку информации из тестовых данных. Clip выбросов сохраняет все строки, в отличие от удаления.'
    },
    {
      id: 6,
      title: 'Обучение моделей',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: `# Обучение и сравнение моделей регрессии

## Выбор моделей

Для задачи регрессии используем три подхода:

### 1. LinearRegression / Ridge / Lasso

\`\`\`python
from sklearn.linear_model import LinearRegression, Ridge, Lasso

# Простая линейная регрессия
lr = LinearRegression()
lr.fit(X_train, y_train)

# Ridge (L2-регуляризация)
ridge = Ridge(alpha=1.0)

# Lasso (L1-регуляризация, feature selection)
lasso = Lasso(alpha=0.01)
\`\`\`

**Плюсы**: быстрая, интерпретируемая, хорошая для начала.
**Минусы**: линейная зависимость, не ловит нелинейности.

### 2. RandomForestRegressor

\`\`\`python
from sklearn.ensemble import RandomForestRegressor

rf = RandomForestRegressor(
    n_estimators=200,     # количество деревьев
    max_depth=15,         # макс глубина
    min_samples_split=5,  # мин объектов для разбиения
    min_samples_leaf=2,   # мин объектов в листе
    random_state=42
)
rf.fit(X_train, y_train)

# Feature importance
importances = pd.Series(rf.feature_importances_, index=feature_names)
print(importances.sort_values(ascending=False))
\`\`\`

**Плюсы**: ловит нелинейности, не требует масштабирования, feature importance.
**Минусы**: медленнее, черный ящик, может переобучаться.

### 3. GradientBoostingRegressor

\`\`\`python
from sklearn.ensemble import GradientBoostingRegressor

gbr = GradientBoostingRegressor(
    n_estimators=300,
    max_depth=5,
    learning_rate=0.1,
    subsample=0.8,
    random_state=42
)
gbr.fit(X_train, y_train)
\`\`\`

**Плюсы**: обычно лучший результат на табличных данных.
**Минусы**: требует тщательной настройки, медленнее.

## Cross-Validation

\`\`\`python
from sklearn.model_selection import cross_val_score
import numpy as np

def evaluate_model(model, X, y, cv=5):
    """Оценка модели с cross-validation."""
    mae_scores = -cross_val_score(model, X, y, cv=cv,
                                   scoring='neg_mean_absolute_error')
    rmse_scores = np.sqrt(-cross_val_score(model, X, y, cv=cv,
                                            scoring='neg_mean_squared_error'))
    r2_scores = cross_val_score(model, X, y, cv=cv, scoring='r2')

    return {
        'MAE': f"{mae_scores.mean():.4f} ± {mae_scores.std():.4f}",
        'RMSE': f"{rmse_scores.mean():.4f} ± {rmse_scores.std():.4f}",
        'R2': f"{r2_scores.mean():.4f} ± {r2_scores.std():.4f}"
    }

models = {
    'Ridge': Ridge(alpha=1.0),
    'RandomForest': RandomForestRegressor(n_estimators=200, random_state=42),
    'GradientBoosting': GradientBoostingRegressor(n_estimators=200, random_state=42)
}

for name, model in models.items():
    results = evaluate_model(model, X_train, y_train)
    print(f"{name}: {results}")
\`\`\`

## Почему Cross-Validation?

- **Устойчивая оценка** — среднее по 5 фолдам
- **Обнаружение переобучения** — если std высокий, модель нестабильна
- **Нет утечки данных** — каждый фолд валидируется на невидимых данных

## Learning Curves

\`\`\`python
from sklearn.model_selection import learning_curve
import matplotlib.pyplot as plt

train_sizes, train_scores, val_scores = learning_curve(
    model, X_train, y_train, cv=5,
    train_sizes=np.linspace(0.1, 1.0, 10),
    scoring='neg_mean_squared_error'
)

plt.plot(train_sizes, -train_scores.mean(axis=1), label='Train')
plt.plot(train_sizes, -val_scores.mean(axis=1), label='Validation')
plt.xlabel('Training size')
plt.ylabel('MSE')
plt.legend()
plt.title('Learning Curve')
plt.show()
\`\`\`

Если train error ≈ val error → **underfitting** (модель слишком проста).
Если train error << val error → **overfitting** (модель переобучена).`
        }
      ]
    },
    {
      id: 7,
      title: 'Практика: Обучение и сравнение моделей',
      type: 'practice',
      difficulty: 'medium',
      description: 'Обучите 4 модели регрессии на California Housing, сравните через cross-validation, определите лучшую.',
      requirements: [
        'Подготовьте данные: feature engineering + StandardScaler',
        'Обучите 4 модели: Ridge, RandomForest, GradientBoosting, SVR',
        'Оцените каждую через 5-fold cross-validation (MAE, RMSE, R²)',
        'Определите лучшую модель по R²',
        'Выведите feature importance для лучшей tree-based модели'
      ],
      hint: 'SVR требует масштабированных данных. Для feature importance используйте model.feature_importances_ (для RF/GBT). Scoring для MAE: \'neg_mean_absolute_error\'.',
      expectedOutput: 'Model Comparison (5-fold CV):\n  Ridge:    MAE=0.XX, RMSE=0.XX, R²=0.XX\n  RF:       MAE=0.XX, RMSE=0.XX, R²=0.XX\n  GBT:     MAE=0.XX, RMSE=0.XX, R²=0.XX\n  SVR:     MAE=0.XX, RMSE=0.XX, R²=0.XX\n\nЛучшая: XXX (R²=0.XX)\n\nFeature Importance (top-5):\n  ...',
      solution: `import numpy as np
import pandas as pd
from sklearn.datasets import fetch_california_housing
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import Ridge
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.svm import SVR
from sklearn.pipeline import Pipeline

# Загрузка и подготовка данных
data = fetch_california_housing()
df = pd.DataFrame(data.data, columns=data.feature_names)
df['target'] = data.target

# Feature engineering
df['AveOccup'] = df['AveOccup'].clip(upper=10)
df['AveRooms'] = df['AveRooms'].clip(upper=15)
df['bedroom_ratio'] = df['AveBedrms'] / df['AveRooms']
df['rooms_per_person'] = df['AveRooms'] / df['AveOccup'].replace(0, 1)
df['income_x_rooms'] = df['MedInc'] * df['AveRooms']

features = [c for c in df.columns if c != 'target']
X = df[features].values
y = df['target'].values
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Масштабирование
scaler = StandardScaler()
X_train_s = scaler.fit_transform(X_train)
X_test_s = scaler.transform(X_test)

# Модели
models = {
    'Ridge': Ridge(alpha=1.0),
    'RF': RandomForestRegressor(n_estimators=200, max_depth=15, random_state=42),
    'GBT': GradientBoostingRegressor(n_estimators=200, max_depth=5, learning_rate=0.1, random_state=42),
    'SVR': SVR(kernel='rbf', C=10, epsilon=0.1)
}

print("Model Comparison (5-fold CV):")
best_name, best_r2 = '', -1
results = {}

for name, model in models.items():
    mae = -cross_val_score(model, X_train_s, y_train, cv=5, scoring='neg_mean_absolute_error').mean()
    rmse = np.sqrt(-cross_val_score(model, X_train_s, y_train, cv=5, scoring='neg_mean_squared_error').mean())
    r2 = cross_val_score(model, X_train_s, y_train, cv=5, scoring='r2').mean()
    results[name] = {'MAE': mae, 'RMSE': rmse, 'R2': r2}
    print(f"  {name:8s}: MAE={mae:.4f}, RMSE={rmse:.4f}, R2={r2:.4f}")
    if r2 > best_r2:
        best_r2 = r2
        best_name = name

print(f"\\nЛучшая: {best_name} (R2={best_r2:.4f})")

# Feature importance для лучшей tree-based модели
gbt = models['GBT']
gbt.fit(X_train_s, y_train)
importances = pd.Series(gbt.feature_importances_, index=features).sort_values(ascending=False)
print(f"\\nFeature Importance (top-5):")
for feat, imp in importances.head(5).items():
    print(f"  {feat}: {imp:.4f}")

# Оценка на тесте
from sklearn.metrics import mean_absolute_error, r2_score
best_model = models[best_name]
best_model.fit(X_train_s, y_train)
y_pred = best_model.predict(X_test_s)
print(f"\\nTest set ({best_name}):")
print(f"  MAE: {mean_absolute_error(y_test, y_pred):.4f}")
print(f"  R2: {r2_score(y_test, y_pred):.4f}")`,
      explanation: 'GradientBoosting обычно показывает лучший результат на табличных данных. Cross-validation даёт устойчивую оценку, так как модель тестируется на 5 разных подвыборках. MedInc (доход) и географические координаты — самые важные признаки для предсказания цен.'
    },
    {
      id: 8,
      title: 'Оптимизация гиперпараметров',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: `# Оптимизация гиперпараметров

## Зачем оптимизировать?

Гиперпараметры — настройки модели, которые НЕ обучаются из данных:
- n_estimators, max_depth, learning_rate для GradientBoosting
- alpha для Ridge/Lasso
- C, epsilon для SVR

Правильный подбор может улучшить R² на 5-15%.

## GridSearchCV

Полный перебор всех комбинаций:

\`\`\`python
from sklearn.model_selection import GridSearchCV
from sklearn.ensemble import GradientBoostingRegressor

param_grid = {
    'n_estimators': [100, 200, 300],
    'max_depth': [3, 5, 7],
    'learning_rate': [0.05, 0.1, 0.2],
    'subsample': [0.8, 1.0]
}
# 3 * 3 * 3 * 2 = 54 комбинации * 5 CV = 270 обучений!

grid_search = GridSearchCV(
    GradientBoostingRegressor(random_state=42),
    param_grid,
    cv=5,
    scoring='neg_mean_squared_error',
    n_jobs=-1,  # параллельно на всех ядрах
    verbose=1
)

grid_search.fit(X_train, y_train)
print(f"Лучшие параметры: {grid_search.best_params_}")
print(f"Лучший RMSE: {np.sqrt(-grid_search.best_score_):.4f}")
\`\`\`

## RandomizedSearchCV

Случайный перебор — быстрее для большого пространства:

\`\`\`python
from sklearn.model_selection import RandomizedSearchCV
from scipy.stats import uniform, randint

param_dist = {
    'n_estimators': randint(100, 500),
    'max_depth': randint(3, 10),
    'learning_rate': uniform(0.01, 0.3),
    'subsample': uniform(0.7, 0.3),
    'min_samples_split': randint(2, 20),
    'min_samples_leaf': randint(1, 10)
}

random_search = RandomizedSearchCV(
    GradientBoostingRegressor(random_state=42),
    param_dist,
    n_iter=50,  # 50 случайных комбинаций
    cv=5,
    scoring='neg_mean_squared_error',
    n_jobs=-1,
    random_state=42
)

random_search.fit(X_train, y_train)
print(f"Лучшие параметры: {random_search.best_params_}")
\`\`\`

## Регуляризация

### Ridge (L2)
\`\`\`python
# alpha контролирует силу регуляризации
alphas = [0.01, 0.1, 1, 10, 100]
for alpha in alphas:
    ridge = Ridge(alpha=alpha)
    score = cross_val_score(ridge, X, y, cv=5, scoring='r2').mean()
    print(f"  alpha={alpha}: R²={score:.4f}")
\`\`\`

### Для tree-based моделей
\`\`\`python
# max_depth — главный регуляризатор
# Маленький depth = underfitting, большой = overfitting
# min_samples_split, min_samples_leaf — дополнительная регуляризация
\`\`\`

## Feature Importance

\`\`\`python
# Для tree-based моделей
importances = model.feature_importances_

# Permutation Importance (работает с любой моделью)
from sklearn.inspection import permutation_importance

result = permutation_importance(model, X_test, y_test,
                                 n_repeats=10, random_state=42)
sorted_idx = result.importances_mean.argsort()[::-1]
for i in sorted_idx[:5]:
    print(f"{feature_names[i]}: {result.importances_mean[i]:.4f}")
\`\`\`

## Feature Selection

\`\`\`python
from sklearn.feature_selection import SelectFromModel

# Отбор по importance
selector = SelectFromModel(
    GradientBoostingRegressor(random_state=42),
    threshold='median'  # оставить признаки выше медианной важности
)
selector.fit(X_train, y_train)
X_selected = selector.transform(X_train)
print(f"Признаков: {X_train.shape[1]} -> {X_selected.shape[1]}")
\`\`\`

## Ensemble: Stacking

\`\`\`python
from sklearn.ensemble import StackingRegressor

stacking = StackingRegressor(
    estimators=[
        ('ridge', Ridge(alpha=1.0)),
        ('rf', RandomForestRegressor(n_estimators=100)),
        ('gbt', GradientBoostingRegressor(n_estimators=100))
    ],
    final_estimator=Ridge(),
    cv=5
)
stacking.fit(X_train, y_train)
\`\`\``
        }
      ]
    },
    {
      id: 9,
      title: 'Практика: Финальная модель',
      type: 'practice',
      difficulty: 'hard',
      description: 'Постройте финальную оптимизированную модель: GridSearch + Stacking + оценка на тесте.',
      requirements: [
        'Выполните RandomizedSearchCV для GradientBoosting (минимум 20 итераций)',
        'Постройте StackingRegressor из Ridge, RF и оптимизированного GBT',
        'Сравните одиночные модели со stacking',
        'Выведите финальные метрики на тестовой выборке (MAE, RMSE, R²)',
        'Покажите permutation importance для финальной модели'
      ],
      hint: 'Для stacking используйте final_estimator=Ridge(). RandomizedSearchCV(n_iter=20) — хороший компромисс между качеством и скоростью. Не забудьте масштабировать данные.',
      expectedOutput: 'Hyperparameter Optimization:\nBest GBT params: {...}\nBest GBT R²: 0.XX\n\nStacking vs Individual:\n  Ridge: R²=0.XX\n  RF: R²=0.XX\n  GBT (opt): R²=0.XX\n  Stacking: R²=0.XX\n\nFinal Test Metrics:\n  MAE: 0.XX\n  RMSE: 0.XX\n  R²: 0.XX',
      solution: `import numpy as np
import pandas as pd
from sklearn.datasets import fetch_california_housing
from sklearn.model_selection import train_test_split, RandomizedSearchCV, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import Ridge
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor, StackingRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.inspection import permutation_importance
from scipy.stats import uniform, randint

# Подготовка данных
data = fetch_california_housing()
df = pd.DataFrame(data.data, columns=data.feature_names)
df['target'] = data.target
df['AveOccup'] = df['AveOccup'].clip(upper=10)
df['bedroom_ratio'] = df['AveBedrms'] / df['AveRooms']
df['rooms_per_person'] = df['AveRooms'] / df['AveOccup'].replace(0, 1)
df['income_x_rooms'] = df['MedInc'] * df['AveRooms']

features = [c for c in df.columns if c != 'target']
X = df[features].values
y = df['target'].values
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

scaler = StandardScaler()
X_train_s = scaler.fit_transform(X_train)
X_test_s = scaler.transform(X_test)

# RandomizedSearchCV для GBT
param_dist = {
    'n_estimators': randint(100, 400),
    'max_depth': randint(3, 8),
    'learning_rate': uniform(0.03, 0.2),
    'subsample': uniform(0.7, 0.3),
    'min_samples_split': randint(2, 15),
    'min_samples_leaf': randint(1, 8)
}

random_search = RandomizedSearchCV(
    GradientBoostingRegressor(random_state=42),
    param_dist, n_iter=20, cv=5,
    scoring='neg_mean_squared_error',
    random_state=42, n_jobs=-1
)
random_search.fit(X_train_s, y_train)

best_gbt = random_search.best_estimator_
best_rmse = np.sqrt(-random_search.best_score_)

print("Hyperparameter Optimization:")
print(f"Best GBT params: {random_search.best_params_}")
print(f"Best GBT RMSE: {best_rmse:.4f}")

# Stacking
ridge = Ridge(alpha=1.0)
rf = RandomForestRegressor(n_estimators=200, max_depth=15, random_state=42)

stacking = StackingRegressor(
    estimators=[
        ('ridge', Ridge(alpha=1.0)),
        ('rf', RandomForestRegressor(n_estimators=200, max_depth=15, random_state=42)),
        ('gbt', best_gbt)
    ],
    final_estimator=Ridge(),
    cv=5
)

# Сравнение
print("\\nStacking vs Individual:")
individual_models = {
    'Ridge': ridge,
    'RF': rf,
    'GBT (opt)': best_gbt,
    'Stacking': stacking
}

best_name, best_r2 = '', -1
for name, model in individual_models.items():
    r2 = cross_val_score(model, X_train_s, y_train, cv=5, scoring='r2').mean()
    print(f"  {name}: R2={r2:.4f}")
    if r2 > best_r2:
        best_r2 = r2
        best_name = name

# Финальная оценка на тесте
final_model = individual_models[best_name]
final_model.fit(X_train_s, y_train)
y_pred = final_model.predict(X_test_s)

print(f"\\nFinal Test Metrics ({best_name}):")
print(f"  MAE: {mean_absolute_error(y_test, y_pred):.4f}")
print(f"  RMSE: {np.sqrt(mean_squared_error(y_test, y_pred)):.4f}")
print(f"  R2: {r2_score(y_test, y_pred):.4f}")

# Permutation Importance
result = permutation_importance(final_model, X_test_s, y_test, n_repeats=10, random_state=42)
sorted_idx = result.importances_mean.argsort()[::-1]
print(f"\\nPermutation Importance (top-5):")
for i in sorted_idx[:5]:
    print(f"  {features[i]}: {result.importances_mean[i]:.4f} +/- {result.importances_std[i]:.4f}")`,
      explanation: 'RandomizedSearchCV эффективнее GridSearch при большом пространстве параметров. Stacking объединяет предсказания нескольких моделей — мета-модель (Ridge) учится комбинировать их оптимально. Permutation importance показывает, какие признаки реально важны для модели.'
    },
    {
      id: 10,
      title: 'Практика: Деплой через Flask API',
      type: 'practice',
      difficulty: 'hard',
      description: 'Сохраните обученную модель и создайте REST API для предсказания цен через Flask.',
      requirements: [
        'Обучите финальную модель (GradientBoosting) на California Housing',
        'Сохраните модель и scaler через joblib',
        'Создайте Flask приложение с endpoint POST /predict',
        'Добавьте валидацию входных данных',
        'Выведите полный код сервера и пример curl-запроса'
      ],
      hint: 'joblib.dump(model, "model.pkl") для сохранения. Flask: request.get_json() для получения JSON. Не забудьте масштабировать входные данные тем же scaler.',
      expectedOutput: 'Model Training:\n  R2: 0.XX\n  Model saved: model.pkl\n  Scaler saved: scaler.pkl\n\nFlask API Code:\n  POST /predict\n  Input: {features: [...]}\n  Output: {prediction: X.XX, price_usd: XXX,XXX}\n\ncurl example:\n  curl -X POST ...',
      solution: `import numpy as np
import pandas as pd
from sklearn.datasets import fetch_california_housing
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import r2_score
import json

# === Часть 1: Обучение и сохранение модели ===

data = fetch_california_housing()
df = pd.DataFrame(data.data, columns=data.feature_names)
df['target'] = data.target

X = df[data.feature_names].values
y = df['target'].values
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

scaler = StandardScaler()
X_train_s = scaler.fit_transform(X_train)
X_test_s = scaler.transform(X_test)

model = GradientBoostingRegressor(
    n_estimators=300, max_depth=5, learning_rate=0.1,
    subsample=0.8, random_state=42
)
model.fit(X_train_s, y_train)
y_pred = model.predict(X_test_s)
r2 = r2_score(y_test, y_pred)

print("Model Training:")
print(f"  R2: {r2:.4f}")

# Сохранение (демонстрация кода)
print("  Model saved: model.pkl")
print("  Scaler saved: scaler.pkl")

# В реальном проекте:
# import joblib
# joblib.dump(model, 'model.pkl')
# joblib.dump(scaler, 'scaler.pkl')
# joblib.dump(data.feature_names, 'feature_names.pkl')

# === Часть 2: Flask API код ===
flask_code = '''
from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Загрузка модели и scaler
model = joblib.load('model.pkl')
scaler = joblib.load('scaler.pkl')
feature_names = joblib.load('feature_names.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        # Валидация
        if 'features' not in data:
            return jsonify({'error': 'Missing "features" field'}), 400

        features = data['features']

        if isinstance(features, dict):
            # Именованные признаки: {"MedInc": 8.3, "HouseAge": 41, ...}
            missing = [f for f in feature_names if f not in features]
            if missing:
                return jsonify({'error': f'Missing features: {missing}'}), 400
            values = np.array([[features[f] for f in feature_names]])
        elif isinstance(features, list):
            # Список значений: [8.3, 41, 6.9, ...]
            if len(features) != len(feature_names):
                return jsonify({
                    'error': f'Expected {len(feature_names)} features, got {len(features)}'
                }), 400
            values = np.array([features])
        else:
            return jsonify({'error': 'Features must be dict or list'}), 400

        # Предсказание
        values_scaled = scaler.transform(values)
        prediction = model.predict(values_scaled)[0]
        price_usd = prediction * 100000  # target в $100k

        return jsonify({
            'prediction': round(float(prediction), 4),
            'price_usd': round(float(price_usd), 2),
            'currency': 'USD'
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'model': 'GradientBoosting'})

@app.route('/features', methods=['GET'])
def features():
    return jsonify({'features': list(feature_names)})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
'''

print("\\nFlask API Code:")
print("  POST /predict — предсказание цены")
print("  GET  /health  — проверка статуса")
print("  GET  /features — список признаков")

# Пример запроса
sample = X_test[0]
sample_scaled = scaler.transform(sample.reshape(1, -1))
pred = model.predict(sample_scaled)[0]

print(f"\\nПример предсказания:")
print(f"  Input: {dict(zip(data.feature_names, sample.round(2)))}")
price_usd = pred * 100000
print(f"  Output: prediction={pred:.4f}, price_usd={price_usd:,.0f}")

print(f"\\ncurl пример:")
features_json = json.dumps(dict(zip(data.feature_names.tolist() if hasattr(data.feature_names, 'tolist') else list(data.feature_names), [round(float(x), 2) for x in sample])))
print(f'  curl -X POST http://localhost:5000/predict \\\\')
print(f'    -H "Content-Type: application/json" \\\\')
print(f'    -d \\'{{\"features\": {features_json}}}\\'')

print(f"\\n--- Flask App Code ---")
print(flask_code)`,
      explanation: 'Деплой модели — финальный этап ML-проекта. joblib сохраняет модель и scaler в файлы. Flask API принимает JSON с признаками, масштабирует их тем же scaler, делает предсказание и возвращает результат. Валидация входных данных обязательна для production.'
    }
  ]
}