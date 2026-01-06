import React from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

export function ScrollHero() {
  return (
    <div className="flex flex-col overflow-hidden bg-black">
      <ContainerScroll
        titleComponent={
          <div className="space-y-8 px-4">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              meus clientes já faturaram R$ 50 milhões.
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
              <button className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white hover:text-black transition-all duration-300 font-semibold uppercase tracking-wide">
                Pare de Estudar
              </button>
              <button className="px-8 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition-all duration-300 font-semibold uppercase tracking-wide">
                Comece a Lucrar
              </button>
            </div>
          </div>
        }
      >
        <img
          src="https://images.pexels.com/photos/3184430/pexels-photo-3184430.jpeg?auto=compress&cs=tinysrgb&w=1400&h=720&fit=crop"
          alt="AI Business Dashboard - Resultados de Clientes"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}

export default ScrollHero;
