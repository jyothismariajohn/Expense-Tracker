'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PlusCircle, List, Settings, Sprout, Users } from 'lucide-react';
import styles from './Navigation.module.css';

export default function Navigation() {
    const pathname = usePathname();

    const navItems = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'Supervisors', href: '/supervisors', icon: Users },
        { name: 'Petty Cash', href: '/petty-cash', icon: PlusCircle },
        { name: 'All Expenses', href: '/expenses', icon: List },
        { name: 'Settings', href: '/settings', icon: Settings },
    ];

    return (
        <nav className={styles.nav}>
            <div className={styles.logoContainer}>
                <Sprout className={styles.logoIcon} size={32} />
                <span className={styles.brand}>Pineapple Estate</span>
            </div>

            <div className={styles.menu}>
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.link} ${isActive ? styles.activeLink : ''}`}
                        >
                            <item.icon size={20} className={styles.icon} />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </div>

            <div className={styles.userProfile}>
                <div className={styles.avatar}>M</div>
                <div className={styles.userInfo}>
                    <h4>Management</h4>
                    <p>Estate Owner (Admin)</p>
                </div>
            </div>
        </nav>
    );
}
