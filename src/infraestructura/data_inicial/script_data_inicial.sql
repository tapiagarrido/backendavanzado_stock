-- Insertar datos en la tabla de roles
INSERT INTO rol (nombre, descripcion) VALUES
    ('sistema', 'Usuario encargado de configuraciones del sistema a nivel estructura y datos'),
    ('administrador', 'Usuario encargado de administrar el uso de la aplicación en su contexto productivo'),
    ('basico', 'Usuario con acceso limitado a funciones específicas para el input de la aplicación');

-- Insertar datos en la tabla de configuracion
INSERT INTO configuracion (parametro) VALUES ('administrador_registrado');
