import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER || 'noreply@goldenglass777.com.tr',
        pass: process.env.SMTP_PASS,
    },
});

interface OrderItem {
    name: string;
    quantity: number;
    price: number;
    selectedFormat?: string;
    selectedFrame?: string;
}

interface OrderEmailData {
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    items: OrderItem[];
    total: number;
    shippingCost: number;
    paymentMethod: string;
    address: string;
    city: string;
}

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
    const itemsHtml = data.items.map(item => `
        <tr>
            <td style="padding: 12px; border-bottom: 1px solid #eee;">
                <strong>${item.name}</strong><br/>
                <span style="color: #666; font-size: 12px;">${item.selectedFormat || ''} ${item.selectedFrame ? `• ${item.selectedFrame}` : ''}</span>
            </td>
            <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
            <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${(item.price * item.quantity).toLocaleString('tr-TR')} TL</td>
        </tr>
    `).join('');

    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #111111 0%, #1a1a1a 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Golden Glass 777</h1>
                <p style="color: #00E676; margin: 10px 0 0 0; font-size: 14px;">Premium Cam Tablo</p>
            </div>
            
            <!-- Content -->
            <div style="background: #ffffff; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <!-- Success Icon -->
                <div style="text-align: center; margin-bottom: 20px;">
                    <div style="width: 60px; height: 60px; background: #00E676; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
                        <span style="color: white; font-size: 30px;">✓</span>
                    </div>
                </div>
                
                <h2 style="color: #111111; text-align: center; margin: 0 0 10px 0;">Siparişiniz Alındı!</h2>
                <p style="color: #666; text-align: center; margin: 0 0 30px 0;">Siparişinizi aldık ve işleme koyuyoruz.</p>
                
                <!-- Order Number -->
                <div style="background: #f8f8f8; padding: 15px; border-radius: 8px; text-align: center; margin-bottom: 25px;">
                    <p style="color: #666; margin: 0 0 5px 0; font-size: 12px;">Sipariş Numaranız</p>
                    <p style="color: #00E676; font-size: 24px; font-weight: bold; margin: 0; font-family: monospace;">${data.orderNumber}</p>
                </div>
                
                <!-- Order Details -->
                <h3 style="color: #111111; margin: 0 0 15px 0; font-size: 16px;">Sipariş Detayları</h3>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <thead>
                        <tr style="background: #f8f8f8;">
                            <th style="padding: 12px; text-align: left; font-size: 12px; color: #666;">Ürün</th>
                            <th style="padding: 12px; text-align: center; font-size: 12px; color: #666;">Adet</th>
                            <th style="padding: 12px; text-align: right; font-size: 12px; color: #666;">Fiyat</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                </table>
                
                <!-- Totals -->
                <div style="background: #f8f8f8; padding: 15px; border-radius: 8px; margin-bottom: 25px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="color: #666;">Kargo</span>
                        <span style="color: #111111;">${data.shippingCost === 0 ? 'Ücretsiz' : `${data.shippingCost.toLocaleString('tr-TR')} TL`}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding-top: 10px; border-top: 1px solid #ddd;">
                        <span style="color: #111111; font-weight: bold; font-size: 18px;">Toplam</span>
                        <span style="color: #00E676; font-weight: bold; font-size: 18px;">${data.total.toLocaleString('tr-TR')} TL</span>
                    </div>
                </div>
                
                <!-- Delivery Info -->
                <h3 style="color: #111111; margin: 0 0 15px 0; font-size: 16px;">Teslimat Bilgileri</h3>
                <div style="background: #f8f8f8; padding: 15px; border-radius: 8px; margin-bottom: 25px;">
                    <p style="margin: 0 0 5px 0; color: #111111; font-weight: 500;">${data.customerName}</p>
                    <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">${data.address}</p>
                    <p style="margin: 0; color: #666; font-size: 14px;">${data.city}</p>
                </div>
                
                <!-- Payment Method -->
                <div style="background: ${data.paymentMethod === 'Bank Transfer' ? '#FFF3CD' : '#D4EDDA'}; padding: 15px; border-radius: 8px; margin-bottom: 25px;">
                    <p style="margin: 0; color: #111111;">
                        <strong>Ödeme Yöntemi:</strong> ${data.paymentMethod === 'Bank Transfer' ? 'Havale/EFT' : 'Kredi Kartı'}
                    </p>
                    ${data.paymentMethod === 'Bank Transfer' ? `
                    <p style="margin: 10px 0 0 0; color: #856404; font-size: 13px;">
                        ⚠️ Lütfen havale açıklamasına <strong>${data.orderNumber}</strong> sipariş numarasını yazmayı unutmayın.
                    </p>
                    ` : ''}
                </div>
                
                <!-- Order Tracking -->
                <div style="text-align: center; margin-bottom: 20px;">
                    <a href="https://goldenglass777.com.tr/order-track" style="display: inline-block; background: #111111; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: 500;">
                        Siparişimi Takip Et
                    </a>
                </div>
                
                <!-- Contact -->
                <p style="color: #666; font-size: 13px; text-align: center; margin: 20px 0 0 0;">
                    Sorularınız için bize ulaşın: <a href="mailto:info@goldenglass777.com.tr" style="color: #00E676;">info@goldenglass777.com.tr</a>
                </p>
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
                <p style="margin: 0 0 10px 0;">© 2024 Golden Glass 777. Tüm hakları saklıdır.</p>
                <p style="margin: 0;">Bu e-posta ${data.customerEmail} adresine gönderilmiştir.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    try {
        await transporter.sendMail({
            from: '"Golden Glass 777" <noreply@goldenglass777.com.tr>',
            to: data.customerEmail,
            subject: `Siparişiniz Alındı - ${data.orderNumber}`,
            html: emailHtml,
        });
        return { success: true };
    } catch (error) {
        console.error('Email send error:', error);
        return { success: false, error };
    }
}

export async function sendAdminNotificationEmail(data: OrderEmailData) {
    const itemsList = data.items.map(item =>
        `- ${item.name} (${item.quantity} adet) - ${(item.price * item.quantity).toLocaleString('tr-TR')} TL`
    ).join('\n');

    const emailText = `
Yeni Sipariş Alındı!

Sipariş No: ${data.orderNumber}

Müşteri Bilgileri:
- İsim: ${data.customerName}
- E-posta: ${data.customerEmail}
- Adres: ${data.address}, ${data.city}

Ürünler:
${itemsList}

Kargo: ${data.shippingCost === 0 ? 'Ücretsiz' : `${data.shippingCost.toLocaleString('tr-TR')} TL`}
Toplam: ${data.total.toLocaleString('tr-TR')} TL

Ödeme Yöntemi: ${data.paymentMethod === 'Bank Transfer' ? 'Havale/EFT' : 'Kredi Kartı'}

Admin Paneli: https://goldenglass777.com.tr/admin/orders
    `;

    try {
        await transporter.sendMail({
            from: '"Golden Glass 777" <noreply@goldenglass777.com.tr>',
            to: 'info@goldenglass777.com.tr',
            subject: `🛒 Yeni Sipariş: ${data.orderNumber}`,
            text: emailText,
        });
        return { success: true };
    } catch (error) {
        console.error('Admin email send error:', error);
        return { success: false, error };
    }
}
