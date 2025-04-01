import { create } from 'zustand';
import api from "../services/api";
import toast from 'react-hot-toast';
import { io } from "socket.io-client";


export const useAuthStore = create((set, get) => ({
    authUser: null,
    socket: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,  
    isUpdatingProfile: false,
    onlineUsers: [],

    // เช็คสถานะการเข้าสู่ระบบ
    checkAuth: async () => {
        try {
            const res = await api.get("/auth/check");
            set({ authUser: res.data });
        } catch (error) {
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    // สมัครสมาชิก
    Signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await api.post("/auth/signup", data);
            set({ authUser: res.data });
            toast.success("Account created successfully");
        } catch (error) {
            toast.error(error.response.data.message || "Sign Up Failed");
        } finally {
            set({ isSigningUp: false });
        }
    },

    // เข้าสู่ระบบ
    Login: async (data) => {
        set({ isLoggingIn: true });  
        try {
            const res = await api.post("/auth/signin", data);
            set({ authUser: res.data });
            toast.success("Logged in successfully");
        } catch (error) {
            toast.error(error.response.data.message || "Sign in Failed");
        } finally {
            set({ isLoggingIn: false });  
        }
    },

    // ออกจากระบบ
    logout: async () => {
        try {
            const res = await api.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error(error.response.data.message || "Logout Failed");
        }
    },

    // อัปเดตโปรไฟล์
    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await api.put("/auth/update-profile", data);
            set({ authUser: res.data });
            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error(error.response.data.message || "Update Profile Failed");
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    // เชื่อมต่อ Socket
    connectSocket: () => {
        const { authUser, socket } = get();
        if (!authUser || socket?.connected) return;
        const socketURL = import.meta.env.VITE_SOCKET_URL;
        const newSocket = io(socketURL, {
          query: { userId: authUser._id },
        });
        newSocket.connect();
        set({ socket: newSocket });
        newSocket.on("getOnlineUsers", (userIds) => {
          set({ onlineUsers: userIds });
        });
      },

    // ตัดการเชื่อมต่อ 
    disconnectSocket: () => {
        const { socket } = get();
        if (socket?.connected) {
            socket.disconnect();
            set({ socket: null });
        }
    },
}));