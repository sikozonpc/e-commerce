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


## Resources and Inspiration

- Trunk based development: https://trunkbaseddevelopment.com/