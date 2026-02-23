import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import Expense from '../../../../models/Expense';
import Supervisor from '../../../../models/Supervisor';

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    await dbConnect();

    try {
        const body = await request.json();

        // If supervisorId is being updated, verify it exists
        if (body.supervisorId) {
            const supervisor = await Supervisor.findById(body.supervisorId);
            if (!supervisor) {
                return NextResponse.json({ success: false, error: 'Supervisor not found' }, { status: 404 });
            }
        }

        const expense = await Expense.findByIdAndUpdate(params.id, body, {
            new: true,
            runValidators: true,
        }).populate('supervisorId', 'name');

        if (!expense) {
            return NextResponse.json({ success: false, error: 'Expense not found' }, { status: 404 });
        }

        const formattedExpense = {
            id: expense._id,
            date: expense.date,
            amount: expense.amount,
            category: expense.category,
            supervisorId: expense.supervisorId._id,
            supervisorName: expense.supervisorId.name,
            description: expense.description,
        };

        return NextResponse.json({ success: true, data: formattedExpense });
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    await dbConnect();

    try {
        const deletedExpense = await Expense.deleteOne({ _id: params.id });

        if (!deletedExpense) {
            return NextResponse.json({ success: false, error: 'Expense not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
    }
}
