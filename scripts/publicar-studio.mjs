/*
/*
 * Publica o Studio usando o robot token do `.env`.
 *
 * REDE DE SEGURANÇA, não o caminho normal: desde 2026-07-31 esta máquina está
 * logada na conta certa, e `npm --prefix studio run deploy` funciona direto.
 *
 * Existe porque `sanity deploy` NÃO lê o `.env`: ele usa a credencial do
 * `sanity login`, guardada por máquina. Numa máquina logada em conta que não é
 * membro do projeto, o deploy morre com
 *
 *   Error: Failed to resolve deploy target: User is missing required grant
 *   sanity.project.read to perform this operation
 *
 * que parece falta de permissão do token e não é: é a conta errada. O CLI
 * aceita `SANITY_AUTH_TOKEN` no ambiente, e é só isso que este arquivo faz —
 * publicar sem depender de login nenhum.
 */
import { spawn } from 'node:child_process';

const token = process.env.SANITY_WRITE_TOKEN;

if (!token) {
  console.error(
    'Falta SANITY_WRITE_TOKEN no .env.\n' +
      'Gere em sanity.io/manage → API → Tokens, com permissão de Editor.',
  );
  process.exit(1);
}

const filho = spawn('npm', ['run', 'deploy'], {
  cwd: 'studio',
  env: { ...process.env, SANITY_AUTH_TOKEN: token },
  stdio: 'inherit',
  /* `shell` porque no Windows o `npm` é um .cmd, e sem ele o spawn não o
     encontra. */
  shell: true,
});

filho.on('exit', (codigo) => process.exit(codigo ?? 1));
