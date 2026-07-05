// Simulated local database for Hynet Internal Operations
// Uses localStorage for state persistence between pages

const DEFAULT_USERS = [
  {
    id: "HYN-0001",
    name: "Lucía Fernández",
    email: "l.fernandez@hynet.net",
    role: "Súper Administrador",
    roleKey: "super_admin", // rbac key
    department: "Administración",
    status: "Activo", // Activo or Inactivo
    avatarText: "LF",
    avatarColor: "bg-red-500",
    shift: "Turno Mañana (08:00 - 17:00)",
    phone: "+54 11 4987-6543"
  },
  {
    id: "HYN-0002",
    name: "Ricardo Arispe",
    email: "r.arispe@hynet.net",
    role: "Director de Operaciones",
    roleKey: "director",
    department: "Gerencia",
    status: "Activo",
    avatarText: "RA",
    avatarColor: "bg-blue-500",
    shift: "Turno Mañana (08:00 - 17:00)",
    phone: "+54 11 5566-7788"
  },
  {
    id: "HYN-0003",
    name: "Alejandro Martínez",
    email: "a.martinez@hynet.net",
    role: "Técnico Especialista",
    roleKey: "tecnico",
    department: "Soporte",
    status: "Activo",
    avatarText: "AM",
    avatarColor: "bg-emerald-500",
    shift: "Rotativo SOC (14:00 - 22:00)",
    phone: "+54 11 9988-7766"
  },
  {
    id: "HYN-0004",
    name: "Elena Rodríguez",
    email: "e.rodriguez@hynet.net",
    role: "Auditor de Ciberseguridad",
    roleKey: "auditor",
    department: "Ciberseguridad",
    status: "Activo",
    avatarText: "ER",
    avatarColor: "bg-purple-500",
    shift: "Turno Tarde (12:00 - 20:00)",
    phone: "+57 300 123-4567"
  },
  {
    id: "HYN-0005",
    name: "Javier Gómez",
    email: "j.gomez@hynet.net",
    role: "Ingeniero de Sistemas",
    roleKey: "ingeniero",
    department: "Implementaciones",
    status: "Inactivo",
    avatarText: "JG",
    avatarColor: "bg-slate-500",
    shift: "Turno Mañana (08:00 - 17:00)",
    phone: "+1 305 555-0199"
  }
];

const DEFAULT_TASKS = [
  {
    id: "tsk-101",
    userId: "HYN-0002", // Ricardo Arispe
    title: "Auditoría de Protocolos",
    description: "Revisión exhaustiva de los protocolos de seguridad perimetral para el nodo central. Fecha límite: Viernes 18:00.",
    priority: "Alta", // Alta, Recurrente, Completado, Urgente
    progress: 75
  },
  {
    id: "tsk-102",
    userId: "HYN-0002",
    title: "Coordinación de Equipo",
    description: "Sincronización diaria con los jefes de cuadrilla para asegurar la continuidad operativa en los sectores A y B.",
    priority: "Recurrente",
    progress: 40
  },
  {
    id: "tsk-103",
    userId: "HYN-0002",
    title: "Certificación ISO 27001",
    description: "Validación final de los activos digitales críticos para el cumplimiento de la norma internacional.",
    priority: "Completado",
    progress: 100
  },
  {
    id: "tsk-104",
    userId: "HYN-0002",
    title: "Respuesta Incidentes",
    description: "Mantener canal abierto para la escalación de cualquier anomalía detectada en el portal de clientes.",
    priority: "Urgente",
    progress: 15
  },
  // Alejandro Martínez
  {
    id: "tsk-201",
    userId: "HYN-0003",
    title: "Monitoreo del SOC Nivel 2",
    description: "Análisis de alertas críticas procedentes de los firewalls perimetrales y sistemas IDS del data center.",
    priority: "Urgente",
    progress: 85
  },
  {
    id: "tsk-202",
    userId: "HYN-0003",
    title: "Resolución de Tickets Críticos",
    description: "Atención prioritaria y escalado de incidencias complejas de routing y conectividad de clientes corporativos.",
    priority: "Alta",
    progress: 60
  },
  // Elena Rodríguez
  {
    id: "tsk-301",
    userId: "HYN-0004",
    title: "Análisis de Vulnerabilidades",
    description: "Ejecución de escaneos periódicos sobre el segmento de red interna del SOC y reporte de remediaciones.",
    priority: "Alta",
    progress: 90
  },
  // Lucía Fernández
  {
    id: "tsk-401",
    userId: "HYN-0001",
    title: "Revisión de Roles RBAC",
    description: "Validación de políticas de privilegios mínimos para nuevos ingresos al equipo del SOC.",
    priority: "Completado",
    progress: 100
  }
];

const DEFAULT_AUDIT_LOGS = [
  {
    timestamp: "2026-07-04T10:15:30-03:00",
    userId: "SYSTEM",
    username: "Sistema Hynet",
    action: "Inicialización de Base de Datos",
    details: "Valores predeterminados configurados correctamente.",
    status: "Éxito",
    ip: "127.0.0.1"
  },
  {
    timestamp: "2026-07-04T12:30:14-03:00",
    userId: "HYN-0001",
    username: "Lucía Fernández",
    action: "Login Exitoso",
    details: "Acceso concedido al Portal de Administración.",
    status: "Éxito",
    ip: "190.111.45.89"
  }
];

// Helper to initialize and retrieve database
class HynetDB {
  static init() {
    if (!localStorage.getItem("hynet_users")) {
      localStorage.setItem("hynet_users", JSON.stringify(DEFAULT_USERS));
    }
    if (!localStorage.getItem("hynet_tasks")) {
      localStorage.setItem("hynet_tasks", JSON.stringify(DEFAULT_TASKS));
    }
    if (!localStorage.getItem("hynet_audit_logs")) {
      localStorage.setItem("hynet_audit_logs", JSON.stringify(DEFAULT_AUDIT_LOGS));
    }
  }

  static getUsers() {
    this.init();
    return JSON.parse(localStorage.getItem("hynet_users"));
  }

  static saveUsers(users) {
    localStorage.setItem("hynet_users", JSON.stringify(users));
  }

  static updateUserRoleAndDept(userId, role, department, status) {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      const oldUser = users[userIndex];
      users[userIndex].role = role;
      users[userIndex].department = department;
      users[userIndex].status = status;
      
      // Update roleKey helper
      const rKey = role.toLowerCase().replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u').replace(/\s+/g, '_');
      users[userIndex].roleKey = rKey.includes("admin") ? "super_admin" : rKey;
      
      this.saveUsers(users);

      // Log this action
      const currentUser = JSON.parse(sessionStorage.getItem("hynet_session") || "{}");
      this.addAuditLog(
        currentUser.id || "HYN-0001",
        currentUser.name || "Lucía Fernández",
        "Modificación de Usuario",
        `Se editó el usuario ${oldUser.name}. Nuevo Rol: ${role}, Depto: ${department}, Estado: ${status}`,
        "Éxito"
      );
      return true;
    }
    return false;
  }

  static getTasks() {
    this.init();
    return JSON.parse(localStorage.getItem("hynet_tasks"));
  }

  static getTasksForUser(userId) {
    return this.getTasks().filter(t => t.userId === userId);
  }

  static getAuditLogs() {
    this.init();
    return JSON.parse(localStorage.getItem("hynet_audit_logs"));
  }

  static addAuditLog(userId, username, action, details, status) {
    this.init();
    const logs = JSON.parse(localStorage.getItem("hynet_audit_logs"));
    const newLog = {
      timestamp: new Date().toISOString(),
      userId: userId,
      username: username,
      action: action,
      details: details,
      status: status,
      ip: "192.168.10." + Math.floor(Math.random() * 254 + 1)
    };
    logs.unshift(newLog); // Put new logs at the beginning
    localStorage.setItem("hynet_audit_logs", JSON.stringify(logs));
  }
}

// Auto-initialize DB when script loads
HynetDB.init();
window.HynetDB = HynetDB;
