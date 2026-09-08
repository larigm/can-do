# CanDo

## Sobre o app

O **CanDo** é um aplicativo de metas diárias, onde o usuário cadastra as metas que deseja cumprir no dia e pode acompanhá-las ao longo do dia. Além do controle básico de metas, o app pretende trazer funcionalidades para tornar o cumprimento das tarefas mais dinâmico e motivador, como cronômetro, timer regressivo e sorteio de tarefas.

### Funcionalidades essenciais

- [ ] Criar meta do dia
- [ ] Listar/visualizar metas do dia
- [ ] Editar meta
- [ ] Marcar meta como concluída
- [ ] Apagar meta

### Funcionalidades adicionais (trabalhos futuros)

- [ ] Cronômetro para medir o tempo gasto em cada tarefa
- [ ] Timer regressivo para cumprir a tarefa dentro de um prazo
- [ ] Sorteio de tarefas do dia ("roleta" de metas)

## Protótipos de tela

[Protótipos - CanDo (Figma)](https://www.figma.com/design/LBz7bRwmiWOFjMUBxhAk5m/CanDo?node-id=0-1&t=MYgJB43Y0SSDIezh-1)

## Modelagem do banco

O aplicativo utilizará um banco de dados local **SQLite** para armazenar as metas cadastradas pelo usuário.

### Tabela `META`

A tabela `META` armazenará as informações necessárias para criação, visualização e gerenciamento das metas diárias.

```mermaid
erDiagram
    META {
        INTEGER id PK
        TEXT titulo
        TEXT descricao
        DATE data
        BOOLEAN concluida
    }
