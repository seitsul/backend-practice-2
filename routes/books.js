
const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// GET /books — получить все книги
router.get('/', async (req, res) => {
  try {
    const books = await Book.findAll();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения книг' });
  }
});

// GET /books/:id — получить одну книгу
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: 'Некорректный ID' });
    }

    const book = await Book.findByPk(id);

    if (!book) {
      return res.status(404).json({ error: 'Книга не найдена' });
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения книги' });
  }
});

// POST /books — создать книгу
router.post('/', async (req, res) => {
  try {
    const { title, author, year } = req.body;

    if (!title || !author) {
      return res.status(400).json({
        error: 'Название и автор обязательны'
      });
    }

    if (
      year !== undefined &&
      year !== null &&
      (!Number.isInteger(year) || year < 1)
    ) {
      return res.status(400).json({ error: 'Некорректный год' });
    }

    const book = await Book.create({ title, author, year });
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка создания книги' });
  }
});

// PUT /books/:id — обновить книгу
router.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, author, year } = req.body;

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: 'Некорректный ID' });
    }

    if (!title || !author) {
      return res.status(400).json({
        error: 'Название и автор обязательны'
      });
    }

    if (
      year !== undefined &&
      year !== null &&
      (!Number.isInteger(year) || year < 1)
    ) {
      return res.status(400).json({ error: 'Некорректный год' });
    }

    const book = await Book.findByPk(id);

    if (!book) {
      return res.status(404).json({ error: 'Книга не найдена' });
    }

    await book.update({ title, author, year });
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка обновления книги' });
  }
});

// DELETE /books/:id — удалить книгу
router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: 'Некорректный ID' });
    }

    const book = await Book.findByPk(id);

    if (!book) {
      return res.status(404).json({ error: 'Книга не найдена' });
    }

    await book.destroy();
    res.status(200).json({ message: 'Книга удалена' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка удаления книги' });
  }
});

module.exports = router;
