export const forgotPasswordTemplate = (): string => `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>Redefinição de senha</title>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 480px; margin: 40px auto; background: #ffffff; border-radius: 8px; padding: 32px; }
    .title { font-size: 22px; font-weight: bold; color: #222; margin-bottom: 8px; }
    .subtitle { font-size: 14px; color: #555; margin-bottom: 24px; }
    .info-box { background: #fff8e1; border-left: 4px solid #f59e0b; border-radius: 4px; padding: 12px 16px; font-size: 14px; color: #7c5600; }
    .note { font-size: 12px; color: #888; margin-top: 24px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="title">Redefinição de senha</div>
    <div class="subtitle">Recebemos uma solicitação para redefinir a senha da sua conta.</div>
    <div class="info-box">
      Sua conta está <strong>autorizada a trocar de senha</strong> pelos próximos <strong>5 minutos</strong>.
      Acesse o aplicativo e conclua a troca de senha antes que o prazo expire.
      <br /><br />
      Caso o tempo expire, envie uma nova solicitação de recuperação de senha.
    </div>
    <div class="note">Se você não solicitou a redefinição de senha, ignore este e-mail. Sua senha permanece inalterada.</div>
  </div>
</body>
</html>
`;
