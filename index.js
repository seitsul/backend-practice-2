
require('dotenv').config();

const express = require('express');
const sequelize = require('./db');
require('./models/Book');

const booksRouter = require('./routes/books');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Проверка работы сервера
app.get('/', (req, res) => {
  res.status(200).send('Сервер работает!');
});

// Маршруты для работы с книгами
app.use('/books', booksRouter);

// Обработка некорректного JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: 'Некорректный JSON в теле запроса'
    });
  }

  return next(err);
});

// Подключение к БД и запуск сервера
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Подключение к PostgreSQL успешно!');

    await sequelize.sync();
    console.log('Таблицы базы данных синхронизированы!');

    app.listen(PORT, () => {
      console.log(`Сервер запущен: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Ошибка запуска сервера:', error.message);
  }
}

startServer();
