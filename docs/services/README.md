# Services

### How to create a new service?

1. Create a folder under `services/` with the name of the service (in singular)
2. (optional) Copy and paste the service template under `/templates/service` to quickly bootstrap.
3. Create a Dockerfile.
4. Build and push the Docker image to the container registry.
5. Create the necessary Kubernetes deployment files under `infra/k8s`.
6. Run `skaffold dev` at the root of the project to run the whole project.

