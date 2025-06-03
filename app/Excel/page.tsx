'use client' // Indica que este componente se ejecuta en el cliente (navegador)

import { useState } from 'react'
import * as XLSX from 'xlsx'
import './excel.css' // Importa los estilos personalizados

export default function ExcelPage() {
  // Estado para almacenar los datos cargados del archivo Excel/CSV
  const [data, setData] = useState<string[][]>([])

  // Función para limpiar una celda: remueve comillas, saltos de línea y espacios extras
  const cleanCell = (str: string) => {
    return str
      .replace(/^"|"$/g, '')     // elimina comillas al inicio/final
      .replace(/""/g, '"')       // convierte comillas dobles en una sola
      .replace(/\r|\n/g, '')     // elimina saltos de línea
      .trim()                    // elimina espacios al inicio/final
  }

  // Maneja la carga de archivos (xlsx, xls, csv)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()

    // Cuando se termina de leer el archivo
    reader.onload = (event) => {
      const binaryStr = event.target?.result

      // Procesa el contenido con SheetJS
      const workbook = XLSX.read(binaryStr, { type: 'binary' })
      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]

      // Convierte a CSV con separador ";"
      const csv = XLSX.utils.sheet_to_csv(sheet, { FS: ';' })

      // Convierte el CSV en una matriz bidimensional, limpiando celdas
      const parsedData = csv
        .split('\n')
        .filter(row => row.trim() !== '')
        .map(row => row.split(';').map(cell => cleanCell(cell)))

      // Guarda los datos en el estado
      setData(parsedData)
    }

    // Lee el archivo como cadena binaria
    reader.readAsBinaryString(file)
  }

  // Función para modificar el contenido de una celda cuando se edita
  const handleCellChange = (value: string, rowIdx: number, colIdx: number) => {
    const newData = [...data]
    newData[rowIdx][colIdx] = value
    setData(newData)
  }

  // Función que exporta los datos modificados como archivo .xlsx
  const handleExport = () => {
    const worksheet = XLSX.utils.aoa_to_sheet(data)             // convierte matriz a hoja
    const workbook = XLSX.utils.book_new()                      // crea nuevo libro
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Hoja1')  // agrega hoja
    XLSX.writeFile(workbook, 'archivo-editado.xlsx')            // guarda el archivo
  }

  return (
    <div className="excel-container">
      {/* Título principal */}
      <h1 className="excel-title">Visualizador de Excel / CSV</h1>

      {/* Controles: input de archivo + botón de exportar */}
      <div className="excel-controls">
  {/* Botón con mismo estilo visual que los otros */}
  <label className="custom-button">
    Seleccionar archivo
    <input
      type="file"
      accept=".xlsx,.xls,.csv"
      onChange={handleFileUpload}
      hidden
    />
  </label>

  {/* Botón de descarga */}
  {data.length > 0 && (
    <button onClick={handleExport} className="custom-button">
      Descargar Editado
    </button>
  )}
</div>


      {/* Tabla editable, si hay datos cargados */}
      {data.length > 0 && (
        <table className="excel-table">
          <thead>
            <tr>
              {/* Encabezados de columna */}
              {data[0].map((col, i) => (
                <th key={i}>{cleanCell(col)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Filas de datos (excepto encabezado) */}
            {data.slice(1).map((row, i) => {
              const isEmptyRow = row.every(cell => cell.trim() === '')
              if (isEmptyRow) return null // omite filas vacías

              return (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j}>
                      {/* Input editable para cada celda */}
                      <input
                        className="cell-input"
                        value={cell}
                        onChange={(e) => handleCellChange(e.target.value, i + 1, j)}
                      />
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}
