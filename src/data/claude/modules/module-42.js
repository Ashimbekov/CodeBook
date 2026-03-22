export default {
  id: 42,
  title: 'RAG: Retrieval Augmented Generation',
  description: 'Полное руководство по RAG: эмбеддинги, векторные базы данных, стратегии чанкинга, пайплайн поиска и генерации, оценка качества RAG и интеграция с Claude.',
  lessons: [
    {
      id: 1,
      title: 'Что такое RAG и зачем он нужен',
      type: 'theory',
      content: [
        { type: 'text', value: 'RAG (Retrieval Augmented Generation — Генерация с дополнением поиском) — архитектурный паттерн, при котором модель перед генерацией ответа ищет релевантные документы в базе знаний и использует их как контекст.' },
        { type: 'heading', value: 'Проблемы LLM без RAG' },
        { type: 'list', value: [
          'Галлюцинации: модель уверенно выдаёт неверную информацию',
          'Устаревшие данные: знания ограничены датой обучения',
          'Отсутствие приватных данных: модель не знает о вашей документации, базе клиентов',
          'Невозможность проверки источника: нет ссылок на конкретные документы',
          'Ограниченный контекст: нельзя поместить всю базу знаний в промпт'
        ]},
        { type: 'heading', value: 'Как RAG решает эти проблемы' },
        { type: 'code', language: 'python', value: '# Без RAG:\n# Вопрос: "Какова политика возврата товара в нашем магазине?"\n# Ответ Claude: "Обычно магазины принимают возвраты в течение 30 дней..." (выдуманное!)\n\n# С RAG:\n# 1. Ищем в базе документов -> нашли: "политика_возврата.pdf"\n# 2. Извлекаем релевантный отрывок: "Возврат в течение 14 дней с чеком"\n# 3. Отправляем Claude: "На основе документа [политика_возврата.pdf]: ..."\n# Ответ Claude: "Согласно политике возврата, вы можете вернуть товар\n#               в течение 14 дней при наличии чека" (точный и проверяемый!)' },
        { type: 'heading', value: 'Когда использовать RAG' },
        { type: 'list', value: [
          'Корпоративные чат-боты с доступом к внутренней документации',
          'Системы ответов на вопросы по специализированным знаниям',
          'Ассистенты технической поддержки с доступом к базе знаний',
          'Юридические/медицинские системы, где точность критична',
          'Любой случай, где данные часто обновляются или приватны'
        ]},
        { type: 'note', value: 'RAG — это не замена fine-tuning. Fine-tuning меняет поведение модели (стиль, тон, задачи). RAG добавляет актуальные знания. В реальных системах часто используют оба подхода.' }
      ]
    },
    {
      id: 2,
      title: 'Эмбеддинг-модели: преобразование текста в вектора',
      type: 'theory',
      content: [
        { type: 'text', value: 'Эмбеддинг — это числовое представление текста в многомерном пространстве. Похожие по смыслу тексты имеют близкие векторы. Это позволяет искать документы по семантическому смыслу, а не по точному совпадению слов.' },
        { type: 'heading', value: 'Популярные эмбеддинг-модели' },
        { type: 'list', value: [
          'OpenAI text-embedding-3-small: 1536 измерений, хорошее качество/цена',
          'OpenAI text-embedding-3-large: 3072 измерения, лучшее качество',
          'Cohere Embed v3: хорош для многоязычных задач',
          'sentence-transformers (локально): all-MiniLM-L6-v2, бесплатно, 384 измерения',
          'BGE (BAAI): state-of-the-art открытая модель, рекомендуется для production'
        ]},
        { type: 'heading', value: 'Создание эмбеддингов' },
        { type: 'code', language: 'python', value: '# Вариант 1: OpenAI (через API)\nfrom openai import OpenAI\n\noai_client = OpenAI()\n\ndef embed_openai(text: str) -> list[float]:\n    response = oai_client.embeddings.create(\n        model="text-embedding-3-small",\n        input=text\n    )\n    return response.data[0].embedding  # список из 1536 float\n\n# Вариант 2: sentence-transformers (локально, бесплатно)\nfrom sentence_transformers import SentenceTransformer\n\nmodel = SentenceTransformer(\'all-MiniLM-L6-v2\')\n\ndef embed_local(text: str) -> list[float]:\n    return model.encode(text).tolist()  # 384 float\n\n# Пример:\ntext1 = "Как оформить возврат товара?"\ntext2 = "Процедура возврата покупки"\ntext3 = "Рецепт шоколадного торта"\n\n# text1 и text2 будут близки в пространстве векторов\n# text3 будет далеко\n\nv1 = embed_local(text1)\nv2 = embed_local(text2)\nv3 = embed_local(text3)\n\n# Косинусная близость (0 = перпендикулярны, 1 = идентичны)\nimport numpy as np\n\ndef cosine_similarity(a, b):\n    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))\n\nprint(f"text1 vs text2: {cosine_similarity(v1, v2):.3f}")  # ~0.8\nprint(f"text1 vs text3: {cosine_similarity(v1, v3):.3f}")  # ~0.2' },
        { type: 'tip', value: 'Используйте одну и ту же модель эмбеддингов для индексации и для запросов. Смешивание разных моделей сделает поиск бессмысленным — векторные пространства несовместимы.' }
      ]
    },
    {
      id: 3,
      title: 'Векторные базы данных: Pinecone и ChromaDB',
      type: 'theory',
      content: [
        { type: 'text', value: 'Векторная база данных хранит эмбеддинги и умеет быстро находить ближайшие векторы (ANN — Approximate Nearest Neighbor search). Обычные БД не подходят для такого поиска.' },
        { type: 'heading', value: 'ChromaDB — локальная векторная БД' },
        { type: 'code', language: 'python', value: 'import chromadb\nfrom chromadb.utils import embedding_functions\n\n# Инициализация (локальная, без сервера)\nclient = chromadb.Client()  # in-memory\n# Или постоянное хранение:\nclient = chromadb.PersistentClient(path="./chroma_data")\n\n# Встроенная эмбеддинг-функция\nembedder = embedding_functions.SentenceTransformerEmbeddingFunction(\n    model_name="all-MiniLM-L6-v2"\n)\n\n# Создание коллекции\ncollection = client.create_collection(\n    name="company_docs",\n    embedding_function=embedder\n)\n\n# Добавление документов\ncollection.add(\n    documents=[\n        "Возврат товара осуществляется в течение 14 дней с чеком.",\n        "Доставка занимает 2-3 рабочих дня по России.",\n        "Гарантия на электронику составляет 1 год.",\n    ],\n    metadatas=[\n        {"source": "policy.pdf", "page": 1},\n        {"source": "policy.pdf", "page": 2},\n        {"source": "warranty.pdf", "page": 1},\n    ],\n    ids=["doc1", "doc2", "doc3"]\n)\n\n# Поиск\nresults = collection.query(\n    query_texts=["Сколько дней на возврат?"],\n    n_results=2\n)\nprint(results[\'documents\'])   # найденные тексты\nprint(results[\'metadatas\'])   # метаданные (источник)\nprint(results[\'distances\'])   # расстояния (меньше = лучше)' },
        { type: 'heading', value: 'Pinecone — облачная векторная БД' },
        { type: 'code', language: 'python', value: 'from pinecone import Pinecone, ServerlessSpec\n\n# Инициализация\npc = Pinecone(api_key="your-api-key")\n\n# Создание индекса (один раз)\npc.create_index(\n    name="company-docs",\n    dimension=1536,  # размерность эмбеддингов (OpenAI small)\n    metric="cosine",\n    spec=ServerlessSpec(cloud="aws", region="us-east-1")\n)\n\nindex = pc.Index("company-docs")\n\n# Загрузка векторов\nvectors = [\n    ("doc1", embed_openai("Возврат в течение 14 дней"), {"source": "policy.pdf"}),\n    ("doc2", embed_openai("Доставка 2-3 дня"), {"source": "policy.pdf"}),\n]\nindex.upsert(vectors=vectors)\n\n# Поиск\nquery_vector = embed_openai("Сколько дней на возврат?")\nresults = index.query(\n    vector=query_vector,\n    top_k=3,\n    include_metadata=True\n)\nfor match in results.matches:\n    print(f"Score: {match.score:.3f}, Source: {match.metadata[\'source\']}") ' },
        { type: 'note', value: 'ChromaDB — идеален для разработки и небольших проектов (до 1 миллиона векторов). Pinecone — для production с большими объёмами. Для self-hosted production рассмотрите Weaviate или Qdrant.' }
      ]
    },
    {
      id: 4,
      title: 'Стратегии чанкинга (разбивки текста)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Чанкинг — разбивка документов на части перед индексацией. Слишком маленькие чанки теряют контекст, слишком большие — "разбавляют" полезную информацию. Выбор стратегии критично влияет на качество RAG.' },
        { type: 'heading', value: 'Стратегии чанкинга' },
        { type: 'list', value: [
          'Fixed-size: разбивка по N символов с перекрытием — просто, но игнорирует структуру',
          'Sentence splitting: разбивка по предложениям — хорошо для prose-текстов',
          'Recursive character splitting: сначала по параграфам, потом по предложениям, потом по словам',
          'Semantic chunking: объединяем предложения пока они семантически близки — лучшее качество',
          'Document-specific: по заголовкам Markdown/HTML, по параграфам Word-документов'
        ]},
        { type: 'heading', value: 'Реализация рекурсивного чанкинга' },
        { type: 'code', language: 'python', value: 'from langchain.text_splitter import RecursiveCharacterTextSplitter\n\n# Рекурсивный сплиттер (рекомендуется для большинства случаев)\nsplitter = RecursiveCharacterTextSplitter(\n    chunk_size=512,       # целевой размер чанка в символах\n    chunk_overlap=50,     # перекрытие для сохранения контекста\n    separators=[\n        "\\n\\n",  # сначала делим по параграфам\n        "\\n",    # потом по строкам\n        ". ",    # потом по предложениям\n        " ",     # потом по словам\n        ""       # в крайнем случае по символам\n    ]\n)\n\ntext = """\nПолитика возврата товаров\n\nВозврат товара надлежащего качества возможен в течение 14 дней.\nПри возврате необходимо предоставить чек и оригинальную упаковку.\nТовар должен сохранить товарный вид.\n\nВозврат товара ненадлежащего качества осуществляется в течение\nгарантийного срока. Гарантийный срок составляет 12 месяцев.\n"""\n\nchunks = splitter.split_text(text)\nfor i, chunk in enumerate(chunks):\n    print(f"Чанк {i+1} ({len(chunk)} символов):")\n    print(chunk)\n    print("---")\n\n# Результат: каждый чанк содержит завершённые мысли\n# с небольшим перекрытием для связности' },
        { type: 'tip', value: 'Оптимальный размер чанка: 200-500 токенов для большинства задач. Используйте перекрытие 10-20% от размера чанка. Экспериментируйте и измеряйте качество поиска на тестовом наборе вопросов.' }
      ]
    },
    {
      id: 5,
      title: 'Пайплайн RAG: поиск + генерация',
      type: 'theory',
      content: [
        { type: 'text', value: 'Полный RAG-пайплайн состоит из двух фаз: offline (индексация документов) и online (обработка запросов). Разберём обе.' },
        { type: 'heading', value: 'Offline фаза: индексация' },
        { type: 'code', language: 'python', value: 'from sentence_transformers import SentenceTransformer\nimport chromadb\n\nclass RAGIndexer:\n    def __init__(self):\n        self.embedder = SentenceTransformer(\'all-MiniLM-L6-v2\')\n        self.db = chromadb.PersistentClient("./rag_db")\n        self.collection = self.db.get_or_create_collection("knowledge_base")\n    \n    def index_document(self, document: str, source: str):\n        """Разбить документ на чанки и добавить в индекс."""\n        chunks = self._split(document)\n        \n        embeddings = self.embedder.encode(chunks).tolist()\n        ids = [f"{source}_{i}" for i in range(len(chunks))]\n        metadatas = [{"source": source, "chunk_idx": i} for i in range(len(chunks))]\n        \n        self.collection.add(\n            documents=chunks,\n            embeddings=embeddings,\n            metadatas=metadatas,\n            ids=ids\n        )\n        print(f"Проиндексировано {len(chunks)} чанков из {source}")\n    \n    def _split(self, text: str, chunk_size: int = 400, overlap: int = 40) -> list:\n        chunks = []\n        start = 0\n        while start < len(text):\n            end = min(start + chunk_size, len(text))\n            # Стараемся закончить на конце предложения\n            if end < len(text):\n                last_period = text.rfind(\'.\', start, end)\n                if last_period > start + chunk_size // 2:\n                    end = last_period + 1\n            chunks.append(text[start:end].strip())\n            start = end - overlap\n        return [c for c in chunks if len(c) > 20]' },
        { type: 'heading', value: 'Online фаза: поиск и генерация' },
        { type: 'code', language: 'python', value: 'import anthropic\n\nclass RAGPipeline:\n    def __init__(self, indexer: RAGIndexer):\n        self.indexer = indexer\n        self.claude = anthropic.Anthropic()\n    \n    def answer(self, question: str, n_docs: int = 3) -> dict:\n        # 1. Создаём эмбеддинг запроса\n        query_embedding = self.indexer.embedder.encode(question).tolist()\n        \n        # 2. Ищем релевантные чанки\n        results = self.indexer.collection.query(\n            query_embeddings=[query_embedding],\n            n_results=n_docs\n        )\n        \n        retrieved_docs = results[\'documents\'][0]\n        sources = [m[\'source\'] for m in results[\'metadatas\'][0]]\n        \n        # 3. Формируем контекст\n        context = "\\n\\n".join(\n            f"[Источник: {src}]\\n{doc}"\n            for doc, src in zip(retrieved_docs, sources)\n        )\n        \n        # 4. Генерируем ответ через Claude\n        response = self.claude.messages.create(\n            model="claude-opus-4-5",\n            max_tokens=1024,\n            system="""Ты ассистент компании. Отвечай ТОЛЬКО на основе предоставленных документов.\nЕсли ответа нет в документах — скажи об этом честно.\nВсегда указывай источник информации.""",\n            messages=[{\n                "role": "user",\n                "content": f"Документы:\\n{context}\\n\\nВопрос: {question}"\n            }]\n        )\n        \n        return {\n            "answer": response.content[0].text,\n            "sources": list(set(sources)),\n            "retrieved_chunks": retrieved_docs\n        }' },
        { type: 'note', value: 'Паттерн "отвечай только по документам" снижает галлюцинации, но Claude может всё равно дополнять ответ из общих знаний. Добавьте проверку: если расстояние до ближайшего документа > порога — скажите "информации не найдено".' }
      ]
    },
    {
      id: 6,
      title: 'Оценка качества RAG',
      type: 'theory',
      content: [
        { type: 'text', value: 'RAG-систему нужно измерять количественно. Без метрик невозможно улучшать систему. Существуют специальные фреймворки для evaluation RAG: RAGAS, TruLens, DeepEval.' },
        { type: 'heading', value: 'Ключевые метрики RAG' },
        { type: 'list', value: [
          'Context Recall: насколько полно retrieved документы покрывают ответ? (0-1)',
          'Context Precision: какая доля retrieved документов действительно релевантна? (0-1)',
          'Faithfulness: соответствует ли ответ модели содержанию документов? (0-1)',
          'Answer Relevance: насколько ответ отвечает на исходный вопрос? (0-1)',
          'Latency: среднее время ответа (мс)',
          'Cost per query: стоимость одного запроса ($)'
        ]},
        { type: 'heading', value: 'Использование Claude как судьи' },
        { type: 'code', language: 'python', value: 'import anthropic\nimport json\n\nclient = anthropic.Anthropic()\n\ndef evaluate_rag_response(\n    question: str,\n    context: str,\n    answer: str\n) -> dict:\n    """Используем Claude как судью для оценки RAG ответа."""\n    \n    eval_prompt = f"""Оцени качество ответа RAG-системы.\n\nВопрос: {question}\n\nКонтекст (найденные документы):\n{context}\n\nОтвет системы:\n{answer}\n\nОцени по шкале 0-10 и дай краткое обоснование:\n1. faithfulness: Насколько ответ основан на контексте (не выдуман)?\n2. relevance: Насколько ответ отвечает на вопрос?\n3. completeness: Насколько полно используется контекст?\n\nОтвечай строго в JSON формате:\n{{"faithfulness": 8, "relevance": 9, "completeness": 7,\n  "explanation": "Ответ точно отражает контекст, но..."}}"""\n    \n    response = client.messages.create(\n        model="claude-opus-4-5",\n        max_tokens=500,\n        messages=[{"role": "user", "content": eval_prompt}]\n    )\n    \n    result = json.loads(response.content[0].text)\n    result[\'average\'] = (\n        result[\'faithfulness\'] + \n        result[\'relevance\'] + \n        result[\'completeness\']\n    ) / 3\n    return result\n\n# Пример\nscores = evaluate_rag_response(\n    question="Сколько дней на возврат?",\n    context="Возврат товара в течение 14 дней с чеком.",\n    answer="Вы можете вернуть товар в течение 14 дней при наличии чека."\n)\nprint(f"Средняя оценка: {scores[\'average\']:.1f}/10")' },
        { type: 'tip', value: 'Создайте golden dataset из ~50-100 вопросов с эталонными ответами. Запускайте автоматическую оценку при каждом изменении пайплайна (параметры чанкинга, количество документов, промпт).' }
      ]
    },
    {
      id: 7,
      title: 'Продвинутые техники RAG',
      type: 'theory',
      content: [
        { type: 'text', value: 'Базовый RAG работает хорошо, но продвинутые техники значительно улучшают качество: HyDE, re-ranking, hybrid search, query decomposition.' },
        { type: 'heading', value: 'HyDE: Hypothetical Document Embeddings' },
        { type: 'code', language: 'python', value: '# HyDE: вместо поиска по запросу, генерируем гипотетический\n# ответ и ищем по его эмбеддингу. Улучшает recall на сложных запросах.\n\nimport anthropic\n\nclient = anthropic.Anthropic()\n\ndef hyde_search(question: str, collection) -> list:\n    # 1. Генерируем гипотетический документ\n    response = client.messages.create(\n        model="claude-haiku-4-5",  # дешевле, скорость важна\n        max_tokens=200,\n        messages=[{\n            "role": "user",\n            "content": f"Напиши краткий ответ на вопрос так,\\n"\n                       f"как он мог бы звучать в официальном документе:\\n{question}"\n        }]\n    )\n    hypothetical_answer = response.content[0].text\n    \n    # 2. Ищем по эмбеддингу гипотетического ответа\n    results = collection.query(\n        query_texts=[hypothetical_answer],\n        n_results=3\n    )\n    return results\n\n# Re-ranking: переоцениваем найденные документы\ndef rerank_results(question: str, documents: list) -> list:\n    """Используем Claude для переранжирования результатов поиска."""\n    scored = []\n    for doc in documents:\n        response = client.messages.create(\n            model="claude-haiku-4-5",\n            max_tokens=10,\n            messages=[{\n                "role": "user",\n                "content": f"Оцени релевантность (1-10) документа для вопроса.\\n"\n                           f"Вопрос: {question}\\nДокумент: {doc[:200]}\\n"\n                           f"Ответь только цифрой."\n            }]\n        )\n        score = int(response.content[0].text.strip())\n        scored.append((doc, score))\n    \n    return [doc for doc, _ in sorted(scored, key=lambda x: x[1], reverse=True)]' },
        { type: 'heading', value: 'Hybrid Search: векторный + ключевой поиск' },
        { type: 'code', language: 'python', value: '# Hybrid search: объединяем семантический поиск с BM25 (keyword)\n# Решает проблему "точных терминов" (названия, коды товаров)\n\nfrom rank_bm25 import BM25Okapi\n\nclass HybridSearch:\n    def __init__(self, documents: list, collection):\n        self.documents = documents\n        self.collection = collection\n        # BM25 для ключевого поиска\n        tokenized = [doc.split() for doc in documents]\n        self.bm25 = BM25Okapi(tokenized)\n    \n    def search(self, query: str, alpha: float = 0.5) -> list:\n        """alpha=0.5: равный вес семантики и ключей.\n           alpha=1.0: только семантика.\n           alpha=0.0: только ключевой поиск."""\n        \n        # Семантический поиск\n        vector_results = self.collection.query(\n            query_texts=[query], n_results=10\n        )\n        \n        # Ключевой поиск\n        bm25_scores = self.bm25.get_scores(query.split())\n        \n        # RRF (Reciprocal Rank Fusion) объединение\n        final_scores = {}\n        for i, doc_id in enumerate(vector_results[\'ids\'][0]):\n            final_scores[doc_id] = final_scores.get(doc_id, 0) + alpha / (i + 1)\n        \n        for i, score in enumerate(sorted(range(len(bm25_scores)), \n                                         key=lambda x: bm25_scores[x], reverse=True)):\n            doc_id = f"doc_{score}"\n            final_scores[doc_id] = final_scores.get(doc_id, 0) + (1-alpha) / (i + 1)\n        \n        return sorted(final_scores, key=final_scores.get, reverse=True)[:5]' },
        { type: 'note', value: 'Hybrid search особенно эффективен когда пользователи используют точные термины (артикулы товаров, имена, даты). Начинайте с alpha=0.7 в пользу семантики и настраивайте по метрикам.' }
      ]
    },
    {
      id: 8,
      title: 'Практика: RAG с Claude для документации',
      type: 'practice',
      difficulty: 'hard',
      description: 'Постройте полный RAG-пайплайн: проиндексируйте набор документов с ChromaDB, реализуйте поиск и генерацию ответов с Claude, добавьте базовую оценку качества.',
      requirements: [
        'Создайте набор из 5+ тестовых документов на русском языке (политика компании, FAQ)',
        'Проиндексируйте документы в ChromaDB с sentence-transformers',
        'Реализуйте класс RAGSystem с методами index() и query()',
        'В query() используйте Claude claude-opus-4-5 для генерации ответа на основе найденных документов',
        'Добавьте метрику: если максимальная близость < 0.4 — верните "Информация не найдена"',
        'Протестируйте на 3 вопросах: 2 релевантных, 1 нерелевантный'
      ],
      expectedOutput: 'RAGSystem, который находит документы, генерирует ответ с указанием источников и честно говорит когда информации нет.',
      hint: 'Используйте chromadb.Client() для in-memory хранилища. Не забудьте, что ChromaDB с embedding_function автоматически создаёт эмбеддинги при add() и query().',
      solution: `import chromadb
from chromadb.utils import embedding_functions
import anthropic

class RAGSystem:
    def __init__(self):
        self.client_db = chromadb.Client()
        self.embedder = embedding_functions.SentenceTransformerEmbeddingFunction(
            model_name="all-MiniLM-L6-v2"
        )
        self.collection = self.client_db.create_collection(
            name="docs",
            embedding_function=self.embedder
        )
        self.claude = anthropic.Anthropic()

    def index(self, documents: list[dict]):
        """documents: список {"text": str, "source": str}"""
        texts = [d["text"] for d in documents]
        metas = [{"source": d["source"]} for d in documents]
        ids = [f"doc_{i}" for i in range(len(documents))]
        self.collection.add(documents=texts, metadatas=metas, ids=ids)
        print(f"Проиндексировано {len(documents)} документов")

    def query(self, question: str, n_results: int = 3) -> dict:
        results = self.collection.query(
            query_texts=[question],
            n_results=n_results,
            include=["documents", "metadatas", "distances"]
        )

        docs = results["documents"][0]
        metas = results["metadatas"][0]
        distances = results["distances"][0]

        # Проверяем релевантность (ChromaDB возвращает L2 расстояние)
        # Для cosine: значение > 0.8 означает малую близость
        min_distance = min(distances) if distances else 999
        if min_distance > 0.8:
            return {
                "answer": "Информация по вашему вопросу не найдена в базе знаний.",
                "sources": [],
                "found": False
            }

        # Формируем контекст
        context_parts = []
        sources = []
        for doc, meta, dist in zip(docs, metas, distances):
            context_parts.append(f"[{meta['source']}]: {doc}")
            sources.append(meta["source"])

        context = "\\n\\n".join(context_parts)

        # Генерируем ответ
        response = self.claude.messages.create(
            model="claude-opus-4-5",
            max_tokens=512,
            system="Ты ассистент. Отвечай строго по предоставленным документам. Всегда указывай источник.",
            messages=[{
                "role": "user",
                "content": f"Документы:\\n{context}\\n\\nВопрос: {question}"
            }]
        )

        return {
            "answer": response.content[0].text,
            "sources": list(set(sources)),
            "found": True
        }

# Тест
rag = RAGSystem()

docs = [
    {"text": "Возврат товара осуществляется в течение 14 дней с момента покупки при наличии чека.", "source": "return_policy.txt"},
    {"text": "Доставка по Москве занимает 1-2 рабочих дня, по России — 3-5 рабочих дней.", "source": "delivery.txt"},
    {"text": "Гарантийный срок на всю электронику составляет 12 месяцев.", "source": "warranty.txt"},
    {"text": "Оплата принимается картой Visa, Mastercard, МИР и наличными.", "source": "payment.txt"},
    {"text": "Интернет-магазин работает ежедневно с 9:00 до 21:00.", "source": "schedule.txt"},
]

rag.index(docs)

questions = [
    "Сколько дней можно вернуть товар?",
    "Как долго доставляют в регионы?",
    "Какова ваша политика по торговле криптовалютой?",  # нерелевантный
]

for q in questions:
    print(f"\\nВопрос: {q}")
    result = rag.query(q)
    print(f"Ответ: {result['answer']}")
    if result["sources"]:
        print(f"Источники: {result['sources']}")`,
      explanation: 'RAG-система работает в два этапа: индексация (конвертируем документы в векторы и храним в ChromaDB) и поиск-генерация (конвертируем вопрос в вектор, находим ближайшие документы, отправляем их в контекст Claude). Ключевой момент — порог релевантности: если расстояние до ближайшего документа велико, честно сообщаем что информации нет, вместо того чтобы галлюцинировать.'
    }
  ]
}
