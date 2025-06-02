export type Usuario = {
  cid_usuario: string;
  cnombre_usuario: string;
  capellido_p_usuario: string;
  capellido_m_usuario: string;
  ccargo_usuario: string;
  chashed_password: string;
  nid_area: string;
  nid_rol: string;
  btitulo_usuario: string;
  bhabilitado: boolean;
  dfecha_alta: string;
  dfecha_baja: string;
};

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
