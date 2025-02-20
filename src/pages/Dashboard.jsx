import { Link } from "react-router-dom";
import { signOut } from "../config/supabase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    toast.success("Sesión cerrada");
    navigate("/login");
  };

  return (
    <div>
      <h2>🚗 Panel de Control - RentCar</h2>
      <nav>
        <ul>
          <li>
            <Link to="/marcas">Gestión de Marcas</Link>
          </li>
          <li>
            <Link to="/vehiculos">Gestión de Vehículos</Link>
          </li>
          <li>
            <Link to="/clientes">Gestión de Clientes</Link>
          </li>
          <li>
            <button onClick={handleLogout}>Cerrar Sesión</button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Dashboard;
