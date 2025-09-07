# Migração de Comprovantes de Pagamento para Appwrite

Este documento descreve a migração dos comprovantes de pagamento do localStorage para o Appwrite.

## O que mudou?

### 1. Fonte de dados
- **Antes**: Dados armazenados no localStorage do navegador
- **Agora**: Dados armazenados no Appwrite Database

### 2. Estrutura dos dados
Os comprovantes de pagamento agora incluem novos campos:

```typescript
interface PaymentProof {
  $id?: string              // ID do documento Appwrite
  imageUrl: string          // URL da imagem do comprovante
  imageFileId: string       // ID do arquivo no Appwrite Storage
  status: 'pending' | 'approved' | 'rejected'  // Status do comprovante
  isVisible: boolean        // Se aparece na homepage
  $createdAt?: string       // Timestamp de criação Appwrite
  $updatedAt?: string       // Timestamp de atualização Appwrite
}
```

### 3. Funcionalidades adicionadas

#### Admin Interface
- **Aprovação/Rejeição**: Admins podem aprovar ou rejeitar comprovantes pendentes
- **Controle de visibilidade**: Apenas comprovantes aprovados podem ser exibidos
- **Estados de loading**: Interface mostra estados de carregamento durante operações
- **Tratamento de erros**: Melhor experiência com mensagens de erro claras

#### Homepage
- **Filtro automático**: Apenas comprovantes aprovados e visíveis são exibidos
- **Dados em tempo real**: Dados vêm diretamente do Appwrite

## Configuração necessária

### 1. Variáveis de ambiente
Certifique-se de que as seguintes variáveis estejam configuradas:

```env
NEXT_PUBLIC_APPWRITE_PAYMENT_PROOFS_COLLECTION_ID=payment_proofs
```

### 2. Collection Appwrite
Crie uma collection no Appwrite com os seguintes campos:

- `imageUrl` (string, required)
- `imageFileId` (string, required)
- `status` (string, required, default: "pending")
- `isVisible` (boolean, required, default: false)

### 3. Permissões
Configure as permissões da collection:

- **Leitura**: Qualquer usuário (para exibição na homepage)
- **Criação**: Apenas admins (você faz o upload)
- **Atualização**: Apenas admins
- **Exclusão**: Apenas admins

## Fluxo de trabalho

### 1. Upload pelo Admin
1. Admin acessa `/admin/payments`
2. Clica em "Adicionar Comprovante"
3. Seleciona a imagem do comprovante
4. Faz upload da imagem (status: `pending`, `isVisible: false`)

### 2. Aprovação e controle
1. Admin visualiza o comprovante na lista
2. Aprova o comprovante (status: `approved`)
3. Controla visibilidade na homepage (`isVisible: true/false`)

### 3. Exibição na homepage
1. Apenas comprovantes com `status: 'approved'` e `isVisible: true` são exibidos
2. Imagens aparecem para incentivar clientes a comprar

## Vantagens da migração

1. **Persistência**: Dados não se perdem ao limpar o navegador
2. **Centralização**: Todos os comprovantes em um local seguro
3. **Controle**: Sistema de aprovação para validar comprovantes
4. **Escalabilidade**: Suporte a múltiplos administradores
5. **Backup**: Dados protegidos no Appwrite Cloud
6. **Tempo real**: Atualizações instantâneas entre dispositivos

## Notas importantes

- Os dados antigos do localStorage não serão migrados automaticamente
- É necessário recriar os comprovantes no sistema Appwrite
- A interface foi otimizada para o novo fluxo de trabalho
- Todas as operações agora são assíncronas e incluem tratamento de erros
