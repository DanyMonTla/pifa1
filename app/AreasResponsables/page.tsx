"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import AreasRespFormulario from "../components/AreasRespFormulario";

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
  const [soloVisualizacion, setSoloVisualizacion] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [idBuscadoMostrado, setIdBuscadoMostrado] = useState<string | null>(null);

  const API_URL = "http://localhost:3001/areas-responsables";

  const encabezados: { [key: string]: string } = {
    nid_area: "ID Área",
    cunidad_responsable: "Unidad Responsable",
    creporta_a: "Reporta A",
    ccorreo_electronico_ur: "Correo Electrónico",
    dfecha_alta: "Fecha Alta",
    dfecha_baja: "Fecha Baja",
    bhabilitado: "Habilitado",
  };

  useEffect(() => {
    const obtenerAreas = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();

        const areasConvertidas = (Array.isArray(data) ? data : data.areas || []).map((a: any) => ({
          ...a,
          bhabilitado: typeof a.bhabilitado === "object"
            ? a.bhabilitado?.data?.[0] === 1
            : Boolean(a.bhabilitado),
        }));

        setAreas(areasConvertidas);
      } catch (err) {
        console.error(err);
        alert("No se pudieron cargar las áreas desde el servidor.");
      }
    };
    obtenerAreas();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        setMensaje("Área modificada exitosamente");
      } else if (modo === "eliminar") {
        const confirmar = confirm("¿Deseas marcar como inactiva esta área responsable?");
        if (!confirmar) return;
        await fetch(`${API_URL}/estado/${form.nid_area}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bhabilitado: false,
            dfecha_baja: new Date().toISOString().slice(0, 10),
          }),
        });
        setMensaje("Área marcada como inactiva");
      } else if (modo === "agregar") {
        await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        setMensaje("Área agregada exitosamente");
      }

      setTimeout(() => setMensaje(""), 3000);
      resetForm();
      const res = await fetch(API_URL);
      const data = await res.json();
      const areasConvertidas = (Array.isArray(data) ? data : data.areas || []).map((a: any) => ({
        ...a,
        bhabilitado: typeof a.bhabilitado === "object"
          ? a.bhabilitado?.data?.[0] === 1
          : Boolean(a.bhabilitado),
      }));
      setAreas(areasConvertidas);
    } catch (err) {
      console.error(err);
      alert("Error al realizar la operación.");
    }
  };

  const resetForm = () => {
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
    setSoloVisualizacion(false);
    setIdBuscadoMostrado(null);
    setBusquedaId("");
  };

  const handleBuscarPorId = () => {
    const idBuscado = parseInt(busquedaId.trim());
    const areaSeleccionada = areas.find(a => parseInt(a.nid_area) === idBuscado);

    if (areaSeleccionada) {
      setForm({
        ...areaSeleccionada,
        nid_area: String(areaSeleccionada.nid_area),
      });
      setModo(null);
      setSoloVisualizacion(true);
      setIdBuscadoMostrado(busquedaId.trim());
    } else {
      alert("No se encontró un área con ese ID");
      setIdBuscadoMostrado(null);
    }
  };

  const obtenerTitulo = () => {
    if (modo === "agregar") return "Agregar área responsable";
    if (modo === "modificar") return "Modificar área responsable";
    if (modo === "eliminar") return "Eliminar área responsable";
    if (soloVisualizacion) return "Visualización de área responsable";
    return "Catálogo de Áreas Responsables";
  };

  return (
    <div style={{ backgroundColor: "#222", color: "white", padding: "2rem" }}>
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>{obtenerTitulo()}</h2>

      {mensaje && (
        <div style={{
          backgroundColor: "green",
          padding: "1rem",
          color: "white",
          textAlign: "center",
          borderRadius: "8px",
          marginBottom: "1rem"
        }}>
          ✅ {mensaje}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleBuscarPorId();
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
        <button type="button" onClick={() => { resetForm(); setModo("agregar"); }} style={btnStyle("#004c75")}>Agregar</button>
        <button type="button" onClick={() => setModo("modificar")} style={btnStyle("#004c75")}>Modificar</button>
        <button type="button" onClick={() => setModo("eliminar")} style={btnStyle("#8B0000")}>Eliminar</button>
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input
            type="checkbox"
            checked={verInactivos}
            onChange={() => setVerInactivos(!verInactivos)}
          />
          Ver inhabilitados
        </label>
      </form>

      <AreasRespFormulario
        form={form}
        modo={modo}
        soloVisualizacion={soloVisualizacion}
        encabezados={encabezados}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "2rem" }}>
        <thead>
          <tr>
            {Object.keys(form).map((key) => (
              <th key={key} style={thStyle}>{encabezados[key] || key.toUpperCase()}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {areas
            .filter(a => verInactivos || a.bhabilitado)
            .map(a => (
              <tr key={a.nid_area} style={{ opacity: a.bhabilitado ? 1 : 0.5 }}>
                {Object.entries(a).map(([key, val]) => (
                  <td key={key} style={{
                    ...tdStyle,
                    color: key === "bhabilitado" ? (a.bhabilitado ? "green" : "red") : "#000"
                  }}>
                    {key === "bhabilitado" ? (val ? "Sí" : "No") : val}
                  </td>
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
};

const btnStyle = (color: string): React.CSSProperties => ({
  backgroundColor: color,
  color: "white",
  padding: "0.5rem 1rem",
  border: "none",
  cursor: "pointer",
});
