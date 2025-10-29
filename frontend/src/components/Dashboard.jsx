export default function Dashboard() {
  return (
    <div className="w-full">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Resumen Clínico</h2>
        <p className="text-slate-500">Bienvenido de nuevo, Doctor</p>
      </header>

      <div className="flex flex-col xl:flex-row gap-8">

        {/* Agenda Section */}
        <section className="flex-1">
          
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Agenda de Hoy</h2>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-2 rounded-lg shadow-lg transition duration-150 ease-in-out">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <div className="font-semibold text-gray-800">09:00</div>
                  <div className="text-gray-600">María García</div>
                </div>
              </div>
              <span className="text-sm font-medium text-blue-800 bg-blue-100 px-3 py-1 rounded-full">Limpieza</span>
            </div>

            <div className="bg-sky-50 p-4 rounded-lg shadow-md flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <div className="font-semibold text-gray-800">10:30</div>
                  <div className="text-gray-600">Juan Pérez</div>
                </div>
              </div>
              <span className="text-sm font-medium text-indigo-800 bg-indigo-100 px-3 py-1 rounded-full">Extracción</span>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <div className="font-semibold text-gray-800">14:00</div>
                  <div className="text-gray-600">Ana López</div>
                </div>
              </div>
              <span className="text-sm font-medium text-sky-800 bg-sky-100 px-3 py-1 rounded-full">Ortodoncia</span>
            </div>

          </div>
        </section>

        {/* Patient Details Sidebar */}
        <aside className="w-full xl:w-96">
          <div className="bg-white p-6 rounded-lg shadow-xl h-full">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Detalles del Paciente</h2>
            
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-500">Nombre</label>
                <p className="text-lg font-semibold text-gray-900 mt-1">María García</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Teléfono</label>
                <p className="text-lg font-semibold text-gray-900 mt-1">81-1234-5678</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Última Visita</label>
                <p className="text-lg font-semibold text-gray-900 mt-1">2025-10-05</p>
              </div>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition duration-150 ease-in-out mt-8">
              Ver Historial Completo
            </button>
          </div>
        </aside>

      </div>
    </div>
  );
}