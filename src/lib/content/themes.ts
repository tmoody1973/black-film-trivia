// Theme definitions for categorizing content
// Includes historical eras, genres, and regional classifications

export interface Theme {
  id: string
  name: string
  description: string
  icon: string // Lucide icon name
  contentTypes: ('film' | 'book')[]
}

export const THEMES: Theme[] = [
  // Historical Eras
  {
    id: 'harlem-renaissance',
    name: 'Harlem Renaissance',
    description: '1920s-1930s cultural movement',
    icon: 'Music',
    contentTypes: ['film', 'book'],
  },
  {
    id: 'civil-rights',
    name: 'Civil Rights Era',
    description: '1950s-1960s fight for equality',
    icon: 'Scale',
    contentTypes: ['film', 'book'],
  },
  {
    id: 'black-power',
    name: 'Black Power Movement',
    description: '1960s-1970s political movement',
    icon: 'Flame',
    contentTypes: ['film', 'book'],
  },
  {
    id: 'modern-era',
    name: 'Modern Era',
    description: '2000s-present day stories',
    icon: 'Sparkles',
    contentTypes: ['film', 'book'],
  },

  // Genres
  {
    id: 'horror',
    name: 'Black Horror',
    description: 'Horror films and gothic fiction',
    icon: 'Ghost',
    contentTypes: ['film', 'book'],
  },
  {
    id: 'romance',
    name: 'Black Love',
    description: 'Romance and relationship stories',
    icon: 'Heart',
    contentTypes: ['film', 'book'],
  },
  {
    id: 'comedy',
    name: 'Black Comedy',
    description: 'Comedy films and humorous works',
    icon: 'Smile',
    contentTypes: ['film'],
  },
  {
    id: 'drama',
    name: 'Drama',
    description: 'Powerful dramatic stories',
    icon: 'Theater',
    contentTypes: ['film', 'book'],
  },
  {
    id: 'scifi-fantasy',
    name: 'Sci-Fi & Fantasy',
    description: 'Afrofuturism and speculative fiction',
    icon: 'Rocket',
    contentTypes: ['film', 'book'],
  },
  {
    id: 'documentary',
    name: 'Documentary',
    description: 'True stories and non-fiction',
    icon: 'FileText',
    contentTypes: ['film', 'book'],
  },

  // Regional
  {
    id: 'african-cinema',
    name: 'African Cinema',
    description: 'Films from the African continent',
    icon: 'Globe',
    contentTypes: ['film'],
  },
  {
    id: 'caribbean',
    name: 'Caribbean Stories',
    description: 'Caribbean film and literature',
    icon: 'Palmtree',
    contentTypes: ['film', 'book'],
  },
  {
    id: 'british-black',
    name: 'British Black Cinema',
    description: 'UK-based Black filmmakers',
    icon: 'Landmark',
    contentTypes: ['film'],
  },
]

// Map themes to specific content
export const THEME_CONTENT_MAP: Record<string, { films: string[]; books: string[] }> = {
  'harlem-renaissance': {
    films: ['Bessie', 'Ma Rainey\'s Black Bottom', 'The Color Purple'],
    books: [
      'Their Eyes Were Watching God', 'Cane', 'The Collected Poems of Langston Hughes',
      'Native Son', 'Invisible Man', 'The Souls of Black Folk',
    ],
  },
  'civil-rights': {
    films: [
      'Selma', 'Malcolm X', 'The Butler', '12 Years a Slave', 'Just Mercy',
      'One Night in Miami', 'Judas and the Black Messiah', 'The Great Debaters',
    ],
    books: [
      'The Autobiography of Malcolm X', 'I Know Why the Caged Bird Sings', 'The Fire Next Time',
      'Go Tell It on the Mountain', 'A Raisin in the Sun', 'Notes of a Native Son',
      'Black Boy', 'Why Are All the Black Kids Sitting Together in the Cafeteria?',
    ],
  },
  'black-power': {
    films: [
      'Judas and the Black Messiah', 'Da 5 Bloods', 'BlacKkKlansman',
    ],
    books: [
      'The Autobiography of Malcolm X', 'Soul on Ice', 'The Wretched of the Earth',
      'Sister Outsider', 'The Mis-Education of the Negro',
    ],
  },
  'modern-era': {
    films: [
      'Black Panther', 'Get Out', 'Us', 'Moonlight', 'The Photograph',
      'Queen & Slim', 'Nope', 'The Woman King',
    ],
    books: [
      'Americanah', 'The Vanishing Half', 'Such a Fun Age', 'An American Marriage',
      'Transcendent Kingdom', 'The Nickel Boys', 'Homegoing',
    ],
  },
  'horror': {
    films: ['Get Out', 'Us', 'Candyman', 'Nope'],
    books: [
      'Ring Shout', 'The Ballad of Black Tom', 'My Soul to Keep', 'Beloved',
      'An Unkindness of Ghosts', 'Pet',
    ],
  },
  'romance': {
    films: [
      'Love & Basketball', 'Love Jones', 'The Photograph', 'Brown Sugar',
      'Poetic Justice', 'Boomerang', 'The Best Man', 'Waiting to Exhale',
      'Southside with You', 'If Beale Street Could Talk',
    ],
    books: [
      'An American Marriage', 'The Color Purple', 'Their Eyes Were Watching God',
      'Queenie', 'Such a Fun Age', 'Red at the Bone',
    ],
  },
  'comedy': {
    films: [
      'Friday', 'Barbershop', 'Coming to America', 'House Party', 'Boomerang',
      'Girls Trip', 'Think Like a Man', 'Ride Along', 'Soul Food',
    ],
    books: [],
  },
  'drama': {
    films: [
      'Moonlight', 'Fences', 'Precious', '12 Years a Slave', 'Fruitvale Station',
      'Mudbound', 'Clemency', 'The Pursuit of Happyness',
    ],
    books: [
      'Beloved', 'The Color Purple', 'Native Son', 'Go Tell It on the Mountain',
      'The Bluest Eye', 'Song of Solomon', 'A Lesson Before Dying',
    ],
  },
  'scifi-fantasy': {
    films: [
      'Black Panther', 'Black Panther: Wakanda Forever', 'A Wrinkle in Time',
      'Space Jam: A New Legacy',
    ],
    books: [
      'Kindred', 'Parable of the Sower', 'The Fifth Season', 'Children of Blood and Bone',
      'Binti', 'Wild Seed', 'Dawn', 'The City We Became', 'Black Leopard, Red Wolf',
      'Legendborn', 'A Master of Djinn', 'The Space Between Worlds',
    ],
  },
  'documentary': {
    films: ['13th', 'When They See Us', 'I Am Not Your Negro', 'What Happened, Miss Simone?'],
    books: [
      'The New Jim Crow', 'Stamped from the Beginning', 'How to Be an Antiracist',
      'Between the World and Me', 'The Warmth of Other Suns', 'Medical Apartheid',
      'Caste', 'Just Mercy',
    ],
  },
  'african-cinema': {
    films: [
      'Tsotsi', 'Beasts of No Nation', 'Queen of Katwe', 'The Boy Who Harnessed the Wind',
      'Yeelen', 'Touki Bouki', 'Black Girl', 'Hyenas', 'Moolaadé', 'Bamako',
      'Timbuktu', 'Félicité', 'I Am Not a Witch', 'Atlantics', 'Eyimofe (This Is My Desire)',
      'Kati Kati', 'Supa Modo', 'The Burial of Kojo', 'Rafiki', 'Inxeba (The Wound)',
    ],
    books: [],
  },
  'caribbean': {
    films: ['Yardie', 'The Harder They Fall'],
    books: ['A Brief History of Seven Killings', 'Wide Sargasso Sea', 'Annie John'],
  },
  'british-black': {
    films: [
      'Small Axe', 'Rocks', 'The Last Tree', 'Farming', 'Belle',
      'Yardie', 'Noughts + Crosses',
    ],
    books: ['Girl, Woman, Other', 'Queenie', 'The Fat Lady Sings'],
  },
}

// Get all available themes for a content type
// Accepts both singular (film/book) and plural (films/books) forms
export const getThemesForContentType = (contentType: 'film' | 'book' | 'films' | 'books' | 'mixed'): Theme[] => {
  if (contentType === 'mixed') {
    return THEMES
  }
  // Normalize to singular form
  const normalizedType = contentType === 'films' ? 'film' : contentType === 'books' ? 'book' : contentType
  return THEMES.filter(theme => theme.contentTypes.includes(normalizedType as 'film' | 'book'))
}

// Get content count for a theme
export const getThemeContentCount = (themeId: string, contentType: 'film' | 'book' | 'films' | 'books' | 'mixed'): number => {
  const themeContent = THEME_CONTENT_MAP[themeId]
  if (!themeContent) return 0

  if (contentType === 'film' || contentType === 'films') return themeContent.films.length
  if (contentType === 'book' || contentType === 'books') return themeContent.books.length
  return themeContent.films.length + themeContent.books.length
}
