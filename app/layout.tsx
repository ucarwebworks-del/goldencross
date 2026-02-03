import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Golden Glass 777 | Premium Cam Tablolar',
  description: 'Eviniz ve ofisiniz için şık, modern ve kırılmaz cam tablolar. UV baskı teknolojisi ile üretilen Golden Glass 777 koleksiyonunu keşfedin.',
};

import { SettingsProvider } from '@/context/SettingsContext';
import { CategoryProvider } from '@/context/CategoryContext';
import { BankProvider } from '@/context/BankContext';
import { MessageProvider } from '@/context/MessageContext';
import { ProductProvider } from '@/context/ProductContext';
import { CartProvider } from '@/context/CartContext';
import { OrderProvider } from '@/context/OrderContext';
import { PageProvider } from '@/context/PageContext';
import { BannerProvider } from '@/context/BannerContext';
import { BlogProvider } from '@/context/BlogContext';
import { CouponProvider } from '@/context/CouponContext';
import { ReviewProvider } from '@/context/ReviewContext';

import { Toaster } from 'sonner';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={poppins.className}>
        <SettingsProvider>
          <CategoryProvider>
            <BankProvider>
              <MessageProvider>
                <ProductProvider>
                  <CartProvider>
                    <OrderProvider>
                      <PageProvider>
                        <BannerProvider>
                          <BlogProvider>
                            <CouponProvider>
                              <ReviewProvider>
                                {children}
                                <Toaster position="bottom-right" richColors />
                              </ReviewProvider>
                            </CouponProvider>
                          </BlogProvider>
                        </BannerProvider>
                      </PageProvider>
                    </OrderProvider>
                  </CartProvider>
                </ProductProvider>
              </MessageProvider>
            </BankProvider>
          </CategoryProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
