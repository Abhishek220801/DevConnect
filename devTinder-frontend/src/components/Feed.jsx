import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { Code2 } from 'lucide-react';
import FeedCard from "./FeedCard";
import { addFeed } from "../utils/FeedSlice";

const Feed = () => {
  
  const feed = useSelector(store => store.feed);
  const dispatch = useDispatch();

  const getFeed = async () => {
    try {
      const res = await axios.get(BASE_URL+'/user/feed', {withCredentials: true})
      dispatch(addFeed(res.data));
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    getFeed();
  }, [dispatch])

  const hasUsers = feed && feed.length > 0;

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {hasUsers ? (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-white mb-2">Discover Developers</h1>
              <p className="text-slate-400 text-sm">
                {feed.length} remaining
              </p>
            </div>
            
            <FeedCard
              key={feed[0]._id}
              user={feed[0]}
            />
          </div>
        ) : (
          <div className="text-center p-12 bg-slate-900/50 rounded-3xl border border-purple-500/20">
            <div className="w-20 h-20 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Code2 size={40} className="text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">All Caught Up!</h2>
            <p className="text-slate-400 mb-6">Check back later for more developers</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;