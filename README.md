Al cargar la página por primera vez el SW pasa por installing (se ejecuta el evento install y se cachean los archivos), luego activated y finalmente running cuando empieza a interceptar peticiones.

Si modifico el código (por ejemplo cambio el texto del console.log), al recargar aparece en waiting porque hay una pestaña abierta con la versión anterior.

¿Qué hacer para activar la nueva versión?

En este caso no hace falta hacer nada extra porque el código ya tiene self.skipWaiting() en el install y clients.claim() en el activate, así que la nueva versión se activa sola al recargar.

Sin esas líneas habría que pulsar "Skip waiting" en DevTools o cerrar todas las pestañas.