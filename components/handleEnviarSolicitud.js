// handleEnviarSolicitud.js
export async function handleEnviarSolicitud(datosSolicitud) {
  try {
    const response = await fetch('http://172.20.10.2/mascotas-api/endpoints/mascotas/registrar_solicitud.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datosSolicitud),
    });

    const data = await response.json();
    return data; // Devuelve { success: true/false, message: "..." }
  } catch (error) {
    console.error('Error enviando solicitud:', error);
    return { success: false, message: 'Error de red' };
  }
}
