import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export default function EmployeeForm({ onSuccess, selectedEmployee, setSelectedEmployee }) {
    const [name, setName] = useState('');
    const [idNumber, setIdNumber] = useState('');
    const [workShift, setWorkShift] = useState('Matutina');
    const [commissionPercentage, setCommissionPercentage] = useState('');
    const [hireDate, setHireDate] = useState('');
    const [status, setStatus] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (selectedEmployee) {
            setName(selectedEmployee.nombre);
            setIdNumber(selectedEmployee.cedula);
            setWorkShift(selectedEmployee.tanda_labor);
            setCommissionPercentage(selectedEmployee.porciento_comision);
            setHireDate(selectedEmployee.fecha_ingreso);
            setStatus(selectedEmployee.estado);
        } else {
            setName('');
            setIdNumber('');
            setWorkShift('Matutina');
            setCommissionPercentage('');
            setHireDate('');
            setStatus(true);
        }
    }, [selectedEmployee]);

    const validaCedula = (cedula) => {
        let vnTotal = 0;
        let vcCedula = cedula.replace("-", "").trim();
        let pLongCed = vcCedula.length;
        const digitoMult = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1];

        if (pLongCed !== 11) return false;

        for (let vDig = 0; vDig < pLongCed; vDig++) {
            let vCalculo = parseInt(vcCedula.charAt(vDig)) * digitoMult[vDig];
            if (vCalculo < 10) {
                vnTotal += vCalculo;
            } else {
                let strCalculo = vCalculo.toString();
                vnTotal += parseInt(strCalculo.charAt(0)) + parseInt(strCalculo.charAt(1));
            }
        }

        return vnTotal % 10 === 0;
    };

    const handleCommissionChange = (e) => {
        const value = e.target.value;

        if (value === '' || (Number(value) >= 0 && Number(value) <= 100)) {
            setCommissionPercentage(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validaCedula(idNumber)) {
            setErrorMessage('La cédula es inválida');
            return;
        }

        if (commissionPercentage < 0 || commissionPercentage > 100) {
            setErrorMessage('El porcentaje de comisión debe estar entre 0 y 100');
            return;
        }

        setErrorMessage('');

        if (selectedEmployee) {
            const { error } = await supabase
                .from('empleados')
                .update({
                    nombre: name,
                    cedula: idNumber,
                    tanda_labor: workShift,
                    porciento_comision: commissionPercentage,
                    fecha_ingreso: hireDate,
                    estado: status,
                })
                .eq('id', selectedEmployee.id);

            if (error) {
                console.error('Error updating employee:', error);
            } else {
                setSelectedEmployee(null);
                onSuccess();
            }
        } else {
            const { error } = await supabase.from('empleados').insert([{
                nombre: name,
                cedula: idNumber,
                tanda_labor: workShift,
                porciento_comision: commissionPercentage,
                fecha_ingreso: hireDate,
                estado: status,
            }]);

            if (error) {
                console.error('Error creating employee:', error);
            } else {
                onSuccess();
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4">
            <div className="row g-3">
                <div className="col-md-4">
                    <input
                        type="text"
                        placeholder="Nombre"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>
                <div className="col-md-4">
                    <input
                        type="text"
                        placeholder="Cédula"
                        value={idNumber}
                        onChange={(e) => setIdNumber(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>
                <div className="col-md-4">
                    <select
                        value={workShift}
                        onChange={(e) => setWorkShift(e.target.value)}
                        className="form-control"
                    >
                        <option value="Matutina">Matutina</option>
                        <option value="Vespertina">Vespertina</option>
                        <option value="Nocturna">Nocturna</option>
                    </select>
                </div>
                <div className="col-md-4">
                    <input
                        type="number"
                        placeholder="Porciento Comisión"
                        value={commissionPercentage}
                        onChange={handleCommissionChange}
                        className="form-control"
                        required
                        min="0"
                        max="100"
                    />
                </div>
                <div className="col-md-4">
                    <input
                        type="date"
                        placeholder="Fecha Ingreso"
                        value={hireDate}
                        onChange={(e) => setHireDate(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>
                <div className="col-md-4">
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value === 'true')}
                        className="form-control"
                        required
                    >
                        <option value="true">Activo</option>
                        <option value="false">Inactivo</option>
                    </select>
                </div>
                <div className="col-12">
                    {errorMessage && <p className="text-danger">{errorMessage}</p>}
                    <button type="submit" className="btn btn-primary w-100">
                        {selectedEmployee ? 'Actualizar Empleado' : 'Agregar Empleado'}
                    </button>
                </div>
            </div>
        </form>
    );
}
