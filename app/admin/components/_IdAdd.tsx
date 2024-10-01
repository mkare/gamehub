"use client";
import { useState, useEffect } from "react";
import { getGameList, addGame } from "@/app/utils/firestoreService";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import slugify from "@sindresorhus/slugify";

const gameDataNames = [
  "Fallout 76",
  "Wartales",
  "Crusader Kings III",
  "Agrou",
  "Overwatch 2",
  "Microsoft Flight Simulator 2020",
  "Subnautica: Below Zero",
  "Sunkenland",
  "The Sims 4",
  "Forza Horizon 4",
  "Destiny",
  "Raft",
  "SOMA",
  "Metal Gear Solid",
  "Devil May Cry 3: Dante's Awakening",
  "Stardew Valley",
  "Need For Speed Undercover",
  "Need for Speed: Underground 2",
  "The Last of Us Part II",
  "Path of Exile",
  "Need for Speed: Underground",
  "PlayerUnknown’s Battlegrounds",
  "Need for Speed: ProStreet",
  "Dead Cells: Return to Castlevania",
  "Vampire: The Masquerade - Bloodhunt",
  "World of Warplanes",
  "Fallout: New Vegas",
  "LittleBigPlanet",
  "Rust",
  "Elden Ring: Shadow of the Erdtree",
  "Need for Speed",
  "Minecraft",
  "Dishonored 2",
  "World of Warships",
  "Halo 4",
  "Battlefield 2: Modern Combat",
  "God of War: Ragnarök",
  "Grand Theft Auto V",
  "Battlefield 2042",
  "Warhammer 40,000: Space Marine II",
  "Brawlhalla",
  "Battlefield 1 Revolution",
  "Rocket League",
  "God of War I",
  "iRacing",
  "DOOM",
  "Battlefield 1",
  "Grand Theft Auto: San Andreas",
  "World of Warcraft Classic",
  "PUBG Mobile",
  "Resident Evil 4",
  "Forza Horizon 5",
  "Rocket League",
  "DOOM (2016)",
  "Apex Legends",
  "SCUM",
  "Escape from Tarkov",
  "Overwatch",
  "Metal Gear Solid V: The Phantom Pain",
  "Fallout 3",
  "Grand Theft Auto: Vice City",
  "Among Us",
  "Fortnite Battle Royale",
  "Valheim",
  "Fallout",
  "Goose Goose Duck",
  "The Legend of Zelda: Tears of the Kingdom",
  "Baldur's Gate III",
  "Blazing Sails",
  "DOOM II",
  "Valorant",
  "Death Stranding",
  "Gran Turismo 2",
  "Enshrouded",
  "Path of Exile 2",
  "Need for Speed: Shift",
  "DOOM 3",
  "Fallout 2",
  "The Sims 2",
  "BioShock",
  "The Sims",
  "Brawl Stars",
  "Mobile Legends: Bang bang",
  "Metal Gear Solid 4: Guns of the Patriots",
  "Gran Turismo 7",
  "tetr.io",
  "Deep Rock Galactic",
  "Lethal Company",
  "Diablo II",
  "Diablo IV",
  "Grand Theft Auto VI",
  "Nioh",
  "Hearts of Iron IV",
  "Red Dead Redemption 2",
  "Counter-Strike: Global Offensive",
  "Dishonored",
  "Teamfight Tactics",
  "The Last Of Us",
  "War Thunder",
  "Call of Duty: Warzone",
  "Battlefield 4",
  "The Legend of Zelda: Breath of the Wild",
  "World of Tanks",
  "Destiny 2",
  "Diablo",
  "Forza Horizon 3",
  "Counter-Strike 2",
  "Dota 2",
  "League of Legends",
  "Prince of Persia: The Forgotten Sands",
  "The Last of Us Part I",
  "Age of Empires",
  "Sea of Thieves",
  "Diablo III",
  "Elden Ring",
  "Subnautica",
  "Fallout 4",
  "Forza Horizon",
  "Gran Turismo Sport",
];

const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;

const UpdateAllGameIds = () => {
  const [gameList, setGameList] = useState<any[]>([]);
  const [gameIds, setGameIds] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  const storage = getStorage();

  useEffect(() => {
    // Oyun listesini alıyoruz
    const fetchGameList = async () => {
      setLoading(true);
      try {
        const games = await getGameList(); // Firestore'dan oyunları alıyoruz
        setGameList(games);
        setGameIds(games.map((game) => game.id));
        setTotal(games.length);
      } catch (error: any) {
        setError("Error fetching game list: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGameList();
  }, []);

  const getImageBlobFromUrl = (
    imageUrl: string,
    maxWidth: number = 1200,
    maxHeight: number = 1200
  ): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = document.createElement("img");
      img.crossOrigin = "anonymous"; // Handle CORS issues
      img.src = imageUrl;

      img.onload = () => {
        // Calculate the new dimensions
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = width * ratio;
          height = height * ratio;
        }

        // Create a canvas and draw the resized image
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error("Unable to create Blob"));
              }
            },
            "image/jpeg",
            0.8
          ); // You can adjust the image quality here (0.0 to 1.0)
        } else {
          reject(new Error("Unable to create Canvas context"));
        }
      };

      img.onerror = (err: any) => {
        reject(err);
      };
    });
  };

  const uploadImageBlobToFirebase = async (
    blob: Blob,
    fileName: string
  ): Promise<string> => {
    const storageRef = ref(storage, `games/${fileName}`);
    const snapshot = await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  };

  const addGamesToFirebase = async () => {
    setLoading(true);
    setProgress(0);
    setError(null);

    try {
      for (let i = 0; i < gameDataNames.length; i++) {
        const gameName = gameDataNames[i];

        // Oyunu arıyoruz
        const searchResponse = await fetch(
          `https://api.rawg.io/api/games?key=${apiKey}&search=${encodeURIComponent(
            gameName
          )}`
        );
        const searchData = await searchResponse.json();

        // Eğer sonuç varsa, ilk sonucu alıp Firestore'a ekliyoruz
        if (
          Array.isArray(searchData.results) &&
          searchData.results.length > 0
        ) {
          const rawgGameId = searchData.results[0].id;

          // Oyun görseli varsa indirip Firebase'e yükleyelim
          if (searchData.results[0].background_image) {
            const blob = await getImageBlobFromUrl(
              searchData.results[0].background_image
            );
            const imageUrl = await uploadImageBlobToFirebase(
              blob,
              `${gameName}.jpg`
            );

            // Firestore'a oyunu ekleyelim
            await addGame({
              id: slugify(gameName),
              game_id: rawgGameId,
              name: searchData.results[0].name,
              slug: searchData.results[0].slug,
              description: searchData.results[0].description,
              released: searchData.results[0].released,
              background_image: imageUrl,
              platforms: searchData.results[0].platforms.map(
                (platform: any) => platform.platform.name
              ),
              genres: searchData.results[0].genres.map(
                (genre: any) => genre.name
              ),
              rating: searchData.results[0].rating,
            });
          }
        }

        setProgress(i + 1); // İlerleme barı için
      }
    } catch (error: any) {
      setError("Error adding games to Firebase: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !progress) {
    return <p>Loading game list...</p>;
  }

  if (loading && progress) {
    return (
      <div>
        <p>Updating game IDs...</p>
        <progress value={progress} max={total}></progress>
        <p>
          {progress} / {total}
        </p>
      </div>
    );
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="container mt-5">
      <h1>Update All Game IDs</h1>
      <button className="btn btn-primary" onClick={addGamesToFirebase}>
        Add Games to Firebase
      </button>
    </div>
  );
};

export default UpdateAllGameIds;
