import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import Expense from '../../../models/Expense';
import Supervisor from '../../../models/Supervisor';

export async function GET() {
    await dbConnect();

    try {
        const expenses = await Expense.find({})
            .populate('supervisorId', 'name') // Populate supervisor name
            .sort({ date: -1 }); // Sort by newest first

        // Transform for frontend compatibility (flatten supervisor name)
        const formattedExpenses = expenses.map(expense => ({
            id: expense._id,
            date: expense.date,
            amount: expense.amount,
            category: expense.category,
            supervisorId: expense.supervisorId._id,
            supervisorName: expense.supervisorId.name,
            description: expense.description,
        }));

        return NextResponse.json(formattedExpenses);
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
    }
}

export async function POST(request: Request) {
    await dbConnect();

    try {
        const body = await request.json();

        // Validate supervisor exists
        const supervisor = await Supervisor.findById(body.supervisorId);
        if (!supervisor) {
            return NextResponse.json({ success: false, error: 'Supervisor not found' }, { status: 404 });
        }

        const expense = await Expense.create(body);

        // Return formatted expense
        const formattedExpense = {
            id: expense._id,
            date: expense.date,
            amount: expense.amount,
            category: expense.category,
            supervisorId: supervisor._id,
            supervisorName: supervisor.name,
            description: expense.description,
        };

        return NextResponse.json({ success: true, data: formattedExpense }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
    }
}
