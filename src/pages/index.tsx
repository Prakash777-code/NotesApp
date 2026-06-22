import { getToken, removeToken } from "@/lib/token";
import { Notes } from "@/types/notes";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Home() {
  const [note, setNote] = useState<Notes[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogout = () => {
    removeToken();
    router.push("/login");
  };

  const fetchNotes = async () => {
    try {
      const res = await fetch("/api/notes", {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!res.ok) {
        throw new Error("Unable to fetch notes");
      }

      const data = await res.json();
      setNote(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.push("/login");
      return;
    }
    fetchNotes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content) {
      alert("Title and content are required");
      return;
    }

    try {
      setLoading(true);

      if (editId) {
        const res = await fetch(`/api/notes/${editId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({ title, content }),
        });

        if (!res.ok) {
          throw new Error("Failed to update note");
        }

        setEditId(null);
        setTitle("");
        setContent("");
      } else {
        const res = await fetch("/api/notes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({ title, content }),
        });

        if (!res.ok) {
          throw new Error("Faild to create note");
        }

        setTitle("");
        setContent("");
      }
      await fetchNotes();
    } catch (error) {
      console.log(error);
      alert("Something went wrong, try again");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete note");
      }

      await fetchNotes();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (note: Notes) => {
    setTitle(note.title);
    setContent(note.content);
    setEditId(note.id);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notes App</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2   hover:scale-110 transition duration-300 cursor-pointer rounded-2xl"
        >
          Logout
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto mt-10 flex flex-col gap-3"
      >
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-black"
        />

        <input
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-black"
        />

        {loading && (
          <div className="flex justify-center">
            <div className="w-12 h-12 border-4 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white py-2 rounded  hover:scale-110 transition duration-300 cursor-pointer"
        >
          {loading ? "Saving..." : editId ? "Update" : "Add"}
        </button>
      </form>

      <div className="max-w-md mx-auto mt-6 space-y-3">
        {note.map((n) => (
          <div
            key={n.id}
            className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-md hover:bg-gray-750 transition"
          >
            <h3 className="text-lg font-semibold text-white">{n.title}</h3>

            <p className="text-gray-300 mt-1">{n.content}</p>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleEdit(n)}
                className="px-3 py-1 text-sm rounded bg-blue-600  hover:scale-110 transition duration-300 cursor-pointer"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(n.id)}
                className="px-3 py-1 text-sm rounded bg-red-600  hover:scale-110 transition duration-300 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
