// Mock data for preview without database connection

export const mockImages = [
  {
    workId: 1,
    workName: "Curly Hills",
    file: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800",
    thumbFile: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400",
    dateAdded: new Date("2024-01-15"),
    dateCreated: new Date("2023-12-13"),
    medium: "Ink On Paper",
    filetype: "jpeg",
    filesize: "1.1M",
    dimensions: "40 x 60",
    comments: "This is an early large scale drawing exploring landscape patterns and topographical elements.",
    itemNotes: "",
    isHidden: 0,
    download: "",
    parent: 0,
    isADefault: 1,
    isAvailable: true,
    inTheHandsOf: ""
  },
  {
    workId: 2,
    workName: "Valley Approach",
    file: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800",
    thumbFile: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=400",
    dateAdded: new Date("2024-01-10"),
    dateCreated: new Date("2023-11-25"),
    medium: "Ink and Gouache on Paper",
    filetype: "jpeg",
    filesize: "2.3M",
    dimensions: "40 x 60",
    comments: "Part of a group of work which uses Los Angeles as a starting point, examining the relationship between natural landscape and urban development.",
    itemNotes: "",
    isHidden: 0,
    download: "",
    parent: 0,
    isADefault: 0,
    isAvailable: true,
    inTheHandsOf: ""
  },
  {
    workId: 3,
    workName: "Valley Approach - Detail",
    file: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800&crop=entropy",
    thumbFile: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=400&crop=entropy",
    dateAdded: new Date("2024-01-10"),
    dateCreated: new Date("2023-11-25"),
    medium: "Ink and Gouache on Paper",
    filetype: "jpeg",
    filesize: "1.8M",
    dimensions: "40 x 60",
    comments: "Detail view showing intricate line work and layering techniques.",
    itemNotes: "",
    isHidden: 0,
    download: "",
    parent: 2,
    isADefault: 0,
    isAvailable: false,
    inTheHandsOf: ""
  },
  {
    workId: 4,
    workName: "Urban Study #1",
    file: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800",
    thumbFile: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400",
    dateAdded: new Date("2024-01-08"),
    dateCreated: new Date("2023-10-15"),
    medium: "Ink on Canvas",
    filetype: "jpeg",
    filesize: "3.2M",
    dimensions: "50 x 70",
    comments: "An exploration of architectural density and urban patterns.",
    itemNotes: "",
    isHidden: 0,
    download: "",
    parent: 0,
    isADefault: 0,
    isAvailable: true,
    inTheHandsOf: ""
  },
  {
    workId: 5,
    workName: "Landscape Impressions #1",
    file: "https://images.unsplash.com/photo-1579541814924-49fef17c5be5?w=800",
    thumbFile: "https://images.unsplash.com/photo-1579541814924-49fef17c5be5?w=400",
    dateAdded: new Date("2024-01-05"),
    dateCreated: new Date("2023-09-20"),
    medium: "Acrylic and Ink on Canvas",
    filetype: "jpeg",
    filesize: "4.1M",
    dimensions: "50 x 70",
    comments: "Part of the landscape series exploring the intersection of nature and human intervention.",
    itemNotes: "",
    isHidden: 0,
    download: "",
    parent: 0,
    isADefault: 1,
    isAvailable: true,
    inTheHandsOf: ""
  },
  {
    workId: 6,
    workName: "Abstract Composition",
    file: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800",
    thumbFile: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400",
    dateAdded: new Date("2024-01-03"),
    dateCreated: new Date("2023-08-10"),
    medium: "Ink and Gouache on Paper",
    filetype: "jpeg",
    filesize: "1.9M",
    dimensions: "24 x 32",
    comments: "A study in contrasting patterns and organic forms.",
    itemNotes: "",
    isHidden: 0,
    download: "",
    parent: 0,
    isADefault: 0,
    isAvailable: true,
    inTheHandsOf: ""
  },
  {
    workId: 7,
    workName: "Terrain Study",
    file: "https://images.unsplash.com/photo-1549887534-1541e9326642?w=800",
    thumbFile: "https://images.unsplash.com/photo-1549887534-1541e9326642?w=400",
    dateAdded: new Date("2024-01-01"),
    dateCreated: new Date("2023-07-15"),
    medium: "Ink on Paper",
    filetype: "jpeg",
    filesize: "2.1M",
    dimensions: "40 x 60",
    comments: "Examination of topographical elements and their visual representation.",
    itemNotes: "",
    isHidden: 0,
    download: "",
    parent: 0,
    isADefault: 0,
    isAvailable: true,
    inTheHandsOf: ""
  },
  {
    workId: 8,
    workName: "Untitled Drawing",
    file: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800",
    thumbFile: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400",
    dateAdded: new Date("2023-12-28"),
    dateCreated: new Date("2023-06-20"),
    medium: "Pencil on Paper",
    filetype: "jpeg",
    filesize: "1.5M",
    dimensions: "18 x 24",
    comments: "An exploratory sketch examining spatial relationships.",
    itemNotes: "",
    isHidden: 0,
    download: "",
    parent: 0,
    isADefault: 0,
    isAvailable: true,
    inTheHandsOf: ""
  }
]

export function getMockImages() {
  return mockImages.filter((img) => img.isHidden === 0 && img.isAvailable)
}

export function getAllMockImages() {
  return mockImages
}

export function getMockImageById(id: number) {
  return mockImages.find((img) => img.workId === id)
}

export function getRelatedMockImages(id: number) {
  return mockImages.filter((img) => img.parent === id && img.isHidden === 0)
}

export function getOtherMockImages(excludeId: number, limit: number = 10) {
  return mockImages
    .filter((img) => img.workId !== excludeId && img.isHidden === 0 && img.isAvailable)
    .slice(0, limit)
}

