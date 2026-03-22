import useAuthStore from "@/store/authStore";


const useNotesHook = () => {
  const { setNotes } = useAuthStore();

  const getNotes = async (token: string) => {
    try {
      const res = await fetch("/api/notes/getnotes", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setNotes(data.data);

    } catch (err) {
      console.error(err);
    }
  };

  return { getNotes };
};

export default useNotesHook;