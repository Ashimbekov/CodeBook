export default {
  id: 16,
  title: 'Файлы и загрузка',
  description: 'UploadFile и File в FastAPI: загрузка файлов, валидация типов и размеров, сохранение на диск и облако, работа с множественными файлами',
  lessons: [
    {
      id: 1,
      title: 'UploadFile: базовая загрузка файлов',
      type: 'theory',
      content: [
        { type: 'text', value: 'UploadFile предоставляет удобный интерфейс для работы с загруженными файлами. Файл читается частями (streaming), что эффективно для больших файлов. Имеет атрибуты filename, content_type и методы read(), seek(), write().' },
        { type: 'code', language: 'python', value: 'from fastapi import FastAPI, UploadFile, File\nfrom fastapi.responses import JSONResponse\n\napp = FastAPI()\n\n@app.post("/upload/")\nasync def upload_file(file: UploadFile = File(...)):\n    content = await file.read()\n    return {\n        "filename": file.filename,\n        "content_type": file.content_type,\n        "size": len(content)\n    }\n\n@app.post("/upload/save/")\nasync def upload_and_save(file: UploadFile = File(...)):\n    # Сохранение на диск\n    file_path = f"uploads/{file.filename}"\n    with open(file_path, "wb") as f:\n        content = await file.read()\n        f.write(content)\n    return {"saved_to": file_path, "size": len(content)}' },
        { type: 'tip', value: 'await file.read() читает весь файл в память. Для больших файлов используй chunk-чтение: while chunk := await file.read(1024*1024) для чтения по 1MB.' },
        { type: 'heading', value: 'Chunk-чтение для больших файлов' },
        { type: 'code', language: 'python', value: 'import aiofiles\n\n@app.post("/upload/large/")\nasync def upload_large_file(file: UploadFile = File(...)):\n    file_path = f"uploads/{file.filename}"\n    total_size = 0\n\n    async with aiofiles.open(file_path, "wb") as out:\n        while chunk := await file.read(1024 * 1024):  # 1MB chunk\n            await out.write(chunk)\n            total_size += len(chunk)\n\n    return {"filename": file.filename, "total_size": total_size}' }
      ]
    },
    {
      id: 2,
      title: 'Валидация файлов',
      type: 'theory',
      content: [
        { type: 'text', value: 'FastAPI не предоставляет встроенной валидации файлов по типу и размеру. Нужно реализовывать её вручную, проверяя content_type и размер файла.' },
        { type: 'code', language: 'python', value: 'from fastapi import FastAPI, UploadFile, File, HTTPException\n\napp = FastAPI()\n\nALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/gif", "image/webp"}\nMAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB\n\n@app.post("/upload/image/")\nasync def upload_image(file: UploadFile = File(...)):\n    # Проверка типа файла\n    if file.content_type not in ALLOWED_IMAGE_TYPES:\n        raise HTTPException(\n            status_code=400,\n            detail=f"Неверный тип файла: {file.content_type}. "\n                   f"Разрешены: {ALLOWED_IMAGE_TYPES}"\n        )\n\n    # Читаем и проверяем размер\n    content = await file.read()\n    if len(content) > MAX_FILE_SIZE:\n        raise HTTPException(\n            status_code=400,\n            detail=f"Файл слишком большой: {len(content)} байт. "\n                   f"Максимум: {MAX_FILE_SIZE} байт"\n        )\n\n    # Сохраняем\n    file_path = f"uploads/images/{file.filename}"\n    with open(file_path, "wb") as f:\n        f.write(content)\n\n    return {\n        "filename": file.filename,\n        "content_type": file.content_type,\n        "size": len(content)\n    }' },
        { type: 'note', value: 'content_type берётся из заголовка запроса и может быть подделан. Для надёжной проверки типа файла используй библиотеку python-magic, которая анализирует магические байты файла.' }
      ]
    },
    {
      id: 3,
      title: 'Множественная загрузка файлов',
      type: 'theory',
      content: [
        { type: 'text', value: 'FastAPI поддерживает загрузку нескольких файлов за один запрос через List[UploadFile]. Каждый файл обрабатывается независимо.' },
        { type: 'code', language: 'python', value: 'from fastapi import FastAPI, UploadFile, File\nfrom typing import List\nimport os\n\napp = FastAPI()\n\nos.makedirs("uploads", exist_ok=True)\n\n@app.post("/upload/multiple/")\nasync def upload_multiple_files(\n    files: List[UploadFile] = File(...)\n):\n    results = []\n\n    for file in files:\n        content = await file.read()\n        file_path = f"uploads/{file.filename}"\n\n        with open(file_path, "wb") as f:\n            f.write(content)\n\n        results.append({\n            "filename": file.filename,\n            "content_type": file.content_type,\n            "size": len(content),\n            "saved_to": file_path\n        })\n\n    return {\n        "uploaded": len(results),\n        "files": results\n    }\n\n# Можно смешивать файлы и поля формы\n@app.post("/products/")\nasync def create_product_with_image(\n    name: str,\n    price: float,\n    image: UploadFile = File(None)  # необязательный файл\n):\n    result = {"name": name, "price": price}\n    if image:\n        content = await image.read()\n        result["image_size"] = len(content)\n        result["image_type"] = image.content_type\n    return result' },
        { type: 'tip', value: 'File(None) делает файл необязательным. Тип параметра будет Optional[UploadFile]. Не забудь проверить if image: перед использованием.' }
      ]
    },
    {
      id: 4,
      title: 'Генерация уникальных имён и структура хранения',
      type: 'theory',
      content: [
        { type: 'text', value: 'В продакшн-приложениях нельзя использовать оригинальные имена файлов — они могут конфликтовать или содержать опасные символы. Используй UUID для генерации уникальных имён.' },
        { type: 'code', language: 'python', value: 'from fastapi import FastAPI, UploadFile, File, HTTPException\nfrom pathlib import Path\nfrom datetime import datetime\nimport uuid\nimport os\n\napp = FastAPI()\n\nBASE_UPLOAD_DIR = Path("uploads")\n\ndef get_upload_path(content_type: str) -> Path:\n    """Определяем директорию по типу файла"""\n    if content_type.startswith("image/"):\n        folder = "images"\n    elif content_type.startswith("video/"):\n        folder = "videos"\n    elif content_type == "application/pdf":\n        folder = "documents"\n    else:\n        folder = "misc"\n\n    # Структура: uploads/images/2024/01/\n    today = datetime.now()\n    path = BASE_UPLOAD_DIR / folder / str(today.year) / f"{today.month:02d}"\n    path.mkdir(parents=True, exist_ok=True)\n    return path\n\ndef get_extension(filename: str) -> str:\n    return Path(filename).suffix.lower()\n\n@app.post("/upload/")\nasync def upload(file: UploadFile = File(...)):\n    upload_dir = get_upload_path(file.content_type)\n    ext = get_extension(file.filename)\n    unique_name = f"{uuid.uuid4()}{ext}"\n    file_path = upload_dir / unique_name\n\n    content = await file.read()\n    with open(file_path, "wb") as f:\n        f.write(content)\n\n    return {\n        "original_name": file.filename,\n        "saved_as": unique_name,\n        "path": str(file_path),\n        "size": len(content)\n    }' },
        { type: 'note', value: 'Структура директорий по году/месяцу предотвращает накопление миллионов файлов в одной папке, что замедляет файловую систему. UUID гарантирует уникальность имён.' }
      ]
    },
    {
      id: 5,
      title: 'Отдача файлов: FileResponse и StaticFiles',
      type: 'theory',
      content: [
        { type: 'text', value: 'Загруженные файлы нужно уметь отдавать обратно клиентам. FastAPI предоставляет FileResponse для отдачи отдельных файлов и StaticFiles для целых директорий.' },
        { type: 'code', language: 'python', value: 'from fastapi import FastAPI, HTTPException\nfrom fastapi.responses import FileResponse\nfrom fastapi.staticfiles import StaticFiles\nfrom pathlib import Path\n\napp = FastAPI()\n\n# Монтирование директории как статики\napp.mount("/static", StaticFiles(directory="uploads"), name="static")\n\n@app.get("/files/{filename}")\ndef download_file(filename: str):\n    file_path = Path("uploads") / filename\n    if not file_path.exists():\n        raise HTTPException(status_code=404, detail="Файл не найден")\n\n    return FileResponse(\n        path=file_path,\n        filename=filename,  # имя для заголовка Content-Disposition\n        media_type="application/octet-stream"  # принудительное скачивание\n    )\n\n@app.get("/images/{filename}")\ndef view_image(filename: str):\n    file_path = Path("uploads/images") / filename\n    if not file_path.exists():\n        raise HTTPException(status_code=404, detail="Изображение не найдено")\n\n    # Без media_type — браузер отобразит изображение\n    return FileResponse(path=file_path)' },
        { type: 'tip', value: 'StaticFiles автоматически обрабатывает Range-запросы для видео (перемотка). FileResponse с media_type="application/octet-stream" принудительно скачивает файл вместо отображения в браузере.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Файловое хранилище',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай мини-файловое хранилище с загрузкой, листингом и скачиванием файлов.',
      requirements: [
        'POST /files/upload/ — загрузка файла с валидацией типа (только image/* и application/pdf) и размера (макс 10MB)',
        'GET /files/ — список всех загруженных файлов с метаданными (имя, тип, размер, дата)',
        'GET /files/{file_id} — скачивание файла по UUID',
        'DELETE /files/{file_id} — удаление файла',
        'Хранить метаданные в словаре (in-memory база данных)',
        'UUID-имена файлов на диске, оригинальные имена в метаданных'
      ],
      expectedOutput: 'POST /files/upload/ -> {"file_id": "abc123", "filename": "photo.jpg", "size": 45231}\nGET /files/ -> [{"file_id": "abc123", "filename": "photo.jpg", ...}]\nGET /files/abc123 -> (скачивание файла)',
      hint: 'Храни метаданные как dict[str, dict] где ключ — UUID файла. При удалении вызывай os.remove() для удаления с диска. FileResponse принимает путь до файла.',
      solution: 'from fastapi import FastAPI, UploadFile, File, HTTPException\nfrom fastapi.responses import FileResponse\nfrom pathlib import Path\nfrom datetime import datetime\nfrom typing import Dict\nimport uuid\nimport os\n\napp = FastAPI()\n\nUPLOAD_DIR = Path("storage")\nUPLOAD_DIR.mkdir(exist_ok=True)\n\nALLOWED_TYPES = {"image/jpeg", "image/png", "image/gif", "application/pdf"}\nMAX_SIZE = 10 * 1024 * 1024  # 10MB\n\nfiles_db: Dict[str, dict] = {}\n\n@app.post("/files/upload/", status_code=201)\nasync def upload_file(file: UploadFile = File(...)):\n    if file.content_type not in ALLOWED_TYPES:\n        raise HTTPException(400, f"Тип {file.content_type} не разрешён")\n    content = await file.read()\n    if len(content) > MAX_SIZE:\n        raise HTTPException(400, "Файл превышает 10MB")\n    file_id = str(uuid.uuid4())\n    ext = Path(file.filename).suffix\n    saved_path = UPLOAD_DIR / f"{file_id}{ext}"\n    with open(saved_path, "wb") as f:\n        f.write(content)\n    files_db[file_id] = {\n        "file_id": file_id,\n        "filename": file.filename,\n        "content_type": file.content_type,\n        "size": len(content),\n        "path": str(saved_path),\n        "uploaded_at": datetime.now().isoformat()\n    }\n    return files_db[file_id]\n\n@app.get("/files/")\ndef list_files():\n    return list(files_db.values())\n\n@app.get("/files/{file_id}")\ndef download_file(file_id: str):\n    if file_id not in files_db:\n        raise HTTPException(404, "Файл не найден")\n    meta = files_db[file_id]\n    return FileResponse(\n        path=meta["path"],\n        filename=meta["filename"],\n        media_type=meta["content_type"]\n    )\n\n@app.delete("/files/{file_id}", status_code=204)\ndef delete_file(file_id: str):\n    if file_id not in files_db:\n        raise HTTPException(404, "Файл не найден")\n    os.remove(files_db[file_id]["path"])\n    del files_db[file_id]',
      explanation: 'UUID генерируется для каждого файла через uuid.uuid4(). Метаданные хранятся в словаре files_db. Файл сохраняется с UUID+расширение, оригинальное имя хранится в метаданных. FileResponse читает файл и отдаёт клиенту с правильным Content-Type и Content-Disposition.'
    }
  ]
}
