import React, { useState } from 'react';
import { Card, SectionTitle } from './UI';
import { Users, Map, Search, Briefcase, Zap, Droplets, CheckCircle } from 'lucide-react';

export const ProspectsCRM = ({ userId, prospects, onAddProspect, onUpdateStatus }) => {
    const [name, setName] = useState('');
    const [channel, setChannel] = useState('LinkedIn');
    const statuses = ['Contactado', 'En Conversación', 'Propuesta Enviada', 'Cliente', 'Descartado'];
    const handleSubmit = (e) => { e.preventDefault(); if(name && userId) { onAddProspect({ name, channel, status: 'Contactado', date: new Date().toISOString() }); setName(''); } };
    const getStatusColor = (status) => ({ 'Contactado': 'bg-blue-500 bg-opacity-20 text-blue-300', 'En Conversación': 'bg-yellow-500 bg-opacity-20 text-yellow-300', 'Propuesta Enviada': 'bg-purple-500 bg-opacity-20 text-purple-300', 'Cliente': 'bg-green-500 bg-opacity-20 text-green-300', 'Descartado': 'bg-red-500 bg-opacity-20 text-red-300' }[status]);
    return (
        <Card>
            <SectionTitle icon={<Users/>} title="CRM de Prospectos" />
            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nombre del Prospecto" className="bg-white bg-opacity-5 w-full rounded-lg p-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                <div className="flex gap-4">
                    <select value={channel} onChange={e => setChannel(e.target.value)} className="bg-white bg-opacity-5 w-full rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <option>LinkedIn</option>
                        <option>Foro Gearspace</option>
                        <option>Referido</option>
                        <option>Otro</option>
                    </select>
                </div>
                <button type="submit" className="w-full bg-purple-600 text-white font-semibold py-2 rounded-lg hover:bg-purple-700 transition-colors">Añadir Prospecto</button>
            </form>
            <h3 className="font-semibold text-white mb-2">Lista de Prospectos</h3>
            <ul className="space-y-2">
                {prospects.map(p => (
                    <li key={p.id} className="bg-white bg-opacity-5 p-2 rounded-lg text-sm">
                        <div>
                            <p className="font-bold text-white">{p.name}</p>
                            <p className="text-xs text-gray-400">{p.channel}</p>
                        </div>
                        <select value={p.status} onChange={e => onUpdateStatus(p.id, { status: e.target.value })} className={`w-full mt-2 p-1 rounded text-xs border-0 focus:ring-2 focus:ring-purple-500 ${getStatusColor(p.status)}`}>
                            <option disabled>Estado</option>
                            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </li>
                ))}
            </ul>
        </Card>
    );
};

export const StrategicDashboard = ({ strategy }) => (
    <Card className="space-y-8">
        <div>
            <SectionTitle icon={<Map />} title="Plan de Transición de Carrera" />
            <div className="space-y-4">
                <div className="bg-white bg-opacity-5 p-4 rounded-lg">
                    <h4 className="font-bold text-purple-300">Fase 1: Construcción (3-4h/día)</h4>
                    <p className="text-sm text-gray-300">Conseguir el primer caso de estudio de una landing page funcional, manteniendo el ingreso musical actual.</p>
                </div>
                <div className="bg-white bg-opacity-5 p-4 rounded-lg">
                    <h4 className="font-bold text-purple-300">Fase 2: Transición</h4>
                    <p className="text-sm text-gray-300">Al alcanzar $1000/mes constantes en desarrollo web, reducir progresivamente el volumen de clientes de música.</p>
                </div>
            </div>
        </div>
        <div>
            <SectionTitle icon={<Search />} title="Patrones Psicológicos y Soluciones" />
            <ul className="space-y-3 text-sm">
                {strategy.diagnosedPatterns.map((p, i) => (
                    <li key={i} className="bg-white bg-opacity-5 p-3 rounded-lg">
                        <p className="font-semibold text-white">{p.pattern}</p>
                        <p className="text-gray-400"><span className="font-medium text-pink-400">Causa Raíz:</span> {p.cause}</p>
                        <p className="text-gray-300"><span className="font-medium text-purple-300">Acción:</span> {p.recommendation}</p>
                    </li>
                ))}
            </ul>
        </div>
    </Card>
);

export const InitiativesManager = ({ initiatives }) => {
  const getIconForType = (type) => ({'dev': <Zap className="w-5 h-5 text-yellow-400" />,'music': <Droplets className="w-5 h-5 text-blue-400" />,}[type] || <Briefcase className="w-5 h-5 text-gray-400" />);
  const getStatusChip = (status) => { const baseClasses = "text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full"; const styles = { 'Activo': 'bg-green-500 bg-opacity-20 text-green-300', 'Fase 1': 'bg-blue-500 bg-opacity-20 text-blue-300' }; return <span className={`${baseClasses} ${styles[status]}`}>{status}</span>; }
  return (
      <Card>
          <SectionTitle icon={<Briefcase className="w-6 h-6" />} title="Iniciativas Estratégicas" />
          <div className="space-y-6">
              {initiatives.map(p => (
                  <div key={p.id} className="bg-white bg-opacity-5 p-4 rounded-lg transition-all hover:bg-white hover:bg-opacity-10">
                      <div className="flex justify-between items-start">
                          <h3 className="text-lg font-semibold text-white flex items-center mb-1">
                              {getIconForType(p.type)}
                              <span className="ml-2">{p.name}</span>
                          </h3>
                          {getStatusChip(p.status)}
                      </div>
                      <p className="text-sm text-gray-400 mb-3">{p.goal}</p>
                      <ul className="space-y-2">
                          {p.tasks.map(t => (
                              <li key={t.id} className="flex items-center group">
                                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 flex-shrink-0 transition-colors cursor-pointer ${t.completed ? 'border-purple-500 bg-purple-500' : 'border-gray-500 group-hover:border-purple-400'}`}>
                                      {t.completed && <CheckCircle className="w-4 h-4 text-white" />}
                                  </div>
                                  <span className={`flex-grow transition-colors cursor-pointer ${t.completed ? 'line-through text-gray-500' : 'text-gray-300 group-hover:text-white'}`}>{t.text}</span>
                              </li>
                          ))}
                      </ul>
                  </div>
              ))}
          </div>
      </Card>
  );
};