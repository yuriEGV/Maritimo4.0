import Estudiante from '../models/estudianteModel.js';

class EstudianteController {
  static async createEstudiante(req, res) {
    try {
      const tenantId = req.user.tenantId;
      const estudiante = await Estudiante.create({
        ...req.body,
        tenantId,
      });

      res.status(201).json(estudiante);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getEstudiantes(req, res) {
    try {
      const estudiantes = await Estudiante.find({
        tenantId: req.user.tenantId, // FIX
      });

      res.status(200).json(estudiantes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getEstudianteById(req, res) {
    try {
      const estudiante = await Estudiante.findOne({
        _id: req.params.id,
        tenantId: req.user.tenantId, // FIX
      });

      if (!estudiante)
        return res.status(404).json({ message: 'Estudiante no encontrado' });

      res.status(200).json(estudiante);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updateEstudiante(req, res) {
    try {
      const estudiante = await Estudiante.findOneAndUpdate(
        { _id: req.params.id, tenantId: req.user.tenantId },
        req.body,
        { new: true }
      );

      if (!estudiante)
        return res.status(404).json({ message: 'Estudiante no encontrado' });

      res.status(200).json(estudiante);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async deleteEstudiante(req, res) {
    try {
      const estudiante = await Estudiante.findOneAndDelete({
        _id: req.params.id,
        tenantId: req.user.tenantId,
      });

      if (!estudiante)
        return res.status(404).json({ message: 'Estudiante no encontrado' });

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default EstudianteController;
