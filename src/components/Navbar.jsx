import { Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) console.error('Error al cerrar sesión:', error);
        else navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand">RentCar</Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link to="/vehicle-types" className="nav-link">Tipos de Vehículos</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/brands" className="nav-link">Marcas</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/models" className="nav-link">Modelos</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/fuel-types" className="nav-link">Tipos de Combustible</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/vehicles" className="nav-link">Vehículos</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/clients" className="nav-link">Clientes</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/employees" className="nav-link">Empleados</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/inspections" className="nav-link">Inspecciones</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/rentals" className="nav-link">Rentas</Link>
                        </li>
                       
                        
                        
                    </ul>
                    <button
                        onClick={handleLogout}
                        className="btn btn-outline-danger"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </nav>
    );
}