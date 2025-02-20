import Navbar from '../components/Navbar';

export default function Home() {
    return (
        <div className="container mt-4">
            <Navbar />
            <h1 className="text-center mb-4">Bienvenido al Sistema de RentCar</h1>
            <p className="text-center">Gestionar vehículos, clientes y rentas nunca ha sido tan sencillo.</p>
            <div className="text-center mt-4">
                <img
                    src="https://resizer.glanacion.com/resizer/v2/el-peugeot-3008-es-uno-de-los-aspirantes-al-JT33OULI3BDVVM5QKT6Z7IWPDE.jpg?auth=4d2f0e5f6560383c5333fd27e2a079204296e023f9bf7c71cdec8e1f624b4d57&width=1200&quality=70&smart=false&height=800" 
                    alt="RentCar"
                    className="img-fluid rounded"
                    width={800}
                />
            </div>
        </div>
    );
}