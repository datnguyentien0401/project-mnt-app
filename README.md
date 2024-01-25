## Development

navigate to the root directory of project
```bash
cd /your/path/to/project-mnt-app
```

Install nvm:

Follow [the official instruction](https://github.com/nvm-sh/nvm#installing-and-updating).

Install Node.js (at project root):

```bash
nvm install
```

Install [Yarn v1](https://classic.yarnpkg.com/lang/en/):

```bash
npm install --global yarn
```

Install dependencies:

```bash
yarn install
```
### Local 
Run
```bash
yarn dev
```

Build
```bash
yarn build
```

Start
```bash
yarn start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Production
Config environment variables
```bash
cd env
```
```bash
nano real.env
```
edit file real.env
```bash
NEXT_PUBLIC_APP_URL=your_app_url
NEXT_PUBLIC_API_URL=your_be_api_url
```

Run
```bash
yarn dev:prod
```

Build
```bash
yarn build:prod
```

Start
```bash
yarn start
```


