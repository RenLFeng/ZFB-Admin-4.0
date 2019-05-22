FROM yarn:latest AS DEP
COPY yarn.lock /usr/app/yarn.lock
COPY package.json /usr/app/package.json
WORKDIR /usr/app
RUN yarn

FROM vue:latest AS HTML
COPY --from=DEP /usr/app/node_modules /usr/app/node_modules
COPY src /usr/app/src
COPY public /usr/app/public
COPY package.json /usr/app/package.json
COPY babel.config.js /usr/app/babel.config.js
COPY .env /usr/app/.env
WORKDIR /usr/app
RUN yarn run build

FROM nginx:latest
COPY --from=HTML /usr/app/dist/ /usr/share/nginx/html
EXPOSE 80