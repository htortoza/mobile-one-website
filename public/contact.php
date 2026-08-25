<?php
/**
 * contact.php — endpoint de contacto Mobile One (cPanel).
 * Mismo patrón que smartorder/public/contact.php: recibe el POST del formulario
 * estático (/contacto), valida que el Origin/Referer esté en ALLOWED_ORIGINS,
 * crea una tarea en ClickUp (si hay credenciales) y envía una notificación por
 * correo. Los secretos NO viven aquí: se cargan desde contact-config.php ubicado
 * FUERA del web root. Todo lead se registra primero en un log local, así nunca
 * se pierde aunque ClickUp/SMTP fallen.
 */
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['ok' => false, 'error' => 'Method not allowed']));
}

// ── Configuración (secretos fuera del web root) ─────────────────────────────
$cfgPath = dirname(__DIR__) . '/contact-config.php';
if (!is_file($cfgPath)) {
    http_response_code(500);
    exit(json_encode(['ok' => false, 'error' => 'Configuración no encontrada en el servidor.']));
}
$CFG = require $cfgPath;
$LEADS_LOG = dirname(__DIR__) . '/mobile-one-leads.log';

// ── Validar origen (anti-spam) — chequeo 100% server-side, nada expuesto en el front ──
$originHost = parse_url($_SERVER['HTTP_ORIGIN'] ?? $_SERVER['HTTP_REFERER'] ?? '', PHP_URL_HOST);
if (empty($CFG['ALLOWED_ORIGINS']) || !in_array($originHost, $CFG['ALLOWED_ORIGINS'], true)) {
    http_response_code(403);
    exit(json_encode(['ok' => false, 'error' => 'No autorizado.']));
}

// ── Leer y sanitizar entrada ────────────────────────────────────────────────
function s(string $k): string {
    return isset($_POST[$k]) ? trim(htmlspecialchars(strip_tags($_POST[$k]), ENT_QUOTES, 'UTF-8')) : '';
}

$nombre    = s('nombre');
$apellido  = s('apellido');
$email     = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL) ?: '';
$telefono  = s('telefono');
$empresa   = s('empresa');
$industria = s('industria');
$solucion  = s('solucion');
$reto      = s('reto');
$hp        = s('hp'); // honeypot

// Bot silencioso
if ($hp !== '') { exit(json_encode(['ok' => true])); }

// Validación — mismos campos requeridos que el formulario (telefono es opcional)
if (!$nombre || !$apellido || !$email || !$empresa || !$industria || !$solucion || !$reto) {
    http_response_code(422);
    exit(json_encode(['ok' => false, 'error' => 'Campos requeridos incompletos.']));
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    exit(json_encode(['ok' => false, 'error' => 'Correo inválido.']));
}

$fullName = "{$nombre} {$apellido}";
$fecha    = date('d/m/Y H:i');

// ── 0) Registrar el lead SIEMPRE (garantía anti-pérdida) ────────────────────
@file_put_contents(
    $LEADS_LOG,
    json_encode([
        'ts' => date('c'), 'nombre' => $fullName, 'email' => $email, 'telefono' => $telefono,
        'empresa' => $empresa, 'industria' => $industria, 'solucion' => $solucion, 'reto' => $reto,
    ], JSON_UNESCAPED_UNICODE) . "\n",
    FILE_APPEND | LOCK_EX
);

// ── Normaliza a E.164 (default Chile +56). Devuelve '' si no logra un E.164 válido. ──
function to_e164(string $tel, string $cc = '56'): string {
    $t = trim($tel);
    if ($t === '') return '';
    if ($t[0] === '+') {
        $digits = '+' . preg_replace('/\D/', '', substr($t, 1));
    } else {
        $d = preg_replace('/\D/', '', $t);
        if ($d === '') return '';
        if (strpos($d, $cc) === 0 && strlen($d) >= (strlen($cc) + 8)) {
            $digits = '+' . $d;
        } else {
            $digits = '+' . $cc . ltrim($d, '0');
        }
    }
    return preg_match('/^\+[1-9]\d{7,14}$/', $digits) ? $digits : '';
}

// ── 1) Crear tarea en ClickUp (no-op si no hay token/lista configurados) ────
function clickup_create_task(array $cfg, string $fullName, string $email, string $tel, string $empresa, string $industria, string $solucion, string $reto, string $fecha): bool {
    if (empty($cfg['CLICKUP_TOKEN']) || empty($cfg['CLICKUP_LIST_ID'])) return false;

    $desc = "**Producto:** Mobile One\n"
          . "**Empresa:** {$empresa}\n"
          . "**Nombre:** {$fullName}\n"
          . "**Correo:** {$email}\n"
          . "**Número:** {$tel}\n"
          . "**Industria:** {$industria}\n"
          . "**Solución de interés:** {$solucion}\n\n"
          . "**Reto empresarial:**\n{$reto}\n\n"
          . "---\nOrigen: mobileone.dotsolutions.io/contacto · {$fecha}";

    $payload = [
        'name'                 => $empresa,
        'markdown_description' => $desc,
    ];

    $map = $cfg['CLICKUP_CUSTOM_FIELDS'] ?? [];
    $custom = [];
    if (!empty($map['nombre']))    $custom[] = ['id' => $map['nombre'],    'value' => $fullName];
    if (!empty($map['email']))     $custom[] = ['id' => $map['email'],     'value' => $email];
    if (!empty($map['company']))   $custom[] = ['id' => $map['company'],   'value' => $empresa];
    if (!empty($map['industria'])) $custom[] = ['id' => $map['industria'], 'value' => $industria];
    if (!empty($map['solucion']))  $custom[] = ['id' => $map['solucion'],  'value' => $solucion];
    if (!empty($map['phone'])) {
        $e164 = to_e164($tel);
        if ($e164 !== '') $custom[] = ['id' => $map['phone'], 'value' => $e164];
    }

    foreach (($cfg['CLICKUP_EXTRA_FIELDS'] ?? []) as $ef) {
        if (!empty($ef['id']) && isset($ef['value'])) $custom[] = $ef;
    }

    if ($custom) $payload['custom_fields'] = $custom;

    $ch = curl_init("https://api.clickup.com/api/v2/list/{$cfg['CLICKUP_LIST_ID']}/task");
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 15,
        CURLOPT_HTTPHEADER     => [
            'Authorization: ' . $cfg['CLICKUP_TOKEN'],
            'Content-Type: application/json',
        ],
        CURLOPT_POSTFIELDS     => json_encode($payload, JSON_UNESCAPED_UNICODE),
    ]);
    $res  = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return $res !== false && $code >= 200 && $code < 300;
}

// ── 2) Notificación por correo (SMTP) ───────────────────────────────────────
function smtp_send(array $cfg, string $toAddr, string $subject, string $html, string $plain): void {
    $prefix = ((int)$cfg['SMTP_PORT'] === 465) ? 'ssl://' : '';
    $ctx    = stream_context_create(['ssl' => ['verify_peer' => false, 'verify_peer_name' => false]]);
    $sock   = @stream_socket_client("{$prefix}{$cfg['SMTP_HOST']}:{$cfg['SMTP_PORT']}", $errno, $errstr, 15, STREAM_CLIENT_CONNECT, $ctx);
    if (!$sock) throw new \RuntimeException("Conexión SMTP fallida: $errstr ($errno)");
    stream_set_timeout($sock, 15);

    $get = function () use ($sock): string {
        $r = '';
        while ($l = fgets($sock, 515)) { $r .= $l; if (isset($l[3]) && $l[3] === ' ') break; }
        return $r;
    };
    $put = function (string $line) use ($sock): void { fwrite($sock, $line . "\r\n"); };

    $get();
    $put('EHLO mobileone.dotsolutions.io'); $get();
    if ((int)$cfg['SMTP_PORT'] === 587) {
        $put('STARTTLS'); $get();
        stream_socket_enable_crypto($sock, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
        $put('EHLO mobileone.dotsolutions.io'); $get();
    }
    $put('AUTH LOGIN'); $get();
    $put(base64_encode($cfg['SMTP_USER'])); $get();
    $put(base64_encode($cfg['SMTP_PASS'])); $resp = $get();
    if (strpos($resp, '235') === false) throw new \RuntimeException("Autenticación SMTP fallida: $resp");

    $recipients = array_values(array_filter(array_map('trim', explode(',', $toAddr))));
    $put("MAIL FROM:<{$cfg['SMTP_FROM']}>"); $get();
    foreach ($recipients as $rcpt) { $put("RCPT TO:<{$rcpt}>"); $get(); }
    $put('DATA'); $get();

    $boundary = md5(uniqid((string)rand(), true));
    $subjEnc  = '=?UTF-8?B?' . base64_encode($subject) . '?=';
    $fromEnc  = '=?UTF-8?B?' . base64_encode($cfg['SMTP_FROM_NAME']) . '?=';

    $msg  = "Date: " . date('r') . "\r\n";
    $msg .= "From: {$fromEnc} <{$cfg['SMTP_FROM']}>\r\n";
    $msg .= "To: " . implode(', ', $recipients) . "\r\n";
    $msg .= "Subject: {$subjEnc}\r\n";
    $msg .= "MIME-Version: 1.0\r\n";
    $msg .= "Content-Type: multipart/alternative; boundary=\"{$boundary}\"\r\n\r\n";
    $msg .= "--{$boundary}\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n";
    $msg .= chunk_split(base64_encode($plain)) . "\r\n";
    $msg .= "--{$boundary}\r\nContent-Type: text/html; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n";
    $msg .= chunk_split(base64_encode($html)) . "\r\n";
    $msg .= "--{$boundary}--";

    fwrite($sock, $msg . "\r\n.\r\n");
    $get();
    $put('QUIT'); $get();
    fclose($sock);
}

function tpl_admin(string $fullName, string $email, string $tel, string $empresa, string $industria, string $solucion, string $reto, string $fecha): string {
    $reto = nl2br($reto);
    return <<<HTML
<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f7fb;font-family:Arial,Helvetica,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7fb;padding:32px 16px"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">
  <tr><td style="background:#132d46;border-radius:12px 12px 0 0;padding:26px 34px">
    <span style="font-size:13px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:#4a90e2">Nuevo lead · Mobile One</span>
    <h1 style="margin:8px 0 0;font-size:22px;font-weight:600;color:#ffffff;line-height:1.2">{$empresa}</h1>
  </td></tr>
  <tr><td style="background:#0000ff;height:3px;font-size:0;line-height:0">&nbsp;</td></tr>
  <tr><td style="background:#ffffff;padding:30px 34px">
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
      <tr><td style="padding:11px 0;border-bottom:1px solid #e3e6ec;width:34%;font-size:13px;color:#5a6472;font-weight:600">Nombre</td>
          <td style="padding:11px 0;border-bottom:1px solid #e3e6ec;font-size:14px;color:#1c1c1c">{$fullName}</td></tr>
      <tr><td style="padding:11px 0;border-bottom:1px solid #e3e6ec;font-size:13px;color:#5a6472;font-weight:600">Correo</td>
          <td style="padding:11px 0;border-bottom:1px solid #e3e6ec;font-size:14px"><a href="mailto:{$email}" style="color:#0022aa;text-decoration:none">{$email}</a></td></tr>
      <tr><td style="padding:11px 0;border-bottom:1px solid #e3e6ec;font-size:13px;color:#5a6472;font-weight:600">Número</td>
          <td style="padding:11px 0;border-bottom:1px solid #e3e6ec;font-size:14px"><a href="tel:{$tel}" style="color:#1c1c1c;text-decoration:none">{$tel}</a></td></tr>
      <tr><td style="padding:11px 0;border-bottom:1px solid #e3e6ec;font-size:13px;color:#5a6472;font-weight:600">Empresa</td>
          <td style="padding:11px 0;border-bottom:1px solid #e3e6ec;font-size:14px;color:#1c1c1c">{$empresa}</td></tr>
      <tr><td style="padding:11px 0;border-bottom:1px solid #e3e6ec;font-size:13px;color:#5a6472;font-weight:600">Industria</td>
          <td style="padding:11px 0;border-bottom:1px solid #e3e6ec;font-size:14px;color:#1c1c1c">{$industria}</td></tr>
      <tr><td style="padding:11px 0;border-bottom:1px solid #e3e6ec;font-size:13px;color:#5a6472;font-weight:600">Solución de interés</td>
          <td style="padding:11px 0;border-bottom:1px solid #e3e6ec;font-size:14px;color:#1c1c1c">{$solucion}</td></tr>
      <tr><td style="padding:11px 0;font-size:13px;color:#5a6472;font-weight:600;vertical-align:top">Reto</td>
          <td style="padding:11px 0;font-size:14px;color:#1c1c1c;line-height:1.6">{$reto}</td></tr>
    </table>
    <div style="margin-top:24px;padding:14px 18px;background:#f5f7fb;border-left:3px solid #0000ff;border-radius:0 8px 8px 0">
      <p style="margin:0;font-size:12px;color:#5a6472">Recibido el {$fecha} · Responder a <a href="mailto:{$email}" style="color:#0022aa">{$email}</a></p>
    </div>
  </td></tr>
  <tr><td style="background:#ffffff;border-radius:0 0 12px 12px;padding:18px 34px;text-align:center">
    <p style="margin:0;font-size:12px;color:#8a94a3">Mobile One · mobileone.dotsolutions.io</p>
  </td></tr>
</table></td></tr></table></body></html>
HTML;
}

// ── Ejecutar acciones ───────────────────────────────────────────────────────
$clickupOk = clickup_create_task($CFG, $fullName, $email, $telefono, $empresa, $industria, $solucion, $reto, $fecha);

$mailOk = false;
try {
    smtp_send(
        $CFG,
        $CFG['ADMIN_TO'],
        "[Mobile One] Nuevo lead — {$empresa}",
        tpl_admin($fullName, $email, $telefono, $empresa, $industria, $solucion, $reto, $fecha),
        "Producto: Mobile One\nNuevo lead de {$fullName} ({$empresa})\nCorreo: {$email}\nNúmero: {$telefono}\nIndustria: {$industria}\nSolución de interés: {$solucion}\n\nReto:\n{$reto}\n\nRecibido: {$fecha}"
    );
    $mailOk = true;
} catch (\Throwable $e) {
    error_log('[mobile-one-contact] SMTP: ' . $e->getMessage());
}

// El lead ya quedó en el log. Éxito si al menos una vía funcionó.
if ($clickupOk || $mailOk) {
    echo json_encode(['ok' => true]);
} else {
    http_response_code(502);
    echo json_encode(['ok' => false, 'error' => 'No pudimos procesar el envío en este momento. Vuelva a intentar en unos minutos.']);
}
