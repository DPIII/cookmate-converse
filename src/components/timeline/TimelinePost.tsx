import { TimelinePost as TimelinePostType } from "@/types/timeline";

export function TimelinePost({ post }: { post: TimelinePostType }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-green-100">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-green-800">{post.user.username}</h3>
          <p className="text-sm text-gray-500">
            {new Date(post.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
      <h4 className="text-lg font-medium mb-2">{post.recipe.title}</h4>
      {post.recipe.image_url && (
        <img
          src={post.recipe.image_url}
          alt={post.recipe.title}
          className="w-full h-48 object-cover rounded-md mb-4"
        />
      )}
      <p className="text-gray-700">{post.content}</p>
    </div>
  );
}