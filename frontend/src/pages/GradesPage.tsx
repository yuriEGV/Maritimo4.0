import { useState, useEffect } from 'react';
import { getGrades, type Grade } from '../services/gradeService';

const GradesPage = () => {
    const [grades, setGrades] = useState<Grade[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGrades = async () => {
            try {
                const data = await getGrades();
                setGrades(data);
            } catch (error) {
                console.error('Error fetching grades:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchGrades();
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Notas / Calificaciones</h1>

            {loading ? (
                <div>Cargando...</div>
            ) : (
                <div className="bg-white rounded shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estudiante ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Evaluación ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nota</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {grades.map((grade) => (
                                <tr key={grade._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{grade.estudianteId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{grade.evaluationId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{grade.score}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default GradesPage;
