#!/bin/bash

# Script para analisar commits e sugerir squash para dias com muitos commits
# Uso: ./git-commit-analyzer.sh [limite] [dias]

LIMITE=${1:-30}  # Limite padrão de 30 commits por dia
DIAS_ANALISE=${2:-365}  # Dias para analisar (padrão: 1 ano)

echo "🔍 Analisando commits dos últimos $DIAS_ANALISE dias..."
echo "📊 Procurando dias com mais de $LIMITE commits..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Analisar commits por data
git log --pretty=format:"%ad" --date=short --since="$DIAS_ANALISE days ago" | \
    sort | \
    uniq -c | \
    sort -nr | \
    while read count date; do
        if [ "$count" -gt "$LIMITE" ]; then
            echo ""
            echo "🚨 DIA COM MUITOS COMMITS: $date"
            echo "   📈 Total de commits: $count"
            echo "   💡 Sugestão: Fazer squash dos commits menores"
            echo ""
            echo "   📋 Commits do dia $date:"
            git log --oneline --since="$date 00:00:00" --until="$date 23:59:59" | \
                sed 's/^/      /'
            echo ""
            echo "   🔧 Comando sugerido para squash:"
            echo "      git rebase -i HEAD~$count"
            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        fi
    done

echo ""
echo "✅ Análise concluída!"
echo ""
echo "💡 DICAS PARA REDUZIR COMMITS:"
echo "   • Use 'git rebase -i HEAD~n' para editar os últimos n commits"
echo "   • Mude 'pick' para 'squash' ou 's' para commits que quer juntar"
echo "   • Faça commits mais significativos ao invés de muitos pequenos"
echo "   • Use 'git commit --amend' para adicionar mudanças ao commit anterior"

