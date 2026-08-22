'use client'

import Rive, { Layout, Fit, Alignment } from '@rive-app/react-canvas'

// mascot.riv (public/mascot.riv) - hospedado localmente pra não depender de rede externa
// durante um pitch ao vivo. Fonte: rive.app/marketplace/26964-50676-rive-app-mascot-cloud-
// character-with-state-machine-and-6-expressions (CC BY 4.0). O arquivo tem 13 artboards:
// "Artboard" é a prévia de divulgação da comunidade Rive - uma grade com as 6 expressões
// juntas lado a lado. Essa era a causa exata do bug original ("aparecem as 6 de uma vez"):
// a integração anterior renderizava esse artboard de prévia em vez de escolher UMA expressão.
// Os artboards usáveis são "1" a "6", cada um uma expressão isolada com sua própria animação
// de idle - sem inputs de state machine expostos, então trocar de expressão é trocar de
// artboard (por isso o `key`, que força remontagem completa a cada troca).
export function MascotRive({ artboard }: { artboard: string }) {
  return <Rive
    key={artboard}
    src="/mascot.riv"
    artboard={artboard}
    stateMachines="State Machine 1"
    // BottomCenter (não Center): os 6 artboards têm alturas de bounding box diferentes
    // (braço levantado, pulando etc.) - centralizar verticalmente fazia o personagem
    // "pular" de posição a cada troca de expressão. Ancorando pelo pé, ele fica sempre
    // no mesmo lugar dentro da caixa, independente de qual das 6 poses está ativa.
    layout={new Layout({ fit: Fit.Contain, alignment: Alignment.BottomCenter })}
    className="cloud-rive"
  />
}
