
import ProductCard from './ProductCard'

const ProductCardDemo = () => {
    return (
        <ProductCard
            title="Nike Air Max"
            subtitle="Premium Running Shoes"
            images={[
                'https://res.cloudinary.com/qfe5cvwo/image/upload/heliokit/products/product-1.jpg',
                'https://res.cloudinary.com/qfe5cvwo/image/upload/heliokit/products/product-2.jpg',
                'https://res.cloudinary.com/qfe5cvwo/image/upload/heliokit/products/product-3.jpg',
                'https://res.cloudinary.com/qfe5cvwo/image/upload/heliokit/products/product-4.jpg',
            ]}
            price={129}
            originalPrice={179}
            rating={4.8}
            reviewCount={2847}
            size="US 9.5"
        />

    )
}

export default ProductCardDemo
