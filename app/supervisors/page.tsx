'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useEstate } from '../context/EstateContext';
import { ArrowRight, User, Plus, X } from 'lucide-react';
import styles from './page.module.css';

export default function SupervisorsPage() {
    const { supervisors, expenses, addSupervisor } = useEstate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newName, setNewName] = useState('');
    const [newAllocation, setNewAllocation] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddSupervisor = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim() || !newAllocation) return;

        setIsSubmitting(true);
        const success = await addSupervisor({
            name: newName.trim(),
            allocation: Number(newAllocation)
        });

        if (success) {
            setIsModalOpen(false);
            setNewName('');
            setNewAllocation('');
        }
        setIsSubmitting(false);
    };

    return (
        <div>
            <div className={styles.headerContainer}>
                <header>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Supervisors</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Manage and view details for all estate supervisors.</p>
                </header>
                <button
                    className={styles.addButton}
                    onClick={() => setIsModalOpen(true)}
                >
                    <Plus size={20} /> Add Supervisor
                </button>
            </div>

            <div className={styles.grid}>
                {supervisors.map(supervisor => {
                    // Calculate spent for this supervisor
                    const spent = expenses
                        .filter(e => e.supervisorId === supervisor.id)
                        .reduce((sum, e) => sum + e.amount, 0);

                    const isLowBalance = supervisor.balance < (supervisor.allocation * 0.2);

                    return (
                        <div key={supervisor.id} className={`glass-panel ${styles.card}`}>
                            <div className={styles.header}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: 'var(--color-surface)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--color-primary)'
                                    }}>
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <h2 className={styles.name}>{supervisor.name}</h2>
                                        <span className={styles.role}>Estate Supervisor</span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.stats}>
                                <div className={styles.statRow}>
                                    <span className={styles.label}>Allocation</span>
                                    <span className={styles.value}>${supervisor.allocation.toLocaleString()}</span>
                                </div>
                                <div className={styles.statRow}>
                                    <span className={styles.label}>Spent</span>
                                    <span className={styles.value}>${spent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>
                                <div className={styles.statRow}>
                                    <span className={styles.label}>Balance</span>
                                    <span className={`${styles.value} ${isLowBalance ? styles.lowBalance : styles.balance}`}>
                                        ${supervisor.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>

                            <div className={styles.action}>
                                <Link href={`/supervisors/${supervisor.id}`} className={styles.link}>
                                    View Details <ArrowRight size={16} />
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>

            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h2>Add New Supervisor</h2>
                            <button className={styles.closeButton} onClick={() => setIsModalOpen(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleAddSupervisor}>
                            <div className={styles.formGroup}>
                                <label htmlFor="name">Supervisor Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="e.g. John Doe"
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="allocation">Total Allocation ($)</label>
                                <input
                                    type="number"
                                    id="allocation"
                                    value={newAllocation}
                                    onChange={(e) => setNewAllocation(e.target.value)}
                                    placeholder="e.g. 5000"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>
                            <div className={styles.modalActions}>
                                <button
                                    type="button"
                                    className={styles.cancelButton}
                                    onClick={() => setIsModalOpen(false)}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={styles.submitButton}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Adding...' : 'Add Supervisor'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
