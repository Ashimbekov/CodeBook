export default {
  id: 49,
  title: 'Web Scraping (BeautifulSoup)',
  description: 'requests + BeautifulSoup: парсинг HTML, find/select, извлечение данных с веб-страниц',
  lessons: [
    {
      id: 1,
      title: 'requests: получение HTML страниц',
      type: 'theory',
      content: [
        { type: 'text', value: 'Web scraping начинается с получения HTML. Библиотека requests делает HTTP-запросы. Всегда проверяй статус код и уважай robots.txt.' },
        { type: 'code', language: 'python', value: 'import requests\n\n# Базовый GET запрос\nurl = \'https://example.com\'\nresponse = requests.get(url)\n\nprint(response.status_code)  # 200 — успех\nprint(response.headers[\'Content-Type\'])\nprint(len(response.text))    # размер HTML\n\n# Обработка ошибок\nresponse.raise_for_status()  # выбросит исключение при 4xx/5xx\n\n# Заголовки (имитируем браузер)\nheaders = {\n    \'User-Agent\': \'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36\',\n    \'Accept-Language\': \'ru-RU,ru;q=0.9\'\n}\nresponse = requests.get(url, headers=headers)\n\n# Параметры запроса\nparams = {\'page\': 2, \'category\': \'electronics\', \'limit\': 20}\nresponse = requests.get(\'https://api.example.com/items\', params=params)\nprint(response.url)  # https://api.example.com/items?page=2&category=electronics...\n\n# Session (переиспользование соединения)\nwith requests.Session() as session:\n    session.headers.update(headers)\n    r1 = session.get(\'https://example.com/page1\')\n    r2 = session.get(\'https://example.com/page2\')  # быстрее, куки сохраняются\n\n# Тайм-аут\ntry:\n    response = requests.get(url, timeout=5)  # 5 секунд\nexcept requests.Timeout:\n    print("Превышено время ожидания")\nexcept requests.ConnectionError:\n    print("Ошибка соединения")' },
        { type: 'warning', value: 'Перед парсингом сайта проверь robots.txt (https://site.com/robots.txt) и Terms of Service. Добавляй задержку между запросами через time.sleep(1-3). Не перегружай сервера.' }
      ]
    },
    {
      id: 2,
      title: 'BeautifulSoup: парсинг HTML',
      type: 'theory',
      content: [
        { type: 'text', value: 'BeautifulSoup парсит HTML/XML в дерево объектов. Поддерживает навигацию по дереву, поиск элементов и извлечение данных.' },
        { type: 'code', language: 'python', value: 'from bs4 import BeautifulSoup\n\nhtml = """\n<html>\n<head><title>Магазин</title></head>\n<body>\n  <h1 id="main-title" class="title">Каталог товаров</h1>\n  <div class="products">\n    <div class="product" data-id="1">\n      <h2 class="name">Ноутбук</h2>\n      <span class="price">75000</span>\n      <a href="/product/1" class="link">Подробнее</a>\n    </div>\n    <div class="product" data-id="2">\n      <h2 class="name">Телефон</h2>\n      <span class="price">45000</span>\n      <a href="/product/2" class="link">Подробнее</a>\n    </div>\n  </div>\n</body>\n</html>\n"""\n\nsoup = BeautifulSoup(html, \'html.parser\')\n\n# Базовая навигация\nprint(soup.title.string)   # Магазин\nprint(soup.h1.text)         # Каталог товаров\nprint(soup.h1[\'class\'])     # [\'title\']\nprint(soup.h1[\'id\'])        # main-title\n\n# Первый элемент\nfirst_name = soup.find(\'h2\', class_=\'name\')\nprint(first_name.text)  # Ноутбук\n\n# Атрибут data\nproduct = soup.find(\'div\', {\'data-id\': \'1\'})\nprint(product[\'data-id\'])  # 1\n\n# Все ссылки\nfor a in soup.find_all(\'a\'):\n    print(a[\'href\'], a.text)' }
      ]
    },
    {
      id: 3,
      title: 'find() и find_all()',
      type: 'theory',
      content: [
        { type: 'text', value: 'find() находит первый элемент, find_all() — все. Фильтрация по тегу, классу, атрибутам, тексту и regex.' },
        { type: 'code', language: 'python', value: 'from bs4 import BeautifulSoup\nimport re\n\nhtml = """\n<div class="container">\n  <p class="text important">Первый параграф</p>\n  <p class="text">Второй параграф</p>\n  <p class="text">Третий параграф</p>\n  <span class="price">100 руб</span>\n  <span class="price">200 руб</span>\n  <a href="https://example.com" rel="nofollow">Ссылка 1</a>\n  <a href="/local">Ссылка 2</a>\n</div>\n"""\nsoup = BeautifulSoup(html, \'html.parser\')\n\n# По тегу\nall_p = soup.find_all(\'p\')\nprint(f"Параграфов: {len(all_p)}")\n\n# По классу\nimportant = soup.find(\'p\', class_=\'important\')\nprint(important.text)  # Первый параграф\n\n# find_all с несколькими тегами\nelements = soup.find_all([\'p\', \'span\'])\nprint(f"p и span: {len(elements)}")\n\n# По атрибуту\nexternal = soup.find_all(\'a\', href=re.compile(r\'^https\'))\nprint(f"Внешних ссылок: {len(external)}")\n\n# По тексту\nfound = soup.find(\'p\', string=re.compile(\'Второй\'))\nprint(found.text)  # Второй параграф\n\n# limit\nfirst_two_p = soup.find_all(\'p\', limit=2)\n\n# Получение текста\nfor span in soup.find_all(\'span\', class_=\'price\'):\n    # Очистка: убираем "руб" и пробелы\n    price_text = span.text.strip().replace(\' руб\', \'\')\n    price = int(price_text)\n    print(f"Цена: {price}")' }
      ]
    },
    {
      id: 4,
      title: 'CSS-селекторы: select()',
      type: 'theory',
      content: [
        { type: 'text', value: 'select() использует CSS-селекторы — более мощный и лаконичный способ поиска элементов. Знакомо всем, кто знает CSS.' },
        { type: 'code', language: 'python', value: 'from bs4 import BeautifulSoup\n\nhtml = """\n<div id="catalog">\n  <ul class="product-list">\n    <li class="product active">\n      <a href="/p/1"><img src="/img/1.jpg" alt="Ноутбук"></a>\n      <h3>Ноутбук Dell</h3>\n      <p class="price" data-currency="RUB">75000</p>\n    </li>\n    <li class="product">\n      <a href="/p/2"><img src="/img/2.jpg" alt="Телефон"></a>\n      <h3>iPhone 15</h3>\n      <p class="price" data-currency="RUB">85000</p>\n    </li>\n  </ul>\n</div>\n"""\nsoup = BeautifulSoup(html, \'html.parser\')\n\n# По id\ncatalog = soup.select_one(\'#catalog\')\n\n# По классу\nproducts = soup.select(\'.product\')\nprint(f"Товаров: {len(products)}")\n\n# Дочерние элементы (прямой потомок >)\ntitles = soup.select(\'.product > h3\')\nfor t in titles:\n    print(t.text)\n\n# Вложенные\nprices = soup.select(\'#catalog .price\')\nfor p in prices:\n    print(p.text, p[\'data-currency\'])\n\n# По атрибуту\nimages = soup.select(\'img[alt]\')\nfor img in images:\n    print(img[\'src\'], img[\'alt\'])\n\n# Активный элемент\nactive = soup.select_one(\'.product.active\')\nprint(active.find(\'h3\').text)  # Ноутбук Dell\n\n# Комбинирование\nlinks_in_active = soup.select(\'.product.active a[href]\')\nprint(links_in_active[0][\'href\'])' }
      ]
    },
    {
      id: 5,
      title: 'Навигация по дереву DOM',
      type: 'theory',
      content: [
        { type: 'text', value: 'BeautifulSoup позволяет навигировать по дереву: родители, дети, соседи. Полезно когда нет уникальных классов или id.' },
        { type: 'code', language: 'python', value: 'from bs4 import BeautifulSoup\n\nhtml = """\n<table>\n  <thead><tr><th>Имя</th><th>Зарплата</th><th>Отдел</th></tr></thead>\n  <tbody>\n    <tr><td>Алиса</td><td>80000</td><td>IT</td></tr>\n    <tr><td>Боб</td><td>60000</td><td>HR</td></tr>\n    <tr><td>Вася</td><td>90000</td><td>IT</td></tr>\n  </tbody>\n</table>\n"""\nsoup = BeautifulSoup(html, \'html.parser\')\n\n# Парсинг таблицы\nrows = soup.select(\'tbody tr\')\ndata = []\nfor row in rows:\n    cells = row.find_all(\'td\')\n    data.append({\n        \'имя\': cells[0].text,\n        \'зарплата\': int(cells[1].text),\n        \'отдел\': cells[2].text\n    })\nprint(data)\n\n# Навигация: parent, children, siblings\ncell = soup.find(\'td\', string=\'Алиса\')\nprint(cell.parent)          # строка <tr>\nprint(cell.next_sibling)    # следующий элемент (может быть \'\\n\')\nprint(cell.next_sibling.next_sibling)  # следующий td\n\n# Получение текста с очисткой\ndef clean_text(element):\n    return element.get_text(strip=True)\n\n# get_text для всего блока\nprint(soup.get_text(separator=\'\\n\', strip=True))' }
      ]
    },
    {
      id: 6,
      title: 'Полный пример: парсинг каталога',
      type: 'theory',
      content: [
        { type: 'text', value: 'Реальный парсинг включает: запрос страницы, парсинг, извлечение данных, обработку пагинации и сохранение результатов.' },
        { type: 'code', language: 'python', value: 'import requests\nfrom bs4 import BeautifulSoup\nimport pandas as pd\nimport time\n\ndef scrape_page(url, session, headers):\n    """Парсит одну страницу каталога."""\n    try:\n        response = session.get(url, headers=headers, timeout=10)\n        response.raise_for_status()\n        soup = BeautifulSoup(response.text, \'html.parser\')\n        return soup\n    except requests.RequestException as e:\n        print(f"Ошибка при запросе {url}: {e}")\n        return None\n\ndef parse_products(soup):\n    """Извлекает данные о товарах из BeautifulSoup объекта."""\n    products = []\n    for item in soup.select(\'.product-card\'):\n        try:\n            name = item.select_one(\'.product-title\').get_text(strip=True)\n            price_text = item.select_one(\'.price\').get_text(strip=True)\n            price = int(price_text.replace(\' \', \'\').replace(\'₽\', \'\'))\n            link = item.select_one(\'a\')[\'href\']\n            image = item.select_one(\'img\')[\'src\']\n            products.append({\n                \'название\': name,\n                \'цена\': price,\n                \'ссылка\': link,\n                \'изображение\': image\n            })\n        except (AttributeError, KeyError, ValueError) as e:\n            print(f"Ошибка парсинга товара: {e}")\n    return products\n\ndef get_next_page_url(soup, base_url):\n    """Находит URL следующей страницы."""\n    next_btn = soup.select_one(\'.pagination .next:not(.disabled)\')\n    if next_btn and next_btn.get(\'href\'):\n        return base_url + next_btn[\'href\']\n    return None\n\n# Основной код\nbase_url = \'https://example-shop.ru\'\nheaders = {\'User-Agent\': \'Mozilla/5.0 Chrome/120.0\'}\nall_products = []\n\nwith requests.Session() as session:\n    url = f\'{base_url}/catalog\'\n    page = 1\n    while url and page <= 5:  # ограничение\n        print(f"Парсинг страницы {page}: {url}")\n        soup = scrape_page(url, session, headers)\n        if soup:\n            products = parse_products(soup)\n            all_products.extend(products)\n            url = get_next_page_url(soup, base_url)\n        page += 1\n        time.sleep(1.5)  # пауза между запросами\n\ndf = pd.DataFrame(all_products)\ndf.to_csv(\'products.csv\', index=False, encoding=\'utf-8\')\nprint(f"Собрано {len(df)} товаров")' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Парсинг таблицы',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напарси данные из HTML-таблицы и сохрани в Pandas DataFrame.',
      requirements: [
        'Создай HTML-строку с таблицей 10 строк: id, название товара, цена, категория, наличие(да/нет)',
        'Используй BeautifulSoup для парсинга всей таблицы',
        'Загрузи данные в Pandas DataFrame',
        'Очисти: преобразуй цену в число (убери символ валюты), наличие в булев тип',
        'Выведи статистику: средняя цена по категориям, количество товаров в наличии',
        'Сохрани в CSV файл'
      ],
      expectedOutput: 'DataFrame с 10 строками\ncена — числовой тип\nналичие — булев тип\nСредняя цена по категориям:\n...\nТоваров в наличии: N',
      hint: 'soup.find("table") затем find_all("tr"). cells[0].get_text(strip=True). price.replace("₽", "").strip() для очистки цены.',
      solution: 'from bs4 import BeautifulSoup\nimport pandas as pd\n\nhtml = """\n<table id="catalog">\n  <thead><tr><th>ID</th><th>Название</th><th>Цена</th><th>Категория</th><th>Наличие</th></tr></thead>\n  <tbody>\n    <tr><td>1</td><td>Ноутбук</td><td>75000 ₽</td><td>Электроника</td><td>да</td></tr>\n    <tr><td>2</td><td>Футболка</td><td>1500 ₽</td><td>Одежда</td><td>да</td></tr>\n    <tr><td>3</td><td>Хлеб</td><td>80 ₽</td><td>Продукты</td><td>да</td></tr>\n    <tr><td>4</td><td>Телефон</td><td>45000 ₽</td><td>Электроника</td><td>нет</td></tr>\n    <tr><td>5</td><td>Джинсы</td><td>3000 ₽</td><td>Одежда</td><td>да</td></tr>\n    <tr><td>6</td><td>Планшет</td><td>35000 ₽</td><td>Электроника</td><td>нет</td></tr>\n    <tr><td>7</td><td>Молоко</td><td>95 ₽</td><td>Продукты</td><td>да</td></tr>\n    <tr><td>8</td><td>Куртка</td><td>8000 ₽</td><td>Одежда</td><td>да</td></tr>\n    <tr><td>9</td><td>Кофе</td><td>500 ₽</td><td>Продукты</td><td>да</td></tr>\n    <tr><td>10</td><td>Наушники</td><td>12000 ₽</td><td>Электроника</td><td>нет</td></tr>\n  </tbody>\n</table>\n"""\n\nsoup = BeautifulSoup(html, \'html.parser\')\n\n# Парсинг заголовков\nheaders = [th.get_text(strip=True) for th in soup.select(\'thead th\')]\nprint(f"Столбцы: {headers}")\n\n# Парсинг строк\nrows = []\nfor tr in soup.select(\'tbody tr\'):\n    cells = tr.find_all(\'td\')\n    rows.append([c.get_text(strip=True) for c in cells])\n\ndf = pd.DataFrame(rows, columns=headers)\nprint("До очистки:")\nprint(df.dtypes)\n\n# Очистка\ndf[\'Цена\'] = df[\'Цена\'].str.replace(\' ₽\', \'\').str.replace(\' \', \'\').astype(int)\ndf[\'Наличие\'] = df[\'Наличие\'].map({\'да\': True, \'нет\': False})\ndf[\'ID\'] = df[\'ID\'].astype(int)\n\nprint("\\nПосле очистки:")\nprint(df)\nprint(df.dtypes)\n\nprint("\\nСредняя цена по категориям:")\nprint(df.groupby(\'Категория\')[\'Цена\'].mean().round(0))\n\nprint(f"\\nТоваров в наличии: {df[\'Наличие\'].sum()}")\n\ndf.to_csv(\'catalog.csv\', index=False, encoding=\'utf-8\')\nprint("Сохранено в catalog.csv")',
      explanation: 'select("thead th") выбирает заголовки, select("tbody tr") — строки данных. get_text(strip=True) убирает пробелы. map() для булевого преобразования — чище чем условные выражения. to_csv с encoding="utf-8" важно для кириллицы.'
    }
  ]
}
