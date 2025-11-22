import React, { useContext, useEffect, useState } from "react";
import "./Profile.css";
import PageHeader from "../../components/PageHeader/PageHeader";
import MyInput from "../../components/ui/MyInput/MyInput";
import emptyUserLogo from "../../components/assets/empty-user.jpg";
import { UserContext } from "../../context/UserContextProvider";
import { compareObjects, updateUserData } from "../../utils/utils";
import { AuthContext } from "../../context/AuthContextProvider";
import { api } from "../../api/api";
import { HashLoader } from "react-spinners";
import Modal from "../../components/ui/Modal/Modal";
import PasswordChangeModal from "../../components/PasswordChangeModal/PasswordChangeModal";

const Profile = () => {
  const { fetchUserData } = useContext(UserContext);
  const { user, setUser } = useContext(AuthContext);
  const [email, setEmail] = useState(null);
  const [fullName, setFullName] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [password, setPassword] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setFullName(user.fullName);
      setPhoneNumber(user.phoneNumber);
      setPassword(user.password);
    }
  }, [user]);

  useEffect(() => {
    let ignore = false;
    fetchUserData(ignore, setLoading, setError);
  }, []);



  async function handleUpdate() {
    setError({});
    setLoading(false);
    try {
      const newUserData = { email, fullName, phoneNumber };
      if (
        email === user.email &&
        fullName === user.fullName &&
        phoneNumber === user.phoneNumber
      ) {
        setError({ message: "Nothing to update" });
        return;
      }

      setLoading(true);
      const {
        data: { user: updated },
      } = await api.put("/user", { ...newUserData, password: 123 });

      setLoading(false);
      if (!updated) {
        setError({ message: "Error while updating user" });
        return;
      }
      setUser(updated);
      sessionStorage.setItem("user", JSON.stringify(updated));
    } catch (error) {
      setLoading(false);
      console.error(error);
      setError({
        message: error?.response?.data?.message || "Error while updating user",
      });
    }
    // alert(isSuccess ? "Updated Successfully." : "Update error. Please try again.")
  }

  const handleChangePassword = async (e) => {};

  return (
    <div className="profile">
      <PageHeader sidePadding={true}>
        <h2>My Profile</h2>
      </PageHeader>
      {loading ? (
        <HashLoader className="loader" loading={loading} color="#d1a851" />
      ) : (
        <>
          <div className="profile__logo">
            <img src={emptyUserLogo} alt="Your profile pic" />
          </div>
          {error?.message && <p>{error?.message}</p>}
          <MyInput
            required
            min="5"
            max="30"
            value={email}
            setValue={setEmail}
            label="Email"
          />
          <MyInput
            required
            min="2"
            max="30"
            value={fullName}
            setValue={setFullName}
            label="Full name"
          />
          <MyInput
            required
            minLength="5"
            maxLength="30"
            value={phoneNumber}
            setValue={setPhoneNumber}
            label="Phone number"
          />
          {/* <MyInput
        required
        min="5"
        max="30"
        value={password}
        setValue={setPassword}
        label="New Password"
        type="password"
        showHideBtn={true}
        /> */}
          <PasswordChangeModal
            isVisible={passwordModalVisible}
            setIsVisible={setPasswordModalVisible}
          />
          <button
            type="button"
            className="myBtn white"
            onClick={() => {
              setPasswordModalVisible(true);
            }}
          >
            Change Password
          </button>
          <button type="button" className="myBtn" onClick={handleUpdate}>
            Update
          </button>
        </>
      )}
    </div>
  );
};

export default Profile;
