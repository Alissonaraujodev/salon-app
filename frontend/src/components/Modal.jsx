import { useEffect } from 'react'

export default function Modal({ aberto, onFechar, titulo, children }) {
  // Fecha o modal ao pressionar Esc
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onFechar()
    }
    if (aberto) document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [aberto, onFechar])

  // Impede scroll da página quando o modal está aberto
  useEffect(() => {
    document.body.style.overflow = aberto ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [aberto])

  if (!aberto) return null

  return (
    // Fundo escuro — clique fora fecha o modal
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={onFechar}
    >
      {/* Caixa do modal — clique dentro não fecha */}
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">{titulo}</h2>
          <button
            onClick={onFechar}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Conteúdo */}
        <div className="px-6 py-5">
          {children}
        </div>
      </div>
    </div>
  )
}