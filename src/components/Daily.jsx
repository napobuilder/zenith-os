import React, { useState } from 'react';
import { Modal, Card } from './UI';
import { db } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { EnergyIcon, BrainCircuit, Meh, Wind, CheckCircle, Plus, X } from 'lucide-react';

export const DailyAlignmentModal = ({ onSave, userId }) => {
    const [focus, setFocus] = useState('');
    const [mood, setMood] = useState('');
    const moods = [
        { label: 'Energizado', icon: <EnergyIcon className="w-6 h-6 text-green-400" /> },
        { label: 'Enfocado', icon: <BrainCircuit className="w-6 h-6 text-blue-400" /> },
        { label: 'Neutral', icon: <Meh className="w-6 h-6 text-gray-400" /> },
        { label: 'Cansado', icon: <Wind className="w-6 h-6 text-red-400" /> },
    ];
    const handleSave = async () => {
        if (focus && mood && userId) {
            const alignmentCol = collection(db, 'users', userId, 'alignments');
            await addDoc(alignmentCol, { focus, mood, date: new Date().toISOString().split('T')[0] });
            onSave({ focus, mood });
        }
    };
    return (
        <Modal onClose={() => {}}>
            <h2 className="text-2xl font-bold text-white mb-4">Alineación Diaria</h2>
            <p className="text-gray-400 mb-6">Establece tu intención para empezar el día con claridad.</p>
            <div className="mb-6">
                <label className="block text-purple-300 font-semibold mb-2">¿Cuál es tu único objetivo principal para hoy?</label>
                <input type="text" value={focus} onChange={(e) => setFocus(e.target.value)} className="bg-white bg-opacity-5 w-full rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Ej: Terminar el caso de estudio..." />
            </div>
            <div className="mb-8">
                <label className="block text-purple-300 font-semibold mb-2">¿Cómo te sientes hoy?</label>
                <div className="grid grid-cols-4 gap-4">
                    {moods.map(m => (
                        <button key={m.label} onClick={() => setMood(m.label)} className={`p-4 rounded-lg flex flex-col items-center justify-center transition-all ${mood === m.label ? 'bg-purple-600 ring-2 ring-pink-500' : 'bg-white bg-opacity-10 hover:bg-white hover:bg-opacity-20'}`}>
                            {m.icon}
                            <span className="text-xs mt-2 text-white">{m.label}</span>
                        </button>
                    ))}
                </div>
            </div>
            <button onClick={handleSave} disabled={!focus || !mood} className="w-full bg-pink-600 text-white font-semibold py-3 rounded-lg hover:bg-pink-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">
                Empezar el Día
            </button>
        </Modal>
    );
};

export const DailyFocusToDo = ({ alignment, tasks, onAddTask, onToggleTask, onDeleteTask }) => {
    const [newTaskText, setNewTaskText] = useState('');
    const moodIcons = {
        'Energizado': <EnergyIcon className="w-5 h-5 text-green-400" />,
        'Enfocado': <BrainCircuit className="w-5 h-5 text-blue-400" />,
        'Neutral': <Meh className="w-5 h-5 text-gray-400" />,
        'Cansado': <Wind className="w-5 h-5 text-red-400" />,
    };
    const handleAddTask = (e) => {
        e.preventDefault();
        if (newTaskText.trim()) {
            onAddTask(newTaskText);
            setNewTaskText('');
        }
    };
    return (
        <Card>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-purple-300 text-sm font-semibold">PLAN DE ACCIÓN DIARIO</h3>
                    <p className="text-white text-2xl font-bold">{alignment.focus}</p>
                </div>
                <div className="flex items-center text-white text-lg font-bold bg-white bg-opacity-10 px-3 py-1 rounded-lg">
                    {moodIcons[alignment.mood]}
                    <span className="ml-2 text-sm">{alignment.mood}</span>
                </div>
            </div>
            <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
                <input type="text" value={newTaskText} onChange={(e) => setNewTaskText(e.target.value)} placeholder="Añadir paso de acción..." className="bg-white bg-opacity-5 w-full rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                <button type="submit" className="bg-purple-600 text-white font-semibold p-2 rounded-lg hover:bg-purple-700 transition-colors"><Plus className="w-5 h-5" /></button>
            </form>
            <ul className="space-y-2">
                {tasks.map(task => (
                    <li key={task.id} className="flex items-center group bg-white bg-opacity-5 p-2 rounded-lg">
                        <div onClick={() => onToggleTask(task.id, !task.completed)} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 flex-shrink-0 transition-colors cursor-pointer ${task.completed ? 'border-purple-500 bg-purple-500' : 'border-gray-500 group-hover:border-purple-400'}`}>
                            {task.completed && <CheckCircle className="w-4 h-4 text-white" />}
                        </div>
                        <span onClick={() => onToggleTask(task.id, !task.completed)} className={`flex-grow transition-colors cursor-pointer ${task.completed ? 'line-through text-gray-500' : 'text-gray-300 group-hover:text-white'}`}>{task.text}</span>
                        <button onClick={() => onDeleteTask(task.id)} className="ml-2 p-1 text-red-500 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity"><X className="w-4 h-4" /></button>
                    </li>
                ))}
            </ul>
        </Card>
    );
};