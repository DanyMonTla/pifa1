"use client";
import React from "react";

type Props = {
  form: any;
  setModo: (m: "agregar" | "modificar" | "eliminar") => void;
  resetForm: () => void;
  setSoloVisualizacion: (v: boolean) => void;
  setError: (e: string) => void;
  verInactivos: boolean;
  setVerInactivos: (v: boolean) => void;
  handleBuscar: () => void;
  busquedaId: string;
  setBusquedaId: (id: string) => void;
};

export default function AreasRespAcciones({
  form,
  setModo,
  resetForm,
  setSoloVisualizacion,
  setError,
  verInactivos,
  setVerInactivos,
  handleBuscar,
  busquedaId,
  setBusquedaId
}: Props) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleBuscar();
      }}
      style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}
    >
      <input
        placeholder="Buscar por ID"
        value={busquedaId}
        onChange={(e) => setBusquedaId(e.target.value)}
        style={{ flex: 1, padding: "0.5rem" }}
      />
      <button type="submit" style={btnStyle("#0077b6")}>Buscar</button>

      <button
        type="button"
        onClick={() => {
          resetForm();
          setModo("agregar");
        }}
        style={btnStyle("#004c75")}
      >
        Agregar
      </button>

      <button
        type="button"
        onClick={() => {
          if (!form.bhabilitado) {
            setError("No se puede modificar un registro inhabilitado.");
            setTimeout(() => setError(""), 2000);
            return;
          }
          setModo("modificar");
          setSoloVisualizacion(false);
          setError("");
        }}
        style={btnStyle("#004c75")}
      >
        Modificar
      </button>

      <button
        type="button"
        onClick={() => {
          if (!form.bhabilitado) {
            setError("Esta área ya está inactiva.");
            setTimeout(() => setError(""), 2000);
            return;
          }
          setModo("eliminar");
          setSoloVisualizacion(false);
          setError("");
        }}
        style={btnStyle("#8B0000")}
      >
        Eliminar
      </button>

      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <input
          type="checkbox"
          checked={verInactivos}
          onChange={() => setVerInactivos(!verInactivos)}
        />
        Ver inhabilitados
      </label>
    </form>
  );
}

const btnStyle = (color: string): React.CSSProperties => ({
  backgroundColor: color,
  color: "white",
  padding: "0.5rem 1rem",
  border: "none",
  cursor: "pointer",
});
