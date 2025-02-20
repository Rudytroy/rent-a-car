import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { jsPDF } from 'jspdf';
import RentalForm from '../components/RentalForm';
import Navbar from '../components/Navbar';

export default function Rentals() {
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRentals();
    }, []);

    const fetchRentals = async () => {
        try {
            const { data, error } = await supabase
                .from('renta')
                .select(`
                    id,
                    fecha_renta,
                    fecha_devolucion,
                    monto_x_dia,
                    cantidad_dias,
                    comentario,
                    estado,
                    empleado:empleado_id(nombre),
                    cliente:cliente_id(nombre),
                    vehiculo:vehiculo_id(descripcion)
                `);
            if (error) throw error;
            setRentals(data);
        } catch (error) {
            console.error('Error fetching rentals:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            const { error } = await supabase.from('renta').delete().eq('id', id);
            if (error) throw error;
            fetchRentals();
        } catch (error) {
            console.error('Error deleting rental:', error);
        }
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        
        doc.setFontSize(16);
        doc.text('Lista de Rentas', 20, 20);

        let y = 30;

        rentals.forEach((rental) => {
            doc.setFontSize(12);
            doc.text(`Renta #${rental.id}`, 20, y);
            doc.text(`Empleado: ${rental.empleado?.nombre}`, 20, y + 10);
            doc.text(`Cliente: ${rental.cliente?.nombre}`, 20, y + 20);
            doc.text(`Vehículo: ${rental.vehiculo?.descripcion}`, 20, y + 30);
            doc.text(`Fecha de Renta: ${rental.fecha_renta}`, 20, y + 40);
            doc.text(`Fecha de Devolución: ${rental.fecha_devolucion}`, 20, y + 50);
            doc.text(`Monto x Día: ${rental.monto_x_dia}`, 20, y + 60);
            doc.text(`Cantidad de Días: ${rental.cantidad_dias}`, 20, y + 70);
            doc.text(`Comentario: ${rental.comentario}`, 20, y + 80);
            doc.text(`Estado: ${rental.estado ? 'Válido' : 'No válido'}`, 20, y + 90);
            y += 100;

            if (y > 270) {
                doc.addPage();
                y = 20;
            }
        });

        doc.save('rentas.pdf');
    };

    if (loading) return <p className="text-center mt-4">Cargando rentas...</p>;

    return (
        <div className="container mt-4">
            <Navbar />
            <h1 className="text-center mb-4">Rentas</h1>
            <RentalForm onSuccess={fetchRentals} />
            <button onClick={downloadPDF} className="btn btn-primary mb-4">
                Descargar PDF
            </button>
            <ul className="list-group">
                {rentals && rentals.length > 0 ? (
                    rentals.map((rental) => (
                        <li key={rental.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <p className="fw-bold">Renta #{rental.id}</p>
                                <p className="text-muted">Empleado: {rental.empleado?.nombre}</p>
                                <p className="text-muted">Cliente: {rental.cliente?.nombre}</p>
                                <p className="text-muted">Vehículo: {rental.vehiculo?.descripcion}</p>
                                <p className="text-muted">Fecha de Renta: {rental.fecha_renta}</p>
                                <p className="text-muted">Fecha de Devolución: {rental.fecha_devolucion}</p>
                                <p className="text-muted">Monto x Día: {rental.monto_x_dia}</p>
                                <p className="text-muted">Cantidad de Días: {rental.cantidad_dias}</p>
                                <p className="text-muted">Comentario: {rental.comentario}</p>
                                <p className="text-muted">Estado: {rental.estado ? 'Válido' : 'No válido'}</p>
                            </div>
                            <button onClick={() => handleDelete(rental.id)} className="btn btn-danger btn-sm">
                                Eliminar
                            </button>
                        </li>
                    ))
                ) : (
                    <p className="text-center text-muted">No hay rentas disponibles.</p>
                )}
            </ul>
        </div>
    );
}

