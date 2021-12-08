## E-commerce platform

Microservices architected E-commerce platform.


### Install

```bash
# Setup k8s secrets
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=132
```


### Run

```
skafold dev
```

Access MongoDB pods from external IDE by exposing, for example:
```bash
kubectl port-forward service/product-mongo-service 27017:27017
# connect though localhost:27017 on mongodb compass app

# To debug NATS streaming event data:
kubectl port-forward deployment/nats-depl 8222:8222

# TODO: Make UI with this data:
# access http://localhost:8222/streaming in a browser
# access http://localhost:8222/streaming/channelsz?subs=1 for subscriptions list
```

### CI/CD

On every PR made to origin **one or multiple github actions are triggred** to run depending on the changed services. They'll
run the unit and integration tests and run a linting check.

After a PR is merged to origin, it will trigger a Google cloud action to run and deploy the specific services changed on GKE.

## Resources and Inspiration

- Trunk based development: https://trunkbaseddevelopment.com/