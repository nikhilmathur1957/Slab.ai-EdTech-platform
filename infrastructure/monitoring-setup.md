# Monitoring & Observability Setup

## Prometheus + Grafana Stack
```bash
# Install kube-prometheus-stack
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack -n monitoring
CloudWatch Metrics
Container Insights for EKS
Application Load Balancer metrics
EBS volume metrics
Alerting Rules
Pod crash loops
High memory usage (>80%)
Node disk pressure
API latency >300ms p95
Grafana Dashboards
Application SLO dashboard
Infrastructure health
Business metrics (leads, conversions)
