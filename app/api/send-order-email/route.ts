import { NextRequest, NextResponse } from 'next/server';
import { sendOrderConfirmationEmail, sendAdminNotificationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        // Send confirmation to customer
        const customerResult = await sendOrderConfirmationEmail({
            orderNumber: data.orderNumber,
            customerName: `${data.customer.firstName} ${data.customer.lastName}`,
            customerEmail: data.customer.email,
            items: data.items,
            total: data.total,
            shippingCost: data.shippingCost || 0,
            paymentMethod: data.paymentMethod,
            address: data.customer.address,
            city: data.customer.city,
        });

        // Send notification to admin
        const adminResult = await sendAdminNotificationEmail({
            orderNumber: data.orderNumber,
            customerName: `${data.customer.firstName} ${data.customer.lastName}`,
            customerEmail: data.customer.email,
            items: data.items,
            total: data.total,
            shippingCost: data.shippingCost || 0,
            paymentMethod: data.paymentMethod,
            address: data.customer.address,
            city: data.customer.city,
        });

        if (customerResult.success) {
            return NextResponse.json({
                success: true,
                message: 'Emails sent successfully',
                adminNotified: adminResult.success
            });
        } else {
            return NextResponse.json({
                success: false,
                error: 'Failed to send customer email'
            }, { status: 500 });
        }
    } catch (error) {
        console.error('Email API error:', error);
        return NextResponse.json({
            success: false,
            error: 'Internal server error'
        }, { status: 500 });
    }
}
