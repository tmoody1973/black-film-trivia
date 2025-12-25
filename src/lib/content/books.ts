// Curated list of notable books by Black authors
// Spanning classic literature, contemporary fiction, non-fiction, poetry, and more

export const BLACK_AUTHORED_BOOKS = [
  // Classic Literature
  "Beloved", "The Color Purple", "Invisible Man", "Native Son", "Their Eyes Were Watching God",
  "The Bluest Eye", "Song of Solomon", "Sula", "I Know Why the Caged Bird Sings", "Go Tell It on the Mountain",
  "A Raisin in the Sun", "The Autobiography of Malcolm X", "Roots", "The Fire Next Time", "Notes of a Native Son",
  "Black Boy", "If Beale Street Could Talk", "Giovanni's Room", "Another Country", "The Women of Brewster Place",

  // Contemporary Fiction
  "Americanah", "Homegoing", "The Underground Railroad", "An American Marriage", "The Vanishing Half",
  "Such a Fun Age", "The Water Dancer", "Transcendent Kingdom", "The Nickel Boys", "Sing, Unburied, Sing",
  "Red at the Bone", "The Warmth of Other Suns", "Queenie", "Girl, Woman, Other", "My Sister, the Serial Killer",
  "Children of Blood and Bone", "The Hate U Give", "On the Come Up", "Dear Martin", "All American Boys",
  "Long Way Down", "Ghost", "Monster", "Concrete Rose", "Clap When You Land",

  // Science Fiction & Fantasy
  "Kindred", "Parable of the Sower", "Parable of the Talents", "Dawn", "Wild Seed",
  "Fledgling", "The Fifth Season", "The Obelisk Gate", "The Stone Sky", "A Master of Djinn",
  "Ring Shout", "The City We Became", "Black Leopard, Red Wolf", "Binti", "An Unkindness of Ghosts",
  "The Space Between Worlds", "A Song of Wraiths and Ruin", "Legendborn", "Pet", "Riot Baby",

  // Non-Fiction & Essays
  "Between the World and Me", "How to Be an Antiracist", "Stamped from the Beginning", "The New Jim Crow",
  "When They Call You a Terrorist", "Heavy", "Men We Reaped", "Just Mercy", "Eloquent Rage",
  "Hood Feminism", "So You Want to Talk About Race", "White Fragility", "Caste", "We Were Eight Years in Power",
  "The Souls of Black Folk", "Why Are All the Black Kids Sitting Together in the Cafeteria?",
  "Medical Apartheid", "The Mis-Education of the Negro", "Up from Slavery", "Narrative of the Life of Frederick Douglass",

  // Poetry
  "The Prophet", "Citizen: An American Lyric", "Don't Call Us Dead", "The Tradition", "Night Sky with Exit Wounds",
  "Wade in the Water", "Collected Poems of Langston Hughes", "The Essential Gwendolyn Brooks", "Cane",
  "We a BaddDDD People", "Black Feeling Black Talk", "Sister Outsider", "The Collected Poems of Audre Lorde",

  // Memoir & Biography
  "Becoming", "A Promised Land", "The Light We Carry", "Born a Crime", "Year of Yes",
  "Finding Me", "Will", "Greenlights", "Know My Name", "More Than Enough",
  "I'm Still Here", "Educated", "What Happened", "My Life", "Dreams from My Father",

  // Young Adult
  "The Crossover", "Brown Girl Dreaming", "New Kid", "Stamped: Racism, Antiracism, and You",
  "Tyler Johnson Was Here", "Blended", "Genesis Begins Again", "A Good Kind of Trouble",
  "Piecing Me Together", "One of the Good Ones", "Internment", "Ace of Spades",
] as const

export type BlackAuthoredBook = typeof BLACK_AUTHORED_BOOKS[number]
