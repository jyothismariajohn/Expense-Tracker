import ExpenseForm from '../components/ExpenseForm';
import styles from './page.module.css';

export default function AddExpensePage() {
    return (
        <div className={styles.container}>
            <ExpenseForm />
        </div>
    );
}
