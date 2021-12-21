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

# Architectural design overview

This project was built as a learning adventure to learn more about the micro-services architecture and to learn more about high-availability applications.

And so I've decided to build an online shopping application.
With these requirements I went on using Kubernetes for container orchestration and deployment management.

As for the services, all of them are written in TypeScript and the web services in NodeJS using [HapiJS](https://hapi.dev/).

## Data storage (Database-per-service pattern)

In order to make the services really independent from one another, each service has its own database.
However, a service database can only be accessed from it's own service, if data needs to shared to another service it's done
by sending events to the event bus.

## Communication between services (Event-driven)

Data sharing was a big problem to solve when I initially adapted a micro-service architecture, I've used [NATS streamming server](https://github.com/nats-io/nats-streaming-server) as an event bus to solve this problem, so all communication is done through events.

## Solving some concurrency problems (Optimistic Concurrency Control)

Sometimes when multiple images of the same service are running I've run into concurrency problems, for example, when sending multiple requests to update a record, they were processed in the wrong order. And so I've implemented [Optimistic concurrency control](https://en.wikipedia.org/wiki/Optimistic_concurrency_control) to all event data.

## CI/CD

On every PR made to origin **one or multiple github actions are triggred** to run depending on the changed services. They'll
run the unit and integration tests and run a linting check.

After a PR is merged to origin, it will trigger a Google cloud action to run and deploy the specific services changed on GKE.

## Resources and Inspiration

- [Stephen Grider's course on micro-services](https://www.udemy.com/course/microservices-with-node-js-and-react/)
- [Trunk based development](https://trunkbaseddevelopment.com)