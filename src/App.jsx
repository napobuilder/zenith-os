import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase/config';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { collection, query, onSnapshot, addDoc, deleteDoc, doc, updateDoc, orderBy } from 'firebase/firestore';

import { ErrorModal, SettingsManager } from './components/System';
import { SleepCycleCalculator, PomodoroTimer } from './components/Productivity';
import { DailyAlignmentModal, DailyFocusToDo } from './components/Daily';
import { IncomeTracker, ExpenseTracker, FinancialDashboard } from './components/Finance';
import { ProspectsCRM, StrategicDashboard, InitiativesManager } from './components/Strategy';

export default function App() {
  const [configData, setConfigData] = useState({
      user: { name: 'Usuario' },
      finances: { targetIncome: 10000, debts: [], subscriptions: [] },
      initiatives: [],
      strategy: { diagnosedPatterns: [], validatedHypotheses: [], clientArchetype: { traits: [], channels: [] } }
  });
  const [userId, setUserId] = useState(null);
  const [incomeEntries, setIncomeEntries] = useState([]);
  const [expenseEntries, setExpenseEntries] = useState([]);
  const [prospects, setProspects] = useState([]);
  const [isAligned, setIsAligned] = useState(false);
  const [dailyAlignment, setDailyAlignment] = useState(null);
  const [dailyTasks, setDailyTasks] = useState([]);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    setConfigData({
      user: { name: 'Usuario' },
      finances: { targetIncome: 10000, debts: [ { id: 2, name: 'Masonería (atraso)', total: 80 }, { id: 3, name: 'Alquiler', total: 100 }, { id: 4, name: 'Cashea (tostiarepa)', total: 33 }, ], subscriptions: [ { id: 1, name: 'Splice', cost: 12.99 }, { id: 2, name: 'Ozone Suite', cost: 20.00 }, { id: 3, name: 'Masonería', cost: 20.00 }, ], },
      initiatives: [ { id: 1, name: 'Desarrollo Web Premium', goal: 'Ofrecer landing pages optimizadas por IA ($600–$1000 c/u).', type: 'dev', status: 'Fase 1', tasks: [{ id: 1, text: 'Construir y documentar el primer caso de estudio', completed: false }, { id: 2, text: 'Estudiar psicología de ventas y pricing', completed: false }]}, { id: 2, name: 'Producción Musical (Modelo Kovaceski)', goal: 'Mantener ingresos con clientes premium y precio fijo.', type: 'music', status: 'Activo', tasks: [{ id: 1, text: 'Implementar y comunicar la lista de precios fija', completed: false }, { id: 2, text: 'Buscar 2 nuevos clientes \'Kovaceski\'', completed: false }]}, ],
      strategy: { diagnosedPatterns: [ { pattern: 'Ansiedad al dar precios', cause: 'Miedo al rechazo vs. autopercepción', recommendation: 'Usar lista fija de precios no negociables.' }, { pattern: 'Procrastinación recurrente', cause: 'Tareas sin retorno (financiero, artístico, ético)', recommendation: 'Evaluar proyectos con costo de oportunidad real.' } ], validatedHypotheses: [ 'El problema no es el talento, es el pricing dictado por ansiedad.', 'El arquetipo \'Kovaceski\' es el cliente ideal validado.', 'Fiverr limita el crecimiento y la captación de clientes premium.' ], clientArchetype: { label: 'Kovaceski', traits: ['Empresario exitoso con pasión artística (45-65 años)', 'Busca calidad y fiabilidad, no el precio más bajo', 'Colabora a distancia y valora la experiencia'], channels: ['LinkedIn (búsqueda inversa)', 'Foros de gear musical de alto nivel', 'Portafolio con casos de estudio'] } }
    });
  }, []);

  // Autenticación
  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) { setUserId(user.uid); setAuthError(null); } 
      else { signInAnonymously(auth).catch(error => { console.error("Anonymous sign-in failed", error); if (error.code === 'auth/configuration-not-found') { setAuthError('Error de configuración: El inicio de sesión anónimo no está habilitado en tu panel de Firebase. Por favor, ve a Authentication > Sign-in method y habilítalo.'); } else { setAuthError(`Error de autenticación: ${error.message}`); } }); } 
    });
  }, []);

  // Suscripciones a Firestore
  useEffect(() => {
    if (!userId) return;
    const collections = { incomeEntries: 'income', expenseEntries: 'expenses', prospects: 'prospects', dailyTasks: 'dailyTasks', alignments: 'alignments' };
    const unsubscribers = Object.entries(collections).map(([stateKey, collectionName]) => {
        const q = query(collection(db, 'users', userId, collectionName), orderBy('date', 'desc'));
        return onSnapshot(q, (querySnapshot) => {
            const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            if (stateKey === 'incomeEntries') setIncomeEntries(items);
            else if (stateKey === 'expenseEntries') setExpenseEntries(items);
            else if (stateKey === 'prospects') setProspects(items);
            else if (stateKey === 'dailyTasks') { const todayStr = new Date().toISOString().split('T')[0]; const todayTasks = items.filter(t => t.date === todayStr); setDailyTasks(todayTasks); } 
            else if (stateKey === 'alignments') { const todayStr = new Date().toISOString().split('T')[0]; const todayAlignment = items.find(a => a.date === todayStr); if (todayAlignment) { setDailyAlignment(todayAlignment); setIsAligned(true); } }
        }, (error) => { console.error(`Error al escuchar la colección ${collectionName}`, error); });
    });
    return () => unsubscribers.forEach(unsub => unsub());
  }, [userId]);

  const handleConfigChange = (newConfig) => { setConfigData(prevConfig => ({ ...prevConfig, ...newConfig })); };
  const handleAdd = (collectionName) => async (data) => { if(!userId) return; await addDoc(collection(db, 'users', userId, collectionName), data); };
  const handleDelete = (collectionName) => async (id) => { if(!userId) return; await deleteDoc(doc(db, 'users', userId, collectionName, id)); };
  const handleUpdate = (collectionName) => async (id, data) => { if(!userId) return; await updateDoc(doc(db, 'users', userId, collectionName, id), data); };
  const handleSaveAlignment = (alignmentData) => { handleAdd('alignments')({ ...alignmentData, date: new Date().toISOString().split('T')[0] }); handleAdd('dailyTasks')({ text: alignmentData.focus, completed: false, date: new Date().toISOString().split('T')[0] }); };
  const handleAddDailyTask = (text) => handleAdd('dailyTasks')({ text, completed: false, date: new Date().toISOString().split('T')[0] });
  const handleToggleDailyTask = (id, completed) => handleUpdate('dailyTasks')(id, { completed });
  const handleDeleteDailyTask = (id) => handleDelete('dailyTasks')(id);

  const currentMonthIncome = incomeEntries.filter(e => new Date(e.date).getMonth() === new Date().getMonth()).reduce((sum, e) => sum + e.amount, 0);
  const currentMonthExpenses = expenseEntries.filter(e => new Date(e.date).getMonth() === new Date().getMonth());

  return (
    <>
      <style>{`@keyframes move { 0% { transform: translate(0, 0); } 50% { transform: translate(200px, 100px); } 100% { transform: translate(0, 0); } } .gradient-bg { width: 100vw; height: 100vh; position: fixed; overflow: hidden; background: #0D0C1D; top: 0; left: 0; z-index: -1; } .gradient-bg > div { position: absolute; filter: blur(150px); border-radius: 50%; } .g1 { width: 400px; height: 400px; background: rgba(138, 43, 226, 0.3); animation: move 20s infinite alternate; } .g2 { width: 300px; height: 300px; background: rgba(218, 112, 214, 0.2); top: 20vh; left: 30vw; animation: move 25s infinite alternate-reverse; } .g3 { width: 250px; height: 250px; background: rgba(255, 20, 147, 0.2); top: 60vh; left: 10vw; animation: move 18s infinite alternate; } .g4 { width: 350px; height: 350px; background: rgba(75, 0, 130, 0.2); top: 50vh; left: 70vw; animation: move 22s infinite alternate-reverse; }`}</style>
      <div className="gradient-bg"><div className="g1"></div><div className="g2"></div><div className="g3"></div><div className="g4"></div></div>
      {authError && <ErrorModal message={authError} onClose={() => setAuthError(null)} />}
      {!isAligned && !authError && <DailyAlignmentModal onSave={handleSaveAlignment} userId={userId} />}
      <div className="min-h-screen text-gray-200 font-sans relative">
        <div className={`container mx-auto p-4 sm:p-6 lg:p-8 transition-opacity duration-500 ${isAligned ? 'opacity-100' : 'opacity-0'}`}>
          <header className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white text-red-500">Zenith OS</h1>
            <p className="text-purple-300 text-lg">Tu centro de comando estratégico.</p>
          </header>
          <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-1 space-y-8">
              <IncomeTracker userId={userId} entries={incomeEntries} onAddIncome={handleAdd('income')} onDeleteIncome={handleDelete('income')} />
              <ExpenseTracker userId={userId} entries={expenseEntries} onAddExpense={handleAdd('expenses')} onDeleteExpense={handleDelete('expenses')} />
            </div>
            <div className="lg:col-span-1 space-y-8">
              {isAligned && <DailyFocusToDo alignment={dailyAlignment} tasks={dailyTasks} onAddTask={handleAddDailyTask} onToggleTask={handleToggleDailyTask} onDeleteTask={handleDeleteDailyTask} />}
              <FinancialDashboard finances={configData.finances} income={incomeEntries} expenses={currentMonthExpenses} />
              <StrategicDashboard strategy={configData.strategy} />
            </div>
            <div className="lg:col-span-1 space-y-8">
              <ProspectsCRM userId={userId} prospects={prospects} onAddProspect={handleAdd('prospects')} onUpdateStatus={handleUpdate('prospects')} />
              <InitiativesManager initiatives={configData.initiatives} />
              <PomodoroTimer />
              <SleepCycleCalculator />
              <SettingsManager configData={configData} onConfigChange={handleConfigChange} />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}