export default {
  id: 23,
  title: 'Трансформеры и Attention',
  description: 'Архитектура Transformer: механизм внимания, self-attention, BERT, GPT, практическое использование.',
  lessons: [
    {
      id: 1,
      title: 'Механизм внимания (Attention)',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Attention — революция в Deep Learning' },
        { type: 'text', value: 'Механизм внимания позволяет модели "фокусироваться" на важных частях входа. Вместо сжатия всей последовательности в один вектор (как RNN), Attention создаёт взвешенную сумму всех позиций, где веса определяют важность каждого элемента для текущего выхода.' },
        { type: 'code', language: 'python', value: 'import numpy as np\n\n# Scaled Dot-Product Attention\ndef attention(Q, K, V):\n    """\n    Q (Query): что мы ищем\n    K (Key): что содержит каждый элемент\n    V (Value): что мы хотим получить\n    """\n    d_k = K.shape[-1]  # размерность ключа\n    \n    # 1. Вычисляем "совместимость" Query с каждым Key\n    scores = Q @ K.T / np.sqrt(d_k)  # масштабирование\n    \n    # 2. Softmax → веса внимания\n    weights = np.exp(scores) / np.exp(scores).sum(axis=-1, keepdims=True)\n    \n    # 3. Взвешенная сумма Values\n    output = weights @ V\n    \n    return output, weights\n\n# Пример: 4 слова, embedding_dim=3\nnp.random.seed(42)\nsentence = np.random.randn(4, 3)  # 4 токена, 3-мерные\n\n# Self-Attention: Q=K=V=вход\noutput, weights = attention(sentence, sentence, sentence)\n\nprint("Матрица внимания (какое слово на какое смотрит):")\nprint(weights.round(3))\nprint(f"\\nВход shape: {sentence.shape}")\nprint(f"Выход shape: {output.shape}")\nprint("\\nКаждый выходной вектор — взвешенная комбинация всех входных")\nprint("Веса определяются сходством (Query * Key) между позициями")' },
        { type: 'note', value: 'Self-Attention — ключевая операция в Transformer. Каждое слово "смотрит" на все другие слова в предложении и собирает контекстную информацию. Сложность: O(n²) по длине последовательности.' }
      ]
    },
    {
      id: 2,
      title: 'Архитектура Transformer',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Transformer: Encoder-Decoder' },
        { type: 'text', value: 'Transformer (2017, "Attention Is All You Need") — архитектура без рекуррентности, построенная целиком на Attention. Encoder обрабатывает вход (понимание), Decoder генерирует выход (генерация). Multi-Head Attention использует несколько "голов" для захвата разных типов зависимостей.' },
        { type: 'code', language: 'python', value: 'import tensorflow as tf\nfrom tensorflow.keras import layers\nimport numpy as np\n\n# Multi-Head Attention в Keras\nclass TransformerBlock(layers.Layer):\n    def __init__(self, embed_dim, num_heads, ff_dim, dropout=0.1):\n        super().__init__()\n        self.att = layers.MultiHeadAttention(num_heads=num_heads, key_dim=embed_dim)\n        self.ffn = tf.keras.Sequential([\n            layers.Dense(ff_dim, activation="relu"),\n            layers.Dense(embed_dim)\n        ])\n        self.norm1 = layers.LayerNormalization()\n        self.norm2 = layers.LayerNormalization()\n        self.dropout1 = layers.Dropout(dropout)\n        self.dropout2 = layers.Dropout(dropout)\n    \n    def call(self, inputs, training=False):\n        # Self-Attention + Residual + LayerNorm\n        attn_output = self.att(inputs, inputs)\n        attn_output = self.dropout1(attn_output, training=training)\n        out1 = self.norm1(inputs + attn_output)  # residual connection\n        \n        # Feed-Forward + Residual + LayerNorm\n        ffn_output = self.ffn(out1)\n        ffn_output = self.dropout2(ffn_output, training=training)\n        out2 = self.norm2(out1 + ffn_output)  # residual connection\n        \n        return out2\n\n# Позиционное кодирование\nclass PositionalEncoding(layers.Layer):\n    def __init__(self, max_len, embed_dim):\n        super().__init__()\n        positions = np.arange(max_len)[:, np.newaxis]\n        dims = np.arange(embed_dim)[np.newaxis, :]\n        angles = positions / np.power(10000, (2 * (dims // 2)) / embed_dim)\n        pe = np.zeros((max_len, embed_dim))\n        pe[:, 0::2] = np.sin(angles[:, 0::2])\n        pe[:, 1::2] = np.cos(angles[:, 1::2])\n        self.pe = tf.constant(pe[np.newaxis, :, :], dtype=tf.float32)\n    \n    def call(self, x):\n        return x + self.pe[:, :tf.shape(x)[1], :]\n\nprint("Компоненты Transformer:")\nprint("1. Multi-Head Self-Attention")\nprint("2. Feed-Forward Network")\nprint("3. Layer Normalization + Residual Connections")\nprint("4. Positional Encoding (порядок слов)")' },
        { type: 'tip', value: 'Residual connections (skip connections) позволяют обучать глубокие трансформеры. LayerNorm стабилизирует обучение. Positional Encoding добавляет информацию о порядке слов.' }
      ]
    },
    {
      id: 3,
      title: 'BERT',
      type: 'theory',
      content: [
        { type: 'heading', value: 'BERT — Bidirectional Encoder Representations' },
        { type: 'text', value: 'BERT (2018, Google) — предобученный Transformer encoder. Обучен на двух задачах: Masked Language Model (предсказать скрытое слово) и Next Sentence Prediction. BERT "понимает" контекст слова с обеих сторон, что делает его мощным для NLU (Natural Language Understanding).' },
        { type: 'code', language: 'python', value: '# Использование BERT через Hugging Face\n# pip install transformers\n\n"""\nfrom transformers import BertTokenizer, BertModel, pipeline\nimport torch\n\n# Токенизация текста для BERT\ntokenizer = BertTokenizer.from_pretrained("bert-base-uncased")\ntext = "Machine learning is amazing"\ntokens = tokenizer(text, return_tensors="pt")\nprint(f"Токены: {tokenizer.tokenize(text)}")\nprint(f"Input IDs: {tokens[\'input_ids\']}")\n\n# Извлечение embeddings\nmodel = BertModel.from_pretrained("bert-base-uncased")\nwith torch.no_grad():\n    outputs = model(**tokens)\nembeddings = outputs.last_hidden_state\nprint(f"Embeddings shape: {embeddings.shape}")  # (1, seq_len, 768)\n\n# Классификация текста с BERT (pipeline)\nclassifier = pipeline("sentiment-analysis")\nresult = classifier("I love this product!")\nprint(f"Результат: {result}")\n"""\n\nprint("BERT варианты:")\nprint("  bert-base-uncased: 110M параметров, 12 слоёв, 768 dim")\nprint("  bert-large-uncased: 340M параметров, 24 слоя, 1024 dim")\nprint("  DistilBERT: 66M параметров, 6 слоёв (40% быстрее)")\nprint("  RoBERTa: улучшенное обучение BERT")\nprint("  ALBERT: компактный BERT (12M параметров)")\n\nprint("\\nЗадачи BERT:")\nprint("  - Классификация текста (спам, тональность)")\nprint("  - NER (Named Entity Recognition)")\nprint("  - Question Answering")\nprint("  - Sentence Similarity")\nprint("  - Text Summarization")' },
        { type: 'note', value: 'BERT — стандарт для NLU задач. Fine-tuning BERT на 1000 примерах часто превосходит модели, обученные с нуля на 100000 примерах.' }
      ]
    },
    {
      id: 4,
      title: 'GPT и генеративные модели',
      type: 'theory',
      content: [
        { type: 'heading', value: 'GPT — Generative Pre-trained Transformer' },
        { type: 'text', value: 'GPT (OpenAI) — авторегрессионный Transformer decoder. Обучен предсказывать следующее слово по предыдущим. GPT-2, GPT-3, GPT-4 масштабируют эту идею до миллиардов параметров. В отличие от BERT, GPT генерирует текст (NLG — Natural Language Generation).' },
        { type: 'code', language: 'python', value: '# Генерация текста с GPT-2\n# pip install transformers\n\n"""\nfrom transformers import GPT2LMHeadModel, GPT2Tokenizer\n\ntokenizer = GPT2Tokenizer.from_pretrained("gpt2")\nmodel = GPT2LMHeadModel.from_pretrained("gpt2")\n\nprompt = "Machine learning is"\ninput_ids = tokenizer.encode(prompt, return_tensors="pt")\n\noutput = model.generate(\n    input_ids, \n    max_length=50,\n    num_return_sequences=1,\n    temperature=0.7,\n    top_p=0.9,\n    do_sample=True\n)\n\ngenerated_text = tokenizer.decode(output[0], skip_special_tokens=True)\nprint(f"Сгенерированный текст: {generated_text}")\n"""\n\nprint("Сравнение BERT vs GPT:")\nprint()\nprint("BERT (Encoder):")\nprint("  - Бидирекциональный (видит весь контекст)")\nprint("  - Для понимания текста (NLU)")\nprint("  - Задачи: классификация, NER, QA")\nprint("  - Masked Language Modeling")\nprint()\nprint("GPT (Decoder):")\nprint("  - Авторегрессионный (видит только прошлое)")\nprint("  - Для генерации текста (NLG)")\nprint("  - Задачи: генерация, диалоги, саммаризация")\nprint("  - Causal Language Modeling")\nprint()\nprint("T5, BART (Encoder-Decoder):")\nprint("  - Объединяют оба подхода")\nprint("  - Задачи: перевод, пересказ, text-to-text")' },
        { type: 'list', value: [
          'GPT-2: 1.5B параметров, открытый',
          'GPT-3: 175B параметров, API only',
          'GPT-4: мультимодальный (текст + изображения)',
          'LLaMA (Meta): открытый конкурент GPT',
          'Claude (Anthropic): фокус на безопасности',
          'Gemini (Google): мультимодальный'
        ] }
      ]
    },
    {
      id: 5,
      title: 'Transformer для классификации в Keras',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Простой Transformer классификатор' },
        { type: 'code', language: 'python', value: 'import tensorflow as tf\nfrom tensorflow.keras import layers, Sequential, Model\nimport numpy as np\n\n# Transformer для классификации текста\nvocab_size = 10000\nmax_len = 200\nembed_dim = 32\nnum_heads = 2\nff_dim = 64\n\n# Модель\ninputs = layers.Input(shape=(max_len,))\nx = layers.Embedding(vocab_size, embed_dim)(inputs)\n\n# Positional encoding (упрощённый — обучаемый)\nx = x + layers.Embedding(max_len, embed_dim)(tf.range(max_len))\n\n# Transformer block\nattn_output = layers.MultiHeadAttention(num_heads=num_heads, key_dim=embed_dim)(x, x)\nattn_output = layers.Dropout(0.1)(attn_output)\nx = layers.LayerNormalization()(x + attn_output)\n\nffn_output = layers.Dense(ff_dim, activation="relu")(x)\nffn_output = layers.Dense(embed_dim)(ffn_output)\nffn_output = layers.Dropout(0.1)(ffn_output)\nx = layers.LayerNormalization()(x + ffn_output)\n\n# Классификация\nx = layers.GlobalAveragePooling1D()(x)\nx = layers.Dense(64, activation="relu")(x)\nx = layers.Dropout(0.5)(x)\noutputs = layers.Dense(1, activation="sigmoid")(x)\n\nmodel = Model(inputs, outputs)\nmodel.compile(optimizer="adam", loss="binary_crossentropy", metrics=["accuracy"])\nmodel.summary()\n\n# Тест на IMDB\n(X_train, y_train), (X_test, y_test) = tf.keras.datasets.imdb.load_data(num_words=vocab_size)\nX_train = tf.keras.preprocessing.sequence.pad_sequences(X_train, maxlen=max_len)\nX_test = tf.keras.preprocessing.sequence.pad_sequences(X_test, maxlen=max_len)\n\nmodel.fit(X_train, y_train, epochs=3, batch_size=64, validation_split=0.2, verbose=1)\nprint(f"Test accuracy: {model.evaluate(X_test, y_test, verbose=0)[1]:.4f}")' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Transformer для классификации',
      type: 'practice',
      difficulty: 'hard',
      description: 'Постройте простой Transformer для классификации отзывов IMDB.',
      requirements: [
        'Загрузите IMDB dataset (vocab_size=10000, max_len=200)',
        'Реализуйте модель с Embedding, MultiHeadAttention, Dense',
        'Добавьте LayerNormalization и Dropout',
        'Обучите на 5 эпохах и оцените на тесте',
        'Сравните с простой LSTM моделью'
      ],
      hint: 'MultiHeadAttention(num_heads=2, key_dim=32)(x, x) для self-attention. GlobalAveragePooling1D() для агрегации последовательности в вектор.',
      expectedOutput: 'Transformer: Test accuracy = 0.85XX\nLSTM: Test accuracy = 0.84XX',
      solution: 'import tensorflow as tf\nfrom tensorflow.keras import layers, Model, Sequential\nimport numpy as np\n\nvocab_size = 10000\nmax_len = 200\n\n(X_train, y_train), (X_test, y_test) = tf.keras.datasets.imdb.load_data(num_words=vocab_size)\nX_train = tf.keras.preprocessing.sequence.pad_sequences(X_train, maxlen=max_len)\nX_test = tf.keras.preprocessing.sequence.pad_sequences(X_test, maxlen=max_len)\n\n# Transformer\ninputs = layers.Input(shape=(max_len,))\nx = layers.Embedding(vocab_size, 32)(inputs)\nattn = layers.MultiHeadAttention(num_heads=2, key_dim=32)(x, x)\nattn = layers.Dropout(0.1)(attn)\nx = layers.LayerNormalization()(x + attn)\nffn = layers.Dense(64, activation="relu")(x)\nffn = layers.Dense(32)(ffn)\nx = layers.LayerNormalization()(x + ffn)\nx = layers.GlobalAveragePooling1D()(x)\nx = layers.Dense(64, activation="relu")(x)\nx = layers.Dropout(0.5)(x)\noutputs = layers.Dense(1, activation="sigmoid")(x)\n\ntransformer_model = Model(inputs, outputs)\ntransformer_model.compile(optimizer="adam", loss="binary_crossentropy", metrics=["accuracy"])\ntransformer_model.fit(X_train, y_train, epochs=5, batch_size=64, validation_split=0.2, verbose=0)\nacc_t = transformer_model.evaluate(X_test, y_test, verbose=0)[1]\nprint(f"Transformer: Test accuracy = {acc_t:.4f}")\n\n# LSTM для сравнения\nlstm_model = Sequential([\n    layers.Embedding(vocab_size, 32, input_length=max_len),\n    layers.LSTM(64, dropout=0.2),\n    layers.Dense(1, activation="sigmoid")\n])\nlstm_model.compile(optimizer="adam", loss="binary_crossentropy", metrics=["accuracy"])\nlstm_model.fit(X_train, y_train, epochs=5, batch_size=64, validation_split=0.2, verbose=0)\nacc_l = lstm_model.evaluate(X_test, y_test, verbose=0)[1]\nprint(f"LSTM: Test accuracy = {acc_l:.4f}")',
      explanation: 'Transformer использует Self-Attention для захвата зависимостей между любыми позициями в тексте (в отличие от LSTM, который обрабатывает последовательно). На IMDB оба подхода дают схожие результаты. Настоящее преимущество Transformer проявляется на больших данных и длинных текстах. Предобученные модели (BERT, GPT) значительно превосходят обе наши модели.'
    }
  ]
}
