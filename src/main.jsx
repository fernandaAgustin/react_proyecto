import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage"; 
import RegisterPage from "./pages/RegisterPage"; 
import PerfilPage from "./pages/PerfilPage";
import ResetPassword from "./components/ResetPassword";
import ListaUsuario from "./components/ListaUsuario";
//import UsuarioPage from "./pages/UsuarioPage";
import EditPage from "./pages/EditPage";
import NusuPage from "./pages/NusuPage";
import SlistPage from "./pages/SlistPage";
import SeditPage from "./pages/SeditPage";
import SfromPage from "./pages/SformPage";
import Vepage from "./pages/VePage";
import Vlpage from "./pages/VlPage";
import Vrpage from "./pages/VrPage";
import RePage from "./pages/RePage";
import RlPage from "./pages/RlPage";
import RrPage from "./pages/RrPage";
import PruebaPage from "./pages/PuebaPage";
import ValvulaGraficas from "./components/valvulas/ValvulaGraficas";
import PrincipalPage from "./pages/PrincipalPage";
import AdminSistema from "./components/AdminSistema";
import TemperatureList from "./components/TemperatureList";
import GraficaSistema from "./components/GraficaSistema";
import AguaList from "./components/AguaList";
import LuzList from "./components/LuzList";
import HumedadList from "./components/HumedadList";
import UsuarioList from "./components/UsuarioList";
import TemperaturaTable from "./components/TemperaturaTable";
import LuzTabla from "./components/LuzTabla";
import SistemaHumedad from "./components/SistemaHumedad";
import AguaSistema from "./components/AguaSistema";
import ProyectoInvernadero from "./components/ProyectoInvernadero";
import ServicioInstalacion from "./components/ServicioInstalacion";
import HumedadPage from "./pages/HumedadPage";
import TemperaturePage from "./pages/TemperaturePage";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<PrincipalPage />} /> 
      <Route path="/sesion" element={<LoginPage />} /> 
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/perfil" element={<PerfilPage />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/usuarios" element={<ListaUsuario />} />
      <Route path="/usuarios" element={<ListaUsuario />} />
      <Route path="/editUsuarios/:id" element={<EditPage />} />
      <Route path="/nuevoU" element={<NusuPage />} />
      <Route path="/sensores" element={<SlistPage />} />
      <Route path="/editSensores/:id" element={<SeditPage />} />
      <Route path="/nuevoSensores" element={<SfromPage />} />
      <Route path="/editar-valvula/:id" element={<Vepage />} />
      <Route path="/valvula" element={<Vlpage />} />
      <Route path="/nuevaVal" element={<Vrpage />} />
      <Route path="/editar-riego/:id" element={<RePage />} />
      <Route path="/riego" element={<RlPage />} />
      <Route path="/nuevoRiego" element={<RrPage />} />
      <Route path="/prueba" element={<PruebaPage />} />
      <Route path="/graficas" element={<ValvulaGraficas />} />
      <Route path="/asis" element={<AdminSistema />} />
      <Route path="/temperatura" element={<TemperatureList />} />
      <Route path="/agua" element={<AguaList />} />
      <Route path="/aguasis" element={<AguaSistema />} />
      <Route path="/luz" element={<LuzList />} />
      <Route path="/humedad" element={<HumedadList />} />
      <Route path="/graficaU" element={<GraficaSistema />} />
      <Route path="/tablatem" element={<TemperaturaTable />} />
      <Route path="/tablaluz" element={<LuzTabla />} />
      <Route path="/shumedad" element={<SistemaHumedad />} />
      <Route path="/proyecto" element={<ProyectoInvernadero />} />
      <Route path="/instalacion" element={<ServicioInstalacion/>} />
      <Route path="/hume" element={<HumedadPage/>} />
      <Route path="/tem" element={<TemperaturePage/>} />



    </Routes>
  </BrowserRouter>
);