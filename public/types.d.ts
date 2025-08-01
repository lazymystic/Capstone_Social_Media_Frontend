export interface User{
    _id: string;
    userName: string;
    email: string;
    password: string;
    profilePicture: string;
    bio: string;
    followers: string[];
    following: string[];
    posts:  Post[];
    savedPosts: string[] | Post[];
    isVerified: boolean;
}

export interface Comment {
    _id: string;
    text: string;
    user: {
        _id: string;
        userName: string;
        profilePicture: string;
    }
    createdAt: string;
}

export interface Post {
    _id: string;
    caption: string;
    image: {
        url : string;
        publicId: string;
    };
    likes: string[];
    comments: Comment[];
    createdAt: string;
    
}