import { useEffect, useRef, useState } from "react";
import { updateUser, getUser } from "../../../api/user.js";
import { fetchImageById } from "../../../api/image.js";

export default function AccountInfo() {
  const [form, setForm] = useState({
    id: "",
    email: "",
    username: "",
    userDetails: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      gender: "MALE",
      aboutMe: "",
      birthDate: "",
    },
  });

  const [file, setFile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const prevUrlRef = useRef(""); // giữ objectURL hiện tại để revoke
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const me = await getUser();
        const pickBirth = (val) =>
          !val ? "" : String(val).split("T")[0].split(" ")[0];

        setForm({
          id: me?.id ?? "",
          email: me?.email ?? "",
          username: me?.username ?? "",
          userDetails: {
            firstName: me?.userDetails?.firstName ?? me?.firstName ?? "",
            lastName: me?.userDetails?.lastName ?? me?.lastName ?? "",
            phoneNumber: me?.userDetails?.phoneNumber ?? me?.phoneNumber ?? "",
            gender: me?.userDetails?.gender ?? me?.gender ?? "MALE",
            aboutMe: me?.userDetails?.aboutMe ?? me?.aboutMe ?? "",
            birthDate: pickBirth(me?.userDetails?.birthDate ?? me?.birthDate),
          },
        });

        // tải avatar hiện tại (nếu có)
        const imageId = me?.userDetails?.imageUrl ?? me?.imageUrl;
        if (imageId) {
          const resp = await fetchImageById(imageId); // arraybuffer
          const type = resp.headers?.["content-type"] || "image/jpeg";
          const blob = new Blob([resp.data], { type });
          const url = URL.createObjectURL(blob);
          if (prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current);
          prevUrlRef.current = url;
          setAvatarUrl(url);
        } else {
          setAvatarUrl("");
        }
      } catch (e) {
        console.error("Failed to fetch user data", e);
      }
    })();

    return () => {
      if (prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current);
    };
  }, []);

  const onChangeRoot = (e) => {
    const { id, value } = e.target;
    setForm((p) => ({ ...p, [id]: value }));
  };
  const onChangeDetails = (e) => {
    const { id, value } = e.target;
    setForm((p) => ({ ...p, userDetails: { ...p.userDetails, [id]: value } }));
  };

  // (tuỳ chọn) cắt ảnh thành vuông trước khi upload
  const cropToSquare = async (file) => {
    const bitmap = await createImageBitmap(file);
    const size = Math.min(bitmap.width, bitmap.height);
    const sx = (bitmap.width - size) / 2;
    const sy = (bitmap.height - size) / 2;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(bitmap, sx, sy, size, size, 0, 0, size, size);
    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, file.type || "image/jpeg", 0.9)
    );
    return new File([blob], file.name.replace(/\.\w+$/, "") + "_sq.jpg", {
      type: blob.type,
    });
  };

  const onFile = async (e) => {
    const picked = e.target.files?.[0] || null;
    if (!picked) return;
    const squared = await cropToSquare(picked); // bảo đảm vuông
    setFile(squared);
    const previewUrl = URL.createObjectURL(squared);
    if (prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current);
    prevUrlRef.current = previewUrl;
    setAvatarUrl(previewUrl);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      // Chỉ gửi các field có giá trị thực sự
      const userDetailsToSend = {};
      
      if (form.userDetails.firstName && form.userDetails.firstName.trim()) {
        userDetailsToSend.firstName = form.userDetails.firstName.trim();
      }
      if (form.userDetails.lastName && form.userDetails.lastName.trim()) {
        userDetailsToSend.lastName = form.userDetails.lastName.trim();
      }
      if (form.userDetails.phoneNumber && form.userDetails.phoneNumber.trim()) {
        userDetailsToSend.phoneNumber = form.userDetails.phoneNumber.trim();
      }
      if (form.userDetails.gender) {
        userDetailsToSend.gender = form.userDetails.gender;
      }
      if (form.userDetails.aboutMe && form.userDetails.aboutMe.trim()) {
        userDetailsToSend.aboutMe = form.userDetails.aboutMe.trim();
      }
      if (form.userDetails.birthDate && form.userDetails.birthDate.trim()) {
        userDetailsToSend.birthDate = form.userDetails.birthDate.trim();
      }

      const formDataToSend = {
        id: form.id,
        email: form.email,
        username: form.username,
        password: form.password,
        userDetails: userDetailsToSend
      };

      console.log("Sending data:", formDataToSend);
      await updateUser(formDataToSend, file);
      setMsg("Success update!");
    } catch (err) {
      setMsg(err?.message || "Update failure");
    } finally {
      setLoading(false);
    }
  };

  // style cho avatar vuông, đặt trong form
  const avatarStyles = {
    inline: { display: "flex", alignItems: "center", gap: 12 },
    btn: {
      width: 120,
      height: 120,
      borderRadius: 12,
      overflow: "hidden",
      border: "1px solid #e5e7eb",
      background: "#f9fafb",
      padding: 0,
      cursor: "pointer",
      position: "relative",
    },
    img: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block",
    },
    placeholder: {
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 32,
      color: "#9ca3af",
    },
    hint: { fontSize: 12, color: "#6b7280" },
  };

  return (
    <div className="tab-pane fade show active">
      <div className="myaccount-content">
        <h3>Account Details</h3>
        {msg && <div style={{ marginBottom: 12 }}>{msg}</div>}

        <div className="account-details-form">
          <form onSubmit={onSubmit}>
            <div className="row">
              <div className="col-lg-6">
                <div className="single-input-item">
                  <label htmlFor="firstName" className="required">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={form.userDetails.firstName}
                    onChange={onChangeDetails}
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="single-input-item">
                  <label htmlFor="lastName" className="required">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={form.userDetails.lastName}
                    onChange={onChangeDetails}
                  />
                </div>
              </div>
            </div>

            <div className="single-input-item">
              <label htmlFor="username" className="required">
                Display Name
              </label>
              <input
                type="text"
                id="username"
                value={form.username}
                onChange={onChangeRoot}
              />
            </div>

            <div className="single-input-item">
              <label htmlFor="email" className="required">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={form.email}
                onChange={onChangeRoot}
              />
            </div>

            <div className="row">
              <div className="col-lg-6">
                <div className="single-input-item">
                  <label htmlFor="phoneNumber">Phone</label>
                  <input
                    type="text"
                    id="phoneNumber"
                    value={form.userDetails.phoneNumber}
                    onChange={onChangeDetails}
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="single-input-item">
                  <label htmlFor="birthDate">Birth date</label>
                  <input
                    type="date"
                    id="birthDate"
                    value={form.userDetails.birthDate}
                    onChange={onChangeDetails}
                  />
                </div>
              </div>
            </div>

            <div className="single-input-item">
              <label htmlFor="aboutMe">About me</label>
              <input
                type="text"
                id="aboutMe"
                value={form.userDetails.aboutMe}
                onChange={onChangeDetails}
              />
            </div>

            <div className="row" style={{ alignItems: "center" }}>
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="gender" className="form-label">
                    Gender
                  </label>
                  <select
                    id="gender"
                    className="form-select"
                    value={form.userDetails.gender}
                    onChange={onChangeDetails}
                    aria-label="Select gender"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div className="col-md-6">
                <div className="single-input-item">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <button
                      type="button"
                      style={avatarStyles.btn}
                      onClick={() => fileInputRef.current?.click()}
                      title="Nhấp để thay đổi"
                    >
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt="avatar"
                          style={avatarStyles.img}
                        />
                      ) : (
                        <div style={avatarStyles.placeholder}>＋</div>
                      )}
                    </button>
                  </div>
                  <label htmlFor="avatar"> </label>
                  Avatar{" "}
                  <small style={avatarStyles.hintBelow}>
                    : Click on the frame to select photos
                  </small>
                  <input
                    ref={fileInputRef}
                    id="avatar"
                    type="file"
                    accept="image/*"
                    onChange={onFile}
                    hidden
                  />
                </div>
              </div>
            </div>

            <div className="single-input-item">
              <button className="check-btn sqr-btn" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>

            <input type="hidden" id="id" value={form.id} readOnly />
          </form>
        </div>
      </div>
    </div>
  );
}
