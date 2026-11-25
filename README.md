# July 20 — V1 💙🐰

Uma experiência de aniversário feita especialmente para a July. Site estático, responsivo e sem build step.

## Publicar no GitHub Pages

1. Crie um **repositório separado** para a V1 (sugestão: `july-20`), para não alterar o QR Code da V2 (`para-july20`).
2. Envie **o conteúdo desta pasta** para a raiz do novo repositório, sem uma pasta extra envolvendo o `index.html`.
3. No GitHub: **Settings > Pages > Build and deployment > Deploy from a branch > main > /(root)**.
4. O endereço ficará no formato `https://SEU-USUARIO.github.io/july-20/`.
5. Teste no celular em uma aba privativa, especialmente as fotos, a carta, as estrelas e a vela.

## Música

O site está preparado para um áudio autorizado, colocado em:

- `assets/audio/quinto-elemento.mp3` **ou**
- `assets/audio/quinto-elemento.m4a`

A página tenta reproduzir a faixa ao tocar **Abrir meu presente**. O botão superior pausa ou retoma. A animação de brilho do céu responde dinamicamente à energia medida por `AudioContext`/`AnalyserNode`, sem sincronizar automaticamente a leitura das seções. Se o arquivo não existir, **o site funciona normalmente sem som** e informa isso de forma discreta.

**A gravação comercial recebida na conversa não foi incluída**. GitHub Pages publica os arquivos de mídia para visitantes; publique uma trilha apenas se possuir os direitos de distribuição necessários ou utilize uma alternativa autorizada.

## Conteúdo e privacidade

- As nove fotos pessoais recebidas na conversa foram otimizadas em WebP e incluídas no site. A galeria também inclui maquiagens de terror entre as últimas imagens.
- GitHub Pages é um site público, inclusive quando o código-fonte estiver privado em planos compatíveis. Certifique-se de que a July aprova a exposição dessas imagens.
- A tag `noindex` foi adicionada apenas para desencorajar indexação; **não é um controle de acesso**.
- Alterar as fotos: basta substituir os arquivos em `assets/images/` mantendo seus nomes. Para modificar descrições, edite `js/app.js` no array `photos`.
- Os textos das estrelas ficam em `js/app.js`. A carta aprovada fica no `index.html`.

## Estrutura

```
index.html
css/style.css
js/app.js
js/audio.js
assets/icon.svg
assets/images/  (9 imagens otimizadas)
assets/audio/   (arquivo de instruções; nenhuma música incluída)
```

## Testes mínimos

- Abrir a página em celular e tocar no botão inicial.
- Navegar pelas sete estrelas e encontrar a surpresa do Dr. Stein na estrela sombria.
- Deslizar a galeria e selecionar as miniaturas.
- Abrir/fechar a carta e rolar seu conteúdo.
- Apagar a vela, conferir a mensagem e acendê-la novamente.
- Navegar por teclado, caso necessário, e testar a opção de reduzir movimento do dispositivo.
