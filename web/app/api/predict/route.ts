import { PredictionRequest, PredictionResponse } from '../../../types/prediction';
import { NextResponse } from 'next/server';

const FASTAPI_URL = process.env.FASTAPI_URL || 'http://127.0.0.1:8000';

export async function POST(req: Request) {
    try {
        const body: PredictionRequest = await req.json();

        // Call FastAPI backend
        const response = await fetch(`${FASTAPI_URL}/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json(
                { error: `Backend error: ${errorText}` },
                { status: response.status }
            );
        }

        const data: PredictionResponse = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json(
            { error: `Internal Server Error: ${error.message}` },
            { status: 500 }
        );
    }
}
