import { fetchNoteById } from "../../../../lib/api/clientApi";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import NoteDetailsClient from "./NoteDetails.client";
import { Metadata } from "next";

interface NoteDetailsProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: NoteDetailsProps): Promise<Metadata> {
  const { id } = await params;
  const res = await fetchNoteById(+id);
  return {
    title: `Note Details: ${res?.title}`,
    description: res?.content.slice(0, 30),
    openGraph: {
      title: `Note Details: ${res?.title}`,
      description: res?.content.slice(0, 30),
      url: `https://09-auth-xi.vercel.app/notes/${res?.id}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "notehub image",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Note Details: ${res?.title}`,
      description: res?.content.slice(0, 30),
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "notehub image",
        },
      ],
    },
  };
}

export default async function NoteDetails({ params }: NoteDetailsProps) {
  const { id } = await params;
  const noteId = +id;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["note", noteId],
    queryFn: () => fetchNoteById(noteId),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
