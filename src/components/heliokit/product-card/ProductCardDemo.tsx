
import ProductCard from './ProductCard'

const ProductCardDemo = () => {
    return (
        <ProductCard
            title="Nike Air Max"
            subtitle="Premium Running Shoes"
            images={[
                'https://i.pinimg.com/736x/67/cb/af/67cbafc6e19ba1e3fe201fe65c6eed4c.jpg',
                'https://i.pinimg.com/1200x/9c/5b/57/9c5b57e85040cc03d1cd5ac95245d258.jpg',
                'https://i.pinimg.com/1200x/28/11/2f/28112f46e3350155a605a6bdfee45b37.jpg',
                'https://i.pinimg.com/1200x/8d/d8/78/8dd87825c789b6aa9661e3886b56756c.jpg',
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
