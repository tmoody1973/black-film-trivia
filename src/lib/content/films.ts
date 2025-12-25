// Curated list of films by Black directors
// Spanning decades of groundbreaking cinema - organized by genre and director

export interface BlackDirectedMovie {
  title: string
  director: string
  year: number
  genres: string[]
}

// Simple string array for backward compatibility
export const BLACK_DIRECTED_MOVIES = [
  // ===========================================
  // DRAMA
  // ===========================================
  // Spike Lee
  "Do the Right Thing", "Malcolm X", "Bamboozled", "Clockers", "Chi-Raq", "Da 5 Bloods", "BlacKkKlansman",
  "School Daze", "Mo' Better Blues", "Jungle Fever", "He Got Game", "25th Hour", "Inside Man",
  "Miracle at St. Anna", "Red Hook Summer", "Oldboy", "Pass Over",

  // Barry Jenkins
  "Moonlight", "If Beale Street Could Talk", "Medicine for Melancholy",

  // Steve McQueen
  "12 Years a Slave", "Shame", "Hunger", "Widows", "Small Axe", "Lovers Rock",

  // Denzel Washington
  "Fences", "Antwone Fisher", "The Great Debaters", "A Journal for Jordan",

  // Lee Daniels
  "Precious", "The Butler", "Monster's Ball", "The Paperboy", "The United States vs. Billie Holiday",

  // Ava DuVernay
  "Selma", "A Wrinkle in Time", "13th", "When They See Us", "Middle of Nowhere", "Origin",

  // John Singleton
  "Boyz n the Hood", "Poetic Justice", "Higher Learning", "Rosewood", "Baby Boy",

  // George Tillman Jr.
  "Soul Food", "The Hate U Give", "Men of Honor", "Notorious",

  // Kasi Lemmons
  "Eve's Bayou", "Harriet", "Talk to Me", "Black Nativity", "The Caveman's Valentine",

  // Dee Rees
  "Pariah", "Mudbound", "Bessie",

  // Charles Burnett
  "Killer of Sheep", "To Sleep with Anger", "The Glass Shield", "Namibia: The Struggle for Liberation",

  // Julie Dash
  "Daughters of the Dust", "The Rosa Parks Story",

  // Gina Prince-Bythewood
  "Love & Basketball", "Beyond the Lights", "The Old Guard", "The Woman King", "The Secret Life of Bees",

  // Regina King
  "One Night in Miami",

  // Shaka King
  "Judas and the Black Messiah",

  // Melina Matsoukas
  "Queen & Slim",

  // Chinonye Chukwu
  "Clemency", "Till",

  // Radha Blank
  "The Forty-Year-Old Version",

  // Cord Jefferson
  "American Fiction",

  // Blitz Bazawule
  "The Color Purple",

  // Antoine Fuqua
  "Training Day", "The Equalizer", "The Equalizer 2", "The Equalizer 3", "Emancipation",
  "Tears of the Sun", "King Arthur", "Brooklyn's Finest", "Southpaw",

  // Additional Drama
  "The Pursuit of Happyness", "Ray", "Ali", "What's Love Got to Do with It", "The Color of Money",
  "Glory", "Amistad", "Remember the Titans", "The Hurricane", "42", "Race", "Hidden Figures",
  "The Help", "The Great Debaters", "Gifted Hands", "Coach Carter", "Akeelah and the Bee",
  "Freedom Writers", "Cadillac Records", "Get on Up", "I Am Ali", "Marshall",

  // ===========================================
  // HORROR & THRILLER
  // ===========================================
  // Jordan Peele
  "Get Out", "Us", "Nope",

  // Additional Horror/Thriller
  "Candyman", "Candyman: Farewell to the Flesh", "Tales from the Hood", "Tales from the Hood 2",
  "Tales from the Hood 3", "Bones", "Vampire in Brooklyn", "Def by Temptation", "Ganja & Hess",
  "Sugar Hill", "Blacula", "Scream Blacula Scream", "J.D.'s Revenge", "Dr. Black, Mr. Hyde",
  "The House on Skull Mountain", "Abby", "Demon Knight", "Night of the Living Dead",
  "The People Under the Stairs", "New Jack City", "Deep Cover",
  "Devil in a Blue Devil", "A Rage in Harlem", "One False Move", "Fresh",

  // ===========================================
  // COMEDY
  // ===========================================
  // F. Gary Gray
  "Friday", "Set It Off", "The Italian Job", "Law Abiding Citizen",

  // Tim Story
  "Barbershop", "Think Like a Man", "Ride Along", "Ride Along 2", "Shaft",

  // Tyler Perry
  "Diary of a Mad Black Woman", "Madea's Family Reunion", "Why Did I Get Married?",
  "I Can Do Bad All by Myself", "Madea Goes to Jail", "A Madea Christmas",
  "Boo! A Madea Halloween", "A Fall from Grace", "A Jazzman's Blues",

  // Malcolm D. Lee
  "The Best Man", "The Best Man Holiday", "Girls Trip", "Space Jam: A New Legacy",
  "Undercover Brother", "Soul Men", "Night School",

  // Reginald Hudlin
  "House Party", "Boomerang", "The Great White Hype", "Serving Sara", "Marshall",

  // Robert Townsend
  "Hollywood Shuffle", "The Five Heartbeats", "The Meteor Man", "B.A.P.S.",

  // Keenen Ivory Wayans
  "I'm Gonna Git You Sucka", "A Low Down Dirty Shame", "Don't Be a Menace to South Central While Drinking Your Juice in the Hood",
  "Scary Movie", "Scary Movie 2",

  // Additional Comedy
  "Coming to America", "Coming 2 America", "Trading Places", "Harlem Nights", "Brewster's Millions",
  "Life", "Blue Streak", "Bad Boys", "Bad Boys II", "Bad Boys for Life",
  "Black Knight", "A Thousand Words", "Tower Heist", "Beverly Hills Cop",
  "Beverly Hills Cop II", "Beverly Hills Cop III", "Norbit", "Meet Dave",
  "Nutty Professor", "Nutty Professor II: The Klumps", "Dr. Dolittle", "Dr. Dolittle 2",
  "Daddy Day Care", "Bowfinger", "Booty Call", "How to Be a Player",
  "Next Friday", "Friday After Next", "How High", "Soul Plane", "White Chicks",
  "Little Man", "Big Momma's House", "Big Momma's House 2", "Big Mommas: Like Father, Like Son",
  "Martin Lawrence Live: Runteldat", "You So Crazy", "Welcome Home Roscoe Jenkins",
  "Kevin Hart: Laugh at My Pain", "Kevin Hart: Let Me Explain", "Kevin Hart: What Now?",

  // ===========================================
  // ACTION & CRIME
  // ===========================================
  // Allen & Albert Hughes
  "Menace II Society", "Dead Presidents", "From Hell", "The Book of Eli",

  // Ernest Dickerson
  "Juice", "Tales from the Crypt: Demon Knight", "Bulletproof", "Surviving the Game",

  // Craig Brewer
  "Hustle & Flow", "Black Snake Moan", "Dolemite Is My Name",

  // F. Gary Gray (Action)
  "The Fate of the Furious", "Men in Black: International", "A Man Apart",

  // John Singleton (Action)
  "Shaft", "2 Fast 2 Furious", "Four Brothers",

  // Hype Williams
  "Belly",

  // Additional Action/Crime
  "New Jack City", "Above the Rim", "Paid in Full", "State Property", "State Property 2",
  "Street Kings", "S.W.A.T.", "Assault on Precinct 13", "Waist Deep",
  "ATL", "Stomp the Yard", "You Got Served", "Drumline", "Drumline: A New Beat",
  "Roll Bounce", "Lottery Ticket", "Brotherly Love",

  // ===========================================
  // ROMANCE & ROMANTIC COMEDY
  // ===========================================
  // Theodore Witcher
  "Love Jones",

  // Rick Famuyiwa
  "The Wood", "Brown Sugar", "Our Family Wedding", "Talk to Me",

  // Sanaa Hamri
  "Something New", "Just Wright",

  // Stella Meghie
  "The Photograph", "The Weekend", "Jean of the Joneses",

  // Additional Romance
  "Love & Basketball", "The Best Man", "Waiting to Exhale", "How Stella Got Her Groove Back",
  "Deliver Us from Eva", "Two Can Play That Game", "The Brothers", "About Last Night",
  "Think Like a Man Too", "Jumping the Broom", "Our Family Wedding", "The Perfect Match",
  "Almost Christmas", "The Perfect Holiday", "This Christmas", "Last Holiday",
  "Sparkle", "The Bodyguard", "Disappearing Acts", "Their Eyes Were Watching God",
  "For Colored Girls", "Temptation: Confessions of a Marriage Counselor",

  // ===========================================
  // SCIENCE FICTION & FANTASY
  // ===========================================
  // Ryan Coogler
  "Black Panther", "Creed", "Fruitvale Station", "Black Panther: Wakanda Forever", "Creed II", "Creed III",

  // Additional Sci-Fi/Fantasy
  "A Wrinkle in Time", "Space Jam: A New Legacy", "Hancock", "I Am Legend",
  "After Earth", "Men in Black", "Men in Black II", "Men in Black 3",
  "Independence Day", "Blade", "Blade II", "Blade: Trinity", "Spawn",
  "The Matrix", "The Matrix Reloaded", "The Matrix Revolutions",

  // ===========================================
  // DOCUMENTARY & BIOGRAPHICAL
  // ===========================================
  "13th", "I Am Not Your Negro", "What Happened, Miss Simone?", "The Black Power Mixtape 1967-1975",
  "Hoop Dreams", "Dark Girls", "Light Girls", "Good Hair", "Who Killed Malcolm X?",
  "Time: The Kalief Browder Story", "Rest in Power: The Trayvon Martin Story",
  "O.J.: Made in America", "The Two Killings of Sam Cooke", "Remastered: The Two Killings of Sam Cooke",
  "Amazing Grace", "Summer of Soul", "MLK/FBI", "Whose Streets?", "Let the Fire Burn",
  "The Black Panthers: Vanguard of the Revolution", "Strong Island", "The Death and Life of Marsha P. Johnson",
  "Quincy", "Homecoming: A Film by Beyoncé", "Miss Americana", "Tina",
  "Whitney", "Whitney: Can I Be Me", "The Bee Gees: How Can You Mend a Broken Heart",

  // ===========================================
  // MUSICAL & MUSIC FILMS
  // ===========================================
  "Sparkle", "Dreamgirls", "The Wiz", "Purple Rain", "Graffiti Bridge", "Under the Cherry Moon",
  "Krush Groove", "Beat Street", "Wild Style", "Breakin'", "Breakin' 2: Electric Boogaloo",
  "8 Mile", "Honey", "Stomp the Yard", "Step Up", "Fame",
  "Idlewild", "Cadillac Records", "Get on Up", "Straight Outta Compton",
  "All Eyez on Me", "Notorious", "Dope",

  // ===========================================
  // INTERNATIONAL BLACK CINEMA
  // ===========================================
  // African Cinema
  "Tsotsi", "Beasts of No Nation", "Queen of Katwe", "The Boy Who Harnessed the Wind",
  "Yeelen", "Touki Bouki", "Black Girl", "Hyenas", "Moolaadé", "Bamako",
  "Timbuktu", "Félicité", "I Am Not a Witch", "Vaya", "Inxeba (The Wound)",
  "Kati Kati", "Supa Modo", "The Burial of Kojo", "Eyimofe (This Is My Desire)",
  "Atlantics", "Rafiki", "Nairobi Half Life", "Viva Riva!", "The Wedding Party",
  "Lionheart", "Citation", "King of Boys", "The Figurine", "October 1",
  "Half of a Yellow Sun", "Ije", "Phone Swap",

  // British Black Cinema
  "Small Axe", "Lovers Rock", "Mangrove", "Red, White and Blue", "Alex Wheatle", "Education",
  "Rocks", "The Last Tree", "Farming", "Belle", "Yardie", "Noughts + Crosses",
  "Bullet Boy", "Kidulthood", "Adulthood", "Brotherhood", "Attack the Block",
  "Top Boy", "Blue Story", "Pirates",

  // Caribbean Cinema
  "The Harder They Come", "The Harder They Fall", "Yardie", "Countryman",
  "Third World Cop", "Shottas", "Better Mus' Come",

  // French/Francophone Black Cinema
  "La Haine", "Girlhood", "Portrait of a Lady on Fire", "Climax", "Les Misérables",
  "Atlantics", "The Intouchables", "Divines",

  // ===========================================
  // SPORTS FILMS
  // ===========================================
  "Remember the Titans", "Coach Carter", "Glory Road", "The Express", "42",
  "Race", "Concussion", "Ali", "When We Were Kings", "Creed", "Creed II", "Creed III",
  "Jerry Maguire", "The Blind Side", "The Longest Yard", "Major League", "White Men Can't Jump",
  "Love & Basketball", "He Got Game", "Space Jam", "Space Jam: A New Legacy",
  "Hoop Dreams", "More Than a Game", "The Last Dance",
  "Pelé: Birth of a Legend", "Invictus", "The Wrestler",

  // ===========================================
  // FAMILY & CHILDREN'S
  // ===========================================
  "Akeelah and the Bee", "Queen of Katwe", "The Inevitable Defeat of Mister & Pete",
  "A Wrinkle in Time", "The Lion King", "Harriet the Spy: Blog Wars",
  "Free Rein", "Let It Shine", "Camp Rock", "Lemonade Mouth",
  "Princess Protection Program", "Wendy", "Miss Juneteenth",

  // ===========================================
  // INDEPENDENT & ARTHOUSE
  // ===========================================
  "The Last Black Man in San Francisco", "Night Catches Us", "Residue", "Nine Days",
  "Zola", "Passing", "Master", "Nanny", "His House",
  "Medicine for Melancholy", "An Oversimplification of Her Beauty", "Newlyweeds",
  "Premature", "Really Love", "Test Pattern", "Miss Juneteenth",
  "The Fits", "The Forty-Year-Old Version", "American Fiction",

  // ===========================================
  // RECENT & CONTEMPORARY (2020s)
  // ===========================================
  "The Woman King", "Black Panther: Wakanda Forever", "Nope", "The Color Purple",
  "Emancipation", "Till", "One Night in Miami", "Judas and the Black Messiah",
  "Passing", "American Fiction", "Origin", "The Piano Lesson",
  "Bob Marley: One Love", "Mean Girls", "Kingdom of the Planet of the Apes",
] as const

export type BlackDirectedMovieTitle = typeof BLACK_DIRECTED_MOVIES[number]
