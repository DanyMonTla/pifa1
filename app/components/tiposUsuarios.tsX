export interface Usuario {
  cid_usuario: number | string;
  cnombre_usuario: string;
  rfc: string; // ← nuevo campo
  capellido_p_usuario: string;
  capellido_m_usuario: string;
  ccargo_usuario: string;
  chashed_password: string;
  nid_area: string;
  nid_rol: string;
  btitulo_usuario: string;
  bhabilitado: boolean;
  dfecha_alta: string;
  dfecha_baja?: string;
}


export type Area = {
  idArea: string;
  unidad: string;
  rawUnidad: string;
};

export type Rol = {
  id_rol: string;
  rol: string;
  rawRol: string;
};