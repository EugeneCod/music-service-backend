# Music-service-backend 

## :scroll: Описание

- API для проекта [Music-service](https://github.com/EugeneCod/Music-service-frontend) разработанное на фреймворке NestJS, 
включающее в себя NoSQL на базе СУБД MongoDB, логику записи аудиофайлов и изображений на сервер, а также поиск, удаление, изменение счетчика прослушиваний у имеющихся аудиофайлов.

## :toolbox: В работе применяются:

- NodeJS
- фреймворк NestJS

## :computer: Как развернуть проект

1. Клонировать репозиторий.
2. Установить необходимые зависимости (`npm install`)
3. Создать в корне проекта файл .env и внести в него необходимые переменые окружения:

Для примера:
- PORT= "5000"
- MONGO_URL= "mongodb://localhost:27017/music-platform"

