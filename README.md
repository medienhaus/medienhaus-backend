<img src="logo.svg" width="70" />

### medienhaus/

Berlin University of the Arts’ free and open-source environment for digital learning, teaching, and collaboration.

[Concept Paper](https://medienhaus.dev/) | [Twitter](https://twitter.com/medienhaus_)

<br>

# medienhaus-backend

This repository holds a minimal backend component for our **medienhaus/** landing hub, which you can find in the [medienhaus-frontend](https://github.com/medienhaus/medienhaus-frontend) repository.
The backend is written in JavaScript on top of the [NestJS framework](https://nestjs.com/).

## Development

### Installation

```bash
$ npm install
```

### Configuration

Configuration happens via environment variables. To start developing locally just copy the supplied `.env.example` file to `.env` and adjust the values of the variables to your likings.

### Running the backend

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```
