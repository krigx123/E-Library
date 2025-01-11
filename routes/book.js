const express = require("express");
const router = express.Router();
const { books } = require("../src/data/books");

// Endpoint to update book status
router.post("/update-status", (req, res) => {
    const { isbn, status } = req.body;

    const book = books.find((b) => b.isbn === isbn);
    if (book) {
        book.status = status;
        return res.status(200).json({ message: "Book status updated", book });
    }

    res.status(404).json({ message: "Book not found" });
});

module.exports = router;
