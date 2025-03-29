"use client";
import React from "react";

interface ProgPresNumNom {
  // Aquí puedes declarar las propiedades que se usarán
  // para cambiar la información del componente
  content: string;
}

export default function ProgPresNumNom({ content }: ProgPresNumNom) {
  return (
    <div
      style={{
        width: "150px",
        height: "40px",
        backgroundColor: " #003B5C", /* Azul UNAM  #003d79;*/
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "8px",
        padding: "8px",
      }}
    >
      {/* El contenido se renderiza aquí */}
      <p>{content}</p>
    </div>
  );
}
