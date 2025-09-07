# Configuração do PayPal - Painel Administrativo

## Visão Geral

O painel administrativo agora inclui uma seção dedicada para configurar o PayPal. Esta configuração é essencial para processar pagamentos no site.

## Como Acessar

1. Acesse o painel administrativo: `http://localhost:3000/admin`
2. Clique em **"Configurações"** no menu lateral
3. Role até a seção **"Configurações do PayPal"**

## Campos Disponíveis

### 1. Client ID do PayPal
- **Campo**: `paypalClientId`
- **Tipo**: Texto
- **Obrigatório**: Sim (para processar pagamentos)
- **Descrição**: Client ID obtido no PayPal Developer Dashboard

### 2. Ambiente do PayPal
- **Campo**: `paypalEnvironment`
- **Tipo**: Select (Dropdown)
- **Opções**:
  - `sandbox` - Ambiente de teste
  - `live` - Ambiente de produção
- **Padrão**: `sandbox`

## Como Obter o Client ID do PayPal

### 1. Criar Conta no PayPal Developer
1. Acesse [developer.paypal.com](https://developer.paypal.com)
2. Faça login ou crie uma conta
3. Vá para "Apps & Credentials"

### 2. Criar App
1. Clique em "Create App"
2. Dê um nome para sua aplicação (ex: "Alex Site Payments")
3. Selecione "Business" como tipo de conta
4. Clique em "Create App"

### 3. Obter Client ID
1. Após criar o app, você verá o **Client ID** e **Secret**
2. Copie o **Client ID** (você precisará dele para o painel admin)

## Configuração no Painel Admin

### Passo 1: Acessar Configurações
1. No painel admin, vá para **Configurações**
2. Role até a seção **"Configurações do PayPal"**

### Passo 2: Inserir Client ID
1. No campo **"Client ID do PayPal"**, cole o Client ID obtido
2. O campo aceita qualquer string válida do PayPal

### Passo 3: Selecionar Ambiente
1. No dropdown **"Ambiente do PayPal"**, escolha:
   - **Sandbox (Teste)**: Para desenvolvimento e testes
   - **Live (Produção)**: Para o site em produção

### Passo 4: Salvar Configurações
1. Clique em **"Salvar Configurações"**
2. Aguarde a confirmação de sucesso

## Validação

### Preview das Configurações
Na seção "Preview das Configurações", você verá:
- **PayPal**: Mostra os primeiros 10 caracteres do Client ID + ambiente
- Exemplo: `AQK1234567... (sandbox)`

### Teste de Funcionalidade
1. Vá para a página inicial do site
2. Tente fazer um pagamento com PayPal
3. Verifique se o botão do PayPal aparece corretamente

## Ambientes

### Sandbox (Teste)
- **Uso**: Desenvolvimento e testes
- **Pagamentos**: Simulados (não reais)
- **Contas**: Use contas de teste do PayPal
- **Recomendado**: Para desenvolvimento

### Live (Produção)
- **Uso**: Site em produção
- **Pagamentos**: Reais
- **Contas**: Contas reais do PayPal
- **Recomendado**: Para site ativo

## Troubleshooting

### Problema: "PayPal não configurado"
**Solução**: Verifique se o `paypalClientId` está preenchido no painel admin

### Problema: Botão do PayPal não aparece
**Solução**: 
1. Verifique se o Client ID está correto
2. Confirme se o ambiente está configurado
3. Verifique o console do navegador para erros

### Problema: Erro de autenticação PayPal
**Solução**:
1. Verifique se o Client ID está correto
2. Confirme se está usando o ambiente correto (sandbox/live)
3. Verifique se a conta PayPal tem permissões adequadas

## Segurança

### Boas Práticas
- ✅ Nunca compartilhe o Client ID publicamente
- ✅ Use ambiente sandbox para testes
- ✅ Mude para live apenas quando estiver pronto
- ✅ Mantenha backups das configurações

### Armazenamento
- Os dados são armazenados no Appwrite Database
- Apenas administradores podem modificar
- Dados são criptografados em trânsito

## Próximos Passos

Após configurar o PayPal:
1. Teste os pagamentos no ambiente sandbox
2. Configure webhooks (opcional)
3. Mude para ambiente live quando estiver pronto
4. Monitore os pagamentos no PayPal Dashboard
