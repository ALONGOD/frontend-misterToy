import { useState } from 'react'
import { Link } from 'react-router-dom'

export function ToyPreview({ toy }) {
  const [isImgLoading, setImgLoading] = useState(true)

  function handleImageLoad() {
    setImgLoading(false)
  }
  const toyImageUrl = `https://target.scene7.com/is/image/Target/GUEST_65ecb462-c4ed-4efc-9ec1-fd9a015ebe36?wid=488&hei=488&fmt=pjpeg`;
  return (
    <Link to={`/toy/${toy._id}`}>
      <article className="toy-preview">
        <h1 className="toy-name">{toy.name}</h1>
        {isImgLoading && <div className="skeleton-loader"></div>}
        <div className="img-container">
          <img
            src={toyImageUrl} alt={toy.name}
            onLoad={handleImageLoad}
            style={{ display: isImgLoading ? 'none' : 'block' }}
          />
        </div>
        <h1>Price: ${toy.price}</h1>
        <h1 className={toy.inStock ? 'green' : 'red'}>
          {toy.inStock ? 'In stock' : 'Not in stock'}
        </h1>
      </article>
    </Link>
  )
}
