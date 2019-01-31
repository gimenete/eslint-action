FROM node:10-slim

LABEL com.github.actions.name="ESLint checks"
LABEL com.github.actions.description="Lint your code with eslint in parallel to your builds"
LABEL com.github.actions.icon="code"
LABEL com.github.actions.color="yellow"

LABEL maintainer="Alberto Gimeno <gimenete@gmail.com>"

COPY lib /action/lib
ENTRYPOINT ["/action/lib/entrypoint.sh"]
