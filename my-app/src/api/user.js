import createApiInstance from "./createApiInstance.js";

const API_URL = "/v1/user";

const api = createApiInstance(API_URL);


//code admin
export const getAllUser = async () => {
    try {
        const response = await api.get("/getAll");
        return response.data;
    } catch {
        throw new Error("Failed to fetch cart data");
    }
}



export const getOrdersByUser = async () => {
    try {
        const response = await api.get("/order/getOrderByUserId");
        return response.data;
    } catch {
        throw new Error("Failed to fetch orders");
    }
};

export async function deleteUserById(id) {
    const { data } = await api.delete(`/deleteUserById/${id}`);
    return data;
}


export const getCart = async () => {
    try {
        const response = await api.get("/cart");
        return response.data;
    } catch {
        throw new Error("Failed to fetch cart data");
    }
}

export const getUser = async () => {
    try {
        const response = await api.get("/information");
        return response.data;
    } catch {
        throw new Error("Failed to fetch user data");
    }
}

export const checkEmailExists = async (email) => {
    const res = await api.get(`/getUserByEmail/${encodeURIComponent(email)}`, {
      validateStatus: (s) => s === 200 || s === 404,
    });
    return res.status === 200;
};

export const getUserById = async (userId) => {
    try {
        const response = await api.get(`/getUserById/${userId}`);
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch user");
    }
};

// Update user information
export const updateUser = async (data, file) => {
    // Sử dụng trực tiếp data.userDetails đã được xử lý từ component
    const requestData = {
        "id": data.id,
        "email": data.email,
        "username": data.username,
        "password": data.password,
        "userDetails": data.userDetails || {}
    }
    const fd = new FormData();
    console.log("Update: ", requestData, "file: ", file);
    fd.append(
        "request",
        new Blob([JSON.stringify(requestData)], { type: "application/json" }),
        "request.json"
    );

    if (file) fd.append("file", file);

    const response = await api.put("/update", fd, {
        transformRequest: [(payload, headers) => {
            delete headers.common?.["Content-Type"];
            delete headers.post?.["Content-Type"];
            delete headers.put?.["Content-Type"];
            delete headers["Content-Type"];
            return payload;
        }],
    });
    return response.data;
};


// Shop Owner APIs
export const getShopOwnerInfo = async () => {
    try {
        const response = await api.get("/shop-owners/info");
        return response.data;
    } catch (error) {
        console.error("Error fetching shop owner info:", error);
        throw new Error("Failed to fetch shop owner information");
    }
};

export const getShopOwnerByUserId = async (userId) => {
    try {
        const response = await api.get(`/shop-owners/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching shop owner by userId:", error);
        throw new Error("Failed to fetch shop owner");
    }
};

export const updateShopOwner = async (data, file) => {
    try {
        const requestData = {
            shopName: data.shopName,
            ownerName: data.ownerName,
            email: data.email,
            address: data.address,
            // GHN Address Fields
            phone: data.phone,
            provinceId: data.provinceId,
            provinceName: data.provinceName,
            districtId: data.districtId,
            districtName: data.districtName,
            wardCode: data.wardCode,
            wardName: data.wardName,
            streetAddress: data.streetAddress
        };

        const fd = new FormData();
        fd.append(
            "request",
            new Blob([JSON.stringify(requestData)], { type: "application/json" }),
            "request.json"
        );

        if (file) fd.append("file", file);

        const response = await api.put("/shop-owners/update", fd, {
            transformRequest: [(payload, headers) => {
                delete headers.common?.["Content-Type"];
                delete headers.put?.["Content-Type"];
                delete headers["Content-Type"];
                return payload;
            }],
        });
        return response.data;
    } catch (error) {
        console.error("Error updating shop owner:", error);
        throw new Error(error.response?.data?.message || "Failed to update shop owner");
    }
};

// Address APIs

export const updateAddress = async (data) => {
    try {
        const respone = await api.put("/address/update",data);
        return respone.data;
    } catch {
        throw new Error("Failed to update address");
    }
}

export const createAddress = async (data) => {
    try {
        const response = await api.post("/address/save", data);
        return response.data;
    } catch {
        throw new Error("Failed to create data");
    }
}

export const getAllAddress = async () => {
    try {
        const response = await api.get("/address/getAllAddresses");
        return response.data;
    } catch {
        throw new Error("Failed to fetch address")
    }
}

export const deleteAddress = async (id) => {
    try {
        const response = await api.delete(`/address/deleteAddressById/${id}`);
        return response.data;
    } catch (error) {
        console.error("Failed delete address:", error);
        return false;
    }
}

export const getAddressId = async (id) => {
    try {
        const respone = await api.get(`/address/getAddressById/${id}`);
        return respone.data;
    } catch {
        throw new Error("Failed to fetch addressId");
    }
}

export const setDefaultAddress = async (id) => {
    try {
        const response = await api.put(`/address/setDefaultAddress/${id}`);
        return response.data;
    } catch {
        throw new Error("Failed to set default address");
    }
}

// Role Request APIs
export const createRoleRequest = async (data) => {
    try {
        const response = await api.post("/role-requests", data);
        return response.data;
    } catch (error) {
        console.error("Error creating role request:", error);
        throw new Error("Failed to create role request");
    }
}

export const getUserRoleRequests = async () => {
    try {
        const response = await api.get("/role-requests/user");
        return response.data;
    } catch (error) {
        console.error("Error fetching user role requests:", error);
        throw new Error("Failed to fetch user role requests");
    }
}

// Pet APIs
export const getMyPets = async () => {
    try {
        const response = await api.get("/pet/my");
        return response.data;
    } catch (error) {
        console.error("Error fetching pets:", error);
        throw new Error("Failed to fetch pets");
    }
}

export const getPetById = async (petId) => {
    try {
        const response = await api.get(`/pet/${petId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching pet:", error);
        throw new Error("Failed to fetch pet");
    }
}

// Admin-level fetch by petId (for vet use-cases)
export const getPetByIdAdmin = async (petId) => {
    try {
        const response = await api.get(`/pet/admin/${petId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching pet (admin):", error);
        throw new Error("Failed to fetch pet (admin)");
    }
}

const normalizePetData = (d) => {
  const toDate = (v) => (v ? new Date(v).toISOString().slice(0, 10) : null);
  const toNum  = (v) => (v === "" || v === null || v === undefined ? null : Number(v));

  const up = (v) => (v ? String(v).toUpperCase() : null);

  return {
    name: d.name?.trim() || null,
    species: d.species?.trim() || null,
    breed: d.breed?.trim() || null,
    birthDate: toDate(d.birthDate),
    gender: up(d.gender),               
    color: d.color?.trim() || null,
    weightKg: toNum(d.weightKg),       
    microchipNumber: d.microchipNumber?.trim() || null,
    vaccinated: typeof d.vaccinated === "boolean" ? d.vaccinated : null,
    sterilized: typeof d.sterilized === "boolean" ? d.sterilized : null,
    lastVetVisit: toDate(d.lastVetVisit),
    notes: d.notes?.trim() || null,
    status: up(d.status) || null,       
  };
};

export const createPet = async (data, file) => {
  try {
    const payload = normalizePetData(data);

    if (!file) {
      const response = await api.post("/pet", payload, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    }

    const fd = new FormData();
    fd.append("request", new Blob([JSON.stringify(payload)], { type: "application/json" }), "request.json");
    fd.append("file", file);

    const response = await api.post("/pet", fd, {
      transformRequest: [(payload, headers) => {
        delete headers.common?.["Content-Type"];
        delete headers.post?.["Content-Type"];
        delete headers["Content-Type"];
        return payload;
      }],
    });
    return response.data;
  } catch (error) {
    console.error("Error creating pet:", error?.response || error);
    throw new Error(error?.response?.data?.message || "Failed to create pet");
  }
};

export const updatePet = async (petId, data, file) => {
  try {
    const payload = normalizePetData(data);

    const fd = new FormData();
    fd.append("request", new Blob([JSON.stringify(payload)], { type: "application/json" }), "request.json");
    if (file) fd.append("file", file);

    const response = await api.put(`/pet/${petId}`, fd, {
      transformRequest: [(payload, headers) => {
        delete headers.common?.["Content-Type"];
        delete headers.patch?.["Content-Type"];
        delete headers["Content-Type"];
        return payload;
      }],
    });
    return response.data;
  } catch (error) {
    console.error("Error updating pet:", error?.response || error);
    throw new Error(error?.response?.data?.message || "Failed to update pet");
  }
};

export const updatePetStatus = async (petId, status) => {
    try {
        const response = await api.put(`/pet/${petId}/status`, { status });
        return response.data;
    } catch (error) {
        console.error("Error updating pet status:", error);
        throw new Error("Failed to update pet status");
    }
}

export const deletePet = async (petId, soft = true) => {
    try {
        const response = await api.delete(`/pet/${petId}?soft=${soft}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting pet:", error);
        throw new Error("Failed to delete pet");
    }
}

export const getPetHealthRecords = async (petId) => {
    try {
        const response = await api.get(`/health-records/pet/${petId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching health records:", error);
        throw new Error("Failed to fetch health records");
    }
}

// Health Record APIs
export const getHealthRecord = async (recordId) => {
    try {
        const response = await api.get(`/health-records/${recordId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching health record:", error);
        throw new Error("Failed to fetch health record");
    }
}

export const createHealthRecord = async (data) => {
    try {
        const response = await api.post("/health-records", data);
        return response.data;
    } catch (error) {
        console.error("Error creating health record:", error);
        throw new Error("Failed to create health record");
    }
}

export const uploadHealthDocument = async (recordId, file, docType) => {
    try {
        const formData = new FormData();
        formData.append("file", file);
        if (docType) formData.append("docType", docType);
        
        const response = await api.post(`/health-records/${recordId}/documents`, formData, {
            transformRequest: [(payload, headers) => {
                delete headers.common?.["Content-Type"];
                delete headers.post?.["Content-Type"];
                delete headers["Content-Type"];
                return payload;
            }],
        });
        return response.data;
    } catch (error) {
        console.error("Error uploading health document:", error);
        throw new Error("Failed to upload health document");
    }
}

export const deleteHealthRecord = async (recordId) => {
    try {
        const response = await api.delete(`/health-records/${recordId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting health record:", error);
        throw new Error("Failed to delete health record");
    }
}

export const deleteHealthDocument = async (documentId) => {
    try {
        const response = await api.delete(`/health-records/documents/${documentId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting health document:", error);
        throw new Error("Failed to delete health document");
    }
}

// Debug function to check health records
export const debugPetHealthRecords = async (petId) => {
    try {
        const response = await api.get(`/health-records/debug/pet/${petId}`);
        return response.data;
    } catch (error) {
        console.error("Error debugging health records:", error);
        throw new Error("Failed to debug health records");
    }
}

// Download health document
export const downloadHealthDocument = async (documentId) => {
    try {
        const response = await api.get(`/health-records/documents/${documentId}/download`, {
            responseType: 'blob'
        });
        return response.data;
    } catch (error) {
        console.error("Error downloading health document:", error);
        throw new Error("Failed to download health document");
    }
}

// Create default address for testing
export const createDefaultAddressForTest = async () => {
    try {
        const response = await api.post('/location/debug/create-default-address');
        return response.data;
    } catch (error) {
        console.error("Error creating default address:", error);
        throw new Error("Failed to create default address");
    }
}

// Check if user has default address
export const checkDefaultAddress = async () => {
    try {
        const response = await api.get('/location/check-default-address');
        return response.data;
    } catch (error) {
        console.error("Error checking default address:", error);
        throw new Error("Failed to check default address");
    }
}

// Address APIs
