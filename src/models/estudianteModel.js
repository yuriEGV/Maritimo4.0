const mongoose = require('mongoose');

const estudianteSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    apellido: {
        type: String,
        required: true,
    },
    edad: {
        type: Number,
        required: true,
    },
    grado: {
        type: String,
        required: true,
    },
    fechaRegistro: {
        type: Date,
        default: Date.now,
    },
});

const Estudiante = mongoose.model('Estudiante', estudianteSchema);

module.exports = Estudiante;