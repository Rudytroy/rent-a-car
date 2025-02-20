import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import EmployeeForm from '../components/EmployeeForm';
import Navbar from '../components/Navbar';

export default function Employees() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        const { data, error } = await supabase.from('empleados').select('*');
        if (error) console.error('Error fetching employees:', error);
        else setEmployees(data);
        setLoading(false);
    };

    const handleDelete = async (id) => {
        const { error } = await supabase.from('empleados').delete().eq('id', id);
        if (error) console.error('Error deleting employee:', error);
        else fetchEmployees();
    };

    const handleEdit = (employee) => {
        setSelectedEmployee(employee);
    };

    if (loading) return <p className="text-center mt-4">Cargando empleados...</p>;

    return (
        <div className="container mt-4">
           <Navbar />
            <h1 className="text-center mb-4">Empleados</h1>
            <EmployeeForm onSuccess={fetchEmployees} selectedEmployee={selectedEmployee} setSelectedEmployee={setSelectedEmployee} />
            <ul className="list-group">
                {employees.map((employee) => (
                    <li key={employee.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <p className="fw-bold">{employee.nombre}</p>
                            <p className="text-muted">Cédula: {employee.cedula}</p>
                            <p className="text-muted">Tanda Labor: {employee.tanda_labor}</p>
                            <p className="text-muted">Porciento Comisión: {employee.porciento_comision}</p>
                            <p className="text-muted">Fecha Ingreso: {employee.fecha_ingreso}</p>
                            <p className="text-muted">Estado: {employee.estado ? 'Activo' : 'Inactivo'}</p>
                        </div>
                        <div className="d-flex">
                            <button
                                onClick={() => handleEdit(employee)}
                                className="btn btn-warning btn-sm me-2"
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => handleDelete(employee.id)}
                                className="btn btn-danger btn-sm"
                            >
                                Eliminar
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
