// autorController.js

const db = require('./db'); // Importa la conexión a PostgreSQL

// ----------------------
// C - CREATE (Crear Autor)
// ----------------------
exports.crearAutor = async (req, res) => {
    const { nombre, nacionalidad } = req.body;

    const sql = `INSERT INTO autor (nombre, nacionalidad) VALUES ($1, $2) RETURNING id`;

    try {
        const result = await db.query(sql, [nombre, nacionalidad]);
        res.status(201).json({
            mensaje: 'Autor creado exitosamente',
            id: result.rows[0].id,
            autor: { nombre, nacionalidad }
        });
    } catch (error) {
        console.error("Error al crear autor:", error);
        res.status(500).json({ mensaje: 'Error interno del servidor al crear autor', error: error.message });
    }
};

// ----------------------
// R - READ (Leer Autores)
// ----------------------
exports.obtenerAutores = async (req, res) => {
    const sql = `SELECT id, nombre, nacionalidad, fecha_creacion FROM autor ORDER BY id DESC`;

    try {
        const result = await db.query(sql);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error al obtener autores:", error);
        res.status(500).json({ mensaje: 'Error interno del servidor al obtener autores', error: error.message });
    }
};

// ----------------------
// R - READ (Leer Autor por ID)
// ----------------------
exports.obtenerAutorPorId = async (req, res) => {
    const { id } = req.params;

    const sql = `SELECT id, nombre, nacionalidad, fecha_creacion FROM autor WHERE id = $1`;

    try {
        const result = await db.query(sql, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Autor no encontrado' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error al obtener autor:", error);
        res.status(500).json({ mensaje: 'Error interno del servidor al obtener autor', error: error.message });
    }
};

// ----------------------
// U - UPDATE (Actualizar Autor)
// ----------------------
exports.actualizarAutor = async (req, res) => {
    const { id } = req.params;
    const { nombre, nacionalidad } = req.body;

    const sql = `UPDATE autor SET nombre = $1, nacionalidad = $2 WHERE id = $3`;

    try {
        const result = await db.query(sql, [nombre, nacionalidad, id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ mensaje: 'Autor no encontrado para actualizar' });
        }

        res.status(200).json({ mensaje: 'Autor actualizado exitosamente', id: id });
    } catch (error) {
        console.error("Error al actualizar autor:", error);
        res.status(500).json({ mensaje: 'Error interno del servidor al actualizar autor', error: error.message });
    }
};

// ----------------------
// D - DELETE (Eliminar Autor)
// ----------------------
exports.eliminarAutor = async (req, res) => {
    const { id } = req.params;

    const sql = `DELETE FROM autor WHERE id = $1`;

    try {
        const result = await db.query(sql, [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ mensaje: 'Autor no encontrado para eliminar' });
        }

        res.status(200).json({ mensaje: 'Autor eliminado exitosamente', id: id });
    } catch (error) {
        console.error("Error al eliminar autor:", error);
        res.status(500).json({ mensaje: 'Error interno del servidor al eliminar autor', error: error.message });
    }
};
