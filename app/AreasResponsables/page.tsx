"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import AreasRespFormulario from "../components/AreasRespFormulario";
import AreasRespTabla from "../components/AreasRespTabla";
import AreasRespAcciones from "../components/AreasRespAcciones";

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
  const [error, setError] = useState("");
  const [idBuscadoMostrado, setIdBuscadoMostrado] = useState<string | null>(null);

  const API_URL = "http://localhost:3001/areas-responsables";

  const encabezados: { [key: string]: string } = {
    nid_area: "ID Área",
    cunidad_responsable: "Unidad Responsable",
    creporta_a: "Reporta A",
    ccorreo_electronico_ur: "Correo Electrónico",
    dfecha_alta: "Fecha Alta",
    bhabilitado: "Activo",
    dfecha_baja: "Fecha Baja",
  };

  useEffect(() => {
    obtenerAreas();
  }, []);

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

        const { nid_area, ...restoForm } = form;

        await fetch(`${API_URL}/${Number(nid_area)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(restoForm),
        });

        setMensaje("Área modificada exitosamente");

      } else if (modo === "eliminar") {
        if (!form.bhabilitado) {
          setError("Esta área ya está inactiva.");
          setTimeout(() => setError(""), 2000);
          return;
        }

        const confirmar = confirm("¿Deseas marcar como inactiva esta área responsable?");
        if (!confirmar) return;

        const fechaBaja = new Date().toISOString().slice(0, 10);

        await fetch(`${API_URL}/estado/${form.nid_area}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bhabilitado: false,
            dfecha_baja: fechaBaja,
          }),
        });

        setMensaje("Área marcada como inactiva");

      } else if (modo === "agregar") {
  const formAEnviar = {
    ...form,
    nid_area: Number(form.nid_area), // 🟢 Asegurar que vaya como número
    dfecha_alta: new Date(form.dfecha_alta), // 🟢 Convertir a Date si es string
    dfecha_baja: null // 🟢 No se debe enviar en alta
  };

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formAEnviar),
  });

  setMensaje("Área agregada exitosamente");
}



      await obtenerAreas();
      resetForm();
      setModo(null);
      setSoloVisualizacion(false);
      setIdBuscadoMostrado(null);
      setTimeout(() => setMensaje(""), 3000);
    } catch (err) {
      console.error(err);
      alert("Error al realizar la operación.");
    }
  };

  const reactivarArea = async () => {
    if (!form.nid_area) {
      setError("No hay área seleccionada.");
      return;
    }

    if (form.bhabilitado) {
      setError("El área ya está activa.");
      setTimeout(() => setError(""), 3000);
      return;
    }

    const confirmar = confirm("¿Deseas reactivar esta área responsable?");
    if (!confirmar) return;

    try {
      const res = await fetch(`${API_URL}/reactivar/${form.nid_area}`, {
        method: "PATCH",
      });

      if (!res.ok) {
        const errorBody = await res.json();
        throw new Error(errorBody.message || "Error al reactivar");
      }

      setMensaje("Área reactivada exitosamente");
      await obtenerAreas();

      setForm(prev => ({
        ...prev,
        bhabilitado: true,
        dfecha_baja: "",
      }));

      setModo(null);
      setSoloVisualizacion(false);
      setIdBuscadoMostrado(null);
      setTimeout(() => setMensaje(""), 3000);
    } catch (err: any) {
      console.error("Error al reactivar:", err);
      setError(err.message || "Error inesperado al reactivar");
      setTimeout(() => setError(""), 3000);
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

      if (modo === "modificar" || modo === "eliminar") {
        setSoloVisualizacion(false);
      } else {
        setModo(null);
        setSoloVisualizacion(true);
      }

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

      {error && (
        <div style={{
          backgroundColor: "#8B0000",
          padding: "1rem",
          color: "white",
          textAlign: "center",
          borderRadius: "8px",
          marginBottom: "1rem",
          fontWeight: "bold"
        }}>
          ⚠️ {error}
        </div>
      )}

      <AreasRespAcciones
        form={form}
        setModo={setModo}
        resetForm={resetForm}
        setSoloVisualizacion={setSoloVisualizacion}
        setError={setError}
        verInactivos={verInactivos}
        setVerInactivos={setVerInactivos}
        handleBuscar={handleBuscarPorId}
        busquedaId={busquedaId}
        setBusquedaId={setBusquedaId}
        puedeReactivar={verInactivos && !form.bhabilitado}
        reactivarArea={reactivarArea}
      />

      <AreasRespFormulario
        form={form}
        modo={modo}
        soloVisualizacion={soloVisualizacion}
        encabezados={encabezados}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />

      <AreasRespTabla
        areas={areas}
        verInactivos={verInactivos}
        encabezados={encabezados}
      />
    </div>
  );
}
