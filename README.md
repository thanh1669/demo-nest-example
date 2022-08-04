

# NestJS Example

A simple Nestjs service built with Nestjs 9, ioredis, mongoose, event-emitter and Joi.


## Author: Thanh Nguyen

- Personal profile: https://github.com/thanh1669
- Say hello: thanhlocalhost@gmail.com


## Tech stack

`Back-end`
- [NestJS 9][nestjs]
- [ioredis][ioredis] - Redis client: `set`, `get`, `job` and more.
- [mongoose][mongoose] - Database TypeOrm: `save`, `pre-hooks` and more.
- [event-emitter][@nestjs/event-emitter] - Nodejs Event: `emit`, `listent` and more.
- [Joi][joi] - Validator for JavaScript

[nestjs]: https://github.com/nestjs/nest
[nx]: https://nx.dev/
[ioredis]: https://github.com/luin/ioredis
[mongoose]: https://github.com/Automattic/mongoose
[@nestjs/event-emitter]: https://github.com/nestjs/event-emitter
[joi]: https://github.com/sideway/joi


## Structure

Below is the simplified version of the application structure.

```
.
└── root
    └── apps (dir)
    │   └── main.ts
    └── libs (dir)
        ├── demo (dir)
        │   ├── data-access (dir) - for configure service, middleware, validator logic to share across the feature
        │   ├── feature (dir) - for configure my controller forRoot modules
        │       └── demo.controller.ts (nest:controller Route handler client request)
        └── shared (dir)
            ├── auth-config (dir, authorization)
            ├── data-access (dir)
            │       └── adapters (@nestjs:lib, Adapter logics to share across the feature)
            │       └── managers (@nestjs:lib, Event-emitter listenter logic)
            │       └── entities (@nestjs:lib, Database schema to share across the feature)
            │       └── models (@nestjs:lib, Database schema to share across the feature)
            ├── enviroments (dir, replace token for environment)
            ├── persistent-config (dir, All database register)
```


## Getting Started

1. Clone My Project: `git clone https://github.com/thanh1669/demo-nest-example.git`
2. Install dependencies: `yarn install`
3. Open `http://localhost:3000/api/docs` to access the SwaggerUI
4. Set environment variables: `cp .env.example .env`
5. Running: `yarn start:dev` to start the API
6. Running Production: `yarn start:prod`
7. Building Production: `yarn build`


## Generate a Nest element

```bash
nest generate <schematics> <dir> <options>

Options:
  -d, --dry-run                      Report actions that would be taken without writing out results.
  -p, --project [project]            Project in which to generate files.
  --flat                             Enforce flat structure of generated element.
  --no-flat                          Enforce that directories are generated.
  --spec                             Enforce spec files generation. (default: true)
  --skip-import                      Skip importing (default: false)
  --no-spec                          Disable spec files generation.
  -c, --collection [collectionName]  Schematics collection to use.
  
Schematics:
┌───────────────┬─────────────┬──────────────────────────────────────────────┐
    │ name          │ alias       │ description                                  │
    │ application   │ application │ Generate a new application workspace         │
    │ class         │ cl          │ Generate a new class                         │
    │ configuration │ config      │ Generate a CLI configuration file            │
    │ controller    │ co          │ Generate a controller declaration            │
    │ decorator     │ d           │ Generate a custom decorator                  │
    │ filter        │ f           │ Generate a filter declaration                │
    │ gateway       │ ga          │ Generate a gateway declaration               │
    │ guard         │ gu          │ Generate a guard declaration                 │
    │ interceptor   │ itc         │ Generate an interceptor declaration          │
    │ interface     │ itf         │ Generate an interface                        │
    │ middleware    │ mi          │ Generate a middleware declaration            │
    │ module        │ mo          │ Generate a module declaration                │
    │ pipe          │ pi          │ Generate a pipe declaration                  │
    │ provider      │ pr          │ Generate a provider declaration              │
    │ resolver      │ r           │ Generate a GraphQL resolver declaration      │
    │ service       │ s           │ Generate a service declaration               │
    │ library       │ lib         │ Generate a new library within a monorepo     │
    │ sub-app       │ app         │ Generate a new application within a monorepo │
    │ resource      │ res         │ Generate a new CRUD resource          
```


## Create a Library Example

``` bash
# 1. Check file generator
nest generate lib demo/feature --flat --dry-run

# 2. Add to project
nest generate lib demo/feature --flat

# 3. Import to apps/app.module
@Module({
    imports: [FeatureDemoModule]
})

# 4. Run project
yarn start:dev
```
