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
  const [percentile, setPercentile] = useState<number>(100);
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [hiddenTokens, setHiddenTokens] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Convert IPFS CID to HTTP URL
  const getImageUrl = (image: string) => {
    if (image.startsWith('ipfs://')) {
      return `https://gateway.pinata.cloud/ipfs/${image.split('ipfs://')[1]}`;
    }
    return image;
  };

  // Fetch NFTs with debounce
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/nfts?maxPrice=${maxPrice}&percentile=${percentile}`);
        const data = await response.json();
        setNfts(data);
      } catch (err) {
        setError('Failed to fetch NFTs');
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchData, 500);
    return () => clearTimeout(debounceTimer);
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

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
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
                      <img 
                        src={getImageUrl(nft.image)} 
                        alt={nft.name} 
                        className="thumbnail"
                      />
                    </a>
                  </td>
                  <td>{nft.rank}</td>
                  <td>{nft.price.toFixed(2)}</td>
                  <td>
                    <ul className="traits">
                      {nft.topRarestTraits.map((trait, i) => (
                        <li key={i}>
                          {trait.trait}: {trait.value} ({trait.rarity})
                        </li>
                      ))}
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
      )}
    </div>
  );
}

export default App;
