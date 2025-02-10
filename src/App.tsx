import { useEffect, useState } from 'react';
import './App.css';

interface TopTrait {
  trait: string;
  value: string;
  rarity: string;
}

interface NFT {
  tokenId: string;
  name: string;
  image: string;
  price: number;
  rank: number;
  topRarestTraits: TopTrait[];
}

function App() {
  const [maxPrice, setMaxPrice] = useState<number>(100);
  const [percentile, setPercentile] = useState<number>(10000);
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [hiddenTokens, setHiddenTokens] = useState<Set<string>>(new Set());
  const [error, setError] = useState('');

  // Convert IPFS CID to HTTP URL
  const getImageUrl = (image: string) => {
    if (image.startsWith('ipfs://')) {
      return `https://gateway.pinata.cloud/ipfs/${image.split('ipfs://')[1]}`;
    }
    return image;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/nfts?maxPrice=${maxPrice}&percentile=${percentile}`);
        const data = await response.json();
        setNfts(data);
      } catch (err) {
        setError('Failed to fetch NFTs');
      } 
    };

    // Optionally, you might want to fetch immediately on mount:
    fetchData();

    // Set up polling every 2000ms (2 seconds)
    const intervalId = setInterval(fetchData, 2000);

    // Clean up the interval on unmount or when dependencies change
    return () => clearInterval(intervalId);
  }, [maxPrice, percentile]);

  // Toggle hidden NFTs
  const toggleHidden = (tokenId: string) => {
    setHiddenTokens(prev => {
      const next = new Set(prev);
      if (next.has(tokenId)) {
        next.delete(tokenId);
      } else {
        next.add(tokenId);
      }
      return next;
    });
  };

  if (error) return <div className="error">{error}</div>;

  return (
    <div className="app">
      <div className="controls">
        <div className="filter">
          <label>
            Max Price:
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
          </label>
        </div>

        <div className="filter">
          <label>
            Rank:
            <input
              type="number"
              value={percentile}
              onChange={(e) => setPercentile(Number(e.target.value))}
            />
          </label>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Rank</th>
            <th>Price</th>
            <th>Top Traits</th>
            <th>Token ID</th>
            <th>Hide</th>
          </tr>
        </thead>
        <tbody>
          {nfts
            .filter(nft => !hiddenTokens.has(nft.tokenId))
            .map(nft => (
              <tr key={nft.tokenId}>
                <td>
                  <a href={getImageUrl(nft.image)} target="_blank" rel="noopener noreferrer">
                    <div className="image-container">
                      {/* Original Thumbnail */}
                      <img 
                        src={getImageUrl(nft.image)} 
                        alt={nft.name} 
                        className="thumbnail"
                      />
                    </div>
                  </a>
                </td>
                <td>{nft.rank}</td>
                <td>{nft.price.toFixed(2)}</td>
                <td>
                  <ul className="traits">
                    <li>
                      {nft.topRarestTraits
                        .map((trait) => `${trait.trait}: ${trait.value} (${trait.rarity})`)
                        .join(', ')}
                    </li>
                  </ul>
                </td>
                <td>{nft.tokenId}</td>
                <td>
                  <input
                    type="checkbox"
                    onChange={() => toggleHidden(nft.tokenId)}
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
