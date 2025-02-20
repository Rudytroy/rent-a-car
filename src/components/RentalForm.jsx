import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export default function RentalForm({ onSuccess }) {
    const [clientId, setClientId] = useState('');
    const [vehicleId, setVehicleId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [dailyRate, setDailyRate] = useState('');
    const [daysCount, setDaysCount] = useState('');
    const [comment, setComment] = useState('');
    const [employeeId, setEmployeeId] = useState('');
    const [state, setState] = useState(true); 

    const [vehicles, setVehicles] = useState([]);
    const [clients, setClients] = useState([]);
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [vehiclesData, clientsData, employeesData] = await Promise.all([
                supabase.from('vehiculos').select('*'),
                supabase.from('clientes').select('*'),
                supabase.from('empleados').select('*'),
            ]);

            if (vehiclesData.error) throw new Error(vehiclesData.error.message);
            if (clientsData.error) throw new Error(clientsData.error.message);
            if (employeesData.error) throw new Error(employeesData.error.message);

            setVehicles(vehiclesData.data || []);
            setClients(clientsData.data || []);
            setEmployees(employeesData.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const checkVehicleAvailability = async () => {
        const { data, error } = await supabase
            .from('renta')
            .select('*')
            .eq('vehiculo_id', vehicleId);

        if (data && data.length > 0) {
            alert('Este vehículo ya está alquilado.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const vehicleAvailable = await checkVehicleAvailability();
        if (!vehicleAvailable) return;


        if (new Date(endDate) < new Date(startDate)) {
            alert('La fecha de devolución no puede ser antes de la fecha de renta.');
            return;
        }

        const rentalData = {
            cliente_id: clientId,
            vehiculo_id: vehicleId,
            fecha_renta: startDate,
            fecha_devolucion: endDate,
            monto_x_dia: dailyRate,
            cantidad_dias: daysCount,
            comentario: comment,
            estado: state,
            empleado_id: employeeId,
        };

        const { data, error } = await supabase.from('renta').insert([rentalData]);

        if (error) {
            console.error('Error creating rental:', error.message); 
            alert('Hubo un error al registrar la renta: ' + error.message);
        } else {
            console.log('Renta creada con éxito', data); 
            setClientId('');
            setVehicleId('');
            setStartDate('');
            setEndDate('');
            setDailyRate('');
            setDaysCount('');
            setComment('');
            setEmployeeId('');
            setState(true);
            onSuccess();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4">
            <div className="row g-3">
                <div className="col-md-4">
                    <select
                        value={clientId}
                        onChange={(e) => setClientId(e.target.value)}
                        className="form-control"
                        required
                    >
                        <option value="">Seleccionar Cliente</option>
                        {clients.map((client) => (
                            <option key={client.id} value={client.id}>
                                {client.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="col-md-4">
                    <select
                        value={vehicleId}
                        onChange={(e) => setVehicleId(e.target.value)}
                        className="form-control"
                        required
                    >
                        <option value="">Seleccionar Vehículo</option>
                        {vehicles.map((vehicle) => (
                            <option key={vehicle.id} value={vehicle.id}>
                                {vehicle.descripcion}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="col-md-4">
                    <select
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                        className="form-control"
                        required
                    >
                        <option value="">Seleccionar Empleado</option>
                        {employees.map((employee) => (
                            <option key={employee.id} value={employee.id}>
                                {employee.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="col-md-4">
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>

                <div className="col-md-4">
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>

                <div className="col-md-4">
                    <input
                        type="number"
                        value={dailyRate}
                        onChange={(e) => setDailyRate(e.target.value)}
                        className="form-control"
                        placeholder="Monto x Día"
                        required
                    />
                </div>

                <div className="col-md-4">
                    <input
                        type="number"
                        value={daysCount}
                        onChange={(e) => setDaysCount(e.target.value)}
                        className="form-control"
                        placeholder="Cantidad de Días"
                        required
                    />
                </div>

                <div className="col-12">
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="form-control"
                        placeholder="Comentario"
                    />
                </div>

                <div className="col-12">
                    <label>Estado</label>
                    <select
                        value={state}
                        onChange={(e) => setState(e.target.value === 'true')}
                        className="form-control"
                    >
                        <option value={true}>Válido</option>
                        <option value={false}>No válido</option>
                    </select>
                </div>

                <div className="col-12">
                    <button type="submit" className="btn btn-primary w-100">
                        Agregar Renta
                    </button>
                </div>
            </div>
        </form>
    );
}
