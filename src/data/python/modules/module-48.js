export default {
  id: 48,
  title: 'Анализ данных: практика',
  description: 'Полный цикл анализа данных: загрузка, очистка, исследование, визуализация, выводы',
  lessons: [
    {
      id: 1,
      title: 'Разведочный анализ данных (EDA)',
      type: 'theory',
      content: [
        { type: 'text', value: 'EDA (Exploratory Data Analysis) — первый шаг в любом проекте Data Science. Цель: понять структуру данных, найти аномалии, выявить закономерности.' },
        { type: 'code', language: 'python', value: 'import pandas as pd\nimport numpy as np\nimport matplotlib.pyplot as plt\n\n# Полный EDA чеклист\n\n# 1. Загрузка и первый взгляд\ndf = pd.read_csv(\'data.csv\')\nprint(df.shape)          # размер\nprint(df.head())         # первые строки\nprint(df.dtypes)         # типы данных\nprint(df.info())         # общая информация\n\n# 2. Статистика\nprint(df.describe())              # числовые\nprint(df.describe(include=\'object\'))  # категориальные\n\n# 3. Пропущенные значения\nmissing = df.isnull().sum().sort_values(ascending=False)\nmissing_pct = (missing / len(df)) * 100\nprint(pd.concat([missing, missing_pct], axis=1,\n                keys=[\'Кол-во\', \'Процент\']))\n\n# 4. Дубликаты\nprint(f"Дублей: {df.duplicated().sum()}")\ndf = df.drop_duplicates()\n\n# 5. Уникальные значения категорий\nfor col in df.select_dtypes(include=\'object\').columns:\n    print(f"{col}: {df[col].nunique()} уникальных -> {df[col].value_counts().head(3).to_dict()}")' },
        { type: 'tip', value: 'Создай шаблонную функцию eda(df) которая выводит всю базовую информацию о DataFrame. Это сэкономит время на каждом проекте.' }
      ]
    },
    {
      id: 2,
      title: 'Очистка данных',
      type: 'theory',
      content: [
        { type: 'text', value: 'Реальные данные всегда "грязные". Типичные проблемы: пропуски, дубликаты, выбросы, несогласованные типы, опечатки в категориях.' },
        { type: 'code', language: 'python', value: 'import pandas as pd\nimport numpy as np\n\ndf = pd.DataFrame({\n    \'возраст\': [25, 30, -5, 200, 28, np.nan, 35],  # -5 и 200 — выбросы\n    \'зарплата\': [50000, 80000, 60000, 75000, np.nan, 70000, 0],\n    \'отдел\': [\'IT\', \'it\', \'HR \', \'hr\', \'IT\', \'Finance\', \'FINANCE\']\n})\n\n# Нормализация строк\ndf[\'отдел\'] = df[\'отдел\'].str.strip().str.upper()\nprint(df[\'отдел\'].value_counts())  # IT: 3, HR: 2, FINANCE: 2\n\n# Обработка выбросов через IQR\ndef remove_outliers(series):\n    Q1 = series.quantile(0.25)\n    Q3 = series.quantile(0.75)\n    IQR = Q3 - Q1\n    lower = Q1 - 1.5 * IQR\n    upper = Q3 + 1.5 * IQR\n    return series.clip(lower, upper)  # обрезать до границ\n\ndf[\'возраст\'] = remove_outliers(df[\'возраст\'].fillna(df[\'возраст\'].median()))\ndf[\'зарплата\'] = df[\'зарплата\'].replace(0, np.nan)  # 0 = неизвестно\ndf[\'зарплата\'].fillna(df.groupby(\'отдел\')[\'зарплата\'].transform(\'median\'),\n                       inplace=True)\n\n# Валидация типов\ndf[\'возраст\'] = df[\'возраст\'].astype(int)\n\nprint(df)' }
      ]
    },
    {
      id: 3,
      title: 'Корреляционный анализ',
      type: 'theory',
      content: [
        { type: 'text', value: 'Корреляция показывает силу и направление линейной связи между переменными. Коэффициент Пирсона: от -1 (сильная обратная) до +1 (сильная прямая).' },
        { type: 'code', language: 'python', value: 'import pandas as pd\nimport numpy as np\nimport matplotlib.pyplot as plt\n\nnp.random.seed(42)\ndf = pd.DataFrame({\n    \'опыт\': np.random.uniform(1, 15, 100),\n    \'зарплата\': None,\n    \'возраст\': None,\n    \'рейтинг\': np.random.uniform(1, 5, 100)\n})\ndf[\'зарплата\'] = df[\'опыт\'] * 5000 + np.random.normal(0, 10000, 100)\ndf[\'возраст\'] = df[\'опыт\'] + 22 + np.random.normal(0, 2, 100)\n\n# Матрица корреляций\ncorr_matrix = df.corr()\nprint(corr_matrix.round(3))\n\n# Тепловая карта\nfig, axes = plt.subplots(1, 2, figsize=(14, 5))\n\nim = axes[0].imshow(corr_matrix, cmap=\'coolwarm\', vmin=-1, vmax=1)\nplt.colorbar(im, ax=axes[0])\n# Добавить значения\nfor i in range(len(corr_matrix)):\n    for j in range(len(corr_matrix.columns)):\n        axes[0].text(j, i, f\'{corr_matrix.iloc[i, j]:.2f}\',\n                    ha=\'center\', va=\'center\', fontsize=10)\naxes[0].set_xticks(range(len(corr_matrix.columns)))\naxes[0].set_yticks(range(len(corr_matrix)))\naxes[0].set_xticklabels(corr_matrix.columns, rotation=45)\naxes[0].set_yticklabels(corr_matrix.columns)\naxes[0].set_title(\'Матрица корреляций\')\n\n# Scatter matrix вручную\naxes[1].scatter(df[\'опыт\'], df[\'зарплата\'], alpha=0.5)\naxes[1].set_xlabel(\'Опыт\')\naxes[1].set_ylabel(\'Зарплата\')\ncorr_val = df[\'опыт\'].corr(df[\'зарплата\'])\naxes[1].set_title(f\'r = {corr_val:.3f}\')\naxes[1].grid(True, alpha=0.3)\n\nplt.tight_layout()\nplt.show()' }
      ]
    },
    {
      id: 4,
      title: 'Визуализация распределений',
      type: 'theory',
      content: [
        { type: 'text', value: 'Понимание распределений данных критично для выбора статистических методов. Гистограмма, boxplot и violin plot — основные инструменты.' },
        { type: 'code', language: 'python', value: 'import pandas as pd\nimport numpy as np\nimport matplotlib.pyplot as plt\n\nnp.random.seed(42)\ndf = pd.DataFrame({\n    \'зарплата\': np.concatenate([\n        np.random.normal(60000, 8000, 80),\n        np.random.normal(90000, 10000, 20)  # топ-менеджеры\n    ]),\n    \'отдел\': [\'IT\']*40 + [\'HR\']*20 + [\'Finance\']*20 + [\'Senior\']*20\n})\n\nfig, axes = plt.subplots(1, 3, figsize=(15, 5))\n\n# Гистограмма\naxes[0].hist(df[\'зарплата\'], bins=25, color=\'steelblue\', edgecolor=\'white\')\naxes[0].axvline(df[\'зарплата\'].mean(), color=\'red\', linestyle=\'--\', label=\'Среднее\')\naxes[0].axvline(df[\'зарплата\'].median(), color=\'orange\', linestyle=\'--\', label=\'Медиана\')\naxes[0].legend()\naxes[0].set_title(\'Гистограмма зарплат\')\naxes[0].set_xlabel(\'Зарплата\')\naxes[0].grid(True, alpha=0.3)\n\n# Boxplot по отделам\nдепты = df[\'отдел\'].unique()\ndata_by_dept = [df[df[\'отдел\'] == d][\'зарплата\'].values for d in депты]\naxes[1].boxplot(data_by_dept, labels=депты, patch_artist=True)\naxes[1].set_title(\'Boxplot по отделам\')\naxes[1].set_ylabel(\'Зарплата\')\naxes[1].grid(True, alpha=0.3, axis=\'y\')\n\n# Violin plot (нужен matplotlib >= 3.x)\nparts = axes[2].violinplot(data_by_dept, positions=range(1, len(депты)+1),\n                           showmeans=True)\naxes[2].set_xticks(range(1, len(депты)+1))\naxes[2].set_xticklabels(депты)\naxes[2].set_title(\'Violin plot\')\naxes[2].set_ylabel(\'Зарплата\')\n\nplt.tight_layout()\nplt.show()' }
      ]
    },
    {
      id: 5,
      title: 'Работа с категориальными данными',
      type: 'theory',
      content: [
        { type: 'text', value: 'Категориальные данные требуют особых методов анализа: частоты, перекрёстные таблицы, кодирование для ML.' },
        { type: 'code', language: 'python', value: 'import pandas as pd\nimport numpy as np\n\ndf = pd.DataFrame({\n    \'пол\': [\'М\', \'Ж\', \'М\', \'Ж\', \'М\', \'Ж\', \'М\', \'Ж\'],\n    \'отдел\': [\'IT\', \'HR\', \'IT\', \'Finance\', \'HR\', \'IT\', \'Finance\', \'IT\'],\n    \'уровень\': [\'senior\', \'junior\', \'middle\', \'senior\', \'junior\', \'middle\', \'senior\', \'junior\'],\n    \'зарплата\': [90000, 50000, 70000, 95000, 52000, 72000, 98000, 48000]\n})\n\n# Частотный анализ\nprint(df[\'отдел\'].value_counts(normalize=True))  # в процентах\n\n# Перекрёстная таблица (crosstab)\nct = pd.crosstab(df[\'пол\'], df[\'уровень\'],\n                 margins=True, margins_name=\'Итого\')\nprint(ct)\n\n# Средняя зарплата по группам\nprint(df.groupby([\'пол\', \'уровень\'])[\'зарплата\'].mean().unstack())\n\n# Кодирование для ML\n# Label encoding (порядковые категории)\nfrom sklearn.preprocessing import LabelEncoder\nle = LabelEncoder()\ndf[\'уровень_num\'] = le.fit_transform(df[\'уровень\'])\n\n# One-hot encoding (номинальные категории)\ndf_encoded = pd.get_dummies(df, columns=[\'отдел\', \'пол\'],\n                             drop_first=True)  # drop_first — избегаем мультиколлинеарности\nprint(df_encoded.columns.tolist())\n\n# Ordinal encoding вручную\norder = {\'junior\': 1, \'middle\': 2, \'senior\': 3}\ndf[\'уровень_ord\'] = df[\'уровень\'].map(order)' }
      ]
    },
    {
      id: 6,
      title: 'Генерация отчёта',
      type: 'theory',
      content: [
        { type: 'text', value: 'Финальный этап EDA — создание отчёта с выводами. Структурированный подход: ключевые метрики, выбросы, корреляции, рекомендации.' },
        { type: 'code', language: 'python', value: 'import pandas as pd\nimport numpy as np\n\ndef generate_report(df, target_col=None):\n    """Генерирует краткий EDA-отчёт для DataFrame."""\n    report = {}\n\n    # Основная информация\n    report[\'shape\'] = df.shape\n    report[\'dtypes\'] = df.dtypes.to_dict()\n    report[\'missing\'] = df.isnull().sum()[df.isnull().sum() > 0].to_dict()\n    report[\'duplicates\'] = df.duplicated().sum()\n\n    # Числовые столбцы\n    num_cols = df.select_dtypes(include=np.number).columns\n    report[\'numeric_stats\'] = df[num_cols].describe().to_dict()\n\n    # Выбросы (IQR метод)\n    outliers = {}\n    for col in num_cols:\n        Q1, Q3 = df[col].quantile([0.25, 0.75])\n        IQR = Q3 - Q1\n        n_outliers = ((df[col] < Q1 - 1.5*IQR) | (df[col] > Q3 + 1.5*IQR)).sum()\n        if n_outliers > 0:\n            outliers[col] = int(n_outliers)\n    report[\'outliers\'] = outliers\n\n    # Корреляция с целевым столбцом\n    if target_col and target_col in num_cols:\n        corr = df[num_cols].corr()[target_col].drop(target_col).sort_values(key=abs, ascending=False)\n        report[\'correlations_with_target\'] = corr.to_dict()\n\n    return report\n\n# Использование\nnp.random.seed(42)\ndf_test = pd.DataFrame({\n    \'зарплата\': np.random.normal(70000, 15000, 100),\n    \'опыт\': np.random.uniform(1, 15, 100),\n    \'возраст\': np.random.randint(22, 55, 100)\n})\ndf_test.loc[5, \'зарплата\'] = np.nan\n\nreport = generate_report(df_test, target_col=\'зарплата\')\nfor key, value in report.items():\n    print(f"{key}: {value}")' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Полный EDA проект',
      type: 'practice',
      difficulty: 'hard',
      description: 'Проведи полный разведочный анализ датасета о домах: очистка, статистика, визуализация.',
      requirements: [
        'Создай датасет 100 домов: площадь (50-300 кв.м), комнаты (1-6), год (1980-2024), район(А/Б/В), цена',
        'Сделай цену зависимой: цена = площадь*50000 + комнаты*200000 + (2024-год)*(-10000) + шум',
        'Добавь 5% пропусков и 3 выброса в цене (умножь на 10)',
        'Выполни полную очистку: заполни NaN, обработай выбросы через IQR clip',
        'Построй: гистограмму цен, scatter площадь-цена по районам, boxplot цен по районам, correlation heatmap',
        'Выведи топ-3 корреляции с ценой'
      ],
      expectedOutput: 'Пропущенных до очистки: N\nВыбросов в цене: M\nПосле очистки — 4 графика\nТоп корреляции с ценой:\n1. площадь: 0.XX\n2. ...',
      hint: 'Для scatter по районам — цикл по уникальным значениям района с разными цветами. IQR clip: df["цена"].clip(Q1 - 1.5*IQR, Q3 + 1.5*IQR).',
      solution: 'import pandas as pd\nimport numpy as np\nimport matplotlib.pyplot as plt\n\nnp.random.seed(42)\nn = 100\ndf = pd.DataFrame({\n    \'площадь\': np.random.uniform(50, 300, n),\n    \'комнаты\': np.random.randint(1, 7, n),\n    \'год\': np.random.randint(1980, 2025, n),\n    \'район\': np.random.choice([\'А\', \'Б\', \'В\'], n)\n})\ndf[\'цена\'] = (df[\'площадь\'] * 50000 +\n              df[\'комнаты\'] * 200000 +\n              (2024 - df[\'год\']) * (-10000) +\n              np.random.normal(0, 500000, n))\n\n# Выбросы\ndf.loc[[10, 40, 70], \'цена\'] *= 10\n\n# Пропуски\nidx = np.random.choice(df.index, int(n * 0.05), replace=False)\ndf.loc[idx[:3], \'площадь\'] = np.nan\ndf.loc[idx[3:], \'цена\'] = np.nan\n\nprint(f"Пропущенных до очистки: {df.isnull().sum().sum()}")\n\nQ1, Q3 = df[\'цена\'].quantile([0.25, 0.75])\nIQR = Q3 - Q1\noutliers_count = ((df[\'цена\'] < Q1 - 1.5*IQR) | (df[\'цена\'] > Q3 + 1.5*IQR)).sum()\nprint(f"Выбросов в цене: {outliers_count}")\n\ndf[\'площадь\'].fillna(df[\'площадь\'].median(), inplace=True)\ndf[\'цена\'].fillna(df[\'цена\'].median(), inplace=True)\ndf[\'цена\'] = df[\'цена\'].clip(Q1 - 1.5*IQR, Q3 + 1.5*IQR)\n\nfig, axes = plt.subplots(2, 2, figsize=(14, 10))\n\naxes[0, 0].hist(df[\'цена\'] / 1e6, bins=20, color=\'steelblue\', edgecolor=\'white\')\naxes[0, 0].set_title(\'Распределение цен\')\naxes[0, 0].set_xlabel(\'Цена (млн руб)\')\naxes[0, 0].grid(True, alpha=0.3)\n\nцвета = {\'А\': \'blue\', \'Б\': \'orange\', \'В\': \'green\'}\nfor район, цвет in цвета.items():\n    маска = df[\'район\'] == район\n    axes[0, 1].scatter(df[маска][\'площадь\'], df[маска][\'цена\'] / 1e6,\n                       label=f\'Район {район}\', color=цвет, alpha=0.6)\naxes[0, 1].set_title(\'Площадь vs Цена\')\naxes[0, 1].set_xlabel(\'Площадь (кв.м)\')\naxes[0, 1].set_ylabel(\'Цена (млн руб)\')\naxes[0, 1].legend()\naxes[0, 1].grid(True, alpha=0.3)\n\ndata_by_district = [df[df[\'район\'] == r][\'цена\'].values / 1e6\n                    for r in [\'А\', \'Б\', \'В\']]\naxes[1, 0].boxplot(data_by_district, labels=[\'А\', \'Б\', \'В\'], patch_artist=True)\naxes[1, 0].set_title(\'Цены по районам\')\naxes[1, 0].set_ylabel(\'Цена (млн руб)\')\naxes[1, 0].grid(True, alpha=0.3, axis=\'y\')\n\nnum_df = df[[\'площадь\', \'комнаты\', \'год\', \'цена\']]\ncorr = num_df.corr()\nim = axes[1, 1].imshow(corr, cmap=\'coolwarm\', vmin=-1, vmax=1)\nfor i in range(len(corr)):\n    for j in range(len(corr.columns)):\n        axes[1, 1].text(j, i, f\'{corr.iloc[i,j]:.2f}\',\n                        ha=\'center\', va=\'center\', fontsize=9)\naxes[1, 1].set_xticks(range(len(corr)))\naxes[1, 1].set_yticks(range(len(corr)))\naxes[1, 1].set_xticklabels(corr.columns, rotation=45)\naxes[1, 1].set_yticklabels(corr.columns)\naxes[1, 1].set_title(\'Корреляции\')\n\nfig.suptitle(\'EDA: Рынок недвижимости\', fontsize=14, fontweight=\'bold\')\nplt.tight_layout()\nplt.savefig(\'eda_report.png\', dpi=150, bbox_inches=\'tight\')\nplt.show()\n\ntop_corr = corr[\'цена\'].drop(\'цена\').sort_values(key=abs, ascending=False)\nprint("\\nТоп корреляции с ценой:")\nfor i, (col, val) in enumerate(top_corr.items(), 1):\n    print(f"{i}. {col}: {val:.3f}")',
      explanation: 'Clip использует рассчитанные IQR границы и ограничивает значения — это мягче чем удаление строк. Заполнение NaN до clip важно: NaN в сравнениях даёт NaN. Scatter по районам в цикле — стандартный паттерн для цветовых групп.'
    }
  ]
}
