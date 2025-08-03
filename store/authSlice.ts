import { User } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface AuthState {
    user:User | null;
}

const initialState: AuthState = {
    user: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuthUser: (state, action:PayloadAction<User |null>) => {
            state.user = action.payload;
        },
        toggleSavePost: (state, action: PayloadAction<string>) => {
            if (state.user) {
                const postId = action.payload;
                const savedPosts = state.user.savedPosts as string[];
                const isPostSaved = savedPosts.includes(postId);
                
                if (isPostSaved) {
                    // Remove post from saved posts
                    state.user.savedPosts = savedPosts.filter(id => id !== postId);
                } else {
                    // Add post to saved posts
                    state.user.savedPosts = [...savedPosts, postId];
                }
            }
        },
    },
});

export const { setAuthUser, toggleSavePost } = authSlice.actions;
export default authSlice.reducer;