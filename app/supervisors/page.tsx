'use client';

import React from 'react';
import Link from 'next/link';
import { useEstate } from '../context/EstateContext';
import { ArrowRight, User } from 'lucide-react';
import styles from './page.module.css';

export default function SupervisorsPage() {
    const { supervisors, expenses } = useEstate();

    return (
        <div>
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Supervisors</h1>
                <p style={{ color: 'var(--color-text-muted)' }}>Manage and view details for all estate supervisors.</p>
            </header>

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
        </div>
    );
}
