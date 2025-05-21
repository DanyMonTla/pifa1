"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import FormularioUsuario from "../components/FormularioUsuario";

type Usuario = {
  id_usuario: string;
  usuario: string;
  nombre_usuario: string;
  apellidoP: string;
  apellidoM: string;
  cargoUsuario: string;
  hashed_password: string;
  id_area: string;
  id_rol: string;
  correo_usuario: string;
  estado?: "activo" | "inactivo";
};

type Area = {
  idArea: string;
  unidad: string;
};

type Rol = {
  id_rol: string;
  rol: string;
};

export default function UsuariosCrud() {
  const [form, setForm] = useState<Usuario>({
    id_usuario: "",
    usuario: "",
    nombre_usuario: "",
    apellidoP: "",
    apellidoM: "",
    cargoUsuario: "",
    hashed_password: "",
    id_area: "",
    id_rol: "",
    correo_usuario: "",
    estado: "activo",
  });

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [areas] = useState<Area[]>([
    { idArea: "1", unidad: "Recursos Humanos" },
    { idArea: "2", unidad: "Finanzas" },
  ]);
  const [roles] = useState<Rol[]>([
    { id_rol: "1", rol: "Admin" },
    { id_rol: "2", rol: "User" },
  ]);

  const [busquedaId, setBusquedaId] = useState("");
  const [mostrarInactivos, setMostrarInactivos] = useState(false);
  const [modo, setModo] = useState<"agregar" | "modificar" | "eliminar" | "ver" | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  function mapUsuarioFormToApi(usuarioForm: Usuario) {
    return {
      usuario: usuarioForm.usuario,
      nombreUsuario: usuarioForm.nombre_usuario,
      apellidoPaterno: usuarioForm.apellidoP,
      apellidoMaterno: usuarioForm.apellidoM,
      cargoUsuario: usuarioForm.cargoUsuario,
      hashedPassword: usuarioForm.hashed_password,
      idArea: Number(usuarioForm.id_area),
      idRol: Number(usuarioForm.id_rol),
      correoUsuario: usuarioForm.correo_usuario,
      estado: usuarioForm.estado ?? "activo",
    };
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let mensajeConfirmacion = "";
    if (modo === "agregar") mensajeConfirmacion = "¿Estás seguro de que deseas agregar este usuario?";
    if (modo === "modificar") mensajeConfirmacion = "¿Deseas realmente actualizar este usuario?";
    if (modo === "eliminar") mensajeConfirmacion = "¿Estás seguro de que deseas desactivar este usuario?";

    const confirmar = confirm(mensajeConfirmacion);
    if (!confirmar) return;

    if (modo === "modificar") {
      actualizarUsuario();
    } else if (modo === "eliminar") {
      eliminarUsuario();
    } else if (modo === "agregar") {
      crearUsuario();
    }

    setForm((prev) => ({
      ...prev,
      id_usuario: modo === "agregar" ? "" : prev.id_usuario,
      usuario: "",
      nombre_usuario: "",
      apellidoP: "",
      apellidoM: "",
      cargoUsuario: "",
      hashed_password: "",
      id_area: "",
      id_rol: "",
      correo_usuario: "",
      estado: "activo",
    }));

    setModo(null);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const fetchUsuarios = async () => {
    try {
      const response = await fetch("http://localhost:3001/usuarios");
      const data = await response.json();

      if (!Array.isArray(data)) {
        console.error("La respuesta no es un arreglo:", data);
        return;
      }

      const usuariosMapeados = data.map((u: any) => ({
        id_usuario: u.idUsuario.toString(),
        usuario: u.usuario ?? "",
        nombre_usuario: u.nombreUsuario,
        apellidoP: u.apellidoPaterno,
        apellidoM: u.apellidoMaterno,
        cargoUsuario: u.cargoUsuario,
        hashed_password: u.hashedPassword,
        id_area: u.idArea?.toString() ?? "",
        id_rol: u.idRol?.toString() ?? "",
        correo_usuario: u.correoUsuario ?? "",
        estado: u.estado === "activo" || u.estado === "inactivo" ? u.estado : "activo",
      }));

      setUsuarios(usuariosMapeados);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  const crearUsuario = async () => {
    try {
      const usuarioParaApi = mapUsuarioFormToApi(form);
      const response = await fetch("http://localhost:3001/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuarioParaApi),
      });

      if (!response.ok) {
        const mensaje = await response.text();
        throw new Error("Error al crear usuario: " + mensaje);
      }

      await fetchUsuarios();
    } catch (error) {
      console.error("Error al agregar:", error);
    }
  };

  const actualizarUsuario = async () => {
    try {
      const usuarioParaApi = mapUsuarioFormToApi(form);
      const response = await fetch(`http://localhost:3001/usuarios/${form.id_usuario}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuarioParaApi),
      });
      if (!response.ok) throw new Error("Error al actualizar");
      fetchUsuarios();
    } catch (error) {
      console.error("Error al modificar:", error);
    }
  };

  const eliminarUsuario = async () => {
    try {
      const response = await fetch(`http://localhost:3001/usuarios/estado/${form.id_usuario}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: "inactivo" }),
      });

      const result = await response.json();
      console.log("Respuesta del backend al eliminar:", result);

      if (!response.ok || !result?.mensaje) throw new Error("Error al desactivar usuario");

      fetchUsuarios();
    } catch (error) {
      console.error("Error al desactivar:", error);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  return (
    <div style={{ backgroundColor: "#222", color: "white", padding: "2rem" }}>
      <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>
        {modo === "agregar" ? "Agregar nuevo usuario" :
         modo === "modificar" ? "Modificar usuario" :
         modo === "eliminar" ? "Eliminar usuario" :
         "Catálogo de Usuarios"}
      </h2>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <input
          placeholder="Buscar por ID"
          value={busquedaId}
          onChange={(e) => setBusquedaId(e.target.value)}
          style={{ flex: 1, padding: "0.5rem" }}
        />
       <button
        onClick={() => {
          const idBuscado = busquedaId.trim();
          const user = usuarios.find(u => u.id_usuario.trim() === idBuscado);

          if (user) {
            setForm(user);
            setModo("ver");
          } else {
            alert("No se encontró un usuario con ese ID");
          }
        }}
        style={btnStyle("#0077b6")}
      >
        Buscar
      </button>

        <button onClick={() => setModo("agregar")} style={btnStyle("#004c75")}>Agregar</button>
        <button
          onClick={() => {
            if (!form.id_usuario) {
              alert("Primero busca un usuario válido para modificar.");
              return;
            }
            setModo("modificar");
          }}
          style={btnStyle("#004c75")}
        >
          Modificar
        </button>
        <button onClick={() => setModo("eliminar")} style={btnStyle("#8B0000")}>Eliminar</button>
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input
            type="checkbox"
            checked={mostrarInactivos}
            onChange={() => setMostrarInactivos(prev => !prev)}
          /> Ver inactivos
        </label>
      </div>

      {modo && (
        <FormularioUsuario
          form={form}
          modo={modo}
          areas={areas}
          roles={roles}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      )}

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Usuario</th>
            <th style={thStyle}>Nombre</th>
            <th style={thStyle}>Apellido P</th>
            <th style={thStyle}>Apellido M</th>
            <th style={thStyle}>Cargo</th>
            <th style={thStyle}>ID Área</th>
            <th style={thStyle}>ID Rol</th>
            <th style={thStyle}>Correo</th>
            <th style={thStyle}>Estado</th>
          </tr>
        </thead>
        <tbody>
          {usuarios
            .filter(u => mostrarInactivos || u.estado !== "inactivo")
            .map((u, i) => (
              <tr key={u.id_usuario || i} style={u.estado === "inactivo" ? { opacity: 0.5 } : {}}>
                <td style={tdStyle}>{u.id_usuario}</td>
                <td style={tdStyle}>{u.usuario}</td>
                <td style={tdStyle}>{u.nombre_usuario}</td>
                <td style={tdStyle}>{u.apellidoP}</td>
                <td style={tdStyle}>{u.apellidoM}</td>
                <td style={tdStyle}>{u.cargoUsuario}</td>
                <td style={tdStyle}>{u.id_area}</td>
                <td style={tdStyle}>{u.id_rol}</td>
                <td style={tdStyle}>{u.correo_usuario}</td>
                <td style={tdStyle}>{u.estado}</td>
              </tr>
            ))}
        </tbody>
      </table>

      {showSuccess && (
        <div style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#28a745",
          color: "white",
          padding: "1rem 2rem",
          borderRadius: "8px",
          zIndex: 1000,
          fontSize: "1.2rem",
          boxShadow: "0 0 10px rgba(0,0,0,0.5)"
        }}>
          Operación exitosa
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

const btnStyle = (color: string, fullWidth = false): React.CSSProperties => ({
  backgroundColor: color,
  color: "white",
  padding: "0.5rem 1rem",
  border: "none",
  cursor: "pointer",
  width: fullWidth ? "100%" : undefined,
  marginTop: fullWidth ? "1rem" : undefined,
});
