FROM denoland/deno

ARG GIT_REVISION
ENV DENO_DEPLOYMENT_ID=${GIT_REVISION}

WORKDIR /app

COPY deno.json deno.lock ./
RUN deno install

COPY . .
RUN deno task build

EXPOSE 8000

CMD ["deno", "task", "start"]
