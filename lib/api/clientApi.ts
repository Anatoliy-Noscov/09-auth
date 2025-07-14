import { api } from "../../app/api/api";
import { CreateNoteValues, FetchNotesValues, Note } from "../../types/note";
import {
  LogInUser,
  UpdateUser,
  UserCredentials,
  UserResponse,
} from "../../types/user";

export async function register(data: UserCredentials): Promise<UserResponse> {
  const response = await api.post<UserResponse>("/auth/register", data);
  return response.data;
}

export async function login(data: UserCredentials): Promise<LogInUser> {
  const response = await api.post<LogInUser>("/auth/login", data);
  return response.data;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

export async function checkSession(): Promise<UserResponse | null> {
  try {
    const response = await api.get<UserResponse>("/auth/session");
    return response.data;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<UserResponse> {
  const response = await api.get<UserResponse>("/users/me");
  return response.data;
}

export async function updateUserProfile(
  data: UpdateUser
): Promise<UserResponse> {
  const response = await api.patch<UserResponse>("/users/me", data);
  return response.data;
}

export async function fetchNotes(
  search: string,
  page: number,
  tag?: string
): Promise<FetchNotesValues> {
  const params = {
    search: search?.trim() || undefined,
    tag: tag?.trim() || undefined,
    page,
    perPage: 12,
  };

  const response = await api.get<FetchNotesValues>("/notes", { params });
  return response.data;
}

export async function fetchNoteById(id: string | number): Promise<Note> {
  const response = await api.get<Note>(`/notes/${id}`);
  return response.data;
}

export async function createNote(data: CreateNoteValues): Promise<Note> {
  const response = await api.post<Note>("/notes", data);
  return response.data;
}

export async function deleteNote(id: string | number): Promise<Note> {
  const response = await api.delete<Note>(`/notes/${id}`);
  return response.data;
}
