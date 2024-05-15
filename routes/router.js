import express from 'express';
import fs from 'fs';
import url from 'url';
import path from 'path';

const router = express.Router();
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

router.get('/agregar', (req, res) => {
    const { nombre, precio } = req.query;

    if (!nombre || !precio) {
        return res.send('Ingrese Nombre y Precio del Deporte.');
    }

    if (isNaN(parseFloat(precio))) {
        return res.send('El Precio debe ser un número.');
    }

    fs.readFile('./data/deportes.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error interno del servidor');
        }
        let deportes = JSON.parse(data);

        if (deportes.some(deporte => deporte.nombre === nombre)) {
            return res.send(`El Deporte ${nombre} ya existe.`);
        }

        deportes.push({ nombre, precio });

        fs.writeFile('./data/deportes.json', JSON.stringify(deportes), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error interno del servidor');
            }
            res.send(`El Deporte ${nombre} con un Precio de ${precio} se agregó exitosamente.`);
        });
    });
});

router.get('/deportes', (req, res) => {
    fs.readFile('./data/deportes.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.send('Error interno del servidor');
        }
        res.json({ deportes: JSON.parse(data) });
    });
})

router.get('/editar', (req, res) => {
    const { nombre, precio } = req.query;

    if (!nombre || !precio) {
        return res.send('Ingrese Nombre del Deporte para editar su Precio');
    }

    fs.readFile('./data/deportes.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error interno del servidor');
        }
        let deportes = JSON.parse(data);

        const index = deportes.findIndex(deporte => deporte.nombre === nombre);
        if (index === -1) {
            return res.send('No se encontró Deporte con ese nombre.');
        }
        deportes[index].precio = precio;

        fs.writeFile('./data/deportes.json', JSON.stringify(deportes), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error interno del servidor');
            }
            res.send(`El Precio del Deporte ${nombre} se actualizó a ${precio}.`);
        });
    });
});

router.get('/eliminar/:nombre', (req, res) => {
    const nombre = req.params.nombre;

    fs.readFile('./data/deportes.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error interno del servidor');
        }

        let deportes = JSON.parse(data);

        const deporteIndex = deportes.findIndex(d => d.nombre === nombre);

        if (deporteIndex !== -1) {
            deportes.splice(deporteIndex, 1);

            fs.writeFile('./data/deportes.json', JSON.stringify(deportes), (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error interno del servidor');
                }
                res.send('Deporte eliminado exitosamente');
            });
        } else {
            res.send('Deporte no encontrado');
        }
    });
});

router.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

export default router;
