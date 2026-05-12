# API do Yearbook — Documentação de Endpoints

Base URL (produção): `https://yearbook-backend.vercel.app`

## Convenções

- Todas as respostas são em JSON
- Rotas protegidas exigem header `Authorization: Bearer <token>`
- O campo `senhaHash` nunca é retornado em nenhuma resposta
- Erros seguem o formato `{ "erro": "mensagem descritiva" }`

---

## Auth

### POST /auth/register

Cria uma nova conta de aluno.

- **Autenticação:** Não
- **Body:**
```json
{
  "nome": "Ana",
  "email": "ana@email.com",
  "senha": "senha123",
  "cidade": "Salinas",
  "frase": "Bora!",
  "planosFuturos": "Faculdade"
}
```
- **Resposta de sucesso:** `201 Created`
```json
{
  "id": 1,
  "nome": "Ana",
  "email": "ana@email.com",
  "cidade": "Salinas",
  "frase": "Bora!",
  "planosFuturos": "Faculdade",
  "fotoUrl": null,
  "role": "USER",
  "criadoEm": "2026-04-03T10:30:00.000Z"
}
```
- **Erros:**
  - `400` — Campos obrigatórios ausentes
  - `409` — Email já cadastrado

### POST /auth/login

Autentica um aluno e retorna um token JWT.

- **Autenticação:** Não
- **Body:**
```json
{
  "email": "ana@email.com",
  "senha": "senha123"
}
```
- **Resposta de sucesso:** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
- **Erros:**
  - `401` — Credenciais inválidas (email não existe ou senha incorreta)

---

## Alunos

### GET /alunos

Lista todos os alunos cadastrados.

- **Autenticação:** Não
- **Body:** Nenhum
- **Resposta de sucesso:** `200 OK`
```json
[
  {
    "id": 1,
    "nome": "Ana",
    "email": "ana@email.com",
    "cidade": "Salinas",
    "frase": "Bora!",
    "planosFuturos": "Faculdade",
    "fotoUrl": null,
    "role": "USER",
    "criadoEm": "2026-04-03T10:30:00.000Z"
  },
  {
    "id": 2,
    "nome": "Bruno",
    "email": "bruno@email.com",
    "cidade": "Salinas",
    "frase": "Vai dar certo.",
    "planosFuturos": "Trabalhar",
    "fotoUrl": "https://exemplo.com/bruno.jpg",
    "role": "USER",
    "criadoEm": "2026-04-04T09:15:00.000Z"
  }
]
```
- **Erros:** Nenhum erro específico esperado

### GET /alunos/:id

Busca um aluno específico pelo ID.

- **Autenticação:** Não
- **Body:** Nenhum
- **Resposta de sucesso:** `200 OK`
```json
{
  "id": 1,
  "nome": "Ana",
  "email": "ana@email.com",
  "cidade": "Salinas",
  "frase": "Bora!",
  "planosFuturos": "Faculdade",
  "fotoUrl": null,
  "role": "USER",
  "criadoEm": "2026-04-03T10:30:00.000Z"
}
```
- **Erros:**
  - `404` — Aluno não encontrado

### PUT /alunos/:id

Atualiza o próprio perfil. Todos os campos do body são opcionais — envie apenas os que deseja alterar.

- **Autenticação:** Bearer token
- **Body:**
```json
{
  "nome": "Ana Maria",
  "cidade": "Montes Claros",
  "frase": "Seguindo.",
  "planosFuturos": "Viajar",
  "fotoUrl": "https://exemplo.com/ana.jpg"
}
```
- **Resposta de sucesso:** `200 OK`
```json
{
  "id": 1,
  "nome": "Ana Maria",
  "email": "ana@email.com",
  "cidade": "Montes Claros",
  "frase": "Seguindo.",
  "planosFuturos": "Viajar",
  "fotoUrl": "https://exemplo.com/ana.jpg",
  "role": "USER",
  "criadoEm": "2026-04-03T10:30:00.000Z"
}
```
- **Erros:**
  - `401` — Token ausente ou inválido
  - `403` — Tentativa de atualizar o perfil de outro aluno
  - `404` — Aluno não encontrado

### DELETE /alunos/:id

Remove um aluno. Apenas usuários com role `ADMIN` podem executar.

- **Autenticação:** Bearer token (admin)
- **Body:** Nenhum
- **Resposta de sucesso:** `204 No Content`
- **Erros:**
  - `401` — Token ausente ou inválido
  - `403` — Usuário autenticado não é admin
  - `404` — Aluno não encontrado

---

## Mensagens

### GET /mensagens

Lista todas as mensagens do mural, com os dados do autor embutidos.

- **Autenticação:** Não
- **Body:** Nenhum
- **Resposta de sucesso:** `200 OK`
```json
[
  {
    "id": 1,
    "texto": "Saudades!",
    "imagemUrl": null,
    "autorId": 1,
    "criadoEm": "2026-04-05T14:20:00.000Z",
    "autor": {
      "id": 1,
      "nome": "Ana",
      "fotoUrl": null
    }
  },
  {
    "id": 2,
    "texto": "Foi demais.",
    "imagemUrl": "https://exemplo.com/foto.jpg",
    "autorId": 2,
    "criadoEm": "2026-04-05T15:10:00.000Z",
    "autor": {
      "id": 2,
      "nome": "Bruno",
      "fotoUrl": "https://exemplo.com/bruno.jpg"
    }
  }
]
```
- **Erros:** Nenhum erro específico esperado

### POST /mensagens

Cria uma nova mensagem no mural. O `autorId` é obtido a partir do token JWT — não envie no body.

- **Autenticação:** Bearer token
- **Body:**
```json
{
  "texto": "Saudades!",
  "imagemUrl": "https://exemplo.com/foto.jpg"
}
```
- **Resposta de sucesso:** `201 Created`
```json
{
  "id": 3,
  "texto": "Saudades!",
  "imagemUrl": "https://exemplo.com/foto.jpg",
  "autorId": 1,
  "criadoEm": "2026-04-05T16:00:00.000Z",
  "autor": {
    "id": 1,
    "nome": "Ana",
    "fotoUrl": null
  }
}
```
- **Erros:**
  - `400` — Campo `texto` ausente
  - `401` — Token ausente ou inválido

### DELETE /mensagens/:id

Exclui uma mensagem. Apenas o autor da mensagem ou um `ADMIN` podem excluir.

- **Autenticação:** Bearer token
- **Body:** Nenhum
- **Resposta de sucesso:** `204 No Content`
- **Erros:**
  - `401` — Token ausente ou inválido
  - `403` — Usuário não é o autor da mensagem nem admin
  - `404` — Mensagem não encontrada
