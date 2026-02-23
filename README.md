Por la regla de ubicación (path restriction). El scope de un Service Worker nunca puede ser más amplio que la carpeta donde está el archivo sw.js.

Si sw.js está en sw.js, su scope máximo posible es /SW/. La raíz / está por encima de esa carpeta, por lo que el SW no puede controlarla. El navegador bloquea esto con un SecurityError de forma automática.

¿Es posible controlarlo sin mover el archivo?
Intentar esto en el registro no funciona por sí solo:

navigator.serviceWorker.register('/SW/sw.js', { scope: '/' });
// ❌ SecurityError: el scope '/' está fuera de /SW/

La única forma de permitirlo es que el servidor envíe la cabecera HTTP Service-Worker-Allowed al servir el archivo sw.js:

Service-Worker-Allowed: /

Con esa cabecera activa, el registro sí funcionaría:

navigator.serviceWorker.register('/SW/sw.js', { scope: '/' });
// ✅ funciona solo si el servidor envía Service-Worker-Allowed: /