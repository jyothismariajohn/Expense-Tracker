'use client';

import React, { useState } from 'react';
import { useEstate } from '../context/EstateContext';
import styles from './ExpenseList.module.css';

export default function ExpenseList() {
    const { expenses } = useEstate();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredExpenses = expenses.filter(expense =>
        expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.supervisorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={`${styles.container} glass-panel`} style={{ padding: '2rem' }}>
            <div className={styles.controls}>
                <h2 style={{ fontSize: '1.5rem' }}>Expense History</h2>
                <input
                    type="text"
                    placeholder="Search expenses..."
                    className={styles.search}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr className={styles.tr}>
                            <th className={styles.th}>Date</th>
                            <th className={styles.th}>Description</th>
                            <th className={styles.th}>Supervisor</th>
                            <th className={styles.th}>Category</th>
                            <th className={styles.th} style={{ textAlign: 'right' }}>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredExpenses.map((expense) => (
                            <tr key={expense.id} className={styles.tr}>
                                <td className={styles.td}>{expense.date}</td>
                                <td className={styles.td}>{expense.description}</td>
                                <td className={styles.td}>{expense.supervisorName}</td>
                                <td className={styles.td}>
                                    <span className={styles.categoryTag}>{expense.category}</span>
                                </td>
                                <td className={styles.td} style={{ textAlign: 'right' }}>
                                    <span className={styles.amount}>${expense.amount.toFixed(2)}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredExpenses.length === 0 && (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                        No expenses found matching your search.
                    </div>
                )}
            </div>
        </div>
    );
}
