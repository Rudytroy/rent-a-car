import { useState } from 'react';
import { supabase } from '../services/supabase';

export default function ReportForm({ onGenerate }) {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [vehicleTypeId, setVehicleTypeId] = useState('');

    const handleGenerate = async (e) => {
        e.preventDefault();
        onGenerate({ startDate, endDate, vehicleTypeId });
    };

    return (
        <form onSubmit={handleGenerate}>
            <input
                type="date"
                placeholder="Fecha de inicio"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
            />
            <input
                type="date"
                placeholder="Fecha de fin"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
            />
            <input
                type="text"
                placeholder="ID del tipo de vehículo"
                value={vehicleTypeId}
                onChange={(e) => setVehicleTypeId(e.target.value)}
            />
            <button type="submit">Generar Reporte</button>
        </form>
    );
}