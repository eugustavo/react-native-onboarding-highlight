# 🦋 Changesets - Gerenciamento de Versões

Estamos usando **Changesets** para gerenciar versões e releases automaticamente.

## 🚀 Como usar

### 1. Fazendo uma mudança

Quando você faz uma alteração no código, adicione um changeset:

```bash
npm run changeset
# ou
npx changeset
```

Isso vai:
- Perguntar qual tipo de mudança (patch, minor, major)
- Pedir uma descrição da mudança
- Criar um arquivo em `.changeset/`

### 2. Tipos de mudança

- **patch** (0.0.1 → 0.0.2): Bug fixes, melhorias pequenas
- **minor** (0.1.0 → 0.2.0): Novas features, não quebra compatibilidade
- **major** (1.0.0 → 2.0.0): Breaking changes

### 3. Acumulando mudanças

Você pode adicionar vários changesets antes de fazer o release. Eles serão combinados automaticamente.

### 4. Fazendo o release

Quando estiver pronto para publicar:

```bash
npm run version-packages
```

Isso vai:
- Atualizar o `CHANGELOG.md`
- Atualizar a versão no `package.json`
- Remover os arquivos de changeset

Depois faça o release:

```bash
npm run release
```

Ou deixe o GitHub Actions fazer automaticamente quando fizer push para `main`!

## 🤖 Automático no GitHub

O GitHub Actions está configurado para:

1. **Criar PR de Release**: Quando há changesets na branch main, cria um PR automaticamente
2. **Publicar no npm**: Quando o PR é mergeado, publica automaticamente no npm
3. **Criar GitHub Release**: Cria uma release no GitHub com todas as mudanças

## 📝 Exemplo completo

```bash
# 1. Faz sua alteração no código
# ... edita arquivos ...

# 2. Adiciona changeset
npm run changeset
# Escolhe: minor
# Descrição: "Add new animation for tooltip transition"

# 3. Commita tudo
git add .
git commit -m "feat: add tooltip animation"
git push

# 4. O GitHub Actions cria um PR automaticamente
# 5. Você revisa e mergeia o PR
# 6. O pacote é publicado automaticamente!
```

## 🔧 Configuração

Arquivos importantes:
- `.changeset/config.json` - Configuração do changesets
- `.github/workflows/release.yml` - GitHub Actions para releases automáticas
- `.changeset/*.md` - Seus changesets (arquivos temporários)

## 📚 Documentação

Mais informações: https://github.com/changesets/changesets
