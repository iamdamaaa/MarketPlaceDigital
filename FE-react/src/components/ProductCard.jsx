import { Link } from 'react-router-dom';

function ProductCard({ product }) {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
    };

    return (
        <div className="product-card" id={`product-card-${product.id}`}>
            <div className="product-card-image">
                {product.thumbnail ? (
                    <img src={product.thumbnail} alt={product.title} />
                ) : (
                    <span>📦</span>
                )}
            </div>
            <div className="product-card-body">
                {product.category && (
                    <span className="product-card-category">{product.category.name}</span>
                )}
                <h3 className="product-card-title">{product.title}</h3>
                <p className="product-card-desc">{product.description}</p>
                <div className="product-card-footer">
                    <span className="product-card-price">{formatPrice(product.price)}</span>
                    <div className="product-card-action">
                        <Link to={`/products/${product.id}`} className="btn btn-maroon btn-sm">
                            Lihat Detail
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;
