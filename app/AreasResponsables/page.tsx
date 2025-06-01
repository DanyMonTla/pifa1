"use client";

import React, { useState, useEffect, ChangeEvent } from "react";

type AreaResponsable = {
  nid_area: string;
  cunidad_responsable: string;
  creporta_a: string;
  ccorreo_electronico_ur: string;
  bhabilitado: boolean;
  dfecha_alta: string;
  dfecha_baja: string;
};

export default function AreasResponsablesCrud() {
  const [form, setForm] = useState<AreaResponsable>({
    nid_area: "",
    cunidad_responsable: "",
    creporta_a: "",
    ccorreo_electronico_ur: "",
    bhabilitado: true,
    dfecha_alta: "",
    dfecha_baja: "",
  });

  const [modo, setModo] = useState<"agregar" | "modificar" | "eliminar" | null>(null);
  const [areas, setAreas] = useState<AreaResponsable[]>([]);
  const [busquedaId, setBusquedaId] = useState("");
  const [verInactivos, setVerInactivos] = useState(false);

  const API_URL = "http://localhost:3001/areas-responsables";

  useEffect(() => {
    obtenerAreas();
  }, []);

  const obtenerAreas = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setAreas(data);
    } catch (error) {
      alert("No se pudo obtener la lista de áreas.");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleBuscarPorId = () => {
    const areaSeleccionada = areas.find(a => a.nid_area === busquedaId.trim());
    if (areaSeleccionada) {
      setForm(areaSeleccionada);
    } else {
      alert("No se encontró un área con ese ID");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const camposVacios = Object.entries(form)
      .filter(([key]) => key !== "bhabilitado" && key !== "dfecha_baja")
      .some(([, val]) => typeof val === "string" && val.trim() === "");
    if (camposVacios) return alert("Por favor, completa todos los campos.");

    try {
      if (modo === "modificar") {
        const confirmar = confirm("¿Deseas actualizar esta área responsable?");
        if (!confirmar) return;
        await fetch(`${API_URL}/${form.nid_area}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else if (modo === "eliminar") {
        const confirmar = confirm("¿Deseas marcar como inactiva esta área responsable?");
        if (!confirmar) return;
        await fetch(`${API_URL}/estado/${form.nid_area}`, {
          method: "PATCH",
        });
      } else if (modo === "agregar") {
        await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }

      await obtenerAreas();
      alert("Operación exitosa");

      setForm({
        nid_area: "",
        cunidad_responsable: "",
        creporta_a: "",
        ccorreo_electronico_ur: "",
        bhabilitado: true,
        dfecha_alta: "",
        dfecha_baja: "",
      });
      setModo(null);
    } catch (error) {
      alert("Error al realizar la operación.");
    }
  };

  const obtenerTitulo = () => {
    if (modo === "agregar") return "Agregar área responsable";
    if (modo === "modificar") return "Modificar área responsable";
    if (modo === "eliminar") return "Eliminar área responsable";
    return "Catálogo de Áreas Responsables";
  };

  const encabezados: { [key: string]: string } = {
    nid_area: "ID Área",
    cunidad_responsable: "Unidad Responsable",
    creporta_a: "Reporta A",
    ccorreo_electronico_ur: "Correo Electrónico",
    dfecha_alta: "Fecha Alta",
    dfecha_baja: "Fecha Baja",
    bhabilitado: "Habilitado",
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
        <button onClick={() => setModo("eliminar")} style={btnStyle("#8B0000")}>Eliminar</button>
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input
            type="checkbox"
            checked={verInactivos}
            onChange={() => setVerInactivos(!verInactivos)}
          />
          Ver inhabilitados
        </label>
      </div>

      {modo && (
        <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
          {Object.entries(form).map(([key, value]) => {
            if (key === "bhabilitado") return null;
            const isDateField = key === "dfecha_alta";
            return (
              <input
                key={key}
                name={key}
                type={isDateField ? "date" : "text"}
                placeholder={(encabezados[key] || key).toUpperCase()}
                value={typeof value === 'string' ? (isDateField ? value.slice(0, 10) : value) : ''}
                onChange={handleChange}
                style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
                readOnly={modo === "eliminar" || key === "dfecha_baja" || (modo !== "agregar" && key === "nid_area")}
              />
            );
          })}
          <button type="submit" style={btnStyle(modo === "eliminar" ? "#8B0000" : "#0077b6", true)}>
            {modo === "modificar" ? "Actualizar" : modo === "eliminar" ? "Marcar inactivo" : "Guardar"}
          </button>
        </form>
      )}

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {["nid_area", "cunidad_responsable", "creporta_a", "ccorreo_electronico_ur", "dfecha_alta", "dfecha_baja", "bhabilitado"].map((key) => (
              <th key={key} style={thStyle}>
                {encabezados[key] || key.toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.isArray(areas) &&
            areas
              .filter((a) => verInactivos || a.bhabilitado)
              .map((a) => (
                <tr key={a.nid_area} style={{ opacity: a.bhabilitado ? 1 : 0.5 }}>
                  <td style={tdStyle}>{a.nid_area}</td>
                  <td style={tdStyle}>{a.cunidad_responsable}</td>
                  <td style={tdStyle}>{a.creporta_a}</td>
                  <td style={tdStyle}>{a.ccorreo_electronico_ur}</td>
                  <td style={tdStyle}>{a.dfecha_alta}</td>
                  <td style={tdStyle}>{a.dfecha_baja}</td>
                  <td style={{ ...tdStyle, color: a.bhabilitado ? "green" : "red", fontWeight: "bold" }}>
                    {a.bhabilitado ? "Sí" : "No"}
                  </td>
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

const btnStyle = (color: string, fullWidth = false): React.CSSProperties => ({
  backgroundColor: color,
  color: "white",
  padding: "0.5rem 1rem",
  border: "none",
  cursor: "pointer",
  width: fullWidth ? "100%" : undefined,
  marginTop: fullWidth ? "1rem" : undefined,
});
