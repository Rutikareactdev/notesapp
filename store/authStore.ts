import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
    user: any;
    token: string | null;
    notes: any,

    logout: () => void;
    restore: () => void;
    setNotes: (data: any) => void
};

const useAuthStore = create<AuthState>()(
    (set) => ({
        user: null,
        token: null,
        notes: [],

        logout: () => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            set({ token: null, user: null });
        },

        setNotes: (notes) =>
            set({
                notes: notes,
            }),

        restore: () => {
            if (typeof window === "undefined") return;

            const authtoken = localStorage.getItem("token");
            const userData = localStorage.getItem("user");

            if (authtoken && userData) {
                set({
                    token: authtoken,
                    user: JSON.parse(userData),
                });
            } else {
                set({
                    token: null,
                    user: null,
                });
            }
        }

    }),
);

export default useAuthStore;
