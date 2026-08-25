<?php
/**
 * contact-config.sample.php — PLANTILLA. Copiar como contact-config.php y subir FUERA
 * del web root (a /home/<usuario-cpanel>/contact-config.php, NO dentro de public_html).
 * contact.php lo carga con require dirname(__DIR__).'/contact-config.php'.
 * El archivo real con secretos NO se commitea (ver .gitignore).
 */
return [
    // ── Seguridad del form (validación server-side por Origin/Referer) ────────
    'ALLOWED_ORIGINS' => ['mobileone.dotsolutions.io', 'www.mobileone.dotsolutions.io'],

    // ── ClickUp (opcional — dejar vacío para desactivar, solo llega por correo) ─
    'CLICKUP_TOKEN'   => '',   // token personal o de app
    'CLICKUP_LIST_ID' => '',   // ID de la lista destino

    // Mapear campos del form a Custom Fields de ClickUp (dejar vacío para usar solo la descripción)
    'CLICKUP_CUSTOM_FIELDS' => [
        // 'nombre'    => 'field-uuid',  // short_text (nombre completo)
        // 'email'     => 'field-uuid',  // email
        // 'phone'     => 'field-uuid',  // phone (se normaliza a E.164; si no valida, se omite)
        // 'company'   => 'field-uuid',  // short_text
        // 'industria' => 'field-uuid',  // short_text o dropdown
        // 'solucion'  => 'field-uuid',  // short_text o dropdown
    ],

    // Campos fijos/requeridos de la lista, enviados en cada tarea.
    // dropdown → value = option-uuid · users → value = ['add' => [userId]]
    'CLICKUP_EXTRA_FIELDS' => [
        // ['id' => 'field-uuid', 'value' => 'option-uuid'],
        // ['id' => 'field-uuid', 'value' => ['add' => [12345678]]],
    ],

    // ── SMTP (casilla del dominio) ───────────────────────────────────────────
    'SMTP_HOST'      => 'mail.dotsolutions.io',
    'SMTP_PORT'      => 465,               // 465 = SSL · 587 = STARTTLS
    'SMTP_USER'      => 'contacto@dotsolutions.io',
    'SMTP_PASS'      => 'XXXXXXXX',
    'SMTP_FROM'      => 'contacto@dotsolutions.io',
    'SMTP_FROM_NAME' => 'Mobile One',

    // ── Destino de la notificación ───────────────────────────────────────────
    'ADMIN_TO'       => 'contacto@dotsolutions.io',
];
