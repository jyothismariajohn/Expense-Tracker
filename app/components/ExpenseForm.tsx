'use client';

import React, { useState } from 'react';
import { useEstate } from '../context/EstateContext';
import styles from './ExpenseForm.module.css';

export default function ExpenseForm() {
    const { supervisors, addExpense } = useEstate();
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        amount: '',
        category: '',
        supervisorId: '',
        description: '',
    });

    const categories = [
        'Fertilizers',
        'Labor',
        'Equipment Maintenance',
        'Pesticides',
        'Fuel',
        'Transportation',
        'Utilities',
        'Other'
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const selectedSupervisor = supervisors.find(s => s.id === formData.supervisorId);

        if (!selectedSupervisor) {
            alert('Please select a supervisor');
            return;
        }

        const success = await addExpense({
            date: formData.date,
            amount: parseFloat(formData.amount),
            category: formData.category,
            supervisorId: formData.supervisorId,
            supervisorName: selectedSupervisor.name,
            description: formData.description,
        });

        if (success) {
            alert(`Expense of $${formData.amount} added successfully! Remaining balance for ${selectedSupervisor.name}: $${(selectedSupervisor.balance - parseFloat(formData.amount)).toFixed(2)}`);
            // Reset form
            setFormData({
                date: new Date().toISOString().split('T')[0],
                amount: '',
                category: '',
                supervisorId: '',
                description: '',
            });
        }
    };

    return (
        <form className={`${styles.formContainer} glass-panel`} onSubmit={handleSubmit}>
            <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>Log Petty Cash Expense</h2>

            <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="date">Date</label>
                <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={styles.input}
                    required
                />
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="amount">Amount ($)</label>
                <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className={styles.input} // Use the same class as input
                    placeholder="0.00"
                    step="0.01"
                    required
                />
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="category">Category</label>
                <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={styles.select}
                    required
                >
                    <option value="" disabled>Select a category</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="supervisorId">Supervisor</label>
                <select
                    id="supervisorId"
                    name="supervisorId"
                    value={formData.supervisorId}
                    onChange={handleChange}
                    className={styles.select}
                    required
                >
                    <option value="" disabled>Select a supervisor</option>
                    {supervisors.map(sup => (
                        <option key={sup.id} value={sup.id}>
                            {sup.name} (Bal: ${sup.balance.toFixed(2)})
                        </option>
                    ))}
                </select>
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="description">Description</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className={styles.textarea}
                    placeholder="Detailed description of the expense..."
                    rows={3}
                />
            </div>

            <div className={styles.actions}>
                <button type="submit" className={styles.submitBtn}>
                    Submit Expense
                </button>
            </div>
        </form>
    );
}
