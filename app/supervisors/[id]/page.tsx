'use client';

import React from 'react';
import { useEstate } from '../../context/EstateContext';
import { useParams } from 'next/navigation';
import { DollarSign, Calendar, TrendingUp } from 'lucide-react';
import styles from './page.module.css';
import statsStyles from '../../components/DashboardStats.module.css';

export default function SupervisorDetailPage() {
    const params = useParams();
    const { supervisors, expenses } = useEstate();

    const id = params.id as string;
    const supervisor = supervisors.find(s => s.id === id);

    if (!supervisor) {
        return <div style={{ padding: '2rem' }}>Supervisor not found</div>;
    }

    // Calculate Specific Stats
    const supervisorExpenses = expenses.filter(e => e.supervisorId === id);
    const totalSpent = supervisorExpenses.reduce((sum, e) => sum + e.amount, 0);
    const utilization = (totalSpent / supervisor.allocation) * 100;

    return (
        <div className={styles.container}>
            <header className={styles.profileHeader}>
                <div className={styles.avatarLarge}>
                    {supervisor.name.charAt(0)}
                </div>
                <div className={styles.profileInfo}>
                    <h1>{supervisor.name}</h1>
                    <p>Estate Supervisor • ID: {supervisor.id}</p>
                </div>
            </header>

            {/* Stats Grid - Reuse Dashboard Styles */}
            <section style={{ marginBottom: '3rem' }}>
                <h2 style={{ marginBottom: '1.5rem' }}>Budget Overview</h2>
                <div className={statsStyles.grid}>
                    <div className={`glass-panel ${statsStyles.card}`}>
                        <div className={statsStyles.header}>
                            <span className={statsStyles.title}>Allocated Budget</span>
                            <div className={statsStyles.iconWrapper}><Calendar size={20} /></div>
                        </div>
                        <div className={statsStyles.value}>${supervisor.allocation.toLocaleString()}</div>
                        <div className={statsStyles.trend}>Annual Allocation</div>
                    </div>

                    <div className={`glass-panel ${statsStyles.card}`}>
                        <div className={statsStyles.header}>
                            <span className={statsStyles.title}>Total Spent</span>
                            <div className={statsStyles.iconWrapper}><TrendingUp size={20} /></div>
                        </div>
                        <div className={statsStyles.value}>${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                        <div className={`${statsStyles.trend} ${statsStyles.trendUp}`}>
                            {utilization.toFixed(1)}% utilized
                        </div>
                    </div>

                    <div className={`glass-panel ${statsStyles.card}`}>
                        <div className={statsStyles.header}>
                            <span className={statsStyles.title}>Remaining Balance</span>
                            <div className={statsStyles.iconWrapper}><DollarSign size={20} /></div>
                        </div>
                        <div className={statsStyles.value}>${supervisor.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                        <div className={`${statsStyles.trend} ${statsStyles.trendDown}`}>
                            {(100 - utilization).toFixed(1)}% available
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <h2 style={{ marginBottom: '1.5rem' }}>Expense History</h2>
                <div className="glass-panel" style={{ padding: '1rem' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                                <th style={{ padding: '1rem' }}>Date</th>
                                <th style={{ padding: '1rem' }}>Description</th>
                                <th style={{ padding: '1rem' }}>Category</th>
                                <th style={{ padding: '1rem', textAlign: 'right' }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {supervisorExpenses.map(expense => (
                                <tr key={expense.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '1rem' }}>{expense.date}</td>
                                    <td style={{ padding: '1rem' }}>{expense.description}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '1rem',
                                            background: 'rgba(255,255,255,0.1)',
                                            fontSize: '0.75rem'
                                        }}>
                                            {expense.category}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', fontFamily: 'monospace' }}>
                                        ${expense.amount.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                            {supervisorExpenses.length === 0 && (
                                <tr>
                                    <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                        No expenses recorded yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
