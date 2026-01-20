const DashboardPage = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded shadow border-l-4 border-blue-500">
                    <h3 className="text-lg font-semibold text-gray-700">Estudiantes</h3>
                    <p className="text-3xl font-bold mt-2">1,234</p>
                </div>
                <div className="bg-white p-6 rounded shadow border-l-4 border-green-500">
                    <h3 className="text-lg font-semibold text-gray-700">Matrículas</h3>
                    <p className="text-3xl font-bold mt-2">567</p>
                </div>
                <div className="bg-white p-6 rounded shadow border-l-4 border-purple-500">
                    <h3 className="text-lg font-semibold text-gray-700">Profesores</h3>
                    <p className="text-3xl font-bold mt-2">89</p>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
