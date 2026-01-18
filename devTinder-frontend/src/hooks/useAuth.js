import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { addUser, removeUser } from "../utils/userSlice";

export const useAuth = () => {
  const dispatch = useDispatch();
  const {data: user, loaded} = useSelector(store => store.user);

  useEffect(() => {
    if(loaded) return;
    if(user) return;
    axios
      .get(BASE_URL + "/profile", { withCredentials: true })
      .then(res => dispatch(addUser(res.data)))
      .catch(() => dispatch(removeUser()));
  }, [loaded, dispatch]);
};