import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePermissions } from '../hooks/usePermissions';
import api from '../services/api';
import { User, Shield, BookOpen, GraduationCap, DollarSign, Save } from 'lucide-react';

const DashboardPage = () => {
    const { user } = useAuth();
    const { canEditProfile, isSuperAdmin, canManageStudents } = usePermissions();

    // Profile State
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        rut: user?.rut || '',
        phone: '',
        address: ''
    });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user) {
            setProfileData(prev => ({
                ...prev,
                name: user.name,
                email: user.email,
                rut: user.rut || ''
                // Phone and Address would come from backend if they existed in User model
            }));
        }
    }, [user]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMsg({ type: '', text: '' });

        try {
            await api.put('/auth/perfil', profileData);
            setMsg({ type: 'success', text: 'Perfil actualizado correctamente' });
        } catch (error: any) {
            setMsg({ type: 'error', text: error.response?.data?.message || 'Error al actualizar' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header / Welcome */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">
                    Bienvenido, {user?.name}
                </h1>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize
                    ${isSuperAdmin ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                    {user?.role}
                </span>
            </div>

            {/* Stats Cards (Role Conditional) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {canManageStudents && (
                    <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
                        <div className="flex items-center gap-3 mb-2">
                            <GraduationCap className="text-blue-500" />
                            <h3 className="text-lg font-semibold text-gray-700">Estudiantes</h3>
                        </div>
                        <p className="text-3xl font-bold">1,234</p>
                    </div>
                )}

                {(isSuperAdmin || user?.role === 'teacher') && (
                    <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
                        <div className="flex items-center gap-3 mb-2">
                            <BookOpen className="text-green-500" />
                            <h3 className="text-lg font-semibold text-gray-700">Cursos Activos</h3>
                        </div>
                        <p className="text-3xl font-bold">12</p>
                    </div>
                )}

                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
                    <div className="flex items-center gap-3 mb-2">
                        <DollarSign className="text-yellow-500" />
                        <h3 className="text-lg font-semibold text-gray-700">Estado de Cuenta</h3>
                    </div>
                    <p className="text-sm text-gray-600">Al día</p>
                </div>
            </div>

            {/* Profile Management Section */}
            {canEditProfile && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-[#11355a] px-6 py-4 flex items-center gap-2">
                        <User className="text-white w-5 h-5" />
                        <h2 className="text-white font-semibold">Mi Perfil</h2>
                    </div>

                    <div className="p-6">
                        {msg.text && (
                            <div className={`mb-4 p-3 rounded ${msg.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {msg.text}
                            </div>
                        )}

                        <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Read Only Fields */}
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">RUT (No editable)</label>
                                <div className="bg-gray-100 p-2 rounded border text-gray-600">{profileData.rut || 'No registrado'}</div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Rol (No editable)</label>
                                <div className="bg-gray-100 p-2 rounded border text-gray-600 capitalize">{user?.role}</div>
                            </div>

                            {/* Editable Fields */}
                            <div className="md:col-span-2 border-t pt-4 mt-2">
                                <h3 className="text-md font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                    <Shield className="w-4 h-4" /> Datos Personales y Seguridad
                                </h3>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                    value={profileData.name}
                                    onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                                <input
                                    type="email"
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                    value={profileData.email}
                                    onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                                <input
                                    type="tel"
                                    placeholder="+56 9 ..."
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                    value={profileData.phone}
                                    onChange={e => setProfileData({ ...profileData, phone: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                    value={profileData.address}
                                    onChange={e => setProfileData({ ...profileData, address: e.target.value })}
                                />
                            </div>

                            <div className="md:col-span-2 flex justify-end mt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 flex items-center gap-2 disabled:bg-gray-400"
                                >
                                    <Save className="w-4 h-4" />
                                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;
