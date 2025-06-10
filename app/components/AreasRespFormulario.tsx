"use client";
import React, { ChangeEvent } from "react";

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
  form: AreaResponsable;
  modo: "agregar" | "modificar" | "eliminar" | null;
  soloVisualizacion: boolean;
  encabezados: { [key: string]: string };
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
};

export default function AreasRespFormulario({
  form,
  modo,
  soloVisualizacion,
  encabezados,
  handleChange,
  handleSubmit,
}: Props) {
  const mostrarCampo = (key: string) => {
  if (modo === "agregar" && (key === "dfecha_baja" || key === "bhabilitado")) return false;
  if (modo === "modificar" && (key === "dfecha_baja" || key === "bhabilitado")) return false;
  if ((modo === "eliminar" || soloVisualizacion) && key === "dfecha_baja" && form.bhabilitado) return false;
  return true;
};



  const isReadOnly = modo === "eliminar" || soloVisualizacion;

  return (
    (modo || soloVisualizacion) && (
      <form onSubmit={handleSubmit} style={formStyle}>
        {Object.entries(form).map(([key, value]) => {
          if (!mostrarCampo(key)) return null;
          const isDate = key === "dfecha_alta" || key === "dfecha_baja";

          return (
            <div key={key} style={fieldRow}>
              <label htmlFor={key} style={labelStyle}>
                {encabezados[key] || key}
              </label>

              {key === "bhabilitado" ? (
                <input
                  type="text"
                  value={value ? "Sí" : "No"}
                  readOnly
                  style={inputStyle}
                />
              ) : (
                <input
                  id={key}
                  name={key}
                  type={isDate ? "date" : "text"}
                  value={
                    typeof value === "string"
                      ? isDate
                        ? value.slice(0, 10)
                        : value
                      : ""
                  }
                  onChange={handleChange}
                  readOnly={isReadOnly}
                  style={inputStyle}
                />
              )}
            </div>
          );
        })}

        {!soloVisualizacion && modo && (
          <div style={submitRow}>
            <button
              type="submit"
              style={{
                padding: "0.75rem 2rem",
                backgroundColor: modo === "eliminar" ? "#8B0000" : "#0077b6",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              {modo === "modificar"
                ? "Actualizar"
                : modo === "eliminar"
                ? "Marcar inactivo"
                : "Guardar"}
            </button>
          </div>
        )}
      </form>
    )
  );
}

const formStyle: React.CSSProperties = {
  maxWidth: "600px",
  margin: "2rem auto",
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",
};

const fieldRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "1rem",
};

const labelStyle: React.CSSProperties = {
  width: "180px",
  textAlign: "right",
  fontWeight: "bold",
  color: "white",
};

const inputStyle: React.CSSProperties = {
  flex: 1,
  padding: "0.5rem",
  borderRadius: "4px",
  border: "1px solid #ccc",
  fontSize: "1rem",
};

const submitRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  marginTop: "1rem",
};
