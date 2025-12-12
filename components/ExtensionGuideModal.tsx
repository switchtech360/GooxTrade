
import React from 'react';
import { CloseIcon } from './icons/CloseIcon';
import { ChromeIcon } from './icons/ChromeIcon';

interface ExtensionGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExtensionGuideModal: React.FC<ExtensionGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl w-full max-w-2xl p-6 relative animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
            <div className="flex items-center gap-3">
                <div className="text-cyan-400"><ChromeIcon /></div>
                <h2 className="text-xl font-bold text-white">How to Install as Chrome Extension</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Close modal">
                <CloseIcon />
            </button>
        </div>
        
        <div className="space-y-6 text-gray-300">
            <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-cyan-900 text-cyan-400 rounded-full flex items-center justify-center font-bold">1</div>
                <div>
                    <h3 className="font-bold text-white mb-1">Build the App</h3>
                    <p className="text-sm">Run the build command in your project terminal. This creates a <code className="bg-gray-900 px-2 py-0.5 rounded text-cyan-400">dist</code> folder containing the extension files.</p>
                    <div className="mt-2 bg-black/50 p-2 rounded border border-gray-700 font-mono text-xs text-green-400">
                        npm run build
                    </div>
                </div>
            </div>

            <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-cyan-900 text-cyan-400 rounded-full flex items-center justify-center font-bold">2</div>
                <div>
                    <h3 className="font-bold text-white mb-1">Open Chrome Extensions</h3>
                    <p className="text-sm">Go to <code className="bg-gray-900 px-2 py-0.5 rounded text-cyan-400">chrome://extensions</code> in your browser address bar.</p>
                </div>
            </div>

             <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-cyan-900 text-cyan-400 rounded-full flex items-center justify-center font-bold">3</div>
                <div>
                    <h3 className="font-bold text-white mb-1">Enable Developer Mode</h3>
                    <p className="text-sm">Toggle the switch in the top-right corner of the Extensions page.</p>
                </div>
            </div>

             <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-cyan-900 text-cyan-400 rounded-full flex items-center justify-center font-bold">4</div>
                <div>
                    <h3 className="font-bold text-white mb-1">Load Extension</h3>
                    <p className="text-sm">Click <strong>Load unpacked</strong> and select the <code className="bg-gray-900 px-2 py-0.5 rounded text-cyan-400">dist</code> folder from step 1.</p>
                </div>
            </div>
             <div className="mt-6 p-4 bg-cyan-900/20 border border-cyan-800 rounded-lg">
                <p className="text-sm text-cyan-300">
                    <strong>Tip:</strong> Once installed, click the extension icon and select "Open Side Panel" to use the Trading Bot alongside your broker (e.g., Pocket Option or Quotex).
                </p>
            </div>
        </div>

      </div>
    </div>
  );
};

export default ExtensionGuideModal;
