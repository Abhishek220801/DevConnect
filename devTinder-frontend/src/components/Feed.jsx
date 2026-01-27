import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { Code2, Sparkles } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md">
        {hasUsers ? (
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full mb-3">
                <Sparkles size={16} />
                <span className="text-sm font-semibold">Discover Developers</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Find Your Next Connection
              </h1>
              <p className="text-gray-600 text-sm">
                {feed.length} {feed.length === 1 ? 'developer' : 'developers'} waiting to connect
              </p>
            </div>
            
            <FeedCard
              key={feed[0]._id}
              user={feed[0]}
            />
          </div>
        ) : (
          <div className="text-center p-12 bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-200 shadow-xl">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Code2 size={48} className="text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">All Caught Up!</h2>
            <p className="text-gray-600 mb-6 max-w-sm mx-auto">
              You've seen all available developers. Check back later for more connections!
            </p>
            <div className="inline-flex items-center gap-2 text-purple-600 font-medium">
              <Sparkles size={16} />
              <span className="text-sm">New developers added daily</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
