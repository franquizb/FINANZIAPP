# Pruebas de seguridad de las reglas de Firestore

72 ataques (y pruebas de control del uso normal) contra `../firestore.rules`,
en el **emulador local**: nunca tocan producción. Repítelas antes de desplegar
cualquier cambio de reglas.

```bash
cd app-financiera/pruebas-seguridad
npm install
npm test          # necesita Java y firebase-tools
```

Cada línea dice si el ataque queda bloqueado (✅), si es una debilidad
aceptada (⚠️) o si las reglas están rotas (❌, el comando sale con error).
Debilidades aceptadas a 7/11/2026: un usuario de pago o en prueba puede guardar
documentos grandes en sus propios datos; cualquier usuario con sesión ve la
lista de probadores de `ajustes/pagos` (hoy vacía); una cuenta sin verificar
puede usar la invitación de un correo que no es suyo, pero sin poder escribir
datos (el dueño real recupera la cuenta con «¿Olvidaste tu contraseña?").
