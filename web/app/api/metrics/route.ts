import { NextResponse } from 'next/server';
import { getModelMetrics } from '../../../lib/model';

export async function GET() {
    try {
        const metrics = getModelMetrics();
        return NextResponse.json(metrics);
    } catch (error: any) {
        return NextResponse.json(
            { error: `Failed to load metrics: ${error.message}` },
            { status: 500 }
        );
    }
}
