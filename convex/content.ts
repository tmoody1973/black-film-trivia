// Curated list of films and books for daily challenges
// This is a subset of the main content lists for Convex actions

// ============================================
// ERA CONTENT - Time Machine Mode
// ============================================

// Era definitions with metadata
export const ERAS = [
  {
    id: "1960s-70s",
    name: "1960s-70s",
    title: "Blaxploitation & Black Arts",
    description: "The revolutionary era of Blaxploitation cinema and the Black Arts Movement literature.",
    color: "from-amber-600 to-orange-700",
    icon: "✊",
  },
  {
    id: "1980s",
    name: "1980s",
    title: "Early Indie & Literary Renaissance",
    description: "Independent Black filmmakers emerge while literature explores new narratives.",
    color: "from-purple-600 to-pink-600",
    icon: "📼",
  },
  {
    id: "1990s",
    name: "1990s",
    title: "Golden Age",
    description: "New Jack Cinema, hip-hop culture, and a literary renaissance define the decade.",
    color: "from-emerald-600 to-teal-600",
    icon: "🎬",
  },
  {
    id: "2000s",
    name: "2000s",
    title: "Mainstream Breakthrough",
    description: "Black stories reach wider audiences with critical and commercial success.",
    color: "from-blue-600 to-indigo-600",
    icon: "🌟",
  },
  {
    id: "2010s",
    name: "2010s",
    title: "Oscar Era & Afrofuturism",
    description: "Historic Oscar wins and the rise of Afrofuturism in film and literature.",
    color: "from-yellow-500 to-amber-600",
    icon: "🏆",
  },
  {
    id: "2020s",
    name: "2020s",
    title: "Streaming Revolution",
    description: "Streaming platforms amplify Black voices with unprecedented access and variety.",
    color: "from-rose-600 to-red-600",
    icon: "📱",
  },
];

// Films organized by era
export const ERA_FILMS: Record<string, string[]> = {
  "1960s-70s": [
    // Blaxploitation Era
    "Shaft",
    "Super Fly",
    "Coffy",
    "Foxy Brown",
    "Blacula",
    "Cleopatra Jones",
    "The Mack",
    "Trouble Man",
    "Black Caesar",
    "Hell Up in Harlem",
    // Serious Drama
    "Sounder",
    "Claudine",
    "The Learning Tree",
    "Nothing But a Man",
    "Sweet Sweetback's Baadasssss Song",
    "Cotton Comes to Harlem",
    "Uptown Saturday Night",
    "Let's Do It Again",
    "A Piece of the Action",
    "Cooley High",
  ],
  "1980s": [
    // Spike Lee's Early Work
    "She's Gotta Have It",
    "School Daze",
    // Eddie Murphy Era
    "Coming to America",
    "Beverly Hills Cop",
    "48 Hrs.",
    "Trading Places",
    // Drama
    "The Color Purple",
    "A Soldier's Story",
    "Native Son",
    "Glory",
    // Comedy
    "Hollywood Shuffle",
    "I'm Gonna Git You Sucka",
    "House Party",
    // Musical
    "Purple Rain",
    "Krush Groove",
    "Beat Street",
    // Other Notable Films
    "Lean on Me",
    "Harlem Nights",
    "Do the Right Thing",
  ],
  "1990s": [
    // New Jack Cinema
    "Boyz n the Hood",
    "Menace II Society",
    "Juice",
    "New Jack City",
    "South Central",
    "Straight Out of Brooklyn",
    "Fresh",
    "Dead Presidents",
    "Set It Off",
    // Spike Lee Joints
    "Malcolm X",
    "Jungle Fever",
    "Crooklyn",
    "Clockers",
    "Get on the Bus",
    // Comedy
    "Friday",
    "Don't Be a Menace",
    "Boomerang",
    "House Party 2",
    // Romance/Drama
    "Love Jones",
    "Soul Food",
    "Waiting to Exhale",
    "How Stella Got Her Groove Back",
    "The Best Man",
    "Love & Basketball",
    // Horror
    "Tales from the Hood",
    "Candyman",
    // Documentary
    "Hoop Dreams",
    "When We Were Kings",
  ],
  "2000s": [
    // Drama
    "Training Day",
    "Monster's Ball",
    "Ray",
    "Hustle & Flow",
    "Crash",
    "The Pursuit of Happyness",
    "Dreamgirls",
    "American Gangster",
    "Precious",
    "The Great Debaters",
    // Comedy
    "Barbershop",
    "Friday After Next",
    "Are We There Yet?",
    "Think Like a Man",
    "The Brothers",
    "Brown Sugar",
    "Deliver Us from Eva",
    // Action
    "Blade II",
    "Blade: Trinity",
    // Tyler Perry Era Begins
    "Diary of a Mad Black Woman",
    "Madea's Family Reunion",
    // Documentary
    "What Happened, Miss Simone?",
  ],
  "2010s": [
    // Oscar Winners/Nominees
    "12 Years a Slave",
    "Moonlight",
    "Fences",
    "Hidden Figures",
    "Selma",
    "The Butler",
    "Beasts of the Southern Wild",
    "Mudbound",
    "If Beale Street Could Talk",
    // Horror/Thriller
    "Get Out",
    "Us",
    // Action/Superhero
    "Black Panther",
    "Creed",
    "Creed II",
    // Comedy
    "Girls Trip",
    "Ride Along",
    "Think Like a Man Too",
    "What Men Want",
    // Drama
    "Fruitvale Station",
    "The Hate U Give",
    "Just Mercy",
    "Queen & Slim",
    // Documentary
    "13th",
    "I Am Not Your Negro",
    "Strong Island",
  ],
  "2020s": [
    // Oscar Winners/Nominees
    "Judas and the Black Messiah",
    "Ma Rainey's Black Bottom",
    "One Night in Miami",
    "King Richard",
    "The Woman King",
    "Till",
    "American Fiction",
    // Horror
    "Nope",
    "Candyman (2021)",
    // Drama
    "The Photograph",
    "Soul",
    "Passing",
    "A Journal for Jordan",
    "Emancipation",
    "Origin",
    // Action
    "Black Adam",
    "Black Panther: Wakanda Forever",
    "Creed III",
    // Comedy
    "Coming 2 America",
    "Honk for Jesus. Save Your Soul.",
    // Documentary
    "Summer of Soul",
    "Descendant",
  ],
};

// Books organized by era (by publication date)
export const ERA_BOOKS: Record<string, string[]> = {
  "1960s-70s": [
    // Black Arts Movement
    "The Autobiography of Malcolm X",
    "Soul on Ice",
    "Black Boy",
    "Go Tell It on the Mountain",
    "I Know Why the Caged Bird Sings",
    "Gather Together in My Name",
    "Roots",
    "Song of Solomon",
    "The Bluest Eye",
    "Sula",
    "Jubilee",
    "Corregidora",
    "Eva's Man",
    "For Colored Girls Who Have Considered Suicide",
    "Kindred",
    "A Hero Ain't Nothin' But a Sandwich",
    "If Beale Street Could Talk",
    "Just Above My Head",
    "The Street",
    "Invisible Man",
  ],
  "1980s": [
    // Toni Morrison Era
    "Beloved",
    "Tar Baby",
    "The Color Purple",
    "The Women of Brewster Place",
    "Linden Hills",
    "Mama Day",
    "The Temple of My Familiar",
    "Praisesong for the Widow",
    "A Lesson Before Dying",
    "Brothers and Keepers",
    "Disappearing Acts",
    "Betsey Brown",
    "Sassafrass, Cypress & Indigo",
    "The Chaneysville Incident",
    "Philadelphia Fire",
    "Reuben",
    "Your Blues Ain't Like Mine",
    "Sent for You Yesterday",
    "Hiding Place",
    "Damballah",
  ],
  "1990s": [
    // Contemporary Classics
    "Jazz",
    "Waiting to Exhale",
    "How Stella Got Her Groove Back",
    "Push",
    "The Joy Luck Club",
    "Parable of the Sower",
    "Parable of the Talents",
    "The Famished Road",
    "Middle Passage",
    "Bailey's Cafe",
    "Possessing the Secret of Joy",
    "Makes Me Wanna Holler",
    "Volunteering",
    "The Color of Water",
    "Another Country",
    "A Gathering of Old Men",
    "Brothers and Sisters",
    "Tumbling",
    "Monster",
    "The Coldest Winter Ever",
  ],
  "2000s": [
    // New Voices
    "The Known World",
    "The Kite Runner",
    "Purple Hibiscus",
    "Half of a Yellow Sun",
    "The Brief Wondrous Life of Oscar Wao",
    "The Secret Life of Bees",
    "The Help",
    "A Mercy",
    "The Book of Night Women",
    "The Good Lord Bird",
    "Dreams from My Father",
    "The Audacity of Hope",
    "We Real Cool",
    "The New Jim Crow",
    "The Warmth of Other Suns",
    "Just Kids",
    "The Immortal Life of Henrietta Lacks",
    "Sister Citizen",
    "Losing My Cool",
    "Zeitoun",
  ],
  "2010s": [
    // Contemporary Masters
    "Americanah",
    "Homegoing",
    "The Underground Railroad",
    "Sing, Unburied, Sing",
    "An American Marriage",
    "The Water Dancer",
    "Red at the Bone",
    "The Fifth Season",
    "The Obelisk Gate",
    "The Stone Sky",
    "Children of Blood and Bone",
    "Between the World and Me",
    "The Fire This Time",
    "We Were Eight Years in Power",
    "Stamped from the Beginning",
    "How to Be an Antiracist",
    "Becoming",
    "Educated",
    "Heavy",
    "Born a Crime",
  ],
  "2020s": [
    // Recent Releases
    "The Vanishing Half",
    "Such a Fun Age",
    "Deacon King Kong",
    "Piranesi",
    "The Love Songs of W.E.B. Du Bois",
    "Harlem Shuffle",
    "The Personal Librarian",
    "Black Cake",
    "Lessons in Chemistry",
    "Demon Copperhead",
    "How Beautiful We Were",
    "The Hill We Climb",
    "Crying in H Mart",
    "My Broken Language",
    "Just As I Am",
    "Caste",
    "The 1619 Project",
    "All About Love",
    "World of Wonders",
    "Intimations",
  ],
};

// Era context information for learning content
export const ERA_CONTEXT: Record<string, { movements: string[]; keyFigures: string[]; culturalMoments: string[] }> = {
  "1960s-70s": {
    movements: ["Black Arts Movement", "Blaxploitation Cinema", "Black Power Movement", "Civil Rights Era"],
    keyFigures: ["Melvin Van Peebles", "Gordon Parks", "Amiri Baraka", "Nikki Giovanni", "Toni Morrison", "James Baldwin"],
    culturalMoments: ["March on Washington", "Black Panther Party", "Harlem Renaissance Legacy", "Muhammad Ali's activism"],
  },
  "1980s": {
    movements: ["Independent Black Cinema", "Hip-Hop Culture Rise", "Literary Renaissance"],
    keyFigures: ["Spike Lee", "Eddie Murphy", "Alice Walker", "Toni Morrison", "Prince", "Michael Jackson"],
    culturalMoments: ["The Cosby Show", "MTV era", "Hip-Hop goes mainstream", "Purple Rain phenomenon"],
  },
  "1990s": {
    movements: ["New Jack Cinema", "Hood Films", "Neo-Soul Movement", "Hip-Hop Literature"],
    keyFigures: ["John Singleton", "F. Gary Gray", "Terry McMillan", "Toni Morrison Nobel Prize", "Tupac Shakur", "Notorious B.I.G."],
    culturalMoments: ["LA Riots", "Million Man March", "OJ Simpson Trial", "Hip-Hop's golden age"],
  },
  "2000s": {
    movements: ["Urban Fiction Boom", "Oscar Recognition Era", "Tyler Perry Empire"],
    keyFigures: ["Denzel Washington", "Halle Berry", "Ta-Nehisi Coates", "Tyler Perry", "Oprah Winfrey"],
    culturalMoments: ["First Black Oscar winners in leading roles", "Hurricane Katrina", "Obama's rise", "Social media emergence"],
  },
  "2010s": {
    movements: ["Black Lives Matter", "Afrofuturism", "#OscarsSoWhite", "Black Panther phenomenon"],
    keyFigures: ["Ryan Coogler", "Ava DuVernay", "Jordan Peele", "Colson Whitehead", "N.K. Jemisin", "Barry Jenkins"],
    culturalMoments: ["Obama presidency", "Trayvon Martin", "Ferguson", "Black Panther breaks records", "First Black female billionaire author"],
  },
  "2020s": {
    movements: ["Streaming Revolution", "Racial Reckoning", "Diverse Storytelling Renaissance"],
    keyFigures: ["Michaela Coel", "Daniel Kaluuya", "Amanda Gorman", "Jesmyn Ward", "Questlove"],
    culturalMoments: ["George Floyd protests", "Pandemic storytelling", "Streaming platform diversity initiatives", "Historic Oscar wins"],
  },
};

// ============================================
// DAILY CHALLENGE CONTENT (existing)
// ============================================

export const DAILY_FILMS = [
  // Drama
  "The Color Purple", "Moonlight", "12 Years a Slave", "Selma", "Fences",
  "If Beale Street Could Talk", "Malcolm X", "Do the Right Thing",
  "Boyz n the Hood", "Precious", "The Hate U Give", "Just Mercy",
  "One Night in Miami", "Ma Rainey's Black Bottom", "King Richard",

  // Horror/Thriller
  "Get Out", "Us", "Nope", "Candyman", "Tales from the Hood",

  // Comedy
  "Friday", "Coming to America", "House Party", "Barbershop",
  "Girls Trip", "Think Like a Man", "The Best Man",

  // Action
  "Black Panther", "Blade", "Creed", "Training Day",

  // Romance
  "Love & Basketball", "The Photograph", "Brown Sugar",

  // Documentary
  "13th", "I Am Not Your Negro", "What Happened, Miss Simone?",

  // Classics
  "She's Gotta Have It", "School Daze", "Juice", "Menace II Society",
  "Set It Off", "Love Jones", "Soul Food", "The Brothers",
];

export const DAILY_BOOKS = [
  // Classic Literature
  "Beloved", "The Color Purple", "Invisible Man", "Native Son",
  "Their Eyes Were Watching God", "The Bluest Eye", "Song of Solomon",
  "I Know Why the Caged Bird Sings", "Go Tell It on the Mountain",

  // Contemporary Fiction
  "Americanah", "Homegoing", "The Underground Railroad", "An American Marriage",
  "The Vanishing Half", "Such a Fun Age", "The Water Dancer",

  // Non-Fiction
  "Between the World and Me", "The Fire Next Time", "The New Jim Crow",
  "Stamped from the Beginning", "How to Be an Antiracist",

  // Sci-Fi/Fantasy
  "Kindred", "Parable of the Sower", "The Fifth Season", "Children of Blood and Bone",

  // Poetry
  "The Hill We Climb", "Citizen: An American Lyric",

  // Memoir
  "Just As I Am", "Becoming", "Born a Crime", "The Autobiography of Malcolm X",
];
