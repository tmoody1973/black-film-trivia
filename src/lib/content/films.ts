// Curated list of films by Black directors
// Spanning decades of groundbreaking cinema

export const BLACK_DIRECTED_MOVIES = [
  // Spike Lee
  "Do the Right Thing", "Malcolm X", "Bamboozled", "Clockers", "Chi-Raq", "Da 5 Bloods", "BlacKkKlansman",

  // Jordan Peele
  "Get Out", "Us", "Nope",

  // Barry Jenkins
  "Moonlight", "If Beale Street Could Talk", "The Underground Railroad",

  // Ava DuVernay
  "Selma", "A Wrinkle in Time", "13th", "When They See Us",

  // Ryan Coogler
  "Black Panther", "Creed", "Fruitvale Station", "Black Panther: Wakanda Forever",

  // Steve McQueen
  "12 Years a Slave", "Shame", "Hunger", "Widows", "Small Axe",

  // John Singleton
  "Boyz n the Hood", "Poetic Justice", "Higher Learning", "Shaft", "2 Fast 2 Furious",

  // F. Gary Gray
  "Straight Outta Compton", "Friday", "Set It Off", "The Italian Job", "The Fate of the Furious",

  // Denzel Washington
  "Fences", "Antwone Fisher", "The Great Debaters", "A Journal for Jordan",

  // Lee Daniels
  "Precious", "The Butler", "Monster's Ball",

  // Kasi Lemmons
  "Eve's Bayou", "Harriet", "Talk to Me",

  // Julie Dash
  "Daughters of the Dust",

  // Charles Burnett
  "Killer of Sheep", "To Sleep with Anger",

  // Dee Rees
  "Pariah", "Mudbound", "Bessie",

  // Gina Prince-Bythewood
  "Love & Basketball", "Beyond the Lights", "The Old Guard", "The Woman King",

  // Forest Whitaker
  "Waiting to Exhale", "First Daughter",

  // Tim Story
  "Barbershop", "Think Like a Man", "Ride Along",

  // Tyler Perry
  "Diary of a Mad Black Woman", "Why Did I Get Married?", "A Fall from Grace",

  // Allen & Albert Hughes
  "Menace II Society", "Dead Presidents", "From Hell",

  // Ernest Dickerson
  "Juice", "Tales from the Crypt: Demon Knight",

  // Boots Riley
  "Sorry to Bother You",

  // Regina King
  "One Night in Miami",

  // Radha Blank
  "The Forty-Year-Old Version",

  // Shaka King
  "Judas and the Black Messiah",

  // Joe Robert Cole
  "All Day and a Night",

  // Melina Matsoukas
  "Queen & Slim",

  // Craig Brewer
  "Hustle & Flow",

  // Rick Famuyiwa
  "Dope", "The Wood", "Brown Sugar",

  // George Tillman Jr.
  "Soul Food", "The Hate U Give", "Men of Honor",

  // Theodore Witcher
  "Love Jones",

  // Malcolm D. Lee
  "The Best Man", "Girls Trip", "Space Jam: A New Legacy",

  // Hype Williams
  "Belly",

  // Antoine Fuqua
  "Training Day", "The Equalizer", "Emancipation",

  // Robert Townsend
  "Hollywood Shuffle", "The Five Heartbeats",

  // Reginald Hudlin
  "House Party", "Boomerang",

  // Destin Daniel Cretton
  "Just Mercy",

  // International Black Cinema
  "The Last Black Man in San Francisco", "Night Catches Us", "Atlantics", "Girlhood",
  "Rocks", "The Last Tree", "Rafiki", "Farming", "Noughts + Crosses",
  "The Boy Who Harnessed the Wind", "Queen of Katwe", "Beasts of No Nation", "Tsotsi",
  "Yeelen", "Touki Bouki", "Black Girl", "Hyenas", "Moolaadé", "Bamako",
  "Timbuktu", "Félicité", "I Am Not a Witch", "Vaya", "Inxeba (The Wound)",
  "Kati Kati", "Supa Modo", "Yardie", "Clemency", "The Burial of Kojo",
  "Eyimofe (This Is My Desire)", "Residue", "Nine Days", "Zola", "Passing",
  "The Harder They Fall",

  // Additional Notable Films
  "Candyman", "New Jack City", "Drumline", "ATL", "Paid in Full",
  "The Inevitable Defeat of Mister & Pete", "Middle of Nowhere", "The Secret Life of Bees",
  "Jumping the Broom", "Cadillac Records", "Southside with You", "The Photograph",
  "Miss Juneteenth", "Akeelah and the Bee",
] as const

export type BlackDirectedMovie = typeof BLACK_DIRECTED_MOVIES[number]
