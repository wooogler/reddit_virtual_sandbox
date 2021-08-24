import re

page_raw = '''
Press J to jump to the feed. Press question mark to learn the rest of the keyboard shortcuts
Jump to content
r/ListOfSubredditsSubreddit Icon
Search within r/ListOfSubreddits
Subreddit Iconr/ListOfSubreddits
Search Reddit




Free

User avatar
leesang627
872 karma
User account menu
r/ListOfSubreddits

List Of Subreddits
r/ListOfSubreddits
Join

General Content
Gifs
People
Reaction
Science
Nature
Images
Interesting
Images/Gifs of Women (SFW)
Asian
Photoshop
Redditors/Selfies
Wallpapers
Videos
Discussion
General
Advice
AMA
Games
Question/Answer
Ask______
Occupation
Sex/Gender
Stories
Customer Service
Revenge
Scary/Weird
Support
Educational
General
Facts
Questions
Explain Like...
Anthropology
Art
Reddit
Painting
Computer Science/Engineering
Coding
Python
Economics
Business
Stocks
Environment
History
Historical Images
Language
Law
Math
Medicine
Psychology
Science
Astronomy/Aliens
Companies
Biology
Chemistry
Physics
Entertainment
General
Anime/Manga
Individual Anime/manga
Books/Writing
Comics
Individual books/stories/comics
Game of Thrones
Lord of the Rings
Celebrities
Individual Celebrities
Female
Male
Cosplay
Games
Dungeons and Dragons
Magic
Video games
Genres
Fantasy
Sci-fi
Internet/Apps
4chan
Facebook
Internet Dating
Internet Politics
Live Streaming
Podcasts
Tumblr
Twitter
YouTube
Individual YouTubers/Companies
Pewdiepie
Roosterteeth
Movies
Individual Movies/Series
Comic movies
Music
Artists
Genres
Electronic
Hip Hop
Metal
Pop
Instruments
Sports
American Football
American Football Teams
Baseball
Basketball
Teams
Boards
Cars
Fighting
Hockey
Olympics
Soccer
Soccer Teams
TV
Individual Shows
Animated
Dragon Ball Z
Doctor Who
It's Always Sunny in Philadelphia
Seinfeld
Netflix Related
Hobbies/Occupations
General
Aquariums
Arts/Writing
Writing
Automotive
Car companies
Design
Fake it til you make it
Guns/Combat
Combat
Guns
Job finding
Music
Outdoors
Gardening
Hiking
Photography/Film
Planes
Tech Related
Coding
PC Building
Tech Support
Tools
Travel
Lifestyle
General
Gender
Home
Communities
Body/Diet
LGBT
Transgender
Parenting
Drugs
Alcohol
Beer
Marijuana
Other drugs
Exercise/Health
Mental
Physical
Diet
Keto
Exercise
Lifting/Weights
Running
Medicine/Disease
Weight/Body Shape Control
Progress Pictures
Fashion/Beauty
Body Image
Hair
Tattoos
Fashion
Shoes
Food
Cooking
Diets
Drinks (non-alcoholic)
Recipes
Specific food
Money
Betting/Investing/Stocks
Budget
Consumerism
CryptoCurrency
Religion/Beliefs
Atheism
Christianity
Philosophy
Relationships/Sex
Family
Relationships
Online Relationships
Sex
Self-Improvement
Technology
3D Printing
Business Tech
Android products
Apple Products
Gadgets
Hardware
Kodi
Google Products
Linux
Microsoft Products
Data
Digital Currency
Programming
Sound
Humor
General Humor
"Comedy"
Jokes
Memes/Rage comics
Animals
Birds
Mammals
Cats
Dogs
Breeds
Other
Conspiracy
Cringe
Called out
"Neckbeard"
Girls
I Am Very
Neckbeard
Parents
Cute
Disgusting/Angering/Scary/Weird (Note: Potentially NSFL)
Angering
Cursed
Blessed
Edgy
Judgy
Scary (potentially NSFL)
Creepy
Imaginary
Water is scary
Free Stuff
Gender
For Men
For Women
Geography
Africa
Europe
France
Germany
Russia
Sweden
United Kingdom
North America
Canada
Mexico
USA: United States of America
California
Colorado
Florida
Texas
Washington
Oceania
Asia
Japan
Korea
South America
Meta
Administrative
April Fools
Apps
Circlejerks
Drama
Negative
Positive
Subreddits
Moderating
Subreddit Simulator
General
Looking for something
Mind blowing
Nature
Plants/Fungi
Violent Nature
Weather
News/Politics
News
Fake News
Politics
Nostalgia/Time
Parodies
SFWPorn Network
Shitty
Unexpected
Visually Appealing
Hold My ____
Weird Feelings/Categorize Later
Ex 50k+
NSFW (Porn)
Defunct
Update October 14 2018: Tentatively "done"!!!

Subreddits in bold have been voted positively by subscribers of /r/ListOfSubreddits.

The main list is currently split into 5 sections. Select what you are looking for below.

General Content	Gaming	NSFW	Politics	Memes
General Content
Gifs
/r/gifs
/r/behindthegifs
/r/gif
/r/Cinemagraphs
/r/WastedGifs
/r/educationalgifs
/r/perfectloops
/r/highqualitygifs
/r/gifsound
/r/combinedgifs
/r/retiredgif
/r/michaelbaygifs
/r/gifrecipes
/r/mechanical_gifs
/r/bettereveryloop
/r/gifextra
/r/slygifs
/r/gifsthatkeepongiving
/r/wholesomegifs
/r/noisygifs
/r/brokengifs
/r/loadingicon
/r/splitdepthgifs

People
/r/blackpeoplegifs
/r/whitepeoplegifs
/r/asianpeoplegifs
/r/scriptedasiangifs

Reaction
/r/reactiongifs
/r/shittyreactiongifs

Science
/r/chemicalreactiongifs
/r/physicsgifs

Nature
/r/babyelephantgifs
/r/weathergifs

Images
/r/pics
/r/PhotoshopBattles
/r/perfecttiming
/r/itookapicture
/r/Pareidolia
/r/ExpectationVSReality
/r/dogpictures
/r/misleadingthumbnails
/r/FifthWorldPics
/r/TheWayWeWere
/r/pic
/r/nocontextpics
/r/miniworlds
/r/foundpaper
/r/images
/r/screenshots

Interesting
/r/mildlyinteresting (see also: the "Mild Network"). Not all are active!
/r/interestingasfuck
/r/damnthatsinteresting
/r/beamazed
/r/reallifeshinies
/r/thatsinsane
/r/playitagainsam

Images/Gifs of Women (SFW)
/r/gentlemanboners
/r/prettygirls
/r/hardbodies
/r/girlsmirin
/r/thinspo
/r/goddesses
/r/shorthairedhotties
/r/fitandnatural
/r/wrestlewiththeplot
/r/skinnywithabs
/r/bois
/r/GentlemanBonersGifs

Asian
/r/asiancuties
/r/asiangirlsbeingcute

Photoshop
/r/PhotoshopBattles
/r/ColorizedHistory
/r/reallifedoodles
/r/HybridAnimals
/r/colorization

Redditors/Selfies
/r/amiugly
/r/roastme
/r/rateme
/r/uglyduckling
/r/prettygirlsuglyfaces

Wallpapers
/r/wallpapers
/r/wallpaper
/r/Offensive_Wallpapers

Videos
/r/videos
/r/youtubehaiku
/r/artisanvideos
/r/DeepIntoYouTube
/r/nottimanderic
/r/praisethecameraman
/r/killthecameraman
/r/perfectlycutscreams
/r/donthelpjustfilm
/r/abruptchaos

Discussion
General
/r/ShowerThoughts
/r/DoesAnybodyElse
/r/changemyview
/r/crazyideas
/r/howtonotgiveafuck
/r/tipofmytongue
/r/quotes
/r/casualconversation
/r/makenewfriendshere

Advice
For more advice/assistance subreddits, see here!

/r/relationship_advice
/r/raisedbynarcissists
/r/legaladvice and /r/bestoflegaladvice
/r/advice
/r/amitheasshole
/r/mechanicadvice
/r/toastme
/r/needadvice

AMA
/r/IAmA
/r/ExplainlikeIAmA
/r/AMA
/r/casualiama
/r/de_Iama

Games
/r/whowouldwin
/r/wouldyourather
/r/scenesfromahat
/r/AskOuija
/r/themonkeyspaw
/r/shittysuperpowers
/r/godtiersuperpowers
/r/decreasinglyverbose
/r/jesuschristouija

Question/Answer
/r/whatisthisthing For more like this, see here from /r/AskReddit!
/r/answers
/r/NoStupidQuestions
/r/amiugly
/r/whatsthisbug
/r/samplesize
/r/tooafraidtoask
/r/whatsthisplant
/r/isitbullshit
/r/morbidquestions

Ask______
/r/AskReddit
/r/ShittyAskScience
/r/TrueAskReddit
/r/AskScienceFiction
/r/AskOuija

Occupation
/r/AskScience
/r/askhistorians
/r/askculinary
/r/AskSocialScience
/r/askengineers
/r/askphilosophy
/r/askdocs

Sex/Gender
/r/askwomen
/r/askmen
/r/askgaybros
/r/askredditafterdark
/r/asktransgender
/r/askmenover30

Stories
/r/tifu
/r/self
/r/confession
/r/fatpeoplestories
/r/confessions
/r/storiesaboutkevin

Customer Service
/r/talesfromtechsupport
/r/talesfromretail
/r/techsupportmacgyver
/r/idontworkherelady
/r/TalesFromYourServer
/r/KitchenConfidential
/r/TalesFromThePizzaGuy
/r/TalesFromTheFrontDesk
/r/talesfromthecustomer
/r/talesfromcallcenters
/r/talesfromthesquadcar
/r/talesfromthepharmacy
/r/starbucks

Revenge
/r/pettyrevenge
/r/prorevenge
/r/nuclearrevenge

Scary/Weird
/r/nosleep
/r/LetsNotMeet
/r/Glitch_in_the_Matrix
/r/shortscarystories
/r/thetruthishere
/r/UnresolvedMysteries
/r/UnsolvedMysteries

Support
/r/depression
/r/SuicideWatch
/r/Anxiety
/r/foreveralone
/r/offmychest
/r/socialanxiety
/r/trueoffmychest
/r/unsentletters
/r/rant

Educational
General
/r/YouShouldKnow
/r/everymanshouldknow
/r/LearnUselessTalents
/r/changemyview
/r/howto
/r/Foodforthought
/r/educationalgifs
/r/lectures
/r/education
/r/college
/r/GetStudying
/r/teachers
/r/watchandlearn
/r/bulletjournal
/r/applyingtocollege
/r/lawschool

Facts
/r/todayilearned
/r/wikipedia

Questions
/r/OutOfTheLoop
/r/IWantToLearn

Explain Like...
/r/explainlikeimfive
/r/explainlikeIAmA
/r/ExplainLikeImCalvin

Anthropology
/r/anthropology

Art
/r/Art (For more art related subreddits, click here!)
/r/redditgetsdrawn
/r/heavymind
/r/drawing
/r/graffiti
/r/retrofuturism
/r/sketchdaily
/r/ArtPorn
/r/pixelart
/r/artfundamentals
/r/learnart
/r/specart
/r/animation
/r/wimmelbilder
/r/illustration
/r/streetart

Reddit
/r/place
/r/breadstapledtotrees
/r/chairsunderwater

Painting
/r/painting
/r/minipainting

Computer Science/Engineering
/r/gamedev
/r/engineering
/r/ubuntu
/r/cscareerquestions
/r/EngineeringStudents
/r/askengineers

Coding
/r/learnprogramming
/r/compsci
/r/java
/r/javascript
/r/coding
/r/machinelearning
/r/howtohack
/r/cpp
/r/artificial

Python
/r/python
/r/learnpython

Economics
/r/Economics
/r/business
/r/entrepreneur
/r/marketing
/r/BasicIncome

Business
/r/business
/r/smallbusiness

Stocks
/r/stocks
/r/wallstreetbets
/r/stockmarket

Environment
/r/environment
/r/zerowaste

History
For more, see the wiki compiled by /r/historynetwork!
Note: Many of those subreddits are inactive.

/r/history
/r/AskHistorians
/r/ColorizedHistory
/r/badhistory
/r/100yearsago

Historical Images
/r/HistoryPorn
/r/PropagandaPosters
/r/TheWayWeWere
/r/historymemes
/r/castles

Language
/r/linguistics
/r/languagelearning
/r/learnjapanese
/r/french
/r/etymology

Law
/r/law

Math
/r/math
/r/theydidthemath

Medicine
/r/medicalschool
/r/medizzy

Psychology
/r/psychology /r/JordanPeterson

Science
/r/Science
/r/AskScience
/r/cogsci
/r/medicine
/r/everythingscience
/r/geology

Astronomy/Aliens
/r/Space
/r/SpacePorn
/r/astronomy
/r/astrophotography
/r/aliens
/r/rockets

Companies
/r/spacex
/r/nasa

Biology
/r/biology
/r/Awwducational

Chemistry
/r/chemicalreactiongifs
/r/chemistry

Physics
/r/physics

Entertainment
General
/r/entertainment
/r/fantheories
/r/Disney
/r/obscuremedia

Anime/Manga
/r/anime
/r/manga
/r/anime_irl
/r/awwnime
/r/TsundereSharks
/r/animesuggest
/r/animemes
/r/animegifs
/r/animewallpaper
/r/wholesomeanimemes

Individual Anime/manga
/r/pokemon
/r/onepiece
/r/naruto
/r/dbz
/r/onepunchman
/r/ShingekiNoKyojin
/r/yugioh
/r/BokuNoHeroAcademia
/r/DDLC
/r/berserk
/r/hunterxhunter
/r/tokyoghoul
/r/shitpostcrusaders

Books/Writing
/r/Books
/r/WritingPrompts
/r/writing
/r/literature
/r/booksuggestions
/r/lifeofnorman
/r/poetry
/r/screenwriting
/r/freeEbooks
/r/boottoobig
/r/hfy
/r/suggestmeabook
/r/lovecraft

Comics
/r/comics
/r/comicbooks
/r/polandball
/r/marvel
/r/webcomics
/r/bertstrips
/r/marvelstudios
/r/defenders
/r/marvelmemes
/r/avengers

Individual books/stories/comics
/r/harrypotter
/r/batman
/r/calvinandhobbes (and /r/explainlikeimcalvin)
/r/xkcd
/r/DCComics
/r/arrow
/r/unexpectedhogwarts
/r/spiderman
/r/deadpool
/r/KingkillerChronicle

Game of Thrones
/r/asoiaf
/r/gameofthrones
/r/freefolk
/r/jonwinsthethrone
/r/gameofthronesmemes
/r/daeneryswinsthethrone
/r/asongofmemesandrage

Lord of the Rings
/r/lotr
/r/lotrmemes
/r/tolkienfans

Celebrities
/r/celebs
/r/celebhub

Individual Celebrities
Female
/r/EmmaWatson
/r/jessicanigri
/r/kateupton
/r/alisonbrie
/r/EmilyRatajkowski
/r/jenniferlawrence
/r/alexandradaddario

Male
/r/onetruegod
/r/joerogan
/r/keanubeingawesome
/r/crewscrew
/r/donaldglover
/r/elonmusk

Cosplay
/r/cosplay
/r/cosplaygirls

Games
/r/lego
/r/boardgames
/r/rpg
/r/chess
/r/poker
/r/jrpg

Dungeons and Dragons
/r/DnD
/r/DnDGreentext
/r/DnDBehindTheScreen
/r/dndnext
/r/dungeonsanddragons
/r/criticalrole
/r/DMAcademy
/r/dndmemes

Magic
/r/magicTCG
/r/modernmagic
/r/magicarena

Video games
The above is the complete list of every video game subreddit with currently 50k or more subscribers!

Genres
/r/zombies
/r/cyberpunk

Fantasy
/r/fantasy

Sci-fi
For other sci-fi subreddits, see here!

/r/scifi
/r/starwars
/r/startrek
/r/asksciencefiction
/r/prequelmemes
/r/empiredidnothingwrong
/r/SequelMemes
/r/sciencefiction

Internet/Apps
/r/InternetIsBeautiful
/r/facepalm
/r/wikipedia
/r/creepyPMs
/r/web_design
/r/google
/r/KenM
/r/bannedfromclubpenguin
/r/savedyouaclick
/r/bestofworldstar
/r/discordapp
/r/snaplenses
/r/tronix
/r/instagramreality
/r/internetstars
/r/robinhood
/r/shortcuts
/r/scams
/r/tiktokcringe
/r/crackheadcraigslist

4chan
/r/4chan
/r/Classic4chan
/r/greentext

Facebook
/r/facepalm
/r/oldpeoplefacebook
/r/facebookwins
/r/indianpeoplefacebook
/r/terriblefacebookmemes
/r/insanepeoplefacebook

Internet Dating
/r/Tinder
/r/OkCupid

Internet Politics
/r/KotakuInAction
/r/wikileaks
/r/shitcosmosays

Live Streaming
/r/twitch
/r/livestreamfail

Podcasts
/r/serialpodcast
/r/podcasts

Tumblr
/r/tumblrinaction
/r/tumblr

Twitter
/r/blackpeopletwitter
/r/scottishpeopletwitter
/r/WhitePeopleTwitter
/r/wholesomebpt
/r/latinopeopletwitter

YouTube
/r/YoutubeHaiku
/r/youtube
/r/youngpeopleyoutube

Individual YouTubers/Companies
/r/gamegrumps
/r/h3h3productions
/r/CGPGrey
/r/yogscast
/r/jontron
/r/Idubbbz
/r/defranco
/r/cynicalbrit
/r/pyrocynical
/r/SovietWomble
/r/RedLetterMedia
/r/videogamedunkey
/r/loltyler1
/r/ksi
/r/MiniLadd
/r/jacksepticeye

Pewdiepie
/r/pewdiepiesubmissions
/r/pewdiepie

Roosterteeth
/r/roosterteeth
/r/funhaus
/r/rwby
/r/cowchop

Movies
/r/movies
/r/documentaries
/r/fullmoviesonyoutube
/r/truefilm
/r/bollywoodrealism
/r/moviedetails
/r/moviesinthemaking
/r/fullmoviesonvimeo
/r/continuityporn
/r/ghibli
/r/cinematography
/r/shittymoviedetails
/r/moviescirclejerk

Individual Movies/Series
/r/starwars
/r/harrypotter
/r/lotr
/r/lotrmemes
/r/otmemes

Comic movies
/r/marvelstudios
/r/batman
/r/DC_Cinematic
/r/thanosdidnothingwrong
/r/inthesoulstone

Music
Much more [here](http://www.reddit.com/r/listentothis/about/sidebar\) from the sidebar of /r/listentothis!
See especially [The Fire Hose](http://www.reddit.com/user/evilnight/m/thefirehose\) curated by /u/evilnight. All subreddits are active!

/r/music
/r/listentothis
/r/WeAreTheMusicMakers
/r/mashups
/r/vinyl
/r/futurebeats
/r/musictheory
/r/guitarlessons
/r/spotify
/r/fakealbumcovers
/r/ableton

Artists
/r/kanye
/r/radiohead
/r/KendrickLamar
/r/gorillaz
/r/frankocean
/r/donaldglover
/r/eminem
/r/brockhampton
/r/beatles
/r/deathgrips
/r/pinkfloyd

Genres
/r/classicalmusic
/r/jazz
/r/trap
/r/indieheads
/r/gamemusic
/r/outrun
/r/vaporwave

Electronic
/r/dubstep
/r/electronicmusic
/r/edmproduction
/r/EDM

Hip Hop
/r/hiphopheads
/r/hiphopimages

Metal
/r/Metal
/r/Metalcore

Pop
/r/spop
/r/kpop
/r/funkopop
/r/popheads

Instruments
/r/guitar
/r/piano
/r/bass
/r/drums

Sports
Sports subreddits!
Sports team subreddits!

/r/sports
/r/running
/r/bicycling
/r/golf
/r/fishing
/r/skiing
/r/sportsarefun
/r/tennis
/r/rugbyunion
/r/discgolf
/r/cricket
/r/sailing

American Football
/r/nfl
/r/CFB
/r/fantasyfootball
/r/nflstreams

American Football Teams
/r/patriots
/r/eagles
/r/greenbaypackers
/r/minnesotavikings
/r/losangelesrams

Baseball
/r/baseball
/r/mlb
/r/fantasybaseball

Basketball
/r/nba
/r/collegebasketball
/r/nbastreams
/r/fantasybball

Teams
/r/warriors
/r/lakers
/r/bostonceltics
/r/torontoraptors
/r/sixers
/r/chicagobulls

Boards
/r/skateboarding
/r/snowboarding
/r/longboarding

Cars
/r/formula1
/r/Nascar

Fighting
/r/MMA
/r/squaredcircle
/r/theocho
/r/ufc
/r/boxing
/r/wwe
/r/MMAStreams

Hockey
/r/hockey
/r/nhl
/r/nhlstreams
/r/leafs

Olympics
/r/olympics
/r/apocalympics2016

Soccer
/r/soccer
/r/worldcup
/r/Bundesliga
/r/futbol
/r/soccerstreams
/r/MLS
/r/fantasypl

Soccer Teams
/r/gunners
/r/reddevils
/r/LiverpoolFC
/r/chelseafc

TV
/r/Television
/r/marvelstudios
/r/japanesegameshows
/r/shield
/r/cordcutters
/r/offlinetv
/r/tvdetails

Individual Shows
/r/GameOfThrones
/r/BreakingBad
/r/thewalkingdead
/r/community
/r/arresteddevelopment
/r/topgear
/r/StarTrek More here!
/r/HIMYM
/r/firefly
/r/PandR
/r/Sherlock
/r/DunderMifflin (The Office)
/r/BetterCallSaul
/r/TrueDetective
/r/houseofcards
/r/MakingaMurderer
/r/FlashTV
/r/trailerparkboys
/r/mrrobot
/r/siliconvalleyhbo
/r/strangerthings
/r/supernatural
/r/thegrandtour
/r/AmericanHorrorStory
/r/rupaulsdragrace
/r/westworld
/r/blackmirror
/r/FilthyFrank
/r/orangeisthenewblack
/r/twinpeaks
/r/bigbrother
/r/brooklynninenine
/r/scrubs
/r/howyoudoin (Friends)
/r/30rock
/r/lifeisstrange
/r/survivor
/r/riverdale
/r/letterkenny

Animated
/r/Pokemon
/r/AdventureTime
/r/futurama
/r/TheLastAirbender
/r/ArcherFX
/r/southpark
/r/TheSimpsons
/r/mylittlepony
/r/rickandmorty
/r/naruto
/r/stevenuniverse
/r/onepunchman
/r/BobsBurgers
/r/BoJackHorseman
/r/gravityfalls
/r/familyguy
/r/kingofthehill
/r/spongebob

Dragon Ball Z
/r/dbz
/r/DBZDokkanBattle
/r/dragonballfighterz

Doctor Who
/r/doctorwho
/r/gallifrey

It's Always Sunny in Philadelphia
/r/IASIP
/r/the_dennis

Seinfeld
/r/seinfeld
/r/redditwritesseinfeld
/r/seinfeldgifs

Netflix Related
/r/NetflixBestOf
/r/Netflix
/r/bestofnetflix

Hobbies/Occupations
General
/r/DIY (List of DIY subreddits!)
/r/cosplay
/r/woodworking
/r/somethingimade
/r/architecture
/r/CoolGuides
/r/WorldBuilding
/r/ifyoulikeblank
/r/DiWHY
/r/knitting
/r/sewing
/r/modelmakers
/r/crochet
/r/ProtectAndServe
/r/RTLSDR
/r/digitalnomad
/r/FastWorkers
/r/accounting
/r/preppers
/r/redneckengineering
/r/crossstitch
/r/dumpsterdiving
/r/gunpla
/r/urbanplanning
/r/cubers
/r/blacksmith
/r/toptalent
/r/slavelabour

Aquariums
/r/aquariums
/r/plantedtank

Arts/Writing
/r/art
/r/Drawing
/r/crafts
/r/alternativeart
/r/sketchdaily
/r/artporn
/r/glitch_art
/r/coloringcorruptions
/r/restofthefuckingowl
/r/DisneyVacation
/r/illustration

Writing
/r/Writing
/r/writingprompts
/r/screenwriting
/r/fountainpens
/r/calligraphy
/r/handwriting
/r/twosentencehorror
/r/brandnewsentence

Automotive
/r/cars
/r/motorcycles (motorcycle multi compiled by /u/noeatnosleep. Not all active.)
/r/carporn
/r/justrolledintotheshop
/r/idiotsincars
/r/Shitty_Car_Mods
/r/autos
/r/roadcam
/r/AutoDetailing
/r/awesomecarmods
/r/projectcar
/r/cartalk
/r/tiresaretheenemy
/r/roadtrip
/r/convenientcop
/r/dashcamgifs

Car companies
/r/subaru
/r/teslamotors
/r/bmw
/r/jeep

Design
/r/CrappyDesign
/r/web_design
/r/graphic_design
/r/design
/r/designporn
/r/InteriorDesign
/r/ATBGE
/r/dontdeadopeninside
/r/assholedesign
/r/keming
/r/logodesign
/r/tombstoning
/r/dangerousdesign

Fake it til you make it
/r/actlikeyoubelong
/r/irlsmurfing

Guns/Combat
Combat
/r/MilitaryPorn
/r/military
/r/combatfootage
/r/militarygfys
/r/army
/r/warshipporn
/r/justbootthings

Guns
/r/guns
/r/gunporn
/r/gundeals
/r/ar15
/r/firearms
/r/ccw
/r/airsoft

Job finding
/r/Jobs
/r/forhire
/r/cscareerquestions
/r/workonline

Music
/r/guitar
/r/WeAreTheMusicMakers
/r/edmproduction
/r/piano
/r/ableton
/r/drums
/r/FL_Studio

Outdoors
/r/urbanexploration
/r/survival
/r/backpacking
/r/camping
/r/homestead
/r/MTB (mountain biking)
/r/outdoors
/r/wildernessbackpacking
/r/campinggear
/r/bushcraft

Gardening
/r/gardening
/r/indoorgarden

Hiking
/r/campingandhiking
/r/hiking
/r/ultralight

Photography/Film
/r/photography
/r/itookapicture
/r/Filmmakers
/r/astrophotography
/r/analog
/r/photocritique
/r/postprocessing

Planes
/r/aviation
/r/flying

Tech Related
/r/sysadmin
/r/engineering
/r/compsci
/r/webdev
/r/programmerhumor
/r/graphic_design
/r/mechanicalkeyboards
/r/reverseengineering
/r/itsaunixsystem
/r/plex
/r/multicopter
/r/programminghorror

Coding
/r/dailyprogrammer
/r/coding
/r/python
/r/java
/r/cpp
/r/security

PC Building
/r/buildapc
/r/buildapcsales
/r/buildapcforme

Tech Support
/r/talesfromtechsupport
/r/techsupportgore
/r/techsupport
/r/softwaregore
/r/iiiiiiitttttttttttt

Tools
/r/watches
/r/lockpicking
/r/knives
/r/specializedtools
/r/knifeclub

Travel
/r/travel
/r/solotravel
/r/japantravel
/r/shoestring

Lifestyle
General
/r/LifeProTips
/r/lifehacks
/r/geek
/r/EDC
/r/simpleliving
/r/tinyhouses
/r/rainmeter
/r/vandwellers
/r/UnethicalLifeProTips
/r/vagabond
/r/illegallifeprotips

Gender
/r/malelifestyle
/r/malelivingspace
/r/TheGirlSurvivalGuide

Home
/r/homeimprovement
/r/homelab
/r/homeautomation
/r/battlestations
/r/hometheater

Communities
/r/teenagers
/r/introvert
/r/ADHD
/r/totallynotrobots
/r/polyamory
/r/teachers
/r/aliensamongus
/r/neverbrokeabone
/r/bipolar

Body/Diet
/r/beards
/r/vegan
/r/swoleacceptance
/r/tall

LGBT
/r/lgbt
/r/gaybros
/r/actuallesbians
/r/gaymers
/r/bisexual
/r/askgaybros
/r/ainbow
/r/gay
/r/gay_irl

Transgender
/r/asktransgender
/r/transgender

Parenting
/r/parenting
/r/daddit
/r/babybumps

Drugs
Alcohol
/r/drunk
/r/scotch
/r/stopdrinking
/r/cocktails
/r/wine
/r/bourbon
/r/whiskey

Beer
/r/beer
/r/homebrewing
/r/showerbeer
/r/beerporn

Marijuana
/r/trees
/r/marijuana
/r/microgrowery
/r/eldertrees
/r/see
/r/leaves
/r/weed
/r/weedstocks
/r/cannabis

Other drugs
/r/drugs
/r/electronic_cigarette
/r/stonerengineering
/r/Nootropics
/r/LSD
/r/vaporents
/r/Vaping
/r/stopsmoking
/r/shrooms
/r/dmt

Exercise/Health
/r/GetMotivated
/r/health
/r/ZenHabits
/r/motivation

Mental
/r/LucidDreaming
/r/meditation
/r/Psychonaut
/r/mentalhealth

Physical
For more fitness subreddits, see this list compiled by /r/Fitness!
Note: Many of those subreddits are tiny/inactive.

/r/Fitness
/r/xxfitness

Diet
/r/fitmeals
/r/paleo
/r/nutrition
/r/vegetarian
/r/leangains
/r/HealthyFood
/r/intermittentfasting
/r/fasting

Keto
/r/keto
/r/ketorecipes
/r/ketogains

Exercise
/r/bicycling
/r/yoga
/r/skateboarding
/r/climbing
/r/backpacking
/r/bjj
/r/skiing
/r/crossfit

Lifting/Weights
/r/bodybuilding
/r/WeightRoom
/r/powerlifting

Running
/r/running
/r/c25k

Medicine/Disease
/r/Medicine
/r/Coronavirus
/r/COVID19

Weight/Body Shape Control
/r/loseit
/r/bodyweightfitness
/r/gainit
/r/swoleacceptance
/r/flexibility

Progress Pictures
/r/progresspics
/r/brogress

Fashion/Beauty
Body Image
/r/makeupaddiction
/r/SkincareAddiction
/r/beards
/r/wicked_edge
/r/RedditLaqueristas
/r/AsianBeauty
/r/piercing

Hair
/r/FancyFollicles
/r/malehairadvice
/r/curlyhair

Tattoos
/r/tattoos
/r/badtattoos
/r/tattoo

Fashion
/r/malefashionadvice
/r/frugalmalefashion
/r/femalefashionadvice
/r/thriftstorehauls
/r/fashion
/r/streetwear
/r/malefashion
/r/supremeclothing
/r/FashionReps
/r/designerreps

Shoes
/r/sneakers
/r/repsneakers
/r/goodyearwelt

Food
/r/food
/r/FoodPorn
/r/foodhacks
/r/shittyfoodporn
/r/eatsandwiches
/r/nutrition
/r/mealtimevideos
/r/WeWantPlates
/r/forbiddensnacks
/r/seriouseats
/r/spicy

Cooking
/r/cooking
/r/slowcooking
/r/askculinary
/r/baking
/r/mealprepsunday
/r/breadit
/r/cookingforbeginners
/r/smoking
/r/castiron
/r/instantpot
/r/sousvide

Diets
/r/EatCheapAndHealthy
/r/fitmeals
/r/budgetfood
/r/ketorecipes
/r/vegan
/r/1200isplenty
/r/Cheap_Meals
/r/HealthyFood
/r/veganrecipes
/r/intermittentfasting
/r/fasting

Drinks (non-alcoholic)
/r/coffee
/r/tea

Recipes
/r/recipes
/r/gifrecipes
/r/veganrecipes

Specific food
/r/pizza
/r/grilledcheese
/r/ramen
/r/bbq
/r/sushi

Money
/r/PersonalFinance
/r/Entrepreneur
/r/beermoney
/r/startups
/r/finance
/r/economy
/r/financialindependence
/r/apphookup
/r/churning
/r/realestate
/r/flipping
/r/antimlm
/r/ripple
/r/Iota
/r/stellar
/r/personalfinancecanada

Betting/Investing/Stocks
/r/investing
/r/wallstreetbets
/r/millionairemakers
/r/weedstocks
/r/options
/r/pennystocks

Budget
/r/frugal
/r/EatCheapAndHealthy
/r/frugalmalefashion
/r/budgetfood
/r/cheap_meals
/r/Frugal_Jerk
/r/povertyfinance

Consumerism
/r/shutupandtakemymoney
/r/BuyItForLife
/r/crappyoffbrands
/r/shouldibuythisgame
/r/Anticonsumption
/r/sbubby
/r/Wellworn
/r/ineeeedit
/r/didntknowiwantedthat

CryptoCurrency
/r/Bitcoin
/r/dogecoin
/r/CryptoCurrency
/r/ethereum
/r/ethtrade
/r/litecoin
/r/btc
/r/garlicoin
/r/cardano
/r/Vechain

Religion/Beliefs
/r/Psychonaut
/r/Buddhism
/r/Stoicism
/r/occult

Atheism
/r/atheism
/r/trueatheism

Christianity
/r/Christianity
/r/dankchristianmemes
/r/exmormon
/r/Catholicism

Philosophy
/r/philosophy
/r/askphilosophy

Relationships/Sex
/r/socialskills
/r/socialengineering
/r/weddingplanning

Family
/r/Parenting
/r/childfree
/r/raisedbynarcissists
/r/incest
/r/daddit
/r/justnomil
/r/justnofamily

Relationships
/r/relationships
/r/relationship_advice
/r/dating_advice
/r/breakups
/r/dating

Online Relationships
/r/Tinder
/r/OKCupid
/r/r4r
/r/dirtyr4r (NSFW)
/r/longdistance

Sex
/r/sex
/r/seduction
/r/nofap
/r/deadbedrooms
/r/polyamory

Self-Improvement
/r/GetMotivated
/r/QuotesPorn
/r/getdisciplined
/r/happy
/r/productivity
/r/DecidingToBeBetter
/r/mademesmile
/r/selfimprovement
/r/iwantout
/r/humansbeingbros
/r/happycrowds
/r/sportsarefun
/r/GetStudying
/r/motivation
/r/gatesopencomeonin

Technology
More tech related subreddits, from the sidebar of /r/technology, can be found here.

/r/technology
/r/internetisbeautiful
/r/futurology
/r/pcmasterrace
/r/buildapc
/r/talesfromtechsupport
/r/netsec
/r/gamedev
/r/design
/r/engineering
/r/jailbreak
/r/compsci
/r/tech
/r/hacking
/r/imaginarytechnology
/r/privacy
/r/torrents
/r/networking
/r/infographics
/r/piracy
/r/EngineeringPorn
/r/cableporn
/r/simulated
/r/onions
/r/unixporn
/r/crackwatch
/r/php
/r/aboringdystopia
/r/virtualreality
/r/opensource

3D Printing
/r/3Dprinting
/r/functionalprint

Business Tech
/r/nintendo
/r/spacex
/r/nasa
/r/amd
/r/nvidia
/r/photoshop
/r/firefox

Android products
/r/Android
/r/AndroidApps
/r/AndroidGaming
/r/AndroidDev
/r/AndroidThemes
/r/oneplus

Apple Products
/r/apple
/r/iphone
/r/mac
/r/ipad
/r/applewatch

Gadgets
/r/gadgets
/r/raspberry_pi
/r/electronics
/r/arduino
/r/trackers
/r/gopro
/r/blender
/r/amazonecho
/r/RetroPie

Hardware
/r/hardware
/r/hardwareswap

Kodi
/r/Addons4Kodi
/r/kodi

Google Products
/r/google
/r/chromecast
/r/googlepixel
/r/googlehome

Linux
/r/linux
/r/linux_gaming
/r/linux4noobs
/r/linuxmasterrace
/r/archlinux

Microsoft Products
/r/Windows10
/r/windows
/r/excel
/r/surface
/r/microsoft

Data
/r/dataisbeautiful
/r/DataHoarder
/r/datascience

Digital Currency
/r/Bitcoin
/r/dogecoin
/r/CryptoCurrency
/r/ethereum
/r/ethtrader
/r/btc
/r/litecoin
/r/bitcoinmarkets
/r/cryptomarkets
/r/monero
/r/neo

Programming
/r/programming
/r/learnprogramming
/r/python
/r/java
/r/javascript
/r/learnpython
/r/excel
/r/unity3d
/r/reactjs

Sound
/r/audiophile
/r/headphones
/r/audioengineering

Humor
General Humor
/r/funny
/r/humor
/r/contagiouslaughter
/r/standupcomedy
/r/ProgrammerHumor
/r/prematurecelebration
/r/ChildrenFallingOver
/r/dadreflexes
/r/kenm
/r/politicalhumor
/r/accidentalcomedy
/r/funnyandsad
/r/kidsarefuckingstupid
/r/notkenm
/r/suspiciouslyspecific
/r/oddlyspecific
/r/rimjob_steve
/r/dark_humor
/r/stepdadreflexes
/r/congratslikeimfive
/r/darkhumorandmemes

"Comedy"
/r/ComedyCemetery
/r/comedyheaven
/r/comedynecromancy
/r/comedyhomicide
/r/comedynecrophilia

Jokes
/r/Jokes
/r/dadjokes
/r/standupshots
/r/punny
/r/antijokes
/r/meanjokes
/r/3amjokes
/r/puns
/r/WordAvalanches
/r/darkjokes

Memes/Rage comics
See here.

Animals
More here! From /r/AnimalReddits.
Note that not all of those are active.

/r/AnimalsBeingJerks (see also The Being Network )
/r/AnimalsBeingBros
/r/AnimalPorn
/r/AnimalsBeingDerps
/r/likeus
/r/stoppedworking
/r/hitmanimals
/r/animaltextgifs
/r/BeforeNAfterAdoption
/r/sneks
/r/TsundereSharks
/r/whatsthisbug
/r/HybridAnimals
/r/zoomies
/r/brushybrushy
/r/bigboye
/r/curledfeetsies
/r/mlem
/r/Floof
/r/shittyanimalfacts
/r/animalsthatlovemagic
/r/spiderbro
/r/properanimalnames
/r/reverseanimalrescue
/r/animalsdoingstuff
/r/sploot

Birds
/r/birdswitharms
/r/superbowl
/r/birbs
/r/partyparrot
/r/birdsbeingdicks
/r/emuwarflashbacks
/r/birdsarentreal

Mammals
/r/babyelephantgifs
/r/sloths
/r/foxes
/r/trashpandas
/r/happycowgifs
/r/rabbits
/r/goatparkour
/r/bearsdoinghumanthings

Cats
/r/cats (more here from /r/CatSubs)
/r/startledcats
/r/catpictures
/r/catsstandingup
/r/catpranks
/r/meow_irl
/r/holdmycatnip
/r/catslaps
/r/thecatdimension
/r/babybigcatgifs
/r/catloaf
/r/thisismylifemeow
/r/cattaps
/r/teefies
/r/tuckedinkitties
/r/catsareassholes
/r/catsisuottatfo
/r/stuffoncats
/r/bigcatgifs
/r/jellybeantoes
/r/catsareliquid
/r/catgifs
/r/blackcats
/r/supermodelcats
/r/chonkers
/r/tightpussy
/r/catswithjobs
/r/catswhoyell
/r/whatswrongwithyourcat
/r/illegallysmolcats

Dogs
/r/dogs
/r/dogpictures
/r/dogtraining
/r/woof_irl
/r/WhatsWrongWithYourDog
/r/dogberg
/r/dogswithjobs
/r/masterreturns
/r/barkour
/r/blop
/r/puppysmiles
/r/puppies
/r/petthedamndog

Breeds
/r/corgi
/r/Pitbulls
/r/goldenretrievers
/r/incorgnito
/r/babycorgis

Other
Conspiracy
/r/conspiracy
/r/skeptic
/r/karmaconspiracy
/r/UFOs
/r/conspiratard
/r/empiredidnothingwrong
/r/scp
/r/birdsarentreal
/r/conspiracytheories

Cringe
/r/cringepics
/r/cringe
/r/instant_regret
/r/blunderyears
/r/facepalm
/r/fatlogic
/r/publicfreakout
/r/actualpublicfreakouts
/r/lewronggeneration
/r/fellowkids
/r/sadcringe
/r/corporatefacepalm
/r/4PanelCringe
/r/amibeingdetained
/r/instantbarbarians
/r/watchpeopledieinside
/r/technicallythetruth
/r/accidentalracism
/r/engrish
/r/wokekids
/r/masterhacker
/r/cringetopia
/r/holup
/r/agedlikemilk
/r/tiktokcringe

Called out
/r/facepalm
/r/quityourbullshit
/r/thathappened
/r/delusionalartists
/r/oopsdidntmeanto
/r/beholdthemasterrace
/r/murderedbywords
/r/ihavesex
/r/woooosh
/r/badfaketexts
/r/boneappletea
/r/atetheonion
/r/iamatotalpieceofshit
/r/suicidebywords
/r/kamikazebywords
/r/wowthanksimcured
/r/topmindsofreddit
/r/lostredditors
/r/dontyouknowwhoiam
/r/NobodyAsked
/r/dontfundme
/r/nothingeverhappens
/r/vaxxhappened
/r/goodfaketexts
/r/delusionalcraigslist
/r/suspiciousquotes
/r/facingtheirparenting
/r/ihadastroke
/r/untrustworthypoptarts
/r/phonesarebad
/r/rareinsults
/r/clevercomebacks
/r/fuckyoukaren
/r/uselessredcircle
/r/leopardsatemyface
/r/confidentlyincorrect

"Neckbeard"
/r/niceguys
/r/mallninjashit
/r/ChoosingBeggars
/r/gatekeeping
/r/creepyasterisks
/r/inceltears
/r/humblebrag
/r/nothowdrugswork
/r/whiteknighting
/r/neckbeardrpg
/r/virginsvschad

Girls
/r/nicegirls
/r/notliketheothergirls
/r/notlikeothergirls
/r/entitledbitch

I Am Very
/r/iamverysmart
/r/iamverybadass
/r/iamveryrandom
/r/imveryedgy

Neckbeard
/r/justneckbeardthings
/r/neckbeardnests

Parents
/r/entitledparents
/r/insaneparents
/r/shitmomgroupssay

Cute
/r/aww
/r/cats
/r/animalsbeingjerks
/r/animalsbeingbros
/r/Awwducational
/r/dogs
/r/corgi
/r/thisismylifenow
/r/blep
/r/eyebeach
/r/tippytaps
/r/awww
/r/babycorgis

Disgusting/Angering/Scary/Weird (Note: Potentially NSFL)
/r/WTF
/r/DeepIntoYouTube
/r/fifthworldproblems
/r/awwwtf
/r/wellthatsucks
/r/streetfights
/r/yesyesyesyesno
/r/wtfstockphotos
/r/yesyesyesno
/r/maybemaybemaybe
/r/oddlyterrifying
/r/thatlookedexpensive
/r/wtfgaragesale
/r/Whatthefuckgetitoffme
/r/imsorryjon

Angering
/r/mildlyinfuriating
/r/crappydesign
/r/rage
/r/Bad_Cop_No_Donut
/r/gifsthatendtoosoon
/r/peoplebeingjerks
/r/casualchildabuse
/r/fuckthesepeople
/r/makemesuffer

Cursed
/r/cursedimages
/r/cursedcomments
/r/tihi
/r/blursedimages
/r/cursed_images

Blessed
/r/blessedimages

Edgy
/r/imgoingtohellforthis
/r/toosoon

Judgy
/r/trashy
/r/awfuleyebrows
/r/awfuleverything
/r/13or30
/r/ghettoglamourshots
/r/peopleofwalmart
/r/hittablefaces
/r/punchablefaces
/r/botchedsurgeries
/r/subwaycreatures

Scary (potentially NSFL)
/r/nosleep
/r/morbidreality
/r/whatcouldgowrong
/r/Glitch_in_the_Matrix
/r/Paranormal
/r/nononono
/r/horror
/r/shortscarystories
/r/lastimages
/r/peoplefuckingdying
/r/serialkillers
/r/WhyWereTheyFilming
/r/WinStupidPrizes
/r/scarysigns
/r/ghosts
/r/crimescene

Creepy
/r/creepy
/r/creepypasta
/r/creepysigns
/r/megalophobia
/r/creepyencounters

Imaginary
/r/ImaginaryMonsters
/r/ImaginaryLeviathans
/r/ImaginaryMindscapes
/r/imaginarycharacters
/r/imaginarylandscapes
/r/imaginarymaps
/r/SympatheticMonsters
/r/imaginarywesteros
/r/imaginarysliceoflife

Water is scary
/r/thalassophobia
/r/TheDepthsBelow
/r/submechanophobia

Free Stuff
/r/freebies
/r/fullmoviesonyoutube
/r/efreebies
/r/randomactsofgaming
/r/freeEbooks
/r/fullmoviesonvimeo
/r/freegamesonsteam
/r/googleplaydeals
/r/megalinks
/r/opendirectories
/r/Random_Acts_Of_Pizza
/r/coupons
/r/dealsreddit
/r/freegamefindings
/r/deals
/r/assistance
/r/free

Gender
For Men
/r/MaleFashionAdvice
/r/everymanshouldknow
/r/askmen
/r/frugalmalefashion
/r/MensRights
/r/malelifestyle
/r/trollychromosome
/r/malelivingspace
/r/malehairadvice
/r/malefashion
/r/bigdickproblems
/r/mgtow
/r/askmenover30

For Women
/r/TwoXChromosomes
/r/askwomen
/r/LadyBoners
/r/TrollXChromosomes
/r/femalefashionadvice
/r/xxfitness
/r/TheGirlSurvivalGuide
/r/abrathatfits
/r/badwomensanatomy
/r/nothowgirlswork
/r/menwritingwomen

Geography
Looking for a subreddit for your area? Try looking here! From /r/LocationReddits.
Note: Not all subreddits in that list are active.

/r/MapPorn
/r/polandball
/r/vexillology

Africa
/r/SouthAfrica

Europe
/r/europe
/r/ireland
/r/thenetherlands
/r/denmark
/r/italy
/r/norge
/r/polska
/r/suomi (Finland)
/r/romania
/r/belgium
/r/scotland
/r/austria

France
/r/france
/r/french

Germany
/r/de
/r/germany
/r/german

Russia
/r/ANormalDayInRussia
/r/youseecomrade
/r/gtaorrussia

Sweden
/r/sweden
/r/SWARJE
/r/swedishproblems
/r/intresseklubben
/r/svenskpolitik
/r/spop
/r/Allsvenskan

United Kingdom
/r/unitedkingdom
/r/britishproblems
/r/london
/r/ukpolitics
/r/casualuk

North America
Canada
/r/canada
/r/toronto
/r/vancouver
/r/canadapolitics
/r/calgary
/r/personalfinancecanada

Mexico
/r/mexico

USA: United States of America
/r/MURICA
/r/nyc
/r/chicago
/r/portland
/r/boston
/r/atlanta
/r/washingtondc
/r/philadelphia
/r/newjersey
/r/minnesota
/r/michigan

California
/r/losangeles
/r/sanfrancisco
/r/bayarea
/r/california
/r/sandiego
/r/disneyland

Colorado
/r/denver
/r/colorado

Florida
/r/floridaman
/r/waltdisneyworld

Texas
/r/austin
/r/houston
/r/texas
/r/dallas

Washington
/r/seattle
/r/SeattleWA

Oceania
/r/australia
/r/newzealand
/r/melbourne
/r/sydney

Asia
/r/Philippines
/r/india
/r/singapore
/r/china
/r/hongkong

Japan
/r/japan
/r/japanpics
/r/japantravel

Korea
/r/kpop
/r/pyongyang
/r/korea

South America
/r/brasil
/r/argentina
/r/ithadtobebrazil

Meta
/r/OutOfTheLoop
/r/nocontext
/r/tldr
/r/Enhancement
/r/SecretSanta
/r/MuseumOfReddit
/r/theoryofreddit
/r/threadkillers
/r/evenwithcontext
/r/beetlejuicing
/r/redditinreddit

Administrative
/r/announcements
/r/blog
/r/beta
/r/help

April Fools
/r/place
/r/sequence
/r/thebutton
/r/circleoftrust

Apps
/r/baconreader
/r/alienblue
/r/baconit
/r/redditsync
/r/relayforreddit
/r/apolloapp
/r/redditmobile

Circlejerks
/r/Circlejerk
/r/DiWHY
/r/frugal_jerk
/r/moviescirclejerk

Drama
/r/SubredditDrama
/r/drama
/r/hobbydrama
/r/rbi

Negative
/r/ShitRedditSays
/r/karmaconspiracy
/r/undelete
/r/jesuschristreddit
/r/karmacourt
/r/titlegore
/r/ShitAmericansSay
/r/againsthatesubreddits

Positive
/r/bestof
/r/DepthHub
/r/BestOfReports
/r/bestoflegaladvice
/r/punpatrol
/r/redditsings

Subreddits
/r/subredditoftheday
/r/wowthissubexists
/r/newreddits
/r/ofcoursethatsathing
/r/findareddit

Moderating
/r/modnews
/r/redditrequest

Subreddit Simulator
/r/subredditsimulator
/r/subredditsimmeta

General
/r/TrueReddit
/r/awesome

Looking for something
/r/TipOfMyTongue
/r/TipOfMyPenis (NSFW)

Mind blowing
/r/woahdude
/r/frisson
/r/asmr
/r/VaporwaveAesthetics
/r/glitchinthematrix

Nature
/r/earthporn
/r/hardcoreaww
/r/hitmanimals
/r/natureisfuckinglit
/r/heavyseas

Plants/Fungi
/r/marijuanaenthusiasts
/r/succulents
/r/mycology
/r/bonsai
/r/TreesSuckingOnThings
/r/houseplants

Violent Nature
/r/natureismetal
/r/Natureisbrutal
/r/naturewasmetal

Weather
/r/weathergifs
/r/tropicalweather

News/Politics
News
/r/worldnews
/r/news
/r/nottheonion
/r/UpliftingNews
/r/offbeat
/r/gamernews
/r/floridaman
/r/energy
/r/syriancivilwar
/r/truecrime

Fake News
/r/TheOnion
/r/AteTheOnion

Politics
See here.

Nostalgia/Time
/r/OldSchoolCool
/r/TheWayWeWere
/r/nostalgia
/r/vinyl
/r/forwardsfromgrandma
/r/oldphotosinreallife

Parodies
/r/firstworldanarchists
/r/wheredidthesodago
/r/unexpectedthuglife
/r/youdontsurf
/r/montageparodies
/r/outside
/r/OSHA
/r/hailcorporate
/r/im14andthisisdeep
/r/bollywoodrealism
/r/AccidentalRenaissance
/r/maliciouscompliance
/r/fakehistoryporn
/r/coaxedintoasnafu
/r/irleastereggs

SFWPorn Network
SFWPorn Network wiki from multi by /u/kjoneslol.
See more here! Via /r/sfwpornnetwork.

/r/EarthPorn
/r/HistoryPorn
/r/FoodPorn
/r/JusticePorn
/r/AbandonedPorn
/r/SpacePorn
/r/RoomPorn
/r/QuotesPorn
/r/MapPorn
/r/CityPorn
/r/carporn
/r/humanporn
/r/penmanshipporn
/r/militaryporn
/r/DesignPorn
/r/ThingsCutInHalfPorn
/r/ArchitecturePorn
/r/ExposurePorn
/r/futureporn
/r/adrenalineporn
/r/waterporn
/r/machineporn
/r/animalporn
/r/movieposterporn
/r/illusionporn
/r/destructionporn
/r/adporn
/r/artefactporn
/r/gunporn
/r/skyporn
/r/powerwashingporn
/r/ArtPorn
/r/InfrastructurePorn
/r/VillagePorn
/r/shockwaveporn
/r/productporn
/r/macroporn
/r/cabinporn
/r/houseporn
/r/mineralporn
/r/microporn

Shitty
/r/shittyaskscience
/r/shittyfoodporn
/r/shittyreactiongifs
/r/crappydesign
/r/Shitty_Car_Mods
/r/shittyadvice
/r/shittyrobots
/r/ShittyLifeProTips
/r/shittykickstarters
/r/shittyanimalfacts
/r/shitpost
/r/shittymoviedetails

Unexpected
/r/unexpected
/r/UnexpectedThugLife
/r/misleadingthumbnails
/r/unexpectedjihad
/r/slygifs
/r/blackmagicfuckery
/r/unexpectedhogwarts
/r/UnexpectedMulaney

Visually Appealing
/r/AbandonedPorn
/r/OddlySatisfying
/r/RoomPorn
/r/nonononoyes
/r/minimalism
/r/CityPorn
/r/penmanshipporn
/r/Cinemagraphs
/r/ImaginaryLandscapes
/r/eyebleach
/r/DesignPorn
/r/perfectloops
/r/perfectfit
/r/humansbeingbros
/r/powerwashingporn
/r/nevertellmetheodds
/r/typography
/r/cozyplaces
/r/breathinginformation
/r/desirepath
/r/tiltshift
/r/mostbeautiful
/r/AmateurRoomPorn
/r/slygifs
/r/raining
/r/AccidentalWesAnderson
/r/unstirredpaint
/r/handwriting
/r/thatpeelingfeeling
/r/gtage
/r/satisfyingasfuck

Hold My ____
/r/holdmybeer
/r/holdmyjuicebox
/r/holdmyfries
/r/holdmybeaker
/r/holdmycosmo
/r/holdmycatnip
/r/holdmyredbull
/r/holdmyfeedingtube

Weird Feelings/Categorize Later
/r/fiftyfifty
/r/firstworldproblems
/r/idiotsfightingthings
/r/whatsinthisthing see also: related subreddits from /r/AskReddit
/r/notinteresting
/r/fifthworldpics
/r/drunkorakid
/r/pussypassdenied
/r/UNBGBBIIVCHIDCTIICBG
/r/Justfuckmyshitup
/r/BestOfStreamingVideo
/r/CatastrophicFailure
/r/evilbuildings
/r/urbanhell
/r/justiceserved
/r/mypeopleneedme
/r/notmyjob
/r/onejob
/r/sweatypalms
/r/therewasanattempt
/r/bitchimabus
/r/greendawn
/r/thingsforants
/r/youseeingthisshit
/r/hmmm
/r/hadtohurt
/r/MandelaEffect
/r/mildlypenis
/r/redditdayof
/r/instantkarma
/r/2healthbars
/r/collapse
/r/slavs_squatting
/r/confusing_perspective
/r/the_pack
/r/unpopularopinion
/r/okbuddyretard
/r/nextfuckinglevel
/r/ooer
/r/happycryingdads
/r/FullScorpion
/r/instantregret
/r/MildlyVandalised
/r/watchpeoplesurvive
/r/tendies
/r/dontputyourdickinthat
/r/whatintarnation
/r/tworedditorsonecup
/r/ExpandDong
/r/wackytictacs
/r/halloween
/r/whatcouldgoright
/r/hmmmgifs
/r/bizarrebuildings
/r/inclusiveor
/r/lostgeneration
/r/kurzgesagt
/r/boop
/r/fightporn
/r/tooktoomuch
/r/humansaremetal
/r/theyknew
/r/fbiopenup
/r/fuckyouinparticular
/r/idiotsnearlydying
/r/AAAAAAAAAAAAAAAAA
/r/chaoticgood
/r/prisonwallet

Ex 50k+
/r/mindcrack
/r/twitchplayspokemon
/r/battlefield3
/r/punchablefaces
/r/csgobetting
/r/historicalwhatif

NSFW (Porn)
See here.

Defunct
See here.

Last revised by IranianGenius
 - 10 months ago
ABOUT COMMUNITY

Looking for a certain subreddit, or just trying to browse new subreddits? Find many lists of subreddits here at /r/ListOfSubreddits!
129k
Members
0
Online
Created Jul 29, 2014
Create Post
COMMUNITY OPTIONS
R/LISTOFSUBREDDITS RULES
1.
Advertising your own subreddit here will get you banned
2.
Include a list in your post
MODERATORS
Message the mods
u/IranianGenius
u/IranianGenius2
u/roastedlasagna
u/kamahaoma
u/Watchful1
VIEW ALL MODERATORS
Help
Reddit Coins
Reddit Premium
Reddit Gifts
About
Careers
Press
Advertise
Blog
Terms
Content Policy
Privacy Policy
Mod Policy
Reddit Inc © 2021 . All rights reserved
Back to Top
'''

subreddit_list = re.findall(r'\/r\/(.+)', page_raw)

print(len(subreddit_list))
