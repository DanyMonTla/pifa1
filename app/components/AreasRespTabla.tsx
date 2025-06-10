// components/AreasRespTabla.tsx
"use client";
import React from "react";

type AreaResponsable = {
  nid_area: string;
  cunidad_responsable: string;
  creporta_a: string;
  ccorreo_electronico_ur: string;
  bhabilitado: boolean;
  dfecha_alta: string;
  dfecha_baja: string;
};

type Props = {
  areas: AreaResponsable[];
  verInactivos: boolean;
  encabezados: { [key: string]: string };
};

export default function AreasRespTabla({ areas, verInactivos, encabezados }: Props) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "2rem" }}>
      <thead>
        <tr>
          {Object.keys(encabezados).map((key) => {
            if (!verInactivos && key === "dfecha_baja") return null;
            return (
              <th key={key} style={thStyle}>
                {encabezados[key] || key.toUpperCase()}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {areas
            .filter(a => verInactivos || a.bhabilitado)
            .map(a => (
            <tr key={a.nid_area} style={{ opacity: a.bhabilitado ? 1 : 0.5 }}>
                {Object.keys(encabezados).map((key) => {
                if (!verInactivos && key === "dfecha_baja") return null;

                const val = a[key as keyof AreaResponsable];

                return (
                    <td
                    key={key}
                    style={{
                        ...tdStyle,
                        color: key === "bhabilitado" ? (a.bhabilitado ? "green" : "red") : "#000",
                    }}
                    >
                    {key === "bhabilitado"
                        ? a.bhabilitado ? "Sí" : "No"
                        : key === "dfecha_alta" || key === "dfecha_baja"
                            ? val ? String(val).slice(0, 10) : ""
                            : val
                            }
                    </td>
                );
                })}
            </tr>
            ))}
        </tbody>

    </table>
  );
}

const thStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  padding: "8px",
  backgroundColor: "#003B5C",
  color: "white",
  textAlign: "center",           // CENTRAR horizontalmente
  verticalAlign: "middle",       // CENTRAR verticalmente
};


const tdStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  padding: "8px",
  backgroundColor: "#fff",
  textAlign: "center",           // CENTRAR horizontalmente
  verticalAlign: "middle",       // CENTRAR verticalmente
};
