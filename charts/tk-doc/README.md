# tk-doc Helm Chart

A Helm chart for deploying [TK Doc](https://github.com/dedkola/tk-doc) — a modern, high-performance documentation platform built with Next.js.

## Prerequisites

- Kubernetes 1.28+
- Helm 3.10+
- Access to the container image (`ghcr.io/dedkola/tk-doc` by default)

## Installing the Chart

Add the repository and install the chart:

```bash
helm repo add tk-doc https://dedkola.github.io/tk-doc
helm repo update

helm install tk-doc tk-doc/tk-doc \
  --namespace tk-doc \
  --create-namespace \
  --set image.tag=<your-image-tag>
```

## Configuration

See [`values.yaml`](values.yaml) for the full list of configurable values.

### Common overrides

```bash
helm install tk-doc tk-doc/tk-doc \
  --set image.tag=20260403082301-1afe339 \
  --set ingress.enabled=true \
  --set ingress.hosts[0].host=docs.example.com \
  --set ingress.tls[0].secretName=docs-tls \
  --set ingress.tls[0].hosts[0]=docs.example.com
```

## Upgrading

```bash
helm upgrade tk-doc tk-doc/tk-doc \
  --set image.tag=<new-image-tag>
```

## Uninstalling

```bash
helm uninstall tk-doc --namespace tk-doc
```

## Notes

- The default image tag is the chart `appVersion`. Override `image.tag` with an existing image tag, e.g. `--set image.tag=20260403082301-1afe339`.
- Ingress is disabled by default. Enable it with `--set ingress.enabled=true` and configure your own host and TLS.
- If your registry is private, configure `imagePullSecrets`.
- The included `ConfigMap` sets `NODE_ENV=production` and `DOCKER_BUILD=true`.
