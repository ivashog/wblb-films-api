# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.0.0](https://bitbucket.org/ivashog/wblb-films-api/compare/v1.0.1...v2.0.0) (2020-09-09)


### ⚠ BREAKING CHANGES

* migrate to nestjs v7, upgrade all deps to latest versions

### Features

* **exceptions:** add global prisma exceptions filter ([015d2f3](https://bitbucket.org/ivashog/wblb-films-api/commit/015d2f3c384a78b17e2559b5444b900de7265a13))


### CI, Deployment and Configuration

* add docker support ([c12cf65](https://bitbucket.org/ivashog/wblb-films-api/commit/c12cf65c938071310abcc31a6dd2942ba216c86a))


### Build System and Development

* **changelog:** add conventional commits support for changelog auto generation ([58d06ac](https://bitbucket.org/ivashog/wblb-films-api/commit/58d06ac71adbddd1944f7ae9bff4d931ee193683))
* **config:** fix package.json scripts for running prisma-cli commands ([916507f](https://bitbucket.org/ivashog/wblb-films-api/commit/916507f32f8dc892a98b8a0036f55e5ca028eb9f))
* **db:** add fake films seed ([989ef6a](https://bitbucket.org/ivashog/wblb-films-api/commit/989ef6ac482817b2d17e292afe7d84d4e06e21ed))
* improve prisma seeder ([3ad54b1](https://bitbucket.org/ivashog/wblb-films-api/commit/3ad54b18c336a2eac9897872d94ad65b852f87ea))
* **changelog:** add standard-version configuration ([047748c](https://bitbucket.org/ivashog/wblb-films-api/commit/047748ca77451af9e1ee97d780669e90091bba3e))
* **database:** add prisma2 support ([272efee](https://bitbucket.org/ivashog/wblb-films-api/commit/272efeee4c3c5052489c910f22c82ba4fbf9d024))
* **db:** create base prisma db seeder util ([1742a43](https://bitbucket.org/ivashog/wblb-films-api/commit/1742a432dc06b636dcec0ccdcae062cfb0a334de))


### Refactoring

* **db:** refactor db schema, update docs ([c7f634a](https://bitbucket.org/ivashog/wblb-films-api/commit/c7f634aef226c65f49a6f9f1c3fdbd944cb95438))
* delete unused typeorm code and dependencies ([ebccfbe](https://bitbucket.org/ivashog/wblb-films-api/commit/ebccfbe9ee8fefae9e9ed1b46e1f8c935653fc0a))
* **db:** add unique for film format name ([a82952a](https://bitbucket.org/ivashog/wblb-films-api/commit/a82952a292bbf82f568dd208ffda456d7d5094f3))
* **db:** fix actors-to-films relation name ([03e5245](https://bitbucket.org/ivashog/wblb-films-api/commit/03e5245824ac16a523bd4c9ac1a046911063edda))
* **film service:** full refactor get film list functionality on prisma client ([64bf77f](https://bitbucket.org/ivashog/wblb-films-api/commit/64bf77f15de3e668a05ecd14619a51c59784b449))
* **film service:** refactor create one film functionality on prisma client ([1fa08db](https://bitbucket.org/ivashog/wblb-films-api/commit/1fa08db7fa5e7e0851267a3d07911580371f195a))
* **film service:** refactor delete film functionality on prisma client, add custom exceptions ([8462d56](https://bitbucket.org/ivashog/wblb-films-api/commit/8462d56b68001d269938f02622c273681b9f82dd))
* **film service:** refactor get one film functionality on prisma client ([6b1f0d6](https://bitbucket.org/ivashog/wblb-films-api/commit/6b1f0d63afc9cbdb77246c9df594af224d6463b7))
* **film service:** refactor import films from file functionality ([2293dbc](https://bitbucket.org/ivashog/wblb-films-api/commit/2293dbc33cc02e2171944e204fc6d307c2bb5e1f))
* **film service:** refactor search film functionality on prisma service ([bd00014](https://bitbucket.org/ivashog/wblb-films-api/commit/bd000149836a59e98438a8bf0a0e5756c1dca298))
* **logging:** refactor simple stdout logger interceptor ([53b6454](https://bitbucket.org/ivashog/wblb-films-api/commit/53b6454163a676f8b050360a023e964bd93efb8f))
* generate initial prisma db migration ([3bbb67b](https://bitbucket.org/ivashog/wblb-films-api/commit/3bbb67b4475e098e47c2a4b809102d6dc1af4ab7))
* migrate to latest nestjs version ([0dc1f87](https://bitbucket.org/ivashog/wblb-films-api/commit/0dc1f8765bf9bb456b6518b6578a3359d1279136))
* WIP refactor prisma schema ([9b23d65](https://bitbucket.org/ivashog/wblb-films-api/commit/9b23d65531f24fef629a00c126cd5f36d1998d3f))
* WIP work with prisma client ([67b827b](https://bitbucket.org/ivashog/wblb-films-api/commit/67b827b647e935dcbf55a8e937e42b6debf8bbbb))
