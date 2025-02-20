import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

export default function InspectionForm({ onSuccess, editingInspection }) {
    const [vehiculos, setVehiculos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [empleados, setEmpleados] = useState([]);
    const [formData, setFormData] = useState({
        vehiculo_id: '',
        cliente_id: '',
        fecha: '',
        tiene_ralladuras: false,
        cantidad_combustible: '',
        tiene_goma_repuesto: false,
        tiene_gato: false,
        tiene_roturas_cristal: false,
        estado_gomas: {
            frontLeft: false,
            frontRight: false,
            rearLeft: false,
            rearRight: false,
        },
        empleado_id: '',
        estado: true 
    });

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (editingInspection) {
            setFormData(editingInspection);
        }
    }, [editingInspection]);

    const fetchData = async () => {
        const { data: vehiculosData } = await supabase.from('vehiculos').select('id, descripcion').eq('estado', true);
        const { data: clientesData } = await supabase.from('clientes').select('id, nombre');
        const { data: empleadosData } = await supabase.from('empleados').select('id, nombre');

        setVehiculos(vehiculosData || []);
        setClientes(clientesData || []);
        setEmpleados(empleadosData || []);
    };

    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({
                ...prev,
                [name]: checked
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleGomasChange = (e) => {
        const { name, checked } = e.target;
       
        setFormData(prev => ({
            ...prev,
            estado_gomas: {
                ...prev.estado_gomas,
                [name]: checked
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

       
        const { error } = editingInspection
            ? await supabase.from('inspecciones').update(formData).eq('id', editingInspection.id)
            : await supabase.from('inspecciones').insert([formData]);

        if (error) {
            console.error('Error saving inspection:', error);
        } else {
            onSuccess();
            setFormData({
                vehiculo_id: '',
                cliente_id: '',
                fecha: '',
                tiene_ralladuras: false,
                cantidad_combustible: '',
                tiene_goma_repuesto: false,
                tiene_gato: false,
                tiene_roturas_cristal: false,
                estado_gomas: {
                    frontLeft: false,
                    frontRight: false,
                    rearLeft: false,
                    rearRight: false,
                },
                empleado_id: '',
                estado: true 
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4">
            <div className="row">
                <div className="col-md-6">
                    <label className="form-label">Vehículo</label>
                    <select name="vehiculo_id" className="form-select" value={formData.vehiculo_id} onChange={handleChange}>
                        <option value="">Seleccione un vehículo</option>
                        {vehiculos.map((vehiculo) => (
                            <option key={vehiculo.id} value={vehiculo.id}>
                                {vehiculo.descripcion}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="col-md-6">
                    <label className="form-label">Cliente</label>
                    <select name="cliente_id" className="form-select" value={formData.cliente_id} onChange={handleChange}>
                        <option value="">Seleccione un cliente</option>
                        {clientes.map((cliente) => (
                            <option key={cliente.id} value={cliente.id}>
                                {cliente.nombre}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="row mt-3">
                <div className="col-md-6">
                    <label className="form-label">Fecha</label>
                    <input type="date" name="fecha" className="form-control" value={formData.fecha} onChange={handleChange} required />
                </div>

                <div className="col-md-6">
                    <label className="form-label">Empleado</label>
                    <select name="empleado_id" className="form-select" value={formData.empleado_id} onChange={handleChange}>
                        <option value="">Seleccione un empleado</option>
                        {empleados.map((empleado) => (
                            <option key={empleado.id} value={empleado.id}>
                                {empleado.nombre}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="row mt-3">
                <div className="col-md-3">
                    <label className="form-label">Cantidad de Combustible</label>
                    <select name="cantidad_combustible" className="form-select" value={formData.cantidad_combustible} onChange={handleChange}>
                        <option value="">Seleccione</option>
                        <option value="1/4">1/4</option>
                        <option value="1/2">1/2</option>
                        <option value="3/4">3/4</option>
                        <option value="lleno">Lleno</option>
                    </select>
                </div>

                <div className="col-md-3 form-check">
                    <input type="checkbox" name="tiene_ralladuras" className="form-check-input" checked={formData.tiene_ralladuras} onChange={handleChange} />
                    <label className="form-check-label">Tiene ralladuras</label>
                </div>

                <div className="col-md-3 form-check">
                    <input type="checkbox" name="tiene_goma_repuesto" className="form-check-input" checked={formData.tiene_goma_repuesto} onChange={handleChange} />
                    <label className="form-check-label">Tiene Goma de Repuesto</label>
                </div>

                <div className="col-md-3 form-check">
                    <input type="checkbox" name="tiene_gato" className="form-check-input" checked={formData.tiene_gato} onChange={handleChange} />
                    <label className="form-check-label">Tiene Gato</label>
                </div>
            </div>

            <div className="row mt-3">
                <div className="col-md-3 form-check">
                    <input type="checkbox" name="tiene_roturas_cristal" className="form-check-input" checked={formData.tiene_roturas_cristal} onChange={handleChange} />
                    <label className="form-check-label">Tiene roturas de cristal</label>
                </div>
                <div className="col-md-3 form-check">
                    <input type="checkbox" name="frontLeft" className="form-check-input" checked={formData.estado_gomas.frontLeft} onChange={handleGomasChange} />
                    <label className="form-check-label">Goma frontal izquierda</label>
                </div>

                <div className="col-md-3 form-check">
                    <input type="checkbox" name="frontRight" className="form-check-input" checked={formData.estado_gomas.frontRight} onChange={handleGomasChange} />
                    <label className="form-check-label">Goma frontal derecha</label>
                </div>

                <div className="col-md-3 form-check">
                    <input type="checkbox" name="rearLeft" className="form-check-input" checked={formData.estado_gomas.rearLeft} onChange={handleGomasChange} />
                    <label className="form-check-label">Goma trasera izquierda</label>
                </div>
            </div>

            <div className="row mt-3">
                <div className="col-md-3 form-check">
                    <input type="checkbox" name="rearRight" className="form-check-input" checked={formData.estado_gomas.rearRight} onChange={handleGomasChange} />
                    <label className="form-check-label">Goma trasera derecha</label>
                </div>
            </div>

            <div className="row mt-3">
                <div className="col-md-6">
                    <label className="form-label">Estado</label>
                    <select name="estado" className="form-select" value={formData.estado} onChange={handleChange}>
                        <option value={true}>Válido</option>
                        <option value={false}>No válido</option>
                    </select>
                </div>
            </div>

            <div className="mt-3">
                <button type="submit" className="btn btn-primary">Guardar</button>
            </div>
        </form>
    );
}
