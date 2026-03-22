export default {
  id: 47,
  title: 'Matplotlib',
  description: 'plot, bar, scatter, subplots и настройка визуализаций — создание графиков для анализа данных',
  lessons: [
    {
      id: 1,
      title: 'Введение в Matplotlib: Figure и Axes',
      type: 'theory',
      content: [
        { type: 'text', value: 'Matplotlib — главная библиотека визуализации Python. Два API: pyplot (быстрый, похожий на MATLAB) и объектно-ориентированный (более гибкий). В Data Science предпочтителен OO-стиль.' },
        { type: 'code', language: 'python', value: 'import matplotlib.pyplot as plt\nimport numpy as np\n\n# pyplot стиль (быстрый)\nplt.plot([1, 2, 3], [4, 5, 6])\nplt.title(\'Простой график\')\nplt.show()\n\n# OO стиль (рекомендуется)\nfig, ax = plt.subplots(figsize=(8, 5))\nax.plot([1, 2, 3], [4, 5, 6])\nax.set_title(\'OO стиль\')\nax.set_xlabel(\'X ось\')\nax.set_ylabel(\'Y ось\')\nplt.tight_layout()\nplt.show()\n\n# Анатомия графика:\n# Figure — весь рисунок (белый прямоугольник)\n# Axes — область с осями (сам график)\n# Axis — оси X и Y\n# Artist — всё видимое: линии, текст, заголовки\n\nfig, axes = plt.subplots(1, 2, figsize=(12, 4))\nprint(type(fig))    # <class \'matplotlib.figure.Figure\'>\nprint(type(axes))   # <class \'numpy.ndarray\'>\nprint(axes.shape)   # (2,)\n\n# Сохранение\nfig.savefig(\'graph.png\', dpi=150, bbox_inches=\'tight\')' },
        { type: 'tip', value: 'plt.subplots() возвращает (fig, ax) для одного графика или (fig, axes_array) для нескольких. Всегда используй tight_layout() для корректных отступов.' }
      ]
    },
    {
      id: 2,
      title: 'Линейные графики: plot()',
      type: 'theory',
      content: [
        { type: 'text', value: 'plot() строит линейные графики. Поддерживает настройку цвета, стиля линии, маркеров и многих других параметров.' },
        { type: 'code', language: 'python', value: 'import matplotlib.pyplot as plt\nimport numpy as np\n\nx = np.linspace(0, 2 * np.pi, 100)\n\nfig, ax = plt.subplots(figsize=(10, 6))\n\n# Несколько линий\nax.plot(x, np.sin(x), label=\'sin(x)\', color=\'blue\', linewidth=2)\nax.plot(x, np.cos(x), label=\'cos(x)\', color=\'red\', linestyle=\'--\', linewidth=2)\nax.plot(x, np.tan(x), label=\'tan(x)\', color=\'green\', linestyle=\':\',\n        alpha=0.7, linewidth=1.5)\n\n# Настройка\nax.set_title(\'Тригонометрические функции\', fontsize=14, fontweight=\'bold\')\nax.set_xlabel(\'x (радианы)\', fontsize=12)\nax.set_ylabel(\'y\', fontsize=12)\nax.legend(loc=\'upper right\', fontsize=11)\nax.grid(True, alpha=0.3)\nax.set_ylim(-2, 2)  # ограничить ось Y\nax.axhline(y=0, color=\'black\', linewidth=0.5)  # горизонтальная линия y=0\n\nplt.tight_layout()\nplt.show()\n\n# Стили линий: \'-\', \'--\', \':\', \'-.\'\n# Маркеры: \'o\', \'s\', \'^\', \'D\', \'*\', \'.\'\nax.plot(x[::10], np.sin(x[::10]), \'go--\', markersize=8, label=\'с маркерами\')\n# g=green, o=круглые маркеры, --=пунктир' },
        { type: 'heading', value: 'Аннотации и заливка областей' },
        { type: 'code', language: 'python', value: 'import matplotlib.pyplot as plt\nimport numpy as np\n\nx = np.linspace(0, 4 * np.pi, 200)\ny = np.sin(x) * np.exp(-x / 10)\n\nfig, ax = plt.subplots(figsize=(10, 5))\nax.plot(x, y, color=\'navy\', linewidth=2)\n\n# Заливка под кривой\nax.fill_between(x, y, 0,\n    where=(y > 0), color=\'lightblue\', alpha=0.5, label=\'Положительная область\')\nax.fill_between(x, y, 0,\n    where=(y < 0), color=\'lightsalmon\', alpha=0.5, label=\'Отрицательная область\')\n\n# Аннотация точки\nmax_idx = np.argmax(y)\nax.annotate(\n    f\'Максимум: {y[max_idx]:.2f}\',\n    xy=(x[max_idx], y[max_idx]),\n    xytext=(x[max_idx] + 1, y[max_idx] + 0.2),\n    arrowprops=dict(arrowstyle=\'->\', color=\'red\'),\n    fontsize=10, color=\'red\'\n)\n\n# Вертикальная линия\nax.axvline(x=np.pi, color=\'gray\', linestyle=\'--\', alpha=0.7)\nax.text(np.pi + 0.1, 0.8, \'x = π\', fontsize=10, color=\'gray\')\n\nax.legend(loc=\'upper right\')\nax.grid(True, alpha=0.2)\nplt.tight_layout()\nplt.show()' },
        { type: 'tip', value: 'fill_between с where= позволяет закрашивать только части области под кривой. Используй annotate для пометки ключевых точек: максимумов, пересечений или аномалий.' }
      ]
    },
    {
      id: 3,
      title: 'Столбчатые диаграммы: bar()',
      type: 'theory',
      content: [
        { type: 'text', value: 'bar() строит вертикальные столбцы, barh() — горизонтальные. Используются для сравнения категорий.' },
        { type: 'code', language: 'python', value: 'import matplotlib.pyplot as plt\nimport numpy as np\n\nкатегории = [\'IT\', \'HR\', \'Finance\', \'Marketing\', \'Sales\']\nзначения = [85000, 55000, 75000, 60000, 70000]\ncвет = [\'#2196F3\', \'#4CAF50\', \'#FF9800\', \'#9C27B0\', \'#F44336\']\n\nfig, axes = plt.subplots(1, 2, figsize=(14, 5))\n\n# Вертикальная\nbars = axes[0].bar(категории, значения, color=cвет, edgecolor=\'black\', linewidth=0.5)\naxes[0].set_title(\'Средняя зарплата по отделам\')\naxes[0].set_ylabel(\'Рубли\')\naxes[0].set_ylim(0, 100000)\n\n# Добавить значения над столбцами\nfor bar in bars:\n    height = bar.get_height()\n    axes[0].text(bar.get_x() + bar.get_width()/2., height + 500,\n                f\'{height:,}\', ha=\'center\', va=\'bottom\', fontsize=9)\n\n# Горизонтальная (удобна для длинных подписей)\naxes[1].barh(категории, значения, color=cвет, edgecolor=\'black\')\naxes[1].set_title(\'Горизонтальная диаграмма\')\naxes[1].set_xlabel(\'Рубли\')\naxes[1].axvline(x=np.mean(значения), color=\'red\', linestyle=\'--\', label=\'Среднее\')\naxes[1].legend()\n\nplt.tight_layout()\nplt.show()\n\n# Сгруппированные столбцы\nx = np.arange(len(категории))\nwidth = 0.35\nfig, ax = plt.subplots()\nax.bar(x - width/2, значения, width, label=\'2023\')\nax.bar(x + width/2, [v * 1.1 for v in значения], width, label=\'2024\')\nax.set_xticks(x)\nax.set_xticklabels(категории)\nax.legend()' },
        { type: 'heading', value: 'Накопленные (stacked) столбцы' },
        { type: 'code', language: 'python', value: 'import matplotlib.pyplot as plt\nimport numpy as np\n\nкварталы = [\'Q1\', \'Q2\', \'Q3\', \'Q4\']\nпродукт_A = [20, 35, 30, 25]\nпродукт_B = [15, 20, 25, 30]\nпродукт_C = [10, 15, 20, 18]\n\nfig, ax = plt.subplots(figsize=(9, 5))\n\n# Накопленный bar: каждый следующий слой идёт поверх предыдущего\nax.bar(кварталы, продукт_A, label=\'Продукт A\', color=\'#2196F3\')\nax.bar(кварталы, продукт_B, bottom=продукт_A, label=\'Продукт B\', color=\'#FF9800\')\nbottom_c = [a + b for a, b in zip(продукт_A, продукт_B)]\nax.bar(кварталы, продукт_C, bottom=bottom_c, label=\'Продукт C\', color=\'#4CAF50\')\n\nax.set_title(\'Продажи по кварталам (накопленный)\', fontsize=13)\nax.set_ylabel(\'Объём продаж\')\nax.legend(loc=\'upper left\')\nax.grid(True, axis=\'y\', alpha=0.3)\n\n# Добавить общую сумму над каждым стеком\nтоталы = [a + b + c for a, b, c in zip(продукт_A, продукт_B, продукт_C)]\nfor i, total in enumerate(тоталы):\n    ax.text(i, total + 0.5, str(total), ha=\'center\', fontsize=10, fontweight=\'bold\')\n\nplt.tight_layout()\nplt.show()' },
        { type: 'tip', value: 'Параметр bottom= задаёт основание столбца — это основа stacked bar chart. Для горизонтального barh используй аналогичный параметр left=. Всегда добавляй подписи значений через ax.text() — это делает диаграмму информативнее.' }
      ]
    },
    {
      id: 4,
      title: 'Точечные диаграммы: scatter()',
      type: 'theory',
      content: [
        { type: 'text', value: 'scatter() визуализирует связь между двумя числовыми переменными. Поддерживает цвет и размер точек для отображения третьей и четвёртой переменных.' },
        { type: 'code', language: 'python', value: 'import matplotlib.pyplot as plt\nimport numpy as np\n\nnp.random.seed(42)\nn = 100\n\n# Генерация данных с корреляцией\nопыт = np.random.uniform(1, 15, n)\nзарплата = опыт * 5000 + np.random.normal(0, 10000, n)\nуровень = np.where(опыт < 3, 0, np.where(опыт < 8, 1, 2))  # 0=junior, 1=middle, 2=senior\nразмер_компании = np.random.randint(10, 1000, n)\n\nцвета = [\'#2196F3\', \'#FF9800\', \'#F44336\']\nметки = [\'Junior\', \'Middle\', \'Senior\']\n\nfig, ax = plt.subplots(figsize=(10, 7))\n\nfor i, (метка, цвет) in enumerate(zip(метки, цвета)):\n    маска = уровень == i\n    ax.scatter(опыт[маска], зарплата[маска],\n               c=цвет, label=метка, alpha=0.7,\n               s=размер_компании[маска] / 5,  # размер = размер компании\n               edgecolors=\'white\', linewidths=0.5)\n\nax.set_xlabel(\'Опыт (лет)\', fontsize=12)\nax.set_ylabel(\'Зарплата (руб)\', fontsize=12)\nax.set_title(\'Зарплата vs Опыт\', fontsize=14)\nax.legend(title=\'Уровень\', fontsize=11)\nax.grid(True, alpha=0.3)\n\n# Линия тренда\nz = np.polyfit(опыт, зарплата, 1)\np = np.poly1d(z)\nx_line = np.linspace(опыт.min(), опыт.max(), 100)\nax.plot(x_line, p(x_line), "k--", alpha=0.5, label=\'Тренд\')\nax.legend()\nplt.tight_layout()\nplt.show()' },
        { type: 'heading', value: 'Colormap и colorbar для третьей переменной' },
        { type: 'code', language: 'python', value: 'import matplotlib.pyplot as plt\nimport numpy as np\n\nnp.random.seed(0)\nn = 150\nx = np.random.randn(n)\ny = x * 0.8 + np.random.randn(n) * 0.5\nz = np.sqrt(x**2 + y**2)  # расстояние от начала координат (третья переменная)\n\nfig, ax = plt.subplots(figsize=(9, 6))\n\n# c= принимает массив значений, cmap= задаёт цветовую карту\nsc = ax.scatter(x, y, c=z, cmap=\'plasma\', s=60, alpha=0.8, edgecolors=\'none\')\n\n# colorbar — шкала соответствия цвет → значение\ncbar = fig.colorbar(sc, ax=ax)\ncbar.set_label(\'Расстояние от центра\', fontsize=11)\n\nax.set_title(\'Scatter с colormap\', fontsize=13)\nax.set_xlabel(\'X\')\nax.set_ylabel(\'Y\')\nax.axhline(0, color=\'gray\', linewidth=0.5)\nax.axvline(0, color=\'gray\', linewidth=0.5)\nax.grid(True, alpha=0.2)\n\n# Добавить текст для выбросов\nвыброс_idx = np.argmax(z)\nax.annotate(f\'max z={z[выброс_idx]:.2f}\',\n    xy=(x[выброс_idx], y[выброс_idx]),\n    xytext=(x[выброс_idx] - 1, y[выброс_idx] + 0.5),\n    arrowprops=dict(arrowstyle=\'->\', color=\'black\'), fontsize=9)\n\nplt.tight_layout()\nplt.show()' },
        { type: 'note', value: 'Параметр c= в scatter() принимает массив чисел и окрашивает точки по шкале. Популярные colormap: viridis, plasma, coolwarm, RdYlGn. Используй edgecolors="none" для чистого вида при большом числе точек.' }
      ]
    },
    {
      id: 5,
      title: 'Гистограммы, pie и другие типы',
      type: 'theory',
      content: [
        { type: 'text', value: 'hist() для распределений, pie() для долей, boxplot() для квартилей. Каждый тип для своей задачи.' },
        { type: 'code', language: 'python', value: 'import matplotlib.pyplot as plt\nimport numpy as np\n\nnp.random.seed(42)\ndata = np.random.normal(170, 10, 500)  # рост людей\n\nfig, axes = plt.subplots(2, 2, figsize=(12, 10))\n\n# Гистограмма\naxes[0, 0].hist(data, bins=30, color=\'steelblue\', edgecolor=\'white\', density=True)\naxes[0, 0].set_title(\'Распределение роста\')\naxes[0, 0].set_xlabel(\'Рост (см)\')\naxes[0, 0].axvline(data.mean(), color=\'red\', linestyle=\'--\', label=f\'Среднее: {data.mean():.1f}\')\naxes[0, 0].legend()\n\n# Круговая диаграмма\nотделы = [\'IT\', \'HR\', \'Finance\', \'Sales\']\nразмеры = [35, 20, 25, 20]\naxes[0, 1].pie(размеры, labels=отделы, autopct=\'%1.1f%%\',\n               colors=[\'#2196F3\', \'#4CAF50\', \'#FF9800\', \'#9C27B0\'],\n               shadow=True, startangle=90)\naxes[0, 1].set_title(\'Распределение по отделам\')\n\n# Boxplot (ящик с усами)\ngroups = [np.random.normal(i*10, 5, 100) for i in range(4)]\naxes[1, 0].boxplot(groups, labels=[\'A\', \'B\', \'C\', \'D\'])\naxes[1, 0].set_title(\'Boxplot: сравнение групп\')\naxes[1, 0].grid(True, alpha=0.3)\n\n# Тепловая карта (imshow)\nmatrix = np.random.rand(5, 5)\nim = axes[1, 1].imshow(matrix, cmap=\'viridis\')\nfig.colorbar(im, ax=axes[1, 1])\naxes[1, 1].set_title(\'Тепловая карта\')\n\nplt.tight_layout()\nplt.show()' },
        { type: 'heading', value: 'Violin plot и step-гистограмма' },
        { type: 'code', language: 'python', value: 'import matplotlib.pyplot as plt\nimport numpy as np\n\nnp.random.seed(42)\n# Три распределения с разными характеристиками\nгруппа_A = np.random.normal(60, 10, 200)\nгруппа_B = np.concatenate([np.random.normal(50, 5, 100),\n                            np.random.normal(75, 5, 100)])  # бимодальное\nгруппа_C = np.random.exponential(15, 200) + 40  # скошенное\n\nfig, axes = plt.subplots(1, 2, figsize=(13, 5))\n\n# Violin plot — показывает форму распределения\nparts = axes[0].violinplot([группа_A, группа_B, группа_C],\n                           positions=[1, 2, 3], showmedians=True)\n# Раскрасить violins\nfor pc in parts[\'bodies\']:\n    pc.set_facecolor(\'#90CAF9\')\n    pc.set_alpha(0.7)\naxes[0].set_xticks([1, 2, 3])\naxes[0].set_xticklabels([\'A (норм)\', \'B (бимод)\', \'C (скос)\'])\naxes[0].set_title(\'Violin plot\')\naxes[0].grid(True, alpha=0.3, axis=\'y\')\n\n# Step-гистограмма для сравнения нескольких распределений\naxes[1].hist(группа_A, bins=25, histtype=\'step\', label=\'A\', linewidth=2, color=\'blue\')\naxes[1].hist(группа_B, bins=25, histtype=\'step\', label=\'B\', linewidth=2, color=\'orange\')\naxes[1].hist(группа_C, bins=25, histtype=\'step\', label=\'C\', linewidth=2, color=\'green\')\naxes[1].set_title(\'Сравнение распределений (step)\')\naxes[1].legend()\naxes[1].grid(True, alpha=0.3)\n\nplt.tight_layout()\nplt.show()' },
        { type: 'tip', value: 'Violin plot сочетает boxplot и оценку плотности: он показывает форму распределения, медиану и квартили одновременно. Для сравнения нескольких распределений на одной гистограмме используй histtype="step" — контурные линии не перекрывают друг друга.' }
      ]
    },
    {
      id: 6,
      title: 'subplots и настройка стиля',
      type: 'theory',
      content: [
        { type: 'text', value: 'subplots создаёт сетку графиков. Стили, цветовые схемы и шрифты можно настраивать глобально через rcParams или plt.style.use().' },
        { type: 'code', language: 'python', value: 'import matplotlib.pyplot as plt\nimport numpy as np\n\n# Доступные стили\nprint(plt.style.available[:5])  # [\'bmh\', \'classic\', \'dark_background\', ...]\nplt.style.use(\'seaborn-v0_8-whitegrid\')  # или \'ggplot\', \'dark_background\'\n\n# Разные размеры ячеек через gridspec\nfig = plt.figure(figsize=(12, 8))\ngs = fig.add_gridspec(2, 3, hspace=0.4, wspace=0.3)\n\nax1 = fig.add_subplot(gs[0, :2])  # первая строка, первые 2 колонки\nax2 = fig.add_subplot(gs[0, 2])   # первая строка, 3-я колонка\nax3 = fig.add_subplot(gs[1, 0])   # вторая строка, 1-я колонка\nax4 = fig.add_subplot(gs[1, 1:])  # вторая строка, 2-3 колонки\n\nx = np.linspace(0, 10, 100)\nax1.plot(x, np.sin(x), label=\'sin\')\nax1.set_title(\'Широкий график\')\nax2.bar([\'A\', \'B\', \'C\'], [3, 5, 2])\nax2.set_title(\'Bar\')\nax3.scatter(x[::5], np.cos(x[::5]))\nax3.set_title(\'Scatter\')\nax4.fill_between(x, np.sin(x), alpha=0.3)\nax4.plot(x, np.sin(x))\nax4.set_title(\'Fill Between\')\n\n# Настройка шрифтов глобально\nplt.rcParams[\'font.family\'] = \'DejaVu Sans\'\nplt.rcParams[\'font.size\'] = 12\n\nfig.suptitle(\'Комбинированный дашборд\', fontsize=16, fontweight=\'bold\')\nplt.show()' },
        { type: 'tip', value: 'Используй plt.style.use("seaborn-v0_8") для красивых графиков по умолчанию. Для публикаций подходит "bmh" или "ggplot". После matplotlib 3.6 префикс "seaborn-v0_8-" обязателен.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Дашборд визуализации',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай дашборд из 4 графиков для анализа продаж по месяцам и категориям.',
      requirements: [
        'Сгенерируй данные: 12 месяцев, 3 категории товаров, случайные продажи (seed=42)',
        'График 1 (левый верхний): линейный — динамика продаж каждой категории по месяцам',
        'График 2 (правый верхний): столбчатый — суммарные продажи по категориям',
        'График 3 (левый нижний): гистограмма — распределение всех значений продаж',
        'График 4 (правый нижний): scatter — продажи категории 1 vs категории 2',
        'Все графики с заголовками, подписями осей, сеткой',
        'Итоговый рисунок 14x10, tight_layout, сохранить как dashboard.png'
      ],
      expectedOutput: 'Файл dashboard.png с 4 графиками:\n- Линейный с 3 линиями и легендой\n- Bar chart с 3 столбцами\n- Histogram\n- Scatter plot',
      hint: 'fig, axes = plt.subplots(2, 2, figsize=(14, 10)). Для scatter: axes[1,1].scatter(cat1_data, cat2_data).',
      solution: 'import matplotlib.pyplot as plt\nimport numpy as np\n\nnp.random.seed(42)\nмесяцы = range(1, 13)\nкатегории = [\'Электроника\', \'Одежда\', \'Продукты\']\nданные = {кат: np.random.randint(50, 200, 12) for кат in категории}\nцвета = [\'#2196F3\', \'#FF9800\', \'#4CAF50\']\n\nfig, axes = plt.subplots(2, 2, figsize=(14, 10))\n\n# График 1: Линейный\nfor кат, цвет in zip(категории, цвета):\n    axes[0, 0].plot(месяцы, данные[кат], label=кат, color=цвет, marker=\'o\', linewidth=2)\naxes[0, 0].set_title(\'Динамика продаж по месяцам\')\naxes[0, 0].set_xlabel(\'Месяц\')\naxes[0, 0].set_ylabel(\'Продажи (тыс. руб.)\')\naxes[0, 0].legend()\naxes[0, 0].grid(True, alpha=0.3)\n\n# График 2: Bar\nтотальные = [данные[кат].sum() for кат in категории]\nbars = axes[0, 1].bar(категории, тотальные, color=цвета, edgecolor=\'white\')\naxes[0, 1].set_title(\'Суммарные продажи по категориям\')\naxes[0, 1].set_ylabel(\'Сумма продаж\')\nfor bar in bars:\n    axes[0, 1].text(bar.get_x() + bar.get_width()/2, bar.get_height() + 10,\n                    str(bar.get_height()), ha=\'center\', fontsize=10)\naxes[0, 1].grid(True, alpha=0.3, axis=\'y\')\n\n# График 3: Histogram\nall_values = np.concatenate(list(данные.values()))\naxes[1, 0].hist(all_values, bins=20, color=\'steelblue\', edgecolor=\'white\')\naxes[1, 0].set_title(\'Распределение продаж\')\naxes[1, 0].set_xlabel(\'Продажи\')\naxes[1, 0].set_ylabel(\'Частота\')\naxes[1, 0].axvline(all_values.mean(), color=\'red\', linestyle=\'--\', label=\'Среднее\')\naxes[1, 0].legend()\naxes[1, 0].grid(True, alpha=0.3)\n\n# График 4: Scatter\naxes[1, 1].scatter(данные[категории[0]], данные[категории[1]],\n                   color=\'purple\', alpha=0.7, s=80, edgecolors=\'white\')\naxes[1, 1].set_title(f\'Корреляция: {категории[0]} vs {категории[1]}\')\naxes[1, 1].set_xlabel(категории[0])\naxes[1, 1].set_ylabel(категории[1])\naxes[1, 1].grid(True, alpha=0.3)\n\nfig.suptitle(\'Дашборд продаж 2024\', fontsize=16, fontweight=\'bold\')\nplt.tight_layout()\nplt.savefig(\'dashboard.png\', dpi=150, bbox_inches=\'tight\')\nplt.show()',
      explanation: 'axes[i, j] — обращение к конкретному Axes в сетке. tight_layout() автоматически подбирает отступы. savefig перед show() — иначе может сохранить пустой файл. bbox_inches="tight" обрезает лишние поля.'
    }
  ]
}
