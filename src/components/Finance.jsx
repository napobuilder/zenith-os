import React, { useState } from 'react';
import { Card, SectionTitle } from './UI';
import { TrendingUp, TrendingDown, DollarSign, X, Wrench, Utensils, ShoppingCart, Home } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const IncomeTracker = ({ userId, entries, onAddIncome, onDeleteIncome }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('dev');
    const handleSubmit = (e) => { e.preventDefault(); if (description && amount > 0 && userId) { onAddIncome({ description, amount: parseFloat(amount), type, date: new Date().toISOString() }); setDescription(''); setAmount(''); } };
    const getTypePill = (incomeType) => { const styles = { dev: 'bg-blue-500 bg-opacity-20 text-blue-300', music: 'bg-pink-500 bg-opacity-20 text-pink-300' }; return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${styles[incomeType]}`}>{incomeType}</span>; };
    return (
        <Card>
            <SectionTitle icon={<TrendingUp />} title="Registro de Ingresos" />
            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Descripción" className="bg-white bg-opacity-5 w-full rounded-lg p-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                <div className="flex gap-4">
                    <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Monto (USD)" className="bg-white bg-opacity-5 w-1/2 rounded-lg p-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    <select value={type} onChange={e => setType(e.target.value)} className="bg-white bg-opacity-5 w-1/2 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <option value="dev">Desarrollo</option>
                        <option value="music">Música</option>
                    </select>
                </div>
                <button type="submit" className="w-full bg-purple-600 text-white font-semibold py-2 rounded-lg hover:bg-purple-700 transition-colors">Añadir Ingreso</button>
            </form>
            <h3 className="font-semibold text-white mb-2">Ingresos Recientes</h3>
            <ul className="space-y-2">
                {entries.slice(0, 3).map(entry => (
                    <li key={entry.id} className="bg-white bg-opacity-5 p-2 rounded-lg flex justify-between items-center text-sm group">
                        <div>
                            <p className="text-white">{entry.description}</p>
                            <p className="text-xs text-gray-400">{new Date(entry.date).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center">
                            <div className="text-right mr-4">
                                <p className="font-bold text-green-400">${entry.amount.toFixed(2)}</p>
                                {getTypePill(entry.type)}
                            </div>
                            <button onClick={() => onDeleteIncome(entry.id)} className="p-1 text-red-500 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity"><X className="w-4 h-4" /></button>
                        </div>
                    </li>
                ))}
            </ul>
        </Card>
    );
};

export const ExpenseTracker = ({ userId, entries, onAddExpense, onDeleteExpense }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Herramientas');
    const categories = { Herramientas: <Wrench/>, Comida: <Utensils/>, Personal: <ShoppingCart/>, Hogar: <Home/> };
    const handleSubmit = (e) => { e.preventDefault(); if (description && amount > 0 && userId) { onAddExpense({ description, amount: parseFloat(amount), category, date: new Date().toISOString() }); setDescription(''); setAmount(''); } };
    return (
        <Card>
            <SectionTitle icon={<TrendingDown />} title="Registro de Gastos" />
            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Descripción" className="bg-white bg-opacity-5 w-full rounded-lg p-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                <div className="flex gap-4">
                    <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Monto (USD)" className="bg-white bg-opacity-5 w-1/2 rounded-lg p-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    <select value={category} onChange={e => setCategory(e.target.value)} className="bg-white bg-opacity-5 w-1/2 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                        {Object.keys(categories).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                <button type="submit" className="w-full bg-pink-600 text-white font-semibold py-2 rounded-lg hover:bg-pink-700 transition-colors">Añadir Gasto</button>
            </form>
            <h3 className="font-semibold text-white mb-2">Gastos Recientes</h3>
            <ul className="space-y-2">
                {entries.slice(0, 3).map(entry => (
                    <li key={entry.id} className="bg-white bg-opacity-5 p-2 rounded-lg flex justify-between items-center text-sm group">
                        <div>
                            <p className="text-white">{entry.description}</p>
                            <p className="text-xs text-gray-400">{entry.category}</p>
                        </div>
                        <div className="flex items-center">
                            <p className="font-bold text-red-400 mr-4">${entry.amount.toFixed(2)}</p>
                            <button onClick={() => onDeleteExpense(entry.id)} className="p-1 text-red-500 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity"><X className="w-4 h-4" /></button>
                        </div>
                    </li>
                ))}
            </ul>
        </Card>
    );
};

export const FinancialDashboard = ({ finances, income, expenses }) => {
    const totalIncome = income.reduce((sum, entry) => sum + entry.amount, 0);
    const totalExpenses = expenses.reduce((sum, entry) => sum + entry.amount, 0);
    const netProfit = totalIncome - totalExpenses;
    const incomeProgress = (totalIncome / finances.targetIncome) * 100;
    const expenseData = Object.entries(expenses.reduce((acc, { category, amount }) => { acc[category] = (acc[category] || 0) + amount; return acc; }, {})).map(([name, value]) => ({ name, value }));
    const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'];

    return (
        <Card>
            <SectionTitle icon={<DollarSign />} title="Panel Financiero Mensual" />
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Progreso de Ingresos</h3>
                    <div className="w-full bg-white bg-opacity-10 rounded-full h-4">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full" style={{ width: `${incomeProgress > 100 ? 100 : incomeProgress}%` }}></div>
                    </div>
                    <p className="text-sm text-gray-300 mt-2">${totalIncome.toLocaleString()} / ${finances.targetIncome.toLocaleString()}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Flujo de Caja</h3>
                        <div className="text-sm space-y-2">
                            <div className="flex justify-between"><span>Ingresos</span><span className="font-bold text-green-400">${totalIncome.toFixed(2)}</span></div>
                            <div className="flex justify-between"><span>Gastos</span><span className="font-bold text-red-400">${totalExpenses.toFixed(2)}</span></div>
                            <div className="flex justify-between border-t border-white border-opacity-20 pt-2 mt-2 font-bold text-lg"><span>Beneficio Neto</span><span className={netProfit >= 0 ? 'text-green-300' : 'text-red-300'}>${netProfit.toFixed(2)}</span></div>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Desglose de Gastos</h3>
                        <ResponsiveContainer width="100%" height={120}>
                            <PieChart>
                                <Pie data={expenseData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50} fill="#8884d8">
                                    {expenseData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip formatter={(value, name) => [`$${value.toFixed(2)}`, name]} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </Card>
    );
};