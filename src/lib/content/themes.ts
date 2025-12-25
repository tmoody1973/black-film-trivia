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
  {
    id: 'action',
    name: 'Action & Crime',
    description: 'Action-packed thrillers and crime stories',
    icon: 'Sword',
    contentTypes: ['film'],
  },
  {
    id: 'sports',
    name: 'Sports',
    description: 'Athletic achievement and competition',
    icon: 'Trophy',
    contentTypes: ['film'],
  },
  {
    id: 'ya-childrens',
    name: 'Young Adult & Children',
    description: 'Stories for younger audiences',
    icon: 'BookOpen',
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
    films: [
      'Bessie', 'Ma Rainey\'s Black Bottom', 'The Color Purple', 'Cadillac Records',
      'The United States vs. Billie Holiday', 'The Great Debaters',
    ],
    books: [
      'Their Eyes Were Watching God', 'Cane', 'Collected Poems of Langston Hughes',
      'Native Son', 'Invisible Man', 'The Souls of Black Folk', 'The Bluest Eye',
      'Song of Solomon', 'The Essential Gwendolyn Brooks', 'Annie Allen',
      'Black Boy', 'Notes of a Native Son', 'The Fire Next Time',
    ],
  },
  'civil-rights': {
    films: [
      'Selma', 'Malcolm X', 'The Butler', '12 Years a Slave', 'Just Mercy',
      'One Night in Miami', 'Judas and the Black Messiah', 'The Great Debaters',
      'Hidden Figures', 'Remember the Titans', 'The Help', 'Marshall', 'Till',
      'Harriet', 'Glory', 'Amistad', 'Freedom Writers', 'The Long Walk Home',
    ],
    books: [
      'The Autobiography of Malcolm X', 'I Know Why the Caged Bird Sings', 'The Fire Next Time',
      'Go Tell It on the Mountain', 'A Raisin in the Sun', 'Notes of a Native Son',
      'Black Boy', 'Why Are All the Black Kids Sitting Together in the Cafeteria?',
      'The New Jim Crow', 'Just Mercy', 'Long Walk to Freedom', 'Letter from Birmingham Jail',
      'Narrative of the Life of Frederick Douglass', 'Up from Slavery', 'Roots',
      'The Warmth of Other Suns', 'Roll of Thunder, Hear My Cry',
    ],
  },
  'black-power': {
    films: [
      'Judas and the Black Messiah', 'Da 5 Bloods', 'BlacKkKlansman',
      'The Black Panthers: Vanguard of the Revolution', 'The Black Power Mixtape 1967-1975',
      'One Night in Miami', 'Malcolm X',
    ],
    books: [
      'The Autobiography of Malcolm X', 'Sister Outsider', 'The Mis-Education of the Negro',
      'Black Skin, White Masks', 'The Wretched of the Earth', 'Pedagogy of the Oppressed',
      'Ain\'t I a Woman', 'We Real Cool', 'Black Feminist Thought',
      'Stamped from the Beginning', 'The New Jim Crow',
    ],
  },
  'modern-era': {
    films: [
      'Black Panther', 'Black Panther: Wakanda Forever', 'Get Out', 'Us', 'Moonlight',
      'The Photograph', 'Queen & Slim', 'Nope', 'The Woman King', 'American Fiction',
      'Creed', 'Creed II', 'Creed III', 'Girls Trip', 'The Hate U Give',
      'If Beale Street Could Talk', 'Passing', 'Zola', 'The Color Purple',
    ],
    books: [
      'Americanah', 'The Vanishing Half', 'Such a Fun Age', 'An American Marriage',
      'Transcendent Kingdom', 'The Nickel Boys', 'Homegoing', 'The Water Dancer',
      'Girl, Woman, Other', 'Queenie', 'Red at the Bone', 'The Hate U Give',
      'Becoming', 'Between the World and Me', 'How to Be an Antiracist',
    ],
  },
  'horror': {
    films: [
      'Get Out', 'Us', 'Candyman', 'Nope', 'Tales from the Hood', 'Tales from the Hood 2',
      'Bones', 'Vampire in Brooklyn', 'Blacula', 'Ganja & Hess', 'His House',
      'The People Under the Stairs', 'Def by Temptation', 'Demon Knight', 'Nanny',
    ],
    books: [
      'Ring Shout', 'The Ballad of Black Tom', 'Lovecraft Country', 'Beloved',
      'An Unkindness of Ghosts', 'Pet', 'My Soul to Keep', 'The Living Blood',
      'The Good House', 'Ghost Summer', 'The Reformatory', 'The Between',
      'The Taking of Jake Livingston', 'Burn Down, Rise Up',
    ],
  },
  'romance': {
    films: [
      'Love & Basketball', 'Love Jones', 'The Photograph', 'Brown Sugar',
      'Poetic Justice', 'Boomerang', 'The Best Man', 'The Best Man Holiday',
      'Waiting to Exhale', 'Southside with You', 'If Beale Street Could Talk',
      'How Stella Got Her Groove Back', 'Deliver Us from Eva', 'Two Can Play That Game',
      'Think Like a Man', 'Think Like a Man Too', 'Jumping the Broom', 'About Last Night',
      'The Perfect Match', 'Almost Christmas', 'This Christmas', 'Last Holiday',
    ],
    books: [
      'An American Marriage', 'The Color Purple', 'Their Eyes Were Watching God',
      'Queenie', 'Such a Fun Age', 'Red at the Bone', 'The Wedding Date',
      'Take a Hint, Dani Brown', 'Get a Life, Chloe Brown', 'Act Your Age, Eve Brown',
      'A Princess in Theory', 'A Duke by Default', 'The Boyfriend Project',
      'Honey Girl', 'You Made a Fool of Death with Your Beauty', 'While We Were Dating',
    ],
  },
  'comedy': {
    films: [
      'Friday', 'Next Friday', 'Friday After Next', 'Barbershop', 'Barbershop 2',
      'Coming to America', 'Coming 2 America', 'House Party', 'Boomerang',
      'Girls Trip', 'Think Like a Man', 'Ride Along', 'Ride Along 2', 'Soul Food',
      'Trading Places', 'Harlem Nights', 'Bad Boys', 'Bad Boys II', 'Bad Boys for Life',
      'Beverly Hills Cop', 'Beverly Hills Cop II', 'Nutty Professor', 'Dr. Dolittle',
      'Life', 'Blue Streak', 'How High', 'Soul Plane', 'White Chicks',
      'Big Momma\'s House', 'Undercover Brother', 'Hollywood Shuffle', 'The Five Heartbeats',
      'I\'m Gonna Git You Sucka', 'Don\'t Be a Menace', 'Scary Movie', 'Scary Movie 2',
    ],
    books: [],
  },
  'drama': {
    films: [
      'Moonlight', 'Fences', 'Precious', '12 Years a Slave', 'Fruitvale Station',
      'Mudbound', 'Clemency', 'The Pursuit of Happyness', 'Ray', 'Ali',
      'What\'s Love Got to Do with It', 'The Color Purple', 'Malcolm X',
      'Boyz n the Hood', 'Menace II Society', 'Juice', 'Higher Learning',
      'Eve\'s Bayou', 'Daughters of the Dust', 'American Fiction', 'Origin',
      'If Beale Street Could Talk', 'The Butler', 'Selma', 'When They See Us',
    ],
    books: [
      'Beloved', 'The Color Purple', 'Native Son', 'Go Tell It on the Mountain',
      'The Bluest Eye', 'Song of Solomon', 'A Lesson Before Dying', 'Invisible Man',
      'Their Eyes Were Watching God', 'I Know Why the Caged Bird Sings',
      'The Women of Brewster Place', 'Push', 'An American Marriage',
      'The Underground Railroad', 'The Nickel Boys', 'Sing, Unburied, Sing',
      'Homegoing', 'Transcendent Kingdom', 'Salvage the Bones',
    ],
  },
  'scifi-fantasy': {
    films: [
      'Black Panther', 'Black Panther: Wakanda Forever', 'A Wrinkle in Time',
      'Space Jam', 'Space Jam: A New Legacy', 'Blade', 'Blade II', 'Blade: Trinity',
      'Hancock', 'I Am Legend', 'Men in Black', 'Men in Black II', 'Men in Black 3',
      'The Matrix', 'The Matrix Reloaded', 'The Matrix Revolutions', 'Spawn',
      'After Earth', 'Independence Day', 'Attack the Block',
    ],
    books: [
      'Kindred', 'Parable of the Sower', 'Parable of the Talents', 'Dawn', 'Wild Seed',
      'The Fifth Season', 'The Obelisk Gate', 'The Stone Sky', 'The City We Became',
      'Children of Blood and Bone', 'Binti', 'An Unkindness of Ghosts', 'Who Fears Death',
      'Black Leopard, Red Wolf', 'Legendborn', 'A Master of Djinn', 'Ring Shout',
      'The Space Between Worlds', 'Akata Witch', 'Raybearer', 'Pet', 'Riot Baby',
      'Fledgling', 'Bloodchild and Other Stories', 'The Hundred Thousand Kingdoms',
    ],
  },
  'documentary': {
    films: [
      '13th', 'When They See Us', 'I Am Not Your Negro', 'What Happened, Miss Simone?',
      'Hoop Dreams', 'O.J.: Made in America', 'Strong Island', 'Summer of Soul',
      'The Black Power Mixtape 1967-1975', 'Dark Girls', 'Light Girls', 'Good Hair',
      'Time: The Kalief Browder Story', 'Who Killed Malcolm X?', 'MLK/FBI',
      'Homecoming: A Film by Beyoncé', 'Amazing Grace', 'Whitney', 'Tina', 'Quincy',
    ],
    books: [
      'The New Jim Crow', 'Stamped from the Beginning', 'How to Be an Antiracist',
      'Between the World and Me', 'The Warmth of Other Suns', 'Medical Apartheid',
      'Caste', 'Just Mercy', 'The 1619 Project', 'Four Hundred Souls',
      'How the Word Is Passed', 'Heavy', 'Men We Reaped', 'Born a Crime',
      'Becoming', 'When They Call You a Terrorist', 'The Fire This Time',
    ],
  },
  'action': {
    films: [
      'Black Panther', 'Black Panther: Wakanda Forever', 'The Woman King',
      'Training Day', 'The Equalizer', 'The Equalizer 2', 'The Equalizer 3',
      'Bad Boys', 'Bad Boys II', 'Bad Boys for Life', 'Shaft', '2 Fast 2 Furious',
      'The Fate of the Furious', 'New Jack City', 'Juice', 'Menace II Society',
      'Dead Presidents', 'Set It Off', 'Above the Rim', 'Paid in Full', 'Belly',
      'The Book of Eli', 'Blade', 'Blade II', 'I Am Legend', 'Hancock',
    ],
    books: [],
  },
  'sports': {
    films: [
      'Remember the Titans', 'Coach Carter', 'Glory Road', 'The Express', '42',
      'Race', 'Concussion', 'Ali', 'When We Were Kings', 'Creed', 'Creed II', 'Creed III',
      'The Blind Side', 'The Longest Yard', 'White Men Can\'t Jump', 'Love & Basketball',
      'He Got Game', 'Space Jam', 'Space Jam: A New Legacy', 'Hoop Dreams',
      'Drumline', 'Stomp the Yard', 'Roll Bounce', 'ATL', 'Invictus',
    ],
    books: [],
  },
  'ya-childrens': {
    films: [
      'Akeelah and the Bee', 'Queen of Katwe', 'A Wrinkle in Time', 'The Lion King',
      'The Inevitable Defeat of Mister & Pete', 'The Hate U Give', 'Miss Juneteenth',
      'Harriet the Spy: Blog Wars', 'Let It Shine', 'Drumline', 'ATL', 'Roll Bounce',
    ],
    books: [
      'The Hate U Give', 'On the Come Up', 'Concrete Rose', 'Dear Martin', 'Long Way Down',
      'Ghost', 'Monster', 'Children of Blood and Bone', 'The Crossover', 'Brown Girl Dreaming',
      'New Kid', 'Class Act', 'Roll of Thunder, Hear My Cry', 'Bud, Not Buddy',
      'The Watsons Go to Birmingham – 1963', 'One Crazy Summer', 'Legendborn',
      'Ace of Spades', 'The Black Kids', 'Stamped: Racism, Antiracism, and You',
      'Amari and the Night Brothers', 'Tristan Strong Punches a Hole in the Sky',
      'The Snowy Day', 'Hair Love', 'Crown: An Ode to the Fresh Cut', 'Last Stop on Market Street',
    ],
  },
  'african-cinema': {
    films: [
      'Tsotsi', 'Beasts of No Nation', 'Queen of Katwe', 'The Boy Who Harnessed the Wind',
      'Yeelen', 'Touki Bouki', 'Black Girl', 'Hyenas', 'Moolaadé', 'Bamako',
      'Timbuktu', 'Félicité', 'I Am Not a Witch', 'Vaya', 'Inxeba (The Wound)',
      'Kati Kati', 'Supa Modo', 'The Burial of Kojo', 'Eyimofe (This Is My Desire)',
      'Atlantics', 'Rafiki', 'Nairobi Half Life', 'Viva Riva!', 'The Wedding Party',
      'Lionheart', 'Citation', 'King of Boys', 'Half of a Yellow Sun', 'October 1',
    ],
    books: [
      'Things Fall Apart', 'No Longer at Ease', 'Arrow of God', 'Purple Hibiscus',
      'Half of a Yellow Sun', 'Americanah', 'The Thing Around Your Neck',
      'Stay with Me', 'My Sister, the Serial Killer', 'The Death of Vivek Oji',
      'Freshwater', 'Binti', 'Who Fears Death', 'Akata Witch', 'Born a Crime',
      'Cry, the Beloved Country', 'Long Walk to Freedom', 'Nervous Conditions',
      'We Need New Names', 'The Secret Lives of Church Ladies',
    ],
  },
  'caribbean': {
    films: [
      'The Harder They Come', 'The Harder They Fall', 'Yardie', 'Countryman',
      'Third World Cop', 'Shottas', 'Better Mus\' Come',
    ],
    books: [
      'A Brief History of Seven Killings', 'The Book of Night Women', 'John Crow\'s Devil',
      'Wide Sargasso Sea', 'Annie John', 'Lucy', 'The Autobiography of My Mother',
      'In the Castle of My Skin', 'Miguel Street', 'A House for Mr. Biswas',
      'The Lonely Londoners', 'Breath, Eyes, Memory', 'Krik? Krak!',
    ],
  },
  'british-black': {
    films: [
      'Small Axe', 'Lovers Rock', 'Mangrove', 'Red, White and Blue', 'Alex Wheatle', 'Education',
      'Rocks', 'The Last Tree', 'Farming', 'Belle', 'Yardie', 'Noughts + Crosses',
      'Bullet Boy', 'Kidulthood', 'Adulthood', 'Brotherhood', 'Attack the Block',
      'Blue Story', 'Pirates', 'Top Boy',
    ],
    books: [
      'Girl, Woman, Other', 'Queenie', 'Small Island', 'White Teeth', 'NW', 'Swing Time',
      'The Lonely Londoners', 'Pigeon English', 'The Good Immigrant', 'Brit(ish)',
      'My Name Is Leon', 'Luster', 'On Beauty',
    ],
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
