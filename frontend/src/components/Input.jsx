export default function Input({ label, erro, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-2 border rounded-lg text-sm
          focus:outline-none focus:ring-2 focus:ring-pink-400
          ${erro ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}
        `}
        {...props}
      />
      {erro && <span className="text-xs text-red-500">{erro}</span>}
    </div>
  )
}