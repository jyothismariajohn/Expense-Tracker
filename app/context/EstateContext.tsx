'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Supervisor {
    id: string;
    name: string;
    allocation: number;
    balance: number;
}

export interface Expense {
    id: string;
    date: string;
    amount: number;
    category: string;
    supervisorId: string;
    supervisorName: string; // Denormalized for easier display
    description: string;
}

interface EstateContextType {
    supervisors: Supervisor[];
    expenses: Expense[];
    addExpense: (expense: Omit<Expense, 'id'>) => boolean;
    getSupervisor: (id: string) => Supervisor | undefined;
}

const EstateContext = createContext<EstateContextType | undefined>(undefined);

export const EstateProvider = ({ children }: { children: ReactNode }) => {
    // Initial Mock Data
    const [supervisors, setSupervisors] = useState<Supervisor[]>([
        { id: '1', name: 'John Doe', allocation: 5000, balance: 5000 },
        { id: '2', name: 'Jane Smith', allocation: 5000, balance: 5000 },
        { id: '3', name: 'Robert Johnson', allocation: 5000, balance: 5000 },
        { id: '4', name: 'Emily Davis', allocation: 5000, balance: 5000 },
        { id: '5', name: 'Michael Wilson', allocation: 5000, balance: 5000 },
    ]);

    const [expenses, setExpenses] = useState<Expense[]>([]);

    const addExpense = (newExpenseData: Omit<Expense, 'id'>): boolean => {
        const supervisor = supervisors.find(s => s.id === newExpenseData.supervisorId);

        if (!supervisor) {
            console.error('Supervisor not found');
            return false;
        }

        if (supervisor.balance < newExpenseData.amount) {
            alert(`Insufficient funds! ${supervisor.name} only has $${supervisor.balance.toFixed(2)} remaining.`);
            return false;
        }

        // Deduct balance
        const updatedSupervisors = supervisors.map(s =>
            s.id === supervisor.id
                ? { ...s, balance: s.balance - newExpenseData.amount }
                : s
        );

        setSupervisors(updatedSupervisors);

        // Add Expense
        const newExpense: Expense = {
            ...newExpenseData,
            id: Math.random().toString(36).substr(2, 9),
        };

        setExpenses(prev => [newExpense, ...prev]);
        return true;
    };

    const getSupervisor = (id: string) => supervisors.find(s => s.id === id);

    return (
        <EstateContext.Provider value={{ supervisors, expenses, addExpense, getSupervisor }}>
            {children}
        </EstateContext.Provider>
    );
};

export const useEstate = () => {
    const context = useContext(EstateContext);
    if (context === undefined) {
        throw new Error('useEstate must be used within an EstateProvider');
    }
    return context;
};
