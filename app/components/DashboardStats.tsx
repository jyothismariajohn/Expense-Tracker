'use client';

import React from 'react';
import { DollarSign, TrendingUp, Calendar, Users } from 'lucide-react';
import { useEstate } from '../context/EstateContext';
import styles from './DashboardStats.module.css';

export default function DashboardStats() {
    const { expenses, supervisors } = useEstate();

    // Calculate Stats
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalAllocation = supervisors.reduce((sum, s) => sum + s.allocation, 0);
    const remainingBudget = supervisors.reduce((sum, s) => sum + s.balance, 0);
    const budgetUtilization = totalAllocation > 0 ? (totalExpenses / totalAllocation) * 100 : 0;

    // Find Highest Category
    const categoryTotals: Record<string, number> = {};
    expenses.forEach(e => {
        categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    });

    let highestCategory = 'N/A';
    let highestCategoryAmount = 0;

    Object.entries(categoryTotals).forEach(([cat, amount]) => {
        if (amount > highestCategoryAmount) {
            highestCategory = cat;
            highestCategoryAmount = amount;
        }
    });

    const stats = [
        {
            title: 'Total Expenses',
            value: `$${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            change: `${budgetUtilization.toFixed(1)}% of budget used`,
            icon: DollarSign,
            trend: 'up',
        },
        {
            title: 'Total Remaining Budget',
            value: `$${remainingBudget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            change: `${(100 - budgetUtilization).toFixed(1)}% remaining`,
            icon: Calendar,
            trend: 'down',
        },
        {
            title: 'Active Supervisors',
            value: supervisors.length.toString(),
            change: 'All active',
            icon: Users,
            trend: 'neutral',
        },
        {
            title: 'Highest Category',
            value: highestCategory,
            change: `$${highestCategoryAmount.toLocaleString()} this month`,
            icon: TrendingUp,
            trend: 'up',
        },
    ];

    return (
        <div className={styles.grid}>
            {stats.map((stat, index) => (
                <div key={index} className={`glass-panel ${styles.card}`}>
                    <div className={styles.header}>
                        <span className={styles.title}>{stat.title}</span>
                        <div className={styles.iconWrapper}>
                            <stat.icon size={20} />
                        </div>
                    </div>
                    <div className={styles.value}>{stat.value}</div>
                    <div className={`${styles.trend} ${stat.trend === 'up' ? styles.trendUp : styles.trendDown}`}>
                        {stat.change}
                    </div>
                </div>
            ))}
        </div>
    );
}
