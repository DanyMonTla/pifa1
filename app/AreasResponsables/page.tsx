"use client";

import React, { useState, ChangeEvent } from "react";

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

type Programa = {
  id_programa: string;
  nombre_programa: string;
  id_tipo_programa: string;
  objetivo_pp: string;
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

  const [programas] = useState<Programa[]>([
    { id_programa: "P1", nombre_programa: "Programa A", id_tipo_programa: "1", objetivo_pp: "Objetivo A", activo: true },
    { id_programa: "P2", nombre_programa: "Programa B", id_tipo_programa: "2", objetivo_pp: "Objetivo B", activo: true },
  ]);

  const [asignaciones, setAsignaciones] = useState<{ [areaId: string]: string[] }>({});
  const [showModal, setShowModal] = useState(false);
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
    const camposVacios = Object.entries(form).filter(([key, val]) => key !== "activo")
      .some(([, val]) => typeof val === "string" && val.trim() === "");
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

  const handleCheckboxChange = (areaId: string, programaId: string) => {
    setAsignaciones(prev => {
      const current = prev[areaId] || [];
      if (current.includes(programaId)) {
        return { ...prev, [areaId]: current.filter(id => id !== programaId) };
      } else {
        return { ...prev, [areaId]: [...current, programaId] };
      }
    });
  };

  const handleGuardarAsignaciones = () => {
    console.log("Asignaciones guardadas:", asignaciones);
    setShowModal(false);
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
        <button onClick={handleBuscarPorId} style={btnStyle("#0077b6")}>Buscar</button>
        <button onClick={() => setModo("agregar")} style={btnStyle("#004c75")}>Agregar</button>
        <button onClick={() => setModo("modificar")} style={btnStyle("#004c75")}>Modificar</button>
        <button onClick={() => setShowModal(true)} style={btnStyle("#006400")}>AresResp_ProgramaPresu</button>
        <button onClick={() => setModo("eliminar")} style={btnStyle("#8B0000")}>Eliminar</button>
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
          <button type="submit" style={btnStyle(modo === "eliminar" ? "#8B0000" : "#0077b6", true)}>
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

      {/* Modal de Asignaciones */}
      {showModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
  <h3 style={{ textAlign: "center", marginBottom: "1rem" }}>Asignar Programas a Áreas</h3>
  <div style={{ maxHeight: "300px", overflowY: "auto", marginBottom: "1rem" }}>
    {areas.length === 0 ? (
      <p>No hay áreas registradas.</p>
    ) : (
      areas.map(area => (
        <div key={area.idArea} style={{ marginBottom: "1rem", borderBottom: "1px solid #ccc" }}>
          <strong style={{ color: "#003B5C" }}>{area.unidad}</strong>
          {programas.map(prog => (
            <div key={prog.id_programa}>
              <label>
                <input
                  type="checkbox"
                  checked={asignaciones[area.idArea]?.includes(prog.id_programa) || false}
                  onChange={() => handleCheckboxChange(area.idArea, prog.id_programa)}
                />
                {prog.nombre_programa}
              </label>
            </div>
          ))}
        </div>
      ))
    )}
  </div>
  <button onClick={handleGuardarAsignaciones} style={btnStyle("#0077b6")}>Guardar Cambios</button>
  <button onClick={() => setShowModal(false)} style={btnStyle("#8B0000")}>Cancelar</button>
</div>

        </div>
      )}
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

const modalOverlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0,0,0,0.7)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalContentStyle: React.CSSProperties = {
  backgroundColor: "white",
  color: "black",
  padding: "2rem",
  borderRadius: "8px",
  width: "400px",
  maxHeight: "80vh",
  overflowY: "auto",
};

const btnStyle = (color: string, fullWidth = false): React.CSSProperties => ({
  backgroundColor: color,
  color: "white",
  padding: "0.5rem 1rem",
  border: "none",
  cursor: "pointer",
  width: fullWidth ? "100%" : undefined,
  marginTop: fullWidth ? "1rem" : undefined,
});
