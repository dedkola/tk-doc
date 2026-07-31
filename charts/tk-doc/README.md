# tk-doc Helm Chart

A Helm chart for deploying [TK Doc](https://github.com/dedkola/tk-doc) — a modern, high-performance documentation platform built with Next.js.

## Prerequisites

- Kubernetes 1.28+
- Helm 3.10+
- For the default network setup: NGINX Ingress Controller with a reachable
  address (for example, MetalLB on k3s)

## Installing the Chart

Add the repository and install the chart:

```bash
helm repo add tk-doc https://dedkola.github.io/tk-doc

helm install tk-doc tk-doc/tk-doc \
  --namespace tk-doc \
  --create-namespace
```

That is the complete default installation. It pulls the public multi-platform
`ghcr.io/dedkola/tk-doc:latest` image, creates the namespace, and exposes the
application through the `nginx` IngressClass without requiring a hostname or
registry secret. Successful builds from the repository's `main` branch publish
the `latest` image for both `linux/amd64` and `linux/arm64`.

If the `tk-doc` repository was already added earlier, refresh its chart index
before installing:

```bash
helm repo update tk-doc
```

## Configuration

See [`values.yaml`](values.yaml) for the full list of configurable values.

### k3s with NGINX Ingress + MetalLB (no domain)

The default values expose the app on the NGINX Ingress IP with no domain:

```bash
helm install tk-doc tk-doc/tk-doc \
  --namespace tk-doc \
  --create-namespace
```

Then get the ingress IP:

```bash
kubectl get svc ingress-nginx-controller -n ingress-nginx \
  -o jsonpath="{.status.loadBalancer.ingress[0].ip}"
echo
# open http://<that-ip>
```

### With a custom domain and TLS

```bash
helm install tk-doc tk-doc/tk-doc \
  --namespace tk-doc \
  --create-namespace \
  --set 'ingress.hosts[0].host=docs.example.com' \
  --set 'ingress.hosts[0].paths[0].path=/' \
  --set 'ingress.hosts[0].paths[0].pathType=Prefix' \
  --set 'ingress.hosts[0].paths[0].servicePort=80' \
  --set 'ingress.tls[0].secretName=docs-tls' \
  --set 'ingress.tls[0].hosts[0]=docs.example.com'
```

## Upgrading

```bash
helm repo update
helm upgrade tk-doc tk-doc/tk-doc --namespace tk-doc
```

Because the default tag is `latest`, recreate the pod after publishing a new
image under the same tag:

```bash
kubectl rollout restart deployment/tk-doc --namespace tk-doc
kubectl rollout status deployment/tk-doc --namespace tk-doc
```

For reproducible production deployments, set an immutable image tag instead:

```bash
helm upgrade tk-doc tk-doc/tk-doc \
  --namespace tk-doc \
  --set image.tag=<immutable-image-tag>
```

## Uninstalling

```bash
helm uninstall tk-doc --namespace tk-doc
```

## Notes

- The default image is public and does not require an image pull secret.
- Ingress is enabled by default with class `nginx`, no hostname, and no TLS.
- If you configure a private image, set `imagePullSecrets` to an existing secret.
- The included `ConfigMap` sets `NODE_ENV=production` and `DOCKER_BUILD=true`.
