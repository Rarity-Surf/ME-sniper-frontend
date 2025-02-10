//import { useEffect, useState } from 'react';
//import './App.css';
//import { create } from 'ipfs-http-client';

//// Create an instance of the IPFS client
//const ipfs = create({ url: 'http://127.0.0.1:5001' });

//interface TopTrait {
  //trait: string;
  //value: string;
  //rarity: string;
//}

//interface NFT {
  //tokenId: string;
  //name: string;
  //image: string;
  //price: number;
  //rank: number;
  //topRarestTraits: TopTrait[];
//}

//function App() {
  //const [maxPrice, setMaxPrice] = useState<string>("");
  //const [percentile, setPercentile] = useState<string>("");
  //const [nfts, setNfts] = useState<NFT[]>([]);
  //const [error, setError] = useState('');
  //const [hiddenTokens, setHiddenTokens] = useState<Record<string, number>>(() => {
    //// Load hidden tokens from localStorage on initial render
    //const stored = localStorage.getItem('hiddenTokens');
    //try {
      //return stored ? JSON.parse(stored) : {};
    //} catch (e) {
      //console.error('Error parsing hiddenTokens:', e);
      //return {};
    //}
  //});

  //const resetHiddenTokens = () => {
    //setHiddenTokens({});
    //localStorage.removeItem('hiddenTokens');
  //};

  //// Convert IPFS CID to HTTP URL
  //const getImageUrl = (image: string) => {
    //console.log(image)
    //if (image.startsWith('ipfs://')) {
      ////return `https://gateway.pinata.cloud/ipfs/${image.split('ipfs://')[1]}`;
      ////return `https://${image.split('ipfs://')[1]}.ipfs/${image.split('ipfs://')[1]}`;
      ////console.log(`https://${image.split('/')[2]}.ipfs.flk-ipfs.xyz/${image.split('/')[3]}`)
      ////console.log(`http://127.0.0.1:5001/ipfs/${image.split('ipfs://')[1]}`)
      //return `http://127.0.0.1:5001/ipfs/${image.split('ipfs://')[1]}`
      ////https://bafybeibc5sgo2plmjkq2tzmhrn54bk3crhnc23zd2msg4ea7a4pxrkgfna.ipfs.flk-ipfs.xyz/1
    //}
    //return image;
  //};

  //async function fetchImageFromIPFS(cid) {
    //try {
      //const chunks = [];
      //for await (const chunk of ipfs.cat(cid)) {
        //chunks.push(chunk);
      //}

      //const imageData = new Uint8Array(chunks.reduce((acc, chunk) => [...acc, ...chunk], []));
      //const blob = new Blob([imageData], { type: 'image/jpeg' }); // Adjust MIME type as needed
      //return URL.createObjectURL(blob); // Return the Blob URL
    //} catch (error) {
      //console.error('Error fetching image from IPFS:', error);
      //return null; // Return null or a fallback URL in case of error
    //}
  //}

  //useEffect(() => {
    //const fetchData = async () => {
      //try {
        //const response = await fetch(`/api/nfts?maxPrice=${maxPrice}&percentile=${percentile}`);
        //const data = await response.json();
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

    //// Persist hidden tokens to localStorage whenever they change
  //useEffect(() => {
    //localStorage.setItem('hiddenTokens', JSON.stringify(hiddenTokens));
  //}, [hiddenTokens]);


  //// Modified toggle function to store price
  //const toggleHidden = (nft: NFT) => {
    //setHiddenTokens(prev => {
      //const newHidden = { ...prev };
      //if (newHidden[nft.tokenId] !== undefined) {
        //delete newHidden[nft.tokenId];
      //} else {
        //newHidden[nft.tokenId] = nft.price;
      //}
      //return newHidden;
    //});
  //};

  //// Updated filter logic
  //const visibleNfts = nfts.filter(nft => {
    //const hiddenPrice = hiddenTokens[nft.tokenId];
    //return hiddenPrice === undefined || nft.price < hiddenPrice;
  //});

  //if (error) return <div className="error">{error}</div>;

  //return (
    //<div className="app">
      //<div className="controls">
        //<div className="filter">
          //<label>
            //Max Price:
            //<input
              //type="text"
              //value={maxPrice}
              //onChange={(e) => {
               //const value = e.target.value;
               //// Allow empty input or numeric values
               //if (value === "" || !isNaN(Number(value))) {
                 //setMaxPrice(value);
               //}
             //}}
            ///>
          //</label>
        //</div>

        //<div className="filter">
          //<label>
            //Rank:
            //<input
              //type="text"
              //value={percentile}
              //onChange={(e) => setPercentile(Number(e.target.value))}
            ///>
          //</label>

        //<button className="reset-button" onClick={resetHiddenTokens}>Reset Hidden Tokens</button>
        //</div>
      //</div>

      //<table>
        //<thead>
          //<tr>
            //<th>Image</th>
            //<th>Rank</th>
            //<th>Price</th>
            //<th>Top Traits</th>
            //<th>Token ID</th>
            //<th>Hide</th>
          //</tr>
        //</thead>
        //<tbody>
          //{visibleNfts.map(nft => (
              //<tr key={nft.tokenId}>
                //<td>
                  //<a href={getImageUrl(nft.image)} target="_blank" rel="noopener noreferrer">
                    //<div className="image-container">
                      //[> Original Thumbnail <]
                      //<img 
                        //src={getImageUrl(nft.image)} 
                        //alt={nft.name} 
                        //className="thumbnail"
                      ///>
                    //</div>
                  //</a>
                //</td>
                //<td>{nft.rank}</td>
                //<td>{nft.price.toFixed(2)}</td>
                //<td>
                  //<ul className="traits">
                    //<li>
                      //{nft.topRarestTraits
                        //.map((trait) => `${trait.trait}: ${trait.value} (${trait.rarity})`)
                        //.join(', ')}
                    //</li>
                  //</ul>
                //</td>
                //<td>
                  //<a
                    //href={`https://magiceden.io/collections/${nft.chain}/${nft.contract}?search="${nft.tokenId}"`}
                    //target="_blank"
                    //rel="noopener noreferrer"
                  //>
                    //{nft.tokenId}
                  //</a>
                //</td>
                //<td>
                  //<input
                    //type="checkbox"
                    //checked={!!hiddenTokens[nft.tokenId]}
                    //onChange={() => toggleHidden(nft)}
                  ///>
                //</td>
              //</tr>
            //))}
        //</tbody>
      //</table>
    //</div>
  //);
//}

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
      //return `http://127.0.0.1:5001/ipfs/${image.split('ipfs://')[1]}`;
      //console.log(`https://gateway.pinata.cloud/ipfs/${image.split('ipfs://')[1]}`)
      //console.log( `http://127.0.0.1:5001/api/v0/cat?arg=${image.split('ipfs://')[1]}`)
      return `http://127.0.0.1:5001/api/v0/cat?arg=${image.split('ipfs://')[1]}`;
    }
    return image;
  };

  // Fetch image from IPFS and cache the URL
  const fetchImageFromIPFS = async (cid: string, tokenId: string) => {
    try {
      const chunks = [];
      for await (const chunk of ipfs.cat(cid)) {
        chunks.push(chunk);
      }

      const imageData = new Uint8Array(chunks.reduce((acc, chunk) => [...acc, ...chunk], []));
      const blob = new Blob([imageData], { type: 'image/jpeg' }); // Adjust MIME type as needed
      const imageUrl = URL.createObjectURL(blob);

      // Cache the image URL in state
      setImageUrls((prev) => ({ ...prev, [tokenId]: imageUrl }));
    } catch (error) {
      console.error('Error fetching image from IPFS:', error);
      // Optionally, set a fallback image URL in case of error
      setImageUrls((prev) => ({ ...prev, [tokenId]: 'path/to/fallback-image.jpg' }));
    }
  };

  // Fetch images for all NFTs
  useEffect(() => {
    const fetchImages = async () => {
      for (const nft of nfts) {
        if (nft.image.startsWith('ipfs://')) {
          const cid = nft.image.split('ipfs://')[1];
          if (!imageUrls[nft.tokenId]) {
            await fetchImageFromIPFS(cid, nft.tokenId);
          }
        }
      }
    };

    fetchImages();
  }, [nfts]); // Re-run when `nfts` changes

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
            Rank:
            <input
              type="text"
              value={percentile}
              onChange={(e) => setPercentile(Number(e.target.value))}
            />
          </label>

          <button className="reset-button" onClick={resetHiddenTokens}>
            Reset Hidden Tokens
          </button>
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
          {visibleNfts.map((nft) => (
            <tr key={nft.tokenId}>
              <td>
                <a href={imageUrls[nft.tokenId] || getImageUrl(nft.image)} target="_blank" rel="noopener noreferrer">
                  <div className="image-container">
                    {/* Use fetched image URL if available, otherwise fallback */}
                    <img
                      src={imageUrls[nft.tokenId] || getImageUrl(nft.image)}
                      alt={nft.name}
                      className="thumbnail"
                      loading="lazy" // Lazy load images
                      onError={(e) => {
                        e.target.src = 'path/to/fallback-image.jpg'; // Fallback image
                      }}
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
              <td>
                <a
                  href={`https://magiceden.io/collections/${nft.chain}/${nft.contract}?search="${nft.tokenId}"`}
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
