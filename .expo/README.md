¿Por qué tengo una carpeta llamada ".expo" en mi proyecto?

La carpeta ".expo" se crea cuando un proyecto de Expo se inicia usando el comando expo start.

¿Qué contienen los archivos?

"devices.json": contiene información sobre los dispositivos que han abierto recientemente este proyecto. Se usa para poblar la lista de "Sesiones de desarrollo" en tus builds de desarrollo.

"packager-info.json": contiene números de puerto y PIDs de procesos que se usan para servir la aplicación al dispositivo móvil/simulador.

"settings.json": contiene la configuración del servidor que se usa para servir el manifiesto de la aplicación.

¿Debo hacer commit de la carpeta ".expo"?

No, no deberías compartir la carpeta ".expo". No contiene información relevante para otros desarrolladores que trabajen en el proyecto, es específica de tu máquina.

Al crear el proyecto, la carpeta ".expo" ya está agregada a tu archivo ".gitignore".