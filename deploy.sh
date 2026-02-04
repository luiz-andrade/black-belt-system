#!/bin/bash

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Iniciando Deploy em Produção ===${NC}"

# Check docker installed
if ! command -v docker &> /dev/null
then
    echo "Docker não encontrado. Por favor instale o Docker primeiro."
    exit 1
fi

echo -e "${YELLOW}1. Derrubando containers antigos (se houver)...${NC}"
docker compose -f docker-compose.prod.yml down

echo -e "${YELLOW}2. Construindo a imagem de produção (isso pode demorar um pouco)...${NC}"
# Use --no-cache se quiser garantir um build limpo
docker compose -f docker-compose.prod.yml build

echo -e "${YELLOW}3. Iniciando os serviços...${NC}"
docker compose -f docker-compose.prod.yml up -d

echo -e "${YELLOW}4. Aguardando o banco de dados inicializar...${NC}"
sleep 15

echo -e "${YELLOW}5. Atualizando Schema do Banco (db push - via host)...${NC}"
# Executa o push a partir do host, conectando na porta exposta 3307
# Necessário ter Node e dependências instaladas localmente
export DATABASE_URL="mysql://root:password@localhost:3307/blackbelt"
npx prisma db push

echo -e "${YELLOW}6. Executando Seed (via host)...${NC}"
node prisma/seed.js

echo -e "${GREEN}=== Deploy Finalizado! ===${NC}"
echo -e "A aplicação está rodando em: http://localhost:8096"
echo -e "Para ver os logs, execute: docker compose -f docker-compose.prod.yml logs -f"
