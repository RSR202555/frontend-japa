# Design: Admin — Cadastro Manual de Aluno

**Data:** 2026-03-04
**Escopo:** Painel administrativo — modal para criar aluno com credenciais e plano vinculado

---

## Objetivo

Permitir que o admin cadastre alunos manualmente (pagamentos fora da plataforma, ex: Pix/dinheiro) diretamente pela lista de alunos, definindo credenciais de acesso e vinculando um plano/assinatura no mesmo fluxo.

---

## Abordagem

Modal em 2 passos acessado via botão "Novo aluno" na página `/admin/alunos`.

---

## Fluxo

### Passo 1 — Dados pessoais e credenciais
- Nome completo (obrigatório)
- E-mail (obrigatório)
- Senha (obrigatório, mínimo 8 chars) — com botão mostrar/ocultar
- WhatsApp (opcional)

### Passo 2 — Plano e assinatura
- Seleção de plano (lista carregada de `GET /plans`)
- Data de início (padrão: hoje)
- Status da assinatura: Ativa | Pendente
- Botão "Criar aluno"

---

## Componentes

### `NovoAlunoModal` (novo componente)
- `src/components/admin/NovoAlunoModal.tsx`
- Props: `open`, `onClose`, `onSuccess`
- Estado interno: `step` (1|2), campos do form, `plans[]`, `submitting`, `error`
- Usa `zod` + `react-hook-form` para validação
- Navegação entre steps com botão "Próximo" / "Voltar"

### `admin/alunos/page.tsx` (atualizar)
- Adicionar botão "Novo aluno" no header
- Importar e renderizar `NovoAlunoModal`
- No `onSuccess`: recarregar lista de alunos

---

## API

**Criar aluno:** `POST /admin/users`
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "phone": "string|null",
  "plan_id": "number|null",
  "subscription_status": "active|pending",
  "subscription_starts_at": "date"
}
```

---

## UI/UX

- Modal dark, consistente com o design system (#111 bg, borda #1e1e1e)
- Indicador de passo no topo (1 → 2 com linha conectora)
- Senha com geração automática opcional (botão "Gerar senha")
- Erro de API exibido inline no step correspondente
- Após sucesso: toast/mensagem de confirmação, modal fecha, lista atualiza
