#====================================================================================================

INICIO - Protocolo de pruebas - NO EDITAR NI ELIMINAR ESTA SECCIÓN
#====================================================================================================

ESTA SECCIÓN CONTIENE INSTRUCCIONES CRÍTICAS DE PRUEBA PARA AMBOS AGENTES
TANTO MAIN_AGENT COMO TESTING_AGENT DEBEN PRESERVAR ESTE BLOQUE COMPLETO
Protocolo de comunicación:
Si el testing_agent está disponible, el agente principal debe delegar todas las tareas de prueba en él.
Tenés acceso a un archivo llamado test_result.md. Este archivo contiene el estado completo de las pruebas
y el historial, y es el medio principal de comunicación entre el agente principal y el agente de prueba.
Los agentes principal y de prueba deben seguir este formato exacto para mantener los datos de prueba.
Los datos de prueba deben ingresarse en formato yaml. A continuación está la estructura de datos:
user_problem_statement: {problem_statement}
backend:
- task: "Nombre de la tarea"
implemented: true
working: true # o false o "NA"
file: "file_path.py"
stuck_count: 0
priority: "high" # o "medium" o "low"
needs_retesting: false
status_history:
-working: true # o false o "NA"
-agent: "main" # o "testing" o "user"
-comment: "Comentario detallado sobre el estado"
frontend:
- task: "Nombre de la tarea"
implemented: true
working: true # o false o "NA"
file: "file_path.js"
stuck_count: 0
priority: "high" # o "medium" o "low"
needs_retesting: false
status_history:
-working: true # o false o "NA"
-agent: "main" # o "testing" o "user"
-comment: "Comentario detallado sobre el estado"
metadata:
created_by: "main_agent"
version: "1.0"
test_sequence: 0
run_ui: false
test_plan:
current_focus:
- "Nombre de la tarea 1"
- "Nombre de la tarea 2"
stuck_tasks:
- "Nombre de la tarea con problemas persistentes"
test_all: false
test_priority: "high_first" # o "sequential" o "stuck_first"
agent_communication:
-agent: "main" # o "testing" o "user"
-message: "Mensaje de comunicación entre agentes"
Guías de protocolo para el agente principal
1. Actualizar el archivo de resultados de prueba antes de probar:
- El agente principal siempre debe actualizar el archivo test_result.md antes de llamar al agente de prueba
- Agregar detalles de implementación al status_history
- Configurar needs_retesting en true para las tareas que necesiten prueba
- Actualizar la sección test_plan para guiar las prioridades de prueba
- Agregar un mensaje a agent_communication explicando lo que se hizo
2. Incorporar retroalimentación del usuario:
- Cuando un usuario da feedback de que algo funciona o no, agregar esta información al status_history de la tarea correspondiente
- Actualizar el estado working según el feedback del usuario
- Si un usuario reporta un problema en una tarea marcada como working, incrementar el stuck_count
- Siempre que el usuario reporte un problema en la app, si tenemos testing agent y task_result.md, encontrar la tarea apropiada y añadir en status_history la preocupación y el problema del usuario
3. Rastrear tareas atascadas:
- Monitorear qué tareas tienen stuck_count alto o donde se arregla el mismo problema repetidamente, analizarlo al leer task_result.md
- Para problemas persistentes, usar la herramienta de búsqueda web para encontrar soluciones
- Prestar especial atención a las tareas en la lista stuck_tasks
- Cuando se arregle un problema en una tarea atascada, no resetear el stuck_count hasta que el agente de prueba confirme que funciona
4. Proporcionar contexto al agente de prueba:
- Al llamar al agente de prueba, dar instrucciones claras sobre:
- Qué tareas necesitan prueba (referencia en test_plan)
- Cualquier detalle de autenticación o configuración necesario
- Escenarios de prueba específicos en los que enfocarse
- Problemas conocidos o casos límite a verificar
5. Llamar al agente de prueba con instrucciones específicas referidas a test_result.md
IMPORTANTE: El agente principal debe SIEMPRE actualizar test_result.md ANTES de llamar al agente de prueba, ya que este archivo es la fuente para entender qué probar a continuación.
#====================================================================================================

FIN - Protocolo de pruebas - NO EDITAR NI ELIMINAR ESTA SECCIÓN
#====================================================================================================

#====================================================================================================

Datos de prueba - El agente principal y el subagente de prueba deben registrar datos de prueba debajo de esta sección
#====================================================================================================