type SrcSet = {
  src: string;
  scale: string;
};

export type WikiPageMediaResponseItem = {
  leadImage: boolean;
  section_id: number;
  showInGallery: boolean;
  srcset: SrcSet[];
  title: string;
  type: "image" | "video";
};

type Thumbnail = {
  mimetype: string;
  width: number;
  height: number;
  duration: null;
  url: string;
};

export type WikiSearchResponseItem = {
  id: number;
  key: string;
  title: string;
  excerpt: string;
  matched_title: null | string;
  description: string;
  thumbnail: Thumbnail;
};

interface Latest {
  timestamp: Date;
  user: User;
}

interface User {
  id: number;
  name: string;
}

interface Original {
  mediatype: string;
  size: number | null;
  width: number;
  height: number;
  duration: null;
  url: string;
}

export type WikimediaGetFileResponse = {
  title: string;
  file_description_url: string;
  latest: Latest;
  preferred: Original;
  original: Original;
  thumbnail: Original;
};

export type WikiSearchResponse = {
  pages: WikiSearchResponseItem[];
};
