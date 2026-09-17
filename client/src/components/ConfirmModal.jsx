import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDanger = false,
  children
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#101416] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 text-[#F5F5F5]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#A5A8AA] hover:text-[#F5F5F5] p-1 rounded-lg hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DFFF00]"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center space-x-3 mb-3">
          {isDanger && (
            <div className="p-2 bg-[#FF5C5C]/10 border border-[#FF5C5C]/25 rounded-xl text-[#FF5C5C]">
              <AlertTriangle className="h-5 w-5" />
            </div>
          )}
          <h3 className="text-lg font-bold tracking-tight text-[#F5F5F5]">{title}</h3>
        </div>

        {message && <p className="text-xs text-[#A5A8AA] mb-4 leading-relaxed">{message}</p>}

        {children}

        <div className="flex justify-end space-x-3 mt-5 pt-3 border-t border-white/5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#A5A8AA] bg-[#151A1D] border border-white/10 hover:bg-white/5 rounded-xl transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DFFF00]"
          >
            {cancelText}
          </button>
          {onConfirm && (
            <button
              type="button"
              onClick={onConfirm}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DFFF00] ${
                isDanger
                  ? 'bg-[#FF5C5C] text-[#050708] hover:bg-[#FF5C5C]/90 shadow-[0_0_15px_rgba(255,92,92,0.2)]'
                  : 'bg-[#DFFF00] text-[#050708] hover:bg-[#CFFF00] shadow-[0_0_15px_rgba(223,255,0,0.2)]'
              }`}
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

