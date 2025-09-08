// listarSolicitudes.js
export async function listarSolicitudes() {
  try {
    const response = await fetch('http://172.20.10.2/mascotas-api/endpoints/mascotas/listar_solicitudes.php');
    const data = await response.json();
    return data.solicitudes || [];
  } catch (error) {
    console.error('Error listando solicitudes:', error);
    return [];
  }
}
