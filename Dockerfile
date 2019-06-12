### STAGE 1: Build ###
FROM node:10-alpine as builder
# Set environment variables
ENV NPM_CONFIG_LOGLEVEL="warn" \
  NODE_ENV="production" \
  REACT_APP_ENVIRONMENT="production"

#RUN apk add --no-cache \
#      chromium@edge \
#      nss@edge \
#			git bash openssh

# use changes to package.json to force Docker not to use the cache
# when we change our application's nodejs dependencies:
COPY package.json /tmp/package.json
COPY package-lock.json /tmp/package-lock.json
COPY .npmrc /tmp/.npmrc

RUN cd /tmp && npm ci

WORKDIR /usr/src/app
RUN cp -a /tmp/node_modules .

# Build frontend
# -------------------

# Copy required stuff
COPY . .

# Build client
RUN npm run build

### STAGE 2: Setup ###
FROM nginx:1.13.3-alpine

## Copy our default nginx config
COPY nginx/run.sh nginx/nginx.template /etc/nginx/
WORKDIR /etc/nginx

RUN chmod +x ./run.sh

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

## From ‘builder’ stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=builder /usr/src/app/build /usr/share/nginx/html

ENTRYPOINT [ "/etc/nginx/run.sh" ]