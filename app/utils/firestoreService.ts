import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  getDoc,
  setDoc,
  doc,
  query,
  orderBy,
  limit,
  startAfter,
  QueryConstraint,
  arrayUnion,
} from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
import db from "@/app/utils/firestore";
import { Game } from "@/types/game";
import { toast } from "react-toastify";

const storage = getStorage();

const handleFirestoreError = (error: unknown) => {
  // Log error to a service like Sentry
  console.error("Firestore Error: ", error);
  // Additional error handling logic
  const isServer = typeof window === "undefined";
  if (!isServer) {
    toast.error("Firestore error: " + error);
  }
};

const addGame = async (game: Game): Promise<string> => {
  try {
    const docRef = doc(db, "games", game.slug);
    const createdAt = new Date().getTime();
    await setDoc(docRef, game);
    await updateDoc(docRef, { createdAt });
    toast.success(docRef.id + " Game added successfully!");
    return docRef.id;
  } catch (e) {
    handleFirestoreError(e);
    throw e;
  }
};

const updateGame = async (id: string, game: Partial<Game>): Promise<void> => {
  try {
    const gameRef = doc(db, "games", id);
    await updateDoc(gameRef, game);
    toast.success("Game updated successfully! - " + game.id);
  } catch (e) {
    handleFirestoreError(e);
    throw e;
  }
};

const updateGameImageInFirestore = async (gameId: string, imageUrl: string) => {
  const gameRef = doc(db, "games", gameId);
  await updateDoc(gameRef, {
    background_image: imageUrl,
  });
};

const deleteGame = async (gameId: string, imageUrl: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, "games", gameId)); // Firestore belgesini sil

    // Firebase Storage'dan görseli sil
    if (imageUrl) {
      // Burada imageName yerine imageUrl geliyordu. Bu yüzden imageUrl'den sadece dosya adını çıkarıyoruz.
      const imageName = decodeURIComponent(
        imageUrl.split("/").pop()?.split("?")[0] || ""
      );

      const storageRef = ref(storage, `${imageName}`); // Doğru dosya yolu kullan
      await deleteObject(storageRef);
    }

    toast.success("Game deleted successfully! - " + gameId);
  } catch (e) {
    handleFirestoreError(e);
    throw e; // Hata durumunda tekrar atmak
  }
};

const getGame = async (gameId: string): Promise<Game | undefined> => {
  try {
    const docRef = doc(db, "games", gameId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return undefined;
    }
    return docSnap.data() as Game;
  } catch (e) {
    handleFirestoreError(e);
    throw e;
  }
};

const getGameList = async (): Promise<Game[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "games"));
    const games: Game[] = querySnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    }) as Game[];
    return games;
  } catch (e) {
    handleFirestoreError(e);
    throw e;
  }
};

const getPaginatedGameList = async (
  pageSize: number = 10,
  lastVisibleGame: any = null
): Promise<{ games: Game[]; lastVisible: any }> => {
  try {
    const constraints: QueryConstraint[] = [
      orderBy("name"),
      limit(pageSize),
      startAfter(lastVisibleGame ? lastVisibleGame.createdAt : 0),
    ];

    // Eğer `lastVisibleGame` varsa `startAfter` ekle
    if (lastVisibleGame) {
      constraints.push(startAfter(lastVisibleGame));
    }

    // Sorguyu oluştur
    const gamesQuery = query(collection(db, "games"), ...constraints);

    // Sorguyu çalıştır ve sonuçları al
    const querySnapshot = await getDocs(gamesQuery);

    const games: Game[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Game[];

    // Son dokümanı kaydet
    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

    return { games, lastVisible };
  } catch (e) {
    handleFirestoreError(e);
    throw e;
  }
};

const createList = async (list: any) => {
  try {
    await addDoc(collection(db, "lists"), list);
    toast.success("List added successfully!");
  } catch (e) {
    handleFirestoreError(e);
    throw e;
  }
};

const deleteList = async (listId: string) => {
  try {
    await deleteDoc(doc(db, "lists", listId));
    toast.success("List deleted successfully!");
  } catch (e) {
    handleFirestoreError(e);
    throw e;
  }
};

const getLists = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "lists"));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (e) {
    handleFirestoreError(e);
    throw e;
  }
};

interface GameData {
  id: string;
  name: string;
  background_image: string;
}

const addGameToList = async (listId: string, gameData: GameData) => {
  try {
    const docRef = doc(db, "lists", listId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("List not found");
    }

    const list = docSnap.data();
    if (!list) {
      throw new Error("List data is not available");
    }

    // `games` alanını kontrol et ve güncelle
    const updatedGames = list.games
      ? [...list.games, gameData] // Yeni oyun verisini ekle
      : [gameData];

    const updatedList = {
      ...list,
      games: updatedGames,
    };

    await updateDoc(docRef, updatedList);
    toast.success(`Game '${gameData.name}' added to list successfully!`);
  } catch (e) {
    handleFirestoreError(e);
    throw e;
  }
};

export {
  addGame,
  updateGame,
  deleteGame,
  getGame,
  getGameList,
  getPaginatedGameList,
  createList,
  deleteList,
  getLists,
  addGameToList,
  updateGameImageInFirestore,
};
