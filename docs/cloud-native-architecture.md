# Cloud-Native Architecture Guide

## 1. High-Level Cloud-Native Architecture

```mermaid
graph TB
    Users([Users/Clients])
    CDN[CDN / Edge Cache]
    LB[Load Balancer]
    GW[API Gateway]

    subgraph Service Mesh
        SvcA[Service A<br/>Users]
        SvcB[Service B<br/>Orders]
        SvcC[Service C<br/>Payments]
        SvcD[Service D<br/>Notifications]
    end

    subgraph Data Layer
        DB1[(SQL DB)]
        DB2[(NoSQL DB)]
        Cache[(Redis Cache)]
        Queue[[Message Queue<br/>Kafka / SQS]]
        S3[(Object Storage<br/>S3 / GCS)]
    end

    subgraph Observability
        Logs[Logging<br/>ELK / CloudWatch]
        Metrics[Metrics<br/>Prometheus / Grafana]
        Traces[Tracing<br/>OpenTelemetry]
    end

    Users --> CDN --> LB --> GW
    GW --> SvcA
    GW --> SvcB
    GW --> SvcC
    SvcA --> DB1
    SvcB --> DB2
    SvcB --> Cache
    SvcC --> Queue
    Queue --> SvcD
    SvcD --> S3

    SvcA -.-> Logs
    SvcB -.-> Metrics
    SvcC -.-> Traces
```

## 2. CI/CD Pipeline

```mermaid
flowchart LR
    Dev[Developer<br/>Git Push] --> Build[Build<br/>Container Image]
    Build --> Test[Run Tests<br/>Unit + Integration]
    Test --> Scan[Security Scan<br/>Trivy / Snyk]
    Scan --> Registry[Push to<br/>Container Registry]
    Registry --> Staging[Deploy to<br/>Staging]
    Staging --> Approve{Manual<br/>Approval?}
    Approve -->|Yes| Prod[Deploy to<br/>Production]
    Approve -->|No| Dev
    Prod --> Monitor[Monitor<br/>& Alert]
    Monitor -->|Issue| Rollback[Auto<br/>Rollback]
```

## 3. Kubernetes Pod Lifecycle

```mermaid
flowchart TD
    Deploy[Deployment Created] --> RS[ReplicaSet Created]
    RS --> Pod1[Pod 1]
    RS --> Pod2[Pod 2]
    RS --> Pod3[Pod 3]

    Pod1 --> HC{Health<br/>Check}
    HC -->|Healthy| Serve[Serve Traffic]
    HC -->|Unhealthy| Restart[Restart Pod]
    Restart --> HC

    HPA[Horizontal Pod<br/>Autoscaler] -->|Scale Up| RS
    HPA -->|Scale Down| RS

    Serve --> Svc[Kubernetes<br/>Service]
    Svc --> Ingress[Ingress<br/>Controller]
    Ingress --> Users([Users])
```

## 4. The 12-Factor App Principles

```mermaid
mindmap
  root((Cloud Native<br/>12-Factor App))
    Codebase
      One repo per service
      Tracked in Git
    Dependencies
      Explicitly declared
      Isolated per service
    Config
      Stored in env vars
      Never in code
    Backing Services
      Treat as attached resources
      DB, Cache, Queue
    Build Release Run
      Strict separation
      Immutable releases
    Processes
      Stateless
      Share-nothing
    Port Binding
      Self-contained
      Export via port
    Concurrency
      Scale out via processes
      Horizontal scaling
    Disposability
      Fast startup
      Graceful shutdown
    Dev/Prod Parity
      Keep environments similar
      Same backing services
    Logs
      Treat as event streams
      Stdout/Stderr
    Admin Processes
      Run as one-off tasks
      Same environment
```

## 5. Migration Path: Monolith to Cloud-Native

```mermaid
flowchart LR
    subgraph Phase 1
        M[Monolith] --> C[Containerize<br/>Monolith]
    end

    subgraph Phase 2
        C --> S1[Extract<br/>Service 1]
        C --> S2[Extract<br/>Service 2]
        C --> Core[Remaining<br/>Monolith]
    end

    subgraph Phase 3
        S1 --> K8s[Deploy on<br/>Kubernetes]
        S2 --> K8s
        Core --> S3[Extract<br/>Service 3]
        Core --> S4[Extract<br/>Service 4]
        S3 --> K8s
        S4 --> K8s
    end

    subgraph Phase 4
        K8s --> SM[Add Service Mesh]
        SM --> Obs[Add Observability]
        Obs --> Auto[Auto-scaling<br/>& Self-healing]
    end
```

## 6. Cloud-Native Security (Zero Trust)

```mermaid
flowchart TB
    Ext([External Traffic]) --> WAF[WAF / DDoS Protection]
    WAF --> GW[API Gateway<br/>Auth + Rate Limit]
    GW --> mTLS{mTLS via<br/>Service Mesh}

    mTLS --> SvcA[Service A]
    mTLS --> SvcB[Service B]

    SvcA --> IAM[IAM / RBAC<br/>Least Privilege]
    SvcB --> IAM

    IAM --> Secrets[Secrets Manager<br/>Vault / AWS SM]
    IAM --> Encrypt[(Encrypted<br/>Data at Rest)]

    subgraph Continuous Security
        SAST[Static Analysis]
        DAST[Dynamic Testing]
        Audit[Audit Logs]
        Policy[Policy as Code<br/>OPA / Kyverno]
    end
```
