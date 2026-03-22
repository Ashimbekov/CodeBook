export default {
  id: 10,
  title: 'Сборка и артефакты',
  description: 'Docker сборка, GitHub Packages, GitLab Registry, семантическое версионирование, релизы.',
  lessons: [
    {
      id: 1,
      title: 'Сборка Docker образа в CI',
      type: 'theory',
      content: [
        { type: 'text', value: 'Сборка Docker образа — типичная задача CI. Собранный образ публикуется в registry и затем используется для деплоя.' },
        { type: 'code', language: 'yaml', value: '# GitHub Actions: сборка и пуш в Docker Hub\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n\n      - name: Docker Meta (теги)\n        id: meta\n        uses: docker/metadata-action@v5\n        with:\n          images: myorg/myapp\n          tags: |\n            type=ref,event=branch\n            type=ref,event=pr\n            type=semver,pattern={{version}}\n            type=sha,prefix=sha-\n\n      - name: Docker Buildx\n        uses: docker/setup-buildx-action@v3\n\n      - name: Логин в Docker Hub\n        uses: docker/login-action@v3\n        with:\n          username: ${{ secrets.DOCKER_USERNAME }}\n          password: ${{ secrets.DOCKER_PASSWORD }}\n\n      - name: Сборка и пуш\n        uses: docker/build-push-action@v6\n        with:\n          context: .\n          push: true\n          tags: ${{ steps.meta.outputs.tags }}\n          cache-from: type=gha\n          cache-to: type=gha,mode=max' },
        { type: 'tip', value: 'docker/metadata-action автоматически генерирует теги: latest для main, имя ветки для feature, v1.2.3 для тега. Не нужно писать логику тегирования вручную.' }
      ]
    },
    {
      id: 2,
      title: 'GitHub Container Registry (GHCR)',
      type: 'theory',
      content: [
        { type: 'text', value: 'GitHub Container Registry — встроенный registry для Docker образов в GitHub. Бесплатен для public репозиториев.' },
        { type: 'code', language: 'yaml', value: 'jobs:\n  build-push:\n    runs-on: ubuntu-latest\n    permissions:\n      contents: read\n      packages: write\n\n    steps:\n      - uses: actions/checkout@v4\n      - uses: docker/setup-buildx-action@v3\n\n      - name: Логин в GHCR\n        uses: docker/login-action@v3\n        with:\n          registry: ghcr.io\n          username: ${{ github.actor }}\n          password: ${{ secrets.GITHUB_TOKEN }}  # автоматический токен!\n\n      - uses: docker/build-push-action@v6\n        with:\n          push: true\n          tags: |\n            ghcr.io/${{ github.repository }}:latest\n            ghcr.io/${{ github.repository }}:${{ github.sha }}\n          labels: |\n            org.opencontainers.image.source=${{ github.server_url }}/${{ github.repository }}' }
      ]
    },
    {
      id: 3,
      title: 'Кеширование Docker layers',
      type: 'theory',
      content: [
        { type: 'text', value: 'Сборка Docker образа без кеша занимает много времени. GitHub Actions и GitLab поддерживают кеш слоёв.' },
        { type: 'code', language: 'yaml', value: '# GitHub Actions кеш через GitHub Cache\n- uses: docker/build-push-action@v6\n  with:\n    cache-from: type=gha          # читать из GitHub Actions cache\n    cache-to: type=gha,mode=max   # писать в кеш\n\n# GitLab CI Registry кеш\nbuild:\n  image: docker:24\n  services: [docker:24-dind]\n  variables:\n    CACHE_IMAGE: $CI_REGISTRY_IMAGE/cache:latest\n  script:\n    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY\n    - docker pull $CACHE_IMAGE || true  # загрузить кеш\n    - docker build --cache-from $CACHE_IMAGE -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA .\n    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA\n    - docker tag $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA $CACHE_IMAGE\n    - docker push $CACHE_IMAGE  # обновить кеш' }
      ]
    },
    {
      id: 4,
      title: 'Семантическое версионирование и релизы',
      type: 'theory',
      content: [
        { type: 'text', value: 'SemVer (v1.2.3) — стандарт версионирования. Major.Minor.Patch. Автоматическое создание GitHub Release при создании тега.' },
        { type: 'code', language: 'yaml', value: '# Автоматический релиз при теге v*\nname: Release\non:\n  push:\n    tags:\n      - "v*"\n\njobs:\n  release:\n    runs-on: ubuntu-latest\n    permissions:\n      contents: write\n\n    steps:\n      - uses: actions/checkout@v4\n        with:\n          fetch-depth: 0\n\n      - name: Сборка\n        run: |\n          python setup.py bdist_wheel sdist\n\n      - name: Создать GitHub Release\n        uses: softprops/action-gh-release@v2\n        with:\n          files: dist/*\n          generate_release_notes: true  # автогенерация changelog из PR\n          token: ${{ secrets.GITHUB_TOKEN }}' },
        { type: 'note', value: 'generate_release_notes: true — GitHub автоматически создаёт changelog из заголовков PR смерженных с момента прошлого релиза. Очень удобно без дополнительных инструментов.' }
      ]
    },
    {
      id: 5,
      title: 'Публикация Python пакета в PyPI',
      type: 'theory',
      content: [
        { type: 'text', value: 'Если создаёшь Python библиотеку, CI может автоматически публиковать её в PyPI при создании релиза.' },
        { type: 'code', language: 'yaml', value: 'jobs:\n  publish-pypi:\n    runs-on: ubuntu-latest\n    permissions:\n      id-token: write  # для trusted publishing\n    environment: pypi\n\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v5\n        with: {python-version: "3.12"}\n\n      - name: Сборка пакета\n        run: |\n          pip install build\n          python -m build\n\n      - name: Публикация в PyPI\n        uses: pypa/gh-action-pypi-publish@release/v1\n        # Trusted publishing — без токенов!' },
        { type: 'tip', value: 'Trusted Publishing (PyPI) — современный безопасный способ публикации без долгоживущих API токенов. Настраивается в настройках PyPI проекта через GitHub Actions.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Build pipeline с Docker и Registry',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай workflow сборки Docker образа с публикацией в GHCR и созданием релиза.',
      requirements: [
        'Сборка Docker образа при push в main и создании тега',
        'Публикация в GHCR (ghcr.io)',
        'Тег latest для main, тег v* для тегов релиза',
        'Кеширование слоёв через GitHub Actions cache',
        'При создании тега v*: автоматический GitHub Release с changelog'
      ],
      expectedOutput: 'git push origin main -> образ ghcr.io/myorg/myapp:latest\ngit tag v1.2.0 && git push --tags -> образ ghcr.io/myorg/myapp:v1.2.0 + GitHub Release',
      hint: 'docker/metadata-action генерирует теги по событию. type=raw,value=latest,enable=${{ github.ref == "refs/heads/main" }} для conditional latest.',
      solution: '# .github/workflows/build.yml\nname: Build and Release\n\non:\n  push:\n    branches: [main]\n    tags: ["v*"]\n\njobs:\n  build:\n    runs-on: ubuntu-latest\n    permissions:\n      contents: write\n      packages: write\n\n    steps:\n      - uses: actions/checkout@v4\n\n      - name: Docker Meta\n        id: meta\n        uses: docker/metadata-action@v5\n        with:\n          images: ghcr.io/${{ github.repository }}\n          tags: |\n            type=semver,pattern={{version}}\n            type=semver,pattern={{major}}.{{minor}}\n            type=raw,value=latest,enable=${{ github.ref == "refs/heads/main" }}\n\n      - uses: docker/setup-buildx-action@v3\n\n      - uses: docker/login-action@v3\n        with:\n          registry: ghcr.io\n          username: ${{ github.actor }}\n          password: ${{ secrets.GITHUB_TOKEN }}\n\n      - uses: docker/build-push-action@v6\n        with:\n          push: true\n          tags: ${{ steps.meta.outputs.tags }}\n          cache-from: type=gha\n          cache-to: type=gha,mode=max\n\n  release:\n    if: startsWith(github.ref, "refs/tags/v")\n    needs: build\n    runs-on: ubuntu-latest\n    permissions:\n      contents: write\n    steps:\n      - uses: actions/checkout@v4\n        with: {fetch-depth: 0}\n      - uses: softprops/action-gh-release@v2\n        with:\n          generate_release_notes: true',
      explanation: 'startsWith(github.ref, "refs/tags/v") — условие для release job: только при теге. fetch-depth: 0 для полной истории git — нужна для generate_release_notes. type=semver автоматически создаёт теги v1.2.0 и v1.2 из git тега.'
    }
  ]
}
