import praw

reddit = praw.Reddit(
    client_id='l21MVg2tp7sehA',
    client_secret='IrsBqAAJtm2rdFBB_opJ-PqVq0IE2A',
    user_agent='leesang627_messagebot',
    username='leesang627',
    password='&g*G5hbCb',
    ratelimit_seconds=10,
)

# reddit = praw.Reddit(
#     client_id='tvP60525vaRBhA',
#     client_secret='J4yygRJ5fqlLNNDqwp7P2zDy60sZdw',
#     user_agent='woogler6682_messagebot',
#     username='woogler6682',
#     password='P^#2S3orS!j'
# )

large_subreddit_list_1 = ['natureismetal', 'SkincareAddiction', 'therewasanattempt', 'trashy', 'Rainbow6',
                          'leagueoflegends', 'WatchPeopleDieInside', 'science', 'Unexpected', 'Documentaries', 'math',
                          'UnresolvedMysteries', 'niceguys', 'quityourbullshit', 'pokemongo', 'LegalTeens', 'biology',
                          'loseit', 'instant_regret', 'keto', 'Fitness', 'PUBATTLEGROUNDS', 'HistoryPorn',
                          'MovieDetails',
                          'HumansBeingBros', 'HomeImprovement', 'WTF', 'philosophy', 'raspberry_pi', 'gaming',
                          'comedyheaven', 'NintendoSwitch', 'trees', 'history', 'photoshopbattles', 'atheism', 'nasa',
                          'DunderMifflin', 'PublicFreakout', 'PetiteGoneWild', 'holdmycosmo', 'Eyebleach',
                          'InternetIsBeautiful', 'AmItheAsshole', 'sex', 'insanepeoplefacebook', 'creepy',
                          'listentothis',
                          'food', 'mildlyinfuriating']

large_subreddit_list_2 = ['PerfectTiming', 'wallpaper', 'offmychest', 'assholedesign', '2meirl4meirl',
                          'UnethicalLifeProTips', 'dataisbeautiful', 'nextfuckinglevel', 'lifehacks', 'hearthstone',
                          'FortNiteBR', 'nsfw', 'xboxone', 'MakeupAddiction', 'freefolk', 'programming', 'BeAmazed',
                          'coolguides', 'instantkarma', 'rareinsults', 'dogs', 'reactiongifs', 'nevertellmetheodds',
                          'Futurology', 'legaladvice', 'ShittyLifeProTips', 'WeAreTheMusicMakers',
                          'technicallythetruth', 'GetMotivated', 'MaliciousCompliance', 'YouShouldKnow', 'crafts',
                          'holdmybeer', 'pcgaming', 'AnimalsBeingBros', 'AnimalsBeingDerps', 'wow', 'tifu',
                          'askscience', 'streetwear', 'UpliftingNews', 'NatureIsFuckingLit', 'iamverysmart',
                          'Cinemagraphs', 'TrollYChromosome', 'dating_advice', 'ATBGE', 'blog', 'writing', 'technology']

middle_subreddit_list_1 = ['forcedcreampie', 'beerporn', 'indianpeoplefacebook', 'ImaginaryTechnology',
                           'talesfromtechsupport', 'ItemShop', 'MkeBucks', 'Pegging', 'Marvel', 'virginvschad',
                           'WhyWereTheyFilming', 'holdmyfeedingtube', 'shortcuts', 'catsareliquid', 'LetsTalkMusic',
                           'blunderyears', 'datgap', 'CatsISUOTTATFO', 'AdrianaChechik', 'ireland', 'islam', 'pornvids',
                           'youdontsurf', 'orgasmiccontractions', 'germany', 'phgonewild', 'China_Flu', 'TheWayWeWere',
                           'marijuanaenthusiasts', 'NeckbeardNests', 'slammywhammies', 'smallboobs', 'The_Mueller',
                           'holdmyjuicebox', 'Undertale', 'de_IAmA', 'raining', 'MyPeopleNeedMe', 'PUBG', 'howyoudoin',
                           'Justfuckmyshitup', 'GlobalOffensiveTrade', 'Cuckold', 'YouSeeComrade', 'Monero',
                           'assassinscreed', 'datascience', 'TinyTits', 'philadelphia', 'trashpandas',
                           'dogquest', 'MadeChina', 'SkyClan', 'HumansBeingAnimals', 'ObscureFilmClub',
                           'winkhub', 'cssroztest', 'Have_Fun', 'LethalLeagueLadder',
                           'im3', 'Gereshes', 'trolling_Jagex',
                           'fallout_neworleans', 'ChanelNoir', 'TheFarmingGame', 'buddhistcults', 'Caughtnaked',
                           'Clickwise', 'Estrangedstuff', 'DerHofer', 'cosplaycup', 'diepFlairTesting', 'DrugSynthesis',
                           'ABLaw', 'FoxPrivate', 'PharmacyResidency', 'sexyvixens', 'IconJar', 'Su_tart', 'CuntClub',
                           'LSML', 'sludgezone', 'behavioural_analytics', 'CapitalistVictims', 'gametokers',
                           'LyricInterpretation', 'yankjauhyayank', 'rslashwooshr', 'yeahrightman', 'Gorepics',
                           'newgamemusic', 'ESPN_NEWS', 'requelmemes']

subject = 'Looking for Reddit moderators to participate in an online user study (20$/hr, ~2hrs)'
content = '''Hi Reddit moderators, We are a group of online community researchers at DGIST(https://dgist.ac.kr/en/) and KAIST(https://www.kaist.ac.kr/), South Korea.

We are looking for Reddit moderators who can participate in an online user study to test our built AutoMod Sandbox Tool.

We are conducting an online user study with a prototype tool we built to overcome challenges with testing AutoMod configurations. We would really appreciate your participation in our study to use our prototype tool and answer questions related to its usability. The study will take approximately 2 hours to complete with a reward of 20$/hr. If it takes longer, we will pay for the exceeded time.

The whole session will be recorded (with the camera turn off), but only for research purposes and will not be shared with anyone besides the team, and will be discarded right after the research. You can participate between 8/21 - 8/25. Please sign up at https://forms.gle/kxoRjNkeoKjcg3eP9 if you are interested!

If you have any questions, please feel free to contact us: Jean Young Song: jeansong@dgist.ac.kr

We uploaded information about our project and Reddit username to the lab website temporarily to prove our identity. https://www.kixlab.org/projects/

you can find the link to this lab website on the official KAIST CS website. https://cs.kaist.ac.kr/research/interaccom

Thank you!
'''
for count, subreddit_name in enumerate(middle_subreddit_list_1):
    if count >= 60:
        print(count, subreddit_name)
        reddit.subreddit(subreddit_name).message(subject, content)
