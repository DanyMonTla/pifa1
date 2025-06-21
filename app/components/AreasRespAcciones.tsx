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
  puedeReactivar: boolean;
  reactivarArea: () => void;
  abrirModalVinculacion: () => void;
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
  setBusquedaId,
  puedeReactivar,
  reactivarArea,
  abrirModalVinculacion,
}: Props) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleBuscar();
      }}
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.5rem",
        marginBottom: "2rem",
        alignItems: "center",
      }}
    >
      <button
        type="button"
        onClick={abrirModalVinculacion}
        style={{
          backgroundColor: "rgba(255, 165, 0, 0.9)",
          color: "white",
          fontWeight: "bold",
          border: "none",
          borderRadius: 5,
          padding: "0.5rem 1rem",
          cursor: "pointer",
        }}
      >
        AreaResponsables-ProgramaPresupuestal
      </button>

      <input
        placeholder="Buscar por ID"
        value={busquedaId}
        onChange={(e) => setBusquedaId(e.target.value)}
        style={{
          flex: 1,
          padding: "0.5rem",
          backgroundColor: "#333",
          color: "white",
          border: "1px solid #666",
          borderRadius: 5,
        }}
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

      {verInactivos && puedeReactivar && (
        <button
          type="button"
          onClick={reactivarArea}
          style={btnStyle("#228B22")}
        >
          Reactivar
        </button>
      )}

      <label style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "white" }}>
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
  borderRadius: 5,
  cursor: "pointer",
});
