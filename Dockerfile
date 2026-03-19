FROM node:18-alpine

WORKDIR /app

# Instala dependências de forma reprodutível
COPY app/package*.json ./
RUN npm ci --omit=dev

COPY app ./

# Usuário não-root (melhora segurança)
RUN addgroup -S app && adduser -S -G app -u 10001 app \
  && chown -R app:app /app

USER 10001

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]