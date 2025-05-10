"use client";

import React, { useState, ChangeEvent } from "react";

// Estructura del Área Responsable
type AreaResponsable = {
  idArea: string;
  unidad: string;
  reportaA: string;
  correo: string;
  titulo: string;
  nombre_responsable: string;
  apellidoP_responsable: string;
  apellidoM_responsable: string;
  cargo_responsable: string;
  idPrograma: string;
  activo: boolean;
};

export default function AreasResponsablesCrud() {
  const [form, setForm] = useState<AreaResponsable>({
    idArea: "",
    unidad: "",
    reportaA: "",
    correo: "",
    titulo: "",
    nombre_responsable: "",
    apellidoP_responsable: "",
    apellidoM_responsable: "",
    cargo_responsable: "",
    idPrograma: "",
    activo: true,
  });

  const [modo, setModo] = useState<"agregar" | "modificar" | "eliminar" | null>(null);
  const [areas, setAreas] = useState<AreaResponsable[]>([]);
  const [busquedaId, setBusquedaId] = useState("");
  const [verInactivos, setVerInactivos] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleBuscarPorId = () => {
    const areaSeleccionada = areas.find(a => a.idArea === busquedaId.trim());
    if (areaSeleccionada) {
      setForm(areaSeleccionada);
    } else {
      alert("No se encontró un área con ese ID");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const camposVacios = Object.entries(form).filter(([key, val]) => key !== "activo").some(([, val]) => typeof val === "string" && val.trim() === "");
    if (camposVacios) return alert("Por favor, completa todos los campos.");

    if (modo === "modificar") {
      const confirmar = confirm("¿Deseas actualizar esta área responsable?");
      if (!confirmar) return;
      setAreas(prev => prev.map(a => a.idArea === form.idArea ? { ...form } : a));
    } else if (modo === "eliminar") {
      const confirmar = confirm("¿Deseas marcar como inactiva esta área responsable?");
      if (!confirmar) return;
      setAreas(prev => prev.map(a => a.idArea === form.idArea ? { ...a, activo: false } : a));
    } else if (modo === "agregar") {
      setAreas(prev => [...prev, { ...form, activo: true }]);
    }

    setForm({
      idArea: "",
      unidad: "",
      reportaA: "",
      correo: "",
      titulo: "",
      nombre_responsable: "",
      apellidoP_responsable: "",
      apellidoM_responsable: "",
      cargo_responsable: "",
      idPrograma: "",
      activo: true,
    });
    setModo(null);
  };

  const obtenerTitulo = () => {
    if (modo === "agregar") return "Agregar área responsable";
    if (modo === "modificar") return "Modificar área responsable";
    if (modo === "eliminar") return "Eliminar área responsable";
    return "Catálogo de Áreas Responsables";
  };

  const encabezados: { [key: string]: string } = {
    idArea: "ID Área",
    unidad: "Unidad",
    reportaA: "Reporta A",
    correo: "Correo Electrónico",
    titulo: "Título",
    nombre_responsable: "Nombre Responsable",
    apellidoP_responsable: "Apellido P Responsable",
    apellidoM_responsable: "Apellido M Responsable",
    cargo_responsable: "Cargo Responsable",
    idPrograma: "ID Programa",
  };

  return (
    <div style={{ backgroundColor: "#222", color: "white", padding: "2rem" }}>
      <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>{obtenerTitulo()}</h2>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <input
          placeholder="Buscar por ID"
          value={busquedaId}
          onChange={(e) => setBusquedaId(e.target.value)}
          style={{ flex: 1, padding: "0.5rem" }}
        />
        <button onClick={handleBuscarPorId} style={{ backgroundColor: "#0077b6", color: "white", padding: "0.5rem 1rem" }}>Buscar</button>
        <button onClick={() => setModo("agregar") } style={{ backgroundColor: "#004c75", color: "white", padding: "0.5rem 1rem" }}>Agregar</button>
        <button onClick={() => setModo("modificar") } style={{ backgroundColor: "#004c75", color: "white", padding: "0.5rem 1rem" }}>Modificar</button>
        <button onClick={() => setModo("eliminar") } style={{ backgroundColor: "#8B0000", color: "white", padding: "0.5rem 1rem" }}>Eliminar</button>
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input
            type="checkbox"
            checked={verInactivos}
            onChange={() => setVerInactivos(!verInactivos)}
          />
          Ver inactivos
        </label>
      </div>

      {modo && (
        <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
          {Object.entries(form).map(([key, value]) => (
            key !== "activo" && (
              <input
                key={key}
                name={key}
                placeholder={(encabezados[key] || key).toUpperCase()}
                value={typeof value === 'string' ? value : ''}
                onChange={handleChange}
                style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
                readOnly={modo === "eliminar" && key !== "idArea"}
              />
            )
          ))}
          <button type="submit" style={{ marginTop: "1rem", padding: "0.75rem 2rem", backgroundColor: modo === "eliminar" ? "#8B0000" : "#0077b6", color: "white", border: "none" }}>
            {modo === "modificar" ? "Actualizar" : modo === "eliminar" ? "Marcar inactivo" : "Guardar"}
          </button>
        </form>
      )}

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {Object.keys(form).filter(k => k !== "activo").map((key) => (
              <th key={key} style={thStyle}>{encabezados[key] || key.toUpperCase()}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {areas.filter(a => verInactivos || a.activo).map((a) => (
            <tr key={a.idArea} style={{ opacity: a.activo ? 1 : 0.5 }}>
              {Object.entries(a).filter(([k]) => k !== "activo").map(([key, val]) => (
                <td key={key} style={tdStyle}>{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  padding: "8px",
  backgroundColor: "#003B5C",
  color: "white",
};

const tdStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  padding: "8px",
  backgroundColor: "#fff",
  color: "#000",
};
