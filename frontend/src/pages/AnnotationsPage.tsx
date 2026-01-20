import { useState, useEffect } from 'react';
import { getAnotaciones, createAnotacion, type Anotacion } from '../services/annotationService';
import { useAuth } from '../context/AuthContext';

const AnnotationsPage = () => {
    const [anotaciones, setAnotaciones] = useState<Anotacion[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const { user } = useAuth();

    // Form state
    const [formData, setFormData] = useState({
        estudianteId: '',
        tipo: 'positiva',
        titulo: '',
        descripcion: '',
        fechaOcurrencia: new Date().toISOString().split('T')[0]
    });

    const fetchAnotaciones = async () => {
        try {
            const data = await getAnotaciones();
            setAnotaciones(data);
        } catch (error) {
            console.error('Error fetching annotations:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnotaciones();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createAnotacion({
                ...formData,
                tipo: formData.tipo as 'positiva' | 'negativa',
                creadoPor: user?._id || user?.id // Assuming user object has ID
            });
            setShowForm(false);
            fetchAnotaciones();
            setFormData({
                estudianteId: '',
                tipo: 'positiva',
                titulo: '',
                descripcion: '',
                fechaOcurrencia: new Date().toISOString().split('T')[0]
            });
        } catch (error) {
            console.error('Error creating annotation:', error);
            alert('Error al crear la anotación');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Anotaciones</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    {showForm ? 'Cancelar' : 'Nueva Anotación'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded shadow mb-6">
                    <h3 className="text-lg font-bold mb-4">Nueva Anotación</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">ID Estudiante</label>
                            <input
                                type="text"
                                value={formData.estudianteId}
                                onChange={(e) => setFormData({ ...formData, estudianteId: e.target.value })}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tipo</label>
                            <select
                                value={formData.tipo}
                                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded"
                            >
                                <option value="positiva">Positiva</option>
                                <option value="negativa">Negativa</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Título</label>
                            <input
                                type="text"
                                value={formData.titulo}
                                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded"
                                required
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Descripción</label>
                            <textarea
                                value={formData.descripcion}
                                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded"
                                rows={3}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Fecha Ocurrencia</label>
                            <input
                                type="date"
                                value={formData.fechaOcurrencia}
                                onChange={(e) => setFormData({ ...formData, fechaOcurrencia: e.target.value })}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                                Guardar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <div>Cargando...</div>
            ) : (
                <div className="bg-white rounded shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estudiante (ID)</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {anotaciones.map((anotacion) => (
                                <tr key={anotacion._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(anotacion.fechaOcurrencia || '').toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${anotacion.tipo === 'positiva' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {anotacion.tipo}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{anotacion.titulo}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{anotacion.estudianteId}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AnnotationsPage;
