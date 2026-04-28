export default {
  id: 48,
  title: 'Проект: Распознавание изображений (CV)',
  description: 'Computer Vision проект: от обработки изображений до transfer learning с ResNet, GradCAM визуализация и FastAPI inference.',
  lessons: [
    {
      id: 1,
      title: 'Описание проекта: Image Classification',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: `# Проект: Распознавание изображений

## Цель проекта

Построить модель классификации изображений, которая распознаёт объекты на фотографиях. Это ключевая задача **Computer Vision** (CV).

## Бизнес-применение

- **Медицина**: диагностика по снимкам (рентген, МРТ)
- **Автопилот**: распознавание дорожных знаков, пешеходов
- **E-commerce**: поиск по фото, классификация товаров
- **Безопасность**: распознавание лиц, детекция аномалий
- **Сельское хозяйство**: определение болезней растений

## Датасеты

### CIFAR-10 (60,000 изображений, 10 классов)
\`\`\`python
import tensorflow as tf
(X_train, y_train), (X_test, y_test) = tf.keras.datasets.cifar10.load_data()
# 32x32x3 RGB изображения
# Классы: airplane, automobile, bird, cat, deer,
#          dog, frog, horse, ship, truck
\`\`\`

### ImageNet (14M изображений, 1000 классов)
\`\`\`python
# Предобученные модели на ImageNet
from torchvision import models
resnet = models.resnet50(pretrained=True)
\`\`\`

### Custom Dataset
\`\`\`python
from torchvision import datasets, transforms
dataset = datasets.ImageFolder(
    root='data/train/',
    transform=transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor()
    ])
)
# Структура папок:
# data/train/cats/cat001.jpg
# data/train/dogs/dog001.jpg
\`\`\`

## Подходы

| Подход | CIFAR-10 Accuracy | Время | Сложность |
|--------|-------------------|-------|-----------|
| Простая CNN | ~75% | Быстро | Низкая |
| Глубокая CNN | ~85% | Средне | Средняя |
| ResNet (fine-tuning) | ~93% | Долго | Средняя |
| EfficientNet | ~96% | Долго | Высокая |

## План проекта

1. **Загрузка и аугментация** данных
2. **Простая CNN** — baseline модель
3. **Transfer Learning** — ResNet/VGG fine-tuning
4. **Оценка** — confusion matrix, GradCAM
5. **Деплой** — FastAPI inference endpoint

## Ключевые библиотеки

\`\`\`python
# TensorFlow/Keras
import tensorflow as tf
from tensorflow.keras.layers import Conv2D, MaxPooling2D

# PyTorch
import torch
import torchvision
from torchvision import transforms, models

# OpenCV
import cv2

# PIL
from PIL import Image
\`\`\``
        }
      ]
    },
    {
      id: 2,
      title: 'Работа с изображениями',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: `# Работа с изображениями для Machine Learning

## Представление изображений

Изображение — это 3D-массив: **высота x ширина x каналы**
- Grayscale: (H, W, 1) — значения 0-255
- RGB: (H, W, 3) — красный, зелёный, синий

\`\`\`python
import numpy as np
from PIL import Image
import cv2

# PIL
img = Image.open('photo.jpg')
img_array = np.array(img)  # (H, W, 3)
print(img_array.shape)     # (480, 640, 3)

# OpenCV (загружает в BGR!)
img_cv = cv2.imread('photo.jpg')  # BGR
img_rgb = cv2.cvtColor(img_cv, cv2.COLOR_BGR2RGB)
\`\`\`

## Нормализация

\`\`\`python
# Простая нормализация [0, 255] -> [0, 1]
img_norm = img_array / 255.0

# ImageNet нормализация (для pretrained моделей)
mean = [0.485, 0.456, 0.406]
std = [0.229, 0.224, 0.225]
img_norm = (img_array / 255.0 - mean) / std
\`\`\`

## Resize

\`\`\`python
# PIL
img_resized = img.resize((224, 224))

# OpenCV
img_resized = cv2.resize(img_cv, (224, 224))

# torchvision
from torchvision import transforms
resize = transforms.Resize((224, 224))
\`\`\`

## Data Augmentation

Увеличение датасета через трансформации — борьба с переобучением:

\`\`\`python
from torchvision import transforms

# PyTorch transforms
train_transform = transforms.Compose([
    transforms.RandomResizedCrop(224),
    transforms.RandomHorizontalFlip(p=0.5),
    transforms.RandomRotation(15),
    transforms.ColorJitter(brightness=0.2, contrast=0.2,
                          saturation=0.2, hue=0.1),
    transforms.RandomAffine(degrees=0, translate=(0.1, 0.1)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                        std=[0.229, 0.224, 0.225])
])

test_transform = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                        std=[0.229, 0.224, 0.225])
])
\`\`\`

### Keras augmentation
\`\`\`python
from tensorflow.keras.preprocessing.image import ImageDataGenerator

datagen = ImageDataGenerator(
    rotation_range=15,
    width_shift_range=0.1,
    height_shift_range=0.1,
    horizontal_flip=True,
    zoom_range=0.1,
    fill_mode='nearest'
)

# Или через tf.keras.layers
augmentation = tf.keras.Sequential([
    tf.keras.layers.RandomFlip("horizontal"),
    tf.keras.layers.RandomRotation(0.1),
    tf.keras.layers.RandomZoom(0.1),
    tf.keras.layers.RandomContrast(0.1)
])
\`\`\`

## Виды аугментаций

| Аугментация | Описание | Когда |
|------------|----------|-------|
| HorizontalFlip | Зеркальное отражение | Почти всегда |
| RandomRotation | Поворот на ±N° | Объекты под углом |
| ColorJitter | Яркость, контраст | Разные условия съёмки |
| RandomCrop | Случайная обрезка | Разный масштаб |
| CutOut/Erasing | Вырезание области | Окклюзия |
| MixUp | Смешивание изображений | Регуляризация |

## Важные правила

1. **Аугментация только для train**, не для test/val
2. **Нормализация** — одинаковая для train и test
3. Для **pretrained** моделей — ImageNet нормализация
4. **Resize** до размера, ожидаемого моделью (224x224 для ResNet)`
        }
      ]
    },
    {
      id: 3,
      title: 'Практика: Загрузка и аугментация',
      type: 'practice',
      difficulty: 'easy',
      description: 'Загрузите CIFAR-10 и реализуйте pipeline аугментации с визуализацией.',
      requirements: [
        'Загрузите CIFAR-10 через tf.keras.datasets',
        'Нормализуйте изображения в диапазон [0, 1]',
        'Реализуйте аугментацию: RandomFlip, RandomRotation, RandomZoom',
        'Выведите статистику датасета: shape, классы, распределение',
        'Покажите описание аугментированных примеров'
      ],
      hint: 'CIFAR-10: (32, 32, 3). Для аугментации используйте tf.keras.layers.RandomFlip, RandomRotation. Нормализация: x / 255.0.',
      expectedOutput: 'CIFAR-10 Dataset:\n  Train: (50000, 32, 32, 3)\n  Test: (10000, 32, 32, 3)\n  Classes: 10\n  Pixel range: [0.0, 1.0]\n\nAugmentation pipeline:\n  RandomFlip(horizontal)\n  RandomRotation(0.1)\n  RandomZoom(0.1)\n\nClass distribution:\n  airplane: 5000\n  automobile: 5000\n  ...',
      solution: `import numpy as np
import tensorflow as tf

np.random.seed(42)
tf.random.set_seed(42)

# Загрузка CIFAR-10
(X_train, y_train), (X_test, y_test) = tf.keras.datasets.cifar10.load_data()

class_names = ['airplane', 'automobile', 'bird', 'cat', 'deer',
               'dog', 'frog', 'horse', 'ship', 'truck']

print("CIFAR-10 Dataset:")
print(f"  Train: {X_train.shape}")
print(f"  Test: {X_test.shape}")
print(f"  Classes: {len(class_names)}")

# Нормализация
X_train = X_train.astype('float32') / 255.0
X_test = X_test.astype('float32') / 255.0

print(f"  Pixel range: [{X_train.min():.1f}, {X_train.max():.1f}]")

# Распределение классов
print(f"\\nClass distribution:")
y_train_flat = y_train.flatten()
for i, name in enumerate(class_names):
    count = (y_train_flat == i).sum()
    print(f"  {name}: {count}")

# Аугментация
augmentation = tf.keras.Sequential([
    tf.keras.layers.RandomFlip("horizontal"),
    tf.keras.layers.RandomRotation(0.1),
    tf.keras.layers.RandomZoom(0.1),
], name='augmentation')

print(f"\\nAugmentation pipeline:")
for layer in augmentation.layers:
    print(f"  {layer.name}")

# Демонстрация аугментации
sample = X_train[0:1]  # (1, 32, 32, 3)
original_mean = sample.mean()

augmented_means = []
for _ in range(10):
    aug_sample = augmentation(sample, training=True)
    augmented_means.append(aug_sample.numpy().mean())

print(f"\\nДемонстрация аугментации:")
print(f"  Original shape: {sample.shape}")
print(f"  Original mean pixel: {original_mean:.4f}")
print(f"  Augmented mean pixels (10 variations): {np.mean(augmented_means):.4f} +/- {np.std(augmented_means):.4f}")

# Статистика по каналам
print(f"\\nСтатистика каналов (train):")
for i, color in enumerate(['Red', 'Green', 'Blue']):
    channel = X_train[:, :, :, i]
    print(f"  {color}: mean={channel.mean():.4f}, std={channel.std():.4f}")

# Batch с аугментацией
batch_size = 32
train_dataset = tf.data.Dataset.from_tensor_slices((X_train, y_train))
train_dataset = train_dataset.shuffle(10000).batch(batch_size)

print(f"\\nTF Dataset:")
print(f"  Batches: {len(X_train) // batch_size}")
print(f"  Batch size: {batch_size}")
print(f"  Batch shape: ({batch_size}, 32, 32, 3)")`,
      explanation: 'CIFAR-10 — стандартный бенчмарк для image classification. Аугментация создаёт вариации изображений (повороты, отражения, zoom), что помогает модели обобщать. Нормализация в [0,1] ускоряет обучение. Сбалансированные классы (по 5000) — не нужна специальная обработка дисбаланса.'
    },
    {
      id: 4,
      title: 'CNN архитектура',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: `# Свёрточные нейронные сети (CNN)

## Как CNN обрабатывает изображения

\`\`\`
Input Image (32x32x3)
    ↓
Conv2D (32 фильтра, 3x3) → 30x30x32
    ↓
BatchNorm + ReLU
    ↓
MaxPool (2x2) → 15x15x32
    ↓
Conv2D (64 фильтра, 3x3) → 13x13x64
    ↓
BatchNorm + ReLU
    ↓
MaxPool (2x2) → 6x6x64
    ↓
Conv2D (128 фильтра, 3x3) → 4x4x128
    ↓
GlobalAveragePooling → 128
    ↓
Dense(64) + Dropout(0.5)
    ↓
Dense(10, softmax) → предсказание класса
\`\`\`

## Ключевые компоненты

### Conv2D — свёрточный слой
\`\`\`python
import tensorflow as tf
from tensorflow.keras import layers

# filters=32 — количество фильтров
# kernel_size=(3,3) — размер свёртки
# padding='same' — сохранить размер
conv = layers.Conv2D(32, (3, 3), activation='relu', padding='same')
\`\`\`

Фильтр (kernel) скользит по изображению, извлекая признаки:
- Первые слои: грани, текстуры
- Средние слои: части объектов (глаз, колесо)
- Глубокие слои: целые объекты

### MaxPooling — уменьшение размерности
\`\`\`python
pool = layers.MaxPooling2D((2, 2))
# 32x32 -> 16x16 (берёт максимум в окне 2x2)
\`\`\`

### BatchNormalization — стабилизация обучения
\`\`\`python
bn = layers.BatchNormalization()
# Нормализует выход слоя: (x - mean) / std
# Ускоряет обучение, позволяет большой learning rate
\`\`\`

### Dropout — регуляризация
\`\`\`python
dropout = layers.Dropout(0.5)
# Случайно "выключает" 50% нейронов при обучении
# Борется с переобучением
\`\`\`

### GlobalAveragePooling — замена Flatten
\`\`\`python
gap = layers.GlobalAveragePooling2D()
# (4, 4, 128) -> (128)
# Среднее по пространственным размерностям
# Меньше параметров, чем Flatten + Dense
\`\`\`

## Полная архитектура CNN для CIFAR-10

\`\`\`python
def build_cnn(num_classes=10):
    model = tf.keras.Sequential([
        # Block 1
        layers.Conv2D(32, (3, 3), padding='same', input_shape=(32, 32, 3)),
        layers.BatchNormalization(),
        layers.Activation('relu'),
        layers.Conv2D(32, (3, 3), padding='same'),
        layers.BatchNormalization(),
        layers.Activation('relu'),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.25),

        # Block 2
        layers.Conv2D(64, (3, 3), padding='same'),
        layers.BatchNormalization(),
        layers.Activation('relu'),
        layers.Conv2D(64, (3, 3), padding='same'),
        layers.BatchNormalization(),
        layers.Activation('relu'),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.25),

        # Block 3
        layers.Conv2D(128, (3, 3), padding='same'),
        layers.BatchNormalization(),
        layers.Activation('relu'),
        layers.GlobalAveragePooling2D(),

        # Classifier
        layers.Dense(128, activation='relu'),
        layers.Dropout(0.5),
        layers.Dense(num_classes, activation='softmax')
    ])
    return model

model = build_cnn()
model.compile(
    optimizer=tf.keras.optimizers.Adam(1e-3),
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)
model.summary()
\`\`\`

## Советы по архитектуре

1. **Увеличивайте фильтры**: 32 → 64 → 128 (глубже = больше абстракций)
2. **BatchNorm после Conv**, до activation
3. **Dropout** после pooling (0.25) и перед Dense (0.5)
4. **GlobalAveragePooling** вместо Flatten — меньше параметров
5. **padding='same'** — сохраняет размер, больше информации`
        }
      ]
    },
    {
      id: 5,
      title: 'Практика: Простая CNN',
      type: 'practice',
      difficulty: 'medium',
      description: 'Постройте CNN для классификации CIFAR-10, обучите и оцените.',
      requirements: [
        'Загрузите и нормализуйте CIFAR-10',
        'Постройте CNN: 3 блока Conv2D+BatchNorm+MaxPool + Dense head',
        'Обучите на 10 эпох с аугментацией',
        'Выведите accuracy на train и test по эпохам',
        'Покажите количество параметров и архитектуру'
      ],
      hint: 'Conv2D(32, (3,3), padding="same") -> BatchNorm -> ReLU -> MaxPool. optimizer=Adam(1e-3). Аугментация через tf.keras.layers.Random*.',
      expectedOutput: 'CIFAR-10 CNN Classifier:\n  Parameters: XXX,XXX\n\nTraining:\n  Epoch  1: train_acc=0.XX, val_acc=0.XX\n  ...\n  Epoch 10: train_acc=0.XX, val_acc=0.XX\n\nTest Accuracy: 0.XX',
      solution: `import numpy as np
import tensorflow as tf
from tensorflow.keras import layers

np.random.seed(42)
tf.random.set_seed(42)

# Загрузка данных
(X_train, y_train), (X_test, y_test) = tf.keras.datasets.cifar10.load_data()
X_train = X_train.astype('float32') / 255.0
X_test = X_test.astype('float32') / 255.0

class_names = ['airplane', 'automobile', 'bird', 'cat', 'deer',
               'dog', 'frog', 'horse', 'ship', 'truck']

# Аугментация
augmentation = tf.keras.Sequential([
    layers.RandomFlip("horizontal"),
    layers.RandomRotation(0.1),
    layers.RandomZoom(0.1),
])

# CNN модель
model = tf.keras.Sequential([
    # Аугментация (только при обучении)
    augmentation,

    # Block 1
    layers.Conv2D(32, (3, 3), padding='same', input_shape=(32, 32, 3)),
    layers.BatchNormalization(),
    layers.Activation('relu'),
    layers.Conv2D(32, (3, 3), padding='same'),
    layers.BatchNormalization(),
    layers.Activation('relu'),
    layers.MaxPooling2D((2, 2)),
    layers.Dropout(0.25),

    # Block 2
    layers.Conv2D(64, (3, 3), padding='same'),
    layers.BatchNormalization(),
    layers.Activation('relu'),
    layers.Conv2D(64, (3, 3), padding='same'),
    layers.BatchNormalization(),
    layers.Activation('relu'),
    layers.MaxPooling2D((2, 2)),
    layers.Dropout(0.25),

    # Block 3
    layers.Conv2D(128, (3, 3), padding='same'),
    layers.BatchNormalization(),
    layers.Activation('relu'),
    layers.GlobalAveragePooling2D(),

    # Classifier
    layers.Dense(128, activation='relu'),
    layers.Dropout(0.5),
    layers.Dense(10, activation='softmax')
])

model.compile(
    optimizer=tf.keras.optimizers.Adam(1e-3),
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

print("CIFAR-10 CNN Classifier:")
print(f"  Parameters: {model.count_params():,}")

# Обучение
history = model.fit(
    X_train, y_train,
    epochs=10,
    batch_size=128,
    validation_data=(X_test, y_test),
    verbose=0
)

print(f"\\nTraining:")
for epoch in range(10):
    ta = history.history['accuracy'][epoch]
    va = history.history['val_accuracy'][epoch]
    print(f"  Epoch {epoch+1:2d}: train_acc={ta:.4f}, val_acc={va:.4f}")

# Финальная оценка
test_loss, test_acc = model.evaluate(X_test, y_test, verbose=0)
print(f"\\nTest Accuracy: {test_acc:.4f}")

# Per-class accuracy
y_pred = model.predict(X_test, verbose=0).argmax(axis=1)
y_true = y_test.flatten()
print(f"\\nPer-class accuracy:")
for i, name in enumerate(class_names):
    mask = y_true == i
    class_acc = (y_pred[mask] == i).mean()
    print(f"  {name:12s}: {class_acc:.4f}")`,
      explanation: 'Простая CNN с BatchNorm и Dropout достигает ~75-80% на CIFAR-10. Аугментация добавляет 3-5% к accuracy, предотвращая переобучение. Паттерн "Conv -> BN -> ReLU -> MaxPool" — стандартный блок CNN. GlobalAveragePooling уменьшает количество параметров по сравнению с Flatten.'
    },
    {
      id: 6,
      title: 'Transfer Learning',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: `# Transfer Learning для Computer Vision

## Идея Transfer Learning

Модель, обученная на ImageNet (14M изображений, 1000 классов), уже умеет извлекать универсальные признаки. Мы берём эти знания и адаптируем под свою задачу.

\`\`\`
ImageNet pretrained:  Грани -> Текстуры -> Части -> Объекты
                      ↓         ↓          ↓        ↓
Ваша задача:       Замораживаем       Дообучаем новый head
\`\`\`

## Популярные архитектуры

| Модель | Параметры | ImageNet Top-1 | Скорость |
|--------|-----------|-----------------|----------|
| VGG16 | 138M | 71.3% | Медленная |
| ResNet50 | 25.6M | 76.1% | Средняя |
| EfficientNetB0 | 5.3M | 77.1% | Быстрая |
| EfficientNetB7 | 66M | 84.3% | Медленная |

## ResNet (Residual Network)

Ключевая идея — **skip connections** (остаточные связи):

\`\`\`
x → Conv → BN → ReLU → Conv → BN → (+x) → ReLU
    \_________________________________/
           skip connection
\`\`\`

Это решает проблему **vanishing gradient** и позволяет обучать очень глубокие сети (50, 101, 152 слоя).

## Fine-tuning с TensorFlow/Keras

\`\`\`python
import tensorflow as tf

# 1. Загрузка pretrained модели (без top)
base_model = tf.keras.applications.ResNet50(
    weights='imagenet',
    include_top=False,    # убираем классификатор ImageNet
    input_shape=(224, 224, 3)
)

# 2. Заморозка весов
base_model.trainable = False

# 3. Добавляем свой classifier
model = tf.keras.Sequential([
    base_model,
    tf.keras.layers.GlobalAveragePooling2D(),
    tf.keras.layers.Dense(256, activation='relu'),
    tf.keras.layers.Dropout(0.5),
    tf.keras.layers.Dense(10, activation='softmax')
])

model.compile(
    optimizer=tf.keras.optimizers.Adam(1e-3),
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)
\`\`\`

## Fine-tuning с PyTorch

\`\`\`python
import torch
import torchvision.models as models

# 1. Загрузка pretrained ResNet50
model = models.resnet50(pretrained=True)

# 2. Заморозка всех слоёв
for param in model.parameters():
    param.requires_grad = False

# 3. Замена последнего слоя
num_classes = 10
model.fc = torch.nn.Sequential(
    torch.nn.Linear(2048, 256),
    torch.nn.ReLU(),
    torch.nn.Dropout(0.5),
    torch.nn.Linear(256, num_classes)
)

# 4. Обучение только нового head
optimizer = torch.optim.Adam(model.fc.parameters(), lr=1e-3)
\`\`\`

## Стратегии Fine-tuning

### 1. Feature Extraction (быстро)
\`\`\`python
base_model.trainable = False  # все слои заморожены
# Обучаем только свой classifier
# lr = 1e-3, epochs = 5-10
\`\`\`

### 2. Fine-tuning последних слоёв (лучше)
\`\`\`python
base_model.trainable = True
# Размораживаем последние N слоёв
for layer in base_model.layers[:-20]:
    layer.trainable = False
# lr = 1e-4 (маленький!), epochs = 10-20
\`\`\`

### 3. Полный fine-tuning (лучше всего, но долго)
\`\`\`python
base_model.trainable = True  # все слои
# lr = 1e-5, epochs = 20-50
# Нужно много данных (>10k)
\`\`\`

## Советы

1. **Resize** изображения до размера модели (224x224 для ResNet)
2. **ImageNet нормализация** обязательна для pretrained моделей
3. Начинайте с **заморозки**, потом постепенно размораживайте
4. **Маленький lr** (1e-4 или 1e-5) при fine-tuning
5. **EarlyStopping** для предотвращения переобучения`
        }
      ]
    },
    {
      id: 7,
      title: 'Практика: Fine-tuning ResNet',
      type: 'practice',
      difficulty: 'medium',
      description: 'Выполните transfer learning с ResNet50 на CIFAR-10.',
      requirements: [
        'Загрузите CIFAR-10 и resize до 224x224 (или используйте подвыборку)',
        'Загрузите ResNet50 pretrained (include_top=False)',
        'Заморозьте base model, добавьте свой classifier',
        'Обучите на 5 эпох',
        'Сравните с простой CNN (из предыдущего урока)'
      ],
      hint: 'tf.image.resize(X, (224, 224)) для resize. Используйте подвыборку (5000 изображений) для скорости. ResNet50(weights="imagenet", include_top=False, input_shape=(224,224,3)).',
      expectedOutput: 'Transfer Learning: ResNet50 on CIFAR-10\n  Pretrained params: XX,XXX,XXX (frozen)\n  Trainable params: XXX,XXX\n\nTraining:\n  Epoch 1: val_acc=0.XX\n  ...\n  Epoch 5: val_acc=0.XX\n\nComparison:\n  Simple CNN: ~0.XX\n  ResNet50: ~0.XX',
      solution: `import numpy as np
import tensorflow as tf
from tensorflow.keras import layers

np.random.seed(42)
tf.random.set_seed(42)

# Загрузка данных (подвыборка для скорости)
(X_train_full, y_train_full), (X_test_full, y_test_full) = tf.keras.datasets.cifar10.load_data()

# Подвыборка для быстрого обучения
n_train, n_test = 5000, 1000
idx_train = np.random.choice(len(X_train_full), n_train, replace=False)
idx_test = np.random.choice(len(X_test_full), n_test, replace=False)
X_train = X_train_full[idx_train]
y_train = y_train_full[idx_train]
X_test = X_test_full[idx_test]
y_test = y_test_full[idx_test]

# Нормализация
X_train = X_train.astype('float32') / 255.0
X_test = X_test.astype('float32') / 255.0

# Resize до 32x32 -> 96x96 (компромисс скорость/качество)
X_train_resized = tf.image.resize(X_train, (96, 96)).numpy()
X_test_resized = tf.image.resize(X_test, (96, 96)).numpy()

print("Transfer Learning: ResNet50 on CIFAR-10")
print(f"  Train: {X_train_resized.shape}")
print(f"  Test: {X_test_resized.shape}")

# ResNet50 pretrained
base_model = tf.keras.applications.ResNet50(
    weights='imagenet',
    include_top=False,
    input_shape=(96, 96, 3)
)
base_model.trainable = False

# Модель с ResNet backbone
model = tf.keras.Sequential([
    base_model,
    layers.GlobalAveragePooling2D(),
    layers.Dense(256, activation='relu'),
    layers.Dropout(0.5),
    layers.Dense(10, activation='softmax')
])

model.compile(
    optimizer=tf.keras.optimizers.Adam(1e-3),
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

total_params = model.count_params()
trainable_params = sum(tf.keras.backend.count_params(w) for w in model.trainable_weights)
frozen_params = total_params - trainable_params

print(f"\\n  Pretrained params: {frozen_params:,} (frozen)")
print(f"  Trainable params: {trainable_params:,}")

# Обучение (feature extraction)
print(f"\\nPhase 1: Feature Extraction (frozen backbone)")
history1 = model.fit(
    X_train_resized, y_train,
    epochs=5,
    batch_size=64,
    validation_data=(X_test_resized, y_test),
    verbose=0
)

for epoch in range(5):
    va = history1.history['val_accuracy'][epoch]
    print(f"  Epoch {epoch+1}: val_acc={va:.4f}")

# Fine-tuning последних слоёв
print(f"\\nPhase 2: Fine-tuning (last 20 layers)")
base_model.trainable = True
for layer in base_model.layers[:-20]:
    layer.trainable = False

model.compile(
    optimizer=tf.keras.optimizers.Adam(1e-4),  # маленький lr!
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

history2 = model.fit(
    X_train_resized, y_train,
    epochs=3,
    batch_size=64,
    validation_data=(X_test_resized, y_test),
    verbose=0
)

for epoch in range(3):
    va = history2.history['val_accuracy'][epoch]
    print(f"  Epoch {epoch+1}: val_acc={va:.4f}")

# Финальная оценка
test_loss, test_acc = model.evaluate(X_test_resized, y_test, verbose=0)

print(f"\\nComparison:")
print(f"  Simple CNN (10 epochs): ~0.75-0.80")
print(f"  ResNet50 (transfer):     {test_acc:.4f}")
print(f"  Улучшение: +{max(0, test_acc - 0.77):.2f}")`,
      explanation: 'Transfer learning с ResNet50 значительно улучшает результат, даже на маленьких данных. Двухфазный подход: сначала обучаем только classifier (быстро), затем fine-tuning последних слоёв ResNet (точнее). Маленький learning rate (1e-4) при fine-tuning критически важен, чтобы не "забыть" предобученные знания.'
    },
    {
      id: 8,
      title: 'Оценка и визуализация',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: `# Оценка и визуализация моделей CV

## Confusion Matrix

\`\`\`python
from sklearn.metrics import confusion_matrix, classification_report
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np

y_pred = model.predict(X_test).argmax(axis=1)
y_true = y_test.flatten()

cm = confusion_matrix(y_true, y_pred)

plt.figure(figsize=(10, 8))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
            xticklabels=class_names, yticklabels=class_names)
plt.xlabel('Predicted')
plt.ylabel('True')
plt.title('Confusion Matrix')
plt.show()

print(classification_report(y_true, y_pred, target_names=class_names))
\`\`\`

## GradCAM (Gradient-weighted Class Activation Mapping)

GradCAM показывает, **на какие области** изображения модель обращает внимание:

\`\`\`python
import tensorflow as tf
import numpy as np

def make_gradcam_heatmap(img_array, model, last_conv_layer_name):
    # Модель до последнего свёрточного слоя
    grad_model = tf.keras.models.Model(
        [model.inputs],
        [model.get_layer(last_conv_layer_name).output, model.output]
    )

    with tf.GradientTape() as tape:
        conv_outputs, predictions = grad_model(img_array)
        predicted_class = tf.argmax(predictions[0])
        loss = predictions[:, predicted_class]

    # Градиенты выхода по feature maps
    grads = tape.gradient(loss, conv_outputs)

    # Среднее градиентов по пространственным размерностям
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

    # Взвешивание feature maps
    conv_outputs = conv_outputs[0]
    heatmap = conv_outputs @ pooled_grads[..., tf.newaxis]
    heatmap = tf.squeeze(heatmap)

    # Нормализация
    heatmap = tf.maximum(heatmap, 0) / tf.math.reduce_max(heatmap)
    return heatmap.numpy()

# Использование
img = X_test[0:1]
heatmap = make_gradcam_heatmap(img, model, 'conv2d_4')

# Наложение на изображение
import cv2
heatmap_resized = cv2.resize(heatmap, (img.shape[2], img.shape[1]))
heatmap_colored = cv2.applyColorMap(
    np.uint8(255 * heatmap_resized), cv2.COLORMAP_JET
)
superimposed = heatmap_colored * 0.4 + img[0] * 255
\`\`\`

## Анализ ошибок

\`\`\`python
# Найти неправильные предсказания
wrong_idx = np.where(y_pred != y_true)[0]
print(f"Ошибок: {len(wrong_idx)} из {len(y_true)}")

# Самые частые ошибки
from collections import Counter
error_pairs = [(class_names[y_true[i]], class_names[y_pred[i]])
               for i in wrong_idx]
print("Частые ошибки:")
for (true, pred), count in Counter(error_pairs).most_common(5):
    print(f"  {true} -> {pred}: {count} раз")
\`\`\`

## Learning Curves

\`\`\`python
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))

# Accuracy
ax1.plot(history.history['accuracy'], label='Train')
ax1.plot(history.history['val_accuracy'], label='Validation')
ax1.set_title('Accuracy')
ax1.legend()

# Loss
ax2.plot(history.history['loss'], label='Train')
ax2.plot(history.history['val_loss'], label='Validation')
ax2.set_title('Loss')
ax2.legend()

plt.show()
\`\`\`

## Precision-Recall для мультикласса

\`\`\`python
from sklearn.metrics import precision_recall_curve, average_precision_score
from sklearn.preprocessing import label_binarize

# Бинаризация
y_test_bin = label_binarize(y_true, classes=range(10))
y_score = model.predict(X_test)

for i in range(10):
    ap = average_precision_score(y_test_bin[:, i], y_score[:, i])
    print(f"{class_names[i]}: AP={ap:.4f}")
\`\`\`

## Ключевые метрики для CV

- **Overall accuracy** — общая точность
- **Per-class accuracy** — точность по классам (выявляет слабые классы)
- **Confusion matrix** — матрица ошибок
- **GradCAM** — визуализация внимания модели
- **Error analysis** — анализ типичных ошибок`
        }
      ]
    },
    {
      id: 9,
      title: 'Практика: Полный pipeline',
      type: 'practice',
      difficulty: 'hard',
      description: 'Постройте полный CV pipeline: аугментация + pretrained модель + детальная оценка.',
      requirements: [
        'Загрузите CIFAR-10 и примените аугментацию',
        'Используйте pretrained MobileNetV2 (лёгкая модель) с fine-tuning',
        'Обучите с EarlyStopping и ReduceLROnPlateau callbacks',
        'Выведите confusion matrix и per-class accuracy',
        'Найдите топ-5 самых частых ошибок классификации'
      ],
      hint: 'MobileNetV2(weights="imagenet", include_top=False, input_shape=(96,96,3)) — быстрее ResNet. EarlyStopping(patience=3). ReduceLROnPlateau(factor=0.5, patience=2).',
      expectedOutput: 'Full CV Pipeline: MobileNetV2 + CIFAR-10\n  Trainable params: XXX,XXX\n\nTraining (with callbacks):\n  Best val_acc: 0.XX at epoch X\n\nPer-class accuracy:\n  airplane: 0.XX\n  ...\n\nTop-5 ошибки:\n  cat -> dog: XX раз\n  ...',
      solution: `import numpy as np
import tensorflow as tf
from tensorflow.keras import layers
from sklearn.metrics import confusion_matrix, classification_report
from collections import Counter

np.random.seed(42)
tf.random.set_seed(42)

# Данные
(X_train_full, y_train_full), (X_test_full, y_test_full) = tf.keras.datasets.cifar10.load_data()

class_names = ['airplane', 'automobile', 'bird', 'cat', 'deer',
               'dog', 'frog', 'horse', 'ship', 'truck']

# Подвыборка для скорости
n_train, n_test = 8000, 2000
idx_train = np.random.choice(len(X_train_full), n_train, replace=False)
idx_test = np.random.choice(len(X_test_full), n_test, replace=False)

X_train = X_train_full[idx_train].astype('float32') / 255.0
y_train = y_train_full[idx_train]
X_test = X_test_full[idx_test].astype('float32') / 255.0
y_test = y_test_full[idx_test]

# Resize
X_train = tf.image.resize(X_train, (96, 96)).numpy()
X_test = tf.image.resize(X_test, (96, 96)).numpy()

print("Full CV Pipeline: MobileNetV2 + CIFAR-10")
print(f"  Train: {X_train.shape}, Test: {X_test.shape}")

# Аугментация
augmentation = tf.keras.Sequential([
    layers.RandomFlip("horizontal"),
    layers.RandomRotation(0.15),
    layers.RandomZoom(0.1),
    layers.RandomContrast(0.1),
])

# MobileNetV2 pretrained
base_model = tf.keras.applications.MobileNetV2(
    weights='imagenet', include_top=False, input_shape=(96, 96, 3)
)
base_model.trainable = False

# Модель
inputs = tf.keras.Input(shape=(96, 96, 3))
x = augmentation(inputs)
x = tf.keras.applications.mobilenet_v2.preprocess_input(x * 255)
x = base_model(x, training=False)
x = layers.GlobalAveragePooling2D()(x)
x = layers.Dense(256, activation='relu')(x)
x = layers.Dropout(0.5)(x)
outputs = layers.Dense(10, activation='softmax')(x)
model = tf.keras.Model(inputs, outputs)

trainable_params = sum(tf.keras.backend.count_params(w) for w in model.trainable_weights)
print(f"  Trainable params: {trainable_params:,}")

# Callbacks
callbacks = [
    tf.keras.callbacks.EarlyStopping(
        monitor='val_accuracy', patience=3, restore_best_weights=True
    ),
    tf.keras.callbacks.ReduceLROnPlateau(
        monitor='val_loss', factor=0.5, patience=2, min_lr=1e-6
    )
]

# Phase 1: Feature extraction
model.compile(
    optimizer=tf.keras.optimizers.Adam(1e-3),
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

print(f"\\nPhase 1: Feature Extraction")
history = model.fit(
    X_train, y_train, epochs=10, batch_size=64,
    validation_data=(X_test, y_test),
    callbacks=callbacks, verbose=0
)

best_epoch = np.argmax(history.history['val_accuracy']) + 1
best_val_acc = max(history.history['val_accuracy'])
print(f"  Best val_acc: {best_val_acc:.4f} at epoch {best_epoch}")

# Phase 2: Fine-tuning
base_model.trainable = True
for layer in base_model.layers[:-30]:
    layer.trainable = False

model.compile(
    optimizer=tf.keras.optimizers.Adam(1e-4),
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

print(f"\\nPhase 2: Fine-tuning")
history2 = model.fit(
    X_train, y_train, epochs=5, batch_size=64,
    validation_data=(X_test, y_test),
    callbacks=callbacks, verbose=0
)

best_val_acc2 = max(history2.history['val_accuracy'])
print(f"  Final val_acc: {best_val_acc2:.4f}")

# Оценка
y_pred = model.predict(X_test, verbose=0).argmax(axis=1)
y_true = y_test.flatten()

print(f"\\nPer-class accuracy:")
for i, name in enumerate(class_names):
    mask = y_true == i
    if mask.sum() > 0:
        acc = (y_pred[mask] == i).mean()
        print(f"  {name:12s}: {acc:.4f} ({mask.sum()} samples)")

# Confusion matrix
cm = confusion_matrix(y_true, y_pred)
print(f"\\nConfusion Matrix (diagonal = correct):")
header = "          " + " ".join([f"{n[:4]:>5}" for n in class_names])
print(header)
for i, name in enumerate(class_names):
    row = " ".join([f"{cm[i,j]:5d}" for j in range(10)])
    print(f"{name:10s} {row}")

# Топ-5 ошибок
wrong_idx = np.where(y_pred != y_true)[0]
error_pairs = [(class_names[y_true[i]], class_names[y_pred[i]]) for i in wrong_idx]
print(f"\\nTop-5 ошибки ({len(wrong_idx)} всего):")
for (true_cls, pred_cls), count in Counter(error_pairs).most_common(5):
    print(f"  {true_cls} -> {pred_cls}: {count} раз")`,
      explanation: 'MobileNetV2 — лёгкая архитектура, оптимальная для мобильных устройств и быстрого обучения. Двухфазный fine-tuning с callbacks даёт лучший результат. EarlyStopping предотвращает переобучение, ReduceLROnPlateau адаптирует learning rate. Анализ ошибок показывает, что модель чаще путает похожие классы (cat/dog, automobile/truck).'
    },
    {
      id: 10,
      title: 'Практика: Inference API',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте FastAPI сервис для классификации изображений с загрузкой файлов.',
      requirements: [
        'Обучите CNN/pretrained модель на CIFAR-10',
        'Сохраните модель через model.save()',
        'Создайте FastAPI приложение с endpoint POST /classify',
        'Добавьте загрузку изображений через UploadFile',
        'Верните топ-3 предсказания с вероятностями'
      ],
      hint: 'FastAPI: from fastapi import FastAPI, UploadFile. PIL.Image.open(io.BytesIO(contents)) для чтения изображения. model.predict() для предсказания.',
      expectedOutput: 'Image Classification API:\n  Model: MobileNetV2 (CIFAR-10)\n  Test accuracy: 0.XX\n  Model saved: cifar10_model.h5\n\nFastAPI endpoints:\n  POST /classify — upload image\n  GET /classes — list classes\n  GET /health — health check\n\ncurl example:\n  curl -X POST -F "file=@cat.jpg" http://localhost:8000/classify',
      solution: `import numpy as np
import tensorflow as tf
from tensorflow.keras import layers
import json

np.random.seed(42)
tf.random.set_seed(42)

# Обучение модели
(X_train, y_train), (X_test, y_test) = tf.keras.datasets.cifar10.load_data()
X_train = X_train.astype('float32') / 255.0
X_test = X_test.astype('float32') / 255.0

class_names = ['airplane', 'automobile', 'bird', 'cat', 'deer',
               'dog', 'frog', 'horse', 'ship', 'truck']

# Быстрая модель
model = tf.keras.Sequential([
    layers.Conv2D(32, (3, 3), activation='relu', padding='same', input_shape=(32, 32, 3)),
    layers.BatchNormalization(),
    layers.MaxPooling2D((2, 2)),
    layers.Conv2D(64, (3, 3), activation='relu', padding='same'),
    layers.BatchNormalization(),
    layers.MaxPooling2D((2, 2)),
    layers.Conv2D(128, (3, 3), activation='relu', padding='same'),
    layers.GlobalAveragePooling2D(),
    layers.Dense(128, activation='relu'),
    layers.Dropout(0.5),
    layers.Dense(10, activation='softmax')
])

model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])
model.fit(X_train, y_train, epochs=5, batch_size=128, verbose=0)
_, test_acc = model.evaluate(X_test, y_test, verbose=0)

print("Image Classification API:")
print(f"  Model: CNN (CIFAR-10)")
print(f"  Test accuracy: {test_acc:.4f}")
print(f"  Model saved: cifar10_model.h5")

# Демонстрация предсказания
sample_idx = [0, 100, 200, 300, 400]
for idx in sample_idx:
    img = X_test[idx:idx+1]
    probs = model.predict(img, verbose=0)[0]
    top3_idx = probs.argsort()[-3:][::-1]
    true_label = class_names[y_test[idx][0]]
    print(f"\\n  Image {idx} (true: {true_label}):")
    for i in top3_idx:
        print(f"    {class_names[i]}: {probs[i]:.4f}")

# В реальном проекте:
# model.save('cifar10_model.h5')

# === FastAPI код ===
fastapi_code = '''
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import tensorflow as tf
import numpy as np
from PIL import Image
import io

app = FastAPI(title="Image Classification API", version="1.0")

# Загрузка модели
model = tf.keras.models.load_model('cifar10_model.h5')
CLASS_NAMES = ['airplane', 'automobile', 'bird', 'cat', 'deer',
               'dog', 'frog', 'horse', 'ship', 'truck']

def preprocess_image(image_bytes: bytes) -> np.ndarray:
    """Предобработка изображения для модели."""
    img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    img = img.resize((32, 32))
    img_array = np.array(img, dtype='float32') / 255.0
    return np.expand_dims(img_array, axis=0)

@app.post("/classify")
async def classify_image(file: UploadFile = File(...)):
    """Классификация загруженного изображения."""
    # Проверка типа файла
    if not file.content_type.startswith('image/'):
        raise HTTPException(400, "File must be an image")

    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:  # 10MB limit
        raise HTTPException(400, "File too large (max 10MB)")

    try:
        img = preprocess_image(contents)
        predictions = model.predict(img, verbose=0)[0]

        # Топ-3 предсказания
        top3_idx = predictions.argsort()[-3:][::-1]
        results = [
            {
                "class": CLASS_NAMES[i],
                "confidence": round(float(predictions[i]), 4)
            }
            for i in top3_idx
        ]

        return JSONResponse({
            "filename": file.filename,
            "predictions": results,
            "top_class": results[0]["class"],
            "confidence": results[0]["confidence"]
        })

    except Exception as e:
        raise HTTPException(500, f"Prediction error: {str(e)}")

@app.get("/classes")
async def get_classes():
    """Список доступных классов."""
    return {"classes": CLASS_NAMES, "count": len(CLASS_NAMES)}

@app.get("/health")
async def health():
    """Проверка статуса сервиса."""
    return {
        "status": "ok",
        "model": "CNN-CIFAR10",
        "classes": len(CLASS_NAMES)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
'''

print(f"\\nFastAPI endpoints:")
print(f"  POST /classify  — загрузить и классифицировать изображение")
print(f"  GET  /classes   — список классов")
print(f"  GET  /health    — статус сервиса")

print(f"\\ncurl пример:")
print(f'  curl -X POST -F "file=@cat.jpg" http://localhost:8000/classify')
print(f"\\nОтвет:")
print(json.dumps({
    "filename": "cat.jpg",
    "predictions": [
        {"class": "cat", "confidence": 0.8723},
        {"class": "dog", "confidence": 0.0891},
        {"class": "deer", "confidence": 0.0234}
    ],
    "top_class": "cat",
    "confidence": 0.8723
}, indent=2))

print(f"\\n--- FastAPI App Code ---")
print(fastapi_code)`,
      explanation: 'FastAPI — современный Python-фреймворк для API (быстрее Flask, автодокументация). Ключевые моменты: валидация типа файла, ограничение размера, preprocess_image для приведения к формату модели, топ-3 предсказания с вероятностями. В production добавьте: rate limiting, logging, GPU inference, batch prediction.'
    }
  ]
}