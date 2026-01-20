import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

const Layout = () => {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md flex flex-col">
                <div className="p-4 h-16 flex items-center justify-center border-b border-gray-200">
                    <h1 className="text-xl font-bold text-gray-800">Maritimo 4.0</h1>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link to="/" className="block p-2 rounded hover:bg-gray-100 text-gray-700">Dashboard</Link>
                    <Link to="/students" className="block p-2 rounded hover:bg-gray-100 text-gray-700">Estudiantes</Link>
                    <Link to="/enrollments" className="block p-2 rounded hover:bg-gray-100 text-gray-700">Matrículas</Link>
                    <Link to="/annotations" className="block p-2 rounded hover:bg-gray-100 text-gray-700">Anotaciones</Link>
                    <Link to="/grades" className="block p-2 rounded hover:bg-gray-100 text-gray-700">Notas</Link>
                    <Link to="/payments" className="block p-2 rounded hover:bg-gray-100 text-gray-700">Pagos</Link>
                </nav>
                <div className="p-4 border-t border-gray-200">
                    <div className="mb-2 text-sm text-gray-600">User: {user?.name || 'Admin'}</div>
                    <button
                        onClick={logout}
                        className="flex items-center space-x-2 text-red-600 hover:text-red-800 w-full p-2"
                    >
                        <LogOut size={18} />
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
