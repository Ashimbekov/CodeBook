export default {
  id: 13,
  title: 'RBAC: Role, RoleBinding, ClusterRole, ServiceAccount',
  description: 'Управление доступом в Kubernetes через Role-Based Access Control: кто может делать что с какими ресурсами',
  lessons: [
    {
      id: 1,
      title: 'Основы RBAC',
      type: 'theory',
      content: [
        { type: 'text', value: 'RBAC (Role-Based Access Control) контролирует, кто и что может делать в Kubernetes. Модель RBAC состоит из трёх компонентов: Subjects (кто), Verbs (что делать), Resources (с чем).' },
        { type: 'heading', value: 'Субъекты (Subjects)' },
        { type: 'list', items: [
          'User — человек, аутентифицированный через сертификат или OIDC',
          'Group — группа пользователей',
          'ServiceAccount — учётная запись для процессов внутри Pod'
        ]},
        { type: 'heading', value: 'Глаголы (Verbs)' },
        { type: 'list', items: [
          'get, list, watch — чтение ресурсов',
          'create — создание',
          'update, patch — обновление',
          'delete, deletecollection — удаление',
          '* — все операции'
        ]},
        { type: 'heading', value: 'Role vs ClusterRole' },
        { type: 'list', items: [
          'Role — ограничена одним namespace',
          'ClusterRole — действует на уровне всего кластера (cluster-scoped ресурсы: Node, PV, Namespace)'
        ]},
        { type: 'note', value: 'RBAC работает по принципу "запрещено по умолчанию": субъект не имеет никаких прав, пока они явно не выданы.' }
      ]
    },
    {
      id: 2,
      title: 'Role и RoleBinding',
      type: 'theory',
      content: [
        { type: 'text', value: 'Role определяет набор разрешений в namespace. RoleBinding связывает Role с субъектами (User, Group, ServiceAccount).' },
        { type: 'code', language: 'yaml', value: '# Role: разрешить читать Pod в namespace dev\napiVersion: rbac.authorization.k8s.io/v1\nkind: Role\nmetadata:\n  name: pod-reader\n  namespace: dev\nrules:\n- apiGroups: [""]          # "" - core API group (Pod, Service, ConfigMap)\n  resources: ["pods", "pods/log"]\n  verbs: ["get", "list", "watch"]\n- apiGroups: ["apps"]\n  resources: ["deployments"]\n  verbs: ["get", "list"]\n---\n# RoleBinding: дать роль пользователю jane\napiVersion: rbac.authorization.k8s.io/v1\nkind: RoleBinding\nmetadata:\n  name: jane-pod-reader\n  namespace: dev\nsubjects:\n- kind: User\n  name: jane\n  apiGroup: rbac.authorization.k8s.io\n- kind: Group\n  name: developers\n  apiGroup: rbac.authorization.k8s.io\nroleRef:\n  kind: Role\n  name: pod-reader\n  apiGroup: rbac.authorization.k8s.io' }
      ]
    },
    {
      id: 3,
      title: 'ClusterRole и ClusterRoleBinding',
      type: 'theory',
      content: [
        { type: 'text', value: 'ClusterRole и ClusterRoleBinding действуют на уровне всего кластера. Их используют для кластерных ресурсов (Node, PV) или для выдачи прав во всех namespace.' },
        { type: 'code', language: 'yaml', value: '# ClusterRole: читать Node и PV\napiVersion: rbac.authorization.k8s.io/v1\nkind: ClusterRole\nmetadata:\n  name: cluster-reader\nrules:\n- apiGroups: [""]\n  resources: ["nodes", "persistentvolumes", "namespaces"]\n  verbs: ["get", "list", "watch"]\n- apiGroups: ["storage.k8s.io"]\n  resources: ["storageclasses"]\n  verbs: ["get", "list"]\n---\n# ClusterRoleBinding\napiVersion: rbac.authorization.k8s.io/v1\nkind: ClusterRoleBinding\nmetadata:\n  name: ops-cluster-reader\nsubjects:\n- kind: Group\n  name: ops-team\n  apiGroup: rbac.authorization.k8s.io\nroleRef:\n  kind: ClusterRole\n  name: cluster-reader\n  apiGroup: rbac.authorization.k8s.io' },
        { type: 'heading', value: 'Встроенные ClusterRole' },
        { type: 'list', items: [
          'cluster-admin — полный доступ ко всему',
          'admin — полный доступ в namespace',
          'edit — может создавать/изменять ресурсы, но не Role',
          'view — только чтение'
        ]}
      ]
    },
    {
      id: 4,
      title: 'ServiceAccount',
      type: 'theory',
      content: [
        { type: 'text', value: 'ServiceAccount — учётная запись для процессов внутри Pod. Используется когда Pod нужно обращаться к Kubernetes API (CI/CD, операторы, мониторинг).' },
        { type: 'code', language: 'yaml', value: '# Создать ServiceAccount\napiVersion: v1\nkind: ServiceAccount\nmetadata:\n  name: app-service-account\n  namespace: default\n---\n# Дать права через RoleBinding\napiVersion: rbac.authorization.k8s.io/v1\nkind: RoleBinding\nmetadata:\n  name: app-sa-binding\n  namespace: default\nsubjects:\n- kind: ServiceAccount\n  name: app-service-account\n  namespace: default\nroleRef:\n  kind: Role\n  name: pod-reader\n  apiGroup: rbac.authorization.k8s.io\n---\n# Использовать ServiceAccount в Pod\napiVersion: v1\nkind: Pod\nmetadata:\n  name: my-app\nspec:\n  serviceAccountName: app-service-account\n  containers:\n  - name: app\n    image: my-app:latest' },
        { type: 'note', value: 'Каждый Pod автоматически монтирует токен default ServiceAccount. Для безопасности добавьте automountServiceAccountToken: false в Pod или ServiceAccount если API доступ не нужен.' }
      ]
    },
    {
      id: 5,
      title: 'Проверка прав и отладка RBAC',
      type: 'theory',
      content: [
        { type: 'text', value: 'kubectl auth can-i позволяет проверить, есть ли у субъекта определённое разрешение.' },
        { type: 'code', language: 'bash', value: '# Проверить свои права\nkubectl auth can-i get pods\nkubectl auth can-i create deployments --namespace dev\nkubectl auth can-i "*" "*"  # всё?\n\n# Проверить права другого пользователя\nkubectl auth can-i get pods --as jane\nkubectl auth can-i get pods --as system:serviceaccount:default:my-sa\n\n# Просмотр ролей\nkubectl get roles -A\nkubectl get clusterroles | grep -v system:\nkubectl describe role pod-reader -n dev\n\n# Кто имеет привязки к роли\nkubectl get rolebindings -A\nkubectl describe rolebinding jane-pod-reader -n dev\n\n# Проверить права ServiceAccount\nkubectl auth can-i list pods \\\n  --as=system:serviceaccount:default:app-service-account' },
        { type: 'tip', value: 'Используйте kubectl-who-can (плагин) для проверки кто может делать определённые действия: kubectl-who-can get pods. Установка: kubectl krew install who-can.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Настройка RBAC для команды',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте ролевую модель для команды разработки: ReadOnly для тестеров и полный доступ для разработчиков в namespace dev.',
      requirements: [
        'Создать namespace dev',
        'Создать Role для readonly доступа к Pod, Deployment, Service',
        'Создать Role для полного доступа в namespace',
        'Создать ServiceAccount для CI/CD с правами деплоя',
        'Проверить права через kubectl auth can-i'
      ],
      hint: 'Для CI/CD ServiceAccount нужны права: get/list/create/update/patch для deployments и pods. kubectl auth can-i --as=system:serviceaccount:namespace:sa-name позволяет тестировать права.',
      solution: '# rbac-setup.yaml\napiVersion: v1\nkind: Namespace\nmetadata:\n  name: dev\n---\n# ReadOnly Role для тестеров\napiVersion: rbac.authorization.k8s.io/v1\nkind: Role\nmetadata:\n  name: dev-reader\n  namespace: dev\nrules:\n- apiGroups: [""]\n  resources: ["pods", "pods/log", "services", "configmaps"]\n  verbs: ["get", "list", "watch"]\n- apiGroups: ["apps"]\n  resources: ["deployments", "replicasets"]\n  verbs: ["get", "list", "watch"]\n---\n# Developer Role\napiVersion: rbac.authorization.k8s.io/v1\nkind: Role\nmetadata:\n  name: dev-developer\n  namespace: dev\nrules:\n- apiGroups: [""]\n  resources: ["pods", "pods/log", "pods/exec", "services", "configmaps", "secrets"]\n  verbs: ["*"]\n- apiGroups: ["apps"]\n  resources: ["deployments", "replicasets"]\n  verbs: ["*"]\n---\n# CI/CD ServiceAccount\napiVersion: v1\nkind: ServiceAccount\nmetadata:\n  name: cicd-sa\n  namespace: dev\n---\n# CI/CD Role\napiVersion: rbac.authorization.k8s.io/v1\nkind: Role\nmetadata:\n  name: cicd-deployer\n  namespace: dev\nrules:\n- apiGroups: ["apps"]\n  resources: ["deployments"]\n  verbs: ["get", "list", "create", "update", "patch"]\n- apiGroups: [""]\n  resources: ["services", "configmaps"]\n  verbs: ["get", "list", "create", "update", "patch"]\n---\napiVersion: rbac.authorization.k8s.io/v1\nkind: RoleBinding\nmetadata:\n  name: cicd-binding\n  namespace: dev\nsubjects:\n- kind: ServiceAccount\n  name: cicd-sa\n  namespace: dev\nroleRef:\n  kind: Role\n  name: cicd-deployer\n  apiGroup: rbac.authorization.k8s.io\n\nkubectl apply -f rbac-setup.yaml\n\n# Проверить права\nkubectl auth can-i get pods -n dev --as system:serviceaccount:dev:cicd-sa\nkubectl auth can-i delete pods -n dev --as system:serviceaccount:dev:cicd-sa\nkubectl auth can-i get nodes --as system:serviceaccount:dev:cicd-sa\n\n# Список всех прав\nkubectl auth can-i --list -n dev --as system:serviceaccount:dev:cicd-sa',
      explanation: 'RBAC следует принципу наименьших привилегий: даём только необходимые права. Role ограничена namespace. RoleBinding связывает роль с субъектом. ServiceAccount для CI/CD получает только права для деплоя, не больше. kubectl auth can-i позволяет проверить права без применения.'
    }
  ]
}
