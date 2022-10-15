"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const pg_1 = __importDefault(require("pg"));
const Pool = pg_1.default.Pool;
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mydb',
    password: '123456',
    port: 5432,
});
const PORT = 3000;
const app = (0, express_1.default)();
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.post('/add/user', async (req, res) => {
    try {
        const { name, email } = req.body;
        const data = await pool.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *', [name, email]);
        res.status(200).json({ user: data.rows[0] });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({
            status: "fail",
            code: 500,
            data: "Add user error",
        });
    }
});
app.get('/get/users', async (req, res) => {
    try {
        const data = await pool.query('SELECT * FROM users ORDER BY id ASC');
        res.status(200).json({ users: data.rows });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
});
app.get('/get/user/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const data = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        res.status(200).json({ user: data.rows });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
});
app.put('/update/user', async (req, res) => {
    try {
        const { id, name, email } = req.body;
        const data = await pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *', [name, email, id]);
        res.status(200).json({ user: data.rows[0] });
    }
    catch (err) {
        return res.status(500).send({
            status: "fail",
            code: 500,
            data: "Update user error",
        });
    }
});
app.delete('/delete/user/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const data = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
        res.status(200).json({ user: data.rows[0] });
    }
    catch (err) {
        res.send({
            status: "fail",
            code: 500
        });
    }
});
app.listen(PORT, () => {
    console.log("App running with port: " + PORT);
});
//# sourceMappingURL=index.js.map