export default {
  id: 14,
  title: 'IT: ML/AI терминология',
  description: 'English для Machine Learning: model, training, inference, overfitting, embeddings, fine-tuning',
  lessons: [
    {
      id: 1,
      title: 'Основы ML: model, dataset, features',
      type: 'theory',
      content: [
        { type: 'text', value: 'ML и AI — одни из самых быстро развивающихся областей IT. Знание английской терминологии необходимо для работы с международными командами и чтения исследований.' },
        { type: 'heading', value: 'Model — модель' },
        { type: 'text', value: '"A machine learning model is a mathematical function that maps inputs to outputs."\n"The model learns patterns from training data."\n"We trained a model to classify customer support tickets by urgency."\n"Model inference: using the trained model to make predictions on new data."' },
        { type: 'heading', value: 'Dataset — датасет' },
        { type: 'text', value: '"A dataset is a collection of data used for training or evaluating a model."\n"Training set: data used to train the model."\n"Validation set: data used to tune hyperparameters and monitor training."\n"Test set: held-out data used for final evaluation — the model should never see this during training."' },
        { type: 'heading', value: 'Features — признаки' },
        { type: 'text', value: '"Features are the input variables used by the model to make predictions."\n"Feature engineering: the process of creating new features from raw data."\n"Feature selection: choosing the most relevant features to reduce noise and dimensionality."\n"Numerical features, categorical features, and text features require different preprocessing."' }
      ]
    },
    {
      id: 2,
      title: 'Training process: epochs, batches, loss, optimiser',
      type: 'theory',
      content: [
        { type: 'text', value: 'Понимание процесса обучения нейронных сетей — основа для работы с ML-командами.' },
        { type: 'heading', value: 'Training terminology' },
        { type: 'text', value: '"Epoch: one complete pass through the entire training dataset."\n"Batch: a subset of the training data processed in one forward/backward pass."\n"Mini-batch gradient descent: processing small batches is a balance between efficiency and accuracy."\n"Iteration: one update of the model weights, processing one batch."' },
        { type: 'heading', value: 'Loss function' },
        { type: 'text', value: '"The loss function measures how wrong the model\'s predictions are."\n"Lower loss = better model performance."\n"Cross-entropy loss is commonly used for classification tasks."\n"Mean Squared Error (MSE) is used for regression tasks."' },
        { type: 'heading', value: 'Optimiser' },
        { type: 'text', value: '"The optimiser adjusts model weights to minimise the loss function."\n"SGD (Stochastic Gradient Descent): updates weights using random batches."\n"Adam: adaptive learning rate optimiser, widely used in practice."\n"Learning rate: controls how large the weight updates are. Too high = unstable training; too low = slow convergence."' },
        { type: 'tip', value: 'Полезная фраза для ML discussions: "We trained the model for 50 epochs with a batch size of 32, using Adam with a learning rate of 1e-4. The validation loss plateaued after epoch 30, suggesting overfitting."' }
      ]
    },
    {
      id: 3,
      title: 'Overfitting, underfitting, generalisation',
      type: 'theory',
      content: [
        { type: 'text', value: 'Обобщающая способность модели — центральная тема в ML-инжиниринге.' },
        { type: 'heading', value: 'Overfitting — переобучение' },
        { type: 'text', value: '"Overfitting occurs when a model performs well on training data but poorly on unseen data."\n"An overfit model has memorised the training data rather than learned general patterns."\n"Signs: training accuracy >> validation accuracy, loss diverges during training."' },
        { type: 'heading', value: 'Underfitting — недообучение' },
        { type: 'text', value: '"Underfitting occurs when a model is too simple to capture the underlying patterns."\n"Signs: both training and validation accuracy are low."\n"Solutions: use a more complex model, train for more epochs, add more features."' },
        { type: 'heading', value: 'Regularisation' },
        { type: 'text', value: '"Regularisation techniques reduce overfitting by penalising model complexity."\n"L1 regularisation (Lasso) encourages sparse weights."\n"L2 regularisation (Ridge) penalises large weights."\n"Dropout: randomly deactivating neurons during training to prevent co-adaptation."\n"Data augmentation: artificially expanding the training set to improve generalisation."' }
      ]
    },
    {
      id: 4,
      title: 'Neural Networks: layers, activations, embeddings',
      type: 'theory',
      content: [
        { type: 'text', value: 'Архитектура нейронных сетей — основа современного ML.' },
        { type: 'heading', value: 'Neural Network components' },
        { type: 'text', value: '"A neural network consists of layers of interconnected nodes (neurons)."\n"Input layer: receives the raw features."\n"Hidden layers: learn increasingly abstract representations of the data."\n"Output layer: produces the final prediction."\n"Weights: the learnable parameters connecting neurons."' },
        { type: 'heading', value: 'Activation functions' },
        { type: 'text', value: '"An activation function introduces non-linearity into the network."\n"ReLU (Rectified Linear Unit): max(0, x) — most commonly used in hidden layers."\n"Sigmoid: maps values to [0,1] — used for binary classification output."\n"Softmax: produces a probability distribution over multiple classes."' },
        { type: 'heading', value: 'Embeddings' },
        { type: 'text', value: '"Embeddings are dense vector representations of discrete objects (words, users, items)."\n"Word embeddings (Word2Vec, GloVe) capture semantic relationships between words."\n"Similar concepts have similar embedding vectors — you can do arithmetic: king - man + woman = queen."\n"Embeddings reduce dimensionality and improve generalisation."' }
      ]
    },
    {
      id: 5,
      title: 'LLMs и Fine-tuning',
      type: 'theory',
      content: [
        { type: 'text', value: 'Большие языковые модели стали неотъемлемой частью современного IT-ландшафта.' },
        { type: 'heading', value: 'LLMs — Large Language Models' },
        { type: 'text', value: '"LLMs are neural networks trained on massive text datasets to generate and understand language."\n"Pre-training: training from scratch on large datasets — extremely compute-intensive."\n"GPT, Claude, LLaMA are examples of LLMs."\n"Transformer architecture: the foundation of modern LLMs, using attention mechanisms."' },
        { type: 'heading', value: 'Fine-tuning' },
        { type: 'text', value: '"Fine-tuning adapts a pre-trained model to a specific task with a smaller, task-specific dataset."\n"Full fine-tuning: updating all model weights — expensive but thorough."\n"LoRA (Low-Rank Adaptation): updating only a small number of parameters — efficient and widely used."\n"RLHF (Reinforcement Learning from Human Feedback): fine-tuning with human preference data."' },
        { type: 'heading', value: 'Inference и deployment' },
        { type: 'text', value: '"Inference: running a trained model to generate predictions on new data."\n"Inference optimisation: quantisation, pruning, and distillation reduce model size and inference latency."\n"Latency vs throughput trade-off: batch inference maximises throughput; real-time inference minimises latency."\n"RAG (Retrieval-Augmented Generation): combining LLMs with external knowledge retrieval."' }
      ]
    },
    {
      id: 6,
      title: 'MLOps: model deployment и monitoring',
      type: 'theory',
      content: [
        { type: 'text', value: 'MLOps — применение DevOps-практик к машинному обучению. Всё более важная область.' },
        { type: 'heading', value: 'MLOps lifecycle' },
        { type: 'text', value: '"MLOps covers the full lifecycle: data preparation, model training, evaluation, deployment, and monitoring."\n"Model registry: centralised storage for trained models with versioning."\n"Feature store: centralised repository for features used in training and inference."' },
        { type: 'heading', value: 'Model monitoring' },
        { type: 'text', value: '"Data drift: when the distribution of production data changes compared to training data."\n"Model drift: when model performance degrades over time due to changing data patterns."\n"We monitor prediction distributions and trigger retraining when drift is detected."' },
        { type: 'heading', value: 'A/B testing и champion/challenger' },
        { type: 'text', value: '"A/B testing: routing some traffic to a new model version to compare performance."\n"Champion model: the current production model."\n"Challenger model: the new model being evaluated against the champion."\n"Shadow mode: running a new model alongside production without serving its predictions — only for evaluation."' },
        { type: 'tip', value: '"Technical debt" в ML особенно коварен: "Our model has been in production for 2 years without retraining. The training data no longer reflects current user behaviour, leading to model drift and degraded recommendation quality."' }
      ]
    },
    {
      id: 7,
      title: 'Практика: ML project discussion',
      type: 'practice',
      difficulty: 'medium',
      description: 'Опишите ML-проект, используя правильную терминологию.',
      requirements: [
        'Используйте минимум 10 ML-терминов',
        'Структурируйте: проблема → данные → модель → оценка → деплой',
        'Задание: spam detection system'
      ],
      hint: 'Начните с постановки задачи: это задача классификации (spam vs not-spam). Опишите данные, выбор модели, метрики оценки.',
      solution: 'We need to build a spam detection system for our email platform. This is a binary classification problem.\n\nData: Our dataset consists of 2 million labeled emails (spam/not-spam). Features include the email body text, sender information, and metadata. We\'ll use text preprocessing: tokenisation, lowercasing, and removing stop words. We then convert text to numerical features using TF-IDF or learned embeddings.\n\nModel: I propose starting with a fine-tuned BERT model for text classification. We split the data 80/10/10 into training, validation, and test sets. The model is trained using cross-entropy loss with Adam optimiser, batch size 32, for 10 epochs. We monitor validation loss to detect overfitting and apply early stopping.\n\nEvaluation: For spam detection, we care more about precision (avoid blocking legitimate emails) and recall (catching spam). We use the F1 score as the primary metric. We achieve 97% F1 on the test set.\n\nDeployment: The model is served via a REST API with a target inference latency under 50ms. We quantise the model (INT8) to reduce size and improve inference speed. In production, we monitor for data drift — if spam patterns change, the model will need retraining.',
      explanation: 'Описание ML-проектов на английском — обязательный навык для ML-инженеров и data scientists в международных командах. Используйте правильную терминологию и структурированный подход к описанию trade-offs.'
    }
  ]
}
