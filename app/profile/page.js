"use client";
// Import necessary modules and components
import { useState, useEffect } from "react";
import { auth, db, storage } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { FiHeart } from "react-icons/fi";
import { SlUserFollowing } from "react-icons/sl";
import "../CSS/profile.css";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

function Profile() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedBio, setUpdatedBio] = useState("");
  const [updatedCookingSkills, setUpdatedCookingSkills] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (user) {
      const fetchUserProfile = async () => {
        try {
          const userDocRef = doc(db, "userProfiles", user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userProfileData = userDoc.data();
            setUserData(userProfileData);
            setUpdatedName(userProfileData.name);
            setUpdatedBio(userProfileData.bio);
            setUpdatedCookingSkills(userProfileData.cookingSkills);
          } else {
            console.log("User profile not found");
          }
        } catch (error) {
          console.error("Error fetching user profile:", error.message);
        }
      };

      fetchUserProfile();
    }
  }, [user, router]);

  const fetchUserProfile = async () => {
    try {
      const userDocRef = doc(db, "userProfiles", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userProfileData = userDoc.data();
        setUserData(userProfileData);
        setUpdatedName(userProfileData.name);
        setUpdatedBio(userProfileData.bio);
        setUpdatedCookingSkills(userProfileData.cookingSkills);
      } else {
        console.log("User profile not found");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error.message);
    }
  };

  const handleLogout = () => {
    auth.signOut();
    router.push("/");
  };

  const handleUpdateProfile = () => {
    setIsEditing(true);
  };



  const handleSaveChanges = async () => {
    setIsEditing(false);

    const updatedData = {
      name: updatedName,
      bio: updatedBio,
      cookingSkills: updatedCookingSkills,
    };

    try {
      const userDocRef = doc(db, "userProfiles", user.uid);
      const usersDocRef = doc(db, "Users", user.uid);

      // Update userProfiles collection
      await updateDoc(userDocRef, updatedData);

      // Update Users collection
      await updateDoc(usersDocRef, updatedData);

      // Refetch user profile after updating
      fetchUserProfile();
    } catch (e) {
      console.error(e);
    }

    if (file) {
      const storageRef = ref(storage, `profilePictures/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload progress:", progress + "%");
        },
        (error) => {
          console.error("Upload error:", error);
        },
        async () => {
          const url = await getDownloadURL(storageRef);
          console.log("Image uploaded successfully:", url);

          try {
            const userDocRef = doc(db, "userProfiles", user.uid);
            const usersDocRef = doc(db, "Users", user.uid);

            // Update userProfiles collection
            await updateDoc(userDocRef, {
              ...updatedData,
              photoURL: url,
            });

            // Update Users collection
            await updateDoc(usersDocRef, {
              ...updatedData,
              photoURL: url,
            });

            // Refetch user profile after updating
            fetchUserProfile();
          } catch (e) {
            console.error(e);
          }
        }
      );
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="container mt-5">
      <div className="row" style={{ boxShadow: '0 4px 6px -1px #ff6b6b' }}>
        <div className="col-md-3">
          <div className="card profile-card">
            <img
              src={
                isEditing && file
                  ? URL.createObjectURL(file)
                  : userData?.photoURL ||
                    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
              }
              alt="Profile"
              className="card-img-top profile-picture"
              style={{ height: "200px"}} // Set your preferred height and width
            />

            {isEditing && (
              <div className="mb-3 d-flex align-items-start">
                <label htmlFor="profilePicture" className="form-label me-3">
                  Profile Picture:
                </label>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="form-control"
                  id="profilePicture"
                />
              </div>
            )}
            <div className="card-body text-center">
              <h4 className="card-title">
                {isEditing ? (
                  <input
                    type="text"
                    className="form-control mb-2"
                    value={updatedName}
                    onChange={(e) => setUpdatedName(e.target.value)}
                  />
                ) : (
                  userData?.name
                )}
              </h4>
              <div className="d-flex justify-content-between mb-3">
                <div className="d-flex align-items-center">
                  <SlUserFollowing className="me-1" />
                  <span>{userData?.followersCount || 0} followers</span>
                </div>
                <div className="d-flex align-items-center">
                  <FiHeart className="me-1" />
                  <span>{userData?.Likes || 0} likes</span>
                </div>
              </div>
              <button className="btn btn-primary mb-3">Favorite Recipes</button>
            </div>
          </div>
        </div>

        <div className="col-md-9">
          <div className="card profile-details-card">
            <div className="card-body">
              <h2 className="card-title">Bio:</h2>
              {isEditing ? (
                <textarea
                  value={updatedBio}
                  onChange={(e) => setUpdatedBio(e.target.value)}
                  className="form-control"
                />
              ) : (
                userData?.bio
              )}

              <div className="card-text mb-3">
                <h2 className="card-title">Cooking Skills:</h2>

                {isEditing ? (
                  <textarea
                    value={updatedCookingSkills}
                    onChange={(e) => setUpdatedCookingSkills(e.target.value)}
                    className="form-control"
                  />
                ) : (
                  userData?.cookingSkills
                )}
              </div>
              {isEditing ? (
                <div className="mb-3 text-center">
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={handleSaveChanges}
                  >
                    Save Changes
                  </button>
                </div>
              ) : (
                <button
                  className="btn btn-outline-primary mb-3"
                  onClick={handleUpdateProfile}
                >
                  Update Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
