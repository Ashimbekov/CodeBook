export default {
  id: 47,
  title: 'Проект: Классификация отзывов (NLP)',
  description: 'NLP-проект от предобработки текста до fine-tuning BERT: sentiment analysis с TF-IDF, LSTM и трансформерами.',
  lessons: [
    {
      id: 1,
      title: 'Описание проекта: Sentiment Analysis',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: `# Проект: Классификация отзывов (Sentiment Analysis)

## Цель проекта

Построить модель, которая автоматически определяет тональность текста — **положительный** или **отрицательный** отзыв. Это одна из ключевых задач NLP (Natural Language Processing).

## Бизнес-применение

- **E-commerce**: анализ отзывов на товары
- **Социальные сети**: мониторинг мнений о бренде
- **Поддержка клиентов**: приоритизация негативных обращений
- **Финансы**: анализ новостей для прогноза рынка

## Датасеты

### IMDB Reviews (50,000 отзывов)
\`\`\`python
# Через tensorflow/keras
from tensorflow.keras.datasets import imdb
(X_train, y_train), (X_test, y_test) = imdb.load_data(num_words=10000)

# Через datasets (Hugging Face)
from datasets import load_dataset
dataset = load_dataset('imdb')
\`\`\`

### Amazon Reviews
\`\`\`python
from datasets import load_dataset
dataset = load_dataset('amazon_polarity')
\`\`\`

## Подходы к задаче

| Подход | Модель | Accuracy |
|--------|--------|----------|
| Классический ML | TF-IDF + LogReg | ~88% |
| Deep Learning | LSTM/GRU | ~89-91% |
| Transfer Learning | BERT fine-tuning | ~93-95% |

## План проекта

1. **Предобработка текста** — очистка, токенизация, нормализация
2. **Классический ML** — TF-IDF + LogisticRegression
3. **Deep Learning** — LSTM classifier
4. **Transfer Learning** — BERT fine-tuning
5. **Сравнение** — бенчмарк всех подходов

## Метрики для NLP

\`\`\`python
from sklearn.metrics import accuracy_score, f1_score, classification_report

accuracy = accuracy_score(y_true, y_pred)
f1 = f1_score(y_true, y_pred)
print(classification_report(y_true, y_pred, target_names=['Negative', 'Positive']))
\`\`\`

Для бинарной классификации:
- **Accuracy** — доля правильных ответов
- **F1-score** — гармоническое среднее precision и recall
- **AUC-ROC** — площадь под ROC-кривой`
        }
      ]
    },
    {
      id: 2,
      title: 'Текстовый preprocessing',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: `# Предобработка текста для NLP

## Почему текст нужно обрабатывать?

Машинные модели работают с числами, не с текстом. Задача preprocessing — привести текст к чистой, унифицированной форме.

## 1. Очистка текста

\`\`\`python
import re

def clean_text(text):
    # Нижний регистр
    text = text.lower()
    # Удаление HTML-тегов
    text = re.sub(r'<[^>]+>', '', text)
    # Удаление URL
    text = re.sub(r'http\\S+|www\\S+', '', text)
    # Удаление email
    text = re.sub(r'\\S+@\\S+', '', text)
    # Удаление спецсимволов (оставляем буквы и пробелы)
    text = re.sub(r'[^a-zA-Zа-яА-Я\\s]', '', text)
    # Удаление лишних пробелов
    text = re.sub(r'\\s+', ' ', text).strip()
    return text

text = "Great movie!!! 5/5 <br>See https://example.com"
print(clean_text(text))  # "great movie see"
\`\`\`

## 2. Токенизация

Разбиение текста на отдельные слова (токены):

\`\`\`python
# Простая токенизация
tokens = text.split()

# NLTK токенизация
import nltk
nltk.download('punkt')
from nltk.tokenize import word_tokenize
tokens = word_tokenize("I can't believe it!")
# ['I', 'ca', "n't", 'believe', 'it', '!']
\`\`\`

## 3. Стоп-слова

Частые слова без смысловой нагрузки (the, is, a, an...):

\`\`\`python
import nltk
nltk.download('stopwords')
from nltk.corpus import stopwords

stop_words = set(stopwords.words('english'))
tokens = [w for w in tokens if w not in stop_words]

# "the movie was really great" -> ["movie", "really", "great"]
\`\`\`

## 4. Стемминг

Отсечение окончаний до корня:

\`\`\`python
from nltk.stem import PorterStemmer

stemmer = PorterStemmer()
words = ['running', 'runs', 'ran', 'runner']
stemmed = [stemmer.stem(w) for w in words]
# ['run', 'run', 'ran', 'runner']
\`\`\`

## 5. Лемматизация

Приведение к словарной форме (точнее стемминга):

\`\`\`python
import nltk
nltk.download('wordnet')
from nltk.stem import WordNetLemmatizer

lemmatizer = WordNetLemmatizer()
words = ['running', 'better', 'geese', 'was']
lemmas = [lemmatizer.lemmatize(w, pos='v') for w in words]
# ['run', 'better', 'geese', 'be']
\`\`\`

## 6. Полный pipeline

\`\`\`python
import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

nltk.download(['punkt', 'stopwords', 'wordnet'], quiet=True)

class TextPreprocessor:
    def __init__(self):
        self.stop_words = set(stopwords.words('english'))
        self.lemmatizer = WordNetLemmatizer()

    def process(self, text):
        # Очистка
        text = text.lower()
        text = re.sub(r'<[^>]+>', '', text)
        text = re.sub(r'[^a-z\\s]', '', text)

        # Токенизация
        tokens = text.split()

        # Удаление стоп-слов + лемматизация
        tokens = [
            self.lemmatizer.lemmatize(w)
            for w in tokens
            if w not in self.stop_words and len(w) > 2
        ]

        return ' '.join(tokens)

preprocessor = TextPreprocessor()
text = "This movie was absolutely TERRIBLE!!! <br>Worst film ever..."
print(preprocessor.process(text))
# "movie absolutely terrible worst film ever"
\`\`\`

## Ключевые моменты

- **Стемминг** — быстрый, но грубый (loving -> lov)
- **Лемматизация** — медленнее, но точнее (loving -> love)
- **Стоп-слова** — удаляем для BoW/TF-IDF, НЕ удаляем для BERT
- Для **deep learning** (LSTM, BERT) предобработка минимальна — модель учится сама`
        }
      ]
    },
    {
      id: 3,
      title: 'Практика: Очистка текста',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реализуйте полный pipeline предобработки текстов для sentiment analysis.',
      requirements: [
        'Создайте синтетический датасет из 200+ отзывов (положительных и отрицательных)',
        'Реализуйте функцию clean_text: lowercase, удаление HTML/URL/спецсимволов',
        'Добавьте удаление стоп-слов и лемматизацию',
        'Примените preprocessing ко всему датасету',
        'Выведите статистику: средняя длина до/после обработки, размер словаря'
      ],
      hint: 'Для синтетического датасета используйте шаблоны: positive_templates = ["Great {noun}", "Amazing {adj} movie"]. nltk.download(\'stopwords\') для стоп-слов.',
      expectedOutput: 'Text Preprocessing Pipeline:\nОтзывов: 200+\n  Positive: XXX\n  Negative: XXX\n\nДо обработки:\n  Ср. длина: XX.X слов\n  Словарь: XXXX слов\n\nПосле обработки:\n  Ср. длина: XX.X слов\n  Словарь: XXX слов\n\nПримеры:\n  ...',
      solution: `import numpy as np
import re

np.random.seed(42)

# Создание синтетического датасета
positive_phrases = [
    "Great movie with amazing acting",
    "Absolutely loved this film wonderful story",
    "Best movie ever seen highly recommend",
    "Fantastic performance by the lead actor brilliant",
    "Beautiful cinematography and excellent direction",
    "Heartwarming story with great characters",
    "Outstanding film truly masterpiece",
    "Incredible plot twists kept me engaged",
    "Loved every minute entertaining and fun",
    "Perfect movie for the whole family delightful",
    "Superb acting and wonderful screenplay",
    "Amazing visual effects and great soundtrack",
    "Really enjoyed this one great entertainment",
    "Brilliant film with deep meaningful story",
    "Excellent movie would watch again and again"
]

negative_phrases = [
    "Terrible movie waste of time boring",
    "Worst film ever seen awful acting",
    "Horrible plot made no sense at all",
    "Complete disaster boring and predictable",
    "Really bad movie dont waste your money",
    "Awful screenplay terrible direction",
    "Boring and slow nothing happens",
    "Disappointing movie expected much better",
    "Worst movie of the year avoid",
    "Terrible acting and stupid plot horrible",
    "Painfully bad movie fell asleep",
    "Absolutely dreadful waste of two hours",
    "Nothing good about this movie terrible",
    "Bad acting bad story bad everything",
    "Unwatchable garbage worst experience ever"
]

noises = [
    " <br> ", " <p>check</p> ", " http://example.com ",
    "!!! ", "... ", " @user ", " #movie ", " 5/10 ", " :) ", " :( ",
    " $$ ", " ** ", " >> ", ""
]

texts, labels = [], []
for _ in range(120):
    text = np.random.choice(positive_phrases) + np.random.choice(noises)
    texts.append(text)
    labels.append(1)
for _ in range(100):
    text = np.random.choice(negative_phrases) + np.random.choice(noises)
    texts.append(text)
    labels.append(0)

labels = np.array(labels)

print("Text Preprocessing Pipeline:")
print(f"Отзывов: {len(texts)}")
print(f"  Positive: {(labels == 1).sum()}")
print(f"  Negative: {(labels == 0).sum()}")

# Статистика до обработки
raw_lengths = [len(t.split()) for t in texts]
raw_vocab = set(w for t in texts for w in t.split())
print(f"\\nДо обработки:")
print(f"  Ср. длина: {np.mean(raw_lengths):.1f} слов")
print(f"  Словарь: {len(raw_vocab)} слов")

# Preprocessing pipeline
stop_words = {
    'the', 'a', 'an', 'is', 'was', 'were', 'are', 'be', 'been',
    'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
    'would', 'could', 'should', 'may', 'might', 'can', 'shall',
    'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from',
    'it', 'its', 'this', 'that', 'these', 'those', 'i', 'me',
    'my', 'we', 'our', 'you', 'your', 'he', 'she', 'they',
    'and', 'but', 'or', 'not', 'no', 'so', 'if', 'as'
}

def clean_text(text):
    text = text.lower()
    text = re.sub(r'<[^>]+>', ' ', text)
    text = re.sub(r'http\\S+|www\\S+', '', text)
    text = re.sub(r'\\S+@\\S+', '', text)
    text = re.sub(r'#\\w+', '', text)
    text = re.sub(r'[^a-z\\s]', ' ', text)
    text = re.sub(r'\\s+', ' ', text).strip()
    tokens = text.split()
    tokens = [w for w in tokens if w not in stop_words and len(w) > 2]
    return ' '.join(tokens)

# Применение
cleaned_texts = [clean_text(t) for t in texts]

clean_lengths = [len(t.split()) for t in cleaned_texts]
clean_vocab = set(w for t in cleaned_texts for w in t.split())
print(f"\\nПосле обработки:")
print(f"  Ср. длина: {np.mean(clean_lengths):.1f} слов")
print(f"  Словарь: {len(clean_vocab)} слов")

# Примеры
print(f"\\nПримеры:")
for i in [0, 120, 5, 130]:
    label = "POS" if labels[i] == 1 else "NEG"
    print(f"  [{label}] {texts[i][:60]}...")
    print(f"       -> {cleaned_texts[i]}")`,
      explanation: 'Preprocessing очищает текст от шума (HTML, URL, спецсимволы), приводит к единому регистру и удаляет неинформативные слова. Размер словаря значительно уменьшается, что ускоряет обучение. Для классического ML (TF-IDF) preprocessing критически важен.'
    },
    {
      id: 4,
      title: 'Векторизация текста',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: `# Векторизация текста: от слов к числам

## Проблема

ML-модели работают с числами. Нужно преобразовать текст в числовые векторы.

## 1. Bag of Words (BoW)

Каждый документ — вектор частот слов:

\`\`\`python
from sklearn.feature_extraction.text import CountVectorizer

corpus = ["I love this movie", "This movie is terrible", "Great film"]
vectorizer = CountVectorizer()
X = vectorizer.fit_transform(corpus)

print(vectorizer.get_feature_names_out())
# ['film', 'great', 'is', 'love', 'movie', 'terrible', 'this']
print(X.toarray())
# [[0, 0, 0, 1, 1, 0, 1],  <- "I love this movie"
#  [0, 0, 1, 0, 1, 1, 1],  <- "This movie is terrible"
#  [1, 1, 0, 0, 0, 0, 0]]  <- "Great film"
\`\`\`

**Проблема BoW**: не учитывает важность слов. "the" встречается часто, но неинформативно.

## 2. TF-IDF (Term Frequency — Inverse Document Frequency)

Взвешивает слова по важности:
- **TF** = частота слова в документе
- **IDF** = log(N / df) — чем реже слово в корпусе, тем оно важнее

\`\`\`python
from sklearn.feature_extraction.text import TfidfVectorizer

tfidf = TfidfVectorizer(
    max_features=10000,     # макс размер словаря
    ngram_range=(1, 2),     # униграммы + биграммы
    min_df=2,               # мин документов со словом
    max_df=0.95,            # макс доля документов (фильтр частых)
    sublinear_tf=True       # 1 + log(tf) вместо tf
)

X = tfidf.fit_transform(texts)
print(f"Размерность: {X.shape}")  # (n_docs, n_features)
\`\`\`

**Биграммы** (ngram_range=(1,2)) улавливают фразы:
- "not good" — биграмм "not_good" несёт негативный смысл
- "good" — униграмм несёт положительный смысл

## 3. Word2Vec

Каждое слово — плотный вектор в пространстве:

\`\`\`python
from gensim.models import Word2Vec

sentences = [text.split() for text in cleaned_texts]
model = Word2Vec(sentences, vector_size=100, window=5, min_count=2)

# Вектор слова
vector = model.wv['movie']  # 100-мерный вектор

# Похожие слова
similar = model.wv.most_similar('movie')
# [('film', 0.85), ('picture', 0.72), ...]

# Вектор документа = среднее векторов слов
def doc_vector(text, model):
    words = text.split()
    vectors = [model.wv[w] for w in words if w in model.wv]
    if vectors:
        return np.mean(vectors, axis=0)
    return np.zeros(model.vector_size)
\`\`\`

## 4. Предобученные эмбеддинги

\`\`\`python
# GloVe (Stanford)
# Скачать: https://nlp.stanford.edu/projects/glove/
embeddings = {}
with open('glove.6B.100d.txt', 'r') as f:
    for line in f:
        values = line.split()
        word = values[0]
        vector = np.array(values[1:], dtype='float32')
        embeddings[word] = vector

# FastText (Facebook)
import fasttext
model = fasttext.load_model('cc.en.300.bin')
vector = model.get_word_vector('movie')
\`\`\`

## Сравнение подходов

| Метод | Размерность | Семантика | Скорость |
|-------|------------|-----------|----------|
| BoW | Высокая (разреженная) | Нет | Быстро |
| TF-IDF | Высокая (разреженная) | Частичная | Быстро |
| Word2Vec | Низкая (плотная) | Да | Средне |
| BERT | 768 (плотная) | Глубокая | Медленно |

## Рекомендации

- **Baseline**: TF-IDF + LogisticRegression
- **Средний уровень**: Word2Vec + LSTM
- **Лучший результат**: BERT fine-tuning`
        }
      ]
    },
    {
      id: 5,
      title: 'Практика: TF-IDF + Logistic Regression',
      type: 'practice',
      difficulty: 'medium',
      description: 'Постройте baseline NLP-модель: TF-IDF + LogisticRegression для sentiment analysis.',
      requirements: [
        'Создайте синтетический датасет из 500+ отзывов',
        'Примените TfidfVectorizer с биграммами',
        'Обучите LogisticRegression и сравните с Naive Bayes и LinearSVC',
        'Выведите classification report и accuracy для каждой модели',
        'Покажите топ-10 самых важных слов для каждого класса'
      ],
      hint: 'TfidfVectorizer(max_features=5000, ngram_range=(1,2)). Для важных слов используйте model.coef_[0] — положительные коэффициенты соответствуют позитивным словам.',
      expectedOutput: 'TF-IDF Sentiment Classifier:\nОтзывов: 500+, Vocab size: XXXX\n\nModels (accuracy):\n  LogReg: 0.XX\n  NaiveBayes: 0.XX\n  LinearSVC: 0.XX\n\nТоп-10 позитивных слов: ...\nТоп-10 негативных слов: ...',
      solution: `import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import MultinomialNB
from sklearn.svm import LinearSVC
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import classification_report
import re

np.random.seed(42)

# Создание датасета
positive_words = [
    "amazing", "great", "excellent", "wonderful", "fantastic",
    "brilliant", "outstanding", "superb", "perfect", "love",
    "beautiful", "incredible", "awesome", "entertaining", "enjoyed",
    "masterpiece", "recommend", "best", "touching", "captivating"
]
negative_words = [
    "terrible", "awful", "horrible", "worst", "bad",
    "boring", "waste", "disappointing", "dreadful", "hate",
    "stupid", "pathetic", "unwatchable", "disaster", "painful",
    "ridiculous", "poor", "mediocre", "annoying", "forgettable"
]
neutral_words = [
    "movie", "film", "story", "acting", "plot",
    "character", "scene", "director", "performance", "script"
]

texts, labels = [], []
for _ in range(300):
    n_words = np.random.randint(6, 15)
    pos_count = np.random.randint(2, 5)
    neu_count = n_words - pos_count
    words = list(np.random.choice(positive_words, pos_count)) + \\
            list(np.random.choice(neutral_words, neu_count))
    np.random.shuffle(words)
    texts.append(' '.join(words))
    labels.append(1)

for _ in range(280):
    n_words = np.random.randint(6, 15)
    neg_count = np.random.randint(2, 5)
    neu_count = n_words - neg_count
    words = list(np.random.choice(negative_words, neg_count)) + \\
            list(np.random.choice(neutral_words, neu_count))
    np.random.shuffle(words)
    texts.append(' '.join(words))
    labels.append(0)

labels = np.array(labels)

# TF-IDF
tfidf = TfidfVectorizer(max_features=5000, ngram_range=(1, 2), min_df=2)
X = tfidf.fit_transform(texts)

print("TF-IDF Sentiment Classifier:")
print(f"Отзывов: {len(texts)}, Vocab size: {len(tfidf.vocabulary_)}")

X_train, X_test, y_train, y_test = train_test_split(
    X, labels, test_size=0.2, random_state=42, stratify=labels
)

# Модели
models = {
    'LogReg': LogisticRegression(max_iter=1000, C=1.0),
    'NaiveBayes': MultinomialNB(alpha=1.0),
    'LinearSVC': LinearSVC(max_iter=2000, C=1.0)
}

print("\\nModels (5-fold CV accuracy):")
best_name, best_score = '', 0
for name, model in models.items():
    score = cross_val_score(model, X, labels, cv=5, scoring='accuracy').mean()
    print(f"  {name}: {score:.4f}")
    if score > best_score:
        best_score = score
        best_name = name

# Детальный отчёт для лучшей модели
best_model = models[best_name]
best_model.fit(X_train, y_train)
y_pred = best_model.predict(X_test)

print(f"\\nBest model: {best_name}")
print(classification_report(y_test, y_pred, target_names=['Negative', 'Positive']))

# Топ-10 важных слов (для LogReg)
logreg = LogisticRegression(max_iter=1000)
logreg.fit(X_train, y_train)
feature_names = tfidf.get_feature_names_out()
coefs = logreg.coef_[0]

top_positive_idx = coefs.argsort()[-10:][::-1]
top_negative_idx = coefs.argsort()[:10]

print("Топ-10 позитивных слов:")
for idx in top_positive_idx:
    print(f"  {feature_names[idx]}: {coefs[idx]:.4f}")

print("\\nТоп-10 негативных слов:")
for idx in top_negative_idx:
    print(f"  {feature_names[idx]}: {coefs[idx]:.4f}")`,
      explanation: 'TF-IDF + LogisticRegression — сильный baseline для text classification. Биграммы улавливают словосочетания. Коэффициенты LogReg показывают важность каждого слова: положительные для позитивного класса, отрицательные для негативного. Это делает модель интерпретируемой.'
    },
    {
      id: 6,
      title: 'Deep Learning для текста',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: `# Deep Learning для обработки текста

## Зачем Deep Learning для NLP?

Классический ML (TF-IDF + LogReg) не учитывает:
- **Порядок слов**: "not good" vs "good not"
- **Контекст**: "bank" (финансовый vs берег реки)
- **Длинные зависимости**: связи между словами на расстоянии

## 1. Embedding Layer

Преобразует слова в плотные векторы (обучаемые):

\`\`\`python
import tensorflow as tf
from tensorflow.keras.layers import Embedding

# vocab_size=10000, embedding_dim=128
embedding = Embedding(input_dim=10000, output_dim=128)

# input: [5, 23, 87]  (индексы слов)
# output: [[0.12, -0.34, ...], [0.56, 0.78, ...], [0.91, -0.23, ...]]
#          128-мерный вектор для каждого слова
\`\`\`

## 2. LSTM (Long Short-Term Memory)

Рекуррентная сеть, которая помнит контекст:

\`\`\`python
from tensorflow.keras.layers import LSTM, Bidirectional

model = tf.keras.Sequential([
    Embedding(vocab_size, 128, input_length=max_len),
    Bidirectional(LSTM(64, return_sequences=True)),
    Bidirectional(LSTM(32)),
    tf.keras.layers.Dense(64, activation='relu'),
    tf.keras.layers.Dropout(0.5),
    tf.keras.layers.Dense(1, activation='sigmoid')
])
\`\`\`

**Bidirectional** — читает текст в обоих направлениях:
- Forward: "The movie was really **good**" (контекст слева)
- Backward: "**good** really was movie The" (контекст справа)

## 3. CNN для текста

1D-свёрки для извлечения n-грамм:

\`\`\`python
from tensorflow.keras.layers import Conv1D, GlobalMaxPooling1D

model = tf.keras.Sequential([
    Embedding(vocab_size, 128, input_length=max_len),
    Conv1D(128, kernel_size=3, activation='relu'),  # триграммы
    Conv1D(128, kernel_size=5, activation='relu'),  # 5-граммы
    GlobalMaxPooling1D(),
    tf.keras.layers.Dense(64, activation='relu'),
    tf.keras.layers.Dropout(0.5),
    tf.keras.layers.Dense(1, activation='sigmoid')
])
\`\`\`

## 4. Подготовка данных для DL

\`\`\`python
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences

# Токенизация
tokenizer = Tokenizer(num_words=10000, oov_token='<OOV>')
tokenizer.fit_on_texts(train_texts)

# Текст -> последовательность индексов
train_sequences = tokenizer.texts_to_sequences(train_texts)
test_sequences = tokenizer.texts_to_sequences(test_texts)

# Padding до одной длины
max_len = 200
X_train = pad_sequences(train_sequences, maxlen=max_len, padding='post')
X_test = pad_sequences(test_sequences, maxlen=max_len, padding='post')
\`\`\`

## 5. Полная архитектура LSTM

\`\`\`python
model = tf.keras.Sequential([
    Embedding(10000, 128, input_length=200),
    Bidirectional(LSTM(64, return_sequences=True, dropout=0.2)),
    Bidirectional(LSTM(32, dropout=0.2)),
    tf.keras.layers.Dense(64, activation='relu'),
    tf.keras.layers.Dropout(0.5),
    tf.keras.layers.Dense(1, activation='sigmoid')
])

model.compile(
    optimizer='adam',
    loss='binary_crossentropy',
    metrics=['accuracy']
)

# Обучение с Early Stopping
callback = tf.keras.callbacks.EarlyStopping(
    monitor='val_loss', patience=3, restore_best_weights=True
)

history = model.fit(
    X_train, y_train,
    epochs=10, batch_size=64,
    validation_split=0.2,
    callbacks=[callback]
)
\`\`\`

## Сравнение архитектур

| Модель | Время обучения | Accuracy | Контекст |
|--------|---------------|----------|----------|
| CNN | Быстро | ~88% | Локальный |
| LSTM | Средне | ~89% | Глобальный |
| BiLSTM | Медленнее | ~90% | Двунаправленный |
| BERT | Долго | ~93% | Глубокий |`
        }
      ]
    },
    {
      id: 7,
      title: 'Практика: LSTM классификатор',
      type: 'practice',
      difficulty: 'medium',
      description: 'Постройте LSTM-классификатор для sentiment analysis на IMDB-подобном датасете.',
      requirements: [
        'Создайте синтетический датасет из 1000+ отзывов с чёткими паттернами',
        'Подготовьте данные: Tokenizer + pad_sequences',
        'Постройте BiLSTM модель: Embedding -> BiLSTM -> Dense -> sigmoid',
        'Обучите на 5 эпох с validation_split=0.2',
        'Выведите accuracy на train и validation'
      ],
      hint: 'Embedding(vocab_size, 64, input_length=max_len). BiLSTM: Bidirectional(LSTM(32)). Используйте binary_crossentropy и adam optimizer.',
      expectedOutput: 'LSTM Sentiment Classifier:\nОтзывов: 1000+\nVocab size: XXX\nMax length: XX\n\nModel Summary:\n  Embedding -> BiLSTM(32) -> Dense(32) -> Dense(1)\n  Parameters: XX,XXX\n\nTraining:\n  Epoch 5: train_acc=0.XX, val_acc=0.XX',
      solution: `import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.layers import Embedding, LSTM, Bidirectional, Dense, Dropout

np.random.seed(42)
tf.random.set_seed(42)

# Синтетический датасет
positive_templates = [
    "amazing movie great acting love story",
    "wonderful film excellent performance brilliant",
    "fantastic plot beautiful cinematography superb",
    "outstanding masterpiece incredible highly recommend",
    "perfect entertaining enjoyed every moment best",
    "great story lovely characters wonderful film",
    "brilliant acting superb direction amazing movie",
    "excellent film truly remarkable performance",
    "loved this movie beautiful and touching story",
    "incredible film best seen this year outstanding"
]

negative_templates = [
    "terrible movie awful acting worst story",
    "horrible film bad performance disappointing",
    "boring plot waste of time dreadful",
    "disaster unwatchable pathetic avoid this",
    "worst movie ever seen painful experience",
    "bad story terrible characters horrible film",
    "awful acting poor direction terrible movie",
    "disappointing film truly forgettable performance",
    "hated this movie boring and predictable",
    "ridiculous film worst seen this year disaster"
]

texts, labels = [], []
for _ in range(600):
    template = np.random.choice(positive_templates)
    words = template.split()
    n_drop = np.random.randint(0, 2)
    if n_drop > 0 and len(words) > 3:
        drop_idx = np.random.choice(len(words), n_drop, replace=False)
        words = [w for i, w in enumerate(words) if i not in drop_idx]
    np.random.shuffle(words)
    texts.append(' '.join(words))
    labels.append(1)

for _ in range(550):
    template = np.random.choice(negative_templates)
    words = template.split()
    n_drop = np.random.randint(0, 2)
    if n_drop > 0 and len(words) > 3:
        drop_idx = np.random.choice(len(words), n_drop, replace=False)
        words = [w for i, w in enumerate(words) if i not in drop_idx]
    np.random.shuffle(words)
    texts.append(' '.join(words))
    labels.append(0)

labels = np.array(labels)

# Перемешивание
shuffle_idx = np.random.permutation(len(texts))
texts = [texts[i] for i in shuffle_idx]
labels = labels[shuffle_idx]

# Tokenizer
tokenizer = Tokenizer(num_words=5000, oov_token='<OOV>')
tokenizer.fit_on_texts(texts)
sequences = tokenizer.texts_to_sequences(texts)

vocab_size = min(5000, len(tokenizer.word_index) + 1)
max_len = max(len(s) for s in sequences)

X = pad_sequences(sequences, maxlen=max_len, padding='post')
y = labels

print("LSTM Sentiment Classifier:")
print(f"Отзывов: {len(texts)}")
print(f"Vocab size: {vocab_size}")
print(f"Max length: {max_len}")

# Разделение
split = int(0.8 * len(X))
X_train, X_val = X[:split], X[split:]
y_train, y_val = y[:split], y[split:]

# Модель
model = tf.keras.Sequential([
    Embedding(vocab_size, 64, input_length=max_len),
    Bidirectional(LSTM(32, dropout=0.2)),
    Dense(32, activation='relu'),
    Dropout(0.5),
    Dense(1, activation='sigmoid')
])

model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

print(f"\\nModel Summary:")
print(f"  Embedding({vocab_size}, 64) -> BiLSTM(32) -> Dense(32) -> Dense(1)")
print(f"  Parameters: {model.count_params():,}")

# Обучение
history = model.fit(
    X_train, y_train,
    epochs=5, batch_size=32,
    validation_data=(X_val, y_val),
    verbose=0
)

# Результаты
print(f"\\nTraining:")
for epoch in range(5):
    ta = history.history['accuracy'][epoch]
    va = history.history['val_accuracy'][epoch]
    print(f"  Epoch {epoch+1}: train_acc={ta:.4f}, val_acc={va:.4f}")

# Предсказание
test_texts = ["amazing movie loved", "terrible awful boring"]
test_seq = tokenizer.texts_to_sequences(test_texts)
test_pad = pad_sequences(test_seq, maxlen=max_len, padding='post')
preds = model.predict(test_pad, verbose=0)
print(f"\\nПримеры предсказаний:")
for text, pred in zip(test_texts, preds):
    sentiment = "Positive" if pred[0] > 0.5 else "Negative"
    print(f"  '{text}' -> {sentiment} ({pred[0]:.4f})")`,
      explanation: 'BiLSTM читает текст в обоих направлениях, улавливая контекст. Embedding слой учит векторные представления слов. Dropout предотвращает переобучение. На реальных данных IMDB BiLSTM достигает ~89-91% accuracy, что лучше TF-IDF baseline.'
    },
    {
      id: 8,
      title: 'Transfer Learning: BERT',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: `# Transfer Learning с BERT для NLP

## Что такое BERT?

**BERT** (Bidirectional Encoder Representations from Transformers) — предобученная модель от Google (2018), которая революционизировала NLP.

Предобучена на:
- **BookCorpus** (800M слов)
- **Wikipedia** (2500M слов)

Задачи предобучения:
- **Masked Language Model** — предсказание замаскированных слов
- **Next Sentence Prediction** — связаны ли два предложения

## Архитектура BERT

\`\`\`
Input: [CLS] I love this movie [SEP]
         |    |   |    |   |     |
      Token Embeddings + Position + Segment
         |    |   |    |   |     |
      ┌─────────────────────────────┐
      │   12 Transformer Layers     │
      │   (Attention + FFN)         │
      └─────────────────────────────┘
         |    |   |    |   |     |
      [CLS] = sentence representation (768-dim)
\`\`\`

## Варианты BERT

| Модель | Параметры | Размер | Качество |
|--------|-----------|--------|----------|
| BERT-base | 110M | 420MB | Высокое |
| BERT-large | 340M | 1.3GB | Очень высокое |
| DistilBERT | 66M | 250MB | ~97% от BERT |
| RoBERTa | 125M | 480MB | Лучше BERT |

## Fine-tuning BERT с Hugging Face

\`\`\`python
from transformers import BertTokenizer, BertForSequenceClassification
from transformers import Trainer, TrainingArguments
import torch

# 1. Загрузка модели и токенизатора
model_name = 'bert-base-uncased'
tokenizer = BertTokenizer.from_pretrained(model_name)
model = BertForSequenceClassification.from_pretrained(
    model_name, num_labels=2
)

# 2. Токенизация
def tokenize_function(texts):
    return tokenizer(
        texts,
        padding='max_length',
        truncation=True,
        max_length=256,
        return_tensors='pt'
    )

encodings = tokenize_function(["I love this movie"])
print(encodings.keys())  # input_ids, attention_mask, token_type_ids

# 3. Создание Dataset
class SentimentDataset(torch.utils.data.Dataset):
    def __init__(self, encodings, labels):
        self.encodings = encodings
        self.labels = labels

    def __getitem__(self, idx):
        item = {key: val[idx] for key, val in self.encodings.items()}
        item['labels'] = torch.tensor(self.labels[idx])
        return item

    def __len__(self):
        return len(self.labels)

# 4. Training Arguments
training_args = TrainingArguments(
    output_dir='./results',
    num_train_epochs=3,
    per_device_train_batch_size=16,
    per_device_eval_batch_size=64,
    warmup_steps=500,
    weight_decay=0.01,
    logging_dir='./logs',
    evaluation_strategy='epoch'
)

# 5. Trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=eval_dataset
)

trainer.train()
\`\`\`

## Простой подход с pipeline

\`\`\`python
from transformers import pipeline

# Готовый sentiment classifier
classifier = pipeline('sentiment-analysis')

result = classifier("I love this movie!")
print(result)
# [{'label': 'POSITIVE', 'score': 0.9998}]

# Batch prediction
results = classifier([
    "Great film!",
    "Terrible movie.",
    "It was okay."
])
\`\`\`

## DistilBERT — быстрый вариант

\`\`\`python
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification

tokenizer = DistilBertTokenizer.from_pretrained('distilbert-base-uncased')
model = DistilBertForSequenceClassification.from_pretrained(
    'distilbert-base-uncased', num_labels=2
)
# На 60% быстрее, 40% меньше, 97% качества BERT
\`\`\`

## Когда использовать BERT?

- **Да**: достаточно данных (>1000), нужно максимальное качество, есть GPU
- **Нет**: мало данных (<100), ограничены ресурсы, нужна скорость inference
- **Компромисс**: DistilBERT — быстрее при сохранении качества`
        }
      ]
    },
    {
      id: 9,
      title: 'Практика: Fine-tuning BERT',
      type: 'practice',
      difficulty: 'hard',
      description: 'Выполните fine-tuning DistilBERT для sentiment analysis с Hugging Face Transformers.',
      requirements: [
        'Создайте датасет из 400+ отзывов (pos/neg)',
        'Токенизируйте тексты с помощью DistilBertTokenizer',
        'Создайте PyTorch Dataset и DataLoader',
        'Обучите DistilBERT на 2 эпохи с AdamW optimizer',
        'Оцените accuracy на тестовой выборке'
      ],
      hint: 'from transformers import DistilBertTokenizer, DistilBertForSequenceClassification. learning_rate=2e-5 — стандарт для fine-tuning. Batch size 16 для GPU, 8 для CPU.',
      expectedOutput: 'DistilBERT Fine-tuning:\nОтзывов: 400+\nMax length: 64\n\nTraining:\n  Epoch 1: loss=X.XX, acc=0.XX\n  Epoch 2: loss=X.XX, acc=0.XX\n\nTest Accuracy: 0.XX\n\nПримеры:\n  "amazing movie" -> Positive (0.XX)\n  "terrible film" -> Negative (0.XX)',
      solution: `import numpy as np
import torch
from torch.utils.data import Dataset, DataLoader
from torch.optim import AdamW

np.random.seed(42)
torch.manual_seed(42)

# --- Синтетический датасет ---
positive_reviews = [
    "This movie is amazing and wonderful",
    "Great acting and brilliant story",
    "Loved every moment of this film",
    "Outstanding performance absolutely fantastic",
    "Best movie I have seen this year",
    "Incredible plot and beautiful cinematography",
    "Superb film highly recommended",
    "Excellent movie with great characters",
    "Wonderful story truly masterpiece",
    "Amazing film perfect in every way"
]

negative_reviews = [
    "This movie is terrible and boring",
    "Awful acting and stupid story",
    "Hated every moment of this film",
    "Worst performance absolutely dreadful",
    "Worst movie I have seen this year",
    "Horrible plot and ugly cinematography",
    "Pathetic film avoid at all costs",
    "Bad movie with terrible characters",
    "Disappointing story truly forgettable",
    "Awful film painful in every way"
]

texts, labels = [], []
for _ in range(220):
    texts.append(np.random.choice(positive_reviews))
    labels.append(1)
for _ in range(200):
    texts.append(np.random.choice(negative_reviews))
    labels.append(0)

# Перемешивание
idx = np.random.permutation(len(texts))
texts = [texts[i] for i in idx]
labels = [labels[i] for i in idx]

split = int(0.8 * len(texts))
train_texts, test_texts = texts[:split], texts[split:]
train_labels, test_labels = labels[:split], labels[split:]

print("DistilBERT Fine-tuning:")
print(f"Отзывов: {len(texts)}")

# Пробуем использовать transformers
try:
    from transformers import DistilBertTokenizer, DistilBertForSequenceClassification

    tokenizer = DistilBertTokenizer.from_pretrained('distilbert-base-uncased')
    model = DistilBertForSequenceClassification.from_pretrained(
        'distilbert-base-uncased', num_labels=2
    )

    max_len = 64
    print(f"Max length: {max_len}")

    # Dataset class
    class SentimentDataset(Dataset):
        def __init__(self, texts, labels, tokenizer, max_len):
            self.encodings = tokenizer(
                texts, truncation=True, padding='max_length',
                max_length=max_len, return_tensors='pt'
            )
            self.labels = torch.tensor(labels, dtype=torch.long)

        def __getitem__(self, idx):
            item = {k: v[idx] for k, v in self.encodings.items()}
            item['labels'] = self.labels[idx]
            return item

        def __len__(self):
            return len(self.labels)

    train_dataset = SentimentDataset(train_texts, train_labels, tokenizer, max_len)
    test_dataset = SentimentDataset(test_texts, test_labels, tokenizer, max_len)

    train_loader = DataLoader(train_dataset, batch_size=16, shuffle=True)
    test_loader = DataLoader(test_dataset, batch_size=32)

    # Training
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    model.to(device)
    optimizer = AdamW(model.parameters(), lr=2e-5, weight_decay=0.01)

    print("\\nTraining:")
    for epoch in range(2):
        model.train()
        total_loss, correct, total = 0, 0, 0

        for batch in train_loader:
            optimizer.zero_grad()
            input_ids = batch['input_ids'].to(device)
            attention_mask = batch['attention_mask'].to(device)
            batch_labels = batch['labels'].to(device)

            outputs = model(input_ids=input_ids, attention_mask=attention_mask, labels=batch_labels)
            loss = outputs.loss
            logits = outputs.logits

            loss.backward()
            optimizer.step()

            total_loss += loss.item()
            preds = torch.argmax(logits, dim=1)
            correct += (preds == batch_labels).sum().item()
            total += len(batch_labels)

        acc = correct / total
        avg_loss = total_loss / len(train_loader)
        print(f"  Epoch {epoch+1}: loss={avg_loss:.4f}, acc={acc:.4f}")

    # Evaluation
    model.eval()
    correct, total = 0, 0
    with torch.no_grad():
        for batch in test_loader:
            input_ids = batch['input_ids'].to(device)
            attention_mask = batch['attention_mask'].to(device)
            batch_labels = batch['labels'].to(device)

            outputs = model(input_ids=input_ids, attention_mask=attention_mask)
            preds = torch.argmax(outputs.logits, dim=1)
            correct += (preds == batch_labels).sum().item()
            total += len(batch_labels)

    test_acc = correct / total
    print(f"\\nTest Accuracy: {test_acc:.4f}")

    # Примеры предсказаний
    examples = ["amazing movie wonderful", "terrible film awful"]
    model.eval()
    print("\\nПримеры:")
    for text in examples:
        inputs = tokenizer(text, return_tensors='pt', padding='max_length',
                          truncation=True, max_length=max_len).to(device)
        with torch.no_grad():
            outputs = model(**inputs)
            probs = torch.softmax(outputs.logits, dim=1)
            pred = torch.argmax(probs, dim=1).item()
            conf = probs[0][pred].item()
        label = "Positive" if pred == 1 else "Negative"
        print(f'  "{text}" -> {label} ({conf:.4f})')

except ImportError:
    print("\\n[!] transformers не установлен. Установите: pip install transformers torch")
    print("\\nПример кода fine-tuning DistilBERT:")
    print("""
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification
tokenizer = DistilBertTokenizer.from_pretrained('distilbert-base-uncased')
model = DistilBertForSequenceClassification.from_pretrained('distilbert-base-uncased', num_labels=2)

# Tokenize -> Dataset -> DataLoader -> Train loop с AdamW(lr=2e-5)
# На IMDB: ~93% accuracy за 2-3 эпохи
    """)`,
      explanation: 'Fine-tuning BERT — процесс адаптации предобученной модели под вашу задачу. DistilBERT — быстрая альтернатива (60% быстрее, 97% качества). Ключевые параметры: lr=2e-5, 2-3 эпохи, batch_size=16. На реальном IMDB dataset DistilBERT достигает ~93% accuracy.'
    },
    {
      id: 10,
      title: 'Практика: Сравнение всех подходов',
      type: 'practice',
      difficulty: 'hard',
      description: 'Проведите полный бенчмарк: сравните TF-IDF, LSTM и BERT-подход для sentiment analysis.',
      requirements: [
        'Создайте единый датасет из 600+ отзывов',
        'Реализуйте TF-IDF + LogisticRegression подход',
        'Реализуйте LSTM подход (Embedding + LSTM)',
        'Реализуйте BERT-подход (или pipeline из transformers)',
        'Сравните accuracy, время обучения и размер модели для каждого подхода'
      ],
      hint: 'Используйте time.time() для замера времени. Для BERT без GPU можно использовать pipeline("sentiment-analysis") из transformers. model.count_params() для размера модели Keras.',
      expectedOutput: 'NLP Benchmark: Sentiment Analysis\nОтзывов: 600+\n\n| Подход      | Accuracy | Время (s) | Параметры  |\n|-------------|----------|-----------|------------|\n| TF-IDF+LR   | 0.XX    | X.XX      | ~XXXX      |\n| LSTM         | 0.XX    | X.XX      | ~XX,XXX    |\n| BERT         | 0.XX    | X.XX      | ~XX,XXX,XXX|',
      solution: `import numpy as np
import time
import warnings
warnings.filterwarnings('ignore')

np.random.seed(42)

# Единый датасет
positive_phrases = [
    "amazing movie great acting wonderful story brilliant film",
    "excellent performance loved every moment superb masterpiece",
    "fantastic plot beautiful incredible highly recommend outstanding",
    "perfect movie best film entertaining captivating beautiful",
    "wonderful acting great direction brilliant screenplay loved"
]
negative_phrases = [
    "terrible movie awful acting horrible story worst film",
    "bad performance hated every moment pathetic disaster",
    "boring plot ugly dreadful avoid disappointing forgettable",
    "worst movie terrible film painful unwatchable ridiculous",
    "awful acting poor direction terrible screenplay hated"
]

texts, labels = [], []
for _ in range(350):
    phrase = np.random.choice(positive_phrases)
    words = phrase.split()
    n = np.random.randint(4, len(words) + 1)
    selected = np.random.choice(words, n, replace=False)
    texts.append(' '.join(selected))
    labels.append(1)

for _ in range(320):
    phrase = np.random.choice(negative_phrases)
    words = phrase.split()
    n = np.random.randint(4, len(words) + 1)
    selected = np.random.choice(words, n, replace=False)
    texts.append(' '.join(selected))
    labels.append(0)

labels = np.array(labels)
idx = np.random.permutation(len(texts))
texts = [texts[i] for i in idx]
labels = labels[idx]

split = int(0.8 * len(texts))
train_texts, test_texts = texts[:split], texts[split:]
train_labels, test_labels = labels[:split], labels[split:]

print("NLP Benchmark: Sentiment Analysis")
print(f"Отзывов: {len(texts)} (train: {len(train_texts)}, test: {len(test_texts)})")
print()

results = {}

# === 1. TF-IDF + LogisticRegression ===
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

start = time.time()
tfidf = TfidfVectorizer(max_features=5000, ngram_range=(1, 2))
X_train_tfidf = tfidf.fit_transform(train_texts)
X_test_tfidf = tfidf.transform(test_texts)

lr = LogisticRegression(max_iter=1000)
lr.fit(X_train_tfidf, train_labels)
y_pred_lr = lr.predict(X_test_tfidf)
acc_lr = accuracy_score(test_labels, y_pred_lr)
time_lr = time.time() - start
params_lr = X_train_tfidf.shape[1] + 1  # features + bias

results['TF-IDF+LR'] = {'accuracy': acc_lr, 'time': time_lr, 'params': params_lr}
print(f"1. TF-IDF + LogReg: accuracy={acc_lr:.4f}, time={time_lr:.2f}s, params={params_lr}")

# === 2. LSTM ===
import tensorflow as tf
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences

tf.random.set_seed(42)
start = time.time()

tokenizer_lstm = Tokenizer(num_words=5000, oov_token='<OOV>')
tokenizer_lstm.fit_on_texts(train_texts)

train_seq = pad_sequences(tokenizer_lstm.texts_to_sequences(train_texts), maxlen=30, padding='post')
test_seq = pad_sequences(tokenizer_lstm.texts_to_sequences(test_texts), maxlen=30, padding='post')

vocab_size = min(5000, len(tokenizer_lstm.word_index) + 1)

lstm_model = tf.keras.Sequential([
    tf.keras.layers.Embedding(vocab_size, 64, input_length=30),
    tf.keras.layers.Bidirectional(tf.keras.layers.LSTM(32, dropout=0.2)),
    tf.keras.layers.Dense(32, activation='relu'),
    tf.keras.layers.Dropout(0.5),
    tf.keras.layers.Dense(1, activation='sigmoid')
])

lstm_model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
lstm_model.fit(train_seq, train_labels, epochs=5, batch_size=32, verbose=0)

y_pred_lstm = (lstm_model.predict(test_seq, verbose=0) > 0.5).astype(int).flatten()
acc_lstm = accuracy_score(test_labels, y_pred_lstm)
time_lstm = time.time() - start
params_lstm = lstm_model.count_params()

results['LSTM'] = {'accuracy': acc_lstm, 'time': time_lstm, 'params': params_lstm}
print(f"2. BiLSTM: accuracy={acc_lstm:.4f}, time={time_lstm:.2f}s, params={params_lstm:,}")

# === 3. BERT (pipeline или симуляция) ===
start = time.time()
try:
    from transformers import pipeline as hf_pipeline
    classifier = hf_pipeline('sentiment-analysis', model='distilbert-base-uncased-finetuned-sst-2-english',
                            device=-1, truncation=True)
    bert_preds = classifier(test_texts, batch_size=32)
    y_pred_bert = [1 if p['label'] == 'POSITIVE' else 0 for p in bert_preds]
    acc_bert = accuracy_score(test_labels, y_pred_bert)
    time_bert = time.time() - start
    params_bert = 66_000_000  # DistilBERT ~66M

    results['BERT'] = {'accuracy': acc_bert, 'time': time_bert, 'params': params_bert}
    print(f"3. DistilBERT: accuracy={acc_bert:.4f}, time={time_bert:.2f}s, params={params_bert:,}")
except ImportError:
    time_bert = time.time() - start
    print(f"3. DistilBERT: [не установлен] pip install transformers")
    print(f"   Ожидаемая accuracy: ~0.93 на реальных данных")

# === Итоговая таблица ===
print(f"\\n{'='*60}")
print(f"{'Подход':<15} {'Accuracy':<10} {'Время (s)':<12} {'Параметры':<15}")
print(f"{'-'*60}")
for name, r in results.items():
    print(f"{name:<15} {r['accuracy']:<10.4f} {r['time']:<12.2f} {r['params']:,}")
print(f"{'='*60}")

best = max(results.items(), key=lambda x: x[1]['accuracy'])
fastest = min(results.items(), key=lambda x: x[1]['time'])
print(f"\\nЛучшая accuracy: {best[0]} ({best[1]['accuracy']:.4f})")
print(f"Самая быстрая: {fastest[0]} ({fastest[1]['time']:.2f}s)")`,
      explanation: 'Бенчмарк показывает trade-off между подходами: TF-IDF+LogReg — быстрый и интерпретируемый baseline. LSTM — ловит порядок слов, но медленнее. BERT — лучший результат, но требует GPU и больше ресурсов. На реальных данных разница более заметна: ~88% vs ~90% vs ~93%.'
    }
  ]
}