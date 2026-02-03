import Header from '@/components/shop/Header';
import Footer from '@/components/shop/Footer';
import CartDrawer from '@/components/shop/CartDrawer';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import { CartProvider } from '@/context/CartContext';

export default function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
            <WhatsAppButton />
            <CartDrawer />
        </div>
    );
}
