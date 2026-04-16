export const emailConfirmationTemplate = (token: string): string => `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>Confirme seu e-mail</title>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 480px; margin: 40px auto; background: #ffffff; border-radius: 8px; padding: 32px; }
    .title { font-size: 22px; font-weight: bold; color: #222; margin-bottom: 8px; }
    .subtitle { font-size: 14px; color: #555; margin-bottom: 24px; }
    .token-box { display: inline-block; font-size: 36px; font-weight: bold; letter-spacing: 12px; color: #1a1a2e; background: #f0f0f0; border-radius: 8px; padding: 16px 32px; margin: 16px 0; }
    .note { font-size: 12px; color: #888; margin-top: 24px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="title">Confirme seu e-mail</div>
    <div class="subtitle">Use o código abaixo para confirmar sua conta. Ele expira em <strong>15 minutos</strong>.</div>
    <div class="token-box">${token}</div>
    <div class="note">Se você não solicitou este código, ignore este e-mail. Nunca compartilhe este código com ninguém.</div>
  </div>
</body>
</html>
`;
