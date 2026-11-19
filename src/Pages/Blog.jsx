import { useEffect, useState } from "react";
import dbData from "../../db.json";

const STORAGE_KEY = "mars_blog_posts";
const USER_ID = "ulugbek-1";

const readSavedPosts = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : null;
    if (Array.isArray(parsed)) return parsed;
  } catch (error) {
    console.error("Ошибка чтения постов:", error);
  }
  return Array.isArray(dbData.posts) ? dbData.posts : [];
};

function EngZor() {
  const [posts, setPosts] = useState(readSavedPosts);
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const [comments, setComments] = useState({});
  const [open, setOpen] = useState(false);

  const sortedPosts = [...posts].sort(
    (a, b) => (b.likedBy?.length || 0) - (a.likedBy?.length || 0)
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    } catch (error) {
      console.error("Ошибка сохранения постов:", error);
    }
  }, [posts]);

  const addPost = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const newPost = {
      id: String(Date.now()),
      author: "Yusupov Ulugbek",
      text: text.trim(),
      image: image.trim(),
      likedBy: [],
      comments: [],
    };

    setPosts((prev) => [newPost, ...prev]);
    setText("");
    setImage("");
    setOpen(false);
  };

  const toggleLike = (post) => {
    const likedBy = post.likedBy || [];
    const updatedLikes = likedBy.includes(USER_ID)
      ? likedBy.filter((id) => id !== USER_ID)
      : [...likedBy, USER_ID];

    setPosts((prev) =>
      prev.map((item) =>
        item.id === post.id ? { ...item, likedBy: updatedLikes } : item
      )
    );
  };

  const addComment = (e, post) => {
    e.preventDefault();

    const message = comments[post.id]?.trim();
    if (!message) return;

    const newComment = {
      id: String(Date.now()),
      author: "Yusupov Ulugbek",
      text: message,
    };

    setPosts((prev) =>
      prev.map((item) =>
        item.id === post.id
          ? { ...item, comments: [...(item.comments || []), newComment] }
          : item
      )
    );

    setComments((prev) => ({
      ...prev,
      [post.id]: "",
    }));
  };

  return (
    <div className="mx-auto max-w-xl p-4">
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-xl border p-4 text-left"
      >
        Darsda nima o'rgandingiz? 💡
      </button>

      <div className="my-4 rounded-xl bg-green-500 p-3 text-center text-white">
        Eng zo'r
      </div>

      {open && (
        <form
          onSubmit={addPost}
          className="mb-5 space-y-3 rounded-xl border p-4"
        >
          <h2 className="font-bold">Post qo'shish</h2>

          <textarea
            value={text}
            maxLength={256}
            onChange={(e) => setText(e.target.value)}
            placeholder="O'z fikringizni qoldiring"
            className="w-full rounded-lg border p-3"
          />

          <input
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="Rasm URL yoki /images/rasm.jpg"
            className="w-full rounded-lg border p-3"
          />

          <button
            type="submit"
            className="rounded-lg bg-green-500 px-5 py-2 text-white"
          >
            Joylash
          </button>

          <button type="button" onClick={() => setOpen(false)}>
            Bekor qilish
          </button>
        </form>
      )}

      {sortedPosts.map((post) => (
        <div
          key={post.id}
          className="mb-5 rounded-xl border p-4"
        >
          <h3 className="font-bold">{post.author}</h3>
          <p className="my-3">{post.text}</p>

          {post.image && (
            <img
              src={post.image}
              alt="Post rasmi"
              className="w-full rounded-xl"
            />
          )}

          <div className="my-4 flex gap-5">
            <button onClick={() => toggleLike(post)}>
              {post.likedBy?.includes(USER_ID) ? "❤️" : "🤍"}
              {" "}{post.likedBy?.length || 0}
            </button>

            <span>
              💬 {post.comments?.length || 0}
            </span>
          </div>

          {(post.comments || []).map((comment) => (
            <div key={comment.id} className="mb-2">
              <strong>{comment.author}: </strong>
              {comment.text}
            </div>
          ))}

          <form
            onSubmit={(e) => addComment(e, post)}
            className="flex gap-2"
          >
            <input
              value={comments[post.id] || ""}
              onChange={(e) =>
                setComments((prev) => ({
                  ...prev,
                  [post.id]: e.target.value,
                }))
              }
              placeholder="Komment yozing..."
              className="min-w-0 flex-1 rounded-lg border p-2"
            />

            <button
              type="submit"
              className="rounded-lg bg-green-500 px-3 text-white"
            >
              Yuborish
            </button>
          </form>
        </div>
      ))}
    </div>
  );
}

export default EngZor;
