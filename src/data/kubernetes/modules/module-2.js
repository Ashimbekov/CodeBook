export default {
  id: 2,
  title: 'Установка окружения: minikube, kind, kubectl',
  description: 'Как установить локальный кластер Kubernetes с помощью minikube или kind и настроить kubectl',
  lessons: [
    {
      id: 1,
      title: 'Обзор инструментов локальной разработки',
      type: 'theory',
      content: [
        { type: 'text', value: 'Для изучения Kubernetes не нужен облачный кластер. Существует несколько инструментов для запуска K8s локально: minikube, kind (Kubernetes in Docker), k3s, MicroK8s. Каждый имеет свои плюсы.' },
        { type: 'heading', value: 'Сравнение инструментов' },
        { type: 'list', items: [
          'minikube — самый популярный, поддерживает много драйверов (Docker, VirtualBox, Hyper-V), встроенные аддоны',
          'kind — Kubernetes IN Docker, быстрый старт, отличен для CI/CD и тестирования',
          'k3s — лёгкий Kubernetes от Rancher, хорош для edge и IoT',
          'MicroK8s — от Canonical (Ubuntu), простая установка через snap'
        ]},
        { type: 'tip', value: 'Для обучения рекомендуем minikube — у него отличная документация и встроенный dashboard. Для CI/CD и быстрых тестов используйте kind.' },
        { type: 'note', value: 'Для продакшена используются облачные решения: GKE (Google), EKS (Amazon), AKS (Azure) или самостоятельная установка через kubeadm.' }
      ]
    },
    {
      id: 2,
      title: 'Установка kubectl',
      type: 'theory',
      content: [
        { type: 'text', value: 'kubectl — это основной CLI-инструмент для управления Kubernetes. Он отправляет команды в API-сервер кластера. Устанавливается отдельно от кластера.' },
        { type: 'heading', value: 'Установка на Linux' },
        { type: 'code', language: 'bash', value: '# Скачать последнюю стабильную версию\ncurl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"\n\n# Сделать исполняемым\nchmod +x kubectl\n\n# Переместить в PATH\nsudo mv kubectl /usr/local/bin/\n\n# Проверить\nkubectl version --client' },
        { type: 'heading', value: 'Установка на macOS' },
        { type: 'code', language: 'bash', value: '# Через Homebrew\nbrew install kubectl\n\n# Проверить\nkubectl version --client' },
        { type: 'heading', value: 'Установка на Windows' },
        { type: 'code', language: 'bash', value: '# Через Chocolatey\nchoco install kubernetes-cli\n\n# Через winget\nwinget install Kubernetes.kubectl' },
        { type: 'tip', value: 'Включи автодополнение для kubectl в bash: echo "source <(kubectl completion bash)" >> ~/.bashrc. Это значительно ускорит работу.' }
      ]
    },
    {
      id: 3,
      title: 'Установка и запуск minikube',
      type: 'theory',
      content: [
        { type: 'text', value: 'minikube создаёт локальный однонодовый кластер Kubernetes. Он поддерживает множество драйверов виртуализации и предоставляет удобные встроенные команды.' },
        { type: 'heading', value: 'Установка minikube' },
        { type: 'code', language: 'bash', value: '# Linux\ncurl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64\nsudo install minikube-linux-amd64 /usr/local/bin/minikube\n\n# macOS\nbrew install minikube\n\n# Windows (Chocolatey)\nchoco install minikube' },
        { type: 'heading', value: 'Запуск кластера' },
        { type: 'code', language: 'bash', value: '# Запустить с драйвером Docker (рекомендуется)\nminikube start --driver=docker\n\n# Запустить с указанием ресурсов\nminikube start --cpus=2 --memory=4096 --disk-size=20g\n\n# Запустить определённую версию K8s\nminikube start --kubernetes-version=v1.28.0\n\n# Проверить статус\nminikube status' },
        { type: 'heading', value: 'Полезные команды minikube' },
        { type: 'code', language: 'bash', value: '# Открыть dashboard\nminikube dashboard\n\n# Остановить кластер\nminikube stop\n\n# Удалить кластер\nminikube delete\n\n# Получить IP кластера\nminikube ip\n\n# SSH в кластер\nminikube ssh' }
      ]
    },
    {
      id: 4,
      title: 'Установка и использование kind',
      type: 'theory',
      content: [
        { type: 'text', value: 'kind (Kubernetes IN Docker) запускает K8s-кластер внутри Docker-контейнеров. Это делает его очень быстрым и хорошо подходящим для тестирования и CI/CD.' },
        { type: 'heading', value: 'Установка kind' },
        { type: 'code', language: 'bash', value: '# Linux\ncurl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.20.0/kind-linux-amd64\nchmod +x ./kind\nsudo mv ./kind /usr/local/bin/kind\n\n# macOS\nbrew install kind\n\n# Windows\nchoco install kind' },
        { type: 'heading', value: 'Создание кластера' },
        { type: 'code', language: 'bash', value: '# Создать простой кластер\nkind create cluster\n\n# Создать кластер с именем\nkind create cluster --name my-cluster\n\n# Список кластеров\nkind get clusters\n\n# Удалить кластер\nkind delete cluster --name my-cluster' },
        { type: 'heading', value: 'Конфигурация multi-node кластера' },
        { type: 'code', language: 'yaml', value: '# kind-config.yaml\nkind: Cluster\napiVersion: kind.x-k8s.io/v1alpha4\nnodes:\n- role: control-plane\n- role: worker\n- role: worker' },
        { type: 'code', language: 'bash', value: 'kind create cluster --config kind-config.yaml' },
        { type: 'note', value: 'kind автоматически настраивает kubeconfig. После создания кластера команды kubectl сразу работают с ним.' }
      ]
    },
    {
      id: 5,
      title: 'Конфигурация kubectl и контексты',
      type: 'theory',
      content: [
        { type: 'text', value: 'kubectl использует файл kubeconfig (обычно ~/.kube/config) для хранения информации о кластерах. Контексты позволяют быстро переключаться между кластерами.' },
        { type: 'heading', value: 'Структура kubeconfig' },
        { type: 'list', items: [
          'clusters — информация о кластерах (адрес API-сервера, сертификаты)',
          'users — учётные данные пользователей',
          'contexts — связка кластер + пользователь + namespace',
          'current-context — текущий активный контекст'
        ]},
        { type: 'heading', value: 'Работа с контекстами' },
        { type: 'code', language: 'bash', value: '# Показать текущий контекст\nkubectl config current-context\n\n# Список всех контекстов\nkubectl config get-contexts\n\n# Переключить контекст\nkubectl config use-context minikube\n\n# Установить namespace по умолчанию для контекста\nkubectl config set-context --current --namespace=my-namespace\n\n# Просмотреть kubeconfig\nkubectl config view' },
        { type: 'tip', value: 'Установите kubectx и kubens (github.com/ahmetb/kubectx) для быстрого переключения контекстов и namespace: kubectx prod, kubens kube-system.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Настройка локального кластера',
      type: 'practice',
      difficulty: 'easy',
      description: 'Установите minikube, запустите кластер, проверьте его работу и ознакомьтесь с основными командами.',
      requirements: [
        'Установить kubectl и minikube',
        'Запустить кластер minikube',
        'Проверить статус узлов',
        'Открыть и изучить dashboard',
        'Включить Ingress аддон',
        'Остановить кластер'
      ],
      hint: 'После minikube start используйте kubectl get nodes для проверки. Аддоны включаются командой minikube addons enable.',
      expectedOutput: 'minikube start:\n* Starting control plane node minikube in cluster minikube\n* Done! kubectl is now configured to use "minikube"\n\nkubectl get nodes:\nNAME       STATUS   ROLES           AGE   VERSION\nminikube   Ready    control-plane   1m    v1.28.0\n\nminikube addons enable ingress:\n* ingress was successfully enabled\n\nminikube addons list | grep ingress:\n| ingress                     | minikube | enabled\n\nminikube stop:\n* Stopping node "minikube" ...',
      solution: '# Установка (Linux)\ncurl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"\nchmod +x kubectl && sudo mv kubectl /usr/local/bin/\n\ncurl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64\nsudo install minikube-linux-amd64 /usr/local/bin/minikube\n\n# Запуск кластера\nminikube start --driver=docker --cpus=2 --memory=4096\n\n# Проверка\nkubectl get nodes\nkubectl cluster-info\nkubectl get pods -A\n\n# Dashboard\nminikube dashboard &\n\n# Включить Ingress\nminikube addons enable ingress\nminikube addons list\n\n# Остановить\nminikube stop',
      explanation: 'minikube start создаёт однонодовый кластер. После запуска kubeconfig автоматически настраивается. Dashboard предоставляет веб-интерфейс для визуального управления кластером. Аддоны расширяют функциональность minikube.'
    }
  ]
}
