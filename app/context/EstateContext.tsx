'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
    supervisorName: string;
    description: string;
}

interface EstateContextType {
    supervisors: Supervisor[];
    expenses: Expense[];
    addExpense: (expense: Omit<Expense, 'id'>) => Promise<boolean>;
    addSupervisor: (supervisor: Omit<Supervisor, 'id' | 'balance'>) => Promise<boolean>;
    getSupervisor: (id: string) => Supervisor | undefined;
    isLoading: boolean;
}

const EstateContext = createContext<EstateContextType | undefined>(undefined);

export const EstateProvider = ({ children }: { children: ReactNode }) => {
    const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [supRes, expRes] = await Promise.all([
                fetch('/api/supervisors'),
                fetch('/api/expenses')
            ]);

            const supData = await supRes.json();
            const expData = await expRes.json();

            // Automatic Seeding if Database is Empty
            if (supData.length === 0) {
                await seedData();
                return; // seedData will re-fetch
            }

            setSupervisors(supData);
            setExpenses(expData);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const seedData = async () => {
        const initialSupervisors = [
            { name: 'John Doe', allocation: 5000 },
            { name: 'Jane Smith', allocation: 5000 },
            { name: 'Robert Johnson', allocation: 5000 },
            { name: 'Emily Davis', allocation: 5000 },
            { name: 'Michael Wilson', allocation: 5000 },
        ];

        for (const sup of initialSupervisors) {
            await fetch('/api/supervisors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sup),
            });
        }
        // Re-fetch after seeding
        fetchData();
    };

    useEffect(() => {
        fetchData();
    }, []);

    const addExpense = async (newExpenseData: Omit<Expense, 'id'>): Promise<boolean> => {
        const supervisor = supervisors.find(s => s.id === newExpenseData.supervisorId);

        if (!supervisor) {
            console.error('Supervisor not found');
            return false;
        }

        if (supervisor.balance < newExpenseData.amount) {
            alert(`Insufficient funds! ${supervisor.name} only has $${supervisor.balance.toFixed(2)} remaining.`);
            return false;
        }

        try {
            const res = await fetch('/api/expenses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newExpenseData),
            });

            if (res.ok) {
                const { data } = await res.json();

                // Optimistically update or re-fetch
                // Re-fetching ensures server-side calculations (like balance) are accurate
                await fetchData();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to add expense:', error);
            return false;
        }
    };

    const addSupervisor = async (newSupervisorData: Omit<Supervisor, 'id' | 'balance'>): Promise<boolean> => {
        try {
            const res = await fetch('/api/supervisors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSupervisorData),
            });

            if (res.ok) {
                await fetchData();
                return true;
            } else {
                let errorMessage = 'Server error: Could not save supervisor.';
                const contentType = res.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    const errorData = await res.json();
                    errorMessage = errorData.error || errorMessage;
                }
                console.error('Failed to add supervisor:', errorMessage);
                alert(`Error: ${errorMessage}`);
                return false;
            }
        } catch (error) {
            console.error('Failed to add supervisor:', error);
            return false;
        }
    };

    const getSupervisor = (id: string) => supervisors.find(s => s.id === id);

    return (
        <EstateContext.Provider value={{ supervisors, expenses, addExpense, addSupervisor, getSupervisor, isLoading }}>
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
