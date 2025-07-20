import axios from "axios";
import { CreateNoteValues, FetchNotesValues, Note } from "@/types/note";
import { UserCredentials, UserResponse, UpdateUser } from "@/types/user";

const client = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

export const register = async (
  data: UserCredentials
): Promise<UserResponse> => {
  const res = await client.post("/auth/register", data);
  return res.data;
};

export const login = async (data: UserCredentials): Promise<UserResponse> => {
  const res = await client.post("/auth/login", data);
  return res.data;
};

export const logout = async (): Promise<void> => {
  await client.post("/auth/logout");
};

export const checkSession = async (): Promise<UserResponse | null> => {
  try {
    const res = await client.get("/auth/session");
    return res.data;
  } catch {
    return null;
  }
};

export const getCurrentUser = async (): Promise<UserResponse> => {
  const res = await client.get("/users/me");
  return res.data;
};

export const updateUserProfile = async (
  data: UpdateUser
): Promise<UserResponse> => {
  const res = await client.patch("/users/me", data);
  return res.data;
};

// Работа с заметками
export const fetchNotes = async (
  search: string,
  page: number,
  tag?: string
): Promise<FetchNotesValues> => {
  const params = {
    search: search?.trim() || undefined,
    tag: tag?.trim() || undefined,
    page,
    perPage: 12,
  };

  const res = await client.get("/notes", { params });
  return res.data;
};

export const fetchNoteById = async (id: string | number): Promise<Note> => {
  const res = await client.get(`/notes/${id}`);
  return res.data;
};

export const createNote = async (data: CreateNoteValues): Promise<Note> => {
  const res = await client.post("/notes", data);
  return res.data;
};

export const deleteNote = async (id: string | number): Promise<Note> => {
  const res = await client.delete(`/notes/${id}`);
  return res.data;
};
