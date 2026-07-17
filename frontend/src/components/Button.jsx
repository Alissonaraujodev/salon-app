export default function Button({ children, variante = 'primario', carregando, ...props }) {
  const estilos = {
    primario: 'bg-pink-500 hover:bg-pink-600 text-white',
    secundario: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
    perigo: 'bg-red-500 hover:bg-red-600 text-white',
  }

  return (
    <button
      className={`
        w-full py-2 px-4 rounded-lg font-medium text-sm
        transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${estilos[variante]}
      `}
      disabled={carregando}
      {...props}
    >
      {carregando ? 'Aguarde...' : children}
    </button>
  )
}