import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";
import { Heart, X, Code2, MapPin, Briefcase, Github, Linkedin, Twitter } from 'lucide-react';
import FeedCard from "./FeedCard";

const Feed = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [users, setUsers] = useState([]);
  
  const feed = useSelector(store => store.feed);
  const dispatch = useDispatch();

  const getFeed = async () => {
    const res = await axios.get(BASE_URL+'/user/feed', {withCredentials: true});
    setUsers(res?.data);
  }

  useEffect(() => {
    getFeed();
  }, [])

  const handleAccept = (user) => {
    console.log("Accepted:", user.firstName);
    if (currentIndex < users.length - 1) {
      setTimeout(() => setCurrentIndex(currentIndex + 1), 400);
    }
  };

  const handleReject = (user) => {
    console.log("Rejected:", user.firstName);
    if (currentIndex < users.length - 1) {
      setTimeout(() => setCurrentIndex(currentIndex + 1), 400);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {currentIndex < users.length ? (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-white mb-2">Discover Developers</h1>
              <p className="text-slate-400 text-sm">
                {currentIndex + 1} of {users.length}
              </p>
            </div>
            
            <FeedCard
              key={currentIndex}
              user={users[currentIndex]}
              onAccept={() => handleAccept}
              onReject={() => handleReject}
            />
          </div>
        ) : (
          <div className="text-center p-12 bg-slate-900/50 rounded-3xl border border-purple-500/20">
            <div className="w-20 h-20 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Code2 size={40} className="text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">All Caught Up!</h2>
            <p className="text-slate-400 mb-6">Check back later for more developers</p>
            <button 
              onClick={() => setCurrentIndex(0)}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-medium transition-colors"
            >
              Start Over
            </button>
          </div>
        )}
      </div>
    </div>
    // <div>Hello</div>
  );
};

export default Feed;
    // Mock data
    // const users = [
    //   {
    //     firstName: "Sarah",
    //     lastName: "Chen",
    //     age: 28,
    //     photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    //     about: "Full-stack developer passionate about building scalable web applications. Love working with modern JavaScript frameworks and exploring new technologies.",
    //     skills: ["React", "Node.js", "TypeScript", "MongoDB", "AWS", "Docker", "GraphQL"],
    //     location: "San Francisco, CA",
    //     currentRole: "Senior Frontend Engineer",
    //     github: "https://github.com",
    //     linkedin: "https://linkedin.com",
    //     twitter: "https://twitter.com"
    //   },
    //   {
    //     firstName: "Alex",
    //     lastName: "Kumar",
    //     age: 25,
    //     photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    //     about: "Backend wizard and cloud enthusiast. Building microservices and distributed systems. Always learning, always coding.",
    //     skills: ["Python", "Django", "PostgreSQL", "Redis", "Kubernetes", "CI/CD"],
    //     location: "Austin, TX",
    //     currentRole: "Backend Developer",
    //     github: "https://github.com",
    //     linkedin: "https://linkedin.com"
    //   },
    //   {
    //     firstName: "Maya",
    //     lastName: "Patel",
    //     age: 30,
    //     photoUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400",
    //     about: "Mobile app developer creating beautiful cross-platform experiences. React Native enthusiast with a passion for clean code and great UX.",
    //     skills: ["React Native", "Swift", "Kotlin", "Firebase", "Redux", "REST APIs"],
    //     location: "Seattle, WA",
    //     currentRole: "Mobile Developer",
    //     github: "https://github.com",
    //     linkedin: "https://linkedin.com",
    //     twitter: "https://twitter.com"
    //   }
    // ];