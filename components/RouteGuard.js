import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { favouritesAtom, searchHistoryAtom } from "../store";
import { getFavourites, getHistory } from "../lib/userData";

const PUBLIC_PATHS = ["history"];

const RouteGuard = ({ children }) => {
  const router = useRouter();
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

  const updateAtoms = async () => {
    setFavouritesList(await getFavourites());
    setSearchHistory(await getHistory());
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const isPublicPath = PUBLIC_PATHS.includes(router.pathname);

    if (!token && isPublicPath) {
      router.push("/login");
    } else if (token && isPublicPath) {
      console.log(token)
      router.push("/favourites"); // Redirect to homepage or another suitable page after login if trying to access public paths
    } else {
      // router.push("/");
      // Update atoms when user is logged in and on private routes
      if (!favouritesList || !searchHistory) {
        updateAtoms();
        
      }
    }
  }, [router.pathname]);

  return children;
};

export default RouteGuard;
