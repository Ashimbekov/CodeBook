export default {
  id: 38,
  title: 'NLP: BERT и GPT',
  description: 'Word embeddings, архитектура BERT, fine-tuning с HuggingFace, основы GPT и text classification с трансформерами.',
  lessons: [
    {
      id: 1,
      title: 'Word Embeddings: Word2Vec, GloVe',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Векторные представления слов' },
        { type: 'text', value: 'Word embeddings представляют слова как плотные векторы, где семантически похожие слова находятся рядом. Word2Vec (Google) учится предсказывать контекст по слову (Skip-gram) или слово по контексту (CBOW). GloVe (Stanford) использует матрицу совместных появлений.' },
        { type: 'code', language: 'python', value: 'from gensim.models import Word2Vec, KeyedVectors\nimport numpy as np\n\n# Обучение Word2Vec на текстах\nsentences = [\n    ["машинное", "обучение", "нейронные", "сети", "данные"],\n    ["глубокое", "обучение", "tensorflow", "keras", "модель"],\n    ["python", "программирование", "код", "алгоритм", "данные"],\n    ["нейронные", "сети", "обучение", "модель", "слои"],\n    ["классификация", "регрессия", "кластеризация", "модель"],\n    ["обработка", "текстов", "NLP", "токенизация", "эмбеддинги"],\n    ["компьютерное", "зрение", "изображения", "CNN", "свёртка"],\n    ["трансформеры", "attention", "BERT", "GPT", "NLP"],\n]\n\n# Word2Vec модель\nmodel = Word2Vec(\n    sentences,\n    vector_size=50,    # размерность вектора\n    window=3,          # контекстное окно\n    min_count=1,       # минимальная частота\n    sg=1,              # Skip-gram (0 = CBOW)\n    epochs=100\n)\n\nprint("Word2Vec модель:")\nprint(f"  Словарь: {len(model.wv)} слов")\nprint(f"  Размерность: {model.wv.vector_size}")\n\n# Вектор слова\nvec = model.wv["обучение"]\nprint(f"\\nВектор \\"обучение\\": {vec[:5].round(3)}...")\n\n# Похожие слова\nif "обучение" in model.wv:\n    similar = model.wv.most_similar("обучение", topn=5)\n    print(f"\\nПохожие на \\"обучение\\":")\n    for word, score in similar:\n        print(f"  {word}: {score:.4f}")\n\n# Аналогии: king - man + woman = queen\nprint("\\n--- Word Embeddings свойства ---")\nprint("1. Семантическая близость: similar words -> close vectors")\nprint("2. Аналогии: king - man + woman = queen")\nprint("3. Кластеризация: слова группируются по темам")\n\n# Использование предобученных embeddings\nprint("\\n--- Предобученные модели ---")\nprint("Word2Vec: Google News (300D, 3M слов)")\nprint("GloVe: Common Crawl (300D, 2.2M слов)")\nprint("FastText: субсловные эмбеддинги (работают с OOV словами)")' },
        { type: 'note', value: 'Word2Vec и GloVe дают статические embeddings — одно слово = один вектор, независимо от контекста. BERT и другие трансформеры дают контекстуальные embeddings: "банк" (финансовый) != "банк" (берег реки).' }
      ]
    },
    {
      id: 2,
      title: 'Архитектура BERT',
      type: 'theory',
      content: [
        { type: 'heading', value: 'BERT — Bidirectional Encoder Representations from Transformers' },
        { type: 'text', value: 'BERT — модель от Google, которая революционизировала NLP. Ключевые идеи: (1) Bidirectional — смотрит и влево, и вправо одновременно, (2) Pre-training на двух задачах: Masked Language Model (MLM) и Next Sentence Prediction (NSP), (3) Fine-tuning на downstream задачах.' },
        { type: 'code', language: 'python', value: 'from transformers import BertModel, BertTokenizer\nimport torch\n\n# Загрузка BERT\ntokenizer = BertTokenizer.from_pretrained("bert-base-uncased")\nmodel = BertModel.from_pretrained("bert-base-uncased")\n\nprint("BERT Architecture:")\nprint(f"  Layers: {model.config.num_hidden_layers}")\nprint(f"  Hidden size: {model.config.hidden_size}")\nprint(f"  Attention heads: {model.config.num_attention_heads}")\nprint(f"  Vocab size: {model.config.vocab_size}")\nprint(f"  Parameters: {sum(p.numel() for p in model.parameters()):,}")\n\n# Токенизация\ntext = "Machine learning is transforming the world"\ntokens = tokenizer(text, return_tensors="pt", padding=True, truncation=True)\n\nprint(f"\\nТокенизация: \\"{text}\\"")\nprint(f"  Input IDs: {tokens["input_ids"][0].tolist()}")\nprint(f"  Tokens: {tokenizer.convert_ids_to_tokens(tokens["input_ids"][0])}")\nprint(f"  Attention mask: {tokens["attention_mask"][0].tolist()}")\n\n# Forward pass\nwith torch.no_grad():\n    outputs = model(**tokens)\n\nprint(f"\\nBERT Outputs:")\nprint(f"  Last hidden state: {outputs.last_hidden_state.shape}")\nprint(f"  Pooler output: {outputs.pooler_output.shape}")\n\n# [CLS] токен — представление всего предложения\ncls_embedding = outputs.last_hidden_state[0, 0]  # первый токен = [CLS]\nprint(f"  [CLS] embedding: {cls_embedding[:5].tolist()}")\n\n# Сравнение предложений\ntexts = [\n    "I love machine learning",\n    "Deep learning is fascinating",\n    "I enjoy playing football"\n]\n\nembeddings = []\nfor text in texts:\n    tokens = tokenizer(text, return_tensors="pt", padding=True, truncation=True)\n    with torch.no_grad():\n        output = model(**tokens)\n    embeddings.append(output.pooler_output[0])\n\nprint("\\nCosine similarity:")\nfrom torch.nn.functional import cosine_similarity\nfor i in range(len(texts)):\n    for j in range(i+1, len(texts)):\n        sim = cosine_similarity(embeddings[i].unsqueeze(0), embeddings[j].unsqueeze(0))\n        print(f"  \\"{texts[i]}\\" vs \\"{texts[j]}\\": {sim.item():.4f}")' },
        { type: 'list', items: [
          'BERT-base: 12 layers, 768 hidden, 110M params',
          'BERT-large: 24 layers, 1024 hidden, 340M params',
          'Multilingual BERT: 104 языка включая русский',
          'RoBERTa: улучшенный BERT (более долгое pre-training, без NSP)',
          'ALBERT: облегчённый BERT (parameter sharing)'
        ] }
      ]
    },
    {
      id: 3,
      title: 'Fine-tuning BERT (HuggingFace)',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Fine-tuning BERT для классификации' },
        { type: 'text', value: 'HuggingFace Transformers — стандартная библиотека для работы с трансформерами. Fine-tuning BERT для classification: добавляем classification head поверх [CLS] токена и дообучаем всю модель на вашем датасете.' },
        { type: 'code', language: 'python', value: 'from transformers import (\n    BertTokenizer, BertForSequenceClassification,\n    Trainer, TrainingArguments\n)\nimport torch\nfrom torch.utils.data import Dataset\nimport numpy as np\n\n# Простой датасет\nclass TextDataset(Dataset):\n    def __init__(self, texts, labels, tokenizer, max_length=128):\n        self.encodings = tokenizer(texts, truncation=True, padding=True,\n                                   max_length=max_length, return_tensors="pt")\n        self.labels = torch.tensor(labels)\n    \n    def __len__(self):\n        return len(self.labels)\n    \n    def __getitem__(self, idx):\n        item = {key: val[idx] for key, val in self.encodings.items()}\n        item["labels"] = self.labels[idx]\n        return item\n\n# Данные\ntexts_train = [\n    "This movie is amazing and wonderful",\n    "Terrible film, waste of time",\n    "Great acting and beautiful story",\n    "Boring and predictable plot",\n    "One of the best movies ever made",\n    "Absolutely horrible experience",\n    "Stunning visuals and great soundtrack",\n    "Very disappointing and poorly made",\n]\nlabels_train = [1, 0, 1, 0, 1, 0, 1, 0]  # 1=positive, 0=negative\n\ntexts_test = ["Loved every moment of it", "Not worth watching"]\nlabels_test = [1, 0]\n\n# Модель\ntokenizer = BertTokenizer.from_pretrained("bert-base-uncased")\nmodel = BertForSequenceClassification.from_pretrained(\n    "bert-base-uncased", num_labels=2\n)\n\ntrain_dataset = TextDataset(texts_train, labels_train, tokenizer)\ntest_dataset = TextDataset(texts_test, labels_test, tokenizer)\n\nprint("BERT Fine-tuning для Sentiment Analysis:")\nprint(f"  Модель: bert-base-uncased")\nprint(f"  Классы: 2 (positive/negative)")\nprint(f"  Train samples: {len(train_dataset)}")\n\n# Training Arguments\ntraining_args = TrainingArguments(\n    output_dir="./results",\n    num_train_epochs=3,\n    per_device_train_batch_size=4,\n    per_device_eval_batch_size=4,\n    warmup_steps=10,\n    weight_decay=0.01,\n    learning_rate=2e-5,  # маленький lr для fine-tuning!\n    logging_steps=10,\n    eval_strategy="epoch",\n    save_strategy="epoch",\n)\n\ntrainer = Trainer(\n    model=model,\n    args=training_args,\n    train_dataset=train_dataset,\n    eval_dataset=test_dataset,\n)\n\n# trainer.train()  # запуск обучения\n\n# Inference\nprint("\\n--- Inference ---")\ntest_texts = ["This is a great movie", "Terrible waste of time"]\nfor text in test_texts:\n    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True)\n    with torch.no_grad():\n        outputs = model(**inputs)\n    probs = torch.softmax(outputs.logits, dim=1)\n    pred = torch.argmax(probs, dim=1).item()\n    label = "Positive" if pred == 1 else "Negative"\n    print(f"  \\"{text}\\" -> {label} (prob={probs[0][pred]:.3f})")' },
        { type: 'tip', value: 'Learning rate 2e-5 — стандарт для fine-tuning BERT. Слишком высокий lr (>1e-4) может разрушить pretrained weights. Warmup помогает стабилизировать начало обучения.' }
      ]
    },
    {
      id: 4,
      title: 'GPT: основы',
      type: 'theory',
      content: [
        { type: 'heading', value: 'GPT — Generative Pre-trained Transformer' },
        { type: 'text', value: 'GPT — автрегрессионная модель, которая предсказывает следующий токен. В отличие от BERT (bidirectional encoder), GPT — unidirectional decoder, оптимизированный для генерации текста. GPT-2/3/4 показали, что масштабирование (больше параметров + данных) приводит к emergent abilities.' },
        { type: 'code', language: 'python', value: 'from transformers import GPT2LMHeadModel, GPT2Tokenizer\nimport torch\n\n# Загрузка GPT-2\ntokenizer = GPT2Tokenizer.from_pretrained("gpt2")\nmodel = GPT2LMHeadModel.from_pretrained("gpt2")\n\nprint("GPT-2 Architecture:")\nprint(f"  Layers: {model.config.n_layer}")\nprint(f"  Hidden size: {model.config.n_embd}")\nprint(f"  Attention heads: {model.config.n_head}")\nprint(f"  Vocab size: {model.config.vocab_size}")\nprint(f"  Parameters: {sum(p.numel() for p in model.parameters()):,}")\n\n# Генерация текста\ndef generate_text(prompt, max_length=50, temperature=0.7, top_k=50):\n    inputs = tokenizer.encode(prompt, return_tensors="pt")\n    \n    with torch.no_grad():\n        outputs = model.generate(\n            inputs,\n            max_length=max_length,\n            temperature=temperature,\n            top_k=top_k,\n            top_p=0.9,\n            do_sample=True,\n            num_return_sequences=1,\n            pad_token_id=tokenizer.eos_token_id\n        )\n    \n    return tokenizer.decode(outputs[0], skip_special_tokens=True)\n\nprompts = [\n    "Machine learning is",\n    "The future of artificial intelligence",\n]\n\nprint("\\nГенерация текста:")\nfor prompt in prompts:\n    generated = generate_text(prompt, max_length=40)\n    print(f"\\n  Prompt: \\"{prompt}\\"")\n    print(f"  Generated: \\"{generated}\\"")\n\n# Сравнение BERT vs GPT\nprint("\\n--- BERT vs GPT ---")\nprint("                BERT                      GPT")\nprint("Тип             Encoder                   Decoder")\nprint("Направление     Bidirectional             Left-to-right")\nprint("Pre-training    MLM + NSP                 Next token pred")\nprint("Применение      Classification, NER       Text generation")\nprint("Fine-tuning     Task-specific head        Prompt engineering")' },
        { type: 'note', value: 'GPT использует causal (autoregressive) attention: каждый токен видит только предыдущие токены. BERT использует full attention: каждый токен видит все остальные. Поэтому BERT лучше для понимания, GPT — для генерации.' }
      ]
    },
    {
      id: 5,
      title: 'Text Classification с трансформерами',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Классификация текстов: полный pipeline' },
        { type: 'text', value: 'Современный подход к классификации текстов: pretrained трансформер + fine-tuning. Pipeline от HuggingFace позволяет решить задачу в несколько строк. Для русского языка используйте модели: DeepPavlov/rubert-base-cased, ai-forever/sbert_large_nlu_ru.' },
        { type: 'code', language: 'python', value: 'from transformers import pipeline\nimport numpy as np\n\n# 1. Zero-Shot Classification\nprint("=== Zero-Shot Classification ===")\nclassifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")\n\ntexts = [\n    "Python is a great programming language for data science",\n    "The football match ended with a stunning goal",\n    "New research in quantum computing shows promising results"\n]\ncandidate_labels = ["technology", "sports", "science"]\n\nfor text in texts:\n    result = classifier(text, candidate_labels)\n    top_label = result.get("labels", [""])[0]\n    top_score = result.get("scores", [0])[0]\n    short = text[:40]\n    print(f"  {short}... -> {top_label} ({top_score:.3f})")\n\n# 2. Sentiment Analysis\nprint("\\n=== Sentiment Analysis ===")\nsentiment = pipeline("sentiment-analysis")\n\nreviews = [\n    "This product is absolutely amazing!",\n    "Terrible quality, very disappointed",\n    "It works okay, nothing special"\n]\n\nfor review in reviews:\n    result = sentiment(review)[0]\n    label = result.get("label", "")\n    score = result.get("score", 0)\n    print(f"  {review} -> {label} ({score:.3f})")\n\n# 3. Named Entity Recognition\nprint("\\n=== NER ===")\nner = pipeline("ner", grouped_entities=True)\n\ntext = "Google was founded by Larry Page and Sergey Brin in California"\nentities = ner(text)\nfor entity in entities:\n    word = entity.get("word", "")\n    group = entity.get("entity_group", "")\n    score = entity.get("score", 0)\n    print(f"  {word}: {group} ({score:.3f})")\n\n# 4. Модели для русского языка\nprint("\\n=== Модели для русского языка ===")\nprint("DeepPavlov/rubert-base-cased")\nprint("ai-forever/sbert_large_nlu_ru")\nprint("ai-forever/ruGPT-3.5-13B")\n\n# Доступные задачи\nprint("\\n--- Pipeline задачи ---")\nfor task in ["text-classification", "token-classification",\n             "question-answering", "summarization",\n             "translation", "text-generation", "fill-mask"]:\n    print(f"  pipeline({task})")' },
        { type: 'tip', value: 'HuggingFace Hub содержит >200,000 моделей. Для русского языка ищите: DeepPavlov, ai-forever, cointegrated. Для production используйте ONNX Runtime или TorchScript для ускорения inference.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Sentiment Analysis с BERT',
      type: 'practice',
      difficulty: 'medium',
      description: 'Используйте HuggingFace pipeline для анализа тональности текстов.',
      requirements: [
        'Создайте список из 10 отзывов (5 позитивных, 5 негативных)',
        'Используйте pipeline("sentiment-analysis") для классификации',
        'Вычислите accuracy модели на ваших отзывах',
        'Выведите каждый отзыв с предсказанием и confidence',
        'Покажите confusion matrix (TP, TN, FP, FN)'
      ],
      hint: 'pipeline("sentiment-analysis") возвращает dict с "label" (POSITIVE/NEGATIVE) и "score" (confidence). Сравните с вашими метками для подсчёта accuracy.',
      expectedOutput: 'Sentiment Analysis с BERT:\nAccuracy: X/10\n\nОтзывы:\n"..." -> POSITIVE (0.XX) [correct/wrong]\n...\n\nConfusion Matrix:\nTP=X FP=X\nFN=X TN=X',
      solution: 'from transformers import pipeline\n\nsentiment = pipeline("sentiment-analysis")\n\nreviews = [\n    ("This movie is absolutely wonderful and amazing", 1),\n    ("Best product I have ever purchased", 1),\n    ("Great quality and fast delivery", 1),\n    ("I love this restaurant, food is delicious", 1),\n    ("Excellent service and friendly staff", 1),\n    ("Terrible experience, never coming back", 0),\n    ("Worst product ever, total waste of money", 0),\n    ("Very disappointing quality and poor design", 0),\n    ("Horrible customer service, very rude", 0),\n    ("Boring and overpriced, not recommended", 0),\n]\n\nprint("Sentiment Analysis с BERT:")\ntp, tn, fp, fn = 0, 0, 0, 0\n\nfor text, true_label in reviews:\n    result = sentiment(text)[0]\n    pred = 1 if result["label"] == "POSITIVE" else 0\n    correct = pred == true_label\n    \n    if pred == 1 and true_label == 1: tp += 1\n    elif pred == 0 and true_label == 0: tn += 1\n    elif pred == 1 and true_label == 0: fp += 1\n    else: fn += 1\n    \n    status = "correct" if correct else "wrong"\n    print(f"  \\"{text[:40]}...\\" -> {result["label"]} ({result["score"]:.3f}) [{status}]")\n\nacc = (tp + tn) / len(reviews)\nprint(f"\\nAccuracy: {tp+tn}/{len(reviews)}")\nprint(f"\\nConfusion Matrix:")\nprint(f"  TP={tp} FP={fp}")\nprint(f"  FN={fn} TN={tn}")',
      explanation: 'HuggingFace pipeline инкапсулирует токенизацию, inference и постобработку. Pretrained модель для sentiment analysis обучена на large corpora и хорошо работает для англоязычных текстов. Для русского языка используйте специализированные модели (ruBERT).'
    }
  ]
}
