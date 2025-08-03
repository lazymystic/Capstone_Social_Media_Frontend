import { Post } from '@/types';
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from '../ui/dialog';
import React from 'react';
import Image from 'next/image';

type Props = {
    post: Post | null;
}

const Comment = ({ post }: Props) => {

    if (!post) return null;

    return (
        <div>
            {/* Show comments if they exist */}
            {post.comments && post.comments.length > 0 && (
                <div className="mb-2">
                    {/* Show "View all comments" if more than 2 comments */}
                    {post.comments.length > 2 && (
                        <Dialog>
                            <DialogTrigger asChild>
                                <p className="mt-2 text-sm font-semibold cursor-pointer">
                                    View All {post?.comments.length} Comment{post.comments.length > 1 ? 's' : ''}
                                </p>
                            </DialogTrigger>
                            <DialogContent className="w-[1200px] max-w-none max-h-[90vh] p-0 gap-0 flex flex-col [&>button]:cursor-pointer">
                                <DialogTitle className="sr-only">View All Comments</DialogTitle>
                                <div className="flex flex-1 min-h-[600px]">
                                    <div className="sm:w-1/2 hidden max-h-[90vh] sm:block">
                                        <Image src={`${post?.image?.url}`} alt="Post Image" width={600} height={600} className="w-full h-full object-cover rounded-l-lg" />
                                    </div>
                                    <div className="flex flex-col w-full sm:w-1/2">
                                        <div className="flex-1 overflow-y-auto max-h-[80vh] p-6">
                                            {post?.comments.map((comment) => (
                                                <div key={comment._id} className="mb-6 flex items-start gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0 overflow-hidden">
                                                        {comment.user.profilePicture ? (
                                                            <Image 
                                                                src={comment.user.profilePicture} 
                                                                alt={comment.user.userName} 
                                                                width={40} 
                                                                height={40} 
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-gray-400 flex items-center justify-center text-white font-semibold">
                                                                {comment.user.userName?.charAt(0).toUpperCase()}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-semibold text-sm">{comment.user.userName}</span>
                                                        </div>
                                                        <p className="text-sm text-gray-700 mt-1">{comment.text}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    )}
                    {/* Show last 2 comments */}
                    {post.comments.slice(-2).map((comment) => (
                        <div key={comment._id} className="mb-2 flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-gray-300 flex-shrink-0 overflow-hidden">
                                {comment.user.profilePicture ? (
                                    <Image 
                                        src={comment.user.profilePicture} 
                                        alt={comment.user.userName} 
                                        width={24} 
                                        height={24} 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-400 flex items-center justify-center text-white text-xs font-semibold">
                                        {comment.user.userName?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <span className="font-semibold text-sm mr-2">{comment.user.userName}</span>
                                <span className="text-sm">{comment.text}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Comment