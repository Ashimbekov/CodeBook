export default {
  id: 50,
  title: 'Проект: Прогноз оттока клиентов (Churn)',
  description: 'Бизнес-ориентированный ML-проект: прогноз оттока клиентов с SMOTE, SHAP-интерпретацией и Streamlit dashboard.',
  lessons: [
    {
      id: 1,
      title: 'Описание проекта: Customer Churn',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: `# Проект: Прогноз оттока клиентов (Churn Prediction)

## Цель проекта

Построить модель, которая предсказывает, какие клиенты уйдут (churn), чтобы бизнес мог предпринять меры удержания.

## Бизнес-контекст

**Отток (churn)** — это прекращение клиентом использования продукта/сервиса.

Ключевые факты:
- Привлечение нового клиента в **5-7 раз дороже** удержания существующего
- Увеличение retention на **5%** повышает прибыль на **25-95%** (HBR)
- Телеком: средний churn rate **1.5-3%** в месяц
- SaaS: целевой churn rate **< 5%** в год

## Датасет: Telco Customer Churn

\`\`\`python
# Kaggle: https://www.kaggle.com/blastchar/telco-customer-churn
# 7043 клиента, 21 признак
import pandas as pd

df = pd.read_csv('Telco-Customer-Churn.csv')
print(df.shape)  # (7043, 21)
print(df['Churn'].value_counts())
# No     5174 (73.5%)
# Yes    1869 (26.5%)  <- дисбаланс!
\`\`\`

## Признаки датасета

| Категория | Признаки |
|-----------|----------|
| Демография | gender, SeniorCitizen, Partner, Dependents |
| Сервисы | PhoneService, MultipleLines, InternetService, OnlineSecurity, OnlineBackup, DeviceProtection, TechSupport, StreamingTV, StreamingMovies |
| Контракт | Contract, PaperlessBilling, PaymentMethod |
| Финансы | MonthlyCharges, TotalCharges |
| Время | tenure (месяцы с подключения) |
| Целевая | Churn (Yes/No) |

## Метрики для Churn

Стандартный accuracy **не подходит** — данные несбалансированы (73% / 27%).

Ключевые метрики:
- **Recall (чувствительность)** — доля найденных churners (главная!)
- **Precision** — точность определения churners
- **F1-score** — баланс precision и recall
- **AUC-ROC** — качество ранжирования

\`\`\`python
# Бизнес-логика:
# False Negative (пропустили churner) -> потерянный клиент
# False Positive (ложная тревога) -> лишнее промо (дешевле)
# => Recall важнее Precision!
\`\`\`

## План проекта

1. **Бизнес-EDA** — анализ с бизнес-выводами
2. **Feature Engineering** — RFM, engagement, tenure features
3. **Обработка дисбаланса** — SMOTE, class_weight
4. **Моделирование** — LogReg, RF, XGBoost
5. **Интерпретация** — SHAP, feature importance
6. **Dashboard** — Streamlit для менеджера`
        }
      ]
    },
    {
      id: 2,
      title: 'EDA для бизнеса',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: `# EDA для бизнеса: анализ оттока

## Подход к бизнес-EDA

В отличие от технического EDA, бизнес-EDA отвечает на вопросы менеджмента:
1. **Какой** churn rate?
2. **Кто** уходит? (сегменты)
3. **Когда** уходят? (tenure)
4. **Почему** уходят? (гипотезы)

## 1. Общие метрики оттока

\`\`\`python
import pandas as pd
import numpy as np

churn_rate = df['Churn'].mean() * 100
print(f"Churn Rate: {churn_rate:.1f}%")

# Месячный vs годовой
monthly_rate = churn_rate / 12
annual_rate = 1 - (1 - churn_rate/100) ** 12

# Customer Lifetime Value (CLV)
avg_revenue = df['MonthlyCharges'].mean()
avg_lifetime = 1 / (churn_rate / 100)  # в месяцах
clv = avg_revenue * avg_lifetime
print(f"CLV: {clv:.0f} USD")
\`\`\`

## 2. Churn по сегментам

\`\`\`python
# Churn rate по контракту
print(df.groupby('Contract')['Churn'].mean() * 100)
# Month-to-month: 42.7%  <- высокий!
# One year:       11.3%
# Two year:        2.8%

# Churn rate по типу интернета
print(df.groupby('InternetService')['Churn'].mean() * 100)
# DSL:          19.0%
# Fiber optic:  41.9%  <- высокий!
# No:            7.4%
\`\`\`

## 3. Когортный анализ по tenure

\`\`\`python
# Разбивка по tenure (стажу)
tenure_bins = [0, 6, 12, 24, 48, 72]
tenure_labels = ['0-6m', '6-12m', '12-24m', '24-48m', '48-72m']
df['tenure_group'] = pd.cut(df['tenure'], bins=tenure_bins, labels=tenure_labels)

churn_by_tenure = df.groupby('tenure_group')['Churn'].mean() * 100
print(churn_by_tenure)
# 0-6m:   47.8%  <- новые клиенты уходят чаще всего!
# 6-12m:  30.2%
# 12-24m: 25.4%
# 24-48m: 18.1%
# 48-72m: 10.5%
\`\`\`

**Инсайт**: первые 6 месяцев — критический период. Программы онбординга могут снизить churn.

## 4. Доход от ушедших клиентов

\`\`\`python
# Потерянный доход
lost_revenue = df[df['Churn'] == 1]['MonthlyCharges'].sum()
total_revenue = df['MonthlyCharges'].sum()
print(f"Потерянный месячный доход: {lost_revenue:,.0f} USD")
print(f"Доля от общего: {lost_revenue/total_revenue*100:.1f}%")

# Средний чек churners vs retained
print(f"Средний чек churners: {df[df['Churn']==1]['MonthlyCharges'].mean():.0f} USD")
print(f"Средний чек retained: {df[df['Churn']==0]['MonthlyCharges'].mean():.0f} USD")
\`\`\`

## 5. Бизнес-рекомендации из EDA

1. **Month-to-month контракт** → предлагать годовой контракт со скидкой
2. **Fiber optic** с высоким churn → проверить качество сервиса
3. **Первые 6 месяцев** → усилить онбординг и поддержку
4. **Без дополнительных сервисов** → предложить пакетные акции
5. **Высокий ежемесячный платёж** → программы лояльности

## Визуализации для менеджмента

\`\`\`python
import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 2, figsize=(14, 10))

# 1. Churn rate pie
axes[0,0].pie([churn_rate, 100-churn_rate], labels=['Churn', 'Retained'],
              autopct='%1.1f%%', colors=['#e74c3c', '#2ecc71'])
axes[0,0].set_title('Churn Rate')

# 2. Churn by Contract
contract_churn = df.groupby('Contract')['Churn'].mean() * 100
axes[0,1].bar(contract_churn.index, contract_churn.values)
axes[0,1].set_title('Churn by Contract')

# 3. Churn by Tenure
axes[1,0].bar(churn_by_tenure.index, churn_by_tenure.values)
axes[1,0].set_title('Churn by Tenure')

# 4. Revenue impact
axes[1,1].bar(['Lost', 'Retained'], [lost_revenue, total_revenue - lost_revenue])
axes[1,1].set_title('Monthly Revenue Impact')

plt.tight_layout()
plt.show()
\`\`\``
        }
      ]
    },
    {
      id: 3,
      title: 'Практика: Бизнес-EDA',
      type: 'practice',
      difficulty: 'easy',
      description: 'Проведите бизнес-EDA на синтетическом Telco Churn датасете с выводами для менеджмента.',
      requirements: [
        'Создайте синтетический Telco Churn датасет (3000 клиентов)',
        'Рассчитайте churn rate и CLV',
        'Покажите churn по сегментам: контракт, интернет, tenure',
        'Оцените потерянный доход',
        'Сформулируйте 3 бизнес-рекомендации'
      ],
      hint: 'Используйте np.random.choice с правдоподобными пропорциями. Month-to-month клиенты должны иметь churn ~40%. Tenure создайте через np.random.exponential.',
      expectedOutput: 'Telco Churn Business EDA:\n  Клиентов: 3000\n  Churn Rate: XX.X%\n  CLV: $X,XXX\n\nChurn по контракту:\n  Month-to-month: XX.X%\n  One year: XX.X%\n  Two year: X.X%\n\nПотерянный доход: $XX,XXX/мес\n\nРекомендации:\n  1. ...',
      solution: `import numpy as np
import pandas as pd

np.random.seed(42)
n = 3000

# Создание датасета
df = pd.DataFrame({
    'customerID': [f'C{i:04d}' for i in range(n)],
    'gender': np.random.choice(['Male', 'Female'], n),
    'SeniorCitizen': np.random.choice([0, 1], n, p=[0.84, 0.16]),
    'Partner': np.random.choice(['Yes', 'No'], n, p=[0.48, 0.52]),
    'Dependents': np.random.choice(['Yes', 'No'], n, p=[0.30, 0.70]),
    'tenure': np.random.exponential(30, n).clip(1, 72).astype(int),
    'Contract': np.random.choice(
        ['Month-to-month', 'One year', 'Two year'],
        n, p=[0.55, 0.25, 0.20]
    ),
    'InternetService': np.random.choice(
        ['DSL', 'Fiber optic', 'No'],
        n, p=[0.34, 0.44, 0.22]
    ),
    'MonthlyCharges': np.random.uniform(20, 110, n).round(2),
    'OnlineSecurity': np.random.choice(['Yes', 'No'], n, p=[0.35, 0.65]),
    'TechSupport': np.random.choice(['Yes', 'No'], n, p=[0.35, 0.65]),
})

# Генерация Churn с реалистичными зависимостями
churn_prob = np.ones(n) * 0.15
churn_prob[df['Contract'] == 'Month-to-month'] += 0.25
churn_prob[df['Contract'] == 'Two year'] -= 0.10
churn_prob[df['InternetService'] == 'Fiber optic'] += 0.12
churn_prob[df['tenure'] < 12] += 0.15
churn_prob[df['tenure'] > 48] -= 0.10
churn_prob[df['OnlineSecurity'] == 'Yes'] -= 0.08
churn_prob[df['MonthlyCharges'] > 80] += 0.05
churn_prob = churn_prob.clip(0.02, 0.85)
df['Churn'] = (np.random.random(n) < churn_prob).astype(int)

df['TotalCharges'] = (df['MonthlyCharges'] * df['tenure']).round(2)

print("Telco Churn Business EDA:")
print(f"  Клиентов: {n}")

# Churn Rate
churn_rate = df['Churn'].mean()
print(f"  Churn Rate: {churn_rate*100:.1f}%")

# CLV (Customer Lifetime Value)
avg_revenue = df['MonthlyCharges'].mean()
avg_lifetime = 1 / churn_rate  # месяцы
clv = avg_revenue * avg_lifetime
print(f"  Средний чек: {avg_revenue:.0f} USD/мес")
print(f"  Ср. lifetime: {avg_lifetime:.0f} месяцев")
print(f"  CLV: {clv:,.0f} USD")

# Churn по контракту
print(f"\\nChurn по контракту:")
for contract in ['Month-to-month', 'One year', 'Two year']:
    rate = df[df['Contract'] == contract]['Churn'].mean() * 100
    count = (df['Contract'] == contract).sum()
    print(f"  {contract:20s}: {rate:5.1f}% ({count} клиентов)")

# Churn по интернету
print(f"\\nChurn по типу интернета:")
for service in ['DSL', 'Fiber optic', 'No']:
    rate = df[df['InternetService'] == service]['Churn'].mean() * 100
    print(f"  {service:15s}: {rate:5.1f}%")

# Churn по tenure
print(f"\\nChurn по tenure:")
tenure_bins = [0, 6, 12, 24, 48, 73]
tenure_labels = ['0-6 мес', '6-12 мес', '12-24 мес', '24-48 мес', '48+ мес']
df['tenure_group'] = pd.cut(df['tenure'], bins=tenure_bins, labels=tenure_labels)
for group in tenure_labels:
    subset = df[df['tenure_group'] == group]
    rate = subset['Churn'].mean() * 100
    print(f"  {group:12s}: {rate:5.1f}% ({len(subset)} клиентов)")

# Потерянный доход
churned = df[df['Churn'] == 1]
retained = df[df['Churn'] == 0]
lost_monthly = churned['MonthlyCharges'].sum()
total_monthly = df['MonthlyCharges'].sum()

print(f"\\nФинансовый анализ:")
print(f"  Потерянный доход: {lost_monthly:,.0f} USD/мес ({lost_monthly/total_monthly*100:.1f}%)")
print(f"  Средний чек churners: {churned['MonthlyCharges'].mean():.0f} USD")
print(f"  Средний чек retained: {retained['MonthlyCharges'].mean():.0f} USD")

# Бизнес-рекомендации
print(f"\\nБизнес-рекомендации:")
print(f"  1. Month-to-month клиенты имеют churn {df[df['Contract']=='Month-to-month']['Churn'].mean()*100:.0f}%")
print(f"     -> Предлагать годовой контракт со скидкой 15%")
print(f"  2. Первые 6 месяцев — самый опасный период")
print(f"     -> Усилить онбординг: звонок на 1, 3, 6 месяц")
print(f"  3. Fiber optic клиенты уходят чаще")
print(f"     -> Проверить качество сервиса, добавить бонусы")`,
      explanation: 'Бизнес-EDA фокусируется на actionable insights — выводах, которые можно применить. Churn по сегментам показывает, где проблема: month-to-month контракты, новые клиенты, fiber optic. CLV помогает оценить экономический эффект от снижения churn. Каждый инсайт должен иметь конкретную рекомендацию.'
    },
    {
      id: 4,
      title: 'Feature Engineering для Churn',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: `# Feature Engineering для Churn Prediction

## Бизнес-признаки

### 1. RFM (Recency, Frequency, Monetary)

Классическая сегментация:
- **Recency**: когда последний раз клиент был активен
- **Frequency**: как часто клиент использует сервис
- **Monetary**: сколько платит

\`\`\`python
# Для телеком
df['R_score'] = pd.qcut(df['tenure'], q=5, labels=[5,4,3,2,1]).astype(int)
# Новые клиенты (низкий tenure) -> высокий R (недавние)
df['M_score'] = pd.qcut(df['MonthlyCharges'], q=5, labels=[1,2,3,4,5]).astype(int)
df['RFM'] = df['R_score'] + df['M_score']
\`\`\`

### 2. Engagement Features

\`\`\`python
# Количество подключённых сервисов
services = ['PhoneService', 'MultipleLines', 'InternetService',
            'OnlineSecurity', 'OnlineBackup', 'DeviceProtection',
            'TechSupport', 'StreamingTV', 'StreamingMovies']
df['n_services'] = df[services].apply(
    lambda row: sum(1 for v in row if v not in ['No', 'No phone service',
                                                  'No internet service']),
    axis=1
)

# Средняя стоимость за сервис
df['cost_per_service'] = df['MonthlyCharges'] / df['n_services'].replace(0, 1)
\`\`\`

### 3. Tenure Features

\`\`\`python
# Группы tenure
df['is_new'] = (df['tenure'] <= 6).astype(int)
df['is_loyal'] = (df['tenure'] >= 48).astype(int)
df['tenure_squared'] = df['tenure'] ** 2

# Отношение total к monthly (фактический tenure)
df['actual_months'] = df['TotalCharges'] / df['MonthlyCharges']
\`\`\`

### 4. Financial Features

\`\`\`python
# Среднемесячный платёж за весь период
df['avg_monthly'] = df['TotalCharges'] / df['tenure'].replace(0, 1)

# Изменение расходов (рост = вовлечённость)
df['charge_growth'] = df['MonthlyCharges'] - df['avg_monthly']

# Доля от среднего по сегменту
avg_by_contract = df.groupby('Contract')['MonthlyCharges'].transform('mean')
df['charge_vs_segment'] = df['MonthlyCharges'] / avg_by_contract
\`\`\`

### 5. Contract Features

\`\`\`python
# Бинарные признаки высокого риска
df['month_to_month'] = (df['Contract'] == 'Month-to-month').astype(int)
df['no_protection'] = (
    (df['OnlineSecurity'] == 'No') &
    (df['OnlineBackup'] == 'No') &
    (df['DeviceProtection'] == 'No')
).astype(int)
df['has_support'] = (df['TechSupport'] == 'Yes').astype(int)
\`\`\`

## Кодирование категориальных признаков

\`\`\`python
from sklearn.preprocessing import LabelEncoder, OneHotEncoder

# Для tree-based моделей: Label Encoding
le_cols = ['gender', 'Partner', 'Dependents', 'PhoneService', 'PaperlessBilling']
for col in le_cols:
    df[col] = LabelEncoder().fit_transform(df[col])

# Для линейных моделей: OneHot
ohe_cols = ['Contract', 'InternetService', 'PaymentMethod']
df = pd.get_dummies(df, columns=ohe_cols, drop_first=True)
\`\`\`

## Pipeline

\`\`\`python
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder

numeric_features = ['tenure', 'MonthlyCharges', 'TotalCharges', 'n_services']
categorical_features = ['Contract', 'InternetService', 'PaymentMethod']

preprocessor = ColumnTransformer([
    ('num', StandardScaler(), numeric_features),
    ('cat', OneHotEncoder(drop='first'), categorical_features)
])

pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('classifier', LogisticRegression())
])
\`\`\``
        }
      ]
    },
    {
      id: 5,
      title: 'Практика: Создание фичей',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте набор бизнес-фичей для Churn Prediction: RFM, engagement, tenure, financial.',
      requirements: [
        'Создайте синтетический Telco Churn датасет (3000+ клиентов)',
        'Создайте минимум 8 новых признаков (RFM, engagement, tenure, financial)',
        'Закодируйте категориальные признаки',
        'Постройте sklearn Pipeline с ColumnTransformer',
        'Покажите корреляцию новых признаков с Churn'
      ],
      hint: 'pd.qcut для RFM-сегментации. ColumnTransformer для разных типов признаков. df.corr()[\'Churn\'].sort_values() для анализа корреляций.',
      expectedOutput: 'Churn Feature Engineering:\n  Оригинальных признаков: XX\n  После FE: XX\n\nНовые признаки:\n  n_services, cost_per_service, is_new, ...\n\nТоп-5 корреляций с Churn:\n  feature_name: 0.XX\n  ...',
      solution: `import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder, StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

np.random.seed(42)
n = 3000

# Создание датасета
df = pd.DataFrame({
    'gender': np.random.choice(['Male', 'Female'], n),
    'SeniorCitizen': np.random.choice([0, 1], n, p=[0.84, 0.16]),
    'Partner': np.random.choice(['Yes', 'No'], n, p=[0.48, 0.52]),
    'Dependents': np.random.choice(['Yes', 'No'], n, p=[0.30, 0.70]),
    'tenure': np.random.exponential(30, n).clip(1, 72).astype(int),
    'Contract': np.random.choice(['Month-to-month', 'One year', 'Two year'], n, p=[0.55, 0.25, 0.20]),
    'InternetService': np.random.choice(['DSL', 'Fiber optic', 'No'], n, p=[0.34, 0.44, 0.22]),
    'OnlineSecurity': np.random.choice(['Yes', 'No'], n, p=[0.35, 0.65]),
    'OnlineBackup': np.random.choice(['Yes', 'No'], n, p=[0.35, 0.65]),
    'TechSupport': np.random.choice(['Yes', 'No'], n, p=[0.35, 0.65]),
    'StreamingTV': np.random.choice(['Yes', 'No'], n, p=[0.40, 0.60]),
    'PaperlessBilling': np.random.choice(['Yes', 'No'], n, p=[0.60, 0.40]),
    'PaymentMethod': np.random.choice(
        ['Electronic check', 'Mailed check', 'Bank transfer', 'Credit card'],
        n, p=[0.34, 0.23, 0.22, 0.21]
    ),
    'MonthlyCharges': np.random.uniform(20, 110, n).round(2),
})

df['TotalCharges'] = (df['MonthlyCharges'] * df['tenure']).round(2)

# Churn
churn_prob = np.ones(n) * 0.15
churn_prob[df['Contract'] == 'Month-to-month'] += 0.25
churn_prob[df['Contract'] == 'Two year'] -= 0.10
churn_prob[df['InternetService'] == 'Fiber optic'] += 0.10
churn_prob[df['tenure'] < 12] += 0.15
churn_prob[df['OnlineSecurity'] == 'Yes'] -= 0.08
churn_prob[df['TechSupport'] == 'Yes'] -= 0.08
churn_prob[df['MonthlyCharges'] > 80] += 0.05
df['Churn'] = (np.random.random(n) < churn_prob.clip(0.02, 0.85)).astype(int)

original_cols = len(df.columns) - 1  # без Churn
print("Churn Feature Engineering:")
print(f"  Оригинальных признаков: {original_cols}")

# === Feature Engineering ===

# 1. Engagement: количество сервисов
service_cols = ['OnlineSecurity', 'OnlineBackup', 'TechSupport', 'StreamingTV']
df['n_services'] = df[service_cols].apply(lambda row: sum(1 for v in row if v == 'Yes'), axis=1)

# 2. Cost per service
df['cost_per_service'] = df['MonthlyCharges'] / (df['n_services'] + 1)

# 3. Tenure features
df['is_new'] = (df['tenure'] <= 6).astype(int)
df['is_loyal'] = (df['tenure'] >= 48).astype(int)
df['tenure_log'] = np.log1p(df['tenure'])

# 4. Financial features
df['avg_monthly'] = df['TotalCharges'] / df['tenure'].replace(0, 1)
df['charge_growth'] = df['MonthlyCharges'] - df['avg_monthly']

# 5. Contract risk
df['month_to_month'] = (df['Contract'] == 'Month-to-month').astype(int)

# 6. No protection
df['no_protection'] = (
    (df['OnlineSecurity'] == 'No') &
    (df['OnlineBackup'] == 'No') &
    (df['TechSupport'] == 'No')
).astype(int)

# 7. Electronic check (высокий churn)
df['electronic_check'] = (df['PaymentMethod'] == 'Electronic check').astype(int)

# 8. Composite risk score
df['risk_score'] = (
    df['month_to_month'] * 3 +
    df['is_new'] * 2 +
    df['no_protection'] * 1 +
    df['electronic_check'] * 1
)

new_features = ['n_services', 'cost_per_service', 'is_new', 'is_loyal',
                'tenure_log', 'avg_monthly', 'charge_growth',
                'month_to_month', 'no_protection', 'electronic_check', 'risk_score']
print(f"  После FE: {original_cols + len(new_features)}")
print(f"\\nНовые признаки: {', '.join(new_features)}")

# Кодирование категорий для корреляции
df_encoded = df.copy()
for col in ['gender', 'Partner', 'Dependents', 'PaperlessBilling',
            'OnlineSecurity', 'OnlineBackup', 'TechSupport', 'StreamingTV']:
    df_encoded[col] = LabelEncoder().fit_transform(df_encoded[col])
for col in ['Contract', 'InternetService', 'PaymentMethod']:
    df_encoded[col] = LabelEncoder().fit_transform(df_encoded[col])

# Корреляция с Churn
numeric_cols = df_encoded.select_dtypes(include=[np.number]).columns
corr = df_encoded[numeric_cols].corr()['Churn'].drop('Churn').abs().sort_values(ascending=False)

print(f"\\nТоп-10 корреляций с Churn:")
for feat, val in corr.head(10).items():
    print(f"  {feat:25s}: {val:.4f}")

# Pipeline
numeric_features = ['tenure', 'MonthlyCharges', 'TotalCharges', 'n_services',
                    'cost_per_service', 'tenure_log', 'risk_score']
categorical_features = ['Contract', 'InternetService', 'PaymentMethod']

preprocessor = ColumnTransformer([
    ('num', StandardScaler(), numeric_features),
    ('cat', OneHotEncoder(drop='first', sparse_output=False), categorical_features)
])

X = df[numeric_features + categorical_features]
y = df['Churn']
X_processed = preprocessor.fit_transform(X)
print(f"\\nPipeline output shape: {X_processed.shape}")`,
      explanation: 'Feature engineering для churn строится вокруг бизнес-логики: RFM сегментирует клиентов, engagement показывает вовлечённость, tenure features выделяют рисковые периоды, risk_score объединяет факторы. Корреляция с Churn помогает отобрать самые полезные признаки. Pipeline гарантирует воспроизводимость.'
    },
    {
      id: 6,
      title: 'Обработка дисбаланса классов',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: `# Обработка дисбаланса классов для Churn

## Проблема

В Churn-задачах обычно 70-80% клиентов не уходят. Модель, предсказывающая "не уйдёт" всегда, имеет accuracy 75%, но **бесполезна**.

\`\`\`python
# Дисбаланс
print(y.value_counts())
# 0 (не уйдёт): 2200 (73%)
# 1 (уйдёт):     800 (27%)
\`\`\`

## Методы обработки

### 1. class_weight в модели

\`\`\`python
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier

# Автоматический вес: n_samples / (n_classes * n_samples_per_class)
lr = LogisticRegression(class_weight='balanced')
rf = RandomForestClassifier(class_weight='balanced')

# Ручной вес
lr = LogisticRegression(class_weight={0: 1, 1: 3})
# Ошибка на churner стоит в 3 раза дороже
\`\`\`

### 2. SMOTE (Synthetic Minority Oversampling)

Генерирует синтетические примеры миноритарного класса:

\`\`\`python
from imblearn.over_sampling import SMOTE

smote = SMOTE(random_state=42, sampling_strategy=0.8)
# 0.8 = соотношение minority/majority после SMOTE

X_resampled, y_resampled = smote.fit_resample(X_train, y_train)
print(f"До SMOTE: {dict(zip(*np.unique(y_train, return_counts=True)))}")
print(f"После SMOTE: {dict(zip(*np.unique(y_resampled, return_counts=True)))}")
# До: {0: 1760, 1: 640}
# После: {0: 1760, 1: 1408}
\`\`\`

**Важно**: SMOTE применяется **только к train**, не к test!

### 3. Undersampling

Уменьшение мажоритарного класса:

\`\`\`python
from imblearn.under_sampling import RandomUnderSampler

under = RandomUnderSampler(random_state=42)
X_resampled, y_resampled = under.fit_resample(X_train, y_train)
# Теряем данные мажоритарного класса!
\`\`\`

### 4. SMOTE + Undersampling (комбинация)

\`\`\`python
from imblearn.combine import SMOTETomek

smotetomek = SMOTETomek(random_state=42)
X_resampled, y_resampled = smotetomek.fit_resample(X_train, y_train)
\`\`\`

### 5. Threshold Tuning

Изменение порога классификации:

\`\`\`python
from sklearn.metrics import precision_recall_curve

y_proba = model.predict_proba(X_test)[:, 1]

# Найти оптимальный threshold для F1
precisions, recalls, thresholds = precision_recall_curve(y_test, y_proba)
f1_scores = 2 * precisions * recalls / (precisions + recalls + 1e-8)
best_threshold = thresholds[np.argmax(f1_scores)]
print(f"Оптимальный threshold: {best_threshold:.3f}")

# Предсказание с новым threshold
y_pred = (y_proba >= best_threshold).astype(int)
\`\`\`

## Сравнение подходов

| Метод | Плюсы | Минусы |
|-------|-------|--------|
| class_weight | Простой, нет доп. данных | Не всегда достаточно |
| SMOTE | Генерирует новые примеры | Может создать шум |
| Undersampling | Быстро, просто | Теряет данные |
| Threshold | Гибкий, не меняет данные | Нужен calibrated model |

## Рекомендация

1. Начните с **class_weight='balanced'**
2. Если недостаточно — **SMOTE** на train
3. **Threshold tuning** для финальной настройки
4. Оценивайте по **F1 и Recall**, не accuracy!`
        }
      ]
    },
    {
      id: 7,
      title: 'Практика: Модели с балансировкой',
      type: 'practice',
      difficulty: 'medium',
      description: 'Обучите модели Churn Prediction с обработкой дисбаланса: class_weight и SMOTE.',
      requirements: [
        'Подготовьте датасет с feature engineering (из предыдущего урока)',
        'Обучите LogReg и GBT без балансировки (baseline)',
        'Обучите LogReg и GBT с class_weight="balanced"',
        'Примените SMOTE и обучите модели на сбалансированных данных',
        'Сравните F1, Recall и AUC-ROC для всех подходов'
      ],
      hint: 'from imblearn.over_sampling import SMOTE. SMOTE только на train! Используйте classification_report для детального анализа. roc_auc_score для AUC.',
      expectedOutput: 'Churn Prediction: Handling Imbalance\n  Churn rate: XX.X%\n\n| Подход         | Model | F1    | Recall | AUC   |\n|----------------|-------|-------|--------|-------|\n| Baseline       | LR    | 0.XX  | 0.XX   | 0.XX  |\n| Baseline       | GBT   | 0.XX  | 0.XX   | 0.XX  |\n| class_weight   | LR    | 0.XX  | 0.XX   | 0.XX  |\n| SMOTE          | GBT   | 0.XX  | 0.XX   | 0.XX  |',
      solution: `import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import f1_score, recall_score, roc_auc_score, classification_report

np.random.seed(42)
n = 3000

# Датасет
df = pd.DataFrame({
    'tenure': np.random.exponential(30, n).clip(1, 72).astype(int),
    'Contract': np.random.choice(['Month-to-month', 'One year', 'Two year'], n, p=[0.55, 0.25, 0.20]),
    'InternetService': np.random.choice(['DSL', 'Fiber optic', 'No'], n, p=[0.34, 0.44, 0.22]),
    'OnlineSecurity': np.random.choice(['Yes', 'No'], n, p=[0.35, 0.65]),
    'TechSupport': np.random.choice(['Yes', 'No'], n, p=[0.35, 0.65]),
    'MonthlyCharges': np.random.uniform(20, 110, n).round(2),
    'PaperlessBilling': np.random.choice([0, 1], n, p=[0.4, 0.6]),
    'SeniorCitizen': np.random.choice([0, 1], n, p=[0.84, 0.16]),
})

# Churn (несбалансированный)
churn_prob = np.ones(n) * 0.12
churn_prob[df['Contract'] == 'Month-to-month'] += 0.25
churn_prob[df['Contract'] == 'Two year'] -= 0.08
churn_prob[df['InternetService'] == 'Fiber optic'] += 0.10
churn_prob[df['tenure'] < 12] += 0.15
churn_prob[df['OnlineSecurity'] == 'Yes'] -= 0.08
churn_prob[df['MonthlyCharges'] > 80] += 0.05
df['Churn'] = (np.random.random(n) < churn_prob.clip(0.02, 0.80)).astype(int)

# Feature engineering
df['TotalCharges'] = df['MonthlyCharges'] * df['tenure']
df['n_services'] = ((df['OnlineSecurity'] == 'Yes').astype(int) + (df['TechSupport'] == 'Yes').astype(int))
df['is_new'] = (df['tenure'] <= 6).astype(int)
df['month_to_month'] = (df['Contract'] == 'Month-to-month').astype(int)
df['risk_score'] = df['month_to_month'] * 3 + df['is_new'] * 2

# Encode
for col in ['Contract', 'InternetService', 'OnlineSecurity', 'TechSupport']:
    df[col] = LabelEncoder().fit_transform(df[col])

features = ['tenure', 'Contract', 'InternetService', 'OnlineSecurity', 'TechSupport',
            'MonthlyCharges', 'TotalCharges', 'PaperlessBilling', 'SeniorCitizen',
            'n_services', 'is_new', 'month_to_month', 'risk_score']

X = df[features].values
y = df['Churn'].values

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

scaler = StandardScaler()
X_train_s = scaler.fit_transform(X_train)
X_test_s = scaler.transform(X_test)

churn_rate = y.mean()
print("Churn Prediction: Handling Imbalance")
print(f"  Churn rate: {churn_rate*100:.1f}%")
print(f"  Train: {len(y_train)} (churn={y_train.mean()*100:.1f}%)")
print(f"  Test: {len(y_test)} (churn={y_test.mean()*100:.1f}%)")

# Все эксперименты
results = []

def evaluate(name, model, X_tr, y_tr, X_te, y_te):
    model.fit(X_tr, y_tr)
    y_pred = model.predict(X_te)
    y_proba = model.predict_proba(X_te)[:, 1] if hasattr(model, 'predict_proba') else y_pred
    f1 = f1_score(y_te, y_pred)
    recall = recall_score(y_te, y_pred)
    auc = roc_auc_score(y_te, y_proba)
    results.append({'approach': name[0], 'model': name[1], 'F1': f1, 'Recall': recall, 'AUC': auc})
    return y_pred

# 1. Baseline (без балансировки)
evaluate(('Baseline', 'LR'), LogisticRegression(max_iter=1000), X_train_s, y_train, X_test_s, y_test)
evaluate(('Baseline', 'GBT'), GradientBoostingClassifier(n_estimators=100, random_state=42), X_train_s, y_train, X_test_s, y_test)

# 2. class_weight='balanced'
evaluate(('Balanced', 'LR'), LogisticRegression(class_weight='balanced', max_iter=1000), X_train_s, y_train, X_test_s, y_test)

# 3. SMOTE
try:
    from imblearn.over_sampling import SMOTE
    smote = SMOTE(random_state=42)
    X_train_smote, y_train_smote = smote.fit_resample(X_train_s, y_train)
    print(f"\\n  SMOTE: {len(y_train)} -> {len(y_train_smote)} samples")

    evaluate(('SMOTE', 'LR'), LogisticRegression(max_iter=1000), X_train_smote, y_train_smote, X_test_s, y_test)
    evaluate(('SMOTE', 'GBT'), GradientBoostingClassifier(n_estimators=100, random_state=42), X_train_smote, y_train_smote, X_test_s, y_test)
except ImportError:
    print("\\n  [!] imblearn не установлен: pip install imbalanced-learn")
    # Замена: class_weight
    evaluate(('Weight:3', 'GBT'), GradientBoostingClassifier(n_estimators=100, random_state=42), X_train_s, y_train, X_test_s, y_test)

# Таблица результатов
print(f"\\n{'Подход':<15} {'Model':<6} {'F1':>6} {'Recall':>7} {'AUC':>6}")
print("-" * 44)
for r in results:
    print(f"{r['approach']:<15} {r['model']:<6} {r['F1']:>6.4f} {r['Recall']:>7.4f} {r['AUC']:>6.4f}")

# Лучший по Recall
best = max(results, key=lambda r: r['Recall'])
print(f"\\nЛучший по Recall: {best['approach']} + {best['model']} (Recall={best['Recall']:.4f})")

# Classification report для лучшего
best_model = LogisticRegression(class_weight='balanced', max_iter=1000)
best_model.fit(X_train_s, y_train)
y_pred_best = best_model.predict(X_test_s)
print(f"\\nClassification Report (Balanced LR):")
print(classification_report(y_test, y_pred_best, target_names=['Retained', 'Churned']))`,
      explanation: 'Дисбаланс классов — ключевая проблема в churn prediction. class_weight="balanced" увеличивает штраф за ошибки на миноритарном классе. SMOTE генерирует синтетические примеры churners. Recall — главная метрика: лучше поймать больше churners с ложными срабатываниями, чем пропустить реальный отток.'
    },
    {
      id: 8,
      title: 'Интерпретируемость: SHAP',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: `# Интерпретируемость моделей: SHAP

## Зачем интерпретировать?

Бизнес-решения требуют **объяснения**:
- "Почему модель считает, что этот клиент уйдёт?"
- "Какие факторы больше всего влияют на отток?"
- "Что нужно изменить, чтобы удержать клиента?"

## SHAP (SHapley Additive exPlanations)

SHAP основан на теории игр (значения Шепли):
- Вклад каждого признака в конкретное предсказание
- Положительный SHAP → увеличивает вероятность churn
- Отрицательный SHAP → уменьшает вероятность churn

\`\`\`python
import shap

# Для tree-based моделей
model = GradientBoostingClassifier()
model.fit(X_train, y_train)

explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_test)
\`\`\`

## 1. Feature Importance (глобальная)

\`\`\`python
# Средний абсолютный SHAP value
shap.summary_plot(shap_values, X_test, feature_names=feature_names,
                  plot_type="bar")
\`\`\`

Показывает **общую важность** каждого признака:
- tenure — самый важный
- MonthlyCharges — второй
- Contract_Month-to-month — третий

## 2. SHAP Summary Plot (детальный)

\`\`\`python
shap.summary_plot(shap_values, X_test, feature_names=feature_names)
\`\`\`

Каждая точка — один клиент:
- **Красная** = высокое значение признака
- **Синяя** = низкое значение
- **Положение по X** = влияние на предсказание

Пример: tenure
- Красные точки (высокий tenure) слева → уменьшает churn
- Синие точки (низкий tenure) справа → увеличивает churn

## 3. Individual Explanation (для одного клиента)

\`\`\`python
# Объяснение для конкретного клиента
idx = 0  # индекс клиента
shap.force_plot(
    explainer.expected_value,
    shap_values[idx],
    X_test[idx],
    feature_names=feature_names
)

# Waterfall plot (более читабельный)
shap.waterfall_plot(
    shap.Explanation(
        values=shap_values[idx],
        base_values=explainer.expected_value,
        data=X_test[idx],
        feature_names=feature_names
    )
)
\`\`\`

## 4. Dependence Plot

\`\`\`python
# Как tenure влияет на churn
shap.dependence_plot("tenure", shap_values, X_test,
                      feature_names=feature_names)
\`\`\`

## 5. Partial Dependence Plots

\`\`\`python
from sklearn.inspection import PartialDependenceDisplay

features_to_plot = ['tenure', 'MonthlyCharges', 'n_services']
PartialDependenceDisplay.from_estimator(
    model, X_test, features_to_plot,
    feature_names=feature_names
)
\`\`\`

## Бизнес-применение SHAP

### Для менеджера
"Клиент X имеет **85% вероятность ухода** потому что:
- Month-to-month контракт (+25%)
- Подключён только 3 месяца (+15%)
- Нет TechSupport (+8%)
- Высокий ежемесячный платёж $95 (+7%)

**Рекомендация**: предложить годовой контракт со скидкой 20% и бесплатный TechSupport на 6 месяцев"

### Для продукта
"Топ-3 фактора оттока:
1. **Тип контракта** — 42% month-to-month клиентов уходят
2. **Срок подключения** — первые 6 месяцев критические
3. **Отсутствие TechSupport** — без поддержки churn на 15% выше"`
        }
      ]
    },
    {
      id: 9,
      title: 'Практика: SHAP анализ',
      type: 'practice',
      difficulty: 'hard',
      description: 'Проведите полный SHAP анализ модели Churn: глобальная и локальная интерпретация.',
      requirements: [
        'Обучите GradientBoosting на Churn данных',
        'Вычислите SHAP values (или используйте feature_importances_ как fallback)',
        'Покажите глобальную важность признаков',
        'Объясните предсказание для 3 конкретных клиентов',
        'Сформулируйте бизнес-рекомендации на основе интерпретации'
      ],
      hint: 'shap.TreeExplainer(model) для GBT. Если shap не установлен, используйте model.feature_importances_ и ручной анализ. Для каждого клиента покажите топ-3 фактора.',
      expectedOutput: 'SHAP Analysis: Churn Model\n  Model accuracy: 0.XX\n\nGlobal Feature Importance:\n  1. tenure: 0.XXXX\n  2. MonthlyCharges: 0.XXXX\n  ...\n\nClient Analysis:\n  Client #0: P(churn)=0.XX\n    +0.XX tenure=3 (новый клиент)\n    ...\n\nБизнес-рекомендации:\n  ...',
      solution: `import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import accuracy_score, classification_report

np.random.seed(42)
n = 3000

# Датасет
df = pd.DataFrame({
    'tenure': np.random.exponential(30, n).clip(1, 72).astype(int),
    'Contract': np.random.choice(['Month-to-month', 'One year', 'Two year'], n, p=[0.55, 0.25, 0.20]),
    'InternetService': np.random.choice(['DSL', 'Fiber optic', 'No'], n, p=[0.34, 0.44, 0.22]),
    'OnlineSecurity': np.random.choice(['Yes', 'No'], n, p=[0.35, 0.65]),
    'TechSupport': np.random.choice(['Yes', 'No'], n, p=[0.35, 0.65]),
    'MonthlyCharges': np.random.uniform(20, 110, n).round(2),
    'PaperlessBilling': np.random.choice([0, 1], n, p=[0.4, 0.6]),
    'SeniorCitizen': np.random.choice([0, 1], n, p=[0.84, 0.16]),
})

df['TotalCharges'] = df['MonthlyCharges'] * df['tenure']
df['n_services'] = ((df['OnlineSecurity'] == 'Yes').astype(int) +
                    (df['TechSupport'] == 'Yes').astype(int))
df['is_new'] = (df['tenure'] <= 6).astype(int)
df['month_to_month'] = (df['Contract'] == 'Month-to-month').astype(int)
df['risk_score'] = df['month_to_month'] * 3 + df['is_new'] * 2

churn_prob = np.ones(n) * 0.12
churn_prob[df['Contract'] == 'Month-to-month'] += 0.25
churn_prob[df['Contract'] == 'Two year'] -= 0.08
churn_prob[df['InternetService'] == 'Fiber optic'] += 0.10
churn_prob[df['tenure'] < 12] += 0.15
churn_prob[df['OnlineSecurity'] == 'Yes'] -= 0.08
churn_prob[df['TechSupport'] == 'Yes'] -= 0.08
churn_prob[df['MonthlyCharges'] > 80] += 0.05
df['Churn'] = (np.random.random(n) < churn_prob.clip(0.02, 0.80)).astype(int)

# Encode
for col in ['Contract', 'InternetService', 'OnlineSecurity', 'TechSupport']:
    df[col] = LabelEncoder().fit_transform(df[col])

features = ['tenure', 'Contract', 'InternetService', 'OnlineSecurity', 'TechSupport',
            'MonthlyCharges', 'TotalCharges', 'PaperlessBilling', 'SeniorCitizen',
            'n_services', 'is_new', 'month_to_month', 'risk_score']

X = df[features].values
y = df['Churn'].values
feature_names = features

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

# Модель
model = GradientBoostingClassifier(
    n_estimators=200, max_depth=5, learning_rate=0.1,
    subsample=0.8, random_state=42
)
model.fit(X_train, y_train)
y_pred = model.predict(X_test)
y_proba = model.predict_proba(X_test)[:, 1]

acc = accuracy_score(y_test, y_pred)
print("SHAP Analysis: Churn Model")
print(f"  Model accuracy: {acc:.4f}")
print(f"  Churn rate: {y.mean()*100:.1f}%")

# SHAP или feature_importances_
try:
    import shap
    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(X_test)
    mean_shap = np.abs(shap_values).mean(axis=0)
    use_shap = True
except ImportError:
    mean_shap = model.feature_importances_
    use_shap = False
    print("  [!] shap не установлен, используем feature_importances_")

# Глобальная важность
sorted_idx = np.argsort(mean_shap)[::-1]
print(f"\\nGlobal Feature Importance ({'SHAP' if use_shap else 'Gini'}):")
for rank, idx in enumerate(sorted_idx[:10], 1):
    print(f"  {rank:2d}. {feature_names[idx]:20s}: {mean_shap[idx]:.4f}")

# Анализ конкретных клиентов
print(f"\\n{'='*60}")
print("Client Analysis:")

# Выбираем интересных клиентов: high churn, medium, low
high_churn_idx = np.where(y_proba > 0.7)[0][:1]
medium_churn_idx = np.where((y_proba > 0.4) & (y_proba < 0.6))[0][:1]
low_churn_idx = np.where(y_proba < 0.2)[0][:1]
client_indices = np.concatenate([high_churn_idx, medium_churn_idx, low_churn_idx])

for ci in client_indices:
    p_churn = y_proba[ci]
    actual = "Ушёл" if y_test[ci] == 1 else "Остался"
    risk = "ВЫСОКИЙ" if p_churn > 0.5 else "СРЕДНИЙ" if p_churn > 0.3 else "НИЗКИЙ"
    print(f"\\n  Client #{ci}: P(churn)={p_churn:.4f} [{risk} РИСК] (факт: {actual})")

    # Вклады признаков
    if use_shap:
        client_shap = shap_values[ci]
    else:
        # Приближение через feature importance * value
        client_shap = model.feature_importances_ * X_test[ci]

    contrib_idx = np.argsort(np.abs(client_shap))[::-1]
    print(f"    Ключевые факторы:")
    for j in contrib_idx[:5]:
        direction = "+" if client_shap[j] > 0 else "-"
        value = X_test[ci, j]
        print(f"      {direction}{abs(client_shap[j]):.4f} {feature_names[j]}={value:.1f}")

    # Рекомендация
    if p_churn > 0.5:
        client = X_test[ci]
        actions = []
        if client[features.index('month_to_month')] == 1:
            actions.append("предложить годовой контракт со скидкой")
        if client[features.index('n_services')] < 2:
            actions.append("предложить пакет доп. сервисов")
        if client[features.index('tenure')] < 12:
            actions.append("назначить персонального менеджера")
        if actions:
            print(f"    Рекомендации: {'; '.join(actions)}")

# Бизнес-рекомендации
print(f"\\n{'='*60}")
print("Бизнес-рекомендации:")
top_features = [feature_names[i] for i in sorted_idx[:3]]
print(f"  Топ-3 фактора оттока: {', '.join(top_features)}")
print(f"\\n  1. КОНТРАКТ: month-to-month клиенты уходят в 3-4 раза чаще")
print(f"     -> Акция: скидка 20% при переходе на годовой контракт")
print(f"  2. TENURE: первые 6 месяцев — зона риска")
print(f"     -> Welcome-программа: звонок на 1, 7, 30 день")
print(f"  3. СЕРВИСЫ: клиенты без доп. сервисов менее привязаны")
print(f"     -> Бесплатный trial TechSupport и OnlineSecurity на 3 месяца")
print(f"\\n  Ожидаемый эффект: снижение churn на 15-25% для целевой группы")`,
      explanation: 'SHAP объясняет каждое предсказание: какие признаки увеличивают/уменьшают вероятность churn. Для бизнеса это критически важно — менеджер понимает, ПОЧЕМУ клиент уходит и ЧТО делать. Глобальный анализ выявляет системные проблемы (контракт, tenure), локальный — персональные действия для каждого клиента.'
    },
    {
      id: 10,
      title: 'Практика: Dashboard для менеджера',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте Streamlit dashboard для управления оттоком клиентов: прогноз, анализ, рекомендации.',
      requirements: [
        'Обучите Churn модель и сохраните',
        'Создайте Streamlit dashboard с 3 разделами: обзор, анализ клиента, рекомендации',
        'Добавьте интерактивные фильтры: по контракту, tenure, risk level',
        'Покажите список клиентов с высоким риском оттока',
        'Выведите полный код приложения'
      ],
      hint: 'st.sidebar для фильтров, st.metric для KPI, st.dataframe для таблиц. st.tabs для разделов. st.bar_chart для графиков.',
      expectedOutput: 'Churn Dashboard:\n  Model trained: accuracy=0.XX\n  High-risk clients: XX\n\nStreamlit Features:\n  Tab 1: KPI обзор (churn rate, revenue at risk, CLV)\n  Tab 2: Анализ клиента (прогноз + объяснение)\n  Tab 3: Рекомендации (действия по удержанию)\n\nRun: streamlit run churn_dashboard.py',
      solution: `import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import accuracy_score
import json

np.random.seed(42)
n = 3000

# Датасет
df = pd.DataFrame({
    'customer_id': [f'C{i:04d}' for i in range(n)],
    'tenure': np.random.exponential(30, n).clip(1, 72).astype(int),
    'Contract': np.random.choice(['Month-to-month', 'One year', 'Two year'], n, p=[0.55, 0.25, 0.20]),
    'InternetService': np.random.choice(['DSL', 'Fiber optic', 'No'], n, p=[0.34, 0.44, 0.22]),
    'OnlineSecurity': np.random.choice(['Yes', 'No'], n, p=[0.35, 0.65]),
    'TechSupport': np.random.choice(['Yes', 'No'], n, p=[0.35, 0.65]),
    'MonthlyCharges': np.random.uniform(20, 110, n).round(2),
    'PaperlessBilling': np.random.choice([0, 1], n, p=[0.4, 0.6]),
    'SeniorCitizen': np.random.choice([0, 1], n, p=[0.84, 0.16]),
})

df['TotalCharges'] = (df['MonthlyCharges'] * df['tenure']).round(2)
df['n_services'] = ((df['OnlineSecurity'] == 'Yes').astype(int) +
                    (df['TechSupport'] == 'Yes').astype(int))
df['is_new'] = (df['tenure'] <= 6).astype(int)
df['month_to_month'] = (df['Contract'] == 'Month-to-month').astype(int)
df['risk_score'] = df['month_to_month'] * 3 + df['is_new'] * 2

churn_prob = np.ones(n) * 0.12
churn_prob[df['Contract'] == 'Month-to-month'] += 0.25
churn_prob[df['Contract'] == 'Two year'] -= 0.08
churn_prob[df['InternetService'] == 'Fiber optic'] += 0.10
churn_prob[df['tenure'] < 12] += 0.15
churn_prob[df['OnlineSecurity'] == 'Yes'] -= 0.08
churn_prob[df['MonthlyCharges'] > 80] += 0.05
df['Churn'] = (np.random.random(n) < churn_prob.clip(0.02, 0.80)).astype(int)

# Encode для модели
df_model = df.copy()
for col in ['Contract', 'InternetService', 'OnlineSecurity', 'TechSupport']:
    df_model[col] = LabelEncoder().fit_transform(df_model[col])

features = ['tenure', 'Contract', 'InternetService', 'OnlineSecurity', 'TechSupport',
            'MonthlyCharges', 'TotalCharges', 'PaperlessBilling', 'SeniorCitizen',
            'n_services', 'is_new', 'month_to_month', 'risk_score']

X = df_model[features].values
y = df_model['Churn'].values

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

model = GradientBoostingClassifier(n_estimators=200, max_depth=5, learning_rate=0.1, random_state=42)
model.fit(X_train, y_train)
acc = accuracy_score(y_test, model.predict(X_test))

# Предсказания для всех клиентов
all_proba = model.predict_proba(X)[:, 1]
df['churn_probability'] = all_proba
df['risk_level'] = pd.cut(all_proba, bins=[0, 0.3, 0.6, 1.0], labels=['Low', 'Medium', 'High'])

high_risk = (df['risk_level'] == 'High').sum()
revenue_at_risk = df[df['risk_level'] == 'High']['MonthlyCharges'].sum()

print("Churn Dashboard:")
print(f"  Model trained: accuracy={acc:.4f}")
print(f"  High-risk clients: {high_risk}")
print(f"  Revenue at risk: {revenue_at_risk:,.0f} USD/month")

# KPI
churn_rate = df['Churn'].mean()
avg_clv = df['MonthlyCharges'].mean() / churn_rate
print(f"\\n  KPI:")
print(f"    Churn Rate: {churn_rate*100:.1f}%")
print(f"    Avg CLV: {avg_clv:,.0f} USD")
print(f"    Revenue at risk: {revenue_at_risk:,.0f} USD/month")

# High risk clients
print(f"\\n  Top-5 High-Risk Clients:")
high_risk_df = df.nlargest(5, 'churn_probability')
for _, row in high_risk_df.iterrows():
    print(f"    {row['customer_id']}: P={row['churn_probability']:.2f}, "
          f"{row['MonthlyCharges']:.0f} USD/mo, tenure={row['tenure']}, "
          f"contract={row['Contract']}")

# === Streamlit Dashboard Code ===
streamlit_code = '''
import streamlit as st
import pandas as pd
import numpy as np
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split

st.set_page_config(page_title="Churn Dashboard", page_icon="📊", layout="wide")

@st.cache_data
def load_and_train():
    np.random.seed(42)
    n = 3000
    df = pd.DataFrame({
        'customer_id': [f'C{i:04d}' for i in range(n)],
        'tenure': np.random.exponential(30, n).clip(1, 72).astype(int),
        'Contract': np.random.choice(['Month-to-month', 'One year', 'Two year'], n, p=[0.55, 0.25, 0.20]),
        'InternetService': np.random.choice(['DSL', 'Fiber optic', 'No'], n, p=[0.34, 0.44, 0.22]),
        'OnlineSecurity': np.random.choice(['Yes', 'No'], n, p=[0.35, 0.65]),
        'TechSupport': np.random.choice(['Yes', 'No'], n, p=[0.35, 0.65]),
        'MonthlyCharges': np.random.uniform(20, 110, n).round(2),
        'SeniorCitizen': np.random.choice([0, 1], n, p=[0.84, 0.16]),
    })
    df['TotalCharges'] = (df['MonthlyCharges'] * df['tenure']).round(2)
    df['n_services'] = ((df['OnlineSecurity']=='Yes').astype(int) + (df['TechSupport']=='Yes').astype(int))
    df['is_new'] = (df['tenure'] <= 6).astype(int)
    df['month_to_month'] = (df['Contract'] == 'Month-to-month').astype(int)
    df['risk_score'] = df['month_to_month'] * 3 + df['is_new'] * 2

    churn_prob = np.ones(n) * 0.12
    churn_prob[df['Contract'] == 'Month-to-month'] += 0.25
    churn_prob[df['tenure'] < 12] += 0.15
    churn_prob[df['OnlineSecurity'] == 'Yes'] -= 0.08
    df['Churn'] = (np.random.random(n) < churn_prob.clip(0.02, 0.80)).astype(int)

    df_enc = df.copy()
    for col in ['Contract', 'InternetService', 'OnlineSecurity', 'TechSupport']:
        df_enc[col] = LabelEncoder().fit_transform(df_enc[col])

    features = ['tenure', 'Contract', 'InternetService', 'OnlineSecurity', 'TechSupport',
                'MonthlyCharges', 'TotalCharges', 'SeniorCitizen', 'n_services', 'is_new',
                'month_to_month', 'risk_score']
    X = df_enc[features].values
    y = df_enc['Churn'].values

    model = GradientBoostingClassifier(n_estimators=200, max_depth=5, random_state=42)
    model.fit(X, y)

    df['churn_prob'] = model.predict_proba(X)[:, 1]
    df['risk_level'] = pd.cut(df['churn_prob'], bins=[0, 0.3, 0.6, 1.0], labels=['Low', 'Medium', 'High'])
    return df, model, features

df, model, features = load_and_train()

st.title("📊 Churn Management Dashboard")

# Sidebar filters
st.sidebar.header("Фильтры")
contract_filter = st.sidebar.multiselect(
    "Контракт", df['Contract'].unique(), default=df['Contract'].unique()
)
risk_filter = st.sidebar.multiselect(
    "Уровень риска", ['High', 'Medium', 'Low'], default=['High', 'Medium', 'Low']
)
tenure_range = st.sidebar.slider("Tenure (мес)", 1, 72, (1, 72))

filtered = df[
    (df['Contract'].isin(contract_filter)) &
    (df['risk_level'].isin(risk_filter)) &
    (df['tenure'].between(*tenure_range))
]

# Tabs
tab1, tab2, tab3 = st.tabs(["📈 Обзор", "🔍 Анализ клиента", "💡 Рекомендации"])

with tab1:
    col1, col2, col3, col4 = st.columns(4)
    col1.metric("Churn Rate", f"{filtered['Churn'].mean()*100:.1f}%")
    col2.metric("Клиентов", len(filtered))
    col3.metric("Revenue at Risk",
                f"{filtered[filtered['risk_level']=='High']['MonthlyCharges'].sum():,.0f} USD/mo")
    col4.metric("High Risk", (filtered['risk_level']=='High').sum())

    st.subheader("Churn по контракту")
    churn_by_contract = filtered.groupby('Contract')['Churn'].mean() * 100
    st.bar_chart(churn_by_contract)

    st.subheader("Клиенты высокого риска")
    high_risk = filtered[filtered['risk_level']=='High'].nlargest(10, 'churn_prob')
    st.dataframe(high_risk[['customer_id', 'tenure', 'Contract', 'MonthlyCharges',
                            'churn_prob', 'risk_level']].reset_index(drop=True))

with tab2:
    st.subheader("Анализ конкретного клиента")
    customer = st.selectbox("ID клиента", df['customer_id'].values)
    client = df[df['customer_id'] == customer].iloc[0]

    col1, col2, col3 = st.columns(3)
    col1.metric("P(Churn)", f"{client['churn_prob']:.1%}")
    col2.metric("Tenure", f"{client['tenure']} мес")
    col3.metric("Ежемесячный платёж", f"{client['MonthlyCharges']:.0f} USD")

    st.write(f"**Контракт:** {client['Contract']}")
    st.write(f"**Интернет:** {client['InternetService']}")
    st.write(f"**Уровень риска:** {client['risk_level']}")

    if client['churn_prob'] > 0.5:
        st.error("⚠️ Высокий риск оттока! Требуется действие.")
    elif client['churn_prob'] > 0.3:
        st.warning("⚡ Средний риск. Рекомендуется внимание.")
    else:
        st.success("✅ Низкий риск. Клиент стабилен.")

with tab3:
    st.subheader("Программы удержания")

    n_high = (filtered['risk_level']=='High').sum()
    n_mtm = ((filtered['Contract']=='Month-to-month') & (filtered['risk_level']=='High')).sum()
    n_new = ((filtered['is_new']==1) & (filtered['risk_level']=='High')).sum()

    st.markdown(f"""
    ### Рекомендации:

    1. **Миграция контрактов** ({n_mtm} клиентов)
       - Предложить годовой контракт со скидкой 20%
       - Ожидаемое снижение churn: 30-40%

    2. **Программа онбординга** ({n_new} новых клиентов)
       - Welcome-звонок на 1, 7, 30 день
       - Персональный менеджер первые 3 месяца

    3. **Пакетные предложения** (все high-risk)
       - Бесплатный TechSupport на 6 месяцев
       - Скидка 10% при подключении 3+ сервисов

    **Потенциальный эффект:**
    - Удержание {int(n_high * 0.3)} клиентов
    - Сохранение {filtered[filtered['risk_level']=='High']['MonthlyCharges'].sum() * 0.3:,.0f} USD/month
    """)
'''

print(f"\\nStreamlit Features:")
print(f"  Tab 1: KPI обзор (churn rate, revenue at risk, high-risk list)")
print(f"  Tab 2: Анализ клиента (вероятность, факторы, рекомендации)")
print(f"  Tab 3: Программы удержания (конкретные действия с ROI)")
print(f"\\nЗапуск: streamlit run churn_dashboard.py")
print(f"\\n--- Streamlit Dashboard Code ---")
print(streamlit_code)`,
      explanation: 'Streamlit dashboard делает ML-модель доступной для бизнеса. Tab 1 показывает KPI и список рисковых клиентов. Tab 2 позволяет менеджеру анализировать конкретного клиента с объяснением модели. Tab 3 предлагает конкретные программы удержания с оценкой эффекта. Это превращает ML-модель в бизнес-инструмент.'
    }
  ]
}