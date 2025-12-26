// Music content for Music Trivia mode
// Organized by genre with ~100 Black artists across 8 genres

// ============================================
// GENRE DEFINITIONS
// ============================================

export const GENRES = [
  {
    id: "jazz",
    name: "Jazz",
    title: "The Foundation of American Music",
    description: "From New Orleans to bebop, jazz revolutionized music and became America's classical music.",
    color: "from-amber-600 to-yellow-500",
    icon: "🎺",
  },
  {
    id: "blues",
    name: "Blues",
    title: "The Soul of American Music",
    description: "Born in the Mississippi Delta, the blues gave voice to struggle and triumph.",
    color: "from-blue-700 to-indigo-600",
    icon: "🎸",
  },
  {
    id: "soul-rnb",
    name: "Soul & R&B",
    title: "The Sound of Black America",
    description: "From Motown to modern R&B, soul music captures the full range of human emotion.",
    color: "from-purple-600 to-pink-500",
    icon: "🎤",
  },
  {
    id: "funk",
    name: "Funk",
    title: "Get Up and Get Down",
    description: "Funky rhythms and grooves that made the world dance.",
    color: "from-orange-500 to-red-500",
    icon: "🎹",
  },
  {
    id: "hip-hop",
    name: "Hip-Hop",
    title: "The Voice of the Streets",
    description: "From the Bronx to global domination, hip-hop changed culture forever.",
    color: "from-gray-800 to-zinc-600",
    icon: "🎧",
  },
  {
    id: "gospel",
    name: "Gospel",
    title: "Music of Faith and Power",
    description: "Sacred music that shaped secular sounds and lifted spirits worldwide.",
    color: "from-yellow-500 to-amber-400",
    icon: "🙏",
  },
  {
    id: "reggae",
    name: "Reggae & Dancehall",
    title: "Sounds of the Caribbean",
    description: "Jamaica's gift to the world—conscious lyrics over irresistible rhythms.",
    color: "from-green-600 to-yellow-500",
    icon: "🇯🇲",
  },
  {
    id: "afrobeats",
    name: "Afrobeats",
    title: "Africa's Global Sound",
    description: "The modern fusion of African rhythms conquering charts worldwide.",
    color: "from-emerald-500 to-teal-400",
    icon: "🌍",
  },
];

// ============================================
// ARTISTS BY GENRE
// ============================================

export const GENRE_ARTISTS: Record<string, string[]> = {
  jazz: [
    // Pioneers & Legends
    "Louis Armstrong",
    "Duke Ellington",
    "Count Basie",
    "Ella Fitzgerald",
    "Billie Holiday",
    "Sarah Vaughan",
    "Nat King Cole",
    // Bebop Era
    "Charlie Parker",
    "Dizzy Gillespie",
    "Thelonious Monk",
    "Max Roach",
    "Art Blakey",
    // Cool Jazz & Hard Bop
    "Miles Davis",
    "John Coltrane",
    "Sonny Rollins",
    "Horace Silver",
    "Cannonball Adderley",
    // Modern Jazz
    "Herbie Hancock",
    "Wayne Shorter",
    "McCoy Tyner",
    "Ron Carter",
    "Pharoah Sanders",
    // Vocal Jazz
    "Nina Simone",
    "Abbey Lincoln",
    "Cassandra Wilson",
    // Contemporary
    "Wynton Marsalis",
    "Kamasi Washington",
    "Robert Glasper",
    "Esperanza Spalding",
    "Terrace Martin",
  ],
  blues: [
    // Delta Blues Pioneers
    "Robert Johnson",
    "Son House",
    "Charley Patton",
    "Skip James",
    // Chicago Blues
    "Muddy Waters",
    "Howlin' Wolf",
    "Willie Dixon",
    "Little Walter",
    "Buddy Guy",
    // Electric Blues
    "B.B. King",
    "Albert King",
    "Freddie King",
    "Albert Collins",
    // Women of Blues
    "Bessie Smith",
    "Ma Rainey",
    "Etta James",
    "Koko Taylor",
    "Big Mama Thornton",
    // Modern Blues
    "John Lee Hooker",
    "Bobby Blue Bland",
    "Otis Rush",
    "Magic Sam",
    "Gary Clark Jr.",
    "Christone 'Kingfish' Ingram",
  ],
  "soul-rnb": [
    // Soul Pioneers
    "Ray Charles",
    "Sam Cooke",
    "James Brown",
    "Otis Redding",
    // Motown Legends
    "Stevie Wonder",
    "Marvin Gaye",
    "Diana Ross",
    "The Temptations",
    "Smokey Robinson",
    "The Four Tops",
    "Gladys Knight",
    // Soul Queens
    "Aretha Franklin",
    "Tina Turner",
    "Patti LaBelle",
    "Chaka Khan",
    "Anita Baker",
    // 80s-90s R&B
    "Whitney Houston",
    "Luther Vandross",
    "Babyface",
    "Boyz II Men",
    "TLC",
    "Aaliyah",
    "Mary J. Blige",
    "R. Kelly",
    "Usher",
    // Modern R&B
    "Beyoncé",
    "Alicia Keys",
    "John Legend",
    "D'Angelo",
    "Maxwell",
    "Erykah Badu",
    "Lauryn Hill",
    "Frank Ocean",
    "The Weeknd",
    "SZA",
    "Summer Walker",
    "Giveon",
    "Daniel Caesar",
  ],
  funk: [
    // Funk Pioneers
    "James Brown",
    "Sly and the Family Stone",
    "George Clinton",
    "Parliament-Funkadelic",
    "Bootsy Collins",
    // Funk Bands
    "Earth, Wind & Fire",
    "Kool & the Gang",
    "The Ohio Players",
    "The Commodores",
    "The Isley Brothers",
    "The Gap Band",
    "Cameo",
    "Zapp",
    "Con Funk Shun",
    // Funk Icons
    "Rick James",
    "Prince",
    "Morris Day and The Time",
    // Modern Funk
    "Bruno Mars",
    "Anderson .Paak",
    "Thundercat",
    "Vulfpeck",
    "Dâm-Funk",
  ],
  "hip-hop": [
    // Pioneers
    "Grandmaster Flash",
    "Afrika Bambaataa",
    "Kurtis Blow",
    "Run-DMC",
    "LL Cool J",
    "Big Daddy Kane",
    "Rakim",
    // Golden Age
    "Public Enemy",
    "N.W.A",
    "Ice Cube",
    "Ice-T",
    "A Tribe Called Quest",
    "De La Soul",
    "KRS-One",
    // 90s Legends
    "Tupac Shakur",
    "The Notorious B.I.G.",
    "Nas",
    "Jay-Z",
    "Wu-Tang Clan",
    "OutKast",
    "Lauryn Hill",
    "Missy Elliott",
    "DMX",
    "Busta Rhymes",
    // 2000s Era
    "Lil Wayne",
    "Kanye West",
    "T.I.",
    "50 Cent",
    "Rick Ross",
    "Nicki Minaj",
    "J. Cole",
    // Modern Era
    "Kendrick Lamar",
    "Drake",
    "Travis Scott",
    "Cardi B",
    "Megan Thee Stallion",
    "Tyler, the Creator",
    "A$AP Rocky",
    "Future",
    "21 Savage",
    "Lil Baby",
    "Gunna",
    "Doja Cat",
    "Migos",
    "Lil Uzi Vert",
    "Roddy Ricch",
    "DaBaby",
  ],
  gospel: [
    // Pioneers
    "Thomas A. Dorsey",
    "Mahalia Jackson",
    "Sister Rosetta Tharpe",
    "The Staple Singers",
    "The Soul Stirrers",
    // Traditional Gospel
    "Shirley Caesar",
    "The Clark Sisters",
    "Andraé Crouch",
    "The Winans",
    "BeBe & CeCe Winans",
    "Donnie McClurkin",
    // Contemporary Gospel
    "Kirk Franklin",
    "Fred Hammond",
    "Yolanda Adams",
    "Mary Mary",
    "Tye Tribbett",
    "Travis Greene",
    "Tasha Cobbs Leonard",
    "Lecrae",
    "Jonathan McReynolds",
    "Maverick City Music",
  ],
  reggae: [
    // Roots Reggae Legends
    "Bob Marley",
    "Peter Tosh",
    "Bunny Wailer",
    "Jimmy Cliff",
    "Toots and the Maytals",
    "Burning Spear",
    "Dennis Brown",
    "Gregory Isaacs",
    "Black Uhuru",
    // Dancehall
    "Shabba Ranks",
    "Buju Banton",
    "Bounty Killer",
    "Beenie Man",
    "Sean Paul",
    "Vybz Kartel",
    "Popcaan",
    "Shaggy",
    // Modern Reggae
    "Chronixx",
    "Koffee",
    "Protoje",
    "Damian Marley",
    "Stephen Marley",
    "Ziggy Marley",
  ],
  afrobeats: [
    // Pioneers
    "Fela Kuti",
    "King Sunny Ade",
    "Ebenezer Obey",
    // Modern Afrobeats Stars
    "Wizkid",
    "Davido",
    "Burna Boy",
    "Tiwa Savage",
    "Yemi Alade",
    "Mr Eazi",
    "Tekno",
    // New Generation
    "Tems",
    "Rema",
    "Asake",
    "Ayra Starr",
    "Fireboy DML",
    "Omah Lay",
    "Ckay",
    "Tyla",
    // International Fusion
    "Skepta",
    "J Hus",
    "Stormzy",
  ],
};

// ============================================
// GENRE CONTEXT FOR LEARNING CONTENT
// ============================================

export const GENRE_CONTEXT: Record<string, { movements: string[]; keyFigures: string[]; culturalMoments: string[] }> = {
  jazz: {
    movements: ["New Orleans Jazz", "Swing Era", "Bebop", "Cool Jazz", "Hard Bop", "Free Jazz", "Jazz Fusion"],
    keyFigures: ["Louis Armstrong", "Duke Ellington", "Charlie Parker", "Miles Davis", "John Coltrane"],
    culturalMoments: ["Cotton Club Era", "Newport Jazz Festival", "Kind of Blue release", "Jazz at Lincoln Center founding"],
  },
  blues: {
    movements: ["Delta Blues", "Chicago Blues", "Electric Blues", "British Blues Revival", "Modern Blues"],
    keyFigures: ["Robert Johnson", "Muddy Waters", "B.B. King", "Howlin' Wolf", "Bessie Smith"],
    culturalMoments: ["Great Migration influence", "Chess Records era", "Blues Brothers film", "Blues Hall of Fame"],
  },
  "soul-rnb": {
    movements: ["Doo-Wop", "Motown Sound", "Philadelphia Soul", "New Jack Swing", "Neo-Soul", "Alternative R&B"],
    keyFigures: ["Berry Gordy", "Aretha Franklin", "Stevie Wonder", "Prince", "Beyoncé"],
    culturalMoments: ["Motown founding", "Soul Train premiere", "Purple Rain era", "Lemonade visual album"],
  },
  funk: {
    movements: ["P-Funk", "Disco-Funk", "Go-Go", "G-Funk", "Nu-Funk"],
    keyFigures: ["James Brown", "George Clinton", "Sly Stone", "Prince", "Bootsy Collins"],
    culturalMoments: ["Say It Loud release", "Mothership Connection tour", "Purple Rain", "Super Bowl performances"],
  },
  "hip-hop": {
    movements: ["Old School", "Golden Age", "Gangsta Rap", "East Coast-West Coast", "Crunk", "Trap", "Drill"],
    keyFigures: ["DJ Kool Herc", "Grandmaster Flash", "Tupac", "Biggie", "Jay-Z", "Kendrick Lamar"],
    culturalMoments: ["Block parties in the Bronx", "Rapper's Delight release", "East-West feud", "Hip-hop becomes #1 genre"],
  },
  gospel: {
    movements: ["Traditional Gospel", "Gospel Quartet", "Contemporary Christian", "Holy Hip-Hop", "Worship Music"],
    keyFigures: ["Thomas Dorsey", "Mahalia Jackson", "Andraé Crouch", "Kirk Franklin", "CeCe Winans"],
    culturalMoments: ["Gospel Music Hall of Fame", "Kirk Franklin crossover success", "Kanye's Sunday Service"],
  },
  reggae: {
    movements: ["Ska", "Rocksteady", "Roots Reggae", "Dancehall", "Ragga", "Reggaeton influence"],
    keyFigures: ["Bob Marley", "Peter Tosh", "Lee 'Scratch' Perry", "King Tubby", "Buju Banton"],
    culturalMoments: ["One Love Peace Concert", "Bob Marley's death", "Reggae UNESCO heritage status"],
  },
  afrobeats: {
    movements: ["Afrobeat", "Afropop", "Afrofusion", "Amapiano", "Alte"],
    keyFigures: ["Fela Kuti", "Wizkid", "Burna Boy", "Davido", "Tems"],
    culturalMoments: ["Fela's political activism", "Burna Boy Grammy win", "Afrobeats global domination"],
  },
};

// ============================================
// ERA-BASED MUSIC (for Time Machine integration)
// ============================================

export const ERA_MUSIC: Record<string, string[]> = {
  "1960s-70s": [
    // Soul & Motown
    "Marvin Gaye",
    "Stevie Wonder",
    "Aretha Franklin",
    "Diana Ross",
    "James Brown",
    "Otis Redding",
    "The Temptations",
    "Smokey Robinson",
    // Jazz
    "Miles Davis",
    "John Coltrane",
    "Nina Simone",
    // Funk
    "Sly and the Family Stone",
    "Parliament-Funkadelic",
    "Earth, Wind & Fire",
    // Reggae
    "Bob Marley",
    "Jimmy Cliff",
  ],
  "1980s": [
    // Pop Icons
    "Michael Jackson",
    "Prince",
    "Whitney Houston",
    "Lionel Richie",
    "Luther Vandross",
    // Funk
    "Rick James",
    "Cameo",
    "The Gap Band",
    // Early Hip-Hop
    "Grandmaster Flash",
    "Run-DMC",
    "LL Cool J",
    // R&B
    "Anita Baker",
    "Babyface",
  ],
  "1990s": [
    // Hip-Hop Golden Age
    "Tupac Shakur",
    "The Notorious B.I.G.",
    "Nas",
    "Wu-Tang Clan",
    "A Tribe Called Quest",
    "OutKast",
    "Lauryn Hill",
    "Missy Elliott",
    // R&B
    "Mary J. Blige",
    "TLC",
    "Aaliyah",
    "Boyz II Men",
    "R. Kelly",
    "Usher",
    // Neo-Soul
    "D'Angelo",
    "Erykah Badu",
  ],
  "2000s": [
    // Hip-Hop
    "Jay-Z",
    "Kanye West",
    "Lil Wayne",
    "50 Cent",
    "T.I.",
    "Nicki Minaj",
    // R&B
    "Beyoncé",
    "Alicia Keys",
    "Usher",
    "Chris Brown",
    "Ne-Yo",
    "Rihanna",
    // Afrobeats Pioneer
    "Fela Kuti",
  ],
  "2010s": [
    // Hip-Hop
    "Kendrick Lamar",
    "Drake",
    "J. Cole",
    "Travis Scott",
    "Cardi B",
    "Migos",
    // R&B
    "Frank Ocean",
    "The Weeknd",
    "SZA",
    "Childish Gambino",
    // Afrobeats Rising
    "Wizkid",
    "Davido",
    "Burna Boy",
  ],
  "2020s": [
    // Hip-Hop
    "Megan Thee Stallion",
    "Doja Cat",
    "Lil Baby",
    "Tyler, the Creator",
    "21 Savage",
    "Gunna",
    // R&B
    "Summer Walker",
    "Giveon",
    "Daniel Caesar",
    // Afrobeats Dominance
    "Tems",
    "Rema",
    "Asake",
    "Ayra Starr",
    "Tyla",
  ],
};

// ============================================
// DAILY CHALLENGE MUSIC
// ============================================

export const DAILY_MUSIC = [
  // Legends
  "Michael Jackson",
  "Prince",
  "Whitney Houston",
  "Aretha Franklin",
  "Stevie Wonder",
  "Marvin Gaye",
  "Bob Marley",
  // Hip-Hop Icons
  "Tupac Shakur",
  "The Notorious B.I.G.",
  "Jay-Z",
  "Kendrick Lamar",
  "Nas",
  "OutKast",
  "Lauryn Hill",
  // Modern Stars
  "Beyoncé",
  "Drake",
  "Rihanna",
  "The Weeknd",
  "Frank Ocean",
  "SZA",
  // Afrobeats
  "Burna Boy",
  "Wizkid",
  "Tems",
];

// ============================================
// PRIORITY MUSIC FOR PRE-GENERATION
// ============================================

export const PRIORITY_MUSIC = [
  // Most popular/recognizable artists for cache pre-generation
  "Michael Jackson",
  "Beyoncé",
  "Prince",
  "Whitney Houston",
  "Stevie Wonder",
  "Aretha Franklin",
  "Marvin Gaye",
  "Jay-Z",
  "Kendrick Lamar",
  "Drake",
  "Tupac Shakur",
  "The Notorious B.I.G.",
  "Bob Marley",
  "Lauryn Hill",
  "OutKast",
  "Rihanna",
  "The Weeknd",
  "Frank Ocean",
  "Burna Boy",
  "Wizkid",
  "Usher",
  "Mary J. Blige",
  "Kanye West",
  "Missy Elliott",
  "Snoop Dogg",
];
