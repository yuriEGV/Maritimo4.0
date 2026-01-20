
import React, { useEffect, useState } from 'react';
import api from '../services/api';
// import { useAuth } from '../context/AuthContext';
import { CreditCard, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import clsx from 'clsx';

interface Payment {
    _id: string;
    concepto: string;
    amount: number;
    estado: 'pendiente' | 'pagado' | 'vencido';
    fechaVencimiento: string;
}

const PaymentsPage: React.FC = () => {
    // const { user } = useAuth(); // Unused
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                // In a real scenario, we would filter by the logged-in user automatically in the backend
                // or pass the user ID. For now, we mock fetching 'my' payments.
                const response = await api.get('/payments');
                setPayments(response.data);
            } catch (error) {
                console.error('Error fetching payments:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    const handlePay = (id: string) => {
        alert('Redirigiendo a pasarela de pago (Simulación)...');
        // Simulate successful payment
        setPayments(prev => prev.map(p => p._id === id ? { ...p, estado: 'pagado' } : p));
    };

    if (loading) return <div className="p-8 text-center">Cargando pagos...</div>;

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <CreditCard className="w-8 h-8 text-[#11355a]" />
                Mis Pagos y Mensualidades
            </h1>

            {payments.length === 0 ? (
                <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
                    No tienes pagos registrados.
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Concepto</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vencimiento</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {payments.map((payment) => (
                                <tr key={payment._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{payment.concepto}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(payment.fechaVencimiento).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                                        ${payment.amount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={clsx(
                                            "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                                            {
                                                'bg-green-100 text-green-800': payment.estado === 'pagado',
                                                'bg-yellow-100 text-yellow-800': payment.estado === 'pendiente',
                                                'bg-red-100 text-red-800': payment.estado === 'vencido',
                                            }
                                        )}>
                                            {payment.estado === 'pagado' && <CheckCircle className="w-3 h-3 mr-1 self-center" />}
                                            {payment.estado === 'pendiente' && <Clock className="w-3 h-3 mr-1 self-center" />}
                                            {payment.estado === 'vencido' && <AlertCircle className="w-3 h-3 mr-1 self-center" />}
                                            {payment.estado.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {payment.estado !== 'pagado' && (
                                            <button
                                                onClick={() => handlePay(payment._id)}
                                                className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md text-sm"
                                            >
                                                Pagar Ahora
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PaymentsPage;
