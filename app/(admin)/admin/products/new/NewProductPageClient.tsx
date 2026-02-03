import ProductForm from '@/components/admin/ProductForm';

export default function NewProductPageClient() {
    return (
        <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Yeni Ürün Ekle</h1>
            <ProductForm />
        </div>
    );
}
