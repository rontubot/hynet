// Authentication and Route Protection Layer for Hynet Portal
// Persists active session in sessionStorage for safety

class HynetAuth {
  // Validate basic credentials
  static validateCredentials(employeeId, password) {
    const users = window.HynetDB.getUsers();
    const user = users.find(u => u.id.toUpperCase() === employeeId.toUpperCase().trim());
    
    if (!user) {
      window.HynetDB.addAuditLog("SYSTEM", "Visitante", "Intento de Acceso", `ID de empleado no registrado: ${employeeId}`, "Fallo");
      return { success: false, message: "ID de Empleado no registrado" };
    }
    
    if (user.status !== "Activo") {
      window.HynetDB.addAuditLog(user.id, user.name, "Intento de Acceso", `Intento de login con cuenta inactiva.`, "Bloqueado");
      return { success: false, message: "Esta cuenta está inactiva. Contacte al administrador." };
    }
    
    // Mock passwords: admin123 for admin, hynet123 for others
    const expectedPassword = user.roleKey === "super_admin" ? "admin123" : "hynet123";
    if (password !== expectedPassword) {
      window.HynetDB.addAuditLog(user.id, user.name, "Intento de Acceso", `Contraseña incorrecta ingresada.`, "Fallo");
      return { success: false, message: "Contraseña incorrecta" };
    }

    return { success: true, user: user };
  }

  // Generate 2FA Code
  static generateOTP(userId) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    sessionStorage.setItem(`hynet_otp_${userId}`, otp);
    return otp;
  }

  // Verify 2FA and establish session
  static verifyOTP(userId, enteredCode) {
    const actualOtp = sessionStorage.getItem(`hynet_otp_${userId}`);
    const users = window.HynetDB.getUsers();
    const user = users.find(u => u.id === userId);

    if (!user) return { success: false, message: "Usuario inválido" };

    if (enteredCode === actualOtp || enteredCode === "999999" /* Master OTP for easy testing */) {
      // Create session
      sessionStorage.setItem("hynet_session", JSON.stringify(user));
      sessionStorage.removeItem(`hynet_otp_${userId}`);
      
      // Log audit
      window.HynetDB.addAuditLog(user.id, user.name, "Login Exitoso", "Acceso concedido al portal tras verificación 2FA.", "Éxito");
      return { success: true, user: user };
    } else {
      window.HynetDB.addAuditLog(user.id, user.name, "MFA Fallido", "Código MFA incorrecto ingresado.", "Fallo");
      return { success: false, message: "Código de seguridad incorrecto" };
    }
  }

  // Get current active session
  static getCurrentUser() {
    const session = sessionStorage.getItem("hynet_session");
    if (!session) return null;
    return JSON.parse(session);
  }

  // End active session
  static logout() {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      window.HynetDB.addAuditLog(currentUser.id, currentUser.name, "Cierre de Sesión", "El usuario cerró sesión voluntariamente.", "Éxito");
    }
    sessionStorage.removeItem("hynet_session");
    // Redirect to home/login
    window.location.href = "../index.html";
  }

  // Check if session is active and user has rights
  static protectRoute(requiredRoleKey = null) {
    const user = this.getCurrentUser();
    
    // Redirect to login if no session exists
    if (!user) {
      window.location.href = "login.html";
      return false;
    }

    // Check if the user's status is still active in the database (real-time revoke)
    const freshUsers = window.HynetDB.getUsers();
    const freshUser = freshUsers.find(u => u.id === user.id);
    if (!freshUser || freshUser.status !== "Activo") {
      sessionStorage.removeItem("hynet_session");
      window.location.href = "login.html?inactive=true";
      return false;
    }

    // Check role authorization
    if (requiredRoleKey && freshUser.roleKey !== requiredRoleKey) {
      // Access Denied! Log this security violation
      window.HynetDB.addAuditLog(
        freshUser.id,
        freshUser.name,
        "Violación de Seguridad",
        `Intento no autorizado de acceder a página restringida (Rol requerido: ${requiredRoleKey}).`,
        "Intrusión Detectada"
      );
      
      // Redirect back to dashboard with error parameter
      window.location.href = "dashboard.html?denied=true";
      return false;
    }

    return true;
  }
}

window.HynetAuth = HynetAuth;
