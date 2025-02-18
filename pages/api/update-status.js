import { books } from "../../src/data/books"; // Adjust the path as necessary

export default function handler(req, res) {
    console.log(req.body);
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { isbn, status } = req.body;

    if (!isbn || !status) {
        return res.status(400).json({ error: "Missing 'isbn' or 'status' in request body" });
    }

    const book = books.find((b) => b.isbn === isbn);

    if (book) {
        book.status = status;
        return res.status(200).json({ message: "Book status updated", book });
    }

    return res.status(404).json({ error: "Book not found" });
}
