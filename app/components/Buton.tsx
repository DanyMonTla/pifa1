"use client";
import React from "react";
import styles from "../../src/app/page.module.css";

interface buton {
  numero: number;
  texto: string;
}

export default function buton({ numero, texto }: buton) {
  return (
    <div className={styles.buton}>
      <div className={styles.izquierda}>{numero}</div>
      <div className={styles.derecha}>{texto}</div>
    </div>
  );
}
