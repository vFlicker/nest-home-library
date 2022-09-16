# Home Library Service

## Downloading

```
git clone {repository URL}
```

## Installing NPM modules

```
npm install
```

## Running application

### Build

```
npm run docker:build
```

### Create migrate after starting the application (write in new terminal)

```
npx prisma migrate dev
```

### Start container

```
npm run docker:start
```

### Stop container

```
npm run docker:stop
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/

For more information about OpenAPI/Swagger please visit https://swagger.io/

## Testing

```
npm run test
```

## Auto-fix and format

```
npm run lint
```

```
npm run format
```
