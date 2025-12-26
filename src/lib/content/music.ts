// Curated list of Black music artists
// Spanning genres from Jazz to Afrobeats - organized by genre

export interface BlackMusicArtist {
  name: string
  genre: string
  era: string
}

// Genre definitions for UI
export const MUSIC_GENRES = [
  { id: "jazz", name: "Jazz", icon: "🎺", color: "from-amber-600 to-yellow-500" },
  { id: "blues", name: "Blues", icon: "🎸", color: "from-blue-700 to-indigo-600" },
  { id: "soul-rnb", name: "Soul & R&B", icon: "🎤", color: "from-purple-600 to-pink-500" },
  { id: "funk", name: "Funk", icon: "🎹", color: "from-orange-500 to-red-500" },
  { id: "hip-hop", name: "Hip-Hop", icon: "🎧", color: "from-gray-800 to-zinc-600" },
  { id: "gospel", name: "Gospel", icon: "🙏", color: "from-yellow-500 to-amber-400" },
  { id: "reggae", name: "Reggae", icon: "🇯🇲", color: "from-green-600 to-yellow-500" },
  { id: "afrobeats", name: "Afrobeats", icon: "🌍", color: "from-emerald-500 to-teal-400" },
] as const

// Simple string array of all artists
export const BLACK_MUSIC_ARTISTS = [
  // ===========================================
  // JAZZ
  // ===========================================
  // Pioneers & Legends
  "Louis Armstrong", "Duke Ellington", "Count Basie", "Ella Fitzgerald",
  "Billie Holiday", "Sarah Vaughan", "Nat King Cole",
  // Bebop Era
  "Charlie Parker", "Dizzy Gillespie", "Thelonious Monk", "Max Roach", "Art Blakey",
  // Cool Jazz & Hard Bop
  "Miles Davis", "John Coltrane", "Sonny Rollins", "Horace Silver", "Cannonball Adderley",
  // Modern Jazz
  "Herbie Hancock", "Wayne Shorter", "McCoy Tyner", "Ron Carter", "Pharoah Sanders",
  // Vocal Jazz
  "Nina Simone", "Abbey Lincoln", "Cassandra Wilson",
  // Contemporary
  "Wynton Marsalis", "Kamasi Washington", "Robert Glasper", "Esperanza Spalding", "Terrace Martin",

  // ===========================================
  // BLUES
  // ===========================================
  // Delta Blues Pioneers
  "Robert Johnson", "Son House", "Charley Patton", "Skip James",
  // Chicago Blues
  "Muddy Waters", "Howlin' Wolf", "Willie Dixon", "Little Walter", "Buddy Guy",
  // Electric Blues
  "B.B. King", "Albert King", "Freddie King", "Albert Collins",
  // Women of Blues
  "Bessie Smith", "Ma Rainey", "Etta James", "Koko Taylor", "Big Mama Thornton",
  // Modern Blues
  "John Lee Hooker", "Bobby Blue Bland", "Otis Rush", "Magic Sam",
  "Gary Clark Jr.", "Christone Kingfish Ingram",

  // ===========================================
  // SOUL & R&B
  // ===========================================
  // Soul Pioneers
  "Ray Charles", "Sam Cooke", "James Brown", "Otis Redding",
  // Motown Legends
  "Stevie Wonder", "Marvin Gaye", "Diana Ross", "The Temptations",
  "Smokey Robinson", "The Four Tops", "Gladys Knight",
  // Soul Queens
  "Aretha Franklin", "Tina Turner", "Patti LaBelle", "Chaka Khan", "Anita Baker",
  // 80s-90s R&B
  "Whitney Houston", "Luther Vandross", "Babyface", "Boyz II Men",
  "TLC", "Aaliyah", "Mary J. Blige", "R. Kelly", "Usher",
  // Modern R&B
  "Beyonce", "Alicia Keys", "John Legend", "D'Angelo", "Maxwell",
  "Erykah Badu", "Lauryn Hill", "Frank Ocean", "The Weeknd",
  "SZA", "Summer Walker", "Giveon", "Daniel Caesar",

  // ===========================================
  // FUNK
  // ===========================================
  // Funk Pioneers
  "Sly and the Family Stone", "George Clinton", "Parliament-Funkadelic", "Bootsy Collins",
  // Funk Bands
  "Earth Wind and Fire", "Kool and the Gang", "The Ohio Players", "The Commodores",
  "The Isley Brothers", "The Gap Band", "Cameo", "Zapp", "Con Funk Shun",
  // Funk Icons
  "Rick James", "Prince", "Morris Day and The Time",
  // Modern Funk
  "Bruno Mars", "Anderson Paak", "Thundercat", "Vulfpeck", "Dam-Funk",

  // ===========================================
  // HIP-HOP
  // ===========================================
  // Pioneers
  "Grandmaster Flash", "Afrika Bambaataa", "Kurtis Blow", "Run-DMC",
  "LL Cool J", "Big Daddy Kane", "Rakim",
  // Golden Age
  "Public Enemy", "N.W.A", "Ice Cube", "Ice-T",
  "A Tribe Called Quest", "De La Soul", "KRS-One",
  // 90s Legends
  "Tupac Shakur", "The Notorious B.I.G.", "Nas", "Jay-Z",
  "Wu-Tang Clan", "OutKast", "Missy Elliott", "DMX", "Busta Rhymes",
  // 2000s Era
  "Lil Wayne", "Kanye West", "T.I.", "50 Cent", "Rick Ross", "Nicki Minaj", "J. Cole",
  // Modern Era
  "Kendrick Lamar", "Drake", "Travis Scott", "Cardi B", "Megan Thee Stallion",
  "Tyler the Creator", "A$AP Rocky", "Future", "21 Savage",
  "Lil Baby", "Gunna", "Doja Cat", "Migos", "Lil Uzi Vert", "Roddy Ricch", "DaBaby",

  // ===========================================
  // GOSPEL
  // ===========================================
  // Pioneers
  "Thomas A. Dorsey", "Mahalia Jackson", "Sister Rosetta Tharpe",
  "The Staple Singers", "The Soul Stirrers",
  // Traditional Gospel
  "Shirley Caesar", "The Clark Sisters", "Andrae Crouch",
  "The Winans", "BeBe and CeCe Winans", "Donnie McClurkin",
  // Contemporary Gospel
  "Kirk Franklin", "Fred Hammond", "Yolanda Adams", "Mary Mary",
  "Tye Tribbett", "Travis Greene", "Tasha Cobbs Leonard", "Lecrae",
  "Jonathan McReynolds", "Maverick City Music",

  // ===========================================
  // REGGAE & DANCEHALL
  // ===========================================
  // Roots Reggae Legends
  "Bob Marley", "Peter Tosh", "Bunny Wailer", "Jimmy Cliff",
  "Toots and the Maytals", "Burning Spear", "Dennis Brown",
  "Gregory Isaacs", "Black Uhuru",
  // Dancehall
  "Shabba Ranks", "Buju Banton", "Bounty Killer", "Beenie Man",
  "Sean Paul", "Vybz Kartel", "Popcaan", "Shaggy",
  // Modern Reggae
  "Chronixx", "Koffee", "Protoje", "Damian Marley", "Stephen Marley", "Ziggy Marley",

  // ===========================================
  // AFROBEATS
  // ===========================================
  // Pioneers
  "Fela Kuti", "King Sunny Ade", "Ebenezer Obey",
  // Modern Afrobeats Stars
  "Wizkid", "Davido", "Burna Boy", "Tiwa Savage", "Yemi Alade",
  "Mr Eazi", "Tekno",
  // New Generation
  "Tems", "Rema", "Asake", "Ayra Starr", "Fireboy DML",
  "Omah Lay", "Ckay", "Tyla",
  // International Fusion
  "Skepta", "J Hus", "Stormzy",
]

// Artists by genre for filtering
export const ARTISTS_BY_GENRE: Record<string, string[]> = {
  jazz: [
    "Louis Armstrong", "Duke Ellington", "Count Basie", "Ella Fitzgerald",
    "Billie Holiday", "Sarah Vaughan", "Nat King Cole", "Charlie Parker",
    "Dizzy Gillespie", "Thelonious Monk", "Miles Davis", "John Coltrane",
    "Herbie Hancock", "Nina Simone", "Wynton Marsalis", "Kamasi Washington",
    "Robert Glasper", "Esperanza Spalding",
  ],
  blues: [
    "Robert Johnson", "Muddy Waters", "Howlin' Wolf", "B.B. King",
    "Albert King", "Bessie Smith", "Etta James", "Buddy Guy",
    "John Lee Hooker", "Gary Clark Jr.", "Christone Kingfish Ingram",
  ],
  "soul-rnb": [
    "Ray Charles", "Sam Cooke", "Otis Redding", "Stevie Wonder",
    "Marvin Gaye", "Diana Ross", "Aretha Franklin", "Whitney Houston",
    "Luther Vandross", "Mary J. Blige", "Usher", "Beyonce",
    "Alicia Keys", "Frank Ocean", "The Weeknd", "SZA",
  ],
  funk: [
    "James Brown", "Sly and the Family Stone", "George Clinton",
    "Parliament-Funkadelic", "Bootsy Collins", "Earth Wind and Fire",
    "Prince", "Rick James", "Anderson Paak", "Thundercat",
  ],
  "hip-hop": [
    "Grandmaster Flash", "Run-DMC", "Public Enemy", "N.W.A",
    "Tupac Shakur", "The Notorious B.I.G.", "Nas", "Jay-Z",
    "OutKast", "Lauryn Hill", "Kanye West", "Kendrick Lamar",
    "Drake", "Cardi B", "Megan Thee Stallion", "Tyler the Creator",
  ],
  gospel: [
    "Mahalia Jackson", "Sister Rosetta Tharpe", "Shirley Caesar",
    "Andrae Crouch", "Kirk Franklin", "Yolanda Adams",
    "Mary Mary", "Tasha Cobbs Leonard", "Maverick City Music",
  ],
  reggae: [
    "Bob Marley", "Peter Tosh", "Jimmy Cliff", "Burning Spear",
    "Buju Banton", "Sean Paul", "Damian Marley", "Chronixx", "Koffee",
  ],
  afrobeats: [
    "Fela Kuti", "Wizkid", "Davido", "Burna Boy", "Tiwa Savage",
    "Tems", "Rema", "Asake", "Ayra Starr", "Tyla",
  ],
}

// Get content type for music
export type MusicContentType = "music"
