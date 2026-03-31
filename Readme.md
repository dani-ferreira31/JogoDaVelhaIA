# 🎮 Jogo da Velha com IA (Q-Learning)

Um jogo da velha desenvolvido em JavaScript puro com implementação de Inteligência Artificial utilizando Q-Learning, interface moderna inspirada na Steam e sistema de treinamento em tempo real.

---

## 🚀 Demo Online

👉 https://jogo-da-velha-ia-rho.vercel.app/

---

## 📸 Preview

<img src="./preview.png" alt="Preview do projeto" width="600"/>

---

## 🧠 Sobre o Projeto

Este projeto foi desenvolvido com o objetivo de aplicar conceitos de:

- Lógica de programação
- Estruturas de decisão
- Inteligência Artificial básica
- Manipulação do DOM
- Design responsivo

A IA aprende a jogar através de simulações repetidas, melhorando suas decisões ao longo do tempo.

---

## ⚙️ Tecnologias

- **HTML5**
- **CSS3**
  - Layout responsivo
  - UI inspirada na Steam
- **JavaScript (Vanilla)**
- **Q-Learning (IA)**

---

## 🤖 Como funciona a IA

A IA utiliza uma abordagem baseada em **Q-Learning**, onde:

- Cada estado do jogo (tabuleiro) é armazenado
- Cada ação possível recebe uma pontuação (Q-value)
- As decisões são tomadas com base no melhor valor acumulado

### Processo:

1. Simulação de milhares de partidas
2. Atualização da Q-Table
3. Escolha da melhor jogada possível

---

## 🎯 Funcionalidades

- 🎮 Jogo da velha completo
- 🤖 IA com níveis:
  - Fácil
  - Médio
  - Impossível
- 📊 Sistema de placar
- ⚡ Treinamento em tempo real
- ⏱️ Estimativa de tempo de treino
- 💻 Layout estilo Steam
- 📱 Responsivo (mobile/tablet/desktop)

---

## 🧪 Treinamento da IA

O treinamento ocorre via simulação:

```js
simulateGameForTraining()