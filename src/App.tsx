//export default App;
import { useEffect, useState } from 'react';
import './App.css';
import { create } from 'ipfs-http-client';

// Create an instance of the IPFS client
const ipfs = create({ url: 'http://127.0.0.1:5001' });

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
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [percentile, setPercentile] = useState<string>('');
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [revealed, setRevealed] = useState<string>('');
  const [supply, setSupply] = useState<string>('');
  const [error, setError] = useState('');
  const [hiddenTokens, setHiddenTokens] = useState<Record<string, number>>(() => {
    // Load hidden tokens from localStorage on initial render
    const stored = localStorage.getItem('hiddenTokens');
    try {
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      console.error('Error parsing hiddenTokens:', e);
      return {};
    }
  });
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({}); // Store fetched image URLs

  const resetHiddenTokens = () => {
    setHiddenTokens({});
    localStorage.removeItem('hiddenTokens');
  };

  // Convert IPFS CID to HTTP URL
  const getImageUrl = (image: string) => {
    if (image.startsWith('ipfs://')) {
      //return `https://gateway.pinata.cloud/ipfs/${image.split('ipfs://')[1]}`;
      //console.log(image);
      //console.log(`https://flk-ipfs.xyz/ipfs/${image.split('ipfs://')[1]}`);
      return `https://flk-ipfs.xyz/ipfs/${image.split('ipfs://')[1]}`;
      //return `http://127.0.0.1:5001/ipfs/${image.split('ipfs://')[1]}`;
      //console.log(`https://gateway.pinata.cloud/ipfs/${image.split('ipfs://')[1]}`)
      //console.log( `http://127.0.0.1:5001/api/v0/cat?arg=${image.split('ipfs://')[1]}`)
      //return `http://127.0.0.1:5001/api/v0/cat?arg=${image.split('ipfs://')[1]}`;
    }
    return image;
  };

  // Fetch images for all NFTs
  //useEffect(() => {
    //const fetchImages = async () => {
      //for (const nft of nfts) {
        //if (nft.image.startsWith('ipfs://')) {
          //const cid = nft.image.split('ipfs://')[1];
          //if (!imageUrls[nft.tokenId]) {
            //await fetchImageFromIPFS(cid, nft.tokenId);
          //}
        //}
      //}
    //};

    //fetchImages();
  //}, [nfts]); // Re-run when `nfts` changes

  //useEffect(() => {
    //const fetchData = async () => {
      //try {
        //const response = await fetch(`/api/nfts?maxPrice=${maxPrice}&percentile=${percentile}`);
        //const data = await response.json();
        //console.log(data)
        //setNfts(data);
      //} catch (err) {
        //setError('Failed to fetch NFTs');
      //}
    //};

    //// Optionally, you might want to fetch immediately on mount:
    //fetchData();

    //// Set up polling every 2000ms (2 seconds)
    //const intervalId = setInterval(fetchData, 2000);

    //// Clean up the interval on unmount or when dependencies change
    //return () => clearInterval(intervalId);
  //}, [maxPrice, percentile]);

  useEffect(() => {
    const fetchNFTs = async (maxPrice = 0, percentile = 0, retries = 3, delay = 1000) => {
      try {
        const response = await fetch(`/api/nfts?maxPrice=${maxPrice}&percentile=${percentile}`);

        if (!response.ok) {
          if (response.status === 500 && retries > 0) {
            // Retry after a delay
            await new Promise(resolve => setTimeout(resolve, delay));
            return fetchNFTs(maxPrice, percentile, retries - 1, delay * 2); // Exponential backoff
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        }

        const data = await response.json();
        console.log(data);
        setNfts(data.nfts);
        setRevealed(data.revealed);
        setSupply(data.supply);
        //console.log(data.supply)
      } catch (err) {
        if (retries > 0) {
          // Retry after a delay
          await new Promise(resolve => setTimeout(resolve, delay));
          return fetchNFTs(maxPrice, percentile, retries - 1, delay * 2); // Exponential backoff
        } else {
          setError('Failed to fetch NFTs');
        }
      }
    };

    // Usage
    fetchNFTs(maxPrice, percentile);

    // Optionally, you might want to fetch immediately on mount:
    //fetchData();

    // Set up polling every 2000ms (2 seconds)
    //const intervalId = setInterval(fetchData, 5000);
    //const intervalId = setInterval(fetchNFTs(maxPrice, percentile), 2000);
    // Set up polling every 2000ms (2 seconds)
    const intervalId = setInterval(() => {
      fetchNFTs(maxPrice, percentile);
    }, 2000);

    // Clean up the interval on unmount or when dependencies change
    return () => clearInterval(intervalId);

  }, [maxPrice, percentile]);

  // Persist hidden tokens to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('hiddenTokens', JSON.stringify(hiddenTokens));
  }, [hiddenTokens]);

  // Modified toggle function to store price
  const toggleHidden = (nft: NFT) => {
    setHiddenTokens((prev) => {
      const newHidden = { ...prev };
      if (newHidden[nft.tokenId] !== undefined) {
        delete newHidden[nft.tokenId];
      } else {
        newHidden[nft.tokenId] = nft.price;
      }
      return newHidden;
    });
  };

  // Updated filter logic
  const visibleNfts = nfts.filter((nft) => {
    const hiddenPrice = hiddenTokens[nft.tokenId];
    return hiddenPrice === undefined || nft.price < hiddenPrice;
  });

  if (error) return <div className="error">{error}</div>;

  return (
    <div className="app">
      <div className="controls">
        <div className="filter">
          <label>
            Max Price:
            <input
              type="text"
              value={maxPrice}
              onChange={(e) => {
                const value = e.target.value;
                // Allow empty input or numeric values
                if (value === '' || !isNaN(Number(value))) {
                  setMaxPrice(value);
                }
              }}
            />
          </label>
        </div>

        <div className="filter">
          <label>
            Percentile:
            <input
              type="text"
              value={percentile}
              onChange={(e) => setPercentile(Number(e.target.value))}
            />
          </label>

          <div>
            Revealed: {revealed}/{supply} 
            {(() => {
              const percentage = revealed/supply * 100
              const formattedPercentage = percentage.toFixed(1);
              return ` (${formattedPercentage}%)`;
            })()}
          </div>
          <button className="reset-button" onClick={resetHiddenTokens}>
            Reset Hidden Tokens
          </button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Percentile</th>
            <th>Rank</th>
            <th>Price</th>
            <th>Top Traits</th>
            <th>Token ID</th>
            <th>Hide</th>
          </tr>
        </thead>
        <tbody>
          {visibleNfts.map((nft) => (
            <tr key={nft.tokenId}>
              <td>
                <a href={imageUrls[nft.tokenId] || getImageUrl(nft.image)} target="_blank" rel="noopener noreferrer">
                  {/* nft.name */}
                  {nft.name}
                  <div className="image-container">
                    {/* Use fetched image URL if available, otherwise fallback */}
                    {
                      //<img
                      //src={imageUrls[nft.tokenId] || getImageUrl(nft.image)}
                      //alt={nft.name}
                      //className="thumbnail"
                      //loading="lazy" // Lazy load images
                      //onError={(e) => {
                        //e.target.src = 'path/to/fallback-image.jpg'; // Fallback image
                      //}}
                    ///>
                    }
                  </div>
                </a>
              </td>
              <td
                style={{
                  backgroundColor: (() => {
                    const percentage = (nft.rank / revealed) * 100;
                    if (percentage < 1) return 'red'; // Red if <1%
                    if (percentage < 5) return 'yellow'; // Yellow if <5%
                    if (percentage < 10) return 'green'; // Green if <10%
                    return ''; // Default (no background color)
                  })(),
                }}
              >
              {(() => {
                const percentage = (nft.rank / revealed) * 100;
                const formattedPercentage = percentage.toFixed(1);
                return `${formattedPercentage}%`;
              })()}
              </td>
              <td>{`${nft.rank}/${revealed}`}</td>
              <td>{nft.price.toFixed(4)}</td>
              <td>
                <ul className="traits">
                  <li>
                    {nft.topRarestTraits
                      .map((trait) => `${trait.trait}: ${trait.value} (${trait.rarity})`)
                      .join(', ')}
                  </li>
                </ul>
              </td>
              <td>
                <a
                  href={`https://magiceden.io/item-details/${nft.chain}/${nft.contract}/${nft.tokenId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {nft.tokenId}
                </a>
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={!!hiddenTokens[nft.tokenId]}
                  onChange={() => toggleHidden(nft)}
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
