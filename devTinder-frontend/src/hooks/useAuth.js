import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { addUser, removeUser } from "../utils/userSlice";

export const useAuth = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    let cancelled = false;
    axios.get(BASE_URL + "/profile", { withCredentials: true })
      .then(res => {
        if(!cancelled) dispatch(addUser(res.data))
      })
      .catch(() => {
        if (!cancelled) dispatch(removeUser());
      });
    return () => {
      cancelled = true;
    }
  }, [dispatch]);
};