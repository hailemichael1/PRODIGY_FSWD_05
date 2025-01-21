import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import useFollow from "../../hooks/useFollow";

import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import LoadingSpinner from "./LoadingSpinner";
import toast from "react-hot-toast";

const RightPanel = () => {
  const navigate = useNavigate(); // Hook for navigation

  const { data: suggestedUsers, isLoading } = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/users/suggested");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong!");
        }
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  });

  const { follow, isPending } = useFollow();

  const handleLogout = async () => {
    try {
      const response = await fetch("api/auth/logout", {
        // Update with your actual logout endpoint
        method: "POST",
        credentials: "include", // Include cookies with the request
      });

      const result = await response.json();

      if (response.ok) {
        // Optionally display message or perform other actions
        toast.success(result.message); // Display success message
        navigate("/login"); // Redirect to login page
      } else {
        throw new Error(result.error || "Logout failed");
      }
    } catch (error) {
      alert(error.message); 
    }
  };



  return (
    <>
      <div className="hidden lg:block my-4 mx-2">
        <div className="bg-[#16181C] p-4 rounded-md sticky top-2">
          {suggestedUsers?.length === 0 ? (
            <div className="md:w-64 w-0"></div>
          ) : (
            <>
              <p className="font-bold">Who to follow</p>
              <div className="flex flex-col gap-4">
                {/* Loading Skeletons */}
                {isLoading && (
                  <>
                    <RightPanelSkeleton />
                    <RightPanelSkeleton />
                    <RightPanelSkeleton />
                    <RightPanelSkeleton />
                  </>
                )}
                {/* Suggested Users */}
                {!isLoading &&
                  suggestedUsers?.map((user) => (
                    <Link
                      to={`/profile/${user.username}`}
                      className="flex items-center justify-between gap-4"
                      key={user._id}
                    >
                      <div className="flex gap-2 items-center">
                        <div className="avatar">
                          <div className="w-8 rounded-full">
                            <img
                              src={user.profileImg || "/avatar-placeholder.png"}
                              alt={`${user.fullName}'s avatar`}
                            />
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold tracking-tight truncate w-28">
                            {user.fullName}
                          </span>
                          <span className="text-sm text-slate-500">
                            @{user.username}
                          </span>
                        </div>
                      </div>
                      <div>
                        <button
                          className="btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm"
                          onClick={(e) => {
                            e.preventDefault();
                            follow(user._id);
                          }}
                        >
                          {isPending ? <LoadingSpinner size="sm" /> : "Follow"}
                        </button>
                      </div>
                    </Link>
                  ))}
              </div>
            </>
          )}
        </div>
      </div>
      <button
        className="btn bg-red-500 text-white hover:bg-red-600 rounded-full mt-4"
        onClick={handleLogout}
      >
        Logout
      </button>
    </>
  );
};
export default RightPanel;
