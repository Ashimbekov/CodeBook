export default {
  id: 14,
  title: 'Безопасность Kubernetes',
  description: 'RBAC, Network Policies, Pod Security Standards, Admission Controllers, сканирование и hardening кластера Kubernetes.',
  lessons: [
    {
      id: 1,
      title: 'Угрозы безопасности Kubernetes',
      type: 'theory',
      content: [
        { type: 'text', value: 'Kubernetes имеет сложную модель безопасности с множеством компонентов. Основные угрозы: небезопасные defaults, открытый API server, отсутствие network policies, привилегированные поды, утечка secrets.' },
        { type: 'heading', value: 'Поверхность атаки Kubernetes' },
        { type: 'list', value: [
          'API Server — центральный компонент, требует строгой аутентификации',
          'etcd — хранилище данных, содержит все secrets (должен быть зашифрован)',
          'Kubelet — агент на каждой ноде, имеет доступ к контейнерам',
          'Container Runtime — Docker/containerd, уязвимости могут привести к escape',
          'Network — по умолчанию все поды могут общаться друг с другом',
          'Secrets — по умолчанию хранятся в etcd в base64 (НЕ шифрование!)'
        ]},
        { type: 'code', language: 'bash', value: '# === Проверка безопасности кластера ===\n\n# kube-bench: проверка по CIS Kubernetes Benchmark\nkubectl apply -f https://raw.githubusercontent.com/aquasecurity/kube-bench/main/job.yaml\nkubectl logs job/kube-bench\n\n# kubeaudit: аудит безопасности\nkubeaudit all\n# [error] RunAsNonRoot is not set in container: myapp\n# [error] AllowPrivilegeEscalation not set to false\n# [warning] Resource limits not set\n\n# Проверка RBAC\nkubectl auth can-i --list --as=system:serviceaccount:default:default\n# Какие права у default ServiceAccount?\n\n# Проверка что secrets зашифрованы\nkubectl get secrets -A -o json | jq -r \\\n  \'.items[] | select(.type != "kubernetes.io/service-account-token") | .metadata.name\'' },
        { type: 'warning', value: 'По умолчанию Kubernetes НЕ безопасен: все поды общаются между собой, secrets в base64, default ServiceAccount имеет права. Каждый кластер требует hardening!' }
      ]
    },
    {
      id: 2,
      title: 'RBAC в Kubernetes',
      type: 'theory',
      content: [
        { type: 'text', value: 'Kubernetes RBAC контролирует доступ к API ресурсам. Основные объекты: Role/ClusterRole (набор разрешений), RoleBinding/ClusterRoleBinding (привязка к пользователю/сервис-аккаунту).' },
        { type: 'code', language: 'yaml', value: '# === Принцип наименьших привилегий ===\n\n# Role: разрешения в пределах namespace\napiVersion: rbac.authorization.k8s.io/v1\nkind: Role\nmetadata:\n  namespace: production\n  name: app-reader\nrules:\n  - apiGroups: [""]\n    resources: ["pods", "services", "configmaps"]\n    verbs: ["get", "list", "watch"]  # Только чтение!\n  # НЕ давать: create, update, delete, patch\n  # НЕ давать: secrets (если не нужно)\n\n---\n# RoleBinding: привязка роли к ServiceAccount\napiVersion: rbac.authorization.k8s.io/v1\nkind: RoleBinding\nmetadata:\n  name: app-reader-binding\n  namespace: production\nsubjects:\n  - kind: ServiceAccount\n    name: myapp-sa\n    namespace: production\nroleRef:\n  kind: Role\n  name: app-reader\n  apiGroup: rbac.authorization.k8s.io\n\n---\n# ServiceAccount для приложения (НЕ используйте default!)\napiVersion: v1\nkind: ServiceAccount\nmetadata:\n  name: myapp-sa\n  namespace: production\nautomountServiceAccountToken: false  # Не монтировать токен если не нужен!' },
        { type: 'tip', value: 'Создавайте отдельный ServiceAccount для каждого приложения. Установите automountServiceAccountToken: false по умолчанию. Используйте Role (namespace-scoped) вместо ClusterRole когда возможно.' }
      ]
    },
    {
      id: 3,
      title: 'Network Policies',
      type: 'theory',
      content: [
        { type: 'text', value: 'Network Policies — файрвол Kubernetes на уровне подов. По умолчанию все поды могут общаться со всеми. Network Policies ограничивают трафик (ingress и egress) на основе labels, namespaces и IP блоков.' },
        { type: 'code', language: 'yaml', value: '# === Deny All (базовая политика) ===\napiVersion: networking.k8s.io/v1\nkind: NetworkPolicy\nmetadata:\n  name: deny-all\n  namespace: production\nspec:\n  podSelector: {}  # Все поды в namespace\n  policyTypes:\n    - Ingress\n    - Egress\n  # Нет правил ingress/egress = запрет всего\n\n---\n# === Разрешить frontend -> backend ===\napiVersion: networking.k8s.io/v1\nkind: NetworkPolicy\nmetadata:\n  name: allow-frontend-to-backend\n  namespace: production\nspec:\n  podSelector:\n    matchLabels:\n      app: backend\n  ingress:\n    - from:\n        - podSelector:\n            matchLabels:\n              app: frontend\n      ports:\n        - protocol: TCP\n          port: 8080\n\n---\n# === Разрешить backend -> database ===\napiVersion: networking.k8s.io/v1\nkind: NetworkPolicy\nmetadata:\n  name: allow-backend-to-db\n  namespace: production\nspec:\n  podSelector:\n    matchLabels:\n      app: database\n  ingress:\n    - from:\n        - podSelector:\n            matchLabels:\n              app: backend\n      ports:\n        - protocol: TCP\n          port: 5432\n\n---\n# === Разрешить DNS (необходимо для egress deny-all) ===\napiVersion: networking.k8s.io/v1\nkind: NetworkPolicy\nmetadata:\n  name: allow-dns\n  namespace: production\nspec:\n  podSelector: {}\n  egress:\n    - to: []\n      ports:\n        - protocol: UDP\n          port: 53\n        - protocol: TCP\n          port: 53' },
        { type: 'tip', value: 'Начните с deny-all, затем явно разрешайте необходимое. Не забудьте разрешить DNS (порт 53)! Для Network Policies нужен CNI plugin с поддержкой (Calico, Cilium, Weave Net). Flannel НЕ поддерживает Network Policies.' }
      ]
    },
    {
      id: 4,
      title: 'Pod Security Standards',
      type: 'theory',
      content: [
        { type: 'text', value: 'Pod Security Standards (PSS) определяют уровни безопасности для подов: Privileged (без ограничений), Baseline (минимальные ограничения), Restricted (максимальная безопасность). Применяются через Pod Security Admission Controller.' },
        { type: 'code', language: 'yaml', value: '# === Pod Security: Restricted (рекомендуется) ===\napiVersion: v1\nkind: Namespace\nmetadata:\n  name: production\n  labels:\n    # Enforce restricted policy\n    pod-security.kubernetes.io/enforce: restricted\n    pod-security.kubernetes.io/audit: restricted\n    pod-security.kubernetes.io/warn: restricted\n\n---\n# === Безопасная спецификация пода ===\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: myapp\n  namespace: production\nspec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: myapp\n  template:\n    metadata:\n      labels:\n        app: myapp\n    spec:\n      serviceAccountName: myapp-sa\n      automountServiceAccountToken: false\n      \n      securityContext:\n        runAsNonRoot: true\n        runAsUser: 1001\n        runAsGroup: 1001\n        fsGroup: 1001\n        seccompProfile:\n          type: RuntimeDefault\n      \n      containers:\n        - name: myapp\n          image: myapp:1.0.0@sha256:abc123...  # Пин по digest!\n          \n          securityContext:\n            allowPrivilegeEscalation: false\n            readOnlyRootFilesystem: true\n            capabilities:\n              drop: [\"ALL\"]\n          \n          resources:\n            limits:\n              cpu: \"500m\"\n              memory: \"256Mi\"\n            requests:\n              cpu: \"100m\"\n              memory: \"128Mi\"\n          \n          volumeMounts:\n            - name: tmp\n              mountPath: /tmp\n          \n          livenessProbe:\n            httpGet:\n              path: /health\n              port: 3000\n          readinessProbe:\n            httpGet:\n              path: /ready\n              port: 3000\n      \n      volumes:\n        - name: tmp\n          emptyDir:\n            sizeLimit: 64Mi' },
        { type: 'warning', value: 'Пинайте образы по sha256 digest, а не по тегу. Тег :latest или :1.0 может быть перезаписан (supply chain attack). Digest гарантирует конкретный образ: myapp:1.0@sha256:abc123...' }
      ]
    },
    {
      id: 5,
      title: 'Secrets и Admission Controllers',
      type: 'theory',
      content: [
        { type: 'text', value: 'Kubernetes Secrets по умолчанию хранятся в etcd в base64 (НЕ шифрование!). Для реальной защиты нужно: шифрование etcd at rest, external secret management (Vault), Sealed Secrets или External Secrets Operator.' },
        { type: 'code', language: 'yaml', value: '# === External Secrets Operator ===\n# Синхронизирует секреты из внешних хранилищ (Vault, AWS SM)\napiVersion: external-secrets.io/v1beta1\nkind: ExternalSecret\nmetadata:\n  name: db-credentials\n  namespace: production\nspec:\n  refreshInterval: 1h\n  secretStoreRef:\n    name: vault-backend\n    kind: ClusterSecretStore\n  target:\n    name: db-credentials  # Имя создаваемого K8s Secret\n  data:\n    - secretKey: password\n      remoteRef:\n        key: secret/data/production/db\n        property: password\n\n---\n# === OPA Gatekeeper (Admission Controller) ===\n# Политика: запретить контейнеры от root\napiVersion: constraints.gatekeeper.sh/v1beta1\nkind: K8sDisallowRootUser\nmetadata:\n  name: require-non-root\nspec:\n  match:\n    kinds:\n      - apiGroups: [""]\n        kinds: ["Pod"]\n    namespaces: ["production"]\n\n---\n# === Kyverno Policy (альтернатива OPA) ===\napiVersion: kyverno.io/v1\nkind: ClusterPolicy\nmetadata:\n  name: require-resource-limits\nspec:\n  validationFailureAction: Enforce\n  rules:\n    - name: check-limits\n      match:\n        any:\n          - resources:\n              kinds: [\"Pod\"]\n      validate:\n        message: \"CPU and memory limits are required\"\n        pattern:\n          spec:\n            containers:\n              - resources:\n                  limits:\n                    cpu: \"?*\"\n                    memory: \"?*\"' },
        { type: 'tip', value: 'Используйте External Secrets Operator + HashiCorp Vault для управления секретами. OPA Gatekeeper или Kyverno для enforcement политик безопасности на уровне кластера. Это предотвращает деплой небезопасных конфигураций.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Hardening Kubernetes кластера',
      type: 'practice',
      difficulty: 'hard',
      description: 'Настройте безопасный Kubernetes namespace с RBAC, Network Policies, Pod Security Standards и ограничением ресурсов.',
      requirements: [
        'Создайте namespace с Pod Security Standard "restricted"',
        'Настройте RBAC: ServiceAccount с минимальными правами',
        'Создайте Network Policy: deny-all + allow только необходимое',
        'Напишите Deployment с полной security context конфигурацией',
        'Добавьте ResourceQuota для namespace'
      ],
      hint: 'Используйте labels на namespace для PSS, создайте Role + RoleBinding + ServiceAccount, NetworkPolicy deny-all + allow по labels.',
      expectedOutput: 'Namespace: production, PSS=restricted\nRBAC: myapp-sa с правами только на pods:get,list\nNetworkPolicy: deny-all + frontend->backend:8080 + backend->db:5432\nDeployment: non-root(1001), readOnlyRootFilesystem, drop ALL caps\nResourceQuota: max 4 CPU, 4Gi RAM, 20 pods',
      solution: '# namespace.yaml\napiVersion: v1\nkind: Namespace\nmetadata:\n  name: production\n  labels:\n    pod-security.kubernetes.io/enforce: restricted\n---\n# rbac.yaml\napiVersion: v1\nkind: ServiceAccount\nmetadata:\n  name: myapp-sa\n  namespace: production\nautomountServiceAccountToken: false\n---\napiVersion: rbac.authorization.k8s.io/v1\nkind: Role\nmetadata:\n  name: myapp-role\n  namespace: production\nrules:\n  - apiGroups: [""]\n    resources: ["configmaps"]\n    verbs: ["get"]\n---\napiVersion: rbac.authorization.k8s.io/v1\nkind: RoleBinding\nmetadata:\n  name: myapp-binding\n  namespace: production\nsubjects:\n  - kind: ServiceAccount\n    name: myapp-sa\nroleRef:\n  kind: Role\n  name: myapp-role\n  apiGroup: rbac.authorization.k8s.io\n---\n# network-policy.yaml\napiVersion: networking.k8s.io/v1\nkind: NetworkPolicy\nmetadata:\n  name: deny-all\n  namespace: production\nspec:\n  podSelector: {}\n  policyTypes: [Ingress, Egress]\n---\napiVersion: networking.k8s.io/v1\nkind: NetworkPolicy\nmetadata:\n  name: allow-dns\n  namespace: production\nspec:\n  podSelector: {}\n  egress:\n    - ports:\n        - protocol: UDP\n          port: 53\n---\n# resource-quota.yaml\napiVersion: v1\nkind: ResourceQuota\nmetadata:\n  name: production-quota\n  namespace: production\nspec:\n  hard:\n    cpu: "4"\n    memory: 4Gi\n    pods: "20"',
      explanation: 'Hardening Kubernetes: PSS restricted namespace, RBAC с минимальными правами, Network Policies deny-all + whitelist, security context (non-root, read-only, drop caps), ResourceQuota для ограничения ресурсов. Каждый слой защищает от определённого класса угроз.'
    }
  ]
}
