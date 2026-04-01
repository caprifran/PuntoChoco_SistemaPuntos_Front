import React, { useEffect} from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopList from "../components/TopList";
import axios from "../api/axiosConfig";

export default function MenuPrincipal() {

  const navigate = useNavigate();
  const [topConsum, setTopConsum] = useState([]);
  const [topAcum, setTopAcum] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTop = async () => {
      setLoading(true);
      try {
        const [consumRes, acumRes] = await Promise.all([
          axios.get("/clientes/top", { params: { tipo: "consumidores" } }),
          axios.get("/clientes/top", { params: { tipo: "acumuladores" } })
        ]);

        setTopConsum(consumRes.data);
        setTopAcum(acumRes.data);

      } catch (error) {
        console.error("Error obteniendo top:", error);
        setTopConsum([]);
        setTopAcum([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTop();
  }, []);

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Stats Row */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-surface-container-low p-5 md:p-8 rounded-xl flex flex-col justify-between hover:bg-surface-container-high transition-colors">
          <span className="text-on-surface-variant font-label text-sm uppercase tracking-wider">Puntos del Día</span>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-2xl md:text-4xl font-bold text-primary font-headline">12,450</span>
            <span className="text-sm font-bold text-tertiary-container">+12%</span>
          </div>
        </div>
        <div className="bg-primary-container p-5 md:p-8 rounded-xl flex flex-col justify-between">
          <span className="text-on-primary-container font-label text-sm uppercase tracking-wider">Total Acumuladores</span>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-2xl md:text-4xl font-bold text-surface-container-lowest font-headline">842</span>
            <span className="text-sm font-body text-on-primary-container/70 italic">Clientes activos</span>
          </div>
        </div>
        <div className="bg-secondary-container p-5 md:p-8 rounded-xl flex flex-col justify-between">
          <span className="text-on-secondary-container font-label text-sm uppercase tracking-wider">Promedio de Puntos</span>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-2xl md:text-4xl font-bold text-on-secondary-fixed font-headline">150</span>
            <span className="text-sm font-body text-on-secondary-container">Por compra</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TopList title={"consumidores"} toplist={topConsum} loading={loading} />
        <TopList title={"acumuladores"} toplist={topAcum} loading={loading} />
      </div>

      {/* Bento style banner */}
      <section className="bg-primary overflow-hidden rounded-2xl relative p-6 md:p-12 min-h-[200px] md:min-h-[240px] flex items-center mt-8 md:mt-12">
        <div className="z-10 max-w-xl relative">
          <h3 className="text-xl md:text-3xl font-extrabold text-surface-bright mb-3 md:mb-4 font-headline leading-tight break-words">Impulsa las ventas con el programa de lealtad.</h3>
          <p className="text-on-primary-container mb-6 md:mb-8 font-body text-sm md:text-base break-words">Premia a tus clientes más fieles con beneficios exclusivos y mantén el control total de sus consumos.</p>
          <button onClick={() => navigate("/productos/crear-producto")} className="bg-surface-bright text-primary px-6 md:px-8 py-2.5 md:py-3 rounded-lg font-bold hover:scale-105 transition-transform text-sm md:text-base">Gestionar Premios</button>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 overflow-hidden opacity-40 hidden md:block">
          <img 
            className="w-full h-full object-cover grayscale mix-blend-overlay" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCX760r8c3Ao1sXzb9ytgEtvyvytg3B03ezFk8uXAHMg7IImhU0jMRvMjoAGSPXvievPQ8StijeYNAY-Ub4SrNG4OUeUzD1HuWRAuuQR7eEaKUktQGZEWe393etAv8xPLxj9iDq96O6lMo51sqOuuGA9408UwZdUtfauiNLM03yfWB_QkvCMJ8hsLCXF9CyzSoolC2elIBumz9xZ-STpwU_NMTXixmx-EBAhzO1Vo9x_n5SaTHVAVCKYzIP1zZIgRC2EB9R8Qgl-mjx" 
            alt="Chocolate Aesthetic"
          />
        </div>
      </section>
    </div>
  );
}