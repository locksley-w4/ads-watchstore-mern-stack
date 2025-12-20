import React, { useState } from "react";
import Modal from "../ui/Modal/Modal";
import MyInput from "../ui/MyInput/MyInput";
import { api } from "../../api/api";
import { HashLoader } from "react-spinners";

export default function PasswordChangeModal({
  isVisible,
  setIsVisible,
  ...props
}) {
  const [loading, setLoading] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState(null);

  async function handlePwdUpdate(e) {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put("/user-password", {
        newPassword,
        oldPassword,
      });
      setLoading(false);
      if (response.status === 200) {
        alert("Successfully updated");
        setIsVisible(false)
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
      setError(error?.response?.data?.message || "Server error");
    }
  }

  return (
    <Modal
      className="passwordChangeModal"
      isVisible={isVisible}
      setIsVisible={setIsVisible}
      headline="Change password"
    >
      {loading && (
        <HashLoader className="loader" loading={loading} color="#d1a851" />
      )}
      {error && <p className="errorMsg">{error}</p>}
      <MyInput
        value={oldPassword}
        setValue={setOldPassword}
        placeholder="Old password"
        minLength="8"
        maxLength="200"
      />
      <MyInput
        value={newPassword}
        setValue={setNewPassword}
        placeholder="New password"
        minLength="8"
        maxLength="200"
      />
      <button onClick={handlePwdUpdate} className="myBtn" disabled={loading}>
        Change Password
      </button>
    </Modal>
  );
}
