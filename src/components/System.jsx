import React from 'react';
import { Card, SectionTitle } from './UI';
import { Modal } from './UI';
import { AlertTriangle, Settings, Upload, Download } from 'lucide-react';

export const ErrorModal = ({ message, onClose }) => (
  <Modal onClose={onClose}>
    <div className="text-center">
      <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h2 className="text-xl font-bold text-white mb-2">Error de Configuración</h2>
      <p className="text-gray-300">{message}</p>
      <button onClick={onClose} className="mt-6 bg-red-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-700 transition-colors">
        Entendido
      </button>
    </div>
  </Modal>
);

export const SettingsManager = ({ configData, onConfigChange }) => {
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file && file.type === "application/json") {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const newConfig = JSON.parse(e.target.result);
                    onConfigChange(newConfig);
                    alert('Configuración actualizada correctamente.');
                } catch (error) {
                    console.error('Error parsing JSON file', error);
                    alert('Error: El archivo de configuración no es un JSON válido.');
                }
            };
            reader.readAsText(file);
        } else {
            alert('Por favor, selecciona un archivo JSON válido.');
        }
    };

    const handleDownloadConfig = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(configData, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "zenith_os_config.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    return (
        <Card>
            <SectionTitle icon={<Settings />} title="Configuración" />
            <p className="text-sm text-gray-400 mb-4">Carga o descarga tu configuración base (estrategia, iniciativas, gastos fijos).</p>
            <div className="space-y-3">
                <label htmlFor="config-upload" className="w-full text-center cursor-pointer bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
                    <Upload className="w-4 h-4 mr-2" />
                    Cargar Configuración
                </label>
                <input id="config-upload" type="file" accept=".json" className="hidden" onChange={handleFileUpload} />
                <button onClick={handleDownloadConfig} className="w-full bg-white bg-opacity-10 text-white font-semibold py-2 px-4 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors flex items-center justify-center">
                    <Download className="w-4 h-4 mr-2" />
                    Descargar Actual
                </button>
            </div>
        </Card>
    );
};