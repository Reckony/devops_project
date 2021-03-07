# 1. Wybieramy oraz bazowy
FROM alpine:latest

# 2. Instalujemy w nim zależności
RUN apk add --update redis
# ...

# 3. Ustawienie procesu głównego
CMD redis-server
