FROM node:14

LABEL com.github.actions.name="ESLint Action"
LABEL com.github.actions.description="Lint your Javascript projects with inline lint error annotations on pull requests."
LABEL com.github.actions.icon="code"
LABEL com.github.actions.color="yellow"
RUN apt install make gcc g++ python git
COPY lib /action/lib
ENTRYPOINT ["/action/lib/entrypoint.sh"]
