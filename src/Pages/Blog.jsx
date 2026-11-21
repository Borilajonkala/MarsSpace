
import { useEffect, useState } from "react";
import { LuHeart, LuLightbulb, LuMessageCircle } from "react-icons/lu";
import dbData from "../../db.json";

const API = "http://localhost:3000/posts";
const USER_ID = "ulugbek-1";

function EngZor() {
  const [posts, setPosts] = useState(() => {
    try {
      const saved = localStorage.getItem("mars_blog_posts");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore JSON parse errors
    }
    return Array.isArray(dbData.posts) ? dbData.posts : [];
  });
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const [comments, setComments] = useState({});
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const sortedPosts = [...posts].sort(
    (a, b) => (b.likedBy?.length || 0) - (a.likedBy?.length || 0)
  );
 
  useEffect(() => {
    fetch(API)
      .then((res) => {
        if (!res.ok) throw new Error("GET xatolik");
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) return;
        setPosts(data);
        localStorage.setItem("mars_blog_posts", JSON.stringify(data));
      })
      .catch(() => {
        setPosts((prev) => (prev.length === 0 && Array.isArray(dbData.posts) ? dbData.posts : prev));
      });
  }, []);

 
  const addPost = async (e) => {
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

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPost),
      });

      if (!res.ok) throw new Error("POST xatolik");

      const data = await res.json();
      setPosts((prev) => {
        const next = [data, ...prev];
        localStorage.setItem("mars_blog_posts", JSON.stringify(next));
        return next;
      });
    } catch {
      setPosts((prev) => {
        const next = [newPost, ...prev];
        localStorage.setItem("mars_blog_posts", JSON.stringify(next));
        return next;
      });
    }
    setText("");
    setImage("");
    setOpen(false);
    setError("");
  };

 
  const toggleLike = async (post) => {
    const likedBy = post.likedBy || [];

    const updatedLikes = likedBy.includes(USER_ID)
      ? likedBy.filter((id) => id !== USER_ID)
      : [...likedBy, USER_ID];

    const updatedPost = { ...post, likedBy: updatedLikes };

    try {
      const res = await fetch(`${API}/${post.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          likedBy: updatedLikes,
        }),
      });

      if (!res.ok) throw new Error("PATCH xatolik");

      const serverPost = await res.json();

      setPosts((prev) => {
        const next = prev.map((item) => (item.id === serverPost.id ? serverPost : item));
        localStorage.setItem("mars_blog_posts", JSON.stringify(next));
        return next;
      });
      setError("");
    } catch {
      setPosts((prev) => {
        const next = prev.map((item) => (item.id === updatedPost.id ? updatedPost : item));
        localStorage.setItem("mars_blog_posts", JSON.stringify(next));
        return next;
      });
    }
  };

 
  const addComment = async (e, post) => {
    e.preventDefault();

    const message = comments[post.id]?.trim();
    if (!message) return;

    const newComment = {
      id: String(Date.now()),
      author: "Yusupov Ulugbek",
      text: message,
    };

    const updatedPost = {
      ...post,
      comments: [...(post.comments || []), newComment],
    };

    try {
      const res = await fetch(`${API}/${post.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comments: updatedPost.comments,
        }),
      });

      if (!res.ok) throw new Error("PATCH xatolik");

      const serverPost = await res.json();

      setPosts((prev) => {
        const next = prev.map((item) => (item.id === serverPost.id ? serverPost : item));
        localStorage.setItem("mars_blog_posts", JSON.stringify(next));
        return next;
      });
    } catch {
      setPosts((prev) => {
        const next = prev.map((item) => (item.id === updatedPost.id ? updatedPost : item));
        localStorage.setItem("mars_blog_posts", JSON.stringify(next));
        return next;
      });
    }

    setComments((prev) => ({
      ...prev,
      [post.id]: "",
    }));
    setError("");
  };

  return (
    <div className="mx-auto max-w-xl p-4">
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-xl border p-4 text-left inline-flex items-center gap-2"
      >
        <LuLightbulb aria-hidden="true" />
        Darsda nima o'rgandingiz?
      </button>

      <div className="my-4 rounded-xl bg-green-500 p-3 text-center text-white">
        Eng zo'r
      </div>

      {error && <p className="text-red-500">{error}</p>}

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
            <button
              onClick={() => toggleLike(post)}
              className="inline-flex items-center gap-1.5"
            >
              <LuHeart
                aria-hidden="true"
                fill={post.likedBy?.includes(USER_ID) ? "currentColor" : "none"}
              />
              {post.likedBy?.length || 0}
            </button>

            <span className="inline-flex items-center gap-1.5">
              <LuMessageCircle aria-hidden="true" />
              {post.comments?.length || 0}
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
